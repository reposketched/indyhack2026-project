"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Info, TrendingUp, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/lib/schemas";
import { useEventStore } from "@/lib/store/eventStore";

const TYPE_CONFIG = {
  conflict: { icon: AlertTriangle, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", iconColor: "text-rose-500" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", iconColor: "text-amber-500" },
  suggestion: { icon: Lightbulb, bg: "bg-brand-50", border: "border-brand-100", text: "text-brand-700", iconColor: "text-brand-500" },
  opportunity: { icon: TrendingUp, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", iconColor: "text-emerald-500" },
  info: { icon: Info, bg: "bg-muted", border: "border-border", text: "text-muted-foreground", iconColor: "text-muted-foreground" },
};

interface AlertCardProps {
  insight: AIInsight;
  compact?: boolean;
  delay?: number;
}

export function AlertCard({ insight, compact = false, delay = 0 }: AlertCardProps) {
  const { resolveInsight } = useEventStore();
  const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  if (insight.isResolved) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "rounded-xl border p-4 relative",
        config.bg,
        config.border
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn("w-4 h-4", config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn("text-sm font-semibold", config.text)}>{insight.title}</div>
          {!compact && (
            <p className={cn("text-xs mt-1 leading-relaxed", config.text, "opacity-80")}>
              {insight.body}
            </p>
          )}
        </div>
        <button
          onClick={() => resolveInsight(insight._id!)}
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className={cn("w-3 h-3", config.text)} />
        </button>
      </div>
      {insight.severity === "critical" || insight.severity === "high" ? (
        <div className={cn("absolute top-2 right-8 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", config.text, "opacity-60")}>
          {insight.severity}
        </div>
      ) : null}
    </motion.div>
  );
}

export function ResolvedBadge() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
      <CheckCircle className="w-3.5 h-3.5" />
      Resolved
    </div>
  );
}
