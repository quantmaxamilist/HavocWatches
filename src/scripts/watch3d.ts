import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';

type Opts = { section: HTMLElement; stage: HTMLElement; list: HTMLElement; replay: HTMLButtonElement; onReady?: () => void };
type PartKey = 'case' | 'dial' | 'logo' | 'hands';

const MARK = 'M192,0 L186,17 L151,95 L152,96 L183,81 L186,82 L175,246 L130,247 L129,245 L171,189 L131,188 L130,186 L176,100 L58,210 L111,209 L32,286 L95,279 L105,280 L0,440 L66,428 L69,426 L173,258 L174,272 L162,445 L222,445 L210,268 L211,257 L316,426 L319,428 L385,440 L280,280 L290,279 L353,286 L274,209 L327,210 L209,100 L255,186 L254,188 L214,189 L256,245 L255,247 L209,246 L198,82 L201,81 L234,96Z';

function markShape(size: number) {
  const pts = MARK.replace(/[MZ]/g, '').split(' L').map((p) => p.split(',').map(Number));
  const s = size / 446;
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const X = (x - 193) * s, Y = -(y - 223) * s;
    i ? shape.lineTo(X, Y) : shape.moveTo(X, Y);
  });
  shape.closePath();
  return shape;
}

export function mountWatch({ section, stage, list, replay, onReady }: Opts) {
  const host = stage.querySelector<HTMLElement>('[data-wb-canvas]')!;
  const isPhone = window.matchMedia('(max-width: 899px)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhone ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.PointLight(0xc8282c, 26, 12, 1.6); rim.position.set(-2.6, 1.8, -1.5); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));

  // ── materials ──
  const steel = new THREE.MeshStandardMaterial({ color: 0xc9cbcf, metalness: 1, roughness: 0.28 });
  const steelBrushed = new THREE.MeshStandardMaterial({ color: 0xb7b9bd, metalness: 1, roughness: 0.42 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, metalness: 0.2, roughness: 0.22 });
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x060607, metalness: 0.1, roughness: 0.7 });
  const lume = new THREE.MeshStandardMaterial({ color: 0xe9e2c8, metalness: 0.05, roughness: 0.4, emissive: 0x2a2617 });
  const handMat = new THREE.MeshStandardMaterial({ color: 0xdfe0e2, metalness: 0.9, roughness: 0.25 });
  const red = new THREE.MeshStandardMaterial({ color: 0xb3222a, metalness: 0.35, roughness: 0.35 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x09090a, metalness: 0, roughness: 0.9 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.1, clearcoat: 1, depthWrite: false });

  const watch = new THREE.Group();
  scene.add(watch);
  const parts: Record<string, THREE.Group> = {};
  const mk = (name: string) => { const g = new THREE.Group(); g.name = name; parts[name] = g; watch.add(g); return g; };

  // CASE (+ lugs, crown, caseback, straps)
  const caseG = mk('case');
  const prof = [[0, -0.24], [0.96, -0.24], [1.02, -0.2], [1.06, -0.1], [1.07, 0.06], [1.04, 0.14], [0.98, 0.17], [0.86, 0.17], [0.86, 0.05], [0, 0.05]].map(([x, y]) => new THREE.Vector2(x, y));
  const caseMesh = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), steel);
  caseMesh.rotation.x = Math.PI / 2; caseG.add(caseMesh);
  const lugGeo = new THREE.BoxGeometry(0.15, 0.42, 0.2);
  [[-0.5, 0.98], [0.5, 0.98], [-0.5, -0.98], [0.5, -0.98]].forEach(([x, y]) => { const l = new THREE.Mesh(lugGeo, steelBrushed); l.position.set(x, y, -0.02); caseG.add(l); });
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.2, 32), steelBrushed);
  crown.rotation.z = Math.PI / 2; crown.position.set(1.15, 0, -0.02); caseG.add(crown);
  const strapGeo = new THREE.BoxGeometry(0.84, 1.05, 0.1);
  [1, -1].forEach((s) => { const st = new THREE.Mesh(strapGeo, rubber); st.position.set(0, s * 1.62, -0.12); st.rotation.x = s * 0.3; caseG.add(st); });

  // BEZEL (highlighted with the case)
  const bezelG = mk('bezel');
  const bprof = [[0.82, 0.17], [1.04, 0.17], [1.05, 0.24], [1.0, 0.29], [0.84, 0.29], [0.82, 0.26]].map(([x, y]) => new THREE.Vector2(x, y));
  const bezel = new THREE.Mesh(new THREE.LatheGeometry(bprof, 96), ceramic); bezel.rotation.x = Math.PI / 2; bezelG.add(bezel);
  const tickGeo = new THREE.BoxGeometry(0.022, 0.08, 0.01);
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) continue;
    const a = (i / 60) * Math.PI * 2;
    const t = new THREE.Mesh(tickGeo, i === 0 ? red : lume);
    t.position.set(Math.sin(a) * 0.93, Math.cos(a) * 0.93, 0.295); t.rotation.z = -a; t.scale.y = i % 15 === 0 ? 1.6 : 1; bezelG.add(t);
  }

  // DIAL (+ indices)
  const dialG = mk('dial');
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.04, 96), dialMat); dial.rotation.x = Math.PI / 2; dial.position.z = 0.07; dialG.add(dial);
  const idxGeo = new THREE.BoxGeometry(0.07, 0.17, 0.03);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const m = new THREE.Mesh(idxGeo, lume);
    m.position.set(Math.sin(a) * 0.66, Math.cos(a) * 0.66, 0.105); m.rotation.z = -a;
    if (i % 3 === 0) m.scale.set(1.35, 1.3, 1);
    dialG.add(m);
  }
  const minGeo = new THREE.BoxGeometry(0.008, 0.04, 0.01);
  for (let i = 0; i < 60; i++) { if (i % 5 === 0) continue; const a = (i / 60) * Math.PI * 2; const m = new THREE.Mesh(minGeo, handMat); m.position.set(Math.sin(a) * 0.77, Math.cos(a) * 0.77, 0.095); m.rotation.z = -a; dialG.add(m); }

  // LOGO (HAVOC mark, extruded, red)
  const logoG = mk('logo');
  const logo = new THREE.Mesh(new THREE.ExtrudeGeometry(markShape(0.24), { depth: 0.02, bevelEnabled: false }), red);
  logo.position.set(0, 0.33, 0.09); logoG.add(logo);

  // HANDS (10:09)
  const handsG = mk('hands');
  const hand = (len: number, w: number, mat: THREE.Material, angle: number, z: number, tail = 0) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, len + tail, 0.014), mat); m.position.y = (len - tail) / 2; g.add(m);
    g.rotation.z = -angle; g.position.z = z; handsG.add(g); return g;
  };
  hand(0.42, 0.075, handMat, (10.15 / 12) * Math.PI * 2, 0.13);
  hand(0.62, 0.055, handMat, (9 / 60) * Math.PI * 2, 0.15);
  hand(0.7, 0.014, red, (35 / 60) * Math.PI * 2, 0.17, 0.18);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 24), red); cap.rotation.x = Math.PI / 2; cap.position.z = 0.18; handsG.add(cap);

  // CRYSTAL
  const crystalG = mk('crystal');
  const crystal = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.03, 96), glass); crystal.rotation.x = Math.PI / 2; crystal.position.z = 0.29; crystalG.add(crystal);

  // per-part highlight: clone materials so emissive can be set per group
  const groups: Record<PartKey, THREE.Group[]> = { case: [caseG, bezelG], dial: [dialG], logo: [logoG], hands: [handsG] };
  (Object.keys(groups) as PartKey[]).forEach((k) => groups[k].forEach((g) => g.traverse((o: any) => { if (o.isMesh) { o.material = o.material.clone(); o.userData.part = k; o.userData.baseEm = o.material.emissive?.clone(); } })));

  // final pose + exploded offsets (along the dial normal, one clean move)
  const finalRot = new THREE.Euler(-0.42, 0.52, 0.06);
  const startRot = new THREE.Euler(-0.95, 1.05, -0.12);
  const explode: Record<string, { z: number; r: number }> = {
    case: { z: 0, r: 0 }, bezel: { z: 0.9, r: -0.9 }, dial: { z: 1.65, r: 0.4 }, logo: { z: 2.35, r: 0 }, hands: { z: 3.0, r: 1.4 }, crystal: { z: 3.7, r: 0 },
  };
  const setExploded = () => {
    Object.entries(explode).forEach(([k, v]) => { parts[k].position.set(0, 0, v.z); parts[k].rotation.set(0, 0, v.r); });
    watch.rotation.copy(startRot); watch.scale.setScalar(0.86);
  };
  setExploded();

  // size
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    render();
  };
  let needs = false;
  const render = () => { if (!needs) { needs = true; requestAnimationFrame(() => { needs = false; renderer.render(scene, camera); }); } };

  // pre-compile shaders in idle time, before the section arrives
  const idle = (fn: () => void) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 60));
  idle(() => { if (section.dataset.abort) { renderer.domElement.remove(); renderer.dispose(); return; } renderer.compile(scene, camera); onReady?.(); section.classList.add('has-gl'); section.classList.remove('gl-pending'); resize(); io.observe(stage); });
  const ro = new ResizeObserver(resize); ro.observe(host);

  // ── timeline (plays itself when ≥50% visible, pauses off screen) ──
  const tl = gsap.timeline({ paused: true, onUpdate: render, onComplete: () => { list.classList.add('is-on'); replay.hidden = false; requestAnimationFrame(() => replay.classList.add('is-on')); } });
  const D = 2.4;
  tl.to(watch.rotation, { x: finalRot.x, y: finalRot.y, z: finalRot.z, duration: D, ease: 'power3.inOut' }, 0)
    .to(watch.scale, { x: 1, y: 1, z: 1, duration: D, ease: 'power3.inOut' }, 0);
  ['crystal', 'hands', 'logo', 'dial', 'bezel', 'case'].forEach((k, i) => {
    tl.to(parts[k].position, { z: 0, duration: D - 0.3, ease: 'power3.inOut' }, 0.06 * i)
      .to(parts[k].rotation, { z: 0, duration: D - 0.3, ease: 'power3.inOut' }, 0.06 * i);
  });

  let visible = false, played = false;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      visible = e.isIntersecting && e.intersectionRatio >= 0.5;
      if (visible && !played) { played = true; tl.play(0); }
      else if (!e.isIntersecting && tl.isActive()) tl.pause();
      else if (visible && played && tl.paused() && tl.progress() < 1) tl.resume();
    });
  }, { threshold: [0, 0.5] });

  // ── hover link: list ↔ part ──
  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a[data-part]'));
  let current: PartKey | null = null;
  const highlight = (k: PartKey | null) => {
    if (k === current) return;
    current = k;
    (Object.keys(groups) as PartKey[]).forEach((key) => groups[key].forEach((g) => g.traverse((o: any) => {
      if (o.isMesh && o.material.emissive) o.material.emissive.copy(key === k ? new THREE.Color(0x5a0c0f) : o.userData.baseEm);
    })));
    links.forEach((a) => a.classList.toggle('is-hl', a.dataset.part === k));
    render();
  };
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => tl.progress() === 1 && highlight(a.dataset.part as PartKey));
    a.addEventListener('focus', () => tl.progress() === 1 && highlight(a.dataset.part as PartKey));
    a.addEventListener('mouseleave', () => highlight(null));
    a.addEventListener('blur', () => highlight(null));
  });
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pend = false;
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (pend || tl.progress() < 1 || e.pointerType !== 'mouse') return;
    pend = true;
    requestAnimationFrame(() => {
      pend = false;
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(watch.children, true).find((h: any) => h.object.userData.part);
      highlight(hit ? (hit.object.userData.part as PartKey) : null);
      renderer.domElement.style.cursor = hit ? 'pointer' : '';
    });
  });
  renderer.domElement.addEventListener('pointerleave', () => highlight(null));
  renderer.domElement.addEventListener('click', () => { if (current) location.href = '/havoc-bespoke'; });

  replay.addEventListener('click', () => {
    replay.classList.remove('is-on');
    list.classList.remove('is-on');
    highlight(null);
    setExploded(); render();
    tl.play(0);
  });

  // ── dispose on leave ──
  window.addEventListener('pagehide', () => {
    tl.kill(); io.disconnect(); ro.disconnect();
    scene.traverse((o: any) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    pmrem.dispose(); renderer.dispose();
  }, { once: true });

  (window as any).__wb = { tl, finish: () => { tl.progress(1); render(); } };
}
