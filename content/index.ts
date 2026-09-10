/**
 * Registre des parcours. Un fichier par chapitre dans `content/<parcours>/`,
 * enregistré dans `content/<parcours>/index.ts` puis ici.
 *
 * L'ordre des parcours et des chapitres suit `referentiel-poste-java-react.md`.
 * Le plan complet, les ids et les prérequis sont dans `content/PLAN.md`.
 */

import { buildIndex } from "@/lib/content";
import type { Course } from "@/lib/types";
import { archiCourse } from "./archi";
import { dataCourse } from "./data";
import { devopsCourse } from "./devops";
import { dockerCourse } from "./docker";
import { javaCourse } from "./java";
import { reactCourse } from "./react";
import { springCourse } from "./spring";
import { testsCourse } from "./tests";
import { transverseCourse } from "./transverse";

export const courses: Course[] = [
  javaCourse,
  springCourse,
  dataCourse,
  archiCourse,
  testsCourse,
  dockerCourse,
  reactCourse,
  devopsCourse,
  transverseCourse,
];

/** Index construit une seule fois au chargement du module. */
export const contentIndex = buildIndex(courses);
