import { NextRequest, NextResponse } from "next/server";
import { searchVendors } from "@/lib/services/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "outdoor catering networking";
    const limit = parseInt(searchParams.get("limit") || "8");

    const vendors = await searchVendors(query, limit);

    return NextResponse.json({
      vendors,
      query,
      count: vendors.length,
      searchType: process.env.MOCK_MODE === "true" ? "mock_semantic" : "atlas_vector_search",
      indexName: "vendor_embedding",
      model: "text-embedding-004",
    });
  } catch (error) {
    console.error("Vendor search error:", error);
    return NextResponse.json({ error: "Vendor search failed", vendors: [] }, { status: 500 });
  }
}
