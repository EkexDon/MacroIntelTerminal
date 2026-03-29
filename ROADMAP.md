# 🗺️ Macro Intel Terminal — 30-Day Roadmap

> Generated: 2026-03-29 | Based on competitive OSINT analysis, Bloomberg Terminal gap research, and modern UX engagement trends.

## Current State Audit

| Metric | Count |
|--------|-------|
| Pages/Routes | 4 (`/`, `/map`, `/nexus`, `/alpha`) |
| Components | 17 |
| API Endpoints | 7 (`news`, `market`, `osint`, `seismic`, `oracle`, `vanguard`, `alpha`) |
| Live Data Sources | 5 (BBC RSS, Al Jazeera, CoinCap, USGS, Polymarket) |
| Simulated Agents | 4 (Vanguard, Whisper, Alpha, Radio Intercept) |

---

## Week 1 (Days 1–7): "Operation Credibility"
**Focus: Polish, Performance & Trust**

> *Subagent Consensus: Users leave dashboards with broken layouts, slow loads, and no mobile support. Before adding features, lock down what exists.*

| # | Feature | Difficulty | Description |
|---|---------|-----------|-------------|
| 1 | **Mobile Responsive Overhaul** | ⭐⭐⭐ | The dashboard, map, and alpha page must be fully usable on tablets and phones. Collapsible sidebar, touch-friendly toggles, stacked card layouts. |
| 2 | **Loading Skeleton States** | ⭐⭐ | Replace all "CALIBRATING..." text loaders with animated skeleton shimmer components matching the glass-panel aesthetic. |
| 3 | **SEO & Meta Tags** | ⭐ | Add OpenGraph images, Twitter cards, and proper `<meta>` descriptions so the project looks professional when shared on social media. |
| 4 | **Performance Audit** | ⭐⭐ | Lazy-load heavy components (FullscreenMap, Recharts). Add `next/image` where applicable. Target Lighthouse score >85. |

**Deliverable:** A polished, mobile-ready terminal that loads fast and looks professional when shared.

---

## Week 2 (Days 8–14): "Operation Autonomy"
**Focus: AI Integration & Smart Automation**

> *Subagent Consensus: The #1 feature gap vs. Bloomberg is AI-driven insights. Users want the terminal to THINK, not just display.*

| # | Feature | Difficulty | Description |
|---|---------|-----------|-------------|
| 1 | **🤖 Agent Cortex: AI Morning Briefing** | ⭐⭐⭐ | Auto-generated daily intelligence summary. Aggregate the top 5 news items, current DEFCON level, active chokepoint threats, and crypto momentum into a single "Morning Briefing" card that refreshes at 08:00 UTC. Uses our existing TF-IDF + sentiment data — no external LLM needed. |
| 2 | **📊 Heatmap Layer on Map** | ⭐⭐⭐ | Density-based heatmap showing global event clustering. Red = high conflict density, Blue = economic activity. Togglable like the existing OSINT/Logistics layers. |
| 3 | **🔔 Custom Alert Rules** | ⭐⭐ | Let users define their own keyword watchlists (e.g., "NVIDIA", "Oil Embargo") and receive toast notifications when those keywords spike in the feed. Persist in `localStorage`. |
| 4 | **📅 Timeline/History View** | ⭐⭐⭐ | A horizontal scrollable timeline showing the last 7 days of major events. Each node is clickable and shows the headlines from that day. Critical for pattern recognition. |

**Deliverable:** The terminal starts forming its own opinions and delivering proactive intelligence.

---

## Week 3 (Days 15–21): "Operation Depth"
**Focus: Advanced Financial Tools & Data Export**

> *Subagent Consensus: Retail traders want portfolio tools, options data, and the ability to EXPORT intelligence for their own models.*

| # | Feature | Difficulty | Description |
|---|---------|-----------|-------------|
| 1 | **📁 Agent Terminal: Data Export Module** | ⭐⭐ | One-click CSV/JSON export of the current news feed, Alpha quant data, and crypto prices. Essential for quant traders who want to run their own models on our data. |
| 2 | **📈 Advanced Alpha Charts** | ⭐⭐⭐ | Add candlestick charts, Bollinger Bands, and RSI indicators to the `/alpha` quant dashboard. Use `recharts` custom shapes. |
| 3 | **🔐 Agent OPSEC: Shadow Browser** | ⭐⭐⭐⭐ | Server-side proxy (`/api/proxy?url=...`) that fetches external article content. Users can read full articles inside a secure modal without ever leaving the terminal or exposing their IP to the source. |
| 4 | **🌍 Region Focus Mode** | ⭐⭐ | Click a region on the map (e.g., "Middle East") to filter the entire dashboard — news feed, indicators, and alerts — to only show intelligence relevant to that geographic area. |

**Deliverable:** The terminal becomes a serious analytical workstation, not just a visualization layer.

---

## Week 4 (Days 22–30): "Operation Dominance"
**Focus: Social Features, Virality & Community**

> *Subagent Consensus: The Bloomberg "IB Chat" killer feature is community. The terminal needs social gravity to retain users.*

| # | Feature | Difficulty | Description |
|---|---------|-----------|-------------|
| 1 | **👤 User Profiles & Watchlists** | ⭐⭐⭐ | Simple auth (email/password or GitHub OAuth via NextAuth). Users can save custom keyword watchlists, preferred map layers, and theme settings that persist across sessions. |
| 2 | **💬 Intel Comment Feed** | ⭐⭐⭐⭐ | A live, anonymous comment stream attached to each news event. Think "Bloomberg IB Chat meets Reddit." Users can post short tactical assessments on breaking events. |
| 3 | **📸 Shareable Intelligence Cards** | ⭐⭐ | "Share as Image" button that renders the current DEFCON status, top 3 headlines, and the map screenshot into a beautiful PNG card optimized for Twitter/Instagram. Viral growth engine. |
| 4 | **🏆 Leaderboard & Gamification** | ⭐⭐⭐ | Track which users predicted events correctly (based on their comments + keyword alerts). Monthly leaderboard of "Top Analysts." Creates competition and retention. |

**Deliverable:** The terminal transforms from a solo tool into a living intelligence community.

---

## Stretch Goals (Post Day 30)

| Feature | Description |
|---------|-------------|
| **🛰️ Agent Orbital** | Satellite imagery anomaly detection using Sentinel-2 free data |
| **🧬 Agent Blueprint** | Interactive supply-chain dependency mapper (click "iPhone" → trace rare earth metals) |
| **📱 PWA / Mobile App** | Installable Progressive Web App with push notifications for DEFCON changes |
| **🔌 WebSocket Live Feed** | Replace polling with real-time WebSocket connections for zero-latency updates |
| **🌐 Multi-Language** | i18n support for DE, FR, ES, AR, ZH to capture global analyst audience |

---

## Priority Matrix

```
                    HIGH IMPACT
                        │
     ┌──────────────────┼──────────────────┐
     │  AI Briefing     │  Shadow Browser   │
     │  Custom Alerts   │  User Profiles    │
     │  Data Export     │  Comment Feed     │
LOW ─┼──────────────────┼──────────────────┼─ HIGH
EFFORT│  SEO/Meta Tags  │  Candlestick     │ EFFORT
     │  Skeletons       │  Heatmap Layer   │
     │  Share Cards     │  Timeline View   │
     └──────────────────┼──────────────────┘
                        │
                    LOW IMPACT
```

> **Chef's Recommendation:** Start Week 1 immediately. Mobile responsiveness alone will double your potential audience. The AI Morning Briefing (Week 2) is your viral differentiator — no other free OSINT tool does this.
