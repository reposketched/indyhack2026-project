import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/services/mongodb";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const event = await getEvent(params.slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json({ error: "Failed to load event" }, { status: 500 });
  }
}
