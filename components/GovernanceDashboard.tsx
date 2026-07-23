'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Award,
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
  BarChart2,
  Scale,
  Landmark,
  FileText,
  Eye,
  Lock,
} from 'lucide-react';
import { Indicator } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { ThreeDChart } from './ThreeDChart';

interface GovernanceDashboardProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onToggleWatchlist?: (id: string) => void;
  watchlistIds?: string[];
}

export const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
  onToggleWatchlist,
  watchlistIds = [],
}) => {
  // Get all Governance category indicators
  const governanceIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => ind.category === 'Governance');
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedChartIndicatorId, setSelectedChartIndicatorId] = useState<string>('corruption-perceptions-index');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');

  // Filtered indicators
  const filteredIndicators = useMemo(() => {
    return governanceIndicators.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.source.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrend =
        selectedTrend === 'all' || ind.trend === selectedTrend;

      let matchesSubtype = true;
      if (selectedSubtype === 'integrity') {
        matchesSubtype =
          ind.id.includes('corruption') ||
          ind.id.includes('rule-of-law') ||
          ind.id.includes('open-budget');
      } else if (selectedSubtype === 'democracy') {
        matchesSubtype =
          ind.id.includes('democracy') ||
          ind.id.includes('press-freedom') ||
          ind.id.includes('voice-and-accountability');
      } else if (selectedSubtype === 'wgi') {
        matchesSubtype =
          ind.id.includes('government-effectiveness') ||
          ind.id.includes('political-stability') ||
          ind.id.includes('regulatory-quality');
      }

      return matchesSearch && matchesTrend && matchesSubtype;
    });
  }, [governanceIndicators, searchQuery, selectedSubtype, selectedTrend]);

  // Active chart indicator
  const activeChartIndicator = useMemo(() => {
    return (
      governanceIndicators.find((ind) => ind.id === selectedChartIndicatorId) ||
      governanceIndicators[0]
    );
  }, [governanceIndicators, selectedChartIndicatorId]);

  // Format 3D Chart Data
  const threeDChartData = useMemo(() => {
    if (!activeChartIndicator) return [];

    if (chartMode === 'bar') {
      return activeChartIndicator.countryComparison.map((item) => ({
        label: item.code,
        value: typeof item.value === 'number' ? item.value : parseFloat(item.value) || 50,
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

  // Export CSV
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
    const rows = governanceIndicators.map((ind) => [
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
    link.setAttribute('download', `India_Global_Index_Governance_Category_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl shadow-slate-950/20 border border-slate-800">
        {/* Animated 3D Light Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-400/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold uppercase tracking-wider border border-indigo-400/30 flex items-center gap-1.5 backdrop-blur-md">
                <Landmark className="w-3.5 h-3.5 text-indigo-300" />
                <span>Governance & Institutional Quality Intelligence Center</span>
              </span>
              <span className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                9 Benchmark Metrics
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              India Governance, Rule of Law & Institutional Reform Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Deep analytics across World Bank Worldwide Governance Indicators (WGI), Democracy Index (#41), Corruption Perceptions Index, Government Effectiveness (#57), Regulatory Quality, and Fiscal Transparency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAiAssistant(
                  'Provide a comprehensive governance evaluation of India’s World Bank WGI scores, Government Effectiveness rise, and Rule of Law reforms.'
                )
              }
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Ask Gemini AI Governance Analyst</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 backdrop-blur-md flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-sky-300" />
              <span>Export Governance CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Callouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Government Effectiveness</span>
              <Building className="w-3.5 h-3.5 text-sky-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">#57</div>
            <div className="text-[11px] text-sky-300 font-bold">66.2 Percentile</div>
            <div className="text-[10px] text-slate-300">World Bank WGI</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>EIU Democracy Index</span>
              <Landmark className="w-3.5 h-3.5 text-indigo-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">#41</div>
            <div className="text-[11px] text-indigo-300 font-bold">7.18 / 10 Score</div>
            <div className="text-[10px] text-slate-300">Economist Intelligence Unit</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Regulatory Quality</span>
              <Scale className="w-3.5 h-3.5 text-teal-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">#68</div>
            <div className="text-[11px] text-teal-300 font-bold">58.4 Percentile</div>
            <div className="text-[10px] text-slate-300">World Bank Database</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1"
          >
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Open Budget Index</span>
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">51 / 100</div>
            <div className="text-[11px] text-emerald-300 font-bold">Rank #53 Globally</div>
            <div className="text-[10px] text-slate-300">IBP Fiscal Survey</div>
          </motion.div>
        </div>
      </div>

      {/* 2. Interactive React Three Fiber 3D Chart Canvas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <span>3D WebGL Governance Trend Studio</span>
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
              className="px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {governanceIndicators.map((ind) => (
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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Bar Comparison
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

        {/* 3D R3F Canvas Chart */}
        <ThreeDChart
          data={threeDChartData}
          chartType={chartMode}
          title={`${activeChartIndicator.name} — ${
            chartMode === 'bar' ? 'Global Country Comparison' : 'India 10-Year Trajectory'
          }`}
          subtitle={`Source: ${activeChartIndicator.source.organization} (${activeChartIndicator.source.lastUpdatedYear})`}
          accentColor="#4f46e5"
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
            placeholder="Search Governance metrics..."
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
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            All 9 Governance Topics
          </button>
          <button
            onClick={() => setSelectedSubtype('integrity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'integrity'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            Integrity & Rule of Law
          </button>
          <button
            onClick={() => setSelectedSubtype('democracy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'democracy'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            Democracy & Freedoms
          </button>
          <button
            onClick={() => setSelectedSubtype('wgi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubtype === 'wgi'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            World Bank WGI
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

      {/* 4. Grid for all 9 Governance Metrics */}
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
                {/* Accent top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />

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

                  {/* Glass Stat Block */}
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
                        Latest Score
                      </div>
                      <div className="text-sm font-black text-indigo-600">
                        {indicator.latestIndiaValue}
                      </div>
                    </div>
                  </div>

                  {/* Trajectory Delta & Citation */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <span className="text-slate-500">Trajectory Delta:</span>
                      <span className="text-indigo-600 font-bold">{indicator.changeDelta}</span>
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

      {/* 5. Institutional SWOT Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">
              Governance Reforms & Digital State Capacity Multipliers
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">World-Class Direct Benefit Transfers (DBT):</strong>
                Eliminated over $35 Billion in corruption leakages across welfare distribution via Aadhaar-linked digital rails.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Government Effectiveness Jump (#57):</strong>
                Mission Karamyogi civil services training and PM Gati Shakti multi-agency coordination streamlined infrastructure execution.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Massive Deregulation Drive:</strong>
                Scrapped over 40,000 archaic business compliances under Jan Vishwas Act and National Single Window System.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">
              Institutional Bottlenecks & Judicial Reform Priorities
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Judicial Trial Delay Backlog (&gt;45 Million Cases):</strong>
                Constrains Rule of Law Index score and contract enforcement speed for international commerce.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Corruption Perceptions Score Deficit (CPI #93):</strong>
                Requires municipal-level licensing digitization and state-level administrative transparency.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Political Finance Disclosure:</strong>
                Scrutiny surrounding campaign funding transparency and district-level administrative enforcement.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 6. Gemini AI Governance Prompts */}
      <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-teal-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
          <h3 className="text-sm font-black text-slate-900">
            Gemini AI Specialized Governance Reform Prompts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() =>
              onOpenAiAssistant(
                'How can India elevate its Government Effectiveness Index score from 66th percentile into the top 30 globally by 2030?'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Government Effectiveness Top 30 Plan</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Propose an E-Courts and digital dispute resolution roadmap to clear India’s 45 million court case backlog and improve Rule of Law scores.'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Judicial Reforms & E-Courts Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'Analyze the impact of Jan Vishwas deregulation act on India’s Regulatory Quality Index score.'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Jan Vishwas Deregulation Impact</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>

          <button
            onClick={() =>
              onOpenAiAssistant(
                'How can India improve its Open Budget Index score from 51/100 through pre-budget public consultation and state-level disclosures?'
              )
            }
            className="p-3.5 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-200 text-left text-xs font-bold text-slate-800 transition-all group shadow-sm flex flex-col justify-between space-y-2"
          >
            <span>Open Budget Fiscal Transparency Strategy</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white self-end" />
          </button>
        </div>
      </div>
    </div>
  );
};
