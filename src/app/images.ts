// ── Project gallery images ────────────────────────────────
// Each project has a preview (first image) and full gallery
type Project = { preview: string; gallery: string[]; video?: string | null; poster?: string };
const projectGalleries: Record<string, Project> = {
  "tech-pavilion": {
    preview: "/assets/MF_1.jpg",
    gallery: [
      "/assets/MF_1.jpg",
      "/assets/MF_2.jpg",
      "/assets/MF_3.jpg",
    ],
  },
  "tech-lounge": {
    preview: "/assets/SC_1.jpg",
    gallery: [
      "/assets/SC_1.jpg",
      "/assets/SC_2.jpg",
      "/assets/SC_3.jpg",
    ],
  },
  "beauty-pavilion": {
    preview: "/assets/F_1.jpg",
    gallery: [
      "/assets/F_1.jpg",
      "/assets/F_2.jpg",
      "/assets/F_3.jpg",
      "/assets/F_4.jpg",
    ],
  },
  "timber-booth": {
    preview: "/assets/TB1.jpg",
    gallery: [
      "/assets/TB1.jpg",
      "/assets/TB2.jpg",
      "/assets/TB3.jpg",
    ],
  },
  // ── Events: video reels (logos blurred, music added) + photo galleries ──
  "great-wall-gala-beijing": {
    preview: "/assets/projects/great-wall-gala-beijing-3.jpg",
    poster: "/assets/projects/great-wall-gala-beijing-poster.jpg",
    video: "/assets/projects/great-wall-gala-beijing.mp4",
    gallery: ["/assets/projects/great-wall-gala-beijing-1.jpg", "/assets/projects/great-wall-gala-beijing-2.jpg", "/assets/projects/great-wall-gala-beijing-3.jpg", "/assets/projects/great-wall-gala-beijing-4.jpg", "/assets/projects/great-wall-gala-beijing-5.jpg", "/assets/projects/great-wall-gala-beijing-6.jpg", "/assets/projects/great-wall-gala-beijing-7.jpg"],
  },
  "wild-dining-yangshuo": {
    preview: "/assets/projects/wild-dining-yangshuo-8.jpg",
    poster: "/assets/projects/wild-dining-yangshuo-poster.jpg",
    video: "/assets/projects/wild-dining-yangshuo.mp4",
    gallery: ["/assets/projects/wild-dining-yangshuo-1.jpg", "/assets/projects/wild-dining-yangshuo-2.jpg", "/assets/projects/wild-dining-yangshuo-3.jpg", "/assets/projects/wild-dining-yangshuo-4.jpg", "/assets/projects/wild-dining-yangshuo-5.jpg", "/assets/projects/wild-dining-yangshuo-6.jpg", "/assets/projects/wild-dining-yangshuo-7.jpg", "/assets/projects/wild-dining-yangshuo-8.jpg", "/assets/projects/wild-dining-yangshuo-9.jpg"],
  },
  "gala-1000-beijing": {
    preview: "/assets/projects/gala-1000-beijing-1.jpg",
    poster: "/assets/projects/gala-1000-beijing-poster.jpg",
    video: "/assets/projects/gala-1000-beijing.mp4",
    gallery: ["/assets/projects/gala-1000-beijing-1.jpg", "/assets/projects/gala-1000-beijing-2.jpg", "/assets/projects/gala-1000-beijing-3.jpg", "/assets/projects/gala-1000-beijing-4.jpg", "/assets/projects/gala-1000-beijing-5.jpg", "/assets/projects/gala-1000-beijing-6.jpg"],
  },
  "conference-250-beijing": {
    preview: "/assets/projects/conference-250-beijing-1.jpg",
    poster: "/assets/projects/conference-250-beijing-poster.jpg",
    video: "/assets/projects/conference-250-beijing.mp4",
    gallery: ["/assets/projects/conference-250-beijing-1.jpg", "/assets/projects/conference-250-beijing-2.jpg", "/assets/projects/conference-250-beijing-3.jpg", "/assets/projects/conference-250-beijing-4.jpg"],
  },
  "skyline-party-beijing": {
    preview: "/assets/projects/skyline-party-beijing-poster.jpg",
    video: "/assets/projects/skyline-party-beijing.mp4",
    gallery: ["/assets/projects/skyline-party-beijing-1.jpg", "/assets/projects/skyline-party-beijing-2.jpg", "/assets/projects/skyline-party-beijing-3.jpg", "/assets/projects/skyline-party-beijing-4.jpg"],
  },
  "gala-400-shanghai": {
    preview: "/assets/projects/gala-400-shanghai-1.jpg",
    video: null,
    gallery: ["/assets/projects/gala-400-shanghai-1.jpg", "/assets/projects/gala-400-shanghai-2.jpg", "/assets/projects/gala-400-shanghai-3.jpg", "/assets/projects/gala-400-shanghai-4.jpg", "/assets/projects/gala-400-shanghai-5.jpg", "/assets/projects/gala-400-shanghai-6.jpg", "/assets/projects/gala-400-shanghai-7.jpg"],
  },
  "conference-1000-beijing": {
    preview: "/assets/projects/conference-1000-beijing-2.jpg",
    poster: "/assets/projects/conference-1000-beijing-poster.jpg",
    video: "/assets/projects/conference-1000-beijing.mp4",
    gallery: ["/assets/projects/conference-1000-beijing-1.jpg", "/assets/projects/conference-1000-beijing-2.jpg", "/assets/projects/conference-1000-beijing-3.jpg", "/assets/projects/conference-1000-beijing-4.jpg"],
  },
  "event-80th-floor-beijing": {
    preview: "/assets/projects/event-80th-floor-beijing-poster.jpg",
    video: "/assets/projects/event-80th-floor-beijing.mp4",
    gallery: ["/assets/projects/event-80th-floor-beijing-1.jpg"],
  },
  "dinner-200-beijing": {
    preview: "/assets/projects/dinner-200-beijing-1.jpg",
    video: null,
    gallery: ["/assets/projects/dinner-200-beijing-1.jpg", "/assets/projects/dinner-200-beijing-2.jpg"],
  },
  "conference-400-shanghai": {
    preview: "/assets/projects/conference-400-shanghai-1.jpg",
    video: null,
    gallery: ["/assets/projects/conference-400-shanghai-1.jpg", "/assets/projects/conference-400-shanghai-2.jpg", "/assets/projects/conference-400-shanghai-3.jpg", "/assets/projects/conference-400-shanghai-4.jpg"],
  },
  "conference-100-shanghai": {
    preview: "/assets/projects/conference-100-shanghai-1.jpg",
    video: null,
    gallery: ["/assets/projects/conference-100-shanghai-1.jpg", "/assets/projects/conference-100-shanghai-2.jpg", "/assets/projects/conference-100-shanghai-3.jpg"],
  },
};

// Self-hosted hero clips (web-optimized H.264 mp4, faststart) with a poster
// extracted from each clip's opening frame so the hero never shows black
// while the video loads.
export const VIDEOS = {
  home:   { src: "/assets/promo-hero.mp4", poster: "/assets/promo-hero.jpg" },
  expo:   { src: "/assets/expo-hero.mp4",  poster: "/assets/expo-hero.jpg" },
  events: { src: "/assets/event-hero.mp4", poster: "/assets/event-hero.jpg" },
};

export const IMGS = {
  projects: projectGalleries,
  getProject: (id: string): Project | undefined => projectGalleries[id],
};
