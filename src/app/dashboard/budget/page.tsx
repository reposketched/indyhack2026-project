"use client";

import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import type React from "react";
import {
  DollarSign, AlertTriangle, TrendingUp, CheckCircle2,
  Lightbulb, Info,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { formatCurrency, cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/data/budgets";

// Recommendations are generated dynamically in the component based on actual data

export default function BudgetPage() {
  const { budgetItems, event, guests } = useEventStore();

  const totalBudget = event.budget;
  const projectedSpend = budgetItems.reduce((s, b) => s + b.projected, 0);
  const actualSpend = budgetItems.reduce((s, b) => s + b.actual, 0);
  const remaining = totalBudget - projectedSpend;
  const budgetPct = totalBudget > 0 ? Math.round((projectedSpend / totalBudget) * 100) : 0;
  const contingencyPct = totalBudget > 0 ? Math.round((remaining / totalBudget) * 100) : 100;
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === "confirmed").length;

  // Data-driven AI recommendations
  const AI_RECOMMENDATIONS = [
    contingencyPct < 10 && totalBudget > 0 && {
      icon: AlertTriangle,
      colorClass: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/40",
      title: "Contingency buffer is too low",
      body: `Current buffer is ${formatCurrency(remaining)} (${contingencyPct}% of budget). Industry standard is 10–15%. Consider trimming lower-priority line items to free up at least ${formatCurrency(Math.round(totalBudget * 0.1))} in reserve.`,
      impact: `Target: ${formatCurrency(Math.round(totalBudget * 0.1))} buffer`,
    },
    event.guestCount > 0 && confirmedGuests > event.guestCount * 0.75 && {
      icon: TrendingUp,
      colorClass: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/40",
      title: "High RSVP rate — prepare for overflow",
      body: `${confirmedGuests} of ${event.guestCount} guests confirmed (${Math.round((confirmedGuests / event.guestCount) * 100)}%). At this rate you may exceed capacity. Alert your caterer and staffing vendors.`,
      impact: `${event.guestCount - confirmedGuests} spots remaining`,
    },
    budgetItems.filter((b) => b.isPaid).length > 0 && {
      icon: CheckCircle2,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40",
      title: `${budgetItems.filter((b) => b.isPaid).length} line item${budgetItems.filter((b) => b.isPaid).length > 1 ? "s" : ""} paid`,
      body: `${formatCurrency(budgetItems.filter((b) => b.isPaid).reduce((s, b) => s + b.actual, 0))} in confirmed payments. ${budgetItems.filter((b) => !b.isPaid).length} item${budgetItems.filter((b) => !b.isPaid).length !== 1 ? "s" : ""} still pending.`,
      impact: `${formatCurrency(projectedSpend - actualSpend)} still committed but unpaid`,
    },
    budgetItems.filter((b) => b.dueDate && !b.isPaid).length > 0 && {
      icon: Info,
      colorClass: "text-muted-foreground",
      bg: "bg-muted border-border",
      title: "Upcoming payments need attention",
      body: budgetItems
        .filter((b) => b.dueDate && !b.isPaid)
        .slice(0, 2)
        .map((b) => `${b.label}: ${formatCurrency(b.projected)} due ${b.dueDate}`)
        .join(" · "),
      impact: `${budgetItems.filter((b) => b.dueDate && !b.isPaid).length} payment${budgetItems.filter((b) => b.dueDate && !b.isPaid).length > 1 ? "s" : ""} scheduled`,
    },
    budgetItems.length === 0 && {
      icon: Lightbulb,
      colorClass: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-50 border-brand-100 dark:bg-brand-900/20 dark:border-brand-800/40",
      title: "No budget items yet",
      body: "Use the AI Planner to generate a full event plan — it will populate your budget breakdown automatically.",
      impact: "Generate a plan to unlock",
    },
  ].filter(Boolean) as { icon: React.ElementType; colorClass: string; bg: string; title: string; body: string; impact: string }[];

  const categoryTotals = budgetItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.projected;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([cat, projected]) => ({
    name: cat,
    value: projected,
    pct: Math.round((projected / projectedSpend) * 100),
    color: CATEGORY_COLORS[cat] || "#6b7280",
  }));

  const barData = budgetItems.slice(0, 8).map((item) => ({
    name: item.label.slice(0, 18) + (item.label.length > 18 ? "..." : ""),
    Projected: item.projected,
    Actual: item.actual,
  }));

  const trendData = [
    { month: "Jul", Projected: 1150, Actual: 0, Budget: 8000 },
    { month: "Aug", Projected: 7100, Actual: 4350, Budget: 8000 },
    { month: "Sep", Projected: 12120, Actual: 0, Budget: 8000 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="page-title">Budget Intelligence</h2>
        <p className="page-subtitle">Real-time financial analysis powered by AI</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: formatCurrency(totalBudget), sub: "Hard cap", icon: DollarSign, color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/40" },
          { label: "Projected Spend", value: formatCurrency(projectedSpend), sub: `${budgetPct}% of budget`, icon: TrendingUp, color: budgetPct > 90 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400", bg: budgetPct > 90 ? "bg-rose-50 dark:bg-rose-900/40" : "bg-amber-50 dark:bg-amber-900/40" },
          { label: "Paid to Date", value: formatCurrency(actualSpend), sub: `${Math.round((actualSpend / projectedSpend) * 100)}% of committed`, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/40" },
          { label: "Remaining", value: formatCurrency(remaining), sub: remaining < 500 ? "Dangerously low" : "Available buffer", icon: remaining < 500 ? AlertTriangle : DollarSign, color: remaining < 500 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400", bg: remaining < 500 ? "bg-rose-50 dark:bg-rose-900/40" : "bg-emerald-50 dark:bg-emerald-900/40" },
        ].map(({ label, value, sub, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-base p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
            </div>
            <div className="text-2xl font-bold font-display text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card-base p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-foreground">Budget Allocation</div>
          <div className={cn("text-xs font-semibold", budgetPct >= 95 ? "text-rose-600" : budgetPct >= 80 ? "text-amber-600" : "text-emerald-600")}>
            {budgetPct}% allocated {budgetPct >= 95 && "— Critically low buffer"}
          </div>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div className="h-full flex rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(actualSpend / totalBudget) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-emerald-500" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${((projectedSpend - actualSpend) / totalBudget) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 }} className="h-full bg-brand-500" />
          </div>
        </div>
        <div className="flex items-center gap-5 mt-3">
          {[
            { color: "bg-emerald-500", label: `Paid — ${formatCurrency(actualSpend)}` },
            { color: "bg-brand-500", label: `Committed — ${formatCurrency(projectedSpend - actualSpend)}` },
            { color: "bg-muted border border-border", label: `Available — ${formatCurrency(remaining)}` },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-base p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-foreground mb-4">Category Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.sort((a, b) => b.value - a.value).slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-muted-foreground capitalize flex-1">{item.name}</span>
                <span className="text-xs font-semibold text-foreground">{formatCurrency(item.value)}</span>
                <span className="text-[10px] text-muted-foreground w-6">{item.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-base p-5 lg:col-span-3">
          <div className="text-sm font-semibold text-foreground mb-4">Projected vs. Actual</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="Projected" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Actual" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-base p-5">
        <div className="text-sm font-semibold text-foreground mb-4">Monthly Spend Trajectory</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Area type="monotone" dataKey="Budget" stroke="#e2e8f0" strokeDasharray="5 5" fill="none" />
            <Area type="monotone" dataKey="Projected" stroke="#3b82f6" strokeWidth={2} fill="url(#projGrad)" />
            <Area type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div>
        <div className="section-label mb-3">AI Recommendations</div>
        <div className="grid md:grid-cols-2 gap-4">
          {AI_RECOMMENDATIONS.map(({ icon: Icon, colorClass, bg, title, body, impact }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.07 }} className={cn("rounded-xl border p-4", bg)}>
              <div className="flex items-start gap-3">
                <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", colorClass)} />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">{title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{body}</p>
                  <div className={cn("text-[10px] font-semibold", colorClass)}>Impact: {impact}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="card-base overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold text-foreground">Budget Line Items</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Category", "Description", "Projected", "Actual", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {budgetItems.map((item) => (
                <tr key={item._id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded capitalize"
                      style={{ background: (CATEGORY_COLORS[item.category] || "#6b7280") + "20", color: CATEGORY_COLORS[item.category] || "#6b7280" }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground max-w-xs">
                    <div className="truncate">{item.label}</div>
                    {item.notes && <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.notes}</div>}
                  </td>
                  <td className="px-5 py-3 font-semibold text-foreground">{formatCurrency(item.projected)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{item.actual > 0 ? formatCurrency(item.actual) : "—"}</td>
                  <td className="px-5 py-3">
                    {item.isPaid ? (
                      <span className="badge-green"><CheckCircle2 className="w-3 h-3 inline mr-1" />Paid</span>
                    ) : item.dueDate ? (
                      <span className="badge-amber">Due {item.dueDate}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
