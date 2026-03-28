"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, DollarSign, Calendar, Ticket, Mic,
  Brain, ArrowRight, AlertTriangle, CheckCircle2,
  Clock, MapPin, TrendingUp, Zap,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { AlertCard } from "@/components/shared/AlertCard";
import { useEventStore } from "@/lib/store/eventStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEMO_TIMELINE_ITEMS } from "@/lib/data/budgets";
import { AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Chat with AI", href: "/dashboard/planner", icon: Brain, color: "bg-brand-50 text-brand-600", desc: "Continue planning" },
  { label: "Search Vendors", href: "/dashboard/vendors", icon: Users, color: "bg-emerald-50 text-emerald-600", desc: "Find vendors" },
  { label: "View Budget", href: "/dashboard/budget", icon: DollarSign, color: "bg-amber-50 text-amber-600", desc: "Track spending" },
  { label: "Mint Tickets", href: "/dashboard/tickets", icon: Ticket, color: "bg-violet-50 text-violet-600", desc: "Solana NFTs" },
];

export default function DashboardPage() {
  const { event, insights, timelineItems, budgetItems } = useEventStore();

  const totalBudget = event.budget;
  const projectedSpend = budgetItems.reduce((s, b) => s + b.projected, 0);
  const actualSpend = budgetItems.reduce((s, b) => s + b.actual, 0);
  const budgetUsedPct = Math.round((projectedSpend / totalBudget) * 100);

  const unresolvedInsights = insights.filter((i) => !i.isResolved);
  const upcomingItems = DEMO_TIMELINE_ITEMS
    .filter((t) => t.status !== "completed")
    .slice(0, 4);

  const guestPct = Math.round((event.confirmedGuests / event.guestCount) * 100);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Event header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">
            {event.status === "planning" ? "In Planning" : event.status}
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground">{event.name}</h2>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.date, "long")}
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.location.name}, {event.location.city}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/event/${event.slug}`} target="_blank" className="btn-secondary text-sm">
            Guest Page ↗
          </Link>
          <Link href="/dashboard/planner" className="btn-primary text-sm">
            <Brain className="w-4 h-4" />
            Open AI Planner
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Confirmed Guests"
          value={event.confirmedGuests}
          subValue={`of ${event.guestCount} invited · ${guestPct}% RSVPed`}
          icon={Users}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
          trend="up"
          trendValue="+12 this week"
          delay={0}
        />
        <StatCard
          label="Budget Used"
          value={`${budgetUsedPct}%`}
          subValue={`${formatCurrency(projectedSpend)} committed of ${formatCurrency(totalBudget)}`}
          icon={DollarSign}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend={budgetUsedPct > 90 ? "down" : "neutral"}
          trendValue={budgetUsedPct > 90 ? "Tight budget" : "On track"}
          delay={0.05}
        />
        <StatCard
          label="AI Alerts"
          value={unresolvedInsights.length}
          subValue={`${insights.filter(i => i.isResolved).length} resolved`}
          icon={AlertTriangle}
          iconColor={unresolvedInsights.length > 0 ? "text-rose-600" : "text-emerald-600"}
          iconBg={unresolvedInsights.length > 0 ? "bg-rose-50" : "bg-emerald-50"}
          delay={0.1}
        />
        <StatCard
          label="Days Until Event"
          value={Math.max(0, Math.floor((new Date(event.date).getTime() - Date.now()) / 86400000))}
          subValue={formatDate(event.date, "short")}
          icon={Clock}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          delay={0.15}
        />
      </div>

      {/* Quick actions */}
      <div>
        <div className="section-label mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, color, desc }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Alerts */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="section-label">AI Alerts & Insights</div>
            <Link href="/dashboard/planner" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {unresolvedInsights.length > 0 ? (
                unresolvedInsights.slice(0, 3).map((insight, i) => (
                  <AlertCard key={insight._id} insight={insight} delay={i * 0.08} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-700">All clear — no active alerts</div>
                    <div className="text-xs text-emerald-600 opacity-80">Gemini is monitoring your event for conflicts</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Upcoming milestones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="section-label">Upcoming</div>
            <Link href="/dashboard/operations" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Full timeline <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-150"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.priority === "critical" ? "bg-rose-500" : item.priority === "high" ? "bg-amber-500" : "bg-brand-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">{item.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {formatDate(item.dueDate, "relative")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget overview strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-base p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="section-label">Budget Overview</div>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <div className="text-xl font-bold font-display text-foreground">{formatCurrency(projectedSpend)}</div>
                <div className="text-xs text-muted-foreground">Projected spend</div>
              </div>
              <div className="text-muted-foreground text-sm">/</div>
              <div>
                <div className="text-xl font-bold font-display text-foreground">{formatCurrency(totalBudget)}</div>
                <div className="text-xs text-muted-foreground">Total budget</div>
              </div>
              <div className="text-muted-foreground text-sm">/</div>
              <div>
                <div className="text-xl font-bold font-display text-emerald-600">{formatCurrency(actualSpend)}</div>
                <div className="text-xs text-muted-foreground">Paid to date</div>
              </div>
            </div>
          </div>
          <Link href="/dashboard/budget" className="btn-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            Full Analysis
          </Link>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full flex rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(actualSpend / totalBudget) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="h-full bg-emerald-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((projectedSpend - actualSpend) / totalBudget) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
              className="h-full bg-brand-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Paid
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />Committed
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-muted border border-border" />Available
          </div>
        </div>
      </motion.div>

      {/* Sponsor tech strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center gap-3"
      >
        <span className="text-xs text-muted-foreground font-medium">Powered by:</span>
        {[
          { name: "Gemini AI", color: "text-brand-600 bg-brand-50 border-brand-100" },
          { name: "MongoDB Atlas", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { name: "Solana", color: "text-violet-600 bg-violet-50 border-violet-100" },
          { name: "ElevenLabs", color: "text-amber-600 bg-amber-50 border-amber-100" },
        ].map(({ name, color }) => (
          <span key={name} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
            <Zap className="w-3 h-3" />
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
