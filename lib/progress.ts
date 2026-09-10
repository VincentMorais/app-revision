/**
 * Progression : ACCÈS (stable) et MAÎTRISE (variable) sont deux notions séparées.
 *
 * - Maîtrise d'un chapitre : part de ses exercices dont la dernière réponse est
 *   juste (état SRS `reps > 0`). Elle monte et redescend honnêtement ; elle
 *   s'affiche et alimente la révision.
 * - Validation / accès : un chapitre est validé la première fois que sa maîtrise
 *   atteint 70 %. La validation est écrite dans `state.validatedChapters` et ne
 *   se retire jamais. Un chapitre est ouvert quand tous ses prérequis sont validés.
 */

import { exercisesOf, type ContentIndex } from "./content";
import { masteryOf, type Mastery } from "./srs";
import type { AppState } from "./storage";
import type { Chapter } from "./types";

export const VALIDATION_THRESHOLD = 0.7;

export type ChapterMastery = {
  total: number;
  /** Exercices rencontrés au moins une fois. */
  seen: number;
  /** Exercices dont la dernière réponse est juste. */
  mastered: number;
  /** mastered / total (1 si le chapitre n'a pas d'exercice). */
  rate: number;
  /** Répartition par niveau SRS. */
  byLevel: Record<Mastery, number>;
};

export type ChapterProgress = ChapterMastery & {
  chapterId: string;
  /** Accès stable : validé une fois, validé pour toujours. */
  validated: boolean;
  validatedAt: number | null;
  unlocked: boolean;
  /** Vrai si la maîtrise actuelle atteint le seuil (peut différer de `validated`). */
  meetsThreshold: boolean;
};

export function chapterMastery(chapter: Chapter, state: AppState): ChapterMastery {
  const exercises = exercisesOf(chapter);
  const total = exercises.length;
  const byLevel: Record<Mastery, number> = { new: 0, fragile: 0, learning: 0, acquired: 0 };
  let seen = 0;
  let mastered = 0;
  for (const ex of exercises) {
    const st = state.items[ex.id];
    byLevel[masteryOf(st)]++;
    if (!st) continue;
    seen++;
    if (st.reps > 0) mastered++;
  }
  return { total, seen, mastered, rate: total === 0 ? 1 : mastered / total, byLevel };
}

export function isChapterValidated(chapter: Chapter, state: AppState): boolean {
  return state.validatedChapters[chapter.id] !== undefined;
}

export function isChapterUnlocked(chapter: Chapter, index: ContentIndex, state: AppState): boolean {
  return chapter.prerequisites.every((id) => {
    const prereq = index.chaptersById.get(id);
    return prereq !== undefined && isChapterValidated(prereq, state);
  });
}

export function chapterProgress(chapter: Chapter, index: ContentIndex, state: AppState): ChapterProgress {
  const mastery = chapterMastery(chapter, state);
  const validatedAt = state.validatedChapters[chapter.id] ?? null;
  return {
    chapterId: chapter.id,
    ...mastery,
    validated: validatedAt !== null,
    validatedAt,
    unlocked: isChapterUnlocked(chapter, index, state),
    meetsThreshold: mastery.rate >= VALIDATION_THRESHOLD,
  };
}

/**
 * Inscrit comme validés les chapitres qui atteignent le seuil et ne le sont
 * pas encore. Ne retire jamais une validation. À appeler après chaque réponse.
 */
export function settleValidation(state: AppState, index: ContentIndex, now: number): AppState {
  let next: Record<string, number> | null = null;
  for (const chapter of index.chaptersById.values()) {
    if (state.validatedChapters[chapter.id] !== undefined) continue;
    if (chapterMastery(chapter, state).rate >= VALIDATION_THRESHOLD) {
      next ??= { ...state.validatedChapters };
      next[chapter.id] = now;
    }
  }
  return next ? { ...state, validatedChapters: next } : state;
}

/** Chapitres ouverts, dans l'ordre du référentiel. */
export function unlockedChapters(index: ContentIndex, state: AppState): Chapter[] {
  const out: Chapter[] = [];
  for (const course of index.courses) {
    for (const chapter of course.chapters) {
      if (isChapterUnlocked(chapter, index, state)) out.push(chapter);
    }
  }
  return out;
}

export type CourseProgress = {
  courseId: string;
  chapters: ChapterProgress[];
  /** Moyenne des taux de maîtrise des chapitres (0..1). */
  rate: number;
  validatedChapters: number;
};

export function courseProgress(courseId: string, index: ContentIndex, state: AppState): CourseProgress {
  const course = index.courses.find((c) => c.id === courseId);
  if (!course) throw new Error(`Parcours inconnu : ${courseId}`);
  const chapters = course.chapters.map((ch) => chapterProgress(ch, index, state));
  const rate = chapters.length === 0 ? 0 : chapters.reduce((s, c) => s + c.rate, 0) / chapters.length;
  return {
    courseId,
    chapters,
    rate,
    validatedChapters: chapters.filter((c) => c.validated).length,
  };
}
