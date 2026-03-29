"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Brain, Users, Ticket, Mic, ArrowRight, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing/Nav";
import { MarketingFooter } from "@/components/marketing/Footer";

const STEPS = [
  {
    step: "01",
    icon: Sparkles,
    title: "Describe your event",
    subtitle: "No forms. Just conversation.",
    desc: "Tell the AI what you want — theme, vibe, headcount, budget. Complanion understands natural language and remembers every detail across sessions. No templates, no dropdowns.",
    badge: "Natural Language",
    badgeColor: "badge-blue",
    dotColor: "bg-brand-500",
    iconBg: "bg-brand-50 dark:bg-brand-900/30",
    iconColor: "text-brand-600 dark:text-brand-400",
    lineColor: "from-brand-400 to-violet-400",
    preview: (
      <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground italic leading-relaxed">
        "I need a rustic outdoor networking event for 200 people in September, around $8k, vegetarian-friendly catering, warm Google-level vibe..."
      </div>
    ),
  },
  {
    step: "02",
    icon: Brain,
    title: "Gemini builds your full plan",
    subtitle: "Structured in seconds.",
    desc: "A complete event plan is generated — run-of-show schedule, budget breakdown by category, vendor recommendations, conflict alerts, and a prioritized action list. All in one shot.",
    badge: "Gemini API",
    badgeColor: "badge-blue",
    dotColor: "bg-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    lineColor: "from-violet-400 to-emerald-400",
    preview: (
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Schedule", val: "8 items" },
          { label: "Budget", val: "$7,840" },
          { label: "Risks", val: "3 flagged" },
          { label: "Actions", val: "5 next" },
        ].map(({ label, val }) => (
          <div key={label} className="px-3 py-2 rounded-lg bg-muted/60 border border-border">
            <div className="text-[10px] text-muted-foreground">{label}</div>
            <div className="text-xs font-semibold text-foreground">{val}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "03",
    icon: Users,
    title: "Match vendors by meaning, not keyword",
    subtitle: "AI-reasoned, not filtered.",
    desc: "MongoDB Atlas Vector Search surfaces vendors that semantically match your brief. Not \"catering\" — but \"rustic outdoor vegetarian catering with warm aesthetic\". Each match comes with AI reasoning.",
    badge: "MongoDB Atlas",
    badgeColor: "badge-green",
    dotColor: "bg-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    lineColor: "from-emerald-400 to-amber-400",
    preview: (
      <div className="space-y-2">
        {[
          { name: "Willow Catering Co.", score: 96 },
          { name: "Oak & Stone Events", score: 89 },
          { name: "The Garden Table", score: 83 },
        ].map(({ name, score }) => (
          <div key={name} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground flex-1 truncate">{name}</span>
            <div className="w-20 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${score}%` }} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 w-6 text-right">{score}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "04",
    icon: Ticket,
    title: "Mint NFT tickets in under 2 seconds",
    subtitle: "On-chain. Instantly verifiable.",
    desc: "Issue compressed NFT tickets on Solana with rich metadata — tier, meal preference, dietary restrictions, seat. QR code check-in and proof-of-attendance built in. No wallet required for guests.",
    badge: "Solana",
    badgeColor: "badge-blue",
    dotColor: "bg-violet-600",
    iconBg: "bg-violet-50 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    lineColor: "from-amber-400 to-rose-400",
    preview: (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-100 dark:border-violet-800/30">
        <div className="w-10 h-10 rounded-lg bg-violet-200 dark:bg-violet-800/60 grid grid-cols-3 gap-px p-1.5 flex-shrink-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={`rounded-sm ${[0, 2, 4, 6, 8].includes(i) ? "bg-violet-700 dark:bg-violet-300" : "bg-violet-300 dark:bg-violet-600/40"}`} />
          ))}
        </div>
        <div>
          <div className="text-xs font-bold text-violet-800 dark:text-violet-200">VIP · Seat A-14</div>
          <div className="text-[10px] text-violet-600 dark:text-violet-400">Vegetarian · Verified ✓</div>
          <div className="text-[10px] text-violet-500 dark:text-violet-500 mt-0.5">Minted 1.8s · Solana Devnet</div>
        </div>
      </div>
    ),
  },
  {
    step: "05",
    icon: Mic,
    title: "Voice concierge handles your guests",
    subtitle: "Your voice, always available.",
    desc: "ElevenLabs voice cloning powers a 24/7 AI concierge that sounds like you. Guests ask about parking, schedule, meals — it answers naturally, pulling live data from your event plan.",
    badge: "ElevenLabs",
    badgeColor: "badge-rose",
    dotColor: "bg-rose-500",
    iconBg: "bg-rose-50 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    lineColor: null,
    preview: (
      <div className="space-y-2">
        <div className="flex items-center gap-1 h-6">
          {[2, 4, 7, 5, 10, 6, 3, 8, 12, 6, 4, 9, 5, 2, 7, 4, 2].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-rose-400 dark:bg-rose-500"
              style={{ height: `${h}px`, opacity: i >= 7 && i <= 9 ? 1 : 0.3 + (i % 4) * 0.15 }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-600">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          "The venue is at 340 Oak St. Parking is available behind the building."
        </div>
      </div>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800/50 mb-5">
              <Zap className="w-3.5 h-3.5" />
              5 steps · ~5 minutes · zero spreadsheets
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-4">
              From a sentence to a{" "}
              <span className="text-gradient">full event.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Complanion connects planning, vendors, tickets, and guest experience into one AI-driven flow. Here's exactly how it works.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-brand-300 via-emerald-300 to-rose-300 dark:from-brand-700 dark:via-emerald-700 dark:to-rose-700 hidden sm:block" />

            <div className="space-y-5">
              {STEPS.map(({ step, icon: Icon, title, subtitle, desc, badge, badgeColor, dotColor, iconBg, iconColor, preview }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.09 }}
                  className="flex gap-5 sm:gap-6 items-start"
                >
                  {/* Timeline dot */}
                  <div className={`w-10 h-10 rounded-full ${dotColor} flex items-center justify-center flex-shrink-0 shadow-card-md z-10 mt-0.5`}>
                    <span className="text-white text-xs font-bold font-mono">{step}</span>
                  </div>

                  {/* Card */}
                  <div className="flex-1 card-hover p-5 sm:p-6">
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-sm font-semibold text-foreground font-display leading-snug">{title}</h3>
                          <span className={badgeColor}>{badge}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{subtitle}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
                    {preview}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-12 grid grid-cols-3 gap-4 p-5 rounded-2xl bg-muted/40 border border-border"
          >
            {[
              { val: "< 2s", label: "Ticket mint time" },
              { val: "5 min", label: "Idea to full plan" },
              { val: "24/7", label: "Voice coverage" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-10"
          >
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 sm:p-12 shadow-card-xl relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-dot-pattern opacity-20" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
                  See the whole flow live
                </h2>
                <p className="text-brand-200 mb-7 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                  Watch all 5 steps end-to-end — from a single typed prompt to a minted ticket and a working voice concierge.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-700 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    Run Live Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-700/50 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors border border-white/20"
                  >
                    Open Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
