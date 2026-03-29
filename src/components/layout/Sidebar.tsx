"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  Users,
  DollarSign,
  Calendar,
  Ticket,
  Mic,
  Send,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/lib/store/eventStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/planner", label: "AI Planner", icon: Brain, badge: "Gemini" },
  { href: "/dashboard/vendors", label: "Vendors", icon: Users, badge: "MongoDB" },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign },
  { href: "/dashboard/operations", label: "Operations", icon: Calendar },
  { href: "/dashboard/tickets", label: "Tickets", icon: Ticket, badge: "Solana" },
  { href: "/dashboard/voice", label: "Voice", icon: Mic, badge: "ElevenLabs" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { event, insights } = useEventStore();

  const unresolvedCount = insights.filter((i) => !i.isResolved).length;

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
            <Send className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold font-display text-foreground">Com-Plan-ion</span>
        </Link>
      </div>

      {/* Event selector */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-muted/60 hover:bg-muted cursor-pointer transition-colors group">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground truncate">{event.name}</div>
            <div className="text-[10px] text-muted-foreground">{event.status === "planning" ? "In planning" : event.status}</div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact, badge }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-brand-50 dark:bg-brand-900/40"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={cn("relative w-4 h-4 flex-shrink-0", isActive ? "text-brand-600" : "")} />
              <span className="relative flex-1">{label}</span>
              {badge && (
                <span className="relative text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {badge}
                </span>
              )}
              {label === "AI Planner" && unresolvedCount > 0 && (
                <span className="relative w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unresolvedCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Guest page link */}
      <div className="px-3 py-3 border-t border-border">
        <Link
          href={`/event/${event.slug}`}
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 group"
        >
          <ExternalLink className="w-3.5 h-3.5 group-hover:text-foreground" />
          <span>Guest Event Page</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AO
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground truncate">Alex Organizer</div>
            <div className="text-[10px] text-muted-foreground">Event Organizer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
