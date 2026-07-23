'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Heart,
  Smile,
  Globe2,
  TrendingUp,
  Sparkles,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Award,
  BarChart2,
  Layers,
  Zap,
  MapPin,
  Scale,
  Compass,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface SocietyDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onToggleWatchlist?: (id: string) => void;
  watchlistIds?: string[];
}

export const SocietyDashboard: React.FC<SocietyDashboardProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds = [],
}) => {
  // Get all Society category indicators
  const societyIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Society');
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] = useState<string>('human-development-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');

  // Format 3D Chart Data
  const threeDChartData = useMemo(() => {
    const activeInd =
      societyIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      societyIndicators[0];
    if (!activeInd) return [];

    if (chartMode === 'bar') {
      return activeInd.countryComparison.map((item) => ({
        label: item.code,
        value: typeof item.value === 'number' ? item.value : parseFloat(item.value) || 50,
        formattedValue: item.formattedValue,
        isHighlight: item.code === 'IND',
      }));
    } else {
      return activeInd.historicalData.map((item) => ({
        label: String(item.year),
        value: item.india,
        formattedValue: `India Value/Rank: ${item.india}`,
        isHighlight: item.year === 2025,
      }));
    }
  }, [societyIndicators, selectedChartIndicatorId, chartMode]);

  // Filtered indicators based on search and sub-types
  const filteredIndicators = useMemo(() => {
    return societyIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.source.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' || ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'wellbeing') {
        matchesSubtype =
          ind.id.includes('human-development') ||
          ind.id.includes('happiness') ||
          ind.id.includes('social-progress') ||
          ind.id.includes('quality-of-life');
      } else if (selectedSubtype === 'capital') {
        matchesSubtype =
          ind.id.includes('human-capital') ||
          ind.id.includes('poverty') ||
          ind.id.includes('cost-of-living');
      } else if (selectedSubtype === 'demographics') {
        matchesSubtype =
          ind.id.includes('population') || ind.id.includes('urbanization');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [societyIndicators, searchQuery, selectedSubtype, selectedTrend]);

  // Active chart indicator
  const activeChartIndicator = useMemo(() => {
    return (
      societyIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      societyIndicators[0]
    );
  }, [societyIndicators, selectedChartIndicatorId]);

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Indicator Name',
      'India Rank',
      'India Value',
      'Previous Rank',
      'Trend',
      'Change Delta',
      'Source Organization',
      'Dataset URL',
    ];
    const rows = societyIndicators.map((ind) => [
      `"${ind.id}"`,
      `"${ind.name}"`,
      `"#${ind.latestIndiaRank}"`,
      `"${ind.latestIndiaValue}"`,
      `"${ind.previousIndiaRank ? '#' + ind.previousIndiaRank : 'N/A'}"`,
      `"${ind.trend}"`,
      `"${ind.changeDelta}"`,
      `"${ind.source.organization}"`,
      `"${ind.source.url}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `India_Global_Index_Society_Category_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* 1. Light 3D Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-950 p-6 sm:p-10 text-white shadow-2xl shadow-indigo-900/20 border border-indigo-700/50">
        {/* Animated 3D Light Orbs in Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-sky-400/30 to-teal-400/10 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500/30 to-violet-400/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold uppercase tracking-wider border border-sky-300/30 flex items-center gap-1.5 backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-sky-300" />
                <span>Society & Human Wellbeing Command Center</span>
              </span>
              <span className="text-xs text-indigo-200 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                9 Benchmark Metrics
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              India Social Progress, Well-Being & Human Capital Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
              Real-time analytics on India’s Human Development Index (0.644), 248 Million Multidimensional Poverty reduction, 1.43 Billion demographic transition, cost of living, and urban expansion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Provide an executive societal analysis of India’s Human Development Index (HDI), Multidimensional Poverty drop to 11.28%, and human capital development roadmap.'
                )
              }
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Ask Gemini AI Social Analyst</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 backdrop-blur-md flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-sky-300" />
              <span>Export Society CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Callouts with 3D Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-indigo-700/60">
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-indigo-200 flex items-center justify-between">
              <span>Human Dev Index (HDI)</span>
              <Heart className="w-3.5 h-3.5 text-teal-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">0.644</div>
            <div className="text-[11px] text-teal-300 font-bold">Rank #134 / 193</div>
            <div className="text-[10px] text-indigo-200">UNDP Medium HD Category</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-indigo-200 flex items-center justify-between">
              <span>Multidimensional Poverty</span>
              <Award className="w-3.5 h-3.5 text-sky-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">11.28%</div>
            <div className="text-[11px] text-sky-300 font-bold">248M Lifted Out</div>
            <div className="text-[10px] text-indigo-200">NITI Aayog & UNDP MPI</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-indigo-200 flex items-center justify-between">
              <span>Cost of Living Index</span>
              <Scale className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">24.2 / 100</div>
            <div className="text-[11px] text-emerald-300 font-bold">#138 / 140 (Affordable)</div>
            <div className="text-[10px] text-indigo-200">Numbeo Global Index</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-indigo-200 flex items-center justify-between">
              <span>Urbanization Rate</span>
              <Building className="w-3.5 h-3.5 text-teal-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">36.4%</div>
            <div className="text-[11px] text-teal-300 font-bold">Urban Shift (+2.4%)</div>
            <div className="text-[10px] text-indigo-200">World Bank Database</div>
          </motion.div>
        </div>
      </div>

      {/* 2. Interactive React Three Fiber 3D Chart Canvas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-sky-500" />
              <span>3D WebGL Society Trend Studio</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive 3D Visualizer: {activeChartIndicator.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Selector */}
            <select
              value={selectedChartIndicatorId}
              onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {societyIndicators.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name} (#{ind.latestIndiaRank})
                </option>
              ))}
            </select>

            {/* Bar vs Line Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setChartMode('bar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'bar'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Comparison
              </button>
              <button
                onClick={() => setChartMode('line')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'line'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Line Trajectory
              </button>
            </div>
          </div>
        </div>

        {/* 3D R3F Canvas Chart */}
        <ThreeDChart
          data={threeDChartData}
          chartType={chartMode}
          title={`${activeChartIndicator.name} — ${
            chartMode === 'bar' ? 'Global Country Benchmarking' : 'India 10-Year Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator.source.organization} (${activeChartIndicator.source.lastUpdatedYear})`}
          accentColor="#0284c7"
          height={380}
        />
      </div>

      {/* 3. Search & Subtype Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Society indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
          />
        </div>

        {/* Subtype Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedSubtype('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            All 9 Metrics
          </button>
          <button
            onClick={() => setSelectedSubtype('wellbeing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'wellbeing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            Human Dev & Wellbeing
          </button>
          <button
            onClick={() => setSelectedSubtype('capital')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'capital'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            Poverty & Capital
          </button>
          <button
            onClick={() => setSelectedSubtype('demographics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'demographics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            Demographics & Urban
          </button>
        </div>

        {/* Trend Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Trends</option>
            <option value="improving">Improving Trend</option>
            <option value="stable">Stable Trend</option>
            <option value="declining">Declining Trend</option>
          </select>
        </div>
      </div>

      {/* 3. 3D Animated Cards Grid for all 9 Society Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredIndicators.map((indicator, index) => {
            const isWatchlisted = watchlistIds.includes(indicator.id);

            return (
              <motion.div
                key={indicator.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  y: -6,
                  rotateX: 2,
                  rotateY: -2,
                  scale: 1.01,
                  transition: { duration: 0.2 },
                }}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl shadow-slate-200/60 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Subtle top gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {indicator.unit}
                        </span>
                        {indicator.trend === 'improving' && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Improving</span>
                          </span>
                        )}
                        {indicator.trend === 'declining' && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>Declining</span>
                          </span>
                        )}
                        {indicator.trend === 'stable' && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-200">
                            <Minus className="w-3 h-3" />
                            <span>Stable</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors pt-1">
                        {indicator.name}
                      </h3>
                    </div>

                    {onToggleWatchlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(indicator.id);
                        }}
                        className={`p-2 rounded-xl transition-colors ${
                          isWatchlisted
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title={isWatchlisted ? 'Remove Bookmark' : 'Bookmark Metric'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {indicator.description}
                  </p>

                  {/* 3D Glass Stat Block */}
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 p-3.5 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2 shadow-inner">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
                        India Rank
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        #{indicator.latestIndiaRank}{' '}
                        <span className="text-[10px] font-normal text-slate-400">
                          / {indicator.totalCountriesMeasured}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
                        Latest Value
                      </div>
                      <div className="text-sm font-black text-indigo-600">
                        {indicator.latestIndiaValue}
                      </div>
                    </div>
                  </div>

                  {/* Change Delta & Citation */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <span className="text-slate-500">Trajectory Delta:</span>
                      <span className="text-teal-600 font-bold">{indicator.changeDelta}</span>
                    </div>

                    <a
                      href={indicator.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                      <span>Source: {indicator.source.organization}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onSelectIndicator(indicator)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25"
                  >
                    <span>Metric Deep Dive</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 4. 10-Year Trajectory & Multi-Country Benchmark Studio */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-sky-500" />
              <span>Interactive Societal Trajectory Studio</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              10-Year Social & Demographic Trajectory Benchmarking
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Switcher */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">
                Select Society Metric:
              </label>
              <select
                value={selectedChartIndicatorId}
                onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
                className="px-3 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {societyIndicators.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name} (#{ind.latestIndiaRank})
                  </option>
                ))}
              </select>
            </div>

            {/* Country Compare */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">
                Compare Benchmark:
              </label>
              <select
                value={comparisonCountry}
                onChange={(e) => setComparisonCountry(e.target.value)}
                className="px-3 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="china">China (CHN)</option>
                <option value="usa">United States (USA)</option>
                <option value="germany">Germany (DEU)</option>
                <option value="japan">Japan (JPN)</option>
                <option value="vietnam">Vietnam (VNM)</option>
                <option value="brazil">Brazil (BRA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected Indicator Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Summary Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                {activeChartIndicator.category} Metric Overview
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {activeChartIndicator.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeChartIndicator.whyItMatters}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-100/80 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-500" />
                <span>Key Reform Policies & Catalysts</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeChartIndicator.keyDriversAndPolicies.slice(0, 3).map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Comparison Matrix Table */}
          <div className="lg:col-span-2 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold border-b border-slate-200 pb-2">
              <span>Country Benchmark Evaluation</span>
              <span>Metric Value / Rank</span>
            </div>

            <div className="space-y-2.5">
              {activeChartIndicator.countryComparison.map((country) => {
                const isIndia = country.code === 'IND';

                return (
                  <motion.div
                    key={country.code}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isIndia
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          isIndia
                            ? 'bg-white text-indigo-600'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {country.code}
                      </div>

                      <div>
                        <div
                          className={`text-xs font-black ${
                            isIndia ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {country.name}
                        </div>
                        <div
                          className={`text-[10px] ${
                            isIndia ? 'text-indigo-100' : 'text-slate-400'
                          }`}
                        >
                          {country.rank ? `Global Rank: #${country.rank}` : 'Value comparison'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-black ${
                          isIndia ? 'text-sky-200' : 'text-indigo-600'
                        }`}
                      >
                        {country.formattedValue}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Societal SWOT & Structural Transformation Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">
              India Societal Strengths & Welfare Multipliers
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Fastest Poverty Eradication Rate:</strong>
                248 Million citizens moved out of multidimensional poverty via direct housing, sanitation, electricity, and clean fuel transfers.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">World-Leading Cost of Living Advantage:</strong>
                Local living cost index at 24.2/100 ensures high domestic purchasing power for food staples, healthcare, and services.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Optimal Demographic Dividend Window:</strong>
                Median age of 28.4 years provides a 30-year productive window before population aging dynamics set in.
              </div>
            </li>
          </ul>
        </div>

        {/* Structural Challenges */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">
              Human Capital & Quality of Life Bottlenecks
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Human Capital Score Deficit (HCI 0.49):</strong>
                Requires accelerated investments in early childhood nutrition and foundational learning to match East Asian standards (~0.70+).
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Rapid Urbanization Infrastructure Pressure:</strong>
                36.4% urban transition requires Tier-2 & Tier-3 smart city drainage, mass transit, and affordable housing expansion.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Air Quality & Commute Friction in Metros:</strong>
                Indo-Gangetic winter smog and urban traffic delays constrain subjective Quality of Life Index scores.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 6. Gemini AI Quick Policy Analyst Prompts */}
      <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-teal-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
          <h3 className="text-sm font-black text-slate-900">
            Gemini AI Specialized Societal Policy Simulation Prompts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() =>
              onOpenAiAssistant(
                'How can India accelerate its Human Development Index (HDI) score from 0.644 to above 0.750 by 2035?'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>HDI Acceleration Strategy to 0.750</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Analyze the impact of NITI Aayog Multidimensional Poverty Index reductions on child health and education outcomes.'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Multidimensional Poverty Drop Impact</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Evaluate India’s Human Capital Index (HCI 0.49) versus Vietnam (0.69) and recommend NEP 2020 action points.'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Human Capital Gap vs Vietnam Analysis</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'How can Smart Cities Mission and RRTS transit corridors boost Urbanization Rate productivity across Tier-2 cities?'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Tier-2 Urbanization Productivity Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>
        </div>
      </div>
    </div>
  );
};
