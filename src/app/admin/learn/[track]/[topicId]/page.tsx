"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TOPIC_BY_ID, UPDATE_TOPIC } from "@/graphql/queries";
import { getTrack } from "@/lib/tracks";
import { Button } from "@/components/ui/Button";
import { BlockEditor } from "@/components/notes/BlockEditor";
import { BlockRenderer } from "@/components/notes/BlockRenderer";
import type { Block, BlockType } from "@/lib/notes-types";

interface TopicData {
  id: string;
  track: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  order: number;
  blocks: Block[];
}

const BLOCK_KEYS: (keyof Block)[] = [
  "type",
  "text",
  "level",
  "code",
  "language",
  "url",
  "title",
  "description",
  "items",
  "variant",
];

function cleanBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => {
    const out: Record<string, unknown> = { type: block.type as BlockType };
    for (const key of BLOCK_KEYS) {
      if (key === "type") continue;
      const value = block[key];
      if (value !== undefined && value !== null) out[key] = value;
    }
    return out as unknown as Block;
  });
}

const fieldClass =
  "w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

export default function TopicEditorPage({
  params,
}: {
  params: Promise<{ track: string; topicId: string }>;
}) {
  const { track, topicId } = use(params);
  const meta = getTrack(track);
  const router = useRouter();

  const { data, loading } = useQuery<{ topicById: TopicData | null }>(GET_TOPIC_BY_ID, {
    variables: { id: topicId },
  });
  const [updateTopic, { loading: saving }] = useMutation(UPDATE_TOPIC);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const topic = data?.topicById;
    if (topic) {
      setTitle(topic.title);
      setSlug(topic.slug);
      setSummary(topic.summary ?? "");
      setTags((topic.tags ?? []).join(", "));
      setBlocks(cleanBlocks(topic.blocks ?? []));
    }
  }, [data]);

  if (!meta) return <p className="text-[var(--muted)]">Unknown track.</p>;

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-[var(--background-subtle)]" />;
  }

  if (!data?.topicById) {
    return (
      <div className="space-y-3">
        <p className="text-[var(--muted)]">Topic not found.</p>
        <Link href={`/admin/learn/${track}`} className="text-sm text-[var(--accent)]">
          ← Back to {meta.name} topics
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    setError("");
    setSaved(false);
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      await updateTopic({
        variables: {
          id: topicId,
          input: {
            title: title.trim(),
            slug: slug.trim(),
            summary: summary.trim(),
            tags: tagList,
            blocks: cleanBlocks(blocks),
          },
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/learn/${track}`}
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← {meta.name} topics
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {preview ? "Edit" : "Preview"}
          </button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      )}

      {preview ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title || "Untitled"}</h1>
            {summary && <p className="text-lg text-[var(--muted)]">{summary}</p>}
          </div>
          <div className="max-w-3xl">
            <BlockRenderer blocks={blocks} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${fieldClass} text-base font-semibold`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`${fieldClass} font-mono`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="oops, solid, design"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="One or two lines describing this topic."
                className={`${fieldClass} min-h-[70px] resize-y`}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Content</h2>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>
        </>
      )}
    </div>
  );
}
