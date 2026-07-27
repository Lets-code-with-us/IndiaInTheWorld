'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Globe,
  Users,
  Landmark,
  Cpu,
  GraduationCap,
  Activity,
  Leaf,
  Shield,
  Scale,
  Zap,
  CheckCircle2,
  BookOpen,
  Info,
  HelpCircle,
} from 'lucide-react';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { CATEGORIES } from '../lib/data/categories';
import { Indicator, CategoryType } from '../lib/types';

interface IndiaDashboardProps {
  onSelectCategory: (category: CategoryType) => void;
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onOpenReportCard: () => void;
}

const CATEGORY_ICONS: Record<CategoryType, React.ComponentType<{ className?: string }>> = {
  Economy: TrendingUp,
  Society: Users,
  Governance: Landmark,
  Technology: Cpu,
  Education: GraduationCap,
  Healthcare: Activity,
  Environment: Leaf,
  Safety: Shield,
  Equality: Scale,
  DigitalGov: Globe,
};

export const IndiaDashboard: React.FC<IndiaDashboardProps> = ({
  onSelectCategory,
  onSelectIndicator,
  onOpenAiAssistant,
  onOpenReportCard,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Key Hero Indicators
  const gdpInd = GLOBAL_INDICATORS.find((i) => i.id === 'gdp-rank');
  const giiInd = GLOBAL_INDICATORS.find((i) => i.id === 'global-innovation-index');
  const ccpiInd = GLOBAL_INDICATORS.find((i) => i.id === 'climate-change-performance-index');
  const cyberInd = GLOBAL_INDICATORS.find((i) => i.id === 'global-cybersecurity-index');
  const aiInd = GLOBAL_INDICATORS.find((i) => i.id === 'ai-readiness-index');
  const govTechInd = GLOBAL_INDICATORS.find((i) => i.id === 'govtech-maturity-index');

  const topStrengths = GLOBAL_INDICATORS.filter((i) => i.latestIndiaRank <= 15).slice(0, 5);
  const criticalGaps = GLOBAL_INDICATORS.filter((i) => i.latestIndiaRank >= 100).slice(0, 5);

  const policyMilestones = [
    { year: 2015, title: 'Digital India & Jan Dhan Launch', impact: 'Built foundation for 1.4B digital biometric identities & 500M bank accounts', spike: 'Propelled FinTech & Digital Inclusion (#15 GovTech)' },
    { year: 2016, title: 'Unified Payments Interface (UPI)', impact: 'Revolutionized digital payments (>13B monthly transactions)', spike: 'Rank #1 globally in real-time digital payment volume' },
    { year: 2018, title: 'Ayushman Bharat PM-JAY', impact: 'World largest free health cover for 500M low-income citizens', spike: 'Expanded tertiary care access across 28 states' },
    { year: 2020, title: 'National Education Policy (NEP) & PLI', impact: 'Multi-disciplinary education reform & $26B manufacturing incentives', spike: 'Boosted electronics export velocity from $8B to $29B' },
    { year: 2024, title: 'IndiaAI Mission & DPDP Act Enforcement', impact: '$1.2B allocation for compute infrastructure & data protection', spike: 'Gained 10 places in Oxford AI Readiness Index (#14)' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 
        ========================================================================
        1. TOP LEVEL (F-PATTERN READING: Top-Left Anchor)
        - Key Metrics & Executive Overview at Top
        - Annotations, definitions, and source citations embedded
        ========================================================================
      */}
      <section className="bg-gradient-to-br from-[#3C2F2F] via-[#4A3E3D] to-[#3C2F2F] rounded-2xl p-5 sm:p-8 text-neutral-100 border border-[#52433A] shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#F7882F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#F7C331]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Top-Left Main F-Pattern Focus */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7882F]/20 text-[#F7C331] border border-[#F7882F]/30 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-[#F7882F]" />
              <span>India Global Footprint & Policy Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              India360 Global Index Standings
            </h1>

            <p className="text-[#E8D9C8] text-xs sm:text-sm leading-relaxed">
              Consolidating real-time comparative metrics from the United Nations, World Bank, IMF, WHO, WIPO, WEF, and NITI Aayog into a single context-rich dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenReportCard}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F7882F] hover:bg-[#D46917] text-white text-xs font-semibold shadow-md transition-all border border-[#F7C331]/30 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-white" />
                <span>Generate AI Annual Report Card</span>
              </button>

              <button
                onClick={() => onOpenAiAssistant('Provide a summary of India’s top 5 strengths and weaknesses.')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#52433A] hover:bg-[#635248] text-neutral-100 text-xs font-medium border border-[#635248] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F7C331]" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>

          {/* Key Macro Financial Metrics with Callout Annotations */}
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#4A3E3D] border border-[#52433A] rounded-xl p-4">
            <div className="space-y-1 p-2 bg-[#3C2F2F] rounded-lg border border-[#52433A]">
              <div className="flex items-center justify-between text-[11px] text-[#C4B2A5] font-medium">
                <span>Nominal GDP</span>
                <span className="text-[9px] bg-[#F7882F]/20 text-[#F7C331] px-1.5 py-0.5 rounded font-bold">IMF 2026</span>
              </div>
              <div className="text-xl font-bold text-[#F7882F]">$3.93 Trillion</div>
              <div className="text-[10px] text-[#E8D9C8] flex items-center gap-1">
                <span>Rank #5 globally</span>
                <span className="text-emerald-400 font-bold">(+1 place vs UK)</span>
              </div>
            </div>

            <div className="space-y-1 p-2 bg-[#3C2F2F] rounded-lg border border-[#52433A]">
              <div className="flex items-center justify-between text-[11px] text-[#C4B2A5] font-medium">
                <span>PPP Adjusted GDP</span>
                <span className="text-[9px] bg-[#F7882F]/20 text-[#F7C331] px-1.5 py-0.5 rounded font-bold">World Bank</span>
              </div>
              <div className="text-xl font-bold text-[#F7C331]">$14.2 Trillion</div>
              <div className="text-[10px] text-[#E8D9C8] flex items-center gap-1">
                <span>Rank #3 globally</span>
                <span className="text-emerald-400 font-bold">(Behind US & China)</span>
              </div>
            </div>

            <div className="space-y-1 p-2 bg-[#3C2F2F] rounded-lg border border-[#52433A]">
              <div className="flex items-center justify-between text-[11px] text-[#C4B2A5] font-medium">
                <span>Global Innovation (GII)</span>
                <span className="text-[9px] bg-[#F7882F]/20 text-[#F7C331] px-1.5 py-0.5 rounded font-bold">WIPO</span>
              </div>
              <div className="text-xl font-bold text-[#F7882F]">Rank #39</div>
              <div className="text-[10px] text-[#E8D9C8]">
                <span className="text-emerald-400 font-bold">+42 places</span> surge over 10 yrs
              </div>
            </div>

            <div className="space-y-1 p-2 bg-[#3C2F2F] rounded-lg border border-[#52433A]">
              <div className="flex items-center justify-between text-[11px] text-[#C4B2A5] font-medium">
                <span>Population Scale</span>
                <span className="text-[9px] bg-[#F7882F]/20 text-[#F7C331] px-1.5 py-0.5 rounded font-bold">UN Population</span>
              </div>
              <div className="text-xl font-bold text-[#E8D9C8]">1.43 Billion</div>
              <div className="text-[10px] text-[#C4B2A5]">17.7% of global population</div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        1.5 QUICK SNAPSHOT WIDGET (Top 3 Trending Indicator Shifts & Policy Updates)
        - Uses cohesive warm earth-tone palette (#3C2F2F, #F7882F, #F7C331, #DCC7AA, #FFF2E8)
        - Clean typographic hierarchy, WCAG AA contrast, no emojis
        ========================================================================
      */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCC7AA]/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF2E8] text-[#F7882F] border border-[#F7882F]/30 shadow-sm">
              <Zap className="w-5 h-5 text-[#F7882F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                  Quick Snapshot — Today&apos;s Top 3 Policy & Indicator Shifts
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  Verified Updates
                </span>
              </div>
              <p className="text-xs text-[#6B7A8F]">
                Curated briefing of high-velocity ranking shifts and major policy enforcement milestones
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAiAssistant('Provide an executive summary of today’s top 3 policy shifts and ranking indicators for India.')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EF] hover:bg-[#FFF2E8] text-[#D46917] text-xs font-bold border border-[#DCC7AA] transition-all hover:border-[#F7882F] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F7882F]" />
            <span>AI Executive Briefing</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'global-innovation-index',
              title: 'Global Innovation Index (GII)',
              tag: 'Tech & Patent Surge',
              badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              rank: '#39',
              change: '+42 Ranks (10-Yr Surge)',
              source: 'WIPO 2026',
              summary: 'India achieved Rank #39 globally following record tech patent filings and unicorn ecosystem expansion.',
              actionText: 'View Innovation Profile',
            },
            {
              id: 'ai-readiness-index',
              title: 'Oxford AI Readiness Index',
              tag: 'Compute & Policy Milestone',
              badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
              rank: '#14',
              change: '+10 Places Shift',
              source: 'Oxford Insights 2026',
              summary: 'Climbed 10 positions driven by the $1.2B IndiaAI Mission compute rollout and DPDP governance frameworks.',
              actionText: 'Analyze AI Metrics',
            },
            {
              id: 'climate-change-performance-index',
              title: 'Climate Change Performance (CCPI)',
              tag: 'Clean Energy Benchmark',
              badgeColor: 'bg-teal-50 text-teal-900 border-teal-200',
              rank: '#10',
              change: 'Top 10 Global Leader',
              source: 'Germanwatch 2026',
              summary: 'Maintained top-10 global standing with 180GW+ installed non-fossil capacity and national green hydrogen targets.',
              actionText: 'Explore CCPI Profile',
            },
          ].map((item, idx) => {
            const matchedInd = GLOBAL_INDICATORS.find((i) => i.id === item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                onClick={() => matchedInd && onSelectIndicator(matchedInd)}
                className="bg-[#FAF6EF] hover:bg-white rounded-xl p-4 border border-[#DCC7AA] hover:border-[#F7882F] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-bold text-[#6B7A8F]">
                      {item.source}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-neutral-900 group-hover:text-[#F7882F] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#F7882F]">{item.rank}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {item.change}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B7A8F] leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#DCC7AA]/60 flex items-center justify-between text-xs font-bold text-[#D46917] group-hover:text-[#F7882F]">
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        2. KEY BENCHMARK METRICS (TOP ROW)
        - Interactive KPI cards with contextual definitions & annotations
        ========================================================================
      */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCC7AA]/60 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F7882F]" />
            <span>Key Benchmark Indicators with Annotations</span>
          </h2>
          <span className="text-xs text-[#6B7A8F]">Contextual Callouts & Source Citations Included</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { ind: gdpInd, annotation: 'Spike: Fast nominal growth ($3.93T)', definition: 'Gross Domestic Product in US dollars.' },
            { ind: giiInd, annotation: 'Spike: +42 ranks since 2015', definition: 'WIPO index measuring tech outputs & IP filings.' },
            { ind: ccpiInd, annotation: 'Top 10 Global Climate Performer', definition: 'Germanwatch metric on renewable energy & emissions.' },
            { ind: cyberInd, annotation: 'Tier 1 Global Role Model', definition: 'ITU assessment of cybersecurity legal & tech measures.' },
            { ind: aiInd, annotation: 'Top 15 AI Readiness', definition: 'Oxford Insights index measuring AI talent & compute.' },
            { ind: govTechInd, annotation: 'Group A High Maturity', definition: 'World Bank index evaluating public digital systems.' },
          ].map(({ ind, annotation, definition }) => {
            if (!ind) return null;
            const isPulse = ind.isCritical || ind.isFluctuating || ind.id === 'gdp-rank' || ind.id === 'global-innovation-index';
            return (
              <motion.div
                key={ind.id}
                layoutId={`indicator-card-${ind.id}`}
                whileHover={{ scale: 1.02, y: -3 }}
                onClick={() => onSelectIndicator(ind)}
                className="relative bg-white rounded-xl p-4 border border-[#DCC7AA] shadow-sm hover:shadow-md hover:border-[#F7882F] cursor-pointer transition-all flex flex-col justify-between group min-h-[160px]"
              >
                {isPulse && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 border border-white"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{ind.isFluctuating ? '⚡ Shift' : '🔥 Priority'}</span>
                  </motion.div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-[#6B7A8F] uppercase tracking-wider">
                    <span className="truncate">{ind.category}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFF2E8] text-[#D46917] border border-[#F7882F]/30">
                      {ind.trend}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-neutral-800 mt-2 group-hover:text-[#F7882F] transition-colors line-clamp-1">
                    {ind.name}
                  </h3>

                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-neutral-900">
                      #{ind.latestIndiaRank}
                    </span>
                    <span className="text-xs font-semibold text-[#6B7A8F]">
                      {ind.latestIndiaValue}
                    </span>
                  </div>

                  {/* Context Callout Annotation */}
                  <div className="mt-2 text-[10px] font-semibold text-[#D46917] bg-[#FFF2E8] px-2 py-1 rounded border border-[#F7882F]/20 flex items-center gap-1">
                    <Info className="w-3 h-3 shrink-0 text-[#F7882F]" />
                    <span>{annotation}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#DCC7AA]/60 flex items-center justify-between text-[10px] text-[#6B7A8F]">
                  <span className="truncate max-w-[110px]" title={`Source: ${ind.source.organization}`}>
                    {ind.source.organization}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#F7882F] transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        3. MIDDLE SECTION (SUPPORTING CHARTS & CATEGORY SNAPSHOTS)
        - 10 Category overview cards
        ========================================================================
      */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCC7AA]/60 pb-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">10 Policy Category Indices</h2>
            <p className="text-xs text-[#6B7A8F]">Comprehensive scores and benchmark metrics across all key public policy domains</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const Icon = CATEGORY_ICONS[catKey] || Globe;

            return (
              <motion.div
                key={catKey}
                layoutId={`category-card-${catKey}`}
                onClick={() => onSelectCategory(catKey)}
                whileHover={{ scale: 1.02, y: -3 }}
                className="bg-white rounded-xl p-4 border border-[#DCC7AA] hover:border-[#F7882F] shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group min-h-[170px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <motion.div
                      layoutId={`category-icon-${catKey}`}
                      className="p-2 rounded-lg bg-[#FFF2E8] text-[#F7882F] border border-[#F7882F]/20 group-hover:bg-[#F7882F] group-hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <motion.span
                      layoutId={`category-badge-${catKey}`}
                      className="text-[10px] font-bold text-[#6B7A8F] bg-[#FAF6EF] border border-[#DCC7AA] px-2 py-0.5 rounded-full"
                    >
                      Avg Rank #{cat.averageRank}
                    </motion.span>
                  </div>

                  <div className="mt-2">
                    <motion.h3
                      layoutId={`category-title-${catKey}`}
                      className="text-xs font-bold text-neutral-800 group-hover:text-[#F7882F] transition-colors"
                    >
                      {cat.title}
                    </motion.h3>
                    <p className="text-[11px] text-[#6B7A8F] mt-0.5 line-clamp-2">{cat.description}</p>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] border-t border-[#DCC7AA]/60 pt-2 text-neutral-600">
                  <div className="flex justify-between">
                    <span className="text-[#6B7A8F]">Top Area:</span>
                    <span className="font-semibold text-[#F7882F] truncate max-w-[110px]">{cat.topIndicator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7A8F]">Focus Area:</span>
                    <span className="font-semibold text-amber-800 truncate max-w-[110px]">{cat.weakestIndicator}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium text-[#F7882F] group-hover:translate-x-1 transition-transform">
                  <span>Explore ({cat.totalIndicators})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        4. DEEP DIVE BOTTOM SECTION
        - Top Strengths vs Critical Reform Areas
        - Reform Timeline with Data Spike Annotations
        ========================================================================
      */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#FFF2E8] text-[#F7882F]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Top Global Strengths (Ranks #1–#15)</h3>
                <p className="text-xs text-[#6B7A8F]">Areas where India leads globally or shows high velocity</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D46917] bg-[#FFF2E8] px-2.5 py-1 rounded-full border border-[#F7882F]/30">
              Top Performers
            </span>
          </div>

          <div className="divide-y divide-[#DCC7AA]/40">
            {topStrengths.map((ind) => (
              <div
                key={ind.id}
                onClick={() => onSelectIndicator(ind)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF6EF] px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                    <span>{ind.name}</span>
                    <span className="text-[10px] text-[#6B7A8F] font-normal">({ind.source.organization})</span>
                  </div>
                  <div className="text-[11px] text-[#6B7A8F]">{ind.whyItMatters}</div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-sm font-black text-[#F7882F]">#{ind.latestIndiaRank}</div>
                  <div className="text-[11px] font-semibold text-neutral-600">{ind.latestIndiaValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Reform Focus Areas */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#FFFBE8] text-[#D4A11A]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Critical Policy Bottlenecks (Ranks #100+)</h3>
                <p className="text-xs text-[#6B7A8F]">Global metrics requiring targeted structural reforms</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D4A11A] bg-[#FFFBE8] px-2.5 py-1 rounded-full border border-[#F7C331]/40">
              Focus Required
            </span>
          </div>

          <div className="divide-y divide-[#DCC7AA]/40">
            {criticalGaps.map((ind) => (
              <div
                key={ind.id}
                onClick={() => onSelectIndicator(ind)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF6EF] px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                    <span>{ind.name}</span>
                    <span className="text-[10px] text-[#6B7A8F] font-normal">({ind.source.organization})</span>
                  </div>
                  <div className="text-[11px] text-[#6B7A8F]">{ind.whyItMatters}</div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-sm font-black text-[#D4A11A]">#{ind.latestIndiaRank}</div>
                  <div className="text-[11px] font-semibold text-neutral-600">{ind.latestIndiaValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* National Policy Reform Timeline with Annotations */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#F7882F]" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">10-Year National Policy Reform Timeline</h3>
              <p className="text-xs text-[#6B7A8F]">Milestones and data point spikes driving India&apos;s trajectory</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {policyMilestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6EF] rounded-xl p-3.5 border border-[#DCC7AA] space-y-2 relative hover:border-[#F7882F] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-black text-[#D46917] bg-[#FFF2E8] w-fit px-2 py-0.5 rounded border border-[#F7882F]/20">
                  {m.year}
                </div>
                <div className="text-xs font-bold text-neutral-800">{m.title}</div>
                <div className="text-[11px] text-[#6B7A8F] leading-snug">{m.impact}</div>
              </div>

              {/* Data Point Spike Annotation */}
              <div className="text-[10px] font-semibold text-[#D46917] bg-[#FFF2E8] p-2 rounded border border-[#F7882F]/20 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#F7882F] shrink-0" />
                <span><strong>Data Impact:</strong> {m.spike}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
