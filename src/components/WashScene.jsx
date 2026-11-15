// The 3D wash hero — built from scratch with Three.js primitives, no photos.
// A stylised car drives into a workshop bay as the customer scrolls:
// pressure wash (purified water) -> foam & hand wash -> pure-water rinse
// -> blow-dry tunnel -> gleaming exit. Scroll progress drives the timeline;
// the camera, water, foam, dryer and paint gloss all follow timelineParams().
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { washStages, site } from "../config.js";
import { stageAt, timelineParams } from "./washTimeline.js";

function softCircleTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function buildCar() {
  const car = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x5a6b7d, roughness: 0.85, metalness: 0.25 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x11151c, roughness: 0.12, metalness: 0.5 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.9, metalness: 0.1 });

  const body = new THREE.Mesh(new RoundedBoxGeometry(4.3, 0.62, 1.92, 4, 0.18), bodyMat);
  body.position.y = 0.58;
  car.add(body);

  const cabin = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.58, 1.72, 4, 0.22), glassMat);
  cabin.position.set(-0.15, 1.12, 0);
  car.add(cabin);

  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 1.6), trimMat);
  spoiler.position.set(-2.0, 0.98, 0);
  car.add(spoiler);

  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.4 });
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x991111, emissive: 0xcc2222, emissiveIntensity: 0.9 });
  for (const z of [-0.6, 0.6]) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.34), lightMat);
    head.position.set(2.16, 0.72, z);
    car.add(head);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.34), tailMat);
    tail.position.set(-2.16, 0.72, z);
    car.add(tail);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.12), trimMat);
    mirror.position.set(0.62, 1.02, z * 1.68);
    car.add(mirror);
  }

  // Wheels: geometry pre-rotated so the axle lies along Z; spin = rotation.z.
  const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.3, 24);
  tireGeo.rotateX(Math.PI / 2);
  const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.32, 24);
  hubGeo.rotateX(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.95 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xb8bec6, roughness: 0.3, metalness: 0.8 });
  const wheels = [];
  for (const [x, z] of [[-1.45, -0.82], [-1.45, 0.82], [1.45, -0.82], [1.45, 0.82]]) {
    const wheel = new THREE.Group();
    wheel.add(new THREE.Mesh(tireGeo, tireMat));
    wheel.add(new THREE.Mesh(hubGeo, hubMat));
    wheel.position.set(x, 0.36, z);
    car.add(wheel);
    wheels.push(wheel);
  }
  return { car, bodyMat, wheels };
}

