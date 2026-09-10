import { describe, expect, it } from "vitest";
import {
  BACKUP_APP,
  backupFilename,
  buildBackup,
  parseBackup,
  serializeBackup,
  summarize,
} from "@/lib/backup";
import { STATE_VERSION, createEmptyState, type AppState } from "@/lib/storage";

function sampleState(): AppState {
  return {
    version: STATE_VERSION,
    items: {
      "java-fondamentaux-01": { ease: 2.5, interval: 3, reps: 2, lapses: 0, due: 500, lastReview: 100 },
      "java-fondamentaux-02": { ease: 2.3, interval: 0, reps: 0, lapses: 1, due: 100, lastReview: 100 },
    },
    attempts: [
      { exerciseId: "java-fondamentaux-01", at: 100, correct: true, grade: "good" },
      { exerciseId: "java-fondamentaux-02", at: 100, correct: false, grade: "again" },
    ],
    lessonsRead: { "java-fondamentaux-l1": 100 },
    validatedChapters: { "java-fondamentaux": 100 },
    streak: { current: 4, longest: 9, lastActiveDay: "2026-09-10" },
  };
}

describe("export", () => {
  it("enveloppe l'état avec l'app et la date", () => {
    const b = buildBackup(sampleState(), 1234);
    expect(b.app).toBe(BACKUP_APP);
    expect(b.kind).toBe("backup");
    expect(b.exportedAt).toBe(1234);
    expect(b.state).toEqual(sampleState());
  });

  it("nomme le fichier avec la date du jour", () => {
    expect(backupFilename(new Date(2026, 8, 10).getTime())).toBe("revision-progression-2026-09-10.json");
  });

  it("fait un aller-retour sans perte", () => {
    const state = sampleState();
    const parsed = parseBackup(serializeBackup(state, 1234));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.state).toEqual(state);
      expect(parsed.summary.exportedAt).toBe(1234);
    }
  });
});

describe("summarize", () => {
  it("compte ce que contient l'état", () => {
    expect(summarize(sampleState(), 7)).toEqual({
      exportedAt: 7,
      attempts: 2,
      items: 2,
      lessonsRead: 1,
      validatedChapters: 1,
      streak: 4,
    });
  });
});

describe("parseBackup", () => {
  it("refuse un fichier qui n'est pas du JSON", () => {
    const r = parseBackup("{pas du json");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/JSON/);
  });

  it("refuse un JSON qui n'est pas un objet", () => {
    expect(parseBackup("[1,2,3]").ok).toBe(false);
    expect(parseBackup('"texte"').ok).toBe(false);
  });

  it("refuse une sauvegarde d'une autre app", () => {
    const r = parseBackup(JSON.stringify({ app: "autre-app", kind: "backup", state: createEmptyState() }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/ne vient pas de Révision/);
  });

  it("refuse une enveloppe sans progression", () => {
    const r = parseBackup(JSON.stringify({ app: BACKUP_APP, kind: "backup", exportedAt: 1 }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/incomplète/);
  });

  it("refuse un état sans version", () => {
    const r = parseBackup(JSON.stringify({ items: {}, attempts: [] }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/version/i);
  });

  it("refuse une version future", () => {
    const r = parseBackup(JSON.stringify({ ...createEmptyState(), version: STATE_VERSION + 1 }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/inconnue/);
  });

  it("accepte un état nu, sans enveloppe", () => {
    const r = parseBackup(JSON.stringify(sampleState()));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state).toEqual(sampleState());
      expect(r.summary.exportedAt).toBeNull();
    }
  });

  it("accepte et migre une sauvegarde v1", () => {
    const v1 = { version: 1, items: {}, attempts: [], lessonsRead: { l1: 5 }, streak: { current: 2, longest: 3, lastActiveDay: null } };
    const r = parseBackup(JSON.stringify({ app: BACKUP_APP, kind: "backup", exportedAt: 9, state: v1 }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state.version).toBe(STATE_VERSION);
      expect(r.state.lessonsRead).toEqual({ l1: 5 });
      // v1 ne connaît pas les chapitres validés : ils seront recalculés.
      expect(r.state.validatedChapters).toEqual({});
    }
  });

  it("ignore les entrées abîmées sans faire échouer l'import", () => {
    const state = sampleState();
    const abimé = {
      ...state,
      items: { ...state.items, cassé: { ease: "beaucoup" } },
      attempts: [...state.attempts, { exerciseId: 42, at: "hier" }],
    };
    const r = parseBackup(JSON.stringify(buildBackup(abimé as unknown as AppState, 1)));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(Object.keys(r.state.items)).toEqual(["java-fondamentaux-01", "java-fondamentaux-02"]);
      expect(r.state.attempts).toHaveLength(2);
    }
  });
});
