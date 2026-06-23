import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Pattern } from "@/models/Pattern";
import { Question } from "@/models/Question";
import { Solution } from "@/models/Solution";
import { UseCase } from "@/models/UseCase";
import { Topic } from "@/models/Topic";
import { requireAdmin, type GraphQLContext } from "@/graphql/context";

function toId(doc: { _id: unknown }) {
  return String(doc._id);
}

type Ctx = GraphQLContext;

export const resolvers = {
  Category: {
    id: (parent: { _id: unknown }) => toId(parent),
    patterns: async (parent: { _id: unknown }) => {
      return Pattern.find({ categoryId: parent._id }).sort({ order: 1 });
    },
  },

  Pattern: {
    id: (parent: { _id: unknown }) => toId(parent),
    categoryId: (parent: { categoryId: unknown }) => String(parent.categoryId),
    category: async (parent: { categoryId: unknown }) => {
      return Category.findById(parent.categoryId);
    },
    questions: async (parent: { _id: unknown }) => {
      return Question.find({ patternId: parent._id }).sort({ order: 1 });
    },
    useCases: async (parent: { _id: unknown }) => {
      return UseCase.find({ patternId: parent._id });
    },
    questionCount: async (parent: { _id: unknown }) => {
      return Question.countDocuments({ patternId: parent._id });
    },
  },

  Question: {
    id: (parent: { _id: unknown }) => toId(parent),
    patternId: (parent: { patternId: unknown }) => String(parent.patternId),
    completed: (parent: { completed?: boolean }) => parent.completed ?? false,
    pattern: async (parent: { patternId: unknown }) => {
      return Pattern.findById(parent.patternId);
    },
    solutions: async (parent: { _id: unknown }) => {
      return Solution.find({ questionId: parent._id }).sort({ order: 1 });
    },
  },

  Solution: {
    id: (parent: { _id: unknown }) => toId(parent),
    questionId: (parent: { questionId: unknown }) => String(parent.questionId),
    question: async (parent: { questionId: unknown }) => {
      return Question.findById(parent.questionId);
    },
  },

  UseCase: {
    id: (parent: { _id: unknown }) => toId(parent),
    patternId: (parent: { patternId: unknown }) => String(parent.patternId),
    pattern: async (parent: { patternId: unknown }) => {
      return Pattern.findById(parent.patternId);
    },
  },

  Topic: {
    id: (parent: { _id: unknown }) => toId(parent),
    summary: (parent: { summary?: string }) => parent.summary ?? "",
    tags: (parent: { tags?: string[] }) => parent.tags ?? [],
    blocks: (parent: { blocks?: unknown[] }) => parent.blocks ?? [],
  },

  Query: {
    categories: async () => {
      await connectDB();
      return Category.find().sort({ order: 1 });
    },

    category: async (_: unknown, { slug }: { slug: string }) => {
      await connectDB();
      return Category.findOne({ slug });
    },

    patterns: async (_: unknown, { categorySlug }: { categorySlug: string }) => {
      await connectDB();
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) return [];
      return Pattern.find({ categoryId: category._id }).sort({ order: 1 });
    },

    pattern: async (
      _: unknown,
      { categorySlug, patternSlug }: { categorySlug: string; patternSlug: string }
    ) => {
      await connectDB();
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) return null;
      return Pattern.findOne({ categoryId: category._id, slug: patternSlug });
    },

    question: async (
      _: unknown,
      {
        categorySlug,
        patternSlug,
        questionSlug,
      }: { categorySlug: string; patternSlug: string; questionSlug: string }
    ) => {
      await connectDB();
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) return null;
      const pattern = await Pattern.findOne({ categoryId: category._id, slug: patternSlug });
      if (!pattern) return null;
      return Question.findOne({ patternId: pattern._id, slug: questionSlug });
    },

    questions: async (_: unknown, { patternId }: { patternId: string }) => {
      await connectDB();
      return Question.find({ patternId }).sort({ order: 1 });
    },

    solutions: async (_: unknown, { questionId }: { questionId: string }) => {
      await connectDB();
      return Solution.find({ questionId }).sort({ order: 1 });
    },

    dsaSheet: async () => {
      await connectDB();
      const category = await Category.findOne({ slug: "dsa" });
      if (!category) {
        return { totalQuestions: 0, completedQuestions: 0, patterns: [] };
      }

      const patterns = await Pattern.find({ categoryId: category._id }).sort({ order: 1 }).lean();
      const patternIds = patterns.map((p) => p._id);
      const questions = await Question.find({ patternId: { $in: patternIds } })
        .sort({ order: 1 })
        .lean();

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
            ...p,
            completedCount: patternQuestions.filter((q) => q.completed).length,
            questions: patternQuestions,
          };
        }),
      };
    },

    topics: async (_: unknown, { track }: { track: string }) => {
      await connectDB();
      return Topic.find({ track }).sort({ order: 1, createdAt: 1 });
    },

    topic: async (_: unknown, { track, slug }: { track: string; slug: string }) => {
      await connectDB();
      return Topic.findOne({ track, slug });
    },

    topicById: async (_: unknown, { id }: { id: string }) => {
      await connectDB();
      return Topic.findById(id);
    },
  },

  Mutation: {
    createCategory: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Category.create(input);
    },

    createPattern: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Pattern.create(input);
    },

    updatePattern: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Pattern.findByIdAndUpdate(id, input, { new: true });
    },

    deletePattern: async (_: unknown, { id }: { id: string }, ctx: Ctx) => {
      requireAdmin(ctx);
      await connectDB();
      const questions = await Question.find({ patternId: id });
      const questionIds = questions.map((q) => q._id);
      await Solution.deleteMany({ questionId: { $in: questionIds } });
      await Question.deleteMany({ patternId: id });
      await UseCase.deleteMany({ patternId: id });
      await Pattern.findByIdAndDelete(id);
      return true;
    },

    createQuestion: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Question.create(input);
    },

    updateQuestion: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Question.findByIdAndUpdate(id, input, { new: true });
    },

    toggleQuestionCompleted: async (
      _: unknown,
      { id, completed }: { id: string; completed: boolean }
    ) => {
      await connectDB();
      const question = await Question.findByIdAndUpdate(
        id,
        { $set: { completed } },
        { new: true }
      );
      if (!question) {
        throw new Error(`Question not found: ${id}`);
      }
      return question;
    },

    toggleAllQuestionsCompleted: async (
      _: unknown,
      { completed }: { completed: boolean }
    ) => {
      await connectDB();
      const result = await Question.updateMany({}, { $set: { completed } });
      return result.modifiedCount;
    },

    togglePatternQuestionsCompleted: async (
      _: unknown,
      { patternId, completed }: { patternId: string; completed: boolean }
    ) => {
      await connectDB();
      const result = await Question.updateMany({ patternId }, { $set: { completed } });
      return result.modifiedCount;
    },

    deleteQuestion: async (_: unknown, { id }: { id: string }, ctx: Ctx) => {
      requireAdmin(ctx);
      await connectDB();
      await Solution.deleteMany({ questionId: id });
      await Question.findByIdAndDelete(id);
      return true;
    },

    createSolution: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Solution.create(input);
    },

    updateSolution: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Solution.findByIdAndUpdate(id, input, { new: true });
    },

    deleteSolution: async (_: unknown, { id }: { id: string }, ctx: Ctx) => {
      requireAdmin(ctx);
      await connectDB();
      await Solution.findByIdAndDelete(id);
      return true;
    },

    createUseCase: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return UseCase.create(input);
    },

    updateUseCase: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return UseCase.findByIdAndUpdate(id, input, { new: true });
    },

    deleteUseCase: async (_: unknown, { id }: { id: string }, ctx: Ctx) => {
      requireAdmin(ctx);
      await connectDB();
      await UseCase.findByIdAndDelete(id);
      return true;
    },

    createTopic: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Topic.create(input);
    },

    updateTopic: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: Ctx
    ) => {
      requireAdmin(ctx);
      await connectDB();
      return Topic.findByIdAndUpdate(id, input, { new: true });
    },

    deleteTopic: async (_: unknown, { id }: { id: string }, ctx: Ctx) => {
      requireAdmin(ctx);
      await connectDB();
      await Topic.findByIdAndDelete(id);
      return true;
    },
  },
};
