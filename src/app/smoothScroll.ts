// Calm, one-section-at-a-time scrolling for the home page on desktop.
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
    const wide = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || reduce.matches) return;
    const root = document.documentElement;
    root.classList.add("js-paging");

    let locked = false;      // a glide is running, or its trackpad momentum is still arriving
    let glideDone = true;
    let lastWheel = 0;
    let lastAbs = 0;
    let acc = 0;             // wheel distance gathered toward the next step

    const sections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("main [data-bg], footer[data-bg]"))
        .filter((el) => el.offsetHeight > 0)
        .map((el) => ({ top: el.getBoundingClientRect().top + window.scrollY, height: el.offsetHeight }));

    // Decide where one step in a direction should land; null = let the browser scroll normally
    const targetFor = (dir: 1 | -1): number | null => {
      const list = sections();
      const y = window.scrollY, vh = window.innerHeight;
      const i = list.findIndex((s) => s.top <= y + 2 && s.top + s.height > y + 2);
      if (i < 0) return null;
      const cur = list[i];
      if (dir === 1) {
        if (cur.top + cur.height > y + vh + 2) return Math.min(y + vh * 0.85, cur.top + cur.height - vh); // read the rest of a tall section
        const next = list[i + 1];
        return next ? next.top : null;
      } else {
        if (cur.top < y - 2) return Math.max(cur.top, y - vh * 0.85);
        const prev = list[i - 1];
        return prev ? Math.max(prev.top, prev.top + prev.height - vh) : 0;
      }
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
      if (e.ctrlKey) return; // pinch-zoom
      if (document.body.style.overflow === "hidden") return; // a modal is open
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

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement)?.isContentEditable) return;
      if (document.body.style.overflow === "hidden") return;
      const down = ["PageDown", "ArrowDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
      const up = ["PageUp", "ArrowUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      e.preventDefault();
      if (locked || animating) return;
      go(down ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("js-paging");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled]);
}
