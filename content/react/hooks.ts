/**
 * React — hooks, état, re-renders (référentiel 6.2, immuabilité de 6.1).
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — L'état est une photo du rendu
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "react-hooks-l1",
  title: "useState : l'état est une photo du rendu",
  blocks: [
    {
      kind: "text",
      text: "Un composant fonctionnel est une fonction que React **rappelle** à chaque rendu. `useState` lui donne une mémoire entre deux appels : une valeur, et une fonction pour demander une nouvelle valeur. Demander, pas modifier : `setCount` ne change pas la variable `count` du rendu en cours, elle **planifie** un nouveau rendu où `count` aura la nouvelle valeur.",
    },
    {
      kind: "text",
      text: "La variable `count` est donc une **photo** prise au moment du rendu. Dans un même événement, React regroupe les mises à jour (batching) et ne re-rend qu'une fois. Appeler trois fois `setCount(count + 1)` n'ajoute que 1 : les trois appels lisent la même photo. La forme fonctionnelle `setCount(c => c + 1)` reçoit l'état à jour, et s'enchaîne correctement.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Trois appels, un seul rendu : la photo ne bouge pas.",
      code: `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // count est la valeur DU RENDU en cours
    setCount(count + 1);
    setCount(count + 1);    // même photo : +1 en tout
    // forme fonctionnelle : reçoit l'état à jour
    setCount(c => c + 1);
    setCount(c => c + 1);   // +2 → au total 0 devient 3
  }
  return <button onClick={handleClick}>{count}</button>;
}

const [user, setUser] = useState({ name: "Ana", tags: [] });
// JAMAIS : user.tags.push("x"); setUser(user);
// même référence → React ne voit aucun changement
setUser({ ...user, tags: [...user.tags, "x"] });`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "React compare l'ancien et le nouvel état avec `Object.is`. Muter un tableau ou un objet puis le renvoyer, c'est renvoyer la **même référence** : React ne re-rend pas. Toujours créer une copie : `[...arr, x]`, `arr.filter(...)`, `arr.map(...)`, `{ ...obj, champ: v }`.",
    },
    {
      kind: "text",
      text: "Cette immuabilité n'est pas une coquetterie : c'est ce qui permet à React de détecter un changement par une simple comparaison de références, sans parcourir les données. Les listes rendues par `map` doivent porter une `key` stable (un id, pas l'index) pour que React associe chaque élément à son DOM d'un rendu à l'autre.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "react-hooks-01",
    difficulty: 2,
    tags: ["react", "use-state", "re-render"],
    prompt: "Après un clic, qu'affiche le bouton ?",
    code: {
      language: "tsx",
      code: `function Counter() {
  const [count, setCount] = useState(0);
  function tripleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={tripleClick}>{count}</button>;
}`,
    },
    choices: ["`1`", "`3`", "`0`", "Erreur : `setCount` ne peut pas être appelé trois fois dans le même événement."],
    answer: 0,
    explanation:
      "Les trois appels lisent la même photo : `count` vaut 0 pendant tout le gestionnaire, donc chacun demande `1`. React regroupe les trois mises à jour et re-rend une fois avec `1`. Pour cumuler, il faut la forme fonctionnelle `setCount(c => c + 1)`, qui reçoit l'état en attente et non la photo.",
  },
  {
    kind: "fill",
    id: "react-hooks-02",
    difficulty: 1,
    tags: ["react", "use-state", "immuabilite"],
    prompt: "Complète pour mettre à jour la liste sans la muter.",
    code: {
      language: "tsx",
      code: `const [items, setItems] = useState<string[]>([]);

function add(item: string) {
  setItems(prev => [{{1}}prev, item]);
}

function rename(i: number, name: string) {
  setItems(prev =>
    prev.{{2}}((it, k) => (k === i ? name : it)));
}`,
    },
    blanks: ["...", "map"],
    distractors: ["push", "forEach", "splice", "concat"],
    explanation:
      "`[...prev, item]` crée un nouveau tableau ; `push` muterait `prev`. `map` renvoie un nouveau tableau avec l'élément remplacé ; `forEach` renvoie `undefined` et `splice` mute en place. `concat` fonctionnerait pour ajouter, mais pas avec une fonction de transformation. La forme fonctionnelle `prev => ...` garantit qu'on part du dernier état.",
  },
  {
    kind: "output",
    id: "react-hooks-03",
    difficulty: 2,
    tags: ["react", "use-state", "immuabilite", "re-render"],
    prompt: "Après un clic, qu'affiche le bouton ?",
    code: {
      language: "tsx",
      code: `function Todo() {
  const [todos, setTodos] = useState(["a"]);
  function add() {
    todos.push("b");
    setTodos(todos);
  }
  return <button onClick={add}>{todos.length}</button>;
}`,
    },
    choices: [
      "`1` : `setTodos` reçoit la même référence, React ignore la mise à jour.",
      "`2` : le tableau contient bien deux éléments.",
      "Erreur : `todos` est en lecture seule.",
      "`2` au premier clic, puis `1` au suivant.",
    ],
    answer: 0,
    explanation:
      "`push` mute le tableau existant, puis `setTodos(todos)` transmet la **même référence**. React compare avec `Object.is` : identique, donc pas de nouveau rendu commité, le bouton reste à `1`. Le tableau en mémoire contient pourtant `b`, ce qui rendra le prochain rendu incohérent. Correction : `setTodos(prev => [...prev, \"b\"])`.",
  },
  {
    kind: "mcq",
    id: "react-hooks-04",
    difficulty: 2,
    tags: ["react", "use-state", "re-render"],
    prompt: "Pourquoi dit-on que `setState` est « asynchrone » ?",
    choices: [
      "React regroupe les mises à jour d'un même événement et re-rend une seule fois ensuite ; la variable d'état du rendu courant est une photo qui ne change pas.",
      "`setState` envoie une requête au navigateur, qui répond plus tard.",
      "`setState` renvoie une `Promise` qu'il faut attendre avec `await`.",
      "Seul le premier `setState` d'un événement est pris en compte.",
    ],
    answer: 0,
    explanation:
      "Il n'y a ni requête ni `Promise` : `setState` met une mise à jour en file et React re-rend après le gestionnaire (batching, automatique partout depuis React 18). Lire `count` juste après `setCount(5)` donne encore l'ancienne valeur, parce que `count` est la constante du rendu en cours. Tous les appels sont pris en compte, dans l'ordre.",
  },
  {
    kind: "spot",
    id: "react-hooks-05",
    difficulty: 2,
    tags: ["react", "use-state", "immuabilite"],
    prompt: "Le clic n'affiche jamais le nouvel âge. Trouve la ligne responsable.",
    code: {
      language: "tsx",
      code: `function Profile() {
  const [user, setUser] = useState({ name: "Ana", age: 30 });
  function birthday() {
    user.age += 1;
    setUser(user);
  }
  return <p onClick={birthday}>{user.age}</p>;
}`,
    },
    faultyLine: 4,
    reasons: [
      "Mutation de l'état : la référence de `user` ne change pas, React conclut qu'il n'y a rien à re-rendre. Créer un nouvel objet : `setUser({ ...user, age: user.age + 1 })`.",
      "`user` est déclaré `const` : l'affectation ne compile pas.",
      "`setUser` doit obligatoirement recevoir une fonction.",
      "`age` doit être dans un `useState` séparé de `name`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`const` interdit de réaffecter `user`, pas de modifier ses propriétés : `user.age += 1` compile et mute l'objet. Ensuite `setUser(user)` transmet la même référence, et `Object.is` dit « rien n'a changé ». La règle : ne jamais muter l'état, toujours produire une copie avec le changement.",
  },
  {
    kind: "output",
    id: "react-hooks-06",
    difficulty: 2,
    tags: ["react", "use-state", "re-render"],
    prompt: "Hors StrictMode, après un clic, que loggue la console et qu'affiche le bouton ?",
    code: {
      language: "tsx",
      code: `function App() {
  const [n, setN] = useState(0);
  console.log("render", n);
  function go() {
    setN(n + 1);
    setN(n + 2);
  }
  return <button onClick={go}>{n}</button>;
}`,
    },
    choices: [
      "`render 2` une seule fois, le bouton affiche `2`.",
      "`render 1` puis `render 2`, le bouton affiche `2`.",
      "`render 3` une seule fois, le bouton affiche `3`.",
      "`render 2` une seule fois, le bouton affiche `3`.",
    ],
    answer: 0,
    explanation:
      "Les deux appels lisent la photo `n = 0` : ils demandent `1` puis `2`. React regroupe, la dernière valeur gagne, et un seul rendu a lieu : `render 2`. Pour obtenir 3, il faudrait `setN(v => v + 1); setN(v => v + 2)`. En développement avec `<StrictMode>`, chaque rendu est exécuté deux fois et le log apparaîtrait en double.",
  },
  {
    kind: "recall",
    id: "react-hooks-07",
    difficulty: 2,
    tags: ["react", "use-state", "re-render"],
    prompt: "Que signifie « l'état est une photo du rendu » ? Comment faire des mises à jour successives fiables ?",
    explanation:
      "À chaque rendu, React appelle la fonction du composant avec les valeurs d'état **de ce rendu**. Les variables (`count`), les props et les gestionnaires d'événements sont figés dans cette photo : un `setCount(count + 1)` lit toujours la valeur du rendu où il a été créé, même appelé plusieurs fois ou plus tard dans un `setTimeout`. Pour enchaîner des mises à jour, on passe une **fonction** : `setCount(c => c + 1)`. React l'appelle avec l'état le plus récent de la file, pas avec la photo. Même logique pour les closures obsolètes dans un effet : les dépendances servent à reprendre une photo fraîche.",
    keyPoints: ["Chaque rendu fige état, props et handlers", "`set(valeur)` lit la photo", "`set(fn)` reçoit l'état à jour", "Closures obsolètes → dépendances"],
  },
  {
    kind: "match",
    id: "react-hooks-08",
    difficulty: 1,
    tags: ["react", "immuabilite"],
    prompt: "Associe chaque opération à sa version immuable.",
    pairs: [
      { left: "Ajouter à un tableau", right: "`[...arr, item]`" },
      { left: "Retirer d'un tableau", right: "`arr.filter(x => x.id !== id)`" },
      { left: "Modifier un élément", right: "`arr.map(x => x.id === id ? {...x, done: true} : x)`" },
      { left: "Modifier un champ d'objet", right: "`{ ...obj, name: \"Bob\" }`" },
      { left: "Trier", right: "`[...arr].sort(cmp)`" },
    ],
    explanation:
      "Chaque forme produit un nouveau tableau ou objet, ce que `push`, `splice`, `sort` (en place) ou une affectation de propriété ne font pas. `sort` est le piège classique : il trie en place, d'où la copie `[...arr]` avant. Pour des structures profondes, une lib comme Immer évite les spreads imbriqués.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — useEffect
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "react-hooks-l2",
  title: "useEffect : synchroniser avec l'extérieur, pas calculer",
  blocks: [
    {
      kind: "text",
      text: "`useEffect` exécute du code **après** que React a mis le DOM à jour. Il sert à synchroniser le composant avec quelque chose d'extérieur à React : une requête réseau, un abonnement, un timer, une API du navigateur. Il ne sert pas à calculer un état à partir d'un autre : ça, c'est un simple calcul pendant le rendu.",
    },
    {
      kind: "text",
      text: "Le tableau de dépendances décide **quand** l'effet se relance : absent, après chaque rendu ; `[]`, une seule fois au montage ; `[id]`, à chaque changement de `id`. Un effet qui met à jour un état listé dans ses propres dépendances tourne en boucle. La fonction retournée est le **cleanup** : React l'appelle avant de relancer l'effet et au démontage.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Fetch avec protection contre les réponses obsolètes.",
      code: `function User({ id }: { id: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let ignore = false;             // réponse périmée ?
    fetch(\`/api/users/\${id}\`)
      .then(r => r.json())
      .then(data => { if (!ignore) setUser(data); });
    return () => { ignore = true; }; // cleanup
  }, [id]);                          // relance si id change

  // état dérivé : PAS un effet, un calcul
  const initials = user ? user.name[0] : "?";
  return <p>{initials}</p>;
}`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "En développement, `<StrictMode>` monte, démonte puis remonte chaque composant : l'effet tourne deux fois, avec son cleanup entre les deux. Ce n'est pas un bug, c'est un test : si l'effet ne supporte pas d'être rejoué, il manque un cleanup. En production, une seule exécution.",
    },
    {
      kind: "text",
      text: "Sans le drapeau `ignore`, un changement rapide de `id` pourrait afficher la réponse de l'ancien utilisateur arrivée en dernier. Pour le chargement de données en vrai projet, TanStack Query gère cache, états `loading`/`error` et annulation ; `useEffect` + `fetch` reste le mécanisme sous-jacent à comprendre.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "react-hooks-09",
    difficulty: 3,
    tags: ["react", "use-effect", "dependances", "re-render"],
    prompt: "Que se passe-t-il au montage de ce composant ?",
    code: {
      language: "tsx",
      code: `function Clock() {
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    setTicks(ticks + 1);
  });
  return <p>{ticks}</p>;
}`,
    },
    choices: [
      "Boucle infinie : l'effet tourne après chaque rendu et déclenche un nouveau rendu ; React avertit « Maximum update depth exceeded ».",
      "Affiche `1` puis s'arrête : l'effet ne tourne qu'une fois.",
      "Affiche `0` : sans tableau de dépendances, l'effet ne tourne qu'au montage.",
      "Erreur de compilation : dépendance `ticks` manquante.",
    ],
    answer: 0,
    explanation:
      "Sans tableau de dépendances, l'effet s'exécute après **chaque** rendu. Il appelle `setTicks` avec une valeur différente, ce qui provoque un rendu, qui relance l'effet, et ainsi de suite. React détecte les mises à jour imbriquées et loggue un avertissement, mais le composant continue de tourner. L'absence de dépendance n'est pas une erreur de compilation, seulement un avertissement du linter.",
  },
  {
    kind: "spot",
    id: "react-hooks-10",
    difficulty: 2,
    tags: ["react", "use-effect", "dependances"],
    prompt: "Quand la prop `id` change, l'écran garde l'ancien utilisateur. Trouve la ligne responsable.",
    code: {
      language: "tsx",
      code: `function User({ id }: { id: number }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch(\`/api/users/\${id}\`)
      .then(r => r.json())
      .then(setUser);
  }, []);
  return <p>{user?.name}</p>;
}`,
    },
    faultyLine: 7,
    reasons: [
      "Le tableau vide fige l'effet au montage : un nouvel `id` ne relance pas le fetch. Il faut `[id]`.",
      "`fetch` n'a pas sa place dans un `useEffect`.",
      "`setUser` ne peut pas être passé directement à `then`.",
      "Il manque `await` devant `fetch`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`[]` signifie « rien ne justifie de relancer cet effet » : React l'exécute une fois. La closure de l'effet capture le premier `id` et ne le revoit jamais. Avec `[id]`, l'effet se relance à chaque changement, précédé du cleanup. Le linter `react-hooks/exhaustive-deps` signale précisément cette omission. Passer `setUser` à `then` est correct.",
  },
  {
    kind: "mcq",
    id: "react-hooks-11",
    difficulty: 2,
    tags: ["react", "use-effect", "strict-mode"],
    prompt: "En développement, sous `<StrictMode>`, `useEffect(() => console.log(\"mount\"), [])` loggue `mount` deux fois. Pourquoi ?",
    choices: [
      "React monte, démonte (cleanup) puis remonte le composant pour vérifier que l'effet est résilient ; en production, une seule exécution.",
      "Le composant est rendu deux fois parce qu'il a deux parents.",
      "C'est un bug de React 18, corrigé en React 19.",
      "Le tableau vide est ignoré en développement.",
    ],
    answer: 0,
    explanation:
      "C'est délibéré : StrictMode simule un démontage/remontage pour révéler les effets sans cleanup (abonnement dupliqué, timer non annulé). Le comportement existe en React 18 et 19, uniquement en développement. Un effet correct, avec son cleanup, se comporte de la même façon exécuté une ou deux fois.",
  },
  {
    kind: "fill",
    id: "react-hooks-12",
    difficulty: 2,
    tags: ["react", "use-effect", "dependances"],
    prompt: "Complète pour ignorer une réponse obsolète et relancer quand `id` change.",
    code: {
      language: "tsx",
      code: `useEffect(() => {
  let ignore = false;
  fetchUser(id).then(u => {
    if (!{{1}}) setUser(u);
  });
  return () => { {{2}} = true; };
}, [{{3}}]);`,
    },
    blanks: ["ignore", "ignore", "id"],
    distractors: ["user", "setUser", "cancelled"],
    explanation:
      "Le drapeau `ignore` appartient à la closure de **cet** appel de l'effet. Quand `id` change, React exécute le cleanup, qui passe `ignore` à `true` : la réponse de l'ancien appel, même arrivée plus tard, est ignorée. La dépendance est `id` : `[user]` créerait une boucle (l'effet met à jour `user`), et `[setUser]` ne se relancerait jamais.",
  },
  {
    kind: "output",
    id: "react-hooks-13",
    difficulty: 2,
    tags: ["react", "use-effect", "dependances"],
    prompt: "Hors StrictMode : que loggue la console au montage, puis après un clic ?",
    code: {
      language: "tsx",
      code: `function Demo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  useEffect(() => { console.log("a", a); }, [a]);
  useEffect(() => { console.log("b", b); }, [b]);
  return <button onClick={() => setB(b + 1)}>go</button>;
}`,
    },
    choices: [
      "`a 0`, `b 0` au montage ; puis seulement `b 1` au clic.",
      "`a 0`, `b 0` au montage ; puis `a 0` et `b 1` au clic.",
      "`b 1` seulement.",
      "`a 0`, `b 0` au montage ; rien au clic, les effets ne tournent qu'une fois.",
    ],
    answer: 0,
    explanation:
      "Au montage, tous les effets s'exécutent. Au clic, le composant re-rend avec `b = 1` ; React compare les dépendances de chaque effet : `[a]` n'a pas changé, l'effet est sauté ; `[b]` a changé, l'effet tourne. Un tableau de dépendances non vide n'est pas « une fois » : c'est « quand ça change ».",
  },
  {
    kind: "mcq",
    id: "react-hooks-14",
    difficulty: 2,
    tags: ["react", "use-effect", "etat-derive"],
    prompt: "`const [total, setTotal] = useState(0); useEffect(() => { setTotal(sum(items)); }, [items]);` Quel est le problème ?",
    choices: [
      "Un rendu de trop avec un `total` obsolète : un état dérivé se calcule pendant le rendu, `const total = sum(items)`, avec `useMemo` si c'est coûteux.",
      "Boucle infinie : l'effet met à jour un état.",
      "`total` devrait être un `useRef`.",
      "Aucun : c'est la manière recommandée de dériver un état.",
    ],
    answer: 0,
    explanation:
      "Séquence réelle : `items` change → rendu avec l'ancien `total` → effet → `setTotal` → second rendu. L'écran a brièvement montré une incohérence, et on a doublé le travail. Pas de boucle : `total` n'est pas dans les dépendances. Un état dérivé n'est pas un état : c'est un calcul. `useEffect` est réservé à la synchronisation avec l'extérieur.",
  },
  {
    kind: "recall",
    id: "react-hooks-15",
    difficulty: 2,
    tags: ["react", "use-effect", "cleanup"],
    prompt: "Que fait la fonction retournée par `useEffect`, et à quels moments React l'appelle-t-il ?",
    explanation:
      "C'est le **cleanup** : elle défait ce que l'effet a mis en place. React l'appelle **avant chaque nouvelle exécution** de l'effet (quand une dépendance a changé) et **au démontage** du composant. Usages : `clearInterval`/`clearTimeout`, `removeEventListener`, désabonnement d'un WebSocket, `AbortController.abort()` ou drapeau `ignore` pour un fetch. Sans cleanup, on accumule des abonnements et on applique des réponses obsolètes. StrictMode (dev) exécute la séquence effet → cleanup → effet au montage pour révéler ces oublis.",
    keyPoints: ["Avant chaque ré-exécution et au démontage", "Timers, listeners, abonnements, fetch", "StrictMode : effet → cleanup → effet"],
  },
  {
    kind: "order",
    id: "react-hooks-16",
    difficulty: 2,
    tags: ["react", "use-effect", "cleanup", "re-render"],
    prompt: "Un composant a `useEffect(..., [id])`. La prop `id` change. Remets dans l'ordre ce que fait React.",
    items: [
      "Nouveau rendu du composant avec le nouvel `id`",
      "Commit : mise à jour du DOM",
      "Cleanup de l'effet précédent (capturant l'ancien `id`)",
      "Exécution de l'effet avec le nouvel `id`",
    ],
    explanation:
      "Le rendu produit le nouveau JSX, React le commite dans le DOM, puis seulement s'occupe des effets : d'abord le cleanup de la version précédente, puis la nouvelle exécution. Le cleanup voit donc les valeurs de l'ancien rendu, ce qui permet de désabonner exactement ce qui avait été abonné.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Re-renders
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "react-hooks-l3",
  title: "Ce qui re-rend, et ce qui ne re-rend pas",
  blocks: [
    {
      kind: "text",
      text: "Un composant re-rend dans trois cas : son **état** change (via `setState`, avec une valeur différente au sens de `Object.is`), son **parent** re-rend, ou un **contexte** qu'il consomme change. Rien d'autre. Modifier `ref.current`, muter un objet, changer une variable de module : React n'en sait rien.",
    },
    {
      kind: "text",
      text: "Le cas « parent qui re-rend » surprend : par défaut, **tous** les enfants re-rendent avec lui, que leurs props aient changé ou non. Un re-render n'est pas une mise à jour du DOM : React compare le nouveau JSX à l'ancien et ne touche que ce qui diffère. C'est généralement peu coûteux ; on n'optimise que si on mesure un problème.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "memo ne sert que si les props gardent leur identité.",
      code: `const Row = React.memo(function Row({ item, onSelect }) {
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  );
});

function List({ items }) {
  const [selected, setSelected] = useState(null);
  // identité stable : Row ne re-rend pas
  // quand selected change
  const onSelect = useCallback(id => setSelected(id), []);
  // calcul mémorisé : refait seulement si items change
  const sorted = useMemo(
    () => [...items].sort(byName), [items]);
  return (
    <ul>
      {sorted.map(it => (
        <Row key={it.id} item={it} onSelect={onSelect} />
      ))}
    </ul>
  );
}`,
    },
    {
      kind: "text",
      text: "`React.memo` saute le rendu d'un enfant si ses props sont identiques (comparaison superficielle). Une fonction fléchée créée dans le rendu du parent est une **nouvelle référence** à chaque fois : elle annule `memo`. `useCallback` fige l'identité d'une fonction, `useMemo` celle d'une valeur calculée. Sans `memo` en face, ni dépendance d'effet, ils ne servent à rien.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "`useRef` stocke une valeur qui survit aux rendus sans en déclencher : un timer, un compteur d'appels, un nœud DOM. `useContext` re-rend **tous** les consommateurs quand la valeur du Provider change : bon pour un thème ou un utilisateur, mauvais pour un état qui change dix fois par seconde.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "react-hooks-17",
    difficulty: 2,
    tags: ["react", "re-render", "use-callback", "memo"],
    prompt: "Après un clic sur le bouton de `Child`, que loggue la console ?",
    code: {
      language: "tsx",
      code: `const Child = React.memo(function Child({ onClick }) {
  console.log("child render");
  return <button onClick={onClick}>+</button>;
});

function Parent() {
  const [n, setN] = useState(0);
  return (
    <>
      <p>{n}</p>
      <Child onClick={() => setN(n + 1)} />
    </>
  );
}`,
    },
    choices: [
      "`child render` : la fonction fléchée est une nouvelle référence à chaque rendu de `Parent`, `memo` ne peut rien sauter.",
      "Rien : `React.memo` empêche `Child` de re-rendre.",
      "`child render` une seule fois au montage, jamais après.",
      "Erreur : `onClick` doit obligatoirement être un `useCallback`.",
    ],
    answer: 0,
    explanation:
      "`memo` compare les props une à une avec `Object.is`. `() => setN(n + 1)` est recréée à chaque rendu de `Parent` : la prop `onClick` est « différente », `Child` re-rend. Pour que `memo` serve : `const onClick = useCallback(() => setN(v => v + 1), [])`, avec la forme fonctionnelle pour ne pas dépendre de `n`.",
  },
  {
    kind: "mcq",
    id: "react-hooks-18",
    difficulty: 2,
    tags: ["react", "use-ref", "re-render"],
    prompt: "Quelle affirmation sur `useRef` est vraie ?",
    choices: [
      "Modifier `ref.current` ne déclenche aucun rendu ; la valeur persiste d'un rendu à l'autre.",
      "Modifier `ref.current` déclenche un rendu, comme `setState`.",
      "`useRef` se réinitialise à chaque rendu.",
      "`useRef` ne sert qu'à accéder à un nœud DOM.",
    ],
    answer: 0,
    explanation:
      "Une ref est une boîte mutable que React conserve entre les rendus sans la surveiller. On y range ce qui ne doit pas provoquer de rendu : un id de timer, la valeur précédente d'une prop, un nœud DOM via l'attribut `ref`. Si l'écran doit refléter la valeur, c'est un `useState`, pas une ref.",
  },
  {
    kind: "spot",
    id: "react-hooks-19",
    difficulty: 2,
    tags: ["react", "cles-de-liste", "re-render"],
    prompt: "Quand on supprime le premier todo, le texte saisi dans les champs se décale. Trouve la ligne responsable.",
    code: {
      language: "tsx",
      code: `function List({ todos, remove }) {
  return (
    <ul>
      {todos.map((t, i) => (
        <li key={i}>
          <input defaultValue={t.text} />
          <button onClick={() => remove(t.id)}>x</button>
        </li>
      ))}
    </ul>
  );
}`,
    },
    faultyLine: 5,
    reasons: [
      "L'index comme `key` : après suppression, chaque `<li>` garde son index, React réutilise les nœuds existants et l'`<input>` non contrôlé conserve la saisie du voisin. Utiliser `t.id`.",
      "`key` doit être une chaîne, pas un nombre.",
      "`key` doit être placée sur l'`<input>`, pas sur le `<li>`.",
      "`map` n'accepte pas de deuxième paramètre.",
    ],
    reasonAnswer: 0,
    explanation:
      "La `key` dit à React quel élément est quel élément. Avec l'index, supprimer le premier todo fait que l'ancien deuxième prend la `key` 0 : React croit que c'est le même `<li>`, met à jour `defaultValue` (ignoré après le premier rendu) et garde la saisie de l'ancien premier. Un id stable règle le problème ; un nombre comme `key` est tout à fait accepté.",
  },
  {
    kind: "output",
    id: "react-hooks-20",
    difficulty: 2,
    tags: ["react", "use-context", "re-render"],
    prompt: "Après un clic sur le bouton, que loggue la console ?",
    code: {
      language: "tsx",
      code: `const Theme = createContext("light");

function Label() {
  console.log("label");
  return <span>ok</span>;
}
function Title() {
  const theme = useContext(Theme);
  console.log("title", theme);
  return <h1 className={theme}>Hi</h1>;
}
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <Theme.Provider value={theme}>
      <button onClick={() => setTheme("dark")}>go</button>
      <Title />
      <Label />
    </Theme.Provider>
  );
}`,
    },
    choices: [
      "`title dark` et `label` : `App` re-rend, donc tous ses enfants re-rendent, consommateurs du contexte ou non.",
      "`title dark` seulement : seuls les consommateurs du contexte re-rendent.",
      "`label` seulement.",
      "Rien : le `Provider` bloque les rendus de ses enfants.",
    ],
    answer: 0,
    explanation:
      "Le contexte n'est pas la cause ici : `setTheme` re-rend `App`, et `<Title />` comme `<Label />` sont créés dans le JSX d'`App`, donc ils re-rendent avec lui. Pour ne re-rendre que les consommateurs, il faut sortir le `Provider` dans un composant qui reçoit `children` en prop : les `children` gardent leur identité et sont sautés.",
  },
  {
    kind: "mcq",
    id: "react-hooks-21",
    difficulty: 2,
    tags: ["react", "use-memo", "use-callback"],
    prompt: "Quand `useMemo` est-il réellement utile ?",
    choices: [
      "Quand le calcul est coûteux, ou quand la valeur doit garder la même identité : prop d'un composant `memo`, dépendance d'un `useEffect`.",
      "Toujours : il accélère n'importe quel composant.",
      "Pour remplacer `useState` quand la valeur ne change pas souvent.",
      "Pour conserver le résultat d'un `fetch` entre deux montages du composant.",
    ],
    answer: 0,
    explanation:
      "`useMemo` a un coût (comparaison des dépendances, mémoire) : appliqué partout, il ralentit. Il paie dans deux cas : un calcul lourd (tri de milliers de lignes), ou une identité stable requise par `memo` ou par un tableau de dépendances (un objet recréé à chaque rendu relancerait l'effet). Il ne survit pas au démontage : ce n'est pas un cache.",
  },
  {
    kind: "recall",
    id: "react-hooks-22",
    difficulty: 2,
    tags: ["react", "re-render"],
    prompt: "Cite les trois causes de re-render d'un composant, et deux choses qui n'en déclenchent pas.",
    explanation:
      "Trois causes : **son état change** (`setState` avec une valeur différente selon `Object.is`), **son parent re-rend** (tous les enfants suivent, sauf `memo` avec props identiques), **un contexte consommé change**. Ne déclenchent rien : modifier `ref.current`, **muter** un objet ou tableau d'état sans nouvelle référence, changer une variable hors composant, ou appeler `setState` avec la même valeur. Re-render ne veut pas dire mise à jour du DOM : React ne touche que ce qui diffère.",
    keyPoints: ["État (valeur différente), parent, contexte", "Ref, mutation, même valeur : rien", "Re-render ≠ écriture DOM"],
  },
  {
    kind: "match",
    id: "react-hooks-23",
    difficulty: 1,
    tags: ["react", "hooks"],
    prompt: "Associe chaque hook à son usage.",
    pairs: [
      { left: "`useState`", right: "Valeur dont le changement doit re-rendre" },
      { left: "`useRef`", right: "Valeur persistante sans rendu, ou nœud DOM" },
      { left: "`useMemo`", right: "Mémoriser un calcul entre deux rendus" },
      { left: "`useCallback`", right: "Mémoriser l'identité d'une fonction" },
      { left: "`useContext`", right: "Lire une valeur fournie par un ancêtre" },
    ],
    explanation:
      "`useCallback(fn, deps)` est exactement `useMemo(() => fn, deps)`. La question à se poser pour chaque valeur : l'écran doit-il changer quand elle change ? Oui → `useState`. Non → `useRef`. Un calcul dérivé → une constante dans le rendu, `useMemo` seulement s'il coûte.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Règles, hooks custom, formulaires et gestion d'état
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "react-hooks-l4",
  title: "Règles des hooks, hooks custom et où mettre l'état",
  blocks: [
    {
      kind: "text",
      text: "React identifie les hooks par leur **ordre d'appel**. D'où les deux règles : uniquement au niveau racine d'un composant ou d'un hook custom, jamais dans une condition, une boucle ou après un `return` anticipé. Un hook custom est une fonction dont le nom commence par `use` et qui appelle d'autres hooks : il extrait de la logique réutilisable, pas de l'interface.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Un hook custom, un champ contrôlé, du data fetching.",
      code: `function useDebounce<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);   // annulé si value change
  }, [value, ms]);
  return debounced;
}

function Search() {
  const [q, setQ] = useState("");     // champ contrôlé
  const query = useDebounce(q, 300);
  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => api.search(query),
  });
  return (
    <>
      <input value={q}
             onChange={e => setQ(e.target.value)} />
      {isLoading ? "…" : data?.length}
    </>
  );
}`,
    },
    {
      kind: "text",
      text: "Un champ **contrôlé** a sa valeur dans l'état React (`value` + `onChange`) : validation à la frappe, formatage, mais un rendu par touche. Un champ **non contrôlé** garde sa valeur dans le DOM (`defaultValue`, lu via une ref à la soumission) : plus simple pour un formulaire lu une fois. Quand deux composants frères ont besoin du même état, on le **remonte** dans leur parent commun (lifting state up).",
    },
    {
      kind: "text",
      text: "Pour l'état global, distinguer : l'**état serveur** (données d'API) revient à TanStack Query, qui gère cache, `isLoading`, `error` et rafraîchissement. L'**état client** partagé va dans un Context s'il change rarement (thème, utilisateur), dans Zustand pour un store léger, dans Redux Toolkit pour une grande application qui veut devtools et middlewares. `useReducer` structure un état local complexe avec des actions.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "react-hooks-24",
    difficulty: 2,
    tags: ["react", "regles-des-hooks"],
    prompt: "Ce composant plante quand `editable` passe de `false` à `true`. Trouve la ligne responsable.",
    code: {
      language: "tsx",
      code: `function Field({ editable }: { editable: boolean }) {
  if (!editable) {
    return <span>lecture seule</span>;
  }
  const [value, setValue] = useState("");
  return (
    <input value={value}
           onChange={e => setValue(e.target.value)} />
  );
}`,
    },
    faultyLine: 5,
    reasons: [
      "Hook appelé après un `return` conditionnel : le nombre de hooks change entre deux rendus, React perd la correspondance. Les hooks vont au niveau racine, toujours dans le même ordre.",
      "`useState` doit être appelé avant de lire les props.",
      "`value` doit être initialisé à `null`, pas à une chaîne vide.",
      "Un composant ne peut pas retourner tantôt un `<span>`, tantôt un `<input>`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Au premier rendu (`editable = false`), aucun hook n'est appelé ; au suivant, un `useState` apparaît : React lève « Rendered more hooks than during the previous render ». Déplacer `useState` avant le `if`. Le linter `react-hooks/rules-of-hooks` refuse ce code. Retourner des éléments différents selon une condition est parfaitement permis.",
  },
  {
    kind: "fill",
    id: "react-hooks-25",
    difficulty: 2,
    tags: ["react", "hooks-custom", "use-effect"],
    prompt: "Nomme ce hook selon la convention et complète ses dépendances.",
    code: {
      language: "tsx",
      code: `function {{1}}(key: string) {
  const [value, setValue] = useState(
    () => localStorage.getItem(key) ?? "");
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [{{2}}, value]);
  return [value, setValue] as const;
}`,
    },
    blanks: ["useStorage", "key"],
    distractors: ["getStorage", "storage", "setValue", "localStorage"],
    explanation:
      "Un hook custom doit commencer par `use` : c'est ce qui permet au linter d'appliquer les règles des hooks à son corps et à ses appelants. `getStorage` s'exécuterait, mais casserait cette garantie. L'effet dépend de `key` et `value` : si la clé change, on écrit au bon endroit. L'initialisateur paresseux `() => ...` évite de lire `localStorage` à chaque rendu.",
  },
  {
    kind: "output",
    id: "react-hooks-26",
    difficulty: 2,
    tags: ["react", "formulaires"],
    prompt: "Que se passe-t-il quand l'utilisatrice tape dans ce champ ?",
    code: {
      language: "tsx",
      code: `function Form() {
  const [name, setName] = useState("Ana");
  return <input value={name} />;
}`,
    },
    choices: [
      "Le champ affiche `Ana` mais reste figé : sans `onChange`, React réimpose `value` ; la console avertit qu'il manque un `onChange`.",
      "Le champ se modifie normalement, mais `name` ne suit pas.",
      "Erreur de compilation : `value` sans `onChange` est interdit.",
      "Le champ est vide, `value` ne s'applique qu'avec `onChange`.",
    ],
    answer: 0,
    explanation:
      "`value` rend le champ contrôlé : React force le DOM à afficher l'état, et l'état ne change jamais faute de `onChange`. L'utilisatrice tape, React réécrit `Ana`. Le message : « You provided a `value` prop to a form field without an `onChange` handler ». Soit `onChange={e => setName(e.target.value)}`, soit `defaultValue` pour un champ non contrôlé.",
  },
  {
    kind: "mcq",
    id: "react-hooks-27",
    difficulty: 2,
    tags: ["react", "formulaires", "use-ref"],
    prompt: "Quand préférer un champ non contrôlé (`defaultValue` + ref) à un champ contrôlé ?",
    choices: [
      "Formulaire simple lu seulement à la soumission, ou intégration d'une bibliothèque non-React : pas de rendu à chaque frappe.",
      "Toujours : c'est plus performant, donc à privilégier.",
      "Jamais : `defaultValue` est déconseillé par React.",
      "Quand on veut valider ou formater la saisie à chaque frappe.",
    ],
    answer: 0,
    explanation:
      "Le contrôlé donne le pouvoir (validation immédiate, masque de saisie, désactivation du bouton) au prix d'un rendu par touche, négligeable la plupart du temps. Le non contrôlé convient quand on lit la valeur une fois, via `ref.current.value` ou `FormData`, et quand une lib externe gère le DOM. Les deux sont légitimes ; les bibliothèques de formulaires mélangent souvent les deux.",
  },
  {
    kind: "recall",
    id: "react-hooks-28",
    difficulty: 2,
    tags: ["react", "lifting-state-up", "use-context"],
    prompt: "Explique le « lifting state up ». Quand un Context devient-il préférable à des props ?",
    explanation:
      "Quand deux composants doivent partager ou synchroniser une donnée, on **remonte l'état** dans leur plus proche ancêtre commun, qui le passe en props (valeur + callback de mise à jour). L'état a une seule source de vérité. Quand l'ancêtre est loin, on se retrouve à faire transiter des props par des composants qui ne les utilisent pas (**prop drilling**). Un **Context** court-circuite : le Provider fournit, `useContext` lit à n'importe quelle profondeur. Il convient aux valeurs stables et globales (thème, utilisateur connecté, locale). Pour un état qui change souvent, tous les consommateurs re-rendent : préférer un store (Zustand) ou garder l'état local.",
    keyPoints: ["État dans l'ancêtre commun, une source de vérité", "Prop drilling → Context", "Context = valeurs stables et globales", "Change souvent → store ou état local"],
  },
  {
    kind: "order",
    id: "react-hooks-29",
    difficulty: 2,
    tags: ["react", "use-reducer", "re-render"],
    prompt: "Remets dans l'ordre ce qui se passe après `dispatch({ type: \"add\", item })` avec `useReducer`.",
    items: [
      "React appelle `reducer(étatCourant, action)`",
      "Le reducer retourne un nouvel état, sans muter l'ancien",
      "React compare le nouvel état à l'ancien avec `Object.is`",
      "S'il diffère, le composant re-rend avec le nouvel état",
    ],
    explanation:
      "`dispatch` ne modifie rien lui-même : il confie l'action au reducer, une fonction pure `(state, action) => state`. Comme pour `useState`, retourner le même objet (muté) fait conclure à React que rien n'a changé. `useReducer` centralise les transitions d'un état complexe et rend le composant lisible : les vues dispatchent des intentions, le reducer décide.",
  },
  {
    kind: "recall",
    id: "react-hooks-30",
    difficulty: 3,
    tags: ["react", "gestion-etat", "data-fetching"],
    prompt: "Context, Zustand, Redux Toolkit, TanStack Query : quel outil pour quel type d'état ?",
    explanation:
      "Première question : **état serveur ou état client** ? Les données qui viennent d'une API (liste de commandes, profil) sont de l'état **serveur** : cache, chargement, erreurs, rafraîchissement, invalidation. C'est le métier de **TanStack Query**, pas d'un store. L'état **client** (thème, panier, filtres d'UI) : **Context** s'il change rarement et que tous les consommateurs peuvent re-rendre ; **Zustand** pour un store global léger, sélecteurs fins, peu de boilerplate ; **Redux Toolkit** quand l'équipe veut une structure imposée, des devtools time-travel et des middlewares, sur une grande application. Beaucoup de projets tiennent avec TanStack Query + un peu de Context.",
    keyPoints: ["Serveur → TanStack Query", "Client rare → Context", "Client global léger → Zustand", "Grande app, devtools → Redux Toolkit"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "react-hooks",
  title: "React : hooks, état, re-renders",
  objective:
    "Raisonner en rendus : état-photo, immuabilité, useEffect et ses dépendances, ce qui déclenche un re-render, et où placer l'état.",
  prerequisites: [],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
