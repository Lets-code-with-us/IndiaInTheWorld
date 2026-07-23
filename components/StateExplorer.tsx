'use client';

import React, { useState } from 'react';
import {
  Building2,
  Award,
  BarChart2,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { INDIAN_STATES_DATA } from '../lib/data/states';
import { StateIndicator } from '../lib/types';

interface StateExplorerProps {
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const StateExplorer: React.FC<StateExplorerProps> = ({ onOpenAiAssistant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'sdg' | 'innovation' | 'health' | 'export'>('sdg');

  const filteredStates = INDIAN_STATES_DATA.filter((s) =>
    s.stateName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (selectedMetric === 'sdg') return b.sdgScore - a.sdgScore;
    if (selectedMetric === 'innovation') return b.innovationScore - a.innovationScore;
    if (selectedMetric === 'health') return b.healthIndexScore - a.healthIndexScore;
    return a.exportPreparednessRank - b.exportPreparednessRank;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Sub-National & Indian State Rankings (NITI Aayog)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore state-by-state performance across NITI Aayog SDG Index, Innovation Index, Health Index, and Export Preparedness.
          </p>
        </div>

        <button
          onClick={() => onOpenAiAssistant('Compare Kerala, Tamil Nadu, and Karnataka on NITI Aayog SDG and Innovation Index scores.')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Ask AI State Insights</span>
        </button>
      </div>

      {/* Metric Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'sdg', label: 'NITI Aayog SDG Score (0-100)' },
            { id: 'innovation', label: 'India Innovation Index' },
            { id: 'health', label: 'State Health Index' },
            { id: 'export', label: 'Export Preparedness Rank' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMetric === m.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search state (e.g. Kerala, MH)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* State Rankings Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs text-slate-500">
          <span>Displaying {filteredStates.length} Indian States & Union Territories</span>
          <span>Source: NITI Aayog Official Reports</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStates.map((state, idx) => {
            const isFrontRunner = state.category === 'Front Runner';

            return (
              <div
                key={state.code}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{state.stateName}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isFrontRunner
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {state.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <div>
                    <div className="text-slate-400 text-[10px]">SDG Score</div>
                    <div className="font-black text-emerald-700 text-base">{state.sdgScore} / 100</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Innovation Score</div>
                    <div className="font-black text-slate-900 text-base">{state.innovationScore}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Health Index</div>
                    <div className="font-bold text-slate-800">{state.healthIndexScore}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Export Prep Rank</div>
                    <div className="font-bold text-slate-800">#{state.exportPreparednessRank}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Literacy Rate: <strong className="text-slate-800">{state.literacyRate}%</strong></span>
                  <span className="text-emerald-600 font-semibold cursor-pointer" onClick={() => onOpenAiAssistant(`Analyze ${state.stateName} state development indicators.`)}>
                    Analyze State
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
