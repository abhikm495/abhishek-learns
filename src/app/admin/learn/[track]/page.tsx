"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import slugify from "slugify";
import { CREATE_TOPIC, DELETE_TOPIC, GET_TOPICS } from "@/graphql/queries";
import { getTrack } from "@/lib/tracks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface TopicItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
}

export default function AdminTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = use(params);
  const meta = getTrack(track);
  const router = useRouter();

  const { data, loading, refetch } = useQuery<{ topics: TopicItem[] }>(GET_TOPICS, {
    variables: { track },
    skip: !meta,
  });
  const [createTopic, { loading: creating }] = useMutation(CREATE_TOPIC);
  const [deleteTopic] = useMutation(DELETE_TOPIC);

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const topics = data?.topics ?? [];

  if (!meta) {
    return <p className="text-[var(--muted)]">Unknown track.</p>;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = title.trim();
    if (!trimmed) return;
    const slug = slugify(trimmed, { lower: true, strict: true });
    try {
      const { data: created } = await createTopic({
        variables: {
          input: { track, slug, title: trimmed, order: topics.length },
        },
      });
      const id = created?.createTopic?.id;
      if (id) router.push(`/admin/learn/${track}/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create topic");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete topic “${name}”? This cannot be undone.`)) return;
    await deleteTopic({ variables: { id } });
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← Admin
        </Link>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accent} text-base font-bold text-white`}
          >
            {meta.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{meta.name} topics</h1>
            <p className="text-sm text-[var(--muted)]">Create and edit {meta.name} notes.</p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="new-topic" className="text-sm font-medium">
              New topic title
            </label>
            <input
              id="new-topic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SOLID Principles"
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <Button type="submit" disabled={creating || !title.trim()}>
            {creating ? "Creating…" : "Create & edit"}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All topics</h2>
          {!loading && (
            <span className="rounded-full bg-[var(--background-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
              {topics.length} total
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[68px] animate-pulse rounded-xl border border-[var(--card-border)] bg-[var(--background-subtle)]"
              />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--muted)]">
              No topics yet. Create your first one above.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <Card key={topic.id} className="transition hover:border-[var(--accent)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{topic.title}</h3>
                    <p className="truncate text-sm text-[var(--muted)]">
                      /learn/{track}/{topic.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/learn/${track}/${topic.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/learn/${track}/${topic.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(topic.id, topic.title)}
                    >
                      Delete
                    </Button>
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
