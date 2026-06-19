"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_PATTERN,
  DELETE_QUESTION,
  DELETE_USE_CASE,
  GET_PATTERNS_ADMIN,
  UPDATE_PATTERN,
} from "@/graphql/queries";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function EditPatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, loading, refetch } = useQuery(GET_PATTERNS_ADMIN, {
    variables: { categorySlug: "dsa" },
  });

  const pattern = data?.patterns?.find((p: { id: string }) => p.id === id);

  const [updatePattern, { loading: updating }] = useMutation(UPDATE_PATTERN);
  const [deletePattern] = useMutation(DELETE_PATTERN);
  const [deleteQuestion] = useMutation(DELETE_QUESTION);
  const [deleteUseCase] = useMutation(DELETE_USE_CASE);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whenToUse, setWhenToUse] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (pattern && !initialized) {
    setTitle(pattern.title);
    setDescription(pattern.description || "");
    setWhenToUse((pattern.whenToUse || []).join("\n"));
    setInitialized(true);
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePattern({
      variables: {
        id,
        input: {
          title,
          description,
          whenToUse: whenToUse.split("\n").filter(Boolean),
        },
      },
    });
    await refetch();
    alert("Pattern updated!");
  };

  const handleDeletePattern = async () => {
    if (!confirm("Delete this pattern and all its questions?")) return;
    await deletePattern({ variables: { id } });
    window.location.href = "/admin";
  };

  if (loading) return <p>Loading...</p>;
  if (!pattern) return <p>Pattern not found.</p>;

  return (
    <div className="space-y-8">
      <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        ← Admin
      </Link>
      <h1 className="text-2xl font-bold">Edit: {pattern.title}</h1>

      <Card>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Textarea
            label="When to use (one per line)"
            value={whenToUse}
            onChange={(e) => setWhenToUse(e.target.value)}
          />
          <Button type="submit" disabled={updating}>
            Save Pattern
          </Button>
        </form>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <Link href={`/admin/patterns/${id}/questions/new`}>
            <Button size="sm">Add Question</Button>
          </Link>
        </div>
        {pattern.questions.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No questions yet.</p>
        )}
        {pattern.questions.map(
          (q: { id: string; slug: string; title: string; difficulty: string }) => (
            <Card key={q.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{q.title}</p>
                  <Badge variant={q.difficulty as "easy" | "medium" | "hard"}>
                    {q.difficulty}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/questions/${q.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      if (!confirm("Delete question?")) return;
                      await deleteQuestion({ variables: { id: q.id } });
                      await refetch();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Use Cases</h2>
          <Link href={`/admin/patterns/${id}/use-cases/new`}>
            <Button size="sm">Add Use Case</Button>
          </Link>
        </div>
        {pattern.useCases.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No use cases yet.</p>
        )}
        {pattern.useCases.map(
          (uc: { id: string; title: string; description: string; techExample: string }) => (
            <Card key={uc.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{uc.title}</p>
                  <p className="text-sm text-[var(--muted)]">{uc.description}</p>
                  <p className="mt-1 text-sm">{uc.techExample}</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    if (!confirm("Delete use case?")) return;
                    await deleteUseCase({ variables: { id: uc.id } });
                    await refetch();
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          )
        )}
      </section>

      <Button variant="danger" onClick={handleDeletePattern}>
        Delete Pattern
      </Button>
    </div>
  );
}
