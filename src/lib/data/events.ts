import type { Event, EventMemory, Guest, AIInsight, EventPlan } from "@/lib/schemas";

export const DEMO_EVENT: Event = {
  _id: "event_demo_001",
  slug: "rustic-networking-sept-2025",
  name: "Roots & Reach: Autumn Networking Summit",
  description:
    "A curated outdoor networking experience for 200 tech and creative professionals. Set against the backdrop of the Indiana countryside, this rustic-modern gathering pairs meaningful conversations with farm-fresh flavors and warm ambient atmosphere.",
  theme: "Rustic Outdoor Networking",
  status: "planning",
  date: "2026-09-20T17:00:00.000Z",
  endDate: "2026-09-20T22:00:00.000Z",
  location: {
    name: "Iron & Ember Events",
    address: "12120 Brookshire Pkwy",
    city: "Carmel",
    state: "IN",
    coordinates: { lat: 39.9738, lng: -86.1258 },
    parkingInfo:
      "Free parking available in the main lot and overflow lots on-site. Rideshare drop-off at the main entrance on Brookshire Pkwy. Bike racks available near the entrance.",
  },
  guestCount: 200,
  confirmedGuests: 147,
  budget: 8000,
  organizerId: "user_001",
  tags: ["networking", "outdoor", "rustic", "tech", "vegetarian-friendly"],
  accentColor: "#2563eb",
  heroImage: "/hero-event.jpg",
  createdAt: "2025-07-15T10:00:00.000Z",
  updatedAt: "2025-08-02T14:30:00.000Z",
};

export const DEMO_EVENT_MEMORY: EventMemory = {
  _id: "memory_demo_001",
  eventId: "event_demo_001",
  context:
    "Rustic outdoor networking event for 200 tech and creative professionals in Carmel, IN. September 20, 2025. Budget $8,000. Organizer specifically requested: vegetarian-friendly catering, warm Google-level aesthetic, outdoor setting with natural elements. Confirmed venue: Iron & Ember Events. Preferred vendor palette: Harvest & Hearth (catering), Roots & Stems (decor), Golden Hour Studios (photography).",
  decisions: [
    {
      timestamp: "2025-07-15T10:30:00.000Z",
      decision: "Venue selection: Iron & Ember Events over The Canopy Collective",
      reasoning:
        "Iron & Ember provides the authentic rustic outdoor setting the organizer specified. The indoor/outdoor combination allows for separate networking zones. Canopy Collective, while central, felt too urban for the warmth requested.",
      madeBy: "organizer",
    },
    {
      timestamp: "2025-07-20T14:00:00.000Z",
      decision: "Catering approach: hybrid buffet + food station model with Harvest & Hearth",
      reasoning:
        "AI flagged that a traditional sit-down dinner would reduce networking flow. Station-based catering encourages movement, chance encounters, and extended conversations — better ROI for a networking-focused event.",
      madeBy: "ai",
    },
    {
      timestamp: "2025-07-28T09:15:00.000Z",
      decision: "Add specialty coffee bar (The Traveling Barista) as separate line item",
      reasoning:
        "Coffee bar creates a natural gathering point during the networking hour. Adds perceived value for $2,400 additional cost, well within contingency budget.",
      madeBy: "ai",
    },
    {
      timestamp: "2025-08-01T11:00:00.000Z",
      decision: "Shift start time from 6PM to 5PM",
      reasoning:
        "Golden hour photography window (6:30–7:30PM) is most valuable for venue and guest experience. Earlier start allows an additional networking hour before the natural light show.",
      madeBy: "organizer",
    },
  ],
  preferences: {
    aesthetic: "rustic-warm-modern",
    catering: "vegetarian-forward, station-based",
    vibe: "professional but relaxed",
    photography: "documentary, candid over posed",
    music: "ambient acoustic, no DJ",
  },
  constraints: [
    "Budget hard cap: $8,000",
    "Venue must be outdoor or primarily outdoor",
    "All catering must accommodate vegetarian guests (70%+ of expected attendees)",
    "No alcohol service after 9PM (venue license requirement)",
    "Rain contingency plan required — event date in September",
  ],
  lastSyncedAt: "2025-08-02T14:30:00.000Z",
};

