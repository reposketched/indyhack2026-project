"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Brain, Users, DollarSign, Ticket, Mic, CheckCircle2,
  ChevronRight, Sparkles, Zap, Play, RotateCcw, ExternalLink,
  AlertTriangle, Star, Send,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useEventStore } from "@/lib/store/eventStore";
import { DEMO_EVENT_PLAN } from "@/lib/data/events";
import { getMockVendorMatches } from "@/lib/data/vendors";
import { sleep } from "@/lib/utils";
import { toast } from "sonner";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorColor: string;
  icon: React.ElementType;
  href?: string;
  duration: number;
}

const DEMO_STEPS: DemoStep[] = [
  { id: "intro", title: "Com-Plan-ion Demo", description: "AI-powered end-to-end event planning platform", sponsor: "", sponsorColor: "", icon: Sparkles, duration: 2000 },
  { id: "typing", title: "Organizer describes event", description: "Natural language input → AI planning", sponsor: "Gemini", sponsorColor: "from-blue-500 to-purple-500", icon: Brain, href: "/dashboard/planner", duration: 3000 },
  { id: "generating", title: "Gemini generates full plan", description: "Structured event plan with schedule, budget, risks", sponsor: "Gemini", sponsorColor: "from-blue-500 to-purple-500", icon: Brain, href: "/dashboard/planner", duration: 3500 },
  { id: "vendors", title: "MongoDB finds vendors", description: "Atlas vector search — semantic vendor matching", sponsor: "MongoDB", sponsorColor: "from-green-500 to-emerald-600", icon: Users, href: "/dashboard/vendors", duration: 3000 },
  { id: "conflicts", title: "AI detects conflicts", description: "Budget risk + deposit timing conflict flagged", sponsor: "Gemini", sponsorColor: "from-blue-500 to-purple-500", icon: AlertTriangle, href: "/dashboard/planner", duration: 2500 },
  { id: "budget", title: "Budget intelligence", description: "Projected vs actual · category breakdown", sponsor: "MongoDB", sponsorColor: "from-green-500 to-emerald-600", icon: DollarSign, href: "/dashboard/budget", duration: 2500 },
  { id: "minting", title: "Minting NFT ticket", description: "Solana devnet · compressed NFT · rich metadata", sponsor: "Solana", sponsorColor: "from-purple-500 to-violet-600", icon: Ticket, href: "/dashboard/tickets", duration: 4000 },
  { id: "guest", title: "Guest event microsite", description: "Public-facing event page with RSVP + concierge", sponsor: "", sponsorColor: "", icon: ExternalLink, href: "/event/rustic-networking-sept-2025", duration: 2500 },
  { id: "voice", title: "Voice concierge answers", description: "ElevenLabs AI concierge answers guest questions", sponsor: "ElevenLabs", sponsorColor: "from-orange-500 to-amber-500", icon: Mic, href: "/dashboard/voice", duration: 3500 },
  { id: "complete", title: "Demo complete!", description: "From natural language to minted ticket in 3 minutes", sponsor: "", sponsorColor: "", icon: CheckCircle2, duration: 0 },
];

const DEMO_PROMPT = "I want a rustic outdoor networking event for 200 people in September, budget around $8k, with vegetarian-friendly catering and a warm Google-level aesthetic.";

function StepIndicator({ steps, currentStep }: { steps: DemoStep[]; currentStep: number }) {
  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < currentStep ? "bg-emerald-500" : i === currentStep ? "bg-brand-500 scale-125" : "bg-muted-foreground/30"
          }`} />
          {i < steps.length - 1 && <div className="w-3 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}

export default function DemoPage() {
  const { addChatMessage, setEventPlan, setVendorResults, setMintedTicketAddress, addVoiceEntry } = useEventStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [typedPrompt, setTypedPrompt] = useState("");
  const cancelRef = useRef(false);

  const currentStep = DEMO_STEPS[currentStepIdx];

  useEffect(() => {
    return () => { cancelRef.current = true; };
  }, []);

  const runDemo = async () => {
    cancelRef.current = false;
    setIsRunning(true);
    setIsComplete(false);
    setCurrentStepIdx(0);

    const steps = [
      // Step 0: Intro
      async () => {
        await sleep(DEMO_STEPS[0].duration);
      },

      // Step 1: Typing
      async () => {
        setCurrentStepIdx(1);
        toast.info("Demo: Organizer typing...", { duration: 2000 });
        let typed = "";
        for (const char of DEMO_PROMPT) {
          if (cancelRef.current) return;
          typed += char;
          setTypedPrompt(typed);
          await sleep(25 + Math.random() * 20);
        }
        addChatMessage({ role: "user", content: DEMO_PROMPT });
        await sleep(500);
      },

      // Step 2: Gemini generating
      async () => {
        setCurrentStepIdx(2);
        toast.info("Demo: Gemini generating plan...", { duration: 2500 });
        addChatMessage({ role: "assistant", content: "", isStreaming: true });
        await sleep(2000);
        const response = `I've analyzed your request and generated a complete event plan for the **Roots & Reach: Autumn Networking Summit**.

