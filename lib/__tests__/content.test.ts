import { describe, expect, it } from "vitest";
import { buildIndex } from "@/lib/content";
import { fixtureCourses, fixtureIndex, mcq } from "./fixtures";

describe("buildIndex", () => {
  it("indexe exercices, leçons et chapitres dans l'ordre du référentiel", () => {
    const index = fixtureIndex();
    expect(index.exercisesInOrder.map((e) => e.id)).toEqual(["j1a", "j1b", "j1c", "j2a", "j2b", "j2c", "j3a", "j3b", "r1a", "r1b"]);
    expect(index.lessonsById.has("java-ch1-l1")).toBe(true);
    expect(index.chapterOfExercise.get("r1a")?.id).toBe("react-r1");
    expect(index.courseOfChapter.get("java-ch3")?.id).toBe("java");
  });

  it("refuse les ids en double", () => {
    const courses = fixtureCourses();
    courses[0].chapters[0].units.push(mcq("j1a"));
    expect(() => buildIndex(courses)).toThrow(/en double/);
  });

  it("refuse un prérequis inconnu", () => {
    const courses = fixtureCourses();
    courses[0].chapters[0].prerequisites.push("nope");
    expect(() => buildIndex(courses)).toThrow(/Prérequis inconnu/);
  });
});
