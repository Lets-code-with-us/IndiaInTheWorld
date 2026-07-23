'use client';

import React from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Globe,
  Building2,
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

const CATEGORY_ICONS: Record<CategoryType, React.ElementType> = {
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
    { year: 2015, title: 'Digital India & Jan Dhan Launch', impact: 'Built base for 1.4B digital biometric identities & 500M bank accounts' },
    { year: 2016, title: 'Unified Payments Interface (UPI)', impact: 'Revolutionized digital payments (>13B monthly transactions)' },
    { year: 2018, title: 'Ayushman Bharat PM-JAY', impact: 'World largest free health cover for 500M low-income citizens' },
    { year: 2020, title: 'National Education Policy (NEP) & PLI', impact: 'Multi-disciplinary education reform & $26B manufacturing incentives' },
    { year: 2024, title: 'IndiaAI Mission & DPDP Act Enforcement', impact: '$1.2B allocation for compute infrastructure & data protection' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-[#1B2028] via-[#232A34] to-[#1B2028] rounded-2xl p-6 sm:p-8 text-white border border-[#2D3642] shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#F7882F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#F7C331]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7882F]/20 text-[#F7C331] border border-[#F7882F]/30 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>India Global Footprint & Policy Radar</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Where India Stands in the Global Order
            </h1>

            <p className="text-[#DCC7AA] text-sm leading-relaxed">
              Consolidating real-time metrics from the United Nations, World Bank, IMF, WHO, WIPO, WEF, and Reporters Without Borders into a single transparent intelligence dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenReportCard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7882F] hover:bg-[#D46917] text-white text-xs font-semibold shadow-lg shadow-black/40 transition-all border border-[#F7C331]/30"
              >
                <Award className="w-4 h-4 text-white" />
                <span>Generate AI Annual Report Card</span>
              </button>

              <button
                onClick={() => onOpenAiAssistant('Provide a summary of India’s top 5 strengths and weaknesses.')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D3642] hover:bg-[#384352] text-slate-200 text-xs font-medium border border-[#384352] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#F7C331]" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Footprint */}
          <div className="w-full lg:w-auto grid grid-cols-2 gap-3 bg-[#232A34] border border-[#2D3642] rounded-xl p-4">
            <div className="space-y-1">
              <div className="text-[11px] text-[#6B7A8F] font-medium">Nominal GDP</div>
              <div className="text-xl font-bold text-[#F7882F]">$3.93 Trillion</div>
              <div className="text-[10px] text-slate-400">Rank #5 globally (IMF)</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-[#6B7A8F] font-medium">GDP (PPP)</div>
              <div className="text-xl font-bold text-[#F7C331]">$14.2 Trillion</div>
              <div className="text-[10px] text-slate-400">Rank #3 globally (World Bank)</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-[#6B7A8F] font-medium">Global Innovation</div>
              <div className="text-xl font-bold text-[#F7882F]">Rank #39</div>
              <div className="text-[10px] text-slate-400">+42 places in 10 yrs</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-[#6B7A8F] font-medium">Population Scale</div>
              <div className="text-xl font-bold text-[#DCC7AA]">1.43 Billion</div>
              <div className="text-[10px] text-slate-400">17.7% of world total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Hero KPI Highlight Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F7882F]" />
            <span>Key Benchmark Indicators</span>
          </h2>
          <span className="text-xs text-[#6B7A8F]">Verified 2025/2026 Datasets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[gdpInd, giiInd, ccpiInd, cyberInd, aiInd, govTechInd].map((ind) => {
            if (!ind) return null;
            return (
              <div
                key={ind.id}
                onClick={() => onSelectIndicator(ind)}
                className="bg-white rounded-xl p-4 border border-[#DCC7AA] shadow-sm hover:shadow-md hover:border-[#F7882F] cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-[#6B7A8F] uppercase tracking-wider">
                    <span className="truncate">{ind.category}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ind.trend === 'improving'
                          ? 'bg-[#FFF2E8] text-[#D46917] border border-[#F7882F]/30'
                          : 'bg-[#FFFBE8] text-[#D4A11A] border border-[#F7C331]/30'
                      }`}
                    >
                      {ind.trend}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 mt-2 group-hover:text-[#F7882F] transition-colors line-clamp-1">
                    {ind.name}
                  </h3>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">
                      #{ind.latestIndiaRank}
                    </span>
                    <span className="text-xs font-semibold text-[#6B7A8F]">
                      {ind.latestIndiaValue}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#DCC7AA]/60 flex items-center justify-between text-[11px] text-[#6B7A8F]">
                  <span>{ind.changeDelta}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F7882F] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10 Category Snapshot Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Category Index Overview</h2>
            <p className="text-xs text-[#6B7A8F]">Aggregated India score card across 10 global policy categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const Icon = CATEGORY_ICONS[catKey] || Globe;

            return (
              <div
                key={catKey}
                onClick={() => onSelectCategory(catKey)}
                className="bg-white rounded-xl p-4 border border-[#DCC7AA] hover:border-[#F7882F] shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#FFF2E8] text-[#F7882F] border border-[#F7882F]/20 group-hover:bg-[#F7882F] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#6B7A8F] bg-[#FAF6EF] border border-[#DCC7AA] px-2 py-0.5 rounded-full">
                    Avg Rank #{cat.averageRank}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#F7882F] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#6B7A8F] mt-0.5 line-clamp-2">{cat.description}</p>
                </div>

                <div className="space-y-1.5 text-[11px] border-t border-[#DCC7AA]/60 pt-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-[#6B7A8F]">Top Rank:</span>
                    <span className="font-semibold text-[#F7882F]">{cat.topIndicator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7A8F]">Lagging:</span>
                    <span className="font-semibold text-amber-700 truncate max-w-[120px]">{cat.weakestIndicator}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium text-[#F7882F] group-hover:translate-x-1 transition-transform">
                  <span>Explore Category ({cat.totalIndicators})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top 5 Strengths vs Critical Focus Areas */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#FFF2E8] text-[#F7882F]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">India&apos;s Top Global Strengths</h3>
                <p className="text-xs text-[#6B7A8F]">World-leading rankings and high-velocity gains</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D46917] bg-[#FFF2E8] px-2.5 py-1 rounded-full border border-[#F7882F]/30">
              Rank Top 15
            </span>
          </div>

          <div className="divide-y divide-[#DCC7AA]/40">
            {topStrengths.map((ind) => (
              <div
                key={ind.id}
                onClick={() => onSelectIndicator(ind)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF6EF] px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>{ind.name}</span>
                    <span className="text-[10px] text-[#6B7A8F] font-normal">({ind.source.organization})</span>
                  </div>
                  <div className="text-[11px] text-[#6B7A8F]">{ind.whyItMatters}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-[#F7882F]">#{ind.latestIndiaRank}</div>
                  <div className="text-[11px] font-semibold text-slate-600">{ind.latestIndiaValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Reform Focus Areas */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#FFFBE8] text-[#D4A11A]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Critical Policy Bottlenecks</h3>
                <p className="text-xs text-[#6B7A8F]">Global indicators requiring immediate policy intervention</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D4A11A] bg-[#FFFBE8] px-2.5 py-1 rounded-full border border-[#F7C331]/40">
              Rank #100+
            </span>
          </div>

          <div className="divide-y divide-[#DCC7AA]/40">
            {criticalGaps.map((ind) => (
              <div
                key={ind.id}
                onClick={() => onSelectIndicator(ind)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF6EF] px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>{ind.name}</span>
                    <span className="text-[10px] text-[#6B7A8F] font-normal">({ind.source.organization})</span>
                  </div>
                  <div className="text-[11px] text-[#6B7A8F]">{ind.whyItMatters}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-[#D4A11A]">#{ind.latestIndiaRank}</div>
                  <div className="text-[11px] font-semibold text-slate-600">{ind.latestIndiaValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Milestones Timeline */}
      <section className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#F7882F]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Major National Reform Timeline</h3>
              <p className="text-xs text-[#6B7A8F]">Key policy milestones driving India&apos;s global index trajectory</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {policyMilestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6EF] rounded-xl p-3.5 border border-[#DCC7AA] space-y-1.5 relative hover:border-[#F7882F] transition-colors"
            >
              <div className="text-xs font-black text-[#D46917] bg-[#FFF2E8] w-fit px-2 py-0.5 rounded border border-[#F7882F]/20">
                {m.year}
              </div>
              <div className="text-xs font-bold text-slate-800">{m.title}</div>
              <div className="text-[11px] text-[#6B7A8F] leading-snug">{m.impact}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
