/**
 * Spring — Migrations de schéma (référentiel 3.5) : Flyway, écriture sûre,
 * déploiement sans interruption, travail en équipe.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Pourquoi versionner le schéma
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-migr-l1",
  title: "Pourquoi versionner le schéma",
  blocks: [
    {
      kind: "text",
      text: "Le code est versionné, testé, revu, déployé de façon reproductible. La base de données, elle, est souvent modifiée à la main par la personne qui en a besoin, un soir, avec une commande tapée dans un terminal. Le résultat est prévisible : trois environnements avec trois schémas légèrement différents, et personne pour dire lequel fait foi.",
    },
    {
      kind: "text",
      text: "Les symptômes sont reconnaissables. Une fonctionnalité marche en recette et échoue en production sur une colonne absente. Un nouvel arrivant met deux jours à obtenir une base qui fonctionne. Un correctif ne peut pas être déployé parce que personne ne sait si la modification de schéma qu'il suppose a été appliquée. Chacun de ces incidents vient de la même cause : le schéma n'a pas d'historique.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le principe : le schéma devient du code.",
      code: `src/main/resources/db/migration/
  V1__creation_initiale.sql
  V2__ajout_table_commandes.sql
  V3__index_sur_client_id.sql
  V4__colonne_statut_commande.sql

· Versionnées avec le code, dans le même dépôt
· Appliquées automatiquement au démarrage
· Dans l'ordre, une seule fois, sur chaque environnement
· Ce qui a été appliqué est tracé dans la base elle-même

→ Une base vide + les migrations = le schéma attendu,
  identique partout, reproductible à volonté.`,
    },
    {
      kind: "text",
      text: "L'idée tient en une phrase : le schéma n'est plus un état qu'on modifie, c'est une **suite d'opérations** qu'on rejoue. La base ne se décrit plus par ce qu'elle contient aujourd'hui, mais par l'historique des changements qui l'ont amenée là — exactement comme un dépôt de code se décrit par sa suite de commits.",
    },
    {
      kind: "text",
      text: "Le bénéfice le plus immédiat est la reproductibilité. Un développeur qui arrive lance l'application sur une base vide et obtient le schéma exact, sans demander un export à quiconque. Un test d'intégration démarre un conteneur Postgres neuf, applique les migrations, et travaille sur la même structure qu'en production — ce qui rend enfin crédible ce que le test vérifie.",
    },
    {
      kind: "comparison",
      title: "Deux approches, deux philosophies",
      left: {
        label: "Flyway",
        text: "Des fichiers SQL numérotés, exécutés dans l'ordre. On écrit le SQL du moteur cible, sans abstraction. Simple à lire, simple à déboguer, et l'on sait exactement ce qui sera exécuté. C'est le choix majoritaire.",
      },
      right: {
        label: "Liquibase",
        text: "Un journal de changements en XML, YAML ou SQL, avec une abstraction du dialecte et des retours en arrière déclarés. Plus riche, utile en environnement multi-moteurs, au prix d'une couche de plus entre l'intention et le SQL exécuté.",
      },
    },
    {
      kind: "text",
      text: "Le choix entre les deux est moins important que la décision de versionner. Flyway convient à l'immense majorité des projets — un seul moteur, du SQL lisible, un mécanisme qu'on comprend en dix minutes. Liquibase se justifie quand plusieurs moteurs doivent être servis par le même journal, ou quand l'organisation exige des descriptions de retour en arrière formalisées.",
    },
    {
      kind: "text",
      text: "Un point d'organisation compte autant que l'outil : les migrations vivent dans le **même dépôt que le code** et sont livrées dans la même version. Une migration séparée du code qui en dépend rouvre exactement le problème qu'on voulait fermer — savoir si le schéma correspond à l'application déployée. Le couple code plus migration doit être atomique.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une modification manuelle casse tout",
      text: "Il suffit d'un `ALTER TABLE` tapé directement en production pour que la base ne corresponde plus à son historique. Les migrations suivantes peuvent alors échouer — la colonne existe déjà — ou pire, réussir sur un schéma que personne ne peut plus reproduire. La règle est absolue : aucune modification de schéma hors migration, y compris en urgence.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Ce qu'il y a à configurer, et c'est à peu près tout.",
      code: `spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    # Sur une base existante non gérée jusqu'ici :
    baseline-on-migrate: true
  jpa:
    hibernate:
      ddl-auto: validate     # JPA vérifie, il ne crée pas

# Les migrations s'appliquent au démarrage, avant que
# le contexte applicatif ne soit prêt à servir.`,
    },
    {
      kind: "text",
      text: "La configuration tient en quelques lignes parce que l'outil fait peu de choses : détecter les fichiers, comparer à l'historique, appliquer ce qui manque. C'est cette petite surface qui explique son adoption — on peut lire toute sa configuration et prévoir exactement ce qu'il fera au prochain démarrage, ce qui n'est pas donné à tous les outils d'infrastructure.",
    },
    {
      kind: "text",
      text: "En entretien, la question tombe souvent sous la forme « comment gérez-vous les évolutions de base ? ». La réponse attendue nomme l'outil, mais surtout le principe : le schéma est du code, versionné avec l'application, appliqué automatiquement, jamais modifié à la main. Les candidats qui décrivent un script partagé sur un lecteur réseau décrivent le problème, pas la solution.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-migr-01",
    difficulty: 1,
    tags: ["migrations", "schema"],
    prompt: "Quel est le principe d'un outil de migration de schéma ?",
    choices: [
      "Le schéma n'est plus un état qu'on modifie mais une suite d'opérations versionnées qu'on rejoue.",
      "Le schéma est déduit automatiquement des entités JPA à chaque démarrage.",
      "Le schéma de production est exporté puis importé dans les autres environnements.",
      "Chaque environnement conserve son schéma, synchronisé manuellement avant les livraisons.",
    ],
    answer: 0,
    explanation:
      "La base ne se décrit plus par ce qu'elle contient aujourd'hui mais par l'historique des changements qui l'ont amenée là — exactement comme un dépôt de code. Une base vide plus les migrations redonne le schéma exact, partout, ce qui rend reproductibles aussi bien le poste d'un nouvel arrivant que les tests d'intégration.",
  },
  {
    kind: "match",
    id: "spring-migr-02",
    difficulty: 2,
    tags: ["migrations", "schema"],
    prompt: "Associe chaque symptôme à ce qu'il révèle.",
    pairs: [
      { left: "Ça marche en recette, ça casse en production", right: "Les schémas des environnements ont divergé" },
      { left: "Deux jours pour qu'un nouvel arrivant démarre", right: "Aucun moyen reproductible de créer la base" },
      { left: "Personne ne sait si l'ALTER a été appliqué", right: "Le schéma n'a pas d'historique tracé" },
      { left: "Une migration échoue : la colonne existe déjà", right: "Une modification manuelle hors migration" },
    ],
    explanation:
      "Ces quatre symptômes ont la même cause : le schéma n'est pas versionné, ou l'a été puis contourné à la main. Le dernier est le plus grave — une modification manuelle rend la base impossible à reproduire, et les migrations suivantes échouent ou, pire, réussissent sur un schéma dont plus personne n'a le modèle.",
  },
  {
    kind: "recall",
    id: "spring-migr-03",
    difficulty: 2,
    tags: ["migrations", "schema"],
    prompt: "Pourquoi les migrations doivent-elles vivre dans le même dépôt que le code ?",
    explanation:
      "Parce que le code et le schéma qu'il suppose forment un couple indissociable. Une migration livrée séparément rouvre exactement la question qu'on voulait fermer : le schéma déployé correspond-il à la version de l'application qui tourne ? Dans le même dépôt et la même version, la réponse est garantie par construction — déployer la version 4.2 applique les migrations de la 4.2, et la revue de code couvre les deux d'un seul mouvement. Cela donne aussi la reproductibilité : une base vide plus les migrations du dépôt redonne le schéma exact sur le poste d'un nouvel arrivant comme dans un conteneur de test, ce qui rend enfin crédible ce que vérifient les tests d'intégration. Un script de migration posé sur un lecteur réseau, appliqué à la main, décrit le problème et non la solution.",
    keyPoints: [
      "Code et schéma forment un couple : même version, même livraison",
      "La correspondance devient garantie par construction",
      "La revue couvre les deux ensemble",
      "Base vide + migrations = schéma exact, partout",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Flyway : versions, historique et empreintes
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-migr-l2",
  title: "Flyway : versions, historique et empreintes",
  blocks: [
    {
      kind: "text",
      text: "Flyway repose sur une mécanique volontairement simple, qu'on peut décrire entièrement en quelques lignes : des fichiers nommés selon une convention, une table qui trace ce qui a été appliqué, et une empreinte qui détecte les modifications après coup. Comprendre ces trois éléments suffit à diagnostiquer la quasi-totalité des problèmes rencontrés.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La convention de nommage, à respecter strictement.",
      code: `V2__ajout_colonne_statut.sql
│└┬┘└┬┘└──────────┬─────────┘
│ │  │            └── description, lisible
│ │  └── DEUX tirets bas : le séparateur
│ └── version, comparée numériquement
└── V = versionnée (une fois), R = répétable

V1__creation.sql          appliquée une fois, dans l'ordre
V2__ajout_commandes.sql
V2.1__index.sql           les décimales sont permises
R__vue_statistiques.sql   rejouée à CHAQUE changement
                          de son contenu — pour les vues,
                          fonctions, procédures

Emplacement par défaut : db/migration dans les ressources.`,
    },
    {
      kind: "text",
      text: "Le double tiret bas est la faute la plus fréquente : un seul, et le fichier est ignoré en silence — la migration n'est jamais appliquée, et l'on cherche longtemps pourquoi la colonne n'existe pas. Les migrations répétables, préfixées par `R`, sont réexécutées dès que leur contenu change, ce qui convient exactement aux objets qu'on redéfinit plutôt qu'on ne modifie : vues, fonctions, procédures.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "La table d'historique, et ce qu'elle contient.",
      code: `SELECT version, description, checksum, success, installed_on
FROM flyway_schema_history ORDER BY installed_rank;

 version |     description      |  checksum   | success
---------+----------------------+-------------+---------
 1       | creation initiale    |  1874923410 | t
 2       | ajout commandes      | -0912384710 | t
 3       | index sur client id  |  1122390847 | t

-- À chaque démarrage, Flyway :
--  1. lit cette table
--  2. compare l'empreinte de chaque fichier déjà
--     appliqué à celle enregistrée
--  3. applique dans l'ordre celles qui manquent`,
    },
    {
      kind: "text",
      text: "L'empreinte est le mécanisme de protection central. Elle est calculée sur le contenu du fichier au moment de l'application et enregistrée. Si quelqu'un modifie ensuite une migration déjà appliquée, l'empreinte ne correspond plus, et Flyway **refuse de démarrer**. Le message est explicite et cette rigueur est voulue : elle garantit que ce qui a été exécuté quelque part est exactement ce que le dépôt contient.",
    },
    {
      kind: "comparison",
      title: "Deux réactions face à une empreinte invalide",
      left: {
        label: "La bonne",
        text: "Annuler la modification du fichier et écrire une **nouvelle** migration qui applique le changement souhaité. L'historique reste vrai, tous les environnements convergent, et rien n'est réécrit après coup.",
      },
      right: {
        label: "La tentante",
        text: "`flyway repair`, qui réaligne les empreintes sur les fichiers. Réservé au cas où une migration a échoué à mi-parcours. L'utiliser pour légitimer une modification laisse les environnements déjà migrés dans un état différent de ce que le fichier décrit.",
      },
    },
    {
      kind: "text",
      text: "Cette distinction est celle qu'on retient le mieux en la formulant comme une règle absolue : **une migration appliquée quelque part ne se modifie jamais**. Même pour corriger une faute de frappe dans un commentaire, même si « personne n'a encore déployé » — car quelqu'un l'a forcément appliquée sur son poste, et son historique local ne correspondra plus.",
    },
    {
      kind: "text",
      text: "Un point rassure quand on démarre : Flyway pose un **verrou** avant de migrer. Si trois instances démarrent en même temps lors d'un déploiement, une seule applique les migrations et les autres attendent la fin. Il n'y a donc pas de course, et rien de particulier à prévoir pour un déploiement en plusieurs exemplaires.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Adopter Flyway sur une base existante",
      text: "`baseline-on-migrate` demande à Flyway de considérer le schéma actuel comme la version de référence et de n'appliquer que ce qui vient après. On écrit alors une `V1` décrivant l'existant — utile pour recréer la base à neuf — et l'on continue normalement. Sans cette option, Flyway refuse une base non vide dont il n'a pas l'historique.",
    },
    {
      kind: "text",
      text: "Un détail de configuration mérite d'être connu : `out-of-order`. Par défaut, Flyway refuse d'appliquer une migration dont le numéro est inférieur à la version déjà atteinte — le cas d'une branche fusionnée tardivement. L'autoriser peut débloquer une situation, mais fait perdre la garantie que l'ordre d'application est le même partout, ce qui compte dès que deux migrations interagissent.",
    },
    {
      kind: "text",
      text: "Ces quelques éléments — nommage, table d'historique, empreinte, verrou — couvrent l'essentiel du fonctionnement. Le reste de l'outil est configuration, et la plupart des équipes n'y touchent jamais. C'est précisément cette petite surface qui explique son adoption : on peut en comprendre le comportement complet en une lecture.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "fill",
    id: "spring-migr-04",
    difficulty: 1,
    tags: ["migrations", "flyway"],
    prompt: "Complète le nom de fichier et le préfixe d'une migration rejouable.",
    code: {
      language: "text",
      code: `# Migration versionnée numéro 3
V3{{1}}index_sur_client_id.sql

# Vue redéfinie à chaque changement de contenu
{{2}}__vue_statistiques.sql`,
    },
    blanks: ["__", "R"],
    distractors: ["_", "-", "V", "U"],
    explanation:
      "Le séparateur est un **double** tiret bas : avec un seul, le fichier est ignoré en silence et la migration n'est jamais appliquée — une faute qu'on cherche longtemps. Le préfixe `R` désigne une migration répétable, réexécutée dès que son contenu change, ce qui convient aux objets qu'on redéfinit plutôt qu'on ne modifie : vues, fonctions, procédures.",
  },
  {
    kind: "mcq",
    id: "spring-migr-05",
    difficulty: 2,
    tags: ["migrations", "flyway"],
    prompt: "Flyway refuse de démarrer : l'empreinte de `V2` ne correspond plus. Que faire ?",
    choices: [
      "Annuler la modification de `V2` et écrire une nouvelle migration `V5` qui applique le changement souhaité.",
      "Lancer `flyway repair` pour réaligner l'empreinte sur le fichier modifié.",
      "Supprimer la ligne correspondante dans `flyway_schema_history`.",
      "Renommer `V2` en `V2.1` pour que Flyway la considère comme nouvelle.",
    ],
    answer: 0,
    explanation:
      "Une migration appliquée quelque part ne se modifie jamais : l'empreinte garantit que ce qui a été exécuté est exactement ce que le dépôt décrit. `repair` est réservé au cas d'une migration ayant échoué à mi-parcours ; l'utiliser ici laisserait les environnements déjà migrés dans un état différent de ce que le fichier prétend. La correction s'écrit toujours dans une nouvelle migration.",
  },
  {
    kind: "recall",
    id: "spring-migr-06",
    difficulty: 2,
    tags: ["migrations", "flyway"],
    prompt: "À quoi servent l'empreinte et le verrou de Flyway ?",
    explanation:
      "L'**empreinte** est calculée sur le contenu de chaque migration au moment de son application et enregistrée dans la table d'historique. À chaque démarrage, Flyway la recalcule et compare : si un fichier déjà appliqué a été modifié depuis, l'application refuse de démarrer. Cette rigueur garantit que ce qui a été exécuté sur un environnement est exactement ce que le dépôt décrit — sans elle, un fichier corrigé après coup donnerait deux bases différentes prétendant être à la même version. Le **verrou** répond à un autre besoin : lors d'un déploiement, plusieurs instances démarrent souvent en même temps. Flyway prend un verrou dans la base avant de migrer, si bien qu'une seule instance applique les migrations pendant que les autres attendent. Il n'y a donc pas de course à prévoir, ni de précaution particulière pour un déploiement en plusieurs exemplaires.",
    keyPoints: [
      "L'empreinte détecte toute modification d'une migration appliquée",
      "Elle garantit que l'exécuté correspond au dépôt",
      "Le verrou évite que plusieurs instances migrent en même temps",
      "Aucune précaution particulière pour un déploiement multiple",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Écrire une migration sûre
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-migr-l3",
  title: "Écrire une migration sûre",
  blocks: [
    {
      kind: "text",
      text: "Une migration qui fonctionne sur une table de dix lignes en développement peut immobiliser la production pendant vingt minutes sur une table de dix millions. La différence ne se voit nulle part dans le fichier : c'est le volume, et surtout les **verrous** que l'opération prend, qui décident.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Ce qui bloque, et ce qui ne bloque pas.",
      code: `-- Instantané, quel que soit le volume :
ALTER TABLE commandes ADD COLUMN statut varchar(20);
-- (Postgres 11+ : même avec une valeur par défaut
--  constante, la table n'est pas réécrite)

-- BLOQUE la table le temps de la réécriture :
ALTER TABLE commandes ALTER COLUMN montant TYPE numeric(19,4);

-- BLOQUE en écriture pendant toute la création :
CREATE INDEX idx_commandes_client ON commandes(client_id);

-- Ne bloque PAS les écritures, mais ne peut pas
-- s'exécuter dans une transaction :
CREATE INDEX CONCURRENTLY idx_commandes_client
    ON commandes(client_id);`,
    },
    {
      kind: "text",
      text: "L'ajout d'une colonne acceptant les valeurs nulles est instantané sur Postgres moderne : seule la description de la table change, les lignes existantes ne sont pas touchées. Le changement de type, lui, réécrit toute la table et prend un verrou exclusif — aucune lecture ni écriture ne passe pendant ce temps. Ces deux opérations se ressemblent dans un fichier SQL et n'ont rien de commun à l'exécution.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "La création d'index sans interruption.",
      code: `-- Flyway exécute chaque migration dans une transaction.
-- CREATE INDEX CONCURRENTLY l'interdit : il faut le dire.
-- flyway:executeInTransaction=false

CREATE INDEX CONCURRENTLY IF NOT EXISTS
    idx_commandes_client ON commandes(client_id);

-- Conséquence : en cas d'échec, rien n'est annulé.
-- L'index reste en état « invalide » et doit être
-- supprimé avant de réessayer. D'où le IF NOT EXISTS,
-- et une vérification après coup.`,
    },
    {
      kind: "text",
      text: "La création concurrente est le bon outil sur une table volumineuse, mais elle impose une contrepartie qu'il faut connaître : elle ne peut pas s'exécuter dans une transaction, donc rien n'est annulé en cas d'échec. Un index laissé invalide doit être supprimé à la main avant de réessayer, ce qui suppose de vérifier après coup plutôt que de supposer.",
    },
    {
      kind: "comparison",
      title: "Ajouter une contrainte NOT NULL",
      left: {
        label: "Directement",
        text: "`ALTER TABLE … SET NOT NULL` doit vérifier toutes les lignes, en tenant un verrou exclusif pendant la vérification. Sur une grande table, c'est une immobilisation proportionnelle au volume.",
      },
      right: {
        label: "En deux temps",
        text: "Ajouter une contrainte `CHECK (col IS NOT NULL) NOT VALID` — instantané —, puis `VALIDATE CONSTRAINT`, qui vérifie sans bloquer les écritures. On obtient la même garantie sans immobiliser la table.",
      },
    },
    {
      kind: "text",
      text: "Ce motif en deux temps se retrouve pour la plupart des contraintes : les déclarer non validées puis les valider séparément déplace le coût hors du verrou exclusif. C'est le genre de détail qui distingue une migration écrite pour une base de développement d'une migration écrite pour la production.",
    },
    {
      kind: "text",
      text: "Une règle de composition mérite d'être suivie : **une migration, un changement**. Un fichier qui crée une table, ajoute trois colonnes ailleurs et remplit des données est difficile à relire, impossible à rejouer partiellement, et son échec laisse un état intermédiaire dont on ne sait plus quoi faire. Des fichiers courts et nombreux valent mieux qu'un fichier long.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Toutes les opérations ne sont pas transactionnelles",
      text: "Postgres sait annuler un `ALTER TABLE`, ce qui rend la plupart des migrations atomiques. MySQL, non : ses opérations de schéma valident implicitement, et une migration interrompue laisse un état partiel qu'aucun retour en arrière ne nettoie. Sur MySQL, écrire des migrations courtes n'est pas un conseil de style mais une nécessité.",
    },
    {
      kind: "text",
      text: "Une bonne habitude consiste à rendre les migrations idempotentes quand le moteur le permet : `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `DROP INDEX IF EXISTS`. Cela ne remplace pas l'historique de Flyway, qui empêche déjà la réexécution, mais rend la reprise possible après un échec partiel sur un moteur non transactionnel — précisément le cas où l'on en a besoin.",
    },
    {
      kind: "text",
      text: "Enfin, une migration se teste comme du code. Un test d'intégration démarrant un conteneur Postgres neuf, appliquant toutes les migrations puis vérifiant que l'application démarre, attrape les erreurs de syntaxe, les dépendances d'ordre et les incompatibilités avec les entités. C'est rapide, cela tourne à chaque intégration, et cela évite de découvrir le problème pendant le déploiement.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "spot",
    id: "spring-migr-07",
    difficulty: 3,
    tags: ["migrations", "production"],
    prompt: "Cette migration immobilise une table de dix millions de lignes. Quelle ligne ?",
    code: {
      language: "sql",
      code: `ALTER TABLE commandes ADD COLUMN statut varchar(20);

CREATE INDEX idx_commandes_client ON commandes(client_id);

UPDATE commandes SET statut = 'NOUVELLE' WHERE statut IS NULL;`,
    },
    faultyLine: 3,
    reasons: [
      "`CREATE INDEX` sans `CONCURRENTLY` bloque les écritures sur la table pendant toute la construction.",
      "`ADD COLUMN` réécrit la table entière ligne par ligne.",
      "L'`UPDATE` prend un verrou exclusif sur la table jusqu'à la fin de la migration.",
      "`varchar(20)` impose une vérification de longueur sur chaque ligne existante.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'ajout d'une colonne nulle est instantané sur Postgres moderne : seule la description change. L'`UPDATE` est coûteux mais ne bloque que les lignes qu'il touche. `CREATE INDEX` sans `CONCURRENTLY` prend en revanche un verrou qui interdit les écritures pendant toute la construction — sur dix millions de lignes, l'application est bloquée le temps de l'opération.",
  },
  {
    kind: "mcq",
    id: "spring-migr-08",
    difficulty: 3,
    tags: ["migrations", "production"],
    prompt: "Pourquoi `CREATE INDEX CONCURRENTLY` demande-t-il une précaution particulière avec Flyway ?",
    choices: [
      "Il ne peut pas s'exécuter dans une transaction : il faut le déclarer, et rien n'est annulé en cas d'échec.",
      "Il n'est pas reconnu par l'analyseur SQL de Flyway et doit être appelé par une procédure.",
      "Il exige un verrou exclusif que le verrou de Flyway empêche de prendre.",
      "Il ne fonctionne que sur une migration répétable, préfixée par `R`.",
    ],
    answer: 0,
    explanation:
      "Flyway exécute chaque migration dans une transaction, ce que la création concurrente interdit : il faut le signaler par `-- flyway:executeInTransaction=false`. La contrepartie est qu'en cas d'échec rien n'est annulé — l'index reste en état invalide et doit être supprimé avant de réessayer, d'où l'usage de `IF NOT EXISTS` et une vérification après coup.",
  },
  {
    kind: "recall",
    id: "spring-migr-09",
    difficulty: 3,
    tags: ["migrations", "production"],
    prompt: "Comment ajouter une contrainte `NOT NULL` sur une grande table sans l'immobiliser ?",
    explanation:
      "En deux temps. Un `ALTER TABLE … SET NOT NULL` direct doit vérifier chaque ligne tout en tenant un verrou exclusif, ce qui immobilise la table pendant une durée proportionnelle au volume. La forme sûre consiste à ajouter d'abord une contrainte `CHECK (colonne IS NOT NULL) NOT VALID`, opération instantanée puisqu'elle ne vérifie pas l'existant et se contente de s'appliquer aux nouvelles lignes, puis à lancer `VALIDATE CONSTRAINT` séparément : cette validation parcourt la table mais ne bloque pas les écritures. On obtient la même garantie sans interruption de service. Ce motif en deux temps vaut pour la plupart des contraintes, y compris les clés étrangères : déclarer non validé puis valider déplace le coût hors du verrou exclusif, et c'est ce qui distingue une migration écrite pour la production d'une migration écrite pour une base de développement.",
    keyPoints: [
      "SET NOT NULL direct : verrou exclusif pendant la vérification",
      "CHECK … NOT VALID : instantané, s'applique aux nouvelles lignes",
      "VALIDATE CONSTRAINT : parcourt sans bloquer les écritures",
      "Même motif pour les clés étrangères",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Migrer les données, pas seulement le schéma
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-migr-l4",
  title: "Migrer les données, pas seulement le schéma",
  blocks: [
    {
      kind: "text",
      text: "Ajouter une colonne est facile ; la remplir correctement pour dix millions de lignes existantes l'est beaucoup moins. Les migrations de données posent des questions que les migrations de schéma ne posent pas : combien de temps, quel verrou, que faire si le calcul est faux, et comment revenir en arrière quand l'information d'origine a été écrasée.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "La mise à jour massive, et pourquoi elle pose problème.",
      code: `-- Une seule transaction sur 10 millions de lignes :
UPDATE commandes SET statut = 'ANCIENNE'
WHERE creee_le < '2024-01-01';

-- Conséquences :
--  · transaction très longue, journal qui gonfle
--  · verrous tenus sur toutes les lignes touchées
--  · si elle échoue à 90 %, tout est annulé et il
--    faut la relancer depuis le début
--  · sur Postgres, gêne le nettoyage des versions
--    mortes pendant toute sa durée`,
    },
    {
      kind: "text",
      text: "Une transaction unique sur un très grand volume est le motif à éviter. Elle tient des verrous longtemps, fait gonfler le journal de transactions, et son échec tardif oblige à tout recommencer. Le remède est le traitement **par lots** : découper en tranches validées séparément, ce qui borne la durée de chaque transaction et rend le travail reprenable.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Par lots, reprenable, et observable.",
      code: `-- Boucle de mise à jour par tranches de 10 000
DO $$
DECLARE lignes int;
BEGIN
  LOOP
    UPDATE commandes SET statut = 'ANCIENNE'
    WHERE id IN (
      SELECT id FROM commandes
      WHERE statut IS NULL AND creee_le < '2024-01-01'
      LIMIT 10000
    );
    GET DIAGNOSTICS lignes = ROW_COUNT;
    EXIT WHEN lignes = 0;
    COMMIT;                    -- chaque lot est validé
    RAISE NOTICE 'lot de % lignes', lignes;
  END LOOP;
END $$;

-- La condition « statut IS NULL » rend la reprise
-- naturelle : relancer ne retraite pas l'existant.`,
    },
    {
      kind: "text",
      text: "La condition de sélection porte ici toute l'idempotence : en ne traitant que les lignes non encore traitées, on peut interrompre et relancer sans dommage. C'est une propriété à rechercher systématiquement dans une migration de données, car les interruptions arrivent — délai dépassé, déploiement annulé, incident sans rapport.",
    },
    {
      kind: "comparison",
      title: "Où faire tourner une migration de données",
      left: {
        label: "Dans la migration",
        text: "Simple, versionné, appliqué automatiquement. Convient tant que la durée reste raisonnable — quelques secondes. Au-delà, elle retarde le démarrage de l'application, et un délai d'attente d'orchestrateur peut interrompre le déploiement en plein milieu.",
      },
      right: {
        label: "Hors migration",
        text: "Une tâche déclenchée après le déploiement, observable, reprenable, arrêtable. Nécessaire dès que le traitement dure. La migration se contente alors de préparer le schéma, et le remplissage suit à son rythme.",
      },
    },
    {
      kind: "text",
      text: "Le critère est donc la durée. Une migration de données qui prend trente secondes peut rester dans le fichier ; une qui prend une heure doit en sortir, sans quoi le déploiement devient une opération à risque dont personne ne peut prédire la fin. Cette séparation impose que l'application sache fonctionner pendant le remplissage, ce qui est le sujet de la leçon suivante.",
    },
    {
      kind: "text",
      text: "Une précaution s'impose sur la réversibilité : une migration de données **détruit de l'information**. Écraser une colonne, fusionner deux champs, normaliser un format — l'état d'origine disparaît. Conserver l'ancienne colonne quelques versions, plutôt que de la supprimer immédiatement, laisse une porte de sortie qui ne coûte que de l'espace disque.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ne jamais écrire une migration sans avoir compté",
      text: "Avant d'écrire un `UPDATE` massif, exécuter le `SELECT COUNT(*)` correspondant sur une copie de production. Dix mille lignes ne demandent aucune précaution ; dix millions changent complètement l'approche. Écrire la migration sans connaître ce chiffre, c'est décider à l'aveugle d'une opération dont la durée peut varier d'un facteur mille.",
    },
    {
      kind: "text",
      text: "Une variante utile évite entièrement la mise à jour massive : remplir à la lecture. On ajoute la colonne nulle, et l'application calcule la valeur au premier accès si elle est absente, en l'écrivant au passage. La migration devient progressive, s'étale naturellement sur l'usage réel, et l'on ne remplit jamais les lignes que personne ne consulte.",
    },
    {
      kind: "text",
      text: "Cette approche a sa contrepartie : le code doit gérer les deux cas — valeur présente ou absente — pendant toute la période de transition, et cette gestion doit être retirée ensuite. C'est le même compromis que partout ailleurs dans ce chapitre : une complexité temporaire dans le code contre une opération lourde sur la base.",
    },
    {
      kind: "text",
      text: "Retenons trois réflexes : compter avant d'écrire, traiter par lots reprenables au-delà d'un certain volume, et sortir de la migration tout ce qui dure. Ces trois précautions transforment une opération redoutée en travail ordinaire, observable et interruptible.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-migr-10",
    difficulty: 2,
    tags: ["migrations", "donnees"],
    prompt: "Pourquoi éviter un `UPDATE` unique sur dix millions de lignes dans une migration ?",
    choices: [
      "Transaction très longue, verrous tenus, journal qui gonfle, et tout est annulé si elle échoue à 90 %.",
      "Postgres refuse les transactions dépassant un million de lignes modifiées.",
      "Flyway impose une limite de durée au-delà de laquelle la migration est marquée en échec.",
      "Les valeurs mises à jour ne seraient pas visibles des autres transactions avant le redémarrage.",
    ],
    answer: 0,
    explanation:
      "Le problème est la durée et l'atomicité : une transaction unique tient ses verrous jusqu'au bout, fait gonfler le journal, gêne le nettoyage des versions mortes, et son échec tardif oblige à tout recommencer. Le traitement par lots validés séparément borne la durée de chaque transaction et rend le travail reprenable.",
  },
  {
    kind: "order",
    id: "spring-migr-11",
    difficulty: 2,
    tags: ["migrations", "donnees"],
    prompt: "Remets dans l'ordre la préparation d'une migration de données volumineuse.",
    items: [
      "Compter les lignes concernées sur une copie de production",
      "Décider si le traitement reste dans la migration ou en sort",
      "Écrire la mise à jour par lots, avec une condition qui rend la reprise naturelle",
      "Mesurer la durée d'un lot sur la copie, puis extrapoler",
      "Conserver l'information d'origine quelques versions, au cas où",
    ],
    explanation:
      "Le comptage vient en premier parce qu'il change tout : dix mille lignes ne demandent aucune précaution, dix millions imposent des lots et probablement une sortie de la migration. Écrire sans connaître ce chiffre revient à décider à l'aveugle d'une opération dont la durée peut varier d'un facteur mille.",
  },
  {
    kind: "recall",
    id: "spring-migr-12",
    difficulty: 2,
    tags: ["migrations", "donnees"],
    prompt: "Qu'est-ce qui rend une migration de données reprenable, et pourquoi est-ce important ?",
    explanation:
      "C'est la **condition de sélection** : en ne traitant que les lignes qui ne l'ont pas encore été — typiquement `WHERE statut IS NULL` — on peut interrompre et relancer sans retraiter l'existant ni corrompre quoi que ce soit. Cette propriété importe parce que les interruptions arrivent toujours : délai d'attente dépassé, déploiement annulé, incident sans rapport, redémarrage d'un orchestrateur. Sans elle, une interruption laisse un état à moitié migré dont personne ne sait s'il faut le relancer entièrement, partiellement, ou le corriger à la main. On y ajoute le traitement par lots validés séparément, qui borne la durée de chaque transaction, et la conservation de l'information d'origine pendant quelques versions — car une migration de données détruit de l'information, et l'espace disque coûte moins cher qu'une restauration.",
    keyPoints: [
      "La condition de sélection exclut ce qui est déjà traité",
      "Interrompre et relancer devient sans conséquence",
      "Les interruptions arrivent : délai, incident, redéploiement",
      "Garder l'information d'origine quelques versions",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Déployer sans interruption
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "spring-migr-l5",
  title: "Déployer sans interruption",
  blocks: [
    {
      kind: "text",
      text: "Pendant un déploiement progressif, l'ancienne et la nouvelle version de l'application tournent **en même temps**, sur la même base. Cette évidence a une conséquence que les migrations ignorent souvent : le schéma doit être compatible avec les deux versions simultanément, faute de quoi la moitié des requêtes échoue pendant la bascule.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce qui casse, et pourquoi.",
      code: `Version 1 (encore en vol)  →  SELECT nom_complet FROM clients
Version 2 (qui arrive)     →  SELECT prenom, nom FROM clients

Migration : RENAME nom_complet → prenom + nom

Pendant la bascule :
  · les instances V1 cherchent nom_complet : ERREUR
  · les instances V2 cherchent prenom : d'accord

→ Toute suppression ou tout renommage casse
  l'ancienne version tant qu'elle tourne encore.`,
    },
    {
      kind: "text",
      text: "La règle qui en découle est simple : une migration ne doit jamais **retirer** quelque chose dont la version en cours d'exécution a besoin. Ajouter est toujours sûr — l'ancienne version ignore la nouvelle colonne. Retirer, renommer ou changer un type ne l'est jamais, tant qu'une instance de l'ancienne version peut encore recevoir du trafic.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le motif « étendre puis contracter », en cinq versions.",
      code: `1. ÉTENDRE   Ajouter prenom et nom, nullables.
             Ne rien retirer. V1 continue de marcher.

2. DOUBLE    V2 écrit dans nom_complet ET dans
   ÉCRITURE  prenom/nom. Les deux restent cohérents.

3. REMPLIR   Migration de données : remplir prenom
             et nom pour les lignes anciennes, par
             lots, hors migration si c'est long.

4. LIRE      V3 lit prenom/nom et n'écrit plus dans
   AILLEURS  nom_complet. Vérifier que plus rien ne
             le lit — journaliser les accès aide.

5. CONTRACTER V4 supprime nom_complet, une fois
             certain que plus aucune version en vol
             ne l'utilise.`,
    },
    {
      kind: "text",
      text: "Ce découpage paraît lourd pour un renommage, et il l'est. C'est le prix du déploiement sans interruption, et il ne se paie que sur les changements destructifs. La grande majorité des évolutions — ajouter une colonne, une table, un index — tiennent en une seule étape, précisément parce qu'elles n'enlèvent rien.",
    },
    {
      kind: "comparison",
      title: "Deux façons de déployer un changement destructif",
      left: {
        label: "Fenêtre d'interruption",
        text: "On arrête l'application, on migre, on redémarre. Simple, sans étape intermédiaire, et parfaitement acceptable pour un outil interne utilisé aux heures de bureau. Le coût est l'indisponibilité, assumée et annoncée.",
      },
      right: {
        label: "Étendre puis contracter",
        text: "Plusieurs déploiements successifs, aucune interruption. Nécessaire pour un service continu. Le coût est en durée et en discipline : il faut se souvenir de contracter, ce que beaucoup d'équipes oublient une fois la fonctionnalité livrée.",
      },
    },
    {
      kind: "text",
      text: "L'oubli de la contraction est un vrai phénomène : la colonne devenue inutile reste des années, personne n'osant la supprimer faute de savoir si quelque chose la lit encore. Noter l'étape de suppression comme une tâche datée, dès l'écriture de l'extension, est la seule parade qui fonctionne en pratique.",
    },
    {
      kind: "text",
      text: "Une variante fréquente concerne les types. Changer une colonne de `varchar` en `numeric` casse les deux versions à des moments différents. On applique le même principe : ajouter une nouvelle colonne au bon type, écrire dans les deux, remplir, basculer les lectures, supprimer. La règle « on ajoute, on ne transforme pas » couvre tous ces cas.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Vérifier avant de contracter",
      text: "Avant de supprimer une colonne, s'assurer que plus personne ne la lit. Une recherche dans le code ne suffit pas — il reste les rapports, les exports, les scripts d'analystes. Journaliser les accès pendant quelques semaines, ou renommer la colonne avec un suffixe temporaire et observer ce qui casse en recette, donne une certitude qu'aucune relecture ne donne.",
    },
    {
      kind: "text",
      text: "Une conséquence pratique mérite d'être notée : ce motif impose que la migration soit déployée **avant** le code qui l'utilise, jamais l'inverse. Une application qui démarre en cherchant une colonne pas encore créée échoue ; une base qui porte une colonne dont personne ne se sert encore ne dérange personne. L'ordre est donc toujours : migration d'abord, code ensuite.",
    },
    {
      kind: "text",
      text: "En entretien, la question « comment déployez-vous un changement de schéma sans interruption ? » distingue nettement. Répondre « on met l'application en maintenance » est une réponse honnête pour certains contextes ; savoir nommer et décrire le motif étendre-puis-contracter montre qu'on a déjà eu à traiter le cas où l'interruption n'était pas une option.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "order",
    id: "spring-migr-13",
    difficulty: 3,
    tags: ["migrations", "deploiement"],
    prompt: "Remets dans l'ordre les étapes d'un renommage de colonne sans interruption.",
    items: [
      "Ajouter les nouvelles colonnes, nullables, sans rien retirer",
      "Faire écrire l'application dans l'ancienne et les nouvelles colonnes",
      "Remplir les nouvelles colonnes pour les lignes existantes",
      "Basculer les lectures sur les nouvelles colonnes et cesser d'écrire dans l'ancienne",
      "Supprimer l'ancienne colonne, une fois certain que plus rien ne la lit",
    ],
    explanation:
      "Pendant un déploiement progressif, l'ancienne et la nouvelle version tournent en même temps sur la même base : le schéma doit être compatible avec les deux. Ajouter est toujours sûr — l'ancienne version ignore la nouvelle colonne. Retirer ou renommer casse l'ancienne version tant qu'une instance peut encore recevoir du trafic, d'où ce découpage en cinq temps.",
  },
  {
    kind: "mcq",
    id: "spring-migr-14",
    difficulty: 2,
    tags: ["migrations", "deploiement"],
    prompt: "Quelle règle rend une migration compatible avec un déploiement progressif ?",
    choices: [
      "Ne jamais retirer ni renommer ce dont la version en cours d'exécution a besoin : on ajoute, on ne transforme pas.",
      "Toujours exécuter les migrations après l'arrêt complet de l'ancienne version.",
      "Regrouper toutes les modifications dans une seule migration atomique.",
      "N'utiliser que des migrations répétables, rejouables à chaque déploiement.",
    ],
    answer: 0,
    explanation:
      "Les deux versions coexistent pendant la bascule et partagent la base. Ajouter une colonne est sûr : l'ancienne version l'ignore. Retirer, renommer ou changer un type casse les instances qui n'ont pas encore été remplacées. D'où le motif étendre-puis-contracter, qui étale le changement destructif sur plusieurs déploiements successifs.",
  },
  {
    kind: "recall",
    id: "spring-migr-15",
    difficulty: 2,
    tags: ["migrations", "deploiement"],
    prompt: "Pourquoi l'étape de contraction est-elle si souvent oubliée, et comment s'en prémunir ?",
    explanation:
      "Parce qu'elle arrive après la livraison de la fonctionnalité, quand l'attention de l'équipe est déjà ailleurs et que rien ne casse si on ne la fait pas. La colonne devenue inutile reste alors des années, et plus le temps passe, moins quelqu'un ose la supprimer — faute de pouvoir affirmer que rien ne la lit encore. La seule parade qui fonctionne en pratique est de noter l'étape de suppression comme une tâche datée dès l'écriture de l'extension, pour qu'elle existe dans le suivi et non dans la mémoire de quelqu'un. Avant de contracter, il faut par ailleurs une certitude qu'aucune relecture de code ne donne : il reste les rapports, les exports et les scripts d'analystes. Journaliser les accès pendant quelques semaines, ou renommer avec un suffixe temporaire et observer ce qui casse en recette, apporte cette preuve.",
    keyPoints: [
      "Elle arrive après la livraison, quand rien ne casse si on l'oublie",
      "Plus le temps passe, moins quelqu'un ose supprimer",
      "Noter la suppression comme une tâche datée dès l'extension",
      "Vérifier par les journaux d'accès, pas par une relecture du code",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Le retour en arrière : mythe et réalité
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "spring-migr-l6",
  title: "Le retour en arrière : mythe et réalité",
  blocks: [
    {
      kind: "text",
      text: "Une question revient systématiquement : « et si la migration se passe mal, comment revient-on en arrière ? ». La réponse honnête surprend souvent — dans la plupart des cas, on ne revient pas en arrière. On avance. Comprendre pourquoi évite de bâtir une fausse sécurité autour de scripts de retour qui ne fonctionneront pas le jour venu.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "Le retour en arrière qui fonctionne, et celui qui ment.",
      code: `-- Réversible sans perte :
ALTER TABLE commandes ADD COLUMN statut varchar(20);
-- retour : DROP COLUMN statut  → on perd les valeurs
--          écrites depuis, mais la structure revient.

-- IRRÉVERSIBLE :
ALTER TABLE clients DROP COLUMN telephone_fixe;
-- retour : ADD COLUMN telephone_fixe varchar(20)
--          → la colonne revient VIDE. Les données
--            sont perdues. Le script « de retour »
--            existe et ne restaure rien.

UPDATE clients SET email = lower(email);
-- retour : impossible. La casse d'origine a disparu.`,
    },
    {
      kind: "text",
      text: "Un script de retour en arrière ne restaure pas des données : il défait une **structure**. Dès qu'une migration a supprimé ou transformé de l'information, aucun script ne la fait revenir. C'est pourquoi les scripts de retour donnent une confiance largement injustifiée — ils fonctionnent exactement dans les cas où l'on n'en a pas besoin.",
    },
    {
      kind: "text",
      text: "S'y ajoute une raison pratique : un retour en arrière est du code qui n'est jamais exécuté avant le jour où il doit l'être. Non testé, écrit à l'avance pour une situation imaginaire, il a toutes les chances d'échouer précisément quand la pression est maximale. Du code qui ne tourne jamais est du code qui ne marche pas.",
    },
    {
      kind: "comparison",
      title: "Deux stratégies de récupération",
      left: {
        label: "Revenir en arrière",
        text: "Défaire la migration. Ne fonctionne que pour les changements purement structurels et non destructifs. Suppose un script maintenu et jamais testé. Donne une impression de sécurité qui dépasse largement ce qu'il offre réellement.",
      },
      right: {
        label: "Avancer",
        text: "Écrire une nouvelle migration qui corrige. Testable comme n'importe quelle autre, passe par la revue, s'applique par le mécanisme habituel. C'est la stratégie retenue par la plupart des équipes qui ont vécu l'exercice.",
      },
    },
    {
      kind: "text",
      text: "Avancer plutôt que reculer suppose que les migrations soient petites et fréquentes. Une migration modeste qui se révèle fautive se corrige par une autre migration modeste, en quelques minutes. Une migration énorme qui échoue à mi-parcours laisse un état dont personne ne sait quoi faire — c'est un argument de plus en faveur des fichiers courts.",
    },
    {
      kind: "text",
      text: "La vraie sécurité est ailleurs : dans la **sauvegarde**, et surtout dans la restauration à un instant donné. Savoir qu'on peut remettre la base dans l'état où elle était dix minutes avant le déploiement vaut tous les scripts de retour du monde. Encore faut-il l'avoir essayé — une sauvegarde jamais restaurée n'est pas une sauvegarde, c'est une supposition.",
    },
    {
      kind: "text",
      text: "Pour les changements destructifs, la meilleure protection reste de ne pas détruire tout de suite. Le motif étendre-puis-contracter donne exactement cela : entre l'extension et la contraction, l'ancienne information est toujours là, et revenir en arrière consiste à rebasculer les lectures — une opération de déploiement, pas de base de données.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Tester la restauration, pas seulement la sauvegarde",
      text: "Beaucoup d'équipes découvrent le jour de l'incident que leurs sauvegardes sont incomplètes, illisibles, ou que la restauration prend six heures. Un exercice périodique — restaurer une sauvegarde dans un environnement de test et vérifier que l'application démarre dessus — est ce qui transforme une supposition en garantie.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "La sécurité qui fonctionne réellement.",
      code: `# Avant un déploiement à risque, noter le point de
# reprise plutôt que d'écrire un script de retour.
pg_dump --format=custom app > avant_v42.dump

# Et surtout : avoir déjà essayé la restauration.
createdb app_test
pg_restore --dbname=app_test avant_v42.dump
# → l'application démarre-t-elle dessus ?
# → combien de temps cela a-t-il pris ?

# Une sauvegarde jamais restaurée n'est pas une
# sauvegarde, c'est une supposition.`,
    },
    {
      kind: "text",
      text: "Connaître la **durée** de la restauration compte autant que sa possibilité : elle détermine ce qu'on peut promettre pendant un incident. Une restauration de six heures n'est pas une option pour un service critique, et il vaut mieux le découvrir lors d'un exercice que le jour où la question se pose vraiment.",
    },
    {
      kind: "text",
      text: "En résumé : les migrations avancent, elles ne reculent pas ; les scripts de retour ne restaurent aucune donnée ; la sécurité réelle vient d'une restauration testée et d'un motif qui retarde la destruction. C'est une réponse moins rassurante que « on a des rollbacks », et c'est celle qui tient à l'épreuve.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-migr-16",
    difficulty: 2,
    tags: ["migrations", "rollback"],
    prompt: "Pourquoi un script de retour en arrière donne-t-il une fausse sécurité ?",
    choices: [
      "Il défait une structure mais ne restaure aucune donnée supprimée ou transformée.",
      "Il ne peut pas être exécuté sur une base contenant des données.",
      "Il est incompatible avec le mécanisme d'empreintes de Flyway.",
      "Il ne fonctionne que si la migration d'origine était répétable.",
    ],
    answer: 0,
    explanation:
      "Recréer une colonne supprimée la fait revenir **vide** : les données sont perdues, et le script « de retour » existe sans rien restaurer. Il fonctionne exactement dans les cas où l'on n'en a pas besoin — les changements purement structurels et non destructifs. S'y ajoute qu'il n'est jamais exécuté avant le jour où il doit l'être, donc jamais testé.",
  },
  {
    kind: "match",
    id: "spring-migr-17",
    difficulty: 2,
    tags: ["migrations", "rollback"],
    prompt: "Associe chaque migration à sa réversibilité réelle.",
    pairs: [
      { left: "ADD COLUMN statut", right: "Réversible : la structure revient, seules les valeurs récentes sont perdues" },
      { left: "DROP COLUMN telephone", right: "Irréversible : la colonne revient vide, les données sont perdues" },
      { left: "UPDATE … SET email = lower(email)", right: "Irréversible : la casse d'origine a disparu" },
      { left: "CREATE INDEX", right: "Réversible sans perte : l'index se recrée à l'identique" },
    ],
    explanation:
      "La ligne de partage est la destruction d'information. Tout ce qui ajoute une structure se défait proprement ; tout ce qui supprime ou transforme des données est définitif, quel que soit le script écrit en face. C'est pourquoi la vraie protection est la restauration testée et le motif étendre-puis-contracter, qui retarde la destruction.",
  },
  {
    kind: "recall",
    id: "spring-migr-18",
    difficulty: 2,
    tags: ["migrations", "rollback"],
    prompt: "Quelle stratégie de récupération adopter, si les scripts de retour ne suffisent pas ?",
    explanation:
      "**Avancer plutôt que reculer** : écrire une nouvelle migration qui corrige. Elle est testable comme n'importe quelle autre, passe par la revue, s'applique par le mécanisme habituel — contrairement à un script de retour, écrit à l'avance pour une situation imaginaire et jamais exécuté avant le jour où la pression est maximale. Cette stratégie suppose des migrations petites et fréquentes : une migration modeste fautive se corrige en quelques minutes, là où une migration énorme échouée à mi-parcours laisse un état dont personne ne sait quoi faire. La sécurité réelle vient d'ailleurs : d'une **restauration testée** à un instant donné, qui permet de remettre la base dans l'état d'il y a dix minutes — une sauvegarde jamais restaurée n'étant pas une sauvegarde mais une supposition. Et pour les changements destructifs, du motif étendre-puis-contracter, qui laisse l'ancienne information en place assez longtemps pour que le retour soit une opération de déploiement, pas de base.",
    keyPoints: [
      "Avancer : une nouvelle migration, testée et revue",
      "Suppose des migrations petites et fréquentes",
      "La sécurité réelle : une restauration réellement essayée",
      "Étendre-puis-contracter retarde la destruction",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Migrations en équipe
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "spring-migr-l7",
  title: "Migrations en équipe",
  blocks: [
    {
      kind: "text",
      text: "À une personne, les migrations sont triviales : on incrémente le numéro et on avance. À cinq, sur autant de branches, un problème apparaît immédiatement — deux personnes créent `V12` en même temps, sur des branches différentes, sans jamais se croiser avant la fusion.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le conflit de numéro, et ce qu'il produit.",
      code: `branche A : V12__ajout_colonne_statut.sql
branche B : V12__creation_table_paiements.sql

Après fusion des deux branches :
  · deux fichiers V12 dans le même dossier
  · Flyway refuse de démarrer : version en double

Pire, si A est fusionnée et déployée d'abord :
  · V12 (A) est appliquée en production
  · B est fusionnée, son V12 a un autre contenu
  · l'empreinte ne correspond plus → refus de démarrer
  · et le contenu de B n'est jamais appliqué`,
    },
    {
      kind: "text",
      text: "Le second cas est le plus pénible, car il ne se manifeste pas à la fusion mais au déploiement suivant, sur un environnement qui avait déjà la première version. La cause est structurelle : le numéro de version est attribué au moment de l'écriture, alors qu'il devrait refléter l'ordre d'**intégration**, qui n'est connu qu'à la fusion.",
    },
    {
      kind: "comparison",
      title: "Deux conventions de numérotation",
      left: {
        label: "Numéros séquentiels",
        text: "`V12`, `V13`. Lisible, l'ordre saute aux yeux. Mais chaque branche revendique le numéro suivant, et les collisions sont fréquentes dès trois développeurs. Impose de renuméroter avant fusion, donc de rester vigilant.",
      },
      right: {
        label: "Horodatage",
        text: "`V20260911_1432__ajout_statut.sql`. Les collisions deviennent improbables, l'ordre reste celui de l'écriture. Moins lisible, et l'ordre d'écriture n'est pas toujours l'ordre souhaité d'application — deux migrations indépendantes s'en moquent, deux dépendantes non.",
      },
    },
    {
      kind: "text",
      text: "L'horodatage règle le conflit de nommage sans régler la question du contenu : deux migrations qui touchent la même table peuvent fusionner sans conflit de fichier tout en produisant un résultat incohérent. Aucune convention de numérotation ne remplace la relecture, et c'est le point à retenir.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les règles qui évitent l'essentiel des incidents.",
      code: `1. Une migration fusionnée est FIGÉE.
   Si elle est fausse, on en écrit une nouvelle.

2. Renuméroter avant fusion, pas après.
   Le conflit se règle dans la branche, sans toucher
   à ce qui est déjà intégré ailleurs.

3. Une migration par demande de fusion, autant que
   possible. Deux migrations dans la même branche
   compliquent la renumérotation.

4. La revue de code couvre les migrations.
   Volume estimé, verrous pris, compatibilité avec
   la version en vol : cela se relit.

5. La CI applique les migrations sur une base vide
   ET sur une copie du schéma de production.`,
    },
    {
      kind: "text",
      text: "La cinquième règle est celle qui attrape le plus de problèmes pour le moins d'effort. Appliquer les migrations sur une base vide vérifie qu'elles sont cohérentes entre elles ; les appliquer sur une copie du schéma de production vérifie qu'elles fonctionnent sur l'existant — deux choses différentes, et la seconde est celle qui casse en production.",
    },
    {
      kind: "text",
      text: "Un cas particulier mérite d'être anticipé : la migration d'une branche qui n'est finalement pas fusionnée. Si elle a été appliquée sur un environnement partagé de recette, cet environnement porte une version que le dépôt ne contient plus, et Flyway s'en plaindra. La sortie propre consiste à nettoyer cet environnement plutôt qu'à réintroduire un fichier dont personne ne veut.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Recréer la base de développement doit être trivial",
      text: "Si repartir d'une base vide prend une commande et deux minutes, personne n'hésite à nettoyer un environnement local abîmé, et les migrations sont exercées en permanence. Si cela prend une demi-journée, chacun bricole sa base à la main — et l'on retrouve exactement la divergence que les migrations devaient supprimer.",
    },
    {
      kind: "text",
      text: "Le partage d'un environnement de recette ajoute sa propre difficulté : plusieurs branches y déploient à tour de rôle, et son schéma finit par porter des migrations issues de branches différentes. C'est acceptable tant qu'on peut le remettre à zéro facilement — ce qui suppose que la recette ne contienne aucune donnée irremplaçable, condition qu'on oublie souvent de vérifier.",
    },
    {
      kind: "text",
      text: "Un mot enfin sur la revue : relire une migration demande d'autres questions que relire du code. Combien de lignes cette table contient-elle en production ? Quels verrous l'opération prend-elle ? Est-elle compatible avec la version encore en vol ? Que se passe-t-il si elle échoue à mi-parcours ? Ces quatre questions, posées systématiquement, attrapent la quasi-totalité des incidents de déploiement.",
    },
    {
      kind: "text",
      text: "Retenons que le sujet devient un sujet d'équipe dès la deuxième personne : convention de numérotation choisie et écrite, migration figée après fusion, revue qui couvre le SQL, et intégration continue qui applique sur une base vide comme sur une copie de production.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "spot",
    id: "spring-migr-19",
    difficulty: 2,
    tags: ["migrations", "equipe"],
    prompt: "Deux branches ont créé une migration. Après fusion, l'application refuse de démarrer. Quelle ligne pose problème ?",
    code: {
      language: "text",
      code: `db/migration/
  V10__creation_clients.sql
  V11__creation_commandes.sql
  V12__ajout_colonne_statut.sql
  V12__creation_table_paiements.sql
  V13__index_client.sql`,
    },
    faultyLine: 5,
    reasons: [
      "Deux migrations portent la version 12 : Flyway refuse de démarrer sur une version en double.",
      "`V13` ne peut pas suivre deux migrations `V12`, la numérotation devant être continue.",
      "Le nom `creation_table_paiements` dépasse la longueur maximale autorisée.",
      "Les migrations de création de table doivent précéder toutes les migrations d'ajout de colonne.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le numéro de version est attribué au moment de l'écriture, alors qu'il devrait refléter l'ordre d'intégration — connu seulement à la fusion. La correction consiste à renuméroter dans la branche **avant** de fusionner. Le cas plus pénible est celui où la première `V12` a déjà été déployée : l'empreinte ne correspondra plus, et le contenu de la seconde ne sera jamais appliqué.",
  },
  {
    kind: "mcq",
    id: "spring-migr-20",
    difficulty: 2,
    tags: ["migrations", "equipe", "ci"],
    prompt: "Pourquoi appliquer les migrations à la fois sur une base vide et sur une copie du schéma de production ?",
    choices: [
      "La base vide vérifie la cohérence entre migrations ; la copie de production vérifie qu'elles fonctionnent sur l'existant.",
      "La base vide est plus rapide, la copie de production sert uniquement de sauvegarde.",
      "Flyway exige les deux environnements pour calculer correctement les empreintes.",
      "Cela permet de comparer les durées d'exécution et de choisir la plus courte.",
    ],
    answer: 0,
    explanation:
      "Ce sont deux vérifications différentes. Sur base vide, on s'assure que la suite complète est cohérente et rejouable — c'est ce qui garantit qu'un nouvel arrivant obtiendra le bon schéma. Sur une copie du schéma de production, on s'assure que les migrations passent sur les données et contraintes réellement existantes. La seconde est celle qui attrape ce qui casse en production.",
  },
  {
    kind: "match",
    id: "spring-migr-21",
    difficulty: 2,
    tags: ["migrations", "equipe"],
    prompt: "Associe chaque situation à la bonne réaction.",
    pairs: [
      { left: "Deux V12 après fusion", right: "Renuméroter dans la branche avant de fusionner" },
      { left: "Une migration fusionnée est fausse", right: "En écrire une nouvelle : celle-ci est figée" },
      { left: "Une branche abandonnée a migré la recette", right: "Nettoyer l'environnement, pas réintroduire le fichier" },
      { left: "Trois développeurs se marchent dessus", right: "Passer à une numérotation par horodatage" },
    ],
    explanation:
      "Le fil commun est qu'on ne réécrit jamais l'histoire : une migration intégrée est figée, et toute correction passe par une migration supplémentaire. L'horodatage règle le conflit de nommage mais pas celui du contenu — deux migrations touchant la même table fusionnent sans conflit de fichier tout en produisant un résultat incohérent, ce que seule la relecture attrape.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — ddl-auto et le rôle de JPA
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "spring-migr-l8",
  title: "ddl-auto et le rôle de JPA",
  blocks: [
    {
      kind: "text",
      text: "Hibernate sait générer le schéma à partir des entités, et c'est très pratique au premier jour d'un projet : on écrit une classe, on démarre, la table existe. Cette facilité est aussi le piège le plus coûteux du domaine, parce qu'elle donne l'impression que le problème du schéma est résolu alors qu'il est seulement reporté.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Les valeurs, et ce qu'elles font vraiment.",
      code: `spring:
  jpa:
    hibernate:
      ddl-auto: none        # ne touche à rien

# create        supprime et recrée au démarrage
# create-drop   idem, et supprime à l'arrêt
# update        tente d'ajuster le schéma à l'existant
# validate      vérifie la correspondance, ne modifie rien
# none          ne fait rien

# En production : validate ou none. Jamais autre chose.`,
    },
    {
      kind: "text",
      text: "`update` est celle qui séduit et qu'il faut proscrire. Elle **ajoute** ce qui manque mais ne retire ni ne modifie jamais rien : une colonne renommée dans le code produit une nouvelle colonne à côté de l'ancienne, un type élargi n'est pas appliqué, une contrainte supprimée reste. Le schéma dérive silencieusement et personne ne sait plus ce qu'il devrait contenir.",
    },
    {
      kind: "text",
      text: "S'y ajoute que le résultat dépend de la version d'Hibernate, du dialecte et de l'ordre d'exécution. Deux environnements partis du même code peuvent obtenir deux schémas différents, ce qui reproduit exactement la divergence que les migrations éliminaient. `update` en production est la façon la plus sûre de ne plus pouvoir répondre à la question « quel est le schéma attendu ? ».",
    },
    {
      kind: "code",
      language: "text",
      caption: "La combinaison qui fonctionne.",
      code: `Flyway  → possède le schéma. C'est lui qui crée,
          modifie, supprime. Source de vérité unique.

JPA     → ddl-auto: validate. Au démarrage, Hibernate
          compare les entités au schéma réel et refuse
          de démarrer s'ils divergent.

Résultat : impossible de déployer une application dont
les entités ne correspondent pas au schéma migré. La
divergence est détectée AU DÉMARRAGE, devant l'écran
de celui qui déploie, et non à la première requête.`,
    },
    {
      kind: "text",
      text: "`validate` est la valeur qui apporte le plus pour le moins d'effort. Elle ne modifie rien et transforme un désaccord entre le code et la base en échec de démarrage explicite, nommant l'entité et la colonne en cause. Sans elle, l'application démarre et échoue plus tard, sur une requête, avec un message bien moins clair.",
    },
    {
      kind: "comparison",
      title: "Deux façons de voir la relation",
      left: {
        label: "JPA possède le schéma",
        text: "Le code génère la base. Confortable au démarrage d'un prototype, ingérable dès qu'il y a des données à préserver, un déploiement progressif, ou plusieurs environnements. Aucune trace de ce qui a changé, ni quand.",
      },
      right: {
        label: "Les migrations possèdent le schéma",
        text: "La base a son propre historique versionné ; JPA se contente de vérifier qu'il correspond aux entités. C'est la seule répartition qui tienne dès qu'une application est déployée ailleurs que sur un poste de développement.",
      },
    },
    {
      kind: "text",
      text: "Une exception raisonnable existe : les tests. Un test unitaire peut légitimement utiliser `create-drop` sur une base en mémoire, pour aller vite et rester isolé. Mais les tests d'intégration devraient appliquer les vraies migrations sur un conteneur du vrai moteur — c'est le seul moyen de vérifier que ces migrations fonctionnent, et de tester sur le schéma réellement déployé.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "create-drop en production efface la base",
      text: "Cela paraît absurde et cela arrive : une valeur héritée d'un fichier de développement, un profil mal activé, et le démarrage supprime toutes les tables avant de les recréer vides. C'est l'un des rares réglages capables de détruire l'intégralité des données en une seconde, sans confirmation. La valeur doit être explicite dans la configuration de production, jamais héritée.",
    },
    {
      kind: "text",
      text: "Un usage légitime d'Hibernate subsiste dans ce cadre : la **génération** du script initial. On laisse Hibernate produire le schéma correspondant aux entités, on relit le résultat, on le corrige — les index et les contraintes qu'il ne devine pas — et l'on en fait la première migration. L'outil sert alors de point de départ, sans jamais devenir la source de vérité.",
    },
    {
      kind: "text",
      text: "Retenons la répartition : Flyway possède le schéma et en garde l'historique, JPA vérifie la correspondance et refuse de démarrer en cas d'écart. Cette combinaison donne à la fois la reproductibilité, la traçabilité et une détection précoce des désaccords — trois propriétés qu'aucune génération automatique de schéma n'offre.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "spring-migr-22",
    difficulty: 2,
    tags: ["migrations", "jpa"],
    prompt: "L'entité a gagné un champ `statut`, mais aucune migration n'a été écrite. `ddl-auto: validate`. Que se passe-t-il au démarrage ?",
    code: {
      language: "java",
      code: `@Entity
public class Commande {
    @Id Long id;
    BigDecimal montant;
    String statut;          // nouveau champ
}

// application.yml
// spring.jpa.hibernate.ddl-auto: validate
// La table commandes n'a pas de colonne statut.`,
    },
    choices: [
      "L'application refuse de démarrer, avec un message nommant la table et la colonne manquante.",
      "L'application démarre et Hibernate ajoute la colonne automatiquement.",
      "L'application démarre, et le champ `statut` vaut `null` à chaque lecture.",
      "L'application démarre et échoue à la première requête sur `Commande`.",
    ],
    answer: 0,
    explanation:
      "`validate` compare les entités au schéma réel au démarrage et échoue en cas d'écart, en nommant précisément ce qui manque. C'est exactement l'intérêt du réglage : le désaccord est découvert devant l'écran de celui qui déploie, et non plus tard sur une requête avec un message bien moins clair. Seul `update` ajouterait la colonne — et c'est précisément ce qu'on ne veut pas.",
  },
  {
    kind: "spot",
    id: "spring-migr-23",
    difficulty: 2,
    tags: ["migrations", "jpa", "production"],
    prompt: "Cette configuration de production contient un réglage dangereux. Lequel ?",
    code: {
      language: "yaml",
      code: `spring:
  datasource:
    url: jdbc:postgresql://db.prod/app
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
  flyway:
    enabled: true`,
    },
    faultyLine: 6,
    reasons: [
      "`update` laisse Hibernate modifier le schéma que Flyway est censé posséder : le schéma dérive silencieusement.",
      "`show-sql: false` empêche de diagnostiquer les requêtes lentes en production.",
      "`flyway.enabled: true` entre en conflit avec la source de données déclarée au-dessus.",
      "L'URL de la base ne devrait pas figurer en clair dans le fichier.",
    ],
    reasonAnswer: 0,
    explanation:
      "Deux mécanismes prétendent alors posséder le schéma. `update` ajoute ce qui manque sans jamais retirer ni modifier : une colonne renommée dans le code apparaît à côté de l'ancienne, un type élargi n'est pas appliqué. Le schéma dérive et cesse d'être reproductible. En production, la seule valeur raisonnable est `validate` — ou `none`.",
  },
  {
    kind: "mcq",
    id: "spring-migr-24",
    difficulty: 1,
    tags: ["migrations", "jpa"],
    prompt: "Quelle répartition des rôles entre Flyway et JPA ?",
    choices: [
      "Flyway possède le schéma et en garde l'historique ; JPA vérifie la correspondance avec `validate`.",
      "JPA génère le schéma, Flyway enregistre a posteriori ce qui a été créé.",
      "Les deux modifient le schéma, Flyway pour les tables et JPA pour les index.",
      "Flyway ne sert qu'en développement, JPA prenant le relais en production.",
    ],
    answer: 0,
    explanation:
      "Une seule source de vérité pour le schéma : les migrations. JPA se contente de comparer les entités au schéma réel au démarrage et de refuser de démarrer en cas d'écart. On obtient reproductibilité, traçabilité et détection précoce des désaccords — trois propriétés qu'aucune génération automatique n'offre.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-migrations",
  title: "Migrations : versionner le schéma et déployer sans casse",
  objective:
    "Traiter le schéma comme du code : comprendre le mécanisme de Flyway, écrire des migrations qui ne bloquent pas la production, migrer des données par lots reprenables, déployer un changement destructif sans interruption, savoir ce que vaut réellement un retour en arrière, travailler à plusieurs sans conflits, et confier à JPA la vérification plutôt que la génération.",
  prerequisites: ["spring-jpa"],
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
