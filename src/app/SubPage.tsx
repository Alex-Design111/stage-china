import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { ContentType, Page } from "./content";
import { IMGS } from "./images";
import { serif, Mark, Reveal, PortfolioCard, ContactSection, ImageGallery } from "./ui";

interface SubPageProps {
  c: ContentType;
  pageKey: "expoPage" | "eventsPage";
  goPage: (p: Page) => void;
}

export function SubPage({ c, pageKey, goPage }: SubPageProps) {
  const [galleryProjectId, setGalleryProjectId] = useState<string | null>(null);
  const pg = c[pageKey];
  const imgIdx = pageKey === "expoPage" ? 0 : 1;

  return (
    <div style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
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

      {/* Compact hero */}
      <div className="relative overflow-hidden mx-3 sm:mx-4 lg:mx-5 mt-[76px] rounded-[1.6rem] lg:rounded-[2.2rem]" style={{ minHeight: "440px", backgroundColor: "#7a1e12" }}>
        <img
          src={IMGS.subHero[imgIdx]}
          alt={pg.headline.replace("\n", " ")}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.72, mixBlendMode: "luminosity" }}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-warm-soft)", mixBlendMode: "multiply" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(60,12,6,0.8) 0%, rgba(60,12,6,0.15) 100%)" }} />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-14 pt-24 pb-16">
          <button
            onClick={() => goPage("home")}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium mb-10 transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <ChevronRight size={10} className="rotate-180" style={{ color: "var(--accent)" }} />
            {pg.back}
          </button>
          <div className="flex items-center gap-3 mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span className="text-[10px] tracking-[0.32em] uppercase font-medium">{pg.breadcrumb}</span>
          </div>
          <h1 className="text-white whitespace-pre-line"
            style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 1.04 }}>
            {pg.headline}
          </h1>
          <p className="mt-6 text-sm leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
            {pg.sub}
          </p>
        </div>
      </div>

      {/* Services list */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.32em] uppercase font-medium mb-14" style={{ color: "var(--muted-foreground)" }}>
              {pg.servicesLabel}
            </p>
          </Reveal>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {pg.services.map((svc, i) => (
              <Reveal key={i} delay={i * 40}>
                <div
                  className="grid gap-4 py-9 cursor-default transition-colors duration-200"
                  style={{ borderBottom: "1px solid var(--border)", gridTemplateColumns: "64px 1fr" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span className="text-[11px] tracking-[0.25em] font-medium mt-1" style={{ color: "var(--accent)" }}>
                    {svc.num}
                  </span>
                  <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-10">
                    <h3 className="mb-3 lg:mb-0 leading-snug"
                      style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(1.15rem,2vw,1.5rem)" }}>
                      {svc.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      {svc.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20 lg:py-32" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <Reveal>
            <h2 className="mb-12" style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(2rem,4vw,3.2rem)" }}>
              {pg.portfolioHeadline}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.portfolio.items.map((item, i) => (
              <Reveal key={i} delay={i * 55}>
                <PortfolioCard {...item} src={IMGS.portfolio[i]} projectId={item.id} onClick={() => setGalleryProjectId(item.id)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactSection c={c} headline={pg.contactHeadline} num="—" label={c.contact.label} />
    </div>
  );
}
