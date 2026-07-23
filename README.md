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

## Key Features

### 1. F-Pattern Executive Layout Hierarchy
- Top-Left Anchors: Key macro financial metrics (Nominal GDP $3.93T #5, PPP GDP $14.2T #3, Global Innovation Index #39, Population Scale 1.43B) positioned at top-left for immediate scanning.
- Top Benchmark Cards: KPI cards with data point spike callouts, contextual definitions, and publisher citations.
- Middle Grid: 10 public policy category indices (Economy, Technology, Governance, Healthcare, Education, Environment, Safety, DigitalGov, Equality, Society).
- Deep-Dive Bottom: Top 5 global strengths vs top 5 critical reform bottlenecks, along with a 10-year national policy reform timeline.

### 2. Gemini AI Assistant with Direct Dataset Memory
- Fully integrated with the backend (`/api/gemini/chat`).
- Passes full system memory of all 60+ global indicators and 36 Indian states/UTs metrics (NITI Aayog SDG Score, Innovation Score, Health Index, Export Rank, Literacy Rate).
- Generates data-backed comparative analysis for queries like "Analyze Bihar state development indicators", comparing Bihar directly against leaders like Kerala, Karnataka, and Tamil Nadu with actionable reform steps.

### 3. State & UT Development Intelligence Explorer
- Comprehensive dataset for all 36 Indian States and Union Territories.
- Filterable by NITI Aayog development categories (Front Runner, Performer, Aspirant).
- Interactive comparative view matching state performance against national benchmarks.

### 4. Interactive Country Benchmark Engine
- Multi-country comparison tool allowing side-by-side evaluation of India against G20 & BRICS economies (United States, China, Germany, Japan, United Kingdom, Brazil, South Africa, Vietnam).

### 5. Annual AI Report Card Generator
- One-click synthesis of India's annual performance across all macro dimensions.
- Supports instant text copying and print-formatted layout.

### 6. CSV Watchlist Exporter
- Bookmark any indicator across categories to compile a custom watchlist.
- Export formatted CSV reports for offline policy research.

---

## Technology Stack

- Framework: Next.js 15+ (App Router)
- UI & Layout: React 18, TypeScript, Tailwind CSS
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
