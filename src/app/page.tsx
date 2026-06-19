import Link from "next/link";
import { TRACKS } from "@/lib/tracks";

interface TrackCard {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  href: string;
}

const tracks: TrackCard[] = [
  {
    slug: "dsa",
    name: "DSA",
    description: "Pattern-wise sheet with brute-force to optimal C++ solutions and use cases.",
    icon: "{ }",
    accent: "from-indigo-500 to-violet-500",
    href: "/dsa",
  },
  ...TRACKS.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    icon: t.icon,
    accent: t.accent,
    href: `/learn/${t.slug}`,
  })),
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="animate-fade-in-up space-y-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          Interview prep, organized
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Everything you learn,{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            in one place.
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">
          DSA patterns, system design, React, Next.js and JavaScript — notes with code, videos and
          rich links. Fully dynamic and editable from the admin panel.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/dsa"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Open DSA Sheet
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)]"
          >
            Manage content
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Learning tracks
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <Link
              key={track.slug}
              href={track.href}
              className="group relative flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${track.accent} text-sm font-bold text-white`}
                >
                  {track.icon}
                </span>
                <span className="rounded-full bg-[var(--success)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--success)]">
                  Available
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{track.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{track.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                Start learning
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
