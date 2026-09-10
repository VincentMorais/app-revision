/**
 * Types du contenu pédagogique.
 *
 * Hiérarchie : Course (parcours) → Chapter (chapitre) → Unit (leçon ou exercice).
 * Le contenu vit dans `content/`, un fichier par chapitre, jamais dans les composants.
 */

export type CodeLanguage =
  | "java"
  | "sql"
  | "typescript"
  | "tsx"
  | "yaml"
  | "dockerfile"
  | "bash"
  | "json"
  | "xml"
  | "properties"
  | "text";

export type CodeSnippet = {
  language: CodeLanguage;
  code: string;
};

// ---------------------------------------------------------------------------
// Leçons
// ---------------------------------------------------------------------------

export type ComparisonSide = {
  label: string;
  text?: string;
  code?: CodeSnippet;
};

export type Block =
  /** Paragraphe court. Supporte `code inline` et **gras**. */
  | { kind: "text"; text: string }
  /** Extrait de code réel et commenté. */
  | { kind: "code"; language: CodeLanguage; code: string; caption?: string }
  /** Encadré : piège, conseil, information. */
  | { kind: "callout"; tone: "info" | "warning" | "tip"; title?: string; text: string }
  /** Deux colonnes côte à côte (ex. surcharge vs redéfinition). */
  | { kind: "comparison"; title?: string; left: ComparisonSide; right: ComparisonSide };

/**
 * Ce que l'application connaît d'une leçon sans charger son contenu.
 * Voir `UnitMeta` pour la raison de cette séparation.
 */
export type LessonMeta = {
  kind: "lesson";
  id: string;
  title: string;
};

export type Lesson = LessonMeta & {
  /** 500 à 900 mots en format détaillé, une notion par leçon. */
  blocks: Block[];
};

// ---------------------------------------------------------------------------
// Exercices
// ---------------------------------------------------------------------------

export type Difficulty = 1 | 2 | 3;

/** Champs communs à tous les exercices. */
export type ExerciseBase = {
  id: string;
  difficulty: Difficulty;
  /** Notions ciblées, ex. ["interfaces", "default-methods"]. Sert au journal d'erreurs et aux stats. */
  tags: string[];
  /** Énoncé. */
  prompt: string;
  /**
   * Explication affichée après la réponse, juste ou fausse.
   * Pour `recall`, c'est la correction révélée.
   */
  explanation: string;
};

/** QCM : une bonne réponse parmi quatre. Les distracteurs sont des erreurs plausibles. */
export type McqExercise = ExerciseBase & {
  kind: "mcq";
  code?: CodeSnippet;
  choices: string[];
  /** Index de la bonne réponse dans `choices`. */
  answer: number;
};

/**
 * Trous dans du code. Les blancs sont notés `{{1}}`, `{{2}}`… dans `code.code`.
 * `blanks[i]` est la réponse attendue pour `{{i+1}}`. Les tokens proposés à
 * l'écran sont `blanks ∪ distractors`, mélangés.
 */
export type FillExercise = ExerciseBase & {
  kind: "fill";
  code: CodeSnippet;
  blanks: string[];
  distractors: string[];
};

/** Prédiction de sortie : que se passe-t-il quand ce code s'exécute ? */
export type OutputExercise = ExerciseBase & {
  kind: "output";
  code: CodeSnippet;
  choices: string[];
  answer: number;
};

/**
 * Repérage d'erreur : une ligne fautive (numérotée à partir de 1) et la raison
 * parmi plusieurs propositions.
 */
export type SpotExercise = ExerciseBase & {
  kind: "spot";
  code: CodeSnippet;
  faultyLine: number;
  reasons: string[];
  /** Index de la bonne raison dans `reasons`. */
  reasonAnswer: number;
};

/** Remise en ordre : `items` est donné dans le bon ordre, mélangé à l'affichage. */
export type OrderExercise = ExerciseBase & {
  kind: "order";
  items: string[];
  /** Si présent, les items sont rendus comme du code. */
  language?: CodeLanguage;
};

/** Association : relier chaque `left` à son `right`. */
export type MatchExercise = ExerciseBase & {
  kind: "match";
  pairs: { left: string; right: string }[];
};

