import { useState, useEffect } from "react";
import { C, type Page } from "./content";
import { IMGS, VIDEOS } from "./images";
import { VideoBg, SectionHeading, CaseCard, EndingSection, Placeholder, FitText, Picture } from "./ui";
import { Play, X } from "lucide-react";
import { NavBar } from "./NavBar";
import { CasePage } from "./CasePage";
import { animateScrollTo, useSectionPaging } from "./smoothScroll";
import { parsePath, routePath, seoFor, casePath, SITE_ORIGIN, type Seo, type Route } from "./routes";


// Which background sits under the top menu: "hero" (video), "dark" or "light"
type NavMode = "hero" | "dark" | "light";
function useNavMode(page: string): NavMode {
  const [mode, setMode] = useState<NavMode>("hero");
  useEffect(() => {
    const probe = 42; // middle of the menu bar
    const fn = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-bg]");
      let found: NavMode = "light";
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.top <= probe && r.bottom > probe) { found = el.dataset.bg as NavMode; break; }
      }
      setMode(found);
    };
    fn();
    const t = window.setTimeout(fn, 400);
    window.addEventListener("scroll", fn, { passive: true });
    window.addEventListener("resize", fn);
    return () => { window.clearTimeout(t); window.removeEventListener("scroll", fn); window.removeEventListener("resize", fn); };
  }, [page]);
  return mode;
}

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

