"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing/Nav";
import { MarketingFooter } from "@/components/marketing/Footer";

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
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex-1 overflow-hidden flex flex-col px-4 sm:px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-grid opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[500px] bg-gradient-radial from-brand-200/70 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-10 left-1/4 w-[300px] sm:w-[400px] h-[200px] sm:h-[300px] bg-gradient-radial from-violet-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-[300px] sm:w-[400px] h-[200px] sm:h-[300px] bg-gradient-radial from-cyan-200/30 to-transparent rounded-full blur-3xl" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center pt-20 sm:pt-32 pb-16 flex-1 flex flex-col items-center justify-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn} className="mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              AI-powered event planning · Demo mode available
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-6xl sm:text-7xl md:text-9xl font-bold font-display leading-[1.0] tracking-tight mb-4 sm:mb-5"
          >
            <span className="text-gradient">Complanion</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl sm:text-2xl md:text-3xl font-semibold font-display text-foreground mb-4 tracking-tight"
          >
            Plan less.{" "}
            <span className="text-muted-foreground font-normal">Accomplish everything.</span>
          </motion.p>

          <motion.p
            variants={fadeIn}
            className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            Your go-to AI companion for planning anything — from first idea to on-site check-in.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/dashboard" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 shadow-glow w-full sm:w-auto justify-center">
              <Sparkles className="w-4 h-4" />
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/demo" className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto justify-center">
              <Zap className="w-4 h-4" />
              Run 3-Min Demo
            </Link>
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
            {["No setup needed", "Works offline", "Mock mode included"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Powered by ───────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 sm:mb-8">
            Powered by
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "Gemini",
                desc: "AI Planning & Reasoning",
                logo: "https://cdn.simpleicons.org/googlegemini/4285F4",
                logoDark: "https://cdn.simpleicons.org/googlegemini/8ab4f8",
              },
              {
                name: "MongoDB",
                desc: "Vector Search & Memory",
                logo: "https://cdn.simpleicons.org/mongodb/47A248",
                logoDark: "https://cdn.simpleicons.org/mongodb/00ED64",
              },
              {
                name: "Solana",
                desc: "NFT Tickets & Payments",
                logo: "https://cdn.simpleicons.org/solana/9945FF",
                logoDark: "https://cdn.simpleicons.org/solana/9945FF",
              },
              {
                name: "ElevenLabs",
                desc: "Voice Concierge",
                logo: "https://cdn.simpleicons.org/elevenlabs/000000",
                logoDark: "https://cdn.simpleicons.org/elevenlabs/ffffff",
              },
            ].map(({ name, desc, logo, logoDark }) => (
              <div key={name} className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl border border-border bg-card hover:shadow-card-md transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-zinc-800 border border-border flex items-center justify-center shadow-sm p-2 sm:p-2.5">
                  {/* light logo */}
                  <img src={logo} alt={name} className="w-full h-full object-contain dark:hidden" />
                  {/* dark logo */}
                  <img src={logoDark} alt={name} className="w-full h-full object-contain hidden dark:block" />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-semibold text-foreground">{name}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
