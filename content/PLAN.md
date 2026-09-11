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
| ★ | `react-ecosysteme` ✔ | react | Vite, tests de composants, ce qu'il faut tester, MSW, règles d'analyse, appels API et jeton, accessibilité, formulaires — **format `detaille`** | `react-hooks` | 6.3 |
| ★ | `data-sql-avance` ✔ | data | Fonctions fenêtre, cadre, CTE, récursivité, jsonb, index GIN, types, quand ne pas utiliser jsonb — **format `detaille`** | `data-sql-postgres` | 3.1 |
| ★ | `archi-applicative` ✔ | archi | Découpage et déploiement, coût du réseau, sync/async, reprises et idempotence, disjoncteur, cache, cohérence éventuelle, observabilité — **format `detaille`** | `spring-rest` | 9.2 |
| ★ | `archi-ddd-patterns` ✔ | archi | Langage partagé, entité et objet-valeur, agrégat, dépôt, services, hexagonale/Clean/Onion, patrons, anti-patrons — **format `detaille`** | `archi-hexagonale` | 4.3 |
| ★ | `docker-registry` ✔ | docker | Couches et digests, tags, registre, CI GitLab, taille, analyse, signature, rétention — **format `detaille`** | `docker-bases` | 7.4 |
| ★ | `tests-strategie` ✔ | tests | Propriétés en tension, pyramide et trophée, comportement contre implémentation, couverture, mutation, doublures, contrats — **format `detaille`** | `tests-tdd` | 5.4 |
| ★ | `spring-migrations` ✔ | spring | Versionner le schéma, Flyway, migrations sûres, données par lots, étendre-puis-contracter, équipe, ddl-auto — **format `detaille`** | `spring-jpa` | 3.5 |
| ★ | `spring-autour` ✔ | spring | Actuator, sondes, journalisation et MDC, cache, planification, @Async, événements, AOP — **format `detaille`** | `spring-ioc` | 2.6 |
| ★ | `java-jvm` ✔ | java | Zones mémoire, pile et tas, atteignabilité et générations, collecteurs, fuites, chargement de classes, diagnostic — **format `detaille`** | `java-fondamentaux` | 1.7 |
| ★ | `react-js-ts` ✔ | react | Portée, déstructuration, this, modules, boucle d'événements, promesses, TypeScript structurel, any/unknown/never — **format `detaille`** | — | 6.1 |
| ★ | `java-concurrence` ✔ | java | Atomicité et visibilité, verrous, atomiques, collections concurrentes, exécuteurs, CompletableFuture, threads virtuels, interblocages — **format `detaille`** | `java-lambdas-streams` | 1.6 |
| ★ | `react-etat-data` ✔ | react | État dérivé, contexte et ses limites, magasins, cache serveur, mutations, routage, frontières d'erreur — **format `detaille`** | `react-hooks` | 6.2 |
| ★ | `java-moderne` ✔ | java | var, blocs de texte, record et constructeur compact, sealed, filtrage par motif, switch, java.time — **format `detaille`** | `java-lambdas-streams` | 1.5 |
| ★ | `spring-configuration` ✔ | spring | Configuration : sources, précédence, YAML, profils, liaison typée, validation, secrets — **format `detaille`** | `spring-ioc` | 2.2 |
| ★ | `spring-security` ✔ | spring | Sécurité : filtres, BCrypt, session/stateless, JWT, OAuth2/OIDC, autorisation, CSRF — **format `detaille`, chapitre étalon** | `spring-rest` | 2.5 |
| ★ | `transverse-http-api` ✔ | transverse | HTTP et conception d'API : méthodes, idempotence, codes, en-têtes, cache, Richardson, URL, erreurs — **format `detaille`** | — | 9.1 |
| ★ | `transverse-entretien` ✔ | transverse | Entretien : se présenter, présenter un projet, ADR, revue de code, agile, estimation, live coding — **format `detaille`** | — | 9.3, 9.4 |
| 10 | `tests-tdd` ✔ | tests | TDD : cycle, JUnit 5, Mockito, Testcontainers | `spring-ioc` | 5.1–5.3 |
| 11 | `docker-bases` ✔ | docker | Images, Dockerfile, multi-stage, compose | — | 7.1–7.3 |
| 12 | `archi-hexagonale` ✔ | archi | Architecture hexagonale : ports, adapters, SOLID | `spring-ioc` | 4.1, 4.2, 4.3 (SOLID) |
| 13 | `data-sql-postgres` ✔ | data | SQL et Postgres : jointures, index, EXPLAIN | — | 3.1–3.4 |
| 14 | `react-hooks` ✔ | react | React : hooks, état, re-renders | — | 6.2 |
| 15 | `devops-git-gitlab-ci` ✔ | devops | Git et GitLab CI : pipeline, cache, artifacts | `docker-bases` | 8.1, 8.2 |