export default function WashScene() {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const progressRef = useRef(reduced ? 1 : 0);
  const targetRef = useRef(reduced ? 1 : 0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !pin || !canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      if (!renderer.getContext()) throw new Error("no webgl context");
    } catch {
      setFailed(true);
      return undefined;
    }

    let raf = 0;
    let disposed = false;
    const cleanups = [];
    try {
      const isMobile = window.innerWidth < 760;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75));

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0e1420);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 2.7, 9.5);

      scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x1a1d24, 0.95));
      const sun = new THREE.DirectionalLight(0xffffff, 1.7);
      sun.position.set(4, 8, 6);
      scene.add(sun);
      const archLight = new THREE.PointLight(0x2f8cff, 14, 14);
      archLight.position.set(-2, 3.4, 2);
      scene.add(archLight);

      // Workshop: floor, wet lane, back wall, pillars, ceiling strips.
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(44, 26),
        new THREE.MeshStandardMaterial({ color: 0x171a21, roughness: 0.9 })
      );
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);
      const lane = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 3.4),
        new THREE.MeshStandardMaterial({ color: 0x0e1420, roughness: 0.35, metalness: 0.4 })
      );
      lane.rotation.x = -Math.PI / 2;
      lane.position.y = 0.01;
      scene.add(lane);
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(44, 10),
        new THREE.MeshStandardMaterial({ color: 0x10131a, roughness: 0.95 })
      );
      wall.position.set(0, 5, -7);
      scene.add(wall);
      const stripMat = new THREE.MeshBasicMaterial({ color: 0x2f8cff });
      const strip = new THREE.Mesh(new THREE.BoxGeometry(14, 0.14, 0.06), stripMat);
      strip.position.set(0, 0.5, -6.95);
      scene.add(strip);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xdfeaff });
      for (const z of [-3, 0, 3]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.07, 0.35), lightMat);
        bar.position.set(0, 5.6, z);
        scene.add(bar);
      }
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1c212b, roughness: 0.85 });
      for (const x of [-7.5, 7.5]) {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.5), pillarMat);
        pillar.position.set(x, 3, -6.4);
        scene.add(pillar);
      }

      // Wash arch (x = -2) and dryer tunnel (x = 3).
      const blueMat = new THREE.MeshStandardMaterial({ color: 0x1c6fd9, roughness: 0.4, metalness: 0.4 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x232830, roughness: 0.6, metalness: 0.3 });
      const makeArch = (x, mat, topY) => {
        const g = new THREE.Group();
        for (const z of [-1.35, 1.35]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, topY, 0.2), mat);
          post.position.set(0, topY / 2, z);
          g.add(post);
        }
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 2.9), mat);
        beam.position.set(0, topY, 0);
        g.add(beam);
        g.position.x = x;
        scene.add(g);
        return g;
      };
      makeArch(-2, blueMat, 3.1);
      makeArch(3, darkMat, 3.4);
      const dryerSlats = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 2.4), darkMat);
        slat.position.set(3 + (i - 2) * 0.3, 3.35, 0);
        dryerSlats.add(slat);
      }
      scene.add(dryerSlats);

      // The car.
      const { car, bodyMat, wheels } = buildCar();
      scene.add(car);
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(2.7, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.scale.set(1, 0.42, 1);
      shadow.position.y = 0.02;
      scene.add(shadow);

      // Particles: water jets, foam, sparkles, and slow logo bubbles.
      const tex = softCircleTexture();
      const makePoints = (n, size, color) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
        const mat = new THREE.PointsMaterial({ size, map: tex, transparent: true, opacity: 0, depthWrite: false, color });
        const pts = new THREE.Points(geo, mat);
        pts.frustumCulled = false;
        scene.add(pts);
        return { pts, geo, n };
      };
      const water = makePoints(420, 0.15, 0x9fd4ff);
      const foam = makePoints(220, 0.32, 0xffffff);
      const sparkle = makePoints(48, 0.14, 0xffe9a8);
      const waterState = Array.from({ length: water.n }, () => ({ life: 0, x: 0, y: -1, z: 0, vx: 0, vy: 0, vz: 0 }));
      const foamState = Array.from({ length: foam.n }, () => ({ life: 0, x: 0, y: -1, z: 0, vx: 0, vy: 0, vz: 0 }));
      const sparklePos = new Float32Array(sparkle.n * 3);
      for (let i = 0; i < sparkle.n; i++) {
        sparklePos[i * 3] = (Math.random() - 0.5) * 4.6;
        sparklePos[i * 3 + 1] = 0.5 + Math.random() * 1.4;
        sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      }
      sparkle.geo.setAttribute("position", new THREE.BufferAttribute(sparklePos, 3));
      const bubbles = [];
      const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x7fb8ff, transparent: true, opacity: 0.45, roughness: 0.2 });
      for (let i = 0; i < 8; i++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.07 + Math.random() * 0.11, 12, 12), bubbleMat);
        b.position.set(-6 + Math.random() * 12, Math.random() * 4, -2.5 + Math.random() * 3);
        b.userData.speed = 0.12 + Math.random() * 0.2;
        scene.add(b);
        bubbles.push(b);
      }

      const dirtyColor = new THREE.Color(0x5a6b7d);
      const cleanColor = new THREE.Color(0x2f8cff);
      let lastCarX = 0;
      let visible = true;
      let lastStage = stageAt(progressRef.current);

      const sizeTo = () => {
        const w = pin.clientWidth || 1;
        const h = pin.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      sizeTo();
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(sizeTo);
        ro.observe(pin);
        cleanups.push(() => ro.disconnect());
      }
      const onResize = () => sizeTo();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      const updateProgress = () => {
        if (reduced) {
          targetRef.current = 1;
          return;
        }
        const rect = wrap.getBoundingClientRect();
        const total = Math.max(1, rect.height - window.innerHeight);
        targetRef.current = Math.min(1, Math.max(0, -rect.top / total));
      };
      updateProgress();
      if (!reduced) {
        window.addEventListener("scroll", updateProgress, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", updateProgress));
      }
      if (typeof IntersectionObserver !== "undefined") {
        const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; });
        io.observe(pin);
        cleanups.push(() => io.disconnect());
      }
      const onVis = () => { visible = document.visibilityState === "visible" && visible; };
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() => document.removeEventListener("visibilitychange", onVis));

      const clock = new THREE.Clock();
      const tick = () => {
        if (disposed) return;
        raf = requestAnimationFrame(tick);
        if (!visible || document.visibilityState !== "visible") return;
        const dt = Math.min(0.05, clock.getDelta());
        const t = clock.elapsedTime;
        // Smooth the scroll into the timeline.
        const cur = progressRef.current + (targetRef.current - progressRef.current) * 0.12;
        progressRef.current = Math.abs(targetRef.current - cur) < 0.0005 ? targetRef.current : cur;
        const p = timelineParams(cur);
        const st = stageAt(cur);
        if (st !== lastStage) {
          lastStage = st;
          setStage(st);
        }

        car.position.x = p.carX;
        shadow.position.x = p.carX;
        const dx = p.carX - lastCarX;
        lastCarX = p.carX;
        for (const w of wheels) w.rotation.z -= dx / 0.36;
        bodyMat.color.lerpColors(dirtyColor, cleanColor, 1 - p.dirt);
        bodyMat.roughness = 0.85 - 0.62 * (1 - p.dirt);
        camera.position.x = p.camX;
        camera.position.y = 2.7 + Math.sin(t * 0.4) * 0.05;
        camera.lookAt(p.carX * 0.35, 1.0, 0);

        // Water jets from the arch.
        water.pts.material.opacity = p.water;
        if (p.water > 0.02) {
          const pos = water.geo.attributes.position.array;
          for (let i = 0; i < water.n; i++) {
            const s = waterState[i];
            if (s.life <= 0) {
              s.x = -2 + (Math.random() - 0.5) * 0.5;
              s.y = 2.95;
              s.z = (Math.random() - 0.5) * 1.8;
              s.vx = (Math.random() - 0.5) * 0.8;
              s.vy = -3.2 - Math.random() * 2;
              s.vz = (Math.random() - 0.5) * 0.8;
              s.life = 0.55 + Math.random() * 0.35;
            }
            s.life -= dt;
            s.vy -= 6 * dt;
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.z += s.vz * dt;
            if (s.y < 0.05) s.life = 0;
            pos[i * 3] = s.x;
            pos[i * 3 + 1] = Math.max(0.05, s.y);
            pos[i * 3 + 2] = s.z;
          }
          water.geo.attributes.position.needsUpdate = true;
        }
        // Foam drifting over the car.
        foam.pts.material.opacity = p.foam * 0.9;
        if (p.foam > 0.02) {
          const pos = foam.geo.attributes.position.array;
          for (let i = 0; i < foam.n; i++) {
            const s = foamState[i];
            if (s.life <= 0) {
              s.x = p.carX + (Math.random() - 0.5) * 4.2;
              s.y = 1.2 + Math.random() * 0.9;
              s.z = (Math.random() - 0.5) * 1.9;
              s.vx = (Math.random() - 0.5) * 0.25;
              s.vy = -0.22 - Math.random() * 0.2;
              s.vz = (Math.random() - 0.5) * 0.2;
              s.life = 1.4 + Math.random();
            }
            s.life -= dt;
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.z += s.vz * dt;
            if (s.y < 0.4) s.life = 0;
            pos[i * 3] = s.x;
            pos[i * 3 + 1] = Math.max(0.4, s.y);
            pos[i * 3 + 2] = s.z;
          }
          foam.geo.attributes.position.needsUpdate = true;
        }
        // Dryer: sparkles fade in on the gleaming car.
        sparkle.pts.material.opacity = p.sparkle * (0.55 + 0.45 * Math.sin(t * 3));
        sparkle.pts.position.x = p.carX;
        // Logo bubbles drift upward, always on.
        for (const b of bubbles) {
          b.position.y += b.userData.speed * dt;
          if (b.position.y > 5.2) b.position.y = 0.2;
        }

        renderer.render(scene, camera);
      };
      tick();
      cleanups.push(() => {
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
          }
        });
        renderer.dispose();
      });
    } catch {
      setFailed(true);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => {
        try { fn(); } catch { /* already torn down */ }
      });
    };
  }, [reduced]);

  const s = washStages[stage] || washStages[0];
  return (
    <section
      className="wash-hero"
      ref={wrapRef}
      style={reduced ? { height: "auto" } : { height: "560vh" }}
      aria-label="Watch your car get washed — scroll through the Splash wash"
    >
      <div className="wash-pin" ref={pinRef}>
        <canvas ref={canvasRef} className="wash-canvas" aria-hidden="true" />
        {failed ? (
          <div className="wash-fallback">
            <img src="/photos/logo-mark.jpg" alt="Splash Car Wash logo" />
            <p className="eyebrow">Hand car wash · Glen Osmond, Adelaide · Since 2001</p>
            <h1>Your car, <em>pampered</em> by hand.</h1>
            <p>Your browser can&apos;t show the 3D wash — call us and we&apos;ll pamper your car in person.</p>
            <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
          </div>
        ) : (
          <div className="wash-overlay">
            <p className="eyebrow">Hand car wash · Glen Osmond, Adelaide · Since 2001</p>
            <h1>Your car, <em>pampered</em> by hand.</h1>
            <div className="wash-caption" key={stage}>
              <span className="wash-count">Step {stage + 1} of {washStages.length}</span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              {stage === washStages.length - 1 ? (
                <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
              ) : null}
            </div>
            <div className="wash-progress" aria-hidden="true">
              <span style={{ width: `${((stage + 1) / washStages.length) * 100}%` }} />
            </div>
            {reduced ? null : <p className="wash-hint">Scroll to wash ↓</p>}
          </div>
        )}
      </div>
    </section>
  );
}
