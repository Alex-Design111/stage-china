import { useState, useEffect } from "react";
import { C, type Page } from "./content";
import { IMGS, VIDEOS } from "./images";
import { VideoBg, SectionHeading, CaseCard, ImageGallery, EndingSection, Placeholder, FitText } from "./ui";
import { Play, X } from "lucide-react";
import { NavBar } from "./NavBar";

type Filter = "all" | "event" | "booth";

// True once the visitor has scrolled past (most of) the hero
function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const fn = () => setPast(window.scrollY > window.innerHeight - 120);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    window.addEventListener("resize", fn);
    return () => { window.removeEventListener("scroll", fn); window.removeEventListener("resize", fn); };
  }, []);
  return past;
}

function getInitialPage(): Page {
  return window.location.pathname.includes("portfolio") ? "portfolio" : "home";
}

const SEO: Record<Page, { title: string; description: string; path: string }> = {
  home: {
    title: "Stagency China | Event Production in China: Gala Dinners, Conferences & AV",
    description: "Event production in China for international companies: gala dinners, conferences, events and activities, AV and shows, backed by full DMC support. We stage your vision.",
    path: "/",
  },
  portfolio: {
    title: "Cases | Stagency China",
    description: "Gala dinners, conferences, activities and exhibition stands produced in China for international clients.",
    path: "/portfolio",
  },
};

