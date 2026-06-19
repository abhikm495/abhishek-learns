import { CodeBlock } from "@/components/CodeBlock";
import { Markdown } from "@/components/Markdown";
import { LinkCard } from "@/components/notes/LinkCard";
import { getYouTubeId } from "@/lib/youtube";
import type { Block } from "@/lib/notes-types";

const calloutStyles: Record<string, string> = {
  info: "border-sky-500/30 bg-sky-500/10",
  tip: "border-emerald-500/30 bg-emerald-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  danger: "border-red-500/30 bg-red-500/10",
};

const calloutEmoji: Record<string, string> = {
  info: "💡",
  tip: "✅",
  warning: "⚠️",
  danger: "🚫",
};

export function headingId(index: number): string {
  return `heading-${index}`;
}

function HeadingBlock({ block, id }: { block: Block; id: string }) {
  const level = block.level ?? 2;
  const text = block.text ?? "";
  if (level <= 1) {
    return (
      <h2 id={id} className="mt-2 scroll-mt-24 text-2xl font-bold tracking-tight">
        {text}
      </h2>
    );
  }
  if (level === 2) {
    return (
      <h3
        id={id}
        className="mt-2 scroll-mt-24 border-b border-[var(--card-border)] pb-1.5 text-xl font-semibold"
      >
        {text}
      </h3>
    );
  }
  return (
    <h4 id={id} className="mt-1 scroll-mt-24 text-lg font-semibold">
      {text}
    </h4>
  );
}

function SingleBlock({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} id={headingId(index)} />;

    case "paragraph":
      return (
        <div className="leading-relaxed text-[var(--foreground)]">
          <Markdown content={block.text ?? ""} />
        </div>
      );

    case "code":
      return <CodeBlock code={block.code ?? ""} language={block.language || "cpp"} />;

    case "youtube": {
      const id = getYouTubeId(block.url ?? "");
      if (!id) return null;
      return (
        <div className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--card-border)] bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${id}`}
              title={block.title || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.title && (
            <p className="text-sm text-[var(--muted)]">{block.title}</p>
          )}
        </div>
      );
    }

    case "link":
      if (!block.url) return null;
      return (
        <LinkCard
          url={block.url}
          fallbackTitle={block.title ?? undefined}
          fallbackDescription={block.description ?? undefined}
        />
      );

    case "callout": {
      const variant = block.variant || "info";
      return (
        <div
          className={`flex gap-3 rounded-xl border px-4 py-3 ${
            calloutStyles[variant] ?? calloutStyles.info
          }`}
        >
          <span className="text-lg leading-none">{calloutEmoji[variant] ?? "💡"}</span>
          <div className="flex-1 text-sm leading-relaxed">
            <Markdown content={block.text ?? ""} />
          </div>
        </div>
      );
    }

    case "bullets": {
      const items = (block.items ?? []).filter((i): i is string => Boolean(i && i.trim()));
      if (!items.length) return null;
      return (
        <ul className="ml-1 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[var(--foreground)]">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case "divider":
      return <hr className="border-[var(--card-border)]" />;

    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) {
    return (
      <p className="text-sm text-[var(--muted)]">No content yet.</p>
    );
  }
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <SingleBlock key={i} block={block} index={i} />
      ))}
    </div>
  );
}
