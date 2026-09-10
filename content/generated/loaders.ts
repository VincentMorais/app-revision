/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Produit par scripts/gen-content-meta.mjs, lancé avant `next build`.
 * La dérive est détectée par content/__tests__/content.test.ts.
 */

import type { Chapter } from "@/lib/types";

/** Un import dynamique par chapitre : le bundler en fait autant de morceaux. */
export const chapterLoaders: Record<string, () => Promise<{ chapter: Chapter }>> = {
  "archi-hexagonale": () => import("../archi/hexagonale"),
  "data-sql-postgres": () => import("../data/sql-postgres"),
  "devops-git-gitlab-ci": () => import("../devops/git-gitlab-ci"),
  "docker-bases": () => import("../docker/bases"),
  "java-collections": () => import("../java/collections"),
  "java-concurrence": () => import("../java/concurrence"),
  "java-equals-hashcode-comparable": () => import("../java/equals-hashcode-comparable"),
  "java-exceptions": () => import("../java/exceptions"),
  "java-fondamentaux": () => import("../java/fondamentaux"),
  "java-interfaces-classes-abstraites": () => import("../java/interfaces-classes-abstraites"),
  "java-lambdas-streams": () => import("../java/lambdas-streams"),
  "java-moderne": () => import("../java/moderne"),
  "react-etat-data": () => import("../react/etat-data"),
  "react-hooks": () => import("../react/hooks"),
  "react-js-ts": () => import("../react/js-ts"),
  "spring-configuration": () => import("../spring/configuration"),
  "spring-ioc": () => import("../spring/ioc"),
  "spring-jpa": () => import("../spring/jpa"),
  "spring-rest": () => import("../spring/rest"),
  "spring-security": () => import("../spring/security"),
  "spring-transactions": () => import("../spring/transactions"),
  "tests-tdd": () => import("../tests/tdd"),
  "transverse-entretien": () => import("../transverse/entretien"),
  "transverse-http-api": () => import("../transverse/http-api"),
};
