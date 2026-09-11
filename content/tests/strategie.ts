/**
 * Tests — Stratégie (référentiel 5.4) : pyramide et trophée, comportement
 * contre implémentation, couverture, mutation, doublures, contrats.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — À quoi sert une stratégie de test
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "tests-strat-l1",
  title: "À quoi sert une stratégie de test",
  blocks: [
    {
      kind: "text",
      text: "Une équipe qui écrit des tests sans stratégie obtient presque toujours le même résultat : beaucoup de tests, une suite lente, une confiance faible. Personne n'ose modifier le code parce que trente tests cassent à chaque changement, et personne n'ose déployer parce que ces trente tests ne prouvent pas que l'application fonctionne.",
    },
    {
      kind: "text",
      text: "Le malentendu est sur l'objectif. On croit que le but est de tester le code ; le but est de **pouvoir le changer**. Une suite de tests utile est celle qui permet de refondre une implémentation, de mettre à jour une dépendance ou de livrer un vendredi, en sachant qu'un échec signale un vrai problème et qu'un succès signifie quelque chose.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les quatre propriétés à arbitrer.",
      code: `PROTECTION CONTRE LES RÉGRESSIONS
  Le test attrape-t-il un vrai bug ? Un test qui ne
  peut échouer que si l'on casse volontairement ce
  qu'il vérifie ne protège de rien.

RÉSISTANCE À LA REFONTE
  Le test survit-il à un changement d'implémentation
  qui ne change pas le comportement ? C'est la
  propriété la plus souvent sacrifiée.

RETOUR RAPIDE
  Combien de temps pour savoir ? Une suite de vingt
  minutes n'est plus lancée avant de pousser.

COÛT DE MAINTENANCE
  Combien coûte-t-elle à chaque évolution ?

→ Aucun test ne maximise les quatre. Choisir, c'est
  décider lesquelles sacrifier, et où.`,
    },
    {
      kind: "text",
      text: "Ces quatre propriétés sont en tension. Un test de bout en bout protège très bien contre les régressions et résiste à la refonte, mais il est lent et coûteux. Un test unitaire est rapide et bon marché, mais il protège d'autant moins qu'il teste petit, et il résiste d'autant moins à la refonte qu'il connaît les détails internes.",
    },
    {
      kind: "text",
      text: "La résistance à la refonte mérite une attention particulière parce que c'est la seule qu'on ne peut pas rattraper après coup. Un test lent peut être accéléré, un test peu protecteur peut être complété — mais un test qui casse à chaque réorganisation interne rend la refonte si coûteuse qu'on finit par ne plus refondre. Le code se dégrade alors, protégé par des tests qui l'empêchent de s'améliorer.",
    },
    {
      kind: "comparison",
      title: "Deux suites du même volume",
      left: {
        label: "Fragile",
        text: "Cinq cents tests unitaires qui vérifient que telle méthode appelle telle autre. Tout casse dès qu'on déplace une responsabilité. Verte, elle ne prouve pas que l'application démarre ; rouge, elle signale le plus souvent une refonte volontaire.",
      },
      right: {
        label: "Utile",
        text: "Deux cents tests qui vérifient des comportements observables, dont quelques-uns traversent réellement la base et l'API. Une refonte interne les laisse verts ; un vrai défaut les fait rougir. Le signal est exploitable.",
      },
    },
    {
      kind: "text",
      text: "Un critère simple permet de trier : si un test échoue, apprend-on quelque chose ? Un test qui rougit uniquement parce qu'on a renommé une méthode privée ou changé l'ordre de deux appels ne transmet aucune information — il produit du bruit, et le bruit finit par être ignoré, y compris quand il signale un vrai problème.",
    },
    {
      kind: "text",
      text: "La stratégie consiste donc à décider, pour chaque zone du code, quel type de test apporte le meilleur rapport. La logique métier riche mérite des tests unitaires nombreux et rapides ; l'assemblage — contrôleur, dépôt, configuration — se vérifie mieux par des tests d'intégration ; les parcours critiques méritent quelques tests de bout en bout, et pas davantage.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un test instable est pire qu'aucun test",
      text: "Un test qui échoue une fois sur dix sans raison apprend à l'équipe à relancer la CI plutôt qu'à lire l'échec. Ce réflexe, une fois installé, s'applique aussi aux vrais échecs. Un test instable doit être réparé dans la journée ou supprimé — le laisser en l'état dégrade la valeur de toute la suite, pas seulement la sienne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même défaut, vu par deux tests.",
      code: `// Ne peut échouer que si l'on casse volontairement
// ce qu'il vérifie : aucune protection réelle.
@Test
void le_service_existe() {
    assertThat(service).isNotNull();
}

// Échoue si la règle métier est violée, survit à
// toute réorganisation interne : protection réelle,
// résistance à la refonte.
@Test
void au_dela_de_100_la_remise_est_de_10_pourcent() {
    assertThat(service.calcule(commandeDe(120)).total())
        .isEqualTo(108);
}`,
    },
    {
      kind: "text",
      text: "En entretien, la question « quelle est votre stratégie de test ? » attend mieux qu'un ratio. Nommer les propriétés en tension, dire où l'on place le curseur selon la nature du code, et expliquer pourquoi la résistance à la refonte prime, montre qu'on a vécu le moment où une suite de tests devient un frein plutôt qu'un appui.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "tests-strat-01",
    difficulty: 2,
    tags: ["tests", "strategie"],
    prompt: "Quelle propriété d'une suite de tests ne peut pas être rattrapée après coup ?",
    choices: [
      "La résistance à la refonte : des tests qui cassent à chaque réorganisation interne empêchent d'améliorer le code.",
      "Le retour rapide : une suite lente ne peut pas être accélérée.",
      "La protection contre les régressions, qui dépend du nombre de tests écrits au départ.",
      "Le coût de maintenance, fixé par le framework choisi initialement.",
    ],
    answer: 0,
    explanation:
      "Une suite lente s'accélère, une suite peu protectrice se complète. Mais des tests couplés aux détails internes rendent la refonte si coûteuse qu'on cesse de refondre : le code se dégrade, protégé par des tests qui l'empêchent de s'améliorer. C'est la seule des quatre propriétés dont la dégradation s'auto-entretient.",
  },
  {
    kind: "match",
    id: "tests-strat-02",
    difficulty: 2,
    tags: ["tests", "strategie"],
    prompt: "Associe chaque zone de code au type de test qui rapporte le plus.",
    pairs: [
      { left: "Logique métier riche, règles de calcul", right: "Tests unitaires nombreux et rapides" },
      { left: "Assemblage : contrôleur, dépôt, configuration", right: "Tests d'intégration sur une tranche" },
      { left: "Parcours critique de bout en bout", right: "Quelques tests système, pas davantage" },
      { left: "Code sans logique : DTO, accesseurs", right: "Aucun test dédié" },
    ],
    explanation:
      "Le rapport dépend de la nature du code. Tester unitairement un contrôleur revient souvent à vérifier que le framework fonctionne ; tester une règle de calcul par un parcours de bout en bout est lent et donne un signal imprécis. La dernière ligne compte autant : écrire des tests sur du code sans décision gonfle la suite sans rien protéger.",
  },
  {
    kind: "recall",
    id: "tests-strat-03",
    difficulty: 2,
    tags: ["tests", "strategie"],
    prompt: "Quelles sont les quatre propriétés à arbitrer dans une suite de tests ?",
    explanation:
      "La **protection contre les régressions** — le test attrape-t-il un vrai défaut, ou ne peut-il échouer que si l'on casse volontairement ce qu'il vérifie ? La **résistance à la refonte** — survit-il à un changement d'implémentation qui ne change pas le comportement ? C'est la plus souvent sacrifiée et la seule dont la dégradation s'auto-entretient. Le **retour rapide** — combien de temps avant de savoir ? Une suite de vingt minutes cesse d'être lancée avant de pousser. Et le **coût de maintenance** à chaque évolution. Aucun test ne maximise les quatre : un test de bout en bout protège bien et résiste à la refonte mais coûte cher et rend lentement ; un test unitaire est rapide et bon marché mais protège d'autant moins qu'il teste petit. Choisir une stratégie, c'est décider lesquelles sacrifier et où.",
    keyPoints: [
      "Protection contre les régressions",
      "Résistance à la refonte : la plus sacrifiée, la plus critique",
      "Retour rapide : au-delà de quelques minutes, la suite n'est plus lancée",
      "Coût de maintenance ; aucun test ne maximise les quatre",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — La pyramide et ses critiques
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "tests-strat-l2",
  title: "La pyramide et ses critiques",
  blocks: [
    {
      kind: "text",
      text: "La pyramide des tests est le modèle le plus cité du domaine, et le plus mal appliqué. Elle date d'une époque où lancer un test contre une vraie base prenait des minutes et exigeait une machine dédiée. Sa forme découle directement de cette contrainte — et cette contrainte a largement disparu.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le modèle, et ce qu'il dit vraiment.",
      code: `           /\\
          /  \\      Bout en bout : peu nombreux
         /────\\     lents, fragiles, mais réalistes
        /      \\
       /────────\\   Intégration : quelques-uns
      /          \\
     /────────────\\ Unitaires : beaucoup
    /______________\\ rapides, isolés, bon marché

Le message central n'est PAS « écrivez surtout des
tests unitaires ». C'est : « plus un test est lent et
fragile, moins il doit y en avoir ».`,
    },
    {
      kind: "text",
      text: "Reformulée ainsi, la pyramide reste parfaitement valable. Ce qui a changé, c'est le coût d'un test d'intégration : avec un conteneur jetable démarré en quelques secondes, tester contre une vraie base Postgres n'est plus une opération lourde. La couche du milieu est devenue bien moins chère qu'à l'époque du modèle, ce qui déplace le point d'équilibre.",
    },
    {
      kind: "text",
      text: "La critique principale porte sur l'interprétation littérale. Appliquée comme une règle de proportion, la pyramide pousse à écrire beaucoup de tests unitaires — y compris sur du code qui n'a aucune logique propre. On teste alors un contrôleur en simulant tout ce qui l'entoure, et le test vérifie surtout que le framework fonctionne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le test unitaire qui ne teste rien.",
      code: `@Test
void get_renvoie_la_commande() {
    when(service.trouve(1L)).thenReturn(commande);

    var reponse = controleur.get(1L);

    assertThat(reponse).isEqualTo(commande);
}

// Que vérifie ce test ?
//  · que le contrôleur appelle le service : détail
//  · que Java renvoie ce qu'on lui dit de renvoyer
// Ce qu'il ne vérifie PAS :
//  · le routage de l'URL      · la sérialisation
//  · le code de statut        · la validation
//  · la gestion d'erreur
// Or c'est là que sont les vrais défauts.`,
    },
    {
      kind: "text",
      text: "Ce test est vert en permanence, casse dès qu'on renomme une méthode, et ne protège d'aucun défaut réel. Les vrais risques d'un contrôleur sont ailleurs : une route mal écrite, un champ qui ne se sérialise pas, un code de statut erroné, une validation absente. Aucun ne peut être détecté sans faire passer une vraie requête HTTP.",
    },
    {
      kind: "comparison",
      title: "Deux lectures de la pyramide",
      left: {
        label: "Littérale",
        text: "« 70 % unitaires, 20 % intégration, 10 % bout en bout. » Une proportion à atteindre, indépendante du code. Conduit à tester unitairement des classes sans logique, et à mesurer la qualité au nombre de tests.",
      },
      right: {
        label: "Économique",
        text: "« Plus un test est lent et fragile, moins il doit y en avoir. » Une règle de coût, pas de proportion. Elle laisse la forme s'adapter au code : une application riche en règles aura une base large, une application d'assemblage non.",
      },
    },
    {
      kind: "text",
      text: "La lecture économique explique aussi pourquoi la pointe doit rester fine. Un test de bout en bout est lent, dépend de l'environnement, et échoue pour des raisons qui n'ont rien à voir avec le code — un réseau capricieux, un jeu de données modifié, une animation. Multiplier ces tests ne multiplie pas la confiance, il multiplie le bruit.",
    },
    {
      kind: "text",
      text: "Une conséquence pratique : les tests de bout en bout doivent couvrir les **parcours** critiques, pas les cas particuliers. Vérifier qu'un utilisateur peut s'inscrire, se connecter et passer commande justifie leur coût. Vérifier par ce moyen qu'un message d'erreur s'affiche quand le code postal a quatre chiffres ne le justifie pas — cela se teste bien plus bas.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "La forme dépend de ce que fait l'application",
      text: "Un moteur de calcul, un système de tarification, un solveur de règles ont une base unitaire très large — c'est là qu'est la valeur et la complexité. Une application qui fait surtout circuler des données entre une API et une base a peu de logique propre : sa base unitaire sera mince, et l'essentiel de sa valeur de test se trouve au niveau intégration.",
    },
    {
      kind: "text",
      text: "Retenons donc la pyramide comme une règle de coût plutôt que comme un quota. Elle ne dit pas combien de tests écrire de chaque sorte ; elle dit que la lenteur et la fragilité doivent être rares. C'est une reformulation modeste, et c'est celle qui reste vraie quand le coût des outils change.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "order",
    id: "tests-strat-04",
    difficulty: 1,
    tags: ["tests", "pyramide"],
    prompt: "Classe ces types de tests du plus nombreux au moins nombreux selon la pyramide.",
    items: [
      "Tests unitaires : rapides, isolés, bon marché",
      "Tests d'intégration : une tranche réelle, quelques secondes",
      "Tests de bout en bout : lents, dépendants de l'environnement",
    ],
    explanation:
      "Le message n'est pas « écrivez surtout des tests unitaires » mais « plus un test est lent et fragile, moins il doit y en avoir ». C'est une règle de coût, pas un quota : la forme réelle dépend du code, et une application riche en règles aura une base bien plus large qu'une application qui fait surtout circuler des données.",
  },
  {
    kind: "mcq",
    id: "tests-strat-05",
    difficulty: 2,
    tags: ["tests", "pyramide"],
    prompt: "Pourquoi tester unitairement un contrôleur en simulant le service apporte-t-il peu ?",
    choices: [
      "Les vrais risques — routage, sérialisation, code de statut, validation — ne sont pas exercés par ce test.",
      "Les contrôleurs ne peuvent pas être testés unitairement en Spring.",
      "Le test serait trop lent à cause du chargement du contexte applicatif.",
      "Les simulacres ne permettent pas de vérifier une valeur de retour.",
    ],
    answer: 0,
    explanation:
      "Un tel test vérifie que le contrôleur appelle le service et que Java renvoie ce qu'on lui dit de renvoyer. Les défauts réels d'un contrôleur sont ailleurs : une route mal écrite, un champ qui ne se sérialise pas, un code de statut erroné, une validation absente — aucun ne peut être détecté sans faire passer une vraie requête HTTP.",
  },
  {
    kind: "recall",
    id: "tests-strat-06",
    difficulty: 2,
    tags: ["tests", "pyramide"],
    prompt: "Qu'est-ce qui a changé depuis la formulation de la pyramide, et avec quelle conséquence ?",
    explanation:
      "Le **coût d'un test d'intégration**. La pyramide date d'une époque où lancer un test contre une vraie base prenait des minutes et exigeait une machine partagée, souvent dans un état incertain — la forme du modèle découle directement de cette contrainte. Avec les conteneurs jetables, démarrer un vrai Postgres prend quelques secondes, isolé, reproductible et supprimé après le test. La couche du milieu est donc devenue bien moins chère, ce qui déplace le point d'équilibre vers plus de tests d'intégration. Le principe sous-jacent, lui, ne bouge pas : plus un test est lent et fragile, moins il doit y en avoir. C'est pourquoi la pointe reste fine — un test de bout en bout dépend de l'environnement et échoue pour des raisons sans rapport avec le code, si bien qu'en multiplier ne multiplie pas la confiance mais le bruit.",
    keyPoints: [
      "Le coût d'un test d'intégration s'est effondré",
      "Conteneurs jetables : vraie base, isolée, en quelques secondes",
      "Le point d'équilibre se déplace vers le milieu",
      "Le principe de coût reste : lenteur et fragilité doivent rester rares",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Le trophée : le poids des tests d'intégration
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "tests-strat-l3",
  title: "Le trophée : le poids des tests d'intégration",
  blocks: [
    {
      kind: "text",
      text: "Le trophée des tests est la réponse moderne à la pyramide, formulée d'abord pour le front puis reprise ailleurs. Il déplace le volume vers les tests d'intégration, en partant d'un constat simple : c'est à l'**assemblage** que se trouvent la plupart des défauts, pas à l'intérieur des unités.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Quatre niveaux, et où va le volume.",
      code: `    ╱────────╲     Bout en bout : peu
   ╱          ╲
  │            │   INTÉGRATION : le plus gros
  │            │   plusieurs pièces réelles ensemble
   ╲          ╱
    ╲────────╱     Unitaires : la logique pure
     ────────      Statique : compilateur, types,
                   analyse — gratuit et permanent

L'idée : « écrivez des tests qui ressemblent à la
façon dont votre logiciel est utilisé ». Personne
n'utilise une méthode privée isolément.`,
    },
    {
      kind: "text",
      text: "La base statique mérite qu'on s'y arrête, car on l'oublie en parlant de tests. Un typage strict, un compilateur exigeant et un analyseur statique attrapent gratuitement et en permanence une classe entière de défauts — valeur nulle, faute de frappe, branche inatteignable — qu'il serait absurde de vouloir couvrir par des tests écrits à la main.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un test d'intégration sur une tranche réelle.",
      code: `@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class CommandeApiTest {

    @Container
    static PostgreSQLContainer<?> db =
        new PostgreSQLContainer<>("postgres:16");

    @Test
    void creer_une_commande_renvoie_201_et_Location() {
        var reponse = client.post()
            .uri("/commandes")
            .bodyValue(new CreerCommande("ART-1", 2))
            .exchange();

        reponse.expectStatus().isCreated()
               .expectHeader().exists("Location");
        // Ce test exerce : routage, désérialisation,
        // validation, transaction, SQL réel, migrations,
        // sérialisation, code de statut, en-têtes.
    }
}`,
    },
    {
      kind: "text",
      text: "Ce test unique couvre ce qu'une dizaine de tests unitaires n'aurait pas couvert : le routage, la désérialisation, la validation, la transaction, le SQL réellement exécuté, les migrations appliquées, la sérialisation de la réponse. Il est plus lent qu'un test unitaire — quelques secondes — mais il vérifie le comportement que l'utilisateur observe.",
    },
    {
      kind: "comparison",
      title: "Deux façons de tester la même fonctionnalité",
      left: {
        label: "Dix tests unitaires",
        text: "Contrôleur avec service simulé, service avec dépôt simulé, dépôt avec base simulée, convertisseur, validateur. Rapides, mais chacun vérifie une couture avec un simulacre — et aucune des coutures réelles n'est exercée.",
      },
      right: {
        label: "Un test d'intégration",
        text: "Une requête, une vraie base, une vraie transaction. Plus lent, mais il échoue si l'une quelconque des pièces ne s'assemble pas — ce qui est précisément le défaut que les dix tests précédents laissaient passer.",
      },
    },
    {
      kind: "text",
      text: "Le trophée n'annule pas les tests unitaires : il les recentre sur ce qui les justifie, la **logique** — un calcul de tarif, une machine à états, une règle métier avec beaucoup de cas. Là, un test unitaire est imbattable : il permet de couvrir vingt combinaisons en quelques millisecondes, ce qu'aucun test d'intégration ne peut se permettre.",
    },
    {
      kind: "text",
      text: "Le critère de répartition devient alors lisible. Là où il y a une **décision**, on teste unitairement et on couvre les cas. Là où il y a un **assemblage**, on teste en intégration et on vérifie que les pièces s'emboîtent. Cette formulation évite le débat sur les proportions, qui n'a jamais rien réglé.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un test d'intégration doit rester isolé",
      text: "Deux tests qui partagent une base et s'exécutent en parallèle finissent par se marcher dessus, et produisent des échecs qui dépendent de l'ordre — la pire forme d'instabilité. Chaque test doit créer ses propres données et ne rien supposer de l'état initial. Un conteneur par classe de test, ou une transaction annulée à la fin, donnent cette isolation.",
    },
    {
      kind: "text",
      text: "Une objection revient souvent : les tests d'intégration seraient trop lents pour la boucle de développement. C'est vrai si on les lance tous à chaque sauvegarde, et faux si on les sépare — les tests unitaires en continu pendant qu'on code, la suite d'intégration avant de pousser. Cette séparation coûte une ligne de configuration et supprime l'essentiel de l'argument.",
    },
    {
      kind: "text",
      text: "Retenons la phrase qui résume le modèle : écrire des tests qui ressemblent à la façon dont le logiciel est réellement utilisé. Personne n'appelle une méthode privée isolément ; en revanche tout le monde envoie des requêtes HTTP et lit des réponses. Le test le plus utile est celui qui imite cet usage au niveau le plus bas où il reste fidèle.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "tests-strat-07",
    difficulty: 2,
    tags: ["tests", "integration"],
    prompt: "Quel est le raisonnement du trophée des tests ?",
    choices: [
      "Les défauts se trouvent surtout à l'assemblage : il faut donc tester plusieurs pièces réelles ensemble.",
      "Les tests unitaires sont inutiles et doivent être remplacés par des tests de bout en bout.",
      "Le volume doit se concentrer sur les tests de bout en bout, seuls réalistes.",
      "L'analyse statique remplace la majorité des tests automatisés.",
    ],
    answer: 0,
    explanation:
      "Le trophée déplace le volume vers l'intégration en partant d'un constat : c'est à l'assemblage que se trouvent la plupart des défauts, pas à l'intérieur des unités. Il ne supprime pas les tests unitaires, il les recentre sur la logique — calcul, machine à états, règle à nombreux cas — où ils sont imbattables. Et il rappelle que le typage et l'analyse statique attrapent gratuitement toute une classe de défauts.",
  },
  {
    kind: "match",
    id: "tests-strat-08",
    difficulty: 2,
    tags: ["tests", "integration"],
    prompt: "Associe chaque niveau du trophée à ce qu'il attrape.",
    pairs: [
      { left: "Statique", right: "Valeurs nulles, fautes de frappe, branches inatteignables — gratuitement" },
      { left: "Unitaire", right: "Les cas d'une décision : calcul, machine à états, règle métier" },
      { left: "Intégration", right: "L'assemblage : routage, sérialisation, transaction, SQL réel" },
      { left: "Bout en bout", right: "Les parcours critiques, du navigateur à la base" },
    ],
    explanation:
      "Le critère de répartition est lisible : là où il y a une **décision**, on teste unitairement et l'on couvre les cas ; là où il y a un **assemblage**, on teste en intégration et l'on vérifie que les pièces s'emboîtent. Cette formulation évite le débat sur les proportions, qui n'a jamais rien réglé.",
  },
  {
    kind: "recall",
    id: "tests-strat-09",
    difficulty: 2,
    tags: ["tests", "integration"],
    prompt: "Que couvre un test d'intégration sur une API qu'une série de tests unitaires ne couvre pas ?",
    explanation:
      "Toutes les **coutures réelles**. Une requête HTTP qui traverse l'application exerce le routage de l'URL, la désérialisation du corps, la validation, l'ouverture de la transaction, le SQL réellement produit par l'ORM, les migrations effectivement appliquées, la sérialisation de la réponse, le code de statut et les en-têtes. Une série de tests unitaires vérifie chacune de ces pièces avec un simulacre en face : le contrôleur avec un service simulé, le service avec un dépôt simulé — si bien qu'aucune des jonctions n'est exercée, et qu'un désaccord entre deux pièces passe inaperçu. C'est précisément la catégorie de défaut la plus fréquente. Le prix est la lenteur, quelques secondes au lieu de quelques millisecondes, et l'exigence d'isolation : chaque test doit créer ses propres données et ne rien supposer de l'état initial, faute de quoi l'ordre d'exécution devient une source d'échecs.",
    keyPoints: [
      "Routage, désérialisation, validation, transaction, SQL réel",
      "Migrations appliquées, sérialisation, statut, en-têtes",
      "Les tests unitaires n'exercent aucune jonction réelle",
      "Prix : lenteur, et obligation d'isolation entre tests",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Tester le comportement, pas l'implémentation
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "tests-strat-l4",
  title: "Tester le comportement, pas l'implémentation",
  blocks: [
    {
      kind: "text",
      text: "C'est la distinction la plus rentable de tout le domaine, et la plus souvent manquée. Un test qui vérifie **ce que fait** le code survit à une refonte ; un test qui vérifie **comment il le fait** casse dès qu'on change d'avis sur le comment — c'est-à-dire à chaque amélioration.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même test, deux fois.",
      code: `// COUPLÉ À L'IMPLÉMENTATION
@Test
void applique_la_remise() {
    service.calcule(commande);

    verify(calculateur).appliqueRemise(commande);
    verify(depot).save(any());
    verify(notifieur).envoie(any());
}
// Casse si l'on renomme, réordonne, fusionne deux
// appels, ou délègue autrement. Ne dit rien du
// résultat : la remise pourrait être fausse.

// COUPLÉ AU COMPORTEMENT
@Test
void une_commande_de_plus_de_100_recoit_10_pourcent() {
    var resultat = service.calcule(commandeDe(120));

    assertThat(resultat.total()).isEqualTo(108);
}
// Survit à toute refonte interne, et échoue
// exactement quand la règle est cassée.`,
    },
    {
      kind: "text",
      text: "Le second test dit quelque chose sur le domaine ; le premier décrit un enchaînement d'appels. Le premier casse à chaque réorganisation sans jamais détecter une remise mal calculée ; le second ne casse que si la règle métier est violée. À l'écriture, ils coûtent la même chose ; à l'usage, ils n'ont rien de comparable.",
    },
    {
      kind: "text",
      text: "La règle pratique qui en découle : tester par l'**interface publique** du composant, en observant ce qui en sort. Si un test doit rendre une méthode `public` pour l'atteindre, ou vérifier un champ privé, c'est le signe qu'on teste trop bas. Ce qui est privé est un détail d'implémentation, et un détail d'implémentation n'a pas à être vérifié.",
    },
    {
      kind: "comparison",
      title: "Deux façons de nommer un test",
      left: {
        label: "Par la méthode",
        text: "`testCalcule()`, `calculeTest2()`. N'apprend rien : il faut lire le corps pour savoir ce qui est vérifié, et un échec en CI ne dit pas ce qui est cassé. Le nom suit l'implémentation et devient faux dès qu'elle change.",
      },
      right: {
        label: "Par le comportement",
        text: "`une_commande_de_plus_de_100_recoit_10_pourcent()`. La liste des tests devient une spécification lisible, et un échec en CI nomme exactement la règle violée — souvent sans qu'on ait besoin d'ouvrir le fichier.",
      },
    },
    {
      kind: "text",
      text: "Le nommage n'est pas cosmétique : la sortie d'une exécution de tests est le premier endroit où l'on regarde quand la CI rougit. Une liste de noms qui décrivent des règles métier permet de comprendre la nature du problème sans lire une ligne de code. Une liste de `test1`, `test2` oblige à ouvrir les fichiers un par un.",
    },
    {
      kind: "text",
      text: "Une conséquence utile concerne les simulacres et les vérifications d'appel. `verify` est un outil de vérification d'implémentation : il affirme que telle méthode a été appelée. Il se justifie quand l'appel **est** le comportement observable — un courriel envoyé, un message publié — et pas autrement. Vérifier qu'un dépôt a été appelé, alors qu'on pourrait relire la donnée, est un couplage gratuit.",
    },
    {
      kind: "text",
      text: "La structure en trois temps aide à rester du bon côté : préparer, agir, vérifier. Si la partie vérification ne contient que des `verify`, le test décrit un enchaînement. Si elle contient des assertions sur un résultat ou sur un état observable, le test décrit un comportement. Ce simple coup d'œil suffit à trier une suite existante.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le test d'une refonte : ne rien toucher",
      text: "Une refonte réussie ne modifie aucun test. Si l'on doit adapter vingt tests pour extraire une classe, ces tests étaient couplés à l'implémentation — et la refonte vient de perdre son filet de sécurité, puisqu'on modifie en même temps le code et ce qui devait le vérifier. C'est le meilleur indicateur de la qualité d'une suite.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le signal d'alerte : élargir la visibilité pour tester.",
      code: `// Avant : la méthode était privée.
// On la passe en « package-private » pour la tester.
TarifCalcule calculeRemiseInterne(Commande c) { … }

@Test
void calcule_remise_interne() {
    assertThat(service.calculeRemiseInterne(c)).isEqualTo(…);
}

// Ce changement de visibilité est le symptôme :
// on teste un détail d'implémentation. Soit ce calcul
// mérite d'être une classe à part entière, avec sa
// propre interface publique — soit il doit être
// vérifié à travers le comportement qui l'utilise.`,
    },
    {
      kind: "text",
      text: "Retenons le critère le plus simple : un test devrait pouvoir être écrit avant de savoir comment le code sera organisé. S'il faut connaître les noms des classes internes pour l'écrire, il testera l'implémentation. S'il ne dépend que de l'entrée et du résultat attendu, il testera le comportement — et survivra à tout ce qui arrivera ensuite au code.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "tests-strat-10",
    difficulty: 2,
    tags: ["tests", "conception"],
    prompt: "Ce test casse à chaque refonte sans jamais détecter de vrai défaut. Quelle ligne le montre le mieux ?",
    code: {
      language: "java",
      code: `@Test
void applique_la_remise() {
    service.calcule(commandeDe(120));

    verify(calculateur).appliqueRemise(any());
}`,
    },
    faultyLine: 5,
    reasons: [
      "La vérification porte sur un appel interne, pas sur le résultat : la remise pourrait être fausse sans que le test échoue.",
      "`any()` est trop permissif et devrait être remplacé par la commande exacte.",
      "Le test ne déclare pas de `@DisplayName`, ce qui rend l'échec illisible.",
      "`service.calcule` devrait être appelé dans un bloc `assertDoesNotThrow`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le test affirme qu'une méthode a été appelée, pas que le résultat est correct : une remise calculée à l'envers le laisserait vert. Inversement, renommer ou fusionner l'appel le fait rougir sans qu'aucun comportement n'ait changé. La forme utile vérifie le résultat observable — `assertThat(resultat.total()).isEqualTo(108)` — et survit à toute réorganisation interne.",
  },
  {
    kind: "mcq",
    id: "tests-strat-11",
    difficulty: 2,
    tags: ["tests", "conception"],
    prompt: "Quand `verify` sur un simulacre est-il justifié ?",
    choices: [
      "Quand l'appel est lui-même le comportement observable : un courriel envoyé, un message publié.",
      "Systématiquement, pour s'assurer que toutes les dépendances sont bien sollicitées.",
      "Uniquement dans les tests d'intégration, où les vraies dépendances sont présentes.",
      "Quand la méthode testée ne renvoie rien, ce qui interdit toute assertion.",
    ],
    answer: 0,
    explanation:
      "`verify` vérifie une implémentation : il affirme qu'une méthode a été appelée. Cela ne se justifie que lorsque l'appel **est** l'effet attendu, sans autre moyen de l'observer — un envoi vers l'extérieur, typiquement. Vérifier qu'un dépôt a été appelé alors qu'on pourrait relire la donnée enregistrée est un couplage gratuit qui cassera à la première refonte.",
  },
  {
    kind: "recall",
    id: "tests-strat-12",
    difficulty: 2,
    tags: ["tests", "conception"],
    prompt: "Quel indicateur révèle qu'une suite de tests est couplée à l'implémentation ?",
    explanation:
      "Le comportement de la suite pendant une **refonte**. Une refonte, par définition, change l'organisation interne sans changer le comportement observable : une suite saine reste donc entièrement verte, et c'est ce qui en fait un filet de sécurité. S'il faut adapter vingt tests pour extraire une classe ou renommer une méthode, ces tests décrivaient des détails internes — et la refonte perd son filet, puisqu'on modifie en même temps le code et ce qui devait le vérifier. Deux signes annoncent ce couplage avant même la refonte : la partie vérification d'un test ne contient que des `verify` plutôt que des assertions sur un résultat ou un état observable, et l'on doit élargir la visibilité d'une méthode ou lire un champ privé pour écrire le test. Un troisième critère aide à l'écriture : un bon test peut être écrit avant de savoir comment le code sera organisé.",
    keyPoints: [
      "Une refonte ne devrait modifier aucun test",
      "Signe : la vérification ne contient que des verify",
      "Signe : il faut rendre public ou lire un champ privé",
      "Un bon test s'écrit avant de connaître l'organisation du code",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — La couverture : ce qu'elle mesure vraiment
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "tests-strat-l5",
  title: "La couverture : ce qu'elle mesure vraiment",
  blocks: [
    {
      kind: "text",
      text: "La couverture de code est la métrique la plus utilisée et la plus mal interprétée des tests. Elle mesure exactement une chose : la proportion de lignes — ou de branches — **exécutées** pendant la suite. Elle ne dit rien de ce qui a été vérifié, et cette différence est tout le sujet.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Cent pour cent de couverture, zéro vérification.",
      code: `int divise(int a, int b) {
    return a / b;
}

@Test
void test_divise() {
    divise(10, 2);        // la ligne est exécutée
}                         // aucune assertion

// Couverture de ligne : 100 %.
// Ce que le test garantit : rien.
// Le test passerait si la méthode renvoyait a * b,
// et il ne dit rien du cas b = 0.`,
    },
    {
      kind: "text",
      text: "Cet exemple caricatural se retrouve en pratique sous des formes plus discrètes : un test qui appelle une méthode dans un bloc `try` pour vérifier qu'elle ne lève pas d'exception, un test qui construit un objet sans rien en vérifier, un test dont les assertions ne portent que sur des champs sans intérêt. La couverture monte, la protection reste nulle.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois mesures qui ne disent pas la même chose.",
      code: `LIGNE      la ligne a été exécutée
           if (a && b) { … }  → couverte si exécutée
                                 une seule fois

BRANCHE    chaque issue d'une condition a été prise
           → exige au moins un cas vrai ET un faux

CONDITION  chaque sous-condition a pris les deux
           valeurs → a=vrai/faux ET b=vrai/faux

→ La couverture de branche est la plus utile des
  trois. Un rapport qui n'affiche que la ligne
  surestime nettement ce qui est réellement exercé.`,
    },
    {
      kind: "text",
      text: "La couverture de branche est nettement plus informative que celle de ligne, car elle exige que chaque issue d'une condition ait été empruntée. Un `if` sans `else` compte comme couvert dès que la condition est vraie une fois, alors que le chemin où elle est fausse n'a jamais été exercé — c'est souvent celui qui contient le défaut.",
    },
    {
      kind: "comparison",
      title: "Deux usages de la mesure",
      left: {
        label: "Comme objectif",
        text: "« Il faut 80 % de couverture. » Le chiffre devient une cible, et l'on écrit des tests sans assertion pour l'atteindre. La mesure cesse de mesurer quoi que ce soit dès qu'elle devient un objectif — c'est le mécanisme classique de toute métrique détournée.",
      },
      right: {
        label: "Comme indicateur",
        text: "On regarde ce qui **n'est pas** couvert, et l'on se demande si c'est normal. Une classe de règles métier à 20 % est un signal fort ; un fichier de configuration à 0 % ne l'est pas. La valeur est dans l'écart, pas dans le total.",
      },
    },
    {
      kind: "text",
      text: "C'est le retournement à retenir : la couverture est utile en négatif. Une zone non couverte est une question — est-ce du code sans logique, du code mort, ou une zone risquée oubliée ? Les trois réponses conduisent à des actions différentes, et aucune ne consiste à écrire un test pour faire monter un pourcentage.",
    },
    {
      kind: "text",
      text: "Un seuil dans l'intégration continue reste défendable, à condition de le placer bas et de le traiter comme un plancher contre les régressions, non comme une cible. Interdire que la couverture **baisse** sur le code modifié est plus utile qu'exiger un total global : cela porte sur ce qui vient d'être écrit, là où l'attention est encore présente.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Cent pour cent est un mauvais objectif",
      text: "Atteindre la couverture totale oblige à tester du code sans décision — accesseurs, méthodes générées, branches défensives impossibles à provoquer. On gonfle la suite, on la ralentit, et l'on ajoute des tests qui ne protègent de rien tout en devant être maintenus. L'effort est mieux placé sur la qualité des assertions existantes.",
    },
    {
      kind: "text",
      text: "Un cas particulier mérite d'être signalé : la couverture des tests d'intégration. Un seul test qui traverse l'application couvre énormément de lignes, ce qui peut faire grimper le total sans que la protection augmente à proportion. Lire la couverture par module plutôt qu'en global évite cette illusion, surtout quand la suite mélange les deux niveaux.",
    },
    {
      kind: "text",
      text: "En entretien, la question sur la couverture est un test en elle-même. Répondre par un chiffre cible signale qu'on suit une consigne ; expliquer que la mesure indique ce qui a été exécuté et non ce qui a été vérifié, qu'on la lit en négatif, et qu'on préfère surveiller son évolution sur le code modifié, montre qu'on a compris ce qu'elle vaut.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "output",
    id: "tests-strat-13",
    difficulty: 2,
    tags: ["tests", "couverture"],
    prompt: "Que produit l'exécution de ce test, et que vaut la couverture de ligne de `divise` ?",
    code: {
      language: "java",
      code: `int divise(int a, int b) {
    return a / b;
}

@Test
void test_divise() {
    divise(10, 2);
}`,
    },
    choices: [
      "Le test passe, et la couverture de ligne de `divise` est de 100 %.",
      "Le test échoue : JUnit exige au moins une assertion.",
      "Le test passe, mais la couverture reste à 0 % faute d'assertion.",
      "Le test échoue sur une division par zéro non gérée.",
    ],
    answer: 0,
    explanation:
      "JUnit n'exige aucune assertion : un test sans exception est un test qui passe. La ligne `return a / b` a bien été exécutée, donc elle est couverte à 100 %. Le test garantit pourtant strictement rien — il passerait si la méthode renvoyait `a * b`, et ne dit rien du cas `b = 0`. C'est toute la différence entre exécuter et vérifier.",
  },
  {
    kind: "mcq",
    id: "tests-strat-14",
    difficulty: 2,
    tags: ["tests", "couverture"],
    prompt: "Pourquoi la couverture de branche est-elle plus informative que celle de ligne ?",
    choices: [
      "Elle exige que chaque issue d'une condition ait été empruntée, y compris le chemin où elle est fausse.",
      "Elle compte les lignes de test en plus des lignes de production.",
      "Elle ne compte que les lignes contenant une assertion.",
      "Elle mesure le nombre de chemins d'exécution possibles dans la méthode.",
    ],
    answer: 0,
    explanation:
      "Un `if` sans `else` compte comme couvert en ligne dès que la condition est vraie une fois — alors que le chemin où elle est fausse n'a jamais été exercé, et c'est souvent celui qui contient le défaut. La couverture de branche exige au moins un cas vrai et un cas faux, ce qui reflète bien mieux ce qui a réellement été éprouvé.",
  },
  {
    kind: "recall",
    id: "tests-strat-15",
    difficulty: 2,
    tags: ["tests", "couverture"],
    prompt: "Comment lire utilement un rapport de couverture ?",
    explanation:
      "**En négatif**. La couverture mesure ce qui a été exécuté, jamais ce qui a été vérifié : un test sans assertion couvre parfaitement les lignes qu'il traverse. Utilisée comme objectif, la mesure cesse immédiatement de mesurer quoi que ce soit — on écrit des tests sans assertion pour atteindre le seuil. Ce qui est utile est de regarder ce qui **n'est pas** couvert et de se demander si c'est normal : une classe de règles métier à 20 % est un signal fort, un fichier de configuration à 0 % n'en est pas un. La valeur est dans l'écart, pas dans le total. Un seuil dans l'intégration continue reste défendable s'il est placé bas et traité comme un plancher anti-régression, et il est plus utile de surveiller que la couverture ne **baisse** pas sur le code modifié que d'exiger un total global — cela porte sur ce qui vient d'être écrit, quand l'attention est encore là.",
    keyPoints: [
      "Elle mesure l'exécution, pas la vérification",
      "Devenue objectif, elle cesse de mesurer",
      "La lire en négatif : ce qui manque, et si c'est normal",
      "Surveiller l'évolution sur le code modifié plutôt qu'un total",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Les tests de mutation
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "tests-strat-l6",
  title: "Les tests de mutation",
  blocks: [
    {
      kind: "text",
      text: "Si la couverture ne dit pas si les tests vérifient quelque chose, quelle mesure le dirait ? Les tests de mutation répondent à cette question d'une façon qui paraît évidente une fois énoncée : introduire volontairement des défauts dans le code, et regarder si la suite les détecte.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le principe, en trois temps.",
      code: `1. L'outil modifie le code, une mutation à la fois :
     a > b        devient   a >= b
     a + b        devient   a - b
     return x     devient   return null
     if (c) { }   la condition est inversée
     un appel est supprimé

2. Il relance les tests sur chaque version mutée.

3. · Un test échoue        → mutant TUÉ. Bien.
   · Tous les tests passent → mutant SURVIVANT.
     Le défaut n'est détecté par personne.

Score de mutation = tués / total.
Cette fois, la mesure porte bien sur la CAPACITÉ
DE DÉTECTION de la suite.`,
    },
    {
      kind: "text",
      text: "Un mutant survivant est une information précieuse et précise : il désigne une modification du code que personne ne remarquerait. Soit le test correspondant manque, soit il existe mais n'affirme rien d'utile, soit la ligne mutée est du code mort. Les trois cas méritent d'être regardés, et aucun n'est visible dans un rapport de couverture.",
    },
    {
      kind: "code",
      language: "xml",
      caption: "Brancher PIT sur un projet Maven.",
      code: `<plugin>
  <groupId>org.pitest</groupId>
  <artifactId>pitest-maven</artifactId>
  <configuration>
    <targetClasses>
      <param>com.example.tarification.*</param>
    </targetClasses>
    <mutationThreshold>70</mutationThreshold>
  </configuration>
</plugin>

<!-- mvn org.pitest:pitest-maven:mutationCoverage
     Le rapport HTML surligne chaque mutant survivant,
     à la ligne près. -->`,
    },
    {
      kind: "text",
      text: "Le coût est la contrepartie évidente : l'outil relance la suite une fois par mutation, ce qui peut représenter des milliers d'exécutions. Sur une base de code entière, cela se compte en heures. C'est pourquoi on le cible — un module de calcul, un moteur de règles — plutôt que de l'appliquer partout.",
    },
    {
      kind: "comparison",
      title: "Deux mesures, deux questions",
      left: {
        label: "Couverture",
        text: "« Ce code a-t-il été exécuté ? » Rapide, gratuite, intégrée partout. Répond à une question faible : un test sans assertion la satisfait entièrement. Utile surtout en négatif, pour repérer les zones oubliées.",
      },
      right: {
        label: "Mutation",
        text: "« Ce code, s'il était faux, serait-il détecté ? » Lente et coûteuse, mais elle répond à la vraie question. Un score de mutation élevé signifie que les tests affirment réellement quelque chose sur le comportement.",
      },
    },
    {
      kind: "text",
      text: "Cette comparaison explique l'usage recommandé : la couverture en permanence, comme indicateur grossier ; la mutation ponctuellement, sur les zones où l'erreur coûte cher. Un moteur de tarification, un calcul de droits, une machine à états de commande méritent l'investissement ; un contrôleur qui transmet des données, non.",
    },
    {
      kind: "text",
      text: "Une limite mérite d'être connue : les **mutants équivalents**. Certaines mutations produisent un code au comportement strictement identique — remplacer une borne par une autre dans une boucle qui n'atteint jamais cette borne, par exemple. Aucun test ne peut les tuer, et ils font baisser le score sans qu'il y ait rien à corriger. C'est pourquoi un score de cent pour cent n'est pas un objectif réaliste.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Un usage ponctuel très rentable",
      text: "Plutôt qu'un lancement permanent, faire tourner la mutation une fois sur le module le plus critique révèle souvent en une heure ce qu'aucune revue n'avait vu : des tests entiers qui ne tuent aucun mutant. L'exercice est instructif même si l'on ne l'intègre jamais à la chaîne — il change la façon dont l'équipe écrit ses assertions ensuite.",
    },
    {
      kind: "text",
      text: "L'outil apporte un bénéfice secondaire souvent plus durable que le score lui-même : il apprend à écrire de meilleures assertions. Après avoir vu un mutant survivre parce qu'un test vérifiait seulement l'absence d'exception, on cesse durablement d'écrire ce genre de test — l'effet persiste bien après qu'on a arrêté de lancer l'outil.",
    },
    {
      kind: "text",
      text: "Signalons enfin que tous les opérateurs de mutation ne se valent pas. Inverser une comparaison ou modifier une borne révèle souvent de vrais trous ; supprimer un appel de journalisation produit un mutant que personne ne devrait chercher à tuer. Restreindre le jeu d'opérateurs aux plus significatifs rend le rapport bien plus exploitable.",
    },
    {
      kind: "text",
      text: "Retenons la formulation qui distingue les deux mesures : la couverture dit si le code a été **traversé**, la mutation dit s'il est **surveillé**. La seconde est la seule à répondre à la question qui intéresse réellement — mes tests détecteraient-ils que ce code est faux ?",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "tests-strat-16",
    difficulty: 2,
    tags: ["tests", "mutation"],
    prompt: "Que signifie un « mutant survivant » ?",
    choices: [
      "Le code a été modifié et aucun test n'a échoué : ce défaut ne serait détecté par personne.",
      "Un test a échoué sur la version mutée, ce qui valide la suite.",
      "La mutation n'a pas pu être compilée et a été ignorée.",
      "Le code muté produit une exception non rattrapée pendant l'exécution.",
    ],
    answer: 0,
    explanation:
      "Un mutant survivant désigne précisément une modification du code que personne ne remarquerait : soit le test manque, soit il existe mais n'affirme rien d'utile, soit la ligne est du code mort. C'est une information que la couverture ne donne jamais — elle dirait simplement que la ligne a été exécutée.",
  },
  {
    kind: "fill",
    id: "tests-strat-17",
    difficulty: 2,
    tags: ["tests", "mutation"],
    prompt: "Complète le raisonnement des tests de mutation.",
    code: {
      language: "text",
      code: `L'outil modifie le code, une mutation a la fois,
puis relance la suite.

· Un test echoue        -> mutant {{1}}
· Tous les tests passent -> mutant {{2}}

Score de mutation = tues / total`,
    },
    blanks: ["tué", "survivant"],
    distractors: ["couvert", "ignoré", "équivalent"],
    explanation:
      "Un mutant **tué** est une bonne nouvelle : la suite a détecté le défaut introduit. Un mutant **survivant** signale que personne ne l'aurait remarqué. Le mutant **équivalent** est un troisième cas, plus subtil : une mutation qui produit un comportement strictement identique, qu'aucun test ne peut tuer — ce qui explique qu'un score de 100 % ne soit pas un objectif réaliste.",
  },
  {
    kind: "recall",
    id: "tests-strat-18",
    difficulty: 3,
    tags: ["tests", "mutation"],
    prompt: "Quelle question pose la mutation que la couverture ne pose pas, et à quel prix ?",
    explanation:
      "La couverture demande « ce code a-t-il été **exécuté** ? », question faible qu'un test sans assertion satisfait entièrement. La mutation demande « ce code, s'il était **faux**, serait-il détecté ? » — c'est-à-dire la seule question qui intéresse réellement. Elle y répond en introduisant des défauts un par un — inverser une comparaison, remplacer une addition par une soustraction, supprimer un appel, renvoyer une valeur nulle — et en relançant la suite sur chaque version. Le prix est le temps : une exécution complète par mutation, soit des milliers de lancements et parfois des heures sur une base entière. On la cible donc sur les zones où l'erreur coûte cher — moteur de tarification, calcul de droits, machine à états — plutôt que de l'appliquer partout. Une limite s'y ajoute : les mutants équivalents, au comportement identique, qu'aucun test ne peut tuer et qui font baisser le score sans qu'il y ait rien à corriger.",
    keyPoints: [
      "Couverture : le code a-t-il été traversé ? Mutation : est-il surveillé ?",
      "Prix : une exécution de la suite par mutation, donc des heures",
      "À cibler sur les zones où l'erreur coûte cher",
      "Les mutants équivalents interdisent un score de 100 %",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Les doublures de test
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "tests-strat-l7",
  title: "Les doublures de test",
  blocks: [
    {
      kind: "text",
      text: "On appelle « mock » à peu près n'importe quelle doublure, ce qui empêche de discuter du bon choix. Le vocabulaire distingue pourtant des objets aux rôles très différents, et cette distinction n'est pas de la pédanterie : elle recouvre exactement la frontière entre tester un comportement et tester une implémentation.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Cinq doublures, cinq usages.",
      code: `// DUMMY — passé pour remplir un paramètre, jamais utilisé
service.calcule(commande, new NullNotifieur());

// STUB — renvoie des réponses prédéfinies
when(tarifs.pour("ART-1")).thenReturn(new Tarif(10));

// SPY — un vrai objet dont on observe les appels
var vraiDepot = spy(new DepotEnMemoire());

// MOCK — un stub dont on VÉRIFIE les interactions
verify(notifieur).envoie(any());

// FAKE — une implémentation réelle mais simplifiée
class DepotEnMemoire implements CommandeDepot {
    private final Map<Long, Commande> map = new HashMap<>();
    public void save(Commande c) { map.put(c.id(), c); }
    public Optional<Commande> byId(Long id) { … }
}`,
    },
    {
      kind: "text",
      text: "La distinction décisive oppose le **stub** et le **mock**. Un stub fournit une entrée : il permet au test de s'exécuter dans des conditions choisies. Un mock vérifie une sortie sous forme d'appel : il affirme que telle interaction a eu lieu. Le premier ne couple à rien, le second couple le test à la façon dont le code s'organise.",
    },
    {
      kind: "text",
      text: "D'où une règle d'usage simple : **stub pour les entrées, assertion pour les sorties**, et mock seulement quand l'appel lui-même est l'effet observable. Un courriel envoyé, un message publié sur une file, un appel à un service de paiement sont des sorties qu'on ne peut vérifier autrement. Un dépôt appelé n'en est pas une — on peut relire la donnée.",
    },
    {
      kind: "comparison",
      title: "Deux façons de remplacer un dépôt",
      left: {
        label: "Simulacre",
        text: "`when(depot.byId(1L)).thenReturn(…)` pour chaque cas. Le test décrit ce que le dépôt répondra, appel par appel. Verbeux, couplé aux signatures, et l'on finit par simuler une base entière — sans jamais vérifier que le vrai dépôt se comporte ainsi.",
      },
      right: {
        label: "Fausse implémentation",
        text: "Un dépôt en mémoire, écrit une fois, partagé par tous les tests. On y range et on en relit réellement. Le test devient lisible, résistant à la refonte, et l'on peut vérifier l'état final plutôt que des appels.",
      },
    },
    {
      kind: "text",
      text: "La fausse implémentation est très sous-utilisée alors qu'elle est souvent le meilleur choix. Écrite une fois, elle sert partout, se comporte comme la vraie sur les aspects qui comptent, et permet d'écrire des tests qui affirment un état — « après traitement, le dépôt contient une commande payée » — bien plus parlants qu'une suite de vérifications d'appels.",
    },
    {
      kind: "text",
      text: "Son risque connu est la divergence : la fausse implémentation peut se comporter différemment de la vraie, et le test reste vert alors que la production échoue. La parade est un jeu de tests commun appliqué aux deux — les mêmes cas, exécutés contre le dépôt en mémoire et contre le vrai sur conteneur — ce qui garantit qu'ils respectent le même contrat.",
    },
    {
      kind: "text",
      text: "Reste la question du périmètre : que faut-il doubler ? La réponse tient en une phrase — ce qui est **hors de votre contrôle** et coûteux ou non déterministe : un service tiers, un envoi réel, l'horloge, un générateur aléatoire. Tout ce qui vous appartient et s'exécute vite gagne à rester réel, y compris la base, désormais bon marché à démarrer.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Trop de simulacres cachent la conception",
      text: "Un test qui doit configurer six doublures pour s'exécuter dit quelque chose du code testé : cette classe dépend de six collaborateurs. La difficulté du test n'est pas un problème de test, c'est un signal de conception. Ajouter une septième doublure traite le symptôme ; découper la classe traite la cause.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le jeu de tests commun, qui empêche la divergence.",
      code: `// Écrit une fois, exécuté contre les DEUX
// implémentations : la fausse et la vraie.
abstract class CommandeDepotContratTest {

    abstract CommandeDepot depot();

    @Test
    void une_commande_enregistree_se_relit() {
        depot().save(new Commande(1L, …));
        assertThat(depot().byId(1L)).isPresent();
    }
}

class DepotEnMemoireTest extends CommandeDepotContratTest {
    CommandeDepot depot() { return new DepotEnMemoire(); }
}

@Testcontainers
class DepotJpaTest extends CommandeDepotContratTest {
    CommandeDepot depot() { return vraiDepot; }
}`,
    },
    {
      kind: "text",
      text: "Retenons la hiérarchie : garder le vrai objet quand c'est possible, une fausse implémentation quand le vrai est lent ou lourd, un stub pour fixer une entrée, et un mock uniquement lorsque l'appel est lui-même ce qu'il faut vérifier. Cette progression donne des tests plus lisibles et nettement plus résistants.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "match",
    id: "tests-strat-19",
    difficulty: 2,
    tags: ["tests", "doublures"],
    prompt: "Associe chaque doublure à son rôle.",
    pairs: [
      { left: "Stub", right: "Fournit une entrée : des réponses prédéfinies" },
      { left: "Mock", right: "Vérifie une interaction : telle méthode a été appelée" },
      { left: "Fake", right: "Une implémentation réelle mais simplifiée, en mémoire" },
      { left: "Spy", right: "Un vrai objet dont on observe les appels" },
    ],
    explanation:
      "La distinction décisive oppose le stub et le mock : le premier fournit une entrée et ne couple à rien, le second affirme qu'une interaction a eu lieu et couple le test à l'organisation du code. D'où la règle — stub pour les entrées, assertion pour les sorties, et mock seulement quand l'appel est lui-même l'effet observable.",
  },
  {
    kind: "spot",
    id: "tests-strat-20",
    difficulty: 3,
    tags: ["tests", "doublures", "conception"],
    prompt: "Ce test signale un problème qui n'est pas un problème de test. Quelle ligne le révèle ?",
    code: {
      language: "java",
      code: `@Test
void valide_une_commande() {
    when(tarifs.pour(any())).thenReturn(tarif);
    when(stocks.disponible(any())).thenReturn(true);
    when(clients.byId(any())).thenReturn(client);
    when(remises.pour(any())).thenReturn(remise);
    when(taxes.taux(any())).thenReturn(0.2);
    when(depot.save(any())).thenReturn(commande);

    service.valide(1L);
}`,
    },
    faultyLine: 3,
    reasons: [
      "Six doublures à configurer signalent que la classe testée dépend de six collaborateurs : c'est un signal de conception.",
      "`any()` ne peut pas être utilisé plusieurs fois dans le même test.",
      "Les appels `when` devraient être remplacés par des `verify` après l'action.",
      "Le test ne contient aucune assertion, ce qui est la seule vraie faute.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'absence d'assertion est bien un défaut, mais le signal le plus intéressant est en amont : il faut six doublures pour que la méthode s'exécute. La difficulté du test n'est pas un problème de test, c'est une information sur le code — cette classe a trop de collaborateurs. Ajouter une septième doublure traite le symptôme, découper la classe traite la cause.",
  },
  {
    kind: "mcq",
    id: "tests-strat-21",
    difficulty: 2,
    tags: ["tests", "doublures"],
    prompt: "Que faut-il doubler dans un test ?",
    choices: [
      "Ce qui est hors de votre contrôle et coûteux ou non déterministe : service tiers, envoi réel, horloge, aléatoire.",
      "Toutes les dépendances de la classe testée, sans exception, pour garantir l'isolation.",
      "Uniquement les classes qui accèdent à la base de données.",
      "Rien : un test qui double quoi que ce soit n'est plus un test valable.",
    ],
    answer: 0,
    explanation:
      "Doubler systématiquement toutes les dépendances produit des tests qui n'exercent aucune couture réelle et cassent à chaque refonte. Ce qui vous appartient et s'exécute vite gagne à rester réel — y compris la base, désormais bon marché à démarrer dans un conteneur. On double ce qu'on ne maîtrise pas : un service tiers, un envoi véritable, l'horloge, l'aléatoire.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Les tests de contrat
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "tests-strat-l8",
  title: "Les tests de contrat",
  blocks: [
    {
      kind: "text",
      text: "Deux services communiquent, chacun avec sa suite de tests, toutes vertes. Le fournisseur renomme un champ de sa réponse, ses tests passent — il a mis à jour les siens. Le consommateur casse en production, parce que ses tests utilisaient une réponse simulée qui, elle, n'a pas changé. Personne n'a rien vu venir.",
    },
    {
      kind: "text",
      text: "C'est l'angle mort structurel des architectures distribuées : chaque service teste sa vision du contrat, et rien ne vérifie que les deux visions coïncident. Le simulacre du consommateur est une **copie figée** d'une réponse d'hier, et plus le temps passe, plus elle s'éloigne de la réalité — sans qu'aucun test ne rougisse.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le mensonge confortable du simulacre.",
      code: `CONSOMMATEUR                      FOURNISSEUR

  test avec réponse simulée :        vraie réponse
  {                                  {
    "id": 1,                           "id": 1,
    "nomClient": "Alice"               "client": "Alice"
  }                                  }
       ✓ vert                             ✓ vert

  → Les deux suites sont vertes.
  → Les deux services sont incompatibles.
  → Personne ne le sait avant la production.`,
    },
    {
      kind: "text",
      text: "Les tests de contrat ferment cet écart en rendant le contrat **exécutable et partagé**. Le consommateur déclare ce dont il a besoin ; ce besoin est publié quelque part ; et la chaîne du fournisseur vérifie, à chaque modification, qu'il continue de le satisfaire. La rupture est détectée chez celui qui la provoque, avant qu'elle n'atteigne qui que ce soit.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le flot, piloté par le consommateur.",
      code: `1. Le consommateur écrit son test avec un simulacre,
   et l'outil enregistre ce simulacre comme CONTRAT :
   « GET /commandes/1 → 200, avec un champ client
     de type chaîne »

2. Le contrat est publié sur un dépôt partagé.

3. La CI du FOURNISSEUR récupère les contrats de tous
   ses consommateurs et rejoue chaque interaction
   contre le vrai service.

4. Renommer « client » fait rougir la CI du
   fournisseur, avec le nom du consommateur concerné.

→ On n'a jamais eu besoin de démarrer les deux
  services ensemble.`,
    },
    {
      kind: "text",
      text: "Le point décisif est la quatrième étape : l'échec se produit chez le fournisseur, au moment du changement, avec le nom du consommateur qui casse. C'est très différent d'un test de bout en bout, qui exigerait de déployer les deux services ensemble, serait lent, et signalerait le problème bien plus tard.",
    },
    {
      kind: "comparison",
      title: "Deux façons de vérifier une intégration",
      left: {
        label: "Bout en bout",
        text: "Déployer les deux services et les faire dialoguer. Réaliste, mais lent, fragile, et il faut un environnement où les bonnes versions coexistent. Ne passe pas l'échelle : quinze services rendent la combinatoire ingérable.",
      },
      right: {
        label: "Tests de contrat",
        text: "Chaque service est testé seul, contre un contrat partagé. Rapide, exécutable en intégration continue, et l'échec désigne le responsable. Ne vérifie en revanche que la **forme** des échanges, pas le comportement métier de l'ensemble.",
      },
    },
    {
      kind: "text",
      text: "Cette limite est importante : un test de contrat garantit que les services se comprennent, pas que le parcours fonctionne. Que la réponse contienne bien un champ `client` ne dit rien de la justesse du montant calculé. Les deux approches sont donc complémentaires — contrats pour la compatibilité, quelques tests de bout en bout pour les parcours critiques.",
    },
    {
      kind: "text",
      text: "Le pilotage par le consommateur a un effet secondaire vertueux : le fournisseur découvre qui utilise quoi. Un champ qu'aucun contrat ne mentionne peut être retiré sans crainte ; un champ présent dans huit contrats ne se touche pas à la légère. Cette information, qu'aucune documentation ne maintient jamais correctement, tombe gratuitement.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Utile dès deux équipes, pas dès deux services",
      text: "Si les deux côtés sont écrits par la même équipe dans le même dépôt, un test d'intégration ordinaire suffit et coûte moins cher. Le contrat devient rentable quand le fournisseur et le consommateur évoluent à des rythmes différents, sous des responsabilités différentes — c'est-à-dire quand personne ne peut plus vérifier les deux d'un coup d'œil.",
    },
    {
      kind: "text",
      text: "Retenons le problème plutôt que l'outil : sans contrat partagé, chaque service teste contre sa propre idée de l'autre, et les deux suites peuvent être vertes alors que l'intégration est cassée. Rendre le contrat exécutable et le vérifier chez le fournisseur est ce qui déplace la détection du jour du déploiement au jour du changement.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "order",
    id: "tests-strat-22",
    difficulty: 3,
    tags: ["tests", "contrat"],
    prompt: "Remets dans l'ordre le flot d'un test de contrat piloté par le consommateur.",
    items: [
      "Le consommateur écrit son test avec un simulacre, enregistré comme contrat",
      "Le contrat est publié sur un dépôt partagé",
      "La CI du fournisseur récupère les contrats de tous ses consommateurs",
      "Chaque interaction est rejouée contre le vrai service du fournisseur",
      "Une rupture fait rougir la CI du fournisseur, en nommant le consommateur concerné",
    ],
    explanation:
      "Le point décisif est la dernière étape : l'échec se produit chez celui qui provoque la rupture, au moment du changement, avec le nom du consommateur affecté. C'est très différent d'un test de bout en bout, qui exigerait de déployer les deux services ensemble et signalerait le problème bien plus tard.",
  },
  {
    kind: "mcq",
    id: "tests-strat-23",
    difficulty: 2,
    tags: ["tests", "contrat"],
    prompt: "Quel problème les tests de contrat résolvent-ils ?",
    choices: [
      "Deux suites vertes alors que les services sont incompatibles : chacun teste sa propre idée du contrat.",
      "La lenteur des tests de bout en bout sur un environnement partagé.",
      "L'absence de documentation des API exposées par un service.",
      "La difficulté à générer des jeux de données réalistes pour les tests.",
    ],
    answer: 0,
    explanation:
      "Le simulacre du consommateur est une copie figée d'une réponse d'hier : le fournisseur peut renommer un champ, mettre ses propres tests à jour, et les deux suites resteront vertes alors que l'intégration est cassée. Le test de contrat rend le contrat exécutable et le fait vérifier chez le fournisseur, ce qui déplace la détection du jour du déploiement au jour du changement.",
  },
  {
    kind: "fill",
    id: "tests-strat-24",
    difficulty: 2,
    tags: ["tests", "contrat"],
    prompt: "Complète la répartition des rôles dans un test de contrat.",
    code: {
      language: "text",
      code: `Le {{1}} declare ce dont il a besoin, sous forme
d'un contrat publie.

La chaine d'integration du {{2}} rejoue chaque
interaction du contrat contre son vrai service.`,
    },
    blanks: ["consommateur", "fournisseur"],
    distractors: ["testeur", "orchestrateur", "client final"],
    explanation:
      "Le pilotage part du consommateur, qui seul sait ce qu'il utilise réellement. La vérification a lieu chez le fournisseur, seul capable de détecter qu'un changement rompt un contrat — et de le voir au moment où il le provoque. Cet ordre a un effet secondaire vertueux : le fournisseur découvre qui utilise quoi, information qu'aucune documentation ne maintient correctement.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "tests-strategie",
  title: "Stratégie de test : ce qu'on teste, et ce que ça prouve",
  objective:
    "Décider quoi tester et comment : arbitrer entre protection, résistance à la refonte, rapidité et coût, situer pyramide et trophée, écrire des tests qui survivent aux refontes, lire une couverture sans se tromper sur ce qu'elle mesure, savoir ce qu'apporte la mutation, choisir la bonne doublure, et détecter une incompatibilité entre services avant la production.",
  prerequisites: ["tests-tdd"],
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
