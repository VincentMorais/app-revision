/**
 * Fondations — Tableaux, listes et dictionnaires : ranger plusieurs valeurs
 * (tableau, ArrayList, HashSet, HashMap), les parcourir, choisir le bon
 * rangement, compter avec une Map. 9 leçons, 28 exercices, format doux.
 *
 * Image gardée tout le chapitre : une rangée de cases numérotées à partir de 0
 * (tableau, liste) ; un sac sans doublon (ensemble) ; un annuaire clé → valeur
 * (dictionnaire). Chaque exercice est précédé de la leçon qui l'enseigne.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Une rangée de cases numérotées
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "bases-col-l1",
  title: "Une rangée de cases numérotées",
  blocks: [
    {
      kind: "text",
      text: "Tu veux garder les notes de cinq élèves. Avec ce que tu sais déjà, tu crées une variable par note : une **case** étiquetée pour chacune. Pour cinq notes, ça va encore. Mais pour trente ? Pour cent ? Et si le nombre d'élèves change d'une classe à l'autre ? Tu ne vas pas écrire cent variables à la main, ni inventer cent noms différents.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une variable par note : ça ne passe pas à l'échelle.",
      code: `int note1 = 12;
int note2 = 15;
int note3 = 9;
int note4 = 18;
int note5 = 11;
int somme = note1 + note2 + note3 + note4 + note5;   // et avec 100 notes ?`,
    },
    {
      kind: "text",
      text: "Il nous faut un moyen de dire « toutes ces notes, ensemble, sous un seul nom ». En Java, on appelle ça une **collection** : un objet qui range plusieurs valeurs. Dans ce chapitre, tu en découvres quatre : le tableau, la liste, l'ensemble et le dictionnaire. On commence par l'image la plus simple, celle qui sert de base aux autres : une **rangée de cases**, comme les casiers d'un vestiaire.",
    },
    {
      kind: "text",
      text: "Chaque case de la rangée porte un **numéro**, qu'on appelle l'**indice**. Et voici le point le plus important du chapitre : **on compte à partir de 0**. La première case a le numéro 0, la deuxième le numéro 1, la troisième le numéro 2, et ainsi de suite. Le numéro n'est pas un rang : c'est le nombre de cases qu'on saute depuis le début. Pour atteindre la première, on ne saute rien, donc 0.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Une rangée de cinq cases : les numéros vont de 0 à 4.",
      code: `numéro   :    0      1      2      3      4
           +------+------+------+------+------+
prénoms  : | Ana  | Bob  | Cléo | Dan  | Eva  |
           +------+------+------+------+------+

la case numéro 2 contient Cléo
la case numéro 0 contient Ana (la première)`,
    },
    {
      kind: "comparison",
      title: "Plusieurs variables ou une rangée ?",
      left: {
        label: "Une variable par valeur",
        text: "Il faut inventer un nom par valeur : `note1`, `note2`... Impossible quand on ne sait pas à l'avance combien il y en aura.",
      },
      right: {
        label: "Une rangée de cases",
        text: "Un seul nom pour toute la rangée, et un numéro pour désigner la case voulue. Dix valeurs ou dix mille : même écriture.",
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : la première case porte le numéro 0",
      text: "Dans la vie, on dit « la première place ». En Java, la première case a le numéro 0. Une rangée de 5 cases a les numéros 0, 1, 2, 3 et 4 : il n'y a pas de case numéro 5. Garde ça en tête, on y revient dès la leçon 3.",
    },
    {
      kind: "text",
      text: "En une phrase : une rangée de n cases a les numéros de 0 à n - 1. Dans la suite, tu verras le **tableau** (une rangée dont la taille ne bouge pas), puis la **liste** (la même image, mais qui peut grandir), puis deux cousins qui n'ont pas de numéros : l'**ensemble** et le **dictionnaire**.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — Le tableau : créer, lire et écrire
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "bases-col-l2",
  title: "Le tableau : créer, lire et écrire une case",
  blocks: [
    {
      kind: "text",
      text: "La rangée de cases numérotées a un nom en Java : le **tableau**. Pour le créer quand tu connais déjà les valeurs, tu les écris entre accolades, séparées par des virgules. Le type s'écrit avec des crochets : `int[]` veut dire « une rangée de `int` ». Ici, `notes` est un tableau de trois cases, rempli dès le départ.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Créer un tableau avec ses valeurs.",
      code: `int[] notes = {12, 15, 9};
//  numéro de la case :  0    1   2
//  contenu           : 12   15   9`,
    },
    {
      kind: "text",
      text: "Pour **lire** une case, on écrit le nom du tableau puis le numéro entre crochets : `notes[1]`. Pour **écrire** dans une case, on met la même chose à gauche du signe `=` : `notes[1] = 14;`. Suis le code ci-dessous ligne par ligne : à droite d'un `=` on lit, à gauche on écrit. L'ancienne valeur de la case est remplacée, elle disparaît.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Lire à droite du signe égal, écrire à gauche.",
      code: `int[] notes = {12, 15, 9};
System.out.println(notes[0]);        // lit la case 0 : affiche 12
notes[1] = 14;                       // écrit 14 dans la case 1 (le 15 disparaît)
notes[2] = notes[0] + notes[1];      // lit 12 et 14, écrit 26 dans la case 2
System.out.println(notes[2]);        // affiche 26
// le tableau vaut maintenant {12, 14, 26}`,
    },
    {
      kind: "text",
      text: "Pour connaître le nombre de cases, on écrit `notes.length`. Attention : **pas de parenthèses** après `length`. Et un tableau a une **taille fixe** : elle est choisie à la création et ne change plus jamais. Un tableau de 3 cases restera un tableau de 3 cases, il n'existe aucun moyen d'en ajouter une quatrième.",
    },
    {
      kind: "text",
      text: "Quand tu ne connais pas encore les valeurs mais que tu connais la taille, tu écris `new int[4]`. Java construit quatre cases et les remplit toutes d'une valeur neutre : `0` pour des `int`, `false` pour des `boolean`, et `null` pour des textes (`String`), la flèche qui ne mène nulle part. Tu remplis ensuite les cases une à une.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Créer un tableau vide d'une taille donnée.",
      code: `int[] points = new int[4];            // quatre cases : 0, 0, 0, 0
points[2] = 7;                        // 0, 0, 7, 0
System.out.println(points.length);    // affiche 4

String[] noms = new String[2];        // deux cases : null, null`,
    },
    {
      kind: "comparison",
      title: "Deux façons de créer",
      left: {
        label: "{12, 15, 9}",
        text: "Tu connais les valeurs : tu les écris. Java compte les cases lui-même.",
        code: { language: "java", code: "int[] t = {12, 15, 9};" },
      },
      right: {
        label: "new int[3]",
        text: "Tu connais seulement la taille : toutes les cases valent 0 au départ.",
        code: { language: "java", code: "int[] t = new int[3];" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : length sans parenthèses, taille qui ne bouge pas",
      text: "Écris `notes.length` et non `notes.length()` : cette deuxième forme ne compile pas pour un tableau. Et ne cherche pas à « ajouter une case » à un tableau : sa taille ne change jamais. Pour une taille qui bouge, il y a la liste, plus loin dans ce chapitre.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — L'indice hors limites
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "bases-col-l3",
  title: "L'erreur classique : l'indice hors limites",
  blocks: [
    {
      kind: "text",
      text: "Un tableau de 3 cases a les numéros 0, 1 et 2. Que se passe-t-il si tu demandes la case numéro 3 ? Elle n'existe pas. Java ne devine pas ce que tu voulais : il **arrête le programme**, on dit qu'il « plante », et il affiche un message d'erreur. C'est l'erreur la plus classique avec les tableaux : l'**indice hors limites**.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La dernière ligne demande une case qui n'existe pas.",
      code: `int[] t = {5, 6, 7};
System.out.println(t[2]);   // affiche 7 : la case 2 existe
System.out.println(t[3]);   // le programme plante ici`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Le message que Java affiche.",
      code: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`,
    },
    {
      kind: "text",
      text: "Lis le message comme du français : « numéro 3 hors des limites pour une taille de 3 ». Il te donne le numéro demandé (`Index 3`) et la taille du tableau (`length 3`). Le nom en entier, `ArrayIndexOutOfBoundsException`, veut simplement dire « erreur : numéro de case de tableau hors limites ». Le programme s'arrête à la ligne fautive : les lignes suivantes ne s'exécutent jamais.",
    },
    {
      kind: "text",
      text: "La règle : avec n cases, les numéros valides vont de **0 à n - 1**. Le **dernier numéro** est donc `t.length - 1`, jamais `t.length`. Pour lire la dernière case sans compter à la main, on écrit `t[t.length - 1]`. Un numéro négatif, comme `t[-1]`, plante aussi : en Java, il ne veut pas dire « la dernière case ».",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même exemple, corrigé.",
      code: `int[] t = {5, 6, 7};
// t.length vaut 3, donc t.length - 1 vaut 2
int dernier = t[t.length - 1];   // lit la case 2
System.out.println(dernier);     // affiche 7`,
    },
    {
      kind: "comparison",
      title: "Quel numéro pour la dernière case ?",
      left: {
        label: "t[t.length]",
        text: "Demande la case numéro 3 pour un tableau de 3 cases : elle n'existe pas, **le programme plante**.",
        code: { language: "java", code: "int x = t[t.length];" },
      },
      right: {
        label: "t[t.length - 1]",
        text: "Demande la case numéro 2 : c'est bien **la dernière**.",
        code: { language: "java", code: "int x = t[t.length - 1];" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : confondre la taille et le dernier numéro",
      text: "Taille 3, numéros 0, 1, 2. La taille et le dernier numéro diffèrent toujours de 1. Quand le message dit « Index n out of bounds for length n », c'est presque toujours ce décalage d'une case. Le message est ton ami : il te dit où chercher.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — Parcourir un tableau : for avec indice ou for-each
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "bases-col-l4",
  title: "Parcourir : for avec indice ou for-each",
  blocks: [
    {
      kind: "text",
      text: "Souvent, on veut faire quelque chose avec **chaque** case : tout additionner, tout afficher. Écrire `t[0]`, `t[1]`, `t[2]`... à la main est impossible pour cent cases. Tu connais déjà la boucle `for` : on lui donne un compteur `i` qui prend tour à tour tous les numéros de cases. C'est la **boucle avec indice**.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Additionner toutes les cases avec un indice.",
      code: `int[] t = {3, 5, 7};
int somme = 0;
for (int i = 0; i < t.length; i++) {
    somme = somme + t[i];
}
System.out.println(somme);   // 15`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Les valeurs, tour par tour.",
      code: `tour 1 : i = 0, t[i] = 3, somme = 0 + 3 = 3
tour 2 : i = 1, t[i] = 5, somme = 3 + 5 = 8
tour 3 : i = 2, t[i] = 7, somme = 8 + 7 = 15
i vaut 3 : 3 < 3 est faux, la boucle s'arrête`,
    },
    {
      kind: "text",
      text: "Regarde la condition : `i < t.length`, avec `<` et non `<=`. Le compteur démarre à 0 et s'arrête à `t.length - 1`, exactement les numéros qui existent. Avec `<=`, le dernier tour demanderait `t[3]` pour un tableau de 3 cases : indice hors limites, le programme plante. Retiens la formule : **`i < t.length`**.",
    },
    {
      kind: "text",
      text: "Quand tu n'as pas besoin du numéro, il existe une boucle plus courte : le **for-each** (« pour chaque »). On lit : « pour chaque `x` dans `t` ». À chaque tour, `x` reçoit la valeur de la case suivante, dans l'ordre. Pas de compteur, donc pas de limite à surveiller : impossible de sortir du tableau.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La même somme avec un for-each.",
      code: `int[] t = {3, 5, 7};
int somme = 0;
for (int x : t) {          // tour 1 : x = 3, tour 2 : x = 5, tour 3 : x = 7
    somme = somme + x;
}
System.out.println(somme);   // 15`,
    },
    {
      kind: "text",
      text: "Mais attention : `x` n'est qu'une **photocopie** de la valeur, pas la case elle-même. Si tu écris `x = x * 10`, tu modifies la photocopie, et le tableau ne bouge pas. Pour changer les vraies cases, il te faut leur numéro : c'est la boucle avec indice.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Photocopie ou vraie case ?",
      code: `int[] t = {1, 2, 3};
for (int x : t) {
    x = x * 10;              // change la photocopie seulement
}
// t vaut toujours {1, 2, 3}

for (int i = 0; i < t.length; i++) {
    t[i] = t[i] * 10;        // change la vraie case
}
// t vaut maintenant {10, 20, 30}`,
    },
    {
      kind: "comparison",
      title: "for avec indice ou for-each ?",
      left: {
        label: "for (int i = 0; ...)",
        text: "Tu as le numéro `i` : tu peux lire **et écrire** les cases, ou ne parcourir qu'une partie du tableau.",
        code: { language: "java", code: "for (int i = 0; i < t.length; i++)" },
      },
      right: {
        label: "for (int x : t)",
        text: "Tu as seulement la valeur `x`. Plus court, aucun risque de dépasser. Pour **lire**, pas pour modifier.",
        code: { language: "java", code: "for (int x : t)" },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Comment choisir",
      text: "Tu veux seulement lire les valeurs (additionner, afficher, chercher) ? Prends le for-each. Tu as besoin du numéro, ou tu veux changer le contenu des cases ? Prends le `for` avec indice.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — La liste ArrayList
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "bases-col-l5",
  title: "La liste ArrayList : une rangée qui change de taille",
  blocks: [
    {
      kind: "text",
      text: "Le tableau a un gros défaut : sa taille est fixée à la création. Pour une liste de courses où tu ajoutes des articles au fil de la journée, tu ne peux pas savoir à l'avance combien de cases il faudra. Java propose la **liste** : une rangée de cases numérotées à partir de 0, comme le tableau, mais qui **grandit et rétrécit toute seule**. La plus utilisée s'appelle `ArrayList`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Créer une liste, y ajouter des textes, lire.",
      code: `import java.util.ArrayList;
import java.util.List;

List<String> courses = new ArrayList<>();   // une liste vide
courses.add("pain");                        // ["pain"]
courses.add("lait");                        // ["pain", "lait"]
System.out.println(courses.get(0));         // affiche pain
System.out.println(courses.size());         // affiche 2`,
    },
    {
      kind: "text",
      text: "Décortiquons la ligne de création. À gauche, `List<String>` est le type de la variable. À droite, `new ArrayList<>()` construit une liste vide. Ce qu'il y a entre `<` et `>` dit **ce qu'on range dedans** : ici des textes. Pour des nombres entiers, on écrit `List<Integer>` (c'est simplement le nom que Java demande dans ce cas, tu n'as rien d'autre à savoir pour l'instant). Les deux lignes `import` disent à Java où trouver `List` et `ArrayList`.",
    },
    {
      kind: "text",
      text: "Les gestes de base : `add(x)` ajoute à la fin, `get(i)` lit la case numéro `i`, `size()` donne le nombre d'éléments, `remove(...)` en enlève un. On peut enlever par **numéro** (`remove(0)`) ou par **valeur** (`remove(\"c\")`). Quand un élément part, les suivants **se décalent** pour boucher le trou. Et `System.out.println(liste)` affiche tout le contenu entre crochets.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Enlever des éléments : les autres se décalent.",
      code: `List<String> l = new ArrayList<>();
l.add("a");
l.add("b");
l.add("c");                  // [a, b, c]
l.remove(0);                 // le numéro 0 part : [b, c]
l.remove("c");               // la valeur "c" part : [b]
System.out.println(l);       // affiche [b]
System.out.println(l.get(0)); // affiche b : "b" est maintenant la case 0`,
    },
    {
      kind: "text",
      text: "Le for-each marche aussi sur une liste : `for (String c : courses)`. Et comme pour le tableau, un numéro qui n'existe pas fait planter le programme : `courses.get(5)` sur une liste de 2 éléments donne « Index 5 out of bounds for length 2 ». Le dernier numéro valide est toujours `size() - 1`.",
    },
    {
      kind: "comparison",
      title: "Tableau ou liste ?",
      left: {
        label: "Tableau",
        text: "Taille **fixe**. On lit avec `t[i]`, on écrit avec `t[i] = ...`, on compte avec `t.length`.",
        code: { language: "java", code: "int[] t = new int[3];\nt[0] = 5;\nint n = t.length;" },
      },
      right: {
        label: "Liste",
        text: "Taille **variable**. On ajoute avec `add`, on lit avec `get(i)`, on compte avec `size()`.",
        code: { language: "java", code: "List<Integer> l = new ArrayList<>();\nl.add(5);\nint n = l.size();" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : length ou size() ?",
      text: "Tableau : `t.length` sans parenthèses et `t[0]`. Liste : `l.size()` avec parenthèses et `l.get(0)`. Écrire `l.length` ou `l[0]` sur une liste ne compile pas, et `t.size()` sur un tableau non plus. Chaque rangement a ses propres mots.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — L'ensemble HashSet
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "bases-col-l6",
  title: "L'ensemble HashSet : jamais de doublon",
  blocks: [
    {
      kind: "text",
      text: "Tu notes les invités à une soirée dans une liste. Par erreur, tu écris deux fois « Ana » : la liste accepte, elle range tout ce qu'on lui donne. Or parfois on ne veut **jamais deux fois la même chose** : une adresse e-mail, un pseudo, une inscription. Pour ça, Java propose l'**ensemble**, `HashSet`. Pense à un **sac** : chaque chose n'y entre qu'une fois.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La liste accepte les doublons : Ana est comptée deux fois.",
      code: `List<String> invites = new ArrayList<>();
invites.add("Ana");
invites.add("Bob");
invites.add("Ana");
System.out.println(invites.size());   // affiche 3`,
    },
    {
      kind: "text",
      text: "Avec un ensemble, on écrit presque la même chose, mais le sac refuse de prendre un deuxième « Ana » : rien ne change. Les gestes : `add(x)` pour ajouter, `contains(x)` pour demander « est-ce dedans ? » (la réponse est `true` ou `false`), `remove(x)` pour enlever, `size()` pour compter.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le sac refuse le doublon.",
      code: `import java.util.HashSet;
import java.util.Set;

Set<String> invites = new HashSet<>();
invites.add("Ana");
invites.add("Bob");
invites.add("Ana");                              // déjà dans le sac : rien ne change
System.out.println(invites.size());              // affiche 2
System.out.println(invites.contains("Bob"));     // affiche true
System.out.println(invites.contains("Zoé"));     // affiche false`,
    },
    {
      kind: "text",
      text: "Un sac n'a **pas de cases numérotées**. Donc pas de `get(0)` : « le premier » n'a pas de sens. Et **aucun ordre n'est garanti** : si tu le parcours avec un for-each, les éléments peuvent sortir dans un autre ordre que celui où tu les as ajoutés, et tu ne dois jamais compter dessus. Si l'ordre ou les numéros comptent, prends une liste.",
    },
    {
      kind: "text",
      text: "Astuce très utile : enlever les doublons d'une liste. On verse la liste dans un ensemble en la donnant à la création : `new HashSet<>(liste)`. Le sac ne garde qu'un exemplaire de chaque valeur. La taille de l'ensemble donne alors le nombre de valeurs **différentes**.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Verser une liste dans un ensemble.",
      code: `List<String> villes = new ArrayList<>();
villes.add("Paris");
villes.add("Lyon");
villes.add("Paris");
villes.add("Nice");
villes.add("Lyon");                                   // 5 éléments dans la liste
Set<String> differentes = new HashSet<>(villes);      // le sac garde un exemplaire de chaque
System.out.println(villes.size() + " " + differentes.size());   // affiche 5 3`,
    },
    {
      kind: "comparison",
      title: "Liste ou ensemble ?",
      left: {
        label: "Liste (ArrayList)",
        text: "Des numéros, un ordre, des doublons acceptés. On peut lire avec `get(i)`.",
        code: { language: "java", code: "List<String> l = new ArrayList<>();" },
      },
      right: {
        label: "Ensemble (HashSet)",
        text: "Pas de numéros, pas d'ordre garanti, jamais de doublon. On demande `contains(x)`.",
        code: { language: "java", code: "Set<String> s = new HashSet<>();" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : pas de get, pas d'ordre",
      text: "`s.get(0)` ne compile pas sur un ensemble : il n'y a pas de numéros. Et deux textes sont « les mêmes » seulement s'ils s'écrivent exactement pareil : `\"Ana\"` et `\"ana\"` sont deux éléments différents.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 7 — Le dictionnaire HashMap
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "bases-col-l7",
  title: "Le dictionnaire HashMap : des paires clé et valeur",
  blocks: [
    {
      kind: "text",
      text: "Tu veux retrouver l'âge de quelqu'un à partir de son prénom. Avec une liste, tu parcourrais les prénoms un par un. Il est bien plus simple de chercher **directement** par le prénom, comme dans un annuaire : tu cherches un nom, tu trouves un numéro. En Java, c'est le **dictionnaire**, `HashMap`. Il range des **paires** : une **clé** (ce qu'on cherche) associée à une **valeur** (ce qu'on trouve).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ajouter des paires, puis chercher par la clé.",
      code: `import java.util.HashMap;
import java.util.Map;

Map<String, Integer> ages = new HashMap<>();
ages.put("Ana", 30);                    // paire : Ana -> 30
ages.put("Bob", 25);                    // paire : Bob -> 25
System.out.println(ages.get("Ana"));    // affiche 30
System.out.println(ages.size());        // affiche 2 : deux paires`,
    },
    {
      kind: "text",
      text: "Entre `<` et `>`, il y a maintenant **deux** types : celui de la clé, puis celui de la valeur. `Map<String, Integer>` veut dire « clés textes, valeurs entières ». Les gestes : `put(clé, valeur)` ajoute une paire, `get(clé)` donne la valeur, `containsKey(clé)` demande « cette clé existe-t-elle ? », `size()` compte les paires.",
    },
    {
      kind: "text",
      text: "Chaque clé est **unique**. Si tu fais `put` avec une clé qui existe déjà, la nouvelle valeur **remplace** l'ancienne : il n'y a toujours qu'une seule paire pour cette clé. Les valeurs, elles, peuvent se répéter : deux personnes peuvent avoir le même âge.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Même clé : la valeur est remplacée.",
      code: `ages.put("Ana", 31);                          // Ana existe déjà : 30 devient 31
System.out.println(ages.get("Ana"));          // affiche 31
System.out.println(ages.size());              // affiche 2 : toujours deux paires
System.out.println(ages.containsKey("Zoé"));  // affiche false`,
    },
    {
      kind: "text",
      text: "Que répond `get` quand la clé n'existe pas ? Il répond `null`, la flèche qui ne mène nulle part. C'est là que ça se gâte : si tu appelles ensuite une méthode sur ce `null`, le programme plante. Avant d'utiliser le résultat, vérifie avec `containsKey`, ou teste `!= null`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Clé absente : get renvoie null.",
      code: `Map<String, String> capitales = new HashMap<>();
capitales.put("France", "Paris");

System.out.println(capitales.get("Chine"));            // affiche null
// System.out.println(capitales.get("Chine").length()); // planterait : length() sur null

String c = capitales.get("Chine");
if (c != null) {                                       // on vérifie avant d'utiliser
    System.out.println(c.length());
}`,
    },
    {
      kind: "comparison",
      title: "Liste ou dictionnaire ?",
      left: {
        label: "Liste",
        text: "On cherche par **numéro** : « donne-moi la case 2 ».",
        code: { language: "java", code: "String s = prenoms.get(2);" },
      },
      right: {
        label: "Dictionnaire",
        text: "On cherche par **clé** : « donne-moi ce qui va avec Ana ». Une clé = une seule valeur.",
        code: { language: "java", code: "String tel = telephones.get(\"Ana\");" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : clé absente = null",
      text: "Demander une clé qui n'existe pas ne plante pas tout de suite : `get` répond `null`. Le plantage arrive plus loin, quand tu utilises ce `null`. Comme l'ensemble, un dictionnaire ne garantit aucun ordre.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 8 — Choisir : liste, ensemble ou dictionnaire
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "bases-col-l8",
  title: "Choisir : liste, ensemble ou dictionnaire ?",
  blocks: [
    {
      kind: "text",
      text: "Tu connais maintenant quatre façons de ranger des valeurs. Reste la vraie question, celle qu'on te posera en entretien : **laquelle choisir ?** On ne choisit pas au hasard. On se demande quelle **question** on posera le plus souvent à ses données : « donne-moi la case numéro i », « est-ce déjà dedans ? » ou « que vaut cette clé ? ».",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le tableau de décision : un besoin, un choix.",
      code: `Mon besoin                                       Mon choix
-----------------------------------------------  ---------------------------
Retrouver une valeur à partir d'une clé          dictionnaire (HashMap)
Jamais de doublon, tester « est-ce dedans ? »    ensemble (HashSet)
Garder l'ordre, accepter les doublons            liste (ArrayList)
Nombre de cases connu et qui ne bouge jamais     tableau`,
    },
    {
      kind: "text",
      text: "Lis le tableau de haut en bas, la première ligne qui correspond l'emporte. Si tu cherches par un nom ou un identifiant : dictionnaire. Si tu veux seulement savoir si une chose est présente, sans doublon : ensemble. Si l'ordre ou les numéros comptent, ou si les doublons sont normaux : liste. Si tu sais exactement combien de cases il faut, une fois pour toutes : tableau.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Quatre besoins, quatre choix.",
      code: `// Les notes d'une classe, dans l'ordre de passage (deux élèves peuvent avoir 12) :
List<Integer> notes = new ArrayList<>();

// Les adresses e-mail déjà inscrites, sans doublon :
Set<String> emails = new HashSet<>();

// Le numéro de téléphone de chaque prénom :
Map<String, String> telephones = new HashMap<>();

// Les 7 jours de la semaine, un nombre qui ne bougera jamais :
String[] jours = new String[7];`,
    },
    {
      kind: "text",
      text: "Deux confusions fréquentes. **Liste ou ensemble** : si tu as besoin du troisième élément, c'est une liste, l'ensemble n'a pas de numéros. **Ensemble ou dictionnaire** : l'ensemble range des valeurs seules (« Ana est-elle là ? »), le dictionnaire range des paires (« quel âge a Ana ? »). Si tu n'as aucune valeur à associer, l'ensemble suffit.",
    },
    {
      kind: "comparison",
      title: "Ensemble ou dictionnaire ?",
      left: {
        label: "Ensemble",
        text: "Des valeurs seules. Question posée : **« est-ce dedans ? »**",
        code: { language: "java", code: "pseudos.contains(\"ana\")" },
      },
      right: {
        label: "Dictionnaire",
        text: "Des paires clé et valeur. Question posée : **« que vaut cette clé ? »**",
        code: { language: "java", code: "ages.get(\"ana\")" },
      },
    },
    {
      kind: "callout",
      tone: "info",
      title: "Pourquoi pas une liste pour tout ?",
      text: "Une liste sait tout faire, mais pour savoir si une valeur est dedans, elle regarde les cases une par une. Sur un million d'éléments, c'est long. L'ensemble et le dictionnaire retrouvent une valeur directement, sans tout parcourir. C'est la bonne raison de les choisir.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 9 — Compter les occurrences avec un dictionnaire
// ---------------------------------------------------------------------------

const l9: Lesson = {
  kind: "lesson",
  id: "bases-col-l9",
  title: "Compter les occurrences avec un dictionnaire",
  blocks: [
    {
      kind: "text",
      text: "Voici un besoin très courant : compter **combien de fois** chaque mot apparaît. Par exemple, les fruits d'un panier : pomme, poire, pomme, kiwi, pomme. Un dictionnaire convient parfaitement : la **clé** est le fruit, la **valeur** est le nombre de fois où on l'a vu. Pour chaque fruit rencontré, on ajoute 1 à son compteur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Première idée : elle plante dès le premier fruit.",
      code: `Map<String, Integer> compteur = new HashMap<>();
String fruit = "pomme";
compteur.put(fruit, compteur.get(fruit) + 1);   // plante : get renvoie null`,
    },
    {
      kind: "text",
      text: "Pourquoi ça plante ? La première fois qu'on voit « pomme », elle n'est pas encore dans le dictionnaire : `get` répond `null`, et on ne peut pas ajouter 1 à « rien ». Il nous faut un compteur qui vaut **0** quand le fruit n'a jamais été vu. C'est exactement le rôle de `getOrDefault(clé, 0)` : il donne la valeur de la clé, ou **0 si la clé n'existe pas**.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La recette en trois temps : lire (avec 0 par défaut), ajouter 1, réécrire.",
      code: `String[] panier = {"pomme", "poire", "pomme", "kiwi", "pomme"};
Map<String, Integer> compteur = new HashMap<>();

for (String fruit : panier) {
    compteur.put(fruit, compteur.getOrDefault(fruit, 0) + 1);
}

System.out.println(compteur.get("pomme"));   // affiche 3
System.out.println(compteur.get("poire"));   // affiche 1
System.out.println(compteur.size());         // affiche 3 : trois fruits différents`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Le compteur, fruit après fruit.",
      code: `fruit    compteur avant       compteur après
pomme    0 (pas encore vue)   1
poire    0 (pas encore vue)   1
pomme    1                    2
kiwi     0 (pas encore vu)    1
pomme    2                    3`,
    },
    {
      kind: "text",
      text: "Lis le tableau ligne par ligne : à chaque tour, on regarde le compteur avant, on ajoute 1, on réécrit le résultat. Un fruit déjà vu repart de son vrai compteur, un fruit nouveau repart de 0. À la fin, `size()` donne le nombre de fruits **différents**, pas le nombre de fruits lus : ici 3 fruits différents pour 5 fruits dans le panier. Le même principe compte n'importe quoi : des mots, des lettres, des villes.",
    },
    {
      kind: "text",
      text: "Pour afficher tous les résultats, on parcourt les **clés** avec `compteur.keySet()`, qui donne l'ensemble de toutes les clés, puis on lit la valeur de chacune avec `get`. Rappelle-toi qu'un dictionnaire ne garantit aucun ordre : les fruits peuvent sortir dans n'importe quel ordre.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Parcourir les clés d'un dictionnaire.",
      code: `for (String fruit : compteur.keySet()) {
    System.out.println(fruit + " : " + compteur.get(fruit));
}
// affiche trois lignes (pomme : 3, poire : 1, kiwi : 1), dans un ordre quelconque`,
    },
    {
      kind: "comparison",
      title: "Avec ou sans valeur par défaut",
      left: {
        label: "Sans getOrDefault",
        text: "Plante au **premier** ajout de chaque clé, parce que `get` renvoie `null`.",
        code: { language: "java", code: "m.put(k, m.get(k) + 1);" },
      },
      right: {
        label: "Avec getOrDefault",
        text: "Marche **toujours** : une clé inconnue compte pour 0.",
        code: { language: "java", code: "m.put(k, m.getOrDefault(k, 0) + 1);" },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "La recette à retenir",
      text: "Pour compter : (1) lire le compteur actuel avec `getOrDefault(clé, 0)`, (2) ajouter 1, (3) réécrire avec `put`. On range le résultat avec `put`, même pour une clé qui existait déjà : l'ancienne valeur est remplacée.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Exercices (répartis sur les leçons plus bas)
// ---------------------------------------------------------------------------

const EXERCISES: Exercise[] = [
  // ---- Leçon 1 : la rangée de cases ----
  {
    kind: "mcq",
    id: "bases-col-01",
    difficulty: 1,
    tags: ["collections", "tableaux"],
    prompt: "Tu veux garder les notes de 30 élèves. Quelle idée est la plus pratique ?",
    choices: [
      "Une rangée de cases numérotées, une case par note.",
      "Trente variables : `note1`, `note2`... `note30`.",
      "Une seule variable où l'on colle toutes les notes.",
      "Une variable qu'on réécrit à chaque nouvelle note.",
    ],
    answer: 0,
    simple:
      "Trente variables, c'est trente noms à inventer, et un nom de plus à chaque nouvel élève. Une rangée de cases, c'est comme un casier à trente places : un seul nom pour l'ensemble, et un numéro par place. Tu poses la note de chaque élève dans sa case.",
    explanation:
      "Une collection range plusieurs valeurs sous un seul nom, chaque valeur étant repérée par son numéro. C'est la solution qui fonctionne pour 30 notes comme pour 3000. Une variable réécrite à chaque fois perdrait les notes précédentes.",
  },
  {
    kind: "match",
    id: "bases-col-02",
    difficulty: 1,
    tags: ["indices", "tableaux"],
    prompt: "Dans la rangée Lou, Max, Noé, Sam (de gauche à droite), associe chaque numéro de case à son contenu.",
    pairs: [
      { left: "Case numéro 0", right: "Lou" },
      { left: "Case numéro 1", right: "Max" },
      { left: "Case numéro 2", right: "Noé" },
      { left: "Case numéro 3", right: "Sam" },
    ],
    simple:
      "On compte à partir de 0, pas de 1. La première case est la numéro 0 : elle contient Lou. Ensuite 1 pour Max, 2 pour Noé et 3 pour Sam. Une rangée de 4 cases va donc de 0 à 3.",
    explanation:
      "Les numéros de cases (les indices) commencent à 0 : la première valeur est à l'indice 0, la deuxième à l'indice 1, etc. Une rangée de 4 valeurs a les indices 0, 1, 2 et 3.",
  },
  {
    kind: "recall",
    id: "bases-col-03",
    difficulty: 1,
    tags: ["collections", "indices"],
    prompt:
      "Avec tes mots : pourquoi range-t-on plusieurs valeurs dans une rangée de cases plutôt que dans plusieurs variables, et à partir de quel numéro compte-t-on ?",
    simple:
      "Une rangée de cases, c'est un seul nom pour toutes les valeurs, avec un numéro pour retrouver chacune. Plus besoin d'inventer cent noms de variables. Et le premier numéro est 0 : la première case est la case 0.",
    explanation:
      "Plusieurs variables ne passent pas à l'échelle : un nom par valeur, impossible si on ne sait pas combien il y en aura. Une collection numérotée donne un seul nom et un numéro (indice) par valeur. On compte à partir de 0 : une rangée de 5 cases a les numéros 0 à 4.",
    keyPoints: [
      "Un seul nom pour toute la rangée",
      "Un numéro (indice) désigne chaque case",
      "On compte à partir de 0",
      "5 cases : numéros de 0 à 4",
    ],
  },

  // ---- Leçon 2 : le tableau ----
  {
    kind: "output",
    id: "bases-col-04",
    difficulty: 1,
    tags: ["tableaux", "indices"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int[] t = new int[3];
t[1] = 8;
System.out.println(t[0] + " " + t[1]);`,
    },
    choices: ["`0 8`", "`8 8`", "`null 8`", "Le programme plante : la case 0 est vide."],
    answer: 0,
    simple:
      "`new int[3]` fabrique trois cases, toutes remplies de 0. Ensuite on écrit 8 dans la case numéro 1 : la rangée vaut 0, 8, 0. On affiche la case 0 (qui vaut 0) puis la case 1 (qui vaut 8). Une case d'un tableau d'entiers n'est jamais vide : elle contient 0.",
    explanation:
      "`new int[3]` crée trois cases initialisées à 0. `t[1] = 8` remplace la case 1 : le tableau vaut {0, 8, 0}. `t[0]` vaut 0, `t[1]` vaut 8, d'où `0 8`. Le `null` n'existe que pour les tableaux d'objets comme `String[]`.",
  },
  {
    kind: "fill",
    id: "bases-col-05",
    difficulty: 1,
    tags: ["tableaux", "indices"],
    prompt: "Complète : crée un tableau de 3 cases, mets 18 dans la première case, puis affiche le nombre de cases.",
    code: {
      language: "java",
      code: `int[] ages = new int[{{1}}];
ages[{{2}}] = 18;
System.out.println(ages.{{3}});`,
    },
    blanks: ["3", "0", "length"],
    distractors: ["1", "length()", "size()"],
    simple:
      "`new int[3]` fabrique 3 cases. La première case porte le numéro 0, donc on écrit `ages[0] = 18`. Pour compter les cases d'un tableau, on écrit `length` tout court, sans parenthèses : `ages.length`.",
    explanation:
      "La taille entre crochets à la création vaut 3. La première case a l'indice 0, pas 1. Pour un tableau, la taille est un champ, `length`, sans parenthèses ; `length()` et `size()` n'existent pas pour un tableau et ne compilent pas.",
  },
  {
    kind: "order",
    id: "bases-col-06",
    difficulty: 1,
    tags: ["tableaux", "indices"],
    prompt: "Remets ces lignes dans l'ordre pour que le programme affiche 18.",
    language: "java",
    items: [
      "int[] t = new int[3];",
      "t[0] = 7;",
      "t[1] = t[0] + 2;",
      "t[2] = t[1] * 2;",
      "System.out.println(t[2]);",
    ],
    simple:
      "On ne peut pas lire une case avant de l'avoir remplie. D'abord on construit le tableau. Ensuite chaque ligne s'appuie sur la précédente : 7 dans la case 0, puis 7 + 2 = 9 dans la case 1, puis 9 * 2 = 18 dans la case 2. On affiche enfin la case 2.",
    explanation:
      "Le tableau doit exister avant qu'on y écrive. `t[1]` dépend de `t[0]`, et `t[2]` dépend de `t[1]` : l'ordre est imposé. Valeurs : t[0] = 7, t[1] = 9, t[2] = 18, affichage de 18.",
  },

  // ---- Leçon 3 : l'indice hors limites ----
  {
    kind: "output",
    id: "bases-col-07",
    difficulty: 1,
    tags: ["indices", "tableaux"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int[] t = {4, 8, 15, 16};
System.out.println(t[t.length - 1]);`,
    },
    choices: ["`16`", "`15`", "`4`", "Le programme plante."],
    answer: 0,
    simple:
      "Le tableau a 4 cases, donc `t.length` vaut 4. On demande la case numéro `4 - 1`, c'est-à-dire la case 3. Les numéros vont de 0 à 3 : 4 est à la case 0, 8 à la 1, 15 à la 2, 16 à la 3. La case 3 est la dernière, elle contient 16.",
    explanation:
      "`t.length` vaut 4, donc `t.length - 1` vaut 3, l'indice de la dernière case. `t[3]` vaut 16. C'est la façon habituelle de lire la dernière case d'un tableau, sans compter à la main.",
  },
  {
    kind: "mcq",
    id: "bases-col-08",
    difficulty: 1,
    tags: ["indices", "tableaux"],
    prompt: "Un tableau a 5 cases. Quels numéros de cases existent ?",
    choices: ["De 0 à 4", "De 1 à 5", "De 0 à 5", "De 1 à 4"],
    answer: 0,
    simple:
      "On compte à partir de 0 : 0, 1, 2, 3, 4. Cela fait bien 5 cases. Il n'y a pas de case numéro 5 : si on la demande, le programme plante. Le dernier numéro est toujours la taille moins 1.",
    explanation:
      "Un tableau de n cases a les indices de 0 à n - 1. Pour n = 5 : 0, 1, 2, 3, 4. Demander l'indice 5 provoque une `ArrayIndexOutOfBoundsException`.",
  },
  {
    kind: "spot",
    id: "bases-col-09",
    difficulty: 2,
    tags: ["indices", "tableaux"],
    prompt: "Ce programme plante avec « Index 3 out of bounds for length 3 ». Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `int[] t = {5, 6, 7};
int dernier = t[t.length];
System.out.println(dernier);`,
    },
    faultyLine: 2,
    reasons: [
      "`t.length` vaut 3, mais la dernière case est la numéro 2 : il faut `t.length - 1`.",
      "`length` doit s'écrire avec des parenthèses : `t.length()`.",
      "Une case de tableau ne peut pas être rangée dans un `int`.",
      "Le tableau est trop petit : il faut au moins 4 cases.",
    ],
    reasonAnswer: 0,
    simple:
      "Le tableau a 3 cases, numérotées 0, 1 et 2. Or `t.length` vaut 3 : on demande donc la case numéro 3, qui n'existe pas. C'est la ligne 2 qui plante, pas la ligne 3. La dernière case, c'est la taille moins 1 : `t[t.length - 1]`.",
    explanation:
      "Les indices valides vont de 0 à `t.length - 1`. `t[t.length]` demande une case de trop : `ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`. La ligne 3 n'est jamais exécutée. Correction : `t[t.length - 1]`.",
  },

  // ---- Leçon 4 : parcourir ----
  {
    kind: "fill",
    id: "bases-col-10",
    difficulty: 1,
    tags: ["boucles", "tableaux"],
    prompt: "Complète la boucle qui additionne toutes les cases du tableau.",
    code: {
      language: "java",
      code: `int[] t = {3, 5, 7};
int somme = 0;
for (int i = 0; i {{1}} t.{{2}}; i++) {
    somme = somme + t[i];
}`,
    },
    blanks: ["<", "length"],
    distractors: ["<=", "length()", "size()"],
    simple:
      "Le compteur `i` doit prendre les numéros 0, 1, 2 : les numéros de cases qui existent. On s'arrête donc quand `i` vaut la taille, avec `<` : `i < t.length`. Avec `<=`, il y aurait un tour de trop et le programme planterait. Et la taille d'un tableau s'écrit `length`, sans parenthèses.",
    explanation:
      "`i < t.length` parcourt exactement les indices 0 à `t.length - 1`. Avec `<=`, le dernier tour lirait `t[3]` : indice hors limites. `length` est un champ du tableau, sans parenthèses.",
  },
  {
    kind: "output",
    id: "bases-col-11",
    difficulty: 1,
    tags: ["boucles", "for-each"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int[] t = {2, 4, 6};
int somme = 0;
for (int x : t) {
    somme = somme + x;
}
System.out.println(somme);`,
    },
    choices: ["`12`", "`6`", "`3`", "`2`"],
    answer: 0,
    simple:
      "Le for-each donne à `x` chaque valeur du tableau, l'une après l'autre. Tour 1 : x = 2, somme = 0 + 2 = 2. Tour 2 : x = 4, somme = 2 + 4 = 6. Tour 3 : x = 6, somme = 6 + 6 = 12. On affiche 12.",
    explanation:
      "`for (int x : t)` fait prendre à `x` successivement 2, 4 puis 6. La somme passe de 0 à 2, 6, puis 12. On n'utilise aucun indice : le for-each suffit pour une simple lecture.",
  },
  {
    kind: "output",
    id: "bases-col-12",
    difficulty: 2,
    tags: ["boucles", "for-each"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int[] t = {1, 2, 3};
for (int x : t) {
    x = x * 10;
}
System.out.println(t[0] + " " + t[1] + " " + t[2]);`,
    },
    choices: ["`1 2 3`", "`10 20 30`", "`10 2 3`", "Le programme plante."],
    answer: 0,
    simple:
      "Dans le for-each, `x` est une photocopie de la valeur de la case, pas la case elle-même. Écrire `x = x * 10` change la photocopie, puis elle est jetée. Le tableau n'a jamais été touché : il affiche toujours 1 2 3. Pour changer les vraies cases, il faut la boucle avec indice.",
    explanation:
      "La variable `x` reçoit une copie de chaque valeur. Modifier `x` ne modifie pas le tableau. Le code compile et s'exécute sans erreur, mais ne fait pas ce qu'on voulait : le tableau reste {1, 2, 3}. Il faudrait écrire `t[i] = t[i] * 10` dans un `for` avec indice.",
  },
  {
    kind: "recall",
    id: "bases-col-13",
    difficulty: 2,
    tags: ["boucles", "for-each", "indices"],
    prompt: "Quand préfères-tu un `for` avec indice, et quand un for-each ? Donne la raison.",
    simple:
      "Le for-each est le plus simple : il te donne chaque valeur, une par une, sans te soucier des numéros. Mais il ne te donne qu'une photocopie. Dès que tu as besoin du numéro de la case, ou que tu veux changer le contenu des cases, prends le `for` avec indice.",
    explanation:
      "For-each pour lire les valeurs (somme, affichage, recherche) : plus court et sans risque de dépasser le tableau. `for` avec indice dès qu'il faut le numéro de la case, modifier le contenu (`t[i] = ...`) ou ne parcourir qu'une partie du tableau. Dans un for-each, la variable est une copie : la modifier ne change pas le tableau.",
    keyPoints: [
      "For-each : on lit seulement les valeurs",
      "For avec indice : on a besoin du numéro",
      "For avec indice : pour modifier les cases",
      "x du for-each est une copie",
    ],
  },

  // ---- Leçon 5 : la liste ----
  {
    kind: "fill",
    id: "bases-col-14",
    difficulty: 1,
    tags: ["listes"],
    prompt: "Complète : crée une liste de textes, ajoute \"kiwi\", puis affiche sa taille.",
    code: {
      language: "java",
      code: `List<{{1}}> fruits = new {{2}}<>();
fruits.{{3}}("kiwi");
System.out.println(fruits.{{4}}());`,
    },
    blanks: ["String", "ArrayList", "add", "size"],
    distractors: ["Integer", "length", "get"],
    simple:
      "Entre `<` et `>`, on dit ce qu'on range dans la liste : des textes, donc `String`. À droite du `=`, on construit une vraie liste avec `new ArrayList<>()`. On ajoute un élément à la fin avec `add`, et on compte les éléments avec `size()` : ici, 1.",
    explanation:
      "`List<String>` déclare une liste de textes, `new ArrayList<>()` la construit. `add` ajoute à la fin, `size()` renvoie le nombre d'éléments (avec parenthèses, contrairement à `length` des tableaux). `get` lirait un élément à un numéro donné.",
  },
  {
    kind: "output",
    id: "bases-col-15",
    difficulty: 2,
    tags: ["listes", "indices"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<String> l = new ArrayList<>();
l.add("a");
l.add("b");
l.add("c");
l.remove(0);
System.out.println(l.get(0) + " " + l.size());`,
    },
    choices: ["`b 2`", "`a 2`", "`b 3`", "`c 2`"],
    answer: 0,
    simple:
      "Après les trois `add`, la liste est a, b, c. `remove(0)` enlève la case numéro 0, donc le \"a\". Les autres se décalent pour boucher le trou : la liste devient b, c. Maintenant la case 0 contient \"b\", et il reste 2 éléments. On affiche donc b 2.",
    explanation:
      "Liste [a, b, c]. `remove(0)` retire l'élément en place 0 : [b, c]. `get(0)` vaut maintenant \"b\" (les éléments se décalent) et `size()` vaut 2. Sortie : `b 2`.",
  },
  {
    kind: "recall",
    id: "bases-col-16",
    difficulty: 2,
    tags: ["listes", "tableaux"],
    prompt:
      "Quelle différence y a-t-il entre un tableau et une `ArrayList` ? Comment lit-on le nombre d'éléments de chacun ?",
    simple:
      "Un tableau est une rangée de cases dont le nombre ne change jamais. Une liste est une rangée qui s'agrandit quand on ajoute et rétrécit quand on enlève. Pour compter : `t.length` (sans parenthèses) pour le tableau, `l.size()` (avec) pour la liste.",
    explanation:
      "Tableau : taille fixe, choisie à la création, `t[i]` pour lire ou écrire, `t.length` pour la taille. Liste : taille variable (`add`, `remove`), `l.get(i)` pour lire, `l.size()` pour la taille. Les deux sont numérotées à partir de 0 et plantent si on demande un numéro qui n'existe pas.",
    keyPoints: [
      "Tableau : taille fixe",
      "Liste : grandit et rétrécit (add, remove)",
      "t.length sans parenthèses, l.size() avec",
      "t[i] contre l.get(i)",
    ],
  },

  // ---- Leçon 6 : l'ensemble ----
  {
    kind: "output",
    id: "bases-col-17",
    difficulty: 1,
    tags: ["ensembles"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Set<String> s = new HashSet<>();
s.add("Ana");
s.add("Bob");
s.add("Ana");
System.out.println(s.size());`,
    },
    choices: ["`2`", "`3`", "`1`", "Le programme plante : on ne peut pas ajouter deux fois `\"Ana\"`."],
    answer: 0,
    simple:
      "Un ensemble est comme un sac où chaque chose n'entre qu'une fois. On met Ana, puis Bob. Quand on essaie de remettre Ana, elle est déjà dans le sac : rien ne change, et le programme ne plante pas. Il y a donc 2 éléments.",
    explanation:
      "Un `HashSet` ne garde jamais de doublon. Le deuxième `add(\"Ana\")` est simplement ignoré (il renvoie `false`), sans erreur. L'ensemble contient \"Ana\" et \"Bob\" : `size()` vaut 2.",
  },
  {
    kind: "output",
    id: "bases-col-18",
    difficulty: 2,
    tags: ["ensembles", "listes"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `List<String> l = new ArrayList<>();
l.add("a");
l.add("b");
l.add("a");
l.add("c");
l.add("b");
Set<String> s = new HashSet<>(l);
System.out.println(l.size() + " " + s.size());`,
    },
    choices: ["`5 3`", "`5 5`", "`3 3`", "`3 5`"],
    answer: 0,
    simple:
      "La liste garde tout : a, b, a, c, b, soit 5 éléments. `new HashSet<>(l)` verse la liste dans un sac qui ne garde qu'un exemplaire de chaque : a, b, c, soit 3 éléments. La liste n'est pas modifiée. On affiche 5 puis 3.",
    explanation:
      "La liste contient 5 éléments, doublons compris. Le constructeur `new HashSet<>(l)` copie ses éléments dans un ensemble : les doublons disparaissent, il reste \"a\", \"b\", \"c\". La liste elle-même n'est pas changée. Sortie : `5 3`.",
  },
  {
    kind: "spot",
    id: "bases-col-19",
    difficulty: 2,
    tags: ["ensembles", "indices"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `Set<String> s = new HashSet<>();
s.add("x");
String premier = s.get(0);`,
    },
    faultyLine: 3,
    reasons: [
      "Un ensemble n'a pas de numéros de case : `get(0)` n'existe pas pour lui.",
      "`add` ne peut pas recevoir un texte, seulement des nombres.",
      "Un ensemble doit être créé avec `new ArrayList<>()`.",
      "`get` demande une clé et non un numéro : il faut écrire `get(\"x\")`.",
    ],
    reasonAnswer: 0,
    simple:
      "Un ensemble est un sac : il n'y a pas de cases numérotées, donc pas de « case 0 » ni de « premier ». Seule la ligne 3 pose problème. Pour savoir si \"x\" est dans le sac, on écrit `s.contains(\"x\")`. Si tu as besoin de numéros, prends une liste.",
    explanation:
      "`Set` ne propose pas `get(int)` : un ensemble n'a ni numéros ni ordre garanti. La ligne 3 ne compile pas. On teste la présence avec `contains`, on parcourt avec un for-each, et on passe à `List` si l'on a besoin d'un accès par numéro.",
  },

  // ---- Leçon 7 : le dictionnaire ----
  {
    kind: "output",
    id: "bases-col-20",
    difficulty: 1,
    tags: ["dictionnaires"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Map<String, String> capitales = new HashMap<>();
capitales.put("France", "Paris");
capitales.put("Italie", "Rome");
System.out.println(capitales.get("Italie") + " " + capitales.containsKey("Chine"));`,
    },
    choices: ["`Rome false`", "`Rome true`", "`null false`", "`Italie false`"],
    answer: 0,
    simple:
      "Le dictionnaire contient deux paires : France vers Paris, Italie vers Rome. `get(\"Italie\")` cherche la clé Italie et donne sa valeur : Rome. `containsKey(\"Chine\")` demande si la clé Chine existe : non, donc `false`. On affiche Rome false.",
    explanation:
      "`get(clé)` renvoie la valeur associée : \"Rome\". `containsKey(\"Chine\")` vaut `false` car aucune paire n'a cette clé. La concaténation avec `\" \"` donne `Rome false`.",
  },
  {
    kind: "output",
    id: "bases-col-21",
    difficulty: 2,
    tags: ["dictionnaires"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `Map<String, Integer> m = new HashMap<>();
m.put("a", 1);
m.put("b", 2);
m.put("a", 3);
System.out.println(m.get("a") + " " + m.size());`,
    },
    choices: ["`3 2`", "`1 3`", "`3 3`", "`1 2`"],
    answer: 0,
    simple:
      "Dans un dictionnaire, une clé n'existe qu'une seule fois. Ligne 1 : a vaut 1. Ligne 2 : b vaut 2. Ligne 3 : \"a\" existe déjà, donc sa valeur est remplacée, a vaut 3 maintenant. Il y a toujours 2 paires : a et b. On affiche 3 2.",
    explanation:
      "Le deuxième `put(\"a\", ...)` remplace la valeur de la clé existante : il n'y a pas de troisième paire. `get(\"a\")` vaut 3 et `size()` vaut 2 (clés a et b). Sortie : `3 2`.",
  },
  {
    kind: "spot",
    id: "bases-col-22",
    difficulty: 2,
    tags: ["dictionnaires", "null"],
    prompt: "Ce programme plante au moment de l'exécution. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `Map<String, String> capitales = new HashMap<>();
capitales.put("France", "Paris");
System.out.println(capitales.get("Chine").length());`,
    },
    faultyLine: 3,
    reasons: [
      "\"Chine\" n'est pas une clé : `get` renvoie `null`, et `length()` plante sur `null`.",
      "`put` doit toujours être écrit après `get`.",
      "`length()` n'existe pas sur un texte : il faut écrire `size()`.",
      "Un dictionnaire ne peut pas ranger de textes comme valeurs.",
    ],
    reasonAnswer: 0,
    simple:
      "On cherche la clé \"Chine\", mais elle n'a jamais été ajoutée. `get` répond alors `null`, la flèche qui ne mène nulle part. Demander la longueur de « rien » fait planter le programme. Avant d'utiliser le résultat, il faut vérifier avec `containsKey` ou tester `!= null`.",
    explanation:
      "`get` renvoie `null` quand la clé est absente. Appeler `length()` sur ce `null` lève une `NullPointerException`, à la ligne 3. Correction : tester `containsKey(\"Chine\")` ou `get(\"Chine\") != null` avant d'utiliser la valeur.",
  },

  // ---- Leçon 8 : choisir ----
  {
    kind: "match",
    id: "bases-col-23",
    difficulty: 2,
    tags: ["choix-collection"],
    prompt: "Associe chaque besoin à la collection la plus adaptée.",
    pairs: [
      { left: "Retrouver le numéro de téléphone de chaque prénom", right: "Un dictionnaire (HashMap)" },
      { left: "Garder des adresses e-mail sans jamais de doublon", right: "Un ensemble (HashSet)" },
      { left: "Garder les notes dans l'ordre de passage, deux élèves peuvent avoir la même note", right: "Une liste (ArrayList)" },
      { left: "Ranger les 7 jours de la semaine, un nombre qui ne bougera jamais", right: "Un tableau" },
    ],
    simple:
      "Demande-toi quelle question tu poseras à tes données. Chercher par un nom : dictionnaire. Interdire les doublons : ensemble. Garder l'ordre avec des doublons permis : liste. Un nombre de cases connu et jamais changé : tableau.",
    explanation:
      "Clé vers valeur : `HashMap`. Pas de doublon : `HashSet`. Ordre et doublons acceptés : `ArrayList`. Taille connue et fixe : tableau. Le tableau n'est pas interdit pour les autres cas, mais les autres collections sont plus adaptées aux besoins listés.",
  },
  {
    kind: "mcq",
    id: "bases-col-24",
    difficulty: 2,
    tags: ["choix-collection", "ensembles"],
    prompt:
      "Un site garde les pseudos déjà pris. À chaque inscription, il demande « ce pseudo est-il déjà dedans ? » et ne veut jamais deux fois le même pseudo. Que prends-tu ?",
    choices: [
      "Un ensemble : pas de doublon, et `contains` répond tout de suite.",
      "Une liste : `add` refuse tout seul un pseudo déjà présent.",
      "Un tableau : on écrit un pseudo par case.",
      "Un dictionnaire : c'est le seul à retrouver un pseudo vite.",
    ],
    answer: 0,
    simple:
      "La question posée est « est-ce déjà dedans ? » et on ne veut pas de doublon : c'est exactement le métier d'un ensemble. Une liste, elle, accepte les doublons sans rien dire. Un tableau a une taille fixe. Un dictionnaire servirait si on avait une valeur à associer à chaque pseudo, ce n'est pas le cas.",
    explanation:
      "`HashSet` n'accepte pas de doublon et `contains` retrouve directement. La liste accepte les doublons et doit être parcourue pour chercher. Le tableau a une taille fixe. Un dictionnaire n'est utile que s'il y a une valeur à associer à chaque clé ; l'ensemble retrouve aussi directement une valeur.",
  },
  {
    kind: "recall",
    id: "bases-col-25",
    difficulty: 3,
    tags: ["choix-collection"],
    prompt:
      "Pour chaque besoin, dis quelle collection tu prends et pourquoi : (1) les notes d'une classe, dans l'ordre, avec des doublons possibles ; (2) les pseudos déjà pris, sans doublon ; (3) le prix de chaque produit, retrouvé par son nom.",
    simple:
      "(1) Une liste : elle garde l'ordre et accepte deux notes égales. (2) Un ensemble : un pseudo n'y entre qu'une fois et on demande « est-il dedans ? ». (3) Un dictionnaire : le nom du produit est la clé, le prix est la valeur.",
    explanation:
      "(1) `List` : numéros, ordre, doublons acceptés. (2) `Set` : jamais de doublon, `contains` pour tester la présence. (3) `Map` : clé = nom du produit, valeur = prix, recherche directe par la clé. Un tableau ne conviendrait que si le nombre d'éléments était connu et fixe.",
    keyPoints: [
      "(1) Liste : ordre, doublons acceptés",
      "(2) Ensemble : jamais de doublon, `contains`",
      "(3) Dictionnaire : clé = nom, valeur = prix",
      "Tableau seulement si la taille est fixe",
    ],
  },

  // ---- Leçon 9 : compter ----
  {
    kind: "fill",
    id: "bases-col-26",
    difficulty: 2,
    tags: ["comptage", "dictionnaires"],
    prompt: "Complète la ligne qui compte combien de fois chaque fruit apparaît.",
    code: {
      language: "java",
      code: `String[] panier = {"pomme", "poire", "pomme"};
Map<String, Integer> compteur = new HashMap<>();
for (String fruit : panier) {
    compteur.{{1}}(fruit, compteur.{{2}}(fruit, {{3}}) + 1);
}`,
    },
    blanks: ["put", "getOrDefault", "0"],
    distractors: ["get", "add", "1"],
    simple:
      "On lit le compteur actuel du fruit, en prenant 0 s'il n'a jamais été vu : `getOrDefault(fruit, 0)`. On ajoute 1. Puis on range le nouveau nombre avec `put`, qui remplace l'ancienne valeur. Lire, ajouter 1, réécrire.",
    explanation:
      "`getOrDefault(fruit, 0)` renvoie la valeur de la clé ou 0 si elle est absente, ce qui évite le `null`. On ajoute 1 puis on réécrit avec `put`, qui remplace la valeur de la clé existante. Avec `get` à la place, le premier fruit ferait planter le programme.",
  },
  {
    kind: "output",
    id: "bases-col-27",
    difficulty: 3,
    tags: ["comptage", "dictionnaires"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String[] mots = {"a", "b", "a", "c", "a", "b"};
Map<String, Integer> m = new HashMap<>();
for (String mot : mots) {
    m.put(mot, m.getOrDefault(mot, 0) + 1);
}
System.out.println(m.get("a") + " " + m.get("b") + " " + m.get("c") + " " + m.size());`,
    },
    choices: ["`3 2 1 3`", "`3 2 1 6`", "`1 1 1 3`", "`2 2 2 3`"],
    answer: 0,
    simple:
      "On suit le compteur mot après mot : a passe à 1, b à 1, a à 2, c à 1, a à 3, b à 2. À la fin : a vaut 3, b vaut 2, c vaut 1. Il y a trois clés différentes (a, b, c), donc `size()` vaut 3, et non 6 : on compte les mots différents, pas les mots lus.",
    explanation:
      "Compteurs successifs : a=1, b=1, a=2, c=1, a=3, b=2. Résultat : a=3, b=2, c=1, soit trois clés distinctes : `size()` vaut 3, pas 6 (nombre de mots). Sortie : `3 2 1 3`.",
  },
  {
    kind: "recall",
    id: "bases-col-28",
    difficulty: 3,
    tags: ["comptage", "dictionnaires", "null"],
    prompt:
      "Pourquoi `compteur.put(mot, compteur.get(mot) + 1)` plante-t-il la première fois qu'on voit un mot ? Comment le corriger ?",
    simple:
      "La première fois, le mot n'est pas encore dans le dictionnaire : `get` répond `null`, c'est-à-dire « rien ». On ne peut pas ajouter 1 à « rien », alors le programme plante. La solution : `getOrDefault(mot, 0)`, qui donne 0 quand le mot est inconnu. Alors 0 + 1 fait 1 et tout va bien.",
    explanation:
      "`get` renvoie `null` pour une clé absente. Ajouter 1 à ce `null` force Java à déballer un `Integer` vide : `NullPointerException`. Correction : `compteur.put(mot, compteur.getOrDefault(mot, 0) + 1)`. La valeur par défaut 0 sert au premier passage ; ensuite la clé existe et on lit son vrai compteur.",
    keyPoints: [
      "`get` renvoie `null` si la clé est absente",
      "`null + 1` plante",
      "`getOrDefault(mot, 0)` donne 0 par défaut",
      "Puis `put` réécrit la valeur",
    ],
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
  id: "bases-collections",
  format: "doux",
  title: "Tableaux, listes et dictionnaires",
  objective:
    "Savoir ranger plusieurs valeurs dans un tableau, une liste, un ensemble ou un dictionnaire, les parcourir, et choisir le bon rangement.",
  prerequisites: ["bases-objets"],
  units: [
    l1, ...pick("bases-col-01", "bases-col-02", "bases-col-03"),
    l2, ...pick("bases-col-04", "bases-col-05", "bases-col-06"),
    l3, ...pick("bases-col-07", "bases-col-08", "bases-col-09"),
    l4, ...pick("bases-col-10", "bases-col-11", "bases-col-12", "bases-col-13"),
    l5, ...pick("bases-col-14", "bases-col-15", "bases-col-16"),
    l6, ...pick("bases-col-17", "bases-col-18", "bases-col-19"),
    l7, ...pick("bases-col-20", "bases-col-21", "bases-col-22"),
    l8, ...pick("bases-col-23", "bases-col-24", "bases-col-25"),
    l9, ...pick("bases-col-26", "bases-col-27", "bases-col-28"),
  ],
};
