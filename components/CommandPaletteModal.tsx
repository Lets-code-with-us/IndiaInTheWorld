'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Globe,
  Sparkles,
  FileText,
  Bookmark,
  Building2,
  TrendingUp,
  BarChart3,
  X,
  ChevronRight,
  ArrowRight,
  Command,
} from 'lucide-react';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { INDIAN_STATES_DATA } from '../lib/data/states';
import { Indicator } from '../lib/types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndicator: (indicator: Indicator) => void;
  onSelectTab: (tab: string) => void;
  onOpenAiAssistant: (query?: string) => void;
  onOpenReportCard: () => void;
  onOpenWatchlist: () => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectIndicator,
  onSelectTab,
  onOpenAiAssistant,
  onOpenReportCard,
  onOpenWatchlist,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const navActions = [
    {
      id: 'ask-ai',
      title: 'Ask Gemini AI Assistant',
      subtitle: 'Get instant grounded policy answers and state comparisons',
      icon: Sparkles,
      action: () => {
        onClose();
        onOpenAiAssistant();
      },
    },
    {
      id: 'report-card',
      title: 'Generate Annual AI Report Card',
      subtitle: 'Comprehensive 2026 executive evaluation summary',
      icon: FileText,
      action: () => {
        onClose();
        onOpenReportCard();
      },
    },
    {
      id: 'watchlist',
      title: 'View Saved Watchlist',
      subtitle: 'Manage bookmarked indicators and export CSV report',
      icon: Bookmark,
      action: () => {
        onClose();
        onOpenWatchlist();
      },
    },
    {
      id: 'tab-digitalgov',
      title: 'Digital Government & GovTech Hub',
      subtitle: 'GovTech Maturity Index, UN EGDI, EPI, ODIN Data',
      icon: Globe,
      action: () => {
        onClose();
        onSelectTab('digitalgov');
      },
    },
    {
      id: 'tab-states',
      title: 'Indian States Development Explorer',
      subtitle: '36 States and UTs SDG, Innovation and Health indices',
      icon: Building2,
      action: () => {
        onClose();
        onSelectTab('states');
      },
    },
    {
      id: 'tab-compare',
      title: 'Country Comparison Matrix',
      subtitle: 'Compare India against G20, BRICS, USA, China, Germany',
      icon: TrendingUp,
      action: () => {
        onClose();
        onSelectTab('compare');
      },
    },
  ];

  const filteredIndicators = query.trim()
    ? GLOBAL_INDICATORS.filter(
        (ind) =>
          ind.name.toLowerCase().includes(query.toLowerCase()) ||
          ind.category.toLowerCase().includes(query.toLowerCase()) ||
          ind.description.toLowerCase().includes(query.toLowerCase()) ||
          ind.whyItMatters.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : GLOBAL_INDICATORS.slice(0, 5);

  const filteredStates = query.trim()
    ? INDIAN_STATES_DATA.filter(
        (s) =>
          s.stateName.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const allItemsCount =
    filteredIndicators.length +
    filteredStates.length +
    (query.trim() ? 0 : navActions.length);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItemsCount));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItemsCount) % Math.max(1, allItemsCount));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!query.trim() && selectedIndex < navActions.length) {
        navActions[selectedIndex].action();
      } else if (selectedIndex < filteredIndicators.length) {
        onSelectIndicator(filteredIndicators[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="bg-[#3C2F2F] text-white rounded-3xl max-w-2xl w-full border border-[#52433A] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-[#52433A] flex items-center gap-3 bg-[#4A3E3D]">
            <Search className="w-5 h-5 text-[#F7882F] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search metrics, states, rankings (e.g. GDP, Innovation, Kerala)..."
              className="w-full bg-transparent text-sm text-white placeholder-[#C4B2A5] focus:outline-none font-medium"
            />
            <div className="flex items-center gap-1 shrink-0">
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#3C2F2F] text-[#E8D9C8] rounded border border-[#52433A]">
                ESC
              </kbd>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-[#52433A] text-[#C4B2A5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick Actions if query is empty */}
            {!query.trim() && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#F7C331] uppercase tracking-wider px-3 py-1">
                  Quick Actions & Hubs
                </div>
                {navActions.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#F7882F] text-white'
                          : 'hover:bg-[#4A3E3D] text-[#E8D9C8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#F7882F]'}`} />
                        <div>
                          <div className="text-xs font-bold">{item.title}</div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? 'text-white/80' : 'text-[#C4B2A5]'
                            }`}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#C4B2A5]'}`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Indicator Results */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#F7C331] uppercase tracking-wider px-3 py-1 flex items-center justify-between">
                <span>Matching Global Indicators ({filteredIndicators.length})</span>
                {query.trim() && <span className="text-slate-400 font-normal">Press Enter to select</span>}
              </div>

              {filteredIndicators.map((indicator, idx) => {
                const itemIndex = (!query.trim() ? navActions.length : 0) + idx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <button
                    key={indicator.id}
                    onClick={() => {
                      onSelectIndicator(indicator);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#F7882F] text-white'
                        : 'hover:bg-[#4A3E3D] text-[#E8D9C8]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 text-[#F7C331]">
                          {indicator.category}
                        </span>
                        <span className="text-xs font-bold">{indicator.name}</span>
                      </div>
                      <div
                        className={`text-[11px] line-clamp-1 ${
                          isSelected ? 'text-white/90' : 'text-[#C4B2A5]'
                        }`}
                      >
                        {indicator.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/30 text-[#F7C331]">
                        #{indicator.latestIndiaRank}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Indian States Results */}
            {filteredStates.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-[#52433A]">
                <div className="text-[10px] font-bold text-[#F7C331] uppercase tracking-wider px-3 py-1">
                  Matching Indian States ({filteredStates.length})
                </div>
                {filteredStates.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => {
                      onClose();
                      onSelectTab('states');
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#4A3E3D] text-[#E8D9C8] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{state.stateName} ({state.code})</div>
                      <div className="text-[10px] text-[#C4B2A5]">
                        SDG Score: {state.sdgScore} • Category: {state.category}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4A3E3D] text-[#F7C331]">
                      State Profile
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar with Shortcut Hints */}
          <div className="p-3 bg-[#4A3E3D] border-t border-[#52433A] flex items-center justify-between text-[11px] text-[#C4B2A5]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[#3C2F2F] rounded text-[10px] font-mono border border-[#52433A]">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[#3C2F2F] rounded text-[10px] font-mono border border-[#52433A]">
                  ↵
                </kbd>{' '}
                Select
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#F7C331] font-semibold">
              <Command className="w-3.5 h-3.5" />
              <span>Ctrl+K Palette</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
