import { collections } from "./collections";

export const boutiqueViews = collections.map((collection, index) => ({
  ...collection,
  shortName: ["Heritage", "Banarasi", "Temple", "Ivory", "Festive", "Muse", "Bridal", "Silks", "Royal"][index] ?? collection.name,
  side: index % 2 === 0 ? -1 : 1,
  z: -2.8 - Math.floor(index / 2) * 3,
}));
