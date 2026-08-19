import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { ScoreGauge } from "@/components/ScoreGauge";
import { ProductThumb } from "@/components/ProductThumb";
import { formatWon } from "@/lib/format";
import { buildScoreRationale } from "@/lib/rationale";
import { getScoredProductsByCategorySlug } from "@/lib/data";
import { rankByTab } from "@/lib/scoring";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const products = await getScoredProductsByCategorySlug("wireless-vacuum");
  const ranked = rankByTab(products, "comprehensive");
  const top = ranked[0];
  const top3 = ranked.slice(0, 3);

  return (
    <div>
      <section className="border-b border-gray-200 bg-gradient-to-b from-brand-50/60 to-transparent">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <span className="chip !border-brand-200 !bg-white !text-brand-700">
            <Sparkles className="h-3.5 w-3.5" /> 가장 싼 상품이 아니라, 가장 합리적인 상품
          </span>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            최저가 대신,
            <br />
            <span className="text-brand-600">KOPICK Score</span>로 골라보세요
          </h1>
          <p className="max-w-xl text-sm text-gray-500 sm:text-base">
            성능·가성비·리뷰 만족도·배터리·AS까지 종합한 KOPICK Score로 정말 합리적인 상품을 찾아드립니다.
          </p>
          <div className="w-full max-w-xl">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <h2 className="mb-4 text-sm font-extrabold text-gray-400">카테고리</h2>
        <Link
          href="/category/wireless-vacuum"
          className="card flex items-center justify-between p-5 transition hover:shadow-cardHover"
        >
          <div>
            <p className="text-lg font-extrabold text-gray-900">무선청소기</p>
            <p className="mt-1 text-sm text-gray-500">전체 {products.length}개 상품의 종합·가성비·성능·리뷰·배터리 순위 보기</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-gray-400" />
        </Link>
        <p className="mt-3 text-xs text-gray-400">다른 카테고리는 순차적으로 추가될 예정입니다.</p>
      </section>

      {top && (
        <section className="container-page py-6">
          <h2 className="mb-4 text-sm font-extrabold text-gray-400">이번 주 KOPICK 추천</h2>
          <Link
            href={`/product/${top.id}`}
            className="card flex flex-col items-center gap-6 p-6 transition hover:shadow-cardHover sm:flex-row sm:p-8"
          >
            <ProductThumb brand={top.brand} imageUrl={top.imageUrl} size="lg" className="w-full sm:w-56" />
            <div className="flex-1">
              <p className="text-xs font-bold text-brand-600">종합 순위 1위</p>
              <p className="mt-1 text-xl font-extrabold text-gray-900">
                {top.brand} {top.name}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900">{formatWon(top.price)}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{buildScoreRationale(top.subScores)}</p>
            </div>
            <ScoreGauge score={top.kopickScore} />
          </Link>
        </section>
      )}

      <section className="container-page py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-400">무선청소기 종합 TOP 3</h2>
          <Link href="/category/wireless-vacuum" className="flex items-center gap-1 text-xs font-semibold text-brand-600">
            전체 순위 보기 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {top3.map((p) => (
            <ProductCard key={p.id} product={p} score={p.kopickScore} rank={p.rank} showCompareToggle={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
