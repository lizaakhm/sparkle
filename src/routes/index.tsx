import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS, filterProducts, type Category, type Product } from "@/lib/products";
import { CartProvider, useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sparkle — Fine Jewellery Catalog" },
      { name: "description", content: "Browse Sparkle's rings, necklaces, bracelets and earrings in delicate gold." },
      { property: "og:title", content: "Sparkle — Fine Jewellery Catalog" },
      { property: "og:description", content: "Delicate gold jewellery: rings, necklaces, bracelets and earrings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CartProvider>
      <Page />
    </CartProvider>
  ),
});

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function Page() {
  const [cats, setCats] = useState<Category[]>([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const list = filterProducts(PRODUCTS, cats, min === "" ? null : Number(min), max === "" ? null : Number(max));
  const toggle = (c: Category) => setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  const showOnly = (c: Category) => {
    setCats([c]);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative h-[85vh] min-h-[520px] overflow-hidden">
        <img src={hero} alt="Gold necklace and rings on ivory silk" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-lg animate-fade-up">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold">New Collection</p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
              Quiet <em>radiance</em>, made to be kept.
            </h1>
            <p className="mt-6 text-muted-foreground">Delicate gold pieces designed for everyday elegance.</p>
            <a href="#catalog" className="mt-8 inline-block border border-primary bg-primary px-8 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all duration-300 hover:bg-transparent hover:text-primary">
              Explore the catalog
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionTitle eyebrow="Featured" title="Collections" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CATEGORIES.map((c, i) => (
            <button key={c.id} onClick={() => showOnly(c.id)} className="group relative aspect-[3/4] overflow-hidden text-left animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <img src={c.image} alt={c.label} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
              <span className="absolute bottom-5 left-5 font-display text-2xl text-primary-foreground">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="catalog" className="scroll-mt-20 border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionTitle eyebrow="Shop" title="The Catalog" />
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            <aside className="space-y-10">
              <div>
                <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Category</h3>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  {CATEGORIES.map((c) => (
                    <label key={c.id} className="flex cursor-pointer items-center gap-3 text-sm">
                      <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 accent-gold" />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Price</h3>
                <div className="flex items-center gap-2">
                  <PriceInput label="Min price" value={min} onChange={setMin} />
                  <span className="text-muted-foreground">–</span>
                  <PriceInput label="Max price" value={max} onChange={setMax} />
                </div>
              </div>
              {(cats.length > 0 || min || max) && (
                <button onClick={() => { setCats([]); setMin(""); setMax(""); }} className="text-xs uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline">
                  Clear filters
                </button>
              )}
            </aside>
            <div>
              <p className="mb-6 text-sm text-muted-foreground">{list.length} pieces</p>
              {list.length === 0 ? (
                <p className="py-20 text-center font-display text-2xl text-muted-foreground">No pieces match your filters.</p>
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center">
        <p className="font-display text-2xl">sparkle</p>
        <p className="mt-2 text-xs text-muted-foreground">© 2026 Sparkle Fine Jewellery</p>
      </footer>

      <CartDrawer />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
      <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
      <div className="mx-auto mt-5 h-px w-16 bg-gold" />
    </div>
  );
}

function PriceInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <input type="number" min={0} inputMode="numeric" aria-label={label} placeholder={label.split(" ")[0]} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-gold" />
  );
}

function Header() {
  const { count, setOpen } = useCart();
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="font-display text-3xl tracking-wide">sparkle</a>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.25em] md:flex">
          <a href="#catalog" className="transition-colors hover:text-gold">Catalog</a>
        </nav>
        <button onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`} className="relative p-2 transition-colors hover:text-gold">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {count > 0 && (
            <span className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-accent-foreground ${bump ? "animate-pop" : ""}`}>
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <article className="group animate-fade-up">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <button
          onClick={() => { add(product.id); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
          className="absolute inset-x-4 bottom-4 bg-primary py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all duration-300 hover:bg-gold hover:text-accent-foreground md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{product.category}</p>
          <h3 className="font-display text-xl">{product.name}</h3>
        </div>
        <p className="text-sm text-gold">{money(product.price)}</p>
      </div>
    </article>
  );
}

function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-overlay transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-label="Shopping cart" className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-soft transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-2xl">Your Cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="p-1 transition-colors hover:text-gold"><X className="h-5 w-5" strokeWidth={1.5} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map(({ id, qty, product }) => (
                <li key={id} className="flex gap-4 py-5">
                  <img src={product.image} alt={product.name} className="h-20 w-20 object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-display text-lg leading-tight">{product.name}</p>
                      <button onClick={() => remove(id)} aria-label={`Remove ${product.name}`} className="text-muted-foreground transition-colors hover:text-destructive"><X className="h-4 w-4" /></button>
                    </div>
                    <p className="text-sm text-gold">{money(product.price)}</p>
                    <div className="mt-auto flex items-center border border-border self-start">
                      <button onClick={() => setQty(id, qty - 1)} aria-label="Decrease quantity" className="p-2 hover:text-gold"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button onClick={() => setQty(id, qty + 1)} aria-label="Increase quantity" className="p-2 hover:text-gold"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border px-6 py-5">
          <div className="flex justify-between text-sm">
            <span className="uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
            <span className="font-medium">{money(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">This is a browsing catalog — online ordering isn't available.</p>
        </div>
      </aside>
    </div>
  );
}
