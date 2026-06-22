import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { BlockRenderer, headingId } from "@/components/notes/BlockRenderer";
import { getTopicBySlug } from "@/lib/data/get-topics";
import { getTrack } from "@/lib/tracks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; topicSlug: string }>;
}): Promise<Metadata> {
  const { track, topicSlug } = await params;
  const topic = await getTopicBySlug(track, topicSlug);
  if (topic) return { title: `${topic.title} — Abhishek Learns` };
  return { title: "Abhishek Learns" };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ track: string; topicSlug: string }>;
}) {
  const { track, topicSlug } = await params;
  const meta = getTrack(track);
  if (!meta) notFound();

  const topic = await getTopicBySlug(track, topicSlug).catch((err) => {
    console.error("[TopicPage] DB error:", err);
    return null;
  });
  if (!topic) notFound();

  const toc = topic.blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === "heading" && (block.level ?? 2) <= 2 && block.text)
    .map(({ block, index }) => ({
      id: headingId(index),
      text: block.text as string,
      level: block.level ?? 2,
    }));

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href={`/learn/${track}`}
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← {meta.name}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{topic.title}</h1>
        {topic.summary && (
          <p className="max-w-2xl text-lg text-[var(--muted)]">{topic.summary}</p>
        )}
        {topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {topic.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
        <article className="min-w-0 max-w-3xl">
          <BlockRenderer blocks={topic.blocks} />
        </article>

        {toc.length > 1 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                On this page
              </p>
              <nav className="space-y-1.5 border-l border-[var(--card-border)]">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block border-l-2 border-transparent text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${
                      item.level >= 2 ? "pl-3" : "pl-3 font-medium"
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
