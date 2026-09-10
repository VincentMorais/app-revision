"use client";

/**
 * Liaison React ↔ stockage. Seul point d'écriture depuis l'interface.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { contentIndex } from "@/content";
import { answerExercise, markLessonRead } from "./engine";
import type { Grade } from "./srs";
import { createEmptyState, loadState, resetState, subscribe, updateState, type AppState } from "./storage";

const SERVER_SNAPSHOT: AppState = createEmptyState();

/** État courant, re-rendu à chaque écriture. Vide côté serveur et pendant l'hydratation. */
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, loadState, () => SERVER_SNAPSHOT);
}

/** Vrai après le premier rendu client : évite de composer une session sur l'état vide du serveur. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export const actions = {
  answer(exerciseId: string, grade: Grade, now = Date.now()): AppState {
    return updateState((s) => answerExercise(s, contentIndex, exerciseId, grade, now));
  },
  readLesson(lessonId: string, now = Date.now()): AppState {
    return updateState((s) => markLessonRead(s, lessonId, now));
  },
  reset(): AppState {
    return resetState();
  },
};
