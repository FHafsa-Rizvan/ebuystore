"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count, loaded } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <img src="/logo-mark.png" alt="" width="40" height="40" />
          EbuyStore
        </Link>
        <Link href="/cart" className="cart-link" aria-label={`Cart, ${loaded ? count : 0} items`}>
          Cart
          {/* key={count}: the badge re-mounts and "jumps" every time the count changes */}
          {loaded && count > 0 && <span className="cart-badge" key={count}>{count}</span>}
        </Link>
      </div>
    </header>
  );
}