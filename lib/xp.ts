/**
 * Points d'expérience, niveaux et objectif quotidien.
 *
 * Tout est dérivé d'un total d'XP et d'un cumul par jour : fonctions pures,
 * sans accès au stockage (voir `lib/storage.ts` pour la persistance).
 *
 * Principe : on récompense l'effort, pas seulement la réussite. Une mauvaise
 * réponse rapporte un petit peu aussi, sinon l'application punit justement
 * ce qui fait apprendre.
 */

import type { Grade } from "./srs";
import { dayKey } from "./streak";

export const XP_BY_GRADE: Record<Grade, number> = { good: 10, hard: 5, again: 2 };
export const XP_LESSON = 5;
export const XP_SESSION_BONUS = 10;

/** Objectif quotidien : trois paliers au choix, 50 par défaut (~5 bonnes réponses). */
export const DAILY_GOALS = [
  { xp: 30, label: "Tranquille" },
  { xp: 50, label: "Normal" },
  { xp: 100, label: "Motivé" },
] as const;
export const DEFAULT_DAILY_GOAL = 50;

/** Nombre de jours d'historique d'XP conservés. */
export const DAILY_HISTORY_DAYS = 30;

export function xpForGrade(grade: Grade): number {
  return XP_BY_GRADE[grade];
}

// ---------------------------------------------------------------------------
// Niveaux
// ---------------------------------------------------------------------------

/**
 * XP cumulé nécessaire pour atteindre le niveau `level` (niveau 1 = 0).
 * Les paliers grandissent doucement : 100, 150, 200… d'XP d'un niveau au suivant.
 */
export function xpToReach(level: number): number {
  if (level <= 1) return 0;
  return 25 * (level - 1) * (level + 2);
}

const TITLES = ["Curieux", "Apprenti", "Bidouilleur", "Codeur", "Développeur", "Artisan", "Architecte", "Expert", "Maître", "Légende"];

export type LevelInfo = {
  level: number;
  title: string;
  /** XP gagné dans le niveau courant. */
  into: number;
  /** XP total à gagner pour passer au niveau suivant (taille du niveau). */
  span: number;
  /** Avancement dans le niveau, entre 0 et 1. */
  progress: number;
};

export function levelInfo(xp: number): LevelInfo {
  const total = Math.max(0, Math.floor(xp));
  let level = 1;
  while (xpToReach(level + 1) <= total) level++;
  const floor = xpToReach(level);
  const span = xpToReach(level + 1) - floor;
  const into = total - floor;
  return { level, title: TITLES[Math.min(level - 1, TITLES.length - 1)], into, span, progress: into / span };
}

// ---------------------------------------------------------------------------
// Objectif quotidien
// ---------------------------------------------------------------------------

export type DailyXp = Record<string, number>;

/** Ajoute `amount` d'XP au jour de `now` et élague l'historique ancien. */
export function addDailyXp(daily: DailyXp, amount: number, now: number): DailyXp {
  const key = dayKey(now);
  const next: DailyXp = { ...daily, [key]: (daily[key] ?? 0) + amount };
  const keys = Object.keys(next).sort();
  if (keys.length > DAILY_HISTORY_DAYS) {
    for (const k of keys.slice(0, keys.length - DAILY_HISTORY_DAYS)) delete next[k];
  }
  return next;
}

export function xpToday(daily: DailyXp, now: number): number {
  return daily[dayKey(now)] ?? 0;
}

export type GoalInfo = { done: number; goal: number; reached: boolean; remaining: number; progress: number };

export function goalInfo(daily: DailyXp, goal: number, now: number): GoalInfo {
  const done = xpToday(daily, now);
  return { done, goal, reached: done >= goal, remaining: Math.max(0, goal - done), progress: Math.min(1, done / goal) };
}

// ---------------------------------------------------------------------------
// Paroles d'encouragement
// ---------------------------------------------------------------------------

const CORRECT_LINES = ["Bien joué !", "Exactement.", "Nickel.", "Tu l'as.", "Propre !", "Ça rentre."];
const HARD_LINES = ["Juste, ça avance.", "Tu y es arrivé, c'est ce qui compte.", "Pas facile, mais c'est bon."];
const WRONG_LINES = ["Pas encore, et c'est normal.", "Raté, mais c'est comme ça qu'on retient.", "Presque. Regarde pourquoi.", "Une erreur de plus de comprise."];

/** Phrase variée mais déterministe : même exercice, même phrase (pas de flicker au rendu). */
export function cheer(kind: "correct" | "hard" | "wrong", seed: number): string {
  const lines = kind === "correct" ? CORRECT_LINES : kind === "hard" ? HARD_LINES : WRONG_LINES;
  return lines[Math.abs(seed) % lines.length];
}

/** Message de fin de séance selon la part de réponses justes. */
export function sessionVerdict(rightRate: number): { emoji: string; title: string; sub: string } {
  if (rightRate >= 0.9) return { emoji: "🏆", title: "Séance parfaite", sub: "Tu maîtrises ce passage." };
  if (rightRate >= 0.7) return { emoji: "🎉", title: "Belle séance", sub: "Les erreurs sont déjà prévues pour revenir au bon moment." };
  if (rightRate >= 0.4) return { emoji: "💪", title: "Tu avances", sub: "Ce qui est raté aujourd'hui sera revu demain. C'est le but." };
  return { emoji: "🌱", title: "Premier contact", sub: "C'est normal que ce soit dur au début. Tu as vu les notions, elles reviendront." };
}
