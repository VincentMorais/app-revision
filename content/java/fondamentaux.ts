/**
 * Java — Fondamentaux (référentiel 1.1) : primitifs et wrappers, comparaison,
 * String, passage par valeur, final, portée et initialisation statique.
 * 8 leçons, 30 exercices — format doux, écrit pour quelqu'un qui reprend
 * les bases : une image par notion (case/boîte/flèche), chaque exercice est
 * précédé de la leçon qui enseigne ce qu'il demande.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Primitifs et wrappers : la case et la boîte
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-fond-l1",
  title: "Primitifs et wrappers : la case et la boîte",
  blocks: [
    {
      kind: "text",
      text: "Quand tu écris `int age = 30;`, Java réserve une petite **case** en mémoire et y pose le nombre 30. C'est tout : la variable *est* le nombre. Java a huit types de ce genre, les **primitifs** : `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`. Les plus courants : `int` (nombre entier), `double` (nombre à virgule) et `boolean` (vrai ou faux). Ils sont simples et rapides.",
    },
    {
      kind: "text",
      text: "Mais certains endroits de Java refusent les nombres bruts : ils veulent des **objets**. Un objet, c'est comme une **boîte** avec quelque chose dedans. La variable ne contient pas la boîte elle-même, mais une **flèche** (on dit une *référence*) qui y mène. Pour chaque primitif, Java fournit donc une boîte toute faite, appelée **wrapper** (« emballage ») : `int` devient `Integer`, `double` devient `Double`, `boolean` devient `Boolean`, `long` devient `Long`.",
    },
    {
      kind: "comparison",
      title: "Case ou boîte ?",
      left: {
        label: "Primitif (la case)",
        text: "La variable contient le nombre lui-même. Elle ne peut **jamais** être vide. Rapide.",
        code: { language: "java", code: "int a = 5;" },
      },
      right: {
        label: "Wrapper (la boîte)",
        text: "La variable contient une flèche vers une boîte. Elle **peut** être vide (`null`). Un peu plus lourd.",
        code: { language: "java", code: "Integer b = 5;" },
      },
    },
    {
      kind: "text",
      text: "**Quand a-t-on besoin d'une boîte ?** Surtout dans les collections. Une liste ou une `Map` est conçue pour ranger des objets, pas des nombres bruts. C'est pourquoi on écrit `List<Integer>` et jamais `List<int>` : Java refuse. Les génériques (ce qu'il y a entre `<` et `>`) exigent des boîtes. L'autre cas : quand « pas de valeur » a un sens, par exemple un âge pas encore renseigné, car seule une boîte peut être vide.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Java emballe et déballe tout seul : c'est l'autoboxing.",
      code: `List<int> nombres = new ArrayList<>();       // ne compile pas : int n'est pas une boîte
List<Integer> nombres = new ArrayList<>();   // OK : une liste de boîtes

nombres.add(5);                              // Java emballe le 5 tout seul
int x = nombres.get(0);                      // et le déballe tout seul`,
    },
    {
      kind: "text",
      text: "Cet emballage et déballage automatique s'appelle l'**autoboxing**. C'est pratique, mais il cache du travail et deux pièges. Le premier : une boîte peut être vide, une case `int` jamais.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Déballer une boîte vide plante.",
      code: `Map<String, Integer> stock = new HashMap<>();
stock.put("poire", 3);

int a = stock.get("poire");    // OK : la boîte contient 3
int b = stock.get("pomme");    // NullPointerException`,
    },
    {
      kind: "text",
      text: "Que se passe-t-il ? « pomme » n'est pas dans le stock, donc `get` répond « rien » (`null`). Java essaie de déballer ce rien pour le poser dans la case `int b`, et il n'y a rien à déballer : `NullPointerException`. Une case `int` doit toujours contenir un nombre. La parade : `stock.getOrDefault(\"pomme\", 0)`, qui répond 0 quand la clé n'existe pas.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : déballer du vide",
      text: "Chaque fois qu'une boîte (`Integer`, `Long`...) est rangée dans un primitif, Java la déballe. Si elle est vide, ça plante. Les `Map.get`, les valeurs lues dans une base de données ou un formulaire sont des sources fréquentes de `null`.",
    },
    {
      kind: "text",
      text: "Autre détail : quand tu crées un objet, ses **champs** (les variables qui lui appartiennent) ne restent pas vides. Java les remplit d'une valeur neutre : `0` pour les entiers, `0.0` pour `double`, `false` pour `boolean`, le caractère nul pour `char`, et `null` pour toute boîte, `Integer` compris. Cela ne vaut que pour les champs : une variable que tu crées toi-même dans une méthode doit être remplie avant d'être lue, sinon Java refuse de compiler.",
    },
    {
      kind: "text",
      text: "Dernier coût de l'autoboxing : fabriquer une boîte prend du temps et de la mémoire. Dans une boucle qui tourne des millions de fois, ça se voit. Regarde cette méthode, correcte mais lente.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Version lente : la faute est à la ligne 2.",
      code: `public static long sumTo(int n) {
    Long sum = 0L;                  // ligne 2 : on choisit une BOÎTE
    for (int i = 0; i <= n; i++) {
        sum += i;                   // ligne 4 : ouvre la boîte, additionne, refabrique une boîte
    }
    return sum;
}`,
    },
    {
      kind: "text",
      text: "Le `+=` de la ligne 4 paraît innocent. Sur une boîte, Java ouvre `sum`, ajoute `i`, puis **fabrique une nouvelle boîte** pour ranger le résultat, à chaque tour. Pour 100 millions de tours, ça fait 100 millions de boîtes jetées. Pourtant, la faute est **à la ligne 2** : c'est là qu'on a choisi `Long` au lieu de `long`. Quand un programme est lent à cause d'un wrapper, cherche l'endroit où la variable est **déclarée**, pas seulement celui où elle sert.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Version rapide : un simple nombre, aucune boîte.",
      code: `public static long sumTo(int n) {
    long sum = 0L;                  // petit « l » : une case, pas une boîte
    for (int i = 0; i <= n; i++) {
        sum += i;                   // une simple addition
    }
    return sum;
}`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "Par défaut, utilise le **primitif** (`int`, `long`, `double`, `boolean`). Prends la **boîte** seulement quand une collection l'exige, ou quand « pas de valeur » (`null`) a un sens.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — Comparer des boîtes : == contre equals
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-fond-l2",
  title: "Comparer des boîtes : == contre equals",
  blocks: [
    {
      kind: "text",
      text: "Comparer deux nombres est ce qu'il y a de plus banal en programmation. Avec des primitifs, `==` fait exactement ce qu'on attend. Avec des boîtes, ça devient un piège, et c'est l'une des questions d'entretien Java les plus fréquentes. Voyons pourquoi.",
    },
    {
      kind: "text",
      text: "Souviens-toi : une variable `Integer` contient une **flèche** vers une boîte. L'opérateur `==` ne regarde pas dans les boîtes. Il demande : « ces deux flèches mènent-elles à **la même boîte** ? ». La méthode `equals`, elle, ouvre les deux boîtes et compare ce qu'il y a dedans.",
    },
    {
      kind: "comparison",
      title: "== ou equals ?",
      left: {
        label: "==",
        text: "Demande : *même boîte ?* Compare les flèches.",
        code: { language: "java", code: "a == b" },
      },
      right: {
        label: "equals",
        text: "Demande : *même contenu ?* Ouvre les boîtes.",
        code: { language: "java", code: "a.equals(b)" },
      },
    },
    {
      kind: "text",
      text: "Pour compliquer les choses, Java a une astuce : les boîtes des petits nombres, de **-128 à 127**, sont fabriquées une fois pour toutes et **réutilisées**. Quand tu écris `Integer a = 127`, tu reçois une boîte qui existe déjà. `Integer b = 127` te donne la même. Au-dessus de 127, Java fabrique une boîte neuve à chaque fois.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Même contenu, mais pas forcément la même boîte.",
      code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;

a == b       // true  : même boîte réutilisée (petit nombre)
c == d       // false : deux boîtes neuves qui contiennent le même nombre
c.equals(d)  // true  : on compare le contenu`,
    },
    {
      kind: "text",
      text: "Le résultat surprend : `a == b` vaut `true`, mais `c == d` vaut `false`, alors que les nombres sont égaux. Le plus vicieux : avec de petits nombres en test, ton code **semble marcher**, puis il casse en production avec de plus grands nombres. Ce genre de bug est très difficile à trouver.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : le bug qui n'apparaît qu'en production",
      text: "Ne compare jamais deux wrappers avec `==`. Utilise `a.equals(b)`. Si `a` peut être vide (`null`), `a.equals(b)` plante : écris plutôt `Objects.equals(a, b)`, qui répond simplement `false` si un seul des deux est vide, et `true` si les deux le sont.",
    },
    {
      kind: "text",
      text: "Et `compareTo` ? `a.compareTo(b)` ne répond pas par vrai ou faux : il renvoie un **nombre** (négatif, zéro ou positif) qui dit lequel est le plus petit. Il sert à trier, pas à tester l'égalité.",
    },
    {
      kind: "text",
      text: "Voici un deuxième piège de l'autoboxing, sur `List.remove`. Cette méthode existe en deux versions : `remove(int index)` enlève l'élément qui est à une **place**, et `remove(Object o)` enlève un **élément précis**. Les places se comptent à partir de 0 : la place 0 est le premier élément, la place 1 le deuxième.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un nombre brut = une place. Une boîte = une valeur.",
      code: `List<Integer> nums = new ArrayList<>(List.of(10, 20, 30));

nums.remove(1);                    // nombre brut : la PLACE 1
                                   // enlève 20 → [10, 30]

nums.remove(Integer.valueOf(10));  // une boîte : la VALEUR 10
                                   // enlève 10 → [30]`,
    },
    {
      kind: "text",
      text: "Quand tu passes un nombre brut, Java choisit la version « place », sans emballer. Pour dire « enlève la valeur 10 », il faut lui donner une boîte : `Integer.valueOf(10)`. Un même nom de méthode, deux comportements selon ce qu'on lui passe : c'est la **surcharge**, et c'est un classique d'entretien.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "Pour des boîtes : `equals`, jamais `==`. Et sur une `List<Integer>`, `remove(nombre)` enlève une *place*, `remove(Integer.valueOf(nombre))` enlève une *valeur*.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — String : un texte qu'on ne modifie jamais
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-fond-l3",
  title: "String : un texte qu'on ne modifie jamais",
  blocks: [
    {
      kind: "text",
      text: "En Java, un texte est une `String`. On en manipule tout le temps : noms, messages, adresses. Une chose à comprendre absolument : une `String` est **immuable**. Une fois créée, elle ne peut **plus jamais** être modifiée. Même `toUpperCase()` ne modifie pas le texte : il **fabrique un nouveau texte** et te le renvoie.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le piège classique : on transforme, mais on jette le résultat.",
      code: `String s = "abc";
s.toUpperCase();          // fabrique "ABC"... qu'on jette
s.concat("def");          // fabrique "abcdef"... qu'on jette aussi
System.out.println(s);    // abc : s n'a pas bougé`,
    },
    {
      kind: "text",
      text: "On a demandé deux transformations, mais on n'a gardé aucun résultat. `s` désigne toujours `\"abc\"`. Pour garder un résultat, il faut le **ranger** : on fait pointer `s` vers le nouveau texte. Ce bug est sournois, parce que le code compile et s'exécute sans erreur. Il ne fait juste pas ce qu'on voulait.",
    },
    {
      kind: "comparison",
      title: "Ranger ou jeter ?",
      left: {
        label: "Résultat perdu",
        text: "Le nouveau texte est fabriqué puis oublié. `s` n'a pas changé.",
        code: { language: "java", code: "s.toUpperCase();" },
      },
      right: {
        label: "Résultat gardé",
        text: "Le nouveau texte est rangé dans `s`.",
        code: { language: "java", code: "s = s.toUpperCase();" },
      },
    },
    {
      kind: "text",
      text: "Il faut aussi comprendre ce que veut dire « copier » un texte. `String t = s;` ne recopie pas le texte : elle copie la **flèche**. `s` et `t` mènent au même texte. Si ensuite on écrit `s += \"b\"`, Java ne peut pas modifier le texte (il est immuable) : il en fabrique un nouveau, `\"ab\"`, et déplace seulement la flèche de `s`. La flèche de `t` n'a pas bougé.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux flèches, puis une seule qui bouge.",
      code: `String s = "a";
String t = s;                 // t et s mènent au même texte "a"
s += "b";                     // nouveau texte "ab" ; seule la flèche de s se déplace

System.out.println(s);        // ab
System.out.println(t);        // a  : t n'a pas bougé
System.out.println(s == t);   // false : ce ne sont plus le même texte`,
    },
    {
      kind: "text",
      text: "Pourquoi Java a-t-il choisi un texte qui ne change jamais ? Quatre bonnes raisons. **Sécurité** : un nom de fichier qu'on vient de vérifier ne peut pas être changé en douce juste après. **Partage** : plusieurs endroits du programme peuvent utiliser le même texte sans se gêner. **Plusieurs choses en même temps** (les *threads*) : rien ne bouge, donc aucun conflit possible. **Clé de `Map`** : une clé qui ne change jamais ne se perd jamais dans le classeur. Le prix à payer : chaque modification crée un nouveau texte. On verra à la leçon suivante comment s'en sortir quand on en fait beaucoup.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir : les boîtes aussi sont immuables",
      text: "`Integer`, `Long`, `Double`... sont immuables comme `String`. Quand tu écris `n++` sur un `Integer`, Java ne modifie pas la boîte : il en fabrique une nouvelle et déplace la flèche de `n`. C'est une des raisons pour lesquelles ces objets sont sûrs à partager.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — String : le pool, equals et StringBuilder
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-fond-l4",
  title: "String : le pool, equals et StringBuilder",
  blocks: [
    {
      kind: "text",
      text: "Dans un programme, on écrit souvent le même texte à plusieurs endroits : `\"java\"` ici, `\"java\"` là. Pour ne pas gaspiller de mémoire, Java garde une **réserve des textes écrits dans le code** : le **pool de constantes**. Les deux endroits utilisent alors le **même** texte. C'est aussi le cas pour `\"ja\" + \"va\"` : Java fait ce calcul avant de lancer le programme et retombe sur le `\"java\"` de la réserve.",
    },
    {
      kind: "text",
      text: "En revanche, un texte **fabriqué pendant que le programme tourne** n'est pas dans la réserve : `new String(\"java\")` (qui demande explicitement une nouvelle copie), un texte lu dans un fichier ou saisi par un utilisateur, un morceau coupé avec `substring`. Ces textes disent la même chose, mais ce sont d'autres objets.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Même contenu, parfois le même objet, parfois non.",
      code: `String a = "java";
String b = "java";
String c = new String("java");
String d = "ja" + "va";
String e = a.substring(0, 2) + "va";   // calculé pendant l'exécution

a == b        // true  : même texte de la réserve
a == c        // false : new fabrique une nouvelle copie
a == d        // true  : "ja" + "va" calculé avant l'exécution
a == e        // false : calculé pendant l'exécution
a.equals(e)   // true  : même contenu`,
    },
    {
      kind: "text",
      text: "Comme pour les boîtes, `==` demande « même objet ? » et `equals` demande « même texte ? ». Le piège : `==` donne `true` dans certains cas (la réserve) et `false` dans d'autres, sans que ce soit prévisible dès qu'un texte vient de l'extérieur. La règle est simple : **toujours `equals`** pour comparer des textes.",
    },
    {
      kind: "comparison",
      title: "Quel côté de equals ?",
      left: {
        label: "s.equals(\"ok\")",
        text: "Plante avec une `NullPointerException` si `s` est vide (`null`).",
        code: { language: "java", code: 's.equals("ok")' },
      },
      right: {
        label: "\"ok\".equals(s)",
        text: "Ne plante jamais : si `s` est vide, répond simplement `false`.",
        code: { language: "java", code: '"ok".equals(s)' },
      },
    },
    {
      kind: "text",
      text: "Pourquoi cette différence ? Appeler une méthode sur « rien » (`null`) fait planter. Dans `\"ok\".equals(s)`, on appelle la méthode sur `\"ok\"`, qui existe toujours. Dans les deux cas c'est bien le contenu qui est comparé : seul change celui qui risque de planter. Une alternative lisible : `Objects.equals(s, \"ok\")`.",
    },
    {
      kind: "text",
      text: "Passons au coût de l'immuabilité. Puisque chaque modification crée un nouveau texte, assembler un gros texte dans une boucle est un piège.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Correct, mais lent sur une grande liste.",
      code: `public String join(List<String> parts) {
    String out = "";
    for (String p : parts) {
        out += p + ",";     // recopie TOUT le texte déjà construit, à chaque tour
    }
    return out;
}`,
    },
    {
      kind: "text",
      text: "À chaque tour, `out += ...` fabrique un nouveau texte en recopiant tout ce qui précède. Plus la liste est longue, plus chaque recopie est longue : c'est comme recopier une page entière à la main chaque fois qu'on ajoute un mot. Sur 100 000 éléments, le temps explose.",
    },
    {
      kind: "text",
      text: "La solution est le **`StringBuilder`** : un **brouillon modifiable**. On ajoute à la fin sans rien recopier, puis on demande le texte final avec `toString()`. Il propose aussi `reverse()` (retourne le texte), `insert`, `delete`..., qui modifient le brouillon **sur place**, contrairement à `String`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le brouillon, puis le texte final.",
      code: `StringBuilder sb = new StringBuilder();
for (String p : parts) {
    sb.append(p).append(',');     // on ajoute au bout du brouillon
}
String out = sb.toString();       // le texte final

String out2 = String.join(",", parts);   // pour simplement assembler une liste

StringBuilder r = new StringBuilder("java");
r.reverse();                      // "avaj" : modifié sur place
String retourne = r.toString();`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : le brouillon n'est pas un texte",
      text: "Un `StringBuilder` n'est pas une `String` : il faut `toString()` pour en tirer une. Et `String` n'a **pas** de méthode `reverse()` : seul le brouillon sait retourner un texte.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — Passage par valeur : Java copie ce qu'on lui donne
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "java-fond-l5",
  title: "Passage par valeur : Java copie ce qu'on lui donne",
  blocks: [
    {
      kind: "text",
      text: "Quand tu appelles une méthode avec un argument, Java fait **toujours** la même chose : il **copie** ce que tu lui passes. On appelle ça le **passage par valeur**. Tout le reste de cette leçon découle de cette seule idée. Mais il faut bien distinguer *ce qui* est copié selon le type.",
    },
    {
      kind: "text",
      text: "**Un primitif** (`int`, `double`...) : on copie le nombre. La méthode travaille sur sa propre copie. Si elle la change, l'original ne bouge pas.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La méthode modifie sa copie, pas l'original.",
      code: `static void ajouteUn(int n) {
    n = n + 1;                // modifie la copie locale
}

int x = 1;
ajouteUn(x);
System.out.println(x);        // 1 : l'original n'a pas changé`,
    },
    {
      kind: "text",
      text: "**Un objet** : la variable contient une **flèche** vers l'objet. Java copie la flèche, pas l'objet. Résultat : la méthode et l'appelant ont deux flèches qui mènent au **même objet**. Si la méthode **modifie l'objet** en suivant sa flèche, l'appelant le voit, puisque c'est le même objet.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La méthode suit la flèche et modifie l'objet partagé.",
      code: `static void ajouteBang(StringBuilder sb) {
    sb.append("!");          // suit la flèche : modifie l'objet partagé
}

StringBuilder sb = new StringBuilder("hi");
ajouteBang(sb);
System.out.println(sb);      // hi! : visible dehors`,
    },
    {
      kind: "comparison",
      title: "Ce qui est copié",
      left: {
        label: "Primitif",
        text: "Le nombre lui-même. La méthode ne peut pas changer l'original.",
        code: { language: "java", code: "void f(int n)" },
      },
      right: {
        label: "Objet",
        text: "La flèche. La méthode peut modifier l'objet, mais pas la variable de l'appelant.",
        code: { language: "java", code: "void f(Person p)" },
      },
    },
    {
      kind: "text",
      text: "Et les `String` ? Une `String` est un objet, donc la flèche est copiée. Mais comme elle est immuable, la méthode ne peut pas la modifier : elle peut seulement fabriquer un nouveau texte, rangé dans **sa** flèche à elle. L'appelant garde l'ancien texte. Regardons les trois cas ensemble.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois paramètres, un seul effet visible.",
      code: `static void modify(int n, StringBuilder sb, String s) {
    n = n + 1;        // copie du nombre : sans effet dehors
    sb.append("!");   // modifie l'objet partagé : VISIBLE dehors
    s = s + "!";      // nouveau texte rangé dans la copie de la flèche : sans effet
}

int n = 1;
StringBuilder sb = new StringBuilder("hi");
String s = "hi";
modify(n, sb, s);
System.out.println(n + " " + sb + " " + s);   // 1 hi! hi`,
    },
    {
      kind: "text",
      text: "Un seul des trois paramètres a un effet visible : celui où l'on **modifie un objet partagé**. Les tableaux suivent la même règle, car un tableau est un objet : `arr[0] = 0` modifie le tableau partagé (visible), alors que `arr = new int[]{0, 0}` ne change que la flèche locale (invisible).",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège d'entretien",
      text: "On entend souvent « les objets sont passés par référence ». C'est **faux** en Java. Ce qui est passé, c'est une *copie de la référence*. La formule à retenir : « Java est pass-by-value ; pour un objet, la valeur passée est la référence. » Un recruteur attentif relèvera l'erreur.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — Modifier ou remplacer, et renvoyer plusieurs résultats
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "java-fond-l6",
  title: "Modifier ou remplacer, et renvoyer plusieurs résultats",
  blocks: [
    {
      kind: "text",
      text: "Dans la leçon précédente, on a vu deux gestes très différents sur un objet reçu en paramètre : le **modifier** (suivre la flèche et changer l'objet) ou le **remplacer** (donner à la flèche locale un nouvel objet). Le premier se voit dehors, le second jamais. C'est la source de nombreux bugs, car le code compile sans rien dire.",
    },
    {
      kind: "code",
      language: "java",
      caption: "reset ne remet jamais le compteur à zéro.",
      code: `public class Counter {
    private int value = 0;
    public void increment() { value++; }

    public static void reset(Counter c) {
        c = new Counter();      // remplace : ne change que la flèche locale
    }
}

Counter c = new Counter();
c.increment();
Counter.reset(c);               // on attend 0... mais value vaut toujours 1`,
    },
    {
      kind: "text",
      text: "Dans `reset`, `c` est une **copie** de la flèche. `c = new Counter()` fait pointer la copie vers un nouveau compteur. Puis la méthode se termine et la copie disparaît : l'original n'a jamais bougé. La ligne fautive est donc `c = new Counter();`, parce qu'elle remplace au lieu de modifier.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux corrections possibles.",
      code: `// Solution 1 : modifier l'objet existant
public static void reset(Counter c) {
    c.value = 0;                // suit la flèche, change l'objet partagé
}

// Solution 2 : renvoyer le nouvel objet, l'appelant le range
public static Counter fresh() {
    return new Counter();
}
Counter c = Counter.fresh();    // c'est l'appelant qui déplace SA flèche`,
    },
    {
      kind: "comparison",
      title: "Modifier ou remplacer",
      left: {
        label: "Modifier",
        text: "On suit la flèche et on change l'objet. **L'appelant le voit.**",
        code: { language: "java", code: "c.value = 0;\nlist.add(x);" },
      },
      right: {
        label: "Remplacer",
        text: "On donne un nouvel objet à la flèche locale. **L'appelant ne voit rien** : il faut renvoyer le nouvel objet avec `return`.",
        code: { language: "java", code: "c = new Counter();\nlist = new ArrayList<>();" },
      },
    },
    {
      kind: "text",
      text: "La même logique s'applique aux listes. `list.add(x)` modifie la liste partagée : visible. `list = new ArrayList<>()` ne touche que la flèche locale : invisible. Pour « remplacer » une liste, la méthode doit la **renvoyer**, et l'appelant la range lui-même.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Modification visible, remplacement renvoyé.",
      code: `static void fill(List<String> list, String item) {
    list.add(item);              // modification : visible
}
static List<String> reset(List<String> list) {
    list = new ArrayList<>();    // remplacement : invisible...
    return list;                 // ...donc on le renvoie
}

List<String> names = new ArrayList<>();
fill(names, "Ana");              // names = [Ana]
names = reset(names);            // l'appelant range le résultat : names = []`,
    },
    {
      kind: "text",
      text: "Remarque : `List` n'est qu'une **description** (une interface), on ne peut pas écrire `new List<>()`. On crée une vraie liste avec `new ArrayList<>()`.",
    },
    {
      kind: "text",
      text: "Autre conséquence : une méthode ne peut renvoyer **qu'une** valeur, et un `swap(a, b)` ne peut pas échanger les variables de l'appelant. Comment sortir deux résultats, par exemple le minimum **et** le maximum ? On les regroupe dans un colis. Depuis Java 16, la manière la plus simple est un **`record`** : une petite boîte à cases nommées, créée en une ligne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un seul retour, deux résultats.",
      code: `record MinMax(int min, int max) { }          // un colis à deux cases

static MinMax minMax(int[] values) {
    int min = values[0], max = values[0];
    for (int v : values) {
        if (v < min) min = v;
        if (v > max) max = v;
    }
    return new MinMax(min, max);
}

MinMax r = minMax(new int[]{4, 9, 2});
System.out.println(r.min() + " " + r.max());   // 2 9`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ce qui ne marche pas",
      text: "Remplacer `int` par `Integer` ne change rien : les boîtes sont immuables et passées par copie de flèche comme le reste. Mettre `final` devant un paramètre n'y change rien non plus. Et le `&` du langage C, qui permet de passer une adresse, n'existe pas en Java.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 7 — final : figer, mais figer quoi ?
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "java-fond-l7",
  title: "final : figer, mais figer quoi ?",
  blocks: [
    {
      kind: "text",
      text: "`final` veut dire « ne change plus ». Mais ce que ça fige dépend de **l'endroit** où on le place. **Sur une variable** (locale ou paramètre) : on ne peut lui donner une valeur qu'**une seule fois**. **Sur un champ** : il doit recevoir sa valeur à la déclaration, dans un bloc d'initialisation ou dans **chaque constructeur**, sinon Java refuse de compiler. **Sur une méthode** : impossible de la réécrire dans une sous-classe. **Sur une classe** : impossible d'en hériter (`String` et les wrappers sont `final`).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un champ final doit être rempli par chaque constructeur.",
      code: `public class User {
    private final String name;
    private final String email;

    public User(String name, String email) {
        this.name = name;      // this.name = le champ ; name = le paramètre
        this.email = email;
    }

    // Ne compile pas : email ne reçoit aucune valeur dans ce constructeur
    // public User(String name) { this.name = name; }

    public User(String name) {
        this(name, null);      // solution : déléguer au premier constructeur
    }
}`,
    },
    {
      kind: "text",
      text: "Deux choses à retenir de ce code. D'abord, `this.name = name` veut dire « le champ `name` **de cet objet** reçoit le paramètre `name` » : le mot `this.` distingue le champ du paramètre qui porte le même nom. Ensuite, un champ `final` doit être rempli par **chaque** constructeur : un constructeur qui l'oublie fait échouer la compilation. Le plus propre est de faire appeler le premier constructeur par les autres, avec `this(...)`.",
    },
    {
      kind: "text",
      text: "Le piège le plus important : **`final` fige la flèche, pas ce qu'il y a au bout.** Une `final List<String>` te garantit que la variable pointera toujours vers **cette** liste. Mais la liste reste modifiable : `add`, `remove`, `clear` fonctionnent. C'est comme un coffre fixé au mur : tu ne peux pas le déplacer, mais tu peux toujours le vider.",
    },
    {
      kind: "code",
      language: "java",
      caption: "final fige la variable, pas le contenu.",
      code: `private final List<String> items = new ArrayList<>();

items.add("a");                 // OK : on modifie le contenu
// items = new ArrayList<>();   // ne compile pas : on changerait la flèche

List<String> fixe = List.of("a", "b");   // liste vraiment immuable
fixe.add("c");                  // UnsupportedOperationException à l'exécution`,
    },
    {
      kind: "comparison",
      title: "final ou immuable ?",
      left: {
        label: "final",
        text: "Interdit de changer la **variable**. Le contenu d'une liste peut encore bouger.",
        code: { language: "java", code: "final List<String> l =\n    new ArrayList<>();" },
      },
      right: {
        label: "Immuable",
        text: "Interdit de changer le **contenu**. Cela vient de la liste elle-même, pas de `final`.",
        code: { language: "java", code: "List<String> l =\n    List.of(\"a\", \"b\");" },
      },
    },
    {
      kind: "text",
      text: "Pour une liste vraiment figée : `List.of(...)` crée une nouvelle liste immuable, et `List.copyOf(source)` fait une copie figée d'une liste existante. `Collections.unmodifiableList(l)` existe aussi, mais c'est seulement une **fenêtre en lecture seule** sur `l` : si `l` change, ce qu'on voit par la fenêtre change aussi. Bonne pratique : `final` sur le champ **et** une copie figée quand on expose la liste.",
    },
    {
      kind: "text",
      text: "Dernier cas, très courant : une **lambda** (une petite fonction écrite sur place, comme `n -> ...`) emporte avec elle une **copie** des variables locales qu'elle utilise. Pour éviter la confusion (la copie changerait, pas l'original), Java impose que ces variables ne soient **jamais modifiées** : elles doivent être `final`, ou *effectivement final* (jamais réaffectées, même sans écrire `final`).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Modifier une variable dans une lambda ne compile pas.",
      code: `int count = 0;
List<String> names = List.of("a", "b");

names.forEach(n -> count++);   // erreur : count est modifiée dans la lambda

int total = names.size();      // solution simple : demander la taille`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le message d'erreur à reconnaître",
      text: "« local variables referenced from a lambda expression must be final or effectively final » : c'est ce que Java répond quand tu modifies une variable dans une lambda. Pense à `size()`, à un `AtomicInteger` ou à une boucle `for` classique. Écrire `count = count + 1` à la place de `count++` est tout aussi refusé.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 8 — static et ordre d'initialisation
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "java-fond-l8",
  title: "static et ordre d'initialisation",
  blocks: [
    {
      kind: "text",
      text: "Dernière notion du chapitre : **quand** s'exécute le code d'initialisation. Deux sortes de code peuvent tourner avant même qu'on appelle quoi que ce soit. Le code **`static`** appartient à la **classe** (pas à un objet précis). Le code **d'instance** s'exécute à chaque fois qu'on crée un objet avec `new`.",
    },
    {
      kind: "text",
      text: "Un **bloc `static { ... }`** s'exécute **une seule fois**, la première fois que la classe est vraiment utilisée. Un **bloc d'instance `{ ... }`** s'exécute **à chaque `new`**, juste avant le constructeur. Vient enfin le constructeur lui-même.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Qui s'affiche, et dans quel ordre ?",
      code: `class Init {
    static { System.out.print("A"); }     // une fois, au premier usage de la classe
    { System.out.print("B"); }            // à chaque new, avant le constructeur
    Init() { System.out.print("C"); }     // ensuite le constructeur
    static { System.out.print("D"); }     // static aussi : dans l'ordre d'écriture
}

new Init();   // affiche A D B C
new Init();   // affiche B C  (la classe est déjà prête : pas de static)
// au total : ADBCBC`,
    },
    {
      kind: "text",
      text: "On lit donc : les blocs `static` dans l'ordre où ils sont écrits (`A` puis `D`), **une seule fois**. Ensuite, pour chaque objet : le bloc d'instance (`B`), puis le constructeur (`C`). Deux objets donnent `BC` deux fois, d'où `ADBCBC`.",
    },
    {
      kind: "comparison",
      title: "Bloc static ou bloc d'instance",
      left: {
        label: "static { ... }",
        text: "Une seule fois, pour la classe. S'exécute au premier usage de la classe.",
        code: { language: "java", code: "static { /* ... */ }" },
      },
      right: {
        label: "{ ... }",
        text: "À chaque `new`, avant le constructeur.",
        code: { language: "java", code: "{ /* ... */ }" },
      },
    },
    {
      kind: "text",
      text: "À quoi sert un bloc `static` ? Surtout à remplir une constante `static final` dont la valeur demande plusieurs lignes. Un champ `final` sans valeur à sa déclaration doit être rempli **exactement une fois** : pour un champ `static`, c'est dans un bloc `static`. Pour un champ d'instance, c'est dans le constructeur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une constante remplie au lancement de la classe.",
      code: `public class Registry {
    private static final Map<String, Integer> CODES;   // pas de valeur ici

    static {                                           // rempli une seule fois
        CODES = new HashMap<>();
        CODES.put("OK", 200);
    }

    private final String name;

    public Registry(String name) {
        this.name = name;
    }
}`,
    },
    {
      kind: "text",
      text: "Et quand ce code s'exécute-t-il exactement ? Une classe passe par **trois étapes** la première fois qu'on s'en sert. 1) Le **chargement** : Java lit le fichier de la classe. 2) La **liaison** : il vérifie le code, puis réserve les champs `static` avec une valeur « vide » (`null`, 0...). 3) L'**initialisation** : il exécute les blocs `static`, qui donnent aux champs leurs vraies valeurs. Ensuite seulement on peut lire, par exemple, `Config.DEFAULTS`.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "Au premier usage, pas au démarrage",
      text: "Tout cela se fait **paresseusement** : au premier `new`, au premier appel d'une méthode `static`, ou à la première lecture d'un champ `static` qui n'est pas une constante. Pas au lancement du programme. Un `print` dans un bloc `static` n'apparaît que le jour où la classe sert vraiment.",
    },
    {
      kind: "text",
      text: "Un dernier mot sur la **portée** : une variable n'existe que dans le bloc `{ ... }` où elle est déclarée. Déclarée dans un `for` ou un `if`, elle disparaît à l'accolade fermante. Retiens le principe général : déclare une variable le plus près possible de l'endroit où tu l'utilises, ça évite bien des confusions.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Exercices (répartis sur les leçons plus bas)
// ---------------------------------------------------------------------------

const EXERCISES: Exercise[] = [
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
    simple:
      "Quand tu écris `Integer a = 127`, Java range la valeur dans une petite boîte. Pour les petits nombres (de -128 à 127), il a déjà des boîtes toutes prêtes et il les réutilise : `a` et `b` pointent vers **la même boîte**. Au-dessus de 127, il fabrique une boîte neuve à chaque fois : `c` et `d` sont deux boîtes différentes qui contiennent juste le même chiffre. Et `==` demande « est-ce la même boîte ? », pas « y a-t-il le même chiffre dedans ? ». D'où `true false`.",
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
    simple:
      "Imagine deux boîtes avec un 5 dedans. `==` demande « est-ce exactement la même boîte ? », alors que `equals` demande « y a-t-il la même chose dedans ? ». Pour comparer des valeurs, c'est toujours `equals`. Et `Objects.equals` fait pareil en plus sûr : il ne plante pas si une des deux boîtes est vide (`null`).",
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
    simple:
      "`stock.get(\"pomme\")` cherche « pomme » dans le stock. Elle n'y est pas, donc il répond « rien » (`null`). Mais `int` est une case qui doit **toujours** contenir un nombre : impossible d'y ranger « rien ». Java essaie quand même, et ça plante avec une `NullPointerException`. Retiens : un `int` ne peut jamais être vide, un `Integer` oui.",
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
    simple:
      "`remove` existe en deux versions. Avec un simple nombre (`remove(1)`), Java comprend « enlève ce qui est à la **place** numéro 1 », donc le 20 (on compte à partir de 0 : 10 est place 0, 20 place 1). Avec `Integer.valueOf(10)`, il comprend « enlève **cette valeur-là** », donc le 10. Il reste le 30 tout seul. Piège classique : un même `remove` qui fait deux choses selon ce qu'on lui passe.",
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
    simple:
      "Une `Map` est un classeur prévu pour ranger des **objets** (des boîtes). Un `int` n'est pas une boîte, c'est juste un nombre brut. Donc on ne peut pas le ranger directement : il faut le mettre dans sa boîte, `Integer`. Chaque nombre brut a son équivalent en boîte : `int` → `Integer`, `double` → `Double`, etc. C'est tout. Les autres réponses parlent de choses qui n'ont rien à voir.",
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
    simple:
      "`Long sum` est une boîte, pas un simple nombre. À chaque tour de boucle, Java doit ouvrir la boîte, faire l'addition, puis fabriquer une nouvelle boîte pour le résultat : des millions de boîtes inutiles. La faute est à la **ligne 2**, là où on a *choisi* la boîte `Long` au lieu du nombre `long`. La ligne 4 ne fait que payer ce choix. Avec `long sum` (petit `l`), aucune boîte, même résultat, bien plus rapide.",
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
    simple:
      "Quand tu crées un objet, ses champs (ses cases) ne restent pas vides : Java les remplit tout seul avec une valeur « neutre ». Pour les nombres, c'est zéro. Pour vrai/faux, c'est faux. Pour les boîtes comme `Integer`, c'est « rien » (`null`), puisqu'une boîte peut être vide. Attention : ça ne marche que pour les champs d'un objet. Une variable que tu crées toi-même dans une méthode doit être remplie avant d'être lue.",
    explanation:
      "Un champ non initialisé reçoit la valeur par défaut de son type : zéro pour les numériques, `false` pour `boolean`, le caractère nul pour `char`, `null` pour toute référence, wrappers compris. Attention : cela ne vaut que pour les champs. Une variable locale doit être affectée avant lecture, sinon erreur de compilation.",
  },
  {
    kind: "recall",
    id: "java-fond-08",
    difficulty: 2,
    tags: ["autoboxing", "wrappers", "egalite"],
    prompt: "Explique le cache des `Integer` et pourquoi `==` entre deux `Integer` est un piège.",
    simple:
      "Pour les petits nombres, Java réutilise des boîtes déjà fabriquées, donc `==` répond « vrai » par hasard, même s'il compare des boîtes. Pour les gros nombres, il en fabrique de nouvelles et `==` répond « faux ». Ton code marche donc en test avec des petits nombres et casse plus tard avec des grands. La solution est simple : pour comparer des valeurs, toujours `equals`.",
    explanation:
      "L'autoboxing appelle `Integer.valueOf(int)`, qui renvoie une instance **mise en cache** pour les valeurs de **-128 à 127** (borne haute configurable par `-XX:AutoBoxCacheMax`). Deux `Integer` de petite valeur sont donc souvent la même référence et `==` renvoie `true`. Au-delà, `valueOf` crée un nouvel objet et `==` renvoie `false` pour des valeurs égales. Le code semble marcher en test avec des petits nombres et casse en production. `==` compare les références ; pour la valeur, `equals` ou `Objects.equals`. Même mécanisme pour `Long`, `Short`, `Byte`, `Character` (0..127) et `Boolean` ; jamais pour `Double` et `Float`.",
    keyPoints: ["`valueOf` cache -128..127", "`==` compare les références", "Marche en test, casse en prod", "`equals` / `Objects.equals`"],
  },
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
    simple:
      "Dans le code, quand Java voit deux fois le mot `\"hello\"`, il ne le range qu'une fois et les deux variables le partagent (c'est le « pool »). Même chose pour `\"hel\" + \"lo\"` : Java fait la concaténation avant de lancer le programme, et retombe sur le même `\"hello\"`. Mais `new String(\"hello\")` dit explicitement « fabrique-m'en une nouvelle copie » : c'est un autre objet. `==` demande « même objet ? », `equals` demande « même texte ? ». D'où `true false true`.",
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
    simple:
      "Une `String` ne peut jamais être modifiée. `concat` et `toUpperCase` ne changent pas `s` : ils **fabriquent un nouveau texte** et te le renvoient. Ici on jette ce nouveau texte sans le garder, donc `s` vaut toujours `\"abc\"`. Pour garder le résultat, il faut le ranger : `s = s.toUpperCase();`.",
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
    simple:
      "Comme une `String` ne peut pas être modifiée, `out += p + \",\"` recopie **tout** le texte déjà construit pour en fabriquer un tout neuf, à chaque tour. Plus la liste est longue, plus chaque recopie est longue. C'est comme recopier toute une page à la main chaque fois qu'on ajoute un mot. `StringBuilder` est un brouillon où on ajoute au bout sans tout recopier.",
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
    simple:
      "Appeler une méthode sur « rien » (`null`) fait planter. Avec `s.equals(\"ok\")`, si `s` est vide, ça plante. Avec `\"ok\".equals(s)`, on appelle la méthode sur `\"ok\"`, qui existe toujours : si `s` est vide, la réponse est juste « non ». Les deux comparent bien le contenu, la seule différence est de savoir qui risque de planter.",
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
    simple:
      "`s.toUpperCase()` renvoie un nouveau texte en majuscules : il faut le ranger dans `s` (une `String` ne se modifie pas). `StringBuilder`, lui, est un brouillon qu'on peut modifier : `reverse()` retourne le texte directement dedans. `toString()` transforme le brouillon en `String` finale. Les mots `upper` ou `build` n'existent pas dans Java.",
    explanation:
      "`toUpperCase()` renvoie une nouvelle chaîne qu'il faut réaffecter. `StringBuilder` est mutable : `reverse()` modifie le tampon lui-même. `toString()` produit la `String` finale. `String` n'a pas de `reverse`, et `StringBuilder` n'a pas de `build`.",
  },
  {
    kind: "recall",
    id: "java-fond-14",
    difficulty: 2,
    tags: ["string", "string-pool", "egalite"],
    prompt: "Qu'est-ce que le pool de chaînes ? Quand deux chaînes de même contenu sont-elles le même objet, et quand ne le sont-elles pas ?",
    simple:
      "Java garde une réserve de textes déjà écrits dans le code (le « pool »), et les partage : écrire deux fois `\"java\"` donne le même objet. C'est aussi le cas pour `\"ja\" + \"va\"`, calculé avant l'exécution. Mais un texte fabriqué pendant que le programme tourne (`new String`, un texte lu dans un fichier, un morceau découpé) est un objet à part, même s'il dit la même chose. C'est pour ça qu'on ne se fie jamais à `==` pour des textes : on utilise `equals`.",
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
    simple:
      "`t = s` ne copie pas le texte, juste la flèche qui y pointe : `s` et `t` pointent vers `\"a\"`. Puis `s += \"b\"` ne modifie pas `\"a\"` (impossible) : il fabrique un nouveau texte `\"ab\"` et fait pointer `s` dessus. `t` pointe toujours vers `\"a\"`. Donc `s` vaut `ab`, `t` vaut `a`, et ce ne sont pas les mêmes objets : `false`.",
    explanation:
      "`t = s` copie la référence : les deux variables désignent `\"a\"`. `s += \"b\"` ne modifie pas cet objet (impossible, il est immuable) : il crée `\"ab\"` et fait pointer `s` dessus. `t` désigne toujours `\"a\"`, et les deux références sont différentes : `false`.",
  },
  {
    kind: "recall",
    id: "java-fond-16",
    difficulty: 2,
    tags: ["string", "immuabilite", "conception"],
    prompt: "Pourquoi `String` est-elle immuable en Java ? Cite au moins trois bénéfices concrets.",
    simple:
      "Un texte qui ne change jamais, c'est rassurant. **Sécurité** : personne ne peut modifier un nom de fichier après qu'on l'a vérifié. **Partage** : plusieurs parties du programme peuvent utiliser le même texte sans se gêner. **Thread-safe** (plusieurs choses en même temps) : sans risque, puisque rien ne bouge. **Clé de `Map`** : une clé qui ne change jamais ne se perd jamais dans le classeur. Le prix à payer : chaque modification crée un nouveau texte, d'où `StringBuilder` dans les boucles.",
    explanation:
      "**Sécurité** : chemins de fichiers, noms de classes, URL et identifiants sont des `String` ; s'ils pouvaient changer après vérification, on pourrait contourner les contrôles. **Partage sans risque** : le pool de constantes et le passage de références entre méthodes ne posent aucun problème, personne ne peut modifier la chaîne sous vos pieds. **Thread-safety** gratuite. **`hashCode` mis en cache** : calculé une fois, ce qui rend `String` idéale comme clé de `HashMap` (une clé mutable casserait la table). Le prix : chaque transformation crée un objet, d'où `StringBuilder` pour les constructions en boucle.",
    keyPoints: ["Sécurité (chemins, classes, URL)", "Partage et pool sans risque", "Thread-safe", "`hashCode` en cache → clé de `Map` sûre", "Prix : `StringBuilder` en boucle"],
  },
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
    simple:
      "Java **copie** ce qu'on lui donne. Pour `n`, il copie le nombre : la méthode change sa copie, pas l'original, donc `n` reste 1. Pour `sb`, il copie la **flèche** vers l'objet : les deux flèches mènent au même objet, donc `append` le modifie vraiment. Pour `s`, `s + \"!\"` fabrique un nouveau texte rangé dans la copie de la flèche : l'original ne bouge pas. Donc `1 hi! hi`.",
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
    simple:
      "`arr` dans la méthode est une copie de la flèche vers le tableau. Dans `reset`, on dit à la copie « pointe vers un nouveau tableau » : l'original ne le sait pas, `a[0]` reste 5. Dans `clear`, on écrit **dans** le tableau, qui est partagé : `a[0]` devient 0. Changer **où** pointe la flèche ne se voit pas dehors, changer **ce qu'il y a dedans** si.",
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
    simple:
      "Non. Java copie la flèche vers l'objet, il ne donne pas l'objet lui-même. La méthode peut donc modifier l'objet (même objet des deux côtés), mais elle ne peut pas changer la variable de celui qui l'a appelée. `String` et `Integer` ne sont pas des cas à part : ils ne peuvent simplement pas être modifiés, ce qui donne l'impression d'une copie.",
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
    simple:
      "Dans `reset`, `c` est une copie de la flèche. `c = new Counter()` fait pointer **la copie** vers un nouveau compteur, puis la méthode se termine et la copie disparaît. L'original, chez celui qui a appelé, n'a jamais bougé. Pour que ça marche, il faut soit modifier le compteur existant (`c.value = 0`), soit renvoyer le nouveau avec `return` et le ranger dehors.",
    explanation:
      "`c` est une copie de la référence de l'appelant. `c = new Counter()` fait pointer cette copie vers un nouvel objet, puis la méthode se termine et la copie disparaît. Correction : `c.value = 0;` (mutation de l'objet partagé), ou `return new Counter();` avec réaffectation côté appelant. Un paramètre n'est pas `final` par défaut, la réaffectation compile, elle est juste inutile.",
  },
  {
    kind: "recall",
    id: "java-fond-21",
    difficulty: 2,
    tags: ["passage-par-valeur"],
    prompt: "Java est-il « pass by value » ou « pass by reference » ? Donne un exemple où une méthode modifie ce que voit l'appelant, et un où elle ne le peut pas.",
    simple:
      "Java copie toujours ce qu'on lui passe. Pour un objet, ce qu'il copie, c'est la **flèche** qui y mène. Donc : si la méthode modifie l'objet (`p.setName(\"Bob\")`), l'appelant le voit, car c'est le même objet. Si la méthode change sa flèche (`p = new Person(\"Eve\")`), l'appelant ne voit rien, car seule la copie a bougé. On dit donc « passage par valeur », même pour les objets.",
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
    simple:
      "Une méthode ne peut renvoyer qu'**une** chose. Pour en sortir deux, on les met dans un même colis : un `record` (une petite boîte avec deux cases, `min` et `max`) et on renvoie le colis. Les autres idées sont fausses : Java n'a pas de passage « par référence », `final` ne change rien à ça, et le `&` n'existe pas en Java.",
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
    simple:
      "Pour ajouter à une liste, on appelle `add` : ça modifie la liste partagée, donc l'appelant le voit. Pour la remplacer, on ne peut pas se contenter de changer la flèche dans la méthode (l'appelant ne le saurait pas) : on renvoie la nouvelle liste avec `return`, et l'appelant la range lui-même (`names = reset(names)`). Et `ArrayList` est la vraie liste qu'on peut créer, alors que `List` est seulement une description.",
    explanation:
      "`add` mute la liste partagée. Dans `reset`, `list = new ArrayList<>()` ne touche que la copie locale : sans `return` et réaffectation par l'appelant, `names` garderait `[Ana]`. `List` est une interface, on ne peut pas l'instancier. `fill(names)` ne compile pas (il manque un argument et elle ne retourne rien).",
  },
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
    simple:
      "Ce qui est `static` ne s'exécute qu'**une seule fois**, quand la classe est utilisée pour la première fois : d'abord `A`, puis `D` (dans l'ordre où elles sont écrites). Ensuite, à chaque `new`, Java lance le bloc `B` puis le constructeur `C`. On crée deux objets, donc `BC` deux fois. Résultat : `A D B C B C`.",
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
    simple:
      "Un champ `final` doit recevoir une valeur et une seule, dans **chaque** constructeur. Le premier constructeur remplit `name` et `email` : parfait. Le deuxième ne remplit que `name` : `email` reste sans valeur, et Java refuse de compiler. Solution simple : que le deuxième appelle le premier, `this(name, null);`.",
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
    simple:
      "`CODES` est `static final` et n'est pas rempli à sa déclaration : on le remplit dans un bloc `static { ... }`, qui s'exécute une fois quand la classe est lancée. Dans le constructeur, `this.name = name` veut dire « le champ `name` de cet objet reçoit le paramètre `name` ». Sans `this.`, Java ne saurait pas lequel des deux `name` est visé.",
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
    simple:
      "Une lambda (la petite fonction `n -> ...`) emporte avec elle une **copie** des variables qu'elle utilise. Si elle pouvait modifier `count`, la copie changerait mais pas l'original, ce qui serait trompeur. Alors Java l'interdit : une variable utilisée dans une lambda ne doit jamais être modifiée. Ici, la solution simple est `names.size()` pour compter.",
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
    simple:
      "Le mot `final` veut dire « ne change plus », mais ce que ça fige dépend d'où on le met : sur une variable, elle ne reçoit qu'une valeur ; sur un champ, il est rempli une fois ; sur une méthode, on ne peut pas la réécrire dans une sous-classe ; sur une classe, on ne peut pas en hériter. Et sur une liste, ça fige **la flèche**, pas ce qu'il y a dans la liste : on peut toujours y ajouter des éléments.",
    explanation:
      "Un même mot-clé, cinq effets. Le dernier est le plus trompeur : `final` ne rend jamais un objet immuable, il empêche seulement de réaffecter la variable. L'immuabilité d'une collection vient de son implémentation (`List.of`, `Collections.unmodifiableList`), pas de `final`.",
  },
  {
    kind: "recall",
    id: "java-fond-29",
    difficulty: 3,
    tags: ["final", "immuabilite", "collections"],
    prompt: "`private final List<String> items = new ArrayList<>();` : qu'est-ce que `final` garantit, qu'est-ce qu'il ne garantit pas, et comment obtenir une vraie liste immuable ?",
    simple:
      "`final` sur la liste veut dire « cette variable pointera toujours vers **cette** liste ». Mais la liste elle-même reste modifiable : on peut toujours faire `add`, `remove`, `clear`. C'est comme un coffre fermé à clé dont on ne peut pas changer l'emplacement, mais qu'on peut toujours vider. Pour une vraie liste figée, on utilise `List.of(...)` ou `List.copyOf(...)`, qui refusent toute modification.",
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
    simple:
      "Une classe a trois étapes de vie quand on s'en sert pour la première fois. 1) Java la **charge** : il lit le fichier. 2) Il la **prépare** : les champs `static` reçoivent une valeur « vide » (`null`, 0...). 3) Il l'**initialise** : il lance les blocs `static`, qui donnent les vraies valeurs. Seulement ensuite on peut lire `DEFAULTS`. Et tout ça ne se fait qu'au moment où on en a vraiment besoin, pas au démarrage.",
    explanation:
      "Chargement, liaison, initialisation : les trois phases du cycle de vie d'une classe. La préparation met `DEFAULTS` à `null` ; c'est l'initialisation qui exécute le bloc `static` et lui donne sa valeur. L'initialisation est déclenchée paresseusement, à la première utilisation réelle (`new`, accès à un `static` non constant, appel de méthode `static`), pas au démarrage du programme. C'est pourquoi un bloc `static` avec un `print` ne s'affiche que quand la classe sert vraiment.",
  },
];

