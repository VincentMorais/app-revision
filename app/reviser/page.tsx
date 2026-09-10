"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { contentIndex } from "@/content";
import { SessionRunner } from "@/components/session/SessionRunner";
import { Button } from "@/components/ui/Button";
import { unlockedChapters } from "@/lib/progress";
import { composeReviewSession } from "@/lib/session";
import { loadState } from "@/lib/storage";
import { useMounted } from "@/lib/store";

/** Session de révision : items dus, tous chapitres ouverts, sans leçon. */
export default function ReviewPage() {
  const router = useRouter();
  const mounted = useMounted();

  const plan = useMemo(() => {
    if (!mounted) return null;
    const state = loadState();
    const open = new Set(unlockedChapters(contentIndex, state).map((c) => c.id));
    const exercises = contentIndex.exercisesInOrder.filter((e) => open.has(contentIndex.chapterOfExercise.get(e.id)!.id));
    return composeReviewSession({ exercises, state, now: Date.now() });
  }, [mounted]);

  if (plan === null) return <main className="min-h-dvh" aria-busy />;
  if (plan.steps.length === 0) {
    return (
      <main className="mx-auto flex max-w-md flex-col gap-3 p-4">
        <h1 className="text-xl font-semibold">Rien à réviser</h1>
        <p className="text-fg-muted">Aucun item n&apos;est dû pour l&apos;instant. La révision se nourrit de ce que tu apprends : continue un chapitre.</p>
        <Link href="/apprendre" className="tap flex items-center justify-center rounded-lg bg-accent px-4 font-semibold text-accent-fg">
          Apprendre
        </Link>
        <Button block onClick={() => router.push("/")}>
          Accueil
        </Button>
      </main>
    );
  }
  return <SessionRunner plan={plan} title="Révision du jour" onExit={() => router.push("/")} />;
}
