import { z } from "zod";

// ─── User ────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.enum(["organizer", "admin", "guest"]).default("organizer"),
  createdAt: z.string().datetime().optional(),
});
export type User = z.infer<typeof UserSchema>;

// ─── Event ───────────────────────────────────────────────────────────────────

export const EventStatusSchema = z.enum(["draft", "planning", "confirmed", "live", "completed", "cancelled"]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const EventSchema = z.object({
  _id: z.string().optional(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  theme: z.string(),
  status: EventStatusSchema.default("planning"),
  date: z.string(),
  endDate: z.string().optional(),
  location: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    parkingInfo: z.string().optional(),
  }),
  guestCount: z.number(),
  confirmedGuests: z.number().default(0),
  budget: z.number(),
  organizerId: z.string(),
  tags: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  accentColor: z.string().default("#2563eb"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Event = z.infer<typeof EventSchema>;

// ─── Event Memory (persistent AI context) ────────────────────────────────────

export const EventMemorySchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  context: z.string(),
  decisions: z.array(z.object({
    timestamp: z.string(),
    decision: z.string(),
    reasoning: z.string(),
    madeBy: z.enum(["ai", "organizer"]),
  })).default([]),
  preferences: z.record(z.string(), z.string()).default({}),
  constraints: z.array(z.string()).default([]),
  lastSyncedAt: z.string().datetime().optional(),
});
export type EventMemory = z.infer<typeof EventMemorySchema>;

// ─── Vendor ──────────────────────────────────────────────────────────────────

export const VendorCategorySchema = z.enum([
  "catering", "venue", "photography", "entertainment", "decor",
  "staffing", "transportation", "technology", "printing", "security"
]);
export type VendorCategory = z.infer<typeof VendorCategorySchema>;

export const VendorSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  category: VendorCategorySchema,
  description: z.string(),
  specialties: z.array(z.string()),
  pricePerHead: z.number().optional(),
  flatRate: z.number().optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  location: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
  // For vector search — embedding stored in Atlas
  embeddingVector: z.array(z.number()).optional(),
  isShortlisted: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
});
export type Vendor = z.infer<typeof VendorSchema>;

export const VendorMatchSchema = VendorSchema.extend({
  relevanceScore: z.number().min(0).max(1),
  aiReasoning: z.string(),
  estimatedTotal: z.number(),
});
export type VendorMatch = z.infer<typeof VendorMatchSchema>;

// ─── Guest ───────────────────────────────────────────────────────────────────

export const GuestSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  name: z.string(),
  email: z.string().email(),
  company: z.string().optional(),
  title: z.string().optional(),
  rsvpStatus: z.enum(["invited", "confirmed", "declined", "waitlisted"]).default("invited"),
  mealPreference: z.enum(["vegetarian", "vegan", "omnivore", "gluten-free", "halal", "kosher"]).optional(),
  dietaryRestrictions: z.array(z.string()).default([]),
  accessTier: z.enum(["general", "vip", "speaker", "staff"]).default("general"),
  ticketId: z.string().optional(),
  checkedIn: z.boolean().default(false),
  checkInTime: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});
export type Guest = z.infer<typeof GuestSchema>;

// ─── Ticket ──────────────────────────────────────────────────────────────────

export const TicketSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  guestId: z.string(),
  mintAddress: z.string().optional(),
  tokenId: z.string().optional(),
  network: z.enum(["devnet", "mainnet"]).default("devnet"),
  tier: z.enum(["general", "vip", "speaker", "staff"]),
  status: z.enum(["pending", "minted", "transferred", "burned"]).default("pending"),
  metadata: z.object({
    attendeeName: z.string(),
    eventName: z.string(),
    eventDate: z.string(),
    mealPreference: z.string().optional(),
    accessLevel: z.string(),
    proofOfAttendance: z.boolean().default(false),
    perks: z.array(z.string()).default([]),
  }),
  qrCode: z.string().optional(),
  mintedAt: z.string().datetime().optional(),
  txSignature: z.string().optional(),
});
export type Ticket = z.infer<typeof TicketSchema>;

