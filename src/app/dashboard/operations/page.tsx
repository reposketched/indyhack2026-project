"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Clock, AlertTriangle, Zap,
  ChevronRight, CalendarDays, DollarSign, Users,
  Activity, RefreshCw, Filter,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import type { TimelineItem } from "@/lib/schemas";
import { toast } from "sonner";

const TYPE_ICONS = {
  milestone: CheckCircle2,
  deadline: AlertTriangle,
  task: Circle,
  deposit: DollarSign,
  runofshow: CalendarDays,
};

const TYPE_COLORS = {
  milestone: "text-brand-600 bg-brand-50 dark:bg-brand-900/40 dark:text-brand-400",
  deadline: "text-rose-600 bg-rose-50 dark:bg-rose-900/40 dark:text-rose-400",
  task: "text-muted-foreground bg-muted",
  deposit: "text-amber-600 bg-amber-50 dark:bg-amber-900/40 dark:text-amber-400",
  runofshow: "text-violet-600 bg-violet-50 dark:bg-violet-900/40 dark:text-violet-400",
};

const PRIORITY_DOT = {
  critical: "bg-rose-500",
  high: "bg-amber-500",
  medium: "bg-brand-400",
  low: "bg-muted-foreground",
};

// Live updates are generated dynamically in the component

