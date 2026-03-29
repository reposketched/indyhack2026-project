/**
 * In-memory store for NFT ticket metadata.
 * Keyed by ticketId, served at /api/tickets/metadata/[id].
 * In production this would be persisted in MongoDB.
 */
export const ticketMetadataStore = new Map<string, object>();
