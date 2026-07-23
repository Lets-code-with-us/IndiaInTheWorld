'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  BrainCircuit,
  Globe,
} from 'lucide-react';
import { ChatMessage } from '../lib/types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am **India Index AI**, powered by Gemini 2.5 Flash. Ask me anything about India’s global rankings, international indicators, state development metrics (e.g. Bihar, Delhi, Maharashtra), policy drivers, or country comparisons.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQueries: [
        'Analyze Bihar state development indicators',
        'Show India’s innovation ranking trajectory',
        'Compare India & Vietnam on FDI and manufacturing',
        'Top 5 policy recommendations to improve India’s HDI',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || 'I have analyzed your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Sorry, I encountered an issue connecting to the AI model. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [inputQuery, loading, messages]);

  const processedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      processedQueryRef.current = null;
      return;
    }

    if (initialQuery && processedQueryRef.current !== initialQuery) {
      processedQueryRef.current = initialQuery;
      handleSend(initialQuery);
    }
  }, [initialQuery, isOpen, handleSend]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-[#3C2F2F] text-white p-4 flex items-center justify-between border-b border-[#52433A] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F7882F]/20 text-[#F7882F] border border-[#F7882F]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F7C331]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Ask India Index AI</span>
                <span className="text-[9px] bg-[#F7882F]/20 text-[#F7C331] px-1.5 py-0.5 rounded border border-[#F7882F]/30 font-semibold">
                  Gemini AI
                </span>
              </h3>
              <p className="text-[11px] text-[#E8D9C8]">Global Analytics & Policy Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#52433A] text-[#E8D9C8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#FAF6EF]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#D46917] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#F7882F] text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-white text-neutral-800 border border-[#DCC7AA] rounded-tl-none shadow-sm'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-line">{msg.text}</div>

                {msg.suggestedQueries && (
                  <div className="pt-2 border-t border-[#DCC7AA]/60 space-y-1.5">
                    <div className="text-[10px] font-bold text-[#7C6C62] uppercase tracking-wide">Suggested Prompts</div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQueries.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="text-[11px] bg-[#FAF6EF] text-[#3C2F2F] hover:bg-[#F7882F]/10 border border-[#DCC7AA] px-2.5 py-1 rounded-lg text-left transition-colors font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[9px] text-right ${msg.sender === 'user' ? 'text-amber-100' : 'text-[#8A786D]'}`}>{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#52433A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center bg-[#FFF2E8] p-3 rounded-xl border border-[#F7882F]/30 text-neutral-800 text-xs shadow-sm">
              <BrainCircuit className="w-4 h-4 text-[#F7882F] animate-pulse shrink-0" />
              <div className="space-y-0.5">
                <div className="font-bold text-[11px] text-[#F7882F]">Processing Intelligence Response...</div>
                <div className="text-[10px] text-[#7C6C62]">Synthesizing ranking metrics & policy data</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#DCC7AA] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask India Index AI (e.g. Bihar, GDP, HDI, GII)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#FAF6EF] border border-[#DCC7AA] rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F7882F]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2 rounded-xl bg-[#F7882F] hover:bg-[#D46917] text-white transition-colors disabled:opacity-50 shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
