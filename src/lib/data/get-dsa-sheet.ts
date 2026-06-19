import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Pattern } from "@/models/Pattern";
import { Question } from "@/models/Question";

export interface QuestionLink {
  platform: string;
  url: string;
  externalId?: string;
}

export interface SheetQuestion {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  links: QuestionLink[];
  completed: boolean;
  order: number;
}

export interface PatternSheet {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  completedCount: number;
  questions: SheetQuestion[];
}

export interface DSASheet {
  totalQuestions: number;
  completedQuestions: number;
  patterns: PatternSheet[];
}

export async function getDSASheet(): Promise<DSASheet> {
  await connectDB();

  const category = await Category.findOne({ slug: "dsa" });
  if (!category) {
    return { totalQuestions: 0, completedQuestions: 0, patterns: [] };
  }

  const patterns = await Pattern.find({ categoryId: category._id }).sort({ order: 1 }).lean();
  const patternIds = patterns.map((p) => p._id);
  const questions = await Question.find({ patternId: { $in: patternIds } }).sort({ order: 1 }).lean();

  const questionsByPattern = new Map<string, typeof questions>();
  for (const q of questions) {
    const key = String(q.patternId);
    if (!questionsByPattern.has(key)) questionsByPattern.set(key, []);
    questionsByPattern.get(key)!.push(q);
  }

  const totalQuestions = questions.length;
  const completedQuestions = questions.filter((q) => q.completed).length;

  return {
    totalQuestions,
    completedQuestions,
    patterns: patterns.map((p) => {
      const patternQuestions = questionsByPattern.get(String(p._id)) ?? [];
      return {
        id: String(p._id),
        slug: p.slug,
        title: p.title,
        description: p.description ?? "",
        order: p.order,
        completedCount: patternQuestions.filter((q) => q.completed).length,
        questions: patternQuestions.map((q) => ({
          id: String(q._id),
          slug: q.slug,
          title: q.title,
          difficulty: q.difficulty,
          links: (q.links ?? []).map((link) => ({
            platform: link.platform,
            url: link.url,
            externalId: link.externalId ?? undefined,
          })),
          completed: q.completed ?? false,
          order: q.order,
        })),
      };
    }),
  };
}
