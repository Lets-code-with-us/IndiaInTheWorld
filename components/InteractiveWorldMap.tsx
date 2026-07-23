'use client';

import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { COMPARISON_COUNTRIES } from '../lib/data/countries';
import { Indicator } from '../lib/types';

interface InteractiveWorldMapProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
}) => {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>('global-innovation-index');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IND');

  const activeIndicator = GLOBAL_INDICATORS.find((i) => i.id === selectedIndicatorId) || GLOBAL_INDICATORS[0];
  const selectedCountryData = COMPARISON_COUNTRIES.find((c) => c.code === selectedCountryCode) || COMPARISON_COUNTRIES[0];
  const activeCountryComp = activeIndicator.countryComparison.find((c) => c.code === selectedCountryCode);

  // SVG World Map representation with clickable key country regions
  const mapNodes = [
    { code: 'IND', name: 'India', cx: 680, cy: 260, r: 24, color: '#10b981' },
    { code: 'USA', name: 'United States', cx: 220, cy: 180, r: 28, color: '#3b82f6' },
    { code: 'CHN', name: 'China', cx: 740, cy: 210, r: 26, color: '#f59e0b' },
    { code: 'DEU', name: 'Germany', cx: 490, cy: 150, r: 18, color: '#8b5cf6' },
    { code: 'JPN', name: 'Japan', cx: 830, cy: 190, r: 16, color: '#ec4899' },
    { code: 'GBR', name: 'United Kingdom', cx: 450, cy: 140, r: 16, color: '#6366f1' },
    { code: 'VNM', name: 'Vietnam', cx: 730, cy: 280, r: 16, color: '#06b6d4' },
    { code: 'BRA', name: 'Brazil', cx: 340, cy: 320, r: 22, color: '#84cc16' },
    { code: 'ZAF', name: 'South Africa', cx: 520, cy: 370, r: 18, color: '#d97706' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Interactive World Map & Indicator Heatmap</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualize geographic distribution and global rank density for selected policy metrics.
          </p>
        </div>

        {/* Indicator Selector Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 pl-2">Select Indicator:</span>
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

      {/* Map Stage & Country Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG World Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-white">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{activeIndicator.category}</div>
              <h2 className="text-base font-bold text-white">{activeIndicator.name}</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              India Rank: #{activeIndicator.latestIndiaRank}
            </span>
          </div>

          {/* Map Graphic Container */}
          <div className="relative w-full h-80 my-4 flex items-center justify-center">
            <svg viewBox="0 0 960 480" className="w-full h-full text-slate-800 select-none">
              {/* World Map Grids */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="960" height="480" fill="url(#grid)" />

              {/* Equator Line */}
              <line x1="0" y1="240" x2="960" y2="240" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />

              {/* Country Circles */}
              {mapNodes.map((node) => {
                const compData = activeIndicator.countryComparison.find((c) => c.code === node.code);
                const isSelected = selectedCountryCode === node.code;

                return (
                  <g
                    key={node.code}
                    onClick={() => setSelectedCountryCode(node.code)}
                    className="cursor-pointer group"
                  >
                    {/* Ripple animation for India */}
                    {node.code === 'IND' && (
                      <circle cx={node.cx} cy={node.cy} r={node.r + 12} fill="#10b981" opacity="0.15" className="animate-ping" />
                    )}

                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r}
                      fill={isSelected ? '#10b981' : node.color}
                      opacity={isSelected ? 0.9 : 0.6}
                      stroke={isSelected ? '#ffffff' : '#1e293b'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-300 hover:opacity-100 hover:scale-110"
                    />

                    <text
                      x={node.cx}
                      y={node.cy + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {node.code}
                    </text>

                    {/* Tooltip on Hover */}
                    <title>{`${node.name}: ${compData ? compData.formattedValue : 'N/A'}`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Click any node to inspect country metrics for this indicator</span>
            <span className="text-emerald-400 font-semibold">Source: {activeIndicator.source.organization}</span>
          </div>
        </div>

        {/* Selected Country Indicator Details Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Selected Country</div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCountryData.name} ({selectedCountryData.code})</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {selectedCountryData.region}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="text-xs text-slate-500 font-medium">Indicator Score / Standing</div>
              <div className="text-2xl font-black text-slate-900">
                {activeCountryComp ? activeCountryComp.formattedValue : activeIndicator.latestIndiaValue}
              </div>
              <div className="text-xs text-slate-600">
                Rank Position:{' '}
                <span className="font-bold text-emerald-700">
                  #{activeCountryComp?.rank || activeIndicator.latestIndiaRank}
                </span>{' '}
                globally
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Why This Indicator Matters:</div>
              <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {activeIndicator.whyItMatters}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Key Policy Drivers:</div>
              <ul className="space-y-1">
                {activeIndicator.keyDriversAndPolicies.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectIndicator(activeIndicator)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Complete Indicator Deep Dive</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
