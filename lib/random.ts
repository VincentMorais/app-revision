/**
 * Générateur pseudo-aléatoire déterministe (mulberry32).
 * Permet de mélanger choix, tokens et lignes de façon reproductible :
 * même graine → même ordre. Utile pour les tests et pour ne pas
 * re-mélanger un exercice à chaque re-render.
 */
export type Rng = () => number;

export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash simple d'une chaîne vers un entier 32 bits (FNV-1a). */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Fisher–Yates, retourne une copie. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Graine stable à partir de plusieurs morceaux (ex. id d'exercice + jour). */
export function seedFor(...parts: (string | number)[]): number {
  return hashString(parts.join("|"));
}