export const DEMO_GUESTS: Guest[] = [
  { _id: "guest_001", eventId: "event_demo_001", name: "Maya Chen", email: "maya.chen@techventures.com", company: "TechVentures VC", title: "Partner", rsvpStatus: "confirmed", mealPreference: "vegetarian", dietaryRestrictions: [], accessTier: "vip", ticketId: "ticket_001", checkedIn: false, createdAt: "2025-08-01T00:00:00.000Z" },
  { _id: "guest_002", eventId: "event_demo_001", name: "Jordan Reyes", email: "j.reyes@crescendostudio.io", company: "Crescendo Studio", title: "Founder & CEO", rsvpStatus: "confirmed", mealPreference: "vegan", dietaryRestrictions: ["gluten-free"], accessTier: "speaker", ticketId: "ticket_002", checkedIn: false, createdAt: "2025-08-01T00:00:00.000Z" },
  { _id: "guest_003", eventId: "event_demo_001", name: "Alex Patel", email: "apatel@bloomanalytix.com", company: "Bloom Analytics", title: "Head of Growth", rsvpStatus: "confirmed", mealPreference: "omnivore", dietaryRestrictions: [], accessTier: "general", checkedIn: false, createdAt: "2025-08-02T00:00:00.000Z" },
  { _id: "guest_004", eventId: "event_demo_001", name: "Sam Whitfield", email: "sam@openloop.dev", company: "OpenLoop", title: "CTO", rsvpStatus: "confirmed", mealPreference: "vegetarian", dietaryRestrictions: [], accessTier: "general", checkedIn: false, createdAt: "2025-08-02T00:00:00.000Z" },
  { _id: "guest_005", eventId: "event_demo_001", name: "Priya Nair", email: "priya@clearwave.io", company: "Clearwave", title: "Product Lead", rsvpStatus: "confirmed", mealPreference: "vegan", dietaryRestrictions: ["nut-allergy"], accessTier: "general", checkedIn: false, createdAt: "2025-08-03T00:00:00.000Z" },
  { _id: "guest_006", eventId: "event_demo_001", name: "Ethan Burke", email: "ethan.burke@inkwelldesign.co", company: "Inkwell Design", title: "Creative Director", rsvpStatus: "confirmed", mealPreference: "omnivore", dietaryRestrictions: [], accessTier: "general", checkedIn: false, createdAt: "2025-08-03T00:00:00.000Z" },
  { _id: "guest_007", eventId: "event_demo_001", name: "Leila Santos", email: "leila@axiomhealth.co", company: "Axiom Health", title: "COO", rsvpStatus: "declined", mealPreference: "vegetarian", dietaryRestrictions: [], accessTier: "general", checkedIn: false, createdAt: "2025-08-04T00:00:00.000Z" },
  { _id: "guest_008", eventId: "event_demo_001", name: "Marcus Webb", email: "mwebb@stratosphereco.com", company: "Stratosphere Co", title: "Investor", rsvpStatus: "confirmed", mealPreference: "omnivore", dietaryRestrictions: [], accessTier: "vip", checkedIn: false, createdAt: "2025-08-04T00:00:00.000Z" },
];

export const DEMO_AI_INSIGHTS: AIInsight[] = [
  {
    _id: "insight_001",
    eventId: "event_demo_001",
    type: "conflict",
    title: "Catering deposit deadline conflicts with venue contract signing",
    body: "Harvest & Hearth requires a 30% deposit by August 15th, but your venue contract with Iron & Ember Events isn't finalized until August 18th. If the venue falls through, you'll lose $2,280 in non-refundable catering deposit. Recommend negotiating a 5-day extension with Harvest & Hearth or finalizing venue by August 12th.",
    severity: "high",
    isResolved: false,
    relatedItems: ["vendor_001", "vendor_003", "timeline_003"],
    generatedAt: "2025-08-02T14:30:00.000Z",
    source: "gemini",
  },
  {
    _id: "insight_002",
    eventId: "event_demo_001",
    type: "warning",
    title: "Budget is 96% allocated — no room for day-of surprises",
    body: "Current vendor commitments total $7,700 against an $8,000 budget, leaving only $300 (3.75%) as contingency. Industry standard is 10–15%. An unexpected cost — rain tent rental, additional staff, or vendor no-show — could blow the budget. Consider trimming decor by $400 to create a healthier buffer.",
    severity: "high",
    isResolved: false,
    relatedItems: ["budget_001"],
    generatedAt: "2025-08-02T14:31:00.000Z",
    source: "gemini",
  },
  {
    _id: "insight_003",
    eventId: "event_demo_001",
    type: "suggestion",
    title: "Add a rain contingency vendor to ops checklist",
    body: "September 20th has a 28% historical rain probability for central Indiana. Canopy & Stars Tent Rentals can provide a 40×80ft frame tent for $1,800 on 2-week notice. Adding this as a contingency contract (with cancellation clause) would be low-risk insurance. Alternatively, Meadowbrook's barn can accommodate 140 guests if needed.",
    severity: "medium",
    isResolved: false,
    relatedItems: ["vendor_014", "vendor_003"],
    generatedAt: "2025-08-02T14:32:00.000Z",
    source: "gemini",
  },
  {
    _id: "insight_004",
    eventId: "event_demo_001",
    type: "opportunity",
    title: "Early RSVP momentum suggests 180+ attendance — prep for overflow",
    body: "147 confirmed guests with 3 weeks remaining before the RSVP deadline. If current conversion rate continues, you'll reach 185–200 attendees. Harvest & Hearth has capacity to scale to 225, but Apex Staffing will need 2 additional servers (est. +$280) and parking coordination should be flagged to the venue.",
    severity: "low",
    isResolved: false,
    relatedItems: ["guest_001", "vendor_009"],
    generatedAt: "2025-08-02T14:33:00.000Z",
    source: "gemini",
  },
  {
    _id: "insight_005",
    eventId: "event_demo_001",
    type: "info",
    title: "Nut allergy flagged for 1 confirmed guest",
    body: "Guest Priya Nair (Clearwave) has a nut allergy. Harvest & Hearth has been notified in your vendor notes, but confirm with them directly that cross-contamination protocols are in place. Consider a labeled 'allergen-free zone' at the grazing station.",
    severity: "medium",
    isResolved: true,
    resolvedAt: "2025-08-03T10:00:00.000Z",
    relatedItems: ["guest_005", "vendor_001"],
    generatedAt: "2025-08-02T14:34:00.000Z",
    source: "gemini",
  },
];

