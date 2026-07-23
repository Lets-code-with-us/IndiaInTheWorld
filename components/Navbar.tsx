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
    <header className="sticky top-0 z-40 bg-[#3C2F2F] border-b border-[#52433A] text-neutral-100 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7882F] to-[#D46917] flex items-center justify-center text-white shadow-lg shadow-black/40 border border-[#F7C331]/30">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">India Global Index</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F7882F]/20 text-[#F7C331] border border-[#F7882F]/30">
                  2026 Live
                </span>
              </div>
              <p className="text-xs text-[#E8D9C8] hidden sm:block">Consolidated Global Rankings & Policy Intelligence</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B2A5]" />
              <input
                type="text"
                placeholder="Search 60+ global indicators (e.g. Innovation, GDP, HDI, Climate)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-[#4A3E3D] border border-[#52433A] rounded-lg pl-9 pr-4 py-1.5 text-xs text-neutral-100 placeholder-[#C4B2A5] focus:outline-none focus:ring-2 focus:ring-[#F7882F]/50 focus:border-[#F7882F] transition-all"
              />
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && filteredIndicators.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#3C2F2F] border border-[#52433A] rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 text-[11px] font-semibold text-[#C4B2A5] uppercase tracking-wider border-b border-[#52433A]">
                  Matching Global Indicators ({filteredIndicators.length})
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#52433A]">
                  {filteredIndicators.map((indicator) => (
                    <button
                      key={indicator.id}
                      onClick={() => {
                        onSelectIndicator(indicator);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#4A3E3D] flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-xs font-medium text-neutral-200 group-hover:text-[#F7C331]">
                          {indicator.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span className="text-[#C4B2A5]">{indicator.category}</span>
                          <span>•</span>
                          <span className="text-[#E8D9C8] font-semibold">{indicator.latestIndiaValue}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F7882F] bg-[#F7882F]/10 px-2 py-0.5 rounded border border-[#F7882F]/30">
                          Rank #{indicator.latestIndiaRank}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#C4B2A5] group-hover:text-white" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F7882F] to-[#D46917] hover:from-[#FFA155] hover:to-[#F7882F] text-white text-xs font-semibold shadow-md shadow-black/30 transition-all border border-[#F7C331]/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F7C331]" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={onOpenReportCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A3E3D] hover:bg-[#52433A] text-neutral-200 border border-[#52433A] text-xs font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#F7882F]" />
              <span className="hidden sm:inline">Annual Report Card</span>
            </button>

            <button
              onClick={onOpenWatchlist}
              className="relative p-2 rounded-lg bg-[#4A3E3D] hover:bg-[#52433A] text-neutral-300 border border-[#52433A] transition-colors cursor-pointer"
              title="Saved Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F7882F] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#52433A] pt-1 pb-1">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4A3E3D] text-[#F7C331] border border-[#F7882F]/40 font-semibold shadow-inner'
                    : 'text-[#C4B2A5] hover:text-white hover:bg-[#4A3E3D]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F7882F]' : 'text-[#C4B2A5]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
