import type { Course } from "@/lib/types";
import { chapter as sqlPostgres } from "./sql-postgres";

/** Parcours SQL et Postgres (référentiel section 3, hors JPA). */
export const dataCourse: Course = {
  id: "data",
  title: "SQL et Postgres",
  description: "Requêtes, jointures, modélisation, index et transactions.",
  icon: "🐘",
  chapters: [sqlPostgres],
};
