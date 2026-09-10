import type { Course } from "@/lib/types";
import { chapter as collections } from "./collections";
import { chapter as concurrence } from "./concurrence";
import { chapter as equalsHashcodeComparable } from "./equals-hashcode-comparable";
import { chapter as exceptions } from "./exceptions";
import { chapter as fondamentaux } from "./fondamentaux";
import { chapter as interfacesClassesAbstraites } from "./interfaces-classes-abstraites";
import { chapter as lambdasStreams } from "./lambdas-streams";
import { chapter as moderne } from "./moderne";

/** Parcours Java (référentiel section 1). Un fichier par chapitre, dans l'ordre du référentiel. */
export const javaCourse: Course = {
  id: "java",
  title: "Java",
  description: "Le langage : fondamentaux, POO, collections, exceptions, Java moderne.",
  icon: "☕",
  chapters: [
    fondamentaux,
    interfacesClassesAbstraites,
    equalsHashcodeComparable,
    collections,
    exceptions,
    lambdasStreams,
    moderne,
    concurrence,
  ],
};
