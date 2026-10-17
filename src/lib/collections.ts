import { images, products } from "./products";
import festive from "@/assets/festive.jpg";
import muse from "@/assets/muse.jpg";

export const collections = [
  { id: "kanchipuram-heritage", name: "The Kanchipuram Heritage", note: "Silk, in its most expressive form.", description: "Jewel tones and architectural borders, inspired by the visual language of southern Indian textiles.", image: images.s4, ids: ["emerald-kanjivaram", "marigold-silk"], theme: "heritage" },
  { id: "banarasi-gold", name: "The Banarasi Gold Edit", note: "A little opulence. An enduring impression.", description: "Rich reds and gold-toned floral details, an edit inspired by the beauty of brocade.", image: images.s1, ids: ["ruby-banarasi", "haldi-banarasi", "sindoor-bridal"], theme: "gold" },
  { id: "temple", name: "The Temple Collection", note: "Where architecture becomes adornment.", description: "Graphic borders, emerald and marigold: a study of rhythm, geometry and ceremony.", image: images.s5, ids: ["marigold-silk", "emerald-kanjivaram"], theme: "temple" },
  { id: "ivory-heirlooms", name: "The Ivory Heirlooms", note: "Quiet beauty, beautifully considered.", description: "Pearl, ivory and subtle gold accents in light, luminous occasion drapes.", image: images.s2, ids: ["ivory-organza-bloom", "pearl-organza"], theme: "ivory" },
  { id: "festive", name: "The Festive Edit", note: "For moments that deserve colour.", description: "Magenta, crimson and celebratory drapes with a confident, expressive spirit.", image: festive, ids: ["magenta-festive", "rani-bridal", "sindoor-bridal"], theme: "festive" },
  { id: "modern-muse", name: "The Modern Muse", note: "Tradition, with a new point of view.", description: "Silver sage, blush and feather-light silhouettes, styled with a contemporary sensibility.", image: muse, ids: ["sage-modern-muse", "rose-net-embroidered", "pearl-organza"], theme: "modern" },
] as const;

export const getCollection = (id: string) => collections.find(c => c.id === id);
export const collectionProducts = (id: string) => {
  const c = getCollection(id);
  return c ? products.filter(p => c.ids.some(productId => productId === p.id)) : [];
};