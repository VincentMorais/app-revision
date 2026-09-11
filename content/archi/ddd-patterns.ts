/**
 * Architecture — DDD tactique et patterns (référentiel 4.3).
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Le langage partagé
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l1",
  title: "Le langage partagé",
  blocks: [
    {
      kind: "text",
      text: "Dans la plupart des projets, deux vocabulaires coexistent sans que personne ne s'en aperçoive. Le métier parle de « dossier », de « prise en charge », de « refus » ; le code manipule des `RequestEntity`, des `statusFlag` et des `processData`. Chaque conversation exige alors une traduction mentale, et chaque traduction est une occasion de se tromper.",
    },
    {
      kind: "text",
      text: "Le coût de cet écart est invisible mais permanent. Un développeur qui lit une spécification doit deviner à quelle classe correspond quel terme. Un expert métier qui relit un comportement ne reconnaît rien. Et quand un désaccord apparaît, il faut d'abord établir de quoi l'on parle avant de pouvoir en discuter — ce qui prend souvent plus de temps que le désaccord lui-même.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même domaine, deux vocabulaires.",
      code: `// Le code parle une langue que le métier ne reconnaît pas
class RequestManager {
    void processRequest(RequestData d, int statusCode) {
        if (d.getFlag() == 2) { … }
    }
}

// Le code parle la langue du métier
class Dossier {
    void prendEnCharge(Gestionnaire g) {
        if (statut != Statut.DEPOSE) {
            throw new DossierDejaTraite(numero);
        }
        …
    }
}
// Un expert métier peut lire la seconde version et
// dire si elle est juste. C'est tout l'objectif.`,
    },
    {
      kind: "text",
      text: "Le langage partagé consiste à utiliser **exactement les mêmes mots** dans les conversations, les spécifications et le code. Pas une traduction proche, les mêmes mots. Si le métier dit « prendre en charge », la méthode s'appelle `prendEnCharge` — et si l'on découvre en codant que ce terme recouvre deux opérations distinctes, c'est une découverte métier qu'il faut remonter, pas un détail d'implémentation à trancher seul.",
    },
    {
      kind: "text",
      text: "Ce dernier point est le plus important et le moins évident : la difficulté à nommer une chose dans le code signale presque toujours un flou dans le métier. Quand deux développeurs hésitent entre `annuler` et `supprimer`, c'est que personne n'a établi si les deux notions diffèrent — et la réponse appartient au métier, pas à l'équipe technique.",
    },
    {
      kind: "comparison",
      title: "Deux façons de traiter une ambiguïté",
      left: {
        label: "La trancher seul",
        text: "On choisit un nom, on avance. Le code fige une interprétation que personne n'a validée, et l'écart se découvre des mois plus tard, quand un comportement ne correspond pas à ce que le métier attendait sans l'avoir jamais dit.",
      },
      right: {
        label: "La remonter",
        text: "On pose la question : ces deux mots désignent-ils la même chose ? La réponse clarifie le métier pour tout le monde, et le code en hérite. C'est le mécanisme par lequel écrire du code améliore la compréhension du domaine.",
      },
    },
    {
      kind: "text",
      text: "Un domaine se découpe en **contextes**, et un même mot peut y avoir des sens différents. Un « client » pour la facturation est une entité juridique avec une adresse et un numéro de TVA ; pour le service après-vente, c'est une personne avec un historique de contacts. Vouloir une seule classe `Client` pour les deux produit un objet qui ne satisfait ni l'un ni l'autre.",
    },
    {
      kind: "text",
      text: "Reconnaître ces frontières est plus utile que de chercher le modèle universel. Deux contextes peuvent avoir chacun leur représentation, reliées par un identifiant partagé et une traduction explicite. C'est ce qui permet à chaque partie du système de parler la langue de son propre métier, sans compromis boiteux.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le test de lecture à voix haute",
      text: "Lire une méthode du domaine à voix haute devant quelqu'un du métier est le meilleur contrôle qui soit. S'il comprend et peut dire « oui, sauf que dans ce cas-là on fait autrement », le langage est partagé. S'il faut lui expliquer ce que signifie chaque nom avant qu'il ne puisse réagir, le code parle encore une autre langue.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le même mot, deux contextes, deux modèles.",
      code: `CONTEXTE FACTURATION        CONTEXTE SERVICE APRÈS-VENTE

Client                      Client
 · raison sociale            · prénom, nom
 · numéro de TVA             · historique de contacts
 · adresse de facturation    · préférence de rappel
 · conditions de paiement    · niveau de satisfaction

→ Reliés par un identifiant partagé, traduits
  explicitement à la frontière. Une seule classe
  « Client » pour les deux accumulerait des champs
  vides de part et d'autre, et chaque modification
  risquerait de casser l'usage d'en face.`,
    },
    {
      kind: "text",
      text: "Retenons que le langage partagé n'est pas une convention de nommage mais un outil de conception. Il rend les désaccords visibles tôt, transforme une hésitation de nommage en question métier, et permet à ceux qui connaissent le domaine de relire ce qui a été écrit — ce qu'aucune documentation séparée ne permet durablement.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-ddd-01",
    difficulty: 2,
    tags: ["ddd", "conception"],
    prompt: "Deux développeurs hésitent entre `annuler` et `supprimer` pour nommer une opération. Que révèle cette hésitation ?",
    choices: [
      "Un flou dans le métier : personne n'a établi si les deux notions diffèrent, et la réponse lui appartient.",
      "Un défaut de convention de nommage dans l'équipe technique.",
      "Un besoin de renommer la classe qui porte l'opération.",
      "Une mauvaise traduction du terme anglais d'origine.",
    ],
    answer: 0,
    explanation:
      "La difficulté à nommer signale presque toujours une ambiguïté du domaine, pas un problème de style. Trancher seul fige une interprétation que personne n'a validée, et l'écart se découvre des mois plus tard. Remonter la question clarifie le métier pour tout le monde — c'est le mécanisme par lequel écrire du code améliore la compréhension du domaine.",
  },
  {
    kind: "match",
    id: "archi-ddd-02",
    difficulty: 2,
    tags: ["ddd", "conception"],
    prompt: "Associe chaque situation à ce qu'elle indique.",
    pairs: [
      { left: "Le code dit processRequest, le métier dit « prendre en charge »", right: "Deux vocabulaires : chaque échange exige une traduction" },
      { left: "« Client » n'a pas le même sens en facturation et au SAV", right: "Deux contextes distincts, chacun avec sa représentation" },
      { left: "Un expert métier ne reconnaît rien en lisant une méthode", right: "Le langage n'est pas partagé" },
      { left: "Une hésitation persistante sur un nom", right: "Une question métier non tranchée" },
    ],
    explanation:
      "Reconnaître les frontières de contexte est plus utile que de chercher un modèle universel : vouloir une seule classe `Client` pour la facturation et le service après-vente produit un objet qui ne satisfait ni l'un ni l'autre. Deux représentations reliées par un identifiant partagé valent mieux qu'un compromis boiteux.",
  },
  {
    kind: "recall",
    id: "archi-ddd-03",
    difficulty: 2,
    tags: ["ddd", "conception"],
    prompt: "En quoi le langage partagé est-il un outil de conception et pas une convention de nommage ?",
    explanation:
      "Parce qu'il transforme les difficultés d'écriture en informations sur le domaine. Une hésitation entre deux noms révèle une notion métier non tranchée ; un terme qui recouvre visiblement deux opérations distinctes révèle une distinction que personne n'avait formulée ; un mot dont le sens change selon la partie du système révèle une frontière de contexte. Chacune de ces découvertes se fait en codant et doit être remontée, parce que la réponse appartient au métier. Le bénéfice pratique est qu'un expert peut **relire** une méthode du domaine et dire si elle est juste — ce qu'aucune documentation séparée ne permet durablement, puisqu'elle diverge du code dès la première semaine. Le contrôle le plus simple est la lecture à voix haute : si l'interlocuteur métier peut réagir sans qu'on lui traduise d'abord chaque nom, le langage est effectivement partagé.",
    keyPoints: [
      "Une hésitation de nommage révèle un flou métier",
      "Un mot à double sens révèle une frontière de contexte",
      "Ces découvertes se remontent : la réponse appartient au métier",
      "Contrôle : un expert peut relire une méthode et la corriger",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Entité et objet-valeur
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l2",
  title: "Entité et objet-valeur",
  blocks: [
    {
      kind: "text",
      text: "La première distinction du modèle tactique porte sur l'identité. Certains objets sont **eux-mêmes** — un client reste le même client s'il déménage — tandis que d'autres ne sont que leur contenu : une adresse dont on change une lettre est une autre adresse, pas la même modifiée.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux natures, deux traitements.",
      code: `// ENTITÉ : identité propre, état qui évolue
class Client {
    private final ClientId id;        // l'identité
    private Adresse adresse;          // peut changer

    void demenage(Adresse nouvelle) { this.adresse = nouvelle; }

    // Égalité par identifiant, JAMAIS par contenu :
    // deux homonymes ne sont pas le même client.
    public boolean equals(Object o) {
        return o instanceof Client c && id.equals(c.id);
    }
}

// OBJET-VALEUR : pas d'identité, immuable
record Adresse(String rue, CodePostal cp, String ville) {
    Adresse { Objects.requireNonNull(rue); }
}
// Deux adresses identiques SONT la même adresse.`,
    },
    {
      kind: "text",
      text: "Le critère pratique est une question : si deux instances ont exactement le même contenu, sont-elles la même chose ? Pour une adresse, un montant, une période, une couleur — oui. Pour un client, une commande, un dossier — non, et c'est précisément pourquoi ils portent un identifiant. Cette question tranche presque tous les cas en quelques secondes.",
    },
    {
      kind: "text",
      text: "Les objets-valeurs sont massivement sous-utilisés, et c'est dommage car ils apportent beaucoup pour très peu. Ils sont immuables, donc partageables sans précaution ; ils portent leur propre validation, donc ne peuvent pas exister dans un état incohérent ; et ils remplacent des types primitifs anonymes par des noms du domaine.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce que les primitifs laissent passer.",
      code: `// Signature en primitifs : rien n'empêche l'erreur
void transfere(String de, String vers, BigDecimal montant,
               String devise) { … }

transfere(compteB, compteA, montant, "EUR");  // inversé !
// Compile, s'exécute, vire l'argent dans le mauvais sens.

// Avec des objets-valeurs :
void transfere(NumeroCompte de, NumeroCompte vers,
               Montant montant) { … }

record Montant(BigDecimal valeur, Devise devise) {
    Montant {
        if (valeur.signum() < 0)
            throw new MontantNegatif(valeur);
    }
    Montant plus(Montant autre) {
        if (!devise.equals(autre.devise))
            throw new DevisesIncompatibles(devise, autre.devise);
        return new Montant(valeur.add(autre.valeur), devise);
    }
}`,
    },
    {
      kind: "text",
      text: "L'inversion de deux paramètres du même type est l'un des bugs les plus courants et les plus difficiles à repérer en relecture : la ligne a l'air correcte. Des types distincts la rendent impossible — le compilateur refuse. C'est le genre de protection qui ne coûte qu'une déclaration de `record` et qui supprime définitivement une classe d'erreurs.",
    },
    {
      kind: "comparison",
      title: "Deux façons de porter une règle",
      left: {
        label: "Dans le service",
        text: "`if (montant.signum() < 0) throw …` au début de chaque méthode qui reçoit un montant. La règle est dupliquée autant de fois qu'il y a de points d'entrée, et il suffit d'en oublier un pour qu'un montant négatif circule.",
      },
      right: {
        label: "Dans l'objet-valeur",
        text: "La vérification est dans le constructeur compact. Un `Montant` négatif ne peut pas exister, nulle part, jamais. La règle est écrite une fois et s'applique à tous les chemins, y compris ceux qu'on écrira dans six mois.",
      },
    },
    {
      kind: "text",
      text: "C'est le bénéfice décisif : une règle portée par le type devient impossible à contourner. On passe d'un code défensif — vérifier partout, espérer n'avoir rien oublié — à un code où l'état invalide est **irreprésentable**. Le raisonnement change de nature : au lieu de se demander si toutes les vérifications sont en place, on constate que l'objet existe, donc qu'il est valide.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "L'obsession des primitifs",
      text: "Représenter un identifiant, un courriel, un code postal et un numéro de téléphone par des `String` revient à dire que ce sont la même chose. Rien n'empêche de passer l'un pour l'autre, aucune validation ne s'applique, et le sens se perd dans les signatures. C'est un symptôme si répandu qu'il porte un nom — et le remède tient en une ligne par concept.",
    },
    {
      kind: "text",
      text: "Un détail de persistance mérite d'être anticipé : un objet-valeur n'a pas de table à lui. Il est rangé dans les colonnes de l'entité qui le contient — un `Montant` devient deux colonnes, valeur et devise — ce que JPA exprime par un type intégré. Confondre objet-valeur et entité de persistance conduit à créer des tables inutiles, avec des identifiants techniques qui ne correspondent à rien dans le domaine.",
    },
    {
      kind: "text",
      text: "Retenons le critère et son effet : l'identité distingue l'entité de l'objet-valeur, et les objets-valeurs sont l'outil le moins cher pour rendre un domaine sûr. Une poignée de `record` bien nommés supprime des catégories entières d'erreurs et rend les signatures lisibles sans commentaire.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-ddd-04",
    difficulty: 1,
    tags: ["ddd", "conception"],
    prompt: "Quelle question distingue une entité d'un objet-valeur ?",
    choices: [
      "Si deux instances ont exactement le même contenu, sont-elles la même chose ?",
      "Cet objet est-il stocké en base de données ?",
      "Cet objet contient-il plus de trois champs ?",
      "Cet objet est-il utilisé par plusieurs services ?",
    ],
    answer: 0,
    explanation:
      "Pour une adresse, un montant ou une période, deux contenus identiques désignent la même chose : ce sont des objets-valeurs, immuables et comparés par contenu. Pour un client ou une commande, non — deux homonymes ne sont pas le même client — d'où un identifiant propre et une égalité fondée sur lui. Le stockage et la taille n'entrent pas dans le critère.",
  },
  {
    kind: "spot",
    id: "archi-ddd-05",
    difficulty: 2,
    tags: ["ddd", "conception"],
    prompt: "Cette signature autorise un bug indétectable en relecture. Quelle ligne ?",
    code: {
      language: "java",
      code: `class Virement {
    void transfere(String compteDebite,
                   String compteCredite,
                   BigDecimal montant) {
        …
    }
}`,
    },
    faultyLine: 2,
    reasons: [
      "Deux paramètres du même type se suivent : les inverser compile et s'exécute sans erreur.",
      "`BigDecimal` ne convient pas pour un montant monétaire.",
      "La méthode devrait être `static` pour être testable isolément.",
      "Le nom `transfere` est trop générique pour une classe `Virement`.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'inversion de deux paramètres de même type est l'un des bugs les plus courants et les plus difficiles à repérer : la ligne d'appel a l'air correcte. Des objets-valeurs distincts la rendent impossible — le compilateur refuse `transfere(credite, debite, …)` si les types diffèrent. `BigDecimal` est au contraire le bon choix pour de la monnaie, mais gagnerait à être enveloppé dans un `Montant` portant la devise.",
  },
  {
    kind: "recall",
    id: "archi-ddd-06",
    difficulty: 2,
    tags: ["ddd", "conception"],
    prompt: "Qu'apporte un objet-valeur par rapport à un type primitif ?",
    explanation:
      "Trois choses qui se cumulent. Un **nom du domaine** : une signature qui prend un `NumeroCompte` et un `Montant` se lit sans commentaire, là où trois `String` et un `BigDecimal` n'apprennent rien. Une **validation portée par le type** : la vérification vit dans le constructeur, donc un montant négatif ne peut exister nulle part, jamais, alors que la même règle placée dans un service doit être répétée à chaque point d'entrée et qu'il suffit d'en oublier un. Et une **protection contre les confusions** : deux paramètres de types distincts ne peuvent plus être inversés, le compilateur refusant l'appel — ce qui supprime une classe d'erreurs indétectables en relecture. Le changement de nature est là : on passe d'un code défensif, où l'on espère n'avoir oublié aucune vérification, à un code où l'état invalide est irreprésentable, et où l'existence de l'objet suffit à prouver sa validité.",
    keyPoints: [
      "Un nom du domaine dans les signatures",
      "La validation dans le constructeur : impossible de la contourner",
      "Des types distincts empêchent l'inversion de paramètres",
      "L'état invalide devient irreprésentable, pas seulement vérifié",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — L'agrégat et sa frontière
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l3",
  title: "L'agrégat et sa frontière",
  blocks: [
    {
      kind: "text",
      text: "Certaines règles portent sur plusieurs objets à la fois : « le total d'une commande est la somme de ses lignes », « une commande expédiée ne peut plus être modifiée ». Si n'importe qui peut manipuler une ligne directement, ces règles deviennent impossibles à garantir — quelqu'un finira par en modifier une sans passer par la commande.",
    },
    {
      kind: "text",
      text: "L'agrégat répond à cela en désignant une **frontière de cohérence** : un groupe d'objets qu'on ne modifie que par un point d'entrée unique, la racine. Toute modification passe par elle, donc toute modification peut être vérifiée. Ce n'est pas une hiérarchie de classes, c'est une règle d'accès.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La racine est le seul point d'entrée.",
      code: `class Commande {                       // RACINE
    private final CommandeId id;
    private final List<Ligne> lignes;  // interne
    private Statut statut;

    // Les invariants sont vérifiés ICI, à chaque fois
    void ajoute(Article a, int quantite) {
        if (statut != Statut.BROUILLON)
            throw new CommandeNonModifiable(id);
        if (lignes.size() >= 50)
            throw new TropDeLignes(id);
        lignes.add(new Ligne(a, quantite));
    }

    // On expose une VUE, jamais la collection interne
    List<Ligne> lignes() { return List.copyOf(lignes); }

    Montant total() {
        return lignes.stream().map(Ligne::sousTotal)
                     .reduce(Montant.ZERO, Montant::plus);
    }
}`,
    },
    {
      kind: "text",
      text: "Le détail qui fait toute la différence est la copie défensive au retour. Exposer la liste interne permet à l'appelant d'y ajouter une ligne sans passer par `ajoute`, ce qui contourne silencieusement toutes les vérifications. La règle est absolue : un agrégat n'expose jamais une collection modifiable de son état interne.",
    },
    {
      kind: "comparison",
      title: "Deux façons de relier deux agrégats",
      left: {
        label: "Par référence directe",
        text: "`Commande` détient un objet `Client` complet. Commode à l'écriture, mais on charge un client entier pour afficher une commande, et rien n'empêche de le modifier depuis la commande — deux frontières de cohérence se mélangent.",
      },
      right: {
        label: "Par identifiant",
        text: "`Commande` détient un `ClientId`. La frontière reste nette, le chargement reste borné, et une transaction ne touche qu'un agrégat. C'est la règle par défaut, y compris quand elle paraît moins pratique.",
      },
    },
    {
      kind: "text",
      text: "La règle « un agrégat par transaction » découle directement de cette frontière. Modifier deux agrégats dans la même transaction les couple et transforme deux petites transactions en une grosse, avec les verrous correspondants. Quand une opération semble l'exiger, c'est souvent le signe que la frontière est mal placée — ou qu'il faut un événement plutôt qu'une écriture directe.",
    },
    {
      kind: "text",
      text: "La taille de l'agrégat est la décision la plus délicate. Trop gros, il devient un verrou : deux utilisateurs modifiant deux lignes différentes d'une même commande entrent en conflit. Trop petit, les règles qui portent sur plusieurs objets n'ont plus d'endroit où vivre, et l'on retombe sur de la validation dispersée dans les services.",
    },
    {
      kind: "text",
      text: "Le critère qui guide est l'**invariant** : ce qui doit rester vrai après chaque opération détermine la frontière. Si le total doit toujours égaler la somme des lignes, lignes et total sont dans le même agrégat. Si le stock peut être décrémenté indépendamment, il est ailleurs. On part des règles, jamais du schéma de base de données.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "L'agrégat n'est pas la table",
      text: "Calquer les agrégats sur les tables produit des agrégats gigantesques, reliés par des clés étrangères dans tous les sens, où plus aucune frontière n'est visible. Le modèle de persistance et le modèle de domaine répondent à des questions différentes — la normalisation d'un côté, la cohérence de l'autre — et rien n'oblige à les faire coïncider.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La cohérence entre agrégats : éventuelle, pas immédiate.",
      code: `// Une commande validée doit décrémenter le stock.
// Deux agrégats : on ne les modifie PAS ensemble.

@Transactional
void valider(NumeroCommande numero) {
    var commande = commandes.parNumero(numero).orElseThrow();
    commande.valide();                    // agrégat 1
    commandes.enregistre(commande);
    evenements.publie(new CommandeValidee(numero));
}

// Ailleurs, après validation de la transaction :
@TransactionalEventListener(phase = AFTER_COMMIT)
void surCommandeValidee(CommandeValidee e) {
    stocks.reserve(e.articles());         // agrégat 2
}
// Les deux ne sont pas cohérents à l'instant T,
// mais le deviennent. C'est un choix assumé.`,
    },
    {
      kind: "text",
      text: "Accepter la cohérence éventuelle entre agrégats est souvent la partie la plus difficile à admettre. Elle impose de se demander ce qui se passe si le second traitement échoue — d'où les mécanismes de reprise et l'importance de l'idempotence. En échange, chaque transaction reste courte et les agrégats ne se verrouillent pas mutuellement.",
    },
    {
      kind: "text",
      text: "Retenons la définition utile : un agrégat est une frontière de cohérence, avec une racine qui en est le seul point d'entrée, une taille dictée par les invariants, et des liens vers l'extérieur par identifiant. Ces quatre points suffisent à éviter les erreurs les plus courantes.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-ddd-07",
    difficulty: 2,
    tags: ["ddd", "agregat"],
    prompt: "Qu'est-ce qui détermine la taille d'un agrégat ?",
    choices: [
      "Les invariants : ce qui doit rester vrai après chaque opération définit la frontière.",
      "Le schéma de la base : un agrégat correspond à une table et à ses tables filles.",
      "Le nombre de champs : au-delà d'une dizaine, il faut découper.",
      "Les besoins d'affichage de l'interface utilisateur.",
    ],
    answer: 0,
    explanation:
      "Si le total doit toujours égaler la somme des lignes, lignes et total appartiennent au même agrégat. Si le stock peut être décrémenté indépendamment, il est ailleurs. Calquer les agrégats sur les tables produit des ensembles gigantesques où plus aucune frontière n'est visible — persistance et domaine répondent à des questions différentes.",
  },
  {
    kind: "order",
    id: "archi-ddd-08",
    difficulty: 2,
    tags: ["ddd", "agregat"],
    prompt: "Remets dans l'ordre la démarche pour délimiter un agrégat.",
    items: [
      "Lister les règles qui doivent rester vraies après chaque opération",
      "Regrouper les objets qu'une même règle relie",
      "Désigner la racine : le seul point d'entrée pour toute modification",
      "Relier les autres agrégats par identifiant, jamais par référence directe",
      "Vérifier qu'une transaction ne modifie qu'un seul agrégat",
    ],
    explanation:
      "On part des invariants, jamais du schéma. La dernière étape est un contrôle utile : si une opération semble exiger de modifier deux agrégats dans la même transaction, c'est souvent que la frontière est mal placée — ou qu'il faut publier un événement plutôt qu'écrire directement.",
  },
  {
    kind: "recall",
    id: "archi-ddd-09",
    difficulty: 2,
    tags: ["ddd", "agregat"],
    prompt: "Pourquoi une racine d'agrégat ne doit-elle jamais exposer sa collection interne ?",
    explanation:
      "Parce que cela contourne silencieusement toutes ses vérifications. Si `commande.lignes()` renvoie la liste interne, n'importe qui peut y ajouter un élément sans passer par `commande.ajoute(...)` — donc sans que le statut soit vérifié, sans que la limite de lignes s'applique, sans qu'aucun invariant ne soit contrôlé. L'agrégat n'est plus une frontière de cohérence, c'est une classe avec des méthodes qu'on peut ignorer. La règle est donc absolue : on expose une **vue** non modifiable, obtenue par copie, et toute modification passe par une méthode de la racine qui porte les règles. Le même raisonnement vaut à l'entrée — une collection reçue au constructeur doit être copiée, sinon l'appelant conserve une référence lui permettant de modifier l'état interne après coup.",
    keyPoints: [
      "Exposer la collection contourne toutes les vérifications",
      "L'agrégat cesse d'être une frontière de cohérence",
      "Exposer une vue non modifiable, obtenue par copie",
      "Copier aussi à l'entrée : l'appelant garde sinon une référence",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Le dépôt
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l4",
  title: "Le dépôt",
  blocks: [
    {
      kind: "text",
      text: "Le domaine doit pouvoir retrouver et enregistrer ses agrégats sans savoir qu'il existe une base de données. C'est le rôle du dépôt : offrir l'illusion d'une **collection en mémoire** d'agrégats, dont le domaine se sert sans rien connaître du stockage réel.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'interface appartient au domaine, l'implémentation non.",
      code: `// Dans le domaine : le vocabulaire du métier
public interface Commandes {
    Optional<Commande> parNumero(NumeroCommande numero);
    List<Commande> enAttenteDePaiement();
    void enregistre(Commande commande);
}

// Dans l'infrastructure : les détails techniques
class CommandesJpa implements Commandes {
    private final CommandeJpaRepository jpa;

    public Optional<Commande> parNumero(NumeroCommande n) {
        return jpa.findByNumero(n.valeur())
                  .map(this::versDomaine);
    }
}
// Le domaine dépend de l'interface. L'infrastructure
// dépend du domaine. Jamais l'inverse.`,
    },
    {
      kind: "text",
      text: "Le sens des dépendances est le point essentiel : l'interface est déclarée **dans le domaine**, avec son vocabulaire, et l'implémentation vit à l'extérieur. Le domaine ne dépend de rien ; c'est l'infrastructure qui se plie à son contrat. Cette inversion est ce qui permet de tester le domaine sans base et de changer de stockage sans y toucher.",
    },
    {
      kind: "text",
      text: "Un dépôt travaille **par agrégat**, pas par table. On retrouve une commande complète, cohérente, prête à être manipulée — pas une ligne de table qu'il faudrait recomposer. Un dépôt qui renvoie des morceaux force l'appelant à reconstituer l'agrégat, donc à connaître sa structure interne, ce qui annule la frontière.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce qu'un dépôt ne doit pas devenir.",
      code: `// Dérive fréquente : le dépôt fuit vers la technique
interface Commandes {
    Page<CommandeDto> search(Specification<CommandeEntity> spec,
                             Pageable pageable);
    List<Object[]> statsParMois();
    @Query("update Commande c set c.statut = …")
    void majStatutEnMasse(List<Long> ids);
}
// Le domaine connaît maintenant JPA, la pagination
// Spring, les DTO et le SQL. L'inversion est perdue :
// changer de stockage devient impossible.`,
    },
    {
      kind: "text",
      text: "Cette dérive est la plus courante, parce qu'elle se fait par petites concessions successives — un `Pageable` par commodité, une projection pour la performance, une requête en masse pour un traitement par lots. Chacune paraît anodine ; leur accumulation replace le domaine sous la dépendance du framework de persistance.",
    },
    {
      kind: "comparison",
      title: "Deux besoins qu'on mélange",
      left: {
        label: "Écriture",
        text: "Charger un agrégat complet, appliquer une règle, enregistrer. C'est le rôle du dépôt : cohérence garantie, invariants vérifiés, granularité de l'agrégat. Le volume est faible — un agrégat à la fois.",
      },
      right: {
        label: "Lecture d'affichage",
        text: "Une liste paginée avec cinq colonnes issues de trois tables. Charger des agrégats complets ici serait absurde. Cela relève d'un service de lecture dédié, qui peut requêter directement et renvoyer des projections.",
      },
    },
    {
      kind: "text",
      text: "Séparer ces deux chemins résout la tension qui pousse à dénaturer le dépôt. Les écritures passent par le domaine et ses agrégats ; les lectures d'affichage empruntent un chemin court, assumé comme tel, qui peut parler SQL sans que cela pollue le modèle. C'est une séparation légère, bien avant toute architecture élaborée.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le nom du dépôt révèle sa nature",
      text: "`CommandeRepository` avec `findAll` et `save` est un objet technique. `Commandes` avec `enAttenteDePaiement()` est un objet du domaine : son interface parle le langage métier et ses méthodes correspondent à des questions que le métier se pose. Ce simple changement de nommage oriente durablement la façon dont l'équipe l'utilise.",
    },
    {
      kind: "text",
      text: "Une question revient systématiquement : faut-il deux modèles, l'un pour le domaine et l'autre pour la persistance ? La réponse honnête est que cela dépend du coût de la traduction rapportée à ce qu'elle protège. Sur un domaine riche, deux modèles évitent que les contraintes de l'ORM — constructeur sans argument, champs modifiables, relations bidirectionnelles — ne déforment le métier. Sur un domaine simple, la duplication coûte plus qu'elle ne rapporte.",
    },
    {
      kind: "text",
      text: "Il existe un compromis fréquent et défendable : un seul modèle, annoté pour la persistance, mais écrit avec la discipline du domaine — constructeurs qui valident, méthodes qui portent l'intention, aucun mutateur public. On accepte quelques concessions techniques en échange d'une traduction en moins, et l'essentiel des garanties est préservé.",
    },
    {
      kind: "text",
      text: "Retenons les trois propriétés : l'interface appartient au domaine, la granularité est celle de l'agrégat, et les lectures d'affichage empruntent un autre chemin. Un dépôt qui respecte ces trois points reste stable pendant des années ; un dépôt qui les enfreint devient le point par lequel l'infrastructure reprend la main.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "archi-ddd-10",
    difficulty: 3,
    tags: ["ddd", "depot", "architecture"],
    prompt: "Cette interface de dépôt, déclarée dans le domaine, pose un problème d'architecture. Quelle ligne ?",
    code: {
      language: "java",
      code: `package domaine.commande;

public interface Commandes {
    Optional<Commande> parNumero(NumeroCommande numero);
    Page<Commande> search(Specification<CommandeEntity> spec,
                          Pageable pageable);
    void enregistre(Commande commande);
}`,
    },
    faultyLine: 5,
    reasons: [
      "Le domaine dépend désormais de types du framework de persistance : l'inversion de dépendance est perdue.",
      "`Optional` ne devrait pas apparaître dans une interface de domaine.",
      "Le dépôt ne devrait pas exposer de méthode d'enregistrement.",
      "L'interface devrait être déclarée dans le paquet d'infrastructure.",
    ],
    reasonAnswer: 0,
    explanation:
      "`Specification`, `Pageable` et `CommandeEntity` appartiennent à l'infrastructure. Les faire apparaître dans une interface du domaine inverse le sens des dépendances : le domaine connaît maintenant JPA, et changer de stockage devient impossible. Cette dérive se fait toujours par petites concessions — une pagination par commodité, une projection pour la performance.",
  },
  {
    kind: "mcq",
    id: "archi-ddd-11",
    difficulty: 2,
    tags: ["ddd", "depot"],
    prompt: "Comment servir une liste paginée de commandes avec cinq colonnes issues de trois tables ?",
    choices: [
      "Par un service de lecture dédié, qui peut requêter directement et renvoyer des projections.",
      "Par le dépôt, en chargeant les agrégats complets puis en les filtrant en mémoire.",
      "Par le dépôt, en ajoutant une méthode qui accepte une spécification et une pagination.",
      "En dénormalisant le modèle de domaine pour qu'il corresponde à l'affichage.",
    ],
    answer: 0,
    explanation:
      "Écriture et lecture d'affichage ont des besoins opposés : la première veut un agrégat complet et cohérent, la seconde veut cinq colonnes sur mille lignes. Charger des agrégats complets pour un tableau serait absurde, et ajouter la pagination au dépôt le fait dériver vers la technique. Un chemin de lecture séparé, assumé comme tel, résout la tension sans dénaturer le modèle.",
  },
  {
    kind: "recall",
    id: "archi-ddd-12",
    difficulty: 2,
    tags: ["ddd", "depot", "architecture"],
    prompt: "Pourquoi l'interface d'un dépôt doit-elle être déclarée dans le domaine ?",
    explanation:
      "Pour inverser le sens des dépendances. Si l'interface appartient au domaine, c'est l'infrastructure qui se plie à son contrat : le domaine ne dépend de rien, et il devient testable sans base — une implémentation en mémoire suffit — et indépendant du choix de stockage, qu'on peut changer sans toucher une ligne de métier. Si l'interface appartient à l'infrastructure, le domaine en dépend, et toute la valeur disparaît. Deux propriétés complètent cela : l'interface doit parler le **langage du métier** — `Commandes.enAttenteDePaiement()` plutôt que `CommandeRepository.findByStatut(2)` — et travailler à la granularité de l'**agrégat**, en renvoyant des objets complets et cohérents plutôt que des morceaux que l'appelant devrait recomposer, ce qui l'obligerait à connaître la structure interne et annulerait la frontière.",
    keyPoints: [
      "Interface dans le domaine : l'infrastructure se plie au contrat",
      "Domaine testable sans base, stockage remplaçable",
      "L'interface parle le langage métier, pas celui du framework",
      "Granularité de l'agrégat : des objets complets, jamais des morceaux",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Services de domaine et services applicatifs
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l5",
  title: "Services de domaine et services applicatifs",
  blocks: [
    {
      kind: "text",
      text: "« Service » est le mot le plus surchargé de l'architecture logicielle. Dans une même base de code, il désigne souvent trois choses différentes : un objet qui orchestre un cas d'usage, un objet qui porte une règle métier, et un fourre-tout où l'on met ce qui n'a pas trouvé sa place. Distinguer les deux premiers et supprimer le troisième clarifie beaucoup.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le service applicatif : il orchestre, il ne décide pas.",
      code: `@Service
class ValiderCommande {                  // un cas d'usage

    @Transactional
    public void executer(NumeroCommande numero) {
        var commande = commandes.parNumero(numero)
                .orElseThrow(() -> new CommandeIntrouvable(numero));

        commande.valide();               // ← LA RÈGLE est ici

        commandes.enregistre(commande);
        evenements.publie(new CommandeValidee(numero));
    }
}
// Charger, appeler, enregistrer, publier.
// Aucune décision métier dans ce code.`,
    },
    {
      kind: "text",
      text: "Un service applicatif est un **coordinateur** : il charge les agrégats concernés, appelle une méthode qui porte la règle, enregistre le résultat et publie ce qui doit l'être. Il gère aussi la transaction, la sécurité et la traduction depuis le monde extérieur. Ce qu'il ne fait jamais, c'est décider — s'il contient un `if` sur une règle métier, celle-ci est au mauvais endroit.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le service de domaine : une règle sans propriétaire naturel.",
      code: `// Le calcul dépend de DEUX agrégats : il n'appartient
// naturellement ni à l'un ni à l'autre.
class CalculFraisDePort {

    Montant pour(Commande commande, Transporteur transporteur) {
        if (commande.total().depasse(SEUIL_FRANCO)) {
            return Montant.ZERO;
        }
        return transporteur.tarifPour(commande.poids());
    }
}
// Sans état, nommé d'après une opération du métier,
// et parfaitement testable sans rien simuler.`,
    },
    {
      kind: "text",
      text: "Un service de domaine n'existe que lorsqu'une règle ne trouve pas de propriétaire naturel — typiquement parce qu'elle porte sur plusieurs agrégats. Il est sans état, nommé d'après une opération du métier, et il appartient au domaine. Le piège est d'en créer par réflexe : la plupart des règles appartiennent en réalité à un agrégat, et les y placer vaut toujours mieux.",
    },
    {
      kind: "comparison",
      title: "Deux services qu'on confond",
      left: {
        label: "Applicatif",
        text: "Un par cas d'usage. Connaît les dépôts, la transaction, les événements. Dépend de l'infrastructure. Sa suppression rendrait l'application inutilisable mais ne changerait rien aux règles du métier.",
      },
      right: {
        label: "De domaine",
        text: "Une règle qui ne tient dans aucun agrégat. Ne connaît ni dépôt, ni transaction, ni framework. Sa suppression ferait disparaître une règle métier. Il est testable sans aucune simulation.",
      },
    },
    {
      kind: "text",
      text: "Le critère de distinction le plus simple : un service de domaine peut-il être testé sans rien simuler ? Si oui, c'est bien une règle pure. S'il faut un dépôt simulé, une transaction ou un contexte, c'est un service applicatif déguisé — et la règle qu'il contient devrait probablement vivre ailleurs.",
    },
    {
      kind: "text",
      text: "Le troisième usage, le fourre-tout, se reconnaît à son nom : `CommandeService`, `GestionService`, `Helper`, `Manager`. Ces classes grossissent indéfiniment parce que rien ne délimite ce qu'elles doivent contenir. Nommer les services applicatifs d'après le **cas d'usage** — `ValiderCommande`, `AnnulerCommande` — supprime le problème à la racine : une classe dont le nom est un verbe ne peut pas accueillir n'importe quoi.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le service qui décide à la place de l'agrégat",
      text: "`if (commande.getStatut() == BROUILLON) { commande.setStatut(VALIDEE); }` dans un service est le symptôme le plus courant. La règle « une commande ne se valide que depuis l'état brouillon » appartient à la commande. Laissée dans le service, elle sera dupliquée dans le prochain service qui fera la même chose, et les deux copies divergeront.",
    },
    {
      kind: "text",
      text: "Un dernier repère aide à placer la transaction : elle appartient au service applicatif, jamais au domaine. Un agrégat ne sait pas ce qu'est une transaction, et ne doit pas le savoir — c'est une préoccupation technique liée au stockage. Le service applicatif l'ouvre, appelle le domaine, enregistre, et la referme : c'est la frontière naturelle d'un cas d'usage.",
    },
    {
      kind: "text",
      text: "Retenons la répartition : la règle dans l'agrégat par défaut, dans un service de domaine si elle porte sur plusieurs agrégats, jamais dans un service applicatif — qui se contente de charger, d'appeler, d'enregistrer et de publier.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-ddd-13",
    difficulty: 2,
    tags: ["ddd", "services"],
    prompt: "Quel critère distingue un service de domaine d'un service applicatif ?",
    choices: [
      "Le service de domaine se teste sans rien simuler : il ne connaît ni dépôt, ni transaction, ni framework.",
      "Le service de domaine est annoté `@Service`, le service applicatif ne l'est pas.",
      "Le service de domaine contient les accès à la base, le service applicatif les appels HTTP.",
      "Le service applicatif est sans état, le service de domaine en a un.",
    ],
    answer: 0,
    explanation:
      "Un service de domaine porte une règle pure, qui ne tient dans aucun agrégat parce qu'elle en concerne plusieurs : il est testable directement. S'il faut lui fournir un dépôt simulé ou une transaction, c'est un service applicatif déguisé — et la règle qu'il contient devrait probablement vivre dans un agrégat.",
  },
  {
    kind: "match",
    id: "archi-ddd-14",
    difficulty: 2,
    tags: ["ddd", "services"],
    prompt: "Associe chaque responsabilité à son destinataire.",
    pairs: [
      { left: "« Une commande ne se valide que depuis brouillon »", right: "L'agrégat Commande" },
      { left: "Calcul de frais de port dépendant de deux agrégats", right: "Un service de domaine" },
      { left: "Charger, appeler, enregistrer, publier un événement", right: "Un service applicatif, un par cas d'usage" },
      { left: "Traduire un corps JSON en objets du domaine", right: "L'adaptateur d'entrée, hors du domaine" },
    ],
    explanation:
      "La règle va dans l'agrégat par défaut. Laissée dans un service, elle sera dupliquée dans le prochain service qui fait la même chose, et les deux copies divergeront. Nommer les services applicatifs d'après le cas d'usage — `ValiderCommande` plutôt que `CommandeService` — évite qu'ils ne deviennent des fourre-tout.",
  },
  {
    kind: "recall",
    id: "archi-ddd-15",
    difficulty: 2,
    tags: ["ddd", "services"],
    prompt: "Comment reconnaître qu'une règle métier est au mauvais endroit ?",
    explanation:
      "Le symptôme le plus courant est un `if` sur l'état d'un agrégat à l'intérieur d'un service applicatif : `if (commande.getStatut() == BROUILLON) { commande.setStatut(VALIDEE); }`. La règle « une commande ne se valide que depuis l'état brouillon » appartient à la commande elle-même ; laissée dans le service, elle sera fatalement dupliquée dans le prochain service qui fait la même chose, et les deux copies divergeront le jour où l'une sera corrigée. Un second signe est la présence d'accesseurs et de mutateurs sur un agrégat : s'il expose `getStatut` et `setStatut`, c'est que quelqu'un d'autre décide à sa place. Un troisième est le nom de la classe : `CommandeService`, `Manager`, `Helper` sont des fourre-tout qui grossissent indéfiniment parce que rien ne délimite ce qu'ils doivent contenir — alors qu'une classe nommée d'après un cas d'usage, `ValiderCommande`, ne peut pas accueillir n'importe quoi.",
    keyPoints: [
      "Un if sur l'état d'un agrégat dans un service",
      "Elle sera dupliquée, et les copies divergeront",
      "Des accesseurs et mutateurs : quelqu'un décide à la place de l'agrégat",
      "Un nom fourre-tout : Service, Manager, Helper",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Hexagonale, Clean, Onion : la même idée
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l6",
  title: "Hexagonale, Clean, Onion : la même idée",
  blocks: [
    {
      kind: "text",
      text: "Trois noms, trois schémas différents, et beaucoup de débats — pour une seule idée sous-jacente. Toutes ces architectures posent la même règle : les dépendances pointent **vers l'intérieur**, du technique vers le métier, jamais l'inverse. Le reste n'est que vocabulaire et découpage en couches.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La même règle, trois présentations.",
      code: `HEXAGONALE      domaine au centre, ports et adaptateurs
                autour. Un port est une interface du
                domaine ; un adaptateur l'implémente.

ONION           des couches concentriques : domaine,
                services de domaine, services
                applicatifs, infrastructure.

CLEAN           entités, cas d'usage, adaptateurs,
                frameworks — avec la règle de
                dépendance explicitement énoncée.

→ Dans les trois : rien de ce qui est au centre ne
  connaît ce qui est autour. Le domaine ne compile
  pas moins bien si l'on supprime la base, l'API
  et le framework.`,
    },
    {
      kind: "text",
      text: "Le test décisif tient en une question : le domaine compile-t-il sans le framework, sans la base, sans l'API ? Si oui, la règle est respectée, quel que soit le nom qu'on donne à l'ensemble. Si non, aucun schéma ne rattrapera l'affaire — l'architecture est déclarée mais pas appliquée.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'inversion, concrètement.",
      code: `// DOMAINE — ne dépend de rien
package domaine;

public interface Notifications {              // un port
    void previent(ClientId client, Message m);
}

public class ValiderCommande {
    private final Notifications notifications;  // l'interface
    // …
}

// INFRASTRUCTURE — dépend du domaine
package infrastructure.mail;

class NotificationsSmtp implements Notifications {  // adaptateur
    public void previent(ClientId client, Message m) {
        javaMailSender.send(…);
    }
}
// La flèche de dépendance pointe de l'infrastructure
// vers le domaine. Jamais l'inverse.`,
    },
    {
      kind: "text",
      text: "Le mécanisme est toujours le même : le domaine déclare ce dont il a besoin sous forme d'interface, et l'extérieur fournit l'implémentation. C'est de l'inversion de dépendance appliquée systématiquement, et c'est ce qui permet de tester le domaine sans démarrer quoi que ce soit, ainsi que de remplacer un adaptateur sans toucher au métier.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'organiser les paquets",
      left: {
        label: "Par couche technique",
        text: "`controller`, `service`, `repository`, `entity`. Chaque paquet contient tout le système. Pour comprendre les commandes, il faut ouvrir quatre paquets, et rien n'empêche une classe de facturation d'appeler directement un dépôt de commandes.",
      },
      right: {
        label: "Par domaine",
        text: "`commande`, `facturation`, `livraison`, chacun avec ses propres couches internes. Tout ce qui concerne les commandes est au même endroit, et l'on peut rendre privé ce qui ne doit pas sortir du paquet. Les frontières deviennent visibles et défendables.",
      },
    },
    {
      kind: "text",
      text: "Le découpage par domaine est nettement plus utile à mesure que le projet grossit : il rend les frontières visibles dans l'arborescence, permet de restreindre la visibilité au niveau du paquet, et prépare naturellement une extraction ultérieure si un module doit devenir un service à part. Le découpage par couche technique donne l'illusion de l'ordre tout en laissant tout communiquer avec tout.",
    },
    {
      kind: "text",
      text: "Une architecture déclarée mais non vérifiée dérive en quelques mois. Un outil comme ArchUnit permet d'écrire la règle sous forme de test — « aucune classe du paquet domaine ne dépend d'une classe du paquet infrastructure » — et de la faire échouer en intégration continue. C'est ce qui transforme une intention de départ en propriété durable.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le coût est réel et doit être assumé",
      text: "Cette architecture ajoute des interfaces, des conversions entre modèle de domaine et modèle de persistance, et des couches à traverser. Sur une application qui fait circuler des données sans logique propre, ce coût n'est compensé par rien. Elle se justifie quand il existe un vrai domaine — des règles, des invariants, un vocabulaire — et pas avant.",
    },
    {
      kind: "text",
      text: "Une objection fréquente mérite d'être traitée : cette architecture ne fait-elle pas beaucoup d'interfaces à une seule implémentation ? Souvent, oui — et c'est acceptable ici pour une raison précise. L'interface n'existe pas pour permettre plusieurs implémentations, elle existe pour **inverser une dépendance**. Sa justification est structurelle, pas anticipative, et c'est ce qui la distingue d'une abstraction ajoutée au cas où.",
    },
    {
      kind: "text",
      text: "Retenons donc : une seule règle — les dépendances pointent vers le métier — un seul test pour la vérifier, un découpage par domaine plutôt que par couche, et une vérification automatisée pour qu'elle survive. Les trois noms désignent la même chose, et le débat entre eux est largement stérile.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "order",
    id: "archi-ddd-16",
    difficulty: 2,
    tags: ["architecture", "hexagonale"],
    prompt: "Remets dans l'ordre la mise en place d'une inversion de dépendance.",
    items: [
      "Le domaine déclare une interface décrivant son besoin, avec son vocabulaire",
      "Le domaine s'en sert sans connaître aucune implémentation",
      "L'infrastructure implémente cette interface avec la technologie choisie",
      "L'assemblage fournit l'implémentation au domaine au démarrage",
    ],
    explanation:
      "La flèche de dépendance pointe de l'infrastructure vers le domaine : c'est l'infrastructure qui connaît le domaine, jamais l'inverse. Le test décisif est simple — le domaine compile-t-il sans le framework, sans la base et sans l'API ? Si oui, la règle est respectée quel que soit le nom donné à l'architecture.",
  },
  {
    kind: "mcq",
    id: "archi-ddd-17",
    difficulty: 2,
    tags: ["architecture"],
    prompt: "Quel découpage de paquets rend les frontières défendables ?",
    choices: [
      "Par domaine — `commande`, `facturation` — chacun avec ses couches internes.",
      "Par couche technique — `controller`, `service`, `repository`, `entity`.",
      "Par type d'objet — `dto`, `entity`, `mapper`, `exception`.",
      "Par équipe responsable, pour aligner le code sur l'organisation.",
    ],
    answer: 0,
    explanation:
      "Le découpage par couche technique donne l'illusion de l'ordre tout en laissant tout communiquer avec tout : rien n'empêche une classe de facturation d'appeler un dépôt de commandes. Le découpage par domaine rend les frontières visibles dans l'arborescence, permet de restreindre la visibilité au niveau du paquet, et prépare une extraction ultérieure.",
  },
  {
    kind: "recall",
    id: "archi-ddd-18",
    difficulty: 2,
    tags: ["architecture"],
    prompt: "Qu'ont en commun les architectures hexagonale, Clean et Onion, et comment vérifier qu'elle est respectée ?",
    explanation:
      "Une seule règle : les dépendances pointent **vers l'intérieur**, du technique vers le métier, jamais l'inverse. Le domaine déclare ses besoins sous forme d'interfaces — les ports — et l'extérieur fournit les implémentations — les adaptateurs. Les trois noms diffèrent par le vocabulaire et le nombre de couches dessinées, pas par le principe, et le débat entre eux est largement stérile. La vérification tient en une question : le domaine compile-t-il sans le framework, sans la base et sans l'API ? Si oui, la règle est respectée quel que soit le schéma ; si non, aucun diagramme ne rattrapera l'affaire. Comme une architecture déclarée mais non vérifiée dérive en quelques mois, il vaut la peine d'écrire la règle sous forme de test — aucune classe du domaine ne dépend de l'infrastructure — et de la faire échouer en intégration continue.",
    keyPoints: [
      "Une seule règle : les dépendances pointent vers le métier",
      "Ports déclarés par le domaine, adaptateurs fournis par l'extérieur",
      "Test décisif : le domaine compile-t-il sans framework ni base ?",
      "Automatiser la vérification, sinon l'architecture dérive",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Les patrons qui servent vraiment
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l7",
  title: "Les patrons qui servent vraiment",
  blocks: [
    {
      kind: "text",
      text: "Le catalogue des patrons de conception compte vingt-trois entrées, dont une poignée seulement se rencontre régulièrement dans une application Java moderne. Plusieurs ont été absorbés par le langage ou par le conteneur d'injection, et quelques-uns sont devenus des anti-patrons. Connaître ceux qui servent vaut mieux que de réciter la liste.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Stratégie : le plus utile de tous, et souvent non nommé.",
      code: `interface CalculRemise {
    Montant pour(Commande commande);
}

class RemiseFidelite implements CalculRemise { … }
class RemisePremiereCommande implements CalculRemise { … }

// Choisir un comportement à l'exécution, sans if en cascade
class Tarification {
    private final List<CalculRemise> calculs;   // injectées

    Montant meilleureRemise(Commande c) {
        return calculs.stream().map(r -> r.pour(c))
                      .max(Montant::compareTo).orElse(Montant.ZERO);
    }
}
// Ajouter une remise = ajouter une classe.
// Aucun code existant n'est modifié.`,
    },
    {
      kind: "text",
      text: "La stratégie est le patron le plus rentable parce qu'il répond au besoin le plus fréquent : remplacer une cascade de conditions par un ensemble ouvert de comportements. Spring en facilite l'usage en injectant automatiquement toutes les implémentations d'une interface sous forme de liste, ce qui rend l'ajout d'un cas réellement indolore.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Fabrique, décorateur, constructeur : trois usages courants.",
      code: `// FABRIQUE — nommer les façons de construire
record Periode(LocalDate debut, LocalDate fin) {
    static Periode mois(YearMonth m) { … }
    static Periode depuis(LocalDate d) { … }
}

// DÉCORATEUR — ajouter un comportement sans modifier
class TarifsAvecCache implements Tarifs {
    private final Tarifs delegue;
    public Tarif pour(Reference r) {
        return cache.computeIfAbsent(r, delegue::pour);
    }
}

// CONSTRUCTEUR — un objet à nombreux paramètres optionnels
var requete = Requete.builder()
        .url(url).delai(Duration.ofSeconds(5))
        .entete("Accept", "application/json")
        .build();`,
    },
    {
      kind: "text",
      text: "Le décorateur mérite une mention particulière car il permet d'ajouter cache, mesure, reprise sur erreur ou journalisation **sans toucher** à l'implémentation existante ni à ses appelants. C'est exactement ce que fait Spring avec ses proxys, et le reconnaître aide à comprendre pourquoi l'appel interne contourne ces comportements.",
    },
    {
      kind: "comparison",
      title: "Deux patrons devenus inutiles ou nuisibles",
      left: {
        label: "Singleton classique",
        text: "L'instance unique gérée par la classe elle-même, accessible globalement. Rend les tests difficiles, cache les dépendances et crée un état global. Le conteneur d'injection fournit la même unicité sans aucun de ces défauts.",
      },
      right: {
        label: "Observateur fait main",
        text: "Gérer soi-même une liste d'abonnés et les notifier. Fonctionne, mais les événements applicatifs du framework font la même chose avec une meilleure intégration — transaction, asynchronisme — et sans code à maintenir.",
      },
    },
    {
      kind: "text",
      text: "Plusieurs patrons ont été absorbés par le langage lui-même. La commande et le modèle de méthode se réduisent souvent à une lambda ou à une interface fonctionnelle ; l'itérateur est intégré ; le prototype est remplacé par les méthodes de copie des `record`. Reconnaître qu'un patron est devenu une ligne de code évite de reconstruire une hiérarchie de classes pour rien.",
    },
    {
      kind: "text",
      text: "Le vrai risque n'est pas d'ignorer un patron mais d'en appliquer un sans nécessité. Une interface avec une seule implémentation, une fabrique pour un objet à deux champs, une abstraction ajoutée « au cas où » coûtent immédiatement en lisibilité et ne rapportent que si le second cas arrive — ce qui, statistiquement, n'arrive pas.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le patron se reconnaît, il ne se planifie pas",
      text: "La bonne façon d'utiliser ces outils est de laisser le besoin apparaître : quand une troisième condition s'ajoute à une cascade, c'est le moment d'extraire une stratégie. Choisir un patron avant d'avoir le problème produit une abstraction qui ne correspond à rien — et qu'il faudra défaire, ce qui coûte plus cher que de ne l'avoir jamais écrite.",
    },
    {
      kind: "text",
      text: "Une remarque sur l'usage en entretien : ces patrons sont souvent demandés par leur nom, et la réponse attendue n'est pas la définition du catalogue. Décrire le problème que le patron résout, donner un cas rencontré, et dire ce qu'on aurait fait sans lui montre qu'on l'a utilisé plutôt que lu. C'est aussi ce qui permet d'admettre honnêtement qu'on ne connaît pas un patron rare sans que cela porte à conséquence.",
    },
    {
      kind: "text",
      text: "Retenons la courte liste réellement utile : stratégie pour remplacer des conditions, décorateur pour ajouter du transverse, fabrique pour nommer une construction, constructeur pour les objets à nombreux paramètres. Les autres se rencontrent, mais bien plus rarement qu'un entretien ne le laisse croire.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "match",
    id: "archi-ddd-19",
    difficulty: 2,
    tags: ["patterns", "conception"],
    prompt: "Associe chaque besoin au patron approprié.",
    pairs: [
      { left: "Remplacer une cascade de conditions par un ensemble ouvert", right: "Stratégie" },
      { left: "Ajouter cache ou mesure sans modifier l'existant", right: "Décorateur" },
      { left: "Nommer plusieurs façons de construire un objet", right: "Fabrique statique" },
      { left: "Construire un objet à nombreux paramètres optionnels", right: "Constructeur (builder)" },
    ],
    explanation:
      "Ce sont les quatre qui se rencontrent réellement dans une application Java moderne. Le décorateur mérite une attention particulière : c'est exactement ce que fait Spring avec ses proxys pour `@Transactional` ou `@Cacheable`, ce qui aide à comprendre pourquoi un appel interne contourne ces comportements.",
  },
  {
    kind: "fill",
    id: "archi-ddd-20",
    difficulty: 2,
    tags: ["patterns", "conception"],
    prompt: "Complète le patron qui remplace une cascade de conditions.",
    code: {
      language: "java",
      code: `interface CalculRemise {
    Montant pour(Commande commande);
}

class Tarification {
    // Spring injecte TOUTES les implémentations
    private final {{1}}<CalculRemise> calculs;

    Montant meilleure(Commande c) {
        return calculs.stream().map(r -> r.{{2}}(c))
                      .max(Montant::compareTo)
                      .orElse(Montant.ZERO);
    }
}`,
    },
    blanks: ["List", "pour"],
    distractors: ["Optional", "Map", "calcule", "apply"],
    explanation:
      "Spring sait injecter toutes les implémentations d'une interface sous forme de `List`, ce qui rend l'ajout d'une remise réellement indolore : on écrit une classe, et aucun code existant n'est modifié. C'est ce qui fait de la stratégie le patron le plus rentable — il répond au besoin le plus fréquent, remplacer une cascade de conditions par un ensemble ouvert.",
  },
  {
    kind: "mcq",
    id: "archi-ddd-21",
    difficulty: 2,
    tags: ["patterns", "conception"],
    prompt: "Quel est le risque principal avec les patrons de conception ?",
    choices: [
      "En appliquer un sans nécessité : l'abstraction coûte tout de suite et ne rapporte que si le second cas arrive.",
      "En ignorer un, ce qui rend le code impossible à faire évoluer.",
      "Les mélanger dans une même classe, ce que le langage interdit.",
      "Les utiliser sans les nommer explicitement dans les commentaires.",
    ],
    answer: 0,
    explanation:
      "Une interface à une seule implémentation, une fabrique pour un objet à deux champs, une abstraction ajoutée « au cas où » coûtent immédiatement en lisibilité pour un bénéfice qui, statistiquement, n'arrive pas. Le patron se reconnaît quand le besoin apparaît — une troisième condition dans une cascade — il ne se planifie pas à l'avance.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Les anti-patrons du modèle
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "archi-ddd-l8",
  title: "Les anti-patrons du modèle",
  blocks: [
    {
      kind: "text",
      text: "Le modèle anémique est de loin le plus répandu, au point de passer pour l'architecture normale : des classes de données avec accesseurs et mutateurs, et toute la logique dans des services. Techniquement, cela fonctionne. Ce qui pose problème est ce que cette structure rend impossible à garantir.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'état impossible, créé sans la moindre erreur.",
      code: `class Commande {                       // modèle anémique
    private Statut statut;
    private List<Ligne> lignes = new ArrayList<>();
    // getters et setters pour tout
}

var commande = new Commande();
commande.setStatut(Statut.EXPEDIEE);
commande.setLignes(List.of());          // expédiée, sans ligne

System.out.println(commande.getStatut()
        + " / " + commande.getLignes().size());
// Affiche : EXPEDIEE / 0
// Un état que le métier interdit, obtenu sans erreur.`,
    },
    {
      kind: "text",
      text: "Le problème n'est pas l'absence de vérification — elle existe sans doute quelque part dans un service. C'est qu'elle est **contournable** : rien n'oblige à passer par ce service, et le prochain développeur qui aura besoin de créer une commande écrira un autre chemin. Les règles se dupliquent alors, puis divergent.",
    },
    {
      kind: "text",
      text: "Le remède ne consiste pas à supprimer tous les services, mais à déplacer dans l'objet les règles qui portent sur son état. Une commande qui expose `expedie()` au lieu de `setStatut(EXPEDIEE)` peut vérifier qu'elle a des lignes, qu'elle est payée, et refuser sinon. L'état invalide devient irreprésentable au lieu d'être simplement déconseillé.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'exposer un changement d'état",
      left: {
        label: "setStatut(EXPEDIEE)",
        text: "N'importe qui, à n'importe quel moment, depuis n'importe quel état. L'objet ne peut rien vérifier puisqu'il ignore l'intention : mettre à jour après une correction et expédier réellement passent par la même porte.",
      },
      right: {
        label: "expedie()",
        text: "Le nom porte l'intention, donc l'objet peut vérifier les préconditions et refuser. La liste des méthodes publiques devient la liste des opérations autorisées — une documentation du domaine que le compilateur fait respecter.",
      },
    },
    {
      kind: "text",
      text: "Deux autres anti-patrons méritent d'être nommés. L'**objet divin** concentre tout : une classe `Commande` de deux mille lignes qui gère la facturation, la livraison et les relances. Elle apparaît toujours de la même façon — chacun ajoute sa méthode là où se trouve la donnée — et se traite en identifiant les responsabilités qui pourraient vivre séparément.",
    },
    {
      kind: "text",
      text: "Le **modèle unique** est plus subtil : une seule classe `Client` censée servir la facturation, le service après-vente et le marketing. Elle accumule les champs utiles à l'un et vides pour les autres, et chaque modification risque de casser un usage éloigné. La sortie consiste à reconnaître qu'il s'agit de trois notions distinctes partageant un identifiant.",
    },
    {
      kind: "text",
      text: "Ces trois dérives ont une cause commune : l'organisation du code suit la **structure des données** plutôt que les responsabilités. On regroupe ce qui se ressemble — tous les champs d'un client, toutes les méthodes qui touchent une commande — au lieu de regrouper ce qui change ensemble et pour les mêmes raisons.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le modèle anémique n'est pas toujours une faute",
      text: "Sur une application qui fait essentiellement circuler des données — lire, transformer, écrire — il n'y a pas de domaine à modéliser, et un modèle riche serait une complication gratuite. L'anémie est un problème quand il existe de vraies règles qu'on ne peut plus garantir. Le juger sans regarder ce que fait l'application est un dogmatisme coûteux.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même objet, avec des méthodes qui portent l'intention.",
      code: `class Commande {
    private Statut statut;
    private final List<Ligne> lignes = new ArrayList<>();

    void expedie() {
        if (lignes.isEmpty())  throw new CommandeVide(id);
        if (statut != Statut.PAYEE)
            throw new TransitionInterdite(statut, Statut.EXPEDIEE);
        statut = Statut.EXPEDIEE;
    }

    void annule(Motif motif) {
        if (statut == Statut.EXPEDIEE)
            throw new DejaExpediee(id);
        statut = Statut.ANNULEE;
    }
    // Aucun mutateur public. La liste des méthodes
    // EST la liste des opérations autorisées.
}`,
    },
    {
      kind: "text",
      text: "Un dernier anti-patron mérite d'être nommé parce qu'il touche les projets qui appliquent bien tout le reste : la **sur-modélisation**. Créer un agrégat, trois objets-valeurs, un service de domaine et un port pour une fonctionnalité qui lit une table et l'affiche produit une architecture impeccable au service d'un besoin qui n'existe pas. La complexité est alors dans le code plutôt que dans le domaine — c'est le même défaut que l'anémie, dans l'autre sens.",
    },
    {
      kind: "text",
      text: "Retenons le critère qui tranche : y a-t-il des règles qui doivent toujours être vraies ? Si oui, elles appartiennent à l'objet, et les mutateurs qui permettent de les contourner doivent disparaître au profit de méthodes qui portent l'intention. Si non, un modèle simple suffit et c'est très bien ainsi.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "archi-ddd-22",
    difficulty: 2,
    tags: ["ddd", "anti-patterns"],
    prompt: "La classe `Commande` n'expose que des accesseurs et des mutateurs. Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `var commande = new Commande();
commande.setStatut(Statut.EXPEDIEE);
commande.setLignes(List.of());

System.out.println(commande.getStatut()
        + " / " + commande.getLignes().size());`,
    },
    choices: [
      "EXPEDIEE / 0 — un état que le métier interdit, obtenu sans la moindre erreur.",
      "Une `IllegalStateException` : une commande expédiée doit avoir des lignes.",
      "BROUILLON / 0 — le mutateur de statut est ignoré tant qu'il n'y a pas de ligne.",
      "Une erreur de compilation : `List.of()` n'est pas assignable à une liste modifiable.",
    ],
    answer: 0,
    explanation:
      "C'est exactement le problème du modèle anémique : l'objet ne peut rien vérifier parce qu'il ignore l'intention. Une vérification existe sans doute dans un service, mais elle est contournable — rien n'oblige à passer par lui. Exposer `expedie()` plutôt que `setStatut(EXPEDIEE)` permettrait de vérifier les préconditions et de refuser.",
  },
  {
    kind: "spot",
    id: "archi-ddd-23",
    difficulty: 2,
    tags: ["ddd", "anti-patterns"],
    prompt: "Quelle ligne rend impossible toute garantie sur l'état de la commande ?",
    code: {
      language: "java",
      code: `class Commande {
    private Statut statut;
    private List<Ligne> lignes;

    public void setStatut(Statut s) { this.statut = s; }

    public Montant total() { … }
}`,
    },
    faultyLine: 5,
    reasons: [
      "Le mutateur permet n'importe quelle transition depuis n'importe quel état, sans que l'objet puisse vérifier l'intention.",
      "`statut` devrait être déclaré `final` pour garantir la cohérence.",
      "`total()` devrait être un champ calculé plutôt qu'une méthode.",
      "La classe devrait implémenter une interface pour être testable.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un mutateur ne porte aucune intention : mettre à jour après une correction et expédier réellement passent par la même porte, donc l'objet ne peut rien vérifier. Des méthodes nommées d'après les opérations du métier — `expedie()`, `annule()` — permettent de contrôler les préconditions et transforment la liste des méthodes publiques en liste des opérations autorisées.",
  },
  {
    kind: "mcq",
    id: "archi-ddd-24",
    difficulty: 3,
    tags: ["ddd", "anti-patterns"],
    prompt: "Quand un modèle anémique est-il acceptable ?",
    choices: [
      "Quand l'application fait essentiellement circuler des données, sans règles à garantir.",
      "Jamais : c'est un anti-patron dans tous les contextes.",
      "Quand l'équipe est trop petite pour maintenir un modèle riche.",
      "Quand les données sont persistées par un ORM, qui impose les accesseurs.",
    ],
    answer: 0,
    explanation:
      "S'il n'y a pas de domaine à modéliser — lire, transformer, écrire — un modèle riche est une complication gratuite. L'anémie devient un problème quand il existe de vraies règles qu'on ne peut plus garantir, parce que les vérifications sont contournables et finiront dupliquées puis divergentes. Juger sans regarder ce que fait l'application est un dogmatisme coûteux.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "archi-ddd-patterns",
  title: "DDD tactique et patrons : modéliser un domaine",
  objective:
    "Modéliser un domaine avec les outils qui comptent : partager le langage du métier, distinguer entité et objet-valeur, délimiter un agrégat par ses invariants, garder un dépôt qui ne fuit pas vers la technique, placer chaque règle au bon endroit, appliquer l'inversion de dépendance, connaître les patrons réellement utiles et reconnaître les anti-patrons du modèle.",
  prerequisites: ["archi-hexagonale"],
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
