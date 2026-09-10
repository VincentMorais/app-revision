import { Fragment, type ReactNode } from "react";

/**
 * Texte avec mise en forme inline minimale : `code` et **gras**.
 * Les doubles retours à la ligne séparent des paragraphes.
 */
export function InlineText({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={`${className} ${i > 0 ? "mt-2" : ""}`}>
          {renderInline(p)}
        </p>
      ))}
    </>
  );
}

const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*)/g;

export function renderInline(text: string): ReactNode {
  const parts = text.split(INLINE_RE);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={i} className="rounded bg-bg-muted px-1 py-0.5 font-mono text-[0.9em] text-fg">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
