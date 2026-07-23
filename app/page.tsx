'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { IndiaDashboard } from '../components/IndiaDashboard';
import { CategoryExplorer } from '../components/CategoryExplorer';
import { CountryComparison } from '../components/CountryComparison';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { TrendAnalysis } from '../components/TrendAnalysis';
import { StateExplorer } from '../components/StateExplorer';
import { IndicatorDetailModal } from '../components/IndicatorDetailModal';
import { AiReportCardModal } from '../components/AiReportCardModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { WatchlistExportModal } from '../components/WatchlistExportModal';
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

  const [watchlistIds, setWatchlistIds] = useState<string[]>(['gdp-rank', 'global-innovation-index', 'climate-change-performance-index']);

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
    setSelectedCategory(cat);
    setActiveTab('categories');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-200">
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenReportCard={() => setIsReportCardOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onSelectIndicator={(indicator) => setSelectedIndicator(indicator)}
        watchlistCount={watchlistIds.length}
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
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-200">India Global Index — Policy Intelligence & World Rankings</div>
            <div>Aggregating datasets from World Bank, IMF, UN, WHO, WEF, WIPO, RSF & Transparency International.</div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.1 Pro Reasoning</span>
            <span>•</span>
            <span>2026 Verified Edition</span>
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
    </div>
  );
}
