import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collections } from "@/lib/collections";

export function CollectionStories() {
  return <section id="collections" className="bg-background">
    <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10">
      <div className="flex items-end justify-between gap-6 border-b pb-8"><div><p className="eyebrow text-primary">Six expressions · One atelier</p><h2 className="mt-3 text-5xl md:text-7xl">The Collections</h2></div><span className="font-script text-3xl text-primary">Curated with feeling</span></div>
    </div>
    {collections.map((c,i) => <div key={c.id} className={`collection-story collection-${c.theme} py-16 md:py-24`}>
      <div className={`mx-auto grid max-w-[1400px] items-center gap-8 px-6 md:grid-cols-2 md:gap-20 md:px-10 ${i%2 ? "collection-reverse" : ""}`}>
        <Link to="/collections/$id" params={{id:c.id}} className={`collection-link relative block overflow-hidden ${i===3 ? "aspect-square" : "aspect-[4/5]"}`}>
          <img src={c.image} alt={c.name} loading="lazy" className="collection-image h-full w-full object-cover" />
          <span className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-background text-foreground"><ArrowUpRight /></span>
        </Link>
        <div className="reveal"><p className="eyebrow opacity-60">Collection {String(i+1).padStart(2,"0")}</p><h2 className="mt-6 max-w-lg text-5xl leading-none md:text-7xl">{c.name}</h2><p className="mt-8 font-script text-3xl">{c.note}</p><p className="mt-5 max-w-sm text-sm leading-relaxed opacity-75">{c.description}</p><Button asChild variant="link" className="mt-8 h-12 border-b border-current px-0 text-inherit"><Link to="/collections/$id" params={{id:c.id}}>Explore the edit <ArrowUpRight /></Link></Button></div>
      </div>
    </div>)}
  </section>;
}