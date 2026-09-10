/**
 * Java — Fondamentaux (référentiel 1.1) : primitifs et wrappers, String,
 * passage par valeur, final, portée et initialisation statique.
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Primitifs, wrappers et autoboxing
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-fond-l1",
  title: "Primitifs, wrappers et les pièges de l'autoboxing",
  blocks: [
    {
      kind: "text",
      text: "Java a huit types **primitifs** (`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`) qui stockent une valeur et ne peuvent jamais être `null`. À chacun correspond un **wrapper** (`Integer`, `Long`, `Double`…) : un vrai objet, qui peut être `null` et que les génériques exigent, puisqu'une `List<int>` n'existe pas.",
    },
    {
      kind: "text",
      text: "L'**autoboxing** convertit automatiquement dans les deux sens : `Integer i = 5` appelle `Integer.valueOf(5)`, `int n = i` appelle `i.intValue()`. Cette commodité cache trois pièges.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les trois pièges : ==, unboxing de null, surcharge.",
      code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);       // true  : cache -128..127
System.out.println(c == d);       // false : deux objets distincts
System.out.println(c.equals(d));  // true  : comparer la valeur

Integer count = null;
int n = count;                    // NullPointerException

List<Integer> nums =
    new ArrayList<>(List.of(10, 20, 30));
nums.remove(1);                   // remove(int) : l'INDEX 1
                                  // → [10, 30]
nums.remove(Integer.valueOf(30)); // remove(Object) : la VALEUR
                                  // → [10]`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`==` entre deux wrappers compare les **références**. `Integer.valueOf` met en cache les valeurs de -128 à 127 (par défaut), d'où l'illusion que ça marche sur les petits nombres. Toujours `equals`, ou `Objects.equals` si l'un peut être `null`.",
    },
    {
      kind: "text",
      text: "Dernier point : un wrapper dans une boucle chaude coûte cher. `Long sum = 0L; sum += i;` crée un nouvel objet à chaque itération. Un primitif ne coûte rien. Règle : primitif par défaut, wrapper seulement quand `null` a un sens ou qu'un générique l'impose.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "java-fond-01",
    difficulty: 2,
    tags: ["autoboxing", "wrappers", "egalite"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println((a == b) + " " + (c == d));`,
    },
    choices: ["`true false`", "`true true`", "`false false`", "Erreur de compilation : `==` est interdit entre deux `Integer`."],
    answer: 0,
    explanation:
      "`Integer a = 127` passe par `Integer.valueOf(127)`, qui renvoie un objet mis en cache pour les valeurs de -128 à 127 : `a` et `b` sont la même référence, donc `true`. Pour 128, deux objets distincts sont créés : `false`. `==` compile toujours entre objets, c'est bien le problème. Comparer avec `equals`.",
  },
  {
    kind: "mcq",
    id: "java-fond-02",
    difficulty: 1,
    tags: ["wrappers", "egalite"],
    prompt: "Deux variables `Integer a` et `Integer b`. Quelle comparaison est correcte ?",
    choices: [
      "`a.equals(b)`, ou `Objects.equals(a, b)` si l'une des deux peut être `null`.",
      "`a == b` : l'autoboxing compare les valeurs.",
      "`a == b`, fiable tant que les valeurs tiennent dans un `int`.",
      "`a.compareTo(b)`, qui renvoie `true` si les valeurs sont égales.",
    ],
    answer: 0,
    explanation:
      "`==` compare les références, et ne semble marcher que grâce au cache -128..127. `compareTo` renvoie un `int` (négatif, zéro ou positif), pas un booléen. `Objects.equals(a, b)` gère le cas `null` sans `NullPointerException`.",
  },
  {
    kind: "output",
    id: "java-fond-03",
    difficulty: 2,
    tags: ["autoboxing", "wrappers", "null"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `Map<String, Integer> stock = new HashMap<>();
int qty = stock.get("pomme");
System.out.println(qty);`,
    },
    choices: ["`NullPointerException`", "`0`", "Erreur de compilation : impossible d'affecter un `Integer` à un `int`.", "`null`"],
    answer: 0,
    explanation:
      "`stock.get(\"pomme\")` renvoie `null` (clé absente). L'affectation à un `int` déclenche un unboxing, c'est-à-dire `null.intValue()` : `NullPointerException`. Le compilateur accepte car `Integer` → `int` est une conversion automatique. Parade : `stock.getOrDefault(\"pomme\", 0)` ou garder un `Integer` et tester `null`.",
  },
  {
    kind: "output",
    id: "java-fond-04",
    difficulty: 3,
    tags: ["autoboxing", "surcharge-vs-redefinition", "collections"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<Integer> nums =
    new ArrayList<>(List.of(10, 20, 30));
nums.remove(1);
nums.remove(Integer.valueOf(10));
System.out.println(nums);`,
    },
    choices: ["`[30]`", "`[20, 30]`", "`IndexOutOfBoundsException`", "`[10, 30]`"],
    answer: 0,
    explanation:
      "`List` a deux surcharges : `remove(int index)` et `remove(Object o)`. Avec un `int` littéral, le compilateur choisit `remove(int)` sans boxing : l'élément d'index 1 (20) est retiré, reste `[10, 30]`. `Integer.valueOf(10)` est un objet : `remove(Object)` retire la valeur 10. Reste `[30]`. La surcharge est résolue sur le type statique, et un primitif exact gagne sur le boxing.",
  },
  {
    kind: "mcq",
    id: "java-fond-05",
    difficulty: 2,
    tags: ["wrappers", "generiques"],
    prompt: "Pourquoi écrit-on `Map<String, Integer>` et jamais `Map<String, int>` ?",
    choices: [
      "Les génériques n'acceptent que des types référence : après effacement de type, `V` devient `Object`, ce qu'un `int` ne peut pas être.",
      "`int` n'a pas de méthode `hashCode`, indispensable à une `Map`.",
      "Les primitifs vivent sur la pile et une `Map` ne stocke que des objets du tas.",
      "C'est possible depuis Java 10 grâce à `var`.",
    ],
    answer: 0,
    explanation:
      "Les paramètres de type sont effacés à la compilation et remplacés par `Object` (ou leur borne). Un `int` n'est pas un `Object`, il faut donc son wrapper. `hashCode` et la pile ne sont pas la cause : `HashMap` calcule le hash sur la clé, pas sur la valeur. Le projet Valhalla travaille sur des génériques spécialisés, mais ce n'est pas dans Java 21.",
  },
  {
    kind: "spot",
    id: "java-fond-06",
    difficulty: 2,
    tags: ["autoboxing", "wrappers", "performance"],
    prompt: "Cette méthode est correcte mais anormalement lente. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public static long sumTo(int n) {
    Long sum = 0L;
    for (int i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
}`,
    },
    faultyLine: 2,
    reasons: [
      "`sum` est un wrapper : chaque `+=` déballe, additionne et crée un nouveau `Long`. Un `long` primitif suffit.",
      "`Long` n'accepte pas l'opérateur `+=` : il faut écrire `sum = Long.valueOf(sum + i)`.",
      "`i` est un `int` : il faut le caster en `long` avant l'addition.",
      "La boucle doit utiliser un `Iterator` pour éviter la copie.",
    ],
    reasonAnswer: 0,
    explanation:
      "Exemple classique d'Effective Java : avec `Long sum`, chaque itération fait un unboxing, une addition, puis un boxing qui alloue un objet (hors cache au-delà de 127). Sur des millions d'itérations, c'est un facteur 10 et une pression sur le GC. `long sum = 0L;` corrige tout. Le `+=` compile très bien sur un wrapper, c'est justement le problème.",
  },
  {
    kind: "match",
    id: "java-fond-07",
    difficulty: 1,
    tags: ["primitifs", "wrappers", "initialisation"],
    prompt: "Associe chaque type de **champ** à sa valeur par défaut quand il n'est pas initialisé.",
    pairs: [
      { left: "`int`", right: "`0`" },
      { left: "`double`", right: "`0.0`" },
      { left: "`boolean`", right: "`false`" },
      { left: "`char`", right: "`'\\u0000'`" },
      { left: "`Integer`", right: "`null`" },
    ],
    explanation:
      "Un champ non initialisé reçoit la valeur par défaut de son type : zéro pour les numériques, `false` pour `boolean`, le caractère nul pour `char`, `null` pour toute référence, wrappers compris. Attention : cela ne vaut que pour les champs. Une variable locale doit être affectée avant lecture, sinon erreur de compilation.",
  },
  {
    kind: "recall",
    id: "java-fond-08",
    difficulty: 2,
    tags: ["autoboxing", "wrappers", "egalite"],
    prompt: "Explique le cache des `Integer` et pourquoi `==` entre deux `Integer` est un piège.",
    explanation:
      "L'autoboxing appelle `Integer.valueOf(int)`, qui renvoie une instance **mise en cache** pour les valeurs de **-128 à 127** (borne haute configurable par `-XX:AutoBoxCacheMax`). Deux `Integer` de petite valeur sont donc souvent la même référence et `==` renvoie `true`. Au-delà, `valueOf` crée un nouvel objet et `==` renvoie `false` pour des valeurs égales. Le code semble marcher en test avec des petits nombres et casse en production. `==` compare les références ; pour la valeur, `equals` ou `Objects.equals`. Même mécanisme pour `Long`, `Short`, `Byte`, `Character` (0..127) et `Boolean` ; jamais pour `Double` et `Float`.",
    keyPoints: ["`valueOf` cache -128..127", "`==` compare les références", "Marche en test, casse en prod", "`equals` / `Objects.equals`"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — String : immuable, pool et StringBuilder
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-fond-l2",
  title: "String : immuable, pool de constantes et StringBuilder",
  blocks: [
    {
      kind: "text",
      text: "Une `String` est **immuable** : aucune méthode ne la modifie, toutes renvoient une nouvelle chaîne. `s.toUpperCase()` sans réaffectation ne fait rien. Cette immuabilité permet de partager les chaînes sans risque, de mettre en cache leur `hashCode`, et d'en faire des clés de `Map` sûres.",
    },
    {
      kind: "text",
      text: "Les littéraux vivent dans le **pool de constantes** : deux `\"java\"` dans le code désignent le même objet. Une expression constante comme `\"ja\" + \"va\"` est pliée à la compilation et rejoint le pool. Mais `new String(...)` ou une concaténation calculée à l'exécution créent un objet hors pool.",
    },
    {
      kind: "code",
      language: "java",
      caption: "== compare les références : seul equals compare le contenu.",
      code: `String a = "java";
String b = "java";
String c = new String("java");
String d = "ja" + "va";                // constante pliée
String e = a.substring(0, 2) + "va";   // calculée à l'exécution

a == b        // true  : même littéral, même objet du pool
a == c        // false : new crée un objet hors pool
a == d        // true  : "ja" + "va" est une constante
a == e        // false : concaténation à l'exécution
a.equals(e)   // true  : toujours comparer ainsi

String s = "abc";
s.toUpperCase();        // résultat perdu, s vaut "abc"
s = s.toUpperCase();    // "ABC"

StringBuilder sb = new StringBuilder();
for (String w : words) sb.append(w).append(' ');
String joined = sb.toString();`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Comparer deux chaînes avec `==` marche parfois (pool), puis casse dès qu'une valeur vient d'un fichier, d'une requête ou d'un `substring`. Toujours `equals`, et de préférence `\"constante\".equals(variable)`, qui ne lève pas de `NullPointerException`.",
    },
    {
      kind: "text",
      text: "Concaténer dans une boucle avec `+=` recopie la chaîne entière à chaque tour : coût quadratique. `StringBuilder` accumule dans un tampon modifiable, puis `toString()` produit la chaîne finale. Pour joindre une collection, `String.join` ou `Collectors.joining` font le travail.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "java-fond-09",
    difficulty: 2,
    tags: ["string", "string-pool", "egalite"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String a = "hello";
String b = "hel" + "lo";
String c = new String("hello");
System.out.println(
    (a == b) + " " + (a == c) + " " + a.equals(c));`,
    },
    choices: ["`true false true`", "`true true true`", "`false false true`", "`false false false`"],
    answer: 0,
    explanation:
      "`\"hel\" + \"lo\"` est une expression constante : le compilateur la remplace par `\"hello\"`, qui est le même objet du pool que `a`, d'où `true`. `new String(\"hello\")` crée toujours un nouvel objet hors pool : `a == c` est `false`. `equals` compare le contenu : `true`.",
  },
  {
    kind: "output",
    id: "java-fond-10",
    difficulty: 1,
    tags: ["string", "immuabilite"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String s = "abc";
s.concat("def");
s.toUpperCase();
System.out.println(s);`,
    },
    choices: ["`abc`", "`abcdef`", "`ABCDEF`", "`ABC`"],
    answer: 0,
    explanation:
      "`concat` et `toUpperCase` renvoient chacune une **nouvelle** chaîne, ignorée ici. `s` désigne toujours `\"abc\"`. Pour obtenir `ABCDEF`, il faut réaffecter : `s = s.concat(\"def\").toUpperCase()`. Un IDE signale d'ailleurs « result of String.concat is ignored ».",
  },
  {
    kind: "spot",
    id: "java-fond-11",
    difficulty: 2,
    tags: ["string", "immuabilite", "performance"],
    prompt: "Cette méthode est correcte mais très lente sur une grande liste. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public String join(List<String> parts) {
    String out = "";
    for (String p : parts) {
        out += p + ",";
    }
    return out;
}`,
    },
    faultyLine: 4,
    reasons: [
      "Chaque `+=` crée une nouvelle `String` en recopiant tout ce qui précède : coût quadratique. Utiliser `StringBuilder` ou `String.join`.",
      "`String` est immuable : `+=` ne compile pas sur une `String`.",
      "`out` doit être déclarée `final` pour être modifiée dans la boucle.",
      "Il faut utiliser `out.concat(p)`, qui modifie la chaîne en place.",
    ],
    reasonAnswer: 0,
    explanation:
      "`out += ...` compile et fonctionne : il crée une nouvelle chaîne à chaque tour, en copiant tout le contenu accumulé. Sur n éléments, c'est O(n²) en copies. `StringBuilder` amortit avec un tampon extensible ; `String.join(\",\", parts)` ou `parts.stream().collect(Collectors.joining(\",\"))` sont encore plus simples. `concat` renvoie aussi une nouvelle chaîne, il ne modifie rien en place.",
  },
  {
    kind: "mcq",
    id: "java-fond-12",
    difficulty: 1,
    tags: ["string", "egalite", "null"],
    prompt: "Quelle différence entre `s.equals(\"ok\")` et `\"ok\".equals(s)` ?",
    choices: [
      "`\"ok\".equals(s)` renvoie simplement `false` si `s` est `null`, là où `s.equals(\"ok\")` lève une `NullPointerException`.",
      "Aucune : les deux formes sont strictement équivalentes.",
      "`s.equals(\"ok\")` est plus rapide, car `s` est déjà chargée en mémoire.",
      "`\"ok\".equals(s)` compare les références, pas le contenu.",
    ],
    answer: 0,
    explanation:
      "Appeler une méthode sur `null` lève une `NullPointerException`. En plaçant la constante à gauche, le récepteur n'est jamais `null` et `equals(null)` renvoie `false` par contrat. Le contenu est comparé dans les deux cas. Alternative lisible : `Objects.equals(s, \"ok\")`.",
  },
  {
    kind: "fill",
    id: "java-fond-13",
    difficulty: 1,
    tags: ["string", "immuabilite", "stringbuilder"],
    prompt: "Complète pour obtenir `AVAJ` dans `r`.",
    code: {
      language: "java",
      code: `String s = "java";
s = s.{{1}}();                  // "JAVA" : réaffecter,
                                // String est immuable
StringBuilder sb = new StringBuilder(s);
sb.{{2}}();                     // "AVAJ" : modifié en place
String r = sb.{{3}}();`,
    },
    blanks: ["toUpperCase", "reverse", "toString"],
    distractors: ["upper", "build", "append", "intern"],
    explanation:
      "`toUpperCase()` renvoie une nouvelle chaîne qu'il faut réaffecter. `StringBuilder` est mutable : `reverse()` modifie le tampon lui-même. `toString()` produit la `String` finale. `String` n'a pas de `reverse`, et `StringBuilder` n'a pas de `build`.",
  },
  {
    kind: "recall",
    id: "java-fond-14",
    difficulty: 2,
    tags: ["string", "string-pool", "egalite"],
    prompt: "Qu'est-ce que le pool de chaînes ? Quand deux chaînes de même contenu sont-elles le même objet, et quand ne le sont-elles pas ?",
    explanation:
      "Le **pool de constantes** est une zone où la JVM conserve une instance unique de chaque littéral `String`. Deux littéraux identiques dans le code désignent le **même objet**, ainsi que toute **expression constante** pliée à la compilation (`\"ja\" + \"va\"`, `final String` constantes). Ne sont **pas** dans le pool : `new String(...)`, le résultat d'une concaténation à l'exécution, `substring`, une lecture de fichier ou de requête. `intern()` force l'entrée dans le pool. Conclusion : `==` entre chaînes est imprévisible, `equals` est la seule comparaison de contenu.",
    keyPoints: ["Littéraux et expressions constantes : même objet", "`new String`, concaténation à l'exécution, entrées : objets distincts", "`intern()` force le pool", "Toujours `equals`"],
  },
  {
    kind: "output",
    id: "java-fond-15",
    difficulty: 3,
    tags: ["string", "immuabilite", "passage-par-valeur"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String s = "a";
String t = s;
s += "b";
System.out.println(s + " " + t + " " + (s == t));`,
    },
    choices: ["`ab a false`", "`ab ab true`", "`ab a true`", "`a a true`"],
    answer: 0,
    explanation:
      "`t = s` copie la référence : les deux variables désignent `\"a\"`. `s += \"b\"` ne modifie pas cet objet (impossible, il est immuable) : il crée `\"ab\"` et fait pointer `s` dessus. `t` désigne toujours `\"a\"`, et les deux références sont différentes : `false`.",
  },
  {
    kind: "recall",
    id: "java-fond-16",
    difficulty: 2,
    tags: ["string", "immuabilite", "conception"],
    prompt: "Pourquoi `String` est-elle immuable en Java ? Cite au moins trois bénéfices concrets.",
    explanation:
      "**Sécurité** : chemins de fichiers, noms de classes, URL et identifiants sont des `String` ; s'ils pouvaient changer après vérification, on pourrait contourner les contrôles. **Partage sans risque** : le pool de constantes et le passage de références entre méthodes ne posent aucun problème, personne ne peut modifier la chaîne sous vos pieds. **Thread-safety** gratuite. **`hashCode` mis en cache** : calculé une fois, ce qui rend `String` idéale comme clé de `HashMap` (une clé mutable casserait la table). Le prix : chaque transformation crée un objet, d'où `StringBuilder` pour les constructions en boucle.",
    keyPoints: ["Sécurité (chemins, classes, URL)", "Partage et pool sans risque", "Thread-safe", "`hashCode` en cache → clé de `Map` sûre", "Prix : `StringBuilder` en boucle"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Passage par valeur
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-fond-l3",
  title: "Java passe tout par valeur",
  blocks: [
    {
      kind: "text",
      text: "Java passe **toujours** les arguments par valeur. Pour un primitif, la méthode reçoit une copie de la valeur. Pour un objet, elle reçoit une copie de la **référence** : les deux variables désignent le même objet, mais ce sont deux variables.",
    },
    {
      kind: "text",
      text: "Deux conséquences à distinguer. Une **mutation** de l'objet (`p.setName(...)`, `list.add(...)`) est visible par l'appelant, puisque l'objet est partagé. Une **réaffectation** du paramètre (`p = new Person(...)`) ne change que la copie locale : l'appelant ne voit rien.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Mutation visible, réaffectation invisible.",
      code: `static void bump(int n) {
    n++;                          // copie : sans effet dehors
}
static void rename(Person p) {
    p.setName("Bob");             // mutation : visible
}
static void replace(Person p) {
    p = new Person("Eve");        // réaffectation : invisible
}
static void swap(Person a, Person b) {
    Person t = a; a = b; b = t;   // ne fait rien dehors
}

int x = 1;
bump(x);                          // x vaut toujours 1
Person p = new Person("Ana");
rename(p);                        // p.getName() → "Bob"
replace(p);                       // p.getName() → "Bob" encore`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "C'est pour cela qu'un `swap(a, b)` est impossible en Java, et qu'une méthode qui veut « renvoyer » un nouvel objet doit le **retourner**, à charge pour l'appelant de réaffecter. Les objets immuables (`String`, `Integer`) donnent l'impression d'être copiés : ils ne le sont pas, ils ne peuvent simplement pas être mutés.",
    },
    {
      kind: "text",
      text: "Formule à retenir pour l'entretien : « Java est pass-by-value ; pour les objets, la valeur passée est la référence. » Dire « les objets sont passés par référence » est faux, et un bon recruteur le relèvera.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "java-fond-17",
    difficulty: 2,
    tags: ["passage-par-valeur", "immuabilite"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `static void modify(int n, StringBuilder sb, String s) {
    n = n + 1;
    sb.append("!");
    s = s + "!";
}

int n = 1;
StringBuilder sb = new StringBuilder("hi");
String s = "hi";
modify(n, sb, s);
System.out.println(n + " " + sb + " " + s);`,
    },
    choices: ["`1 hi! hi`", "`2 hi! hi!`", "`1 hi hi`", "`1 hi! hi!`"],
    answer: 0,
    explanation:
      "`n` : copie de la valeur, l'incrément local est perdu → `1`. `sb` : copie de la référence, `append` **mute** l'objet partagé → `hi!`. `s` : `s + \"!\"` crée une nouvelle chaîne affectée à la copie locale, l'appelant garde `\"hi\"`. Trois paramètres, un seul effet visible : la mutation.",
  },
  {
    kind: "output",
    id: "java-fond-18",
    difficulty: 2,
    tags: ["passage-par-valeur", "tableaux"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `static void reset(int[] arr) { arr = new int[]{0, 0}; }
static void clear(int[] arr) { arr[0] = 0; }

int[] a = {5, 6};
reset(a);
System.out.print(a[0] + " ");
clear(a);
System.out.println(a[0]);`,
    },
    choices: ["`5 0`", "`0 0`", "`5 5`", "`0 5`"],
    answer: 0,
    explanation:
      "`reset` réaffecte son paramètre vers un nouveau tableau : la variable `a` de l'appelant n'en sait rien, `a[0]` vaut encore 5. `clear` écrit dans le tableau partagé : `a[0]` devient 0. Un tableau est un objet : même règle que pour n'importe quelle référence.",
  },
  {
    kind: "mcq",
    id: "java-fond-19",
    difficulty: 1,
    tags: ["passage-par-valeur"],
    prompt: "Java passe-t-il les objets par référence ?",
    choices: [
      "Non : la référence est copiée (passage par valeur). La méthode peut modifier l'objet, pas faire pointer la variable de l'appelant ailleurs.",
      "Oui pour les objets, non pour les primitifs.",
      "Oui, sauf `String` et les wrappers, qui sont copiés.",
      "Cela dépend : un paramètre déclaré `final` est passé par valeur, sinon par référence.",
    ],
    answer: 0,
    explanation:
      "Passer par référence signifierait que la méthode peut réaffecter la variable de l'appelant, ce qui est impossible en Java. `String` et les wrappers ne sont pas copiés : ils sont simplement immuables, d'où l'illusion. `final` sur un paramètre interdit sa réaffectation locale et ne change rien au mode de passage.",
  },
  {
    kind: "spot",
    id: "java-fond-20",
    difficulty: 2,
    tags: ["passage-par-valeur"],
    prompt: "`reset(c)` ne remet jamais le compteur à zéro. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public class Counter {
    private int value = 0;
    public void increment() { value++; }

    public static void reset(Counter c) {
        c = new Counter();
    }
}`,
    },
    faultyLine: 6,
    reasons: [
      "Réaffecter le paramètre ne change que la copie locale de la référence : l'appelant garde son `Counter` intact. Il faut muter (`c.value = 0`) ou retourner le nouvel objet.",
      "Il manque `this.` devant `c`.",
      "Un paramètre ne peut pas être réaffecté : il est implicitement `final`.",
      "`new Counter()` doit recevoir la valeur initiale en argument.",
    ],
    reasonAnswer: 0,
    explanation:
      "`c` est une copie de la référence de l'appelant. `c = new Counter()` fait pointer cette copie vers un nouvel objet, puis la méthode se termine et la copie disparaît. Correction : `c.value = 0;` (mutation de l'objet partagé), ou `return new Counter();` avec réaffectation côté appelant. Un paramètre n'est pas `final` par défaut, la réaffectation compile, elle est juste inutile.",
  },
  {
    kind: "recall",
    id: "java-fond-21",
    difficulty: 2,
    tags: ["passage-par-valeur"],
    prompt: "Java est-il « pass by value » ou « pass by reference » ? Donne un exemple où une méthode modifie ce que voit l'appelant, et un où elle ne le peut pas.",
    explanation:
      "**Pass by value, toujours.** Pour un objet, la valeur copiée est la référence. Exemple visible : `void rename(Person p) { p.setName(\"Bob\"); }`, l'appelant voit `Bob` car l'objet est partagé. Exemple invisible : `void replace(Person p) { p = new Person(\"Eve\"); }`, l'appelant garde son objet d'origine car seule la copie locale a été réaffectée. Corollaires : `swap` est impossible, et pour « modifier » un `String` ou un `Integer` (immuables), il faut retourner la nouvelle valeur.",
    keyPoints: ["Toujours par valeur ; pour un objet, la valeur est la référence", "Mutation → visible", "Réaffectation → invisible", "`swap` impossible, retourner la valeur"],
  },
  {
    kind: "mcq",
    id: "java-fond-22",
    difficulty: 2,
    tags: ["passage-par-valeur", "conception"],
    prompt: "Une méthode doit « renvoyer » deux résultats calculés. Quelle approche est correcte en Java ?",
    choices: [
      "Retourner un objet qui porte les deux (un `record`), ou muter un objet passé en paramètre.",
      "Déclarer les paramètres sans `final` : ils sont alors passés par référence.",
      "Utiliser des `Integer` plutôt que des `int` : les wrappers sont passés par référence.",
      "Passer les variables avec le préfixe `&`, comme en C.",
    ],
    answer: 0,
    explanation:
      "Un `record Result(int min, int max)` est la solution idiomatique. Muter un objet passé (une liste, un tableau) fonctionne aussi mais rend l'API moins lisible. Les wrappers sont immuables et passés par valeur comme tout le reste ; `final` n'influence pas le mode de passage ; `&` n'existe pas en Java.",
  },
  {
    kind: "fill",
    id: "java-fond-23",
    difficulty: 2,
    tags: ["passage-par-valeur", "collections"],
    prompt: "Complète pour que `names` finisse vide après les trois appels.",
    code: {
      language: "java",
      code: `static void fill(List<String> list, String item) {
    list.{{1}}(item);           // mutation : visible
}
static List<String> reset(List<String> list) {
    list = new {{2}}<>();       // réaffectation : invisible
    return list;                // donc on la retourne
}

List<String> names = new ArrayList<>();
fill(names, "Ana");
names = {{3}}(names);           // et on réaffecte`,
    },
    blanks: ["add", "ArrayList", "reset"],
    distractors: ["append", "List", "fill", "clear"],
    explanation:
      "`add` mute la liste partagée. Dans `reset`, `list = new ArrayList<>()` ne touche que la copie locale : sans `return` et réaffectation par l'appelant, `names` garderait `[Ana]`. `List` est une interface, on ne peut pas l'instancier. `fill(names)` ne compile pas (il manque un argument et elle ne retourne rien).",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — final, portée et initialisation statique
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-fond-l4",
  title: "final, portée et blocs static",
  blocks: [
    {
      kind: "text",
      text: "`final` a un sens par cible. Sur une **variable locale** ou un **paramètre** : une seule affectation, qui peut être différée. Sur un **champ** : affecté à la déclaration, dans un bloc d'initialisation, ou dans **chaque** constructeur, sinon le compilateur refuse. Sur une **méthode** : pas de redéfinition. Sur une **classe** : pas de sous-classe (`String`, les wrappers, les `record` et les `enum` sont `final`).",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`final` fige la **référence**, pas l'objet. Une `final List<String>` accepte `add` toute sa vie ; elle refuse seulement `= new ArrayList<>()`. Pour une liste immuable, `List.of` ou `List.copyOf`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Champ final différé, bloc static, capture par une lambda.",
      code: `public class Config {
    static final List<String> DEFAULTS;    // différé
    static {                               // à l'initialisation
        DEFAULTS = List.of("a", "b");      // de la classe
    }

    private final String name;             // chaque constructeur
    private final List<String> tags = new ArrayList<>();

    Config(String name) { this.name = name; }

    void addTag(String t) {
        tags.add(t);                // OK : la liste est mutable
        // tags = new ArrayList<>(); // erreur : champ final
    }

    Runnable printer(String prefix) {
        String sep = ": ";          // effectivement final
        return () -> System.out.println(prefix + sep + name);
    }
}`,
    },
    {
      kind: "text",
      text: "Une lambda ou une classe anonyme ne peut capturer qu'une variable locale `final` ou **effectivement final** (jamais réaffectée). `count++` dans un `forEach` ne compile pas : la lambda pourrait s'exécuter plus tard, sur un autre thread, alors que la variable locale n'existe plus.",
    },
    {
      kind: "text",
      text: "Les **blocs `static`** et les initialiseurs de champs `static` s'exécutent une seule fois, dans l'ordre du fichier, quand la classe est initialisée, c'est-à-dire à sa première utilisation réelle. La **portée** d'une variable est son bloc : déclarée dans un `for` ou un `if`, elle n'existe plus après l'accolade fermante.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "java-fond-24",
    difficulty: 2,
    tags: ["initialisation", "static"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Init {
    static { System.out.print("A"); }
    { System.out.print("B"); }
    Init() { System.out.print("C"); }
    static { System.out.print("D"); }
}

new Init();
new Init();`,
    },
    choices: ["`ADBCBC`", "`ABCDBC`", "`ADBCADBC`", "`ABCBC`"],
    answer: 0,
    explanation:
      "Les blocs `static` s'exécutent une seule fois, à l'initialisation de la classe, dans l'ordre du fichier : `A` puis `D`. Ensuite, pour chaque `new` : le bloc d'initialisation d'instance `B` (il est copié en tête de chaque constructeur), puis le corps du constructeur `C`. Deux instances : `BCBC`. Total `ADBCBC`.",
  },
  {
    kind: "spot",
    id: "java-fond-25",
    difficulty: 2,
    tags: ["final", "constructeurs", "initialisation"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public class User {
    private final String name;
    private final String email;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public User(String name) { this.name = name; }
}`,
    },
    faultyLine: 10,
    reasons: [
      "Un champ `final` doit être affecté par **chaque** constructeur : le second n'initialise pas `email` (« variable email might not have been initialized »).",
      "Un champ `final` doit obligatoirement être initialisé à sa déclaration.",
      "Deux constructeurs ne peuvent pas avoir un paramètre de même nom.",
      "Il manque l'appel `super()` en première ligne du second constructeur.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le compilateur vérifie qu'à la fin de chaque constructeur, tout champ `final` a reçu exactement une valeur. Le second constructeur laisse `email` non affecté. Corrections : `this.email = null;` explicitement, ou mieux, déléguer avec `this(name, null);`. L'initialisation à la déclaration n'est qu'une des trois options, et `super()` est implicite.",
  },
  {
    kind: "fill",
    id: "java-fond-26",
    difficulty: 2,
    tags: ["final", "static", "initialisation"],
    prompt: "Complète pour que la classe compile.",
    code: {
      language: "java",
      code: `public class Registry {
    private static final Map<String, Integer> CODES;

    {{1}} {
        CODES = new HashMap<>();
        CODES.put("OK", 200);
    }

    private final String name;

    public Registry(String name) {
        {{2}}.name = name;
    }
}`,
    },
    blanks: ["static", "this"],
    distractors: ["final", "public", "super", "Registry"],
    explanation:
      "`CODES` est un champ `static final` non initialisé à la déclaration : seul un bloc `static` peut l'affecter, une fois, à l'initialisation de la classe. Dans le constructeur, `this.name` distingue le champ du paramètre de même nom ; `Registry.name` ne compile pas (champ d'instance accédé de façon statique) et `super.name` chercherait un champ dans `Object`.",
  },
  {
    kind: "spot",
    id: "java-fond-27",
    difficulty: 2,
    tags: ["final", "lambdas", "portee"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `int count = 0;
List<String> names = List.of("a", "b");
names.forEach(n -> count++);
System.out.println(count);`,
    },
    faultyLine: 3,
    reasons: [
      "`count` est modifiée dans la lambda : une variable locale capturée doit être `final` ou effectivement final.",
      "`forEach` n'accepte pas de lambda ayant un effet de bord.",
      "`count` doit être déclarée après la liste pour être visible dans la lambda.",
      "Il faut écrire `count = count + 1` au lieu de `count++`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Message du compilateur : « local variables referenced from a lambda expression must be final or effectively final ». La lambda capture une **copie** de `count` ; l'incrémenter n'aurait aucun sens pour la variable d'origine, d'où l'interdiction. Solutions : `names.size()` ici, un `AtomicInteger`, ou une boucle `for` classique. `count = count + 1` est tout aussi refusé.",
  },
  {
    kind: "match",
    id: "java-fond-28",
    difficulty: 1,
    tags: ["final"],
    prompt: "Associe chaque cible de `final` à son effet.",
    pairs: [
      { left: "Variable locale", right: "Une seule affectation, éventuellement différée" },
      { left: "Champ", right: "Affecté une fois, au plus tard dans chaque constructeur" },
      { left: "Méthode", right: "Interdit la redéfinition" },
      { left: "Classe", right: "Interdit l'héritage" },
      { left: "Référence vers une liste", right: "Fige la référence, pas le contenu" },
    ],
    explanation:
      "Un même mot-clé, cinq effets. Le dernier est le plus trompeur : `final` ne rend jamais un objet immuable, il empêche seulement de réaffecter la variable. L'immuabilité d'une collection vient de son implémentation (`List.of`, `Collections.unmodifiableList`), pas de `final`.",
  },
  {
    kind: "recall",
    id: "java-fond-29",
    difficulty: 3,
    tags: ["final", "immuabilite", "collections"],
    prompt: "`private final List<String> items = new ArrayList<>();` : qu'est-ce que `final` garantit, qu'est-ce qu'il ne garantit pas, et comment obtenir une vraie liste immuable ?",
    explanation:
      "`final` garantit que le champ `items` désignera **toujours cette ArrayList** : `items = autreListe` est refusé, et le champ est correctement publié entre threads après construction. Il ne garantit **rien sur le contenu** : `items.add`, `remove`, `clear` fonctionnent, y compris depuis l'extérieur si un getter renvoie la liste. Pour une liste immuable : `List.of(...)` ou `List.copyOf(source)` (copie défensive, lève `UnsupportedOperationException` à la modification), ou `Collections.unmodifiableList` (vue en lecture seule sur une liste qui, elle, reste modifiable). Bonne pratique : `final` sur le champ **et** copie défensive dans le getter, ou exposer `List.copyOf(items)`.",
    keyPoints: ["Référence figée, pas l'objet", "`add`/`remove` passent", "`List.of` / `List.copyOf` → immuable", "`unmodifiableList` = vue, pas copie"],
  },
  {
    kind: "order",
    id: "java-fond-30",
    difficulty: 2,
    tags: ["static", "initialisation", "jvm"],
    prompt: "La JVM rencontre `Config.DEFAULTS` pour la première fois. Remets dans l'ordre ce qui se passe.",
    items: [
      "Chargement : le fichier `.class` est lu et la classe est représentée en mémoire",
      "Liaison : vérification du bytecode, puis préparation des champs `static` à leur valeur par défaut",
      "Initialisation : initialiseurs et blocs `static` s'exécutent dans l'ordre du fichier",
      "Lecture de la valeur de `DEFAULTS`",
    ],
    explanation:
      "Chargement, liaison, initialisation : les trois phases du cycle de vie d'une classe. La préparation met `DEFAULTS` à `null` ; c'est l'initialisation qui exécute le bloc `static` et lui donne sa valeur. L'initialisation est déclenchée paresseusement, à la première utilisation réelle (`new`, accès à un `static` non constant, appel de méthode `static`), pas au démarrage du programme. C'est pourquoi un bloc `static` avec un `print` ne s'affiche que quand la classe sert vraiment.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-fondamentaux",
  title: "Fondamentaux : primitifs, String, passage par valeur, final",
  objective:
    "Éviter les pièges de l'autoboxing et de ==, comprendre l'immuabilité de String, expliquer le passage par valeur et maîtriser final et l'initialisation statique.",
  prerequisites: [],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
