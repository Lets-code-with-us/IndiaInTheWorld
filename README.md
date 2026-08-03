# India360 — Policy Intelligence & World Rankings Dashboard

**Live Demo:** https://india360.vercel.app/

**India360** is a comprehensive, 360-degree policy analytics platform consolidating over **60+ global development indicators** and **36 Indian States/UTs development metrics** (NITI Aayog SDG Index, Innovation Index, Health Index, Export Preparedness).

Powered by the **Gemini AI Policy Engine**, India360 provides real-time comparative benchmarking, trend forecasting, state-level performance analysis, and automated executive report card generation.

---

##  Executive Highlights & Core Modules

### 1.  Quick Snapshot Widget (Top 3 Daily Trending Shifts)
An executive summary section positioned directly at the top of the main dashboard highlighting high-velocity ranking movements and urgent policy milestones:
- **Global Innovation Index (GII)**: Rank #39 globally following record tech patent filings and unicorn ecosystem expansion (+42 rank 10-year surge).
- **Oxford AI Readiness Index**: Climbed to Rank #14 driven by the $1.2B IndiaAI Mission compute rollout and DPDP governance frameworks (+10 places shift).
- **Climate Change Performance Index (CCPI)**: Maintained Top 10 global standing with 180GW+ installed non-fossil capacity and national green hydrogen targets.
- **One-Click AI Briefing Trigger**: Launches the AI Policy Assistant with a pre-loaded query for instant executive briefing notes.

