"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, Utensils, Copy, Check, RefreshCw,
  ExternalLink, CheckCircle2, Clock, MapPin,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RSVP {
  _id?: string;
  name: string;
  email: string;
  mealPreference: string;
  location?: string;
  createdAt: string;
}

const MEAL_COLORS: Record<string, string> = {
  vegetarian: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40",
  vegan: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40",
  omnivore: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40",
  "gluten-free": "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/40",
  halal: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40",
  none: "bg-muted text-muted-foreground border-border",
};

export default function GuestsPage() {
  const { event } = useEventStore();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/event/${event.slug}`
    : `/event/${event.slug}`;

  const fetchRSVPs = useCallback(async () => {
    if (!event._id) { setLoading(false); return; }
    try {
      const res = await fetch(`/api/rsvp?eventId=${event._id}`);
      if (res.ok) {
        const data = await res.json();
        setRsvps(data.rsvps || []);
      }
    } finally {
      setLoading(false);
    }
  }, [event._id]);

  useEffect(() => { fetchRSVPs(); }, [fetchRSVPs]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Meal preference breakdown
  const mealCounts = rsvps.reduce<Record<string, number>>((acc, r) => {
    const key = r.mealPreference || "none";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Guest Responses</h1>
          <p className="text-sm text-muted-foreground mt-1">{rsvps.length} RSVP{rsvps.length !== 1 ? "s" : ""} for {event.name}</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchRSVPs(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Share link */}
      <div className="card-base p-5">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-semibold text-foreground">Guest Event Link</span>
          <span className="text-xs text-muted-foreground ml-auto">Share this with your guests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground font-mono truncate">
            {shareUrl}
          </div>
          <button
            onClick={copyLink}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0",
              copied
                ? "bg-emerald-600 text-white"
                : "bg-brand-600 text-white hover:bg-brand-700"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-base p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total RSVPs</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{rsvps.length}</div>
          <div className="text-xs text-muted-foreground">of {event.guestCount} expected</div>
        </div>
        {Object.entries(mealCounts).slice(0, 3).map(([pref, count]) => (
          <div key={pref} className="card-base p-4">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider capitalize">{pref}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{count}</div>
            <div className="text-xs text-muted-foreground">{Math.round((count / rsvps.length) * 100)}% of guests</div>
          </div>
        ))}
      </div>

      {/* Guest list */}
      <div className="card-base overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">All RSVPs</span>
          {rsvps.length > 0 && (
            <span className="text-xs text-muted-foreground">{rsvps.length} total</span>
          )}
        </div>

        {loading ? (
          <div className="space-y-px">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-36 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : rsvps.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No RSVPs yet. Share the link above to start collecting responses.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <AnimatePresence>
              {rsvps.map((rsvp, i) => (
                <motion.div
                  key={rsvp._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-400 text-xs font-bold flex-shrink-0">
                    {rsvp.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{rsvp.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{rsvp.email}</span>
                    </div>
                    {rsvp.location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">{rsvp.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full border capitalize", MEAL_COLORS[rsvp.mealPreference] || MEAL_COLORS.none)}>
                      {rsvp.mealPreference || "no pref"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(rsvp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
