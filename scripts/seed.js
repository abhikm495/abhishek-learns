require("dotenv/config");
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PatternSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    whenToUse: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QuestionSchema = new mongoose.Schema(
  {
    patternId: { type: mongoose.Schema.Types.ObjectId, ref: "Pattern", required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    links: [
      {
        platform: String,
        url: String,
        externalId: String,
      },
    ],
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SolutionSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    approach: { type: String, enum: ["brute", "better", "optimal"], required: true },
    title: { type: String, required: true },
    explanation: { type: String, default: "" },
    code: { type: String, default: "" },
    timeComplexity: { type: String, default: "" },
    spaceComplexity: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UseCaseSchema = new mongoose.Schema(
  {
    patternId: { type: mongoose.Schema.Types.ObjectId, ref: "Pattern", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    techExample: { type: String, default: "" },
    companyOrProduct: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Pattern = mongoose.models.Pattern || mongoose.model("Pattern", PatternSchema);
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
const Solution = mongoose.models.Solution || mongoose.model("Solution", SolutionSchema);
const UseCase = mongoose.models.UseCase || mongoose.model("UseCase", UseCaseSchema);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/abhishek-learns";

const patterns = require("./seed-data.json");

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Promise.all([
    Solution.deleteMany({}),
    Question.deleteMany({}),
    UseCase.deleteMany({}),
    Pattern.deleteMany({}),
    Category.deleteMany({}),
  ]);

  const category = await Category.create({
    slug: "dsa",
    name: "DSA",
    description: "Data Structures & Algorithms patterns for interview prep",
    order: 1,
  });

  for (const patternData of patterns) {
    const { questions, useCases, ...patternFields } = patternData;
    const pattern = await Pattern.create({ ...patternFields, categoryId: category._id });

    for (const useCase of useCases) {
      await UseCase.create({ ...useCase, patternId: pattern._id });
    }

    for (const questionData of questions) {
      const { solutions, ...questionFields } = questionData;
      const question = await Question.create({ ...questionFields, patternId: pattern._id });

      for (const solution of solutions) {
        await Solution.create({ ...solution, questionId: question._id });
      }
    }
  }

  console.log(`Seeded ${patterns.length} patterns with questions and solutions.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
