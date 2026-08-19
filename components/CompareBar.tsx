"use client";

import { useCompare } from "@/lib/compare-store";
import { findProductRawById } from "@/lib/data";
import { X } from "lucide-react";
import Link from "next/link";

export function CompareBar() {
  const { ids, remove, clear } = useCompare();

  if (ids.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="container-page flex flex-wrap items-center gap-3 py-3">
        <p className="text-sm font-semibold text-gray-700">
          비교함 <span className="text-brand-600">{ids.length}</span>개 담김
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ids.map((id) => (
            <span key={id} className="chip">
              {findProductRawById(id)?.name ?? id}
              <button onClick={() => remove(id)} aria-label="비교함에서 제거">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={clear} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
            전체 삭제
          </button>
          <Link href="/compare" className="btn-primary !px-4 !py-2 text-sm">
            비교하기
          </Link>
        </div>
      </div>
    </div>
  );
}
