import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Topic } from "@/models/Topic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Quick production check: confirms MongoDB is reachable from this deployment. */
export async function GET() {
  try {
    await connectDB();
    const [categories, topics] = await Promise.all([
      Category.countDocuments(),
      Topic.countDocuments({ track: "lld" }),
    ]);
    return NextResponse.json({
      ok: true,
      categories,
      lldTopics: topics,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
