'use client';

import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';
import { COMPARISON_COUNTRIES } from '../lib/data/countries';
import { Indicator, CountryProfile } from '../lib/types';

interface CountryComparisonProps {
  onSelectIndicator: (indicator: Indicator) => void;
  onOpenAiAssistant: (initialQuery?: string) => void;
}

export const CountryComparison: React.FC<CountryComparisonProps> = ({
  onSelectIndicator,
  onOpenAiAssistant,
}) => {
  const [targetCode, setTargetCode] = useState<string>('VNM'); // Default to Vietnam
  const [aiComparisonText, setAiComparisonText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const targetCountry = COMPARISON_COUNTRIES.find((c) => c.code === targetCode) || COMPARISON_COUNTRIES[1];
  const indiaCountry = COMPARISON_COUNTRIES.find((c) => c.code === 'IND') || COMPARISON_COUNTRIES[0];

  // Radar Data for key categories (normalized scale 0-100 where higher is better performance)
  const radarData = [
    { category: 'Economy', India: 82, Target: targetCode === 'USA' ? 95 : targetCode === 'CHN' ? 92 : 65 },
    { category: 'Innovation', India: 72, Target: targetCode === 'USA' ? 98 : targetCode === 'DEU' ? 92 : 62 },
    { category: 'Governance', India: 58, Target: targetCode === 'DEU' ? 92 : targetCode === 'JPN' ? 88 : 55 },
    { category: 'Healthcare', India: 62, Target: targetCode === 'JPN' ? 95 : targetCode === 'DEU' ? 90 : 60 },
    { category: 'Environment', India: 78, Target: targetCode === 'DEU' ? 88 : targetCode === 'USA' ? 45 : 68 },
    { category: 'Cybersecurity', India: 98, Target: targetCode === 'USA' ? 100 : targetCode === 'DEU font' ? 92 : 82 },
  ];

  const fetchAiComparison = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compare-country',
          compareCountryCode: targetCountry.code,
        }),
      });
      const data = await res.json();
      setAiComparisonText(data.text || 'Comparison analysis complete.');
    } catch (err) {
      console.error('Comparison AI Error:', err);
      setAiComparisonText('Failed to load AI comparison.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#DCC7AA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#F7882F]" />
            <span>Side-by-Side Country Comparison</span>
          </h1>
          <p className="text-xs text-[#6B7A8F] mt-1">
            Compare India&apos;s global index standings directly with major global peers and emerging economies.
          </p>
        </div>

        {/* Target Country Selector */}
        <div className="flex items-center gap-3 bg-[#FAF6EF] p-2 rounded-xl border border-[#DCC7AA]">
          <span className="text-xs font-bold text-[#6B7A8F] pl-2">Compare India vs:</span>
          <select
            value={targetCode}
            onChange={(e) => {
              setTargetCode(e.target.value);
              setAiComparisonText(null);
            }}
            className="bg-white border border-[#DCC7AA] rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
          >
            {COMPARISON_COUNTRIES.filter((c) => c.code !== 'IND').map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Country Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* India Profile Card */}
        <div className="bg-[#3C2F2F] text-white rounded-2xl p-6 border border-[#52433A] shadow-xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7882F]/20 text-[#F7C331] border border-[#F7882F]/30 flex items-center justify-center font-bold text-lg">
                IND
              </div>
              <div>
                <h3 className="text-lg font-bold">India</h3>
                <p className="text-xs text-[#E8D9C8]">{indiaCountry.region}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F7882F]/20 text-[#F7C331] border border-[#F7882F]/30">
              Reference Nation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#4A3E3D] p-3.5 rounded-xl border border-[#52433A] text-xs">
            <div>
              <div className="text-[#C4B2A5]">Nominal GDP</div>
              <div className="text-base font-bold text-[#F7882F]">{indiaCountry.gdpNominal}</div>
            </div>
            <div>
              <div className="text-[#C4B2A5]">Population</div>
              <div className="text-base font-bold text-[#E8D9C8]">{indiaCountry.population}</div>
            </div>
          </div>
        </div>

        {/* Target Country Profile Card */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] text-slate-800 border border-[#DCC7AA] flex items-center justify-center font-bold text-lg">
                {targetCountry.code}
              </div>
              <div>
                <h3 className="text-lg font-bold">{targetCountry.name}</h3>
                <p className="text-xs text-[#6B7A8F]">{targetCountry.region}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF6EF] text-[#6B7A8F] border border-[#DCC7AA]">
              Benchmark Peer
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#FAF6EF] p-3.5 rounded-xl border border-[#DCC7AA]/80 text-xs">
            <div>
              <div className="text-[#6B7A8F]">Nominal GDP</div>
              <div className="text-base font-bold text-slate-900">{targetCountry.gdpNominal}</div>
            </div>
            <div>
              <div className="text-[#6B7A8F]">Population</div>
              <div className="text-base font-bold text-slate-800">{targetCountry.population}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart & Bar Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Comparison Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Multidimensional Policy Radar</h3>
          <p className="text-xs text-[#6B7A8F]">Comparing relative category strengths (0-100 scale)</p>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#DCC7AA" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#6B7A8F', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="India" dataKey="India" stroke="#F7882F" fill="#F7882F" fillOpacity={0.4} />
                <Radar name={targetCountry.name} dataKey="Target" stroke="#6B7A8F" fill="#6B7A8F" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Strategic Analysis Generator */}
        <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#DCC7AA]/60 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F7882F]" />
                <span>AI Strategic Peer Analysis</span>
              </h3>
              <button
                onClick={fetchAiComparison}
                disabled={loadingAi}
                className="px-3 py-1.5 rounded-lg bg-[#F7882F] hover:bg-[#D46917] text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'Analyzing...' : 'Generate AI Comparison'}
              </button>
            </div>

            {aiComparisonText ? (
              <div className="mt-4 p-4 bg-[#FAF6EF] rounded-xl text-xs text-slate-700 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line border border-[#DCC7AA]">
                {aiComparisonText}
              </div>
            ) : (
              <div className="mt-6 p-8 text-center bg-[#FAF6EF] rounded-xl border border-dashed border-[#DCC7AA] space-y-2">
                <Globe className="w-8 h-8 text-[#6B7A8F] mx-auto" />
                <div className="text-xs font-bold text-slate-700">Ready to Analyze India vs {targetCountry.name}</div>
                <p className="text-[11px] text-[#6B7A8F]">
                  Click the button above to generate a deep-dive AI comparison on trade, FDI, tech readiness, and policy synergies.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenAiAssistant(`Compare India and ${targetCountry.name} across FDI inflows, innovation, and digital infrastructure.`)}
            className="w-full py-2.5 rounded-xl bg-[#3C2F2F] text-[#F7C331] text-xs font-semibold hover:bg-[#4A3E3D] transition-colors flex items-center justify-center gap-2 border border-[#F7882F]/30"
          >
            <Sparkles className="w-4 h-4 text-[#F7882F]" />
            <span>Ask AI Assistant for Detailed Questions</span>
          </button>
        </div>
      </div>

      {/* Direct Indicator Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#DCC7AA] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Detailed Indicator Rank Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF6EF] text-[#6B7A8F] uppercase text-[10px] font-bold border-b border-[#DCC7AA]">
              <tr>
                <th className="p-3">Global Indicator</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">India (IND)</th>
                <th className="p-3 text-center">{targetCountry.name} ({targetCountry.code})</th>
                <th className="p-3 text-right">Advantage / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC7AA]/40">
              {GLOBAL_INDICATORS.map((ind) => {
                const targetComp = ind.countryComparison.find((c) => c.code === targetCountry.code);
                const indiaComp = ind.countryComparison.find((c) => c.code === 'IND');

                const targetRank = targetComp?.rank || 'N/A';
                const indiaRank = ind.latestIndiaRank;

                const isIndiaBetter =
                  typeof targetRank === 'number' ? indiaRank < targetRank : true;

                return (
                  <tr
                    key={ind.id}
                    onClick={() => onSelectIndicator(ind)}
                    className="hover:bg-[#FAF6EF] cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <span>{ind.name}</span>
                    </td>
                    <td className="p-3 text-[#6B7A8F]">{ind.category}</td>
                    <td className="p-3 text-center font-bold text-[#D46917] bg-[#FFF2E8] rounded border border-[#F7882F]/20">
                      #{indiaRank} ({ind.latestIndiaValue})
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-800">
                      {targetComp ? `#${targetComp.rank} (${targetComp.formattedValue})` : 'N/A'}
                    </td>
                    <td className="p-3 text-right font-bold">
                      {isIndiaBetter ? (
                        <span className="text-[#D46917] bg-[#FFF2E8] px-2 py-0.5 rounded border border-[#F7882F]/30 text-[11px]">
                          India Ahead
                        </span>
                      ) : (
                        <span className="text-[#6B7A8F] bg-[#FAF6EF] px-2 py-0.5 rounded border border-[#DCC7AA] text-[11px]">
                          {targetCountry.name} Ahead
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
