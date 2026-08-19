// 데이터 구조는 docs/kopick-product-design.md 5번 항목(상품 데이터 구조)을 그대로 반영한다.
// 지금은 mock 데이터로 채우지만, 필드 형태는 이후 Supabase 테이블/쿼리 결과와 1:1로 맞도록 설계했다.

export type AsGrade = "S" | "A" | "B" | "C";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

// 랭킹 탭 하나 = 서브 스코어에 적용하는 가중치 프리셋 하나 (설계 문서 7번 항목)
export type RankingTabKey =
  | "comprehensive"
  | "costEfficiency"
  | "performance"
  | "review"
  | "battery";

export type WeightProfile = Record<
  "performance" | "costEfficiency" | "reviewSatisfaction" | "battery" | "asService",
  number
>;

// 실제 제조사 스펙 원본값 (정규화 이전)
export type ProductSpecs = {
  suctionPowerAW: number; // 흡입력 (Air Watt)
  batteryMinutes: number; // 최대 사용 시간 (분)
  chargeHours: number; // 완충 시간 (시간)
  weightKg: number; // 본체 무게 (kg)
  dustCapacityL: number; // 먼지통 용량 (L)
};

export type RetailerOffer = {
  name: "coupang" | "naver";
  label: string;
  price: number;
  url: string; // MVP 단계에서는 실제 제휴 딥링크가 아닌 목업 URL
  inStock: boolean;
};

export type ReviewSummary = {
  avgRating: number; // 5점 만점
  reviewCount: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  summaryText: string;
};

export type AsInfo = {
  warrantyMonths: number;
  serviceCenterCount: number;
  grade: AsGrade;
};

// 서브 스코어 (0~100, 카테고리 내 상대 정규화 결과) - lib/scoring.ts 에서 계산
export type SubScores = {
  performance: number;
  costEfficiency: number;
  reviewSatisfaction: number;
  battery: number;
  asService: number;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  brand: string;
  price: number;
  releaseYear: number;
  specs: ProductSpecs;
  retailers: RetailerOffer[];
  reviews: ReviewSummary;
  as: AsInfo;
  dataConfidence: number; // 0~1, 데이터 결측치가 많을수록 낮음
  imageUrl?: string; // 없으면 브랜드 이니셜 그라디언트 플레이스홀더로 대체 표시
};

// 정규화된 서브 스코어 + 총점까지 계산이 끝난 상품 (리스트/상세 화면에서 사용)
export type ScoredProduct = Product & {
  subScores: SubScores;
};

export type RankedProduct = ScoredProduct & {
  kopickScore: number;
  grade: string;
  rank: number;
};
