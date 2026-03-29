"use client";

import { motion } from "framer-motion";
import {
  Brain, MapPin, TrendingUp, Ticket, Mic, Shield,
  Sparkles, ArrowRight, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/Nav";
import { MarketingFooter } from "@/components/marketing/Footer";

const FEATURES = [
  {
    icon: Brain,
    iconBg: "bg-brand-50 dark:bg-brand-900/40",
    iconColor: "text-brand-600 dark:text-brand-400",
    badge: "Gemini API",
    title: "AI Planning Workspace",
    description: "Talk to it like a person. Gemini converts rough ideas into a structured plan — schedule, vendor matches, budget breakdown, and risk flags — in seconds.",
    bullets: ["Natural language → structured plan", "Persistent memory across sessions", "Conflict detection & risk alerts"],
    preview: (
      <div className="space-y-2.5">
        <div className="flex justify-end">
          <div className="bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-200 text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[85%] leading-relaxed">
            200-person outdoor event, $8k, September, vegetarian-friendly
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="bg-muted border border-border text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[85%] text-foreground leading-relaxed">
            Plan ready — 8 vendors matched, $7,840 allocated, 3 risks flagged ✓
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: MapPin,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "MongoDB Atlas",
    title: "Semantic Vendor Matching",
    description: "Vector search that understands meaning — not just keywords. Describe the vibe you want and get vendors that actually fit.",
    bullets: ["Atlas Vector Search embeddings", "AI reasoning for every match", "Side-by-side vendor comparison"],
    preview: (
      <div className="space-y-2">
        {[
          { name: "Willow Catering Co.", score: 96 },
          { name: "Oak & Stone Venue", score: 89 },
          { name: "Garden Sounds DJ", score: 82 },
        ].map(({ name, score }) => (
          <div key={name} className="flex items-center gap-2.5">
            <span className="text-xs text-muted-foreground w-32 truncate">{name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs font-bold text-emerald-600 w-8 text-right">{score}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: TrendingUp,
    iconBg: "bg-amber-50 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "AI Intelligence",
    title: "Budget Intelligence",
    description: "Predictive spend tracking with what-if analysis. See how every vendor choice ripples through your budget before you commit.",
    bullets: ["Projected vs actual spend", "Category risk indicators", '"What-if" vendor analysis'],
    preview: (
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" className="text-muted" strokeWidth="6" />
            <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" className="text-amber-500" strokeWidth="6" strokeDasharray="138" strokeDashoffset="42" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">70%</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-foreground">$5,600 <span className="text-muted-foreground text-xs font-normal">allocated</span></div>
          <div className="text-xs text-muted-foreground">$2,400 remaining</div>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
            <TrendingUp className="w-3 h-3" /> On track
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Ticket,
    iconBg: "bg-violet-50 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: "Solana",
    title: "NFT Tickets That Work",
    description: "Compressed NFT tickets with rich metadata — tier, meal preference, dietary restrictions, and proof-of-attendance. Minted in under 2 seconds.",
    bullets: ["Solana devnet minting in ~2s", "QR code with on-chain verification", "Loyalty tiers for returning guests"],
    preview: (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30">
        <div className="w-10 h-10 rounded-lg bg-violet-200 dark:bg-violet-800/60 grid grid-cols-3 gap-px p-1.5 flex-shrink-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={`rounded-sm ${[0, 2, 4, 6, 8].includes(i) ? "bg-violet-700 dark:bg-violet-300" : "bg-violet-300 dark:bg-violet-600/40"}`} />
          ))}
        </div>
        <div>
          <div className="text-xs font-bold text-violet-800 dark:text-violet-200">VIP · Seat A-14</div>
          <div className="text-xs text-violet-600 dark:text-violet-400">Vegetarian · Verified ✓</div>
          <div className="text-[10px] text-violet-500 mt-0.5">Minted 1.8s · Solana Devnet</div>
        </div>
      </div>
    ),
  },
  {
    icon: Mic,
    iconBg: "bg-rose-50 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    badge: "ElevenLabs",
    title: "Voice Concierge",
    description: "Your voice, AI-powered. Answers guest questions 24/7 — parking, schedule, meals — without you lifting a finger.",
    bullets: ["Natural conversational responses", "Organizer voice cloning", "Pulls live data from your event"],
    preview: (
      <div>
        <div className="flex items-center gap-0.5 h-8 mb-2">
          {[2, 5, 8, 6, 11, 7, 4, 9, 13, 7, 5, 10, 6, 3, 8, 5, 2].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-rose-400 dark:bg-rose-500"
              style={{ height: `${h}px`, opacity: i >= 7 && i <= 9 ? 1 : 0.3 + (i % 4) * 0.15 }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          "The venue is at 340 Oak St. Parking is behind the building."
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    iconBg: "bg-cyan-50 dark:bg-cyan-900/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    badge: "Operations",
    title: "Timeline & Ops Control",
    description: "A milestone-driven ops board with live updates, deposit deadlines, and a day-of run-of-show — all synced in real time.",
    bullets: ["Live change stream updates", "Conflict-aware deadline tracking", "Day-of run-of-show mode"],
    preview: (
      <div className="space-y-2">
        {[
          { label: "Venue deposit paid", done: true },
          { label: "Catering confirmed", done: true },
          { label: "Tickets go live", done: false },
        ].map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : "border-2 border-border"}`}>
              {done && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
            </div>
            <span className={`text-xs ${done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>{label}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800/50 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              6 AI-powered modules
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-4">
              Everything your event needs,{" "}
              <span className="text-gradient">in one place.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each module solves a real event headache. Together they form an AI loop that plans, executes, and delights — automatically.
            </p>
          </motion.div>

          {/* Uniform grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, iconBg, iconColor, badge, title, description, bullets, preview }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Icon + badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{badge}</div>
                    <h3 className="text-base font-semibold font-display text-foreground leading-tight">{title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>

                {/* Preview widget */}
                <div className="mb-5 p-3.5 rounded-xl bg-muted/40 border border-border">
                  {preview}
                </div>

                {/* Bullets */}
                <ul className="space-y-2 mt-auto">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-14 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">All 6 modules live in the dashboard — no setup needed</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard" className="btn-primary px-8 py-3 shadow-glow w-full sm:w-auto justify-center">
                <Sparkles className="w-4 h-4" />
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/demo" className="btn-secondary px-8 py-3 w-full sm:w-auto justify-center">
                Run Demo
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
