import { describe, it, expect } from "vitest";
import { addItem, subtotal } from "./bag";
import { filterSort, products } from "./products";

describe("bag", () => {
  const base = { id: "a", name: "A", image: "", color: "Ruby", size: "Free Size", price: 1000, qty: 1 };
  it("merges same variant and sums subtotal", () => {
    let items = addItem([], base);
    items = addItem(items, { ...base, qty: 2 });
    items = addItem(items, { ...base, size: "Blouse 36", price: 500 });
    expect(items).toHaveLength(2);
    expect(subtotal(items)).toBe(3500);
  });
  it("sorts by price ascending and filters category", () => {
    const r = filterSort(products, "Bridal", "price-asc");
    expect(r.every((p) => p.category === "Bridal")).toBe(true);
    expect(r[0]!.price).toBeLessThan(r[1]!.price);
  });
});
