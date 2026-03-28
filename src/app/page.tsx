"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  MapPin,
  DollarSign,
  Ticket,
  Mic,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Shield,
  Star,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold font-display text-foreground">Com-Plan-ion</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
            <Link href="#sponsors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Powered by</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-secondary text-sm hidden md:flex">
              Dashboard
            </Link>
            <Link href="/demo" className="btn-primary text-sm">
              <Zap className="w-3.5 h-3.5" />
              Launch Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        {/* Background grid */}
        <div className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-brand-100/60 to-transparent rounded-full blur-3xl" />

        <motion.div
          className="relative max-w-5xl mx-auto text-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              AI-powered event planning · Demo mode available
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold font-display leading-[1.08] tracking-tight text-foreground mb-6"
          >
            Your AI event planner
            <br />
            <span className="text-gradient">that never forgets.</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From first idea to on-site check-in — Com-Plan-ion orchestrates vendors, catches conflicts,
            mints tickets, and gives every guest a live AI voice concierge.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="btn-primary text-base px-7 py-3 shadow-glow">
              <Zap className="w-4 h-4" />
              Run 3-Minute Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-7 py-3">
              Open Dashboard
            </Link>
          </motion.div>

          <motion.div variants={fadeIn} className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            {["No credit card required", "Mock mode included", "Works offline"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Product preview ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mt-20"
        >
          <div className="rounded-2xl border border-border shadow-card-xl overflow-hidden bg-card">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-3">
                <div className="max-w-xs mx-auto px-3 py-1 rounded bg-background border border-border text-xs text-muted-foreground text-center">
                  complanion.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard preview mockup */}
            <div className="flex h-[420px] bg-muted/20">
              {/* Sidebar */}
              <div className="w-52 border-r border-border bg-card flex flex-col py-4 gap-1 px-2">
                <div className="px-3 py-2 flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold font-display">Com-Plan-ion</span>
                </div>
                {[
                  { icon: Brain, label: "AI Planner", active: true },
                  { icon: MapPin, label: "Vendors" },
                  { icon: DollarSign, label: "Budget" },
                  { icon: Ticket, label: "Tickets" },
                  { icon: Mic, label: "Voice" },
                ].map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${active ? "bg-brand-50 text-brand-700 font-medium" : "text-muted-foreground"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* Chat panel */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">AI Planning Chat</div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-brand-600 text-white text-xs px-3 py-2 rounded-xl rounded-br-sm max-w-[80%]">
                        "I want a rustic outdoor networking event for 200 people in September, budget $8k..."
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex-shrink-0 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-card border border-border text-xs px-3 py-2 rounded-xl rounded-tl-sm max-w-[85%] text-foreground leading-relaxed">
                        I've generated a full event plan with 3 AI insights, vendor matches, and budget analysis. Two conflicts detected and flagged.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <div className="flex-1 h-8 rounded-lg border border-border bg-background shimmer" />
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Plan panel */}
                <div className="w-56 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Event Plan</div>
                  <div className="space-y-2">
                    {[
                      { label: "Theme", value: "Rustic Outdoor" },
                      { label: "Guests", value: "200 people" },
                      { label: "Date", value: "Sep 20, 2025" },
                      { label: "Budget", value: "$8,000" },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-card border border-border rounded-lg px-3 py-2">
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                        <div className="text-xs font-medium text-foreground">{value}</div>
                      </div>
                    ))}
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <div className="text-[10px] text-amber-600 font-medium">⚠ 2 Conflicts Detected</div>
                      <div className="text-[10px] text-amber-700 mt-0.5">Deposit timing issue · Budget at 96%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-12 bg-card border border-border rounded-xl shadow-card-md px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Ticket Minted</div>
              <div className="text-[10px] text-muted-foreground">Solana devnet · 2.1s</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -left-4 bottom-16 bg-card border border-border rounded-xl shadow-card-md px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
              <Mic className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Voice Concierge</div>
              <div className="text-[10px] text-muted-foreground">Powered by ElevenLabs</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Sponsor badges ───────────────────────────────────────────────── */}
      <section id="sponsors" className="py-14 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            Powered by
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Gemini", color: "from-blue-500 to-purple-500", desc: "AI Planning & Reasoning", letter: "G" },
              { name: "MongoDB", color: "from-green-500 to-emerald-600", desc: "Vector Search & Memory", letter: "M" },
              { name: "Solana", color: "from-purple-500 to-violet-600", desc: "NFT Tickets & Payments", letter: "◎" },
              { name: "ElevenLabs", color: "from-orange-500 to-amber-500", desc: "Voice Concierge", letter: "11" },
            ].map(({ name, color, desc, letter }) => (
              <div key={name} className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-card hover:shadow-card-md transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {letter}
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-foreground">{name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display text-foreground mb-4">
              Everything your event needs,{" "}
              <span className="text-gradient">orchestrated by AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One platform that connects planning, vendors, budgets, tickets, and guest experience — all powered by AI that remembers every decision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                color: "bg-brand-50 text-brand-600",
                badge: "Gemini API",
                title: "AI Planning Workspace",
                description: "Speak naturally about your event. Gemini transforms your vision into a structured plan with budget breakdowns, schedules, and risk flags — in seconds.",
                bullets: ["Natural language → structured plan", "Persistent AI memory across sessions", "Conflict detection & proactive alerts"],
              },
              {
                icon: MapPin,
                color: "bg-emerald-50 text-emerald-600",
                badge: "MongoDB Atlas",
                title: "Semantic Vendor Matching",
                description: "Describe what you want in plain English. MongoDB vector search surfaces the most semantically relevant vendors with AI-generated match reasoning.",
                bullets: ["Atlas Vector Search embeddings", "AI reasoning for every match", "Compare vendors side-by-side"],
              },
              {
                icon: DollarSign,
                color: "bg-amber-50 text-amber-600",
                badge: "AI Intelligence",
                title: "Budget Intelligence",
                description: "Real-time budget tracking with predictive analytics. See how vendor choices ripple through your budget before you commit.",
                bullets: ["Projected vs actual spend", "Category risk indicators", '"What-if" vendor analysis'],
              },
              {
                icon: Ticket,
                color: "bg-violet-50 text-violet-600",
                badge: "Solana",
                title: "NFT Tickets That Work",
                description: "Compressed NFT tickets with rich metadata — tier, meal preference, dietary restrictions, and proof-of-attendance. Not just collectibles.",
                bullets: ["Solana devnet minting in 2s", "QR code with on-chain verification", "Loyalty tiers for returning guests"],
              },
              {
                icon: Mic,
                color: "bg-rose-50 text-rose-600",
                badge: "ElevenLabs",
                title: "Voice Concierge",
                description: "Every guest gets a natural AI voice concierge that answers questions about schedule, parking, meals, and access — in the organizer's own voice.",
                bullets: ["Natural conversational responses", "Organizer voice cloning", "Pulls live data from event"],
              },
              {
                icon: Shield,
                color: "bg-cyan-50 text-cyan-600",
                badge: "Operations",
                title: "Timeline & Ops Control",
                description: "A milestone-driven ops board with real-time updates, deposit deadlines, and a day-of run-of-show — all synced to MongoDB change streams.",
                bullets: ["Live change stream updates", "Conflict-aware deadline tracking", "Day-of run-of-show mode"],
              },
            ].map(({ icon: Icon, color, badge, title, description, bullets }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-hover p-6 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{badge}</span>
                    <h3 className="text-base font-semibold text-foreground font-display">{title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
                <ul className="space-y-1.5">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-muted/30 border-t border-border px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display text-foreground mb-4">
              From idea to check-in{" "}
              <span className="text-gradient">in minutes</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { step: "01", title: "Describe your event in plain English", desc: "Tell the AI what you want — theme, vibe, headcount, budget. No forms to fill.", icon: Sparkles },
              { step: "02", title: "AI generates a full structured plan", desc: "Gemini creates schedule, vendor recommendations, budget breakdown, and flags risks.", icon: Brain },
              { step: "03", title: "Match vendors with semantic search", desc: "MongoDB vector search finds the most relevant vendors for your specific needs.", icon: Star },
              { step: "04", title: "Mint NFT tickets for every guest", desc: "Solana-powered tickets with metadata, QR codes, and proof-of-attendance.", icon: Ticket },
              { step: "05", title: "Voice concierge handles guests", desc: "ElevenLabs powers a 24/7 AI concierge that speaks in your voice.", icon: Mic },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 items-start p-5 rounded-xl bg-card border border-border hover:shadow-card-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono font-bold text-brand-400">{step}</span>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-12 shadow-card-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern opacity-20" />
            <div className="relative">
              <h2 className="text-3xl font-bold font-display text-white mb-4">
                See it in action — 3 minutes
              </h2>
              <p className="text-brand-200 mb-8 text-lg">
                Watch the full end-to-end demo: from natural language input to minted NFT ticket and voice concierge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-700 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  Run Hackathon Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-700/50 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors border border-white/20"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold font-display">Com-Plan-ion</span>
          </div>
          <p className="text-xs text-muted-foreground">Built for IndyHack 2026 · Powered by Gemini, MongoDB, Solana, ElevenLabs</p>
        </div>
      </footer>
    </div>
  );
}
