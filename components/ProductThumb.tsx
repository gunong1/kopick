"use client";

import { brandHue } from "@/lib/ui";
import { useEffect, useRef, useState } from "react";

export function ProductThumb({
  brand,
  imageUrl,
  size = "md",
  className = "",
}: {
  brand: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const hue = brandHue(brand);
  const sizeClass = { sm: "h-16 w-16 text-lg", md: "aspect-square w-full text-3xl", lg: "aspect-[4/3] w-full text-5xl" }[size];

  // SSR로 내려온 <img>는 하이드레이션이 끝나기 전에 이미 로드에 실패해 있을 수 있다 —
  // 그 경우 onError는 이미 지나간 이벤트라 다시 발생하지 않으므로, 마운트 시점에 한 번 직접 확인한다.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setImageFailed(true);
    }
  }, [imageUrl]);

  if (imageUrl && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 외부(쿠팡/네이버) 도메인이 사용자 데이터마다 달라 next/image 도메인 화이트리스트를 미리 정할 수 없음
      <img
        ref={imgRef}
        src={imageUrl}
        alt={brand}
        onError={() => setImageFailed(true)}
        className={`shrink-0 rounded-xl object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold text-white ${sizeClass} ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 42%))`,
      }}
      aria-hidden
    >
      <span className="drop-shadow-sm">{brand.slice(0, 1)}</span>
    </div>
  );
}
