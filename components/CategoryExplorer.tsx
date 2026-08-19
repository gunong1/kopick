"use client";

import { CompareBar } from "@/components/CompareBar";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import { RankingTabs } from "@/components/RankingTabs";
import { getAllBrandsForProducts } from "@/lib/data";
import { DEFAULT_FILTERS, FilterState, isFiltersActive, matchesFilters } from "@/lib/filters";
import { RANKING_TABS, rankByTab } from "@/lib/scoring";
import { Category, RankingTabKey, ScoredProduct } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

export function CategoryExplorer({ category, products }: { category: Category; products: ScoredProduct[] }) {
  const [activeTab, setActiveTab] = useState<RankingTabKey>("comprehensive");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = useMemo(() => getAllBrandsForProducts(products), [products]);
  const ranked = useMemo(() => rankByTab(products, activeTab), [products, activeTab]);
  const visible = useMemo(
    () => ranked.filter((p) => matchesFilters(p, filters)).map((p, i) => ({ ...p, rank: i + 1 })),
    [ranked, filters]
  );

  const activeTabInfo = RANKING_TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="container-page py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{category.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          전체 {products.length}개 상품 · 표시 중 {visible.length}개
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <RankingTabs active={activeTab} onChange={setActiveTab} />
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="btn-secondary shrink-0 !px-3 lg:hidden"
          aria-label="필터 열기"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {isFiltersActive(filters) && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
        </button>
      </div>
      <p className="mb-6 text-xs text-gray-400">{activeTabInfo.description}</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-5">
            <FilterPanel filters={filters} onChange={setFilters} brands={brands} />
          </div>
        </aside>

        <section>
          {visible.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-2 p-16 text-center">
              <p className="text-sm font-semibold text-gray-700">조건에 맞는 상품이 없습니다.</p>
              <p className="text-xs text-gray-400">필터 조건을 완화해 보세요.</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn-secondary mt-2 text-xs">
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} score={p.kopickScore} rank={p.rank} />
              ))}
            </div>
          )}
        </section>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="필터 닫기"
              className="absolute right-5 top-5"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <FilterPanel filters={filters} onChange={setFilters} brands={brands} />
            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary mt-6 w-full">
              {visible.length}개 결과 보기
            </button>
          </div>
        </div>
      )}

      <CompareBar />
    </div>
  );
}
