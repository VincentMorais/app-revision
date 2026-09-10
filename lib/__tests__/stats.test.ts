import { describe, expect, it } from "vitest";
import { recordAnswer } from "@/lib/engine";
import { failureCounts, rateByCourse, rateByTag, weakestTags } from "@/lib/stats";
import { createEmptyState } from "@/lib/storage";
import { fixtureIndex } from "./fixtures";

const T0 = Date.UTC(2026, 8, 9, 8, 0, 0);
const index = fixtureIndex();

function state() {
  let s = createEmptyState();
  s = recordAnswer(s, "j1a", "good", T0); // interfaces ✓
  s = recordAnswer(s, "j1b", "again", T0); // interfaces ✗
  s = recordAnswer(s, "j1b", "again", T0); // interfaces ✗
  s = recordAnswer(s, "j1c", "hard", T0); // abstract ~ (juste mais laborieux)
  s = recordAnswer(s, "j1c", "hard", T0); // abstract ~
  s = recordAnswer(s, "j2a", "again", T0); // equals ✗
  s = recordAnswer(s, "r1a", "good", T0); // hooks ✓
  return s;
}

describe("stats", () => {
  it("taux par parcours", () => {
    const byCourse = Object.fromEntries(rateByCourse(index, state()).map((r) => [r.key, r]));
    expect(byCourse.java).toMatchObject({ attempts: 6, correct: 3, hard: 2, errors: 3, rate: 0.5 });
    expect(byCourse.react).toMatchObject({ attempts: 1, correct: 1, hard: 0, errors: 0, rate: 1 });
  });

  it("parcours sans réponse → rate null", () => {
    const byCourse = rateByCourse(index, createEmptyState());
    expect(byCourse.every((r) => r.rate === null)).toBe(true);
  });

  it("taux par tag, avec les « hard » visibles", () => {
    const byTag = Object.fromEntries(rateByTag(index, state()).map((r) => [r.key, r]));
    expect(byTag.interfaces).toMatchObject({ attempts: 3, correct: 1, hard: 0, errors: 2 });
    expect(byTag.abstract).toMatchObject({ attempts: 2, correct: 2, hard: 2, errors: 0, rate: 1 });
    expect(byTag.equals).toMatchObject({ attempts: 1, correct: 0, errors: 1 });
  });

  it("notions les plus fragiles : erreurs d'abord, puis hard ; minAttempts filtre les notions vues une fois", () => {
    expect(weakestTags(index, state()).map((t) => t.key)).toEqual(["interfaces", "abstract"]);
    expect(weakestTags(index, state(), 10, 1).map((t) => t.key)).toEqual(["interfaces", "equals", "abstract"]);
  });

  it("compte les échecs par exercice (hard n'est pas un échec)", () => {
    const counts = failureCounts(state());
    expect(counts.get("j1b")).toBe(2);
    expect(counts.get("j2a")).toBe(1);
    expect(counts.has("j1a")).toBe(false);
    expect(counts.has("j1c")).toBe(false);
  });
});
