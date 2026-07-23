'use client';

import React from 'react';
import {
  X,
  Bookmark,
  Download,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { GLOBAL_INDICATORS } from '../lib/data/indicators';

interface WatchlistExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistIds: string[];
  onRemoveFromWatchlist: (id: string) => void;
  onClearWatchlist: () => void;
}

export const WatchlistExportModal: React.FC<WatchlistExportModalProps> = ({
  isOpen,
  onClose,
  watchlistIds,
  onRemoveFromWatchlist,
  onClearWatchlist,
}) => {
  if (!isOpen) return null;

  const watchlistedIndicators = GLOBAL_INDICATORS.filter((i) => watchlistIds.includes(i.id));

  const exportCSV = () => {
    if (watchlistedIndicators.length === 0) return;

    const headers = ['Indicator Name', 'Category', 'India Rank', 'Metric Score', 'Change Delta', 'Source Organization', 'Verified Year'];
    const rows = watchlistedIndicators.map((i) => [
      `"${i.name}"`,
      `"${i.category}"`,
      i.latestIndiaRank,
      `"${i.latestIndiaValue}"`,
      `"${i.changeDelta}"`,
      `"${i.source.organization}"`,
      i.source.lastUpdatedYear,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `India_Global_Index_Watchlist_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Saved Indicators Watchlist</h3>
              <p className="text-xs text-slate-400">{watchlistedIndicators.length} indicators saved</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Watchlist Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 text-xs">
          {watchlistedIndicators.length > 0 ? (
            watchlistedIndicators.map((ind) => (
              <div
                key={ind.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">{ind.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {ind.category} • Rank <strong className="text-emerald-700">#{ind.latestIndiaRank}</strong> ({ind.latestIndiaValue})
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFromWatchlist(ind.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Globe className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold">Your Watchlist is empty</div>
              <p className="text-[11px]">Click the bookmark icon on any indicator to save it for quick export.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {watchlistedIndicators.length > 0 && (
            <button
              onClick={onClearWatchlist}
              className="text-slate-500 hover:text-red-600 text-xs font-semibold"
            >
              Clear All
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={exportCSV}
              disabled={watchlistedIndicators.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
