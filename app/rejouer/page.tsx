"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { contentIndex } from "@/content";
import { SessionContent } from "@/components/session/SessionContent";
import { SessionRunner } from "@/components/session/SessionRunner";
import { composeReplaySession } from "@/lib/session";
import { useMounted } from "@/lib/store";

/** Rejouer une liste d'exercices : `/rejouer?ids=a,b,c`. */
function ReplayInner() {
  const router = useRouter();
  const search = useSearchParams();
  const mounted = useMounted();
  const ids = useMemo(
    () =>
      (search.get("ids") ?? "")
        .split(",")
        .filter((id) => contentIndex.exercisesById.has(id)),
    [search],
  );
  const title = search.get("titre") ?? "Rejouer";
  const plan = useMemo(() => composeReplaySession(ids), [ids]);
  if (!mounted) return <main className="min-h-dvh" aria-busy />;
  return (
    <SessionContent plan={plan}>
      {(contenu) => (
        <SessionRunner plan={plan} title={title} contenu={contenu} onExit={() => router.back()} />
      )}
    </SessionContent>
  );
}

export default function ReplayPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh" aria-busy />}>
      <ReplayInner />
    </Suspense>
  );
}
