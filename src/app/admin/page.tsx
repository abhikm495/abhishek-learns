"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_PATTERNS } from "@/graphql/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TRACKS } from "@/lib/tracks";

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
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-[var(--muted)]">Manage every learning track from one place.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Notes tracks
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <Link
              key={track.slug}
              href={`/admin/learn/${track.slug}`}
              className="group flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${track.accent} text-sm font-bold text-white`}
              >
                {track.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold group-hover:text-[var(--accent)]">
                {track.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{track.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                Manage topics
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            DSA sheet
          </h2>
          <Link href="/admin/patterns/new">
            <Button size="sm">+ New Pattern</Button>
          </Link>
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
              No patterns yet. Run{" "}
              <code className="rounded bg-[var(--background-subtle)] px-1.5 py-0.5">
                npm run seed
              </code>{" "}
              or create one with “New Pattern”.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[var(--muted)]">{patterns.length} patterns</p>
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
    </div>
  );
}
