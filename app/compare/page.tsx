"use client";

import { CompareTable } from "@/components/CompareTable";
import { getScoredProductById } from "@/lib/data";
import { useCompare } from "@/lib/compare-store";
import { ScoredProduct } from "@/lib/types";
import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const { ids, clear } = useCompare();
  const [products, setProducts] = useState<ScoredProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(ids.map((id) => getScoredProductById(id))).then((results) => {
      if (cancelled) return;
      setProducts(results.filter((r): r is NonNullable<typeof r> => r !== null).map((r) => r.product));
    });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div className="container-page py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">상품 비교</h1>
        {ids.length > 0 && (
          <button onClick={clear} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
            비교함 비우기
          </button>
        )}
      </div>

      {ids.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-16 text-center">
          <PackageSearch className="h-8 w-8 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">비교함이 비어 있습니다.</p>
          <p className="text-xs text-gray-400">상품 목록에서 &quot;비교 담기&quot;를 선택하면 여기에서 함께 볼 수 있어요.</p>
          <Link href="/category/wireless-vacuum" className="btn-primary mt-2">
            무선청소기 순위 보러가기
          </Link>
        </div>
      ) : products === null ? (
        <div className="card p-16 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : (
        <CompareTable products={products} />
      )}
    </div>
  );
}
