'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  ExternalLink,
  BrainCircuit,
  Filter,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Globe2,
  ShieldCheck,
  Cpu,
  Server,
  FileCode2,
  UserCheck,
  Zap,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface DigitalGovDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (query: string) => void;
  onToggleWatchlist: (id: string) => void;
  watchlistIds: string[];
}

export function DigitalGovDashboard({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds,
}: DigitalGovDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] =
    useState<string>('govtech-maturity-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [activeModalIndicator, setActiveModalIndicator] =
    useState<Indicator | null>(null);

  // Filter DigitalGov indicators
  const digitalGovIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'DigitalGov');
  }, []);

  const activeChartIndicator = useMemo(() => {
    return (
      digitalGovIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      digitalGovIndicators[0]
    );
  }, [digitalGovIndicators, selectedChartIndicatorId]);

  // Format 3D Chart Data
  const threeDChartData = useMemo(() => {
    if (!activeChartIndicator) return [];

    if (chartMode === 'bar') {
      return activeChartIndicator.countryComparison.map((item) => ({
        label: item.code,
        value:
          typeof item.value === 'number'
            ? item.value
            : parseFloat(String(item.value)) || 50,
        formattedValue: item.formattedValue,
        isHighlight: item.code === 'IND',
      }));
    } else {
      return activeChartIndicator.historicalData.map((item) => ({
        label: String(item.year),
        value: item.india,
        formattedValue: `India Value/Rank: ${item.india}`,
        isHighlight: item.year === 2025,
      }));
    }
  }, [activeChartIndicator, chartMode]);

  // Filtered list based on search and filters
  const filteredIndicators = useMemo(() => {
    return digitalGovIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' ? true : ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'egov') {
        matchesSubtype =
          ind.id.includes('egovernment') || ind.id.includes('govtech');
      } else if (selectedSubtype === 'open') {
        matchesSubtype =
          ind.id.includes('open-data') || ind.id.includes('e-participation');
      } else if (selectedSubtype === 'tech') {
        matchesSubtype = ind.id.includes('competitiveness');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [digitalGovIndicators, searchQuery, selectedTrend, selectedSubtype]);

  const gtmi = digitalGovIndicators.find((i) => i.id === 'govtech-maturity-index');
  const egdi = digitalGovIndicators.find((i) => i.id === 'egovernment-development-index');
  const epi = digitalGovIndicators.find((i) => i.id === 'e-participation-index');
  const odin = digitalGovIndicators.find((i) => i.id === 'open-data-inventory');

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Executive Header Banner */}
      <motion.div
        layoutId="category-card-DigitalGov"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3C2F2F] via-[#2A2121] to-[#1B2028] p-6 md:p-8 text-white shadow-2xl shadow-black/20 border border-[#52433A]"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#F7882F]/20 to-[#F7C331]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#D46917]/20 to-[#F7882F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              layoutId="category-icon-DigitalGov"
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7882F]/20 border border-[#F7882F]/30 backdrop-blur-md text-[#F7C331] text-xs font-bold uppercase tracking-widest"
            >
              <Globe className="w-4 h-4 text-[#F7C331] animate-pulse" />
              <span>Digital Public Infrastructure & Open Governance Matrix</span>
            </motion.div>
            <motion.h1
              layoutId="category-title-DigitalGov"
              className="text-2xl md:text-4xl font-black text-white tracking-tight"
            >
              India Digital Government, GovTech & Open Data Hub
            </motion.h1>
            <p className="text-[#E8D9C8] text-sm md:text-base leading-relaxed">
              Tracking 5 global e-governance metrics: GovTech Maturity Index (#15 Group A), UN E-Government Development Index (#97), E-Participation Index (#57), Open Data Inventory (ODIN #64), and IMD World Digital Competitiveness (#49).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Provide a comprehensive executive briefing on India Digital Public Infrastructure (DPI) leadership: India Stack, UPI, Aadhaar, DigiLocker, GovTech Maturity Index Group A, Open Data data.gov.in strategy, and digital e-governance transformation.'
                )
              }
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#F7882F] hover:bg-[#E0731E] text-white font-black text-xs md:text-sm shadow-lg shadow-[#F7882F]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-[#F7C331]" />
              <span>AI Digital Briefing</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#52433A]">
          <div className="bg-[#4A3E3D]/80 backdrop-blur-md p-4 rounded-2xl border border-[#52433A]">
            <div className="text-xs font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>GovTech Maturity</span>
              <Award className="w-4 h-4 text-[#F7C331]" />
            </div>
            <div className="text-2xl font-black text-[#F7C331] mt-1">
              #{gtmi?.latestIndiaRank || 15}
            </div>
            <div className="text-[11px] text-[#F7C331] font-medium mt-1">
              Group A Top Tier
            </div>
          </div>

          <div className="bg-[#4A3E3D]/80 backdrop-blur-md p-4 rounded-2xl border border-[#52433A]">
            <div className="text-xs font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>UN E-Government</span>
              <Server className="w-4 h-4 text-[#F7882F]" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              #{egdi?.latestIndiaRank || 97}
            </div>
            <div className="text-[11px] text-[#C4B2A5] font-medium mt-1">
              0.692 Score (High)
            </div>
          </div>

          <div className="bg-[#4A3E3D]/80 backdrop-blur-md p-4 rounded-2xl border border-[#52433A]">
            <div className="text-xs font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>E-Participation</span>
              <UserCheck className="w-4 h-4 text-[#F7C331]" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              #{epi?.latestIndiaRank || 57}
            </div>
            <div className="text-[11px] text-[#F7C331] font-medium mt-1">
              +11 spots gain
            </div>
          </div>

          <div className="bg-[#4A3E3D]/80 backdrop-blur-md p-4 rounded-2xl border border-[#52433A]">
            <div className="text-xs font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>Open Data (ODIN)</span>
              <FileCode2 className="w-4 h-4 text-[#F7C331]" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              #{odin?.latestIndiaRank || 64}
            </div>
            <div className="text-[11px] text-[#F7C331] font-medium mt-1">
              58.4 Open Score
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive WebGL 3D Digital Gov Chart Studio */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-[#D46917] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#F7882F]" />
              <span>3D WebGL Digital Governance Visualizer</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive 3D Digital Metric: {activeChartIndicator?.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Indicator Select Dropdown */}
            <select
              value={selectedChartIndicatorId}
              onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
            >
              {digitalGovIndicators.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name} (#{ind.latestIndiaRank})
                </option>
              ))}
            </select>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setChartMode('bar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'bar'
                    ? 'bg-[#F7882F] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Benchmarking
              </button>
              <button
                onClick={() => setChartMode('line')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'line'
                    ? 'bg-[#F7882F] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Line Trajectory
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas Element */}
        <ThreeDChart
          data={threeDChartData}
          chartType={chartMode}
          title={`${activeChartIndicator?.name} — ${
            chartMode === 'bar'
              ? 'Global Benchmarking'
              : 'India Historical Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator?.source?.organization} (${activeChartIndicator?.source?.lastUpdatedYear})`}
          accentColor="#F7882F"
          height={380}
        />
      </div>

      {/* 3. Filter Controls & Search */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search digital government metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
          />
        </div>

        {/* Subtype Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedSubtype('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'all'
                ? 'bg-[#F7882F] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 5 Digital Metrics
          </button>
          <button
            onClick={() => setSelectedSubtype('egov')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'egov'
                ? 'bg-[#F7882F] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            E-Gov & GovTech
          </button>
          <button
            onClick={() => setSelectedSubtype('open')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'open'
                ? 'bg-[#F7882F] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Open Data & Participation
          </button>
          <button
            onClick={() => setSelectedSubtype('tech')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'tech'
                ? 'bg-[#F7882F] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Digital Competitiveness
          </button>
        </div>

        {/* Trend Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
          <select
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-slate-800 text-xs font-bold pr-2"
          >
            <option value="all">All Trends</option>
            <option value="improving">Improving Only</option>
            <option value="declining">Declining</option>
            <option value="stable">Stable</option>
          </select>
        </div>
      </div>

      {/* 4. Indicator Grid with Framer Motion hover scale and 3D shadow lifts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIndicators.map((indicator, idx) => {
          const isWatchlisted = watchlistIds.includes(indicator.id);
          const topCountry = indicator.countryComparison[0];

          return (
            <motion.div
              key={indicator.id}
              layoutId={`indicator-card-${indicator.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              whileHover={{ scale: 1.025, y: -6 }}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#F7882F]/50 p-5 shadow-sm hover:shadow-2xl hover:shadow-[#F7882F]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header & Watchlist */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#FFF2E8] text-[#D46917] border border-[#F7882F]/20">
                        {indicator.unit} Metric
                      </span>
                      {(indicator.isCritical || indicator.isFluctuating || indicator.latestIndiaRank <= 20) && (
                        <motion.span
                          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF2E8] border border-[#F7882F]/30 text-[#D46917] text-[10px] font-black uppercase"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F7882F] animate-ping" />
                          <span>{indicator.isFluctuating ? '⚡ Fluctuation' : '🔥 Key Metric'}</span>
                        </motion.span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-[#D46917] transition-colors leading-snug">
                      {indicator.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(indicator.id);
                    }}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      isWatchlisted
                        ? 'bg-[#F7882F] text-white'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                    }`}
                    title={isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    ★
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {indicator.description}
                </p>

                {/* Primary Stats Box */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      India Value
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                      {indicator.latestIndiaValue}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Global Rank / Pos
                    </div>
                    <div className="text-lg font-black text-[#D46917] mt-0.5">
                      #{indicator.latestIndiaRank}{' '}
                      <span className="text-xs font-semibold text-slate-400">
                        / {indicator.totalCountriesMeasured}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Change Delta Badge */}
                <div className="flex items-center gap-2 text-xs font-bold mb-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] ${
                      indicator.trend === 'improving'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : indicator.trend === 'declining'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {indicator.trend === 'improving' ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    ) : indicator.trend === 'declining' ? (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{indicator.changeDelta}</span>
                  </span>
                </div>

                {/* Top Benchmark Country */}
                {topCountry && (
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-3 border-t border-slate-100 mb-4">
                    <span className="font-semibold text-slate-500">
                      Benchmark Leader:
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-[#F7882F]" />
                      {topCountry.name} ({topCountry.formattedValue})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveModalIndicator(indicator)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#F7882F] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Deep Dive</span>
                </button>

                <button
                  onClick={() => onSelectIndicator(indicator)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center"
                  title="Full Historical Dashboard View"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 5. National Digital Public Infrastructure (DPI) Pillars */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-[#D46917] uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#F7882F]" />
              <span>India Stack & Digital Governance Pillars</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              Digital Identity, Financial Inclusion & Open Data Infrastructure
            </h2>
          </div>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Detail the core pillars of India Digital Public Infrastructure (DPI): Aadhaar digital ID, UPI payments, DigiLocker paperless documents, ONDC e-commerce protocol, and open government data on data.gov.in.'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF2E8] hover:bg-[#FFE6D5] text-[#D46917] text-xs font-black border border-[#F7882F]/30 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#F7882F]" />
            <span>Generate DPI Brief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E8] flex items-center justify-center text-[#D46917] font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              1. Identity & Consent Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aadhaar biometrics & DigiLocker providing 1.4B citizens with instant, paperless identity verification and tamper-proof digital credentials.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E8] flex items-center justify-center text-[#D46917] font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              2. Unified Payments Interface (UPI)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open-loop real-time payment protocol processing over 13 Billion instant monthly transactions, powering 46% of all global real-time digital payments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E8] flex items-center justify-center text-[#D46917] font-bold">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              3. Open Data & Participatory Gov
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              data.gov.in publishing 600,000+ open datasets paired with MyGov.in engaging 30M+ citizens directly in policy consultations and crowdsourced feedback.
            </p>
          </div>
        </div>

        {/* Critical Digital Gov Challenges */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-[#F7C331] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F7C331]" />
              Key E-Governance & Digital Infrastructure Challenges
            </h4>
            <span className="text-[11px] font-extrabold text-slate-400">
              Target: 100% Gram Panchayat Fiber Connectivity
            </span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-[#F7882F] font-bold">•</span>
              <span>
                <strong>Rural Connectivity Divide:</strong> Universal fixed broadband penetration needed across remote Gram Panchayats.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F7882F] font-bold">•</span>
              <span>
                <strong>Cybersecurity Resilience:</strong> Protecting critical information infrastructure (CII) and municipal databases.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F7882F] font-bold">•</span>
              <span>
                <strong>DPDP Privacy Compliance:</strong> Full operationalization of Digital Personal Data Protection (DPDP) Act across state departments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F7882F] font-bold">•</span>
              <span>
                <strong>Regional Language Accessibility:</strong> Expanding AI natural language voice interfaces (Bhashini) for digital public services.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 6. Detailed Indicator Modal */}
      <AnimatePresence>
        {activeModalIndicator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setActiveModalIndicator(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full font-bold text-xs"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFF2E8] text-[#D46917]">
                    {activeModalIndicator.category} • {activeModalIndicator.unit}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    {activeModalIndicator.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {activeModalIndicator.description}
                  </p>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      India Value
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                      {activeModalIndicator.latestIndiaValue}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FFF2E8] rounded-2xl border border-[#F7882F]/20">
                    <div className="text-[10px] font-bold text-[#D46917] uppercase">
                      Global Rank
                    </div>
                    <div className="text-lg font-black text-[#D46917] mt-0.5">
                      #{activeModalIndicator.latestIndiaRank}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Trend Delta
                    </div>
                    <div className="text-sm font-extrabold text-[#D46917] mt-1">
                      {activeModalIndicator.changeDelta}
                    </div>
                  </div>
                </div>

                {/* Why It Matters */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Why This Metric Matters
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {activeModalIndicator.whyItMatters}
                  </p>
                </div>

                {/* Strengths and Gaps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FFF2E8]/70 border border-[#F7882F]/20 space-y-2">
                    <h5 className="text-xs font-black text-[#D46917] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F7882F]" />
                      Key National Strengths
                    </h5>
                    <ul className="text-xs text-slate-800 space-y-1 list-disc pl-4 font-medium">
                      {activeModalIndicator.strengthsAndGaps.strengths.map(
                        (str, i) => (
                          <li key={i}>{str}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <h5 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Current Gaps & Challenges
                    </h5>
                    <ul className="text-xs text-amber-950 space-y-1 list-disc pl-4 font-medium">
                      {activeModalIndicator.strengthsAndGaps.gaps.map(
                        (gap, i) => (
                          <li key={i}>{gap}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Source details */}
                <div className="p-3.5 bg-slate-100/80 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Source:</span>{' '}
                    {activeModalIndicator.source.organization} (
                    {activeModalIndicator.source.lastUpdatedYear})
                  </div>
                  <a
                    href={activeModalIndicator.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#D46917] font-bold hover:underline"
                  >
                    <span>View Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Modal footer action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      const ind = activeModalIndicator;
                      setActiveModalIndicator(null);
                      onSelectIndicator(ind);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#F7882F] text-white text-xs font-black transition-all"
                  >
                    Open Full Metric Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
