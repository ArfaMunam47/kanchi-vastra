import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import s6 from "@/assets/s6.jpg";

const Scene = lazy(() => import("./BoutiqueScene"));

export function Boutique() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [position, setPosition] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const update = () => {
      const el = section.current; if (!el) return;
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / (el.offsetHeight - innerHeight)));
      progress.current = p; setPosition(p);
    };
    update(); addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  const enter = () => {
    const el = section.current; if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = scrollY, end = el.offsetTop + (el.offsetHeight-innerHeight)*.88;
    if(reduce) { scrollTo(0,end); return; }
    const time = performance.now();
    const animate = (now: number) => { const t=Math.min(1,(now-time)/2600); const eased=t*t*(3-2*t); window.scrollTo({top:start+(end-start)*eased,behavior:"instant"}); if(t<1) requestAnimationFrame(animate); };
    requestAnimationFrame(animate);
  };
  return (
    <section ref={section} className="entrance-section relative bg-ivory">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <ClientOnly><Suspense fallback={null}><Scene progress={progress} onReady={onReady} onError={onError} /></Suspense></ClientOnly>
        {(!ready || failed) && <img src={s6} alt="Crimson saree at the atelier entrance" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-8 text-center transition-opacity" style={{opacity: Math.max(0,1-position*4)}}>
          <p className="eyebrow text-primary">The Saree Atelier</p>
          <h1 className="mt-2 text-4xl text-burgundy md:text-6xl">KANCHI VASTRA</h1>
        </div>
        <div className="absolute bottom-12 inset-x-6 flex flex-col items-center text-center text-primary-foreground">
          {position < .45 ? <><p className="font-script text-4xl md:text-5xl">A world woven in silk</p><Button onClick={enter} variant="outline" className="mt-6 h-12 rounded-none border-gold bg-ink/60 px-7 text-primary-foreground hover:bg-burgundy hover:text-primary-foreground">Enter the atelier <ArrowRight /></Button></> : <><p className="font-script text-4xl md:text-5xl">Welcome to our world</p><Button variant="ghost" onClick={() => document.getElementById("gallery")?.scrollIntoView({behavior:"smooth"})} className="mt-5 text-primary-foreground">Discover the exhibition <ArrowDown /></Button></>}
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 bg-gold" style={{width:`${position*100}%`}} />
      </div>
    </section>
  );
}
