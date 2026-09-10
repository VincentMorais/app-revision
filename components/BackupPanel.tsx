"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { backupFilename, parseBackup, serializeBackup, summarize, type BackupSummary } from "@/lib/backup";
import { actions, useAppState } from "@/lib/store";
import type { AppState } from "@/lib/storage";

/**
 * Export / import de la progression.
 *
 * L'export télécharge un fichier JSON. L'import ne remplace jamais la
 * progression directement : il lit le fichier, montre ce qu'il contient face
 * à ce qui est en place, et attend une confirmation explicite.
 */

type Pending = { state: AppState; incoming: BackupSummary; current: BackupSummary; name: string };

function fmtDate(ts: number | null): string {
  if (ts === null) return "date inconnue";
  return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function BackupPanel() {
  const state = useAppState();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function exportNow() {
    setError(null);
    setDone(null);
    try {
      const now = Date.now();
      const blob = new Blob([serializeBackup(state, now)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFilename(now);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Laisser le temps au téléchargement de démarrer avant de libérer l'URL.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setDone("Sauvegarde téléchargée.");
    } catch {
      setError("Le téléchargement a échoué. Vérifie les autorisations du navigateur.");
    }
  }

  async function onFile(file: File) {
    setError(null);
    setDone(null);
    setPending(null);
    let text: string;
    try {
      text = await file.text();
    } catch {
      setError("Impossible de lire le fichier.");
      return;
    }
    const result = parseBackup(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPending({
      state: result.state,
      incoming: result.summary,
      current: summarize(state, null),
      name: file.name,
    });
  }

  function confirmImport() {
    if (!pending) return;
    actions.restore(pending.state);
    setPending(null);
    setDone("Progression restaurée.");
  }

  return (
    <section className="border-t border-border pt-4">
      <h2 className="mb-1 text-sm font-semibold text-fg-muted">Sauvegarde</h2>
      <p className="mb-3 text-sm text-fg-muted">
        La progression n&apos;existe que sur cet appareil. Exporte-la avant de changer de téléphone ou
        d&apos;effacer les données du navigateur.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={exportNow}>Exporter</Button>
        <Button onClick={() => inputRef.current?.click()}>Importer</Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Remettre à zéro : réimporter deux fois le même fichier doit marcher.
          e.target.value = "";
          if (file) void onFile(file);
        }}
      />

      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-ko/40 bg-ko/10 px-3 py-2 text-sm text-ko">
          {error}
        </p>
      )}

      {done && !pending && (
        <p role="status" className="mt-3 rounded-lg border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">
          {done}
        </p>
      )}

      {pending && (
        <div className="mt-3 flex flex-col gap-3 rounded-lg border border-warn/40 bg-warn/10 p-3">
          <div>
            <p className="text-sm font-semibold text-warn">Remplacer la progression actuelle ?</p>
            <p className="mt-1 text-xs text-fg-muted">
              {pending.name} · exporté le {fmtDate(pending.incoming.exportedAt)}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead className="text-xs text-fg-muted">
              <tr>
                <th className="text-left font-normal">&nbsp;</th>
                <th className="text-right font-normal">Actuel</th>
                <th className="text-right font-normal">Fichier</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Réponses" a={pending.current.attempts} b={pending.incoming.attempts} />
              <CompareRow label="Exercices suivis" a={pending.current.items} b={pending.incoming.items} />
              <CompareRow label="Leçons lues" a={pending.current.lessonsRead} b={pending.incoming.lessonsRead} />
              <CompareRow label="Chapitres validés" a={pending.current.validatedChapters} b={pending.incoming.validatedChapters} />
              <CompareRow label="Série (jours)" a={pending.current.streak} b={pending.incoming.streak} />
            </tbody>
          </table>

          <p className="text-xs text-fg-muted">
            L&apos;import écrase entièrement la progression actuelle. Elle n&apos;est pas récupérable ensuite.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setPending(null)}>Annuler</Button>
            <Button variant="warn" onClick={confirmImport}>
              Remplacer
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function CompareRow({ label, a, b }: { label: string; a: number; b: number }) {
  return (
    <tr className="border-t border-border">
      <td className="py-1.5 pr-2">{label}</td>
      <td className="py-1.5 text-right tabular-nums text-fg-muted">{a}</td>
      <td className="py-1.5 text-right font-semibold tabular-nums">{b}</td>
    </tr>
  );
}
