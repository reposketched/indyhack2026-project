# Com-Plan-ion

> **Your AI event planner that never forgets. From idea to check-in in minutes.**

Com-Plan-ion is a full-stack, production-quality AI event planning platform built for IndyHack 2026. It demonstrates best use of **Gemini**, **MongoDB**, **Solana**, and **ElevenLabs** through one coherent, end-to-end product — not a collection of demos duct-taped together.

An organizer speaks: _"I want a rustic outdoor networking event for 200 people in September, budget $8k, vegetarian-friendly."_ The app generates a structured plan, finds vendors via semantic search, detects timeline conflicts, mints an NFT ticket, publishes a guest microsite, and lets every attendee talk to a live AI voice concierge. All in one flow.

---

## Table of Contents

[Project Overview](#project-overview)
[Prerequisites](#prerequisites)
[Setup & Installation](#setup--installation)
[Connecting Real APIs](#connecting-real-apis)
   - [Gemini](#gemini)
   - [MongoDB Atlas](#mongodb-atlas)
   - [Solana](#solana)
   - [ElevenLabs](#elevenlabs)
[Project Structure](#project-structure)
[Architecture](#architecture)
[Pages & Routes](#pages--routes)
[Data Models](#data-models)
[Tech Stack](#tech-stack)

---

## Project Overview


**App name**: Com-Plan-ion 
**Hackathon**: IndyHack 2026 
**Node version**: 18+ 
**Framework**: Next.js 14 (App Router)
**Language**: TypeScript 
**Mock mode**: Fully functional with zero API keys 

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


*Built for IndyHack 2026 · Node 18 · Next.js 14 · MOCK_MODE=true runs everything offline*