export const DEMO_EVENT_PLAN: EventPlan = {
  theme: "Rustic Outdoor Networking — warm, professional, nature-forward",
  guestCount: 200,
  date: "September 20, 2025",
  time: "5:00 PM",
  duration: "5 hours",
  venuePreferences: "Outdoor estate or garden with covered areas. Must have natural lighting, parking for 200+, and an aesthetic that photographs warmly.",
  cateringStyle: "Station-based grazing — farm tables with rotating stations to encourage movement and conversation",
  dietaryNotes: "Minimum 60% vegetarian options across all stations. One fully vegan station. Allergen labeling required. Nut-free preparation zone.",
  budget: 8000,
  staffingNeeds: "8 servers, 2 bartenders (mocktail only until 9PM), 1 event coordinator, 2 registration staff",
  schedule: [
    { time: "5:00 PM", activity: "Guest arrival & registration — lawn welcome area", duration: "30 min" },
    { time: "5:30 PM", activity: "Open networking — coffee bar + appetizer stations open", duration: "60 min" },
    { time: "6:30 PM", activity: "Golden hour photography window — curated attendee portraits", duration: "60 min" },
    { time: "7:00 PM", activity: "Main food stations open — all-venue networking continues", duration: "90 min" },
    { time: "8:30 PM", activity: "Featured speaker: 'Building in the Open' — 20-min fireside", duration: "30 min" },
    { time: "9:00 PM", activity: "Final networking + dessert stations", duration: "60 min" },
    { time: "10:00 PM", activity: "Event close — coordinated departure", duration: "30 min" },
  ],
  risks: [
    { risk: "Rain on September 20th", mitigation: "Iron & Ember's indoor space accommodates 140 guests as primary backup. Canopy & Stars tent rental on standby.", severity: "medium" },
    { risk: "Budget overrun", mitigation: "Trim decor line by $400 to create 8.75% contingency buffer.", severity: "high" },
    { risk: "Catering deposit deadline conflict", mitigation: "Negotiate 5-day extension with Harvest & Hearth or accelerate venue contract signing.", severity: "high" },
    { risk: "Guest count exceeds 200", mitigation: "Harvest & Hearth scales to 225. Alert Apex Staffing 10 days out for headcount adjustment.", severity: "low" },
  ],
  nextActions: [
    "Sign venue contract with Iron & Ember Events by August 12th",
    "Confirm catering deposit extension with Harvest & Hearth",
    "Add contingency tent rental as optional line item",
    "Send dietary preference survey to all confirmed guests",
    "Schedule photography brief with Golden Hour Studios",
    "Finalize parking and shuttle logistics with venue",
  ],
  aiSummary:
    "This is a well-structured event with strong vendor alignment and real momentum in RSVPs. The core risk is a timing conflict between catering deposit and venue contract deadlines — resolving this in the next 10 days will unlock the rest of the planning track. Budget is tight at 96% allocation; a modest decor reallocation creates breathing room. Overall confidence in event success: High.",
};
