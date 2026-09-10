"use client";

import { useState } from "react";
import { contentIndex, courses } from "@/content";
import { BackupPanel } from "@/components/BackupPanel";
import { Button } from "@/components/ui/Button";
import { rateByCourse, rateByTag, weakestTags, type RateStat } from "@/lib/stats";
import { actions, useAppState, useMounted } from "@/lib/store";
import { effectiveStreak } from "@/lib/streak";

function pct(r: number | null): string {
  return r === null ? "—" : `${Math.round(r * 100)} %`;
}

function Row({ label, s }: { label: string; s: RateStat }) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-2 text-[15px]">{label}</td>
      <td className="py-2 text-right tabular-nums">{pct(s.rate)}</td>
      <td className="py-2 text-right text-xs tabular-nums text-fg-muted">
        {s.correct}/{s.attempts}
        {s.hard > 0 && <span className="text-warn"> ({s.hard} lab.)</span>}
      </td>
    </tr>
  );
}

/** Statistiques honnêtes : ce qui n'est pas su, sans habillage. */
export default function StatsPage() {
  const state = useAppState();
  const mounted = useMounted();
  const [confirmReset, setConfirmReset] = useState(false);
  const now = Date.now();
  const byCourse = rateByCourse(contentIndex, state);
  const byTag = rateByTag(contentIndex, state).sort((a, b) => b.attempts - a.attempts);
  const weakest = weakestTags(contentIndex, state, 8);
  const streak = effectiveStreak(state.streak, now);
  const courseTitle = (id: string) => courses.find((c) => c.id === id)?.title ?? id;

  if (!mounted) return <main aria-busy />;

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Statistiques</h1>

      <section className="grid grid-cols-3 gap-2 text-center">
        <Tile label="Réponses" value={String(state.attempts.length)} />
        <Tile label="Série" value={`${streak} j`} />
        <Tile label="Record" value={`${state.streak.longest} j`} />
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-fg-muted">Par parcours</h2>
        <table className="w-full">
          <thead className="text-xs text-fg-muted">
            <tr>
              <th className="text-left font-normal">Parcours</th>
              <th className="text-right font-normal">Réussite</th>
              <th className="text-right font-normal">Justes/total</th>
            </tr>
          </thead>
          <tbody>
            {byCourse.map((s) => (
              <Row key={s.key} label={courseTitle(s.key)} s={s} />
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-fg-muted">Notions les plus ratées</h2>
        {weakest.length === 0 ? (
          <p className="text-sm text-fg-muted">Pas assez de réponses pour se prononcer (2 minimum par notion).</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {weakest.map((s) => (
              <li key={s.key} className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2">
                <span className="min-w-0 flex-1 truncate font-mono text-sm">{s.key}</span>
                <span className="text-sm text-ko tabular-nums">{s.errors} err.</span>
                {s.hard > 0 && <span className="text-sm text-warn tabular-nums">{s.hard} lab.</span>}
                <span className="w-12 text-right text-sm tabular-nums text-fg-muted">{pct(s.rate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-fg-muted">Par notion</h2>
        {byTag.length === 0 ? (
          <p className="text-sm text-fg-muted">Aucune réponse enregistrée.</p>
        ) : (
          <table className="w-full">
            <tbody>
              {byTag.map((s) => (
                <Row key={s.key} label={s.key} s={s} />
              ))}
            </tbody>
          </table>
        )}
      </section>

      <BackupPanel />

      <section className="border-t border-border pt-4">
        {confirmReset ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ko">Effacer toute la progression ? Irréversible.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => setConfirmReset(false)}>Annuler</Button>
              <Button
                variant="ko"
                onClick={() => {
                  actions.reset();
                  setConfirmReset(false);
                }}
              >
                Effacer
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" block onClick={() => setConfirmReset(true)}>
            Réinitialiser la progression
          </Button>
        )}
      </section>
    </main>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated py-2">
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-fg-muted">{label}</p>
    </div>
  );
}
