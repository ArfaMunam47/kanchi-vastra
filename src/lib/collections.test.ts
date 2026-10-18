import { describe, expect, it } from "vitest";
import { collections, collectionProducts } from "./collections";

describe("Boutique collections", () => {
  it("represents all six requested collection directions", () => {
    expect(collections.map(c=>c.name)).toEqual(["The Kanchipuram Heritage", "The Banarasi Gold Edit", "The Temple Collection", "The Ivory Heirlooms", "The Festive Edit", "The Modern Muse"]);
  });
  it.each(collections)("opens relevant products for $id", c => {
    expect(collectionProducts(c.id).map(p=>p.id).sort()).toEqual([...c.ids].sort());
  });
  it("does not show unrelated products for an unknown collection", () => {
    expect(collectionProducts("missing-edit")).toEqual([]);
  });
});