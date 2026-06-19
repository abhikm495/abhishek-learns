export interface TrackMeta {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
}

/** Note-based learning tracks (everything except the DSA sheet). */
export const TRACKS: TrackMeta[] = [
  {
    slug: "lld",
    name: "LLD",
    description: "Low Level Design — OOP, SOLID, design patterns and machine-coding rounds.",
    icon: "▢",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    slug: "hld",
    name: "HLD",
    description: "High Level Design — scalable systems, databases, caching and queues.",
    icon: "⛁",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    slug: "react",
    name: "React",
    description: "Core concepts, hooks, rendering, performance and patterns.",
    icon: "⚛",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    slug: "nextjs",
    name: "Next.js",
    description: "App Router, rendering strategies, caching and internals.",
    icon: "▲",
    accent: "from-slate-500 to-slate-700",
  },
  {
    slug: "javascript",
    name: "JavaScript",
    description: "Closures, async, prototypes, the event loop and deep dives.",
    icon: "JS",
    accent: "from-amber-500 to-yellow-500",
  },
];

const TRACK_MAP = new Map(TRACKS.map((t) => [t.slug, t]));

export function getTrack(slug: string): TrackMeta | undefined {
  return TRACK_MAP.get(slug);
}

export function isValidTrack(slug: string): boolean {
  return TRACK_MAP.has(slug);
}

export const TRACK_SLUGS = TRACKS.map((t) => t.slug);
