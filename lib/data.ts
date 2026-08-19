import { CATEGORIES } from "./mock/categories";
import { WIRELESS_VACUUM_PRODUCTS } from "./mock/products";
import { attachSubScores } from "./scoring";
import { Category, Product, ScoredProduct } from "./types";

// -----------------------------------------------------------------------
// 데이터 접근 레이어.
// 지금은 메모리에 있는 mock 배열을 읽지만, 함수 시그니처는 이후 Supabase 쿼리로
// 그대로 바꿔 끼울 수 있도록 async 형태를 유지한다.
// (예: getProductsByCategorySlug -> supabase.from('products').select().eq('category_id', ...))
// -----------------------------------------------------------------------

const PRODUCTS_BY_CATEGORY: Record<string, Product[]> = {
  "cat-wireless-vacuum": WIRELESS_VACUUM_PRODUCTS,
};

const ALL_PRODUCTS: Product[] = Object.values(PRODUCTS_BY_CATEGORY).flat();

// 상품명 등 가벼운 정보만 즉시 필요한 곳(비교함 칩 표시 등)에서 쓰는 동기 조회 함수.
export function findProductRawById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getScoredProductsByCategorySlug(slug: string): Promise<ScoredProduct[]> {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];
  const products = PRODUCTS_BY_CATEGORY[category.id] ?? [];
  return attachSubScores(products);
}

export async function getScoredProductById(id: string): Promise<{ product: ScoredProduct; category: Category } | null> {
  for (const category of CATEGORIES) {
    const products = PRODUCTS_BY_CATEGORY[category.id] ?? [];
    const found = products.find((p) => p.id === id);
    if (found) {
      const scored = attachSubScores(products).find((p) => p.id === id)!;
      return { product: scored, category };
    }
  }
  return null;
}

export async function searchProducts(query: string): Promise<{ product: ScoredProduct; category: Category }[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { product: ScoredProduct; category: Category }[] = [];
  for (const category of CATEGORIES) {
    const products = PRODUCTS_BY_CATEGORY[category.id] ?? [];
    const scored = attachSubScores(products);
    for (const p of scored) {
      const haystack = `${p.name} ${p.brand} ${category.name}`.toLowerCase();
      if (haystack.includes(q)) results.push({ product: p, category });
    }
  }
  return results;
}

export function getAllBrandsForProducts(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}
