"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * État du préchargement hors ligne, pour pouvoir vérifier avant de partir
 * que tous les chapitres sont bien sur l'appareil.
 *
 * Le service worker écrit son avancement dans son cache ; on le lui demande
 * par message. En développement il n'est pas enregistré : on le dit.
 */

type Status = {
  version: string;
  complete: boolean;
  routes: number;
  totalRoutes: number;
  assets: number;
  totalAssets: number;
  at: number;
};

type View =
  | { kind: "unsupported" }
  | { kind: "waiting" }
  | { kind: "ready"; status: Status }
  | { kind: "partial"; status: Status };

export function OfflineStatus() {
  const [view, setView] = useState<View>({ kind: "waiting" });
  const [asked, setAsked] = useState(false);

  const ask = useCallback(() => {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) return false;
    sw.postMessage({ type: "status" });
    return true;
  }, []);

  useEffect(() => {
    // Le service worker n'est enregistré qu'en production : en dev, personne
    // ne répondra jamais, autant le dire tout de suite.
    if (process.env.NODE_ENV !== "production") {
      setView({ kind: "unsupported" });
      return;
    }
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      setView({ kind: "unsupported" });
      return;
    }

    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== "status") return;
      const status: Status | null = e.data.status;
      if (!status) return;
      setView({ kind: status.complete ? "ready" : "partial", status });
    }

    navigator.serviceWorker.addEventListener("message", onMessage);

    // Le contrôleur peut arriver après le premier rendu (première visite).
    if (!ask()) {
      navigator.serviceWorker.ready.then(() => ask()).catch(() => setView({ kind: "unsupported" }));
    }

    // Tant que le préchargement tourne, on redemande.
    const timer = window.setInterval(ask, 2000);
    const stop = window.setTimeout(() => window.clearInterval(timer), 120_000);
    // Aucune réponse au bout de 10 s : le worker ne contrôle pas encore la
    // page (première visite). Un rechargement suffit, on le dit plutôt que
    // de laisser tourner « Vérification… ».
    const giveUp = window.setTimeout(() => {
      setView((v) => (v.kind === "waiting" ? { kind: "unsupported" } : v));
    }, 10_000);

    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
      window.clearInterval(timer);
      window.clearTimeout(stop);
      window.clearTimeout(giveUp);
    };
  }, [ask]);

  function precacheNow() {
    setAsked(true);
    navigator.serviceWorker?.controller?.postMessage({ type: "check-update" });
    window.setTimeout(ask, 1500);
  }

  return (
    <section className="border-t border-border pt-4">
      <h2 className="mb-1 text-sm font-semibold text-fg-muted">Hors ligne</h2>

      {view.kind === "unsupported" && (
        <p className="text-sm text-fg-muted">
          Pas d&apos;information : le cache hors ligne n&apos;est actif que sur le site déployé, et
          seulement une fois la page rechargée après la première visite.
        </p>
      )}

      {view.kind === "waiting" && <p className="text-sm text-fg-muted">Vérification…</p>}

      {view.kind === "ready" && (
        <p className="rounded-lg border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">
          Prêt : {view.status.totalRoutes} pages et {view.status.totalAssets} fichiers sont sur
          l&apos;appareil. Tous les chapitres s&apos;ouvrent sans réseau.
        </p>
      )}

      {view.kind === "partial" && (
        <div className="flex flex-col gap-2">
          <p className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
            Préchargement incomplet : {view.status.routes}/{view.status.totalRoutes} pages.
            Reste connecté quelques secondes.
          </p>
          <Button onClick={precacheNow} disabled={asked}>
            {asked ? "Préchargement lancé…" : "Précharger maintenant"}
          </Button>
        </div>
      )}
    </section>
  );
}
