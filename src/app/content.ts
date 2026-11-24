export type Page = "home" | "portfolio";

export type CaseItem = {
  id: string;
  title: string;
  sub: string;
  tag: "Event" | "Booth";
  story?: { brief: string; idea: string; result: string; guests?: string };
};

export const C = {
  nav: {
    links: [
      { id: "what-we-do", label: "What we do" },
      { id: "cases", label: "Cases" },
      { id: "services", label: "Services" },
      { id: "who-we-are", label: "Who we are" },
      { id: "contact", label: "Contact" },
    ],
    cta: "Start a project",
  },

  hero: {
    slogan: "WE STAGE YOUR VISION.",
    cta: "Start a project",
    ctaSecondary: "See our cases",
    reel: { ready: true, label: "Watch promo", url: "/assets/stagency-showreel.mp4", poster: "/assets/stagency-showreel.jpg" },
  },

  // PLACEHOLDER — replace with real figures, then set ready: true
  stats: {
    ready: false,
    items: [
      { value: "000+", label: "Events delivered" },
      { value: "00,000+", label: "Guests hosted" },
      { value: "00", label: "Cities across China" },
      { value: "4", label: "Working languages" },
    ],
  },

  whatWeDo: {
    headline: "What we do",
    intro: "Three formats, each one built from scratch for your guests.",
    // shown centred along the bottom of the welcome screen
    heroLine: "Full-service event production in China with seamless DMC support",
    items: [
      {
        title: "Conferences",
        body: "Partner summits and corporate conferences for 50 to 1,000 delegates. Stage, AV, interpretation and delegate logistics in one plan.",
        image: "/assets/projects/conference-400-shanghai-1.jpg",
        alt: "Conference audience under a domed steel roof with blue stage lighting",
      },
      {
        title: "Gala dinners",
        body: "From a table on the Great Wall to a ballroom for 1,000. Décor, show programme, catering and the whole night produced end to end.",
        image: "/assets/projects/gala-400-shanghai-2.jpg",
        alt: "Long candlelit gala tables in a colonnaded hall",
      },
      {
        title: "Events",
        body: "Team activities, cultural experiences, outdoor dinners and brand activations in places your guests won't expect.",
        image: "/assets/projects/wild-dining-yangshuo-6.jpg",
        alt: "Outdoor dinner tables under chandelier arches set among the karst peaks of Yangshuo",
      },
    ],
    extra: {
      title: "Planning something truly outstanding? We'll build it.",
      body: "A launch, a show or a night no one has done before. We'll build it.",
      cta: "Tell us your idea",
    },
    secondary: "We also design and build exhibition stands at China's trade fairs.",
    secondaryLink: "See stand projects",
  },

  whoWeAre: {
    headline: "Event production with a DMC behind it",
    body: [
      "Stagency China is the event production team of New Imagination DMC Group China, a destination management company based in Shanghai.",
      "Traditional DMCs rarely deliver event production to an international standard, while large event companies come with rigid budgets and slow communication. We give foreign corporate clients both: production quality and a flexible, direct team, with full DMC support behind it.",
    ],
    lead: "We're the event production team of New Imagination DMC Group China. Traditional DMCs rarely deliver production to an international standard, while large event companies come with rigid budgets and slow communication. We give foreign corporate clients both: real production quality and a flexible team you talk to directly.",
    // the part of the lead that links to the parent company
    leadLink: "New Imagination DMC Group China",
    advantages: [
      {
        title: "Full DMC support",
        short: "Production and destination management under one roof.",
        body: "Production and destination management under one roof. No hand-offs between agencies, no gaps between the stage and the hotel.",
      },
      {
        title: "We speak your language",
        short: "English, Russian, Italian and Chinese. No middleman.",
        body: "Our team works in English, Russian, Italian and Chinese. Briefs, contracts and show calls happen without a middleman.",
      },
      {
        title: "Direct supplier network",
        short: "Fair prices and short lead times across China.",
        body: "Long-standing relationships with China's AV, staging, décor and production suppliers mean fair prices and short lead times.",
      },
      {
        title: "Every format, every scale",
        short: "From a 40-guest dinner in Hong Kong to 1,000 delegates in Beijing.",
        body: "From an intimate 40-guest dinner in Hong Kong to a 1,000-delegate conference in Beijing, produced with the same care.",
      },
    ],
  },

  audiences: {
    headline: "Who we work with",
    items: [
      {
        title: "Companies",
        body: "Leadership summits, partner conferences, incentive trips and celebrations for companies bringing their people to China.",
      },
      {
        title: "Event agencies",
        body: "A reliable local partner for agencies abroad. We produce your client's event in China and keep you in control at every step.",
      },
      {
        title: "Associations",
        body: "Congresses, member meetings and delegations, with venues, accommodation and delegate logistics handled for you.",
      },
    ],
  },

  process: {
    headline: "How we work",
    intro: "Five steps, one team, no hand-offs.",
    steps: [
      { title: "Brief", body: "We start with your people and your goals, not a template. A call, a brief and the right questions." },
      { title: "Concept", body: "Ideas, venues and a clear budget. You see the event before anything is built." },
      { title: "Production", body: "Stage, AV, décor, artists, hotels and transfers, managed by one team with direct suppliers." },
      { title: "Show day", body: "Our producers run the event on site, from load-in to the last guest leaving." },
      { title: "Wrap-up", body: "Photos, video and a final report. Then we're ready for the next one." },
    ],
  },

  services: {
    headline: "Our services",
    intro: "Everything a live event in China needs, from the first sketch to the last cue.",
    extra: {
      title: "Need something that isn't on the list?",
      body: "If it can be built, booked or brought to China, we'll find a way.",
      cta: "Ask us",
    },
    groups: [
      {
        title: "Planning & consulting",
        intro: "From the right city and date to every approval.",
        items: [
          { name: "Destination and venue consulting" },
          { name: "Date and timing advice" },
          { name: "Venue sourcing and booking" },
          { name: "Permits and approvals" },
          { name: "Event security" },
          { name: "Budget planning and supplier management" },
        ],
      },
      {
        title: "Design & production",
        intro: "Spaces built around your brand and your guests.",
        items: [
          { name: "Event concept and theming" },
          { name: "Scenography and stage design" },
          { name: "3D visualisation" },
          { name: "Build and fabrication" },
          { name: "Venue setup and décor" },
          { name: "Photo zones and welcome areas" },
          { name: "Table setup and floral design" },
          { name: "Event branding and signage" },
          { name: "Gifts and souvenirs" },
        ],
      },
      {
        title: "AV & technical",
        intro: "Sound, light and show technology, with engineers on site.",
        items: [
          { name: "Sound, lighting and video" },
          { name: "LED screens and projection" },
          { name: "Technical planning" },
          { name: "Show control and direction" },
          { name: "Special effects" },
          { name: "Live streaming and hybrid events" },
          { name: "Guest registration system" },
          { name: "Photo, video and aftermovie" },
          { name: "On-site technical support" },
        ],
      },
      {
        title: "Shows & event staff",
        intro: "The people and moments your guests will talk about.",
        items: [
          { name: "Cultural shows and performances" },
          { name: "Bands, live music and DJs" },
          { name: "Robot and hi-tech shows" },
          { name: "Artists and talent booking" },
          { name: "MCs and hosts" },
          { name: "Hostesses and event staff" },
        ],
      },
    ],
  },

  // Each case can get an optional story shown in its gallery:
  //   story: { brief: "...", idea: "...", result: "...", guests: "250" }
  // Until a case has one, the gallery shows a placeholder in dev mode only.
  cases: {
    headline: "Our cases",
    cta: "All cases",
    items: [
      { id: "great-wall-gala-beijing", title: "Great Wall Gala Dinner", sub: "Beijing, 250 guests, 2026", tag: "Event" },
      { id: "wild-dining-yangshuo", title: "Wild Gala Dinner", sub: "Yangshuo, 2025", tag: "Event" },
      { id: "gala-40-hongkong", title: "High-End Gala Dinner with Hong Kong Skyline", sub: "Hong Kong, 40 guests, 2026", tag: "Event" },
      { id: "gala-1000-beijing", title: "Gala Dinner for 1,000", sub: "Beijing, 2026", tag: "Event" },
      { id: "conference-250-beijing", title: "Conference with Laser Show", sub: "Beijing, 250 delegates, 2026", tag: "Event" },
      { id: "skyline-party-beijing", title: "Rooftop Party with Skyline Views", sub: "Beijing, 2026", tag: "Event" },
      { id: "gala-400-shanghai", title: "Gala Dinner in Shanghai Convention Center", sub: "Shanghai, 400 guests, 2025", tag: "Event" },
      { id: "conference-1000-beijing", title: "Conference for 1,000", sub: "Beijing, 2026", tag: "Event" },
      { id: "event-80th-floor-beijing", title: "Party on the 80th Floor", sub: "Beijing, 200 guests, 2026", tag: "Event" },
      { id: "dinner-200-beijing", title: "Themed Dinner", sub: "Beijing, 200 guests, 2026", tag: "Event" },
      { id: "conference-400-shanghai", title: "Conference in 1933 Venue", sub: "Shanghai, 400 delegates, 2025", tag: "Event" },
      { id: "conference-100-shanghai", title: "Partner Conference", sub: "Shanghai, 100 delegates, 2025", tag: "Event" },
      { id: "tech-pavilion", title: "Medical AI Pavilion", sub: "Shanghai, 260 m², 2024", tag: "Booth" },
      { id: "tech-lounge", title: "Tech Company Lounge", sub: "Beijing, 80 m², 2025", tag: "Booth" },
      { id: "timber-booth", title: "Timber Harvesting Booth", sub: "Shanghai, 50 m², 2026", tag: "Booth" },
      { id: "beauty-pavilion", title: "Beauty Brand Pavilion", sub: "Saint Petersburg, 30 m², 2023", tag: "Booth" },
    ] as CaseItem[],
  },

  // PLACEHOLDER — add logo files to /public/assets/clients/ (or sector names if under NDA), then set ready: true
  clients: {
    ready: false,
    headline: "Trusted by",
    logos: [
      { name: "Client 1", src: "" },
      { name: "Client 2", src: "" },
      { name: "Client 3", src: "" },
      { name: "Client 4", src: "" },
      { name: "Client 5", src: "" },
      { name: "Client 6", src: "" },
    ],
  },

  // PLACEHOLDER — add photos to /public/assets/team/ and real names, then set ready: true
  team: {
    ready: false,
    headline: "The people on site",
    intro: "You'll work directly with the people who run your event.",
    members: [
      { name: "Name Surname", role: "CEO", languages: "English, Russian, Chinese", photo: "" },
      { name: "Name Surname", role: "Head of production", languages: "English, Chinese", photo: "" },
      { name: "Name Surname", role: "Senior producer", languages: "English, Italian", photo: "" },
      { name: "Name Surname", role: "DMC manager", languages: "English, Russian", photo: "" },
    ],
  },

  portfolioPage: {
    back: "Home",
    headline: "Our cases",
    sub: "Gala dinners, conferences, activities and exhibition stands delivered for international clients.",
    filters: { all: "All", event: "Events", booth: "Exhibition stands" },
  },

  ending: {
    headline: "Let's stage\nyour vision.",
    sub: "Tell us the city, the date and how many guests you expect. We'll come back with ideas and a budget.",
    cta: "stagency@newimaginationdmc.com",
    ctaLabel: "Write to us",
    mailto: "mailto:stagency@newimaginationdmc.com?subject=" + encodeURIComponent("Event in China") + "&body=" + encodeURIComponent("Hello Stagency team,\n\nCity:\nDates:\nNumber of guests:\nFormat (gala dinner, conference, event...):\n\nAbout the event:\n"),
    photo: "/assets/projects/wild-dining-yangshuo-1.jpg",
    photoAlt: "Long tables under chandeliers at dusk among Yangshuo's karst mountains",
    contacts: [
      { label: "Email", value: "stagency@newimaginationdmc.com", href: "mailto:stagency@newimaginationdmc.com?subject=Project%20inquiry" },
      { label: "Phone", value: "+86 130 7415 6537", href: "tel:+8613074156537" },
      { label: "Telegram", value: "+7 937 523 30 37", href: "https://t.me/+79375233037" },
      { label: "Office", value: "Room 3422, 34th Floor, Block A, Zhongyi Building, 580 Nanjing West Road, Jing'an District, Shanghai" },
    ],
  },

  newImaginationUrl: "https://www.newimaginationdmc.com",

  footer: {
    tagline: "We stage your vision.",
    socials: {
      ready: true,
      links: [
        { name: "Instagram", url: "https://www.instagram.com/stagencychina/" },
        { name: "LinkedIn", url: "https://www.linkedin.com/company/stagencychina/" },
      ],
    },
    dmc: "Part of New Imagination DMC Group China",
    legal: "© 2026 Stagency China by New Imagination DMC Group China. All rights reserved.",
  },
};

export type ContentType = typeof C;
