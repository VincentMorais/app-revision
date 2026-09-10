import type { Course } from "@/lib/types";
import { chapter as autour } from "./autour";
import { chapter as configuration } from "./configuration";
import { chapter as ioc } from "./ioc";
import { chapter as jpa } from "./jpa";
import { chapter as rest } from "./rest";
import { chapter as security } from "./security";
import { chapter as transactions } from "./transactions";

/** Parcours Spring Boot (référentiel section 2, plus JPA de la 3.5). */
export const springCourse: Course = {
  id: "spring",
  title: "Spring Boot",
  description: "Le conteneur, l'API REST, la persistance JPA et les transactions.",
  icon: "☘",
  chapters: [ioc, configuration, rest, jpa, transactions, security, autour],
};
