import { BuyButtonGroup } from "@/components/BuyButtonGroup";
import { CompareToggleButton } from "@/components/CompareToggleButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductThumb } from "@/components/ProductThumb";
import { RadarChart } from "@/components/RadarChart";
import { ScoreGauge } from "@/components/ScoreGauge";
import { formatWon } from "@/lib/format";
import { buildScoreRationale } from "@/lib/rationale";
import { getScoredProductById, getScoredProductsByCategorySlug } from "@/lib/data";
import { computeKopickScore, WEIGHT_PROFILES } from "@/lib/scoring";
import { AsInfo, ProductSpecs } from "@/lib/types";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const SPEC_ROWS: { key: string; label: string; render: (specs: ProductSpecs, as: AsInfo) => string }[] = [
  { key: "suction", label: "흡입력", render: (s) => `${s.suctionPowerAW} AW` },
  { key: "battery", label: "최대 사용 시간", render: (s) => `${s.batteryMinutes}분` },
  { key: "charge", label: "완충 시간", render: (s) => `${s.chargeHours}시간` },
  { key: "weight", label: "무게", render: (s) => `${s.weightKg}kg` },
  { key: "dust", label: "먼지통 용량", render: (s) => `${s.dustCapacityL}L` },
  { key: "warranty", label: "무상보증", render: (_s, as) => `${as.warrantyMonths}개월` },
  { key: "centers", label: "서비스센터 수", render: (_s, as) => `${as.serviceCenterCount}개` },
  { key: "grade", label: "AS 등급", render: (_s, as) => `${as.grade}등급` },
];

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getScoredProductById(id);
  if (!found) notFound();
  const { product, category } = found;

  const kopickScore = computeKopickScore(product.subScores, WEIGHT_PROFILES.comprehensive);

  const categoryProducts = await getScoredProductsByCategorySlug(category.slug);
  const alternatives = categoryProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, 4)
    .map((p) => ({ product: p, score: computeKopickScore(p.subScores, WEIGHT_PROFILES.comprehensive) }));

  return (
    <div className="container-page py-6">
      <nav className="mb-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-600">
          홈
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/category/${category.slug}`} className="hover:text-gray-600">
          {category.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-500">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[220px_1fr]">
            <ProductThumb brand={product.brand} imageUrl={product.imageUrl} size="lg" className="sm:aspect-square" />
            <div>
              {product.dataConfidence < 0.85 && (
                <span className="chip mb-2 w-fit !border-amber-200 !bg-amber-50 !text-amber-700">
                  데이터 정보 확인 중 (리뷰/스펙 표본이 적은 상품입니다)
                </span>
              )}
              <p className="text-sm font-semibold text-gray-400">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="mt-3 text-2xl font-extrabold text-gray-900">{formatWon(product.price)}</p>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <span className="font-semibold text-amber-500">★ {product.reviews.avgRating.toFixed(1)}</span>
                <span>리뷰 {product.reviews.reviewCount.toLocaleString("ko-KR")}개</span>
              </div>
              <div className="mt-5">
                <CompareToggleButton productId={product.id} />
              </div>
            </div>
          </div>

          <div className="card mt-8 flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
            <ScoreGauge score={kopickScore} />
            <div className="flex-1">
              <p className="text-sm font-extrabold text-gray-900">왜 이 점수인가요?</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{buildScoreRationale(product.subScores)}</p>
            </div>
            <RadarChart subScores={product.subScores} />
          </div>

          <div className="card mt-8 p-6">
            <p className="mb-4 text-sm font-extrabold text-gray-900">스펙</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
              {SPEC_ROWS.map((row) => (
                <div key={row.key}>
                  <dt className="text-xs text-gray-400">{row.label}</dt>
                  <dd className="mt-0.5 font-semibold text-gray-800">{row.render(product.specs, product.as)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card mt-8 p-6">
            <p className="mb-4 text-sm font-extrabold text-gray-900">리뷰 요약</p>
            <p className="text-sm leading-relaxed text-gray-600">{product.reviews.summaryText}</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <ThumbsUp className="h-3.5 w-3.5" /> 긍정 키워드
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.reviews.positiveKeywords.map((k) => (
                    <span key={k} className="chip !border-emerald-200 !bg-emerald-50 !text-emerald-700">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                  <ThumbsDown className="h-3.5 w-3.5" /> 부정 키워드
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.reviews.negativeKeywords.map((k) => (
                    <span key={k} className="chip !border-rose-200 !bg-rose-50 !text-rose-700">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-gray-400">
              * 리뷰 요약은 쿠팡/네이버쇼핑 리뷰를 종합해 AI가 정리한 결과를 가정한 프로토타입 데이터입니다.
            </p>
          </div>

          {alternatives.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-extrabold text-gray-900">이 가격대의 다른 대안</p>
              <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
                {alternatives.map(({ product: alt, score }) => (
                  <ProductCard key={alt.id} product={alt} score={score} showCompareToggle={false} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <p className="mb-3 text-sm font-extrabold text-gray-900">구매하러 가기</p>
            <BuyButtonGroup retailers={product.retailers} />
            <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
              KOPICK은 판매를 직접 진행하지 않으며, 실제 구매는 쿠팡/네이버쇼핑 등 판매처에서 이루어집니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
