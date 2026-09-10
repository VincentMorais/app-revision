"use client";

import Link from "next/link";
import { contentIndex, courses } from "@/content";
import { Ring } from "@/components/ui/Ring";
import { chapterProgress } from "@/lib/progress";
import { learningProgress } from "@/lib/session";
import { useAppState, useMounted } from "@/lib/store";

/** Liste des parcours et de leurs chapitres : ouverts, verrouillés, validés. */
export default function LearnPage() {
  const state = useAppState();
  const mounted = useMounted();

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Apprendre</h1>
      {courses.map((course) => (
        <section key={course.id} id={course.id}>
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <span aria-hidden>{course.icon}</span>
            {course.title}
          </h2>
          <p className="mb-3 text-sm text-fg-muted">{course.description}</p>
          <ol className="flex flex-col gap-2">
            {course.chapters.map((ch, i) => {
              const p = chapterProgress(ch, contentIndex, state);
              const lp = learningProgress(ch, state);
              const done = mounted && lp.done === lp.total;
              const locked = mounted && !p.unlocked;
              const prereqs = ch.prerequisites.map((id) => contentIndex.chaptersById.get(id)?.title ?? id);
              const inner = (
                <>
                  <Ring value={mounted ? p.rate : 0} tone={p.validated ? "ok" : locked ? "muted" : "accent"} size={44}>
                    {locked ? <span aria-label="Verrouillé">🔒</span> : p.validated ? <span className="text-ok">✓</span> : <span>{i + 1}</span>}
                  </Ring>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-medium ${locked ? "text-fg-muted" : ""}`}>{ch.title}</span>
                    <span className="block text-xs text-fg-muted">
                      {!mounted
                        ? " "
                        : locked
                          ? `Valider d'abord : ${prereqs.join(", ")}`
                          : `${lp.done}/${lp.total} unités · maîtrise ${Math.round(p.rate * 100)} %${p.validated ? " · validé" : ""}`}
                    </span>
                  </span>
                  {!locked && <span className="text-xl text-fg-muted" aria-hidden>›</span>}
                </>
              );
              return (
                <li key={ch.id}>
                  {locked ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5">{inner}</div>
                  ) : (
                    <Link href={`/apprendre/${ch.id}${done ? "?tout=1" : ""}`} className="tap flex items-center gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2.5 active:bg-bg-muted">
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      {courses.length === 0 && <p className="text-fg-muted">Aucun parcours pour l&apos;instant.</p>}
    </main>
  );
}
