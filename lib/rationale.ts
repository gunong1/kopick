import { SubScores } from "./types";

const LABELS: Record<keyof SubScores, string> = {
  performance: "성능",
  costEfficiency: "가성비",
  reviewSatisfaction: "리뷰 만족도",
  battery: "배터리",
  asService: "AS/내구성",
};

/**
 * 실제 서비스에서는 이 문장을 리뷰/스펙 데이터를 근거로 AI가 생성하지만(설계 문서 6번 항목),
 * 프로토타입 단계에서는 서브 스코어 분포를 바탕으로 동일한 로직을 규칙 기반으로 흉내 낸다.
 */
export function buildScoreRationale(subScores: SubScores): string {
  const entries = Object.entries(subScores) as [keyof SubScores, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const [top1, top2] = sorted;
  const bottom = sorted[sorted.length - 1];

  const strengths = `${LABELS[top1[0]]}(${top1[1]}점)과 ${LABELS[top2[0]]}(${top2[1]}점)`;
  const weakness = `${LABELS[bottom[0]]}(${bottom[1]}점)`;

  if (bottom[1] >= 70) {
    return `모든 항목이 고르게 우수합니다. 특히 ${strengths} 항목에서 높은 점수를 받았습니다.`;
  }
  return `${strengths} 항목에서 특히 높은 점수를 받았지만, ${weakness} 항목은 상대적으로 아쉬운 편입니다.`;
}
