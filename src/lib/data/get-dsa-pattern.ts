import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Pattern } from "@/models/Pattern";
import { Question } from "@/models/Question";
import { UseCase } from "@/models/UseCase";

export interface QuestionLink {
  platform: string;
  url: string;
  externalId?: string;
}

export interface PatternQuestion {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  links: QuestionLink[];
  tags: string[];
  order: number;
}

export interface PatternUseCase {
  id: string;
  title: string;
  description: string;
  techExample: string;
  companyOrProduct?: string;
}

export interface PatternDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  whenToUse: string[];
  questions: PatternQuestion[];
  useCases: PatternUseCase[];
}

export async function getPatternBySlug(
  categorySlug: string,
  patternSlug: string
): Promise<PatternDetail | null> {
  await connectDB();

  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) return null;

  const pattern = await Pattern.findOne({
    categoryId: category._id,
    slug: patternSlug,
  }).lean();
  if (!pattern) return null;

  const [questions, useCases] = await Promise.all([
    Question.find({ patternId: pattern._id }).sort({ order: 1 }).lean(),
    UseCase.find({ patternId: pattern._id }).lean(),
  ]);

  return {
    id: String(pattern._id),
    slug: pattern.slug,
    title: pattern.title,
    description: pattern.description ?? "",
    whenToUse: pattern.whenToUse ?? [],
    questions: questions.map((q) => ({
      id: String(q._id),
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      links: (q.links ?? []).map((link) => ({
        platform: link.platform,
        url: link.url,
        externalId: link.externalId ?? undefined,
      })),
      tags: q.tags ?? [],
      order: q.order,
    })),
    useCases: useCases.map((u) => ({
      id: String(u._id),
      title: u.title,
      description: u.description ?? "",
      techExample: u.techExample ?? "",
      companyOrProduct: u.companyOrProduct ?? undefined,
    })),
  };
}
