'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { IndiaDashboard } from '../components/IndiaDashboard';
import { EconomyDashboard } from '../components/EconomyDashboard';
import { SocietyDashboard } from '../components/SocietyDashboard';
import { GovernanceDashboard } from '../components/GovernanceDashboard';
import { HealthcareDashboard } from '../components/HealthcareDashboard';
import { EnvironmentDashboard } from '../components/EnvironmentDashboard';
import { SafetyDashboard } from '../components/SafetyDashboard';
import { EqualityDashboard } from '../components/EqualityDashboard';
import { DigitalGovDashboard } from '../components/DigitalGovDashboard';
import { CategoryExplorer } from '../components/CategoryExplorer';
import { CountryComparison } from '../components/CountryComparison';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { TrendAnalysis } from '../components/TrendAnalysis';
import { StateExplorer } from '../components/StateExplorer';
import { IndicatorDetailModal } from '../components/IndicatorDetailModal';
import { AiReportCardModal } from '../components/AiReportCardModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { WatchlistExportModal } from '../components/WatchlistExportModal';
import { CommandPaletteModal } from '../components/CommandPaletteModal';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { Indicator, CategoryType } from '../lib/types';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [aiAssistantInitialQuery, setAiAssistantInitialQuery] = useState<string | undefined>(undefined);

  const [isReportCardOpen, setIsReportCardOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  const [watchlistIds, setWatchlistIds] = useState<string[]>([
    'gdp-rank',
    'global-innovation-index',
    'climate-change-performance-index',
  ]);

  // Handle URL deep linking on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const indicatorId = params.get('indicator');
      const tabParam = params.get('tab');

      if (indicatorId) {
        const found = GLOBAL_INDICATORS.find((ind) => ind.id === indicatorId);
        if (found) {
          setSelectedIndicator(found);
        }
      }

      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Ctrl+K or Cmd+K -> Open Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Ctrl+I or Cmd+I -> Open AI Assistant Drawer
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsAiAssistantOpen((prev) => !prev);
        return;
      }

      // Ctrl+Shift+R or Cmd+Shift+R -> Open Report Card
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsReportCardOpen((prev) => !prev);
        return;
      }

      // Ctrl+Shift+W or Cmd+Shift+W -> Open Watchlist
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setIsWatchlistOpen((prev) => !prev);
        return;
      }

      // '?' key (Shift + /) when not typing in input -> Toggle Keyboard Shortcuts Help
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAiAssistant = (initialQuery?: string) => {
    setAiAssistantInitialQuery(initialQuery);
    setIsAiAssistantOpen(true);
  };

  const handleToggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectCategoryFromDashboard = (cat: CategoryType) => {
    if (cat === 'Economy') {
      setActiveTab('economy');
    } else if (cat === 'Society') {
      setActiveTab('society');
    } else if (cat === 'Governance') {
      setActiveTab('governance');
    } else if (cat === 'Healthcare') {
      setActiveTab('healthcare');
    } else if (cat === 'Environment') {
      setActiveTab('environment');
    } else if (cat === 'Safety') {
      setActiveTab('safety');
    } else if (cat === 'Equality') {
      setActiveTab('equality');
    } else if (cat === 'DigitalGov') {
      setActiveTab('digitalgov');
    } else {
      setSelectedCategory(cat);
      setActiveTab('categories');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-slate-900 font-sans selection:bg-[#F7882F]/20">
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenReportCard={() => setIsReportCardOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
        watchlistCount={watchlistIds.length}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === 'dashboard' && (
          <IndiaDashboard
            onSelectCategory={handleSelectCategoryFromDashboard}
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onOpenReportCard={() => setIsReportCardOpen(true)}
          />
        )}

        {activeTab === 'economy' && (
          <EconomyDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'society' && (
          <SocietyDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'governance' && (
          <GovernanceDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'healthcare' && (
          <HealthcareDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'equality' && (
          <EqualityDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'digitalgov' && (
          <DigitalGovDashboard
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistIds={watchlistIds}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryExplorer
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'compare' && (
          <CountryComparison
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'worldmap' && (
          <InteractiveWorldMap
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'trends' && (
          <TrendAnalysis
            onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'states' && (
          <StateExplorer onOpenAiAssistant={handleOpenAiAssistant} />
        )}
      </main>

      {/* Footer Bar */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="font-black text-sm text-white tracking-wide">
                India Global Index — Policy Intelligence & World Rankings
              </div>
              <div className="text-slate-400 text-xs max-w-2xl leading-relaxed">
                Aggregating datasets from World Bank, IMF, UN, WHO, WEF, WIPO, RSF, Transparency International & NITI Aayog.
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs font-bold text-slate-300">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                Powered by Gemini AI
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                2026 Verified Edition
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
            <p>© {new Date().getFullYear()} India Global Index. Open Data Policy Initiative.</p>
            <p className="flex items-center gap-1.5 font-medium text-slate-300">
              Made with <span className="text-rose-500 animate-pulse">💖</span> by{' '}
              <a
                href="https://vivekducs.is-a.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Vivek Kumar
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <IndicatorDetailModal
        indicator={selectedIndicator}
        onClose={() => setSelectedIndicator(null)}
        onOpenAiAssistant={handleOpenAiAssistant}
        onToggleWatchlist={handleToggleWatchlist}
        isWatchlisted={selectedIndicator ? watchlistIds.includes(selectedIndicator.id) : false}
      />

      <AiReportCardModal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
      />

      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        initialQuery={aiAssistantInitialQuery}
      />

      <WatchlistExportModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistIds={watchlistIds}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onClearWatchlist={() => setWatchlistIds([])}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenReportCard={() => setIsReportCardOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
