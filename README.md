# Révision technique

Application mobile-first de révision (Java / Spring Boot / Postgres / React / Docker / GitLab CI /
architecture hexagonale / TDD), dans l'esprit de Duolingo. Tout tourne côté client, hors ligne une
fois chargée, sans backend ni compte.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Progression dans `localStorage`, derrière `lib/storage.ts`
- Tests unitaires du moteur avec Vitest
- Déployable sur Vercel sans configuration

## Commandes

```bash
npm run dev     # serveur de dev
npm test        # tests unitaires (moteur)
npm run lint
npm run build   # métadonnées + build + génération de public/precache.json
npm run content:meta  # régénère content/generated après un changement de contenu
npm run icons   # régénère les PNG de la PWA depuis public/icon.svg
```

## Structure

```
app/
  (tabs)/         accueil, apprendre (liste), erreurs, stats — avec la navigation basse
  apprendre/[id]  session d'apprentissage d'un chapitre (statique, généré au build)
  reviser/        session de révision (items dus, sans leçon)
  rejouer/        rejouer une liste d'exercices : /rejouer?ids=a,b,c
  demo/           bac à sable des 7 types d'exercice
components/
  CodeBlock       code coloré (lib/highlight.ts), défilement horizontal, lignes tactiles, blancs {{n}}
  exercises/      un composant par type + ExerciseView (aiguillage) ; contrat commun dans shared.tsx
  session/        SessionRunner (leçon → exercice → explication → récapitulatif), ExplanationPanel, SessionSummary
  lesson/         LessonView : rendu des blocs text / code / callout / comparison
  nav/            BottomNav
content/        contenu pédagogique typé, un fichier par chapitre — jamais dans les composants
  registry.ts       la liste ordonnée des parcours, sans import de contenu
  generated/        métadonnées et table des chargeurs (générés, versionnés)
  full.ts           chargement du contenu complet, à la demande et par chapitre
lib/
  types.ts      Course → Chapter → Unit (Lesson | Exercise), 7 types d'exercices
  content.ts    index en lecture seule sur les parcours (ids, ordre, rattachements)
  srs.ts        répétition espacée (SM-2 simplifié)
  grading.ts    correction des exercices auto-corrigés (verdict + détail + feedback)
  prepare.ts    vues mélangées déterministes (choix, tokens, ordre, paires) → indices d'origine
  highlight.ts  coloration syntaxique sans dépendance
  session.ts    deux modes : apprentissage (linéaire, leçon puis exercices) et révision (items dus)
  progress.ts   accès (validation stable à 70 %) séparé de la maîtrise (variable)
  stats.ts      taux par parcours / par tag, notions les plus fragiles
  streak.ts     série de jours consécutifs
  engine.ts     écritures : enregistrer une réponse, marquer une leçon lue
  store.ts      liaison React (useAppState, useMounted, actions) — seul point d'écriture depuis l'UI
  storage.ts    SEUL module qui touche localStorage
public/sw.js    service worker : préchargement complet pour le hors ligne (production)
scripts/
  gen-precache.mjs  écrit public/precache.json après le build (pages + assets)
  gen-icons.mjs     génère les PNG de la PWA depuis public/icon.svg
```

## Moteur d'apprentissage

**Répétition espacée (`lib/srs.ts`).** Chaque exercice a un état : facilité (1.3–3.0), intervalle
en jours, réussites consécutives, oublis, date de prochaine révision.

| Réponse | Effet |
|---------|-------|
| `again` | reps = 0, intervalle = 0, dû immédiatement, facilité − 0.2 |
| `hard`  | intervalle × 1.2 (min +1 j), facilité − 0.15 |
| `good`  | 1 j → 3 j → intervalle × facilité, facilité + 0.1 |

Niveaux de maîtrise dérivés : `new` (jamais vu), `fragile` (raté, ou une seule réussite depuis un
oubli), `learning`, `acquired` (intervalle ≥ 21 j). Les items dus sont triés fragile > learning >
acquis, puis par retard relatif.

**Deux modes (`lib/session.ts`).**
- *Apprentissage* : parcours linéaire d'un chapitre, leçon puis exercices portant sur ce qui vient
  d'être lu. Reprend au premier élément pas encore fait, en réaffichant la leçon du bloc en cours.
- *Révision* : items dus par répétition espacée, tous chapitres ouverts confondus, sans leçon.
  12 items par défaut (bornes 10–15), les plus urgents d'abord, puis mélange déterministe par jour.
- *Rejouer* : liste explicite d'exercices (journal d'erreurs, fin de session).

**Accès et maîtrise (`lib/progress.ts`).** Deux notions séparées. La *maîtrise* d'un chapitre est
la part de ses exercices dont la dernière réponse est juste : elle monte et redescend, s'affiche et
alimente la révision. L'*accès* est stable : un chapitre est validé la première fois que sa maîtrise
atteint 70 % (`state.validatedChapters`) et ne se referme jamais. Un chapitre s'ouvre quand tous
ses prérequis sont validés.

**Statistiques (`lib/stats.ts`).** Tout est dérivé du journal `attempts`. Les réponses `hard` du rappel
libre comptent comme justes mais sont comptabilisées à part (colonne `hard`). Pas de points, pas de
badges.

