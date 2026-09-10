/**
 * Série de jours consécutifs avec au moins une réponse.
 * Les jours sont calculés en heure locale de l'appareil.
 */

export type StreakState = {
  current: number;
  longest: number;
  /** Dernier jour actif, au format YYYY-MM-DD (local). */
  lastActiveDay: string | null;
};

export function emptyStreak(): StreakState {
  return { current: 0, longest: 0, lastActiveDay: null };
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const utcA = Date.UTC(ay, am - 1, ad);
  const utcB = Date.UTC(by, bm - 1, bd);
  return Math.round((utcB - utcA) / 86_400_000);
}

/** Enregistre une activité au moment `now` et retourne la série mise à jour. */
export function touchStreak(streak: StreakState, now: number): StreakState {
  const today = dayKey(now);
  if (streak.lastActiveDay === today) return streak;

  let current: number;
  if (streak.lastActiveDay === null) current = 1;
  else {
    const gap = daysBetween(streak.lastActiveDay, today);
    current = gap === 1 ? streak.current + 1 : gap <= 0 ? streak.current : 1;
  }
  return { current, longest: Math.max(streak.longest, current), lastActiveDay: today };
}

/**
 * Série « vivante » au moment `now` : si le dernier jour actif est avant hier,
 * la série est en réalité retombée à 0 même si rien n'a été écrit.
 */
export function effectiveStreak(streak: StreakState, now: number): number {
  if (streak.lastActiveDay === null) return 0;
  const gap = daysBetween(streak.lastActiveDay, dayKey(now));
  return gap <= 1 ? streak.current : 0;
}
