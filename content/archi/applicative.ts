/**
 * Architecture — Architecture applicative (référentiel 9.2) : découpage,
 * réseau, synchrone/asynchrone, résilience, cohérence, observabilité.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Monolithe modulaire ou microservices
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "archi-app-l1",
  title: "Monolithe modulaire ou microservices",
  blocks: [
    {
      kind: "text",
      text: "La question est presque toujours mal posée. On oppose un monolithe — supposé désordonné — à des microservices — supposés bien découpés — alors que les deux axes sont indépendants : la qualité du découpage, et le nombre de processus déployés. Un monolithe peut être parfaitement modulaire, et un ensemble de microservices peut former un bourbier distribué.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Deux axes, quatre situations.",
      code: `                 UN SEUL DÉPLOIEMENT   PLUSIEURS

BIEN DÉCOUPÉ     Monolithe modulaire    Microservices
                 ✓ le bon défaut        ✓ si nécessaire

MAL DÉCOUPÉ      Le « gros tas »        Bourbier distribué
                 ✗ pénible              ✗✗ le pire des deux

→ Le découpage est le VRAI sujet. Le nombre de
  déploiements est une conséquence, prise pour des
  raisons opérationnelles — pas l'inverse.`,
    },
    {
      kind: "text",
      text: "Le bourbier distribué est le résultat le plus fréquent d'une migration mal préparée : on garde un couplage fort entre modules, et l'on y ajoute le réseau. Chaque appel devient faillible, lent et difficile à déboguer, sans qu'aucune frontière n'ait été clarifiée. On a multiplié les problèmes sans résoudre celui de départ.",
    },
    {
      kind: "text",
      text: "Découper apporte des bénéfices réels, mais opérationnels avant d'être techniques : des équipes qui déploient indépendamment, des composants dimensionnés séparément, une panne qui n'emporte pas tout, des choix techniques différents là où c'est justifié. Aucun de ces bénéfices ne concerne la qualité du code — celle-ci vient du découpage, qu'on peut obtenir sans réseau.",
    },
    {
      kind: "comparison",
      title: "Ce que chaque option coûte",
      left: {
        label: "Monolithe modulaire",
        text: "Une transaction couvre tout, un appel est un appel de méthode, le débogage suit une pile unique, le déploiement est atomique. En contrepartie : un seul rythme de livraison, une seule pile technique, et une panne qui touche l'ensemble.",
      },
      right: {
        label: "Microservices",
        text: "Déploiements indépendants, dimensionnement fin, isolation des pannes. En contrepartie : plus de transaction globale, chaque appel peut échouer, le débogage traverse des processus, et il faut une infrastructure d'observabilité digne de ce nom.",
      },
    },
    {
      kind: "text",
      text: "Le coût le plus souvent sous-estimé est celui de la **transaction**. Dans un monolithe, valider une commande et décrémenter un stock tient dans une transaction : soit les deux réussissent, soit aucun. Réparti sur deux services, ce n'est plus possible — il faut des événements, des reprises, de l'idempotence et de la cohérence éventuelle, soit un travail considérable pour retrouver une garantie qu'on avait gratuitement.",
    },
    {
      kind: "text",
      text: "La stratégie qui fonctionne consiste à commencer par un monolithe **modulaire** : des modules aux frontières explicites, communiquant par des interfaces, sans accès direct aux données du voisin. On obtient la qualité de découpage sans payer le réseau, et l'on peut extraire un module en service le jour où un besoin opérationnel le justifie — parce que la frontière existe déjà.",
    },
    {
      kind: "text",
      text: "L'inverse est beaucoup plus difficile : refusionner des microservices mal découpés suppose de défaire une infrastructure, des contrats et des habitudes. C'est pourquoi l'ordre compte — on découpe le code d'abord, on distribue ensuite, jamais l'inverse.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le découpage par couche technique ne se distribue pas",
      text: "Un service « contrôleurs », un service « métier » et un service « accès aux données » reproduisent un monolithe à travers le réseau : la moindre fonctionnalité traverse les trois, aucun ne peut évoluer seul, et l'on a ajouté deux sauts réseau à chaque requête. Un découpage qui se distribue suit les **domaines**, pas les couches.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un module du monolithe, avec une frontière explicite.",
      code: `// Le module Stocks n'expose QU'une interface
package modules.stocks.api;
public interface Stocks {
    void reserve(ReferenceArticle ref, int quantite);
}

// Son implémentation et ses entités sont
// package-private : inaccessibles de l'extérieur.
package modules.stocks.interne;
class StocksImpl implements Stocks { … }
class LigneStock { … }              // pas public

// Commandes ne peut PAS toucher aux tables ni aux
// entités de Stocks : il passe par l'interface.`,
    },
    {
      kind: "text",
      text: "La visibilité au niveau du paquet suffit à rendre cette frontière réelle plutôt que déclarative, et un test d'architecture la fait tenir dans le temps. C'est ce qui distingue un monolithe modulaire d'un monolithe ordinaire : la contrainte est vérifiée par le compilateur, pas seulement écrite dans un document que personne ne relit.",
    },
    {
      kind: "text",
      text: "En entretien, la réponse attendue n'est pas un camp. C'est de distinguer les deux axes, de nommer ce que la distribution coûte — transaction, débogage, observabilité — et de dire qu'on la choisit pour des raisons opérationnelles identifiées, pas parce que c'est l'architecture attendue.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-app-01",
    difficulty: 2,
    tags: ["architecture", "microservices"],
    prompt: "Pourquoi l'opposition « monolithe contre microservices » est-elle mal posée ?",
    choices: [
      "Ce sont deux axes indépendants : la qualité du découpage, et le nombre de déploiements.",
      "Parce que les microservices sont toujours préférables au-delà d'une certaine taille d'équipe.",
      "Parce qu'un monolithe ne peut pas être modulaire par construction.",
      "Parce que le choix dépend uniquement du langage utilisé.",
    ],
    answer: 0,
    explanation:
      "Un monolithe peut être parfaitement modulaire, et un ensemble de microservices peut former un bourbier distribué — couplage fort plus réseau, soit les problèmes des deux sans les avantages. Le découpage est le vrai sujet ; le nombre de déploiements est une conséquence, prise pour des raisons opérationnelles.",
  },
  {
    kind: "match",
    id: "archi-app-02",
    difficulty: 2,
    tags: ["architecture", "microservices"],
    prompt: "Associe chaque bénéfice ou coût au bon côté.",
    pairs: [
      { left: "Déployer une partie sans redéployer le reste", right: "Bénéfice de la distribution" },
      { left: "Valider et décrémenter dans une seule transaction", right: "Bénéfice du déploiement unique" },
      { left: "Un appel qui peut échouer, être lent ou partiel", right: "Coût de la distribution" },
      { left: "Une panne qui emporte l'ensemble", right: "Coût du déploiement unique" },
    ],
    explanation:
      "Les bénéfices de la distribution sont opérationnels — rythmes de livraison, dimensionnement, isolation des pannes — et non techniques : la qualité du code vient du découpage, qu'on obtient sans réseau. Le coût le plus sous-estimé est la perte de la transaction, qu'il faut remplacer par des événements, des reprises et de l'idempotence.",
  },
  {
    kind: "recall",
    id: "archi-app-03",
    difficulty: 2,
    tags: ["architecture", "microservices"],
    prompt: "Pourquoi commencer par un monolithe modulaire plutôt que par des microservices ?",
    explanation:
      "Parce qu'on obtient la **qualité de découpage sans payer le réseau**. Des modules aux frontières explicites, communiquant par interfaces et sans accès direct aux données du voisin, donnent déjà l'essentiel de ce qu'on cherche : responsabilités claires, évolution locale, code compréhensible. On garde en même temps ce que la distribution fait perdre — une transaction qui couvre tout, un appel de méthode qui ne peut pas échouer pour cause de réseau, une pile d'appel unique au débogage, un déploiement atomique. Et le jour où un besoin **opérationnel** apparaît — une équipe qui doit livrer à son rythme, un composant à dimensionner séparément, une panne à isoler — on extrait un module en service, parce que la frontière existe déjà. L'inverse est bien plus difficile : refusionner des microservices mal découpés suppose de défaire une infrastructure, des contrats et des habitudes.",
    keyPoints: [
      "La qualité du découpage s'obtient sans réseau",
      "On garde transaction, débogage simple et déploiement atomique",
      "L'extraction devient facile quand la frontière existe déjà",
      "Refusionner est bien plus coûteux que découper",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Le coût du réseau
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "archi-app-l2",
  title: "Le coût du réseau",
  blocks: [
    {
      kind: "text",
      text: "Une liste d'affirmations célèbre énumère ce que les développeurs supposent à tort d'un réseau : qu'il est fiable, que la latence est nulle, que la bande passante est infinie, qu'il est sûr, que la topologie ne change pas. Chacune est fausse, et chacune produit une catégorie de bugs bien identifiée.",
    },
    {
      kind: "text",
      text: "La différence de nature entre un appel local et un appel distant est le point à intégrer. Un appel de méthode prend quelques nanosecondes et ne peut pas échouer à cause du transport. Un appel réseau prend des millisecondes — un million de fois plus — et peut échouer, ou pire, **ne pas répondre** : l'appelant ne sait alors pas si l'opération a eu lieu.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le motif N+1, transposé au réseau.",
      code: `// 1 appel : la liste des commandes
var commandes = api.listeCommandes();      // 100 résultats

// Puis un appel par commande pour enrichir
for (var c : commandes) {
    c.setClient(api.client(c.clientId()));  // ← 100 appels
}

// Total : 101 appels réseau.
// À 50 ms chacun, en série : plus de 5 secondes.
// En base locale, le même motif coûtait 50 ms.

// La version correcte : un appel groupé
var ids = commandes.stream().map(Commande::clientId).toList();
var clients = api.clients(ids);            // 1 seul appel`,
    },
    {
      kind: "text",
      text: "Le motif N+1 existe déjà avec une base de données, mais le réseau le rend catastrophique : là où cent requêtes locales coûtaient quelques dizaines de millisecondes, cent appels distants coûtent plusieurs secondes. C'est la raison pour laquelle une API distante doit proposer des opérations **groupées** — et pour laquelle un client doit les utiliser.",
    },
    {
      kind: "comparison",
      title: "Deux granularités d'interface",
      left: {
        label: "Bavarde",
        text: "Beaucoup d'appels fins, chacun renvoyant peu. Naturelle quand on transpose des appels de méthode. Multiplie la latence par le nombre d'appels et rend la moindre lenteur du réseau visible par l'utilisateur.",
      },
      right: {
        label: "Grossière",
        text: "Peu d'appels, chacun renvoyant ce dont l'appelant a besoin. Plus de données transférées, mais la latence est payée une fois. C'est la granularité adaptée à une frontière réseau, et elle se conçoit différemment d'une interface interne.",
      },
    },
    {
      kind: "text",
      text: "Le délai d'attente est le second point vital. Un appel sans limite de temps peut bloquer un thread indéfiniment ; si tous les threads finissent bloqués sur un service lent, l'application entière cesse de répondre alors qu'elle est parfaitement saine. Une panne extérieure se transforme ainsi en panne locale — c'est le mécanisme d'effondrement en cascade le plus courant.",
    },
    {
      kind: "text",
      text: "Un délai doit donc être fixé sur **tout** appel sortant, et calculé à rebours : si l'on promet une réponse en deux secondes et qu'on appelle trois services, aucun ne peut disposer de deux secondes. Cette contrainte, déclinée le long de la chaîne, est ce qu'on appelle un budget de latence — et elle est rarement écrite alors qu'elle devrait l'être.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les délais par défaut sont souvent infinis",
      text: "Beaucoup de clients HTTP n'imposent aucune limite si on ne la configure pas, et le comportement passe inaperçu tant que tout va bien. Le jour où un service répond en trente secondes, les threads s'accumulent et l'application tombe. Vérifier explicitement les délais de connexion et de lecture de chaque client est une précaution de dix minutes qui évite un incident majeur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Fixer les délais, systématiquement.",
      code: `var factory = new SimpleClientHttpRequestFactory();
factory.setConnectTimeout(Duration.ofSeconds(2));  // connexion
factory.setReadTimeout(Duration.ofSeconds(3));     // réponse

var client = RestClient.builder()
        .requestFactory(factory)
        .build();

// Beaucoup de clients HTTP n'imposent AUCUNE limite
// par défaut. Le comportement passe inaperçu tant
// que tout va bien, et l'application tombe le jour
// où un service répond en trente secondes.`,
    },
    {
      kind: "text",
      text: "Les deux délais sont distincts et tous deux nécessaires : celui de connexion couvre l'établissement du lien, celui de lecture couvre l'attente de la réponse. Un service qui accepte la connexion puis ne répond jamais échappe entièrement au premier — c'est le cas le plus fréquent, et le plus dangereux.",
    },
    {
      kind: "text",
      text: "Retenons les trois conséquences pratiques : concevoir des interfaces grossières avec des opérations groupées, fixer un délai sur chaque appel sortant, et se souvenir qu'une absence de réponse ne signifie pas une absence d'effet — ce dernier point ouvrant directement la question de l'idempotence.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "archi-app-04",
    difficulty: 2,
    tags: ["architecture", "reseau", "performance"],
    prompt: "L'API distante répond en 50 ms par appel et la liste contient 100 commandes. Combien de temps environ ?",
    code: {
      language: "java",
      code: `var commandes = api.listeCommandes();       // 100 résultats

for (var c : commandes) {
    c.setClient(api.client(c.clientId()));
}`,
    },
    choices: [
      "Environ 5 secondes : 101 appels en série, à 50 ms chacun.",
      "Environ 50 ms : les appels de la boucle sont groupés automatiquement.",
      "Environ 100 ms : un appel pour la liste, un pour les clients.",
      "Environ 500 ms : le client HTTP parallélise les appels d'une boucle.",
    ],
    answer: 0,
    explanation:
      "C'est le motif N+1 transposé au réseau : un appel pour la liste, puis un par élément. Rien ne groupe ni ne parallélise automatiquement. Là où cent requêtes en base locale coûtaient quelques dizaines de millisecondes, cent appels distants coûtent plusieurs secondes — d'où la nécessité d'opérations groupées sur une API distante.",
  },
  {
    kind: "mcq",
    id: "archi-app-05",
    difficulty: 2,
    tags: ["architecture", "reseau"],
    prompt: "Pourquoi un appel sortant sans délai d'attente est-il dangereux ?",
    choices: [
      "Les threads s'accumulent sur un service lent, et l'application cesse de répondre alors qu'elle est saine.",
      "Le service appelé refuse les connexions qui ne déclarent pas de délai.",
      "Le système d'exploitation ferme la connexion au bout de trente secondes, ce qui corrompt la réponse.",
      "Le client HTTP réessaie indéfiniment, ce qui sature le réseau.",
    ],
    answer: 0,
    explanation:
      "C'est le mécanisme d'effondrement en cascade le plus courant : une panne extérieure se transforme en panne locale parce que tous les threads finissent bloqués en attente. Beaucoup de clients HTTP n'imposent aucune limite par défaut, et le problème reste invisible tant que tout va bien.",
  },
  {
    kind: "recall",
    id: "archi-app-06",
    difficulty: 2,
    tags: ["architecture", "reseau"],
    prompt: "Qu'est-ce qu'un budget de latence, et comment se calcule-t-il ?",
    explanation:
      "C'est la répartition explicite du temps de réponse promis entre les appels qui le composent, calculée **à rebours**. Si l'on s'engage à répondre en deux secondes et que le traitement appelle trois services, aucun ne peut disposer de deux secondes : il faut leur attribuer des parts — par exemple 800, 600 et 400 millisecondes — en gardant une marge pour le traitement local. Ce budget se décline ensuite le long de la chaîne : un service qui reçoit 800 millisecondes et appelle lui-même quelqu'un doit lui en accorder moins. Sans ce raisonnement, chaque équipe fixe un délai plausible localement, et la somme dépasse largement l'engagement global — si bien que l'appelant abandonne avant que ses dépendances n'aient fini, ce qui produit des erreurs alors que tout fonctionnait. C'est rarement écrit, et cela devrait l'être au même titre qu'un contrat d'interface.",
    keyPoints: [
      "Répartir le temps promis entre les appels qui le composent",
      "Se calcule à rebours, en gardant une marge locale",
      "Se décline le long de la chaîne : moins à chaque étage",
      "Sans budget, la somme des délais dépasse l'engagement global",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Synchrone ou asynchrone
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "archi-app-l3",
  title: "Synchrone ou asynchrone",
  blocks: [
    {
      kind: "text",
      text: "Deux services peuvent communiquer de deux façons, et le choix détermine la plupart des propriétés du système : ce qui se passe quand l'un est indisponible, si l'on peut rejouer, et à quel point ils sont couplés. Ce n'est pas une préférence de style mais une décision structurante.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Deux formes, deux dépendances.",
      code: `SYNCHRONE — appel direct, réponse attendue

  Commandes ──HTTP──► Stocks
      │                  │
      └── attend ────────┘

  · Réponse immédiate, code linéaire
  · Si Stocks est en panne, Commandes échoue
  · Couplage temporel : les deux doivent être là

ASYNCHRONE — message publié, consommé plus tard

  Commandes ──► [ file ] ──► Stocks
      │
      └── continue, sans attendre

  · Si Stocks est en panne, le message attend
  · Aucun couplage temporel
  · Mais aucune réponse immédiate non plus`,
    },
    {
      kind: "text",
      text: "Le **couplage temporel** est la vraie différence. En synchrone, les deux services doivent être disponibles au même instant : l'indisponibilité de l'un se propage à l'autre, et une chaîne de cinq services synchrones n'est disponible que si les cinq le sont — ce qui multiplie les indisponibilités au lieu de les additionner.",
    },
    {
      kind: "text",
      text: "En asynchrone, le message attend dans la file. Le consommateur peut être arrêté une heure sans que le producteur s'en aperçoive, et il rattrape ensuite. Cette propriété est décisive pour tout ce qui n'exige pas de réponse immédiate — et beaucoup de choses qu'on écrit en synchrone n'en exigent pas réellement.",
    },
    {
      kind: "comparison",
      title: "Quand chacun s'impose",
      left: {
        label: "Synchrone",
        text: "L'appelant a besoin du résultat **pour continuer** : vérifier un solde avant d'autoriser, valider une authentification, obtenir un prix à afficher. Là, attendre est le comportement correct, et une file ne résoudrait rien.",
      },
      right: {
        label: "Asynchrone",
        text: "L'appelant annonce un fait et n'attend rien : envoyer une confirmation, alimenter un index, mettre à jour des statistiques, notifier un partenaire. Le traitement peut avoir lieu une seconde ou une minute plus tard sans conséquence.",
      },
    },
    {
      kind: "text",
      text: "Le critère qui tranche est donc : l'appelant a-t-il besoin de la réponse pour produire la sienne ? Si oui, synchrone. Si non, asynchrone — et l'on gagne la résilience, la capacité d'absorber les pics, et le découplage. Beaucoup d'appels synchrones existent uniquement parce que c'était la façon la plus simple d'écrire le code.",
    },
    {
      kind: "text",
      text: "L'asynchrone a ses propres coûts, qu'il faut assumer. Le débogage devient plus difficile — il n'y a plus de pile d'appel qui traverse le système. La gestion des erreurs demande une file de rebut et une politique de reprise. Et il faut un courtier de messages à exploiter, avec sa disponibilité et sa supervision.",
    },
    {
      kind: "text",
      text: "Un point technique mérite d'être connu : la plupart des courtiers garantissent une livraison **au moins une fois**, pas exactement une fois. Un message peut donc être reçu deux fois — après un redémarrage du consommateur, ou si l'accusé de réception se perd. Le traitement doit en tenir compte, ce qui est le sujet de la leçon suivante.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Publier un fait, pas une instruction",
      text: "Un message nommé `CommandeValidee` laisse chaque consommateur décider de ce qu'il en fait, et un nouveau consommateur s'ajoute sans toucher au producteur. Un message nommé `DecrementerStock` désigne un destinataire et une action : c'est un appel de méthode déguisé en message, qui recrée le couplage qu'on voulait supprimer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même besoin, deux écritures.",
      code: `// SYNCHRONE : on attend, car on a besoin du résultat
var disponible = stocks.verifie(reference, quantite);
if (!disponible) throw new RuptureDeStock(reference);

// ASYNCHRONE : on annonce un fait, on n'attend rien
evenements.publie(new CommandeValidee(numero, lignes));
// Stocks, Facturation, Notifications et Statistiques
// réagiront chacun à leur rythme. Ajouter un
// cinquième consommateur ne touche pas ce code.`,
    },
    {
      kind: "text",
      text: "La différence de couplage se voit dans le code : la version synchrone nomme son interlocuteur, la version asynchrone ne nomme qu'un fait. C'est ce qui permet d'ajouter un consommateur sans modifier le producteur — et c'est aussi ce qui rend le débogage plus difficile, puisque rien dans ce code ne dit qui va réagir.",
    },
    {
      kind: "text",
      text: "Retenons que le choix se fait sur un seul critère — l'appelant a-t-il besoin de la réponse — et que l'asynchrone apporte la résilience au prix d'une complexité opérationnelle réelle. Les deux coexistent dans tout système sérieux, et les mélanger volontairement vaut mieux que d'en faire un dogme.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-app-07",
    difficulty: 2,
    tags: ["architecture", "messaging"],
    prompt: "Quel critère décide entre un appel synchrone et un message asynchrone ?",
    choices: [
      "L'appelant a-t-il besoin de la réponse pour produire la sienne ?",
      "Le volume d'appels attendu dépasse-t-il un certain seuil ?",
      "Les deux services sont-ils écrits dans le même langage ?",
      "Le traitement dure-t-il plus d'une seconde ?",
    ],
    answer: 0,
    explanation:
      "Vérifier un solde avant d'autoriser exige une réponse : c'est synchrone. Envoyer une confirmation, alimenter un index ou notifier un partenaire n'exige rien : c'est asynchrone, et l'on gagne la résilience, l'absorption des pics et le découplage. Beaucoup d'appels synchrones existent uniquement parce que c'était plus simple à écrire.",
  },
  {
    kind: "match",
    id: "archi-app-08",
    difficulty: 2,
    tags: ["architecture", "messaging"],
    prompt: "Associe chaque propriété au mode de communication.",
    pairs: [
      { left: "Les deux services doivent être disponibles en même temps", right: "Synchrone : couplage temporel" },
      { left: "Le message attend si le consommateur est arrêté", right: "Asynchrone : découplage temporel" },
      { left: "Pas de pile d'appel qui traverse le système", right: "Coût de l'asynchrone au débogage" },
      { left: "Une chaîne de cinq services multiplie les indisponibilités", right: "Coût du synchrone en chaîne" },
    ],
    explanation:
      "Le couplage temporel est la vraie différence : en synchrone, l'indisponibilité de l'un se propage à l'autre, et une chaîne de cinq services n'est disponible que si les cinq le sont. En asynchrone, le consommateur peut être arrêté une heure sans que le producteur s'en aperçoive — au prix d'un débogage plus difficile et d'un courtier à exploiter.",
  },
  {
    kind: "recall",
    id: "archi-app-09",
    difficulty: 2,
    tags: ["architecture", "messaging"],
    prompt: "Pourquoi nommer un message d'après un fait plutôt que d'après une action ?",
    explanation:
      "Parce qu'un fait laisse le couplage du côté du consommateur, là où une instruction le recrée du côté du producteur. `CommandeValidee` annonce quelque chose qui s'est produit : chaque consommateur décide de ce qu'il en fait, et un nouveau consommateur — l'indexation, les statistiques, une notification partenaire — s'ajoute sans qu'on touche au producteur. `DecrementerStock` désigne au contraire un destinataire et une action : c'est un appel de méthode déguisé en message, qui suppose que le producteur sache qui écoute et ce qu'il doit faire, exactement le couplage que l'asynchrone devait supprimer. Le nommage au participe passé est un bon indicateur : s'il est naturel, le message décrit un fait ; s'il faut un impératif, on est en train d'écrire une commande à distance.",
    keyPoints: [
      "Un fait : chaque consommateur décide de ce qu'il en fait",
      "Un nouveau consommateur s'ajoute sans toucher au producteur",
      "Une instruction recrée le couplage qu'on voulait supprimer",
      "Le participe passé est le bon test de nommage",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Reprises et idempotence
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "archi-app-l4",
  title: "Reprises et idempotence",
  blocks: [
    {
      kind: "text",
      text: "Sur un réseau, un appelant qui ne reçoit pas de réponse ne peut pas distinguer deux situations : la requête n'est jamais arrivée, ou bien elle a été traitée et c'est la réponse qui s'est perdue. Aucune amélioration du client ne lève cette ambiguïté — c'est une propriété du transport, pas un défaut d'implémentation.",
    },
    {
      kind: "text",
      text: "Il ne reste alors que deux options : ne pas réessayer, et risquer de perdre une opération ; ou réessayer, et risquer de la faire deux fois. La seconde est presque toujours préférable, à condition que le service sache traiter un doublon — d'où l'importance centrale de l'idempotence dans tout système distribué.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une reprise correcte, et ce qu'elle suppose.",
      code: `// Réessayer avec attente CROISSANTE et part d'aléa
var retry = RetryPolicy.builder()
        .maxAttempts(3)
        .backoff(Duration.ofMillis(200), 2.0)   // 200, 400, 800
        .jitter(0.3)                            // ±30 % d'aléa
        .retryOn(IOException.class,
                 ServiceIndisponible.class)     // pas tout !
        .build();

// Ce qui NE doit PAS être réessayé :
//  · 400 Bad Request, 422 : la requête est fausse,
//    la rejouer donnera la même erreur
//  · 401, 403 : un droit ne va pas apparaître
//  → seuls 5xx, 429 et les erreurs réseau valent
//    une nouvelle tentative`,
    },
    {
      kind: "text",
      text: "L'attente croissante évite d'aggraver la situation : réessayer immédiatement un service en difficulté ajoute de la charge à une panne, et trois clients qui réessaient en même temps produisent un pic synchronisé. La part d'aléa désynchronise justement ces reprises, ce qui évite que tous les appelants ne reviennent au même instant.",
    },
    {
      kind: "text",
      text: "Le filtrage des erreurs à réessayer est tout aussi important. Une requête refusée pour cause de corps invalide sera refusée à l'identique — la rejouer trois fois ne fait que tripler la charge et retarder l'échec. Seules les erreurs **transitoires** méritent une reprise : indisponibilité, dépassement de quota, coupure réseau.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'obtenir l'idempotence",
      left: {
        label: "Par nature",
        text: "L'opération est formulée comme un état cible : « mets le statut à PAYÉ », « remplace ce contenu ». La rejouer réécrit la même chose. Aucun mécanisme supplémentaire n'est nécessaire — c'est toujours la solution à préférer.",
      },
      right: {
        label: "Par clé",
        text: "L'opération est une création ou un incrément : « crée une commande », « ajoute 10 € ». La rejouer produirait un doublon. Il faut une clé d'idempotence et une trace côté serveur, avec son stockage et son expiration.",
      },
    },
    {
      kind: "text",
      text: "Ce choix se fait au moment de concevoir l'interface, et il est coûteux à changer ensuite. Chaque fois qu'une opération peut être formulée comme un état cible plutôt que comme un delta, l'idempotence est acquise gratuitement : « mettre la quantité à 3 » est rejouable, « ajouter 1 à la quantité » ne l'est pas.",
    },
    {
      kind: "text",
      text: "Côté messages, la règle est la même mais l'exigence est plus forte : la plupart des courtiers garantissent une livraison au moins une fois, donc un consommateur **recevra** des doublons, ce n'est pas une hypothèse. Le traitement doit être idempotent par construction, ou bien tenir une trace des identifiants de messages déjà traités.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les reprises amplifient les pannes",
      text: "Un service qui ralentit provoque des reprises, qui augmentent sa charge, qui le ralentissent davantage. Ce cercle est un mode d'effondrement classique, et il est causé par le mécanisme censé apporter la résilience. Un nombre de tentatives limité, une attente croissante et un disjoncteur en amont sont ce qui empêche la reprise de se retourner contre le système.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le consommateur qui tolère un doublon.",
      code: `@Transactional
public void traite(MessageId id, CommandeValidee e) {
    // Insertion en premier : la contrainte d'unicité
    // arbitre entre deux traitements simultanés.
    if (!traites.marqueSiNouveau(id)) {
        return;               // déjà traité : on sort
    }
    stocks.reserve(e.articles());
}

// Alternative, souvent meilleure : rendre l'opération
// idempotente par nature, en visant un état cible.
stocks.fixeReservation(e.numero(), e.articles());`,
    },
    {
      kind: "text",
      text: "La trace des messages déjà traités doit être écrite dans la **même transaction** que l'effet métier, sans quoi un arrêt entre les deux rejoue le traitement ou le perd. Et cette table doit être purgée : conserver indéfiniment tous les identifiants reproduit le problème de croissance sans fin décrit à propos des caches.",
    },
    {
      kind: "text",
      text: "Retenons la chaîne de raisonnement : l'absence de réponse est ambiguë, donc il faut réessayer, donc le service doit être idempotent, donc l'interface doit être conçue pour l'être. Chaque maillon découle du précédent, et le premier est une propriété du réseau qu'aucun code ne peut changer.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "archi-app-10",
    difficulty: 3,
    tags: ["architecture", "resilience"],
    prompt: "Cette politique de reprise aggrave les pannes. Quelle ligne ?",
    code: {
      language: "java",
      code: `var retry = RetryPolicy.builder()
        .maxAttempts(5)
        .backoff(Duration.ZERO, 1.0)
        .retryOn(Exception.class)
        .build();`,
    },
    faultyLine: 3,
    reasons: [
      "Aucune attente entre les tentatives : cinq appels immédiats ajoutent de la charge à un service déjà en difficulté.",
      "Cinq tentatives est un nombre trop élevé quelle que soit l'attente.",
      "`RetryPolicy` doit être recréée à chaque appel pour rester valide.",
      "L'attente devrait être fixe plutôt que croissante pour rester prévisible.",
    ],
    reasonAnswer: 0,
    explanation:
      "Réessayer immédiatement un service en difficulté l'achève : c'est le cercle classique où le mécanisme censé apporter la résilience provoque l'effondrement. Il faut une attente croissante et une part d'aléa pour désynchroniser les clients. `retryOn(Exception.class)` est un second défaut réel — une requête invalide sera refusée à l'identique, la rejouer ne fait que tripler la charge.",
  },
  {
    kind: "mcq",
    id: "archi-app-11",
    difficulty: 2,
    tags: ["architecture", "resilience"],
    prompt: "Quelles erreurs méritent une nouvelle tentative ?",
    choices: [
      "Les erreurs transitoires : 5xx, 429 et les coupures réseau.",
      "Toutes : une nouvelle tentative ne peut jamais nuire.",
      "Les 4xx uniquement, qui signalent un problème temporaire du client.",
      "Aucune : une reprise automatique masque les vrais défauts.",
    ],
    answer: 0,
    explanation:
      "Un 400 ou un 422 signale une requête fausse : la rejouer donnera exactement la même erreur, en triplant la charge et en retardant l'échec. Un 401 ou un 403 ne se résoudra pas non plus tout seul. Seules les erreurs transitoires — indisponibilité, quota dépassé, coupure réseau — ont une chance d'aboutir à la tentative suivante.",
  },
  {
    kind: "recall",
    id: "archi-app-12",
    difficulty: 3,
    tags: ["architecture", "resilience", "idempotence"],
    prompt: "Pourquoi l'idempotence est-elle indispensable dès qu'on réessaie ?",
    explanation:
      "Parce qu'un appelant qui ne reçoit pas de réponse ne peut pas distinguer « la requête n'est jamais arrivée » de « elle a été traitée et la réponse s'est perdue » — c'est une propriété du transport, qu'aucun code ne lève. Il ne reste que deux options : ne pas réessayer et risquer de perdre l'opération, ou réessayer et risquer de la faire deux fois. La seconde est presque toujours préférable, mais elle n'est sûre que si le service traite correctement un doublon. Côté messages, l'exigence est plus forte encore : la plupart des courtiers garantissent une livraison **au moins une fois**, donc recevoir un doublon n'est pas une hypothèse mais une certitude — après un redémarrage du consommateur ou la perte d'un accusé de réception. La meilleure idempotence s'obtient par la conception de l'interface, en formulant les opérations comme des états cibles plutôt que comme des deltas ; sinon, il faut une clé d'idempotence et une trace côté serveur.",
    keyPoints: [
      "L'absence de réponse est structurellement ambiguë",
      "Réessayer est préférable, mais suppose de gérer le doublon",
      "Les courtiers livrent au moins une fois : le doublon est certain",
      "État cible plutôt que delta ; sinon, clé d'idempotence",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Disjoncteur et cloisonnement
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "archi-app-l5",
  title: "Disjoncteur et cloisonnement",
  blocks: [
    {
      kind: "text",
      text: "Quand un service dont on dépend tombe, continuer à l'appeler est doublement néfaste : chaque tentative occupe un thread pendant tout le délai d'attente, et l'on ajoute de la charge à un système déjà en difficulté. Le disjoncteur automatise la décision d'arrêter d'essayer.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois états, et ce qui les fait changer.",
      code: `        échecs > seuil
FERMÉ ──────────────────► OUVERT
  ▲                          │
  │                          │ après un délai
  │  l'essai réussit         ▼
  └────────────── SEMI-OUVERT
                             │ l'essai échoue
                             └──► OUVERT

FERMÉ       tout passe, on compte les échecs
OUVERT      rien ne passe : échec IMMÉDIAT, sans
            attendre le délai. Le service en
            difficulté n'est plus sollicité.
SEMI-OUVERT on laisse passer quelques appels pour
            tester si le service est revenu.`,
    },
    {
      kind: "text",
      text: "L'état ouvert est le cœur du mécanisme : au lieu d'attendre deux secondes pour constater un échec, l'appel échoue instantanément. Les threads restent disponibles, l'application continue de répondre sur tout ce qui ne dépend pas du service en panne, et celui-ci obtient le répit dont il a besoin pour se rétablir.",
    },
    {
      kind: "text",
      text: "L'échec rapide change aussi l'expérience : l'utilisateur reçoit immédiatement un message clair plutôt qu'une page qui tourne pendant trente secondes avant d'échouer. Une réponse dégradée instantanée vaut presque toujours mieux qu'une réponse complète qui n'arrive jamais.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le disjoncteur avec son repli.",
      code: `var recommandations = circuitBreaker.executeSupplier(
        () -> api.recommandations(clientId));

// Et si le circuit est ouvert, ou si l'appel échoue :
.recover(e -> recommandationsParDefaut());

// Le repli doit être RÉELLEMENT dégradé :
//  · une liste générique plutôt que personnalisée
//  · une valeur en cache, même périmée
//  · un bloc absent, plutôt qu'une page en erreur
//
// Un repli qui appelle un autre service distant
// n'est pas un repli : il ajoute un point de panne.`,
    },
    {
      kind: "text",
      text: "Le repli est ce qui rend le disjoncteur utile plutôt que simplement rapide à échouer. Il doit être local et sans dépendance : une valeur par défaut, un contenu en cache même périmé, ou l'absence pure et simple du bloc concerné. Un repli qui appelle un autre service distant déplace le problème sans le résoudre.",
    },
    {
      kind: "comparison",
      title: "Deux protections complémentaires",
      left: {
        label: "Disjoncteur",
        text: "Protège contre un service **lent ou en panne** en cessant de l'appeler. Agit dans le temps : il ferme le robinet quand les échecs s'accumulent, et le rouvre prudemment. Ne limite pas la concurrence.",
      },
      right: {
        label: "Cloisonnement",
        text: "Protège contre la **contagion** en réservant des ressources séparées par dépendance. Agit dans l'espace : un pool de threads ou de connexions par service appelé, si bien qu'une dépendance saturée ne peut pas consommer tous les threads.",
      },
    },
    {
      kind: "text",
      text: "Le cloisonnement tire son nom des compartiments étanches d'un navire : une brèche inonde un compartiment, pas la coque entière. Appliqué à une application, il garantit qu'un service externe lent ne peut pas immobiliser plus que la part de threads qui lui est allouée — les autres fonctionnalités continuent de répondre normalement.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un disjoncteur sans repli n'apporte pas grand-chose",
      text: "Il transforme une attente longue en échec rapide, ce qui est déjà utile pour protéger les threads, mais l'utilisateur reçoit toujours une erreur. Toute la valeur est dans la dégradation : afficher la page sans le bloc de recommandations vaut infiniment mieux que de ne pas afficher la page. La question à poser sur chaque dépendance est : que fait-on quand elle est absente ?",
    },
    {
      kind: "text",
      text: "Le réglage du seuil demande un peu d'attention. Trop bas, le circuit s'ouvre sur des échecs normaux et prive l'application d'un service qui fonctionne ; trop haut, il ne s'ouvre jamais et ne sert à rien. On raisonne en **taux** sur une fenêtre glissante plutôt qu'en nombre absolu, avec un volume minimal d'appels pour éviter qu'un seul échec sur deux requêtes ne déclenche l'ouverture.",
    },
    {
      kind: "text",
      text: "Un dernier point pratique : l'état du disjoncteur doit être visible. Une métrique exposant les ouvertures et les fermetures permet de constater qu'une dépendance est régulièrement coupée — information précieuse, qui n'apparaît nulle part ailleurs puisque l'application continue de répondre normalement grâce au repli.",
    },
    {
      kind: "text",
      text: "Retenons le raisonnement : identifier les dépendances non critiques, leur prévoir un repli local, protéger chacune par un disjoncteur, et cloisonner les ressources pour qu'aucune ne puisse tout consommer. Ce travail se fait dépendance par dépendance, et il commence par la question la plus simple — de quoi peut-on se passer ?",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "order",
    id: "archi-app-13",
    difficulty: 2,
    tags: ["architecture", "resilience"],
    prompt: "Remets dans l'ordre le cycle d'un disjoncteur.",
    items: [
      "Fermé : tous les appels passent, les échecs sont comptés",
      "Le taux d'échec dépasse le seuil : le circuit s'ouvre",
      "Ouvert : les appels échouent immédiatement, sans solliciter le service",
      "Après un délai, semi-ouvert : quelques appels de test sont laissés passer",
      "Ces appels réussissent : le circuit se referme",
    ],
    explanation:
      "L'état ouvert est le cœur du mécanisme : l'échec immédiat libère les threads qui auraient attendu le délai complet, et donne au service en difficulté le répit nécessaire pour se rétablir. L'état semi-ouvert évite de rouvrir brutalement, ce qui replongerait le service dans la charge qui l'avait fait tomber.",
  },
  {
    kind: "mcq",
    id: "archi-app-14",
    difficulty: 2,
    tags: ["architecture", "resilience"],
    prompt: "Quelle différence entre un disjoncteur et un cloisonnement ?",
    choices: [
      "Le disjoncteur cesse d'appeler un service défaillant ; le cloisonnement réserve des ressources séparées par dépendance.",
      "Le disjoncteur agit côté client, le cloisonnement côté serveur.",
      "Le disjoncteur limite le nombre d'appels par seconde, le cloisonnement leur durée.",
      "Ce sont deux noms du même mécanisme, selon la bibliothèque utilisée.",
    ],
    answer: 0,
    explanation:
      "Le disjoncteur agit dans le temps : il ferme le robinet quand les échecs s'accumulent. Le cloisonnement agit dans l'espace : un pool de threads ou de connexions par dépendance, si bien qu'un service saturé ne peut pas consommer toutes les ressources de l'application. Les deux sont complémentaires et se posent sur les mêmes dépendances.",
  },
  {
    kind: "recall",
    id: "archi-app-15",
    difficulty: 2,
    tags: ["architecture", "resilience"],
    prompt: "Qu'est-ce qui fait la valeur d'un disjoncteur, au-delà de l'échec rapide ?",
    explanation:
      "Le **repli**. L'échec rapide protège déjà les threads — au lieu d'attendre deux secondes pour constater une panne, l'appel échoue instantanément, et l'application continue de répondre sur tout ce qui ne dépend pas du service concerné. Mais l'utilisateur reçoit toujours une erreur. Toute la valeur vient de ce qu'on affiche à la place : une liste générique plutôt que personnalisée, une valeur en cache même périmée, ou simplement l'absence du bloc concerné. Afficher la page sans les recommandations vaut infiniment mieux que de ne pas afficher la page. Ce repli doit être **local et sans dépendance** : s'il appelle un autre service distant, il ajoute un point de panne au lieu d'en retirer un. La question à poser sur chaque dépendance est donc la plus simple possible : de quoi peut-on se passer, et que montre-t-on alors ?",
    keyPoints: [
      "L'échec rapide protège les threads mais laisse une erreur",
      "La valeur est dans la dégradation : afficher moins plutôt que rien",
      "Le repli doit être local, sans appel distant",
      "Question de départ : de quoi peut-on se passer ?",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Le cache et ses risques
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "archi-app-l6",
  title: "Le cache et ses risques",
  blocks: [
    {
      kind: "text",
      text: "Un cache est la réponse la plus immédiate à un problème de latence, et celle qui se retourne le plus souvent contre son auteur. Il ne supprime pas un coût, il le masque ; il introduit une donnée potentiellement fausse ; et il déplace la difficulté vers l'invalidation, qui est réputée être un problème difficile pour de bonnes raisons.",
    },
    {
      kind: "text",
      text: "La première question à poser n'est donc pas « où mettre le cache » mais « peut-on rendre l'opération moins coûteuse ». Un index manquant, une requête N+1, un appel groupé qui n'existe pas : ces causes se corrigent, et leur correction ne crée aucun risque de donnée périmée. Le cache vient après, pas avant.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois niveaux, trois portées.",
      code: `NAVIGATEUR / CDN     le plus proche de l'utilisateur,
                     le moins coûteux, mais invalidation
                     difficile — la copie est chez lui

APPLICATION locale   très rapide, aucune infrastructure.
                     Mais N instances = N caches, avec
                     N versions possibles de la donnée

DISTRIBUÉ (Redis)    une seule vérité, invalidation
                     globale, survit au redémarrage.
                     Coût : un aller-retour réseau et
                     un composant à exploiter

→ Plus le cache est proche de l'utilisateur, plus il
  est efficace et moins il est contrôlable.`,
    },
    {
      kind: "text",
      text: "Le cache local en plusieurs instances est le piège le plus courant en production. Tout fonctionne en développement, où il n'y a qu'une instance ; en production, un utilisateur voit une valeur à jour puis, la requête suivante ayant atterri ailleurs, la valeur ancienne. Le symptôme — « ça change quand j'actualise » — est déroutant tant qu'on ne pense pas au cache.",
    },
    {
      kind: "comparison",
      title: "Deux façons de gérer la péremption",
      left: {
        label: "Expiration",
        text: "La donnée est valable pendant une durée fixée. Simple, prévisible, aucun mécanisme d'invalidation à écrire. En contrepartie, on sert une donnée périmée pendant au plus cette durée — ce qui est un choix métier, pas technique.",
      },
      right: {
        label: "Invalidation explicite",
        text: "On retire l'entrée quand la donnée change. Toujours à jour, mais il faut penser à tous les chemins d'écriture — et celui qu'on oublie produit une incohérence durable, bien plus difficile à diagnostiquer qu'une simple péremption.",
      },
    },
    {
      kind: "text",
      text: "L'expiration est très sous-estimée : elle est simple, prévisible, et sa contrepartie est explicite. Décider que les tarifs peuvent être périmés de cinq minutes est une décision métier qu'on peut poser clairement, alors qu'une invalidation manquée produit une incohérence que personne n'a choisie et que personne ne détecte.",
    },
    {
      kind: "text",
      text: "Deux modes de défaillance méritent d'être connus. L'**avalanche** survient quand de nombreuses entrées expirent au même instant : toutes les requêtes repartent simultanément vers la source, qui s'effondre. Y ajouter une part d'aléa dans les durées de vie suffit à étaler ces rechargements.",
    },
    {
      kind: "text",
      text: "La **ruée** est voisine : une seule clé très demandée expire, et cent requêtes simultanées déclenchent cent calculs identiques. La parade est de ne laisser qu'un seul appelant recalculer pendant que les autres attendent — ce que la plupart des bibliothèques de cache offrent en option, et qu'il suffit d'activer.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un cache sans limite est une fuite mémoire",
      text: "Une structure de cache sans taille maximale ni expiration grandit indéfiniment. Sur une clé à forte cardinalité — identifiant d'utilisateur, chaîne de recherche libre — c'est une saturation mémoire garantie, qui survient des semaines plus tard et paraît sans rapport. Toute mise en cache doit s'accompagner d'une borne, sans exception.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un cache borné, avec expiration et statistiques.",
      code: `Caffeine.newBuilder()
    .maximumSize(10_000)                      // borne dure
    .expireAfterWrite(Duration.ofMinutes(5))  // péremption
    .refreshAfterWrite(Duration.ofMinutes(4)) // rafraîchit
    .recordStats()                            // observable
    .build(this::charge);

// recordStats() donne le taux de succès du cache.
// Un cache dont personne ne mesure l'efficacité
// peut très bien ne servir à rien — et l'on ne
// le saura jamais.`,
    },
    {
      kind: "text",
      text: "Mesurer le taux de succès est l'étape que presque personne ne fait, alors qu'elle décide si le cache mérite d'exister. Un taux faible signale que la clé est trop fine ou la durée de vie trop courte : on paie alors la complexité et le risque d'incohérence sans obtenir le bénéfice recherché.",
    },
    {
      kind: "text",
      text: "Retenons l'ordre : corriger le coût réel d'abord, puis choisir une expiration acceptable pour le métier, borner la taille, ajouter de l'aléa contre l'avalanche, et n'envisager l'invalidation explicite que lorsque la péremption est réellement inacceptable.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-app-16",
    difficulty: 2,
    tags: ["architecture", "cache"],
    prompt: "Un utilisateur voit alternativement une valeur à jour et une valeur ancienne en actualisant. Quelle cause ?",
    choices: [
      "Un cache local à chaque instance : les requêtes atterrissent sur des instances aux caches divergents.",
      "Le navigateur conserve deux versions de la page en mémoire.",
      "La base de données réplique les écritures avec un retard variable.",
      "Le répartiteur de charge renvoie des réponses mises en cache par erreur.",
    ],
    answer: 0,
    explanation:
      "C'est le piège du cache local en plusieurs instances : tout fonctionne en développement où il n'y a qu'une instance, et l'invalidation émise par l'une n'atteint jamais les autres. La réplication de base est une cause possible mais bien plus rare, et elle ne produit pas cette alternance liée au routage.",
  },
  {
    kind: "spot",
    id: "archi-app-17",
    difficulty: 2,
    tags: ["architecture", "cache"],
    prompt: "Ce cache finira par saturer la mémoire. Quelle ligne ?",
    code: {
      language: "java",
      code: `@Service
class RechercheService {
    private final Map<String, List<Resultat>> cache =
            new ConcurrentHashMap<>();

    List<Resultat> cherche(String requeteLibre) {
        return cache.computeIfAbsent(requeteLibre, this::interroge);
    }
}`,
    },
    faultyLine: 3,
    reasons: [
      "Une structure sans taille maximale ni expiration, sur une clé à cardinalité illimitée : elle grandit indéfiniment.",
      "`ConcurrentHashMap` n'est pas adapté à un accès concurrent en lecture.",
      "`computeIfAbsent` ne garantit pas l'unicité du calcul en cas d'accès simultané.",
      "Le cache devrait être déclaré `static` pour être partagé entre instances.",
    ],
    reasonAnswer: 0,
    explanation:
      "La clé est une chaîne de recherche libre : sa cardinalité est illimitée, et rien ne retire jamais d'entrée. La saturation survient des semaines plus tard et paraît sans rapport avec ce code. Toute mise en cache doit s'accompagner d'une taille maximale et d'une expiration. `computeIfAbsent` garantit au contraire qu'un seul thread calcule par clé, ce qui est ici un point positif.",
  },
  {
    kind: "recall",
    id: "archi-app-18",
    difficulty: 3,
    tags: ["architecture", "cache"],
    prompt: "Qu'est-ce que l'avalanche de cache et la ruée sur une clé, et comment s'en prémunir ?",
    explanation:
      "L'**avalanche** survient quand de nombreuses entrées expirent au même instant — typiquement parce qu'elles ont été chargées ensemble au démarrage avec la même durée de vie. Toutes les requêtes repartent alors simultanément vers la source, qui reçoit d'un coup la charge que le cache absorbait et s'effondre. La parade est d'ajouter une part d'aléa aux durées de vie, ce qui étale naturellement les rechargements. La **ruée** est voisine mais concerne une seule clé très demandée : elle expire, et cent requêtes simultanées déclenchent cent calculs identiques de la même valeur. La parade est de ne laisser qu'un seul appelant recalculer pendant que les autres attendent son résultat — la plupart des bibliothèques de cache l'offrent en option, et il suffit de l'activer. Les deux défaillances ont en commun de ne survenir que sous charge réelle, donc de rester invisibles en développement.",
    keyPoints: [
      "Avalanche : beaucoup d'entrées expirent ensemble, la source s'effondre",
      "Parade : part d'aléa dans les durées de vie",
      "Ruée : une clé très demandée expire, N calculs identiques",
      "Parade : un seul recalcule, les autres attendent",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — La cohérence éventuelle
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "archi-app-l7",
  title: "La cohérence éventuelle",
  blocks: [
    {
      kind: "text",
      text: "Dès qu'une donnée existe à plusieurs endroits — deux services, un cache, une vue dénormalisée — elle n'est plus cohérente en permanence. Il existe des instants, courts mais réels, où deux lecteurs obtiennent deux réponses différentes. Ce n'est pas un défaut d'implémentation : c'est la conséquence directe de la distribution.",
    },
    {
      kind: "text",
      text: "Le théorème CAP formule le compromis : en cas de partition du réseau — et une partition finit toujours par arriver — il faut choisir entre rester cohérent, donc refuser de répondre, et rester disponible, donc répondre avec une donnée possiblement périmée. On ne peut pas avoir les deux, et le choix appartient au métier.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le même événement, vu de deux endroits.",
      code: `t=0     Commande validée dans le service Commandes
t=0     Événement CommandeValidee publié
t=0+ε   Le client recharge sa page « Mes commandes »
        → le service Lecture n'a pas encore consommé
        → la commande n'apparaît PAS
t=50ms  Le service Lecture consomme l'événement
t=51ms  La commande apparaît

→ 50 ms d'incohérence. Inacceptable ? Souvent non.
  Mais l'utilisateur qui recharge dans cet intervalle
  voit un système qui a « perdu » sa commande.`,
    },
    {
      kind: "text",
      text: "L'intervalle est court, et pourtant c'est exactement celui où l'utilisateur regarde — il vient de valider, il vérifie. C'est pourquoi la cohérence éventuelle n'est pas seulement une question technique : elle a des conséquences directes sur l'interface, qui doit être conçue en tenant compte de ce décalage.",
    },
    {
      kind: "comparison",
      title: "Deux façons de traiter l'attente",
      left: {
        label: "Masquer le décalage",
        text: "Afficher immédiatement le résultat attendu côté client, sans attendre la propagation. L'utilisateur voit sa commande tout de suite. Il faut prévoir le cas où la propagation échoue — sans quoi l'interface montre durablement quelque chose de faux.",
      },
      right: {
        label: "Assumer l'attente",
        text: "Afficher explicitement « en cours de traitement » et rafraîchir. Honnête, robuste, et cela prépare l'utilisateur à un délai. Moins fluide, mais aucun risque de montrer un état qui ne se réalisera jamais.",
      },
    },
    {
      kind: "text",
      text: "Le choix dépend de la probabilité d'échec et de la gravité d'un affichage faux. Pour une mise en favori, masquer le décalage est sans risque. Pour un paiement, afficher « en cours » est la seule option acceptable : montrer un succès puis le retirer est bien pire qu'une seconde d'attente honnête.",
    },
    {
      kind: "text",
      text: "Le motif de la **transaction sortante** résout le problème le plus délicat de l'asynchrone : écrire en base et publier un message ne peuvent pas être atomiques, puisque ce sont deux systèmes. Si l'on publie après avoir validé et que le processus s'arrête entre les deux, le message est perdu ; si l'on publie avant, il peut annoncer un fait qui n'a pas eu lieu.",
    },
    {
      kind: "text",
      text: "La solution consiste à écrire le message dans une **table** de la même base, dans la même transaction : l'atomicité est retrouvée. Un processus séparé lit ensuite cette table et publie réellement, en marquant ce qui est parti. Le message peut être publié deux fois si ce processus redémarre — d'où, une fois de plus, l'exigence d'idempotence côté consommateur.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Lire juste après avoir écrit",
      text: "Le piège le plus fréquent est de rediriger l'utilisateur vers une vue alimentée de façon asynchrone juste après son action : il arrive avant la propagation et voit un écran vide ou périmé. Soit on lit depuis la source pour ce cas précis, soit on affiche un état d'attente explicite. Rediriger sans y penser produit un bug intermittent, très difficile à reproduire.",
    },
    {
      kind: "code",
      language: "sql",
      caption: "La table de messages sortants.",
      code: `CREATE TABLE messages_sortants (
    id          uuid PRIMARY KEY,
    type        varchar(100) NOT NULL,
    charge      jsonb        NOT NULL,
    cree_le     timestamptz  NOT NULL DEFAULT now(),
    publie_le   timestamptz
);

-- Index partiel : seules les lignes non publiées
-- sont indexées, quelle que soit la taille de la table.
CREATE INDEX ON messages_sortants (cree_le)
    WHERE publie_le IS NULL;`,
    },
    {
      kind: "text",
      text: "L'index partiel est le détail qui rend ce motif viable dans la durée : sans lui, la recherche des messages non publiés parcourt une table qui grossit indéfiniment. Avec lui, elle ne regarde que la poignée de lignes en attente, quelle que soit l'ancienneté de la table — et il reste à purger régulièrement les lignes déjà publiées.",
    },
    {
      kind: "text",
      text: "Retenons que la cohérence éventuelle n'est pas un défaut mais un choix, qu'elle doit être décidée par le métier plutôt que subie, et qu'elle remonte jusqu'à l'interface. Le travail technique — transaction sortante, idempotence — ne sert qu'à garantir le « éventuellement ».",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "order",
    id: "archi-app-19",
    difficulty: 3,
    tags: ["architecture", "coherence"],
    prompt: "Remets dans l'ordre le motif de la transaction sortante.",
    items: [
      "Dans une même transaction : écrire la donnée métier et insérer le message dans une table dédiée",
      "La transaction est validée : les deux sont enregistrés ou aucun",
      "Un processus séparé lit les messages non encore publiés",
      "Il publie chaque message sur le courtier, puis le marque comme envoyé",
      "Le consommateur traite le message, en tolérant un doublon",
    ],
    explanation:
      "Écrire en base et publier un message ne peuvent pas être atomiques puisque ce sont deux systèmes : publier après validation risque de perdre le message si le processus s'arrête, publier avant risque d'annoncer un fait qui n'a pas eu lieu. Passer par une table de la même base retrouve l'atomicité — au prix d'une publication possiblement double, d'où l'idempotence.",
  },
  {
    kind: "mcq",
    id: "archi-app-20",
    difficulty: 2,
    tags: ["architecture", "coherence"],
    prompt: "Un utilisateur valide une commande et est redirigé vers une liste alimentée de façon asynchrone. Que voit-il ?",
    choices: [
      "Potentiellement une liste sans sa commande : il arrive avant la propagation de l'événement.",
      "Toujours sa commande : la redirection attend la fin de la propagation.",
      "Une erreur, la vue refusant de répondre tant qu'elle n'est pas à jour.",
      "Sa commande avec un statut « en attente », affiché automatiquement.",
    ],
    answer: 0,
    explanation:
      "C'est le piège le plus fréquent de la cohérence éventuelle : l'intervalle est court, mais c'est exactement celui où l'utilisateur regarde — il vient d'agir et vérifie. Il faut soit lire depuis la source pour ce cas précis, soit afficher un état d'attente explicite. Rediriger sans y penser produit un bug intermittent, très difficile à reproduire.",
  },
  {
    kind: "fill",
    id: "archi-app-21",
    difficulty: 2,
    tags: ["architecture", "coherence"],
    prompt: "Complète l'énoncé du compromis en cas de partition réseau.",
    code: {
      language: "text",
      code: `En cas de partition du reseau, il faut choisir :

· rester {{1}} : refuser de repondre plutot que
  de renvoyer une donnee possiblement fausse

· rester {{2}} : repondre malgre tout, avec une
  donnee possiblement perimee`,
    },
    blanks: ["cohérent", "disponible"],
    distractors: ["rapide", "atomique", "durable"],
    explanation:
      "C'est l'énoncé du compromis formulé par le théorème CAP. Une partition finit toujours par arriver, donc le choix n'est pas théorique : il appartient au métier. Refuser une réponse est acceptable pour un solde bancaire, beaucoup moins pour un catalogue de produits où servir une donnée vieille de dix secondes ne gêne personne.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Observabilité
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "archi-app-l8",
  title: "Observabilité",
  blocks: [
    {
      kind: "text",
      text: "Dans une application unique, diagnostiquer consiste à lire une pile d'appel. Réparti sur six services, ce réflexe ne fonctionne plus : la requête a traversé plusieurs processus, sur plusieurs machines, et aucune trace unique ne relie les morceaux. L'observabilité est ce qui remplace la pile d'appel.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois signaux, trois questions.",
      code: `MÉTRIQUES   « Est-ce que ça va ? »
            Agrégées, peu coûteuses, conservées
            longtemps. Taux d'erreur, latence,
            débit, saturation. Servent aux alertes.

TRACES      « Où est passé le temps ? »
            Le trajet d'UNE requête à travers les
            services, avec la durée de chaque étape.
            Échantillonnées, car volumineuses.

JOURNAUX    « Que s'est-il passé précisément ? »
            Le détail d'un événement. Volumineux,
            coûteux à conserver, mais indispensables
            une fois le coupable identifié.

→ On les utilise dans cet ordre : l'alerte vient
  d'une métrique, la trace désigne le service, le
  journal donne le détail.`,
    },
    {
      kind: "text",
      text: "Cet ordre d'utilisation est ce qui rend l'ensemble exploitable. Une alerte fondée sur une métrique signale qu'un problème existe ; une trace montre lequel des six services consomme le temps ou échoue ; les journaux de ce service, filtrés sur l'identifiant de la requête, donnent le détail. Chercher directement dans les journaux revient à parcourir des millions de lignes sans savoir lesquelles regarder.",
    },
    {
      kind: "text",
      text: "L'identifiant de corrélation est le fil qui relie les trois. Généré à l'entrée, transmis en en-tête à chaque appel, replacé dans le contexte de journalisation de chaque service, il permet de retrouver toutes les lignes d'une même requête à travers l'ensemble du système. Sans lui, il faut recouper des horodatages à la main — ce qui devient impossible dès que le trafic monte.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'alerter",
      left: {
        label: "Sur une cause",
        text: "« Le processeur dépasse 80 % », « le nombre de threads augmente ». Se déclenche souvent sans que personne ne soit gêné, et finit par être ignoré. Beaucoup d'alertes de ce type produisent une fatigue qui masque les vraies.",
      },
      right: {
        label: "Sur un symptôme",
        text: "« Le taux d'erreur dépasse 1 % », « le percentile 99 dépasse deux secondes ». Correspond à quelque chose que l'utilisateur subit. Moins nombreuses, plus fiables, et chacune justifie qu'on se lève la nuit.",
      },
    },
    {
      kind: "text",
      text: "Alerter sur les symptômes plutôt que sur les causes est le principe qui rend une astreinte tenable. Une charge processeur élevée n'est un problème que si elle dégrade le service ; si ce n'est pas le cas, l'alerte réveille quelqu'un pour rien, et la fois suivante elle sera ignorée — y compris le jour où elle indiquait quelque chose.",
    },
    {
      kind: "text",
      text: "Sur les latences, la moyenne est presque toujours trompeuse. Si quatre-vingt-dix-neuf requêtes répondent en dix millisecondes et une en dix secondes, la moyenne reste excellente alors qu'un utilisateur sur cent subit une attente inacceptable. Les percentiles — médiane, 95, 99 — décrivent ce que les gens vivent réellement, et c'est sur eux qu'on alerte.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "L'observabilité s'installe avant l'incident",
      text: "Ajouter des traces pendant une panne est impossible : il faudrait redéployer, ce qui efface l'état qu'on voulait observer. Les trois signaux, l'identifiant de corrélation et les tableaux de bord doivent exister avant d'en avoir besoin. C'est un investissement qu'on regrette rarement, et son absence se paie toujours au pire moment.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Propager le contexte, de service en service.",
      code: `// À l'entrée : reprendre l'identifiant, ou en créer un
String traceId = Optional.ofNullable(req.getHeader("traceparent"))
        .orElseGet(() -> UUID.randomUUID().toString());
MDC.put("traceId", traceId);

// À la sortie : le transmettre au service suivant
var reponse = client.get()
        .uri("/stocks/{ref}", ref)
        .header("traceparent", traceId)
        .retrieve();

// Chaque service fait de même : l'identifiant
// traverse la chaîne et relie les journaux des
// six services concernés.`,
    },
    {
      kind: "text",
      text: "En pratique, les bibliothèques d'instrumentation font ce travail automatiquement dès qu'elles sont branchées — propagation des en-têtes, création des segments, corrélation avec les journaux. Comprendre le mécanisme reste utile, car c'est ce qui permet de diagnostiquer le jour où la propagation se casse quelque part, ce qui arrive typiquement sur un appel asynchrone.",
    },
    {
      kind: "text",
      text: "Retenons la chaîne : métriques pour savoir qu'il y a un problème, traces pour savoir où, journaux pour savoir quoi, et un identifiant de corrélation pour relier les trois. C'est ce qui remplace la pile d'appel qu'on perd en distribuant — et sans quoi la distribution devient très difficile à exploiter.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "match",
    id: "archi-app-22",
    difficulty: 2,
    tags: ["architecture", "observabilite"],
    prompt: "Associe chaque signal à la question à laquelle il répond.",
    pairs: [
      { left: "Métriques", right: "Est-ce que ça va ? Taux d'erreur, latence, débit" },
      { left: "Traces", right: "Où est passé le temps, à travers quels services ?" },
      { left: "Journaux", right: "Que s'est-il passé précisément sur cette requête ?" },
      { left: "Identifiant de corrélation", right: "Le fil qui relie les trois pour une même requête" },
    ],
    explanation:
      "L'ordre d'utilisation compte autant que les signaux eux-mêmes : l'alerte vient d'une métrique, la trace désigne le service en cause, le journal donne le détail. Chercher directement dans les journaux revient à parcourir des millions de lignes sans savoir lesquelles regarder.",
  },
  {
    kind: "mcq",
    id: "archi-app-23",
    difficulty: 2,
    tags: ["architecture", "observabilite"],
    prompt: "Pourquoi alerter sur la latence médiane est-il insuffisant ?",
    choices: [
      "Une minorité de requêtes très lentes n'apparaît pas : il faut regarder les percentiles hauts.",
      "La médiane n'est calculable que sur des échantillons de plus de mille requêtes.",
      "La médiane varie trop pour servir de base à une alerte.",
      "Les percentiles hauts sont moins coûteux à calculer que la médiane.",
    ],
    answer: 0,
    explanation:
      "Si quatre-vingt-dix-neuf requêtes répondent en dix millisecondes et une en dix secondes, la médiane comme la moyenne restent excellentes alors qu'un utilisateur sur cent subit une attente inacceptable. Les percentiles 95 et 99 décrivent ce que les gens vivent réellement, et c'est sur eux qu'on alerte.",
  },
  {
    kind: "fill",
    id: "archi-app-24",
    difficulty: 2,
    tags: ["architecture", "observabilite"],
    prompt: "Complète le principe d'alerte et le mécanisme de corrélation.",
    code: {
      language: "text",
      code: `Alerter sur les {{1}} plutot que sur les causes :
« le taux d'erreur depasse 1 % » plutot que
« le processeur depasse 80 % ».

L'{{2}} de correlation, genere a l'entree et
transmis en en-tete, relie toutes les lignes d'une
meme requete a travers les services.`,
    },
    blanks: ["symptômes", "identifiant"],
    distractors: ["seuils", "moyennes", "jeton", "horodatage"],
    explanation:
      "Une charge processeur élevée n'est un problème que si elle dégrade le service : alerter dessus réveille quelqu'un pour rien, et la fois suivante l'alerte sera ignorée — y compris quand elle signalait quelque chose. L'identifiant de corrélation est ce qui remplace la pile d'appel perdue en distribuant : sans lui, il faut recouper des horodatages à la main.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "archi-applicative",
  title: "Architecture applicative : distribuer sans se piéger",
  objective:
    "Raisonner sur un système distribué : distinguer découpage et déploiement, mesurer ce que coûte le réseau, choisir entre synchrone et asynchrone, rendre les opérations rejouables, isoler les pannes par disjoncteur et cloisonnement, poser un cache sans créer d'incohérence, assumer la cohérence éventuelle jusque dans l'interface, et observer ce qu'on ne peut plus déboguer par une pile d'appel.",
  prerequisites: ["spring-rest"],
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
