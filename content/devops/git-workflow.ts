/**
 * DevOps — Flux de travail Git (référentiel 8.1 et 8.3) : branches, stratégies,
 * drapeaux, fusion, messages, qualité, versionnement.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Une branche, une intention
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "devops-wf-l1",
  title: "Une branche, une intention",
  blocks: [
    {
      kind: "text",
      text: "Une branche qui vit trois semaines pose un problème que sa durée rend inévitable : pendant ce temps, la branche principale avance, et les deux versions divergent. Plus l'écart grandit, plus la fusion devient risquée — et le coût de cette fusion croît beaucoup plus vite que la durée de la branche.",
    },
    {
      kind: "text",
      text: "Ce n'est pas une question de conflits textuels, que Git résout assez bien. Le vrai risque est le conflit **sémantique** : deux modifications qui fusionnent proprement et produisent un comportement faux. Quelqu'un renomme une méthode, un autre en ajoute un appel dans sa branche ; le texte ne se chevauche pas, la fusion réussit, la compilation échoue — ou pire, réussit.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le coût de la divergence, en pratique.",
      code: `Branche d'un jour
  · quelques fichiers touchés, contexte frais
  · conflits rares, résolus en minutes
  · la revue tient sur un écran

Branche de trois semaines
  · des dizaines de fichiers, contexte oublié
  · conflits nombreux, dont sémantiques
  · une revue de 2 000 lignes que personne ne lit
    réellement → approuvée sans être examinée
  · et la peur de fusionner, qui fait attendre
    encore un peu — ce qui aggrave tout`,
    },
    {
      kind: "text",
      text: "Le dernier point est le plus insidieux : plus une branche est ancienne, plus la fusionner fait peur, donc plus on repousse. La situation se dégrade d'elle-même, et l'on finit par des branches de plusieurs mois que personne n'ose intégrer — jusqu'à ce qu'elles soient abandonnées, avec le travail qu'elles contenaient.",
    },
    {
      kind: "comparison",
      title: "Deux façons de découper le travail",
      left: {
        label: "Par fonctionnalité complète",
        text: "Une branche par sujet, fusionnée quand tout est fini. Simple à expliquer, mais la durée dépend de la taille de la fonctionnalité — et certaines demandent des semaines, ce qui ramène tous les problèmes de la divergence.",
      },
      right: {
        label: "Par incrément livrable",
        text: "Plusieurs branches courtes, chacune intégrable sans casser quoi que ce soit, même si la fonctionnalité n'est pas visible. Demande de savoir découper — c'est une compétence — et rend chaque revue lisible.",
      },
    },
    {
      kind: "text",
      text: "Le découpage en incréments intégrables est la compétence centrale de tout ce chapitre. Une fonctionnalité de trois semaines se découpe presque toujours : la migration de schéma d'abord, le service ensuite, l'exposition en dernier, chaque étape étant intégrable sans effet visible tant que la dernière n'est pas là.",
    },
    {
      kind: "text",
      text: "Quand le découpage ne suffit pas — un changement qui serait visible avant d'être fini — le drapeau de fonctionnalité prend le relais : le code est intégré, désactivé, et activé le jour voulu. C'est le sujet d'une leçon ultérieure, et c'est ce qui rend les branches courtes possibles même sur de gros chantiers.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le bon indicateur : l'âge des branches ouvertes",
      text: "Peu d'équipes le mesurent, et c'est pourtant le signal le plus parlant. Si la moitié des branches ouvertes ont plus d'une semaine, les conflits, les revues superficielles et les intégrations risquées sont déjà là — indépendamment de la stratégie affichée. Un simple graphique de l'âge médian suffit à rendre le problème visible.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Mesurer l'âge des branches ouvertes.",
      code: `git for-each-ref --sort=committerdate \
    --format='%(committerdate:relative)  %(refname:short)' \
    refs/remotes/origin

# il y a 2 heures    origin/fix-total-panier
# il y a 1 jour      origin/feat-export-csv
# il y a 3 semaines  origin/refonte-facturation   ← alerte
# il y a 4 mois      origin/poc-nouveau-moteur    ← abandonnée

# Si la moitié des branches dépassent la semaine,
# les conflits et les revues superficielles sont
# déjà là, quelle que soit la stratégie affichée.`,
    },
    {
      kind: "text",
      text: "Cette commande tient en une ligne et donne en quelques secondes un diagnostic que personne ne fait. Les branches de plusieurs mois qui y apparaissent sont presque toujours du travail abandonné : les supprimer explicitement vaut mieux que de les laisser suggérer qu'une reprise est possible, alors que leur intégration est devenue hors de portée.",
    },
    {
      kind: "text",
      text: "Retenons le principe : une branche porte une intention, vit quelques jours au maximum, et son coût de fusion croît beaucoup plus vite que sa durée. Tout ce qui suit — stratégies de branches, drapeaux, façons de fusionner — n'est qu'une déclinaison de cette contrainte. Toute stratégie de branches qui produit des branches longues échoue pour la même raison, quel que soit son nom.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "devops-wf-01",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Quel est le principal risque d'une branche de trois semaines ?",
    choices: [
      "Le conflit sémantique : des modifications qui fusionnent proprement et produisent un comportement faux.",
      "La perte du travail si la branche n'est pas poussée régulièrement.",
      "L'impossibilité technique de fusionner au-delà d'un certain nombre de commits.",
      "La saturation du dépôt par des objets Git inutilisés.",
    ],
    answer: 0,
    explanation:
      "Git résout assez bien les conflits textuels. Le vrai danger est ailleurs : quelqu'un renomme une méthode pendant qu'un autre en ajoute un appel dans sa branche — le texte ne se chevauche pas, la fusion réussit, et le résultat est faux. S'y ajoute la revue de deux mille lignes que personne n'examine réellement, et la peur de fusionner qui fait encore attendre.",
  },
  {
    kind: "match",
    id: "devops-wf-02",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Associe chaque symptôme à sa cause.",
    pairs: [
      { left: "Une revue approuvée sans être lue", right: "La branche est trop grosse pour être examinée" },
      { left: "La fusion compile mais le comportement est faux", right: "Un conflit sémantique, invisible pour Git" },
      { left: "Personne n'ose intégrer une branche", right: "Elle a trop divergé : le risque paraît trop grand" },
      { left: "Une branche finit abandonnée", right: "L'attente a rendu l'intégration impossible" },
    ],
    explanation:
      "Ces quatre symptômes découlent de la même cause : la durée de vie de la branche. Le dernier point est le plus insidieux — plus une branche est ancienne, plus la fusionner fait peur, donc plus on repousse, ce qui aggrave la divergence. La situation se dégrade d'elle-même.",
  },
  {
    kind: "recall",
    id: "devops-wf-03",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Comment garder des branches courtes sur une fonctionnalité de plusieurs semaines ?",
    explanation:
      "En la découpant en **incréments intégrables** : des étapes qui peuvent rejoindre la branche principale sans rien casser, même si la fonctionnalité n'est pas encore visible. Une évolution typique se découpe presque toujours — la migration de schéma d'abord, le service ensuite, l'exposition en dernier — chaque étape étant livrable sans effet perceptible tant que la dernière n'est pas là. C'est une compétence à part entière, et la principale de ce sujet. Quand le découpage ne suffit pas, parce qu'un changement serait visible avant d'être terminé, le drapeau de fonctionnalité prend le relais : le code est intégré mais désactivé, et l'on active le jour voulu. Un bon indicateur pour savoir où l'on en est : mesurer l'âge médian des branches ouvertes. Si la moitié dépassent la semaine, les conflits, les revues superficielles et les intégrations risquées sont déjà présents, quelle que soit la stratégie affichée.",
    keyPoints: [
      "Découper en incréments intégrables sans effet visible",
      "Schéma, puis service, puis exposition",
      "Drapeau de fonctionnalité quand le découpage ne suffit pas",
      "Mesurer l'âge médian des branches ouvertes",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — GitFlow
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "devops-wf-l2",
  title: "GitFlow",
  blocks: [
    {
      kind: "text",
      text: "GitFlow est le modèle de branches le plus connu, décrit en 2010, et il a été adopté bien au-delà du contexte pour lequel il avait été conçu. Comprendre ce contexte est la clé : il explique à la fois pourquoi le modèle fonctionne là où il s'applique, et pourquoi il gêne partout ailleurs.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Cinq types de branches, deux permanentes.",
      code: `main       ────●────────────●──────────●───►
                 │            │          │
                v1.0        v1.1       v1.1.1
                 ▲            ▲          ▲
release        ──┘      ──────┘          │
                 ▲            ▲       hotfix
develop  ──●──●──┴──●──●──●───┴──●──●────┴──►
           ▲  ▲        ▲  ▲         ▲
feature    └──┘        └──┘         └──

main     : uniquement des versions publiées
develop  : l'intégration en cours
feature  : une par sujet, part de develop
release  : stabilisation avant publication
hotfix   : correctif urgent, part de main`,
    },
    {
      kind: "text",
      text: "Le modèle a été pensé pour du logiciel **livré en versions**, installé chez des clients, avec plusieurs versions en circulation simultanément. Dans ce cadre, chaque élément se justifie : la branche de stabilisation permet de préparer une publication pendant que le développement continue, et le correctif urgent part de la version publiée sans embarquer le travail en cours.",
    },
    {
      kind: "text",
      text: "Le problème apparaît quand on applique ce modèle à une application web déployée plusieurs fois par jour. Il n'y a alors qu'une seule version en circulation — celle en production — et la branche de stabilisation n'a plus d'objet. Restent les coûts : deux branches permanentes à synchroniser, des fusions croisées, et une distance accrue entre l'écriture du code et sa mise en production.",
    },
    {
      kind: "comparison",
      title: "Quand chaque modèle se justifie",
      left: {
        label: "GitFlow convient",
        text: "Plusieurs versions installées chez des clients, publications planifiées, période de stabilisation nécessaire, correctifs à porter sur d'anciennes versions. Le modèle répond alors à des besoins réels, et sa complexité est justifiée.",
      },
      right: {
        label: "GitFlow gêne",
        text: "Une application web, une seule version en production, plusieurs déploiements par jour. La branche d'intégration devient un sas qui retarde sans protéger, et les fusions croisées produisent des conflits que rien ne justifie.",
      },
    },
    {
      kind: "text",
      text: "Le symptôme le plus courant d'un modèle mal adapté est la branche d'intégration qui diverge de la branche principale sans qu'on sache exactement ce qui est déployé. On répond alors par des synchronisations manuelles, puis par un script, puis par une convention — et l'on maintient une complexité dont personne ne tire de bénéfice.",
    },
    {
      kind: "text",
      text: "Un élément mérite d'être conservé même hors de GitFlow : la branche de correctif urgent partant de la version en production. Quand un défaut critique doit être corrigé alors que la branche principale contient du travail non publiable, repartir de l'étiquette déployée est la bonne réponse — indépendamment du modèle par ailleurs.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le modèle est une conséquence, pas un choix initial",
      text: "La question à poser n'est pas « quel modèle adopter » mais « à quelle fréquence livrons-nous, et combien de versions coexistent ». Les réponses déterminent le modèle. Adopter GitFlow parce qu'il est connu, sur une équipe qui déploie en continu, revient à payer une assurance contre un risque qu'on ne court pas.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Le correctif urgent, la partie qui reste utile partout.",
      code: `# La branche principale contient du travail non
# publiable, mais un défaut critique est en production.
git switch --detach v2.4.1        # l'étiquette déployée
git switch -c hotfix/paiement-double

# … correction, tests, revue …

git switch main && git merge hotfix/paiement-double
git tag v2.4.2                    # publication immédiate

# Puis reporter sur la branche de développement,
# sinon le correctif disparaît à la prochaine version.`,
    },
    {
      kind: "text",
      text: "Le report sur la branche de développement est l'étape qu'on oublie sous la pression de l'incident, et son oubli produit une régression particulièrement déroutante : le défaut corrigé réapparaît à la version suivante. C'est un cas où une liste de contrôle écrite vaut mieux que la mémoire de quelqu'un à trois heures du matin.",
    },
    {
      kind: "text",
      text: "Retenons que GitFlow répond à un problème précis — plusieurs versions en circulation et des publications planifiées — et qu'il est coûteux en dehors. Son auteur a lui-même ajouté, des années plus tard, un avertissement en ce sens sur l'article d'origine, invitant à ne pas l'appliquer aux applications livrées en continu.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "order",
    id: "devops-wf-04",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Remets dans l'ordre le cycle d'une fonctionnalité dans GitFlow.",
    items: [
      "Créer une branche de fonctionnalité à partir de develop",
      "Fusionner la fonctionnalité terminée dans develop",
      "Ouvrir une branche de stabilisation à partir de develop",
      "Fusionner la stabilisation dans main, et l'étiqueter",
      "Reporter la stabilisation dans develop pour ne rien perdre",
    ],
    explanation:
      "La dernière étape est celle qu'on oublie et qui produit les divergences : les correctifs apportés pendant la stabilisation n'existent que sur cette branche, et sans report ils disparaissent du développement en cours. C'est le genre de synchronisation manuelle qui rend le modèle coûteux hors de son contexte d'origine.",
  },
  {
    kind: "mcq",
    id: "devops-wf-05",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Dans quel contexte GitFlow se justifie-t-il ?",
    choices: [
      "Plusieurs versions installées chez des clients, avec publications planifiées et correctifs à porter sur d'anciennes versions.",
      "Une application web déployée plusieurs fois par jour.",
      "Une équipe de plus de dix développeurs, quel que soit le produit.",
      "Tout projet dont le dépôt dépasse cent mille lignes.",
    ],
    answer: 0,
    explanation:
      "Le modèle a été pensé pour du logiciel livré en versions, avec plusieurs versions en circulation. Sur une application web où une seule version existe — celle en production — la branche de stabilisation n'a plus d'objet, et il ne reste que les coûts : deux branches permanentes à synchroniser et des fusions croisées que rien ne justifie. Le nombre de développeurs n'entre pas dans le critère.",
  },
  {
    kind: "recall",
    id: "devops-wf-06",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Quelle question détermine le modèle de branches à adopter ?",
    explanation:
      "« À quelle **fréquence** livrons-nous, et combien de **versions coexistent** en circulation ? » Ces deux réponses déterminent le modèle, qui est donc une conséquence et non un choix initial. Si plusieurs versions sont installées chez des clients et que les publications sont planifiées, une branche de stabilisation et des correctifs portés sur d'anciennes versions sont de vrais besoins : la complexité de GitFlow est alors justifiée. Si une seule version existe — celle en production — et qu'on déploie plusieurs fois par jour, cette même complexité ne protège de rien et coûte des synchronisations manuelles, des fusions croisées et une distance accrue entre l'écriture du code et sa mise en production. Adopter un modèle parce qu'il est connu revient à payer une assurance contre un risque qu'on ne court pas. Un élément reste utile dans tous les cas : la branche de correctif urgent partant de l'étiquette déployée, quand la branche principale contient du travail non publiable.",
    keyPoints: [
      "Fréquence de livraison et nombre de versions en circulation",
      "Le modèle est une conséquence, pas un choix de départ",
      "Plusieurs versions chez des clients : GitFlow se justifie",
      "Le correctif partant de l'étiquette déployée reste utile partout",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — L'intégration sur la branche principale
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "devops-wf-l3",
  title: "L'intégration sur la branche principale",
  blocks: [
    {
      kind: "text",
      text: "La stratégie alternative renverse le raisonnement : plutôt que d'organiser des branches pour gérer la divergence, on supprime la divergence. Une seule branche durable, des branches de travail qui vivent quelques heures à un ou deux jours, et une intégration continue au sens littéral — plusieurs fois par jour.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Une seule branche durable.",
      code: `main  ──●──●──●──●──●──●──●──●──●──●──►
         ▲  ▲     ▲  ▲     ▲     ▲
         │  │     │  │     │     │
         └──┴─────┴──┴─────┴─────┘
        branches de quelques heures

· Chaque intégration passe la chaîne complète
· main est déployable à tout instant
· Ce qui n'est pas fini est désactivé par un
  drapeau, pas isolé dans une branche
· Les conflits n'ont pas le temps d'apparaître`,
    },
    {
      kind: "text",
      text: "La propriété centrale est que la branche principale doit rester **déployable en permanence**. Cela ne signifie pas que tout est fini, mais que rien de cassé n'y entre : le code non terminé est présent et désactivé, ce qui est très différent d'être absent. Cette discipline est la contrepartie exigée par la suppression des branches longues.",
    },
    {
      kind: "comparison",
      title: "Où se déplace la difficulté",
      left: {
        label: "Branches longues",
        text: "La difficulté est à la **fin** : la fusion. On travaille tranquillement, puis on découvre les conflits, les divergences et les incompatibilités d'un coup, souvent sous pression parce que la livraison est prévue.",
      },
      right: {
        label: "Intégration continue",
        text: "La difficulté est **répartie** : un peu à chaque intégration, sur du travail dont le contexte est frais. Exige en revanche une chaîne de vérification rapide et fiable, et la discipline du découpage.",
      },
    },
    {
      kind: "text",
      text: "Ce déplacement est le vrai sujet. Le travail total n'est pas moindre — il est étalé, fait sur du contexte récent, et sans l'effet d'accumulation qui rend une grosse fusion risquée. En contrepartie, l'équipe doit pouvoir vérifier une modification en quelques minutes, sans quoi l'intégration fréquente devient impraticable.",
    },
    {
      kind: "text",
      text: "Les prérequis sont donc réels : une suite de tests rapide et digne de confiance, un déploiement automatisé, des revues faites dans l'heure, et des drapeaux de fonctionnalité pour ce qui ne peut pas être livré tout de suite. Sans ces éléments, l'intégration continue devient un vœu et l'on retombe sur des branches qui durent.",
    },
    {
      kind: "text",
      text: "Une variante fréquente conserve des demandes de fusion très courtes — ouvertes le matin, fusionnées l'après-midi — plutôt que des poussées directes. Elle garde la revue et les vérifications automatiques tout en évitant la divergence, et c'est en pratique la forme la plus répandue de cette approche. On garde ainsi le bénéfice principal — l'absence de divergence — sans renoncer au regard d'un second développeur sur chaque changement.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une branche protégée sans chaîne rapide bloque tout",
      text: "Exiger que la chaîne passe avant fusion n'a de sens que si elle dure quelques minutes. À vingt minutes, chaque fusion devient une attente, les développeurs regroupent leurs changements pour n'attendre qu'une fois, et les branches rallongent — exactement ce qu'on voulait éviter. La durée de la chaîne est donc un paramètre structurant, pas un détail technique.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "La branche protégée, et ce qu'elle impose.",
      code: `# Règles sur main
protection:
  require_pull_request: true
  required_approvals: 1
  require_status_checks:
    - build
    - tests
    - quality_gate
  require_branches_up_to_date: true
  allow_force_push: false

# « up_to_date » oblige à rebaser avant de fusionner :
# la chaîne s'exécute sur ce qui sera RÉELLEMENT sur
# main, pas sur un état antérieur — ce qui évite la
# fusion verte qui casse la branche principale.`,
    },
    {
      kind: "text",
      text: "L'exigence de branche à jour mérite d'être comprise : sans elle, une branche testée il y a deux heures peut être fusionnée sur une branche principale qui a changé entre-temps, et l'incompatibilité n'est découverte qu'après. C'est précisément le conflit sémantique évoqué en première leçon, et cette option le rend impossible. Elle a un coût, celui de rebaser avant chaque fusion, mais ce coût reste négligeable tant que les branches sont courtes — ce qui est précisément l'hypothèse de départ.",
    },
    {
      kind: "text",
      text: "Retenons que cette approche ne supprime pas le travail d'intégration, elle le répartit — et qu'elle exige en échange une chaîne rapide, des revues promptes et la capacité à découper. Sans ces prérequis, elle ne tient pas ; avec eux, elle supprime la catégorie entière des problèmes de divergence — ce qui change la nature du travail quotidien bien plus qu'on ne l'imagine avant de l'avoir vécu.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "devops-wf-07",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Que signifie « la branche principale doit rester déployable en permanence » ?",
    choices: [
      "Rien de cassé n'y entre : le code non terminé y est présent mais désactivé, pas absent.",
      "Seules les fonctionnalités entièrement terminées peuvent y être fusionnées.",
      "Chaque commit doit être déployé automatiquement en production.",
      "La branche ne doit recevoir que des correctifs, jamais de nouvelles fonctionnalités.",
    ],
    answer: 0,
    explanation:
      "La distinction est essentielle : le code non terminé est **présent et désactivé**, ce qui est très différent d'être isolé dans une branche. C'est ce qui permet de supprimer les branches longues tout en gardant la possibilité de déployer à tout instant — et c'est la discipline exigée en contrepartie.",
  },
  {
    kind: "match",
    id: "devops-wf-08",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "Associe chaque prérequis à ce qu'il rend possible.",
    pairs: [
      { left: "Une suite de tests rapide et fiable", right: "Intégrer plusieurs fois par jour sans attendre" },
      { left: "Des revues faites dans l'heure", right: "Des branches qui ne dépassent pas la journée" },
      { left: "Des drapeaux de fonctionnalité", right: "Intégrer du code non terminé sans le rendre visible" },
      { left: "Un déploiement automatisé", right: "Livrer ce qui est intégré, sans opération manuelle" },
    ],
    explanation:
      "Ces prérequis sont réels et conditionnent la faisabilité : sans eux, l'intégration continue devient un vœu et l'on retombe sur des branches qui durent. La durée de la chaîne de vérification est particulièrement structurante — à vingt minutes, chacun regroupe ses changements pour n'attendre qu'une fois, et les branches rallongent.",
  },
  {
    kind: "recall",
    id: "devops-wf-09",
    difficulty: 2,
    tags: ["git", "workflow"],
    prompt: "En quoi l'intégration continue déplace-t-elle la difficulté plutôt que de la supprimer ?",
    explanation:
      "Le travail d'intégration existe toujours, mais il change de moment et de nature. Avec des branches longues, il est concentré **à la fin** : on développe tranquillement, puis on découvre d'un coup les conflits, les divergences et les incompatibilités — souvent sous pression, parce qu'une livraison est prévue, et sur du code dont le contexte s'est estompé. Avec l'intégration continue, ce travail est **réparti** : un peu à chaque fusion, sur du code écrit le jour même, sans l'effet d'accumulation qui rend une grosse fusion risquée. Le total n'est pas nécessairement moindre, mais il est fait dans de bien meilleures conditions, et surtout il ne peut plus produire la situation où personne n'ose intégrer. En contrepartie, cette approche exige une chaîne de vérification de quelques minutes, des revues promptes, un déploiement automatisé et la capacité à découper en incréments — sans quoi elle n'est pas tenable.",
    keyPoints: [
      "Branches longues : difficulté concentrée à la fin, sous pression",
      "Intégration continue : difficulté répartie, sur du contexte frais",
      "Le total n'est pas moindre, les conditions sont meilleures",
      "Exige chaîne rapide, revues promptes, déploiement automatisé",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les drapeaux de fonctionnalité
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "devops-wf-l4",
  title: "Les drapeaux de fonctionnalité",
  blocks: [
    {
      kind: "text",
      text: "Le drapeau de fonctionnalité résout une contradiction apparente : comment intégrer du code non terminé sur une branche déployable ? En séparant deux décisions qu'on croyait liées — **déployer** du code, et **activer** un comportement. Le code part en production, désactivé, et l'activation devient un réglage.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le déploiement et la publication, découplés.",
      code: `if (drapeaux.actif("nouveau-tunnel-paiement", utilisateur)) {
    return nouveauTunnel.traite(commande);
}
return ancienTunnel.traite(commande);

// Ce que cela permet :
//  · intégrer chaque jour, sans rien rendre visible
//  · activer pour l'équipe seule, puis 1 %, puis 10 %
//  · désactiver en quelques secondes si un problème
//    apparaît — sans redéployer ni revenir en arrière
//  · comparer deux variantes sur du trafic réel`,
    },
    {
      kind: "text",
      text: "La désactivation immédiate est le bénéfice le plus concret en exploitation. Un défaut découvert en production se traite en changeant un réglage, en quelques secondes, sans reconstruire ni redéployer. C'est incomparablement plus rapide qu'un retour arrière, et cela permet d'activer une nouveauté à un moment où l'équipe est disponible plutôt qu'au moment du déploiement.",
    },
    {
      kind: "comparison",
      title: "Deux natures de drapeau",
      left: {
        label: "Temporaire",
        text: "Accompagne le développement d'une fonctionnalité : activé progressivement, puis **retiré** une fois la fonctionnalité stabilisée. Sa durée de vie se compte en semaines, et son retrait fait partie du travail.",
      },
      right: {
        label: "Permanent",
        text: "Exprime une différence durable : une option payante, un comportement propre à un client, une limitation réglementaire. Il n'a pas vocation à disparaître, et doit être documenté comme une caractéristique du produit.",
      },
    },
    {
      kind: "text",
      text: "Confondre les deux est la source du principal problème de cette pratique : le drapeau temporaire qu'on oublie de retirer. Chacun ajoute un chemin d'exécution supplémentaire, donc une combinaison à tester. Dix drapeaux oubliés produisent mille combinaisons théoriques, dont personne n'exerce jamais la plus grande partie.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce qui rend la pratique tenable.",
      code: `À la création d'un drapeau temporaire :
  · une date d'expiration prévue
  · un responsable nommé
  · une tâche de retrait créée immédiatement

En continu :
  · la chaîne signale les drapeaux expirés
  · le compte de drapeaux actifs est suivi
  · retirer un drapeau = supprimer la condition ET
    le chemin devenu mort

Sans cela, le nombre croît indéfiniment et le code
devient un labyrinthe de conditions dont personne
ne sait plus lesquelles sont encore utiles.`,
    },
    {
      kind: "text",
      text: "Le retrait doit supprimer la condition **et** le chemin devenu inutile. Laisser l'ancien code « au cas où » double le travail de chaque modification ultérieure, et ce code non exercé diverge silencieusement jusqu'à devenir incompatible. Si un retour en arrière est nécessaire, l'historique du dépôt est là pour cela.",
    },
    {
      kind: "text",
      text: "Un dernier point concerne la cohérence : un utilisateur ne doit pas voir la fonctionnalité apparaître et disparaître d'une requête à l'autre. L'évaluation doit donc être stable pour un même utilisateur — typiquement en dérivant la décision de son identifiant — et non tirée au hasard à chaque appel.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un drapeau n'est pas un contrôle d'accès",
      text: "Masquer un bouton n'empêche pas d'appeler l'API correspondante. Si une fonctionnalité ne doit pas être utilisable, elle doit être protégée côté serveur par une véritable autorisation. Le drapeau décide de ce qu'on **montre**, jamais de ce qu'on **autorise** — les confondre produit une faille que l'interface ne laisse pas soupçonner.",
    },
    {
      kind: "text",
      text: "L'activation progressive mérite d'être organisée plutôt qu'improvisée. La séquence habituelle expose la nouveauté à l'équipe, puis à un petit pourcentage d'utilisateurs, puis à une part croissante, en observant à chaque palier les indicateurs qui comptent — taux d'erreur, latence, conversion. Chaque palier est une occasion d'arrêter, et le coût d'un problème reste proportionnel à l'exposition.",
    },
    {
      kind: "text",
      text: "Cette progression n'a de sens que si l'on regarde effectivement les indicateurs entre deux paliers. Activer pour un pour cent puis passer à cent le lendemain sans rien observer revient à se donner l'illusion de la prudence — le mécanisme était là, la décision n'a simplement pas été prise sur des données.",
    },
    {
      kind: "text",
      text: "Retenons le découplage — déployer n'est pas activer — et sa condition de viabilité : distinguer les drapeaux temporaires des permanents, et retirer les premiers avec la même discipline qu'on les a créés. Sans ce nettoyage, l'outil qui devait simplifier finit par compliquer davantage.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "devops-wf-10",
    difficulty: 2,
    tags: ["git", "feature-flags", "securite"],
    prompt: "Cette protection est insuffisante. Quelle ligne pose problème ?",
    code: {
      language: "tsx",
      code: `function BarreAdmin({ utilisateur }) {
  if (!drapeaux.actif("administration", utilisateur)) {
    return null;
  }
  return <BoutonSupprimerTout />;
}`,
    },
    faultyLine: 2,
    reasons: [
      "Un drapeau décide de ce qu'on montre, pas de ce qu'on autorise : l'API reste appelable directement.",
      "`drapeaux.actif` devrait être appelé dans un effet plutôt qu'au rendu.",
      "Le composant devrait renvoyer un fragment vide plutôt que `null`.",
      "L'utilisateur devrait être lu depuis un contexte plutôt que reçu en prop.",
    ],
    reasonAnswer: 0,
    explanation:
      "Masquer un bouton n'empêche pas d'appeler l'API correspondante : n'importe qui peut envoyer la requête directement. Si la fonctionnalité ne doit pas être utilisable, elle doit être protégée côté serveur par une véritable autorisation. Le drapeau et le contrôle d'accès répondent à deux questions différentes, et les confondre produit une faille que l'interface ne laisse pas soupçonner.",
  },
  {
    kind: "mcq",
    id: "devops-wf-11",
    difficulty: 2,
    tags: ["git", "feature-flags"],
    prompt: "Quel est le principal risque de la pratique des drapeaux de fonctionnalité ?",
    choices: [
      "L'accumulation de drapeaux temporaires jamais retirés, chacun ajoutant un chemin d'exécution à tester.",
      "Le coût d'évaluation du drapeau à chaque requête.",
      "L'impossibilité de tester le code désactivé.",
      "La nécessité de redéployer pour changer un drapeau.",
    ],
    answer: 0,
    explanation:
      "Chaque drapeau double théoriquement le nombre de combinaisons : dix drapeaux oubliés en produisent mille, dont personne n'exerce la plus grande partie. Le remède est organisationnel — date d'expiration, responsable nommé, tâche de retrait créée dès la création — et le retrait doit supprimer la condition **et** le chemin devenu mort.",
  },
  {
    kind: "recall",
    id: "devops-wf-12",
    difficulty: 2,
    tags: ["git", "feature-flags"],
    prompt: "Quelle distinction fondamentale un drapeau de fonctionnalité permet-il ?",
    explanation:
      "Celle entre **déployer** du code et **activer** un comportement, qu'on croyait liées. Le code part en production, désactivé, et l'activation devient un réglage indépendant du déploiement. Trois bénéfices en découlent. On peut intégrer chaque jour sur une branche déployable sans rien rendre visible, ce qui rend possibles les branches courtes même sur de gros chantiers. On peut activer progressivement — l'équipe, puis un pour cent des utilisateurs, puis dix — et observer le comportement réel avant de généraliser. Et surtout, on peut désactiver en quelques secondes si un problème apparaît, sans reconstruire ni redéployer : c'est incomparablement plus rapide qu'un retour arrière, et cela permet d'activer une nouveauté à un moment où l'équipe est disponible plutôt qu'au moment du déploiement. La contrepartie est le nettoyage, sans lequel les chemins d'exécution s'accumulent.",
    keyPoints: [
      "Déployer et activer deviennent deux décisions séparées",
      "Intégrer chaque jour sans rendre visible",
      "Activer progressivement et observer sur du trafic réel",
      "Désactiver en secondes, sans redéployer",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Fusionner, rebaser, écraser
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "devops-wf-l5",
  title: "Fusionner, rebaser, écraser",
  blocks: [
    {
      kind: "text",
      text: "Trois façons d'intégrer une branche existent, elles produisent trois historiques différents, et le choix relève de la convention d'équipe plutôt que de la technique. Ce qui compte est de comprendre ce que chacune conserve et ce qu'elle perd, puis de s'y tenir.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois résultats pour la même branche.",
      code: `Départ :   main  A───B───C
           fonct.     └───D───E

FUSION            A───B───C───────M
                       └───D───E──┘
  · conserve tout, et le fait que D-E formaient
    une branche
  · historique ramifié, parfois difficile à lire

REBASE            A───B───C───D'──E'
  · linéaire, chaque commit reste distinct
  · D et E sont RÉÉCRITS : nouvelles empreintes

ÉCRASEMENT        A───B───C───F
  · F contient tout le travail en un commit
  · le détail de la branche disparaît`,
    },
    {
      kind: "text",
      text: "Le rebase **réécrit** les commits : D et E deviennent D' et E', avec un contenu identique mais des empreintes différentes. C'est cette propriété qui fonde la seule règle absolue du domaine — ne jamais rebaser une branche que quelqu'un d'autre a récupérée, car son historique et le vôtre ne correspondent plus.",
    },
    {
      kind: "text",
      text: "Concrètement, un collègue qui avait récupéré la branche se retrouve avec des commits qui n'existent plus en amont. Son prochain effort de synchronisation produira des doublons ou des conflits absurdes, et la sortie demande des manipulations que personne n'aime faire. D'où la formulation courante : rebaser sa propre branche non partagée, jamais une branche commune.",
    },
    {
      kind: "comparison",
      title: "Deux philosophies de l'historique",
      left: {
        label: "Fidèle",
        text: "La fusion conserve ce qui s'est réellement passé, y compris les allers-retours et les corrections. Utile pour comprendre le déroulement, mais l'historique se remplit de commits intermédiaires sans intérêt durable.",
      },
      right: {
        label: "Raconté",
        text: "Rebase ou écrasement produisent un historique propre, où chaque commit est une étape cohérente. Plus agréable à relire et à parcourir, au prix d'une réécriture qui masque le déroulement réel.",
      },
    },
    {
      kind: "text",
      text: "L'écrasement à la fusion est devenu le choix majoritaire sur les demandes de fusion courtes, et pour une bonne raison : l'unité qui a du sens est la **demande de fusion**, pas les commits intermédiaires qui la composent. Un historique où chaque entrée correspond à un changement revu et testé est nettement plus utile pour chercher l'origine d'un défaut.",
    },
    {
      kind: "text",
      text: "Ce choix suppose toutefois des branches courtes. Écraser trois semaines de travail en un commit produit une entrée énorme, impossible à comprendre et surtout impossible à annuler partiellement — ce qui est précisément ce qu'on veut pouvoir faire quand une seule partie pose problème.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le commit de fusion garde une utilité",
      text: "Sur une branche longue ou un chantier structurant, il marque explicitement l'intégration et permet d'annuler l'ensemble en une opération. Beaucoup d'équipes adoptent une règle simple : écrasement par défaut pour les demandes de fusion courantes, commit de fusion pour les branches de version ou les gros changements identifiés.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "La configuration qui évite les fusions parasites.",
      code: `# Sans cela, chaque « git pull » qui trouve des
# commits distants crée un commit de fusion inutile :
#   « Merge branch 'main' of github.com:… »
git config --global pull.rebase true

# Et pour ne jamais créer de branche par accident
# lors d'un rebase interrompu :
git config --global rebase.autoStash true

# Vérifier ce qui sera poussé, avant de pousser :
git log --oneline origin/main..HEAD`,
    },
    {
      kind: "text",
      text: "Ces commits de fusion parasites sont la source la plus courante d'historiques illisibles : ils n'apportent aucune information, se multiplient à chaque synchronisation, et finissent par représenter la moitié des entrées. Une ligne de configuration globale règle le problème définitivement, pour tous les dépôts.",
    },
    {
      kind: "text",
      text: "Un point mérite d'être clarifié parce qu'il inquiète souvent : le rebase ne « perd » rien. Les commits d'origine restent accessibles pendant plusieurs semaines par le journal des références, et l'on peut revenir à l'état antérieur d'une commande. La prudence reste de mise sur une branche partagée, mais sur sa propre branche, l'opération est réversible.",
    },
    {
      kind: "text",
      text: "La forme interactive du rebase mérite aussi d'être connue : elle permet de réordonner, fusionner ou reformuler ses propres commits avant de les proposer à la revue. Nettoyer une branche de ses commits « correction du test » avant d'ouvrir la demande de fusion coûte deux minutes et rend l'historique nettement plus lisible pour celui qui relira.",
    },
    {
      kind: "text",
      text: "Un dernier réflexe mérite d'être adopté : configurer la synchronisation pour rebaser plutôt que fusionner. Sans cela, chaque récupération crée un commit de fusion parasite qui pollue l'historique sans rien apporter — c'est la source la plus courante d'historiques illisibles, et elle se règle par une ligne de configuration valable pour tous les dépôts d'une machine. C'est le réglage le plus rentable de la liste, et le plus souvent ignoré.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "output",
    id: "devops-wf-13",
    difficulty: 2,
    tags: ["git", "historique"],
    prompt: "`main` contient A-B-C, la branche contient D-E. Que produit un rebase de la branche sur `main` ?",
    code: {
      language: "bash",
      code: `# main     : A---B---C
# fonction :     \\---D---E

git switch fonction
git rebase main
git log --oneline`,
    },
    choices: [
      "Un historique linéaire A-B-C-D'-E', où D et E sont réécrits avec de nouvelles empreintes.",
      "Un historique ramifié A-B-C-M avec un commit de fusion reliant D et E.",
      "Un historique A-B-C-F où D et E sont regroupés en un seul commit.",
      "Une erreur : un rebase exige que la branche soit à jour avec `main`.",
    ],
    answer: 0,
    explanation:
      "Le rebase rejoue les commits de la branche au sommet de `main` : le contenu est identique mais les empreintes changent, d'où la notation D' et E'. C'est cette réécriture qui fonde la règle absolue — ne jamais rebaser une branche que quelqu'un d'autre a récupérée, car son historique et le vôtre ne correspondraient plus.",
  },
  {
    kind: "mcq",
    id: "devops-wf-14",
    difficulty: 2,
    tags: ["git", "historique"],
    prompt: "Pourquoi l'écrasement à la fusion est-il devenu majoritaire sur les demandes de fusion courtes ?",
    choices: [
      "L'unité qui a du sens est la demande de fusion, pas les commits intermédiaires qui la composent.",
      "Il évite les conflits lors de l'intégration.",
      "Il est le seul à préserver les empreintes des commits d'origine.",
      "Il permet d'annuler chaque commit intermédiaire séparément.",
    ],
    answer: 0,
    explanation:
      "Un historique où chaque entrée correspond à un changement revu et testé est nettement plus utile pour chercher l'origine d'un défaut que dix commits « wip » et « correction du test ». Cela suppose en revanche des branches courtes : écraser trois semaines de travail produit une entrée énorme, incompréhensible et impossible à annuler partiellement.",
  },
  {
    kind: "recall",
    id: "devops-wf-15",
    difficulty: 2,
    tags: ["git", "historique"],
    prompt: "Quelle est la seule règle absolue concernant le rebase ?",
    explanation:
      "Ne **jamais rebaser une branche que quelqu'un d'autre a récupérée**. Le rebase réécrit les commits : leur contenu est identique mais leurs empreintes changent. Un collègue qui avait récupéré la branche se retrouve donc avec des commits qui n'existent plus en amont, et sa prochaine synchronisation produit soit des doublons, soit des conflits absurdes sur du code qu'il n'a pas touché. La sortie demande des manipulations que personne n'aime faire, et le risque de perdre du travail est réel. La formulation pratique est donc : rebaser librement sa propre branche tant qu'elle n'est pas partagée, jamais une branche commune. S'y ajoute un réflexe utile — configurer la synchronisation pour rebaser plutôt que fusionner, faute de quoi chaque récupération crée un commit de fusion parasite, source la plus courante d'historiques illisibles.",
    keyPoints: [
      "Le rebase réécrit les empreintes, pas seulement l'ordre",
      "Une branche partagée rebasée casse l'historique des autres",
      "Rebaser sa branche non partagée : sans risque",
      "Configurer la synchronisation en rebase évite les fusions parasites",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Les messages de commit
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "devops-wf-l6",
  title: "Les messages de commit",
  blocks: [
    {
      kind: "text",
      text: "Un message de commit s'écrit en dix secondes et se lit pendant des années. C'est le seul endroit où l'on peut expliquer **pourquoi** un changement a été fait — le code dit déjà ce qui a été fait, et le dira toujours mieux qu'une paraphrase. Cette asymétrie devrait décider entièrement du contenu du message.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois messages pour le même changement.",
      code: `✗ « fix »
✗ « correction du bug »
✗ « modification de OrderService.java »
   → paraphrase le diff, qui est juste à côté

✓ « Empêcher la double validation d'une commande

   Un double clic envoyait deux requêtes : la
   seconde passait la vérification avant que la
   première n'ait validé sa transaction.

   On s'appuie sur une contrainte d'unicité plutôt
   que sur une vérification applicative, les deux
   requêtes pouvant être traitées en parallèle. »`,
    },
    {
      kind: "text",
      text: "Le bon message répond à trois questions que le code ne peut pas porter : quel problème se posait, pourquoi cette solution, et quelles options ont été écartées. C'est exactement ce dont a besoin celui qui, dans deux ans, se demandera pourquoi cette contrainte existe — et qui, sans réponse, la supprimera.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Une convention répandue, et ce qu'elle automatise.",
      code: `<type>(<portée>) : <résumé à l'impératif>

feat(paiement)  : accepter le paiement fractionné
fix(commande)   : empêcher la double validation
docs(readme)    : documenter le déploiement
refactor(stock) : extraire le calcul de disponibilité
test(panier)    : couvrir le cas du panier vide
chore(deps)     : mettre à jour Spring Boot

feat!  ou  BREAKING CHANGE: …   → rupture

→ Permet de générer les notes de version et de
  déduire automatiquement le prochain numéro,
  ce qui est son intérêt principal.`,
    },
    {
      kind: "text",
      text: "L'intérêt réel d'une convention formalisée n'est pas l'esthétique : c'est de rendre l'historique **exploitable par un outil**. Notes de version générées, numéro de version déduit du type des changements, filtrage par portée — toutes choses impossibles sur des messages libres, et qui se mettent en place en une journée.",
    },
    {
      kind: "comparison",
      title: "Deux parties, deux usages",
      left: {
        label: "La première ligne",
        text: "Courte, à l'impératif, sans point final. Elle apparaît dans les listes, les notes de version, les recherches. Elle doit être compréhensible seule, hors de tout contexte — c'est son unique contrainte, et elle est exigeante.",
      },
      right: {
        label: "Le corps",
        text: "Après une ligne vide. C'est là que vont le pourquoi, les alternatives écartées, les références. Personne ne le lit au quotidien, et tout le monde le lit le jour où l'on cherche à comprendre une ligne écrite il y a deux ans.",
      },
    },
    {
      kind: "text",
      text: "L'impératif — « ajouter », « corriger » — n'est pas une coquetterie : il complète naturellement la phrase « ce commit va… ». C'est aussi la forme que Git emploie lui-même dans ses messages générés, ce qui rend l'historique homogène. La cohérence compte ici plus que le choix lui-même.",
    },
    {
      kind: "text",
      text: "Sur des branches écrasées à la fusion, la convention s'applique surtout au titre de la demande de fusion, puisque c'est lui qui devient le message final. Les commits intermédiaires peuvent rester approximatifs — ils disparaîtront — ce qui lève l'objection habituelle sur le coût de la discipline pendant le développement.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Écrire pour celui qui utilisera l'annotation ligne à ligne",
      text: "Le lecteur type d'un message de commit n'est pas un relecteur : c'est quelqu'un qui, deux ans plus tard, demande à Git qui a écrit une ligne étrange et pourquoi. Si le message dit « fix », la piste s'arrête là. S'il explique le problème et la décision, la question est réglée en trente secondes — et une suppression hasardeuse est évitée.",
    },
    {
      kind: "text",
      text: "Une pratique complémentaire mérite d'être citée : référencer le ticket ou l'incident dans le corps du message. Le lien fournit le contexte complet — la discussion, les captures, la décision — que le message ne peut pas contenir entièrement. Il faut toutefois que le message reste compréhensible **sans** suivre le lien, car les outils de suivi changent et les liens finissent par ne plus répondre.",
    },
    {
      kind: "text",
      text: "C'est un point souvent négligé : un message réduit à « corrige PROJ-1234 » devient totalement inutile le jour où l'outil de suivi est remplacé ou que le projet est archivé. Le dépôt, lui, survit — et c'est pour cela que l'information essentielle doit y vivre, le lien n'étant qu'un complément.",
    },
    {
      kind: "text",
      text: "Retenons la règle : le code dit ce qui a changé, le message dit pourquoi. Une première ligne compréhensible seule, un corps qui explique le raisonnement, et une convention si l'on veut automatiser les notes de version — trois décisions bon marché dont le bénéfice se manifeste longtemps après.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "fill",
    id: "devops-wf-16",
    difficulty: 1,
    tags: ["git", "commits"],
    prompt: "Complète les deux types de la convention, selon la nature du changement.",
    code: {
      language: "text",
      code: `# Une nouvelle capacité pour l'utilisateur
{{1}}(paiement) : accepter le paiement fractionne

# Un defaut corrige, sans nouvelle capacite
{{2}}(commande) : empecher la double validation`,
    },
    blanks: ["feat", "fix"],
    distractors: ["add", "bug", "update", "chore"],
    explanation:
      "Ces deux types ont un effet direct sur le versionnement sémantique : `feat` fait progresser le numéro mineur, `fix` le numéro correctif. C'est ce qui permet de déduire automatiquement la prochaine version et de générer les notes correspondantes — l'intérêt principal d'une convention formalisée.",
  },
  {
    kind: "mcq",
    id: "devops-wf-17",
    difficulty: 2,
    tags: ["git", "commits"],
    prompt: "Que doit contenir le corps d'un message de commit ?",
    choices: [
      "Le problème qui se posait, pourquoi cette solution, et les options écartées.",
      "Un résumé des fichiers modifiés et des lignes ajoutées.",
      "La liste des tests exécutés avant la validation.",
      "Le nom du relecteur et la date prévue de déploiement.",
    ],
    answer: 0,
    explanation:
      "Le code dit déjà ce qui a changé, et mieux qu'une paraphrase. Le message est le seul endroit où le **pourquoi** peut vivre. Son lecteur type est quelqu'un qui, deux ans plus tard, demande qui a écrit une ligne étrange : si le message dit « fix », la piste s'arrête là et la ligne finit souvent supprimée à tort.",
  },
  {
    kind: "recall",
    id: "devops-wf-18",
    difficulty: 2,
    tags: ["git", "commits"],
    prompt: "Quel est l'intérêt réel d'une convention formalisée de messages ?",
    explanation:
      "Rendre l'historique **exploitable par un outil**, pas l'esthétique. Un type déclaré en tête de chaque message permet de générer automatiquement les notes de version en regroupant les nouveautés, les corrections et les ruptures ; de déduire le prochain numéro de version — une nouveauté fait progresser le numéro mineur, une correction le numéro correctif, une rupture le numéro majeur ; et de filtrer l'historique par portée pour retrouver tout ce qui a touché un module. Aucune de ces opérations n'est possible sur des messages libres, et leur mise en place demande environ une journée. Un point pratique lève l'objection habituelle sur le coût de la discipline : quand les branches sont écrasées à la fusion, la convention ne s'applique qu'au titre de la demande de fusion, puisque c'est lui qui devient le message final — les commits intermédiaires peuvent rester approximatifs, ils disparaîtront.",
    keyPoints: [
      "Générer les notes de version automatiquement",
      "Déduire le prochain numéro selon le type des changements",
      "Filtrer l'historique par portée",
      "Avec l'écrasement, seul le titre de la demande compte",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Mesurer la qualité
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "devops-wf-l7",
  title: "Mesurer la qualité",
  blocks: [
    {
      kind: "text",
      text: "Un outil d'analyse de qualité branché sur un projet existant produit invariablement le même résultat : quelques milliers de signalements, une note catastrophique, et une équipe qui cesse de regarder au bout d'une semaine. Le problème n'est pas l'outil mais la façon dont on lit ce qu'il produit.",
    },
    {
      kind: "text",
      text: "La dette accumulée sur plusieurs années ne se résorbe pas en la regardant, et exiger de la traiter avant d'avancer bloque tout. La seule approche qui fonctionne consiste à distinguer radicalement ce qui existe déjà de ce que l'on **ajoute maintenant** — et à ne poser d'exigence que sur le second.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La porte de qualité sur le code nouveau.",
      code: `Sur le code MODIFIÉ par cette demande de fusion :
  · aucune vulnérabilité
  · aucun défaut de sévérité bloquante
  · couverture des lignes nouvelles ≥ 80 %
  · duplication des lignes nouvelles ≤ 3 %

Sur l'existant : on mesure, on affiche, on ne
bloque pas.

→ La dette ne grandit plus, et elle se résorbe
  naturellement à mesure que le code est retouché.
  Le critère est atteignable, donc respecté.`,
    },
    {
      kind: "text",
      text: "Cette approche a une propriété remarquable : elle transforme un objectif inatteignable en objectif quotidien. Personne ne peut couvrir de tests cent mille lignes existantes ; tout le monde peut couvrir les quarante lignes qu'il vient d'écrire. Et comme le code le plus modifié est aussi le plus vivant, la dette se résorbe d'abord là où elle gêne le plus.",
    },
    {
      kind: "comparison",
      title: "Deux façons de poser un seuil",
      left: {
        label: "Sur l'ensemble",
        text: "« La couverture globale doit atteindre 80 %. » Inatteignable sur un projet existant, donc immédiatement contourné ou désactivé. Et une fois atteint, il pousse à écrire des tests sans assertion pour maintenir le chiffre.",
      },
      right: {
        label: "Sur le nouveau",
        text: "« Les lignes ajoutées doivent être couvertes à 80 %. » Atteignable par chacun, sur son propre changement, avec le contexte en tête. La barrière est respectée parce qu'elle est franchissable.",
      },
    },
    {
      kind: "text",
      text: "Le principe dépasse largement l'outillage de qualité : une barrière qu'on peut réellement respecter est infiniment plus efficace qu'une barrière contournée. C'est le même raisonnement que pour les seuils d'analyse de vulnérabilités, et il s'applique partout où une contrainte automatique s'interpose dans le flux de travail.",
    },
    {
      kind: "text",
      text: "Les signalements eux-mêmes méritent d'être triés. Les vulnérabilités et les défauts de correction — ressource non fermée, comparaison de références, valeur nulle déréférencée — justifient un blocage. Les remarques de style ou de complexité sont indicatives : bloquer dessus produit du bruit et détourne l'attention de ce qui compte.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "La note globale ne veut rien dire",
      text: "Une lettre ou un pourcentage agrégé sur l'ensemble du projet ne permet aucune décision : il mélange du code critique et du code mort, du récent et de l'ancien. Suivre son évolution est vaguement utile ; en faire un objectif d'équipe conduit à optimiser la métrique plutôt que le code — et l'on trouve toujours un moyen de faire monter une note.",
    },
    {
      kind: "text",
      text: "Un dernier écueil concerne l'usage social de ces mesures. Afficher un classement des développeurs par nombre de signalements transforme un outil de diagnostic en instrument de comparaison, et produit exactement les comportements qu'on ne veut pas : contourner la règle, éviter de toucher au code ancien, découper artificiellement les changements. La mesure porte sur le code, jamais sur les personnes.",
    },
    {
      kind: "text",
      text: "Le corollaire vaut d'être énoncé : ces outils sont utiles à celui qui écrit, au moment où il écrit, et beaucoup moins comme rapport mensuel destiné à quelqu'un d'autre. Un signalement affiché dans la demande de fusion, au moment où l'auteur a le contexte en tête, a infiniment plus d'effet qu'un tableau de bord consulté par une autre personne.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "La même exigence, rendue franchissable.",
      code: `quality_gate:
  conditions:
    # Sur le code NOUVEAU ou MODIFIÉ seulement
    - metric: new_coverage
      operator: LESS_THAN
      threshold: 80
      blocking: true
    - metric: new_vulnerabilities
      operator: GREATER_THAN
      threshold: 0
      blocking: true

    # Sur l'existant : mesuré, affiché, non bloquant
    - metric: coverage
      blocking: false`,
    },
    {
      kind: "text",
      text: "La différence entre ces deux configurations tient à un préfixe, et elle décide de tout : la première est respectée pendant des années, la seconde est désactivée dans la semaine. C'est un bon rappel que l'efficacité d'une contrainte automatique dépend moins de son exigence que de sa faisabilité.",
    },
    {
      kind: "text",
      text: "Retenons la règle qui rend ces outils utiles : mesurer tout, n'exiger que sur le nouveau. La dette cesse alors de croître, se résorbe là où le code est vivant, et la barrière reste franchissable — donc respectée, ce qui est la seule chose qui compte pour une contrainte automatique.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "devops-wf-19",
    difficulty: 2,
    tags: ["qualite", "ci"],
    prompt: "Comment introduire une exigence de couverture sur un projet existant ?",
    choices: [
      "En l'appliquant aux lignes nouvelles ou modifiées, pas à l'ensemble du projet.",
      "En fixant un objectif global progressif, augmenté de 5 % chaque trimestre.",
      "En bloquant toute fusion tant que le seuil global n'est pas atteint.",
      "En excluant de la mesure les modules les plus anciens.",
    ],
    answer: 0,
    explanation:
      "Personne ne peut couvrir cent mille lignes existantes ; tout le monde peut couvrir les quarante qu'il vient d'écrire. L'exigence sur le code nouveau est atteignable, donc respectée, et la dette se résorbe naturellement là où le code est le plus modifié — c'est-à-dire là où elle gêne le plus.",
  },
  {
    kind: "match",
    id: "devops-wf-20",
    difficulty: 2,
    tags: ["qualite", "ci"],
    prompt: "Associe chaque catégorie de signalement au traitement approprié.",
    pairs: [
      { left: "Vulnérabilité de sécurité", right: "Bloquer la fusion" },
      { left: "Ressource non fermée, valeur nulle déréférencée", right: "Bloquer : ce sont des défauts de correction" },
      { left: "Complexité d'une méthode jugée élevée", right: "Indicatif : afficher sans bloquer" },
      { left: "Dette de l'existant non modifié", right: "Mesurer et afficher, ne jamais bloquer" },
    ],
    explanation:
      "Bloquer sur du style ou de la complexité produit du bruit et détourne l'attention de ce qui compte. Le principe est le même que pour les seuils d'analyse de vulnérabilités : une barrière qu'on peut réellement respecter est infiniment plus efficace qu'une barrière contournée.",
  },
  {
    kind: "spot",
    id: "devops-wf-21",
    difficulty: 2,
    tags: ["qualite", "ci"],
    prompt: "Cette porte de qualité sera désactivée dans la semaine. Quelle ligne ?",
    code: {
      language: "yaml",
      code: `quality_gate:
  conditions:
    - metric: coverage
      scope: overall
      operator: LESS_THAN
      threshold: 80
      blocking: true`,
    },
    faultyLine: 4,
    reasons: [
      "Le seuil porte sur l'ensemble du projet : inatteignable sur du code existant, il sera contourné ou désactivé.",
      "Le seuil de 80 % est trop élevé quelle que soit la portée.",
      "`blocking: true` ne devrait jamais être utilisé dans une porte de qualité.",
      "La métrique de couverture ne peut pas être évaluée à la fusion.",
    ],
    reasonAnswer: 0,
    explanation:
      "Une exigence globale sur un projet existant est immédiatement hors de portée : personne ne peut y répondre dans le cadre d'une demande de fusion, donc la porte est contournée puis désactivée. La même exigence appliquée aux lignes nouvelles est atteignable par chacun, sur son propre changement, avec le contexte en tête.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Versionner et publier
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "devops-wf-l8",
  title: "Versionner et publier",
  blocks: [
    {
      kind: "text",
      text: "Un numéro de version est un message adressé à ceux qui dépendent de vous. Son seul rôle est de leur dire ce que la mise à jour risque de leur coûter — et c'est pourquoi une convention partagée vaut mieux qu'une numérotation choisie au sentiment.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois nombres, trois questions.",
      code: `MAJEUR . MINEUR . CORRECTIF
   │        │         │
   │        │         └── correction compatible
   │        │             → mise à jour sans risque
   │        └── ajout compatible
   │            → rien ne casse, du nouveau apparaît
   └── RUPTURE de compatibilité
       → lire les notes avant de mettre à jour

Le numéro décrit l'IMPACT sur ceux qui dépendent
de vous, pas l'importance du travail fourni.
Une réécriture complète sans rupture reste un
incrément mineur.`,
    },
    {
      kind: "text",
      text: "Ce dernier point est le plus souvent mal compris : le numéro majeur n'est pas une récompense pour un gros travail, c'est un **avertissement**. Une refonte interne complète qui ne change rien à l'interface publique n'est pas une rupture, et l'annoncer comme telle fait perdre du temps à tous ceux qui vont lire les notes pour rien.",
    },
    {
      kind: "text",
      text: "Inversement, retirer un champ d'une réponse, renommer un paramètre ou durcir une validation sont des ruptures, même si le changement paraît minime. Le critère est unique : un consommateur qui met à jour sans rien changer chez lui est-il susceptible de casser ? Si oui, c'est une rupture.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce qui est une rupture, et ce qui n'en est pas.",
      code: `RUPTURE
  · retirer ou renommer un champ de réponse
  · rendre obligatoire un paramètre optionnel
  · changer le type d'un champ
  · durcir une validation
  · changer un code de statut renvoyé

PAS UNE RUPTURE
  · ajouter un champ optionnel à une réponse
  · ajouter un paramètre facultatif
  · ajouter une nouvelle route
  · réécrire entièrement l'implémentation
  → à condition que les clients ignorent les
    champs qu'ils ne connaissent pas, ce qui doit
    être écrit dans la documentation`,
    },
    {
      kind: "text",
      text: "La condition finale est essentielle et rarement formulée : l'ajout n'est compatible que si les consommateurs ignorent les champs inconnus. C'est une exigence à documenter explicitement, faute de quoi un client strict cassera sur un ajout — et l'on se retrouvera à publier une version majeure pour un champ supplémentaire.",
    },
    {
      kind: "comparison",
      title: "Deux façons de produire une version",
      left: {
        label: "Manuelle",
        text: "Quelqu'un décide du numéro, étiquette, rédige les notes. Souple, mais irrégulier : le numéro est parfois choisi au sentiment, les notes sont écrites de mémoire, et l'on oublie une rupture de temps en temps.",
      },
      right: {
        label: "Déduite des messages",
        text: "Le numéro et les notes sont calculés à partir des types de commits depuis la dernière version. Régulier, traçable, sans oubli — à condition que les messages soient fiables, ce qui suppose la convention vue précédemment.",
      },
    },
    {
      kind: "text",
      text: "L'automatisation ferme une boucle : les messages de commit, la convention, le numéro de version et les notes deviennent un même système. Chaque élément prend son sens par les autres, et c'est ce qui justifie la discipline demandée sur les messages — sans elle, ils restent une bonne pratique sans effet mesurable.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le zéro majeur est une zone de tolérance",
      text: "Tant que le numéro majeur vaut zéro, la convention autorise explicitement des ruptures sur les incréments mineurs : c'est la façon de signaler qu'une interface n'est pas encore stabilisée. Publier une version 1.0 est donc un engagement — celui de ne plus casser sans incrémenter le majeur — et il vaut mieux le prendre en connaissance de cause.",
    },
    {
      kind: "text",
      text: "Les notes de version méritent un mot, car elles sont l'autre moitié du message. Un numéro dit qu'il y a une rupture ; seules les notes disent **laquelle** et comment y répondre. Une entrée utile nomme ce qui change, pourquoi, et ce que le consommateur doit faire — sans quoi il devra lire le code ou ouvrir un ticket pour l'apprendre.",
    },
    {
      kind: "text",
      text: "C'est particulièrement vrai pour les ruptures, où l'on gagne à écrire explicitement l'avant et l'après. « Le champ `nomComplet` est remplacé par `prenom` et `nom` » est actionnable ; « refonte du modèle client » ne l'est pas, et produira autant de questions qu'il y a de consommateurs.",
    },
    {
      kind: "text",
      text: "Retenons que le numéro décrit un impact, pas un effort ; que le critère de rupture est le risque pour un consommateur qui ne change rien ; et que déduire version et notes des messages ferme la boucle ouverte par la convention de commits.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "order",
    id: "devops-wf-22",
    difficulty: 2,
    tags: ["git", "versionnement"],
    prompt: "Remets dans l'ordre la publication automatisée d'une version.",
    items: [
      "Analyser les messages de commit depuis la dernière version",
      "En déduire le type d'incrément : correctif, mineur ou majeur",
      "Calculer le nouveau numéro et générer les notes de version",
      "Étiqueter le dépôt et publier l'artefact",
    ],
    explanation:
      "Cette chaîne ferme la boucle ouverte par la convention de messages : sans types fiables en tête des commits, aucune de ces étapes n'est automatisable. C'est ce qui justifie la discipline demandée sur les messages — sans elle, ils restent une bonne pratique sans effet mesurable.",
  },
  {
    kind: "mcq",
    id: "devops-wf-23",
    difficulty: 2,
    tags: ["git", "versionnement"],
    prompt: "Une réécriture complète de l'implémentation, sans changement d'interface. Quel incrément ?",
    choices: [
      "Correctif ou mineur : le numéro décrit l'impact sur les consommateurs, pas l'effort fourni.",
      "Majeur : l'ampleur du changement justifie un nouveau numéro principal.",
      "Majeur, car le comportement interne a entièrement changé.",
      "Aucun : une réécriture sans changement d'interface ne se publie pas.",
    ],
    answer: 0,
    explanation:
      "Le numéro majeur n'est pas une récompense pour un gros travail, c'est un avertissement adressé à ceux qui dépendent de vous. Annoncer une rupture qui n'en est pas fait perdre du temps à tous ceux qui liront les notes pour rien. Le critère est unique : un consommateur qui met à jour sans rien changer chez lui risque-t-il de casser ?",
  },
  {
    kind: "fill",
    id: "devops-wf-24",
    difficulty: 2,
    tags: ["git", "versionnement"],
    prompt: "Complète le classement de ces deux changements.",
    code: {
      language: "text",
      code: `Ajouter un champ optionnel a une reponse JSON
  -> increment {{1}}
  (a condition que les clients ignorent les champs
   qu'ils ne connaissent pas)

Rendre obligatoire un parametre jusque-la optionnel
  -> increment {{2}}`,
    },
    blanks: ["mineur", "majeur"],
    distractors: ["correctif", "nul", "technique"],
    explanation:
      "L'ajout est compatible — à la condition, rarement formulée, que les consommateurs ignorent les champs inconnus ; c'est une exigence à documenter explicitement. Rendre obligatoire un paramètre optionnel casse tout appelant qui ne le fournissait pas : c'est une rupture, même si le changement paraît minime.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "devops-git-workflow",
  title: "Flux de travail : branches, fusion, qualité et versions",
  objective:
    "Organiser le travail d'une équipe autour du dépôt : comprendre pourquoi la durée d'une branche est le paramètre décisif, choisir une stratégie de branches selon sa fréquence de livraison, découpler déploiement et activation, choisir une façon de fusionner et s'y tenir, écrire des messages qui servent dans deux ans, poser des exigences de qualité respectables, et versionner en fonction de l'impact sur les consommateurs.",
  prerequisites: ["devops-git-gitlab-ci"],
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
