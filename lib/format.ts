export function formatWon(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatCompactCount(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}만`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}천`;
  return `${value}`;
}
