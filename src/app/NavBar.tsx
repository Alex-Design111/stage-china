import { Menu, X } from "lucide-react";
import type { Lang, Page, ContentType } from "./content";
import { serif } from "./ui";

interface NavBarProps {
  c: ContentType;
  lang: Lang;
  setLang: (l: Lang) => void;
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  page: Page;
  goto: (id: string) => void;
  goPage: (p: Page) => void;
}

export function NavBar({ c, lang, setLang, scrolled, menuOpen, setMenuOpen, page, goto, goPage }: NavBarProps) {
  const navLinks: [string, string, Page | null][] = [
    ["home",      c.nav.home,      null],
    ["booths",    c.nav.booths,    "expo"],
    ["events",    c.nav.events,    "events"],
    ["portfolio", c.nav.portfolio, "portfolio"],
    ["contacts",  c.nav.contacts,  null],
  ];

  const navBg = scrolled ? "rgba(248,247,243,0.92)" : "rgba(248,247,243,0.72)";
  const navShadow = scrolled ? "0 1px 0 rgba(12,11,9,0.07)" : "none";

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{ backgroundColor: navBg, backdropFilter: "blur(14px)", boxShadow: navShadow }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6" style={{ height: "72px" }}>

          {/* Logo */}
          <button onClick={() => goPage("home")} className="flex flex-col leading-none shrink-0 text-left">
            <span className="text-[22px] tracking-[-0.01em]"
              style={{ fontFamily: serif, fontWeight: 600, color: "var(--foreground)" }}>
              Stagency
            </span>
            <span className="text-[8px] tracking-[0.2em] uppercase whitespace-nowrap mt-0.5"
              style={{ color: "var(--muted-foreground)" }}>by New Imagination · DMC China</span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(([id, label, target]) => (
              <button key={id} onClick={() => target ? goPage(target) : goto(id)}
                className="text-[13px] transition-opacity hover:opacity-50 whitespace-nowrap"
                style={{ color: "var(--foreground)" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Lang switcher + CTA */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] tracking-[0.22em]">
              {(["en", "ru"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center gap-1.5">
                  {i > 0 && <span style={{ color: "var(--border)" }}>|</span>}
                  <button onClick={() => setLang(l)} className="uppercase transition-opacity px-0.5"
                    style={{ color: "var(--foreground)", opacity: lang === l ? 1 : 0.32, fontWeight: lang === l ? 600 : 400 }}>
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
            <button onClick={() => goto("contacts")}
              className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.16em] uppercase font-semibold text-white transition-all duration-300 hover:shadow-md whitespace-nowrap"
              style={{ background: "var(--gradient-warm)", boxShadow: "0 6px 18px -8px rgba(185,40,25,0.5)" }}>
              {c.nav.cta}
            </button>
          </div>

          <button className="lg:hidden p-1.5" onClick={() => setMenuOpen(true)}
            style={{ color: "var(--foreground)" }}>
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className="fixed inset-0 z-[100] flex flex-col p-8 pt-7 transition-opacity duration-300"
        style={{ backgroundColor: "var(--foreground)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col leading-none">
            <span className="text-[22px]" style={{ fontFamily: serif, fontWeight: 600, color: "var(--background)" }}>Stagency</span>
            <span className="text-[8px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(248,247,243,0.4)" }}>by New Imagination · DMC China</span>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ color: "var(--background)" }}><X size={22} /></button>
        </div>

        <nav className="flex flex-col gap-6">
          {navLinks.map(([id, label, target]) => (
            <button key={id} onClick={() => { target ? goPage(target) : goto(id); }}
              className="text-left text-2xl font-light transition-opacity hover:opacity-60"
              style={{ fontFamily: serif, color: "var(--background)" }}>
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-5 pt-10">
          <div className="flex items-center gap-4">
            {(["en", "ru"] as Lang[]).map((l, i) => (
              <span key={l} className="flex items-center gap-4">
                {i > 0 && <span className="text-[11px]" style={{ color: "rgba(248,247,243,0.2)" }}>|</span>}
                <button onClick={() => setLang(l)} className="text-[11px] tracking-[0.22em] uppercase transition-opacity"
                  style={{ color: "var(--background)", opacity: lang === l ? 1 : 0.32, fontWeight: lang === l ? 600 : 400 }}>
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <button onClick={() => goto("contacts")} className="block w-full py-4 rounded-full text-[11px] tracking-[0.2em] uppercase font-semibold text-white"
            style={{ background: "var(--gradient-warm)" }}>
            {c.nav.cta}
          </button>
        </div>
      </div>
    </>
  );
}
