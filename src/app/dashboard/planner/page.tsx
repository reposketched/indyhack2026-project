"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Sparkles, Brain, RefreshCw,
  AlertTriangle, Lightbulb, ChevronDown, ChevronUp,
  Clock, Users, DollarSign, MapPin, Utensils, CalendarDays,
  Shield, ListChecks, Zap,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { AlertCard } from "@/components/shared/AlertCard";
import { ChatMessageSkeleton } from "@/components/shared/LoadingSkeleton";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { EventPlan } from "@/lib/schemas";

const DEMO_PROMPT = "I want a rustic outdoor networking event for 200 people in September, budget around $8k, with vegetarian-friendly catering and a warm Google-level aesthetic.";

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex gap-1 items-center bg-card border border-border rounded-xl px-4 py-3">
        {[0, 0.15, 0.3].map((delay, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-[typing-dot_1.4s_ease-in-out_infinite]"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function PlanSection({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/50">
      <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm text-foreground leading-snug">{value}</div>
      </div>
    </div>
  );
}

function EventPlanPanel({ plan }: { plan: EventPlan }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ schedule: false, risks: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Plan</span>
        <span className="badge-green ml-auto">Gemini</span>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 dark:bg-brand-900/20 dark:border-brand-800/40">
        <p className="text-sm text-brand-800 dark:text-brand-300 leading-relaxed">{plan.aiSummary}</p>
      </div>

      {/* Key fields */}
      <div className="grid grid-cols-2 gap-2">
        <PlanSection label="Theme" value={plan.theme.split("—")[0].trim()} icon={Sparkles} />
        <PlanSection label="Guests" value={`${plan.guestCount} people`} icon={Users} />
        <PlanSection label="Date & Time" value={`${plan.date} · ${plan.time}`} icon={CalendarDays} />
        <PlanSection label="Duration" value={plan.duration} icon={Clock} />
        <PlanSection label="Budget" value={formatCurrency(plan.budget)} icon={DollarSign} />
        <PlanSection label="Catering" value={plan.cateringStyle} icon={Utensils} />
      </div>

      <PlanSection label="Venue" value={plan.venuePreferences} icon={MapPin} />
      <PlanSection label="Staffing" value={plan.staffingNeeds} icon={Users} />
      {plan.dietaryNotes && (
        <PlanSection label="Dietary Notes" value={plan.dietaryNotes} icon={Shield} />
      )}

      {/* Schedule */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setExpanded((p) => ({ ...p, schedule: !p.schedule }))}
          className="w-full flex items-center justify-between p-3.5 bg-card hover:bg-muted/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Run of Show ({plan.schedule.length} items)</span>
          </div>
          {expanded.schedule ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {expanded.schedule && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border divide-y divide-border">
                {plan.schedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-2.5 bg-card">
                    <span className="text-xs font-mono text-brand-600 w-16 flex-shrink-0">{item.time}</span>
                    <span className="text-xs text-foreground flex-1">{item.activity}</span>
                    <span className="text-xs text-muted-foreground">{item.duration}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Risks */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setExpanded((p) => ({ ...p, risks: !p.risks }))}
          className="w-full flex items-center justify-between p-3.5 bg-card hover:bg-muted/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground">{plan.risks.length} Risks Identified</span>
          </div>
          {expanded.risks ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {expanded.risks && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border divide-y divide-border">
                {plan.risks.map((risk, i) => (
                  <div key={i} className="px-4 py-3 bg-card">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                        risk.severity === "high" ? "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" :
                        risk.severity === "medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" : "bg-muted text-muted-foreground"
                      )}>{risk.severity}</span>
                      <span className="text-xs font-medium text-foreground">{risk.risk}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next actions */}
      <div className="rounded-xl border border-brand-100 bg-brand-50 dark:border-brand-800/40 dark:bg-brand-900/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-400 uppercase tracking-wider">Next Actions</span>
        </div>
        <div className="space-y-1.5">
          {plan.nextActions.map((action, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-brand-300 dark:border-brand-700 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-brand-800 dark:text-brand-300">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PlannerPage() {
  const {
    chatMessages, addChatMessage, isGenerating, setIsGenerating,
    eventPlan, setEventPlan, insights, updateLastMessage,
  } = useEventStore();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isGenerating]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || isGenerating) return;

    setInput("");
    addChatMessage({ role: "user", content: text });
    setIsGenerating(true);

    // Add streaming assistant placeholder
    addChatMessage({ role: "assistant", content: "", isStreaming: true });

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, eventId: "event_demo_001" }),
      });
      const data = await res.json();

      updateLastMessage(data.chatMessage);
      if (data.plan) setEventPlan(data.plan);
      toast.success("Plan generated by Gemini", { description: "Event plan updated with AI analysis." });
    } catch {
      updateLastMessage("I encountered an issue connecting to Gemini. Using cached plan data.");
      toast.error("Gemini connection issue", { description: "Using mock data instead." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDemoFill = () => {
    setInput(DEMO_PROMPT);
    inputRef.current?.focus();
  };

  const unresolvedInsights = insights.filter((i) => !i.isResolved);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col border-r border-border min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">AI Planning Chat</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Gemini · Persistent memory active
              </div>
            </div>
          </div>
          <button
            onClick={handleDemoFill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Demo prompt
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-4">
          {chatMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Tell me about your event</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
                Describe it naturally — I'll generate a full plan, find vendors, flag conflicts, and remember everything.
              </p>
              <button
                onClick={handleDemoFill}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2"
              >
                Try the demo prompt →
              </button>
            </motion.div>
          )}

          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-tl-sm"
                )}
              >
                {msg.isStreaming ? (
                  <div className="flex gap-1 items-center h-4">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-[typing-dot_1.4s_ease-in-out_infinite]"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0 mt-0.5">
                  AO
                </div>
              )}
            </motion.div>
          ))}

          {isGenerating && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
            <TypingIndicator />
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe your event... (Shift+Enter for new line)"
                rows={2}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none scrollbar-hide"
              />
              <button
                onClick={() => setIsListening((v) => !v)}
                className={cn(
                  "absolute right-3 bottom-3 w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                  isListening ? "bg-rose-100 text-rose-600 animate-pulse" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isGenerating}
              className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Plan + Insights ─────────────────────────────────── */}
      <div className="w-96 flex flex-col bg-muted/20 overflow-y-auto scrollbar-thin">
        {/* Plan panel */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-foreground">Event Plan</div>
            {!eventPlan && (
              <button
                onClick={() => handleSend(DEMO_PROMPT)}
                disabled={isGenerating}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <Sparkles className="w-3 h-3" />
                Generate Plan
              </button>
            )}
          </div>

          {isGenerating && !eventPlan ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : eventPlan ? (
            <EventPlanPanel plan={eventPlan} />
          ) : (
            <div className="text-center py-10">
              <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Send a message to generate your event plan</p>
            </div>
          )}
        </div>

        {/* Conflict Detection */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <div className="text-sm font-semibold text-foreground">Conflict Detection</div>
            <span className="ml-auto text-xs text-muted-foreground">{unresolvedInsights.length} unresolved</span>
          </div>

          {unresolvedInsights.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {unresolvedInsights.map((insight, i) => (
                  <AlertCard key={insight._id} insight={insight} delay={i * 0.06} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40">
              <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400">No active conflicts — Gemini is monitoring your event.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
