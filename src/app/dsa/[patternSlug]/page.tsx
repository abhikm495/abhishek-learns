import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPatternBySlug } from "@/lib/data/get-dsa-pattern";

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

export default async function PatternPage({
  params,
}: {
  params: Promise<{ patternSlug: string }>;
}) {
  const { patternSlug } = await params;
  const pattern = await getPatternBySlug("dsa", patternSlug);
  if (!pattern) notFound();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/dsa" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← DSA Patterns
        </Link>
        <h1 className="text-3xl font-bold">{pattern.title}</h1>
        {pattern.description && (
          <p className="text-[var(--muted)]">{pattern.description}</p>
        )}
        {pattern.whenToUse.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {pattern.whenToUse.map((use) => (
              <Badge key={use} variant="accent">
                {use}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {pattern.useCases.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Real-World Use Cases</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pattern.useCases.map((useCase) => (
              <Card key={useCase.id}>
                <h3 className="font-medium">{useCase.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{useCase.description}</p>
                {useCase.techExample && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium">In tech: </span>
                    {useCase.techExample}
                  </p>
                )}
                {useCase.companyOrProduct && (
                  <span className="mt-2 inline-block">
                    <Badge>{useCase.companyOrProduct}</Badge>
                  </span>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        {pattern.questions.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--muted)]">No questions added yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pattern.questions.map((question, index) => (
              <Card key={question.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <Link
                      href={`/dsa/${patternSlug}/${question.slug}`}
                      className="text-lg font-medium hover:text-[var(--accent)]"
                    >
                      {index + 1}. {question.title}
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={difficultyVariant[question.difficulty]}>
                        {question.difficulty}
                      </Badge>
                      {question.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {platformLabels[link.platform] || link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export const dynamic = "force-dynamic";
