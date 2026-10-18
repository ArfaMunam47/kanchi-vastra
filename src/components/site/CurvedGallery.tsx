import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";

const items = products;

export function CurvedGallery() {
  const [pos, setPos] = useState(0);
  const st = useRef({ pos: 0, vel: 0, drag: false, lastX: 0, moved: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const s = st.current;
      if (!s.drag) {
        s.pos += s.vel; s.vel *= 0.92;
        if (Math.abs(s.vel) < 0.002) { const t = Math.round(s.pos); s.pos += (t - s.pos) * 0.08; }
      }
      s.pos = Math.max(0, Math.min(items.length - 1, s.pos));
      setPos(s.pos);
      raf = requestAnimationFrame(tick);
    };
    tick();
    const el = wrap.current;
    if (!el) return () => cancelAnimationFrame(raf);
    const scroll = () => {
      const root=section.current; if(!root || st.current.drag) return;
      const range=root.offsetHeight-innerHeight;
      const p=Math.max(0,Math.min(1,-root.getBoundingClientRect().top/range));
      st.current.pos=p*(items.length-1); st.current.vel=0;
    };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); st.current.vel += e.deltaX * 0.0008; }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("scroll",scroll,{passive:true}); scroll();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("wheel", wheel); window.removeEventListener("scroll",scroll); };
  }, []);

  const down = (e: React.PointerEvent) => { const s = st.current; s.drag = true; s.lastX = e.clientX; s.vel = 0; s.moved = 0; };
  const move = (e: React.PointerEvent) => {
    const s = st.current; if (!s.drag) return;
    const dx = e.clientX - s.lastX; s.lastX = e.clientX; s.moved += Math.abs(dx);
    if(s.moved>6 && !e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    s.pos -= dx / 260; s.vel = -dx / 260;
  };
  const up = () => { st.current.drag = false; };

  return (
    <section ref={section} id="gallery" className="gallery-section relative bg-background">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
        <p className="eyebrow text-muted-foreground">The Exhibition</p>
        <div className="flex items-end justify-between gap-4"><h2 className="mt-2 text-4xl leading-none md:text-7xl">Woven to Be <span className="font-script text-primary">Remembered</span></h2><span className="hidden text-sm text-muted-foreground md:block">{String(Math.round(pos)+1).padStart(2,"0")} / {items.length}</span></div>
      </div>
      <div ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
         className="relative mt-8 h-[54svh] min-h-[240px] cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: "1400px" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {items.map((p, i) => {
            const d = i - pos, a = d * 0.32, R = 900;
            if (Math.abs(d) > 6) return null;
            const x = Math.sin(a) * R, z = -(1 - Math.cos(a)) * R;
            return (
              <Link key={i} to="/product/$id" params={{ id: p.id }} draggable={false}
                onClick={(e) => { if (st.current.moved > 6) e.preventDefault(); }}
                className="group absolute left-1/2 top-1/2 h-[90%] w-[min(300px,60vw)] overflow-hidden"
                style={{ transform: `translate(-50%,-50%) translate3d(${x}px,0,${z}px) rotateY(${a * 57.3}deg)`, opacity: 1 - Math.abs(d) * 0.12, zIndex: 100 - Math.round(Math.abs(d) * 10) }}>
                <img src={p.gallery[0]} alt={p.name} draggable={false} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 text-primary-foreground">
                  <p className="eyebrow text-gold">{p.category}</p>
                  <p className="font-display text-2xl">{p.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mx-auto mt-5 flex items-center gap-6"><Button variant="outline" size="icon" aria-label="Previous saree" onClick={() => { st.current.pos=Math.max(0,Math.round(st.current.pos)-1); st.current.vel=0; }}><ArrowLeft /></Button><span className="font-script text-2xl text-primary">The art of six yards</span><Button variant="outline" size="icon" aria-label="Next saree" onClick={() => { st.current.pos=Math.min(items.length-1,Math.round(st.current.pos)+1); st.current.vel=0; }}><ArrowRight /></Button></div>
      </div>
    </section>
  );
}
