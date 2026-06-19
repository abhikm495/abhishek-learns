"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_USE_CASE } from "@/graphql/queries";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NewUseCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patternId } = use(params);
  const router = useRouter();
  const [createUseCase, { loading }] = useMutation(CREATE_USE_CASE);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    await createUseCase({
      variables: {
        input: {
          patternId,
          title: formData.get("title"),
          description: formData.get("description"),
          techExample: formData.get("techExample"),
          companyOrProduct: formData.get("companyOrProduct") || undefined,
        },
      },
    });

    router.push(`/admin/patterns/${patternId}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/admin/patterns/${patternId}`}
        className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
      >
        ← Back to pattern
      </Link>
      <h1 className="text-2xl font-bold">Add Use Case</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" required />
          <Textarea label="Description" name="description" />
          <Textarea
            label="Tech Example"
            name="techExample"
            placeholder="Where this pattern appears in real systems..."
          />
          <Input
            label="Company / Product (optional)"
            name="companyOrProduct"
            placeholder="Google, Redis, PostgreSQL..."
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Use Case"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
