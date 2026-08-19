"use client";

import { useCompare } from "@/lib/compare-store";
import { Scale } from "lucide-react";
import Link from "next/link";

export function CompareIndicatorLink() {
  const { ids } = useCompare();

  return (
    <Link
      href="/compare"
      className="relative inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
    >
      <Scale className="h-4 w-4" />
      <span className="hidden sm:inline">비교함</span>
      {ids.length > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
          {ids.length}
        </span>
      )}
    </Link>
  );
}
