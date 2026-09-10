/**
 * Java — Collections : List, Set, Map, HashMap interne (référentiel 1.3).
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Choisir sa structure
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-col-l1",
  title: "List, Set, Map, Deque : choisir la bonne structure",
  blocks: [
    {
      kind: "text",
      text: "On programme vers l'**interface** (`List`, `Set`, `Map`, `Deque`) et on choisit l'**implémentation** à la construction. `List` : ordonnée, indexée, doublons autorisés. `Set` : pas de doublon. `Map` : clé → valeur, clés uniques. `Deque` : ajout et retrait aux deux bouts, ce qui couvre la pile et la file.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Interface à gauche, implémentation à droite.",
      code: `List<String> names = new ArrayList<>();
Set<String> unique = new HashSet<>(names);
Map<String, Integer> counts = new HashMap<>();
Deque<Task> stack = new ArrayDeque<>();

names.get(3);        // ArrayList O(1), LinkedList O(n)
names.add("x");      // en fin : O(1) amorti
names.add(0, "y");   // en tête : O(n), tout décale
stack.push(t);       // pile : ArrayDeque, pas Stack
stack.pop();`,
    },
    {
      kind: "text",
      text: "`ArrayList` stocke dans un tableau : accès par index en O(1), ajout en fin en O(1) amorti, insertion au milieu en O(n). `LinkedList` chaîne des nœuds : l'accès par index parcourt la liste (O(n)), chaque élément coûte deux références de plus, et la mémoire est dispersée, donc lente à parcourir. Son seul avantage théorique, l'insertion en O(1), suppose d'être déjà positionné avec un `ListIterator`, ce qui n'arrive presque jamais.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "`ArrayList` par défaut. Pour une pile ou une file, `ArrayDeque`, jamais `Stack` (synchronisée, héritée de `Vector`) ni `LinkedList`.",
    },
    {
      kind: "text",
      text: "Côté `Set` et `Map`, trois familles : `HashSet` / `HashMap` (O(1), ordre non garanti), `LinkedHashSet` / `LinkedHashMap` (ordre d'insertion conservé), `TreeSet` / `TreeMap` (trié, O(log n), exige `Comparable` ou un `Comparator`).",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-col-01",
    difficulty: 2,
    tags: ["list", "performance"],
    prompt: "Pourquoi `LinkedList` est-elle presque toujours un mauvais choix ?",
    choices: [
      "`get(i)` est en O(n), chaque nœud coûte deux références et la mémoire est dispersée : `ArrayList` est plus rapide, même pour la plupart des insertions.",
      "Elle n'implémente pas `List`, seulement `Queue`.",
      "Elle refuse les doublons, contrairement à `ArrayList`.",
      "Elle est synchronisée, donc lente en mono-thread.",
    ],
    answer: 0,
    explanation:
      "`LinkedList` implémente bien `List` et `Deque`, accepte les doublons, et n'est pas synchronisée. Son problème est structurel : parcours de nœuds dispersés, mauvais pour le cache CPU, et accès indexé linéaire. Les mesures montrent qu'`ArrayList` gagne même sur des insertions en milieu de liste de taille raisonnable, grâce à `System.arraycopy`.",
  },
  {
    kind: "match",
    id: "java-col-02",
    difficulty: 1,
    tags: ["collections", "conception"],
    prompt: "Associe chaque besoin à l'implémentation adaptée.",
    pairs: [
      { left: "Accès rapide par index", right: "`ArrayList`" },
      { left: "Unicité, ordre indifférent", right: "`HashSet`" },
      { left: "Unicité, ordre d'insertion conservé", right: "`LinkedHashSet`" },
      { left: "Unicité, éléments triés", right: "`TreeSet`" },
      { left: "Pile ou file", right: "`ArrayDeque`" },
    ],
    explanation:
      "Le choix se fait sur trois questions : doublons ou pas, ordre nécessaire (aucun, insertion, tri), et opérations dominantes (index, tête/queue, recherche). `ArrayDeque` remplace à la fois `Stack` et `LinkedList` pour les piles et files, avec un tableau circulaire.",
  },
  {
    kind: "output",
    id: "java-col-03",
    difficulty: 2,
    tags: ["set", "collections"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<Integer> l = List.of(3, 1, 3, 2);
System.out.println(new HashSet<>(l).size()
    + " " + new TreeSet<>(l)
    + " " + new LinkedHashSet<>(l));`,
    },
    choices: ["`3 [1, 2, 3] [3, 1, 2]`", "`4 [1, 2, 3] [3, 1, 3, 2]`", "`3 [3, 1, 2] [1, 2, 3]`", "`3 [1, 2, 3] [1, 2, 3]`"],
    answer: 0,
    explanation:
      "Les trois `Set` éliminent le doublon `3` : taille 3. `TreeSet` trie par ordre naturel : `[1, 2, 3]`. `LinkedHashSet` conserve l'ordre de première insertion : `[3, 1, 2]`. `HashSet` aurait ici aussi affiché `[1, 2, 3]`, mais par coïncidence des buckets, pas par contrat.",
  },
  {
    kind: "spot",
    id: "java-col-04",
    difficulty: 2,
    tags: ["list", "performance"],
    prompt: "Cette somme est quadratique sur une grande liste. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `long sum(LinkedList<Integer> nums) {
    long total = 0;
    for (int i = 0; i < nums.size(); i++) {
        total += nums.get(i);
    }
    return total;
}`,
    },
    faultyLine: 4,
    reasons: [
      "`get(i)` sur une `LinkedList` repart du début (ou de la fin) à chaque appel : O(n) par accès, O(n²) au total. Parcourir avec un for-each, ou utiliser une `ArrayList`.",
      "`size()` est recalculé à chaque itération en parcourant la liste.",
      "`total` devrait être un `int` pour éviter la conversion.",
      "Un for-each ne fonctionne pas sur `LinkedList`, il faut un `Iterator` explicite.",
    ],
    reasonAnswer: 0,
    explanation:
      "`LinkedList.get(i)` parcourt les nœuds depuis l'extrémité la plus proche : jusqu'à n/2 sauts par appel. Multiplié par n itérations, la boucle devient quadratique. `for (int n : nums)` utilise un `Iterator` qui avance de nœud en nœud : linéaire. `size()` est un champ, en O(1). Mieux : ne pas utiliser `LinkedList`.",
  },
  {
    kind: "mcq",
    id: "java-col-05",
    difficulty: 1,
    tags: ["collections", "conception", "interfaces"],
    prompt: "Pourquoi déclarer `List<String> l = new ArrayList<>()` plutôt que `ArrayList<String> l = new ArrayList<>()` ?",
    choices: [
      "Programmer vers l'interface : on peut changer d'implémentation sans toucher au reste du code, et les signatures exposent le contrat, pas le détail.",
      "`ArrayList` est déprécié comme type déclaré depuis Java 8.",
      "`List` est plus rapide car la JVM inline ses méthodes.",
      "Sinon l'inférence du diamant `<>` échoue.",
    ],
    answer: 0,
    explanation:
      "Le type déclaré fixe ce que le code appelant peut utiliser. Avec `List`, passer à `LinkedList`, `List.of` ou une liste immuable ne casse rien. Une méthode qui renvoie `ArrayList` s'interdit de renvoyer autre chose plus tard. Les performances ne changent pas : l'appel est résolu à l'exécution sur l'objet réel.",
  },
  {
    kind: "output",
    id: "java-col-06",
    difficulty: 2,
    tags: ["collections", "deque"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Deque<String> d = new ArrayDeque<>();
d.push("a");        // pile : en tête
d.push("b");
d.offerLast("c");   // file : en queue
System.out.println(d.pop() + d.pollLast() + d);`,
    },
    choices: ["`bc[a]`", "`ac[b]`", "`ba[c]`", "`cb[a]`"],
    answer: 0,
    explanation:
      "`push` ajoute en **tête** : après deux `push`, la deque vaut `[b, a]`. `offerLast` ajoute en **queue** : `[b, a, c]`. `pop` retire en tête → `b`, `pollLast` retire en queue → `c`. Il reste `[a]`. Une `Deque` sert de pile par la tête et de file par la queue, avec la même instance.",
  },
  {
    kind: "recall",
    id: "java-col-07",
    difficulty: 2,
    tags: ["list", "performance"],
    prompt: "`ArrayList` vs `LinkedList` : compare les complexités réelles, et dis dans quel cas `LinkedList` a un sens.",
    explanation:
      "**ArrayList** : `get`/`set` O(1), `add` en fin O(1) amorti (le tableau double quand il est plein), insertion ou suppression au milieu O(n) mais via `System.arraycopy`, très rapide en pratique, mémoire contiguë donc parcours cache-friendly. **LinkedList** : `get(i)` O(n), `add` en tête ou en queue O(1), insertion au milieu O(1) **seulement** si on est déjà positionné avec un `ListIterator`, sinon O(n) pour y arriver ; chaque nœud porte deux références supplémentaires, mémoire dispersée. Cas où elle a un sens : un flux d'insertions/suppressions au milieu pendant un parcours par `ListIterator`, ou un usage strict en `Deque`, et même là `ArrayDeque` est généralement meilleure. Verdict : `ArrayList` par défaut.",
    keyPoints: ["`ArrayList` : index O(1), fin O(1) amorti, milieu O(n) mais rapide", "`LinkedList` : index O(n), mémoire ×3, cache-unfriendly", "O(1) au milieu seulement via `ListIterator`", "`ArrayDeque` pour pile/file"],
  },
  {
    kind: "recall",
    id: "java-col-08",
    difficulty: 2,
    tags: ["hashmap", "collections", "conception"],
    prompt: "Tu dois compter les occurrences de chaque mot d'un texte, puis les afficher par ordre alphabétique. Quelles structures, et pourquoi ?",
    explanation:
      "Compter : `Map<String, Integer>` avec `HashMap` et `merge(word, 1, Integer::sum)` (ou `getOrDefault(word, 0) + 1`), O(1) par mot. Afficher trié : soit construire directement une `TreeMap` (tri maintenu à chaque insertion, O(log n) par mot), soit compter dans une `HashMap` puis trier les clés à la fin (`new TreeMap<>(counts)` ou un stream `sorted`). La seconde option est plus rapide si le texte est grand et le tri unique. Pièges : ne pas utiliser une `List` avec `contains` (O(n) par mot, quadratique), et normaliser les mots (casse, ponctuation) avant de les compter, sinon `Le` et `le` sont deux clés.",
    keyPoints: ["`HashMap` + `merge` pour compter", "`TreeMap` pour l'ordre trié", "Compter puis trier bat trier en continu", "Pas de `List.contains`"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — HashMap de l'intérieur
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-col-l2",
  title: "HashMap de l'intérieur : buckets, collisions, resize",
  blocks: [
    {
      kind: "text",
      text: "Une `HashMap` est un **tableau de buckets** dont la taille est une puissance de 2 (16 au départ). Pour une clé, elle calcule `hashCode()`, l'**étale** (`h ^ (h >>> 16)`) pour mélanger les bits hauts, puis prend `hash & (longueur - 1)` comme index. Deux clés dans le même bucket forment une **collision** : elles sont chaînées, et `equals` départage.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce que fait put(\"a\", 1), étape par étape.",
      code: `Map<String, Integer> m = new HashMap<>();
// 16 buckets, facteur de charge 0.75, seuil 12
m.put("a", 1);
// 1. h = "a".hashCode() ; h ^= h >>> 16
// 2. index = h & 15
// 3. bucket vide : nouveau nœud
//    sinon : même hash && equals → remplace
//            différent → chaîne (ou arbre)
// 4. size > 12 : table ×2, tout est redistribué

m.put(null, 0);   // clé null admise, bucket 0
m.get("a");       // même calcul : O(1) en moyenne`,
    },
    {
      kind: "text",
      text: "Quand le nombre d'entrées dépasse `capacité × 0.75` (le **facteur de charge**), la table **double** et chaque entrée est redistribuée : coûteux, et l'ordre d'itération change. Si un bucket dépasse 8 entrées et que la table a au moins 64 cases, la chaîne devient un **arbre rouge-noir** (Java 8) : O(log n) au lieu de O(n) quand des `hashCode` sont mauvais ou hostiles.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "L'ordre d'itération d'une `HashMap` n'est **pas garanti** : il dépend des hash et de la taille de la table, et change après un resize. Si l'ordre compte, `LinkedHashMap` (insertion) ou `TreeMap` (tri).",
    },
    {
      kind: "text",
      text: "Conséquences pratiques : un bon `hashCode` répartit les clés (`Objects.hash`), une clé immuable ne bouge pas de bucket, et donner la capacité initiale quand on connaît la taille évite les resizes en cascade.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "java-col-09",
    difficulty: 2,
    tags: ["hashmap", "performance"],
    prompt: "Une `HashMap` par défaut (16 buckets) reçoit sa 13ᵉ entrée. Que se passe-t-il ?",
    choices: [
      "La table double (32 buckets) et toutes les entrées sont redistribuées : l'ordre d'itération peut changer.",
      "Les buckets se transforment en arbres pour absorber la charge.",
      "Rien : chaque bucket est une liste chaînée sans limite.",
      "Une `IllegalStateException` : capacité dépassée.",
    ],
    answer: 0,
    explanation:
      "Le seuil est `16 × 0.75 = 12`. À la 13ᵉ entrée, `resize()` alloue une table de 32 et recalcule l'index de chaque nœud (`hash & 31`). C'est O(n) ponctuel, amorti sur les insertions. La treeification est un mécanisme distinct, par bucket, déclenché par les collisions et non par la taille globale.",
  },
  {
    kind: "output",
    id: "java-col-10",
    difficulty: 3,
    tags: ["hashmap", "iteration"],
    prompt: "Qu'affiche ce code ? (`Integer.hashCode()` renvoie la valeur elle-même.)",
    code: {
      language: "java",
      code: `Map<Integer, String> m = new HashMap<>();
m.put(10, "a");
m.put(2, "b");
m.put(33, "c");
System.out.println(m);`,
    },
    choices: ["`{33=c, 2=b, 10=a}`", "`{10=a, 2=b, 33=c}`", "`{2=b, 10=a, 33=c}`", "Impossible à prédire : l'ordre est aléatoire à chaque exécution."],
    answer: 0,
    explanation:
      "L'ordre d'itération est celui des buckets. Avec 16 buckets et des hash égaux aux valeurs (l'étalement `h ^ h >>> 16` ne change rien pour de petits entiers) : `10 & 15 = 10`, `2 & 15 = 2`, `33 & 15 = 1`. Parcours des buckets 1, 2, 10 : `{33=c, 2=b, 10=a}`. Ni l'ordre d'insertion, ni l'ordre numérique. Déterministe ici, mais **non garanti** par le contrat : il changerait au prochain resize.",
  },
  {
    kind: "spot",
    id: "java-col-11",
    difficulty: 2,
    tags: ["hashmap", "equals-hashcode", "performance"],
    prompt: "`Map<Sku, Stock>` fonctionne mais devient très lente avec 100 000 clés. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public final class Sku {
    private final String code;
    Sku(String code) { this.code = code; }

    @Override public boolean equals(Object o) {
        return o instanceof Sku s && code.equals(s.code);
    }
    @Override public int hashCode() { return 1; }
}`,
    },
    faultyLine: 8,
    reasons: [
      "Un `hashCode` constant met toutes les clés dans le même bucket : chaque recherche parcourt la chaîne, O(n). Utiliser `code.hashCode()` ou `Objects.hash(code)`.",
      "`hashCode` doit renvoyer un `long`, pas un `int`.",
      "Il faut aussi redéfinir `toString` pour que la `Map` fonctionne.",
      "`equals` doit utiliser `getClass()` au lieu d'`instanceof`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le contrat est respecté (égaux ⇒ même hash), donc c'est **correct**, mais toutes les clés s'entassent dans le bucket 1. Depuis Java 8, ce bucket devient un arbre, mais comme `Sku` n'est pas `Comparable`, l'arbre ne peut pas ordonner par valeur et la recherche reste quasi linéaire. Un `hashCode` dérivé du contenu répartit les clés sur tous les buckets.",
  },
  {
    kind: "fill",
    id: "java-col-12",
    difficulty: 2,
    tags: ["hashmap", "lambdas"],
    prompt: "Complète avec les méthodes de `Map` adaptées.",
    code: {
      language: "java",
      code: `Map<String, List<String>> byCity = new HashMap<>();
// crée la liste si absente, puis ajoute
byCity.{{1}}(city, k -> new ArrayList<>()).add(name);

// lit avec une valeur de repli
int n = counts.{{2}}(word, 0) + 1;

// incrémente ou initialise en un appel
counts.{{3}}(word, 1, Integer::sum);`,
    },
    blanks: ["computeIfAbsent", "getOrDefault", "merge"],
    distractors: ["putIfAbsent", "get", "compute", "put"],
    explanation:
      "`computeIfAbsent(clé, fonction)` calcule la valeur seulement si la clé manque et la renvoie : idéal pour les listes groupées. `putIfAbsent` prend une **valeur**, pas une fonction, et l'évaluerait même inutilement. `getOrDefault` évite le test `null`. `merge(clé, valeur, fonction)` insère la valeur si absente, sinon combine avec l'existante : le compteur idiomatique.",
  },
  {
    kind: "recall",
    id: "java-col-13",
    difficulty: 2,
    tags: ["hashmap"],
    prompt: "Décris le chemin exact d'un `map.get(key)` dans une `HashMap`.",
    explanation:
      "1. `key.hashCode()`, puis étalement `h ^ (h >>> 16)` pour que les bits hauts influencent l'index. 2. `index = hash & (table.length - 1)`, possible parce que la taille est une puissance de 2. 3. Si le bucket est vide, `null`. 4. Sinon, parcours du bucket : pour chaque nœud, on compare d'abord le **hash stocké** (entier, rapide), puis `==` ou `equals` sur la clé. 5. Si le bucket est un arbre (≥ 8 entrées), recherche en O(log n). Coût moyen O(1) si les hash sont bien répartis. Ce chemin explique tout : `hashCode` mal fait ou clé mutée = introuvable ou lent ; `equals` non redéfini = jamais trouvé sauf même instance.",
    keyPoints: ["`hashCode` puis étalement", "Index = hash & (n − 1)", "Hash stocké comparé avant `equals`", "Chaîne ou arbre dans le bucket"],
  },
  {
    kind: "mcq",
    id: "java-col-14",
    difficulty: 2,
    tags: ["hashmap", "performance"],
    prompt: "Depuis Java 8, un bucket très rempli devient un arbre. Dans quelle condition, et pourquoi ?",
    choices: [
      "Au moins 8 entrées dans le bucket et une table d'au moins 64 cases : cela ramène la recherche de O(n) à O(log n) face à des `hashCode` dégénérés ou hostiles.",
      "Dès la deuxième collision, pour accélérer toutes les recherches.",
      "Dès que la clé implémente `Comparable`, systématiquement.",
      "Jamais : seule `TreeMap` utilise un arbre.",
    ],
    answer: 0,
    explanation:
      "La treeification (`TREEIFY_THRESHOLD = 8`, `MIN_TREEIFY_CAPACITY = 64`) protège contre les attaques par collisions (clés forgées avec le même hash) et les mauvais `hashCode`. Sous 64 cases, la map préfère un resize. L'arbre revient en liste sous 6 entrées. Si les clés ne sont pas `Comparable`, l'arbre ordonne par hash puis par identité de classe : moins efficace mais borné.",
  },
  {
    kind: "output",
    id: "java-col-15",
    difficulty: 3,
    tags: ["hashmap", "null"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Map<String, Integer> m = new HashMap<>();
m.put(null, 1);
m.put("a", null);
System.out.println(m.get(null) + " " + m.get("a")
    + " " + m.getOrDefault("a", 9)
    + " " + m.containsKey("a"));`,
    },
    choices: ["`1 null null true`", "`1 null 9 true`", "`NullPointerException`", "`1 null 9 false`"],
    answer: 0,
    explanation:
      "`HashMap` accepte une clé `null` (bucket 0) et des valeurs `null`. `get(\"a\")` renvoie la valeur stockée, `null`. `getOrDefault` ne renvoie le défaut que si la **clé est absente** : ici elle est présente avec la valeur `null`, donc `null`. `containsKey` distingue bien « absente » de « présente à null ». (`ConcurrentHashMap`, elle, refuse `null` en clé et en valeur.)",
  },
  {
    kind: "order",
    id: "java-col-16",
    difficulty: 2,
    tags: ["hashmap"],
    prompt: "Remets dans l'ordre les étapes d'un `put(key, value)` dans une `HashMap`.",
    items: [
      "Calcul de `key.hashCode()`, puis étalement `h ^ (h >>> 16)`",
      "Index du bucket : `hash & (longueur − 1)`",
      "Parcours du bucket : hash égal puis `equals` → remplacement de la valeur",
      "Sinon ajout d'un nœud en fin de chaîne (arbre si ≥ 8 et table ≥ 64)",
      "Si `size` dépasse le seuil (capacité × 0.75) : resize ×2 et redistribution",
    ],
    explanation:
      "Le remplacement ne change pas `size`, donc pas de resize. L'ajout incrémente `size` et déclenche éventuellement le resize **après** l'insertion. Comprendre cet ordre explique pourquoi une clé mutée reste introuvable (étape 2 change) et pourquoi un `equals` manquant crée des doublons (étape 3 échoue).",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Immuabilité et vues
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-col-l3",
  title: "Immuable, vue ou copie : List.of, unmodifiableList, copyOf",
  blocks: [
    {
      kind: "text",
      text: "Depuis Java 9, `List.of`, `Set.of` et `Map.of` créent des collections **immuables** : toute modification lève `UnsupportedOperationException`, et `null` est **interdit** (`NullPointerException` à la création). `Set.of` et `Map.of` refusent aussi les doublons (`IllegalArgumentException`). Leur ordre d'itération n'est pas garanti et varie même d'une exécution à l'autre : ne jamais s'y fier. Au-delà de dix paires, `Map.ofEntries(Map.entry(k, v), ...)` évite la liste plate d'arguments.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois comportements différents pour trois besoins.",
      code: `List<String> a = List.of("x", "y");
a.add("z");            // UnsupportedOperationException
List.of("x", null);    // NullPointerException

List<String> src = new ArrayList<>(List.of("x"));
List<String> view = Collections.unmodifiableList(src);
List<String> copy = List.copyOf(src);
src.add("y");
view.size();           // 2 : vue sur src
copy.size();           // 1 : copie indépendante

String[] arr = {"a", "b"};
List<String> fixed = Arrays.asList(arr);
fixed.set(0, "z");     // OK : arr[0] vaut "z"
fixed.add("c");        // UnsupportedOperationException`,
    },
    {
      kind: "text",
      text: "`Collections.unmodifiableList(src)` ne copie rien : c'est une **vue** en lecture seule, qui reflète les modifications faites sur `src`. `List.copyOf(src)` produit une **copie** immuable, indépendante de la source (et renvoie la même instance si la source est déjà immuable).",
    },
    {
      kind: "text",
      text: "`Arrays.asList(tableau)` est une vue de **taille fixe** sur le tableau : `set` fonctionne et écrit dans le tableau, `add` et `remove` échouent. Elle accepte `null`. Pour une liste vraiment modifiable, l'envelopper : `new ArrayList<>(Arrays.asList(...))`. Même piège avec `stream().toList()` (Java 16), qui renvoie une liste non modifiable, contrairement à `collect(Collectors.toList())`.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "Une classe ne doit jamais exposer sa liste interne mutable. Getter : `List.copyOf(items)` ou `Collections.unmodifiableList(items)`. Constructeur : copie défensive de ce que l'appelant fournit.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "java-col-17",
    difficulty: 2,
    tags: ["immuabilite", "list"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<String> src = new ArrayList<>(List.of("a"));
List<String> view = Collections.unmodifiableList(src);
List<String> copy = List.copyOf(src);
src.add("b");
System.out.println(view.size() + " " + copy.size());`,
    },
    choices: ["`2 1`", "`1 1`", "`2 2`", "`UnsupportedOperationException`"],
    answer: 0,
    explanation:
      "`unmodifiableList` renvoie une vue : elle interdit les modifications **à travers elle**, mais voit celles faites sur `src`, d'où 2. `List.copyOf` a copié le contenu au moment de l'appel : 1. Aucune des deux n'est modifiée directement, donc pas d'exception.",
  },
  {
    kind: "output",
    id: "java-col-18",
    difficulty: 2,
    tags: ["list", "immuabilite"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `String[] arr = {"a", "b"};
List<String> l = Arrays.asList(arr);
l.set(0, "z");
System.out.println(arr[0] + l.size());
l.add("c");`,
    },
    choices: [
      "Affiche `z2`, puis `UnsupportedOperationException`.",
      "Affiche `a2`, puis `UnsupportedOperationException`.",
      "Affiche `z3`.",
      "`UnsupportedOperationException` dès `set`.",
    ],
    answer: 0,
    explanation:
      "`Arrays.asList` est une vue sur le tableau : `set` écrit dans `arr`, donc `arr[0]` vaut `z`, et la taille reste 2. La taille est fixe : `add` lève `UnsupportedOperationException`. Ce n'est donc ni une liste immuable (set passe) ni une liste modifiable (add échoue).",
  },
  {
    kind: "mcq",
    id: "java-col-19",
    difficulty: 2,
    tags: ["immuabilite", "null"],
    prompt: "Que fait `List.of(\"a\", null)` ?",
    choices: [
      "Lève une `NullPointerException` : les collections `of` refusent `null`.",
      "Crée `[a, null]`.",
      "Crée `[a]` en ignorant le `null`.",
      "Erreur de compilation : `null` n'a pas de type.",
    ],
    answer: 0,
    explanation:
      "Les fabriques `List.of`, `Set.of`, `Map.of` rejettent `null` à la construction, pour éviter les `null` silencieux et permettre des implémentations compactes. `contains(null)` lève aussi une `NullPointerException` sur ces listes. `Arrays.asList` et `ArrayList` acceptent `null`.",
  },
  {
    kind: "spot",
    id: "java-col-20",
    difficulty: 2,
    tags: ["immuabilite", "conception"],
    prompt: "Des appelants modifient les lignes de commande sans passer par `add()`. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public class Order {
    private final List<Line> lines = new ArrayList<>();
    public void add(Line l) { lines.add(l); }
    public List<Line> lines() { return lines; }
}`,
    },
    faultyLine: 4,
    reasons: [
      "Le getter expose la liste interne mutable : renvoyer `List.copyOf(lines)` ou `Collections.unmodifiableList(lines)`.",
      "`lines` devrait être `static` pour être partagée correctement.",
      "`add` doit renvoyer `boolean` comme `List.add`.",
      "`final` ne suffit pas : il faut aussi rendre `add` `private`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`final` fige la référence, pas le contenu : quiconque reçoit `lines()` peut faire `.add(...)` ou `.clear()` et contourner les règles de `Order`. Une vue non modifiable ou une copie immuable rend l'invariant à la classe. Idem dans l'autre sens : un constructeur qui reçoit une liste doit la copier.",
  },
  {
    kind: "fill",
    id: "java-col-21",
    difficulty: 1,
    tags: ["immuabilite", "collections"],
    prompt: "Complète avec les fabriques de collections immuables.",
    code: {
      language: "java",
      code: `public List<Line> lines() {
    return List.{{1}}(lines);   // copie immuable
}
Map<String, Integer> empty = Map.{{2}}();
List<String> two = List.{{3}}("a", "b");`,
    },
    blanks: ["copyOf", "of", "of"],
    distractors: ["from", "copy", "asList", "unmodifiable"],
    explanation:
      "`List.copyOf(collection)` copie en immuable ; `Map.of()` sans argument est la map vide immuable ; `List.of(...)` prend des éléments. `asList` est sur `Arrays`, pas sur `List` ; `from`, `copy` et `unmodifiable` n'existent pas comme fabriques statiques.",
  },
  {
    kind: "recall",
    id: "java-col-22",
    difficulty: 2,
    tags: ["immuabilite", "collections"],
    prompt: "Différences entre `Collections.unmodifiableList(src)`, `List.copyOf(src)` et `List.of(...)` ?",
    explanation:
      "**`unmodifiableList(src)`** : une **vue** en lecture seule sur `src`. Aucune copie ; les modifications de `src` restent visibles ; les appels modifiants sur la vue lèvent `UnsupportedOperationException`. Utile pour exposer sans copier une liste qu'on continue de modifier en interne. **`List.copyOf(src)`** : une **copie** immuable, détachée de `src`, refuse `null` ; renvoie la source elle-même si elle est déjà une liste immuable. **`List.of(...)`** : construit une liste immuable à partir d'éléments, refuse `null`. Dans les trois cas, l'immuabilité ne porte que sur la liste : les éléments restent ce qu'ils sont.",
    keyPoints: ["`unmodifiableList` : vue, suit la source", "`copyOf` : copie détachée, pas de `null`", "`of` : à partir d'éléments, pas de `null`", "Éléments jamais rendus immuables"],
  },
  {
    kind: "mcq",
    id: "java-col-23",
    difficulty: 2,
    tags: ["immuabilite", "conception"],
    prompt: "Un constructeur reçoit une `List<String> tags` et la range dans un champ `final`. Quel risque, quelle parade ?",
    choices: [
      "L'appelant garde une référence et peut modifier la liste après coup : copie défensive avec `this.tags = List.copyOf(tags)`.",
      "Aucun : `final` empêche toute modification de la liste.",
      "Une `NullPointerException` si `tags` est vide : envelopper dans un `Optional`.",
      "Un problème de concurrence : synchroniser la liste.",
    ],
    answer: 0,
    explanation:
      "Stocker la référence reçue lie l'objet à une liste que quelqu'un d'autre contrôle : `tags.clear()` chez l'appelant vide l'objet. `List.copyOf` coupe ce lien et rend le contenu immuable. Une liste vide n'est pas `null`, et la concurrence est un autre sujet.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Itérer et modifier
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-col-l4",
  title: "Itérer et modifier sans ConcurrentModificationException",
  blocks: [
    {
      kind: "text",
      text: "Un for-each utilise un `Iterator`. Les collections standard sont **fail-fast** : elles comptent leurs modifications structurelles (`modCount`), et l'itérateur lève `ConcurrentModificationException` au prochain `next()` s'il constate un ajout ou une suppression faits en dehors de lui. Modifier une valeur (`set`, `entry.setValue`) n'est pas structurel et passe.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une façon de planter, trois façons sûres.",
      code: `List<String> names =
    new ArrayList<>(List.of("a", "b", "c"));

for (String n : names) {
    if (n.equals("b")) names.remove(n);
}   // ConcurrentModificationException au next()

Iterator<String> it = names.iterator();
while (it.hasNext()) {
    if (it.next().equals("b")) it.remove();  // OK
}

names.removeIf(n -> n.equals("b"));          // OK

for (Map.Entry<String, Integer> e : m.entrySet()) {
    e.setValue(e.getValue() + 1);   // pas structurel
}
m.entrySet().removeIf(e -> e.getValue() == 0);`,
    },
    {
      kind: "text",
      text: "Pour retirer pendant un parcours : `Iterator.remove()`, `removeIf(prédicat)`, ou construire une nouvelle liste avec un stream `filter`. Pour une `Map`, itérer sur `entrySet()` et utiliser `entrySet().removeIf`. Une boucle par index à rebours fonctionne aussi, mais est moins lisible.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Le fail-fast est **best-effort**, pas une garantie : supprimer l'avant-dernier élément dans un for-each ne lève rien, car `hasNext()` renvoie `false` juste après. Le code semble marcher, puis plante sur d'autres données.",
    },
    {
      kind: "text",
      text: "En multi-thread, le fail-fast n'est pas une protection : c'est un détecteur de bug, sans garantie. Un thread qui modifie pendant qu'un autre parcourt peut aussi lire un état incohérent sans jamais lever d'exception. Les vraies réponses sont `ConcurrentHashMap`, `CopyOnWriteArrayList` (coûteuse en écriture, idéale en lecture dominante) ou une synchronisation explicite sur toute la durée du parcours.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "java-col-24",
    difficulty: 2,
    tags: ["iteration", "collections", "autoboxing"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `List<Integer> l = new ArrayList<>(List.of(1, 2, 3));
for (Integer i : l) {
    if (i == 1) l.remove(i);
}
System.out.println(l);`,
    },
    choices: ["`ConcurrentModificationException`", "`[2, 3]`", "`[1, 3]`", "`IndexOutOfBoundsException`"],
    answer: 0,
    explanation:
      "`i` est un `Integer` : `remove(Object)` retire la valeur 1 à la première itération, ce qui modifie `modCount`. La liste a encore deux éléments, donc `hasNext()` est vrai, et `next()` détecte la modification : `ConcurrentModificationException`. Solution : `l.removeIf(i -> i == 1)`.",
  },
  {
    kind: "output",
    id: "java-col-25",
    difficulty: 3,
    tags: ["iteration", "collections"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `List<String> l = new ArrayList<>(List.of("a", "b", "c"));
for (String s : l) {
    if (s.equals("b")) l.remove(s);
}
System.out.println(l);`,
    },
    choices: [
      "Affiche `[a, c]` sans exception : après la suppression, `hasNext()` renvoie `false` et la boucle s'arrête.",
      "`ConcurrentModificationException`.",
      "Affiche `[a, c]` : supprimer pendant un for-each est sûr.",
      "Affiche `[a, b, c]` : la suppression est ignorée.",
    ],
    answer: 0,
    explanation:
      "Après avoir retiré `\"b\"` (index 1), la liste a 2 éléments et le curseur de l'itérateur vaut 2 : `hasNext()` compare `cursor != size` → `false`, donc `next()` n'est jamais rappelé et la vérification de `modCount` n'a pas lieu. Le code « marche » par accident : avec `\"a\"` ou `\"c\"`, il lèverait. C'est le sens de « fail-fast best-effort ».",
  },
  {
    kind: "spot",
    id: "java-col-26",
    difficulty: 2,
    tags: ["iteration", "hashmap"],
    prompt: "Ce nettoyage lève une `ConcurrentModificationException`. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `for (String key : cache.keySet()) {
    if (isExpired(cache.get(key))) {
        cache.remove(key);
    }
}`,
    },
    faultyLine: 3,
    reasons: [
      "`remove` sur la map pendant l'itération de `keySet()` est une modification structurelle : utiliser `cache.entrySet().removeIf(...)` ou un `Iterator`.",
      "`keySet()` renvoie une copie : la suppression n'a aucun effet.",
      "`get` pendant une itération est interdit.",
      "Il faut itérer sur `values()` plutôt que `keySet()`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`keySet()` est une vue sur la map, pas une copie : `cache.remove(key)` modifie la structure sous l'itérateur. Réécriture : `cache.entrySet().removeIf(e -> isExpired(e.getValue()))`, qui évite aussi le `get` redondant. `get` est une lecture, sans effet sur `modCount`.",
  },
  {
    kind: "fill",
    id: "java-col-27",
    difficulty: 1,
    tags: ["iteration"],
    prompt: "Complète le parcours avec suppression sûre.",
    code: {
      language: "java",
      code: `Iterator<Order> it = orders.{{1}}();
while (it.{{2}}()) {
    if (it.{{3}}().isCancelled()) it.{{4}}();
}`,
    },
    blanks: ["iterator", "hasNext", "next", "remove"],
    distractors: ["stream", "hasMore", "get", "delete"],
    explanation:
      "Le protocole `Iterator` : `hasNext()` puis `next()`, et `remove()` retire le **dernier élément renvoyé par `next()`**, en tenant `modCount` à jour. Appeler `remove()` deux fois sans `next()` entre les deux lève `IllegalStateException`. `removeIf` fait exactement cela en une ligne.",
  },
  {
    kind: "mcq",
    id: "java-col-28",
    difficulty: 2,
    tags: ["iteration", "collections"],
    prompt: "Que signifie « fail-fast » pour l'itérateur d'une `ArrayList` ?",
    choices: [
      "Il détecte une modification structurelle faite en dehors de lui (`modCount`) et lève `ConcurrentModificationException` au prochain `next()`, au mieux ; ce n'est pas une garantie de thread-safety.",
      "La liste refuse toute modification pendant une itération, avec une exception immédiate.",
      "La liste est synchronisée : la modification attend la fin de l'itération.",
      "Les modifications sont mises en attente et appliquées après l'itération.",
    ],
    answer: 0,
    explanation:
      "Le mécanisme est une simple comparaison de compteurs, faite dans `next()`. Il rate les cas où `next()` n'est plus appelé, et il n'est pas fiable en présence de plusieurs threads (le compteur n'est pas volatile). Il sert à révéler des bugs, pas à les empêcher. Pour du concurrent, `CopyOnWriteArrayList` ou `ConcurrentHashMap`.",
  },
  {
    kind: "match",
    id: "java-col-29",
    difficulty: 2,
    tags: ["iteration", "collections"],
    prompt: "Associe chaque situation à la bonne réponse.",
    pairs: [
      { left: "Supprimer des éléments en parcourant", right: "`Iterator.remove()` ou `removeIf`" },
      { left: "Changer la valeur d'une entrée de `Map` en parcourant", right: "`entry.setValue(...)` : pas structurel, autorisé" },
      { left: "Remplacer un élément par index en parcourant", right: "`list.set(i, x)` : pas structurel, autorisé" },
      { left: "Ajouter à la liste dans un for-each", right: "`ConcurrentModificationException`" },
      { left: "Lectures et écritures depuis plusieurs threads", right: "`ConcurrentHashMap` / `CopyOnWriteArrayList`" },
    ],
    explanation:
      "La ligne de partage : **structurel** (ajout, suppression, changement de taille) contre **non structurel** (remplacer une valeur existante). Le premier passe par l'itérateur ou par `removeIf` ; le second est libre. Le multi-thread est un autre problème, réglé par des collections concurrentes.",
  },
  {
    kind: "recall",
    id: "java-col-30",
    difficulty: 2,
    tags: ["iteration", "collections"],
    prompt: "Trois façons sûres de retirer des éléments d'une `List` pendant qu'on la parcourt, avec leurs avantages.",
    explanation:
      "1. **`removeIf(prédicat)`** : une ligne, lisible, optimisée en interne (`ArrayList` compacte en un seul passage). À privilégier. 2. **`Iterator` explicite** avec `it.remove()` : nécessaire quand la décision dépend d'un état accumulé pendant le parcours ou quand on veut aussi faire autre chose sur chaque élément. 3. **Stream `filter` vers une nouvelle liste** : `list.stream().filter(...).toList()`, quand on veut garder l'originale intacte ou enchaîner d'autres transformations. Variante moins lisible : boucle par index **à rebours** (`for (int i = size-1; i >= 0; i--)`), qui évite le décalage des index. Interdit : `list.remove(...)` dans un for-each.",
    keyPoints: ["`removeIf` : le réflexe", "`Iterator.remove()` : parcours avec état", "Stream `filter` : nouvelle liste", "Index à rebours possible, for-each interdit"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-collections",
  title: "Collections : List, Set, Map, HashMap interne",
  objective:
    "Choisir la bonne structure, expliquer le fonctionnement interne de HashMap, manier les collections immuables et modifier une collection sans ConcurrentModificationException.",
  prerequisites: ["java-equals-hashcode-comparable"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
