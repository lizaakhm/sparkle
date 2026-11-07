import { describe, expect, it } from "vitest";
import { PRODUCTS, filterProducts } from "@/lib/products";
import { addLine, setLineQty } from "@/lib/cart";

describe("catalog rules", () => {
  it("filters by category and price range", () => {
    const r = filterProducts(PRODUCTS, ["rings"], 100, 300);
    expect(r.map((p) => p.id)).toEqual(["r1"]);
  });
  it("adding twice increments quantity", () => {
    expect(addLine(addLine([], "r1"), "r1")).toEqual([{ id: "r1", qty: 2 }]);
  });
  it("quantity zero removes the item", () => {
    expect(setLineQty([{ id: "r1", qty: 1 }], "r1", 0)).toEqual([]);
  });
});
