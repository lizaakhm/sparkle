import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

export type CartLine = { id: string; qty: number };

export function addLine(lines: CartLine[], id: string): CartLine[] {
  const found = lines.find((l) => l.id === id);
  return found
    ? lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
    : [...lines, { id, qty: 1 }];
}

export function setLineQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  return qty <= 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty } : l));
}

interface CartCtx {
  items: (CartLine & { product: Product })[];
  count: number;
  subtotal: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sparkle-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const items = lines
      .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.id)! }))
      .filter((l) => l.product);
    return {
      items,
      count: items.reduce((s, l) => s + l.qty, 0),
      subtotal: items.reduce((s, l) => s + l.qty * l.product.price, 0),
      add: (id) => setLines((ls) => addLine(ls, id)),
      setQty: (id, qty) => setLines((ls) => setLineQty(ls, id, qty)),
      remove: (id) => setLines((ls) => setLineQty(ls, id, 0)),
      open,
      setOpen,
    };
  }, [lines, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
