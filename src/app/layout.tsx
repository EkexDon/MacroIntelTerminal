import type { Metadata } from "next";
import { DefconProvider } from "@/components/DefconContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro Intel Dashboard",
  description: "Live Global News & Market Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
