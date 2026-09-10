/**
 * Vues mélangées des exercices.
 *
 * Les composants affichent des choix/tokens/lignes dans un ordre mélangé mais
 * déterministe (graine = id d'exercice + session). Chaque élément affiché garde
 * son index d'origine pour que `lib/grading.ts` corrige sur les données brutes.
 */

import { createRng, shuffle } from "./random";
import type { FillExercise, MatchExercise, McqExercise, OrderExercise, OutputExercise, SpotExercise } from "./types";

export type Shuffled = { text: string; original: number };

function shuffledOf(items: readonly string[], seed: number): Shuffled[] {
  const rng = createRng(seed);
  return shuffle(
    items.map((text, original) => ({ text, original })),
    rng,
  );
}

/** Choix d'un QCM / prédiction de sortie, mélangés. */
export function prepareChoices(ex: McqExercise | OutputExercise, seed: number): Shuffled[] {
  return shuffledOf(ex.choices, seed);
}

export type FillToken = { id: number; text: string };

/**
 * Banque de tokens d'un exercice à trous : réponses attendues + distracteurs,
 * mélangés. Un token peut apparaître plusieurs fois si plusieurs blancs
 * attendent la même valeur ; chaque occurrence a son `id` propre.
 */
export function prepareFillTokens(ex: FillExercise, seed: number): FillToken[] {
  const all = [...ex.blanks, ...ex.distractors].map((text, id) => ({ id, text }));
  return shuffle(all, createRng(seed));
}

/**
 * Items d'une remise en ordre, mélangés. Garantit que l'ordre affiché diffère
 * de l'ordre correct (sinon l'exercice est résolu d'avance).
 */
export function prepareOrder(ex: OrderExercise, seed: number): Shuffled[] {
  let items = shuffledOf(ex.items, seed);
  let attempt = 1;
  while (ex.items.length > 1 && items.every((it, i) => it.original === i)) {
    items = shuffledOf(ex.items, seed + attempt++);
  }
  return items;
}

export type PreparedMatch = {
  left: Shuffled[];
  right: Shuffled[];
};

/** Colonne gauche dans l'ordre, colonne droite mélangée (jamais identique). */
export function prepareMatch(ex: MatchExercise, seed: number): PreparedMatch {
  const left = ex.pairs.map((p, original) => ({ text: p.left, original }));
  let right = shuffledOf(
    ex.pairs.map((p) => p.right),
    seed,
  );
  let attempt = 1;
  while (ex.pairs.length > 1 && right.every((it, i) => it.original === i)) {
    right = shuffledOf(
      ex.pairs.map((p) => p.right),
      seed + attempt++,
    );
  }
  return { left, right };
}

/** Raisons d'un repérage d'erreur, mélangées. */
export function prepareReasons(ex: SpotExercise, seed: number): Shuffled[] {
  return shuffledOf(ex.reasons, seed);
}
