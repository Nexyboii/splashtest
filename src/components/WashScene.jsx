// The 3D wash hero — built from scratch with Three.js, no photos.
// A stylised car, drawn as an extruded side profile, drives through a
// workshop bay as the customer scrolls: pressure wash (purified water) ->
// foam & hand wash -> interior, detailed (door opens, a worker vacuums
// inside) -> pure-water rinse -> blow-dry tunnel -> gleaming exit.
// Scroll progress drives the timeline; the camera, water, foam, door,
// dryer and paint gloss all follow timelineParams().
// Three.js is dynamically imported inside the effect so the page shell
// (and the loading screen fade) never waits on the 3D library. If WebGL
// or the import fails, the graceful fallback hero shows instead.

import { useEffect, useMemo, useRef, useState } from "react";
import { washStages, site } from "../config.js";
import { stageAt, timelineParams } from "./washTimeline.js";

function softCircleTexture(THREE) {
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

// The car: a side-profile shape extruded into a body, with a glass canopy,
// an interior (seats, dash, wheel), a driver's door that swings open, and
// four spinning wheels.
function buildCar(THREE, RoundedBoxGeometry) {
  const car = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x5a6b7d, roughness: 0.85, metalness: 0.5 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x11151c, roughness: 0.12, metalness: 0.6, transparent: true, opacity: 0.6 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.9, metalness: 0.1 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.9 });

  // Side profile: front at +x. Rear face up, roofline, nose down.
  const s = new THREE.Shape();
  s.moveTo(-2.2, 0.3);
  s.lineTo(-2.2, 0.82);
  s.quadraticCurveTo(-2.18, 1.04, -1.92, 1.06);
  s.lineTo(-1.12, 1.08);
  s.quadraticCurveTo(-0.72, 1.42, -0.3, 1.46);
  s.lineTo(0.35, 1.48);
  s.quadraticCurveTo(0.85, 1.44, 1.28, 1.06);
  s.lineTo(1.92, 1.0);
  s.quadraticCurveTo(2.2, 0.98, 2.2, 0.8);
  s.lineTo(2.2, 0.3);
  s.closePath();
  const bodyGeo = new THREE.ExtrudeGeometry(s, { depth: 1.7, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2, steps: 1 });
  bodyGeo.translate(0, 0, -0.85);
  car.add(new THREE.Mesh(bodyGeo, bodyMat));

  // Glass canopy: roof + windshield + rear glass, slightly narrower.
  const g = new THREE.Shape();
  g.moveTo(-1.05, 1.08);
  g.quadraticCurveTo(-0.68, 1.4, -0.28, 1.44);
  g.lineTo(0.32, 1.46);
  g.quadraticCurveTo(0.8, 1.42, 1.18, 1.08);
  g.closePath();
  const glassGeo = new THREE.ExtrudeGeometry(g, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 1 });
  glassGeo.translate(0, 0, -0.75);
  car.add(new THREE.Mesh(glassGeo, glassMat));

  // Interior: seats, dash, steering wheel (seen through the open door).
  for (const z of [-0.42, 0.42]) {
    const seat = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.55, 0.45, 2, 0.08), seatMat);
    seat.position.set(-0.35, 0.85, z);
    car.add(seat);
    const seatBack = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.6, 0.45, 2, 0.06), seatMat);
    seatBack.position.set(-0.62, 1.0, z);
    car.add(seatBack);
  }
  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 1.4), seatMat);
  dash.position.set(0.95, 0.98, 0);
  car.add(dash);
  const steering = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 8, 20), seatMat);
  steering.position.set(0.72, 1.08, -0.42);
  steering.rotation.y = Math.PI / 2;
  car.add(steering);

  // Dark doorway revealed when the driver's door swings open.
  const doorway = new THREE.Group();
  doorway.position.set(0, 0.78, 0.902);
  const dark = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.58, 0.02), new THREE.MeshStandardMaterial({ color: 0x0a0c0f, roughness: 1 }));
  doorway.add(dark);
  const innerSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.03), new THREE.MeshStandardMaterial({ color: 0x23262c, roughness: 0.9 }));
  innerSeat.position.set(-0.2, -0.02, 0.01);
  doorway.add(innerSeat);
  const innerDash = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.03), seatMat);
  innerDash.position.set(0.36, 0.04, 0.01);
  doorway.add(innerDash);
  car.add(doorway);

  // Driver's door (near side), hinged at its front edge.
  const doorPivot = new THREE.Group();
  doorPivot.position.set(0.52, 0.78, 0.945);
  const doorPanel = new THREE.Mesh(new RoundedBoxGeometry(1.04, 0.6, 0.05, 2, 0.02), bodyMat);
  doorPanel.position.set(-0.52, 0, 0);
  doorPivot.add(doorPanel);
  const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.26, 0.02), glassMat);
  doorGlass.position.set(-0.52, 0.2, 0.005);
  doorPivot.add(doorGlass);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.04), trimMat);
  handle.position.set(-0.88, -0.08, 0.04);
  doorPivot.add(handle);
  car.add(doorPivot);

  // Details: headlights, grille, taillights, mirrors, spoiler, skirts.
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.4 });
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x991111, emissive: 0xcc2222, emissiveIntensity: 0.9 });
  for (const z of [-0.55, 0.55]) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.36), lightMat);
    head.position.set(2.2, 0.78, z);
    car.add(head);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.36), tailMat);
    tail.position.set(-2.2, 0.78, z);
    car.add(tail);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.12), trimMat);
    mirror.position.set(0.62, 1.02, z * 1.68);
    car.add(mirror);
  }
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.9), trimMat);
  grille.position.set(2.21, 0.52, 0);
  car.add(grille);
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 1.6), trimMat);
  spoiler.position.set(-2.0, 1.1, 0);
  car.add(spoiler);
  for (const z of [-0.88, 0.88]) {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 0.06), trimMat);
    skirt.position.set(0, 0.32, z);
    car.add(skirt);
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
  return { car, bodyMat, doorPivot, wheels };
}

