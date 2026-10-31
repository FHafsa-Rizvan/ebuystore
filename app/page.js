import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

// Always fetch fresh products so admin changes show up straight away
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      <Hero />
      <section id="products" className="products-head">
        <h2>Shop all products</h2>
        <span>{products.length} items</span>
      </section>
      <ProductGrid products={products} categories={categories} />
    </>
  );
}