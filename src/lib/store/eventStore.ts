"use client";

import { create } from "zustand";
import type { Event, EventPlan, ChatMessage, VendorMatch, AIInsight, TimelineItem, BudgetLineItem } from "@/lib/schemas";
import { DEMO_EVENT, DEMO_EVENT_PLAN, DEMO_AI_INSIGHTS } from "@/lib/data/events";
import { DEMO_BUDGET_ITEMS, DEMO_TIMELINE_ITEMS } from "@/lib/data/budgets";
import { generateId } from "@/lib/utils";

export type DemoStep =
  | "idle"
  | "typing"
  | "generating"
  | "plan_ready"
  | "vendors"
  | "conflicts"
  | "minting"
  | "guest_page"
  | "voice"
  | "complete";

interface EventStore {
  // Core event
  event: Event;
  setEvent: (event: Partial<Event>) => void;

  // AI Planner
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateLastMessage: (content: string) => void;
  clearChat: () => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  eventPlan: EventPlan | null;
  setEventPlan: (plan: EventPlan) => void;

  // Vendors
  vendorResults: VendorMatch[];
  setVendorResults: (vendors: VendorMatch[]) => void;
  shortlistedVendors: string[];
  toggleShortlist: (vendorId: string) => void;
  vendorQuery: string;
  setVendorQuery: (q: string) => void;

  // AI Insights
  insights: AIInsight[];
  setInsights: (insights: AIInsight[]) => void;
  resolveInsight: (id: string) => void;

  // Budget
  budgetItems: BudgetLineItem[];
  setBudgetItems: (items: BudgetLineItem[]) => void;

  // Timeline
  timelineItems: TimelineItem[];
  setTimelineItems: (items: TimelineItem[]) => void;
  completeTimelineItem: (id: string) => void;

  // Demo mode
  isDemoMode: boolean;
  demoStep: DemoStep;
  setDemoStep: (step: DemoStep) => void;
  startDemo: () => void;
  resetDemo: () => void;

  // Ticket minting
  mintedTicketAddress: string | null;
  setMintedTicketAddress: (address: string | null) => void;
  isMinting: boolean;
  setIsMinting: (v: boolean) => void;

  // Voice concierge
  voiceTranscript: Array<{ question: string; answer: string; timestamp: string }>;
  addVoiceEntry: (entry: { question: string; answer: string }) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  // Core event
  event: DEMO_EVENT,
  setEvent: (data) => set((s) => ({ event: { ...s.event, ...data } })),

  // AI Planner
  chatMessages: [],
  addChatMessage: (message) =>
    set((s) => ({
      chatMessages: [
        ...s.chatMessages,
        { ...message, id: generateId(), timestamp: new Date().toISOString() },
      ],
    })),
  updateLastMessage: (content) =>
    set((s) => {
      const messages = [...s.chatMessages];
      if (messages.length > 0) {
        messages[messages.length - 1] = { ...messages[messages.length - 1], content, isStreaming: false };
      }
      return { chatMessages: messages };
    }),
  clearChat: () => set({ chatMessages: [] }),
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  eventPlan: null,
  setEventPlan: (plan) => set({ eventPlan: plan }),

  // Vendors
  vendorResults: [],
  setVendorResults: (vendors) => set({ vendorResults: vendors }),
  shortlistedVendors: ["vendor_001", "vendor_003", "vendor_005", "vendor_007", "vendor_010"],
  toggleShortlist: (vendorId) =>
    set((s) => ({
      shortlistedVendors: s.shortlistedVendors.includes(vendorId)
        ? s.shortlistedVendors.filter((id) => id !== vendorId)
        : [...s.shortlistedVendors, vendorId],
    })),
  vendorQuery: "",
  setVendorQuery: (q) => set({ vendorQuery: q }),

  // AI Insights
  insights: DEMO_AI_INSIGHTS,
  setInsights: (insights) => set({ insights }),
  resolveInsight: (id) =>
    set((s) => ({
      insights: s.insights.map((i) =>
        i._id === id ? { ...i, isResolved: true, resolvedAt: new Date().toISOString() } : i
      ),
    })),

  // Budget
  budgetItems: DEMO_BUDGET_ITEMS,
  setBudgetItems: (items) => set({ budgetItems: items }),

  // Timeline
  timelineItems: DEMO_TIMELINE_ITEMS,
  setTimelineItems: (items) => set({ timelineItems: items }),
  completeTimelineItem: (id) =>
    set((s) => ({
      timelineItems: s.timelineItems.map((t) =>
        t._id === id ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t
      ),
    })),

  // Demo mode
  isDemoMode: false,
  demoStep: "idle",
  setDemoStep: (step) => set({ demoStep: step }),
  startDemo: () => set({ isDemoMode: true, demoStep: "typing" }),
  resetDemo: () =>
    set({
      isDemoMode: false,
      demoStep: "idle",
      chatMessages: [],
      eventPlan: null,
      vendorResults: [],
      mintedTicketAddress: null,
      voiceTranscript: [],
    }),

  // Ticket
  mintedTicketAddress: null,
  setMintedTicketAddress: (address) => set({ mintedTicketAddress: address }),
  isMinting: false,
  setIsMinting: (v) => set({ isMinting: v }),

  // Voice
  voiceTranscript: [],
  addVoiceEntry: (entry) =>
    set((s) => ({
      voiceTranscript: [
        ...s.voiceTranscript,
        { ...entry, timestamp: new Date().toISOString() },
      ],
    })),
  selectedVoice: "aria",
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
}));

// Seeded plan for demo mode
export const SEEDED_PLAN = DEMO_EVENT_PLAN;
