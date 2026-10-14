/**
 * Fondations — Variables, types et opérations : déclarer une variable (la case
 * étiquetée), les types de base, les opérations, afficher et suivre un programme
 * pas à pas, comparer et combiner, convertir.
 * 6 leçons, 28 exercices — format doux, écrit pour quelqu'un qui reprend les
 * bases de zéro : la difficulté monte leçon après leçon, et chaque exercice est
 * précédé de la leçon qui enseigne ce qu'il demande.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Une variable, c'est une case étiquetée
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "bases-var-l1",
  title: "Une variable, c'est une case étiquetée",
  blocks: [
    {
      kind: "text",
      text: "Un programme doit retenir des choses : ton score, le prix d'un article, un prénom. Pour ça, Java te donne des **variables**. Imagine une **case** de rangement avec une **étiquette** collée dessus. L'étiquette, c'est le **nom** de la variable (par exemple `score`). Dans la case, il y a une **valeur** : par exemple le nombre 10. Quand tu as besoin de cette valeur, tu appelles la case par son nom, et Java va lire ce qu'il y a dedans.",
    },
    {
      kind: "text",
      text: "Pour créer une case, on la **déclare** : on écrit d'abord son **type** (ce que la case a le droit de contenir), puis son nom. Pour y poser une valeur, on utilise le signe `=`. Ici, `int` veut dire « un nombre entier » ; on verra les autres types à la leçon suivante. Le point-virgule `;` termine chaque instruction, comme un point termine une phrase. Ensuite, `System.out.println(...)` **affiche** à l'écran ce qu'on met entre les parenthèses.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Créer la case, puis lire ce qu'elle contient.",
      code: `int score = 10;               // on crée la case "score" et on y pose 10
System.out.println(score);    // affiche : 10`,
    },
    {
      kind: "text",
      text: "Attention au signe `=`. En maths, il veut dire « est égal à ». En Java, il veut dire « **range ce qui est à droite dans la case de gauche** ». Lis-le comme une flèche : `score = 10` signifie « mets 10 dans la case `score` ». Le nom de la case est à gauche, la valeur à droite. Et quand on met le nom d'une case dans `println`, Java n'affiche pas le nom : il affiche **ce qu'il y a dedans**.",
    },
    {
      kind: "text",
      text: "Une variable peut **changer de valeur** : c'est pour ça qu'elle s'appelle « variable ». Quand tu ranges une nouvelle valeur, l'ancienne est **effacée** : une case ne contient qu'une seule chose à la fois. Et on n'écrit plus le type, puisque la case existe déjà. Regarde le code ligne après ligne, et imagine la case dans ta tête.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Même case, deux valeurs l'une après l'autre.",
      code: `int score = 10;              // la case score contient 10
score = 25;                  // elle contient maintenant 25 (le 10 a disparu)
System.out.println(score);   // affiche : 25`,
    },
    {
      kind: "text",
      text: "Voici l'erreur classique : écrire le type une deuxième fois. Java croit que tu veux créer une **deuxième** case qui porte le même nom, et il refuse. Écris le type seulement la première fois, quand tu crées la case.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ne marche pas : la case score existe déjà.",
      code: `int score = 10;
int score = 25;     // erreur : la variable score est déjà définie`,
    },
    {
      kind: "comparison",
      title: "Créer ou changer ?",
      left: {
        label: "Avec le type devant",
        text: "On **crée** une nouvelle case. C'est possible une seule fois pour un même nom.",
        code: { language: "java", code: "int score = 10;" },
      },
      right: {
        label: "Sans le type",
        text: "On **change** la valeur d'une case qui existe déjà.",
        code: { language: "java", code: "score = 25;" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : une case vide n'est pas un zéro",
      text: "On peut créer une case sans rien dedans (`int total;`), mais Java refuse de la lire tant que tu n'y as rien rangé. Une case vide n'est pas un zéro : donne toujours une valeur de départ avant de t'en servir.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "Le type s'écrit une seule fois, à la création de la case. Pour le nom : pas d'espace, une minuscule au début, et si tu mets plusieurs mots, une majuscule au début des suivants (`nombreDeVies`).",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — Les types de base : on choisit ce que la case peut contenir
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "bases-var-l2",
  title: "Les types de base : choisir ce que la case contient",
  blocks: [
    {
      kind: "text",
      text: "Une case n'accepte pas n'importe quoi. Chaque case a un **type** qui dit ce qu'on a le droit d'y ranger, comme un casier à bouteilles n'est pas fait pour ranger des chaussures. Java vérifie ça **avant** de lancer le programme : si tu ranges la mauvaise chose, il refuse et te dit où. C'est utile : une erreur de rangement est repérée tout de suite, pas trois semaines plus tard chez un utilisateur. Il y a cinq types à connaître pour commencer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Cinq cases, cinq types.",
      code: `int age = 25;               // un nombre entier
double prix = 9.99;         // un nombre à virgule (avec un point)
boolean ouvert = true;      // vrai ou faux : seulement true ou false
char lettre = 'A';          // UNE lettre, entre apostrophes
String prenom = "Lea";      // du texte, entre guillemets`,
    },
    {
      kind: "text",
      text: "Quelques détails qui comptent. Un `double` s'écrit avec un **point** : `9.99`, jamais `9,99`. Un `boolean` ne connaît que deux valeurs : `true` (vrai) et `false` (faux). Un `char` contient **une seule** lettre, entre **apostrophes** : `'A'`. Un `String` contient du **texte**, entre **guillemets** : `\"Lea\"`. `String` s'écrit avec une majuscule, car c'est un type un peu spécial (tu verras pourquoi au chapitre sur les objets).",
    },
    {
      kind: "text",
      text: "Regardons trois mauvais rangements. À chaque ligne, la valeur ne correspond pas au type de la case. Java refuse de **compiler**, c'est-à-dire de préparer ton programme pour le lancer : tu reçois un message d'erreur au lieu d'un résultat.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ne marche pas : la valeur ne va pas dans la case.",
      code: `int age = 2.5;          // erreur : 2.5 n'est pas un nombre entier
int nombre = "12";      // erreur : "12" est du texte, pas un nombre
char lettre = "A";      // erreur : une lettre se met entre apostrophes`,
    },
    {
      kind: "text",
      text: "La correction consiste à choisir la case qui convient à la valeur. **La règle** : le type de la case doit correspondre à ce qu'on y range. Pour choisir, pose-toi la question : est-ce un entier, un nombre à virgule, un vrai/faux, une lettre ou du texte ?",
    },
    {
      kind: "code",
      language: "java",
      caption: "Corrigé : chaque valeur dans la bonne case.",
      code: `double note = 2.5;      // un nombre à virgule : double
String texte = "12";    // du texte : String
char lettre = 'A';      // une lettre : char, avec des apostrophes`,
    },
    {
      kind: "comparison",
      title: "Un nombre ou du texte ?",
      left: {
        label: "12 sans guillemets",
        text: "Un **nombre** (`int`). On peut calculer avec : `12 + 1` vaut 13.",
        code: { language: "java", code: "int a = 12;" },
      },
      right: {
        label: "\"12\" avec guillemets",
        text: "Du **texte** (`String`) qui ressemble à un nombre. On ne calcule pas avec.",
        code: { language: "java", code: 'String b = "12";' },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Comment choisir",
      text: "Un prix se range en `double` (il a des centimes), un âge en `int`. Un code postal ou un numéro de téléphone se range plutôt en `String` : on ne calcule pas avec, et un `int` ne garde pas le zéro du début (06 deviendrait 6).",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — Les opérations
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "bases-var-l3",
  title: "Les opérations : calculer et coller",
  blocks: [
    {
      kind: "text",
      text: "Un programme sert à calculer. Java connaît les quatre opérations : `+`, `-`, `*` (multiplier) et `/` (diviser). Il en a une cinquième, `%`, qui donne le **reste** d'une division. Avec des nombres entiers (`int`), il y a une surprise : `/` ne donne **que des entiers**. Java garde la partie entière du résultat et jette ce qui est après la virgule. `7 / 2` ne vaut pas 3,5 : ça vaut **3**.",
    },
    {
      kind: "text",
      text: "Pense à partager des bonbons. Avec 7 bonbons pour 2 enfants, chacun en reçoit 3, et il en reste 1. La division `7 / 2` donne le nombre de bonbons par enfant (3). Le reste `7 % 2` donne ce qui reste (1). C'est pratique pour convertir des minutes en heures : 135 minutes, c'est 2 heures entières (`135 / 60`) et 15 minutes qui restent (`135 % 60`).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Diviser et garder le reste.",
      code: `int minutes = 135;
int heures = minutes / 60;     // 2  : 2 heures entières
int reste = minutes % 60;      // 15 : et il reste 15 minutes`,
    },
    {
      kind: "text",
      text: "Cette division qui jette les décimales cause un piège classique : la moyenne. Les notes 15 et 12 ont pour moyenne 13,5. Mais avec des entiers, le `0,5` disparaît. Pour le garder, il suffit qu'**un des deux nombres soit à virgule** : Java calcule alors avec des virgules. Il faut aussi une case `double` pour ranger 13.5.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Entiers : on perd la virgule. Avec un nombre à virgule : on la garde.",
      code: `int somme = 15 + 12;           // 27
int moyenne = somme / 2;       // 13   : le 0,5 a disparu !
double juste = somme / 2.0;    // 13.5 : 2.0 est à virgule, donc le résultat aussi`,
    },
    {
      kind: "text",
      text: "Java respecte les priorités des maths : `*`, `/` et `%` sont faits **avant** `+` et `-`. Les **parenthèses** passent avant tout. Et quand deux opérations ont la même priorité, Java lit **de gauche à droite**.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Qui passe en premier ?",
      code: `int a = 2 + 3 * 4;         // 14 : d'abord 3 * 4 = 12, puis 2 + 12
int b = (2 + 3) * 4;       // 20 : les parenthèses d'abord, puis 5 * 4
int c = 10 - 2 * 3 + 4;    // 8  : 10 - 6 + 4, de gauche à droite`,
    },
    {
      kind: "text",
      text: "Dernier point : le `+` n'a pas le même sens partout. Entre deux nombres, il **additionne**. Dès qu'un côté est du texte, il **colle** (on dit **concaténer**) : le nombre est transformé en texte et collé à la suite. Comme Java lit de gauche à droite, l'ordre change le résultat.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Additionner ou coller, selon ce qu'il y a à gauche.",
      code: `String a = "Note : " + 2 + 3;      // "Note : 23" : colle 2, puis colle 3
String b = 2 + 3 + " points";      // "5 points"  : 2 + 3 = 5, puis colle
String c = "Note : " + (2 + 3);    // "Note : 5"  : la parenthèse calcule d'abord`,
    },
    {
      kind: "comparison",
      title: "Additionner ou coller ?",
      left: {
        label: "Deux nombres",
        text: "`+` **additionne**. Le résultat est un nombre.",
        code: { language: "java", code: "2 + 3      // 5" },
      },
      right: {
        label: "Du texte quelque part",
        text: "`+` **colle**. Le résultat est du texte.",
        code: { language: "java", code: '"2" + "3"  // "23"' },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : entier divisé par entier",
      text: "`int / int` donne toujours un entier, même si tu ranges le résultat dans un `double`. Pour garder les décimales, au moins un des deux nombres doit déjà être à virgule.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — Afficher et suivre un programme pas à pas
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "bases-var-l4",
  title: "Afficher et suivre un programme pas à pas",
  blocks: [
    {
      kind: "text",
      text: "Écrire du code, c'est une chose. **Lire** un programme et dire ce qu'il fait sans le lancer, c'est ce qu'on te demandera en entretien, et c'est aussi la meilleure façon de trouver un bug. Pour ça, on **joue l'ordinateur** : on lit les lignes **une par une, de haut en bas**, et on note ce que contient chaque case après chaque ligne. Pas de saut, pas de devinette. Commençons par bien comprendre ce que l'écran affiche.",
    },
    {
      kind: "text",
      text: "`System.out.println(...)` affiche ce qu'il y a entre les parenthèses, puis passe à la ligne (`ln` vient de *line*, « ligne »). Ce qui est entre **guillemets** est du texte, affiché tel quel. Ce qui est **sans guillemets** est un nom de case : Java affiche son contenu. Avec `+`, on peut coller du texte et des valeurs, comme à la leçon précédente.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le mot, ou ce qu'il y a dans la case.",
      code: `int age = 25;
System.out.println("age");                    // affiche : age
System.out.println(age);                      // affiche : 25
System.out.println("J'ai " + age + " ans");   // affiche : J'ai 25 ans`,
    },
    {
      kind: "comparison",
      title: "Guillemets ou pas ?",
      left: {
        label: "Avec guillemets",
        text: "C'est du **texte**. Java l'affiche tel quel, mot pour mot.",
        code: { language: "java", code: 'System.out.println("age");' },
      },
      right: {
        label: "Sans guillemets",
        text: "C'est le **nom d'une case**. Java affiche ce qu'il y a dedans.",
        code: { language: "java", code: "System.out.println(age);" },
      },
    },
    {
      kind: "text",
      text: "Une ligne déroute souvent les débutants : `a = a + b;`. Si `=` veut dire « range à gauche », comment une case peut-elle être des deux côtés ? Règle : Java calcule **d'abord le côté droit**, avec les valeurs que les cases ont **à ce moment-là**, puis il range le résultat dans la case de gauche. L'ancienne valeur est effacée. Suivons ça dans un tableau : une ligne de code, une ligne du tableau.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le programme.",
      code: `int a = 4;
int b = 3;
a = a + b;      // 4 + 3 = 7, rangé dans a
b = a - b;      // 7 - 3 = 4, rangé dans b (a vaut 7 maintenant)
System.out.println(a + " " + b);`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Le tableau : la valeur de chaque case après chaque ligne.",
      code: `après la ligne          a    b
int a = 4;              4    -
int b = 3;              4    3
a = a + b;              7    3
b = a - b;              7    4
println(a + " " + b)    affiche : 7 4`,
    },
    {
      kind: "text",
      text: "Autre piège : une case n'existe qu'**à partir de la ligne** où on la crée. L'utiliser avant, c'est chercher dans un tiroir qui n'est pas encore installé. La correction : créer chaque case **avant** de s'en servir.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ne marche pas : hauteur est utilisée avant d'exister.",
      code: `int largeur = 4;
int aire = largeur * hauteur;   // erreur : hauteur n'existe pas encore
int hauteur = 3;`,
    },
    {
      kind: "code",
      language: "java",
      caption: "Corrigé : on crée hauteur d'abord.",
      code: `int largeur = 4;
int hauteur = 3;
int aire = largeur * hauteur;   // 12`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Raccourcis que tu croiseras",
      text: "`score += 5;` veut dire `score = score + 5;` et `score++;` veut dire `score = score + 1;`. Ce sont des raccourcis : dans le tableau, tu les suis exactement de la même façon.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — Comparer et combiner
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "bases-var-l5",
  title: "Comparer et combiner : vrai ou faux",
  blocks: [
    {
      kind: "text",
      text: "Un programme doit souvent répondre par oui ou non : « l'utilisateur est-il majeur ? », « le stock est-il vide ? ». Une **comparaison** pose cette question à Java, et il répond par un `boolean` : `true` (oui) ou `false` (non). Cette réponse se range dans une case `boolean`, comme n'importe quelle valeur. Six signes à connaître : `==` (égal à), `!=` (différent de), `<` (plus petit), `>` (plus grand), `<=` (plus petit ou égal) et `>=` (plus grand ou égal).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Chaque comparaison répond true ou false.",
      code: `int age = 20;
boolean a = age == 20;    // true  : 20 est égal à 20
boolean b = age != 20;    // false : 20 n'est pas différent de 20
boolean c = age < 18;     // false : 20 n'est pas plus petit que 18
boolean d = age >= 18;    // true  : 20 est plus grand ou égal à 18`,
    },
    {
      kind: "text",
      text: "Le piège numéro un : confondre `=` et `==`. Un seul `=` **range** une valeur, il ne compare pas. Pour demander « est-ce égal ? », il en faut deux. Remarque aussi l'ordre des signes : on écrit `>=` et `<=`, jamais `=>` ni `=<`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ne marche pas, puis corrigé.",
      code: `int age = 20;
boolean a = (age = 20);    // erreur : = range 20 dans la case, ce n'est pas une question
boolean b = (age == 20);   // true   : == pose la question « est-ce égal à 20 ? »`,
    },
    {
      kind: "text",
      text: "On peut aussi **combiner** des réponses. `&&` veut dire « et » : vrai seulement si les **deux** côtés sont vrais. `||` veut dire « ou » : vrai si **au moins un** côté est vrai. `!` veut dire « non » : il **inverse** la réponse. Voici comment s'en servir, puis un petit tableau à connaître.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Combiner des réponses.",
      code: `int age = 20;
boolean majeur = age >= 18;                 // true
boolean etudiant = true;
boolean tarifReduit = majeur && etudiant;   // true  : les DEUX sont vrais
boolean gratuit = age < 6 || age >= 65;     // false : aucun des deux n'est vrai
boolean mineur = !majeur;                   // false : le contraire de true`,
    },
    {
      kind: "text",
      text: "Pour lire une combinaison, fais-la en deux temps, comme dans un tableau de valeurs. Prenons `age < 6 || age >= 65` avec `age` qui vaut 20. D'abord chaque question séparément : « 20 < 6 » est faux, « 20 >= 65 » est faux. Ensuite, on relie les deux réponses : `false || false` donne `false`, car aucun côté n'est vrai. Si une parenthèse précède un `!`, on calcule d'abord ce qu'il y a dedans, puis on inverse.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le tableau des combinaisons.",
      code: `true  && true   ->  true
true  && false  ->  false
false && false  ->  false
true  || false  ->  true
false || false  ->  false
!true           ->  false
!false          ->  true`,
    },
    {
      kind: "comparison",
      title: "&& ou || ?",
      left: {
        label: "&& (et)",
        text: "Les **deux** doivent être vrais. Comme une porte à deux serrures : il faut ouvrir les deux.",
        code: { language: "java", code: "true && false   // false" },
      },
      right: {
        label: "|| (ou)",
        text: "**Un seul** suffit. Comme un magasin avec deux entrées : une porte ouverte suffit.",
        code: { language: "java", code: "true || false   // true" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : entre deux valeurs",
      text: "En maths, on écrit `18 <= age <= 64`. Java refuse cette écriture. Il faut deux comparaisons reliées par `&&` : `age >= 18 && age <= 64`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — Convertir
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "bases-var-l6",
  title: "Convertir : nombres, décimales et texte",
  blocks: [
    {
      kind: "text",
      text: "Parfois la valeur n'a pas le bon type pour la case. Un prix à virgule doit devenir un entier. Un nombre tapé par l'utilisateur arrive sous forme de **texte** (`\"42\"`) et on veut calculer avec. Il faut alors **convertir**. Commençons par le cas sans souci : un `int` dans une case `double`. C'est comme verser un petit verre dans un grand : rien ne se perd, et Java le fait tout seul. Le 7 devient simplement `7.0`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Entier vers décimal : automatique.",
      code: `int n = 7;
double d = n;                 // 7.0 : Java convertit tout seul
System.out.println(d);        // affiche : 7.0`,
    },
    {
      kind: "text",
      text: "L'inverse est dangereux : verser un grand verre dans un petit, ça déborde. Ranger un `double` dans une case `int` fait **perdre les décimales**, donc Java refuse tout seul. Pour dire « je sais ce que je fais, coupe les décimales », on écrit le type voulu **entre parenthèses** devant la valeur. Ça s'appelle un **cast** (« moulage »). Attention : il **coupe**, il n'arrondit pas.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ne marche pas, puis corrigé avec un cast.",
      code: `double prix = 9.99;
int entier = prix;            // erreur : on perdrait le .99

// Corrigé :
int coupe = (int) prix;       // 9 : les décimales sont coupées (pas arrondies à 10)`,
    },
    {
      kind: "text",
      text: "Un piège classique mêle cette leçon et la précédente : `double moyenne = 7 / 2;`. On s'attend à 3.5, mais Java calcule `7 / 2` **en premier**, avec deux entiers : ça donne 3. Ensuite seulement, ce 3 est rangé dans la case `double` et devient `3.0`. Le mal est déjà fait. Il faut convertir **avant** de diviser.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Convertir avant de diviser.",
      code: `double faux = 7 / 2;            // 3.0 : 7 / 2 donne 3, PUIS 3 devient 3.0
double juste = (double) 7 / 2;  // 3.5 : 7 devient 7.0, PUIS 7.0 / 2`,
    },
    {
      kind: "text",
      text: "Dernier cas : le texte. `\"42\"` est du texte, on ne calcule pas avec. Pour le transformer en nombre, Java a une **recette** toute faite : `Integer.parseInt(\"42\")` donne le nombre 42. Dans l'autre sens, `String.valueOf(42)` donne le texte `\"42\"`. Une recette s'**appelle** avec ses ingrédients entre parenthèses ; tu apprendras à écrire les tiennes plus tard.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Du texte au nombre, et retour.",
      code: `String texte = "42";
int nombre = Integer.parseInt(texte);       // 42 : un vrai nombre
int fois2 = nombre * 2;                     // 84 : on peut calculer
String retour = String.valueOf(nombre + 1); // "43" : du texte à nouveau`,
    },
    {
      kind: "comparison",
      title: "Coller ou calculer ?",
      left: {
        label: "Sans conversion",
        text: "`\"12\"` est du texte : le `+` **colle**.",
        code: { language: "java", code: '"12" + 1   // "121"' },
      },
      right: {
        label: "Avec parseInt",
        text: "On a d'abord un vrai nombre : le `+` **additionne**.",
        code: { language: "java", code: 'Integer.parseInt("12") + 1   // 13' },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : le texte doit ressembler à un entier",
      text: "`Integer.parseInt` ne lit que des entiers bien écrits. Avec `\"abc\"` ou `\"3.5\"`, le programme plante. Vérifie toujours ce que tu convertis.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Exercices (répartis sur les leçons plus bas)
// ---------------------------------------------------------------------------

const EXERCISES: Exercise[] = [
  // ----- Leçon 1 : difficulté 1 -----
  {
    kind: "mcq",
    id: "bases-var-01",
    difficulty: 1,
    tags: ["variables"],
    prompt: "`int age = 30;` : que contient la case étiquetée `age` ?",
    choices: ["Le nombre 30", "Le mot age", "Le mot int", "Rien, la case est vide"],
    answer: 0,
    simple:
      "Une variable, c'est une case avec une étiquette. Ici l'étiquette est `age`, et on a posé le nombre 30 dans la case. Quand Java lit `age`, il regarde dans la case et trouve 30. Le mot `int` dit seulement quel genre de chose la case accepte.",
    explanation:
      "`int age = 30;` crée une case de type `int` nommée `age` et y range la valeur 30. Le nom sert d'étiquette ; `int` est le type (ce que la case peut contenir) ; la valeur est ce qui est rangé dedans.",
  },
  {
    kind: "fill",
    id: "bases-var-02",
    difficulty: 1,
    tags: ["variables", "affectation"],
    prompt: "Crée une case entière `vies` qui contient 3, puis change sa valeur pour 2.",
    code: {
      language: "java",
      code: `{{1}} vies = 3;      // on crée la case
vies {{2}} 2;        // on change la valeur`,
    },
    blanks: ["int", "="],
    distractors: ["==", "String", "boolean"],
    simple:
      "À la première ligne, on crée la case : il faut dire son genre (`int`, un nombre entier), son nom, et ce qu'on met dedans. À la deuxième ligne, la case existe déjà, donc on ne répète pas le genre : on range juste la nouvelle valeur avec un seul `=`.",
    explanation:
      "La première ligne déclare la variable : type `int`, nom `vies`, valeur 3. La deuxième modifie la variable existante avec l'affectation `=`, sans réécrire le type. `==` sert à comparer, pas à ranger.",
  },
  {
    kind: "output",
    id: "bases-var-03",
    difficulty: 1,
    tags: ["variables", "affichage"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int score = 10;
score = 25;
System.out.println(score);`,
    },
    choices: ["`25`", "`10`", "`35`", "`score`"],
    answer: 0,
    simple:
      "Ligne 1 : la case `score` contient 10. Ligne 2 : on range 25 dans la même case, et le 10 est effacé. Ligne 3 : on affiche ce qu'il y a dans la case, donc 25. Une case ne garde qu'une seule valeur à la fois, elle n'additionne rien toute seule.",
    explanation:
      "Après `int score = 10;` la case contient 10. `score = 25;` remplace son contenu par 25 (l'ancienne valeur est perdue). `println(score)` affiche le contenu de la case : 25, pas le mot `score` ni la somme.",
  },
  {
    kind: "recall",
    id: "bases-var-04",
    difficulty: 1,
    tags: ["variables", "affectation"],
    prompt: "Avec tes mots : qu'est-ce qu'une variable ? Quelle est la différence entre `int score = 10;` et `score = 25;` ?",
    simple:
      "Une variable, c'est une case avec une étiquette, dans laquelle on range une valeur. Avec le type devant (`int score = 10;`), on crée la case. Sans le type (`score = 25;`), la case existe déjà et on change juste ce qu'il y a dedans : l'ancienne valeur est effacée.",
    explanation:
      "Une variable est une case de la mémoire, avec un nom (l'étiquette), un type (ce qu'elle peut contenir) et une valeur. `int score = 10;` la **déclare** (création) et lui donne une première valeur. `score = 25;` **modifie** la variable existante : l'ancienne valeur est écrasée. Réécrire le type une deuxième fois est refusé par Java, car la variable existe déjà.",
    keyPoints: ["Case avec un nom, un type et une valeur", "Avec le type : on crée la case", "Sans le type : on change la valeur", "L'ancienne valeur disparaît"],
  },

  // ----- Leçon 2 : difficulté 1 -----
  {
    kind: "match",
    id: "bases-var-05",
    difficulty: 1,
    tags: ["types"],
    prompt: "Associe chaque valeur au type de case qui lui convient.",
    pairs: [
      { left: "`42`", right: "`int`" },
      { left: "`3.14`", right: "`double`" },
      { left: "`true`", right: "`boolean`" },
      { left: "`'A'`", right: "`char`" },
      { left: "`\"Bonjour\"`", right: "`String`" },
    ],
    simple:
      "Regarde comment la valeur est écrite. Un nombre sans virgule, c'est un `int`. Un nombre avec un point, c'est un `double`. `true` ou `false`, c'est un `boolean`. Une seule lettre entre apostrophes, c'est un `char`. Du texte entre guillemets, c'est un `String`.",
    explanation:
      "`42` est un entier (`int`), `3.14` un nombre à virgule (`double`, avec un point), `true` un booléen, `'A'` un caractère unique (`char`, entre apostrophes) et `\"Bonjour\"` du texte (`String`, entre guillemets).",
  },
  {
    kind: "mcq",
    id: "bases-var-06",
    difficulty: 1,
    tags: ["types", "double"],
    prompt: "Quel type choisir pour ranger le prix d'un article, par exemple 4.99 ?",
    choices: ["`int`", "`double`", "`boolean`", "`char`"],
    answer: 1,
    simple:
      "Un prix comme 4.99 a des centimes, donc une virgule (un point en Java). Une case `int` n'accepte que des nombres entiers : elle ne peut pas garder le .99. La bonne case pour un nombre à virgule, c'est `double`.",
    explanation:
      "`double` est le type des nombres à virgule. Un `int` ne peut contenir que des entiers : `int prix = 4.99;` est refusé. `boolean` ne connaît que `true`/`false` et `char` ne contient qu'une lettre.",
  },
  {
    kind: "spot",
    id: "bases-var-07",
    difficulty: 1,
    tags: ["types", "char"],
    prompt: "Une seule ligne empêche ce code de compiler. Laquelle, et pourquoi ?",
    code: {
      language: "java",
      code: `int nombre = 12;
char lettre = "A";
String mot = "Java";`,
    },
    faultyLine: 2,
    reasons: [
      "Une lettre de type `char` s'écrit entre apostrophes : `'A'`.",
      "Le nom `lettre` n'a pas le droit d'être utilisé ici.",
      "Un `char` ne peut contenir qu'un nombre, pas une lettre.",
      "Il manque un point-virgule à la fin de cette ligne.",
    ],
    reasonAnswer: 0,
    simple:
      "Les guillemets (`\"A\"`) servent pour du texte, les apostrophes (`'A'`) servent pour une seule lettre. La case `char` attend une lettre, donc il lui faut des apostrophes. Les lignes 1 et 3 sont correctes : `12` est un nombre pour un `int`, et `\"Java\"` est un texte pour un `String`.",
    explanation:
      "`\"A\"` est un `String` (du texte, même d'une seule lettre), qu'on ne peut pas ranger dans une case `char`. Pour un `char`, la valeur s'écrit entre apostrophes : `'A'`. Les lignes 1 et 3 respectent leurs types.",
  },
  {
    kind: "recall",
    id: "bases-var-08",
    difficulty: 1,
    tags: ["types"],
    prompt: "Pourquoi Java demande-t-il de choisir un type pour chaque case ? Donne un exemple de valeur pour `int`, `double`, `boolean`, `char` et `String`.",
    simple:
      "Le type dit ce qu'on a le droit de ranger dans la case, un peu comme un casier à bouteilles n'accepte pas des chaussures. Si on se trompe, Java le dit tout de suite au lieu de laisser un bug se cacher. Exemples : `42` pour `int`, `3.14` pour `double`, `true` pour `boolean`, `'A'` pour `char`, `\"Lea\"` pour `String`.",
    explanation:
      "Le type fixe ce que la variable peut contenir ; Java vérifie la cohérence avant de lancer le programme, donc les erreurs de rangement sont repérées tout de suite. Exemples : `int` → `42` ; `double` → `3.14` ; `boolean` → `true` ; `char` → `'A'` (apostrophes) ; `String` → `\"Lea\"` (guillemets).",
    keyPoints: ["Le type dit ce que la case peut contenir", "Java vérifie avant de lancer", "Un exemple pour chacun des cinq types", "Apostrophes pour char, guillemets pour String"],
  },

  // ----- Leçon 3 : difficultés 1 à 2 -----
  {
    kind: "output",
    id: "bases-var-09",
    difficulty: 1,
    tags: ["operations", "division-entiere"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `System.out.println(7 / 2);`,
    },
    choices: ["`3.5`", "`4`", "`3`", "`2`"],
    answer: 2,
    simple:
      "Avec deux nombres entiers, `/` répond « combien de fois entier ? ». Pense à 7 bonbons partagés entre 2 enfants : chacun en reçoit 3, et il en reste 1. Java répond 3 et jette le reste. Il ne donne pas 3.5, parce que 7 et 2 n'ont pas de virgule.",
    explanation:
      "Entre deux `int`, `/` est une division entière : le résultat est entier, la partie après la virgule est jetée (pas d'arrondi). `7 / 2` vaut 3. Pour obtenir 3.5, il faudrait `7.0 / 2`.",
  },
  {
    kind: "mcq",
    id: "bases-var-10",
    difficulty: 1,
    tags: ["operations", "reste"],
    prompt: "Tu donnes autant de bonbons que possible à chacun de 5 enfants, avec 17 bonbons. Quelle expression donne le nombre de bonbons qui restent ?",
    choices: ["`17 / 5`", "`17 - 5`", "`5 % 17`", "`17 % 5`"],
    answer: 3,
    simple:
      "Chacun reçoit 3 bonbons : ça fait 15, donc il en reste 2. Le signe `%` donne justement ce qui reste après avoir distribué le plus possible. On écrit le total d'abord : `17 % 5`. Le signe `/` donnerait le nombre de bonbons par enfant (3), pas ce qui reste.",
    explanation:
      "`17 % 5` vaut 2 : 17 = 3 × 5 + 2. `17 / 5` vaut 3 (la part de chacun), `17 - 5` vaut 12 et `5 % 17` vaut 5 (le reste d'une division où le diviseur est plus grand).",
  },
  {
    kind: "output",
    id: "bases-var-11",
    difficulty: 2,
    tags: ["operations", "priorites"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int r = 10 - 2 * 3 + 4;
System.out.println(r);`,
    },
    choices: ["`28`", "`0`", "`-4`", "`8`"],
    answer: 3,
    simple:
      "Comme en maths, la multiplication passe avant. On calcule d'abord `2 * 3`, ce qui fait 6. Il reste `10 - 6 + 4`. Puis on lit de gauche à droite : `10 - 6` fait 4, et `4 + 4` fait 8.",
    explanation:
      "`*` a priorité sur `+` et `-` : `2 * 3` donne 6. Reste `10 - 6 + 4`, évalué de gauche à droite (même priorité) : 4 puis 8. Les autres choix viennent d'un calcul strictement de gauche à droite (28) ou d'un regroupement erroné par parenthèses (0, -4).",
  },
  {
    kind: "fill",
    id: "bases-var-12",
    difficulty: 2,
    tags: ["operations", "division-entiere", "reste"],
    prompt: "Complète pour convertir 200 minutes en heures entières et minutes restantes.",
    code: {
      language: "java",
      code: `int minutes = 200;
int heures = minutes {{1}} 60;     // 3 heures entières
int reste = minutes {{2}} 60;      // 20 minutes qui restent`,
    },
    blanks: ["/", "%"],
    distractors: ["*", "-"],
    simple:
      "200 minutes, c'est 3 heures (3 fois 60 = 180) et il reste 20 minutes. Pour savoir combien de fois 60 « rentre » entièrement dans 200, on divise avec `/`. Pour savoir ce qui reste après, on prend le reste avec `%`. C'est la même idée que les bonbons partagés entre les enfants.",
    explanation:
      "`200 / 60` est une division entière : 3. `200 % 60` est le reste : 200 - 3 × 60 = 20. `*` et `-` ne donneraient ni 3 ni 20.",
  },
  {
    kind: "output",
    id: "bases-var-13",
    difficulty: 2,
    tags: ["operations", "concatenation"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String a = "Total : " + 4 + 1;
String b = 4 + 1 + " points";
System.out.println(a + " | " + b);`,
    },
    choices: ["`Total : 5 | 5 points`", "`Total : 41 | 41 points`", "`Total : 5 | 41 points`", "`Total : 41 | 5 points`"],
    answer: 3,
    simple:
      "Java lit de gauche à droite. Pour `a`, il part d'un texte : il colle 4, puis colle 1, ce qui donne `Total : 41`. Pour `b`, il part de deux nombres : `4 + 1` fait 5, et ensuite seulement il colle ` points`. Le `+` additionne tant qu'il n'a vu que des nombres, et colle dès qu'il y a du texte.",
    explanation:
      "`\"Total : \" + 4` est déjà du texte (`\"Total : 4\"`), puis `+ 1` colle à nouveau : `Total : 41`. Dans `4 + 1 + \" points\"`, `4 + 1` est évalué en premier (deux `int`) : 5, puis concaténé : `5 points`. L'affichage final colle `a`, ` | ` et `b`.",
  },

  // ----- Leçon 4 : difficultés 1 à 2 -----
  {
    kind: "mcq",
    id: "bases-var-14",
    difficulty: 1,
    tags: ["affichage", "variables"],
    prompt: "Avec cette case, quelle ligne affiche le nombre 25 à l'écran ?",
    code: { language: "java", code: "int age = 25;" },
    choices: [
      "`System.out.println(age + 1);`",
      "`System.out.println(\"age\");`",
      "`System.out.println(age);`",
      "`System.out.println(\"age\" + 1);`",
    ],
    answer: 2,
    simple:
      "Sans guillemets, `age` est le nom de la case : Java affiche ce qu'il y a dedans, 25. Avec des guillemets, `\"age\"` est juste le mot « age ». Et `age + 1` afficherait 26, pas 25.",
    explanation:
      "`println(age)` affiche le contenu de la variable : 25. `println(\"age\")` affiche le texte `age`. `age + 1` donne 26 et `\"age\" + 1` colle pour donner `age1`.",
  },
  {
    kind: "order",
    id: "bases-var-15",
    difficulty: 1,
    tags: ["trace", "variables"],
    prompt: "Remets ces lignes dans l'ordre pour que le programme affiche 55.",
    items: [
      "int prix = 20;",
      "int total = prix * 3;",
      "total = total - 5;",
      "System.out.println(total);",
    ],
    language: "java",
    simple:
      "Une case doit exister avant qu'on s'en serve. On crée donc `prix` d'abord. Ensuite `total` utilise `prix` : 20 fois 3 fait 60. Puis on enlève 5, ce qui donne 55. Enfin on affiche : si on affichait avant d'enlever 5, on verrait 60.",
    explanation:
      "L'ordre est dicté par les dépendances : `prix` doit exister avant `total = prix * 3` (60), qui doit exister avant `total = total - 5` (55). L'affichage vient en dernier pour montrer la valeur finale.",
  },
  {
    kind: "output",
    id: "bases-var-16",
    difficulty: 2,
    tags: ["trace", "affectation"],
    prompt: "Suis les valeurs ligne par ligne. Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int x = 5;
int y = 2;
x = x * y;
y = x - y;
System.out.println(x + " " + y);`,
    },
    choices: ["`10 8`", "`10 2`", "`5 3`", "`10 3`"],
    answer: 0,
    simple:
      "Après les deux premières lignes : x vaut 5 et y vaut 2. Ligne 3 : Java calcule `5 * 2` et range 10 dans x. Ligne 4 : avec x qui vaut maintenant 10, il calcule `10 - 2` et range 8 dans y. On affiche x puis y : `10 8`. Le piège serait de garder l'ancien x (5) à la ligne 4.",
    explanation:
      "Tableau : après `x = 5` → (5, -) ; après `y = 2` → (5, 2) ; après `x = x * y` → (10, 2) ; après `y = x - y` → (10, 8), car x vaut déjà 10 à ce moment-là. Le résultat est `10 8`.",
  },
  {
    kind: "spot",
    id: "bases-var-17",
    difficulty: 2,
    tags: ["trace", "variables", "erreurs"],
    prompt: "Une ligne empêche ce code de compiler. Laquelle, et pourquoi ?",
    code: {
      language: "java",
      code: `int prix = 5;
int total = prix * quantite;
int quantite = 3;
System.out.println(total);`,
    },
    faultyLine: 2,
    reasons: [
      "`quantite` est utilisée ici avant d'avoir été créée, deux lignes plus bas.",
      "`prix * quantite` n'est pas une multiplication permise en Java.",
      "`total` porte le même nom qu'une case déjà créée plus haut.",
      "Il manque un point-virgule à la fin de la ligne 2.",
    ],
    reasonAnswer: 0,
    simple:
      "Java lit de haut en bas. À la ligne 2, la case `quantite` n'est pas encore installée : elle n'apparaît qu'à la ligne 3. C'est comme chercher un objet dans un tiroir qu'on n'a pas encore monté. Il suffit de créer `quantite` avant la ligne 2.",
    explanation:
      "Une variable n'existe qu'à partir de sa déclaration. À la ligne 2, `quantite` est inconnue : erreur « cannot find symbol ». Les lignes 1, 3 et 4 sont correctes ; il suffit de déplacer la ligne 3 avant la ligne 2.",
  },
  {
    kind: "recall",
    id: "bases-var-18",
    difficulty: 2,
    tags: ["trace", "affectation"],
    prompt: "Explique comment tu suis un programme pas à pas dans ta tête, en prenant l'exemple de la ligne `a = a + b;`.",
    simple:
      "Tu lis les lignes une par une, de haut en bas, et tu notes la valeur de chaque case après chaque ligne. Pour `a = a + b;`, tu calcules d'abord le côté droit avec les valeurs actuelles, par exemple 4 + 3 = 7. Puis tu ranges 7 dans `a` : l'ancienne valeur est effacée.",
    explanation:
      "On exécute les instructions dans l'ordre, du haut vers le bas, et on tient un tableau avec une colonne par variable. Pour `a = a + b;`, on évalue d'abord l'expression de droite avec les valeurs actuelles de `a` et `b`, puis on affecte le résultat à `a`, ce qui écrase son ancienne valeur. Une variable ne peut servir qu'à partir de la ligne où elle est créée.",
    keyPoints: ["Lire ligne par ligne, de haut en bas", "Un tableau : une colonne par variable", "Droite calculée d'abord, puis rangée à gauche", "L'ancienne valeur est écrasée"],
  },

  // ----- Leçon 5 : difficultés 1 à 2 -----
  {
    kind: "output",
    id: "bases-var-19",
    difficulty: 1,
    tags: ["comparaisons", "booleens"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int age = 20;
boolean majeur = age >= 18;
boolean petit = age < 12;
System.out.println(majeur + " " + petit);`,
    },
    choices: ["`true false`", "`true true`", "`false true`", "`false false`"],
    answer: 0,
    simple:
      "`age` vaut 20. Première question : « 20 est-il plus grand ou égal à 18 ? ». Oui, donc `true`. Deuxième question : « 20 est-il plus petit que 12 ? ». Non, donc `false`. On affiche les deux réponses l'une après l'autre : `true false`.",
    explanation:
      "`20 >= 18` est vrai, `20 < 12` est faux. Le `+` colle la valeur booléenne convertie en texte avec l'espace : `true false`.",
  },
  {
    kind: "match",
    id: "bases-var-20",
    difficulty: 1,
    tags: ["comparaisons", "booleens"],
    prompt: "Associe chaque signe à ce qu'il veut dire.",
    pairs: [
      { left: "`==`", right: "est égal à" },
      { left: "`!=`", right: "est différent de" },
      { left: "`>=`", right: "plus grand ou égal à" },
      { left: "`&&`", right: "et : les deux doivent être vrais" },
      { left: "`||`", right: "ou : un seul suffit" },
      { left: "`!`", right: "le contraire de" },
    ],
    simple:
      "Deux signes `==` posent la question « est-ce égal ? ». Le point d'exclamation veut dire « pas » : `!=` veut dire « pas égal », et `!` seul inverse une réponse. `&&` veut dire « et » : il faut les deux. `||` veut dire « ou » : un seul suffit.",
    explanation:
      "`==` teste l'égalité, `!=` la différence, `>=` « plus grand ou égal ». `&&` est le « et » logique (les deux vrais), `||` le « ou » logique (au moins un vrai) et `!` la négation, qui inverse un `boolean`.",
  },
  {
    kind: "spot",
    id: "bases-var-21",
    difficulty: 2,
    tags: ["comparaisons", "affectation", "erreurs"],
    prompt: "On voulait savoir si `a` et `b` sont égaux. Quelle ligne est fautive, et pourquoi ?",
    code: {
      language: "java",
      code: `int a = 5;
int b = 5;
boolean pareil = (a = b);
System.out.println(pareil);`,
    },
    faultyLine: 3,
    reasons: [
      "Un seul `=` range une valeur ; pour comparer, il faut `==`.",
      "Une case `boolean` ne peut pas recevoir le résultat d'une comparaison.",
      "Les parenthèses sont interdites autour d'une comparaison.",
      "`a` et `b` doivent être déclarés comme des `boolean`.",
    ],
    reasonAnswer: 0,
    simple:
      "Un seul `=` veut dire « range ». Ici, la ligne range la valeur de `b` dans `a`, ce n'est pas une question. Pour demander « a est-il égal à b ? », il faut deux signes égal : `a == b`. Les autres lignes n'ont aucun problème.",
    explanation:
      "`a = b` est une affectation : elle range `b` dans `a` et son résultat est un `int`, impossible à ranger dans un `boolean`. La comparaison s'écrit `a == b`. Les lignes 1, 2 et 4 sont correctes.",
  },
  {
    kind: "output",
    id: "bases-var-22",
    difficulty: 2,
    tags: ["booleens", "operateurs-logiques"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int x = 10;
boolean a = x > 5 && x < 8;
boolean b = x > 5 || x < 8;
boolean c = !(x == 10);
System.out.println(a + " " + b + " " + c);`,
    },
    choices: ["`true true false`", "`false true false`", "`false false true`", "`true false true`"],
    answer: 1,
    simple:
      "x vaut 10. Pour `a` : « 10 > 5 » est vrai mais « 10 < 8 » est faux ; avec « et », il faut les deux, donc `false`. Pour `b` : avec « ou », un seul vrai suffit, donc `true`. Pour `c` : « 10 == 10 » est vrai, et le `!` l'inverse, donc `false`.",
    explanation:
      "`x > 5` est vrai et `x < 8` est faux : `true && false` donne `false`, `true || false` donne `true`. `x == 10` est vrai, donc `!(x == 10)` est `false`. Résultat : `false true false`.",
  },
  {
    kind: "recall",
    id: "bases-var-23",
    difficulty: 2,
    tags: ["booleens", "operateurs-logiques", "comparaisons"],
    prompt: "Explique la différence entre `&&` et `||`. Puis écris comment tester qu'un nombre `age` est compris entre 18 et 64 (inclus).",
    simple:
      "`&&` veut dire « et » : il faut que les deux côtés soient vrais. `||` veut dire « ou » : un seul côté vrai suffit. Pour « entre 18 et 64 », on pose deux questions reliées par « et » : `age >= 18 && age <= 64`. On ne peut pas écrire `18 <= age <= 64` comme en maths.",
    explanation:
      "`a && b` est vrai seulement si `a` et `b` sont vrais ; `a || b` est vrai si au moins un des deux l'est. Un intervalle se teste avec deux comparaisons reliées par `&&` : `age >= 18 && age <= 64`. L'écriture mathématique `18 <= age <= 64` ne compile pas, car `18 <= age` donne un `boolean` qu'on ne peut pas comparer à 64.",
    keyPoints: ["`&&` : les deux doivent être vrais", "`||` : un seul suffit", "`age >= 18 && age <= 64`", "Pas de `18 <= age <= 64` en Java"],
  },

  // ----- Leçon 6 : difficultés 2 à 3 -----
  {
    kind: "output",
    id: "bases-var-24",
    difficulty: 2,
    tags: ["conversion", "double"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int n = 7;
double d = n;
System.out.println(d);`,
    },
    choices: ["`7`", "`7.0`", "`7.5`", "Une erreur : un `int` ne va pas dans un `double`."],
    answer: 1,
    simple:
      "Ranger un `int` dans une case `double`, c'est verser un petit verre dans un grand : rien ne se perd, donc Java le fait tout seul. Le nombre 7 devient simplement `7.0`, une valeur à virgule. Comme la case est un `double`, l'affichage montre `7.0`.",
    explanation:
      "La conversion `int` vers `double` est automatique car aucune information n'est perdue. La variable contient la valeur 7.0, et `println` d'un `double` affiche `7.0`.",
  },
  {
    kind: "spot",
    id: "bases-var-25",
    difficulty: 2,
    tags: ["conversion", "cast"],
    prompt: "Une ligne empêche ce code de compiler. Laquelle, et pourquoi ?",
    code: {
      language: "java",
      code: `double prix = 9.99;
int arrondi = prix;
System.out.println(arrondi);`,
    },
    faultyLine: 2,
    reasons: [
      "Un `double` dans un `int` ferait perdre les décimales : il faut écrire `(int) prix`.",
      "`arrondi` est un nom interdit pour une variable.",
      "Une case `int` ne peut jamais recevoir un nombre venant d'ailleurs.",
      "Il faut écrire `9.99` à la place de `prix` sur cette ligne.",
    ],
    reasonAnswer: 0,
    simple:
      "Ranger `9.99` dans une case qui n'accepte que des entiers, c'est verser un grand verre dans un petit : ça déborde, on perd le `.99`. Java refuse tout seul. Pour dire « je sais, coupe les décimales », on écrit `(int)` devant la valeur : `int arrondi = (int) prix;`.",
    explanation:
      "La conversion `double` vers `int` perd de l'information : Java exige un cast explicite (`(int) prix`). Sans lui : « possible lossy conversion from double to int ». Notons que le cast coupe les décimales (9) au lieu d'arrondir.",
  },
  {
    kind: "fill",
    id: "bases-var-26",
    difficulty: 2,
    tags: ["conversion", "cast", "parse"],
    prompt: "Complète les trois conversions.",
    code: {
      language: "java",
      code: `double prix = 12.9;
int entier = ({{1}}) prix;                   // 12 : décimales coupées
String texte = "40";
int nombre = Integer.{{2}}(texte);           // 40 : un vrai nombre
String suite = String.{{3}}(nombre + 2);     // "42" : du texte`,
    },
    blanks: ["int", "parseInt", "valueOf"],
    distractors: ["double", "parse", "toInt"],
    simple:
      "Pour passer d'un nombre à virgule à un entier, on écrit `(int)` devant la valeur : ça coupe les décimales. Pour transformer du texte en nombre, la recette de Java s'appelle `Integer.parseInt`. Pour transformer un nombre en texte, c'est `String.valueOf`. Les noms `parse` et `toInt` n'existent pas tels quels.",
    explanation:
      "`(int) prix` est un cast qui coupe les décimales (12). `Integer.parseInt(texte)` convertit un texte en `int`. `String.valueOf(nombre + 2)` convertit un nombre en `String`. `(double)` ne convient pas pour ranger dans un `int` ; `parse` et `toInt` n'existent pas.",
  },
  {
    kind: "output",
    id: "bases-var-27",
    difficulty: 3,
    tags: ["conversion", "division-entiere", "parse"],
    prompt: "Suis chaque ligne. Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `double a = 7 / 2;
double b = (double) 7 / 2;
String c = "12" + 1;
int d = Integer.parseInt("12") + 1;
System.out.println(a + " " + b + " " + c + " " + d);`,
    },
    choices: ["`3.5 3.5 13 13`", "`3.0 3.5 13 121`", "`3.5 3.0 121 13`", "`3.0 3.5 121 13`"],
    answer: 3,
    simple:
      "Ligne 1 : `7 / 2` est calculé en premier avec deux entiers, ça donne 3, puis 3 devient `3.0`. Ligne 2 : le 7 devient `7.0` avant de diviser, donc 3.5. Ligne 3 : `\"12\"` est du texte, le `+` colle : `121`. Ligne 4 : `parseInt` transforme `\"12\"` en vrai nombre, le `+` additionne : 13.",
    explanation:
      "`7 / 2` est une division entière (3) convertie ensuite en `3.0`. `(double) 7 / 2` : le cast s'applique à 7 avant la division, d'où `7.0 / 2 = 3.5`. `\"12\" + 1` est une concaténation : `\"121\"`. `Integer.parseInt(\"12\") + 1` additionne deux `int` : 13.",
  },
  {
    kind: "recall",
    id: "bases-var-28",
    difficulty: 3,
    tags: ["conversion", "cast", "division-entiere"],
    prompt: "Que vaut `(int) 9.99` ? Pourquoi `double m = 7 / 2;` ne donne-t-il pas 3.5, et comment corriger ?",
    simple:
      "`(int) 9.99` vaut 9 : le cast coupe les décimales, il n'arrondit pas à 10. Pour `7 / 2`, Java divise d'abord deux entiers : ça donne 3. Ce 3 devient seulement ensuite `3.0` dans la case `double`, trop tard. Pour garder la virgule, on convertit avant de diviser : `(double) 7 / 2` ou `7 / 2.0`.",
    explanation:
      "`(int) 9.99` vaut 9 : le cast tronque. Dans `double m = 7 / 2;`, l'expression `7 / 2` est évaluée d'abord, en division entière (3), puis le résultat est converti en 3.0 à l'affectation. Il faut rendre un des opérandes décimal avant la division : `(double) 7 / 2` ou `7 / 2.0` donnent 3.5.",
    keyPoints: ["`(int) 9.99` vaut 9 : coupé, pas arrondi", "`7 / 2` est calculé avant la conversion", "Résultat 3.0 au lieu de 3.5", "Corriger : `(double) 7 / 2` ou `7 / 2.0`"],
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
  id: "bases-variables",
  format: "doux",
  title: "Variables, types et opérations",
  objective:
    "Savoir lire et écrire un petit programme qui déclare des variables, calcule et affiche un résultat, en suivant les valeurs ligne par ligne.",
  prerequisites: [],
  units: [
    l1, ...pick("bases-var-01", "bases-var-02", "bases-var-03", "bases-var-04"),
    l2, ...pick("bases-var-05", "bases-var-06", "bases-var-07", "bases-var-08"),
    l3, ...pick("bases-var-09", "bases-var-10", "bases-var-11", "bases-var-12", "bases-var-13"),
    l4, ...pick("bases-var-14", "bases-var-15", "bases-var-16", "bases-var-17", "bases-var-18"),
    l5, ...pick("bases-var-19", "bases-var-20", "bases-var-21", "bases-var-22", "bases-var-23"),
    l6, ...pick("bases-var-24", "bases-var-25", "bases-var-26", "bases-var-27", "bases-var-28"),
  ],
};
