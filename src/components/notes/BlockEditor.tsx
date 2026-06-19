"use client";

import { useState } from "react";
import { formatCpp } from "@/lib/format-cpp";
import { getYouTubeId } from "@/lib/youtube";
import { BLOCK_LABELS, type Block, type BlockType } from "@/lib/notes-types";

const CODE_LANGUAGES = [
  "cpp",
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "sql",
  "bash",
  "json",
  "text",
];

const CALLOUT_VARIANTS = [
  { value: "info", label: "💡 Info" },
  { value: "tip", label: "✅ Tip" },
  { value: "warning", label: "⚠️ Warning" },
  { value: "danger", label: "🚫 Caution" },
];

const ADD_OPTIONS: { type: BlockType; icon: string }[] = [
  { type: "heading", icon: "H" },
  { type: "paragraph", icon: "¶" },
  { type: "code", icon: "{ }" },
  { type: "bullets", icon: "•" },
  { type: "callout", icon: "💡" },
  { type: "youtube", icon: "▶" },
  { type: "link", icon: "🔗" },
  { type: "divider", icon: "—" },
];

function newBlock(type: BlockType): Block {
  switch (type) {
    case "heading":
      return { type, text: "", level: 2 };
    case "paragraph":
      return { type, text: "" };
    case "code":
      return { type, code: "", language: "cpp" };
    case "youtube":
      return { type, url: "", title: "" };
    case "link":
      return { type, url: "", title: "", description: "" };
    case "callout":
      return { type, text: "", variant: "info" };
    case "bullets":
      return { type, items: [""] };
    case "divider":
      return { type };
    default:
      return { type: "paragraph", text: "" };
  }
}

const fieldClass =
  "w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

function BlockFields({
  block,
  update,
}: {
  block: Block;
  update: (patch: Partial<Block>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="flex gap-2">
          <select
            value={block.level ?? 2}
            onChange={(e) => update({ level: Number(e.target.value) })}
            className="w-24 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input
            value={block.text ?? ""}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Heading text"
            className={`${fieldClass} font-semibold`}
          />
        </div>
      );

    case "paragraph":
      return (
        <textarea
          value={block.text ?? ""}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Write text… (markdown supported: **bold**, `code`, [links](url))"
          className={`${fieldClass} min-h-[90px] resize-y`}
        />
      );

    case "code":
      return <CodeFields block={block} update={update} />;

    case "youtube":
      return <YouTubeFields block={block} update={update} />;

    case "link":
      return (
        <div className="space-y-2">
          <input
            value={block.url ?? ""}
            onChange={(e) => update({ url: e.target.value })}
            placeholder="https://example.com/article"
            className={fieldClass}
          />
          <p className="text-xs text-[var(--muted)]">
            A rich preview (title, description, image) is generated automatically on the page.
            Optionally override below.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={block.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Override title (optional)"
              className={fieldClass}
            />
            <input
              value={block.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Override description (optional)"
              className={fieldClass}
            />
          </div>
        </div>
      );

    case "callout":
      return (
        <div className="space-y-2">
          <select
            value={block.variant ?? "info"}
            onChange={(e) => update({ variant: e.target.value })}
            className="w-40 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            {CALLOUT_VARIANTS.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
          <textarea
            value={block.text ?? ""}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Callout text (markdown supported)"
            className={`${fieldClass} min-h-[70px] resize-y`}
          />
        </div>
      );

    case "bullets":
      return (
        <textarea
          value={(block.items ?? []).join("\n")}
          onChange={(e) => update({ items: e.target.value.split("\n") })}
          placeholder={"One bullet per line\nSecond point\nThird point"}
          className={`${fieldClass} min-h-[110px] resize-y`}
        />
      );

    case "divider":
      return <div className="border-t border-dashed border-[var(--card-border)]" />;

    default:
      return null;
  }
}

function CodeFields({
  block,
  update,
}: {
  block: Block;
  update: (patch: Partial<Block>) => void;
}) {
  const language = block.language || "cpp";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const code = block.code ?? "";
      const next = code.slice(0, start) + "    " + code.slice(end);
      update({ code: next });
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <select
          value={language}
          onChange={(e) => update({ language: e.target.value })}
          className="w-40 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-1.5 text-xs outline-none focus:border-[var(--accent)]"
        >
          {CODE_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        {language === "cpp" && (
          <button
            type="button"
            onClick={() => update({ code: formatCpp(block.code ?? "") })}
            className="rounded-md border border-[var(--card-border)] px-2.5 py-1 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Format C++
          </button>
        )}
      </div>
      <textarea
        value={block.code ?? ""}
        onChange={(e) => update({ code: e.target.value })}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder="// paste or write code here"
        className="min-h-[200px] w-full rounded-lg border border-[var(--card-border)] bg-[#0d1117] px-4 py-3 font-mono text-sm leading-relaxed text-[#e6edf3] outline-none focus:border-[var(--accent)]"
      />
    </div>
  );
}

function YouTubeFields({
  block,
  update,
}: {
  block: Block;
  update: (patch: Partial<Block>) => void;
}) {
  const id = getYouTubeId(block.url ?? "");
  return (
    <div className="space-y-2">
      <input
        value={block.url ?? ""}
        onChange={(e) => update({ url: e.target.value })}
        placeholder="https://youtube.com/watch?v=…"
        className={fieldClass}
      />
      <input
        value={block.title ?? ""}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Caption (optional)"
        className={fieldClass}
      />
      {id ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-[var(--card-border)] bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt="video preview"
            className="h-full w-full object-cover"
          />
        </div>
      ) : block.url ? (
        <p className="text-xs text-red-500">Could not detect a YouTube video id from that URL.</p>
      ) : null}
    </div>
  );
}

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);

  const updateAt = (index: number, patch: Partial<Block>) => {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const removeAt = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = (type: BlockType) => {
    onChange([...blocks, newBlock(type)]);
    setShowAdd(false);
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <p className="rounded-lg border border-dashed border-[var(--card-border)] px-4 py-6 text-center text-sm text-[var(--muted)]">
          No blocks yet. Add a heading, text, code, video or link below.
        </p>
      )}

      {blocks.map((block, index) => (
        <div
          key={index}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md bg-[var(--background-subtle)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                title="Move up"
                className="rounded-md px-2 py-1 text-sm text-[var(--muted)] transition hover:bg-[var(--background-subtle)] disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === blocks.length - 1}
                title="Move down"
                className="rounded-md px-2 py-1 text-sm text-[var(--muted)] transition hover:bg-[var(--background-subtle)] disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeAt(index)}
                title="Delete block"
                className="rounded-md px-2 py-1 text-sm text-red-500 transition hover:bg-red-500/10"
              >
                ✕
              </button>
            </div>
          </div>
          <BlockFields block={block} update={(patch) => updateAt(index, patch)} />
        </div>
      ))}

      <div className="rounded-xl border border-dashed border-[var(--card-border)] p-3">
        {showAdd ? (
          <div className="flex flex-wrap gap-2">
            {ADD_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => add(opt.type)}
                className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span className="text-xs">{opt.icon}</span>
                {BLOCK_LABELS[opt.type]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="w-full rounded-lg py-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
          >
            + Add block
          </button>
        )}
      </div>
    </div>
  );
}
