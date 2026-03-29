"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Clock, Users, Mic,
  ChevronDown, ChevronUp, CheckCircle2, Sparkles,
  Car, ArrowRight, Ticket, Navigation, ExternalLink, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Event } from "@/lib/schemas";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <span className="text-sm font-medium text-foreground group-hover:text-brand-600 transition-colors">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="pb-4"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

function ConciergeWidget({ eventName }: { eventName: string }) {
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
      setAnswer("I'm having trouble right now. Please check the FAQ or contact the organizer.");
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
          <div className="text-xs text-brand-600 dark:text-brand-400">Ask anything about {eventName}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Ask a question about the event..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <button
          onClick={ask}
          disabled={isAsking || !question.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {isAsking ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Ask"}
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
        {["When does it start?", "Where is it?", "What should I bring?"].map((q) => (
          <button
            key={q}
            onClick={() => setQuestion(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-card border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function DirectionsCard({
  fullAddress,
  mapsQuery,
  coordinates,
  parkingInfo,
}: {
  fullAddress: string;
  mapsQuery: string;
  coordinates?: { lat: number; lng: number };
  parkingInfo?: string;
}) {
  const [driveTime, setDriveTime] = useState<string | null>(null);
  const [loadingTime, setLoadingTime] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!coordinates || typeof navigator === "undefined" || !navigator.geolocation) return;
    setLoadingTime(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `/api/directions?origin=${latitude},${longitude}&dest=${coordinates.lat},${coordinates.lng}`
          );
          if (res.ok) {
            const data = await res.json();
            const driving = data.all?.find((r: { mode: string }) => r.mode === "driving");
            if (driving) setDriveTime(driving.durationText);
          }
        } catch {
          // silently ignore
        } finally {
          setLoadingTime(false);
        }
      },
      () => {
        setLocationDenied(true);
        setLoadingTime(false);
      }
    );
  }, [coordinates]);

  const mapSrc = coordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.02}%2C${coordinates.lat - 0.008}%2C${coordinates.lng + 0.02}%2C${coordinates.lat + 0.008}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`
    : `https://www.openstreetmap.org/export/embed.html?query=${mapsQuery}&layer=mapnik`;

  const largeMapHref = coordinates
    ? `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=16/${coordinates.lat}/${coordinates.lng}`
    : `https://www.openstreetmap.org/search?query=${mapsQuery}`;

  return (
    <div className="space-y-3">
      <div className="p-5 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Getting There</h3>
          </div>
          {mapsQuery && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </a>
          )}
        </div>
        {fullAddress && (
          <div className="flex items-center gap-1.5 text-sm text-foreground font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            {fullAddress}
          </div>
        )}
        {parkingInfo && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{parkingInfo}</p>
        )}
        {/* Drive time badge */}
        <div className="mt-3">
          {loadingTime ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Calculating drive time…
            </div>
          ) : driveTime ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/40 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Car className="w-3.5 h-3.5" />
              {driveTime} by car from your location
            </div>
          ) : locationDenied ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              Allow location access to see drive time
            </div>
          ) : null}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border shadow-card w-full relative" style={{ height: "320px" }}>
        <iframe
          title="Venue location"
          width="100%"
          height="320"
          style={{ border: 0, display: "block" }}
          src={mapSrc}
        />
        <a
          href={largeMapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-white transition-colors shadow-sm"
        >
          <ExternalLink className="w-3 h-3" />
          View larger map
        </a>
      </div>
    </div>
  );
}

