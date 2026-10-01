"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * WebGL hero: golden Giza pyramids under a desert sun, gold dust rising, and a
 * plane orbiting the Great Pyramid. The camera follows the pointer and dollies
 * in as the visitor scrolls. Pauses when off-screen; renders one still frame
 * for visitors who prefer reduced motion.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the CSS gradient backdrop remains.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x021510, 0.042);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

    // Lights
    scene.add(new THREE.AmbientLight(0x2d4a40, 1.2));
    const sunLight = new THREE.DirectionalLight(0xffd59a, 3.2);
    sunLight.position.set(6, 8, 10);
    scene.add(sunLight);
    const rim = new THREE.PointLight(0x1fae8f, 90, 60, 1.6);
    rim.position.set(-9, 5, -6);
    scene.add(rim);
    const warm = new THREE.PointLight(0xebc487, 60, 40, 1.8);
    warm.position.set(0, 6, -10);
    scene.add(warm);

    const world = new THREE.Group();
    scene.add(world);

    // Pyramids of Giza (Khufu, Khafre, Menkaure)
    const pyramidMat = track(
      new THREE.MeshStandardMaterial({ color: 0xc99a58, metalness: 0.75, roughness: 0.32, flatShading: true, emissive: 0x2a1a05, emissiveIntensity: 0.35 }),
    );
    const edgeMat = track(new THREE.LineBasicMaterial({ color: 0xf7e2b8, transparent: true, opacity: 0.55 }));
    const holoMat = track(new THREE.MeshBasicMaterial({ color: 0x1fae8f, wireframe: true, transparent: true, opacity: 0.12 }));
    const pyramids: THREE.Group[] = [];
    [
      { x: 0, z: 0, r: 3.1, h: 4.2 },
      { x: -5.4, z: -3.2, r: 2.6, h: 3.6 },
      { x: 4.6, z: -4.8, r: 1.5, h: 2.2 },
    ].forEach(({ x, z, r, h }) => {
      const g = new THREE.Group();
      const geo = track(new THREE.ConeGeometry(r, h, 4, 1));
      const mesh = new THREE.Mesh(geo, pyramidMat);
      mesh.rotation.y = Math.PI / 4;
      const edges = new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), edgeMat);
      edges.rotation.y = Math.PI / 4;
      const holo = new THREE.Mesh(track(new THREE.ConeGeometry(r * 1.12, h * 1.1, 4, 4)), holoMat);
      holo.rotation.y = Math.PI / 4;
      holo.position.y = h * 0.04;
      g.add(mesh, edges, holo);
      g.position.set(x, h / 2, z);
      world.add(g);
      pyramids.push(g);
    });

    // Desert grid floor
    const grid = new THREE.GridHelper(120, 90, 0xebc487, 0xebc487);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.09;
    track(grid.geometry);
    track(grid.material as THREE.Material);
    world.add(grid);

    // Desert sun (radial glow sprite behind the pyramids)
    const sunCanvas = document.createElement("canvas");
    sunCanvas.width = sunCanvas.height = 256;
    const ctx = sunCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,236,196,1)");
    grad.addColorStop(0.18, "rgba(247,212,150,0.95)");
    grad.addColorStop(0.42, "rgba(235,170,90,0.35)");
    grad.addColorStop(1, "rgba(235,170,90,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const sunTex = track(new THREE.CanvasTexture(sunCanvas));
    const sun = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: sunTex, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })));
    sun.scale.set(22, 22, 1);
    sun.position.set(1.5, 5.5, -26);
    world.add(sun);

    // Stars
    const starGeo = track(new THREE.BufferGeometry());
    const starCount = 1600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 70 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi) - 8;
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 30;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, track(new THREE.PointsMaterial({ color: 0xfff4dc, size: 0.22, sizeAttenuation: true, transparent: true, opacity: 0.75, fog: false })));
    scene.add(stars);

    // Rising gold dust
    const dustCount = 700;
    const dustGeo = track(new THREE.BufferGeometry());
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 34;
      dustPos[i * 3 + 1] = Math.random() * 14;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
      dustSpeed[i] = 0.004 + Math.random() * 0.012;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      track(new THREE.PointsMaterial({ color: 0xebc487, size: 0.08, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    world.add(dust);

    // Orbit ring + plane around the Great Pyramid
    const orbit = new THREE.Group();
    orbit.position.set(0, 2.6, 0);
    orbit.rotation.set(0.32, 0, -0.18);
    world.add(orbit);
    const ringRadius = 5.6;
    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(ringRadius, 0.012, 8, 220)),
      track(new THREE.MeshBasicMaterial({ color: 0xebc487, transparent: true, opacity: 0.45 })),
    );
    ring.rotation.x = Math.PI / 2;
    orbit.add(ring);

    const planeMat = track(new THREE.MeshStandardMaterial({ color: 0xfaf7f1, metalness: 0.6, roughness: 0.25, emissive: 0xebc487, emissiveIntensity: 0.45 }));
    const plane = new THREE.Group();
    const body = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.09, 0.8, 4, 10)), planeMat);
    body.rotation.z = Math.PI / 2;
    const wing = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.02, 1.1)), planeMat);
    const tail = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 0.02, 0.42)), planeMat);
    tail.position.x = -0.42;
    const fin = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.24, 0.02)), planeMat);
    fin.position.set(-0.42, 0.12, 0);
    plane.add(body, wing, tail, fin);
    orbit.add(plane);

    // Glowing trail behind the plane
    const trailLen = 48;
    const trailGeo = track(new THREE.BufferGeometry());
    const trailPos = new Float32Array(trailLen * 3);
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    const trail = new THREE.Line(trailGeo, track(new THREE.LineBasicMaterial({ color: 0xf7e2b8, transparent: true, opacity: 0.8 })));
    orbit.add(trail);

    // Sizing
    let wide = true;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      wide = w >= 1024;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      world.position.x = wide ? 4.2 : 0;
      world.position.y = wide ? -0.6 : -2.2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Pointer + scroll
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) loop();
    });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let firstFrame = true;

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      const baseZ = wide ? 17 : 23;
      const zoom = scroll * 7.5; // zoom in as the visitor scrolls
      const swing = Math.sin(t * 0.08) * 0.18;
      camera.position.set(Math.sin(swing) * baseZ * 0.25 + pointer.x * 1.6, 4 + pointer.y * -0.8 + scroll * 1.2, baseZ - zoom);
      camera.lookAt(world.position.x * 0.55, 2.2 + scroll * 0.6, 0);

      pyramids.forEach((p, i) => {
        p.children[2].rotation.y = Math.PI / 4 + t * 0.12 * (i % 2 ? -1 : 1);
      });

      const a = t * 0.45;
      const px = Math.cos(a) * ringRadius;
      const pz = Math.sin(a) * ringRadius;
      plane.position.set(px, Math.sin(a * 2) * 0.15, pz);
      plane.rotation.y = -a - Math.PI / 2;
      plane.rotation.x = Math.sin(a) * 0.15;
      for (let i = trailLen - 1; i > 0; i--) {
        trailPos[i * 3] = trailPos[(i - 1) * 3];
        trailPos[i * 3 + 1] = trailPos[(i - 1) * 3 + 1];
        trailPos[i * 3 + 2] = trailPos[(i - 1) * 3 + 2];
      }
      trailPos[0] = px;
      trailPos[1] = plane.position.y;
      trailPos[2] = pz;
      if (firstFrame) for (let i = 1; i < trailLen; i++) trailPos.copyWithin(i * 3, 0, 3);
      trailGeo.attributes.position.needsUpdate = true;

      for (let i = 0; i < dustCount; i++) {
        const iy = i * 3 + 1;
        dustPos[iy] += dustSpeed[i];
        dustPos[i * 3] += Math.sin(t * 0.3 + i) * 0.002;
        if (dustPos[iy] > 14) dustPos[iy] = 0;
      }
      dustGeo.attributes.position.needsUpdate = true;

      stars.rotation.y = t * 0.004;
      sun.material.opacity = 0.85 + Math.sin(t * 0.6) * 0.08;

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
    };

    const loop = () => {
      cancelAnimationFrame(raf);
      const tick = () => {
        if (!visible || document.hidden) return;
        renderFrame();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (!document.hidden && visible && !reduced) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) renderFrame();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-[1600ms] [&>canvas]:h-full [&>canvas]:w-full ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
