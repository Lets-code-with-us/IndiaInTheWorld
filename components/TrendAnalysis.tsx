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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>10-Year Historical Trajectory Analysis</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-year ranking movements, policy milestone impacts, and historical velocity for India and benchmark peers.
          </p>
        </div>

        {/* Indicator Selector Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 pl-2">Select Metric:</span>
          <select
            value={selectedIndicatorId}
            onChange={(e) => setSelectedIndicatorId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded w-fit uppercase">
              {activeIndicator.category}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{activeIndicator.name} (2015 - 2025)</h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              Change Delta: <span className="text-emerald-700">{activeIndicator.changeDelta}</span>
            </div>
            <button
              onClick={() => onSelectIndicator(activeIndicator)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Full Deep Dive
            </button>
          </div>
        </div>

        {/* Recharts Historical Line Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeIndicator.historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis
                reversed={!activeIndicator.higherIsBetter}
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{
                  value: activeIndicator.higherIsBetter ? 'Score / Value' : 'Rank Position (#1 is Top)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '11px', fill: '#94a3b8' },
                }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="india" name="India" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="usa" name="United States" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="china" name="China" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="germany" name="Germany" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="vietnam" name="Vietnam" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-800">Source Dataset:</span> {activeIndicator.source.datasetName} ({activeIndicator.source.organization})
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Confidence Score:</span>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              {activeIndicator.source.confidenceScore}% Verified
            </span>
          </div>
        </div>
      </div>

      {/* AI Trend Forecast & Policy Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Milestones for this metric */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Key Reform Levers Driving Trajectory</span>
          </h3>

          <div className="space-y-3">
            {activeIndicator.keyDriversAndPolicies.map((policy, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{policy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Forecast Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI 2028-2030 Horizon Projection
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Gemini Intelligence
              </span>
            </div>

            <h3 className="text-base font-bold text-white">Target Rank Projection for {activeIndicator.name}</h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on historical momentum and recent policy investments, India is projected to continue its upward velocity in {activeIndicator.category}, with potential to gain an additional 5 to 10 places by 2028 if structural bottlenecks are addressed.
            </p>
          </div>

          <button
            onClick={() => onOpenAiAssistant(`Provide a 2028-2030 ranking prediction for ${activeIndicator.name} based on historical trajectory.`)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>Ask AI for Custom Horizon Prediction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
