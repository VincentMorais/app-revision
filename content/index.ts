/**
 * Point d'entrée du contenu — **métadonnées seulement**.
 *
 * Le contenu complet (blocs de leçon, choix, code, explications) représente
 * 88 % du poids et n'est utile qu'en session : il est chargé à la demande,
 * chapitre par chapitre, via `content/full.ts`. Importer ici les fichiers de
 * chapitre les ferait retomber dans le chunk partagé de toutes les pages.
 *
 * Les métadonnées sont produites par `scripts/gen-content-meta.mjs` à partir
 * des `content/<parcours>/index.ts`, qui restent la source de vérité.
 */

import { buildIndex } from "@/lib/content";
import { courses } from "./generated/meta";

export { courses };

/** Index construit une seule fois au chargement du module. */
export const contentIndex = buildIndex(courses);
