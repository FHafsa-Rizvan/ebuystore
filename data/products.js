// Sample products, shown only until Supabase is set up (after that, products come from /admin).
// `categories` lists category ids from lib/categories.js. A product can have several.
// `images` is optional: add file paths such as "/products/vase.jpg" (files go in /public/products).
// Without images, the emoji + color is shown as a placeholder.

export const products = [
  { id: "crystal-wine-glasses", name: "Crystal Wine Glasses (Set of 6)", categories: ["glassware", "kitchen", "gifts"], price: 4500, emoji: "🍷", color: "#f6ecd2", description: "Elegant lead-free crystal wine glasses. Perfect for dinners and gifting. Hand wash recommended." },
  { id: "tumbler-set", name: "Everyday Tumblers (Set of 6)", categories: ["glassware", "kitchen"], price: 2200, emoji: "🥛", color: "#f3e5bd", description: "Sturdy, stackable tumblers for water, juice and soft drinks." },
  { id: "glass-water-jug", name: "Glass Water Jug with Lid", categories: ["glassware", "kitchen"], price: 1800, emoji: "🫗", color: "#faf3e0", description: "1.5 litre borosilicate glass jug with a tight-fitting lid." },
  { id: "glass-storage-jars", name: "Glass Storage Jars (Set of 3)", categories: ["kitchen", "glassware"], price: 2900, emoji: "🫙", color: "#efe0b8", description: "Airtight jars for rice, spices and snacks. Microwave-safe glass." },
  { id: "dinner-plates", name: "Ceramic Dinner Plates (Set of 4)", categories: ["kitchen", "glassware"], price: 3600, emoji: "🍽️", color: "#f6ecd2", description: "Durable glazed ceramic plates with a smooth matte finish." },
  { id: "cotton-towels", name: "Cotton Bath Towels (Pack of 2)", categories: ["household"], price: 3200, emoji: "🛁", color: "#f3e5bd", description: "Soft, absorbent 100% cotton towels, quick drying." },
  { id: "cushion-covers", name: "Cushion Covers (Pack of 4)", categories: ["decor", "household"], price: 2400, emoji: "🛋️", color: "#faf3e0", description: "Textured cushion covers with hidden zip. Fits 16 x 16 inch cushions." },
  { id: "bamboo-organizer", name: "Bamboo Drawer Organizer", categories: ["household", "decor"], price: 1500, emoji: "🧺", color: "#efe0b8", description: "Adjustable bamboo organizer to keep drawers neat." },
  { id: "non-stick-pan", name: "Non-Stick Frying Pan 28cm", categories: ["kitchen", "household"], price: 3800, emoji: "🍳", color: "#f6ecd2", description: "Even heating, PFOA-free non-stick coating, suitable for gas and induction." },
  { id: "cutlery-set", name: "Stainless Steel Cutlery (24 pcs)", categories: ["kitchen", "gifts"], price: 4200, emoji: "🥄", color: "#f3e5bd", description: "Mirror-polished stainless steel set for 6 people." },
  { id: "ceramic-vase", name: "Ceramic Flower Vase", categories: ["decor", "gifts"], price: 2700, emoji: "🏺", color: "#faf3e0", description: "Hand-finished ceramic vase to brighten any room." },
  { id: "scented-candles", name: "Scented Candle Trio", categories: ["decor", "gifts", "beauty"], price: 2100, emoji: "🕯️", color: "#efe0b8", description: "Three soy-wax candles in glass jars: vanilla, jasmine and sandalwood." },
  { id: "rice-cooker", name: "Rice Cooker 1.8L", categories: ["household", "kitchen"], price: 8900, emoji: "🍚", color: "#f6ecd2", description: "Sample product. Replace with your own." },
  { id: "wireless-earbuds", name: "Wireless Earbuds", categories: ["electronics"], price: 6500, emoji: "🎧", color: "#f3e5bd", description: "Sample product. Replace with your own." },
  { id: "power-bank", name: "Power Bank 10000mAh", categories: ["electronics"], price: 4200, emoji: "🔋", color: "#faf3e0", description: "Sample product. Replace with your own." },
  { id: "mens-watch", name: "Men's Analog Watch", categories: ["watches", "gifts"], price: 7800, emoji: "⌚", color: "#efe0b8", description: "Sample product. Replace with your own." },
  { id: "canvas-tote", name: "Canvas Tote Bag", categories: ["bags", "watches"], price: 2300, emoji: "👜", color: "#f6ecd2", description: "Sample product. Replace with your own." },
  { id: "feeding-bottle", name: "Baby Feeding Bottle Set", categories: ["baby"], price: 2600, emoji: "🍼", color: "#f3e5bd", description: "Sample product. Replace with your own." },
  { id: "building-blocks", name: "Kids Building Blocks", categories: ["toys", "baby"], price: 3100, emoji: "🧱", color: "#faf3e0", description: "Sample product. Replace with your own." },
  { id: "tea-gift-box", name: "Ceylon Tea Gift Box", categories: ["food", "gifts"], price: 1900, emoji: "🍵", color: "#efe0b8", description: "Sample product. Replace with your own." },
  { id: "cookie-tin", name: "Assorted Cookies Tin", categories: ["food", "gifts"], price: 1400, emoji: "🍪", color: "#f6ecd2", description: "Sample product. Replace with your own." },
];

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function formatPrice(n) {
  return `Rs. ${n.toLocaleString("en-LK")}`;
}