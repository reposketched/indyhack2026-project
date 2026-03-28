import { NextRequest, NextResponse } from "next/server";
import { mintTicket } from "@/lib/services/solana";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      guestId,
      attendeeName,
      eventName,
      eventDate,
      tier = "general",
      mealPreference,
    } = body;

    if (!attendeeName || !eventName) {
      return NextResponse.json({ error: "attendeeName and eventName are required" }, { status: 400 });
    }

    const result = await mintTicket({
      eventId: eventId || "event_demo_001",
      guestId: guestId || "guest_demo",
      attendeeName,
      eventName,
      eventDate: eventDate || "September 20, 2025",
      tier,
      mealPreference,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Mint error:", error);
    return NextResponse.json({ error: "Minting failed" }, { status: 500 });
  }
}
