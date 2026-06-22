"use client";

import dynamic from "next/dynamic";
import type { SolutionData } from "@/lib/dsa-types";

const QuestionSolutions = dynamic(
  () => import("./QuestionSolutions").then((m) => m.QuestionSolutions),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--background-subtle)]" />
        <div className="h-48 animate-pulse rounded-xl bg-[var(--background-subtle)]" />
      </div>
    ),
  }
);

export function QuestionSolutionsEditor({
  questionId,
  initialSolutions,
}: {
  questionId: string;
  initialSolutions: SolutionData[];
}) {
  return (
    <QuestionSolutions questionId={questionId} initialSolutions={initialSolutions} />
  );
}
