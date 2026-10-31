// Replace these sample products with Ebuy's real catalog.
// `image` is optional: put a file in /public/products and use e.g. "/products/vase.jpg".
// Without an image, the emoji + color is shown as a placeholder.

export const categories = ["Homeware", "Glassware", "Kitchenware", "Decor"];

export const products = [
  { id: "crystal-wine-glasses", name: "Crystal Wine Glasses (Set of 6)", category: "Glassware", price: 4500, emoji: "🍷", color: "#f4e6ea", description: "Elegant lead-free crystal wine glasses. Perfect for dinners and gifting. Hand wash recommended." },
  { id: "tumbler-set", name: "Everyday Tumblers (Set of 6)", category: "Glassware", price: 2200, emoji: "🥛", color: "#e6f1f5", description: "Sturdy, stackable tumblers for water, juice and soft drinks." },
  { id: "glass-water-jug", name: "Glass Water Jug with Lid", category: "Glassware", price: 1800, emoji: "🫗", color: "#e3f2ee", description: "1.5 litre borosilicate glass jug with a tight-fitting lid." },
  { id: "glass-storage-jars", name: "Glass Storage Jars (Set of 3)", category: "Glassware", price: 2900, emoji: "🫙", color: "#eef3e2", description: "Airtight jars for rice, spices and snacks. Microwave-safe glass." },
  { id: "dinner-plates", name: "Ceramic Dinner Plates (Set of 4)", category: "Homeware", price: 3600, emoji: "🍽️", color: "#f7efe1", description: "Durable glazed ceramic plates with a smooth matte finish." },
  { id: "cotton-towels", name: "Cotton Bath Towels (Pack of 2)", category: "Homeware", price: 3200, emoji: "🛁", color: "#e5ecf7", description: "Soft, absorbent 100% cotton towels, quick drying." },
  { id: "cushion-covers", name: "Cushion Covers (Pack of 4)", category: "Homeware", price: 2400, emoji: "🛋️", color: "#f3e4e0", description: "Textured cushion covers with hidden zip. Fits 16 x 16 inch cushions." },
  { id: "bamboo-organizer", name: "Bamboo Drawer Organizer", category: "Homeware", price: 1500, emoji: "🧺", color: "#efe8d6", description: "Adjustable bamboo organizer to keep drawers neat." },
  { id: "non-stick-pan", name: "Non-Stick Frying Pan 28cm", category: "Kitchenware", price: 3800, emoji: "🍳", color: "#e9e9ee", description: "Even heating, PFOA-free non-stick coating, suitable for gas and induction." },
  { id: "cutlery-set", name: "Stainless Steel Cutlery (24 pcs)", category: "Kitchenware", price: 4200, emoji: "🥄", color: "#ececec", description: "Mirror-polished stainless steel set for 6 people." },
  { id: "ceramic-vase", name: "Ceramic Flower Vase", category: "Decor", price: 2700, emoji: "🏺", color: "#f6e8d8", description: "Hand-finished ceramic vase to brighten any room." },
  { id: "scented-candles", name: "Scented Candle Trio", category: "Decor", price: 2100, emoji: "🕯️", color: "#f5ecd9", description: "Three soy-wax candles in glass jars: vanilla, jasmine and sandalwood." },
];

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function formatPrice(n) {
  return `Rs. ${n.toLocaleString("en-LK")}`;
}
