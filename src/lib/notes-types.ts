export type BlockType =
  | "heading"
  | "paragraph"
  | "code"
  | "youtube"
  | "link"
  | "callout"
  | "bullets"
  | "divider";

export interface Block {
  type: BlockType;
  text?: string | null;
  level?: number | null;
  code?: string | null;
  language?: string | null;
  url?: string | null;
  title?: string | null;
  description?: string | null;
  items?: (string | null)[] | null;
  variant?: string | null;
}

export interface Topic {
  id: string;
  track: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  order: number;
  blocks: Block[];
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Text",
  code: "Code",
  youtube: "YouTube",
  link: "Link preview",
  callout: "Callout",
  bullets: "Bullet list",
  divider: "Divider",
};
