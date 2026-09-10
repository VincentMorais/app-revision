import type { Course } from "@/lib/types";
import { chapter as entretien } from "./entretien";

/** Parcours Transverse (référentiel section 9) : ce qui ne dépend d'aucune pile. */
export const transverseCourse: Course = {
  id: "transverse",
  title: "Transverse",
  description: "HTTP et API, entretien : présenter, décider, être relu et évalué.",
  icon: "🧭",
  chapters: [entretien],
};