export default function EventGuestPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [mealPref, setMealPref] = useState("");
  const [rsvpDone, setRsvpDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoadingEvent(false);
      }
    }
    fetchEvent();
  }, [slug]);

  const handleRSVP = async () => {
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    if (!mealPref) { toast.error("Please select a meal preference"); return; }
    if (!event) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          name,
          email,
          location,
          mealPreference: mealPref,
        }),
      });
      if (res.ok) {
        setRsvpDone(true);
        toast.success("RSVP confirmed!", { description: "Check your email for your ticket." });
      } else {
        toast.error("Failed to submit RSVP. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading event…</p>
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold font-display text-foreground mb-2">Event Not Found</h1>
          <p className="text-sm text-muted-foreground">This event link may be invalid or the event has been removed.</p>
        </div>
      </div>
    );
  }

  // Format date and time from event.date ISO string
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  // Build location string
  const hasLocation = event.location.city || event.location.name;
  const locationStr = [event.location.name, event.location.city, event.location.state].filter(Boolean).join(", ");
  const fullAddress = [event.location.address, event.location.city, event.location.state].filter(Boolean).join(", ");
  const mapsQuery = encodeURIComponent(fullAddress || locationStr);

  // Build FAQ from actual event data
  const faq = [
    hasLocation && fullAddress ? {
      q: "Where is the event?",
      a: `The event is at ${locationStr}${event.location.address ? `. Address: ${fullAddress}` : ""}.`,
    } : null,
    event.guestCount > 0 ? {
      q: "How many people are attending?",
      a: `We're expecting ${event.guestCount} guests${event.confirmedGuests > 0 ? `, with ${event.confirmedGuests} confirmed so far` : ""}.`,
    } : null,
    {
      q: "How do I use my ticket?",
      a: "Your ticket QR code will be in the confirmation email. At check-in, simply show the QR code on your phone — no app download needed.",
    },
    event.location.parkingInfo ? {
      q: "Is there parking?",
      a: event.location.parkingInfo,
    } : null,
  ].filter(Boolean) as { q: string; a: string }[];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 pt-20 pb-24 px-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {event.guestCount > 0 && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white font-medium mb-6">
                <Users className="w-3.5 h-3.5" />
                {event.guestCount} guests expected
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              {event.name}
            </h1>
            {event.description && (
              <p className="text-brand-200 text-lg max-w-xl mx-auto leading-relaxed mb-8">
                {event.description.split(".")[0]}.
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-brand-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {dateStr} · {timeStr}
              </div>
              {hasLocation && (
                <>
                  <span className="hidden sm:block">·</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {locationStr}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* RSVP card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-base p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">RSVP & Ticket</div>
              <div className="text-xs text-muted-foreground">Confirm your attendance</div>
            </div>
          </div>

          {rsvpDone ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">You&apos;re confirmed!</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500">Check your email for your ticket QR code.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Your Location <span className="normal-case font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Meal Preference</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["vegetarian", "vegan", "omnivore", "gluten-free", "halal"].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setMealPref(pref)}
                      className={cn("px-3 py-2 rounded-xl border text-xs font-medium capitalize transition-all",
                        mealPref === pref
                          ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/40 dark:text-brand-400"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleRSVP}
                disabled={submitting}
                className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Confirm My Spot
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Event details */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: "Date", value: dateStr },
            { icon: Clock, label: "Time", value: timeStr },
            event.guestCount > 0 ? { icon: Users, label: "Guests", value: `${event.guestCount} expected` } : null,
            hasLocation ? { icon: MapPin, label: "Venue", value: event.location.name || event.location.city } : null,
            event.location.parkingInfo ? { icon: Car, label: "Parking", value: event.location.parkingInfo.slice(0, 40) + (event.location.parkingInfo.length > 40 ? "…" : "") } : null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ].filter(Boolean).map(({ icon: Icon, label, value }: any) => (
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

        {/* Location & directions */}
        {hasLocation && (
          <DirectionsCard
            fullAddress={fullAddress}
            mapsQuery={mapsQuery}
            coordinates={event.location.coordinates ?? undefined}
            parkingInfo={event.location.parkingInfo}
          />
        )}

        {/* Voice concierge */}
        <ConciergeWidget eventName={event.name} />

        {/* FAQ */}
        {faq.length > 0 && (
          <div>
            <h2 className="text-xl font-bold font-display text-foreground mb-5">FAQ</h2>
            <div className="card-base px-6 divide-y divide-border">
              {faq.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold text-foreground">Complanion</span>
          </div>
          <p className="text-xs text-muted-foreground">Powered by Gemini · MongoDB · Solana · ElevenLabs</p>
        </div>
      </div>
    </div>
  );
}
