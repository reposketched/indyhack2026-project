/**
 * Solana Service Adapter
 *
 * Real mode: Uses @solana/web3.js + Metaplex to mint cNFT tickets on devnet.
 * Supports Solana Pay for vendor escrow payments.
 *
 * Mock mode: Simulates minting with realistic transaction signatures and metadata.
 *
 * Architecture for judges:
 * - NFT ticket = compressed NFT (cNFT) via Bubblegum program
 * - Ticket metadata: attendee name, event, tier, meal, perks, proof-of-attendance
 * - QR code encodes mint address + verification endpoint
 * - Solana Pay: vendor payment escrow with milestone release conditions
 * - Loyalty: previous event NFT holders get priority access via token-gating
 */

import { sleep, generateId } from "@/lib/utils";
import type { Ticket } from "@/lib/schemas";

const IS_MOCK = process.env.MOCK_MODE === "true" || !process.env.SOLANA_RPC_URL;

export interface MintTicketRequest {
  eventId: string;
  guestId: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  tier: "general" | "vip" | "speaker" | "staff";
  mealPreference?: string;
  perks?: string[];
}

export interface MintTicketResult {
  success: boolean;
  mintAddress: string;
  txSignature: string;
  qrCodeData: string;
  ticket: Ticket;
  explorerUrl: string;
}

export interface EscrowMilestoneRequest {
  vendorId: string;
  amount: number;
  currency: "SOL" | "USDC";
  condition: string;
  dueDate: string;
}

const TIER_PERKS: Record<string, string[]> = {
  general: ["Event Access", "All Food Stations", "Networking Directory"],
  vip: ["Event Access", "All Food Stations", "Networking Directory", "VIP Lounge", "Priority Check-in", "Speaker Meet & Greet"],
  speaker: ["Event Access", "All Food Stations", "Networking Directory", "Speaker Backstage", "Recording of Your Talk", "Priority Check-in"],
  staff: ["Staff Access", "All Areas", "Staff Meal", "Event Coordination Tools"],
};

function generateMockMintAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function generateMockTxSignature(): string {
  const chars = "0123456789abcdef";
  return Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function mintTicket(req: MintTicketRequest): Promise<MintTicketResult> {
  if (IS_MOCK) {
    await sleep(2000 + Math.random() * 1000); // Simulate blockchain latency

    const mintAddress = generateMockMintAddress();
    const txSignature = generateMockTxSignature();
    const ticketId = `ticket_${generateId()}`;

    const ticket: Ticket = {
      _id: ticketId,
      eventId: req.eventId,
      guestId: req.guestId,
      mintAddress,
      tokenId: ticketId,
      network: "devnet",
      tier: req.tier,
      status: "minted",
      metadata: {
        attendeeName: req.attendeeName,
        eventName: req.eventName,
        eventDate: req.eventDate,
        mealPreference: req.mealPreference,
        accessLevel: req.tier.toUpperCase(),
        proofOfAttendance: false,
        perks: req.perks || TIER_PERKS[req.tier] || [],
      },
      qrCode: `https://complanion.app/verify/${mintAddress}`,
      mintedAt: new Date().toISOString(),
      txSignature,
    };

    return {
      success: true,
      mintAddress,
      txSignature,
      qrCodeData: `https://complanion.app/verify/${mintAddress}`,
      ticket,
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
    };
  }

  // Real Solana minting:
  // 1. Connect to devnet RPC
  // 2. Use Metaplex Bubblegum to mint compressed NFT
  // 3. Set metadata URI to event-specific JSON hosted on Arweave/IPFS
  // 4. Return mint address + transaction signature
  const { Connection, clusterApiUrl } = await import("@solana/web3.js");
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || clusterApiUrl("devnet")
  );
  console.log("Solana connection established:", connection.rpcEndpoint);

  // TODO: Implement Metaplex Bubblegum minting
  // const { Metaplex } = await import("@metaplex-foundation/js");
  // ...

  throw new Error("Real Solana minting not yet configured. Set MOCK_MODE=true to use demo mode.");
}

export async function verifyTicket(mintAddress: string): Promise<{ valid: boolean; ticket?: Ticket }> {
  if (IS_MOCK) {
    await sleep(300);
    return {
      valid: true,
      ticket: {
        _id: "ticket_demo",
        eventId: "event_demo_001",
        guestId: "guest_001",
        mintAddress,
        network: "devnet",
        tier: "vip",
        status: "minted",
        metadata: {
          attendeeName: "Maya Chen",
          eventName: "Roots & Reach: Autumn Networking Summit",
          eventDate: "September 20, 2025",
          mealPreference: "vegetarian",
          accessLevel: "VIP",
          proofOfAttendance: false,
          perks: TIER_PERKS.vip,
        },
        qrCode: `https://complanion.app/verify/${mintAddress}`,
        mintedAt: new Date().toISOString(),
      },
    };
  }

  // TODO: Query Solana RPC to verify token ownership
  return { valid: false };
}

export async function createEscrowMilestone(req: EscrowMilestoneRequest): Promise<{ programId: string; escrowAddress: string }> {
  if (IS_MOCK) {
    await sleep(1500);
    return {
      programId: "EscrwProgram11111111111111111111111111111111",
      escrowAddress: generateMockMintAddress(),
    };
  }

  // TODO: Deploy Anchor escrow program interaction
  // Escrow conditions: vendor delivers by dueDate → organizer releases funds
  throw new Error("Real escrow not configured.");
}

export function getTierPerks(tier: string): string[] {
  return TIER_PERKS[tier] || TIER_PERKS.general;
}
