"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Clock, Users, Utensils, Mic,
  ChevronDown, ChevronUp, CheckCircle2, Sparkles,
  Car, ArrowRight, Ticket, Navigation, Footprints,
  Bike, Bus, ExternalLink, Loader2,
} from "lucide-react";
import Link from "next/link";
import { DEMO_EVENT } from "@/lib/data/events";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VENUE_ADDRESS = "12120 Brookshire Pkwy, Carmel, IN 46033";
const VENUE_MAPS_QUERY = encodeURIComponent(VENUE_ADDRESS);

// OpenStreetMap embed — no API key, no billing, 100% free
// Centered on 12120 Brookshire Pkwy, Carmel, IN 46033 (coords: 39.9738, -86.1258)
const OSM_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=-86.145%2C39.966%2C-86.108%2C39.982&layer=mapnik&marker=39.9738%2C-86.1258";
const OSM_LINK_URL =
  "https://www.openstreetmap.org/?mlat=39.9738&mlon=-86.1258#map=16/39.9738/-86.1258";

type TravelMode = "driving" | "walking" | "bicycling" | "cycling" | "transit";
interface TravelResult {
  mode: TravelMode;
  durationText: string;
  durationSeconds: number;
}

const MODE_ICON: Record<string, React.ElementType> = {
  driving: Car,
  walking: Footprints,
  cycling: Bike,
  bicycling: Bike,
  transit: Bus,
};

const MODE_LABEL: Record<string, string> = {
  driving: "Drive",
  walking: "Walk",
  cycling: "Bike",
  bicycling: "Bike",
  transit: "Transit",
};

// Maps OSRM mode → Google Maps travelmode param
const MODE_GMAPS: Record<string, string> = {
  driving: "driving",
  walking: "walking",
  cycling: "bicycling",
  bicycling: "bicycling",
  transit: "transit",
};

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
  { q: "Is there parking?", a: "Free parking is available in the main lot and overflow lots at Iron & Ember Events, 12120 Brookshire Pkwy, Carmel. Rideshare drop-off is at the main entrance on Brookshire Pkwy. Bike racks are near the entrance." },
  { q: "What food will be available?", a: "Station-based farm-to-table catering from Harvest & Hearth. 60%+ vegetarian options, a fully vegan station, and a specialty coffee bar. All items are labeled with dietary info." },
  { q: "Can I bring a guest?", a: "Each registration is for one attendee. Contact us at hello@complanion.app if you'd like to add a guest — we'll check availability." },
  { q: "What if it rains?", a: "Iron & Ember Events has a covered indoor space accommodating up to 140 guests as a backup. We'll notify attendees by 3PM on event day if we're moving indoors." },
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
    <div className="rounded-2xl border border-brand-100 bg-brand-50 dark:border-brand-800/40 dark:bg-brand-900/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-brand-900 dark:text-brand-300">AI Voice Concierge</div>
          <div className="text-xs text-brand-600 dark:text-brand-400">Powered by ElevenLabs · Ask anything about the event</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Ask a question about the event..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-700"
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
          className="p-4 rounded-xl bg-white dark:bg-card border border-brand-100 dark:border-brand-800/40"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Concierge</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{answer}</p>
        </motion.div>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {["When does it start?", "Where do I park?", "What food is available?"].map((q) => (
          <button
            key={q}
            onClick={() => { setQuestion(q); }}
            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-card border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
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
  const [travelResults, setTravelResults] = useState<TravelResult[] | null>(null);
  const [travelLoading, setTravelLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    setTravelLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
        try {
          const res = await fetch(`/api/directions?origin=${origin}`);
          const data = await res.json();
          if (data.all) setTravelResults(data.all as TravelResult[]);
        } catch {
          // silently fail — map still shows
        } finally {
          setTravelLoading(false);
        }
      },
      () => {
        setGeoError(true);
        setTravelLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  // Pick best result: shortest, excluding any that are > 6 hours (unrealistic for local event)
  const bestResult = travelResults
    ?.filter((r) => r.durationSeconds < 21600)
    .sort((a, b) => a.durationSeconds - b.durationSeconds)[0];

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
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">RSVP & Ticket</div>
              <div className="text-xs text-muted-foreground">NFT ticket sent to your email</div>
            </div>
          </div>

          {rsvpDone ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">You&apos;re confirmed!</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500">Your NFT ticket is being minted. Check your email for the QR code.</div>
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
                        mealPref === pref ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/40 dark:text-brand-400" : "border-border hover:bg-muted"
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
            { icon: MapPin, label: "Venue", value: "Iron & Ember Events" },
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

        {/* Parking + Map */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Parking & Directions</h3>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${VENUE_MAPS_QUERY}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{event.location.parkingInfo}</p>

            {/* Address + travel time */}
            <div className="mt-3 flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                {event.location.address}, {event.location.city}, {event.location.state}
              </div>

              {travelLoading && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Calculating distance…
                </span>
              )}

              {bestResult && !travelLoading && (() => {
                const Icon = MODE_ICON[bestResult.mode];
                return (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/40">
                    <Icon className="w-3.5 h-3.5" />
                    {bestResult.durationText} · {MODE_LABEL[bestResult.mode]}
                  </span>
                );
              })()}

              {/* All modes strip */}
              {travelResults && travelResults.length > 1 && !travelLoading && (
                <div className="flex flex-wrap gap-1.5 w-full mt-1">
                  {travelResults
                    .filter((r) => r.durationSeconds < 21600)
                    .sort((a, b) => a.durationSeconds - b.durationSeconds)
                    .map((r) => {
                      const Icon = MODE_ICON[r.mode];
                      const isBest = r.mode === bestResult?.mode;
                      return (
                        <a
                          key={r.mode}
                          href={`https://www.google.com/maps/dir/?api=1&destination=${VENUE_MAPS_QUERY}&travelmode=${MODE_GMAPS[r.mode] ?? "driving"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all border",
                            isBest
                              ? "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/40 dark:text-brand-400 dark:border-brand-800/50"
                              : "bg-muted text-muted-foreground border-border hover:bg-accent"
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          {r.durationText}
                        </a>
                      );
                    })}
                </div>
              )}

              {geoError && !travelLoading && (
                <span className="text-xs text-muted-foreground italic">Enable location for travel time</span>
              )}
            </div>
          </div>

          {/* OpenStreetMap embed — free, no API key */}
          <div className="rounded-xl overflow-hidden border border-border shadow-card aspect-video w-full relative">
            <iframe
              title="Venue location — Iron & Ember Events"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={OSM_EMBED_URL}
            />
            <a
              href={OSM_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3 h-3" />
              View larger map
            </a>
          </div>
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
