import type { Course } from "@/lib/types";
import { chapter as bases } from "./bases";

/** Parcours Docker (référentiel section 7). */
export const dockerCourse: Course = {
  id: "docker",
  title: "Docker",
  description: "Images, Dockerfile, build multi-stage et compose.",
  icon: "🐳",
  chapters: [bases],
};
