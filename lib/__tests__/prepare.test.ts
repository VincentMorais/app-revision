import { describe, expect, it } from "vitest";
import { prepareChoices, prepareFillTokens, prepareMatch, prepareOrder, prepareReasons } from "@/lib/prepare";
import type { FillExercise, MatchExercise, OrderExercise, SpotExercise } from "@/lib/types";
import { mcq } from "./fixtures";

const base = { difficulty: 1 as const, tags: ["t"], prompt: "?", explanation: "!" };

describe("prepare", () => {
  it("choices : permutation déterministe qui conserve les indices d'origine", () => {
    const ex = mcq("q");
    if (ex.kind !== "mcq") throw new Error();
    const a = prepareChoices(ex, 7);
    const b = prepareChoices(ex, 7);
    expect(a).toEqual(b);
    expect(a.map((c) => c.text).sort()).toEqual([...ex.choices].sort());
    for (const c of a) expect(ex.choices[c.original]).toBe(c.text);
  });

  it("fill : réponses + distracteurs, occurrences dupliquées conservées", () => {
    const ex: FillExercise = {
      ...base,
      kind: "fill",
      id: "f",
      code: { language: "java", code: "{{1}} {{2}}" },
      blanks: ["final", "final"],
      distractors: ["static"],
    };
    const tokens = prepareFillTokens(ex, 1);
    expect(tokens.map((t) => t.text).sort()).toEqual(["final", "final", "static"]);
    expect(new Set(tokens.map((t) => t.id)).size).toBe(3);
  });

  it("order : jamais dans l'ordre correct, quelle que soit la graine", () => {
    const ex: OrderExercise = { ...base, kind: "order", id: "o", items: ["a", "b"] };
    for (let seed = 0; seed < 50; seed++) {
      const items = prepareOrder(ex, seed);
      expect(items.map((i) => i.original)).toEqual([1, 0]);
    }
  });

  it("match : gauche en ordre, droite mélangée et jamais alignée", () => {
    const ex: MatchExercise = {
      ...base,
      kind: "match",
      id: "m",
      pairs: [
        { left: "a", right: "1" },
        { left: "b", right: "2" },
        { left: "c", right: "3" },
      ],
    };
    for (let seed = 0; seed < 30; seed++) {
      const { left, right } = prepareMatch(ex, seed);
      expect(left.map((l) => l.original)).toEqual([0, 1, 2]);
      expect(right.every((r, i) => r.original === i)).toBe(false);
    }
  });

  it("reasons : mélange qui conserve les indices", () => {
    const ex: SpotExercise = {
      ...base,
      kind: "spot",
      id: "s",
      code: { language: "java", code: "x" },
      faultyLine: 1,
      reasons: ["r0", "r1", "r2"],
      reasonAnswer: 2,
    };
    const reasons = prepareReasons(ex, 3);
    expect(reasons.find((r) => r.original === 2)?.text).toBe("r2");
  });
});
