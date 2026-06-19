"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PATTERN, GET_CATEGORIES, GET_PATTERNS } from "@/graphql/queries";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import slugify from "slugify";

export default function NewPatternPage() {
  const router = useRouter();
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [createPattern, { loading }] = useMutation(CREATE_PATTERN, {
    refetchQueries: [{ query: GET_PATTERNS, variables: { categorySlug: "dsa" } }],
  });

  const dsaCategory = categoriesData?.categories?.find(
    (c: { slug: string }) => c.slug === "dsa"
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [whenToUse, setWhenToUse] = useState("");
  const [order, setOrder] = useState("0");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === slugify(title, { lower: true, strict: true })) {
      setSlug(slugify(value, { lower: true, strict: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsaCategory) {
      alert("DSA category not found. Run npm run seed first.");
      return;
    }

    await createPattern({
      variables: {
        input: {
          categoryId: dsaCategory.id,
          slug,
          title,
          description,
          whenToUse: whenToUse.split("\n").filter(Boolean),
          order: parseInt(order, 10) || 0,
        },
      },
    });

    router.push("/admin");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        ← Admin
      </Link>
      <h1 className="text-2xl font-bold">Add Pattern</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
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
          <Input
            label="Order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Pattern"}
            </Button>
            <Link href="/admin">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
