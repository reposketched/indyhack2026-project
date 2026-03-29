import type { BudgetLineItem, TimelineItem } from "@/lib/schemas";

export const DEMO_BUDGET_ITEMS: BudgetLineItem[] = [
  { _id: "budget_001", eventId: "event_demo_001", category: "venue", label: "Iron & Ember Events venue rental", projected: 3200, actual: 3200, vendorId: "vendor_003", isPaid: false, dueDate: "2025-08-18", notes: "Includes indoor + outdoor space access. Deposit 50% due Aug 18." },
  { _id: "budget_002", eventId: "event_demo_001", category: "catering", label: "Harvest & Hearth — main catering ($38/head × 200)", projected: 7600, actual: 0, vendorId: "vendor_001", isPaid: false, dueDate: "2025-08-15", notes: "30% deposit ($2,280) due Aug 15. Balance 7 days before event." },
  { _id: "budget_003", eventId: "event_demo_001", category: "catering", label: "The Traveling Barista — coffee & beverage bar", projected: 2400, actual: 0, vendorId: "vendor_010", isPaid: false, dueDate: "2025-09-06", notes: "Flat rate includes setup, barista, and all supplies." },
  { _id: "budget_004", eventId: "event_demo_001", category: "decor", label: "Roots & Stems Florals — wildflower installations", projected: 950, actual: 950, vendorId: "vendor_007", isPaid: true, notes: "Paid upfront for floral design and day-of setup." },
  { _id: "budget_005", eventId: "event_demo_001", category: "photography", label: "Golden Hour Studios — photography + video", projected: 1800, actual: 0, vendorId: "vendor_005", isPaid: false, dueDate: "2025-09-13", notes: "Includes drone footage and same-day social gallery." },
  { _id: "budget_006", eventId: "event_demo_001", category: "entertainment", label: "Nomad Sound & Stage — acoustic AV package", projected: 2400, actual: 0, vendorId: "vendor_006", isPaid: false, dueDate: "2025-09-13", notes: "Ambient acoustic trio + full PA system + wireless mics." },
  { _id: "budget_007", eventId: "event_demo_001", category: "staffing", label: "Apex Event Staffing — 12-person team", projected: 1600, actual: 0, vendorId: "vendor_009", isPaid: false, dueDate: "2025-09-17", notes: "8 servers, 2 bartenders, 2 registration staff." },
  { _id: "budget_008", eventId: "event_demo_001", category: "ticketing", label: "Solana NFT ticket minting (200 tickets)", projected: 120, actual: 0, isPaid: false, notes: "Devnet transaction fees + metadata hosting." },
  { _id: "budget_009", eventId: "event_demo_001", category: "marketing", label: "Event microsite + digital collateral", projected: 200, actual: 200, isPaid: true, notes: "Design and hosting included in tech platform." },
  { _id: "budget_010", eventId: "event_demo_001", category: "contingency", label: "Contingency reserve", projected: 300, actual: 0, isPaid: false, notes: "For day-of surprises. Currently underfunded — recommend $800." },
];

export const BUDGET_TOTAL = 8000;
export const BUDGET_PROJECTED = DEMO_BUDGET_ITEMS.reduce((sum, item) => sum + item.projected, 0);
export const BUDGET_ACTUAL = DEMO_BUDGET_ITEMS.reduce((sum, item) => sum + item.actual, 0);

export const CATEGORY_COLORS: Record<string, string> = {
  venue: "#2563eb",
  catering: "#059669",
  decor: "#d97706",
  photography: "#7c3aed",
  entertainment: "#db2777",
  staffing: "#0891b2",
  ticketing: "#0d9488",
  marketing: "#65a30d",
  technology: "#4f46e5",
  contingency: "#9ca3af",
  other: "#6b7280",
};

export const MONTHLY_SPEND_DATA = [
  { month: "Jul", projected: 1150, actual: 0 },
  { month: "Aug", projected: 5950, actual: 4350 },
  { month: "Sep", projected: 5920, actual: 0 },
];

