'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Siren,
  Car,
  CloudLightning,
  Flame,
  Globe2,
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
  Award,
  Zap,
  Lock,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface SafetyDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (query: string) => void;
  onToggleWatchlist: (id: string) => void;
  watchlistIds: string[];
}

export function SafetyDashboard({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds,
}: SafetyDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] = useState<string>('global-peace-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [activeModalIndicator, setActiveModalIndicator] = useState<Indicator | null>(null);

  // Filter all Safety Indicators
  const safetyIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Safety');
  }, []);

  const activeChartIndicator = useMemo(() => {
    return (
      safetyIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      safetyIndicators[0]
    );
  }, [safetyIndicators, selectedChartIndicatorId]);

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
    return safetyIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' ? true : ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'peace') {
        matchesSubtype = ind.id.includes('peace') || ind.id.includes('terrorism');
      } else if (selectedSubtype === 'crime') {
        matchesSubtype = ind.id.includes('crime') || ind.id.includes('safety');
      } else if (selectedSubtype === 'disaster') {
        matchesSubtype = ind.id.includes('road') || ind.id.includes('disaster');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [safetyIndicators, searchQuery, selectedTrend, selectedSubtype]);

  const gpiIndicator = safetyIndicators.find((i) => i.id === 'global-peace-index');
  const crimeIndicator = safetyIndicators.find((i) => i.id === 'crime-index');
  const roadSafetyIndicator = safetyIndicators.find((i) => i.id === 'road-safety-ranking');
  const gtiIndicator = safetyIndicators.find((i) => i.id === 'global-terrorism-index');

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-slate-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>National Security & Homeland Protection</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              India Safety, Peace & Disaster Resilience Matrix
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Real-time intelligence tracking 6 key safety benchmarks: Global Peace Index (GPI #126), Crime Index (44.2), Global Terrorism Index (GTI #14), Road Safety (11.3 fatalities/100k), and 3D WebGL trajectory analytics.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Provide a comprehensive analysis of India’s public safety performance across Global Peace Index #126, CCTNS digital police station network, road safety reforms, and NDRF disaster response protocols.'
                )
              }
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-slate-500 hover:from-indigo-400 hover:to-slate-400 text-white font-black text-xs md:text-sm shadow-lg shadow-indigo-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Security Briefing</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Global Peace Rank</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 mt-1">
              #{gpiIndicator?.latestIndiaRank || 126}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              +9 places improvement
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Crime Index Rating</span>
              <Siren className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {crimeIndicator?.latestIndiaValue || '44.2 Score'}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">
              -2.6 pts lower crime rate
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Road Fatalities</span>
              <Car className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {roadSafetyIndicator?.latestIndiaValue || '11.3 /100k'}
            </div>
            <div className="text-[11px] text-amber-300 font-medium mt-1">
              Down from 15.6 per 100k
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Terror Impact (GTI)</span>
              <Lock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              #{gtiIndicator?.latestIndiaRank || 14} Impact
            </div>
            <div className="text-[11px] text-sky-300 font-medium mt-1">
              75%+ drop in Naxal violence
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive WebGL 3D Safety Chart Studio */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <span>3D WebGL Safety Visualizer Studio</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive 3D Security Metric: {activeChartIndicator?.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Indicator Select Dropdown */}
            <select
              value={selectedChartIndicatorId}
              onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {safetyIndicators.map((ind) => (
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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Benchmarking
              </button>
              <button
                onClick={() => setChartMode('line')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'line'
                    ? 'bg-indigo-600 text-white shadow-sm'
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
            chartMode === 'bar' ? 'Global Benchmarking' : 'India Historical Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator?.source?.organization} (${activeChartIndicator?.source?.lastUpdatedYear})`}
          accentColor="#6366F1"
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
            placeholder="Search safety & security metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Subtype Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedSubtype('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 6 Safety Metrics
          </button>
          <button
            onClick={() => setSelectedSubtype('peace')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'peace'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Peace & Terrorism
          </button>
          <button
            onClick={() => setSelectedSubtype('crime')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'crime'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Crime & Personal Safety
          </button>
          <button
            onClick={() => setSelectedSubtype('disaster')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'disaster'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Road & Disaster Risk
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

      {/* 4. Indicator Grid (6 Safety Metrics) */}
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
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500/50 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header & Watchlist */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {indicator.unit} Metric
                    </span>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
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
                    <div className="text-lg font-black text-indigo-600 mt-0.5">
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
                    <span className="font-semibold text-slate-500">Benchmark Leader:</span>
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
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
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

      {/* 5. National Public Safety Strategy Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>National Safety & Disaster Action Pillars</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              Public Security, Digital Policing & Disaster Defense
            </h2>
          </div>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Detail India’s national security and public safety reforms: CCTNS digital police integration, Dial 112 ERSS system, NDRF zero-casualty evacuation protocols, and Highway Safety Amendments.'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black border border-indigo-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Generate Security Strategy Brief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              <Siren className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              1. CCTNS & ERSS Dial 112 Integration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% police station digital record sharing across 16,500+ stations nationwide. Emergency Response Support System (112) active in all States with real-time GPS dispatch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              2. Zero-Fatality Highway Corridors
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fixing 4,000+ national highway accident blackspots, enforcing automated speed camera e-Challans, and implementing mandatory 6-airbag passenger vehicle safety standards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              <CloudLightning className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              3. NDRF Disaster Resilience Grid
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              World-leading zero-casualty evacuation protocols for coastal cyclones (Odisha & Gujarat). Real-time IMD Doppler radar grid covering 100% of India’s coastline.
            </p>
          </div>
        </div>

        {/* Critical Challenges Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-indigo-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              Key Homeland Security & Safety Bottlenecks
            </h4>
            <span className="text-[11px] font-extrabold text-slate-400">UN Police Benchmark: 222 / 100k</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span><strong>Police Personnel Ratio Gap:</strong> Current ~152 police officers per 100,000 citizens vs UN recommended 222.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span><strong>Surging Cyber Phishing & Fraud:</strong> Financial digital phishing calls require AI fraud monitoring at banking gateways.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span><strong>Urban Monsoon Infrastructure Risk:</strong> Metro drainage expansion needed to prevent recurring monsoon flash floods.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span><strong>Border Drone Infiltration:</strong> Counter-drone systems required across western border smuggling routes.</span>
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
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
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

                  <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="text-[10px] font-bold text-indigo-600 uppercase">
                      Global Rank
                    </div>
                    <div className="text-lg font-black text-indigo-700 mt-0.5">
                      #{activeModalIndicator.latestIndiaRank}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Trend Delta
                    </div>
                    <div className="text-sm font-extrabold text-indigo-700 mt-1">
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
                      Current Gaps & Challenges
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
                    className="inline-flex items-center gap-1 text-indigo-700 font-bold hover:underline"
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
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-black transition-all"
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
