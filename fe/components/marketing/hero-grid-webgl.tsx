"use client";

import { useEffect, useRef } from "react";
import type {
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
  Sprite,
  SpriteMaterial,
  Texture,
} from "three";
import { cn } from "@/lib/utils";

/** Monochrome channel glyphs (same marks as product chrome). */
const CHANNEL_PATHS: { id: string; d: string }[] = [
  {
    id: "email",
    d: "M1.5 3.5A1.5 1.5 0 0 1 3 2h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 13 14H3A1.5 1.5 0 0 1 1.5 12.5v-9Zm1.2.4 5.05 3.7a.5.5 0 0 0 .5 0l5.05-3.7a.4.4 0 0 0-.3-.7H3a.4.4 0 0 0-.3.7Z",
  },
  {
    id: "linkedin",
    d: "M2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 11.5 2h-9ZM4 5.2a1.1 1.1 0 1 1 0 2.2A1.1 1.1 0 0 1 4 5.2Zm-.9 3.1h1.8V12H3.1V8.3ZM6.4 8.3H8v.5c.2-.4.9-.7 1.6-.7 1.4 0 2 1 2 2.4V12H9.8v-1.8c0-.8-.2-1.4-.9-1.4-.8 0-1.1.6-1.1 1.4V12H6.4V8.3Z",
  },
  {
    // Canonical X (Simple Icons, scaled to 16×16) — previous path was mirrored
    id: "x",
    d: "M12.6.77h2.45l-5.36 6.13L16 15.23h-4.94l-3.87-5.06-4.42 5.06H.32l5.73-6.55L0 .77h5.06l3.5 4.63L12.6.77Zm-.77 11.68h1.36L4.32 2.08H3.41l8.42 10.37Z",
  },
  {
    id: "instagram",
    d: "M5 1.5h6A3.5 3.5 0 0 1 14.5 5v6a3.5 3.5 0 0 1-3.5 3.5H5A3.5 3.5 0 0 1 1.5 11V5A3.5 3.5 0 0 1 5 1.5Zm0 1.2A2.3 2.3 0 0 0 2.7 5v6A2.3 2.3 0 0 0 5 13.3h6A2.3 2.3 0 0 0 13.3 11V5A2.3 2.3 0 0 0 11 2.7H5Zm7.1 1.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM8 4.7a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 1.3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  },
  {
    id: "youtube",
    d: "M14.3 5.2a1.8 1.8 0 0 0-1.3-1.3C11.8 3.6 8 3.6 8 3.6s-3.8 0-5 .3A1.8 1.8 0 0 0 1.7 5.2 18.8 18.8 0 0 0 1.4 8a18.8 18.8 0 0 0 .3 2.8 1.8 1.8 0 0 0 1.3 1.3c1.2.3 5 .3 5 .3s3.8 0 5-.3a1.8 1.8 0 0 0 1.3-1.3A18.8 18.8 0 0 0 14.6 8a18.8 18.8 0 0 0-.3-2.8ZM6.8 10.3V5.7L10.6 8l-3.8 2.3Z",
  },
  {
    id: "reddit",
    d: "M12.7 7.1a1.3 1.3 0 0 0-2.2-.9 6.8 6.8 0 0 0-3.3-.9l.6-1.8 1.6.4a1 1 0 1 0 .1-1.1L7.6 2.4a.6.6 0 0 0-.7.4L6 5.3a6.8 6.8 0 0 0-3.4.9 1.3 1.3 0 1 0-1.5 2c0 .2-.1.4-.1.6 0 2.1 2.5 3.8 5.5 3.8s5.5-1.7 5.5-3.8c0-.2 0-.4-.1-.6a1.3 1.3 0 0 0 .8-1.1ZM6.2 9.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm4.5-.3c-.3.5-1.1.9-2.2.9s-1.9-.4-2.2-.9a.4.4 0 1 1 .7-.4c.1.2.6.5 1.5.5s1.4-.3 1.5-.5a.4.4 0 1 1 .7.4Zm-.8-1.5a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z",
  },
  {
    id: "tiktok",
    d: "M10.2 2.2c.4 1.5 1.5 2.7 3 3.1v2.1a5.1 5.1 0 0 1-3-.9v3.7a4.1 4.1 0 1 1-4.1-4.1c.2 0 .5 0 .7.1v2.1a2 2 0 1 0 1.4 1.9V2.2h2Z",
  },
  {
    id: "whatsapp",
    d: "M8 1.6A6.4 6.4 0 0 0 2.3 11l-.7 2.6 2.7-.7A6.4 6.4 0 1 0 8 1.6Zm3.3 9.1c-.1.4-.8.7-1.1.8-.3 0-.6.1-1.9-.4-1.7-.7-2.8-2.5-2.9-2.6-.1-.2-.8-1.1-.8-2s.5-1.4.7-1.6c.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2 0 .3 0 .4l-.3.4c-.1.1-.2.3-.1.4.1.2.5.8 1.1 1.3.7.6 1.3.8 1.5.9.2.1.3.1.4 0l.5-.6c.1-.1.3-.1.4-.1l1.3.6c.2.1.3.1.3.2 0 .4-.1 1.1-.4 1.4Z",
  },
];

function makeChannelTexture(
  CanvasTexture: typeof import("three").CanvasTexture,
  pathD: string,
  fill: string,
  disc: string
) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);

  // Soft bright disc so icons read against the field
  const g = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size / 2);
  g.addColorStop(0, disc);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const scale = size / 16;
  ctx.translate(size * 0.18, size * 0.18);
  ctx.scale(scale * 0.64, scale * 0.64);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(pathD));

  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

