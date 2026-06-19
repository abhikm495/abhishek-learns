import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      slug
      name
      description
      order
    }
  }
`;

export const GET_PATTERNS = gql`
  query GetPatterns($categorySlug: String!) {
    patterns(categorySlug: $categorySlug) {
      id
      slug
      title
      description
      whenToUse
      order
      questionCount
    }
  }
`;

export const GET_PATTERNS_ADMIN = gql`
  query GetPatternsAdmin($categorySlug: String!) {
    patterns(categorySlug: $categorySlug) {
      id
      slug
      title
      description
      whenToUse
      order
      questionCount
      questions {
        id
        slug
        title
        difficulty
      }
      useCases {
        id
        title
        description
        techExample
        companyOrProduct
      }
    }
  }
`;

export const GET_PATTERN = gql`
  query GetPattern($categorySlug: String!, $patternSlug: String!) {
    pattern(categorySlug: $categorySlug, patternSlug: $patternSlug) {
      id
      slug
      title
      description
      whenToUse
      questions {
        id
        slug
        title
        difficulty
        links {
          platform
          url
          externalId
        }
        tags
        order
      }
      useCases {
        id
        title
        description
        techExample
        companyOrProduct
      }
    }
  }
`;

export const GET_QUESTION = gql`
  query GetQuestion(
    $categorySlug: String!
    $patternSlug: String!
    $questionSlug: String!
  ) {
    question(
      categorySlug: $categorySlug
      patternSlug: $patternSlug
      questionSlug: $questionSlug
    ) {
      id
      slug
      title
      difficulty
      links {
        platform
        url
        externalId
      }
      tags
      pattern {
        id
        slug
        title
        useCases {
          id
          title
          description
          techExample
          companyOrProduct
        }
      }
      solutions {
        id
        approach
        title
        explanation
        code
        timeComplexity
        spaceComplexity
        order
      }
    }
  }
`;

export const CREATE_PATTERN = gql`
  mutation CreatePattern($input: CreatePatternInput!) {
    createPattern(input: $input) {
      id
      slug
      title
    }
  }
`;

export const UPDATE_PATTERN = gql`
  mutation UpdatePattern($id: ID!, $input: UpdatePatternInput!) {
    updatePattern(id: $id, input: $input) {
      id
      slug
      title
      description
      whenToUse
    }
  }
`;

export const DELETE_PATTERN = gql`
  mutation DeletePattern($id: ID!) {
    deletePattern(id: $id)
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
      slug
      title
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $input: UpdateQuestionInput!) {
    updateQuestion(id: $id, input: $input) {
      id
      slug
      title
      difficulty
      links {
        platform
        url
      }
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

export const CREATE_SOLUTION = gql`
  mutation CreateSolution($input: CreateSolutionInput!) {
    createSolution(input: $input) {
      id
      approach
      title
    }
  }
`;

export const UPDATE_SOLUTION = gql`
  mutation UpdateSolution($id: ID!, $input: UpdateSolutionInput!) {
    updateSolution(id: $id, input: $input) {
      id
      approach
      title
      explanation
      code
      timeComplexity
      spaceComplexity
    }
  }
`;

export const DELETE_SOLUTION = gql`
  mutation DeleteSolution($id: ID!) {
    deleteSolution(id: $id)
  }
`;

export const CREATE_USE_CASE = gql`
  mutation CreateUseCase($input: CreateUseCaseInput!) {
    createUseCase(input: $input) {
      id
      title
    }
  }
`;

export const DELETE_USE_CASE = gql`
  mutation DeleteUseCase($id: ID!) {
    deleteUseCase(id: $id)
  }
`;

export const TOGGLE_QUESTION_COMPLETED = gql`
  mutation ToggleQuestionCompleted($id: ID!, $completed: Boolean!) {
    toggleQuestionCompleted(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;

export const TOGGLE_ALL_QUESTIONS_COMPLETED = gql`
  mutation ToggleAllQuestionsCompleted($completed: Boolean!) {
    toggleAllQuestionsCompleted(completed: $completed)
  }
`;

export const TOGGLE_PATTERN_QUESTIONS_COMPLETED = gql`
  mutation TogglePatternQuestionsCompleted($patternId: ID!, $completed: Boolean!) {
    togglePatternQuestionsCompleted(patternId: $patternId, completed: $completed)
  }
`;
