"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * Une leçon, servie par petites cartes : un bloc à la fois, un tap pour le
 * suivant. Une leçon de 800 mots d'un seul tenant fait décrocher ; une idée
 * par écran, on a toujours un but immédiat (« encore 2 »). Les blocs déjà
 * lus restent affichés au-dessus pour relire sans revenir en arrière.
 */
export function LessonView({ lesson, onContinue, continueLabel = "Passer aux exercices" }: { lesson: Lesson; onContinue: () => void; continueLabel?: string }) {
  const total = lesson.blocks.length;
  const [shown, setShown] = useState(1);
  const last = useRef<HTMLDivElement | null>(null);
  const done = shown >= total;

  // Amène la carte qui vient d'apparaître en vue, sans animer si l'appareil l'a demandé.
  useEffect(() => {
    if (shown <= 1) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    last.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  }, [shown]);

  return (
    <article className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold leading-tight">{lesson.title}</h2>
      {lesson.blocks.slice(0, shown).map((b, i) => (
        <div key={i} ref={i === shown - 1 ? last : undefined} className={`scroll-mt-20 ${i === shown - 1 && i > 0 ? "anim-rise" : ""}`}>
          <BlockView block={b} />
        </div>
      ))}
      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        {total > 1 && (
          <div className="mb-2 flex justify-center gap-1.5" aria-hidden>
            {lesson.blocks.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i < shown ? "w-5 bg-accent" : "w-1.5 bg-bg-muted"}`} />
            ))}
          </div>
        )}
        <Button variant="primary" block onClick={done ? onContinue : () => setShown((n) => n + 1)}>
          {done ? continueLabel : `Suite (${shown}/${total})`}
        </Button>
      </div>
    </article>
  );
}
