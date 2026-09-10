import { beforeEach, describe, expect, it } from "vitest";
import {
  MAX_ATTEMPTS,
  STATE_VERSION,
  configureStorage,
  createEmptyState,
  createMemoryBackend,
  loadState,
  migrate,
  resetState,
  saveState,
  subscribe,
  updateState,
  type AppState,
} from "@/lib/storage";

beforeEach(() => {
  configureStorage(createMemoryBackend());
});

describe("loadState", () => {
  it("renvoie un état vide quand rien n'est stocké", () => {
    expect(loadState()).toEqual(createEmptyState());
  });

  it("renvoie un état vide si le JSON est corrompu", () => {
    configureStorage(createMemoryBackend("{not json"));
    expect(loadState()).toEqual(createEmptyState());
  });

  it("relit ce qui a été sauvegardé", () => {
    const backend = createMemoryBackend();
    configureStorage(backend);
    const state = updateState((s) => ({
      ...s,
      items: { ex1: { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 10, lastReview: 5 } },
      attempts: [{ exerciseId: "ex1", at: 5, correct: true, grade: "good" }],
      lessonsRead: { l1: 3 },
      validatedChapters: { ch1: 7 },
      streak: { current: 2, longest: 3, lastActiveDay: "2026-09-09" },
    }));
    configureStorage(backend); // vide le cache, force la relecture
    expect(loadState()).toEqual(state);
  });
});

describe("migrate", () => {
  it("ignore les entrées invalides sans perdre les valides", () => {
    const raw = {
      version: STATE_VERSION,
      items: {
        ok: { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 10, lastReview: 5 },
        bad: { ease: "x" },
      },
      attempts: [
        { exerciseId: "ok", at: 5, correct: true, grade: "good" },
        { exerciseId: "ok", at: 6, correct: "yes", grade: "good" },
        null,
      ],
      lessonsRead: { l1: 3, l2: "hier" },
      validatedChapters: { ch1: 9, ch2: "non" },
      streak: { current: 1, longest: 1, lastActiveDay: null },
    };
    const state = migrate(raw);
    expect(Object.keys(state.items)).toEqual(["ok"]);
    expect(state.attempts).toHaveLength(1);
    expect(state.lessonsRead).toEqual({ l1: 3 });
    expect(state.validatedChapters).toEqual({ ch1: 9 });
    expect(state.streak).toEqual({ current: 1, longest: 1, lastActiveDay: null });
  });

  it("migre un état v1 en conservant items, journal et série", () => {
    const v1 = {
      version: 1,
      items: { ok: { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 10, lastReview: 5 } },
      attempts: [{ exerciseId: "ok", at: 5, correct: true, grade: "good" }],
      lessonsRead: { l1: 3 },
      streak: { current: 4, longest: 4, lastActiveDay: "2026-09-08" },
    };
    const state = migrate(v1);
    expect(state.version).toBe(STATE_VERSION);
    expect(Object.keys(state.items)).toEqual(["ok"]);
    expect(state.attempts).toHaveLength(1);
    expect(state.validatedChapters).toEqual({});
    expect(state.streak.current).toBe(4);
  });

  it("repart de zéro pour une version inconnue", () => {
    expect(migrate({ version: 99, items: { a: 1 } })).toEqual(createEmptyState());
  });
});

describe("saveState", () => {
  it("borne le journal à MAX_ATTEMPTS en gardant les plus récents", () => {
    const attempts = Array.from({ length: MAX_ATTEMPTS + 10 }, (_, i) => ({
      exerciseId: "e",
      at: i,
      correct: true,
      grade: "good" as const,
    }));
    const saved = saveState({ ...createEmptyState(), attempts });
    expect(saved.attempts).toHaveLength(MAX_ATTEMPTS);
    expect(saved.attempts[0].at).toBe(10);
  });

  it("notifie les abonnés", () => {
    const received: AppState[] = [];
    const unsub = subscribe((s) => received.push(s));
    updateState((s) => ({ ...s, lessonsRead: { l1: 1 } }));
    unsub();
    updateState((s) => ({ ...s, lessonsRead: { l1: 2 } }));
    expect(received).toHaveLength(1);
    expect(received[0].lessonsRead).toEqual({ l1: 1 });
  });
});

describe("resetState", () => {
  it("efface tout", () => {
    updateState((s) => ({ ...s, lessonsRead: { l1: 1 } }));
    resetState();
    expect(loadState()).toEqual(createEmptyState());
  });
});
