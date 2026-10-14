"use client";

import Link from "next/link";
import { contentIndex, courses } from "@/content";
import { Ring } from "@/components/ui/Ring";
import { XpBar } from "@/components/ui/XpBar";
import { programStatus, PROGRAM_DAYS } from "@/lib/program";
import { goalInfo } from "@/lib/xp";
import { courseProgress, unlockedChapters } from "@/lib/progress";
import { countDue } from "@/lib/session";
import { useAppState, useMounted } from "@/lib/store";
import { effectiveStreak } from "@/lib/streak";

export default function HomePage() {
  const state = useAppState();
  const mounted = useMounted();
  const now = Date.now();

  const open = unlockedChapters(contentIndex, state);
  const openIds = new Set(open.map((c) => c.id));
  const openExercises = contentIndex.exercisesInOrder.filter((e) => {
    const chapterId = contentIndex.chapterOfExercise.get(e.id)?.id;
    return chapterId !== undefined && openIds.has(chapterId);
  });
  const due = countDue(openExercises, state, now);
  const streak = effectiveStreak(state.streak, now);
  const goal = goalInfo(state.daily, state.dailyGoal, now);
  const program = programStatus(contentIndex, state, now);

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
          {!mounted ? "" : streak > 0 ? `🔥 ${streak} jour${streak > 1 ? "s" : ""} de suite` : "Pas de série en cours"}
        </p>
      </header>

      {mounted && (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3">
          <XpBar xp={state.xp} />
          <div className="flex items-center gap-3">
            <Ring value={goal.progress} tone={goal.reached ? "ok" : "accent"} size={44}>
              <span aria-hidden>{goal.reached ? "✓" : "🎯"}</span>
            </Ring>
            <p className="text-sm">
              <span className="font-medium">Objectif du jour</span>
              <span className="block text-xs text-fg-muted">
                {goal.reached ? `Atteint, ${goal.done} XP aujourd'hui. Tout le reste est du bonus.` : `${goal.done}/${goal.goal} XP · encore ${goal.remaining} (environ ${Math.ceil(goal.remaining / 8)} questions)`}
              </span>
            </p>
          </div>
        </section>
      )}

      {mounted && <ProgramCard program={program} />}

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
        {program === null && (
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
        )}
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

function ProgramCard({ program }: { program: ReturnType<typeof programStatus> }) {
  if (program === null) {
    return (
      <Link href="/programme" className="tap flex items-center justify-between rounded-xl border border-accent/50 bg-accent/10 px-4 py-4 active:opacity-80">
        <span>
          <span className="block text-lg font-semibold">Programme intensif · {PROGRAM_DAYS} jours</span>
          <span className="block text-sm text-fg-muted">Une mission par jour, jusqu&apos;aux entretiens. Commencer</span>
        </span>
        <span className="text-2xl text-accent" aria-hidden>
          ›
        </span>
      </Link>
    );
  }

  const { mission } = program;
  return (
    <section className="rounded-xl border border-accent/50 bg-accent/10 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-accent">{program.over ? `Jour ${program.day} · délai dépassé` : `Jour ${program.day}/${PROGRAM_DAYS}`}</p>
        <Link href="/programme" className="text-xs text-fg-muted underline">
          Planning
        </Link>
      </div>
      {mission.kind === "chapter" ? (
        <>
          <div className="mt-2 flex items-center gap-3">
            <Ring value={mission.completion} size={52}>
              <span aria-hidden>{Math.round(mission.completion * 100)}</span>
            </Ring>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-fg-muted">Mission du jour</p>
              <p className="font-semibold leading-snug">{mission.chapter.title}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            {mission.late
              ? `Prévu le jour ${mission.plannedDay} : tu as ${program.behind} chapitre${program.behind > 1 ? "s" : ""} de retard, les jours de rattrapage sont là pour ça.`
              : mission.plannedDay > program.day
                ? `Prévu le jour ${mission.plannedDay} : tu es en avance.`
                : "Un petit bloc à la fois : 4 à 5 mini-séances de 5 minutes suffisent."}
          </p>
          <Link href={`/apprendre/${mission.chapter.id}`} className="tap mt-3 flex items-center justify-center rounded-lg bg-accent px-4 font-semibold text-accent-fg active:opacity-80">
            {mission.completion > 0 ? "Continuer" : "Commencer"}
          </Link>
        </>
      ) : (
        <p className="mt-2 text-sm">
          {mission.kind === "review-all"
            ? "Dernier jour : révise tout ce qui est fragile, puis relis ta présentation et tes questions à poser."
            : "Tous les chapitres du programme sont faits. Révise, puis attaque les chapitres bonus."}
        </p>
      )}
    </section>
  );
}
