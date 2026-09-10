import { describe, expect, it } from "vitest";
import { answerExercise, recordAnswer } from "@/lib/engine";
import {
  chapterMastery,
  chapterProgress,
  courseProgress,
  isChapterUnlocked,
  settleValidation,
  unlockedChapters,
} from "@/lib/progress";
import { createEmptyState, type AppState } from "@/lib/storage";
import { fixtureIndex } from "./fixtures";

const T0 = Date.UTC(2026, 8, 9, 8, 0, 0);
const index = fixtureIndex();
const ch = (id: string) => index.chaptersById.get(id)!;

function answered(ids: string[], grade: "good" | "again" = "good"): AppState {
  let s = createEmptyState();
  for (const id of ids) s = answerExercise(s, index, id, grade, T0);
  return s;
}

describe("accès (stable)", () => {
  it("au départ, seuls les chapitres sans prérequis sont ouverts", () => {
    const state = createEmptyState();
    expect(unlockedChapters(index, state).map((c) => c.id)).toEqual(["java-ch1"]);
  });

  it("2 bons sur 3 (67 %) ne valide pas le chapitre", () => {
    const state = answered(["j1a", "j1b"]);
    expect(chapterProgress(ch("java-ch1"), index, state).validated).toBe(false);
    expect(isChapterUnlocked(ch("java-ch2"), index, state)).toBe(false);
  });

  it("3 bons sur 3 valide et ouvre les chapitres dépendants, y compris dans un autre parcours", () => {
    const state = answered(["j1a", "j1b", "j1c"]);
    const p = chapterProgress(ch("java-ch1"), index, state);
    expect(p.validated).toBe(true);
    expect(p.validatedAt).toBe(T0);
    expect(unlockedChapters(index, state).map((c) => c.id)).toEqual(["java-ch1", "java-ch2", "react-r1"]);
    expect(isChapterUnlocked(ch("java-ch3"), index, state)).toBe(false);
  });

  it("aller simple : une erreur ultérieure ne referme ni le chapitre ni ses dépendants", () => {
    let state = answered(["j1a", "j1b", "j1c"]);
    state = answerExercise(state, index, "j1c", "again", T0 + 1000);
    state = answerExercise(state, index, "j1b", "again", T0 + 2000);
    const p = chapterProgress(ch("java-ch1"), index, state);
    expect(p.validated).toBe(true);
    expect(p.validatedAt).toBe(T0); // date d'origine conservée
    expect(p.meetsThreshold).toBe(false); // mais la maîtrise, elle, est retombée
    expect(unlockedChapters(index, state).map((c) => c.id)).toEqual(["java-ch1", "java-ch2", "react-r1"]);
  });

  it("settleValidation ne valide que ce qui atteint le seuil, et est idempotent", () => {
    let state = createEmptyState();
    for (const id of ["j1a", "j1b", "j1c"]) state = recordAnswer(state, id, "good", T0);
    expect(state.validatedChapters).toEqual({});
    const settled = settleValidation(state, index, T0);
    expect(settled.validatedChapters).toEqual({ "java-ch1": T0 });
    expect(settleValidation(settled, index, T0 + 5000)).toBe(settled);
  });
});

describe("maîtrise (variable)", () => {
  it("monte et redescend avec les réponses", () => {
    let state = answered(["j1a", "j1b", "j1c"]);
    expect(chapterMastery(ch("java-ch1"), state).rate).toBe(1);
    state = answerExercise(state, index, "j1c", "again", T0 + 1000);
    const m = chapterMastery(ch("java-ch1"), state);
    expect(m.mastered).toBe(2);
    expect(m.seen).toBe(3);
    expect(m.rate).toBeCloseTo(2 / 3);
    expect(m.byLevel).toEqual({ new: 0, fragile: 1, learning: 2, acquired: 0 });
  });

  it("un chapitre sans exercice a une maîtrise de 1", () => {
    const empty = { ...ch("java-ch1"), units: [] };
    expect(chapterMastery(empty, createEmptyState()).rate).toBe(1);
  });
});

describe("courseProgress", () => {
  it("agrège les chapitres", () => {
    const state = answered(["j1a", "j1b", "j1c", "j2a"]);
    const p = courseProgress("java", index, state);
    expect(p.validatedChapters).toBe(1);
    expect(p.chapters.map((c) => c.unlocked)).toEqual([true, true, false]);
    expect(p.rate).toBeCloseTo((1 + 1 / 3 + 0) / 3);
  });
});
