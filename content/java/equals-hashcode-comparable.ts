/**
 * Java — equals/hashCode, Comparable vs Comparator, record, enum (référentiel 1.2).
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Le contrat equals / hashCode
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-ehc-l1",
  title: "Le contrat equals / hashCode",
  blocks: [
    {
      kind: "text",
      text: "Par défaut, `equals` hérité d'`Object` compare les **références** : deux objets sont égaux s'ils sont le même objet. Pour une égalité de **valeur**, on redéfinit `equals`, et le contrat impose cinq règles : réflexif (`x.equals(x)`), symétrique, transitif, cohérent (même résultat tant que rien ne change), et `x.equals(null)` renvoie `false` sans lever d'exception.",
    },
    {
      kind: "text",
      text: "La sixième règle est la plus oubliée : **deux objets égaux doivent avoir le même `hashCode`**. `HashMap` et `HashSet` calculent d'abord `hashCode` pour choisir un bucket, puis comparent avec `equals` dans ce bucket. Si `equals` est redéfini sans `hashCode`, deux objets égaux tombent dans des buckets différents et `contains` renvoie `false`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'idiome moderne : instanceof pattern et Objects.hash.",
      code: `public final class Money {
    private final long cents;
    private final String currency;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        // false si null ou autre type
        if (!(o instanceof Money m)) return false;
        return cents == m.cents
            && currency.equals(m.currency);
    }

    @Override
    public int hashCode() {
        // mêmes champs que equals, toujours
        return Objects.hash(cents, currency);
    }
}`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Une clé de `HashMap` doit être **immuable**, ou au moins ne jamais changer sur les champs qui entrent dans `hashCode`. Modifier la clé après insertion la rend introuvable : elle est rangée dans l'ancien bucket.",
    },
    {
      kind: "text",
      text: "`instanceof` accepte les sous-classes, ce qui peut casser la symétrie si une sous-classe ajoute des champs à `equals`. `getClass() != o.getClass()` l'évite au prix du polymorphisme. Le plus simple : déclarer la classe `final`, ou utiliser un `record`.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-ehc-01",
    difficulty: 1,
    tags: ["equals-hashcode", "null"],
    prompt: "Selon le contrat d'`equals`, que doit renvoyer `x.equals(null)` ?",
    choices: [
      "`false`, sans jamais lever d'exception.",
      "Une `NullPointerException`, comme tout appel avec `null`.",
      "`true` si `x` représente une valeur vide.",
      "Cela dépend de l'implémentation : le contrat ne dit rien sur `null`.",
    ],
    answer: 0,
    explanation:
      "Le contrat est explicite : pour tout `x` non null, `x.equals(null)` renvoie `false`. L'idiome `if (!(o instanceof Money m)) return false;` le garantit gratuitement, puisque `instanceof` renvoie `false` pour `null`. Un `equals` qui lève une exception sur `null` casse les collections, qui appellent `equals` sans précaution.",
  },
  {
    kind: "output",
    id: "java-ehc-02",
    difficulty: 2,
    tags: ["equals-hashcode", "collections"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public int hashCode() { return 31 * x + y; }
    // equals n'est PAS redéfini
}

Set<Point> s = new HashSet<>();
s.add(new Point(1, 2));
s.add(new Point(1, 2));
System.out.println(s.size());`,
    },
    choices: ["`2`", "`1`", "`0`", "Erreur de compilation : `hashCode` sans `equals`."],
    answer: 0,
    explanation:
      "Les deux points ont le même `hashCode`, donc le même bucket. `HashSet` compare ensuite avec `equals`, hérité d'`Object` : deux instances distinctes, donc pas égales, les deux sont conservées. Le contrat va dans les deux sens : `equals` sans `hashCode` disperse les égaux dans des buckets différents ; `hashCode` sans `equals` ne dédoublonne rien. Le compilateur ne vérifie rien.",
  },
  {
    kind: "spot",
    id: "java-ehc-03",
    difficulty: 2,
    tags: ["equals-hashcode", "hashmap", "immuabilite"],
    prompt: "`Person` redéfinit `equals` et `hashCode` sur `name`. Pourtant `roles.get(p)` renvoie `null`. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `Map<Person, String> roles = new HashMap<>();
Person p = new Person("Ana");
roles.put(p, "admin");
p.setName("Anna");
System.out.println(roles.get(p));`,
    },
    faultyLine: 4,
    reasons: [
      "Le `hashCode` de la clé a changé après l'insertion : `get` cherche dans un autre bucket. Une clé de `Map` doit être immuable.",
      "`put` copie la clé : il faut refaire `put` après `setName`.",
      "`get` doit recevoir `new Person(\"Anna\")` plutôt que `p`.",
      "`HashMap` refuse les objets mutables et lève une exception à l'exécution.",
    ],
    reasonAnswer: 0,
    explanation:
      "La clé a été rangée dans le bucket calculé pour `\"Ana\"`. Après `setName`, son `hashCode` correspond à `\"Anna\"` : `get` regarde dans ce nouveau bucket, vide. `new Person(\"Anna\")` ne trouverait rien non plus. `HashMap` ne détecte rien : l'entrée est simplement perdue. Clés immuables, ou champs de `hashCode` jamais modifiés.",
  },
  {
    kind: "fill",
    id: "java-ehc-04",
    difficulty: 2,
    tags: ["equals-hashcode"],
    prompt: "Complète l'idiome `equals` / `hashCode` sur l'identifiant.",
    code: {
      language: "java",
      code: `@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o {{1}} Order other)) return false;
    return id == other.id;
}

@Override
public int {{2}}() {
    return {{3}}.hash(id);
}`,
    },
    blanks: ["instanceof", "hashCode", "Objects"],
    distractors: ["equals", "hashcode", "Object", "getClass", "=="],
    explanation:
      "`o instanceof Order other` teste le type et déclare la variable typée d'un coup (pattern matching, Java 16). `hashCode` s'écrit avec un C majuscule : `hashcode` avec `@Override` ne compile pas, car il ne redéfinit rien. `Objects.hash(...)` (classe utilitaire `java.util.Objects`) combine les champs ; `Object.hash` n'existe pas.",
  },
  {
    kind: "mcq",
    id: "java-ehc-05",
    difficulty: 2,
    tags: ["equals-hashcode", "heritage", "conception"],
    prompt: "Pourquoi certains `equals` écrivent `getClass() != o.getClass()` plutôt qu'`instanceof` ?",
    choices: [
      "Pour garantir la symétrie quand une sous-classe ajoute des champs : avec `instanceof`, `parent.equals(child)` peut être `true` alors que `child.equals(parent)` est `false`.",
      "Parce qu'`instanceof` est nettement plus lent que `getClass`.",
      "Parce qu'`instanceof` renvoie `true` pour `null`.",
      "Parce que `getClass` est obligatoire pour que `hashCode` reste cohérent.",
    ],
    answer: 0,
    explanation:
      "Avec `instanceof`, un `Point` et un `ColoredPoint(1, 2, RED)` peuvent être égaux dans un sens et pas dans l'autre, violant la symétrie. `getClass` impose le type exact, mais interdit l'égalité entre une classe et ses sous-classes (mandataires, proxys). `instanceof` renvoie `false` pour `null`. Le vrai remède : classe `final` ou `record`, et composition plutôt qu'héritage.",
  },
  {
    kind: "match",
    id: "java-ehc-06",
    difficulty: 1,
    tags: ["equals-hashcode"],
    prompt: "Associe chaque règle du contrat à sa formulation.",
    pairs: [
      { left: "Réflexif", right: "`x.equals(x)` est `true`" },
      { left: "Symétrique", right: "`x.equals(y)` ⇔ `y.equals(x)`" },
      { left: "Transitif", right: "`x = y` et `y = z` ⇒ `x = z`" },
      { left: "Cohérent", right: "Même résultat tant que rien ne change" },
      { left: "Lien avec `hashCode`", right: "Égaux ⇒ mêmes `hashCode`" },
    ],
    explanation:
      "Les quatre premières règles sont celles d'une relation d'équivalence. La cinquième relie `equals` à `hashCode` : c'est elle qui fait fonctionner `HashMap`. L'inverse n'est pas exigé : deux objets différents peuvent partager un `hashCode` (collision), c'est normal et géré.",
  },
  {
    kind: "recall",
    id: "java-ehc-07",
    difficulty: 2,
    tags: ["equals-hashcode", "hashmap"],
    prompt: "Que se passe-t-il concrètement dans une `HashMap` quand une classe redéfinit `equals` mais pas `hashCode` ?",
    explanation:
      "`HashMap` range chaque clé dans un **bucket** choisi d'après `hashCode`. Sans redéfinition, `hashCode` vient d'`Object` et dépend de l'identité : deux objets égaux au sens d'`equals` ont presque toujours des `hashCode` différents, donc des buckets différents. `get`, `containsKey` et `put` ne regardent que le bucket calculé : ils n'appellent jamais `equals` sur l'objet égal rangé ailleurs. Résultat : doublons acceptés, recherches qui échouent, comportement qui semble aléatoire. Règle : `equals` et `hashCode` se redéfinissent **toujours ensemble**, sur les **mêmes champs**.",
    keyPoints: ["Bucket choisi par `hashCode`", "`equals` n'est testé que dans le bucket", "Égaux mais buckets différents → introuvables", "Toujours les deux, mêmes champs"],
  },
  {
    kind: "output",
    id: "java-ehc-08",
    difficulty: 2,
    tags: ["equals-hashcode", "null"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `String a = null;
System.out.println(Objects.equals(a, "x")
    + " " + Objects.equals(null, null));
System.out.println(a.equals("x"));`,
    },
    choices: [
      "`false true` puis `NullPointerException`.",
      "`false true` puis `false`.",
      "`NullPointerException` dès la première ligne.",
      "`false false` puis `false`.",
    ],
    answer: 0,
    explanation:
      "`Objects.equals(a, b)` gère `null` : `false` si un seul est `null`, `true` si les deux le sont. La première ligne affiche donc `false true`. La seconde appelle `equals` **sur** `null` : `NullPointerException`. D'où l'idiome `\"x\".equals(a)` ou `Objects.equals`.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Comparable vs Comparator
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-ehc-l2",
  title: "Comparable : l'ordre naturel ; Comparator : les autres",
  blocks: [
    {
      kind: "text",
      text: "`Comparable<T>` se déclare **dans la classe** et définit son **ordre naturel** par `compareTo`, utilisé par `Collections.sort`, `List.sort(null)`, `TreeSet` et `TreeMap`. `Comparator<T>` est un objet **externe** : on peut en écrire autant qu'il y a d'ordres utiles, et trier une classe qu'on ne possède pas.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ordre naturel dans la classe, ordres externes par composition.",
      code: `public record Employee(String name, int age)
        implements Comparable<Employee> {
    @Override
    public int compareTo(Employee o) {
        // jamais age - o.age : overflow possible
        return Integer.compare(age, o.age);
    }
}

Comparator<Employee> byName =
    Comparator.comparing(Employee::name);
Comparator<Employee> byAgeDescThenName =
    Comparator.comparingInt(Employee::age)
              .reversed()
              .thenComparing(Employee::name);

list.sort(null);              // ordre naturel
list.sort(byAgeDescThenName); // ordre externe`,
    },
    {
      kind: "text",
      text: "`compareTo` renvoie un entier négatif, nul ou positif : le signe seul compte. `comparing`, `thenComparing`, `reversed` et `nullsFirst` se composent en chaîne, et les lambdas remplacent les classes anonymes d'autrefois.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`TreeSet` et `TreeMap` n'utilisent **jamais** `equals` : deux éléments dont `compareTo` (ou le `Comparator`) renvoie 0 sont considérés identiques, et le second est ignoré. Un ordre « inconsistent with equals » fait disparaître des éléments.",
    },
    {
      kind: "text",
      text: "Autre classique : `return this.age - o.age`. Sur des entiers éloignés (`Integer.MIN_VALUE` et une valeur positive), la soustraction déborde et change de signe. `Integer.compare(a, b)` ne déborde jamais. Enfin, l'ordre naturel lève une `NullPointerException` sur `null` ; un `Comparator` peut le tolérer avec `nullsFirst` ou `nullsLast`.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "java-ehc-09",
    difficulty: 3,
    tags: ["comparator", "set", "equals-hashcode"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Set<String> s = new TreeSet<>(
    Comparator.comparingInt(String::length));
s.add("aa");
s.add("bb");
s.add("c");
System.out.println(s.size() + " " + s);`,
    },
    choices: ["`2 [c, aa]`", "`3 [c, aa, bb]`", "`3 [aa, bb, c]`", "`2 [aa, c]`"],
    answer: 0,
    explanation:
      "`TreeSet` ne connaît que le `Comparator`. `\"bb\"` a la même longueur que `\"aa\"` : comparaison 0, donc « déjà présent », ignoré. `\"c\"` (longueur 1) se place avant. Résultat : deux éléments, triés par longueur. Un `HashSet` aurait gardé les trois, car il utilise `equals`.",
  },
  {
    kind: "spot",
    id: "java-ehc-10",
    difficulty: 2,
    tags: ["comparable", "autoboxing"],
    prompt: "Le tri est parfois faux avec de très grandes ou très petites valeurs. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public class Score implements Comparable<Score> {
    private final int value;
    Score(int value) { this.value = value; }

    @Override
    public int compareTo(Score o) {
        return value - o.value;
    }
}`,
    },
    faultyLine: 7,
    reasons: [
      "`value - o.value` peut déborder et changer de signe (ex. `Integer.MIN_VALUE - 1`). Utiliser `Integer.compare(value, o.value)`.",
      "`compareTo` doit renvoyer exactement -1, 0 ou 1.",
      "`compareTo` doit prendre un `Object` en paramètre.",
      "Il manque `equals` et `hashCode`, sans lesquels `compareTo` ne fonctionne pas.",
    ],
    reasonAnswer: 0,
    explanation:
      "`Integer.MIN_VALUE - 1` vaut `Integer.MAX_VALUE` : la soustraction déborde silencieusement et le signe s'inverse, ce qui viole la transitivité et fait planter `TimSort` (« Comparison method violates its general contract »). `Integer.compare` compare sans arithmétique. Le contrat n'exige que le signe, et le type générique `Comparable<Score>` donne bien un paramètre `Score`.",
  },
  {
    kind: "recall",
    id: "java-ehc-11",
    difficulty: 2,
    tags: ["comparable", "comparator", "conception"],
    prompt: "Quand implémenter `Comparable`, et quand écrire un `Comparator` ?",
    explanation:
      "`Comparable` quand la classe a **un** ordre naturel évident et intrinsèque (`Integer`, `String`, `LocalDate`, un numéro de version) : il vit dans la classe, il est unique, et il est utilisé par défaut par `sort`, `TreeSet`, `TreeMap`. `Comparator` pour tous les **autres** ordres (par nom, par date décroissante, avec `null` en tête), pour trier une classe qu'on **ne possède pas**, ou quand aucun ordre n'est plus « naturel » qu'un autre. En pratique, `Comparator.comparing(...)` composé à la demande couvre la majorité des besoins, et implémenter `Comparable` sur une entité métier est souvent une erreur : son ordre dépend du contexte.",
    keyPoints: ["`Comparable` : un ordre naturel unique, dans la classe", "`Comparator` : ordres alternatifs, classes externes", "`TreeSet`/`sort(null)` utilisent l'ordre naturel", "Entité métier : plutôt `Comparator`"],
  },
  {
    kind: "fill",
    id: "java-ehc-12",
    difficulty: 2,
    tags: ["comparator", "lambdas"],
    prompt: "Trie par nom, puis par âge pour départager, le tout en ordre décroissant.",
    code: {
      language: "java",
      code: `list.sort(Comparator.{{1}}(Employee::name)
                    .{{2}}(Employee::age)
                    .{{3}}());`,
    },
    blanks: ["comparing", "thenComparing", "reversed"],
    distractors: ["compare", "sorted", "descending", "then"],
    explanation:
      "`Comparator.comparing(extracteur)` construit l'ordre principal, `thenComparing` ajoute le critère de départage, et `reversed()` placé en dernier inverse le comparateur **composé** entier. `Comparator.compare` n'existe pas en statique, `descending` non plus. Attention à la place de `reversed()` : appliqué juste après `comparing`, il n'inverserait que le nom.",
  },
  {
    kind: "output",
    id: "java-ehc-13",
    difficulty: 2,
    tags: ["comparable", "record", "generiques"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `record Item(String name) {}

List<Item> items = new ArrayList<>(
    List.of(new Item("b"), new Item("a")));
Collections.sort(items);
System.out.println(items);`,
    },
    choices: [
      "Erreur de compilation : `Item` n'implémente pas `Comparable`.",
      "`ClassCastException` à l'exécution.",
      "`[Item[name=a], Item[name=b]]`",
      "`[Item[name=b], Item[name=a]]` : sans ordre naturel, l'ordre d'insertion est conservé.",
    ],
    answer: 0,
    explanation:
      "`Collections.sort(List<T>)` exige `T extends Comparable<? super T>` : le compilateur refuse un `Item` sans ordre naturel. Nuance utile : `items.sort(null)` compilerait et lèverait `ClassCastException` à l'exécution, car le cast vers `Comparable` se fait tard. Solution : `items.sort(Comparator.comparing(Item::name))`.",
  },
  {
    kind: "recall",
    id: "java-ehc-14",
    difficulty: 2,
    tags: ["comparator", "set", "equals-hashcode"],
    prompt: "Pourquoi un `TreeSet` peut-il « perdre » des éléments qu'un `HashSet` aurait gardés ?",
    explanation:
      "`HashSet` définit l'unicité par `hashCode` + `equals`. `TreeSet` la définit par `compareTo` (ou son `Comparator`) : tout élément dont la comparaison avec un élément présent renvoie **0** est considéré comme déjà là et **ignoré**, même si `equals` dirait le contraire. Un comparateur partiel (par longueur, par date sans l'heure, par nom seul) écrase donc les « ex æquo ». La documentation appelle cela un ordre « inconsistent with equals ». Parade : comparer sur tous les champs qui définissent l'identité, ou terminer la chaîne par un critère discriminant (`thenComparing(id)`).",
    keyPoints: ["`TreeSet` : unicité par comparaison à 0", "`equals` jamais consulté", "Comparateur partiel → éléments perdus", "Départager avec `thenComparing`"],
  },
  {
    kind: "match",
    id: "java-ehc-15",
    difficulty: 2,
    tags: ["comparator"],
    prompt: "Associe chaque méthode de `Comparator` à son rôle.",
    pairs: [
      { left: "`comparing(extracteur)`", right: "Ordre principal sur une clé" },
      { left: "`thenComparing(...)`", right: "Départage des ex æquo" },
      { left: "`reversed()`", right: "Inverse l'ordre construit jusque-là" },
      { left: "`nullsFirst(cmp)`", right: "Tolère `null`, placé en tête" },
      { left: "`naturalOrder()`", right: "Délègue à `compareTo`" },
    ],
    explanation:
      "Ces méthodes se composent en chaîne, et l'ordre d'appel compte : `reversed()` s'applique à tout ce qui précède. `nullsFirst` enveloppe un comparateur qui, lui, n'a plus à gérer `null`. `naturalOrder()` est utile pour typer explicitement un ordre naturel, par exemple dans `nullsFirst(Comparator.naturalOrder())`.",
  },
  {
    kind: "output",
    id: "java-ehc-16",
    difficulty: 2,
    tags: ["comparator", "null"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<String> l = new ArrayList<>(
    Arrays.asList("b", null, "a"));
l.sort(Comparator.nullsFirst(
    Comparator.naturalOrder()));
System.out.println(l);`,
    },
    choices: ["`[null, a, b]`", "`NullPointerException`", "`[a, b, null]`", "`[b, null, a]`"],
    answer: 0,
    explanation:
      "`Arrays.asList` accepte `null` (contrairement à `List.of`). `nullsFirst` intercepte les `null` et les place en tête ; les autres éléments sont comparés par l'ordre naturel de `String`. Sans `nullsFirst`, `\"b\".compareTo(null)` lèverait une `NullPointerException`.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — record
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-ehc-l3",
  title: "record : une classe de données sans cérémonie",
  blocks: [
    {
      kind: "text",
      text: "Un `record` (Java 16) déclare ses **composants** dans l'en-tête et génère tout le reste : champs `private final`, constructeur canonique, accesseurs nommés comme les composants (`min()`, pas `getMin()`), et `equals`, `hashCode`, `toString` calculés sur **tous** les composants. C'est la réponse au boilerplate des classes de valeur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Constructeur compact pour valider, méthodes libres pour le reste.",
      code: `public record Range(int min, int max) {
    // constructeur compact : pas de this.min = min,
    // l'affectation aux champs est implicite à la fin
    public Range {
        if (min > max)
            throw new IllegalArgumentException("min > max");
    }

    public int length() { return max - min; }

    public static Range of(int a, int b) {
        return new Range(Math.min(a, b), Math.max(a, b));
    }
}

Range r = new Range(1, 5);
r.min();                    // 1
r.equals(new Range(1, 5));  // true, sur les composants
r.toString();               // Range[min=1, max=5]`,
    },
    {
      kind: "text",
      text: "Le **constructeur compact** s'écrit sans parenthèses : son corps s'exécute avant l'affectation implicite des champs, ce qui permet de valider ou normaliser les paramètres. Un record peut avoir des méthodes d'instance, des méthodes et champs `static`, et implémenter des interfaces.",
    },
    {
      kind: "text",
      text: "Ce qu'il interdit : hériter d'une classe (il étend implicitement `java.lang.Record` et est `final`), déclarer des champs d'instance en dehors des composants, et réaffecter un composant. Un record est donc immuable… en surface. En pratique, il remplace avantageusement une classe de valeur écrite à la main : DTO d'API, clé composite, résultat multiple d'une méthode.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "L'immuabilité est **superficielle** : un composant `List<String>` reste une liste modifiable si l'appelant en garde la référence. Copier défensivement dans le constructeur compact : `items = List.copyOf(items);`.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "java-ehc-17",
    difficulty: 1,
    tags: ["record", "equals-hashcode"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `record Point(int x, int y) {}

Point p = new Point(1, 2);
System.out.println(p.equals(new Point(1, 2))
    + " " + p);`,
    },
    choices: ["`true Point[x=1, y=2]`", "`false Point@1b6d3586`", "`true Point(1, 2)`", "Erreur de compilation : `equals` n'est pas défini."],
    answer: 0,
    explanation:
      "Un record génère `equals` et `hashCode` sur tous ses composants : deux `Point(1, 2)` sont égaux. Le `toString` généré a le format `Nom[composant=valeur, ...]`. L'adresse `@1b6d3586` serait le `toString` d'`Object`, celui d'une classe ordinaire.",
  },
  {
    kind: "spot",
    id: "java-ehc-18",
    difficulty: 2,
    tags: ["record", "heritage"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public record Employee(String name, int age) extends Person {
    public String initials() {
        return name.substring(0, 1);
    }
}`,
    },
    faultyLine: 1,
    reasons: [
      "Un record ne peut pas hériter d'une classe : il étend implicitement `java.lang.Record` et est `final`. Il peut seulement implémenter des interfaces.",
      "Il manque le constructeur canonique `Employee(String name, int age)`.",
      "Un record ne peut pas déclarer de méthode d'instance.",
      "`name` doit être déclaré `private final` explicitement.",
    ],
    reasonAnswer: 0,
    explanation:
      "La superclasse d'un record est toujours `java.lang.Record`, et `extends` est refusé (« record cannot inherit from class »). Les records favorisent la composition : mettre un composant `Person person` à la place. Le constructeur canonique est généré, les méthodes d'instance sont autorisées, et les champs sont créés à partir de l'en-tête.",
  },
  {
    kind: "mcq",
    id: "java-ehc-19",
    difficulty: 2,
    tags: ["record", "immuabilite", "collections"],
    prompt: "`record Cart(List<String> items) {}`. Que garantit l'immuabilité du record ?",
    choices: [
      "Que le champ `items` ne sera jamais réaffecté ; la liste elle-même reste modifiable. Copier avec `List.copyOf` dans le constructeur compact.",
      "Que la liste est aussi immuable : le compilateur l'enveloppe automatiquement.",
      "Rien : un record avec un composant `List` ne compile pas.",
      "Que `items()` renvoie une copie neuve à chaque appel.",
    ],
    answer: 0,
    explanation:
      "Le record fige la **référence**, pas l'objet. `new Cart(list)` puis `list.add(\"x\")` modifie le contenu vu par le record, et `cart.items().add(\"y\")` aussi. `public Cart { items = List.copyOf(items); }` rend la copie immuable et coupe le lien avec l'appelant. L'accesseur généré renvoie le champ tel quel, sans copie.",
  },
  {
    kind: "fill",
    id: "java-ehc-20",
    difficulty: 2,
    tags: ["record", "exceptions"],
    prompt: "Complète le constructeur compact qui valide et normalise l'email.",
    code: {
      language: "java",
      code: `public record Email(String value) {
    public {{1}} {
        if (value == null || !value.contains("@"))
            throw new {{2}}("email invalide");
        value = value.{{3}}();   // normalisation
    }
}`,
    },
    blanks: ["Email", "IllegalArgumentException", "toLowerCase"],
    distractors: ["Email(String value)", "record", "Exception", "IllegalArgument", "toLower"],
    explanation:
      "Le constructeur compact s'écrit `public Email {` sans liste de paramètres : ils sont implicites, et modifier `value` avant la fin change ce qui sera affecté au champ. `public Email(String value) {` serait le constructeur canonique explicite, qui exigerait `this.value = value`. `new Exception(...)` est checked et devrait être déclarée : `IllegalArgumentException` est l'exception idiomatique pour un argument invalide.",
  },
  {
    kind: "recall",
    id: "java-ehc-21",
    difficulty: 2,
    tags: ["record"],
    prompt: "Qu'est-ce qu'un `record` génère automatiquement, et qu'est-ce qu'il interdit ?",
    explanation:
      "**Généré** : un champ `private final` par composant, le constructeur canonique, un accesseur par composant (`name()`, sans `get`), et `equals`, `hashCode`, `toString` sur tous les composants. **Autorisé** : constructeur compact pour valider ou normaliser, méthodes d'instance, membres `static`, implémentation d'interfaces, redéfinition des méthodes générées. **Interdit** : `extends` (superclasse imposée `java.lang.Record`, classe `final`), champs d'instance hors composants, réaffectation d'un composant, déclarer la classe `abstract`. L'immuabilité ne porte que sur les références : un composant mutable reste mutable.",
    keyPoints: ["Champs, constructeur, accesseurs, equals/hashCode/toString", "Compact pour valider", "Pas d'`extends`, pas de champ hors composants", "Immuabilité superficielle"],
  },
  {
    kind: "mcq",
    id: "java-ehc-22",
    difficulty: 1,
    tags: ["record"],
    prompt: "Quel accesseur un record génère-t-il pour le composant `price` ?",
    choices: ["`price()`", "`getPrice()`", "Un champ public `price`, sans méthode", "`getPrice()` et `price()`, au choix"],
    answer: 0,
    explanation:
      "Les accesseurs de record portent le nom exact du composant, sans préfixe `get`. Cela surprend les frameworks qui reposent sur la convention JavaBean, mais Jackson, Spring et JPA (pour les projections) savent lire les records depuis plusieurs versions. Le champ, lui, reste `private final`.",
  },
  {
    kind: "order",
    id: "java-ehc-23",
    difficulty: 2,
    tags: ["record", "constructeurs"],
    prompt: "`Range` a un constructeur compact qui valide. Remets dans l'ordre ce qui se passe lors de `new Range(1, 5)`.",
    items: [
      "Les arguments sont reçus dans les paramètres implicites `min` et `max`",
      "Le corps du constructeur compact s'exécute (validation, normalisation)",
      "Les paramètres, éventuellement modifiés, sont affectés aux champs `final`",
      "L'objet est disponible, ses accesseurs renvoient les valeurs affectées",
    ],
    explanation:
      "Dans un constructeur compact, l'affectation `this.min = min; this.max = max;` est insérée par le compilateur **à la fin**. C'est pourquoi on peut valider et même réassigner un paramètre (`value = value.trim()`) : c'est la valeur finale du paramètre qui sera stockée. Écrire `this.min = ...` dans un constructeur compact est une erreur de compilation.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — enum
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-ehc-l4",
  title: "enum : un ensemble fermé d'instances",
  blocks: [
    {
      kind: "text",
      text: "Une `enum` est une classe dont les instances sont **fixées à la compilation** : chaque constante est un singleton, créé une seule fois. On peut lui donner des champs, un constructeur (implicitement `private`), des méthodes, et lui faire implémenter des interfaces. Elle hérite de `java.lang.Enum`, est `final` (sauf corps de constante) et ne peut pas hériter d'une classe.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Champs, constructeur, méthode abstraite par constante, switch.",
      code: `public enum Status {
    DRAFT("Brouillon") {
        @Override boolean canEdit() { return true; }
    },
    SENT("Envoyé") {
        @Override boolean canEdit() { return false; }
    };

    private final String label;
    Status(String label) { this.label = label; }
    public String label() { return label; }
    abstract boolean canEdit();
}

Status s = Status.valueOf("SENT");
// IllegalArgumentException si le nom est inconnu
if (s == Status.SENT) { ... }   // == : sûr et null-safe
String msg = switch (s) {       // exhaustif, sans default
    case DRAFT -> "à finir";
    case SENT  -> "parti";
};`,
    },
    {
      kind: "text",
      text: "Comparer avec `==` est correct et même préférable à `equals` : une constante est unique, le compilateur vérifie les types, et `null == Status.SENT` renvoie `false` au lieu de lever. `values()` renvoie toutes les constantes dans l'ordre de déclaration, `valueOf(String)` retrouve une constante par son nom exact.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`ordinal()` est la position de déclaration. Ne jamais la persister ni s'en servir comme identifiant : insérer une constante décale tout. Persister `name()`, ou un code explicite porté par un champ.",
    },
    {
      kind: "text",
      text: "Pour les collections indexées par enum, `EnumMap` et `EnumSet` sont plus compacts et plus rapides que `HashMap` et `HashSet` : ils s'appuient sur l'ordinal en interne, sans hachage.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "java-ehc-24",
    difficulty: 2,
    tags: ["enum", "exceptions"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `enum Level { LOW, HIGH }

System.out.println(Level.valueOf("low"));`,
    },
    choices: ["`IllegalArgumentException`", "`LOW`", "`null`", "Erreur de compilation : `valueOf` attend un `Level`."],
    answer: 0,
    explanation:
      "`valueOf` exige le nom **exact**, casse comprise : `\"low\"` ne correspond à aucune constante, d'où `IllegalArgumentException: No enum constant Level.low`. Pour une entrée utilisateur, normaliser avant (`toUpperCase`) ou parcourir `values()` et renvoyer un `Optional`.",
  },
  {
    kind: "mcq",
    id: "java-ehc-25",
    difficulty: 2,
    tags: ["enum", "egalite"],
    prompt: "Pour comparer deux valeurs d'une `enum`, `==` ou `equals` ?",
    choices: [
      "`==` : chaque constante est unique, la comparaison est vérifiée à la compilation et ne lève pas de `NullPointerException` si l'un des deux est `null`.",
      "`equals` obligatoirement : `==` compare des références et peut être faux.",
      "`==` ne fonctionne qu'après avoir comparé les `ordinal()`.",
      "Aucun des deux : il faut comparer `name()`.",
    ],
    answer: 0,
    explanation:
      "Une constante d'enum n'existe qu'en un exemplaire par JVM : `==` compare bien deux références au même objet. `equals` marche aussi, mais compile avec n'importe quel `Object` (erreur de type silencieuse) et lève une `NullPointerException` si le récepteur est `null`. C'est un des rares cas où `==` sur des objets est la bonne réponse.",
  },
  {
    kind: "spot",
    id: "java-ehc-26",
    difficulty: 2,
    tags: ["enum", "conception"],
    prompt: "Après l'ajout d'une constante `URGENT` en tête de `Priority`, les priorités relues depuis la base sont toutes décalées. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `void save(Task t) {
    db.write("priority", t.priority().ordinal());
    db.write("title", t.title());
}`,
    },
    faultyLine: 2,
    reasons: [
      "`ordinal()` dépend de la position de déclaration : insérer ou réordonner une constante change toutes les valeurs stockées. Persister `name()` ou un code explicite.",
      "`ordinal()` commence à 1, il faut soustraire 1.",
      "`write` n'accepte pas un `int` : il faut `String.valueOf(...)`.",
      "`priority()` doit être synchronisée.",
    ],
    reasonAnswer: 0,
    explanation:
      "Avant l'ajout, `LOW` valait 0 ; après, `URGENT` vaut 0 et `LOW` vaut 1 : chaque valeur en base désigne désormais une autre constante. `name()` est stable tant qu'on ne renomme pas, et un champ `code` explicite l'est même en cas de renommage. Même règle en JPA : `@Enumerated(EnumType.STRING)`, jamais `ORDINAL`.",
  },
  {
    kind: "fill",
    id: "java-ehc-27",
    difficulty: 2,
    tags: ["enum"],
    prompt: "Complète l'enum et son usage.",
    code: {
      language: "java",
      code: `public enum Unit {
    KM(1000), M(1);

    private final int meters;

    {{1}}(int meters) { this.meters = meters; }

    public int toMeters(int v) { return v * meters; }
}

Unit u = Unit.{{2}}("KM");
for (Unit x : Unit.{{3}}()) {
    System.out.println(x.name());
}`,
    },
    blanks: ["Unit", "valueOf", "values"],
    distractors: ["public Unit", "new", "of", "list", "ordinal"],
    explanation:
      "Le constructeur d'une enum porte le nom de l'enum et est implicitement `private` : `public Unit(...)` est refusé (« modifier public not allowed here »). `valueOf(String)` retrouve une constante par son nom, `values()` renvoie le tableau de toutes les constantes. `of` et `list` n'existent pas.",
  },
  {
    kind: "match",
    id: "java-ehc-28",
    difficulty: 1,
    tags: ["enum"],
    prompt: "Associe chaque membre d'une enum à son rôle.",
    pairs: [
      { left: "`values()`", right: "Tableau de toutes les constantes, dans l'ordre" },
      { left: "`valueOf(String)`", right: "Constante par son nom exact, sinon exception" },
      { left: "`name()`", right: "Nom de la constante, stable" },
      { left: "`ordinal()`", right: "Position de déclaration, fragile" },
      { left: "`EnumMap`", right: "`Map` optimisée pour des clés enum" },
    ],
    explanation:
      "`values()` et `valueOf` sont générés par le compilateur pour chaque enum ; `name()` et `ordinal()` viennent de `java.lang.Enum`. `EnumMap` et `EnumSet` exploitent l'ordinal en interne (tableau, bitset) : rapides et compacts, mais l'ordinal n'apparaît jamais dans votre code.",
  },
  {
    kind: "recall",
    id: "java-ehc-29",
    difficulty: 3,
    tags: ["enum", "conception"],
    prompt: "Qu'apporte une `enum` par rapport à des constantes `public static final int STATUS_DRAFT = 0` ?",
    explanation:
      "**Sécurité de type** : une méthode qui prend un `Status` ne peut pas recevoir un `int` quelconque, le compilateur le refuse. **Espace de noms** : `Status.DRAFT` plutôt que des préfixes. **Exhaustivité** : un `switch` expression sur une enum doit couvrir toutes les constantes, et ajouter une constante fait échouer la compilation là où il manque un cas. **Comportement et état** : champs, méthodes, méthodes abstraites par constante. **Singleton garanti** et `==` sûr. **Introspection** : `values()`, `name()`. Les `int` constants n'offrent rien de tout cela : ils s'additionnent, se confondent avec d'autres entiers et s'affichent comme des nombres.",
    keyPoints: ["Typage fort", "`switch` exhaustif", "Champs et méthodes", "Singleton, `==`", "`values()` / `name()`"],
  },
  {
    kind: "output",
    id: "java-ehc-30",
    difficulty: 3,
    tags: ["enum", "polymorphisme"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `enum Op {
    ADD { int apply(int a, int b) { return a + b; } },
    MUL { int apply(int a, int b) { return a * b; } };

    abstract int apply(int a, int b);
}

int r = 0;
for (Op op : Op.values()) r += op.apply(2, 3);
System.out.println(r + " " + Op.MUL.ordinal());`,
    },
    choices: ["`11 1`", "`11 2`", "`30 1`", "Erreur de compilation : une enum ne peut pas déclarer de méthode abstraite."],
    answer: 0,
    explanation:
      "Chaque constante avec un corps `{ ... }` est une sous-classe anonyme de `Op` qui implémente `apply` : c'est autorisé, et c'est le pattern Strategy sans classes séparées. `ADD.apply(2, 3)` = 5, `MUL.apply(2, 3)` = 6, somme 11. `ordinal()` commence à 0 : `MUL` est en deuxième position, donc 1.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-equals-hashcode-comparable",
  title: "equals/hashCode, Comparable vs Comparator, record, enum",
  objective:
    "Écrire un equals/hashCode correct, choisir entre Comparable et Comparator, et utiliser record et enum sans leurs pièges.",
  prerequisites: ["java-interfaces-classes-abstraites"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
