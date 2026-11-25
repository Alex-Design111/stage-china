// Every address the site answers on, plus the title/description each one ships with.
// Used by the app in the browser and by the build-time prerender (scripts/prerender.mjs).
import { C, type Page } from "./content";
import { IMGS } from "./images";
import { CASE_STORIES } from "./caseStories";

export const SITE_ORIGIN = "https://stagencychina.com";

export type Route = { page: Page; caseId: string | null };

export const casePath = (id: string) => `/cases/${id}`;

export function parsePath(pathname: string): Route {
  const p = pathname.replace(/\/+$/, "").replace(/\.html$/, "") || "/";
  const m = p.match(/^\/cases\/([a-z0-9-]+)$/);
  if (m && C.cases.items.some((i) => i.id === m[1])) return { page: "case", caseId: m[1] };
  if (p === "/portfolio" || p === "/cases") return { page: "portfolio", caseId: null };
  return { page: "home", caseId: null };
}

export function routePath(r: Route): string {
  if (r.page === "case" && r.caseId) return casePath(r.caseId);
  return r.page === "portfolio" ? "/portfolio" : "/";
}

export type Seo = { title: string; description: string; path: string; image: string };

const DEFAULT_IMAGE = `${SITE_ORIGIN}/assets/og-image.jpg`;

export function seoFor(r: Route): Seo {
  if (r.page === "case" && r.caseId) {
    const item = C.cases.items.find((i) => i.id === r.caseId)!;
    const story = CASE_STORIES[item.id];
    const preview = IMGS.getProject(item.id)?.preview;
    const lead = story ? story.overview[0] : `${item.title}, ${item.sub}.`;
    return {
      title: `${item.title}, ${item.sub.split(",")[0]} | Stagency China`,
      description: lead.length > 158 ? lead.slice(0, 155).replace(/\s+\S*$/, "") + "…" : lead,
      path: casePath(item.id),
      image: preview ? SITE_ORIGIN + preview : DEFAULT_IMAGE,
    };
  }
  if (r.page === "portfolio") {
    return {
      title: "Event Cases in China: Gala Dinners & Conferences | Stagency",
      description: "Gala dinners, conferences and events we produced in Beijing, Shanghai, Hong Kong and Yangshuo for international companies. Photos and videos.",
      path: "/portfolio",
      image: DEFAULT_IMAGE,
    };
  }
  return {
    title: "Event Production in China: Galas & Conferences | Stagency",
    description: "Event production in China for international companies: gala dinners, conferences and events with full DMC support. Tell us your city, dates and guests.",
    path: "/",
    image: DEFAULT_IMAGE,
  };
}

// All pages the build writes out as finished HTML
export const ALL_ROUTES: Route[] = [
  { page: "home", caseId: null },
  { page: "portfolio", caseId: null },
  ...C.cases.items.map((i) => ({ page: "case" as Page, caseId: i.id })),
];
