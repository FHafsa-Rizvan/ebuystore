import { supabase, isSupabaseConfigured } from "./supabase";
import { products as sampleProducts } from "@/data/products";
import { CATEGORIES, CATEGORY_MAP, LEGACY_CATEGORY } from "./categories";

// Category ids on the product. Older products (saved before multi-category) have a single
// free-text `category`; map those to the new ids so they still show up.
function categoryIds(row) {
  const ids = (row.categories || []).filter((id) => CATEGORY_MAP[id]);
  if (ids.length) return ids;
  const legacy = LEGACY_CATEGORY[String(row.category || "").trim().toLowerCase()];
  return legacy ? [legacy] : [];
}

// Turns a database row into the shape the storefront components use.
function normalize(row) {
  const images = (row.images && row.images.length ? row.images : row.image_url ? [row.image_url] : []).filter(Boolean);
  return {
    id: row.id,
    code: row.code || "",
    name: row.name,
    categories: categoryIds(row),
    price: row.price,
    description: row.description || "",
    images,
    image: images[0] || null,
    inStock: row.in_stock !== false,
    emoji: row.emoji || "🛍️",
    color: row.color || "#f6ecd2",
  };
}

function fromSample(p) {
  const images = p.images || [];
  return { ...p, images, image: images[0] || null, inStock: true };
}

export const PAGE_SIZE = 24;

// Keeps characters that could break the search filter out of what the customer typed
function cleanTerm(text) {
  return String(text || "").replace(/[,()*%\\"{}]/g, " ").replace(/\s+/g, " ").trim();
}

// One page of products, filtered, searched and sorted by the database.
// options: { category: "all" | id, query, sort, inStockOnly, page (starts at 0) }
export async function fetchProducts({ category = "all", query = "", sort = "newest", inStockOnly = false, page = 0 } = {}) {
  const term = cleanTerm(query);

  if (!isSupabaseConfigured) {
    // Sample products (before Supabase is connected): same rules, done in memory
    let list = sampleProducts.map(fromSample);
    if (category !== "all") list = list.filter((p) => p.categories.includes(category));
    if (term) {
      const t = term.toLowerCase();
      list = list.filter((p) => {
        const labels = p.categories.map((id) => CATEGORY_MAP[id]?.label || "").join(" ");
        return `${p.code} ${p.name} ${p.description} ${labels}`.toLowerCase().includes(t);
      });
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "oldest") list.reverse();
    return { products: list.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), total: list.length, error: "" };
  }

  let q = supabase.from("products").select("*", { count: "exact" });
  if (category !== "all") q = q.contains("categories", [category]);
  if (inStockOnly) q = q.neq("in_stock", false);
  if (term) {
    const t = term.toLowerCase();
    const parts = [`name.ilike."*${term}*"`, `code.ilike."*${term}*"`, `description.ilike."*${term}*"`];
    // Typing "kitchen" or "baby" also finds products in that category
    for (const c of CATEGORIES) if (c.label.toLowerCase().includes(t)) parts.push(`categories.cs.{${c.id}}`);
    q = q.or(parts.join(","));
  }
  if (sort === "price-asc") q = q.order("price", { ascending: true });
  else if (sort === "price-desc") q = q.order("price", { ascending: false });
  else if (sort === "name-asc") q = q.order("name", { ascending: true });
  else if (sort === "name-desc") q = q.order("name", { ascending: false });
  else q = q.order("created_at", { ascending: sort === "oldest" });
  q = q.order("id").range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  const { data, count, error } = await q;
  if (error) {
    console.error("Could not load products:", error.message);
    return { products: [], total: 0, error: error.message };
  }
  return { products: data.map(normalize), total: count ?? data.length, error: "" };
}

// Number of products per category (for the category tiles) and in total
export async function getCategoryCounts() {
  const byCategory = {};
  let total = 0;
  if (!isSupabaseConfigured) {
    for (const p of sampleProducts) {
      total++;
      for (const id of p.categories || []) byCategory[id] = (byCategory[id] || 0) + 1;
    }
    return { byCategory, total };
  }
  const { data, count, error } = await supabase
    .from("products")
    .select("categories", { count: "exact" })
    .limit(5000);
  if (error) return { byCategory, total: 0 };
  total = count ?? data.length;
  for (const row of data) for (const id of row.categories || []) if (CATEGORY_MAP[id]) byCategory[id] = (byCategory[id] || 0) + 1;
  return { byCategory, total };
}

export async function getProducts() {
  if (!isSupabaseConfigured) return sampleProducts.map(fromSample);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    console.error("Could not load products:", error.message);
    return [];
  }
  return data.map(normalize);
}

export async function getProductById(id) {
  if (!isSupabaseConfigured) {
    const p = sampleProducts.find((s) => s.id === id);
    return p ? fromSample(p) : null;
  }
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return normalize(data);
}