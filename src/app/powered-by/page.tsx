"use client";

import { motion } from "framer-motion";
import { MarketingNav } from "@/components/marketing/Nav";
import { MarketingFooter } from "@/components/marketing/Footer";

const TECH = [
  {
    name: "Google Gemini",
    letter: "G",
    color: "from-blue-500 to-purple-500",
    tagline: "The brain behind every plan",
    role: "AI Planning & Reasoning",
    description:
      "Gemini powers the core intelligence of Complanion. When you describe your event in plain English, Gemini transforms it into a fully structured plan — complete with schedules, vendor recommendations, budget breakdowns, and risk flags. It also maintains persistent memory across sessions so it never forgets a decision you've made.",
    contributions: [
      "Natural language → structured event plan",
      "Persistent AI memory across planning sessions",
      "Conflict detection and proactive risk alerts",
      "Budget and timeline reasoning",
      "768-dimension embeddings for vendor vector search",
    ],
    model: "gemini-1.5-pro · text-embedding-004",
  },
  {
    name: "MongoDB Atlas",
    letter: "M",
    color: "from-green-500 to-emerald-600",
    tagline: "The memory that never forgets",
    role: "Vector Search & Data Layer",
    description:
      "MongoDB Atlas serves as the persistent memory and search backbone of Complanion. All event data, vendor profiles, budgets, timelines, and AI insights are stored here. Atlas Vector Search enables semantic vendor matching — search by meaning, not just keywords — using Gemini-generated embeddings.",
    contributions: [
      "Stores all event, vendor, guest, and budget data",
      "Atlas Vector Search for semantic vendor matching",
      "Change streams for real-time ops board updates",
      "AI insight and voice log persistence",
      "Escrow milestone and ticket metadata storage",
    ],
    model: "MongoDB Atlas · Vector Search index (768-dim)",
  },
  {
    name: "Solana",
    letter: "◎",
    color: "from-purple-500 to-violet-600",
    tagline: "Tickets with proof on-chain",
    role: "NFT Tickets & Payments",
    description:
      "Solana powers the ticketing layer of Complanion. Each guest receives a compressed NFT ticket containing rich metadata — their tier, meal preference, dietary restrictions, and proof-of-attendance. Tickets are minted on Solana devnet in under 2 seconds and include a scannable QR code for on-site check-in.",
    contributions: [
      "Compressed NFT ticket minting in ~2s",
      "On-chain ticket metadata (tier, meal, access)",
      "QR code generation for on-site check-in",
      "Proof-of-attendance (POAP) support",
      "Escrow milestone payments via smart contracts",
    ],
    model: "Solana devnet · Metaplex Bubblegum (cNFT)",
  },
  {
    name: "ElevenLabs",
    letter: "11",
    color: "from-orange-500 to-amber-500",
    tagline: "Every guest hears your voice",
    role: "Voice Concierge",
    description:
      "ElevenLabs gives every guest a natural AI voice concierge — available 24/7 to answer questions about schedule, parking, meals, and access. Organizers can optionally clone their own voice so the concierge speaks with a personal touch. Powered by ElevenLabs' turbo model for ultra-low latency responses.",
    contributions: [
      "Natural text-to-speech for all AI responses",
      "Organizer voice cloning via ElevenLabs Voice Lab",
      "24/7 guest concierge on the public event page",
      "Pulls live event data into every answer",
      "Voice log storage for post-event review",
    ],
    model: "eleven_turbo_v2 · voice cloning enabled",
  },
];

export default function PoweredByPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground mb-4">
              Built on the{" "}
              <span className="text-gradient">best in class</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Complanion integrates four best-in-class platforms — each handling a distinct layer of the event planning stack.
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {TECH.map(({ name, letter, color, tagline, role, description, contributions, model }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8"
              >
                {/* Icon + identity */}
                <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg`}>
                    {letter}
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold font-display text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2 italic">"{tagline}"</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">What it powers in Complanion</p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {contributions.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${color} flex-shrink-0`} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[10px] font-mono text-muted-foreground">
                    {model}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
