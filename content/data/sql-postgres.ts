/**
 * SQL et Postgres (référentiel 3.1 à 3.4, hors JPA) : requêtes et jointures,
 * agrégations et fonctions fenêtre, modélisation et types, index et transactions.
 * 4 leçons, 30 exercices. Postgres 16.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Ordre d'évaluation et jointures
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "data-sql-l1",
  title: "Ordre d'évaluation et jointures",
  blocks: [
    {
      kind: "text",
      text: "Une requête ne s'exécute pas dans l'ordre où elle s'écrit. L'ordre **logique** est : `FROM` et les jointures, puis `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `DISTINCT`, `ORDER BY` et enfin `LIMIT`. C'est pourquoi un alias défini dans le `SELECT` est utilisable dans le `ORDER BY` mais pas dans le `WHERE`, évalué avant.",
    },
    {
      kind: "text",
      text: "Un `INNER JOIN` ne garde que les lignes appariées des deux côtés. Un `LEFT JOIN` garde toutes les lignes de gauche et complète avec des `NULL` à droite quand rien ne correspond.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le même filtre, deux résultats très différents.",
      code: `-- Le filtre est dans le WHERE : évalué APRÈS
-- la jointure, il élimine les lignes dont
-- statut est NULL. Le LEFT JOIN devient
-- un INNER JOIN.
SELECT c.nom, o.statut
FROM clients c
LEFT JOIN commandes o ON o.client_id = c.id
WHERE o.statut = 'payee';

-- Le filtre est dans le ON : il restreint
-- l'appariement, sans supprimer les clients
-- sans commande payée.
SELECT c.nom, o.statut
FROM clients c
LEFT JOIN commandes o
       ON o.client_id = c.id
      AND o.statut = 'payee';`,
    },
    {
      kind: "text",
      text: "C'est le piège le plus courant : un critère sur la table de droite placé dans le `WHERE` annule l'effet du `LEFT JOIN`, parce que `NULL = 'payee'` vaut **inconnu**, jamais vrai. Toute comparaison avec `NULL` renvoie inconnu, y compris `NULL = NULL` : il faut `IS NULL` et `IS NOT NULL`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`x NOT IN (sous-requête)` ne renvoie **aucune ligne** dès que la sous-requête contient un seul `NULL`. Préférer `NOT EXISTS`, insensible à ce problème.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "data-sql-01",
    difficulty: 2,
    tags: ["sql", "jointures", "null"],
    prompt: "Table `clients` : (1, Ana), (2, Bob). Table `commandes` : (10, client 1, 'payee'). Que renvoie la requête ?",
    code: {
      language: "sql",
      code: `SELECT c.nom, o.statut
FROM clients c
LEFT JOIN commandes o ON o.client_id = c.id
WHERE o.statut = 'payee';`,
    },
    choices: [
      "Une seule ligne : `Ana | payee`.",
      "Deux lignes : `Ana | payee` et `Bob | NULL`.",
      "Deux lignes : `Ana | payee` et `Bob | payee`.",
      "Aucune ligne : le `WHERE` est incompatible avec un `LEFT JOIN`.",
    ],
    answer: 0,
    explanation:
      "Le `LEFT JOIN` produit bien `Bob | NULL`, mais le `WHERE` s'applique **après** : `NULL = 'payee'` vaut inconnu, donc la ligne est écartée. Le `LEFT JOIN` se comporte alors comme un `INNER JOIN`. Pour garder Bob, déplacer le critère dans le `ON`.",
  },
  {
    kind: "output",
    id: "data-sql-02",
    difficulty: 3,
    tags: ["sql", "null", "sous-requetes"],
    prompt: "Table `a` : x = 1, 2, 3. Table `b` : y = 1, NULL. Que renvoie la requête ?",
    code: {
      language: "sql",
      code: `SELECT x FROM a
WHERE x NOT IN (SELECT y FROM b);`,
    },
    choices: [
      "Aucune ligne.",
      "Les lignes 2 et 3.",
      "Les lignes 1, 2 et 3.",
      "Une erreur : `NOT IN` refuse les valeurs `NULL`.",
    ],
    answer: 0,
    explanation:
      "`2 NOT IN (1, NULL)` se développe en `2 <> 1 AND 2 <> NULL`, soit `vrai AND inconnu`, donc **inconnu** : la ligne n'est pas retenue, puisque seul `vrai` l'est. Même sort pour 3, et 1 est exclu à juste titre. Résultat : rien. `NOT EXISTS (SELECT 1 FROM b WHERE b.y = a.x)` renverrait 2 et 3.",
  },
  {
    kind: "mcq",
    id: "data-sql-03",
    difficulty: 2,
    tags: ["sql", "ordre-logique"],
    prompt: "Pourquoi `SELECT total * 2 AS double FROM t WHERE double > 10` échoue-t-il ?",
    choices: [
      "Le `WHERE` est évalué avant le `SELECT` : l'alias `double` n'existe pas encore.",
      "`double` est un mot réservé et ne peut pas servir d'alias.",
      "Un alias doit être entouré de guillemets pour être réutilisable.",
      "Il manque un `GROUP BY` dès qu'un calcul apparaît dans le `SELECT`.",
    ],
    answer: 0,
    explanation:
      "L'ordre logique place `WHERE` avant `SELECT` : au moment du filtrage, l'alias n'est pas défini. Il faut répéter l'expression, `WHERE total * 2 > 10`, ou passer par une sous-requête ou une CTE. Un alias reste en revanche utilisable dans le `ORDER BY` et le `GROUP BY`, évalués après ou en même temps.",
  },
  {
    kind: "match",
    id: "data-sql-04",
    difficulty: 1,
    tags: ["sql", "jointures"],
    prompt: "Associe chaque jointure à son résultat.",
    pairs: [
      { left: "`INNER JOIN`", right: "Seulement les lignes appariées des deux côtés" },
      { left: "`LEFT JOIN`", right: "Toutes celles de gauche, `NULL` à droite si rien" },
      { left: "`FULL JOIN`", right: "Toutes les lignes des deux tables" },
      { left: "`CROSS JOIN`", right: "Le produit cartésien, sans condition" },
      { left: "Self-join", right: "Une table jointe à elle-même, via deux alias" },
    ],
    explanation:
      "Un `CROSS JOIN` sur deux tables de mille lignes en produit un million : c'est aussi ce qu'on obtient accidentellement en oubliant la condition de jointure. Le self-join sert aux hiérarchies, par exemple joindre `employes` à `employes` pour récupérer le nom du responsable.",
  },
  {
    kind: "fill",
    id: "data-sql-05",
    difficulty: 2,
    tags: ["sql", "jointures", "null"],
    prompt: "Complète pour lister les clients **sans aucune** commande.",
    code: {
      language: "sql",
      code: `SELECT c.nom
FROM clients c
{{1}} JOIN commandes o
     ON o.client_id = c.id
WHERE o.id {{2}} NULL;`,
    },
    blanks: ["LEFT", "IS"],
    distractors: ["INNER", "CROSS", "=", "<>"],
    explanation:
      "Le motif anti-jointure : un `LEFT JOIN` conserve les clients sans correspondance, dont les colonnes de droite valent `NULL`, puis `IS NULL` isole précisément ces lignes. `= NULL` ne renvoie jamais vrai. Un `INNER JOIN` aurait déjà supprimé ces clients.",
  },
  {
    kind: "spot",
    id: "data-sql-06",
    difficulty: 2,
    tags: ["sql", "jointures"],
    prompt: "Cette requête renvoie beaucoup trop de lignes. Trouve la ligne fautive.",
    code: {
      language: "sql",
      code: `SELECT c.nom, o.total
FROM clients c, commandes o
WHERE o.total > 100
ORDER BY o.total DESC;`,
    },
    faultyLine: 2,
    reasons: [
      "Deux tables listées sans condition de jointure : c'est un produit cartésien, chaque client est associé à chaque commande.",
      "L'ancienne syntaxe avec une virgule est interdite depuis Postgres 12.",
      "Le `WHERE` doit filtrer sur `c`, pas sur `o`.",
      "Il manque un `GROUP BY c.nom` puisque deux tables sont interrogées.",
    ],
    reasonAnswer: 0,
    explanation:
      "La virgule reste valide mais ne relie rien : sans `o.client_id = c.id`, chaque ligne de gauche est appariée à chaque ligne de droite. Avec mille clients et mille commandes, cela fait un million de lignes filtrées ensuite. La syntaxe explicite `JOIN ... ON` rend l'oubli impossible : c'est sa vraie valeur.",
  },
  {
    kind: "order",
    id: "data-sql-07",
    difficulty: 2,
    tags: ["sql", "ordre-logique"],
    prompt: "Remets dans l'ordre les étapes logiques d'exécution d'une requête.",
    items: [
      "`FROM` et les jointures : construire l'ensemble de départ",
      "`WHERE` : filtrer les lignes",
      "`GROUP BY` : regrouper",
      "`HAVING` : filtrer les groupes",
      "`SELECT` : calculer les colonnes et les alias",
      "`ORDER BY` puis `LIMIT` : trier et tronquer",
    ],
    explanation:
      "Cet ordre explique presque tous les messages d'erreur du débutant : pourquoi un alias n'est pas visible dans le `WHERE`, pourquoi filtrer sur un `COUNT` demande un `HAVING`, et pourquoi un `LIMIT` sans `ORDER BY` ne garantit rien du tout.",
  },
  {
    kind: "recall",
    id: "data-sql-08",
    difficulty: 2,
    tags: ["sql", "null"],
    prompt: "Comment `NULL` se comporte-t-il dans les comparaisons, et quels pièges cela crée-t-il ?",
    explanation:
      "`NULL` signifie « valeur inconnue », et toute comparaison avec lui renvoie **inconnu**, ni vrai ni faux : `NULL = 1`, `NULL <> 1` et même `NULL = NULL` valent inconnu. Comme un `WHERE` ne retient que ce qui est **vrai**, ces lignes disparaissent. Trois conséquences pratiques. Tester la nullité impose `IS NULL` ou `IS NOT NULL`. Un critère sur la table de droite placé dans le `WHERE` d'un `LEFT JOIN` supprime les lignes non appariées et annule la jointure externe. Et `NOT IN` avec une sous-requête contenant un `NULL` ne renvoie **jamais** rien : préférer `NOT EXISTS`. À l'inverse, les agrégats ignorent les `NULL` : `COUNT(colonne)` et `AVG` les sautent, et `COUNT(*)` compte les lignes. Deux `NULL` sont d'ailleurs considérés comme distincts par un index unique, mais égaux par `GROUP BY` et `DISTINCT`.",
    keyPoints: ["Comparaison → inconnu, jamais vrai", "`IS NULL`, pas `= NULL`", "`WHERE` sur la table droite annule un `LEFT JOIN`", "`NOT IN` + `NULL` → aucune ligne", "Les agrégats ignorent les `NULL`"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Agrégations, CTE et fonctions fenêtre
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "data-sql-l2",
  title: "Agrégations, CTE et fonctions fenêtre",
  blocks: [
    {
      kind: "text",
      text: "Un `GROUP BY` réduit chaque groupe à une ligne. Le `WHERE` filtre les lignes **avant** le regroupement, le `HAVING` filtre les groupes **après** : un critère sur un agrégat ne peut donc vivre que dans le `HAVING`. `COUNT(*)` compte les lignes, `COUNT(colonne)` ignore les `NULL`.",
    },
    {
      kind: "text",
      text: "Une **CTE** `WITH nom AS (...)` nomme un résultat intermédiaire et rend lisible une requête qui empilerait sinon les sous-requêtes. Ajouter `RECURSIVE` permet de parcourir une hiérarchie.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Une fonction fenêtre garde le détail, contrairement à un GROUP BY.",
      code: `-- GROUP BY : une ligne par client
SELECT client_id, SUM(total) AS ca
FROM commandes
GROUP BY client_id
HAVING SUM(total) > 1000;

-- Fenêtre : toutes les lignes, plus un rang
-- calculé par groupe
WITH classees AS (
  SELECT id, client_id, total,
         ROW_NUMBER() OVER (
           PARTITION BY client_id
           ORDER BY total DESC) AS rang
  FROM commandes
)
SELECT * FROM classees WHERE rang <= 3;`,
    },
    {
      kind: "text",
      text: "Une **fonction fenêtre** calcule sur un groupe de lignes sans les fusionner : chaque ligne conserve son détail et reçoit une valeur calculée. `PARTITION BY` définit les groupes, `ORDER BY` l'ordre à l'intérieur. C'est le seul moyen simple d'obtenir les N premiers **par groupe**. Comme elle est évaluée après le `WHERE`, il faut passer par une CTE pour filtrer sur son résultat.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "`ROW_NUMBER` numérote sans jamais répéter. En cas d'égalité, `RANK` donne le même rang puis saute (1, 1, 3), tandis que `DENSE_RANK` enchaîne sans trou (1, 1, 2).",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "data-sql-09",
    difficulty: 2,
    tags: ["sql", "agregations", "null"],
    prompt: "Table `notes` avec une colonne `note` valant 10, NULL, 20. Que renvoie la requête ?",
    code: {
      language: "sql",
      code: `SELECT COUNT(*), COUNT(note), AVG(note)
FROM notes;`,
    },
    choices: ["`3 | 2 | 15`", "`3 | 3 | 10`", "`2 | 2 | 15`", "`3 | 2 | 10`"],
    answer: 0,
    explanation:
      "`COUNT(*)` compte les lignes : 3. `COUNT(note)` ignore les `NULL` : 2. `AVG` les ignore aussi et divise par le nombre de valeurs réelles : (10 + 20) / 2 = 15, et non 30 / 3. C'est souvent le résultat voulu, mais il faut le savoir : pour traiter les `NULL` comme des zéros, il faut `AVG(COALESCE(note, 0))`.",
  },
  {
    kind: "output",
    id: "data-sql-10",
    difficulty: 2,
    tags: ["sql", "fonctions-fenetre"],
    prompt: "Trois lignes avec `score` valant 10, 10 et 8. Quels rangs produisent les trois fonctions, dans cet ordre ?",
    code: {
      language: "sql",
      code: `SELECT score,
       ROW_NUMBER() OVER (ORDER BY score DESC),
       RANK()       OVER (ORDER BY score DESC),
       DENSE_RANK() OVER (ORDER BY score DESC)
FROM scores;`,
    },
    choices: [
      "`1,2,3` puis `1,1,3` puis `1,1,2`",
      "`1,2,3` puis `1,1,2` puis `1,1,3`",
      "`1,1,2` puis `1,1,3` puis `1,2,3`",
      "`1,2,3` puis `1,2,3` puis `1,2,3`",
    ],
    answer: 0,
    explanation:
      "`ROW_NUMBER` numérote sans tenir compte des égalités : 1, 2, 3. `RANK` attribue le même rang aux ex æquo puis **saute** les rangs consommés : 1, 1, 3. `DENSE_RANK` ne saute rien : 1, 1, 2. Le choix compte pour un classement : « troisième » signifie autre chose selon la fonction retenue.",
  },
  {
    kind: "mcq",
    id: "data-sql-11",
    difficulty: 2,
    tags: ["sql", "agregations", "group-by"],
    prompt: "Où placer le critère « seulement les clients ayant plus de trois commandes » ?",
    choices: [
      "Dans un `HAVING COUNT(*) > 3`, après le `GROUP BY`.",
      "Dans le `WHERE`, avec `COUNT(*) > 3`.",
      "Dans le `ON` de la jointure.",
      "Dans le `SELECT`, avec un alias filtré ensuite.",
    ],
    answer: 0,
    explanation:
      "Le `WHERE` s'exécute avant le regroupement : les agrégats n'existent pas encore et Postgres refuse la requête. Le `HAVING` filtre les groupes une fois constitués. À ne pas confondre : `WHERE` pour les lignes, `HAVING` pour les groupes. Les deux peuvent coexister dans une même requête.",
  },
  {
    kind: "fill",
    id: "data-sql-12",
    difficulty: 2,
    tags: ["sql", "fonctions-fenetre", "cte"],
    prompt: "Complète pour obtenir les trois plus grosses commandes **de chaque** client.",
    code: {
      language: "sql",
      code: `{{1}} classees AS (
  SELECT id, client_id, total,
         ROW_NUMBER() {{2}} (
           {{3}} BY client_id
           ORDER BY total DESC) AS rang
  FROM commandes
)
SELECT * FROM classees WHERE rang <= 3;`,
    },
    blanks: ["WITH", "OVER", "PARTITION"],
    distractors: ["SELECT", "GROUP", "HAVING", "WINDOW"],
    explanation:
      "`WITH` ouvre la CTE, indispensable ici car une fonction fenêtre ne peut pas être filtrée dans le `WHERE` de la même requête, faute d'être calculée assez tôt. `OVER` introduit la fenêtre, `PARTITION BY` la découpe par client. Un `GROUP BY` réduirait à une ligne par client et ferait perdre le détail cherché.",
  },
  {
    kind: "spot",
    id: "data-sql-13",
    difficulty: 2,
    tags: ["sql", "group-by"],
    prompt: "Postgres refuse cette requête. Trouve la ligne fautive.",
    code: {
      language: "sql",
      code: `SELECT c.nom, o.statut, SUM(o.total)
FROM clients c
JOIN commandes o ON o.client_id = c.id
GROUP BY c.nom;`,
    },
    faultyLine: 1,
    reasons: [
      "`o.statut` est sélectionnée sans être ni agrégée ni présente dans le `GROUP BY`.",
      "`SUM` ne peut pas être combiné avec une jointure.",
      "Le `GROUP BY` doit porter sur `c.id`, jamais sur une colonne texte.",
      "`SELECT` ne peut pas mélanger deux tables dans une requête agrégée.",
    ],
    reasonAnswer: 0,
    explanation:
      "La règle : toute colonne du `SELECT` est soit agrégée, soit citée dans le `GROUP BY`. Ici Postgres ne peut pas choisir quel `statut` afficher pour un client qui en a plusieurs, et refuse avec « column o.statut must appear in the GROUP BY clause ». MySQL en mode permissif renvoie une valeur arbitraire, ce qui est bien pire.",
  },
  {
    kind: "recall",
    id: "data-sql-14",
    difficulty: 3,
    tags: ["sql", "fonctions-fenetre", "group-by"],
    prompt: "Quelle différence fondamentale entre un `GROUP BY` et une fonction fenêtre ?",
    explanation:
      "Un `GROUP BY` **réduit** : n lignes entrent, une seule sort par groupe, et le détail est perdu. Une fonction fenêtre **conserve** : chaque ligne reste, enrichie d'une valeur calculée sur un ensemble de lignes voisines défini par `OVER (PARTITION BY … ORDER BY …)`. D'où trois usages qu'un `GROUP BY` ne couvre pas. Le **top N par groupe** : numéroter avec `ROW_NUMBER` dans une CTE puis filtrer sur le rang. Le **comparatif ligne à ligne** : afficher le total d'une commande à côté de la moyenne de son client, sans perdre la commande. Et l'accès aux **lignes voisines** avec `LAG` et `LEAD`, pour calculer une variation d'un mois sur l'autre. Point à connaître : une fonction fenêtre est évaluée **après** le `WHERE` et le `GROUP BY`, elle ne peut donc pas être filtrée directement dans le `WHERE` de la même requête, d'où le passage par une CTE ou une sous-requête.",
    keyPoints: ["`GROUP BY` réduit, la fenêtre conserve", "Top N par groupe : `ROW_NUMBER` + CTE", "Détail et agrégat côte à côte", "`LAG` / `LEAD` pour les voisines", "Évaluée après le `WHERE` : filtrer via une CTE"],
  },
  {
    kind: "match",
    id: "data-sql-15",
    difficulty: 2,
    tags: ["sql", "fonctions-fenetre"],
    prompt: "Associe chaque fonction fenêtre à ce qu'elle produit.",
    pairs: [
      { left: "`ROW_NUMBER()`", right: "Un numéro unique, sans ex æquo" },
      { left: "`RANK()`", right: "Rangs égaux, puis saut (1, 1, 3)" },
      { left: "`DENSE_RANK()`", right: "Rangs égaux, sans saut (1, 1, 2)" },
      { left: "`LAG(x)`", right: "La valeur de la ligne précédente" },
      { left: "`LEAD(x)`", right: "La valeur de la ligne suivante" },
    ],
    explanation:
      "`LAG` et `LEAD` remplacent les auto-jointures pénibles pour comparer une ligne à sa voisine : évolution d'un chiffre d'affaires mensuel, délai entre deux commandes d'un même client. Toutes ces fonctions dépendent de l'`ORDER BY` de la fenêtre, à ne pas confondre avec celui de la requête.",
  },
  {
    kind: "recall",
    id: "data-sql-16",
    difficulty: 2,
    tags: ["sql", "cte"],
    prompt: "À quoi sert une CTE, et que change `RECURSIVE` ?",
    explanation:
      "Une **CTE** (`WITH nom AS (...)`) nomme un résultat intermédiaire réutilisable dans la requête principale. Son intérêt est d'abord la **lisibilité** : une requête à trois niveaux de sous-requêtes imbriquées devient une suite d'étapes nommées, lues de haut en bas. Elle permet aussi de référencer le même intermédiaire plusieurs fois sans le dupliquer. `WITH RECURSIVE` ajoute l'auto-référence : une partie d'**ancrage** fournit les lignes de départ, une partie **récursive** s'appuie sur le résultat de l'itération précédente, et l'union des deux s'arrête quand plus rien n'est produit. C'est la façon standard de parcourir une hiérarchie stockée en table plate : arbre de catégories, chaîne hiérarchique, décomposition de nomenclature. Attention à toujours prévoir une condition d'arrêt, une donnée cyclique bouclant indéfiniment. Depuis Postgres 12, une CTE non récursive est intégrée à la requête par défaut, donc optimisée globalement ; `MATERIALIZED` force le comportement inverse.",
    keyPoints: ["Nomme une étape, remplace les sous-requêtes imbriquées", "Réutilisable plusieurs fois", "`RECURSIVE` : ancrage + partie récursive", "Hiérarchies et arbres", "Risque de boucle sans condition d'arrêt"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Modélisation, contraintes et types
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "data-sql-l3",
  title: "Modélisation, contraintes et types Postgres",
  blocks: [
    {
      kind: "text",
      text: "Les contraintes sont la seule garantie réellement fiable : elles s'appliquent quel que soit le code qui écrit. `PRIMARY KEY` identifie, `FOREIGN KEY` relie et empêche les orphelins, `UNIQUE` interdit les doublons, `NOT NULL` impose la présence, `CHECK` valide une règle locale à la ligne.",
    },
    {
      kind: "text",
      text: "La normalisation élimine les redondances : la **1NF** interdit les valeurs multiples dans une colonne, la **2NF** que la clé soit partiellement déterminante, la **3NF** qu'une colonne dépende d'une autre colonne non clé. Une relation N-N passe toujours par une table de jonction. On dénormalise ensuite, sciemment, quand une lecture critique le justifie.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Types choisis pour ce qu'ils garantissent, pas par habitude.",
      code: `CREATE TABLE commandes (
  id          bigint GENERATED ALWAYS AS IDENTITY
              PRIMARY KEY,
  reference   text NOT NULL UNIQUE,
  client_id   bigint NOT NULL
              REFERENCES clients (id),
  -- jamais float pour de l'argent
  total       numeric(12, 2) NOT NULL
              CHECK (total >= 0),
  -- toujours timestamptz, pas timestamp
  creee_le    timestamptz NOT NULL DEFAULT now(),
  metadonnees jsonb
);

-- UPSERT : insérer ou mettre à jour
INSERT INTO stocks (sku, quantite)
VALUES ('A-1', 10)
ON CONFLICT (sku) DO UPDATE
SET quantite = stocks.quantite
             + EXCLUDED.quantite;`,
    },
    {
      kind: "text",
      text: "Côté types : `numeric` pour l'argent, jamais `float` dont les arrondis binaires faussent les totaux. `timestamptz` plutôt que `timestamp`, car il enregistre un instant absolu et gère les fuseaux. `identity` est la forme standard, préférable à `serial`. `jsonb` stocke du semi-structuré indexable, `text[]` un tableau.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "Dans `ON CONFLICT DO UPDATE`, le pseudo-enregistrement `EXCLUDED` désigne la ligne qui n'a pas pu être insérée : c'est ainsi qu'on combine l'ancienne et la nouvelle valeur.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "data-sql-17",
    difficulty: 1,
    tags: ["sql", "types"],
    prompt: "Quel type utiliser pour un montant en euros ?",
    choices: [
      "`numeric(12, 2)` : arithmétique décimale exacte.",
      "`double precision` : plus rapide et suffisamment précis.",
      "`real` : compact et adapté aux montants.",
      "`money` : le type dédié, portable entre bases.",
    ],
    answer: 0,
    explanation:
      "`double precision` et `real` sont des flottants binaires : 0.1 + 0.2 n'y vaut pas exactement 0.3, et l'écart s'accumule sur des milliers de lignes jusqu'à fausser un total comptable. `numeric` calcule en décimal exact. Le type `money` existe dans Postgres mais dépend d'un paramètre régional de la base et n'est pas recommandé.",
  },
  {
    kind: "mcq",
    id: "data-sql-18",
    difficulty: 2,
    tags: ["sql", "types"],
    prompt: "Quelle différence entre `timestamp` et `timestamptz` ?",
    choices: [
      "`timestamptz` désigne un instant absolu, converti depuis et vers le fuseau de la session ; `timestamp` est une date-heure sans fuseau, donc ambiguë.",
      "`timestamptz` stocke le fuseau d'origine dans la colonne, `timestamp` non.",
      "`timestamp` est plus précis, `timestamptz` arrondit à la seconde.",
      "Les deux sont identiques, `timestamptz` étant un simple alias.",
    ],
    answer: 0,
    explanation:
      "Précision utile : `timestamptz` ne **conserve pas** le fuseau d'origine. Il normalise en UTC à l'écriture et reconvertit à la lecture selon le fuseau de la session. `timestamp` est une date-heure « murale » sans référence : deux serveurs dans deux fuseaux l'interprètent différemment. Pour un instant réel, choisir `timestamptz` ; `timestamp` ne convient qu'à une date-heure locale par nature, comme un horaire d'ouverture.",
  },
  {
    kind: "fill",
    id: "data-sql-19",
    difficulty: 2,
    tags: ["sql", "upsert", "contraintes"],
    prompt: "Complète pour cumuler la quantité si le SKU existe déjà.",
    code: {
      language: "sql",
      code: `INSERT INTO stocks (sku, quantite)
VALUES ('A-1', 10)
ON {{1}} (sku) DO {{2}}
SET quantite = stocks.quantite
             + {{3}}.quantite;`,
    },
    blanks: ["CONFLICT", "UPDATE", "EXCLUDED"],
    distractors: ["DUPLICATE", "NOTHING", "NEW", "INSERTED"],
    explanation:
      "`ON CONFLICT (colonne)` cible une contrainte unique existante. `DO UPDATE` met à jour, `DO NOTHING` ignorerait silencieusement. `EXCLUDED` est le pseudo-enregistrement contenant les valeurs refusées à l'insertion ; `NEW` est la syntaxe des triggers, pas celle de l'UPSERT.",
  },
  {
    kind: "output",
    id: "data-sql-20",
    difficulty: 2,
    tags: ["sql", "contraintes"],
    prompt: "La table a `email text UNIQUE`. Deux lignes sont insérées avec `email` valant `NULL`. Que se passe-t-il ?",
    code: {
      language: "sql",
      code: `INSERT INTO clients (nom, email)
VALUES ('Ana', NULL);
INSERT INTO clients (nom, email)
VALUES ('Bob', NULL);`,
    },
    choices: [
      "Les deux insertions réussissent : un index unique considère deux `NULL` comme distincts.",
      "La seconde échoue : la contrainte `UNIQUE` refuse le doublon.",
      "Les deux échouent : une colonne `UNIQUE` est implicitement `NOT NULL`.",
      "La seconde remplace silencieusement la première.",
    ],
    answer: 0,
    explanation:
      "`NULL` signifiant « inconnu », deux valeurs inconnues ne sont pas réputées égales : une contrainte `UNIQUE` classique laisse passer autant de `NULL` qu'on veut. C'est une source d'incohérence quand on croit avoir garanti l'unicité. Postgres 15 introduit `UNIQUE NULLS NOT DISTINCT` pour le comportement inverse ; sinon, ajouter `NOT NULL`.",
  },
  {
    kind: "spot",
    id: "data-sql-21",
    difficulty: 2,
    tags: ["sql", "normalisation", "modelisation"],
    prompt: "Ce schéma viole la première forme normale. Trouve la ligne fautive.",
    code: {
      language: "sql",
      code: `CREATE TABLE commandes (
  id        bigint PRIMARY KEY,
  client_id bigint NOT NULL,
  produits  text NOT NULL,
  total     numeric(12, 2) NOT NULL
);
-- produits contient 'A-1,B-2,C-3'`,
    },
    faultyLine: 4,
    reasons: [
      "Une colonne contient une liste : impossible de joindre, d'indexer ou de contraindre. Il faut une table `lignes_commande`.",
      "`text` doit être remplacé par `varchar(255)` pour être indexable.",
      "La colonne devrait s'appeler `produit` au singulier.",
      "Il manque une clé étrangère sur `total`.",
    ],
    reasonAnswer: 0,
    explanation:
      "La 1NF exige une valeur atomique par colonne. Avec une liste dans une chaîne, on ne peut ni garantir que chaque référence existe, ni compter les produits, ni chercher les commandes contenant `B-2` autrement que par un `LIKE` non indexable. La solution est une table de lignes avec une clé étrangère vers `commandes` et une vers `produits`.",
  },
  {
    kind: "match",
    id: "data-sql-22",
    difficulty: 1,
    tags: ["sql", "contraintes"],
    prompt: "Associe chaque contrainte à ce qu'elle garantit.",
    pairs: [
      { left: "`PRIMARY KEY`", right: "Identifie la ligne : unique et non nulle" },
      { left: "`FOREIGN KEY`", right: "La valeur existe dans la table référencée" },
      { left: "`UNIQUE`", right: "Pas de doublon, mais plusieurs `NULL` autorisés" },
      { left: "`CHECK`", right: "Une condition vérifiée sur chaque ligne" },
      { left: "`NOT NULL`", right: "La valeur doit être renseignée" },
    ],
    explanation:
      "Une clé étrangère empêche aussi de supprimer une ligne encore référencée, sauf `ON DELETE CASCADE` ou `SET NULL`. Un `CHECK` ne voit qu'une seule ligne : une règle qui doit consulter une autre table ne peut pas s'y exprimer.",
  },
  {
    kind: "recall",
    id: "data-sql-23",
    difficulty: 2,
    tags: ["sql", "modelisation", "contraintes"],
    prompt: "Pourquoi poser des contraintes en base alors que l'application valide déjà ?",
    explanation:
      "Parce que l'application n'est **pas le seul chemin** vers les données. Un script de reprise, une migration, un correctif manuel en console, un second service, un import de fichier : aucun ne passe par la couche de validation. La base est le dernier rempart, et le seul qui s'applique à tout le monde. Elle apporte aussi ce que l'application ne peut pas garantir en environnement concurrent : deux requêtes simultanées peuvent toutes deux vérifier qu'un email est libre puis l'insérer ; seul un index unique arbitre réellement. Les contraintes documentent enfin le modèle de façon exécutable et permettent au planificateur d'optimiser, une colonne `NOT NULL` ou une clé étrangère changeant ses estimations. Cela ne dispense pas de valider dans l'application : la base renvoie une erreur technique tardive, là où la validation applicative produit un message clair et précoce. Les deux sont complémentaires, pas redondantes.",
    keyPoints: ["Scripts, migrations, autres services ne passent pas par le code", "Seul rempart réel en accès concurrent", "Documentation exécutable du modèle", "Aide le planificateur", "Complémentaire de la validation applicative"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Index, EXPLAIN et transactions
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "data-sql-l4",
  title: "Index, EXPLAIN et transactions",
  blocks: [
    {
      kind: "text",
      text: "Un index B-tree est un arbre trié qui évite de parcourir toute la table. Il sert les égalités, les intervalles et le tri. Sur un index **composite** `(a, b)`, seul le **préfixe gauche** est exploitable : il accélère un filtre sur `a`, ou sur `a` et `b`, mais pas sur `b` seul.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "EXPLAIN ANALYZE exécute vraiment la requête et compare estimé et réel.",
      code: `EXPLAIN ANALYZE
SELECT * FROM commandes
WHERE client_id = 42;

-- Index Scan using idx_cmd_client on commandes
--   (cost=0.29..8.31 rows=1 width=64)
--   (actual time=0.02..0.03 rows=3 loops=1)

-- Un index inutilisable : la fonction empêche
-- l'usage de l'index sur creee_le
WHERE date(creee_le) = '2026-01-01'
-- réécrire en intervalle, index utilisable
WHERE creee_le >= '2026-01-01'
  AND creee_le <  '2026-01-02'`,
    },
    {
      kind: "text",
      text: "`EXPLAIN ANALYZE` **exécute** la requête et affiche le plan réel. Un `Seq Scan` n'est pas toujours un problème : sur une petite table ou quand la requête ramène une grande partie des lignes, il est plus rapide qu'un index. L'écart entre `rows` estimé et réel signale des statistiques périmées.",
    },
    {
      kind: "text",
      text: "Un index n'est pas gratuit : chaque écriture doit le maintenir, et il occupe de l'espace. Côté transactions, Postgres est en **READ COMMITTED** par défaut et son **MVCC** fait que les lecteurs ne bloquent jamais les écrivains. `VACUUM` récupère l'espace des versions de lignes devenues invisibles.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Appliquer une fonction à une colonne indexée (`lower(email)`, `date(creee_le)`) empêche l'usage de l'index, sauf à créer un index d'expression correspondant. Même chose pour `LIKE '%mot'`, qui ne peut s'appuyer sur aucun préfixe.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "data-sql-24",
    difficulty: 2,
    tags: ["sql", "index"],
    prompt: "Un index existe sur `(client_id, creee_le)`. Quelle requête ne peut **pas** l'utiliser efficacement ?",
    choices: [
      "`WHERE creee_le > '2026-01-01'`",
      "`WHERE client_id = 42`",
      "`WHERE client_id = 42 AND creee_le > '2026-01-01'`",
      "`WHERE client_id = 42 ORDER BY creee_le`",
    ],
    answer: 0,
    explanation:
      "Un index composite est trié d'abord sur `client_id`, puis sur `creee_le` à l'intérieur de chaque valeur. Sans critère sur la première colonne, les dates sont éparpillées dans tout l'arbre et le préfixe gauche est inexploitable. Les trois autres cas s'appuient sur `client_id`, y compris le dernier où l'index fournit aussi le tri sans opération supplémentaire.",
  },
  {
    kind: "spot",
    id: "data-sql-25",
    difficulty: 2,
    tags: ["sql", "index", "explain"],
    prompt: "Un index existe sur `email`, mais la requête fait un `Seq Scan`. Trouve la ligne fautive.",
    code: {
      language: "sql",
      code: `SELECT id, nom
FROM clients
WHERE lower(email) = 'ana@exemple.fr'
ORDER BY nom;`,
    },
    faultyLine: 3,
    reasons: [
      "La fonction appliquée à la colonne rend l'index inutilisable : il faudrait un index d'expression sur `lower(email)`.",
      "Un index sur une colonne `text` n'est jamais utilisé par Postgres.",
      "L'`ORDER BY` force un parcours séquentiel complet.",
      "Il manque un `LIMIT`, sans lequel le planificateur ignore les index.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'index stocke les valeurs de `email`, pas celles de `lower(email)` : le planificateur ne peut pas s'en servir. Deux corrections : créer `CREATE INDEX ON clients (lower(email))`, ou normaliser la casse à l'écriture et comparer directement. Le même raisonnement vaut pour `date(creee_le)` ou une concaténation.",
  },
  {
    kind: "output",
    id: "data-sql-26",
    difficulty: 2,
    tags: ["sql", "explain"],
    prompt: "Que fait `EXPLAIN ANALYZE` sur un `DELETE` ?",
    code: {
      language: "sql",
      code: `EXPLAIN ANALYZE
DELETE FROM commandes WHERE creee_le < '2020-01-01';`,
    },
    choices: [
      "Il **exécute réellement** la suppression, en plus d'afficher le plan : à encadrer d'une transaction annulée.",
      "Il affiche le plan sans rien supprimer, `ANALYZE` étant une simulation.",
      "Il refuse de s'appliquer à autre chose qu'un `SELECT`.",
      "Il ne supprime que la première ligne, à titre d'échantillon.",
    ],
    answer: 0,
    explanation:
      "C'est la différence entre `EXPLAIN`, qui estime seulement, et `EXPLAIN ANALYZE`, qui exécute pour mesurer les temps et les lignes réelles. Sur une écriture, cela modifie les données. Le réflexe : `BEGIN; EXPLAIN ANALYZE DELETE ...; ROLLBACK;`.",
  },
  {
    kind: "match",
    id: "data-sql-27",
    difficulty: 2,
    tags: ["sql", "explain", "index"],
    prompt: "Associe chaque nœud d'un plan d'exécution à sa signification.",
    pairs: [
      { left: "`Seq Scan`", right: "Parcours complet de la table" },
      { left: "`Index Scan`", right: "Lecture par l'index puis accès à la table" },
      { left: "`Index Only Scan`", right: "Tout est dans l'index, table non lue" },
      { left: "`Bitmap Heap Scan`", right: "Beaucoup de lignes via l'index, lues en un passage trié" },
      { left: "`Nested Loop`", right: "Jointure ligne à ligne, efficace sur peu de lignes" },
    ],
    explanation:
      "Un `Index Only Scan` suppose que toutes les colonnes demandées figurent dans l'index, d'où l'intérêt des colonnes en `INCLUDE`. Le `Bitmap Heap Scan` apparaît quand l'index désigne trop de lignes pour un accès unitaire mais pas assez pour un parcours complet : Postgres construit une carte des blocs et les lit dans l'ordre physique.",
  },
  {
    kind: "recall",
    id: "data-sql-28",
    difficulty: 3,
    tags: ["sql", "index", "performance"],
    prompt: "Pourquoi ne pas indexer toutes les colonnes, et comment choisir les index utiles ?",
    explanation:
      "Un index a un **coût en écriture** : chaque `INSERT`, `UPDATE` et `DELETE` doit maintenir chacun des index de la table, ce qui multiplie les écritures et allonge les verrous. Il occupe aussi de l'espace disque et de la mémoire cache, au détriment des données utiles, et alourdit le travail du planificateur. Un index jamais utilisé est du coût pur. Pour choisir : partir des **requêtes réelles**, pas des colonnes ; regarder les journaux de requêtes lentes et `pg_stat_statements`. Indexer les colonnes de jointure, celles des filtres fréquents et sélectifs, et celles des tris récurrents. Un index sur une colonne peu **sélective**, un booléen à deux valeurs par exemple, ne sert à rien, sauf en index **partiel** avec une clause `WHERE` ciblant la valeur rare. Vérifier chaque hypothèse avec `EXPLAIN ANALYZE`, et supprimer ce que `pg_stat_user_indexes` montre comme jamais utilisé. Enfin, un index composite bien ordonné remplace souvent plusieurs index simples.",
    keyPoints: ["Coût sur chaque écriture, espace, cache", "Partir des requêtes lentes réelles", "Jointures, filtres sélectifs, tris fréquents", "Faible sélectivité → index partiel", "Vérifier avec EXPLAIN, supprimer les inutilisés"],
  },
  {
    kind: "fill",
    id: "data-sql-29",
    difficulty: 2,
    tags: ["sql", "transactions", "isolation"],
    prompt: "Complète pour réserver une ligne et empêcher toute modification concurrente.",
    code: {
      language: "sql",
      code: `{{1}};

SELECT quantite FROM stocks
WHERE sku = 'A-1'
FOR {{2}};

UPDATE stocks SET quantite = quantite - 1
WHERE sku = 'A-1';

{{3}};`,
    },
    blanks: ["BEGIN", "UPDATE", "COMMIT"],
    distractors: ["START", "SHARE", "ROLLBACK", "END TRANSACTION"],
    explanation:
      "`BEGIN` ouvre la transaction, `COMMIT` la valide. `SELECT ... FOR UPDATE` pose un verrou exclusif sur les lignes lues : toute autre transaction voulant les modifier attend. `FOR SHARE` n'empêcherait que les écritures, pas les autres lectures verrouillantes. C'est le verrouillage pessimiste, à réserver aux conflits fréquents et aux transactions courtes.",
  },
  {
    kind: "recall",
    id: "data-sql-30",
    difficulty: 3,
    tags: ["sql", "transactions", "isolation"],
    prompt: "Quels sont les niveaux d'isolation, quelles anomalies évitent-ils, et lequel Postgres applique-t-il par défaut ?",
    explanation:
      "Trois anomalies classiques. **Lecture sale** : lire une donnée non encore validée par une autre transaction. **Lecture non répétable** : relire la même ligne dans la même transaction et obtenir une valeur différente. **Lecture fantôme** : rejouer la même requête et voir apparaître de nouvelles lignes. Le standard définit quatre niveaux, du plus permissif au plus strict : `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`. Particularité de Postgres : grâce au **MVCC**, la lecture sale est **impossible à tous les niveaux**, et `READ UNCOMMITTED` se comporte exactement comme `READ COMMITTED`, le niveau par défaut. En `READ COMMITTED`, chaque instruction voit un instantané pris à son propre début, d'où des lectures non répétables possibles. En `REPEATABLE READ`, l'instantané est pris au début de la transaction, ce qui supprime aussi les fantômes dans l'implémentation Postgres. `SERIALIZABLE` ajoute une détection de conflits qui peut faire échouer une transaction, à charge pour l'application de la rejouer. Le MVCC explique aussi pourquoi les lecteurs ne bloquent jamais les écrivains, et pourquoi `VACUUM` est nécessaire pour récupérer les anciennes versions de lignes.",
    keyPoints: ["Sale, non répétable, fantôme", "Quatre niveaux standards", "Postgres : lecture sale impossible partout", "Défaut READ COMMITTED, instantané par instruction", "SERIALIZABLE peut échouer et demander un rejeu"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "data-sql-postgres",
  title: "SQL et Postgres : jointures, index, EXPLAIN",
  objective:
    "Écrire des requêtes justes malgré les NULL, utiliser agrégations et fonctions fenêtre, modéliser avec des contraintes et lire un plan d'exécution.",
  prerequisites: [],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
