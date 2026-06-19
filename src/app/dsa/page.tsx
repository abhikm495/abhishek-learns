import { getDSASheet } from "@/lib/data/get-dsa-sheet";
import { DSASheet } from "@/components/dsa/DSASheet";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "DSA Sheet — Abhishek Learns",
};

export default async function DSAPage() {
  let sheet;

  try {
    sheet = await getDSASheet();
  } catch {
    sheet = { totalQuestions: 0, completedQuestions: 0, patterns: [] };
  }

  if (sheet.patterns.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold">DSA Sheet</h1>
        </div>
        <Card>
          <p className="text-[var(--muted)]">
            No patterns yet. Run <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">npm run seed</code> to
            populate data, or add patterns from the{" "}
            <Link href="/admin" className="text-[var(--accent)] hover:underline">
              admin panel
            </Link>
            .
          </p>
        </Card>
      </div>
    );
  }

  return <DSASheet initialData={sheet} />;
}
