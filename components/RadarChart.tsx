import { SubScores } from "@/lib/types";

const AXES: { key: keyof SubScores; label: string }[] = [
  { key: "performance", label: "성능" },
  { key: "costEfficiency", label: "가성비" },
  { key: "reviewSatisfaction", label: "리뷰만족도" },
  { key: "battery", label: "배터리" },
  { key: "asService", label: "AS/내구성" },
];

const SIZE = 240;
const CENTER = SIZE / 2;
const MAX_R = 82;

function pointAt(index: number, ratio: number) {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
  const r = MAX_R * ratio;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function polygonPoints(ratios: number[]) {
  return ratios.map((r, i) => { const p = pointAt(i, r); return `${p.x},${p.y}`; }).join(" ");
}

export function RadarChart({ subScores }: { subScores: SubScores }) {
  const ratios = AXES.map((a) => Math.min(1, Math.max(0, subScores[a.key] / 100)));
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-64 w-64">
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={polygonPoints(AXES.map(() => level))}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}
      {AXES.map((axis, i) => {
        const outer = pointAt(i, 1);
        return <line key={axis.key} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth={1} />;
      })}
      <polygon points={polygonPoints(ratios)} fill="#3b63f2" fillOpacity={0.22} stroke="#3b63f2" strokeWidth={2} />
      {ratios.map((r, i) => {
        const p = pointAt(i, r);
        return <circle key={AXES[i].key} cx={p.x} cy={p.y} r={3} fill="#2745e6" />;
      })}
      {AXES.map((axis, i) => {
        const p = pointAt(i, 1.28);
        const anchor = p.x < CENTER - 8 ? "end" : p.x > CENTER + 8 ? "start" : "middle";
        return (
          <text
            key={axis.key}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-gray-600"
            fontSize={11}
            fontWeight={600}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
