"use client";

import { useEffect, useState } from "react";

interface Preview {
  url: string;
  domain: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
}

interface LinkCardProps {
  url: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function LinkCard({ url, fallbackTitle, fallbackDescription }: LinkCardProps) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setPreview(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [url]);

  let domain = "";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    domain = url;
  }

  const title = preview?.title || fallbackTitle || domain;
  const description = preview?.description || fallbackDescription || "";
  const image = preview?.image;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition hover:border-[var(--accent)] hover:shadow-md"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <span className="inline-block h-3.5 w-3.5 rounded-sm bg-[var(--accent-soft)]" />
          {preview?.domain || domain}
        </div>
        <p className="truncate font-medium group-hover:text-[var(--accent)]">
          {loading ? "Loading preview…" : title}
        </p>
        {description && (
          <p className="line-clamp-2 text-sm text-[var(--muted)]">{description}</p>
        )}
      </div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="hidden h-[120px] w-[200px] flex-shrink-0 object-cover sm:block"
          loading="lazy"
        />
      )}
    </a>
  );
}
