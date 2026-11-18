import { Menu, X } from "lucide-react";
import type { Page, ContentType } from "./content";

interface NavBarProps {
  c: ContentType;
  /** background under the menu: video hero, dark section or light section */
  mode: "hero" | "dark" | "light";
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  goto: (id: string) => void;
  goPage: (p: Page) => void;
}

export function NavBar({ c, mode, menuOpen, setMenuOpen, goto, goPage }: NavBarProps) {
  // Contrast with the section underneath: white section -> black bar, black section -> white bar
  const bar = mode === "hero" ? "transparent" : mode === "light" ? "#000" : "#fff";
  const ink = mode === "dark" ? "#000" : "#fff";
  return (
    <>
      <nav aria-label="Main navigation"
        className="fixed top-0 inset-x-0 z-50 transition-[background-color,color] duration-500 ease-out"
        style={{ backgroundColor: bar, color: ink }}>
        <div className="px-6 lg:px-20"><div className="max-w-[1360px] mx-auto flex items-center justify-between gap-6 h-[72px] lg:h-[84px]">
          <button onClick={() => goPage("home")} className="shrink-0 flex items-center"
            aria-label="Stagency China, home">
            <img src="/assets/stagency-logo-nav.png" alt="Stagency China by New Imagination DMC Group China"
              className="h-10 lg:h-12 w-auto" />
          </button>

          <div className="hidden lg:flex items-center gap-6 xl:gap-9">
            {c.nav.links.map((l) => (
              <button key={l.id} onClick={() => goto(l.id)}
                className="text-[13px] font-bold text-inherit hover:text-[color:var(--signal)] transition-colors whitespace-nowrap">
                {l.label}
              </button>
            ))}
            <button onClick={() => goto("contact")} className="btn btn-brand cut-sm !py-3 !text-[12px] whitespace-nowrap">
              {c.nav.cta}
            </button>
          </div>

          <button className="lg:hidden w-11 h-11 flex items-center justify-center text-inherit"
            onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={26} />
          </button>
        </div></div>
      </nav>

      <div className="fixed inset-0 z-[100] flex flex-col bg-black px-5 pt-4 pb-8 transition-opacity duration-300"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
        aria-hidden={!menuOpen}>
        <div className="flex justify-between items-center h-[56px] mb-10">
          <img src="/assets/stagency-logo-nav.png" alt="" className="h-10 w-auto" />
          <button onClick={() => setMenuOpen(false)} className="w-11 h-11 flex items-center justify-center text-white" aria-label="Close menu">
            <X size={26} />
          </button>
        </div>
        <nav className="flex flex-col gap-3">
          {c.nav.links.map((l) => (
            <button key={l.id} onClick={() => goto(l.id)}
              className="display text-left text-white hover:text-[color:var(--signal)] transition-colors"
              style={{ fontSize: "clamp(1.9rem, 8.5vw, 2.8rem)" }}>
              {l.label}
            </button>
          ))}
        </nav>
        <ul className="mt-auto mb-5 flex gap-3">
          {c.footer.socials.links.map((sl) => (
            <li key={sl.name}>
              <a href={sl.url} target="_blank" rel="noopener noreferrer" aria-label={`Stagency China on ${sl.name}`}
                className="inline-block px-3.5 py-2 text-[12px] font-bold bg-white text-black">{sl.name}</a>
            </li>
          ))}
        </ul>
        <button onClick={() => goto("contact")} className="btn btn-brand cut-sm w-full !py-5">
          {c.nav.cta}
        </button>
      </div>
    </>
  );
}
