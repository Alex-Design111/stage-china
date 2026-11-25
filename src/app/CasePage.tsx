// One page per case: /cases/<id>
import { useState } from "react";
import type { ContentType } from "./content";
import { IMGS } from "./images";
import { CASE_STORIES } from "./caseStories";
import { casePath } from "./routes";
import { CaseCard, EndingSection, ImageGallery, Picture } from "./ui";

type Click = (fn: () => void) => (e: React.MouseEvent) => void;

// First photo is large; the last one stretches so the final row is always full
function tileSpan(n: number, total: number): string {
  const cls: string[] = [];
  if (total === 1) return "col-span-2 lg:col-span-3 lg:row-span-2";
  if (n === 0) cls.push("col-span-2 lg:row-span-2");
  if (n === total - 1 && total > 1) {
    if ((total + 1) % 2 === 1) cls.push("col-span-2"); // phones: 2 columns, first photo takes 2 cells
    const r = (total + 3) % 3;                          // desktop: 3 columns, first photo takes 4 cells
    if (r === 1) cls.push("lg:col-span-3");
    else if (r === 2) cls.push("lg:col-span-2");
    else cls.push("lg:col-span-1");
  }
  return cls.join(" ");
}

export function CasePage({ c, id, openCase, openCases, goto, linkClick }: {
  c: ContentType; id: string; openCase: (id: string) => void; openCases: () => void; goto: (id: string) => void; linkClick: Click;
}) {
  const items = c.cases.items;
  const i = items.findIndex((x) => x.id === id);
  const item = items[i];
  const project = IMGS.getProject(id);
  const story = CASE_STORIES[id];
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (!item || !project) return null;

  // "Beijing, 250 guests, 2026" -> facts
  const parts = item.sub.split(",").map((x) => x.trim());
  const facts: { label: string; value: string }[] = [{ label: "City", value: parts[0] }];
  parts.slice(1).forEach((p) => {
    if (/^\d{4}$/.test(p)) facts.push({ label: "Year", value: p });
    else facts.push({ label: p.includes("m²") ? "Stand size" : "Guests", value: p.replace(/\s*(guests|delegates)$/, "") + (/delegates/.test(p) ? " delegates" : "") });
  });
  if (story) facts.push({ label: "Format", value: story.format });

  // the next three cases of the same kind
  const same = items.filter((x) => x.tag === item.tag && x.id !== id);
  const after = same.filter((x) => items.indexOf(x) > i);
  const more = [...after, ...same.filter((x) => items.indexOf(x) < i)].slice(0, 3);

  const photos = project.gallery;

  return (
    <main id="main-content">
      {lightbox !== null && (
        <ImageGallery images={photos} video={null} startIndex={lightbox} title={item.title} subtitle={item.sub} tag={item.tag}
          onClose={() => setLightbox(null)} />
      )}

      {/* Title + main video or photo */}
      <section data-bg="dark" className="slide slide-anim bg-black text-white px-6 lg:px-20">
        <div className="max-w-[1360px] mx-auto">
          <a href="/portfolio" onClick={linkClick(openCases)} className="inline-flex items-center gap-2 text-[13px] font-bold text-white/70 hover:text-[color:var(--signal)] transition-colors">
            <span aria-hidden="true">←</span> All cases
          </a>
          <h1 className="display mt-4 lg:mt-6 max-w-[22ch]" style={{ fontSize: "clamp(1.9rem, 4.2vw, 4rem)" }}>{item.title}</h1>
          <dl className="mt-5 lg:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 lg:gap-y-5 max-w-[880px]">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-white/25 pt-2 lg:pt-3">
                <dt className="text-[12px] text-white/55 font-bold">{f.label}</dt>
                <dd className="m-0 mt-1 text-[15px] lg:text-[17px] font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="relative mt-6 lg:mt-10 cut-lg overflow-hidden bg-zinc-900 h-[clamp(200px,calc(100svh-480px),720px)] lg:h-[clamp(260px,calc(100svh-470px),720px)]">
            {project.video ? (
              <video src={project.video} poster={project.poster ?? project.preview} controls playsInline muted preload="metadata"
                className="absolute inset-0 w-full h-full object-cover" aria-label={`${item.title}: video`} />
            ) : (
              <Picture src={project.preview} alt={`${item.title}, ${item.sub}`} loading="eager" sizes="(min-width: 1440px) 1360px, 100vw"
                className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>
        </div>
      </section>

      {/* About the project */}
      {story && (
        <section data-bg="light" className="slide slide-anim bg-white px-6 lg:px-20">
          <div className="max-w-[1360px] mx-auto grid lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-24">
            <div>
              <h2 className="display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.8rem)" }}>The project</h2>
              {story.overview.map((p) => (
                <p key={p.slice(0, 24)} className="mt-4 lg:mt-6 text-[14px] lg:text-[18px] leading-relaxed text-black/80 max-w-[52ch]">{p}</p>
              ))}
            </div>
            <div>
              <h2 className="display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.8rem)" }}>What we delivered</h2>
              <ul className="mt-6">
                {story.scope.map((s) => (
                  <li key={s} className="border-t-2 border-black py-2 lg:py-3 text-[13px] lg:text-[16px] font-bold">{s}</li>
                ))}
              </ul>
              <p className="mt-5 lg:mt-8 text-[12px] font-bold text-black/55">Services used</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {story.services.map((s) => (
                  <li key={s}>
                    <a href="/#services" onClick={linkClick(() => goto("services"))}
                      className="inline-block px-3 py-1.5 text-[12px] font-bold bg-black text-white hover:bg-[color:var(--signal)] hover:text-black transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* All photos */}
      <section data-bg="dark" className="slide slide-anim bg-black text-white px-6 lg:px-20" aria-labelledby="gallery-heading">
        <div className="max-w-[1360px] mx-auto">
          <h2 id="gallery-heading" className="display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.8rem)" }}>Photos</h2>
          <div className="mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-[40vw] sm:auto-rows-[30vw] lg:auto-rows-[clamp(160px,19vw,290px)]">
            {photos.map((src, n) => (
              <button key={src} type="button" onClick={() => setLightbox(n)}
                className={`group relative overflow-hidden bg-zinc-900 ${tileSpan(n, photos.length)}`}
                aria-label={`Open photo ${n + 1} of ${photos.length}`}>
                <Picture src={src} alt={`${item.title}, ${parts[0]}: photo ${n + 1}`} sizes={n === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* More cases */}
      {more.length > 0 && (
        <section data-bg="light" className="slide slide-anim bg-white px-6 lg:px-20" aria-labelledby="more-heading">
          <div className="max-w-[1360px] mx-auto">
            <div className="flex items-end justify-between gap-4">
              <h2 id="more-heading" className="display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.8rem)" }}>More cases</h2>
              <a href="/portfolio" onClick={linkClick(openCases)} className="btn btn-brand cut-sm shrink-0 !py-3 !text-[12px] lg:!text-[13px]">All cases</a>
            </div>
            <div className="mt-5 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              {more.map((m) => (
                <div key={m.id} className="[&>a]:min-h-0 h-[clamp(120px,calc((100svh-300px)/3),300px)] sm:h-[clamp(200px,calc(100svh-360px),420px)]">
                  <CaseCard {...m} src={IMGS.getProject(m.id)?.preview || ""} video={IMGS.getProject(m.id)?.video} href={casePath(m.id)} onClick={linkClick(() => openCase(m.id))} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <EndingSection c={c} dark />
    </main>
  );
}
