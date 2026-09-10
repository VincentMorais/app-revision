/**
 * Java — Exceptions (référentiel 1.4) : hiérarchie, checked/unchecked,
 * try/catch/finally, try-with-resources, exceptions métier et anti-patterns.
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — La hiérarchie et la règle catch-or-declare
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-exc-l1",
  title: "Checked, unchecked : la hiérarchie et la règle catch-or-declare",
  blocks: [
    {
      kind: "text",
      text: "Tout ce qui se lance dérive de `Throwable`, qui a deux branches. `Error` signale un problème dont l'application ne se relève pas (`OutOfMemoryError`, `StackOverflowError`) : on ne l'attrape pas. `Exception` couvre le reste, et se divise à son tour.",
    },
    {
      kind: "text",
      text: "`RuntimeException` et ses sous-classes sont **unchecked** : le compilateur les ignore, elles remontent librement. Toutes les autres `Exception` sont **checked** : le compilateur impose la règle **catch-or-declare**. Soit la méthode les attrape, soit elle les déclare avec `throws`, et le problème remonte à l'appelant.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le compilateur exige un traitement pour IOException, pas pour la division.",
      code: `// checked : throws obligatoire ou try/catch
String read(Path p) throws IOException {
    return Files.readString(p);
}

// unchecked : rien à déclarer
int divide(int a, int b) {
    return a / b;      // ArithmeticException possible
}

void caller() {
    try {
        read(Path.of("data.txt"));
    } catch (IOException e) {
        // obligatoire ici, sinon throws
        log.warn("lecture impossible", e);
    }
    divide(1, 0);      // compile, casse à l'exécution
}`,
    },
    {
      kind: "text",
      text: "Le critère de choix : une **checked** dit à l'appelant « ceci peut échouer pour une raison extérieure, et tu peux réagir » (fichier absent, réseau coupé). Une **unchecked** dit « le code appelant est fautif » (argument invalide, état incohérent, bug).",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Spring et la plupart des frameworks modernes ne lancent que des unchecked : `DataAccessException` enveloppe les `SQLException` checked de JDBC, pour ne pas polluer chaque signature.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-exc-01",
    difficulty: 1,
    tags: ["exceptions", "checked-vs-unchecked"],
    prompt: "Laquelle de ces exceptions est **checked** ?",
    choices: ["`IOException`", "`IllegalArgumentException`", "`NullPointerException`", "`ArrayIndexOutOfBoundsException`"],
    answer: 0,
    explanation:
      "Est unchecked tout ce qui dérive de `RuntimeException` ou d'`Error`. Les trois autres sont des `RuntimeException`. `IOException` dérive directement d'`Exception` : elle est checked, donc soumise à la règle catch-or-declare.",
  },
  {
    kind: "output",
    id: "java-exc-02",
    difficulty: 2,
    tags: ["exceptions", "checked-vs-unchecked"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `void save(String data) {
    Files.writeString(Path.of("out.txt"), data);
}`,
    },
    choices: [
      "Erreur de compilation : `IOException` est checked et n'est ni attrapée ni déclarée.",
      "Compile ; l'exception éventuelle remonte silencieusement à l'appelant.",
      "Compile avec un avertissement « unhandled exception ».",
      "Erreur de compilation : il manque `throws Exception` sur la classe.",
    ],
    answer: 0,
    explanation:
      "`Files.writeString` déclare `throws IOException`, une checked. Le compilateur refuse : « unreported exception IOException; must be caught or declared to be thrown ». Deux corrections : ajouter `throws IOException` à `save`, ou envelopper l'appel dans un `try/catch`. Un `throws` se pose sur une méthode, jamais sur une classe.",
  },
  {
    kind: "match",
    id: "java-exc-03",
    difficulty: 1,
    tags: ["exceptions", "checked-vs-unchecked"],
    prompt: "Associe chaque type à sa place dans la hiérarchie.",
    pairs: [
      { left: "`OutOfMemoryError`", right: "`Error` : on n'attrape pas" },
      { left: "`SQLException`", right: "Checked : catch ou throws" },
      { left: "`IllegalStateException`", right: "Unchecked : état incohérent" },
      { left: "`NumberFormatException`", right: "Unchecked : sous-classe d'`IllegalArgumentException`" },
      { left: "`Throwable`", right: "La racine de tout ce qui se lance" },
    ],
    explanation:
      "`NumberFormatException` étend `IllegalArgumentException`, elle-même `RuntimeException` : c'est pour cela que `Integer.parseInt` ne force à rien. `SQLException` est checked, d'où le confort de la `DataAccessException` unchecked de Spring, qui l'enveloppe.",
  },
  {
    kind: "mcq",
    id: "java-exc-04",
    difficulty: 2,
    tags: ["exceptions", "checked-vs-unchecked", "conception"],
    prompt: "Une méthode de validation reçoit un âge négatif. Que lancer ?",
    choices: [
      "Une unchecked (`IllegalArgumentException`) : l'appelant a fourni une donnée invalide, c'est un bug de programmation.",
      "Une checked custom, pour forcer l'appelant à traiter le cas.",
      "Une `Error` custom, car l'état de l'application est compromis.",
      "Rien : renvoyer `false` et laisser l'appelant décider.",
    ],
    answer: 0,
    explanation:
      "Un argument invalide est un contrat violé par l'appelant : `IllegalArgumentException`, unchecked, est la réponse standard de la bibliothèque Java (`Objects.requireNonNull`, `List.of` avec `null`). Une checked serait justifiée pour une cause extérieure et récupérable. `Error` est réservé à la JVM. Renvoyer `false` est acceptable pour un validateur qui collecte des erreurs, mais pas pour un constructeur qui doit protéger son invariant.",
  },
  {
    kind: "fill",
    id: "java-exc-05",
    difficulty: 1,
    tags: ["exceptions", "checked-vs-unchecked"],
    prompt: "Complète pour que le code compile.",
    code: {
      language: "java",
      code: `String load(Path p) {{1}} IOException {
    return Files.readString(p);
}

void run() {
    try {
        load(Path.of("a.txt"));
    } {{2}} (IOException e) {
        log.warn("échec", e);
    }
}`,
    },
    blanks: ["throws", "catch"],
    distractors: ["throw", "catches", "finally", "handles"],
    explanation:
      "`throws` déclare, `throw` lance. La clause de capture s'écrit `catch`. `load` déclare l'exception et la fait remonter ; `run` l'attrape et la traite. Sans l'un ou l'autre, le compilateur refuse.",
  },
  {
    kind: "spot",
    id: "java-exc-06",
    difficulty: 2,
    tags: ["exceptions", "checked-vs-unchecked"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `void process() {
    try {
        compute();
    } catch (IOException e) {
        log.error("erreur", e);
    }
}

int compute() { return 42; }`,
    },
    faultyLine: 4,
    reasons: [
      "Attraper une checked que le bloc `try` ne peut pas lancer est une erreur : « exception IOException is never thrown in body of corresponding try statement ».",
      "Un bloc `catch` ne peut pas contenir un appel de log.",
      "`compute()` doit déclarer `throws IOException`.",
      "Il manque un bloc `finally` obligatoire après un `catch`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le compilateur vérifie qu'une checked attrapée peut réellement survenir dans le `try`. Comme `compute()` ne déclare rien, `IOException` est impossible et le `catch` est refusé. La règle ne s'applique pas aux unchecked ni à `catch (Exception e)`, qui reste toujours autorisé. `finally` est facultatif.",
  },
  {
    kind: "recall",
    id: "java-exc-07",
    difficulty: 2,
    tags: ["exceptions", "checked-vs-unchecked", "conception"],
    prompt: "Quelle est la différence entre une exception checked et une unchecked, et sur quel critère choisir quand tu en crées une ?",
    explanation:
      "**Checked** : dérive d'`Exception` sans passer par `RuntimeException`. Le compilateur impose la règle **catch-or-declare** : chaque appelant l'attrape ou la déclare. **Unchecked** : dérive de `RuntimeException` (ou d'`Error`) et remonte librement, sans rien dans les signatures. Critère : une checked pour un échec **attendu, extérieur et sur lequel l'appelant peut agir** (fichier absent, service indisponible) ; une unchecked pour une **erreur de programmation** ou un invariant métier violé. En pratique, dans une application Spring, on part sur des unchecked : les checked polluent toutes les signatures intermédiaires et finissent enveloppées ou avalées. Les checked restent pertinentes dans une bibliothèque, où elles documentent le contrat.",
    keyPoints: ["Checked = catch-or-declare imposé", "Unchecked = RuntimeException, remonte librement", "Extérieur et récupérable → checked", "Bug ou invariant → unchecked", "Spring : unchecked partout"],
  },
  {
    kind: "mcq",
    id: "java-exc-08",
    difficulty: 2,
    tags: ["exceptions", "heritage"],
    prompt: "Une méthode du parent déclare `throws IOException`. Que peut déclarer la redéfinition dans la sous-classe ?",
    choices: [
      "Rien, `IOException`, ou une de ses sous-classes comme `FileNotFoundException` ; jamais `Exception`.",
      "N'importe quelle exception : `throws` ne fait pas partie de la signature.",
      "Exactement `throws IOException`, à l'identique.",
      "Uniquement des unchecked, les checked du parent étant héritées automatiquement.",
    ],
    answer: 0,
    explanation:
      "Une redéfinition peut **réduire** les checked déclarées, jamais les élargir : sinon un appelant qui manipule le parent ne serait pas préparé. `Exception` étant plus large qu'`IOException`, elle est refusée. Les unchecked, elles, peuvent toujours être ajoutées : le compilateur ne les suit pas.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — try, catch, finally
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-exc-l2",
  title: "try, catch, finally : l'ordre d'exécution",
  blocks: [
    {
      kind: "text",
      text: "Quand une exception est levée dans un `try`, l'exécution saute au premier `catch` dont le type est **compatible**, puis continue après le bloc. Les `catch` sont testés dans l'ordre d'écriture : une sous-classe doit donc précéder sa superclasse, sinon le compilateur refuse (« has already been caught »).",
    },
    {
      kind: "text",
      text: "Le **multi-catch** `catch (A | B e)` factorise deux traitements identiques. Les types listés ne doivent pas être en relation d'héritage, et `e` y est implicitement `final`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "finally gagne toujours, y compris contre un return.",
      code: `static int f() {
    try {
        return 1;
    } finally {
        return 2;      // écrase le return du try
    }
}                      // f() vaut 2

static int g() {
    int x = 1;
    try {
        return x;      // valeur 1 déjà calculée
    } finally {
        x = 2;         // trop tard
    }
}                      // g() vaut 1`,
    },
    {
      kind: "text",
      text: "`finally` s'exécute quoi qu'il arrive : sortie normale, `return`, ou exception en cours de propagation. Seuls `System.exit` et un arrêt brutal de la JVM l'empêchent. Deux pièges en découlent : un `return` dans le `finally` écrase la valeur du `try` **et avale l'exception en cours** ; et une valeur de retour est calculée avant l'exécution du `finally`, donc la modifier après ne change rien.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Ne jamais écrire de `return`, `break` ou `throw` dans un `finally` : une exception qui remontait disparaît sans laisser de trace, et le bug devient introuvable.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "java-exc-09",
    difficulty: 2,
    tags: ["exceptions", "finally"],
    prompt: "Que renvoie `f()` ?",
    code: {
      language: "java",
      code: `static int f() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
    },
    choices: ["`2`", "`1`", "Erreur de compilation : deux `return` dans la même méthode.", "`1`, puis `2` est ignoré."],
    answer: 0,
    explanation:
      "Le `finally` s'exécute après le calcul du `return` du `try` mais avant la sortie effective. Son propre `return` remplace purement et simplement la valeur : `f()` vaut 2. C'est aussi ce qui rend ce motif dangereux, car il avale les exceptions.",
  },
  {
    kind: "output",
    id: "java-exc-10",
    difficulty: 3,
    tags: ["exceptions", "finally"],
    prompt: "Que renvoie `g()` ?",
    code: {
      language: "java",
      code: `static int g() {
    int x = 1;
    try {
        return x;
    } finally {
        x = 2;
    }
}`,
    },
    choices: ["`1`", "`2`", "`0`", "Erreur de compilation : `x` est modifiée après le `return`."],
    answer: 0,
    explanation:
      "La valeur de retour est **évaluée** au moment du `return` : 1 est copié dans un emplacement temporaire. Le `finally` modifie ensuite la variable `x`, mais plus la valeur déjà retenue. Différence essentielle avec l'exercice précédent, où c'est un nouveau `return` qui écrase le résultat. Avec un objet mutable, en revanche, muter l'objet dans le `finally` serait visible.",
  },
  {
    kind: "output",
    id: "java-exc-11",
    difficulty: 2,
    tags: ["exceptions", "finally"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `try {
    System.out.print("A");
    throw new IllegalStateException();
} catch (RuntimeException e) {
    System.out.print("B");
} finally {
    System.out.print("C");
}
System.out.print("D");`,
    },
    choices: ["`ABCD`", "`ABD`", "`ACD`", "`ABC` puis l'exception remonte"],
    answer: 0,
    explanation:
      "`A` est affiché, l'exception saute au `catch` compatible (`IllegalStateException` est une `RuntimeException`) qui affiche `B`, le `finally` affiche `C`, puis l'exécution reprend normalement après le bloc et affiche `D`. Une exception attrapée et non relancée ne se propage pas.",
  },
  {
    kind: "spot",
    id: "java-exc-12",
    difficulty: 2,
    tags: ["exceptions", "ordre-des-catch"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `try {
    read();
} catch (Exception e) {
    log.error("général", e);
} catch (IOException e) {
    log.error("io", e);
}`,
    },
    faultyLine: 5,
    reasons: [
      "`IOException` est une sous-classe d'`Exception` déjà attrapée au-dessus : ce `catch` est inatteignable (« has already been caught »).",
      "On ne peut pas écrire deux blocs `catch` pour un même `try`.",
      "`IOException` étant checked, elle doit être attrapée avant tout appel.",
      "Il manque un bloc `finally` entre les deux `catch`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Les `catch` sont testés dans l'ordre : `catch (Exception e)` capture déjà tout, le second bloc ne peut jamais s'exécuter et le compilateur le refuse. Règle : du plus spécifique au plus général. Ici, `IOException` d'abord, `Exception` ensuite si vraiment nécessaire.",
  },
  {
    kind: "fill",
    id: "java-exc-13",
    difficulty: 2,
    tags: ["exceptions", "multi-catch"],
    prompt: "Factorise les deux traitements identiques en un seul bloc.",
    code: {
      language: "java",
      code: `try {
    parseAndSend(input);
} {{1}} (NumberFormatException {{2}}
        TimeoutException e) {
    throw new ImportFailed("import KO", e);
}`,
    },
    blanks: ["catch", "|"],
    distractors: ["||", "throws", "&&", ","],
    explanation:
      "Le multi-catch sépare les types par une **barre verticale simple** `|`, pas `||` (opérateur booléen) ni une virgule. Les deux types ne doivent pas être en relation d'héritage, sinon le plus général suffit. La variable `e` y est implicitement `final`.",
  },
  {
    kind: "order",
    id: "java-exc-14",
    difficulty: 2,
    tags: ["exceptions", "finally"],
    prompt: "Une exception est levée dans le `try` et attrapée. Remets dans l'ordre ce qui s'exécute.",
    items: [
      "Le code du `try` jusqu'à l'instruction qui lève",
      "Recherche du premier `catch` de type compatible, dans l'ordre d'écriture",
      "Exécution du bloc `catch` retenu",
      "Exécution du bloc `finally`",
      "Reprise du code qui suit le bloc `try`",
    ],
    explanation:
      "Le reste du `try` après l'instruction fautive n'est jamais exécuté. Un seul `catch` est retenu, le premier compatible. Le `finally` passe systématiquement, après le `catch`. Si aucun `catch` ne convient, le `finally` s'exécute quand même, puis l'exception continue de remonter.",
  },
  {
    kind: "recall",
    id: "java-exc-15",
    difficulty: 3,
    tags: ["exceptions", "finally", "anti-patterns"],
    prompt: "Pourquoi ne faut-il jamais écrire de `return` dans un bloc `finally` ?",
    explanation:
      "Parce qu'il **écrase tout ce qui était en cours**. S'il y avait un `return` dans le `try`, sa valeur est remplacée. Et surtout, si une **exception était en train de se propager**, elle est silencieusement abandonnée : la méthode se termine normalement alors qu'elle a échoué. L'appelant reçoit une valeur bidon sans le moindre signal, et le bug devient très difficile à localiser puisque la stack trace n'existe plus. Même raisonnement pour `break`, `continue` et `throw` dans un `finally`. Un `finally` sert uniquement à **libérer une ressource**, et `try-with-resources` le fait mieux.",
    keyPoints: ["Écrase la valeur de retour du `try`", "Avale l'exception en cours de propagation", "Aucune trace, bug introuvable", "`finally` = libérer, rien d'autre"],
  },
  {
    kind: "mcq",
    id: "java-exc-16",
    difficulty: 2,
    tags: ["exceptions", "finally"],
    prompt: "Dans quel cas le bloc `finally` n'est-il **pas** exécuté ?",
    choices: [
      "Si le `try` appelle `System.exit(0)` ou si la JVM s'arrête brutalement.",
      "Si le `try` contient un `return`.",
      "Si aucune exception n'est levée.",
      "Si l'exception levée n'est attrapée par aucun `catch`.",
    ],
    answer: 0,
    explanation:
      "`finally` s'exécute sur toutes les sorties du bloc : normale, `return`, ou exception non attrapée qui continue de remonter. Seuls `System.exit`, un `Error` fatal ou une coupure de processus l'en empêchent. C'est justement cette garantie qui en fait l'endroit où libérer une ressource.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — try-with-resources
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-exc-l3",
  title: "try-with-resources et AutoCloseable",
  blocks: [
    {
      kind: "text",
      text: "Toute ressource qui doit être libérée (fichier, connexion, socket) implémente `AutoCloseable`. Le `try-with-resources` déclare la ressource entre parenthèses et garantit l'appel à `close()` à la sortie du bloc, succès ou échec, sans écrire de `finally`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Fermeture automatique, dans l'ordre inverse de la déclaration.",
      code: `try (var in = Files.newInputStream(src);
     var out = Files.newOutputStream(dst)) {
    in.transferTo(out);
}   // close() : out d'abord, puis in

// équivalent manuel, verbeux et fragile
var in = Files.newInputStream(src);
try {
    // ...
} finally {
    in.close();   // et si close() lève ?
}`,
    },
    {
      kind: "text",
      text: "Deux règles à connaître. Les ressources sont fermées dans l'**ordre inverse** de leur déclaration, ce qui est indispensable quand la seconde s'appuie sur la première. Et si le corps du `try` **et** le `close()` lèvent tous les deux, c'est l'exception du **corps** qui se propage : celle du `close` lui est attachée comme **supprimée**, récupérable via `getSuppressed()`.",
    },
    {
      kind: "text",
      text: "C'est l'inverse du `try/finally` manuel, où l'exception du `close()` écrasait celle du corps et masquait la vraie cause. Depuis Java 9, une variable déjà déclarée et effectivement `final` peut être citée directement entre les parenthèses.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "Toute variable de type `Stream`, `Connection`, `Reader` ou `InputStream` doit apparaître dans un `try-with-resources`. Un `Stream` issu de `Files.lines` garde le fichier ouvert tant qu'il n'est pas fermé.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "java-exc-17",
    difficulty: 2,
    tags: ["exceptions", "try-with-resources"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class R implements AutoCloseable {
    private final String n;
    R(String n) {
        this.n = n;
        System.out.print("open" + n + " ");
    }
    public void close() {
        System.out.print("close" + n + " ");
    }
}

try (R a = new R("A"); R b = new R("B")) {
    System.out.print("body ");
}`,
    },
    choices: ["`openA openB body closeB closeA`", "`openA openB body closeA closeB`", "`openA openB closeB closeA body`", "`openA closeA openB closeB body`"],
    answer: 0,
    explanation:
      "Les ressources sont ouvertes dans l'ordre de déclaration et fermées dans l'**ordre inverse**, comme une pile. C'est indispensable quand `b` s'appuie sur `a` : fermer `a` en premier laisserait `b` travailler sur une ressource morte.",
  },
  {
    kind: "output",
    id: "java-exc-18",
    difficulty: 3,
    tags: ["exceptions", "try-with-resources", "suppressed"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class R implements AutoCloseable {
    public void close() {
        throw new IllegalStateException("close");
    }
}

try (R r = new R()) {
    throw new RuntimeException("body");
} catch (Exception e) {
    System.out.println(e.getMessage() + " / "
        + e.getSuppressed()[0].getMessage());
}`,
    },
    choices: ["`body / close`", "`close / body`", "`body / body`", "`ArrayIndexOutOfBoundsException` : aucune exception supprimée"],
    answer: 0,
    explanation:
      "Quand le corps et le `close()` lèvent tous les deux, c'est l'exception du **corps** qui se propage, celle du `close` étant attachée comme supprimée. `getSuppressed()` renvoie donc un tableau contenant l'`IllegalStateException`. Avec un `try/finally` manuel, l'exception du `close` aurait écrasé celle du corps et masqué la vraie cause.",
  },
  {
    kind: "spot",
    id: "java-exc-19",
    difficulty: 2,
    tags: ["exceptions", "try-with-resources", "streams"],
    prompt: "Cette méthode finit par épuiser les descripteurs de fichiers. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `long countLines(Path p) throws IOException {
    Stream<String> lines = Files.lines(p);
    return lines.count();
}`,
    },
    faultyLine: 2,
    reasons: [
      "Le `Stream` de `Files.lines` tient le fichier ouvert : il doit être déclaré dans un `try-with-resources`.",
      "`Files.lines` charge tout le fichier en mémoire : il faut un `BufferedReader`.",
      "`count()` ne consomme pas le stream, il faut appeler `close()` explicitement après `forEach`.",
      "`Stream<String>` n'implémente pas `AutoCloseable`, il faut passer par `Files.readAllLines`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`Stream` implémente bien `AutoCloseable`, et celui de `Files.lines` s'appuie sur un fichier ouvert. Une opération terminale ne le ferme pas. Correction : `try (Stream<String> lines = Files.lines(p)) { return lines.count(); }`. `Files.lines` est justement paresseux et ne charge pas tout en mémoire, c'est son intérêt.",
  },
  {
    kind: "fill",
    id: "java-exc-20",
    difficulty: 1,
    tags: ["exceptions", "try-with-resources"],
    prompt: "Complète pour que la connexion soit fermée automatiquement.",
    code: {
      language: "java",
      code: `public class Session {{1}} AutoCloseable {
    @Override
    public void {{2}}() { socket.release(); }
}

{{3}} (Session s = open()) {
    s.send("ping");
}`,
    },
    blanks: ["implements", "close", "try"],
    distractors: ["extends", "finally", "closeable", "catch", "with"],
    explanation:
      "`AutoCloseable` est une interface : `implements`. Sa seule méthode s'appelle `close()`. Et la construction s'écrit `try (...) { }`, sans mot-clé supplémentaire. `Closeable` existe aussi, mais elle est réservée aux flux d'entrée-sortie et impose `throws IOException`.",
  },
  {
    kind: "mcq",
    id: "java-exc-21",
    difficulty: 2,
    tags: ["exceptions", "try-with-resources"],
    prompt: "Dans un `try-with-resources`, le corps réussit mais `close()` lève une exception. Que se passe-t-il ?",
    choices: [
      "L'exception du `close()` se propage normalement à l'appelant.",
      "Elle est silencieusement ignorée, le corps ayant réussi.",
      "Elle est enregistrée comme supprimée sur une exception vide.",
      "Erreur de compilation : `close()` ne peut pas lever d'exception.",
    ],
    answer: 0,
    explanation:
      "Le mécanisme des exceptions supprimées ne s'active que s'il y a **deux** exceptions en concurrence. Quand seul le `close()` échoue, il n'y a rien à masquer : son exception remonte comme n'importe quelle autre. `close()` peut tout à fait déclarer `throws`, la signature d'`AutoCloseable` l'autorise.",
  },
  {
    kind: "recall",
    id: "java-exc-22",
    difficulty: 2,
    tags: ["exceptions", "try-with-resources", "suppressed"],
    prompt: "Qu'apporte `try-with-resources` par rapport à un `try/finally` qui ferme la ressource ?",
    explanation:
      "Trois choses. **Concision** : plus de `finally` ni de test de nullité. **Ordre garanti** : plusieurs ressources sont fermées dans l'ordre inverse de déclaration, ce qu'un `finally` manuel oublie souvent. Et surtout, la **gestion des exceptions supprimées** : si le corps et le `close()` échouent tous les deux, l'exception du corps, celle qui porte la vraie cause, se propage, et celle du `close` lui est attachée via `getSuppressed()`. Avec un `finally` manuel, l'exception du `close` écrase celle du corps et fait disparaître le diagnostic. C'est le bénéfice le moins connu et le plus important.",
    keyPoints: ["Concision, plus de `finally`", "Fermeture en ordre inverse", "Exception du corps préservée, celle du `close` supprimée", "Le `finally` manuel masque la vraie cause"],
  },
  {
    kind: "match",
    id: "java-exc-23",
    difficulty: 2,
    tags: ["exceptions", "try-with-resources"],
    prompt: "Associe chaque situation à son comportement dans un `try-with-resources`.",
    pairs: [
      { left: "Corps OK, `close()` OK", right: "Sortie normale" },
      { left: "Corps lève, `close()` OK", right: "L'exception du corps se propage" },
      { left: "Corps lève, `close()` lève", right: "Corps propagé, `close` en supprimée" },
      { left: "Corps OK, `close()` lève", right: "L'exception du `close` se propage" },
      { left: "Deux ressources déclarées", right: "Fermeture en ordre inverse" },
    ],
    explanation:
      "Le seul cas subtil est le troisième : deux exceptions, une seule peut se propager, et Java choisit celle du corps parce qu'elle décrit le vrai échec métier. Rien n'est jamais perdu, tout est récupérable avec `getSuppressed()`.",
  },
  {
    kind: "mcq",
    id: "java-exc-24",
    difficulty: 1,
    tags: ["exceptions", "try-with-resources"],
    prompt: "Peut-on utiliser `catch` et `finally` avec un `try-with-resources` ?",
    choices: [
      "Oui : ils sont facultatifs et s'exécutent **après** la fermeture des ressources.",
      "Non : la forme avec ressources interdit `catch` et `finally`.",
      "Oui, mais ils s'exécutent avant la fermeture des ressources.",
      "`catch` est autorisé, `finally` non.",
    ],
    answer: 0,
    explanation:
      "La syntaxe complète est `try (ressources) { } catch (…) { } finally { }`. Les ressources sont fermées en premier, avant que le `catch` ne s'exécute : c'est pour cela qu'un `catch` peut déjà consulter `getSuppressed()`. Les deux clauses restent facultatives.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Exceptions métier et anti-patterns
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-exc-l4",
  title: "Exceptions métier et anti-patterns",
  blocks: [
    {
      kind: "text",
      text: "Une exception métier custom se justifie quand l'appelant doit **distinguer ce cas** des autres échecs : `OrderNotFound` mérite un 404, `InsufficientStock` un 409. Si personne ne la traite différemment, une exception standard suffit.",
    },
    {
      kind: "text",
      text: "Trois exigences à la création : un **nom** qui décrit le problème métier, un **message** qui donne le contexte utile (identifiants, valeurs), et la **cause** transmise au constructeur parent quand on enveloppe une exception technique. Perdre la cause, c'est perdre la moitié de la stack trace.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Enveloppement correct : la cause est conservée.",
      code: `public class OrderNotFound extends RuntimeException {
    public OrderNotFound(String id) {
        super("Commande introuvable : " + id);
    }
}

try {
    return client.fetch(id);
} catch (IOException e) {
    // la cause est transmise au parent
    throw new CatalogUnavailable("catalogue KO", e);
}

// ANTI-PATTERNS
catch (Exception e) { }              // avale tout
catch (Exception e) { log(e); throw e; }  // log + relance
throw new RuntimeException(e.getMessage()); // cause perdue`,
    },
    {
      kind: "text",
      text: "Les anti-patterns classiques : le **catch vide**, qui fait disparaître le problème ; le `catch (Exception e)` trop large, qui attrape aussi les bugs de programmation ; l'exception comme **flux de contrôle**, qui coûte cher et masque l'intention ; le **log-and-rethrow**, qui produit la même erreur trois fois dans les journaux ; et l'enveloppement **sans la cause**, qui rend le diagnostic impossible.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Pour une simple absence de valeur, préférer `Optional` : c'est un cas normal, pas une erreur. Réserver l'exception à ce qui empêche vraiment l'opération d'aboutir.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "java-exc-25",
    difficulty: 1,
    tags: ["exceptions", "anti-patterns"],
    prompt: "Un bug de production reste introuvable malgré les journaux. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `public Optional<User> find(String id) {
    try {
        return Optional.of(repository.load(id));
    } catch (Exception e) {
    }
    return Optional.empty();
}`,
    },
    faultyLine: 4,
    reasons: [
      "Catch vide : toute erreur, y compris une panne de base ou un bug, est transformée en résultat vide sans aucune trace.",
      "`Optional.of` doit être remplacé par `Optional.ofNullable`.",
      "Un bloc `catch` ne peut pas être vide, il faut au moins un commentaire.",
      "`Exception` est checked, il faut attraper `RuntimeException`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le catch vide est l'anti-pattern numéro un : une panne réseau et une donnée absente deviennent indiscernables, et rien n'apparaît dans les journaux. Il faut au minimum journaliser avec la cause, et surtout n'attraper que ce qu'on sait traiter. Un bloc `catch` vide compile parfaitement, c'est bien le problème.",
  },
  {
    kind: "mcq",
    id: "java-exc-26",
    difficulty: 2,
    tags: ["exceptions", "anti-patterns", "conception"],
    prompt: "Pourquoi `throw new ServiceException(e.getMessage())` est-il une mauvaise façon d'envelopper une exception ?",
    choices: [
      "La cause n'est pas transmise : la stack trace d'origine disparaît et on ne sait plus d'où vient l'erreur.",
      "Un message ne peut pas être passé au constructeur d'une exception.",
      "Il faut toujours relancer l'exception d'origine sans l'envelopper.",
      "`getMessage()` renvoie `null` sur la plupart des exceptions.",
    ],
    answer: 0,
    explanation:
      "Il faut écrire `new ServiceException(\"contexte\", e)` : le constructeur `(String, Throwable)` enregistre la cause, et la stack trace affiche alors la chaîne complète avec les blocs « Caused by ». Sans elle, on garde une phrase et on perd la ligne exacte du problème. Envelopper est utile, c'est perdre la cause qui ne l'est pas.",
  },
  {
    kind: "output",
    id: "java-exc-27",
    difficulty: 2,
    tags: ["exceptions", "conception"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `int parseOrZero(String s) {
    try {
        return Integer.parseInt(s);
    } catch (NumberFormatException e) {
        return 0;
    }
}

System.out.println(parseOrZero("12")
    + " " + parseOrZero("abc")
    + " " + parseOrZero(null));`,
    },
    choices: ["`12 0 0`", "`12 0` puis `NullPointerException`", "`12 0 null`", "Erreur de compilation : `parseInt(null)` est ambigu."],
    answer: 0,
    explanation:
      "`Integer.parseInt(null)` lève bien une `NumberFormatException` avec le message « Cannot parse null string », pas une `NullPointerException` : le `catch` l'attrape donc aussi et renvoie 0. C'est un détail contre-intuitif de la bibliothèque standard, à connaître avant de se reposer sur ce genre de méthode.",
  },
  {
    kind: "fill",
    id: "java-exc-28",
    difficulty: 2,
    tags: ["exceptions", "conception"],
    prompt: "Complète cette exception métier pour qu'elle conserve la cause.",
    code: {
      language: "java",
      code: `public class CatalogUnavailable
        {{1}} RuntimeException {

    public CatalogUnavailable(String msg,
                              Throwable cause) {
        {{2}}(msg, cause);
    }
}`,
    },
    blanks: ["extends", "super"],
    distractors: ["implements", "this", "throws", "new"],
    explanation:
      "Une exception hérite d'une classe : `extends RuntimeException` pour une unchecked, `extends Exception` pour une checked. Le constructeur transmet message et cause au parent par `super(msg, cause)`. `this(...)` appellerait un autre constructeur de la même classe et ne remplirait jamais la cause.",
  },
  {
    kind: "recall",
    id: "java-exc-29",
    difficulty: 3,
    tags: ["exceptions", "anti-patterns"],
    prompt: "Cite trois anti-patterns courants dans la gestion des exceptions, et ce qu'il faut faire à la place.",
    explanation:
      "**Catch vide** : l'erreur disparaît, le symptôme apparaît beaucoup plus loin. À la place, traiter, ou relancer enveloppée, ou ne pas attraper. **`catch (Exception e)` systématique** : on attrape aussi les `NullPointerException` et autres bugs qu'on aurait voulu voir échouer bruyamment. À la place, n'attraper que les types qu'on sait traiter. **Log-and-rethrow** : la même erreur est journalisée à chaque étage, les journaux deviennent illisibles. À la place, journaliser une seule fois, à l'endroit où l'erreur est réellement traitée, en général un gestionnaire global. **Exception comme flux de contrôle** : coûteuse et illisible, un `if` ou un `Optional` suffit. **Enveloppement sans la cause** : diagnostic impossible, toujours passer `e` au constructeur.",
    keyPoints: ["Catch vide → traiter ou laisser remonter", "`catch (Exception)` → n'attraper que ce qu'on traite", "Log-and-rethrow → journaliser une seule fois", "Exception comme `if` → `Optional` ou test", "Toujours transmettre la cause"],
  },
  {
    kind: "recall",
    id: "java-exc-30",
    difficulty: 2,
    tags: ["exceptions", "optional", "conception"],
    prompt: "Quand renvoyer un `Optional` vide plutôt que lancer une exception ?",
    explanation:
      "Quand l'absence est un **cas normal et attendu** du domaine. `findByEmail` sur un formulaire d'inscription : ne rien trouver est le cas courant, `Optional.empty()` est la bonne réponse et oblige l'appelant à traiter le cas. À l'inverse, `getOrder(id)` appelé après qu'un identifiant a été validé : l'absence signale une incohérence, une exception est justifiée et se traduira par un 404. Règle pratique : si l'appelant écrira systématiquement un `try/catch` autour, c'est que le cas est normal et qu'il fallait un `Optional`. Une exception coûte aussi une capture de stack trace, à éviter dans un chemin fréquent.",
    keyPoints: ["Absence normale → `Optional`", "Absence anormale → exception", "Si l'appelant fait toujours try/catch, c'était un `Optional`", "Coût de la stack trace"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-exceptions",
  title: "Exceptions : checked/unchecked, try-with-resources",
  objective:
    "Choisir entre checked et unchecked, maîtriser l'ordre d'exécution de finally, utiliser try-with-resources et écrire des exceptions métier qui gardent la cause.",
  prerequisites: ["java-fondamentaux"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
