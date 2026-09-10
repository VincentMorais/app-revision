/**
 * Java — Interfaces et classes abstraites (référentiel 1.2 POO).
 * Chapitre étalon : 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — L'interface : un contrat sans état
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-ica-l1",
  title: "L'interface : un contrat sans état",
  blocks: [
    {
      kind: "text",
      text: "Une interface décrit **ce qu'un objet sait faire**, jamais comment. Elle ne porte aucun état d'instance : pas de champ modifiable, pas de constructeur. Tout membre déclaré sans modificateur y est `public`, et une méthode sans corps y est implicitement `public abstract`.",
    },
    {
      kind: "text",
      text: "Une classe qui `implements` une interface s'engage à fournir chaque méthode, avec la même signature et une visibilité `public`. Réduire la visibilité est refusé par le compilateur : on ne peut pas promettre `public` puis livrer moins.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le contrat d'un côté, une implémentation de l'autre.",
      code: `public interface PaymentMethod {
    // public static final implicite : une constante
    int MAX_RETRIES = 3;

    // public abstract implicite
    boolean pay(Order order);
    String label();
}

public class CardPayment implements PaymentMethod {
    // l'état vit dans l'implémentation
    private final Gateway gateway;

    CardPayment(Gateway gateway) {
        this.gateway = gateway;
    }

    @Override
    public boolean pay(Order order) {   // public obligatoire
        return gateway.charge(order.total());
    }

    @Override
    public String label() { return "Carte"; }
}`,
    },
    {
      kind: "text",
      text: "Comme une interface n'a pas d'état, une classe peut en implémenter plusieurs sans ambiguïté sur les données : c'est la réponse de Java à l'héritage multiple. Une interface peut aussi `extends` une ou plusieurs autres interfaces.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Les champs déclarés dans une interface existent, mais ce sont des constantes : implicitement `public static final`, initialisées à la déclaration et partagées par toutes les implémentations. `MAX_RETRIES` n'est pas un champ d'instance.",
    },
    {
      kind: "text",
      text: "Une interface avec une seule méthode abstraite est dite **fonctionnelle** : on peut l'implémenter par une lambda, comme `Runnable` ou `Comparator`. Les méthodes `default` ne comptent pas dans cette unique méthode.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-ica-01",
    difficulty: 1,
    tags: ["interfaces", "constantes"],
    prompt: "Dans `interface Config { int TIMEOUT = 30; }`, qu'est `TIMEOUT` ?",
    choices: [
      "Une constante : implicitement `public static final`, partagée par toutes les implémentations.",
      "Un champ d'instance que chaque classe implémentant `Config` reçoit en héritage.",
      "Un champ `private final` accessible via un getter généré.",
      "Une erreur de compilation : une interface ne peut pas déclarer de champ.",
    ],
    answer: 0,
    explanation:
      "Une interface ne porte pas d'état d'instance. Tout champ y est implicitement `public static final`, donc une constante à initialiser sur place. Si chaque implémentation a besoin de sa propre valeur, le champ doit vivre dans la classe, pas dans l'interface.",
  },
  {
    kind: "fill",
    id: "java-ica-02",
    difficulty: 1,
    tags: ["interfaces", "visibilite"],
    prompt: "Complète pour que `EmailSender` respecte le contrat de `Sender`.",
    code: {
      language: "java",
      code: `public {{1}} Sender {
    void send(String to, String body);
}

public class EmailSender {{2}} Sender {
    @Override
    {{3}} void send(String to, String body) {
        smtp.deliver(to, body);
    }
}`,
    },
    blanks: ["interface", "implements", "public"],
    distractors: ["abstract", "extends", "protected", "default"],
    explanation:
      "`Sender` est une interface (`interface`), adoptée par `implements`. La méthode du contrat est implicitement `public` : l'implémentation doit l'être aussi. `protected` ou package-private réduirait la visibilité, ce que le compilateur refuse.",
  },
  {
    kind: "output",
    id: "java-ica-03",
    difficulty: 2,
    tags: ["interfaces", "visibilite"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `interface Greeter {
    String greet(String name);
}

class French implements Greeter {
    String greet(String name) {
        return "Bonjour " + name;
    }
}

System.out.println(new French().greet("Ana"));`,
    },
    choices: [
      "Erreur de compilation : `greet` réduit la visibilité (package-private au lieu de `public`).",
      "Affiche `Bonjour Ana`.",
      "Erreur à l'exécution : `AbstractMethodError`.",
      "Compile avec un avertissement, puis affiche `Bonjour Ana`.",
    ],
    answer: 0,
    explanation:
      "Une méthode d'interface est implicitement `public`. `French.greet` sans modificateur est package-private : c'est une visibilité plus faible, et le compilateur refuse (« attempting to assign weaker access privileges »). `AbstractMethodError` est une erreur d'exécution rare, liée à des classes compilées séparément avec des versions incompatibles.",
  },
  {
    kind: "spot",
    id: "java-ica-04",
    difficulty: 2,
    tags: ["interfaces", "constantes"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public interface Counter {
    private int count;
    void increment();
    int value();
}`,
    },
    faultyLine: 2,
    reasons: [
      "Une interface ne porte pas d'état : un champ y est implicitement `public static final`, doit être initialisé, et ne peut pas être `private`.",
      "`private` est interdit, mais `int count;` sans modificateur aurait été accepté comme champ d'instance.",
      "Il manque un getter et un setter pour `count`.",
      "Les méthodes `increment` et `value` doivent être marquées `abstract` explicitement.",
    ],
    reasonAnswer: 0,
    explanation:
      "Deux problèmes sur la même ligne, une seule cause : une interface n'a pas d'état. Le modificateur `private` est refusé sur un champ d'interface, et même `int count;` échouerait car un champ d'interface est une constante `public static final` qui exige une valeur. Le compteur doit vivre dans la classe qui implémente `Counter`.",
  },
  {
    kind: "match",
    id: "java-ica-05",
    difficulty: 1,
    tags: ["interfaces"],
    prompt: "Associe chaque élément d'une interface à ce qu'il implique.",
    pairs: [
      { left: "Méthode sans corps", right: "`public abstract` implicite" },
      { left: "Champ", right: "`public static final` implicite" },
      { left: "`implements` sur une classe", right: "La classe adopte le contrat" },
      { left: "`extends` entre interfaces", right: "Une interface hérite d'une autre" },
    ],
    explanation:
      "Les mots-clés implicites sont la source de la plupart des erreurs : on oublie que la méthode est publique (visibilité réduite refusée) ou que le champ est une constante. Entre interfaces, on utilise `extends`, pas `implements`, et on peut en étendre plusieurs.",
  },
  {
    kind: "recall",
    id: "java-ica-06",
    difficulty: 2,
    tags: ["interfaces", "heritage"],
    prompt: "Pourquoi une classe Java peut-elle implémenter plusieurs interfaces, alors qu'elle ne peut hériter que d'une seule classe ?",
    explanation:
      "L'héritage multiple de **classes** pose le problème du diamant sur l'**état** : si deux parents portent un champ ou une implémentation, laquelle hérite-t-on ? Java l'évite en limitant à une superclasse. Une interface n'a ni champ d'instance ni constructeur : en implémenter plusieurs ne crée aucune ambiguïté sur les données. Depuis Java 8, les méthodes `default` réintroduisent un petit diamant sur le **comportement**, que Java résout par des règles précises ou en exigeant une redéfinition explicite.",
    keyPoints: ["Diamant = ambiguïté sur l'état hérité", "Interface : pas d'état, pas de constructeur", "Depuis Java 8, conflit possible entre `default`, résolu explicitement"],
  },
  {
    kind: "mcq",
    id: "java-ica-07",
    difficulty: 2,
    tags: ["interfaces", "conception"],
    prompt: "`Bird` et `Airplane extends Vehicle` n'ont aucun lien, mais toutes deux doivent pouvoir être passées à `void launch(Flyable f)`. Comment définir `Flyable` ?",
    choices: [
      "Une interface : `Airplane` hérite déjà de `Vehicle`, et voler est une capacité que des classes sans lien peuvent partager.",
      "Une classe abstraite `Flyable` dont `Bird` et `Airplane` héritent.",
      "Une classe concrète `Flyable` avec un champ `altitude`, étendue par les deux.",
      "Une interface fonctionnelle passée en lambda : `launch(() -> bird.fly())`.",
    ],
    answer: 0,
    explanation:
      "`Airplane` a déjà consommé son unique héritage avec `Vehicle` : une classe abstraite `Flyable` est impossible. Une interface décrit une capacité transversale, indépendante de la hiérarchie. La lambda ne répond pas au besoin : on veut passer l'objet lui-même, pas un comportement isolé.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — La classe abstraite : un squelette avec de l'état
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-ica-l2",
  title: "La classe abstraite : un squelette avec de l'état",
  blocks: [
    {
      kind: "text",
      text: "Une classe abstraite est une classe qu'on ne peut pas instancier, conçue pour être héritée. Contrairement à l'interface, elle porte de l'**état** (des champs), des **constructeurs** et du code concret, à côté de méthodes `abstract` que les sous-classes doivent fournir.",
    },
    {
      kind: "text",
      text: "Le mot-clé `abstract` sur une méthode impose sa redéfinition et oblige la classe à être `abstract` elle aussi. L'inverse n'est pas vrai : une classe abstraite peut n'avoir aucune méthode abstraite, simplement pour interdire `new`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Template method : le déroulé est fixé, l'étape variable est déléguée.",
      code: `public abstract class Notification {
    // état partagé par les sous-classes
    private final String recipient;

    // appelé par les sous-classes via super(...)
    protected Notification(String recipient) {
        this.recipient = recipient;
    }

    // final : le déroulé ne se redéfinit pas
    public final String send() {
        return "To " + recipient + ": " + body();
    }

    // l'étape que chaque sous-classe fournit
    protected abstract String body();
}

public class Sms extends Notification {
    public Sms(String phone) { super(phone); }

    @Override
    protected String body() { return "SMS"; }
}`,
    },
    {
      kind: "text",
      text: "C'est l'usage typique : le **template method**. La classe abstraite fixe l'algorithme dans une méthode concrète, souvent `final`, et délègue les étapes variables à des méthodes abstraites. Le prix à payer : une classe n'hérite que d'une seule classe. Choisir une classe abstraite consomme cet unique héritage.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Ne jamais appeler une méthode redéfinissable depuis un constructeur. Le constructeur du parent s'exécute avant l'initialisation des champs de l'enfant : la méthode redéfinie voit des champs à `null` ou 0.",
    },
    {
      kind: "comparison",
      title: "Choisir",
      left: { label: "Interface", text: "Une capacité, combinable, sans état. Des classes sans lien peuvent l'offrir." },
      right: { label: "Classe abstraite", text: "De l'état et du code partagés entre sous-classes proches. Héritage unique." },
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "java-ica-08",
    difficulty: 1,
    tags: ["classes-abstraites"],
    prompt: "Laquelle de ces affirmations sur une classe abstraite est vraie ?",
    choices: [
      "Elle peut avoir un constructeur, appelé par les constructeurs de ses sous-classes.",
      "Elle doit contenir au moins une méthode abstraite.",
      "Elle ne peut pas contenir de méthode avec un corps.",
      "On peut l'instancier dès que toutes ses méthodes ont un corps.",
    ],
    answer: 0,
    explanation:
      "Le constructeur d'une classe abstraite existe et sert à initialiser son état ; il est appelé via `super(...)`. Aucune méthode abstraite n'est requise : déclarer `abstract` une classe sans méthode abstraite est un moyen d'interdire `new`. Et une classe abstraite mélange librement méthodes concrètes et abstraites.",
  },
  {
    kind: "output",
    id: "java-ica-09",
    difficulty: 2,
    tags: ["classes-abstraites", "template-method"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `abstract class Report {
    final String render() { return header() + body(); }
    String header() { return "== "; }
    abstract String body();
}

class SalesReport extends Report {
    String body() { return "sales"; }
}

System.out.println(new SalesReport().render());`,
    },
    choices: ["`== sales`", "`sales`", "`== `", "Erreur de compilation : `render()` est `final` et ne peut pas être héritée."],
    answer: 0,
    explanation:
      "`render()` est le template method : il enchaîne `header()` (concret, hérité tel quel) et `body()` (abstrait, fourni par `SalesReport`). `final` interdit de redéfinir `render`, pas de l'hériter ni de l'appeler. Résultat : `== sales`.",
  },
  {
    kind: "spot",
    id: "java-ica-10",
    difficulty: 2,
    tags: ["classes-abstraites", "heritage"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public abstract class Shape {
    public abstract double area();
    public abstract double perimeter();
}
public class Circle extends Shape {
    private final double r;
    public Circle(double r) { this.r = r; }
    @Override public double area() { return Math.PI * r * r; }
}`,
    },
    faultyLine: 5,
    reasons: [
      "`Circle` est déclarée concrète mais n'implémente pas `perimeter()` : elle doit la fournir ou être `abstract`.",
      "Une classe abstraite ne peut pas déclarer deux méthodes abstraites.",
      "Le constructeur de `Circle` doit appeler `super()` explicitement.",
      "`area()` ne peut pas porter `@Override` puisqu'elle est abstraite dans le parent.",
    ],
    reasonAnswer: 0,
    explanation:
      "Une classe concrète doit honorer toutes les méthodes abstraites héritées. `Circle` oublie `perimeter()` : le compilateur dit « Circle is not abstract and does not override abstract method perimeter() ». L'appel à `super()` sans argument est implicite, et `@Override` s'applique bien à l'implémentation d'une méthode abstraite.",
  },
  {
    kind: "fill",
    id: "java-ica-11",
    difficulty: 2,
    tags: ["classes-abstraites", "constructeurs"],
    prompt: "Complète pour que `Vehicle` soit un squelette et `Bike` une implémentation.",
    code: {
      language: "java",
      code: `public {{1}} class Vehicle {
    private final String name;

    {{2}} Vehicle(String name) { this.name = name; }

    public {{3}} int wheels();

    public String describe() {
        return name + " : " + wheels() + " roues";
    }
}

public class Bike extends Vehicle {
    public Bike() { {{4}}("Vélo"); }

    @Override
    public int wheels() { return 2; }
}`,
    },
    blanks: ["abstract", "protected", "abstract", "super"],
    distractors: ["interface", "private", "static", "this", "final"],
    explanation:
      "`Vehicle` contient une méthode sans corps : elle est `abstract`, et la classe aussi. Son constructeur est `protected` : réservé aux sous-classes (et au package), puisque personne ne fera `new Vehicle(...)`. `public` compilerait aussi mais promettrait plus que nécessaire ; `private` empêcherait `Bike` de l'appeler. `Bike` initialise l'état du parent par `super(\"Vélo\")`, jamais par `this(...)`.",
  },
  {
    kind: "output",
    id: "java-ica-12",
    difficulty: 3,
    tags: ["classes-abstraites", "constructeurs", "initialisation"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `abstract class Base {
    Base() { init(); }
    abstract void init();
}

class Child extends Base {
    private String name = "child";

    @Override
    void init() { System.out.println("name=" + name); }
}

new Child();`,
    },
    choices: ["`name=null`", "`name=child`", "`NullPointerException`", "Erreur de compilation : appel d'une méthode abstraite dans un constructeur."],
    answer: 0,
    explanation:
      "Ordre d'exécution de `new Child()` : constructeur de `Base` d'abord, qui appelle `init()`, résolu dynamiquement sur `Child`. À ce moment, les initialiseurs de champs de `Child` n'ont pas encore tourné : `name` vaut `null`. Pas d'exception, car on concatène `null` dans une chaîne. C'est pourquoi on n'appelle jamais de méthode redéfinissable depuis un constructeur. Nuance : si `name` était déclaré `final String name = \"child\"`, ce serait une constante de compilation, inlinée par `javac`, et le programme afficherait `name=child`.",
  },
  {
    kind: "mcq",
    id: "java-ica-13",
    difficulty: 2,
    tags: ["classes-abstraites", "conception"],
    prompt: "`Invoice`, `Receipt` et `Quote` doivent partager un compteur de séquence et une méthode `format()` commune, chacune définissant seulement son `title()`. Que choisir ?",
    choices: [
      "Une classe abstraite `Document` : état partagé (le compteur) et template method `format()` qui appelle `title()` abstraite.",
      "Une interface `Document` avec `format()` en méthode `default` et un champ `int seq`.",
      "Une interface `Document` que chacune implémente en copiant `format()`.",
      "Trois classes indépendantes : le partage de code entre types différents est un anti-pattern.",
    ],
    answer: 0,
    explanation:
      "Il y a de l'**état** à partager (le compteur) : seule une classe abstraite peut le porter. Un `int seq` dans une interface serait une constante `static final`, pas un compteur. Copier `format()` trois fois est la duplication que le template method évite précisément.",
  },
  {
    kind: "order",
    id: "java-ica-14",
    difficulty: 2,
    tags: ["heritage", "constructeurs", "initialisation"],
    prompt: "`Child extends Parent`, chacune avec des champs initialisés et un constructeur. Remets dans l'ordre ce qui s'exécute lors du tout premier `new Child()`.",
    items: [
      "Blocs `static` et champs `static` de `Parent`",
      "Blocs `static` et champs `static` de `Child`",
      "Initialiseurs de champs d'instance de `Parent`",
      "Corps du constructeur de `Parent`",
      "Initialiseurs de champs d'instance de `Child`",
      "Corps du constructeur de `Child`",
    ],
    explanation:
      "Le statique d'abord, du parent vers l'enfant, une seule fois, à l'initialisation de chaque classe lors de sa première utilisation. Puis, pour chaque `new` : le constructeur de `Child` commence par `super(...)`, ce qui exécute les initialiseurs de champs de `Parent` puis son constructeur ; seulement ensuite les champs de `Child` sont initialisés et son constructeur s'exécute. C'est cet ordre qui rend dangereux l'appel d'une méthode redéfinie depuis le constructeur du parent.",
  },
  {
    kind: "recall",
    id: "java-ica-15",
    difficulty: 3,
    tags: ["heritage", "conception", "composition"],
    prompt: "Un collègue propose une classe abstraite `BaseService` dont hériteraient tous les services de l'application, pour partager un logger et quelques utilitaires. Que lui réponds-tu ?",
    explanation:
      "L'héritage sert à modéliser une relation **« est un »** avec un comportement réellement commun, pas à partager des utilitaires. `BaseService` consommerait l'unique héritage de chaque service, coupler tout le monde à une classe qui grossit avec le temps, et rendrait les tests plus lourds (il faut instancier la base). Préférer la **composition** : injecter le logger et les utilitaires comme dépendances, ou les mettre dans des classes dédiées. Règle du référentiel : la composition est presque toujours préférable à l'héritage.",
    keyPoints: ["Héritage = « est un », pas « utilise »", "Consomme l'unique héritage", "Couplage et god class", "Composition : injecter les dépendances"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — default, static, private : du code dans une interface
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-ica-l3",
  title: "default, static, private : du code dans une interface",
  blocks: [
    {
      kind: "text",
      text: "Depuis Java 8, une interface peut contenir du code. Une méthode `default` a un corps et est héritée par les implémentations, qui peuvent la redéfinir. Une méthode `static` a un corps mais **n'est pas héritée** : de l'extérieur, on l'appelle uniquement via le nom de l'interface. Depuis Java 9, une méthode `private` sert de code partagé entre les méthodes `default`, invisible de l'extérieur.",
    },
    {
      kind: "text",
      text: "Les méthodes `default` existent pour faire évoluer une interface sans casser ses implémentations existantes : `Collection.stream()` et `Iterable.forEach()` ont été ajoutées ainsi. Elles ne changent pas la nature de l'interface, qui reste sans état.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Conflit entre deux default : la classe tranche explicitement.",
      code: `public interface Walker {
    default String move() { return "walk"; }
}
public interface Swimmer {
    default String move() { return "swim"; }
}

public class Duck implements Walker, Swimmer {
    // obligatoire : deux default en conflit
    @Override
    public String move() {
        return Walker.super.move()
             + " & " + Swimmer.super.move();
    }
}

public interface Ids {
    // non héritée : appel par Ids.next()
    static String next() {
        return UUID.randomUUID().toString();
    }
    default String prefixed(String p) {
        return p + "-" + clean(next());
    }
    // Java 9+ : partagé entre les default
    private String clean(String s) {
        return s.replace("-", "");
    }
}`,
    },
    {
      kind: "text",
      text: "Comme une classe peut implémenter plusieurs interfaces, deux méthodes `default` de même signature peuvent entrer en conflit. Java tranche dans cet ordre : une méthode héritée d'une **classe** gagne toujours sur une `default` ; sinon l'interface la plus **spécifique** (celle qui étend l'autre) gagne ; sinon la classe doit redéfinir la méthode, et peut déléguer avec `Nom.super.methode()`.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "De l'extérieur, `next()` s'appelle uniquement par `Ids.next()` ; dans le corps de l'interface, le nom simple suffit, comme dans `prefixed`. `new Impl().next()` et `Impl.next()` ne compilent pas : les méthodes `static` d'interface ne sont pas héritées, contrairement à celles d'une classe.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "java-ica-16",
    difficulty: 2,
    tags: ["interfaces", "default-methods"],
    prompt: "Une classe implémente deux interfaces sans lien entre elles, qui déclarent chacune `default void log()`. Que se passe-t-il ?",
    choices: [
      "Erreur de compilation : la classe doit redéfinir `log()` pour lever l'ambiguïté.",
      "La méthode de la première interface citée dans `implements` est utilisée.",
      "Java choisit la plus spécifique selon la hiérarchie des interfaces.",
      "Erreur à l'exécution : `IncompatibleClassChangeError`.",
    ],
    answer: 0,
    explanation:
      "Deux `default` de même signature héritées d'interfaces sans lien créent un conflit que le compilateur refuse (« inherits unrelated defaults »). La classe doit redéfinir la méthode et peut déléguer avec `A.super.log()`. La règle « la plus spécifique gagne » ne s'applique que si une interface étend l'autre ; l'ordre dans `implements` ne compte jamais.",
  },
  {
    kind: "output",
    id: "java-ica-17",
    difficulty: 2,
    tags: ["default-methods", "heritage"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `interface Greeter {
    default String hello() { return "iface"; }
}

class Base {
    public String hello() { return "class"; }
}

class Impl extends Base implements Greeter {}

System.out.println(new Impl().hello());`,
    },
    choices: ["`class`", "`iface`", "Erreur de compilation : conflit entre `Base.hello` et `Greeter.hello`.", "Erreur à l'exécution : méthode ambiguë."],
    answer: 0,
    explanation:
      "Première règle de résolution : une méthode héritée d'une **classe** gagne toujours sur une méthode `default`. `Impl` hérite `hello()` de `Base`, et `Greeter.hello()` est simplement ignorée. Il n'y a conflit que lorsque deux `default` s'affrontent sans qu'une classe tranche.",
  },
  {
    kind: "fill",
    id: "java-ica-18",
    difficulty: 2,
    tags: ["default-methods"],
    prompt: "Fais déléguer `Robot.move()` à l'implémentation de `Walker`.",
    code: {
      language: "java",
      code: `// Walker et Swimmer déclarent chacune
// une méthode default void move()
public class Robot implements Walker, Swimmer {
    @Override
    public void move() {
        {{1}}.{{2}}.move();
    }
}`,
    },
    blanks: ["Walker", "super"],
    distractors: ["this", "Robot", "default", "Swimmer"],
    explanation:
      "La syntaxe est `Interface.super.methode()`. `super.move()` seul viserait la superclasse (`Object`), qui n'a pas de `move`. `Walker.move()` désignerait une méthode `static`, qui n'existe pas. Et `Swimmer.super.move()` compilerait, mais déléguerait à la mauvaise interface.",
  },
  {
    kind: "recall",
    id: "java-ica-19",
    difficulty: 2,
    tags: ["interfaces", "static-methods"],
    prompt: "Les méthodes `static` déclarées dans une interface sont-elles héritées par les classes qui l'implémentent ? Comment les appelle-t-on ?",
    explanation:
      "Non. Contrairement aux méthodes `static` d'une classe, celles d'une interface **ne sont pas héritées** : ni par les classes qui l'implémentent, ni par les interfaces qui l'étendent. De l'extérieur, on les appelle uniquement par le nom de l'interface : `Ids.next()` (dans le corps de l'interface, le nom simple suffit). `new Impl().next()` ou `Impl.next()` ne compilent pas. C'est un choix de conception pour éviter les ambiguïtés entre interfaces et garder ces méthodes comme de simples utilitaires liés au contrat.",
    keyPoints: ["Pas héritées, contrairement aux `static` de classe", "Appel par `NomInterface.methode()` uniquement", "Utilitaires liés au contrat (factories, helpers)"],
  },
  {
    kind: "spot",
    id: "java-ica-20",
    difficulty: 2,
    tags: ["default-methods", "interfaces"],
    prompt: "Ce code ne compile pas (Java 17). Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public interface Cache {
    Object get(String key);
    default void put(String key, Object value);
    private String normalize(String key) { return key.trim(); }
}`,
    },
    faultyLine: 3,
    reasons: [
      "Une méthode `default` doit avoir un corps : sans corps, c'est une méthode abstraite, et le mot-clé `default` est de trop.",
      "Une méthode `private` n'est pas autorisée dans une interface.",
      "`get` doit être déclarée `public abstract` explicitement.",
      "`Object` n'est pas un type de retour valide dans une interface.",
    ],
    reasonAnswer: 0,
    explanation:
      "`default` signifie « voici une implémentation par défaut » : un corps est obligatoire. Une méthode sans corps est abstraite et se déclare sans `default`. Les méthodes `private` avec corps sont autorisées depuis Java 9, et `public abstract` reste implicite.",
  },
  {
    kind: "recall",
    id: "java-ica-21",
    difficulty: 3,
    tags: ["default-methods", "conception"],
    prompt: "À quoi servent les méthodes `default`, et quel problème ont-elles résolu à leur arrivée en Java 8 ?",
    explanation:
      "Elles permettent d'**ajouter une méthode à une interface sans casser** les classes qui l'implémentent déjà. Avant Java 8, ajouter `stream()` à `Collection` aurait obligé chaque implémentation existante, y compris hors JDK, à la fournir : impossible. Avec un corps par défaut, les implémentations héritent d'un comportement raisonnable et peuvent le redéfinir. Elles servent aussi à offrir des méthodes de confort dérivées du contrat (`Comparator.reversed()`). Elles ne servent pas à stocker de l'état, et ne remplacent pas une classe abstraite quand il y a des champs à partager.",
    keyPoints: ["Évolution d'une interface sans casser les implémentations", "Exemples : `Collection.stream()`, `Iterable.forEach()`", "Méthodes de confort dérivées (`Comparator.reversed()`)", "Toujours pas d'état"],
  },
  {
    kind: "order",
    id: "java-ica-22",
    difficulty: 2,
    tags: ["default-methods", "heritage"],
    prompt: "Remets dans l'ordre les règles que Java applique pour choisir entre plusieurs méthodes de même signature héritées.",
    items: [
      "Une méthode héritée d'une classe (ou superclasse) gagne sur toute méthode `default`",
      "Entre interfaces, la plus spécifique (celle qui étend l'autre) gagne",
      "Sinon, la classe doit redéfinir la méthode elle-même",
      "Dans cette redéfinition, elle peut déléguer avec `Interface.super.methode()`",
    ],
    explanation:
      "La classe d'abord, puis la spécificité, puis l'obligation de trancher. Retenir l'ordre évite deux erreurs classiques : croire qu'un `default` peut remplacer une méthode de superclasse, et croire que l'ordre de déclaration dans `implements` a une influence.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Surcharge ou redéfinition : qui décide, et quand
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-ica-l4",
  title: "Surcharge ou redéfinition : qui décide, et quand",
  blocks: [
    {
      kind: "text",
      text: "La **surcharge** (overload) : plusieurs méthodes de même nom mais de paramètres différents, dans une même classe. Le compilateur choisit laquelle appeler d'après le **type statique** des arguments, celui déclaré, pas celui de l'objet réel.",
    },
    {
      kind: "text",
      text: "La **redéfinition** (override) : une sous-classe fournit sa version d'une méthode héritée, même nom, mêmes paramètres. La JVM choisit à l'exécution d'après le **type dynamique** de l'objet. C'est le polymorphisme.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Compilation pour la surcharge, exécution pour la redéfinition.",
      code: `class Logger {
    // surcharge : même nom, paramètres différents
    void log(Object o) { System.out.println("obj " + o); }
    void log(String s) { System.out.println("str " + s); }
}

class Base {
    String who() { return "base"; }
}
class Child extends Base {
    // redéfinition : même signature
    @Override String who() { return "child"; }
}

Object msg = "hi";
// "obj hi" : type statique Object,
// choisi à la compilation
new Logger().log(msg);

Base b = new Child();
// "child" : type dynamique Child,
// choisi à l'exécution
b.who();`,
    },
    {
      kind: "text",
      text: "Une redéfinition valide respecte quatre règles : même signature, type de retour identique ou plus précis (covariant), visibilité identique ou plus large, aucune checked exception plus large. `@Override` demande au compilateur de vérifier qu'on redéfinit bien : sans lui, une faute de signature crée silencieusement une surcharge.",
    },
    {
      kind: "text",
      text: "Ne se redéfinissent pas : les méthodes `static` (une méthode de même signature dans l'enfant la **masque**), les méthodes `private` et `final`, et les champs, qui ne sont jamais polymorphes.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "`@Override` sur chaque redéfinition, y compris `equals(Object)`, `hashCode()` et `toString()`. C'est le garde-fou contre le classique `equals(MonType)`, qui est une surcharge et que `HashSet` n'appelle jamais.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "java-ica-23",
    difficulty: 2,
    tags: ["surcharge-vs-redefinition", "polymorphisme"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Printer {
    void print(Object o) { System.out.println("Object"); }
    void print(String s) { System.out.println("String"); }
}

Object o = "hello";
new Printer().print(o);`,
    },
    choices: ["`Object`", "`String`", "Erreur de compilation : appel ambigu.", "`String`, car la JVM choisit la surcharge la plus précise à l'exécution."],
    answer: 0,
    explanation:
      "La surcharge est résolue à la **compilation**, sur le type statique de l'argument : `o` est déclaré `Object`, donc `print(Object)` est choisi, même si l'objet est une `String`. Seule la redéfinition regarde le type dynamique. Pour obtenir `String`, il faudrait déclarer `String o` ou caster.",
  },
  {
    kind: "output",
    id: "java-ica-24",
    difficulty: 2,
    tags: ["surcharge-vs-redefinition", "polymorphisme"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Animal {
    String name = "animal";
    String sound() { return "..."; }
}

class Dog extends Animal {
    String name = "dog";
    @Override String sound() { return "wouf"; }
}

Animal a = new Dog();
System.out.println(a.name + " " + a.sound());`,
    },
    choices: ["`animal wouf`", "`dog wouf`", "`animal ...`", "`dog ...`"],
    answer: 0,
    explanation:
      "Les **méthodes** sont polymorphes : `a.sound()` est résolu à l'exécution sur `Dog`, d'où `wouf`. Les **champs** ne le sont pas : `a.name` est résolu à la compilation sur le type déclaré `Animal`, d'où `animal`. Un champ de même nom dans l'enfant masque celui du parent, il ne le redéfinit pas. C'est une raison de plus pour ne jamais exposer de champ.",
  },
  {
    kind: "spot",
    id: "java-ica-25",
    difficulty: 2,
    tags: ["surcharge-vs-redefinition", "equals-hashcode"],
    prompt: "`new HashSet<>()` accepte deux `Account` de même `id`. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public class Account {
    private final int id;
    public Account(int id) { this.id = id; }

    public boolean equals(Account other) {
        return id == other.id;
    }

    @Override
    public int hashCode() { return Integer.hashCode(id); }
}`,
    },
    faultyLine: 5,
    reasons: [
      "C'est une surcharge, pas une redéfinition : `HashSet` appelle `equals(Object)`, qui reste celui d'`Object` (identité).",
      "`hashCode` n'est pas cohérent avec `equals`.",
      "`equals` doit être déclarée `final` pour être utilisée par `HashSet`.",
      "Il faut comparer avec `Objects.equals(id, other.id)` plutôt que `==`.",
    ],
    reasonAnswer: 0,
    explanation:
      "La signature attendue est `equals(Object)`. Avec un paramètre `Account`, on crée une **surcharge** que les collections n'appellent jamais : `HashSet` compare via `equals(Object)`, hérité d'`Object`, donc par identité. `@Override` aurait fait échouer la compilation et révélé l'erreur. `hashCode` est ici correct, et `==` sur deux `int` aussi.",
  },
  {
    kind: "mcq",
    id: "java-ica-26",
    difficulty: 3,
    tags: ["surcharge-vs-redefinition", "visibilite", "exceptions"],
    prompt: "Le parent déclare `protected Number compute() throws IOException`. Laquelle de ces redéfinitions est **refusée** par le compilateur ?",
    choices: [
      "`protected Number compute() throws Exception`",
      "`public Integer compute()`",
      "`public Number compute() throws IOException`",
      "`protected Integer compute() throws FileNotFoundException`",
    ],
    answer: 0,
    explanation:
      "Une redéfinition peut **réduire** les exceptions checked (les supprimer, ou en déclarer une sous-classe comme `FileNotFoundException`), jamais les élargir : `Exception` est plus large qu'`IOException`, donc refusé. Elle peut aussi élargir la visibilité (`protected` → `public`) et préciser le type de retour (`Number` → `Integer`, covariance).",
  },
  {
    kind: "fill",
    id: "java-ica-27",
    difficulty: 1,
    tags: ["surcharge-vs-redefinition"],
    prompt: "Complète pour que `Square` redéfinisse correctement `area()`.",
    code: {
      language: "java",
      code: `class Shape {
    public double area() { return 0; }
}

class Square extends Shape {
    private final double side;
    Square(double side) { this.side = side; }

    {{1}}
    public {{2}} area() { return side * side; }
}`,
    },
    blanks: ["@Override", "double"],
    distractors: ["@Overload", "int", "static", "abstract"],
    explanation:
      "`@Override` fait vérifier par le compilateur qu'une méthode du parent est bien redéfinie. Le type de retour doit être identique ou covariant : `int` n'est pas un sous-type de `double` (la covariance ne s'applique qu'aux types référence), donc refusé. `@Overload` n'existe pas.",
  },
  {
    kind: "recall",
    id: "java-ica-28",
    difficulty: 2,
    tags: ["surcharge-vs-redefinition", "polymorphisme"],
    prompt: "Surcharge et redéfinition : pour chacune, qui décide de la méthode appelée, et à quel moment ?",
    explanation:
      "**Surcharge** (overload) : même nom, paramètres différents, dans la même classe. C'est le **compilateur** qui choisit, d'après le **type statique** des arguments (le type déclaré). **Redéfinition** (override) : même signature dans une sous-classe. C'est la **JVM** qui choisit à l'**exécution**, d'après le **type dynamique** de l'objet (la classe réelle). Conséquences : `print(Object o)` est appelée même si `o` contient une `String` ; `a.sound()` appelle la version de `Dog` même si `a` est déclaré `Animal`. `@Override` est le garde-fou : il transforme une surcharge accidentelle en erreur de compilation.",
    keyPoints: ["Surcharge : compilateur, type statique", "Redéfinition : JVM, type dynamique", "`@Override` = vérification à la compilation"],
  },
  {
    kind: "match",
    id: "java-ica-29",
    difficulty: 2,
    tags: ["surcharge-vs-redefinition", "classes-abstraites", "default-methods"],
    prompt: "Associe chaque situation au verdict du compilateur.",
    pairs: [
      { left: "Classe concrète qui n'implémente pas une méthode abstraite héritée", right: "Erreur : doit être `abstract` ou l'implémenter" },
      { left: "Redéfinition avec un type de retour covariant", right: "Accepté" },
      { left: "Deux `default` identiques hérités sans redéfinition", right: "Erreur : conflit à résoudre" },
      { left: "`new` sur une classe abstraite", right: "Erreur : impossible d'instancier" },
      { left: "Méthode d'interface implémentée en package-private", right: "Erreur : visibilité réduite" },
    ],
    explanation:
      "Quatre erreurs et une réussite. Le compilateur protège le contrat : tout ce qui est promis (méthode abstraite, visibilité `public`) doit être livré ; ce qui est ambigu (deux `default`) doit être tranché ; ce qui est incomplet (classe abstraite) ne s'instancie pas. La covariance du type de retour est la seule liberté ici.",
  },
  {
    kind: "match",
    id: "java-ica-30",
    difficulty: 1,
    tags: ["heritage", "default-methods", "static-methods"],
    prompt: "Associe chaque mot-clé à son effet sur une méthode.",
    pairs: [
      { left: "`abstract`", right: "Impose la redéfinition" },
      { left: "`final`", right: "Interdit la redéfinition" },
      { left: "`default` (interface)", right: "Corps hérité, redéfinissable" },
      { left: "`static` (interface)", right: "Non héritée, appel via l'interface" },
      { left: "`private` (interface)", right: "Code partagé entre méthodes `default`, invisible dehors" },
    ],
    explanation:
      "`abstract` et `final` sont les deux extrêmes : l'un exige une implémentation en aval, l'autre la fige. Dans une interface, `default` fournit un comportement héritable, `static` un utilitaire non hérité, `private` (Java 9) un morceau de code réutilisé par les `default` sans faire partie du contrat.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-interfaces-classes-abstraites",
  title: "Interfaces et classes abstraites",
  objective:
    "Choisir entre interface et classe abstraite, écrire des méthodes default sans conflit, et ne plus confondre surcharge et redéfinition.",
  prerequisites: [],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
