import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, DoorOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { boutiqueViews } from "@/lib/boutique-tour";
import facade from "@/assets/atelier-facade.jpg";

const Scene = lazy(() => import("./BoutiqueScene"));

export function Boutique() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const focus = useRef<string | null>(null);
  const entranceFrame = useRef(0);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);
  const select = useCallback((id: string) => { focus.current = id; setSelected(id); }, []);
  const clear = useCallback(() => { focus.current = null; setSelected(null); }, []);
  useEffect(() => {
    const update = () => {
      const el = section.current; if (!el) return;
      const range = Math.max(1, el.offsetHeight - innerHeight);
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / range));
      progress.current = p; setPosition(p);
      if (p < .55) { focus.current = null; setSelected(null); }
    };
    const cancel = () => { cancelAnimationFrame(entranceFrame.current); clear(); };
    const key = (event: KeyboardEvent) => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) cancel(); };
    update(); addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    addEventListener("wheel", cancel, { passive: true }); addEventListener("touchstart", cancel, { passive: true }); addEventListener("keydown", key);
    return () => { cancelAnimationFrame(entranceFrame.current); removeEventListener("wheel", cancel); removeEventListener("touchstart", cancel); removeEventListener("keydown", key); removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, [clear]);
  const travel = (target: number) => {
    const el = section.current; if (!el) return;
    clear(); cancelAnimationFrame(entranceFrame.current);
    const start = scrollY, end = el.offsetTop + (el.offsetHeight - innerHeight) * target;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { scrollTo({ top: end, behavior: "instant" }); return; }
    const time = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - time) / 2400), eased = t * t * (3 - 2 * t);
      scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
      if (t < 1) entranceFrame.current = requestAnimationFrame(animate);
    };
    entranceFrame.current = requestAnimationFrame(animate);
  };
  const view = boutiqueViews.find(view => view.id === selected);
  return (
    <section ref={section} id="atelier" className="entrance-section relative bg-ivory">
      <h1 className="sr-only">Kanchi Vastra — The Saree Atelier</h1>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <ClientOnly><Suspense fallback={null}><Scene progress={progress} focus={focus} onReady={onReady} onError={onError} onSelect={select} /></Suspense></ClientOnly>
        {(!ready || failed) && <img src={facade} alt="Kanchi Vastra stone facade with glass doors and a warmly lit saree boutique" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
        {position > .5 && <Button onClick={() => travel(0)} variant="outline" className="absolute left-5 top-20 rounded-none border-primary-foreground/30 bg-ink/70 text-primary-foreground hover:bg-burgundy hover:text-primary-foreground"><DoorOpen /> Entrance</Button>}
        {position < .52 ? <div className="boutique-invitation absolute inset-x-5 bottom-16 flex flex-col items-center text-center text-primary-foreground">
          <p className="font-script text-4xl md:text-5xl">Step Into Our World</p>
          <Button onClick={() => travel(.82)} variant="outline" className="mt-5 h-12 rounded-none border-primary-foreground/50 bg-ink/75 px-7 text-primary-foreground hover:bg-burgundy hover:text-primary-foreground">Enter the Atelier <ArrowRight /></Button>
        </div> : <div className="absolute inset-x-4 bottom-7 mx-auto max-w-3xl text-primary-foreground md:bottom-10">
          {view && <div className="boutique-controls mb-2 flex items-center justify-between gap-4 px-4 py-3" aria-live="polite">
            <div className="min-w-0"><p className="font-display text-xl sm:text-2xl">{view.name}</p><p className="mt-1 hidden text-sm text-primary-foreground/70 sm:block">{view.note}</p></div>
            <div className="flex shrink-0 items-center gap-2"><Button asChild variant="outline" className="rounded-none border-primary-foreground/30 bg-transparent text-primary-foreground hover:text-ink"><Link to="/collections/$id" params={{ id: view.id }}>Explore <ArrowRight /></Link></Button><Button onClick={clear} variant="ghost" size="icon" aria-label="Return to main store"><X /></Button></div>
          </div>}
          <div className="boutique-controls px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-3"><p className="font-display text-xl">{view ? "The collection rooms" : "Inside the atelier"}</p><Button variant="ghost" className="h-8 px-0 text-primary-foreground hover:bg-transparent hover:text-gold" onClick={() => { clear(); document.getElementById("gallery")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}>The exhibition <ArrowDown /></Button></div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{boutiqueViews.map(v => <Button key={v.id} onClick={() => select(v.id)} aria-pressed={v.id === selected} variant="outline" className="boutique-control h-10 rounded-none bg-transparent px-2 text-xs text-primary-foreground hover:bg-primary-foreground hover:text-ink">{v.shortName}</Button>)}</div>
            {selected && <Button onClick={clear} variant="ghost" className="mt-2 h-7 px-0 text-primary-foreground/75 hover:bg-transparent hover:text-primary-foreground"><ArrowLeft /> Main store</Button>}
          </div>
        </div>}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gold" style={{ width: `${position * 100}%` }} />
      </div>
    </section>
  );
}
