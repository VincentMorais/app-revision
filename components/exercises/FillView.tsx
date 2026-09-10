"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { prepareFillTokens, type FillToken } from "@/lib/prepare";
import type { FillExercise } from "@/lib/types";
import { Prompt, SubmitBar, type ExerciseComponentProps } from "./shared";

/**
 * Trous dans du code. Pas de clavier : on tape un token de la banque, il va
 * dans le premier blanc libre (ou dans le blanc sélectionné). Taper un blanc
 * rempli le vide et rend le token à la banque.
 */
export function FillView({ exercise, seed, verdict, onSubmit }: ExerciseComponentProps<FillExercise>) {
  const tokens = useMemo(() => prepareFillTokens(exercise, seed), [exercise, seed]);
  const blankCount = exercise.blanks.length;
  /** blanc (0-indexé) → id de token placé. */
  const [placed, setPlaced] = useState<(number | null)[]>(() => Array(blankCount).fill(null));
  const [active, setActive] = useState<number>(0);

  const tokenById = useMemo(() => new Map(tokens.map((t) => [t.id, t])), [tokens]);
  const usedIds = new Set(placed.filter((id): id is number => id !== null));
  const complete = placed.every((p) => p !== null);

  function firstFree(from: (number | null)[]): number {
    const idx = from.findIndex((p) => p === null);
    return idx === -1 ? 0 : idx;
  }

  function placeToken(tok: FillToken) {
    if (verdict) return;
    setPlaced((prev) => {
      const next = prev.slice();
      const target = prev[active] === null ? active : firstFree(prev);
      if (prev[target] !== null && prev.every((p) => p !== null)) return prev; // tout est plein
      next[target] = tok.id;
      setActive(firstFree(next));
      return next;
    });
  }

  function tapBlank(n: number) {
    if (verdict) return;
    const i = n - 1;
    if (placed[i] !== null) {
      setPlaced((prev) => {
        const next = prev.slice();
        next[i] = null;
        return next;
      });
    }
    setActive(i);
  }

  function blankClass(i: number): string {
    if (verdict) {
      const ok = verdict.details?.[i] ?? false;
      return ok ? "border-ok bg-ok/15 text-fg" : "border-ko bg-ko/15 text-fg line-through decoration-ko";
    }
    if (placed[i] !== null) return "border-accent/60 bg-accent/10 text-fg";
    return i === active ? "border-accent border-dashed bg-accent/5 text-fg-muted" : "border-border border-dashed bg-bg-muted text-fg-muted";
  }

  return (
    <div className="flex flex-col gap-4">
      <Prompt>{exercise.prompt}</Prompt>
      <CodeBlock
        code={exercise.code.code}
        language={exercise.code.language}
        renderBlank={(n) => {
          const i = n - 1;
          const id = placed[i];
          const text = id === null ? null : tokenById.get(id)?.text;
          return (
            <button
              type="button"
              onClick={() => tapBlank(n)}
              className={`my-0.5 inline-flex min-h-11 min-w-14 items-center justify-center rounded-md border px-2 font-mono text-[13px] ${blankClass(i)}`}
              aria-label={`Blanc ${n}`}
            >
              {text ?? "…"}
            </button>
          );
        }}
      />
      {verdict && verdict.details?.some((d) => !d) && (
        <p className="text-sm text-fg-muted">
          Attendu :{" "}
          {exercise.blanks.map((b, i) => (
            <code key={i} className={`mr-1 rounded bg-bg-muted px-1 font-mono ${verdict.details?.[i] ? "text-fg-muted" : "text-ok"}`}>
              {b}
            </code>
          ))}
        </p>
      )}
      {verdict === null && (
        <div className="flex flex-wrap gap-2" aria-label="Tokens disponibles">
          {tokens.map((t) => {
            const used = usedIds.has(t.id);
            return (
              <button
                key={t.id}
                type="button"
                disabled={used}
                onClick={() => placeToken(t)}
                className={`min-h-11 rounded-lg border px-3 font-mono text-[13px] ${used ? "border-transparent bg-bg-muted/40 text-fg-muted/40" : "border-border bg-bg-elevated text-fg active:bg-bg-muted"}`}
              >
                {t.text}
              </button>
            );
          })}
        </div>
      )}
      {verdict === null && (
        <SubmitBar
          disabled={!complete}
          onSubmit={() => onSubmit({ kind: "fill", tokens: placed.map((id) => (id === null ? null : (tokenById.get(id)?.text ?? null))) })}
        />
      )}
    </div>
  );
}
