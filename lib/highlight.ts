/**
 * Coloration syntaxique minimale, sans dépendance, embarquée dans le bundle.
 * Suffisante pour des extraits pédagogiques courts : commentaires, chaînes,
 * mots-clés, annotations, nombres, types (identifiants capitalisés), appels.
 *
 * Les blancs `{{n}}` (exercices à trous) sont émis comme tokens `blank`.
 */

import type { CodeLanguage } from "./types";

export type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "annotation"
  | "number"
  | "type"
  | "fn"
  | "punct"
  | "plain"
  | "blank";

export type Token = { type: TokenType; text: string };

type LangSpec = {
  lineComments: string[];
  blockComment?: [string, string];
  quotes: string[];
  keywords: Set<string>;
  caseInsensitive?: boolean;
  annotations?: boolean;
  capitalizedTypes?: boolean;
  /** Clé en début de ligne (yaml, properties) colorée comme mot-clé. */
  lineKey?: RegExp;
};

const JAVA_KW =
  "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record sealed permits yield non-sealed true false null".split(
    " ",
  );

const TS_KW =
  "abstract any as async await boolean break case catch class const constructor continue debugger declare default delete do else enum export extends false finally for from function get if implements import in instanceof interface is keyof let module namespace never new null number of package private protected public readonly return satisfies set static string super switch symbol this throw true try type typeof undefined unique unknown var void while with yield".split(
    " ",
  );

const SQL_KW =
  "select from where and or not in is null as insert into values update set delete create table index unique primary key foreign references drop alter add column constraint join inner left right outer on group by order having limit offset distinct count sum avg min max case when then else end begin commit rollback transaction with union all exists between like ilike returning serial bigserial integer bigint text varchar boolean timestamp timestamptz date uuid jsonb default now explain analyze".split(
    " ",
  );

const BASH_KW = "if then else elif fi for while do done in case esac function return exit export local echo set".split(" ");

const DOCKER_KW = "FROM RUN CMD LABEL EXPOSE ENV ADD COPY ENTRYPOINT VOLUME USER WORKDIR ARG ONBUILD STOPSIGNAL HEALTHCHECK SHELL AS".split(" ");

const SPECS: Record<CodeLanguage, LangSpec> = {
  java: {
    lineComments: ["//"],
    blockComment: ["/*", "*/"],
    quotes: ['"', "'"],
    keywords: new Set(JAVA_KW),
    annotations: true,
    capitalizedTypes: true,
  },
  typescript: {
    lineComments: ["//"],
    blockComment: ["/*", "*/"],
    quotes: ['"', "'", "`"],
    keywords: new Set(TS_KW),
    annotations: true,
    capitalizedTypes: true,
  },
  tsx: {
    lineComments: ["//"],
    blockComment: ["/*", "*/"],
    quotes: ['"', "'", "`"],
    keywords: new Set(TS_KW),
    annotations: true,
    capitalizedTypes: true,
  },
  sql: {
    lineComments: ["--"],
    blockComment: ["/*", "*/"],
    quotes: ["'"],
    keywords: new Set(SQL_KW),
    caseInsensitive: true,
  },
  yaml: {
    lineComments: ["#"],
    quotes: ['"', "'"],
    keywords: new Set(["true", "false", "null", "~"]),
    lineKey: /^(\s*-?\s*)([\w.\-/$]+)(?=\s*:)/,
  },
  dockerfile: {
    lineComments: ["#"],
    quotes: ['"', "'"],
    keywords: new Set(DOCKER_KW),
  },
  bash: {
    lineComments: ["#"],
    quotes: ['"', "'"],
    keywords: new Set(BASH_KW),
  },
  json: {
    lineComments: [],
    quotes: ['"'],
    keywords: new Set(["true", "false", "null"]),
  },
  xml: {
    lineComments: [],
    blockComment: ["<!--", "-->"],
    quotes: ['"', "'"],
    keywords: new Set(),
  },
  properties: {
    lineComments: ["#", "!"],
    quotes: [],
    keywords: new Set(),
    lineKey: /^(\s*)([\w.\-]+)(?=\s*[=:])/,
  },
  text: { lineComments: [], quotes: [], keywords: new Set() },
};

