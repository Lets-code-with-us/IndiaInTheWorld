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
      text: 'Hello! I am **India Index AI**, powered by Gemini 3.1 Pro with High Thinking Mode. Ask me anything about India’s global rankings, international indicators, policy drivers, or country comparisons.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQueries: [
        'Show India’s innovation ranking trajectory',
        'Compare India & Vietnam on FDI and manufacturing',
        'Why is India’s Press Freedom rank low?',
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

  useEffect(() => {
    if (initialQuery && isOpen) {
      const timer = setTimeout(() => {
        handleSend(initialQuery);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, isOpen, handleSend]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Ask India Index AI</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                  Thinking Mode HIGH
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Gemini 3.1 Pro Reasoning Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-line">{msg.text}</div>

                {msg.suggestedQueries && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Suggested Prompts</div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQueries.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="text-[11px] bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-left transition-colors font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-slate-400 text-right">{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
              <BrainCircuit className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
              <div className="space-y-0.5">
                <div className="font-bold text-[11px]">Reasoning with ThinkingLevel.HIGH...</div>
                <div className="text-[10px] text-emerald-700">Synthesizing dataset metrics & policy context</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask India Index AI (e.g. GDP, HDI, GII)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
