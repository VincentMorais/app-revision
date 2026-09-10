"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { contentIndex } from "@/content";
import { SessionRunner } from "@/components/session/SessionRunner";
import { Button } from "@/components/ui/Button";
import { isChapterUnlocked } from "@/lib/progress";
import { composeLearningSession } from "@/lib/session";
import { loadState } from "@/lib/storage";
import { useMounted } from "@/lib/store";

/** Session d'apprentissage : parcours linéaire d'un chapitre. */
export function LearnChapterClient() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const mounted = useMounted();
  const chapter = contentIndex.chaptersById.get(chapterId);
  const restart = search.get("tout") === "1";

  // Composé une fois, après montage, sur l'état réel du navigateur.
  const plan = useMemo(() => {
    if (!mounted || !chapter) return null;
    const state = loadState();
    if (!isChapterUnlocked(chapter, contentIndex, state)) return "locked" as const;
    return composeLearningSession({ chapter, state, resume: !restart });
  }, [mounted, chapter, restart]);

  if (!chapter) {
    return (
      <main className="mx-auto max-w-md p-4">
        <p className="text-fg-muted">Chapitre introuvable.</p>
        <Button className="mt-4" block onClick={() => router.push("/apprendre")}>
          Retour
        </Button>
      </main>
    );
  }
  if (plan === null) return <main className="min-h-dvh" aria-busy />;
  if (plan === "locked") {
    return (
      <main className="mx-auto max-w-md p-4">
        <p className="text-fg-muted">Ce chapitre est verrouillé : valide d&apos;abord ses prérequis.</p>
        <Button className="mt-4" block onClick={() => router.push("/apprendre")}>
          Retour
        </Button>
      </main>
    );
  }
  if (plan.steps.length === 0) {
    return (
      <main className="mx-auto flex max-w-md flex-col gap-3 p-4">
        <h1 className="text-xl font-semibold">{chapter.title}</h1>
        <p className="text-fg-muted">Chapitre terminé. Tu peux le refaire en entier ou passer à la révision.</p>
        <Button variant="primary" block onClick={() => router.replace(`/apprendre/${chapter.id}?tout=1`)}>
          Refaire le chapitre
        </Button>
        <Button block onClick={() => router.push("/apprendre")}>
          Retour
        </Button>
      </main>
    );
  }
  return <SessionRunner plan={plan} title={chapter.title} onExit={() => router.push("/apprendre")} />;
}
