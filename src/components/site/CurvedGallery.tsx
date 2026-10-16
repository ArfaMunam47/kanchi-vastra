import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { products } from "@/lib/products";

const items = [...products, ...products.slice(0, 5)];

export function CurvedGallery() {
  const [pos, setPos] = useState(items.length / 2);
  const st = useRef({ pos: items.length / 2, vel: 0, drag: false, lastX: 0, moved: 0 });
  const wrap = useRef<HTMLDivElement>(null);

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
    const el = wrap.current!;
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); st.current.vel += e.deltaX * 0.0008; }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => { cancelAnimationFrame(raf); el.removeEventListener("wheel", wheel); };
  }, []);

  const down = (e: React.PointerEvent) => { const s = st.current; s.drag = true; s.lastX = e.clientX; s.vel = 0; s.moved = 0; };
  const move = (e: React.PointerEvent) => {
    const s = st.current; if (!s.drag) return;
    const dx = e.clientX - s.lastX; s.lastX = e.clientX; s.moved += Math.abs(dx);
    s.pos -= dx / 260; s.vel = -dx / 260;
  };
  const up = () => { st.current.drag = false; };

  return (
    <section id="gallery" className="relative overflow-hidden bg-background py-24">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 reveal">
        <p className="eyebrow text-muted-foreground">The Exhibition</p>
        <h2 className="mt-2 text-5xl md:text-7xl">Woven to Be <span className="font-script text-primary">Remembered</span></h2>
      </div>
      <div ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        className="relative mt-12 h-[62vh] min-h-[420px] cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: "1400px" }}>
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
                <img src={p.colors[0]!.image} alt={p.name} draggable={false} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 text-primary-foreground">
                  <p className="eyebrow text-gold">{p.category}</p>
                  <p className="font-display text-2xl">{p.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <p className="mt-6 text-center eyebrow text-muted-foreground">Drag to explore</p>
    </section>
  );
}
