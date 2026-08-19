import { Product, RankedProduct, RankingTabKey, ScoredProduct, SubScores, WeightProfile } from "./types";

// ---------------------------------------------------------------------------
// KOPICK Score 엔진
// 설계 문서(docs/kopick-product-design.md) 6, 7번 항목을 그대로 구현한다.
//
// 핵심 아이디어:
// 1) 카테고리 내 상품군을 기준으로 각 스펙을 상대적으로(percentile) 정규화해
//    서브 스코어(성능/가성비/리뷰만족도/배터리/AS)를 만든다.
// 2) "종합/가성비/성능/리뷰/배터리" 랭킹 탭은 전부 같은 서브 스코어 데이터셋에
//    서로 다른 가중치 프리셋(WEIGHT_PROFILES)을 곱한 재정렬 뷰일 뿐이다.
// 3) 광고 관련 필드는 이 계산에 절대 들어가지 않는다.
// ---------------------------------------------------------------------------

export const WEIGHT_PROFILES: Record<RankingTabKey, WeightProfile> = {
  comprehensive: { performance: 30, costEfficiency: 20, reviewSatisfaction: 20, battery: 20, asService: 10 },
  costEfficiency: { performance: 15, costEfficiency: 60, reviewSatisfaction: 10, battery: 10, asService: 5 },
  performance: { performance: 60, costEfficiency: 10, reviewSatisfaction: 15, battery: 10, asService: 5 },
  review: { performance: 10, costEfficiency: 10, reviewSatisfaction: 65, battery: 10, asService: 5 },
  battery: { performance: 15, costEfficiency: 10, reviewSatisfaction: 10, battery: 60, asService: 5 },
};

export const RANKING_TABS: { key: RankingTabKey; label: string; description: string }[] = [
  { key: "comprehensive", label: "종합 순위", description: "성능·가성비·리뷰·배터리·AS를 균형 있게 반영" },
  { key: "costEfficiency", label: "가성비 순위", description: "가격 대비 성능이 뛰어난 상품 우선" },
  { key: "performance", label: "성능 순위", description: "흡입력 등 핵심 성능 지표 우선" },
  { key: "review", label: "리뷰 만족도 순위", description: "실사용자 평점·리뷰 신뢰도 우선" },
  { key: "battery", label: "배터리 순위", description: "사용시간·충전시간 우선" },
];

const AS_GRADE_SCORE: Record<string, number> = { S: 100, A: 82, B: 62, C: 40 };

function percentileScore(values: number[], value: number, higherIsBetter = true): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const countBelowOrEqual = sorted.filter((v) => v <= value).length;
  let percentile = (countBelowOrEqual / sorted.length) * 100;
  if (!higherIsBetter) percentile = 100 - percentile;
  return Math.round(Math.min(100, Math.max(0, percentile)));
}

// 리뷰 수가 적은 상품이 5점 만점으로 랭킹을 왜곡하는 것을 막기 위한 베이지안 보정
function bayesianRating(avgRating: number, reviewCount: number, priorMean = 4.2, priorCount = 25): number {
  return (priorCount * priorMean + reviewCount * avgRating) / (priorCount + reviewCount);
}

/**
 * 카테고리(상품군) 전체를 받아 각 상품의 서브 스코어(0~100)를 계산한다.
 * 반드시 같은 카테고리 상품끼리 한 번에 넘겨야 상대 정규화가 의미를 가진다.
 */
export function computeSubScoresForCategory(products: Product[]): Map<string, SubScores> {
  const suctionValues = products.map((p) => p.specs.suctionPowerAW);
  const dustValues = products.map((p) => p.specs.dustCapacityL);
  const chargeValues = products.map((p) => p.specs.chargeHours);
  const batteryValues = products.map((p) => p.specs.batteryMinutes);
  const warrantyValues = products.map((p) => p.as.warrantyMonths);
  const centerValues = products.map((p) => p.as.serviceCenterCount);
  const bayesianValues = products.map((p) => bayesianRating(p.reviews.avgRating, p.reviews.reviewCount));

  // 성능 원점수(0~100)를 먼저 구해야 가성비(성능/가격) 계산이 가능하다.
  const performanceRaw = products.map((p) => {
    const suction = percentileScore(suctionValues, p.specs.suctionPowerAW, true);
    const dust = percentileScore(dustValues, p.specs.dustCapacityL, true);
    const charge = percentileScore(chargeValues, p.specs.chargeHours, false);
    return suction * 0.6 + dust * 0.25 + charge * 0.15;
  });

  const costRatios = products.map((p, i) => performanceRaw[i] / p.price);

  const result = new Map<string, SubScores>();

  products.forEach((p, i) => {
    const performance = Math.round(performanceRaw[i]);
    const costEfficiency = percentileScore(costRatios, costRatios[i], true);

    const battery =
      Math.round(
        percentileScore(batteryValues, p.specs.batteryMinutes, true) * 0.7 +
          percentileScore(chargeValues, p.specs.chargeHours, false) * 0.3
      ) || 0;

    const asRaw =
      percentileScore(warrantyValues, p.as.warrantyMonths, true) * 0.35 +
      percentileScore(centerValues, p.as.serviceCenterCount, true) * 0.35 +
      AS_GRADE_SCORE[p.as.grade] * 0.3;
    const asService = Math.round(asRaw);

    const reviewSatisfaction = percentileScore(bayesianValues, bayesianRating(p.reviews.avgRating, p.reviews.reviewCount), true);

    result.set(p.id, { performance, costEfficiency, reviewSatisfaction, battery, asService });
  });

  return result;
}

export function attachSubScores(products: Product[]): ScoredProduct[] {
  const subScoreMap = computeSubScoresForCategory(products);
  return products.map((p) => ({ ...p, subScores: subScoreMap.get(p.id)! }));
}

export function computeKopickScore(subScores: SubScores, weights: WeightProfile): number {
  const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const total =
    subScores.performance * weights.performance +
    subScores.costEfficiency * weights.costEfficiency +
    subScores.reviewSatisfaction * weights.reviewSatisfaction +
    subScores.battery * weights.battery +
    subScores.asService * weights.asService;
  return Math.round(total / weightSum);
}

export function scoreGrade(score: number): { label: string; tone: "excellent" | "good" | "fair" | "low" } {
  if (score >= 85) return { label: "매우 합리적", tone: "excellent" };
  if (score >= 70) return { label: "합리적", tone: "good" };
  if (score >= 55) return { label: "보통", tone: "fair" };
  return { label: "신중한 검토 필요", tone: "low" };
}

/**
 * 특정 랭킹 탭(가중치 프리셋) 기준으로 카테고리 상품을 정렬하고 순위를 매긴다.
 */
export function rankByTab(products: ScoredProduct[], tab: RankingTabKey): RankedProduct[] {
  const weights = WEIGHT_PROFILES[tab];
  return [...products]
    .map((p) => {
      const kopickScore = computeKopickScore(p.subScores, weights);
      return { ...p, kopickScore, grade: scoreGrade(kopickScore).label, rank: 0 };
    })
    .sort((a, b) => b.kopickScore - a.kopickScore)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}