export const DEMO_TIMELINE_ITEMS: TimelineItem[] = [
  { _id: "tl_001", eventId: "event_demo_001", title: "Kickoff planning session with Gemini AI", description: "Initial event parameters defined. Theme, budget, and core requirements locked in.", type: "milestone", status: "completed", dueDate: "2025-07-15", completedAt: "2025-07-15", priority: "high", order: 1 },
  { _id: "tl_002", eventId: "event_demo_001", title: "Venue shortlist finalized", description: "Iron & Ember Events selected as primary venue. Backup: Terrain Landscape Events.", type: "milestone", status: "completed", dueDate: "2025-07-22", completedAt: "2025-07-22", priority: "high", order: 2 },
  { _id: "tl_003", eventId: "event_demo_001", title: "Vendor contracts sent for signature", description: "Harvest & Hearth, Golden Hour Studios, Nomad Sound & Stage, Apex Event Staffing.", type: "milestone", status: "completed", dueDate: "2025-07-30", completedAt: "2025-08-01", priority: "high", order: 3 },
  { _id: "tl_004", eventId: "event_demo_001", title: "Catering deposit due — Harvest & Hearth", description: "30% deposit: $2,280. Non-refundable after payment.", type: "deposit", status: "pending", dueDate: "2025-08-15", priority: "critical", vendorId: "vendor_001", linkedBudgetId: "budget_002", order: 4 },
  { _id: "tl_005", eventId: "event_demo_001", title: "Venue contract signing — Iron & Ember Events", description: "50% deposit required at signing: $1,600.", type: "deadline", status: "pending", dueDate: "2025-08-18", priority: "critical", vendorId: "vendor_003", linkedBudgetId: "budget_001", order: 5 },
  { _id: "tl_006", eventId: "event_demo_001", title: "RSVP cutoff — guest list finalized", description: "Final headcount communicated to caterer within 48 hours.", type: "deadline", status: "pending", dueDate: "2025-09-03", priority: "high", order: 6 },
  { _id: "tl_007", eventId: "event_demo_001", title: "NFT ticket minting for all confirmed guests", description: "Mint 200 Solana NFT tickets on devnet. Send QR codes to attendees.", type: "task", status: "pending", dueDate: "2025-09-06", priority: "medium", order: 7 },
  { _id: "tl_008", eventId: "event_demo_001", title: "Dietary preference survey deadline", description: "All confirmed guests must complete meal preference form.", type: "deadline", status: "in_progress", dueDate: "2025-09-08", priority: "medium", order: 8 },
  { _id: "tl_009", eventId: "event_demo_001", title: "Photography brief with Golden Hour Studios", description: "Share shot list, timeline, and special moments to capture.", type: "task", status: "pending", dueDate: "2025-09-10", priority: "medium", vendorId: "vendor_005", order: 9 },
  { _id: "tl_010", eventId: "event_demo_001", title: "Final vendor balance payments", description: "Settle all outstanding vendor balances. Retain receipts for each.", type: "deadline", status: "pending", dueDate: "2025-09-13", priority: "high", order: 10 },
  { _id: "tl_011", eventId: "event_demo_001", title: "Site walk-through at Iron & Ember Events", description: "Confirm setup zones, power access, parking, and contingency spaces.", type: "task", status: "pending", dueDate: "2025-09-15", priority: "high", vendorId: "vendor_003", order: 11 },
  { _id: "tl_012", eventId: "event_demo_001", title: "Guest communication: pre-event email", description: "Send final logistics, parking instructions, and QR code reminder.", type: "task", status: "pending", dueDate: "2025-09-17", priority: "medium", order: 12 },
  { _id: "tl_013", eventId: "event_demo_001", title: "Vendor setup & load-in", type: "runofshow", status: "pending", dueDate: "2025-09-20", description: "All vendors on-site by 3:00 PM. Final AV and lighting check.", priority: "high", order: 13 },
  { _id: "tl_014", eventId: "event_demo_001", title: "EVENT DAY: Roots & Reach Autumn Summit", type: "runofshow", status: "pending", dueDate: "2025-09-20", description: "5:00 PM – 10:00 PM. All systems go.", priority: "critical", order: 14 },
  { _id: "tl_015", eventId: "event_demo_001", title: "Post-event: attendee survey + analytics", type: "task", status: "pending", dueDate: "2025-09-22", description: "Send satisfaction survey and review ElevenLabs concierge session logs.", priority: "low", order: 15 },
];
