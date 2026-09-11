import type { Course } from "@/lib/types";
import { chapter as bases } from "./bases";
import { chapter as registry } from "./registry";

/** Parcours Docker (référentiel section 7). */
export const dockerCourse: Course = {
  id: "docker",
  title: "Docker",
  description: "Images, Dockerfile, build multi-stage et compose.",
  icon: "🐳",
  chapters: [bases, registry],
};
