import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Sections";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR, getProduct, products, sizes } from "@/lib/products";
import { useBag } from "@/lib/bag";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => { const p = getProduct(params.id); if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Kanchi Vastra` },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: `${loaderData.name} — Kanchi Vastra` },
      { property: "og:description", content: loaderData.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Unavailable — Kanchi Vastra" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  return <ProductView key={p.id} />;
}

function ProductView() {
  const p = Route.useLoaderData();
  const { add } = useBag();
  const [color, setColor] = useState(p.colors[0] ?? { name: "Original", swatch: "var(--primary)", image: p.gallery[0] ?? "" });
  const [view, setView] = useState(p.colors[0]?.image ?? p.gallery[0] ?? "");
  const [size, setSize] = useState(sizes[0] ?? "Free Size");
  const [qty, setQty] = useState(1);
  const views = [color.image, ...p.gallery.filter((g) => g !== color.image)];

  return (
    <main className="bg-background">
      <Header />
      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 pt-28 md:grid-cols-[90px_1fr_1fr] md:px-10">
        <div className="order-2 flex gap-3 md:order-1 md:flex-col">
          <p className="hidden font-script text-2xl text-primary md:block">Change look</p>
          {views.map((v) => (
            <button key={v} onClick={() => setView(v)} className={`w-20 overflow-hidden border-2 transition ${view === v ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={v} alt="" className="aspect-[3/4] w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="order-1 overflow-hidden bg-muted md:order-2">
          <img key={view} src={view} alt={p.name} className="aspect-[3/4] w-full object-cover animate-rise transition-transform duration-[1.5s] hover:scale-110" />
        </div>
        <div className="order-3 md:pt-10">
          <Link to="/" hash="shop" className="eyebrow text-muted-foreground hover:text-primary">← {p.category}</Link>
          <div className="mt-6 flex gap-1 text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
          <h1 className="mt-3 text-5xl uppercase leading-none md:text-6xl">{p.name}</h1>
          <p className="mt-4 font-display text-3xl">{formatINR(p.price)}</p>
          <p className="mt-6 max-w-md text-muted-foreground">{p.description}</p>

          <p className="mt-8 eyebrow">Colour — {color.name}</p>
          <div className="mt-3 flex gap-3">
            {p.colors.map((c) => (
              <button key={c.name} aria-label={c.name} onClick={() => { setColor(c); setView(c.image); }}
                className={`h-9 w-9 rounded-full border-2 ring-offset-2 ring-offset-background ${color.name === c.name ? "ring-2 ring-primary" : ""}`} style={{ background: c.swatch }} />
            ))}
          </div>

          <p className="mt-8 eyebrow">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`border px-4 py-2 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{s}</button>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center border">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button className="p-3" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => add({ id: p.id, name: p.name, image: color.image, color: color.name, size, price: p.price, qty })}
              className="flex-1 rounded-full bg-primary py-4 eyebrow text-primary-foreground transition hover:bg-burgundy">Add to bag</button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Kanchi Vastra · Creative collection study</p>
        </div>
      </section>
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h2 className="text-4xl">You may also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {products.filter((x) => x.id !== p.id).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
