"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import {
  TOGGLE_ALL_QUESTIONS_COMPLETED,
  TOGGLE_PATTERN_QUESTIONS_COMPLETED,
  TOGGLE_QUESTION_COMPLETED,
} from "@/graphql/queries";
import { Badge } from "@/components/ui/Badge";
import type { DSASheet, PatternSheet, SheetQuestion } from "@/lib/data/get-dsa-sheet";

const difficultyVariant = {
  easy: "easy" as const,
  medium: "medium" as const,
  hard: "hard" as const,
};

const platformLabels: Record<string, string> = {
  leetcode: "LeetCode",
  gfg: "GFG",
  codeforces: "Codeforces",
  hackerrank: "HackerRank",
};

function getPlatformLink(links: SheetQuestion["links"], platform: string) {
  return links.find((l) => l.platform === platform);
}

function applyCompletedToSheet(sheet: DSASheet, completed: boolean, patternId?: string): DSASheet {
  const patterns = sheet.patterns.map((pattern) => {
    if (patternId && pattern.id !== patternId) return pattern;
    const questions = pattern.questions.map((q) => ({ ...q, completed }));
    return {
      ...pattern,
      questions,
      completedCount: completed ? questions.length : 0,
    };
  });

  const completedQuestions = patterns.reduce((sum, p) => sum + p.completedCount, 0);

  return { ...sheet, patterns, completedQuestions };
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "outline",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline" | "ghost";
}) {
  const styles =
    variant === "ghost"
      ? "text-[var(--muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
      : "border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] hover:text-[var(--accent)]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${styles}`}
    >
      {children}
    </button>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--background-subtle)] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--card-border)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{pct}%</span>
        <span className="text-xs text-[var(--muted)]">done</span>
      </div>
    </div>
  );
}

function PatternProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--background-subtle)]">
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function QuestionRow({
  question,
  patternSlug,
  index,
  onToggle,
}: {
  question: SheetQuestion;
  patternSlug: string;
  index: number;
  onToggle: (id: string, completed: boolean) => void;
}) {
  const leetcode = getPlatformLink(question.links, "leetcode");
  const gfg = getPlatformLink(question.links, "gfg");

  return (
    <tr
      className={`border-b border-[var(--card-border)] transition last:border-0 hover:bg-[var(--background-subtle)] ${
        question.completed ? "opacity-55" : ""
      }`}
    >
      <td className="px-4 py-3 text-sm text-[var(--muted)]">{index + 1}</td>
      <td className="px-4 py-3">
        <Link
          href={`/dsa/${patternSlug}/${question.slug}`}
          className={`font-medium hover:text-[var(--accent)] hover:underline ${
            question.completed ? "line-through" : ""
          }`}
        >
          {question.title}
        </Link>
      </td>
      <td className="px-4 py-3">
        <Badge variant={difficultyVariant[question.difficulty]}>{question.difficulty}</Badge>
      </td>
      <td className="px-4 py-3 text-center">
        {leetcode ? (
          <a
            href={leetcode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {leetcode.externalId ? `#${leetcode.externalId}` : platformLabels.leetcode}
          </a>
        ) : (
          <span className="text-[var(--muted)]">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {gfg ? (
          <a
            href={gfg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            GFG
          </a>
        ) : (
          <span className="text-[var(--muted)]">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <input
          type="checkbox"
          checked={question.completed}
          onChange={(e) => onToggle(question.id, e.target.checked)}
          className="h-4 w-4 cursor-pointer rounded border-[var(--card-border)] accent-[var(--accent)]"
          aria-label={`Mark ${question.title} as solved`}
        />
      </td>
    </tr>
  );
}

function PatternAccordion({
  pattern,
  index,
  isOpen,
  onToggleOpen,
  onQuestionToggle,
  onPatternBulkToggle,
  bulkLoading,
}: {
  pattern: PatternSheet;
  index: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onQuestionToggle: (id: string, completed: boolean) => void;
  onPatternBulkToggle: (patternId: string, completed: boolean) => void;
  bulkLoading: boolean;
}) {
  const total = pattern.questions.length;
  const allDone = total > 0 && pattern.completedCount === total;
  const noneDone = pattern.completedCount === 0;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-[var(--card)] transition ${
        isOpen ? "border-[var(--accent)]/40 shadow-sm" : "border-[var(--card-border)]"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex min-w-0 flex-1 items-center gap-4 text-left transition hover:opacity-90"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
              allDone
                ? "bg-[var(--success)]/15 text-[var(--success)]"
                : "bg-[var(--accent-soft)] text-[var(--accent)]"
            }`}
          >
            {allDone ? "✓" : index + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{pattern.title}</h2>
              <span className="text-xs font-medium text-[var(--muted)]">
                {pattern.completedCount}/{total} solved
              </span>
            </div>
            <PatternProgressBar value={pattern.completedCount} max={total} />
          </div>
          <svg
            className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[var(--card-border)]">
          <div className="flex items-center justify-end gap-2 border-b border-[var(--card-border)] bg-[var(--background-subtle)] px-4 py-2.5">
            <span className="mr-auto text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Pattern actions
            </span>
            <ActionButton
              onClick={() => onPatternBulkToggle(pattern.id, true)}
              disabled={bulkLoading || allDone}
            >
              Mark all
            </ActionButton>
            <ActionButton
              onClick={() => onPatternBulkToggle(pattern.id, false)}
              disabled={bulkLoading || noneDone}
            >
              Clear
            </ActionButton>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[var(--card-border)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <th className="w-12 px-4 py-3">#</th>
                  <th className="px-4 py-3">Problem</th>
                  <th className="w-28 px-4 py-3">Difficulty</th>
                  <th className="w-24 px-4 py-3 text-center">LeetCode</th>
                  <th className="w-20 px-4 py-3 text-center">GFG</th>
                  <th className="w-16 px-4 py-3 text-center">Solved</th>
                </tr>
              </thead>
              <tbody>
                {pattern.questions.map((question, qIndex) => (
                  <QuestionRow
                    key={question.id}
                    question={question}
                    patternSlug={pattern.slug}
                    index={qIndex}
                    onToggle={onQuestionToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function DSASheet({ initialData }: { initialData: DSASheet }) {
  const [sheet, setSheet] = useState(initialData);
  const [openPatterns, setOpenPatterns] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const [toggleCompleted] = useMutation(TOGGLE_QUESTION_COMPLETED);
  const [toggleAllCompleted] = useMutation(TOGGLE_ALL_QUESTIONS_COMPLETED);
  const [togglePatternCompleted] = useMutation(TOGGLE_PATTERN_QUESTIONS_COMPLETED);

  const stats = useMemo(() => {
    let easy = 0;
    let hard = 0;
    let medium = 0;
    for (const pattern of sheet.patterns) {
      for (const q of pattern.questions) {
        if (q.completed) {
          if (q.difficulty === "easy") easy++;
          else if (q.difficulty === "medium") medium++;
          else hard++;
        }
      }
    }
    return {
      total: sheet.totalQuestions,
      completed: sheet.completedQuestions,
      easy,
      medium,
      hard,
    };
  }, [sheet]);

  const allDone = stats.total > 0 && stats.completed === stats.total;
  const noneDone = stats.completed === 0;

  const handleQuestionToggle = async (questionId: string, completed: boolean) => {
    const prevSnapshot = sheet;

    setSheet((prev) => {
      let completedDelta = 0;
      const patterns = prev.patterns.map((pattern) => {
        const qIndex = pattern.questions.findIndex((q) => q.id === questionId);
        if (qIndex === -1) return pattern;
        const oldCompleted = pattern.questions[qIndex].completed;
        if (oldCompleted === completed) return pattern;
        completedDelta += completed ? 1 : -1;
        const questions = pattern.questions.map((q) =>
          q.id === questionId ? { ...q, completed } : q
        );
        return {
          ...pattern,
          questions,
          completedCount: questions.filter((q) => q.completed).length,
        };
      });
      if (completedDelta === 0) return prev;
      return {
        ...prev,
        patterns,
        completedQuestions: prev.completedQuestions + completedDelta,
      };
    });

    try {
      await toggleCompleted({ variables: { id: questionId, completed } });
    } catch {
      setSheet(prevSnapshot);
    }
  };

  const handleAllBulkToggle = async (completed: boolean) => {
    const prevSnapshot = sheet;
    setBulkLoading(true);
    setSheet((prev) => applyCompletedToSheet(prev, completed));

    try {
      await toggleAllCompleted({ variables: { completed } });
    } catch {
      setSheet(prevSnapshot);
    } finally {
      setBulkLoading(false);
    }
  };

  const handlePatternBulkToggle = async (patternId: string, completed: boolean) => {
    const prevSnapshot = sheet;
    setBulkLoading(true);
    setSheet((prev) => applyCompletedToSheet(prev, completed, patternId));

    try {
      await togglePatternCompleted({ variables: { patternId, completed } });
    } catch {
      setSheet(prevSnapshot);
    } finally {
      setBulkLoading(false);
    }
  };

  const togglePattern = (slug: string) => {
    setOpenPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const expandAll = () => setOpenPatterns(new Set(sheet.patterns.map((p) => p.slug)));
  const collapseAll = () => setOpenPatterns(new Set());

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← Home
        </Link>
        <h1 className="text-3xl font-bold">DSA Sheet</h1>
        <p className="text-[var(--muted)]">
          Expand a pattern, practice on LeetCode/GFG, and check off problems as you solve them.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={stats.completed} max={stats.total} />
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total" value={stats.total} />
            <StatCard
              label="Solved"
              value={stats.completed}
              accent="text-[var(--success)]"
            />
            <StatCard label="Remaining" value={stats.total - stats.completed} />
            <StatCard
              label="Patterns"
              value={sheet.patterns.length}
              accent="text-[var(--accent)]"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--card-border)] pt-4 text-xs font-medium text-[var(--muted)]">
          <span className="rounded-full bg-[var(--easy)]/10 px-2.5 py-1 text-[var(--easy)]">
            Easy solved: {stats.easy}
          </span>
          <span className="rounded-full bg-[var(--medium)]/10 px-2.5 py-1 text-[var(--medium)]">
            Medium solved: {stats.medium}
          </span>
          <span className="rounded-full bg-[var(--hard)]/10 px-2.5 py-1 text-[var(--hard)]">
            Hard solved: {stats.hard}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton onClick={() => handleAllBulkToggle(true)} disabled={bulkLoading || allDone}>
          Mark all solved
        </ActionButton>
        <ActionButton onClick={() => handleAllBulkToggle(false)} disabled={bulkLoading || noneDone}>
          Reset all
        </ActionButton>
        <span className="mx-1 h-5 w-px bg-[var(--card-border)]" />
        <ActionButton variant="ghost" onClick={expandAll}>
          Expand all
        </ActionButton>
        <ActionButton variant="ghost" onClick={collapseAll}>
          Collapse all
        </ActionButton>
      </div>

      <div className="space-y-3">
        {sheet.patterns.map((pattern, index) => (
          <PatternAccordion
            key={pattern.id}
            pattern={pattern}
            index={index}
            isOpen={openPatterns.has(pattern.slug)}
            onToggleOpen={() => togglePattern(pattern.slug)}
            onQuestionToggle={handleQuestionToggle}
            onPatternBulkToggle={handlePatternBulkToggle}
            bulkLoading={bulkLoading}
          />
        ))}
      </div>
    </div>
  );
}
