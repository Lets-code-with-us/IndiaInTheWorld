'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Building2,
  Sparkles,
  Globe,
  Percent,
  ShieldCheck,
  Layers,
  ExternalLink,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ChevronRight,
  SlidersHorizontal,
  Bookmark,
  Briefcase,
  Factory,
  Ship,
  TrendingDown,
  Info,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface EconomyDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onToggleWatchlist?: (id: string) => void;
  watchlistIds?: string[];
}

export const EconomyDashboard: React.FC<EconomyDashboardProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds = [],
}) => {
  // Filter all indicators belonging to Economy
  const economyIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Economy');
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] = useState<string>('gdp-growth-rate');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [comparisonCountry, setComparisonCountry] = useState<string>('china');

  // Format 3D Chart Data
  const threeDChartData = useMemo(() => {
    const activeInd =
      economyIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      economyIndicators[0];
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
  }, [economyIndicators, selectedChartIndicatorId, chartMode]);

  // Filtered indicators based on search and sub-types
  const filteredIndicators = useMemo(() => {
    return economyIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.source.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' || ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'gdp') {
        matchesSubtype = ind.id.includes('gdp');
      } else if (selectedSubtype === 'fiscal') {
        matchesSubtype = ind.id.includes('inflation') || ind.id.includes('unemployment') || ind.id.includes('public-debt');
      } else if (selectedSubtype === 'trade') {
        matchesSubtype = ind.id.includes('competitiveness') || ind.id.includes('freedom') || ind.id.includes('fdi') || ind.id.includes('logistics') || ind.id.includes('ease');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [economyIndicators, searchQuery, selectedSubtype, selectedTrend]);

  // Currently selected chart indicator
  const activeChartIndicator = useMemo(() => {
    return economyIndicators.find((ind) => ind.id === selectedChartIndicatorId) || economyIndicators[0];
  }, [economyIndicators, selectedChartIndicatorId]);

  // CSV Export for Economy Category
  const handleExportCsv = () => {
    const headers = ['ID', 'Indicator Name', 'India Rank', 'India Value', 'Previous Rank', 'Trend', 'Change Delta', 'Source Organization', 'Dataset URL'];
    const rows = economyIndicators.map((ind) => [
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `India_Global_Index_Economy_Category_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Executive Macro Banner */}
      <motion.div
        layoutId="category-card-Economy"
        className="bg-[#3C2F2F] text-white rounded-3xl p-6 sm:p-8 border border-[#52433A] shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <motion.span
                layoutId="category-icon-Economy"
                className="px-3 py-1 rounded-full bg-[#F7882F]/20 text-[#F7C331] text-xs font-bold uppercase tracking-wider border border-[#F7882F]/30 flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Macroeconomy & Trade Category Dashboard</span>
              </motion.span>
              <motion.span
                layoutId="category-badge-Economy"
                className="text-xs text-[#E8D9C8] bg-[#4A3E3D] px-2.5 py-1 rounded-full border border-[#52433A]"
              >
                13 Benchmark Metrics
              </motion.span>
            </div>

            <motion.h1
              layoutId="category-title-Economy"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
            >
              India Economy & Global Competitiveness Command Center
            </motion.h1>

            <p className="text-xs sm:text-sm text-[#E8D9C8] leading-relaxed">
              Real-time executive policy intelligence across India&apos;s $3.93 Trillion nominal GDP, $14.2 Trillion PPP market scale, inflation stability, logistics modernization, and global FDI capital inflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAiAssistant('Provide an executive macroeconomic report on India’s $3.93T economy, 6.8% GDP growth rate, and key structural reform requirements.')}
              className="px-4 py-2.5 rounded-xl bg-[#F7882F] hover:bg-[#E0731E] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F7C331]" />
              <span>Ask Gemini AI Macro Analyst</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-[#4A3E3D] hover:bg-[#52433A] text-[#E8D9C8] text-xs font-semibold transition-all border border-[#52433A] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Economy Dataset (CSV)</span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metric Callout Highlight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#52433A]">
          <div className="bg-[#4A3E3D]/80 p-4 rounded-2xl border border-[#52433A] space-y-1">
            <div className="text-[11px] font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>Nominal GDP Rank</span>
              <DollarSign className="w-3.5 h-3.5 text-[#F7C331]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">#5 Globally</div>
            <div className="text-[11px] text-[#F7C331] font-medium">$3.93 Trillion (IMF 2025)</div>
            <div className="text-[10px] text-[#C4B2A5]">+5 places in 10 yrs</div>
          </div>

          <div className="bg-[#4A3E3D]/80 p-4 rounded-2xl border border-[#52433A] space-y-1">
            <div className="text-[11px] font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>GDP (PPP) Scale</span>
              <Globe className="w-3.5 h-3.5 text-[#F7882F]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">#3 Globally</div>
            <div className="text-[11px] text-[#F7C331] font-medium">$14.2 Trillion (ICP)</div>
            <div className="text-[10px] text-[#C4B2A5]">Behind China & USA</div>
          </div>

          <div className="bg-[#4A3E3D]/80 p-4 rounded-2xl border border-[#52433A] space-y-1">
            <div className="text-[11px] font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>Real GDP Growth</span>
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">6.8% Annual</div>
            <div className="text-[11px] text-emerald-300 font-medium">#1 Major Economy ($1T+)</div>
            <div className="text-[10px] text-[#C4B2A5]">Outpacing G20 average</div>
          </div>

          <div className="bg-[#4A3E3D]/80 p-4 rounded-2xl border border-[#52433A] space-y-1">
            <div className="text-[11px] font-semibold text-[#E8D9C8] flex items-center justify-between">
              <span>FDI Capital Inflows</span>
              <Building2 className="w-3.5 h-3.5 text-[#F7C331]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">#8 Globally</div>
            <div className="text-[11px] text-[#F7C331] font-medium">$71 Billion / Year</div>
            <div className="text-[10px] text-[#C4B2A5]">UNCTAD World Investment</div>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive React Three Fiber 3D Chart Canvas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>3D WebGL Economy Trend Studio</span>
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
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {economyIndicators.map((ind) => (
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
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Comparison
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

        {/* 3D R3F Canvas Chart */}
        <ThreeDChart
          data={threeDChartData}
          chartType={chartMode}
          title={`${activeChartIndicator.name} — ${
            chartMode === 'bar' ? 'Global Country Benchmarking' : 'India 10-Year Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator.source.organization} (${activeChartIndicator.source.lastUpdatedYear})`}
          accentColor="#4f46e5"
          height={380}
        />
      </div>

      {/* 3. Interactive Search & Category Filter Controls */}
      <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#DCC7AA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C6C62]" />
          <input
            type="text"
            placeholder="Search Economy indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white text-xs text-[#2C221E] placeholder-[#7C6C62] rounded-xl border border-[#DCC7AA] focus:outline-none focus:ring-2 focus:ring-[#F7882F]/50 transition-all"
          />
        </div>

        {/* Subtype Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setSelectedSubtype('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubtype === 'all'
                ? 'bg-[#3C2F2F] text-[#F7C331] shadow-sm'
                : 'bg-white text-[#7C6C62] hover:bg-[#E8D9C8]/40 border border-[#DCC7AA]'
            }`}
          >
            All 13 Metrics
          </button>
          <button
            onClick={() => setSelectedSubtype('gdp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubtype === 'gdp'
                ? 'bg-[#3C2F2F] text-[#F7C331] shadow-sm'
                : 'bg-white text-[#7C6C62] hover:bg-[#E8D9C8]/40 border border-[#DCC7AA]'
            }`}
          >
            GDP & Output
          </button>
          <button
            onClick={() => setSelectedSubtype('fiscal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubtype === 'fiscal'
                ? 'bg-[#3C2F2F] text-[#F7C331] shadow-sm'
                : 'bg-white text-[#7C6C62] hover:bg-[#E8D9C8]/40 border border-[#DCC7AA]'
            }`}
          >
            Fiscal & Labor
          </button>
          <button
            onClick={() => setSelectedSubtype('trade')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSubtype === 'trade'
                ? 'bg-[#3C2F2F] text-[#F7C331] shadow-sm'
                : 'bg-white text-[#7C6C62] hover:bg-[#E8D9C8]/40 border border-[#DCC7AA]'
            }`}
          >
            Trade & Competitiveness
          </button>
        </div>

        {/* Velocity Trend Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C6C62]" />
          <select
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="px-3 py-1.5 bg-white text-xs font-medium text-[#2C221E] rounded-xl border border-[#DCC7AA] focus:outline-none focus:ring-1 focus:ring-[#F7882F]"
          >
            <option value="all">All Trends</option>
            <option value="improving">Improving Trend</option>
            <option value="stable">Stable Trend</option>
            <option value="declining">Declining Trend</option>
          </select>
        </div>
      </div>

      {/* 3. Indicators Grid (All 13 Requested Economy Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIndicators.map((indicator, idx) => {
          const isWatchlisted = watchlistIds.includes(indicator.id);

          return (
            <motion.div
              key={indicator.id}
              layoutId={`indicator-card-${indicator.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.035 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 border border-[#DCC7AA] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#F7882F] uppercase tracking-wider bg-[#F7882F]/10 px-2 py-0.5 rounded border border-[#F7882F]/20">
                        {indicator.unit} Metric
                      </span>
                      {(indicator.isCritical || indicator.isFluctuating || indicator.latestIndiaRank <= 10) && (
                        <motion.span
                          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F7882F]/10 border border-[#F7882F]/40 text-[#D46917] text-[10px] font-black uppercase"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F7882F] animate-ping" />
                          <span>{indicator.isFluctuating ? '⚡ Shift' : '🔥 Core Economy'}</span>
                        </motion.span>
                      )}
                      {indicator.trend === 'improving' && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Improving</span>
                        </span>
                      )}
                      {indicator.trend === 'declining' && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                          <ArrowDownRight className="w-3 h-3" />
                          <span>Declining</span>
                        </span>
                      )}
                      {indicator.trend === 'stable' && (
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                          <Minus className="w-3 h-3" />
                          <span>Stable</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#2C221E] group-hover:text-[#F7882F] transition-colors">
                      {indicator.name}
                    </h3>
                  </div>

                  {onToggleWatchlist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(indicator.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isWatchlisted
                          ? 'bg-[#F7882F] text-white'
                          : 'text-[#7C6C62] hover:bg-[#FAF6EF]'
                      }`}
                      title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#7C6C62] leading-relaxed line-clamp-2">
                  {indicator.description}
                </p>

                {/* Metric Statistics Block */}
                <div className="bg-[#FAF6EF] p-3 rounded-xl border border-[#DCC7AA] grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] font-semibold text-[#7C6C62] uppercase">India Rank</div>
                    <div className="text-lg font-black text-[#3C2F2F]">
                      #{indicator.latestIndiaRank}{' '}
                      <span className="text-[10px] font-normal text-[#7C6C62]">
                        / {indicator.totalCountriesMeasured}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-[#7C6C62] uppercase">Latest Value</div>
                    <div className="text-sm font-extrabold text-[#F7882F]">
                      {indicator.latestIndiaValue}
                    </div>
                  </div>
                </div>

                {/* Change Delta & Source Citation */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#3C2F2F] flex items-center gap-1">
                    <span>Velocity Delta:</span>
                    <span className="text-[#F7882F] font-bold">{indicator.changeDelta}</span>
                  </div>

                  <a
                    href={indicator.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#7C6C62] hover:text-[#F7882F] transition-colors flex items-center gap-1"
                  >
                    <span>Source: {indicator.source.organization}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCC7AA]/50 flex items-center justify-between">
                <button
                  onClick={() => onSelectIndicator(indicator)}
                  className="w-full py-2 rounded-xl bg-[#3C2F2F] hover:bg-[#4A3E3D] text-[#F7C331] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#52433A]"
                >
                  <span>Indicator Deep Dive</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Multi-Metric Historical Trajectory & Country Comparison Studio */}
      <div className="bg-[#3C2F2F] text-white rounded-3xl p-6 sm:p-8 border border-[#52433A] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#52433A] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#F7C331] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#F7882F]" />
              <span>Comparative Macro Analytics Studio</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              10-Year Macro Economic Trajectory Studio
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#E8D9C8] font-medium block">Select Economy Metric:</label>
              <select
                value={selectedChartIndicatorId}
                onChange={(e) => setSelectedChartIndicatorId(e.target.value)}
                className="px-3 py-1.5 bg-[#4A3E3D] text-xs text-white rounded-xl border border-[#52433A] focus:outline-none focus:ring-1 focus:ring-[#F7882F]"
              >
                {economyIndicators.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name} (#{ind.latestIndiaRank})
                  </option>
                ))}
              </select>
            </div>

            {/* Country Compare Selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#E8D9C8] font-medium block">Compare Benchmark:</label>
              <select
                value={comparisonCountry}
                onChange={(e) => setComparisonCountry(e.target.value)}
                className="px-3 py-1.5 bg-[#4A3E3D] text-xs text-white rounded-xl border border-[#52433A] focus:outline-none focus:ring-1 focus:ring-[#F7882F]"
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

        {/* Selected Chart Details & Country Comparison Bar Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Indicator Summary Card */}
          <div className="bg-[#4A3E3D] p-5 rounded-2xl border border-[#52433A] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#F7C331] uppercase">{activeChartIndicator.category} Indicator</span>
              <h3 className="text-lg font-bold text-white">{activeChartIndicator.name}</h3>
              <p className="text-xs text-[#E8D9C8] leading-relaxed">
                {activeChartIndicator.whyItMatters}
              </p>
            </div>

            <div className="bg-[#3C2F2F] p-4 rounded-xl border border-[#52433A] space-y-2">
              <div className="text-xs font-semibold text-[#F7C331]">Key Reform Drivers</div>
              <ul className="space-y-1 text-xs text-[#E8D9C8]">
                {activeChartIndicator.keyDriversAndPolicies.slice(0, 3).map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F7882F] shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Multi-Country Comparison Ranking Table / Matrix */}
          <div className="lg:col-span-2 bg-[#4A3E3D] p-5 rounded-2xl border border-[#52433A] space-y-4">
            <div className="flex items-center justify-between text-xs text-[#E8D9C8] border-b border-[#52433A] pb-2 font-semibold">
              <span>Country Benchmark Evaluation</span>
              <span>Metric Value / Rank</span>
            </div>

            <div className="space-y-3">
              {activeChartIndicator.countryComparison.map((country) => {
                const isIndia = country.code === 'IND';

                return (
                  <div
                    key={country.code}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isIndia
                        ? 'bg-[#F7882F]/20 border-[#F7882F] text-white shadow-sm'
                        : 'bg-[#3C2F2F] border-[#52433A] text-[#E8D9C8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isIndia ? 'bg-[#F7882F] text-white' : 'bg-[#4A3E3D] text-[#E8D9C8]'
                      }`}>
                        {country.code}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white">{country.name}</div>
                        <div className="text-[10px] text-[#C4B2A5]">
                          {country.rank ? `Global Rank: #${country.rank}` : 'Value comparison'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#F7C331]">
                        {country.formattedValue}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Macroeconomic SWOT & Structural Bottleneck Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DCC7AA] pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-[#2C221E]">
              India Fiscal & Economic Strengths
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-[#7C6C62]">
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C221E] block">Massive Internal Consumption Engine:</strong>
                Domestic private final consumption expenditure accounts for ~60% of total GDP, insulating India from severe external global recessions.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C221E] block">Digital Public Infrastructure (DPI) Efficiency:</strong>
                UPI processing over 13 Billion monthly transactions lowers financial intermediation costs and accelerates informal sector formalization.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C221E] block">Supply Chain Relocation Anchor (China+1):</strong>
                Surge in electronics assembly and semiconductor manufacturing FDI backed by $26 Billion in PLI incentives.
              </div>
            </li>
          </ul>
        </div>

        {/* Structural Bottlenecks */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#DCC7AA] pb-3">
            <AlertCircle className="w-5 h-5 text-[#F7882F]" />
            <h3 className="text-base font-bold text-[#2C221E]">
              Critical Structural Economic Gaps
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-[#7C6C62]">
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
              <AlertCircle className="w-4 h-4 text-[#F7882F] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C221E] block">Per-Capita Income Conversion Deficit (#138):</strong>
                GDP per capita of $2,730 requires accelerated industrial employment to absorb ~44% workforce currently in low-productivity agriculture.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
              <AlertCircle className="w-4 h-4 text-[#F7882F] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C221E] block">Public Debt Burden (81.5% GDP):</strong>
                High interest payment burdens constrain fiscal space for public health, education, and social protection safety nets.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
              <AlertCircle className="w-4 h-4 text-[#F7882F] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2C221E] block">Contract Enforcement & Land Acquisition Timelines:</strong>
                Commercial litigation disposal delays impact long-term corporate capital expenditure momentum.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 6. Gemini AI Quick Policy Analyst Prompts */}
      <div className="bg-[#FAF6EF] p-6 rounded-2xl border border-[#DCC7AA] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F7882F]" />
          <h3 className="text-sm font-bold text-[#2C221E]">
            Gemini AI Specialized Economic Policy Simulation Prompts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenAiAssistant('Simulate India’s path to a $7 Trillion nominal GDP economy by 2030, detailing required capex and labor force participation targets.')}
            className="p-3 bg-white hover:bg-[#E8D9C8]/40 rounded-xl border border-[#DCC7AA] text-left text-xs font-semibold text-[#2C221E] transition-all hover:border-[#F7882F] flex flex-col justify-between space-y-2"
          >
            <span>Simulate $7T GDP Target Path by 2030</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F7882F] self-end" />
          </button>

          <button
            onClick={() => onOpenAiAssistant('Analyze inflation rate versus unemployment rate (Phillips Curve) dynamics in India under RBI monetary policy guidelines.')}
            className="p-3 bg-white hover:bg-[#E8D9C8]/40 rounded-xl border border-[#DCC7AA] text-left text-xs font-semibold text-[#2C221E] transition-all hover:border-[#F7882F] flex flex-col justify-between space-y-2"
          >
            <span>Inflation vs Unemployment Analysis</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F7882F] self-end" />
          </button>

          <button
            onClick={() => onOpenAiAssistant('How can India improve its Logistics Performance Index (LPI) from rank #38 to top 25 using PM Gati Shakti?')}
            className="p-3 bg-white hover:bg-[#E8D9C8]/40 rounded-xl border border-[#DCC7AA] text-left text-xs font-semibold text-[#2C221E] transition-all hover:border-[#F7882F] flex flex-col justify-between space-y-2"
          >
            <span>Logistics Rank Improvement Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F7882F] self-end" />
          </button>

          <button
            onClick={() => onOpenAiAssistant('Evaluate the impact of Production Linked Incentives (PLI) on FDI inflows and high-tech manufacturing export shares.')}
            className="p-3 bg-white hover:bg-[#E8D9C8]/40 rounded-xl border border-[#DCC7AA] text-left text-xs font-semibold text-[#2C221E] transition-all hover:border-[#F7882F] flex flex-col justify-between space-y-2"
          >
            <span>PLI Scheme & FDI Impact Evaluation</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F7882F] self-end" />
          </button>
        </div>
      </div>
    </div>
  );
};
