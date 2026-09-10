import { describe, expect, it } from "vitest";
import { dayKey, effectiveStreak, emptyStreak, touchStreak } from "@/lib/streak";

// Dates locales à midi pour éviter les effets de fuseau.
const day = (d: number) => new Date(2026, 8, d, 12, 0, 0).getTime();

describe("dayKey", () => {
  it("formate en YYYY-MM-DD local", () => {
    expect(dayKey(day(9))).toBe("2026-09-09");
  });
});

describe("touchStreak", () => {
  it("démarre à 1", () => {
    const s = touchStreak(emptyStreak(), day(9));
    expect(s).toEqual({ current: 1, longest: 1, lastActiveDay: "2026-09-09" });
  });

  it("ne change rien deux fois le même jour", () => {
    const s = touchStreak(emptyStreak(), day(9));
    expect(touchStreak(s, day(9) + 3600_000)).toBe(s);
  });

  it("incrémente le lendemain", () => {
    let s = touchStreak(emptyStreak(), day(9));
    s = touchStreak(s, day(10));
    s = touchStreak(s, day(11));
    expect(s.current).toBe(3);
    expect(s.longest).toBe(3);
  });

  it("repart à 1 après un jour manqué, en gardant le record", () => {
    let s = touchStreak(emptyStreak(), day(9));
    s = touchStreak(s, day(10));
    s = touchStreak(s, day(12));
    expect(s.current).toBe(1);
    expect(s.longest).toBe(2);
  });
});

describe("effectiveStreak", () => {
  it("vaut la série si actif aujourd'hui ou hier", () => {
    const s = touchStreak(touchStreak(emptyStreak(), day(9)), day(10));
    expect(effectiveStreak(s, day(10))).toBe(2);
    expect(effectiveStreak(s, day(11))).toBe(2);
  });

  it("retombe à 0 si le dernier jour actif est avant hier", () => {
    const s = touchStreak(emptyStreak(), day(9));
    expect(effectiveStreak(s, day(11))).toBe(0);
  });
});
