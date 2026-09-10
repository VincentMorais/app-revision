import type { Course } from "@/lib/types";
import { chapter as tdd } from "./tdd";

/** Parcours Tests (référentiel section 5). */
export const testsCourse: Course = {
  id: "tests",
  title: "Tests",
  description: "TDD, JUnit 5, AssertJ, Mockito, tranches Spring et Testcontainers.",
  icon: "🧪",
  chapters: [tdd],
};
