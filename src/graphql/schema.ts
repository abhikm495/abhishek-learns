export const typeDefs = `#graphql
  enum Difficulty {
    easy
    medium
    hard
  }

  enum ApproachType {
    brute
    better
    optimal
  }

  type Category {
    id: ID!
    slug: String!
    name: String!
    description: String!
    order: Int!
    patterns: [Pattern!]!
  }

  type Pattern {
    id: ID!
    categoryId: ID!
    slug: String!
    title: String!
    description: String!
    whenToUse: [String!]!
    order: Int!
    category: Category
    questions: [Question!]!
    useCases: [UseCase!]!
    questionCount: Int!
  }

  type QuestionLink {
    platform: String!
    url: String!
    externalId: String
  }

  type Question {
    id: ID!
    patternId: ID!
    slug: String!
    title: String!
    difficulty: Difficulty!
    links: [QuestionLink!]!
    tags: [String!]!
    order: Int!
    completed: Boolean!
    pattern: Pattern
    solutions: [Solution!]!
  }

  type DSASheet {
    totalQuestions: Int!
    completedQuestions: Int!
    patterns: [PatternSheet!]!
  }

  type PatternSheet {
    id: ID!
    slug: String!
    title: String!
    description: String!
    order: Int!
    completedCount: Int!
    questions: [Question!]!
  }

  type Solution {
    id: ID!
    questionId: ID!
    approach: ApproachType!
    title: String!
    explanation: String!
    code: String!
    timeComplexity: String!
    spaceComplexity: String!
    order: Int!
    question: Question
  }

  type UseCase {
    id: ID!
    patternId: ID!
    title: String!
    description: String!
    techExample: String!
    companyOrProduct: String
    pattern: Pattern
  }

  input QuestionLinkInput {
    platform: String!
    url: String!
    externalId: String
  }

  input CreateCategoryInput {
    slug: String!
    name: String!
    description: String
    order: Int
  }

  input CreatePatternInput {
    categoryId: ID!
    slug: String!
    title: String!
    description: String
    whenToUse: [String!]
    order: Int
  }

  input UpdatePatternInput {
    slug: String
    title: String
    description: String
    whenToUse: [String!]
    order: Int
  }

  input CreateQuestionInput {
    patternId: ID!
    slug: String!
    title: String!
    difficulty: Difficulty
    links: [QuestionLinkInput!]
    tags: [String!]
    order: Int
  }

  input UpdateQuestionInput {
    slug: String
    title: String
    difficulty: Difficulty
    links: [QuestionLinkInput!]
    tags: [String!]
    order: Int
    completed: Boolean
  }

  input CreateSolutionInput {
    questionId: ID!
    approach: ApproachType!
    title: String!
    explanation: String
    code: String
    timeComplexity: String
    spaceComplexity: String
    order: Int
  }

  input UpdateSolutionInput {
    approach: ApproachType
    title: String
    explanation: String
    code: String
    timeComplexity: String
    spaceComplexity: String
    order: Int
  }

  input CreateUseCaseInput {
    patternId: ID!
    title: String!
    description: String
    techExample: String
    companyOrProduct: String
  }

  input UpdateUseCaseInput {
    title: String
    description: String
    techExample: String
    companyOrProduct: String
  }

  type Query {
    categories: [Category!]!
    category(slug: String!): Category
    patterns(categorySlug: String!): [Pattern!]!
    pattern(categorySlug: String!, patternSlug: String!): Pattern
    question(categorySlug: String!, patternSlug: String!, questionSlug: String!): Question
    questions(patternId: ID!): [Question!]!
    solutions(questionId: ID!): [Solution!]!
    dsaSheet: DSASheet!
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    createPattern(input: CreatePatternInput!): Pattern!
    updatePattern(id: ID!, input: UpdatePatternInput!): Pattern!
    deletePattern(id: ID!): Boolean!

    createQuestion(input: CreateQuestionInput!): Question!
    updateQuestion(id: ID!, input: UpdateQuestionInput!): Question!
    toggleQuestionCompleted(id: ID!, completed: Boolean!): Question!
    toggleAllQuestionsCompleted(completed: Boolean!): Int!
    togglePatternQuestionsCompleted(patternId: ID!, completed: Boolean!): Int!
    deleteQuestion(id: ID!): Boolean!

    createSolution(input: CreateSolutionInput!): Solution!
    updateSolution(id: ID!, input: UpdateSolutionInput!): Solution!
    deleteSolution(id: ID!): Boolean!

    createUseCase(input: CreateUseCaseInput!): UseCase!
    updateUseCase(id: ID!, input: UpdateUseCaseInput!): UseCase!
    deleteUseCase(id: ID!): Boolean!
  }
`;
