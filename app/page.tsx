'use client';

import React, { useState } from 'react';
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
      <footer className="bg-[#3C2F2F] text-[#E8D9C8] text-xs py-8 border-t border-[#52433A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white">India Global Index — Policy Intelligence & World Rankings</div>
            <div className="text-[#C4B2A5]">Aggregating datasets from World Bank, IMF, UN, WHO, WEF, WIPO, RSF & Transparency International.</div>
          </div>
          <div className="flex items-center gap-4 text-[#E8D9C8]">
            <span>Powered by Gemini AI</span>
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
