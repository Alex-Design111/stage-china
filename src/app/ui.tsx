import { useState, useEffect, useLayoutEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { ContentType, CaseItem } from "./content";

// ── Placeholder sections ─────────────────────────────────
// Content marked ready: false in content.ts shows with an orange outline in
// `npm run dev` and is left out of the production build entirely.
// Placeholders show only in `npm run dev` AND when the URL ends with ?placeholders
export const IS_DEV = import.meta.env.DEV && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("placeholders");

export function Placeholder({ ready, label, children, compact = false }: {
  ready: boolean; label: string; children: ReactNode; compact?: boolean;
}) {
  if (ready) return <>{children}</>;
  if (!IS_DEV) return null;
  return (
    <div className="relative" style={{ outline: "2px dashed var(--signal)", outlineOffset: compact ? "4px" : "-8px" }}>
      <div className={`absolute z-20 bg-[color:var(--signal)] text-black font-bold ${compact ? "-top-7 left-0 text-[11px] px-1.5 py-0.5" : "top-4 right-4 text-[12px] px-2.5 py-1.5 max-w-[280px]"}`}>
        Placeholder: {label}{compact ? "" : ". Hidden on the live site until filled in."}
      </div>
      {children}
    </div>
  );
}

// ── Looping background video ─────────────────────────────
// Poster paints instantly; the video source is attached after first paint,
// plays muted + looped, and stays on the poster if it can't load or the
// visitor prefers reduced motion.
export function VideoBg({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      if (v.getAttribute("src")) return;
      v.setAttribute("src", src);
      v.load();
      const play = () => v.play().catch(() => {});
      if (v.readyState >= 2) play();
      else v.addEventListener("canplay", play, { once: true });
    }, 180);
    return () => window.clearTimeout(id);
  }, [src]);

  return (
    <>
      <img src={poster} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <video ref={ref} poster={poster} muted loop playsInline autoPlay preload="none"
        aria-hidden="true" onCanPlay={() => setReady(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }} />
    </>
  );
}

