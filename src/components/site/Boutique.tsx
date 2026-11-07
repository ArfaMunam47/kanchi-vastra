import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Boutique() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Keep progress in a ref for the continuous animation loop
  const progressRef = useRef(0);
  const lookTargetRef = useRef({ x: 0, y: 0 });
  const lookCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const range = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / range));
      progressRef.current = p;
      setScrollProgress(p);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Pointer look-around interaction (subtle pan/glance)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      lookTargetRef.current = { x: -nx * 0.22, y: -ny * 0.12 };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const t = e.touches[0];
        const nx = (t.clientX / window.innerWidth - 0.5) * 2;
        const ny = (t.clientY / window.innerHeight - 0.5) * 2;
        lookTargetRef.current = { x: -nx * 0.18, y: -ny * 0.1 };
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // =========================================================================
  // THREE.JS SCENE SETUP: ONE CONNECTED ARCHITECTURAL ENVIRONMENT
  // =========================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce5ea);
    scene.fog = new THREE.FogExp2(0xdce5ea, 0.015);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      160,
    );
    camera.position.set(0, 1.7, 30);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // =========================================================================
    // PROCEDURAL TEXTURE GENERATORS (Zero external file dependencies)
    // =========================================================================

    // 1. Polished Italian White Marble with Gold Veining
    const createMarbleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 1024;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#fcf9f2";
      ctx.fillRect(0, 0, 1024, 1024);

      // Soft amber/gold veins
      ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
      ctx.lineWidth = 4;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        let x = Math.random() * 1024;
        let y = 0;
        ctx.moveTo(x, y);
        while (y < 1024) {
          x += (Math.random() - 0.48) * 60;
          y += Math.random() * 80 + 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Subtle marble tile border
      ctx.strokeStyle = "rgba(180, 150, 90, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, 1016, 1016);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.repeat.set(4, 12);
      return tex;
    };

    // 2. Rich Dark Walnut Wood
    const createWalnutTexture = () => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#341d14";
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = "rgba(20, 10, 6, 0.35)";
      for (let i = 0; i < 512; i += 4) {
        if (Math.random() > 0.4) {
          ctx.fillRect(0, i, 512, Math.random() * 3 + 1);
        }
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // 3. Travertine Stone Blocks for Facade
    const createStoneTexture = () => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#eedfc8";
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = "rgba(180, 160, 135, 0.2)";
      for (let i = 0; i < 512; i += 8) {
        ctx.fillRect(0, i, 512, 2);
      }
      ctx.strokeStyle = "rgba(130, 110, 85, 0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 512, 256);
      ctx.strokeRect(0, 256, 512, 256);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 3);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // 4. Royal Red & Gold Runner Carpet
    const createCarpetTexture = () => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 1024;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#6e121d";
      ctx.fillRect(0, 0, 512, 1024);

      // Gold ornate border
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 472, 984);
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, 440, 952);

      // Paisley / floral gold diamonds
      ctx.fillStyle = "rgba(212, 175, 55, 0.25)";
      for (let y = 80; y < 960; y += 120) {
        ctx.beginPath();
        ctx.arc(256, y, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 8);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // 5. Architectural Sign "KANCHI VASTRA"
    const createSignTexture = () => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 256;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#e4d3be";
      ctx.fillRect(0, 0, 1024, 256);

      // Gold architectural letters
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 82px serif";
      ctx.fillStyle = "#9a7424";
      ctx.fillText("KANCHI VASTRA", 512, 118);
      ctx.fillStyle = "#f6d465";
      ctx.fillText("KANCHI VASTRA", 510, 116);

      ctx.font = "26px sans-serif";
      ctx.fillStyle = "#684812";
      ctx.fillText("THE SAREE ATELIER", 512, 190);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // 6. Folded Saree Stacks (Vibrant jewel tones with gold zari borders)
    const createSareeStackTexture = () => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext("2d")!;
      const colors = ["#8b1528", "#124a6e", "#1b6238", "#c88a18", "#5e1e4a"];
      const h = 256 / colors.length;

      colors.forEach((col, i) => {
        const y = i * h;
        ctx.fillStyle = col;
        ctx.fillRect(0, y, 256, h);

        // Gold zari border on fabric fold edge
        ctx.fillStyle = "#f5d468";
        ctx.fillRect(0, y + h - 6, 256, 4);
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, y, 256, 3);
      });

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // =========================================================================
    // MATERIALS
    // =========================================================================
    const marbleMat = new THREE.MeshStandardMaterial({
      map: createMarbleTexture(),
      roughness: 0.12,
      metalness: 0.08,
    });

    const walnutMat = new THREE.MeshStandardMaterial({
      map: createWalnutTexture(),
      roughness: 0.35,
      metalness: 0.05,
    });

    const stoneMat = new THREE.MeshStandardMaterial({
      map: createStoneTexture(),
      roughness: 0.65,
      metalness: 0.02,
    });

    const carpetMat = new THREE.MeshStandardMaterial({
      map: createCarpetTexture(),
      roughness: 0.85,
      metalness: 0.02,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdeb841,
      roughness: 0.22,
      metalness: 0.85,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.38,
      roughness: 0.05,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.88,
      ior: 1.5,
    });

    const sareeStackMat = new THREE.MeshStandardMaterial({
      map: createSareeStackTexture(),
      roughness: 0.45,
      metalness: 0.2,
    });

    // =========================================================================
    // LIGHTING RIG
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0x8a9299, 1.0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(16, 28, 24);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Warm interior chandeliers
    const chandelierPositions = [-8, -20, -32, -44];
    chandelierPositions.forEach((z) => {
      const chandelierLight = new THREE.PointLight(0xffd588, 2.8, 16, 1.2);
      chandelierLight.position.set(0, 5.0, z);
      scene.add(chandelierLight);

      // Chandelier visual fixture
      const chGroup = new THREE.Group();
      chGroup.position.set(0, 5.4, z);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), goldMat);
      chain.position.y = 0.4;
      chGroup.add(chain);

      const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.3, 0.6, 16), goldMat);
      chGroup.add(tier1);

      const crystals = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 0.8, 12),
        new THREE.MeshStandardMaterial({
          color: 0xfff3d4,
          roughness: 0.1,
          metalness: 0.6,
          transparent: true,
          opacity: 0.85,
        }),
      );
      crystals.position.y = -0.4;
      chGroup.add(crystals);

      scene.add(chGroup);
    });

    // =========================================================================
    // EXTERIOR ARCHITECTURE (Z > 0)
    // =========================================================================

    // 1. Street road and outdoor plaza
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 20),
      new THREE.MeshStandardMaterial({ color: 0x3d4144, roughness: 0.9 }),
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.01, 26);
    scene.add(road);

    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(50, 26), stoneMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.02, 13);
    scene.add(plaza);

    // Royal carpet runner extending from road to the entrance steps
    const runner = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 26), carpetMat);
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.035, 13);
    scene.add(runner);

    // Classical Lampposts along plaza
    [-7, 7].forEach((x) => {
      [6, 18].forEach((z) => {
        const post = new THREE.Group();
        post.position.set(x, 0, z);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.6, 8), goldMat);
        base.position.y = 0.3;
        post.add(base);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.2, 8), goldMat);
        shaft.position.y = 1.9;
        post.add(shaft);

        const lantern = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, 0.55, 0.45),
          new THREE.MeshStandardMaterial({
            color: 0xffe6a3,
            emissive: 0xffaa33,
            emissiveIntensity: 0.6,
          }),
        );
        lantern.position.y = 3.6;
        post.add(lantern);

        scene.add(post);
      });
    });

    // 2. The Grand Neoclassical Facade at Z = 0
    const facadeGroup = new THREE.Group();
    facadeGroup.position.set(0, 0, 0);

    // Left wall wing
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(10, 8.5, 0.6), stoneMat);
    leftWall.position.set(-6.8, 4.25, 0);
    facadeGroup.add(leftWall);

    // Right wall wing
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(10, 8.5, 0.6), stoneMat);
    rightWall.position.set(6.8, 4.25, 0);
    facadeGroup.add(rightWall);

    // Portal Header over doorway
    const portalHeader = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.8, 0.8), stoneMat);
    portalHeader.position.set(0, 6.6, 0);
    facadeGroup.add(portalHeader);

    // Architectural Sign "KANCHI VASTRA"
    const signPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 1.3),
      new THREE.MeshStandardMaterial({ map: createSignTexture(), roughness: 0.3 }),
    );
    signPlane.position.set(0, 6.8, 0.42);
    facadeGroup.add(signPlane);

    // Corinthian fluted columns
    [-2.2, 2.2, -5.5, 5.5].forEach((x) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(x, 0, 0.45);

      const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.5, 16), stoneMat);
      colBase.position.y = 0.25;
      colGroup.add(colBase);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 7.2, 16), stoneMat);
      shaft.position.y = 4.1;
      colGroup.add(shaft);

      const capital = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.85), goldMat);
      capital.position.y = 7.8;
      colGroup.add(capital);

      facadeGroup.add(colGroup);
    });

    // Large storefront display windows on left and right
    [-5.6, 5.6].forEach((x) => {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.8), glassMat);
      win.position.set(x, 2.8, 0.31);
      facadeGroup.add(win);
    });

    scene.add(facadeGroup);

    // =========================================================================
    // 3D DOUBLE DOORS (REAL OBJECTS WITH HINGE PIVOTS AT Z = 0)
    // =========================================================================
    const doorWidth = 1.6;
    const doorHeight = 4.6;
    const doorThickness = 0.08;

    // Left Door Pivot (hinge at x = -1.6, z = 0)
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-doorWidth, 0, 0);

    const leftDoorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness),
      walnutMat,
    );
    leftDoorFrame.position.set(doorWidth / 2, doorHeight / 2, 0);
    leftDoorPivot.add(leftDoorFrame);

    // Glass pane inside door
    const leftDoorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(doorWidth * 0.72, doorHeight * 0.78),
      glassMat,
    );
    leftDoorGlass.position.set(doorWidth / 2, doorHeight / 2, 0.045);
    leftDoorPivot.add(leftDoorGlass);

    // Brass vertical handle on opening edge (right side of left door)
    const leftHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8), goldMat);
    leftHandle.position.set(doorWidth - 0.14, 1.8, 0.09);
    leftDoorPivot.add(leftHandle);

    scene.add(leftDoorPivot);

    // Right Door Pivot (hinge at x = 1.6, z = 0)
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(doorWidth, 0, 0);

    const rightDoorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness),
      walnutMat,
    );
    rightDoorFrame.position.set(-doorWidth / 2, doorHeight / 2, 0);
    rightDoorPivot.add(rightDoorFrame);

    // Glass pane inside door
    const rightDoorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(doorWidth * 0.72, doorHeight * 0.78),
      glassMat,
    );
    rightDoorGlass.position.set(-doorWidth / 2, doorHeight / 2, 0.045);
    rightDoorPivot.add(rightDoorGlass);

    // Brass vertical handle on opening edge (left side of right door)
    const rightHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8), goldMat);
    rightHandle.position.set(-doorWidth + 0.14, 1.8, 0.09);
    rightDoorPivot.add(rightHandle);

    scene.add(rightDoorPivot);

    // Travertine threshold step at Z = 0
    const thresholdStep = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.4), stoneMat);
    thresholdStep.position.set(0, 0.04, 0);
    scene.add(thresholdStep);

    // =========================================================================
    // INTERIOR ENVIRONMENT (EXPANSIVE LUXURY MALL CONCOURSE Z: 0 to -56)
    // =========================================================================
    const interiorGroup = new THREE.Group();

    // 1. Polished Italian White Marble Floor (60m long)
    const interiorFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 60), marbleMat);
    interiorFloor.rotation.x = -Math.PI / 2;
    interiorFloor.position.set(0, 0.02, -28);
    interiorGroup.add(interiorFloor);

    // 2. High Coffered Ceiling (y = 6.2, gold leaf details)
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 60),
      new THREE.MeshStandardMaterial({ color: 0xfdfaf4, roughness: 0.5 }),
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 6.2, -28);
    interiorGroup.add(ceiling);

    // Gold ceiling beams
    for (let z = -4; z >= -52; z -= 8) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(19.8, 0.35, 0.6), goldMat);
      beam.position.set(0, 6.0, z);
      interiorGroup.add(beam);
    }

    // 3. Left Interior Wall with arched vitrines and shelves
    const intLeftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 6.2, 60),
      new THREE.MeshStandardMaterial({ color: 0x421019, roughness: 0.6 }), // Royal Maroon
    );
    intLeftWall.position.set(-9.8, 3.1, -28);
    interiorGroup.add(intLeftWall);

    // 4. Right Interior Wall with gilded alcoves
    const intRightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 6.2, 60),
      new THREE.MeshStandardMaterial({ color: 0x421019, roughness: 0.6 }), // Royal Maroon
    );
    intRightWall.position.set(9.8, 3.1, -28);
    interiorGroup.add(intRightWall);

    // 5. Far End Focal Wall at Z = -58 (with royal arch and gold emblem)
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(20, 6.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x360d14, roughness: 0.5 }),
    );
    backWall.position.set(0, 3.1, -58);
    interiorGroup.add(backWall);

    // Royal gold emblem on back wall
    const emblem = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.1, 16, 32), goldMat);
    emblem.position.set(0, 3.8, -57.7);
    interiorGroup.add(emblem);

    // =========================================================================
    // LEFT SIDE: LONG DISPLAY COUNTERS & FOLDED SILK SAREE STACKS
    // =========================================================================
    const counterZPositions = [-7, -15, -23, -31, -39, -47];
    counterZPositions.forEach((z) => {
      // Long dark walnut counter
      const counter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.95, 1.4), walnutMat);
      counter.position.set(-5.6, 0.475, z);
      interiorGroup.add(counter);

      // White marble counter top
      const top = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, 1.55), marbleMat);
      top.position.set(-5.6, 0.99, z);
      interiorGroup.add(top);

      // Stacks of folded pure silk sarees (Ruby, Emerald, Peacock Blue, Gold)
      [-1.1, 0, 1.1].forEach((ox) => {
        const stack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 0.9), sareeStackMat);
        stack.position.set(-5.6 + ox, 1.17, z);
        interiorGroup.add(stack);
      });

      // Wall-mounted backlit silk cabinet behind counter
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.2, 5.0), walnutMat);
      cabinet.position.set(-9.2, 2.3, z);
      interiorGroup.add(cabinet);

      // Cabinet interior shelves with fabrics
      const shelfContent = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.8), sareeStackMat);
      shelfContent.rotation.y = Math.PI / 2;
      shelfContent.position.set(-8.78, 2.3, z);
      interiorGroup.add(shelfContent);
    });

    // =========================================================================
    // RIGHT SIDE: MANNEQUINS IN BRIDAL SAREES, VELVET LOUNGES, MIRRORS
    // =========================================================================
    const rightFeatureZ = [-8, -18, -28, -38, -48];
    rightFeatureZ.forEach((z, index) => {
      // Raised circular marble pedestal
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.25, 24), marbleMat);
      pedestal.position.set(5.8, 0.125, z);
      interiorGroup.add(pedestal);

      // Mannequin wearing draped traditional silk saree
      const mannequinGroup = new THREE.Group();
      mannequinGroup.position.set(5.8, 0.25, z);

      // Elegant mannequin body (torso & draped silk skirt)
      const skirtMat = new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0x9e1a2b : 0x155d3e, // Bridal Crimson or Temple Emerald
        roughness: 0.35,
        metalness: 0.3,
      });

      const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.45, 16), skirtMat);
      skirt.position.y = 0.72;
      mannequinGroup.add(skirt);

      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.16, 0.65, 16),
        goldMat, // Gold zari blouse/pallu
      );
      torso.position.y = 1.6;
      mannequinGroup.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), goldMat);
      head.position.y = 2.05;
      mannequinGroup.add(head);

      interiorGroup.add(mannequinGroup);

      // Velvet Consultation Lounge Seating
      const chairMat = new THREE.MeshStandardMaterial({
        color: 0x5a121e, // Rich velvet maroon
        roughness: 0.85,
      });

      const chair = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.0), chairMat);
      chair.position.set(8.2, 0.4, z + 2.2);
      interiorGroup.add(chair);

      // Gilded heritage mirror along wall
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.8, 1.8), goldMat);
      mirror.position.set(9.4, 2.6, z);
      interiorGroup.add(mirror);
    });

    scene.add(interiorGroup);

    // =========================================================================
    // RENDER & ANIMATION LOOP (ONE CONTINUOUS CAMERA MOTION ALONG SPLINE)
    // =========================================================================
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const p = progressRef.current;

      // 1. Damping the mouse look-around
      lookCurrentRef.current.x += (lookTargetRef.current.x - lookCurrentRef.current.x) * 0.06;
      lookCurrentRef.current.y += (lookTargetRef.current.y - lookCurrentRef.current.y) * 0.06;

      // 2. Camera Z position travels continuously from road outside to deep mall interior
      // Stage A (p: 0.0 - 0.16): z: 30 -> 18 (exterior road approach)
      // Stage B (p: 0.16 - 0.32): z: 18 -> 4.2 (plaza & steps to entrance)
      // Stage C (p: 0.30 - 0.44): z: 4.2 -> 2.2 (approaching opening doors)
      // Stage D (p: 0.42 - 0.54): z: 2.2 -> -3.0 (cross threshold into interior)
      // Stage E (p: 0.52 - 0.68): z: -3.0 -> -16.0 (grand central walkway)
      // Stage F (p: 0.66 - 0.82): z: -16.0 -> -32.0 (exploring left & right)
      // Stage G & H (p: 0.80 - 1.00): z: -32.0 -> -48.0 (deeper bridal emporium & grand settle)
      let targetZ = 30;
      if (p <= 0.16) {
        targetZ = 30 - (p / 0.16) * 12; // 30 -> 18
      } else if (p <= 0.32) {
        targetZ = 18 - ((p - 0.16) / 0.16) * 13.8; // 18 -> 4.2
      } else if (p <= 0.42) {
        targetZ = 4.2 - ((p - 0.32) / 0.1) * 2.0; // 4.2 -> 2.2
      } else if (p <= 0.54) {
        targetZ = 2.2 - ((p - 0.42) / 0.12) * 5.2; // 2.2 -> -3.0 (physically crosses z=0!)
      } else if (p <= 0.7) {
        targetZ = -3.0 - ((p - 0.54) / 0.16) * 13.0; // -3.0 -> -16.0
      } else if (p <= 0.85) {
        targetZ = -16.0 - ((p - 0.7) / 0.15) * 16.0; // -16.0 -> -32.0
      } else {
        targetZ = -32.0 - ((p - 0.85) / 0.15) * 16.0; // -32.0 -> -48.0
      }

      // Smooth camera interpolation
      camera.position.z += (targetZ - camera.position.z) * 0.1;

      // 3. Physical Doors Opening (Rotate smoothly around hinge pivots)
      // Doors open between p = 0.28 and 0.42
      const doorOpenRaw = Math.min(1, Math.max(0, (p - 0.28) / 0.12));
      const doorOpenEased =
        doorOpenRaw < 0.5
          ? 4 * doorOpenRaw * doorOpenRaw * doorOpenRaw
          : 1 - Math.pow(-2 * doorOpenRaw + 2, 3) / 2;
      const targetDoorAngle = doorOpenEased * 1.5; // ~86 degrees

      leftDoorPivot.rotation.y = -targetDoorAngle;
      rightDoorPivot.rotation.y = targetDoorAngle;

      // 4. Subtle human walking sway & cadence when moving inside
      const isWalking = p > 0.05 && p < 0.98;
      const walkBobY = isWalking ? Math.sin(camera.position.z * 1.8) * 0.03 : 0;

      camera.position.y = 1.7 + walkBobY + lookCurrentRef.current.y * 0.4;

      // 5. Stage F: Gentle turns to explore the left and right saree collections
      let targetRotY = 0;
      if (p > 0.62 && p < 0.74) {
        // Gentle turn to left: explore folded silk saree counters
        const turnRaw = Math.sin(((p - 0.62) / 0.12) * Math.PI);
        targetRotY = turnRaw * 0.24; // ~14 deg left
      } else if (p > 0.74 && p < 0.86) {
        // Gentle turn to right: explore bridal mannequins and velvet lounge
        const turnRaw = Math.sin(((p - 0.74) / 0.12) * Math.PI);
        targetRotY = -turnRaw * 0.22; // ~13 deg right
      }

      camera.rotation.y = targetRotY + lookCurrentRef.current.x;
      camera.rotation.x = lookCurrentRef.current.y * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} id="atelier" className="entrance-section relative bg-[#060302]">
      <h1 className="sr-only">Kanchi Vastra — Luxury Saree Mall Walkthrough</h1>

      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden select-none">
        {/* Isolated WebGL Mount Container */}
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {/* Minimal luxury bottom progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#A37B32] via-[#E2B755] to-[#A37B32] transition-all duration-75 pointer-events-none opacity-50"
          style={{ width: `${scrollProgress * 100}%` }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
