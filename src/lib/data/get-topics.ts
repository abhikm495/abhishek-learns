import { connectDB } from "@/lib/db";
import { Topic } from "@/models/Topic";
import type { Block } from "@/lib/notes-types";

export interface TopicListItem {
  id: string;
  track: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  order: number;
}

export interface TopicDetail extends TopicListItem {
  blocks: Block[];
}

function mapBlock(block: Record<string, unknown>): Block {
  return {
    type: block.type as Block["type"],
    text: (block.text as string) ?? null,
    level: (block.level as number) ?? null,
    code: (block.code as string) ?? null,
    language: (block.language as string) ?? null,
    url: (block.url as string) ?? null,
    title: (block.title as string) ?? null,
    description: (block.description as string) ?? null,
    items: (block.items as string[]) ?? null,
    variant: (block.variant as string) ?? null,
  };
}

export async function getTopicsByTrack(track: string): Promise<TopicListItem[]> {
  await connectDB();
  const topics = await Topic.find({ track }).sort({ order: 1, createdAt: 1 }).lean();
  return topics.map((t) => ({
    id: String(t._id),
    track: t.track,
    slug: t.slug,
    title: t.title,
    summary: t.summary ?? "",
    tags: t.tags ?? [],
    order: t.order,
  }));
}

export async function getTopicBySlug(
  track: string,
  slug: string
): Promise<TopicDetail | null> {
  await connectDB();
  const topic = await Topic.findOne({ track, slug }).lean();
  if (!topic) return null;

  return {
    id: String(topic._id),
    track: topic.track,
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary ?? "",
    tags: topic.tags ?? [],
    order: topic.order,
    blocks: (topic.blocks ?? []).map((b) => mapBlock(b as Record<string, unknown>)),
  };
}
