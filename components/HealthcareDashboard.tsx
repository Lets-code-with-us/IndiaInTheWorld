'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Building2,
  Syringe,
  Baby,
  BrainCircuit,
  Filter,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  UserCheck,
  Award,
  Globe2,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface HealthcareDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (query: string) => void;
  onToggleWatchlist: (id: string) => void;
  watchlistIds: string[];
}

export function HealthcareDashboard({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds,
}: HealthcareDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] = useState<string>('healthcare-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [activeModalIndicator, setActiveModalIndicator] = useState<Indicator | null>(null);

  // Filter all Healthcare Indicators
  const healthcareIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Healthcare');
  }, []);

  const activeChartIndicator = useMemo(() => {
    return (
      healthcareIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      healthcareIndicators[0]
    );
  }, [healthcareIndicators, selectedChartIndicatorId]);

  // Format 3D Chart Data
  const threeDChartData = useMemo(() => {
    if (!activeChartIndicator) return [];

    if (chartMode === 'bar') {
      return activeChartIndicator.countryComparison.map((item) => ({
        label: item.code,
        value: typeof item.value === 'number' ? item.value : parseFloat(String(item.value)) || 50,
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
    return healthcareIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' ? true : ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'indexes') {
        matchesSubtype = ind.id.includes('index') || ind.id.includes('coverage');
      } else if (selectedSubtype === 'mortality') {
        matchesSubtype = ind.id.includes('mortality') || ind.id.includes('expectancy');
      } else if (selectedSubtype === 'capacity') {
        matchesSubtype = ind.id.includes('physicians') || ind.id.includes('beds') || ind.id.includes('vaccination');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [healthcareIndicators, searchQuery, selectedTrend, selectedSubtype]);

  // Key stats summary
  const avgRank = Math.round(
    healthcareIndicators.reduce((acc, curr) => acc + curr.latestIndiaRank, 0) /
      (healthcareIndicators.length || 1)
  );

  const topIndicator = [...healthcareIndicators].sort(
    (a, b) => a.latestIndiaRank - b.latestIndiaRank
  )[0];

  const highestCoverage = healthcareIndicators.find((i) => i.id === 'vaccination-coverage');

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-widest">
              <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Healthcare & Life Quality Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              India Healthcare Index & Medical Sector Benchmark
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Real-time analytics tracking 9 critical health parameters: from Universal Coverage, Infant & Maternal Mortality, and Doctor Density to 3D WebGL trajectory visualizers.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Synthesize India’s 2025 healthcare trajectory across Infant Mortality, Doctor Density, UHC Index, and Ayushman Bharat coverage.'
                )
              }
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Health Briefing</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Tracked Metrics</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">9 Key Metrics</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              100% Verified WHO/UNICEF Data
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Average India Rank</span>
              <Award className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">#{avgRank} Global</div>
            <div className="text-[11px] text-teal-300 font-medium mt-1">
              Out of ~195 Nations
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Top Global Rank</span>
              <Syringe className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              #{topIndicator?.latestIndiaRank || 18}
            </div>
            <div className="text-[11px] text-slate-300 truncate mt-1">
              {topIndicator?.name || 'Childhood Immunization'}
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Immunization Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {highestCoverage?.latestIndiaValue || '93.5%'}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">
              Driven by U-WIN Digital System
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive WebGL 3D Health Chart Canvas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              <span>3D WebGL Healthcare Visualizer Studio</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive 3D Health Metric: {activeChartIndicator?.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Indicator Select Dropdown */}
            <select
              value={selectedChartIndicatorId}
              onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {healthcareIndicators.map((ind) => (
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
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Benchmarking
              </button>
              <button
                onClick={() => setChartMode('line')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'line'
                    ? 'bg-emerald-600 text-white shadow-sm'
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
            chartMode === 'bar' ? 'Global Benchmarking' : 'India 10-Year Historical Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator?.source?.organization} (${activeChartIndicator?.source?.lastUpdatedYear})`}
          accentColor="#059669"
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
            placeholder="Search healthcare indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Subtype Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedSubtype('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 9 Metrics
          </button>
          <button
            onClick={() => setSelectedSubtype('indexes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'indexes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Core Indexes & UHC
          </button>
          <button
            onClick={() => setSelectedSubtype('mortality')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'mortality'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mortality & Life Expectancy
          </button>
          <button
            onClick={() => setSelectedSubtype('capacity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'capacity'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Workforce, Beds & Vaccines
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

      {/* 4. Indicator Grid (9 Healthcare Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIndicators.map((indicator, idx) => {
          const isWatchlisted = watchlistIds.includes(indicator.id);
          const topCountry = indicator.countryComparison[0];

          return (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header & Watchlist */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {indicator.unit} Metric
                    </span>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {indicator.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onToggleWatchlist(indicator.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      isWatchlisted
                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
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
                      India Value / Score
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                      {indicator.latestIndiaValue}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Global Rank
                    </div>
                    <div className="text-lg font-black text-emerald-600 mt-0.5">
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
                  <span className="text-slate-400 font-normal text-[11px]">
                    vs previous cycle
                  </span>
                </div>

                {/* Top Benchmark Country */}
                {topCountry && (
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-3 border-t border-slate-100 mb-4">
                    <span className="font-semibold text-slate-500">Global Leader:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-sky-500" />
                      {topCountry.name} ({topCountry.formattedValue})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveModalIndicator(indicator)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
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

      {/* 5. Policy Reforms & Strategic Blueprint */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              <span>National Healthcare Policy Matrix</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              Key Healthcare Pillars & Policy Reform Drivers
            </h2>
          </div>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Provide a detailed reform policy brief to increase India healthcare budget to 2.5% of GDP and solve specialist doctor shortages in rural district hospitals.'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Generate Policy Reform Brief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              1. Ayushman Bharat Universal Coverage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides ₹5 Lakh annual health insurance per vulnerable family covering over 500 million citizens, alongside 160,000+ operational Ayushman Arogya Mandirs for primary health screening.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              <Syringe className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              2. U-WIN & Digital Health Registry
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digitizes life-cycle immunization for 27M pregnant women and 29M infants annually, pushing DTP3 and Measles coverage to a record 93.5% with real-time QR certificates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              3. Medical Infrastructure Expansion
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical college count surged to 700+ nationwide, adding 100,000+ MBBS seats per year and setting up 22 new AIIMS institutions to bridge doctor density gaps.
            </p>
          </div>
        </div>

        {/* SWOT / Challenges Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-400" />
              Primary Structural Bottlenecks to Address
            </h4>
            <span className="text-[11px] font-extrabold text-slate-400">WHO Target: 2.5% GDP Spend</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Out-of-Pocket Expenditure (~47%):</strong> High medical cost remains a key cause of household financial stress.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Hospital Bed Ratio (1.40 / 1,000):</strong> Below WHO benchmark of 3.0 beds per 1,000 inhabitants.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Doctor Distribution Disparity:</strong> 80% of doctors reside in urban centers serving 30% of the population.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Non-Communicable Disease Surge:</strong> Diabetes and hypertension burden requiring early community-level diagnostics.</span>
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
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
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

                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase">
                      Global Rank
                    </div>
                    <div className="text-lg font-black text-emerald-700 mt-0.5">
                      #{activeModalIndicator.latestIndiaRank}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Trend Delta
                    </div>
                    <div className="text-sm font-extrabold text-emerald-700 mt-1">
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
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                    <h5 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Key National Strengths
                    </h5>
                    <ul className="text-xs text-emerald-950 space-y-1 list-disc pl-4 font-medium">
                      {activeModalIndicator.strengthsAndGaps.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <h5 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Current Infrastructure Gaps
                    </h5>
                    <ul className="text-xs text-amber-950 space-y-1 list-disc pl-4 font-medium">
                      {activeModalIndicator.strengthsAndGaps.gaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
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
                    className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
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
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-black transition-all"
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
