"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, ArrowRight, Calendar, MapPin,
  Users, DollarSign, Send, ChevronRight, X,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { useAuthStore } from "@/lib/store/authStore";

const DEMO_PREVIEW = {
  name: "Roots & Reach: Autumn Networking Summit",
  date: "Sep 20, 2025",
  location: "Iron & Ember Events, Carmel IN",
  guests: 200,
  budget: "$8,000",
  tags: ["Vendors pre-loaded", "AI insights active", "Budget tracked", "Solana tickets"],
};

export function WelcomeScreen() {
  const { startWithDemo, startFresh } = useEventStore();
  const { user } = useAuthStore();
  const [mode, setMode] = useState<"welcome" | "new-plan">("welcome");
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    venueName: "",
    city: "",
    state: "",
    guests: "",
    budget: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split("T")[0];

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.date) {
      e.date = "Required";
    } else if (form.date < today) {
      e.date = "Event date can't be in the past";
    }
    if (!form.city.trim()) e.city = "Required";
    if (form.guests && isNaN(Number(form.guests))) e.guests = "Must be a number";
    if (form.budget && isNaN(Number(form.budget))) e.budget = "Must be a number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCreate() {
    if (!validate()) return;
    const dateTimeStr = form.date && form.time
      ? `${form.date}T${form.time}:00`
      : form.date
        ? `${form.date}T00:00:00`
        : undefined;
    startFresh(
      {
        name: form.name.trim(),
        date: dateTimeStr ? new Date(dateTimeStr).toISOString() : undefined,
        location: {
          name: form.venueName.trim() || form.city.trim(),
          address: "",
          city: form.city.trim(),
          state: form.state.trim(),
        },
        guestCount: form.guests ? parseInt(form.guests) : 0,
        budget: form.budget ? parseFloat(form.budget) : 0,
      },
      user?.name,
      user?.email
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-full bg-background p-6">
      <AnimatePresence mode="wait">
        {mode === "welcome" ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
                <Send className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">Welcome to Complanion</h1>
                <p className="text-xs text-muted-foreground">AI-powered event planning</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Load Demo card */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={startWithDemo}
                className="group text-left p-5 rounded-2xl border-2 border-border bg-card hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-card-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="mb-3">
                  <div className="text-sm font-semibold text-foreground mb-1">Open Demo</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Explore a fully pre-loaded event with vendors, budget, AI insights, and Solana tickets ready to go.
                  </div>
                </div>

                <div className="border border-border rounded-xl p-3 bg-muted/40 space-y-2">
                  <div className="text-xs font-medium text-foreground truncate">{DEMO_PREVIEW.name}</div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{DEMO_PREVIEW.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{DEMO_PREVIEW.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{DEMO_PREVIEW.guests} guests</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{DEMO_PREVIEW.budget}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {DEMO_PREVIEW.tags.map((t) => (
                      <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 border border-brand-100 dark:border-brand-800/40">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>

              {/* New Plan card */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setMode("new-plan")}
                className="group text-left p-5 rounded-2xl border-2 border-border bg-card hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-card-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-foreground mb-1">New Plan</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Start a fresh event from scratch. Tell the AI what you're planning and it'll build everything out for you.
                  </div>
                </div>

                <div className="space-y-2">
                  {["Name your event", "Set date & location", "Let AI plan the rest"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </motion.button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              You can switch events or reset at any time from the sidebar.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="new-plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold font-display text-foreground">New Event</h2>
                <p className="text-xs text-muted-foreground">Fill in the basics — AI will do the rest</p>
              </div>
              <button
                onClick={() => setMode("welcome")}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Event name */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Event name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Summer Product Launch"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Event date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                  />
                  {errors.date && <p className="text-[10px] text-rose-500 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Start time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">City <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Indianapolis"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                  />
                  {errors.city && <p className="text-[10px] text-rose-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">State</label>
                  <input
                    type="text"
                    placeholder="e.g. IN"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Venue name <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. The Grand Ballroom"
                  value={form.venueName}
                  onChange={(e) => setForm((f) => ({ ...f, venueName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                />
              </div>

              {/* Guests + Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Expected guests</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    min="0"
                    value={form.guests}
                    onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                  />
                  {errors.guests && <p className="text-[10px] text-rose-500 mt-1">{errors.guests}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Budget ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    min="0"
                    value={form.budget}
                    onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                  />
                  {errors.budget && <p className="text-[10px] text-rose-500 mt-1">{errors.budget}</p>}
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="btn-primary w-full justify-center mt-2"
              >
                <Zap className="w-4 h-4" />
                Create Event & Open AI Planner
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
