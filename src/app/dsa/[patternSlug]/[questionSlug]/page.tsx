import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Solution } from "@/components/dsa/QuestionSolutions";
import { QuestionSolutions } from "@/components/dsa/QuestionSolutions";
import { graphqlFetch } from "@/lib/graphql-server";
import { GET_QUESTION_QUERY } from "@/graphql/queryStrings";

interface UseCase {
  id: string;
  title: string;
  description: string;
  techExample: string;
  companyOrProduct?: string;
}

interface Question {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  links: { platform: string; url: string; externalId?: string }[];
  tags: string[];
  pattern: {
    id: string;
    slug: string;
    title: string;
    useCases: UseCase[];
  };
  solutions: Solution[];
}

const difficultyVariant = {
  easy: "easy" as const,
  medium: "medium" as const,
  hard: "hard" as const,
};

const platformLabels: Record<string, string> = {
  leetcode: "LeetCode",
  gfg: "GFG",
};

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ patternSlug: string; questionSlug: string }>;
}) {
  const { patternSlug, questionSlug } = await params;

  let question: Question | null = null;

  try {
    const data = await graphqlFetch<{ question: Question | null }>(GET_QUESTION_QUERY, {
      categorySlug: "dsa",
      patternSlug,
      questionSlug,
    });
    question = data.question;
  } catch {
    question = null;
  }

  if (!question) notFound();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <Link href="/dsa" className="hover:text-[var(--accent)]">
            DSA
          </Link>
          <span>/</span>
          <Link href={`/dsa/${patternSlug}`} className="hover:text-[var(--accent)]">
            {question.pattern.title}
          </Link>
        </div>
        <h1 className="text-3xl font-bold">{question.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant[question.difficulty]}>
            {question.difficulty}
          </Badge>
          <Badge variant="accent">{question.pattern.title}</Badge>
          {question.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {question.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
            >
              Open on {platformLabels[link.platform] || link.platform}
              {link.externalId ? ` #${link.externalId}` : ""}
            </a>
          ))}
        </div>
      </div>

      <QuestionSolutions questionId={question.id} initialSolutions={question.solutions} />

      {question.pattern.useCases.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Practical Use Cases in Tech</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {question.pattern.useCases.map((useCase) => (
              <Card key={useCase.id}>
                <h3 className="font-medium">{useCase.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{useCase.description}</p>
                {useCase.techExample && (
                  <p className="mt-2 text-sm">{useCase.techExample}</p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
