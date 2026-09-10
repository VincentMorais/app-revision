"use client";

import Link from "next/link";
import { contentIndex } from "@/content";
import { KIND_LABELS } from "@/components/exercises/ExerciseView";
import { renderInline } from "@/components/InlineText";
import { recentErrorIds } from "@/lib/session";
import { masteryOf } from "@/lib/srs";
import { failureCounts, weakestTags } from "@/lib/stats";
import { useAppState, useMounted } from "@/lib/store";

function replayHref(ids: string[], title: string): string {
  return `/rejouer?ids=${encodeURIComponent(ids.join(","))}&titre=${encodeURIComponent(title)}`;
}

/** Journal d'erreurs : notions fragiles et erreurs récentes, rejouables isolément. */
export default function ErrorsPage() {
  const state = useAppState();
  const mounted = useMounted();
  const now = Date.now();
  const recent = recentErrorIds(state, now, 7);
  const counts = failureCounts(state);
  const weakest = weakestTags(contentIndex, state, 10, 1);

  // Exercices fragiles (dernière réponse fausse), tous chapitres, les plus ratés d'abord.
  const fragile = contentIndex.exercisesInOrder
    .filter((e) => masteryOf(state.items[e.id]) === "fragile")
    .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0));

  /** Exercices d'une notion ayant déjà été ratés au moins une fois. */
  const failedByTag = (tag: string) => contentIndex.exercisesInOrder.filter((e) => e.tags.includes(tag) && (counts.get(e.id) ?? 0) > 0).map((e) => e.id);

  if (!mounted) return <main aria-busy />;

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Journal d&apos;erreurs</h1>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-fg-muted">Notions fragiles</h2>
        </div>
        {weakest.length === 0 ? (
          <p className="text-sm text-fg-muted">Aucune erreur enregistrée.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {weakest.map((s) => {
              const ids = failedByTag(s.key);
              return (
                <li key={s.key} className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated py-1 pl-3 pr-1">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-sm">{s.key}</span>
                    <span className="block text-xs text-fg-muted">
                      {s.errors} erreur{s.errors > 1 ? "s" : ""}
                      {s.hard > 0 ? `, ${s.hard} laborieuse${s.hard > 1 ? "s" : ""}` : ""} sur {s.attempts}
                    </span>
                  </span>
                  {ids.length > 0 && (
                    <Link href={replayHref(ids, s.key)} className="tap flex items-center rounded-lg bg-bg-muted px-3 text-sm font-medium active:bg-border">
                      Rejouer
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-fg-muted">Erreurs des 7 derniers jours</h2>
          {recent.length > 0 && (
            <Link href={replayHref(recent, "Erreurs récentes")} className="tap flex items-center rounded-lg bg-accent px-3 text-sm font-semibold text-accent-fg">
              Tout rejouer ({recent.length})
            </Link>
          )}
        </div>
        <ExerciseList ids={recent} counts={counts} empty="Aucune erreur cette semaine." />
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-fg-muted">Items fragiles</h2>
          {fragile.length > 0 && (
            <Link href={replayHref(fragile.map((e) => e.id), "Items fragiles")} className="tap flex items-center rounded-lg bg-bg-muted px-3 text-sm font-medium active:bg-border">
              Tout rejouer ({fragile.length})
            </Link>
          )}
        </div>
        <ExerciseList ids={fragile.map((e) => e.id)} counts={counts} empty="Aucun item dont la dernière réponse est fausse." />
      </section>
    </main>
  );
}

function ExerciseList({ ids, counts, empty }: { ids: string[]; counts: Map<string, number>; empty: string }) {
  if (ids.length === 0) return <p className="text-sm text-fg-muted">{empty}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {ids.map((id) => {
        const ex = contentIndex.exercisesById.get(id);
        if (!ex) return null;
        const n = counts.get(id) ?? 0;
        return (
          <li key={id}>
            <Link href={replayHref([id], KIND_LABELS[ex.kind])} className="tap block rounded-lg border border-border bg-bg-elevated px-3 py-2 active:bg-bg-muted">
              <span className="flex items-center justify-between text-xs text-fg-muted">
                <span>
                  {KIND_LABELS[ex.kind]} · {ex.tags.join(", ")}
                </span>
                <span className="text-ko">
                  {n} échec{n > 1 ? "s" : ""}
                </span>
              </span>
              <span className="mt-0.5 line-clamp-2 block text-[15px]">{renderInline(ex.prompt)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
