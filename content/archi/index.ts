import type { Course } from "@/lib/types";
import { chapter as applicative } from "./applicative";
import { chapter as dddPatterns } from "./ddd-patterns";
import { chapter as hexagonale } from "./hexagonale";

/** Parcours Architecture (référentiel section 4). */
export const archiCourse: Course = {
  id: "archi",
  title: "Architecture",
  description: "Ports et adapters, inversion de dépendance, SOLID.",
  icon: "⬡",
  chapters: [hexagonale, dddPatterns, applicative],
};
