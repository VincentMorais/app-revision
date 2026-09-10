/**
 * Génère `content/generated/meta.ts` et `content/generated/loaders.ts`.
 *
 * Le contenu pèse près d'un mégaoctet, dont 88 % de corps de leçons et
 * d'exercices. Les écrans qui listent, comptent et calculent la progression
 * n'ont besoin que des identifiants, types, tags et énoncés. On extrait donc
 * ces métadonnées dans un module chargé avec l'application, et le contenu
 * complet est importé dynamiquement par chapitre au moment d'entrer en
 * session — d'où le second fichier, la table des chargeurs.
 *
 *   node scripts/gen-content-meta.mjs
 *
 * Lancé automatiquement avant `next build`. Les deux fichiers sont versionnés
 * pour que les tests et le développement fonctionnent sans build préalable ;
 * `content/__tests__/content.test.ts` vérifie qu'ils ne dérivent pas.
 */

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const contentDir = path.join(root, "content");
const outDir = path.join(contentDir, "generated");

/** Ordre des parcours : lu dans content/registry.ts. */
function courseOrder() {
  const src = readFileSync(path.join(contentDir, "registry.ts"), "utf8");
  const bloc = src.slice(src.indexOf("COURSE_DIRS"));
  return [...bloc.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]);
}

/**
 * Transpile un module TypeScript et l'évalue, en réécrivant ses imports
 * relatifs vers des modules `data:` construits de la même façon. Les imports
 * de types (`import type`) sont effacés par la transpilation : aucun module
 * externe n'a donc besoin d'être résolu.
 */
async function loadModule(file, cache = new Map()) {
  if (cache.has(file)) return cache.get(file);

  const source = readFileSync(file, "utf8");

  // Les spécificateurs sont relevés sur l'AST, jamais par expression
  // régulière : les leçons contiennent des exemples de code où figurent
  // des lignes `import … from "./Bouton"` qui ne sont pas des imports.
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.ES2022, true);
  const relatifs = new Set();
  for (const st of ast.statements) {
    const spec = (ts.isImportDeclaration(st) || ts.isExportDeclaration(st))
      ? st.moduleSpecifier
      : undefined;
    if (spec && ts.isStringLiteral(spec) && spec.text.startsWith(".")) {
      relatifs.add(spec.text);
    }
  }

  const dir = path.dirname(file);
  const urlDe = new Map();
  for (const spec of relatifs) {
    const resolved = path.join(dir, spec.endsWith(".ts") ? spec : spec + ".ts");
    urlDe.set(spec, (await loadModule(resolved, cache)).url);
  }

  /** Réécrit les spécificateurs des seules déclarations d'import et d'export. */
  const reecrire = (context) => (sf) => {
    const visite = (node) => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
          && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
          && urlDe.has(node.moduleSpecifier.text)) {
        const remplacant = context.factory.createStringLiteral(urlDe.get(node.moduleSpecifier.text));
        return ts.isImportDeclaration(node)
          ? context.factory.updateImportDeclaration(
              node, node.modifiers, node.importClause, remplacant, node.attributes)
          : context.factory.updateExportDeclaration(
              node, node.modifiers, node.isTypeOnly, node.exportClause, remplacant, node.attributes);
      }
      return ts.visitEachChild(node, visite, context);
    };
    return ts.visitNode(sf, visite);
  };

  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    transformers: { before: [reecrire] },
  }).outputText;

  const url = "data:text/javascript;base64," + Buffer.from(js, "utf8").toString("base64");
  const entry = { url, ns: await import(url) };
  cache.set(file, entry);
  return entry;
}

/** Métadonnées d'une unité : tout sauf le corps. */
function unitMeta(unit) {
  if (unit.kind === "lesson") {
    return { kind: "lesson", id: unit.id, title: unit.title };
  }
  return {
    kind: unit.kind,
    id: unit.id,
    difficulty: unit.difficulty,
    tags: unit.tags,
    prompt: unit.prompt,
  };
}

export function chapterMeta(chapter) {
  const meta = {
    id: chapter.id,
    title: chapter.title,
    objective: chapter.objective,
    prerequisites: chapter.prerequisites,
    units: chapter.units.map(unitMeta),
  };
  if (chapter.format) meta.format = chapter.format;
  return meta;
}

// ---------------------------------------------------------------------------

const cache = new Map();
const courses = [];
/** chapitre → chemin du fichier, pour la table des chargeurs. */
const fichierDuChapitre = new Map();

for (const nom of courseOrder()) {
  const dir = path.join(contentDir, nom);
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`Parcours « ${nom} » introuvable dans content/`);
  }
  const { ns } = await loadModule(path.join(dir, "index.ts"), cache);
  const course = ns[`${nom}Course`];
  if (!course) throw new Error(`content/${nom}/index.ts n'exporte pas ${nom}Course`);

  // Rattacher chaque chapitre à son fichier, pour l'import dynamique.
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".ts") || f === "index.ts") continue;
    const { ns: chapNs } = await loadModule(path.join(dir, f), cache);
    if (chapNs.chapter) fichierDuChapitre.set(chapNs.chapter.id, `${nom}/${f.slice(0, -3)}`);
  }

  courses.push({
    id: course.id,
    title: course.title,
    description: course.description,
    icon: course.icon,
    chapters: course.chapters.map(chapterMeta),
  });
}

for (const course of courses) {
  for (const ch of course.chapters) {
    if (!fichierDuChapitre.has(ch.id)) {
      throw new Error(`Aucun fichier trouvé pour le chapitre « ${ch.id} »`);
    }
  }
}

mkdirSync(outDir, { recursive: true });

const enTete = `/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Produit par scripts/gen-content-meta.mjs, lancé avant \`next build\`.
 * La dérive est détectée par content/__tests__/content.test.ts.
 */
`;

writeFileSync(
  path.join(outDir, "meta.ts"),
  enTete +
    `\nimport type { CourseMeta } from "@/lib/types";\n\n` +
    `export const courses: CourseMeta[] = ${JSON.stringify(courses, null, 2)};\n`,
);

const entrees = [...fichierDuChapitre.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([id, chemin]) => `  ${JSON.stringify(id)}: () => import("../${chemin}"),`)
  .join("\n");

writeFileSync(
  path.join(outDir, "loaders.ts"),
  enTete +
    `\nimport type { Chapter } from "@/lib/types";\n\n` +
    `/** Un import dynamique par chapitre : le bundler en fait autant de morceaux. */\n` +
    `export const chapterLoaders: Record<string, () => Promise<{ chapter: Chapter }>> = {\n` +
    entrees +
    `\n};\n`,
);

const octets = Buffer.byteLength(JSON.stringify(courses), "utf8");
console.log(
  `content/generated : ${courses.length} parcours · ${fichierDuChapitre.size} chapitres · ` +
    `métadonnées ${(octets / 1024).toFixed(0)} ko`,
);
