import { NextRequest, NextResponse } from "next/server";
import { getConciergeResponse } from "@/lib/services/elevenlabs";

export async function POST(req: NextRequest) {
  try {
    const { question, voice = "aria" } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const result = await getConciergeResponse(question, voice);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { error: "Voice service error", answer: "I'm having trouble right now. Please try again." },
      { status: 500 }
    );
  }
}
