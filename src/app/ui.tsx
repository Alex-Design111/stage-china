import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { IMGS } from "./images";

export const serif = "'Montserrat', sans-serif";

// ── IntersectionObserver hook ────────────────────────────
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Section label ────────────────────────────────────────
export function Mark({ n, label, light = false }: { n: string; label: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span style={{
        fontFamily: serif, fontWeight: 800, fontSize: "0.6rem",
        letterSpacing: "0.18em", color: "var(--accent)",
      }}>{n}</span>
      <div style={{ width: "24px", height: "2px", backgroundColor: "var(--accent)", opacity: light ? 0.5 : 1 }} />
      <span style={{
        fontFamily: serif, fontWeight: 700, fontSize: "0.6rem",
        letterSpacing: "0.22em", textTransform: "uppercase" as const,
        color: light ? "rgba(255,255,255,0.4)" : "var(--muted-foreground)",
      }}>{label}</span>
    </div>
  );
}

// ── Scroll-triggered fade-in ─────────────────────────────
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Underline CTA button ─────────────────────────────────
export function UnderlineBtn({ onClick, children, light = false, className = "" }: {
  onClick?: () => void; children: ReactNode; light?: boolean; className?: string;
}) {
  const base = light ? "rgba(255,255,255,0.22)" : "rgba(12,11,9,0.22)";
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-bold pb-0.5 border-b transition-all duration-200 hover:gap-5 ${className}`}
      style={{ borderColor: base, color: light ? "white" : "var(--foreground)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = base)}>
      {children}
      <ArrowRight size={11} />
    </button>
  );
}

// ── Portfolio card ───────────────────────────────────────
export function PortfolioCard({ title, sub, tag, src, onClick }: {
  title: string; sub: string; tag: string; src: string; onClick?: () => void;
}) {
  return (
    <div className="group relative overflow-hidden bg-zinc-300 cursor-pointer" style={{ aspectRatio: "4/3" }} onClick={onClick}>
      <img src={src} alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      {/* Tag badge */}
      <div className="absolute top-4 left-4">
        <span className="text-[9px] tracking-[0.28em] uppercase font-bold px-2.5 py-1"
          style={{ backgroundColor: "var(--accent)", color: "white" }}>{tag}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h4 className="text-white text-sm font-bold leading-snug">{title}</h4>
        <p className="text-xs mt-1 leading-snug text-white/60 transition-colors duration-300">{sub}</p>
      </div>
      {/* Click hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <ArrowRight size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// ── Portfolio lightbox modal ─────────────────────────────
export function PortfolioModal({ items, images, initialIndex, onClose }: {
  items: { title: string; sub: string; tag: string }[];
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const total = items.length;
  const item = items[idx];
  const src = images[idx].replace("w=800&h=600", "w=1400&h=900");

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
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 lg:p-8"
      style={{ backgroundColor: "rgba(0,0,0,0.96)" }}
      onClick={onClose}>
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[11px] tracking-widest uppercase font-bold">
          Close <X size={16} />
        </button>

        {/* Counter */}
        <div className="absolute -top-10 left-0 text-[11px] tracking-widest uppercase font-bold"
          style={{ color: "var(--accent)" }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {/* Image */}
        <div className="relative overflow-hidden bg-zinc-900" style={{ aspectRatio: "16/9" }}>
          <img src={src} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <span className="inline-block text-[9px] tracking-[0.28em] uppercase font-bold px-2.5 py-1 mb-3"
              style={{ backgroundColor: "var(--accent)", color: "white" }}>{item.tag}</span>
            <h3 className="text-white font-bold text-xl lg:text-3xl leading-tight"
              style={{ fontFamily: serif, letterSpacing: "-0.02em" }}>{item.title}</h3>
            <p className="text-white/55 text-sm mt-1">{item.sub}</p>
          </div>

          {/* Side arrows */}
          <button onClick={() => setIdx((i) => (i - 1 + total) % total)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 transition-colors text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % total)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 transition-colors text-white">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="transition-all duration-200"
              style={{
                width: i === idx ? "24px" : "8px", height: "4px",
                backgroundColor: i === idx ? "var(--accent)" : "rgba(255,255,255,0.25)",
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Contact section ──────────────────────────────────────
export function ContactSection({ c, headline, num, label }: {
  c: { contact: { sub: string; info: { label: string; value: string }[]; form: { submit: string } } };
  headline: string; num: string; label: string;
}) {
  const mailto = "mailto:info@make-china.cn?subject=" + encodeURIComponent("Project Inquiry");

  return (
    <section id="contacts" className="py-24 lg:py-40" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <Reveal><Mark n={num} label={label} /></Reveal>
        <div className="mt-14 lg:mt-20 grid lg:grid-cols-2 gap-14 lg:gap-28 items-start">
          <Reveal>
            <h2 className="whitespace-pre-line leading-[1.05] mb-8"
              style={{ fontFamily: serif, fontWeight: 800, fontSize: "clamp(2rem,4vw,3.5rem)", letterSpacing: "-0.02em" }}>
              {headline}
            </h2>
            <p className="leading-relaxed mb-12 text-[15px]" style={{ color: "var(--muted-foreground)" }}>
              {c.contact.sub}
            </p>
            <div className="space-y-5">
              {c.contact.info.map((item, i) => (
                <div key={i} className="flex items-baseline gap-5">
                  <span className="text-[10px] tracking-[0.28em] uppercase shrink-0 w-28 font-bold" style={{ color: "var(--muted-foreground)" }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={130}>
            <div className="relative overflow-hidden bg-zinc-200 mb-5">
              <img src={IMGS.contact} alt="Corporate business event production in China — MAKE"
                className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                style={{ aspectRatio: "16/10" }} loading="lazy" />
            </div>
            <a href={mailto}
              className="group flex items-center justify-center gap-4 w-full py-6 text-[13px] lg:text-[14px] tracking-[0.2em] uppercase font-bold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--accent)", color: "white" }}>
              {c.contact.form.submit}
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
