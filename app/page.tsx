'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          setTimeout(() => setSelectedIndicator(found), 0);
        }
      }

      if (tabParam) {
        setTimeout(() => setActiveTab(tabParam), 0);
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
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

            {activeTab === 'environment' && (
              <EnvironmentDashboard
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Bar */}
      <footer className="bg-[#3C2F2F] text-[#E8D9C8] text-xs py-10 border-t border-[#52433A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#52433A]/60">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="font-bold text-sm text-white tracking-wide flex items-center justify-center md:justify-start gap-2">
                <span>India360</span>
                <span className="text-[10px] text-[#F7C331] bg-[#F7882F]/15 border border-[#F7882F]/30 px-2 py-0.5 rounded-full font-medium">
                  Policy Intelligence & World Rankings
                </span>
              </div>
              <div className="text-[#C4B2A5] text-xs max-w-2xl leading-relaxed">
                Aggregating official metrics from World Bank, IMF, UN, WHO, WEF, WIPO, RSF, Transparency International & NITI Aayog.
              </div>
            </div>
            
            {/* Professional Navigation Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-xs font-medium text-[#E8D9C8]">
              <button 
                onClick={() => { setActiveTab('overview'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="hover:text-[#F7882F] transition-colors cursor-pointer"
              >
                Global Indicators
              </button>
              <button 
                onClick={() => { setActiveTab('compare'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="hover:text-[#F7882F] transition-colors cursor-pointer"
              >
                Country Benchmarks
              </button>
              <button 
                onClick={() => { setActiveTab('states'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="hover:text-[#F7882F] transition-colors cursor-pointer"
              >
                State Rankings
              </button>
              <button 
                onClick={() => { setActiveTab('trends'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="hover:text-[#F7882F] transition-colors cursor-pointer"
              >
                Historical Trends
              </button>
              <button 
                onClick={() => setIsReportCardOpen(true)} 
                className="text-[#F7C331] hover:text-[#F7882F] font-semibold transition-colors cursor-pointer"
              >
                AI Policy Report
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#C4B2A5] text-xs">
            <p>© {new Date().getFullYear()} India360. Open Data Policy Initiative.</p>
            <p className="flex items-center gap-1.5 font-medium text-[#E8D9C8]">
              Made with <span className="text-rose-500 animate-pulse">💖</span> by{' '}
              <a
                href="https://vivekducs.is-a.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-[#F7882F] hover:text-[#F7C331] hover:underline transition-colors"
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
