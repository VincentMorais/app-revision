/**
 * Index en lecture seule sur les parcours : accès par id, ordre du référentiel,
 * rattachement exercice → chapitre → parcours.
 */

import { isExercise, isLesson, type ChapterMeta, type CourseMeta, type ExerciseMeta, type LessonMeta, type UnitMeta } from "./types";

/**
 * Index sur les **métadonnées** : identifiants, titres, types, tags, énoncés.
 * Les corps de leçons et d'exercices ne sont pas ici — ils sont chargés par
 * chapitre au moment d'entrer en session (`content/full.ts`).
 */
export type ContentIndex = {
  courses: CourseMeta[];
  chaptersById: Map<string, ChapterMeta>;
  exercisesById: Map<string, ExerciseMeta>;
  lessonsById: Map<string, LessonMeta>;
  /** Tous les exercices, dans l'ordre du référentiel (parcours → chapitre → unité). */
  exercisesInOrder: ExerciseMeta[];
  chapterOfExercise: Map<string, ChapterMeta>;
  /** Sert à savoir quels chapitres charger pour une session. */
  chapterOfLesson: Map<string, ChapterMeta>;
  courseOfChapter: Map<string, CourseMeta>;
};

export function buildIndex(courses: CourseMeta[]): ContentIndex {
  const chaptersById = new Map<string, ChapterMeta>();
  const exercisesById = new Map<string, ExerciseMeta>();
  const lessonsById = new Map<string, LessonMeta>();
  const exercisesInOrder: ExerciseMeta[] = [];
  const chapterOfExercise = new Map<string, ChapterMeta>();
  const chapterOfLesson = new Map<string, ChapterMeta>();
  const courseOfChapter = new Map<string, CourseMeta>();

  for (const course of courses) {
    for (const chapter of course.chapters) {
      if (chaptersById.has(chapter.id)) {
        throw new Error(`Id de chapitre en double : ${chapter.id}`);
      }
      chaptersById.set(chapter.id, chapter);
      courseOfChapter.set(chapter.id, course);
      for (const unit of chapter.units) {
        if (isLesson(unit)) {
          if (lessonsById.has(unit.id)) throw new Error(`Id de leçon en double : ${unit.id}`);
          lessonsById.set(unit.id, unit);
          chapterOfLesson.set(unit.id, chapter);
        } else if (isExercise(unit)) {
          if (exercisesById.has(unit.id)) throw new Error(`Id d'exercice en double : ${unit.id}`);
          exercisesById.set(unit.id, unit);
          exercisesInOrder.push(unit);
          chapterOfExercise.set(unit.id, chapter);
        }
      }
    }
  }

  for (const chapter of chaptersById.values()) {
    for (const prereq of chapter.prerequisites) {
      if (!chaptersById.has(prereq)) {
        throw new Error(`Prérequis inconnu « ${prereq} » dans le chapitre ${chapter.id}`);
      }
    }
  }

  return {
    courses,
    chaptersById,
    exercisesById,
    lessonsById,
    exercisesInOrder,
    chapterOfExercise,
    chapterOfLesson,
    courseOfChapter,
  };
}

export function exercisesOf<U extends UnitMeta>(chapter: { units: U[] }): Exclude<U, { kind: "lesson" }>[] {
  return chapter.units.filter(isExercise);
}

export function lessonsOf<U extends UnitMeta>(chapter: { units: U[] }): Extract<U, { kind: "lesson" }>[] {
  return chapter.units.filter(isLesson);
}
