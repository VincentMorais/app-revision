"use client";

import Link from "next/link";
import { contentIndex, courses } from "@/content";
import { Ring } from "@/components/ui/Ring";
import { courseProgress, unlockedChapters } from "@/lib/progress";
import { countDue } from "@/lib/session";
import { useAppState, useMounted } from "@/lib/store";
import { effectiveStreak } from "@/lib/streak";

export default function HomePage() {
  const state = useAppState();
  const mounted = useMounted();
  const now = Date.now();

  const open = unlockedChapters(contentIndex, state);
  const openExercises = contentIndex.exercisesInOrder.filter((e) => open.some((c) => c.id === contentIndex.chapterOfExercise.get(e.id)?.id));
  const due = countDue(openExercises, state, now);
  const streak = effectiveStreak(state.streak, now);

  // Prochain chapitre à apprendre : premier chapitre ouvert non terminé.
  const nextChapter = open.find((ch) => {
    const p = courseProgress(contentIndex.courseOfChapter.get(ch.id)!.id, contentIndex, state).chapters.find((c) => c.chapterId === ch.id)!;
    return p.mastered < p.total || ch.units.some((u) => u.kind === "lesson" && state.lessonsRead[u.id] === undefined);
  });

  return (
    <main className="flex flex-col gap-5">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Révision</h1>
        <p className="text-sm text-fg-muted" aria-live="polite">
          {!mounted ? "" : streak > 0 ? `Série : ${streak} jour${streak > 1 ? "s" : ""}` : "Pas de série en cours"}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3">
        <Link href="/reviser" className="tap flex items-center justify-between rounded-xl bg-accent px-4 py-4 text-accent-fg active:opacity-80">
          <span>
            <span className="block text-lg font-semibold">Réviser le jour</span>
            <span className="block text-sm opacity-80">{!mounted ? " " : due > 0 ? `${due} item${due > 1 ? "s" : ""} à revoir` : "Rien de dû pour l'instant"}</span>
          </span>
          <span className="text-2xl" aria-hidden>
            ›
          </span>
        </Link>
        <Link
          href={nextChapter ? `/apprendre/${nextChapter.id}` : "/apprendre"}
          className="tap flex items-center justify-between rounded-xl border border-border bg-bg-elevated px-4 py-4 active:bg-bg-muted"
        >
          <span>
            <span className="block text-lg font-semibold">Apprendre</span>
            <span className="block truncate text-sm text-fg-muted">{!mounted ? " " : nextChapter ? nextChapter.title : "Tous les chapitres ouverts sont terminés"}</span>
          </span>
          <span className="text-2xl text-fg-muted" aria-hidden>
            ›
          </span>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-fg-muted">Parcours</h2>
        <ul className="flex flex-col gap-2">
          {courses.map((course) => {
            const p = courseProgress(course.id, contentIndex, state);
            return (
              <li key={course.id}>
                <Link href={`/apprendre#${course.id}`} className="tap flex items-center gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2.5 active:bg-bg-muted">
                  <Ring value={mounted ? p.rate : 0} tone={p.validatedChapters === course.chapters.length && course.chapters.length > 0 ? "ok" : "accent"}>
                    <span aria-hidden>{course.icon}</span>
                  </Ring>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{course.title}</span>
                    <span className="block text-xs text-fg-muted">
                      {mounted ? `${p.validatedChapters}/${course.chapters.length} chapitres validés · maîtrise ${Math.round(p.rate * 100)} %` : " "}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          {courses.length === 0 && <li className="text-sm text-fg-muted">Aucun parcours pour l&apos;instant.</li>}
        </ul>
      </section>
    </main>
  );
}
