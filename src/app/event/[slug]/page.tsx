"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Clock, Users, Utensils, Mic,
  ChevronDown, ChevronUp, CheckCircle2, Sparkles,
  Car, Phone, ArrowRight, Ticket,
} from "lucide-react";
import Link from "next/link";
import { DEMO_EVENT } from "@/lib/data/events";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AGENDA = [
  { time: "5:00 PM", activity: "Arrival & Registration", detail: "Welcome drinks at the main lawn", type: "arrival" },
  { time: "5:30 PM", activity: "Open Networking", detail: "Coffee bar + appetizer stations open", type: "networking" },
  { time: "6:30 PM", activity: "Golden Hour", detail: "Professional photography session", type: "photo" },
  { time: "7:00 PM", activity: "Dinner Stations Open", detail: "Farm-to-table stations from Harvest & Hearth", type: "food" },
  { time: "8:30 PM", activity: "Fireside Speaker Talk", detail: "\"Building in the Open\" — 20 min", type: "talk" },
  { time: "9:00 PM", activity: "Final Networking + Dessert", detail: "Specialty coffee + sweets stations", type: "networking" },
  { time: "10:00 PM", activity: "Event Close", detail: "Coordinated departure with shuttle service", type: "close" },
];

const FAQ = [
  { q: "Is there parking?", a: "Free parking for 300 vehicles in the east field at Meadowbrook Estate. Overflow parking at Westfield Community Center (2 mi) with a complimentary shuttle every 15 minutes." },
  { q: "What food will be available?", a: "Station-based farm-to-table catering from Harvest & Hearth. 60%+ vegetarian options, a fully vegan station, and a specialty coffee bar. All items are labeled with dietary info." },
  { q: "Can I bring a guest?", a: "Each registration is for one attendee. Contact us at hello@complanion.app if you'd like to add a guest — we'll check availability." },
  { q: "What if it rains?", a: "Meadowbrook Estate's restored 1920s barn accommodates up to 140 guests as a backup. We'll notify attendees by 3PM on event day if we're moving indoors." },
  { q: "How do I use my NFT ticket?", a: "Your ticket QR code is in the email you received. At check-in, simply scan it with your phone. The QR code is linked to your Solana NFT — no app download needed." },
  { q: "Is there a dress code?", a: "Smart casual is perfect. It's an outdoor event in September — layer up if you run cold. Comfortable shoes are recommended for the lawn areas." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:text-brand-600 transition-colors group"
      >
        <span className="text-sm font-medium text-foreground group-hover:text-brand-600">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pb-4"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

function ConciergeWidget() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const ask = async () => {
    if (!question.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, voice: "aria" }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      if (typeof window !== "undefined" && data.usedBrowserTTS) {
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setAnswer("I'm having trouble right now. Please check the FAQ section or email us at hello@complanion.app.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-brand-900">AI Voice Concierge</div>
          <div className="text-xs text-brand-600">Powered by ElevenLabs · Ask anything about the event</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Ask a question about the event..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-brand-200 bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <button
          onClick={ask}
          disabled={isAsking || !question.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {isAsking ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Ask"
          )}
        </button>
      </div>
      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white border border-brand-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Concierge</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{answer}</p>
        </motion.div>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {["When does it start?", "Where do I park?", "What food is available?"].map((q) => (
          <button
            key={q}
            onClick={() => { setQuestion(q); }}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EventGuestPage() {
  const event = DEMO_EVENT;
  const [mealPref, setMealPref] = useState("");
  const [rsvpDone, setRsvpDone] = useState(false);

  const handleRSVP = () => {
    if (!mealPref) { toast.error("Please select a meal preference"); return; }
    setRsvpDone(true);
    toast.success("RSVP confirmed!", { description: "Check your email for your NFT ticket." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 pt-20 pb-24 px-6">
        <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Rustic Outdoor Networking · 200 Guests
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              {event.name}
            </h1>
            <p className="text-brand-200 text-lg max-w-xl mx-auto leading-relaxed mb-8">
              {event.description.split(".")[0] + "."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-brand-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                September 20, 2025 · 5:00 PM
              </div>
              <span className="hidden sm:block">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.location.name}, {event.location.city}, {event.location.state}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* RSVP / ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">RSVP & Ticket</div>
              <div className="text-xs text-muted-foreground">NFT ticket sent to your email</div>
            </div>
          </div>

          {rsvpDone ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-sm font-semibold text-emerald-700">You&apos;re confirmed!</div>
                <div className="text-xs text-emerald-600">Your NFT ticket is being minted. Check your email for the QR code.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Meal Preference</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["vegetarian", "vegan", "omnivore", "gluten-free", "halal"].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setMealPref(pref)}
                      className={cn("px-3 py-2 rounded-xl border text-xs font-medium capitalize transition-all",
                        mealPref === pref ? "border-brand-300 bg-brand-50 text-brand-700" : "border-border hover:bg-muted"
                      )}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleRSVP} className="btn-primary w-full justify-center py-3 text-sm">
                Confirm My Spot
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Event details */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: "Date", value: "September 20, 2025" },
            { icon: Clock, label: "Time", value: "5:00 PM – 10:00 PM" },
            { icon: Users, label: "Guests", value: "200 professionals" },
            { icon: MapPin, label: "Venue", value: event.location.name },
            { icon: Utensils, label: "Catering", value: "Farm-to-table stations" },
            { icon: Car, label: "Parking", value: "Free · East field" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
                <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Agenda */}
        <div>
          <h2 className="text-xl font-bold font-display text-foreground mb-5">Event Agenda</h2>
          <div className="space-y-1">
            {AGENDA.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-4 py-3 border-b border-border last:border-0"
              >
                <span className="text-xs font-mono text-brand-600 w-16 flex-shrink-0 pt-0.5">{item.time}</span>
                <div>
                  <div className="text-sm font-medium text-foreground">{item.activity}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Parking */}
        <div className="p-5 rounded-xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Parking & Directions</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{event.location.parkingInfo}</p>
          <div className="mt-3 text-sm text-foreground font-medium">{event.location.address}, {event.location.city}, {event.location.state}</div>
        </div>

        {/* Voice concierge */}
        <ConciergeWidget />

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold font-display text-foreground mb-5">FAQ</h2>
          <div className="card-base px-6 divide-y divide-border">
            {FAQ.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-foreground">Com-Plan-ion</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by Gemini · MongoDB · Solana · ElevenLabs
          </p>
        </div>
      </div>
    </div>
  );
}
