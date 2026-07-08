// ── Project gallery images ────────────────────────────────
// Each project has a preview (first image) and full gallery
const projectGalleries = {
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
  // ── Events (EV image sets) ──────────────────────────────
  "ev1": {
    preview: "/assets/EV1_1.jpg",
    gallery: ["/assets/EV1_1.jpg", "/assets/EV1_2.jpg"],
  },
  "ev2": {
    preview: "/assets/EV2_1.jpg",
    gallery: ["/assets/EV2_1.jpg", "/assets/EV2_2.jpg"],
  },
  "ev3": {
    preview: "/assets/EV3_1.jpg",
    gallery: ["/assets/EV3_1.jpg", "/assets/EV3_2.jpg", "/assets/EV3_3.jpg"],
  },
  "ev5": {
    preview: "/assets/EV5_1.jpg",
    gallery: ["/assets/EV5_1.jpg", "/assets/EV5_2.jpg", "/assets/EV5_3.jpg"],
  },
  "ev6": {
    preview: "/assets/EV6_1.jpg",
    gallery: ["/assets/EV6_1.jpg", "/assets/EV6_2.jpg"],
  },
};

// ── Hero background videos (Pexels License — free for commercial use) ──
// Each has a matching poster (the clip's own first frame) for instant paint
// and graceful fallback if the video can't load.
// Self-hosted hero clips (web-optimized H.264 mp4, faststart) with a poster
// extracted from each clip's opening frame so the hero never shows black
// while the video loads.
export const VIDEOS = {
  home:   { src: "/assets/main-hero.mp4",  poster: "/assets/main-hero.jpg" },
  expo:   { src: "/assets/expo-hero.mp4",  poster: "/assets/expo-hero.jpg" },
  events: { src: "/assets/event-hero.mp4", poster: "/assets/event-hero.jpg" },
};

export const IMGS = {
  hero: "https://images.unsplash.com/photo-1769667693219-4d8e44b6a3b3?w=1920&h=1080&fit=crop&auto=format",
  about: "/assets/about-us.jpg",
  contact: "/assets/contact-us.jpg",
  svc: [
    "/assets/main-expo.jpg",
    "/assets/main-events.jpg",
  ],
  subHero: [
    "https://images.unsplash.com/photo-1560439514-4e9645039924?w=1920&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=1920&h=700&fit=crop&auto=format",
  ],
  projects: projectGalleries,
  // Legacy support: flat portfolio array (uses preview image)
  portfolio: Object.values(projectGalleries).map(p => p.preview),
  // Helper to get project gallery by ID
  getProject: (id: string) => projectGalleries[id as keyof typeof projectGalleries],
};
