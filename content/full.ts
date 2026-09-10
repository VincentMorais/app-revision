/**
 * Chargement du contenu complet, à la demande et par chapitre.
 *
 * `content/index.ts` ne porte que les métadonnées. Les corps de leçons et
 * d'exercices sont ici, derrière un import dynamique par chapitre : le
 * bundler en fait autant de morceaux séparés, et une session ne télécharge
 * que les chapitres dont elle a besoin.
 */

import { contentIndex } from "@/content";
import { chapterLoaders } from "./generated/loaders";
import { isExercise, isLesson, type Chapter, type Exercise, type Lesson } from "@/lib/types";

/** Contenu complet des chapitres chargés, indexé par identifiant d'unité. */
export type FullContent = {
  lessonsById: Map<string, Lesson>;
  exercisesById: Map<string, Exercise>;
};

/** Une fois chargé, un chapitre le reste : la navigation ne recharge rien. */
const cache = new Map<string, Chapter>();

async function loadChapter(id: string): Promise<Chapter | null> {
  const enCache = cache.get(id);
  if (enCache) return enCache;
  const loader = chapterLoaders[id];
  if (!loader) return null;
  const { chapter } = await loader();
  cache.set(id, chapter);
  return chapter;
}

/** Chapitres à charger pour couvrir ces unités (leçons ou exercices). */
export function chaptersOfUnits(unitIds: Iterable<string>): string[] {
  const ids = new Set<string>();
  for (const unitId of unitIds) {
    const chapter =
      contentIndex.chapterOfExercise.get(unitId) ?? contentIndex.chapterOfLesson.get(unitId);
    if (chapter) ids.add(chapter.id);
  }
  return [...ids];
}

export async function loadFullContent(chapterIds: Iterable<string>): Promise<FullContent> {
  const chapitres = await Promise.all([...chapterIds].map(loadChapter));

  const lessonsById = new Map<string, Lesson>();
  const exercisesById = new Map<string, Exercise>();
  for (const chapitre of chapitres) {
    if (!chapitre) continue;
    for (const unit of chapitre.units) {
      if (isLesson(unit)) lessonsById.set(unit.id, unit);
      else if (isExercise(unit)) exercisesById.set(unit.id, unit);
    }
  }
  return { lessonsById, exercisesById };
}
