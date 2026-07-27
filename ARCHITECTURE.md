# Architecture & Implementation Documentation

This document provides a technical breakdown of the architecture, data models, state flows, and AI integration powering the **India360 — Policy Intelligence & World Rankings Dashboard**.

---

## System Architecture Overview

```
 ┌──────────────────────────────────────────────────────────────────┐
 │                        CLIENT SIDE (React 18)                    │
 ├──────────────────────────────────────────────────────────────────┤
 │                                                                  │
 │   Navbar  ─────────►  Global Category Bar  ───► Watchlist Modal  │
 │     │                                       ───► Command Palette │
 │     │                                       ───► Shortcuts Help  │
 │     │                                                            │
 │     ├──────────────►  IndiaDashboard (F-Pattern Layout)          │
 │     ├──────────────►  EconomyDashboard (13 Economic Benchmarks)  │
 │     ├──────────────►  DigitalGovDashboard (GovTech & AI Readiness)│
 │     ├──────────────►  StateExplorer (36 Indian States/UTs)      │
 │     ├──────────────►  CategoryExplorer (Indicator Deep Dives)    │
 │     ├──────────────►  CountryComparison (India vs G20/BRICS)    │
 │     ├──────────────►  InteractiveWorldMap (3D Globe & Heatmap)   │
 │     ├──────────────►  TrendAnalysis (10-Yr Historical Trajectory)│
 │     └──────────────►  AiAssistantDrawer (Interactive Chat)      │
 └──────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP POST /api/gemini/chat
                                  ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │                      SERVER SIDE (Next.js 15)                    │
 ├──────────────────────────────────────────────────────────────────┤
 │   app/api/gemini/chat/route.ts                                   │
 │   ├── Injects static datasets (GLOBAL_INDICATORS, STATES_DATA)   │
 │   ├── Formats policy system instructions                         │
 │   └── Calls GoogleGenAI SDK (`gemini-2.5-flash`)                 │
 └──────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
├── app/
│   ├── api/
│   │   └── gemini/
│   │       ├── chat/
│   │       │   └── route.ts         # Server-side AI Chat API Route
│   │       └── insights/
│   │           └── route.ts         # Server-side AI Report Card & Insights API Route
│   ├── globals.css                   # Global styles & Tailwind CSS imports
│   ├── layout.tsx                    # Root layout with metadata
│   └── page.tsx                      # Main App Shell, Keyboard Listener & Deep Linking
├── components/
│   ├── Navbar.tsx                    # Top navigation, Command Palette & Shortcuts Trigger
│   ├── CommandPaletteModal.tsx       # Ctrl+K Global Search & Quick Action Launcher
│   ├── KeyboardShortcutsModal.tsx    # Power User Keyboard Reference Guide (?)
│   ├── IndiaDashboard.tsx            # F-Pattern Executive Dashboard
│   ├── EconomyDashboard.tsx          # 13-Metric Economic Command Center
│   ├── DigitalGovDashboard.tsx       # GovTech, EGDI & AI Readiness Hub
│   ├── StateExplorer.tsx             # 36 Indian States/UTs Development Grid
│   ├── CategoryExplorer.tsx          # Indicator drill-down & category filtering
│   ├── CountryComparison.tsx         # Multi-country comparison matrix
│   ├── InteractiveWorldMap.tsx       # 3D Globe & World map distribution
│   ├── ThreeDChart.tsx               # WebGL 3D Visualization Canvas
│   ├── TrendAnalysis.tsx             # 10-year historical trajectory analysis
│   ├── IndicatorDetailModal.tsx      # Indicator modal with Share Insight suite
│   ├── AiAssistantDrawer.tsx         # Slide-over AI Assistant interface
│   ├── AiReportCardModal.tsx         # Modal for AI-generated annual reports
│   └── WatchlistExportModal.tsx      # Saved indicator manager & CSV export
└── lib/
    ├── types.ts                      # Core TypeScript interfaces
    └── data/
        ├── indicators.ts             # 60+ global metrics dataset
        ├── categories.ts             # Policy category definitions
        ├── states.ts                 # 36 Indian States & UTs dataset
        └── countries.ts              # Comparative G20/BRICS country metrics
```

---

## Keyboard Shortcuts System (`app/page.tsx`)

The application listens for key combinations at the root window level while respecting input field focus:

