export const GET_CATEGORIES_QUERY = `
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

export const GET_PATTERNS_QUERY = `
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

export const GET_PATTERN_QUERY = `
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

export const GET_QUESTION_QUERY = `
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
