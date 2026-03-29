import { NextRequest, NextResponse } from "next/server";
import { saveEvent } from "@/lib/services/mongodb";

function toSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 60);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = {
      ...body,
      slug: body.slug || toSlug(body.name),
      updatedAt: new Date().toISOString(),
      createdAt: body.createdAt || new Date().toISOString(),
    };
    await saveEvent(event);
    return NextResponse.json({ slug: event.slug, event });
  } catch (error) {
    console.error("Save event error:", error);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}
