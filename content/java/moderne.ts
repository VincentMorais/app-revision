/**
 * Java — Java moderne (référentiel 1.5) : var, text blocks, record, sealed,
 * pattern matching, switch, java.time.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — var : l'inférence locale, et ses limites
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-mod-l1",
  title: "var : l'inférence locale, et ses limites",
  blocks: [
    {
      kind: "text",
      text: "Java a longtemps obligé à écrire le type deux fois : une fois à gauche, une fois à droite. Sur un type générique imbriqué, la déclaration occupait la moitié de la ligne sans rien apprendre au lecteur — l'information était déjà dans l'appel. C'est le seul problème que `var` résout, et le garder en tête suffit à savoir quand l'employer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce que la répétition coûte en lisibilité.",
      code: `// Avant : le type occupe l'essentiel de la ligne
Map<String, List<OrderLine>> lignesParClient =
        new HashMap<String, List<OrderLine>>();

Iterator<Map.Entry<String, List<OrderLine>>> it =
        lignesParClient.entrySet().iterator();

// Le lecteur relit deux fois la même information, et
// la partie utile — entrySet().iterator() — se perd
// à la fin d'une déclaration de deux lignes.`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Avec var : ce qui reste est ce qui compte.",
      code: `var lignesParClient = new HashMap<String, List<OrderLine>>();
var it = lignesParClient.entrySet().iterator();

// Le type reste parfaitement connu du compilateur :
// var n'est PAS un type dynamique. C'est une inférence
// à la compilation, et lignesParClient est bel et bien
// de type HashMap<String, List<OrderLine>>.

for (var entree : lignesParClient.entrySet()) {
    // entree est un Map.Entry<String, List<OrderLine>>
}`,
    },
    {
      kind: "text",
      text: "Le point à comprendre pour ne pas se tromper en entretien : `var` n'introduit aucun typage dynamique. Le type est déterminé à la compilation, définitivement, à partir de l'initialisateur. Une variable déclarée avec `var` ne peut pas changer de type ensuite, et le code compilé est rigoureusement identique à celui qu'aurait produit une déclaration explicite.",
    },
    {
      kind: "text",
      text: "Les restrictions découlent directement de ce mécanisme. Il faut un initialisateur, puisque c'est lui qui donne le type ; `var x;` ne compile pas. Il est réservé aux variables **locales**, aux variables de boucle et aux ressources d'un `try` : ni champ d'instance, ni paramètre de méthode, ni type de retour, car ceux-là font partie d'une signature que d'autres classes lisent. Et `var x = null;` est refusé, `null` n'ayant pas de type propre.",
    },
    {
      kind: "comparison",
      title: "Deux usages opposés",
      left: {
        label: "var aide",
        text: "Quand le type est évident à droite : `var client = new Client();`, `var lignes = repo.findAll();` dans une méthode courte. La répétition n'apportait rien, et sa suppression met en valeur l'appel plutôt que la déclaration.",
      },
      right: {
        label: "var nuit",
        text: "Quand le type n'est pas lisible : `var r = service.process(x);`. Le lecteur doit ouvrir `process` pour savoir ce qu'il manipule. Ici le type explicite est une documentation, et l'économie de caractères se paie en compréhension.",
      },
    },
    {
      kind: "text",
      text: "Un cas mérite une vigilance particulière : les littéraux numériques. `var x = 1;` donne un `int`, jamais un `long` ni un `double`. Si la variable doit accumuler de grandes valeurs, l'inférence choisit silencieusement le type le plus étroit et le débordement passe inaperçu. On écrit alors `var x = 1L;` ou l'on garde le type explicite.",
    },
    {
      kind: "text",
      text: "L'inférence a aussi un effet de bord peu connu avec le diamant. `var liste = new ArrayList<>();` compile, mais infère `ArrayList<Object>` — le diamant n'a rien pour se déterminer, il n'y a plus de type à gauche. Il faut donc écrire le paramètre de type à droite : `var liste = new ArrayList<String>();`. C'est l'un des rares cas où `var` allonge la ligne.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "La bonne question à se poser",
      text: "Non pas « le compilateur peut-il deviner ? » — il peut presque toujours — mais « le lecteur peut-il deviner, sans quitter cette ligne ? ». Si la réponse est oui, `var` fait gagner du bruit. Sinon, le type explicite est une documentation qui coûte quelques caractères et évite un aller-retour dans le code.",
    },
    {
      kind: "text",
      text: "Une conséquence moins évidente concerne les types anonymes. `var x = new Object() { int compteur = 0; };` infère le type anonyme lui-même, et `x.compteur` devient accessible — ce qui était impossible avec une déclaration explicite, aucun nom n'existant pour ce type. C'est une curiosité plus qu'un outil, mais elle éclaire ce que `var` fait réellement : il nomme un type que le programmeur ne peut pas toujours écrire.",
    },
    {
      kind: "text",
      text: "Signalons enfin `var` dans les paramètres de lambda, autorisé depuis Java 11 : `(var a, var b) -> a + b`. Sans annotation à poser, il n'apporte rien et alourdit ; son seul intérêt réel est de permettre d'écrire `(@NonNull var a, var b) -> …`, une annotation étant impossible sur un paramètre implicite.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-mod-01",
    difficulty: 1,
    tags: ["java-moderne", "var"],
    prompt: "Que vaut le type de `x` après `var x = 1;` ?",
    choices: [
      "`int` : l'inférence choisit le type du littéral, qui est le plus étroit possible.",
      "`long` : l'inférence retient le type numérique le plus large pour éviter tout débordement.",
      "`Integer` : `var` produit toujours un type objet, jamais un primitif.",
      "`Object` : le type n'est fixé qu'à l'exécution, lors de la première affectation.",
    ],
    answer: 0,
    explanation:
      "`var` est une inférence à la compilation, pas un typage dynamique : le type vient de l'initialisateur, et le littéral `1` est un `int`. Si la variable doit accumuler de grandes valeurs, il faut écrire `var x = 1L;` ou garder le type explicite — sans quoi le débordement passera inaperçu.",
  },
  {
    kind: "spot",
    id: "java-mod-02",
    difficulty: 2,
    tags: ["java-moderne", "var"],
    prompt: "Une de ces déclarations ne compile pas. Laquelle, et pourquoi ?",
    code: {
      language: "java",
      code: `var client = new Client("alice");
var lignes = repo.findAll();
var total = 0L;
var resultat = null;
for (var l : lignes) { total += l.montant(); }`,
    },
    faultyLine: 4,
    reasons: [
      "`var x = null;` est refusé : `null` n'a pas de type propre, l'inférence n'a rien pour travailler.",
      "`var` ne peut pas être utilisé plusieurs fois dans la même méthode.",
      "`var total = 0L;` est invalide : `var` ne s'applique pas aux types primitifs.",
      "`for (var l : lignes)` est invalide : `var` est interdit dans une boucle.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'inférence repose entièrement sur l'initialisateur. `null` est compatible avec tous les types référence sans en désigner aucun, donc le compilateur refuse. Les primitifs sont parfaitement inférables, et `var` est explicitement autorisé dans les variables de boucle — c'est même l'un de ses usages les plus utiles.",
  },
  {
    kind: "recall",
    id: "java-mod-03",
    difficulty: 2,
    tags: ["java-moderne", "var"],
    prompt: "Où `var` est-il interdit, et pourquoi ces endroits précisément ?",
    explanation:
      "Il est interdit sur les champs d'instance et de classe, les paramètres de méthode et les types de retour — c'est-à-dire partout où le type fait partie d'une **signature** lue par d'autres classes. L'inférence y rendrait l'interface d'une classe dépendante de l'implémentation de ses méthodes, et un changement interne modifierait silencieusement le contrat public. `var` est donc cantonné aux variables locales, aux variables de boucle et aux ressources d'un `try`, où la portée est limitée à quelques lignes visibles d'un seul coup d'œil. S'y ajoutent deux refus mécaniques : sans initialisateur et avec `null`, l'inférence n'a rien sur quoi s'appuyer.",
    keyPoints: [
      "Interdit là où le type fait partie d'une signature publique",
      "Champs, paramètres, types de retour : le contrat resterait implicite",
      "Autorisé sur les locales, variables de boucle et ressources de try",
      "Refusé sans initialisateur et avec null",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Les blocs de texte
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-mod-l2",
  title: "Les blocs de texte",
  blocks: [
    {
      kind: "text",
      text: "Écrire une requête SQL, un fragment de JSON ou du HTML dans une chaîne Java a longtemps été pénible : concaténation ligne à ligne, `\\n` à la main, guillemets échappés partout. Le résultat était illisible et, surtout, impossible à comparer avec l'original — on ne pouvait pas copier la requête dans un client SQL sans la nettoyer d'abord.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Avant : le texte disparaît sous la syntaxe.",
      code: `String requete =
    "SELECT o.id, o.total, c.nom\\n" +
    "FROM orders o\\n" +
    "JOIN customers c ON c.id = o.customer_id\\n" +
    "WHERE o.status = 'PENDING'\\n" +
    "  AND o.total > ?\\n";

String json = "{\\"nom\\": \\"alice\\", \\"role\\": \\"USER\\"}";`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Le bloc de texte : le contenu tel qu'il est.",
      code: `String requete = """
        SELECT o.id, o.total, c.nom
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE o.status = 'PENDING'
          AND o.total > ?
        """;

String json = """
        {"nom": "alice", "role": "USER"}
        """;

// Les guillemets n'ont plus besoin d'être échappés,
// les retours à la ligne sont réels.`,
    },
    {
      kind: "text",
      text: "Le délimiteur est un triple guillemet suivi obligatoirement d'un retour à la ligne — écrire du contenu juste après `\"\"\"` est une erreur de compilation. Le bloc se termine par un second triple guillemet, dont la **position détermine l'indentation retirée**. C'est la règle centrale, et celle qui surprend au premier usage.",
    },
    {
      kind: "text",
      text: "Java calcule l'indentation dite *incidente* : il prend le minimum entre l'indentation de toutes les lignes non vides du contenu et celle de la ligne du délimiteur fermant, puis retire cette quantité à chaque ligne. Placer le délimiteur fermant plus à gauche que le contenu conserve donc une indentation dans la chaîne ; l'aligner sur le contenu la supprime entièrement.",
    },
    {
      kind: "comparison",
      title: "Deux positions du délimiteur fermant",
      left: {
        label: "Aligné sur le contenu",
        text: "L'indentation du code source est entièrement retirée. La chaîne commence au premier caractère visible de chaque ligne. C'est ce qu'on veut presque toujours — le bloc peut être déplacé dans le code sans changer sa valeur.",
      },
      right: {
        label: "Décalé à gauche",
        text: "La différence est conservée dans la chaîne. Utile pour produire volontairement du texte indenté, mais c'est aussi la cause d'espaces parasites involontaires, notamment après un reformatage automatique du fichier.",
      },
    },
    {
      kind: "text",
      text: "Un bloc se termine par un retour à la ligne, puisque le contenu inclut le saut précédant le délimiteur fermant. Quand ce n'est pas souhaité — une requête à passer telle quelle, une clé — on place le délimiteur fermant directement à la fin de la dernière ligne de contenu, ou l'on termine cette ligne par une barre oblique inverse, qui supprime le saut de ligne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux échappements propres aux blocs de texte.",
      code: `// \\ en fin de ligne : joint la ligne suivante
String phrase = """
        Une phrase longue coupée dans le source \\
        mais qui reste sur une seule ligne.
        """;

// \\s : préserve un espace en fin de ligne, que
// le compilateur retirerait sinon
String aligne = """
        nom    :\\s
        prenom :\\s
        """;

// Interpolation : elle n'existe pas en Java.
String salut = """
        Bonjour %s, vous avez %d messages.
        """.formatted(nom, nombre);`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les espaces de fin sont supprimés",
      text: "Java retire systématiquement les espaces en fin de chaque ligne d'un bloc de texte, ce qui est presque toujours souhaitable — ils sont invisibles et polluent les comparaisons. Mais si le format attendu en dépend, notamment pour des fichiers à colonnes fixes, il faut les protéger avec `\\s`, qui représente un espace conservé.",
    },
    {
      kind: "text",
      text: "Un bloc de texte est traité **à la compilation** : la chaîne obtenue est une constante ordinaire, internée comme n'importe quel littéral, et il n'y a aucun coût à l'exécution. Cela signifie aussi qu'un bloc peut servir partout où une constante de compilation est attendue, y compris comme valeur d'annotation ou dans un `case` — ce qui n'aurait pas été possible si la mise en forme avait lieu au lancement.",
    },
    {
      kind: "text",
      text: "Les échappements classiques restent utilisables : `\\n` insère un saut de ligne supplémentaire, `\\\\` une barre oblique inverse, et `\\\"` un guillemet — utile pour écrire trois guillemets consécutifs à l'intérieur d'un bloc, cas rare mais qui bloque quand il se présente. Le gain du bloc de texte ne supprime donc pas la syntaxe d'échappement, il la rend simplement inutile dans la quasi-totalité des cas.",
    },
    {
      kind: "text",
      text: "Dernier rappel, souvent testé : un bloc de texte reste une `String` ordinaire. Il n'y a **aucune interpolation** en Java — écrire `${nom}` dans un bloc produit littéralement ces caractères. Pour insérer des valeurs on utilise `formatted`, et pour une requête SQL on utilise des paramètres liés, jamais une concaténation, sous peine d'ouvrir une injection.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "java-mod-04",
    difficulty: 3,
    tags: ["java-moderne", "text-blocks"],
    prompt: "Le délimiteur fermant est aligné sur « Bonjour ». Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String s = """
        Bonjour
          Monde
        """;
System.out.print(s);`,
    },
    choices: [
      "Bonjour, puis une ligne « ␣␣Monde » indentée de deux espaces, puis un retour à la ligne final.",
      "Bonjour et Monde, tous deux indentés de huit espaces comme dans le source.",
      "Bonjour et Monde alignés à gauche, l'indentation de « Monde » étant supprimée elle aussi.",
      "Bonjour puis « ␣␣Monde », sans retour à la ligne final.",
    ],
    answer: 0,
    explanation:
      "L'indentation incidente est le minimum entre les lignes de contenu (8 et 10 espaces) et la ligne du délimiteur fermant (8) : soit 8. On retire 8 à chaque ligne, ce qui laisse « Bonjour » collé à gauche et « Monde » indenté de 2 — l'indentation **relative** est préservée. Le saut de ligne précédant le délimiteur fermant fait partie du contenu, d'où le retour à la ligne final.",
  },
  {
    kind: "mcq",
    id: "java-mod-05",
    difficulty: 2,
    tags: ["java-moderne", "text-blocks"],
    prompt: "Comment insérer la valeur d'une variable dans un bloc de texte ?",
    choices: [
      "Avec `.formatted(...)` et des marqueurs `%s` : Java n'a aucune interpolation de chaîne.",
      "Avec la syntaxe `${variable}`, interprétée dans les blocs de texte uniquement.",
      "Avec `\\{variable}`, l'échappement d'interpolation introduit par les blocs de texte.",
      "En concaténant avec `+`, seule méthode acceptée à l'intérieur d'un bloc.",
    ],
    answer: 0,
    explanation:
      "Un bloc de texte est une `String` ordinaire produite à la compilation : il n'introduit aucune interpolation. Écrire `${nom}` produit littéralement ces caractères. On utilise `formatted`, ou `String.format`. Pour une requête SQL, on passe par des paramètres liés et jamais par de la concaténation, sous peine d'ouvrir une injection.",
  },
  {
    kind: "recall",
    id: "java-mod-06",
    difficulty: 2,
    tags: ["java-moderne", "text-blocks"],
    prompt: "Comment Java décide-t-il de l'indentation à retirer d'un bloc de texte ?",
    explanation:
      "Il calcule l'indentation *incidente* : le minimum entre l'indentation de toutes les lignes de contenu non vides **et** celle de la ligne portant le délimiteur fermant, puis retire cette quantité à chaque ligne. La position du délimiteur fermant est donc un curseur — aligné sur le contenu, il supprime toute l'indentation du source ; décalé à gauche, il en conserve la différence dans la chaîne. L'indentation relative entre les lignes est toujours préservée. Deux détails complètent la règle : les espaces en fin de ligne sont systématiquement supprimés, sauf s'ils sont protégés par `\\s`, et le saut de ligne précédant le délimiteur fermant fait partie du contenu, à moins de terminer la dernière ligne par une barre oblique inverse.",
    keyPoints: [
      "Minimum entre les lignes de contenu et la ligne du délimiteur fermant",
      "La position du délimiteur fermant est le curseur d'indentation",
      "L'indentation relative entre lignes est préservée",
      "Espaces de fin supprimés sauf \\s ; saut de ligne final inclus sauf \\",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — record : le porteur de données
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-mod-l3",
  title: "record : le porteur de données",
  blocks: [
    {
      kind: "text",
      text: "Une classe qui ne fait que transporter quelques valeurs demandait en Java une quantité de code désarmante : des champs, un constructeur, un accesseur par champ, `equals`, `hashCode`, `toString`. Soixante lignes pour dire « un point a un x et un y », dont pas une n'exprime une décision. Et chaque champ ajouté six mois plus tard oblige à penser à mettre à jour `equals` et `hashCode`, ce que personne ne fait systématiquement.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce qu'il fallait écrire, et maintenir.",
      code: `public final class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) { this.x = x; this.y = y; }

    public int getX() { return x; }
    public int getY() { return y; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;
    }
    @Override public int hashCode() { return Objects.hash(x, y); }
    @Override public String toString() {
        return "Point[x=" + x + ", y=" + y + "]";
    }
}`,
    },
    {
      kind: "code",
      language: "java",
      caption: "La même chose, avec la même sémantique.",
      code: `public record Point(int x, int y) { }

// Le compilateur génère :
//  - deux champs private final
//  - le constructeur canonique Point(int, int)
//  - les accesseurs x() et y()   ← pas getX()
//  - equals et hashCode sur TOUS les composants
//  - toString au format Point[x=1, y=2]

var p = new Point(1, 2);
p.x();                       // 1
p.equals(new Point(1, 2));   // true`,
    },
    {
      kind: "text",
      text: "Le nom des accesseurs mérite attention : un `record` produit `x()` et non `getX()`. Ce n'est pas une coquetterie — la convention JavaBeans décrit des objets modifiables avec des accesseurs et des mutateurs, ce qu'un `record` n'est pas. En pratique, cela signifie qu'une bibliothèque attendant strictement des `getXxx` peut ne pas fonctionner, même si la plupart des outils modernes gèrent les deux formes.",
    },
    {
      kind: "text",
      text: "Un `record` est implicitement `final` et ne peut pas hériter d'une classe : sa hiérarchie est fermée par construction, ce qui garantit que `equals` a un sens. Il peut en revanche implémenter des interfaces autant qu'on veut, déclarer des méthodes, des méthodes statiques et des champs statiques. Ce qui lui est interdit, ce sont les **champs d'instance supplémentaires** : son état est exactement la liste de ses composants, sans exception.",
    },
    {
      kind: "comparison",
      title: "record ou classe ?",
      left: {
        label: "record",
        text: "Quand l'objet **est** ses données : un point, un intervalle, un DTO d'API, un résultat de requête, un événement. L'égalité par valeur est le comportement voulu, l'immuabilité aussi, et l'absence d'identité propre ne pose aucun problème.",
      },
      right: {
        label: "classe",
        text: "Quand l'objet a une identité propre ou un comportement qui évolue : une entité JPA avec sa clé, un service, un agrégat métier avec des invariants complexes. L'égalité par valeur y serait fausse — deux clients homonymes ne sont pas le même client.",
      },
    },
    {
      kind: "text",
      text: "Cette dernière ligne explique pourquoi un `record` fait une mauvaise entité JPA. Une entité doit être modifiable, possède un constructeur sans argument imposé par la spécification, et son identité repose sur sa clé primaire et non sur l'ensemble de ses champs. En revanche, un `record` est excellent pour la **projection** d'une requête, où l'on veut justement un porteur de valeurs immuable.",
    },
    {
      kind: "text",
      text: "Un dernier piège concerne l'immuabilité, qui n'est que superficielle. Un `record` garantit que ses références ne changent pas, pas que ce qu'elles désignent est figé. Un composant de type `List` reste modifiable par quiconque en obtient la référence, et l'objet cesse alors d'être la valeur immuable qu'on croyait manipuler.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Copier les collections à l'entrée",
      text: "`record Commande(String id, List<Ligne> lignes) { }` laisse l'appelant modifier la liste après construction, et donc changer la valeur de la commande dans le dos de tout le monde — y compris après son insertion dans une table de hachage, où son empreinte devient fausse. Un constructeur compact avec `lignes = List.copyOf(lignes)` supprime le problème en une ligne.",
    },
    {
      kind: "text",
      text: "Retenons la définition qui répond le mieux en entretien : un `record` est un porteur de données transparent, dont l'état est intégralement décrit par ses composants et dont l'égalité, l'empreinte et la représentation textuelle en découlent automatiquement. Tout ce qui ne rentre pas dans cette définition — identité, mutation, invariants complexes — appelle une classe ordinaire.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "java-mod-07",
    difficulty: 1,
    tags: ["java-moderne", "record"],
    prompt: "Comment lit-on le composant `x` d'un `record Point(int x, int y)` ?",
    choices: [
      "`p.x()` : les accesseurs d'un record portent le nom du composant, sans préfixe `get`.",
      "`p.getX()` : les records suivent la convention JavaBeans.",
      "`p.x` : les composants d'un record sont des champs publics.",
      "`p.get(\"x\")` : l'accès se fait par nom de composant.",
    ],
    answer: 0,
    explanation:
      "Un `record` génère des accesseurs nommés comme les composants : `x()` et `y()`. La convention JavaBeans décrit des objets modifiables avec accesseurs et mutateurs, ce qu'un record n'est pas. Les champs générés restent `private final` : ils ne sont jamais accessibles directement.",
  },
  {
    kind: "match",
    id: "java-mod-08",
    difficulty: 2,
    tags: ["java-moderne", "record"],
    prompt: "Associe chaque besoin au type de déclaration approprié.",
    pairs: [
      { left: "Un DTO renvoyé par une API REST", right: "record : l'objet est ses données, immuable" },
      { left: "Une entité JPA avec une clé technique", right: "classe : identité propre, état modifiable" },
      { left: "Une projection de requête en lecture", right: "record : porteur de valeurs sans identité" },
      { left: "Un agrégat métier à invariants complexes", right: "classe : comportement et règles internes" },
    ],
    explanation:
      "La question à trancher est celle de l'identité : deux clients homonymes ne sont pas le même client, donc l'égalité par valeur d'un record y serait fausse. Une entité JPA cumule les obstacles — état modifiable, constructeur sans argument imposé par la spécification, identité portée par la clé primaire — mais la projection d'une requête est au contraire un cas idéal.",
  },
  {
    kind: "recall",
    id: "java-mod-09",
    difficulty: 3,
    tags: ["java-moderne", "record"],
    prompt: "En quoi l'immuabilité d'un `record` est-elle superficielle, et comment y remédier ?",
    explanation:
      "Le compilateur garantit que les **références** ne changent pas : les champs générés sont `private final` et aucun mutateur n'existe. Il ne garantit rien sur ce que ces références désignent. Un composant de type `List`, `Map` ou tableau reste donc modifiable par quiconque en détient la référence — typiquement l'appelant, qui a passé sa propre liste au constructeur et peut continuer à la modifier ensuite. L'objet cesse alors d'être la valeur qu'on croyait manipuler, et le dégât est particulièrement sournois s'il a été rangé dans une table de hachage : son empreinte a été calculée sur l'ancien contenu et ne correspond plus. Le remède tient en une ligne dans un constructeur compact — `lignes = List.copyOf(lignes)` — qui copie à l'entrée et rend la copie non modifiable.",
    keyPoints: [
      "Seules les références sont figées, pas ce qu'elles désignent",
      "Une List passée au constructeur reste modifiable par l'appelant",
      "Effet sournois dans une table de hachage : l'empreinte devient fausse",
      "Remède : List.copyOf dans un constructeur compact",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — record avancé : constructeur compact et invariants
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-mod-l4",
  title: "record avancé : constructeur compact et invariants",
  blocks: [
    {
      kind: "text",
      text: "Un `record` déclaré nu accepte n'importe quelles valeurs : un intervalle dont la borne basse dépasse la borne haute, un montant négatif, une adresse électronique vide. Un objet qui ne peut pas exister dans le domaine ne devrait pas pouvoir être construit — c'est le principe de l'objet toujours valide, et un `record` sait le respecter sans qu'on renonce à sa concision.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le constructeur compact : validation et normalisation.",
      code: `public record Intervalle(int debut, int fin) {

    // Constructeur COMPACT : pas de parenthèses, pas
    // d'affectation finale. Le compilateur affecte
    // automatiquement les champs à la sortie du bloc.
    public Intervalle {
        if (debut > fin) {
            throw new IllegalArgumentException(
                "debut (" + debut + ") > fin (" + fin + ")");
        }
    }
}

new Intervalle(1, 5);    // ok
new Intervalle(5, 1);    // IllegalArgumentException`,
    },
    {
      kind: "text",
      text: "Le constructeur compact est la forme à connaître : on écrit le nom du record suivi d'un bloc, sans liste de paramètres et sans affectation. Les paramètres sont implicitement ceux du constructeur canonique, et l'affectation aux champs a lieu automatiquement **après** le bloc. C'est ce qui permet d'y normaliser les valeurs : réassigner un paramètre modifie ce qui sera stocké.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Normaliser, copier, et ajouter des fabriques.",
      code: `public record Client(String email, List<String> roles) {

    public Client {
        Objects.requireNonNull(email, "email obligatoire");
        email = email.trim().toLowerCase();     // normalisation
        roles = List.copyOf(roles);             // copie défensive
    }

    // Méthode d'instance : parfaitement autorisée
    public boolean estAdmin() { return roles.contains("ADMIN"); }

    // Fabrique statique : nomme l'intention
    public static Client nouveau(String email) {
        return new Client(email, List.of("USER"));
    }

    // Champ STATIQUE autorisé ; champ d'instance interdit
    private static final int MAX_ROLES = 10;
}`,
    },
    {
      kind: "text",
      text: "Réassigner un paramètre dans le bloc compact peut surprendre, mais c'est le mécanisme prévu : on travaille sur les paramètres, et leur valeur finale est celle qui atterrit dans les champs. C'est ce qui rend possibles en trois lignes la vérification, la normalisation — mettre une adresse en minuscules, retirer les espaces — et la copie défensive des collections.",
    },
    {
      kind: "comparison",
      title: "Deux formes de constructeur",
      left: {
        label: "Compact",
        text: "`public Intervalle { … }` — sans paramètres ni affectation. À utiliser dans tous les cas de validation et de normalisation, c'est-à-dire presque toujours. Court, et impossible d'oublier d'affecter un champ.",
      },
      right: {
        label: "Canonique explicite",
        text: "`public Intervalle(int debut, int fin) { this.debut = …; }` — la forme complète, où l'on doit affecter soi-même chaque champ. Nécessaire seulement pour un cas rare, comme un calcul croisé entre composants.",
      },
    },
    {
      kind: "text",
      text: "Les constructeurs surchargés sont autorisés à condition qu'ils délèguent au canonique par `this(...)`. C'est une règle stricte, et elle est saine : elle garantit que toutes les voies de construction passent par la validation unique du constructeur compact. Aucun chemin détourné ne peut produire un objet non valide.",
    },
    {
      kind: "text",
      text: "Une limite mérite d'être connue avant de généraliser les `record` aux DTO d'API : sans configuration, certaines bibliothèques de sérialisation ont besoin des noms de paramètres pour reconstruire l'objet, ce qui suppose que le code soit compilé avec l'option `-parameters`. Les versions récentes de Jackson et les chaînes de compilation Spring Boot activent cela par défaut, mais le symptôme — un échec de désérialisation incompréhensible — vaut d'être connu.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le record modifié : une copie, pas une mutation",
      text: "Comme il n'y a pas de mutateur, « changer » un composant consiste à construire une nouvelle instance : `var majore = new Commande(c.id(), c.total().add(frais));`. Avec beaucoup de composants, cela devient verbeux et l'on ajoute une méthode dédiée — `public Commande avecTotal(BigDecimal t) { return new Commande(id, t); }` — qui garde l'intention lisible tout en préservant l'immuabilité.",
    },
    {
      kind: "text",
      text: "Un mot sur l'égalité des composants flottants, qui réserve une surprise : `equals` généré compare les `double` avec la sémantique de `Double.compare`, et non avec l'opérateur `==`. Deux records contenant `Double.NaN` sont donc égaux, alors que `NaN == NaN` est faux. C'est le comportement cohérent pour une valeur, mais il diffère de celui qu'on écrirait spontanément à la main.",
    },
    {
      kind: "text",
      text: "Retenons la règle d'usage : dès qu'un `record` a le moindre invariant, le constructeur compact le porte. C'est trois lignes, cela rend l'objet impossible à construire dans un état incohérent, et cela déplace la vérification du code appelant — où elle serait dupliquée et oubliée — vers le type lui-même, où elle est écrite une fois.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "fill",
    id: "java-mod-10",
    difficulty: 2,
    tags: ["java-moderne", "record"],
    prompt: "Complète le constructeur compact : validation puis copie défensive.",
    code: {
      language: "java",
      code: `public record Client(String email, List<String> roles) {
    public Client {
        Objects.{{1}}(email, "email obligatoire");
        roles = List.{{2}}(roles);
    }
}`,
    },
    blanks: ["requireNonNull", "copyOf"],
    distractors: ["checkNotNull", "isNull", "of", "unmodifiableList"],
    explanation:
      "`Objects.requireNonNull` lève une `NullPointerException` explicite avec un message, au lieu de laisser l'erreur surgir plus tard. `List.copyOf` crée une copie non modifiable : `List.of(roles)` produirait une liste contenant *une* liste, et `unmodifiableList` ne ferait qu'envelopper la liste d'origine, qui resterait modifiable par l'appelant.",
  },
  {
    kind: "mcq",
    id: "java-mod-11",
    difficulty: 2,
    tags: ["java-moderne", "record"],
    prompt: "Dans un constructeur compact, que fait `email = email.trim();` ?",
    choices: [
      "Il modifie le paramètre, et c'est cette valeur normalisée qui sera affectée au champ à la sortie du bloc.",
      "Rien : le champ a déjà été affecté avant l'exécution du bloc.",
      "Il provoque une erreur de compilation : les paramètres d'un record sont finaux.",
      "Il crée un champ local distinct, sans effet sur l'état du record.",
    ],
    answer: 0,
    explanation:
      "Le constructeur compact travaille sur les paramètres du constructeur canonique, et l'affectation aux champs a lieu **après** le bloc. Réassigner un paramètre est donc le mécanisme prévu pour normaliser une valeur — mettre en minuscules, retirer les espaces — ou pour effectuer une copie défensive d'une collection.",
  },
  {
    kind: "spot",
    id: "java-mod-12",
    difficulty: 3,
    tags: ["java-moderne", "record"],
    prompt: "Ce record ne compile pas. Quelle ligne ?",
    code: {
      language: "java",
      code: `public record Commande(String id, BigDecimal total) {
    private int nombreAcces = 0;

    public Commande {
        Objects.requireNonNull(id);
    }

    public static Commande vide() {
        return new Commande("", BigDecimal.ZERO);
    }
}`,
    },
    faultyLine: 2,
    reasons: [
      "Un record ne peut pas déclarer de champ d'instance : son état est exactement la liste de ses composants.",
      "Le constructeur compact ne peut pas coexister avec une méthode statique.",
      "`BigDecimal.ZERO` n'est pas une constante valide pour un composant de record.",
      "Une méthode statique dans un record doit être déclarée `final`.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'état d'un record est intégralement décrit par ses composants — c'est ce qui rend `equals`, `hashCode` et `toString` générables automatiquement et corrects. Autoriser un champ d'instance supplémentaire romprait cette garantie. Les champs **statiques** restent permis, tout comme les méthodes d'instance, les méthodes statiques et les fabriques.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Les hiérarchies scellées
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "java-mod-l5",
  title: "Les hiérarchies scellées",
  blocks: [
    {
      kind: "text",
      text: "Une interface Java est ouverte : n'importe qui peut l'implémenter, y compris dans un autre module. C'est exactement ce qu'on veut pour un point d'extension — un `PaymentMethod` que d'autres équipes complètent. C'est exactement ce qu'on ne veut pas pour modéliser un ensemble **fermé** de cas : un résultat qui est soit un succès soit un échec, une figure qui est un cercle, un carré ou un triangle, et rien d'autre.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Sans scellement : le compilateur ne peut rien garantir.",
      code: `interface Resultat { }
record Succes(String valeur) implements Resultat { }
record Echec(String message) implements Resultat { }

String decrire(Resultat r) {
    if (r instanceof Succes s) return "ok : " + s.valeur();
    if (r instanceof Echec e)  return "ko : " + e.message();
    // Obligé de prévoir un cas impossible, sans savoir
    // s'il l'est vraiment : rien n'empêche quelqu'un
    // d'ajouter un troisième cas ailleurs.
    throw new IllegalStateException("cas inconnu");
}`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Avec sealed : l'ensemble des cas est connu du compilateur.",
      code: `public sealed interface Resultat
        permits Succes, Echec { }

public record Succes(String valeur) implements Resultat { }
public record Echec(String message) implements Resultat { }

// Le compilateur sait qu'il n'existe que deux cas.
// La branche par défaut devient inutile — et surtout,
// ajouter un cas fera échouer la compilation partout
// où l'exhaustivité n'est plus assurée.`,
    },
    {
      kind: "text",
      text: "Le mot-clé `sealed` s'accompagne d'une clause `permits` qui énumère les sous-types autorisés. Cette clause peut être omise si tous les sous-types sont déclarés dans le **même fichier**, ce qui est fréquent et concis pour un petit ensemble de cas. Les sous-types doivent se trouver dans le même module, ou dans le même paquet en l'absence de module.",
    },
    {
      kind: "text",
      text: "Chaque sous-type doit ensuite déclarer sa propre politique d'ouverture, et c'est une obligation, pas une option. Il est soit `final` — il ferme la branche —, soit `sealed` à son tour avec sa propre liste, soit `non-sealed`, ce qui rouvre explicitement l'extension à partir de ce point. Un `record` étant implicitement final, il satisfait la règle sans qu'on écrive quoi que ce soit.",
    },
    {
      kind: "comparison",
      title: "Deux façons de fermer une hiérarchie",
      left: {
        label: "enum",
        text: "Un ensemble fini d'instances **constantes**, connues à l'écriture. `Statut.PENDING`. Chaque cas est une valeur unique sans données propres — ou avec des données identiques pour toutes les instances de la constante.",
      },
      right: {
        label: "sealed",
        text: "Un ensemble fini de **types**, chacun avec ses propres données et un nombre illimité d'instances. `Echec(\"réseau\")` et `Echec(\"timeout\")` sont deux valeurs distinctes du même cas. C'est ce qu'on appelle ailleurs un type somme.",
      },
    },
    {
      kind: "text",
      text: "Le bénéfice décisif n'est pas la fermeture en elle-même mais ce qu'elle permet au compilateur : l'**exhaustivité**. Sur un `switch` portant sur un type scellé, le compilateur vérifie que tous les cas sont traités et se passe alors de branche par défaut. Le jour où un troisième cas est ajouté à la hiérarchie, tous les `switch` devenus incomplets refusent de compiler, et l'on obtient la liste exacte des endroits à mettre à jour.",
    },
    {
      kind: "text",
      text: "C'est un renversement complet par rapport à l'approche habituelle. Sans scellement, ajouter un cas produit une erreur à l'exécution, dans une branche par défaut, chez un client, des semaines plus tard. Avec, l'oubli devient une erreur de compilation immédiate. On échange une catégorie entière de bugs de production contre quelques minutes de correction guidée.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ne pas mettre de branche par défaut",
      text: "Ajouter un `default` à un `switch` sur un type scellé annule tout le bénéfice : le compilateur considère le `switch` exhaustif quoi qu'il arrive, et l'ajout d'un cas passera silencieusement dans le `default`. On énumère donc les cas, et on laisse le compilateur signaler ce qui manque — c'est précisément ce qu'on est venu chercher.",
    },
    {
      kind: "text",
      text: "Une classe abstraite peut elle aussi être scellée, ce qui permet de partager du code entre les cas — un champ commun, une méthode utilitaire — tout en gardant l'ensemble fermé. On y perd la concision des records, et l'on retrouve la question habituelle : partager par héritage, ou composer. Le scellement ne tranche pas ce débat, il garantit seulement que la liste des cas reste connue.",
    },
    {
      kind: "text",
      text: "En pratique, `sealed` s'emploie surtout pour modéliser des résultats et des états : le retour d'une opération qui peut échouer de plusieurs façons, les états d'une commande, les variantes d'un événement. Chaque fois qu'on écrit une énumération accompagnée d'un objet dont certains champs ne valent quelque chose que pour certaines valeurs, une hiérarchie scellée exprime la même chose sans champs fantômes.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "mcq",
    id: "java-mod-13",
    difficulty: 2,
    tags: ["java-moderne", "sealed"],
    prompt: "Quel est le bénéfice principal d'une interface `sealed` ?",
    choices: [
      "Le compilateur connaît tous les cas et peut vérifier l'exhaustivité d'un `switch`.",
      "Les sous-types deviennent automatiquement immuables et thread-safe.",
      "La sérialisation est optimisée, la liste des sous-types étant connue à l'avance.",
      "L'appel de méthode devient plus rapide, la répartition dynamique étant supprimée.",
    ],
    answer: 0,
    explanation:
      "Le scellement n'apporte ni immuabilité ni gain de performance : il apporte une garantie au compilateur. Connaissant l'ensemble fermé des sous-types, il vérifie qu'un `switch` les traite tous et se passe de branche par défaut. Ajouter un cas fait alors échouer la compilation partout où le traitement est devenu incomplet.",
  },
  {
    kind: "order",
    id: "java-mod-14",
    difficulty: 2,
    tags: ["java-moderne", "sealed"],
    prompt: "Remets dans l'ordre ce qui se passe quand on ajoute un troisième cas à une hiérarchie scellée.",
    items: [
      "On ajoute le nouveau sous-type et on l'inscrit dans la clause permits",
      "La compilation échoue sur chaque switch devenu non exhaustif",
      "Le compilateur fournit la liste exacte des endroits à compléter",
      "On traite le nouveau cas à chacun de ces endroits, et la compilation repasse",
    ],
    explanation:
      "C'est le renversement apporté par le scellement : sans lui, l'oubli d'un cas se manifeste à l'exécution, dans une branche par défaut, chez un client et des semaines plus tard. Avec lui, c'est une erreur de compilation immédiate, accompagnée de la liste des corrections à faire. Encore faut-il ne pas avoir mis de `default`, qui annulerait la vérification.",
  },
  {
    kind: "recall",
    id: "java-mod-15",
    difficulty: 2,
    tags: ["java-moderne", "sealed"],
    prompt: "Quelles obligations pèsent sur les sous-types d'un type scellé ?",
    explanation:
      "Chacun doit déclarer explicitement sa propre politique d'extension : `final` pour fermer la branche, `sealed` avec sa propre clause `permits` pour la fermer partiellement, ou `non-sealed` pour la rouvrir à tout le monde à partir de ce point. Cette déclaration est obligatoire — il n'y a pas de valeur par défaut — car c'est elle qui rend la fermeture vérifiable de proche en proche. Un `record` étant implicitement final, il satisfait la règle sans rien écrire, ce qui explique la fréquence du couple `sealed interface` et `record`. S'y ajoutent deux contraintes de localisation : les sous-types doivent appartenir au même module, ou au même paquet en l'absence de module, et la clause `permits` peut être omise s'ils sont tous déclarés dans le même fichier.",
    keyPoints: [
      "final, sealed ou non-sealed : la déclaration est obligatoire",
      "Un record est implicitement final : rien à écrire",
      "Même module, ou même paquet sans module",
      "permits facultatif si tous les sous-types sont dans le même fichier",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Le filtrage par motif
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "java-mod-l6",
  title: "Le filtrage par motif",
  blocks: [
    {
      kind: "text",
      text: "Tester le type d'un objet puis le convertir était l'un des gestes les plus répétitifs de Java : `instanceof` suivi d'une conversion vers le type qu'on venait de vérifier. Le compilateur savait déjà le type, mais la syntaxe obligeait à le redire, et à introduire une variable dont le nom n'apprenait rien.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le rituel du test-puis-conversion.",
      code: `if (o instanceof String) {
    String s = (String) o;          // redite
    if (s.length() > 3) {
        return s.toUpperCase();
    }
}

// La conversion ne peut pas échouer — on vient de la
// tester — mais elle est écrite, lue et maintenue.`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Le motif de type : le test déclare la variable.",
      code: `if (o instanceof String s && s.length() > 3) {
    return s.toUpperCase();
}

// s n'existe QUE là où le test a réussi. Sa portée est
// calculée par le compilateur :
if (!(o instanceof String s)) {
    return "pas une chaîne";
}
return s.toUpperCase();     // ici, s est bien visible`,
    },
    {
      kind: "text",
      text: "La portée de la variable de motif est déterminée par le flot : elle existe là où le test est nécessairement vrai. C'est ce qui permet le second exemple, où la négation du test provoque un retour anticipé et où la variable reste utilisable après le bloc. Cette règle paraît subtile mais elle correspond exactement à l'intuition — on peut utiliser `s` partout où l'on sait que `o` est une chaîne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les motifs de record : la déconstruction.",
      code: `record Point(int x, int y) { }
record Ligne(Point debut, Point fin) { }

if (o instanceof Point(int x, int y)) {
    return x + y;               // x et y directement liés
}

// Et l'imbrication fonctionne :
if (o instanceof Ligne(Point(var x1, var y1), Point p2)) {
    return "de (" + x1 + "," + y1 + ") vers " + p2;
}

// Combiné à un switch sur type scellé :
return switch (figure) {
    case Cercle(double r)          -> Math.PI * r * r;
    case Rectangle(double l, double h) -> l * h;
};`,
    },
    {
      kind: "text",
      text: "Les motifs de `record`, arrivés avec Java 21, poussent l'idée plus loin : au lieu de lier l'objet entier, on lie directement ses composants, et l'on peut imbriquer les motifs pour descendre dans une structure. La combinaison avec les types scellés et le `switch` donne une façon de traiter une hiérarchie fermée qui tient en quelques lignes et que le compilateur vérifie.",
    },
    {
      kind: "comparison",
      title: "Deux façons de traiter une hiérarchie",
      left: {
        label: "Polymorphisme",
        text: "Chaque sous-type porte sa propre implémentation d'une méthode déclarée dans le type parent. À préférer quand le comportement appartient au type et vaut partout : `figure.aire()`.",
      },
      right: {
        label: "Filtrage par motif",
        text: "Le traitement vit à l'extérieur, dans un `switch` sur les cas. À préférer quand le comportement n'appartient pas au domaine — une conversion vers un format d'affichage, une sérialisation — et qu'on ne veut pas le faire entrer dans le modèle.",
      },
    },
    {
      kind: "text",
      text: "Ce choix est une vraie décision de conception, pas une question de style. Ajouter un **cas** est facile avec le polymorphisme et coûteux avec le filtrage, qui oblige à compléter chaque `switch` — mais le compilateur le signale. Ajouter une **opération** est l'inverse : trivial avec un nouveau `switch`, coûteux en polymorphisme puisqu'il faut toucher chaque sous-type.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Les gardes, avec when",
      text: "Un motif peut être affiné par une condition : `case Client c when c.estAdmin() -> …`. La garde est évaluée après la correspondance du type, et les cas sont examinés dans l'ordre d'écriture — un motif gardé doit donc précéder le même motif sans garde, faute de quoi le compilateur signale un cas inatteignable.",
    },
    {
      kind: "text",
      text: "Les motifs s'appliquent aussi aux génériques, avec une limite qui découle de l'effacement de type : `o instanceof List<String> l` ne compile pas, car rien à l'exécution ne distingue une liste de chaînes d'une liste d'entiers. On écrit `o instanceof List<?> l`, quitte à vérifier ensuite le contenu. C'est la même contrainte que celle qui interdit les conversions vers un type générique paramétré sans avertissement.",
    },
    {
      kind: "text",
      text: "Une variable de motif peut enfin être réutilisée dans plusieurs branches d'une même condition, à condition que sa portée soit cohérente. En revanche, deux motifs portant le même nom dans des branches distinctes d'un `switch` sont indépendants : chacun n'existe que dans sa branche. Cela permet de nommer systématiquement la variable d'après le type — `case Cercle c`, `case Carre c` — sans conflit.",
    },
    {
      kind: "text",
      text: "Un dernier point à connaître : `case null`. Historiquement, un `switch` levait une `NullPointerException` sur une valeur nulle, avant même d'examiner les cas. Un `switch` à motifs permet désormais d'écrire `case null ->` pour la traiter explicitement ; en son absence, le comportement historique est conservé. Rendre ce cas visible évite une exception à l'endroit le moins attendu.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "java-mod-16",
    difficulty: 2,
    tags: ["java-moderne", "pattern-matching"],
    prompt: "Après `if (!(o instanceof String s)) { return \"non\"; }`, la variable `s` est-elle utilisable à la ligne suivante ?",
    choices: [
      "Oui : la portée d'une variable de motif s'étend là où le test est nécessairement vrai.",
      "Non : elle n'existe que dans le bloc du `if`, ici celui du retour anticipé.",
      "Non : une variable de motif ne peut pas être utilisée après une négation.",
      "Oui, mais elle peut valoir `null` si `o` n'était pas une chaîne.",
    ],
    answer: 0,
    explanation:
      "Le compilateur calcule la portée à partir du flot : après le retour anticipé, la seule façon d'atteindre la ligne suivante est que le test ait réussi, donc `s` y est visible et correctement typée. C'est ce qui rend le style « garde en tête de méthode » naturel, sans imbriquer le code utile dans un bloc.",
  },
  {
    kind: "fill",
    id: "java-mod-17",
    difficulty: 2,
    tags: ["java-moderne", "pattern-matching"],
    prompt: "Complète le motif de record et la garde.",
    code: {
      language: "java",
      code: `record Point(int x, int y) { }

String decrire(Object o) {
    return switch (o) {
        case Point(int x, int y) {{1}} x == y -> "diagonale";
        case {{2}}(int x, int y) -> "point " + x + "," + y;
        default -> "autre";
    };
}`,
    },
    blanks: ["when", "Point"],
    distractors: ["if", "where", "Object"],
    explanation:
      "`when` introduit une garde, évaluée après la correspondance du type. Les cas étant examinés dans l'ordre d'écriture, le motif gardé doit précéder le même motif sans garde — sinon le second capterait tout et le compilateur signalerait un cas inatteignable. Le motif de record déconstruit l'objet et lie directement ses composants.",
  },
  {
    kind: "recall",
    id: "java-mod-18",
    difficulty: 3,
    tags: ["java-moderne", "pattern-matching", "conception"],
    prompt: "Quand préférer le polymorphisme au filtrage par motif, et inversement ?",
    explanation:
      "La question se ramène à l'axe selon lequel le code va évoluer. Le polymorphisme rend facile l'ajout d'un **cas** — un nouveau sous-type apporte son implémentation, rien d'autre ne bouge — et coûteux l'ajout d'une **opération**, qui oblige à modifier tous les sous-types. Le filtrage par motif fait exactement l'inverse : une nouvelle opération est un nouveau `switch` écrit à un seul endroit, tandis qu'un nouveau cas oblige à compléter tous les `switch` existants. La différence décisive est que, sur une hiérarchie scellée, ce dernier coût est **guidé par le compilateur**, qui refuse de compiler les `switch` devenus incomplets. En pratique, on garde dans le type le comportement qui lui appartient — `figure.aire()` — et l'on sort par filtrage ce qui n'a rien à faire dans le modèle : rendu, sérialisation, conversion vers un format d'affichage.",
    keyPoints: [
      "Polymorphisme : ajouter un cas est facile, ajouter une opération est coûteux",
      "Filtrage : ajouter une opération est facile, ajouter un cas est coûteux",
      "Avec sealed, l'ajout d'un cas est guidé par le compilateur",
      "Comportement du domaine dans le type, le reste par filtrage",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — switch : de l'instruction à l'expression
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "java-mod-l7",
  title: "switch : de l'instruction à l'expression",
  blocks: [
    {
      kind: "text",
      text: "L'ancien `switch` de Java avait trois défauts qui se combinaient mal. Il ne produisait pas de valeur, obligeant à déclarer une variable avant et à l'affecter dans chaque branche. Chaque branche devait se terminer par `break`, et l'oublier faisait tomber l'exécution dans la suivante. Et il ne vérifiait jamais que tous les cas étaient traités.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les trois pièges, réunis.",
      code: `String taille;
switch (n) {
    case 1:
    case 2:
        taille = "petit";
        // break oublié : on tombe dans le cas suivant
    case 3:
        taille = "moyen";
        break;
    default:
        taille = "grand";
}
// « taille » doit être déclarée avant, non finale,
// et le compilateur ne dira rien de l'oubli du break.`,
    },
    {
      kind: "code",
      language: "java",
      caption: "L'expression switch : une valeur, sans break.",
      code: `var taille = switch (n) {
    case 1, 2 -> "petit";
    case 3, 4 -> "moyen";
    default   -> "grand";
};

// Pour une branche à plusieurs instructions, un bloc
// et le mot-clé yield qui produit la valeur :
var libelle = switch (n) {
    case 1, 2 -> "petit";
    case 3, 4 -> {
        var base = "moy";
        yield base + "en";
    }
    default -> "grand";
};`,
    },
    {
      kind: "text",
      text: "La flèche remplace le deux-points et supprime la chute d'un cas dans le suivant : chaque branche est close par construction, et le `break` disparaît. Plusieurs étiquettes se regroupent par une virgule. Quand une branche a besoin de plusieurs instructions, on ouvre un bloc et l'on produit la valeur avec `yield` — le `return` y est interdit, car il sortirait de la méthode et non du `switch`.",
    },
    {
      kind: "text",
      text: "Le troisième apport est l'exhaustivité. Une expression `switch` **doit** couvrir tous les cas possibles, puisqu'elle doit produire une valeur quoi qu'il arrive. Sur une énumération, cela signifie traiter toutes les constantes — ou fournir un `default`. Le compilateur refuse toute expression incomplète, ce qui transforme une classe entière d'oublis en erreurs immédiates.",
    },
    {
      kind: "comparison",
      title: "Instruction ou expression",
      left: {
        label: "Instruction switch",
        text: "Exécute des effets sans produire de valeur. L'exhaustivité n'est pas exigée, et la forme historique à deux-points reste acceptée avec sa chute d'un cas dans le suivant. À réserver aux cas où l'on agit vraiment sans rien calculer.",
      },
      right: {
        label: "Expression switch",
        text: "Produit une valeur, donc doit être exhaustive et se termine par un point-virgule. Permet d'affecter une variable `final` en une fois, ce qui supprime la déclaration préalable et la fenêtre où la variable n'est pas encore initialisée.",
      },
    },
    {
      kind: "text",
      text: "Un point d'attention sur les énumérations : ajouter une constante à une énumération traitée par une expression `switch` **sans** `default` fait échouer la compilation, ce qui est le comportement souhaitable — on obtient la liste des endroits à compléter. Ajouter un `default` supprime cette protection, exactement comme sur une hiérarchie scellée.",
    },
    {
      kind: "text",
      text: "Depuis Java 21, l'expression `switch` accepte aussi les motifs de type, ce qui la rend capable de traiter une hiérarchie scellée avec la même vérification d'exhaustivité. C'est la convergence des trois notions vues précédemment : des types fermés, des motifs qui déconstruisent, et une expression que le compilateur oblige à être complète.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "yield, pas return",
      text: "Dans un bloc de branche, `return` sort de la **méthode** et non du `switch` : c'est une erreur de compilation dans une expression. La valeur d'une branche se produit avec `yield`. La confusion est fréquente au début, et le message d'erreur n'est pas toujours limpide — retenir que `yield` alimente le `switch` et que `return` quitte la méthode suffit à l'éviter.",
    },
    {
      kind: "text",
      text: "Un détail de compatibilité mérite d'être signalé : la forme à flèche et la forme historique à deux-points ne peuvent pas être mélangées dans un même `switch`. Le compilateur refuse la combinaison, ce qui évite un code où certaines branches tomberaient dans la suivante et d'autres non. Convertir un ancien `switch` se fait donc d'un bloc, ce qui est l'occasion de vérifier chaque `break` au passage.",
    },
    {
      kind: "text",
      text: "En pratique, l'expression `switch` a supplanté l'instruction pour tout ce qui calcule une valeur, et c'est la forme attendue dans du code récent. Elle rend les variables finales possibles, supprime une source d'erreur silencieuse, et transforme l'exhaustivité en garantie du compilateur plutôt qu'en discipline du développeur.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "output",
    id: "java-mod-19",
    difficulty: 2,
    tags: ["java-moderne", "switch"],
    prompt: "Que produit cet appel ?",
    code: {
      language: "java",
      code: `static String taille(int n) {
    return switch (n) {
        case 1, 2 -> "petit";
        case 3, 4 -> {
            var base = "moy";
            yield base + "en";
        }
        default -> "grand";
    };
}

System.out.println(taille(3) + "/" + taille(7));`,
    },
    choices: [
      "moyen/grand",
      "moyen/moyen",
      "petit/grand",
      "Erreur de compilation : `yield` ne peut pas être utilisé dans une expression switch.",
    ],
    answer: 0,
    explanation:
      "`taille(3)` correspond à `case 3, 4`, dont le bloc produit `\"moy\" + \"en\"` soit `moyen` grâce à `yield`. `taille(7)` ne correspond à aucune étiquette et tombe dans `default`, qui donne `grand`. Il n'y a aucune chute d'un cas dans le suivant avec la syntaxe à flèche : chaque branche est close par construction.",
  },
  {
    kind: "mcq",
    id: "java-mod-20",
    difficulty: 2,
    tags: ["java-moderne", "switch"],
    prompt: "Pourquoi éviter un `default` dans une expression `switch` portant sur une énumération ?",
    choices: [
      "Sans `default`, l'ajout d'une constante fait échouer la compilation et signale les endroits à compléter.",
      "Un `default` sur une énumération est interdit par le compilateur.",
      "Le `default` empêche l'utilisation de `yield` dans les autres branches.",
      "Il ralentit l'exécution en ajoutant un test supplémentaire à chaque appel.",
    ],
    answer: 0,
    explanation:
      "L'exhaustivité vérifiée est précisément ce qu'on vient chercher : sans `default`, ajouter une constante à l'énumération casse la compilation de tous les `switch` devenus incomplets, et l'on obtient la liste des corrections à faire. Un `default` rend le `switch` exhaustif quoi qu'il arrive, et le nouveau cas y tombera silencieusement.",
  },
  {
    kind: "match",
    id: "java-mod-21",
    difficulty: 2,
    tags: ["java-moderne", "switch"],
    prompt: "Associe chaque élément de syntaxe à son rôle.",
    pairs: [
      { left: "case 1, 2 ->", right: "Regrouper des étiquettes, sans chute dans le cas suivant" },
      { left: "yield", right: "Produire la valeur d'une branche à plusieurs instructions" },
      { left: "case Point(int x, int y)", right: "Déconstruire un record et lier ses composants" },
      { left: "case Client c when c.estAdmin()", right: "Affiner un motif par une condition" },
    ],
    explanation:
      "La flèche close chaque branche, ce qui supprime le `break` et la chute accidentelle. `yield` alimente le `switch`, là où `return` sortirait de la méthode. Motifs de record et gardes sont arrivés avec Java 21 et se combinent avec les types scellés, dont ils permettent de traiter tous les cas sous le contrôle du compilateur.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — java.time : choisir le bon type
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "java-mod-l8",
  title: "java.time : choisir le bon type",
  blocks: [
    {
      kind: "text",
      text: "L'ancienne API des dates était une source d'erreurs bien documentée : `Date` était modifiable, les mois commençaient à zéro, `Calendar` était lourd, et `SimpleDateFormat` n'était pas utilisable depuis plusieurs fils d'exécution. `java.time` a réglé tout cela, mais son apport principal est ailleurs : elle **distingue des concepts** que l'ancienne API confondait.",
    },
    {
      kind: "text",
      text: "La distinction fondamentale oppose un instant sur la ligne du temps et une date-heure de calendrier. Un `Instant` désigne un point unique, identique pour tout le monde sur la planète. Un `LocalDateTime` est une paire date-heure **sans fuseau**, comme « le 14 juillet à 9 h » sur un carton d'invitation : cela ne désigne aucun instant précis tant qu'on n'a pas dit où.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les types, et ce que chacun désigne.",
      code: `Instant.now()          // point sur la ligne du temps, en UTC
                       // 2026-03-28T11:00:00Z
                       // → pour un horodatage d'événement

LocalDate.of(2026,3,28)   // une date, sans heure ni fuseau
                          // → anniversaire, échéance

LocalTime.of(9, 0)        // une heure, sans date ni fuseau
                          // → heure d'ouverture

LocalDateTime.of(…)       // date + heure, SANS fuseau
                          // → PAS un point dans le temps

ZonedDateTime.now(paris)  // instant + fuseau + règles d'heure
                          // d'été → rendez-vous futur

OffsetDateTime            // instant + décalage fixe, sans
                          // règles de fuseau → échanges d'API`,
    },
    {
      kind: "text",
      text: "L'erreur la plus répandue consiste à stocker un `LocalDateTime` pour horodater un événement. Le jour où l'application est déployée sur une machine réglée sur un autre fuseau, ou lors du changement d'heure, les valeurs deviennent ambiguës et impossibles à comparer — deux enregistrements peuvent porter la même heure locale sans correspondre au même moment. Pour « quand cela s'est-il produit », la réponse est `Instant`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Duration et Period ne mesurent pas la même chose.",
      code: `var paris = ZoneId.of("Europe/Paris");
var avant = ZonedDateTime.of(
        LocalDate.of(2026, 3, 28), LocalTime.of(12, 0), paris);

// Duration : une quantité de TEMPS ÉCOULÉ
var a = avant.plus(Duration.ofDays(1));   // exactement 24 h

// Period : une quantité de CALENDRIER
var b = avant.plus(Period.ofDays(1));     // « demain, même heure »

// Dans la nuit du 28 au 29 mars 2026, la France passe
// à l'heure d'été : cette nuit-là ne dure que 23 heures.
System.out.println(a.toLocalTime());   // 13:00
System.out.println(b.toLocalTime());   // 12:00`,
    },
    {
      kind: "text",
      text: "Cet exemple résume à lui seul pourquoi les deux types existent. `Duration` compte des secondes et ignore le calendrier : vingt-quatre heures après midi, l'horloge locale affiche treize heures parce que la nuit a été raccourcie d'une heure. `Period` raisonne en unités de calendrier : demain à la même heure reste midi, même si seulement vingt-trois heures se sont écoulées.",
    },
    {
      kind: "comparison",
      title: "Duration ou Period",
      left: {
        label: "Duration — temps machine",
        text: "Secondes et nanosecondes. Pour un délai d'expiration, une mesure de performance, un intervalle entre deux `Instant`. Insensible au calendrier, donc parfaitement prévisible : une heure vaut toujours 3 600 secondes.",
      },
      right: {
        label: "Period — temps humain",
        text: "Années, mois, jours. Pour une échéance, un abonnement, un anniversaire. Sensible au calendrier : « dans un mois » n'a pas la même longueur selon le mois, et c'est exactement le comportement attendu.",
      },
    },
    {
      kind: "text",
      text: "La règle de stockage qui découle de tout cela est simple et évite la majorité des incidents : conserver les horodatages en UTC, sous forme d'`Instant`, et ne convertir vers un fuseau qu'au moment de l'affichage. Le fuseau appartient à la présentation, pas à la donnée. Une exception existe pour les rendez-vous futurs, où il faut conserver le fuseau prévu — si les règles d'heure d'été changent d'ici là, c'est l'heure locale qui doit être respectée.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Toute l'API est immuable",
      text: "`instant.plus(Duration.ofHours(1))` ne modifie rien : il renvoie un nouvel objet. Ignorer le résultat est une erreur silencieuse, et c'est l'un des rares pièges de `java.time` — mais c'est aussi ce qui rend ces types partageables entre fils d'exécution sans précaution, contrairement à `SimpleDateFormat`. Son remplaçant, `DateTimeFormatter`, l'est également.",
    },
    {
      kind: "text",
      text: "Côté persistance, la correspondance est directe : un `Instant` se range dans une colonne `timestamp with time zone`, qui stocke le point sur la ligne du temps sans ambiguïté. Une colonne `timestamp` sans fuseau correspond à un `LocalDateTime` et reproduit exactement le problème décrit plus haut — deux enregistrements peuvent porter la même valeur sans désigner le même moment.",
    },
    {
      kind: "text",
      text: "En entretien, la question qui revient est « `LocalDateTime` ou `Instant` ? ». La réponse tient en une phrase : `Instant` pour un événement qui s'est produit, `LocalDateTime` seulement pour une date-heure de calendrier sans lieu, et `ZonedDateTime` dès qu'un fuseau est nécessaire pour désigner un moment futur. C'est la distinction que l'ancienne API ne permettait pas d'exprimer, et l'origine de la plupart de ses bugs.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "java-mod-22",
    difficulty: 3,
    tags: ["java-moderne", "java-time"],
    prompt: "Dans la nuit du 28 au 29 mars 2026, la France passe à l'heure d'été. Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `var paris = ZoneId.of("Europe/Paris");
var avant = ZonedDateTime.of(
        LocalDate.of(2026, 3, 28), LocalTime.of(12, 0), paris);

var a = avant.plus(Duration.ofDays(1));
var b = avant.plus(Period.ofDays(1));

System.out.println(a.toLocalTime() + " / " + b.toLocalTime());`,
    },
    choices: [
      "13:00 / 12:00",
      "12:00 / 12:00",
      "12:00 / 13:00",
      "13:00 / 13:00",
    ],
    answer: 0,
    explanation:
      "`Duration.ofDays(1)` ajoute exactement 24 heures de temps écoulé. Comme cette nuit-là ne dure que 23 heures — les horloges avancent d'une heure — l'horloge locale affiche 13:00. `Period.ofDays(1)` raisonne en calendrier : demain à la même heure, donc 12:00, même si seulement 23 heures se sont réellement écoulées. Les deux types existent précisément pour cette différence.",
  },
  {
    kind: "mcq",
    id: "java-mod-23",
    difficulty: 2,
    tags: ["java-moderne", "java-time"],
    prompt: "Quel type utiliser pour horodater la création d'une commande en base ?",
    choices: [
      "`Instant` : un point unique sur la ligne du temps, comparable et non ambigu.",
      "`LocalDateTime` : la date et l'heure de l'événement, telles qu'elles apparaissent.",
      "`LocalDate` accompagné d'un `LocalTime`, pour séparer les deux informations.",
      "`Period` depuis le lancement de l'application, converti à l'affichage.",
    ],
    answer: 0,
    explanation:
      "« Quand cela s'est-il produit » appelle un `Instant`. Un `LocalDateTime` n'a pas de fuseau : deux enregistrements peuvent porter la même heure locale sans désigner le même moment, et un déploiement sur une machine réglée autrement rend les valeurs incomparables. On stocke en UTC et l'on convertit vers un fuseau seulement à l'affichage.",
  },
  {
    kind: "recall",
    id: "java-mod-24",
    difficulty: 2,
    tags: ["java-moderne", "java-time"],
    prompt: "Quelle différence entre `Duration` et `Period`, et pourquoi les deux existent-ils ?",
    explanation:
      "`Duration` mesure un temps **écoulé**, en secondes et nanosecondes : elle ignore le calendrier, et une heure y vaut toujours 3 600 secondes. `Period` mesure une quantité de **calendrier**, en années, mois et jours : « dans un mois » n'a pas la même longueur selon le mois, et « demain à la même heure » reste la même heure locale. La différence devient visible lors d'un changement d'heure : ajouter `Duration.ofDays(1)` à midi la veille du passage à l'heure d'été donne 13 h le lendemain, puisque la nuit n'a duré que 23 heures, tandis que `Period.ofDays(1)` donne bien midi. Les deux existent parce que les deux intentions existent — un délai d'expiration ou une mesure de performance appellent `Duration`, une échéance ou un abonnement appellent `Period`.",
    keyPoints: [
      "Duration : temps écoulé, secondes, insensible au calendrier",
      "Period : unités de calendrier, années, mois, jours",
      "Visible au changement d'heure : 13:00 contre 12:00",
      "Délai et mesure pour Duration, échéance et abonnement pour Period",
    ],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-moderne",
  title: "Java moderne : var, blocs de texte, record, sealed, motifs, java.time",
  objective:
    "Écrire du Java récent avec discernement : savoir quand `var` aide et quand il nuit, produire du texte multiligne sans surprise, modéliser des données par des records validés, fermer une hiérarchie pour que le compilateur vérifie l'exhaustivité, traiter les cas par filtrage et expressions switch, et choisir le bon type de date.",
  prerequisites: ["java-lambdas-streams"],
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
