import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { Markdown } from "@/components/Markdown";
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

/** Server-rendered read-only solution list (no Apollo / client hooks). */
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
        ))}
      </div>
    </section>
  );
}
