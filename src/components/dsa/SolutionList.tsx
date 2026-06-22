import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  approachLabels,
  approachOrder,
  type Approach,
  type SolutionData,
} from "@/lib/dsa-types";

function sortSolutions(list: SolutionData[]) {
  return [...list].sort(
    (a, b) => (approachOrder[a.approach as Approach] ?? 0) - (approachOrder[b.approach as Approach] ?? 0)
  );
}

/** Fully server-rendered solution list — no client components, no Apollo. */
export function SolutionList({ solutions }: { solutions: SolutionData[] }) {
  const sorted = sortSolutions(solutions);

  if (sorted.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--muted)]">No solutions yet.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Solutions (C++)</h2>
      <div className="space-y-4">
        {sorted.map((solution) => (
          <Card key={solution.id} className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold">{solution.title}</h3>
              <Badge variant="accent">{approachLabels[solution.approach]}</Badge>
            </div>

            {solution.explanation && (
              <p className="text-sm leading-relaxed text-[var(--muted)]">{solution.explanation}</p>
            )}

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

            {solution.code && (
              <div className="overflow-hidden rounded-xl border border-[var(--card-border)]">
                <div className="border-b border-[var(--card-border)] bg-[#161b22] px-4 py-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#8b949e]">
                    cpp
                  </span>
                </div>
                <pre className="overflow-x-auto bg-[#0d1117] p-4 text-sm leading-relaxed text-[#e6edf3]">
                  <code>{solution.code}</code>
                </pre>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
