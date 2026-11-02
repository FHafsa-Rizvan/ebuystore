import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { CategoryTag } from "./CategoryIcon";
import { formatPrice } from "@/data/products";
import { thumbUrl } from "@/lib/images";

// The product picture. Shows the first photo (or the emoji placeholder) and "+N" when there are more.
export function Thumb({ product }) {
  const first = product.images?.[0] || product.image;
  const extra = (product.images?.length || 0) - 1;
  return (
    <div className="thumb" style={{ background: product.color }}>
      {first ? (
        <img
          src={thumbUrl(first)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          // Photos uploaded before thumbnails existed: fall back to the full photo
          onError={(e) => {
            if (e.currentTarget.dataset.full !== "1") {
              e.currentTarget.dataset.full = "1";
              e.currentTarget.src = first;
            }
          }}
        />
      ) : (
        <span>{product.emoji}</span>
      )}
      {extra > 0 && <span className="thumb-count">+{extra} photos</span>}
    </div>
  );
}

export default function ProductCard({ product }) {
  const cats = product.categories || [];
  return (
    <div className="card">
      <Link href={`/products/${product.id}`}>
        <Thumb product={product} />
      </Link>
      <div className="card-body">
        {cats.length > 0 && (
          <div className="tags">
            {cats.slice(0, 2).map((id) => <CategoryTag key={id} id={id} />)}
            {cats.length > 2 && <span className="tag tag-more">+{cats.length - 2}</span>}
          </div>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        <div className="price-line">
          <span className="price">{formatPrice(product.price)}</span>
          {product.code && <span className="code">{product.code}</span>}
        </div>
        <div className="card-actions">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}