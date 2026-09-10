/**
 * React — État et données (référentiel 6.2) : Context, gestionnaires d'état,
 * état serveur, routage, frontières d'erreur.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Où doit vivre un état
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "react-data-l1",
  title: "Où doit vivre un état",
  blocks: [
    {
      kind: "text",
      text: "La première question sur un composant React n'est pas « quel outil d'état utiliser » mais « cet état doit-il seulement exister ». Une bonne partie des `useState` qu'on trouve dans une base de code n'ont pas lieu d'être : ils dupliquent une information déjà présente ailleurs, et le bug arrive le jour où les deux copies divergent.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Un état qui n'aurait pas dû exister.",
      code: `function Panier({ lignes }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(lignes.reduce((s, l) => s + l.prix, 0));
  }, [lignes]);

  return <p>Total : {total} €</p>;
}

// Deux sources de vérité pour la même information,
// un rendu de retard à chaque changement, et un effet
// à maintenir. Le total n'est pas un état : c'est une
// fonction des lignes.`,
    },
    {
      kind: "code",
      language: "tsx",
      caption: "La valeur dérivée se calcule, elle ne se stocke pas.",
      code: `function Panier({ lignes }) {
  const total = lignes.reduce((s, l) => s + l.prix, 0);
  return <p>Total : {total} €</p>;
}

// Toujours juste, aucun effet, aucun rendu de retard.
// useMemo n'est utile que si le calcul est réellement
// coûteux — ce qui est rare, et se mesure avant.`,
    },
    {
      kind: "text",
      text: "La règle qui découle de là : **est état ce qui ne peut pas être calculé**. Tout ce qui se déduit des props, d'un autre état ou d'une donnée serveur est une valeur dérivée, et doit être calculé pendant le rendu. Appliquer ce filtre supprime souvent la moitié des `useState` et la quasi-totalité des `useEffect` d'un composant.",
    },
    {
      kind: "text",
      text: "Vient ensuite la question de l'emplacement. L'état doit vivre au plus bas nœud commun à tous les composants qui en ont besoin. Le placer plus haut fait re-rendre des branches entières sans raison ; le placer plus bas oblige à le remonter dès qu'un deuxième composant en a besoin — ce qu'on appelle « faire remonter l'état », et qui est le mouvement normal quand une exigence apparaît.",
    },
    {
      kind: "comparison",
      title: "Deux natures d'état qu'on confond",
      left: {
        label: "État client",
        text: "Il appartient à l'interface et n'existe nulle part ailleurs : un onglet actif, un formulaire en cours de saisie, un panneau ouvert. Il est synchrone, vous en êtes la seule source, et le perdre au rechargement est souvent acceptable.",
      },
      right: {
        label: "État serveur",
        text: "C'est une **copie locale** d'une donnée dont la vérité est ailleurs : une liste de commandes, un profil. Il est asynchrone, peut devenir périmé, échouer au chargement, et deux onglets peuvent en avoir des versions différentes.",
      },
    },
    {
      kind: "text",
      text: "Cette distinction commande tout le reste du chapitre. Traiter une donnée serveur comme un état client — la charger dans un `useEffect`, la ranger dans un `useState` — oblige à réimplémenter à la main le chargement, l'erreur, le cache, la revalidation et la déduplication des requêtes. C'est beaucoup de code, et il est presque toujours incomplet.",
    },
    {
      kind: "text",
      text: "Une dernière catégorie mérite d'être nommée : l'état d'URL. Un filtre de recherche, une page courante, un onglet sélectionné gagnent souvent à vivre dans les paramètres de l'adresse plutôt que dans un `useState`. On obtient gratuitement le partage par lien, le retour arrière du navigateur et la persistance au rechargement — trois fonctionnalités qu'on aurait dû écrire.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "L'ordre des questions",
      text: "Devant un besoin d'état, se demander dans cet ordre : puis-je le **calculer** à partir de ce que j'ai déjà ? Sinon, appartient-il à l'**URL** ? Sinon, vient-il du **serveur** — auquel cas c'est un cache, pas un état ? Sinon seulement, c'est un état client local, et il vit au plus bas nœud commun. La plupart des besoins se règlent avant la dernière ligne.",
    },
    {
      kind: "text",
      text: "Ce cheminement explique pourquoi la question « Redux ou Context ? » arrive si souvent trop tôt. Dans beaucoup d'applications, une fois retirées les valeurs dérivées, l'état d'URL et les données serveur confiées à un outil dédié, il ne reste qu'une poignée d'états client réellement partagés — et le besoin d'un gestionnaire global devient une question modeste, au lieu d'être la décision structurante qu'on imaginait.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "react-data-01",
    difficulty: 2,
    tags: ["react", "etat"],
    prompt: "Le composant est monté une première fois avec `lignes = [{ prix: 10 }]`. Que journalise-t-il ?",
    code: {
      language: "tsx",
      code: `function Panier({ lignes }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(lignes.reduce((s, l) => s + l.prix, 0));
  }, [lignes]);

  console.log("rendu, total =", total);
  return <p>{total} €</p>;
}`,
    },
    choices: [
      "« rendu, total = 0 » puis « rendu, total = 10 » : deux rendus, le premier affichant une valeur fausse.",
      "« rendu, total = 10 » une seule fois : l'effet s'exécute avant le premier rendu.",
      "« rendu, total = 0 » une seule fois : l'effet ne déclenche pas de nouveau rendu.",
      "Une boucle infinie de rendus, `setTotal` réexécutant l'effet à chaque fois.",
    ],
    answer: 0,
    explanation:
      "Un effet s'exécute **après** le rendu. Le premier passage affiche donc l'état initial `0`, puis `setTotal` déclenche un second rendu avec `10`. C'est le « rendu de retard » caractéristique d'un état dérivé : l'utilisateur voit brièvement une valeur fausse. Il n'y a pas de boucle, car `lignes` ne change pas. La correction consiste à calculer le total pendant le rendu au lieu de le stocker.",
  },
  {
    kind: "match",
    id: "react-data-02",
    difficulty: 2,
    tags: ["react", "etat"],
    prompt: "Associe chaque donnée à l'endroit où elle doit vivre.",
    pairs: [
      { left: "Le texte en cours de saisie dans un champ", right: "État client local, dans le composant" },
      { left: "Le filtre de recherche d'une liste", right: "Paramètres d'URL : partage, retour arrière, rechargement" },
      { left: "La liste des commandes affichée", right: "Cache d'état serveur, géré par un outil dédié" },
      { left: "Le total d'un panier", right: "Nulle part : valeur dérivée, calculée au rendu" },
    ],
    explanation:
      "Ces quatre catégories couvrent presque tous les cas. Les traiter séparément évite le réflexe qui consiste à tout mettre dans un `useState` puis à chercher un gestionnaire global pour partager le résultat — alors qu'une bonne partie du problème disparaît en posant les données au bon endroit.",
  },
  {
    kind: "recall",
    id: "react-data-03",
    difficulty: 2,
    tags: ["react", "etat"],
    prompt: "Quelle différence de nature entre état client et état serveur, et pourquoi elle compte ?",
    explanation:
      "Un état client appartient à l'interface et n'existe nulle part ailleurs — un onglet actif, une saisie en cours : il est synchrone, vous en êtes la seule source, et le perdre au rechargement est souvent acceptable. Un état serveur est une **copie locale** d'une donnée dont la vérité est ailleurs : il est asynchrone, peut échouer au chargement, devenir périmé sans prévenir, et deux onglets peuvent en détenir des versions différentes. La conséquence est pratique : traiter une donnée serveur comme un état client oblige à réimplémenter à la main le chargement, l'erreur, le cache, la revalidation, la déduplication des requêtes et l'annulation — beaucoup de code, presque toujours incomplet, et systématiquement redupliqué d'un composant à l'autre.",
    keyPoints: [
      "État client : local, synchrone, vous êtes la source",
      "État serveur : copie d'une vérité distante, asynchrone, périssable",
      "Le second demande cache, revalidation, erreur, déduplication",
      "Le confondre revient à réécrire tout cela à la main, partiellement",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Le passage de props et le contexte
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "react-data-l2",
  title: "Le passage de props et le contexte",
  blocks: [
    {
      kind: "text",
      text: "Quand un état vit haut dans l'arbre et sert bas, il faut le faire descendre. Le passage explicite de props est le mécanisme normal, et il a une vertu qu'on sous-estime : la dépendance est visible. En lisant une signature, on sait exactement ce dont un composant a besoin, et on peut le rendre isolément dans un test.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Le passage à travers des composants qui n'en font rien.",
      code: `<Page theme={theme} user={user}>
  <Sidebar theme={theme} user={user}>
    <Menu theme={theme} user={user}>
      <MenuItem theme={theme} user={user} />
    </Menu>
  </Sidebar>
</Page>

// Sidebar et Menu n'utilisent ni theme ni user : ils
// les transportent. Ajouter une propriété oblige à
// modifier quatre composants qui ne s'en servent pas.`,
    },
    {
      kind: "text",
      text: "C'est le *prop drilling*, et il devient un vrai problème quand la valeur traverse plus de deux ou trois niveaux sans être utilisée. Le symptôme n'est pas le nombre de props mais le fait que des composants intermédiaires servent de tuyau : ils deviennent solidaires d'une donnée qui ne les concerne pas, et l'ajout d'une propriété se propage mécaniquement.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Le contexte : fournir en haut, consommer en bas.",
      code: `const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>("clair");
  const valeur = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={valeur}>{children}</ThemeContext.Provider>
  );
}

// Un hook dédié : il vérifie la présence du fournisseur
// et évite d'exporter le contexte lui-même.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme hors de ThemeProvider");
  return ctx;
}`,
    },
    {
      kind: "text",
      text: "Le contexte court-circuite l'arbre : les composants intermédiaires ne voient plus rien passer. Deux conventions rendent son usage sain. D'abord exposer un hook plutôt que le contexte, ce qui permet de vérifier la présence du fournisseur et de donner une erreur explicite au lieu d'un `undefined` mystérieux. Ensuite mémoriser la valeur fournie, faute de quoi un nouvel objet est créé à chaque rendu du fournisseur.",
    },
    {
      kind: "comparison",
      title: "Deux réponses au même besoin",
      left: {
        label: "Passer des props",
        text: "Dépendances visibles dans la signature, composant testable isolément, aucune magie. Devient pénible quand la valeur traverse plusieurs niveaux sans être lue. C'est le choix par défaut, et il tient plus longtemps qu'on ne croit.",
      },
      right: {
        label: "Fournir un contexte",
        text: "La valeur devient disponible partout sous le fournisseur. Le composant devient dépendant d'un environnement — donc plus difficile à réutiliser et à tester sans montage. À réserver aux valeurs réellement transverses.",
      },
    },
    {
      kind: "text",
      text: "Une troisième voie est souvent négligée alors qu'elle règle beaucoup de cas sans rien introduire : passer des composants en `children` plutôt que des données. Si `Sidebar` reçoit déjà construit le contenu qui a besoin du thème, elle n'a plus besoin de le connaître. La composition supprime le tuyau sans créer de dépendance implicite.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "La composition : la donnée ne traverse plus rien.",
      code: `// Au lieu de faire descendre user à travers Sidebar…
<Page>
  <Sidebar>
    <Menu>
      <MenuItem user={user} />
    </Menu>
  </Sidebar>
</Page>

// user est lu là où il est déjà disponible, et
// Sidebar comme Menu n'en savent rien : elles se
// contentent de rendre children.`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le contexte n'est pas un gestionnaire d'état",
      text: "Il ne fait que **transporter** une valeur : il n'apporte ni découpage des mises à jour, ni mémorisation, ni outils de développement. Un contexte qui change souvent re-rend tous ses consommateurs, sans exception et sans possibilité de s'abonner à une partie. C'est le sujet de la leçon suivante, et la raison pour laquelle « Context au lieu de Redux » est une comparaison faussée.",
    },
    {
      kind: "text",
      text: "Un détail d'implémentation mérite d'être connu : la valeur par défaut passée à `createContext` n'est utilisée que si **aucun** fournisseur n'existe au-dessus du consommateur. Elle ne sert donc pas de repli quand la valeur fournie est absente, et beaucoup d'équipes y mettent délibérément `null` pour rendre l'oubli du fournisseur détectable plutôt que silencieux.",
    },
    {
      kind: "text",
      text: "Rien n'oblige non plus à un seul fournisseur par contexte. On peut en imbriquer plusieurs, chacun redéfinissant la valeur pour son sous-arbre : un thème sombre appliqué à un panneau particulier, une locale différente dans un aperçu. Le consommateur reçoit toujours la valeur du fournisseur le plus proche au-dessus de lui, ce qui rend ce mécanisme naturellement local.",
    },
    {
      kind: "text",
      text: "En pratique, le contexte convient très bien à ce qui change rarement et concerne tout le monde : le thème, la langue, l'utilisateur connecté, une configuration. Il convient mal à ce qui change à chaque frappe ou à chaque seconde. Ce critère — la fréquence de changement rapportée au nombre de consommateurs — est celui qui décide, bien plus que la taille de l'application.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "react-data-04",
    difficulty: 2,
    tags: ["react", "context"],
    prompt: "Pourquoi mémoriser la valeur passée à un `Provider` avec `useMemo` ?",
    choices: [
      "Sans cela, un nouvel objet est créé à chaque rendu du fournisseur et tous les consommateurs se re-rendent.",
      "Sans cela, le contexte perd sa valeur entre deux rendus et vaut `undefined`.",
      "Parce que React interdit de passer un objet littéral à un `Provider`.",
      "Pour que le contexte soit accessible depuis des composants situés au-dessus du fournisseur.",
    ],
    answer: 0,
    explanation:
      "La comparaison de la valeur du contexte se fait par identité. Un littéral `{ theme, setTheme }` produit un objet neuf à chaque rendu du fournisseur, donc une valeur « différente » même si le contenu est identique, et tous les consommateurs se re-rendent. `useMemo` conserve la même référence tant que les dépendances ne changent pas.",
  },
  {
    kind: "fill",
    id: "react-data-05",
    difficulty: 2,
    tags: ["react", "context"],
    prompt: "Complète la création du contexte et sa consommation dans le hook dédié.",
    code: {
      language: "tsx",
      code: `const ThemeContext = {{1}}<Theme | null>(null);

export function useTheme() {
  const ctx = {{2}}(ThemeContext);
  if (!ctx) throw new Error("useTheme hors de ThemeProvider");
  return ctx;
}`,
    },
    blanks: ["createContext", "useContext"],
    distractors: ["createStore", "useState", "useMemo", "useReducer"],
    explanation:
      "`createContext` déclare le canal et sa valeur par défaut — ici `null`, ce qui permet précisément de détecter l'absence de fournisseur. `useContext` le consomme. Exposer un hook plutôt que le contexte lui-même permet cette vérification et donne une erreur explicite au lieu d'un `undefined` qui se propagerait.",
  },
  {
    kind: "recall",
    id: "react-data-06",
    difficulty: 2,
    tags: ["react", "context"],
    prompt: "Pourquoi exposer un hook `useTheme()` plutôt que le contexte lui-même ?",
    explanation:
      "Pour trois raisons qui se cumulent. D'abord la vérification : le hook teste la présence du fournisseur et lève une erreur explicite — « useTheme hors de ThemeProvider » — au lieu de laisser un `undefined` se propager et produire une erreur incompréhensible dix lignes plus loin. Ensuite l'encapsulation : le contexte n'est plus exporté, donc personne ne peut le consommer autrement ni créer un second fournisseur concurrent, et l'on garde la liberté d'en changer l'implémentation. Enfin la lisibilité de l'interface : `useTheme()` dit ce qu'on obtient, là où `useContext(ThemeContext)` oblige à aller lire la déclaration du contexte pour connaître la forme de la valeur.",
    keyPoints: [
      "Vérifie la présence du fournisseur, erreur explicite au lieu d'undefined",
      "Encapsule : le contexte n'est pas exporté, l'implémentation reste libre",
      "Interface lisible : le nom dit ce qu'on obtient",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Les limites du contexte : les re-rendus
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "react-data-l3",
  title: "Les limites du contexte : les re-rendus",
  blocks: [
    {
      kind: "text",
      text: "« On n'a pas besoin de Redux, on a Context » est l'une des phrases les plus répandues et les plus trompeuses de l'écosystème React. Elle compare deux choses de nature différente : un mécanisme de transport et un gestionnaire d'état. Le contexte fait descendre une valeur dans l'arbre, rien de plus, et cette limite se paie exactement là où on ne l'attend pas — les performances.",
    },
    {
      kind: "text",
      text: "Le mécanisme est simple : quand la valeur d'un contexte change — au sens de l'identité de référence — **tous** les composants qui la consomment se re-rendent. Il n'existe aucun moyen de s'abonner à une partie de la valeur. Un consommateur qui n'utilise qu'un champ sur douze se re-rendra à chaque modification des onze autres.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Un contexte trop gros : tout bouge quand une partie change.",
      code: `const AppContext = createContext(null);

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("clair");
  const [panier, setPanier] = useState([]);   // change souvent

  const valeur = useMemo(
    () => ({ user, setUser, theme, setTheme, panier, setPanier }),
    [user, theme, panier]
  );
  return <AppContext.Provider value={valeur}>{children}</AppContext.Provider>;
}

// Ajouter un article au panier change la valeur, donc
// re-rend TOUS les consommateurs — y compris ceux qui
// ne lisent que le thème.`,
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Découper : un contexte par rythme de changement.",
      code: `// Rarement modifié, beaucoup de consommateurs
const ThemeContext = createContext(null);
// Rarement modifié
const UserContext = createContext(null);
// Souvent modifié, peu de consommateurs
const PanierContext = createContext(null);

// Variante utile : séparer la valeur des actions.
// Les actions ne changent jamais, donc les composants
// qui ne font qu'écrire ne se re-rendent plus du tout.
const PanierActionsContext = createContext(null);  // stable`,
    },
    {
      kind: "text",
      text: "Le découpage par rythme de changement est la parade principale, et il suffit dans la plupart des applications. La seconde parade est de séparer les données des actions : un contexte qui ne contient que des fonctions de mise à jour peut être rendu parfaitement stable, et les composants qui se contentent d'écrire — un bouton « ajouter au panier » — cessent alors de se re-rendre à chaque changement.",
    },
    {
      kind: "comparison",
      title: "Ce que chacun apporte réellement",
      left: {
        label: "Context",
        text: "Transport d'une valeur dans l'arbre. Intégré à React, aucune dépendance. Ni abonnement partiel, ni mémorisation, ni outils de développement, ni gestion d'actions. Le re-rendu est global à tous les consommateurs.",
      },
      right: {
        label: "Gestionnaire d'état",
        text: "Redux Toolkit, Zustand, Jotai. Abonnement par sélecteur — un composant ne se re-rend que si la partie qu'il lit a changé —, outils de développement, voyage dans le temps, logique centralisée hors des composants.",
      },
    },
    {
      kind: "text",
      text: "La bonne question n'est donc pas « Context ou Redux » mais « ai-je besoin d'un abonnement partiel ? ». Tant que les valeurs partagées changent rarement — thème, langue, utilisateur, configuration —, le contexte suffit et n'introduit aucune dépendance. Dès qu'un état partagé change fréquemment et qu'il est lu par de nombreux composants, le contexte devient un problème mesurable.",
    },
    {
      kind: "text",
      text: "Un point mérite d'être rappelé pour éviter une optimisation inutile : un composant enfant se re-rend de toute façon quand son parent se re-rend, contexte ou pas. Le coût spécifique du contexte n'apparaît que lorsqu'il court-circuite une mémorisation — un composant enveloppé dans `memo` que le contexte force à se re-rendre malgré des props inchangées.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Mesurer avant de découper",
      text: "Le profileur des outils de développement React affiche quels composants se re-rendent et pourquoi, avec l'option « Highlight updates ». Un découpage de contextes fait à l'aveugle complique le code sans gain démontrable. Le vrai signal est visible : une frappe au clavier qui fait clignoter la moitié de l'écran dans le profileur.",
    },
    {
      kind: "text",
      text: "Une troisième parade existe, moins connue et parfois suffisante : envelopper les enfants dans une variable stable. Si le fournisseur reçoit ses enfants en `children` plutôt que de les construire lui-même, ces enfants ne sont pas recréés lorsqu'il se re-rend — seuls les consommateurs effectifs du contexte le sont. Cela ne supprime pas le re-rendu des consommateurs, mais évite celui de tout le sous-arbre.",
    },
    {
      kind: "text",
      text: "Retenons la formulation qui répond bien en entretien : le contexte résout le passage de props, pas la gestion d'état. Il n'offre aucun abonnement fin, et un changement de sa valeur re-rend tous ses consommateurs. On le réserve donc aux valeurs stables et transverses, et l'on prend un gestionnaire dédié dès qu'on a besoin de sélecteurs.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "react-data-07",
    difficulty: 2,
    tags: ["react", "context", "performance"],
    prompt: "Un contexte contient `{ user, theme, panier }`. Un composant ne lit que `theme`. Que se passe-t-il quand `panier` change ?",
    choices: [
      "Le composant se re-rend : un consommateur se re-rend dès que la valeur du contexte change, quelle que soit la partie lue.",
      "Rien : React compare champ par champ et ne notifie que les consommateurs concernés.",
      "Rien, à condition que le composant soit enveloppé dans `memo`.",
      "Le composant se re-rend uniquement si `theme` a changé lors du même rendu.",
    ],
    answer: 0,
    explanation:
      "Il n'existe aucun abonnement partiel dans le contexte : la comparaison porte sur l'identité de la valeur entière. Modifier `panier` produit un nouvel objet, donc tous les consommateurs se re-rendent. `memo` n'y change rien — c'est justement le cas où le contexte court-circuite la mémorisation.",
  },
  {
    kind: "order",
    id: "react-data-08",
    difficulty: 2,
    tags: ["react", "context", "performance"],
    prompt: "Une frappe au clavier fait re-rendre la moitié de l'écran. Remets la démarche dans l'ordre.",
    items: [
      "Profiler avec les outils React pour voir quels composants se re-rendent et pourquoi",
      "Identifier le contexte dont la valeur change à chaque frappe",
      "Le découper par rythme de changement, et séparer les actions des données",
      "Re-profiler pour vérifier que les re-rendus ont bien disparu",
    ],
    explanation:
      "Découper des contextes à l'aveugle complique le code sans gain démontrable. Le profileur donne l'information exacte — le composant, la cause, la fréquence — et permet de vérifier après coup que la correction a l'effet attendu. Sans mesure avant et après, on ne sait pas si l'on a optimisé ou seulement compliqué.",
  },
  {
    kind: "recall",
    id: "react-data-09",
    difficulty: 3,
    tags: ["react", "context", "conception"],
    prompt: "Pourquoi « on n'a pas besoin de Redux, on a Context » est-il une comparaison faussée ?",
    explanation:
      "Parce que les deux ne répondent pas à la même question. Le contexte est un mécanisme de **transport** : il fait descendre une valeur dans l'arbre en évitant le passage de props. Un gestionnaire d'état est un mécanisme d'**abonnement** : un composant déclare par un sélecteur la partie de l'état qui l'intéresse, et il n'est notifié que si celle-ci change. Le contexte n'offre rien de tel — un changement de sa valeur re-rend tous ses consommateurs, y compris ceux qui n'en lisent qu'un champ sur douze, et cela court-circuite jusqu'aux composants enveloppés dans `memo`. S'y ajoutent l'absence d'outils de développement, de voyage dans le temps et d'endroit naturel où sortir la logique des composants. La bonne question est donc « ai-je besoin d'un abonnement partiel ? » : tant que les valeurs partagées changent rarement, le contexte suffit.",
    keyPoints: [
      "Context = transport ; gestionnaire d'état = abonnement par sélecteur",
      "Un changement de valeur re-rend tous les consommateurs",
      "Il court-circuite même les composants enveloppés dans memo",
      "La question utile : ai-je besoin d'un abonnement partiel ?",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les gestionnaires d'état client
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "react-data-l4",
  title: "Les gestionnaires d'état client",
  blocks: [
    {
      kind: "text",
      text: "Quand un état client est réellement partagé, change souvent et porte de la logique, un gestionnaire dédié apporte trois choses que ni `useState` ni le contexte ne donnent : un abonnement par sélecteur, un endroit hors des composants où vit la logique de transition, et des outils pour observer ce qui se passe.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Redux Toolkit : un état, des transitions nommées.",
      code: `const panierSlice = createSlice({
  name: "panier",
  initialState: { lignes: [] as Ligne[] },
  reducers: {
    ajoute(state, action: PayloadAction<Ligne>) {
      // Immer : on écrit du code « mutant », il produit
      // une nouvelle valeur immuable derrière.
      state.lignes.push(action.payload);
    },
    retire(state, action: PayloadAction<string>) {
      state.lignes = state.lignes.filter(l => l.id !== action.payload);
    },
  },
});

// Abonnement par SÉLECTEUR : ce composant ne se re-rend
// que si le nombre de lignes change.
const nb = useSelector((s: RootState) => s.panier.lignes.length);
const dispatch = useDispatch();`,
    },
    {
      kind: "text",
      text: "Le sélecteur est le point essentiel. Le composant déclare la partie de l'état qui l'intéresse ; la bibliothèque compare le résultat entre deux mises à jour et ne re-rend que si cette partie a changé. C'est exactement ce que le contexte ne sait pas faire, et c'est ce qui rend un état partagé fréquemment modifié supportable.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Zustand : le même principe, en beaucoup moins de cérémonie.",
      code: `const usePanier = create<PanierState>((set) => ({
  lignes: [],
  ajoute: (l) => set((s) => ({ lignes: [...s.lignes, l] })),
  retire: (id) => set((s) => ({
    lignes: s.lignes.filter(x => x.id !== id),
  })),
}));

// Sélecteur, sans fournisseur à monter dans l'arbre :
const nb = usePanier((s) => s.lignes.length);
const ajoute = usePanier((s) => s.ajoute);   // stable`,
    },
    {
      kind: "text",
      text: "Zustand illustre que l'apport n'est pas le formalisme mais le mécanisme. Pas de fournisseur à placer dans l'arbre, pas d'actions ni de réducteurs à déclarer séparément : un magasin, des sélecteurs, et des fonctions de mise à jour. Pour la majorité des applications, c'est suffisant, et le code à écrire est du même ordre que celui d'un contexte bien fait.",
    },
    {
      kind: "comparison",
      title: "Deux philosophies",
      left: {
        label: "Redux Toolkit",
        text: "Transitions nommées, flux unidirectionnel explicite, outils de développement avec historique et voyage dans le temps. Plus de cérémonie, mais une traçabilité précieuse quand plusieurs équipes touchent au même état et qu'il faut comprendre après coup.",
      },
      right: {
        label: "Zustand, Jotai",
        text: "Le minimum : un magasin, des sélecteurs. Aucun fournisseur, très peu de code. Convient à la majorité des besoins ; on perd l'historique détaillé des actions, ce qui se sent surtout sur les états complexes à plusieurs contributeurs.",
      },
    },
    {
      kind: "text",
      text: "Une mise en garde importante : ces outils sont faits pour l'état **client**. Y ranger des données serveur — une liste chargée par une API — est le contresens le plus fréquent. On se retrouve à écrire à la main des actions `chargementDémarré`, `chargementRéussi`, `chargementÉchoué`, à gérer soi-même le cache et la péremption, et à dupliquer ce qu'un outil d'état serveur fait mieux en trois lignes.",
    },
    {
      kind: "text",
      text: "Le second piège est de tout centraliser. Un état qui n'intéresse qu'un composant et ses enfants directs n'a rien à faire dans un magasin global : on y perd la localité, on allonge la distance entre la cause et l'effet, et l'on rend le composant impossible à réutiliser ailleurs. `useState` reste le bon outil pour la grande majorité des états.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un sélecteur qui renvoie un objet neuf",
      text: "`useSelector(s => ({ a: s.a, b: s.b }))` crée un nouvel objet à chaque appel : la comparaison par identité échoue toujours et le composant se re-rend à chaque action, y compris sans rapport. Il faut soit sélectionner les champs séparément, soit fournir une comparaison superficielle — `useSelector(…, shallowEqual)` — soit mémoriser le sélecteur avec `createSelector`.",
    },
    {
      kind: "text",
      text: "Un mot sur l'immuabilité, qui reste la règle quel que soit l'outil. Modifier un tableau en place ne change pas sa référence, donc ni les sélecteurs ni les comparaisons de React ne détectent quoi que ce soit, et l'écran ne bouge pas. Redux Toolkit masque cette contrainte derrière un mécanisme qui produit une nouvelle valeur à partir d'un code d'apparence mutante ; les autres bibliothèques attendent qu'on écrive soi-même la copie.",
    },
    {
      kind: "text",
      text: "Le critère de choix tient donc en peu de mots. Un état local : `useState`. Une valeur transverse et stable : contexte. Un état client partagé, fréquemment modifié, lu par beaucoup de composants : un gestionnaire avec sélecteurs. Une donnée dont la vérité est sur le serveur : ni l'un ni l'autre, mais l'outil de la leçon suivante.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "react-data-10",
    difficulty: 2,
    tags: ["react", "etat", "redux"],
    prompt: "Qu'apporte un gestionnaire d'état que le contexte n'apporte pas ?",
    choices: [
      "L'abonnement par sélecteur : un composant ne se re-rend que si la partie qu'il lit a changé.",
      "La possibilité de partager une valeur entre plusieurs composants de l'arbre.",
      "L'immuabilité de l'état, que le contexte ne garantit pas.",
      "Le rendu asynchrone des composants abonnés.",
    ],
    answer: 0,
    explanation:
      "Le partage est ce que le contexte sait déjà faire. Ce qu'il ne sait pas faire, c'est l'abonnement partiel : chez lui, tout changement de valeur re-rend tous les consommateurs. Un sélecteur permet à chaque composant de déclarer la portion qui l'intéresse et de n'être notifié que pour elle.",
  },
  {
    kind: "spot",
    id: "react-data-11",
    difficulty: 3,
    tags: ["react", "redux", "performance"],
    prompt: "Ce composant se re-rend à chaque action, même sans rapport. Quelle ligne ?",
    code: {
      language: "tsx",
      code: `function Resume() {
  const dispatch = useDispatch();
  const { nom, total } = useSelector((s) => ({
    nom: s.user.nom,
    total: s.panier.total,
  }));
  return <p>{nom} — {total} €</p>;
}`,
    },
    faultyLine: 3,
    reasons: [
      "Le sélecteur renvoie un objet neuf à chaque appel : la comparaison par identité échoue toujours.",
      "`useSelector` ne peut pas être utilisé dans un composant qui appelle aussi `useDispatch`.",
      "Le sélecteur doit être déclaré en dehors du composant pour fonctionner.",
      "Il manque un tableau de dépendances en second argument de `useSelector`.",
    ],
    reasonAnswer: 0,
    explanation:
      "La comparaison par défaut se fait par identité. Un littéral d'objet produit une référence neuve à chaque évaluation, donc « différente » à chaque action, et le composant se re-rend systématiquement. On sélectionne les champs séparément — deux appels à `useSelector` —, ou l'on passe `shallowEqual`, ou l'on mémorise avec `createSelector`.",
  },
  {
    kind: "recall",
    id: "react-data-12",
    difficulty: 2,
    tags: ["react", "etat", "conception"],
    prompt: "Quel est le contresens le plus fréquent avec un gestionnaire d'état client ?",
    explanation:
      "Y ranger des données serveur. Ces outils sont conçus pour l'état client — ce qui appartient à l'interface et dont vous êtes la seule source. Une liste chargée depuis une API n'entre pas dans cette catégorie : c'est un cache d'une vérité distante. En la mettant dans le magasin, on se retrouve à écrire à la main des actions `chargementDémarré`, `chargementRéussi` et `chargementÉchoué`, à gérer soi-même la péremption, la revalidation, la déduplication des requêtes parallèles et l'annulation — c'est-à-dire à réimplémenter partiellement un outil d'état serveur. Le second contresens, plus discret, est de tout centraliser : un état qui n'intéresse qu'un composant et ses enfants perd sa localité dans un magasin global et rend le composant non réutilisable.",
    keyPoints: [
      "Y mettre des données serveur : c'est un cache, pas un état client",
      "On finit par réécrire chargement, erreur, péremption, déduplication",
      "Second piège : tout centraliser, au détriment de la localité",
      "useState reste le bon outil pour la majorité des états",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — L'état serveur est un cache
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "react-data-l5",
  title: "L'état serveur est un cache",
  blocks: [
    {
      kind: "text",
      text: "Charger des données dans un `useEffect` et les ranger dans un `useState` est le premier réflexe qu'on apprend, et c'est aussi celui qui produit le plus de code incomplet. Le motif paraît anodin ; il cache une liste de cas que presque personne ne traite entièrement.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Le chargement fait à la main, dans sa version courante.",
      code: `function Commandes({ clientId }) {
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    setChargement(true);
    fetch(\`/api/clients/\${clientId}/commandes\`)
      .then(r => r.json())
      .then(setDonnees)
      .catch(setErreur)
      .finally(() => setChargement(false));
  }, [clientId]);

  // …
}`,
    },
    {
      kind: "text",
      text: "Ce code contient un bug de concurrence classique. Si `clientId` change vite, deux requêtes partent et rien ne garantit l'ordre des réponses : la plus lente peut arriver en dernier et écraser la plus récente, affichant les commandes du mauvais client. Il manque aussi la déduplication — deux composants affichant la même liste feront deux requêtes —, le cache entre navigations, la revalidation au retour sur l'onglet, et la nouvelle tentative en cas d'échec réseau.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Le même besoin, avec un outil d'état serveur.",
      code: `function Commandes({ clientId }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["commandes", clientId],
    queryFn: () => fetchCommandes(clientId),
  });

  if (isPending) return <Spinner />;
  if (isError) return <Erreur message={error.message} />;
  return <Liste commandes={data} />;
}

// La clé identifie la donnée. Deux composants qui
// demandent la même clé partagent une requête et un
// cache. Le changement de clientId annule proprement
// la requête précédente.`,
    },
    {
      kind: "text",
      text: "Le changement de perspective est celui-ci : on ne décrit plus une séquence — charger, puis stocker, puis afficher — mais une **déclaration**. On dit quelle donnée le composant a besoin d'afficher, identifiée par une clé, et la bibliothèque se charge du reste : requête, cache partagé, déduplication, ordre des réponses, nouvelles tentatives, revalidation.",
    },
    {
      kind: "comparison",
      title: "Deux propriétés qu'on confond",
      left: {
        label: "staleTime — fraîcheur",
        text: "Combien de temps la donnée est considérée à jour. Tant qu'elle l'est, aucune requête n'est refaite, même si le composant est remonté. C'est le réglage qui gouverne le trafic réseau, et sa valeur par défaut est zéro : tout est immédiatement périmé.",
      },
      right: {
        label: "gcTime — conservation",
        text: "Combien de temps la donnée reste en mémoire une fois qu'aucun composant ne l'utilise plus. Elle sert à afficher instantanément un contenu déjà vu pendant qu'une revalidation se fait en arrière-plan. N'a aucun effet sur la fraîcheur.",
      },
    },
    {
      kind: "text",
      text: "Confondre ces deux réglages est la source d'attentes déçues. Un `gcTime` élevé ne réduit pas les requêtes : il conserve seulement de quoi afficher tout de suite pendant qu'on revalide. C'est `staleTime` qui décide si une requête part. Une liste qui bouge peu gagne beaucoup à recevoir un `staleTime` de quelques minutes, ce qui supprime une grande partie du trafic sans que l'utilisateur perçoive quoi que ce soit.",
    },
    {
      kind: "text",
      text: "Un dernier apport mérite d'être connu, car il change l'impression d'ensemble d'une application : la donnée périmée reste affichée pendant la revalidation. L'utilisateur qui revient sur une page voit immédiatement le contenu précédent, mis à jour discrètement si le serveur a changé, au lieu d'un indicateur de chargement. C'est gratuit et cela supprime l'essentiel des écrans vides.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ne pas recopier le résultat dans un useState",
      text: "Écrire `useEffect(() => setListe(data), [data])` réintroduit tout ce qu'on venait de supprimer : une seconde source de vérité, un rendu de retard, et un état qui ne sera pas mis à jour par la revalidation. Si la donnée doit être transformée pour l'affichage, on la transforme pendant le rendu, ou avec l'option `select` de la requête.",
    },
    {
      kind: "text",
      text: "La conception des clés mérite quelques minutes de réflexion, car c'est elle qui rendra l'invalidation simple par la suite. Une clé se lit du général au particulier — `[\"commandes\", clientId, { statut, page }]` — et doit contenir **tout** ce dont dépend la requête. Un paramètre oublié dans la clé produit le bug le plus déroutant du domaine : deux données différentes partagent la même entrée de cache, et l'une écrase l'autre.",
    },
    {
      kind: "text",
      text: "La formule à retenir : une donnée serveur n'est pas un état, c'est un cache. Elle a un propriétaire ailleurs, elle peut devenir fausse sans que personne ne vous prévienne, et le travail consiste à décider quand la rafraîchir — pas à la posséder. Tout l'outillage découle de cette phrase.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "spot",
    id: "react-data-13",
    difficulty: 3,
    tags: ["react", "data-fetching"],
    prompt: "Ce chargement affiche parfois les données du mauvais client. Quelle ligne est en cause ?",
    code: {
      language: "tsx",
      code: `useEffect(() => {
  setChargement(true);
  fetch(\`/api/clients/\${clientId}/commandes\`)
    .then(r => r.json())
    .then(setDonnees)
    .finally(() => setChargement(false));
}, [clientId]);`,
    },
    faultyLine: 5,
    reasons: [
      "Rien n'annule la requête précédente : si `clientId` change vite, une réponse tardive écrase la plus récente.",
      "`setDonnees` ne peut pas être passé directement en référence à `.then`.",
      "Le tableau de dépendances devrait être vide pour ne charger qu'une fois.",
      "`setChargement(true)` devrait être appelé après le `fetch`, pas avant.",
    ],
    reasonAnswer: 0,
    explanation:
      "C'est la course classique : deux requêtes en vol, aucun ordre garanti sur les réponses. La plus lente arrive en dernier et écrase la plus récente. La correction manuelle passe par un drapeau d'annulation dans la fonction de nettoyage de l'effet, ou par un `AbortController`. Un outil d'état serveur traite ce cas par construction, la clé identifiant la donnée demandée.",
  },
  {
    kind: "mcq",
    id: "react-data-14",
    difficulty: 3,
    tags: ["react", "data-fetching", "cache"],
    prompt: "Quelle option réduit réellement le nombre de requêtes réseau ?",
    choices: [
      "`staleTime` : tant que la donnée est considérée fraîche, aucune requête n'est refaite.",
      "`gcTime` : plus la donnée reste en mémoire, moins on la redemande.",
      "`retry` : moins de nouvelles tentatives, donc moins de requêtes.",
      "`refetchOnMount: true` : le montage sert alors de cache.",
    ],
    answer: 0,
    explanation:
      "`staleTime` gouverne la fraîcheur, donc le déclenchement des requêtes ; sa valeur par défaut est zéro, ce qui rend tout immédiatement périmé. `gcTime` ne décide que de la durée de conservation en mémoire une fois la donnée inutilisée : il permet d'afficher instantanément un contenu déjà vu pendant qu'on revalide, mais ne supprime aucune requête.",
  },
  {
    kind: "recall",
    id: "react-data-15",
    difficulty: 2,
    tags: ["react", "data-fetching"],
    prompt: "Que faut-il traiter quand on charge des données à la main dans un `useEffect` ?",
    explanation:
      "Bien plus que les trois états qu'on écrit spontanément. Il faut d'abord l'**ordre des réponses** : si la dépendance change vite, deux requêtes sont en vol et la plus lente peut écraser la plus récente, ce qui affiche les données d'un autre élément. Il faut la **déduplication** : deux composants affichant la même liste déclenchent deux appels. Le **cache entre navigations**, sans lequel revenir sur une page recharge tout et affiche un écran vide. La **revalidation** au retour sur l'onglet ou après une reconnexion. Les **nouvelles tentatives** en cas d'échec réseau transitoire. Et l'**annulation** au démontage, pour ne pas mettre à jour un composant disparu. Chacun de ces points est traitable à la main, mais l'ensemble représente beaucoup de code, à réécrire à chaque endroit.",
    keyPoints: [
      "Ordre des réponses : la plus lente peut écraser la plus récente",
      "Déduplication des requêtes identiques",
      "Cache entre navigations, sinon écran vide au retour",
      "Revalidation, nouvelles tentatives, annulation au démontage",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Mutations, invalidation et mise à jour optimiste
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "react-data-l6",
  title: "Mutations, invalidation et mise à jour optimiste",
  blocks: [
    {
      kind: "text",
      text: "Lire des données est la moitié du problème. Dès qu'on en écrit, une question apparaît : le cache local contient maintenant une version périmée de ce que le serveur détient. Une commande vient d'être annulée, mais la liste affichée la montre toujours en cours. Décider comment resynchroniser est le vrai sujet des mutations.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Une mutation, et l'invalidation de ce qu'elle rend faux.",
      code: `const queryClient = useQueryClient();

const annuler = useMutation({
  mutationFn: (id: string) => annulerCommande(id),
  onSuccess: (_, id) => {
    // « Ces données ne sont plus fiables » : les requêtes
    // actives correspondantes sont refaites.
    queryClient.invalidateQueries({ queryKey: ["commandes"] });
    queryClient.invalidateQueries({ queryKey: ["commande", id] });
  },
});

<button onClick={() => annuler.mutate(cmd.id)}
        disabled={annuler.isPending}>
  Annuler
</button>`,
    },
    {
      kind: "text",
      text: "L'invalidation est la stratégie par défaut, et c'est la bonne dans la grande majorité des cas. Elle ne modifie pas le cache : elle marque des clés comme périmées, ce qui déclenche une nouvelle requête pour celles qui sont affichées. On ne devine jamais ce que le serveur a réellement fait — total recalculé, statut dérivé, horodatage — on le redemande.",
    },
    {
      kind: "text",
      text: "Le préfixe de clé rend l'invalidation économique à écrire. Invalider `[\"commandes\"]` invalide aussi `[\"commandes\", clientId]` et `[\"commandes\", clientId, page]`, puisque la correspondance se fait par préfixe. C'est ce qui rend la conception des clés importante : une hiérarchie du général au particulier permet d'exprimer « tout ce qui concerne les commandes » en une ligne.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "La mise à jour optimiste : afficher avant la confirmation.",
      code: `const cocher = useMutation({
  mutationFn: (id: string) => marquerFait(id),

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["taches"] });
    const precedent = queryClient.getQueryData(["taches"]);
    queryClient.setQueryData(["taches"], (old) =>
      old.map(t => t.id === id ? { ...t, fait: true } : t));
    return { precedent };          // pour pouvoir revenir en arrière
  },

  onError: (_e, _id, contexte) => {
    queryClient.setQueryData(["taches"], contexte.precedent);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["taches"] });
  },
});`,
    },
    {
      kind: "text",
      text: "La mise à jour optimiste applique le changement dans le cache avant la réponse du serveur, ce qui donne une interface instantanée. Elle exige trois précautions, et les trois sont visibles ci-dessus : annuler les requêtes en cours pour qu'une réponse en vol n'écrase pas la modification, conserver l'état précédent pour pouvoir revenir en arrière en cas d'échec, et revalider à la fin quel que soit le résultat.",
    },
    {
      kind: "comparison",
      title: "Quand se permettre l'optimisme",
      left: {
        label: "Approprié",
        text: "L'action réussit presque toujours, son effet est simple et prévisible, et l'annuler visuellement ne choque pas : cocher une tâche, aimer un message, réordonner une liste. Le gain de réactivité est immédiat et l'échec reste rare.",
      },
      right: {
        label: "À éviter",
        text: "L'action peut légitimement échouer — stock insuffisant, solde insuffisant, conflit — ou son résultat dépend d'un calcul serveur. Afficher un paiement réussi puis le retirer est bien pire qu'un demi-second d'attente honnête.",
      },
    },
    {
      kind: "text",
      text: "Une variante moins risquée existe et suffit souvent : utiliser la réponse de la mutation pour mettre le cache à jour, plutôt que de deviner. Le serveur renvoie l'objet modifié, on le place dans le cache avec `setQueryData`, et l'on évite une requête de rechargement sans jamais afficher un état inventé. C'est le meilleur compromis quand l'API renvoie la ressource complète.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Désactiver le bouton pendant la mutation",
      text: "Sans `disabled={mutation.isPending}`, un double clic envoie deux requêtes. Sur une action non idempotente — créer une commande, effectuer un paiement — cela crée deux objets. La protection côté interface ne dispense pas de la clé d'idempotence côté serveur, mais elle supprime le cas le plus fréquent, qui est le simple double clic.",
    },
    {
      kind: "text",
      text: "Reste la question des erreurs de mutation, qui ne se traitent pas comme celles des lectures. Une lecture qui échoue peut être retentée automatiquement sans dommage ; une écriture, non — la relancer risque de créer un doublon si la première avait en réalité abouti. Les nouvelles tentatives automatiques sont donc désactivées par défaut sur les mutations, et c'est à l'interface de proposer explicitement de réessayer.",
    },
    {
      kind: "text",
      text: "En résumé : invalider par défaut, car c'est simple et toujours juste ; utiliser la réponse de la mutation quand l'API la fournit, pour économiser un aller-retour ; réserver l'optimisme aux actions qui échouent rarement et dont l'effet est trivial à prédire. Ces trois niveaux couvrent l'ensemble des situations courantes.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "react-data-16",
    difficulty: 2,
    tags: ["react", "data-fetching", "cache"],
    prompt: "Que fait `invalidateQueries({ queryKey: [\"commandes\"] })` ?",
    choices: [
      "Marque comme périmées toutes les clés commençant par « commandes » et refait les requêtes actuellement affichées.",
      "Supprime immédiatement du cache toutes les données liées aux commandes.",
      "Refait immédiatement toutes les requêtes de commandes, affichées ou non.",
      "Bloque toute nouvelle requête de commandes jusqu'à la prochaine navigation.",
    ],
    answer: 0,
    explanation:
      "L'invalidation ne supprime rien : elle marque des clés comme périmées, et seules les requêtes montées à l'écran sont immédiatement refaites — les autres le seront à leur prochaine utilisation. La correspondance se fait par préfixe, ce qui atteint aussi `[\"commandes\", clientId]` et explique l'importance d'une hiérarchie de clés bien pensée.",
  },
  {
    kind: "order",
    id: "react-data-17",
    difficulty: 3,
    tags: ["react", "data-fetching"],
    prompt: "Remets dans l'ordre les étapes d'une mise à jour optimiste correcte.",
    items: [
      "Annuler les requêtes en cours sur la clé, pour qu'aucune réponse en vol n'écrase le changement",
      "Sauvegarder l'état précédent du cache, afin de pouvoir revenir en arrière",
      "Écrire immédiatement la valeur attendue dans le cache",
      "En cas d'échec, restaurer l'état sauvegardé",
      "Dans tous les cas, invalider la clé pour resynchroniser avec le serveur",
    ],
    explanation:
      "Chacune de ces étapes couvre un cas précis. Sans l'annulation, une requête partie avant la mutation peut revenir après et rétablir l'ancienne valeur. Sans la sauvegarde, l'échec laisse l'interface dans un état inventé. Sans l'invalidation finale, le cache reste sur la valeur devinée, qui peut différer de ce que le serveur a réellement enregistré.",
  },
  {
    kind: "recall",
    id: "react-data-18",
    difficulty: 2,
    tags: ["react", "data-fetching", "conception"],
    prompt: "Quand une mise à jour optimiste est-elle un mauvais choix ?",
    explanation:
      "Quand l'action peut légitimement échouer, ou quand son résultat dépend d'un calcul que seul le serveur peut faire. Afficher un paiement comme réussi puis le retirer une seconde plus tard est bien pire qu'une demi-seconde d'attente honnête : l'utilisateur a vu une information fausse et ne sait plus quoi croire. Même chose pour un stock insuffisant, un solde insuffisant ou un conflit de version, où l'échec est une issue normale et non un incident rare. L'optimisme convient aux actions qui réussissent presque toujours et dont l'effet est trivial à prédire — cocher une tâche, aimer un message, réordonner une liste. Entre les deux existe un compromis souvent meilleur : utiliser la réponse de la mutation pour mettre le cache à jour, ce qui économise un aller-retour sans jamais afficher un état inventé.",
    keyPoints: [
      "Mauvais si l'échec est une issue normale : stock, solde, conflit",
      "Mauvais si le résultat dépend d'un calcul serveur",
      "Montrer puis retirer est pire qu'attendre honnêtement",
      "Compromis : écrire dans le cache la réponse réelle de la mutation",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Le routage et l'état d'URL
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "react-data-l7",
  title: "Le routage et l'état d'URL",
  blocks: [
    {
      kind: "text",
      text: "Une application à page unique remplace la navigation du navigateur par la sienne. Si elle le fait mal, elle casse trois choses que les utilisateurs tiennent pour acquises depuis toujours : le bouton retour, le partage d'un lien, et le rechargement de la page en cours. Le routage n'est donc pas une affaire d'affichage conditionnel, c'est la restitution de ces trois garanties.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Des routes imbriquées, et un rendu d'enfant.",
      code: `const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,                 // en-tête, navigation
    errorElement: <PageErreur />,        // capte les erreurs des enfants
    children: [
      { index: true, element: <Accueil /> },
      { path: "commandes", element: <ListeCommandes /> },
      { path: "commandes/:id", element: <DetailCommande /> },
      { path: "*", element: <PageIntrouvable /> },
    ],
  },
]);

// Dans Layout : <Outlet /> rend la route enfant active.
// La navigation ne recharge que ce qui change.`,
    },
    {
      kind: "text",
      text: "L'imbrication est le mécanisme central : une route parente rend la structure commune et délègue le reste à ses enfants par un emplacement d'insertion. Naviguer d'une commande à l'autre ne re-rend que la partie détail, pas l'en-tête ni la navigation. C'est ce qui donne à une application monopage sa fluidité, et ce qu'un affichage conditionnel écrit à la main ne procure pas.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Les paramètres d'URL comme état partageable.",
      code: `function ListeCommandes() {
  const [params, setParams] = useSearchParams();

  const statut = params.get("statut") ?? "toutes";
  const page = Number(params.get("page") ?? 1);

  // La requête dépend de l'URL : un lien partagé
  // reproduit exactement le même écran.
  const { data } = useQuery({
    queryKey: ["commandes", statut, page],
    queryFn: () => fetchCommandes({ statut, page }),
  });

  return <Filtre valeur={statut}
                 onChange={(s) => setParams({ statut: s, page: "1" })} />;
}`,
    },
    {
      kind: "text",
      text: "Ranger le filtre et la page dans l'adresse plutôt que dans un `useState` apporte gratuitement ce qu'il aurait fallu écrire : le lien est partageable, le retour arrière ramène au filtre précédent, et le rechargement conserve l'écran. C'est la meilleure illustration du principe posé en première leçon — beaucoup de besoins d'état disparaissent en posant la donnée au bon endroit.",
    },
    {
      kind: "comparison",
      title: "Deux natures de paramètre",
      left: {
        label: "Segment de chemin — /commandes/:id",
        text: "Identifie **la ressource** affichée. Il est obligatoire : sans lui, la page n'a pas de sens. Change la page elle-même, et mérite une entrée distincte dans l'historique.",
      },
      right: {
        label: "Paramètre de requête — ?statut=payee",
        text: "Affine **la vue** d'une même ressource : filtre, tri, page, onglet. Il est facultatif et la page reste valide sans lui. Plusieurs peuvent se combiner sans multiplier les routes.",
      },
    },
    {
      kind: "text",
      text: "Confondre les deux produit des routes qui prolifèrent — `/commandes/payees`, `/commandes/payees/page2` — là où deux paramètres de requête auraient suffi. La règle est simple : si l'absence du paramètre laisse une page qui a du sens, c'est un paramètre de requête. Sinon, c'est un segment de chemin.",
    },
    {
      kind: "text",
      text: "Un point pratique sur l'historique : remplacer l'entrée courante plutôt que d'en empiler une nouvelle change beaucoup l'expérience du bouton retour. Un filtre modifié cinq fois de suite ne devrait pas obliger à cinq retours pour sortir de la page. Les API de navigation offrent cette option, et l'oublier produit un historique que les utilisateurs perçoivent comme cassé.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une balise a qui recharge tout",
      text: "Utiliser `<a href=\"/commandes\">` au lieu du composant de lien du routeur provoque un rechargement complet de l'application : tout l'état est perdu, le cache est vidé, et la page clignote. Le symptôme est visible — un écran blanc d'une seconde là où la navigation devrait être instantanée — et la cause est presque toujours celle-là.",
    },
    {
      kind: "text",
      text: "Le découpage du code suit naturellement le routage : chaque route peut être chargée à la demande, ce qui évite d'envoyer au premier affichage le code de toutes les pages de l'application. C'est le découpage le plus rentable et le plus simple à mettre en place, car la frontière est déjà dessinée — une route est par nature une unité que l'utilisateur atteint ou n'atteint pas.",
    },
    {
      kind: "text",
      text: "Un mot enfin sur le chargement des données par le routeur. Les versions récentes permettent de déclarer un chargeur par route, exécuté **pendant** la navigation plutôt qu'après le montage du composant. On supprime ainsi la cascade classique — afficher, puis découvrir qu'il faut charger, puis attendre — au profit d'une transition qui ne montre la nouvelle page que lorsqu'elle a de quoi s'afficher.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "react-data-19",
    difficulty: 2,
    tags: ["react", "routage"],
    prompt: "Où ranger le filtre « statut » d'une liste de commandes ?",
    choices: [
      "Dans les paramètres de requête de l'URL : lien partageable, retour arrière et rechargement gratuits.",
      "Dans un `useState` du composant liste, c'est un état purement local.",
      "Dans un contexte, pour que d'autres composants puissent le lire.",
      "Dans un segment de chemin, comme `/commandes/payees`.",
    ],
    answer: 0,
    explanation:
      "Un filtre affine la vue d'une ressource : la page garde du sens sans lui, c'est donc un paramètre de requête. L'y placer donne gratuitement le partage par lien, le retour arrière et la persistance au rechargement. En faire un segment de chemin ferait proliférer les routes dès qu'un second filtre apparaît.",
  },
  {
    kind: "match",
    id: "react-data-20",
    difficulty: 2,
    tags: ["react", "routage"],
    prompt: "Associe chaque élément de routage à son rôle.",
    pairs: [
      { left: "Route imbriquée avec Outlet", right: "Rendre la structure commune une fois et ne changer que le contenu" },
      { left: "Segment de chemin :id", right: "Identifier la ressource affichée, obligatoire" },
      { left: "Paramètre de requête ?statut=", right: "Affiner la vue, facultatif et combinable" },
      { left: "errorElement", right: "Capter les erreurs survenues dans les routes enfants" },
    ],
    explanation:
      "L'imbrication est ce qui distingue un vrai routeur d'un affichage conditionnel : elle évite de re-rendre l'en-tête et la navigation à chaque changement de page. `errorElement` place une frontière d'erreur au niveau de la route, ce qui permet de garder la structure de l'application affichée quand une page échoue.",
  },
  {
    kind: "recall",
    id: "react-data-21",
    difficulty: 2,
    tags: ["react", "routage"],
    prompt: "Quelles garanties du navigateur une application monopage doit-elle restituer, et comment ?",
    explanation:
      "Trois, que les utilisateurs tiennent pour acquises : le **bouton retour** doit ramener à l'écran précédent, un **lien partagé** doit reproduire exactement le même écran chez quelqu'un d'autre, et un **rechargement** doit conserver l'état affiché. On les restitue en faisant porter par l'URL tout ce qui décrit l'écran — la ressource dans le chemin, les filtres, le tri et la pagination dans les paramètres de requête — plutôt que dans des `useState` invisibles de l'extérieur. Deux erreurs cassent ces garanties : utiliser une balise `a` ordinaire au lieu du composant de lien du routeur, ce qui recharge toute l'application et vide l'état ; et empiler une entrée d'historique à chaque modification de filtre, ce qui oblige à cinq retours pour sortir d'une page — il faut alors remplacer l'entrée courante.",
    keyPoints: [
      "Bouton retour, lien partageable, rechargement conservé",
      "L'URL doit décrire l'écran : chemin pour la ressource, requête pour la vue",
      "Une balise a ordinaire recharge tout et vide l'état",
      "Remplacer l'entrée d'historique sur un changement de filtre",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Les frontières d'erreur et les états dégradés
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "react-data-l8",
  title: "Les frontières d'erreur et les états dégradés",
  blocks: [
    {
      kind: "text",
      text: "Une erreur non rattrapée pendant le rendu ne laisse pas React dans un état intermédiaire : il démonte l'arbre entier. Le comportement paraît brutal, mais il est délibéré — une interface à moitié rendue affiche des données incohérentes, et c'est bien pire qu'un écran d'erreur. Le résultat par défaut reste néanmoins inacceptable : une page blanche, sans explication ni recours.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Une frontière d'erreur, et ce qu'elle permet.",
      code: `class ErrorBoundary extends React.Component {
  state = { erreur: null };

  static getDerivedStateFromError(erreur) {
    return { erreur };                 // bascule vers l'affichage de repli
  }

  componentDidCatch(erreur, info) {
    journaliser(erreur, info.componentStack);   // remonter au serveur
  }

  render() {
    if (this.state.erreur) return this.props.fallback;
    return this.props.children;
  }
}`,
    },
    {
      kind: "text",
      text: "Une frontière d'erreur est le seul cas où une classe reste nécessaire : aucun hook n'expose ce mécanisme, et l'on utilise le plus souvent une bibliothèque plutôt que d'écrire la sienne. Elle capte les erreurs survenues **pendant le rendu** des composants situés en dessous d'elle, affiche un contenu de repli, et permet de journaliser l'incident avec la pile de composants.",
    },
    {
      kind: "text",
      text: "Ses limites doivent être connues, car elles surprennent. Elle ne capte ni les erreurs des gestionnaires d'événements — un `onClick` qui échoue n'est pas un rendu —, ni celles du code asynchrone, ni celles du rendu côté serveur, ni celles survenues dans la frontière elle-même. Pour tout ce qui est asynchrone, la gestion d'erreur reste explicite, ce que les outils d'état serveur fournissent avec leur indicateur d'échec.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Placer les frontières là où la dégradation a un sens.",
      code: `<App>
  <ErrorBoundary fallback={<PageErreurGlobale />}>
    <Layout>
      <ErrorBoundary fallback={<p>Tableau de bord indisponible</p>}>
        <TableauDeBord />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Recommandations indisponibles</p>}>
        <Recommandations />
      </ErrorBoundary>
    </Layout>
  </ErrorBoundary>
</App>

// Une panne des recommandations ne doit pas emporter
// le tableau de bord, ni la navigation.`,
    },
    {
      kind: "text",
      text: "Le placement est la vraie décision. Une frontière unique à la racine transforme n'importe quelle erreur en page blanche stylisée, ce qui est à peine mieux que rien. Des frontières posées autour des zones **indépendantes** permettent une dégradation partielle : une panne du bloc de recommandations laisse la commande consultable, et l'utilisateur peut continuer ce qu'il était venu faire.",
    },
    {
      kind: "comparison",
      title: "Deux familles d'erreur",
      left: {
        label: "Erreur de rendu",
        text: "Un composant lève pendant son rendu — propriété lue sur `undefined`, donnée d'une forme inattendue. C'est un défaut de programmation ou de contrat. La frontière d'erreur la capte, et le message affiché doit rester générique.",
      },
      right: {
        label: "Erreur attendue",
        text: "Une requête échoue, un formulaire est refusé, une ressource est absente. Ce n'est pas un bug mais une issue prévue. Elle se traite dans le composant, avec un message précis et une action possible — réessayer, corriger, revenir.",
      },
    },
    {
      kind: "text",
      text: "Confondre les deux dégrade l'expérience dans les deux sens. Traiter une erreur réseau comme un plantage affiche « une erreur est survenue » là où « impossible de joindre le serveur, réessayer » aurait suffi. Inversement, rattraper un bug de rendu et afficher un message rassurant masque un défaut qui aurait dû remonter en supervision.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Toujours offrir une sortie",
      text: "Un affichage de repli qui ne propose rien laisse l'utilisateur coincé : il ne lui reste que le rechargement, et il perd son contexte. Un bouton « réessayer » qui réinitialise la frontière, un lien vers l'accueil, et un identifiant d'incident à communiquer au support transforment une impasse en incident gérable — pour l'utilisateur comme pour l'équipe.",
    },
    {
      kind: "text",
      text: "Enfin, les trois états d'une donnée distante — chargement, erreur, vide — méritent d'être traités explicitement partout. L'état vide est le plus souvent oublié : une liste sans résultat qui affiche un cadre vide, sans dire si la recherche n'a rien donné, si le filtre est trop restrictif ou si le chargement a échoué. Nommer ces trois cas est le travail le moins spectaculaire et le plus perceptible d'une interface.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "mcq",
    id: "react-data-22",
    difficulty: 2,
    tags: ["react", "erreurs"],
    prompt: "Une frontière d'erreur capte-t-elle une exception levée dans un `onClick` ?",
    choices: [
      "Non : elle ne capte que les erreurs survenues pendant le rendu des composants situés sous elle.",
      "Oui : elle capte toutes les erreurs des composants enfants, quel qu'en soit le moment.",
      "Oui, à condition que le gestionnaire soit déclaré avec `useCallback`.",
      "Non, sauf si le composant est rendu à l'intérieur d'un `Suspense`.",
    ],
    answer: 0,
    explanation:
      "Le mécanisme est lié au cycle de rendu. Un gestionnaire d'événement s'exécute en dehors, tout comme le code asynchrone : ces erreurs doivent être traitées explicitement, par un `try` ou par l'indicateur d'échec d'une mutation. La frontière ne capte pas non plus les erreurs du rendu serveur ni les siennes propres.",
  },
  {
    kind: "mcq",
    id: "react-data-23",
    difficulty: 2,
    tags: ["react", "erreurs", "conception"],
    prompt: "Pourquoi placer plusieurs frontières d'erreur plutôt qu'une seule à la racine ?",
    choices: [
      "Pour permettre une dégradation partielle : une zone en panne ne doit pas emporter le reste de l'application.",
      "Parce qu'une frontière unique ne peut capter que la première erreur rencontrée.",
      "Pour améliorer les performances, chaque frontière isolant un sous-arbre du rendu.",
      "Parce que React impose une frontière par route dans une application monopage.",
    ],
    answer: 0,
    explanation:
      "Une frontière unique à la racine transforme n'importe quelle erreur en page blanche stylisée. Des frontières posées autour des zones indépendantes laissent l'utilisateur continuer : une panne du bloc de recommandations ne doit ni masquer la commande consultée, ni faire disparaître la navigation.",
  },
  {
    kind: "recall",
    id: "react-data-24",
    difficulty: 2,
    tags: ["react", "erreurs"],
    prompt: "Quels états d'une donnée distante faut-il traiter explicitement, et lequel est le plus souvent oublié ?",
    explanation:
      "Trois : le **chargement**, l'**erreur** et le **vide**. C'est le dernier qu'on oublie presque toujours. Une liste sans résultat affiche alors un cadre vide, et l'utilisateur ne peut pas distinguer une recherche qui n'a rien donné, un filtre trop restrictif, ou un chargement qui a silencieusement échoué — trois situations qui appellent trois actions différentes. Un état vide bien traité dit ce qui s'est passé et propose une sortie : élargir le filtre, créer le premier élément, réessayer. S'y ajoute une distinction utile sur l'erreur : une erreur **attendue** — requête refusée, ressource absente — se traite dans le composant avec un message précis et une action, tandis qu'une erreur de **rendu** relève de la frontière d'erreur et doit rester générique pour l'utilisateur tout en remontant complète en supervision.",
    keyPoints: [
      "Chargement, erreur, vide : les trois se traitent explicitement",
      "Le vide est le plus oublié et le plus ambigu pour l'utilisateur",
      "Un état vide dit ce qui s'est passé et propose une sortie",
      "Erreur attendue dans le composant, erreur de rendu à la frontière",
    ],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "react-etat-data",
  title: "État et données : contexte, magasins, cache serveur, routage",
  objective:
    "Placer chaque donnée au bon endroit : distinguer valeur dérivée, état d'URL, état client et cache serveur, connaître les limites du contexte, choisir un gestionnaire d'état à bon escient, gérer lectures et mutations d'un cache distant, faire porter l'écran par l'URL et dégrader proprement en cas d'erreur.",
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
