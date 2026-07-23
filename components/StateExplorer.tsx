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
      <div className="bg-white p-6 rounded-2xl border border-[#DCC7AA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#F7882F]" />
            <span>Sub-National & Indian State Rankings (NITI Aayog)</span>
          </h1>
          <p className="text-xs text-[#6B7A8F] mt-1">
            Explore state-by-state performance across NITI Aayog SDG Index, Innovation Index, Health Index, and Export Preparedness.
          </p>
        </div>

        <button
          onClick={() => onOpenAiAssistant('Compare Kerala, Tamil Nadu, and Bihar on NITI Aayog SDG and Innovation Index scores.')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF2E8] hover:bg-[#F7882F]/20 text-[#D46917] text-xs font-semibold border border-[#F7882F]/30 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#F7882F]" />
          <span>Ask AI State Insights</span>
        </button>
      </div>

      {/* Metric Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#DCC7AA] shadow-sm">
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
                  ? 'bg-[#1B2028] text-[#F7C331] shadow-md border border-[#F7882F]/40'
                  : 'bg-[#FAF6EF] text-[#6B7A8F] hover:bg-[#F7882F]/10 border border-[#DCC7AA]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A8F]" />
          <input
            type="text"
            placeholder="Search state (e.g. Bihar, Kerala, Delhi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF6EF] border border-[#DCC7AA] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
          />
        </div>
      </div>

      {/* State Rankings Grid */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3 text-xs text-[#6B7A8F]">
          <span>Displaying {filteredStates.length} Indian States & Union Territories</span>
          <span>Source: NITI Aayog Official Reports</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStates.map((state, idx) => {
            const isFrontRunner = state.category === 'Front Runner';

            return (
              <div
                key={state.code}
                className="bg-[#FAF6EF] rounded-xl p-4 border border-[#DCC7AA] hover:border-[#F7882F] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#6B7A8F] text-white text-[11px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{state.stateName}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isFrontRunner
                        ? 'bg-[#FFF2E8] text-[#D46917] border-[#F7882F]/40'
                        : 'bg-white text-[#6B7A8F] border-[#DCC7AA]'
                    }`}
                  >
                    {state.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-[#DCC7AA]/80">
                  <div>
                    <div className="text-[#6B7A8F] text-[10px]">SDG Score</div>
                    <div className="font-black text-[#F7882F] text-base">{state.sdgScore} / 100</div>
                  </div>
                  <div>
                    <div className="text-[#6B7A8F] text-[10px]">Innovation Score</div>
                    <div className="font-black text-slate-900 text-base">{state.innovationScore}</div>
                  </div>
                  <div>
                    <div className="text-[#6B7A8F] text-[10px]">Health Index</div>
                    <div className="font-bold text-slate-800">{state.healthIndexScore}</div>
                  </div>
                  <div>
                    <div className="text-[#6B7A8F] text-[10px]">Export Prep Rank</div>
                    <div className="font-bold text-slate-800">#{state.exportPreparednessRank}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between items-center pt-1">
                  <span>Literacy Rate: <strong className="text-slate-800">{state.literacyRate}%</strong></span>
                  <button
                    onClick={() => onOpenAiAssistant(`Analyze ${state.stateName} state development indicators.`)}
                    className="text-[#F7882F] font-bold hover:underline cursor-pointer"
                  >
                    Analyze State
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
