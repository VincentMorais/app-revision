/**
 * Statistiques honnêtes : taux de réussite par parcours et par tag,
 * notions les plus ratées. Tout est dérivé du journal `attempts`.
 *
 * Les réponses `hard` (rappel libre « difficile ») comptent comme justes
 * mais sont comptabilisées à part : une notion sue laborieusement n'est pas
 * une notion sue.
 */

import type { ContentIndex } from "./content";
import type { AppState } from "./storage";

export type RateStat = {
  key: string;
  attempts: number;
  /** Réponses justes, `hard` inclus. */
  correct: number;
  /** Réponses justes mais laborieuses (`hard`). */
  hard: number;
  /** Réponses fausses. */
  errors: number;
  /** correct / attempts, ou null si aucune réponse. */
  rate: number | null;
};

type Acc = { attempts: number; correct: number; hard: number; errors: number };

function newAcc(): Acc {
  return { attempts: 0, correct: 0, hard: 0, errors: 0 };
}

function add(acc: Acc, correct: boolean, grade: string) {
  acc.attempts++;
  if (correct) acc.correct++;
  else acc.errors++;
  if (grade === "hard") acc.hard++;
}

function toStat(key: string, acc: Acc): RateStat {
  return { key, ...acc, rate: acc.attempts === 0 ? null : acc.correct / acc.attempts };
}

export function rateByCourse(index: ContentIndex, state: AppState): RateStat[] {
  const acc = new Map<string, Acc>();
  for (const course of index.courses) acc.set(course.id, newAcc());
  for (const a of state.attempts) {
    const chapter = index.chapterOfExercise.get(a.exerciseId);
    if (!chapter) continue;
    const course = index.courseOfChapter.get(chapter.id);
    if (!course) continue;
    add(acc.get(course.id)!, a.correct, a.grade);
  }
  return [...acc].map(([key, s]) => toStat(key, s));
}

export function rateByTag(index: ContentIndex, state: AppState): RateStat[] {
  const acc = new Map<string, Acc>();
  for (const a of state.attempts) {
    const ex = index.exercisesById.get(a.exerciseId);
    if (!ex) continue;
    for (const tag of ex.tags) {
      const s = acc.get(tag) ?? newAcc();
      add(s, a.correct, a.grade);
      acc.set(tag, s);
    }
  }
  return [...acc].map(([key, s]) => toStat(key, s));
}

/**
 * Notions les plus fragiles : tags ayant au moins une erreur ou une réponse
 * laborieuse, triés par erreurs décroissantes, puis `hard` décroissants, puis
 * taux croissant. `minAttempts` évite de classer une notion vue une seule fois.
 */
export function weakestTags(index: ContentIndex, state: AppState, limit = 10, minAttempts = 2): RateStat[] {
  return rateByTag(index, state)
    .filter((s) => s.attempts >= minAttempts && (s.errors > 0 || s.hard > 0))
    .sort((a, b) => b.errors - a.errors || b.hard - a.hard || (a.rate ?? 0) - (b.rate ?? 0))
    .slice(0, limit);
}

/** Exercices les plus ratés (id → nombre d'échecs), pour le journal d'erreurs. */
export function failureCounts(state: AppState): Map<string, number> {
  const counts = new Map<string, number>();
  for (const a of state.attempts) {
    if (!a.correct) counts.set(a.exerciseId, (counts.get(a.exerciseId) ?? 0) + 1);
  }
  return counts;
}
