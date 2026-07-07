import { useState, useEffect, useRef, type ReactNode, type FormEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

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

// ── Form input ───────────────────────────────────────────
export function FormField({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.28em] uppercase mb-3 font-semibold" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </label>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b py-2.5 text-sm outline-none transition-colors duration-200"
        style={{ borderColor: "var(--border)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
    </div>
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
        <p className="text-xs mt-1 leading-snug text-transparent group-hover:text-white/60 transition-colors duration-300">{sub}</p>
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
  c: { contact: { sub: string; info: { label: string; value: string }[]; form: { name: string; company: string; email: string; phone: string; message: string; submit: string; sent: string } } };
  headline: string; num: string; label: string;
}) {
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry — ${form.name}${form.company ? `, ${form.company}` : ""}`);
    const body = encodeURIComponent(`Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nProject Details:\n${form.message}`);
    window.location.href = `mailto:info@make-china.cn?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  return (
    <section id="contacts" className="py-24 lg:py-40" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <Reveal><Mark n={num} label={label} /></Reveal>
        <div className="mt-14 lg:mt-20 grid lg:grid-cols-2 gap-14 lg:gap-28">
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
            {formSent ? (
              <div className="flex flex-col justify-center" style={{ minHeight: "360px" }}>
                <div className="w-8 h-1 mb-7" style={{ backgroundColor: "var(--accent)" }} />
                <p className="text-lg leading-relaxed font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {c.contact.form.sent}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField label={c.contact.form.name} value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} required />
                  <FormField label={c.contact.form.company} value={form.company} onChange={(v) => setForm((p) => ({ ...p, company: v }))} />
                </div>
                <FormField label={c.contact.form.email} type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} required />
                <FormField label={c.contact.form.phone} type="tel" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
                <div>
                  <label className="block text-[10px] tracking-[0.28em] uppercase mb-3 font-bold" style={{ color: "var(--muted-foreground)" }}>
                    {c.contact.form.message}
                  </label>
                  <textarea rows={4} value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full bg-transparent border-b py-2.5 text-sm outline-none transition-colors duration-200 resize-none"
                    style={{ borderColor: "var(--border)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                </div>
                <button type="submit"
                  className="w-full py-4 text-[11px] tracking-[0.2em] uppercase font-bold transition-opacity hover:opacity-75"
                  style={{ backgroundColor: "var(--accent)", color: "white" }}>
                  {c.contact.form.submit}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
