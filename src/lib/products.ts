import s1 from "@/assets/s1.jpg";
import s2 from "@/assets/s2.jpg";
import s3 from "@/assets/s3.jpg";
import s4 from "@/assets/s4.jpg";
import s5 from "@/assets/s5.jpg";
import s6 from "@/assets/s6.jpg";
import festive from "@/assets/festive.jpg";
import muse from "@/assets/muse.jpg";
import bridalClassics from "@/assets/bridal-classics.jpg";
import contemporarySilks from "@/assets/contemporary-silks.jpg";
import royalDrapes from "@/assets/royal-drapes.jpg";

export const images = { s1, s2, s3, s4, s5, s6 };

export type Category = "Banarasi" | "Organza" | "Kanjivaram" | "Bridal";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  colors: { name: string; swatch: string; image: string }[];
  gallery: string[];
  isNew?: boolean;
}

const sw = { red: "oklch(0.45 0.17 25)", ivory: "oklch(0.95 0.03 85)", rose: "oklch(0.72 0.09 5)", green: "oklch(0.4 0.1 155)", mustard: "oklch(0.75 0.15 80)", crimson: "oklch(0.38 0.15 22)", wine: "oklch(0.34 0.09 320)", blue: "oklch(0.78 0.05 250)" };

export const products: Product[] = [
  { id: "ruby-banarasi", name: "Ruby Zari Banarasi", category: "Banarasi", price: 28900, isNew: true,
    description: "Handwoven pure katan silk with real zari buttis and a heavy pallu, woven over 21 days in Varanasi.",
    colors: [{ name: "Ruby", swatch: sw.red, image: s1 }, { name: "Mustard", swatch: sw.mustard, image: s5 }], gallery: [s1, s6, s5] },
  { id: "ivory-organza-bloom", name: "Ivory Organza Bloom", category: "Organza", price: 18400, isNew: true,
    description: "Feather-light organza with hand-embroidered gold florals and a scalloped border. Made for day celebrations.",
    colors: [{ name: "Ivory", swatch: sw.ivory, image: s2 }, { name: "Rose", swatch: sw.rose, image: s3 }], gallery: [s2, s3, s1] },
  { id: "rose-net-embroidered", name: "Rose Net Embroidered", category: "Organza", price: 21600,
    description: "Soft net saree with sequin and thread embroidery in blush tones, paired with a matching blouse piece.",
    colors: [{ name: "Rose", swatch: sw.rose, image: s3 }, { name: "Ivory", swatch: sw.ivory, image: s2 }], gallery: [s3, s2, s6] },
  { id: "emerald-kanjivaram", name: "Emerald Temple Kanjivaram", category: "Kanjivaram", price: 34500, isNew: true,
    description: "Mulberry silk Kanjivaram with a contrasting temple border, woven in Kanchipuram with pure gold zari.",
    colors: [{ name: "Emerald", swatch: sw.green, image: s4 }, { name: "Ruby", swatch: sw.red, image: s1 }], gallery: [s4, s5, s1] },
  { id: "marigold-silk", name: "Marigold Courtyard Silk", category: "Kanjivaram", price: 24200,
    description: "Sunlit mustard silk with a vermilion border. A festive classic for haldi and pooja mornings.",
    colors: [{ name: "Marigold", swatch: sw.mustard, image: s5 }, { name: "Emerald", swatch: sw.green, image: s4 }], gallery: [s5, s4, s2] },
  { id: "rani-bridal", name: "Rani Bridal Lehenga Saree", category: "Bridal", price: 89000, isNew: true,
    description: "Velvet and net bridal drape with zardozi, dabka and pearl work. Includes a double dupatta.",
    colors: [{ name: "Crimson", swatch: sw.crimson, image: s6 }], gallery: [s6, s1, s3] },
  { id: "sindoor-bridal", name: "Sindoor Heirloom Banarasi", category: "Bridal", price: 64000,
    description: "Bridal Banarasi in sindoor red with kadhwa weave motifs — an heirloom to be passed down.",
    colors: [{ name: "Sindoor", swatch: sw.red, image: s1 }, { name: "Crimson", swatch: sw.crimson, image: s6 }], gallery: [s1, s6, s4] },
  { id: "pearl-organza", name: "Pearl Tissue Organza", category: "Organza", price: 15800,
    description: "Tissue organza with a soft sheen and pearl-studded border. Minimal, luminous, effortless.",
    colors: [{ name: "Pearl", swatch: sw.ivory, image: s2 }], gallery: [s2, s5, s3] },
  { id: "haldi-banarasi", name: "Haldi Kadhwa Banarasi", category: "Banarasi", price: 26700,
    description: "Turmeric-toned Banarasi with a red meenakari border and floral jaal across the body.",
    colors: [{ name: "Haldi", swatch: sw.mustard, image: s5 }, { name: "Ruby", swatch: sw.red, image: s1 }], gallery: [s5, s1, s4] },
  { id: "magenta-festive", name: "Magenta Celebration", category: "Banarasi", price: 31200, isNew: true,
    description: "A creative collection study in magenta, with an ornate gold-toned border and a sweeping ceremonial drape.",
    colors: [{ name: "Magenta", swatch: sw.rose, image: festive }], gallery: [festive] },
  { id: "sage-modern-muse", name: "Silver Sage Muse", category: "Organza", price: 19800, isNew: true,
    description: "A contemporary collection study in silver sage, with a luminous sheer finish and understated detailing.",
    colors: [{ name: "Sage", swatch: sw.green, image: muse }], gallery: [muse] },
  { id: "rosewood-bridal", name: "Rosewood Bridal Classic", category: "Bridal", price: 72000, isNew: true,
    description: "A classic bridal drape in deep crimson silk with gold-toned embroidery and a sweeping zari pallu.",
    colors: [{ name: "Crimson", swatch: sw.red, image: bridalClassics }, { name: "Wine", swatch: sw.wine, image: royalDrapes }], gallery: [bridalClassics, s6, royalDrapes] },
  { id: "champagne-silk", name: "Champagne Contemporary Silk", category: "Organza", price: 22400, isNew: true,
    description: "A feather-weight silk in champagne and powder blue with a clean satin border, styled for quiet modern celebrations.",
    colors: [{ name: "Champagne", swatch: sw.ivory, image: contemporarySilks }, { name: "Powder Blue", swatch: sw.blue, image: contemporarySilks }], gallery: [contemporarySilks, s2, s3] },
  { id: "royal-wine", name: "Royal Wine Kanjivaram", category: "Kanjivaram", price: 46800, isNew: true,
    description: "A regal wine-purple silk with an ornate antique gold border and a temple-inspired pallu.",
    colors: [{ name: "Wine", swatch: sw.wine, image: royalDrapes }, { name: "Mustard", swatch: sw.mustard, image: s5 }], gallery: [royalDrapes, s5, s1] },
];

export const categories: Category[] = ["Banarasi", "Organza", "Kanjivaram", "Bridal"];
export const sizes = ["Free Size", "Blouse 34", "Blouse 36", "Blouse 38", "Blouse 40"];

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
export const getProduct = (id: string) => products.find((p) => p.id === id);

export type SortKey = "featured" | "price-asc" | "price-desc" | "new";
export function filterSort(list: Product[], cat: Category | "All", sort: SortKey) {
  const out = cat === "All" ? [...list] : list.filter((p) => p.category === cat);
  if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
  if (sort === "new") out.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  return out;
}
