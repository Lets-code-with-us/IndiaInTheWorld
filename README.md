# India Global Index — Policy Intelligence & World Rankings Dashboard

A high-performance policy analytics platform that consolidates 60+ global development indicators and 36 Indian States/UTs development metrics (NITI Aayog SDG Index, Innovation Index, Health Index, Export Preparedness).

Powered by the Gemini AI Engine for real-time contextual policy insights, comparative benchmarking, and automated annual performance report generation.

---

## Design & Aesthetic System

The platform strictly adheres to a warm neutral palette engineered for maximum legibility and reduced cognitive strain during policy analysis:

- Canvas Background: Warm Off-White (`#FAF6EF`)
- Primary Hero & Modal Headers: Deep Warm Espresso Brown (`#3C2F2F`)
- Secondary Card Containers: Warm Cocoa (`#4A3E3D`) with Soft Sand Borders (`#52433A` / `#DCC7AA`)
- Primary Action Accent: Terracotta Amber (`#F7882F`)
- Secondary Highlight Accent: Golden Sand (`#F7C331`)
- Typography & Labels: Roasted Earth Taupe (`#7C6C62` / `#2C221E`)
- Note: No cold blues, purples, or pure black surfaces are used anywhere in the application.

---

## Key Features & Capabilities

### 1. Global Keyboard Shortcut Navigation (`Ctrl+K`, `Ctrl+I`, `?`)
Built for power users, analysts, and researchers needing rapid keyboard-driven navigation:
- `Ctrl+K` / `Cmd+K`: Opens the **Global Command Palette** for instant fuzzy search across 60+ global indicators, 36 Indian states, categories, and direct action triggers.
- `Ctrl+I` / `Cmd+I`: Opens the **Gemini AI Policy Assistant** slide-over drawer from anywhere.
- `Ctrl+Shift+R` / `Cmd+Shift+R`: Generates the **2026 Executive AI Report Card**.
- `Ctrl+Shift+W` / `Cmd+Shift+W`: Opens the **Saved Watchlist & CSV Export Manager**.
- `Shift+?` / `?`: Opens the **Keyboard Shortcuts Reference Guide**.
- `Esc`: Instantly closes open modals and slide-over drawers.

### 2. Dynamic Shareable Link & Formatted Insight Summaries
Every indicator deep dive includes a **Share Insight** suite:
- **Copy Shareable Link**: Generates deep-linked URL parameters (`?indicator=gdp-rank`) for direct access to specific metrics.
- **Copy Performance Summary Brief**: Formats a clean, structured text summary suitable for policy notes, briefings, or social sharing (includes rank, score, 10-year trajectory, drivers, bottlenecks, publisher source, and confidence score).
- **Toast Notifications**: Interactive visual feedback confirming clipboard operations.

### 3. Digital Government & GovTech Category Hub
Dedicated command center tracking India's digital transformation across public administration:
- **World Bank GovTech Maturity Index (GTMI)**: Group A High Maturity leader.
- **UN E-Government Development Index (EGDI)**: Rank #48 / 193.
- **Government AI Readiness Index (Oxford Insights)**: Rank #32 / 193.
- **Open Data Inventory (ODIN)**: Rank #58 / 195.
- **E-Participation Index (EPI)**: Rank #28 / 193.

