"use client";

import { InlineText } from "@/components/InlineText";
import { Button } from "@/components/ui/Button";
import type { Verdict } from "@/lib/grading";
import type { Exercise } from "@/lib/types";

/**
 * Écran d'explication après réponse, juste ou fausse. Le passage à la suite
 * demande un tap volontaire : on laisse le temps de lire.
 */
export function ExplanationPanel({
  exercise,
  verdict,
  onContinue,
  continueLabel = "Continuer",
}: {
  exercise: Exercise;
  verdict: Verdict;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const tone = verdict.correct ? (verdict.grade === "hard" ? "warn" : "ok") : "ko";
  const title = verdict.correct ? (verdict.grade === "hard" ? "Juste, mais laborieux" : "Juste") : "Faux";
  const border = { ok: "border-ok/50", ko: "border-ko/50", warn: "border-warn/50" }[tone];
  const color = { ok: "text-ok", ko: "text-ko", warn: "text-warn" }[tone];

  return (
    <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-bg px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
      <div className={`mb-3 max-h-[45dvh] overflow-y-auto rounded-lg border ${border} bg-bg-elevated p-3`}>
        <p className={`text-sm font-semibold uppercase tracking-wide ${color}`}>{title}</p>
        {verdict.feedback && <p className="mt-1 text-sm text-fg-muted">{verdict.feedback}</p>}
        {exercise.kind !== "recall" && <InlineText text={exercise.explanation} className="mt-2 text-[15px] leading-relaxed" />}
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
