import { formatPrice } from "@/data/products";

// Digits only, with country code. Set in .env.local as NEXT_PUBLIC_WHATSAPP_NUMBER
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export function isWhatsAppConfigured() {
  return /^\d{8,15}$/.test(WHATSAPP_NUMBER);
}

export function buildOrderMessage(items, customer = {}) {
  const lines = items.map(
    (i, idx) => `${idx + 1}. ${i.name} x${i.qty} - ${formatPrice(i.price * i.qty)}`
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const parts = [
    "Hello Ebuy, I'd like to place an order:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
  ];

  const details = [];
  if (customer.name) details.push(`Name: ${customer.name}`);
  if (customer.phone) details.push(`Phone: ${customer.phone}`);
  if (customer.address) details.push(`Delivery address: ${customer.address}`);
  if (customer.notes) details.push(`Notes: ${customer.notes}`);
  if (details.length) parts.push("", ...details);

  return parts.join("\n");
}

export function buildWhatsAppUrl(items, customer) {
  const text = encodeURIComponent(buildOrderMessage(items, customer));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
