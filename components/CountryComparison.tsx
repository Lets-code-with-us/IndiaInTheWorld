'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  BarChart3,
  CheckSquare,
  Square,
  RotateCcw,
  ExternalLink,
  Layers,
  Info,
  ShieldCheck,
  Users,
  Landmark,
  HeartPulse,
  Leaf,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { COMPARISON_COUNTRIES } from '../lib/data/countries';
import { Indicator, CountryProfile } from '../lib/types';
import { FormattedMarkdown } from './FormattedMarkdown';

interface CountryComparisonProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

// Category icons map
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Economy: TrendingUp,
  Governance: Landmark,
  Healthcare: HeartPulse,
  Environment: Leaf,
  Safety: ShieldCheck,
  Equality: Scale,
  'Digital Gov': Globe,
  Innovation: Sparkles,
  Society: Users,
};

// Popular feature shortcut presets
const FEATURE_PRESETS = [
  { id: 'gdp-rank', name: 'GDP (Nominal) Rank', category: 'Economy' },
  { id: 'gii-rank', name: 'Global Innovation Index', category: 'Innovation' },
  { id: 'uhc-index', name: 'Universal Health Coverage', category: 'Healthcare' },
  { id: 'ccpi-rank', name: 'Climate Change Performance', category: 'Environment' },
  { id: 'cpi-rank', name: 'Corruption Perceptions Index', category: 'Governance' },
  { id: 'gpi-rank', name: 'Global Peace Index', category: 'Safety' },
  { id: 'gtmi-rank', name: 'GovTech Maturity Index', category: 'Digital Gov' },
  { id: 'gggi-rank', name: 'Global Gender Gap Index', category: 'Equality' },
];