### 4. Dedicated Economy Category Command Center
Comprehensive Category Dashboard dedicated to the 13 core economic and trade benchmarks:
1. **GDP Rank (Nominal)**: #5 ($3.93 Trillion) - [IMF World Economic Outlook](https://www.imf.org/en/Publications/WEO)
2. **GDP (PPP) Rank**: #3 ($14.2 Trillion) - [World Bank International Comparison Program](https://www.worldbank.org/en/programs/icp)
3. **GDP per Capita Rank**: #138 ($2,730) - [IMF Data Mapper](https://www.imf.org/external/datamapper/NGDPDPC@WEO/OEMDC/ADVEC/WEOWORLD)
4. **GDP Growth Rate**: 6.8% (#1 among major $1T+ economies) - [World Bank Data](https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG)
5. **Inflation Rate (CPI)**: 4.6% - [Reserve Bank of India Monetary Policy Portal](https://www.rbi.org.in/)
6. **Unemployment Rate (PLFS)**: 3.2% - [Ministry of Statistics & Programme Implementation (MoSPI)](https://mospi.gov.in/)
7. **Public Debt to GDP Ratio**: 81.5% - [IMF Fiscal Monitor](https://www.imf.org/en/Publications/FM)
8. **Ease of Doing Business (Historical)**: Rank #63 - [World Bank Doing Business Archive](https://archive.doingbusiness.org/)
9. **Global Competitiveness Index**: Rank #39 - [World Economic Forum Competitiveness Platform](https://www.weforum.org/)
10. **Global Innovation Index**: Rank #39 - [WIPO Global Innovation Index Portal](https://www.wipo.int/global_innovation_index/en/)
11. **Index of Economic Freedom**: Rank #121 - [Heritage Foundation Index](https://www.heritage.org/index/)
12. **Logistics Performance Index**: Rank #38 - [World Bank LPI Database](https://lpi.worldbank.org/)
13. **Foreign Direct Investment Inflows**: #8 ($71 Billion/year) - [UNCTAD World Investment Report](https://unctad.org/topic/investment/world-investment-report)

### 5. F-Pattern Executive Layout Hierarchy
- Top-Left Anchors: Key macro financial metrics (Nominal GDP $3.93T #5, PPP GDP $14.2T #3, Global Innovation Index #39, Population Scale 1.43B) positioned at top-left for immediate scanning.
- Top Benchmark Cards: KPI cards with data point spike callouts, contextual definitions, pulse indicators, and publisher citations.
- Middle Grid: Policy category indices (Economy, Technology, Governance, Healthcare, Education, Environment, Safety, DigitalGov, Equality, Society).
- Deep-Dive Bottom: Top 5 global strengths vs top 5 critical reform bottlenecks, along with a 10-year national policy reform timeline.

### 6. Gemini AI Assistant with Direct Dataset Memory
- Fully integrated with the backend (`/api/gemini/chat` and `/api/gemini/insights`).
- Enforces strict factual responses with no emojis, citing specific dataset URLs.
- Passes full system memory of all global indicators and 36 Indian states/UTs metrics (NITI Aayog SDG Score, Innovation Score, Health Index, Export Rank, Literacy Rate).
- Generates data-backed comparative analysis for queries like "Analyze Bihar state development indicators", comparing Bihar directly against leaders like Kerala, Karnataka, and Tamil Nadu with actionable reform steps.

### 7. State & UT Development Intelligence Explorer
- Comprehensive dataset for all 36 Indian States and Union Territories.
- Filterable by NITI Aayog development categories (Front Runner, Performer, Aspirant, Achiever).
- Interactive comparative view matching state performance against national benchmarks.

### 8. Interactive Country Benchmark Engine & 3D WebGL Globe
- Multi-country comparison tool allowing side-by-side evaluation of India against G20 & BRICS economies (United States, China, Germany, Japan, United Kingdom, Brazil, South Africa, Vietnam).
- Interactive 3D WebGL Globe visualizing worldwide development metric distribution.

### 9. Annual AI Report Card Generator & Watchlist Manager
- One-click synthesis of India's annual performance across all macro dimensions.
- Bookmark any indicator across categories to compile a custom watchlist.
- Export formatted CSV reports for offline policy research.

---

## Technology Stack

- Framework: Next.js 15+ (App Router)
- UI & Layout: React 18, TypeScript, Tailwind CSS, Framer Motion
- Visualizations: Recharts, Three.js 3D WebGL Canvas
- AI Integration: `@google/genai` TypeScript SDK (`gemini-2.5-flash`)
- Icons: Lucide React
- Data Serialization: Static Type-Safe Datasets (`lib/data/`)

---

## Quick Start & Setup Instructions

### Prerequisites
- Node.js: v18.0.0 or higher
- npm / yarn / pnpm
- Gemini API Key: Set in `.env.local`

### 1. Clone & Install
```bash
git clone https://github.com/your-org/india-global-index.git
cd india-global-index
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## Primary Data Sources & Official Citations

All facts and metrics presented in the dashboard and AI assistant are directly backed by official publications:

1. [International Monetary Fund (IMF) — World Economic Outlook](https://www.imf.org/en/Publications/WEO)
2. [World Bank — World Development Indicators & GovTech Index](https://databank.worldbank.org/source/world-development-indicators)
3. [World Intellectual Property Organization (WIPO) — Global Innovation Index](https://www.wipo.int/global_innovation_index/en/)
4. [United Nations Development Programme (UNDP) — Human Development Index](https://hdr.undp.org/)
5. [NITI Aayog — SDG India Index & Reports Portal](https://www.niti.gov.in/sdg-india-index)
6. [World Economic Forum (WEF) — Global Gender Gap Report](https://www.weforum.org/reports/global-gender-gap-report-2024/)
7. [Reporters Without Borders (RSF) — Press Freedom Index](https://rsf.org/en/index)
8. [Transparency International — Corruption Perceptions Index](https://www.transparency.org/en/cpi)
9. [Germanwatch — Climate Change Performance Index](https://ccpi.org/)
10. [Oxford Insights — Government AI Readiness Index](https://oxfordinsights.com/ai-readiness/ai-readiness-index/)

---

## License

MIT License — free for educational, research, and public policy analysis use.

