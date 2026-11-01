import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/data/products";
import { CategoryTag } from "@/components/CategoryIcon";
import ImageGallery from "@/components/ImageGallery";
import AddToCartButton from "@/components/AddToCartButton";

// Always fetch fresh data so admin changes show up straight away
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product ? `${product.name} | Ebuy` : "Product not found | Ebuy" };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <>
      <Link href="/" className="back">← Back to products</Link>
      <div className="product">
        <ImageGallery images={product.images} name={product.name} emoji={product.emoji} color={product.color} />
        <div>
          {product.categories.length > 0 && (
            <div className="tags">
              {product.categories.map((cid) => <CategoryTag key={cid} id={cid} full />)}
            </div>
          )}
          <h1>{product.name}</h1>
          <div className="price">{formatPrice(product.price)}</div>
          <p className="desc">{product.description}</p>
          <AddToCartButton product={product} />
          <Link href="/cart" className="btn btn-outline" style={{ marginTop: 10 }}>View cart</Link>
        </div>
      </div>
    </>
  );
}