// Keep the head tags in step with the page shown (the build already ships them for every address)
function applyHead(m: Seo) {
  const url = SITE_ORIGIN + m.path;
  document.title = m.title;
  setMeta("name", "description", m.description);
  setMeta("property", "og:title", m.title);
  setMeta("property", "og:description", m.description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", m.image);
  setMeta("name", "twitter:title", m.title);
  setMeta("name", "twitter:description", m.description);
  setMeta("name", "twitter:image", m.image);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
}

export default function App({ initialPath }: { initialPath?: string }) {
  const c = C;
  const [initial] = useState<Route>(() => parsePath(initialPath ?? window.location.pathname));
  const [page, setPage] = useState<Page>(initial.page);
  const [menuOpen, setMenuOpen] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(initial.caseId);
  const [reelOpen, setReelOpen] = useState(false);
  useEffect(() => {
    if (!reelOpen) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setReelOpen(false); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [reelOpen]);
  const navMode = useNavMode(page);
  const [fading, setFading] = useState(false);
  useSectionPaging(page === "home" || page === "case");

  // Address bar + head tags follow the page and the open case
  useEffect(() => {
    const r: Route = { page, caseId: page === "case" ? caseId : null };
    applyHead(seoFor(r));
    const path = routePath(r);
    if (window.location.pathname !== path) {
      try { history.pushState(r, "", path); } catch (_) {}
    }
  }, [page, caseId]);

  // Coming in on /#services etc.: jump straight to that section once
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" as ScrollBehavior });
    }, 60);
    return () => window.clearTimeout(t);
  }, []);

  // Every page change starts at the top, instantly (not with the smooth-scroll animation)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [page, caseId]);

  // Slide-in animation and scroll snapping on both pages
  useEffect(() => {
    // Home slides snap firmly on desktop; the long cases page snaps softly so it never jumps
    // Home and case pages page section by section; the cases list snaps softly
    const snapClass = page === "portfolio" ? "snap-soft" : "snap";
    if (snapClass) document.documentElement.classList.add(snapClass);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-in"); });
    }, { threshold: 0.15 });
    document.querySelectorAll(".slide-anim").forEach((el) => io.observe(el));
    return () => { if (snapClass) document.documentElement.classList.remove(snapClass); io.disconnect(); };
  }, [page, caseId]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const r = (e.state as Route | null) ?? parsePath(window.location.pathname);
      setPage(r.page);
      setCaseId(r.caseId);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Fade the page out, swap it, fade the new one in
  const switchPage = (p: Page, after?: () => void, nextCase: string | null = null) => {
    setMenuOpen(false);
    if (p === page && (p !== "case" || nextCase === caseId)) { after?.(); return; }
    setFading(true);
    window.setTimeout(() => {
      setPage(p);
      setCaseId(p === "case" ? nextCase : null);
      requestAnimationFrame(() => requestAnimationFrame(() => { setFading(false); after?.(); }));
    }, 260);
  };
  const goPage = (p: Page) => switchPage(p, () => {
    if (p === "home") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  });

  const openCases = () => goPage("portfolio");
  const openCase = (id: string) => switchPage("case", undefined, id);
  // Links keep real addresses for crawlers; clicks are handled in-page
  const linkClick = (fn: () => void) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
    e.preventDefault(); fn();
  };

  const goto = (id: string) => {
    const scroll = (instant = false) => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY;
      if (instant) window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      else animateScrollTo(y);
    };
    if (page !== "home") switchPage("home", () => scroll(true));
    else { setMenuOpen(false); scroll(); }
  };

  const visibleCases = c.cases.items;

  return (
    <div className="bg-white text-black">
      <NavBar c={c} mode={navMode} menuOpen={menuOpen}
        setMenuOpen={setMenuOpen} goto={goto} goPage={goPage} />

      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-black focus:text-white">
        Skip to content
      </a>

      {reelOpen && c.hero.reel.url && (
        <div className="reel-in fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 lg:p-10" role="dialog" aria-modal="true" aria-label={c.hero.reel.label}
          onClick={() => setReelOpen(false)}>
          <button onClick={() => setReelOpen(false)} className="absolute top-5 right-5 lg:top-7 lg:right-7 w-11 h-11 flex items-center justify-center bg-white text-black hover:bg-[color:var(--signal)] transition-colors" aria-label="Close promo video">
            <X size={20} />
          </button>
          <video src={c.hero.reel.url} poster={c.hero.reel.poster} controls autoPlay playsInline
            className="cut-lg w-full max-w-6xl max-h-[82vh] aspect-video bg-black" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="transition-[opacity,transform] duration-[260ms] ease-out"
        style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(12px)" : "none" }}>
      {/* ── PORTFOLIO PAGE ─────────────────────────────── */}
      {page === "portfolio" && (
        <main id="main-content">
          <section data-bg="dark" className="bg-black text-white pt-28 lg:pt-32 pb-8 lg:pb-10 px-6 lg:px-20" style={{ scrollSnapAlign: "start end" }}>
            <div className="max-w-[1360px] mx-auto">
              <h1 className="display" style={{ fontSize: "clamp(2.2rem, 4.4vw, 4.2rem)" }}>{c.portfolioPage.headline}</h1>
              <p className="mt-4 text-[15px] text-white/70 max-w-[52ch]">{c.portfolioPage.sub}</p>
            </div>
          </section>
          <section data-bg="light" className="px-6 lg:px-20 pt-6 lg:pt-8 pb-4" style={{ scrollSnapAlign: "start end", scrollMarginTop: "84px" }} aria-label="Projects">
            <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleCases.map((item) => (
                <div key={item.id} className="h-[300px] lg:h-[34svh] lg:min-h-[280px]">
                  <CaseCard {...item} src={IMGS.getProject(item.id)?.preview || ""} video={IMGS.getProject(item.id)?.video} href={casePath(item.id)} onClick={linkClick(() => openCase(item.id))} />
                </div>
              ))}
            </div>
          </section>
          <EndingSection c={c} dark />
        </main>
      )}

      {/* ── CASE PAGE ──────────────────────────────────── */}
      {page === "case" && caseId && (
        <CasePage key={caseId} c={c} id={caseId} openCase={openCase} openCases={openCases} goto={goto} linkClick={linkClick} />
      )}

      {/* ── HOME PAGE ──────────────────────────────────── */}
      {page === "home" && (
        <main id="main-content">

          {/* Welcome */}
          <section data-bg="hero" className="relative h-[100svh] min-h-[560px] bg-black overflow-hidden flex items-center justify-center text-center" style={{ scrollSnapAlign: "start" }}>
            <div className="absolute inset-0">
              <div className="absolute inset-0" style={{ filter: "saturate(1.35) contrast(1.06) brightness(1.08)" }}>
                <VideoBg src={VIDEOS.home.src} mobileSrc={VIDEOS.home.mobileSrc} poster={VIDEOS.home.poster} />
              </div>
              {/* Light edge shading only, so the nav and bottom links stay readable */}
              <div className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
              <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))" }} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-5">
              <div style={{ width: "min(500px, 78vw)", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.22))" }}>
                <div className="hero-logo m-0">
                  <img src="/assets/stagency-logo-hero.png" alt="Stagency China by New Imagination DMC Group China"
                    width={1000} height={512} className="block w-full h-auto" />
                </div>
                <FitText text={c.hero.slogan} className="hero-in d-3 display text-white mt-5 lg:mt-6 text-center" />
              </div>
              <div className="hero-in d-5 mt-7 empty:hidden">
                <Placeholder ready={c.hero.reel.ready} label="showreel" compact>
                  <button onClick={() => c.hero.reel.url && setReelOpen(true)}
                    className="btn btn-brand cut-sm gap-3 !text-[13px]">
                    <Play size={15} fill="currentColor" aria-hidden="true" />
                    {c.hero.reel.label}
                  </button>
                </Placeholder>
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 z-10 px-6 lg:px-20 hero-in d-5">
              <div className="max-w-[1360px] mx-auto border-t border-white/25 py-5 text-center">
                <h1 className="text-white/90 text-[12px] sm:text-[13px] lg:text-[14px] font-bold leading-snug text-balance m-0">{c.whatWeDo.heroLine}</h1>
              </div>
            </div>
          </section>

          {/* Proof strip (placeholder) */}
          <Placeholder ready={c.stats.ready} label="key numbers">
            <section className="px-6 lg:px-20 pt-16 lg:pt-20 pb-4" aria-label="Stagency in numbers">
              <dl className="max-w-[1360px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {c.stats.items.map((st) => (
                  <div key={st.label} className="border-t-[3px] border-black pt-5">
                    <dd className="display" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}>{st.value}</dd>
                    <dt className="mt-3 text-[14px] font-bold text-[color:var(--steel)]">{st.label}</dt>
                  </div>
                ))}
              </dl>
            </section>
          </Placeholder>

          {/* What we do */}
          <section data-bg="light" id="what-we-do" className="slide slide-anim px-6 lg:px-20" aria-labelledby="wwd-heading">
            <div className="max-w-[1360px] mx-auto">
              <SectionHeading className="mb-[clamp(1rem,4svh,3.5rem)]"><span id="wwd-heading">{c.whatWeDo.headline}</span></SectionHeading>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8">
                {c.whatWeDo.items.map((item) => (
                  <article key={item.title}>
                    <a href="/portfolio" onClick={linkClick(openCases)} aria-label={`${item.title}: see our cases`}
                      className="group block relative overflow-hidden bg-zinc-800 cut-md h-[clamp(90px,calc((100svh-370px)/3),260px)] md:h-[clamp(200px,calc(100svh-400px),520px)]">
                      <Picture src={item.image} alt={item.alt} sizes="(min-width: 768px) 33vw, 100vw" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                      {/* even shade so the centred title reads on any photo */}
                      <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/25" />
                      <h3 className="display absolute inset-0 flex items-center justify-center text-center px-10 md:px-8 lg:px-10 text-white text-balance"
                        style={{ fontSize: "clamp(1.3rem, 2.3vw, 2.4rem)", textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                        {item.title}
                      </h3>
                      <span className="absolute bottom-0 left-[76px] right-0 h-[4px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>

              <div className="mt-[clamp(1rem,4svh,3.5rem)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
                <p className="text-[17px] lg:text-[18px] font-bold" style={{ letterSpacing: "-0.01em" }}>{c.whatWeDo.extra.title}</p>
                <a href="/#contact" onClick={linkClick(() => goto("contact"))} className="btn btn-brand cut-sm shrink-0 self-start sm:self-auto">{c.whatWeDo.extra.cta}</a>
              </div>
            </div>
          </section>

          {/* Cases */}
          <section data-bg="dark" id="cases" className="slide slide-anim bg-black text-white px-6 lg:px-20" aria-labelledby="cases-heading">
            <div className="max-w-[1360px] mx-auto">
              <div className="flex flex-row items-end justify-between gap-4 mb-[clamp(1rem,4svh,3.5rem)]">
                <SectionHeading light><span id="cases-heading">{c.cases.headline}</span></SectionHeading>
                <a href="/portfolio" onClick={linkClick(openCases)} className="btn btn-brand cut-sm shrink-0 !py-3 lg:!py-3.5 !text-[12px] lg:!text-[13px] mb-1 lg:mb-2">
                  {c.cases.cta}
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[clamp(100px,calc((100svh-300px)/3),260px)] sm:auto-rows-[clamp(150px,calc((100svh-380px)/2),300px)] gap-3 lg:gap-6">
                {c.cases.items.slice(0, 3).map((item, i) => (
                  <div key={item.id} className={`[&>a]:min-h-0 ${i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}>
                    <CaseCard {...item} large={i === 0} src={IMGS.getProject(item.id)?.preview || ""} video={IMGS.getProject(item.id)?.video}
                      href={casePath(item.id)} onClick={linkClick(() => openCase(item.id))} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section data-bg="light" id="services" className="slide slide-anim bg-white px-6 lg:px-20" aria-labelledby="svc-heading">
            <div className="max-w-[1360px] mx-auto">
              <SectionHeading className="mb-[clamp(1rem,4svh,3.5rem)]"><span id="svc-heading">{c.services.headline}</span></SectionHeading>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 sm:gap-x-10 gap-y-3 lg:gap-y-12">
                {c.services.groups.map((g) => (
                  <div key={g.title} className="border-t-2 border-black pt-2 lg:pt-6">
                    <h3 className="font-bold leading-tight mb-1 lg:mb-5 min-h-[2.5em]" style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.6rem)", letterSpacing: "-0.008em" }}>
                      {g.title}
                    </h3>
                    <ul>
                      {g.items.map((it) => (
                        <li key={it.name} className="py-[1.5px] lg:py-1.5 text-[10.5px] sm:text-[13px] lg:text-[14px] leading-tight lg:leading-snug text-black/80">{it.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Who we are */}
          <section data-bg="dark" id="who-we-are" className="slide slide-anim bg-black text-white px-6 lg:px-20" aria-labelledby="wwa-heading">
            <div className="max-w-[1360px] mx-auto">
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4 lg:gap-24 items-start">
                <h2 id="wwa-heading" className="display" style={{ fontSize: "clamp(1.9rem, 3.4vw, 3.5rem)" }}>
                  {c.whoWeAre.headline}
                </h2>
                <p className="text-[13px] lg:text-[17px] leading-relaxed text-white/75 max-w-[44ch] lg:pt-2">
                  {c.whoWeAre.lead.split(c.whoWeAre.leadLink)[0]}
                  <a href={c.newImaginationUrl} target="_blank" rel="noopener noreferrer"
                    className="text-white underline decoration-[color:var(--signal)] decoration-2 underline-offset-4 hover:text-[color:var(--signal)] transition-colors">
                    {c.whoWeAre.leadLink}
                  </a>
                  {c.whoWeAre.lead.split(c.whoWeAre.leadLink)[1]}
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 lg:gap-x-10 gap-y-5 lg:gap-y-10 mt-[clamp(1rem,6svh,6rem)]">
                {c.whoWeAre.advantages.map((a, i) => (
                  <div key={a.title} className="pt-3 lg:pt-5 relative">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] ${i === 0 ? "bg-brand" : "bg-white/25"}`} />
                    <h3 className="text-[13px] sm:text-[15px] lg:text-[18px] font-bold leading-tight mb-1 lg:mb-2">{a.title}</h3>
                    <p className="text-[11px] sm:text-[13px] leading-relaxed text-white/60">{a.short}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Clients */}
          <Placeholder ready={c.clients.ready} label="client logos">
            <section className="px-6 lg:px-20 pt-24 lg:pt-32" aria-labelledby="clients-heading">
              <div className="max-w-[1360px] mx-auto">
                <h2 id="clients-heading" className="display mb-10" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>{c.clients.headline}</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {c.clients.logos.map((l, i) => (
                    <li key={l.name + i} className="h-28 flex items-center justify-center px-6" style={{ backgroundColor: "var(--concrete)" }}>
                      {l.src
                        ? <img src={l.src} alt={l.name} className="max-h-12 max-w-full object-contain grayscale" loading="lazy" />
                        : <span className="text-[13px] font-bold text-[color:var(--steel)]">{l.name}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Placeholder>

          {/* Team */}
          <Placeholder ready={c.team.ready} label="team photos and names">
            <section className="mt-24 lg:mt-32 px-6 lg:px-20 py-24 lg:py-32" aria-labelledby="team-heading">
              <div className="max-w-[1360px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
                  <SectionHeading><span id="team-heading">{c.team.headline}</span></SectionHeading>
                  <p className="text-[15px] lg:text-[17px] font-medium max-w-[30ch] lg:text-right">{c.team.intro}</p>
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
                      <h3 className="mt-4 text-[17px] font-bold" style={{ letterSpacing: "-0.008em" }}>{m.name}</h3>
                      <p className="text-[13px] font-bold">{m.role}</p>
                      <p className="text-[12px] text-[color:var(--steel)] mt-1">{m.languages}</p>
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
      <footer data-bg="dark" className="snap-end bg-black text-white border-t border-white/15 px-6 lg:px-20 pt-16 lg:pt-20 pb-10">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              {/* logo and slogan share one width */}
              <div className="w-[260px] lg:w-[300px]">
                <img src="/assets/stagency-logo-footer.png" alt="Stagency China by New Imagination DMC Group China" className="w-full h-auto" />
                <FitText text={c.footer.tagline} className="mt-5 font-bold" />
              </div>
              <a href={c.newImaginationUrl} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-[12px] text-white/60 hover:text-white underline underline-offset-4">
                {c.footer.dmc}
              </a>
              <div className="mt-8 empty:hidden">
                <Placeholder ready={c.footer.socials.ready} label="social links" compact>
                  <ul className="flex gap-3">
                    {c.footer.socials.links.map((sl) => (
                      <li key={sl.name}>
                        <a href={sl.url} target="_blank" rel="noopener noreferrer" aria-label={`Stagency China on ${sl.name}`}
                          className="inline-block px-3.5 py-2 text-[12px] font-bold bg-white text-black hover:bg-[color:var(--signal)] transition-colors">
                          {sl.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Placeholder>
              </div>
            </div>
            <nav aria-label="Footer navigation">
              <h2 className="text-[12px] font-bold text-white/50 mb-4">Explore</h2>
              <ul className="space-y-2.5">
                {c.nav.links.map((l) => (
                  <li key={l.id}>
                    <a href={`/#${l.id}`} onClick={linkClick(() => goto(l.id))} className="text-[14px] font-bold text-white/85 hover:text-[color:var(--signal)] transition-colors">{l.label}</a>
                  </li>
                ))}
                <li><a href="/portfolio" onClick={linkClick(openCases)} className="text-[14px] font-bold text-white/85 hover:text-[color:var(--signal)] transition-colors">All cases</a></li>
              </ul>
            </nav>
            <div>
              <h2 className="text-[12px] font-bold text-white/50 mb-4">Contact</h2>
              <ul className="space-y-2.5 text-[14px] font-bold">
                {c.ending.contacts.filter((x) => x.href).map((x) => (
                  <li key={x.label}><a href={x.href} className="text-white/85 hover:text-[color:var(--signal)] transition-colors break-words">{x.value}</a></li>
                ))}
              </ul>
              <p className="mt-4 text-[12px] text-white/50 leading-relaxed max-w-[34ch]">{c.ending.contacts.find((x) => x.label === "Office")?.value}</p>
            </div>
          </div>
          <p className="mt-16 pt-6 border-t border-white/15 text-[12px] text-white/45">{c.footer.legal}</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
