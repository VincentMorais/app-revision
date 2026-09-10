# Plan des chapitres

Dérivé de `referentiel-poste-java-react.md`. Un chapitre = un fichier `content/<parcours>/<chapitre>.ts`
exportant `chapter`, enregistré dans `content/<parcours>/index.ts` puis `content/index.ts`.
Les ids sont fixés ici pour que les prérequis puissent être renseignés. L'index refuse un prérequis
inconnu : ne référencer que des chapitres déjà enregistrés.

Légende : ★ chapitre étalon, ✔ écrit, ☐ à écrire. Ordre = ordre du référentiel, du plus simple au plus complexe.

## Parcours

| id | Titre | Icône |
|---|---|---|
| `java` | Java | ☕ |
| `spring` | Spring Boot | ☘ |
| `tests` | Tests | 🧪 |
| `docker` | Docker | 🐳 |
| `archi` | Architecture | ⬡ |
| `data` | SQL et Postgres | 🐘 |
| `react` | React | ⚛ |
| `devops` | Git et GitLab CI | 🦊 |

## Chapitres écrits (lot 1, dans l'ordre demandé)

| # | id | Parcours | Titre | Prérequis | Réf. |
|---|---|---|---|---|---|
| 1 | `java-fondamentaux` ✔ | java | Fondamentaux : primitifs, String, passage par valeur, final | — | 1.1 |
| ★ | `java-interfaces-classes-abstraites` ✔ | java | Interfaces et classes abstraites | — | 1.2 |
| 2 | `java-equals-hashcode-comparable` ✔ | java | equals/hashCode, Comparable vs Comparator, record, enum | `java-interfaces-classes-abstraites` | 1.2 |
| 3 | `java-collections` ✔ | java | Collections : List, Set, Map, HashMap interne | `java-equals-hashcode-comparable` | 1.3 |
| 4 | `java-exceptions` ✔ | java | Exceptions : checked/unchecked, try-with-resources | `java-fondamentaux` | 1.4 |
| 5 | `java-lambdas-streams` ✔ | java | Lambdas, Stream API, Optional | `java-collections` | 1.5 |
| 6 | `spring-ioc` ✔ | spring | IoC, beans, injection, scopes | `java-interfaces-classes-abstraites` | 2.1 |
| 7 | `spring-rest` ✔ | spring | REST : contrôleurs, DTO, validation, erreurs | `spring-ioc` | 2.3 |
| 8 | `spring-jpa` ✔ | spring | JPA : entités, relations, LAZY/EAGER, N+1 | `spring-ioc`, `java-equals-hashcode-comparable` | 3.5, 2.4 |
| 9 | `spring-transactions` ✔ | spring | Transactions et persistence context | `spring-jpa` | 2.4, 3.5 |
| 10 | `tests-tdd` ✔ | tests | TDD : cycle, JUnit 5, Mockito, Testcontainers | `spring-ioc` | 5.1–5.3 |
| 11 | `docker-bases` ✔ | docker | Images, Dockerfile, multi-stage, compose | — | 7.1–7.3 |
| 12 | `archi-hexagonale` ✔ | archi | Architecture hexagonale : ports, adapters, SOLID | `spring-ioc` | 4.1, 4.2, 4.3 (SOLID) |
| 13 | `data-sql-postgres` ✔ | data | SQL et Postgres : jointures, index, EXPLAIN | — | 3.1–3.4 |
| 14 | `react-hooks` ✔ | react | React : hooks, état, re-renders | — | 6.2 |
| 15 | `devops-git-gitlab-ci` ✔ | devops | Git et GitLab CI : pipeline, cache, artifacts | `docker-bases` | 8.1, 8.2 |

## Chapitres restants (lot 2, à la demande)

