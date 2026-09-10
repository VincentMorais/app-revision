/**
 * Registre des parcours : les dossiers de `content/`, dans l'ordre du
 * référentiel. C'est la seule liste à tenir à jour quand un parcours est
 * ajouté.
 *
 * Ce fichier ne contient que des noms, volontairement : `content/index.ts`
 * n'importe plus le contenu complet, sans quoi il se retrouverait dans le
 * chunk partagé de toutes les pages. Le générateur
 * `scripts/gen-content-meta.mjs` lit cette liste, charge les
 * `content/<parcours>/index.ts` et en extrait les métadonnées.
 */
export const COURSE_DIRS = [
  "java",
  "spring",
  "data",
  "archi",
  "tests",
  "docker",
  "react",
  "devops",
  "transverse",
] as const;
