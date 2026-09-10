import { describe, expect, it } from "vitest";
import {
  ACQUIRED_INTERVAL_DAYS,
  DAY_MS,
  MAX_EASE,
  MIN_EASE,
  isDue,
  masteryOf,
  priorityOf,
  review,
  sortDue,
  type Grade,
  type ItemState,
} from "@/lib/srs";

const T0 = Date.UTC(2026, 8, 9, 8, 0, 0);

/** Rejoue une suite de réponses, chacune au moment où l'item devient dû. */
function replay(grades: Grade[], start = T0): { state: ItemState; history: ItemState[] } {
  let state: ItemState | undefined;
  const history: ItemState[] = [];
  let now = start;
  for (const g of grades) {
    state = review(state, g, now);
    history.push(state);
    now = Math.max(now, state.due);
  }
  return { state: state!, history };
}

describe("review — première rencontre", () => {
  it("good : intervalle 1 jour, dû demain", () => {
    const s = review(undefined, "good", T0);
    expect(s.interval).toBe(1);
    expect(s.reps).toBe(1);
    expect(s.lapses).toBe(0);
    expect(s.due).toBe(T0 + DAY_MS);
    expect(s.ease).toBeCloseTo(2.6);
  });

  it("again : reste dû immédiatement, compte un oubli", () => {
    const s = review(undefined, "again", T0);
    expect(s.interval).toBe(0);
    expect(s.reps).toBe(0);
    expect(s.lapses).toBe(1);
    expect(s.due).toBe(T0);
    expect(s.ease).toBeCloseTo(2.3);
  });

  it("hard : intervalle 1 jour, facilité en baisse", () => {
    const s = review(undefined, "hard", T0);
    expect(s.interval).toBe(1);
    expect(s.reps).toBe(1);
    expect(s.ease).toBeCloseTo(2.35);
  });
});

describe("review — progression", () => {
  it("good ×3 : 1 → 3 → 3 × ease", () => {
    const { history } = replay(["good", "good", "good"]);
    expect(history.map((h) => h.interval)).toEqual([1, 3, 8]); // ease 2.7 → round(3 × 2.7) = 8
    expect(history[2].due).toBe(history[1].due + 8 * DAY_MS);
  });

  it("les intervalles croissent strictement en good", () => {
    const { history } = replay(Array(9).fill("good"));
    for (let i = 1; i < history.length; i++) {
      expect(history[i].interval).toBeGreaterThan(history[i - 1].interval);
    }
  });

  it("hard fait progresser l'intervalle plus lentement que good", () => {
    const base = replay(["good", "good"]).state;
    const hard = review(base, "hard", base.due);
    const good = review(base, "good", base.due);
    expect(hard.interval).toBeGreaterThan(base.interval);
    expect(hard.interval).toBeLessThan(good.interval);
  });

  it("la facilité est bornée", () => {
    expect(replay(Array(20).fill("again")).state.ease).toBe(MIN_EASE);
    expect(replay(Array(20).fill("good")).state.ease).toBe(MAX_EASE);
  });
});

