'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart as LineChartIcon,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { Indicator } from '../lib/types';

interface TrendAnalysisProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
}) => {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('global-innovation-index');

  const activeIndicator = GLOBAL_INDICATORS.find((i) => i.id === selectedIndicatorId) || GLOBAL_INDICATORS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#DCC7AA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#F7882F]" />
            <span>10-Year Historical Trajectory Analysis</span>
          </h1>
          <p className="text-xs text-[#6B7A8F] mt-1">
            Track multi-year ranking movements, policy milestone impacts, and historical velocity for India and benchmark peers.
          </p>
        </div>

        {/* Indicator Selector Dropdown */}
        <div className="flex items-center gap-3 bg-[#FAF6EF] p-2 rounded-xl border border-[#DCC7AA]">
          <span className="text-xs font-bold text-[#6B7A8F] pl-2">Select Metric:</span>
          <select
            value={selectedIndicatorId}
            onChange={(e) => setSelectedIndicatorId(e.target.value)}
            className="bg-white border border-[#DCC7AA] rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
          >
            {GLOBAL_INDICATORS.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name} ({ind.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Historical Chart & Stat Cards */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCC7AA]/60 pb-4">
          <div>
            <div className="text-xs font-bold text-[#D46917] bg-[#FFF2E8] px-2.5 py-0.5 rounded w-fit uppercase border border-[#F7882F]/20">
              {activeIndicator.category}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{activeIndicator.name} (2015 - 2025)</h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="bg-[#FAF6EF] px-3 py-1.5 rounded-lg border border-[#DCC7AA] text-[#6B7A8F]">
              Change Delta: <span className="text-[#F7882F] font-bold">{activeIndicator.changeDelta}</span>
            </div>
            <button
              onClick={() => onSelectIndicator(activeIndicator)}
              className="px-3 py-1.5 rounded-lg bg-[#1B2028] text-[#F7C331] hover:bg-[#232A34] transition-colors border border-[#F7882F]/30"
            >
              Full Deep Dive
            </button>
          </div>
        </div>

        {/* Recharts Historical Line Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeIndicator.historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCC7AA" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7A8F' }} />
              <YAxis
                reversed={!activeIndicator.higherIsBetter}
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12, fill: '#6B7A8F' }}
                label={{
                  value: activeIndicator.higherIsBetter ? 'Score / Value' : 'Rank Position (#1 is Top)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '11px', fill: '#6B7A8F' },
                }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1B2028', borderColor: '#F7882F', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="india" name="India" stroke="#F7882F" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="usa" name="United States" stroke="#6B7A8F" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="china" name="China" stroke="#F7C331" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="germany" name="Germany" stroke="#DCC7AA" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="vietnam" name="Vietnam" stroke="#D46917" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#DCC7AA] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#6B7A8F]">
          <div>
            <span className="font-bold text-slate-800">Source Dataset:</span> {activeIndicator.source.datasetName} ({activeIndicator.source.organization})
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Confidence Score:</span>
            <span className="text-[#D46917] font-bold bg-[#FFF2E8] px-2 py-0.5 rounded border border-[#F7882F]/30">
              {activeIndicator.source.confidenceScore}% Verified
            </span>
          </div>
        </div>
      </div>

      {/* AI Trend Forecast & Policy Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Milestones for this metric */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F7882F]" />
            <span>Key Reform Levers Driving Trajectory</span>
          </h3>

          <div className="space-y-3">
            {activeIndicator.keyDriversAndPolicies.map((policy, idx) => (
              <div key={idx} className="p-3 bg-[#FAF6EF] rounded-xl border border-[#DCC7AA] text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F7882F] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{policy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Forecast Banner */}
        <div className="bg-[#1B2028] text-white rounded-2xl p-6 border border-[#2D3642] shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F7C331] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F7882F]" />
                AI 2028-2030 Horizon Projection
              </span>
              <span className="text-[10px] bg-[#232A34] text-[#DCC7AA] px-2 py-0.5 rounded border border-[#2D3642]">
                Gemini Intelligence
              </span>
            </div>

            <h3 className="text-base font-bold text-white">Target Rank Projection for {activeIndicator.name}</h3>

            <p className="text-xs text-[#DCC7AA] leading-relaxed">
              Based on historical momentum and recent policy investments, India is projected to continue its upward velocity in {activeIndicator.category}, with potential to gain an additional 5 to 10 places by 2028 if structural bottlenecks are addressed.
            </p>
          </div>

          <button
            onClick={() => onOpenAiAssistant(`Provide a 2028-2030 ranking prediction for ${activeIndicator.name} based on historical trajectory.`)}
            className="w-full py-2.5 rounded-xl bg-[#F7882F] hover:bg-[#D46917] text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Ask AI for Custom Horizon Prediction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