const BLANK_RE = /^\{\{(\d+)\}\}/;
const NUMBER_RE = /^(0x[0-9a-fA-F_]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?[LlFfDd]?)/;
const IDENT_RE = /^[A-Za-z_$][\w$]*/;
const WS_RE = /^\s+/;
const PUNCT_RE = /^[{}()[\];,.<>=+\-*/%!&|^~?:@#\\]/;

function isEscaped(src: string, i: number): boolean {
  let n = 0;
  for (let k = i - 1; k >= 0 && src[k] === "\\"; k--) n++;
  return n % 2 === 1;
}

export function tokenize(code: string, language: CodeLanguage): Token[] {
  const spec = SPECS[language] ?? SPECS.text;
  const out: Token[] = [];
  const push = (type: TokenType, text: string) => {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last.type === type && (type === "plain" || type === "punct")) last.text += text;
    else out.push({ type, text });
  };

  let i = 0;
  let lineStart = true;

  while (i < code.length) {
    const rest = code.slice(i);

    // Clé de ligne (yaml / properties)
    if (lineStart && spec.lineKey) {
      const m = spec.lineKey.exec(rest);
      if (m) {
        push("plain", m[1]);
        push("keyword", m[2]);
        i += m[0].length;
        lineStart = false;
        continue;
      }
    }
    lineStart = false;

    // Blanc {{n}}
    const b = BLANK_RE.exec(rest);
    if (b) {
      out.push({ type: "blank", text: b[0] });
      i += b[0].length;
      continue;
    }

    // Commentaire de bloc
    if (spec.blockComment && rest.startsWith(spec.blockComment[0])) {
      const end = code.indexOf(spec.blockComment[1], i + spec.blockComment[0].length);
      const stop = end === -1 ? code.length : end + spec.blockComment[1].length;
      out.push({ type: "comment", text: code.slice(i, stop) });
      i = stop;
      continue;
    }

    // Commentaire de ligne
    const lc = spec.lineComments.find((c) => rest.startsWith(c));
    if (lc) {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? code.length : end;
      out.push({ type: "comment", text: code.slice(i, stop) });
      i = stop;
      continue;
    }

    // Chaîne (gère les blocs de texte Java """ et les échappements)
    const q = spec.quotes.find((c) => rest.startsWith(c));
    if (q) {
      const triple = q === '"' && rest.startsWith('"""');
      const delim = triple ? '"""' : q;
      let j = i + delim.length;
      while (j < code.length) {
        if (code.startsWith(delim, j) && !isEscaped(code, j)) {
          j += delim.length;
          break;
        }
        if (!triple && code[j] === "\n") break; // chaîne non terminée : on s'arrête à la ligne
        j++;
      }
      out.push({ type: "string", text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Annotation / décorateur
    if (spec.annotations && rest[0] === "@") {
      const m = /^@[A-Za-z_][\w.]*/.exec(rest);
      if (m) {
        out.push({ type: "annotation", text: m[0] });
        i += m[0].length;
        continue;
      }
    }

    // Nombre
    const n = NUMBER_RE.exec(rest);
    if (n && !/[\w$]/.test(code[i - 1] ?? "")) {
      out.push({ type: "number", text: n[0] });
      i += n[0].length;
      continue;
    }

    // Identifiant
    const id = IDENT_RE.exec(rest);
    if (id) {
      const word = id[0];
      const key = spec.caseInsensitive ? word.toLowerCase() : word;
      const after = code.slice(i + word.length);
      let type: TokenType = "plain";
      if (spec.keywords.has(key)) type = "keyword";
      else if (spec.capitalizedTypes && /^[A-Z]/.test(word) && !/^[A-Z][A-Z0-9_]*$/.test(word)) type = "type";
      else if (/^\s*\(/.test(after)) type = "fn";
      push(type, word);
      i += word.length;
      continue;
    }

    // Espaces (on garde les retours à la ligne comme tokens plain)
    const ws = WS_RE.exec(rest);
    if (ws) {
      push("plain", ws[0]);
      i += ws[0].length;
      if (ws[0].includes("\n")) lineStart = true;
      continue;
    }

    const p = PUNCT_RE.exec(rest);
    if (p) {
      push("punct", p[0]);
      i += p[0].length;
      continue;
    }

    push("plain", rest[0]);
    i += 1;
  }

  return out;
}

/** Tokens regroupés par ligne (un token multi-ligne est découpé). */
export function tokenizeLines(code: string, language: CodeLanguage): Token[][] {
  const lines: Token[][] = [[]];
  for (const tok of tokenize(code, language)) {
    const parts = tok.text.split("\n");
    parts.forEach((part, idx) => {
      if (idx > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: tok.type, text: part });
    });
  }
  return lines;
}

/** Numéro du blanc d'un token `blank` (`{{3}}` → 3). */
export function blankNumber(tok: Token): number {
  const m = BLANK_RE.exec(tok.text);
  return m ? Number(m[1]) : 0;
}
