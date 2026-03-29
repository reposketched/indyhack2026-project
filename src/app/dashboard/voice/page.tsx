"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff,
  ChevronRight, Sparkles, Clock, User, CheckCircle2,
  RadioTower,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { SAMPLE_QUESTIONS, AVAILABLE_VOICES } from "@/lib/services/elevenlabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function WaveformAnimation({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={cn("w-1 rounded-full", active ? "bg-brand-500" : "bg-muted-foreground/30")}
          animate={active ? {
            height: [8, Math.random() * 24 + 8, 8],
          } : { height: 4 }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: active ? Infinity : 0,
            delay: i * 0.06,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function VoicePage() {
  const { voiceTranscript, addVoiceEntry, selectedVoice, setSelectedVoice } = useEventStore();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [cloneMode, setCloneMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [voiceTranscript]);

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find((v) => v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Karen"));
    if (femaleVoice) utterance.voice = femaleVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleQuestion = async (question: string) => {
    if (isLoading) return;
    setCurrentQuestion(question);
    setIsLoading(true);
    setIsActive(true);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, voice: cloneMode ? "organizer-clone" : selectedVoice }),
      });
      const data = await res.json();

      addVoiceEntry({ question, answer: data.answer });

      if (data.audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = data.audioUrl;
          audioRef.current.play();
        }
      } else {
        speak(data.answer);
      }

      toast.success("Concierge responded", {
        description: data.usedBrowserTTS ? "Browser TTS (ElevenLabs in live mode)" : "ElevenLabs voice",
      });
    } catch {
      const fallbackAnswer = "I'm having trouble connecting right now. Please check the event page for details or contact the organizer directly.";
      addVoiceEntry({ question, answer: fallbackAnswer });
      speak(fallbackAnswer);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsActive(false), 3000);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="page-title">Voice Concierge</h2>
          <p className="page-subtitle">ElevenLabs-powered · Answers from live event data</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border bg-card">
          <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground/40")} />
          {isActive ? "Speaking..." : "Standby"}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Concierge UI */}
        <div className="lg:col-span-3 space-y-5">
          {/* Main concierge card */}
          <div className="card-base p-6">
            {/* Voice visualization */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                animate={isActive ? { scale: [1, 1.05, 1], boxShadow: ["0 0 0 0 rgba(37,99,235,0)", "0 0 0 16px rgba(37,99,235,0.1)", "0 0 0 0 rgba(37,99,235,0)"] } : {}}
                transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-card-lg mb-4"
              >
                {isLoading ? (
                  <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isActive ? (
                  <Volume2 className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </motion.div>

              <WaveformAnimation active={isActive} />

              <div className="mt-4 text-center">
                <div className="text-base font-semibold text-foreground">
                  {cloneMode ? "Organizer Voice (Cloned)" : AVAILABLE_VOICES.find((v) => v.id === selectedVoice)?.name || "Aria"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isLoading ? "Processing..." : isActive ? "Speaking..." : "Ready for questions"}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsActive(false);
                  toast.info("Concierge paused");
                }}
                className="w-12 h-12 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              </button>

              <button
                onClick={() => {
                  const q = "What time does the event start and where is it?";
                  setCurrentQuestion(q);
                  handleQuestion(q);
                }}
                disabled={isLoading}
                title="Ask a sample question"
                className="w-16 h-16 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 flex items-center justify-center shadow-glow transition-all"
              >
                <Phone className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => setCloneMode((v) => !v)}
                className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  cloneMode ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                title="Toggle organizer voice clone"
              >
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Clone mode notice */}
            {cloneMode && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/40 mb-4"
              >
                <RadioTower className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">Organizer Voice Mode</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-500">Guests hear the concierge in your cloned voice via ElevenLabs Voice Lab</div>
                </div>
              </motion.div>
            )}

            {/* Current question display */}
            {currentQuestion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground italic text-center"
              >
                &ldquo;{currentQuestion}&rdquo;
              </motion.div>
            )}
          </div>

          {/* Voice selector */}
          <div className="card-base p-5">
            <div className="section-label mb-3">Voice Selection</div>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => {
                    setSelectedVoice(voice.id);
                    if (voice.id === "organizer-clone") setCloneMode(true);
                    else setCloneMode(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                    (cloneMode ? "organizer-clone" : selectedVoice) === voice.id
                      ? "border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/40"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {voice.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{voice.name}</div>
                    <div className="text-[10px] text-muted-foreground">{voice.description}</div>
                  </div>
                  {(cloneMode ? "organizer-clone" : selectedVoice) === voice.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sample questions */}
          <div className="card-base p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <div className="section-label">Sample Guest Questions</div>
            </div>
            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestion(q.question)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-brand-200 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-1">
                    <div className="text-sm text-foreground group-hover:text-brand-700 transition-colors">
                      &ldquo;{q.question}&rdquo;
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{q.category}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Transcript */}
        <div className="lg:col-span-2">
          <div className="section-label mb-3">Session Transcript</div>
          <div className="card-base overflow-hidden sticky top-20">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{voiceTranscript.length} exchanges</span>
              <span className="text-[10px] text-muted-foreground">Logged to MongoDB</span>
            </div>
            <div className="h-[600px] overflow-y-auto scrollbar-thin p-4 space-y-5">
              {voiceTranscript.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Mic className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <div className="text-sm text-muted-foreground">Tap a sample question to start</div>
                </div>
              ) : (
                <AnimatePresence>
                  {voiceTranscript.map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* Guest question */}
                      <div className="flex justify-end">
                        <div className="max-w-[90%] bg-muted rounded-2xl rounded-tr-sm px-4 py-3">
                          <div className="text-[10px] font-semibold text-muted-foreground mb-1">GUEST</div>
                          <div className="text-sm text-foreground">&ldquo;{entry.question}&rdquo;</div>
                        </div>
                      </div>
                      {/* Concierge response */}
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="max-w-[90%] bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="text-[10px] font-semibold text-brand-600 mb-1">CONCIERGE</div>
                          <div className="text-sm text-foreground leading-relaxed">{entry.answer}</div>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* ElevenLabs info */}
          <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/40">
            <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-2">ElevenLabs Integration (for judges)</div>
            <div className="text-[11px] text-orange-700 dark:text-orange-400 space-y-1 leading-relaxed">
              <div>• Real mode: ElevenLabs turbo_v2 model</div>
              <div>• Voice cloning via ElevenLabs Voice Lab</div>
              <div>• Mock mode: Browser Web Speech API</div>
              <div>• All sessions logged to MongoDB voiceLogs</div>
              <div>• Responses pulled from live event data</div>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
