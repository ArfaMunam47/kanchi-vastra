import { useEffect, useRef } from "react";
import boutique from "@/assets/boutique.jpg";

export function Boutique() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    const tick = () => {
      cx += (mx - cx) * 0.05; cy += (my - cy) * 0.05;
      const s = Math.min(scrollY / innerHeight, 1);
      if (layer.current) layer.current.style.transform =
        `perspective(1200px) translate3d(${-cx * 40}px, ${-cy * 25}px, ${s * 300}px) rotateY(${cx * 3}deg) rotateX(${-cy * 2}deg)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", move); tick();
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="relative h-[115vh] overflow-hidden bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={layer} className="absolute -inset-[6%] will-change-transform">
          <img src={boutique} alt="Inside the Kanchi Vastra flagship boutique" width={1920} height={1088} className="h-full w-full object-cover animate-enter-store" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
        <div className="absolute bottom-16 left-6 max-w-xl text-primary-foreground md:left-14">
          <p className="eyebrow animate-rise text-gold" style={{ animationDelay: "1.4s" }}>The Flagship · Kanchipuram</p>
          <h1 className="mt-4 text-5xl leading-[0.95] md:text-8xl animate-rise" style={{ animationDelay: "1.6s" }}>
            Step inside <em className="font-script text-gold not-italic">six yards</em> of heritage
          </h1>
          <a href="#gallery" className="mt-8 inline-block rounded-full border border-primary-foreground/60 px-8 py-3 eyebrow animate-rise hover:bg-primary-foreground hover:text-ink" style={{ animationDelay: "1.9s" }}>Enter the store</a>
        </div>
      </div>
    </section>
  );
}
