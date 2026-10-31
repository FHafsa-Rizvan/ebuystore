"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, categories }) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const visible = products.filter(
    (p) =>
      (active === "All" || p.category === active) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <div className="filters">
        {["All", ...categories].map((c) => (
          <button key={c} className={`chip ${active === c ? "active" : ""}`} onClick={() => setActive(c)}>
            {c}
          </button>
        ))}
        <input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="chip"
          style={{ marginLeft: "auto", minWidth: 180 }}
        />
      </div>
      {visible.length === 0 ? (
        <p className="empty">No products found.</p>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
