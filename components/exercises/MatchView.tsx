"use client";

import { useMemo, useState } from "react";
import { renderInline } from "@/components/InlineText";
import { prepareMatch } from "@/lib/prepare";
import type { MatchExercise } from "@/lib/types";
import { Prompt, SubmitBar, type ExerciseComponentProps } from "./shared";

/** Couleurs de paires, distinctes et lisibles sur fond sombre. */
const PAIR_COLORS = [
  "border-[#5eb0ff] bg-[#5eb0ff]/15",
  "border-[#c792ea] bg-[#c792ea]/15",
  "border-[#ffcb6b] bg-[#ffcb6b]/15",
  "border-[#9ecf8a] bg-[#9ecf8a]/15",
  "border-[#f78c6c] bg-[#f78c6c]/15",
  "border-[#89ddff] bg-[#89ddff]/15",
];

/**
 * Association : tape un élément à gauche puis son correspondant à droite.
 * Chaque paire prend une couleur. Taper un élément apparié le libère.
 */
export function MatchView({ exercise, seed, verdict, onSubmit }: ExerciseComponentProps<MatchExercise>) {
  const { left, right } = useMemo(() => prepareMatch(exercise, seed), [exercise, seed]);
  /** mapping[i gauche] = index d'origine droit. */
  const [mapping, setMapping] = useState<(number | null)[]>(() => Array(exercise.pairs.length).fill(null));
  const [pendingLeft, setPendingLeft] = useState<number | null>(null);
  const [pendingRight, setPendingRight] = useState<number | null>(null);

  const rightToLeft = new Map<number, number>();
  mapping.forEach((r, l) => {
    if (r !== null) rightToLeft.set(r, l);
  });
  const complete = mapping.every((m) => m !== null);

  function pair(l: number, r: number) {
    setMapping((prev) => {
      const next = prev.slice();
      // libère les anciens partenaires
      const prevR = next[l];
      if (prevR !== null) next[l] = null;
      const prevL = next.indexOf(r);
      if (prevL !== -1) next[prevL] = null;
      next[l] = r;
      return next;
    });
    setPendingLeft(null);
    setPendingRight(null);
  }

  function tapLeft(l: number) {
    if (verdict) return;
    if (mapping[l] !== null) {
      setMapping((prev) => prev.map((r, i) => (i === l ? null : r)));
      setPendingLeft(null);
      return;
    }
    if (pendingRight !== null) pair(l, pendingRight);
    else setPendingLeft(pendingLeft === l ? null : l);
  }

  function tapRight(r: number) {
    if (verdict) return;
    const l = rightToLeft.get(r);
    if (l !== undefined) {
      setMapping((prev) => prev.map((x, i) => (i === l ? null : x)));
      setPendingRight(null);
      return;
    }
    if (pendingLeft !== null) pair(pendingLeft, r);
    else setPendingRight(pendingRight === r ? null : r);
  }

  function classFor(side: "left" | "right", idx: number): string {
    const l = side === "left" ? idx : rightToLeft.get(idx);
    const paired = l !== undefined && mapping[l] !== null;
    if (verdict) {
      if (!paired) return "border-ko border-dashed bg-bg-elevated text-fg-muted";
      return verdict.details?.[l!] ? "border-ok bg-ok/10 text-fg" : "border-ko bg-ko/10 text-fg";
    }
    if (paired) return `${PAIR_COLORS[l! % PAIR_COLORS.length]} text-fg`;
    const pending = side === "left" ? pendingLeft === idx : pendingRight === idx;
    return pending ? "border-accent bg-accent/10 text-fg" : "border-border bg-bg-elevated text-fg active:bg-bg-muted";
  }

  const cell = "flex min-h-11 w-full items-center rounded-lg border px-2.5 py-2 text-left text-[14px] leading-snug";

  return (
    <div className="flex flex-col gap-4">
      <Prompt>{exercise.prompt}</Prompt>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {left.map((it) => (
            <button
              key={it.original}
              type="button"
              disabled={verdict !== null}
              onClick={() => tapLeft(it.original)}
              className={`${cell} ${classFor("left", it.original)}`}
            >
              <span className="min-w-0 flex-1 break-words">{renderInline(it.text)}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {right.map((it) => (
            <button
              key={it.original}
              type="button"
              disabled={verdict !== null}
              onClick={() => tapRight(it.original)}
              className={`${cell} ${classFor("right", it.original)}`}
            >
              <span className="min-w-0 flex-1 break-words">{renderInline(it.text)}</span>
            </button>
          ))}
        </div>
      </div>

      {verdict && !verdict.correct && (
        <div>
          <p className="mb-1 text-sm text-fg-muted">Paires attendues :</p>
          <ul className="flex flex-col gap-1 text-sm">
            {exercise.pairs.map((p, i) => (
              <li key={i} className={`flex gap-2 ${verdict.details?.[i] ? "text-fg-muted" : "text-fg"}`}>
                <span className="min-w-0 flex-1">{renderInline(p.left)}</span>
                <span className="text-fg-muted">→</span>
                <span className="min-w-0 flex-1">{renderInline(p.right)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {verdict === null && <SubmitBar disabled={!complete} onSubmit={() => onSubmit({ kind: "match", mapping })} />}
    </div>
  );
}
