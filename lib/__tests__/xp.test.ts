import { describe, expect, it } from "vitest";
import { answerExercise, markLessonRead } from "@/lib/engine";
import { contentIndex } from "@/content";
import { migrate, createEmptyState } from "@/lib/storage";
import { addDailyXp, goalInfo, levelInfo, xpForGrade, xpToReach, DAILY_HISTORY_DAYS } from "@/lib/xp";

const T0 = new Date(2026, 9, 14, 10).getTime();
const DAY = 86_400_000;

describe("niveaux", () => {
  it("part du niveau 1 à 0 XP", () => {
    expect(levelInfo(0)).toMatchObject({ level: 1, into: 0, span: 100, progress: 0 });
  });
  it("change de niveau pile au seuil", () => {
    expect(levelInfo(99).level).toBe(1);
    expect(levelInfo(100).level).toBe(2);
    expect(levelInfo(249).level).toBe(2);
    expect(levelInfo(250).level).toBe(3);
  });
  it("les seuils sont strictement croissants", () => {
    for (let l = 1; l < 30; l++) expect(xpToReach(l + 1)).toBeGreaterThan(xpToReach(l));
  });
  it("garde un titre au-delà du dernier niveau nommé", () => {
    expect(levelInfo(1_000_000).title).toBe("Légende");
  });
});

describe("objectif quotidien", () => {
  it("cumule par jour et indique le reste", () => {
    let d = addDailyXp({}, 20, T0);
    d = addDailyXp(d, 15, T0);
    expect(goalInfo(d, 50, T0)).toMatchObject({ done: 35, remaining: 15, reached: false });
    expect(goalInfo(d, 50, T0 + DAY).done).toBe(0);
  });
  it("atteint l'objectif sans dépasser 100 % d'avancement", () => {
    const g = goalInfo(addDailyXp({}, 80, T0), 50, T0);
    expect(g).toMatchObject({ reached: true, remaining: 0, progress: 1 });
  });
  it("élague l'historique ancien", () => {
    let d = {};
    for (let i = 0; i < DAILY_HISTORY_DAYS + 10; i++) d = addDailyXp(d, 1, T0 + i * DAY);
    expect(Object.keys(d)).toHaveLength(DAILY_HISTORY_DAYS);
  });
});

describe("XP dans le moteur", () => {
  const exId = contentIndex.exercisesInOrder[0].id;
  it("une bonne réponse rapporte plus qu'une erreur, mais une erreur rapporte", () => {
    const good = answerExercise(createEmptyState(), contentIndex, exId, "good", T0);
    const bad = answerExercise(createEmptyState(), contentIndex, exId, "again", T0);
    expect(good.xp).toBe(xpForGrade("good"));
    expect(bad.xp).toBe(xpForGrade("again"));
    expect(bad.xp).toBeGreaterThan(0);
    expect(good.xp).toBeGreaterThan(bad.xp);
  });
  it("la lecture d'une leçon ne rapporte qu'une fois", () => {
    const once = markLessonRead(createEmptyState(), "l1", T0);
    const twice = markLessonRead(once, "l1", T0 + 1000);
    expect(once.xp).toBeGreaterThan(0);
    expect(twice.xp).toBe(once.xp);
  });
});

describe("migration v2 → v3", () => {
  it("reconstitue l'XP depuis le journal", () => {
    const v2 = {
      version: 2,
      items: {},
      attempts: [
        { exerciseId: "a", at: 1, correct: true, grade: "good" },
        { exerciseId: "b", at: 2, correct: false, grade: "again" },
      ],
      lessonsRead: {},
      validatedChapters: {},
      streak: { current: 0, longest: 0, lastActiveDay: null },
    };
    const s = migrate(v2);
    expect(s.xp).toBe(xpForGrade("good") + xpForGrade("again"));
    expect(s.program).toBeNull();
    expect(s.dailyGoal).toBe(50);
  });
  it("conserve un programme valide et ignore un programme corrompu", () => {
    const base = { ...createEmptyState() };
    expect(migrate({ ...base, program: { startedAt: 5, skipped: ["x", 3] } }).program).toEqual({ startedAt: 5, skipped: ["x"] });
    expect(migrate({ ...base, program: { startedAt: "hier" } }).program).toBeNull();
  });
});