const SITE_ORIGIN = "https://stagencychina.com";

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function useSEO(page: Page) {
  useEffect(() => {
    const m = SEO[page];
    const url = SITE_ORIGIN + m.path;
    document.title = m.title;
    setMeta("name", "description", m.description);
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", m.title);
    setMeta("name", "twitter:description", m.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", url);
    try {
      if (window.location.pathname !== m.path) {
        // Old /expo-… and /event-… URLs fold into the home page without adding history
        const legacy = page === "home" && window.location.pathname !== "/";
        if (legacy) history.replaceState({ page }, m.title, m.path);
        else history.pushState({ page }, m.title, m.path);
      }
    } catch (_) {}
  }, [page]);
}

export default function App() {
  const c = C;
  const [page, setPage] = useState<Page>(getInitialPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryId, setGalleryId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [reelOpen, setReelOpen] = useState(false);
  const pastHero = usePastHero();

  useSEO(page);

  // Every page change starts at the top, instantly (not with the smooth-scroll animation)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [page]);

  // Slide-in animation and scroll snapping on both pages
  useEffect(() => {
    document.documentElement.classList.add("snap");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-in"); });
    }, { threshold: 0.15 });
    document.querySelectorAll(".slide-anim").forEach((el) => io.observe(el));
    return () => { document.documentElement.classList.remove("snap"); io.disconnect(); };
  }, [page]);

  useEffect(() => {
    const onPop = () => setPage(getInitialPage());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const goPage = (p: Page) => { setPage(p); setMenuOpen(false); };

  const openCases = (f: Filter) => { setFilter(f); goPage("portfolio"); };

  const goto = (id: string) => {
    setMenuOpen(false);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (page !== "home") { setPage("home"); setTimeout(scroll, 80); }
    else scroll();
  };

  const galleryProject = galleryId ? IMGS.getProject(galleryId) : null;
  const galleryItem = galleryId ? c.cases.items.find((i) => i.id === galleryId) : null;

  const visibleCases = c.cases.items.filter((i) =>
    filter === "all" || (filter === "event" ? i.tag === "Event" : i.tag === "Booth"));

  return (
    <div className="bg-white text-black">
      <NavBar c={c} solid={page !== "home" || pastHero} menuOpen={menuOpen}
        setMenuOpen={setMenuOpen} goto={goto} goPage={goPage} />

      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-black focus:text-white">
        Skip to content
      </a>

      {galleryProject && galleryItem && (
        <ImageGallery images={galleryProject.gallery} video={galleryProject.video} poster={galleryProject.poster ?? galleryProject.preview} title={galleryItem.title}
          subtitle={galleryItem.sub} tag={galleryItem.tag} story={galleryItem.story} onClose={() => setGalleryId(null)} />
      )}

      {reelOpen && c.hero.reel.url && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 lg:p-10" role="dialog" aria-modal="true" aria-label={c.hero.reel.label}
          onClick={() => setReelOpen(false)}>
          <button onClick={() => setReelOpen(false)} className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center bg-white text-black" aria-label="Close reel">
            <X size={20} />
          </button>
          <video src={c.hero.reel.url} controls autoPlay playsInline className="w-full max-w-6xl max-h-[85vh] bg-black" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ── PORTFOLIO PAGE ─────────────────────────────── */}
      {page === "portfolio" && (
        <main id="main-content">
          <section className="bg-black text-white pt-28 lg:pt-32 pb-8 lg:pb-10 px-5 lg:px-10" style={{ scrollSnapAlign: "start" }}>
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="display" style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}>{c.portfolioPage.headline}</h1>
                <p className="mt-4 text-[17px] text-white/70 max-w-[52ch]">{c.portfolioPage.sub}</p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0" role="group" aria-label="Filter cases">
                {(["all", "event", "booth"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
                    className={`btn !py-3 !text-[14px] ${filter === f ? "btn-brand cut-sm" : "btn-ghost"}`}>
                    {c.portfolioPage.filters[f]}
                  </button>
                ))}
              </div>
            </div>
          </section>
          <section className="px-5 lg:px-10 pt-6 lg:pt-8 pb-4" style={{ scrollSnapAlign: "start", scrollMarginTop: "84px" }} aria-label="Projects">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCases.map((item) => (
                <div key={item.id} className="h-[300px] lg:h-[34svh] lg:min-h-[280px]">
                  <CaseCard {...item} src={IMGS.getProject(item.id)?.preview || ""} video={IMGS.getProject(item.id)?.video} onClick={() => setGalleryId(item.id)} />
                </div>
              ))}
            </div>
          </section>
          <EndingSection c={c} />
        </main>
      )}

      {/* ── HOME PAGE ──────────────────────────────────── */}
      {page === "home" && (
        <main id="main-content">

          {/* Welcome */}
          <section className="relative h-[100svh] min-h-[560px] bg-black overflow-hidden flex items-center justify-center text-center" style={{ scrollSnapAlign: "start" }}>
            <div className="absolute inset-0">
              <div className="absolute inset-0" style={{ filter: "saturate(1.35) contrast(1.06) brightness(1.08)" }}>
                <VideoBg src={VIDEOS.home.src} poster={VIDEOS.home.poster} />
              </div>
              {/* Light edge shading only, so the nav and bottom links stay readable */}
              <div className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
              <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))" }} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-5">
              <div style={{ width: "min(500px, 78vw)", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.22))" }}>
                <h1 className="hero-logo m-0">
                  <img src="/assets/stagency-logo-white.png" alt="Stagency China by New Imagination DMC Group China"
                    className="block w-full h-auto" />
                </h1>
                <FitText text={c.hero.slogan} className="hero-in d-3 display text-white mt-5 lg:mt-6 text-center" />
              </div>
              <div className="hero-in d-5 mt-7 empty:hidden">
                <Placeholder ready={c.hero.reel.ready} label="showreel" compact>
                  <button onClick={() => c.hero.reel.url && setReelOpen(true)}
                    className="inline-flex items-center gap-3 text-white font-bold text-[15px] group">
                    <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </span>
                    {c.hero.reel.label}
                  </button>
                </Placeholder>
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 z-10 px-5 lg:px-10 hero-in d-5">
              <div className="max-w-[1600px] mx-auto border-t border-white/25 py-5 flex items-center justify-between gap-6">
                <ul className="hidden sm:flex gap-8 lg:gap-12">
                  {c.whatWeDo.items.map((it) => (
                    <li key={it.title}>
                      <button onClick={() => goto("what-we-do")} className="text-white/80 hover:text-white text-[15px] font-bold transition-colors">{it.title}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Proof strip (placeholder) */}
          <Placeholder ready={c.stats.ready} label="key numbers">
            <section className="px-5 lg:px-10 pt-16 lg:pt-20 pb-4" aria-label="Stagency in numbers">
              <dl className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {c.stats.items.map((st) => (
                  <div key={st.label} className="border-t-[3px] border-black pt-5">
                    <dd className="display" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}>{st.value}</dd>
                    <dt className="mt-3 text-[16px] font-bold text-[color:var(--steel)]">{st.label}</dt>
                  </div>
                ))}
              </dl>
            </section>
          </Placeholder>

          {/* What we do */}
          <section id="what-we-do" className="slide slide-anim px-5 lg:px-10" aria-labelledby="wwd-heading">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-10">
                <SectionHeading><span id="wwd-heading">{c.whatWeDo.headline}</span></SectionHeading>
                <p className="text-[18px] lg:text-[20px] font-medium max-w-[30ch] lg:text-right">{c.whatWeDo.intro}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {c.whatWeDo.items.map((item) => (
                  <article key={item.title}>
                    <div className="relative overflow-hidden bg-zinc-800 cut-md h-[34svh] min-h-[220px] lg:h-[38svh]">
                      <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)" }} />
                      <h3 className="display absolute left-6 lg:left-8 bottom-7 lg:bottom-9 right-14 text-white"
                        style={{ fontSize: "clamp(2.2rem, 3.6vw, 3.4rem)" }}>
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-[15px] lg:text-[16px] leading-relaxed text-[color:var(--steel)] max-w-[44ch]">{item.body}</p>
                  </article>
                ))}
              </div>

              <div className="bg-brand cut-sm mt-8 lg:mt-10 px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-black text-[18px] lg:text-[20px] font-bold" style={{ letterSpacing: "-0.01em" }}>
                  {c.whatWeDo.extra.title} <span className="font-medium">{c.whatWeDo.extra.body}</span>
                </p>
                <button onClick={() => goto("contact")} className="btn btn-ink cut-sm shrink-0 self-start sm:self-auto">{c.whatWeDo.extra.cta}</button>
              </div>

              <div className="mt-5 pt-4 border-t-2 border-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[16px] font-medium">{c.whatWeDo.secondary}</p>
                <button onClick={() => openCases("booth")} className="link-line text-[16px] self-start sm:self-auto">
                  {c.whatWeDo.secondaryLink}
                </button>
              </div>
            </div>
          </section>

          {/* Cases */}
          <section id="cases" className="slide slide-anim px-5 lg:px-10" aria-labelledby="cases-heading">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
                <SectionHeading><span id="cases-heading">{c.cases.headline}</span></SectionHeading>
                <button onClick={() => openCases("all")} className="link-line text-[17px] self-start sm:self-auto sm:mb-3">
                  {c.cases.cta}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(170px,21svh)] gap-4">
                {c.cases.items.slice(0, 6).map((item, i) => (
                  <div key={item.id} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                    <CaseCard {...item} large={i === 0} src={IMGS.getProject(item.id)?.preview || ""} video={IMGS.getProject(item.id)?.video}
                      onClick={() => setGalleryId(item.id)} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="slide slide-anim px-5 lg:px-10" style={{ backgroundColor: "var(--concrete)" }} aria-labelledby="svc-heading">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 lg:mb-12">
                <SectionHeading><span id="svc-heading">{c.services.headline}</span></SectionHeading>
                <p className="text-[18px] lg:text-[20px] font-medium max-w-[32ch] lg:text-right">{c.services.intro}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                {c.services.groups.map((g) => (
                  <div key={g.title} className="border-t-[3px] border-black pt-6">
                    <h3 className="font-bold leading-none mb-2" style={{ fontSize: "clamp(1.5rem, 1.7vw, 1.75rem)", letterSpacing: "-0.008em" }}>
                      {g.title}
                    </h3>
                    <p className="text-[14px] text-[color:var(--steel)] leading-snug mb-3">{g.intro}</p>
                    <ul>
                      {g.items.map((it) => (
                        <li key={it.name} className="py-2.5 border-b border-black/15">
                          <span className="block text-[15px] font-bold leading-snug">{it.name}</span>
                          {"note" in it && it.note && <span className="block text-[13px] text-[color:var(--steel)] mt-0.5">{it.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-brand cut-sm mt-10 px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-black text-[18px] lg:text-[20px] font-bold" style={{ letterSpacing: "-0.008em" }}>
                  {c.services.extra.title} <span className="font-medium">{c.services.extra.body}</span>
                </p>
                <button onClick={() => goto("contact")} className="btn btn-ink cut-sm shrink-0 self-start sm:self-auto">{c.services.extra.cta}</button>
              </div>
            </div>
          </section>

          {/* Who we are + who we work with */}
          <section id="who-we-are" className="slide slide-anim bg-black text-white px-5 lg:px-10" aria-labelledby="wwa-heading">
            <div className="max-w-[1600px] mx-auto">
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-20">
                <h2 id="wwa-heading" className="display" style={{ fontSize: "clamp(2.4rem, 4.6vw, 4.6rem)" }}>
                  {c.whoWeAre.headline}
                </h2>
                <div className="lg:pt-2">
                  {c.whoWeAre.body.map((p) => (
                    <p key={p.slice(0, 20)} className="text-[17px] lg:text-[19px] leading-relaxed text-white/80 mb-4 max-w-[50ch]">{p}</p>
                  ))}
                  <ul className="flex flex-wrap gap-2 mt-5" aria-label={c.whoWeAre.dmcTitle}>
                    {c.whoWeAre.dmc.map((d) => (
                      <li key={d} className="text-[14px] font-bold px-3 py-1.5 border border-white/25">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 mt-8 lg:mt-10">
                {c.whoWeAre.advantages.map((a, i) => (
                  <div key={a.title} className="pt-5 relative">
                    <div className={`absolute top-0 left-0 right-0 h-[3px] ${i === 0 ? "bg-brand" : "bg-white/25"}`} />
                    <h3 className="text-[21px] lg:text-[23px] font-bold leading-tight mb-2" style={{ letterSpacing: "-0.008em" }}>{a.title}</h3>
                    <p className="text-[15px] leading-relaxed text-white/65">{a.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 lg:mt-12">
                <h3 id="aud-heading" className="display mb-4" style={{ fontSize: "clamp(1.9rem, 3vw, 2.8rem)", color: "var(--signal)" }}>{c.audiences.headline}</h3>
                <ul className="grid md:grid-cols-3 gap-x-8 gap-y-6">
                  {c.audiences.items.map((a) => (
                    <li key={a.title} className="border-t border-white/25 pt-4">
                      <h4 className="text-[21px] lg:text-[23px] font-bold mb-2">{a.title}</h4>
                      <p className="text-[15px] leading-relaxed text-white/65 max-w-[44ch]">{a.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Clients */}
          <Placeholder ready={c.clients.ready} label="client logos">
            <section className="px-5 lg:px-10 pt-24 lg:pt-32" aria-labelledby="clients-heading">
              <div className="max-w-[1600px] mx-auto">
                <h2 id="clients-heading" className="display mb-10" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>{c.clients.headline}</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {c.clients.logos.map((l, i) => (
                    <li key={l.name + i} className="h-28 flex items-center justify-center px-6" style={{ backgroundColor: "var(--concrete)" }}>
                      {l.src
                        ? <img src={l.src} alt={l.name} className="max-h-12 max-w-full object-contain grayscale" loading="lazy" />
                        : <span className="text-[15px] font-bold text-[color:var(--steel)]">{l.name}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Placeholder>

          {/* Team */}
          <Placeholder ready={c.team.ready} label="team photos and names">
            <section className="mt-24 lg:mt-32 px-5 lg:px-10 py-24 lg:py-32" style={{ backgroundColor: "var(--concrete)" }} aria-labelledby="team-heading">
              <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
                  <SectionHeading><span id="team-heading">{c.team.headline}</span></SectionHeading>
                  <p className="text-[18px] lg:text-[20px] font-medium max-w-[30ch] lg:text-right">{c.team.intro}</p>
                </div>
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
                  {c.team.members.map((m, i) => (
                    <li key={m.role + i}>
                      <div className="relative cut-md bg-zinc-300 overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                        {m.photo
                          ? <img src={m.photo} alt={m.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                          : <span className="absolute inset-0 flex items-center justify-center display text-white/80" style={{ fontSize: "4rem" }} aria-hidden="true">
                              {m.name.split(" ").map((w) => w[0]).join("")}
                            </span>}
                      </div>
                      <h3 className="mt-4 text-[20px] font-bold" style={{ letterSpacing: "-0.008em" }}>{m.name}</h3>
                      <p className="text-[15px] font-bold">{m.role}</p>
                      <p className="text-[14px] text-[color:var(--steel)] mt-1">{m.languages}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Placeholder>

          <EndingSection c={c} />
        </main>
      )}

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="snap-end bg-black text-white px-5 lg:px-10 pt-16 lg:pt-20 pb-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <img src="/assets/stagency-logo-nav.png" alt="Stagency China by New Imagination DMC Group China" className="h-16 w-auto" />
              <p className="mt-6 text-[22px] font-bold" style={{ letterSpacing: "-0.008em" }}>{c.footer.tagline}</p>
              <a href="https://newimaginationdmc.com/" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-[14px] text-white/60 hover:text-white underline underline-offset-4">
                {c.footer.dmc}
              </a>
              <div className="mt-8 empty:hidden">
                <Placeholder ready={c.footer.socials.ready} label="social links" compact>
                  <ul className="flex gap-3">
                    {c.footer.socials.links.map((sl) => (
                      <li key={sl.name}>
                        <a href={sl.url || undefined} target="_blank" rel="noopener noreferrer"
                          className="inline-block px-3.5 py-2 text-[14px] font-bold bg-white text-black hover:bg-[color:var(--signal)] transition-colors">
                          {sl.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Placeholder>
              </div>
            </div>
            <nav aria-label="Footer navigation">
              <h2 className="text-[14px] font-bold text-white/50 mb-4">Explore</h2>
              <ul className="space-y-2.5">
                {c.nav.links.map((l) => (
                  <li key={l.id}>
                    <button onClick={() => goto(l.id)} className="text-[16px] font-bold text-white/85 hover:text-[color:var(--signal)] transition-colors">{l.label}</button>
                  </li>
                ))}
                <li><button onClick={() => openCases("all")} className="text-[16px] font-bold text-white/85 hover:text-[color:var(--signal)] transition-colors">All cases</button></li>
              </ul>
            </nav>
            <div>
              <h2 className="text-[14px] font-bold text-white/50 mb-4">Contact</h2>
              <ul className="space-y-2.5 text-[16px] font-bold">
                {c.ending.contacts.filter((x) => x.href).map((x) => (
                  <li key={x.label}><a href={x.href} className="text-white/85 hover:text-[color:var(--signal)] transition-colors break-words">{x.value}</a></li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] text-white/50 leading-relaxed max-w-[34ch]">{c.ending.contacts.find((x) => x.label === "Office")?.value}</p>
            </div>
          </div>
          <p className="mt-16 pt-6 border-t border-white/15 text-[13px] text-white/45">{c.footer.legal}</p>
        </div>
      </footer>
    </div>
  );
}