### 2.  10 Policy Category Hubs (60+ Global Indicators)
In-depth category dashboards with dedicated visual analytics, benchmark comparisons, and reform drivers:
1. **Economy (13 Benchmarks)**: Nominal GDP ($3.93T, #5), PPP GDP ($14.2T, #3), GDP Growth (6.8%, #1 among major economies), Inflation (4.6%), FDI Inflows ($71B, #8), Competitiveness (#39), Ease of Doing Business (#63).
2. **Environment & Clean Energy**: Environment Performance Index (EPI), Renewable Energy Share (44%), Forest Cover (24.6%), Air Quality Index (AQI), Green Hydrogen Mission milestones.
3. **DigitalGov & GovTech**: World Bank GovTech Maturity Index (Group A Leader), UN E-Government Index (#48), Government AI Readiness (#32), Open Data Inventory (#58).
4. **Technology & Innovation**: Global Innovation Index (#39), Space Economy Scale, Quantum Mission Progress, Tech Unicorn Density.
5. **Governance & Legal Standards**: Worldwide Governance Indicators (WGI), Corruption Perceptions Index (#93), Rule of Law Index (#79), E-Participation Index (#28).
6. **Healthcare & Life Sciences**: Universal Health Coverage Index, Infant Mortality Rate (IMR 27/1000), Life Expectancy (70.8 yrs), Ayushman Bharat Coverage.
7. **Education & Human Capital**: Human Capital Index (#116), Gross Enrollment Ratio (GER Higher Ed 28.4%), Adult Literacy Rate (77.7%), STEM Graduate Ratio.
8. **Safety & Internal Security**: Global Peace Index (#126), Cyber Security Index (#10), Crime Rate Trends, Disaster Resilience Index.
9. **Equality & Inclusion**: Global Gender Gap Index (#129), Financial Inclusion (Jan Dhan Accounts), Multidimensional Poverty Headcount (Reduced by 135M).
10. **Society & Urbanization**: Human Development Index (#134), Urbanization Rate (36%), Clean Drinking Water Access (Jal Jeevan Mission 76%).

### 3. 🏛️ Sub-National State & UT Development Intelligence
Interactive explorer covering all **36 Indian States and Union Territories**:
- Categorized according to NITI Aayog development brackets: **Front Runner**, **Performer**, **Achiever**, and **Aspirant**.
- Tracks state-specific **SDG Scores**, **Innovation Ranks**, **Health Index Scores**, **Export Preparedness**, and **Literacy Rates**.
- Allows side-by-side comparative benchmarking against leading states (e.g., comparing Bihar against Kerala, Karnataka, or Tamil Nadu) to identify actionable reform roadmaps.

### 4.  International Country Benchmark Engine & 3D WebGL Globe
- Multi-country comparison tool allowing side-by-side metric evaluation of India against G20 & BRICS economies (United States, China, Germany, Japan, United Kingdom, Brazil, South Africa, Vietnam).
- Interactive 3D WebGL Globe displaying worldwide metric distribution with interactive hover cards and regional comparison metrics.

### 5.  Gemini AI Policy Assistant & Executive Report Card
- Fully integrated with Next.js server-side API routes (`/api/gemini/chat` and `/api/gemini/insights`).
- Injects full system memory of all 60+ global indicators and 36 state metrics into context.
- Generates data-backed comparative analysis with strict factual accuracy, zero fluff, and cited dataset sources.
- **2026 Executive AI Report Card**: One-click generation of India's consolidated macro report card complete with letter grades (A-F), key strengths, critical reform bottlenecks, and strategic policy recommendations.

### 6. ⌨️ Global Power User Keyboard Navigation (`Cmd+K`, `Cmd+I`, `?`)
- `Ctrl+K` / `Cmd+K`: Global Command Palette for instant fuzzy search across 60+ global indicators, 36 Indian states, categories, and direct action triggers.
- `Ctrl+I` / `Cmd+I`: Opens the Gemini AI Policy Assistant slide-over drawer from anywhere.
- `Ctrl+Shift+R` / `Cmd+Shift+R`: Generates the **2026 Executive AI Report Card**.
- `Ctrl+Shift+W` / `Cmd+Shift+W`: Opens Saved Watchlist & CSV Export Manager.
- `Shift+?` / `?`: Opens Keyboard Shortcuts Reference Guide.
- `Esc`: Instantly closes open modals and slide-over drawers.

### 7.  Saved Watchlist & Custom CSV Export Engine
- Bookmark key indicators across any category to assemble a personalized policy watchlist.
- Export customized watchlists to structured CSV files for offline academic or government policy reporting.

---

##  Cohesive Warm Earth-Tone Design System

India360 strictly adheres to a warm, eye-safe earth-tone palette engineered to eliminate cognitive fatigue during prolonged analytical sessions:

| UI Element | Color Hex | Visual Purpose |
| :--- | :--- | :--- |
| **Canvas Background** | `#FAF6EF` | Soft, warm off-white background |
| **Primary Headers / Modals** | `#3C2F2F` | Deep warm espresso brown for high-contrast headlines |
| **Secondary Containers** | `#4A3E3D` | Warm cocoa brown for structured content cards |
| **Borders & Dividers** | `#52433A` / `#DCC7AA` | Muted sand and soft tan borders |
| **Primary Action Accent** | `#F7882F` | Terracotta amber for primary buttons and callouts |
| **Secondary Highlight** | `#F7C331` | Golden sand for status badges and metrics |
| **Typography & Labels** | `#7C6C62` / `#2C221E` | Earthy taupe and roasted coffee body text |

*No generic cold blues, neon pinks, or pure black (#000) surfaces are used anywhere in the application.*

---

##  Technical Stack & Architecture

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict Type Safety)
- **Styling & Motion**: Tailwind CSS v4, Framer Motion
- **Visualizations**: Recharts, Three.js / React Three Fiber (3D WebGL Globe)
- **AI Integration**: `@google/genai` TypeScript SDK (`gemini-2.5-flash`)
- **Icons**: Lucide React
- **Data Architecture**: Immutable static dataset registries in `lib/data/` (Indicators, States, Categories)

---

##  Getting Started

### Prerequisites
- Node.js: v18.0.0 or higher
- npm / pnpm / yarn
- Gemini API Key: Set in `.env.local`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/india360.git
cd india360
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
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

##  Primary Data Sources & Citations

All indicators and metrics presented in India360 are sourced from official multilateral publications:

1. **IMF**: [World Economic Outlook & Data Mapper](https://www.imf.org/en/Publications/WEO)
2. **World Bank**: [World Development Indicators & LPI](https://databank.worldbank.org/)
3. **WIPO**: [Global Innovation Index Portal](https://www.wipo.int/global_innovation_index/en/)
4. **UNDP**: [Human Development Reports](https://hdr.undp.org/)
5. **NITI Aayog**: [SDG India Index & State Dashboard](https://www.niti.gov.in/sdg-india-index)
6. **World Economic Forum**: [Global Gender Gap & Competitiveness Reports](https://www.weforum.org/)
7. **Reporters Without Borders**: [Press Freedom Index](https://rsf.org/en/index)
8. **Transparency International**: [Corruption Perceptions Index](https://www.transparency.org/en/cpi)
9. **Germanwatch**: [Climate Change Performance Index (CCPI)](https://ccpi.org/)
10. **Oxford Insights**: [Government AI Readiness Index](https://oxfordinsights.com/ai-readiness/ai-readiness-index/)

---

##  License

MIT License — Created for open data research, educational analysis, and public policy intelligence.

---

## 👨‍💻 Author

**Created and maintained by Vivek Kumar**

- **Portfolio:** [vivekducs.is-a.dev](https://vivekducs.is-a.dev/)
- **GitHub:** [github.com/vivekducs](https://github.com/vivekducs)
