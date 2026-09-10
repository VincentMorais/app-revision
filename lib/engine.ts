/**
 * Point d'entrée d'écriture : enregistrer une réponse, marquer une leçon lue.
 * Ce sont des fonctions pures (état → état) ; `lib/storage.ts` fait la persistance.
 */

import type { ContentIndex } from "./content";
import { settleValidation } from "./progress";
import { review, type Grade } from "./srs";
import type { AppState } from "./storage";
import { touchStreak } from "./streak";

/** Met à jour SRS, journal et série. Ne touche pas à la validation des chapitres. */
export function recordAnswer(state: AppState, exerciseId: string, grade: Grade, now: number): AppState {
  const correct = grade !== "again";
  return {
    ...state,
    items: { ...state.items, [exerciseId]: review(state.items[exerciseId], grade, now) },
    attempts: [...state.attempts, { exerciseId, at: now, correct, grade }],
    streak: touchStreak(state.streak, now),
  };
}

/** `recordAnswer` + validation des chapitres atteignant le seuil. À utiliser depuis l'UI. */
export function answerExercise(
  state: AppState,
  index: ContentIndex,
  exerciseId: string,
  grade: Grade,
  now: number,
): AppState {
  return settleValidation(recordAnswer(state, exerciseId, grade, now), index, now);
}

export function markLessonRead(state: AppState, lessonId: string, now: number): AppState {
  return { ...state, lessonsRead: { ...state.lessonsRead, [lessonId]: now } };
}