| Shortcut | Action | Component Handler |
| :--- | :--- | :--- |
| `Ctrl+K` / `Cmd+K` | Toggle Global Command Palette | `CommandPaletteModal.tsx` |
| `Ctrl+I` / `Cmd+I` | Toggle Gemini AI Policy Assistant | `AiAssistantDrawer.tsx` |
| `Ctrl+Shift+R` / `Cmd+Shift+R` | Generate AI Annual Report Card | `AiReportCardModal.tsx` |
| `Ctrl+Shift+W` / `Cmd+Shift+W` | Open Saved Watchlist & CSV Export | `WatchlistExportModal.tsx` |
| `?` (Shift + `/`) | Open Keyboard Shortcuts Reference | `KeyboardShortcutsModal.tsx` |
| `Esc` | Close Any Active Modal / Drawer | All Modals |

---

## Deep Linking & Share Insight Architecture

1. **URL Parameter Deep Linking**:
   - On page load (`app/page.tsx`), `useEffect` parses `window.location.search` for `?indicator={id}` and `?tab={tabName}`.
   - Automatically opens the `IndicatorDetailModal` for matching indicator IDs.

2. **Share Insight Suite (`IndicatorDetailModal.tsx`)**:
   - **Copy Shareable Link**: Generates direct link `https://domain/?indicator={id}`.
   - **Copy Performance Brief**: Formats a clean, structured text summary including rank, current score, 10-year change, primary strengths, key gaps, source attribution, confidence score, and verified link.
   - **Toast Feedback**: Visual confirmation toast notification.

---

## Core Data Schemas

### 1. Global Indicator Schema (`lib/types.ts`)
```typescript
export interface GlobalIndicator {
  id: string;
  name: string;
  category: CategoryType;
  latestIndiaRank: number;
  latestIndiaValue: string;
  previousIndiaRank: number;
  totalCountriesRanked: number;
  trend: 'improving' | 'declining' | 'stable';
  year: number;
  source: {
    organization: string;
    datasetName: string;
    url: string;
    lastUpdatedYear: number;
    frequency: string;
    confidenceScore: number;
  };
  historicalData: { year: number; india: number; usa?: number; china?: number; germany?: number; japan?: number; vietnam?: number; brazil?: number }[];
  countryComparison: { code: string; name: string; rank: number; value: number; formattedValue: string }[];
  whyItMatters: string;
  keyDriversAndPolicies: string[];
  strengthsAndGaps: {
    strengths: string[];
    gaps: string[];
  };
  recentNews?: {
    title: string;
    source: string;
    date: string;
    summary: string;
  };
  isCritical?: boolean;
  isFluctuating?: boolean;
}
```

### 2. Indian State Data Schema (`lib/types.ts`)
```typescript
export interface StateData {
  id: string;
  stateName: string;
  code: string;
  category: 'Front Runner' | 'Performer' | 'Aspirant' | 'Achiever';
  sdgScore: number;            // NITI Aayog SDG Score (0-100)
  innovationScore: number;     // NITI Aayog Innovation Index
  healthIndexScore: number;    // NITI Aayog Health Index
  exportPreparednessRank: number;
  literacyRate: number;
}
```

---

## AI Assistant Integration & Data Context Injection

To ensure the AI produces precise, factual answers grounded in official statistics rather than generic summaries:

1. **System Prompt Injection**:
   The `/app/api/gemini/chat/route.ts` API endpoint formats and embeds `GLOBAL_INDICATORS` and `INDIAN_STATES_DATA` directly into the system instructions before calling the `@google/genai` model.

2. **Grounded Query Resolution**:
   When a user submits queries such as "Analyze Bihar state development indicators", the Gemini model receives:
   - Bihar's exact SDG Score (`52`, Aspirant category)
   - Innovation Index Score (`12.1`)
   - Health Index Score (`31.0` / 100)
   - Export Preparedness Rank (`#21`)
   - Literacy Rate (`61.8%`)
   - Direct comparison against top-performing states (e.g., Kerala's SDG 75 & 96.2% Literacy, Karnataka's Innovation Score 62.5, Tamil Nadu's #1 Export Preparedness Rank).

3. **Comparative Response Generation**:
   The response formats the data with clean Markdown headers, bold metrics, comparison points against leading states, and 3-5 concrete policy recommendations. No emojis are used.

---

## Color System & WCAG AA Compliance

To maintain visual harmony without harsh contrasts or prohibited cold blues, the color system strictly uses warm earth tones:

| Tone Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| Warm Off-White | `#FAF6EF` | Canvas & Card Backgrounds |
| Warm Espresso | `#3C2F2F` | Primary Navigation & Header Bars |
| Warm Cocoa | `#4A3E3D` | Card Containers & Active Tabs |
| Terracotta Amber | `#F7882F` | Primary Action Buttons & Accents |
| Golden Sand | `#F7C331` | Highlight Badges & AI Tags |
| Soft Sand Border | `#52433A` / `#DCC7AA` | Dividers & Borders |
| Earth Taupe Text | `#7C6C62` / `#2C221E` | Body Copy & Label Hierarchy |

