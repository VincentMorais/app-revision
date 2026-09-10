import { describe, expect, it } from "vitest";
import { blankNumber, tokenize, tokenizeLines } from "@/lib/highlight";

const types = (code: string, lang: Parameters<typeof tokenize>[1]) =>
  tokenize(code, lang)
    .filter((t) => t.text.trim() !== "")
    .map((t) => `${t.type}:${t.text.trim()}`);

describe("tokenize java", () => {
  it("distingue mots-clés, types, annotations, chaînes, nombres, commentaires, appels", () => {
    const code = `@Override // note\npublic String name() { return "x" + 42; }`;
    expect(types(code, "java")).toEqual([
      "annotation:@Override",
      "comment:// note",
      "keyword:public",
      "type:String",
      "fn:name",
      "punct:()",
      "punct:{",
      "keyword:return",
      'string:"x"',
      "punct:+",
      "number:42",
      "punct:;",
      "punct:}",
    ]);
  });

  it("gère les commentaires de bloc multi-lignes et les blocs de texte", () => {
    const code = `/* a\nb */ var s = """\n  hi\n  """;`;
    const toks = tokenize(code, "java");
    expect(toks[0]).toEqual({ type: "comment", text: "/* a\nb */" });
    expect(toks.find((t) => t.type === "string")?.text).toBe('"""\n  hi\n  """');
  });

  it("une constante MAJUSCULE n'est pas un type", () => {
    expect(types("MAX_SIZE", "java")).toEqual(["plain:MAX_SIZE"]);
  });

  it("émet les blancs {{n}}", () => {
    const toks = tokenize("class A {{1}} B", "java");
    const blank = toks.find((t) => t.type === "blank")!;
    expect(blank.text).toBe("{{1}}");
    expect(blankNumber(blank)).toBe(1);
  });
});

describe("autres langages", () => {
  it("sql insensible à la casse, commentaire --", () => {
    expect(types("SELECT id FROM users -- c", "sql")).toEqual(["keyword:SELECT", "plain:id", "keyword:FROM", "plain:users", "comment:-- c"]);
  });

  it("yaml : clés en début de ligne", () => {
    const lines = tokenizeLines("stages:\n  - build\nimage: node:20 # x", "yaml");
    expect(lines[0][0]).toEqual({ type: "keyword", text: "stages" });
    expect(lines[2][0]).toEqual({ type: "keyword", text: "image" });
    expect(lines[2].at(-1)).toEqual({ type: "comment", text: "# x" });
  });

  it("dockerfile : instructions", () => {
    expect(types("FROM eclipse-temurin:21", "dockerfile")[0]).toBe("keyword:FROM");
  });

  it("text : tout est plain", () => {
    expect(tokenize("hello world", "text").every((t) => t.type === "plain")).toBe(true);
  });
});

describe("tokenizeLines", () => {
  it("découpe par ligne en conservant les lignes vides", () => {
    const lines = tokenizeLines("a\n\nb", "text");
    expect(lines).toHaveLength(3);
    expect(lines[1]).toEqual([]);
  });
});
