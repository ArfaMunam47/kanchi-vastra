import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import stoneUrl from "@/assets/limestone.jpg";
import woodUrl from "@/assets/walnut-grain.jpg";
import { boutiqueViews } from "@/lib/boutique-tour";
import { images } from "@/lib/products";

// Bespoke retail architecture: one world unit is one metre. Repeated pieces
// share an instanced batch; doors use local hinge-relative geometry.
export function createBoutique(renderer: T.WebGLRenderer) {
  const css = getComputedStyle(document.documentElement);
  const color = (name: string) => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new T.Color();
    ctx.fillStyle = css.getPropertyValue(name).trim(); ctx.fillRect(0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    return new T.Color().setRGB((pixel[0] ?? 0) / 255, (pixel[1] ?? 0) / 255, (pixel[2] ?? 0) / 255, T.SRGBColorSpace);
  };
  const scene = new T.Scene(); scene.background = color("--secondary");
  const textures: T.Texture[] = [];
  const loader = new T.TextureLoader();
  const load = (url: string, repeat = 1) => {
    const texture = loader.load(url); texture.colorSpace = T.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    if (repeat > 1) { texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.repeat.set(repeat, repeat); }
    textures.push(texture); return texture;
  };
  const stoneMap = load(stoneUrl, 3), woodMap = load(woodUrl, 2);
  const stone = new T.MeshStandardMaterial({ map: stoneMap, color: color("--ivory"), roughness: .88, bumpMap: stoneMap, bumpScale: .012 });
  const wood = new T.MeshStandardMaterial({ map: woodMap, roughness: .47, bumpMap: woodMap, bumpScale: .009 });
  const brass = new T.MeshStandardMaterial({ color: color("--gold"), metalness: .86, roughness: .38 });
  const red = new T.MeshStandardMaterial({ color: color("--burgundy"), roughness: .92 });
  const ivory = new T.MeshStandardMaterial({ color: color("--ivory"), roughness: .9 });
  const dark = new T.MeshStandardMaterial({ color: color("--ink"), roughness: .55 });
  const lightMat = new T.MeshBasicMaterial({ color: color("--light") });
  const glass = new T.MeshPhysicalMaterial({ color: color("--glass"), transparent: true, opacity: .13, roughness: .12, metalness: .05, depthWrite: false, side: T.DoubleSide });
  const batches = new Map<T.Material, T.Matrix4[]>();
  const dummy = new T.Object3D();
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, mat: T.Material = stone, ry = 0) => {
    dummy.position.set(x, y, z); dummy.scale.set(w, h, d); dummy.rotation.set(0, ry, 0); dummy.updateMatrix();
    const batch = batches.get(mat) ?? []; batch.push(dummy.matrix.clone()); batches.set(mat, batch);
  };
  const plane = (w: number, h: number, x: number, y: number, z: number, material: T.Material, ry = 0) => {
    const mesh = new T.Mesh(new T.PlaneGeometry(w, h), material);
    mesh.position.set(x, y, z); mesh.rotation.y = ry; scene.add(mesh); return mesh;
  };
  const text = (label: string, w: number, h: number, x: number, y: number, z: number, font = "Cormorant Garamond", ry = 0) => {
    const canvas = document.createElement("canvas"); canvas.width = 1536; canvas.height = 256;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = color("--gold").getStyle(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `500 ${label.length > 23 ? 80 : 104}px '${font}', serif`;
    ctx.fillText(label, 768, 130, 1470);
    const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; textures.push(texture);
    return plane(w, h, x, y, z, new T.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }), ry);
  };

  const pmrem = new T.PMREMGenerator(renderer);
  const environmentRoom = new RoomEnvironment();
  const environment = pmrem.fromScene(environmentRoom, .05);
  scene.environment = environment.texture; scene.environmentIntensity = .48;
  environmentRoom.dispose(); pmrem.dispose();
  scene.add(new T.HemisphereLight(color("--ivory"), color("--wood"), .7));
  const sun = new T.DirectionalLight(color("--ivory"), 1.35);
  sun.position.set(-5, 9, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -8; sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8; sun.shadow.camera.near = .1; sun.shadow.camera.far = 35;
  sun.shadow.normalBias = .04; sun.shadow.bias = -.0004; scene.add(sun);
  for (const z of [-1.8, -5.3, -9]) {
    const lamp = new T.PointLight(color("--light"), 48, 8, 2); lamp.position.set(0, 3.7, z); scene.add(lamp);
  }

  // Facade: framed display glazing either side, recessed entrance and slim sign.
  box(26, .2, 35, 0, -.13, -4);
  box(11.2, .18, 11.8, 0, -.02, -5.7);
  box(11.4, .88, .62, 0, 4.02, .25);
  box(11.7, .14, .88, 0, 4.5, .28);
  box(26, 8, .4, 0, 8.55, -.2);
  box(7, 5.2, .5, -9.25, 2.6, -.08);
  box(7, 5.2, .5, 9.25, 2.6, -.08);
  box(11.7, .16, .75, 0, .08, .3);
  for (const side of [-1, 1]) {
    box(.52, 3.55, .62, side * 5.45, 1.85, .25);
    box(.35, 3.5, .65, side * 1.68, 1.83, .25);
    box(3.38, .12, .2, side * 3.55, .3, .51, wood);
    box(3.38, .12, .2, side * 3.55, 3.48, .51, wood);
    for (const x of [side * 1.88, side * 5.22]) box(.09, 3.12, .2, x, 1.88, .51, wood);
    plane(3.25, 3.1, side * 3.55, 1.9, .5, glass);
    box(.13, 3.4, .46, side * 1.47, 1.76, .02, wood);
    box(.04, 3.3, .06, side * 1.37, 1.72, .28, brass);
    box(.06, .65, .14, side * 5.46, 2.75, .63, dark);
    box(.045, .5, .08, side * 5.46, 2.75, .72, lightMat);
  }
  box(2.9, .15, .46, 0, 3.43, .02, wood);
  box(3.1, .05, .8, 0, .08, .01, dark);
  text("KANCHI VASTRA", 4.8, .62, 0, 4.12, .575);
  text("THE SAREE ATELIER", 2.7, .24, 0, 3.78, .58, "Jost");
  for (let x = -12; x <= 12; x += 1.5) box(.012, .008, 15, x, -.02, 5.5, ivory);
  for (let z = 1; z < 13; z += 1.6) box(25, .008, .012, 0, -.02, z, ivory);

  const doors = [-1, 1].map((side) => {
    const hinge = new T.Group(); hinge.position.set(side * 1.4, .12, -.1); scene.add(hinge);
    const cx = -side * .69;
    const pieces: T.BufferGeometry[] = [];
    const localBox = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const geo = new T.BoxGeometry(w, h, d); geo.translate(x, y, z); pieces.push(geo);
    };
    for (const x of [cx - .65, cx + .65]) localBox(.09, 3.22, .13, x, 1.61, 0);
    for (const y of [.06, 3.16]) localBox(1.38, .12, .13, cx, y, 0);
    localBox(1.38, .28, .13, cx, .22, 0);
    const geo = mergeGeometries(pieces); pieces.forEach(piece => piece.dispose());
    if (geo) { const frame = new T.Mesh(geo, wood); frame.castShadow = true; hinge.add(frame); }
    const pane = new T.Mesh(new T.PlaneGeometry(1.22, 2.77), glass); pane.position.set(cx, 1.76, 0); hinge.add(pane);
    const handle = new T.Mesh(new T.CylinderGeometry(.018, .018, .68, 12), brass);
    handle.position.set(-side * 1.2, 1.5, .15); hinge.add(handle);
    return hinge;
  });

  // Enclosing shell, shadow gaps, joinery, ceiling lighting and consultation desk.
  for (const side of [-1, 1]) {
    box(.24, 4, 11.8, side * 5.5, 2, -5.8);
    box(.15, .16, 11.8, side * 5.3, .16, -5.8, wood);
    box(.08, .06, 11.4, side * 5.22, 3.73, -5.8, lightMat);
  }
  box(11, 4, .22, 0, 2, -11.6);
  box(11.2, .15, 12, 0, 4.06, -5.6, ivory);
  for (const z of [-.6, -3.6, -6.6, -9.6]) {
    box(11, .12, .16, 0, 3.92, z, wood);
    for (const x of [-3.7, 0, 3.7]) {
      box(.14, .1, .32, x, 3.82, z, dark); box(.07, .01, .2, x, 3.75, z, lightMat);
    }
  }
  box(3.5, 2.85, .12, 0, 2.45, -11.43, red);
  text("KANCHI VASTRA", 2.85, .45, 0, 3.22, -11.34);
  box(3.3, .95, .85, 0, .52, -10.5, wood);
  box(3.4, .1, 1, 0, 1.03, -10.5, stone);
  box(.055, .7, .05, -1.4, .56, -9.99, brass);
  box(.055, .7, .05, 1.4, .56, -9.99, brass);
  box(1.4, .03, .32, .4, 1.1, -10.52, red);
  box(.26, .025, .2, -.9, 1.1, -10.45, brass);

  // Soft silk albedos: different colours, fine weave, motifs and zari borders.
  const fabricMats = ["--emerald", "--primary", "--gold", "--ivory", "--rose", "--sage"].map((token, i) => {
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = color(token).getStyle(); ctx.fillRect(0, 0, 512, 1024);
      ctx.fillStyle = color("--gold").getStyle(); ctx.globalAlpha = .8;
      ctx.fillRect(0, 0, 34, 1024); ctx.fillRect(478, 0, 34, 1024); ctx.fillRect(0, 915, 512, 100);
      for (let y = 24; y < 900; y += 64) for (let x = 62; x < 470; x += 62) {
        ctx.globalAlpha = i === 5 ? .25 : .5; ctx.beginPath(); ctx.ellipse(x + (y % 128 === 24 ? 0 : 28), y, i === 2 ? 6 : 3, 6, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = .1; ctx.strokeStyle = color("--ivory").getStyle(); ctx.lineWidth = .6;
      for (let y = 0; y < 1024; y += 3) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
    }
    const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace; textures.push(map);
    return new T.MeshPhysicalMaterial({ map, roughness: .8, sheen: .65, sheenColor: color(token), sheenRoughness: .8, side: T.DoubleSide });
  });
  const cloth = (x: number, z: number, material: T.Material, w = .58, h = 2.15, rotation = 0) => {
    const geometry = new T.PlaneGeometry(w, h, 28, 32);
    const vertices = geometry.getAttribute("position");
    if (!vertices) { geometry.dispose(); return; }
    for (let i = 0; i < vertices.count; i++) {
      const vx = vertices.getX(i), vy = vertices.getY(i);
      vertices.setZ(i, Math.sin(vx * 42) * .048 + Math.sin(vy * 2) * .025);
    }
    geometry.computeVertexNormals();
    const mesh = new T.Mesh(geometry, material); mesh.position.set(x, 1.84, z); mesh.rotation.y = rotation; mesh.castShadow = true; scene.add(mesh);
  };

  // Display windows reveal hanging, pleated silk without blocking the doorway.
  for (const side of [-1, 1]) {
    box(2.35, .13, 1.05, side * 3.58, .2, -.72, wood);
    box(2.5, .04, .04, side * 3.58, 3.03, -.7, brass);
    for (let j = 0; j < 4; j++) {
      const mat = fabricMats[(side < 0 ? j : j + 2) % fabricMats.length];
      if (mat) cloth(side * 3.58 - .88 + j * .58, -.7, mat);
    }
  }

  boutiqueViews.forEach((view, i) => {
    const x = view.side * 4.85, z = view.z;
    const angle = view.side < 0 ? Math.PI / 2 : -Math.PI / 2;
    const mat = fabricMats[i] ?? ivory;
    box(.14, 3.3, 2.65, view.side * 5.27, 1.92, z, i === 0 || i === 4 ? red : i === 3 ? stone : wood);
    // Lower cabinets and slim shelves contain substantial folded textiles.
    box(.76, .66, 2.6, x, .4, z, wood);
    for (const y of [1.12, 1.66, 2.2]) {
      box(.8, .065, 1.28, x, y, z + .65, wood);
      for (let j = 0; j < 3; j++) {
        const fabric = fabricMats[i === 3 || i === 5 ? i : (i + j % 2) % fabricMats.length] ?? mat;
        box(.54, .075, .78, view.side * 4.75, y + .08 + j * .08, z + .65, fabric);
      }
      box(.035, .014, 1.24, view.side * 4.46, y - .03, z + .65, lightMat);
    }
    // Photography remains readable and garment-specific, never mapped as fabric.
    const photograph = new T.MeshBasicMaterial({ map: load(view.image), side: T.DoubleSide });
    const display = plane(1.08, 1.6, view.side * 4.42, 2.13, z - .58, photograph, angle);
    display.userData["collectionId"] = view.id;
    text(view.shortName.toUpperCase(), 2.1, .3, view.side * 5.16, 3.35, z, "Jost", angle);
    box(.65, .08, 2.6, view.side * 4.85, 2.99, z, stone);
    box(.04, .016, 2.45, view.side * 4.49, 2.93, z, lightMat);
  });
  // Featured presentation table leaves a full metre of clear aisle on either side.
  box(2.4, .1, 1.65, 0, .96, -6.8, wood);
  for (const x of [-1.02, 1.02]) for (const z of [-7.43, -6.17]) box(.07, .88, .07, x, .46, z, wood);
  box(2.2, .06, 1.4, 0, .38, -6.8, wood);
  for (let i = 0; i < 4; i++) {
    const mat = fabricMats[i] ?? red;
    box(.48, .05, 1.15, -.82 + i * .54, 1.04, -6.8, mat);
  }
  const featured = load(images.s6);
  plane(1.7, 2.3, 0, 2.46, -11.32, new T.MeshBasicMaterial({ map: featured }));

  for (const [material, matrices] of batches) {
    const mesh = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), material, matrices.length);
    matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
    mesh.castShadow = material !== lightMat; mesh.receiveShadow = true; scene.add(mesh);
  }
  return {
    scene, doors,
    dispose() {
      const materials = new Set<T.Material>();
      scene.traverse(object => {
        if (object instanceof T.Mesh) { object.geometry.dispose(); (Array.isArray(object.material) ? object.material : [object.material]).forEach(mat => materials.add(mat)); }
      });
      materials.forEach(mat => mat.dispose()); textures.forEach(texture => texture.dispose()); environment.dispose();
      sun.shadow.map?.dispose();
    },
  };
}