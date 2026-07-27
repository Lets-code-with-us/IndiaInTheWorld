'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Award,
  Globe,
  Share2,
  Bookmark,
  ShieldCheck,
  Newspaper,
  Zap,
  Copy,
  Check,
  Link2,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Indicator } from '../lib/types';
import { FormattedMarkdown } from './FormattedMarkdown';

interface IndicatorDetailModalProps {
  indicator: Indicator | null;
  onClose: () => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
  onToggleWatchlist: (indicatorId: string) => void;
  isWatchlisted: boolean;
}

export const IndicatorDetailModal: React.FC<IndicatorDetailModalProps> = ({
  indicator,
  onClose,
  onOpenAiAssistant,
  onToggleWatchlist,
  isWatchlisted,
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState<boolean>(false);

  if (!indicator) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?indicator=${indicator.id}`;
    navigator.clipboard.writeText(url);
    showToast('Copied shareable link to clipboard!');
    setShareMenuOpen(false);
  };

  const handleCopySummary = () => {
    const url = `${window.location.origin}${window.location.pathname}?indicator=${indicator.id}`;
    const summaryText = `📊 India360 Performance Brief
-------------------------------------------
Indicator: ${indicator.name} (${indicator.category})
Global Rank: #${indicator.latestIndiaRank} / ${indicator.totalCountriesMeasured}
Current Value: ${indicator.latestIndiaValue}
10-Year Change: ${indicator.changeDelta}
Primary Strengths: ${indicator.strengthsAndGaps.strengths.join(', ')}
Key Bottlenecks: ${indicator.strengthsAndGaps.gaps.join(', ')}
Source: ${indicator.source.organization} (${indicator.source.lastUpdatedYear})
Confidence Score: ${indicator.source.confidenceScore || 95}%
Explore Live Data: ${url}`;

    navigator.clipboard.writeText(summaryText);
    showToast('Copied indicator summary brief to clipboard!');
    setShareMenuOpen(false);
  };

  const fetchAiExplanation = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain-indicator',
          indicatorId: indicator.id,
          indicatorName: indicator.name,
          category: indicator.category,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.text || 'Analysis complete.');
    } catch (err) {
      console.error('AI Explanation Error:', err);
      setAiExplanation('Failed to generate AI analysis.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400"
          >
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#3C2F2F] text-white p-6 flex items-start justify-between border-b border-[#52433A] shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-[#F7C331] uppercase tracking-wider bg-[#4A3E3D] px-2.5 py-0.5 rounded border border-[#52433A]">
                {indicator.category}
              </span>
              <span className="text-[10px] font-bold text-[#E8D9C8] bg-[#4A3E3D] px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{indicator.source.confidenceScore || 95}% Confidence Score</span>
              </span>

              {(indicator.isCritical || indicator.isFluctuating) && (
                <motion.span
                  animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="text-[10px] font-black text-rose-300 uppercase tracking-wider bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-500/50 flex items-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>{indicator.isFluctuating ? '⚡ High Fluctuation' : '🔥 High Priority Indicator'}</span>
                </motion.span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{indicator.name}</h2>
            <p className="text-xs text-[#E8D9C8]">{indicator.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Share Insight Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F7882F] hover:bg-[#D46917] text-white text-xs font-bold transition-all shadow-md"
                title="Share Insight"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Insight</span>
              </button>

              {shareMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#3C2F2F] text-white rounded-2xl border border-[#52433A] shadow-2xl p-2 z-50 space-y-1">
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#4A3E3D] flex items-center gap-2 text-xs font-medium text-[#E8D9C8]"
                  >
                    <Link2 className="w-4 h-4 text-[#F7882F]" />
                    <span>Copy Shareable Link</span>
                  </button>
                  <button
                    onClick={handleCopySummary}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#4A3E3D] flex items-center gap-2 text-xs font-medium text-[#E8D9C8]"
                  >
                    <FileText className="w-4 h-4 text-[#F7C331]" />
                    <span>Copy Performance Summary</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleWatchlist(indicator.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isWatchlisted
                  ? 'bg-[#F7882F] text-white border-[#F7882F]'
                  : 'bg-[#4A3E3D] text-[#E8D9C8] border-[#52433A] hover:bg-[#52433A]'
              }`}
              title="Save to Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#4A3E3D] text-[#E8D9C8] hover:text-white hover:bg-[#52433A] border border-[#52433A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* Key Metric Highlight Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF6EF] p-4 rounded-xl border border-[#DCC7AA]">
            <div>
              <div className="text-[10px] text-[#6B7A8F] font-medium">India&apos;s Global Rank</div>
              <div className="text-2xl font-black text-slate-900">
                #{indicator.latestIndiaRank}
                <span className="text-xs font-normal text-[#6B7A8F]"> / {indicator.totalCountriesMeasured}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#6B7A8F] font-medium">Metric Score / Value</div>
              <div className="text-base font-black text-[#D46917] mt-1">{indicator.latestIndiaValue}</div>
            </div>

            <div>
              <div className="text-[10px] text-[#6B7A8F] font-medium">10-Year Trajectory</div>
              <div className="text-xs font-bold text-slate-800 mt-1">{indicator.changeDelta}</div>
            </div>
          </div>

          {/* Historical Line Chart */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Historical Trajectory (2015-2025)</h3>
            <div className="h-56 w-full pt-2 bg-[#FAF6EF] rounded-xl p-3 border border-[#DCC7AA]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={indicator.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCC7AA" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7A8F' }} />
                  <YAxis
                    reversed={!indicator.higherIsBetter}
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#6B7A8F' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1B2028', borderRadius: '8px', color: '#fff', fontSize: '11px', borderColor: '#F7882F' }}
                  />
                  <Line type="monotone" dataKey="india" name="India" stroke="#F7882F" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Drivers & Strengths vs Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#DCC7AA] space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F7882F]" />
                <span>Primary Drivers & Reform Initiatives</span>
              </h4>
              <ul className="space-y-1 text-slate-600 pl-1">
                {indicator.keyDriversAndPolicies.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-[#F7882F] font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#DCC7AA] space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#F7882F]" />
                <span>Strengths vs Strategic Bottlenecks</span>
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div>
                  <strong className="text-[#D46917]">Strengths:</strong>{' '}
                  {indicator.strengthsAndGaps.strengths.join(', ')}
                </div>
                <div>
                  <strong className="text-[#6B7A8F]">Gaps:</strong>{' '}
                  {indicator.strengthsAndGaps.gaps.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Recent News Integration & Ranking Context */}
          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#DCC7AA] space-y-2">
            <div className="flex items-center gap-2 text-[#3C2F2F] font-bold text-xs">
              <Newspaper className="w-4 h-4 text-[#F7882F]" />
              <span>News & Policy Context Explaining Ranking Movements</span>
            </div>
            {indicator.recentNews ? (
              <div className="bg-white p-3 rounded-lg border border-[#DCC7AA] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{indicator.recentNews.title}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{indicator.recentNews.source} • {indicator.recentNews.date}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{indicator.recentNews.summary}</p>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-lg border border-[#DCC7AA] text-slate-600 text-[11px] leading-relaxed">
                <strong className="text-slate-900">Latest Coverage Summary:</strong> Recent policy shifts under Union Budget allocations and state-level reforms are directly impacting India&apos;s trajectory for {indicator.name} in the {indicator.year} global evaluation index.
              </div>
            )}
          </div>

          {/* AI Breakdown Section */}
          <div className="bg-[#3C2F2F] text-white p-5 rounded-2xl border border-[#52433A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F7C331]" />
                <h4 className="font-bold text-xs text-white">Gemini AI Deep Analytical Breakdown</h4>
              </div>

              <button
                onClick={fetchAiExplanation}
                disabled={loadingAi}
                className="px-3 py-1 rounded-lg bg-[#F7882F] hover:bg-[#D46917] text-white font-semibold text-xs transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'Analyzing...' : 'Generate AI Analysis'}
              </button>
            </div>

            {aiExplanation ? (
              <div className="p-4 bg-[#4A3E3D] rounded-xl text-xs leading-relaxed max-h-64 overflow-y-auto border border-[#52433A]">
                <FormattedMarkdown content={aiExplanation} variant="dark" />
              </div>
            ) : (
              <p className="text-[#C4B2A5] text-xs">
                Click above to generate an AI-powered policy breakdown and rank improvement roadmap for this metric.
              </p>
            )}
          </div>

          {/* Source Attribution Link */}
          <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#DCC7AA] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#6B7A8F] uppercase font-bold">Source Publisher</div>
              <div className="font-bold text-slate-800">{indicator.source.organization} ({indicator.source.datasetName})</div>
            </div>

            <a
              href={indicator.source.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#D46917] font-bold hover:underline"
            >
              <span>Visit Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
