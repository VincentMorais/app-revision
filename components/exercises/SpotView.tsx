"use client";

import { useMemo, useState } from "react";
import { CodeBlock, type LineState } from "@/components/CodeBlock";
import { renderInline } from "@/components/InlineText";
import { prepareReasons } from "@/lib/prepare";
import type { SpotExercise } from "@/lib/types";
import { Choice, Prompt, SubmitBar, choiceState, type ExerciseComponentProps } from "./shared";

/**
 * Repérage d'erreur en deux temps : taper la ligne fautive, puis choisir
 * pourquoi. Les deux doivent être justes ; le verdict dit laquelle a échoué.
 */
export function SpotView({ exercise, seed, verdict, onSubmit }: ExerciseComponentProps<SpotExercise>) {
  const reasons = useMemo(() => prepareReasons(exercise, seed), [exercise, seed]);
  const [line, setLine] = useState<number | null>(null);
  const [reason, setReason] = useState<number | null>(null);

  const lineStates: Record<number, LineState> = {};
  if (verdict) {
    lineStates[exercise.faultyLine] = "ok";
    if (line !== null && line !== exercise.faultyLine) lineStates[line] = "ko";
  } else if (line !== null) {
    lineStates[line] = "selected";
  }

  return (
    <div className="flex flex-col gap-4">
      <Prompt>{exercise.prompt}</Prompt>
      <p className="text-sm text-fg-muted">1. Tape la ligne fautive.</p>
      <CodeBlock
        code={exercise.code.code}
        language={exercise.code.language}
        lineNumbers
        onLineTap={verdict ? undefined : (n) => setLine(n)}
        lineStates={lineStates}
      />
      {(line !== null || verdict) && (
        <>
          <p className="text-sm text-fg-muted">2. Pourquoi est-ce une erreur ?</p>
          <div className="flex flex-col gap-2" role="radiogroup">
            {reasons.map((r) => (
              <Choice
                key={r.original}
                state={choiceState(r.original, reason, exercise.reasonAnswer, verdict)}
                disabled={verdict !== null}
                onClick={() => setReason(r.original)}
              >
                {renderInline(r.text)}
              </Choice>
            ))}
          </div>
        </>
      )}
      {verdict === null && (
        <SubmitBar
          disabled={line === null || reason === null}
          onSubmit={() => line !== null && reason !== null && onSubmit({ kind: "spot", line, reason })}
        />
      )}
    </div>
  );
}
