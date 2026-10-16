import { Link } from "@tanstack/react-router";
import { formatINR, type Product } from "@/lib/products";

export function ProductCard({ p, tall = false }: { p: Product; tall?: boolean }) {
  return (
    <Link to="/product/$id" params={{ id: p.id }} className="group block">
      <div className={`relative overflow-hidden bg-muted ${tall ? "aspect-[3/4.6]" : "aspect-[3/4]"}`}>
        <img src={p.gallery[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0" />
        <img src={p.gallery[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
        {p.isNew && <span className="absolute left-3 top-3 bg-primary px-2 py-1 text-[10px] eyebrow text-primary-foreground">New</span>}
        <span className="absolute inset-x-3 bottom-3 translate-y-4 bg-background/95 py-3 text-center eyebrow opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">View piece</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow text-muted-foreground">{p.category}</p>
          <p className="font-display text-xl">{p.name}</p>
        </div>
        <p className="whitespace-nowrap text-sm">{formatINR(p.price)}</p>
      </div>
      <div className="mt-2 flex gap-1.5">
        {p.colors.map((c) => <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border" style={{ background: c.swatch }} />)}
      </div>
    </Link>
  );
}
