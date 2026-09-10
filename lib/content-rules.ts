/**
 * Règles éditoriales du contenu, sous forme de fonctions pures qui renvoient
 * une liste de problèmes (vide = conforme). Utilisées par les tests.
 */

import { isExercise, isLesson, type Block, type Chapter, type Exercise, type Lesson } from "./types";

export const LESSON_WORDS_MIN = 150;
export const LESSON_WORDS_MAX = 300;
export const EXERCISES_PER_LESSON_MIN = 3;
export const EXERCISES_PER_LESSON_MAX = 8;
export const RECALL_MIN = 5;
export const ALL_KINDS = ["fill", "match", "mcq", "order", "output", "recall", "spot"] as const;

export function lessonWords(lesson: Lesson): number {
  const texts: string[] = [];
  const fromBlock = (b: Block) => {
    if (b.kind === "text" || b.kind === "callout") texts.push(b.text);
    if (b.kind === "comparison") {
      if (b.left.text) texts.push(b.left.text);
      if (b.right.text) texts.push(b.right.text);
    }
  };
  lesson.blocks.forEach(fromBlock);
  return texts
    .join(" ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function checkLesson(l: Lesson): string[] {
  const out: string[] = [];
  const words = lessonWords(l);
  if (words < LESSON_WORDS_MIN || words > LESSON_WORDS_MAX) out.push(`${l.id} : ${words} mots (attendu ${LESSON_WORDS_MIN}–${LESSON_WORDS_MAX})`);
  if (!l.blocks.some((b) => b.kind === "code")) out.push(`${l.id} : aucun bloc de code`);
  if (l.title.trim().length < 5) out.push(`${l.id} : titre trop court`);
  return out;
}

export function checkExercise(ex: Exercise): string[] {
  const out: string[] = [];
  const id = ex.id;
  if (ex.explanation.trim().length <= 40) out.push(`${id} : explication trop courte`);
  if (ex.tags.length === 0) out.push(`${id} : aucun tag`);
  for (const t of ex.tags) if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t)) out.push(`${id} : tag « ${t} » pas en kebab-case`);
  if (![1, 2, 3].includes(ex.difficulty)) out.push(`${id} : difficulté invalide`);
  if (ex.prompt.trim().length <= 5) out.push(`${id} : énoncé trop court`);

  switch (ex.kind) {
    case "mcq":
    case "output":
      if (ex.choices.length !== 4) out.push(`${id} : ${ex.choices.length} choix (attendu 4)`);
      if (ex.answer < 0 || ex.answer >= ex.choices.length) out.push(`${id} : index de réponse invalide`);
      if (new Set(ex.choices).size !== ex.choices.length) out.push(`${id} : choix dupliqués`);
      break;
    case "fill": {
      const placeholders = [...ex.code.code.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
      const expected = ex.blanks.map((_, i) => i + 1);
      if (placeholders.length !== ex.blanks.length) out.push(`${id} : ${placeholders.length} blancs dans le code, ${ex.blanks.length} réponses`);
      else if (JSON.stringify([...placeholders].sort((a, b) => a - b)) !== JSON.stringify(expected)) out.push(`${id} : numéros de blancs incohérents`);
      if (ex.distractors.length < 2) out.push(`${id} : moins de 2 distracteurs`);
      for (const d of ex.distractors) if (ex.blanks.includes(d)) out.push(`${id} : distracteur « ${d} » est aussi une réponse`);
      break;
    }
    case "spot": {
      const lines = ex.code.code.split("\n").length;
      if (ex.faultyLine < 1 || ex.faultyLine > lines) out.push(`${id} : ligne fautive ${ex.faultyLine} hors des ${lines} lignes`);
      if (ex.reasons.length < 3) out.push(`${id} : moins de 3 raisons`);
      if (ex.reasonAnswer < 0 || ex.reasonAnswer >= ex.reasons.length) out.push(`${id} : index de raison invalide`);
      break;
    }
    case "order":
      if (ex.items.length < 3) out.push(`${id} : moins de 3 éléments`);
      if (new Set(ex.items).size !== ex.items.length) out.push(`${id} : éléments dupliqués`);
      break;
    case "match":
      if (ex.pairs.length < 3) out.push(`${id} : moins de 3 paires`);
      if (new Set(ex.pairs.map((p) => p.right)).size !== ex.pairs.length) out.push(`${id} : deux droites identiques`);
      if (new Set(ex.pairs.map((p) => p.left)).size !== ex.pairs.length) out.push(`${id} : deux gauches identiques`);
      break;
    case "recall":
      break;
  }
  return out;
}

export function checkChapter(ch: Chapter): string[] {
  const out: string[] = [];
  if (ch.objective.trim().length <= 10) out.push(`${ch.id} : objectif trop court`);
  const lessons = ch.units.filter(isLesson);
  const exercises = ch.units.filter(isExercise);
  if (lessons.length === 0) out.push(`${ch.id} : aucune leçon`);

  for (const l of lessons) out.push(...checkLesson(l));
  for (const ex of exercises) out.push(...checkExercise(ex));

  // Chaque leçon est suivie de 3 à 8 exercices avant la leçon suivante.
  let current: Lesson | null = null;
  let count = 0;
  const flush = () => {
    if (current && (count < EXERCISES_PER_LESSON_MIN || count > EXERCISES_PER_LESSON_MAX)) {
      out.push(`${current.id} : suivie de ${count} exercices (attendu ${EXERCISES_PER_LESSON_MIN}–${EXERCISES_PER_LESSON_MAX})`);
    }
  };
  for (const u of ch.units) {
    if (isLesson(u)) {
      flush();
      current = u;
      count = 0;
    } else count++;
  }
  flush();

  const kinds = new Set(exercises.map((e) => e.kind));
  for (const k of ALL_KINDS) if (!kinds.has(k)) out.push(`${ch.id} : aucun exercice de type ${k}`);
  const recalls = exercises.filter((e) => e.kind === "recall").length;
  if (recalls < RECALL_MIN) out.push(`${ch.id} : ${recalls} rappels libres (attendu ≥ ${RECALL_MIN})`);

  const ids = ch.units.map((u) => u.id);
  if (new Set(ids).size !== ids.length) out.push(`${ch.id} : ids d'unités dupliqués`);
  for (const id of ids) if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) out.push(`${ch.id} : id « ${id} » pas en kebab-case`);

  return out;
}
