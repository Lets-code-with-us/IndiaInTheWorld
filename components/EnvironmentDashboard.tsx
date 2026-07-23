'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Wind,
  Sun,
  Droplets,
  Trees,
  CloudRain,
  Flame,
  Globe2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  BrainCircuit,
  Filter,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Award,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface EnvironmentDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (query: string) => void;
  onToggleWatchlist: (id: string) => void;
  watchlistIds: string[];
}

export function EnvironmentDashboard({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds,
}: EnvironmentDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] = useState<string>('climate-change-performance-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [activeModalIndicator, setActiveModalIndicator] = useState<Indicator | null>(null);

  // Filter all Environment Indicators
  const environmentIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Environment');
  }, []);

  const activeChartIndicator = useMemo(() => {
    return (
      environmentIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      environmentIndicators[0]
    );
  }, [environmentIndicators, selectedChartIndicatorId]);

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
    return environmentIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' ? true : ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'climate') {
        matchesSubtype = ind.id.includes('climate') || ind.id.includes('co2') || ind.id.includes('epi');
      } else if (selectedSubtype === 'energy') {
        matchesSubtype = ind.id.includes('renewable') || ind.id.includes('sdg');
      } else if (selectedSubtype === 'ecosystems') {
        matchesSubtype = ind.id.includes('air') || ind.id.includes('forest') || ind.id.includes('water');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [environmentIndicators, searchQuery, selectedTrend, selectedSubtype]);

  // Key stats summary
  const avgRank = Math.round(
    environmentIndicators.reduce((acc, curr) => acc + curr.latestIndiaRank, 0) /
      (environmentIndicators.length || 1)
  );

  const topCcpi = environmentIndicators.find((i) => i.id === 'climate-change-performance-index');
  const renewableShare = environmentIndicators.find((i) => i.id === 'renewable-energy-share');
  const forestCover = environmentIndicators.find((i) => i.id === 'forest-cover');

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-green-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-green-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-widest">
              <Leaf className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Climate & Ecosystem Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              India Environment Dashboard & Net-Zero 2070 Tracker
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Real-time analytics tracking 9 key environmental parameters: Climate Change Performance (CCPI #10), 44.8% Renewable Share, Air Quality, Forest Canopy Gain, and 3D WebGL climate trajectory models.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Synthesize India’s 2025 environmental performance across CCPI rank #10, 44.8% renewable energy capacity, PM2.5 air quality interventions, and forest cover expansion.'
                )
              }
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Climate Briefing</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>CCPI Climate Rank</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              #{topCcpi?.latestIndiaRank || 10} Global
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Top 10 Global Climate Leader
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Renewable Capacity Share</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {renewableShare?.latestIndiaValue || '44.8%'}
            </div>
            <div className="text-[11px] text-amber-300 font-medium mt-1">
              Surpassed 2030 target early
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Forest & Tree Cover</span>
              <Trees className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {forestCover?.latestIndiaValue || '24.62%'}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">
              +2,261 sq km 2-yr net gain
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Per Capita CO₂</span>
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">1.9 Tonnes</div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">
              Vs 4.7 World Average
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive WebGL 3D Climate Chart Canvas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              <span>3D WebGL Environmental Visualizer Studio</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive 3D Climate Metric: {activeChartIndicator?.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Indicator Select Dropdown */}
            <select
              value={selectedChartIndicatorId}
              onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {environmentIndicators.map((ind) => (
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
            chartMode === 'bar' ? 'Global Benchmarking' : 'India Historical Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator?.source?.organization} (${activeChartIndicator?.source?.lastUpdatedYear})`}
          accentColor="#10B981"
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
            placeholder="Search environment metrics..."
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
            onClick={() => setSelectedSubtype('climate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'climate'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Climate & EPI
          </button>
          <button
            onClick={() => setSelectedSubtype('energy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'energy'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Renewables & SDGs
          </button>
          <button
            onClick={() => setSelectedSubtype('ecosystems')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'ecosystems'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Air, Forest & Water
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

      {/* 4. Indicator Grid (9 Environment Metrics) */}
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
                      India Value
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
                </div>

                {/* Top Benchmark Country */}
                {topCountry && (
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-3 border-t border-slate-100 mb-4">
                    <span className="font-semibold text-slate-500">Benchmark Leader:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
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

      {/* 5. Net-Zero 2070 Policy Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Panchamrit Net-Zero 2070 Blueprint</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              National Climate Transition & Ecological Pillars
            </h2>
          </div>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Detail India’s Panchamrit climate goals: 500 GW non-fossil capacity by 2030, 45% carbon intensity reduction, and Net-Zero by 2070.'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Generate Net-Zero Policy Brief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              1. 500 GW Non-Fossil Capacity by 2030
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Surpassed 44.8% non-fossil electricity capacity ahead of schedule. Mega-solar installations at Khavda (30 GW) and PM Surya Ghar 10M rooftop homes lead the push.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              2. Green Hydrogen & Industrial Decarbonization
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              National Green Hydrogen Mission ($2.3 Billion) targets 5 MMT annual production by 2030 to replace fossil fuels in steel, fertilizers, and heavy transport.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              <Trees className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              3. Carbon Sink & Forest Canopy Expansion
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Building 2.5 to 3 Billion Tonnes of additional CO₂ carbon sink by 2030 through MISHTI mangrove protection and Nagar Van urban forests.
            </p>
          </div>
        </div>

        {/* Critical Challenges Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-400" />
              Primary Ecological & Environmental Bottlenecks
            </h4>
            <span className="text-[11px] font-extrabold text-slate-400">Target: PM2.5 &lt; 40 µg/m³</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Indo-Gangetic Air Smog (#3 Polluted):</strong> Requires regional agricultural biomass crop residue management.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Groundwater Stress (#13 Most Stressed):</strong> Urgent need for micro-irrigation in Punjab, Haryana, and Rajasthan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Grid Battery Storage Scaling:</strong> Energy storage system (ESS) subsidies needed to manage 500 GW solar intermittency.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Extreme Weather Resilience:</strong> Urban storm drainage and heatwave protection for outdoor workers.</span>
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
