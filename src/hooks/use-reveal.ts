import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, [data-reveal]");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
