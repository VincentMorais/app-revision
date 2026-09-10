/**
 * Correction des exercices auto-corrigés.
 *
 * Toutes les réponses sont exprimées en indices sur les données ORIGINALES
 * de l'exercice (pas sur l'ordre affiché). C'est aux composants de faire la
 * conversion depuis leur version mélangée (voir `lib/prepare.ts`).
 */

import type { Grade } from "./srs";
import type {
  Exercise,
  FillExercise,
  MatchExercise,
  McqExercise,
  OrderExercise,
  OutputExercise,
  SpotExercise,
} from "./types";

export type Answer =
  | { kind: "mcq"; choice: number }
  | { kind: "output"; choice: number }
  /** Un token (texte) par blanc, dans l'ordre des `{{n}}`. */
  | { kind: "fill"; tokens: (string | null)[] }
  | { kind: "spot"; line: number; reason: number }
  /** Indices des items originaux, dans l'ordre proposé par l'utilisatrice. */
  | { kind: "order"; sequence: number[] }
  /** `mapping[i]` = index du `right` original choisi pour `pairs[i].left`. */
  | { kind: "match"; mapping: (number | null)[] }
  | { kind: "recall"; grade: Grade };

export type Verdict = {
  correct: boolean;
  grade: Grade;
  /** Détail par sous-partie, pour colorer l'écran (ex. blanc par blanc). */
  details?: boolean[];
  /**
   * Précision sur CE qui a échoué, affichée avant l'explication.
   * Ex. repérage d'erreur : « Bonne ligne, mais pas la bonne raison. »
   */
  feedback?: string;
};

function normalizeToken(t: string): string {
  return t.trim();
}

export function checkMcq(ex: McqExercise | OutputExercise, choice: number): Verdict {
  const correct = choice === ex.answer;
  return { correct, grade: correct ? "good" : "again" };
}

export function checkFill(ex: FillExercise, tokens: (string | null)[]): Verdict {
  const details = ex.blanks.map((expected, i) => {
    const got = tokens[i];
    return got !== null && got !== undefined && normalizeToken(got) === normalizeToken(expected);
  });
  const correct = details.every(Boolean);
  const wrong = details.filter((d) => !d).length;
  return {
    correct,
    grade: correct ? "good" : "again",
    details,
    feedback: correct
      ? undefined
      : wrong === details.length
        ? undefined
        : `${wrong} blanc${wrong > 1 ? "s" : ""} sur ${details.length} à revoir.`,
  };
}

export function checkSpot(ex: SpotExercise, line: number, reason: number): Verdict {
  const lineOk = line === ex.faultyLine;
  const reasonOk = reason === ex.reasonAnswer;
  const correct = lineOk && reasonOk;
  let feedback: string | undefined;
  if (!correct) {
    if (lineOk && !reasonOk) feedback = "Bonne ligne, mais ce n'est pas la bonne raison.";
    else if (!lineOk && reasonOk) feedback = `Bonne raison, mais l'erreur est ligne ${ex.faultyLine}, pas ligne ${line}.`;
    else feedback = `Ni la ligne ni la raison : l'erreur est ligne ${ex.faultyLine}.`;
  }
  return { correct, grade: correct ? "good" : "again", details: [lineOk, reasonOk], feedback };
}

export function checkOrder(ex: OrderExercise, sequence: number[]): Verdict {
  const details = ex.items.map((_, i) => sequence[i] === i);
  const correct = sequence.length === ex.items.length && details.every(Boolean);
  const wrong = details.filter((d) => !d).length;
  return {
    correct,
    grade: correct ? "good" : "again",
    details,
    feedback: correct || wrong === details.length ? undefined : `${wrong} élément${wrong > 1 ? "s" : ""} mal placé${wrong > 1 ? "s" : ""}.`,
  };
}

export function checkMatch(ex: MatchExercise, mapping: (number | null)[]): Verdict {
  const details = ex.pairs.map((_, i) => mapping[i] === i);
  const correct = details.every(Boolean);
  const wrong = details.filter((d) => !d).length;
  return {
    correct,
    grade: correct ? "good" : "again",
    details,
    feedback: correct || wrong === details.length ? undefined : `${wrong} paire${wrong > 1 ? "s" : ""} sur ${details.length} à revoir.`,
  };
}

/** Point d'entrée unique : vérifie que la réponse correspond au type d'exercice. */
export function grade(ex: Exercise, answer: Answer): Verdict {
  if (ex.kind !== answer.kind) {
    throw new Error(`Réponse de type ${answer.kind} pour un exercice ${ex.kind}`);
  }
  switch (answer.kind) {
    case "mcq":
      return checkMcq(ex as McqExercise, answer.choice);
    case "output":
      return checkMcq(ex as OutputExercise, answer.choice);
    case "fill":
      return checkFill(ex as FillExercise, answer.tokens);
    case "spot":
      return checkSpot(ex as SpotExercise, answer.line, answer.reason);
    case "order":
      return checkOrder(ex as OrderExercise, answer.sequence);
    case "match":
      return checkMatch(ex as MatchExercise, answer.mapping);
    case "recall":
      return { correct: answer.grade !== "again", grade: answer.grade };
  }
}
