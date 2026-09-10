/**
 * Java — Lambdas, Stream API, Optional (référentiel 1.5).
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Lambdas et interfaces fonctionnelles
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-lst-l1",
  title: "Lambdas et interfaces fonctionnelles",
  blocks: [
    {
      kind: "text",
      text: "Une **lambda** est une implémentation anonyme d'une **interface fonctionnelle** : une interface avec exactement une méthode abstraite. Les méthodes `default`, `static`, et les méthodes publiques d'`Object` redéclarées (`equals`) ne comptent pas. Le compilateur déduit l'interface visée du contexte : c'est le **type cible**.",
    },
    {
      kind: "text",
      text: "`java.util.function` fournit les formes courantes : `Function<T,R>` (`apply`), `Supplier<T>` (`get`), `Consumer<T>` (`accept`), `Predicate<T>` (`test`), `BiFunction<T,U,R>`, `UnaryOperator<T>`. `Runnable` et `Comparator` sont aussi fonctionnelles. Les variantes primitives (`IntFunction`, `ToIntFunction`, `IntPredicate`) existent pour éviter le boxing dans les boucles chaudes.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois formes de lambda et une interface maison.",
      code: `Predicate<String> empty = s -> s.isEmpty();
Function<String, Integer> len = s -> s.length();
BiFunction<Integer, Integer, Integer> add =
    (a, b) -> a + b;
Runnable hello = () -> {
    // corps en bloc : plusieurs instructions
    String msg = "hello";
    System.out.println(msg);
};

@FunctionalInterface
interface Validator {
    boolean validate(String input);
    // default autorisé : ne compte pas
    default Validator and(Validator other) {
        return s -> validate(s) && other.validate(s);
    }
}
Validator notBlank = s -> !s.isBlank();`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Une lambda ne peut capturer qu'une variable locale `final` ou **effectivement final**. La réaffecter, avant ou après la lambda, rend tout le bloc incompilable. Les champs et les objets mutables, eux, restent modifiables.",
    },
    {
      kind: "text",
      text: "`@FunctionalInterface` est facultative : elle demande seulement au compilateur de refuser l'interface si elle n'a pas exactement une méthode abstraite. Un corps en **expression** (`s -> s.length()`) ne prend pas de `return` ; un corps en **bloc** (`{ ... }`) en a besoin s'il renvoie une valeur.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-lst-01",
    difficulty: 2,
    tags: ["interfaces-fonctionnelles", "lambdas"],
    prompt: "Laquelle de ces interfaces est fonctionnelle, donc implémentable par une lambda ?",
    choices: [
      "`interface A { void run(); default void log() {} }`",
      "`interface B { void open(); void close(); }`",
      "`interface C { boolean equals(Object o); }`",
      "`interface D { }`",
    ],
    answer: 0,
    explanation:
      "Il faut **exactement une** méthode abstraite. `A` en a une : `run` (la `default` ne compte pas). `B` en a deux. `C` redéclare `equals`, une méthode publique d'`Object` : elle ne compte pas, `C` n'a donc aucune méthode abstraite. `D` n'en a aucune. C'est ce qui rend `Comparator` fonctionnelle malgré son `equals` déclaré.",
  },
  {
    kind: "fill",
    id: "java-lst-02",
    difficulty: 1,
    tags: ["lambdas", "interfaces-fonctionnelles", "method-references"],
    prompt: "Complète : `empty` est vrai pour une chaîne de longueur 0, `len` donne la longueur, `make` crée une liste vide.",
    code: {
      language: "java",
      code: `Predicate<String> empty = s -> s.{{1}}();
Function<String, Integer> len = {{2}}::length;
Supplier<List<String>> make = {{3}}::new;`,
    },
    blanks: ["isEmpty", "String", "ArrayList"],
    distractors: ["length", "List", "this", "Object"],
    explanation:
      "`isEmpty()` renvoie un `boolean`, compatible avec `Predicate`. `s.length()` renverrait un `int` : incompatible. `String::length` est une référence à une méthode d'instance d'un type arbitraire. `ArrayList::new` est une référence de constructeur ; `List::new` ne compile pas, une interface n'a pas de constructeur.",
  },
  {
    kind: "output",
    id: "java-lst-03",
    difficulty: 2,
    tags: ["lambdas", "final", "portee"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `int base = 10;
Function<Integer, Integer> add = x -> x + base;
base = 20;
System.out.println(add.apply(1));`,
    },
    choices: [
      "Erreur de compilation : `base` n'est pas effectivement final.",
      "`11`",
      "`21`",
      "Erreur à l'exécution : la variable capturée a changé.",
    ],
    answer: 0,
    explanation:
      "La lambda capture `base`. Comme `base` est réaffectée ligne 3, elle n'est plus effectivement final, et le compilateur refuse la capture ligne 2 (« local variables referenced from a lambda expression must be final or effectively final »). Peu importe que la réaffectation soit après : c'est la variable entière qui est jugée.",
  },
  {
    kind: "match",
    id: "java-lst-04",
    difficulty: 1,
    tags: ["interfaces-fonctionnelles"],
    prompt: "Associe chaque interface de `java.util.function` à sa méthode abstraite.",
    pairs: [
      { left: "`Function<T, R>`", right: "`R apply(T t)`" },
      { left: "`Supplier<T>`", right: "`T get()`" },
      { left: "`Consumer<T>`", right: "`void accept(T t)`" },
      { left: "`Predicate<T>`", right: "`boolean test(T t)`" },
      { left: "`BiFunction<T, U, R>`", right: "`R apply(T t, U u)`" },
    ],
    explanation:
      "Quatre familles : transformer (`Function`), produire (`Supplier`), consommer (`Consumer`), tester (`Predicate`). Les variantes `Bi*` prennent deux arguments, `UnaryOperator<T>` est une `Function<T, T>`, `BinaryOperator<T>` une `BiFunction<T, T, T>`.",
  },
  {
    kind: "output",
    id: "java-lst-05",
    difficulty: 3,
    tags: ["lambdas", "surcharge-vs-redefinition", "interfaces-fonctionnelles"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `static void run(Runnable r) {
    System.out.println("runnable");
}
static void run(Supplier<String> s) {
    System.out.println("supplier");
}

run(() -> "x");
run(() -> { System.out.println("hi"); });`,
    },
    choices: [
      "`supplier` puis `runnable`",
      "`runnable` puis `runnable`",
      "Erreur de compilation : appel ambigu entre `Runnable` et `Supplier`.",
      "`supplier` puis `supplier`",
    ],
    answer: 0,
    explanation:
      "`() -> \"x\"` a un corps en expression qui n'est pas une instruction (`\"x\"` seule n'est pas une instruction valide) : elle n'est pas compatible avec `void`, donc seule `Supplier<String>` convient. `() -> { println(...); }` est un bloc sans `return` de valeur : compatible uniquement avec `void`, donc `Runnable`. Aucune ambiguïté. Note : `run(() -> list.size())` serait ambigu, car un appel de méthode est une instruction valide.",
  },
  {
    kind: "spot",
    id: "java-lst-06",
    difficulty: 2,
    tags: ["lambdas"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `List<String> names = List.of("a", "bb");
Consumer<String> print = s -> System.out.println(s);
names.forEach(print);
Supplier<Integer> size = () -> return names.size();`,
    },
    faultyLine: 4,
    reasons: [
      "`return` est interdit dans un corps en expression : écrire `() -> names.size()` ou `() -> { return names.size(); }`.",
      "Un `Supplier<Integer>` ne peut pas capturer `names`, qui est une variable locale.",
      "Il faut `Supplier<int>` puisque `size()` renvoie un `int`.",
      "`names.size()` n'est pas une expression effectivement final.",
    ],
    reasonAnswer: 0,
    explanation:
      "Après `->`, soit une expression seule (sa valeur est renvoyée), soit un bloc entre accolades avec `return`. `return` sans accolades est une erreur de syntaxe. `names` est effectivement final, sa capture est légale ; l'autoboxing `int` → `Integer` gère le type de retour.",
  },
  {
    kind: "recall",
    id: "java-lst-07",
    difficulty: 2,
    tags: ["interfaces-fonctionnelles", "lambdas"],
    prompt: "Qu'est-ce qu'une interface fonctionnelle ? À quoi sert `@FunctionalInterface`, et pourquoi les méthodes `default` ne comptent-elles pas ?",
    explanation:
      "Une interface fonctionnelle a **exactement une méthode abstraite** : c'est ce qui permet au compilateur de savoir quelle méthode une lambda implémente. Les méthodes `default` et `static` ont un corps, donc ne sont pas abstraites et ne comptent pas ; les méthodes d'`Object` redéclarées (`equals`, `hashCode`) non plus, puisque toute implémentation les hérite. `@FunctionalInterface` est **facultative** : elle fait échouer la compilation si l'interface ne respecte pas la règle, protégeant contre l'ajout accidentel d'une seconde méthode abstraite. Une lambda peut cibler n'importe quelle interface à méthode unique, annotée ou non.",
    keyPoints: ["Exactement une méthode abstraite", "`default`, `static`, méthodes d'`Object` : ne comptent pas", "`@FunctionalInterface` : vérification, pas obligation"],
  },
  {
    kind: "mcq",
    id: "java-lst-08",
    difficulty: 2,
    tags: ["interfaces-fonctionnelles"],
    prompt: "Que fait exactement l'annotation `@FunctionalInterface` ?",
    choices: [
      "Elle fait échouer la compilation si l'interface n'a pas exactement une méthode abstraite ; elle n'est pas nécessaire pour utiliser une lambda.",
      "Elle est obligatoire pour qu'une lambda puisse implémenter l'interface.",
      "Elle génère une implémentation par défaut de la méthode abstraite.",
      "Elle interdit les méthodes `default` dans l'interface.",
    ],
    answer: 0,
    explanation:
      "C'est une annotation de **vérification**, comme `@Override`. `Runnable`, `Comparator` la portent, mais une interface maison à une méthode fonctionne en lambda sans elle. Les `default` restent autorisées : `Comparator.reversed()` en est une.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Références de méthode et opérations de stream
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-lst-l2",
  title: "Références de méthode et pipeline de stream",
  blocks: [
    {
      kind: "text",
      text: "Une **référence de méthode** (`::`) remplace une lambda qui ne fait qu'appeler une méthode. Quatre formes : méthode `static` (`Integer::parseInt`), méthode d'instance d'un **objet précis** (`out::println`), méthode d'instance d'un **type arbitraire** où le premier argument devient le récepteur (`String::length`), et constructeur (`ArrayList::new`).",
    },
    {
      kind: "text",
      text: "Un **stream** est un pipeline : une source, des opérations **intermédiaires** qui renvoient un stream (`filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`), et une opération **terminale** qui produit un résultat (`collect`, `reduce`, `count`, `forEach`, `findFirst`). `map` transforme un élément en un élément ; `flatMap` transforme un élément en un stream et aplatit.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un pipeline typique et les collecteurs usuels.",
      code: `record Order(String customer, int amount) {}

Map<String, Integer> totalByCustomer = orders.stream()
    .filter(o -> o.amount() > 0)
    .collect(Collectors.groupingBy(
        Order::customer,
        Collectors.summingInt(Order::amount)));

// toMap : la clé doit être unique, sinon
// IllegalStateException "Duplicate key"
Map<String, Order> byCustomer = orders.stream()
    .collect(Collectors.toMap(
        Order::customer,
        o -> o,
        (first, second) -> second));   // fusion

Map<Boolean, List<Order>> bigSmall = orders.stream()
    .collect(Collectors.partitioningBy(
        o -> o.amount() >= 100));

String names = orders.stream()
    .map(Order::customer)
    .distinct()
    .sorted()
    .collect(Collectors.joining(", "));`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`Collectors.toMap` sans fonction de fusion lève `IllegalStateException` à la première clé en double. `groupingBy` accepte les doublons par construction : c'est souvent lui qu'on voulait.",
    },
    {
      kind: "text",
      text: "`reduce(identity, op)` renvoie une valeur ; `reduce(op)` sans identité renvoie un `Optional`, vide si le stream l'est. Depuis Java 16, `.toList()` remplace `collect(Collectors.toList())` et renvoie une liste **non modifiable**, ce qui casse le code appelant qui y ajoutait des éléments.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "match",
    id: "java-lst-09",
    difficulty: 1,
    tags: ["method-references"],
    prompt: "Associe chaque référence de méthode à sa forme.",
    pairs: [
      { left: "`Integer::parseInt`", right: "Méthode `static`" },
      { left: "`System.out::println`", right: "Méthode d'instance d'un objet précis" },
      { left: "`String::toUpperCase`", right: "Méthode d'instance d'un type arbitraire" },
      { left: "`ArrayList::new`", right: "Constructeur" },
    ],
    explanation:
      "La forme « type arbitraire » est la plus déroutante : `String::toUpperCase` équivaut à `s -> s.toUpperCase()`, le premier paramètre de la lambda devient le récepteur. Avec un objet précis (`out::println`), le récepteur est fixé et tous les paramètres sont transmis.",
  },
  {
    kind: "output",
    id: "java-lst-10",
    difficulty: 2,
    tags: ["streams", "collectors"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<String> words = List.of("bb", "a", "ccc", "a");
String r = words.stream()
    .distinct()
    .sorted(Comparator.comparing(String::length))
    .map(String::toUpperCase)
    .collect(Collectors.joining(","));
System.out.println(r);`,
    },
    choices: ["`A,BB,CCC`", "`BB,A,CCC,A`", "`A,A,BB,CCC`", "`CCC,BB,A`"],
    answer: 0,
    explanation:
      "`distinct` retire le second `a` : `[bb, a, ccc]`. `sorted` par longueur donne `[a, bb, ccc]` (tri stable, aucune égalité ici). `map` met en majuscules, `joining` assemble avec des virgules : `A,BB,CCC`.",
  },
  {
    kind: "output",
    id: "java-lst-11",
    difficulty: 3,
    tags: ["collectors", "streams", "exceptions"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `List<String> names = List.of("Ana", "Bob", "Alice");
Map<Character, String> byInitial = names.stream()
    .collect(Collectors.toMap(
        n -> n.charAt(0),
        n -> n));
System.out.println(byInitial.size());`,
    },
    choices: [
      "`IllegalStateException` : clé dupliquée `A`.",
      "`2` : `Alice` écrase `Ana`.",
      "`3`",
      "`2` : `Ana` est conservée, `Alice` ignorée.",
    ],
    answer: 0,
    explanation:
      "`Ana` et `Alice` ont la même initiale. `toMap` à deux arguments refuse les doublons : « Duplicate key A (attempted merging values Ana and Alice) ». Pour garder le dernier : `toMap(k, v, (a, b) -> b)`. Pour tout garder : `groupingBy(n -> n.charAt(0))`, qui renvoie une `Map<Character, List<String>>`.",
  },
  {
    kind: "fill",
    id: "java-lst-12",
    difficulty: 2,
    tags: ["collectors", "streams"],
    prompt: "Complète : `byLen` compte les mots par longueur, `parts` sépare les mots de plus de 2 lettres des autres.",
    code: {
      language: "java",
      code: `Map<Integer, Long> byLen = words.stream()
    .collect(Collectors.{{1}}(
        String::length,
        Collectors.{{2}}()));

Map<Boolean, List<String>> parts = words.stream()
    .collect(Collectors.{{3}}(w -> w.length() > 2));`,
    },
    blanks: ["groupingBy", "counting", "partitioningBy"],
    distractors: ["toMap", "summing", "filtering", "mapping"],
    explanation:
      "`groupingBy(classifier, downstream)` regroupe puis applique un collecteur aval : `counting()` renvoie un `Long`. `partitioningBy` est un `groupingBy` à clé booléenne, qui garantit les deux clés `true` et `false` même si l'une est vide. `toMap` attendrait une fonction de valeur, pas un collecteur ; `summing` n'existe pas (`summingInt`), `filtering` et `mapping` prennent deux arguments.",
  },
  {
    kind: "output",
    id: "java-lst-13",
    difficulty: 2,
    tags: ["streams", "flatmap"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<List<Integer>> nested =
    List.of(List.of(1, 2), List.of(3));
List<Integer> flat = nested.stream()
    .flatMap(List::stream)
    .map(n -> n * 10)
    .toList();
System.out.println(flat);`,
    },
    choices: ["`[10, 20, 30]`", "`[[10, 20], [30]]`", "Erreur de compilation : `map` reçoit une `List`, pas un `Integer`.", "`[1, 2, 3]`"],
    answer: 0,
    explanation:
      "`flatMap(List::stream)` transforme chaque sous-liste en stream et aplatit : le pipeline voit `1, 2, 3`. `map` multiplie, `toList()` (Java 16) collecte. Avec `map(List::stream)` à la place, on aurait un `Stream<Stream<Integer>>` et l'erreur de compilation du troisième choix.",
  },
  {
    kind: "mcq",
    id: "java-lst-14",
    difficulty: 2,
    tags: ["streams", "optional"],
    prompt: "Que renvoie `nums.stream().reduce(Integer::sum)` ?",
    choices: [
      "Un `Optional<Integer>`, vide si le stream est vide.",
      "Un `int`, `0` si le stream est vide.",
      "Un `Integer`, `null` si le stream est vide.",
      "Erreur de compilation : il manque la valeur initiale.",
    ],
    answer: 0,
    explanation:
      "Sans identité, `reduce` ne sait pas quoi renvoyer pour un stream vide : il renvoie un `Optional`. Avec identité, `reduce(0, Integer::sum)` renvoie directement un `Integer` et vaut `0` sur un stream vide. Pour une somme, `mapToInt(Integer::intValue).sum()` évite le boxing.",
  },
  {
    kind: "spot",
    id: "java-lst-15",
    difficulty: 2,
    tags: ["streams", "effets-de-bord"],
    prompt: "Ce code fonctionne, mais un relecteur le refuse. Trouve la ligne en cause.",
    code: {
      language: "java",
      code: `List<Integer> evens = new ArrayList<>();
nums.stream()
    .filter(n -> n % 2 == 0)
    .forEach(n -> evens.add(n));
return evens;`,
    },
    faultyLine: 4,
    reasons: [
      "Effet de bord sur une collection externe : fragile (faux en parallèle, ordre non garanti) et non idiomatique. Utiliser `.toList()` ou `collect`.",
      "`evens` doit être déclarée `final` pour être capturée par la lambda.",
      "`forEach` n'existe pas sur un `Stream`, seulement sur une `List`.",
      "`filter` renvoie un `Optional`, pas un stream.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un stream doit produire son résultat par l'opération terminale, pas en mutant une variable extérieure. Avec `parallelStream()`, `ArrayList.add` concurrent corrompt la liste. La forme correcte : `nums.stream().filter(...).toList()`. `evens` est effectivement final (jamais réaffectée), sa capture est légale ; c'est l'intention qui est mauvaise.",
  },
  {
    kind: "recall",
    id: "java-lst-16",
    difficulty: 2,
    tags: ["streams", "flatmap"],
    prompt: "`map` ou `flatMap` : quelle différence, et quand utiliser lequel ?",
    explanation:
      "`map` applique une fonction **un élément → un élément** : `Stream<Order>` devient `Stream<String>` avec `map(Order::customer)`. `flatMap` applique une fonction **un élément → un stream**, puis **aplatit** tous ces streams en un seul : `Stream<Order>` devient `Stream<Line>` avec `flatMap(o -> o.lines().stream())`. Règle : si la fonction renvoie une collection ou un `Optional` et qu'on veut leurs contenus, c'est `flatMap` ; sinon on obtient un `Stream<List<...>>` imbriqué. Même logique sur `Optional` : `map` donne un `Optional<Optional<T>>` quand la fonction renvoie déjà un `Optional`, `flatMap` évite l'emboîtement.",
    keyPoints: ["`map` : 1 → 1", "`flatMap` : 1 → stream, puis aplatissement", "Fonction qui renvoie une collection / un `Optional` → `flatMap`"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Paresse et consommation
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-lst-l3",
  title: "Un stream est paresseux et à usage unique",
  blocks: [
    {
      kind: "text",
      text: "Un stream ne fait **rien** tant qu'aucune opération **terminale** n'est appelée. Les opérations intermédiaires ne font que décrire le pipeline. C'est la **paresse** : `filter(...).map(...)` sans `collect`, `count` ou `forEach` n'exécute aucune lambda.",
    },
    {
      kind: "text",
      text: "Quand l'opération terminale arrive, les éléments traversent le pipeline **un par un**, verticalement : le premier élément passe `filter`, puis `map`, puis arrive au terminal, avant que le deuxième ne parte. Cela permet le **court-circuit** : `findFirst`, `anyMatch`, `limit` arrêtent le traitement dès que possible, sans consommer la source.",
    },
    {
      kind: "code",
      language: "java",
      caption: "peek montre l'ordre réel d'exécution.",
      code: `Stream.of("a", "bb", "ccc")
    .peek(s -> System.out.print("f:" + s + " "))
    .filter(s -> s.length() > 1)
    .peek(s -> System.out.print("m:" + s + " "))
    .map(String::toUpperCase)
    .findFirst();
// affiche : f:a f:bb m:bb
// "ccc" n'est jamais lu : findFirst a court-circuité

Stream<String> s = Stream.of("x", "y");
s.count();
s.count();   // IllegalStateException :
             // stream has already been operated upon`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Un stream se consomme **une seule fois**. Réutiliser la variable après une opération terminale lève `IllegalStateException`. Pour relire, recréer le stream depuis la source (`list.stream()`), ou passer par un `Supplier<Stream<T>>`.",
    },
    {
      kind: "text",
      text: "Certaines opérations sont **avec état** et doivent voir tous les éléments avant d'en émettre un : `sorted`, `distinct`. Sur un stream infini (`Stream.iterate`), `sorted` ne termine jamais ; `limit` doit venir avant. `parallelStream()` découpe la source entre threads : sans effet de bord et avec des collecteurs, c'est sûr ; avec une `ArrayList` mutée dans `forEach`, c'est corrompu.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "java-lst-17",
    difficulty: 2,
    tags: ["lazy-evaluation", "streams"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Stream.of("a", "b", "c")
    .peek(s -> System.out.print(s))
    .map(String::toUpperCase);
System.out.println("fin");`,
    },
    choices: ["`fin`", "`abcfin`", "`ABCfin`", "Erreur à l'exécution : stream non consommé."],
    answer: 0,
    explanation:
      "Aucune opération terminale : `peek` et `map` sont intermédiaires et ne s'exécutent jamais. Seul `fin` s'affiche. Un stream jamais consommé n'est pas une erreur, juste du code mort. Ajouter `.count()` ou `.toList()` déclencherait `abc`.",
  },
  {
    kind: "output",
    id: "java-lst-18",
    difficulty: 3,
    tags: ["lazy-evaluation", "streams", "short-circuit"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Stream.of("a", "bb", "ccc")
    .peek(s -> System.out.print("p" + s + " "))
    .filter(s -> s.length() > 1)
    .findFirst();`,
    },
    choices: ["`pa pbb `", "`pa pbb pccc `", "`pbb `", "`pa pbb pccc bb`"],
    answer: 0,
    explanation:
      "Exécution élément par élément : `a` passe `peek` (affiche `pa`), est rejeté par `filter`. `bb` passe `peek` (affiche `pbb`), passe `filter`, atteint `findFirst` qui a sa réponse et **arrête tout**. `ccc` n'est jamais lu. Sans court-circuit (`.toList()` par exemple), on verrait aussi `pccc`.",
  },
  {
    kind: "output",
    id: "java-lst-19",
    difficulty: 2,
    tags: ["streams", "exceptions"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `Stream<String> s = Stream.of("x", "y");
System.out.println(s.count());
System.out.println(s.count());`,
    },
    choices: ["`2` puis `IllegalStateException`", "`2` puis `2`", "`2` puis `0`", "Erreur de compilation : `s` est déjà consommé."],
    answer: 0,
    explanation:
      "Le premier `count()` consomme le stream et affiche `2`. Le second lève `IllegalStateException: stream has already been operated upon or closed`. Le compilateur ne peut pas le détecter. Pour compter deux fois, recréer le stream depuis la source.",
  },
  {
    kind: "mcq",
    id: "java-lst-20",
    difficulty: 1,
    tags: ["streams", "lazy-evaluation"],
    prompt: "Quel groupe ne contient **que** des opérations terminales ?",
    choices: [
      "`count`, `collect`, `forEach`, `findFirst`",
      "`map`, `filter`, `sorted`, `collect`",
      "`peek`, `limit`, `distinct`, `count`",
      "`anyMatch`, `map`, `reduce`, `toList`",
    ],
    answer: 0,
    explanation:
      "Une opération terminale déclenche l'exécution et renvoie autre chose qu'un `Stream` : un nombre, une collection, un `Optional`, `void`. `map`, `filter`, `sorted`, `peek`, `limit`, `distinct` renvoient un `Stream` : intermédiaires. Les groupes B, C et D mélangent les deux.",
  },
  {
    kind: "order",
    id: "java-lst-21",
    difficulty: 2,
    tags: ["lazy-evaluation", "streams"],
    prompt: "`Stream.of(1, 2, 3).filter(n -> n % 2 == 1).map(n -> n * 10).forEach(print)`. Remets dans l'ordre les appels de lambdas effectivement exécutés.",
    items: [
      "`filter(1)` → passe",
      "`map(1)` → 10",
      "`print(10)`",
      "`filter(2)` → rejeté",
      "`filter(3)` → passe",
      "`map(3)` → 30",
      "`print(30)`",
    ],
    explanation:
      "Le pipeline est traversé **verticalement**, élément par élément : `1` va jusqu'au bout avant que `2` ne commence. `2` est rejeté par `filter`, donc `map` n'est jamais appelée pour lui. L'intuition « d'abord tous les filter, puis tous les map » est fausse, et c'est ce qui rend le court-circuit possible.",
  },
  {
    kind: "spot",
    id: "java-lst-22",
    difficulty: 2,
    tags: ["streams", "lazy-evaluation"],
    prompt: "Ce programme ne se termine jamais. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `List<Integer> firstFive = Stream.iterate(1, n -> n + 1)
    .sorted()
    .limit(5)
    .toList();`,
    },
    faultyLine: 2,
    reasons: [
      "`sorted` est une opération avec état qui doit lire **tout** le stream avant d'émettre : sur un stream infini, elle ne rend jamais la main. Placer `limit` avant.",
      "`Stream.iterate` n'est pas infini, `limit` est donc inutile et bloque.",
      "`toList()` exige un `Collector`, il faut `collect(Collectors.toList())`.",
      "`sorted` a besoin d'un `Comparator` explicite pour des `Integer`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`filter`, `map`, `peek` traitent un élément à la fois. `sorted` et `distinct` (sur un stream non trié) doivent accumuler avant d'émettre. Avec `iterate`, la source ne s'arrête jamais. `Stream.iterate(1, n -> n + 1).limit(5).sorted().toList()` termine : `limit` court-circuite la source. `Integer` est `Comparable`, `sorted()` sans argument est valide.",
  },
  {
    kind: "recall",
    id: "java-lst-23",
    difficulty: 2,
    tags: ["lazy-evaluation", "streams"],
    prompt: "Explique la paresse des streams : que se passe-t-il sans opération terminale, et comment les éléments traversent-ils le pipeline ?",
    explanation:
      "Les opérations intermédiaires (`filter`, `map`, `sorted`…) ne font que **construire** le pipeline : sans opération terminale (`collect`, `count`, `forEach`, `findFirst`…), aucune lambda ne s'exécute. À l'appel du terminal, les éléments traversent le pipeline **un par un, de bout en bout** : le premier élément passe toutes les étapes avant que le second ne parte. Deux conséquences : le **court-circuit** (`findFirst`, `anyMatch`, `limit`) peut arrêter la lecture de la source dès qu'il a sa réponse, et les opérations **avec état** (`sorted`, `distinct`) sont les seules à devoir accumuler. Un stream est consommé par son terminal et ne peut pas être réutilisé.",
    keyPoints: ["Rien ne s'exécute sans terminal", "Traversée verticale, élément par élément", "Court-circuit possible", "`sorted` / `distinct` accumulent", "Usage unique"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Optional
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-lst-l4",
  title: "Optional : dire « peut-être » dans un type de retour",
  blocks: [
    {
      kind: "text",
      text: "`Optional<T>` est un conteneur qui contient une valeur ou rien. Son rôle : rendre explicite, dans la **signature d'une méthode**, qu'un résultat peut être absent, à la place d'un `null` que l'appelant oublie de tester. `findById` d'un repository renvoie un `Optional`, c'est son usage canonique.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Construction, transformation, extraction.",
      code: `Optional<String> a = Optional.of("x");
Optional<String> b = Optional.ofNullable(maybeNull);
Optional<String> c = Optional.empty();
// Optional.of(null) → NullPointerException

String email = repo.findById(id)
    .map(User::getEmail)          // Optional<String>
    .filter(e -> e.contains("@"))
    .orElse("inconnu");

User u = repo.findById(id)
    .orElseThrow(() -> new NotFoundException(id));

repo.findById(id).ifPresent(user -> audit(user));

// orElse évalue TOUJOURS son argument,
// orElseGet seulement si l'Optional est vide
String v1 = opt.orElse(computeDefault());
String v2 = opt.orElseGet(() -> computeDefault());`,
    },
    {
      kind: "text",
      text: "`map` transforme la valeur si elle est présente ; `flatMap` sert quand la fonction renvoie elle-même un `Optional`. `get()` lève `NoSuchElementException` sur un vide : préférer `orElseThrow()`, plus explicite, ou `orElse` / `orElseGet`. Le couple `isPresent()` + `get()` est du `null`-check déguisé.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`orElse(x)` évalue `x` **avant** l'appel, présent ou non. Si `x` est un calcul coûteux ou un appel en base, c'est `orElseGet(() -> x)` qu'il faut.",
    },
    {
      kind: "text",
      text: "`Optional` n'est **pas** fait pour les champs ni les paramètres : il n'est pas `Serializable`, peut lui-même valoir `null`, et alourdit les appels (`Optional.ofNullable(x)` partout). En paramètre, une surcharge ou un `@Nullable` est plus clair. Sa place : le type de retour.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "java-lst-24",
    difficulty: 2,
    tags: ["optional", "lazy-evaluation"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `static String fallback() {
    System.out.print("F");
    return "def";
}

Optional<String> o = Optional.of("val");
String a = o.orElse(fallback());
String b = o.orElseGet(() -> fallback());
System.out.println(a + b);`,
    },
    choices: ["`Fvalval`", "`valval`", "`FFvalval`", "`Fdefdef`"],
    answer: 0,
    explanation:
      "`orElse(fallback())` : l'argument est une expression Java ordinaire, évaluée **avant** l'appel, donc `fallback()` s'exécute et affiche `F` même si `o` est plein. `orElseGet` reçoit une lambda, appelée seulement si l'`Optional` est vide : rien. Les deux renvoient `val`. Résultat : `F` puis `valval`.",
  },
  {
    kind: "output",
    id: "java-lst-25",
    difficulty: 2,
    tags: ["optional", "null"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `String name = null;
Optional<String> o = Optional.of(name);
System.out.println(o.isPresent());`,
    },
    choices: ["`NullPointerException`", "`false`", "`true`", "Erreur de compilation : `of` refuse une variable nullable."],
    answer: 0,
    explanation:
      "`Optional.of` exige une valeur non nulle et lève `NullPointerException` sinon (c'est `Objects.requireNonNull` en interne). Pour une valeur peut-être nulle, `Optional.ofNullable(name)` renvoie un `Optional` vide et `isPresent()` donnerait `false`.",
  },
  {
    kind: "fill",
    id: "java-lst-26",
    difficulty: 2,
    tags: ["optional"],
    prompt: "Complète : l'e-mail de l'utilisateur s'il existe et n'est pas vide, sinon `inconnu`.",
    code: {
      language: "java",
      code: `Optional<User> user = repo.findById(id);
String email = user
    .{{1}}(User::getEmail)      // Optional<String>
    .{{2}}(e -> !e.isBlank())   // vide si blanc
    .{{3}}("inconnu");`,
    },
    blanks: ["map", "filter", "orElse"],
    distractors: ["flatMap", "get", "orElseGet", "ifPresent"],
    explanation:
      "`getEmail` renvoie une `String`, pas un `Optional` : c'est `map` (`flatMap` exigerait une fonction renvoyant un `Optional`). `filter` vide l'`Optional` si le prédicat échoue. `orElse` prend une valeur ; `orElseGet` prendrait un `Supplier`, et `ifPresent` renvoie `void`.",
  },
  {
    kind: "spot",
    id: "java-lst-27",
    difficulty: 2,
    tags: ["optional", "conception"],
    prompt: "Ce code compile et fonctionne, mais contredit l'usage prévu d'`Optional`. Trouve la ligne.",
    code: {
      language: "java",
      code: `public class OrderService {
    public Money total(Order o, Optional<Coupon> coupon) {
        Money base = o.subtotal();
        return coupon.map(c -> c.apply(base)).orElse(base);
    }
}`,
    },
    faultyLine: 2,
    reasons: [
      "`Optional` en paramètre : chaque appelant doit emballer (`Optional.ofNullable(x)`), et rien n'empêche de passer `null`. Préférer une surcharge sans coupon ou un paramètre `@Nullable`.",
      "`coupon.map(...)` ne compile pas car `apply` renvoie un `Money`.",
      "`orElse(base)` évalue `base` paresseusement, ce qui est incorrect ici.",
      "`Optional` n'est pas immuable, il ne doit pas être partagé entre méthodes.",
    ],
    reasonAnswer: 0,
    explanation:
      "`Optional` est conçu comme **type de retour**. En paramètre, il alourdit l'API et ne protège de rien : `total(o, null)` compile et lève `NullPointerException` sur `coupon.map`. Deux méthodes `total(Order)` et `total(Order, Coupon)` sont plus claires. Le `map(...).orElse(...)` lui-même est idiomatique, et `orElse` évalue son argument immédiatement, ce qui est sans conséquence pour une simple variable.",
  },
  {
    kind: "mcq",
    id: "java-lst-28",
    difficulty: 2,
    tags: ["optional", "exceptions"],
    prompt: "Que fait `opt.get()` si l'`Optional` est vide, et que préférer ?",
    choices: [
      "Il lève `NoSuchElementException`. Préférer `orElseThrow()`, qui dit explicitement qu'on s'attend à une valeur, ou `map` / `orElse`.",
      "Il renvoie `null`, comme un `Map.get` sur une clé absente.",
      "Il ne compile pas sans un `isPresent()` juste avant.",
      "Il lève `NullPointerException`.",
    ],
    answer: 0,
    explanation:
      "`get()` est le piège historique de l'API : il ressemble à un accès sûr et ne l'est pas. `orElseThrow()` (Java 10) lève la même exception mais rend l'intention lisible. Le compilateur ne vérifie rien : `isPresent()` + `get()` est un `null`-check déguisé, `map` / `orElse` / `ifPresent` expriment mieux le cas absent.",
  },
  {
    kind: "recall",
    id: "java-lst-29",
    difficulty: 2,
    tags: ["optional", "lazy-evaluation"],
    prompt: "`orElse` ou `orElseGet` : quelle différence, et dans quel cas ça compte vraiment ?",
    explanation:
      "`orElse(valeur)` reçoit une **valeur** : l'expression est évaluée avant l'appel, que l'`Optional` soit plein ou vide. `orElseGet(supplier)` reçoit une **lambda**, appelée seulement si l'`Optional` est vide. Sans effet de bord ni coût (`orElse(\"\")`, `orElse(0)`), les deux sont équivalents et `orElse` est plus lisible. Dès que le défaut est **coûteux** (requête en base, construction d'objet lourd) ou a un **effet de bord** (log, compteur), `orElse` le déclenche pour rien à chaque appel : `orElseGet` s'impose. Même logique avec `orElseThrow(supplier)`, qui ne construit l'exception que si nécessaire.",
    keyPoints: ["`orElse` : argument toujours évalué", "`orElseGet` : lambda appelée seulement si vide", "Coût ou effet de bord → `orElseGet`"],
  },
  {
    kind: "recall",
    id: "java-lst-30",
    difficulty: 3,
    tags: ["optional", "conception"],
    prompt: "Pourquoi ne pas utiliser `Optional` en champ ni en paramètre ? Où est-il à sa place ?",
    explanation:
      "Sa place est le **type de retour** : il signale à l'appelant qu'un résultat peut manquer et l'oblige à le traiter (`map`, `orElse`, `orElseThrow`). En **champ**, il n'est pas `Serializable`, peut lui-même être `null` (on a déplacé le problème), complique les frameworks (JPA, Jackson) et les constructeurs. En **paramètre**, il force chaque appelant à écrire `Optional.ofNullable(x)`, ne protège pas de `null`, et cache une conception à revoir : une surcharge, un objet de paramètres ou un `@Nullable` sont plus clairs. Dans les collections, un `Optional` élément n'apporte rien : on filtre l'absence en amont. Règle des concepteurs du JDK : `Optional` est un type de retour, pas un type de donnée.",
    keyPoints: ["Retour : oui, rend l'absence explicite", "Champ : non (sérialisation, `null` possible, frameworks)", "Paramètre : non (surcharge ou `@Nullable`)", "Collection d'`Optional` : non"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-lambdas-streams",
  title: "Lambdas, Stream API, Optional",
  objective:
    "Écrire des lambdas et des références de méthode justes, composer un pipeline de stream en comprenant sa paresse, et utiliser Optional là où il a sa place.",
  prerequisites: ["java-collections"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
