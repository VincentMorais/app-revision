/**
 * Bases — Les méthodes : écrire et appeler une méthode (la recette), ce qui
 * entre (paramètres), ce qui sort (return, void), où vivent les variables
 * (portée), les paramètres comme copies, l'enchaînement des appels, la
 * surcharge et `main`.
 * 8 leçons, 28 exercices — format doux : une image par notion (case
 * étiquetée, recette), chaque exercice est précédé de la leçon qui enseigne
 * ce qu'il demande. Tout le code a été exécuté avec le JDK local.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Pourquoi des méthodes : la recette
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "bases-mth-l1",
  title: "Pourquoi des méthodes : la recette",
  blocks: [
    {
      kind: "text",
      text: "Imagine que ton programme doive afficher le même message d'accueil à plusieurs endroits : en haut du menu, après une connexion, à la fin d'un achat. Premier réflexe : tu recopies les mêmes lignes à chaque endroit. Ça marche... jusqu'au jour où tu veux changer « Bienvenue » en « Bonjour ». Il faut alors retrouver **toutes** les copies, et si tu en oublies une, ton programme dit deux choses différentes.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les mêmes trois lignes, recopiées. Un changement = deux corrections (ou dix).",
      code: `public static void main(String[] args) {
    System.out.println("=====");
    System.out.println("Bienvenue !");
    System.out.println("=====");

    // ... du code plus loin ...

    System.out.println("=====");
    System.out.println("Bienvenue !");
    System.out.println("=====");
}`,
    },
    {
      kind: "text",
      text: "La solution : une **méthode**. Une méthode est une **recette** : un petit bloc d'instructions auquel tu donnes un **nom**. Tu écris la recette **une seule fois**. Ensuite, chaque fois que tu en as besoin, tu n'écris plus les étapes : tu dis juste le nom de la recette, et Java la refait pour toi. Écrire la recette s'appelle **définir** la méthode. La faire s'appelle **appeler** la méthode.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La recette est écrite une fois, puis appelée deux fois.",
      code: `static void afficheAccueil() {
    System.out.println("=====");
    System.out.println("Bienvenue !");
    System.out.println("=====");
}

public static void main(String[] args) {
    afficheAccueil();   // première fois
    afficheAccueil();   // deuxième fois
}`,
    },
    {
      kind: "text",
      text: "Ici, la recette s'appelle `afficheAccueil`. Elle est écrite une fois en haut. Dans `main` (c'est là que le programme démarre, on y reviendra), on l'appelle deux fois : l'accueil s'affiche deux fois. Pour changer le message, tu modifies la recette à **un seul endroit**, et tous les appels suivent. Tu connais d'ailleurs déjà une méthode : `System.out.println(...)` est une recette écrite par d'autres, que tu appelles sans savoir ce qu'il y a dedans.",
    },
    {
      kind: "comparison",
      title: "Recopier ou écrire une recette ?",
      left: {
        label: "Copier-coller",
        text: "Les mêmes lignes à chaque endroit. Un changement oblige à corriger **chaque copie**, et on en oublie.",
      },
      right: {
        label: "Une méthode",
        text: "Les lignes sont écrites **une fois**. On les lance par leur nom. Un changement = **une seule** correction.",
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Un bon nom de recette",
      text: "Choisis un nom qui dit ce que fait la recette : `afficheAccueil` se comprend tout de suite, `truc1` jamais. Et une méthode fait **une** chose claire, comme une recette fait un plat.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — Définir et appeler une méthode
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "bases-mth-l2",
  title: "Définir et appeler une méthode",
  blocks: [
    {
      kind: "text",
      text: "Voyons comment on écrit une recette en Java. Sa forme : `static void direBonjour() { ... }`. Dans l'ordre : `static` (écris-le pour l'instant sans te poser de question : ce sera clair au chapitre sur les objets), `void` (« vide » : cette recette ne renvoie rien, on y revient à la leçon 4), le **nom** de la méthode, des **parenthèses** `()`, puis des **accolades** `{ }` qui contiennent les étapes.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Définir une méthode : on donne un nom à une suite d'étapes.",
      code: `static void direBonjour() {            // la ligne qui donne le nom
    System.out.println("Bonjour !");   // les étapes de la recette
}                                      // fin de la recette`,
    },
    {
      kind: "text",
      text: "Premier piège : **écrire** une recette ne la **fait** pas. Regarde ce programme. Il contient la recette `direBonjour`, mais personne ne l'appelle. Quand tu le lances, « Bonjour ! » ne s'affiche jamais. C'est comme un livre de recettes posé sur l'étagère : tant que personne ne l'ouvre, aucun plat n'est préparé.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La recette existe, mais elle n'est jamais appelée.",
      code: `static void direBonjour() {
    System.out.println("Bonjour !");
}

public static void main(String[] args) {
    System.out.println("Début");
}
// Affiche seulement : Début`,
    },
    {
      kind: "text",
      text: "Pour que la recette se fasse, il faut l'**appeler** : on écrit son nom, suivi de parenthèses et d'un point-virgule. Le programme démarre dans `main` et lit ses lignes de haut en bas. Quand il croise `direBonjour();`, il va faire la recette, puis revient à la ligne suivante. Et on écrit la recette **à côté** de `main`, jamais à l'intérieur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Maintenant la recette est appelée, deux fois.",
      code: `static void direBonjour() {
    System.out.println("Bonjour !");
}

public static void main(String[] args) {
    System.out.println("Début");
    direBonjour();
    direBonjour();
    System.out.println("Fin");
}
// Affiche : Début, Bonjour !, Bonjour !, Fin`,
    },
    {
      kind: "comparison",
      title: "Définir ou appeler ?",
      left: {
        label: "Définir",
        text: "Écrire la recette, **une seule fois**, avec `static void` devant. Rien ne se passe encore.",
        code: { language: "java", code: "static void direBonjour() {\n    ...\n}" },
      },
      right: {
        label: "Appeler",
        text: "Faire la recette, **autant de fois** qu'on veut : juste le nom, des parenthèses et `;`.",
        code: { language: "java", code: "direBonjour();" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : les parenthèses de l'appel",
      text: "À l'appel, les parenthèses sont obligatoires, même vides. `direBonjour;` ne compile pas : sans les parenthèses, Java ne comprend pas que tu veux lancer la recette. Pour les noms, on commence par une minuscule et on colle les mots avec une majuscule : `direBonjour`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — Les paramètres : ce qui entre
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "bases-mth-l3",
  title: "Les paramètres : ce qui entre dans la méthode",
  blocks: [
    {
      kind: "text",
      text: "Notre recette `direBonjour` dit toujours la même chose. Mais si on veut saluer Ana, puis Bob, puis Lea ? On ne va pas écrire une méthode par prénom ! Pense à une recette de crêpes : elle ne dit pas « 250 g de farine de Lea », elle dit « farine : la quantité que tu veux », et c'est toi qui donnes la quantité. Une recette peut donc avoir des **ingrédients** qu'on lui fournit à chaque fois.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une méthode par prénom : absurde, et sans fin.",
      code: `static void direBonjourAAna() {
    System.out.println("Bonjour Ana !");
}

static void direBonjourABob() {
    System.out.println("Bonjour Bob !");
}`,
    },
    {
      kind: "text",
      text: "La solution : les **paramètres**. Entre les parenthèses de la définition, tu écris des **cases étiquetées vides** : le **type**, puis le **nom** de chaque case. Elles attendent une valeur. À l'appel, tu donnes les valeurs dans les parenthèses : ce sont les **arguments**. Java les range dans les cases, et la méthode les utilise comme n'importe quelle variable.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une seule recette, des prénoms à volonté.",
      code: `static void saluer(String prenom) {
    System.out.println("Bonjour " + prenom + " !");
}

public static void main(String[] args) {
    saluer("Ana");   // la case prenom reçoit "Ana"  → Bonjour Ana !
    saluer("Bob");   // la case prenom reçoit "Bob"  → Bonjour Bob !
}`,
    },
    {
      kind: "text",
      text: "On peut mettre **plusieurs** paramètres, séparés par des virgules. Deux règles à retenir. L'**ordre** compte : le premier argument va dans la première case, le deuxième dans la deuxième. Et les **types** comptent : une case `int` n'accepte qu'un nombre entier, une case `String` qu'un texte entre guillemets. Si ça ne correspond pas, Java refuse de lancer le programme.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux cases : un texte d'abord, un nombre ensuite.",
      code: `static void presente(String nom, int age) {
    System.out.println(nom + " a " + age + " ans");
}

public static void main(String[] args) {
    presente("Lea", 12);      // Lea a 12 ans
    // presente(12, "Lea");   // ne compile pas : 12 n'est pas un texte
    // presente("Lea");       // ne compile pas : il manque l'âge
}`,
    },
    {
      kind: "comparison",
      title: "Paramètre ou argument ?",
      left: {
        label: "Paramètre",
        text: "La **case étiquetée** dans les parenthèses de la définition : un type et un nom. Elle attend une valeur.",
        code: { language: "java", code: "static void saluer(String prenom)" },
      },
      right: {
        label: "Argument",
        text: "La **valeur** qu'on donne dans les parenthèses de l'appel. Elle est rangée dans la case.",
        code: { language: "java", code: "saluer(\"Ana\");" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un appel doit coller à la définition",
      text: "Autant d'arguments que de paramètres, dans le même ordre, avec le bon type pour chacun. Un texte s'écrit entre guillemets (`\"Ana\"`), un nombre sans (`12`).",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — La valeur retournée : ce qui sort
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "bases-mth-l4",
  title: "La valeur retournée : ce qui sort de la méthode",
  blocks: [
    {
      kind: "text",
      text: "Jusqu'ici, nos recettes **font** quelque chose : elles affichent un message. Mais souvent, on veut qu'une recette nous **rende un résultat**, comme un plat qui sort de la cuisine : le calcul d'un prix, le double d'un nombre. Afficher ne suffit pas : ce qui est écrit à l'écran est perdu pour la suite du programme, tu ne peux pas le réutiliser dans un autre calcul.",
    },
    {
      kind: "code",
      language: "java",
      caption: "doubler affiche le double, mais ne le rend pas.",
      code: `static void doubler(int n) {
    System.out.println(n * 2);
}

public static void main(String[] args) {
    int resultat = doubler(4);   // ne compile pas : doubler ne renvoie rien
}`,
    },
    {
      kind: "text",
      text: "Java refuse la ligne `int resultat = doubler(4);` : on essaie de ranger dans une case un résultat qui n'existe pas. Le mot `void` veut justement dire « cette méthode ne renvoie rien » : c'est une recette qui fait quelque chose, sans rien te remettre à la fin.",
    },
    {
      kind: "text",
      text: "Pour qu'une méthode rende un résultat, on change deux choses. Devant le nom, à la place de `void`, on écrit le **type du résultat** (`int` pour un nombre entier) : c'est le **type de retour**. Dans la méthode, on écrit `return` suivi de la valeur : la méthode s'arrête là et **renvoie** cette valeur à celui qui l'a appelée. L'appel `doubler(4)` se transforme alors en valeur : ici, 8.",
    },
    {
      kind: "code",
      language: "java",
      caption: "return renvoie le résultat ; l'appel devient une valeur.",
      code: `static int doubler(int n) {
    return n * 2;
}

public static void main(String[] args) {
    int resultat = doubler(4);               // doubler(4) vaut 8, rangé dans resultat
    System.out.println(resultat + 1);        // 9
    System.out.println(doubler(5));          // 10 : on peut utiliser l'appel directement
}`,
    },
    {
      kind: "comparison",
      title: "void ou un type de retour ?",
      left: {
        label: "void",
        text: "Fait quelque chose (afficher...) et **ne renvoie rien**. Son appel ne peut pas être rangé dans une variable.",
        code: { language: "java", code: "static void afficheDouble(int n)" },
      },
      right: {
        label: "int (ou autre type)",
        text: "**Renvoie** un résultat grâce à `return`. Son appel est une valeur qu'on peut ranger ou réutiliser.",
        code: { language: "java", code: "static int doubler(int n)" },
      },
    },
    {
      kind: "text",
      text: "Deux règles de Java. D'abord, une méthode qui annonce un type de retour **doit** avoir un `return` : sans lui, Java refuse le programme (« missing return statement », c'est-à-dire « il manque le return »). Ensuite, un `return` avec une valeur est interdit dans une méthode `void` : elle a promis de ne rien renvoyer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une méthode qui promet un int, mais n'en renvoie aucun.",
      code: `static int carre(int n) {
    int resultat = n * n;
}   // ne compile pas : il manque return resultat;`,
    },
    {
      kind: "text",
      text: "Dernier piège, sournois parce que le code compile : on peut appeler une méthode qui renvoie un résultat et **jeter** ce résultat, comme préparer un plat et le mettre à la poubelle. Il faut le **ranger** dans une variable, ou l'utiliser tout de suite.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le résultat de la ligne 3 est jeté ; la ligne 5 le range.",
      code: `int x = 5;
doubler(x);                     // compile, mais le résultat est jeté
System.out.println(x);          // 5
x = doubler(x);                 // on range le résultat dans x
System.out.println(x);          // 10`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Appeler ne suffit pas",
      text: "`doubler(x);` tout seul ne change **pas** `x`. Pour garder le résultat, range-le : `x = doubler(x);`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — Les variables locales et leur portée
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "bases-mth-l5",
  title: "Les variables locales et leur portée",
  blocks: [
    {
      kind: "text",
      text: "Chaque recette se fait dans sa **propre cuisine**, avec son plan de travail. Les cases étiquetées (les variables) que tu crées pendant la recette sont posées sur ce plan. Quand la recette est finie, on **débarrasse tout** : les cases disparaissent. Une variable créée dans une méthode s'appelle une variable **locale**. Elle n'existe que **dans les accolades `{ }`** où elle est déclarée : c'est sa **portée**.",
    },
    {
      kind: "code",
      language: "java",
      caption: "main essaie d'utiliser une variable qui vit dans une autre cuisine.",
      code: `static void calcule() {
    int total = 10;
}

public static void main(String[] args) {
    calcule();
    System.out.println(total);   // ne compile pas : main ne connaît pas total
}`,
    },
    {
      kind: "text",
      text: "Quand `calcule` arrive à son accolade fermante, `total` est débarrassée. `main` n'a jamais eu accès à cette case : Java répond « cannot find symbol » (« je ne trouve pas ce nom »). Pour faire sortir une valeur d'une méthode, on utilise ce que tu viens d'apprendre : `return`. `main` range alors le résultat dans **sa propre** case.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux cases total, chacune dans sa cuisine.",
      code: `static int calcule() {
    int total = 10;
    return total;               // la valeur sort, pas la case
}

public static void main(String[] args) {
    int total = calcule();      // une autre case, dans la cuisine de main
    System.out.println(total);  // 10
}`,
    },
    {
      kind: "text",
      text: "Cette séparation est une bonne nouvelle. Quand tu écris une méthode, tu peux choisir tes noms de variables sans te soucier de ceux des autres méthodes : `x`, `total`, `resultat`... Aucune ne peut abîmer les cases d'une autre cuisine. Pour qu'une valeur passe d'une méthode à l'autre, il n'y a que deux chemins officiels : les paramètres qui entrent, et le `return` qui sort.",
    },
    {
      kind: "comparison",
      title: "Même nom, deux cases",
      left: {
        label: "Dans une méthode",
        text: "Cette case `x` n'existe que dans cette méthode.",
        code: { language: "java", code: "static void premiere() {\n    int x = 1;\n}" },
      },
      right: {
        label: "Dans une autre",
        text: "Une autre case `x`, sans lien avec la première. Pas de conflit.",
        code: { language: "java", code: "static void deuxieme() {\n    int x = 2;\n}" },
      },
    },
    {
      kind: "text",
      text: "Les accolades d'un `if` ou d'une boucle forment aussi une petite cuisine. Une variable déclarée **dans** un `if` disparaît à l'accolade fermante du `if`. Si tu en as besoin après, déclare-la **avant**, à l'extérieur, et modifie-la dedans. Les paramètres aussi sont des variables locales : ils n'existent que dans leur méthode.",
    },
    {
      kind: "code",
      language: "java",
      caption: "texte est déclarée dans le if : elle disparaît avant le return.",
      code: `static String mention(int note) {
    if (note >= 10) {
        String texte = "Admis";
    }
    return texte;               // ne compile pas : texte n'existe plus ici
}`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Déclarée avant le if, la case existe partout dans la méthode.",
      code: `static String mention(int note) {
    String texte = "Refusé";     // déclarée à l'extérieur du if
    if (note >= 10) {
        texte = "Admis";         // on change son contenu
    }
    return texte;                // elle existe toujours : OK
}`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "La règle en une phrase",
      text: "Une variable n'existe que dans les accolades où elle est déclarée, et seulement **après** sa déclaration. Hors de ces accolades, Java répond « cannot find symbol ».",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — Les paramètres sont des copies
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "bases-mth-l6",
  title: "Les paramètres sont des copies",
  blocks: [
    {
      kind: "text",
      text: "Voici une question qui piège beaucoup de monde. Une méthode reçoit un nombre et le modifie. Est-ce que la variable de celui qui l'a appelée change aussi ? Réponse : **non**. Quand tu appelles une méthode, Java ne lui prête pas ta case : il **recopie la valeur** dans la case du paramètre. C'est comme donner une **photocopie** de ta feuille : la méthode peut la gribouiller, ta feuille d'origine reste intacte.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La méthode modifie sa copie, pas l'original.",
      code: `static void ajouteDix(int n) {
    n = n + 10;                              // modifie la copie
    System.out.println("dedans : " + n);     // dedans : 15
}

public static void main(String[] args) {
    int age = 5;
    ajouteDix(age);
    System.out.println("dehors : " + age);   // dehors : 5
}`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Suivre les valeurs pas à pas.",
      code: `main       : age = 5
appel      : ajouteDix(age)  →  n reçoit une COPIE du 5
ajouteDix  : n = n + 10      →  n vaut 15, age vaut toujours 5
fin        : la méthode se termine, n disparaît
main       : age vaut 5`,
    },
    {
      kind: "text",
      text: "Cette règle s'appelle le **passage par valeur** : Java passe la **valeur**, pas la variable. Retiens-la pour les nombres : modifier un paramètre `int` ne change jamais la variable de l'appelant. Pour d'autres sortes de valeurs (les objets), il y a une nuance, que tu verras plus tard. Ici, on ne parle que de nombres.",
    },
    {
      kind: "text",
      text: "Le nom du paramètre n'y change rien. Même si le paramètre s'appelle `age` comme la variable de `main`, ce sont **deux cases différentes**, chacune dans sa cuisine, comme à la leçon précédente.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Même nom, mais deux cases : age reste à 5.",
      code: `static void vieillir(int age) {
    age = age + 1;              // modifie la case age de vieillir
}

public static void main(String[] args) {
    int age = 5;
    vieillir(age);
    System.out.println(age);    // 5
}`,
    },
    {
      kind: "text",
      text: "Alors comment récupérer le nouveau nombre ? Avec ce que tu sais déjà : la méthode **renvoie** le résultat avec `return`, et celui qui l'a appelée le **range** dans sa variable.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Renvoyer, puis ranger.",
      code: `static int ajouteDix(int n) {
    return n + 10;
}

public static void main(String[] args) {
    int age = 5;
    age = ajouteDix(age);       // la valeur renvoyée est rangée dans age
    System.out.println(age);    // 15
}`,
    },
    {
      kind: "comparison",
      title: "Modifier la copie ou renvoyer ?",
      left: {
        label: "Modifier le paramètre",
        text: "Seule la copie change, puis elle disparaît. **L'appelant ne voit rien.**",
        code: { language: "java", code: "n = n + 10;" },
      },
      right: {
        label: "Renvoyer et ranger",
        text: "La méthode renvoie le résultat, l'appelant le range : **sa variable change vraiment.**",
        code: { language: "java", code: "age = ajouteDix(age);" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un calcul perdu",
      text: "Une méthode `void` qui fait `n = n + 10` sur un paramètre `int` ne sert presque jamais à rien : le calcul est perdu à la fin de la méthode. Si tu veux le résultat, renvoie-le.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 7 — Une méthode qui en appelle une autre
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "bases-mth-l7",
  title: "Une méthode qui en appelle une autre",
  blocks: [
    {
      kind: "text",
      text: "Une méthode peut elle-même **appeler une autre méthode**. Une règle simple s'applique alors : la première méthode **s'arrête et attend** que la seconde ait fini, puis elle **reprend exactement là où elle s'était arrêtée**. Image : tu lis la recette de la tarte, et à la ligne 3 elle dit « prépare la pâte (voir recette B) ». Tu glisses un marque-page, tu fais la recette B en entier, puis tu reviens à ton marque-page et tu continues la tarte.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois méthodes. Que s'affiche-t-il, et dans quel ordre ?",
      code: `static void etapeA() {
    System.out.println("A début");
    etapeB();
    System.out.println("A fin");
}

static void etapeB() {
    System.out.println("B");
}

public static void main(String[] args) {
    System.out.println("main début");
    etapeA();
    System.out.println("main fin");
}`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Le même programme, pas à pas. À chaque appel, on saute dans la méthode, puis on revient.",
      code: `1. main    : affiche "main début"
2. main    : appelle etapeA()         → main attend
3. etapeA  : affiche "A début"
4. etapeA  : appelle etapeB()         → etapeA attend
5. etapeB  : affiche "B"              → etapeB se termine
6. etapeA  : reprend, affiche "A fin" → etapeA se termine
7. main    : reprend, affiche "main fin"`,
    },
    {
      kind: "text",
      text: "Remarque : l'ordre dans lequel les méthodes sont **écrites** dans le fichier n'a aucune importance. `etapeB` pourrait être écrite avant `etapeA`, ça ne changerait rien. Ce qui compte, c'est l'ordre des **appels**, qui part toujours de `main`.",
    },
    {
      kind: "text",
      text: "Une méthode peut aussi appeler plusieurs autres méthodes, ou la même plusieurs fois. À chaque appel, une nouvelle « cuisine » s'ouvre avec ses propres cases, puis elle est débarrassée quand la méthode se termine. Deux appels de la même recette ne se mélangent donc jamais : chacun repart d'une cuisine propre.",
    },
    {
      kind: "comparison",
      title: "Écrit ou exécuté ?",
      left: {
        label: "Ordre d'écriture",
        text: "L'ordre des méthodes dans le fichier. **Il ne décide de rien.**",
      },
      right: {
        label: "Ordre d'exécution",
        text: "L'ordre des appels, en partant de `main`. **C'est lui qui décide** de ce qui s'affiche.",
      },
    },
    {
      kind: "text",
      text: "Quand les méthodes renvoient des valeurs, le principe est le même : le résultat de la méthode appelée **prend la place de l'appel**, puis la méthode qui appelait continue. Dans `doubler(doubler(3))`, on calcule d'abord le **plus intérieur** : `doubler(3)` vaut 6, puis `doubler(6)` vaut 12.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les valeurs voyagent d'une méthode à l'autre.",
      code: `static int doubler(int n) {
    return n * 2;
}

static int doublePuisPlusUn(int n) {
    int d = doubler(n);     // n vaut 5 : doubler(5) vaut 10, donc d vaut 10
    return d + 1;           // renvoie 11
}

public static void main(String[] args) {
    System.out.println(doublePuisPlusUn(5));   // 11
    System.out.println(doubler(doubler(3)));   // 12 : d'abord doubler(3) = 6
}`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Comment suivre un programme à la main",
      text: "Pose ton doigt sur la première ligne de `main`. À chaque appel, saute dans la méthode, note la valeur de ses paramètres, avance ligne par ligne, puis reviens là où tu étais. Un petit tableau des valeurs aide beaucoup.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 8 — La surcharge et main
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "bases-mth-l8",
  title: "Un même nom pour plusieurs recettes, et main",
  blocks: [
    {
      kind: "text",
      text: "Imagine que tu veux calculer l'aire d'un carré (un seul côté) et celle d'un rectangle (deux côtés). Premier réflexe : deux noms, `aireCarre` et `aireRectangle`. Java permet mieux : donner **le même nom** aux deux, du moment que les **paramètres sont différents**. C'est la **surcharge**. Image : une même recette « gâteau » existe en deux versions ; selon les ingrédients que tu apportes, on fait la bonne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux méthodes aire : l'une avec un paramètre, l'autre avec deux.",
      code: `static int aire(int cote) {
    return cote * cote;
}

static int aire(int largeur, int hauteur) {
    return largeur * hauteur;
}

public static void main(String[] args) {
    System.out.println(aire(3));      // 9  : un argument → la première
    System.out.println(aire(3, 4));   // 12 : deux arguments → la seconde
}`,
    },
    {
      kind: "text",
      text: "Comment Java choisit-il ? Il regarde ce que tu donnes à l'appel : **combien** d'arguments, et de **quels types**. Tu utilises déjà une méthode surchargée : `System.out.println` accepte un nombre, un texte, un booléen... avec le même nom. Voici la même idée avec des types différents.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Même nom, mais un nombre dans un cas, un texte dans l'autre.",
      code: `static void afficher(int n) {
    System.out.println("nombre : " + n);
}

static void afficher(String t) {
    System.out.println("texte : " + t);
}

public static void main(String[] args) {
    afficher(5);          // nombre : 5
    afficher("salut");    // texte : salut
}`,
    },
    {
      kind: "comparison",
      title: "Qu'est-ce qui distingue deux méthodes de même nom ?",
      left: {
        label: "Autorisé",
        text: "Les **paramètres** diffèrent : leur nombre ou leurs types.",
        code: { language: "java", code: "int aire(int cote)\nint aire(int l, int h)" },
      },
      right: {
        label: "Refusé",
        text: "Mêmes paramètres, seul le **type de retour** change. Java ne saurait pas laquelle choisir.",
        code: { language: "java", code: "int f(int n)\ndouble f(int n)" },
      },
    },
    {
      kind: "text",
      text: "Reste `main`. Quand tu lances un programme Java, il cherche une méthode appelée exactement `public static void main(String[] args)` et commence par elle : c'est le **point d'entrée**, la porte d'entrée de la maison. On l'écrit toujours à l'identique ; ne t'occupe pas de `public` ni de `String[] args` pour l'instant. Tout le reste ne s'exécute que si `main` l'appelle, directement ou par une autre méthode. Quand `main` arrive à sa dernière ligne, le programme s'arrête.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un programme complet : tout est écrit dans un grand bloc, la classe.",
      code: `public class Programme {

    static void bonjour() {
        System.out.println("Bonjour");
    }

    public static void main(String[] args) {
        bonjour();     // sans cet appel, bonjour ne s'exécuterait jamais
    }
}`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le chapitre en sept lignes",
      text: "Méthode = recette. Paramètre = ce qui entre. `return` = ce qui sort, `void` = rien ne sort. Variable locale = vit dans ses accolades. Paramètre = copie de la valeur. Surcharge = même nom, paramètres différents. `main` = là où tout commence.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Exercices (répartis sur les leçons plus bas)
// ---------------------------------------------------------------------------

const EXERCISES: Exercise[] = [
  // ----- Leçon 1 : pourquoi des méthodes -----
  {
    kind: "mcq",
    id: "bases-mth-01",
    difficulty: 1,
    tags: ["methodes"],
    prompt: "À quoi sert une méthode ?",
    choices: [
      "À garder un nombre en mémoire pour s'en resservir plus tard.",
      "À écrire des lignes une seule fois, puis les lancer partout par leur nom.",
      "À faire tourner un programme plus vite qu'avec des lignes normales.",
      "À empêcher qu'une même ligne soit exécutée deux fois.",
    ],
    answer: 1,
    simple:
      "Une méthode, c'est une recette de cuisine : tu l'écris une fois, avec un nom, et ensuite tu dis juste « fais la recette X » chaque fois que tu en as besoin. Garder un nombre en mémoire, c'est le travail d'une variable (la case étiquetée), pas d'une méthode.",
    explanation:
      "Une méthode regroupe des instructions sous un nom : on la définit une fois et on l'appelle autant de fois qu'on veut. Cela évite de recopier du code, et un changement ne se fait qu'à un seul endroit. Garder une valeur, c'est le rôle d'une variable.",
  },
  {
    kind: "match",
    id: "bases-mth-02",
    difficulty: 1,
    tags: ["methodes", "appel"],
    prompt: "Associe chaque geste de cuisine à son équivalent en Java.",
    pairs: [
      { left: "Écrire la recette", right: "Définir la méthode" },
      { left: "Faire la recette", right: "Appeler la méthode" },
      { left: "Le titre de la recette", right: "Le nom de la méthode" },
      { left: "Une recette déjà écrite par d'autres", right: "Une méthode fournie par Java, comme `println`" },
    ],
    simple:
      "Écrire la recette sur une feuille, c'est la **définir**. La suivre pour préparer le plat, c'est l'**appeler**. Le titre de la feuille, c'est le nom de la méthode. Et `println` est une recette que d'autres ont écrite pour toi : tu l'appelles sans voir ce qu'il y a dedans.",
    explanation:
      "Définir une méthode, c'est écrire son nom et ses instructions une seule fois. L'appeler, c'est demander à Java de les exécuter. `System.out.println` est une méthode déjà écrite et fournie par Java : on l'appelle sans l'avoir définie.",
  },
  {
    kind: "recall",
    id: "bases-mth-03",
    difficulty: 1,
    tags: ["methodes"],
    prompt: "Avec tes mots : pourquoi écrit-on une méthode plutôt que de recopier les mêmes lignes à plusieurs endroits ?",
    simple:
      "Une méthode, c'est comme une recette : on l'écrit une seule fois, puis on dit juste son nom pour la refaire. Si on veut changer quelque chose, on le change dans la recette, à un seul endroit, et tous les appels profitent du changement. En recopiant, on devrait corriger chaque copie, et on en oublierait.",
    explanation:
      "On écrit les instructions **une fois**, avec un nom, puis on les appelle partout où on en a besoin. Le code est plus court, plus lisible (le nom dit ce que ça fait) et un changement ne se fait qu'à un seul endroit, au lieu de corriger chaque copie. Définir = écrire la recette ; appeler = la lancer.",
    keyPoints: [
      "On écrit les lignes une seule fois, on les lance par leur nom",
      "Un changement = une seule correction, pas une par copie",
      "Définir = écrire la recette ; appeler = la faire",
    ],
  },

  // ----- Leçon 2 : définir et appeler -----
  {
    kind: "mcq",
    id: "bases-mth-04",
    difficulty: 1,
    tags: ["methodes", "appel"],
    prompt: "Que se passe-t-il quand on lance ce programme ?",
    code: {
      language: "java",
      code: `static void direBonjour() {
    System.out.println("Bonjour !");
}

public static void main(String[] args) {
    System.out.println("Début");
}`,
    },
    choices: [
      "Il affiche `Bonjour !` puis `Début`.",
      "Il affiche `Début` puis `Bonjour !`.",
      "Il affiche seulement `Début`.",
      "Erreur : la méthode `direBonjour` n'est jamais appelée.",
    ],
    answer: 2,
    simple:
      "La recette `direBonjour` est écrite, mais personne ne l'appelle. C'est comme un livre de recettes sur l'étagère : tant que personne ne l'ouvre, aucun plat n'est préparé. Le programme ne fait donc que ce qui est écrit dans `main` : il affiche `Début`, et c'est tout.",
    explanation:
      "Définir une méthode ne l'exécute pas. Le programme démarre dans `main`, qui n'appelle pas `direBonjour` : seul `Début` est affiché. Ne pas appeler une méthode n'est pas une erreur, le programme est simplement sans effet de ce côté-là.",
  },
  {
    kind: "fill",
    id: "bases-mth-05",
    difficulty: 1,
    tags: ["methodes", "appel"],
    prompt: "Complète pour définir la méthode, puis l'appeler.",
    code: {
      language: "java",
      code: `{{1}} void direBonjour() {
    System.out.println("Bonjour !");
}

public static void main(String[] args) {
    direBonjour{{2}};
}`,
    },
    blanks: ["static", "()"],
    distractors: ["return", "[]", "{}"],
    simple:
      "Pour l'instant, on écrit `static` au début de la définition : ce sera clair plus tard. Et pour appeler la recette, on écrit son nom suivi de parenthèses, même vides : `direBonjour();`. Sans les parenthèses, Java ne comprend pas qu'on veut lancer la recette.",
    explanation:
      "La définition commence par `static void` dans nos programmes. L'appel s'écrit `nom();` : les parenthèses sont obligatoires, même sans argument. `[]` et `{}` ont d'autres rôles (tableaux, blocs) et `return` sert à renvoyer une valeur.",
  },
  {
    kind: "spot",
    id: "bases-mth-06",
    difficulty: 1,
    tags: ["methodes", "appel"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `static void direBonjour() {
    System.out.println("Bonjour !");
}

public static void main(String[] args) {
    direBonjour;
}`,
    },
    faultyLine: 6,
    reasons: [
      "Une méthode doit être appelée avant d'être définie.",
      "Il manque le mot `return` devant l'appel.",
      "Pour appeler une méthode, il faut des parenthèses : `direBonjour();`.",
      "Le nom d'une méthode ne peut pas commencer par `dire`.",
    ],
    reasonAnswer: 2,
    simple:
      "Pour lancer une recette, il ne suffit pas de dire son nom : il faut ajouter les parenthèses, comme un interrupteur qu'on actionne. `direBonjour;` ressemble à une simple étiquette, alors que `direBonjour();` dit « fais la recette maintenant ». La faute est donc à la ligne de l'appel.",
    explanation:
      "Sans parenthèses, `direBonjour;` n'est pas une instruction valable (« not a statement »). L'appel s'écrit `direBonjour();`. L'ordre des méthodes dans le fichier n'a pas d'importance, `return` n'a rien à faire ici, et le nom est parfaitement valable.",
  },

  // ----- Leçon 3 : les paramètres -----
  {
    kind: "fill",
    id: "bases-mth-07",
    difficulty: 1,
    tags: ["parametres", "methodes"],
    prompt: "Complète : la méthode reçoit un prénom (un texte), puis on la lance pour Ana.",
    code: {
      language: "java",
      code: `static void saluer({{1}} prenom) {
    System.out.println("Bonjour " + prenom);
}

public static void main(String[] args) {
    saluer({{2}});
}`,
    },
    blanks: ["String", "\"Ana\""],
    distractors: ["int", "void", "Ana"],
    simple:
      "Dans les parenthèses de la définition, on écrit une case étiquetée : son type, puis son nom. Un prénom est un texte, donc le type est `String`. À l'appel, on donne la valeur : un texte s'écrit entre guillemets, `\"Ana\"`. Sans les guillemets, Java croirait que `Ana` est le nom d'une variable.",
    explanation:
      "Le paramètre se déclare avec son type : `String prenom`. L'argument est une valeur de ce type : le littéral `\"Ana\"`. `int` est un type de nombre, `void` n'est pas un type de paramètre, et `Ana` sans guillemets désignerait une variable qui n'existe pas.",
  },
  {
    kind: "output",
    id: "bases-mth-08",
    difficulty: 1,
    tags: ["parametres", "methodes"],
    prompt: "Qu'affiche ce programme ?",
    code: {
      language: "java",
      code: `static void presente(String nom, int age) {
    System.out.println(nom + " a " + age + " ans");
}

public static void main(String[] args) {
    presente("Lea", 12);
    presente("Tom", 9);
}`,
    },
    choices: [
      "`Tom a 9 ans` puis `Lea a 12 ans`",
      "`Lea a 12 ans` puis `Tom a 9 ans`",
      "`Lea a 9 ans` puis `Tom a 12 ans`",
      "Erreur : `presente` est appelée deux fois.",
    ],
    answer: 1,
    simple:
      "Premier appel : la case `nom` reçoit `\"Lea\"`, la case `age` reçoit `12`, donc on affiche `Lea a 12 ans`. Deuxième appel : `nom` reçoit `\"Tom\"`, `age` reçoit `9`, donc `Tom a 9 ans`. Les appels s'exécutent l'un après l'autre, dans l'ordre où ils sont écrits.",
    explanation:
      "Chaque argument est rangé dans le paramètre de même position : `\"Lea\"` dans `nom`, `12` dans `age`. Les deux appels s'exécutent dans l'ordre du `main`. On peut appeler une méthode autant de fois qu'on veut.",
  },
  {
    kind: "spot",
    id: "bases-mth-09",
    difficulty: 2,
    tags: ["parametres", "types"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `static void presente(String nom, int age) {
    System.out.println(nom + " a " + age + " ans");
}

public static void main(String[] args) {
    presente(12, "Lea");
}`,
    },
    faultyLine: 6,
    reasons: [
      "Les arguments sont dans le mauvais ordre : un texte est attendu en premier, puis un nombre.",
      "L'âge doit s'écrire entre guillemets, comme un texte.",
      "Une méthode ne peut pas avoir deux paramètres.",
      "Il manque `return` à la fin de l'appel.",
    ],
    reasonAnswer: 0,
    simple:
      "La recette attend d'abord un texte (la case `nom`), puis un nombre (la case `age`). Ici, on lui donne `12` en premier : Java essaie de ranger un nombre dans la case des textes, et il refuse. L'ordre des arguments doit suivre l'ordre des cases. La définition, elle, est correcte : la faute est dans l'appel.",
    explanation:
      "Les arguments sont rangés dans les paramètres selon leur position. `12` ne peut pas aller dans un `String`, d'où l'erreur « int cannot be converted to String ». Il faut écrire `presente(\"Lea\", 12);`. Une méthode peut avoir autant de paramètres qu'on veut.",
  },
  {
    kind: "recall",
    id: "bases-mth-10",
    difficulty: 2,
    tags: ["parametres", "types"],
    prompt: "Une méthode est définie avec `presente(String nom, int age)`. Que doit respecter un appel pour que Java l'accepte ? Que se passe-t-il pour `presente(\"Lea\")` ?",
    simple:
      "Un appel doit donner à la recette tout ce qu'elle demande : autant de valeurs que de cases, dans le même ordre, et de la bonne sorte (un texte pour une case de texte, un nombre pour une case de nombre). Avec `presente(\"Lea\")`, il manque l'âge : c'est comme faire une recette en oubliant un ingrédient. Java refuse de lancer le programme.",
    explanation:
      "L'appel doit avoir le même **nombre** d'arguments que de paramètres, dans le même **ordre**, avec le bon **type** pour chacun. `presente(\"Lea\")` n'a qu'un argument pour deux paramètres : erreur de compilation (« actual and formal argument lists differ in length »), le programme ne démarre pas.",
    keyPoints: [
      "Autant d'arguments que de paramètres",
      "Même ordre, car l'argument va dans la case de même position",
      "Le bon type pour chaque case",
      "Sinon, erreur de compilation",
    ],
  },

  // ----- Leçon 4 : la valeur retournée -----
  {
    kind: "mcq",
    id: "bases-mth-11",
    difficulty: 1,
    tags: ["void", "retour"],
    prompt: "Que veut dire `void` devant le nom d'une méthode ?",
    choices: [
      "La méthode est vide : elle ne contient aucune ligne.",
      "La méthode ne renvoie aucune valeur à celui qui l'appelle.",
      "La méthode n'a pas le droit d'avoir de paramètres.",
      "La méthode ne peut être appelée qu'une seule fois.",
    ],
    answer: 1,
    simple:
      "`void` veut dire « vide ». Une méthode `void` est une recette qui fait quelque chose (par exemple afficher un message) mais qui ne te remet aucun plat à la fin. Elle peut avoir des lignes, des paramètres, et être appelée autant de fois que tu veux : simplement, elle ne renvoie rien.",
    explanation:
      "`void` est le « type de retour » d'une méthode qui ne renvoie rien. Elle peut contenir du code, avoir des paramètres et être appelée plusieurs fois. En revanche, on ne peut pas ranger son appel dans une variable.",
  },
  {
    kind: "fill",
    id: "bases-mth-12",
    difficulty: 1,
    tags: ["retour", "return"],
    prompt: "Complète pour que `doubler` renvoie le double d'un nombre entier.",
    code: {
      language: "java",
      code: `static {{1}} doubler(int n) {
    {{2}} n * 2;
}

public static void main(String[] args) {
    int resultat = doubler(4);
    System.out.println(resultat);
}`,
    },
    blanks: ["int", "return"],
    distractors: ["void", "print", "String"],
    simple:
      "La méthode doit rendre un nombre entier : à la place de `void`, on écrit donc le type du résultat, `int`. Et dans la méthode, le mot `return` envoie le résultat à celui qui l'a appelée, comme le plat qui sort de la cuisine. Ici, `doubler(4)` vaut 8 et il est rangé dans `resultat`.",
    explanation:
      "Le type de retour (`int`) remplace `void` devant le nom, et `return` suivi d'une valeur renvoie cette valeur à l'appelant. Avec `void`, la ligne `int resultat = doubler(4);` ne compilerait pas. `String` est un type de texte, `print` n'est pas un mot-clé de retour.",
  },
  {
    kind: "output",
    id: "bases-mth-13",
    difficulty: 2,
    tags: ["retour", "return", "suivre-le-code"],
    prompt: "Qu'affiche ce programme ?",
    code: {
      language: "java",
      code: `static int doubler(int n) {
    return n * 2;
}

public static void main(String[] args) {
    int a = doubler(3);
    int b = doubler(a);
    System.out.println(a + " " + b);
}`,
    },
    choices: ["`6 12`", "`3 6`", "`6 6`", "`12 24`"],
    answer: 0,
    simple:
      "Suis les valeurs ligne par ligne. `doubler(3)` renvoie 6, qui est rangé dans `a` : `a` vaut 6. Puis `doubler(a)` donne `doubler(6)`, qui renvoie 12 : `b` vaut 12. On affiche `a`, un espace, puis `b` : `6 12`.",
    explanation:
      "`a = doubler(3)` vaut 6. `b = doubler(a)` vaut `doubler(6)`, soit 12. Le `println` assemble `a`, un espace et `b` : `6 12`. Le résultat d'un premier appel peut servir d'argument au suivant.",
  },
  {
    kind: "spot",
    id: "bases-mth-14",
    difficulty: 2,
    tags: ["retour", "resultat-perdu"],
    prompt: "Ce programme compile, mais il affiche 5 alors qu'on voulait afficher 10. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `static int doubler(int n) {
    return n * 2;
}

public static void main(String[] args) {
    int x = 5;
    doubler(x);
    System.out.println(x);
}`,
    },
    faultyLine: 7,
    reasons: [
      "La méthode doit être `void` pour pouvoir modifier `x`.",
      "Le résultat de `doubler(x)` est jeté : il faut le ranger, par exemple `x = doubler(x);`.",
      "Il manque un `return` dans la méthode `doubler`.",
      "`x` doit être déclarée avant la méthode `doubler`.",
    ],
    reasonAnswer: 1,
    simple:
      "La ligne 7 prépare un plat... et le jette : `doubler(x)` calcule 10, mais personne ne garde ce résultat. `x` n'a donc pas changé et vaut toujours 5. Pour garder le plat, il faut le ranger dans une case : `x = doubler(x);`. Les lignes 1 à 3 sont correctes.",
    explanation:
      "Appeler une méthode qui renvoie une valeur sans l'utiliser est autorisé, mais le résultat est perdu. `doubler` a bien un `return`, et elle ne doit surtout pas être `void` : on veut un résultat. La correction est `x = doubler(x);`.",
  },
  {
    kind: "mcq",
    id: "bases-mth-15",
    difficulty: 2,
    tags: ["retour", "return"],
    prompt: "Pourquoi ce code ne compile-t-il pas ?",
    code: {
      language: "java",
      code: `static int carre(int n) {
    int resultat = n * n;
}`,
    },
    choices: [
      "La méthode promet un `int`, mais ne contient aucun `return`.",
      "On n'a pas le droit de créer une variable dans une méthode.",
      "Une méthode `int` doit avoir au moins deux paramètres.",
      "`n * n` doit s'écrire avec des parenthèses.",
    ],
    answer: 0,
    simple:
      "En écrivant `int` devant le nom, la méthode promet de rendre un nombre entier. Mais elle calcule `resultat` et le garde pour elle : jamais elle ne le renvoie. Java refuse une recette qui promet un plat et n'en sert aucun. Il manque la ligne `return resultat;`.",
    explanation:
      "Une méthode dont le type de retour n'est pas `void` doit renvoyer une valeur sur tous ses chemins : ici, il manque `return resultat;` (message « missing return statement »). Créer une variable locale est permis, le nombre de paramètres est libre, et `n * n` n'a pas besoin de parenthèses.",
  },

  // ----- Leçon 5 : variables locales et portée -----
  {
    kind: "spot",
    id: "bases-mth-16",
    difficulty: 1,
    tags: ["portee", "variables-locales"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `static void calcule() {
    int total = 10;
}

public static void main(String[] args) {
    calcule();
    System.out.println(total);
}`,
    },
    faultyLine: 7,
    reasons: [
      "`total` doit être déclarée avant la méthode `calcule`.",
      "`println` n'accepte pas de variable.",
      "`total` n'existe que dans `calcule` : `main` ne peut pas la voir.",
      "Il faut écrire `calcule(total);` pour récupérer la valeur.",
    ],
    reasonAnswer: 2,
    simple:
      "La case `total` est posée sur le plan de travail de `calcule`. Quand cette méthode se termine, on débarrasse tout : `total` n'existe plus. `main` travaille dans une autre cuisine et ne l'a jamais vue. La faute est à la ligne 7, qui cherche une case qui n'existe pas chez `main`.",
    explanation:
      "Une variable locale n'existe que dans les accolades où elle est déclarée. `main` ne connaît pas `total` : « cannot find symbol ». Pour récupérer la valeur, `calcule` doit la renvoyer avec `return`, et `main` la range dans sa propre variable.",
  },
  {
    kind: "output",
    id: "bases-mth-17",
    difficulty: 2,
    tags: ["portee", "variables-locales"],
    prompt: "Qu'affiche ce programme ?",
    code: {
      language: "java",
      code: `static void premiere() {
    int x = 1;
    System.out.println(x);
}

static void deuxieme() {
    int x = 2;
    System.out.println(x);
}

public static void main(String[] args) {
    premiere();
    deuxieme();
    premiere();
}`,
    },
    choices: [
      "`1` puis `2` puis `2`",
      "`1` puis `1` puis `1`",
      "Erreur : `x` est déclaré deux fois.",
      "`1` puis `2` puis `1`",
    ],
    answer: 3,
    simple:
      "Chaque méthode a sa propre cuisine et sa propre case `x`. `premiere` crée un `x` qui vaut 1, l'affiche, puis le débarrasse. `deuxieme` crée un autre `x` qui vaut 2. À chaque appel de `premiere`, on repart de zéro avec un `x` qui vaut 1. On lit donc : 1, 2, 1.",
    explanation:
      "Les deux `x` sont des variables locales distinctes, sans aucun lien : pas de conflit de nom. Chaque appel de `premiere` recrée son `x` à 1, car la variable a disparu à la fin de l'appel précédent. Affichage : `1`, `2`, `1`.",
  },
  {
    kind: "fill",
    id: "bases-mth-18",
    difficulty: 2,
    tags: ["portee", "variables-locales"],
    prompt: "Complète : `texte` doit être déclarée avant le `if` pour exister encore au `return`.",
    code: {
      language: "java",
      code: `static String mention(int note) {
    {{1}} texte = "Refusé";
    if (note >= 10) {
        texte = "Admis";
    }
    return {{2}};
}`,
    },
    blanks: ["String", "texte"],
    distractors: ["int", "note", "void"],
    simple:
      "La case `texte` est créée en dehors du `if` : elle existe donc jusqu'à la fin de la méthode. Dans le `if`, on ne fait que changer son contenu. Ce qu'elle contient est un mot, donc son type est `String`. Au `return`, on renvoie le contenu de cette case : `texte`.",
    explanation:
      "Déclarée avant le `if`, la variable vit dans les accolades de la méthode entière : le `if` peut la modifier et le `return` la lire. Son type est `String` car elle contient un texte, et on renvoie `texte`, pas `note` (un `int`).",
  },

  // ----- Leçon 6 : les paramètres sont des copies -----
  {
    kind: "output",
    id: "bases-mth-19",
    difficulty: 2,
    tags: ["passage-par-valeur", "copie"],
    prompt: "Qu'affiche ce programme ?",
    code: {
      language: "java",
      code: `static void ajouteDix(int n) {
    n = n + 10;
    System.out.println("dedans : " + n);
}

public static void main(String[] args) {
    int age = 5;
    ajouteDix(age);
    System.out.println("dehors : " + age);
}`,
    },
    choices: [
      "`dedans : 15` puis `dehors : 15`",
      "`dedans : 5` puis `dehors : 15`",
      "`dedans : 15` puis `dehors : 5`",
      "`dedans : 5` puis `dehors : 5`",
    ],
    answer: 2,
    simple:
      "Quand on appelle `ajouteDix(age)`, Java photocopie le 5 dans la case `n`. La méthode gribouille sa photocopie : `n` passe à 15 (on l'affiche : `dedans : 15`). Puis la méthode se termine et la photocopie disparaît. La feuille d'origine, `age`, n'a jamais bougé : elle vaut toujours 5.",
    explanation:
      "Passage par valeur : `n` reçoit une copie de la valeur de `age`. Modifier `n` ne touche pas `age`. À l'intérieur on affiche 15 ; dans `main`, `age` vaut toujours 5.",
  },
  {
    kind: "mcq",
    id: "bases-mth-20",
    difficulty: 2,
    tags: ["passage-par-valeur", "retour"],
    prompt: "Dans `main`, `age` vaut 5. Quelle ligne le fait vraiment passer à 15 ?",
    code: {
      language: "java",
      code: `static int ajouteDix(int n) {
    return n + 10;
}`,
    },
    choices: [
      "`ajouteDix(age);`",
      "`age = ajouteDix(age);`",
      "`int n = ajouteDix(age);`",
      "`return ajouteDix(age);`",
    ],
    answer: 1,
    simple:
      "`ajouteDix(age)` calcule 15, mais c'est un plat qu'il faut ranger. Seule la ligne `age = ajouteDix(age);` remet ce 15 dans la case `age`. La ligne `ajouteDix(age);` jette le résultat ; `int n = ...` le range dans une autre case, et `age` reste à 5 ; `return` n'a pas sa place dans `main`.",
    explanation:
      "Un paramètre est une copie : seule l'affectation `age = ajouteDix(age);` modifie la variable de `main`. `ajouteDix(age);` jette le résultat, `int n = ...` crée une autre variable et laisse `age` à 5, et `return ajouteDix(age);` ne compile pas car `main` est `void`.",
  },
  {
    kind: "recall",
    id: "bases-mth-21",
    difficulty: 2,
    tags: ["passage-par-valeur", "copie"],
    prompt: "Une méthode `void` modifie son paramètre `int n`. Pourquoi la variable de l'appelant ne change-t-elle pas ? Comment faire pour que l'appelant récupère le nouveau nombre ?",
    simple:
      "Quand on appelle une méthode, Java ne lui prête pas ta case : il en fait une photocopie de la valeur, dans la case du paramètre. La méthode gribouille sa photocopie, qui disparaît à la fin ; ta feuille d'origine n'a pas bougé. Pour récupérer le résultat, la méthode le renvoie avec `return`, et toi tu le ranges : `age = ajouteDix(age);`.",
    explanation:
      "Java utilise le **passage par valeur** : le paramètre reçoit une copie de la valeur, c'est une autre variable. La modifier ne change pas la variable de l'appelant, et elle disparaît à la fin de la méthode. Pour transmettre le résultat : la méthode renvoie la valeur (`return`) et l'appelant la range dans sa variable (`age = ajouteDix(age);`).",
    keyPoints: [
      "Le paramètre est une copie de la valeur, pas la variable de l'appelant",
      "Modifier la copie ne change pas l'original",
      "Solution : `return` dans la méthode",
      "L'appelant range le résultat : `age = ajouteDix(age);`",
    ],
  },

  // ----- Leçon 7 : une méthode qui en appelle une autre -----
  {
    kind: "order",
    id: "bases-mth-22",
    difficulty: 2,
    tags: ["execution", "appel", "retour"],
    prompt: "La méthode `static int doubler(int n) { return n * 2; }` existe. Dans `main`, Java arrive à la ligne `int r = doubler(4);`. Remets les étapes dans l'ordre.",
    items: [
      "`main` s'arrête sur la ligne et attend",
      "Le paramètre `n` reçoit une copie de 4",
      "La méthode `doubler` s'exécute jusqu'à `return n * 2;`",
      "L'appel `doubler(4)` est remplacé par la valeur 8",
      "`8` est rangé dans `r` et `main` continue à la ligne suivante",
    ],
    simple:
      "C'est le marque-page de la recette : `main` met son marque-page et attend. Java donne à `doubler` une copie du 4, puis la recette se déroule jusqu'au `return`, qui sert le plat : 8. Le plat prend la place de l'appel, il est rangé dans `r`, et `main` reprend à son marque-page.",
    explanation:
      "Un appel suspend l'appelant, copie les arguments dans les paramètres, exécute la méthode jusqu'à `return`, puis la valeur renvoyée prend la place de l'appel dans l'expression de l'appelant, qui reprend là où il s'était arrêté.",
  },
  {
    kind: "output",
    id: "bases-mth-23",
    difficulty: 2,
    tags: ["execution", "appel", "suivre-le-code"],
    prompt: "Qu'affiche ce programme ? Chaque `println` écrit sur sa propre ligne : donne les chiffres dans l'ordre.",
    code: {
      language: "java",
      code: `static void haut() {
    System.out.println("1");
    milieu();
    System.out.println("2");
}

static void milieu() {
    System.out.println("3");
    bas();
}

static void bas() {
    System.out.println("4");
}

public static void main(String[] args) {
    System.out.println("5");
    haut();
}`,
    },
    choices: ["`5 1 3 4 2`", "`1 3 4 2 5`", "`5 1 2 3 4`", "`1 2 3 4 5`"],
    answer: 0,
    simple:
      "On part de `main`, pas de la première méthode écrite. `main` affiche 5, puis appelle `haut`. `haut` affiche 1 et appelle `milieu`, qui affiche 3 et appelle `bas`, qui affiche 4 et se termine. On revient dans `milieu` (rien à faire), puis dans `haut`, qui affiche 2. Ordre : 5, 1, 3, 4, 2.",
    explanation:
      "L'exécution commence par `main`, pas par la première méthode du fichier. Chaque appel suspend l'appelant jusqu'à la fin de la méthode appelée : `5`, puis `1`, `3`, `4` dans l'ordre des appels, et enfin `2`, quand `haut` reprend après le retour de `milieu`.",
  },
  {
    kind: "output",
    id: "bases-mth-24",
    difficulty: 3,
    tags: ["execution", "retour", "suivre-le-code"],
    prompt: "Qu'affiche ce programme ?",
    code: {
      language: "java",
      code: `static int doubler(int n) {
    return n * 2;
}

static int plusUn(int n) {
    return n + 1;
}

public static void main(String[] args) {
    int r = doubler(plusUn(3));
    System.out.println(r);
    System.out.println(plusUn(doubler(3)));
}`,
    },
    choices: [
      "`7` puis `8`",
      "`8` puis `8`",
      "`8` puis `7`",
      "`7` puis `7`",
    ],
    answer: 2,
    simple:
      "Quand un appel est dans un autre, on commence par l'intérieur. Pour `doubler(plusUn(3))` : `plusUn(3)` vaut 4, puis `doubler(4)` vaut 8. Pour `plusUn(doubler(3))` : `doubler(3)` vaut 6, puis `plusUn(6)` vaut 7. On affiche donc 8, puis 7 : l'ordre des appels change le résultat.",
    explanation:
      "Les arguments sont calculés avant l'appel : on évalue d'abord l'appel le plus intérieur. `doubler(plusUn(3))` = `doubler(4)` = 8 ; `plusUn(doubler(3))` = `plusUn(6)` = 7. Les deux méthodes ne commutent pas.",
  },
  {
    kind: "recall",
    id: "bases-mth-25",
    difficulty: 3,
    tags: ["execution", "retour", "suivre-le-code"],
    prompt: "Suis ce programme à la main. Que valent `x` et `y`, et qu'affiche la dernière ligne ? Explique dans quel ordre Java passe d'une méthode à l'autre.",
    code: {
      language: "java",
      code: `static int ajoute(int a, int b) {
    return a + b;
}

static int triple(int n) {
    return n * 3;
}

public static void main(String[] args) {
    int x = ajoute(2, 3);
    int y = triple(x);
    System.out.println(y - ajoute(1, 1));
}`,
    },
    simple:
      "On part de `main`. `ajoute(2, 3)` renvoie 5 : `x` vaut 5. `triple(x)` reçoit une copie de 5 et renvoie 15 : `y` vaut 15. Dans le `println`, on calcule d'abord `ajoute(1, 1)` qui vaut 2, puis 15 - 2 = 13. Chaque appel suspend `main`, qui reprend quand la méthode a renvoyé son résultat.",
    explanation:
      "`x = ajoute(2, 3)` = 5. `y = triple(5)` = 15. Dans `println(y - ajoute(1, 1))`, l'appel `ajoute(1, 1)` vaut 2, donc `15 - 2` = 13 s'affiche. Chaque appel suspend `main` ; la valeur renvoyée prend la place de l'appel et `main` reprend là où il s'était arrêté.",
    keyPoints: [
      "On part de `main`, ligne par ligne",
      "x vaut 5 (ajoute(2, 3)), y vaut 15 (triple(5))",
      "ajoute(1, 1) vaut 2 : l'appel est remplacé par sa valeur",
      "Affiche 13 ; chaque appel suspend l'appelant jusqu'au retour",
    ],
  },

  // ----- Leçon 8 : surcharge et main -----
  {
    kind: "output",
    id: "bases-mth-26",
    difficulty: 2,
    tags: ["surcharge", "methodes"],
    prompt: "Qu'affiche ce programme ?",
    code: {
      language: "java",
      code: `static String decrire(int n) {
    return "entier " + n;
}

static String decrire(String t) {
    return "texte " + t;
}

public static void main(String[] args) {
    System.out.println(decrire(4));
    System.out.println(decrire("4"));
}`,
    },
    choices: [
      "`entier 4` puis `entier 4`",
      "`texte 4` puis `entier 4`",
      "Erreur : deux méthodes portent le même nom.",
      "`entier 4` puis `texte 4`",
    ],
    answer: 3,
    simple:
      "Les deux recettes s'appellent `decrire`, mais elles attendent des ingrédients différents : un nombre pour l'une, un texte pour l'autre. Java regarde ce que tu apportes. `4` est un nombre : il fait la première, `entier 4`. `\"4\"` entre guillemets est un texte : il fait la seconde, `texte 4`.",
    explanation:
      "C'est de la **surcharge** : même nom, paramètres différents (ici `int` et `String`). Java choisit la version selon le type de l'argument : `decrire(4)` appelle la version `int`, `decrire(\"4\")` la version `String`. Ce n'est pas une erreur.",
  },
  {
    kind: "match",
    id: "bases-mth-27",
    difficulty: 2,
    tags: ["methodes", "vocabulaire"],
    prompt: "Associe chaque mot du chapitre à son sens.",
    pairs: [
      { left: "`return`", right: "Renvoie une valeur à l'appelant et arrête la méthode" },
      { left: "Paramètre", right: "Case dans la définition, qui reçoit une copie de l'argument" },
      { left: "Variable locale", right: "N'existe que dans les accolades où elle est déclarée" },
      { left: "Surcharge", right: "Même nom de méthode, paramètres différents" },
      { left: "`main`", right: "Le point d'entrée : là où le programme démarre" },
    ],
    simple:
      "`return`, c'est le plat qui sort de la cuisine. Le paramètre, c'est la case vide qui attend l'ingrédient, et elle reçoit une photocopie. La variable locale vit sur le plan de travail et disparaît à la fin de la recette. La surcharge, c'est un même nom de recette avec des ingrédients différents. `main`, c'est la porte d'entrée du programme.",
    explanation:
      "Récapitulatif du chapitre : `return` renvoie une valeur et termine la méthode ; le paramètre est une variable locale initialisée par une copie de l'argument ; la portée d'une variable se limite à ses accolades ; la surcharge distingue les méthodes par leurs paramètres ; `main` est la méthode par laquelle Java commence.",
  },
  {
    kind: "recall",
    id: "bases-mth-28",
    difficulty: 3,
    tags: ["surcharge", "main", "methodes"],
    prompt: "Qu'est-ce que la surcharge ? Donne un exemple. Puis dis quelle méthode Java lance en premier quand on démarre un programme.",
    simple:
      "La surcharge, c'est donner le même nom à plusieurs recettes qui attendent des ingrédients différents : par exemple `aire(3)` pour un carré (un nombre) et `aire(3, 4)` pour un rectangle (deux nombres). Java choisit selon ce que tu lui donnes. Mais il ne suffit pas de changer ce que la recette rend : les ingrédients doivent changer. Et tout programme démarre dans `main`.",
    explanation:
      "La **surcharge** consiste à définir plusieurs méthodes de même nom dont les paramètres diffèrent (nombre ou types) : `aire(int cote)` et `aire(int largeur, int hauteur)`. Java choisit la version d'après les arguments de l'appel. Changer seulement le type de retour ne suffit pas : l'appel serait ambigu. Au démarrage, Java lance `public static void main(String[] args)`, le point d'entrée.",
    keyPoints: [
      "Même nom, paramètres différents (nombre ou types)",
      "Java choisit selon les arguments de l'appel",
      "Le type de retour seul ne suffit pas à distinguer",
      "`main` est le point d'entrée du programme",
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
  id: "bases-methodes",
  format: "doux",
  title: "Les méthodes",
  objective:
    "Savoir écrire et appeler une méthode, comprendre ce qui entre (les paramètres) et ce qui sort (la valeur retournée), et savoir où vivent les variables.",
  prerequisites: ["bases-controle"],
  units: [
    l1, ...pick("bases-mth-01", "bases-mth-02", "bases-mth-03"),
    l2, ...pick("bases-mth-04", "bases-mth-05", "bases-mth-06"),
    l3, ...pick("bases-mth-07", "bases-mth-08", "bases-mth-09", "bases-mth-10"),
    l4, ...pick("bases-mth-11", "bases-mth-12", "bases-mth-13", "bases-mth-14", "bases-mth-15"),
    l5, ...pick("bases-mth-16", "bases-mth-17", "bases-mth-18"),
    l6, ...pick("bases-mth-19", "bases-mth-20", "bases-mth-21"),
    l7, ...pick("bases-mth-22", "bases-mth-23", "bases-mth-24", "bases-mth-25"),
    l8, ...pick("bases-mth-26", "bases-mth-27", "bases-mth-28"),
  ],
};
