import { toneFromScore, TONE_CLASSES } from "@/lib/ui";

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const tone = toneFromScore(score);
  const cls = TONE_CLASSES[tone];
  const sizeClass = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-base" }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full ring-2 font-bold ${cls.bg} ${cls.text} ${cls.ring} ${sizeClass}`}
      title={`KOPICK Score ${score}점`}
    >
      <span className="leading-none">{score}</span>
    </div>
  );
}
