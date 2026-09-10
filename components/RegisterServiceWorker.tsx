"use client";

import { useEffect } from "react";
import { listenToOtherTabs } from "@/lib/storage";

/**
 * Enregistre le service worker (hors ligne) en production uniquement, et
 * synchronise l'état si un autre onglet écrit dans localStorage.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    const stop = listenToOtherTabs();
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // pas bloquant : l'app fonctionne sans cache hors ligne
      });
    }
    return stop;
  }, []);
  return null;
}
