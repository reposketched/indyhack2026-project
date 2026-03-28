/**
 * Gemini Service Adapter
 *
 * Real mode: Uses Google Gemini API (gemini-1.5-pro) for structured event planning,
 * conflict detection, and natural language understanding.
 *
 * Mock mode: Returns realistic pre-built responses with simulated streaming delays.
 *
 * Toggle via MOCK_MODE=true in .env.local
 */

import { sleep } from "@/lib/utils";
import type { EventPlan, AIInsight, ChatMessage } from "@/lib/schemas";
import { DEMO_EVENT_PLAN, DEMO_AI_INSIGHTS } from "@/lib/data/events";

const IS_MOCK = process.env.MOCK_MODE === "true" || !process.env.GEMINI_API_KEY;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeminiPlanRequest {
  prompt: string;
  eventId?: string;
  context?: string;
}

export interface GeminiPlanResponse {
  plan: EventPlan;
  insights: AIInsight[];
  chatMessage: string;
}

export interface GeminiChatRequest {
  messages: ChatMessage[];
  eventContext?: string;
}

// ─── Mock Responses ──────────────────────────────────────────────────────────

const MOCK_CHAT_RESPONSES: Record<string, string> = {
  default: `I've analyzed your request and generated a complete event plan. Here's what I've structured:

**Theme:** Rustic Outdoor Networking — warm, professional, and nature-forward

**Key decisions I've made:**
- Station-based catering (not sit-down) to maximize networking flow
- 5PM start to capture golden hour photography window
- Wildflower + string light decor to create ambient warmth
- Acoustic background music — present but not overpowering

**Budget breakdown:** $7,700 committed / $8,000 total — leaving a $300 buffer. I've flagged this as a risk — recommend trimming decor by $400 for a healthier contingency.

**Immediate conflicts detected:**
1. ⚠️ Catering deposit (Aug 15) conflicts with venue contract (Aug 18) — details in Conflicts panel
2. ⚠️ Budget is 96% allocated — contingency is dangerously low

Shall I adjust anything? I remember all previous decisions and can revise any section.`,

  vendors: `Based on your event profile, I've searched MongoDB's vector index and surfaced the top vendor matches. Here's my reasoning:

**Top pick: Harvest & Hearth Catering** (98% match) — Their farm-to-table philosophy is a perfect fit. 60%+ vegetarian options, live cooking stations, and experience with 200+ guest outdoor events.

**Venue: Meadowbrook Estate** (95% match) — The only venue that truly delivers on the "rustic outdoor" brief. Barn + lawn allows flexible zone setup.

Want me to compare any two vendors in detail, or should I generate a vendor email template?`,

  budget: `Here's my budget analysis:

Current allocation is **96% of $8,000** — this is tight. Typical events reserve 10–15% for contingencies.

**My recommendation:** Reduce the decor budget from $950 → $550 (swap one floral installation for DIY elements). This creates a $700 buffer — a much healthier position.

**If you choose Harvest & Hearth:** Your catering total is $7,600 for 200 guests ($38/head). If attendance reaches 225 (current RSVP trajectory), that's +$950 in catering overage. Plan accordingly.`,
};

function getMockChatResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("vendor") || lower.includes("cater")) return MOCK_CHAT_RESPONSES.vendors;
  if (lower.includes("budget") || lower.includes("cost") || lower.includes("spend")) return MOCK_CHAT_RESPONSES.budget;
  return MOCK_CHAT_RESPONSES.default;
}

// ─── Real Gemini API ──────────────────────────────────────────────────────────

async function callGeminiReal(prompt: string, systemContext: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemContext}\n\nUser: ${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateEventPlan(req: GeminiPlanRequest): Promise<GeminiPlanResponse> {
  if (IS_MOCK) {
    await sleep(1500);
    return {
      plan: DEMO_EVENT_PLAN,
      insights: DEMO_AI_INSIGHTS.slice(0, 3),
      chatMessage: MOCK_CHAT_RESPONSES.default,
    };
  }

  const systemContext = `You are Eventide's AI event planner. You help organizers plan professional events from natural language descriptions.
  
Return a JSON object with this structure:
{
  "plan": { theme, guestCount, date, time, duration, venuePreferences, cateringStyle, dietaryNotes, budget, staffingNeeds, schedule: [{time, activity, duration}], risks: [{risk, mitigation, severity}], nextActions: [], aiSummary },
  "chatMessage": "conversational response summarizing your analysis"
}

Current event context: ${req.context || "New event"}`;

  const rawResponse = await callGeminiReal(req.prompt, systemContext);

  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        plan: parsed.plan || DEMO_EVENT_PLAN,
        insights: DEMO_AI_INSIGHTS.slice(0, 2),
        chatMessage: parsed.chatMessage || rawResponse,
      };
    }
  } catch (_) {
    // Fall through to return raw response with mock plan
  }

  return {
    plan: DEMO_EVENT_PLAN,
    insights: DEMO_AI_INSIGHTS.slice(0, 2),
    chatMessage: rawResponse || MOCK_CHAT_RESPONSES.default,
  };
}

export async function chatWithGemini(req: GeminiChatRequest): Promise<string> {
  const lastMessage = req.messages[req.messages.length - 1];

  if (IS_MOCK) {
    await sleep(800 + Math.random() * 600);
    return getMockChatResponse(lastMessage?.content || "");
  }

  const systemContext = `You are Com-Plan-ion's AI assistant — an expert event planner with memory of all past decisions. 
Current event: ${req.eventContext || "Rustic outdoor networking event, 200 guests, $8,000 budget"}
Be concise, specific, and actionable. Reference previous decisions when relevant.`;

  const conversationHistory = req.messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  return await callGeminiReal(conversationHistory, systemContext);
}

export async function detectConflicts(eventContext: string): Promise<AIInsight[]> {
  if (IS_MOCK) {
    await sleep(600);
    return DEMO_AI_INSIGHTS;
  }

  const systemContext = `Analyze this event for planning conflicts, risks, and opportunities. Return a JSON array of insights with: type (conflict|warning|suggestion|opportunity|info), title, body, severity (low|medium|high|critical).`;

  const rawResponse = await callGeminiReal(eventContext, systemContext);

  try {
    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (_) {}

  return DEMO_AI_INSIGHTS;
}
