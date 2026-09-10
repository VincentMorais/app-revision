"use client";

import { useEffect } from "react";
import { listenToOtherTabs } from "@/lib/storage";

/**
 * Enregistre le service worker (hors ligne) en production uniquement, et
 * synchronise l'état si un autre onglet écrit dans localStorage.
 *
 * `sw.js` ne change pas d'un déploiement à l'autre : c'est lui qui va lire
 * la version du build sur /precache. On le réveille à chaque chargement
 * pour qu'il repère un nouveau déploiement et reprécharge le contenu.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    const stop = listenToOtherTabs();
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          navigator.serviceWorker.controller?.postMessage({ type: "check-update" });
        })
        .catch(() => {
          // pas bloquant : l'app fonctionne sans cache hors ligne
        });
    }
    return stop;
  }, []);
  return null;
}
