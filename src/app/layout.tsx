import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Com-Plan-ion — AI Event Planning Platform",
  description:
    "Your AI event planner that never forgets. From idea to check-in in minutes. Powered by Gemini, MongoDB, Solana, and ElevenLabs.",
  keywords: ["event planning", "AI", "Gemini", "MongoDB", "Solana", "ElevenLabs", "NFT tickets"],
  openGraph: {
    title: "Com-Plan-ion",
    description: "AI-powered end-to-end event concierge",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            toastOptions={{
              classNames: {
                toast: "font-sans text-sm",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
