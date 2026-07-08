import { useState, useEffect } from "react";
import { C, type Lang, type Page } from "./content";
import { IMGS, VIDEOS } from "./images";
import { serif, Mark, Reveal, UnderlineBtn, PillBtn, VideoBg, PortfolioCard, PortfolioModal, ContactSection, ImageGallery } from "./ui";
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
    home:      { title: "Stagency by New Imagination | Exhibition Booth Design & Event Production in China", description: "Full-service exhibition booth design, construction and corporate event production in China.", path: "/" },
    expo:      { title: "Expo Design & Construction | Stagency by New Imagination China", description: "Custom exhibition stand design and turnkey booth construction in China.", path: "/expo-design-construction" },
    events:    { title: "Event Design & Production | Stagency by New Imagination China", description: "Corporate conferences, product launches and brand activations in China.", path: "/event-design-production" },
    portfolio: { title: "Portfolio | Stagency by New Imagination China", description: "Exhibition booths and corporate events delivered across China.", path: "/portfolio" },
  },
  ru: {
    home:      { title: "Stagency by New Imagination | Стенды и мероприятия в Китае", description: "Полноцикловая компания по застройке стендов и организации мероприятий в Китае.", path: "/" },
    expo:      { title: "Стенды и застройка | Stagency by New Imagination Китай", description: "Проектирование и застройка стендов в Китае под ключ.", path: "/expo-design-construction" },
    events:    { title: "Мероприятия и продакшн | Stagency by New Imagination Китай", description: "Конференции, запуски продуктов и активации в Китае.", path: "/event-design-production" },
    portfolio: { title: "Портфолио | Stagency by New Imagination Китай", description: "Выставочные стенды и мероприятия по всему Китаю.", path: "/portfolio" },
  },
};

const SITE_ORIGIN = "https://stagencychina.com";
const OG_IMAGE = "https://stagencychina.com/assets/og-image.jpg";

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
  el.setAttribute("href", href);
}

