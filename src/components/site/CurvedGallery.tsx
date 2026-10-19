import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";

const items = products;
export function CurvedGallery() {
  const [pos, setPos] = useState(0);
  const section = useRef<HTMLElement>(null);
  const drag = useRef({ startX: 0, startY: 0, startScroll: 0, active: false, moved: false });
  useEffect(() => {
    const update = () => {
      const el = section.current; if (!el) return;
      const range = Math.max(1, el.offsetHeight - innerHeight);
      setPos(Math.max(0, Math.min(1, -el.getBoundingClientRect().top / range)) * (items.length - 1));
    };
    update(); addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  const jump = (index: number) => {
    const el = section.current; if (!el) return;
    const target = Math.max(0, Math.min(items.length - 1, index));
    scrollTo({ top: el.offsetTop + target / (items.length - 1) * (el.offsetHeight - innerHeight), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const down = (event: React.PointerEvent) => { drag.current = { startX: event.clientX, startY: event.clientY, startScroll: scrollY, active: true, moved: false }; };
  const move = (event: React.PointerEvent) => {
    const state = drag.current, el = section.current;
    if (!state.active || !el) return;
    const dx = event.clientX - state.startX, dy = event.clientY - state.startY;
    if (Math.abs(dx) < 8 || Math.abs(dy) > Math.abs(dx)) return;
    state.moved = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollTo({ top: state.startScroll - dx / 260 * (el.offsetHeight - innerHeight) / (items.length - 1), behavior: "instant" });
  };
  const up = () => { drag.current.active = false; };
  return <section ref={section} id="gallery" className="gallery-section relative bg-background">
    <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-9 pt-24">
      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
        <div className="flex items-center justify-between"><p className="eyebrow text-muted-foreground">Kanchi Vastra · The Exhibition</p><span className="text-xs text-muted-foreground">{String(Math.round(pos) + 1).padStart(2, "0")} / {items.length}</span></div>
        <h2 className="mt-4 text-4xl leading-none sm:text-5xl md:text-7xl">Woven to Be <span className="font-script text-primary">Remembered</span></h2>
      </div>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} className="relative mt-8 h-[55svh] min-h-48 cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: "1400px" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {items.map((product, index) => {
            const distance = index - pos, angle = distance * .32;
            if (Math.abs(distance) > 5) return null;
            return <Link key={product.id} to="/product/$id" params={{ id: product.id }} draggable={false} onClick={event => { if (drag.current.moved) event.preventDefault(); }} className="gallery-photo group absolute left-1/2 top-1/2 h-[94%] w-[min(330px,62vw)] overflow-hidden" style={{ transform: `translate(-50%,-50%) translate3d(${Math.sin(angle) * 980}px,0,${-(1 - Math.cos(angle)) * 980}px) rotateY(${angle * 57.3}deg)`, opacity: Math.max(.18, 1 - Math.abs(distance) * .16), zIndex: 100 - Math.round(Math.abs(distance) * 10) }}>
              <img src={product.gallery[0]} alt={product.name} draggable={false} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 text-primary-foreground"><p className="text-xs uppercase text-gold">{product.category}</p><p className="mt-1 font-display text-2xl">{product.name}</p></div>
            </Link>;
          })}
        </div>
      </div>
      <div className="mx-auto mt-5 flex items-center gap-6"><Button variant="outline" size="icon" aria-label="Previous saree" disabled={pos < .1} onClick={() => jump(Math.round(pos) - 1)}><ArrowLeft /></Button><span className="font-script text-2xl text-primary">The art of six yards</span><Button variant="outline" size="icon" aria-label="Next saree" disabled={pos > items.length - 1.1} onClick={() => jump(Math.round(pos) + 1)}><ArrowRight /></Button></div>
      <Button asChild variant="link" className="mx-auto mt-2 h-8 text-muted-foreground"><Link to="/collections">The six collections <ArrowDown /></Link></Button>
    </div>
  </section>;
}
