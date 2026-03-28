"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Zap } from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Event health at a glance" },
  "/dashboard/planner": { title: "AI Planner", subtitle: "Powered by Gemini" },
  "/dashboard/vendors": { title: "Vendor Matching", subtitle: "Semantic search via MongoDB Atlas" },
  "/dashboard/budget": { title: "Budget Intelligence", subtitle: "Real-time financial analysis" },
  "/dashboard/operations": { title: "Operations", subtitle: "Timeline & run-of-show" },
  "/dashboard/tickets": { title: "Ticketing", subtitle: "Solana NFT tickets" },
  "/dashboard/voice": { title: "Voice Concierge", subtitle: "Powered by ElevenLabs" },
};

export function TopBar() {
  const pathname = usePathname();
  const { insights } = useEventStore();
  const pageInfo = PAGE_TITLES[pathname] || { title: "Dashboard", subtitle: "" };
  const unresolvedCount = insights.filter((i) => !i.isResolved).length;

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{pageInfo.title}</h1>
        {pageInfo.subtitle && (
          <p className="text-xs text-muted-foreground">{pageInfo.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Alert bell */}
        <button className="relative w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unresolvedCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
              {unresolvedCount}
            </span>
          )}
        </button>

        {/* Demo button */}
        <Link
          href="/demo"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          Run Demo
        </Link>
      </div>
    </header>
  );
}