function TimelineItemRow({
  item,
  onComplete,
  delay = 0,
}: {
  item: TimelineItem;
  onComplete: (id: string) => void;
  delay?: number;
}) {
  const Icon = TYPE_ICONS[item.type] || Circle;
  const typeColor = TYPE_COLORS[item.type] || TYPE_COLORS.task;
  const priorityDot = PRIORITY_DOT[item.priority] || PRIORITY_DOT.medium;
  const isCompleted = item.status === "completed";
  const isOverdue = item.status === "overdue" || (
    item.status === "pending" && new Date(item.dueDate) < new Date()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "flex items-start gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group",
        isCompleted && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => !isCompleted && onComplete(item._id!)}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all flex items-center justify-center",
          isCompleted
            ? "border-emerald-500 bg-emerald-500"
            : "border-border hover:border-brand-400"
        )}
      >
        {isCompleted && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
      </button>

      {/* Type icon */}
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", typeColor)}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className={cn("text-sm font-medium", isCompleted ? "line-through text-muted-foreground" : "text-foreground")}>
            {item.title}
          </span>
          <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", priorityDot)} />
          {item.priority === "critical" && !isCompleted && (
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">Critical</span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Date */}
      <div className="flex-shrink-0 text-right">
        <div className={cn(
          "text-xs font-medium",
          isCompleted ? "text-emerald-600" : isOverdue ? "text-rose-600" : "text-muted-foreground"
        )}>
          {isCompleted ? "Done" : formatDate(item.dueDate, "relative")}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {formatDate(item.dueDate, "short")}
        </div>
      </div>
    </motion.div>
  );
}

export default function OperationsPage() {
  const { timelineItems, completeTimelineItem, event, eventPlan, insights } = useEventStore();
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");
  const [isSimulating, setIsSimulating] = useState(false);

  const completed = timelineItems.filter((t) => t.status === "completed").length;
  const total = timelineItems.length;
  const pct = Math.round((completed / total) * 100);

  const filteredItems = timelineItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status === "pending" || item.status === "in_progress";
    if (filter === "completed") return item.status === "completed";
    if (filter === "overdue") return item.status === "overdue" || (item.status === "pending" && new Date(item.dueDate) < new Date());
    return true;
  });

  const handleComplete = (id: string) => {
    completeTimelineItem(id);
    toast.success("Task completed", { description: "Progress saved to MongoDB" });
  };

  const simulateLiveUpdate = async () => {
    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.info("Live update received", {
      description: "MongoDB change stream: Guest count updated to 149",
    });
    setIsSimulating(false);
  };

  const runofshowItems = timelineItems.filter((t) => t.type === "runofshow");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="page-title">Timeline & Operations</h2>
          <p className="page-subtitle">Milestone tracking · Change stream powered by MongoDB</p>
        </div>
        <button
          onClick={simulateLiveUpdate}
          disabled={isSimulating}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          {isSimulating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Activity className="w-4 h-4" />
          )}
          Simulate Live Update
        </button>
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-foreground">Overall Progress</div>
            <div className="text-xs text-muted-foreground mt-0.5">{completed} of {total} milestones completed</div>
          </div>
          <div className="text-2xl font-bold font-display text-brand-600">{pct}%</div>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: "Completed", value: completed, color: "text-emerald-600" },
            { label: "Pending", value: timelineItems.filter((t) => t.status === "pending").length, color: "text-brand-600" },
            { label: "Critical", value: timelineItems.filter((t) => t.priority === "critical" && t.status !== "completed").length, color: "text-rose-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className={cn("text-xl font-bold font-display", color)}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["all", "pending", "completed", "overdue"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all",
                  filter === f ? "bg-brand-600 text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="card-base overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border bg-muted/30">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {filteredItems.length} items
              </div>
            </div>
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <TimelineItemRow
                  key={item._id}
                  item={item}
                  onComplete={handleComplete}
                  delay={i * 0.04}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Live updates — built from real store data */}
          <div className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">Activity</span>
              <span className="ml-auto text-[10px] text-muted-foreground">MongoDB change stream</span>
            </div>
            <div className="divide-y divide-border">
              {[
                event.confirmedGuests > 0 && {
                  message: `${event.confirmedGuests} of ${event.guestCount} guests confirmed — ${Math.round((event.confirmedGuests / event.guestCount) * 100)}% RSVPed`,
                  type: "info",
                  time: "Now",
                },
                insights.filter((i) => !i.isResolved).length > 0 && {
                  message: `${insights.filter((i) => !i.isResolved).length} active AI alert${insights.filter((i) => !i.isResolved).length > 1 ? "s" : ""} — review in AI Planner`,
                  type: "warning",
                  time: "Active",
                },
                timelineItems.filter((t) => t.status === "completed").length > 0 && {
                  message: `${timelineItems.filter((t) => t.status === "completed").length} milestone${timelineItems.filter((t) => t.status === "completed").length > 1 ? "s" : ""} completed`,
                  type: "success",
                  time: "Recent",
                },
                timelineItems.filter((t) => t.type === "deposit" && t.status !== "completed").length > 0 && {
                  message: `${timelineItems.filter((t) => t.type === "deposit" && t.status !== "completed").length} vendor deposit${timelineItems.filter((t) => t.type === "deposit" && t.status !== "completed").length > 1 ? "s" : ""} pending`,
                  type: "warning",
                  time: "Upcoming",
                },
                eventPlan && {
                  message: "AI event plan generated — run of show available below",
                  type: "success",
                  time: "Generated",
                },
              ].filter((x): x is { message: string; type: string; time: string } => Boolean(x)).map((update, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-2.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5",
                    update.type === "success" ? "bg-emerald-400" : update.type === "warning" ? "bg-amber-400" : "bg-brand-400"
                  )} />
                  <div>
                    <div className="text-xs text-foreground leading-snug">{update.message}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{update.time}</div>
                  </div>
                </div>
              ))}
              {insights.length === 0 && timelineItems.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Activity will appear as you plan your event
                </div>
              )}
            </div>
          </div>

          {/* Run of show — from AI plan if available */}
          <div className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-xs font-semibold text-foreground">Day-of Run of Show</div>
              <div className="text-[10px] text-muted-foreground">
                {eventPlan ? `${eventPlan.date} · ${eventPlan.time}` : "Generate a plan in AI Planner to populate"}
              </div>
            </div>
            {eventPlan?.schedule && eventPlan.schedule.length > 0 ? (
              <div className="divide-y divide-border">
                {eventPlan.schedule.map((item) => (
                  <div key={item.time} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xs font-mono text-brand-600 w-16 flex-shrink-0">{item.time}</span>
                    <span className="text-xs text-foreground flex-1">{item.activity}</span>
                    <span className="text-[10px] text-muted-foreground">{item.duration}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                Run of show populates after you generate a plan in{" "}
                <a href="/dashboard/planner" className="text-brand-600 hover:text-brand-700 underline underline-offset-2">
                  AI Planner
                </a>
              </div>
            )}
          </div>

          {/* Upcoming deposits */}
          <div className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-xs font-semibold text-foreground">Upcoming Payments</div>
            </div>
            {timelineItems
              .filter((t) => t.type === "deposit" && t.status !== "completed")
              .map((item) => (
                <div key={item._id} className="px-4 py-3 border-b border-border last:border-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground">{formatDate(item.dueDate, "short")}</div>
                  </div>
                  {item.priority === "critical" && (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
