"use client";

import { useEffect, useState } from "react";
import { chaptersOfUnits, loadFullContent, type FullContent } from "@/content/full";
import type { SessionPlan } from "@/lib/session";

/**
 * Charge le contenu complet des chapitres couverts par un plan de session,
 * puis rend ses enfants. Tant que le chargement dure, un écran d'attente —
 * en pratique invisible, les modules étant déjà en cache hors ligne.
 */
export function SessionContent({
  plan,
  children,
}: {
  plan: SessionPlan;
  children: (contenu: FullContent) => React.ReactNode;
}) {
  const [contenu, setContenu] = useState<FullContent | null>(null);
  const [erreur, setErreur] = useState(false);

  // Clé stable : les chapitres concernés, pas l'objet plan.
  const chapitres = chaptersOfUnits(
    plan.steps.map((s) => (s.kind === "lesson" ? s.lessonId : s.exerciseId)),
  );
  const cle = chapitres.sort().join(",");

  useEffect(() => {
    let annule = false;
    setErreur(false);
    loadFullContent(cle === "" ? [] : cle.split(","))
      .then((c) => {
        if (!annule) setContenu(c);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });
    return () => {
      annule = true;
    };
  }, [cle]);

  if (erreur) {
    return (
      <main className="mx-auto max-w-md p-4">
        <p className="text-ko">Le contenu de cette session n&apos;a pas pu être chargé.</p>
        <p className="mt-2 text-sm text-fg-muted">
          Reconnecte-toi une fois pour le mettre en cache, puis réessaie.
        </p>
      </main>
    );
  }
  if (!contenu) return <main className="min-h-dvh" aria-busy />;
  return <>{children(contenu)}</>;
}
