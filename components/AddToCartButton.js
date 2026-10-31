"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ product, outline = false }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product.inStock === false) {
    return <button className="btn" disabled>Out of stock</button>;
  }

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button className={`btn ${outline ? "btn-outline" : "btn-amber"}`} onClick={handleClick}>
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}