// ── Text scaled to exactly fill its container's width ───
export function FitText({ text, className = "", style }: { text: string; className?: string; style?: CSSProperties }) {
  const wrap = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);
  useLayoutEffect(() => {
    const fit = () => {
      const w = wrap.current, s = span.current;
      if (!w || !s) return;
      // Scale from the current size, so repeated calls settle instead of looping
      const current = parseFloat(getComputedStyle(s).fontSize) || 100;
      const tw = s.getBoundingClientRect().width;
      if (tw > 0) {
        const next = (current * w.clientWidth) / tw;
        setSize((prev) => (prev && Math.abs(prev - next) < 0.2 ? prev : next));
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (wrap.current) ro.observe(wrap.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text]);
  return (
    <div ref={wrap} className={className} style={style}>
      <span ref={span} className="inline-block whitespace-nowrap"
        style={{ fontSize: size ? `${size}px` : "100px", letterSpacing: "-0.012em", visibility: size ? "visible" : "hidden" }}>
        {text}
      </span>
    </div>
  );
}

// ── Section heading ──────────────────────────────────────
export function SectionHeading({ children, light = false, className = "" }: {
  children: ReactNode; light?: boolean; className?: string;
}) {
  return (
    <h2 className={`display ${className}`}
      style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.25rem)", color: light ? "#fff" : "#000" }}>
      {children}
    </h2>
  );
}

// ── Case card ────────────────────────────────────────────
export function CaseCard({ title, sub, tag, src, video, onClick, large = false }: {
  title: string; sub: string; tag: string; src: string; video?: string | null; onClick?: () => void; large?: boolean;
}) {
  const vid = useRef<HTMLVideoElement>(null);
  const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches
    && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const start = () => { if (canHover && vid.current) { vid.current.currentTime = 0; vid.current.play().catch(() => {}); } };
  const stop = () => { vid.current?.pause(); };
  return (
    <button type="button" onClick={onClick} onMouseEnter={video ? start : undefined} onMouseLeave={video ? stop : undefined}
      className={`group relative block w-full h-full overflow-hidden bg-zinc-800 text-left cut-md ${large ? "min-h-[360px]" : "min-h-[260px]"} lg:min-h-0`}
      aria-label={`${title}, ${sub}. Open gallery`}>
      <img src={src} alt="" loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
      {video && canHover && (
        <video ref={vid} src={video} muted loop playsInline preload="none" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 100%)" }} />
      <span className="absolute top-4 left-4 bg-white text-black text-[12px] font-bold px-2.5 py-1">{tag}</span>
      {video && (
        <span className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/55 text-white text-[12px] font-bold px-2.5 py-1">
          <Play size={11} fill="currentColor" /> Video
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-7 pb-8 lg:pb-9 pl-7 lg:pl-8">
        <h3 className="text-white font-bold leading-[1.02]"
          style={{ fontSize: large ? "clamp(1.8rem,3vw,2.8rem)" : "1.45rem", letterSpacing: "-0.008em" }}>
          {title}
        </h3>
        <p className="text-white/70 text-[14px] mt-2">{sub}</p>
      </div>
      <span className="absolute bottom-0 left-[76px] right-0 h-[4px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden="true" />
    </button>
  );
}

// ── Gallery lightbox ─────────────────────────────────────
export function ImageGallery({ images, video, poster, title, subtitle, tag, story, onClose }: {
  images: string[]; video?: string | null; poster?: string; title: string; subtitle?: string; tag?: string; story?: CaseItem["story"]; onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  // The project reel (if any) is the first slide, followed by the photos
  const media: { kind: "video" | "photo"; src: string }[] = [
    ...(video ? [{ kind: "video" as const, src: video }] : []),
    ...images.map((src) => ({ kind: "photo" as const, src })),
  ];
  const total = media.length;
  const cur = media[idx];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [total, onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex justify-center p-4 lg:p-10 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.95)" }} onClick={onClose}
      role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full max-w-6xl my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-end justify-between gap-6 mb-4 text-white">
          <div>
            {tag && <span className="inline-block bg-white text-black text-[12px] font-bold px-2.5 py-1 mb-3">{tag}</span>}
            <h3 className="font-bold leading-none" style={{ fontSize: "clamp(1.5rem,3vw,2.4rem)", letterSpacing: "-0.008em" }}>{title}</h3>
            {subtitle && <p className="text-white/60 text-sm mt-2">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <span className="text-sm font-bold tabular-nums text-white/70">{idx + 1} / {total}</span>
            <button onClick={onClose} className="w-11 h-11 flex items-center justify-center bg-white text-black hover:bg-[color:var(--signal)] transition-colors" aria-label="Close gallery">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden bg-zinc-900 cut-lg" style={{ aspectRatio: "16/9", maxHeight: "68vh", width: "100%" }}>
          {cur.kind === "video"
            ? <video key={cur.src} src={cur.src} poster={poster} controls autoPlay playsInline className="w-full h-full object-cover bg-black" />
            : <img key={cur.src} src={cur.src} alt={`${title}, photo ${idx + (video ? 0 : 1)} of ${images.length}`} className="w-full h-full object-cover" />}
          {total > 1 && (
            <>
              <button onClick={() => setIdx((i) => (i - 1 + total) % total)} aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-16 flex items-center justify-center bg-black/60 hover:bg-black text-white transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => setIdx((i) => (i + 1) % total)} aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-16 flex items-center justify-center bg-black/60 hover:bg-black text-white transition-colors">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
        {total > 1 && (
          <div className="flex gap-2 mt-4">
            {media.map((m, i) => (
              <button key={m.src} onClick={() => setIdx(i)} aria-label={m.kind === "video" ? "Video" : `Photo ${i + (video ? 0 : 1)}`}
                className="h-1 transition-all duration-200"
                style={{ width: i === idx ? "48px" : "20px", background: i === idx ? "var(--brand-gradient)" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        )}
        {story ? <CaseStory story={story} /> : IS_DEV && (
          <Placeholder ready={false} label="case story (add story to this case in content.ts)">
            <CaseStory story={{ brief: "What the client asked for.", idea: "What we proposed and why.", result: "What happened on the day, with numbers.", guests: "000" }} />
          </Placeholder>
        )}
      </div>
    </div>
  );
}

function CaseStory({ story }: { story: NonNullable<CaseItem["story"]> }) {
  const parts = [["The brief", story.brief], ["Our idea", story.idea], ["The result", story.result]] as const;
  return (
    <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mt-8 pt-6 border-t border-white/20 text-white">
      {parts.map(([label, text]) => (
        <div key={label}>
          <h4 className="text-[14px] font-bold mb-2" style={{ color: "var(--signal)" }}>{label}</h4>
          <p className="text-[15px] leading-relaxed text-white/80">{text}</p>
        </div>
      ))}
      {story.guests && <p className="sm:col-span-3 text-[15px] font-bold">{story.guests} guests</p>}
    </div>
  );
}

// ── Ending section: CTA, big email button, photo ─────────
export function EndingSection({ c, dark = false }: { c: ContentType; dark?: boolean }) {
  const e = c.ending;
  return (
    <section id="contact" data-bg={dark ? "dark" : "light"} className={`slide slide-anim px-6 lg:px-20 !pb-6 ${dark ? "bg-black" : "bg-white"}`} aria-labelledby="contact-heading">
      <div className="max-w-[1360px] mx-auto bg-brand cut-lg grid lg:grid-cols-[1fr_1fr] overflow-hidden">
        <div className="text-black px-6 sm:px-10 lg:px-14 pt-10 lg:pt-14 pb-16 lg:pb-24 flex flex-col">
          <h2 id="contact-heading" className="display whitespace-pre-line" style={{ fontSize: "clamp(3rem, 5.6vw, 6rem)" }}>
            {e.headline}
          </h2>
          <p className="mt-6 text-[18px] lg:text-[20px] leading-snug max-w-[34ch] font-medium">{e.sub}</p>
          <a href={e.mailto}
            className="group mt-8 lg:mt-10 self-start max-w-full inline-flex flex-col gap-1 bg-black text-white pl-9 pr-8 py-5 lg:pl-11 lg:pr-12 lg:py-6 cut-sm transition-transform duration-150 active:scale-[0.98] hover:bg-[#1a1a1a]">
            <span className="text-[14px] font-bold" style={{ color: "var(--signal)" }}>{e.ctaLabel}</span>
            <span className="font-bold leading-tight [overflow-wrap:anywhere]" style={{ fontSize: "clamp(1rem, 1.55vw, 1.6rem)" }}>{e.cta}</span>
          </a>
        </div>
        <div className="relative min-h-[300px] lg:min-h-0">
          <img src={e.photo} alt={e.photoAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
