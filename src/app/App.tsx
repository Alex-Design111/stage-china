import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { C, type Lang, type Page } from "./content";
import { IMGS } from "./images";
import { serif, Mark, Reveal, UnderlineBtn, PortfolioCard, PortfolioModal, ContactSection } from "./ui";
import { NavBar } from "./NavBar";
import { SubPage } from "./SubPage";

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function getInitialPage(): Page {
  const p = window.location.pathname;
  if (p.includes("expo-design")) return "expo";
  if (p.includes("event-design")) return "events";
  if (p.includes("portfolio")) return "portfolio";
  return "home";
}

const SEO: Record<Lang, Record<Page, { title: string; description: string; path: string }>> = {
  en: {
    home:      { title: "MAKE by New Imagination | Exhibition Booth Design & Event Production in China", description: "Full-service exhibition booth design, construction and corporate event production in China.", path: "/" },
    expo:      { title: "Expo Design & Construction | MAKE by New Imagination China", description: "Custom exhibition stand design and turnkey booth construction in China.", path: "/expo-design-construction" },
    events:    { title: "Event Design & Production | MAKE by New Imagination China", description: "Corporate conferences, product launches and brand activations in China.", path: "/event-design-production" },
    portfolio: { title: "Portfolio | MAKE by New Imagination China", description: "Exhibition booths and corporate events delivered across China.", path: "/portfolio" },
  },
  ru: {
    home:      { title: "MAKE by New Imagination | Стенды и мероприятия в Китае", description: "Полноцикловая компания по застройке стендов и организации мероприятий в Китае.", path: "/" },
    expo:      { title: "Стенды и застройка | MAKE by New Imagination Китай", description: "Проектирование и застройка стендов в Китае под ключ.", path: "/expo-design-construction" },
    events:    { title: "Мероприятия и продакшн | MAKE by New Imagination Китай", description: "Конференции, запуски продуктов и активации в Китае.", path: "/event-design-production" },
    portfolio: { title: "Портфолио | MAKE by New Imagination Китай", description: "Выставочные стенды и мероприятия по всему Китаю.", path: "/portfolio" },
  },
};

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function useSEO(page: Page, lang: Lang) {
  useEffect(() => {
    const m = SEO[lang][page];
    document.title = m.title;
    document.documentElement.lang = lang;
    setMeta("name", "description", m.description);
    setMeta("name", "robots", "index, follow");
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:type", "website");
    try {
      if (window.location.pathname !== m.path) history.pushState({ page, lang }, m.title, m.path);
    } catch (_) {}
  }, [page, lang]);
}

