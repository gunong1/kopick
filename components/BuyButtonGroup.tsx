"use client";

import { formatWon } from "@/lib/format";
import { RetailerOffer } from "@/lib/types";
import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";

export function BuyButtonGroup({ retailers }: { retailers: RetailerOffer[] }) {
  const [toast, setToast] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setToast(true);
    window.setTimeout(() => setToast(false), 2600);
  }

  return (
    <div className="relative flex flex-col gap-2">
      {retailers.map((offer) => (
        <button
          key={offer.name}
          onClick={handleClick}
          className="btn-primary w-full !justify-between !bg-gray-900 hover:!bg-gray-800"
        >
          <span className="whitespace-nowrap">{offer.label}에서 구매하기</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap font-extrabold">
            {formatWon(offer.price)}
            <ExternalLink className="h-4 w-4 shrink-0" />
          </span>
        </button>
      ))}

      {toast && (
        <div className="absolute -top-14 left-0 right-0 mx-auto flex w-fit items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">
          <Info className="h-4 w-4 shrink-0" />
          프로토타입 단계입니다. 실제 서비스에서는 쿠팡/네이버쇼핑으로 이동합니다.
        </div>
      )}
    </div>
  );
}
