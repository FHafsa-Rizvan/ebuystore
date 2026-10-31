import { supabase, isSupabaseConfigured } from "./supabase";
import { products as sampleProducts } from "@/data/products";

// Turns a database row into the shape the storefront components use.
function normalize(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description || "",
    image: row.image_url || null,
    inStock: row.in_stock !== false,
    emoji: row.emoji || "🛍️",
    color: row.color || "#f1ede6",
  };
}

export async function getProducts() {
  if (!isSupabaseConfigured) {
    return sampleProducts.map((p) => ({ ...p, image: p.image || null, inStock: true }));
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Could not load products:", error.message);
    return [];
  }
  return data.map(normalize);
}

export async function getProductById(id) {
  if (!isSupabaseConfigured) {
    const p = sampleProducts.find((s) => s.id === id);
    return p ? { ...p, image: p.image || null, inStock: true } : null;
  }
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return normalize(data);
}
