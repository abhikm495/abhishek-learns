"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_QUESTION, GET_PATTERNS_ADMIN } from "@/graphql/queries";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import slugify from "slugify";

export default function NewQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patternId } = use(params);
  const router = useRouter();

  const { data } = useQuery(GET_PATTERNS_ADMIN, {
    variables: { categorySlug: "dsa" },
  });
  const pattern = data?.patterns?.find((p: { id: string }) => p.id === patternId);

  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [leetcodeId, setLeetcodeId] = useState("");
  const [gfgUrl, setGfgUrl] = useState("");
  const [tags, setTags] = useState("");
  const [order, setOrder] = useState("0");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === slugify(title, { lower: true, strict: true })) {
      setSlug(slugify(value, { lower: true, strict: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const links = [];
    if (leetcodeUrl) {
      links.push({ platform: "leetcode", url: leetcodeUrl, externalId: leetcodeId || undefined });
    }
    if (gfgUrl) {
      links.push({ platform: "gfg", url: gfgUrl });
    }

    await createQuestion({
      variables: {
        input: {
          patternId,
          slug,
          title,
          difficulty,
          links,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          order: parseInt(order, 10) || 0,
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
      <h1 className="text-2xl font-bold">
        Add Question {pattern ? `to ${pattern.title}` : ""}
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Input
            label="LeetCode URL"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            placeholder="https://leetcode.com/problems/..."
          />
          <Input
            label="LeetCode ID"
            value={leetcodeId}
            onChange={(e) => setLeetcodeId(e.target.value)}
            placeholder="15"
          />
          <Input
            label="GFG URL"
            value={gfgUrl}
            onChange={(e) => setGfgUrl(e.target.value)}
            placeholder="https://www.geeksforgeeks.org/..."
          />
          <Input
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Input
            label="Order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Question"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