// ─── Budget ──────────────────────────────────────────────────────────────────

export const BudgetCategorySchema = z.enum([
  "venue", "catering", "decor", "entertainment", "staffing",
  "ticketing", "marketing", "technology", "contingency", "photography", "other"
]);
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

export const BudgetLineItemSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  category: BudgetCategorySchema,
  label: z.string(),
  projected: z.number(),
  actual: z.number().default(0),
  vendorId: z.string().optional(),
  notes: z.string().optional(),
  isPaid: z.boolean().optional().default(false),
  dueDate: z.string().optional(),
});
export type BudgetLineItem = z.infer<typeof BudgetLineItemSchema>;

// ─── Timeline Item ────────────────────────────────────────────────────────────

export const TimelineItemSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["milestone", "deadline", "task", "deposit", "runofshow"]),
  status: z.enum(["pending", "in_progress", "completed", "overdue", "skipped"]).default("pending"),
  dueDate: z.string(),
  completedAt: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  vendorId: z.string().optional(),
  linkedBudgetId: z.string().optional(),
  order: z.number().default(0),
});
export type TimelineItem = z.infer<typeof TimelineItemSchema>;

// ─── AI Insight ───────────────────────────────────────────────────────────────

export const AIInsightSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  type: z.enum(["conflict", "suggestion", "warning", "opportunity", "info"]),
  title: z.string(),
  body: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  isResolved: z.boolean().default(false),
  resolvedAt: z.string().optional(),
  relatedItems: z.array(z.string()).default([]),
  generatedAt: z.string().datetime(),
  source: z.enum(["gemini", "system", "manual"]).default("gemini"),
});
export type AIInsight = z.infer<typeof AIInsightSchema>;

// ─── Voice Log ────────────────────────────────────────────────────────────────

export const VoiceLogSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  guestId: z.string().optional(),
  sessionId: z.string(),
  question: z.string(),
  response: z.string(),
  audioUrl: z.string().optional(),
  voice: z.string().default("aria"),
  durationMs: z.number().optional(),
  createdAt: z.string().datetime(),
});
export type VoiceLog = z.infer<typeof VoiceLogSchema>;

// ─── Escrow Milestone ─────────────────────────────────────────────────────────

export const EscrowMilestoneSchema = z.object({
  _id: z.string().optional(),
  eventId: z.string(),
  vendorId: z.string(),
  title: z.string(),
  amount: z.number(),
  currency: z.enum(["SOL", "USDC"]).default("USDC"),
  status: z.enum(["pending", "funded", "released", "disputed", "refunded"]).default("pending"),
  condition: z.string(),
  dueDate: z.string(),
  txSignature: z.string().optional(),
  releasedAt: z.string().optional(),
});
export type EscrowMilestone = z.infer<typeof EscrowMilestoneSchema>;

// ─── Chat Message ─────────────────────────────────────────────────────────────

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string(),
  isStreaming: z.boolean().optional(),
  planData: z.record(z.string(), z.unknown()).optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ─── Full Event Plan ──────────────────────────────────────────────────────────

export const EventPlanSchema = z.object({
  theme: z.string(),
  guestCount: z.number(),
  date: z.string(),
  time: z.string(),
  duration: z.string(),
  venuePreferences: z.string(),
  cateringStyle: z.string(),
  dietaryNotes: z.string(),
  budget: z.number(),
  staffingNeeds: z.string(),
  schedule: z.array(z.object({
    time: z.string(),
    activity: z.string(),
    duration: z.string(),
  })),
  risks: z.array(z.object({
    risk: z.string(),
    mitigation: z.string(),
    severity: z.enum(["low", "medium", "high"]),
  })),
  nextActions: z.array(z.string()),
  aiSummary: z.string(),
});
export type EventPlan = z.infer<typeof EventPlanSchema>;
