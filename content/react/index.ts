import type { Course } from "@/lib/types";
import { chapter as etatData } from "./etat-data";
import { chapter as hooks } from "./hooks";

/** Parcours React (référentiel section 6). */
export const reactCourse: Course = {
  id: "react",
  title: "React",
  description: "Composants, hooks, état et re-renders.",
  icon: "⚛",
  chapters: [hooks, etatData],
};
