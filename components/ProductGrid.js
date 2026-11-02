"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowUpDown, LuLayoutGrid, LuSearch } from "react-icons/lu";
import ProductCard from "./ProductCard";
import { CategoryIcon } from "./CategoryIcon";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { fetchProducts, PAGE_SIZE } from "@/lib/products";

// The first page comes from the server (fast, good for Google). Searching, sorting, filtering and
// "Show more" ask the database for exactly the products needed, so the shop stays quick with
// hundreds or thousands of products.
export default function ProductGrid({ initial, counts }) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState(""); // what the customer typed; `query` follows after a short pause
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [items, setItems] = useState(initial.products);
  const [total, setTotal] = useState(initial.total);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const latest = useRef(0); // ignores answers that arrive after a newer request
  const firstRun = useRef(true);

  // Only show categories that have at least one product
  const byCategory = counts.byCategory;
  const available = CATEGORIES.filter((c) => byCategory[c.id]);

  // Wait until the customer stops typing before searching
  useEffect(() => {
    const t = setTimeout(() => setQuery(typed.trim()), 350);
    return () => clearTimeout(t);
  }, [typed]);

  async function load(nextPage, append) {
    const id = ++latest.current;
    setLoading(true);
    setError("");
    const r = await fetchProducts({ category: active, query, sort, inStockOnly, page: nextPage });
    if (id !== latest.current) return;
    setLoading(false);
    if (r.error) {
      setError("Could not load products. Please check your connection and try again.");
      return;
    }
    setItems((prev) => {
      if (!append) return r.products;
      const seen = new Set(prev.map((p) => p.id));
      return [...prev, ...r.products.filter((p) => !seen.has(p.id))];
    });
    setTotal(r.total);
    setPage(nextPage);
  }

  // Any change to the category, search, sort or stock filter starts again from page 1
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    load(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, query, sort, inStockOnly]);

  const remaining = Math.max(0, total - items.length);

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
            <span className="cat-count">{counts.total} items</span>
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
              <span className="cat-count">{byCategory[c.id]} {byCategory[c.id] === 1 ? "item" : "items"}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="products-head">
        <h2>{title}</h2>
        <div className="products-tools">
          <span>{total} {total === 1 ? "item" : "items"}</span>
          <label className="search">
            <LuSearch size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search name or code"
              aria-label="Search products by name or product code"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="sort-bar">
        <label className="sort-select">
          <LuArrowUpDown size={16} aria-hidden="true" />
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <label className="stock-toggle">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          In stock only
        </label>
      </div>

      {error && (
        <p className="error" role="alert">
          {error} <button type="button" className="link-btn" onClick={() => load(page, page > 0)}>Try again</button>
        </p>
      )}

      {!error && items.length === 0 && !loading ? (
        <p className="empty">No products found{active !== "all" ? " in this category" : ""}. Try another category or search.</p>
      ) : (
        <div className={`grid${loading && page === 0 ? " is-loading" : ""}`} aria-busy={loading}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div className="load-more-wrap">
          <button type="button" className="btn btn-outline" disabled={loading} onClick={() => load(page + 1, true)}>
            {loading ? "Loading..." : `Show more products (${remaining} left)`}
          </button>
          <span className="load-more-note">Showing {items.length} of {total}</span>
        </div>
      )}
    </>
  );
}