// ── Tag helpers for filter ───────────────────────────────
const isBooth = (tag: string) => tag === "Booth" || tag === "Стенд";
const isEvent = (tag: string) => tag === "Event" || tag === "Мероприятие";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [page, setPage] = useState<Page>(getInitialPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "booth" | "event">("all");
  const scrolled = useScrolled();
  const c = C[lang];

  useSEO(page, lang);

  useEffect(() => {
    const onPop = () => setPage(getInitialPage());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const goPage = (p: Page) => { setPage(p); window.scrollTo({ top: 0 }); setMenuOpen(false); setFilter("all"); };

  const goto = (id: string) => {
    if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const filteredItems = c.portfolio.items.filter((item) =>
    filter === "all" || (filter === "booth" && isBooth(item.tag)) || (filter === "event" && isEvent(item.tag))
  );
  const filteredIndices = c.portfolio.items.reduce<number[]>((acc, item, i) => {
    if (filter === "all" || (filter === "booth" && isBooth(item.tag)) || (filter === "event" && isEvent(item.tag))) acc.push(i);
    return acc;
  }, []);

  const h1 = { fontFamily: serif, fontWeight: 800, letterSpacing: "-0.03em" } as const;
  const h2 = { fontFamily: serif, fontWeight: 700, letterSpacing: "-0.02em" } as const;
  const h3 = { fontFamily: serif, fontWeight: 700, letterSpacing: "-0.02em" } as const;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", backgroundColor: "var(--background)", color: "var(--foreground)" }}>

      <NavBar c={c} lang={lang} setLang={setLang} scrolled={scrolled}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen} page={page} goto={goto} goPage={goPage} />

      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:text-xs"
        style={{ backgroundColor: "var(--accent)", color: "white" }}>Skip to content</a>

      {/* Modal overlay */}
      {modalIndex !== null && (
        <PortfolioModal
          items={c.portfolio.items}
          images={IMGS.portfolio}
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}

      {/* Sub-pages */}
      {page === "expo"   && <main id="main-content"><SubPage c={c} pageKey="expoPage"   goPage={goPage} /></main>}
      {page === "events" && <main id="main-content"><SubPage c={c} pageKey="eventsPage" goPage={goPage} /></main>}

      {/* Portfolio page */}
      {page === "portfolio" && (
        <main id="main-content">
          <div className="pt-36 pb-6 px-6 lg:px-12 max-w-[1440px] mx-auto">
            <Reveal>
              <button onClick={() => goPage("home")}
                className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold mb-10 transition-opacity hover:opacity-60"
                style={{ color: "var(--muted-foreground)" }}>
                ← {c.expoPage.back.includes("Home") ? "Home" : "Главная"}
              </button>
              <h1 style={{ ...h1, fontSize: "clamp(2.8rem,6vw,5.5rem)" }} className="mb-4">{c.portfolioPage.headline}</h1>
              <p className="text-[15px] mb-10" style={{ color: "var(--muted-foreground)" }}>{c.portfolioPage.sub}</p>
              {/* Filter buttons */}
              <div className="flex gap-2 flex-wrap mb-14">
                {(["all", "booth", "event"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-5 py-2 text-[11px] tracking-widest uppercase font-bold transition-all"
                    style={{
                      backgroundColor: filter === f ? "var(--accent)" : "transparent",
                      color: filter === f ? "white" : "var(--muted-foreground)",
                      border: `2px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
                    }}>
                    {f === "all" ? c.portfolioPage.filters.all : f === "booth" ? c.portfolioPage.filters.booth : c.portfolioPage.filters.event}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="px-6 lg:px-12 max-w-[1440px] mx-auto pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, fi) => (
                <Reveal key={filteredIndices[fi]} delay={fi * 50}>
                  <PortfolioCard {...item} src={IMGS.portfolio[filteredIndices[fi]]}
                    onClick={() => setModalIndex(filteredIndices[fi])} />
                </Reveal>
              ))}
            </div>
          </div>
          <ContactSection c={c} headline={c.contact.headline} num={c.contact.num} label={c.contact.label} />
        </main>
      )}

      {/* Home page */}
      {page === "home" && (
        <main id="main-content">

          {/* ── HERO ─────────────────────────────────────── */}
          <section id="home" className="relative flex flex-col justify-end" style={{ height: "100svh", minHeight: "580px" }}>
            <div className="absolute inset-0 overflow-hidden bg-zinc-900">
              <img src={IMGS.hero} alt="Grand exhibition hall — MAKE by New Imagination DMC China"
                className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)" }} />
            </div>
            {/* Orange accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "var(--accent)" }} />
            <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-12 pb-16 lg:pb-28">
              <p className="text-[10px] tracking-[0.4em] uppercase font-bold mb-6" style={{ color: "var(--accent)" }}>
                {c.hero.eyebrow}
              </p>
              <h1 className="text-white whitespace-pre-line mb-8"
                style={{ ...h1, fontSize: "clamp(2.8rem,8vw,7.5rem)", lineHeight: 0.97 }}>
                {c.hero.headline}
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-10">
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.58)" }}>{c.hero.sub}</p>
                <button onClick={() => goto("contacts")}
                  className="shrink-0 inline-flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-bold transition-colors duration-300"
                  style={{ backgroundColor: "var(--accent)", color: "white" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "var(--foreground)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--accent)"; e.currentTarget.style.color = "white"; }}>
                  {c.hero.cta} <ArrowRight size={13} />
                </button>
              </div>
            </div>
            <div className="absolute right-6 lg:right-12 bottom-8 flex flex-col items-center gap-3 select-none">
              <span className="text-[9px] tracking-[0.35em] uppercase font-bold" style={{ writingMode: "vertical-rl", color: "rgba(255,255,255,0.3)" }}>{c.hero.scroll}</span>
              <div className="w-px h-10" style={{ backgroundColor: "var(--accent)", opacity: 0.7 }} />
            </div>
          </section>

          {/* ── ABOUT ────────────────────────────────────── */}
          <section id="about" className="py-24 lg:py-40 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-14">
              <Reveal><Mark n={c.about.num} label={c.about.label} /></Reveal>
            </div>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-[48fr_52fr] gap-12 lg:gap-16 items-start">
              <Reveal className="flex flex-col lg:pr-4">
                <h2 className="whitespace-pre-line mb-8 leading-[1.05]"
                  style={{ ...h2, fontSize: "clamp(2rem,4vw,3.6rem)" }}>
                  {c.about.headline}
                </h2>
                <p className="leading-relaxed mb-4 text-[15px]" style={{ color: "var(--muted-foreground)" }}>{c.about.body1}</p>
                <p className="leading-relaxed mb-4 text-[15px]" style={{ color: "var(--muted-foreground)" }}>{c.about.body2}</p>
                <p className="leading-relaxed mb-12 text-[15px]" style={{ color: "var(--muted-foreground)" }}>{c.about.body3}</p>
                <UnderlineBtn onClick={() => goto("contacts")}>{c.about.cta}</UnderlineBtn>
              </Reveal>
              <Reveal delay={160} className="relative overflow-hidden bg-zinc-200">
                <img src={IMGS.about} alt="Exhibition design — MAKE China"
                  className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  style={{ aspectRatio: "3/4" }} loading="lazy" />
              </Reveal>
            </div>
          </section>

          {/* ── SERVICES ─────────────────────────────────── */}
          <section className="overflow-hidden">
            <div id="booths" className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <Reveal><div className="pt-2"><Mark n={c.services.num} label={c.services.label} /></div></Reveal>
            </div>
            {c.services.items.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={item.page} id={i === 1 ? "events" : undefined}
                  className="flex flex-col lg:flex-row mt-10" style={{ minHeight: "560px" }}>
                  <div className={`relative overflow-hidden bg-zinc-800 ${isEven ? "lg:order-1" : "lg:order-2"}`} style={{ flex: "0 0 58%" }}>
                    <img src={IMGS.svc[i]} alt={item.title.replace("\n", " ")}
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.025]"
                      loading="lazy" style={{ opacity: 0.82, minHeight: "340px", maxHeight: "720px" }} />
                  </div>
                  <div className={`flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                    style={{ flex: "0 0 42%", backgroundColor: isEven ? "var(--foreground)" : "var(--secondary)", color: isEven ? "var(--background)" : "var(--foreground)" }}>
                    <Reveal>
                      <span className="text-[10px] tracking-[0.32em] uppercase font-bold block mb-7"
                        style={{ color: isEven ? "rgba(248,247,243,0.4)" : "var(--muted-foreground)" }}>{item.eyebrow}</span>
                      <h3 className="whitespace-pre-line leading-[1.05] mb-8" style={{ ...h3, fontSize: "clamp(1.75rem,3vw,3rem)" }}>
                        {item.title}
                      </h3>
                      <p className="leading-relaxed mb-10 text-[15px]"
                        style={{ color: isEven ? "rgba(248,247,243,0.6)" : "var(--muted-foreground)" }}>{item.body}</p>
                      <UnderlineBtn onClick={() => goPage(item.page)} light={isEven}>{item.cta}</UnderlineBtn>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── ADVANTAGES ───────────────────────────────── */}
          <section className="py-20 lg:py-32" style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <Reveal>
                <div className="flex items-center gap-3 mb-4" style={{ color: "rgba(248,247,243,0.28)" }}>
                  <span style={{ fontFamily: serif, fontWeight: 800, fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--accent)" }}>{c.advantages.num}</span>
                  <div style={{ width: "24px", height: "2px", backgroundColor: "var(--accent)", opacity: 0.5 }} />
                  <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(248,247,243,0.35)" }}>{c.advantages.label}</span>
                </div>
                <h2 className="mb-14" style={{ ...h2, fontSize: "clamp(2rem,4vw,3.5rem)" }}>{c.advantages.headline}</h2>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(248,247,243,0.07)" }}>
                {c.advantages.items.map((item, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="p-8 lg:p-10 h-full" style={{ backgroundColor: "var(--foreground)" }}>
                      <div className="w-8 h-1 mb-8" style={{ backgroundColor: "var(--accent)" }} />
                      <span className="block mb-5" style={{ fontFamily: serif, fontWeight: 800, fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--accent)" }}>{item.num}</span>
                      <h3 className="mb-4 leading-snug" style={{ ...h3, fontSize: "clamp(1rem,1.6vw,1.25rem)" }}>{item.title}</h3>
                      <p className="text-[14px] leading-relaxed" style={{ color: "rgba(248,247,243,0.5)" }}>{item.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── PORTFOLIO ────────────────────────────────── */}
          <section id="portfolio" className="py-24 lg:py-40">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <Reveal>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-16">
                  <div>
                    <Mark n={c.portfolio.num} label={c.portfolio.label} />
                    <h2 className="mt-5 leading-none" style={{ ...h2, fontSize: "clamp(2.2rem,4.5vw,4rem)" }}>
                      {c.portfolio.headline}
                    </h2>
                  </div>
                  <UnderlineBtn onClick={() => goPage("portfolio")} className="hidden sm:inline-flex self-end shrink-0">
                    {c.portfolio.cta}
                  </UnderlineBtn>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {c.portfolio.items.map((item, i) => (
                  <Reveal key={i} delay={i * 55}>
                    <PortfolioCard {...item} src={IMGS.portfolio[i]} onClick={() => setModalIndex(i)} />
                  </Reveal>
                ))}
              </div>
              <div className="sm:hidden mt-10 text-center">
                <UnderlineBtn onClick={() => goPage("portfolio")}>{c.portfolio.cta}</UnderlineBtn>
              </div>
            </div>
          </section>

          {/* ── CONTACT ──────────────────────────────────── */}
          <ContactSection c={c} headline={c.contact.headline} num={c.contact.num} label={c.contact.label} />

        </main>
      )}

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-14 lg:py-20" style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Orange top rule */}
          <div className="h-1 mb-12" style={{ backgroundColor: "var(--accent)" }} />
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div>
              <div style={{ fontFamily: serif, fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.12em" }} className="uppercase mb-1">MAKE</div>
              <div className="text-[9px] tracking-[0.18em] uppercase font-semibold mb-3" style={{ color: "rgba(248,247,243,0.35)" }}>
                by New Imagination · DMC China
              </div>
              <p className="text-[13px]" style={{ color: "rgba(248,247,243,0.38)" }}>{c.footer.tagline}</p>
            </div>
            <nav className="flex flex-wrap gap-5 lg:gap-9" aria-label="Footer navigation">
              {c.footer.links.map((link, i) => (
                <button key={link}
                  onClick={() => { if (i === 0) goPage("expo"); else if (i === 1) goPage("events"); else if (i === 2) goPage("portfolio"); else goto("contacts"); }}
                  className="text-[13px] font-medium transition-all hover:opacity-100 hover:text-white"
                  style={{ color: "rgba(248,247,243,0.45)" }}>
                  {link}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-12 pt-6 text-[11px] font-medium"
            style={{ borderTop: "1px solid rgba(248,247,243,0.08)", color: "rgba(248,247,243,0.22)" }}>
            {c.footer.legal}
          </div>
        </div>
      </footer>

    </div>
  );
}