function useSEO(page: Page, lang: Lang) {
  useEffect(() => {
    const m = SEO[lang][page];
    const url = SITE_ORIGIN + m.path;
    document.title = m.title;
    document.documentElement.lang = lang;
    setMeta("name", "description", m.description);
    setMeta("name", "robots", "index, follow");
    setCanonical(url);
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", OG_IMAGE);
    setMeta("property", "og:locale", lang === "ru" ? "ru_RU" : "en_US");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", m.title);
    setMeta("name", "twitter:description", m.description);
    setMeta("name", "twitter:image", OG_IMAGE);
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
  const [galleryProjectId, setGalleryProjectId] = useState<string | null>(null);
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

  const h1 = { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.015em" } as const;
  const h2 = { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.012em" } as const;
  const h3 = { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.01em" } as const;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", backgroundColor: "var(--background)", color: "var(--foreground)" }}>

      <NavBar c={c} lang={lang} setLang={setLang} scrolled={scrolled}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen} page={page} goto={goto} goPage={goPage} />

      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:text-xs"
        style={{ backgroundColor: "var(--accent)", color: "white" }}>Skip to content</a>

      {/* Project Gallery Modal */}
      {galleryProjectId !== null && (() => {
        const project = IMGS.getProject(galleryProjectId);
        const projectItem = c.portfolio.items.find(item => item.id === galleryProjectId);
        return project && projectItem ? (
          <ImageGallery
            images={project.gallery}
            title={projectItem.title}
            subtitle={projectItem.sub}
            tag={projectItem.tag}
            onClose={() => setGalleryProjectId(null)}
          />
        ) : null;
      })()}

      {/* Legacy Portfolio Modal */}
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
                    onClick={() => setGalleryProjectId(item.id)} projectId={item.id} />
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
          <section id="home" className="px-3 sm:px-4 lg:px-5 pt-[92px]" style={{ backgroundColor: "var(--background)" }}>
            <div className="relative flex flex-col justify-end overflow-hidden rounded-[1.6rem] lg:rounded-[2.2rem]"
              style={{ height: "calc(100svh - 108px)", minHeight: "560px" }}>
              <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: "#120a07" }}>
                <VideoBg src={VIDEOS.home.src} poster={VIDEOS.home.poster} />
                {/* Red→orange brand tint — keeps the footage's real color range */}
                <div className="absolute inset-0" style={{ background: "var(--video-tint)" }} />
                {/* Bottom shade for headline legibility */}
                <div className="absolute inset-0" style={{ background: "var(--video-shade)" }} />
              </div>
              <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 sm:px-8 lg:px-14 pt-10 pb-12 lg:pb-16">
                <p className="text-[10px] tracking-[0.4em] uppercase font-bold mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {c.hero.eyebrow}
                </p>
                <h1 className="text-white whitespace-pre-line mb-9"
                  style={{ ...h1, fontWeight: 500, fontSize: "clamp(3rem,9vw,8.5rem)", lineHeight: 0.98 }}>
                  {c.hero.headline}
                </h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-7 lg:gap-10">
                  <PillBtn onClick={() => goto("contacts")} size="lg">{c.hero.cta}</PillBtn>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.72)" }}>{c.hero.sub}</p>
                </div>
              </div>
              <div className="absolute right-6 lg:right-12 bottom-8 flex flex-col items-center gap-3 select-none">
                <span className="text-[9px] tracking-[0.35em] uppercase font-bold" style={{ writingMode: "vertical-rl", color: "rgba(255,255,255,0.55)" }}>{c.hero.scroll}</span>
                <div className="w-px h-10" style={{ backgroundColor: "white", opacity: 0.6 }} />
              </div>
            </div>
          </section>

          {/* ── ABOUT ────────────────────────────────────── */}
          <section id="about" className="py-24 lg:py-40 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-14">
              <Reveal><Mark n={c.about.num} label={c.about.label} /></Reveal>
            </div>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-[48fr_52fr] gap-12 lg:gap-16 items-stretch">
              <Reveal className="flex flex-col lg:pr-4">
                <h2 className="whitespace-pre-line mb-8 leading-[1.05]"
                  style={{ ...h2, fontSize: "clamp(2rem,4vw,3.6rem)" }}>
                  {c.about.headline}
                </h2>
                <p className="leading-relaxed mb-4 text-[15px]" style={{ color: "var(--muted-foreground)" }}>{c.about.body1}</p>
                <p className="leading-relaxed mb-4 text-[15px]" style={{ color: "var(--muted-foreground)" }}>{c.about.body2}</p>
                <p className="leading-relaxed mb-10 text-[15px]" style={{ color: "var(--muted-foreground)" }}>{c.about.body3}</p>
                <UnderlineBtn onClick={() => goto("contacts")} className="mt-auto self-start">{c.about.cta}</UnderlineBtn>
              </Reveal>
              <Reveal delay={160} className="relative overflow-hidden rounded-[1.8rem] bg-zinc-200 h-full min-h-[420px]">
                <img src={IMGS.about} alt="Exhibition design — Stagency China"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy" />
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
                  className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8 lg:mt-10">
                  <div className="flex flex-col lg:flex-row rounded-[1.8rem] overflow-hidden" style={{ minHeight: "540px" }}>
                    <div className={`relative overflow-hidden bg-zinc-800 ${isEven ? "lg:order-1" : "lg:order-2"}`} style={{ flex: "0 0 58%" }}>
                      <img src={IMGS.svc[i]} alt={item.title.replace("\n", " ")}
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.025]"
                        loading="lazy" style={{ opacity: 0.9, minHeight: "340px", maxHeight: "720px" }} />
                    </div>
                    <div className={`flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                      style={{ flex: "0 0 42%", backgroundColor: isEven ? "var(--foreground)" : "var(--secondary)", color: isEven ? "var(--background)" : "var(--foreground)" }}>
                      <Reveal>
                        <span className="text-[10px] tracking-[0.32em] uppercase font-bold block mb-7"
                          style={{ color: isEven ? "rgba(248,247,243,0.4)" : "var(--muted-foreground)" }}>{item.eyebrow}</span>
                        <h3 className="whitespace-pre-line leading-[1.05] mb-8" style={{ ...h3, fontSize: "clamp(1.9rem,3.2vw,3.2rem)" }}>
                          {item.title}
                        </h3>
                        <p className="leading-relaxed mb-10 text-[15px]"
                          style={{ color: isEven ? "rgba(248,247,243,0.6)" : "var(--muted-foreground)" }}>{item.body}</p>
                        <UnderlineBtn onClick={() => goPage(item.page)} light={isEven}>{item.cta}</UnderlineBtn>
                      </Reveal>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── ADVANTAGES ───────────────────────────────── */}
          <section className="pt-24 lg:pt-40 pb-12 lg:pb-16">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <Reveal>
                <Mark n={c.advantages.num} label={c.advantages.label} />
                <h2 className="mt-5 mb-12 lg:mb-16" style={{ ...h2, fontSize: "clamp(2rem,4vw,3.5rem)" }}>{c.advantages.headline}</h2>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {c.advantages.items.map((item, i) => (
                  <Reveal key={i} delay={i * 80} className="h-full">
                    <div className="h-full rounded-[1.4rem] p-8 lg:p-9 transition-shadow duration-300 hover:shadow-lg"
                      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 12px 34px -22px rgba(12,11,9,0.28)" }}>
                      <div className="w-9 h-1 mb-8 rounded-full" style={{ background: "var(--gradient-warm)" }} />
                      <span className="block mb-4" style={{ fontWeight: 800, fontSize: "0.62rem", letterSpacing: "0.16em", color: "var(--accent)" }}>{item.num}</span>
                      <h3 className="mb-4 leading-tight" style={{ ...h3, fontSize: "clamp(1.3rem,1.9vw,1.6rem)" }}>{item.title}</h3>
                      <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── PORTFOLIO ────────────────────────────────── */}
          <section id="portfolio" className="pt-12 lg:pt-16 pb-24 lg:pb-40">
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
                    <PortfolioCard {...item} src={IMGS.portfolio[i]} onClick={() => setGalleryProjectId(item.id)} projectId={item.id} />
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
          {/* Gradient top rule */}
          <div className="h-1 mb-12 rounded-full" style={{ background: "var(--gradient-warm)" }} />
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div>
              <div style={{ fontFamily: serif, fontWeight: 600, fontSize: "2rem", letterSpacing: "-0.01em" }} className="mb-1">Stagency</div>
              <div className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-3" style={{ color: "rgba(248,247,243,0.4)" }}>
                by{" "}
                <a href="https://newimaginationdmc.com/" target="_blank" rel="noopener noreferrer"
                  className="underline-offset-2 transition-colors hover:text-white focus-visible:text-white"
                  style={{ textDecoration: "underline", textDecorationColor: "rgba(248,247,243,0.25)" }}>
                  New Imagination DMC China
                </a>
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