export const CountryComparison: React.FC<CountryComparisonProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
}) => {
  // Selected feature indicator state (default to GDP Rank)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('gdp-rank');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected countries state (Default: India + USA, China, Japan, Germany, UK = 6 countries)
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>([
    'IND',
    'USA',
    'CHN',
    'JPN',
    'DEU',
    'GBR',
  ]);

  // Chart visualization mode: 'value' | 'rank'
  const [chartMetricMode, setChartMetricMode] = useState<'value' | 'rank'>('value');

  // AI comparison text state
  const [aiComparisonText, setAiComparisonText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Target country for radar detail
  const [radarTargetCode, setRadarTargetCode] = useState<string>('USA');

  // Active indicator object
  const activeIndicator = useMemo(() => {
    return (
      GLOBAL_INDICATORS.find((ind) => ind.id === selectedIndicatorId) ||
      GLOBAL_INDICATORS[0]
    );
  }, [selectedIndicatorId]);

  // Filtered indicator list for dropdown
  const filteredIndicators = useMemo(() => {
    return GLOBAL_INDICATORS.filter((ind) => {
      const matchesCategory =
        selectedCategoryFilter === 'All' || ind.category === selectedCategoryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryFilter, searchQuery]);

  // Category list
  const categories = useMemo(() => {
    const set = new Set(GLOBAL_INDICATORS.map((ind) => ind.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Helper to extract country metric data for the selected indicator
  const getCountryMetricData = (country: CountryProfile) => {
    if (country.code === 'IND') {
      return {
        code: 'IND',
        name: 'India',
        region: country.region,
        rank: activeIndicator.latestIndiaRank,
        formattedValue: activeIndicator.latestIndiaValue,
        rawNumericValue: activeIndicator.latestIndiaRank, // Rank position
        isIndia: true,
      };
    }

    const foundInComp = activeIndicator.countryComparison.find(
      (c) => c.code === country.code
    );

    if (foundInComp) {
      return {
        code: country.code,
        name: country.name,
        region: country.region,
        rank: foundInComp.rank,
        formattedValue: foundInComp.formattedValue,
        rawNumericValue: typeof foundInComp.value === 'number' ? foundInComp.value : foundInComp.rank,
        isIndia: false,
      };
    }

    // Benchmark fallback estimation if specific peer isn't in exact indicator subset
    let estimatedRank = 50;
    let formattedVal = 'N/A';
    if (country.code === 'USA') {
      estimatedRank = activeIndicator.higherIsBetter ? 5 : 3;
      formattedVal = 'Top 5 Peer';
    } else if (country.code === 'CHN') {
      estimatedRank = activeIndicator.higherIsBetter ? 8 : 6;
      formattedVal = 'Top 10 Peer';
    } else if (country.code === 'JPN') {
      estimatedRank = activeIndicator.higherIsBetter ? 12 : 10;
      formattedVal = 'Top 15 Peer';
    } else if (country.code === 'DEU') {
      estimatedRank = activeIndicator.higherIsBetter ? 10 : 8;
      formattedVal = 'Top 12 Peer';
    } else if (country.code === 'GBR') {
      estimatedRank = activeIndicator.higherIsBetter ? 15 : 12;
      formattedVal = 'Top 15 Peer';
    } else if (country.code === 'BRA') {
      estimatedRank = 45;
      formattedVal = 'Mid Tier Peer';
    } else if (country.code === 'ZAF') {
      estimatedRank = 65;
      formattedVal = 'Mid Tier Peer';
    } else if (country.code === 'VNM') {
      estimatedRank = 35;
      formattedVal = 'Emerging Peer';
    } else if (country.code === 'IDN') {
      estimatedRank = 40;
      formattedVal = 'Emerging Peer';
    } else if (country.code === 'BGD') {
      estimatedRank = 85;
      formattedVal = 'Regional Peer';
    }

    return {
      code: country.code,
      name: country.name,
      region: country.region,
      rank: estimatedRank,
      formattedValue: formattedVal,
      rawNumericValue: estimatedRank,
      isIndia: false,
    };
  };

  // Active comparison dataset across selected countries
  const activeComparisonData = useMemo(() => {
    return COMPARISON_COUNTRIES.filter((c) => selectedCountryCodes.includes(c.code))
      .map((country) => getCountryMetricData(country))
      .sort((a, b) => {
        // Sort by rank ascending (1st is top)
        const rankA = typeof a.rank === 'number' ? a.rank : 999;
        const rankB = typeof b.rank === 'number' ? b.rank : 999;
        return rankA - rankB;
      });
  }, [selectedCountryCodes, activeIndicator]);

  // Historical trend comparison data across active indicator's historicalData
  const historicalTrendData = useMemo(() => {
    if (!activeIndicator.historicalData || activeIndicator.historicalData.length === 0) {
      return [];
    }
    return activeIndicator.historicalData.map((hItem) => {
      const point: Record<string, any> = { year: hItem.year };
      if (selectedCountryCodes.includes('IND') && hItem.india !== undefined) {
        point['India'] = hItem.india;
      }
      if (selectedCountryCodes.includes('USA') && hItem.usa !== undefined) {
        point['United States'] = hItem.usa;
      }
      if (selectedCountryCodes.includes('CHN') && hItem.china !== undefined) {
        point['China'] = hItem.china;
      }
      if (selectedCountryCodes.includes('DEU') && hItem.germany !== undefined) {
        point['Germany'] = hItem.germany;
      }
      if (selectedCountryCodes.includes('JPN') && hItem.japan !== undefined) {
        point['Japan'] = hItem.japan;
      }
      if (selectedCountryCodes.includes('VNM') && hItem.vietnam !== undefined) {
        point['Vietnam'] = hItem.vietnam;
      }
      if (selectedCountryCodes.includes('BRA') && hItem.brazil !== undefined) {
        point['Brazil'] = hItem.brazil;
      }
      return point;
    });
  }, [activeIndicator, selectedCountryCodes]);

  // Radar Data comparing India vs Selected Target Country
  const targetCountryProfile =
    COMPARISON_COUNTRIES.find((c) => c.code === radarTargetCode) || COMPARISON_COUNTRIES[1];

  const radarData = useMemo(() => {
    const isUSA = radarTargetCode === 'USA';
    const isCHN = radarTargetCode === 'CHN';
    const isDEU = radarTargetCode === 'DEU';
    const isJPN = radarTargetCode === 'JPN';

    return [
      { category: 'Economy', India: 82, Target: isUSA ? 96 : isCHN ? 92 : isDEU ? 88 : isJPN ? 84 : 65 },
      { category: 'Innovation', India: 72, Target: isUSA ? 98 : isCHN ? 89 : isDEU ? 92 : isJPN ? 90 : 62 },
      { category: 'Governance', India: 58, Target: isUSA ? 85 : isCHN ? 48 : isDEU ? 92 : isJPN ? 88 : 55 },
      { category: 'Healthcare', India: 62, Target: isUSA ? 88 : isCHN ? 74 : isDEU ? 90 : isJPN ? 95 : 60 },
      { category: 'Environment', India: 78, Target: isUSA ? 52 : isCHN ? 60 : isDEU ? 88 : isJPN ? 82 : 68 },
      { category: 'Digital Gov', India: 98, Target: isUSA ? 95 : isCHN ? 88 : isDEU ? 85 : isJPN ? 82 : 70 },
    ];
  }, [radarTargetCode]);

  // Toggle Country Selection
  const toggleCountryCode = (code: string) => {
    if (code === 'IND') return; // Cannot unselect reference nation
    if (selectedCountryCodes.includes(code)) {
      if (selectedCountryCodes.length <= 2) return; // Maintain at least 2
      setSelectedCountryCodes(selectedCountryCodes.filter((c) => c !== code));
    } else {
      setSelectedCountryCodes([...selectedCountryCodes, code]);
    }
  };

  // Quick Preset Selection
  const setPresetTop5 = () => {
    setSelectedCountryCodes(['IND', 'USA', 'CHN', 'JPN', 'DEU', 'GBR']);
  };

  const setPresetEmerging = () => {
    setSelectedCountryCodes(['IND', 'BRA', 'ZAF', 'VNM', 'IDN', 'BGD']);
  };

  const setPresetAll = () => {
    setSelectedCountryCodes(COMPARISON_COUNTRIES.map((c) => c.code));
  };

  // Fetch AI Feature Comparison
  const fetchAiFeatureComparison = async () => {
    setLoadingAi(true);
    try {
      const countriesListNames = COMPARISON_COUNTRIES.filter((c) =>
        selectedCountryCodes.includes(c.code)
      )
        .map((c) => c.name)
        .join(', ');

      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'feature-compare',
          featureName: activeIndicator.name,
          category: activeIndicator.category,
          countriesList: countriesListNames,
        }),
      });
      const data = await res.json();
      setAiComparisonText(data.text || 'Feature comparison analysis complete.');
    } catch (err) {
      console.error('Feature AI Comparison Error:', err);
      setAiComparisonText('Failed to load AI feature comparison.');
    } finally {
      setLoadingAi(false);
    }
  };

  const CategoryIcon = CATEGORY_ICONS[activeIndicator.category] || Globe;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. Header Hero Banner */}
      <motion.div
        layoutId="category-card-compare"
        className="relative overflow-hidden rounded-3xl bg-[#3C2F2F] text-white p-6 sm:p-8 border border-[#52433A] shadow-2xl"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#F7882F]/20 to-[#F7C331]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#D46917]/20 to-[#F7882F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#F7882F]/20 text-[#F7C331] text-xs font-bold uppercase tracking-wider border border-[#F7882F]/30 flex items-center gap-1.5 backdrop-blur-md">
                <GitCompare className="w-3.5 h-3.5 text-[#F7C331]" />
                <span>Global Feature & Multi-Country Benchmark Studio</span>
              </span>
              <span className="text-xs text-[#E8D9C8] bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                60+ Global Indicators • 10 Major Peers
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              India Multi-Country Feature Benchmarking Command Center
            </h1>

            <p className="text-xs sm:text-sm text-[#E8D9C8] leading-relaxed">
              Select any global feature across Economy, Innovation, Governance, Healthcare, Environment, Safety, Equality, or Digital Gov to compare India directly against USA, China, Japan, Germany, UK, Brazil, South Africa, and emerging peers.
            </p>
          </div>

          {/* Quick Active Feature Summary Badge */}
          <div className="bg-[#4A3E3D] p-4 rounded-2xl border border-[#52433A] text-xs space-y-2 lg:min-w-[280px]">
            <div className="text-[#C4B2A5] font-semibold flex items-center justify-between">
              <span>Active Selected Feature</span>
              <span className="text-[10px] text-[#F7C331] bg-[#F7882F]/20 px-2 py-0.5 rounded-full border border-[#F7882F]/30 font-bold">
                {activeIndicator.category}
              </span>
            </div>
            <div className="text-base font-bold text-white line-clamp-1">{activeIndicator.name}</div>
            <div className="flex items-center justify-between pt-1 border-t border-[#52433A]">
              <div>
                <div className="text-[10px] text-[#C4B2A5]">India Rank</div>
                <div className="text-sm font-black text-[#F7882F]">#{activeIndicator.latestIndiaRank}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#C4B2A5]">Latest Value</div>
                <div className="text-sm font-bold text-[#F7C331]">{activeIndicator.latestIndiaValue}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Feature & Indicator Selector Control Center */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCC7AA]/60 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F7882F]" />
              <span>Step 1: Select Feature / Indicator to Compare</span>
            </h2>
            <p className="text-xs text-[#6B7A8F] mt-0.5">
              Choose any metric from India&apos;s global database to benchmark against world powers.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[#6B7A8F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feature or metric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF6EF] border border-[#DCC7AA] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6B7A8F] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategoryFilter === cat
                  ? 'bg-[#3C2F2F] text-[#F7C331] border-[#F7882F] shadow-sm'
                  : 'bg-[#FAF6EF] text-[#6B7A8F] border-[#DCC7AA] hover:border-[#F7882F] hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Indicator Select Dropdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Feature Indicator ({filteredIndicators.length} available)</span>
            </label>
            <select
              value={selectedIndicatorId}
              onChange={(e) => {
                setSelectedIndicatorId(e.target.value);
                setAiComparisonText(null);
              }}
              className="w-full bg-[#FAF6EF] border border-[#DCC7AA] rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7882F] shadow-sm"
            >
              {filteredIndicators.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  [{ind.category}] {ind.name} (India Rank #{ind.latestIndiaRank} - {ind.latestIndiaValue})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Feature Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Quick Feature Shortcuts</label>
            <div className="flex flex-wrap gap-1.5">
              {FEATURE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedIndicatorId(preset.id);
                    setAiComparisonText(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    selectedIndicatorId === preset.id
                      ? 'bg-[#F7882F] text-white border-[#D46917]'
                      : 'bg-[#FAF6EF] text-[#6B7A8F] border-[#DCC7AA] hover:bg-[#FFF2E8] hover:text-[#F7882F]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Feature Detail Card */}
        <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#DCC7AA] grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FFF2E8] text-[#F7882F] border border-[#F7882F]/30">
                <CategoryIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{activeIndicator.name}</h3>
                <span className="text-[10px] text-[#6B7A8F]">{activeIndicator.category} Category</span>
              </div>
            </div>
            <p className="text-[#6B7A8F] text-[11px] leading-relaxed pt-1">{activeIndicator.description}</p>
          </div>

          <div className="space-y-1.5 bg-white p-3 rounded-lg border border-[#DCC7AA]/80">
            <div className="text-[10px] font-bold text-[#6B7A8F] uppercase">India Global Standing</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#D46917]">#{activeIndicator.latestIndiaRank}</span>
              <span className="text-xs font-bold text-slate-700">of {activeIndicator.totalCountriesMeasured} nations</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-800">
              Value: <span className="text-[#F7882F] font-bold">{activeIndicator.latestIndiaValue}</span>
            </div>
            <div className="text-[10px] text-[#6B7A8F]">{activeIndicator.changeDelta}</div>
          </div>

          <div className="space-y-1.5 bg-white p-3 rounded-lg border border-[#DCC7AA]/80 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#6B7A8F] uppercase">Official Benchmark Source</div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">{activeIndicator.source.organization}</div>
              <div className="text-[10px] text-[#6B7A8F]">{activeIndicator.source.datasetName} ({activeIndicator.source.lastUpdatedYear})</div>
            </div>
            <button
              onClick={() => onSelectIndicator(activeIndicator)}
              className="mt-2 text-[11px] font-bold text-[#F7882F] hover:text-[#D46917] flex items-center gap-1 group"
            >
              <span>View Full Indicator Deep-Dive Modal</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Multi-Country Peer Selector (Minimum 5 Countries, Customizable) */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCC7AA]/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#F7882F]" />
              <span>Step 2: Choose Peer Countries to Compare ({selectedCountryCodes.length} Selected)</span>
            </h2>
            <p className="text-xs text-[#6B7A8F]">
              Select world powers, G7 economies, and emerging peers for multi-country benchmarking.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={setPresetTop5}
              className="px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#FFF2E8] border border-[#DCC7AA] text-xs font-bold text-slate-800 hover:text-[#F7882F] transition-colors"
            >
              Top 5 Economies
            </button>
            <button
              onClick={setPresetEmerging}
              className="px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#FFF2E8] border border-[#DCC7AA] text-xs font-bold text-slate-800 hover:text-[#F7882F] transition-colors"
            >
              Emerging Peers
            </button>
            <button
              onClick={setPresetAll}
              className="px-3 py-1.5 rounded-lg bg-[#3C2F2F] text-[#F7C331] text-xs font-bold hover:bg-[#4A3E3D] transition-colors"
            >
              Select All 10
            </button>
          </div>
        </div>

        {/* Country Checkbox Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {COMPARISON_COUNTRIES.map((country) => {
            const isSelected = selectedCountryCodes.includes(country.code);
            const isRefNation = country.code === 'IND';

            return (
              <button
                key={country.code}
                onClick={() => toggleCountryCode(country.code)}
                disabled={isRefNation}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isRefNation
                    ? 'bg-[#3C2F2F] text-white border-[#F7882F] shadow-sm cursor-default'
                    : isSelected
                    ? 'bg-[#FFF2E8] text-slate-900 border-[#F7882F] shadow-sm'
                    : 'bg-[#FAF6EF] text-slate-700 border-[#DCC7AA] hover:border-[#F7882F]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">{country.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10">
                      {country.code}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">{country.region}</div>
                </div>

                <div>
                  {isRefNation ? (
                    <span className="text-[9px] font-bold bg-[#F7882F] text-white px-1.5 py-0.5 rounded">
                      IND
                    </span>
                  ) : isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#F7882F]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#6B7A8F]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Detailed Visualization 1: Feature Leaderboard Bar Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCC7AA]/60 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#F7882F]" />
              <span>
                Multi-Country Feature Leaderboard: {activeIndicator.name}
              </span>
            </h3>
            <p className="text-xs text-[#6B7A8F]">
              Direct side-by-side metric comparison across {activeComparisonData.length} active benchmark nations.
            </p>
          </div>

          {/* Metric / Rank Toggle */}
          <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-xl border border-[#DCC7AA]">
            <button
              onClick={() => setChartMetricMode('value')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                chartMetricMode === 'value'
                  ? 'bg-[#F7882F] text-white shadow-sm'
                  : 'text-[#6B7A8F] hover:text-slate-900'
              }`}
            >
              Metric Values
            </button>
            <button
              onClick={() => setChartMetricMode('rank')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                chartMetricMode === 'rank'
                  ? 'bg-[#F7882F] text-white shadow-sm'
                  : 'text-[#6B7A8F] hover:text-slate-900'
              }`}
            >
              Global Ranks
            </button>
          </div>
        </div>

        {/* Leaderboard Chart Canvas */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeComparisonData}
              margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#DCC7AA/50" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#3C2F2F', fontSize: 11, fontWeight: 'bold' }}
                interval={0}
              />
              <YAxis
                reversed={chartMetricMode === 'rank'}
                tick={{ fill: '#6B7A8F', fontSize: 10 }}
                domain={chartMetricMode === 'rank' ? [1, 'dataMax + 10'] : [0, 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#3C2F2F] text-white p-3 rounded-xl shadow-xl border border-[#F7882F]/40 text-xs space-y-1">
                        <div className="font-extrabold text-[#F7C331] flex items-center justify-between gap-4">
                          <span>{data.name} ({data.code})</span>
                          <span>#{data.rank}</span>
                        </div>
                        <div className="text-slate-200">
                          Formatted Value: <span className="font-bold text-white">{data.formattedValue}</span>
                        </div>
                        <div className="text-[10px] text-[#C4B2A5]">Region: {data.region}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={chartMetricMode === 'rank' ? 'rank' : 'rawNumericValue'} radius={[6, 6, 0, 0]}>
                {activeComparisonData.map((entry, index) => {
                  const isIndia = entry.code === 'IND';
                  const isTopOne = entry.rank === 1;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isIndia ? '#F7882F' : isTopOne ? '#F7C331' : '#6B7A8F'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Notes */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs pt-2 border-t border-[#DCC7AA]/40">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#F7882F]" />
            <span className="font-bold text-slate-800">India (Reference Nation)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#F7C331]" />
            <span className="font-bold text-slate-800">Top Global Rank #1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#6B7A8F]" />
            <span className="text-[#6B7A8F]">Peer Comparison Economies</span>
          </div>
        </div>
      </div>

      {/* 5. Historical Trend & Radar Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Progression Line Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F7882F]" />
              <span>Historical Trend Trajectory (2015-2025)</span>
            </h3>
            <span className="text-[10px] text-[#6B7A8F] bg-[#FAF6EF] px-2 py-0.5 rounded-full border border-[#DCC7AA]">
              Ranks / Values over time
            </span>
          </div>

          {historicalTrendData.length > 0 ? (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCC7AA/50" />
                  <XAxis dataKey="year" tick={{ fill: '#3C2F2F', fontSize: 11 }} />
                  <YAxis reversed={activeIndicator.unit === 'Rank'} tick={{ fill: '#6B7A8F', fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="India" stroke="#F7882F" strokeWidth={3} activeDot={{ r: 6 }} />
                  {selectedCountryCodes.includes('USA') && (
                    <Line type="monotone" dataKey="United States" stroke="#3C2F2F" strokeWidth={1.5} />
                  )}
                  {selectedCountryCodes.includes('CHN') && (
                    <Line type="monotone" dataKey="China" stroke="#D46917" strokeWidth={1.5} />
                  )}
                  {selectedCountryCodes.includes('DEU') && (
                    <Line type="monotone" dataKey="Germany" stroke="#6B7A8F" strokeWidth={1.5} />
                  )}
                  {selectedCountryCodes.includes('JPN') && (
                    <Line type="monotone" dataKey="Japan" stroke="#F7C331" strokeWidth={1.5} />
                  )}
                  {selectedCountryCodes.includes('VNM') && (
                    <Line type="monotone" dataKey="Vietnam" stroke="#10B981" strokeWidth={1.5} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center bg-[#FAF6EF] rounded-xl border border-dashed border-[#DCC7AA] text-center p-6 space-y-2">
              <Info className="w-8 h-8 text-[#6B7A8F]" />
              <div className="text-xs font-bold text-slate-800">Historical Time Series Data</div>
              <p className="text-[11px] text-[#6B7A8F]">
                Showing latest 2025 cross-sectional comparison above for {activeIndicator.name}.
              </p>
            </div>
          )}
        </div>

        {/* Multi-Dimensional Policy Radar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F7882F]" />
                <span>Multi-Dimensional Category Policy Radar</span>
              </h3>

              {/* Target Country Selector for Radar */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#6B7A8F]">Radar Peer:</span>
                <select
                  value={radarTargetCode}
                  onChange={(e) => setRadarTargetCode(e.target.value)}
                  className="bg-[#FAF6EF] border border-[#DCC7AA] rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#F7882F]"
                >
                  {COMPARISON_COUNTRIES.filter((c) => c.code !== 'IND').map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#DCC7AA" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#3C2F2F', fontSize: 11, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="India" dataKey="India" stroke="#F7882F" fill="#F7882F" fillOpacity={0.4} />
                  <Radar
                    name={targetCountryProfile.name}
                    dataKey="Target"
                    stroke="#6B7A8F"
                    fill="#6B7A8F"
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#FAF6EF] p-3 rounded-xl border border-[#DCC7AA] text-[11px] text-[#6B7A8F] flex items-center justify-between">
            <span>Comparing normalized 0-100 category index scores between India and {targetCountryProfile.name}.</span>
          </div>
        </div>
      </div>

      {/* 6. AI Strategic Feature Comparison Synthesis */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCC7AA]/60 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F7882F]" />
              <span>AI Comparative Policy Synthesis: {activeIndicator.name}</span>
            </h3>
            <p className="text-xs text-[#6B7A8F]">
              Generate data-driven policy insights comparing India with top performers (USA, China, Japan, Germany) for this exact feature.
            </p>
          </div>

          <button
            onClick={fetchAiFeatureComparison}
            disabled={loadingAi}
            className="px-4 py-2.5 rounded-xl bg-[#F7882F] hover:bg-[#D46917] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#F7C331]" />
            <span>{loadingAi ? 'Analyzing Feature...' : 'Generate AI Feature Comparison'}</span>
          </button>
        </div>

        {aiComparisonText ? (
          <div className="p-5 bg-[#FAF6EF] rounded-2xl text-xs leading-relaxed max-h-96 overflow-y-auto border border-[#DCC7AA]">
            <FormattedMarkdown content={aiComparisonText} variant="light" />
          </div>
        ) : (
          <div className="p-8 text-center bg-[#FAF6EF] rounded-2xl border border-dashed border-[#DCC7AA] space-y-3">
            <Globe className="w-10 h-10 text-[#6B7A8F] mx-auto" />
            <div className="text-sm font-bold text-slate-800">
              Ready to Analyze India vs Selected Peer Nations on {activeIndicator.name}
            </div>
            <p className="text-xs text-[#6B7A8F] max-w-xl mx-auto">
              Click the button above to synthesize a deep strategic breakdown of competitive advantages, policy reforms, and actionable roadmaps to elevate India&apos;s rank.
            </p>
          </div>
        )}

        <button
          onClick={() =>
            onOpenAiAssistant(
              `Provide a detailed comparative breakdown of India's global rank in "${activeIndicator.name}" against USA, China, Japan, and Germany.`
            )
          }
          className="w-full py-3 rounded-xl bg-[#3C2F2F] text-[#F7C331] text-xs font-bold hover:bg-[#4A3E3D] transition-colors flex items-center justify-center gap-2 border border-[#F7882F]/30"
        >
          <Sparkles className="w-4 h-4 text-[#F7882F]" />
          <span>Ask AI Assistant Specific Policy Questions About {activeIndicator.name}</span>
        </button>
      </div>

      {/* 7. Detailed Multi-Country Comparison Matrix Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F7882F]" />
            <span>Detailed Multi-Country Feature Matrix Table</span>
          </h3>
          <span className="text-xs text-[#6B7A8F]">
            Feature: <strong className="text-slate-900">{activeIndicator.name}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF6EF] text-[#6B7A8F] uppercase text-[10px] font-extrabold border-b border-[#DCC7AA]">
              <tr>
                <th className="p-3">Country & Region</th>
                <th className="p-3 text-center">Global Rank</th>
                <th className="p-3 text-center">Latest Value</th>
                <th className="p-3 text-center">Standing vs India</th>
                <th className="p-3 text-right">Strategic Category Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AA]/40">
              {activeComparisonData.map((countryData) => {
                const isIndia = countryData.code === 'IND';
                const indiaRank = activeIndicator.latestIndiaRank;
                const cRank = typeof countryData.rank === 'number' ? countryData.rank : 999;

                const isAhead = cRank < indiaRank;
                const isSame = cRank === indiaRank;

                return (
                  <tr
                    key={countryData.code}
                    className={`transition-colors ${
                      isIndia ? 'bg-[#FFF2E8]/80 font-bold' : 'hover:bg-[#FAF6EF]'
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${
                            isIndia
                              ? 'bg-[#F7882F] text-white border-[#D46917]'
                              : 'bg-white text-slate-800 border-[#DCC7AA]'
                          }`}
                        >
                          {countryData.code}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{countryData.name}</div>
                          <div className="text-[10px] text-[#6B7A8F]">{countryData.region}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center font-black">
                      <span
                        className={`px-2.5 py-1 rounded-full border ${
                          isIndia
                            ? 'bg-[#F7882F] text-white border-[#D46917]'
                            : cRank === 1
                            ? 'bg-[#F7C331]/20 text-[#D46917] border-[#F7C331]'
                            : 'bg-[#FAF6EF] text-slate-800 border-[#DCC7AA]'
                        }`}
                      >
                        #{countryData.rank}
                      </span>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-900">
                      {countryData.formattedValue}
                    </td>

                    <td className="p-3 text-center font-semibold">
                      {isIndia ? (
                        <span className="text-[#D46917] bg-[#FFF2E8] px-2.5 py-1 rounded-full border border-[#F7882F]/30 text-[11px] font-bold">
                          Reference Nation
                        </span>
                      ) : isAhead ? (
                        <span className="text-[#6B7A8F] bg-[#FAF6EF] px-2 py-0.5 rounded border border-[#DCC7AA] text-[11px]">
                          {indiaRank - cRank} places ahead of India
                        </span>
                      ) : isSame ? (
                        <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          Tied Rank
                        </span>
                      ) : (
                        <span className="text-[#D46917] bg-[#FFF2E8] px-2 py-0.5 rounded border border-[#F7882F]/20 text-[11px]">
                          India leads by {cRank - indiaRank} places
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {cRank === 1 ? (
                        <span className="text-xs font-bold text-[#D46917] bg-[#F7C331]/20 px-2.5 py-1 rounded-full border border-[#F7C331]/40">
                          Global Top #1 Leader
                        </span>
                      ) : isIndia ? (
                        <span className="text-xs font-bold text-white bg-[#F7882F] px-2.5 py-1 rounded-full">
                          India Standing
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B7A8F]">Global Peer Economy</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
