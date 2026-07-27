'use client';

import React from 'react';
import Markdown from 'react-markdown';

interface FormattedMarkdownProps {
  content: string;
  variant?: 'light' | 'dark';
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({
  content,
  variant = 'light',
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`formatted-markdown text-xs leading-relaxed space-y-1.5 ${isDark ? 'text-[#E8D9C8]' : 'text-slate-800'}`}>
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className={`text-sm sm:text-base font-extrabold pb-1.5 mt-4 mb-2 border-b ${isDark ? 'text-[#F7C331] border-[#52433A]' : 'text-[#3C2F2F] border-[#DCC7AA]'}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-xs sm:text-sm font-bold mt-3.5 mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-[#F7882F]' : 'text-[#D46917]'}`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-xs font-bold mt-2.5 mb-1 ${isDark ? 'text-white' : 'text-[#3C2F2F]'}`}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 space-y-1 mb-2.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-1 mb-2.5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className={`border-l-3 p-2.5 my-2.5 rounded-r-lg italic ${isDark ? 'border-[#F7882F] bg-[#4A3E3D] text-[#E8D9C8]' : 'border-[#F7882F] bg-[#FFF2E8] text-slate-800'}`}>
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${isDark ? 'bg-[#3C2F2F] text-[#F7C331]' : 'bg-white text-[#D46917] border border-[#DCC7AA]'}`}>
              {children}
            </code>
          ),
          hr: () => (
            <hr className={`my-3 ${isDark ? 'border-[#52433A]' : 'border-[#DCC7AA]'}`} />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
