'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Globe,
  Sparkles,
  Info,
} from 'lucide-react';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { CATEGORIES } from '../lib/data/categories';
import { Indicator, CategoryType } from '../lib/types';

interface CategoryExplorerProps {
  selectedCategory: CategoryType | 'All';
  onSelectCategory: (category: CategoryType | 'All') => void;
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectIndicator,
  onOpenAiAssistant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trendFilter, setTrendFilter] = useState<'all' | 'improving' | 'stable' | 'declining'>('all');
  const [sortBy, setSortBy] = useState<'rank-asc' | 'rank-desc' | 'name'>('rank-asc');

  const categoriesList: (CategoryType | 'All')[] = ['All', ...(Object.keys(CATEGORIES) as CategoryType[])];

  const filteredIndicators = GLOBAL_INDICATORS.filter((ind) => {
    const matchesCategory = selectedCategory === 'All' || ind.category === selectedCategory;
    const matchesSearch =
      ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.source.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrend = trendFilter === 'all' || ind.trend === trendFilter;

    return matchesCategory && matchesSearch && matchesTrend;
  }).sort((a, b) => {
    if (sortBy === 'rank-asc') return a.latestIndiaRank - b.latestIndiaRank;
    if (sortBy === 'rank-desc') return b.latestIndiaRank - a.latestIndiaRank;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Category & Global Indicator Explorer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and filter {GLOBAL_INDICATORS.length} international metrics across 10 global policy dimensions.
          </p>
        </div>

        <button
          onClick={() => onOpenAiAssistant('Explain the methodology behind India’s Global Innovation Index and Ease of Business scores.')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors w-fit"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Ask AI Methodologies</span>
        </button>
      </div>

      {/* Category Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? '🌐 All Indicators' : CATEGORIES[cat as CategoryType].title}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search indicator or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Trend Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={trendFilter}
            onChange={(e) => setTrendFilter(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Trajectories</option>
            <option value="improving">Improving (+ Delta)</option>
            <option value="stable">Stable / Maintained</option>
            <option value="declining">Declining (- Delta)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="rank-asc">Highest Rank (#1 to #190)</option>
            <option value="rank-desc">Lowest Rank (#190 to #1)</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Indicators Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIndicators.map((indicator) => {
          return (
            <div
              key={indicator.id}
              onClick={() => onSelectIndicator(indicator)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    {indicator.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      indicator.trend === 'improving'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : indicator.trend === 'declining'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {indicator.trend.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {indicator.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {indicator.description}
                </p>
              </div>

              {/* Rank & Score Section */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">India&apos;s Global Rank</div>
                  <div className="text-xl font-black text-slate-900">
                    #{indicator.latestIndiaRank}
                    <span className="text-xs font-normal text-slate-400"> / {indicator.totalCountriesMeasured}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium">Metric Score</div>
                  <div className="text-xs font-bold text-emerald-700">{indicator.latestIndiaValue}</div>
                  <div className="text-[10px] text-slate-500">{indicator.changeDelta}</div>
                </div>
              </div>

              {/* Verified Source Attribution */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-medium text-slate-600">{indicator.source.organization}</span>
                </div>

                <span className="flex items-center gap-1 text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIndicators.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No indicators found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or filter tags.</p>
        </div>
      )}
    </div>
  );
};
