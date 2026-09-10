/**
 * React — JavaScript moderne et TypeScript (référentiel 6.1).
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Portée, const et let
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "react-jsts-l1",
  title: "Portée, const et let",
  blocks: [
    {
      kind: "text",
      text: "`var` a une particularité qui n'existe presque nulle part ailleurs : sa portée est la **fonction**, pas le bloc. Une variable déclarée dans un `if` ou dans une boucle existe partout dans la fonction, avant même la ligne qui la déclare. Ce comportement a produit une génération entière de bugs, et c'est la raison d'être de `let` et `const`.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Le piège le plus célèbre du langage.",
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Affiche : 3, 3, 3
// Il n'existe QU'UNE variable i, partagée par les trois
// fermetures. Quand les callbacks s'exécutent, la boucle
// est finie et i vaut 3.

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
// Affiche : 0, 1, 2
// let crée une NOUVELLE liaison à chaque tour : chaque
// fermeture capture la sienne.`,
    },
    {
      kind: "text",
      text: "C'est ce comportement de `let` dans les boucles qui explique pourquoi le problème a presque disparu du code moderne. La liaison par tour n'est pas une subtilité théorique : c'est exactement ce dont on a besoin dès qu'une fermeture est créée dans une boucle, ce qui arrive constamment avec des gestionnaires d'événements ou des appels asynchrones.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "La zone morte temporelle, et ce que const garantit vraiment.",
      code: `console.log(a);   // undefined — var est « hissée »
var a = 1;

console.log(b);   // ReferenceError : b n'est pas encore
let b = 1;        // initialisée (zone morte temporelle)

// const empêche la RÉAFFECTATION, pas la mutation :
const config = { debug: false };
config.debug = true;        // autorisé
config = {};                // TypeError

const liste = [1, 2];
liste.push(3);              // autorisé
// Pour figer réellement : Object.freeze(config)
// (superficiel : ne gèle qu'un niveau)`,
    },
    {
      kind: "text",
      text: "La *zone morte temporelle* est la période entre le début du bloc et la ligne de déclaration : la variable existe pour le moteur mais y accéder lève une erreur. C'est un progrès par rapport à `var`, qui renvoyait `undefined` et laissait le bug se propager silencieusement — ici l'erreur pointe exactement l'endroit fautif.",
    },
    {
      kind: "comparison",
      title: "Une confusion permanente",
      left: {
        label: "const = liaison constante",
        text: "Le **nom** ne peut plus désigner autre chose. C'est tout. Le contenu de l'objet ou du tableau reste parfaitement modifiable, et c'est le comportement voulu dans l'immense majorité des cas.",
      },
      right: {
        label: "Immuabilité = contenu figé",
        text: "Une propriété de la valeur, pas de la déclaration. Elle s'obtient par `Object.freeze`, par des structures immuables, ou par convention — en ne modifiant jamais en place et en produisant des copies.",
      },
    },
    {
      kind: "text",
      text: "La règle d'usage qui s'est imposée est simple : `const` par défaut, `let` seulement quand la réaffectation est nécessaire, `var` jamais. Cette discipline a un bénéfice concret de lecture — voir `const` en début de ligne indique immédiatement que le nom ne changera pas de sens dans la suite du bloc, ce qui est une information utile à chaque relecture.",
    },
    {
      kind: "text",
      text: "En React, cette discipline devient une contrainte de correction et non plus de style. L'état ne doit jamais être modifié en place : `liste.push(x)` ne change pas la référence du tableau, donc React ne détecte aucun changement et l'écran ne bouge pas. Il faut produire une nouvelle valeur — `setListe([...liste, x])` — et c'est le même raisonnement qui vaut pour les objets d'état.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Object.freeze ne gèle qu'un niveau",
      text: "`Object.freeze(config)` empêche de modifier les propriétés directes de `config`, mais pas celles d'un objet imbriqué : `config.serveur.port = 9000` passe sans erreur. Pour figer réellement une structure, il faut parcourir récursivement. En mode non strict, une écriture sur un objet gelé échoue de surcroît **en silence**, ce qui est pire que l'erreur.",
    },
    {
      kind: "text",
      text: "Une conséquence directe de la liaison par tour concerne les tableaux de dépendances des hooks. Une valeur capturée par une fermeture est celle du rendu où la fermeture a été créée, pas la valeur courante — c'est ce qu'on appelle une fermeture périmée. Un effet qui lit une variable sans la déclarer en dépendance continuera de voir l'ancienne, exactement comme le `var` de la boucle voyait la valeur finale.",
    },
    {
      kind: "text",
      text: "Un dernier point pratique : le hissage des **fonctions** n'a pas disparu. Une déclaration `function f() {}` reste utilisable avant sa ligne, contrairement à une expression assignée à un `const`. Cette différence explique pourquoi certains fichiers déclarent leurs fonctions utilitaires en bas et les utilisent en haut — un style qui cesse de fonctionner dès qu'on passe aux fonctions fléchées.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "react-jsts-01",
    difficulty: 2,
    tags: ["javascript", "portee"],
    prompt: "Qu'affiche ce code, dans l'ordre ?",
    code: {
      language: "typescript",
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var", i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let", j), 0);
}`,
    },
    choices: [
      "var 3, var 3, var 3, puis let 0, let 1, let 2",
      "var 0, var 1, var 2, puis let 0, let 1, let 2",
      "var 3, var 3, var 3, puis let 3, let 3, let 3",
      "var 2, var 2, var 2, puis let 0, let 1, let 2",
    ],
    answer: 0,
    explanation:
      "`var` a une portée de fonction : il n'existe qu'un seul `i`, partagé par les trois fermetures. Quand les callbacks s'exécutent, la boucle est terminée et `i` vaut 3. `let` crée une nouvelle liaison à chaque tour, si bien que chaque fermeture capture la sienne. Les six appels différés partent avec le même délai et s'exécutent dans leur ordre de mise en file.",
  },
  {
    kind: "mcq",
    id: "react-jsts-02",
    difficulty: 1,
    tags: ["javascript", "portee"],
    prompt: "`const config = { debug: false };` puis `config.debug = true;`. Que se passe-t-il ?",
    choices: [
      "Rien d'anormal : `const` empêche la réaffectation du nom, pas la mutation de l'objet.",
      "Une `TypeError` : un objet déclaré `const` est immuable.",
      "L'affectation est ignorée silencieusement.",
      "Une erreur de compilation TypeScript, mais le code s'exécute correctement.",
    ],
    answer: 0,
    explanation:
      "`const` porte sur la liaison : le nom ne pourra plus désigner autre chose. Le contenu de l'objet reste modifiable, et c'est le comportement voulu dans la plupart des cas. Figer réellement une valeur demande `Object.freeze` — qui ne gèle d'ailleurs qu'un seul niveau de profondeur.",
  },
  {
    kind: "recall",
    id: "react-jsts-03",
    difficulty: 2,
    tags: ["javascript", "portee", "react"],
    prompt: "Pourquoi ne jamais modifier un état React en place, et quel est le lien avec `const` ?",
    explanation:
      "Parce que React détecte les changements par comparaison de **références**, pas de contenu. `liste.push(x)` ajoute bien un élément mais laisse la référence du tableau inchangée : React conclut que rien n'a bougé et ne re-rend pas, si bien que la donnée est modifiée sans que l'écran ne le montre. Il faut produire une nouvelle valeur — `setListe([...liste, x])` pour un tableau, `setObjet({ ...objet, champ: v })` pour un objet. Le lien avec `const` est qu'il illustre exactement la même distinction : `const` fige la liaison, pas le contenu, et c'est précisément la mutation du contenu que React ne voit pas. Comprendre que `const` n'apporte aucune immuabilité évite de croire, à tort, que déclarer l'état ainsi suffirait à s'en protéger.",
    keyPoints: [
      "React compare des références, pas des contenus",
      "push mute sans changer la référence : aucun re-rendu",
      "Produire une nouvelle valeur : [...liste, x] ou { ...objet }",
      "const fige la liaison, pas le contenu : même distinction",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Déstructuration, diffusion et reste
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "react-jsts-l2",
  title: "Déstructuration, diffusion et reste",
  blocks: [
    {
      kind: "text",
      text: "Trois syntaxes introduites par ES6 se retrouvent dans presque toutes les lignes d'un composant React moderne. Elles ne sont pas décoratives : la déstructuration rend explicite ce qu'on utilise, et la diffusion est le mécanisme de base pour produire une copie modifiée — donc pour respecter l'immuabilité qu'exige React.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Déstructurer : nommer ce dont on a besoin.",
      code: `// Objets, avec renommage et valeur par défaut
const { nom, age = 0, adresse: { ville } = {} } = client;

// Tableaux, par position — d'où le motif des hooks
const [valeur, setValeur] = useState(0);

// Directement dans la signature : le composant déclare
// ses dépendances, lisibles sans lire le corps.
function Carte({ titre, sousTitre = "", onClick }) {
  return <button onClick={onClick}>{titre} {sousTitre}</button>;
}`,
    },
    {
      kind: "text",
      text: "Déstructurer dans la signature d'un composant a un effet documentaire immédiat : la liste des props utilisées est visible sans lire le corps. C'est aussi ce qui explique la forme des hooks — `useState` renvoie un tableau plutôt qu'un objet précisément pour que l'appelant nomme librement les deux valeurs, ce qu'une déstructuration par position permet.",
    },
    {
      kind: "code",
      language: "tsx",
      caption: "Diffusion et reste : produire une copie, isoler le surplus.",
      code: `// Copie modifiée : la base d'une mise à jour d'état
const majore = { ...client, age: client.age + 1 };
const avec = [...liste, nouvel];
const sans = liste.filter(x => x.id !== id);

// Reste : « tout le reste des props »
function Champ({ label, erreur, ...attributsInput }) {
  return (
    <label>
      {label}
      <input {...attributsInput} />   {/* diffusion en JSX */}
      {erreur && <span>{erreur}</span>}
    </label>
  );
}
// <Champ label="Nom" type="text" maxLength={40} />
// type et maxLength atterrissent sur l'input.`,
    },
    {
      kind: "text",
      text: "Le motif « extraire ce qui m'intéresse, transmettre le reste » est l'une des constructions les plus utiles de React : il permet d'écrire un composant enveloppant sans avoir à énumérer tous les attributs qu'il pourrait recevoir. Le composant reste ouvert à des usages non prévus sans que son interface s'allonge.",
    },
    {
      kind: "comparison",
      title: "Une distinction qui coûte cher",
      left: {
        label: "Copie superficielle",
        text: "`{ ...objet }` copie un niveau. Les objets imbriqués restent **partagés** avec l'original : modifier `copie.adresse.ville` modifie aussi `original.adresse.ville`. C'est la cause la plus fréquente de mutations accidentelles d'état.",
      },
      right: {
        label: "Copie en profondeur",
        text: "`structuredClone(objet)` duplique récursivement. Coûteux, et inutile dans la plupart des cas : il suffit de diffuser à chaque niveau que l'on modifie — `{ ...o, a: { ...o.a, ville } }` — et de partager le reste.",
      },
    },
    {
      kind: "text",
      text: "Cette distinction explique un bug très courant en React : on croit avoir copié l'état, on modifie un champ imbriqué, et l'ancien état s'en trouve modifié lui aussi. Comme les deux références sont identiques, React ne re-rend pas — ou re-rend en affichant les mêmes valeurs qu'avant. Diffuser à chaque niveau touché résout le problème et reste lisible tant que la structure ne dépasse pas deux ou trois niveaux.",
    },
    {
      kind: "text",
      text: "Un détail utile sur les valeurs par défaut : elles ne s'appliquent que si la valeur est `undefined`, jamais si elle vaut `null`. `const { age = 0 } = { age: null }` donne `null`, pas `0`. C'est cohérent avec le reste du langage — `undefined` signifie « absent », `null` signifie « présent et vide » — mais cela surprend quand les données viennent d'une API qui renvoie `null`.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "L'ordre compte en diffusion",
      text: "`{ ...defauts, ...props }` laisse les props écraser les valeurs par défaut ; `{ ...props, ...defauts }` fait l'inverse et annule tout ce que l'appelant a fourni. La même règle vaut en JSX, où un attribut écrit après une diffusion l'emporte sur elle. Inverser ces deux lignes est une erreur silencieuse et difficile à repérer en relecture.",
    },
    {
      kind: "text",
      text: "Un usage moins connu de la déstructuration règle un cas courant : l'échange de deux valeurs sans variable temporaire, `[a, b] = [b, a]`. Le même mécanisme permet d'extraire proprement plusieurs valeurs d'un retour de fonction, ce qui explique la popularité des retours sous forme de tuple dans les bibliothèques de hooks — un objet aurait imposé ses noms de propriétés à tous les appelants.",
    },
    {
      kind: "text",
      text: "Enfin, la diffusion s'applique à tout ce qui est itérable, pas seulement aux tableaux : `[...chaine]` donne les caractères, `[...unSet]` un tableau, `[...map]` des paires clé-valeur. C'est le moyen le plus court de convertir un `Set` ou une `Map` en tableau pour le parcourir en JSX, où seuls les tableaux se rendent directement.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "fill",
    id: "react-jsts-04",
    difficulty: 1,
    tags: ["javascript", "destructuration"],
    prompt: "Complète : extraire `label`, regrouper le reste, et produire une copie modifiée.",
    code: {
      language: "tsx",
      code: `function Champ({ label, {{1}}attributs }) {
  return <input {...attributs} aria-label={label} />;
}

const majore = { {{2}}client, age: client.age + 1 };`,
    },
    blanks: ["...", "..."],
    distractors: ["&", "*", "rest "],
    explanation:
      "Les trois points servent aux deux usages selon la position : à gauche d'une affectation ils **regroupent** le surplus (opérateur de reste), à droite ils **étalent** le contenu (opérateur de diffusion). C'est le même symbole pour deux opérations inverses, ce qui déroute au début mais devient vite naturel.",
  },
  {
    kind: "mcq",
    id: "react-jsts-05",
    difficulty: 2,
    tags: ["javascript", "immuabilite", "react"],
    prompt: "`const copie = { ...etat };` puis `copie.adresse.ville = \"Lyon\";`. Que se passe-t-il ?",
    choices: [
      "`etat.adresse.ville` change aussi : la diffusion ne copie qu'un niveau, l'objet imbriqué reste partagé.",
      "Rien : `copie` est une copie complète et indépendante de `etat`.",
      "Une `TypeError` : on ne peut pas modifier une propriété d'un objet issu d'une diffusion.",
      "`copie.adresse` devient `undefined` car la diffusion ne recopie que les valeurs primitives.",
    ],
    answer: 0,
    explanation:
      "La diffusion produit une copie **superficielle** : les propriétés de premier niveau sont recopiées, mais un objet imbriqué reste la même référence dans les deux. C'est la cause la plus fréquente de mutations accidentelles d'état en React — et comme la référence imbriquée n'a pas changé, l'interface peut ne pas refléter la modification. Il faut diffuser à chaque niveau touché.",
  },
  {
    kind: "recall",
    id: "react-jsts-06",
    difficulty: 2,
    tags: ["javascript", "destructuration"],
    prompt: "Quand une valeur par défaut de déstructuration s'applique-t-elle ?",
    explanation:
      "Uniquement lorsque la valeur est `undefined`. `const { age = 0 } = { age: null }` donne `null`, pas `0`, et il en va de même pour un paramètre de fonction avec valeur par défaut. C'est cohérent avec la sémantique du langage — `undefined` signifie « absent », `null` signifie « présent et délibérément vide » — mais cela surprend systématiquement quand les données proviennent d'une API qui renvoie `null` pour les champs non renseignés, ce qui est fréquent en JSON. Le contournement usuel est l'opérateur de coalescence des nuls, `valeur ?? defaut`, qui traite `null` et `undefined` de la même façon, contrairement à `||` qui écraserait aussi `0`, la chaîne vide et `false`.",
    keyPoints: [
      "Le défaut ne s'applique que sur undefined, jamais sur null",
      "Cohérent : undefined = absent, null = présent et vide",
      "Piège fréquent avec les API JSON qui renvoient null",
      "?? traite les deux ; || écraserait aussi 0, \"\" et false",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Fonctions fléchées et this
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "react-jsts-l3",
  title: "Fonctions fléchées et this",
  blocks: [
    {
      kind: "text",
      text: "`this` en JavaScript ne désigne pas ce que l'on croit venant d'un langage à classes. Il n'est pas lié à la fonction où il apparaît mais à la **façon dont l'appel est effectué**. La même fonction, appelée différemment, verra un `this` différent — et c'est la source de bugs la plus ancienne du langage.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "La même fonction, trois valeurs de this.",
      code: `const objet = {
  nom: "A",
  direNom() { return this?.nom; },
};

objet.direNom();              // "A"  — appel comme méthode

const detachee = objet.direNom;
detachee();                   // undefined — plus de récepteur
                              // (en module ES, donc strict)

detachee.call({ nom: "B" });  // "B"  — récepteur imposé`,
    },
    {
      kind: "text",
      text: "C'est ce détachement qui casse les passages de méthode en callback : `setTimeout(objet.direNom, 0)` ne transmet que la fonction, pas son récepteur. Historiquement, on contournait par `bind`, par une variable `const self = this`, ou par une fonction enveloppante. Les fonctions fléchées ont réglé le problème d'une autre manière.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Une fonction fléchée n'a pas de this propre.",
      code: `const compteur = {
  n: 0,
  classique() {
    // Le callback de map est une fonction ordinaire :
    // this y vaut undefined en mode strict.
    return [1, 2].map(function () { return this?.n; });
  },
  fleche() {
    // La flèche n'a pas de this : elle prend celui de
    // la portée englobante, donc l'objet.
    return [1, 2].map(() => this.n);
  },
};

console.log(compteur.classique(), compteur.fleche());
// [ undefined, undefined ] [ 0, 0 ]`,
    },
    {
      kind: "text",
      text: "Une fonction fléchée n'a ni `this`, ni `arguments`, ni `super` propres : elle les emprunte à la portée où elle est **écrite**. Ce n'est pas une liaison automatique mais une absence — d'où le fait que `call` et `bind` n'ont aucun effet sur elle. Cette propriété est exactement ce qu'on veut pour un callback, qui doit continuer à voir le contexte de son lieu d'écriture.",
    },
    {
      kind: "comparison",
      title: "Deux formes, deux usages",
      left: {
        label: "Fonction fléchée",
        text: "Pour les callbacks, les fonctions passées en argument, les composants React. `this` lexical, syntaxe courte, retour implicite sans accolades. Ne peut pas être une méthode d'objet qui aurait besoin du récepteur, ni un constructeur.",
      },
      right: {
        label: "Fonction ordinaire",
        text: "Pour les méthodes d'objet ou de classe qui doivent voir leur récepteur, et pour les rares cas où l'on veut `arguments`. Hissée si déclarée avec `function`, donc utilisable avant sa ligne.",
      },
    },
    {
      kind: "text",
      text: "En React moderne, la question a largement perdu de son acuité : les composants sont des fonctions et il n'y a plus de `this` du tout. La règle pratique tient en une ligne — utiliser des fonctions fléchées partout, sauf pour définir une méthode qui a besoin de son récepteur. On croise encore le sujet dans du code à base de classes, et il tombe régulièrement en entretien.",
    },
    {
      kind: "text",
      text: "Un piège subtil concerne le retour implicite. `() => ({ a: 1 })` renvoie un objet, mais `() => { a: 1 }` renvoie `undefined` : les accolades sont interprétées comme un corps de fonction, et `a:` comme une étiquette. D'où la nécessité d'entourer de parenthèses tout objet littéral renvoyé implicitement — une erreur qui ne produit aucun avertissement.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une flèche recréée à chaque rendu",
      text: "`<button onClick={() => supprimer(id)}>` crée une nouvelle fonction à chaque rendu. C'est sans conséquence dans la plupart des cas — React gère cela très bien — mais si l'enfant est enveloppé dans `memo`, la prop change à chaque fois et la mémorisation ne sert plus à rien. C'est le cas où `useCallback` se justifie, et il est plus rare qu'on ne le croit.",
    },
    {
      kind: "text",
      text: "Le mode strict change une partie du tableau, et il est actif partout dans du code moderne puisque les modules ES l'imposent. Sans lui, une fonction ordinaire appelée sans récepteur recevait l'objet global en guise de `this`, ce qui transformait une erreur en modification silencieuse d'une variable globale. En mode strict, `this` vaut `undefined`, et l'erreur apparaît immédiatement — c'est un progrès net pour le diagnostic.",
    },
    {
      kind: "text",
      text: "Retenons la formulation qui résume le sujet : une fonction ordinaire reçoit son `this` du site d'appel, une fonction fléchée le prend du site d'écriture. Toute la difficulté historique vient du premier cas, où la même fonction change de comportement selon la manière dont on l'invoque — et toute la commodité du second, où le contexte est fixé une fois pour toutes.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "react-jsts-07",
    difficulty: 3,
    tags: ["javascript", "this"],
    prompt: "Dans un module ES, donc en mode strict. Qu'affiche ce code ?",
    code: {
      language: "typescript",
      code: `const compteur = {
  n: 0,
  classique() {
    return [1, 2].map(function () { return this?.n; });
  },
  fleche() {
    return [1, 2].map(() => this.n);
  },
};

console.log(compteur.classique(), compteur.fleche());`,
    },
    choices: [
      "[ undefined, undefined ] [ 0, 0 ]",
      "[ 0, 0 ] [ 0, 0 ]",
      "[ undefined, undefined ] [ undefined, undefined ]",
      "[ 0, 0 ] [ undefined, undefined ]",
    ],
    answer: 0,
    explanation:
      "Le callback de `map` est une fonction ordinaire appelée sans récepteur : en mode strict, son `this` vaut `undefined`, d'où `undefined` deux fois. La fonction fléchée n'a pas de `this` propre et emprunte celui de la portée où elle est écrite — la méthode `fleche`, appelée sur `compteur` — d'où `0` deux fois.",
  },
  {
    kind: "mcq",
    id: "react-jsts-08",
    difficulty: 2,
    tags: ["javascript", "this"],
    prompt: "Que renvoie `const f = () => { a: 1 }; f();` ?",
    choices: [
      "`undefined` : les accolades sont lues comme un corps de fonction, pas comme un objet.",
      "`{ a: 1 }` : c'est la syntaxe normale du retour implicite.",
      "Une `SyntaxError` à l'analyse du fichier.",
      "`1` : la dernière expression du corps est renvoyée implicitement.",
    ],
    answer: 0,
    explanation:
      "Après une flèche, une accolade ouvre un corps de fonction. `a: 1` y est interprété comme une étiquette suivie d'une expression, et le corps ne contient aucun `return` : le résultat est `undefined`. Pour renvoyer un objet littéral implicitement, il faut l'entourer de parenthèses — `() => ({ a: 1 })`. Aucun avertissement n'est émis.",
  },
  {
    kind: "recall",
    id: "react-jsts-09",
    difficulty: 2,
    tags: ["javascript", "this"],
    prompt: "En quoi le `this` d'une fonction fléchée diffère-t-il de celui d'une fonction ordinaire ?",
    explanation:
      "Une fonction ordinaire reçoit son `this` du **site d'appel** : la même fonction verra un récepteur différent selon qu'on l'appelle comme méthode, détachée, ou via `call`. C'est ce qui casse le passage d'une méthode en callback — on ne transmet que la fonction, pas son récepteur, et `this` devient `undefined` en mode strict. Une fonction fléchée, elle, n'a **pas de `this` propre** : ce n'est pas une liaison automatique mais une absence, si bien qu'elle emprunte celui de la portée où elle est écrite. Conséquence directe : `call` et `bind` n'ont aucun effet sur une flèche, et elle ne peut pas servir de constructeur ni de méthode ayant besoin de son récepteur. Elle n'a pas non plus d'objet `arguments` propre. En React moderne, la question s'est effacée puisque les composants sont des fonctions sans `this`, mais elle reste posée en entretien.",
    keyPoints: [
      "Fonction ordinaire : this vient du site d'appel",
      "Flèche : pas de this propre, elle prend celui du site d'écriture",
      "call et bind sont sans effet sur une flèche",
      "Ni constructeur, ni méthode ayant besoin du récepteur",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les modules ES
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "react-jsts-l4",
  title: "Les modules ES",
  blocks: [
    {
      kind: "text",
      text: "Avant les modules, tout partageait un espace global : l'ordre des balises de script décidait de ce qui existait, et deux bibliothèques déclarant le même nom se marchaient dessus. Les modules ont apporté ce qui manquait — un espace de noms par fichier, des dépendances déclarées, et une analyse statique possible.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Les deux formes d'export, et leurs conséquences.",
      code: `// Exports nommés : plusieurs par fichier
export function formate(d: Date) { … }
export const TVA = 0.2;

// Export par défaut : un seul par fichier
export default function Bouton() { … }

// À l'import :
import Bouton from "./Bouton";           // nom libre
import { formate, TVA } from "./utils";  // noms imposés
import { formate as f } from "./utils";  // renommé
import * as utils from "./utils";        // espace de noms`,
    },
    {
      kind: "text",
      text: "La différence pratique entre les deux formes est le renommage. Un export par défaut s'importe sous n'importe quel nom, ce qui est commode mais ouvre la porte aux incohérences : le même composant peut s'appeler `Bouton` dans un fichier et `Btn` dans un autre. Un export nommé impose le nom d'origine, ce qui rend les recherches globales fiables et le renommage automatisable.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Statique par nature — et ce que cela permet.",
      code: `// Les imports sont RÉSOLUS AVANT l'exécution :
if (condition) {
  import { x } from "./m";     // SyntaxError
}

// Pour un chargement conditionnel, la forme dynamique,
// qui renvoie une promesse :
const { x } = await import("./m");

// C'est cette analyse statique qui permet :
//  - l'élimination du code mort (tree-shaking)
//  - le découpage automatique du bundle
//  - la détection d'un import inexistant à la compilation`,
    },
    {
      kind: "text",
      text: "Le caractère statique des imports n'est pas une limitation arbitraire : c'est ce qui permet aux outils de savoir, sans exécuter le code, quelles fonctions sont réellement utilisées. L'élimination du code mort en découle, et c'est la raison pour laquelle une bibliothèque exportant cent fonctions dont on en importe deux n'ajoute pas cent fonctions au bundle final.",
    },
    {
      kind: "comparison",
      title: "Deux styles d'export",
      left: {
        label: "Export par défaut",
        text: "Convient au composant principal d'un fichier, quand le fichier a manifestement un seul sujet. Nom libre à l'import — pratique, mais source d'incohérences et de recherches globales moins fiables.",
      },
      right: {
        label: "Exports nommés",
        text: "Nom imposé, donc cohérent dans tout le projet, renommage automatisable par l'éditeur, et un fichier peut exporter plusieurs choses. C'est le style qui s'est imposé dans la plupart des conventions récentes.",
      },
    },
    {
      kind: "text",
      text: "Un point technique mérite d'être connu : les modules sont **toujours** en mode strict, ce qui explique plusieurs comportements vus dans les leçons précédentes — notamment le `this` à `undefined` dans une fonction ordinaire appelée sans récepteur. Ils ont aussi leur propre portée de premier niveau, si bien qu'un `const` déclaré en haut d'un module n'est jamais global.",
    },
    {
      kind: "text",
      text: "Les imports circulaires méritent une mention car ils produisent des erreurs déroutantes. Si A importe B qui importe A, l'un des deux modules recevra une liaison encore non initialisée au moment où il l'utilise, et l'erreur — souvent « ne peut pas accéder avant l'initialisation » — pointe un endroit sans rapport apparent avec la cause. Le remède est structurel : extraire ce qui est commun dans un troisième module.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "L'import de type en TypeScript",
      text: "`import type { Client } from \"./types\"` indique explicitement que l'import ne sert qu'au typage : il disparaît entièrement à la compilation. Cela évite d'entraîner un module dans le bundle uniquement pour un type, et supprime une cause fréquente de cycles — un fichier de types importé partout créant des dépendances qui n'existent pas à l'exécution.",
    },
    {
      kind: "text",
      text: "Un fichier de barillet — un `index.ts` qui réexporte le contenu d'un dossier — mérite une mise en garde. Il rend les imports plus courts mais peut annuler l'élimination du code mort si les outils ne parviennent pas à prouver qu'un export est inutilisé, et il crée facilement des cycles quand deux modules du même dossier s'importent l'un l'autre à travers lui. Sur un gros projet, l'import direct reste plus sûr.",
    },
    {
      kind: "text",
      text: "Enfin, l'import dynamique est le mécanisme de base du découpage de code. Combiné à `React.lazy` et à `Suspense`, il permet de ne charger le code d'une page qu'au moment où l'utilisateur y accède. C'est le gain de performance le plus simple à obtenir sur une application qui grossit, car la frontière — une route — est déjà dessinée.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "react-jsts-10",
    difficulty: 2,
    tags: ["javascript", "modules"],
    prompt: "Pourquoi `import { x } from \"./m\"` est-il interdit à l'intérieur d'un `if` ?",
    choices: [
      "Les imports sont résolus avant l'exécution : c'est cette analyse statique qui permet l'élimination du code mort.",
      "Parce qu'un import dans un bloc créerait une variable de portée globale.",
      "Parce que le module serait chargé plusieurs fois, une par passage dans le bloc.",
      "C'est autorisé, mais seulement si le module n'a que des exports nommés.",
    ],
    answer: 0,
    explanation:
      "Les imports statiques sont résolus avant que la moindre ligne ne s'exécute. C'est cette propriété qui permet aux outils de savoir sans exécuter le code quelles fonctions sont réellement utilisées — donc l'élimination du code mort, le découpage automatique et la détection d'un import inexistant à la compilation. Pour un chargement conditionnel, la forme dynamique `await import(...)` renvoie une promesse.",
  },
  {
    kind: "match",
    id: "react-jsts-11",
    difficulty: 2,
    tags: ["javascript", "modules"],
    prompt: "Associe chaque forme d'import à ce qu'elle permet.",
    pairs: [
      { left: "import X from \"./m\"", right: "Export par défaut : le nom local est libre" },
      { left: "import { x } from \"./m\"", right: "Export nommé : le nom est imposé, renommage automatisable" },
      { left: "import type { T } from \"./m\"", right: "Typage seul : disparaît entièrement à la compilation" },
      { left: "await import(\"./m\")", right: "Chargement dynamique : base du découpage de code" },
    ],
    explanation:
      "`import type` est particulièrement utile pour supprimer les cycles : un fichier de types importé partout crée sinon des dépendances qui n'existent pas à l'exécution. L'import dynamique, combiné à `React.lazy` et `Suspense`, permet de ne charger le code d'une route qu'au moment où l'utilisateur y accède.",
  },
  {
    kind: "recall",
    id: "react-jsts-12",
    difficulty: 2,
    tags: ["javascript", "modules"],
    prompt: "Quels problèmes un import circulaire provoque-t-il, et comment le résoudre ?",
    explanation:
      "Si A importe B qui importe A, l'un des deux modules est évalué alors que l'autre n'a pas fini de s'initialiser : il reçoit une liaison encore non initialisée, et l'erreur obtenue — souvent « ne peut pas accéder avant l'initialisation » — pointe un endroit qui n'a aucun rapport apparent avec la cause, ce qui rend le diagnostic pénible. Le comportement dépend en outre de l'ordre d'évaluation, si bien que le bug peut apparaître ou disparaître selon le point d'entrée. Le remède n'est pas syntaxique mais structurel : extraire dans un troisième module ce que les deux partagent, ce qui casse le cycle et clarifie généralement la conception au passage. En TypeScript, un cycle qui ne concerne que des types se supprime immédiatement avec `import type`, l'import disparaissant à la compilation.",
    keyPoints: [
      "Une liaison encore non initialisée est utilisée",
      "L'erreur pointe loin de la cause et dépend du point d'entrée",
      "Remède structurel : extraire le commun dans un troisième module",
      "Cycle purement typé : import type le supprime",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — La boucle d'événements
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "react-jsts-l5",
  title: "La boucle d'événements",
  blocks: [
    {
      kind: "text",
      text: "JavaScript s'exécute sur un seul fil. Il n'y a jamais deux morceaux de votre code qui tournent en même temps, ce qui supprime d'un coup toutes les courses de la concurrence classique. En contrepartie, tout ce qui bloque ce fil bloque **tout** : le rendu, les clics, le défilement. C'est ce compromis qu'il faut comprendre.",
    },
    {
      kind: "text",
      text: "Le modèle repose sur trois éléments. La pile d'appel exécute le code en cours. Deux files attendent leur tour : celle des **macrotâches** — `setTimeout`, événements, entrées-sorties — et celle des **microtâches** — promesses, `queueMicrotask`. La boucle vide la pile, puis vide entièrement les microtâches, puis prend une seule macrotâche, et recommence.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "L'ordre, qui découle directement de cette règle.",
      code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
queueMicrotask(() => console.log("4"));
console.log("5");

// Affiche : 1, 5, 3, 4, 2
//
// 1 et 5  : code synchrone, d'abord et sans interruption
// 3 et 4  : microtâches, vidées AVANT toute macrotâche
// 2       : macrotâche, même avec un délai de 0`,
    },
    {
      kind: "text",
      text: "La priorité des microtâches est le point à retenir. `setTimeout(fn, 0)` ne signifie pas « tout de suite » mais « à la prochaine macrotâche », c'est-à-dire après que toutes les promesses en attente ont été traitées. C'est ce qui explique qu'un `.then` déclaré après un `setTimeout` s'exécute pourtant avant lui.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Bloquer le fil : ce qu'il ne faut pas faire.",
      code: `// Fige TOUT pendant la durée du calcul : plus de rendu,
// plus de réponse aux clics, l'onglet paraît planté.
function sommeLourde(n: number) {
  let s = 0;
  for (let i = 0; i < n; i++) s += i;   // 2 secondes
  return s;
}

// Une boucle infinie de microtâches est pire encore :
// la file n'est jamais vidée, aucune macrotâche ne
// passe, et la page ne répond plus du tout.
function boucle() { Promise.resolve().then(boucle); }`,
    },
    {
      kind: "text",
      text: "Un calcul long fige l'interface, et la solution n'est pas de le découper en `setTimeout` mais de le sortir du fil principal — un *web worker* s'exécute sur son propre fil et communique par messages. Le cas de la boucle infinie de microtâches est plus vicieux : comme la file des microtâches doit être **entièrement** vidée avant de passer à autre chose, l'onglet ne répond plus jamais.",
    },
    {
      kind: "comparison",
      title: "Deux files, deux priorités",
      left: {
        label: "Microtâches",
        text: "`.then`, `await`, `queueMicrotask`. Vidées **entièrement** après chaque unité de travail synchrone, avant toute macrotâche. Une microtâche qui en ajoute une autre repousse indéfiniment le reste.",
      },
      right: {
        label: "Macrotâches",
        text: "`setTimeout`, `setInterval`, événements du DOM, entrées-sorties. Une seule est traitée par tour de boucle, et le navigateur peut rendre l'écran entre deux — c'est ce qui laisse l'interface respirer.",
      },
    },
    {
      kind: "text",
      text: "Cette distinction éclaire un comportement souvent constaté en React : plusieurs `setState` appelés dans le même gestionnaire d'événement ne produisent qu'un seul rendu. React les regroupe et applique la mise à jour à la fin de l'unité de travail, avant que le navigateur ne reprenne la main. On ne peut donc pas lire la nouvelle valeur juste après l'appel.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le délai de setTimeout est un minimum",
      text: "`setTimeout(fn, 100)` garantit **au moins** cent millisecondes, jamais exactement. Si le fil est occupé, l'appel attend. Les navigateurs imposent en outre un plancher d'environ quatre millisecondes après plusieurs appels imbriqués, et ralentissent fortement les minuteries des onglets en arrière-plan. Aucune animation ni mesure de temps ne doit reposer là-dessus.",
    },
    {
      kind: "text",
      text: "Un cas fréquent illustre bien la différence entre découper et déléguer : le traitement d'une longue liste. Le découper en tranches traitées par `setTimeout` laisse effectivement respirer l'interface entre deux tranches, puisqu'une macrotâche autorise un rendu. Mais le travail reste sur le fil principal et la durée totale s'allonge. C'est un compromis acceptable pour un traitement d'une seconde, pas pour un calcul lourd.",
    },
    {
      kind: "text",
      text: "Signalons enfin `requestAnimationFrame`, qui n'appartient à aucune des deux files : le navigateur l'exécute juste avant de peindre l'écran. C'est le bon endroit pour toute animation, car il se synchronise sur le rythme d'affichage et se met en pause quand l'onglet passe en arrière-plan — deux propriétés qu'un `setInterval` ne donne pas.",
    },
    {
      kind: "text",
      text: "Retenons la formule : un seul fil, deux files, les microtâches d'abord. Ce modèle explique l'ordre d'exécution, la raison pour laquelle un calcul long fige la page, et pourquoi `setTimeout(fn, 0)` n'est pas immédiat. C'est aussi ce qui rend le JavaScript exempt des courses vues en Java — au prix d'une vigilance permanente sur ce qui bloque.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "output",
    id: "react-jsts-13",
    difficulty: 3,
    tags: ["javascript", "asynchrone"],
    prompt: "Dans quel ordre ces lignes s'affichent-elles ?",
    code: {
      language: "typescript",
      code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
queueMicrotask(() => console.log("4"));
console.log("5");`,
    },
    choices: [
      "1, 5, 3, 4, 2",
      "1, 5, 2, 3, 4",
      "1, 2, 3, 4, 5",
      "1, 5, 4, 3, 2",
    ],
    answer: 0,
    explanation:
      "Le code synchrone passe d'abord et sans interruption : 1 puis 5. La file des microtâches est ensuite vidée entièrement, dans l'ordre d'ajout : 3 puis 4. Enfin vient la macrotâche : 2. `setTimeout(fn, 0)` ne signifie pas « tout de suite » mais « à la prochaine macrotâche », donc après toutes les promesses en attente.",
  },
  {
    kind: "mcq",
    id: "react-jsts-14",
    difficulty: 2,
    tags: ["javascript", "asynchrone"],
    prompt: "Un calcul de deux secondes fige l'interface. Quelle est la bonne solution ?",
    choices: [
      "Le déplacer dans un web worker, qui s'exécute sur un autre fil.",
      "L'envelopper dans un `setTimeout(…, 0)` pour le rendre asynchrone.",
      "L'envelopper dans une promesse, ce qui le sortira du fil principal.",
      "Le découper en microtâches enchaînées par `queueMicrotask`.",
    ],
    answer: 0,
    explanation:
      "Ni `setTimeout` ni une promesse ne changent de fil : ils décalent seulement le moment où le calcul s'exécutera, en bloquant tout autant une fois lancé. Le découpage en microtâches est pire encore, la file devant être entièrement vidée avant toute macrotâche — l'onglet cesse alors complètement de répondre. Seul un web worker s'exécute réellement ailleurs.",
  },
  {
    kind: "order",
    id: "react-jsts-15",
    difficulty: 2,
    tags: ["javascript", "asynchrone"],
    prompt: "Remets dans l'ordre ce que fait la boucle d'événements à chaque tour.",
    items: [
      "Exécuter le code synchrone jusqu'à vider la pile d'appel",
      "Vider entièrement la file des microtâches",
      "Laisser éventuellement le navigateur rendre l'écran",
      "Traiter une seule macrotâche, puis recommencer",
    ],
    explanation:
      "C'est de cette séquence que découle tout le reste : la priorité des microtâches sur `setTimeout`, le fait qu'un calcul long fige l'affichage puisque le rendu n'a lieu qu'entre deux tours, et le blocage complet provoqué par une boucle infinie de microtâches — la file n'étant jamais vidée, on ne sort jamais de la deuxième étape.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Promesses et async/await
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "react-jsts-l6",
  title: "Promesses et async/await",
  blocks: [
    {
      kind: "text",
      text: "Une promesse représente une valeur qui n'est pas encore disponible. Elle a trois états — en attente, tenue, rompue — et une propriété décisive : une fois résolue, elle ne change plus. C'est ce qui la rend composable, là où les callbacks imbriqués produisaient une pyramide difficile à lire et impossible à composer.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "La même logique, deux syntaxes.",
      code: `// Chaînage
function charge(id: string) {
  return fetch(\`/api/clients/\${id}\`)
    .then(r => {
      if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
      return r.json();
    })
    .then(client => enrichir(client))
    .catch(e => { journaliser(e); return null; });
}

// async/await : le même code, en apparence séquentiel
async function charge2(id: string) {
  try {
    const r = await fetch(\`/api/clients/\${id}\`);
    if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
    return enrichir(await r.json());
  } catch (e) {
    journaliser(e);
    return null;
  }
}`,
    },
    {
      kind: "text",
      text: "`async`/`await` n'est pas un mécanisme différent : c'est une syntaxe sur les promesses. Une fonction `async` renvoie toujours une promesse, et `await` suspend son exécution jusqu'à résolution — sans bloquer le fil, qui repart traiter autre chose. Le gain est la lisibilité : la gestion d'erreur redevient un `try` ordinaire, et le flot se lit de haut en bas.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "L'erreur de performance la plus fréquente.",
      code: `// SÉQUENTIEL : chaque await attend le précédent.
// Durée = somme des trois.
const client = await chargeClient(id);
const commandes = await chargeCommandes(id);
const solde = await chargeSolde(id);

// PARALLÈLE : les trois partent ensemble.
// Durée = celle de la plus lente.
const [client2, commandes2, solde2] = await Promise.all([
  chargeClient(id),
  chargeCommandes(id),
  chargeSolde(id),
]);

// Attention : Promise.all rejette dès le PREMIER échec.
// Pour obtenir tous les résultats, succès comme échecs :
const resultats = await Promise.allSettled([...]);`,
    },
    {
      kind: "text",
      text: "Enchaîner des `await` sur des appels indépendants est le contresens le plus courant : la syntaxe séquentielle rend le coût invisible. Le réflexe à prendre est de se demander, devant deux `await` consécutifs, si le second a réellement besoin du résultat du premier. Si non, `Promise.all` divise le temps d'attente par le nombre d'appels.",
    },
    {
      kind: "comparison",
      title: "Quatre combinateurs à distinguer",
      left: {
        label: "all et allSettled",
        text: "`all` attend tout et rejette au **premier** échec, les autres promesses continuant en arrière-plan. `allSettled` attend tout et ne rejette jamais : chaque résultat porte son statut, ce qui convient quand un échec partiel est acceptable.",
      },
      right: {
        label: "race et any",
        text: "`race` se résout avec la **première** promesse terminée, succès ou échec — utile pour imposer un délai maximal. `any` se résout avec le premier **succès** et n'échoue que si toutes échouent — utile pour interroger plusieurs sources équivalentes.",
      },
    },
    {
      kind: "text",
      text: "Un piège discret : une promesse rejetée dont personne ne traite l'erreur produit un rejet non géré. Dans un navigateur, cela remonte dans la console ; dans Node, cela peut terminer le processus. Le cas se produit typiquement quand on lance une opération sans l'attendre — « et si ça échoue, tant pis » — sans même un `.catch` vide.",
    },
    {
      kind: "text",
      text: "Un autre point mérite attention : une promesse démarre son travail **à sa création**, pas au premier `await`. Appeler `chargeClient(id)` lance immédiatement la requête ; l'`await` ne fait qu'attendre le résultat. C'est ce qui rend possible de créer trois promesses puis de les attendre ensemble — et ce qui explique qu'on ne puisse pas « annuler » une promesse en ne l'attendant pas.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "await dans une boucle",
      text: "`for (const id of ids) { await traite(id); }` traite les éléments un par un. Sur cent identifiants et cent millisecondes chacun, cela fait dix secondes au lieu d'une. Si l'ordre n'importe pas, `await Promise.all(ids.map(traite))` est la forme correcte — en veillant toutefois à ne pas lancer mille requêtes simultanées sur un serveur qui ne le supportera pas.",
    },
    {
      kind: "text",
      text: "Une promesse est en outre **immuable une fois résolue** : son état ne change plus, et l'on peut y attacher autant de `.then` qu'on veut, même longtemps après. C'est ce qui la distingue d'un événement, qui est perdu pour qui n'écoutait pas au bon moment, et ce qui permet de conserver une promesse en cache pour la partager entre plusieurs appelants.",
    },
    {
      kind: "text",
      text: "En React, ces règles se combinent avec une contrainte propre : un composant ne peut pas être `async`, et un effet ne doit pas renvoyer de promesse — sa valeur de retour est réservée à la fonction de nettoyage. On déclare donc une fonction asynchrone à l'intérieur de l'effet et on l'appelle, ou mieux, on confie le chargement à un outil dédié comme vu au chapitre sur l'état.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "spot",
    id: "react-jsts-16",
    difficulty: 2,
    tags: ["javascript", "asynchrone", "performance"],
    prompt: "Ces trois appels sont indépendants et prennent 300 ms chacun. Quelle ligne rend le total de 900 ms ?",
    code: {
      language: "typescript",
      code: `async function chargeFiche(id: string) {
  const client = await chargeClient(id);
  const commandes = await chargeCommandes(id);
  const solde = await chargeSolde(id);
  return new Fiche(client, commandes, solde);
}`,
    },
    faultyLine: 3,
    reasons: [
      "Le deuxième `await` attend le premier sans en avoir besoin : les trois appels devraient partir ensemble via `Promise.all`.",
      "`chargeCommandes` devrait recevoir le client chargé à la ligne précédente.",
      "Une fonction `async` ne peut pas contenir plusieurs `await` successifs.",
      "Il manque un `try`/`catch` autour des appels asynchrones.",
    ],
    reasonAnswer: 0,
    explanation:
      "La syntaxe séquentielle rend le coût invisible : chaque `await` suspend jusqu'à la résolution du précédent alors qu'aucun des trois ne dépend des autres. `await Promise.all([chargeClient(id), chargeCommandes(id), chargeSolde(id)])` lance les trois ensemble et ramène le total à 300 ms. Le réflexe est de se demander, devant deux `await` consécutifs, si le second a besoin du résultat du premier.",
  },
  {
    kind: "mcq",
    id: "react-jsts-17",
    difficulty: 2,
    tags: ["javascript", "asynchrone"],
    prompt: "Quelle différence entre `Promise.all` et `Promise.allSettled` ?",
    choices: [
      "`all` rejette dès le premier échec ; `allSettled` attend tout et renvoie le statut de chacune.",
      "`all` s'exécute en parallèle, `allSettled` en séquentiel.",
      "`allSettled` n'existe que côté Node, pas dans les navigateurs.",
      "`all` conserve l'ordre des résultats, `allSettled` les renvoie dans l'ordre d'achèvement.",
    ],
    answer: 0,
    explanation:
      "Les deux lancent tout en parallèle et conservent l'ordre du tableau d'entrée. La différence est le traitement de l'échec : `all` rejette immédiatement au premier échec — les autres promesses continuant en arrière-plan sans que leur résultat soit exploité — tandis que `allSettled` ne rejette jamais et fournit pour chaque entrée son statut, ce qui convient quand un échec partiel est acceptable.",
  },
  {
    kind: "recall",
    id: "react-jsts-18",
    difficulty: 2,
    tags: ["javascript", "asynchrone"],
    prompt: "Quand une promesse commence-t-elle son travail, et quelle conséquence ?",
    explanation:
      "À sa **création**, pas au premier `await`. Appeler `chargeClient(id)` lance immédiatement la requête ; `await` ne fait qu'attendre un résultat déjà en cours de production. Deux conséquences en découlent. La première est positive : on peut créer plusieurs promesses puis les attendre ensemble, ce qui est exactement le mécanisme de `Promise.all` et permet de ramener la durée totale à celle de la plus lente. La seconde est une limite : on ne peut pas « annuler » une promesse en ne l'attendant pas — le travail se fait de toute façon, et si elle échoue sans que personne ne traite l'erreur, on obtient un rejet non géré qui remonte dans la console du navigateur et peut terminer un processus Node. Pour annuler réellement une requête, il faut un `AbortController`.",
    keyPoints: [
      "Le travail démarre à la création, pas à l'await",
      "Permet de créer plusieurs promesses puis de les attendre ensemble",
      "Ne pas attendre une promesse ne l'annule pas",
      "Un rejet non traité remonte, voire termine un processus Node",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — TypeScript : typage structurel et inférence
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "react-jsts-l7",
  title: "TypeScript : typage structurel et inférence",
  blocks: [
    {
      kind: "text",
      text: "TypeScript ne change rien à l'exécution : il ajoute une vérification à la compilation, puis s'efface. Aucun type ne subsiste dans le JavaScript produit, ce qui a une conséquence importante — on ne peut pas tester un type à l'exécution, et une donnée venant d'une API n'est jamais garantie conforme à ce qu'on a déclaré.",
    },
    {
      kind: "text",
      text: "Sa particularité principale est d'être **structurel** et non nominal. Deux types sont compatibles s'ils ont la même forme, indépendamment de leur nom ou de leur déclaration. Là où Java exige qu'une classe déclare implémenter une interface, TypeScript se contente de constater que les propriétés attendues sont présentes.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "La compatibilité par la forme.",
      code: `type Point = { x: number; y: number };
type Vecteur = { x: number; y: number };

const p: Point = { x: 1, y: 2 };
const v: Vecteur = p;          // accepté : même forme

function longueur(pt: Point) { … }
longueur({ x: 1, y: 2 });      // accepté
longueur({ x: 1, y: 2, z: 3 }); // REFUSÉ en littéral direct
                                // (vérification des propriétés
                                //  en excès)
const objet = { x: 1, y: 2, z: 3 };
longueur(objet);                // accepté : plus un littéral`,
    },
    {
      kind: "text",
      text: "La vérification des propriétés en excès mérite l'explication, car elle produit une incohérence apparente : un littéral passé directement est refusé s'il contient des propriétés supplémentaires, alors que la même valeur passée par une variable est acceptée. C'est délibéré — sur un littéral, une propriété en trop est presque toujours une faute de frappe, alors qu'ailleurs le typage structurel s'applique normalement.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Laisser l'inférence travailler.",
      code: `// Inutile : le type est évident
const n: number = 42;
const noms: string[] = ["a", "b"];

// Suffisant, et le type reste exact
const n2 = 42;
const noms2 = ["a", "b"];      // string[]

// En revanche, annoter les FRONTIÈRES est utile :
// signature de fonction, props de composant, retour d'API.
function total(lignes: Ligne[]): number {
  return lignes.reduce((s, l) => s + l.prix, 0);
}

// as const : fige la valeur et affine le type
const statuts = ["actif", "inactif"] as const;
type Statut = typeof statuts[number];  // "actif" | "inactif"`,
    },
    {
      kind: "text",
      text: "La règle d'annotation qui fonctionne : annoter les **frontières**, laisser l'inférence s'occuper de l'intérieur. Les signatures de fonction, les props d'un composant et le type des données venant du réseau méritent une déclaration explicite ; une variable locale initialisée par une valeur évidente n'en a pas besoin, et l'annoter n'apporte que du bruit.",
    },
    {
      kind: "comparison",
      title: "type ou interface",
      left: {
        label: "type",
        text: "Peut décrire n'importe quoi : union, intersection, type conditionnel, tuple, alias d'un primitif. Ne fusionne pas si déclaré deux fois. C'est le choix par défaut, et le seul possible pour une union.",
      },
      right: {
        label: "interface",
        text: "Décrit une forme d'objet. Fusionne automatiquement si déclarée plusieurs fois, ce qui sert à étendre les types d'une bibliothèque tierce. Les messages d'erreur y sont parfois plus lisibles sur les grandes structures.",
      },
    },
    {
      kind: "text",
      text: "En pratique, la différence est mince et beaucoup d'équipes tranchent par convention. Le seul cas qui impose vraiment `interface` est l'augmentation de déclaration — ajouter un champ à un type fourni par une bibliothèque. Le seul cas qui impose `type` est l'union, qui est aussi l'outil le plus utile du langage.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les types ne valident rien à l'exécution",
      text: "`const client = await r.json() as Client` n'effectue **aucune** vérification : c'est une affirmation, et si l'API renvoie autre chose, l'erreur surgira bien plus tard, dans un endroit sans rapport. Pour une frontière réseau, une validation réelle — avec une bibliothèque de schéma — donne à la fois le type et le contrôle, et fait échouer là où le problème se trouve.",
    },
    {
      kind: "text",
      text: "Les unions discriminées méritent d'être citées comme l'outil le plus utile du langage au quotidien. En donnant à chaque variante un champ littéral commun — `{ type: \"succes\", donnees } | { type: \"erreur\", message }` — on obtient un affinage automatique : dans une branche testant `type === \"erreur\"`, le compilateur sait que `message` existe et que `donnees` n'existe pas. C'est ce qui remplace les champs optionnels qui n'ont de sens que dans certains cas.",
    },
    {
      kind: "text",
      text: "Retenons enfin que TypeScript est un système de types **incomplet par conception** : il accepte des programmes qu'il ne peut pas prouver corrects, précisément pour rester utilisable sur du JavaScript existant. Les affirmations de type, les `any` et les définitions de bibliothèques tierces sont autant d'endroits où la garantie s'arrête — ce qui rend d'autant plus utile de savoir où l'on se tient.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "react-jsts-19",
    difficulty: 2,
    tags: ["typescript"],
    prompt: "Deux types `Point` et `Vecteur` déclarent tous deux `{ x: number; y: number }`. Un `Point` est-il assignable à un `Vecteur` ?",
    choices: [
      "Oui : TypeScript est structurel, la compatibilité se juge sur la forme et non sur le nom.",
      "Non : ce sont deux types distincts, il faut une conversion explicite.",
      "Oui, mais seulement si `Vecteur` est déclaré avec `interface`.",
      "Non, sauf si `Point` déclare explicitement étendre `Vecteur`.",
    ],
    answer: 0,
    explanation:
      "Contrairement à Java, où une classe doit déclarer implémenter une interface, TypeScript se contente de constater que les propriétés attendues sont présentes. C'est ce qui permet de typer du JavaScript existant sans le modifier. La contrepartie est qu'on ne peut pas distinguer deux types de même forme sans recourir à une marque supplémentaire.",
  },
  {
    kind: "match",
    id: "react-jsts-20",
    difficulty: 2,
    tags: ["typescript"],
    prompt: "Associe chaque situation à la bonne pratique d'annotation.",
    pairs: [
      { left: "const n = 42", right: "Ne rien annoter : l'inférence donne le type exact" },
      { left: "Signature d'une fonction exportée", right: "Annoter : c'est une frontière lue par d'autres" },
      { left: "Données reçues d'une API", right: "Valider à l'exécution, une affirmation ne vérifie rien" },
      { left: "Liste de valeurs littérales figées", right: "as const, pour obtenir une union de littéraux" },
    ],
    explanation:
      "La règle est d'annoter les frontières et de laisser l'inférence s'occuper de l'intérieur. Le cas de l'API est le plus important : `as Client` est une affirmation, pas un contrôle — si la réponse a une autre forme, l'erreur surgira bien plus tard, dans un endroit sans rapport avec la cause.",
  },
  {
    kind: "recall",
    id: "react-jsts-21",
    difficulty: 2,
    tags: ["typescript"],
    prompt: "Pourquoi `await r.json() as Client` est-il dangereux ?",
    explanation:
      "Parce qu'une affirmation de type n'effectue **aucune vérification** : elle demande simplement au compilateur de faire confiance. Les types de TypeScript disparaissent entièrement à la compilation, si bien qu'il ne reste rien à l'exécution pour contrôler la forme réelle de la réponse. Si l'API renvoie autre chose — un champ renommé, un `null` inattendu, une erreur au format différent — rien ne le signale au moment du problème : l'erreur surgira beaucoup plus loin, sous la forme d'un accès à une propriété d'`undefined`, dans un composant qui n'a aucun rapport avec la cause. C'est particulièrement traître parce que le code paraît typé et donne une fausse impression de sûreté. La réponse correcte est de valider à la frontière avec une bibliothèque de schéma, qui produit à la fois le type statique et le contrôle à l'exécution, et fait échouer précisément là où le contrat est rompu.",
    keyPoints: [
      "Une affirmation demande de faire confiance, elle ne vérifie rien",
      "Les types disparaissent à la compilation : rien ne subsiste",
      "L'erreur surgit loin de la cause, sur un accès à undefined",
      "Valider à la frontière avec un schéma : type et contrôle ensemble",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — any, unknown, never et le typage sûr
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "react-jsts-l8",
  title: "any, unknown, never et le typage sûr",
  blocks: [
    {
      kind: "text",
      text: "Trois types occupent des positions particulières dans TypeScript, et les confondre ruine le bénéfice du typage. `any` désactive la vérification, `unknown` la reporte, `never` désigne ce qui ne peut pas exister. Savoir lequel employer est ce qui distingue un code typé d'un code qui en a seulement l'apparence.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "any : la vérification s'arrête, et se propage.",
      code: `const donnees: any = await r.json();

donnees.client.nom;              // accepté
donnees.nimporteQuoi.dutout();   // accepté aussi
const n: number = donnees;       // accepté

// Pire : any se propage silencieusement.
const liste = donnees.items;     // liste est any
liste.map(x => x.prix * 2);      // x est any…
// Toute une branche du code perd sa vérification
// sans qu'aucun avertissement ne soit émis.`,
    },
    {
      kind: "text",
      text: "`any` ne signifie pas « n'importe quel type » mais « arrête de vérifier ». Sa dangerosité vient de sa contagion : tout ce qui en dérive devient `any` à son tour, si bien qu'un seul `any` à une frontière peut désactiver le typage sur une branche entière du code, sans le moindre avertissement.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "unknown : on doit prouver avant d'utiliser.",
      code: `const donnees: unknown = await r.json();

donnees.client;                  // ERREUR : il faut affiner

if (typeof donnees === "object" && donnees !== null
    && "client" in donnees) {
  donnees.client;                // ici, c'est permis
}

// Le vrai outil pour une frontière : un garde de type
function estClient(v: unknown): v is Client {
  return typeof v === "object" && v !== null
      && "nom" in v && typeof (v as Client).nom === "string";
}

if (estClient(donnees)) {
  donnees.nom;                   // Client, garanti par le test
}`,
    },
    {
      kind: "text",
      text: "`unknown` est le type sûr pour tout ce qui entre dans le système : réponse réseau, message reçu, contenu analysé depuis du JSON. Il accepte n'importe quelle valeur mais n'autorise aucune opération avant d'avoir été affiné. Le compilateur force alors à écrire la vérification qu'on aurait omise avec `any` — ce qui est exactement l'objectif.",
    },
    {
      kind: "comparison",
      title: "Deux réponses à « je ne sais pas ce que c'est »",
      left: {
        label: "any",
        text: "La vérification est désactivée et se propage. Utile pour migrer progressivement du JavaScript existant, à condition de le marquer comme dette. Jamais un choix par défaut, et jamais à une frontière de données.",
      },
      right: {
        label: "unknown",
        text: "La vérification est reportée : rien n'est permis tant que le type n'a pas été prouvé. C'est le bon type d'entrée pour toute donnée externe, et il transforme un oubli silencieux en erreur de compilation.",
      },
    },
    {
      kind: "text",
      text: "`never` désigne ce qui ne peut pas se produire : le type de retour d'une fonction qui lève toujours, ou d'une branche que le compilateur juge inatteignable. Son usage le plus utile est la vérification d'exhaustivité — obtenir une erreur de compilation le jour où un cas s'ajoute à une union, exactement comme les hiérarchies scellées en Java.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "L'exhaustivité vérifiée par le compilateur.",
      code: `type Forme =
  | { type: "cercle"; r: number }
  | { type: "carre"; c: number };

function aire(f: Forme): number {
  switch (f.type) {
    case "cercle": return Math.PI * f.r ** 2;
    case "carre":  return f.c ** 2;
    default:
      // f est ici de type never : tous les cas sont traités.
      // Ajouter { type: "triangle" } à l'union fait
      // ÉCHOUER cette ligne à la compilation.
      const _exhaustif: never = f;
      throw new Error(\`forme inconnue : \${_exhaustif}\`);
  }
}`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Interdire any par la configuration",
      text: "Activer `strict` dans la configuration TypeScript et la règle `no-explicit-any` d'ESLint transforme la dette silencieuse en dette visible. On peut toujours en écrire un avec un commentaire de désactivation — et c'est justement le point : le choix devient explicite, daté et repérable, au lieu de se répandre sans que personne ne l'ait décidé.",
    },
    {
      kind: "text",
      text: "Deux voisins de `never` complètent le tableau. `void` désigne l'absence de valeur de retour utile — une fonction qui `return` sans valeur — contrairement à `never` qui signifie que la fonction **ne revient jamais**. Et `object` désigne toute valeur non primitive, ce qui est plus large qu'on ne le croit : un tableau et une fonction en sont, ce qui le rend rarement utile comme annotation.",
    },
    {
      kind: "text",
      text: "Un dernier réflexe utile : préférer une union de littéraux à une chaîne libre partout où l'ensemble des valeurs est connu. `statut: string` accepte n'importe quelle faute de frappe ; `statut: \"actif\" | \"inactif\"` la refuse à la compilation et fournit en prime l'autocomplétion. C'est le gain de typage le moins coûteux et le plus immédiatement rentable.",
    },
    {
      kind: "text",
      text: "Retenons la règle qui résume tout : à une frontière, ce qui entre est `unknown` et doit être validé ; `any` n'est acceptable que comme marqueur temporaire de migration ; `never` sert à faire vérifier l'exhaustivité par le compilateur. Un code où `any` apparaît régulièrement n'est pas typé — il est décoré de types, ce qui est plus dangereux qu'un JavaScript assumé, parce que la fausse confiance s'y ajoute.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "fill",
    id: "react-jsts-22",
    difficulty: 2,
    tags: ["typescript"],
    prompt: "Complète : typer sûrement une réponse réseau, et écrire le garde de type.",
    code: {
      language: "typescript",
      code: `const donnees: {{1}} = await r.json();

function estClient(v: unknown): v {{2}} Client {
  return typeof v === "object" && v !== null && "nom" in v;
}`,
    },
    blanks: ["unknown", "is"],
    distractors: ["any", "object", "as", "extends"],
    explanation:
      "`unknown` accepte n'importe quelle valeur mais n'autorise aucune opération avant affinage : le compilateur force à écrire la vérification. Le prédicat `v is Client` indique au compilateur que si la fonction renvoie `true`, la valeur est un `Client` — c'est un garde de type, qui affine dans la branche du `if`.",
  },
  {
    kind: "spot",
    id: "react-jsts-23",
    difficulty: 2,
    tags: ["typescript"],
    prompt: "Cette ligne fait perdre la vérification de type à toute la suite. Laquelle ?",
    code: {
      language: "typescript",
      code: `async function charge(id: string) {
  const r = await fetch(\`/api/clients/\${id}\`);
  const donnees: any = await r.json();
  const lignes = donnees.commandes;
  return lignes.map((l) => l.montant * 1.2);
}`,
    },
    faultyLine: 3,
    reasons: [
      "`any` désactive la vérification et se propage : `lignes` puis `l` deviennent `any` à leur tour.",
      "`await r.json()` doit être entouré d'un `try`/`catch` obligatoire.",
      "Le type de retour de la fonction doit être annoté explicitement.",
      "`fetch` ne peut pas être utilisé avec un gabarit de chaîne.",
    ],
    reasonAnswer: 0,
    explanation:
      "`any` ne signifie pas « n'importe quel type » mais « arrête de vérifier », et cette désactivation est contagieuse : tout ce qui en dérive devient `any` sans le moindre avertissement. Ici, une seule annotation supprime le typage sur toute la branche. `unknown` suivi d'une validation rendrait au contraire l'oubli impossible.",
  },
  {
    kind: "mcq",
    id: "react-jsts-24",
    difficulty: 3,
    tags: ["typescript"],
    prompt: "À quoi sert `const _exhaustif: never = f;` dans le `default` d'un `switch` sur une union ?",
    choices: [
      "À faire échouer la compilation le jour où un cas s'ajoute à l'union sans être traité.",
      "À lever une exception à l'exécution si une valeur inattendue arrive.",
      "À forcer le compilateur à optimiser le `switch` en table de saut.",
      "À documenter que la branche est inatteignable, sans effet sur la compilation.",
    ],
    answer: 0,
    explanation:
      "Si tous les cas sont traités, le compilateur déduit que `f` est de type `never` dans le `default`, et l'affectation passe. Ajouter un membre à l'union sans le traiter y laisse un type concret, qui n'est pas assignable à `never` : la compilation échoue et pointe exactement les endroits à compléter. C'est l'équivalent TypeScript de l'exhaustivité d'un `switch` sur une hiérarchie scellée en Java.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "react-js-ts",
  title: "JavaScript moderne et TypeScript",
  objective:
    "Maîtriser les bases sur lesquelles React repose : portée et immuabilité, déstructuration et copies, this et fonctions fléchées, modules, boucle d'événements, promesses et async/await, typage structurel, et l'usage juste de any, unknown et never.",
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
