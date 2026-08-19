"use client";

import { BuyButtonGroup } from "@/components/BuyButtonGroup";
import { ProductThumb } from "@/components/ProductThumb";
import { ScoreBadge } from "@/components/ScoreBadge";
import { formatWon } from "@/lib/format";
import { computeKopickScore, WEIGHT_PROFILES } from "@/lib/scoring";
import { ScoredProduct } from "@/lib/types";
import { X } from "lucide-react";
import Link from "next/link";
import { useCompare } from "@/lib/compare-store";

const ROWS: { label: string; render: (p: ScoredProduct, score: number) => React.ReactNode }[] = [
  { label: "KOPICK Score", render: (_p, score) => <ScoreBadge score={score} /> },
  { label: "가격", render: (p) => <span className="font-bold text-gray-900">{formatWon(p.price)}</span> },
  { label: "성능 점수", render: (p) => `${p.subScores.performance}점` },
  { label: "가성비 점수", render: (p) => `${p.subScores.costEfficiency}점` },
  { label: "리뷰 만족도 점수", render: (p) => `${p.subScores.reviewSatisfaction}점` },
  { label: "배터리 점수", render: (p) => `${p.subScores.battery}점` },
  { label: "AS/내구성 점수", render: (p) => `${p.subScores.asService}점` },
  { label: "흡입력", render: (p) => `${p.specs.suctionPowerAW} AW` },
  { label: "사용 시간", render: (p) => `${p.specs.batteryMinutes}분` },
  { label: "무게", render: (p) => `${p.specs.weightKg}kg` },
  { label: "리뷰", render: (p) => `★ ${p.reviews.avgRating.toFixed(1)} (${p.reviews.reviewCount.toLocaleString("ko-KR")})` },
  { label: "무상보증", render: (p) => `${p.as.warrantyMonths}개월 · 서비스센터 ${p.as.serviceCenterCount}곳` },
];

export function CompareTable({ products }: { products: ScoredProduct[] }) {
  const { remove } = useCompare();

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-gray-100 p-4 text-left text-xs font-bold text-gray-400">항목</th>
            {products.map((p) => (
              <th key={p.id} className="min-w-[220px] border-b border-gray-100 p-4 text-left align-top">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <ProductThumb brand={p.brand} imageUrl={p.imageUrl} size="sm" />
                  <button onClick={() => remove(p.id)} aria-label={`${p.name} 비교에서 제거`} className="text-gray-300 hover:text-gray-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Link href={`/product/${p.id}`} className="block">
                  <p className="text-xs font-medium text-gray-400">{p.brand}</p>
                  <p className="text-sm font-extrabold text-gray-900">{p.name}</p>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="odd:bg-gray-50/60">
              <th className="p-4 text-left text-xs font-semibold text-gray-500">{row.label}</th>
              {products.map((p) => (
                <td key={p.id} className="p-4 font-medium text-gray-700">
                  {row.render(p, computeKopickScore(p.subScores, WEIGHT_PROFILES.comprehensive))}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th className="p-4 text-left text-xs font-semibold text-gray-500">구매하기</th>
            {products.map((p) => (
              <td key={p.id} className="p-4">
                <BuyButtonGroup retailers={p.retailers} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
