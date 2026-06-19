"use client";

import { use, useState } from "react";
import Link from "next/link";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_SOLUTION,
  DELETE_SOLUTION,
  GET_PATTERNS_ADMIN,
  UPDATE_QUESTION,
} from "@/graphql/queries";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: questionId } = use(params);

  const { data, refetch } = useQuery(GET_PATTERNS_ADMIN, {
    variables: { categorySlug: "dsa" },
  });

  let question: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    patternId?: string;
  } | null = null;
  let patternId = "";
  let patternSlug = "";

  for (const pattern of data?.patterns ?? []) {
    const found = pattern.questions.find((q: { id: string }) => q.id === questionId);
    if (found) {
      question = found;
      patternId = pattern.id;
      patternSlug = pattern.slug;
      break;
    }
  }

  const [updateQuestion, { loading: updating }] = useMutation(UPDATE_QUESTION);
  const [createSolution, { loading: creatingSolution }] = useMutation(CREATE_SOLUTION);
  const [deleteSolution] = useMutation(DELETE_SOLUTION);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [initialized, setInitialized] = useState(false);

  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [solutionApproach, setSolutionApproach] = useState("brute");
  const [solutionTitle, setSolutionTitle] = useState("");
  const [solutionExplanation, setSolutionExplanation] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [solutionTime, setSolutionTime] = useState("");
  const [solutionSpace, setSolutionSpace] = useState("");

  const { data: questionDetail } = useQuery(
    gql`
      query GetQuestionDetail(
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
    `,
    {
      variables: {
        categorySlug: "dsa",
        patternSlug,
        questionSlug: question?.slug ?? "",
      },
      skip: !question?.slug || !patternSlug,
    }
  );

  const solutions = questionDetail?.question?.solutions ?? [];

  if (question && !initialized) {
    setTitle(question.title);
    setDifficulty(question.difficulty);
    setInitialized(true);
  }

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateQuestion({
      variables: { id: questionId, input: { title, difficulty } },
    });
    alert("Question updated!");
  };

  const handleCreateSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSolution({
      variables: {
        input: {
          questionId,
          approach: solutionApproach,
          title: solutionTitle,
          explanation: solutionExplanation,
          code: solutionCode,
          timeComplexity: solutionTime,
          spaceComplexity: solutionSpace,
          order: solutions.length,
        },
      },
    });
    setShowSolutionForm(false);
    setSolutionTitle("");
    setSolutionExplanation("");
    setSolutionCode("");
    setSolutionTime("");
    setSolutionSpace("");
    window.location.reload();
  };

  if (!question) return <p>Question not found.</p>;

  return (
    <div className="space-y-8">
      <Link
        href={`/admin/patterns/${patternId}`}
        className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
      >
        ← Back to pattern
      </Link>
      <h1 className="text-2xl font-bold">Edit Question</h1>

      <Card>
        <form onSubmit={handleUpdateQuestion} className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Button type="submit" disabled={updating}>
            Save Question
          </Button>
        </form>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Solutions (C++)</h2>
          <Button size="sm" onClick={() => setShowSolutionForm(!showSolutionForm)}>
            {showSolutionForm ? "Cancel" : "Add Solution"}
          </Button>
        </div>

        {showSolutionForm && (
          <Card>
            <form onSubmit={handleCreateSolution} className="space-y-4">
              <Select
                label="Approach"
                value={solutionApproach}
                onChange={(e) => setSolutionApproach(e.target.value)}
              >
                <option value="brute">Brute Force</option>
                <option value="better">Better</option>
                <option value="optimal">Optimal</option>
              </Select>
              <Input
                label="Title"
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                required
              />
              <Textarea
                label="Explanation (markdown)"
                value={solutionExplanation}
                onChange={(e) => setSolutionExplanation(e.target.value)}
                className="min-h-[120px]"
              />
              <Textarea
                label="C++ Code"
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                className="min-h-[200px] font-mono"
              />
              <Input
                label="Time Complexity"
                value={solutionTime}
                onChange={(e) => setSolutionTime(e.target.value)}
                placeholder="O(n)"
              />
              <Input
                label="Space Complexity"
                value={solutionSpace}
                onChange={(e) => setSolutionSpace(e.target.value)}
                placeholder="O(1)"
              />
              <Button type="submit" disabled={creatingSolution}>
                Add Solution
              </Button>
            </form>
          </Card>
        )}

        {solutions.map(
          (s: {
            id: string;
            approach: string;
            title: string;
            explanation: string;
            code: string;
            timeComplexity: string;
            spaceComplexity: string;
          }) => (
            <Card key={s.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{s.title}</p>
                  <Badge variant="accent">{s.approach}</Badge>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    if (!confirm("Delete solution?")) return;
                    await deleteSolution({ variables: { id: s.id } });
                    window.location.reload();
                  }}
                >
                  Delete
                </Button>
              </div>
              <p className="text-sm text-[var(--muted)]">
                Time: {s.timeComplexity || "—"} · Space: {s.spaceComplexity || "—"}
              </p>
              {s.code && (
                <pre className="overflow-x-auto rounded bg-[#1e1e1e] p-3 text-xs text-[#d4d4d4]">
                  {s.code}
                </pre>
              )}
            </Card>
          )
        )}
      </section>

      {patternSlug && question.slug && (
        <Link
          href={`/dsa/${patternSlug}/${question.slug}`}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          View public page →
        </Link>
      )}
    </div>
  );
}