| id | Parcours | Titre | Prérequis | Réf. |
|---|---|---|---|---|
| `java-moderne` ☐ | java | var, text blocks, record avancé, sealed, pattern matching, java.time | `java-lambdas-streams` | 1.5 |
| `java-concurrence` ☐ | java | Threads, ExecutorService, CompletableFuture, collections concurrentes, virtual threads | `java-lambdas-streams` | 1.6 (P2) |
| `java-jvm` ☐ | java | Mémoire, GC, OOM vs SOE, classloading | `java-fondamentaux` | 1.7 (P2) |
| `spring-configuration` ☐ | spring | yml, profils, @ConfigurationProperties, précédence, secrets | `spring-ioc` | 2.2 |
| `spring-security` ☐ | spring | Filtres, JWT, OAuth2/OIDC, @PreAuthorize, BCrypt, CSRF | `spring-rest` | 2.5 (P2) |
| `spring-autour` ☐ | spring | Actuator, logging/MDC, cache, @Scheduled/@Async, RestClient, events, AOP | `spring-ioc` | 2.6 (P2/P3) |
| `spring-migrations` ☐ | spring | Flyway/Liquibase, versioning, migrations en équipe | `spring-jpa` | 3.5 |
| `tests-strategie` ☐ | tests | Pyramide vs trophy, couverture, mutation testing, tests de contrat | `tests-tdd` | 5.4 (P2) |
| `docker-registry` ☐ | docker | Tags, push/pull, registry GitLab, scan | `docker-bases` | 7.4 (P2) |
| `archi-ddd-patterns` ☐ | archi | DDD tactique, Clean vs Onion, patterns GoF utiles, anti-patterns | `archi-hexagonale` | 4.3 (P2) |
| `archi-applicative` ☐ | archi | Monolithe vs microservices, sync/async, retry/circuit breaker, cache, observabilité | `spring-rest` | 9.2 (P2) |
| `data-sql-avance` ☐ | data | Fonctions fenêtre avancées, CTE récursives, jsonb, types | `data-sql-postgres` | 3.1 |
| `react-js-ts` ☐ | react | ES6+, asynchrone, TypeScript | — | 6.1 |
| `react-etat-data` ☐ | react | Context/Redux/Zustand, TanStack Query, React Router, error boundaries | `react-hooks` | 6.2 |
| `react-ecosysteme` ☐ | react | Vite, Vitest + RTL, ESLint, appels API et token, accessibilité | `react-hooks` | 6.3 (P2) |
| `devops-git-workflow` ☐ | devops | GitFlow / trunk-based, revue de code, SonarQube, semver | `devops-git-gitlab-ci` | 8.1, 8.3 |
| `transverse-http-api` ☐ | (à créer) | Méthodes, idempotence, codes, headers, REST/Richardson, auth | — | 9.1 |
| `transverse-entretien` ☐ | (à créer) | Agile, estimation, code review, ADR, présenter un projet, live coding | — | 9.3, 9.4 |

## Règles éditoriales (vérifiées par `content/__tests__/content.test.ts` via `lib/content-rules.ts`)

- Leçon : 150 à 300 mots hors code, un concept, au moins un bloc de code commenté, lignes ≤ 55 caractères.
- Chaque leçon est suivie de 3 à 8 exercices sur ce qui vient d'être lu. 30 exercices par chapitre.
- Chaque chapitre couvre les 7 types et compte au moins 5 rappels libres.
- QCM / sortie : 4 choix distincts. Trous : autant de `{{n}}` que de `blanks`, distracteurs ≠ réponses, un seul token valide par blanc.
- Repérage d'erreur : ligne non ambiguë. Association : gauches et droites distinctes.
- Ids en kebab-case : `<prefixe>-l1`…`-l4` pour les leçons, `<prefixe>-01`…`-30` pour les exercices. Uniques sur tout le contenu.
- Tags en kebab-case, réutilisés d'un chapitre à l'autre.
- Le test valide tout fichier `content/*/*.ts` présent sur le disque, enregistré ou non.
