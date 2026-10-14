/**
 * Fondations — Comprendre et gérer les erreurs : erreur de compilation contre
 * erreur d'exécution, lire un message et une trace de pile, les exceptions les
 * plus courantes, try / catch / finally, throw, bonnes habitudes.
 * 8 leçons, 28 exercices — format doux. Les messages et traces affichés ont
 * été générés avec le JDK local ; chaque exercice est précédé de la leçon qui
 * enseigne ce qu'il demande.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Deux moments où ça casse
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "bases-err-l1",
  title: "Deux moments où ça casse : avant et pendant",
  blocks: [
    {
      kind: "text",
      text: "Tu l'as sûrement déjà vécu : tu lances ton programme et un mur de texte rouge apparaît. Le réflexe, c'est de paniquer. Pourtant ce texte n'est pas une insulte : c'est Java qui t'explique, en détail, ce qui ne va pas. Avant d'apprendre à gérer les erreurs, ce chapitre t'apprend d'abord à les **lire**. Et la première chose à savoir, c'est qu'une erreur peut arriver à **deux moments** très différents.",
    },
    {
      kind: "text",
      text: "**Premier moment : avant de partir.** Quand tu lances un programme, Java commence par le faire relire par le **compilateur**. C'est un correcteur qui lit tout ton texte et le traduit en instructions que l'ordinateur comprend. Comme un correcteur qui relit ta lettre avant de la poster, s'il trouve une faute, il refuse de l'envoyer : c'est une **erreur de compilation**. Le programme ne démarre pas du tout. Rien ne s'affiche.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Du texte dans une case faite pour un nombre : Java refuse avant même de commencer.",
      code: `int age = "vingt";          // on range du texte dans une case de nombre
System.out.println(age);

// error: incompatible types: String cannot be converted to int
// Résultat : le programme ne démarre pas. Aucun affichage.`,
    },
    {
      kind: "text",
      text: "**Deuxième moment : en route.** Si le compilateur est content, le programme démarre et ses lignes s'exécutent une par une. Mais certains problèmes ne se voient qu'au moment où la ligne s'exécute, comme demander une case qui n'existe pas. Le programme **plante** : il s'arrête net, au milieu. C'est une **erreur d'exécution**. Ce qui s'est affiché avant reste affiché. Ce qui était prévu après n'arrive jamais.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce programme est bien écrit, il démarre, puis il plante à la ligne 3.",
      code: `System.out.println("Début");     // ligne 1 : affiché
int[] t = new int[3];            // 3 cases : t[0], t[1], t[2]
System.out.println(t[3]);        // ligne 3 : la case 3 n'existe pas, ça plante ici
System.out.println("Fin");       // ligne 4 : jamais exécutée`,
    },
    {
      kind: "comparison",
      title: "Avant ou pendant ?",
      left: {
        label: "Erreur de compilation",
        text: "Le programme **ne démarre pas**. Aucun affichage. La faute est dans la façon dont tu as **écrit** le code.",
        code: { language: "java", code: 'int age = "vingt";' },
      },
      right: {
        label: "Erreur d'exécution",
        text: "Le programme **démarre puis plante**. Ce qui précède s'est affiché. La faute apparaît quand la ligne **s'exécute**.",
        code: { language: "java", code: "System.out.println(t[3]);" },
      },
    },
    {
      kind: "text",
      text: "Pourquoi distinguer les deux ? Parce que ça te dit **où chercher**. Compilation : Java te montre la ligne fautive, la faute est dans l'écriture. Exécution : l'écriture est correcte, mais une valeur pose problème pendant que ça tourne. Les deux leçons suivantes t'apprennent à lire chacun de ces messages.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : « ça compile » ne veut pas dire « ça marche »",
      text: "Quand le compilateur ne dit rien, cela veut seulement dire que le code est bien écrit. Le programme peut encore planter en route, ou même donner un mauvais résultat sans aucun message.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — Lire une erreur de compilation
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "bases-err-l2",
  title: "Lire une erreur de compilation",
  blocks: [
    {
      kind: "text",
      text: "Un message de compilation ressemble à un mur, mais il suit **toujours le même plan**. Prenons une faute de frappe : on veut calculer un total, mais on a écrit `quantit` au lieu de `quantite`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le fichier Main.java. La ligne 5 contient la faute.",
      code: `public class Main {
    public static void main(String[] args) {
        int prix = 10;
        int quantite = 3;
        int total = prix * quantit;
        System.out.println(total);
    }
}`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce que Java affiche, mot pour mot.",
      code: `Main.java:5: error: cannot find symbol
        int total = prix * quantit;
                           ^
  symbol:   variable quantit
  location: class Main`,
    },
    {
      kind: "text",
      text: "Découpe-le en trois morceaux. **La première ligne** dit où et quoi : `Main.java` est le fichier, `5` est le **numéro de ligne**, et `cannot find symbol` est le nom de l'erreur (« je ne trouve pas ce nom »). **Les deux lignes suivantes** recopient ta ligne de code, avec un petit `^` sous l'endroit précis. **Les dernières lignes** donnent le détail : `symbol: variable quantit` est le nom que Java ne connaît pas.",
    },
    {
      kind: "text",
      text: "Ici, `quantit` n'existe pas : seule `quantite` a été créée. Autre piège du même genre : Java distingue les majuscules des minuscules. `prenom` et `Prenom` sont deux noms différents. Si ta case s'appelle `prenom` et que tu écris `Prenom`, tu obtiens aussi `cannot find symbol`.",
    },
    {
      kind: "comparison",
      title: "Deux messages qu'on confond",
      left: {
        label: "cannot find symbol",
        text: "Java ne **connaît pas ce nom** : faute de frappe, majuscule oubliée, variable jamais créée.",
        code: { language: "java", code: "int total = prix * quantit;" },
      },
      right: {
        label: "incompatible types",
        text: "Java connaît les noms, mais la valeur **ne rentre pas dans la case** : du texte dans un `int`, par exemple.",
        code: { language: "java", code: 'int age = "vingt";' },
      },
    },
    {
      kind: "text",
      text: "**`missing return statement`** (« il manque un `return` ») : une méthode qui promet de renvoyer une valeur (`int`, `boolean`...) peut se terminer sans le faire. Java examine tous les chemins possibles ; si un seul n'a pas de `return`, il refuse. Ici, que se passe-t-il si `n` vaut 0 ? Aucun des deux `if` ne se déclenche, et la méthode finit sans rien renvoyer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le chemin « n vaut 0 » n'a pas de return.",
      code: `static int signe(int n) {
    if (n > 0) {
        return 1;
    } else if (n < 0) {
        return -1;
    }
}   // error: missing return statement`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Correction : on ajoute le dernier chemin.",
      code: `static int signe(int n) {
    if (n > 0) {
        return 1;
    } else if (n < 0) {
        return -1;
    } else {
        return 0;      // maintenant tous les chemins renvoient quelque chose
    }
}`,
    },
    {
      kind: "text",
      text: "**`';' expected`** (« un point-virgule est attendu ») : il manque un `;` à la fin d'une instruction. Java signale la fin de la ligne où il manque, avec le `^` juste après le dernier mot. Le numéro de ligne est un point de départ : si rien ne cloche sur la ligne indiquée, regarde celle **juste au-dessus**. Les messages sont en anglais, mais courts : on en reconnaît vite une dizaine.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Corrige la première erreur d'abord",
      text: "Une seule faute, comme un `;` oublié, peut déclencher plusieurs messages à la suite. Commence par le **premier** message, corrige-le, relance : souvent, les autres disparaissent en même temps.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — Lire une trace de pile
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "bases-err-l3",
  title: "Lire une trace de pile",
  blocks: [
    {
      kind: "text",
      text: "Quand un programme plante en route, Java affiche un bloc rouge qu'on appelle la **trace de pile** (en anglais *stack trace*). C'est le mur de texte qui fait peur. Mais il est toujours construit pareil : un titre, puis une liste de lignes qui commencent par `at`. Voici le cas le plus simple : une division par zéro cachée dans une méthode `moyenne`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le fichier Main.java. La ligne 4 appelle moyenne, la ligne 8 divise.",
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Début");
        System.out.println(moyenne(120, 0));
    }

    static int moyenne(int total, int nombre) {
        return total / nombre;
    }
}`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce que Java affiche : « Début », puis la trace.",
      code: `Début
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.moyenne(Main.java:8)
    at Main.main(Main.java:4)`,
    },
    {
      kind: "text",
      text: "**La première ligne est le diagnostic.** `java.lang.ArithmeticException` est le **nom de l'erreur**. En Java, une erreur d'exécution s'appelle une **exception** : un cas exceptionnel qui arrête le programme. Après les deux-points vient le **message** : `/ by zero`, soit « division par zéro ». Les messages sont en anglais, mais le nom de l'exception en dit déjà beaucoup.",
    },
    {
      kind: "text",
      text: "**Les lignes `at` racontent le chemin.** Chaque ligne est une méthode qui était en cours au moment du plantage, au format `at Classe.méthode(Fichier.java:ligne)`. On lit **de haut en bas** : la première ligne est l'endroit exact où ça a planté, la suivante est la méthode qui l'avait appelée, et ainsi de suite jusqu'à `main`. Ici : ça a planté dans `moyenne`, ligne 8, appelée par `main`, ligne 4.",
    },
    {
      kind: "text",
      text: "Parfois la trace contient des lignes qui parlent de `java.base`. Voici ce que donne `Integer.parseInt(\"vingt\")`, qui essaie de transformer un texte en nombre. Le message `For input string: \"vingt\"` veut dire « ce texte n'est pas un nombre ».",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois lignes de Java, puis enfin une ligne de TON code.",
      code: `Exception in thread "main" java.lang.NumberFormatException: For input string: "vingt"
    at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)  <- code de Java
    at java.base/java.lang.Integer.parseInt(Integer.java:565)                                   <- code de Java
    at java.base/java.lang.Integer.parseInt(Integer.java:662)                                   <- code de Java
    at Main.lireAge(Main.java:8)                                                                <- TON code : ici
    at Main.main(Main.java:3)                                                                   <- qui a appelé lireAge`,
    },
    {
      kind: "comparison",
      title: "Quelles lignes regarder ?",
      left: {
        label: "at java.base/...",
        text: "Du code de Java lui-même. Il **signale** le problème, mais ce n'est pas lui qui est fautif : inutile d'y aller.",
        code: { language: "text", code: "at java.base/java.lang.Integer.parseInt(Integer.java:662)" },
      },
      right: {
        label: "at Main.lireAge(...)",
        text: "Ton code. C'est la **première ligne de ce genre** qu'il faut ouvrir : là, tu peux agir.",
        code: { language: "text", code: "at Main.lireAge(Main.java:8)" },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "La méthode en trois gestes",
      text: "1) Lis la première ligne : quelle exception, quel message. 2) Descends les lignes `at` jusqu'à la **première qui parle de TON fichier**. 3) Ouvre ce fichier à ce numéro de ligne et regarde les valeurs utilisées. Les numéros de ligne des fichiers de Java changent d'une version à l'autre : ne t'y arrête pas.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — Les erreurs d'exécution les plus courantes
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "bases-err-l4",
  title: "Les quatre erreurs d'exécution les plus courantes",
  blocks: [
    {
      kind: "text",
      text: "Quatre exceptions reviennent sans cesse. Pour chacune, il faut savoir **ce qui la provoque** et **comment l'éviter**. Leur nom dit déjà presque tout. Les voici d'un coup d'œil.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une ligne, une exception.",
      code: `String nom = null;
nom.length();                        // NullPointerException

int[] t = new int[3];
t[3] = 1;                            // ArrayIndexOutOfBoundsException

int d = 0;
int r = 10 / d;                      // ArithmeticException : / by zero

int n = Integer.parseInt("vingt");   // NumberFormatException`,
    },
    {
      kind: "text",
      text: "**`NullPointerException`** : tu appelles quelque chose sur une variable qui vaut `null`, la flèche qui ne mène nulle part. C'est comme chercher à ouvrir une boîte qui n'existe pas. Elle vient d'une variable jamais remplie, d'une case de tableau d'objets jamais remplie, ou d'un `map.get(...)` sur une clé absente (qui répond `null`). Pour l'éviter, teste avant d'utiliser : `if (nom != null)`.",
    },
    {
      kind: "text",
      text: "**`ArrayIndexOutOfBoundsException`** : tu demandes une case qui n'existe pas. Un tableau de 3 cases a les places 0, 1 et 2, donc `t[3]` n'existe pas. Le dernier index est toujours `t.length - 1`. **`ArithmeticException`** : tu divises un entier par zéro. Le message est `/ by zero`. Pour éviter ces deux-là, teste avant : la place est-elle plus petite que `t.length` ? Le diviseur est-il différent de 0 ?",
    },
    {
      kind: "code",
      language: "java",
      caption: "On vérifie avant d'agir : c'est la parade des trois premières.",
      code: `if (nom != null) {
    System.out.println(nom.length());     // on n'ouvre la boîte que si elle existe
}
if (place < t.length) {
    System.out.println(t[place]);         // la case existe bien
}
if (diviseur != 0) {
    System.out.println(10 / diviseur);    // on ne divise jamais par zéro
}`,
    },
    {
      kind: "text",
      text: "**`NumberFormatException`** : tu demandes à Java de transformer un texte en nombre avec `Integer.parseInt`, mais le texte n'est pas un nombre : `\"vingt\"`, `\"12a\"`, ou un texte vide. Ici un simple `if` ne suffit pas à l'éviter, car on ne peut pas deviner à l'avance si un texte est bien un nombre. On utilise `try` / `catch`, c'est la leçon suivante.",
    },
    {
      kind: "comparison",
      title: "Tableau ou liste ?",
      left: {
        label: "Tableau",
        text: "Une case absente donne `ArrayIndexOutOfBoundsException`. La taille se lit avec `t.length`.",
        code: { language: "java", code: "int[] t = new int[3];\nt[3] = 1;" },
      },
      right: {
        label: "Liste",
        text: "Une place absente donne `IndexOutOfBoundsException` (même idée, nom plus court). La taille se lit avec `noms.size()`.",
        code: { language: "java", code: "List<String> noms = List.of(\"Ana\");\nnoms.get(1);" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : seule la division entière plante",
      text: "`10 / 0` plante. Mais `10.0 / 0` (avec un nombre à virgule) ne plante pas : Java répond `Infinity` et continue. Seule la division de nombres entiers par zéro lance `ArithmeticException`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — try / catch
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "bases-err-l5",
  title: "try / catch : attraper une erreur",
  blocks: [
    {
      kind: "text",
      text: "Parfois, on sait qu'une erreur peut arriver et que ce n'est pas un bug : un utilisateur tape `vingt` au lieu de `20`. On ne veut pas que le programme meure pour ça. On veut dire : « essaie ; si ça casse, fais ça à la place ». C'est le rôle de `try` et `catch`. Image : l'acrobate (`try`) tente son numéro, et le filet (`catch`) le rattrape s'il tombe.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Sans filet : « Fin » n'est jamais affiché.",
      code: `System.out.println("Début");
int age = Integer.parseInt("vingt");     // plante ici
System.out.println("Fin");               // jamais exécutée`,
    },
    {
      kind: "text",
      text: "Voici le même programme avec un filet. Le bloc **`try`** contient les lignes risquées. Le bloc **`catch`** contient le plan B, et on lui annonce **le nom de l'erreur** qu'il sait rattraper, ici `NumberFormatException`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Avec un filet : le programme continue.",
      code: `System.out.println("Début");
try {
    int age = Integer.parseInt("vingt");
    System.out.println("Age : " + age);
} catch (NumberFormatException e) {
    System.out.println("Ce n'est pas un nombre.");
}
System.out.println("Fin");`,
    },
    {
      kind: "text",
      text: "Suivons-le ligne par ligne. Java affiche `Début`. Il entre dans le `try` et exécute `parseInt`, qui plante. À cet instant, Java **abandonne le reste du `try`** : la ligne `Age : ...` est sautée. Il cherche un `catch` dont le nom correspond à l'erreur, le trouve, et exécute son contenu. Puis le programme **reprend normalement après le `catch`** : `Fin` s'affiche.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce qui s'affiche, et pourquoi.",
      code: `Début                              affiché
try : parseInt("vingt")            plante ici
      ligne "Age : ..."            sautée
catch : "Ce n'est pas un nombre."  affiché
Fin                                affiché : le programme a continué`,
    },
    {
      kind: "comparison",
      title: "Avec ou sans erreur",
      left: {
        label: "Rien ne casse",
        text: "Tout le `try` s'exécute, puis le `catch` est **sauté** comme s'il n'existait pas.",
        code: { language: "java", code: 'try { Integer.parseInt("20"); }\ncatch (NumberFormatException e) { ... }' },
      },
      right: {
        label: "Quelque chose casse",
        text: "Le reste du `try` est **abandonné**, le `catch` correspondant s'exécute, puis le programme continue.",
        code: { language: "java", code: 'try { Integer.parseInt("vingt"); }\ncatch (NumberFormatException e) { ... }' },
      },
    },
    {
      kind: "text",
      text: "La variable `e` (pour *exception*) est la boîte qui contient l'erreur rattrapée. `e.getMessage()` te donne son message, par exemple `For input string: \"vingt\"`. Tu peux l'afficher pour comprendre ce qui s'est passé : `System.out.println(\"Problème : \" + e.getMessage());`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un catch ne rattrape que le nom annoncé",
      text: "Un `catch (ArithmeticException e)` ne rattrape pas une `NumberFormatException` : le programme plante comme s'il n'y avait pas de filet. De même, seules les lignes **à l'intérieur du `try`** sont protégées.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — finally et plusieurs catch
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "bases-err-l6",
  title: "finally et plusieurs catch : l'ordre compte",
  blocks: [
    {
      kind: "text",
      text: "Deux situations arrivent vite. Dans le même `try`, **plusieurs erreurs différentes** sont possibles, et chacune demande son propre plan B. Et parfois, il y a du travail à faire **dans tous les cas**, erreur ou pas : fermer une connexion, afficher « terminé ». Pour la première, on met plusieurs `catch`. Pour la seconde, on ajoute un `finally`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un `catch` par erreur possible : ici, texte invalide ou diviseur nul.",
      code: `static void calculer(String texte, int diviseur) {
    try {
        int n = Integer.parseInt(texte);
        System.out.println(n / diviseur);
    } catch (NumberFormatException e) {
        System.out.println("Pas un nombre.");
    } catch (ArithmeticException e) {
        System.out.println("Division par zéro.");
    }
}`,
    },
    {
      kind: "text",
      text: "Java lit les `catch` **dans l'ordre, de haut en bas**, prend le premier qui convient et ignore les autres. Or les exceptions forment des **familles**, comme des poupées russes : `NumberFormatException` est une sorte d'`IllegalArgumentException`, elle-même une sorte d'`Exception`, qui est le nom le plus large : il attrape presque tout. Un `catch` large placé en premier avalerait tout, et les `catch` précis derrière ne serviraient jamais.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le large d'abord : Java refuse de compiler.",
      code: `try {
    int n = Integer.parseInt(texte);
} catch (Exception e) {                 // attrape déjà tout
    System.out.println("Quelque chose a cassé.");
} catch (NumberFormatException e) {     // ne serait jamais atteint
    System.out.println("Pas un nombre.");
}
// error: exception NumberFormatException has already been caught`,
    },
    {
      kind: "comparison",
      title: "Dans quel ordre ?",
      left: {
        label: "Du précis au large",
        text: "`NumberFormatException` d'abord, puis `Exception`. Chacun rattrape ce qui le concerne. **Accepté.**",
        code: { language: "java", code: "catch (NumberFormatException e) { ... }\ncatch (Exception e) { ... }" },
      },
      right: {
        label: "Du large au précis",
        text: "`Exception` d'abord : le second `catch` ne servirait à rien. **Refusé à la compilation.**",
        code: { language: "java", code: "catch (Exception e) { ... }\ncatch (NumberFormatException e) { ... }" },
      },
    },
    {
      kind: "text",
      text: "Passons à **`finally`**. Son bloc s'exécute **toujours** : que le `try` se soit bien passé ou qu'un `catch` ait rattrapé une erreur. Regarde les deux sorties ci-dessous : `Fermeture` s'affiche dans les deux cas. C'est vrai même si aucun `catch` ne correspond : le programme plante, mais seulement après avoir exécuté le `finally`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "lire(\"12\") affiche Ouverture, Nombre : 12, Fermeture. lire(\"abc\") affiche Ouverture, Pas un nombre, Fermeture.",
      code: `static void lire(String texte) {
    try {
        System.out.println("Ouverture");
        int n = Integer.parseInt(texte);
        System.out.println("Nombre : " + n);
    } catch (NumberFormatException e) {
        System.out.println("Pas un nombre");
    } finally {
        System.out.println("Fermeture");     // dans tous les cas
    }
}`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "finally passe même après un return",
      text: "Même si le `try` contient un `return`, le `finally` s'exécute avant que la méthode ne rende la main. Un `try` qui affiche `A` puis fait `return 1`, avec un `finally` qui affiche `B`, donne `A`, `B`, puis le `1` est renvoyé. Retiens : `finally` sert à ranger ce qui doit toujours être fait.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 7 — throw
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "bases-err-l7",
  title: "Lancer soi-même une erreur avec throw",
  blocks: [
    {
      kind: "text",
      text: "Jusqu'ici, c'est Java qui lançait les erreurs. Mais parfois, c'est **toi** qui sais qu'une valeur n'est pas acceptable : une quantité négative, un âge de -5. Java ne peut pas le deviner : `-3` est un `int` parfaitement valide. Sans protection, la mauvaise valeur traverse le programme sans bruit et donne un résultat absurde, découvert beaucoup plus tard.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Aucune erreur, mais un prix négatif.",
      code: `static double calculerPrix(double prix, int quantite) {
    return prix * quantite;
}

calculerPrix(10.0, -3);     // renvoie -30.0 : personne ne s'en plaint`,
    },
    {
      kind: "text",
      text: "Mieux vaut **refuser tout de suite et bruyamment**. On le fait avec `throw` (« jeter »). `throw new IllegalArgumentException(\"message\")` fabrique une erreur avec un message et la lance : la méthode s'arrête là, comme si Java avait planté. `IllegalArgumentException` signifie « argument illégal » : la valeur reçue est refusée. Le `new` fabrique l'erreur, comme une boîte neuve.",
    },
    {
      kind: "code",
      language: "java",
      caption: "On vérifie au tout début de la méthode.",
      code: `static double calculerPrix(double prix, int quantite) {
    if (quantite <= 0) {
        throw new IllegalArgumentException("La quantité doit être positive : " + quantite);
    }
    return prix * quantite;      // atteint seulement si la quantité est valide
}

// calculerPrix(10.0, -3) plante avec :
// Exception in thread "main" java.lang.IllegalArgumentException: La quantité doit être positive : -3
//     at Main.calculerPrix(Main.java:4)
//     at Main.main(Main.java:15)`,
    },
    {
      kind: "text",
      text: "Ton message sera lu par la personne qui verra la trace, peut-être toi dans un mois. Dis **ce qui ne va pas** et **quelle valeur** a été reçue : `La quantité doit être positive : -3` est bien plus utile que `Erreur`. La trace montre aussi, à la première ligne `at`, la ligne exacte de ton `throw`. Remarque enfin que le `return` n'est jamais atteint quand le `throw` se déclenche : dès qu'on lance l'erreur, la méthode s'arrête. C'est pourquoi on vérifie **au début**, avant de calculer quoi que ce soit.",
    },
    {
      kind: "comparison",
      title: "throw ou catch ?",
      left: {
        label: "throw : je lance",
        text: "C'est celui qui **découvre** le problème qui lance l'erreur.",
        code: { language: "java", code: 'throw new IllegalArgumentException("...");' },
      },
      right: {
        label: "catch : je rattrape",
        text: "C'est celui qui **sait quoi faire** de l'erreur qui l'attrape, souvent plus haut.",
        code: { language: "java", code: "catch (IllegalArgumentException e) { ... }" },
      },
    },
    {
      kind: "code",
      language: "java",
      caption: "Ton `throw` se rattrape comme n'importe quelle erreur.",
      code: `try {
    System.out.println(calculerPrix(10.0, -3));
} catch (IllegalArgumentException e) {
    System.out.println("Refusé : " + e.getMessage());   // Refusé : La quantité doit être positive : -3
}`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : oublier le new",
      text: "`throw IllegalArgumentException(\"...\")` sans `new` ne compile pas : Java répond `cannot find symbol ... method IllegalArgumentException(String)`. On lance toujours une erreur **fabriquée** avec `new`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 8 — Bonnes habitudes
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "bases-err-l8",
  title: "Les bonnes habitudes avec les erreurs",
  blocks: [
    {
      kind: "text",
      text: "Écrire un `catch`, c'est facile. Bien le faire demande trois habitudes. Chacune évite de transformer une petite erreur en un bug introuvable.",
    },
    {
      kind: "text",
      text: "**Première habitude : ne jamais avaler une erreur.** Avaler une erreur, c'est l'attraper avec un `catch` qui ne fait rien. La saisie est fausse, mais le programme continue comme si tout allait bien, et personne ne saura jamais ce qui s'est passé. C'est comme débrancher le voyant rouge du tableau de bord : la panne existe toujours, mais tu ne la vois plus.",
    },
    {
      kind: "code",
      language: "java",
      caption: "À ne jamais faire : un catch vide.",
      code: `try {
    int age = Integer.parseInt(saisie);
    enregistrer(age);
} catch (Exception e) {
    // rien : l'erreur disparaît sans laisser de trace
}`,
    },
    {
      kind: "text",
      text: "**Deuxième habitude : un message utile.** Un message comme `Erreur` n'aide personne. Un bon message dit **quoi**, avec **quelle valeur**, et si possible **ce qu'on attendait**. Compare avec `Âge invalide : « abc » n'est pas un nombre.` Celui qui le lira dans un mois saura tout de suite où chercher.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même code, bien fait : type précis, message utile.",
      code: `try {
    int age = Integer.parseInt(saisie);
    enregistrer(age);
} catch (NumberFormatException e) {
    System.out.println("Âge invalide : « " + saisie + " » n'est pas un nombre.");
}`,
    },
    {
      kind: "text",
      text: "**Troisième habitude : ne pas attraper trop large.** `catch (Exception e)` attrape presque tout, y compris les erreurs auxquelles tu ne pensais pas. Un vrai bug dans `enregistrer` serait caché derrière le message « Âge invalide » : tu chercherais au mauvais endroit. Annonce le type précis que tu attends.",
    },
    {
      kind: "comparison",
      title: "Trop large ou précis ?",
      left: {
        label: "catch (Exception e)",
        text: "Rattrape **tout**, même les bugs inattendus, qui se retrouvent cachés derrière un message trompeur.",
        code: { language: "java", code: "catch (Exception e) { ... }" },
      },
      right: {
        label: "catch (NumberFormatException e)",
        text: "Rattrape **seulement** ce que tu prévois. Le reste plante, avec une trace qui t'aide à le trouver.",
        code: { language: "java", code: "catch (NumberFormatException e) { ... }" },
      },
    },
    {
      kind: "text",
      text: "Et si tu ne sais pas quoi faire de l'erreur ? Alors **ne l'attrape pas**. Laisse-la remonter : le programme plantera avec sa trace de pile, ce qui vaut mieux qu'une erreur cachée. Quelqu'un plus haut saura peut-être quoi en faire.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Les trois règles",
      text: "1) Jamais de `catch` vide. 2) Un message qui dit quoi et quelle valeur. 3) Le type d'erreur le plus précis possible. Et en cas de doute, ne rattrape rien.",
    },
    {
      kind: "code",
      language: "text",
      caption: "À venir : ce que Java répond quand on ouvre un fichier sans rien prévoir.",
      code: `Main.java:4: error: unreported exception FileNotFoundException; must be caught or declared to be thrown
        FileReader lecteur = new FileReader("notes.txt");
                             ^`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "Pour plus tard : les erreurs « vérifiées »",
      text: "Il existe un autre genre d'erreurs que Java t'**oblige** à prévoir, comme celles de la lecture d'un fichier : on les appelle les erreurs **vérifiées** (*checked*). Si tu les oublies, tu obtiens une erreur de compilation comme ci-dessus. Celles de ce chapitre n'ont pas cette obligation. Tu les rencontreras plus tard : pour l'instant, retiens juste que ce message existe.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Exercices (répartis sur les leçons plus bas)
// ---------------------------------------------------------------------------

const EXERCISES: Exercise[] = [
  // ----- Leçon 1 -----
  {
    kind: "mcq",
    id: "bases-err-01",
    difficulty: 1,
    tags: ["compilation", "execution"],
    prompt: "Tu lances ton programme et Java affiche une erreur avant d'avoir montré la moindre ligne. De quel genre d'erreur s'agit-il ?",
    choices: [
      "Une erreur de compilation : Java refuse de démarrer",
      "Une erreur d'exécution : le programme plante en route",
      "Une erreur de mémoire : l'ordinateur est trop plein",
      "Une erreur de réseau : internet est coupé",
    ],
    answer: 0,
    simple:
      "Imagine un correcteur qui relit ta lettre avant de la poster. S'il trouve une faute, la lettre ne part pas. Ici c'est pareil : rien ne s'est affiché, donc le programme n'a jamais démarré. Si le programme avait démarré, tu aurais vu au moins un début d'affichage avant le plantage.",
    explanation:
      "Une erreur détectée avant que le programme ne démarre est une erreur de compilation : le compilateur a relu le code et l'a refusé. Une erreur d'exécution, elle, apparaît en cours de route, après que le début du programme s'est exécuté.",
  },
  {
    kind: "match",
    id: "bases-err-02",
    difficulty: 1,
    tags: ["compilation", "execution"],
    prompt: "Relie chaque mot à ce qu'il veut dire.",
    pairs: [
      { left: "Le compilateur", right: "Le correcteur qui relit tout avant le départ" },
      { left: "Erreur de compilation", right: "Le programme refuse de démarrer" },
      { left: "Erreur d'exécution", right: "Le programme démarre puis plante en route" },
    ],
    simple:
      "Pense à une lettre. Le compilateur est le correcteur qui la relit avant de la poster. Si la lettre est refusée, c'est une erreur de compilation : elle ne part pas. Si elle part mais se perd en chemin, c'est une erreur d'exécution : le programme a démarré, puis il a planté.",
    explanation:
      "Le compilateur relit tout le code avant l'exécution. Ses refus sont les erreurs de compilation : le programme ne démarre pas. Les erreurs d'exécution surviennent plus tard, ligne par ligne, quand une instruction ne peut pas être réalisée.",
  },
  {
    kind: "output",
    id: "bases-err-03",
    difficulty: 1,
    tags: ["execution", "tableaux"],
    prompt: "Ce code est bien écrit. Que se passe-t-il quand on le lance ?",
    code: {
      language: "java",
      code: `System.out.println("Début");
int[] t = new int[3];
System.out.println(t[3]);
System.out.println("Fin");`,
    },
    choices: [
      "`Début`, puis le programme plante avant `Fin`",
      "Rien du tout : Java refuse de lancer le programme",
      "`Début`, `0`, puis `Fin` : une case absente vaut 0",
      "`Début` puis `Fin` : Java ignore l'erreur et continue",
    ],
    answer: 0,
    simple:
      "Le code est bien écrit, donc Java le lance. Ligne 1 : `Début` s'affiche. Ligne 2 : on crée 3 cases, les places 0, 1 et 2. Ligne 3 : on demande la place 3, qui n'existe pas, et ça plante. Ligne 4 n'est jamais atteinte : `Fin` n'apparaît pas.",
    explanation:
      "Aucune faute d'écriture : pas d'erreur de compilation, `Début` s'affiche. `t[3]` sort du tableau (places 0 à 2) : `ArrayIndexOutOfBoundsException` à l'exécution. Le programme s'arrête net, `Fin` n'est jamais atteint. Java ne met pas 0 dans une case absente.",
  },

  // ----- Leçon 2 -----
  {
    kind: "mcq",
    id: "bases-err-04",
    difficulty: 1,
    tags: ["compilation", "messages-erreur"],
    prompt: "Java affiche `Main.java:12: error: cannot find symbol`. Que veut dire le `12` ?",
    choices: [
      "La ligne du fichier `Main.java` où Java a repéré le problème",
      "Le nombre d'erreurs que Java a trouvées dans le programme",
      "Le numéro de code de l'erreur, qu'on cherche ensuite sur internet",
      "Le nombre de secondes écoulées avant que l'erreur arrive",
    ],
    answer: 0,
    simple:
      "Le début du message est comme une adresse : le fichier (`Main.java`), puis le numéro de la ligne (12), puis le nom de l'erreur. Ouvre le fichier et descends jusqu'à la ligne 12 : c'est là que Java a vu le problème, avec un petit `^` qui montre l'endroit précis.",
    explanation:
      "Le format est `Fichier.java:numéroDeLigne: error: nom de l'erreur`. Le chiffre est le numéro de ligne, qu'on compte depuis le haut du fichier. Il sert de point de départ : la cause se trouve sur cette ligne, ou parfois juste au-dessus.",
  },
  {
    kind: "match",
    id: "bases-err-05",
    difficulty: 1,
    tags: ["compilation", "messages-erreur"],
    prompt: "Relie chaque message de compilation à sa signification.",
    pairs: [
      { left: "`cannot find symbol`", right: "Java ne connaît pas ce nom (faute de frappe, majuscule)" },
      { left: "`incompatible types`", right: "La valeur ne rentre pas dans la case (du texte dans un `int`)" },
      { left: "`missing return statement`", right: "Une méthode peut se finir sans rien renvoyer" },
      { left: "`';' expected`", right: "Il manque un point-virgule à la fin d'une ligne" },
    ],
    simple:
      "Chaque message dit presque ce qu'il veut dire. `cannot find symbol` : « je ne trouve pas ce nom », comme un mot mal écrit dans un dictionnaire. `incompatible types` : la valeur ne va pas dans la case. `missing return statement` : il manque un `return` sur un des chemins. `';' expected` : il manque un `;`.",
    explanation:
      "Ce sont les quatre messages de compilation les plus fréquents pour un débutant. `cannot find symbol` désigne un nom inconnu, `incompatible types` un type qui ne convient pas, `missing return statement` une méthode dont un chemin ne renvoie rien, `';' expected` une instruction non terminée.",
  },
  {
    kind: "spot",
    id: "bases-err-06",
    difficulty: 1,
    tags: ["compilation", "messages-erreur"],
    prompt: "Java refuse de compiler ce programme et affiche `cannot find symbol`. Quelle ligne est fautive ?",
    code: {
      language: "java",
      code: `public class Main {
    public static void main(String[] args) {
        String prenom = "Ana";
        int age = 25;
        System.out.println(Prenom + " a " + age + " ans");
    }
}`,
    },
    faultyLine: 5,
    reasons: [
      "`Prenom` avec un P majuscule n'existe pas : la case s'appelle `prenom`",
      "On ne peut pas coller un texte et un nombre avec `+`",
      "`println` doit s'écrire avec un L majuscule",
      "Il manque un point-virgule à la fin de la ligne",
    ],
    reasonAnswer: 0,
    simple:
      "La case a été créée à la ligne 3 sous le nom `prenom`, avec un p minuscule. Ligne 5, on écrit `Prenom` avec un P majuscule : pour Java, c'est un autre nom, qu'il ne connaît pas. C'est la ligne 5 qui est fautive, pas la ligne 3 : c'est là qu'on utilise le mauvais nom.",
    explanation:
      "Java distingue majuscules et minuscules : `prenom` et `Prenom` sont deux noms différents. La variable créée s'appelle `prenom`, donc `Prenom` à la ligne 5 est un symbole inconnu. Coller texte et nombre avec `+` est permis, et le point-virgule est bien présent.",
  },
  {
    kind: "fill",
    id: "bases-err-07",
    difficulty: 1,
    tags: ["compilation", "return"],
    prompt: "Java répond `missing return statement`. Complète pour que chaque chemin renvoie une valeur.",
    code: {
      language: "java",
      code: `static boolean estMajeur(int age) {
    if (age >= 18) {
        return true;
    } {{1}} {
        return {{2}};
    }
}`,
    },
    blanks: ["else", "false"],
    distractors: ["if", "true", "void"],
    simple:
      "Il y a deux chemins : l'âge est au moins 18, ou il ne l'est pas. Le premier chemin renvoie `true`. Il faut aussi un chemin pour tous les autres cas, avec `else`, qui renvoie `false`. Ainsi, quoi qu'il arrive, la méthode finit toujours par un `return`.",
    explanation:
      "Sans `else`, le cas « age < 18 » ne rencontre aucun `return` et la méthode se termine sans valeur : `missing return statement`. Avec `else { return false; }`, tous les chemins renvoient un booléen.",
  },

  // ----- Leçon 3 -----
  {
    kind: "mcq",
    id: "bases-err-08",
    difficulty: 1,
    tags: ["trace-de-pile", "exceptions"],
    prompt: "D'après cette trace, dans quelle méthode le programme a-t-il planté ?",
    code: {
      language: "text",
      code: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "nom" is null
    at Main.afficher(Main.java:7)
    at Main.main(Main.java:3)`,
    },
    choices: [
      "`afficher`, à la ligne 7",
      "`main`, à la ligne 3",
      "`toUpperCase`, dans la classe String",
      "`NullPointerException`, qui est le nom d'une méthode",
    ],
    answer: 0,
    simple:
      "Les lignes `at` se lisent de haut en bas. La première est l'endroit exact du plantage : la méthode `afficher`, ligne 7. La deuxième dit qui avait appelé `afficher` : `main`, ligne 3. Comme les marches d'un escalier qu'on remonte : la première marche est la plus proche de la chute.",
    explanation:
      "La première ligne `at` désigne la méthode en cours au moment du plantage : `Main.afficher`, fichier Main.java, ligne 7. La suivante, `Main.main`, est l'appelante. `toUpperCase` est ce que le code essayait d'appeler sur `nom`, qui vaut `null` : ce n'est pas l'endroit du plantage. `NullPointerException` est le nom de l'erreur, pas d'une méthode.",
  },
  {
    kind: "match",
    id: "bases-err-09",
    difficulty: 1,
    tags: ["trace-de-pile", "exceptions"],
    prompt: "Voici une trace : `ArithmeticException: / by zero`, puis `at Main.moyenne(Main.java:8)`, puis `at Main.main(Main.java:4)`. Relie chaque morceau à son rôle.",
    pairs: [
      { left: "`ArithmeticException`", right: "Le nom de l'erreur" },
      { left: "`/ by zero`", right: "Le message : le détail de ce qui s'est passé" },
      { left: "`at Main.moyenne(Main.java:8)`", right: "L'endroit exact du plantage : méthode, fichier, ligne" },
      { left: "`at Main.main(Main.java:4)`", right: "Qui avait appelé la méthode qui a planté" },
    ],
    simple:
      "Une trace se lit comme un rapport d'accident. Le nom de l'erreur dit de quel genre d'accident il s'agit. Le message donne le détail. Puis viennent les lignes `at` : la première dit où ça s'est passé, la suivante dit qui avait envoyé la voiture sur cette route, et ainsi de suite jusqu'à `main`.",
    explanation:
      "Le titre donne le nom de l'exception puis son message. Les lignes `at` listent les méthodes en cours, de la plus récente (l'endroit du plantage) à la plus ancienne (`main`). Chaque ligne indique la classe, la méthode, le fichier et le numéro de ligne.",
  },
  {
    kind: "order",
    id: "bases-err-10",
    difficulty: 1,
    tags: ["trace-de-pile", "methode"],
    prompt: "Remets dans l'ordre les gestes pour lire une trace de pile.",
    items: [
      "Lire la première ligne : le nom de l'erreur et son message",
      "Descendre les lignes `at` jusqu'à la première qui parle de ton fichier",
      "Ouvrir ce fichier au numéro de ligne indiqué",
      "Regarder les valeurs utilisées sur cette ligne",
    ],
    simple:
      "Comme pour un détective : d'abord on lit le rapport pour savoir quel genre d'accident c'est (la première ligne). Ensuite on suit les traces jusqu'à la première qui mène chez toi (la ligne `at` avec ton fichier). Puis on va sur place (ce numéro de ligne) et on regarde de près les valeurs qui s'y trouvent.",
    explanation:
      "Diagnostic d'abord (exception et message), puis localisation (première ligne `at` de ton code), puis ouverture à la bonne ligne, puis analyse des valeurs en jeu. Les lignes de `java.base` sont du code de Java : on ne s'y arrête pas.",
  },
  {
    kind: "recall",
    id: "bases-err-11",
    difficulty: 2,
    tags: ["trace-de-pile", "exceptions"],
    prompt: "Voici une trace. Quelle est l'erreur, que dit son message, et à quelle ligne de ton code vas-tu regarder en premier ?",
    code: {
      language: "text",
      code: `Exception in thread "main" java.lang.IndexOutOfBoundsException: Index 1 out of bounds for length 1
    at java.base/jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:100)
    at java.base/jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:106)
    at java.base/jdk.internal.util.Preconditions.checkIndex(Preconditions.java:302)
    at java.base/java.util.Objects.checkIndex(Objects.java:365)
    at java.base/java.util.ArrayList.get(ArrayList.java:428)
    at Main.main(Main.java:8)`,
    },
    keyPoints: [
      "`IndexOutOfBoundsException` : une place hors des limites",
      "Message : la place 1 est demandée, mais la liste n'a qu'un élément",
      "Les lignes `java.base` sont du code de Java : on les saute",
      "Première ligne de ton code : `Main.main(Main.java:8)`",
    ],
    simple:
      "Le nom de l'erreur dit qu'on demande une place qui n'existe pas. Le message précise : on voulait la place 1, mais la liste n'a qu'un élément (place 0 seulement). Les lignes qui parlent de `java.base` sont le code de Java : elles ne sont pas fautives. La première ligne qui parle de toi est `Main.main(Main.java:8)` : on ouvre `Main.java` ligne 8.",
    explanation:
      "Exception : `IndexOutOfBoundsException` avec le message `Index 1 out of bounds for length 1` (place 1 demandée, taille 1). Les six lignes en `java.base/...` sont des vérifications internes de la liste, dans le code de Java. La première ligne de ton propre code est `at Main.main(Main.java:8)` : c'est là qu'on appelle `get(1)` sur une liste trop courte.",
  },

  // ----- Leçon 4 -----
  {
    kind: "match",
    id: "bases-err-12",
    difficulty: 1,
    tags: ["exceptions", "null", "tableaux"],
    prompt: "Relie chaque exception à ce qui la provoque.",
    pairs: [
      { left: "`NullPointerException`", right: "On utilise une variable qui vaut `null`" },
      { left: "`ArrayIndexOutOfBoundsException`", right: "On demande une case qui n'existe pas dans le tableau" },
      { left: "`ArithmeticException`", right: "On divise un entier par zéro" },
      { left: "`NumberFormatException`", right: "On transforme en nombre un texte qui n'en est pas un" },
    ],
    simple:
      "Le nom dit presque tout. `Null` : la flèche ne mène nulle part, on ouvre une boîte qui n'existe pas. `ArrayIndex` : on demande une case de tableau qui n'existe pas. `Arithmetic` : un calcul interdit, comme diviser par zéro. `NumberFormat` : le texte n'a pas la forme d'un nombre, comme `\"vingt\"`.",
    explanation:
      "Quatre exceptions à reconnaître d'un coup d'œil : `NullPointerException` (appel sur `null`), `ArrayIndexOutOfBoundsException` (index hors du tableau), `ArithmeticException` (division entière par zéro, message `/ by zero`), `NumberFormatException` (`parseInt` sur un texte invalide).",
  },
  {
    kind: "output",
    id: "bases-err-13",
    difficulty: 2,
    tags: ["exceptions", "parseint"],
    prompt: "Que se passe-t-il quand on lance ce code ?",
    code: {
      language: "java",
      code: `String texte = "12a";
int n = Integer.parseInt(texte);
System.out.println(n + 1);`,
    },
    choices: [
      "Le programme plante avec une `NumberFormatException`",
      "`13` : Java ignore la lettre `a`",
      "`12a1` : Java colle le texte et le chiffre",
      "`0` : Java met 0 quand ça ne marche pas",
    ],
    answer: 0,
    simple:
      "`parseInt` sait transformer `\"12\"` en 12, mais `\"12a\"` contient une lettre : ce n'est pas un nombre. Java ne devine pas, il ne met pas 0, il n'ignore pas la lettre : il plante tout de suite à la ligne 2. La ligne 3 n'est jamais exécutée, donc rien ne s'affiche.",
    explanation:
      "`Integer.parseInt(\"12a\")` lance `NumberFormatException` (message `For input string: \"12a\"`) : le texte doit être entièrement un nombre. L'exception est lancée à la ligne 2, le `println` n'est jamais atteint. Il n'y a ni conversion partielle ni valeur par défaut.",
  },
  {
    kind: "spot",
    id: "bases-err-14",
    difficulty: 2,
    tags: ["exceptions", "null", "dictionnaires"],
    prompt: "Ce code s'exécute, affiche `4`, puis plante avec une `NullPointerException`. Quelle ligne plante ?",
    code: {
      language: "java",
      code: `Map<String, String> villes = new HashMap<>();
villes.put("Ana", "Lyon");
System.out.println(villes.get("Ana").length());
System.out.println(villes.get("Bob").length());`,
    },
    faultyLine: 4,
    reasons: [
      "`villes.get(\"Bob\")` répond `null` car « Bob » n'est pas dans le dictionnaire",
      "`length()` n'existe pas sur un texte : il faut `size()`",
      "On ne peut pas afficher deux lignes à la suite",
      "`put` doit être appelé avant chaque `get`, même pour une clé déjà rangée",
    ],
    reasonAnswer: 0,
    simple:
      "À la ligne 3, « Ana » est bien dans le dictionnaire : on obtient `Lyon`, de longueur 4. À la ligne 4, « Bob » n'y est pas : `get` répond « rien », c'est-à-dire `null`. On essaie alors de demander la longueur de ce rien, et ça plante. Une clé absente donne toujours `null`.",
    explanation:
      "`Map.get` renvoie `null` quand la clé est absente. Appeler `.length()` sur ce `null` lève `NullPointerException`. La ligne 3 fonctionne (« Ana » existe, `Lyon` fait 4 lettres). `length()` est bien la méthode des `String` ; `size()` est celle des collections.",
  },
  {
    kind: "fill",
    id: "bases-err-15",
    difficulty: 2,
    tags: ["exceptions", "tableaux", "conditions"],
    prompt: "Complète pour ne lire la case que si elle existe, et afficher un message sinon.",
    code: {
      language: "java",
      code: `int[] t = new int[3];
int place = 3;
if (place {{1}} t.length) {
    System.out.println(t[place]);
} {{2}} {
    System.out.println("Cette case n'existe pas.");
}`,
    },
    blanks: ["<", "else"],
    distractors: ["<=", ">", "!="],
    simple:
      "Un tableau de 3 cases a les places 0, 1 et 2 : une place est valide si elle est **plus petite** que 3, la taille. On écrit donc `place < t.length`. Avec `<=`, la place 3 passerait le test et ça planterait quand même. Le `else` donne le plan B quand la place est trop grande.",
    explanation:
      "Les index valides vont de 0 à `t.length - 1`, donc la condition est `place < t.length`. `<=` accepterait `t.length`, qui n'existe pas. Le `else` affiche le message quand le test échoue, au lieu de laisser planter le programme.",
  },

  // ----- Leçon 5 -----
  {
    kind: "output",
    id: "bases-err-16",
    difficulty: 1,
    tags: ["try-catch", "exceptions"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `try {
    System.out.println("A");
    int x = 10 / 0;
    System.out.println("B");
} catch (ArithmeticException e) {
    System.out.println("C");
}
System.out.println("D");`,
    },
    choices: ["`A C D`", "`A B D`", "`A B C D`", "`A C`"],
    answer: 0,
    simple:
      "Java entre dans le `try` et affiche `A`. Puis `10 / 0` plante : le reste du `try` est abandonné, donc `B` n'apparaît jamais. Java saute au `catch`, qui affiche `C`. Ensuite le programme continue normalement après le `catch` : `D` s'affiche. Total : `A C D`.",
    explanation:
      "`A` est affiché, puis `10 / 0` lève `ArithmeticException`. Le reste du `try` (`B`) est abandonné, le `catch (ArithmeticException e)` correspond et affiche `C`. Après le bloc `try` / `catch`, l'exécution reprend : `D`. Le programme ne s'arrête pas puisque l'erreur a été rattrapée.",
  },
  {
    kind: "order",
    id: "bases-err-17",
    difficulty: 1,
    tags: ["try-catch", "methode"],
    prompt: "Une ligne du `try` plante. Remets dans l'ordre ce qui se passe ensuite.",
    items: [
      "Java exécute les lignes du `try` une par une",
      "Une ligne plante : le reste du `try` est abandonné",
      "Java saute au `catch` dont le nom correspond à l'erreur",
      "Le programme reprend après le `catch`",
    ],
    simple:
      "C'est le numéro d'acrobate. Il commence son numéro (le `try`). Il tombe : le reste du numéro est annulé. Le filet le rattrape (le `catch` qui correspond). Puis le spectacle continue avec le numéro suivant, après le `catch`.",
    explanation:
      "Le `try` s'exécute ligne par ligne jusqu'à la première erreur. À cet instant, le reste du bloc est sauté et Java cherche un `catch` dont le type correspond. Après son exécution, le programme reprend à la première ligne située après l'ensemble `try` / `catch`.",
  },
  {
    kind: "fill",
    id: "bases-err-18",
    difficulty: 2,
    tags: ["try-catch", "parseint"],
    prompt: "Complète pour rattraper l'erreur quand `saisie` n'est pas un nombre.",
    code: {
      language: "java",
      code: `String saisie = "abc";
{{1}} {
    int n = Integer.parseInt(saisie);
    System.out.println(n);
} {{2}} (NumberFormatException e) {
    System.out.println("Pas un nombre");
}`,
    },
    blanks: ["try", "catch"],
    distractors: ["except", "if", "else"],
    simple:
      "Le bloc qui contient la ligne risquée commence par `try` : « essaie ». Le plan B commence par `catch` : « rattrape », suivi du nom de l'erreur entre parenthèses. `except` existe dans d'autres langages comme Python, mais pas en Java.",
    explanation:
      "La structure est `try { ... } catch (TypeDeLErreur e) { ... }`. `except` est le mot de Python, `if` et `else` testent une condition mais ne rattrapent pas une exception.",
  },
  {
    kind: "recall",
    id: "bases-err-19",
    difficulty: 2,
    tags: ["try-catch", "exceptions"],
    prompt: "Explique ce que fait `try` / `catch`, et ce qui se passe ligne par ligne quand une erreur survient dans le `try`.",
    keyPoints: [
      "`try` contient les lignes risquées, `catch` le plan B",
      "À la première erreur, le reste du `try` est abandonné",
      "Java saute au `catch` dont le nom correspond",
      "Le programme continue ensuite après le `catch`",
    ],
    simple:
      "`try` veut dire « essaie » : on y met la ligne risquée. `catch` veut dire « rattrape » : c'est le plan B. Si la ligne plante, Java n'exécute pas la suite du `try`, il saute directement au `catch`, puis le programme continue normalement. Au lieu de s'arrêter, il a rebondi.",
    explanation:
      "`try` entoure les instructions qui peuvent échouer, `catch (Type e)` décrit la réponse pour ce type d'exception. À la première exception, le reste du `try` n'est pas exécuté : Java cherche le premier `catch` compatible, l'exécute, puis reprend après le bloc. Si aucun `catch` ne correspond, l'exception continue de remonter et le programme plante.",
  },

  // ----- Leçon 6 -----
  {
    kind: "output",
    id: "bases-err-20",
    difficulty: 2,
    tags: ["try-catch", "finally"],
    prompt: "On appelle `lire(\"5\", new int[]{10, 20})`. Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `static void lire(String texte, int[] t) {
    try {
        System.out.println("1");
        int n = Integer.parseInt(texte);
        System.out.println("2");
        System.out.println(t[n]);
        System.out.println("3");
    } catch (NumberFormatException e) {
        System.out.println("4");
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("5");
    } finally {
        System.out.println("6");
    }
    System.out.println("7");
}`,
    },
    choices: ["`1 2 5 6 7`", "`1 2 5 7`", "`1 2 3 6 7`", "`1 2 5 6`"],
    answer: 0,
    simple:
      "On affiche `1`. `parseInt(\"5\")` marche : n vaut 5. On affiche `2`. Puis `t[5]` plante : le tableau n'a que 2 cases. Le `3` est sauté. Le premier `catch` ne correspond pas, le second oui : `5`. Le `finally` passe toujours : `6`. L'erreur est rattrapée, donc le programme continue : `7`.",
    explanation:
      "`parseInt(\"5\")` réussit, donc ni `4` ni `NumberFormatException`. `t[5]` lève `ArrayIndexOutOfBoundsException` : `3` est sauté, le deuxième `catch` affiche `5`. Le `finally` s'exécute dans tous les cas (`6`). Comme l'erreur a été rattrapée, l'exécution reprend après le bloc : `7`.",
  },
  {
    kind: "spot",
    id: "bases-err-21",
    difficulty: 2,
    tags: ["try-catch", "ordre-des-catch"],
    prompt: "Java refuse de compiler cette méthode avec `exception NumberFormatException has already been caught`. Quelle ligne est fautive ?",
    code: {
      language: "java",
      code: `static void lire(String texte) {
    try {
        int n = Integer.parseInt(texte);
        System.out.println(n * 2);
    } catch (Exception e) {
        System.out.println("Problème");
    } catch (NumberFormatException e) {
        System.out.println("Pas un nombre");
    }
}`,
    },
    faultyLine: 7,
    reasons: [
      "`Exception` attrape déjà tout : ce `catch` plus précis n'est jamais atteint",
      "`NumberFormatException` s'écrit autrement : la classe n'existe pas",
      "On n'a pas le droit d'écrire deux `catch` à la suite",
      "Il manque un `finally` après le dernier `catch`",
    ],
    reasonAnswer: 0,
    simple:
      "Java lit les `catch` de haut en bas. `Exception` est le nom le plus large : il rattrape presque tout. Quand Java arrive au `catch` de la ligne 7, tout a déjà été rattrapé plus haut : cette ligne ne servirait jamais. Java le refuse. La solution : mettre le plus précis (`NumberFormatException`) en premier.",
    explanation:
      "`NumberFormatException` est un cas particulier d'`Exception`. Placé après, son `catch` est inatteignable, et le compilateur le refuse. Règle : du plus précis au plus large. Plusieurs `catch` sont permis, et `finally` est facultatif.",
  },
  {
    kind: "recall",
    id: "bases-err-22",
    difficulty: 2,
    tags: ["finally", "ordre-des-catch"],
    prompt: "À quoi sert `finally` ? Et pourquoi doit-on écrire les `catch` du plus précis au plus large ?",
    keyPoints: [
      "`finally` s'exécute toujours, erreur ou pas",
      "Il sert aux actions obligatoires (fermer, ranger)",
      "Java choisit le premier `catch` qui convient, de haut en bas",
      "Un `catch` large en premier cacherait les `catch` précis : refus à la compilation",
    ],
    simple:
      "`finally` est le bloc qu'on exécute quoi qu'il arrive, comme éteindre la lumière en sortant d'une pièce, qu'on ait trouvé ce qu'on cherchait ou non. Pour les `catch`, Java prend le premier qui convient. Si un `catch` très large passe en premier, il rattrape tout et les précis derrière ne servent à rien : on les met donc d'abord.",
    explanation:
      "`finally` s'exécute après le `try` et le `catch` éventuel, même en cas d'erreur ou de `return` : il sert aux actions qui doivent toujours avoir lieu. Les `catch` sont examinés dans l'ordre : le premier dont le type convient est choisi. Comme les exceptions forment des familles, un `catch (Exception e)` en premier rendrait les suivants inatteignables : le compilateur le refuse.",
  },

  // ----- Leçon 7 -----
  {
    kind: "fill",
    id: "bases-err-23",
    difficulty: 2,
    tags: ["throw", "illegal-argument"],
    prompt: "Complète pour refuser un âge négatif avec un message qui donne la valeur reçue.",
    code: {
      language: "java",
      code: `static void verifierAge(int age) {
    if (age < 0) {
        {{1}} new {{2}}("L'âge ne peut pas être négatif : " + age);
    }
}`,
    },
    blanks: ["throw", "IllegalArgumentException"],
    distractors: ["catch", "return", "NumberFormatException"],
    simple:
      "Pour lancer une erreur soi-même, on écrit `throw` (« jeter »), puis `new` pour fabriquer l'erreur. Le nom qui convient pour « la valeur reçue est refusée » est `IllegalArgumentException`. `catch` sert à rattraper une erreur, pas à en lancer, et `NumberFormatException` est réservée aux textes qui ne sont pas des nombres.",
    explanation:
      "`throw new IllegalArgumentException(message)` lance une exception pour un argument refusé. `catch` rattrape. `return` termine normalement la méthode sans signaler d'erreur. `NumberFormatException` existe mais décrit un texte mal formé, pas un âge négatif.",
  },
  {
    kind: "mcq",
    id: "bases-err-24",
    difficulty: 2,
    tags: ["throw", "illegal-argument"],
    prompt: "Une méthode `setAge(int age)` reçoit `-5`. Que doit-elle faire de mieux ?",
    choices: [
      "Lancer `throw new IllegalArgumentException(...)` avec la valeur reçue",
      "Ranger `-5` quand même : c'est bien un `int` valide",
      "Afficher « erreur » et continuer comme si de rien n'était",
      "Remplacer `-5` par 0 sans rien dire à personne",
    ],
    answer: 0,
    simple:
      "Ranger -5 ou le remplacer en cachette, c'est laisser un âge absurde se promener dans le programme. Afficher « erreur » ne l'arrête pas non plus. Le mieux est de refuser tout de suite et bruyamment, avec un message qui dit quelle valeur a été reçue : on voit alors le problème là où il commence.",
    explanation:
      "Java ne peut pas savoir qu'un âge négatif est absurde : c'est à la méthode de le refuser. Lancer `IllegalArgumentException` avec un message précis arrête le traitement immédiatement et signale la ligne exacte. Les autres choix laissent une mauvaise valeur traverser le programme, ou masquent le problème.",
  },
  {
    kind: "recall",
    id: "bases-err-25",
    difficulty: 3,
    tags: ["throw", "illegal-argument"],
    prompt: "Écris, en pseudo-code ou en Java, le début d'une méthode `setAge(int age)` qui refuse un âge négatif ou supérieur à 150. Quel message mets-tu, et pourquoi ?",
    keyPoints: [
      "Un `if` qui teste `age < 0 || age > 150` au début",
      "`throw new IllegalArgumentException(...)`",
      "Un message qui donne la valeur reçue et ce qui est attendu",
      "La vérification se fait avant d'utiliser la valeur",
    ],
    simple:
      "On vérifie au tout début de la méthode : si l'âge est négatif ou trop grand, on lance une erreur avec `throw new IllegalArgumentException(...)`. Le message dit ce qui ne va pas et donne la valeur reçue, par exemple « Âge invalide : 200 (attendu entre 0 et 150) ». Celui qui lira la trace saura tout de suite quoi corriger.",
    explanation:
      "Exemple : `if (age < 0 || age > 150) { throw new IllegalArgumentException(\"Âge invalide : \" + age + \" (attendu entre 0 et 150)\"); }` puis seulement `this.age = age;`. On refuse tôt, avant que la valeur n'entre dans l'objet. Le message inclut la valeur et la règle : la trace donnera ainsi la ligne du `throw` et la cause.",
  },

  // ----- Leçon 8 -----
  {
    kind: "spot",
    id: "bases-err-26",
    difficulty: 2,
    tags: ["bonnes-pratiques", "try-catch"],
    prompt: "Ce code compile et ne plante jamais, mais il contient une très mauvaise habitude. Quelle ligne la contient ?",
    code: {
      language: "java",
      code: `String saisie = "abc";
try {
    int age = Integer.parseInt(saisie);
    enregistrer(age);
} catch (NumberFormatException e) {
}
System.out.println("Terminé");`,
    },
    faultyLine: 5,
    reasons: [
      "Le `catch` est vide : l'erreur est avalée et personne ne saura que la saisie était fausse",
      "`enregistrer(age)` ne doit pas se trouver dans un `try`",
      "La variable `saisie` doit être créée à l'intérieur du `try`",
      "Il faut `catch (Exception e)` pour attraper aussi `enregistrer`",
    ],
    reasonAnswer: 0,
    simple:
      "Le `catch` de la ligne 5 rattrape l'erreur, mais ne fait rien : il avale l'erreur. Le programme affiche « Terminé » comme si tout s'était bien passé, alors que la saisie « abc » n'a jamais été enregistrée. Personne n'est prévenu. C'est comme débrancher le voyant rouge d'une voiture en panne.",
    explanation:
      "Un `catch` vide cache l'erreur : plus d'exception, plus de trace, plus de message. Le bug devient invisible. Il faut au minimum afficher un message utile, ou ne pas attraper l'erreur. Le `try`, la variable `saisie` et le type `NumberFormatException` sont ici corrects.",
  },
  {
    kind: "mcq",
    id: "bases-err-27",
    difficulty: 2,
    tags: ["bonnes-pratiques", "try-catch"],
    prompt: "Quel `catch` est le mieux écrit pour traiter une saisie qui devait être un nombre ?",
    choices: [
      "`catch (NumberFormatException e) { System.out.println(\"Pas un nombre : \" + saisie); }`",
      "`catch (Exception e) { }`",
      "`catch (Exception e) { System.out.println(\"Une erreur est survenue.\"); }`",
      "`catch (NumberFormatException e) { }`",
    ],
    answer: 0,
    simple:
      "Un bon `catch` fait deux choses : il annonce le type précis d'erreur attendu, et il fait quelque chose d'utile, comme afficher un message qui dit quelle saisie pose problème. Les deux `catch` vides avalent l'erreur. Celui qui affiche « Une erreur est survenue » est trop large et trop vague.",
    explanation:
      "Le premier choix cumule les trois bonnes habitudes : type précis, pas de `catch` vide, message utile qui donne la valeur. `catch (Exception e)` est trop large et peut cacher un vrai bug. Un bloc vide avale l'erreur. Un message générique ne dit ni quoi, ni où.",
  },
  {
    kind: "recall",
    id: "bases-err-28",
    difficulty: 3,
    tags: ["bonnes-pratiques", "try-catch"],
    prompt: "Cite trois mauvaises habitudes avec `catch`, dis ce qui est dangereux dans chacune et ce qu'on fait à la place.",
    keyPoints: [
      "`catch` vide : l'erreur est avalée, on fait un message utile à la place",
      "Message vague (« Erreur ») : on indique quoi et quelle valeur",
      "`catch (Exception e)` trop large : on annonce le type précis",
      "Si on ne sait pas quoi faire, on laisse l'erreur remonter",
    ],
    simple:
      "Un `catch` vide fait disparaître l'erreur : on ne sait plus que quelque chose a cassé. On met un message qui dit quoi et avec quelle valeur. Un `catch` trop large, comme `Exception`, cache des bugs auxquels on ne pensait pas : on annonce le type précis. Et si on ne sait pas quoi faire de l'erreur, mieux vaut ne pas l'attraper.",
    explanation:
      "Trois pièges : avaler une erreur (catch vide), rattraper avec un message sans information, attraper `Exception` quand on attend un type précis. Les remèdes : réagir ou journaliser avec un message précis (valeur, attente), nommer le type d'erreur prévu, et laisser remonter ce qu'on ne sait pas traiter, pour que la trace de pile guide la correction.",
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
  id: "bases-erreurs",
  format: "doux",
  title: "Comprendre et gérer les erreurs",
  objective:
    "Savoir lire un message d'erreur Java, reconnaître les erreurs courantes, et les gérer avec try / catch.",
  prerequisites: ["bases-collections"],
  units: [
    l1, ...pick("bases-err-01", "bases-err-02", "bases-err-03"),
    l2, ...pick("bases-err-04", "bases-err-05", "bases-err-06", "bases-err-07"),
    l3, ...pick("bases-err-08", "bases-err-09", "bases-err-10", "bases-err-11"),
    l4, ...pick("bases-err-12", "bases-err-13", "bases-err-14", "bases-err-15"),
    l5, ...pick("bases-err-16", "bases-err-17", "bases-err-18", "bases-err-19"),
    l6, ...pick("bases-err-20", "bases-err-21", "bases-err-22"),
    l7, ...pick("bases-err-23", "bases-err-24", "bases-err-25"),
    l8, ...pick("bases-err-26", "bases-err-27", "bases-err-28"),
  ],
};
