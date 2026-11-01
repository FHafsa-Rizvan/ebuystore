import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

// Always fetch fresh products so admin changes show up straight away
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <ProductGrid products={products} />
    </>
  );
}