// A small stylised worker: capsule torso/legs, sphere head with cap,
// pivoted arms so poses can animate. Returns the figure plus its materials
// (for per-stage fade) and arm pivots.
function makeFigure(THREE, opts = {}) {
  const shirtC = opts.shirt ?? 0x1c6fd9;
  const skinC = opts.skin ?? 0xc08a5e;
  const capC = opts.cap ?? 0x0e1420;
  const pantsC = opts.pants ?? 0x1c212b;
  const group = new THREE.Group();
  const lean = new THREE.Group();
  group.add(lean);
  const mats = [];
  const mat = (c) => {
    const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, transparent: true });
    mats.push(m);
    return m;
  };
  const shirtMat = mat(shirtC);
  const pantsMat = mat(pantsC);
  const skinMat = mat(skinC);
  const capMat = mat(capC);
  for (const x of [-0.11, 0.11]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.5, 4, 10), pantsMat);
    leg.position.set(x, 0.45, 0);
    lean.add(leg);
  }
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.42, 4, 12), shirtMat);
  torso.position.y = 1.06;
  lean.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.145, 18, 14), skinMat);
  head.position.y = 1.56;
  lean.add(head);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.155, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
  cap.position.y = 1.58;
  lean.add(cap);
  const brim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.14), capMat);
  brim.position.set(0, 1.6, 0.14);
  lean.add(brim);
  const armGeo = new THREE.CapsuleGeometry(0.07, 0.38, 4, 10);
  const armL = new THREE.Group();
  armL.position.set(-0.26, 1.3, 0);
  lean.add(armL);
  const armLm = new THREE.Mesh(armGeo, shirtMat);
  armLm.position.y = -0.22;
  armL.add(armLm);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skinMat);
  handL.position.y = -0.46;
  armL.add(handL);
  const armR = new THREE.Group();
  armR.position.set(0.26, 1.3, 0);
  lean.add(armR);
  const armRm = new THREE.Mesh(armGeo, shirtMat);
  armRm.position.y = -0.22;
  armR.add(armRm);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skinMat);
  handR.position.y = -0.46;
  armR.add(handR);
  return { group, lean, armL, armR, mats };
}

function setFigureOpacity(fig, a) {
  fig.group.visible = a > 0.02;
  for (const m of fig.mats) m.opacity = a;
}

