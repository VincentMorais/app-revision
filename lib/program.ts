/**
 * Programme intensif de 30 jours : un calendrier, une mission par jour.
 *
 * Le calendrier ne bloque jamais : il propose. La mission du jour est le
 * premier chapitre pas encore fait dont la date est atteinte ; si on est à
 * jour, c'est le suivant (prendre de l'avance). Les jours « rattrapage » ne
 * portent aucun chapitre : ils absorbent le retard.
 *
 * Choix d'ordre : la difficulté monte par paliers. La première semaine est
 * consacrée aux Fondations (variables, conditions et boucles, méthodes,
 * objets, collections, erreurs), écrites pour reprendre les bases sans jargon.
 * La deuxième pose le Java solide et le SQL, la troisième attaque Spring, les
 * tests et Docker, la quatrième l'architecture, le front et l'entretien.
 * Chaque semaine finit par un jour de rattrapage. Les chapitres les plus
 * abstraits (concurrence, JVM, DDD, sécurité…) sont en bonus, hors calendrier :
 * à reprendre si l'on prend de l'avance.
 */

import { exercisesOf, type ContentIndex } from "./content";
import { chapterMastery, VALIDATION_THRESHOLD } from "./progress";
import type { AppState } from "./storage";
import { dayKey } from "./streak";
import type { ChapterMeta } from "./types";

export const PROGRAM_DAYS = 30;

export type ProgramDay =
  | { day: number; kind: "chapter"; chapterId: string }
  | { day: number; kind: "buffer" }
  | { day: number; kind: "final" };

const CHAPTER_ORDER = [
  // Semaine 1 : les bases, doucement
  "bases-variables",
  "bases-controle",
  "bases-methodes",
  "bases-objets",
  "bases-collections",
  "bases-erreurs",
  "BUFFER",
  // Semaine 2 : Java solide et SQL
  "java-fondamentaux",
  "java-interfaces-classes-abstraites",
  "java-equals-hashcode-comparable",
  "java-collections",
  "java-exceptions",
  "data-sql-postgres",
  "BUFFER",
  // Semaine 3 : Spring, tests, Docker
  "java-lambdas-streams",
  "spring-ioc",
  "spring-rest",
  "spring-jpa",
  "tests-tdd",
  "docker-bases",
  "BUFFER",
  // Semaine 4 : architecture, front, entretien
  "spring-transactions",
  "archi-hexagonale",
  "devops-git-gitlab-ci",
  "transverse-http-api",
  "react-js-ts",
  "react-hooks",
  "BUFFER",
  "transverse-entretien",
  "FINAL",
] as const;

export const PROGRAM: ProgramDay[] = CHAPTER_ORDER.map((entry, i): ProgramDay => {
  const day = i + 1;
  if (entry === "BUFFER") return { day, kind: "buffer" };
  if (entry === "FINAL") return { day, kind: "final" };
  return { day, kind: "chapter", chapterId: entry };
});

/** Chapitres hors calendrier : utiles, plus abstraits ou moins probables. À faire si on prend de l'avance. */
export const BONUS_CHAPTERS = [
  "java-moderne",
  "spring-configuration",
  "spring-security",
  "data-sql-avance",
  "tests-strategie",
  "archi-ddd-patterns",
  "java-concurrence",
  "java-jvm",
  "spring-autour",
  "spring-migrations",
  "archi-applicative",
  "docker-registry",
  "react-etat-data",
  "react-ecosysteme",
  "devops-git-workflow",
] as const;

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

function dayIndex(ts: number): number {
  const [y, m, d] = dayKey(ts).split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Numéro du jour du programme (1 = jour du départ). Peut dépasser 30. */
export function programDay(startedAt: number, now: number): number {
  return Math.max(1, dayIndex(now) - dayIndex(startedAt) + 1);
}

// ---------------------------------------------------------------------------
// Avancement
// ---------------------------------------------------------------------------

/** Un chapitre du programme est fait : leçons lues et seuil de maîtrise atteint. */
export function isChapterDone(chapter: ChapterMeta, state: AppState): boolean {
  const lessonsRead = chapter.units.every((u) => u.kind !== "lesson" || state.lessonsRead[u.id] !== undefined);
  return lessonsRead && chapterMastery(chapter, state).rate >= VALIDATION_THRESHOLD;
}

/** Part du chapitre accomplie, de 0 à 1 : moitié lecture, moitié maîtrise rapportée au seuil. */
export function chapterCompletion(chapter: ChapterMeta, state: AppState): number {
  const lessons = chapter.units.filter((u) => u.kind === "lesson");
  const read = lessons.length === 0 ? 1 : lessons.filter((u) => state.lessonsRead[u.id] !== undefined).length / lessons.length;
  const mastery = Math.min(1, chapterMastery(chapter, state).rate / VALIDATION_THRESHOLD);
  return exercisesOf(chapter).length === 0 ? read : (read + mastery) / 2;
}

export type StepStatus = "done" | "skipped" | "todo";

export type Mission =
  | { kind: "chapter"; chapter: ChapterMeta; plannedDay: number; completion: number; late: boolean }
  | { kind: "review-all" }
  | { kind: "caught-up" };

export type ProgramStatus = {
  day: number;
  /** Au-delà du jour 30 : le délai est écoulé. */
  over: boolean;
  steps: { entry: ProgramDay; chapter: ChapterMeta | null; status: StepStatus }[];
  mission: Mission;
  /** Chapitres du calendrier faits ou sautés. */
  finished: number;
  /** Chapitres du calendrier au total. */
  planned: number;
  /** Chapitres en retard sur le calendrier (date passée, pas faits). */
  behind: number;
};

export function programStatus(index: ContentIndex, state: AppState, now: number): ProgramStatus | null {
  const program = state.program;
  if (program === null) return null;
  const day = programDay(program.startedAt, now);

  const steps = PROGRAM.map((entry) => {
    if (entry.kind !== "chapter") return { entry, chapter: null, status: "todo" as StepStatus };
    const chapter = index.chaptersById.get(entry.chapterId) ?? null;
    const status: StepStatus =
      chapter === null ? "skipped" : program.skipped.includes(chapter.id) ? "skipped" : isChapterDone(chapter, state) ? "done" : "todo";
    return { entry, chapter, status };
  });

  const chapterSteps = steps.filter((s) => s.entry.kind === "chapter");
  const finished = chapterSteps.filter((s) => s.status !== "todo").length;
  const behind = chapterSteps.filter((s) => s.status === "todo" && s.entry.day < day).length;

  const next = chapterSteps.find((s) => s.status === "todo" && s.chapter !== null);
  let mission: Mission;
  if (next && next.chapter) {
    mission = {
      kind: "chapter",
      chapter: next.chapter,
      plannedDay: next.entry.day,
      completion: chapterCompletion(next.chapter, state),
      late: next.entry.day < day,
    };
  } else {
    mission = day >= PROGRAM_DAYS ? { kind: "review-all" } : { kind: "caught-up" };
  }

  return { day, over: day > PROGRAM_DAYS, steps, mission, finished, planned: chapterSteps.length, behind };
}
