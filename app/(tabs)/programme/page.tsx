"use client";

import Link from "next/link";
import { useState } from "react";
import { contentIndex } from "@/content";
import { Button } from "@/components/ui/Button";
import { BONUS_CHAPTERS, PROGRAM, PROGRAM_DAYS, programStatus } from "@/lib/program";
import { actions, useAppState, useMounted } from "@/lib/store";

/** Programme intensif : le calendrier des 30 jours, jamais bloquant. */
export default function ProgramPage() {
  const state = useAppState();
  const mounted = useMounted();
  const [confirmStop, setConfirmStop] = useState(false);
  const status = programStatus(contentIndex, state, Date.now());

  if (!mounted) return <main aria-busy />;

  if (status === null) {
    return (
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Programme intensif</h1>
        <p className="text-fg-muted">
          {PROGRAM_DAYS} jours pour couvrir ce qui tombe en entretien. Chaque jour a une mission : un chapitre, découpé en mini-séances de 5 minutes. Les verrous de chapitres sont levés, le calendrier décide.
        </p>
        <ul className="flex flex-col gap-2 text-[15px]">
          <li>
            <strong>Le rythme :</strong> compte 30 à 40 minutes par jour, en plusieurs fois si ton cerveau décroche. Mieux vaut 4 séances courtes qu&apos;une longue.
          </li>
          <li>
            <strong>Les rattrapages :</strong> les jours 7, 14, 21 et 28 n&apos;ont pas de chapitre. Ils absorbent le retard, ce n&apos;est pas un échec d&apos;en avoir besoin.
          </li>
          <li>
            <strong>Les erreurs :</strong> elles reviennent toutes seules en révision au bon moment. Pas besoin de tout retenir du premier coup.
          </li>
          <li>
            <strong>La progression :</strong> la première semaine reprend les bases, doucement (variables, boucles, méthodes, objets). Ensuite la difficulté monte semaine après semaine, quand ta tête est rodée.
          </li>
          <li>
            <strong>Le contenu :</strong> les {PROGRAM.filter((d) => d.kind === "chapter").length} chapitres du calendrier couvrent ce qui tombe le plus en entretien. Les {BONUS_CHAPTERS.length} autres, plus abstraits, sont en bonus.
          </li>
        </ul>
        <Button variant="primary" block onClick={() => actions.startProgram()}>
          Démarrer aujourd&apos;hui (jour 1)
        </Button>
      </main>
    );
  }

  const mission = status.mission;
  return (
    <main className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold">Programme intensif</h1>
        <p className="text-sm text-fg-muted">
          Jour {status.day}/{PROGRAM_DAYS} · {status.finished}/{status.planned} chapitres faits
          {status.behind > 0 ? ` · ${status.behind} en retard` : " · à jour"}
        </p>
      </header>

      {mission.kind === "chapter" && (
        <div className="flex gap-2">
          <Link href={`/apprendre/${mission.chapter.id}`} className="tap flex flex-1 items-center justify-center rounded-lg bg-accent px-4 text-center font-semibold text-accent-fg active:opacity-80">
            Reprendre la mission
          </Link>
          <Button
            onClick={() => {
              if (window.confirm(`Sauter « ${mission.chapter.title} » ? Tu pourras toujours y revenir depuis l'onglet Apprendre.`)) actions.skipChapter(mission.chapter.id);
            }}
          >
            Sauter
          </Button>
        </div>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold text-fg-muted">Calendrier</h2>
        <ol className="flex flex-col gap-1.5">
          {status.steps.map(({ entry, chapter, status: st }) => {
            const today = entry.day === status.day;
            const isMission = mission.kind === "chapter" && chapter?.id === mission.chapter.id;
            const label =
              entry.kind === "buffer"
                ? "Rattrapage et révision"
                : entry.kind === "final"
                  ? "Révision générale et simulation d'entretien"
                  : (chapter?.title ?? entry.chapterId);
            const icon = entry.kind !== "chapter" ? "↻" : st === "done" ? "✓" : st === "skipped" ? "⤼" : "○";
            const color = st === "done" ? "text-ok" : isMission ? "text-accent" : "text-fg-muted";
            const inner = (
              <>
                <span className="w-9 shrink-0 text-xs text-fg-muted tabular-nums">J{entry.day}</span>
                <span className={`w-5 shrink-0 text-center ${color}`} aria-hidden>
                  {icon}
                </span>
                <span className={`min-w-0 flex-1 text-[15px] leading-snug ${st === "done" ? "text-fg-muted line-through" : ""}`}>{label}</span>
                {today && <span className="rounded bg-accent/20 px-1.5 text-xs text-accent">aujourd&apos;hui</span>}
              </>
            );
            const cls = `flex items-center gap-1 rounded-lg border px-2 py-2 ${isMission ? "border-accent/60 bg-accent/10" : "border-border bg-bg-elevated"}`;
            return (
              <li key={entry.day}>
                {chapter ? (
                  <Link href={`/apprendre/${chapter.id}`} className={`tap ${cls}`}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-fg-muted">Bonus, si tu prends de l&apos;avance</h2>
        <ul className="flex flex-col gap-1.5">
          {BONUS_CHAPTERS.map((id) => {
            const ch = contentIndex.chaptersById.get(id);
            if (!ch) return null;
            return (
              <li key={id}>
                <Link href={`/apprendre/${id}`} className="tap flex items-center rounded-lg border border-border bg-bg-elevated px-3 py-2 text-[15px] active:bg-bg-muted">
                  {ch.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        {confirmStop ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-fg-muted">Arrêter le programme remet les verrous de chapitres. Ta progression est conservée.</p>
            <Button
              variant="ko"
              onClick={() => {
                actions.stopProgram();
                setConfirmStop(false);
              }}
            >
              Arrêter le programme
            </Button>
            <Button variant="ghost" onClick={() => setConfirmStop(false)}>
              Annuler
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmStop(true)}>
            Arrêter le programme
          </Button>
        )}
      </section>
    </main>
  );
}
