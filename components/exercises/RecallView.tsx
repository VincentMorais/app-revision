"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { InlineText, renderInline } from "@/components/InlineText";
import { Button } from "@/components/ui/Button";
import type { RecallExercise } from "@/lib/types";
import { Prompt, type ExerciseComponentProps } from "./shared";

/**
 * Rappel libre auto-évalué : on formule mentalement, on révèle, on se note.
 * Le type le plus important pour la mémorisation. La correction est
 * `explanation` ; `keyPoints` guide l'auto-notation.
 */
export function RecallView({ exercise, verdict, onSubmit }: ExerciseComponentProps<RecallExercise>) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Prompt>{exercise.prompt}</Prompt>
      {exercise.code && <CodeBlock code={exercise.code.code} language={exercise.code.language} />}

      {!revealed && verdict === null && (
        <>
          <p className="text-sm text-fg-muted">Formule ta réponse dans ta tête, puis révèle la correction.</p>
          <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
            <Button variant="primary" block onClick={() => setRevealed(true)}>
              Voir la réponse
            </Button>
          </div>
        </>
      )}

      {(revealed || verdict !== null) && (
        <>
          <div className="rounded-lg border border-border bg-bg-elevated p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">Correction</p>
            <InlineText text={exercise.explanation} className="text-[15px] leading-relaxed" />
            {exercise.keyPoints && exercise.keyPoints.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm">
                {exercise.keyPoints.map((k, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>{renderInline(k)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {verdict === null ? (
            <div className="sticky bottom-0 -mx-4 mt-2 border-t border-border bg-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
              <p className="mb-2 text-center text-sm text-fg-muted">Tu l&apos;avais ?</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="ko" onClick={() => onSubmit({ kind: "recall", grade: "again" })}>
                  Non
                </Button>
                <Button variant="warn" onClick={() => onSubmit({ kind: "recall", grade: "hard" })}>
                  À peu près
                </Button>
                <Button variant="ok" onClick={() => onSubmit({ kind: "recall", grade: "good" })}>
                  Oui
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-fg-muted">
              Auto-évaluation :{" "}
              <span className={verdict.grade === "again" ? "text-ko" : verdict.grade === "hard" ? "text-warn" : "text-ok"}>
                {verdict.grade === "again" ? "non" : verdict.grade === "hard" ? "à peu près" : "oui"}
              </span>
            </p>
          )}
        </>
      )}
    </div>
  );
}
