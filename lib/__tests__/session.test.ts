import { describe, expect, it } from "vitest";
import { markLessonRead, recordAnswer } from "@/lib/engine";
import {
  composeLearningSession,
  composeReplaySession,
  composeReviewSession,
  countDue,
  learningProgress,
  recentErrorIds,
} from "@/lib/session";
import { DAY_MS } from "@/lib/srs";
import { createEmptyState, type AppState } from "@/lib/storage";
import type { Chapter, Exercise } from "@/lib/types";
import { fixtureIndex, mcq } from "./fixtures";

const T0 = Date.UTC(2026, 8, 9, 8, 0, 0);

function pool(n: number, prefix = "e"): Exercise[] {
  return Array.from({ length: n }, (_, i) => mcq(`${prefix}${i}`));
}

const chapter: Chapter = {
  id: "c",
  title: "C",
  objective: "",
  prerequisites: [],
  units: [
    { kind: "lesson", id: "L1", title: "", blocks: [] },
    mcq("a1"),
    mcq("a2"),
    { kind: "lesson", id: "L2", title: "", blocks: [] },
    mcq("b1"),
    mcq("b2"),
  ],
};

describe("mode apprentissage", () => {
  it("parcourt le chapitre dans l'ordre, leçon puis exercices", () => {
    const plan = composeLearningSession({ chapter, state: createEmptyState() });
    expect(plan.mode).toBe("learn");
    expect(plan.chapterId).toBe("c");
    expect(plan.steps).toEqual([
      { kind: "lesson", lessonId: "L1" },
      { kind: "exercise", exerciseId: "a1" },
      { kind: "exercise", exerciseId: "a2" },
      { kind: "lesson", lessonId: "L2" },
      { kind: "exercise", exerciseId: "b1" },
      { kind: "exercise", exerciseId: "b2" },
    ]);
  });

  it("reprend où on en était, en réaffichant la leçon du bloc en cours", () => {
    let s = createEmptyState();
    s = markLessonRead(s, "L1", T0);
    s = recordAnswer(s, "a1", "good", T0);
    const plan = composeLearningSession({ chapter, state: s });
    expect(plan.steps).toEqual([
      { kind: "lesson", lessonId: "L1" }, // réinsérée pour donner le contexte
      { kind: "exercise", exerciseId: "a2" },
      { kind: "lesson", lessonId: "L2" },
      { kind: "exercise", exerciseId: "b1" },
      { kind: "exercise", exerciseId: "b2" },
    ]);
  });

  it("un exercice raté reste à faire", () => {
    let s = createEmptyState();
    s = markLessonRead(s, "L1", T0);
    s = recordAnswer(s, "a1", "again", T0);
    const plan = composeLearningSession({ chapter, state: s });
    expect(plan.steps[1]).toEqual({ kind: "exercise", exerciseId: "a1" });
  });

  it("chapitre entièrement fait : session vide en reprise, complète sans reprise", () => {
    let s = createEmptyState();
    s = markLessonRead(s, "L1", T0);
    s = markLessonRead(s, "L2", T0);
    for (const id of ["a1", "a2", "b1", "b2"]) s = recordAnswer(s, id, "good", T0);
    expect(composeLearningSession({ chapter, state: s }).steps).toEqual([]);
    expect(composeLearningSession({ chapter, state: s, resume: false }).steps).toHaveLength(6);
    expect(learningProgress(chapter, s)).toEqual({ done: 6, total: 6 });
  });
});

