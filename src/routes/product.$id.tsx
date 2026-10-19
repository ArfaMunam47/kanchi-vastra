import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [zoomed, setZoomed] = useState(false);
  const views = [...new Set(p.colors.map(c => c.image))];

  return (
    <main className="bg-background">
      <Header />
      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 pt-28 md:grid-cols-[90px_1fr_1fr] md:px-10">
        <div className="order-2 flex gap-3 md:order-1 md:flex-col">
          <p className="hidden font-script text-2xl text-primary md:block">Change look</p>
          {views.map((v, index) => (
            <Button key={v} variant="ghost" aria-label={`View image ${index + 1}`} aria-pressed={view === v} onClick={() => setView(v)} className={`h-auto w-20 shrink-0 overflow-hidden rounded-none border-2 p-0 transition ${view === v ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={v} alt="" className="aspect-[3/4] w-full object-cover" />
            </Button>
          ))}
        </div>
        <div className="relative order-1 overflow-hidden bg-muted md:order-2">
          <img key={view} src={view} alt={p.name} className={`aspect-[3/4] w-full object-cover transition-transform duration-700 ${zoomed ? "scale-150" : "scale-100"}`} />
          <Button variant="outline" size="icon" className="absolute bottom-4 right-4 rounded-none bg-background/90" aria-label={zoomed ? "Zoom out" : "Zoom into textile"} onClick={() => setZoomed(value => !value)}>{zoomed ? <ZoomOut /> : <ZoomIn />}</Button>
        </div>
        <div className="order-3 md:pt-10">
          <Link to="/" hash="shop" className="eyebrow text-muted-foreground hover:text-primary">← {p.category}</Link>
          <h1 className="mt-3 text-5xl uppercase leading-none md:text-6xl">{p.name}</h1>
          <p className="mt-4 font-display text-3xl">{formatINR(p.price)}</p>
          <p className="mt-6 max-w-md text-muted-foreground">{p.description}</p>

          <p className="mt-8 eyebrow">Colour — {color.name}</p>
          <div className="mt-3 flex gap-3">
            {p.colors.map((c) => (
              <Button key={c.name} variant="ghost" aria-label={c.name} aria-pressed={color.name === c.name} onClick={() => { setColor(c); setView(c.image); }}
                className={`h-9 w-9 rounded-full border-2 p-0 ring-offset-2 ring-offset-background ${color.name === c.name ? "ring-2 ring-primary" : ""}`} style={{ background: c.swatch }} />
            ))}
          </div>

          <p className="mt-8 eyebrow">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <Button key={s} variant="outline" aria-pressed={size === s} onClick={() => setSize(s)} className={`rounded-none border px-4 py-2 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{s}</Button>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center border">
              <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center">{qty}</span>
              <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></Button>
            </div>
            <Button onClick={() => add({ id: p.id, name: p.name, image: color.image, color: color.name, size, price: p.price, qty })}
              className="h-12 flex-1 rounded-none bg-primary text-primary-foreground hover:bg-burgundy">Add to bag</Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Kanchi Vastra · Creative collection study</p>
        </div>
      </section>
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h2 className="text-4xl">You may also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {products.filter((x) => x.id !== p.id).sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
