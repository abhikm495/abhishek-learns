import { NextResponse } from "next/server";

export const revalidate = 86400;

function decode(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function meta(html: string, names: string[]): string | undefined {
  for (const name of names) {
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`,
        "i"
      ),
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) return decode(m[1].trim());
    }
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad protocol");
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AbhishekLearnsBot/1.0; +https://abhishek-learns.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(timeout);

    const html = await res.text();
    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];

    const data = {
      url: parsed.toString(),
      domain: parsed.hostname.replace(/^www\./, ""),
      title:
        meta(html, ["og:title", "twitter:title"]) ||
        (titleTag ? decode(titleTag.trim()) : parsed.hostname),
      description:
        meta(html, ["og:description", "twitter:description", "description"]) || "",
      image: meta(html, ["og:image", "twitter:image", "twitter:image:src"]) || "",
      siteName: meta(html, ["og:site_name"]) || "",
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json(
      {
        url: parsed.toString(),
        domain: parsed.hostname.replace(/^www\./, ""),
        title: parsed.hostname,
        description: "",
        image: "",
        siteName: "",
      },
      { status: 200 }
    );
  }
}
