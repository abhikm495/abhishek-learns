"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_PATTERNS } from "@/graphql/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Pattern {
  id: string;
  slug: string;
  title: string;
  questionCount: number;
}

export default function AdminPage() {
  const { data, loading } = useQuery<{ patterns: Pattern[] }>(GET_PATTERNS, {
    variables: { categorySlug: "dsa" },
  });

  const patterns = data?.patterns ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-[var(--muted)]">Manage DSA patterns, questions, and solutions.</p>
        </div>
        <Link href="/admin/patterns/new">
          <Button>+ New Pattern</Button>
        </Link>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Patterns</h2>
          {!loading && patterns.length > 0 && (
            <span className="rounded-full bg-[var(--background-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
              {patterns.length} total
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[68px] animate-pulse rounded-xl border border-[var(--card-border)] bg-[var(--background-subtle)]"
              />
            ))}
          </div>
        ) : patterns.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--muted)]">
              No patterns yet. Run <code className="rounded bg-[var(--background-subtle)] px-1.5 py-0.5">npm run seed</code> or
              create one with “New Pattern”.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="transition hover:border-[var(--accent)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{pattern.title}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {pattern.questionCount} questions · /dsa/{pattern.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/patterns/${pattern.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/admin/patterns/${pattern.id}/questions/new`}>
                      <Button size="sm">+ Add Problem</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-[var(--muted)]">
        Tip: After adding content, refresh the public pages to see your updates.
      </p>
    </div>
  );
}
