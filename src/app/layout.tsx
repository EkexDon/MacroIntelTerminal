import type { Metadata } from "next";
import { DefconProvider } from "@/components/DefconContext";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://macro-intel-terminal.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "Macro Intel Terminal — Real-Time Global Intelligence Platform",
    template: "%s | Macro Intel Terminal",
  },
  description: "Institutional-grade OSINT command center. Real-time aggregation of geopolitical events, crypto markets, dark web chatter, VIP flight tracking, and AI-driven threat analysis. 8 live RSS feeds. Zero cost.",
  keywords: [
    "OSINT", "intelligence", "geopolitics", "crypto", "market tracker",
    "news aggregator", "threat analysis", "DEFCON", "dark web", "terminal",
    "Bloomberg alternative", "real-time", "AI analysis", "flight tracking"
  ],
  authors: [{ name: "Macro Intel Terminal" }],
  creator: "Macro Intel Terminal",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Macro Intel Terminal",
    title: "Macro Intel Terminal — Real-Time Global Intelligence",
    description: "Institutional-grade OSINT command center with live geopolitical feeds, crypto tracking, AI threat analysis, and dark web monitoring.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Macro Intel Terminal — Real-Time Global Intelligence Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Macro Intel Terminal — Real-Time Global Intelligence",
    description: "OSINT command center: live geopolitical feeds, crypto tracking, AI threat analysis, dark web monitoring. Free & open-source.",
    images: ["/og-image.png"],
    creator: "@MacroIntelTerm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0a0a0c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DefconProvider>
          {children}
        </DefconProvider>
      </body>
    </html>
  );
}
