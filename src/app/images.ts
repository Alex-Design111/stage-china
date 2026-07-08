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
  "automotive-launch": {
    preview: "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1400&h=900&fit=crop&auto=format",
    ],
  },
  "fashion-popup": {
    preview: "https://images.unsplash.com/photo-1762028892701-692dc360db08?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1762028892701-692dc360db08?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1441986300351-dda4d4dbf6b0?w=1400&h=900&fit=crop&auto=format",
    ],
  },
  "executive-forum": {
    preview: "https://images.unsplash.com/photo-1510511233900-1982d92bd835?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1510511233900-1982d92bd835?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1400&h=900&fit=crop&auto=format",
    ],
  },
  "luxury-retail": {
    preview: "https://images.unsplash.com/photo-1608494604059-7971195e13e1?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1608494604059-7971195e13e1?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1536459935869-836ea697b5e2?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1400&h=900&fit=crop&auto=format",
    ],
  },
  "industry-summit": {
    preview: "https://images.unsplash.com/photo-1773405286291-d470befc09d6?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1773405286291-d470befc09d6?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1400&h=900&fit=crop&auto=format",
    ],
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
  about: "https://images.unsplash.com/photo-1706074797611-a02f9ed06439?w=900&h=1200&fit=crop&auto=format",
  contact: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop&auto=format",
  svc: [
    "https://images.unsplash.com/photo-1560439514-4e9645039924?w=1400&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=1400&h=1000&fit=crop&auto=format",
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
