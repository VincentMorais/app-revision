import { levelInfo } from "@/lib/xp";

/** Niveau, titre et barre d'avancement vers le niveau suivant. */
export function XpBar({ xp }: { xp: number }) {
  const lv = levelInfo(xp);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">
          Niveau {lv.level} · {lv.title}
        </span>
        <span className="text-xs text-fg-muted tabular-nums">
          {lv.into}/{lv.span} XP
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full rounded-full bg-bg-muted" role="progressbar" aria-label="Avancement vers le niveau suivant" aria-valuenow={Math.round(lv.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className="anim-grow h-2.5 rounded-full bg-accent" style={{ width: `${Math.round(lv.progress * 100)}%` }} />
      </div>
    </div>
  );
}
