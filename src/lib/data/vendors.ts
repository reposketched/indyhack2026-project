import type { Vendor, VendorMatch } from "@/lib/schemas";

export const MOCK_VENDORS: Vendor[] = [
  {
    _id: "vendor_001",
    name: "Harvest & Hearth Catering",
    category: "catering",
    description: "Farm-to-table catering collective specializing in rustic outdoor events. All dishes use locally-sourced seasonal ingredients with extensive vegetarian and vegan options.",
    specialties: ["Vegetarian", "Vegan", "Farm-to-table", "Outdoor Events", "Buffet", "Live Stations"],
    pricePerHead: 38,
    rating: 4.9,
    reviewCount: 127,
    location: "Indianapolis, IN",
    tags: ["outdoor", "rustic", "vegetarian-friendly", "local", "organic"],
    contactEmail: "hello@harvestandhearth.com",
    website: "https://harvestandhearth.com",
    isShortlisted: true,
    createdAt: "2024-01-15T00:00:00.000Z",
  },
  {
    _id: "vendor_002",
    name: "Verde Kitchen Co.",
    category: "catering",
    description: "100% plant-based catering with Mediterranean and Latin fusion menus. Perfect for health-conscious networking events that want to impress.",
    specialties: ["Vegan", "Plant-based", "Mediterranean", "Latin Fusion", "Grazing Tables"],
    pricePerHead: 42,
    rating: 4.8,
    reviewCount: 89,
    location: "Indianapolis, IN",
    tags: ["vegan", "plant-based", "Mediterranean", "modern"],
    contactEmail: "events@verdekitchen.com",
    isShortlisted: false,
    createdAt: "2024-02-01T00:00:00.000Z",
  },
  {
    _id: "vendor_003",
    name: "Iron & Ember Events",
    category: "venue",
    description: "A stunning 8-acre estate with a restored 1920s barn, sprawling lawns, and a pergola garden. Perfect for rustic outdoor events of 50–500 guests.",
    specialties: ["Outdoor Events", "Barn Venue", "Corporate", "Networking", "Photography-friendly"],
    flatRate: 3200,
    rating: 4.7,
    reviewCount: 54,
    location: "Carmel, IN (15 min from downtown Indy)",
    tags: ["rustic", "outdoor", "barn", "estate", "picturesque"],
    contactEmail: "bookings@meadowbrookestate.com",
    website: "https://meadowbrookestate.com",
    isShortlisted: true,
    createdAt: "2024-01-10T00:00:00.000Z",
  },
  {
    _id: "vendor_004",
    name: "The Canopy Collective",
    category: "venue",
    description: "Urban rooftop and courtyard venue with modular tent systems. Brings a nature-forward aesthetic to the city center with skyline views.",
    specialties: ["Rooftop", "Courtyard", "Urban Outdoor", "Corporate Networking", "Modular Setup"],
    flatRate: 2800,
    rating: 4.6,
    reviewCount: 43,
    location: "Downtown Indianapolis, IN",
    tags: ["urban", "rooftop", "modern-rustic", "city", "views"],
    contactEmail: "events@canopycollective.co",
    isShortlisted: false,
    createdAt: "2024-03-05T00:00:00.000Z",
  },
  {
    _id: "vendor_005",
    name: "Golden Hour Studios",
    category: "photography",
    description: "Event photography and videography duo known for warm, candid storytelling. Drone footage add-on available for outdoor events.",
    specialties: ["Event Photography", "Video", "Drone", "Warm Tone Editing", "Same-day Gallery"],
    flatRate: 1800,
    rating: 4.9,
    reviewCount: 212,
    location: "Indianapolis, IN",
    tags: ["photography", "drone", "warm-aesthetic", "storytelling"],
    isShortlisted: true,
    createdAt: "2024-01-20T00:00:00.000Z",
  },
  {
    _id: "vendor_006",
    name: "Nomad Sound & Stage",
    category: "entertainment",
    description: "Full-service AV and live music production. Specializes in background jazz and acoustic sets for networking events. Includes wireless mic systems and ambient lighting.",
    specialties: ["Live Music", "AV Production", "Ambient Lighting", "Acoustic Sets", "Wireless Systems"],
    flatRate: 2400,
    rating: 4.7,
    reviewCount: 78,
    location: "Indianapolis, IN",
    tags: ["music", "AV", "ambiance", "networking", "acoustic"],
    isShortlisted: false,
    createdAt: "2024-02-15T00:00:00.000Z",
  },
  {
    _id: "vendor_007",
    name: "Roots & Stems Florals",
    category: "decor",
    description: "Botanical design studio creating immersive nature-forward event spaces. Known for wildflower installations, living walls, and sustainable zero-waste decor.",
    specialties: ["Floral Design", "Living Walls", "Wildflowers", "Sustainable Decor", "Installations"],
    flatRate: 950,
    rating: 4.8,
    reviewCount: 96,
    location: "Broad Ripple, Indianapolis, IN",
    tags: ["floral", "botanical", "rustic", "sustainable", "wildflowers"],
    isShortlisted: true,
    createdAt: "2024-01-25T00:00:00.000Z",
  },
  {
    _id: "vendor_008",
    name: "Craft & Ceremony Rentals",
    category: "decor",
    description: "Premium event rental company specializing in vintage and rustic furniture, Edison string lights, wooden signage, and farm tables.",
    specialties: ["Furniture Rental", "Edison Lights", "Farm Tables", "Vintage Props", "Signage"],
    flatRate: 1400,
    rating: 4.6,
    reviewCount: 61,
    location: "Indianapolis, IN",
    tags: ["rentals", "vintage", "rustic", "string-lights", "farm-tables"],
    isShortlisted: false,
    createdAt: "2024-03-01T00:00:00.000Z",
  },
  {
    _id: "vendor_009",
    name: "Apex Event Staffing",
    category: "staffing",
    description: "Professional event staffing agency providing trained servers, bartenders, registration staff, and event coordinators. 200+ staff available for same-day requests.",
    specialties: ["Servers", "Bartenders", "Registration", "Coordinators", "Security"],
    flatRate: 1600,
    rating: 4.5,
    reviewCount: 134,
    location: "Indianapolis, IN",
    tags: ["staffing", "professional", "event-staff", "bartenders"],
    isShortlisted: false,
    createdAt: "2024-01-05T00:00:00.000Z",
  },
  {
    _id: "vendor_010",
    name: "The Traveling Barista",
    category: "catering",
    description: "Mobile specialty coffee bar offering single-origin pour-overs, espresso drinks, and seasonal mocktails. Perfect conversation starter for networking events.",
    specialties: ["Specialty Coffee", "Espresso", "Mocktails", "Mobile Bar", "Single-origin"],
    pricePerHead: 12,
    rating: 4.9,
    reviewCount: 187,
    location: "Indianapolis, IN",
    tags: ["coffee", "mobile", "beverages", "networking", "specialty"],
    isShortlisted: true,
    createdAt: "2024-02-10T00:00:00.000Z",
  },
  {
    _id: "vendor_011",
    name: "Solstice Market Collective",
    category: "catering",
    description: "Artisan food market setup with multiple station concepts: cheese boards, charcuterie, fresh flatbreads, and seasonal salad bars.",
    specialties: ["Grazing Tables", "Cheese Boards", "Charcuterie", "Flatbread", "Market Style"],
    pricePerHead: 28,
    rating: 4.7,
    reviewCount: 72,
    location: "Carmel, IN",
    tags: ["grazing", "artisan", "market-style", "social", "vegetarian"],
    isShortlisted: false,
    createdAt: "2024-03-10T00:00:00.000Z",
  },
  {
    _id: "vendor_012",
    name: "Prism Event Technology",
    category: "technology",
    description: "Event tech provider specializing in digital check-in, badge printing, networking apps, and live audience engagement tools.",
    specialties: ["Digital Check-in", "Badge Printing", "Networking Apps", "Live Polls", "QR Scanning"],
    flatRate: 800,
    rating: 4.6,
    reviewCount: 49,
    location: "Indianapolis, IN",
    tags: ["technology", "check-in", "digital", "engagement", "QR"],
    isShortlisted: false,
    createdAt: "2024-02-20T00:00:00.000Z",
  },
  {
    _id: "vendor_013",
    name: "WildRoot Photography",
    category: "photography",
    description: "Nature-inspired event photography with a documentary style. Specializes in outdoor corporate events with fast 48-hour delivery guarantee.",
    specialties: ["Outdoor Events", "Documentary Style", "Corporate", "Fast Delivery", "Portraits"],
    flatRate: 1400,
    rating: 4.7,
    reviewCount: 88,
    location: "Fishers, IN",
    tags: ["photography", "outdoor", "documentary", "corporate"],
    isShortlisted: false,
    createdAt: "2024-01-30T00:00:00.000Z",
  },
  {
    _id: "vendor_014",
    name: "Canopy & Stars Tent Rentals",
    category: "decor",
    description: "Premium tent and canopy rental for outdoor events. Options from market umbrellas to 40×80ft frame tents with sidewalls and climate control.",
    specialties: ["Tent Rental", "Frame Tents", "Market Umbrellas", "Climate Control", "Sidewalls"],
    flatRate: 1800,
    rating: 4.5,
    reviewCount: 56,
    location: "Indianapolis, IN",
    tags: ["tent", "canopy", "outdoor", "weather-protection", "large-events"],
    isShortlisted: false,
    createdAt: "2024-02-25T00:00:00.000Z",
  },
  {
    _id: "vendor_015",
    name: "Terrain Landscape Events",
    category: "venue",
    description: "Garden nursery that moonlights as an enchanting event venue. Acres of lush greenhouses, outdoor terraces, and a meadow for up to 300 guests.",
    specialties: ["Greenhouse", "Garden", "Terraces", "Meadow", "Natural Lighting"],
    flatRate: 2400,
    rating: 4.8,
    reviewCount: 67,
    location: "Zionsville, IN",
    tags: ["garden", "greenhouse", "nature", "outdoor", "whimsical"],
    isShortlisted: false,
    createdAt: "2024-03-15T00:00:00.000Z",
  },
];

