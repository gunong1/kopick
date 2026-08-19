"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  defaultValue = "",
  size = "md",
  placeholder = "카테고리 또는 상품명을 검색해보세요 (예: 무선청소기)",
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  placeholder?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const heightClass = size === "lg" ? "h-14 text-base" : "h-11 text-sm";

  return (
    <form onSubmit={handleSubmit} className={`flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 shadow-card ${heightClass}`}>
      <Search className="h-5 w-5 shrink-0 text-gray-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
        aria-label="상품 검색"
      />
      <button type="submit" className="btn-primary !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">
        검색
      </button>
    </form>
  );
}
