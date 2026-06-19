"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  CREATE_SOLUTION,
  DELETE_SOLUTION,
  UPDATE_SOLUTION,
} from "@/graphql/queries";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { Markdown } from "@/components/Markdown";
import { formatCpp } from "@/lib/format-cpp";

export type Approach = "brute" | "better" | "optimal";

export interface Solution {
  id: string;
  approach: Approach;
  title: string;
  explanation: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  order: number;
}

const approachLabels: Record<Approach, string> = {
  brute: "Brute Force",
  better: "Better Approach",
  optimal: "Optimal Solution",
};

const approachOrder: Record<Approach, number> = { brute: 0, better: 1, optimal: 2 };

function sortSolutions(list: Solution[]) {
  return [...list].sort((a, b) => approachOrder[a.approach] - approachOrder[b.approach]);
}

interface FormState {
  approach: Approach;
  title: string;
  explanation: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const emptyForm: FormState = {
  approach: "optimal",
  title: "",
  explanation: "",
  code: "",
  timeComplexity: "",
  spaceComplexity: "",
};

function SolutionForm({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: FormState;
  saving: boolean;
  onSave: (form: FormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFormatCode = () => update("code", formatCpp(form.code));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, code: formatCpp(form.code) });
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Insert spaces on Tab instead of losing focus
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = form.code.slice(0, start) + "    " + form.code.slice(end);
      update("code", next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--card)] p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Approach
          <select
            value={form.approach}
            onChange={(e) => update("approach", e.target.value as Approach)}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="brute">Brute Force</option>
            <option value="better">Better</option>
            <option value="optimal">Optimal</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Title
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
            placeholder="e.g. Two Pointers — Optimal"
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Approach / Explanation (markdown)
        <textarea
          value={form.explanation}
          onChange={(e) => update("explanation", e.target.value)}
          placeholder="Describe the idea, intuition, and steps..."
          className="min-h-[100px] rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
      </label>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">C++ Code</span>
          <button
            type="button"
            onClick={handleFormatCode}
            className="rounded-md border border-[var(--card-border)] px-2.5 py-1 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Format C++
          </button>
        </div>
        <textarea
          value={form.code}
          onChange={(e) => update("code", e.target.value)}
          onKeyDown={handleCodeKeyDown}
          spellCheck={false}
          placeholder={"class Solution {\npublic:\n    // ...\n};"}
          className="min-h-[260px] w-full rounded-lg border border-[var(--card-border)] bg-[#0d1117] px-4 py-3 font-mono text-sm leading-relaxed text-[#e6edf3] outline-none focus:border-[var(--accent)]"
        />
        <p className="text-xs text-[var(--muted)]">
          Code auto-formats on save. Press Tab for a 4-space indent.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Time Complexity
          <input
            value={form.timeComplexity}
            onChange={(e) => update("timeComplexity", e.target.value)}
            placeholder="O(n)"
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Space Complexity
          <input
            value={form.spaceComplexity}
            onChange={(e) => update("spaceComplexity", e.target.value)}
            placeholder="O(1)"
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save solution"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--background-subtle)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function QuestionSolutions({
  questionId,
  initialSolutions,
}: {
  questionId: string;
  initialSolutions: Solution[];
}) {
  const [solutions, setSolutions] = useState<Solution[]>(sortSolutions(initialSolutions));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [createSolution, { loading: creating }] = useMutation(CREATE_SOLUTION);
  const [updateSolution, { loading: updating }] = useMutation(UPDATE_SOLUTION);
  const [deleteSolution] = useMutation(DELETE_SOLUTION);

  const handleCreate = async (form: FormState) => {
    const { data } = await createSolution({
      variables: {
        input: {
          questionId,
          approach: form.approach,
          title: form.title,
          explanation: form.explanation,
          code: form.code,
          timeComplexity: form.timeComplexity,
          spaceComplexity: form.spaceComplexity,
          order: approachOrder[form.approach],
        },
      },
    });

    const newId = data?.createSolution?.id;
    if (newId) {
      setSolutions((prev) =>
        sortSolutions([
          ...prev,
          { id: newId, order: approachOrder[form.approach], ...form },
        ])
      );
    }
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, form: FormState) => {
    await updateSolution({
      variables: {
        id,
        input: {
          approach: form.approach,
          title: form.title,
          explanation: form.explanation,
          code: form.code,
          timeComplexity: form.timeComplexity,
          spaceComplexity: form.spaceComplexity,
        },
      },
    });

    setSolutions((prev) =>
      sortSolutions(
        prev.map((s) =>
          s.id === id ? { ...s, ...form, order: approachOrder[form.approach] } : s
        )
      )
    );
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this solution?")) return;
    await deleteSolution({ variables: { id } });
    setSolutions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Solutions (C++)</h2>
        {!isAdding && (
          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
            }}
            className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            + Add solution
          </button>
        )}
      </div>

      {isAdding && (
        <SolutionForm
          initial={emptyForm}
          saving={creating}
          onSave={handleCreate}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {solutions.length === 0 && !isAdding ? (
        <Card>
          <p className="text-sm text-[var(--muted)]">
            No solutions yet. Click “Add solution” to write your brute-force to optimal C++
            approach.
          </p>
        </Card>
      ) : (
        solutions.map((solution) =>
          editingId === solution.id ? (
            <SolutionForm
              key={solution.id}
              initial={solution}
              saving={updating}
              onSave={(form) => handleUpdate(solution.id, form)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <Card key={solution.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{solution.title}</h3>
                  <Badge variant="accent">{approachLabels[solution.approach]}</Badge>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(solution.id);
                      setIsAdding(false);
                    }}
                    className="rounded-md border border-[var(--card-border)] px-2.5 py-1 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(solution.id)}
                    className="rounded-md border border-[var(--card-border)] px-2.5 py-1 text-xs font-medium text-red-600 transition hover:border-red-500 hover:bg-red-500/10 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {solution.explanation && <Markdown content={solution.explanation} />}

              {(solution.timeComplexity || solution.spaceComplexity) && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {solution.timeComplexity && (
                    <span>
                      <span className="font-medium">Time: </span>
                      <code className="rounded bg-[var(--background-subtle)] px-1.5 py-0.5">
                        {solution.timeComplexity}
                      </code>
                    </span>
                  )}
                  {solution.spaceComplexity && (
                    <span>
                      <span className="font-medium">Space: </span>
                      <code className="rounded bg-[var(--background-subtle)] px-1.5 py-0.5">
                        {solution.spaceComplexity}
                      </code>
                    </span>
                  )}
                </div>
              )}

              {solution.code && <CodeBlock code={solution.code} language="cpp" />}
            </Card>
          )
        )
      )}
    </section>
  );
}
