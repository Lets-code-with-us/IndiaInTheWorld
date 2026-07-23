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
  ExternalLink,
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
    { code: 'IND', name: 'India', cx: 680, cy: 260, r: 24, color: '#F7882F' },
    { code: 'USA', name: 'United States', cx: 220, cy: 180, r: 28, color: '#6B7A8F' },
    { code: 'CHN', name: 'China', cx: 740, cy: 210, r: 26, color: '#F7C331' },
    { code: 'DEU', name: 'Germany', cx: 490, cy: 150, r: 18, color: '#DCC7AA' },
    { code: 'JPN', name: 'Japan', cx: 830, cy: 190, r: 16, color: '#D46917' },
    { code: 'GBR', name: 'United Kingdom', cx: 450, cy: 140, r: 16, color: '#6B7A8F' },
    { code: 'VNM', name: 'Vietnam', cx: 730, cy: 280, r: 16, color: '#F7882F' },
    { code: 'BRA', name: 'Brazil', cx: 340, cy: 320, r: 22, color: '#F7C331' },
    { code: 'ZAF', name: 'South Africa', cx: 520, cy: 370, r: 18, color: '#DCC7AA' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#DCC7AA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F7882F]" />
            <span>Interactive World Map & Indicator Heatmap</span>
          </h1>
          <p className="text-xs text-[#6B7A8F] mt-1">
            Visualize geographic distribution and global rank density for selected policy metrics.
          </p>
        </div>

        {/* Indicator Selector Dropdown */}
        <div className="flex items-center gap-3 bg-[#FAF6EF] p-2 rounded-xl border border-[#DCC7AA]">
          <span className="text-xs font-bold text-[#6B7A8F] pl-2">Select Indicator:</span>
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

      {/* Map Stage & Country Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG World Canvas */}
        <div className="lg:col-span-2 bg-[#3C2F2F] rounded-2xl p-6 border border-[#52433A] shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#52433A] pb-3 text-white">
            <div>
              <div className="text-xs font-bold text-[#F7C331] uppercase tracking-wider">{activeIndicator.category}</div>
              <h2 className="text-base font-bold text-white">{activeIndicator.name}</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4A3E3D] text-[#E8D9C8] border border-[#52433A]">
              India Rank: #{activeIndicator.latestIndiaRank}
            </span>
          </div>

          {/* Map Graphic Container */}
          <div className="relative w-full h-80 my-4 flex items-center justify-center">
            <svg viewBox="0 0 960 480" className="w-full h-full text-slate-800 select-none">
              {/* World Map Grids */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(220,199,170,0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="960" height="480" fill="url(#grid)" />

              {/* Equator Line */}
              <line x1="0" y1="240" x2="960" y2="240" stroke="rgba(220,199,170,0.15)" strokeDasharray="4 4" />

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
                      <circle cx={node.cx} cy={node.cy} r={node.r + 12} fill="#F7882F" opacity="0.2" className="animate-ping" />
                    )}

                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r}
                      fill={isSelected ? '#F7882F' : node.color}
                      opacity={isSelected ? 0.95 : 0.65}
                      stroke={isSelected ? '#ffffff' : '#3C2F2F'}
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

          <div className="flex flex-wrap items-center justify-between text-xs text-[#E8D9C8] pt-2 border-t border-[#52433A]">
            <span>Click any node to inspect country metrics for this indicator</span>
            <a
              href={activeIndicator.source.url}
              target="_blank"
              rel="noreferrer"
              className="text-[#F7C331] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Source: {activeIndicator.source.organization} ({activeIndicator.source.datasetName})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Selected Country Indicator Details Panel */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
              <div>
                <div className="text-[10px] text-[#6B7A8F] font-bold uppercase">Selected Country</div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCountryData.name} ({selectedCountryData.code})</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF6EF] text-[#6B7A8F] border border-[#DCC7AA]">
                {selectedCountryData.region}
              </span>
            </div>

            <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#DCC7AA] space-y-2">
              <div className="text-xs text-[#6B7A8F] font-medium">Indicator Score / Standing</div>
              <div className="text-2xl font-black text-slate-900">
                {activeCountryComp ? activeCountryComp.formattedValue : activeIndicator.latestIndiaValue}
              </div>
              <div className="text-xs text-slate-600">
                Rank Position:{' '}
                <span className="font-bold text-[#F7882F]">
                  #{activeCountryComp?.rank || activeIndicator.latestIndiaRank}
                </span>{' '}
                globally
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Why This Indicator Matters:</div>
              <p className="leading-relaxed bg-[#FAF6EF] p-3 rounded-lg border border-[#DCC7AA]/80 text-[#6B7A8F]">
                {activeIndicator.whyItMatters}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Key Policy Drivers:</div>
              <ul className="space-y-1">
                {activeIndicator.keyDriversAndPolicies.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[#6B7A8F]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F7882F] shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectIndicator(activeIndicator)}
            className="w-full py-2.5 rounded-xl bg-[#3C2F2F] hover:bg-[#4A3E3D] text-[#F7C331] text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[#F7882F]/30"
          >
            <span>Open Complete Indicator Deep Dive</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
