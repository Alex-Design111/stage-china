// Calm, one-section-at-a-time scrolling for the home page (mouse, trackpad, keyboard and touch).
// A burst of wheel ticks (or a long trackpad swipe) moves exactly one section,
// with an eased glide, instead of flying past several sections.
import { useEffect } from "react";

const DURATION = 700;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
let animating = false;

export function animateScrollTo(target: number, duration = DURATION): Promise<void> {
  return new Promise((resolve) => {
    const start = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const end = Math.max(0, Math.min(max, target));
    const dist = end - start;
    if (Math.abs(dist) < 2) { resolve(); return; }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { window.scrollTo(0, end); resolve(); return; }
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    animating = true;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else { animating = false; root.style.scrollBehavior = prevBehavior; resolve(); }
    };
    requestAnimationFrame(step);
  });
}

export function useSectionPaging(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    // the section-per-screen layout needs enough height; very short landscape phones scroll freely
    if (window.innerHeight < 480) return;
    const root = document.documentElement;
    root.classList.add("js-paging");

    let locked = false;      // a glide is running, or its trackpad momentum is still arriving
    let glideDone = true;
    let lastWheel = 0;
    let lastAbs = 0;
    let acc = 0;             // wheel distance gathered toward the next step

    // When the visitor has zoomed in (pinch, smart zoom), scrolling must pan the page normally
    const zoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;

    const sections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("main [data-bg], footer[data-bg]"))
        .filter((el) => el.offsetHeight > 0)
        .map((el) => ({ top: el.getBoundingClientRect().top + window.scrollY, height: el.offsetHeight }))
        // a short band (like a page title) pages together with the section after it
        .reduce<{ top: number; height: number; short: boolean }[]>((acc, sec) => {
          const last = acc[acc.length - 1];
          if (last && last.short) { last.height = sec.top + sec.height - last.top; last.short = false; return acc; }
          acc.push({ ...sec, short: sec.height < window.innerHeight * 0.5 });
          return acc;
        }, []);

    // Row stops inside a section: elements marked data-step; scroll-margin-top adds breathing room
    const stops = (sec: { top: number; height: number }, y: number) => {
      const navH = document.querySelector("nav")?.getBoundingClientRect().height ?? 0;
      return Array.from(document.querySelectorAll<HTMLElement>("[data-step]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          const gap = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          return { top: r.top + y, bottom: r.bottom + y, target: Math.round(r.top + y - navH - gap) };
        })
        .filter((m) => m.top >= sec.top - 1 && m.top < sec.top + sec.height)
        .sort((p, q) => p.target - q.target);
    };

    // Decide where one step in a direction should land; null = let the browser scroll normally
    const targetFor = (dir: 1 | -1): number | null => {
      const list = sections();
      const y = window.scrollY, vh = window.innerHeight;
      const i = list.findIndex((s) => s.top <= y + 2 && s.top + s.height > y + 2);
      if (i < 0) return null;
      const cur = list[i];
      if (dir === 1) {
        const end = cur.top + cur.height - vh;
        // marked rows (data-step): bring the first row that isn't fully on screen up under the menu
        if (end > y + 10) {
          const row = stops(cur, y).find((m) => m.target > y + 10 && m.bottom > y + vh - 1);
          if (row) return Math.min(row.target, end);
        }
        // read the rest of a tall section; a sliver left below the screen isn't worth a stop
        if (end - y > vh * 0.25) {
          const t = Math.min(y + vh * 0.85, end);
          return end - t < vh * 0.25 ? end : t;
        }
        const next = list[i + 1];
        return next ? next.top : null;
      } else {
        if (y - cur.top > vh * 0.25) {
          const back = stops(cur, y).find((m) => m.target < y - 10 && m.target >= y - vh * 0.85);
          if (back) return back.target;
          const t = Math.max(cur.top, y - vh * 0.85);
          return t - cur.top < vh * 0.25 ? cur.top : t;
        }
        const prev = list[i - 1];
        return prev ? Math.max(prev.top, prev.top + prev.height - vh) : 0;
      }
    };

    // A section marked data-free (the cases grid) scrolls normally once its top reaches the menu;
    // paging only brings you to it and takes over again after its last row.
    const inFree = (dir: 1 | -1) => {
      const el = document.querySelector<HTMLElement>("[data-free]");
      if (!el) return false;
      const y = window.scrollY, vh = window.innerHeight;
      const navH = document.querySelector("nav")?.getBoundingClientRect().height ?? 0;
      const r = el.getBoundingClientRect();
      const start = r.top + y - navH, end = r.bottom + y - vh;
      return dir === 1 ? y >= start - 2 && y < end - 2 : y > start + 2 && y <= end + 2;
    };

    const go = (dir: 1 | -1) => {
      const t = targetFor(dir);
      if (t === null) return false;
      locked = true; glideDone = false; acc = 0;
      animateScrollTo(t).then(() => {
        glideDone = true;
        // if the wheel is already quiet, unlock right away
        if (performance.now() - lastWheel > 90) locked = false;
      });
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || zoomed()) return; // pinch-zoom gesture, or the page is zoomed in
      if (document.body.style.overflow === "hidden") return; // a modal is open
      if (!locked && !animating && e.deltaY !== 0 && inFree(e.deltaY > 0 ? 1 : -1)) { acc = 0; return; } // normal scrolling here
      e.preventDefault();
      const now = performance.now();
      const dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      const abs = Math.abs(dy);
      const gap = now - lastWheel;
      // After a glide, momentum events fade out; a pause or a fresh, stronger push is a new gesture
      if (locked && glideDone && (gap > 90 || (abs > lastAbs * 1.4 && abs > 8))) locked = false;
      lastWheel = now; lastAbs = abs;
      if (locked || animating) return;
      if (gap > 200 || Math.sign(dy) !== Math.sign(acc)) acc = 0;
      acc += dy;
      if (Math.abs(acc) < 25) return;   // a light touch is enough, tiny jitters are ignored
      const dir = acc > 0 ? 1 : -1;
      if (!go(dir)) { window.scrollBy(0, acc); acc = 0; }
    };

    // Touch: one swipe = one section. The finger drag is replaced by an eased glide,
    // taps and pinch-zoom are left alone, and nothing happens while a modal is open.
    let ty = 0, tx = 0, tt = 0, tracking = false;
    const modalOpen = () => document.body.style.overflow === "hidden" || zoomed();
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || modalOpen()) { tracking = false; return; }
      tracking = true; ty = e.touches[0].clientY; tx = e.touches[0].clientX; tt = performance.now();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || e.touches.length !== 1 || modalOpen()) return;
      const raw = ty - e.touches[0].clientY;
      const dy = Math.abs(raw), dx = Math.abs(e.touches[0].clientX - tx);
      if (raw !== 0 && !animating && inFree(raw > 0 ? 1 : -1)) { tracking = false; return; } // normal scrolling here
      if (dy >= dx && e.cancelable) e.preventDefault(); // vertical drags are ours
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0]; if (!t) return;
      const dy = ty - t.clientY, dx = tx - t.clientX;
      const fast = Math.abs(dy) / Math.max(1, performance.now() - tt) > 0.3;
      if (Math.abs(dy) < Math.abs(dx) || (Math.abs(dy) < 40 && !(fast && Math.abs(dy) > 15))) return;
      if (animating) return;
      const dir = dy > 0 ? 1 : -1;
      if (!go(dir)) window.scrollBy({ top: dy * 2, behavior: "smooth" });
    };

    // keep the screen on a section after rotation / address-bar resizes
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        if (animating || zoomed()) return;
        const list = sections(); const y = window.scrollY;
        const near = list.reduce((a, s) => (Math.abs(s.top - y) < Math.abs(a.top - y) ? s : a), list[0]);
        if (near && Math.abs(near.top - y) < window.innerHeight * 0.5 && near.height <= window.innerHeight + 4) window.scrollTo(0, near.top);
      }, 250);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement)?.isContentEditable) return;
      if (document.body.style.overflow === "hidden" || zoomed()) return;
      const down = ["PageDown", "ArrowDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
      const up = ["PageUp", "ArrowUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      if (!locked && !animating && inFree(down ? 1 : -1)) return; // normal scrolling here
      e.preventDefault();
      if (locked || animating) return;
      go(down ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(rt);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      root.classList.remove("js-paging");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled]);
}
