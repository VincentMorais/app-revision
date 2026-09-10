import { Suspense } from "react";
import { contentIndex } from "@/content";
import { LearnChapterClient } from "./LearnChapterClient";

/** Une page statique par chapitre : tout est connu au build, rien côté serveur. */
export function generateStaticParams() {
  return [...contentIndex.chaptersById.keys()].map((chapterId) => ({ chapterId }));
}

export const dynamicParams = false;

export default function LearnChapterPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh" aria-busy />}>
      <LearnChapterClient />
    </Suspense>
  );
}
