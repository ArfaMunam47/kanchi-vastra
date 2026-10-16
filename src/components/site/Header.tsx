import { Link } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBag, subtotal } from "@/lib/bag";
import { formatINR } from "@/lib/products";

export function Header({ overlay = false }: { overlay?: boolean }) {
  const { items, setOpen } = useBag();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 80);
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  const solid = !overlay || scrolled;
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${solid ? "bg-background/90 text-foreground backdrop-blur-md shadow-sm" : "bg-transparent text-primary-foreground"}`}>
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-6 md:px-10">
          <nav className="hidden gap-8 eyebrow md:flex">
            <a href="/#gallery" className="hover:text-accent">Exhibition</a>
            <a href="/#collection" className="hover:text-accent">Bridal</a>
            <a href="/#shop" className="hover:text-accent">Shop</a>
            <a href="/#trends" className="hover:text-accent">Trends</a>
          </nav>
          <Link to="/" className="font-display text-2xl tracking-[0.25em]">KANCHI VASTRA</Link>
          <button onClick={() => setOpen(true)} className="relative flex items-center gap-2 eyebrow" aria-label="Open shopping bag">
            <ShoppingBag className="h-5 w-5" /> <span className="hidden md:inline">Bag</span>
            {count > 0 && <span className="absolute -right-3 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{count}</span>}
          </button>
        </div>
      </header>
      <BagDrawer />
    </>
  );
}

function BagDrawer() {
  const { items, open, setOpen, setQty } = useBag();
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-3xl">Your Bag</h2>
          <button onClick={() => setOpen(false)} aria-label="Close bag"><X /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {items.length === 0 && <p className="text-muted-foreground">Your bag is empty.</p>}
          {items.map((i) => (
            <div key={i.key} className="flex gap-4">
              <img src={i.image} alt={i.name} className="h-28 w-20 object-cover" />
              <div className="flex-1">
                <p className="font-display text-xl">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.color} · {i.size}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border">
                    <button className="p-1.5" onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button className="p-1.5" onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="text-sm">{formatINR(i.price * i.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-6">
          <div className="mb-4 flex justify-between"><span className="eyebrow">Subtotal</span><span className="font-display text-2xl">{formatINR(subtotal(items))}</span></div>
          <button className="w-full rounded-full bg-primary py-4 eyebrow text-primary-foreground hover:bg-burgundy">Checkout</button>
        </div>
      </aside>
    </div>
  );
}
