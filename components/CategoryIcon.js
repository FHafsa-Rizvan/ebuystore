import { getCategory } from "@/lib/categories";

// A coloured square with the category icon. Used on the shop, product pages and in the admin.
export function CategoryIcon({ id, size = 26, box = 48, radius = 14 }) {
  const c = getCategory(id);
  if (!c) return null;
  const { Icon } = c;
  return (
    <span
      className="cat-ico"
      aria-hidden="true"
      style={{ width: box, height: box, borderRadius: radius, background: c.tint, color: c.color }}
    >
      <Icon size={size} />
    </span>
  );
}

// A small pill: icon + short name. Used on product cards and product pages.
export function CategoryTag({ id, full = false }) {
  const c = getCategory(id);
  if (!c) return null;
  const { Icon } = c;
  return (
    <span className="tag" style={{ background: c.tint, color: c.color }}>
      <Icon size={14} aria-hidden="true" />
      {full ? c.label : c.short}
    </span>
  );
}
