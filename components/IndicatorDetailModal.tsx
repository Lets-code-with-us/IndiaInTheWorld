'use client';

import React, { useState } from 'react';
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

  if (!indicator) return null;

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
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#1B2028] text-white p-6 flex items-start justify-between border-b border-[#2D3642] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#F7C331] uppercase tracking-wider bg-[#232A34] px-2.5 py-0.5 rounded border border-[#2D3642]">
                {indicator.category}
              </span>
              <span className="text-[10px] font-bold text-[#DCC7AA] bg-[#232A34] px-2 py-0.5 rounded">
                Verified Dataset
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{indicator.name}</h2>
            <p className="text-xs text-[#6B7A8F]">{indicator.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleWatchlist(indicator.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isWatchlisted
                  ? 'bg-[#F7882F] text-white border-[#F7882F]'
                  : 'bg-[#232A34] text-[#DCC7AA] border-[#2D3642] hover:bg-[#2D3642]'
              }`}
              title="Save to Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#232A34] text-[#DCC7AA] hover:text-white hover:bg-[#2D3642] border border-[#2D3642] transition-colors"
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

          {/* AI Breakdown Section */}
          <div className="bg-[#1B2028] text-white p-5 rounded-2xl border border-[#2D3642] space-y-3">
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
              <div className="p-3 bg-[#232A34] rounded-xl text-[#DCC7AA] text-xs leading-relaxed max-h-52 overflow-y-auto whitespace-pre-line border border-[#2D3642]">
                {aiExplanation}
              </div>
            ) : (
              <p className="text-[#6B7A8F] text-xs">
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
