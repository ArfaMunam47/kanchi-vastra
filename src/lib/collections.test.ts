import { describe, expect, it } from "vitest";
import { collections, collectionProducts } from "./collections";
import { boutiqueViews } from "./boutique-tour";

describe("Boutique collections", () => {
  it("represents all nine collection directions", () => {
    expect(collections.map((c) => c.name)).toEqual([
      "The Kanchipuram Heritage",
      "The Banarasi Gold Edit",
      "The Temple Collection",
      "The Ivory Heirlooms",
      "The Festive Edit",
      "The Modern Muse",
      "Bridal Classics",
      "Contemporary Silks",
      "The Royal Drapes",
    ]);
  });
  it.each(collections)("opens relevant products for $id", (c) => {
    expect(
      collectionProducts(c.id)
        .map((p) => p.id)
        .sort(),
    ).toEqual([...c.ids].sort());
  });
  it("does not show unrelated products for an unknown collection", () => {
    expect(collectionProducts("missing-edit")).toEqual([]);
  });
  it("offers all nine collection directions in the guided physical boutique", () => {
    expect(boutiqueViews.map((view) => view.id)).toEqual([
      "kanchipuram-heritage",
      "banarasi-gold",
      "temple",
      "ivory-heirlooms",
      "festive",
      "modern-muse",
      "bridal-classics",
      "contemporary-silks",
      "royal-drapes",
    ]);
    expect(boutiqueViews.map((view) => collectionProducts(view.id).length)).toEqual([
      2, 3, 2, 2, 3, 3, 2, 2, 2,
    ]);
  });
  it("places the deepest collection bay within the boutique floor", () => {
    const deepest = boutiqueViews[boutiqueViews.length - 1]!;
    expect(deepest.z).toBeLessThanOrEqual(-13);
    expect(deepest.z).toBeGreaterThanOrEqual(-16);
  });
});
