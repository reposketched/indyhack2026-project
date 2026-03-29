"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Zap, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/features", label: "Capabilities" },
  { href: "/how-it-works", label: "The Flow" },
  { href: "/powered-by", label: "Powered by" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
            <Send className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold font-display text-gradient">Complanion</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm transition-colors",
                (exact ? pathname === href : pathname.startsWith(href))
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard" className="btn-secondary text-sm hidden md:flex">
            Dashboard
          </Link>
          <Link href="/demo" className="btn-primary text-sm hidden sm:flex">
            <Zap className="w-3.5 h-3.5" />
            Launch Demo
          </Link>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm transition-colors",
                  (exact ? pathname === href : pathname.startsWith(href))
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="btn-primary text-sm mt-1 justify-center"
            >
              <Zap className="w-3.5 h-3.5" />
              Launch Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
