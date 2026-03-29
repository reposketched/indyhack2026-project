"use client";

import { useEventStore } from "@/lib/store/eventStore";
import { WelcomeScreen } from "./WelcomeScreen";

export function DashboardGate({ children }: { children: React.ReactNode }) {
  const hasStarted = useEventStore((s) => s.hasStarted);
  if (!hasStarted) return <WelcomeScreen />;
  return <>{children}</>;
}