## Chapitres restants (lot 2, à la demande)

| id | Parcours | Titre | Prérequis | Réf. |
|---|---|---|---|---|
| `devops-git-workflow` ☐ | devops | GitFlow / trunk-based, revue de code, SonarQube, semver | `devops-git-gitlab-ci` | 8.1, 8.3 |

## Règles éditoriales (vérifiées par `content/__tests__/content.test.ts` via `lib/content-rules.ts`)

Deux formats coexistent, portés par le champ `format` du chapitre. Les seuils
sont vérifiés selon ce champ.

### `detaille` — format courant, pour tout nouveau chapitre

Le format `compact` s'est révélé trop dense à l'usage : ~200 mots de cours pour
7 à 8 exercices, soit une règle énoncée mais jamais motivée. Le format
`detaille` explique avant d'interroger.

- **8 à 10 leçons** par chapitre, une par notion — le découpage suit la matière,
  pas un gabarit fixe.
- **500 à 900 mots** par leçon (code exclu), visant ~700, dans cet ordre :
  1. *Pourquoi ça existe* — le problème que ça résout, avant toute règle.
  2. *Le contre-exemple* — le code sans, et ce qui casse.
  3. *L'exemple* — le même code avec, et ce qu'on y gagne.
  4. *La règle* — l'énoncé précis, une fois le besoin compris.
  5. *La comparaison* — face à la notion voisine avec laquelle on la confond.
  6. *Les pièges* — cas limites et contre-exemples.
- Structure vérifiée mécaniquement : **≥ 2 blocs de code** (le contre-exemple
  puis l'exemple), **≥ 1 encadré**, **≥ 1 comparaison** par leçon.
- **3 à 5 exercices** par leçon seulement, portant sur cette notion précise.
- Le chapitre couvre les 7 types et compte au moins 5 rappels libres.

Une session d'apprentissage est plafonnée à 12 étapes (`LEARN_MAX_STEPS`) et
coupe de préférence juste avant une leçon : un chapitre se fait en plusieurs
fois, la reprise étant automatique.

### `compact` — format d'origine, en cours de reprise

Les 16 premiers chapitres sont encore à ce format et le restent tant qu'ils
n'ont pas été repris : 4 leçons de 150 à 300 mots, 7 à 8 exercices chacune,
30 exercices par chapitre, ≥ 1 bloc de code par leçon.

### Communes aux deux formats

- QCM / sortie : 4 choix distincts. Trous : autant de `{{n}}` que de `blanks`,
  distracteurs ≠ réponses, un seul token valide par blanc.
- Repérage d'erreur : ligne non ambiguë. Association : gauches et droites distinctes.
- Ids en kebab-case : `<prefixe>-l1`…`-l10` pour les leçons, `<prefixe>-01`…
  pour les exercices. Uniques sur tout le contenu.
- Chaque exercice a une explication (> 40 caractères), une difficulté 1–3 et
  des tags en kebab-case, réutilisés d'un chapitre à l'autre.
- Le test valide tout fichier `content/*/*.ts` présent sur le disque,
  enregistré ou non.
