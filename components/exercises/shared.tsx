"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { InlineText } from "@/components/InlineText";
import type { Answer, Verdict } from "@/lib/grading";
import type { Exercise } from "@/lib/types";

/**
 * Contrat commun des 7 composants d'exercice.
 *
 * - `verdict === null` : l'exercice est en cours, le composant gère sa saisie et
 *   appelle `onSubmit` avec une réponse en indices d'origine.
 * - `verdict !== null` : lecture seule, le composant colore juste/faux.
 *   L'explication est affichée par le parent (écran d'explication).
 */
export type ExerciseComponentProps<E extends Exercise = Exercise> = {
  exercise: E;
  /** Graine du mélange (id d'exercice + session). */
  seed: number;
  verdict: Verdict | null;
  onSubmit: (answer: Answer) => void;
};

export function Prompt({ children }: { children: string }) {
  return <InlineText text={children} className="text-lg leading-snug" />;
}

/** Barre de validation en bas, atteignable au pouce. */
export function SubmitBar({
  disabled,
  onSubmit,
  label = "Valider",
  children,
}: {
  disabled: boolean;
  onSubmit: () => void;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
      {children}
      <Button variant="primary" block disabled={disabled} onClick={onSubmit}>
        {label}
      </Button>
    </div>
  );
}

export type ChoiceState = "default" | "selected" | "ok" | "ko" | "muted";

const CHOICE_CLASS: Record<ChoiceState, string> = {
  default: "border-border bg-bg-elevated text-fg active:bg-bg-muted",
  selected: "border-accent bg-accent/10 text-fg",
  ok: "border-ok bg-ok/10 text-fg",
  ko: "border-ko bg-ko/10 text-fg",
  muted: "border-border bg-bg-elevated text-fg-muted",
};

/** Option pleine largeur, 44 px minimum, texte aligné à gauche. */
export function Choice({
  state,
  onClick,
  disabled,
  prefix,
  children,
  mono = false,
}: {
  state: ChoiceState;
  onClick?: () => void;
  disabled?: boolean;
  prefix?: ReactNode;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={`flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-[15px] leading-snug ${mono ? "font-mono text-[13px]" : ""} ${CHOICE_CLASS[state]}`}
    >
      {prefix !== undefined && <span className="shrink-0 text-sm text-fg-muted">{prefix}</span>}
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">{children}</span>
    </button>
  );
}

/** Calcule l'état d'un choix unique (QCM, sortie, raison) après verdict. */
export function choiceState(
  original: number,
  selected: number | null,
  answer: number,
  verdict: Verdict | null,
): ChoiceState {
  if (!verdict) return selected === original ? "selected" : "default";
  if (original === answer) return "ok";
  if (selected === original) return "ko";
  return "muted";
}

/** Petite pastille (numéro, lettre). */
export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" | "ok" | "ko" }) {
  const cls = {
    muted: "bg-bg-muted text-fg-muted",
    accent: "bg-accent text-accent-fg",
    ok: "bg-ok text-accent-fg",
    ko: "bg-ko text-accent-fg",
  }[tone];
  return <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${cls}`}>{children}</span>;
}
