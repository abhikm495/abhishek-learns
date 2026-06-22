import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Pattern } from "@/models/Pattern";
import { Question } from "@/models/Question";
import { Topic } from "@/models/Topic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Quick production check: confirms MongoDB is reachable from this deployment. */
export async function GET() {
  try {
    await connectDB();
    const category = await Category.findOne({ slug: "dsa" }).lean();
    const [categories, topics, dsaQuestions] = await Promise.all([
      Category.countDocuments(),
      Topic.countDocuments({ track: "lld" }),
      category
        ? Question.countDocuments({
            patternId: {
              $in: await Pattern.find({ categoryId: category._id }).distinct("_id"),
            },
          })
        : Promise.resolve(0),
    ]);

    let sampleQuestion: string | null = null;
    if (category) {
      const pattern = await Pattern.findOne({
        categoryId: category._id,
        slug: "two-pointers",
      }).lean();
      if (pattern) {
        const question = await Question.findOne({
          patternId: pattern._id,
          slug: "two-sum-ii-input-array-is-sorted",
        }).lean();
        sampleQuestion = question ? question.title : null;
      }
    }

    return NextResponse.json({
      ok: true,
      categories,
      lldTopics: topics,
      dsaQuestions,
      sampleQuestion,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
