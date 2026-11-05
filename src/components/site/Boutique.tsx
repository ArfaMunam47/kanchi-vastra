import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import facade from "@/assets/atelier-facade.jpg";
import showroom from "@/assets/boutique.jpg";

export function Boutique() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const entranceFrame = useRef(0);
  const [position, setPosition] = useState(0);
  const [traveling, setTraveling] = useState(false);

  useEffect(() => {
    const update = () => {
      const el = section.current; if (!el) return;
      const range = Math.max(1, el.offsetHeight - innerHeight);
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / range));
      progress.current = p; setPosition(p);
    };
    const cancel = () => { cancelAnimationFrame(entranceFrame.current); setTraveling(false); };
    const key = (event: KeyboardEvent) => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) cancel(); };
    update(); addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    addEventListener("wheel", cancel, { passive: true }); addEventListener("touchstart", cancel, { passive: true }); addEventListener("touchmove", cancel, { passive: true }); addEventListener("keydown", key);
    return () => { cancelAnimationFrame(entranceFrame.current); removeEventListener("wheel", cancel); removeEventListener("touchstart", cancel); removeEventListener("touchmove", cancel); removeEventListener("keydown", key); removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);

  const travel = useCallback((target: number, duration = 2400) => {
    const el = section.current; if (!el) return;
    cancelAnimationFrame(entranceFrame.current);
    setTraveling(true);
    const start = scrollY, end = el.offsetTop + (el.offsetHeight - innerHeight) * target;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { scrollTo({ top: end, behavior: "instant" }); setTraveling(false); return; }
    const time = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - time) / Math.max(1, duration)), eased = t * t * (3 - 2 * t);
      scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
      if (t < 1) entranceFrame.current = requestAnimationFrame(animate);
      else setTraveling(false);
    };
    entranceFrame.current = requestAnimationFrame(animate);
  }, []);
  const toExhibition = () => document.getElementById("gallery")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  const rawReveal = Math.max(0, Math.min(1, (position - .08) / .78));
  const showroomReveal = rawReveal * rawReveal * (3 - 2 * rawReveal);

  return (
    <section ref={section} id="atelier" className="entrance-section relative bg-ivory">
      <h1 className="sr-only">Kanchi Vastra — The Saree Atelier</h1>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0" role="img" aria-label="Kanchi Vastra stone storefront dissolving into a spacious, warmly lit saree showroom">
          <img src={showroom} alt="" width={1920} height={768} className="entrance-showroom absolute inset-0 h-full w-full object-cover" style={{ opacity: showroomReveal }} />
          <img src={facade} alt="" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 1 - showroomReveal }} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
        {position < .06 && <div className={`absolute inset-x-0 bottom-[12%] px-6 text-center text-primary-foreground transition-opacity duration-700 ${traveling ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <p className="font-script text-3xl text-gold drop-shadow md:text-4xl">Step inside</p>
          <h2 className="boutique-invitation mt-3 font-display text-4xl leading-tight md:text-6xl">Step Into Our World</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-primary-foreground/85 md:text-base">An invitation to discover the world of Kanchi Vastra.</p>
          <Button size="lg" disabled={traveling} onClick={() => travel(1, 5800)} className="boutique-control mt-8 h-12 rounded-none px-10 font-display text-lg tracking-[0.2em] uppercase">
            {traveling ? "Entering…" : "Enter the Atelier"}
          </Button>
        </div>}
        {position > .86 && <Button onClick={() => travel(0, 1400)} variant="outline" className="absolute left-5 top-20 rounded-none border-primary-foreground/30 bg-ink/70 text-primary-foreground hover:bg-burgundy hover:text-primary-foreground"><DoorOpen /> Entrance</Button>}
        {position > .86 && <div className="absolute inset-x-5 bottom-8 mx-auto max-w-2xl text-center text-primary-foreground md:bottom-12">
          <p className="font-script text-3xl text-gold">Welcome to the atelier</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Woven to be remembered</h2>
          <Button onClick={toExhibition} size="lg" className="mt-5 rounded-none px-8 font-display text-lg uppercase">
            Continue to the exhibition <ArrowDown />
          </Button>
        </div>}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gold" style={{ width: `${position * 100}%` }} aria-hidden="true" />
      </div>
    </section>
  );
}
