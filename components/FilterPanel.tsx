"use client";

import { BATTERY_OPTIONS, DEFAULT_FILTERS, FilterState, PRICE_BANDS, SUCTION_OPTIONS } from "@/lib/filters";
import { RotateCcw } from "lucide-react";

export function FilterPanel({
  filters,
  onChange,
  brands,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  brands: string[];
}) {
  function toggleBrand(brand: string) {
    const has = filters.brands.includes(brand);
    onChange({ ...filters, brands: has ? filters.brands.filter((b) => b !== brand) : [...filters.brands, brand] });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pr-7">
        <h3 className="text-sm font-extrabold text-gray-900">필터</h3>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600"
        >
          <RotateCcw className="h-3 w-3" /> 초기화
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-gray-500">가격대</p>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_BANDS.map((band) => (
            <button
              key={band.key}
              onClick={() => onChange({ ...filters, priceBand: band.key })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                filters.priceBand === band.key
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-gray-500">브랜드</p>
        <div className="flex max-h-44 flex-col gap-1.5 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-gray-500">흡입력</p>
        <select
          value={filters.minSuction}
          onChange={(e) => onChange({ ...filters, minSuction: Number(e.target.value) })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none"
        >
          {SUCTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-gray-500">배터리 사용시간</p>
        <select
          value={filters.minBattery}
          onChange={(e) => onChange({ ...filters, minBattery: Number(e.target.value) })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none"
        >
          {BATTERY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