## Écrans

- **Accueil** : « Réviser le jour » (nombre d'items dus) et « Apprendre » (prochain chapitre), série,
  parcours avec anneau de maîtrise.
- **Apprendre** : chapitres ouverts / verrouillés / validés, avancement en unités et maîtrise.
- **Session** : une question par écran, barre de progression, explication après chaque réponse,
  passage à la suite par tap volontaire. Chaque réponse est enregistrée dès la validation.
- **Fin de session** : justes / laborieuses / fausses, liste à retravailler, « Revoir mes erreurs »
  relance immédiatement les items ratés.
- **Journal d'erreurs** : notions fragiles, erreurs des 7 derniers jours, items dont la dernière
  réponse est fausse — chacun rejouable isolément.
- **Statistiques** : réponses, série, taux par parcours et par notion (avec le compte des
  réponses laborieuses), notions les plus ratées. Réinitialisation avec confirmation.

## Chargement du contenu

Le contenu pèse près d'un mégaoctet, dont **88 % de corps** — blocs de leçon,
code, choix, explications. Or les écrans qui listent, comptent et calculent la
progression n'ont besoin que des identifiants, types, tags et énoncés.

Le contenu est donc coupé en deux. `content/generated/meta.ts` porte les
métadonnées (138 ko) et se charge avec l'application ; les corps restent dans
`content/<parcours>/<chapitre>.ts` et sont importés **dynamiquement, chapitre
par chapitre**, au moment d'entrer en session (`content/full.ts`, monté par
`components/session/SessionContent.tsx`). Le bundler en fait autant de morceaux
séparés, tous préchargés par le service worker : le hors ligne reste complet.

Effet sur la page chapitre : **454 ko → 152 ko** de JS au premier chargement.

Les deux fichiers de `content/generated/` sont produits par
`scripts/gen-content-meta.mjs` avant `next build`, et versionnés pour que les
tests tournent sans build préalable. `content/__tests__/content.test.ts`
compare les métadonnées générées à celles dérivées des fichiers de chapitre :
toute dérive fait échouer les tests.

Les types complets étendent les types de métadonnées (`Lesson = LessonMeta &
{ blocks }`), si bien qu'un `Exercise` reste utilisable partout où un
`ExerciseMeta` est attendu.

## Hors ligne et installation

L'app est une PWA installable (« Ajouter à l'écran d'accueil »), en mode
standalone, thème sombre. Icônes PNG 192/512, variante maskable pour Android,
`apple-touch-icon` 180 pour iOS — générées par `npm run icons`.

Le service worker ne se contente pas de mettre en cache ce qui a été visité :
**il précharge tout à l'installation**, pour pouvoir réviser sans réseau un
chapitre jamais ouvert. La liste vient de `public/precache.json`, écrit par
`scripts/gen-precache.mjs` juste après le build à partir de ce que Next a
réellement produit (`.next/BUILD_ID`, `prerender-manifest.json`,
`.next/static/**`) — et non d'une analyse du HTML, qui rate les chunks dont le
nom contient des parenthèses (`app/(tabs)/…`) ou des crochets
(`app/apprendre/[chapterId]/…`).

Le nom du cache est l'identifiant du build : un nouveau déploiement recharge
tout et purge l'ancien cache sans qu'il faille modifier `sw.js`. L'onglet
Statistiques affiche l'état du préchargement (« Prêt : 22 pages et 34
fichiers »), à vérifier avant de partir sans réseau.

## Persistance

`lib/storage.ts` expose `loadState`, `saveState`, `updateState`, `resetState`, `subscribe`. L'état
est versionné (`version: 2`, migration depuis v1) et validé champ par champ au chargement : une donnée corrompue est
ignorée, jamais fatale. Le journal est borné à 5000 réponses. `configureStorage(backend)` permet
de substituer le support (tests, futur backend).

`lib/backup.ts` ajoute l'export et l'import d'un fichier JSON (bouton dans
Statistiques) : c'est la seule façon de ne pas perdre sa progression en
changeant d'appareil. L'import valide le fichier, montre ce qu'il contient
face à la progression en place, et attend une confirmation.

## Contenu

Un fichier par chapitre dans `content/<parcours>/`, enregistré dans `content/<parcours>/index.ts` puis
dans `content/index.ts`. Chaque
leçon fait 150–300 mots, un concept, un exemple de code commenté, suivie de 3 à 8 exercices.
Chaque exercice a une explication (affichée juste ou faux), une difficulté 1–3 et des tags.

**29 chapitres, 792 exercices**, sur 9 parcours : Java (9 chapitres), Spring Boot (8), Transverse (2), SQL et Postgres,
Architecture, Tests (2), Docker (2), React (3), Git et GitLab CI. Le programme complet est dans
`referentiel-poste-java-react.md`. Le découpage en chapitres, leurs ids
et leurs prérequis sont dans `content/PLAN.md` ; les règles éditoriales sont vérifiées par
`content/__tests__/content.test.ts`. Chapitre étalon du format `detaille` : `content/spring/security.ts` (8 leçons, 24 exercices).
Les 16 premiers chapitres sont encore au format `compact` ; étalon : `content/java/interfaces-classes-abstraites.ts`.
