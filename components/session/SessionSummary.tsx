"use client";

import { contentIndex } from "@/content";
import { KIND_LABELS } from "@/components/exercises/ExerciseView";
import { renderInline } from "@/components/InlineText";
import { Button } from "@/components/ui/Button";
import type { Verdict } from "@/lib/grading";

export type SessionResult = { exerciseId: string; verdict: Verdict };

/** Fin de session : compte honnête et liste des erreurs, rejouables tout de suite. */
export function SessionSummary({ results, onReplayErrors, onFinish }: { results: SessionResult[]; onReplayErrors?: () => void; onFinish: () => void }) {
  const wrong = results.filter((r) => !r.verdict.correct);
  const hard = results.filter((r) => r.verdict.correct && r.verdict.grade === "hard");
  const right = results.length - wrong.length - hard.length;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Session terminée</h2>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Justes" value={right} tone="ok" />
        <Stat label="Laborieuses" value={hard.length} tone="warn" />
        <Stat label="Fausses" value={wrong.length} tone="ko" />
      </dl>

      {results.length === 0 && <p className="text-fg-muted">Aucune réponse enregistrée.</p>}

      {(wrong.length > 0 || hard.length > 0) && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-fg-muted">À retravailler</h3>
          <ul className="flex flex-col gap-2">
            {[...wrong, ...hard].map((r) => {
              const ex = contentIndex.exercisesById.get(r.exerciseId);
              if (!ex) return null;
              const ko = !r.verdict.correct;
              return (
                <li key={r.exerciseId} className={`rounded-lg border px-3 py-2 ${ko ? "border-ko/40" : "border-warn/40"}`}>
                  <p className="text-xs text-fg-muted">
                    {KIND_LABELS[ex.kind]} · {ex.tags.join(", ")}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[15px]">{renderInline(ex.prompt)}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {wrong.length === 0 && results.length > 0 && <p className="text-fg-muted">Aucune erreur cette fois.</p>}

      <div className="sticky bottom-0 -mx-4 mt-2 flex flex-col gap-2 border-t border-border bg-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        {onReplayErrors && (
          <Button variant="primary" block onClick={onReplayErrors}>
            Revoir mes erreurs ({wrong.length})
          </Button>
        )}
        <Button variant={onReplayErrors ? "secondary" : "primary"} block onClick={onFinish}>
          Terminer
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" | "ko" }) {
  const color = { ok: "text-ok", warn: "text-warn", ko: "text-ko" }[tone];
  return (
    <div className="rounded-lg border border-border bg-bg-elevated py-2">
      <dd className={`text-2xl font-semibold ${color}`}>{value}</dd>
      <dt className="text-xs text-fg-muted">{label}</dt>
    </div>
  );
}
