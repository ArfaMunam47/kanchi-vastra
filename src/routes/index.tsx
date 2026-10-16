import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Boutique } from "@/components/site/Boutique";
import { CurvedGallery } from "@/components/site/CurvedGallery";
import { BridalCollection, Catalog, Trends, Footer } from "@/components/site/Sections";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kanchi Vastra — Luxury Handwoven Sarees" },
      { name: "description", content: "Step inside an immersive saree boutique. Banarasi, Kanjivaram, organza and bridal drapes." },
      { property: "og:title", content: "Kanchi Vastra — Luxury Handwoven Sarees" },
      { property: "og:description", content: "An immersive luxury saree boutique in your browser." },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main>
      <Header overlay />
      <Boutique />
      <CurvedGallery />
      <BridalCollection />
      <Catalog />
      <Trends />
      <Footer />
    </main>
  );
}
