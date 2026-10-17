import { useEffect, useRef } from "react";
import { images } from "@/lib/products";

export default function BoutiqueScene({ progress, onReady, onError }: { progress: React.RefObject<number>; onReady: () => void; onError: () => void }) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false, cleanup = () => {};
    import("three").then((T) => {
      const host = mount.current;
      if (!host || disposed) return;
      const css = getComputedStyle(document.documentElement);
      const color = (name: string) => new T.Color(css.getPropertyValue(name).trim());
      // Canvas color conversion handles OKLCH through the browser's computed color.
      const resolve = (name: string) => {
        const el = document.createElement("span"); el.style.color = `var(${name})`; document.body.appendChild(el);
        const c = new T.Color(getComputedStyle(el).color); el.remove(); return c;
      };
      void color;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: false }); } catch { onError(); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      host.appendChild(renderer.domElement);
      const scene = new T.Scene(); scene.background = resolve("--ivory");
      scene.fog = new T.Fog(resolve("--ivory"), 25, 65);
      const camera = new T.PerspectiveCamera(48, 1, .1, 80);
      const ivory = new T.MeshStandardMaterial({ color: resolve("--ivory"), roughness: .85 });
      const wood = new T.MeshStandardMaterial({ color: resolve("--wood"), roughness: .65 });
      const gold = new T.MeshStandardMaterial({ color: resolve("--gold"), metalness: .7, roughness: .35 });
      const red = new T.MeshStandardMaterial({ color: resolve("--burgundy"), roughness: .9 });
      const box = (w: number,h: number,d: number,x: number,y: number,z: number, mat = ivory, parent: InstanceType<typeof T.Object3D> = scene) => {
        const m = new T.Mesh(new T.BoxGeometry(w,h,d), mat); m.position.set(x,y,z); parent.add(m); return m;
      };
      scene.add(new T.HemisphereLight(resolve("--ivory"), resolve("--wood"), 2.5));
      const sun = new T.DirectionalLight(resolve("--ivory"), 3); sun.position.set(1,8,10); scene.add(sun);
      for (const z of [-2,-7,-12]) { const light = new T.PointLight(resolve("--gold"), 65, 15, 2); light.position.set(0,4.8,z); scene.add(light); }
      // Open architectural portal, actual room depth and separate swinging door leaves.
      box(20,.15,35,0,-.08,-6); box(9,7,.7,-7.3,3.5,0); box(9,7,.7,7.3,3.5,0);
      box(6,1.6,.9,0,6.2,0,red); box(.18,5.5,.3,-2.65,2.75,.45,gold); box(.18,5.5,.3,2.65,2.75,.45,gold);
      box(5.4,.18,.3,0,5.5,.45,gold);
      box(.25,5.6,15,-5.5,2.8,-7.5); box(.25,5.6,15,5.5,2.8,-7.5); box(11,5.6,.3,0,2.8,-15,red);
      box(11,.15,15,0,5.65,-7.5);
      const doors = [-1,1].map((side) => {
        const group = new T.Group(); group.position.set(side*2.5,0,.15); scene.add(group);
        const center = -side*1.25;
        box(2.5,5.3,.12,center,2.65,0,wood,group);
        for (const x of [center-1.13,center+1.13]) box(.06,5.1,.17,x,2.65,.1,gold,group);
        for (const y of [.15,5.15]) box(2.3,.06,.17,center,y,.1,gold,group);
        for (const y of [1.3,3.85]) box(1.9,2.05,.08,center,y,.1,red,group);
        box(.06,.5,.15,-side*.2,2.55,.2,gold,group); return group;
      });
      const loader = new T.TextureLoader(); const textures: InstanceType<typeof T.Texture>[] = [];
      const photos = Object.values(images);
      photos.forEach((url,i) => {
        const tex = loader.load(url); tex.colorSpace = T.SRGBColorSpace; textures.push(tex);
        const mat = new T.MeshBasicMaterial({ map: tex, side: T.DoubleSide });
        const side = i%2===0 ? -1 : 1, z = -3-Math.floor(i/2)*3.6;
        const frame = box(1.75,2.65,.1,side*4.55,2.7,z,gold);
        frame.rotation.y = side === -1 ? Math.PI/2 : -Math.PI/2;
        const photo = new T.Mesh(new T.PlaneGeometry(1.65,2.55),mat); photo.position.set(side*4.48,2.7,z); photo.rotation.y = frame.rotation.y; scene.add(photo);
        box(1.2,.15,2.8,side*4.75,.9,z,wood);
        for(let j=0;j<6;j++) box(.8,.09,.3,side*4.75,1.04+j*.1,z-.9+j*.36,j%2 ? red : gold);
      });
      box(2.8,.18,1.8,0,1.35,-7,wood); box(2.5,1.3,1.5,0,.65,-7,red);
      for (let i=0;i<5;i++) box(.4,.12,1.2,-.9+i*.45,1.52,-7,i%2 ? red : gold);
      box(3,1.2,.8,0,.6,-13,wood); box(3.1,.12,.95,0,1.25,-13,gold);
      // Ceiling brass rails and pendant discs form strong perspective cues.
      for(const z of [-2,-6,-10]) {
        box(8,.04,.04,0,5.35,z,gold);
        const disc = new T.Mesh(new T.CylinderGeometry(.45,.45,.08,32),gold); disc.position.set(0,4.8,z); scene.add(disc);
        box(.03,.65,.03,0,5.1,z,gold);
      }
      for(let i=0;i<12;i++) box(11,.012,.022,0,.015,2-i*1.5,gold);
      let raf = 0; let px=0, py=0;
      const move = (e: PointerEvent) => { px=e.clientX/innerWidth-.5; py=e.clientY/innerHeight-.5; };
      const resize = () => { const {width,height}=host.getBoundingClientRect(); renderer.setSize(width,height); camera.aspect=width/height; camera.updateProjectionMatrix(); };
      const observer = new ResizeObserver(resize); observer.observe(host); resize();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tick = () => {
        const p = progress.current;
        const opening = Math.min(1,p*2.8); doors[0].rotation.y=-opening*1.55; doors[1].rotation.y=opening*1.55;
        camera.position.set(reduced ? 0 : px*.25,2.65+(reduced ? 0 : py*.1),11-p*20);
        camera.lookAt(0,2.55,-14); renderer.render(scene,camera); raf=requestAnimationFrame(tick);
      };
      host.addEventListener("pointermove",move); tick(); onReady();
      cleanup = () => { cancelAnimationFrame(raf); observer.disconnect(); host.removeEventListener("pointermove",move); scene.traverse((o) => { if(o instanceof T.Mesh) { o.geometry.dispose(); const mats=Array.isArray(o.material)?o.material:[o.material]; mats.forEach(m=>m.dispose()); } }); textures.forEach(t=>t.dispose()); renderer.dispose(); renderer.domElement.remove(); };
    }).catch(onError);
    return () => { disposed=true; cleanup(); };
  }, [progress, onReady, onError]);
  return <div ref={mount} className="absolute inset-0" aria-label="Dimensional Kanchi Vastra boutique with opening doors" />;
}
