import { supabase, isSupabaseConfigured } from "./supabase";
import { products as sampleProducts } from "@/data/products";
import { CATEGORY_MAP, LEGACY_CATEGORY } from "./categories";

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