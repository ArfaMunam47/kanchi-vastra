import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { CollectionStories } from "@/components/site/CollectionStories";
import { Footer } from "@/components/site/Sections";
import { useReveal } from "@/hooks/use-reveal";
export const Route = createFileRoute("/collections/")({
  head: () => ({meta:[{title:"The Six Collections — Kanchi Vastra"},{name:"description",content:"Discover six expressive saree edits, from jewel-toned heritage to the Modern Muse."},{property:"og:title",content:"The Six Collections — Kanchi Vastra"},{property:"og:description",content:"Six distinct expressions of the saree, curated with feeling."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
  component: CollectionsPage,
});
function CollectionsPage() { useReveal(); return <main className="pt-16"><Header /><CollectionStories /><Footer /></main>; }