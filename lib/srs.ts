/**
 * Répétition espacée : SM-2 simplifié.
 *
 * Chaque exercice a un état (`ItemState`) : facilité, intervalle en jours,
 * nombre de réussites consécutives, nombre d'oublis, date de prochaine révision.
 *
 * - `again` (faux)                 : l'item repart de zéro et redevient dû immédiatement.
 * - `hard`  (juste mais laborieux) : intervalle qui progresse peu, facilité en baisse.
 * - `good`  (juste)                : intervalle 1 j → 3 j → intervalle × facilité.
 *
 * Un item « acquis » (intervalle ≥ 21 j) revient donc bien moins souvent
 * qu'un item « fragile » (raté récemment).
 */

export type Grade = "again" | "hard" | "good";

export type ItemState = {
  /** Facteur de facilité, borné [1.3, 3.0]. Départ 2.5. */
  ease: number;
  /** Intervalle courant en jours (0 = jamais réussi ou vient d'être raté). */
  interval: number;
  /** Réussites consécutives depuis le dernier échec. */
  reps: number;
  /** Nombre total d'échecs. */
  lapses: number;
  /** Timestamp ms de la prochaine révision. */
  due: number;
  /** Timestamp ms de la dernière réponse. */
  lastReview: number;
};

export type Mastery = "new" | "fragile" | "learning" | "acquired";

export const DAY_MS = 24 * 60 * 60 * 1000;
export const MIN_EASE = 1.3;
export const MAX_EASE = 3.0;
export const DEFAULT_EASE = 2.5;
/** Intervalle à partir duquel un item est considéré acquis. */
export const ACQUIRED_INTERVAL_DAYS = 21;

function clampEase(ease: number): number {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, ease));
}

/** Calcule le nouvel état après une réponse. `state` absent = première rencontre. */
export function review(state: ItemState | undefined, grade: Grade, now: number): ItemState {
  const prev: ItemState = state ?? {
    ease: DEFAULT_EASE,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: now,
    lastReview: now,
  };

  switch (grade) {
    case "again":
      return {
        ease: clampEase(prev.ease - 0.2),
        interval: 0,
        reps: 0,
        lapses: prev.lapses + 1,
        due: now, // début de file : dû tout de suite
        lastReview: now,
      };
    case "hard": {
      const interval =
        prev.reps === 0 ? 1 : Math.max(prev.interval + 1, Math.round(prev.interval * 1.2));
      return {
        ease: clampEase(prev.ease - 0.15),
        interval,
        reps: prev.reps + 1,
        lapses: prev.lapses,
        due: now + interval * DAY_MS,
        lastReview: now,
      };
    }
    case "good": {
      let interval: number;
      if (prev.reps === 0) interval = 1;
      else if (prev.reps === 1) interval = 3;
      else interval = Math.max(prev.interval + 1, Math.round(prev.interval * prev.ease));
      return {
        ease: clampEase(prev.ease + 0.1),
        interval,
        reps: prev.reps + 1,
        lapses: prev.lapses,
        due: now + interval * DAY_MS,
        lastReview: now,
      };
    }
  }
}

export function isDue(state: ItemState | undefined, now: number): boolean {
  return state !== undefined && state.due <= now;
}

export function masteryOf(state: ItemState | undefined): Mastery {
  if (!state) return "new";
  if (state.reps === 0) return "fragile";
  if (state.lapses > 0 && state.reps < 2) return "fragile";
  if (state.interval >= ACQUIRED_INTERVAL_DAYS) return "acquired";
  return "learning";
}

/**
 * Urgence d'un item dû. Plus c'est grand, plus il doit passer tôt.
 * Fragile > en cours d'apprentissage > acquis ; à niveau égal, le plus
 * en retard (relativement à son intervalle) passe en premier.
 */
export function priorityOf(state: ItemState, now: number): number {
  const mastery = masteryOf(state);
  const base = mastery === "fragile" ? 1000 : mastery === "learning" ? 100 : 0;
  const overdueDays = Math.max(0, (now - state.due) / DAY_MS);
  const overdueRatio = overdueDays / Math.max(1, state.interval);
  return base + Math.min(99, overdueRatio * 10);
}

/** Garde les items dus et les trie du plus urgent au moins urgent. */
export function sortDue(
  entries: { id: string; state: ItemState }[],
  now: number,
): { id: string; state: ItemState }[] {
  return entries
    .filter((e) => isDue(e.state, now))
    .sort(
      (a, b) =>
        priorityOf(b.state, now) - priorityOf(a.state, now) || a.state.due - b.state.due,
    );
}
