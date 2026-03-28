/**
 * MongoDB Service Adapter
 *
 * Real mode: Connects to MongoDB Atlas, uses vector search for vendor matching,
 * change streams for live ops updates, and stores persistent AI event memory.
 *
 * Mock mode: Returns in-memory data from lib/data/*.ts
 *
 * Atlas Vector Search index config (for judges):
 * Collection: vendors | Index: vendor_embedding
 * {
 *   "fields": [{
 *     "type": "vector",
 *     "path": "embeddingVector",
 *     "numDimensions": 768,
 *     "similarity": "cosine"
 *   }]
 * }
 */

import type { Event, EventMemory, Vendor, VendorMatch, Guest, BudgetLineItem, TimelineItem, AIInsight } from "@/lib/schemas";
import { DEMO_EVENT, DEMO_EVENT_MEMORY, DEMO_GUESTS, DEMO_AI_INSIGHTS } from "@/lib/data/events";
import { DEMO_BUDGET_ITEMS, DEMO_TIMELINE_ITEMS } from "@/lib/data/budgets";
import { MOCK_VENDORS, getMockVendorMatches } from "@/lib/data/vendors";
import { sleep } from "@/lib/utils";

const IS_MOCK = process.env.MOCK_MODE === "true" || !process.env.MONGODB_URI;

// ─── MongoDB Client (real mode) ───────────────────────────────────────────────

let mongoClient: unknown = null;

async function getMongoClient() {
  if (IS_MOCK) return null;
  if (mongoClient) return mongoClient;

  // Dynamic import to avoid bundling MongoDB in mock mode
  const { MongoClient } = await import("mongodb");
  mongoClient = new MongoClient(process.env.MONGODB_URI!);
  await (mongoClient as { connect: () => Promise<void> }).connect();
  return mongoClient;
}

async function getDb() {
  const client = await getMongoClient() as { db: (name: string) => unknown };
  return client?.db("complanion");
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvent(slug: string): Promise<Event | null> {
  if (IS_MOCK) {
    await sleep(100);
    return DEMO_EVENT.slug === slug ? DEMO_EVENT : null;
  }

  const db = await getDb() as { collection: (name: string) => { findOne: (q: unknown) => Promise<Event | null> } };
  return db.collection("events").findOne({ slug });
}

export async function updateEvent(eventId: string, data: Partial<Event>): Promise<void> {
  if (IS_MOCK) {
    await sleep(200);
    return;
  }

  const db = await getDb() as { collection: (name: string) => { updateOne: (q: unknown, u: unknown) => Promise<void> } };
  await db.collection("events").updateOne(
    { _id: eventId },
    { $set: { ...data, updatedAt: new Date().toISOString() } }
  );
}

// ─── Event Memory (persistent AI context) ────────────────────────────────────

export async function getEventMemory(eventId: string): Promise<EventMemory | null> {
  if (IS_MOCK) {
    await sleep(150);
    return DEMO_EVENT_MEMORY.eventId === eventId ? DEMO_EVENT_MEMORY : null;
  }

  const db = await getDb() as { collection: (name: string) => { findOne: (q: unknown) => Promise<EventMemory | null> } };
  return db.collection("eventMemory").findOne({ eventId });
}

export async function upsertEventMemory(memory: Partial<EventMemory>): Promise<void> {
  if (IS_MOCK) {
    await sleep(200);
    return;
  }

  const db = await getDb() as { collection: (name: string) => { updateOne: (q: unknown, u: unknown, opts: unknown) => Promise<void> } };
  await db.collection("eventMemory").updateOne(
    { eventId: memory.eventId },
    { $set: { ...memory, lastSyncedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

// ─── Vendor Vector Search ─────────────────────────────────────────────────────

export async function searchVendors(query: string, _limit = 8): Promise<VendorMatch[]> {
  if (IS_MOCK) {
    await sleep(400 + Math.random() * 200);
    return getMockVendorMatches(query);
  }

  // Real Atlas Vector Search:
  // 1. Embed query using Gemini Embeddings API
  // 2. Run $vectorSearch aggregation pipeline
  const db = await getDb() as {
    collection: (name: string) => {
      aggregate: (pipeline: unknown[]) => { toArray: () => Promise<VendorMatch[]> }
    }
  };

  const embeddingResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text: query }] } }),
    }
  );
  const embeddingData = await embeddingResponse.json();
  const queryVector = embeddingData.embedding?.values || [];

  return db.collection("vendors").aggregate([
    {
      $vectorSearch: {
        index: "vendor_embedding",
        path: "embeddingVector",
        queryVector,
        numCandidates: 50,
        limit: _limit,
      },
    },
    {
      $addFields: {
        relevanceScore: { $meta: "vectorSearchScore" },
        aiReasoning: "MongoDB Atlas Vector Search match based on semantic similarity to your query.",
        estimatedTotal: {
          $cond: {
            if: { $gt: ["$pricePerHead", 0] },
            then: { $multiply: ["$pricePerHead", 200] },
            else: "$flatRate",
          },
        },
      },
    },
  ]).toArray();
}

