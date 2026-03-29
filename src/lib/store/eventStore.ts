"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Event, EventPlan, ChatMessage, VendorMatch, AIInsight, TimelineItem, BudgetLineItem, Guest } from "@/lib/schemas";
import { DEMO_EVENT, DEMO_EVENT_PLAN, DEMO_AI_INSIGHTS, DEMO_GUESTS } from "@/lib/data/events";
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

// ─── Team types ───────────────────────────────────────────────────────────────

export type TeamRole = "owner" | "co-organizer" | "volunteer" | "viewer";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: TeamRole;
  status: "active" | "pending";
  joinedAt: string;
}

export interface EventTask {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
}

// ─── Store interface ─────────────────────────────────────────────────────────

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

  // Guests
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  addGuest: (guest: Omit<Guest, "_id" | "createdAt">) => void;

  // Team
  teamMembers: TeamMember[];
  addTeamMember: (email: string, role: TeamRole, currentUserName: string) => void;
  removeTeamMember: (id: string) => void;
  updateMemberRole: (id: string, role: TeamRole) => void;

  // Tasks
  tasks: EventTask[];
  addTask: (task: Omit<EventTask, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<EventTask>) => void;
  deleteTask: (id: string) => void;

  // Welcome / start gate
  hasStarted: boolean;
  startWithDemo: () => void;
  startFresh: (eventData: Partial<Event>, ownerName?: string, ownerEmail?: string) => void;

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

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
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
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content,
              isStreaming: false,
            };
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

      // Guests
      guests: DEMO_GUESTS,
      setGuests: (guests) => set({ guests }),
      addGuest: (guest) =>
        set((s) => ({
          guests: [
            ...s.guests,
            { ...guest, _id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      // Team
      teamMembers: [],
      addTeamMember: (email, role, currentUserName) => {
        const existing = get().teamMembers.find(
          (m) => m.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) return;
        const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        set((s) => ({
          teamMembers: [
            ...s.teamMembers,
            {
              id: generateId(),
              name,
              email: email.toLowerCase().trim(),
              initials,
              role,
              status: "pending",
              joinedAt: new Date().toISOString(),
            },
          ],
        }));
      },
      removeTeamMember: (id) =>
        set((s) => ({ teamMembers: s.teamMembers.filter((m) => m.id !== id) })),
      updateMemberRole: (id, role) =>
        set((s) => ({
          teamMembers: s.teamMembers.map((m) => (m.id === id ? { ...m, role } : m)),
        })),

      // Tasks
      tasks: [],
      addTask: (task) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { ...task, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),
      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      // Welcome / start gate
      hasStarted: false,
      startWithDemo: () =>
        set({
          hasStarted: true,
          isDemoMode: true,
          event: DEMO_EVENT,
          insights: DEMO_AI_INSIGHTS,
          budgetItems: DEMO_BUDGET_ITEMS,
          timelineItems: DEMO_TIMELINE_ITEMS,
          guests: DEMO_GUESTS,
          shortlistedVendors: ["vendor_001", "vendor_003", "vendor_005", "vendor_007", "vendor_010"],
          chatMessages: [],
          eventPlan: null,
          vendorResults: [],
          mintedTicketAddress: null,
          voiceTranscript: [],
          teamMembers: [],
          tasks: [],
        }),

      startFresh: (eventData, ownerName, ownerEmail) => {
        const ownerMember: TeamMember | null =
          ownerName && ownerEmail
            ? {
                id: generateId(),
                name: ownerName,
                email: ownerEmail,
                initials: ownerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
                role: "owner",
                status: "active",
                joinedAt: new Date().toISOString(),
              }
            : null;

        set({
          hasStarted: true,
          isDemoMode: false,
          event: {
            _id: generateId(),
            slug:
              eventData.name
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "") ?? "my-event",
            name: eventData.name ?? "My Event",
            description: "",
            theme: "",
            status: "planning",
            date: eventData.date ?? new Date().toISOString(),
            location: eventData.location ?? { name: "", address: "", city: "", state: "" },
            guestCount: eventData.guestCount ?? 0,
            confirmedGuests: 0,
            budget: eventData.budget ?? 0,
            organizerId: "user_001",
            tags: [],
            accentColor: "#2563eb",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          chatMessages: [],
          eventPlan: null,
          vendorResults: [],
          shortlistedVendors: [],
          budgetItems: [],
          timelineItems: [],
          insights: [],
          guests: [],
          mintedTicketAddress: null,
          voiceTranscript: [],
          teamMembers: ownerMember ? [ownerMember] : [],
          tasks: [],
        });
      },

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
    }),
    {
      name: "complanion_event",
      // Don't persist generating/streaming states
      partialize: (state) => ({
        event: state.event,
        eventPlan: state.eventPlan,
        chatMessages: state.chatMessages,
        vendorResults: state.vendorResults,
        shortlistedVendors: state.shortlistedVendors,
        vendorQuery: state.vendorQuery,
        insights: state.insights,
        budgetItems: state.budgetItems,
        timelineItems: state.timelineItems,
        guests: state.guests,
        teamMembers: state.teamMembers,
        tasks: state.tasks,
        hasStarted: state.hasStarted,
        isDemoMode: state.isDemoMode,
        mintedTicketAddress: state.mintedTicketAddress,
        voiceTranscript: state.voiceTranscript,
        selectedVoice: state.selectedVoice,
        demoStep: state.demoStep,
      }),
    }
  )
);

// Seeded plan for demo mode
export const SEEDED_PLAN = DEMO_EVENT_PLAN;