export function getMockVendorMatches(query: string): VendorMatch[] {
  const keywords = query.toLowerCase().split(/\s+/);

  const scored = MOCK_VENDORS.map((vendor) => {
    const text = [
      vendor.name,
      vendor.description,
      vendor.category,
      ...vendor.specialties,
      ...vendor.tags,
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    keywords.forEach((kw) => {
      if (text.includes(kw)) score += 0.15;
    });

    // Boost for category matches
    if (query.toLowerCase().includes(vendor.category)) score += 0.25;

    // Base relevance from rating
    score += vendor.rating / 5 * 0.3;

    // Shortlisted boost
    if (vendor.isShortlisted) score += 0.1;

    score = Math.min(score, 0.99);

    const guestCount = 200;
    const estimatedTotal =
      vendor.pricePerHead
        ? vendor.pricePerHead * guestCount
        : vendor.flatRate || 0;

    const reasonings: Record<string, string> = {
      catering: `Strong match for vegetarian-friendly catering with ${vendor.specialties.slice(0, 2).join(" and ")} specialties. At $${vendor.pricePerHead}/head, fits within the per-person budget envelope.`,
      venue: `${vendor.specialties.includes("Outdoor Events") ? "Outdoor-ready venue" : "Flexible venue"} with capacity for 200+ guests. ${vendor.location.includes("downtown") ? "Central location reduces transportation friction." : "Scenic setting aligns with rustic outdoor theme."}`,
      photography: `Event documentation with ${vendor.specialties[0]} style. ${vendor.specialties.includes("Drone") ? "Drone coverage adds cinematic aerial perspective." : "Fast delivery ensures post-event content is ready quickly."}`,
      entertainment: `Acoustic and ambient sound setup ideal for networking environments — background enough to create atmosphere without hindering conversation.`,
      decor: `${vendor.specialties[0]} design aesthetic directly matches the rustic outdoor theme brief. Sustainable materials add a values-aligned dimension.`,
      staffing: `Trained professional staff with ${vendor.reviewCount}+ verified bookings. Flexible headcount scales to 200-guest events without issue.`,
      technology: `Digital check-in and QR integration ready — pairs cleanly with Solana NFT ticket architecture for seamless gate experience.`,
    };

    return {
      ...vendor,
      relevanceScore: score,
      aiReasoning: reasonings[vendor.category] || `High relevance based on ${vendor.specialties.slice(0, 2).join(", ")} capabilities.`,
      estimatedTotal,
    } as VendorMatch;
  });

  return scored
    .filter((v) => v.relevanceScore > 0.3)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);
}