// ---------------------------------------------------------------------------
// Assemblage : chaque leçon suivie de ses exercices, du plus simple au plus dur.
// ---------------------------------------------------------------------------

const byId = new Map(EXERCISES.map((e) => [e.id, e]));
function pick(...ids: string[]): Exercise[] {
  return ids.map((id) => {
    const ex = byId.get(id);
    if (!ex) throw new Error(`Exercice introuvable : ${id}`);
    return ex;
  });
}

export const chapter: Chapter = {
  id: "java-fondamentaux",
  format: "doux",
  title: "Fondamentaux : primitifs, String, passage par valeur, final",
  objective:
    "Éviter les pièges de l'autoboxing et de ==, comprendre l'immuabilité de String, expliquer le passage par valeur et maîtriser final et l'initialisation statique.",
  prerequisites: [],
  units: [
    l1, ...pick("java-fond-05", "java-fond-07", "java-fond-03", "java-fond-06"),
    l2, ...pick("java-fond-02", "java-fond-01", "java-fond-04", "java-fond-08"),
    l3, ...pick("java-fond-10", "java-fond-15", "java-fond-16"),
    l4, ...pick("java-fond-12", "java-fond-13", "java-fond-09", "java-fond-11", "java-fond-14"),
    l5, ...pick("java-fond-19", "java-fond-17", "java-fond-18", "java-fond-21"),
    l6, ...pick("java-fond-22", "java-fond-20", "java-fond-23"),
    l7, ...pick("java-fond-28", "java-fond-25", "java-fond-27", "java-fond-29"),
    l8, ...pick("java-fond-24", "java-fond-26", "java-fond-30"),
  ],
};
