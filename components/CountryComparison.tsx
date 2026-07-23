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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-emerald-600" />
            <span>Side-by-Side Country Comparison</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare India&apos;s global index standings directly with major global peers and emerging economies.
          </p>
        </div>

        {/* Target Country Selector */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 pl-2">Compare India vs:</span>
          <select
            value={targetCode}
            onChange={(e) => {
              setTargetCode(e.target.value);
              setAiComparisonText(null);
            }}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                IND
              </div>
              <div>
                <h3 className="text-lg font-bold">India</h3>
                <p className="text-xs text-slate-400">{indiaCountry.region}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Reference Nation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-xs">
            <div>
              <div className="text-slate-400">Nominal GDP</div>
              <div className="text-base font-bold text-emerald-400">{indiaCountry.gdpNominal}</div>
            </div>
            <div>
              <div className="text-slate-400">Population</div>
              <div className="text-base font-bold text-slate-200">{indiaCountry.population}</div>
            </div>
          </div>
        </div>

        {/* Target Country Profile Card */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-lg">
                {targetCountry.code}
              </div>
              <div>
                <h3 className="text-lg font-bold">{targetCountry.name}</h3>
                <p className="text-xs text-slate-500">{targetCountry.region}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Benchmark Peer
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
            <div>
              <div className="text-slate-500">Nominal GDP</div>
              <div className="text-base font-bold text-slate-900">{targetCountry.gdpNominal}</div>
            </div>
            <div>
              <div className="text-slate-500">Population</div>
              <div className="text-base font-bold text-slate-800">{targetCountry.population}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart & Bar Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Comparison Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Multidimensional Policy Radar</h3>
          <p className="text-xs text-slate-500">Comparing relative category strengths (0-100 scale)</p>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="India" dataKey="India" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                <Radar name={targetCountry.name} dataKey="Target" stroke="#3b82f6" fill="#60a5fa" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Strategic Analysis Generator */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Strategic Peer Analysis</span>
              </h3>
              <button
                onClick={fetchAiComparison}
                disabled={loadingAi}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'Analyzing...' : 'Generate AI Comparison'}
              </button>
            </div>

            {aiComparisonText ? (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line border border-slate-200">
                {aiComparisonText}
              </div>
            ) : (
              <div className="mt-6 p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <Globe className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Ready to Analyze India vs {targetCountry.name}</div>
                <p className="text-[11px] text-slate-500">
                  Click the button above to generate a deep-dive AI comparison on trade, FDI, tech readiness, and policy synergies.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenAiAssistant(`Compare India and ${targetCountry.name} across FDI inflows, innovation, and digital infrastructure.`)}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask AI Assistant for Detailed Questions</span>
          </button>
        </div>
      </div>

      {/* Direct Indicator Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Detailed Indicator Rank Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Global Indicator</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">India (IND)</th>
                <th className="p-3 text-center">{targetCountry.name} ({targetCountry.code})</th>
                <th className="p-3 text-right">Advantage / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <span>{ind.name}</span>
                    </td>
                    <td className="p-3 text-slate-500">{ind.category}</td>
                    <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/50 rounded">
                      #{indiaRank} ({ind.latestIndiaValue})
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-800">
                      {targetComp ? `#${targetComp.rank} (${targetComp.formattedValue})` : 'N/A'}
                    </td>
                    <td className="p-3 text-right font-bold">
                      {isIndiaBetter ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          India Ahead
                        </span>
                      ) : (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
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
