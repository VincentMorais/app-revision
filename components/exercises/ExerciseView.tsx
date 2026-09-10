"use client";

import type { Exercise } from "@/lib/types";
import { FillView } from "./FillView";
import { MatchView } from "./MatchView";
import { McqView } from "./McqView";
import { OrderView } from "./OrderView";
import { RecallView } from "./RecallView";
import type { ExerciseComponentProps } from "./shared";
import { SpotView } from "./SpotView";

export const KIND_LABELS: Record<Exercise["kind"], string> = {
  mcq: "QCM",
  fill: "Trous dans le code",
  output: "Prédiction de sortie",
  spot: "Repérage d'erreur",
  order: "Remise en ordre",
  match: "Association",
  recall: "Rappel libre",
};

/** Aiguille vers le composant du type d'exercice. */
export function ExerciseView(props: ExerciseComponentProps) {
  const { exercise } = props;
  switch (exercise.kind) {
    case "mcq":
    case "output":
      return <McqView {...props} exercise={exercise} />;
    case "fill":
      return <FillView {...props} exercise={exercise} />;
    case "spot":
      return <SpotView {...props} exercise={exercise} />;
    case "order":
      return <OrderView {...props} exercise={exercise} />;
    case "match":
      return <MatchView {...props} exercise={exercise} />;
    case "recall":
      return <RecallView {...props} exercise={exercise} />;
  }
}