**Theme:** Rustic Outdoor Networking — warm, professional, nature-forward

I've structured a station-based catering approach (not sit-down) to maximize networking flow, and scheduled a 5PM start to capture the golden hour photography window.

**⚠ 2 conflicts detected** — review in the Conflicts panel below.

Shall I adjust anything? I remember all previous decisions.`;
        setEventPlan(DEMO_EVENT_PLAN);
        await sleep(500);
      },

      // Step 3: Vendors
      async () => {
        setCurrentStepIdx(3);
        toast.success("Demo: MongoDB searching vendors...", { duration: 2000 });
        await sleep(800);
        const vendors = getMockVendorMatches("rustic outdoor catering vegetarian networking");
        setVendorResults(vendors as ReturnType<typeof getMockVendorMatches>);
        await sleep(2000);
      },

      // Step 4: Conflicts
      async () => {
        setCurrentStepIdx(4);
        toast.warning("Demo: Conflicts detected!", { duration: 2000 });
        await sleep(DEMO_STEPS[4].duration);
      },

      // Step 5: Budget
      async () => {
        setCurrentStepIdx(5);
        toast.info("Demo: Budget analysis...", { duration: 2000 });
        await sleep(DEMO_STEPS[5].duration);
      },

      // Step 6: Minting
      async () => {
        setCurrentStepIdx(6);
        toast.info("Demo: Minting NFT ticket on Solana...", { duration: 3000 });
        await sleep(3000);
        const fakeAddress = Array.from({ length: 44 }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]).join("");
        setMintedTicketAddress(fakeAddress);
        toast.success("NFT minted!", { description: `Solana devnet · ${fakeAddress.slice(0, 12)}...` });
        await sleep(1000);
      },

      // Step 7: Guest page
      async () => {
        setCurrentStepIdx(7);
        toast.info("Demo: Guest event page ready", { duration: 2000 });
        await sleep(DEMO_STEPS[7].duration);
      },

      // Step 8: Voice
      async () => {
        setCurrentStepIdx(8);
        toast.info("Demo: ElevenLabs voice concierge...", { duration: 2000 });
        const q = "Where do I park?";
        const a = "Free parking is available in the main lot at Iron & Ember Events on Brookshire Pkwy, Carmel. Overflow lots are also on-site. Rideshare drop-off at the main entrance.";
        addVoiceEntry({ question: q, answer: a });
        if (typeof window !== "undefined") {
          const utterance = new SpeechSynthesisUtterance(a);
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }
        await sleep(DEMO_STEPS[8].duration);
      },

      // Step 9: Complete
      async () => {
        setCurrentStepIdx(9);
        setIsComplete(true);
        setIsRunning(false);
        toast.success("Demo complete! 🎉", { description: "From idea to minted ticket in ~3 minutes" });
      },
    ];

    for (const step of steps) {
      if (cancelRef.current) break;
      await step();
    }
  };

  const reset = () => {
    cancelRef.current = true;
    setCurrentStepIdx(-1);
    setIsRunning(false);
    setIsComplete(false);
    setTypedPrompt("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold font-display">Com-Plan-ion</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard" className="btn-secondary text-sm">Dashboard</Link>
            <button onClick={reset} className="btn-ghost text-sm">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800/50 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Hackathon Demo · IndyHack 2026
          </div>
          <h1 className="text-4xl font-bold font-display text-foreground mb-4">
            Watch Com-Plan-ion in Action
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A 3-minute end-to-end demo: natural language → AI plan → vendor search → NFT ticket → voice concierge.
          </p>
        </div>

        {/* Demo runner */}
        {currentStepIdx === -1 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-base p-10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Play className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-display text-foreground mb-3">Ready to run</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
              The demo will walk through all 9 steps automatically. Sit back and narrate along — or click into any page to explore manually.
            </p>
            <button onClick={runDemo} className="btn-primary text-base px-8 py-3 shadow-glow">
              <Zap className="w-4 h-4" />
              Run Hackathon Demo
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Step indicator */}
            <div className="text-center">
              <StepIndicator steps={DEMO_STEPS} currentStep={currentStepIdx} />
            </div>

            {/* Current step card */}
            <AnimatePresence mode="wait">
              {currentStep && (
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className="card-base p-8 text-center"
                >
                  {/* Sponsor badge */}
                  {currentStep.sponsor && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${currentStep.sponsorColor} text-white text-xs font-bold mb-4`}>
                      <Zap className="w-3 h-3" />
                      {currentStep.sponsor}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    currentStep.id === "complete" ? "bg-emerald-50 dark:bg-emerald-900/40" : "bg-brand-50 dark:bg-brand-900/40"
                  }`}>
                    <currentStep.icon className={`w-8 h-8 ${currentStep.id === "complete" ? "text-emerald-600 dark:text-emerald-400" : "text-brand-600 dark:text-brand-400"}`} />
                  </div>

                  <h2 className="text-2xl font-bold font-display text-foreground mb-2">{currentStep.title}</h2>
                  <p className="text-muted-foreground mb-6">{currentStep.description}</p>

                  {/* Typed prompt */}
                  {currentStep.id === "typing" && typedPrompt && (
                    <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-foreground font-mono text-left max-w-lg mx-auto mb-6">
                      &ldquo;{typedPrompt}<span className="animate-pulse">|</span>&rdquo;
                    </div>
                  )}

                  {/* Loading bar */}
                  {isRunning && currentStep.id !== "complete" && (
                    <div className="w-full max-w-xs mx-auto h-1.5 bg-muted rounded-full overflow-hidden mb-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: currentStep.duration / 1000, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                      />
                    </div>
                  )}

                  {/* Navigation links */}
                  {currentStep.href && (
                    <Link
                      href={currentStep.href}
                      target={currentStep.href.startsWith("/event") ? "_blank" : undefined}
                      className="btn-secondary text-sm inline-flex"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open: {currentStep.href}
                    </Link>
                  )}

                  {/* Complete actions */}
                  {isComplete && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3 justify-center">
                        {[
                          { label: "AI Planner", href: "/dashboard/planner", icon: Brain },
                          { label: "Vendors", href: "/dashboard/vendors", icon: Users },
                          { label: "Budget", href: "/dashboard/budget", icon: DollarSign },
                          { label: "Tickets", href: "/dashboard/tickets", icon: Ticket },
                          { label: "Voice", href: "/dashboard/voice", icon: Mic },
                        ].map(({ label, href, icon: Icon }) => (
                          <Link key={href} href={href} className="btn-secondary text-sm flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <button onClick={reset} className="btn-ghost text-sm mx-auto">
                          <RotateCcw className="w-4 h-4" />
                          Run again
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Steps overview */}
        <div>
          <div className="section-label mb-4">Demo Steps</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DEMO_STEPS.filter((s) => s.id !== "intro" && s.id !== "complete").map((step, i) => {
              const isDone = currentStepIdx > i + 1;
              const isActive = currentStepIdx === i + 1;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    isActive ? "border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/30" : isDone ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20" : "border-border bg-card"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDone ? "bg-emerald-100 dark:bg-emerald-900/60" : isActive ? "bg-brand-100 dark:bg-brand-900/60" : "bg-muted"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <step.icon className={`w-4 h-4 ${isActive ? "text-brand-600 dark:text-brand-400" : "text-muted-foreground"}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isActive ? "text-brand-700 dark:text-brand-400" : isDone ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{step.description}</div>
                  </div>
                  {step.sponsor && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${step.sponsorColor} text-white flex-shrink-0`}>
                      {step.sponsor}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sponsor map */}
        <div className="card-base p-6">
          <div className="section-label mb-4">Sponsor Integration Map</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "Gemini", color: "from-blue-500 to-purple-500", desc: "Multimodal planning, structured plan generation, conflict detection, persistent memory", uses: ["AI Planner", "Conflict Detection"] },
              { name: "MongoDB", color: "from-green-500 to-emerald-600", desc: "Atlas Vector Search for vendors, persistent event memory, change streams for live ops", uses: ["Vendor Search", "Event Memory", "Live Updates"] },
              { name: "Solana", color: "from-purple-500 to-violet-600", desc: "Compressed NFT tickets with rich metadata, Solana Pay escrow for vendor payments", uses: ["NFT Tickets", "Vendor Escrow", "Loyalty Tiers"] },
              { name: "ElevenLabs", color: "from-orange-500 to-amber-500", desc: "Natural voice concierge with organizer voice cloning, live event-aware responses", uses: ["Voice Concierge", "Organizer Voice"] },
            ].map(({ name, color, desc, uses }) => (
              <div key={name} className="p-4 rounded-xl border border-border">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold mb-3`}>
                  <Star className="w-3 h-3" />
                  {name}
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {uses.map((use) => (
                    <span key={use} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">{use}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
