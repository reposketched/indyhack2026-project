"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG as QRCode } from "qrcode.react";
import {
  Wallet, Ticket, CheckCircle2, ExternalLink, Copy,
  Sparkles, Shield, Star, Zap, Clock, DollarSign,
  ChevronRight, AlertCircle,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { cn, truncate, formatDate } from "@/lib/utils";
import type { Guest } from "@/lib/schemas";
import { getTierPerks } from "@/lib/services/solana";
import { toast } from "sonner";

const TIER_COLORS = {
  general: { bg: "bg-brand-50", text: "text-brand-700", border: "border-brand-100", badge: "bg-brand-600", darkBg: "dark:bg-brand-900/40", darkText: "dark:text-brand-400", darkBorder: "dark:border-brand-800/50" },
  vip: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", badge: "bg-amber-500", darkBg: "dark:bg-amber-900/40", darkText: "dark:text-amber-400", darkBorder: "dark:border-amber-800/50" },
  speaker: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100", badge: "bg-violet-600", darkBg: "dark:bg-violet-900/40", darkText: "dark:text-violet-400", darkBorder: "dark:border-violet-800/50" },
  staff: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", badge: "bg-emerald-600", darkBg: "dark:bg-emerald-900/40", darkText: "dark:text-emerald-400", darkBorder: "dark:border-emerald-800/50" },
};

const ESCROW_MILESTONES = [
  { vendor: "Iron & Ember Events", amount: 1600, currency: "USDC", status: "funded", condition: "Venue access confirmed", dueDate: "Aug 18" },
  { vendor: "Harvest & Hearth", amount: 2280, currency: "USDC", status: "pending", condition: "Catering deposit (30%)", dueDate: "Aug 15" },
  { vendor: "Golden Hour Studios", amount: 900, currency: "USDC", status: "pending", condition: "50% deposit", dueDate: "Sep 13" },
];

function NFTTicketCard({
  mintAddress,
  attendeeName,
  tier,
  eventName,
  eventDate,
  mealPref,
  perks,
}: {
  mintAddress: string;
  attendeeName: string;
  tier: string;
  eventName: string;
  eventDate: string;
  mealPref?: string;
  perks: string[];
}) {
  const [copied, setCopied] = useState(false);
  const colors = TIER_COLORS[tier as keyof typeof TIER_COLORS] || TIER_COLORS.general;
  const qrValue = `https://complanion.app/verify/${mintAddress}`;

  const copy = () => {
    navigator.clipboard.writeText(mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Mint address copied");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-border shadow-card-xl max-w-sm"
    >
      {/* Card background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", tier === "vip" ? "from-amber-100" : "from-brand-100")} />
      <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern opacity-10" />

      {/* Header */}
      <div className={cn("relative px-6 pt-6 pb-4 bg-gradient-to-r", tier === "vip" ? "from-amber-500 to-amber-700" : tier === "speaker" ? "from-violet-600 to-violet-800" : "from-brand-600 to-brand-800")}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">NFT Access Pass</div>
            <div className="text-lg font-bold text-white font-display leading-tight">{eventName}</div>
            <div className="text-sm text-white/80 mt-0.5">{eventDate}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4", "bg-white/20 text-white")}>
          <Star className="w-3 h-3" />
          {tier.toUpperCase()} ACCESS
        </div>
      </div>

      {/* Body */}
      <div className="relative bg-card px-6 py-5 space-y-4">
        {/* Attendee */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
            {attendeeName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{attendeeName}</div>
            {mealPref && <div className="text-xs text-muted-foreground capitalize">🍽 {mealPref}</div>}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-3 rounded-xl border border-border bg-white dark:bg-card shadow-card-sm">
            <QRCode value={qrValue} size={120} level="M" />
          </div>
        </div>

        {/* Mint address */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Mint Address · Solana Devnet</div>
            <div className="text-xs font-mono text-foreground truncate">{truncate(mintAddress, 32)}</div>
          </div>
          <button onClick={copy} className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </div>

        {/* Perks */}
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ticket Includes</div>
          <div className="space-y-1">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-xs text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Explorer link */}
        <a
          href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View on Solana Explorer (devnet)
        </a>
      </div>
    </motion.div>
  );
}

export default function TicketsPage() {
  const { mintedTicketAddress, setMintedTicketAddress, isMinting, setIsMinting, event, guests } = useEventStore();
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === "confirmed");
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(confirmedGuests[0] ?? null);
  const [mintedGuests, setMintedGuests] = useState<string[]>([]);
  const eventDateStr = formatDate(event.date, "short");

  const handleConnectWallet = () => {
    setWalletConnected(true);
    toast.success("Wallet connected", { description: "Demo wallet · 8.42 SOL" });
  };

  const handleMint = async () => {
    if (!selectedGuest) { toast.error("Select a guest first"); return; }
    if (!walletConnected) { toast.error("Connect wallet first"); return; }
    setIsMinting(true);
    try {
      const res = await fetch("/api/tickets/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          guestId: selectedGuest._id,
          attendeeName: selectedGuest.name,
          eventName: event.name,
          eventDate: eventDateStr,
          tier: selectedGuest.accessTier,
          mealPreference: selectedGuest.mealPreference,
        }),
      });
      const data = await res.json();
      setMintedTicketAddress(data.mintAddress);
      setMintedGuests((prev) => [...prev, selectedGuest._id!]);
      toast.success("NFT ticket minted!", { description: `Solana devnet · ${data.txSignature?.slice(0, 16)}...` });
    } catch {
      const fakeAddress = Array.from({ length: 44 }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]).join("");
      setMintedTicketAddress(fakeAddress);
      setMintedGuests((prev) => [...prev, selectedGuest._id!]);
      toast.success("NFT ticket minted!", { description: "Solana devnet (mock mode)" });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="page-title">NFT Ticketing</h2>
          <p className="page-subtitle">Solana compressed NFTs · Devnet · Useful metadata, not collectible fluff</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border bg-card">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          Solana Devnet
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet connect */}
          <div className="card-base p-5">
            <div className="section-label mb-4">Step 1: Connect Wallet</div>
            {walletConnected ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Wallet Connected</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-500">Demo wallet · 5DV3g...9kWfZ · 8.42 SOL</div>
                </div>
              </div>
            ) : (
              <button onClick={handleConnectWallet} className="btn-primary w-full justify-center py-3">
                <Wallet className="w-4 h-4" />
                Connect Solana Wallet
              </button>
            )}
          </div>

          {/* Select guest */}
          <div className="card-base p-5">
            <div className="section-label mb-4">Step 2: Select Attendee</div>
            {confirmedGuests.length === 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                No confirmed guests yet. Add guests with confirmed RSVP status to mint tickets.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {confirmedGuests.map((guest) => (
                  <button
                    key={guest._id}
                    onClick={() => setSelectedGuest(guest)}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                      selectedGuest?._id === guest._id
                        ? "border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/40"
                        : "border-border bg-card hover:bg-muted/40"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {guest.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{guest.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0",
                          guest.accessTier === "vip" ? "bg-amber-400" : guest.accessTier === "speaker" ? "bg-violet-400" : "bg-brand-400"
                        )} />
                        {guest.accessTier} · {guest.mealPreference ?? "no pref"}
                      </div>
                    </div>
                    {mintedGuests.includes(guest._id!) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mint */}
          <div className="card-base p-5">
            <div className="section-label mb-4">Step 3: Mint NFT Ticket</div>
            {selectedGuest ? (
              <>
                <div className="flex items-start gap-4 mb-5 p-4 rounded-xl bg-muted/40 border border-border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-24">Attendee</span>
                      <span className="font-medium text-foreground">{selectedGuest.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-24">Access Tier</span>
                      <span className="font-semibold text-foreground capitalize">{selectedGuest.accessTier}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-24">Meal Pref</span>
                      <span className="font-medium text-foreground capitalize">{selectedGuest.mealPreference || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-24">Network</span>
                      <span className="font-medium text-violet-600">Solana Devnet</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Est. cost</div>
                    <div className="text-sm font-bold text-foreground">~0.0012 SOL</div>
                    <div className="text-[10px] text-muted-foreground">compressed NFT</div>
                  </div>
                </div>
                <button
                  onClick={handleMint}
                  disabled={isMinting || mintedGuests.includes(selectedGuest._id!)}
                  className={cn("w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
                    mintedGuests.includes(selectedGuest._id!)
                      ? "bg-emerald-500 text-white cursor-default"
                      : "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                  )}
                >
                  {isMinting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Minting on Solana...
                    </>
                  ) : mintedGuests.includes(selectedGuest._id!) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Ticket Minted
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Mint NFT Ticket
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Select a confirmed guest above to mint their ticket.
              </div>
            )}
          </div>

          {/* Escrow */}
          <div className="card-base overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <div className="text-sm font-semibold text-foreground">Vendor Payment Escrow</div>
              <div className="text-xs text-muted-foreground">Solana Pay · Milestone-based release</div>
            </div>
            {ESCROW_MILESTONES.map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0",
                  m.status === "funded" ? "bg-emerald-400" : "bg-muted-foreground/40"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{m.vendor}</div>
                  <div className="text-xs text-muted-foreground">{m.condition} · Due {m.dueDate}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-foreground">{m.amount.toLocaleString()} {m.currency}</div>
                  <div className={cn("text-[10px] font-medium", m.status === "funded" ? "text-emerald-600" : "text-muted-foreground")}>
                    {m.status === "funded" ? "Escrowed" : "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loyalty section */}
          <div className="card-base p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <div className="text-sm font-semibold text-foreground">Token-Gated Perks</div>
              <span className="ml-auto text-xs text-muted-foreground">Previous event NFT holders</span>
            </div>
            <div className="space-y-2">
              {[
                { tier: "Returning Attendee (1+ events)", perk: "Priority RSVP window", icon: Clock },
                { tier: "Regular (3+ events)", perk: "Reserved front-row seating + swag bag", icon: Star },
                { tier: "Champion (5+ events)", perk: "VIP upgrade + speaker introduction opportunity", icon: Sparkles },
              ].map(({ tier, perk, icon: Icon }) => (
                <div key={tier} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{tier}</div>
                    <div className="text-[10px] text-muted-foreground">{perk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: NFT card */}
        <div className="space-y-4">
          <div className="section-label">Generated NFT Ticket</div>
          {mintedTicketAddress && selectedGuest ? (
            <NFTTicketCard
              mintAddress={mintedTicketAddress}
              attendeeName={selectedGuest.name}
              tier={selectedGuest.accessTier}
              eventName={event.name}
              eventDate={eventDateStr}
              mealPref={selectedGuest.mealPreference}
              perks={getTierPerks(selectedGuest.accessTier)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
              <Ticket className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <div className="text-sm font-medium text-muted-foreground mb-1">No ticket minted yet</div>
              <div className="text-xs text-muted-foreground">Select a guest and mint to see the NFT card</div>
            </div>
          )}

          {/* Architecture note */}
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 dark:bg-violet-900/20 dark:border-violet-800/40">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1">Architecture (for judges)</div>
                <div className="text-[11px] text-violet-700 dark:text-violet-400 leading-relaxed space-y-1">
                  <div>• Compressed NFT (cNFT) via Metaplex Bubblegum</div>
                  <div>• Metadata: attendee, tier, meal, perks, POAP flag</div>
                  <div>• QR encodes mint address + verification endpoint</div>
                  <div>• Solana Pay escrow for vendor milestone payments</div>
                  <div>• Token-gating: read previous event NFT ownership</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
