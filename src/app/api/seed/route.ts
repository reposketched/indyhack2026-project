import { NextResponse } from "next/server";
import { DEMO_EVENT, DEMO_EVENT_MEMORY, DEMO_GUESTS, DEMO_AI_INSIGHTS } from "@/lib/data/events";
import { DEMO_BUDGET_ITEMS, DEMO_TIMELINE_ITEMS } from "@/lib/data/budgets";
import { MOCK_VENDORS } from "@/lib/data/vendors";

export async function GET() {
  // Returns all seed data as JSON for inspection / import
  return NextResponse.json({
    event: DEMO_EVENT,
    eventMemory: DEMO_EVENT_MEMORY,
    guests: DEMO_GUESTS,
    insights: DEMO_AI_INSIGHTS,
    budgetItems: DEMO_BUDGET_ITEMS,
    timelineItems: DEMO_TIMELINE_ITEMS,
    vendors: MOCK_VENDORS,
    meta: {
      totalRecords: 1 + 1 + DEMO_GUESTS.length + DEMO_AI_INSIGHTS.length + DEMO_BUDGET_ITEMS.length + DEMO_TIMELINE_ITEMS.length + MOCK_VENDORS.length,
      collections: ["events", "eventMemory", "guests", "aiInsights", "budgets", "timelineItems", "vendors"],
      exportedAt: new Date().toISOString(),
    },
  });
}
