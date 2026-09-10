/**
 * Transverse — Entretien : se présenter, défendre ses choix, être évalué
 * (référentiel 9.3 et 9.4).
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Raconter son parcours en trois minutes
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l1",
  title: "Raconter son parcours en trois minutes",
  blocks: [
    {
      kind: "text",
      text: "« Parlez-moi de vous. » La question ouvre presque tous les entretiens, et c'est celle qu'on prépare le moins parce qu'elle a l'air facile. Elle ne l'est pas : sans préparation, on récite son CV dans l'ordre chronologique, du BTS jusqu'à aujourd'hui, en donnant le même poids à un stage de six semaines qu'à trois ans de production. L'interlocuteur décroche au bout d'une minute, et c'est celle où il se faisait son premier avis.",
    },
    {
      kind: "text",
      text: "Le malentendu est sur la nature de la question. On croit qu'on demande un résumé exhaustif ; on demande en réalité une **mise en perspective**. Pourquoi ce parcours mène-t-il logiquement à ce poste ? Le CV a déjà été lu, les dates y figurent. Ce qu'on attend, c'est le fil que seul le candidat peut donner, celui qui relie les étapes et explique pourquoi la suivante est celle-ci.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La version chronologique : exacte, et sans intérêt.",
      code: `« J'ai fait un DUT informatique, puis une licence pro.
  Ensuite j'ai fait un stage de six mois chez X où j'ai
  touché à du PHP. Après j'ai été embauché chez Y, j'y
  suis resté deux ans, on faisait du Java 8 avec un peu
  de Spring, et aussi du support. Ensuite chez Z j'ai
  fait du Spring Boot, on avait des microservices… »

→ Tout est vrai, rien n'est hiérarchisé.
→ Aucune réponse à « pourquoi vous, pour ce poste ? »`,
    },
    {
      kind: "text",
      text: "Une structure qui fonctionne tient en trois temps et se prépare en une page. D'où je viens : une phrase, la formation et le point de départ. Ce que j'ai construit : deux ou trois réalisations concrètes, avec leur contexte et leur effet, en insistant sur celles qui ressemblent au poste visé. Où je vais : pourquoi ce poste précis, ce qui suppose d'avoir lu l'offre et de nommer un élément qui n'est pas générique.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La même carrière, orientée vers le poste.",
      code: `« Je suis développeur Java depuis cinq ans, arrivé par
  un DUT puis une licence pro en alternance.

  L'essentiel de mon expérience est sur des API Spring
  Boot en production : chez Y j'ai repris une application
  de facturation qui tombait chaque fin de mois, on a
  isolé un problème de transactions et divisé les
  incidents par cinq. Chez Z, j'ai monté la partie React
  d'un back-office avec l'API Java derrière, ce qui m'a
  donné les deux bouts de la chaîne.

  Votre poste est justement sur ce couple Java/React avec
  une exigence de tests, et c'est là que je veux
  continuer — j'ai pris goût au TDD sur le dernier projet
  et je cherche une équipe qui le pratique vraiment. »`,
    },
    {
      kind: "text",
      text: "La différence n'est pas le vocabulaire, c'est la sélection. La seconde version tait le PHP et le support, non par dissimulation mais parce qu'ils ne servent pas le propos. Elle donne un chiffre — « les incidents divisés par cinq » — qui invite à la question suivante. Et elle se termine sur une intention, ce qui redonne la main à l'interlocuteur au lieu de le laisser chercher un rebond.",
    },
    {
      kind: "comparison",
      title: "Deux réflexes à l'ouverture",
      left: {
        label: "Dérouler le CV",
        text: "Chronologique, exhaustif, tout au même niveau. Le risque n'est pas de mentir mais de noyer : l'interlocuteur ne retient rien et doit fouiller lui-même pour trouver ce qui l'intéresse. C'est du travail qu'on lui laisse.",
      },
      right: {
        label: "Donner le fil",
        text: "Sélectif, orienté vers le poste, deux ou trois réalisations creusables. On assume de laisser des choses de côté — elles reviendront si on les creuse. L'objectif est qu'à la fin, l'interlocuteur sache quoi demander ensuite.",
      },
    },
    {
      kind: "text",
      text: "La durée compte autant que le contenu. Au-delà de trois minutes sans interruption, on monologue ; en dessous d'une, on paraît ne rien avoir à dire. Trois minutes, c'est court : environ trois cents mots, soit une page écrite en gros. La seule façon d'y arriver est de l'avoir dit à voix haute plusieurs fois — écrit puis relu ne suffit pas, le rythme de l'oral n'est pas celui de la lecture.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Préparer les rebonds, pas seulement le texte",
      text: "Chaque réalisation citée est une porte ouverte : citer un problème de transactions, c'est s'engager à savoir en parler pendant dix minutes. C'est même l'intérêt du procédé — on choisit le terrain sur lequel la suite de l'entretien se jouera. À l'inverse, mentionner une technologie qu'on a effleurée pour étoffer la liste revient à tendre soi-même le bâton pour se faire battre.",
    },
    {
      kind: "text",
      text: "Dernier point, souvent négligé : cette réponse se réécrit pour chaque offre. Ce n'est pas un texte qu'on apprend une fois pour toutes, c'est une sélection qu'on refait en fonction de ce qui est demandé. Le même candidat, face à un poste plutôt back et à un poste plutôt full-stack, ne met pas les mêmes réalisations en avant — et cela s'entend immédiatement quand il ne l'a pas fait.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-ent-01",
    difficulty: 1,
    tags: ["entretien", "presentation"],
    prompt: "Que cherche réellement un recruteur en demandant « parlez-moi de vous » ?",
    choices: [
      "Le fil qui relie le parcours au poste visé : ce que le CV, déjà lu, ne dit pas.",
      "Un résumé chronologique complet, pour vérifier la cohérence des dates du CV.",
      "Des éléments personnels, pour évaluer la compatibilité avec l'équipe.",
      "La liste exhaustive des technologies maîtrisées, dans l'ordre de maîtrise.",
    ],
    answer: 0,
    explanation:
      "Le CV a été lu avant l'entretien : les dates et la liste des technologies y sont déjà. Ce qu'on ne peut pas y lire, c'est la hiérarchie — ce qui compte, ce qui était difficile, pourquoi la suite logique est ce poste-ci. Répondre par une chronologie exhaustive, c'est répéter un document que l'interlocuteur a sous les yeux.",
  },
  {
    kind: "order",
    id: "transverse-ent-02",
    difficulty: 1,
    tags: ["entretien", "presentation"],
    prompt: "Remets dans l'ordre une présentation de trois minutes qui fonctionne.",
    items: [
      "D'où je viens : la formation et le point de départ, en une phrase",
      "Ce que j'ai construit : deux ou trois réalisations concrètes avec leur effet",
      "Ce que j'en retire : la compétence que ces réalisations ont installée",
      "Où je vais : pourquoi ce poste précis, avec un élément tiré de l'offre",
    ],
    explanation:
      "Le passé sert d'appui, pas de sujet. On y consacre une phrase, puis on passe l'essentiel du temps sur les réalisations, et l'on termine par une intention tournée vers le poste — ce qui rend la main à l'interlocuteur au lieu de le laisser chercher un rebond.",
  },
  {
    kind: "recall",
    id: "transverse-ent-03",
    difficulty: 2,
    tags: ["entretien", "presentation"],
    prompt: "Pourquoi est-il risqué de citer une technologie qu'on a seulement effleurée pour étoffer sa présentation ?",
    explanation:
      "Parce que tout ce qu'on cite est une invitation à creuser. Une présentation choisit le terrain sur lequel la suite de l'entretien va se jouer : citer un problème de transactions résolu, c'est s'engager à en parler dix minutes, et c'est précisément l'intérêt de la manœuvre. Une technologie mentionnée pour faire nombre produit l'effet inverse — la question tombera, la réponse sera creuse, et le doute rejaillira sur le reste de la présentation, y compris sur ce qui était solide. Mieux vaut une liste courte entièrement défendable qu'une liste longue dont un tiers ne tient pas.",
    keyPoints: [
      "Tout ce qui est cité peut être creusé",
      "Citer, c'est choisir le terrain de la suite de l'entretien",
      "Une réponse creuse jette le doute sur le reste, y compris le solide",
      "Liste courte et défendable plutôt que longue et fragile",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Présenter un projet : contexte, contrainte, décision, résultat
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l2",
  title: "Présenter un projet : contexte, contrainte, décision, résultat",
  blocks: [
    {
      kind: "text",
      text: "« Parlez-moi d'un projet dont vous êtes fier. » Là encore, le piège est de répondre à côté. La réponse spontanée décrit le produit : ce qu'il faisait, pour qui, avec quelle pile technique. C'est une présentation commerciale. Or l'entretien n'évalue pas le produit — l'interlocuteur ne l'achètera pas — mais la façon dont le candidat a pensé pendant qu'il le construisait.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La présentation produit : correcte, mais elle n'apprend rien sur vous.",
      code: `« C'était une application de gestion de stock pour un
  client de la grande distribution. Il y avait un back
  Spring Boot, une base Postgres, un front React, et on
  déployait avec GitLab CI sur des conteneurs Docker.
  L'équipe faisait six personnes. Ça a duré un an et
  demi et ça tourne toujours. »

→ Décrit une architecture, pas un raisonnement.
→ Question suivante inévitable : « et vous, vous avez
  fait quoi exactement ? »`,
    },
    {
      kind: "text",
      text: "La structure qui rend un projet intéressant tient en quatre temps. Le **contexte** situe l'enjeu en deux phrases. La **contrainte** dit ce qui rendait le problème difficile — sans elle, tout paraît trivial. La **décision** expose ce qui a été choisi, contre quelles alternatives et sur quel critère. Le **résultat** referme, avec un chiffre ou un fait vérifiable, et si possible ce qu'on referait autrement.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le même projet, raconté par le problème.",
      code: `Contexte  — Gestion de stock temps réel, six magasins,
            les inventaires devaient être justes à la
            minute pour éviter la vente d'un article
            déjà parti.

Contrainte— Le système d'encaissement existant envoyait
            les mouvements par lots, avec jusqu'à
            quinze minutes de retard, et on ne pouvait
            pas le modifier : éditeur tiers.

Décision  — Plutôt que de croire le stock, on a affiché
            une fourchette « certain / probable » et
            réservé l'article dès l'ajout au panier.
            L'alternative — attendre la synchro — aurait
            dégradé l'expérience sans supprimer le
            problème.

Résultat  — Ventes d'articles indisponibles : de 40 à 3
            par semaine. Avec le recul, la fourchette
            aurait dû être exposée dans l'API dès le
            départ plutôt qu'ajoutée après coup.`,
    },
    {
      kind: "text",
      text: "Ce format a une vertu qu'on sous-estime : il rend le candidat difficile à évaluer par la seule pile technique. Le premier récit permet uniquement de vérifier des cases — Spring, React, Docker. Le second montre qu'on a identifié une contrainte externe non négociable, arbitré entre deux options, et mesuré. Ces qualités-là se transfèrent à n'importe quelle pile, et c'est précisément ce qu'un recruteur cherche à savoir.",
    },
    {
      kind: "comparison",
      title: "Deux façons de dire « je »",
      left: {
        label: "Le « nous » permanent",
        text: "« On a mis en place, on a choisi, on a migré. » Honnête et collectif, mais il devient impossible de savoir ce que le candidat a fait. À la fin, l'interlocuteur doit poser la question frontalement, ce qui est toujours un peu gênant.",
      },
      right: {
        label: "Le « je » situé",
        text: "« L'équipe a choisi X ; moi j'ai porté la partie Y et j'ai défendu Z contre l'avis initial. » On garde le crédit collectif tout en rendant sa propre contribution vérifiable. C'est aussi ce qui permet d'assumer une erreur personnelle sans accabler l'équipe.",
      },
    },
    {
      kind: "text",
      text: "Le chiffre final n'a pas besoin d'être spectaculaire, il a besoin d'être vrai. « De 40 à 3 par semaine » vaut mieux que « nettement amélioré », et bien mieux qu'un pourcentage inventé sur le moment. Si aucune mesure n'existait, il vaut mieux le dire — « on n'avait pas d'indicateur, c'est justement une chose que je ferais différemment » — que de fabriquer un ordre de grandeur qu'une question de suivi démontera. Un résultat qualitatif tient d'ailleurs très bien : « l'astreinte du week-end a cessé d'être appelée » vaut tous les pourcentages.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le projet trop beau",
      text: "Un récit sans difficulté, sans arbitrage et sans regret sonne faux, parce qu'il l'est presque toujours. Terminer par ce qu'on referait autrement n'est pas un aveu de faiblesse : c'est la preuve qu'on a continué à réfléchir après la livraison. Les candidats qui n'ont rien à changer à leur projet inquiètent davantage que ceux qui nomment précisément leur erreur.",
    },
    {
      kind: "text",
      text: "En pratique, on prépare deux ou trois projets à ce format, écrits, et on les révise avant chaque entretien. L'un devrait être un succès net, un autre un projet difficile ou à moitié raté — cette seconde catégorie sert pour les questions sur l'échec, qui viennent presque toujours, et il est bien plus confortable d'avoir choisi son exemple à l'avance que de le chercher en direct.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-ent-04",
    difficulty: 2,
    tags: ["entretien", "projet"],
    prompt: "Dans un récit de projet, à quoi sert d'énoncer explicitement la contrainte ?",
    choices: [
      "Sans elle, le problème paraît trivial et la décision prise perd tout intérêt.",
      "À justifier par avance les retards de livraison du projet.",
      "À montrer que l'environnement de travail était difficile.",
      "À prouver que la solution retenue était la seule possible.",
    ],
    answer: 0,
    explanation:
      "La contrainte est ce qui transforme une implémentation en arbitrage. « Afficher un stock » n'intéresse personne ; « afficher un stock quand la source a quinze minutes de retard et qu'on ne peut pas la modifier » ouvre la discussion sur les options et le critère de choix. C'est là que le raisonnement du candidat devient visible.",
  },
  {
    kind: "match",
    id: "transverse-ent-05",
    difficulty: 1,
    tags: ["entretien", "projet"],
    prompt: "Associe chaque temps du récit à ce qu'il doit contenir.",
    pairs: [
      { left: "Contexte", right: "L'enjeu et le cadre, en deux phrases" },
      { left: "Contrainte", right: "Ce qui rendait le problème difficile ou non négociable" },
      { left: "Décision", right: "L'option retenue, les alternatives et le critère de choix" },
      { left: "Résultat", right: "Un fait vérifiable, et ce qu'on referait autrement" },
    ],
    explanation:
      "Ces quatre temps répondent à la vraie question de l'entretien — comment pensez-vous ? — là où une description de la pile technique ne permet que de cocher des cases. Ils ont aussi l'avantage de tenir en trois minutes et de laisser des prises pour les questions suivantes.",
  },
  {
    kind: "recall",
    id: "transverse-ent-06",
    difficulty: 2,
    tags: ["entretien", "projet"],
    prompt: "Pourquoi terminer la présentation d'un projet par ce qu'on referait autrement ?",
    explanation:
      "Parce qu'un projet sans difficulté ni regret sonne faux, et l'est presque toujours. Nommer précisément ce qu'on changerait prouve qu'on a continué à réfléchir après la livraison, qu'on sait évaluer son propre travail et qu'on distingue ce qui a marché par conception de ce qui a marché par chance. Les candidats qui n'ont rien à redire à leur projet inquiètent davantage : soit ils n'ont pas pris de recul, soit ils ne veulent pas montrer de prise. C'est aussi une façon de choisir soi-même le terrain de la question sur l'échec, qui arrivera de toute façon.",
    keyPoints: [
      "Un récit sans difficulté ni regret sonne faux",
      "Montre qu'on a pris du recul après la livraison",
      "Distingue ce qui a réussi par conception de ce qui a réussi par chance",
      "Permet de choisir soi-même le terrain de la question sur l'échec",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — L'ADR : garder la trace d'une décision
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l3",
  title: "L'ADR : garder la trace d'une décision",
  blocks: [
    {
      kind: "text",
      text: "Dix-huit mois après une décision d'architecture, plus personne ne sait pourquoi elle a été prise. Les gens qui étaient dans la salle sont partis, le compte rendu s'est perdu dans un fil de discussion, et le code ne dit que le **quoi**, jamais le **pourquoi**. Arrive alors le pire scénario : quelqu'un juge le choix absurde, le défait, et redécouvre en production la raison qui l'avait motivé.",
    },
    {
      kind: "text",
      text: "L'*Architecture Decision Record* répond exactement à ce problème. C'est un fichier court, en Markdown, versionné **avec le code** — c'est le point décisif : il suit les branches, se relit dans une revue, et ne se perd pas avec l'outil de gestion de projet du moment. Un ADR par décision structurante, numéroté, jamais modifié une fois accepté.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le squelette, dans doc/adr/0007-....md",
      code: `# 7. Fourchette de stock plutôt que synchronisation

Statut   : accepté
Date     : 2026-03-12
Décideurs: équipe stock, architecte plateforme

## Contexte
Le système d'encaissement tiers publie les mouvements
par lots, avec jusqu'à 15 min de latence. Nous ne
pouvons pas le modifier. Les ventes d'articles déjà
partis représentent ~40 incidents par semaine.

## Décision
Exposer un stock sous forme de fourchette (certain /
probable) et réserver l'article dès l'ajout au panier.

## Conséquences
+ Les ventes fantômes deviennent marginales.
+ Aucune dépendance à un changement chez le tiers.
− L'API expose une notion plus complexe qu'un entier.
− Les réservations doivent expirer : nouveau travail
  de purge à prévoir.`,
    },
    {
      kind: "text",
      text: "Quatre sections suffisent, et leur ordre n'est pas indifférent. Le **contexte** est écrit au présent, comme si la décision n'était pas encore prise : c'est ce qui permettra plus tard de savoir si le contexte a changé. La **décision** est une phrase à l'actif. Les **conséquences** listent le bon comme le mauvais, car un ADR qui n'énumère que des avantages n'est pas une décision, c'est une publicité.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le cycle de vie : on ne réécrit pas, on remplace.",
      code: `0007-fourchette-de-stock.md      Statut : remplacé par 0021
0021-synchronisation-directe.md  Statut : accepté

# 21. Synchronisation directe du stock
Remplace : 0007

## Contexte
L'éditeur tiers expose depuis février une API temps
réel. La contrainte qui motivait 0007 a disparu.`,
    },
    {
      kind: "text",
      text: "Un ADR accepté est **immuable**. On ne le corrige pas, on en écrit un nouveau qui le remplace en expliquant ce qui a changé. Cette règle paraît formelle mais elle porte toute la valeur du procédé : ce qu'on conserve n'est pas l'état actuel de l'architecture — le code le décrit déjà — mais son **historique de raisonnement**. Modifier un ancien ADR reviendrait à effacer précisément ce qu'on cherchait à garder.",
    },
    {
      kind: "comparison",
      title: "Deux traces qu'on confond",
      left: {
        label: "Documentation d'architecture",
        text: "Décrit l'état actuel : les composants, leurs échanges, les schémas. Elle est mise à jour en continu et doit rester vraie aujourd'hui. Elle répond à « comment ça marche ? ».",
      },
      right: {
        label: "ADR",
        text: "Décrit une décision datée et son contexte d'alors. Il n'est jamais mis à jour et peut décrire un état révolu. Il répond à « pourquoi est-ce ainsi, et qu'a-t-on écarté ? ».",
      },
    },
    {
      kind: "text",
      text: "En entretien, l'ADR est un excellent appui pour justifier un choix, parce qu'il force le format que l'on attend de vous : contexte, options, critère, conséquences assumées. Même si l'équipe n'en écrivait pas, raconter une décision selon cette trame donne exactement l'impression recherchée — quelqu'un qui décide sur des critères explicites plutôt que par habitude ou par goût.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Quelles décisions méritent un ADR ?",
      text: "Celles qui sont coûteuses à défaire et dont l'alternative était défendable. Choisir Postgres plutôt que MySQL, adopter une architecture hexagonale, renoncer aux microservices : oui. Choisir le nom d'un paquet ou la version d'une bibliothèque de test : non. Une bonne règle empirique — si dans un an quelqu'un peut légitimement demander « mais pourquoi diable ont-ils fait ça ? », la décision méritait un ADR.",
    },
    {
      kind: "text",
      text: "Le coût est faible et c'est ce qui rend l'habitude tenable : une page, quinze minutes, dans la même *merge request* que le premier code concerné. Les équipes qui abandonnent les ADR sont presque toujours celles qui ont voulu en faire des documents longs et validés en comité. Court, versionné, imparfait et écrit vaut infiniment mieux que complet et jamais rédigé.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "fill",
    id: "transverse-ent-07",
    difficulty: 1,
    tags: ["entretien", "adr"],
    prompt: "Complète les deux sections manquantes de ce squelette d'ADR.",
    code: {
      language: "text",
      code: `# 7. Fourchette de stock plutôt que synchronisation

Statut : accepté

## {{1}}
Le système tiers publie par lots, 15 min de latence,
non modifiable. ~40 ventes fantômes par semaine.

## Décision
Exposer une fourchette certain / probable.

## {{2}}
+ Les ventes fantômes deviennent marginales.
− L'API expose une notion plus complexe.`,
    },
    blanks: ["Contexte", "Conséquences"],
    distractors: ["Résumé", "Alternatives", "Statut"],
    explanation:
      "Contexte, Décision, Conséquences forment le noyau minimal d'un ADR. Le contexte s'écrit au présent, comme si la décision n'était pas encore prise, pour qu'on puisse plus tard vérifier s'il a changé. Les conséquences listent le mauvais autant que le bon : un ADR qui n'énumère que des avantages n'est pas une décision, c'est une publicité.",
  },
  {
    kind: "mcq",
    id: "transverse-ent-08",
    difficulty: 2,
    tags: ["entretien", "adr"],
    prompt: "La décision prise dans l'ADR 0007 n'est plus valable : le contexte a changé. Que fait-on ?",
    choices: [
      "On écrit un nouvel ADR qui remplace le 0007, et on passe le statut du 0007 à « remplacé ».",
      "On met à jour le 0007 avec le nouveau contexte et la nouvelle décision.",
      "On supprime le 0007, devenu faux et donc trompeur.",
      "On ajoute un commentaire en fin de 0007 sans toucher au reste.",
    ],
    answer: 0,
    explanation:
      "Un ADR accepté est immuable. Ce qu'on conserve n'est pas l'état actuel de l'architecture — le code le décrit déjà — mais l'historique du raisonnement. Modifier ou supprimer un ancien ADR efface exactement ce qu'on voulait garder : la raison pour laquelle, à une date donnée et dans un contexte donné, ce choix était le bon.",
  },
  {
    kind: "recall",
    id: "transverse-ent-09",
    difficulty: 2,
    tags: ["entretien", "adr"],
    prompt: "Quelle est la différence entre une documentation d'architecture et un ADR ?",
    explanation:
      "La documentation décrit l'état actuel — les composants, leurs échanges — et doit rester vraie aujourd'hui : elle est mise à jour en continu et répond à « comment ça marche ? ». Un ADR décrit une décision datée avec le contexte qui prévalait alors : il n'est jamais mis à jour, peut décrire un état révolu, et répond à « pourquoi est-ce ainsi, et qu'avait-on écarté ? ». Le code et la documentation portent le quoi ; seul l'ADR porte le pourquoi, qui est précisément ce qui se perd quand les gens partent — et ce qui manque à celui qui, dix-huit mois plus tard, s'apprête à défaire un choix sans en connaître la raison.",
    keyPoints: [
      "Documentation : l'état actuel, mise à jour, « comment ça marche ? »",
      "ADR : une décision datée, immuable, « pourquoi est-ce ainsi ? »",
      "Le code dit le quoi, l'ADR dit le pourquoi",
      "C'est le pourquoi qui se perd quand les gens partent",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — La revue de code : ce qu'on y cherche
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l4",
  title: "La revue de code : ce qu'on y cherche",
  blocks: [
    {
      kind: "text",
      text: "Une revue de code sans intention se transforme vite en chasse au style : on signale une accolade, un nom de variable, une ligne trop longue, et on approuve un code qui contient une faille de sécurité. Ce n'est pas de la mauvaise volonté, c'est un problème d'attention — les détails de forme sautent aux yeux, les problèmes de fond demandent qu'on cherche activement.",
    },
    {
      kind: "text",
      text: "La première mesure d'hygiène consiste donc à retirer la forme du champ de la revue. Un formateur automatique et un analyseur statique branchés dans l'intégration continue règlent l'indentation, les imports inutilisés et les conventions de nommage sans qu'aucun humain n'en parle. Tout ce qu'une machine peut signaler ne devrait jamais consommer l'attention d'un relecteur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce qu'un relecteur doit voir, et qu'aucun outil ne signalera.",
      code: `@Transactional
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    Account from = repo.findById(fromId).orElseThrow();
    Account to = repo.findById(toId).orElseThrow();

    from.debit(amount);
    repo.save(from);

    notifier.send(to.owner(), "Virement reçu");   // (1)

    to.credit(amount);
    repo.save(to);
}`,
    },
    {
      kind: "text",
      text: "Le code ci-dessus est correctement formaté, il compile, et un analyseur statique n'y verra rien. Il contient pourtant deux problèmes de fond. En (1), une notification part avant que le crédit soit effectué et surtout avant que la transaction soit validée : si la suite échoue et que tout est annulé, le destinataire a reçu l'annonce d'un virement qui n'a jamais eu lieu. Et rien ne vérifie que le compte débité a la provision suffisante.",
    },
    {
      kind: "text",
      text: "Ces deux défauts ont la même signature : ils sont invisibles à la lecture ligne à ligne et n'apparaissent qu'en se demandant *ce qui se passe si*. C'est le vrai travail du relecteur — simuler l'échec, l'entrée nulle, l'appel concurrent, le rollback. Un relecteur qui ne se pose jamais cette question fait un travail de correcteur orthographique.",
    },
    {
      kind: "code",
      language: "text",
      caption: "L'ordre de lecture qui évite la chasse au style.",
      code: `1. Le titre et la description disent-ils l'intention ?
   Sans intention, on ne peut pas juger la solution.

2. Les tests : couvrent-ils le cas nominal ET les cas
   limites ? Un test absent est le défaut le plus cher.

3. Le fond : effets de bord, transactions, sécurité,
   concurrence, données nulles, erreurs non traitées.

4. La conception : le code est-il au bon endroit,
   la duplication est-elle réelle ou apparente ?

5. La lisibilité : nommage, découpage, commentaires
   qui expliquent le pourquoi.

→ Le style n'apparaît pas : c'est le travail de l'outil.`,
    },
    {
      kind: "comparison",
      title: "Deux remarques qui n'ont pas le même poids",
      left: {
        label: "Bloquant",
        text: "Un défaut qui casserait quelque chose en production ou rendrait le code faux : effet de bord hors transaction, absence de validation, faille, test manquant sur un cas limite. On demande une correction avant fusion, et on explique la conséquence concrète.",
      },
      right: {
        label: "Préférence",
        text: "Un choix qu'on aurait fait autrement sans que l'un soit faux : un découpage, un nom, l'ordre de deux méthodes. On le signale comme tel — « détail, à prendre ou à laisser » — et on n'en fait jamais une condition de fusion.",
      },
    },
    {
      kind: "text",
      text: "Ne pas distinguer les deux est la cause la plus fréquente de revues qui s'enveniment. Quand tout est formulé sur le même ton, l'auteur ne sait plus ce qui est grave, se défend sur tout, et les allers-retours s'allongent. Marquer explicitement le niveau de chaque remarque — beaucoup d'équipes utilisent des préfixes comme `bloquant :` ou `détail :` — supprime l'essentiel de ce frottement pour un coût nul.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "La taille est le premier facteur de qualité",
      text: "Au-delà de quatre cents lignes modifiées, la capacité de détection d'un relecteur s'effondre : on approuve pour ne pas bloquer l'équipe. Une revue de mille lignes qui ne remonte que trois remarques de style n'est pas le signe d'un bon code, mais d'une revue qui n'a pas eu lieu. Demander le découpage d'une trop grosse demande de fusion est en soi une remarque de revue légitime.",
    },
    {
      kind: "text",
      text: "En entretien, la question « qu'est-ce que tu regardes dans une revue ? » sépare très nettement les candidats. Répondre « le respect des conventions et la lisibilité » situe au niveau du correcteur orthographique. Répondre en partant de l'intention, puis des tests, puis des cas d'échec, en distinguant bloquant et préférence, montre qu'on a tenu le rôle pour de bon.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "transverse-ent-10",
    difficulty: 3,
    tags: ["entretien", "revue-de-code"],
    prompt: "Revue de code : ce virement compile et est bien formaté. Quelle ligne poses-tu comme bloquante ?",
    code: {
      language: "java",
      code: `@Transactional
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    Account from = repo.findById(fromId).orElseThrow();
    Account to = repo.findById(toId).orElseThrow();
    from.debit(amount);
    repo.save(from);
    notifier.send(to.owner(), "Virement reçu");
    to.credit(amount);
    repo.save(to);
}`,
    },
    faultyLine: 7,
    reasons: [
      "La notification part avant la fin de la transaction : si celle-ci est annulée, on a annoncé un virement qui n'a pas eu lieu.",
      "`orElseThrow()` sans argument produit un message d'erreur peu explicite.",
      "Les deux `repo.save()` sont inutiles avec une entité gérée par le contexte de persistance.",
      "`BigDecimal` devrait être remplacé par `double` pour des raisons de performance.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un envoi de notification est un effet de bord **externe**, que la base ne peut pas annuler. Placé au milieu d'une transaction, il part même si la suite échoue et déclenche un rollback : le destinataire reçoit l'annonce d'un virement inexistant. La correction consiste à publier un événement et à ne l'envoyer qu'après validation, par exemple avec `@TransactionalEventListener(phase = AFTER_COMMIT)`. Les `save()` redondants sont une vraie remarque, mais de niveau détail ; `double` pour de la monnaie serait une régression.",
  },
  {
    kind: "mcq",
    id: "transverse-ent-11",
    difficulty: 2,
    tags: ["entretien", "revue-de-code"],
    prompt: "Pourquoi une revue de mille lignes qui ne remonte que trois remarques de style est-elle inquiétante ?",
    choices: [
      "Au-delà de quelques centaines de lignes, la détection s'effondre : la revue a été approuvée sans être réellement faite.",
      "Parce qu'un relecteur doit toujours remonter au moins une remarque bloquante.",
      "Parce que les remarques de style devraient être traitées avant la revue par un outil, donc il n'aurait rien dû rester.",
      "Parce qu'une demande de fusion de mille lignes est interdite par la plupart des outils.",
    ],
    answer: 0,
    explanation:
      "La capacité de détection chute nettement au-delà de quelques centaines de lignes modifiées : le relecteur fatigue, ne suit plus les chemins d'exécution et finit par approuver pour ne pas bloquer l'équipe. Peu de remarques sur beaucoup de code ne prouve pas la qualité du code, mais l'absence de revue réelle. Demander un découpage est alors la remarque la plus utile qu'on puisse faire.",
  },
  {
    kind: "recall",
    id: "transverse-ent-12",
    difficulty: 2,
    tags: ["entretien", "revue-de-code"],
    prompt: "Dans quel ordre lire une demande de fusion, et pourquoi le style n'y figure-t-il pas ?",
    explanation:
      "On lit d'abord le titre et la description, pour connaître l'intention — sans elle, on ne peut pas juger si la solution est adaptée. Puis les tests : couvrent-ils le cas nominal et les cas limites, un test manquant étant le défaut le plus coûteux. Puis le fond : effets de bord, transactions, sécurité, concurrence, valeurs nulles, erreurs non traitées — tout ce qui n'apparaît qu'en se demandant « que se passe-t-il si ». Puis la conception, puis la lisibilité. Le style n'y figure pas parce qu'un formateur et un analyseur statique dans l'intégration continue le règlent sans consommer l'attention d'un humain — attention qui est la ressource rare de la revue.",
    keyPoints: [
      "1. L'intention : titre et description",
      "2. Les tests, cas limites compris",
      "3. Le fond : effets de bord, transactions, sécurité, concurrence",
      "4. La conception, puis 5. la lisibilité",
      "Le style est traité par les outils : l'attention humaine est la ressource rare",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Formuler une remarque sans braquer
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l5",
  title: "Formuler une remarque sans braquer",
  blocks: [
    {
      kind: "text",
      text: "Une revue de code met en présence deux choses délicates : un travail qu'on vient de finir et quelqu'un qui explique ce qui ne va pas. Le contenu peut être parfaitement juste et la revue produire quand même de la crispation, des allers-retours interminables et, à terme, des équipes où l'on évite de se relire. La formulation n'est donc pas un supplément de politesse : c'est ce qui détermine si la remarque sera appliquée.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La même remarque, quatre formulations.",
      code: `✗ « C'est faux. »
   Verdict sans objet ni raison. Rien à faire de cette
   phrase, sinon se défendre.

✗ « Tu n'as pas pensé à la transaction ? »
   Porte sur la personne, et la question est rhétorique.

~ « Il faudrait déplacer la notification après le commit. »
   Juste, mais c'est un ordre sans motif : si l'auteur
   avait une raison, la discussion est déjà bloquée.

✓ « Bloquant : si la transaction est annulée après cette
   ligne, la notification est déjà partie et le
   destinataire reçoit un virement qui n'a pas eu lieu.
   Un @TransactionalEventListener(AFTER_COMMIT) réglerait
   le cas — sauf si tu vois une raison de la garder ici ? »`,
    },
    {
      kind: "text",
      text: "La bonne formulation contient quatre éléments et ils sont tous nécessaires. Le **niveau** — bloquant ou détail — dit à l'auteur combien d'énergie y consacrer. La **conséquence concrète** remplace le jugement par un fait vérifiable. La **piste** évite de renvoyer le problème sans aide. Et l'**ouverture** finale reconnaît que l'auteur connaît peut-être une contrainte que le relecteur ignore.",
    },
    {
      kind: "text",
      text: "Le déplacement le plus efficace consiste à parler du **code** et non de la personne. « Cette méthode fait deux choses » et « tu mélanges deux responsabilités » décrivent le même défaut, mais la seconde formulation appelle une défense personnelle. Ce n'est pas de la susceptibilité mal placée : dans un fil écrit, sans ton de voix ni visage, une phrase neutre se lit facilement comme une attaque, et l'auteur passe le reste de la revue sur ses gardes.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le cas où la question vaut mieux que l'affirmation.",
      code: `// Dans la demande de fusion
public List<Order> findRecent(Long customerId) {
    return repo.findAll().stream()
        .filter(o -> o.customerId().equals(customerId))
        .sorted(comparing(Order::createdAt).reversed())
        .limit(20)
        .toList();
}

// Remarque possible :
// « Bloquant : findAll() charge toute la table avant de
//   filtrer en mémoire — sur la volumétrie de prod ça
//   deviendra un problème. Une query method du type
//   findTop20ByCustomerIdOrderByCreatedAtDesc ferait le
//   tri côté base. Est-ce qu'il y a une raison de passer
//   par un stream ici ? »`,
    },
    {
      kind: "text",
      text: "La question finale n'est pas une formule de politesse hypocrite : dans une bonne partie des cas, l'auteur a effectivement une raison — une contrainte de compatibilité, un cas particulier, une décision prise ailleurs dans l'équipe. La question laisse la place à cette réponse. L'affirmation catégorique, elle, oblige l'auteur à contredire le relecteur pour la donner, ce qui coûte beaucoup plus et n'arrive donc pas toujours.",
    },
    {
      kind: "comparison",
      title: "Deux réflexes côté auteur",
      left: {
        label: "Se défendre",
        text: "« C'est fait exprès », « ça marche très bien ». Même quand c'est vrai, la réponse ferme la discussion et pousse le relecteur à insister ou à abandonner. Elle transforme une remarque technique en question d'ego, et personne n'en sort gagnant.",
      },
      right: {
        label: "Expliquer ou corriger",
        text: "« Bonne remarque, je corrige » ou « j'ai fait comme ça parce que X, est-ce que ça tient ? ». Les deux font avancer : soit le code s'améliore, soit le relecteur apprend une contrainte qu'il ignorait. Le désaccord persistant se tranche à trois, pas dans le fil.",
      },
    },
    {
      kind: "text",
      text: "Quand un désaccord dure plus de deux allers-retours écrits, il faut sortir du fil de commentaires. Cinq minutes de discussion de vive voix règlent presque toujours ce que dix messages n'ont fait qu'aggraver, parce que l'écrit asynchrone amplifie les malentendus et donne à chaque partie le temps de préparer sa position plutôt que d'écouter l'autre. La conclusion, elle, est reportée dans le fil, pour ceux qui liront plus tard.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Dire aussi ce qui est bien",
      text: "Une revue qui ne contient que des critiques donne une image fausse du travail relu, et rend les remarques plus lourdes qu'elles ne devraient. Signaler un découpage réussi ou un test bien pensé ne coûte rien, indique à l'auteur ce qu'il faut reproduire — information qu'aucune critique ne donne — et rend les remarques bloquantes nettement plus faciles à recevoir.",
    },
    {
      kind: "text",
      text: "En entretien, cette question arrive souvent sous la forme « comment réagissez-vous à un désaccord technique ? ». La réponse attendue n'est ni « je cède » ni « j'ai raison » : c'est de montrer qu'on distingue les faits vérifiables des préférences, qu'on sait demander la raison avant de trancher, et qu'on accepte qu'une décision d'équipe s'impose même quand on n'en est pas convaincu.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-ent-13",
    difficulty: 2,
    tags: ["entretien", "revue-de-code"],
    prompt: "Quelle formulation de remarque a le plus de chances d'être appliquée ?",
    choices: [
      "« Bloquant : si la transaction est annulée après cette ligne, la notification est déjà partie. Un listener AFTER_COMMIT réglerait le cas — sauf si tu vois une raison de la garder ici ? »",
      "« Il faut déplacer la notification après le commit. »",
      "« Tu n'as pas pensé à ce qui se passe si la transaction échoue ? »",
      "« Ce n'est pas la bonne façon de faire, voir la doc Spring sur les transactions. »",
    ],
    answer: 0,
    explanation:
      "Elle contient les quatre éléments utiles : le niveau (bloquant), la conséquence concrète et vérifiable, une piste de correction, et une ouverture qui laisse l'auteur exposer une contrainte que le relecteur ignore peut-être. Les autres formulations donnent un ordre sans motif, portent sur la personne, ou renvoient le problème sans aide.",
  },
  {
    kind: "match",
    id: "transverse-ent-14",
    difficulty: 2,
    tags: ["entretien", "revue-de-code"],
    prompt: "Associe chaque élément d'une bonne remarque à son rôle.",
    pairs: [
      { left: "Le niveau", right: "Dire combien d'énergie l'auteur doit y consacrer" },
      { left: "La conséquence", right: "Remplacer le jugement par un fait vérifiable" },
      { left: "La piste", right: "Éviter de renvoyer le problème sans aide" },
      { left: "L'ouverture", right: "Laisser place à une contrainte que le relecteur ignore" },
    ],
    explanation:
      "Ces quatre éléments transforment un verdict en discussion technique. Sans le niveau, l'auteur ne sait pas ce qui est grave et se défend sur tout ; sans la conséquence, la remarque reste une opinion ; sans la piste, elle est un problème de plus ; sans l'ouverture, l'auteur doit contredire le relecteur pour expliquer sa raison, ce qui coûte assez cher pour qu'il s'en abstienne.",
  },
  {
    kind: "recall",
    id: "transverse-ent-15",
    difficulty: 2,
    tags: ["entretien", "revue-de-code"],
    prompt: "Que faire quand un désaccord en revue dure plus de deux allers-retours écrits ?",
    explanation:
      "Sortir du fil de commentaires et en parler de vive voix. L'écrit asynchrone amplifie les malentendus — pas de ton, pas de visage — et laisse à chacun le temps de préparer sa position plutôt que d'écouter celle de l'autre, si bien que les positions se durcissent à mesure que les messages s'accumulent. Cinq minutes de discussion règlent presque toujours ce que dix messages ont aggravé. La conclusion est ensuite reportée dans le fil, pour ceux qui reliront la demande de fusion plus tard. Si le désaccord persiste, il se tranche à trois ou au niveau de l'équipe, et l'on applique la décision même sans en être convaincu.",
    keyPoints: [
      "Sortir du fil au bout de deux allers-retours",
      "L'écrit asynchrone durcit les positions",
      "Reporter la conclusion dans le fil pour les lecteurs suivants",
      "Un désaccord persistant se tranche à trois, et la décision s'applique",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Agile : ce que l'entretien attend vraiment
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l6",
  title: "Agile : ce que l'entretien attend vraiment",
  blocks: [
    {
      kind: "text",
      text: "« Vous avez travaillé en agile ? » La réponse réflexe — « oui, on faisait des sprints de deux semaines avec un daily » — est la plus fréquente et la moins informative. Elle décrit un calendrier de réunions. Ce que l'interlocuteur cherche à savoir, c'est si le candidat a compris à quoi ces réunions servaient, et s'il saura fonctionner dans une équipe qui les pratique autrement.",
    },
    {
      kind: "text",
      text: "Le point de départ tient en une phrase : l'agilité est une réponse à l'incertitude. Quand on ne peut pas savoir à l'avance ce qu'il faut construire — parce que le besoin se précise en le voyant — on remplace le plan détaillé par des cycles courts qui produisent quelque chose d'utilisable et permettent de corriger. Tout le reste, les rôles, les cérémonies, les artefacts, découle de cet objectif : **raccourcir la boucle de retour**.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les cérémonies Scrum, et la question à laquelle chacune répond.",
      code: `Planification   « Que peut-on livrer d'utilisable d'ici
                  la fin du sprint ? »

Mêlée (daily)   « Qu'est-ce qui bloque, et qui peut
                  aider ? »  — pas un rapport d'activité
                  au chef de projet

Revue           « Voici ce qui marche : est-ce bien ce
                  qu'il vous fallait ? »  — avec les
                  utilisateurs, sinon la boucle est
                  ouverte

Rétrospective   « Qu'est-ce qu'on change dans notre
                  façon de travailler ? »  — la seule
                  cérémonie qui porte sur le processus`,
    },
    {
      kind: "text",
      text: "Rattacher chaque rituel à sa question évite le piège principal de la question d'entretien. Un candidat qui dit « la mêlée sert à savoir où en est chacun » décrit un rapport d'activité, c'est-à-dire précisément ce que la mêlée n'est pas censée être. Celui qui répond « à faire remonter les blocages assez tôt pour que quelqu'un aide dans la journée » a compris l'intention, même si son équipe la pratiquait mal.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Une user story utilisable, et ses critères d'acceptation.",
      code: `En tant que gestionnaire de stock,
je veux voir les articles sous le seuil de réapprovisionnement,
afin de commander avant la rupture.

Critères d'acceptation
- Étant donné un article dont le stock est sous son seuil,
  quand j'ouvre le tableau de bord,
  alors il apparaît dans la liste « à commander ».
- Les articles déjà commandés n'y apparaissent pas.
- La liste est triée par jours de couverture restants.

Définition de terminé (équipe)
- tests unitaires et un test d'intégration
- relu et fusionné
- déployé en recette
- documentation de l'API à jour`,
    },
    {
      kind: "text",
      text: "Deux artefacts sont régulièrement mal compris. Les **critères d'acceptation** sont propres à une story et disent quand *celle-ci* est bonne. La **définition de terminé** est commune à toute l'équipe et dit ce qu'il faut avoir fait pour que n'importe quelle story soit finie — tests, revue, déploiement. Confondre les deux conduit à des stories déclarées terminées mais jamais testées, chacun ayant sa propre idée du mot « fini ».",
    },
    {
      kind: "comparison",
      title: "Scrum et Kanban",
      left: {
        label: "Scrum",
        text: "Rythme par itérations de durée fixe, un périmètre engagé au début du sprint, des rôles définis. Adapté quand on peut protéger l'équipe des interruptions et se projeter sur deux semaines. Le sprint fournit un cadre de mesure : la vélocité.",
      },
      right: {
        label: "Kanban",
        text: "Flux continu, pas d'itération, une limite du travail en cours à chaque colonne. Adapté quand les demandes arrivent en continu et ne peuvent pas attendre — maintenance, exploitation. On mesure le temps de traversée plutôt que la vélocité.",
      },
    },
    {
      kind: "text",
      text: "En entretien, avouer que l'équipe pratiquait mal l'agilité est souvent plus crédible que prétendre le contraire — à condition de savoir dire en quoi. « On avait les cérémonies mais la rétrospective ne produisait jamais d'action, donc les mêmes problèmes revenaient » est une réponse d'observateur lucide. « On faisait du Scrum » ne permet à personne de savoir ce qu'on a compris.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "La vélocité n'est pas une performance",
      text: "La vélocité sert à l'équipe pour prévoir ce qu'elle peut engager au prochain sprint, rien d'autre. Utilisée comme indicateur de rendement, ou comparée entre équipes, elle est immédiatement corrompue : il suffit de gonfler les estimations pour que la courbe monte. On mesure alors une inflation, pas une accélération — et l'outil de prévision est perdu.",
    },
    {
      kind: "text",
      text: "La question a enfin une variante piège : « que faites-vous si le sprint dérape ? » La mauvaise réponse est de promettre de tenir l'engagement coûte que coûte, en rognant sur les tests. La bonne consiste à alerter tôt, à discuter du périmètre avec le responsable produit et à livrer moins mais terminé — au sens de la définition de terminé de l'équipe. C'est exactement pour cela qu'elle existe.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-ent-16",
    difficulty: 1,
    tags: ["entretien", "agile"],
    prompt: "À quoi sert la mêlée quotidienne ?",
    choices: [
      "À faire remonter les blocages assez tôt pour que quelqu'un puisse aider dans la journée.",
      "À permettre à chacun de rendre compte de son activité de la veille au chef de projet.",
      "À réattribuer les tâches en fonction de l'avancement de chacun.",
      "À valider que le périmètre du sprint sera tenu à la date prévue.",
    ],
    answer: 0,
    explanation:
      "La mêlée est une synchronisation entre pairs, orientée vers l'entraide : son produit utile est la liste de ce qui bloque. Décrite comme un rapport d'activité, elle devient une réunion de contrôle où chacun justifie sa journée — ce qui pousse à masquer les difficultés, exactement l'inverse de l'effet recherché.",
  },
  {
    kind: "match",
    id: "transverse-ent-17",
    difficulty: 2,
    tags: ["entretien", "agile"],
    prompt: "Associe chaque cérémonie à la question à laquelle elle répond.",
    pairs: [
      { left: "Planification", right: "Que peut-on livrer d'utilisable d'ici la fin du sprint ?" },
      { left: "Mêlée quotidienne", right: "Qu'est-ce qui bloque, et qui peut aider ?" },
      { left: "Revue de sprint", right: "Voici ce qui marche : est-ce bien ce qu'il vous fallait ?" },
      { left: "Rétrospective", right: "Qu'est-ce qu'on change dans notre façon de travailler ?" },
    ],
    explanation:
      "Rattacher chaque rituel à sa question évite de réciter un calendrier de réunions. La rétrospective est la seule à porter sur le processus lui-même : c'est elle qui rend l'agilité adaptative, et c'est aussi la première qu'on sacrifie quand le temps manque — au prix des mêmes problèmes qui reviennent sprint après sprint.",
  },
  {
    kind: "order",
    id: "transverse-ent-18",
    difficulty: 2,
    tags: ["entretien", "agile"],
    prompt: "Le sprint dérape à mi-parcours : remets dans l'ordre la bonne réaction.",
    items: [
      "Alerter dès que l'écart est visible, sans attendre la fin du sprint",
      "Chiffrer ce qui reste réellement faisable d'ici la fin",
      "Discuter du périmètre avec le responsable produit pour choisir ce qui saute",
      "Livrer moins, mais terminé au sens de la définition de terminé",
      "Porter la cause en rétrospective pour éviter que cela se reproduise",
    ],
    explanation:
      "La mauvaise réponse consiste à tenir l'engagement coûte que coûte en rognant sur les tests : on livre alors du travail non terminé, la dette est invisible et le problème réapparaît au sprint suivant. Alerter tôt laisse au responsable produit le choix de ce qui saute — un choix qui lui revient, pas à l'équipe technique.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Estimer : pourquoi les estimations ratent
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l7",
  title: "Estimer : pourquoi les estimations ratent",
  blocks: [
    {
      kind: "text",
      text: "Toute estimation de développement est fausse, et la question n'est pas de la rendre juste mais de savoir de combien elle peut se tromper. Deux causes se combinent. La première est que l'on estime ce qu'on imagine du travail, c'est-à-dire le chemin nominal : on oublie la reprise après revue, la donnée de test à fabriquer, l'environnement cassé, la question restée sans réponse pendant deux jours.",
    },
    {
      kind: "text",
      text: "La seconde est plus retorse : l'incertitude n'est pas symétrique. Une tâche estimée à deux jours ne prendra jamais moins d'un jour et demi, alors qu'elle peut très bien en prendre huit. Les bonnes surprises sont bornées par la quantité de travail réelle, les mauvaises ne le sont pas. Une moyenne d'estimations optimistes reste donc optimiste, et cet effet ne se compense pas en additionnant des tâches.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Pourquoi les points plutôt que les jours.",
      code: `« Trois jours »  → un engagement de date. Celui qui
                   l'entend le note dans un planning, et
                   toute dérive devient un retard.

« 5 points »     → une taille relative. « Deux fois plus
                   gros que la story à 2 points qu'on a
                   faite le mois dernier. »

Suite de Fibonacci : 1, 2, 3, 5, 8, 13, 20…
Les écarts s'élargissent avec la taille, ce qui traduit
la baisse de précision : on distingue mal un 13 d'un 15,
et prétendre le contraire est une illusion.

→ La conversion en jours vient après, par la vélocité
  observée de l'équipe, pas par une règle fixe.`,
    },
    {
      kind: "text",
      text: "L'estimation en points relatifs n'est pas un jargon destiné à brouiller les pistes. Les humains sont mauvais pour évaluer des durées absolues et bien meilleurs pour comparer deux choses entre elles. Dire « c'est deux fois plus gros que ce qu'on a fait la semaine dernière » est une opération fiable ; dire « ça prendra onze jours » ne l'est pas, et donne pourtant une illusion de précision que personne ne remettra en cause.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Estimer une incertitude plutôt qu'un point.",
      code: `Question : « Combien pour la reprise du module de
             facturation ? »

✗ « Trois semaines. »

✓ « Entre deux et six semaines. L'écart vient d'un
    point précis : on ne sait pas si les anciennes
    factures peuvent être migrées automatiquement.
    Donne-moi deux jours pour tester la migration sur
    un échantillon, et je reviens avec une fourchette
    beaucoup plus serrée. »

→ On nomme la source de l'incertitude, et on propose
  de la réduire. C'est ce qu'attend un interlocuteur
  qui doit décider.`,
    },
    {
      kind: "text",
      text: "Répondre par une fourchette n'est pas une dérobade, c'est l'information honnête. Et la nommer permet d'agir : identifier le point d'incertitude majeur, proposer une expérience courte pour le lever, puis réestimer. C'est ce qu'on appelle parfois un *spike*, une tâche dont le produit n'est pas du code livrable mais une réduction de l'incertitude — l'un des rares cas où passer deux jours sans rien livrer est le meilleur investissement possible.",
    },
    {
      kind: "comparison",
      title: "Deux erreurs opposées",
      left: {
        label: "Le chiffre unique",
        text: "« Trois semaines. » Rassure sur le moment, se transforme en engagement de date, et rend toute dérive coupable. Comme il est plus souvent optimiste que pessimiste, il produit un climat de retard permanent alors que le travail avance normalement.",
      },
      right: {
        label: "Le refus d'estimer",
        text: "« Impossible à dire tant que je n'ai pas regardé. » Vrai, mais inexploitable : celui qui demande doit arbitrer entre plusieurs sujets et a besoin d'un ordre de grandeur. Refuser, c'est laisser quelqu'un d'autre estimer à votre place, en général plus bas.",
      },
    },
    {
      kind: "text",
      text: "En entretien, la question « comment estimez-vous ? » teste précisément cet équilibre. La réponse attendue montre qu'on sait produire un ordre de grandeur utilisable, qu'on l'assortit d'une incertitude explicite, qu'on nomme ce qui la cause, et qu'on réestime quand on en sait plus. Elle montre aussi qu'on distingue une estimation d'un engagement — deux mots qu'un projet en difficulté confond systématiquement.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Estimation n'est pas engagement",
      text: "Une estimation est une prévision faite avec l'information du moment ; un engagement est une promesse. Le glissement de l'une à l'autre se produit presque toujours sans que personne ne le décide : le chiffre est dit en réunion, noté dans un planning, et devient une date. La seule parade est de le dire au moment où on donne le chiffre — et de réestimer à voix haute dès que l'information change.",
    },
    {
      kind: "text",
      text: "Reste un réflexe simple et efficace : découper. Une tâche estimée à 13 points ou plus est presque toujours une tâche mal comprise, et son estimation ne vaut rien. La découper en morceaux plus petits force à examiner le détail, fait apparaître les zones d'ombre, et produit une somme nettement plus fiable que le chiffre global — non parce que l'arithmétique change, mais parce qu'on a été obligé de regarder.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-ent-19",
    difficulty: 2,
    tags: ["entretien", "estimation"],
    prompt: "Pourquoi une moyenne d'estimations optimistes reste-t-elle optimiste, même sur beaucoup de tâches ?",
    choices: [
      "Parce que l'incertitude est asymétrique : le gain possible est borné, le dépassement ne l'est pas.",
      "Parce que les développeurs sous-estiment systématiquement de la même proportion.",
      "Parce que les erreurs d'estimation se cumulent au lieu de se compenser statistiquement.",
      "Parce que la loi des grands nombres ne s'applique pas à des échantillons de moins de trente tâches.",
    ],
    answer: 0,
    explanation:
      "Une tâche estimée à deux jours ne prendra pas moins d'un jour et demi — la borne basse est le travail réel — mais peut en prendre huit si un imprévu survient. La distribution est étirée d'un seul côté. Additionner de telles estimations ne fait donc pas se compenser les écarts : la somme hérite du même biais.",
  },
  {
    kind: "order",
    id: "transverse-ent-20",
    difficulty: 2,
    tags: ["entretien", "estimation"],
    prompt: "On te demande d'estimer un sujet mal connu. Remets la bonne démarche dans l'ordre.",
    items: [
      "Donner un ordre de grandeur sous forme de fourchette, pas un chiffre unique",
      "Nommer le point précis qui cause l'essentiel de l'incertitude",
      "Proposer une expérience courte pour lever ce point",
      "Réestimer avec une fourchette resserrée une fois l'expérience faite",
    ],
    explanation:
      "Refuser d'estimer laisse quelqu'un d'autre le faire à votre place, en général plus bas. Donner un chiffre unique transforme une prévision en engagement de date. La fourchette assortie de sa cause est la seule réponse à la fois honnête et exploitable — elle permet à celui qui demande d'arbitrer, et à l'équipe d'agir sur l'incertitude.",
  },
  {
    kind: "recall",
    id: "transverse-ent-21",
    difficulty: 3,
    tags: ["entretien", "estimation"],
    prompt: "Pourquoi estimer en points relatifs plutôt qu'en jours, et pourquoi la vélocité ne doit-elle pas servir d'indicateur de performance ?",
    explanation:
      "En points, parce que les humains évaluent mal les durées absolues et comparent bien deux choses entre elles : « deux fois plus gros que la story de la semaine dernière » est fiable, « onze jours » ne l'est pas tout en donnant une illusion de précision. Les points évitent aussi qu'une estimation se transforme en engagement de date. Les écarts croissants de la suite de Fibonacci traduisent la baisse de précision quand la taille augmente. Quant à la vélocité, elle sert à l'équipe pour prévoir ce qu'elle peut engager au prochain sprint, et à rien d'autre : utilisée comme mesure de rendement ou comparée entre équipes, elle se corrompt immédiatement, puisqu'il suffit de gonfler les estimations pour la faire monter. On mesure alors une inflation, et l'outil de prévision est perdu.",
    keyPoints: [
      "On compare mieux qu'on n'évalue des durées absolues",
      "Les points évitent qu'une estimation devienne une date",
      "Fibonacci : les écarts s'élargissent car la précision baisse",
      "La vélocité sert à prévoir, pas à mesurer un rendement",
      "Utilisée comme performance, elle se gonfle et perd son sens",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Le live coding : être évalué en direct
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "transverse-ent-l8",
  title: "Le live coding : être évalué en direct",
  blocks: [
    {
      kind: "text",
      text: "Le live coding est l'épreuve la plus mal vécue de l'entretien technique, et souvent pour une mauvaise raison : le candidat croit qu'on évalue sa capacité à trouver la solution vite. C'est rarement le cas. On observe une façon de travailler — comment le problème est clarifié, comment le raisonnement est exposé, ce qui est fait quand ça ne marche pas. Un candidat qui n'arrive pas au bout mais dont on a suivi la pensée passe souvent devant un candidat muet qui a fini.",
    },
    {
      kind: "text",
      text: "La première erreur est de se jeter sur le clavier. Un énoncé d'exercice est toujours incomplet, souvent volontairement : c'est un test. Deux minutes de questions valent mieux que vingt minutes dans la mauvaise direction, et elles montrent exactement ce qu'on veut voir d'un développeur — qu'il ne code pas avant d'avoir compris ce qu'on lui demande.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Avant d'écrire : les questions et un exemple travaillé.",
      code: `// Énoncé : « écris une fonction qui regroupe une liste
//            de commandes par client »

// Questions à poser :
//  - La liste peut-elle être nulle ? vide ?
//  - Un client sans commande doit-il apparaître ?
//  - L'ordre des commandes dans chaque groupe importe-t-il ?
//  - Quelle volumétrie ? (change la réponse)

// Puis on écrit un exemple concret AVANT de coder :
//  entrée  : [ (c1, 10€), (c2, 5€), (c1, 7€) ]
//  sortie  : { c1: [10€, 7€], c2: [5€] }
//
// L'exemple sert de test et vérifie qu'on a compris
// la même chose que l'examinateur.`,
    },
    {
      kind: "text",
      text: "Vient ensuite la solution simple. Beaucoup de candidats cherchent d'emblée l'implémentation astucieuse, se perdent, et n'ont rien à montrer au bout de vingt minutes. La bonne méthode consiste à écrire d'abord la version évidente, à la faire marcher, puis à dire à voix haute ce qu'on améliorerait et pourquoi. Une solution naïve qui fonctionne, accompagnée d'une critique lucide, vaut mieux qu'une solution élégante inachevée.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La version simple, puis l'amélioration qu'on annonce.",
      code: `// Étape 1 — ça marche, c'est lisible
Map<Long, List<Order>> byCustomer = new HashMap<>();
for (Order o : orders) {
    byCustomer.computeIfAbsent(o.customerId(), k -> new ArrayList<>())
              .add(o);
}
return byCustomer;

// À dire à voix haute :
// « Ça fonctionne. En Java moderne je l'écrirais plutôt
//   avec Collectors.groupingBy, c'est la même chose en
//   une ligne — je le fais si vous voulez. Et si la
//   liste peut être nulle, je préfère lever tôt plutôt
//   que renvoyer une map vide, mais ça dépend du
//   contrat que vous attendez. »

return orders.stream()
        .collect(Collectors.groupingBy(Order::customerId));`,
    },
    {
      kind: "text",
      text: "Verbaliser est la compétence centrale de l'exercice, et c'est celle qui se travaille le plus facilement. Il ne s'agit pas de commenter chaque caractère tapé, mais d'annoncer les intentions et les doutes : « je pars sur une map, quitte à revenir dessus », « là je ne suis pas sûr du comportement de cette méthode sur une liste vide, je vérifie ». Le silence, lui, est illisible — l'examinateur ne peut pas distinguer la réflexion du blocage.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'être bloqué",
      left: {
        label: "Le silence",
        text: "On cherche dans sa tête, l'écran ne bouge pas, l'examinateur ne sait pas si on réfléchit ou si on est perdu. Il ne peut pas aider sans donner l'impression de souffler la réponse, et la minute devient très longue pour tout le monde.",
      },
      right: {
        label: "Le blocage énoncé",
        text: "« Je bloque sur la gestion des doublons ; mon idée serait de passer par un Set, mais je perds l'ordre. Je tente ça ? » L'examinateur peut valider, orienter, ou dire que ça n'a pas d'importance. Le blocage devient une information exploitable.",
      },
    },
    {
      kind: "text",
      text: "Les cas limites sont le second critère d'évaluation le plus fréquent, et le plus facile à gagner. Liste vide, valeur nulle, doublons, un seul élément, très gros volume : les énoncer spontanément à la fin, même sans les traiter tous, montre qu'on a le réflexe. « Je n'ai pas géré le cas de la liste nulle, en production j'ajouterais une vérification ici » suffit souvent — l'important est de prouver qu'on y a pensé.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Ne pas bluffer sur une API",
      text: "Hésiter sur la signature exacte d'une méthode est parfaitement normal et n'a aucune importance — personne ne connaît toute la bibliothèque standard par cœur. En revanche, inventer un comportement avec assurance est éliminatoire : cela signale quelqu'un qui affirme sans vérifier, ce qui coûte bien plus cher en équipe qu'une mémoire imparfaite. « Je crois que c'est `computeIfAbsent`, je vérifierais la signature » est la bonne réponse.",
    },
    {
      kind: "text",
      text: "Un dernier point souvent décisif : écrire un test, même minuscule, avant ou juste après la première version. Cela ancre l'exemple travaillé, permet de vérifier au lieu de supposer, et montre un réflexe que beaucoup d'équipes cherchent explicitement. Si l'environnement ne permet pas de lancer quoi que ce soit, dérouler mentalement le code sur l'exemple, à voix haute, produit le même effet.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "transverse-ent-22",
    difficulty: 2,
    tags: ["entretien", "live-coding"],
    prompt: "En live coding, on te demande de dérouler ce code à voix haute. Qu'affiche-t-il ?",
    code: {
      language: "java",
      code: `List<String> mots = List.of("bleu", "vert", "brun", "rose");

Map<Character, List<String>> parInitiale = new HashMap<>();
for (String m : mots) {
    parInitiale.computeIfAbsent(m.charAt(0), k -> new ArrayList<>())
               .add(m);
}

System.out.println(parInitiale.get('b'));
System.out.println(parInitiale.get('j'));`,
    },
    choices: [
      "[bleu, brun] puis null",
      "[bleu, brun] puis []",
      "[bleu, brun] puis une NullPointerException",
      "[bleu] puis null",
    ],
    answer: 0,
    explanation:
      "`computeIfAbsent` crée la liste au premier passage puis renvoie l'existante : `bleu` et `brun` s'accumulent dans la même liste, dans l'ordre de parcours. En revanche `get('j')` renvoie `null` — aucune entrée n'a été créée pour cette clé, et `get` ne crée rien. C'est exactement le genre de cas limite qu'il faut signaler spontanément : un appel enchaîné derrière ce `get` lèverait une `NullPointerException`.",
  },
  {
    kind: "spot",
    id: "transverse-ent-23",
    difficulty: 2,
    tags: ["entretien", "live-coding"],
    prompt: "Première version écrite en live coding. L'examinateur demande « que se passe-t-il si la liste contient deux fois le même client ? ». Quelle ligne pose problème ?",
    code: {
      language: "java",
      code: `Map<Long, Order> parClient = new HashMap<>();
for (Order o : orders) {
    parClient.put(o.customerId(), o);
}
return parClient;`,
    },
    faultyLine: 3,
    reasons: [
      "`put` écrase la valeur précédente : seule la dernière commande de chaque client est conservée.",
      "`put` lève une exception si la clé est déjà présente dans la map.",
      "`HashMap` n'accepte pas les clés de type `Long`.",
      "L'itération sur `orders` doit se faire avec un index pour éviter les doublons.",
    ],
    reasonAnswer: 0,
    explanation:
      "`put` remplace silencieusement la valeur associée à une clé existante. Si l'énoncé demandait de **regrouper** les commandes par client, la structure doit être un `Map<Long, List<Order>>` alimenté par `computeIfAbsent`, ou obtenu par `Collectors.groupingBy`. C'est typiquement le cas limite qu'une question sur les doublons cherche à faire émerger.",
  },
  {
    kind: "mcq",
    id: "transverse-ent-24",
    difficulty: 1,
    tags: ["entretien", "live-coding"],
    prompt: "Tu ne te souviens plus de la signature exacte d'une méthode pendant un live coding. Que faire ?",
    choices: [
      "Le dire, proposer ce dont tu te souviens et préciser que tu vérifierais la signature.",
      "Affirmer une signature plausible : hésiter donne une mauvaise image.",
      "Changer d'approche pour éviter complètement cette méthode.",
      "Demander à l'examinateur de te donner la réponse avant de continuer.",
    ],
    answer: 0,
    explanation:
      "Personne ne connaît toute la bibliothèque standard par cœur, et l'hésitation sur une signature n'est jamais un critère d'élimination. Inventer un comportement avec assurance l'est en revanche : cela signale quelqu'un qui affirme sans vérifier, comportement bien plus coûteux en équipe qu'une mémoire imparfaite. Contourner la méthode pour cacher l'hésitation fait perdre du temps sans rien démontrer.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "transverse-entretien",
  title: "Entretien : se présenter, défendre ses choix, être évalué",
  objective:
    "Préparer les moments non techniques de l'entretien : raconter son parcours et un projet, justifier une décision d'architecture, tenir un rôle en revue de code, parler d'agilité et d'estimation sans réciter, et aborder un live coding avec une méthode.",
  prerequisites: [],
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
