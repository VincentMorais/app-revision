import { describe, expect, it } from "vitest";
import { contentIndex } from "@/content";
import { createEmptyState, type AppState } from "@/lib/storage";
import { isChapterUnlocked } from "@/lib/progress";
import { BONUS_CHAPTERS, PROGRAM, PROGRAM_DAYS, programDay, programStatus } from "@/lib/program";

const T0 = new Date(2026, 9, 14, 10).getTime();
const DAY = 86_400_000;

function started(skipped: string[] = []): AppState {
  return { ...createEmptyState(), program: { startedAt: T0, skipped } };
}

describe("calendrier", () => {
  it("couvre exactement 30 jours consécutifs", () => {
    expect(PROGRAM).toHaveLength(PROGRAM_DAYS);
    PROGRAM.forEach((d, i) => expect(d.day).toBe(i + 1));
  });
  it("ne référence que des chapitres existants, sans doublon, bonus compris", () => {
    const ids = [...PROGRAM.flatMap((d) => (d.kind === "chapter" ? [d.chapterId] : [])), ...BONUS_CHAPTERS];
    for (const id of ids) expect(contentIndex.chaptersById.has(id), id).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("couvre tous les chapitres du contenu (calendrier + bonus)", () => {
    const covered = new Set([...PROGRAM.flatMap((d) => (d.kind === "chapter" ? [d.chapterId] : [])), ...BONUS_CHAPTERS]);
    expect([...contentIndex.chaptersById.keys()].filter((id) => !covered.has(id))).toEqual([]);
  });
  it("prévoit un rattrapage par semaine", () => {
    for (const day of [7, 14, 21, 28]) expect(PROGRAM[day - 1].kind).toBe("buffer");
  });
});

describe("numéro du jour", () => {
  it("vaut 1 le jour du départ, même tard le soir", () => {
    expect(programDay(T0, T0 + 5 * 3_600_000)).toBe(1);
  });
  it("avance d'un par jour calendaire", () => {
    expect(programDay(T0, T0 + DAY)).toBe(2);
    expect(programDay(T0, T0 + 29 * DAY)).toBe(30);
    expect(programDay(T0, T0 + 35 * DAY)).toBe(36);
  });
});

describe("mission", () => {
  it("n'existe pas sans programme", () => {
    expect(programStatus(contentIndex, createEmptyState(), T0)).toBeNull();
  });
  it("le jour 1, c'est le premier chapitre, à l'heure", () => {
    const st = programStatus(contentIndex, started(), T0)!;
    expect(st.mission).toMatchObject({ kind: "chapter", plannedDay: 1, late: false });
    expect(st.mission.kind === "chapter" && st.mission.chapter.id).toBe("bases-variables");
  });
  it("signale le retard quand les jours passent sans rien faire", () => {
    const st = programStatus(contentIndex, started(), T0 + 4 * DAY)!;
    expect(st.mission).toMatchObject({ kind: "chapter", late: true });
    expect(st.behind).toBeGreaterThan(0);
  });
  it("passe au chapitre suivant quand on saute le premier", () => {
    const st = programStatus(contentIndex, started(["bases-variables"]), T0)!;
    expect(st.mission.kind === "chapter" && st.mission.chapter.id).toBe("bases-controle");
    expect(st.finished).toBe(1);
  });
});

describe("verrous", () => {
  const chapter = contentIndex.chaptersById.get("spring-jpa")!;
  it("restent actifs hors programme", () => {
    expect(isChapterUnlocked(chapter, contentIndex, createEmptyState())).toBe(false);
  });
  it("sont levés pendant le programme", () => {
    expect(isChapterUnlocked(chapter, contentIndex, started())).toBe(true);
  });
});
