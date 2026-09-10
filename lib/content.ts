/**
 * Index en lecture seule sur les parcours : accès par id, ordre du référentiel,
 * rattachement exercice → chapitre → parcours.
 */

import { isExercise, isLesson, type Chapter, type Course, type Exercise, type Lesson } from "./types";

export type ContentIndex = {
  courses: Course[];
  chaptersById: Map<string, Chapter>;
  exercisesById: Map<string, Exercise>;
  lessonsById: Map<string, Lesson>;
  /** Tous les exercices, dans l'ordre du référentiel (parcours → chapitre → unité). */
  exercisesInOrder: Exercise[];
  chapterOfExercise: Map<string, Chapter>;
  courseOfChapter: Map<string, Course>;
};

export function buildIndex(courses: Course[]): ContentIndex {
  const chaptersById = new Map<string, Chapter>();
  const exercisesById = new Map<string, Exercise>();
  const lessonsById = new Map<string, Lesson>();
  const exercisesInOrder: Exercise[] = [];
  const chapterOfExercise = new Map<string, Chapter>();
  const courseOfChapter = new Map<string, Course>();

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
    courseOfChapter,
  };
}

export function exercisesOf(chapter: Chapter): Exercise[] {
  return chapter.units.filter(isExercise);
}

export function lessonsOf(chapter: Chapter): Lesson[] {
  return chapter.units.filter(isLesson);
}
