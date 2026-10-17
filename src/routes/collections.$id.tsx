import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getCollection, collectionProducts } from "@/lib/collections";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Sections";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/collections/$id")({
  loader: ({params}) => { const c=getCollection(params.id); if(!c) throw notFound(); return c; },
  head: ({loaderData:c}) => ({meta:[{title:c ? `${c.name} — Kanchi Vastra` : "Unavailable — Kanchi Vastra"},{name:"description",content:c?.description ?? "Collection unavailable."},{property:"og:title",content:c ? `${c.name} — Kanchi Vastra` : "Unavailable — Kanchi Vastra"},{property:"og:description",content:c?.description ?? "Collection unavailable."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
  component: CollectionPage,
});
function CollectionPage() {
  const c=Route.useLoaderData(); const list=collectionProducts(c.id);
  return <main><Header /><section className="relative h-[78svh] min-h-[500px] overflow-hidden bg-ink"><img src={c.image} alt={c.name} className="h-full w-full object-cover object-[center_35%]" /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" /><div className="absolute bottom-12 left-6 right-6 max-w-3xl text-primary-foreground md:left-14"><p className="eyebrow text-gold">Kanchi Vastra · The Collections</p><h1 className="mt-4 text-5xl leading-none md:text-7xl">{c.name}</h1><p className="mt-5 max-w-lg text-primary-foreground/80">{c.description}</p></div></section><section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10"><Button asChild variant="link" className="px-0"><Link to="/collections"><ArrowLeft /> All collections</Link></Button><div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">{list.map(p=><ProductCard key={p.id} p={p} />)}</div></section><Footer /></main>;
}