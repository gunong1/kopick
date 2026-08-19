import { Product } from "./types";

export type PriceBandKey = "all" | "under200" | "200to400" | "400to700" | "700to1000" | "over1000";

export const PRICE_BANDS: { key: PriceBandKey; label: string; min: number; max: number }[] = [
  { key: "all", label: "전체 가격", min: 0, max: Infinity },
  { key: "under200", label: "20만원 이하", min: 0, max: 200000 },
  { key: "200to400", label: "20~40만원", min: 200000, max: 400000 },
  { key: "400to700", label: "40~70만원", min: 400000, max: 700000 },
  { key: "700to1000", label: "70~100만원", min: 700000, max: 1000000 },
  { key: "over1000", label: "100만원 이상", min: 1000000, max: Infinity },
];

export const SUCTION_OPTIONS = [
  { value: 0, label: "전체" },
  { value: 100, label: "100AW 이상" },
  { value: 150, label: "150AW 이상" },
  { value: 200, label: "200AW 이상" },
];

export const BATTERY_OPTIONS = [
  { value: 0, label: "전체" },
  { value: 40, label: "40분 이상" },
  { value: 60, label: "60분 이상" },
  { value: 80, label: "80분 이상" },
];

export type FilterState = {
  priceBand: PriceBandKey;
  brands: string[];
  minSuction: number;
  minBattery: number;
};

export const DEFAULT_FILTERS: FilterState = {
  priceBand: "all",
  brands: [],
  minSuction: 0,
  minBattery: 0,
};

export function matchesFilters(product: Product, filters: FilterState): boolean {
  const band = PRICE_BANDS.find((b) => b.key === filters.priceBand)!;
  if (product.price < band.min || product.price > band.max) return false;
  if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
  if (product.specs.suctionPowerAW < filters.minSuction) return false;
  if (product.specs.batteryMinutes < filters.minBattery) return false;
  return true;
}

export function isFiltersActive(filters: FilterState): boolean {
  return (
    filters.priceBand !== "all" || filters.brands.length > 0 || filters.minSuction > 0 || filters.minBattery > 0
  );
}
