import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts, getCategoryCounts } from "@/lib/products";

// Always fetch fresh products so admin changes show up straight away
export const dynamic = "force-dynamic";

export default async function Home() {
  // Only the first page of products is loaded here. More are loaded when the customer asks.
  const [first, counts] = await Promise.all([fetchProducts({ page: 0 }), getCategoryCounts()]);

  return (
    <>
      <Hero />
      <ProductGrid initial={{ products: first.products, total: first.total }} counts={counts} />
    </>
  );
}