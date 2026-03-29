"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useEventStore } from "@/lib/store/eventStore";
import { WelcomeScreen } from "./WelcomeScreen";

export function DashboardGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const hasStarted = useEventStore((s) => s.hasStarted);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // Wait for localStorage to hydrate into the Zustand stores
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-full">
        <div className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (!hasStarted) return <WelcomeScreen />;
  return <>{children}</>;
}
