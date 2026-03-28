import { NextRequest, NextResponse } from "next/server";
import { generateEventPlan, chatWithGemini } from "@/lib/services/gemini";
import { getEventMemory } from "@/lib/services/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, eventId, messages } = body;

    // Load persistent event memory from MongoDB
    let context = "";
    if (eventId) {
      const memory = await getEventMemory(eventId);
      if (memory) {
        context = `Previous context: ${memory.context}\nKey decisions: ${memory.decisions.map(d => d.decision).join("; ")}`;
      }
    }

    if (messages && messages.length > 0) {
      // Chat mode
      const response = await chatWithGemini({ messages, eventContext: context });
      return NextResponse.json({ chatMessage: response });
    } else {
      // Plan generation mode
      const result = await generateEventPlan({ prompt, eventId, context });
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Gemini service unavailable", chatMessage: "I'm having trouble connecting to Gemini right now. Please try again." },
      { status: 500 }
    );
  }
}
