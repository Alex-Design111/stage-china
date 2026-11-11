import { Menu, X } from "lucide-react";
import type { Page, ContentType } from "./content";

interface NavBarProps {
  c: ContentType;
  solid: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  goto: (id: string) => void;
  goPage: (p: Page) => void;
}

export function NavBar({ c, solid, menuOpen, setMenuOpen, goto, goPage }: NavBarProps) {
  return (
    <>
      <nav aria-label="Main navigation"
        className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
        style={{ backgroundColor: solid ? "#000" : "transparent" }}>
        <div className="max-w-[1600px] mx-auto px-5 lg:px-10 flex items-center justify-between gap-6 h-[72px] lg:h-[84px]">
          <button onClick={() => goPage("home")} className="shrink-0 flex items-center"
            aria-label="Stagency China, home">
            <img src="/assets/stagency-logo-nav.png" alt="Stagency China by New Imagination DMC Group China"
              className="h-10 lg:h-12 w-auto transition-opacity duration-300"
              style={{ opacity: solid ? 1 : 0 }} />
          </button>

          <div className="hidden lg:flex items-center gap-9">
            {c.nav.links.map((l) => (
              <button key={l.id} onClick={() => goto(l.id)}
                className="text-[15px] font-bold text-white hover:text-[color:var(--signal)] transition-colors whitespace-nowrap">
                {l.label}
              </button>
            ))}
            <button onClick={() => goto("contact")} className="btn btn-brand cut-sm !py-3 !text-[14px]">
              {c.nav.cta}
            </button>
          </div>

          <button className="lg:hidden w-11 h-11 flex items-center justify-center text-white"
            onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={26} />
          </button>
        </div>
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
              style={{ fontSize: "clamp(2.4rem, 11vw, 3.6rem)" }}>
              {l.label}
            </button>
          ))}
        </nav>
        <button onClick={() => goto("contact")} className="btn btn-brand cut-sm mt-auto w-full !py-5">
          {c.nav.cta}
        </button>
      </div>
    </>
  );
}
