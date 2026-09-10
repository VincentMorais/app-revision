/// <reference types="vite/client" />
/**
 * Garde-fous sur le contenu.
 *
 * 1. Chaque fichier de chapitre présent sur le disque (`content/<parcours>/<chapitre>.ts`,
 *    exportant `chapter`) respecte les règles éditoriales, même s'il n'est pas
 *    encore enregistré dans `content/index.ts`.
 * 2. Le registre est cohérent (ids uniques, prérequis connus) : vérifié par `buildIndex`.
 */

import { describe, expect, it } from "vitest";
import { contentIndex, courses } from "@/content";
import { checkChapter } from "@/lib/content-rules";
import { isExercise, isLesson, type Chapter, type ChapterMeta, type UnitMeta } from "@/lib/types";
import { courses as generatedCourses } from "@/content/generated/meta";
import { chapterLoaders } from "@/content/generated/loaders";

/** Même extraction que scripts/gen-content-meta.mjs, pour comparer. */
function metaDuChapitre(chapter: Chapter): ChapterMeta {
  const units: UnitMeta[] = chapter.units.map((u) =>
    isLesson(u)
      ? { kind: "lesson" as const, id: u.id, title: u.title }
      : { kind: u.kind, id: u.id, difficulty: u.difficulty, tags: u.tags, prompt: u.prompt },
  );
  const meta: ChapterMeta = {
    id: chapter.id,
    title: chapter.title,
    objective: chapter.objective,
    prerequisites: chapter.prerequisites,
    units,
  };
  if (chapter.format) meta.format = chapter.format;
  return meta;
}

const modules = import.meta.glob<{ chapter?: Chapter }>(
  ["../*/*.ts", "!../*/index.ts", "!../demo/*", "!../__tests__/*", "!../generated/*"],
  { eager: true },
);

const chapterFiles: { file: string; chapter: Chapter }[] = Object.entries(modules)
  .filter(([, m]) => m.chapter !== undefined)
  .map(([file, m]) => ({ file, chapter: m.chapter! }));

describe("fichiers de chapitre", () => {
  it("il y en a au moins un et chacun exporte `chapter`", () => {
    expect(chapterFiles.length).toBeGreaterThan(0);
    for (const [file, m] of Object.entries(modules)) {
      expect(m.chapter, `${file} n'exporte pas \`chapter\``).toBeDefined();
    }
  });

  for (const { file, chapter } of chapterFiles) {
    it(`${file} → ${chapter.id} respecte les règles éditoriales`, () => {
      const problemes = checkChapter(chapter);
      // Le message porte la liste complète : une assertion sur un tableau
      // vide tronque l'affichage et rend l'échec inexploitable.
      expect(problemes, problemes.map((p) => "\n  - " + p).join("")).toEqual([]);
    });
  }

  it("les ids d'unités et de chapitres sont uniques sur l'ensemble des fichiers", () => {
    const chapterIds = chapterFiles.map((c) => c.chapter.id);
    expect(new Set(chapterIds).size, `chapitres : ${chapterIds.join(", ")}`).toBe(chapterIds.length);
    const unitIds = chapterFiles.flatMap((c) => c.chapter.units.map((u) => u.id));
    const dupes = unitIds.filter((id, i) => unitIds.indexOf(id) !== i);
    expect(dupes, "ids d'unités dupliqués").toEqual([]);
  });
});

describe("registre", () => {
  it("contient au moins un parcours avec un chapitre", () => {
    expect(courses.length).toBeGreaterThan(0);
    expect(contentIndex.chaptersById.size).toBeGreaterThan(0);
  });

  it("chaque parcours a un id, un titre, une icône et une description", () => {
    for (const c of courses) {
      expect(c.id).toMatch(/^[a-z0-9-]+$/);
      expect(c.title.length).toBeGreaterThan(1);
      expect(c.icon.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(5);
    }
  });
});

describe("chapitre étalon", () => {
  it("Java — Interfaces et classes abstraites : 4 leçons, 30 exercices", () => {
    const ch = contentIndex.chaptersById.get("java-interfaces-classes-abstraites")!;
    expect(ch).toBeDefined();
    expect(ch.units.filter(isLesson)).toHaveLength(4);
    expect(ch.units.filter(isExercise)).toHaveLength(30);
  });
});

describe("métadonnées générées", () => {
  it("content/generated/meta.ts est à jour", () => {
    // Les métadonnées sont dérivées des fichiers de chapitre par
    // scripts/gen-content-meta.mjs. Si un chapitre est ajouté ou modifié
    // sans régénérer, ce test le dit — sinon la dérive passerait inaperçue
    // jusqu'à un écran vide en production.
    const attendu = new Map(
      chapterFiles.map(({ chapter }) => [chapter.id, metaDuChapitre(chapter)]),
    );
    const genere = new Map(
      generatedCourses.flatMap((c) => c.chapters.map((ch) => [ch.id, ch])),
    );

    expect([...genere.keys()].sort()).toEqual([...attendu.keys()].sort());
    for (const [id, ch] of attendu) {
      expect(genere.get(id), `chapitre ${id} : lancer npm run content:meta`).toEqual(ch);
    }
  });

  it("chaque chapitre a un chargeur de contenu complet", () => {
    for (const { chapter } of chapterFiles) {
      expect(chapterLoaders[chapter.id], `pas de chargeur pour ${chapter.id}`).toBeDefined();
    }
    expect(Object.keys(chapterLoaders).sort()).toEqual(
      chapterFiles.map((c) => c.chapter.id).sort(),
    );
  });
});
