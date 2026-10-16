import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface BagItem { key: string; id: string; name: string; image: string; color: string; size: string; price: number; qty: number }

export function addItem(items: BagItem[], item: Omit<BagItem, "key">): BagItem[] {
  const key = `${item.id}|${item.color}|${item.size}`;
  const found = items.find((i) => i.key === key);
  if (found) return items.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i));
  return [...items, { ...item, key }];
}
export const subtotal = (items: BagItem[]) => items.reduce((s, i) => s + i.price * i.qty, 0);

interface Ctx { items: BagItem[]; open: boolean; setOpen: (o: boolean) => void; add: (i: Omit<BagItem, "key">) => void; setQty: (k: string, q: number) => void }
const BagCtx = createContext<Ctx | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try { const s = localStorage.getItem("vastra-bag"); if (s) setItems(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("vastra-bag", JSON.stringify(items)); }, [items]);
  return (
    <BagCtx.Provider value={{
      items, open, setOpen,
      add: (i) => { setItems((x) => addItem(x, i)); setOpen(true); },
      setQty: (k, q) => setItems((x) => (q <= 0 ? x.filter((i) => i.key !== k) : x.map((i) => (i.key === k ? { ...i, qty: q } : i)))),
    }}>{children}</BagCtx.Provider>
  );
}
export function useBag() { const c = useContext(BagCtx); if (!c) throw new Error("no bag"); return c; }
