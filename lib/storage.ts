/**
 * Persistance de la progression.
 *
 * SEUL module autorisé à toucher `localStorage`. Le reste de l'app passe par
 * `loadState` / `saveState` / `updateState` / `subscribe`. Pour changer de
 * support (IndexedDB, fichier, API…), on remplace le `Backend` ici et nulle
 * part ailleurs.
 */

import type { Grade, ItemState } from "./srs";
import { emptyStreak, type StreakState } from "./streak";

export const STORAGE_KEY = "app-revision:state";
export const STATE_VERSION = 2 as const;
/** Nombre maximal de réponses conservées dans le journal. */
export const MAX_ATTEMPTS = 5000;

export type Attempt = {
  exerciseId: string;
  /** Timestamp ms. */
  at: number;
  correct: boolean;
  grade: Grade;
};

export type AppState = {
  version: typeof STATE_VERSION;
  /** État de répétition espacée par id d'exercice (la « maîtrise », variable). */
  items: Record<string, ItemState>;
  /** Journal chronologique de toutes les réponses (erreurs incluses). */
  attempts: Attempt[];
  /** Id de leçon → timestamp de la dernière lecture. */
  lessonsRead: Record<string, number>;
  /**
   * Id de chapitre → timestamp de validation (l'« accès », stable).
   * Un chapitre validé une fois ne se referme jamais.
   */
  validatedChapters: Record<string, number>;
  streak: StreakState;
};

export function createEmptyState(): AppState {
  return {
    version: STATE_VERSION,
    items: {},
    attempts: [],
    lessonsRead: {},
    validatedChapters: {},
    streak: emptyStreak(),
  };
}

// ---------------------------------------------------------------------------
// Backend
// ---------------------------------------------------------------------------

export type Backend = {
  get(): string | null;
  set(value: string): void;
  remove(): void;
};

export function createMemoryBackend(initial: string | null = null): Backend {
  let value = initial;
  return {
    get: () => value,
    set: (v) => {
      value = v;
    },
    remove: () => {
      value = null;
    },
  };
}

function createLocalStorageBackend(): Backend {
  return {
    get: () => {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    },
    set: (v) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, v);
      } catch {
        // quota dépassé ou navigation privée : on garde l'état en mémoire
      }
    },
    remove: () => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  };
}

function defaultBackend(): Backend {
  if (typeof window === "undefined") return createMemoryBackend();
  try {
    if (!("localStorage" in window) || window.localStorage === null) return createMemoryBackend();
  } catch {
    return createMemoryBackend();
  }
  return createLocalStorageBackend();
}

let backend: Backend = defaultBackend();
let cache: AppState | null = null;
const listeners = new Set<(state: AppState) => void>();

/** Remplace le support de stockage (tests, futur backend). Vide le cache. */
export function configureStorage(next: Backend): void {
  backend = next;
  cache = null;
}

// ---------------------------------------------------------------------------
// Validation / migration
// ---------------------------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isItemState(v: unknown): v is ItemState {
  return (
    isRecord(v) &&
    typeof v.ease === "number" &&
    typeof v.interval === "number" &&
    typeof v.reps === "number" &&
    typeof v.lapses === "number" &&
    typeof v.due === "number" &&
    typeof v.lastReview === "number"
  );
}

function isAttempt(v: unknown): v is Attempt {
  return (
    isRecord(v) &&
    typeof v.exerciseId === "string" &&
    typeof v.at === "number" &&
    typeof v.correct === "boolean" &&
    (v.grade === "again" || v.grade === "hard" || v.grade === "good")
  );
}

function numberMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (isRecord(v)) {
    for (const [k, n] of Object.entries(v)) if (typeof n === "number") out[k] = n;
  }
  return out;
}

/**
 * Transforme une valeur brute (JSON parsé) en `AppState` valide.
 * Toute donnée illisible est ignorée plutôt que de faire planter l'app.
 *
 * Migrations :
 * - v1 → v2 : ajout de `validatedChapters` (vide ; la validation sera
 *   recalculée à la prochaine réponse via `settleValidation`).
 */
export function migrate(raw: unknown): AppState {
  const empty = createEmptyState();
  if (!isRecord(raw)) return empty;
  if (raw.version !== 1 && raw.version !== STATE_VERSION) return empty;

  const items: Record<string, ItemState> = {};
  if (isRecord(raw.items)) {
    for (const [id, st] of Object.entries(raw.items)) {
      if (isItemState(st)) items[id] = st;
    }
  }

  const attempts = Array.isArray(raw.attempts) ? raw.attempts.filter(isAttempt) : [];
  const lessonsRead = numberMap(raw.lessonsRead);
  const validatedChapters = raw.version === 1 ? {} : numberMap(raw.validatedChapters);

  let streak = emptyStreak();
  if (
    isRecord(raw.streak) &&
    typeof raw.streak.current === "number" &&
    typeof raw.streak.longest === "number" &&
    (typeof raw.streak.lastActiveDay === "string" || raw.streak.lastActiveDay === null)
  ) {
    streak = {
      current: raw.streak.current,
      longest: raw.streak.longest,
      lastActiveDay: raw.streak.lastActiveDay,
    };
  }

  return { version: STATE_VERSION, items, attempts, lessonsRead, validatedChapters, streak };
}

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------

/** Lit l'état. Ne lève jamais : renvoie un état vide si rien n'est lisible. */
export function loadState(): AppState {
  if (cache) return cache;
  const raw = backend.get();
  let parsed: unknown = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }
  cache = migrate(parsed);
  return cache;
}

/** Écrit l'état (en bornant la taille du journal) et notifie les abonnés. */
export function saveState(state: AppState): AppState {
  const bounded =
    state.attempts.length > MAX_ATTEMPTS
      ? { ...state, attempts: state.attempts.slice(-MAX_ATTEMPTS) }
      : state;
  cache = bounded;
  backend.set(JSON.stringify(bounded));
  for (const l of listeners) l(bounded);
  return bounded;
}

/** Lecture-modification-écriture atomique du point de vue de l'app. */
export function updateState(fn: (state: AppState) => AppState): AppState {
  return saveState(fn(loadState()));
}

export function resetState(): AppState {
  backend.remove();
  cache = createEmptyState();
  for (const l of listeners) l(cache);
  return cache;
}

/** Abonnement aux changements (pour `useSyncExternalStore`). */
export function subscribe(listener: (state: AppState) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Invalide le cache si un autre onglet a écrit (événement `storage`).
 * À appeler une fois côté client.
 */
export function listenToOtherTabs(): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      const state = loadState();
      for (const l of listeners) l(state);
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
