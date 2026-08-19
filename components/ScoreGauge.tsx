import { scoreGrade } from "@/lib/scoring";
import { toneFromScore, TONE_CLASSES } from "@/lib/ui";

export function ScoreGauge({ score }: { score: number }) {
  const tone = toneFromScore(score);
  const cls = TONE_CLASSES[tone];
  const grade = scoreGrade(score);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={cls.bar}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-900">{score}</span>
          <span className="text-[11px] font-medium text-gray-400">/ 100</span>
        </div>
      </div>
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${cls.bg} ${cls.text}`}>{grade.label}</span>
    </div>
  );
}
