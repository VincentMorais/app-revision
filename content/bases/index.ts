import type { Course } from "@/lib/types";
import { chapter as variables } from "./variables";
import { chapter as controle } from "./controle";
import { chapter as methodes } from "./methodes";
import { chapter as objets } from "./objets";
import { chapter as collections } from "./collections";
import { chapter as erreurs } from "./erreurs";

/**
 * Parcours Fondations : les bases de la programmation en Java, pour reprendre
 * tranquillement avant les chapitres du référentiel. Format `doux`.
 */
export const basesCourse: Course = {
  id: "bases",
  title: "Fondations",
  description: "Les bases, doucement : variables, conditions et boucles, méthodes, objets, collections, erreurs.",
  icon: "🌱",
  chapters: [variables, controle, methodes, objets, collections, erreurs],
};
