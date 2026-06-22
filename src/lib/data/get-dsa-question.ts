import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Pattern } from "@/models/Pattern";
import { Question } from "@/models/Question";
import { Solution } from "@/models/Solution";
import { UseCase } from "@/models/UseCase";
import type { Approach } from "@/lib/dsa-types";

export interface QuestionLink {
  platform: string;
  url: string;
  externalId?: string;
}

export interface QuestionSolution {
  id: string;
  approach: Approach;
  title: string;
  explanation: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  order: number;
}

export interface QuestionUseCase {
  id: string;
  title: string;
  description: string;
  techExample: string;
  companyOrProduct?: string;
}

export interface QuestionDetail {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  links: QuestionLink[];
  tags: string[];
  pattern: {
    id: string;
    slug: string;
    title: string;
    useCases: QuestionUseCase[];
  };
  solutions: QuestionSolution[];
}

export async function getQuestionBySlug(
  categorySlug: string,
  patternSlug: string,
  questionSlug: string
): Promise<QuestionDetail | null> {
  await connectDB();

  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) return null;

  const pattern = await Pattern.findOne({
    categoryId: category._id,
    slug: patternSlug,
  }).lean();
  if (!pattern) return null;

  const question = await Question.findOne({
    patternId: pattern._id,
    slug: questionSlug,
  }).lean();
  if (!question) return null;

  const [solutions, useCases] = await Promise.all([
    Solution.find({ questionId: question._id }).sort({ order: 1 }).lean(),
    UseCase.find({ patternId: pattern._id }).lean(),
  ]);

  return {
    id: String(question._id),
    slug: question.slug,
    title: question.title,
    difficulty: question.difficulty,
    links: (question.links ?? []).map((link) => ({
      platform: link.platform,
      url: link.url,
      externalId: link.externalId ?? undefined,
    })),
    tags: question.tags ?? [],
    pattern: {
      id: String(pattern._id),
      slug: pattern.slug,
      title: pattern.title,
      useCases: useCases.map((u) => ({
        id: String(u._id),
        title: u.title,
        description: u.description ?? "",
        techExample: u.techExample ?? "",
        companyOrProduct: u.companyOrProduct ?? undefined,
      })),
    },
    solutions: solutions.map((s) => ({
      id: String(s._id),
      approach: s.approach as Approach,
      title: s.title,
      explanation: s.explanation ?? "",
      code: s.code ?? "",
      timeComplexity: s.timeComplexity ?? "",
      spaceComplexity: s.spaceComplexity ?? "",
      order: s.order,
    })),
  };
}
