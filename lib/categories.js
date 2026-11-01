// The category list for the whole shop. To add a category, copy one line, give it a new `id`,
// a name, an icon (browse names at https://react-icons.github.io/react-icons/icons/lu/ and import
// them below) and a colour pair. Staff then see it automatically in the admin.
//
// A product can belong to several categories. Products store the category ids, e.g. ["kitchen", "gifts"].
// Do not change an existing `id` once products use it.

import {
  LuMicrowave, LuUtensils, LuWine, LuLamp, LuWatch, LuShirt, LuBriefcase, LuBaby, LuPuzzle,
  LuApple, LuSmartphone, LuSparkles, LuPenLine, LuDumbbell, LuHammer, LuSprayCan, LuGift, LuPawPrint,
} from "react-icons/lu";

export const CATEGORIES = [
  { id: "household",   label: "Household & home appliances",   short: "Household & appliances", Icon: LuMicrowave,  color: "#2f7d6d", tint: "#dff1ec" },
  { id: "kitchen",     label: "Kitchen & dining",              short: "Kitchen & dining",       Icon: LuUtensils,   color: "#c2562f", tint: "#fbe6dc" },
  { id: "glassware",   label: "Glassware & crockery",          short: "Glassware",              Icon: LuWine,       color: "#3a7bb8", tint: "#e0eefa" },
  { id: "decor",       label: "Home decor & furnishing",       short: "Home decor",             Icon: LuLamp,       color: "#b0488f", tint: "#f8e3f1" },
  { id: "watches",     label: "Watches & fashion accessories", short: "Watches & fashion",      Icon: LuWatch,      color: "#9a7420", tint: "#f6ecd2" },
  { id: "clothing",    label: "Clothing & footwear",           short: "Clothing",               Icon: LuShirt,      color: "#7a4fb5", tint: "#ece4f8" },
  { id: "bags",        label: "Bags & luggage",                short: "Bags & luggage",         Icon: LuBriefcase,  color: "#8a5a2b", tint: "#f1e4d3" },
  { id: "baby",        label: "Baby & kids",                   short: "Baby & kids",            Icon: LuBaby,       color: "#d9568a", tint: "#fde4ee" },
  { id: "toys",        label: "Toys & games",                  short: "Toys & games",           Icon: LuPuzzle,     color: "#d9811a", tint: "#fdeccf" },
  { id: "food",        label: "Food & beverages",              short: "Food",                   Icon: LuApple,      color: "#4a9435", tint: "#e6f4de" },
  { id: "electronics", label: "Electronics & gadgets",         short: "Electronics",            Icon: LuSmartphone, color: "#2d5fd0", tint: "#e1e9fb" },
  { id: "beauty",      label: "Health & beauty",               short: "Health & beauty",        Icon: LuSparkles,   color: "#d6455d", tint: "#fbe1e5" },
  { id: "stationery",  label: "Stationery & office",           short: "Stationery",             Icon: LuPenLine,    color: "#566475", tint: "#e7ebf0" },
  { id: "sports",      label: "Sports & fitness",              short: "Sports & fitness",       Icon: LuDumbbell,   color: "#1f8a8a", tint: "#dcf1f1" },
  { id: "tools",       label: "Tools & garden",                short: "Tools & garden",         Icon: LuHammer,     color: "#667f1d", tint: "#eef3d8" },
  { id: "cleaning",    label: "Cleaning & laundry",            short: "Cleaning",               Icon: LuSprayCan,   color: "#1f95ae", tint: "#dbf1f6" },
  { id: "gifts",       label: "Gifts & party",                 short: "Gifts & party",          Icon: LuGift,       color: "#cf4439", tint: "#fbe0dd" },
  { id: "pets",        label: "Pet supplies",                  short: "Pet supplies",           Icon: LuPawPrint,   color: "#7d6258", tint: "#efe6e1" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id) {
  return CATEGORY_MAP[id] || null;
}

// The first version of the shop used four free-text categories. Products saved back then are
// mapped to the new ids automatically so nothing disappears.
export const LEGACY_CATEGORY = {
  homeware: "household",
  glassware: "glassware",
  kitchenware: "kitchen",
  decor: "decor",
};
