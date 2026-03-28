# Com-Plan-ion

> **Your AI event planner that never forgets. From idea to check-in in minutes.**

Com-Plan-ion is a full-stack, production-quality AI event planning platform built for IndyHack 2026. It demonstrates best use of **Gemini**, **MongoDB**, **Solana**, and **ElevenLabs** through one coherent, end-to-end product — not a collection of demos duct-taped together.

An organizer speaks: _"I want a rustic outdoor networking event for 200 people in September, budget $8k, vegetarian-friendly."_ The app generates a structured plan, finds vendors via semantic search, detects timeline conflicts, mints an NFT ticket, publishes a guest microsite, and lets every attendee talk to a live AI voice concierge. All in one flow.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Setup & Installation](#setup--installation)
4. [Running in Mock Mode (no credentials)](#running-in-mock-mode-no-credentials)
5. [Connecting Real APIs](#connecting-real-apis)
   - [Gemini](#gemini)
   - [MongoDB Atlas](#mongodb-atlas)
   - [Solana](#solana)
   - [ElevenLabs](#elevenlabs)
6. [How to Demo in 3 Minutes](#how-to-demo-in-3-minutes)
7. [Project Structure](#project-structure)
8. [Architecture](#architecture)
9. [Pages & Routes](#pages--routes)
10. [Sponsor Integration Points](#sponsor-integration-points)
11. [Data Models](#data-models)
12. [Tech Stack](#tech-stack)
13. [Why This Wins](#why-this-wins)

---

## Project Overview

| | |
|---|---|
| **App name** | Com-Plan-ion |
| **Hackathon** | IndyHack 2026 |
| **Node version** | 18+ |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Mock mode** | Fully functional with zero API keys |

The core demo scenario:

1. Organizer describes their event in natural language
2. **Gemini** turns it into a structured plan with schedule, vendor recs, and risks
3. **MongoDB** Atlas Vector Search finds the most semantically relevant vendors
4. Gemini detects planning conflicts (deposit timing, budget overruns)
5. **Solana** mints a compressed NFT ticket with rich metadata and QR code
6. A public guest event page is generated automatically
7. **ElevenLabs** powers a voice concierge that answers guest questions in the organizer's cloned voice

---

## Prerequisites

- **Node.js 18+** and **npm 9+**
- Git

Optional (only needed for real API mode):
- A [Google AI Studio](https://aistudio.google.com) account (Gemini API key)
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster with Vector Search enabled
- A [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) keypair (devnet)
- An [ElevenLabs](https://elevenlabs.io) account (API key)

---

## Setup & Installation

### Step 1 — Install Node.js 18+

```bash
node --version   # must print v18.x.x or higher
```

If you need to install or upgrade:

**macOS**
```bash
brew install node
```

**Ubuntu / Debian**
```bash
# via nvm (recommended — avoids sudo and version conflicts)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # or restart your terminal
nvm install 18
nvm use 18
```

**Windows** — download the LTS installer from [nodejs.org](https://nodejs.org).

---

### Step 2 — Clone the repository

```bash
git clone https://github.com/your-org/indyhack2026-project.git
cd indyhack2026-project
```

---

### Step 3 — Install dependencies

```bash
npm install
```

Takes 30–60 seconds. If you hit peer dependency errors, run:

```bash
npm install --legacy-peer-deps
```

---

### Step 4 — Create the environment file

```bash
cp .env.example .env.local
```

The default file already contains `MOCK_MODE=true`. No API keys are needed to run the full demo.

---

### Step 5 — Start the server

**Development (with hot reload):**
```bash
npm run dev
```

**Production build (faster, closer to a real deployment):**
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

---

### Step 6 — Verify everything is working

Hit these URLs in order:

| URL | What you should see |
|-----|---------------------|
| `/` | Landing page — hero, features, sponsor logos |
| `/demo` | 9-step demo runner — press the big button |
| `/dashboard` | Event overview with stat cards and AI alerts |
| `/dashboard/planner` | Chat interface; type anything to get a plan |
| `/dashboard/vendors` | Vendor cards with relevance scores |
| `/dashboard/budget` | Recharts budget charts + AI recommendations |
| `/dashboard/tickets` | Wallet connect → Mint NFT → QR code |
| `/dashboard/voice` | Click a sample question to hear the concierge |
| `/event/rustic-networking-sept-2025` | Public guest event microsite |

---

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm install` fails with peer dependency errors | `npm install --legacy-peer-deps` |
| Port 3000 already in use | `npm run dev -- -p 3001` |
| `node: command not found` | Node isn't installed or isn't on PATH — see Step 1 |
| Blank page or hydration error | Make sure `.env.local` exists: `cp .env.example .env.local` |
| Voice concierge is silent | Check browser microphone permissions; mock mode uses browser TTS |

---

## Running in Mock Mode (no credentials)

The default `.env.local` ships with `MOCK_MODE=true`. In this mode:

- All Gemini calls return pre-built realistic event plans
- Vendor search uses a keyword-weighted scoring algorithm over 15 seeded vendors
- Solana ticket minting generates a valid-looking devnet address and transaction signature
- ElevenLabs TTS falls back to the browser's built-in Web Speech API
- MongoDB returns data from `src/lib/data/*.ts` — no Atlas connection needed

**The entire app runs and demos perfectly offline.**

To verify mock mode is active, check that `.env.local` contains:

```env
MOCK_MODE=true
```

No other variables are needed.

---

## Connecting Real APIs

Edit `.env.local` and set `MOCK_MODE=false`, then add keys for each service you want to use. Services without keys fall back to mock mode individually — you can mix real and mock services.

### Gemini

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`:

```env
GEMINI_API_KEY=your_key_here
```

The app uses:
- `gemini-1.5-pro` for event planning, chat, and conflict detection
- `text-embedding-004` for generating vendor embedding vectors (768 dimensions)

Relevant file: `src/lib/services/gemini.ts`

---

### MongoDB Atlas

1. Create a free cluster at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database named `complanion`
3. Get the connection string from **Connect → Drivers → Node.js**
4. Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
MONGODB_DB_NAME=complanion
```

**Setting up Atlas Vector Search (for vendor semantic search):**

In the Atlas UI, go to your cluster → **Search** → **Create Search Index** → **JSON editor**, then apply this to the `vendors` collection:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embeddingVector",
      "numDimensions": 768,
      "similarity": "cosine"
    }
  ]
}
```

Name the index `vendor_embedding`.

**Seeding real data into Atlas:**

Visit `http://localhost:3000/api/seed` to retrieve all mock seed data as JSON. Import it into your Atlas collections using [mongoimport](https://www.mongodb.com/docs/database-tools/mongoimport/) or the Atlas Data Explorer.

Relevant file: `src/lib/services/mongodb.ts`

---

### Solana

The app targets **Solana devnet** by default.

1. Install the Solana CLI: [https://docs.solana.com/cli/install-solana-cli-tools](https://docs.solana.com/cli/install-solana-cli-tools)
2. Generate a wallet keypair:

```bash
solana-keygen new --outfile /tmp/mint-keypair.json
solana airdrop 2 $(solana-keygen pubkey /tmp/mint-keypair.json) --url devnet
```

3. Add to `.env.local`:

```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_MINT_KEYPAIR=<base58-encoded private key>
```

The ticket minting architecture uses **Metaplex Bubblegum** (compressed NFTs). The `mintTicket` function in `src/lib/services/solana.ts` has a `// TODO: Implement Metaplex Bubblegum minting` scaffold with the connection setup already wired. To complete it, install the Metaplex JS SDK and follow the [Bubblegum docs](https://developers.metaplex.com/bubblegum).

Relevant file: `src/lib/services/solana.ts`

---

### ElevenLabs

1. Create an account at [https://elevenlabs.io](https://elevenlabs.io)
2. Copy your API key from **Settings → API Keys**
3. Add to `.env.local`:

```env
ELEVENLABS_API_KEY=your_key_here
```

**Optional — organizer voice cloning:**

1. Go to [https://elevenlabs.io/voice-lab](https://elevenlabs.io/voice-lab)
2. Create a new voice clone using a short audio recording
3. Copy the Voice ID and add:

```env
ELEVENLABS_CLONED_VOICE_ID=your_voice_id_here
```

In the app, toggle "Organizer Voice" mode on the Voice Concierge page to use the cloned voice.

The app uses the `eleven_turbo_v2` model with stability 0.5 and similarity boost 0.75.

Relevant file: `src/lib/services/elevenlabs.ts`

---

## How to Demo in 3 Minutes

### Automated demo (recommended for on-stage)

1. Open `http://localhost:3000`
2. Click **"Run 3-Minute Demo"** or navigate to `/demo`
3. Press the **"Run Hackathon Demo"** button
4. The app auto-progresses through 9 steps with animations — narrate along

**What the demo shows:**

| Step | What happens | Sponsor |
|------|-------------|---------|
| 1 | Organizer types event description (auto-typed) | — |
| 2 | Gemini generates a full structured event plan | Gemini |
| 3 | MongoDB vector search returns 8 vendor matches with AI reasoning | MongoDB |
| 4 | Conflict detection: 2 issues flagged (deposit timing + budget risk) | Gemini |
| 5 | Budget intelligence dashboard renders with charts | MongoDB |
| 6 | Solana NFT ticket mints in ~2s with QR code | Solana |
| 7 | Public guest event microsite is shown | — |
| 8 | ElevenLabs concierge answers "Where do I park?" out loud | ElevenLabs |
| 9 | Demo complete — all pages available for exploration | — |

### Manual exploration (after demo)

Point judges to these pages in order:

```
/dashboard/planner  → Type anything; see Gemini plan + conflict panel
/dashboard/vendors  → Try "cozy Italian catering under $40/head" — see vector search
/dashboard/budget   → Recharts analytics + AI "what-if" analysis
/dashboard/tickets  → Click "Connect Wallet" → "Mint NFT Ticket" → see QR code
/dashboard/voice    → Click a sample question; hear the voice concierge respond
/event/rustic-networking-sept-2025 → Public guest page with embedded concierge
```

---

## Project Structure

```
indyhack2026-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    Root layout — fonts, providers, Toaster
│   │   ├── page.tsx                      Landing page (/)
│   │   ├── demo/
│   │   │   └── page.tsx                  Scripted demo runner (/demo)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                Sidebar + TopBar shell
│   │   │   ├── page.tsx                  Overview dashboard (/dashboard)
│   │   │   ├── planner/page.tsx          AI planning workspace
│   │   │   ├── vendors/page.tsx          Vendor matching
│   │   │   ├── budget/page.tsx           Budget intelligence
│   │   │   ├── operations/page.tsx       Timeline & operations
│   │   │   ├── tickets/page.tsx          Solana NFT ticketing
│   │   │   └── voice/page.tsx            ElevenLabs voice concierge
│   │   ├── event/[slug]/
│   │   │   └── page.tsx                  Public guest event microsite
│   │   └── api/
│   │       ├── gemini/route.ts           POST — event planning + chat
│   │       ├── vendors/route.ts          GET  — vector search
│   │       ├── tickets/mint/route.ts     POST — Solana NFT mint
│   │       ├── voice/route.ts            POST — ElevenLabs TTS
│   │       └── seed/route.ts             GET  — export seed data as JSON
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               Left nav with active state + event badge
│   │   │   └── TopBar.tsx                Page title + alert bell + demo button
│   │   └── shared/
│   │       ├── StatCard.tsx              Animated KPI card
│   │       ├── AlertCard.tsx             AI insight card (dismissible)
│   │       ├── LoadingSkeleton.tsx       Shimmer skeletons for all card types
│   │       └── EmptyState.tsx            Empty state with icon + action
│   │
│   ├── lib/
│   │   ├── services/
│   │   │   ├── gemini.ts                 Gemini adapter — real + mock
│   │   │   ├── mongodb.ts                MongoDB adapter — real + mock
│   │   │   ├── solana.ts                 Solana adapter — devnet + mock
│   │   │   └── elevenlabs.ts             ElevenLabs adapter — real + mock
│   │   ├── store/
│   │   │   └── eventStore.ts             Zustand global state
│   │   ├── data/
│   │   │   ├── events.ts                 Demo event, memory, guests, AI insights
│   │   │   ├── vendors.ts                15 vendors + semantic scoring function
│   │   │   └── budgets.ts                10 budget items + 15 timeline milestones
│   │   ├── schemas/
│   │   │   └── index.ts                  Zod schemas + TypeScript types (all models)
│   │   └── utils.ts                      cn(), formatCurrency(), formatDate(), etc.
│   │
│   └── styles/
│       └── globals.css                   CSS variables, utility classes, animations
│
├── .env.example                          All supported env vars with docs
├── .env.local                            Local config (MOCK_MODE=true by default)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
│  Next.js App Router  ·  Zustand State  ·  Framer Motion │
└──────────────┬──────────────────────────────────────────┘
               │ fetch / server actions
┌──────────────▼──────────────────────────────────────────┐
│                    API Routes (Edge)                      │
│  /api/gemini  /api/vendors  /api/tickets/mint  /api/voice│
└──────────────┬──────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────┐
│                   Service Layer                           │
│  gemini.ts  ·  mongodb.ts  ·  solana.ts  ·  elevenlabs.ts│
│                                                           │
│  MOCK_MODE=true  ──────────▶  src/lib/data/*.ts           │
│  MOCK_MODE=false ──────────▶  Real external APIs          │
└──────────────────────────────────────────────────────────┘
```

**Key design decision:** Every external integration is abstracted behind `src/lib/services/*.ts`. Swapping from mock to real is a single `.env.local` change — no application code changes needed. This also means each sponsor integration can be demonstrated independently.

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, feature grid, sponsor badges, animated preview |
| `/demo` | Scripted 9-step hackathon demo runner |
| `/dashboard` | Event overview — stats, AI alerts, budget strip, upcoming milestones |
| `/dashboard/planner` | AI chat workspace — Gemini plan generation + conflict detection |
| `/dashboard/vendors` | Vendor matching — semantic search, relevance scores, compare modal |
| `/dashboard/budget` | Budget intelligence — Recharts charts, AI recommendations, line items |
| `/dashboard/operations` | Timeline — milestone checklist, live updates panel, run-of-show |
| `/dashboard/tickets` | Solana ticketing — wallet connect, NFT mint, QR code, escrow |
| `/dashboard/voice` | Voice concierge — ElevenLabs TTS, transcript, voice selector |
| `/event/[slug]` | Public guest microsite — RSVP, agenda, FAQ, embedded concierge |
| `/api/gemini` | `POST` — Gemini event plan + chat endpoint |
| `/api/vendors` | `GET ?q=` — vector vendor search endpoint |
| `/api/tickets/mint` | `POST` — Solana NFT mint endpoint |
| `/api/voice` | `POST` — ElevenLabs TTS endpoint |
| `/api/seed` | `GET` — Export all seed data as JSON |

---

## Sponsor Integration Points

### Gemini (Google AI)

| | |
|---|---|
| **File** | `src/lib/services/gemini.ts` |
| **API route** | `POST /api/gemini` |
| **Pages** | AI Planner |
| **Models** | `gemini-1.5-pro`, `text-embedding-004` |

- Natural language → structured `EventPlan` JSON (theme, schedule, vendors, budget, risks)
- Multi-turn chat with persistent event context loaded from MongoDB
- Conflict detection: deposits, budget overruns, RSVP timing, accessibility gaps
- Generates next-action checklists after every response

### MongoDB Atlas

| | |
|---|---|
| **File** | `src/lib/services/mongodb.ts` |
| **API route** | `GET /api/vendors` |
| **Pages** | Vendors, AI Planner, Operations |

- **Vector Search** — `$vectorSearch` on `vendors.embeddingVector` (768-dim, cosine similarity)
- **Persistent AI Memory** — `eventMemory` collection stores every planning decision and preference; loaded into Gemini context on every chat turn
- **Change Streams** — Operations page architecture supports `db.collection.watch()` for real-time milestone updates (simulated in demo mode)
- **Aggregations** — Budget analytics use `$group` / `$sum` pipelines

### Solana

| | |
|---|---|
| **File** | `src/lib/services/solana.ts` |
| **API route** | `POST /api/tickets/mint` |
| **Pages** | Tickets |
| **Network** | Devnet |

- Compressed NFT (cNFT) tickets via Metaplex Bubblegum program
- Ticket metadata: attendee name, access tier, meal preference, perks array, proof-of-attendance flag
- QR code encodes mint address linked to a `/verify/:mintAddress` endpoint
- Solana Pay escrow architecture for milestone-based vendor payments
- Token-gating: previous-event NFT holders unlock loyalty perks (priority RSVP, seating upgrades)

### ElevenLabs

| | |
|---|---|
| **File** | `src/lib/services/elevenlabs.ts` |
| **API route** | `POST /api/voice` |
| **Pages** | Voice Concierge, Event guest page |
| **Model** | `eleven_turbo_v2` |

- Context-aware answers pulled from live event data (not a generic chatbot)
- Organizer voice cloning via ElevenLabs Voice Lab — guests hear the concierge in the organizer's voice
- All concierge sessions logged to MongoDB `voiceLogs` collection
- Mock mode uses browser Web Speech API — works fully offline

---

## Data Models

All models are defined as Zod schemas in `src/lib/schemas/index.ts` and used identically in mock data and real Atlas collections.

| Collection | Key fields |
|-----------|-----------|
| `events` | slug, name, date, location, guestCount, budget, status |
| `eventMemory` | eventId, context, decisions[], preferences, constraints |
| `vendors` | category, specialties, pricePerHead/flatRate, rating, **embeddingVector** |
| `guests` | eventId, mealPreference, accessTier, rsvpStatus, ticketId |
| `tickets` | mintAddress, tier, metadata (attendeeName, perks, POAP), qrCode |
| `budgets` | category, label, projected, actual, isPaid, dueDate |
| `timelineItems` | type (milestone/deadline/task/deposit/runofshow), status, priority, dueDate |
| `aiInsights` | type (conflict/warning/suggestion/opportunity), severity, isResolved |
| `voiceLogs` | question, answer, audioUrl, voice, durationMs |
| `escrowMilestones` | vendorId, amount, currency (SOL/USDC), condition, status |

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI primitives | Radix UI (via shadcn/ui pattern) |
| Animation | Framer Motion |
| State | Zustand |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| QR codes | qrcode.react |
| Notifications | Sonner |
| Icons | Lucide React |
| Fonts | Inter · Plus Jakarta Sans · JetBrains Mono |
| Blockchain | @solana/web3.js |
| Database | MongoDB Node.js driver |

---

## Why This Wins

| Sponsor | What we do | Why it's strong |
|---------|-----------|----------------|
| **Gemini** | Structured plan generation, multi-turn planning chat, conflict detection, persistent AI memory | Not just Q&A — Gemini produces typed JSON that drives real UI. Memory persists across sessions via MongoDB. |
| **MongoDB** | Atlas Vector Search for semantic vendor matching, persistent event memory, change stream–driven ops updates | Vector search is _functional_ with real embedding schema. Not a CRUD demo. |
| **Solana** | Compressed NFT tickets with rich metadata, QR code verification, Solana Pay vendor escrow, loyalty token-gating | Tickets have _utility_ — meal preference, access tier, perks, POAP. Escrow is a real product feature for vendor trust. |
| **ElevenLabs** | Event-aware voice concierge, organizer voice cloning, browser TTS fallback, session logging | Concierge answers from _live event data_ (schedule, parking, meals). Organizer voice makes it personal. |
| **Product** | One coherent end-to-end flow covering planning, vendors, budgets, tickets, and guest experience | Every feature connects to every other. The demo tells a story, not a checklist. |

---

*Built for IndyHack 2026 · Node 18 · Next.js 14 · MOCK_MODE=true runs everything offline*
