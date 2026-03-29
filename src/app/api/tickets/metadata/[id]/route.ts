import { NextRequest, NextResponse } from "next/server";
import { ticketMetadataStore } from "@/lib/ticketMetadataStore";

/**
 * NFT Metadata endpoint — Metaplex-compatible JSON served at:
 * GET /api/tickets/metadata/:id
 *
 * The mint function stores ticket data in the shared in-memory store
 * and sets the NFT uri to this endpoint so explorers and wallets
 * can display rich ticket information.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const metadata = ticketMetadataStore.get(params.id);

  if (!metadata) {
    return NextResponse.json({ error: "Ticket metadata not found" }, { status: 404 });
  }

  return NextResponse.json(metadata, {
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
