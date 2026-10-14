"use client";

import { SimpleExplanation } from "@/components/exercises/shared";
import { InlineText } from "@/components/InlineText";
import { Button } from "@/components/ui/Button";
import type { Verdict } from "@/lib/grading";
import type { Exercise } from "@/lib/types";
import { cheer } from "@/lib/xp";

/**
 * Écran d'explication après réponse, juste ou fausse. Le passage à la suite
 * demande un tap volontaire : on laisse le temps de lire.
 */
export function ExplanationPanel({
  exercise,
  verdict,
  onContinue,
  continueLabel = "Continuer",
  xp = 0,
  combo = 0,
}: {
  exercise: Exercise;
  verdict: Verdict;
  onContinue: () => void;
  continueLabel?: string;
  /** XP gagné par cette réponse. */
  xp?: number;
  /** Série de bonnes réponses en cours, réponse comprise. */
  combo?: number;
}) {
  const tone = verdict.correct ? (verdict.grade === "hard" ? "warn" : "ok") : "ko";
  const label = verdict.correct ? (verdict.grade === "hard" ? "Juste, mais laborieux" : "Juste") : "Faux";
  const kind = verdict.correct ? (verdict.grade === "hard" ? "hard" : "correct") : "wrong";
  const line = cheer(kind, exercise.id.length + exercise.id.charCodeAt(exercise.id.length - 1));
  const border = { ok: "border-ok/50", ko: "border-ko/50", warn: "border-warn/50" }[tone];
  const color = { ok: "text-ok", ko: "text-ko", warn: "text-warn" }[tone];

  return (
    <div className="anim-rise sticky bottom-0 -mx-4 mt-4 border-t border-border bg-bg px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
      <div className={`mb-3 max-h-[45dvh] overflow-y-auto rounded-lg border ${border} bg-bg-elevated p-3`}>
        <div className="flex items-baseline justify-between gap-2">
          <p className={`text-lg font-semibold ${color}`}>{line}</p>
          {xp > 0 && <span className="anim-pop rounded-full bg-accent/15 px-2 py-0.5 text-sm font-semibold text-accent tabular-nums">+{xp} XP</span>}
        </div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${color}`}>
          {label}
          {combo >= 3 && <span className="ml-2 normal-case text-warn">🔥 {combo} d&apos;affilée</span>}
        </p>
        {verdict.feedback && <p className="mt-1 text-sm text-fg-muted">{verdict.feedback}</p>}
        {exercise.kind !== "recall" && exercise.simple && (
          <div className="mt-2">
            <SimpleExplanation simple={exercise.simple} />
          </div>
        )}
        {exercise.kind !== "recall" &&
          (exercise.simple ? (
            <details className="mt-2">
              <summary className="cursor-pointer py-1 text-sm text-fg-muted">Le détail technique</summary>
              <InlineText text={exercise.explanation} className="mt-1 text-[15px] leading-relaxed" />
            </details>
          ) : (
            <InlineText text={exercise.explanation} className="mt-2 text-[15px] leading-relaxed" />
          ))}
        {exercise.tags.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-1">
            {exercise.tags.map((t) => (
              <span key={t} className="rounded bg-bg-muted px-1.5 py-0.5 text-xs text-fg-muted">
                {t}
              </span>
            ))}
          </p>
        )}
      </div>
      <Button variant="primary" block onClick={onContinue}>
        {continueLabel}
      </Button>
    </div>
  );
}
