import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global EV Market Intelligence & Tableau Analytics Platform",
  description:
    "Executive-level Electric Vehicle analytics dashboard, MongoDB database pipeline, Tableau integration, and interactive research hubs for market strategy, competitive intelligence, and sustainable mobility.",
  keywords: [
    "Electric Vehicles",
    "EV Analytics",
    "Battery Technology",
    "LFP",
    "NMC",
    "Solid-State",
    "Tableau Dashboard",
    "MongoDB Analytics",
    "Sustainable Mobility",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
