import type { Course } from "@/lib/types";
import { chapter as gitGitlabCi } from "./git-gitlab-ci";
import { chapter as gitWorkflow } from "./git-workflow";

/** Parcours Git et GitLab CI (référentiel section 8). */
export const devopsCourse: Course = {
  id: "devops",
  title: "Git et GitLab CI",
  description: "Branches, merge et rebase, pipeline, cache et artifacts.",
  icon: "🦊",
  chapters: [gitGitlabCi, gitWorkflow],
};
