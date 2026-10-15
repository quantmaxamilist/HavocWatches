import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
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

export async function mountWatch({ section, stage, list, replay, onReady }: Opts) {
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
  camera.position.set(0, 0, 10.4);

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

  // ── Replica of the HAVOC Challenger GMT ──
  // Dial and bezel are textures cut from the real product photo (hands painted out),
  // so every print, numeral and the date window are the real watch. 1 unit = 410px of that photo.
  const PX = 1.04 / 410;
  const texLoader = new THREE.TextureLoader();
  const loadTex = (u: string) => new Promise<THREE.Texture>((res, rej) => texLoader.load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); res(t); }, undefined, rej));
  const [dialTex, bezelTex] = await Promise.all([loadTex('/img/gmt-dial.webp'), loadTex('/img/gmt-bezel.webp')]);
  const printed = (map: THREE.Texture) => new THREE.MeshStandardMaterial({ map, metalness: 0.15, roughness: 0.35, transparent: false });

  // CASE (+ lugs, crown, Oyster-style bracelet) — highlighted with the bezel as "Case"
  const caseG = mk('case');
  const prof = [[0, -0.24], [0.98, -0.24], [1.04, -0.2], [1.08, -0.1], [1.09, 0.06], [1.07, 0.14], [1.02, 0.17], [0.86, 0.17], [0.86, 0.05], [0, 0.05]].map(([x, y]) => new THREE.Vector2(x, y));
  const caseMesh = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), steel);
  caseMesh.rotation.x = Math.PI / 2; caseG.add(caseMesh);
  // lugs: taper from the case into the bracelet width
  const lugShape = new THREE.Shape(); lugShape.moveTo(-0.5, -0.1); lugShape.lineTo(0.5, -0.1); lugShape.lineTo(0.385, 0.42); lugShape.lineTo(-0.385, 0.42); lugShape.closePath();
  const lugGeo = new THREE.ExtrudeGeometry(lugShape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
  [1, -1].forEach((sgn) => { const l = new THREE.Mesh(lugGeo, steelBrushed); l.position.set(0, sgn * 0.86, -0.19); if (sgn < 0) l.rotation.z = Math.PI; caseG.add(l); });
  // crown with knurled edge
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 40, 1), steelBrushed);
  crown.rotation.z = Math.PI / 2; crown.position.set(1.17, 0, -0.04); caseG.add(crown);
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; const k = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.018, 0.018), steel); k.position.set(1.17, Math.cos(a) * 0.152, -0.04 + Math.sin(a) * 0.152); caseG.add(k); }
  // bracelet: three-row Oyster-style links, chained so each row hinges off the one before
  const LEN = 0.26, outerLink = new RoundedBoxGeometry(0.235, LEN, 0.12, 3, 0.035), midLink = new RoundedBoxGeometry(0.25, LEN * 0.96, 0.13, 3, 0.04);
  [1, -1].forEach((sgn) => {
    let jy = 1.27, jz = -0.09, ang = 0.02;
    for (let i = 0; i < 7; i++) {
      const dy = Math.cos(ang) * LEN, dz = -Math.sin(ang) * LEN;
      const row = new THREE.Group();
      [-0.245, 0.245].forEach((x) => { const m = new THREE.Mesh(outerLink, steelBrushed); m.position.x = x; row.add(m); });
      const c = new THREE.Mesh(midLink, steel); c.position.z = 0.008; row.add(c);
      row.position.set(0, sgn * (jy + dy / 2), jz + dz / 2); row.rotation.x = sgn * ang;
      caseG.add(row);
      jy += dy; jz += dz; ang += 0.14;
    }
  });

  // BEZEL — black ceramic insert textured from the real 24-hour bezel, on a knurled steel ring
  const bezelG = mk('bezel');
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.085, 1.085, 0.12, 120, 1, true), steelBrushed);
  coin.rotation.x = Math.PI / 2; coin.position.z = 0.23; bezelG.add(coin);
  for (let i = 0; i < 120; i++) { const a = (i / 120) * Math.PI * 2; const k = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.014, 0.12), steel); k.position.set(Math.cos(a) * 1.09, Math.sin(a) * 1.09, 0.23); bezelG.add(k); }
  const insert = new THREE.Mesh(new THREE.RingGeometry(320 * PX, 410 * PX, 160, 1), printed(bezelTex));
  insert.position.z = 0.292; bezelG.add(insert);
  // inner flange (rehaut) is printed in the dial texture; add a thin steel wall so the bezel has depth
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(320 * PX, 320 * PX, 0.12, 120, 1, true), steel);
  wall.rotation.x = Math.PI / 2; wall.position.z = 0.23; bezelG.add(wall);

  // DIAL — real dial print (markers, HAVOC, flag, GMT AUTOMATIC 200m/660ft, date window)
  const dialG = mk('dial');
  const dial = new THREE.Mesh(new THREE.CircleGeometry(330 * PX, 160), printed(dialTex));
  dial.position.z = 0.09; dialG.add(dial);

  // LOGO — the red HAVOC mark, applied at its real position on the dial
  const logoG = mk('logo');
  const logo = new THREE.Mesh(new THREE.ExtrudeGeometry(markShape(66 * PX), { depth: 0.012, bevelEnabled: false }), red);
  logo.position.set(-2.5 * PX, 150 * PX, 0.092); logoG.add(logo);

  // HANDS — shapes and positions measured from the product photo
  const handsG = mk('hands');
  const lumeHand = new THREE.MeshStandardMaterial({ color: 0xf4f3ee, metalness: 0.1, roughness: 0.35, emissive: 0x1d1d1a });
  const frame = handMat;
  const at = (deg: number, z: number) => { const g = new THREE.Group(); g.rotation.z = -THREE.MathUtils.degToRad(deg); g.position.z = z; handsG.add(g); return g; };
  const flat = (shape: THREE.Shape, mat: THREE.Material, d = 0.012) => new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 24 }), mat);
  // hour: Mercedes hand
  {
    const g = at(302, 0.12);
    const L = 150 * PX, rc = 34 * PX, w = 13 * PX;
    const shaft = new THREE.Shape(); shaft.moveTo(-w, 0); shaft.lineTo(w, 0); shaft.lineTo(w * 0.8, L - rc * 1.6); shaft.lineTo(-w * 0.8, L - rc * 1.6); shaft.closePath();
    g.add(flat(shaft, frame));
    const ring = new THREE.Shape(); ring.absarc(0, L - rc, rc, 0, Math.PI * 2, false); const hole = new THREE.Path(); hole.absarc(0, L - rc, rc - 5 * PX, 0, Math.PI * 2, true); ring.holes.push(hole);
    g.add(flat(ring, frame));
    for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(4 * PX, rc, 0.012), frame); sp.geometry.translate(0, rc / 2, 0.006); sp.position.y = L - rc; sp.rotation.z = (i * 2 * Math.PI) / 3; g.add(sp); }
    const tip = new THREE.Shape(); tip.moveTo(-9 * PX, L - 4 * PX); tip.lineTo(9 * PX, L - 4 * PX); tip.lineTo(0, L + 26 * PX); tip.closePath(); g.add(flat(tip, frame));
    const lumeStrip = new THREE.Mesh(new THREE.BoxGeometry(10 * PX, L - rc * 2 - 30 * PX, 0.004), lumeHand); lumeStrip.position.set(0, 30 * PX + (L - rc * 2 - 30 * PX) / 2, 0.013); g.add(lumeStrip);
  }
  // minute: long sword
  {
    const g = at(52, 0.14);
    const L = 262 * PX, w = 11 * PX;
    const sw = new THREE.Shape(); sw.moveTo(-w, 0); sw.lineTo(w, 0); sw.lineTo(w, L - 40 * PX); sw.lineTo(0, L); sw.lineTo(-w, L - 40 * PX); sw.closePath();
    g.add(flat(sw, frame));
    const lumeStrip = new THREE.Mesh(new THREE.BoxGeometry(11 * PX, L - 80 * PX, 0.004), lumeHand); lumeStrip.position.set(0, 40 * PX + (L - 80 * PX) / 2, 0.013); g.add(lumeStrip);
  }
  // GMT: thin red hand with white arrow tip
  {
    const g = at(121, 0.16);
    const L = 258 * PX;
    const rod = new THREE.Mesh(new THREE.BoxGeometry(5 * PX, L - 34 * PX, 0.01), red); rod.position.y = (L - 34 * PX) / 2; g.add(rod);
    const tri = new THREE.Shape(); tri.moveTo(-22 * PX, L - 40 * PX); tri.lineTo(22 * PX, L - 40 * PX); tri.lineTo(0, L); tri.closePath(); g.add(flat(tri, lumeHand, 0.01));
  }
  // seconds: thin steel with lume lollipop and counterweight
  {
    const g = at(222.7, 0.18);
    const L = 264 * PX, back = 72 * PX;
    const rod = new THREE.Mesh(new THREE.BoxGeometry(4 * PX, L + back, 0.008), frame); rod.position.y = (L - back) / 2; g.add(rod);
    const pop = new THREE.Mesh(new THREE.CylinderGeometry(13 * PX, 13 * PX, 0.01, 28), frame); pop.rotation.x = Math.PI / 2; pop.position.y = 150 * PX; g.add(pop);
    const popL = new THREE.Mesh(new THREE.CylinderGeometry(9 * PX, 9 * PX, 0.012, 28), lumeHand); popL.rotation.x = Math.PI / 2; popL.position.set(0, 150 * PX, 0.002); g.add(popL);
    const cw = new THREE.Mesh(new THREE.CylinderGeometry(12 * PX, 12 * PX, 0.01, 28), frame); cw.rotation.x = Math.PI / 2; cw.position.y = -back + 12 * PX; g.add(cw);
  }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(20 * PX, 22 * PX, 0.03, 32), handMat); cap.rotation.x = Math.PI / 2; cap.position.z = 0.19; handsG.add(cap);

  // CRYSTAL
  const crystalG = mk('crystal');
  const crystal = new THREE.Mesh(new THREE.CylinderGeometry(322 * PX, 322 * PX, 0.03, 96), glass); crystal.rotation.x = Math.PI / 2; crystal.position.z = 0.27; crystalG.add(crystal);

  // per-part highlight: clone materials so emissive can be set per group
  const groups: Record<PartKey, THREE.Group[]> = { case: [caseG, bezelG], dial: [dialG], logo: [logoG], hands: [handsG] };
  (Object.keys(groups) as PartKey[]).forEach((k) => groups[k].forEach((g) => g.traverse((o: any) => { if (o.isMesh) { o.material = o.material.clone(); o.userData.part = k; o.userData.baseEm = o.material.emissive?.clone(); } })));

  // final pose + exploded offsets (along the dial normal, one clean move)
  const finalRot = new THREE.Euler(-0.3, 0.36, 0.03);
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
