import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

// ── smooth scroll driven by the GSAP ticker ──
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as any).__lenis = lenis;
}

// only refresh if fonts actually changed the page height
const h0 = document.body.scrollHeight;
document.fonts?.ready.then(() => { if (Math.abs(document.body.scrollHeight - h0) > 2) ScrollTrigger.refresh(); });

// ── reveals (transform + opacity only, ~92% down the screen) ──
const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
if (reduce || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target as HTMLElement;
        const d = Number(el.dataset.delay || 0);
        if (d) el.style.transitionDelay = d + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  revealEls.forEach((el) => io.observe(el));
  // fallback sweep: anything above the viewport bottom is shown, so fast scrolling never leaves gaps
  let raf = 0;
  const sweep = () => {
    raf = 0;
    const vh = window.innerHeight;
    revealEls.forEach((el) => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < vh) el.classList.add('is-in'); });
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(sweep); }, { passive: true });
  setTimeout(sweep, 1500);
}

// ── header: hide on scroll down, show on scroll up ──
const hdr = document.querySelector<HTMLElement>('[data-hdr]');
if (hdr) {
  let last = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      hdr.classList.toggle('is-hidden', y > 240 && y > last + 4);
      if (y < last - 4 || y < 240) hdr.classList.remove('is-hidden');
      last = y;
      ticking = false;
    });
  }, { passive: true });
}

// ── mobile menu ──
const mnav = document.querySelector<HTMLElement>('[data-mnav]');
const burger = document.querySelector<HTMLButtonElement>('[data-burger]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-burger-close]');
const setMenu = (open: boolean) => {
  if (!mnav || !burger) return;
  mnav.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  open ? lenis?.stop() : lenis?.start();
  if (open) closeBtn?.focus(); else burger.focus();
};
burger?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav && !mnav.hidden) setMenu(false); });

// ── subtle cursor (fine pointers only) ──
const cursor = document.querySelector<HTMLElement>('[data-cursor]');
if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
  const ring = cursor.querySelector<HTMLElement>('.cursor__ring')!;
  const dot = cursor.querySelector<HTMLElement>('.cursor__dot')!;
  let x = 0, y = 0, rx = 0, ry = 0, shown = false;
  window.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; cursor.classList.remove('is-hidden'); }
    const t = e.target as HTMLElement;
    cursor.classList.toggle('is-link', !!t.closest('a, button, [role="button"], input, select, textarea, label'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => { shown = false; cursor.classList.add('is-hidden'); });
  gsap.ticker.add(() => {
    rx += (x - rx) * 0.22; ry += (y - ry) * 0.22;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  });
}

// ── page transitions: ≤0.35s out, navigate as soon as covered; 0.4s in ──
const curtain = document.querySelector<HTMLElement>('[data-curtain]');
if (curtain && !reduce) {
  if (root.classList.contains('tx-in')) {
    requestAnimationFrame(() => {
      curtain.classList.add('is-in');
      root.classList.remove('tx-in');
      setTimeout(() => curtain.classList.remove('is-in'), 450);
    });
  }
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash) || url.protocol !== location.protocol) return;
    if (url.pathname === location.pathname && !url.hash && url.search === location.search) return;
    e.preventDefault();
    curtain.classList.add('is-out');
    sessionStorageSet('hv-tx', '1');
    setTimeout(() => { location.href = url.href; }, 300);
  });
  window.addEventListener('pageshow', (e) => { if ((e as PageTransitionEvent).persisted) curtain.classList.remove('is-out'); });
}
function sessionStorageGet(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } }
function sessionStorageSet(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } }

// in-page anchor links through Lenis
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!.slice(1);
    const el = id && document.getElementById(id);
    if (el && lenis) { e.preventDefault(); lenis.scrollTo(el, { offset: -80 }); }
  });
});

root.classList.add('is-ready');
