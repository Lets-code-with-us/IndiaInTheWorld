'use client';

import React, { useState } from 'react';
import {
  Globe,
  BarChart3,
  GitCompare,
  TrendingUp,
  MapPin,
  Sparkles,
  FileText,
  Search,
  Bookmark,
  Building2,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { Indicator } from '../lib/types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onOpenReportCard: () => void;
  onOpenWatchlist: () => void;
  onSelectIndicator: (indicator: Indicator) => void;
  watchlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  onOpenReportCard,
  onOpenWatchlist,
  onSelectIndicator,
  watchlistCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredIndicators = searchQuery.trim()
    ? GLOBAL_INDICATORS.filter(
        (ind) =>
          ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ind.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ind.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'categories', label: 'Indicators Explorer', icon: Globe },
    { id: 'compare', label: 'Country Comparison', icon: GitCompare },
    { id: 'worldmap', label: 'Global Map', icon: MapPin },
    { id: 'trends', label: '10-Yr Trends', icon: TrendingUp },
    { id: 'states', label: 'Indian States', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">India Global Index</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  2026 Live
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Consolidated Global Rankings & Policy Intelligence</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 60+ global indicators (e.g. Innovation, GDP, HDI, Climate)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && filteredIndicators.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Matching Global Indicators ({filteredIndicators.length})
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {filteredIndicators.map((indicator) => (
                    <button
                      key={indicator.id}
                      onClick={() => {
                        onSelectIndicator(indicator);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400">
                          {indicator.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-slate-500">{indicator.category}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">{indicator.latestIndiaValue}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                          Rank #{indicator.latestIndiaRank}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiAssistant()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all border border-emerald-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={onOpenReportCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Annual Report Card</span>
            </button>

            <button
              onClick={onOpenWatchlist}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Saved Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1 pb-1">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
