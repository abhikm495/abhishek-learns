"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  if (!content) return null;
  return (
    <div className="prose max-w-none text-[var(--foreground)]">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
