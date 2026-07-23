'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Sparkles, Search, FileText, Bookmark, Globe, Building2 } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keyCombo: ['Ctrl', 'K'],
      macCombo: ['⌘', 'K'],
      description: 'Open Global Command Palette & Indicator Search',
      icon: Search,
    },
    {
      keyCombo: ['Ctrl', 'I'],
      macCombo: ['⌘', 'I'],
      description: 'Open AI Assistant Drawer for Grounded Policy Q&A',
      icon: Sparkles,
    },
    {
      keyCombo: ['Ctrl', 'Shift', 'R'],
      macCombo: ['⌘', 'Shift', 'R'],
      description: 'Generate 2026 AI Executive Annual Report Card',
      icon: FileText,
    },
    {
      keyCombo: ['Ctrl', 'Shift', 'W'],
      macCombo: ['⌘', 'Shift', 'W'],
      description: 'Open Saved Watchlist & Export CSV Manager',
      icon: Bookmark,
    },
    {
      keyCombo: ['?'],
      macCombo: ['?'],
      description: 'Toggle Keyboard Shortcuts Help Center',
      icon: Keyboard,
    },
    {
      keyCombo: ['Esc'],
      macCombo: ['Esc'],
      description: 'Close Active Modals & Slide-over Drawers',
      icon: X,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#3C2F2F] text-white rounded-3xl max-w-lg w-full border border-[#52433A] shadow-2xl overflow-hidden p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#52433A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7882F] flex items-center justify-center text-white">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
                <p className="text-xs text-[#E8D9C8]">Power user navigation shortcuts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#4A3E3D] hover:bg-[#52433A] text-[#C4B2A5] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Shortcuts */}
          <div className="space-y-3">
            {shortcuts.map((sc, i) => {
              const Icon = sc.icon;
              return (
                <div
                  key={i}
                  className="p-3 bg-[#4A3E3D] rounded-2xl border border-[#52433A] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#F7882F] shrink-0" />
                    <span className="text-xs font-semibold text-[#E8D9C8]">{sc.description}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {sc.keyCombo.map((k, kIdx) => (
                      <React.Fragment key={kIdx}>
                        <kbd className="px-2 py-1 bg-[#3C2F2F] rounded-lg text-xs font-mono font-bold text-[#F7C331] border border-[#52433A] shadow-sm">
                          {k}
                        </kbd>
                        {kIdx < sc.keyCombo.length - 1 && (
                          <span className="text-[10px] text-[#C4B2A5]">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-[#C4B2A5]">
            Press <kbd className="px-1.5 py-0.5 bg-[#4A3E3D] rounded text-[#F7C331] font-mono">?</kbd> anytime to toggle this modal.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