export default function WashScene() {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
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
    if (!wrap || !pin || !canvas) return undefined;

    let cancelled = false;
    let dispose = () => {};

    (async () => {
      let THREE;
      let RoundedBoxGeometry;
      try {
        THREE = await import("three");
        ({ RoundedBoxGeometry } = await import("three/addons/geometries/RoundedBoxGeometry.js"));
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        if (!renderer.getContext()) throw new Error("no webgl context");
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled) return;

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
        const rinseLight = new THREE.PointLight(0x2f8cff, 10, 12);
        rinseLight.position.set(1.4, 3.4, 2);
        scene.add(rinseLight);

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
        const strip = new THREE.Mesh(new THREE.BoxGeometry(14, 0.14, 0.06), new THREE.MeshBasicMaterial({ color: 0x2f8cff }));
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

        // Two wash arches (pressure wash at -2, rinse at 1.4) + dryer tunnel (3.4).
        // Posts sit wide of the car (z ±1.7) so they never cross in front of it.
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x1c6fd9, roughness: 0.4, metalness: 0.4 });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x232830, roughness: 0.6, metalness: 0.3 });
        const makeArch = (x, mat, topY) => {
          const g = new THREE.Group();
          for (const z of [-1.7, 1.7]) {
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, topY, 0.2), mat);
            post.position.set(0, topY / 2, z);
            g.add(post);
          }
          const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 3.6), mat);
          beam.position.set(0, topY, 0);
          g.add(beam);
          g.position.x = x;
          scene.add(g);
          return g;
        };
        makeArch(-2, blueMat, 3.1);
        makeArch(1.4, blueMat, 3.1);
        makeArch(3.4, darkMat, 3.4);
        const dryerSlats = new THREE.Group();
        for (let i = 0; i < 5; i++) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 2.4), darkMat);
          slat.position.set(3.4 + (i - 2) * 0.3, 3.35, 0);
          dryerSlats.add(slat);
        }
        scene.add(dryerSlats);
        // Dryer air streaks: thin falling columns under the tunnel.
        const streakMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        const streaks = [];
        for (let i = 0; i < 12; i++) {
          const streak = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.7, 0.03), streakMat);
          streak.position.set(3.4 + ((i % 4) - 1.5) * 0.35, 3, (Math.floor(i / 4) - 1) * 0.55);
          scene.add(streak);
          streaks.push(streak);
        }
        // Water sheet: a translucent curtain under the active spray arch.
        const sheetMat = new THREE.MeshBasicMaterial({ color: 0x9fd4ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
        const sheet = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), sheetMat);
        sheet.position.set(-2, 1.55, 0);
        scene.add(sheet);

        // The car.
        const { car, bodyMat, doorPivot, wheels } = buildCar(THREE, RoundedBoxGeometry);
        scene.add(car);
        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(2.7, 32),
          new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.scale.set(1, 0.42, 1);
        shadow.position.y = 0.02;
        scene.add(shadow);

        // The three workers: wiper (wash arch), vacuum (interior), towel (exit).
        const wiper = makeFigure(THREE, {});
        wiper.group.position.set(-1.6, 0, 1.45);
        wiper.group.rotation.y = Math.PI;
        const cloth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.14), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true }));
        cloth.position.set(0, -0.5, 0.03);
        wiper.armR.add(cloth);
        wiper.mats.push(cloth.material);
        scene.add(wiper.group);

        const vacuum = makeFigure(THREE, { skin: 0x8a5f3c });
        vacuum.group.position.set(0.35, 0, 1.5);
        vacuum.group.rotation.y = Math.PI;
        const nozzle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.32, 0.09), new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.7, transparent: true }));
        nozzle.position.set(0, -0.52, 0.02);
        vacuum.armR.add(nozzle);
        vacuum.mats.push(nozzle.material);
        scene.add(vacuum.group);
        const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0x232830, roughness: 0.6 }));
        canister.position.set(1.5, 0.25, 1.9);
        scene.add(canister);

        const towelFig = makeFigure(THREE, { skin: 0xd9a06b });
        towelFig.group.position.set(5.6, 0, 1.5);
        towelFig.group.rotation.y = -Math.PI / 2;
        const towel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true }));
        towel.position.set(0, -0.5, 0.02);
        towelFig.armL.add(towel);
        towelFig.mats.push(towel.material);
        scene.add(towelFig.group);

        // Particles: water jets, foam, sparkles, and slow logo bubbles.
        const tex = softCircleTexture(THREE);
        const makePoints = (n, size, color) => {
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
          const mat = new THREE.PointsMaterial({ size, map: tex, transparent: true, opacity: 0, depthWrite: false, color });
          const pts = new THREE.Points(geo, mat);
          pts.frustumCulled = false;
          scene.add(pts);
          return { pts, geo, n };
        };
        const waterN = isMobile ? 260 : 420;
        const foamN = isMobile ? 140 : 220;
        const water = makePoints(waterN, 0.2, 0x9fd4ff);
        const foam = makePoints(foamN, 0.32, 0xffffff);
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
        let aspect = 1;
        let distBase = 9.5;
        let settled = false;

        const sizeTo = () => {
          const w = pin.clientWidth || 1;
          const h = pin.clientHeight || 1;
          aspect = w / h;
          camera.fov = aspect < 0.8 ? 50 : 42;
          distBase = aspect < 1 ? 9.5 + (1 - aspect) * 8 : 9.5;
          renderer.setSize(w, h, false);
          camera.aspect = aspect;
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
          doorPivot.rotation.y = p.door * 1.15;
          camera.position.x = p.camX;
          camera.position.z = distBase * (1 - 0.22 * p.close);
          camera.position.y = 2.9 + Math.sin(t * 0.4) * 0.05;
          camera.lookAt(p.carX * 0.6, 0.75, 0);

          // Workers, posed and faded by their stage.
          setFigureOpacity(wiper, p.wipe);
          if (p.wipe > 0.02) {
            wiper.lean.rotation.x = 0.14;
            wiper.armR.rotation.x = -1.05 + Math.sin(t * 5) * 0.45;
            wiper.armL.rotation.x = -0.35 + Math.sin(t * 5 + 1) * 0.2;
          }
          setFigureOpacity(vacuum, p.vacuum);
          if (p.vacuum > 0.02) {
            vacuum.lean.rotation.x = 0.38 * p.vacuum;
            vacuum.armR.rotation.x = -1.25 + Math.sin(t * 2.4) * 0.12;
            vacuum.armL.rotation.x = -0.5;
          }
          setFigureOpacity(towelFig, p.towel);
          if (p.towel > 0.02) {
            towelFig.lean.rotation.x = 0.05;
            towelFig.armR.rotation.x = -2.3;
            towelFig.armR.rotation.z = Math.sin(t * 6) * 0.45;
            towelFig.armL.rotation.x = -0.9;
          }

          // Water jets from the active arch, plus the curtain sheet.
          water.pts.material.opacity = p.water;
          sheet.position.x = p.archX;
          sheetMat.opacity = p.water * 0.28;
          if (p.water > 0.02) {
            const pos = water.geo.attributes.position.array;
            for (let i = 0; i < water.n; i++) {
              const s = waterState[i];
              if (s.life <= 0) {
                s.x = p.archX + (Math.random() - 0.5) * 0.5;
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
          // Dryer air streaks falling under the tunnel.
          streakMat.opacity = p.dryer * 0.55;
          if (p.dryer > 0.02) {
            for (let i = 0; i < streaks.length; i++) {
              streaks[i].position.y = 3.3 - ((t * 1.8 + i * 0.37) % 2.8);
            }
          }
          // Sparkles on the gleaming car.
          sparkle.pts.material.opacity = p.sparkle * (0.55 + 0.45 * Math.sin(t * 3));
          sparkle.pts.position.x = p.carX;
          // Logo bubbles drift upward.
          for (const b of bubbles) {
            b.position.y += b.userData.speed * dt;
            if (b.position.y > 5.2) b.position.y = 0.2;
          }

          // Render only while something moves; one last frame when it settles.
          const animating =
            Math.abs(targetRef.current - cur) > 0.0005 ||
            p.water > 0.02 || p.foam > 0.02 || p.dryer > 0.02 || p.sparkle > 0.02 ||
            p.wipe > 0.02 || p.vacuum > 0.02 || p.towel > 0.02;
          if (animating) {
            settled = false;
            renderer.render(scene, camera);
          } else if (!settled) {
            settled = true;
            renderer.render(scene, camera);
          }
        };
        tick();
        setReady(true);
        dispose = () => {
          disposed = true;
          cancelAnimationFrame(raf);
          cleanups.forEach((fn) => {
            try { fn(); } catch { /* already torn down */ }
          });
          scene.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
              (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
            }
          });
          renderer.dispose();
        };
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, [reduced]);

  const s = washStages[stage] || washStages[0];
  return (
    <section
      className="wash-hero"
      ref={wrapRef}
      style={reduced ? { height: "auto" } : { height: "630vh" }}
      aria-label="Watch your car get washed — scroll through the Splash wash"
    >
      <div className={`wash-pin${ready ? " ready" : ""}`} ref={pinRef}>
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