describe("mode révision", () => {
  it("sans historique : rien à réviser", () => {
    const plan = composeReviewSession({ exercises: pool(20), state: createEmptyState(), now: T0 });
    expect(plan.mode).toBe("review");
    expect(plan.steps).toEqual([]);
  });

  it("ne contient que des items dus, jamais de leçon ni de nouveau", () => {
    const exercises = pool(20);
    let s: AppState = createEmptyState();
    for (let i = 0; i < 5; i++) s = recordAnswer(s, `e${i}`, "good", T0 - 2 * DAY_MS); // dus
    for (let i = 5; i < 8; i++) s = recordAnswer(s, `e${i}`, "good", T0); // pas dus avant demain
    const plan = composeReviewSession({ exercises, state: s, now: T0 });
    const ids = plan.steps.map((st) => (st.kind === "exercise" ? st.exerciseId : "lesson")).sort();
    expect(ids).toEqual(["e0", "e1", "e2", "e3", "e4"]);
    expect(countDue(exercises, s, T0)).toBe(5);
  });

  it("garde les plus urgents quand il y a plus d'items dus que de places", () => {
    const exercises = pool(40);
    let s: AppState = createEmptyState();
    // 20 items acquis (4 réussites à échéance depuis 40 jours : 1 → 3 → 8 → 22 j), dus depuis 6 jours
    for (let i = 0; i < 20; i++) {
      let now = T0 - 40 * DAY_MS;
      for (let k = 0; k < 4; k++) {
        s = recordAnswer(s, `e${i}`, "good", now);
        now = s.items[`e${i}`].due;
      }
      expect(s.items[`e${i}`].due).toBeLessThan(T0);
    }
    // 3 items ratés hier
    for (const id of ["e30", "e31", "e32"]) s = recordAnswer(s, id, "again", T0 - DAY_MS);
    const plan = composeReviewSession({ exercises, state: s, now: T0, seed: 1 });
    const ids = plan.steps.map((st) => (st.kind === "exercise" ? st.exerciseId : ""));
    expect(ids).toHaveLength(12);
    expect(ids).toEqual(expect.arrayContaining(["e30", "e31", "e32"]));
  });

  it("n'inclut jamais un exercice hors de la liste éligible", () => {
    let s: AppState = createEmptyState();
    s = recordAnswer(s, "locked", "again", T0 - 1000);
    const plan = composeReviewSession({ exercises: pool(5), state: s, now: T0 });
    expect(plan.steps).toEqual([]);
  });

  it("est déterministe pour une graine donnée et borné à [10, 15]", () => {
    const exercises = pool(30);
    let s: AppState = createEmptyState();
    for (let i = 0; i < 30; i++) s = recordAnswer(s, `e${i}`, "good", T0 - 2 * DAY_MS);
    const a = composeReviewSession({ exercises, state: s, now: T0, seed: 42 });
    const b = composeReviewSession({ exercises, state: s, now: T0, seed: 42 });
    expect(a).toEqual(b);
    expect(composeReviewSession({ exercises, state: s, now: T0, size: 3 }).steps).toHaveLength(10);
    expect(composeReviewSession({ exercises, state: s, now: T0, size: 40 }).steps).toHaveLength(15);
  });
});

describe("rejouer / journal", () => {
  it("composeReplaySession conserve l'ordre donné", () => {
    expect(composeReplaySession(["b", "a"]).steps).toEqual([
      { kind: "exercise", exerciseId: "b" },
      { kind: "exercise", exerciseId: "a" },
    ]);
  });

  it("recentErrorIds liste les erreurs de la fenêtre, une fois chacune, la plus récente d'abord", () => {
    let s = createEmptyState();
    s = recordAnswer(s, "old", "again", T0 - 10 * DAY_MS);
    s = recordAnswer(s, "a", "again", T0 - 3 * DAY_MS);
    s = recordAnswer(s, "b", "again", T0 - 2 * DAY_MS);
    s = recordAnswer(s, "a", "again", T0 - DAY_MS);
    s = recordAnswer(s, "c", "good", T0);
    expect(recentErrorIds(s, T0)).toEqual(["a", "b"]);
  });
});

describe("éligibilité via l'index", () => {
  it("les exercices des chapitres fermés ne sont pas proposés en révision", () => {
    const index = fixtureIndex();
    let s: AppState = createEmptyState();
    s = recordAnswer(s, "j2a", "again", T0 - 1000); // chapitre 2 fermé
    s = recordAnswer(s, "j1a", "again", T0 - 1000);
    const open = index.exercisesInOrder.filter((e) => {
      const ch = index.chapterOfExercise.get(e.id)!;
      return ch.prerequisites.every((p) => s.validatedChapters[p] !== undefined);
    });
    const plan = composeReviewSession({ exercises: open, state: s, now: T0 });
    expect(plan.steps).toEqual([{ kind: "exercise", exerciseId: "j1a" }]);
  });
});
