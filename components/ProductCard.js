import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "@/data/products";

export function Thumb({ product }) {
  return (
    <div className="thumb" style={{ background: product.color }}>
      {product.image ? <img src={product.image} alt={product.name} /> : <span>{product.emoji}</span>}
    </div>
  );
}

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <Link href={`/products/${product.id}`}>
        <Thumb product={product} />
      </Link>
      <div className="card-body">
        <span className="card-cat">{product.category}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        <span className="price">{formatPrice(product.price)}</span>
        <div className="card-actions">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
