"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Accueil", icon: "⌂" },
  { href: "/apprendre", label: "Apprendre", icon: "▤" },
  { href: "/erreurs", label: "Erreurs", icon: "✕" },
  { href: "/stats", label: "Stats", icon: "▮" },
] as const;

/** Navigation basse, atteignable au pouce. Absente pendant une session. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Navigation">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {ITEMS.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`tap flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${active ? "text-accent" : "text-fg-muted"}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {it.icon}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
