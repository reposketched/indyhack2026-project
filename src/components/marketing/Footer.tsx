import Link from "next/link";
import { Send } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Send className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold font-display text-gradient">Complanion</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-xs text-muted-foreground">
          <Link href="/features" className="hover:text-foreground transition-colors">Capabilities</Link>
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">The Flow</Link>
          <Link href="/powered-by" className="hover:text-foreground transition-colors">Powered by</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
        </div>

        <p className="text-xs text-muted-foreground text-center sm:text-right">
          Built for IndyHack 2026
        </p>
      </div>
    </footer>
  );
}
