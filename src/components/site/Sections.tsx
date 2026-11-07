import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp } from "lucide-react";
import s6 from "@/assets/s6.jpg";
import s4 from "@/assets/s4.jpg";
import drift from "@/assets/drift.jpg";
import { categories, filterSort, products, type Category, type SortKey } from "@/lib/products";
import { collections } from "@/lib/collections";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

export function BridalCollection() {
  const bridal = products.filter((p) => p.category === "Bridal" || p.category === "Banarasi");
  return (
    <section
      id="collection"
      className="relative bg-burgundy py-28 text-primary-foreground wave-top"
    >
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 md:grid-cols-[1fr_2fr] md:px-10">
        <div className="reveal relative overflow-hidden">
          <img
            src={s6}
            alt="The Bridal Collection campaign"
            loading="lazy"
            className="h-full max-h-[720px] w-full object-cover"
          />
          <p className="absolute bottom-6 left-6 font-script text-5xl text-gold">
            View the collection
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold reveal">Season of Vows</p>
          <h2 className="reveal mt-3 text-5xl md:text-7xl">The Bridal Collection</h2>
          <p className="reveal mt-4 max-w-md text-primary-foreground/70">
            Heirloom drapes in sindoor, ruby and crimson — hand-finished by master weavers.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4 [&_.text-muted-foreground]:text-gold">
            {bridal.map((p, i) => (
              <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                <ProductCard p={p} tall={i % 2 === 0} />
              </div>
            ))}
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="border-b bg-transparent py-2 eyebrow outline-none"
          >
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-5 py-2 eyebrow transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Trends() {
  return (
    <section id="trends" className="overflow-hidden bg-background">
      <div className="mx-auto max-w-[1500px] px-6 pt-28 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/10 pb-10 reveal">
          <div>
            <p className="eyebrow text-primary">The Journal · Season III</p>
            <h2 className="mt-3 text-6xl leading-none md:text-8xl">
              Latest
              <br />
              <span className="font-script text-gold">trends</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground reveal">
            Notes from the loom: jewel tones, temple borders and sheer layers — how this season is
            being worn, draped and remembered.
          </p>
        </div>
        <div className="mt-16 grid items-center gap-10 md:grid-cols-[2fr_1fr]" data-reveal>
          <figure className="reveal">
            <img
              src={s4}
              alt="Emerald Kanjivaram campaign"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <figcaption className="mt-4 flex items-baseline justify-between gap-6 text-sm text-muted-foreground">
              <span className="font-display text-lg text-foreground">
                Temple Borders, Reimagined
              </span>
              <span className="eyebrow">Chapter 01</span>
            </figcaption>
          </figure>
          <div className="reveal space-y-8">
            {["The Return of Kanjivaram", "Sheer Layers for the Evening", "Zari, Worn Softly"].map(
              (t, i) => (
                <div key={t} className="border-b border-foreground/10 pb-6">
                  <p className="eyebrow text-muted-foreground">
                    Chapter {String(i + 2).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-display text-2xl">{t}</p>
                </div>
              ),
            )}
            <Button asChild variant="link" className="h-12 border-b border-current px-0">
              <Link to="/collections">
                All collections <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative mt-24" data-reveal>
        <img
          src={drift}
          alt="Drift campaign in the dunes"
          loading="lazy"
          className="h-[85vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 text-center text-primary-foreground">
          <p className="eyebrow text-gold">The Finale · Campaign</p>
          <h3 className="mt-4 font-display text-[18vw] italic leading-[0.85] md:text-[9vw]">
            <span className="mask-reveal">Drift</span>
          </h3>
          <div className="mt-6 h-px w-24 bg-gold" />
          <p className="reveal mt-6 max-w-md text-sm leading-relaxed text-primary-foreground/85 md:text-base">
            Sheer chiffons that move with the desert wind. The season closes where it began — with
            cloth that feels like nothing, and is remembered like everything.
          </p>
          <Button
            asChild
            variant="outline"
            className="boutique-control mt-8 h-12 rounded-none border-gold/60 bg-transparent px-10 font-display text-base tracking-[0.2em] uppercase text-primary-foreground hover:bg-gold hover:text-ink"
          >
            <Link to="/collections">Explore the Collections</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const toTop = () =>
    scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  return (
    <footer className="bg-ink text-primary-foreground/70">
      <div className="mx-auto max-w-[1500px] px-6 pb-10 pt-20 md:px-10">
        <div className="grid gap-12 border-b border-primary-foreground/15 pb-14 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <p className="font-display text-3xl tracking-[0.25em] text-primary-foreground">
              KANCHI VASTRA
            </p>
            <p className="mt-2 font-script text-2xl text-gold">The Saree Atelier</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              Handwoven sarees from the looms of Kanchipuram and Banaras — heirloom silk,
              feather-light organza and bridal drapes, finished by master weavers.
            </p>
            <p className="mt-6 eyebrow text-primary-foreground/50">
              Handwoven in India · Shipped worldwide
            </p>
          </div>
          <nav aria-label="Collections">
            <p className="eyebrow text-gold">Collections</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {collections.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/collections/$id"
                    params={{ id: c.id }}
                    className="transition-colors hover:text-gold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="The atelier">
            <p className="eyebrow text-gold">The Atelier</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link to="/" hash="atelier" className="transition-colors hover:text-gold">
                  The Boutique
                </Link>
              </li>
              <li>
                <Link to="/" hash="gallery" className="transition-colors hover:text-gold">
                  The Exhibition
                </Link>
              </li>
              <li>
                <Link to="/collections" className="transition-colors hover:text-gold">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/" hash="shop" className="transition-colors hover:text-gold">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/" hash="trends" className="transition-colors hover:text-gold">
                  The Journal
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col items-start justify-between gap-6">
            <Button
              onClick={toTop}
              variant="outline"
              className="h-11 rounded-none border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-gold hover:text-ink"
            >
              Back to top <ArrowUp />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Kanchi Vastra — The Saree Atelier</p>
          <p>Crafted as an immersive showcase · Imagery is illustrative</p>
        </div>
      </div>
    </footer>
  );
}
