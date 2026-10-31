"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Thumb } from "@/components/ProductCard";
import { formatPrice } from "@/data/products";
import { buildWhatsAppUrl, isWhatsAppConfigured } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, loaded, total, setQty, removeItem, clear } = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [error, setError] = useState("");

  const update = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }));

  function handleBuyNow() {
    if (!isWhatsAppConfigured()) {
      setError("WhatsApp number is not set. Add NEXT_PUBLIC_WHATSAPP_NUMBER to .env.local.");
      return;
    }
    if (!customer.name.trim() || !customer.address.trim()) {
      setError("Please enter your name and delivery address.");
      return;
    }
    setError("");
    window.open(buildWhatsAppUrl(items, customer), "_blank", "noopener");
  }

  if (!loaded) return <p className="empty">Loading your cart...</p>;

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p>Browse our products and add something you like.</p>
        <Link href="/" className="btn">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section>
        <h1>Your cart</h1>
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <Thumb product={item} />
            <div>
              <strong>{item.name}</strong>
              <div className="price">{formatPrice(item.price)}</div>
              <div className="qty">
                <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                <span>{item.qty}</span>
                <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong>{formatPrice(item.price * item.qty)}</strong>
              <div><button className="remove" onClick={() => removeItem(item.id)}>Remove</button></div>
            </div>
          </div>
        ))}
        <button className="remove" onClick={clear}>Clear cart</button>
      </section>

      <aside className="summary">
        <h2>Order summary</h2>
        <div className="row total"><span>Total</span><span>{formatPrice(total)}</span></div>

        <label className="field">Name *
          <input value={customer.name} onChange={update("name")} autoComplete="name" />
        </label>
        <label className="field">Phone
          <input value={customer.phone} onChange={update("phone")} autoComplete="tel" inputMode="tel" />
        </label>
        <label className="field">Delivery address *
          <textarea rows={3} value={customer.address} onChange={update("address")} autoComplete="street-address" />
        </label>
        <label className="field">Notes (optional)
          <input value={customer.notes} onChange={update("notes")} />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-whatsapp" onClick={handleBuyNow}>Buy Now on WhatsApp</button>
        <p className="note">
          Your order opens in WhatsApp as a ready-to-send message. Payment and delivery are confirmed in the chat.
        </p>
      </aside>
    </div>
  );
}
