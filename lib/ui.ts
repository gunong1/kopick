// 상품 이미지가 없는 mock 데이터용 — 브랜드명을 해시해 일관된 그라디언트 색을 만든다.
export function brandHue(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export type ScoreTone = "excellent" | "good" | "fair" | "low";

export const TONE_CLASSES: Record<ScoreTone, { bg: string; text: string; ring: string; bar: string }> = {
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", bar: "#10b981" },
  good: { bg: "bg-brand-50", text: "text-brand-700", ring: "ring-brand-200", bar: "#3b63f2" },
  fair: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", bar: "#d97706" },
  low: { bg: "bg-gray-100", text: "text-gray-600", ring: "ring-gray-200", bar: "#6b7280" },
};

export function toneFromScore(score: number): ScoreTone {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "fair";
  return "low";
}
