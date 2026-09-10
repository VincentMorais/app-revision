"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { renderInline } from "@/components/InlineText";
import { prepareChoices } from "@/lib/prepare";
import type { McqExercise, OutputExercise } from "@/lib/types";
import { Choice, Prompt, SubmitBar, choiceState, type ExerciseComponentProps } from "./shared";

/**
 * QCM et prédiction de sortie partagent la même interface : un énoncé,
 * éventuellement du code, quatre options, une seule bonne réponse.
 */
export function McqView({ exercise, seed, verdict, onSubmit }: ExerciseComponentProps<McqExercise | OutputExercise>) {
  const choices = useMemo(() => prepareChoices(exercise, seed), [exercise, seed]);
  const [selected, setSelected] = useState<number | null>(null);
  const isOutput = exercise.kind === "output";

  return (
    <div className="flex flex-col gap-4">
      <Prompt>{exercise.prompt}</Prompt>
      {exercise.code && <CodeBlock code={exercise.code.code} language={exercise.code.language} lineNumbers={isOutput} />}
      {isOutput && <p className="text-sm text-fg-muted">Que se passe-t-il à l&apos;exécution ?</p>}
      <div className="flex flex-col gap-2" role="radiogroup">
        {choices.map((c) => (
          <Choice
            key={c.original}
            state={choiceState(c.original, selected, exercise.answer, verdict)}
            disabled={verdict !== null}
            onClick={() => setSelected(c.original)}
            mono={isOutput}
          >
            {isOutput ? c.text : renderInline(c.text)}
          </Choice>
        ))}
      </div>
      {verdict === null && (
        <SubmitBar disabled={selected === null} onSubmit={() => selected !== null && onSubmit({ kind: exercise.kind, choice: selected })} />
      )}
    </div>
  );
}