describe("review — comportement dans le temps", () => {
  it("item raté 3 fois puis réussi : reste fragile, repart à 1 jour, garde ses 3 oublis", () => {
    const { history, state } = replay(["again", "again", "again", "good"]);
    // Pendant les échecs, l'item est dû immédiatement à chaque fois.
    for (const h of history.slice(0, 3)) {
      expect(h.due).toBe(T0);
      expect(h.interval).toBe(0);
      expect(masteryOf(h)).toBe("fragile");
    }
    expect(state.lapses).toBe(3);
    expect(state.reps).toBe(1);
    expect(state.interval).toBe(1);
    expect(state.due).toBe(T0 + DAY_MS);
    // Une seule réussite après des oublis : toujours fragile.
    expect(masteryOf(state)).toBe("fragile");
    // Facilité entamée : 2.5 − 3×0.2 + 0.1
    expect(state.ease).toBeCloseTo(2.0);
    // Il faut une deuxième réussite pour sortir de « fragile ».
    const next = review(state, "good", state.due);
    expect(masteryOf(next)).toBe("learning");
    expect(next.interval).toBe(3);
  });

  it("item acquis laissé de côté 2 semaines : toujours dû, moins prioritaire qu'un fragile, et une réussite l'espace encore plus", () => {
    let acquired = replay(Array(6).fill("good")).state;
    expect(masteryOf(acquired)).toBe("acquired");
    expect(acquired.interval).toBeGreaterThanOrEqual(ACQUIRED_INTERVAL_DAYS);

    const twoWeeksLate = acquired.due + 14 * DAY_MS;
    expect(isDue(acquired, twoWeeksLate)).toBe(true);

    const fragile = review(undefined, "again", twoWeeksLate);
    expect(priorityOf(fragile, twoWeeksLate)).toBeGreaterThan(priorityOf(acquired, twoWeeksLate));

    // Réussite tardive : l'intervalle progresse à partir de l'intervalle
    // planifié (pas du temps réellement écoulé), l'item reste acquis.
    const after = review(acquired, "good", twoWeeksLate);
    expect(after.interval).toBeGreaterThan(acquired.interval);
    expect(after.due).toBe(twoWeeksLate + after.interval * DAY_MS);
    expect(masteryOf(after)).toBe("acquired");

    // Échec tardif : l'item retombe fragile et redevient dû tout de suite.
    acquired = review(acquired, "again", twoWeeksLate);
    expect(masteryOf(acquired)).toBe("fragile");
    expect(acquired.due).toBe(twoWeeksLate);
    expect(acquired.interval).toBe(0);
  });

  it("alternance juste/faux : l'intervalle ne dépasse jamais 1 jour, la facilité s'érode", () => {
    const grades: Grade[] = ["good", "again", "good", "again", "good", "again", "good"];
    const { history, state } = replay(grades);
    for (const h of history) expect(h.interval).toBeLessThanOrEqual(1);
    expect(state.lapses).toBe(3);
    expect(state.reps).toBe(1);
    expect(masteryOf(state)).toBe("fragile");
    // Chaque cycle good/again coûte net −0.1 de facilité.
    expect(state.ease).toBeLessThan(2.5);
    expect(state.ease).toBeCloseTo(2.5 + 4 * 0.1 - 3 * 0.2);
  });

  it("un item fragile revient plus souvent qu'un item acquis sur 60 jours", () => {
    // Simulation : réponses données exactement à échéance pendant 60 jours.
    const horizon = T0 + 60 * DAY_MS;
    const countReviews = (pattern: (i: number) => Grade) => {
      let state: ItemState | undefined;
      let now = T0;
      let n = 0;
      while (now <= horizon) {
        state = review(state, pattern(n), now);
        n++;
        now = state.due > now ? state.due : now + DAY_MS; // un `again` est rejoué le lendemain
      }
      return n;
    };
    const steady = countReviews(() => "good");
    const shaky = countReviews((i) => (i % 3 === 2 ? "again" : "good"));
    expect(shaky).toBeGreaterThan(steady * 2);
  });

  it("après une longue série de réussites, un seul oubli ramène à un cycle de ré-apprentissage court", () => {
    const strong = replay(Array(8).fill("good")).state;
    const failed = review(strong, "again", strong.due);
    const relearn1 = review(failed, "good", failed.due);
    const relearn2 = review(relearn1, "good", relearn1.due);
    expect(relearn1.interval).toBe(1);
    expect(relearn2.interval).toBe(3);
    // La facilité conservée fait ensuite croître vite : on ne repart pas de zéro.
    const relearn3 = review(relearn2, "good", relearn2.due);
    expect(relearn3.interval).toBeGreaterThanOrEqual(8);
  });
});

describe("isDue / masteryOf", () => {
  it("un item jamais vu n'est pas dû et est « new »", () => {
    expect(isDue(undefined, T0)).toBe(false);
    expect(masteryOf(undefined)).toBe("new");
  });

  it("dû quand due <= now", () => {
    const s = review(undefined, "good", T0);
    expect(isDue(s, T0)).toBe(false);
    expect(isDue(s, T0 + DAY_MS)).toBe(true);
  });

  it("fragile après un échec, learning ensuite, acquis à 21 jours", () => {
    const failed = review(undefined, "again", T0);
    expect(masteryOf(failed)).toBe("fragile");
    const once = review(failed, "good", T0);
    expect(masteryOf(once)).toBe("fragile");
    const twice = review(once, "good", once.due);
    expect(masteryOf(twice)).toBe("learning");
    let s = twice;
    while (s.interval < ACQUIRED_INTERVAL_DAYS) s = review(s, "good", s.due);
    expect(masteryOf(s)).toBe("acquired");
  });
});

describe("priorité et tri des items dus", () => {
  const fragile: ItemState = { ease: 2.3, interval: 0, reps: 0, lapses: 1, due: T0, lastReview: T0 };
  const learning: ItemState = { ease: 2.6, interval: 3, reps: 2, lapses: 0, due: T0 - DAY_MS, lastReview: T0 - 4 * DAY_MS };
  const acquired: ItemState = { ease: 2.8, interval: 30, reps: 6, lapses: 0, due: T0 - 10 * DAY_MS, lastReview: T0 - 40 * DAY_MS };
  const future: ItemState = { ease: 2.6, interval: 3, reps: 2, lapses: 0, due: T0 + DAY_MS, lastReview: T0 };

  it("fragile > learning > acquis, même très en retard", () => {
    expect(priorityOf(fragile, T0)).toBeGreaterThan(priorityOf(learning, T0));
    expect(priorityOf(learning, T0)).toBeGreaterThan(priorityOf(acquired, T0));
  });

  it("à niveau égal, le plus en retard relativement à son intervalle passe d'abord", () => {
    const a: ItemState = { ...learning, interval: 3, due: T0 - 3 * DAY_MS };
    const b: ItemState = { ...learning, interval: 10, due: T0 - 3 * DAY_MS };
    expect(priorityOf(a, T0)).toBeGreaterThan(priorityOf(b, T0));
  });

  it("sortDue exclut les items non dus et trie par urgence", () => {
    const sorted = sortDue(
      [
        { id: "acq", state: acquired },
        { id: "fut", state: future },
        { id: "fra", state: fragile },
        { id: "lea", state: learning },
      ],
      T0,
    );
    expect(sorted.map((e) => e.id)).toEqual(["fra", "lea", "acq"]);
  });
});
