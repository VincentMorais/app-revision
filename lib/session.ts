/**
 * Deux modes, deux logiques de sélection :
 *
 * - APPRENTISSAGE (`composeLearningSession`) : parcours linéaire d'un chapitre,
 *   leçon puis exercices portant sur ce qui vient d'être lu. Découverte de
 *   contenu neuf. On reprend au premier élément pas encore fait.
 *
 * - RÉVISION (`composeReviewSession`) : items dus par répétition espacée, tous
 *   chapitres ouverts confondus, sans leçon. Les plus fragiles d'abord.
 *   Entretien de l'acquis.
 *
 * - REJOUER (`composeReplaySession`) : liste explicite d'exercices (journal
 *   d'erreurs, fin de session), sans leçon.
 */

import { createRng, shuffle } from "./random";
import { DAY_MS, sortDue, type ItemState } from "./srs";
import type { AppState } from "./storage";
import type { Chapter, Exercise } from "./types";

export type SessionMode = "learn" | "review" | "replay";

export type SessionStep =
  | { kind: "lesson"; lessonId: string }
  | { kind: "exercise"; exerciseId: string };

export type SessionPlan = {
  mode: SessionMode;
  /** Chapitre concerné (mode apprentissage). */
  chapterId?: string;
  steps: SessionStep[];
};

// ---------------------------------------------------------------------------
// Apprentissage
// ---------------------------------------------------------------------------

export type LearningOptions = {
  chapter: Chapter;
  state: AppState;
  /**
   * Si vrai (défaut), on saute les leçons déjà lues et les exercices déjà
   * répondus juste, pour reprendre où on en était. Si faux, tout le chapitre.
   */
  resume?: boolean;
};

export function composeLearningSession(opts: LearningOptions): SessionPlan {
  const { chapter, state } = opts;
  const resume = opts.resume ?? true;
  const steps: SessionStep[] = [];

  for (const unit of chapter.units) {
    if (unit.kind === "lesson") {
      if (resume && state.lessonsRead[unit.id] !== undefined) continue;
      steps.push({ kind: "lesson", lessonId: unit.id });
    } else {
      const st = state.items[unit.id];
      if (resume && st && st.reps > 0) continue;
      steps.push({ kind: "exercise", exerciseId: unit.id });
    }
  }

  // Un exercice doit toujours être précédé de sa leçon dans la session, même
  // déjà lue, sinon on arrive sur des exercices sans contexte après une reprise.
  // On réinsère la dernière leçon précédant le premier exercice retenu.
  if (resume && steps.length > 0 && steps[0].kind === "exercise") {
    const firstExerciseIdx = chapter.units.findIndex(
      (u) => u.kind !== "lesson" && u.id === (steps[0] as { exerciseId: string }).exerciseId,
    );
    for (let i = firstExerciseIdx - 1; i >= 0; i--) {
      const u = chapter.units[i];
      if (u.kind === "lesson") {
        steps.unshift({ kind: "lesson", lessonId: u.id });
        break;
      }
    }
  }

  return { mode: "learn", chapterId: chapter.id, steps };
}

/** Position dans un chapitre : unités faites / total. */
export function learningProgress(chapter: Chapter, state: AppState): { done: number; total: number } {
  let done = 0;
  for (const unit of chapter.units) {
    if (unit.kind === "lesson") {
      if (state.lessonsRead[unit.id] !== undefined) done++;
    } else if ((state.items[unit.id]?.reps ?? 0) > 0) done++;
  }
  return { done, total: chapter.units.length };
}

// ---------------------------------------------------------------------------
// Révision
// ---------------------------------------------------------------------------

export const REVIEW_MIN = 10;
export const REVIEW_MAX = 15;
export const REVIEW_DEFAULT = 12;

export type ReviewOptions = {
  /** Exercices éligibles (chapitres ouverts), dans l'ordre du référentiel. */
  exercises: Exercise[];
  state: AppState;
  now: number;
  /** Taille visée. Défaut 12, bornée à [10, 15]. */
  size?: number;
  /** Graine du mélange. Défaut : dérivée du jour. */
  seed?: number;
};

/** Nombre d'items dus, pour l'afficher sur l'accueil. */
export function countDue(exercises: Exercise[], state: AppState, now: number): number {
  let n = 0;
  for (const ex of exercises) {
    const st = state.items[ex.id];
    if (st && st.due <= now) n++;
  }
  return n;
}

export function composeReviewSession(opts: ReviewOptions): SessionPlan {
  const { exercises, state, now } = opts;
  const size = Math.min(REVIEW_MAX, Math.max(REVIEW_MIN, opts.size ?? REVIEW_DEFAULT));

  const entries: { id: string; state: ItemState }[] = [];
  for (const ex of exercises) {
    const st = state.items[ex.id];
    if (st) entries.push({ id: ex.id, state: st });
  }
  const due = sortDue(entries, now);

  // On prend les `size` plus urgents, puis on mélange ce sous-ensemble pour ne
  // pas enchaîner tous les fragiles d'un bloc : l'urgence décide de QUI passe,
  // pas de l'ordre d'affichage.
  const picked = due.slice(0, size).map((e) => e.id);
  const rng = createRng(opts.seed ?? Math.floor(now / DAY_MS));
  const steps: SessionStep[] = shuffle(picked, rng).map((exerciseId) => ({ kind: "exercise", exerciseId }));
  return { mode: "review", steps };
}

// ---------------------------------------------------------------------------
// Rejouer
// ---------------------------------------------------------------------------

export function composeReplaySession(exerciseIds: string[]): SessionPlan {
  return {
    mode: "replay",
    steps: exerciseIds.map((exerciseId) => ({ kind: "exercise", exerciseId })),
  };
}

/** Ids des exercices ratés dans la fenêtre, du plus récent au plus ancien (journal d'erreurs). */
export function recentErrorIds(state: AppState, now: number, windowDays = 7): string[] {
  const since = now - windowDays * DAY_MS;
  const seen = new Set<string>();
  const out: string[] = [];
  for (let i = state.attempts.length - 1; i >= 0; i--) {
    const a = state.attempts[i];
    if (a.at < since) break;
    if (!a.correct && !seen.has(a.exerciseId)) {
      seen.add(a.exerciseId);
      out.push(a.exerciseId);
    }
  }
  return out;
}
