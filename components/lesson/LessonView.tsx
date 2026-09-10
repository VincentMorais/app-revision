"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { InlineText } from "@/components/InlineText";
import { Button } from "@/components/ui/Button";
import type { Block, ComparisonSide, Lesson } from "@/lib/types";

const CALLOUT: Record<"info" | "warning" | "tip", { border: string; label: string }> = {
  info: { border: "border-accent/50", label: "À savoir" },
  warning: { border: "border-warn/60", label: "Piège" },
  tip: { border: "border-ok/50", label: "Conseil" },
};

function Side({ side }: { side: ComparisonSide }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">{side.label}</p>
      {side.text && <InlineText text={side.text} className="text-[15px]" />}
      {side.code && <CodeBlock code={side.code.code} language={side.code.language} className="mt-2" />}
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "text":
      return <InlineText text={block.text} className="text-[16px] leading-relaxed" />;
    case "code":
      return <CodeBlock code={block.code} language={block.language} caption={block.caption} />;
    case "callout": {
      const c = CALLOUT[block.tone];
      return (
        <div className={`rounded-lg border-l-4 ${c.border} bg-bg-elevated px-3 py-2.5`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">{block.title ?? c.label}</p>
          <InlineText text={block.text} className="text-[15px] leading-relaxed" />
        </div>
      );
    }
    case "comparison":
      return (
        <div>
          {block.title && <p className="mb-2 text-sm font-semibold text-fg-muted">{block.title}</p>}
          <div className="flex flex-col gap-2">
            <Side side={block.left} />
            <Side side={block.right} />
          </div>
        </div>
      );
  }
}

/** Une leçon : courte, un concept, puis un tap volontaire vers les exercices. */
export function LessonView({ lesson, onContinue, continueLabel = "Passer aux exercices" }: { lesson: Lesson; onContinue: () => void; continueLabel?: string }) {
  return (
    <article className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold leading-tight">{lesson.title}</h2>
      {lesson.blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        <Button variant="primary" block onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </article>
  );
}
