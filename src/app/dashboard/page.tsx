"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, DollarSign, Calendar, Ticket,
  Brain, ArrowRight, AlertTriangle, CheckCircle2,
  Clock, MapPin, TrendingUp, Zap, Pencil, X, Save,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { AlertCard } from "@/components/shared/AlertCard";
import { useEventStore } from "@/lib/store/eventStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Chat with AI", href: "/dashboard/planner", icon: Brain, color: "bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400", desc: "Continue planning" },
  { label: "Search Vendors", href: "/dashboard/vendors", icon: Users, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400", desc: "Find vendors" },
  { label: "View Budget", href: "/dashboard/budget", icon: DollarSign, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400", desc: "Track spending" },
  { label: "Mint Tickets", href: "/dashboard/tickets", icon: Ticket, color: "bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400", desc: "Solana NFTs" },
];

function EditEventModal({ onClose }: { onClose: () => void }) {
  const { event, setEvent } = useEventStore();

  const toLocalDate = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().split("T")[0];
  };
  const toLocalTime = (iso: string) => {
    const d = new Date(iso);
    return d.toTimeString().slice(0, 5);
  };

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: event.name,
    date: toLocalDate(event.date),
    time: toLocalTime(event.date),
    venueName: event.location.name,
    address: event.location.address,
    city: event.location.city,
    state: event.location.state,
    guestCount: String(event.guestCount),
    confirmedGuests: String(event.confirmedGuests),
    budget: String(event.budget),
  });
  const [error, setError] = useState("");

  function save() {
    if (!form.name.trim()) { setError("Event name is required."); return; }
    if (!form.date) { setError("Event date is required."); return; }
    if (form.date < today) { setError("Event date can't be in the past."); return; }

    const dateTimeStr = form.time
      ? `${form.date}T${form.time}:00`
      : `${form.date}T00:00:00`;

    setEvent({
      name: form.name.trim(),
      date: new Date(dateTimeStr).toISOString(),
      slug: form.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      location: {
        ...event.location,
        name: form.venueName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
      },
      guestCount: parseInt(form.guestCount) || 0,
      confirmedGuests: parseInt(form.confirmedGuests) || 0,
      budget: parseFloat(form.budget) || 0,
    });
    onClose();
  }

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-card-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-sm font-semibold text-foreground">Edit Event</div>
            <div className="text-xs text-muted-foreground">Update your event details</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-800/40">{error}</p>}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Event name</label>
            <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Date</label>
              <input type="date" value={form.date} min={today} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Start time</label>
              <input type="time" value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Venue name</label>
            <input type="text" placeholder="e.g. The Grand Ballroom" value={form.venueName} onChange={(e) => setForm(f => ({ ...f, venueName: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Address</label>
            <input type="text" placeholder="e.g. 123 Main St" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">City</label>
              <input type="text" placeholder="e.g. Indianapolis" value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">State</label>
              <input type="text" placeholder="e.g. IN" value={form.state} onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Expected guests</label>
              <input type="number" min="0" value={form.guestCount} onChange={(e) => setForm(f => ({ ...f, guestCount: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Confirmed RSVPs</label>
              <input type="number" min="0" value={form.confirmedGuests} onChange={(e) => setForm(f => ({ ...f, confirmedGuests: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Budget ($)</label>
              <input type="number" min="0" value={form.budget} onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <button onClick={save} className="btn-primary flex-1 justify-center text-sm">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const { event, insights, timelineItems, budgetItems } = useEventStore();
  const [showEdit, setShowEdit] = useState(false);

  const daysUntilEvent = useMemo(() => {
    const eventMs = new Date(event.date).setHours(0, 0, 0, 0);
    const todayMs = new Date().setHours(0, 0, 0, 0);
    return Math.floor((eventMs - todayMs) / 86400000);
  }, [event.date]);

  const totalBudget = event.budget;
  const projectedSpend = budgetItems.reduce((s, b) => s + b.projected, 0);
  const actualSpend = budgetItems.reduce((s, b) => s + b.actual, 0);
  const budgetUsedPct = totalBudget > 0 ? Math.round((projectedSpend / totalBudget) * 100) : 0;

  const unresolvedInsights = insights.filter((i) => !i.isResolved);
  const upcomingItems = timelineItems.filter((t) => t.status !== "completed").slice(0, 4);

  const guestPct = event.guestCount > 0 ? Math.round((event.confirmedGuests / event.guestCount) * 100) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <AnimatePresence>
        {showEdit && <EditEventModal onClose={() => setShowEdit(false)} />}
      </AnimatePresence>

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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-display text-foreground">{event.name}</h2>
            <button
              onClick={() => setShowEdit(true)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Edit event details"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.date, "long")}
            </div>
            {event.location.city && (
              <>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location.name ? `${event.location.name}, ` : ""}{event.location.city}
                </div>
              </>
            )}
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
          subValue={event.guestCount > 0 ? `of ${event.guestCount} invited · ${guestPct}% RSVPed` : "No guest count set"}
          icon={Users}
          iconColor="text-brand-600 dark:text-brand-400"
          iconBg="bg-brand-50 dark:bg-brand-900/40"
          delay={0}
        />
        <StatCard
          label="Budget Used"
          value={totalBudget > 0 ? `${budgetUsedPct}%` : "—"}
          subValue={totalBudget > 0 ? `${formatCurrency(projectedSpend)} of ${formatCurrency(totalBudget)}` : "No budget set"}
          icon={DollarSign}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-900/40"
          trend={totalBudget > 0 && budgetUsedPct > 90 ? "down" : "neutral"}
          trendValue={totalBudget > 0 && budgetUsedPct > 90 ? "Tight budget" : "On track"}
          delay={0.05}
        />
        <StatCard
          label="AI Alerts"
          value={unresolvedInsights.length}
          subValue={`${insights.filter(i => i.isResolved).length} resolved`}
          icon={AlertTriangle}
          iconColor={unresolvedInsights.length > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}
          iconBg={unresolvedInsights.length > 0 ? "bg-rose-50 dark:bg-rose-900/40" : "bg-emerald-50 dark:bg-emerald-900/40"}
          delay={0.1}
        />
        <StatCard
          label={daysUntilEvent < 0 ? "Event Passed" : "Days Until Event"}
          value={Math.abs(daysUntilEvent)}
          subValue={formatDate(event.date, "short")}
          icon={Clock}
          iconColor={daysUntilEvent < 0 ? "text-muted-foreground" : daysUntilEvent <= 14 ? "text-rose-600 dark:text-rose-400" : "text-violet-600 dark:text-violet-400"}
          iconBg={daysUntilEvent < 0 ? "bg-muted" : daysUntilEvent <= 14 ? "bg-rose-50 dark:bg-rose-900/40" : "bg-violet-50 dark:bg-violet-900/40"}
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
                  <Icon className="w-4 h-4" />
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
                  className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">All clear — no active alerts</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-500 opacity-80">Gemini will flag conflicts as you plan</div>
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
            {upcomingItems.length > 0 ? upcomingItems.map((item, i) => (
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
                  <div className="text-[10px] text-muted-foreground mt-0.5">{formatDate(item.dueDate, "relative")}</div>
                </div>
              </motion.div>
            )) : (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
                <Clock className="w-4 h-4 flex-shrink-0" />
                No milestones yet — add them in the Operations tab
              </div>
            )}
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
        {totalBudget > 0 ? (
          <>
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
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Paid</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2.5 h-2.5 rounded-full bg-brand-400" />Committed</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2.5 h-2.5 rounded-full bg-muted border border-border" />Available</div>
            </div>
          </>
        ) : (
          <div className="text-xs text-muted-foreground py-2">Set a budget in your event details to see spending analysis.</div>
        )}
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
          { name: "Gemini AI", color: "text-brand-600 bg-brand-50 border-brand-100 dark:text-brand-400 dark:bg-brand-900/30 dark:border-brand-800/50" },
          { name: "MongoDB Atlas", color: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-800/50" },
          { name: "Solana", color: "text-violet-600 bg-violet-50 border-violet-100 dark:text-violet-400 dark:bg-violet-900/30 dark:border-violet-800/50" },
          { name: "ElevenLabs", color: "text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800/50" },
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
