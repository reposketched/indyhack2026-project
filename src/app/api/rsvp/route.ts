import { NextRequest, NextResponse } from "next/server";
import { saveRSVP, getRSVPs } from "@/lib/services/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { eventId, name, email, mealPreference, location } = await req.json();
    if (!eventId || !name || !email) {
      return NextResponse.json({ error: "eventId, name, and email are required" }, { status: 400 });
    }
    const rsvp = {
      eventId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mealPreference: mealPreference || undefined,
      location: location?.trim() || undefined,
      rsvpStatus: "confirmed" as const,
      accessTier: "general" as const,
      dietaryRestrictions: [] as string[],
      checkedIn: false,
      createdAt: new Date().toISOString(),
    };
    await saveRSVP(rsvp);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }
  try {
    const rsvps = await getRSVPs(eventId);
    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error("Get RSVPs error:", error);
    return NextResponse.json({ error: "Failed to load RSVPs" }, { status: 500 });
  }
}
