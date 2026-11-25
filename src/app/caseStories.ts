// Case page text. Written from the photos and basic facts, ready to be replaced with
// real stories (brief, client sector, numbers, quote) as they become available.
export type CaseStory = {
  format: string;
  overview: string[];
  scope: string[];
  services: string[];
};

export const CASE_STORIES: Record<string, CaseStory> = {
  "great-wall-gala-beijing": {
    format: "Gala dinner",
    overview: [
      "A private gala dinner at the foot of a Great Wall gate tower, produced for an international corporate group visiting Beijing.",
      "We turned the historic setting into a full show venue: a clear-roof marquee facing the tower, Chinese festive décor, a stage with LED screens and a programme of traditional performances through the night.",
    ],
    scope: [
      "Venue sourcing and permits for a heritage site",
      "Clear-roof marquee, stage and seating for 250 guests",
      "Sound, lighting and LED screens",
      "Chinese festive décor: lanterns, dragons and table design",
      "Dragon dance, cultural shows and MC",
    ],
    services: ["Permits and approvals", "Scenography and stage design", "Sound, lighting and video", "Cultural shows and performances"],
  },
  "wild-dining-yangshuo": {
    format: "Outdoor gala dinner",
    overview: [
      "A long-table dinner on an open lawn among the karst peaks of Yangshuo, near Guilin.",
      "We built the whole venue from scratch outdoors: chandelier arches over the tables, floral styling, power and lighting for the evening, and local performers in traditional costume.",
    ],
    scope: [
      "Outdoor venue sourcing and local approvals",
      "Chandelier arches, long tables and floral design",
      "Power, lighting and sound for an open-air site",
      "Local cultural performances",
      "Catering coordination and on-site staff",
    ],
    services: ["Destination and venue consulting", "Venue setup and décor", "Table setup and floral design", "Cultural shows and performances"],
  },
  "gala-40-hongkong": {
    format: "Private gala dinner",
    overview: [
      "An intimate high-end dinner for 40 guests on a rooftop terrace facing the Hong Kong skyline.",
      "The evening combined a cocktail reception with traditional performances, fine-dining service and a table setting designed around the view.",
    ],
    scope: [
      "Rooftop venue sourcing and booking",
      "Table design and terrace décor",
      "Live cultural performances",
      "Service staff and hostesses",
      "Lighting for the evening programme",
    ],
    services: ["Venue sourcing and booking", "Table setup and floral design", "Cultural shows and performances", "Hostesses and event staff"],
  },
  "gala-1000-beijing": {
    format: "Gala dinner",
    overview: [
      "A themed gala dinner for 1,000 guests in a Beijing hotel ballroom.",
      "Red lanterns, giant fans and a wide LED stage set the scene for a full evening show, with stage, lighting and screens built to work for every table in the room.",
    ],
    scope: [
      "Concept and theming for 1,000 guests",
      "Stage, LED screens and show lighting",
      "Ballroom décor: lanterns, fans and table design",
      "Show programme and show control",
      "Technical crew on site",
    ],
    services: ["Event concept and theming", "Scenography and stage design", "LED screens and projection", "Show control and direction"],
  },
  "conference-250-beijing": {
    format: "Conference",
    overview: [
      "A conference for 250 delegates in Beijing that opened with a laser show.",
      "We produced the stage, lighting and screens for the business sessions and the opening moment, with a technical team running the show from start to finish.",
    ],
    scope: [
      "Stage design and build",
      "Laser and beam lighting show",
      "Sound, LED screens and presentation playback",
      "Show control during sessions",
      "Event branding and signage",
    ],
    services: ["Scenography and stage design", "Special effects", "Sound, lighting and video", "Show control and direction"],
  },
  "skyline-party-beijing": {
    format: "Party",
    overview: [
      "An evening party on a Beijing rooftop with views across the city skyline.",
      "A kinetic light installation became the centrepiece, with music, lighting and a dance floor built for a high-energy night.",
    ],
    scope: [
      "Rooftop venue booking",
      "Kinetic light installation",
      "DJ, sound and party lighting",
      "Bar and lounge set-up",
      "Event staff",
    ],
    services: ["Venue sourcing and booking", "Special effects", "Bands, live music and DJs", "Venue setup and décor"],
  },
  "gala-400-shanghai": {
    format: "Gala dinner",
    overview: [
      "A gala dinner for 400 guests at the Shanghai Convention Center.",
      "Long candlelit tables, chandeliers and warm architectural lighting gave the colonnaded hall a classic, elegant atmosphere for the evening programme.",
    ],
    scope: [
      "Venue booking and floor plan",
      "Long-table layout and table design",
      "Architectural and ambient lighting",
      "Photo zone and welcome area",
      "Entertainment and evening programme",
    ],
    services: ["Venue sourcing and booking", "Table setup and floral design", "Photo zones and welcome areas", "Sound, lighting and video"],
  },
  "conference-1000-beijing": {
    format: "Conference",
    overview: [
      "A large-scale corporate conference for 1,000 delegates in Beijing.",
      "We delivered a wide stage with LED screens, broadcast-style lighting and a technical team running a full day of plenary sessions.",
    ],
    scope: [
      "Stage design and build for a 1,000-seat hall",
      "LED screens, sound and lighting",
      "Show control and session management",
      "Event branding and signage",
      "Guest registration and staff",
    ],
    services: ["Scenography and stage design", "LED screens and projection", "Show control and direction", "Guest registration system"],
  },
  "event-80th-floor-beijing": {
    format: "Evening event",
    overview: [
      "An evening event for 200 guests on the 80th floor of a Beijing tower, high above the city lights.",
      "The programme mixed a reception, entertainment and music, with lighting designed to keep the panoramic view at the heart of the night.",
    ],
    scope: [
      "High-rise venue booking",
      "Lighting and sound",
      "Entertainment programme",
      "Décor and lounge areas",
      "Photo and video coverage",
    ],
    services: ["Venue sourcing and booking", "Sound, lighting and video", "Artists and talent booking", "Photo, video and aftermovie"],
  },
  "dinner-200-beijing": {
    format: "Themed dinner",
    overview: [
      "A themed dinner for 200 guests in Beijing.",
      "We designed the room around a single theme, from the welcome area to the table settings, stage and entertainment.",
    ],
    scope: [
      "Concept and theming",
      "Venue décor and table design",
      "Stage, sound and lighting",
      "Entertainment and MC",
      "Event staff",
    ],
    services: ["Event concept and theming", "Venue setup and décor", "Table setup and floral design", "MCs and hosts"],
  },
  "conference-400-shanghai": {
    format: "Conference",
    overview: [
      "A conference for 400 delegates at 1933 Shanghai, a landmark Art Deco venue.",
      "The venue's dome and steel structure were lit as part of the stage design, with screens, sound and staging fitted into a historic building.",
    ],
    scope: [
      "Venue booking at a heritage building",
      "Stage, screens and sound",
      "Architectural lighting of the dome",
      "Seating and delegate flow",
      "Technical crew on site",
    ],
    services: ["Venue sourcing and booking", "Scenography and stage design", "Sound, lighting and video", "On-site technical support"],
  },
  "conference-100-shanghai": {
    format: "Partner conference",
    overview: [
      "A partner conference for 100 delegates in Shanghai.",
      "We produced a fully branded room: stage and screen, floor graphics, seating and printed materials, with technical support throughout the sessions.",
    ],
    scope: [
      "Stage and screen set-up",
      "Room branding, floor graphics and signage",
      "Sound and presentation playback",
      "Seating and delegate materials",
      "On-site technical support",
    ],
    services: ["Event branding and signage", "Sound, lighting and video", "On-site technical support", "Hostesses and event staff"],
  },
  "tech-pavilion": {
    format: "Exhibition stand",
    overview: [
      "A 260 m² pavilion for a medical AI company at a Shanghai exhibition.",
      "We designed and built an open, technology-led space with demo areas, meeting zones and integrated screens.",
    ],
    scope: ["Stand concept and 3D visualisation", "Build and fabrication", "Screens and lighting", "Meeting and demo areas"],
    services: ["Exhibition stands", "3D visualisation", "Build and fabrication", "LED screens and projection"],
  },
  "tech-lounge": {
    format: "Exhibition stand",
    overview: [
      "An 80 m² lounge stand for a technology company in Beijing.",
      "A hospitality-focused space for client meetings, combining brand graphics, lighting and comfortable lounge furniture.",
    ],
    scope: ["Stand concept and 3D visualisation", "Build and fabrication", "Lounge furniture and lighting", "Brand graphics"],
    services: ["Exhibition stands", "3D visualisation", "Build and fabrication", "Event branding and signage"],
  },
  "timber-booth": {
    format: "Exhibition stand",
    overview: [
      "A 50 m² stand for a timber harvesting equipment brand in Shanghai.",
      "A compact stand built around the product, with clear brand graphics and space for demonstrations and conversations.",
    ],
    scope: ["Stand concept and 3D visualisation", "Build and fabrication", "Graphics and lighting", "Product display"],
    services: ["Exhibition stands", "3D visualisation", "Build and fabrication", "Event branding and signage"],
  },
};
