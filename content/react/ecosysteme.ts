/**
 * React — Écosystème (référentiel 6.3) : Vite, tests de composants, MSW,
 * ESLint, appels API, accessibilité.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Vite : pourquoi le démarrage est instantané
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "react-eco-l1",
  title: "Vite : pourquoi le démarrage est instantané",
  blocks: [
    {
      kind: "text",
      text: "Les outils de construction de la génération précédente assemblaient toute l'application avant de pouvoir en servir la première ligne. Sur un projet de quelques milliers de fichiers, cela signifiait attendre une minute au démarrage, puis plusieurs secondes après chaque modification — un délai suffisant pour perdre le fil de ce qu'on faisait.",
    },
    {
      kind: "text",
      text: "Vite part d'un constat simple : les navigateurs savent désormais charger des modules nativement. Il n'est donc plus nécessaire d'assembler quoi que ce soit en développement — il suffit de servir chaque fichier tel quel, transformé à la volée, et de laisser le navigateur demander ce dont il a besoin.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Deux stratégies, deux courbes.",
      code: `ASSEMBLAGE PRÉALABLE
  Démarrage : analyser, transformer et assembler
  TOUS les fichiers → une minute sur un gros projet
  Modification : reconstruire le morceau concerné
  → le temps croît avec la taille du projet

MODULES NATIFS (Vite)
  Démarrage : servir index.html, c'est tout
  → instantané, quelle que soit la taille
  Le navigateur demande les modules dont il a besoin,
  Vite les transforme un par un, à la demande
  Modification : retransformer UN fichier
  → constant, quelle que soit la taille`,
    },
    {
      kind: "text",
      text: "La propriété décisive est que ces temps ne dépendent plus de la taille du projet. Un projet de dix fichiers et un projet de dix mille démarrent aussi vite, parce que rien n'est fait d'avance : le travail suit ce que le navigateur demande réellement, et il ne demande que ce qui est affiché.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Deux moteurs, deux moments.",
      code: `// DÉVELOPPEMENT : esbuild, écrit en Go
//  · transforme TypeScript et JSX très vite
//  · ne vérifie PAS les types — il les efface
//  · pré-assemble les dépendances une fois

// PRODUCTION : Rollup
//  · assemble réellement, découpe, optimise
//  · élimine le code mort

// Conséquence à connaître : une erreur de type
// n'empêche PAS le serveur de développement de
// démarrer. La vérification doit être lancée à
// part — dans l'éditeur, et en intégration.
//   "typecheck": "tsc --noEmit"`,
    },
    {
      kind: "text",
      text: "Ce point surprend souvent : le serveur de développement affiche l'application alors que le code ne compilerait pas. C'est délibéré — la transformation et la vérification sont deux travaux distincts, et les séparer permet à la première d'être quasi instantanée. Mais cela impose d'avoir une vérification de types lancée ailleurs, faute de quoi les erreurs ne sont découvertes qu'au build.",
    },
    {
      kind: "comparison",
      title: "Deux environnements, volontairement différents",
      left: {
        label: "Développement",
        text: "Modules natifs servis à la demande, aucune optimisation, transformation minimale. Optimisé pour la boucle de retour : démarrage immédiat, rechargement en quelques dizaines de millisecondes.",
      },
      right: {
        label: "Production",
        text: "Assemblage complet, découpage, élimination du code mort, minification. Optimisé pour le chargement chez l'utilisateur. Le résultat peut donc différer — ce qui explique les rares bugs qui n'apparaissent qu'après construction.",
      },
    },
    {
      kind: "text",
      text: "Cette différence est le principal reproche fait à l'approche, et il est réel : un comportement lié à l'ordre d'évaluation des modules ou à l'élimination du code mort peut n'apparaître qu'en production. La parade est simple et trop rarement appliquée — lancer une prévisualisation de la construction avant de livrer, ce qui sert exactement le résultat de production en local.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les variables d'environnement sont publiques",
      text: "Tout ce qui est exposé au code client est remplacé littéralement à la construction et se retrouve en clair dans les fichiers livrés. Une clé d'API placée là est publiée, même si le dépôt est privé. Seules les valeurs réellement publiques — une URL d'API, un identifiant de client public — y ont leur place ; tout secret doit rester côté serveur.",
    },
    {
      kind: "text",
      text: "Le pré-assemblage des dépendances mérite une explication, car il semble contredire le principe. Les bibliothèques du dossier de dépendances sont, elles, assemblées une fois au premier démarrage : elles ne changent presque jamais, et certaines sont découpées en centaines de petits fichiers que le navigateur devrait demander un par un. Les regrouper évite des milliers de requêtes pour un coût payé une seule fois.",
    },
    {
      kind: "text",
      text: "C'est un bon exemple de compromis assumé : on applique le principe général — ne rien faire d'avance — sauf là où il produirait l'effet inverse. Le résultat est mis en cache, et le pré-assemblage n'est refait que lorsque la liste des dépendances change, ce qui explique le démarrage plus long qui suit une installation.",
    },
    {
      kind: "text",
      text: "Retenons l'idée centrale : ne rien faire d'avance, transformer à la demande, et réserver l'assemblage à la production. C'est ce qui rend les temps indépendants de la taille du projet — et ce qui impose, en contrepartie, de vérifier les types séparément et de tester la construction avant de livrer.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "react-eco-01",
    difficulty: 2,
    tags: ["react", "outillage"],
    prompt: "Pourquoi le serveur de développement de Vite démarre-t-il instantanément quelle que soit la taille du projet ?",
    choices: [
      "Il n'assemble rien : il sert les modules natifs à la demande et ne transforme que les fichiers réellement demandés.",
      "Il conserve un cache d'assemblage complet entre deux démarrages.",
      "Il assemble en parallèle sur tous les cœurs disponibles.",
      "Il ne charge que les fichiers modifiés depuis le dernier démarrage.",
    ],
    answer: 0,
    explanation:
      "Le navigateur sait charger des modules nativement : il n'est donc plus nécessaire d'assembler en développement. Le travail suit ce que le navigateur demande réellement — et il ne demande que ce qui est affiché — si bien que le temps de démarrage ne dépend plus du nombre de fichiers du projet.",
  },
  {
    kind: "match",
    id: "react-eco-02",
    difficulty: 2,
    tags: ["react", "outillage"],
    prompt: "Associe chaque outil ou étape à son rôle.",
    pairs: [
      { left: "esbuild", right: "Transforme TypeScript et JSX en développement, sans vérifier les types" },
      { left: "Rollup", right: "Assemble, découpe et optimise pour la production" },
      { left: "tsc --noEmit", right: "Vérifie les types, séparément de la transformation" },
      { left: "vite preview", right: "Sert le résultat de production en local, avant de livrer" },
    ],
    explanation:
      "La séparation entre transformation et vérification est ce qui rend la boucle de développement instantanée — mais elle impose de lancer la vérification ailleurs, dans l'éditeur et en intégration continue, sans quoi les erreurs de type ne sont découvertes qu'à la construction.",
  },
  {
    kind: "recall",
    id: "react-eco-03",
    difficulty: 2,
    tags: ["react", "outillage"],
    prompt: "Quelles conséquences pratiques a la différence entre développement et production ?",
    explanation:
      "Deux, qu'il faut compenser explicitement. D'abord, le serveur de développement **ne vérifie pas les types** : il les efface pour aller vite, si bien que l'application s'affiche alors que le code ne compilerait pas. Il faut donc une vérification lancée à part — dans l'éditeur, et surtout en intégration continue avec `tsc --noEmit` — faute de quoi les erreurs ne sont découvertes qu'au moment de construire, souvent juste avant une livraison. Ensuite, le **résultat peut différer** : en développement les modules sont servis tels quels, en production ils sont assemblés, découpés et débarrassés du code mort. Un comportement lié à l'ordre d'évaluation des modules ou à une élimination trop zélée peut donc n'apparaître qu'après construction. La parade est de servir en local le résultat de production avant de livrer — cela prend une minute et attrape exactement cette catégorie de bugs.",
    keyPoints: [
      "Le serveur de développement ne vérifie pas les types",
      "Prévoir tsc --noEmit dans l'éditeur et en intégration",
      "Le résultat de production diffère : assemblage et code mort",
      "Servir la construction en local avant de livrer",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Tester un composant
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "react-eco-l2",
  title: "Tester un composant",
  blocks: [
    {
      kind: "text",
      text: "Un test de composant peut s'écrire de deux façons radicalement différentes, et le choix décide de sa valeur. On peut vérifier l'**état interne** — quel est le contenu de tel état, telle fonction a-t-elle été appelée — ou vérifier ce que l'**utilisateur voit et fait**. La première approche casse à chaque refonte, la seconde survit.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Le test qui ressemble à un usage réel.",
      code: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("valider sans nom affiche une erreur", async () => {
  const utilisateur = userEvent.setup();
  render(<Formulaire onSubmit={vi.fn()} />);

  // On cherche comme un utilisateur : par rôle et par nom
  await utilisateur.click(
      screen.getByRole("button", { name: /valider/i }));

  // On vérifie ce qu'il voit
  expect(screen.getByText(/le nom est obligatoire/i))
      .toBeInTheDocument();
});`,
    },
    {
      kind: "text",
      text: "La bibliothèque de test de React est construite autour d'un principe unique : plus un test ressemble à la façon dont le logiciel est utilisé, plus il inspire confiance. Elle ne donne donc aucun accès à l'état interne — c'est une contrainte délibérée, qui pousse à écrire des tests résistants aux refontes.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Trois familles de requêtes, trois usages.",
      code: `// getBy… : l'élément DOIT être là. Échoue sinon.
screen.getByRole("button", { name: /valider/i });

// queryBy… : renvoie null si absent. Pour vérifier
// qu'une chose N'EST PAS là.
expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();

// findBy… : asynchrone, attend l'apparition.
// Pour tout ce qui arrive après un chargement.
await screen.findByText(/commande enregistrée/i);

// Ordre de préférence des sélecteurs :
//  1. getByRole — ce que voit une aide technique
//  2. getByLabelText — pour les champs de formulaire
//  3. getByText — pour le contenu visible
//  ✗ getByTestId — en dernier recours seulement`,
    },
    {
      kind: "text",
      text: "L'ordre de préférence des sélecteurs n'est pas une question de style : rechercher par **rôle** vérifie au passage que l'élément est correctement exposé aux technologies d'assistance. Un bouton qui n'est pas trouvable par son rôle est aussi un bouton qu'un lecteur d'écran n'annoncera pas — le test rend l'accessibilité vérifiable sans effort supplémentaire.",
    },
    {
      kind: "comparison",
      title: "Deux façons de simuler une interaction",
      left: {
        label: "fireEvent",
        text: "Déclenche un événement isolé. `fireEvent.click` n'émet ni survol, ni pression, ni relâchement, ni changement de focus. Rapide, mais ne reproduit pas ce qu'un vrai clic provoque — un composant peut passer le test et échouer en usage réel.",
      },
      right: {
        label: "userEvent",
        text: "Simule la séquence complète d'une interaction humaine, y compris le focus et les événements intermédiaires. Plus lent, asynchrone, et nettement plus fidèle. C'est la forme à utiliser par défaut.",
      },
    },
    {
      kind: "text",
      text: "La différence se manifeste sur les cas réels : un champ qui valide au moment où il perd le focus, un menu qui se ferme au survol, un bouton désactivé tant qu'on n'a pas relâché. Avec la simulation d'événement isolé, ces comportements ne sont jamais exercés — le test passe, et le bug reste.",
    },
    {
      kind: "text",
      text: "Le sélecteur par attribut de test garde une utilité résiduelle, pour les éléments sans rôle ni texte stable — un conteneur, un graphique. Mais il ne vérifie rien de ce que l'utilisateur perçoit, et son usage systématique est le signe d'une interface difficile à atteindre autrement, donc probablement peu accessible.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le message d'erreur est un guide",
      text: "Quand une requête échoue, la bibliothèque affiche le DOM rendu et suggère des sélecteurs plus appropriés. Prendre le temps de lire cette sortie évite l'erreur classique qui consiste à remplacer un sélecteur par rôle qui échoue par un identifiant de test — ce qui fait disparaître le symptôme sans traiter la cause, souvent un problème d'accessibilité réel.",
    },
    {
      kind: "text",
      text: "Un dernier piège mérite d'être signalé : oublier d'attendre une interaction. Comme la simulation d'interaction est asynchrone, omettre l'attente produit un test qui vérifie l'état **avant** que l'action n'ait eu lieu. Il échoue de façon intermittente selon la vitesse de la machine, ce qui en fait l'une des causes d'instabilité les plus fréquentes — et la règle d'analyse sur les promesses flottantes l'attrape.",
    },
    {
      kind: "text",
      text: "Le nettoyage entre les tests est en revanche automatique avec les versions récentes : le DOM est vidé après chaque test sans qu'on ait à l'écrire. Le savoir évite d'ajouter des nettoyages manuels superflus, et surtout de conclure à tort qu'un test en pollue un autre alors que la cause est ailleurs.",
    },
    {
      kind: "text",
      text: "Retenons les trois règles : chercher par rôle avant tout, simuler les interactions complètes plutôt que des événements isolés, et ne jamais atteindre l'état interne. Ces trois contraintes produisent des tests qui survivent aux refontes et qui vérifient au passage que l'interface est réellement atteignable.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "fill",
    id: "react-eco-04",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Complète : chercher un bouton comme le ferait une aide technique, et attendre un contenu asynchrone.",
    code: {
      language: "tsx",
      code: `await utilisateur.click(
    screen.{{1}}("button", { name: /valider/i }));

// Apparaît après le retour de l'API
await screen.{{2}}(/commande enregistrée/i);`,
    },
    blanks: ["getByRole", "findByText"],
    distractors: ["getByTestId", "queryByRole", "getByText", "waitForText"],
    explanation:
      "`getByRole` cherche comme le ferait un lecteur d'écran : si le bouton n'est pas trouvable ainsi, il ne sera pas annoncé non plus. `findBy…` est la famille asynchrone, qui attend l'apparition de l'élément — `getByText` échouerait immédiatement puisque le contenu n'est pas encore là.",
  },
  {
    kind: "mcq",
    id: "react-eco-05",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Pourquoi préférer `userEvent` à `fireEvent` ?",
    choices: [
      "Il simule la séquence complète d'une interaction — focus, pression, relâchement — là où `fireEvent` déclenche un événement isolé.",
      "Il est synchrone, ce qui simplifie l'écriture des tests.",
      "Il permet d'accéder à l'état interne du composant testé.",
      "Il fonctionne sans environnement DOM simulé.",
    ],
    answer: 0,
    explanation:
      "`fireEvent.click` n'émet ni survol, ni changement de focus, ni événements intermédiaires. Un champ qui valide à la perte du focus, un menu qui se ferme au survol ou un bouton dépendant du relâchement ne sont donc jamais exercés : le test passe et le bug reste. `userEvent` est asynchrone et plus lent, mais fidèle.",
  },
  {
    kind: "recall",
    id: "react-eco-06",
    difficulty: 2,
    tags: ["react", "tests", "accessibilite"],
    prompt: "Pourquoi chercher un élément par son rôle plutôt que par un identifiant de test ?",
    explanation:
      "Parce que le rôle est ce que **perçoit une technologie d'assistance**. Chercher un bouton par `getByRole(\"button\", { name: … })` vérifie au passage qu'il est exposé comme un bouton et qu'il porte un nom accessible : s'il n'est pas trouvable ainsi, un lecteur d'écran ne l'annoncera pas non plus. Le test rend donc l'accessibilité vérifiable sans effort supplémentaire, ce qu'aucun identifiant de test ne fait. L'identifiant, lui, ne vérifie rien de ce que l'utilisateur perçoit : il est invisible, arbitraire, et son usage systématique signale une interface difficile à atteindre autrement — donc probablement peu accessible. L'erreur classique consiste à remplacer un sélecteur par rôle qui échoue par un identifiant de test : cela fait disparaître le symptôme sans traiter la cause, qui est souvent un vrai défaut d'accessibilité. L'identifiant garde une utilité résiduelle pour les éléments sans rôle ni texte stable — un conteneur, un graphique.",
    keyPoints: [
      "Le rôle est ce que perçoit une aide technique",
      "Le test vérifie l'accessibilité sans effort supplémentaire",
      "Un identifiant de test ne vérifie rien de perceptible",
      "Le remplacer masque souvent un vrai défaut d'accessibilité",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Ce qu'il faut tester
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "react-eco-l3",
  title: "Ce qu'il faut tester",
  blocks: [
    {
      kind: "text",
      text: "Savoir écrire un test ne dit pas lesquels écrire. Beaucoup de suites de tests de composants sont volumineuses, lentes et sans valeur : elles vérifient que React fonctionne, que les props transmises sont affichées, que le rendu correspond à une capture figée. Elles cassent à chaque changement visuel et ne détectent aucun défaut réel.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Trois tests qui n'apportent rien.",
      code: `// 1. Vérifie que React rend une prop
test("affiche le titre", () => {
  render(<Carte titre="Bonjour" />);
  expect(screen.getByText("Bonjour")).toBeInTheDocument();
});

// 2. Capture figée : casse au moindre changement de
//    classe CSS, et personne ne relit le diff
test("correspond à la capture", () => {
  expect(render(<Carte />).container).toMatchSnapshot();
});

// 3. Teste la bibliothèque, pas le composant
test("le bouton est cliquable", async () => {
  render(<Bouton onClick={fn} />);
  await utilisateur.click(screen.getByRole("button"));
  expect(fn).toHaveBeenCalled();
});`,
    },
    {
      kind: "text",
      text: "Le point commun de ces trois tests est qu'aucun ne peut échouer sur un défaut réel : ils échouent seulement si l'on casse volontairement ce qu'ils décrivent. Ils coûtent en revanche à chaque évolution, et leur accumulation transforme la suite en frein — exactement l'inverse de ce qu'on attendait.",
    },
    {
      kind: "comparison",
      title: "Deux natures de composant",
      left: {
        label: "Présentation",
        text: "Reçoit des props, affiche. Aucune décision, aucun état, aucun effet. Un test n'y vérifierait que le fonctionnement de React lui-même. On ne les teste pas unitairement — ils sont exercés par les tests des composants qui les utilisent.",
      },
      right: {
        label: "Comportement",
        text: "Prend des décisions : validation, conditions d'affichage, enchaînement d'états, effets de bord. C'est là qu'un test a de la valeur, parce qu'une règle peut être fausse et que le test le détectera.",
      },
    },
    {
      kind: "text",
      text: "Ce tri élimine l'essentiel du bruit. Un composant qui n'a ni condition, ni état, ni effet n'a rien à vérifier : il sera couvert par les tests des composants qui s'en servent, et l'on n'aura pas à le maintenir séparément. À l'inverse, un formulaire avec des règles de validation mérite plusieurs tests, un par règle.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Les tests qui valent la peine d'être écrits.",
      code: `// Une règle métier
test("refuse une quantité supérieure au stock", async () => { … });

// Un état visible que l'utilisateur doit percevoir
test("affiche un indicateur pendant le chargement", …);
test("affiche un message quand la liste est vide", …);
test("affiche une erreur si l'API échoue", …);

// Un enchaînement complet, sur un parcours réel
test("remplir puis valider enregistre et confirme", …);

// Une régression corrigée : le meilleur des tests,
// il documente un vrai défaut qui s'est produit
test("garde le filtre après retour arrière", …);`,
    },
    {
      kind: "text",
      text: "Les trois états d'une donnée distante — chargement, erreur, vide — méritent une mention particulière, car ce sont les plus souvent oubliés en développement comme en test. Le cas vide est le champion de l'oubli : une liste sans résultat qui affiche un cadre blanc, sans dire si la recherche n'a rien donné ou si le chargement a échoué.",
    },
    {
      kind: "text",
      text: "Le test de non-régression est le plus rentable de tous. Écrit après la correction d'un défaut réel, il documente un cas que quelqu'un a effectivement rencontré, et il empêche sa réapparition. Contrairement aux tests écrits par anticipation, on sait avec certitude qu'il correspond à quelque chose.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les captures figées se relisent rarement",
      text: "Une capture de plusieurs centaines de lignes qui change à chaque modification de mise en forme finit par être mise à jour en masse sans relecture. Elle ne détecte alors plus rien tout en produisant du bruit à chaque changement. Elles restent utiles sur de petites structures stables — le résultat d'une fonction de transformation, par exemple — et pas sur du rendu.",
    },
    {
      kind: "text",
      text: "Une question revient souvent : faut-il tester les hooks personnalisés séparément ? La réponse suit le même critère que pour les composants. Un hook qui porte une véritable logique — une machine à états, une règle de calcul, un enchaînement conditionnel — mérite ses propres tests, qui seront rapides et couvriront de nombreux cas. Un hook qui se contente d'assembler deux autres hooks n'a rien à vérifier seul.",
    },
    {
      kind: "text",
      text: "Le même raisonnement vaut pour les fonctions utilitaires : une fonction de formatage de date, un calcul de remise ou une validation sont exactement ce qu'un test unitaire vérifie le mieux — entrée, sortie, aucun rendu, quelques millisecondes. Les extraire du composant pour les tester ainsi est souvent le meilleur découpage possible.",
    },
    {
      kind: "text",
      text: "Retenons le critère : un test vaut la peine s'il peut échouer sur un défaut réel. Décisions, états visibles, enchaînements et régressions corrigées le permettent ; l'affichage d'une prop et les captures de rendu, non. Ce tri seul divise souvent par deux la taille d'une suite tout en augmentant sa valeur.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "spot",
    id: "react-eco-07",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Ce test ne peut détecter aucun défaut réel. Quelle ligne le montre ?",
    code: {
      language: "tsx",
      code: `test("affiche le titre", () => {
  render(<Carte titre="Bonjour" />);

  expect(screen.getByText("Bonjour")).toBeInTheDocument();
});`,
    },
    faultyLine: 4,
    reasons: [
      "L'assertion vérifie que React affiche une prop : elle ne peut échouer que si l'on casse volontairement le composant.",
      "`getByText` devrait être remplacé par `getByRole` pour être valide.",
      "Il manque un `await` devant l'appel à `render`.",
      "Le test ne nettoie pas le DOM après exécution.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un composant de présentation sans condition, sans état et sans effet n'a rien à vérifier : le test constate que React fonctionne. Il coûte pourtant à chaque évolution. Ces composants sont exercés par les tests de ceux qui les utilisent ; l'effort doit aller sur les décisions, les états visibles et les enchaînements.",
  },
  {
    kind: "mcq",
    id: "react-eco-08",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Quel test de composant a le meilleur rapport valeur sur coût ?",
    choices: [
      "Un test écrit après la correction d'un défaut réel, qui documente le cas et empêche sa réapparition.",
      "Une capture figée du rendu complet, mise à jour à chaque modification.",
      "Un test par prop, vérifiant que chacune s'affiche correctement.",
      "Un test vérifiant que chaque gestionnaire d'événement est bien appelé.",
    ],
    answer: 0,
    explanation:
      "Contrairement aux tests écrits par anticipation, on sait avec certitude qu'un test de non-régression correspond à quelque chose : quelqu'un a rencontré ce défaut. Les captures de rendu changent à chaque modification de mise en forme et finissent mises à jour en masse sans relecture — elles ne détectent alors plus rien tout en produisant du bruit.",
  },
  {
    kind: "recall",
    id: "react-eco-09",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Quels états d'une interface faut-il penser à tester, et lequel est le plus oublié ?",
    explanation:
      "Les trois états d'une donnée distante : le **chargement**, l'**erreur** et le **vide**. C'est le dernier qu'on oublie presque toujours, en développement comme en test, parce que le jeu de données de développement n'est jamais vide. L'utilisateur se retrouve alors devant un cadre blanc, sans pouvoir distinguer une recherche sans résultat, un filtre trop restrictif ou un chargement qui a silencieusement échoué — trois situations qui appellent trois actions différentes. S'y ajoutent les **décisions** du composant — chaque règle de validation, chaque condition d'affichage — les **enchaînements** complets sur un parcours réel, et les **régressions corrigées**, qui sont les tests les plus rentables puisqu'on sait avec certitude qu'ils correspondent à un défaut réellement rencontré. Le critère qui trie tout le reste : un test vaut la peine s'il peut échouer sur un défaut réel, et non seulement si l'on casse volontairement ce qu'il décrit.",
    keyPoints: [
      "Chargement, erreur, vide — le vide est le plus oublié",
      "Les décisions : une règle de validation par test",
      "Les enchaînements sur un parcours réel",
      "Les régressions corrigées : on sait qu'elles correspondent à un cas",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Simuler le réseau
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "react-eco-l4",
  title: "Simuler le réseau",
  blocks: [
    {
      kind: "text",
      text: "Un composant qui charge des données pose une question de test : que mettre à la place du serveur ? La réponse spontanée consiste à remplacer la fonction de requête par un simulacre — et c'est celle qui produit les tests les moins fiables, pour une raison qui n'apparaît qu'à l'usage.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Remplacer la fonction : ce qui n'est plus exercé.",
      code: `vi.mock("./api");
vi.mocked(api.chargeCommandes).mockResolvedValue([…]);

// Le test ne passe plus par :
//  · la construction de l'URL
//  · les en-têtes, l'authentification
//  · la sérialisation du corps
//  · la lecture du code de statut
//  · la désérialisation et la gestion d'erreur
//
// Or c'est là que sont la plupart des défauts.
// Et si la signature de l'API change, le simulacre
// continue de renvoyer l'ancienne forme : le test
// reste vert alors que l'application est cassée.`,
    },
    {
      kind: "text",
      text: "Le dernier point est le plus grave : un simulacre est une **copie figée** de ce que l'API renvoyait le jour où on l'a écrit. Le contrat peut évoluer sans que le test s'en aperçoive, exactement comme dans le cas des tests de contrat entre services. Le test devient alors une vérification de sa propre fiction.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Intercepter au niveau réseau : tout le reste est réel.",
      code: `import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const serveur = setupServer(
  http.get("/api/commandes", () =>
      HttpResponse.json([{ id: 1, total: 120 }])),
);

beforeAll(() => serveur.listen());
afterEach(() => serveur.resetHandlers());
afterAll(() => serveur.close());

// Le composant appelle fetch normalement : URL,
// en-têtes, statut, désérialisation — tout est
// exercé. Seul le transport est intercepté.`,
    },
    {
      kind: "text",
      text: "L'interception au niveau du réseau change la nature du test : le code applicatif n'est pas modifié, il fait un véritable appel qui est capté au dernier moment. On vérifie donc la construction de l'URL, les en-têtes, le traitement du code de statut et la désérialisation — tout ce qu'un simulacre de fonction court-circuitait.",
    },
    {
      kind: "comparison",
      title: "Deux endroits où couper",
      left: {
        label: "Au niveau de la fonction",
        text: "Rapide à écrire, mais court-circuite tout le chemin réel. Le test devient dépendant de la forme interne du client d'API, et reste vert quand le contrat de l'API change. Sa valeur diminue à mesure que l'application vieillit.",
      },
      right: {
        label: "Au niveau du réseau",
        text: "Le code applicatif est intact et fait un vrai appel. Les définitions d'interception sont partagées entre tests, développement et démonstration, ce qui garantit qu'elles restent réalistes — et leur divergence se remarque vite.",
      },
    },
    {
      kind: "text",
      text: "Le partage des définitions entre les tests et le mode de développement est un bénéfice souvent décisif. On peut développer une interface avant que l'API n'existe, avec des réponses réalistes, puis basculer sur le vrai serveur sans rien changer au code — et les mêmes définitions servent à écrire les tests.",
    },
    {
      kind: "text",
      text: "Les cas d'erreur deviennent aussi faciles à produire que les cas nominaux. Renvoyer un code 500, un délai long ou une réponse malformée demande une ligne, là où il fallait auparavant configurer un simulacre pour rejeter — et l'on teste alors réellement le chemin d'erreur du client, y compris le traitement du statut.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réinitialiser entre les tests",
      text: "Une définition ajoutée pour un cas particulier — une erreur, une réponse vide — doit être retirée après le test, sans quoi elle s'applique aux suivants et produit des échecs qui dépendent de l'ordre d'exécution. C'est la forme d'instabilité la plus désagréable, et un simple appel de réinitialisation dans le nettoyage de chaque test l'évite entièrement.",
    },
    {
      kind: "text",
      text: "Un détail pratique mérite d'être connu : le même outil fonctionne dans le navigateur et côté exécution de tests, avec des mécanismes différents — un agent de service dans le premier cas, une interception des requêtes dans le second — mais les mêmes définitions. C'est ce qui rend le partage réellement possible plutôt que théorique.",
    },
    {
      kind: "text",
      text: "Une précaution s'impose toutefois : ces définitions ne sont pas un contrat vérifié. Rien ne garantit qu'elles correspondent à ce que l'API renvoie réellement, et elles peuvent diverger silencieusement. L'usage quotidien en développement limite fortement ce risque, mais seul un test de contrat, ou un test d'intégration contre le vrai service, apporte une garantie.",
    },
    {
      kind: "text",
      text: "Retenons la règle : intercepter le plus tard possible. Plus le point de coupure est proche du réseau, plus le test exerce de code réel — et moins il risque de rester vert pendant que l'application est cassée.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "react-eco-10",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Pourquoi intercepter au niveau réseau plutôt que remplacer la fonction de requête ?",
    choices: [
      "Le code applicatif fait un vrai appel : URL, en-têtes, statut et désérialisation sont réellement exercés.",
      "L'interception réseau est plus rapide à l'exécution.",
      "Elle permet de tester sans environnement DOM simulé.",
      "Elle évite d'avoir à écrire des assertions sur le résultat.",
    ],
    answer: 0,
    explanation:
      "Remplacer la fonction court-circuite tout le chemin réel — construction de l'URL, en-têtes, authentification, traitement du code de statut, désérialisation — c'est-à-dire là où se trouvent la plupart des défauts. Pire, le simulacre est une copie figée : le contrat de l'API peut changer sans que le test s'en aperçoive.",
  },
  {
    kind: "order",
    id: "react-eco-11",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Remets dans l'ordre la mise en place d'une interception réseau dans une suite de tests.",
    items: [
      "Déclarer les définitions par défaut, partagées avec le mode développement",
      "Démarrer l'interception avant l'ensemble des tests",
      "Ajouter au besoin une définition spécifique dans un test — une erreur, une réponse vide",
      "Réinitialiser les définitions après chaque test",
      "Arrêter l'interception à la fin de la suite",
    ],
    explanation:
      "La réinitialisation après chaque test est l'étape à ne pas oublier : sans elle, une définition ajoutée pour un cas particulier s'applique aux tests suivants et produit des échecs qui dépendent de l'ordre d'exécution — la forme d'instabilité la plus désagréable à diagnostiquer.",
  },
  {
    kind: "recall",
    id: "react-eco-12",
    difficulty: 2,
    tags: ["react", "tests"],
    prompt: "Quel bénéfice, au-delà des tests, apporte l'interception réseau ?",
    explanation:
      "Le **partage des définitions** entre les tests, le développement et les démonstrations. Les mêmes descriptions de réponses servent à développer une interface avant que l'API n'existe, avec des données réalistes, puis à écrire les tests, puis éventuellement à faire tourner une démonstration hors ligne. Ce partage a un effet vertueux : comme ces définitions sont utilisées quotidiennement, leur divergence par rapport à l'API réelle se remarque rapidement — alors qu'un simulacre enfermé dans un fichier de test peut rester faux pendant des mois sans que personne ne s'en aperçoive. S'y ajoute la facilité à produire des cas d'erreur : renvoyer un code 500, un délai long ou une réponse malformée demande une ligne, là où il fallait auparavant configurer un simulacre pour rejeter — et l'on teste alors réellement le chemin d'erreur du client, traitement du code de statut compris.",
    keyPoints: [
      "Mêmes définitions pour les tests, le développement et les démonstrations",
      "Développer avant que l'API n'existe, sans changer le code ensuite",
      "L'usage quotidien fait remarquer la divergence rapidement",
      "Les cas d'erreur deviennent aussi simples que les cas nominaux",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Les règles qui attrapent les bugs
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "react-eco-l5",
  title: "Les règles qui attrapent les bugs",
  blocks: [
    {
      kind: "text",
      text: "On associe souvent l'analyse statique au style — points-virgules, guillemets, indentation — alors que c'est la partie la moins intéressante et celle qu'un formateur automatique règle définitivement. Les règles qui comptent sont celles qui détectent des **défauts réels**, et il en existe un petit nombre dont l'effet est disproportionné.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "La règle la plus rentable de l'écosystème React.",
      code: `function Liste({ filtre }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    charge(filtre).then(setItems);
  }, []);          // ← « filtre » manquant

  // L'effet capture le filtre du PREMIER rendu.
  // Changer le filtre ne recharge rien : la liste
  // reste figée, sans erreur, sans avertissement.
  // La règle sur les dépendances des hooks signale
  // exactement cette omission.
}`,
    },
    {
      kind: "text",
      text: "Cette fermeture périmée est l'un des bugs React les plus fréquents et les plus déroutants : rien ne casse, l'interface affiche simplement des données qui ne correspondent plus. La règle sur les dépendances des effets le signale à l'écriture, ce qui en fait probablement la règle d'analyse la plus rentable de tout l'écosystème.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Trois autres règles qui valent leur activation.",
      code: `// Promesse non attendue : l'erreur disparaît
//   no-floating-promises
sauvegarde();            // ← signalé
await sauvegarde();      // ou .catch(…)

// any explicite : la vérification se désactive
// et se propage
//   no-explicit-any

// Import non utilisé : détecte le code mort et les
// restes de refonte
//   no-unused-vars

// Et surtout : formatage délégué à un outil dédié,
// jamais discuté en revue.`,
    },
    {
      kind: "text",
      text: "La promesse non attendue mérite l'attention : une fonction asynchrone appelée sans `await` ni `catch` produit un rejet non géré si elle échoue. Le traitement n'a pas eu lieu, aucune erreur ne remonte, et le symptôme apparaît ailleurs — une donnée manquante, un enregistrement qui n'a pas été fait. La règle rend ces appels visibles.",
    },
    {
      kind: "comparison",
      title: "Deux catégories de règles",
      left: {
        label: "Style",
        text: "Guillemets, virgules finales, indentation, ordre des imports. Aucune conséquence sur le comportement. Doivent être entièrement déléguées à un formateur automatique, appliqué à l'enregistrement — jamais discutées en revue de code.",
      },
      right: {
        label: "Correction",
        text: "Dépendances d'effet, promesses flottantes, comparaisons douteuses, variables inutilisées. Détectent de vrais défauts, avant l'exécution. Ce sont celles qui justifient l'outil, et elles doivent faire échouer l'intégration continue.",
      },
    },
    {
      kind: "text",
      text: "Cette séparation a une conséquence pratique : les règles de style ne devraient jamais apparaître dans une revue de code. Elles sont automatiquement appliquées, donc invisibles, et l'attention du relecteur reste disponible pour ce qui compte. Une revue qui discute de la place d'une accolade est une revue qui n'a pas regardé la logique.",
    },
    {
      kind: "text",
      text: "Sur un projet existant, activer toutes les règles d'un coup produit des milliers de signalements et conduit à tout désactiver. La démarche qui fonctionne consiste à activer les règles progressivement, à traiter chaque catégorie une fois, et à faire échouer l'intégration continue seulement sur ce qui est déjà propre — sans quoi la barrière est franchie par contournement.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Désactiver une règle sans motif",
      text: "Un commentaire de désactivation sans explication est une dette invisible : personne ne saura si la règle était fausse, si le cas était particulier, ou si l'on était pressé. Exiger un motif écrit à côté de chaque désactivation transforme un contournement silencieux en décision traçable — et beaucoup de désactivations disparaissent dès qu'il faut les justifier.",
    },
    {
      kind: "text",
      text: "Une règle particulière mérite d'être citée pour les listes : celle qui interdit d'utiliser l'index comme clé. Une clé fondée sur la position change de sens dès qu'un élément est inséré, supprimé ou réordonné, ce qui pousse React à réutiliser un état au mauvais endroit — un champ de saisie qui garde la valeur de la ligne précédente, une case cochée qui se déplace.",
    },
    {
      kind: "text",
      text: "Le symptôme est déroutant parce qu'il ne ressemble pas à un problème de clé : l'interface affiche simplement des valeurs qui ne correspondent plus aux bonnes lignes. Utiliser un identifiant stable issu de la donnée règle le cas, et l'index reste acceptable uniquement sur une liste qui ne change jamais d'ordre ni de composition.",
    },
    {
      kind: "text",
      text: "Retenons la répartition : le formatage à un outil automatique et hors de la revue, les règles de correction actives et bloquantes, l'activation progressive sur un projet existant, et un motif obligatoire pour toute désactivation. C'est ce qui distingue un outil utile d'une source de bruit.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "spot",
    id: "react-eco-13",
    difficulty: 2,
    tags: ["react", "hooks", "qualite"],
    prompt: "La liste ne se met jamais à jour quand le filtre change. Quelle ligne ?",
    code: {
      language: "tsx",
      code: `function Liste({ filtre }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    charge(filtre).then(setItems);
  }, []);

  return <ul>{items.map(i => <li key={i.id}>{i.nom}</li>)}</ul>;
}`,
    },
    faultyLine: 6,
    reasons: [
      "Le tableau de dépendances omet `filtre` : l'effet capture la valeur du premier rendu et n'est jamais relancé.",
      "`setItems` devrait figurer dans les dépendances de l'effet.",
      "L'effet devrait être déclaré `async` pour attendre le chargement.",
      "`useState([])` doit être initialisé avec `null` pour détecter le chargement.",
    ],
    reasonAnswer: 0,
    explanation:
      "C'est la fermeture périmée, l'un des bugs React les plus fréquents et les plus déroutants : rien ne casse, l'interface affiche simplement des données qui ne correspondent plus. La règle sur les dépendances des hooks signale exactement cette omission à l'écriture — ce qui en fait la règle d'analyse la plus rentable de l'écosystème.",
  },
  {
    kind: "mcq",
    id: "react-eco-14",
    difficulty: 2,
    tags: ["react", "qualite"],
    prompt: "Quelle place donner aux règles de formatage dans une revue de code ?",
    choices: [
      "Aucune : elles doivent être appliquées automatiquement, et l'attention du relecteur réservée à la logique.",
      "Une place centrale : la cohérence du style est le premier critère de qualité.",
      "Elles doivent être discutées au cas par cas selon le contexte du fichier.",
      "Elles doivent bloquer la fusion au même titre que les règles de correction.",
    ],
    answer: 0,
    explanation:
      "Le formatage n'a aucune conséquence sur le comportement et se règle définitivement par un outil appliqué à l'enregistrement. Une revue qui discute de la place d'une accolade est une revue qui n'a pas regardé la logique. Les règles de correction — dépendances d'effet, promesses flottantes — sont celles qui justifient l'outil et doivent bloquer.",
  },
  {
    kind: "recall",
    id: "react-eco-15",
    difficulty: 2,
    tags: ["react", "qualite"],
    prompt: "Comment introduire l'analyse statique sur un projet existant ?",
    explanation:
      "**Progressivement**. Activer toutes les règles d'un coup produit des milliers de signalements sur une base existante, ce qui rend la sortie inexploitable et conduit invariablement à tout désactiver — ou à ignorer l'outil. La démarche qui fonctionne consiste à activer une catégorie de règles à la fois, à traiter les signalements correspondants en une fois, puis à faire échouer l'intégration continue **seulement** sur ce qui est déjà propre : une barrière qu'on peut respecter est infiniment plus efficace qu'une barrière contournée. On commence par les règles de correction — dépendances d'effet, promesses flottantes — qui détectent de vrais défauts, et l'on délègue entièrement le formatage à un outil automatique appliqué à l'enregistrement, ce qui règle cette catégorie sans discussion. Enfin, exiger un motif écrit à côté de chaque désactivation transforme un contournement silencieux en décision traçable, et beaucoup de désactivations disparaissent dès qu'il faut les justifier.",
    keyPoints: [
      "Activer par catégories, jamais tout d'un coup",
      "Bloquer l'intégration seulement sur ce qui est déjà propre",
      "Commencer par les règles de correction, pas de style",
      "Exiger un motif écrit pour toute désactivation",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Les appels API et le jeton
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "react-eco-l6",
  title: "Les appels API et le jeton",
  blocks: [
    {
      kind: "text",
      text: "Une application front finit toujours par répéter les mêmes gestes à chaque appel : préfixer l'URL, poser l'en-tête d'authentification, vérifier le code de statut, transformer l'erreur. Écrits à chaque endroit, ces gestes divergent — et le jour où le traitement d'une expiration de session change, il faut le corriger à trente endroits.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Un client unique, un seul endroit à faire évoluer.",
      code: `async function appel<T>(chemin: string, init?: RequestInit): Promise<T> {
  const reponse = await fetch(\`\${BASE}\${chemin}\`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(jeton() ? { Authorization: \`Bearer \${jeton()}\` } : {}),
      ...init?.headers,
    },
  });

  if (reponse.status === 401) {
    deconnecte();                    // un seul endroit
    throw new SessionExpiree();
  }
  if (!reponse.ok) {
    throw await erreurDepuis(reponse);  // problem+json
  }
  return reponse.status === 204 ? (undefined as T) : reponse.json();
}`,
    },
    {
      kind: "text",
      text: "Le traitement du 401 illustre bien l'intérêt de la centralisation : déconnecter et rediriger vers l'authentification est une décision qui doit être unique et cohérente. Répartie dans chaque appel, elle est appliquée à quinze endroits sur vingt, et les cinq oubliés produisent des écrans vides inexplicables.",
    },
    {
      kind: "text",
      text: "Le cas du statut sans contenu mérite d'être traité explicitement : appeler la désérialisation sur une réponse vide lève une erreur d'analyse qui n'a aucun rapport apparent avec la cause. C'est un des rares pièges du client natif, et il se règle par une ligne dans le client partagé — donc une fois pour toutes.",
    },
    {
      kind: "comparison",
      title: "Deux endroits où ranger le jeton",
      left: {
        label: "localStorage",
        text: "Simple, accessible depuis le code, survit au rechargement. Mais lisible par **tout script** de la page : une seule faille d'injection, y compris dans une dépendance tierce, suffit à l'exfiltrer. Aucune protection possible depuis l'application.",
      },
      right: {
        label: "Cookie HttpOnly",
        text: "Inaccessible au JavaScript, donc hors d'atteinte d'une injection. En contrepartie, il est envoyé automatiquement par le navigateur — ce qui ramène le risque de requête intersite et impose une protection dédiée côté serveur.",
      },
    },
    {
      kind: "text",
      text: "Il n'existe pas de réponse parfaite, et c'est utile de le savoir plutôt que de croire à une solution évidente. Le cookie avec les attributs de restriction appropriés est généralement le moins mauvais compromis, parce que la faille d'injection est un risque bien plus courant que la requête intersite, et qu'elle est plus difficile à empêcher entièrement.",
    },
    {
      kind: "text",
      text: "Le rafraîchissement du jeton pose un problème de concurrence qu'on découvre en production : si cinq requêtes échouent en même temps avec une session expirée, cinq rafraîchissements partent, dont quatre échoueront ou invalideront le résultat du premier. Il faut donc qu'un seul rafraîchissement soit en cours, les autres appels attendant son résultat.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le jeton n'a pas sa place dans l'état applicatif",
      text: "Le ranger dans un magasin d'état le fait passer dans les outils de développement, dans les traces d'erreur envoyées à un service tiers, et parfois dans les captures de session. Il doit vivre dans un seul endroit dédié, lu par le client d'API et par personne d'autre — surtout pas dans quelque chose qui sérialise son contenu.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Un seul rafraîchissement, même en cas d'appels concurrents.",
      code: `let enCours: Promise<string> | null = null;

async function jetonFrais(): Promise<string> {
  // Si un rafraîchissement est déjà lancé, on attend
  // le sien au lieu d'en démarrer un second.
  enCours ??= rafraichit().finally(() => { enCours = null; });
  return enCours;
}

// Sans cela, cinq requêtes qui expirent ensemble
// déclenchent cinq rafraîchissements : quatre
// échouent, ou chacun invalide le précédent — et
// l'utilisateur est déconnecté sans raison.`,
    },
    {
      kind: "text",
      text: "Le symptôme de ce défaut est particulièrement désagréable : il est intermittent, n'apparaît qu'en présence de requêtes concurrentes, donc rarement en développement où les pages sont chargées une par une. Il se manifeste en production sous la forme de déconnexions inexpliquées, et la cause est difficile à relier au code.",
    },
    {
      kind: "text",
      text: "Retenons les trois points : un client unique qui centralise préfixe, en-têtes, statuts et erreurs ; un choix de stockage assumé en connaissant le risque de chaque option ; et un rafraîchissement unique quand plusieurs appels expirent ensemble. Ces trois décisions se prennent une fois, au début du projet, et sont coûteuses à reprendre ensuite — il vaut la peine d'y consacrer une heure.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "react-eco-16",
    difficulty: 2,
    tags: ["react", "api", "securite"],
    prompt: "Quel est le risque principal d'un jeton rangé dans `localStorage` ?",
    choices: [
      "Il est lisible par tout script de la page : une faille d'injection, même dans une dépendance, suffit à l'exfiltrer.",
      "Il est envoyé automatiquement à tous les domaines visités.",
      "Il est effacé à chaque rechargement de la page.",
      "Il est accessible depuis les autres onglets du navigateur.",
    ],
    answer: 0,
    explanation:
      "Un cookie `HttpOnly` est inaccessible au JavaScript, donc hors d'atteinte d'une injection — mais il est envoyé automatiquement par le navigateur, ce qui ramène le risque de requête intersite. Il n'existe pas de réponse parfaite ; le cookie avec les bons attributs reste généralement le moins mauvais compromis, la faille d'injection étant plus courante et plus difficile à empêcher.",
  },
  {
    kind: "match",
    id: "react-eco-17",
    difficulty: 2,
    tags: ["react", "api"],
    prompt: "Associe chaque responsabilité à sa place dans un client d'API.",
    pairs: [
      { left: "Préfixer l'URL et poser les en-têtes", right: "Le client unique, une seule fois" },
      { left: "Déconnecter sur un 401", right: "Le client unique : décision cohérente et unique" },
      { left: "Ne pas désérialiser une réponse 204", right: "Le client unique : piège réglé une fois pour toutes" },
      { left: "Afficher un message adapté à l'erreur", right: "Le composant, qui connaît le contexte" },
    ],
    explanation:
      "Ce qui est technique et invariant appartient au client ; ce qui dépend du contexte d'affichage appartient au composant. Le traitement du 401 illustre bien l'enjeu : réparti dans chaque appel, il est appliqué à quinze endroits sur vingt, et les cinq oubliés produisent des écrans vides inexplicables.",
  },
  {
    kind: "recall",
    id: "react-eco-18",
    difficulty: 3,
    tags: ["react", "api"],
    prompt: "Quel problème de concurrence pose le rafraîchissement d'un jeton ?",
    explanation:
      "Si plusieurs requêtes sont en vol au moment où la session expire, elles échouent **toutes en même temps** avec un statut d'expiration, et chacune déclenche son propre rafraîchissement. Cinq appels en parallèle produisent alors cinq tentatives simultanées : selon la stratégie du serveur, quatre échoueront, ou bien chacune invalidera le jeton obtenu par la précédente, ce qui peut aboutir à déconnecter l'utilisateur alors que tout devrait fonctionner. Le symptôme est intermittent et ne se reproduit qu'en présence de requêtes concurrentes, donc rarement en développement. La parade est de garantir qu'**un seul rafraîchissement est en cours** : le premier appel qui constate l'expiration lance la demande et conserve la promesse correspondante ; les suivants, au lieu d'en lancer une autre, attendent cette même promesse, puis rejouent leur requête avec le nouveau jeton.",
    keyPoints: [
      "Plusieurs requêtes en vol expirent ensemble",
      "Chacune déclenche son rafraîchissement : déconnexion possible",
      "Symptôme intermittent, rare en développement",
      "Parade : une seule promesse de rafraîchissement partagée",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — L'accessibilité : les bases
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "react-eco-l7",
  title: "L'accessibilité : les bases",
  blocks: [
    {
      kind: "text",
      text: "L'accessibilité est souvent perçue comme une couche supplémentaire, coûteuse et réservée à quelques cas. C'est l'inverse : elle est presque gratuite quand on utilise les éléments prévus pour ce qu'on fait, et coûteuse uniquement quand on les a remplacés par des conteneurs génériques qu'il faut ensuite rééquiper.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Ce que coûte un bouton qui n'en est pas un.",
      code: `// Un div « bouton » — ce qu'il faut rajouter :
<div onClick={valider}>Valider</div>
// ✗ pas focalisable au clavier
// ✗ ne réagit pas à Entrée ni à Espace
// ✗ annoncé comme un simple texte
// → il faut role, tabIndex, gestion clavier,
//   état désactivé, et l'on oublie toujours l'un
//   des quatre.

// L'élément prévu, gratuitement :
<button onClick={valider}>Valider</button>
// ✓ focalisable, activable au clavier, annoncé
//   comme bouton, désactivable, style de focus`,
    },
    {
      kind: "text",
      text: "La règle la plus rentable du domaine tient donc en une phrase : utiliser l'élément HTML qui correspond à l'intention. Un bouton pour une action, un lien pour une navigation, une liste pour une liste, un titre pour un titre. Chacun apporte gratuitement rôle, comportement clavier et annonce correcte — tout ce qu'il faudrait sinon reconstruire.",
    },
    {
      kind: "text",
      text: "La confusion entre bouton et lien mérite une mention : un lien navigue et doit avoir une adresse, un bouton agit. Un lien sans adresse n'est pas focalisable, et un bouton qui navigue casse l'ouverture dans un nouvel onglet et le clic du milieu. Ce n'est pas une subtilité — c'est le comportement que les utilisateurs attendent.",
    },
    {
      kind: "comparison",
      title: "Deux façons de nommer un élément",
      left: {
        label: "Le contenu textuel",
        text: "`<button>Supprimer</button>`. Le nom accessible est le texte visible. C'est le cas le plus simple et le plus robuste : ce que voit l'un est ce qu'entend l'autre, et rien ne peut diverger.",
      },
      right: {
        label: "Un libellé explicite",
        text: "`<button aria-label=\"Supprimer la commande 42\">🗑</button>`. Nécessaire quand le contenu est une icône. Attention : le libellé remplace entièrement le contenu pour les aides techniques, et devient une seconde source à maintenir.",
      },
    },
    {
      kind: "text",
      text: "Le bouton d'icône sans libellé est l'un des défauts les plus fréquents : il est annoncé comme « bouton » sans plus de précision, ce qui le rend inutilisable pour qui ne voit pas l'icône. Une page comportant douze boutons identiques ainsi annoncés est une page sur laquelle on ne peut tout simplement pas agir.",
    },
    {
      kind: "text",
      text: "Le clavier est l'autre pilier. Tout ce qui est actionnable à la souris doit l'être au clavier, dans un ordre qui suit la logique visuelle, avec un indicateur de focus **visible**. Supprimer cet indicateur pour des raisons esthétiques est l'une des régressions les plus graves et les plus courantes : sans lui, naviguer au clavier revient à avancer les yeux fermés.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le test qui prend deux minutes",
      text: "Poser la souris et parcourir la page uniquement à la tabulation. Peut-on atteindre chaque élément interactif ? Voit-on toujours où l'on se trouve ? L'ordre suit-il le sens de lecture ? Peut-on sortir d'une fenêtre modale ? Ce test attrape la majorité des défauts d'accessibilité, ne demande aucun outil, et se fait sur n'importe quelle page en quelques minutes.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Annoncer un changement qui n'a pas provoqué de navigation.",
      code: `// Un lecteur d'écran n'annonce pas un contenu qui
// apparaît sans que le focus ne bouge.
<div aria-live="polite">
  {resultats.length} résultat(s) trouvé(s)
</div>

// polite  : annoncé quand l'utilisateur est
//           disponible — pour un compteur, un statut
// assertive : interrompt immédiatement — à réserver
//           aux erreurs et aux alertes

// La zone doit exister dans le DOM AVANT que le
// contenu n'y apparaisse, sinon rien n'est annoncé.`,
    },
    {
      kind: "text",
      text: "Ce détail — la zone doit préexister — est la cause la plus fréquente d'annonces qui ne se produisent pas. Insérer d'un coup un élément portant l'attribut et son contenu ne déclenche rien : c'est la **modification** d'une zone déjà observée qui provoque l'annonce, pas son apparition.",
    },
    {
      kind: "text",
      text: "Retenons l'ordre d'efficacité : le bon élément HTML d'abord, un nom accessible sur tout ce qui n'a pas de texte visible, la navigation au clavier avec un focus visible ensuite. Les attributs spécialisés viennent après, pour les cas que le HTML seul ne couvre pas — et beaucoup moins souvent qu'on ne le croit — la plupart des besoins courants sont déjà couverts par les éléments standard.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "spot",
    id: "react-eco-19",
    difficulty: 2,
    tags: ["react", "accessibilite"],
    prompt: "Cet élément est inutilisable au clavier. Quelle ligne ?",
    code: {
      language: "tsx",
      code: `export function BarreOutils() {
  return (
    <div className="barre">
      <div onClick={valider}>Valider</div>
    </div>
  );
}`,
    },
    faultyLine: 4,
    reasons: [
      "Un conteneur générique avec un gestionnaire de clic : il n'est ni focalisable, ni activable au clavier, ni annoncé comme un bouton.",
      "Il manque une classe CSS sur l'élément cliquable.",
      "`onClick` devrait être remplacé par `onMouseDown` pour être accessible.",
      "Le conteneur parent devrait porter un attribut de rôle.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un élément `button` apporte gratuitement le focus, l'activation par Entrée et Espace, l'annonce correcte, l'état désactivé et le style de focus. Les reconstruire sur un conteneur demande un rôle, un index de tabulation et une gestion clavier complète — et l'on oublie toujours l'un des quatre.",
  },
  {
    kind: "mcq",
    id: "react-eco-20",
    difficulty: 2,
    tags: ["react", "accessibilite"],
    prompt: "Pourquoi ne pas supprimer l'indicateur de focus pour des raisons esthétiques ?",
    choices: [
      "Sans lui, naviguer au clavier revient à avancer à l'aveugle : on ne sait plus quel élément est actif.",
      "Les navigateurs refusent d'appliquer la règle CSS correspondante.",
      "Il est nécessaire au fonctionnement des gestionnaires de clic.",
      "Il empêche le défilement automatique vers l'élément actif.",
    ],
    answer: 0,
    explanation:
      "C'est l'une des régressions d'accessibilité les plus graves et les plus courantes, généralement introduite par une réinitialisation de styles. Si l'indicateur par défaut est jugé disgracieux, on le remplace par un style visible et cohérent — on ne le supprime pas. Le test consiste à parcourir la page à la tabulation en vérifiant qu'on voit toujours où l'on se trouve.",
  },
  {
    kind: "match",
    id: "react-eco-21",
    difficulty: 2,
    tags: ["react", "accessibilite"],
    prompt: "Associe chaque intention à l'élément approprié.",
    pairs: [
      { left: "Déclencher une action sur la page", right: "button" },
      { left: "Naviguer vers une autre adresse", right: "a avec un href" },
      { left: "Un bouton dont le contenu est une icône", right: "button avec un libellé explicite" },
      { left: "Structurer le contenu pour la navigation", right: "Titres hiérarchisés et repères de page" },
    ],
    explanation:
      "Un lien sans adresse n'est pas focalisable, et un bouton qui navigue casse l'ouverture dans un nouvel onglet et le clic du milieu. Le bouton d'icône sans libellé est annoncé comme « bouton » sans plus de précision : une page comportant douze boutons identiques ainsi annoncés est une page sur laquelle on ne peut pas agir.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Formulaires accessibles
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "react-eco-l8",
  title: "Formulaires accessibles",
  blocks: [
    {
      kind: "text",
      text: "Le formulaire est l'endroit où l'accessibilité se joue vraiment, parce que c'est là que l'utilisateur doit agir plutôt que lire. Un champ mal associé à son intitulé, une erreur affichée sans être annoncée, un message de validation qu'on ne peut pas relier au champ concerné : chacun rend le formulaire difficile, parfois impossible à remplir.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Le champ sans intitulé associé.",
      code: `// ✗ L'intitulé est visuellement à côté, mais rien
//   ne les relie
<span>Nom</span>
<input type="text" id="nom" />
// → annoncé comme « champ de saisie », sans nom
// → cliquer sur « Nom » ne place pas le curseur

// ✓ Association explicite
<label htmlFor="nom">Nom</label>
<input type="text" id="nom" />

// ✓ Ou par imbrication, sans identifiant
<label>
  Nom
  <input type="text" />
</label>`,
    },
    {
      kind: "text",
      text: "L'association apporte deux choses d'un coup : le champ reçoit un nom accessible, et cliquer sur l'intitulé y place le curseur — ce qui agrandit considérablement la zone cliquable, bénéfice très concret sur mobile. Un texte simplement placé à côté ne fait ni l'un ni l'autre, alors que le rendu visuel est identique.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Une erreur qui se voit, s'entend et se relie.",
      code: `<label htmlFor="email">Adresse électronique</label>
<input
  id="email"
  type="email"
  aria-invalid={!!erreur}
  aria-describedby={erreur ? "email-erreur" : undefined}
/>
{erreur && (
  <p id="email-erreur" role="alert">{erreur}</p>
)}

// aria-invalid    → le champ est annoncé « invalide »
// aria-describedby → l'erreur est lue AVEC le champ
// role="alert"    → l'apparition est annoncée
//                   immédiatement, sans action`,
    },
    {
      kind: "text",
      text: "Ces trois attributs se complètent et aucun ne remplace les autres. Le premier signale l'état du champ, le second relie le message au champ pour qu'il soit lu au moment où l'on y arrive, le troisième provoque l'annonce immédiate de l'erreur. Sans le dernier, un message qui apparaît après validation reste totalement silencieux.",
    },
    {
      kind: "comparison",
      title: "Deux façons de signaler une erreur",
      left: {
        label: "Par la couleur seule",
        text: "Une bordure rouge. Invisible pour qui ne distingue pas les couleurs, et totalement muette pour une aide technique. Le champ paraît normal, et l'utilisateur ne comprend pas pourquoi la validation échoue.",
      },
      right: {
        label: "Couleur, texte et état",
        text: "Une bordure rouge, un message explicite, et les attributs qui relient les deux au champ. Chaque canal renforce les autres, et l'information passe quel que soit le mode de perception.",
      },
    },
    {
      kind: "text",
      text: "Le principe qui généralise : ne jamais faire porter une information par la **couleur seule**. C'est vrai des erreurs, mais aussi des statuts, des graphiques et des indicateurs de disponibilité. Ajouter un mot ou une icône à côté de la couleur suffit, et le bénéfice dépasse largement le cas du daltonisme — cela fonctionne aussi en plein soleil ou sur un écran mal réglé.",
    },
    {
      kind: "text",
      text: "Le déplacement du focus après validation est le geste qui manque le plus souvent. Quand un formulaire échoue, l'utilisateur au clavier reste là où il était, sans savoir que des messages sont apparus plus haut. Placer le focus sur le premier champ en erreur, ou sur un résumé des erreurs, transforme un formulaire frustrant en formulaire utilisable.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Deux attributs qui changent tout sur mobile",
      text: "Le type du champ adapte le clavier affiché — numérique pour un montant, avec arobase pour un courriel — et l'attribut de complétion automatique permet au navigateur de proposer les valeurs enregistrées. Ce sont deux caractères de configuration qui épargnent à l'utilisateur une saisie complète, et ils sont omis dans l'immense majorité des formulaires.",
    },
    {
      kind: "text",
      text: "Un mot sur les champs obligatoires : l'astérisque visuelle ne suffit pas, car elle n'est pas annoncée. L'attribut correspondant sur le champ l'est, et il apporte en prime la validation native du navigateur. On garde l'astérisque pour l'information visuelle, et l'on ajoute l'attribut pour que l'information passe par tous les canaux — même principe que pour les erreurs.",
    },
    {
      kind: "text",
      text: "Le regroupement de champs liés mérite aussi d'être connu : un ensemble de boutons radio ou de cases à cocher gagne à être entouré d'un groupe portant une légende, faute de quoi chaque option est annoncée isolément, sans la question à laquelle elle répond. « Oui » et « Non » sans intitulé de groupe ne veulent rien dire.",
    },
    {
      kind: "text",
      text: "Retenons la liste courte : un intitulé associé à chaque champ, une erreur reliée et annoncée, jamais d'information portée par la seule couleur, un focus déplacé après échec, et les attributs de type et de complétion. Cinq points, tous peu coûteux, qui couvrent l'essentiel des difficultés rencontrées sur un formulaire.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "react-eco-22",
    difficulty: 2,
    tags: ["react", "accessibilite", "tests"],
    prompt: "Que se passe-t-il lors de l'exécution de ce test ?",
    code: {
      language: "tsx",
      code: `render(
  <>
    <span>Nom</span>
    <input type="text" id="nom" />
  </>
);

screen.getByLabelText("Nom");`,
    },
    choices: [
      "Le test échoue : aucun intitulé n'est associé au champ, qui n'a donc pas de nom accessible.",
      "Le test réussit : le texte « Nom » est adjacent au champ.",
      "Le test réussit car l'identifiant du champ vaut « nom ».",
      "Le test échoue parce que `getByLabelText` exige une expression régulière.",
    ],
    answer: 0,
    explanation:
      "Un `span` placé à côté n'associe rien : visuellement identique, le champ est pourtant annoncé comme « champ de saisie » sans nom, et cliquer sur le texte n'y place pas le curseur. Il faut un `label` avec `htmlFor` pointant sur l'identifiant, ou l'imbrication du champ dans l'intitulé. Le test rend ce défaut visible immédiatement.",
  },
  {
    kind: "spot",
    id: "react-eco-23",
    difficulty: 2,
    tags: ["react", "accessibilite"],
    prompt: "Cette erreur de validation n'est jamais annoncée. Quelle ligne ?",
    code: {
      language: "tsx",
      code: `<label htmlFor="email">Adresse</label>
<input id="email" type="email" aria-invalid={!!erreur} />

{erreur && (
  <p className="texte-rouge">{erreur}</p>
)}`,
    },
    faultyLine: 5,
    reasons: [
      "Le message n'est ni relié au champ ni annoncé à son apparition : il lui manque un identifiant référencé et un rôle d'alerte.",
      "`aria-invalid` doit recevoir la chaîne \"true\" et non un booléen.",
      "Le paragraphe devrait être placé avant le champ pour être lu en premier.",
      "La classe `texte-rouge` devrait être appliquée au champ plutôt qu'au message.",
    ],
    reasonAnswer: 0,
    explanation:
      "Trois attributs se complètent et aucun ne remplace les autres : `aria-invalid` signale l'état du champ, `aria-describedby` relie le message pour qu'il soit lu avec lui, et `role=\"alert\"` provoque l'annonce immédiate de son apparition. Sans ce dernier, un message affiché après validation reste totalement silencieux. La couleur seule, elle, ne porte aucune information.",
  },
  {
    kind: "mcq",
    id: "react-eco-24",
    difficulty: 2,
    tags: ["react", "accessibilite"],
    prompt: "Un formulaire échoue à la validation. Quel geste manque le plus souvent ?",
    choices: [
      "Déplacer le focus sur le premier champ en erreur ou sur un résumé des erreurs.",
      "Désactiver le bouton de validation jusqu'à correction.",
      "Réinitialiser les champs correctement remplis.",
      "Afficher les erreurs dans une fenêtre modale.",
    ],
    answer: 0,
    explanation:
      "Sans déplacement du focus, l'utilisateur au clavier reste là où il était et ne sait pas que des messages sont apparus plus haut. Le formulaire paraît simplement ne rien faire. Déplacer le focus transforme une expérience frustrante en formulaire utilisable, et c'est l'un des gestes les moins coûteux du domaine.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "react-ecosysteme",
  title: "Écosystème : outillage, tests, appels API et accessibilité",
  objective:
    "Maîtriser ce qui entoure les composants : comprendre pourquoi Vite démarre instantanément et ce que cela impose, écrire des tests qui survivent aux refontes, savoir lesquels valent la peine, simuler le réseau sans court-circuiter le code réel, activer les règles d'analyse qui attrapent de vrais bugs, centraliser les appels API et le jeton, et rendre une interface réellement utilisable au clavier.",
  prerequisites: ["react-hooks"],
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
