"use client";

import { useEffect, useRef, useState } from "react";
import type { FullContent } from "@/content/full";
import { ExerciseView, KIND_LABELS } from "@/components/exercises/ExerciseView";
import { LessonView } from "@/components/lesson/LessonView";
import { Button } from "@/components/ui/Button";
import { grade as gradeAnswer, type Answer, type Verdict } from "@/lib/grading";
import { seedFor } from "@/lib/random";
import { composeReplaySession, type SessionPlan } from "@/lib/session";
import { actions, useAppState } from "@/lib/store";
import { xpForGrade, XP_SESSION_BONUS } from "@/lib/xp";
import { ExplanationPanel } from "./ExplanationPanel";
import { SessionSummary, type SessionResult } from "./SessionSummary";

const MODE_LABEL: Record<SessionPlan["mode"], string> = {
  learn: "Apprentissage",
  review: "Révision",
  replay: "Rejouer",
};

/**
 * Déroule un plan de session : leçon → exercices → explication → suivant,
 * puis récapitulatif avec les erreurs rejouables immédiatement.
 * Chaque réponse est enregistrée dès la validation (pas à la fin), pour ne
 * rien perdre si la session est quittée en cours.
 */
export function SessionRunner({ plan, title, contenu, onExit }: { plan: SessionPlan; title: string; contenu: FullContent; onExit: () => void }) {
  const [sessionSeed] = useState(() => Date.now());
  const [active, setActive] = useState<SessionPlan>(plan);
  const [step, setStep] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [round, setRound] = useState(0);
  const appState = useAppState();
  // Photographie au lancement : sert à calculer ce que la séance a rapporté.
  const [start] = useState(() => ({ xp: appState.xp, today: appState.daily }));
  const bonusGiven = useRef(false);

  const steps = active.steps;
  const total = steps.length;
  const current = step < total ? steps[step] : undefined;

  /**
   * Une étape peut pointer sur un id absent du contenu (sauvegarde importée,
   * contenu remanié entre deux versions). On la saute — depuis un effet, pas
   * pendant le rendu : avancer l'état au milieu d'un rendu est fragile.
   */
  const missing =
    current === undefined
      ? false
      : current.kind === "lesson"
        ? !contenu.lessonsById.has(current.lessonId)
        : !contenu.exercisesById.has(current.exerciseId);

  useEffect(() => {
    if (!missing) return;
    setVerdict(null);
    setStep((s) => s + 1);
  }, [missing, step]);

  const finished = total > 0 && step >= total;
  useEffect(() => {
    // Bonus de fin de séance, une seule fois ; pas pour un simple « rejouer mes erreurs ».
    if (!finished || bonusGiven.current || active.mode === "replay" || results.length === 0) return;
    bonusGiven.current = true;
    actions.bonusXp(XP_SESSION_BONUS);
  }, [finished, active.mode, results.length]);

  // Série de bonnes réponses en cours (se coupe à la première erreur).
  let combo = 0;
  for (let i = results.length - 1; i >= 0 && results[i].verdict.correct; i--) combo++;

  if (total === 0) {
    return (
      <Shell title={title} mode={active.mode} progress={0} onExit={onExit}>
        <p className="text-fg-muted">Rien à faire ici pour l&apos;instant.</p>
        <Button variant="primary" block className="mt-4" onClick={onExit}>
          Retour
        </Button>
      </Shell>
    );
  }

  if (step >= total) {
    const wrongIds = results.filter((r) => !r.verdict.correct).map((r) => r.exerciseId);
    return (
      <Shell title={title} mode={active.mode} progress={1} onExit={onExit}>
        <SessionSummary
          results={results}
          startXp={start.xp}
          startDaily={start.today}
          xp={appState.xp}
          daily={appState.daily}
          dailyGoal={appState.dailyGoal}
          bonus={active.mode !== "replay" && results.length > 0 ? XP_SESSION_BONUS : 0}
          onReplayErrors={
            wrongIds.length > 0
              ? () => {
                  setActive(composeReplaySession(wrongIds));
                  setStep(0);
                  setVerdict(null);
                  setResults([]);
                  setRound((r) => r + 1);
                }
              : undefined
          }
          onFinish={onExit}
        />
      </Shell>
    );
  }

  if (current === undefined) return null;

  function next() {
    setVerdict(null);
    setStep((s) => s + 1);
  }

  if (current.kind === "lesson") {
    const lesson = contenu.lessonsById.get(current.lessonId);
    // `missing` a déjà programmé le saut : on n'affiche rien en attendant.
    if (!lesson) return null;
    return (
      <Shell title={title} mode={active.mode} progress={step / total} onExit={onExit} counter={`${step + 1}/${total}`} combo={combo}>
        <LessonView
          key={lesson.id}
          lesson={lesson}
          onContinue={() => {
            actions.readLesson(lesson.id);
            next();
          }}
          continueLabel={step + 1 < total ? "Passer aux exercices" : "Terminer"}
        />
      </Shell>
    );
  }

  const exercise = contenu.exercisesById.get(current.exerciseId);
  if (!exercise) return null;

  function submit(answer: Answer) {
    if (!exercise) return;
    const v = gradeAnswer(exercise, answer);
    actions.answer(exercise.id, v.grade);
    setVerdict(v);
    setResults((r) => [...r, { exerciseId: exercise.id, verdict: v }]);
  }

  return (
    <Shell title={title} mode={active.mode} progress={step / total} onExit={onExit} counter={`${step + 1}/${total}`} kind={KIND_LABELS[exercise.kind]} combo={combo}>
      <ExerciseView
        key={`${exercise.id}-${round}`}
        exercise={exercise}
        seed={seedFor(exercise.id, sessionSeed, round)}
        verdict={verdict}
        onSubmit={submit}
      />
      {verdict && <ExplanationPanel exercise={exercise} verdict={verdict} xp={xpForGrade(verdict.grade)} combo={combo} onContinue={next} continueLabel={step + 1 < total ? "Continuer" : "Voir le récapitulatif"} />}
    </Shell>
  );
}

function Shell({
  title,
  mode,
  progress,
  counter,
  kind,
  combo = 0,
  onExit,
  children,
}: {
  title: string;
  mode: SessionPlan["mode"];
  progress: number;
  counter?: string;
  kind?: string;
  combo?: number;
  onExit: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-4">
      <header className="sticky top-0 z-10 -mx-4 bg-bg px-4 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2 py-1">
          <button type="button" onClick={onExit} aria-label="Quitter la session" className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-xl text-fg-muted active:bg-bg-muted">
            ×
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="truncate text-xs text-fg-muted">
              {MODE_LABEL[mode]}
              {kind ? ` · ${kind}` : ""}
            </p>
          </div>
          {combo >= 2 && (
            <span key={combo} className="anim-pop rounded-full bg-warn/15 px-2 py-0.5 text-xs font-semibold text-warn tabular-nums" aria-label={`${combo} bonnes réponses d'affilée`}>
              🔥 {combo}
            </span>
          )}
          {counter && <span className="text-xs text-fg-muted tabular-nums">{counter}</span>}
        </div>
        <div className="h-1.5 w-full rounded-full bg-bg-muted" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-1.5 rounded-full bg-accent transition-[width] duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </header>
      <div className="flex-1 pb-4 pt-4">{children}</div>
    </main>
  );
}
