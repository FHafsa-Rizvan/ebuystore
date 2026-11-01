"use client";

import { useMemo, useState } from "react";
import { LuLayoutGrid, LuSearch } from "react-icons/lu";
import ProductCard from "./ProductCard";
import { CategoryIcon } from "./CategoryIcon";
import { CATEGORIES, getCategory } from "@/lib/categories";

export default function ProductGrid({ products }) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  // Only show categories that have at least one product
  const counts = useMemo(() => {
    const c = {};
    for (const p of products) for (const id of p.categories || []) c[id] = (c[id] || 0) + 1;
    return c;
  }, [products]);
  const available = CATEGORIES.filter((c) => counts[c.id]);

  const q = query.trim().toLowerCase();
  const visible = products.filter((p) => {
    if (active !== "all" && !(p.categories || []).includes(active)) return false;
    if (!q) return true;
    const cats = (p.categories || []).map((id) => getCategory(id)?.label || "").join(" ");
    return `${p.name} ${p.description} ${cats}`.toLowerCase().includes(q);
  });

  const title = active === "all" ? "All products" : getCategory(active)?.label;

  return (
    <>
      <section id="products" className="shop-by">
        <h2>Shop by category</h2>
        <div className="cat-strip" role="group" aria-label="Product categories">
          <button
            type="button"
            className={`cat-tile ${active === "all" ? "on" : ""}`}
            aria-pressed={active === "all"}
            onClick={() => setActive("all")}
          >
            <span className="cat-ico" aria-hidden="true" style={{ width: 48, height: 48, borderRadius: 14, background: "#1a1710", color: "#e3c27a" }}>
              <LuLayoutGrid size={26} />
            </span>
            <span className="cat-name">All products</span>
            <span className="cat-count">{products.length} items</span>
          </button>
          {available.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`cat-tile ${active === c.id ? "on" : ""}`}
              aria-pressed={active === c.id}
              onClick={() => setActive(c.id)}
            >
              <CategoryIcon id={c.id} />
              <span className="cat-name">{c.short}</span>
              <span className="cat-count">{counts[c.id]} {counts[c.id] === 1 ? "item" : "items"}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="products-head">
        <h2>{title}</h2>
        <div className="products-tools">
          <span>{visible.length} {visible.length === 1 ? "item" : "items"}</span>
          <label className="search">
            <LuSearch size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products"
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="empty">No products found{active !== "all" ? " in this category" : ""}. Try another category or search.</p>
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