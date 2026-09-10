import { describe, expect, it } from "vitest";
import { grade } from "@/lib/grading";
import type { FillExercise, MatchExercise, OrderExercise, SpotExercise } from "@/lib/types";
import { mcq } from "./fixtures";

const base = { difficulty: 1 as const, tags: ["t"], prompt: "?", explanation: "!" };

const fill: FillExercise = {
  ...base,
  kind: "fill",
  id: "f",
  code: { language: "java", code: "{{1}} class A {{2}} B {}" },
  blanks: ["public", "extends"],
  distractors: ["implements", "private"],
};

const spot: SpotExercise = {
  ...base,
  kind: "spot",
  id: "s",
  code: { language: "java", code: "a\nb\nc" },
  faultyLine: 2,
  reasons: ["r0", "r1", "r2"],
  reasonAnswer: 1,
};

const order: OrderExercise = { ...base, kind: "order", id: "o", items: ["red", "green", "refactor"] };

const match: MatchExercise = {
  ...base,
  kind: "match",
  id: "m",
  pairs: [
    { left: "200", right: "OK" },
    { left: "404", right: "Not Found" },
  ],
};

describe("grade", () => {
  it("mcq", () => {
    const ex = mcq("q");
    expect(grade(ex, { kind: "mcq", choice: 1 })).toMatchObject({ correct: true, grade: "good" });
    expect(grade(ex, { kind: "mcq", choice: 0 })).toMatchObject({ correct: false, grade: "again" });
  });

  it("fill : tous les blancs doivent être justes, détail par blanc", () => {
    expect(grade(fill, { kind: "fill", tokens: ["public", "extends"] })).toMatchObject({ correct: true });
    const v = grade(fill, { kind: "fill", tokens: ["public", "implements"] });
    expect(v.correct).toBe(false);
    expect(v.details).toEqual([true, false]);
    expect(v.feedback).toMatch(/1 blanc sur 2/);
    expect(grade(fill, { kind: "fill", tokens: ["public", null] }).correct).toBe(false);
  });

  it("spot : ligne ET raison, avec un retour qui dit laquelle a échoué", () => {
    expect(grade(spot, { kind: "spot", line: 2, reason: 1 })).toMatchObject({ correct: true, feedback: undefined });
    const badReason = grade(spot, { kind: "spot", line: 2, reason: 0 });
    expect(badReason).toMatchObject({ correct: false, details: [true, false] });
    expect(badReason.feedback).toMatch(/Bonne ligne/);
    const badLine = grade(spot, { kind: "spot", line: 1, reason: 1 });
    expect(badLine).toMatchObject({ correct: false, details: [false, true] });
    expect(badLine.feedback).toMatch(/Bonne raison.*ligne 2/);
    const both = grade(spot, { kind: "spot", line: 3, reason: 2 });
    expect(both.feedback).toMatch(/Ni la ligne ni la raison/);
  });

  it("order : séquence d'indices originaux", () => {
    expect(grade(order, { kind: "order", sequence: [0, 1, 2] }).correct).toBe(true);
    const v = grade(order, { kind: "order", sequence: [0, 2, 1] });
    expect(v.correct).toBe(false);
    expect(v.details).toEqual([true, false, false]);
    expect(v.feedback).toMatch(/2 éléments mal placés/);
    expect(grade(order, { kind: "order", sequence: [0, 1] }).correct).toBe(false);
  });

  it("match", () => {
    expect(grade(match, { kind: "match", mapping: [0, 1] }).correct).toBe(true);
    expect(grade(match, { kind: "match", mapping: [1, 0] }).details).toEqual([false, false]);
    expect(grade(match, { kind: "match", mapping: [0, null] })).toMatchObject({ correct: false, feedback: "1 paire sur 2 à revoir." });
  });

  it("recall : auto-évaluation, again = faux", () => {
    const ex = { ...base, kind: "recall" as const, id: "r" };
    expect(grade(ex, { kind: "recall", grade: "hard" })).toEqual({ correct: true, grade: "hard" });
    expect(grade(ex, { kind: "recall", grade: "again" })).toEqual({ correct: false, grade: "again" });
  });

  it("refuse une réponse d'un autre type", () => {
    expect(() => grade(mcq("q"), { kind: "fill", tokens: [] })).toThrow();
  });
});
