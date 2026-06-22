import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { getTopicsByTrack } from "@/lib/data/get-topics";
import { getTrack } from "@/lib/tracks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  const meta = getTrack(track);
  return { title: meta ? `${meta.name} — Abhishek Learns` : "Abhishek Learns" };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const meta = getTrack(track);
  if (!meta) notFound();

  const topics = await getTopicsByTrack(track).catch((err) => {
    console.error("[TrackPage] DB error:", err);
    return [];
  });

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← All tracks
        </Link>
        <div className="flex items-center gap-4">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accent} text-xl font-bold text-white`}
          >
            {meta.icon}
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{meta.name}</h1>
            <p className="text-[var(--muted)]">{meta.description}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {topics.length} {topics.length === 1 ? "topic" : "topics"}
        </p>
      </div>

      {topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card)] p-10 text-center">
          <p className="text-base font-medium">No topics yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Add your first {meta.name} topic from the admin panel.
          </p>
          <Link
            href={`/admin/learn/${track}`}
            className="mt-4 inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Manage {meta.name} topics
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/learn/${track}/${topic.slug}`}
              className="group flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold group-hover:text-[var(--accent)]">
                {topic.title}
              </h2>
              {topic.summary && (
                <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{topic.summary}</p>
              )}
              {topic.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topic.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                Read
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
