"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count, loaded } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">Ebuy</Link>
        <Link href="/cart" className="cart-link">
          Cart
          {loaded && count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
