'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Users,
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
  Briefcase,
  Globe2,
  Heart,
  DollarSign,
  Building2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface EqualityDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (query: string) => void;
  onToggleWatchlist: (id: string) => void;
  watchlistIds: string[];
}

export function EqualityDashboard({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds,
}: EqualityDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] =
    useState<string>('global-gender-gap-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [activeModalIndicator, setActiveModalIndicator] =
    useState<Indicator | null>(null);

  // Filter all Equality Indicators
  const equalityIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Equality');
  }, []);

  const activeChartIndicator = useMemo(() => {
    return (
      equalityIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      equalityIndicators[0]
    );
  }, [equalityIndicators, selectedChartIndicatorId]);

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
    return equalityIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' ? true : ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'gender') {
        matchesSubtype =
          ind.id.includes('gender-gap') || ind.id.includes('inequality');
      } else if (selectedSubtype === 'labor') {
        matchesSubtype =
          ind.id.includes('labour') || ind.id.includes('economic');
      } else if (selectedSubtype === 'income') {
        matchesSubtype = ind.id.includes('gini') || ind.id.includes('equal-pay');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [equalityIndicators, searchQuery, selectedTrend, selectedSubtype]);

  const genderGapIndicator = equalityIndicators.find(
    (i) => i.id === 'global-gender-gap-index'
  );
  const giiIndicator = equalityIndicators.find(
    (i) => i.id === 'gender-inequality-index'
  );
  const giniIndicator = equalityIndicators.find(
    (i) => i.id === 'gini-coefficient'
  );
  const flfpIndicator = equalityIndicators.find(
    (i) => i.id === 'female-labour-force-participation'
  );

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Executive Header Banner */}
      <motion.div
        layoutId="category-card-Equality"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 p-6 md:p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-orange-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              layoutId="category-icon-Equality"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-widest"
            >
              <Scale className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Gender Parity & Social Equity Framework</span>
            </motion.div>
            <motion.h1
              layoutId="category-title-Equality"
              className="text-2xl md:text-4xl font-black text-white tracking-tight"
            >
              India Equality, Gender Parity & Wealth Distribution Matrix
            </motion.h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Real-time analytics tracking 6 core equality benchmarks: Global Gender Gap Index (64.1% parity closed), Gender Inequality Index (#108), Gini Wealth Coefficient (32.8 points), Female Labour Force Participation (37.0% FLFP), and 3D WebGL trajectory visualizers.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Provide a comprehensive strategic briefing on India’s progress in gender parity, female labor force participation growth (PLFS 37%), Nari Shakti Vandan Adhiniyam 33% reservation bill, and income inequality reduction.'
                )
              }
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Parity Briefing</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Global Gender Gap</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">
              #{genderGapIndicator?.latestIndiaRank || 129}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              64.1% Parity (+6 spots)
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Gender Inequality (GII)</span>
              <Heart className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              #{giiIndicator?.latestIndiaRank || 108}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">
              Up 14 places (0.437 Score)
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Gini Inequality Index</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {giniIndicator?.latestIndiaValue || '32.8 Points'}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1">
              -1.4 pts lower inequality
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Female Labour Force</span>
              <Briefcase className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {flfpIndicator?.latestIndiaValue || '37.0% FLFP'}
            </div>
            <div className="text-[11px] text-amber-300 font-medium mt-1">
              +14% surge over 6 years
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive WebGL 3D Equality Chart Studio */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-amber-500" />
              <span>3D WebGL Equality Visualizer Studio</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive 3D Equity Metric: {activeChartIndicator?.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Indicator Select Dropdown */}
            <select
              value={selectedChartIndicatorId}
              onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {equalityIndicators.map((ind) => (
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
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Benchmarking
              </button>
              <button
                onClick={() => setChartMode('line')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'line'
                    ? 'bg-amber-600 text-white shadow-sm'
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
          accentColor="#a855f7"
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
            placeholder="Search equality & gender parity metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Subtype Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedSubtype('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 6 Equity Metrics
          </button>
          <button
            onClick={() => setSelectedSubtype('gender')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'gender'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Gender & Parity
          </button>
          <button
            onClick={() => setSelectedSubtype('labor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'labor'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Labor & Opportunity
          </button>
          <button
            onClick={() => setSelectedSubtype('income')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'income'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Income & Equal Pay
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

      {/* 4. Indicator Grid (6 Equality Metrics) */}
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
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500/60 p-5 shadow-sm hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header & Watchlist */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200/60">
                        {indicator.unit} Metric
                      </span>
                      {(indicator.isCritical || indicator.isFluctuating || indicator.latestIndiaRank > 100) && (
                        <motion.span
                          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-400/40 text-rose-700 text-[10px] font-black uppercase"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span>{indicator.isFluctuating ? '⚡ Fluctuation' : '🔥 Priority Gap'}</span>
                        </motion.span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
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
                    <div className="text-lg font-black text-amber-600 mt-0.5">
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
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
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

      {/* 5. National Equality & Women Empowerment Action Strategy Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-500" />
              <span>National Social Parity & Women Empowerment Pillars</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              Gender Equality, Wealth Redistribution & Workplace Inclusion
            </h2>
          </div>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Detail India’s national gender equality policy reforms: Nari Shakti Vandan Adhiniyam 33% parliamentary seats reservation, Lakhpati Didi rural SHG empowerment, Code on Wages 2019 equal pay mandates, and MUDRA collateral-free credit.'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Generate Parity Action Brief</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              1. Nari Shakti Legislative Reservation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Constitutional amendment guaranteeing 33% reservation for women in Lok Sabha and State Assemblies, driving political empowerment parity (#59 globally).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800 font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              2. Lakhpati Didi & SHG Micro-Credit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowering 10 Million rural Self Help Group women with formal bank accounts, digital financial literacy, and collateral-free enterprise loans under MUDRA.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              3. Code on Wages & Equal Remuneration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict statutory prohibition against gender discrimination in recruitment and wages, paired with 26-week paid maternity leave enforcement in corporate centers.
            </p>
          </div>
        </div>

        {/* Critical Challenges Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Key Equality & Female Inclusion Bottlenecks
            </h4>
            <span className="text-[11px] font-extrabold text-slate-400">
              Target: 50% FLFP by 2035
            </span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>
                <strong>Urban FLFP Stagnation:</strong> Urban female labor participation remains low (~25%) due to caregiving responsibilities and commuting safety concerns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>
                <strong>Unpaid Care Economy Burden:</strong> Indian women perform 7x more unpaid domestic care work than men, constraining career progression.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>
                <strong>Informal Sector Wage Gap:</strong> 20-25% gender pay gap in construction and unorganized manual agricultural labor.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>
                <strong>Corporate Boardroom Pipeline:</strong> Only ~18% representation of women in senior executive and C-suite decision-making positions.
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
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800">
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

                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="text-[10px] font-bold text-amber-700 uppercase">
                      Global Rank
                    </div>
                    <div className="text-lg font-black text-amber-800 mt-0.5">
                      #{activeModalIndicator.latestIndiaRank}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Trend Delta
                    </div>
                    <div className="text-sm font-extrabold text-amber-700 mt-1">
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
                    className="inline-flex items-center gap-1 text-amber-700 font-bold hover:underline"
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
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-700 text-white text-xs font-black transition-all"
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
