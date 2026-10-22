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
  const floor = new T.MeshStandardMaterial({ map: stoneMap, color: color("--ivory"), roughness: .42, envMapIntensity: .55, bumpMap: stoneMap, bumpScale: .009 });
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
    ctx.shadowColor = "rgba(20, 8, 4, .5)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
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
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -9; sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 10; sun.shadow.camera.bottom = -18; sun.shadow.camera.near = .1; sun.shadow.camera.far = 40;
  sun.shadow.normalBias = .04; sun.shadow.bias = -.0004; scene.add(sun);
  for (const z of [-1.8, -5.3, -9, -12.9, -16.2]) {
    const lamp = new T.PointLight(color("--light"), 40, 9, 2); lamp.position.set(0, 3.7, z); scene.add(lamp);
  }

  // Facade: layered stone mass, pilastered bays, deep recesses and a bold fascia sign.
  box(34, .2, 36, 0, -.13, -4.5, floor);
  box(4.6, .09, 1.2, 0, .045, 1.5, stone);
  box(11.2, .18, 11.8, 0, -.02, -5.7, floor);
  box(26, 4.6, .45, 0, 2.3, -.28);
  box(7, 5.2, .5, -9.25, 2.6, -.08);
  box(7, 5.2, .5, 9.25, 2.6, -.08);
  for (const x of [-12.7, -7.35, 7.35, 12.7]) {
    box(.62, 4.55, .42, x, 2.32, .1);
    box(.78, .2, .55, x, 4.7, .1, stone);
    box(.7, .1, .5, x, .3, .12, dark);
    box(.045, .5, .08, x, 2.75, .36, lightMat);
    box(.06, .62, .14, x, 2.75, .3, dark);
  }
  box(26.6, .3, .8, 0, 4.98, .02);
  box(25.6, .18, .6, 0, 5.24, -.03);
  box(26.6, .36, .72, 0, .2, .08);
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
  box(3.4, .3, .55, 0, 3.5, .12, wood);
  box(2.9, .15, .46, 0, 3.43, .02, wood);
  box(3.1, .05, .8, 0, .08, .01, dark);
  // Fascia sign: dimensional brass lettering on a deep burgundy panel.
  box(8.8, 1.28, .22, 0, 4.14, .3, red);
  box(9.1, .07, .3, 0, 4.84, .3, brass);
  box(9.1, .07, .3, 0, 3.56, .3, brass);
  text("KANCHI VASTRA", 7.4, .8, 0, 4.36, .45);
  text("THE SAREE ATELIER", 2.9, .21, 0, 3.76, .44, "Jost");
  for (let x = -16; x <= 16; x += 1.5) box(.012, .008, 15, x, -.02, 5.5, ivory);
  for (let z = 1; z < 13; z += 1.6) box(31, .008, .012, 0, -.02, z, ivory);

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

  // Enclosing shell: a deep retail floor with shadow gaps and ceiling coffers.
  for (const side of [-1, 1]) {
    box(.24, 4, 16.6, side * 5.5, 2, -9.3);
    box(.15, .16, 16.2, side * 5.3, .16, -9.3, wood);
    box(.08, .06, 15.8, side * 5.22, 3.73, -9.3, lightMat);
  }
  box(11, 4, .22, 0, 2, -17.4);
  box(11.2, .15, 17, 0, 4.06, -9.3, ivory);
  for (let k = 0; k < 6; k++) {
    const z = -.6 - k * 3;
    box(11, .12, .16, 0, 3.92, z, wood);
    for (const x of [-3.7, 0, 3.7]) {
      box(.14, .1, .32, x, 3.82, z, dark); box(.07, .01, .2, x, 3.75, z, lightMat);
    }
  }

  // Soft silk albedos: nine colours, fine weave, motifs and zari borders.
  const fabricMats = ["--emerald", "--primary", "--gold", "--ivory", "--rose", "--sage", "--wine", "--champagne", "--powder"].map((token, i) => {
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = color(token).getStyle(); ctx.fillRect(0, 0, 512, 1024);
      ctx.fillStyle = color("--gold").getStyle(); ctx.globalAlpha = .8;
      ctx.fillRect(0, 0, 34, 1024); ctx.fillRect(478, 0, 34, 1024); ctx.fillRect(0, 915, 512, 100);
      for (let y = 24; y < 900; y += 64) for (let x = 62; x < 470; x += 62) {
        ctx.globalAlpha = i === 5 || i === 7 ? .22 : .5; ctx.beginPath(); ctx.ellipse(x + (y % 128 === 24 ? 0 : 28), y, i % 3 === 2 ? 6 : 3, 6, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = .1; ctx.strokeStyle = color("--ivory").getStyle(); ctx.lineWidth = .6;
      for (let y = 0; y < 1024; y += 3) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
    }
    const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace; textures.push(map);
    return new T.MeshPhysicalMaterial({ map, roughness: .8, sheen: .65, sheenColor: color(token), sheenRoughness: .8, side: T.DoubleSide });
  });
  const cloth = (x: number, z: number, material: T.Material, w = .58, h = 2.15, rotation = 0, y = 1.84) => {
    const geometry = new T.PlaneGeometry(w, h, 28, 32);
    const vertices = geometry.getAttribute("position");
    if (!vertices) { geometry.dispose(); return; }
    for (let i = 0; i < vertices.count; i++) {
      const vx = vertices.getX(i), vy = vertices.getY(i);
      vertices.setZ(i, Math.sin(vx * 42) * .048 + Math.sin(vy * 2) * .025);
    }
    geometry.computeVertexNormals();
    const mesh = new T.Mesh(geometry, material); mesh.position.set(x, y, z); mesh.rotation.y = rotation; mesh.castShadow = true; scene.add(mesh);
  };
  const mannequin = (x: number, z: number, drape: T.Material) => {
    const group = new T.Group(); group.position.set(x, 0, z);
    const add = (geo: T.BufferGeometry, mat: T.Material, y: number) => {
      const mesh = new T.Mesh(geo, mat); mesh.position.y = y; mesh.castShadow = true; group.add(mesh); return mesh;
    };
    add(new T.CylinderGeometry(.19, .21, .04, 16), dark, .02);
    add(new T.CylinderGeometry(.015, .015, .72, 8), brass, .4);
    add(new T.CylinderGeometry(.16, .23, .95, 14), ivory, 1.25);
    add(new T.CylinderGeometry(.05, .06, .14, 10), ivory, 1.79);
    add(new T.SphereGeometry(.11, 12, 10), ivory, 1.94);
    add(new T.CylinderGeometry(.19, .52, 1.4, 16, 1, true), drape, 1.12);
    scene.add(group);
  };
  const vase = (x: number, z: number) => {
    const mesh = new T.Mesh(new T.CylinderGeometry(.07, .12, .42, 12), brass);
    mesh.position.set(x, .48, z); mesh.castShadow = true; scene.add(mesh);
    const stem = new T.Mesh(new T.SphereGeometry(.09, 10, 8), red);
    stem.position.set(x, .74, z); scene.add(stem);
  };
  const stack = (x: number, y: number, z: number, mats: number[]) => {
    mats.forEach((m, j) => box(.46, .07, .72, x, y + j * .085, z, fabricMats[m] ?? ivory));
  };

  // Styled window displays: each side has its own composition.
  for (const side of [-1, 1]) {
    box(2.35, .13, 1.05, side * 3.58, .2, -.72, wood);
    box(2.5, .04, .04, side * 3.58, 3.03, -.7, brass);
  }
  mannequin(-4.5, -.72, fabricMats[0] ?? ivory);
  cloth(-2.9, -.75, fabricMats[1] ?? red, .55, 1.9, 0, 1.78);
  cloth(-2.3, -.65, fabricMats[2] ?? gold(), .5, 1.65, 0, 1.9);
  stack(-3.6, .33, -.7, [3, 5, 1]);
  cloth(3.0, -.75, fabricMats[4] ?? ivory, .55, 2.1, 0, 1.8);
  cloth(3.62, -.65, fabricMats[3] ?? ivory, .52, 1.85, 0, 1.92);
  cloth(4.2, -.78, fabricMats[8] ?? ivory, .5, 2.0, 0, 1.84);
  stack(4.7, .33, -.7, [2, 0, 4]);
  vase(4.0, -.95);

  // Entrance gallery: a console with folded textiles just inside the doors.
  box(1.9, .08, .42, 0, .86, -1.25, wood);
  for (const x of [-.8, .8]) box(.06, .86, .06, x, .43, -1.25, wood);
  stack(-.45, .95, -1.25, [1, 4, 0]);
  stack(.5, .95, -1.25, [6, 2, 7]);

  boutiqueViews.forEach((view, i) => {
    const x = view.side * 4.85, z = view.z;
    const angle = view.side < 0 ? Math.PI / 2 : -Math.PI / 2;
    const mat = fabricMats[i] ?? ivory;
    const wallMat = ["heritage", "temple", "festive", "bridal"].includes(view.theme) ? red
      : ["ivory", "contemporary"].includes(view.theme) ? stone : wood;
    box(.14, 3.3, 2.65, view.side * 5.27, 1.92, z, wallMat);
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
  // Between the collection bays: shared niches with folded silks.
  for (let k = 0; k < 4; k++) {
    const z = -4.3 - k * 3;
    for (const side of [-1, 1]) {
      box(.5, .06, 1.3, side * 5.32, 1.5, z, wood);
      for (let j = 0; j < 3; j++) box(.42, .07, .8, side * 5.3, 1.6 + j * .085, z, fabricMats[(k * 2 + j + 1) % fabricMats.length] ?? ivory);
    }
  }

  // Featured presentation table leaves a full metre of clear aisle on either side.
  box(2.4, .1, 1.65, 0, .96, -6.8, wood);
  for (const x of [-1.02, 1.02]) for (const z of [-7.43, -6.17]) box(.07, .88, .07, x, .46, z, wood);
  box(2.2, .06, 1.4, 0, .38, -6.8, wood);
  for (let i = 0; i < 4; i++) {
    const mat = fabricMats[i] ?? red;
    box(.48, .05, 1.15, -.82 + i * .54, 1.04, -6.8, mat);
  }

  // Consultation corner: rug, lounge chairs and a low table by the counter.
  const rug = new T.Mesh(new T.PlaneGeometry(3.6, 2.6), red);
  rug.rotation.x = -Math.PI / 2; rug.position.set(-3.2, .012, -15.4); rug.receiveShadow = true; scene.add(rug);
  const chair = (x: number, z: number, ry: number) => {
    const group = new T.Group(); group.position.set(x, 0, z); group.rotation.y = ry;
    const part = (w: number, h: number, d: number, px: number, py: number, pz: number, mat: T.Material) => {
      const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat); mesh.position.set(px, py, pz); mesh.castShadow = true; group.add(mesh);
    };
    part(.62, .14, .58, 0, .35, 0, wood); part(.62, .62, .12, 0, .72, -.24, wood);
    part(.1, .3, .58, -.27, .5, 0, wood); part(.1, .3, .58, .27, .5, 0, wood);
    part(.56, .12, .5, 0, .46, .02, ivory); part(.5, .34, .1, 0, .82, -.18, ivory);
    for (const [lx, lz] of [[-.26, -.24], [.26, -.24], [-.26, .24], [.26, .24]]) part(.05, .28, .05, lx, .14, lz, dark);
    scene.add(group);
  };
  chair(-4.15, -15.3, .7); chair(-2.25, -15.3, -.45);
  const table = new T.Mesh(new T.CylinderGeometry(.42, .42, .4, 16), wood);
  table.position.set(-3.2, .2, -15.4); table.castShadow = true; scene.add(table);

  // Consultation counter on the rear wall, beneath the campaign artwork.
  box(3.5, 2.85, .12, 0, 2.45, -17.15, red);
  text("KANCHI VASTRA", 2.85, .45, 0, 3.22, -17.06);
  box(3.3, .95, .85, 0, .52, -16.3, wood);
  box(3.4, .1, 1, 0, 1.03, -16.3, stone);
  box(.055, .7, .05, -1.4, .56, -15.79, brass);
  box(.055, .7, .05, 1.4, .56, -15.79, brass);
  box(1.4, .03, .32, .4, 1.1, -16.32, red);
  box(.26, .025, .2, -.9, 1.1, -16.25, brass);
  const featured = load(images.s6);
  plane(1.9, 2.55, 0, 2.6, -17.28, new T.MeshBasicMaterial({ map: featured }));

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
