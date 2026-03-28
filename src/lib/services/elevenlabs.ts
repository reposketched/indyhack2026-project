/**
 * ElevenLabs Service Adapter
 *
 * Real mode: Calls ElevenLabs API for text-to-speech with event-context-aware responses.
 * Supports voice cloning for organizer voice identity.
 *
 * Mock mode: Returns pre-recorded transcript + uses browser Web Speech API
 * as a fallback TTS engine (zero latency, works offline).
 *
 * Available voices (real mode):
 * - aria: Default warm professional voice
 * - rachel: Clear and friendly (good for event context)
 * - domi: Energetic, great for event announcements
 * - organizer-clone: Placeholder for cloned organizer voice
 */

import { sleep } from "@/lib/utils";
import { DEMO_EVENT } from "@/lib/data/events";

const IS_MOCK = process.env.MOCK_MODE === "true" || !process.env.ELEVENLABS_API_KEY;

export interface VoiceQuestion {
  id: string;
  question: string;
  category: "logistics" | "food" | "ticket" | "schedule" | "general";
}

export interface ConciergeResponse {
  question: string;
  answer: string;
  audioUrl?: string;
  durationMs: number;
  voice: string;
  usedBrowserTTS: boolean;
}

export const SAMPLE_QUESTIONS: VoiceQuestion[] = [
  { id: "q1", question: "What time does the event start?", category: "schedule" },
  { id: "q2", question: "Where do I park?", category: "logistics" },
  { id: "q3", question: "Can I change my meal preference?", category: "food" },
  { id: "q4", question: "What does my VIP ticket include?", category: "ticket" },
  { id: "q5", question: "Is there vegetarian food available?", category: "food" },
  { id: "q6", question: "Who is the speaker tonight?", category: "schedule" },
  { id: "q7", question: "Is there a networking app I should download?", category: "general" },
];

export const AVAILABLE_VOICES = [
  { id: "aria", name: "Aria", description: "Warm professional", gender: "female" },
  { id: "rachel", name: "Rachel", description: "Clear and friendly", gender: "female" },
  { id: "domi", name: "Domi", description: "Energetic host", gender: "female" },
  { id: "organizer-clone", name: "Organizer Voice", description: "Cloned from organizer recording", gender: "custom" },
];

// ─── Pre-built answers (mock mode) ───────────────────────────────────────────

const EVENT_ANSWERS: Record<string, string> = {
  "What time does the event start?":
    "The event starts at 5 PM on September 20th. Doors open at 4:45 for early arrivals. The main networking hour runs from 5:30 to 6:30, and our featured speaker starts at 8:30 PM.",

  "Where do I park?":
    "Free parking is available in the east field at Meadowbrook Estate — there's space for about 300 vehicles. If that fills up, overflow parking is at the Westfield Community Center, about 2 miles away, with a complimentary shuttle running every 15 minutes. Rideshare drop-off is at the main gate on Orchard Ridge Lane.",

  "Can I change my meal preference?":
    `You can update your meal preference until September 13th by visiting the event page at complanion.app/event/${DEMO_EVENT.slug}. After that, changes may not be guaranteed, but reach out to us directly and we'll do our best. Harvest & Hearth has excellent options across all dietary needs.`,

  "What does my VIP ticket include?":
    "Your VIP ticket includes access to all event areas, priority check-in at a dedicated lane, the VIP lounge with private seating, a meet-and-greet with our featured speaker, and of course, all food stations and the specialty coffee bar. You'll also receive a proof-of-attendance NFT after the event.",

  "Is there vegetarian food available?":
    "Absolutely — vegetarian options are front and center at this event. Harvest & Hearth has designed the menu so that over 60% of all dishes are vegetarian, with a dedicated fully vegan station. Everything is clearly labeled, and there's a separate allergen-free preparation zone. You're in great hands.",

  "Who is the speaker tonight?":
    "Tonight's featured speaker is a special guest for the Roots & Reach Summit. The 20-minute fireside chat, titled 'Building in the Open', starts at 8:30 PM near the main lawn. We'll announce the full speaker name via email and on the event page this week — stay tuned!",

  "Is there a networking app I should download?":
    "We're using a QR-based networking system — no app download required. Your NFT ticket QR code is your digital identity at the event. At check-in, you'll get access to the attendee directory on the event website. Just scan and connect.",
};

function getAnswer(question: string): string {
  const match = Object.keys(EVENT_ANSWERS).find((q) =>
    question.toLowerCase().includes(q.toLowerCase().split(" ")[2]) ||
    q.toLowerCase().includes(question.toLowerCase().split(" ")[0])
  );

  return (
    EVENT_ANSWERS[question] ||
    (match ? EVENT_ANSWERS[match] : null) ||
    `Thanks for your question about "${question}". Let me check with the event organizer and get back to you shortly. For urgent inquiries, you can also reach the team at hello@complanion.app.`
  );
}

// ─── Real ElevenLabs API ──────────────────────────────────────────────────────

const VOICE_ID_MAP: Record<string, string> = {
  aria: "9BWtsMINqrJLrRacOk9x",
  rachel: "21m00Tcm4TlvDq8ikWAM",
  domi: "AZnzlk1XvdvUeBnXmlld",
  "organizer-clone": process.env.ELEVENLABS_CLONED_VOICE_ID || "9BWtsMINqrJLrRacOk9x",
};

async function callElevenLabsReal(text: string, voiceId: string): Promise<ArrayBuffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.1,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response.arrayBuffer();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getConciergeResponse(
  question: string,
  voice = "aria"
): Promise<ConciergeResponse> {
  const answer = getAnswer(question);
  const startTime = Date.now();

  if (IS_MOCK) {
    await sleep(600 + Math.random() * 400);
    return {
      question,
      answer,
      audioUrl: undefined, // Browser TTS handles playback in mock mode
      durationMs: Date.now() - startTime,
      voice,
      usedBrowserTTS: true,
    };
  }

  try {
    const voiceId = VOICE_ID_MAP[voice] || VOICE_ID_MAP.aria;
    const audioBuffer = await callElevenLabsReal(answer, voiceId);

    // Convert to base64 data URL for browser playback
    const bytes = new Uint8Array(audioBuffer);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    const audioUrl = `data:audio/mpeg;base64,${btoa(binary)}`;

    return {
      question,
      answer,
      audioUrl,
      durationMs: Date.now() - startTime,
      voice,
      usedBrowserTTS: false,
    };
  } catch (err) {
    console.error("ElevenLabs error:", err);
    return {
      question,
      answer,
      durationMs: Date.now() - startTime,
      voice,
      usedBrowserTTS: true,
    };
  }
}
