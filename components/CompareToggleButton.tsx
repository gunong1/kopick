"use client";

import { MAX_COMPARE, useCompare } from "@/lib/compare-store";
import { Check, Scale } from "lucide-react";

export function CompareToggleButton({ productId }: { productId: string }) {
  const { isSelected, toggle, isFull } = useCompare();
  const selected = isSelected(productId);
  const disabled = !selected && isFull;

  return (
    <button
      onClick={() => toggle(productId)}
      disabled={disabled}
      className={`btn-secondary ${selected ? "!border-brand-600 !bg-brand-50 !text-brand-700" : ""}`}
    >
      {selected ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
      {selected ? "비교함에 담김" : disabled ? `비교함 가득 참 (최대 ${MAX_COMPARE}개)` : "비교함에 담기"}
    </button>
  );
}
