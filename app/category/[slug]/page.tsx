import { CategoryExplorer } from "@/components/CategoryExplorer";
import { getCategoryBySlug, getScoredProductsByCategorySlug } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getScoredProductsByCategorySlug(slug);

  return <CategoryExplorer category={category} products={products} />;
}
