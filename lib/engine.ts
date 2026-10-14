/**
 * Point d'entrée d'écriture : enregistrer une réponse, marquer une leçon lue.
 * Ce sont des fonctions pures (état → état) ; `lib/storage.ts` fait la persistance.
 */

import type { ContentIndex } from "./content";
import { settleValidation } from "./progress";
import { review, type Grade } from "./srs";
import type { AppState } from "./storage";
import { touchStreak } from "./streak";
import { addDailyXp, XP_LESSON, xpForGrade } from "./xp";

/** Crédite `amount` d'XP (total et jour). */
export function awardXp(state: AppState, amount: number, now: number): AppState {
  if (amount <= 0) return state;
  return { ...state, xp: state.xp + amount, daily: addDailyXp(state.daily, amount, now) };
}

/** Met à jour SRS, journal, série et XP. Ne touche pas à la validation des chapitres. */
export function recordAnswer(state: AppState, exerciseId: string, grade: Grade, now: number): AppState {
  const correct = grade !== "again";
  const next: AppState = {
    ...state,
    items: { ...state.items, [exerciseId]: review(state.items[exerciseId], grade, now) },
    attempts: [...state.attempts, { exerciseId, at: now, correct, grade }],
    streak: touchStreak(state.streak, now),
  };
  return awardXp(next, xpForGrade(grade), now);
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
  const next = { ...state, lessonsRead: { ...state.lessonsRead, [lessonId]: now } };
  // L'XP de lecture n'est versé qu'à la première lecture, sinon relire rapporterait.
  return state.lessonsRead[lessonId] === undefined ? awardXp(next, XP_LESSON, now) : next;
}
