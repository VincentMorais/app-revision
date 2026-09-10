/**
 * Sauvegarde et restauration de la progression sous forme de fichier JSON.
 *
 * L'app n'a ni compte ni backend : la progression ne vit que dans le
 * `localStorage` du navigateur. Vider les données du site, changer de
 * téléphone ou une purge automatique du navigateur suffit à tout perdre.
 * Ce module donne la porte de sortie : un fichier que l'on garde soi-même.
 *
 * Le fichier est une enveloppe (`app`, `kind`, `exportedAt`) autour de
 * l'état. `parseBackup` refuse tout ce qui ne ressemble pas à une
 * sauvegarde de cette app, puis délègue à `migrate` : un fichier d'une
 * version antérieure est accepté et migré, un fichier abîmé perd les
 * champs illisibles plutôt que de faire planter l'import.
 */

import { migrate, STATE_VERSION, type AppState } from "./storage";

export const BACKUP_APP = "app-revision";
export const BACKUP_KIND = "backup";

export type Backup = {
  app: typeof BACKUP_APP;
  kind: typeof BACKUP_KIND;
  /** Timestamp ms de l'export. */
  exportedAt: number;
  state: AppState;
};

/** Ce que contient un fichier, montré avant de confirmer l'import. */
export type BackupSummary = {
  /** Date d'export, `null` si le fichier ne la porte pas. */
  exportedAt: number | null;
  attempts: number;
  items: number;
  lessonsRead: number;
  validatedChapters: number;
  streak: number;
};

export type ParseResult =
  | { ok: true; state: AppState; summary: BackupSummary }
  | { ok: false; error: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function buildBackup(state: AppState, now = Date.now()): Backup {
  return { app: BACKUP_APP, kind: BACKUP_KIND, exportedAt: now, state };
}

/** JSON indenté : le fichier reste lisible et « diffable » à la main. */
export function serializeBackup(state: AppState, now = Date.now()): string {
  return JSON.stringify(buildBackup(state, now), null, 2);
}

/** `revision-progression-2026-09-10.json` */
export function backupFilename(now = Date.now()): string {
  const d = new Date(now);
  const p = (n: number) => String(n).padStart(2, "0");
  return `revision-progression-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`;
}

export function summarize(state: AppState, exportedAt: number | null): BackupSummary {
  return {
    exportedAt,
    attempts: state.attempts.length,
    items: Object.keys(state.items).length,
    lessonsRead: Object.keys(state.lessonsRead).length,
    validatedChapters: Object.keys(state.validatedChapters).length,
    streak: state.streak.current,
  };
}

/**
 * Valide le contenu d'un fichier choisi par l'utilisateur.
 *
 * Accepte l'enveloppe complète, ou un état nu (`{version, items, …}`) pour
 * pouvoir récupérer une valeur copiée directement depuis le `localStorage`.
 * Les messages d'erreur sont destinés à être affichés tels quels.
 */
export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "Fichier illisible : ce n'est pas du JSON." };
  }

  if (!isRecord(raw)) {
    return { ok: false, error: "Fichier illisible : on attend un objet JSON." };
  }

  // Enveloppe, ou état nu ?
  let payload: unknown = raw;
  let exportedAt: number | null = null;

  if ("state" in raw || "app" in raw || "kind" in raw) {
    if (raw.app !== BACKUP_APP) {
      return { ok: false, error: "Ce fichier ne vient pas de Révision." };
    }
    if (!isRecord(raw.state)) {
      return { ok: false, error: "Sauvegarde incomplète : la progression est absente." };
    }
    payload = raw.state;
    exportedAt = typeof raw.exportedAt === "number" ? raw.exportedAt : null;
  }

  if (!isRecord(payload)) {
    return { ok: false, error: "Sauvegarde incomplète : la progression est absente." };
  }

  const version = payload.version;
  if (typeof version !== "number") {
    return { ok: false, error: "Sauvegarde sans numéro de version : impossible à relire." };
  }
  if (version < 1 || version > STATE_VERSION) {
    return {
      ok: false,
      error: `Version de sauvegarde inconnue (${version}). Cette app lit les versions 1 à ${STATE_VERSION}.`,
    };
  }

  const state = migrate(payload);
  return { ok: true, state, summary: summarize(state, exportedAt) };
}
