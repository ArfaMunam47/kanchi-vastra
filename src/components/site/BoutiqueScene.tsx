import { useEffect, useRef, type RefObject } from "react";
import { boutiqueViews } from "@/lib/boutique-tour";

export default function BoutiqueScene({ progress, focus, onReady, onError, onSelect }: {
  progress: RefObject<number>; focus: RefObject<string | null>; onReady: () => void; onError: () => void; onSelect: (id: string) => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    Promise.all([import("three"), import("./create-boutique"), document.fonts.ready]).then(([T, { createBoutique }]) => {
      const host = mount.current;
      if (!host || disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ antialias: true, powerPreference: "low-power" }); }
      catch { onError(); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);
      const world = createBoutique(renderer);
      const camera = new T.PerspectiveCamera(50, 1, .08, 100);
      const desired = new T.Vector3(), look = new T.Vector3(0, 2.2, -4), desiredLook = new T.Vector3();
      const raycaster = new T.Raycaster(), pointer = new T.Vector2();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let first = true, raf = 0, lastTime = performance.now(), visible = true;
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize); observer.observe(host); resize();
      const visibility = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; }); visibility.observe(host);
      const click = (event: PointerEvent) => {
        if ((progress.current ?? 0) < .55) return;
        const rect = host.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(world.scene.children).find(hit => typeof hit.object.userData["collectionId"] === "string");
        const id = hit?.object.userData["collectionId"];
        if (typeof id === "string") onSelect(id);
      };
      const tick = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, .25); lastTime = time;
        if (visible) {
          const p = progress.current ?? 0;
          const opening = T.MathUtils.smoothstep(p, .025, .32);
          world.doors.forEach((door, i) => { door.rotation.y = (i === 0 ? 1 : -1) * opening * 1.48; });
          const start = Math.max(8, 6.05 / (Math.tan(T.MathUtils.degToRad(25)) * camera.aspect));
          const travel = T.MathUtils.smoothstep(p, .12, .86);
          desired.set(0, 2.25 - travel * .42, start + (-4.35 - start) * travel);
          desiredLook.set(0, 2.25 - travel * .35, -10.5);
          const selected = boutiqueViews.find(view => view.id === focus.current);
          if (selected && p > .55) {
            desired.set(selected.side * 1.25, 1.9, selected.z + .55);
            desiredLook.set(selected.side * 4.8, 1.95, selected.z);
          }
          const blend = reduced || first ? 1 : 1 - Math.exp(-3.6 * dt);
          camera.position.lerp(desired, blend); look.lerp(desiredLook, blend); camera.lookAt(look);
          renderer.render(world.scene, camera);
          if (first) { first = false; onReady(); }
        }
        raf = requestAnimationFrame(tick);
      };
      host.addEventListener("pointerup", click); raf = requestAnimationFrame(tick);
      cleanup = () => {
        cancelAnimationFrame(raf); observer.disconnect(); visibility.disconnect(); host.removeEventListener("pointerup", click);
        world.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      };
    }).catch(onError);
    return () => { disposed = true; cleanup(); };
  }, [progress, focus, onReady, onError, onSelect]);
  return <div ref={mount} className="absolute inset-0" role="img" aria-label="Kanchi Vastra: glass and walnut entrance, stone facade and six illuminated saree displays" />;
}