type IconSprite = {
  sprite: Sprite;
  orbit: number;
  radius: number;
  height: number;
  speed: number;
  phase: number;
  bob: number;
  baseScale: number;
  baseOpacity: number;
  flashUntil: number;
};

/**
 * DataNode-inspired field with bright channel marks drifting in the background.
 * Monochrome icons (DESIGN). No neon / rainbow brand kits. Static under reduced motion.
 */
export function HeroGridWebgl({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let cleanup = () => undefined;

    void (async () => {
      const THREE = await import("three");
      if (disposed || !canvasRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
        powerPreference: "low-power",
      });
      // Fully transparent — page bg + atmosphere show through (same as copy column)
      renderer.setClearColor(0x000000, 0);
      renderer.setClearAlpha(0);

      const scene = new THREE.Scene();
      scene.background = null;
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      // Pulled back so the full globe + orbits fit the right column (not cut)
      camera.position.set(0.35, 0.85, 12.4);
      camera.lookAt(0.35, -0.2, 0);

      const isDark = document.documentElement.classList.contains("dark");
      const ink = isDark ? 0xc8c8c0 : 0x2a2a26;
      const soft = isDark ? 0x6a6a62 : 0x9a9a92;
      const accent = isDark ? 0x4d82ff : 0x1a5cff;
      const iconFill = isDark ? "#f5f5f0" : "#111110";
      const iconDisc = isDark ? "rgba(77,130,255,0.18)" : "rgba(26,92,255,0.12)";

      const root = new THREE.Group();
      scene.add(root);

      const shell = new THREE.IcosahedronGeometry(2.35, 1);
      const shellEdges = new THREE.EdgesGeometry(shell);
      const shellMat = new THREE.LineBasicMaterial({
        color: ink,
        transparent: true,
        opacity: isDark ? 0.28 : 0.2,
      });
      const shellLines = new THREE.LineSegments(shellEdges, shellMat);
      root.add(shellLines);

      const ring = new THREE.TorusGeometry(1.4, 0.012, 8, 64);
      const ringEdges = new THREE.EdgesGeometry(ring);
      const ringMat = new THREE.LineBasicMaterial({
        color: soft,
        transparent: true,
        opacity: isDark ? 0.35 : 0.28,
      });
      const ringLines = new THREE.LineSegments(ringEdges, ringMat);
      ringLines.rotation.x = Math.PI / 2.4;
      root.add(ringLines);

      const ring2Geom = new THREE.TorusGeometry(1.9, 0.01, 8, 64);
      const ring2Edges = new THREE.EdgesGeometry(ring2Geom);
      const ring2Mat = new THREE.LineBasicMaterial({
        color: soft,
        transparent: true,
        opacity: isDark ? 0.24 : 0.18,
      });
      const ring2 = new THREE.LineSegments(ring2Edges, ring2Mat);
      ring2.rotation.x = Math.PI / 2.1;
      ring2.rotation.z = 0.4;
      root.add(ring2);

      const nodePos = shell.getAttribute("position");
      const nodeCount = nodePos.count;
      const nodeArr = new Float32Array(nodeCount * 3);
      for (let i = 0; i < nodeCount; i++) {
        nodeArr[i * 3] = nodePos.getX(i);
        nodeArr[i * 3 + 1] = nodePos.getY(i);
        nodeArr[i * 3 + 2] = nodePos.getZ(i);
      }
      const nodeGeom = new THREE.BufferGeometry();
      nodeGeom.setAttribute("position", new THREE.BufferAttribute(nodeArr, 3));
      const nodeMat = new THREE.PointsMaterial({
        color: accent,
        size: 0.04,
        transparent: true,
        opacity: isDark ? 0.4 : 0.32,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const nodes = new THREE.Points(nodeGeom, nodeMat);
      root.add(nodes);

      // Bright channel icons on slow orbits
      const iconTextures: Texture[] = [];
      const iconMats: SpriteMaterial[] = [];
      const icons: IconSprite[] = [];
      const iconGroup = new THREE.Group();
      scene.add(iconGroup);

      CHANNEL_PATHS.forEach((ch, i) => {
        const tex = makeChannelTexture(THREE.CanvasTexture, ch.d, iconFill, iconDisc);
        iconTextures.push(tex);
        const baseOpacity = isDark ? 0.92 : 0.78;
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: baseOpacity,
          depthWrite: false,
          depthTest: true,
          color: 0xffffff,
        });
        iconMats.push(mat);
        const sprite = new THREE.Sprite(mat);
        const scale = 0.55 + (i % 3) * 0.08;
        sprite.scale.set(scale, scale, 1);
        sprite.userData.channelId = ch.id;
        iconGroup.add(sprite);
        icons.push({
          sprite,
          orbit: (i / CHANNEL_PATHS.length) * Math.PI * 2,
          radius: 2.7 + (i % 4) * 0.35,
          height: ((i % 5) - 1.5) * 0.38,
          speed: 0.12 + (i % 3) * 0.03,
          phase: i * 0.7,
          bob: 0.14 + (i % 2) * 0.06,
          baseScale: scale,
          baseOpacity,
          flashUntil: 0,
        });
      });

      // Sparse dust — keep light so the column doesn't read as a different surface
      const rainCount = 12;
      const rainArr = new Float32Array(rainCount * 3);
      for (let i = 0; i < rainCount; i++) {
        rainArr[i * 3] = (Math.random() - 0.5) * 8;
        rainArr[i * 3 + 1] = (Math.random() - 0.5) * 6;
        rainArr[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      const rainGeom = new THREE.BufferGeometry();
      rainGeom.setAttribute("position", new THREE.BufferAttribute(rainArr, 3));
      const rainMat = new THREE.PointsMaterial({
        color: soft,
        size: 0.01,
        transparent: true,
        opacity: isDark ? 0.05 : 0.04,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const rain = new THREE.Points(rainGeom, rainMat);
      scene.add(rain);

      const placeIcons = (elapsed: number, nowMs: number) => {
        icons.forEach((icon) => {
          const a = icon.orbit + elapsed * icon.speed;
          icon.sprite.position.set(
            Math.cos(a) * icon.radius,
            icon.height + Math.sin(elapsed * 0.7 + icon.phase) * icon.bob,
            Math.sin(a) * icon.radius
          );

          const mat = icon.sprite.material as SpriteMaterial;
          const flashing = icon.flashUntil > nowMs;
          if (flashing) {
            const t = 1 - (icon.flashUntil - nowMs) / 900;
            const pulse = 1 + Math.sin(t * Math.PI) * 0.28;
            mat.color.setHex(accent);
            mat.opacity = 1;
            icon.sprite.scale.set(icon.baseScale * pulse, icon.baseScale * pulse, 1);
          } else if (icon.flashUntil !== 0) {
            icon.flashUntil = 0;
            mat.color.setHex(0xffffff);
            mat.opacity = icon.baseOpacity;
            icon.sprite.scale.set(icon.baseScale, icon.baseScale, 1);
          }
        });
      };
      placeIcons(0, performance.now());

      let pointerX = 0;
      let pointerY = 0;
      let targetX = 0;
      let targetY = 0;

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();

      const onPointer = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
        targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.35;
      };

      const onPointerDown = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(
          icons.map((icon) => icon.sprite),
          false
        );
        if (!hits.length) return;
        const hit = hits[0].object;
        const icon = icons.find((row) => row.sprite === hit);
        if (!icon) return;
        icon.flashUntil = performance.now() + 900;
        if (reduce) {
          const flashLoop = (t: number) => {
            if (disposed) return;
            placeIcons(0, t);
            renderer.render(scene, camera);
            if (icons.some((row) => row.flashUntil > t)) {
              requestAnimationFrame(flashLoop);
            }
          };
          requestAnimationFrame(flashLoop);
        }
      };

      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
      };

      resize();
      window.addEventListener("resize", resize);
      canvas.addEventListener("pointerdown", onPointerDown);
      if (!reduce) canvas.addEventListener("pointermove", onPointer, { passive: true });

      const start = performance.now();
      const rainAttr = rainGeom.getAttribute("position");

      const renderFrame = (t: number) => {
        if (disposed) return;
        const elapsed = (t - start) / 1000;

        if (!reduce) {
          root.rotation.y = elapsed * 0.1;
          root.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
          ringLines.rotation.z = elapsed * 0.15;
          ring2.rotation.z = -elapsed * 0.1;
          placeIcons(elapsed, t);

          pointerX += (targetX - pointerX) * 0.04;
          pointerY += (targetY - pointerY) * 0.04;
          camera.position.x = 0.35 + pointerX;
          camera.position.y = 0.85 - pointerY;
          camera.lookAt(0.35 + pointerX * 0.25, -0.2, 0);

          for (let i = 0; i < rainCount; i++) {
            let y = rainAttr.getY(i) - 0.012;
            if (y < -5) y = 5;
            rainAttr.setY(i, y);
          }
          rainAttr.needsUpdate = true;
        } else {
          placeIcons(0, t);
        }

        renderer.render(scene, camera);
        if (!reduce) raf = requestAnimationFrame(renderFrame);
      };

      if (reduce) {
        renderer.render(scene, camera);
      } else {
        raf = requestAnimationFrame(renderFrame);
      }

      const disposeObj = (obj: LineSegments | Points) => {
        (obj.geometry as BufferGeometry).dispose();
        const mat = obj.material as LineBasicMaterial | PointsMaterial;
        mat.dispose();
      };

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("pointermove", onPointer);
        canvas.removeEventListener("pointerdown", onPointerDown);
        disposeObj(shellLines);
        disposeObj(ringLines);
        disposeObj(ring2);
        disposeObj(nodes);
        disposeObj(rain);
        icons.forEach((icon) => iconGroup.remove(icon.sprite));
        iconMats.forEach((m) => m.dispose());
        iconTextures.forEach((t) => t.dispose());
        shell.dispose();
        ring.dispose();
        ring2Geom.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Soft alpha fade only — does not paint a different bg (keeps seamlessness)
        "[mask-image:linear-gradient(90deg,transparent_0%,black_10%,black_100%)]",
        "[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_10%,black_100%)]",
        className
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-auto h-full w-full cursor-pointer bg-transparent"
      />
    </div>
  );
}
