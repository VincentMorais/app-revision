/**
 * SQL et Postgres — Requêtes avancées (référentiel 3.1) : fonctions fenêtre,
 * CTE, récursivité, jsonb, types.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Agréger sans regrouper
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "data-adv-l1",
  title: "Agréger sans regrouper",
  blocks: [
    {
      kind: "text",
      text: "Afficher chaque employé **à côté** de la moyenne de son service est un besoin banal, et il est étonnamment pénible à satisfaire avec les outils habituels. `GROUP BY` ne convient pas : il réduit les lignes, alors qu'on veut les garder toutes. On finit par écrire une sous-requête corrélée, ou par faire deux requêtes et recoller en mémoire.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le contournement classique, et ce qu'il coûte.",
      code: `-- Sous-requête corrélée : évaluée pour CHAQUE ligne
SELECT e.nom, e.service, e.salaire,
       (SELECT avg(salaire) FROM employes
        WHERE service = e.service) AS moyenne
FROM employes e;

-- Ou une jointure sur un agrégat : lisible, mais
-- il faut écrire deux fois la logique de regroupement
SELECT e.nom, e.salaire, m.moyenne
FROM employes e
JOIN (SELECT service, avg(salaire) AS moyenne
      FROM employes GROUP BY service) m
  ON m.service = e.service;`,
    },
    {
      kind: "code",
      language: "sql",
      caption: "La fonction fenêtre : une ligne d'agrégat, zéro ligne perdue.",
      code: `SELECT nom, service, salaire,
       avg(salaire) OVER (PARTITION BY service) AS moyenne
FROM employes;

--   nom    | service | salaire | moyenne
--  --------+---------+---------+---------
--   Alice  | IT      |   50000 |   60000
--   Bob    | IT      |   70000 |   60000
--   Carole | RH      |   40000 |   40000
--
-- TROIS lignes, pas deux : la fenêtre calcule
-- l'agrégat sans réduire le résultat.`,
    },
    {
      kind: "text",
      text: "C'est toute l'idée : `OVER` transforme une fonction d'agrégat en calcul effectué sur un **groupe de lignes voisines**, sans que le résultat soit réduit. Chaque ligne d'origine reste présente et reçoit la valeur calculée sur sa fenêtre. On obtient en une expression ce qui demandait une sous-requête ou une jointure.",
    },
    {
      kind: "comparison",
      title: "Deux mécanismes qu'on confond",
      left: {
        label: "GROUP BY",
        text: "Réduit : n lignes en entrée, une par groupe en sortie. Les colonnes non agrégées disparaissent — il faut les mettre dans le regroupement ou les agréger. Répond à « combien par service ».",
      },
      right: {
        label: "OVER",
        text: "Conserve : n lignes en entrée, n en sortie. Toutes les colonnes restent disponibles, et l'agrégat s'ajoute comme une colonne de plus. Répond à « pour chaque employé, où se situe-t-il dans son service ».",
      },
    },
    {
      kind: "text",
      text: "Les fonctions de classement sont l'autre grande famille, et elles n'ont pas d'équivalent en agrégation classique. `row_number()` numérote sans jamais répéter un rang ; `rank()` donne le même rang aux ex æquo puis saute les suivants ; `dense_rank()` fait de même sans sauter. Le choix entre les trois dépend du traitement souhaité des égalités, et se trompe souvent.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Trois classements, trois résultats sur les ex æquo.",
      code: `SELECT nom, salaire,
       row_number() OVER (ORDER BY salaire DESC) AS num,
       rank()       OVER (ORDER BY salaire DESC) AS rang,
       dense_rank() OVER (ORDER BY salaire DESC) AS dense
FROM employes;

--   nom    | salaire | num | rang | dense
--  --------+---------+-----+------+-------
--   Bob    |   70000 |   1 |    1 |     1
--   Alice  |   70000 |   2 |    1 |     1   ← ex æquo
--   Carole |   50000 |   3 |    3 |     2
--                                   ↑ saut  ↑ pas de saut`,
    },
    {
      kind: "text",
      text: "Un usage très courant en découle : « la dernière commande de chaque client ». On numérote les commandes par client, ordonnées par date décroissante, puis on garde les lignes de numéro 1. Cette formulation remplace une sous-requête corrélée que le moteur exécutait une fois par client, et les gains sur un gros volume sont considérables.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Filtrer sur une fonction fenêtre demande un détour",
      text: "`WHERE row_number() OVER (…) = 1` est refusé : le `WHERE` s'applique **avant** le calcul des fenêtres. Il faut envelopper la requête — dans une sous-requête ou une expression de table commune — puis filtrer à l'extérieur. C'est la première erreur que tout le monde commet, et le message d'erreur ne l'explique pas clairement.",
    },
    {
      kind: "text",
      text: "Un usage très courant en découle et mérite d'être connu par cœur : « la dernière commande de chaque client ». On numérote les commandes par client, ordonnées par date décroissante, puis on garde celles dont le numéro vaut un. Cette formulation remplace une sous-requête corrélée que le moteur exécutait une fois par client, et le gain sur un gros volume est considérable.",
    },
    {
      kind: "text",
      text: "Le même motif sert bien au-delà : le premier paiement d'un abonnement, la dernière connexion d'un utilisateur, l'état le plus récent d'une entité dont on conserve l'historique. Reconnaître cette famille de problèmes — « une ligne par groupe, choisie selon un critère » — et savoir qu'elle se résout en trois lignes est l'un des apports les plus immédiats des fonctions fenêtre.",
    },
    {
      kind: "text",
      text: "Un dernier point pratique : les fonctions fenêtre s'évaluent après le `GROUP BY`, ce qui permet de les combiner. On peut ainsi calculer un agrégat par service, puis classer ces services entre eux dans la même requête — un besoin fréquent en reporting, qui demandait auparavant deux passes.",
    },
    {
      kind: "text",
      text: "Retenons la distinction fondatrice : `GROUP BY` réduit, `OVER` conserve. Dès qu'on veut garder le détail tout en montrant un agrégat, un classement ou une comparaison avec le voisin, la fonction fenêtre est l'outil — et elle remplace presque toujours une construction plus lente et plus longue à écrire.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "data-adv-01",
    difficulty: 2,
    tags: ["sql", "fenetres"],
    prompt: "La table contient Alice (IT, 50000), Bob (IT, 70000) et Carole (RH, 40000). Que renvoie cette requête ?",
    code: {
      language: "sql",
      code: `SELECT nom, service, salaire,
       avg(salaire) OVER (PARTITION BY service) AS moyenne
FROM employes;`,
    },
    choices: [
      "Trois lignes : Alice et Bob avec 60000, Carole avec 40000.",
      "Deux lignes : IT avec 60000 et RH avec 40000.",
      "Trois lignes, toutes avec la moyenne globale de 53333.",
      "Une erreur : `nom` doit figurer dans une clause `GROUP BY`.",
    ],
    answer: 0,
    explanation:
      "`OVER` conserve les lignes au lieu de les réduire : les trois employés restent, chacun recevant la moyenne de sa propre partition. `PARTITION BY service` découpe en deux groupes — IT à 60000, RH à 40000. Avec `GROUP BY`, on n'obtiendrait que deux lignes et `nom` devrait disparaître ou être agrégé.",
  },
  {
    kind: "mcq",
    id: "data-adv-02",
    difficulty: 2,
    tags: ["sql", "fenetres"],
    prompt: "Pourquoi `WHERE row_number() OVER (…) = 1` est-il refusé ?",
    choices: [
      "Le `WHERE` s'applique avant le calcul des fonctions fenêtre : il faut envelopper la requête et filtrer à l'extérieur.",
      "`row_number()` ne peut être utilisé que dans un `ORDER BY`.",
      "Il manque une clause `PARTITION BY`, obligatoire dans un `WHERE`.",
      "Le résultat de `row_number()` n'est pas un entier comparable.",
    ],
    answer: 0,
    explanation:
      "L'ordre d'évaluation place les fonctions fenêtre après le filtrage : au moment du `WHERE`, le numéro n'existe pas encore. On enveloppe donc la requête dans une sous-requête ou une expression de table commune, puis on filtre à l'extérieur. C'est la première erreur que tout le monde commet, et le message ne l'explique pas clairement.",
  },
  {
    kind: "recall",
    id: "data-adv-03",
    difficulty: 2,
    tags: ["sql", "fenetres"],
    prompt: "Quelle différence entre `row_number`, `rank` et `dense_rank` ?",
    explanation:
      "Elles se distinguent uniquement par le traitement des **ex æquo**. `row_number()` numérote sans jamais répéter : deux lignes de même valeur reçoivent 1 et 2, l'ordre entre elles étant arbitraire si rien ne les départage. `rank()` donne le même rang aux ex æquo puis **saute** les suivants : 1, 1, 3. `dense_rank()` donne le même rang sans sauter : 1, 1, 2. Le choix dépend du sens voulu — un classement sportif utilise `rank`, une numérotation de lignes utilise `row_number`, et `dense_rank` sert quand on veut compter des niveaux distincts. L'erreur fréquente est d'employer `row_number` là où des ex æquo existent : on obtient un résultat stable en apparence mais arbitraire, qui peut changer d'une exécution à l'autre si aucun critère secondaire n'est précisé dans l'`ORDER BY`.",
    keyPoints: [
      "row_number : jamais de répétition, ordre arbitraire sur les égalités",
      "rank : même rang aux ex æquo, puis saut",
      "dense_rank : même rang, sans saut",
      "Préciser un critère secondaire pour rendre row_number déterministe",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Partition, ordre et cadre
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "data-adv-l2",
  title: "Partition, ordre et cadre",
  blocks: [
    {
      kind: "text",
      text: "Une fenêtre se définit par trois éléments, et le troisième est celui qu'on ignore le plus souvent tout en subissant ses effets. `PARTITION BY` découpe en groupes, `ORDER BY` ordonne à l'intérieur de chaque groupe, et le **cadre** dit quelles lignes de ce groupe entrent réellement dans le calcul.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le cadre par défaut change selon la présence d'un ordre.",
      code: `-- SANS ORDER BY : le cadre est TOUTE la partition
avg(salaire) OVER (PARTITION BY service)
-- → chaque ligne voit la moyenne du service entier

-- AVEC ORDER BY : le cadre par défaut devient
-- « du début jusqu'à la ligne courante »
sum(montant) OVER (ORDER BY date)
-- → un CUMUL, pas un total !

-- Le défaut explicite, rarement écrit :
sum(montant) OVER (ORDER BY date
    RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`,
    },
    {
      kind: "text",
      text: "Ce changement de comportement surprend systématiquement : ajouter un `ORDER BY` à une somme la transforme en cumul progressif. Ce n'est pas un défaut, c'est ce qui rend les totaux glissants faciles à écrire — mais il faut savoir que l'ordre modifie le sens du calcul, et pas seulement la présentation.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Cumul, moyenne glissante et comparaison au voisin.",
      code: `SELECT jour, montant,
       -- Cumul depuis le début
       sum(montant) OVER (ORDER BY jour) AS cumul,

       -- Moyenne des 7 derniers jours (lignes)
       avg(montant) OVER (ORDER BY jour
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moy7,

       -- La valeur de la ligne précédente
       lag(montant) OVER (ORDER BY jour) AS veille,

       -- La variation par rapport à la veille
       montant - lag(montant) OVER (ORDER BY jour) AS delta
FROM ventes_journalieres;`,
    },
    {
      kind: "text",
      text: "`lag` et `lead` méritent une mention particulière : elles donnent accès à la ligne précédente ou suivante sans auto-jointure. Calculer une variation quotidienne, détecter un changement d'état ou mesurer un écart entre deux événements successifs devient une expression au lieu d'une requête compliquée à relire.",
    },
    {
      kind: "comparison",
      title: "ROWS ou RANGE : la différence qui piège",
      left: {
        label: "ROWS",
        text: "Compte des **lignes** physiques. `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` prend exactement sept lignes, quelles que soient leurs valeurs. C'est ce qu'on veut presque toujours, et il faut l'écrire explicitement.",
      },
      right: {
        label: "RANGE",
        text: "Compte des **valeurs** selon l'ordre. Toutes les lignes de même valeur d'ordre — les pairs — entrent ensemble dans le cadre. C'est le défaut, et il produit des résultats inattendus dès qu'il existe des doublons dans la colonne d'ordre.",
      },
    },
    {
      kind: "text",
      text: "Ce piège est réel et discret. Si plusieurs ventes portent la même date et qu'on écrit un cumul avec le cadre par défaut, toutes les lignes de cette date reçoivent la **même** valeur cumulée, incluant l'ensemble du groupe. Le résultat paraît faux sans qu'on comprenne pourquoi, et la correction consiste simplement à écrire `ROWS` explicitement.",
    },
    {
      kind: "text",
      text: "Quand plusieurs colonnes partagent la même définition de fenêtre, la clause `WINDOW` permet de la nommer une fois et de la réutiliser. Le gain n'est pas seulement de concision : il garantit que les colonnes utilisent exactement la même fenêtre, là où une définition recopiée finit toujours par diverger d'un caractère.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un ORDER BY de fenêtre n'ordonne pas le résultat",
      text: "L'ordre déclaré dans `OVER` sert uniquement au calcul de la fenêtre. Le classement final des lignes reste indéterminé sans un `ORDER BY` sur la requête elle-même. Un résultat qui paraît trié l'est par hasard — et l'ordre peut changer avec le volume, le plan choisi ou le parallélisme.",
    },
    {
      kind: "text",
      text: "Les fonctions de valeur complètent la panoplie. `first_value` et `last_value` donnent la première et la dernière ligne du cadre, `nth_value` une position précise. Attention toutefois : `last_value` avec le cadre par défaut renvoie la ligne courante, puisque le cadre s'arrête là — il faut étendre explicitement le cadre jusqu'à la fin de la partition pour obtenir ce qu'on attend.",
    },
    {
      kind: "text",
      text: "C'est un piège classique et assez déroutant : `first_value` donne le résultat attendu, `last_value` semble cassé. Les deux se comportent pourtant de la même façon — c'est le cadre par défaut, borné à la ligne courante, qui rend l'une correcte et l'autre inutile. Écrire le cadre explicitement lève l'ambiguïté d'un coup.",
    },
    {
      kind: "text",
      text: "Retenons les trois éléments et leur piège respectif : la partition découpe, l'ordre change le sens du calcul, et le cadre par défaut est en `RANGE` — donc sensible aux ex æquo. Écrire `ROWS` explicitement dès qu'un cadre est en jeu supprime la principale source de résultats inexpliqués.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "data-adv-04",
    difficulty: 3,
    tags: ["sql", "fenetres"],
    prompt: "Que calcule `sum(montant) OVER (ORDER BY jour)` ?",
    choices: [
      "Un cumul progressif : la somme du début jusqu'à la ligne courante.",
      "La somme totale de toutes les lignes, répétée sur chaque ligne.",
      "La somme des lignes ayant la même date que la ligne courante.",
      "Une erreur : `sum` exige une clause `PARTITION BY`.",
    ],
    answer: 0,
    explanation:
      "La présence d'un `ORDER BY` change le cadre par défaut : il devient « du début jusqu'à la ligne courante », ce qui transforme la somme en cumul. Sans `ORDER BY`, le cadre couvre toute la partition et l'on obtient bien le total répété. C'est la surprise la plus fréquente sur les fonctions fenêtre.",
  },
  {
    kind: "match",
    id: "data-adv-05",
    difficulty: 2,
    tags: ["sql", "fenetres"],
    prompt: "Associe chaque construction à son effet.",
    pairs: [
      { left: "PARTITION BY service", right: "Découpe en groupes indépendants" },
      { left: "ORDER BY jour", right: "Ordonne dans le groupe, et rend le cadre cumulatif" },
      { left: "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW", right: "Exactement sept lignes physiques" },
      { left: "lag(montant) OVER (ORDER BY jour)", right: "La valeur de la ligne précédente, sans auto-jointure" },
    ],
    explanation:
      "Le cadre est le troisième élément, celui qu'on ignore le plus souvent tout en subissant ses effets. Son défaut est en `RANGE`, qui raisonne sur les valeurs : toutes les lignes de même date entrent ensemble dans le cadre, ce qui produit des cumuls identiques pour un même jour. Écrire `ROWS` explicitement supprime ce piège.",
  },
  {
    kind: "recall",
    id: "data-adv-06",
    difficulty: 3,
    tags: ["sql", "fenetres"],
    prompt: "Quelle différence entre `ROWS` et `RANGE`, et pourquoi elle pose problème ?",
    explanation:
      "`ROWS` compte des **lignes physiques** : `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` prend exactement sept lignes, quelles que soient leurs valeurs. `RANGE` compte des **valeurs** selon la colonne d'ordre : toutes les lignes partageant la même valeur — les pairs — entrent ensemble dans le cadre. Le problème est que `RANGE` est le **défaut** quand un `ORDER BY` est présent. Si plusieurs ventes portent la même date et qu'on écrit un cumul sans préciser le cadre, toutes les lignes de cette date reçoivent la même valeur cumulée, incluant l'intégralité du groupe au lieu de s'arrêter à la ligne courante. Le résultat paraît faux sans qu'on comprenne pourquoi, et l'erreur ne se manifeste que lorsqu'il existe des doublons — donc souvent en production et pas sur le jeu de test. La correction tient en un mot : écrire `ROWS` explicitement dès qu'un cadre est en jeu.",
    keyPoints: [
      "ROWS compte des lignes, RANGE compte des valeurs",
      "RANGE est le défaut dès qu'un ORDER BY est présent",
      "Les ex æquo entrent ensemble dans le cadre",
      "Le bug n'apparaît qu'avec des doublons : souvent en production",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Les expressions de table communes
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "data-adv-l3",
  title: "Les expressions de table communes",
  blocks: [
    {
      kind: "text",
      text: "Une requête qui empile trois sous-requêtes imbriquées se lit de l'intérieur vers l'extérieur, c'est-à-dire à l'envers de la façon dont elle a été pensée. Les expressions de table communes — la clause `WITH` — permettent de nommer chaque étape et de les lire dans l'ordre, ce qui change beaucoup pour une requête destinée à être relue.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le même calcul, imbriqué puis nommé.",
      code: `-- Imbriqué : on lit de l'intérieur vers l'extérieur
SELECT service, avg(total) FROM (
    SELECT e.service, e.id, sum(v.montant) AS total
    FROM employes e
    JOIN ventes v ON v.employe_id = e.id
    WHERE v.date >= '2026-01-01'
    GROUP BY e.service, e.id
) t GROUP BY service;

-- Nommé : chaque étape a un nom, et on lit en ordre
WITH ventes_2026 AS (
    SELECT * FROM ventes WHERE date >= '2026-01-01'
),
total_par_employe AS (
    SELECT e.service, e.id, sum(v.montant) AS total
    FROM employes e
    JOIN ventes_2026 v ON v.employe_id = e.id
    GROUP BY e.service, e.id
)
SELECT service, avg(total) FROM total_par_employe
GROUP BY service;`,
    },
    {
      kind: "text",
      text: "Le gain principal est la lisibilité, et il ne faut pas le sous-estimer : une requête de cinquante lignes qu'on peut relire étape par étape est maintenable, alors que la même en sous-requêtes imbriquées devient un bloc qu'on n'ose plus toucher. Les noms d'étapes jouent exactement le rôle des noms de variables dans un programme.",
    },
    {
      kind: "text",
      text: "Une expression peut être référencée plusieurs fois dans la requête, ce qui évite de répéter un bloc. Attention toutefois : référencer deux fois ne signifie pas calculer une fois — cela dépend de la décision du planificateur, et le comportement a changé au fil des versions de Postgres.",
    },
    {
      kind: "comparison",
      title: "Une évolution importante de Postgres",
      left: {
        label: "Avant la version 12",
        text: "Chaque expression de table était une **barrière d'optimisation** : matérialisée systématiquement, sans que les filtres extérieurs puissent y descendre. Pratique pour forcer un ordre d'exécution, désastreux pour la performance quand on ne le voulait pas.",
      },
      right: {
        label: "Depuis la version 12",
        text: "Une expression référencée une seule fois et sans effet de bord est **intégrée** dans la requête principale, comme une sous-requête ordinaire : les filtres descendent, les index servent. On peut forcer l'ancien comportement avec `MATERIALIZED`.",
      },
    },
    {
      kind: "text",
      text: "Cette évolution explique des différences de performance déroutantes entre deux serveurs de versions différentes : la même requête, intégrée d'un côté et matérialisée de l'autre, peut passer de quelques millisecondes à plusieurs secondes. Connaître ce comportement évite de chercher la cause ailleurs.",
    },
    {
      kind: "text",
      text: "Le mot-clé `MATERIALIZED` reste utile dans deux cas précis : quand une étape est coûteuse et référencée plusieurs fois — on veut alors la calculer une seule fois — et quand on souhaite délibérément empêcher le planificateur de réorganiser, par exemple pour garantir qu'un filtre sélectif s'applique avant une jointure lourde.",
    },
    {
      kind: "text",
      text: "Un usage moins connu mérite d'être signalé : `WITH` accepte aussi des instructions de modification. On peut supprimer des lignes et récupérer ce qui a été supprimé dans la même requête, ou insérer dans deux tables d'un coup — ce qui remplace un aller-retour applicatif par une seule instruction atomique.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Nommer les étapes comme on nomme des variables",
      text: "`WITH t1 AS (…), t2 AS (…)` n'apporte que la structure, pas la compréhension. `WITH ventes_2026 AS (…), total_par_employe AS (…)` transforme la requête en récit lisible. C'est exactement le même travail que de nommer une variable intermédiaire dans une méthode, et le bénéfice est de même nature.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Modifier et lire dans la même instruction.",
      code: `-- Archiver puis supprimer, atomiquement
WITH supprimees AS (
    DELETE FROM commandes
    WHERE creee_le < now() - interval '2 years'
    RETURNING *
)
INSERT INTO commandes_archive
SELECT * FROM supprimees;

-- Remplace un aller-retour applicatif — lire,
-- insérer ailleurs, supprimer — par une seule
-- instruction dont l'atomicité est garantie.`,
    },
    {
      kind: "text",
      text: "Cette forme est très sous-utilisée alors qu'elle supprime une catégorie entière de code applicatif fragile : lire un lot, l'insérer ailleurs, puis supprimer l'original suppose de gérer les échecs partiels et les interruptions. Écrit ainsi, l'ensemble réussit ou échoue d'un bloc.",
    },
    {
      kind: "text",
      text: "Retenons que la clause `WITH` sert d'abord la lisibilité, qu'elle n'est plus une barrière d'optimisation depuis Postgres 12 sauf demande explicite, et que `MATERIALIZED` reste l'outil pour forcer un calcul unique ou un ordre d'exécution. Le reste est une affaire de nommage.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "data-adv-07",
    difficulty: 3,
    tags: ["sql", "cte"],
    prompt: "Depuis Postgres 12, une expression de table commune référencée une seule fois est-elle matérialisée ?",
    choices: [
      "Non : elle est intégrée dans la requête principale, ce qui laisse les filtres descendre et les index servir.",
      "Oui, systématiquement : c'est une barrière d'optimisation par définition.",
      "Oui, sauf si elle contient une jointure.",
      "Cela dépend uniquement de la taille du résultat intermédiaire.",
    ],
    answer: 0,
    explanation:
      "Avant la version 12, chaque expression de table était matérialisée, ce qui empêchait les filtres extérieurs d'y descendre. Depuis, une expression sans effet de bord référencée une seule fois est intégrée comme une sous-requête ordinaire. `MATERIALIZED` force l'ancien comportement — utile quand une étape coûteuse est référencée plusieurs fois.",
  },
  {
    kind: "order",
    id: "data-adv-08",
    difficulty: 2,
    tags: ["sql", "cte"],
    prompt: "Remets dans l'ordre la transformation d'une requête imbriquée en requête nommée.",
    items: [
      "Identifier les étapes logiques dans la requête imbriquée",
      "Extraire la plus interne en première expression de table, avec un nom parlant",
      "Extraire les suivantes, chacune référençant la précédente",
      "Réduire la requête finale à sa dernière étape",
    ],
    explanation:
      "On remonte de l'intérieur vers l'extérieur, ce qui correspond à l'ordre d'exécution logique. Le bénéfice est de rendre la requête lisible dans l'ordre où elle a été pensée, et le nommage des étapes joue exactement le rôle des noms de variables intermédiaires dans une méthode.",
  },
  {
    kind: "recall",
    id: "data-adv-09",
    difficulty: 2,
    tags: ["sql", "cte"],
    prompt: "Quand utiliser `MATERIALIZED` sur une expression de table ?",
    explanation:
      "Dans deux cas. D'abord quand une étape **coûteuse est référencée plusieurs fois** : sans matérialisation, le planificateur peut choisir de la recalculer à chaque référence, et l'on paie deux ou trois fois un calcul lourd. Ensuite quand on veut **empêcher délibérément la réorganisation** du plan — par exemple pour garantir qu'un filtre très sélectif s'applique avant une jointure coûteuse, plutôt que de laisser le planificateur en décider autrement sur la base de statistiques imprécises. En dehors de ces cas, il vaut mieux laisser l'intégration opérer : elle permet aux filtres extérieurs de descendre dans l'expression et aux index de servir, ce qui fait souvent une différence d'un ordre de grandeur. À noter que ce comportement a changé en Postgres 12, ce qui explique des écarts de performance déroutants entre deux serveurs de versions différentes sur une requête identique.",
    keyPoints: [
      "Étape coûteuse référencée plusieurs fois : éviter le recalcul",
      "Forcer un ordre d'exécution malgré le planificateur",
      "Sinon, l'intégration laisse descendre les filtres et servir les index",
      "Comportement changé en Postgres 12 : écarts entre versions",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les requêtes récursives
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "data-adv-l4",
  title: "Les requêtes récursives",
  blocks: [
    {
      kind: "text",
      text: "Certaines structures sont naturellement hiérarchiques : un organigramme, un arbre de catégories, une nomenclature de composants, un fil de commentaires. Les interroger avec du SQL ordinaire suppose de connaître la profondeur à l'avance — une jointure par niveau — ce qui ne tient pas dès que la hiérarchie est libre.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "La récursion : un point de départ, puis une règle d'extension.",
      code: `WITH RECURSIVE arbre AS (
    -- ANCRAGE : le point de départ, non récursif
    SELECT id, nom, manager_id, 1 AS niveau
    FROM employes
    WHERE manager_id IS NULL

  UNION ALL

    -- RÉCURSION : se réfère à « arbre » lui-même
    SELECT e.id, e.nom, e.manager_id, a.niveau + 1
    FROM employes e
    JOIN arbre a ON e.manager_id = a.id
)
SELECT nom, niveau FROM arbre ORDER BY niveau;

--   nom    | niveau        Alice n'a pas de manager
--  --------+--------       Bob dépend d'Alice
--   Alice  |      1        Carole dépend de Bob
--   Bob    |      2
--   Carole |      3`,
    },
    {
      kind: "text",
      text: "La structure est toujours la même : un terme d'**ancrage** qui produit le point de départ, une union, et un terme **récursif** qui référence l'expression elle-même. Le moteur applique le second de façon répétée aux lignes nouvellement produites, jusqu'à ce qu'aucune nouvelle ligne n'apparaisse.",
    },
    {
      kind: "text",
      text: "Cette mécanique d'arrêt mérite d'être comprise : la récursion s'achève lorsqu'une itération ne produit plus rien. Si la structure contient un **cycle** — un employé qui est indirectement son propre manager, une donnée corrompue — la requête ne s'arrête jamais et consomme la mémoire jusqu'à l'échec.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Se protéger contre les cycles.",
      code: `WITH RECURSIVE arbre AS (
    SELECT id, nom, manager_id, 1 AS niveau,
           ARRAY[id] AS chemin            -- trace parcourue
    FROM employes WHERE manager_id IS NULL
  UNION ALL
    SELECT e.id, e.nom, e.manager_id, a.niveau + 1,
           a.chemin || e.id
    FROM employes e
    JOIN arbre a ON e.manager_id = a.id
    WHERE NOT e.id = ANY(a.chemin)        -- on ne repasse pas
      AND a.niveau < 50                   -- garde-fou dur
)
SELECT * FROM arbre;

-- Postgres 14+ propose aussi la clause CYCLE, qui
-- automatise la détection.`,
    },
    {
      kind: "text",
      text: "Le garde-fou sur la profondeur est une précaution bon marché qu'il faut prendre systématiquement, même quand on est certain qu'aucun cycle ne peut exister. Les données réelles finissent toujours par contenir ce que le modèle interdisait, et une requête qui tourne indéfiniment en production est un incident bien plus désagréable qu'un résultat tronqué.",
    },
    {
      kind: "comparison",
      title: "Deux façons de stocker une hiérarchie",
      left: {
        label: "Référence au parent",
        text: "Une colonne `parent_id`. Écriture triviale, déplacement d'un nœud immédiat. Lecture coûteuse : il faut une requête récursive pour obtenir une branche entière, et la profondeur n'est pas connue d'avance.",
      },
      right: {
        label: "Chemin matérialisé",
        text: "Une colonne contenant le chemin complet, du type `/1/7/23/`. Lecture d'une branche triviale par un préfixe indexé. Écriture coûteuse : déplacer un nœud impose de réécrire tous ses descendants.",
      },
    },
    {
      kind: "text",
      text: "Le choix se fait sur le rapport entre lectures et écritures. Une arborescence de catégories, lue en permanence et modifiée une fois par mois, gagne beaucoup au chemin matérialisé. Un fil de commentaires en croissance continue s'accommode mieux d'une référence au parent. Postgres propose aussi un type dédié aux chemins hiérarchiques, avec ses propres index.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "UNION ALL, pas UNION",
      text: "`UNION` déduplique à chaque itération, ce qui ajoute un tri ou une table de hachage sur l'ensemble des résultats intermédiaires à chaque tour. Sur une hiérarchie de quelques milliers de nœuds, la différence est spectaculaire. `UNION ALL` est la forme attendue, et la déduplication éventuelle se fait une seule fois à la fin.",
    },
    {
      kind: "text",
      text: "Les usages dépassent largement les hiérarchies d'objets. Une requête récursive sait générer une série — tous les jours d'un mois, pour combler les trous d'un rapport — parcourir un graphe de dépendances entre modules, calculer la fermeture transitive d'une relation, ou remonter une chaîne de versions successives d'un document.",
    },
    {
      kind: "text",
      text: "Pour la génération de séries, Postgres propose toutefois une fonction dédiée nettement plus simple et plus rapide. La récursivité garde tout son intérêt lorsque chaque étape dépend du **résultat** de la précédente — ce qu'aucune génération de série ne sait faire — et c'est ce critère qui doit décider entre les deux.",
    },
    {
      kind: "text",
      text: "Retenons la structure — ancrage, union, terme récursif — et les deux précautions qui l'accompagnent : `UNION ALL` pour la performance, et une limite de profondeur ou un suivi du chemin parcouru pour se prémunir des cycles que les données finiront par contenir.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "data-adv-10",
    difficulty: 3,
    tags: ["sql", "recursivite"],
    prompt: "Alice n'a pas de manager, Bob dépend d'Alice, Carole dépend de Bob. Que renvoie la requête ?",
    code: {
      language: "sql",
      code: `WITH RECURSIVE arbre AS (
    SELECT id, nom, manager_id, 1 AS niveau
    FROM employes WHERE manager_id IS NULL
  UNION ALL
    SELECT e.id, e.nom, e.manager_id, a.niveau + 1
    FROM employes e JOIN arbre a ON e.manager_id = a.id
)
SELECT nom, niveau FROM arbre ORDER BY niveau;`,
    },
    choices: [
      "Alice niveau 1, Bob niveau 2, Carole niveau 3.",
      "Alice niveau 1 uniquement : le terme récursif ne trouve aucune correspondance.",
      "Les trois au niveau 1 : le niveau n'est pas incrémenté correctement.",
      "Une boucle infinie : aucune condition d'arrêt n'est déclarée.",
    ],
    answer: 0,
    explanation:
      "L'ancrage produit Alice au niveau 1. La première itération du terme récursif joint les employés dont le manager est dans l'arbre — Bob — au niveau 2. La deuxième produit Carole au niveau 3. La troisième ne trouve plus rien, et la récursion s'arrête : c'est exactement sa condition d'arrêt, qu'aucune clause n'a besoin de déclarer.",
  },
  {
    kind: "mcq",
    id: "data-adv-11",
    difficulty: 2,
    tags: ["sql", "recursivite"],
    prompt: "Pourquoi préférer `UNION ALL` à `UNION` dans une requête récursive ?",
    choices: [
      "`UNION` déduplique à chaque itération, ce qui ajoute un tri sur tous les résultats intermédiaires.",
      "`UNION` n'est pas autorisé dans une expression récursive.",
      "`UNION ALL` garantit l'ordre des lignes du résultat.",
      "`UNION` empêche la détection automatique des cycles.",
    ],
    answer: 0,
    explanation:
      "La déduplication impose un tri ou une table de hachage sur l'ensemble des lignes déjà produites, à chaque tour de récursion. Sur une hiérarchie de quelques milliers de nœuds, l'écart est spectaculaire. `UNION ALL` est la forme attendue, et si une déduplication est nécessaire, elle se fait une seule fois à la fin.",
  },
  {
    kind: "recall",
    id: "data-adv-12",
    difficulty: 2,
    tags: ["sql", "recursivite"],
    prompt: "Comment une requête récursive s'arrête-t-elle, et que se passe-t-il en cas de cycle ?",
    explanation:
      "Elle s'arrête lorsqu'une itération du terme récursif ne produit **plus aucune ligne nouvelle** : aucune clause d'arrêt n'est à écrire, c'est le mécanisme lui-même. Le terme d'ancrage donne le point de départ, puis le terme récursif est appliqué de façon répétée aux lignes fraîchement produites jusqu'à épuisement. En présence d'un **cycle** dans les données — un employé indirectement son propre manager, une référence corrompue — cette condition n'est jamais atteinte : chaque itération produit de nouvelles lignes, et la requête consomme la mémoire jusqu'à l'échec, voire fait tomber le serveur. Deux protections s'écrivent en une ligne chacune : conserver le chemin parcouru dans un tableau et refuser de repasser par un nœud déjà visité, et poser une limite de profondeur comme garde-fou dur. Il faut les mettre systématiquement, même quand le modèle interdit les cycles — les données réelles finissent toujours par contenir ce que le modèle interdisait.",
    keyPoints: [
      "Arrêt quand une itération ne produit plus de ligne nouvelle",
      "Un cycle empêche cette condition d'être atteinte",
      "Conserver le chemin parcouru et refuser les nœuds déjà vus",
      "Poser une limite de profondeur, même si le modèle l'interdit",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — jsonb : stocker du semi-structuré
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "data-adv-l5",
  title: "jsonb : stocker du semi-structuré",
  blocks: [
    {
      kind: "text",
      text: "Certaines données résistent au modèle relationnel : les attributs d'un produit qui diffèrent selon la catégorie, la charge utile d'un événement dont la forme dépend du type, les préférences d'un utilisateur qu'on ne veut pas figer en colonnes. Postgres offre pour cela un type qui accepte du JSON tout en restant interrogeable et indexable.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Deux types voisins, et lequel choisir.",
      code: `-- json : stocke le TEXTE tel quel
--  · conserve l'ordre des clés, les doublons,
--    les espaces
--  · reparsé à chaque accès : lent
--  · pas d'index possible sur le contenu

-- jsonb : stocke une forme BINAIRE décomposée
--  · réordonne les clés, supprime les doublons
--    et les espaces
--  · accès rapide, opérateurs riches
--  · INDEXABLE

-- → jsonb dans 99 % des cas. json seulement si
--   la représentation exacte doit être préservée
--   à l'octet près.
ALTER TABLE produits ADD COLUMN attributs jsonb;`,
    },
    {
      kind: "text",
      text: "La différence décisive est l'indexation : un contenu `json` ne peut pas être indexé sur ses valeurs, ce qui condamne toute recherche à parcourir la table entière. `jsonb` se paie par une normalisation — les clés sont réordonnées et les doublons supprimés — qui n'a d'importance que si l'on doit restituer le document original à l'identique.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Les opérateurs à connaître.",
      code: `-- ->   renvoie du jsonb ;  ->>  renvoie du texte
SELECT attributs -> 'couleur'   FROM produits;  -- "rouge"
SELECT attributs ->> 'couleur'  FROM produits;  -- rouge

-- #>  chemin imbriqué ;  #>> en texte
SELECT attributs #>> '{dimensions,hauteur}' FROM produits;

-- @>  « contient » : le test le plus utile, et le
--     seul qui exploite pleinement un index GIN
SELECT * FROM produits
WHERE attributs @> '{"couleur": "rouge"}';

-- ?   la clé existe-t-elle ?
SELECT * FROM produits WHERE attributs ? 'garantie';`,
    },
    {
      kind: "text",
      text: "La distinction entre `->` et `->>` est la source d'erreur la plus fréquente : le premier renvoie du JSON — donc une chaîne entourée de guillemets — le second renvoie du texte brut. Comparer `attributs -> 'couleur' = 'rouge'` échoue silencieusement, car on compare du JSON à du texte ; il faut `->>` ou bien écrire la valeur en JSON.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'interroger",
      left: {
        label: "Extraction puis comparaison",
        text: "`attributs ->> 'couleur' = 'rouge'`. Lisible et intuitif. N'utilise pas d'index GIN : il faudra un index d'expression dédié sur exactement cette extraction, un par champ interrogé.",
      },
      right: {
        label: "Test de contenance",
        text: "`attributs @> '{\"couleur\": \"rouge\"}'`. Moins naturel à écrire, mais exploite un index GIN unique couvrant **toutes** les clés du document. C'est la forme à privilégier dès qu'on interroge plusieurs champs différents.",
      },
    },
    {
      kind: "text",
      text: "Ce choix a des conséquences directes sur l'indexation, développées dans la leçon suivante. Retenons pour l'instant que l'opérateur de contenance n'est pas seulement une écriture alternative : c'est celui autour duquel l'indexation de `jsonb` a été conçue, et l'ignorer revient à se priver de l'essentiel du bénéfice.",
    },
    {
      kind: "text",
      text: "La modification d'un document se fait sans le réécrire entièrement. La concaténation fusionne au premier niveau, `jsonb_set` remplace une valeur à un chemin donné, et un opérateur dédié supprime une clé. Ces opérations restent des mises à jour de ligne complètes du point de vue du stockage, mais elles évitent de reconstruire le document côté applicatif.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Aucune contrainte n'est vérifiée dans un jsonb",
      text: "Pas de type, pas de `NOT NULL`, pas de clé étrangère, pas de valeur par défaut. Une faute de frappe dans un nom de clé crée simplement une nouvelle clé, sans la moindre erreur. C'est exactement ce qu'on recherche pour du contenu réellement variable, et c'est un danger pour tout ce qui a une forme stable.",
    },
    {
      kind: "text",
      text: "L'agrégation de documents mérite aussi d'être connue : des fonctions dédiées construisent un objet ou un tableau `jsonb` à partir de lignes. Cela permet de renvoyer en une seule requête une structure imbriquée — une commande avec ses lignes — plutôt que de rapatrier un produit cartésien et de le recomposer côté applicatif.",
    },
    {
      kind: "text",
      text: "C'est un outil puissant et qu'il faut employer avec mesure : construire toute la réponse d'une API dans la base couple fortement le schéma au contrat exposé, et rend les deux difficiles à faire évoluer séparément. Le bon usage est ponctuel, sur une requête de lecture dont la forme imbriquée coûterait cher à reconstituer.",
    },
    {
      kind: "text",
      text: "Retenons : `jsonb` plutôt que `json`, `->>` pour obtenir du texte, l'opérateur de contenance pour interroger efficacement, et la conscience permanente qu'aucune garantie de structure n'existe à l'intérieur du document.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "fill",
    id: "data-adv-13",
    difficulty: 2,
    tags: ["sql", "jsonb"],
    prompt: "Complète : extraire une valeur en texte, et tester la contenance.",
    code: {
      language: "sql",
      code: `-- Extraire la couleur sous forme de TEXTE
SELECT attributs {{1}} 'couleur' FROM produits;

-- Filtrer avec l'opérateur qui exploite un index GIN
SELECT * FROM produits
WHERE attributs {{2}} '{"couleur": "rouge"}';`,
    },
    blanks: ["->>", "@>"],
    distractors: ["->", "#>", "?", "="],
    explanation:
      "`->` renvoie du `jsonb` — donc une chaîne entourée de guillemets — tandis que `->>` renvoie du texte brut : comparer le premier à `'rouge'` échoue silencieusement. `@>` teste la contenance et c'est l'opérateur autour duquel l'indexation GIN a été conçue : un seul index couvre alors toutes les clés du document.",
  },
  {
    kind: "mcq",
    id: "data-adv-14",
    difficulty: 2,
    tags: ["sql", "jsonb"],
    prompt: "Pourquoi préférer `jsonb` à `json` ?",
    choices: [
      "`jsonb` est stocké sous forme binaire décomposée : accès rapide, opérateurs riches, et surtout indexable.",
      "`jsonb` préserve l'ordre des clés et les espaces du document d'origine.",
      "`json` ne peut pas contenir de tableaux, contrairement à `jsonb`.",
      "`jsonb` applique automatiquement un schéma de validation aux documents.",
    ],
    answer: 0,
    explanation:
      "`json` stocke le texte tel quel et doit le reparser à chaque accès ; surtout, son contenu ne peut pas être indexé, ce qui condamne toute recherche à parcourir la table. `jsonb` normalise — clés réordonnées, doublons et espaces supprimés — ce qui n'a d'importance que s'il faut restituer le document original à l'octet près.",
  },
  {
    kind: "recall",
    id: "data-adv-15",
    difficulty: 2,
    tags: ["sql", "jsonb"],
    prompt: "Quelles garanties perd-on en rangeant des données dans un `jsonb` ?",
    explanation:
      "Toutes celles que le modèle relationnel apporte à l'intérieur d'une colonne. Aucun **type** n'est vérifié : un champ qui contient un nombre peut recevoir une chaîne le lendemain. Aucune contrainte `NOT NULL`, aucune **valeur par défaut**, aucune **clé étrangère** — rien ne garantit que l'identifiant rangé dans le document corresponde à une ligne existante, et rien n'empêchera de supprimer cette ligne. Aucune **unicité** non plus, sauf index d'expression dédié. Et surtout, une faute de frappe dans un nom de clé ne produit aucune erreur : elle crée simplement une nouvelle clé, si bien que la donnée attendue est absente sans que rien ne le signale, parfois pendant des mois. C'est exactement le comportement recherché pour du contenu réellement variable — attributs propres à une catégorie, charge utile d'événement — et c'est un danger pour tout ce qui a une forme stable, qui mérite de vraies colonnes.",
    keyPoints: [
      "Aucun type vérifié, aucun NOT NULL, aucune valeur par défaut",
      "Aucune clé étrangère : rien ne garantit l'existence du référencé",
      "Une faute de frappe crée une clé au lieu de lever une erreur",
      "Acceptable pour du variable, dangereux pour du stable",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Indexer du jsonb
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "data-adv-l6",
  title: "Indexer du jsonb",
  blocks: [
    {
      kind: "text",
      text: "Sans index, toute recherche dans un `jsonb` parcourt la table entière et décompose chaque document. Sur quelques milliers de lignes, c'est indolore ; sur quelques millions, chaque requête devient un parcours complet. L'indexation est donc la question décisive dès que le volume grandit — et elle ne fonctionne pas comme celle d'une colonne ordinaire.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "L'index GIN : un seul index pour toutes les clés.",
      code: `CREATE INDEX idx_produits_attributs
    ON produits USING gin (attributs);

-- Cet index sert pour TOUTES ces requêtes, quelles
-- que soient les clés interrogées :
WHERE attributs @> '{"couleur": "rouge"}'
WHERE attributs @> '{"marque": "X", "taille": "M"}'
WHERE attributs ? 'garantie'
WHERE attributs ?| array['promo', 'solde']

-- Mais PAS pour celle-ci :
WHERE attributs ->> 'couleur' = 'rouge'   -- ← extraction`,
    },
    {
      kind: "text",
      text: "C'est la particularité la plus utile de l'index GIN : il indexe **l'ensemble du document**, donc un seul index couvre toutes les clés présentes et futures. Ajouter un nouvel attribut dans les documents ne demande aucun nouvel index — ce qui est précisément ce qu'on attend d'un stockage semi-structuré.",
    },
    {
      kind: "text",
      text: "En contrepartie, il ne sert que les opérateurs pour lesquels il a été conçu : la contenance, l'existence de clé, et les expressions de chemin. Une extraction suivie d'une comparaison ne l'utilise pas, car l'index ne connaît pas le résultat de cette extraction. C'est pourquoi la forme de la requête compte autant que l'index lui-même.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "L'index d'expression : une clé précise, très efficace.",
      code: `-- Pour une clé souvent interrogée par extraction
CREATE INDEX idx_produits_couleur
    ON produits ((attributs ->> 'couleur'));

-- Sert exactement cette forme :
WHERE attributs ->> 'couleur' = 'rouge'
-- …et aussi les comparaisons d'ordre et les tris,
-- ce qu'un GIN ne sait pas faire.

-- Variante plus compacte du GIN, si l'on n'utilise
-- QUE la contenance :
CREATE INDEX ON produits
    USING gin (attributs jsonb_path_ops);
-- Plus petit et plus rapide, mais ne gère pas
-- l'existence de clé.`,
    },
    {
      kind: "text",
      text: "L'index d'expression est un index ordinaire posé sur le résultat d'un calcul. Il est nettement plus compact qu'un GIN, supporte les comparaisons d'ordre et les tris, mais ne sert qu'une seule clé : il en faut un par champ interrogé de cette façon. C'est le bon choix pour deux ou trois attributs très sollicités.",
    },
    {
      kind: "comparison",
      title: "Choisir son index",
      left: {
        label: "GIN sur la colonne",
        text: "Couvre toutes les clés, présentes et futures, avec la contenance et l'existence. Volumineux, et plus lent à mettre à jour en écriture. Le choix par défaut quand les clés interrogées varient ou ne sont pas connues d'avance.",
      },
      right: {
        label: "Index d'expression",
        text: "Une seule clé, mais compact, rapide, et compatible avec les comparaisons d'ordre et les tris. Le choix quand une poignée d'attributs concentre l'essentiel des recherches — souvent en complément d'un GIN.",
      },
    },
    {
      kind: "text",
      text: "Le coût en écriture mérite d'être anticipé : un index GIN est sensiblement plus lourd à maintenir qu'un index ordinaire, car une seule ligne modifiée peut toucher de nombreuses entrées d'index. Sur une table à fort taux d'écriture, cela se mesure — et justifie parfois de préférer quelques index d'expression ciblés.",
    },
    {
      kind: "text",
      text: "Comme toujours, la vérification passe par le plan d'exécution. Un `EXPLAIN ANALYZE` dit si l'index est réellement utilisé, et c'est souvent là qu'on découvre qu'une requête écrite avec une extraction ignore le GIN pourtant présent. Supposer qu'un index sert parce qu'il existe est l'erreur la plus commune du domaine.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un index ne sert que la forme exacte qu'il indexe",
      text: "Un index sur `(attributs ->> 'couleur')` ne sert pas une requête écrite `attributs -> 'couleur'`, ni une comparaison insensible à la casse, ni une extraction de chemin imbriqué. L'expression indexée et l'expression de la requête doivent correspondre **littéralement**. C'est vrai pour tous les index d'expression, pas seulement sur du JSON.",
    },
    {
      kind: "text",
      text: "Un mot sur les expressions de chemin, normalisées par le standard SQL et disponibles dans Postgres. Elles permettent d'exprimer des recherches plus riches que la simple contenance — filtrer sur une condition numérique à l'intérieur d'un tableau imbriqué, par exemple — et l'opérateur associé bénéficie lui aussi de l'index GIN.",
    },
    {
      kind: "text",
      text: "Leur syntaxe est plus dense que celle des opérateurs classiques, et elles ne se justifient que pour des interrogations réellement complexes. Pour un simple test d'égalité sur une clé, la contenance reste plus lisible et tout aussi efficace — le critère habituel, préférer la forme la plus simple qui fasse le travail, s'applique ici comme ailleurs.",
    },
    {
      kind: "text",
      text: "Retenons la règle de choix : GIN quand les clés varient, index d'expression quand quelques-unes dominent, et vérification systématique par le plan d'exécution — car la forme de la requête décide autant que l'index.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "spot",
    id: "data-adv-16",
    difficulty: 3,
    tags: ["sql", "jsonb", "index"],
    prompt: "Un index GIN existe sur `attributs`. Pourtant cette requête parcourt toute la table. Quelle ligne ?",
    code: {
      language: "sql",
      code: `CREATE INDEX idx_attributs
    ON produits USING gin (attributs);

SELECT * FROM produits
WHERE attributs ->> 'couleur' = 'rouge';`,
    },
    faultyLine: 5,
    reasons: [
      "L'extraction n'est pas un opérateur servi par le GIN : il faut `attributs @> '{\"couleur\": \"rouge\"}'` ou un index d'expression.",
      "L'index GIN doit être créé avec `jsonb_path_ops` pour être utilisable.",
      "`->>` doit être remplacé par `->` pour que l'index soit consulté.",
      "Il manque un `ANALYZE` après la création de l'index.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un index GIN sur du `jsonb` sert la contenance, l'existence de clé et les expressions de chemin — pas le résultat d'une extraction, qu'il ne connaît pas. Deux corrections possibles : réécrire avec l'opérateur de contenance, ou créer un index d'expression sur `(attributs ->> 'couleur')`. C'est la forme de la requête qui décide, autant que l'index.",
  },
  {
    kind: "mcq",
    id: "data-adv-17",
    difficulty: 2,
    tags: ["sql", "jsonb", "index"],
    prompt: "Quel est l'avantage principal d'un index GIN sur une colonne `jsonb` ?",
    choices: [
      "Un seul index couvre toutes les clés du document, présentes et futures.",
      "Il permet les comparaisons d'ordre et les tris sur n'importe quelle clé.",
      "Il est plus compact et plus rapide en écriture qu'un index ordinaire.",
      "Il valide automatiquement la structure des documents insérés.",
    ],
    answer: 0,
    explanation:
      "C'est la propriété qui correspond à l'esprit du stockage semi-structuré : ajouter un nouvel attribut dans les documents ne demande aucun nouvel index. En contrepartie, il est volumineux, plus lourd à maintenir en écriture, et ne gère ni les comparaisons d'ordre ni les tris — ce que fait au contraire un index d'expression sur une clé précise.",
  },
  {
    kind: "recall",
    id: "data-adv-18",
    difficulty: 2,
    tags: ["sql", "jsonb", "index"],
    prompt: "Comment choisir entre un index GIN et un index d'expression sur du `jsonb` ?",
    explanation:
      "Selon la **variabilité des clés interrogées**. Si les recherches portent sur des attributs qui changent, ne sont pas connus d'avance, ou se combinent librement, l'index GIN est le bon choix : un seul index couvre l'ensemble du document, y compris les clés ajoutées plus tard, et il sert la contenance comme l'existence de clé. Si en revanche deux ou trois attributs concentrent l'essentiel des recherches, un index d'expression sur chacun est nettement plus compact, plus léger en écriture, et il apporte en prime les comparaisons d'ordre et les tris — ce qu'un GIN ne sait pas faire. Les deux se combinent très bien : un GIN pour la recherche générale, quelques index d'expression pour les accès les plus fréquents. Dans tous les cas, la forme de la requête doit correspondre à ce que l'index sait servir, et seul un plan d'exécution le confirme — supposer qu'un index est utilisé parce qu'il existe est l'erreur la plus commune.",
    keyPoints: [
      "Clés variables ou inconnues d'avance : GIN",
      "Quelques attributs dominants : index d'expression, plus compact",
      "L'index d'expression apporte l'ordre et le tri",
      "Vérifier par le plan : la forme de la requête décide aussi",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Les types qui font gagner
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "data-adv-l7",
  title: "Les types qui font gagner",
  blocks: [
    {
      kind: "text",
      text: "Beaucoup de schémas n'utilisent que quatre types : texte, entier, décimal et horodatage. Postgres en propose bien d'autres, dont plusieurs remplacent avantageusement des colonnes et de la logique applicative. Les connaître évite de réimplémenter mal ce que le moteur fait bien.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Quatre types qui remplacent du code.",
      code: `-- UUID : 16 octets, pas 36 caractères de texte
id uuid PRIMARY KEY DEFAULT gen_random_uuid()

-- INTERVALLE DE TEMPS : une seule colonne pour une
-- période, avec des opérateurs de chevauchement
periode tstzrange NOT NULL,
-- Et une contrainte d'exclusion qui interdit deux
-- réservations qui se chevauchent :
EXCLUDE USING gist (salle_id WITH =, periode WITH &&)

-- TABLEAU : évite une table de liaison pour des
-- valeurs simples et peu nombreuses
tags text[] DEFAULT '{}'

-- ADRESSE RÉSEAU : validée, comparable, avec
-- opérateurs de sous-réseau
ip inet`,
    },
    {
      kind: "text",
      text: "La contrainte d'exclusion mérite d'être connue car elle résout un problème réputé difficile : garantir qu'aucune réservation ne chevauche une autre pour la même salle. Écrite côté applicatif, cette vérification est sujette aux courses — deux insertions simultanées passent toutes deux le contrôle. Déclarée ainsi, elle est garantie par la base.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Les colonnes générées : un calcul stocké et fiable.",
      code: `CREATE TABLE lignes (
    quantite   int      NOT NULL,
    prix       numeric(12,2) NOT NULL,
    total      numeric(12,2)
        GENERATED ALWAYS AS (quantite * prix) STORED
);

-- · Impossible à désynchroniser : la base recalcule
-- · Indexable, contrairement à un calcul applicatif
-- · Refuse toute écriture directe sur « total »

-- Usage fréquent sur du jsonb, pour extraire un
-- champ chaud en colonne typée et indexable :
statut text GENERATED ALWAYS AS
    (attributs ->> 'statut') STORED`,
    },
    {
      kind: "text",
      text: "La colonne générée résout élégamment le compromis du `jsonb` : on garde la souplesse du document tout en extrayant en colonne typée les quelques champs qui méritent contraintes et index. Le champ reste unique — il n'existe qu'une source — et la base garantit la cohérence, ce qu'un déclencheur écrit à la main ne fait pas aussi sûrement.",
    },
    {
      kind: "comparison",
      title: "Deux façons de représenter un ensemble fermé",
      left: {
        label: "Type énuméré",
        text: "`CREATE TYPE statut AS ENUM (…)`. Compact, ordonné, et la base refuse toute valeur hors liste. En contrepartie, ajouter une valeur est une migration, et en retirer une est franchement pénible.",
      },
      right: {
        label: "Texte avec contrainte",
        text: "`text CHECK (statut IN (…))`. Même garantie, et la modification de la liste est une simple migration de contrainte. Légèrement plus volumineux. C'est le choix par défaut quand la liste peut évoluer.",
      },
    },
    {
      kind: "text",
      text: "Un rappel s'impose sur les types numériques, car l'erreur est coûteuse : un montant monétaire ne doit jamais être stocké en virgule flottante. `numeric` conserve la précision décimale exacte, là où un flottant introduit des écarts qui s'accumulent et produisent des totaux faux de quelques centimes — impossibles à expliquer à un comptable.",
    },
    {
      kind: "text",
      text: "Enfin, le type d'horodatage **avec fuseau** devrait être le défaut. Il conserve un instant absolu et le convertit à l'affichage ; sans fuseau, on stocke une date-heure sans point de référence, dont le sens dépend de la machine qui l'a écrite. C'est exactement la distinction entre `Instant` et `LocalDateTime` côté Java.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Les tableaux, avec discernement",
      text: "Un tableau évite une table de liaison pour quelques étiquettes, et s'indexe en GIN. Mais il n'offre ni clé étrangère, ni contrainte sur les éléments, et devient pénible dès qu'on veut compter, trier ou joindre dessus. La règle utile : un tableau pour des valeurs simples et accessoires, une vraie table dès qu'il s'agit d'entités référencées ailleurs.",
    },
    {
      kind: "text",
      text: "Les identifiants méritent enfin une remarque. Un identifiant universel évite de dépendre d'une séquence centrale et permet de générer la clé côté applicatif, ce qui simplifie les insertions groupées et les systèmes répartis. En contrepartie, sa distribution aléatoire disperse les écritures dans l'index, ce qui coûte davantage qu'une séquence ordonnée sur les très gros volumes.",
    },
    {
      kind: "text",
      text: "Des variantes ordonnées dans le temps existent et combinent les deux avantages : unicité sans coordination, et croissance monotone qui préserve la localité des écritures. C'est le compromis à connaître quand le volume rend le sujet réel — en dessous, la question ne se pose pas vraiment.",
    },
    {
      kind: "text",
      text: "Retenons que choisir un type précis fait gagner sur trois plans à la fois : l'espace, la justesse — puisque la base refuse ce qui n'a pas de sens — et le code applicatif qu'on n'a pas à écrire. C'est l'une des décisions les moins coûteuses et les plus durables d'un schéma.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "match",
    id: "data-adv-19",
    difficulty: 2,
    tags: ["sql", "types"],
    prompt: "Associe chaque besoin au type Postgres approprié.",
    pairs: [
      { left: "Une période, avec test de chevauchement", right: "tstzrange, avec contrainte d'exclusion" },
      { left: "Un montant monétaire", right: "numeric, jamais un flottant" },
      { left: "Un total toujours cohérent avec ses facteurs", right: "Colonne générée STORED" },
      { left: "Un instant absolu, comparable entre machines", right: "timestamptz, avec fuseau" },
    ],
    explanation:
      "La contrainte d'exclusion sur un intervalle résout un problème réputé difficile : garantir qu'aucune réservation ne chevauche une autre. Écrite côté applicatif, cette vérification est sujette aux courses — deux insertions simultanées passent toutes deux le contrôle. Déclarée dans la table, elle est garantie par le moteur.",
  },
  {
    kind: "mcq",
    id: "data-adv-20",
    difficulty: 2,
    tags: ["sql", "types", "jsonb"],
    prompt: "Comment rendre un champ `jsonb` très interrogé à la fois typé, contraint et indexable ?",
    choices: [
      "Par une colonne générée qui l'extrait : `GENERATED ALWAYS AS (attributs ->> 'statut') STORED`.",
      "En le dupliquant dans une colonne ordinaire mise à jour par l'application.",
      "En ajoutant une contrainte `CHECK` directement sur la clé du document.",
      "En convertissant toute la colonne `jsonb` en `json`, qui accepte les contraintes.",
    ],
    answer: 0,
    explanation:
      "La colonne générée résout le compromis : on garde la souplesse du document tout en extrayant en colonne typée les quelques champs qui méritent contraintes et index. Il n'existe qu'une source de vérité — la base recalcule — là où une duplication applicative peut se désynchroniser. Aucune contrainte ne s'applique à l'intérieur d'un `jsonb`.",
  },
  {
    kind: "fill",
    id: "data-adv-21",
    difficulty: 2,
    tags: ["sql", "types"],
    prompt: "Complète les deux choix de type qui évitent des erreurs coûteuses.",
    code: {
      language: "sql",
      code: `CREATE TABLE lignes (
    -- Montant monétaire : precision decimale exacte
    prix   {{1}}(12,2) NOT NULL,

    -- Instant absolu, comparable entre machines
    cree_le {{2}} NOT NULL DEFAULT now()
);`,
    },
    blanks: ["numeric", "timestamptz"],
    distractors: ["float", "double precision", "timestamp", "date"],
    explanation:
      "Un flottant introduit des écarts qui s'accumulent et produisent des totaux faux de quelques centimes, impossibles à expliquer à un comptable. Et un horodatage **sans** fuseau stocke une date-heure sans point de référence, dont le sens dépend de la machine qui l'a écrite — exactement la distinction entre `Instant` et `LocalDateTime` côté Java.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Quand ne pas utiliser jsonb
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "data-adv-l8",
  title: "Quand ne pas utiliser jsonb",
  blocks: [
    {
      kind: "text",
      text: "Le confort de `jsonb` est réel : on ajoute un champ sans migration, sans discussion, sans attendre. C'est exactement ce qui en fait un piège — la facilité d'écriture masque la perte de toutes les garanties, et la dette ne se manifeste que des mois plus tard.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le schéma qui n'en est plus un.",
      code: `CREATE TABLE clients (
    id   uuid PRIMARY KEY,
    data jsonb NOT NULL
);

-- Six mois plus tard, dans la même table :
{"nom": "Alice", "email": "a@x.fr", "actif": true}
{"nom": "Bob",   "mail":  "b@x.fr", "actif": "oui"}
{"name":"Carol", "email": null,     "active": 1}

-- · Trois orthographes pour le courriel
-- · « actif » est booléen, chaîne, puis entier
-- · Aucune erreur n'a jamais été levée
-- Écrire une requête fiable est devenu impossible.`,
    },
    {
      kind: "text",
      text: "Cette dégradation est progressive et silencieuse. Chaque écart pris isolément paraît anodin — un développeur écrit `mail` au lieu de `email`, un autre stocke `\"oui\"` au lieu de `true` — et aucune erreur ne se produit jamais. Le jour où l'on veut compter les clients actifs, on découvre qu'il faut gérer trois représentations, et que personne ne sait combien d'autres existent.",
    },
    {
      kind: "comparison",
      title: "Le critère qui tranche",
      left: {
        label: "Colonnes relationnelles",
        text: "Quand la forme est **stable** et connue : nom, courriel, date de naissance, statut. Types vérifiés, contraintes, clés étrangères, index naturels, et une migration explicite quand la forme change — ce qui est une force, pas une gêne.",
      },
      right: {
        label: "jsonb",
        text: "Quand la forme est **réellement variable** : attributs propres à une catégorie de produit, charge utile d'un événement dont le type décide du contenu, préférences libres, réponse d'une API tierce conservée telle quelle.",
      },
    },
    {
      kind: "text",
      text: "La question à poser est donc simple : cette structure varie-t-elle **par nature**, ou bien ne veut-on pas écrire la migration ? Le second cas est de très loin le plus fréquent, et c'est celui qui produit les schémas illisibles. Une migration coûte quinze minutes ; un champ mal typé dans un document en coûte beaucoup plus, plus tard.",
    },
    {
      kind: "text",
      text: "Le motif hybride est souvent le bon compromis : des colonnes pour tout ce qui est stable et interrogé, un `jsonb` pour le reste. On garde les garanties là où elles comptent, la souplesse là où elle est nécessaire, et l'on peut extraire un champ du document vers une colonne le jour où il se stabilise.",
    },
    {
      kind: "text",
      text: "Cette extraction est d'ailleurs la trajectoire naturelle d'un champ : il commence dans le document quand on ne sait pas encore s'il sera utile, et migre en colonne quand il devient central. Prévoir ce mouvement dès le départ — et le faire quand le moment vient — évite que le document ne devienne le schéma par défaut.",
    },
    {
      kind: "text",
      text: "Un dernier argument est rarement évoqué et pèse lourd : la **découvrabilité**. Un schéma relationnel se lit, se documente automatiquement, et un nouvel arrivant comprend le modèle en regardant les tables. Un `jsonb` n'expose rien : il faut lire le code applicatif, ou échantillonner les documents en espérant tomber sur toutes les variantes.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Valider à l'entrée, faute de contraintes",
      text: "Si une structure stable doit malgré tout vivre dans un `jsonb`, la validation doit se faire côté applicatif, à la frontière, avec un schéma explicite. Ce n'est pas équivalent — rien n'empêche une écriture directe en base — mais cela évite au moins que l'application elle-même ne produise des variantes. Sans cela, la dérive est certaine.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le motif hybride : colonnes pour le stable, document pour le reste.",
      code: `CREATE TABLE produits (
    id        uuid PRIMARY KEY,
    -- Stable, interrogé, contraint : des colonnes
    reference text NOT NULL UNIQUE,
    nom       text NOT NULL,
    prix      numeric(12,2) NOT NULL CHECK (prix >= 0),
    categorie text NOT NULL REFERENCES categories(code),

    -- Variable par nature : un document
    attributs jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX ON produits USING gin (attributs);`,
    },
    {
      kind: "text",
      text: "Ce schéma dit clairement ce qui est garanti et ce qui ne l'est pas, ce qu'aucune des deux approches pures ne permet. Un nouvel arrivant lit la table et comprend immédiatement le cœur du modèle, tout en voyant qu'une partie est ouverte — information bien plus honnête qu'un document unique dont il faudrait deviner le contenu.",
    },
    {
      kind: "text",
      text: "Retenons la question qui tranche : la forme varie-t-elle par nature ? Si oui, `jsonb` est l'outil juste. Si non, ce sont des colonnes — et la migration qu'on cherchait à éviter est précisément ce qui garde le schéma honnête.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "spot",
    id: "data-adv-22",
    difficulty: 2,
    tags: ["sql", "jsonb", "conception"],
    prompt: "Cette table va dériver en quelques mois. Quelle ligne pose problème ?",
    code: {
      language: "sql",
      code: `CREATE TABLE clients (
    id   uuid PRIMARY KEY,
    data jsonb NOT NULL
);

-- data contient : nom, email, date de naissance, statut`,
    },
    faultyLine: 3,
    reasons: [
      "Une structure stable et connue est rangée dans un document : ni type, ni contrainte, ni clé étrangère, et les variantes s'accumulent en silence.",
      "`jsonb` ne peut pas être déclaré `NOT NULL`.",
      "La clé primaire devrait être un entier séquentiel plutôt qu'un `uuid`.",
      "Il manque un index GIN sur la colonne `data`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Nom, courriel, date de naissance et statut ont une forme parfaitement stable : ce sont des colonnes. Rangés dans un document, ils perdent tout contrôle — trois orthographes du courriel finiront par coexister, et le champ de statut sera tour à tour booléen, chaîne et entier, sans qu'aucune erreur ne soit levée. Le critère est la variabilité **par nature**, pas l'envie d'éviter une migration.",
  },
  {
    kind: "mcq",
    id: "data-adv-23",
    difficulty: 2,
    tags: ["sql", "jsonb", "conception"],
    prompt: "Quelle question décide entre des colonnes et un `jsonb` ?",
    choices: [
      "Cette structure varie-t-elle par nature, ou bien ne veut-on pas écrire la migration ?",
      "Le volume de données dépassera-t-il un million de lignes ?",
      "L'application est-elle écrite dans un langage typé statiquement ?",
      "Le champ sera-t-il interrogé plus de dix fois par seconde ?",
    ],
    answer: 0,
    explanation:
      "Le second cas — éviter la migration — est de très loin le plus fréquent, et c'est celui qui produit les schémas illisibles. Une migration coûte quinze minutes ; un champ mal typé dans un document coûte beaucoup plus, plus tard, quand trois représentations coexistent et que personne ne sait combien d'autres existent.",
  },
  {
    kind: "match",
    id: "data-adv-24",
    difficulty: 2,
    tags: ["sql", "jsonb", "conception"],
    prompt: "Associe chaque donnée au stockage approprié.",
    pairs: [
      { left: "Nom, courriel, date de naissance", right: "Colonnes : forme stable, contraintes utiles" },
      { left: "Attributs propres à une catégorie de produit", right: "jsonb : forme variable par nature" },
      { left: "Charge utile d'un événement, selon son type", right: "jsonb : le contenu dépend du type" },
      { left: "Un champ du document devenu central", right: "À extraire en colonne, générée ou migrée" },
    ],
    explanation:
      "Le motif hybride est souvent le bon compromis : des colonnes pour ce qui est stable et interrogé, un document pour le reste. L'extraction d'un champ vers une colonne est la trajectoire naturelle — il commence dans le document quand on ne sait pas s'il servira, et en sort quand il devient central.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "data-sql-avance",
  title: "SQL avancé : fenêtres, récursivité, jsonb et types",
  objective:
    "Aller au-delà du SQL courant : agréger sans regrouper avec les fonctions fenêtre, maîtriser partition, ordre et cadre, structurer une requête avec des expressions de table, parcourir une hiérarchie sans boucle infinie, stocker et indexer du semi-structuré, choisir des types qui remplacent du code, et savoir quand le document est un mauvais choix.",
  prerequisites: ["data-sql-postgres"],
  format: "detaille",
  units: [
    l1, ...ex1,
    l2, ...ex2,
    l3, ...ex3,
    l4, ...ex4,
    l5, ...ex5,
    l6, ...ex6,
    l7, ...ex7,
    l8, ...ex8,
  ],
};
