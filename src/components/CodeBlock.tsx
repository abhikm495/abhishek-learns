"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "cpp" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--card-border)]">
      <div className="flex items-center justify-between border-b border-[var(--card-border)] bg-[#161b22] px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[#8b949e]">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-2 py-1 text-xs font-medium text-[#8b949e] transition hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#0d1117] p-4 text-sm leading-relaxed text-[#e6edf3]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
