"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, MapPin, DollarSign, Bookmark, BookmarkCheck,
  X, SlidersHorizontal, Sparkles, ExternalLink, ChevronRight,
  CheckCircle2, Database,
} from "lucide-react";
import { useEventStore } from "@/lib/store/eventStore";
import { VendorCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { cn, formatCurrency } from "@/lib/utils";
import type { VendorMatch } from "@/lib/schemas";
import { toast } from "sonner";
import { MOCK_VENDORS, getMockVendorMatches } from "@/lib/data/vendors";

const CATEGORY_LABELS: Record<string, string> = {
  catering: "Catering",
  venue: "Venue",
  photography: "Photography",
  entertainment: "Entertainment",
  decor: "Decor",
  staffing: "Staffing",
  technology: "Technology",
};

const DEMO_QUERIES = [
  "rustic outdoor catering vegetarian $40/head",
  "outdoor venue 200 guests Indiana",
  "nature photography warm aesthetic",
  "ambient acoustic music networking",
  "wildflower sustainable decor",
];

function RelevanceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-brand-500" : "bg-amber-500"
          )}
        />
      </div>
      <span className="text-xs font-mono font-semibold text-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

function VendorCard({
  vendor,
  isShortlisted,
  onToggleShortlist,
  onCompare,
  delay = 0,
}: {
  vendor: VendorMatch;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onCompare: () => void;
  delay?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const categoryColorMap: Record<string, string> = {
    catering: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    venue: "bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400",
    photography: "bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    entertainment: "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    decor: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    staffing: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
    technology: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  };

  const catColor = categoryColorMap[vendor.category] || "bg-muted text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        "card-base p-5 transition-all duration-200 hover:shadow-card-md",
        isShortlisted && "ring-1 ring-brand-200"
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0", catColor)}>
          {vendor.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">{vendor.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {vendor.location}
              </div>
            </div>
            <button
              onClick={onToggleShortlist}
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                isShortlisted
                  ? "bg-brand-50 text-brand-600 border border-brand-100 dark:bg-brand-900/40 dark:text-brand-400 dark:border-brand-800/50"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
              )}
            >
              {isShortlisted ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category + relevance */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", catColor)}>
          {CATEGORY_LABELS[vendor.category] || vendor.category}
        </span>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-foreground">{vendor.rating}</span>
          <span className="text-xs text-muted-foreground">({vendor.reviewCount})</span>
        </div>
      </div>

      {/* Vector search relevance */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vector Match</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Database className="w-2.5 h-2.5" />MongoDB Atlas
          </span>
        </div>
        <RelevanceBar score={vendor.relevanceScore} />
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-3 text-xs text-foreground">
        <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
        {vendor.pricePerHead
          ? `$${vendor.pricePerHead}/head · est. ${formatCurrency(vendor.estimatedTotal)} total`
          : `${formatCurrency(vendor.flatRate || 0)} flat rate`}
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {vendor.specialties.slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {s}
          </span>
        ))}
      </div>

      {/* AI reasoning */}
      <div className="p-3 rounded-lg bg-brand-50 border border-brand-100 dark:bg-brand-900/20 dark:border-brand-800/40 mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3 text-brand-500 dark:text-brand-400" />
          <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">AI Reasoning</span>
        </div>
        <p className="text-xs text-brand-800 dark:text-brand-300 leading-relaxed">
          {expanded ? vendor.aiReasoning : vendor.aiReasoning.slice(0, 120) + (vendor.aiReasoning.length > 120 ? "..." : "")}
        </p>
        {vendor.aiReasoning.length > 120 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[10px] text-brand-600 mt-1 hover:text-brand-700 font-medium"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onCompare}
          className="flex-1 btn-secondary text-xs py-1.5"
        >
          Compare
        </button>
        <button
          onClick={() => {
            onToggleShortlist();
            toast.success(isShortlisted ? "Removed from shortlist" : "Added to shortlist");
          }}
          className={cn("flex-1 text-xs py-1.5 rounded-lg font-medium transition-all",
            isShortlisted
              ? "bg-brand-600 text-white hover:bg-brand-700"
              : "bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800/50 dark:hover:bg-brand-900/50"
          )}
        >
          {isShortlisted ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : null}
          {isShortlisted ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
    </motion.div>
  );
}

function CompareModal({ vendors, onClose }: { vendors: VendorMatch[]; onClose: () => void }) {
  const fields = ["Category", "Rating", "Price", "Specialties", "Location", "Est. Total"];
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border shadow-card-xl w-full max-w-2xl max-h-[80vh] overflow-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground font-display">Compare Vendors</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <td className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28 pb-4" />
                {vendors.map((v) => (
                  <td key={v._id} className="text-sm font-semibold text-foreground pb-4 px-4 text-center">{v.name}</td>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 text-xs text-muted-foreground font-medium">Category</td>
                {vendors.map((v) => <td key={v._id} className="py-3 px-4 text-xs text-center capitalize">{v.category}</td>)}
              </tr>
              <tr>
                <td className="py-3 text-xs text-muted-foreground font-medium">Rating</td>
                {vendors.map((v) => (
                  <td key={v._id} className="py-3 px-4 text-xs text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {v.rating} ({v.reviewCount})
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs text-muted-foreground font-medium">Price</td>
                {vendors.map((v) => (
                  <td key={v._id} className="py-3 px-4 text-xs text-center">
                    {v.pricePerHead ? `$${v.pricePerHead}/head` : formatCurrency(v.flatRate || 0)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs text-muted-foreground font-medium">Est. Total</td>
                {vendors.map((v) => <td key={v._id} className="py-3 px-4 text-xs text-center font-semibold">{formatCurrency(v.estimatedTotal)}</td>)}
              </tr>
              <tr>
                <td className="py-3 text-xs text-muted-foreground font-medium">Match</td>
                {vendors.map((v) => (
                  <td key={v._id} className="py-3 px-4">
                    <RelevanceBar score={v.relevanceScore} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs text-muted-foreground font-medium align-top">Specialties</td>
                {vendors.map((v) => (
                  <td key={v._id} className="py-3 px-4 text-xs text-center">
                    {v.specialties.slice(0, 3).join(", ")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default function VendorsPage() {
  const { vendorResults, setVendorResults, shortlistedVendors, toggleShortlist, vendorQuery, setVendorQuery } = useEventStore();
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const displayVendors = vendorResults.length > 0
    ? vendorResults
    : getMockVendorMatches("rustic outdoor catering vegetarian networking").map((v) => v);

  const filteredVendors = activeCategory === "all"
    ? displayVendors
    : displayVendors.filter((v) => v.category === activeCategory);

  const categories = Array.from(new Set(displayVendors.map((v) => v.category)));
  const compareVendors = displayVendors.filter((v) => compareList.includes(v._id || ""));

  const handleSearch = async (query?: string) => {
    const q = query || vendorQuery;
    if (!q.trim()) return;
    setVendorQuery(q);
    setIsSearching(true);
    try {
      const res = await fetch(`/api/vendors?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setVendorResults(data.vendors || []);
      toast.success(`Found ${data.vendors?.length || 0} vendors`, { description: "MongoDB Atlas Vector Search" });
    } catch {
      const results = getMockVendorMatches(q) as VendorMatch[];
      setVendorResults(results);
      toast.info("Using semantic mock search", { description: "Connect MongoDB Atlas for real vector search" });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleCompare = (vendorId: string) => {
    setCompareList((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : prev.length < 3 ? [...prev, vendorId] : prev
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header + search */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="page-title">Vendor Matching</h2>
            <p className="page-subtitle">Semantic search powered by MongoDB Atlas Vector Search</p>
          </div>
          {compareList.length >= 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="btn-primary text-sm"
            >
              Compare ({compareList.length})
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={vendorQuery}
              onChange={(e) => setVendorQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder='Try: "cozy Italian catering, family-owned, under $40/head"'
              className="input-base pl-10"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="btn-primary px-5"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Search className="w-4 h-4" /> Search</>
            )}
          </button>
          <button className="btn-secondary px-3">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Demo queries */}
        <div className="flex flex-wrap gap-2">
          {DEMO_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted hover:border-brand-200 transition-all text-muted-foreground hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* MongoDB badge */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">MongoDB Atlas Vector Search</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-500 ml-2">· Vendor embeddings indexed with text-embedding-004 · cosine similarity</span>
        </div>
        <span className="text-xs text-emerald-600 dark:text-emerald-500 font-mono">{filteredVendors.length} results</span>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
            activeCategory === "all" ? "bg-brand-600 text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
          )}
        >
          All ({displayVendors.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize whitespace-nowrap",
              activeCategory === cat ? "bg-brand-600 text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {CATEGORY_LABELS[cat] || cat} ({displayVendors.filter((v) => v.category === cat).length})
          </button>
        ))}
      </div>

      {/* Shortlisted strip */}
      {shortlistedVendors.length > 0 && (
        <div className="p-4 rounded-xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold text-foreground">{shortlistedVendors.length} vendors shortlisted</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {displayVendors
              .filter((v) => shortlistedVendors.includes(v._id || ""))
              .map((v) => (
                <div key={v._id} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs text-brand-700 dark:bg-brand-900/40 dark:border-brand-800/50 dark:text-brand-400">
                  <CheckCircle2 className="w-3 h-3" />
                  {v.name}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Vendor grid */}
      {isSearching ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <VendorCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredVendors.map((vendor, i) => (
              <VendorCard
                key={vendor._id}
                vendor={vendor}
                isShortlisted={shortlistedVendors.includes(vendor._id || "")}
                onToggleShortlist={() => toggleShortlist(vendor._id || "")}
                onCompare={() => toggleCompare(vendor._id || "")}
                delay={i * 0.04}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Compare modal */}
      <AnimatePresence>
        {showCompare && compareVendors.length >= 2 && (
          <CompareModal vendors={compareVendors} onClose={() => setShowCompare(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
