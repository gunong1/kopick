import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { searchProducts } from "@/lib/data";
import { computeKopickScore, WEIGHT_PROFILES } from "@/lib/scoring";
import { ArrowRight, SearchX } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q ?? "";
  const results = await searchProducts(query);

  return (
    <div className="container-page py-6">
      <div className="mx-auto mb-8 max-w-xl">
        <SearchBar defaultValue={query} size="lg" />
      </div>

      <p className="mb-4 text-sm text-gray-500">
        <span className="font-bold text-gray-900">&quot;{query}&quot;</span> 검색 결과 {results.length}건
      </p>

      {results.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-16 text-center">
          <SearchX className="h-8 w-8 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">검색 결과가 없습니다.</p>
          <p className="text-xs text-gray-400">현재는 무선청소기 카테고리만 지원합니다. 예: &quot;무선청소기&quot;, &quot;다이슨&quot;</p>
          <Link href="/category/wireless-vacuum" className="btn-primary mt-2">
            무선청소기 순위 보러가기
          </Link>
        </div>
      ) : (
        <>
          <Link
            href="/category/wireless-vacuum"
            className="mb-6 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700"
          >
            랭킹 탭과 상세 필터로 더 정확히 비교하려면 무선청소기 카테고리 페이지로 이동하세요
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {results.map(({ product }) => (
              <ProductCard
                key={product.id}
                product={product}
                score={computeKopickScore(product.subScores, WEIGHT_PROFILES.comprehensive)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
