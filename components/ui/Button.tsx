import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ok" | "ko" | "warn";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg font-semibold active:opacity-80 disabled:opacity-40",
  secondary: "bg-bg-muted text-fg border border-border active:bg-bg-elevated disabled:opacity-40",
  ghost: "bg-transparent text-fg-muted active:bg-bg-muted disabled:opacity-40",
  ok: "bg-ok/15 text-ok border border-ok/40 font-semibold active:bg-ok/25",
  ko: "bg-ko/15 text-ko border border-ko/40 font-semibold active:bg-ko/25",
  warn: "bg-warn/15 text-warn border border-warn/40 font-semibold active:bg-warn/25",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  /** Pleine largeur. */
  block?: boolean;
};

/** Bouton tactile : 44 px minimum, pas d'animation. */
export function Button({ variant = "secondary", block, className = "", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`min-h-11 rounded-lg px-4 text-base leading-tight select-none ${styles[variant]} ${block ? "w-full" : ""} ${className}`}
      {...rest}
    />
  );
}
