"use client";

import type { ReactNode } from "react";
import { blankNumber, tokenizeLines, type Token } from "@/lib/highlight";
import type { CodeLanguage } from "@/lib/types";

const TOKEN_CLASS: Record<Token["type"], string> = {
  comment: "text-fg-muted italic",
  string: "text-[#9ecf8a]",
  keyword: "text-[#c792ea]",
  annotation: "text-[#ffcb6b]",
  number: "text-[#f78c6c]",
  type: "text-[#82aaff]",
  fn: "text-[#89ddff]",
  punct: "text-fg-muted",
  plain: "",
  blank: "",
};

export type LineState = "default" | "selected" | "ok" | "ko";

export type CodeBlockProps = {
  code: string;
  language: CodeLanguage;
  /** Numéros de ligne. */
  lineNumbers?: boolean;
  /** Rend chaque ligne tactile (repérage d'erreur). Ligne 1-indexée. */
  onLineTap?: (line: number) => void;
  /** État visuel par ligne (1-indexée). */
  lineStates?: Record<number, LineState>;
  /** Rendu personnalisé d'un blanc `{{n}}` (exercice à trous). */
  renderBlank?: (n: number) => ReactNode;
  caption?: string;
  className?: string;
};

const LINE_CLASS: Record<LineState, string> = {
  default: "",
  selected: "bg-accent/20 ring-1 ring-accent/60",
  ok: "bg-ok/15",
  ko: "bg-ko/15",
};

/**
 * Bloc de code coloré. Défile horizontalement dans son cadre, jamais la page.
 * Si `onLineTap` est fourni, chaque ligne est un bouton de 44 px minimum.
 */
export function CodeBlock({
  code,
  language,
  lineNumbers = false,
  onLineTap,
  lineStates = {},
  renderBlank,
  caption,
  className = "",
}: CodeBlockProps) {
  const lines = tokenizeLines(code, language);
  const tappable = onLineTap !== undefined;
  const gutter = lineNumbers || tappable;

  return (
    <figure className={`overflow-hidden rounded-lg border border-border bg-bg-elevated ${className}`}>
      {caption && <figcaption className="border-b border-border px-3 py-1.5 text-xs text-fg-muted">{caption}</figcaption>}
      <pre className="overflow-x-auto py-2 text-[13px] leading-6">
        <code className="block min-w-max">
          {lines.map((tokens, idx) => {
            const n = idx + 1;
            const state = lineStates[n] ?? "default";
            const content = (
              <>
                {gutter && (
                  <span className="inline-block w-8 shrink-0 select-none pr-2 text-right text-fg-muted/60" aria-hidden>
                    {n}
                  </span>
                )}
                <span className="whitespace-pre">
                  {tokens.length === 0
                    ? " "
                    : tokens.map((t, i) =>
                        t.type === "blank" && renderBlank ? (
                          <span key={i} className="inline-block align-middle">
                            {renderBlank(blankNumber(t))}
                          </span>
                        ) : (
                          <span key={i} className={TOKEN_CLASS[t.type]}>
                            {t.text}
                          </span>
                        ),
                      )}
                </span>
              </>
            );
            if (tappable) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onLineTap(n)}
                  aria-pressed={state === "selected"}
                  className={`flex min-h-11 w-full items-center px-3 text-left font-mono active:bg-bg-muted ${LINE_CLASS[state]}`}
                >
                  {content}
                </button>
              );
            }
            return (
              <div key={idx} className={`flex items-center px-3 ${LINE_CLASS[state]}`}>
                {content}
              </div>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
