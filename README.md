# 🌐 Macro Intel Terminal

![Macro Intel Terminal](https://macro-intel-terminal.vercel.app/og-image.jpg) <!-- Update with your actual screenshot URL if you add one later -->

**Live Deployment:** [macro-intel-terminal.vercel.app](https://macro-intel-terminal.vercel.app)

The **Macro Intel Terminal** is a high-end, real-time financial and geopolitical command center. Designed with a premium hacker-dashboard aesthetic, it aggregates global intelligence, filters out local noise, and provides live, correlated insights into world events, crypto, commodities, and equities.

---

## ⚡ Core Features

* **📡 Central Intelligence Feed:** Aggregates real-time news from premium RSS sources (BBC, Al Jazeera, CNBC, CoinTelegraph), automatically filtering out low-level noise to focus strictly on macro-economic and geopolitical events.
* **🗺️ Global Tactical Map:** Interactive 2D vector map rendering pulsing heat signatures and SONAR tooltips for geo-linked intelligence. Click the map to enter the full-scale fullscreen command center.
* **📈 Live Impact Correlation:** Every news event dynamically correlates to immediate market gainers and losers in real-time.
* **📊 SVG Sparkline Tracking:** Fluid, natively rendered SVG sparklines track the 24-hour trajectories of Macro Indicators (VIX, BTC.D, Fear/Greed) and Sector Capital Flows.
* **🎛️ Keyword SONAR Alerts:** Define high-priority keywords (e.g., "Uranium", "Cyberattack"). Incoming matches trigger a synthesized Web Audio API sine-wave ping and a synchronized visual red flash.
* **🚨 Critical Directive Banner:** Prominently isolates the single most high-impact breaking story at the top of the interface with deep glassmorphism image blur logic.
* **🌗 Day/Night Optics:** One-click toggle between the classic premium dark aesthetic and a high-visibility light mode with customized WebKit scrollbars.

---

## 🛠️ Architecture & Tech Stack

This project is built for blistering Edge performance and strict React 19 / Next.js 15 routing:

* **Framework:** [Next.js (App Router)](https://nextjs.org/)
* **Core Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Modules (Glassmorphism & GPU Acceleration)
* **Data Pipelines:** `rss-parser` + Native Next.js Caching & Backend Proxying (Bypassing CORS)
* **Visualizations:** `react-simple-maps` 

---

## 🚀 Local Deployment

To run the Terminal locally on your own machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EkexDon/MacroIntelTerminal.git
   cd MacroIntelTerminal
   ```
2. **Install dependencies:**  
   *Note: Because of strict React 19 dependencies, ensure you use the legacy peer flags if resolving conflicts.*
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Initialize the Uplink (Dev Server):**
   ```bash
   npm run dev
   ```
4. Access the terminal at `http://localhost:3000`.

---

## 🧠 Developed by Team Chef
Built as an autonomous agentic experiment pushing the limits of modern UI/UX data-dashboard aesthetics.

**No API Keys Required.** All intelligence is scraped, mapped, and mathematically simulated for impact on the fly using public global feeds.
