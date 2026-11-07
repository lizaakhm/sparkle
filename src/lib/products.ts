import ring1 from "@/assets/ring1.jpg";
import ring2 from "@/assets/ring2.jpg";
import necklace1 from "@/assets/necklace1.jpg";
import bracelet1 from "@/assets/bracelet1.jpg";
import bracelet2 from "@/assets/bracelet2.jpg";
import earrings1 from "@/assets/earrings1.jpg";
import earrings2 from "@/assets/earrings2.jpg";

export type Category = "rings" | "necklaces" | "bracelets" | "earrings";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
}

export const CATEGORIES: { id: Category; label: string; image: string }[] = [
  { id: "rings", label: "Rings", image: ring2 },
  { id: "necklaces", label: "Necklaces", image: necklace1 },
  { id: "bracelets", label: "Bracelets", image: bracelet1 },
  { id: "earrings", label: "Earrings", image: earrings1 },
];

export const PRODUCTS: Product[] = [
  { id: "r1", name: "Solitaire Whisper Ring", price: 240, category: "rings", image: ring1 },
  { id: "r2", name: "Trio Stacking Set", price: 320, category: "rings", image: ring2 },
  { id: "n1", name: "Teardrop Pendant", price: 280, category: "necklaces", image: necklace1 },
  { id: "b1", name: "Pearl Station Bracelet", price: 180, category: "bracelets", image: bracelet1 },
  { id: "b2", name: "Sculpted Gold Cuff", price: 420, category: "bracelets", image: bracelet2 },
  { id: "e1", name: "Pearl Drop Earrings", price: 210, category: "earrings", image: earrings1 },
  { id: "e2", name: "Classic Gold Hoops", price: 160, category: "earrings", image: earrings2 },
  { id: "r3", name: "Petite Diamond Band", price: 95, category: "rings", image: ring1 },
  { id: "n2", name: "Infinity Loop Necklace", price: 360, category: "necklaces", image: necklace1 },
  { id: "e3", name: "Mini Huggie Hoops", price: 85, category: "earrings", image: earrings2 },
  { id: "b3", name: "Bold Bangle", price: 520, category: "bracelets", image: bracelet2 },
  { id: "n3", name: "Dainty Solitaire Chain", price: 140, category: "necklaces", image: necklace1 },
];

export function filterProducts(
  list: Product[],
  categories: Category[],
  min: number | null,
  max: number | null,
) {
  return list.filter(
    (p) =>
      (categories.length === 0 || categories.includes(p.category)) &&
      (min === null || p.price >= min) &&
      (max === null || p.price <= max),
  );
}
