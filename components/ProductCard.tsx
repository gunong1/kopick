"use client";

import { formatWon } from "@/lib/format";
import { ScoredProduct } from "@/lib/types";
import { MAX_COMPARE, useCompare } from "@/lib/compare-store";
import { Battery, Star, Wind } from "lucide-react";
import Link from "next/link";
import { ProductThumb } from "./ProductThumb";
import { ScoreBadge } from "./ScoreBadge";

export function ProductCard({
  product,
  score,
  rank,
  showCompareToggle = true,
  compact = false,
}: {
  product: ScoredProduct;
  score: number;
  rank?: number;
  showCompareToggle?: boolean;
  compact?: boolean;
}) {
  const { isSelected, toggle, isFull } = useCompare();
  const selected = isSelected(product.id);
  const disabledToggle = !selected && isFull;

  return (
    <div className={`card group relative flex flex-col overflow-hidden transition hover:shadow-cardHover ${compact ? "w-56 shrink-0" : ""}`}>
      <Link href={`/product/${product.id}`} className="relative block p-3 pb-0">
        {rank !== undefined && (
          <span className="absolute left-5 top-5 z-10 flex h-7 min-w-7 items-center justify-center rounded-lg bg-gray-900/85 px-1.5 text-xs font-extrabold text-white">
            #{rank}
          </span>
        )}
        <ProductThumb brand={product.brand} imageUrl={product.imageUrl} size={compact ? "sm" : "md"} className={compact ? "" : ""} />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.id}`} className="min-w-0">
            <p className="truncate text-xs font-medium text-gray-400">{product.brand}</p>
            <p className="truncate text-sm font-bold text-gray-900">{product.name}</p>
          </Link>
          <ScoreBadge score={score} size="sm" />
        </div>

        <p className="text-base font-extrabold text-gray-900">{formatWon(product.price)}</p>

        {product.dataConfidence < 0.85 && (
          <span className="chip w-fit !border-amber-200 !bg-amber-50 !text-amber-700">정보 확인 중</span>
        )}

        {!compact && (
          <div className="flex flex-wrap gap-1.5">
            <span className="chip">
              <Wind className="h-3 w-3" /> 흡입력 {product.specs.suctionPowerAW}AW
            </span>
            <span className="chip">
              <Battery className="h-3 w-3" /> {product.specs.batteryMinutes}분
            </span>
            <span className="chip">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.reviews.avgRating.toFixed(1)} (
              {product.reviews.reviewCount.toLocaleString("ko-KR")})
            </span>
          </div>
        )}

        {showCompareToggle && (
          <label
            className={`mt-auto flex items-center gap-2 pt-2 text-xs font-medium ${
              disabledToggle ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-gray-500"
            }`}
          >
            <input
              type="checkbox"
              checked={selected}
              disabled={disabledToggle}
              onChange={() => toggle(product.id)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 disabled:cursor-not-allowed"
            />
            비교 담기 {disabledToggle && `(최대 ${MAX_COMPARE}개)`}
          </label>
        )}
      </div>
    </div>
  );
}
