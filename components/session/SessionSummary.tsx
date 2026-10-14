"use client";

import { contentIndex } from "@/content";
import { KIND_LABELS } from "@/components/exercises/ExerciseView";
import { renderInline } from "@/components/InlineText";
import { Button } from "@/components/ui/Button";
import { XpBar } from "@/components/ui/XpBar";
import type { Verdict } from "@/lib/grading";
import { goalInfo, levelInfo, sessionVerdict, type DailyXp } from "@/lib/xp";

export type SessionResult = { exerciseId: string; verdict: Verdict };

type Props = {
  results: SessionResult[];
  /** XP et cumul du jour au lancement de la séance, pour mesurer ce qu'elle a rapporté. */
  startXp: number;
  startDaily: DailyXp;
  xp: number;
  daily: DailyXp;
  dailyGoal: number;
  /** Bonus de fin de séance, déjà inclus dans `xp` une fois versé. */
  bonus: number;
  onReplayErrors?: () => void;
  onFinish: () => void;
};

/** Fin de séance : ce que ça a rapporté d'abord, les erreurs ensuite, rejouables tout de suite. */
export function SessionSummary({ results, startXp, startDaily, xp, daily, dailyGoal, bonus, onReplayErrors, onFinish }: Props) {
  const wrong = results.filter((r) => !r.verdict.correct);
  const hard = results.filter((r) => r.verdict.correct && r.verdict.grade === "hard");
  const right = results.length - wrong.length - hard.length;
  const rate = results.length === 0 ? 0 : (right + hard.length) / results.length;
  const tone = sessionVerdict(rate);

  const now = Date.now();
  const earned = xp - startXp;
  const leveledUp = levelInfo(xp).level > levelInfo(startXp).level;
  const goalBefore = goalInfo(startDaily, dailyGoal, now);
  const goalNow = goalInfo(daily, dailyGoal, now);
  const goalJustReached = goalNow.reached && !goalBefore.reached;

  return (
    <div className="flex flex-col gap-4">
      <div className="anim-pop text-center">
        <p className="text-5xl" aria-hidden>
          {tone.emoji}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">{results.length === 0 ? "Séance terminée" : tone.title}</h2>
        {results.length > 0 && <p className="mt-1 text-sm text-fg-muted">{tone.sub}</p>}
      </div>

      {earned > 0 && (
        <section className="anim-rise rounded-xl border border-accent/40 bg-accent/10 p-3">
          <p className="text-center text-2xl font-semibold text-accent tabular-nums">+{earned} XP</p>
          {bonus > 0 && <p className="text-center text-xs text-fg-muted">dont {bonus} de bonus pour avoir terminé la séance</p>}
          <div className="mt-3">
            <XpBar xp={xp} />
          </div>
          {leveledUp && <p className="anim-pop mt-3 text-center font-semibold text-ok">Niveau {levelInfo(xp).level} atteint : {levelInfo(xp).title} !</p>}
        </section>
      )}

      <p className={`text-center text-sm ${goalJustReached ? "font-semibold text-ok" : "text-fg-muted"}`}>
        {goalJustReached
          ? "🎯 Objectif du jour atteint !"
          : goalNow.reached
            ? `🎯 Objectif du jour atteint (${goalNow.done}/${goalNow.goal} XP)`
            : `Objectif du jour : ${goalNow.done}/${goalNow.goal} XP, encore ${goalNow.remaining}`}
      </p>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Justes" value={right} tone="ok" />
        <Stat label="Laborieuses" value={hard.length} tone="warn" />
        <Stat label="À revoir" value={wrong.length} tone="ko" />
      </dl>

      {results.length === 0 && <p className="text-center text-fg-muted">Aucune réponse enregistrée.</p>}

      {(wrong.length > 0 || hard.length > 0) && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-fg-muted">À retravailler (reviendront d&apos;elles-mêmes en révision)</h3>
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
