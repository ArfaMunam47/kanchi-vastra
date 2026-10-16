import { useState } from "react";
import s6 from "@/assets/s6.jpg";
import s4 from "@/assets/s4.jpg";
import drift from "@/assets/drift.jpg";
import { categories, filterSort, products, type Category, type SortKey } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function BridalCollection() {
  const bridal = products.filter((p) => p.category === "Bridal" || p.category === "Banarasi");
  return (
    <section id="collection" className="relative bg-burgundy py-28 text-primary-foreground wave-top">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 md:grid-cols-[1fr_2fr] md:px-10">
        <div className="reveal relative overflow-hidden">
          <img src={s6} alt="The Bridal Collection campaign" loading="lazy" className="h-full max-h-[720px] w-full object-cover" />
          <p className="absolute bottom-6 left-6 font-script text-5xl text-gold">View the collection</p>
        </div>
        <div>
          <p className="eyebrow text-gold reveal">Season of Vows</p>
          <h2 className="reveal mt-3 text-5xl md:text-7xl">The Bridal Collection</h2>
          <p className="reveal mt-4 max-w-md text-primary-foreground/70">Heirloom drapes in sindoor, ruby and crimson — hand-finished by master weavers.</p>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4 [&_.text-muted-foreground]:text-gold">
            {bridal.map((p, i) => <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}><ProductCard p={p} tall={i % 2 === 0} /></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Catalog() {
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const list = filterSort(products, cat, sort);
  return (
    <section id="shop" className="bg-ivory py-28">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 reveal">
          <div>
            <p className="eyebrow text-muted-foreground">Shop the atelier</p>
            <h2 className="mt-2 text-5xl md:text-6xl">New Arrivals</h2>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort products"
            className="border-b bg-transparent py-2 eyebrow outline-none">
            <option value="featured">Featured</option><option value="new">Newest</option>
            <option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full border px-5 py-2 eyebrow transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

export function Trends() {
  return (
    <section id="trends" className="overflow-hidden bg-background py-28">
      <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-6 md:grid-cols-2 md:px-10" data-reveal>
        <h2 className="text-[18vw] font-semibold uppercase leading-[0.8] tracking-tight md:text-[10vw]">
          <span className="mask-reveal">Latest</span><br /><span className="mask-reveal text-primary" style={{ transitionDelay: "150ms" }}>Trends</span>
        </h2>
        <div className="reveal relative">
          <img src={s4} alt="Emerald Kanjivaram campaign" loading="lazy" className="ml-auto w-4/5 object-cover" />
          <p className="absolute -bottom-6 left-0 max-w-[14rem] bg-background p-5 text-sm text-muted-foreground">Jewel tones and temple borders lead the season. Styled for the modern muse.</p>
        </div>
      </div>
      <div className="relative mt-28" data-reveal>
        <img src={drift} alt="Drift campaign in the dunes" loading="lazy" className="h-[80vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
        <div className="absolute bottom-14 left-6 text-primary-foreground md:left-14">
          <h3 className="font-display text-7xl italic md:text-9xl"><span className="mask-reveal">Drift</span></h3>
          <p className="reveal mt-2 max-w-sm text-primary-foreground/80">Sheer chiffons that move with the desert wind. The new campaign.</p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink py-16 text-primary-foreground/70">
      <div className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-8 px-6 md:px-10">
        <p className="font-display text-3xl tracking-[0.25em] text-primary-foreground">KANCHI VASTRA</p>
        <p className="text-sm">Handwoven in India · Shipped worldwide</p>
      </div>
    </footer>
  );
}
