"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Thumb } from "@/components/ProductCard";
import { formatPrice } from "@/data/products";
import { buildWhatsAppUrl, isValidContactNumber, isWhatsAppConfigured } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, loaded, total, setQty, removeItem, clear } = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState({}); // { name, phone, address }
  const [configError, setConfigError] = useState("");

  const update = (field) => (e) => {
    setCustomer((c) => ({ ...c, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
  };

  function handleBuyNow() {
    if (!isWhatsAppConfigured()) {
      setConfigError("WhatsApp number is not set. Add NEXT_PUBLIC_WHATSAPP_NUMBER to .env.local.");
      return;
    }
    setConfigError("");

    const found = {};
    if (!customer.name.trim()) found.name = "Please enter your name.";
    if (!customer.phone.trim()) found.phone = "Please enter your contact number.";
    else if (!isValidContactNumber(customer.phone)) found.phone = "Please enter a valid contact number, for example 0771234567.";
    if (!customer.address.trim()) found.address = "Please enter your delivery address.";

    if (Object.keys(found).length) {
      setErrors(found);
      // Take the customer to the first field that needs fixing
      const first = ["name", "phone", "address"].find((k) => found[k]);
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setErrors({});
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
        <div className="cart-head">
          <h1>Your cart</h1>
          <Link href="/#products" className="btn btn-outline">← Continue shopping</Link>
        </div>
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
        <div className="cart-more">
          <Link href="/#products" className="btn btn-outline">+ Add more products</Link>
          <button className="remove" onClick={clear}>Clear cart</button>
        </div>
      </section>

      <aside className="summary">
        <h2>Order summary</h2>
        <div className="row total"><span>Total</span><span>{formatPrice(total)}</span></div>

        <label className="field">Name *
          <input
            id="field-name"
            value={customer.name}
            onChange={update("name")}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={errors.name ? "has-error" : ""}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label className="field">Contact number *
          <input
            id="field-phone"
            type="tel"
            inputMode="tel"
            placeholder="e.g. 0771234567"
            value={customer.phone}
            onChange={update("phone")}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            className={errors.phone ? "has-error" : ""}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>
        <label className="field">Delivery address *
          <textarea
            id="field-address"
            rows={3}
            value={customer.address}
            onChange={update("address")}
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            className={errors.address ? "has-error" : ""}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </label>
        <label className="field">Notes (optional)
          <input value={customer.notes} onChange={update("notes")} />
        </label>

        {configError && <p className="error">{configError}</p>}

        <button className="btn btn-whatsapp" onClick={handleBuyNow}>Buy Now on WhatsApp</button>
        <p className="note">
          Island-wide delivery to your doorstep in 5-7 working days. Your order opens in WhatsApp as a
          ready-to-send message. Payment and delivery are confirmed in the chat.
        </p>
      </aside>
    </div>
  );
}