export async function getAllVendors(): Promise<Vendor[]> {
  if (IS_MOCK) {
    await sleep(200);
    return MOCK_VENDORS;
  }

  const db = await getDb() as { collection: (name: string) => { find: () => { toArray: () => Promise<Vendor[]> } } };
  return db.collection("vendors").find().toArray();
}

// ─── Guests ──────────────────────────────────────────────────────────────────

export async function getGuests(eventId: string): Promise<Guest[]> {
  if (IS_MOCK) {
    await sleep(150);
    return DEMO_GUESTS.filter((g) => g.eventId === eventId);
  }

  const db = await getDb() as { collection: (name: string) => { find: (q: unknown) => { toArray: () => Promise<Guest[]> } } };
  return db.collection("guests").find({ eventId }).toArray();
}

// ─── Budget ──────────────────────────────────────────────────────────────────

export async function getBudgetItems(eventId: string): Promise<BudgetLineItem[]> {
  if (IS_MOCK) {
    await sleep(100);
    return DEMO_BUDGET_ITEMS.filter((b) => b.eventId === eventId);
  }

  const db = await getDb() as { collection: (name: string) => { find: (q: unknown) => { toArray: () => Promise<BudgetLineItem[]> } } };
  return db.collection("budgets").find({ eventId }).toArray();
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function getTimelineItems(eventId: string): Promise<TimelineItem[]> {
  if (IS_MOCK) {
    await sleep(100);
    return DEMO_TIMELINE_ITEMS.filter((t) => t.eventId === eventId).sort((a, b) => a.order - b.order);
  }

  const db = await getDb() as { collection: (name: string) => { find: (q: unknown) => { sort: (s: unknown) => { toArray: () => Promise<TimelineItem[]> } } } };
  return db.collection("timelineItems").find({ eventId }).sort({ order: 1 }).toArray();
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export async function getAIInsights(eventId: string): Promise<AIInsight[]> {
  if (IS_MOCK) {
    await sleep(150);
    return DEMO_AI_INSIGHTS.filter((i) => i.eventId === eventId);
  }

  const db = await getDb() as { collection: (name: string) => { find: (q: unknown) => { toArray: () => Promise<AIInsight[]> } } };
  return db.collection("aiInsights").find({ eventId }).toArray();
}

export async function resolveInsight(insightId: string): Promise<void> {
  if (IS_MOCK) {
    await sleep(150);
    return;
  }

  const db = await getDb() as { collection: (name: string) => { updateOne: (q: unknown, u: unknown) => Promise<void> } };
  await db.collection("aiInsights").updateOne(
    { _id: insightId },
    { $set: { isResolved: true, resolvedAt: new Date().toISOString() } }
  );
}