/**
 * Rappel libre auto-évalué : la réponse est formulée mentalement, puis la
 * correction (`explanation`) est révélée et l'utilisatrice se note.
 */
export type RecallExercise = ExerciseBase & {
  kind: "recall";
  code?: CodeSnippet;
  /** Points clés que la réponse devait contenir, pour guider l'auto-notation. */
  keyPoints?: string[];
};

export type Exercise =
  | McqExercise
  | FillExercise
  | OutputExercise
  | SpotExercise
  | OrderExercise
  | MatchExercise
  | RecallExercise;

export type ExerciseKind = Exercise["kind"];

export const EXERCISE_KINDS: readonly ExerciseKind[] = [
  "mcq",
  "fill",
  "output",
  "spot",
  "order",
  "match",
  "recall",
] as const;

// ---------------------------------------------------------------------------
// Structure
// ---------------------------------------------------------------------------

export type Unit = Lesson | Exercise;

// ---------------------------------------------------------------------------
// Métadonnées
// ---------------------------------------------------------------------------

/**
 * Le contenu pèse près d'un mégaoctet, dont 88 % de corps de leçons et
 * d'exercices — blocs, code, choix, explications. Or les écrans qui listent,
 * comptent et calculent la progression n'ont besoin que des identifiants, des
 * types, des tags et des énoncés.
 *
 * On sépare donc les **métadonnées**, chargées avec l'application, du
 * **contenu complet**, chargé à la demande par chapitre au moment d'entrer
 * en session (`content/full.ts`). Les types complets sont des extensions des
 * types de métadonnées : un `Exercise` est utilisable partout où un
 * `ExerciseMeta` est attendu.
 */
export type ExerciseMeta = {
  kind: ExerciseKind;
  id: string;
  difficulty: Difficulty;
  tags: string[];
  /** Énoncé : affiché dans le journal d'erreurs sans charger le corps. */
  prompt: string;
};

export type UnitMeta = LessonMeta | ExerciseMeta;

export type ChapterMeta = {
  id: string;
  title: string;
  objective: string;
  prerequisites: string[];
  format?: ChapterFormat;
  units: UnitMeta[];
};

export type CourseMeta = {
  id: string;
  title: string;
  description: string;
  icon: string;
  chapters: ChapterMeta[];
};

/**
 * Densité éditoriale du chapitre, qui décide des règles vérifiées par
 * `lib/content-rules.ts`.
 *
 * - `compact` : format d'origine, 4 leçons de 150–300 mots suivies de 7 à 8
 *   exercices. Trop dense à l'usage : la règle est énoncée, jamais motivée.
 * - `detaille` : format courant, 8 à 10 leçons de 500–900 mots (pourquoi
 *   ça existe, un contre-exemple, l'exemple, la règle, une comparaison, les
 *   pièges) suivies de 3 à 5 exercices seulement.
 *
 * Les chapitres écrits avant la bascule restent en `compact` le temps d'être
 * repris ; c'est la valeur par défaut quand le champ est absent.
 */
export type ChapterFormat = "compact" | "detaille";

export type Chapter = {
  id: string;
  title: string;
  /** Ce qu'on sait faire à la fin du chapitre, en une phrase. */
  objective: string;
  /** Ids de chapitres à valider (70 % de réussite) avant d'ouvrir celui-ci. */
  prerequisites: string[];
  /** Défaut : `compact` (chapitres antérieurs à la bascule). */
  format?: ChapterFormat;
  units: Unit[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  /** Emoji ou nom d'icône. */
  icon: string;
  chapters: Chapter[];
};

/**
 * Gardes génériques : appliqués à des `Unit` ils affinent vers `Lesson` et
 * `Exercise`, appliqués à des `UnitMeta` vers `LessonMeta` et `ExerciseMeta`.
 */
export function isLesson<T extends UnitMeta>(unit: T): unit is Extract<T, { kind: "lesson" }> {
  return unit.kind === "lesson";
}

export function isExercise<T extends UnitMeta>(unit: T): unit is Exclude<T, { kind: "lesson" }> {
  return unit.kind !== "lesson";
}
