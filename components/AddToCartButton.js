"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LuCheck, LuShoppingCart } from "react-icons/lu";
import { useCart } from "./CartProvider";

// "Add to cart" that clearly confirms what happened:
//  1. the button turns green and says "Added to cart" for 2 seconds,
//  2. a message slides up from the bottom (see CartProvider),
//  3. the cart count in the header jumps,
//  4. a line under the button keeps showing how many of this product are in the cart.
export default function AddToCartButton({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (product.inStock === false) {
    return <button type="button" className="btn" disabled>Out of stock</button>;
  }

  const inCart = items.find((i) => i.id === product.id)?.qty || 0;

  function handleClick() {
    addItem(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="atc">
      <button type="button" className={`btn atc-btn ${added ? "is-added" : ""}`} onClick={handleClick}>
        {added ? (
          <>
            <LuCheck size={18} aria-hidden="true" /> Added to cart
          </>
        ) : (
          <>
            <LuShoppingCart size={18} aria-hidden="true" /> Add to cart
          </>
        )}
      </button>
      {inCart > 0 && (
        <Link href="/cart" className="atc-status">
          <LuCheck size={14} aria-hidden="true" /> {inCart} in your cart · View cart
        </Link>
      )}
    </div>
  );
}