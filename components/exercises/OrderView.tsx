"use client";

import { useMemo, useState } from "react";
import { renderInline } from "@/components/InlineText";
import { prepareOrder } from "@/lib/prepare";
import type { OrderExercise } from "@/lib/types";
import { Badge, Prompt, SubmitBar, type ExerciseComponentProps } from "./shared";

/**
 * Remise en ordre façon « tap » : on pioche les éléments dans la banque, ils
 * s'empilent dans la réponse. Taper un élément de la réponse le renvoie dans
 * la banque. Pas de glisser-déposer : peu fiable au pouce.
 */
export function OrderView({ exercise, seed, verdict, onSubmit }: ExerciseComponentProps<OrderExercise>) {
  const bank = useMemo(() => prepareOrder(exercise, seed), [exercise, seed]);
  /** Indices d'origine, dans l'ordre choisi. */
  const [sequence, setSequence] = useState<number[]>([]);
  const inAnswer = new Set(sequence);
  const mono = exercise.language !== undefined;
  const complete = sequence.length === exercise.items.length;

  const itemClass = (state: "answer" | "bank" | "ok" | "ko") =>
    ({
      answer: "border-accent/50 bg-accent/10 text-fg",
      bank: "border-border bg-bg-elevated text-fg active:bg-bg-muted",
      ok: "border-ok bg-ok/10 text-fg",
      ko: "border-ko bg-ko/10 text-fg",
    })[state];

  return (
    <div className="flex flex-col gap-4">
      <Prompt>{exercise.prompt}</Prompt>

      <ol className="flex min-h-11 flex-col gap-2 rounded-lg border border-dashed border-border p-2" aria-label="Ta réponse">
        {sequence.length === 0 && <li className="px-2 py-2 text-sm text-fg-muted">Tape les éléments dans le bon ordre.</li>}
        {sequence.map((orig, pos) => {
          const state = verdict ? (verdict.details?.[pos] ? "ok" : "ko") : "answer";
          return (
            <li key={orig}>
              <button
                type="button"
                disabled={verdict !== null}
                onClick={() => setSequence((s) => s.filter((x) => x !== orig))}
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${mono ? "font-mono text-[13px]" : "text-[15px]"} ${itemClass(state)}`}
              >
                <Badge tone={state === "ok" ? "ok" : state === "ko" ? "ko" : "accent"}>{pos + 1}</Badge>
                <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">{mono ? exercise.items[orig] : renderInline(exercise.items[orig])}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {verdict && !verdict.correct && (
        <div>
          <p className="mb-1 text-sm text-fg-muted">Ordre attendu :</p>
          <ol className="flex flex-col gap-1">
            {exercise.items.map((it, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${mono ? "font-mono text-[13px]" : ""}`}>
                <span className="w-5 shrink-0 text-right text-fg-muted">{i + 1}.</span>
                <span className="whitespace-pre-wrap">{mono ? it : renderInline(it)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {verdict === null && (
        <div className="flex flex-col gap-2" aria-label="Éléments disponibles">
          {bank.map((b) => {
            const used = inAnswer.has(b.original);
            return (
              <button
                key={b.original}
                type="button"
                disabled={used}
                onClick={() => setSequence((s) => [...s, b.original])}
                className={`min-h-11 rounded-lg border px-3 py-2 text-left ${mono ? "font-mono text-[13px]" : "text-[15px]"} ${used ? "border-transparent bg-bg-muted/40 text-fg-muted/40" : itemClass("bank")}`}
              >
                <span className="whitespace-pre-wrap break-words">{mono ? b.text : renderInline(b.text)}</span>
              </button>
            );
          })}
        </div>
      )}

      {verdict === null && <SubmitBar disabled={!complete} onSubmit={() => onSubmit({ kind: "order", sequence })} />}
    </div>
  );
}
