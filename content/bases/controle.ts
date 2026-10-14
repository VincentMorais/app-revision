/**
 * Fondations — Conditions et boucles : if / else, else if, switch, while, for,
 * suivre une boucle pas à pas, break / continue et combinaison des deux.
 * 8 leçons, 28 exercices — format doux. Images : un carrefour (if), des
 * guichets (else if), un aiguillage (switch), un rond-point (while), un
 * compteur de tours (for). Chaque exercice est précédé de la leçon qui
 * enseigne ce qu'il demande.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — if / else : le carrefour
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l1",
  title: "if et else : le carrefour",
  blocks: [
    {
      kind: "text",
      text: "Jusqu'ici, ton programme ressemble à une route toute droite : Java lit les lignes de haut en bas, l'une après l'autre, et fait toujours la même chose. Or un vrai programme doit **décider**. Un site affiche « Bonjour » le matin et « Bonsoir » le soir. Un distributeur refuse de te donner de l'argent si ton solde est trop bas. Pour ça, Java a le mot **`if`** (« si » en anglais). Pense à un **carrefour** : le programme arrive, regarde un panneau, et choisit sa route.",
    },
    {
      kind: "text",
      text: "Ce qu'il regarde, c'est une **condition** : une question dont la réponse est `true` (vrai) ou `false` (faux). Tu en as déjà écrit avec les comparaisons du chapitre précédent : `age >= 18` demande « age est-il plus grand ou égal à 18 ? ». Rappel : `==` pose la question « est égal à ? », alors que `=` range une valeur dans une case. Après `if`, la condition va entre parenthèses, puis vient un **bloc** : les lignes entre accolades `{` et `}`, qui ne sont faites que si la réponse est `true`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un carrefour avec une seule route facultative.",
      code: `int age = 20;
if (age >= 18) {                          // la question : 20 >= 18 ?  true
    System.out.println("Tu peux entrer."); // donc on fait ce bloc
}
System.out.println("Fin.");               // après l'accolade : toujours fait

// Affiche :
// Tu peux entrer.
// Fin.`,
    },
    {
      kind: "text",
      text: "Lisons-le pas à pas. `age` vaut 20, donc `age >= 18` vaut `true` : Java entre dans le bloc et affiche « Tu peux entrer. ». Si `age` avait valu 15, la réponse aurait été `false` et Java aurait **sauté tout le bloc**. Dans les deux cas, la ligne « Fin. » s'affiche, car elle est après l'accolade fermante : elle n'appartient plus au `if`.",
    },
    {
      kind: "text",
      text: "Et si la réponse est « non » et qu'on veut quand même faire quelque chose ? On ajoute **`else`** (« sinon »), avec son propre bloc. Le carrefour a maintenant deux routes, et le programme en prend **une seule** : jamais les deux, jamais aucune.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux routes : une seule est prise.",
      code: `int age = 15;
if (age >= 18) {
    System.out.println("Tu peux entrer.");     // route A
} else {
    System.out.println("Reviens plus tard.");  // route B
}
// 15 >= 18 est false : on prend la route B.
// Affiche : Reviens plus tard.`,
    },
    {
      kind: "comparison",
      title: "if seul ou if / else ?",
      left: {
        label: "if seul",
        text: "Une route facultative. Si la condition est fausse, on saute le bloc et on continue après.",
        code: { language: "java", code: "if (age >= 18) {\n    System.out.println(\"Entre.\");\n}" },
      },
      right: {
        label: "if / else",
        text: "Deux routes. Exactement une des deux est prise, selon la réponse.",
        code: { language: "java", code: "if (age >= 18) {\n    System.out.println(\"Entre.\");\n} else {\n    System.out.println(\"Non.\");\n}" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : un seul = dans la condition",
      text: "`if (age = 18)` ne marche pas : Java refuse le programme (il ne compile pas, c'est-à-dire qu'il ne se lance même pas). Un seul `=` range 18 dans la case `age`, il ne pose aucune question. Pour demander « age vaut-il 18 ? », écris `if (age == 18)`.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "`if (condition) { ... }` fait le bloc quand la condition est `true`. Ajoute `else { ... }` pour le cas contraire : une seule des deux routes est prise.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — else if : une chaîne de conditions
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l2",
  title: "else if : la première condition vraie gagne",
  blocks: [
    {
      kind: "text",
      text: "Deux routes, c'est parfois trop peu. Pour transformer une note en commentaire, il t'en faut quatre : « Excellent », « Bien », « Moyen », « Insuffisant ». On met alors plusieurs panneaux à la suite avec **`else if`** (« sinon, si »). Imagine un couloir avec des **guichets** : tu te présentes au premier ; s'il te refuse, tu passes au suivant ; et ainsi de suite jusqu'à ce qu'un guichet t'accepte.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une chaîne de quatre routes.",
      code: `int note = 14;
if (note >= 16) {
    System.out.println("Excellent");
} else if (note >= 12) {
    System.out.println("Bien");
} else if (note >= 8) {
    System.out.println("Moyen");
} else {
    System.out.println("Insuffisant");
}
// 14 >= 16 ?  false -> on passe au guichet suivant
// 14 >= 12 ?  true  -> on affiche Bien et on SORT de la chaîne
// Affiche : Bien`,
    },
    {
      kind: "text",
      text: "Regarde le déroulement avec `note = 14`. Java teste `14 >= 16` : `false`, il passe. Il teste `14 >= 12` : `true`, il affiche « Bien ». Et il **s'arrête là** : les guichets suivants ne sont même pas regardés. La règle : Java lit la chaîne de haut en bas et **la première condition vraie gagne**. Le `else` final est facultatif : il prend tous les cas que personne d'autre n'a pris.",
    },
    {
      kind: "text",
      text: "Cette règle a une conséquence : **l'ordre compte**. Voici la même chaîne écrite à l'envers. Avec `note = 18`, on voudrait « Excellent ».",
    },
    {
      kind: "code",
      language: "java",
      caption: "Mauvais ordre : « Excellent » n'est jamais atteint.",
      code: `int note = 18;
if (note >= 8) {
    System.out.println("Moyen");
} else if (note >= 12) {
    System.out.println("Bien");
} else if (note >= 16) {
    System.out.println("Excellent");
}
// 18 >= 8 ?  true -> on affiche Moyen et on SORT
// Affiche : Moyen   (les deux autres guichets ne sont jamais lus)`,
    },
    {
      kind: "text",
      text: "Que s'est-il passé ? `18 >= 8` est `true` dès le premier guichet : Java affiche « Moyen » et sort. Même une note de 20 donnerait « Moyen ». Quand les conditions se recouvrent (18 est à la fois plus grand que 8, que 12 et que 16), on met d'abord la plus **exigeante**, puis les plus larges. C'est ce que faisait la première chaîne : 16, puis 12, puis 8.",
    },
    {
      kind: "comparison",
      title: "Une chaîne ou des if séparés ?",
      left: {
        label: "else if (une chaîne)",
        text: "Un seul carrefour. Une seule route est prise : la première dont la condition est vraie.",
        code: { language: "java", code: "int n = 15;\nif (n > 10) {\n    System.out.println(\"A\");\n} else if (n > 5) {\n    System.out.println(\"B\");\n}\n// Affiche : A" },
      },
      right: {
        label: "if séparés",
        text: "Chaque `if` est un carrefour à lui. Plusieurs routes peuvent être prises, une par `if` vrai.",
        code: { language: "java", code: "int n = 15;\nif (n > 10) {\n    System.out.println(\"A\");\n}\nif (n > 5) {\n    System.out.println(\"B\");\n}\n// Affiche : A puis B" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : oublier le else",
      text: "Écrire `if` à la place de `else if` ouvre un nouveau carrefour : la chaîne est coupée en deux, et plusieurs blocs peuvent s'exécuter. Quand tu hésites, déroule la chaîne avec une vraie valeur, guichet après guichet.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — switch : l'aiguillage
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l3",
  title: "switch : un aiguillage selon la valeur",
  blocks: [
    {
      kind: "text",
      text: "Parfois, on compare **la même variable** à plusieurs valeurs précises : le numéro du jour (1, 2, 3...), la langue (\"fr\", \"en\"), une couleur. Avec des `else if`, tu répètes `jour == 1`, `jour == 2`, `jour == 3`... C'est long. Java propose **`switch`** (« aiguillage ») : il regarde la valeur une seule fois et saute directement au bon **cas**. Voici la forme classique.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La forme classique, avec case, break et default.",
      code: `int jour = 3;
switch (jour) {
    case 1:
        System.out.println("Lundi");
        break;
    case 2:
        System.out.println("Mardi");
        break;
    case 3:
        System.out.println("Mercredi");   // jour vaut 3 : on saute ici
        break;                            // et on sort du switch
    default:
        System.out.println("Autre jour");
}
// Affiche : Mercredi`,
    },
    {
      kind: "text",
      text: "Lis-le comme ça : Java regarde `jour` (qui vaut 3), cherche le `case` qui correspond, saute dessus et fait les lignes qui suivent. Le mot **`break`** (« casse ») veut dire : sors du `switch`. Le **`default`** (« par défaut ») est le cas fourre-tout : il prend toutes les valeurs qu'aucun `case` n'a prises. Il est facultatif, comme le `else` final d'une chaîne.",
    },
    {
      kind: "text",
      text: "Le piège de cette forme : si tu **oublies un `break`**, Java ne s'arrête pas. Il continue dans le cas suivant, puis le suivant, jusqu'à rencontrer un `break` : on dit qu'il *dégringole*. Ici, `jour` vaut 2, et le `case 2` n'a pas de `break`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un break oublié : le programme dégringole.",
      code: `int jour = 2;
switch (jour) {
    case 1:
        System.out.println("Lundi");
        break;
    case 2:
        System.out.println("Mardi");      // on saute ici...
                                          // pas de break !
    case 3:
        System.out.println("Mercredi");   // ...et on continue ici
        break;                            // enfin on sort
    default:
        System.out.println("Autre jour");
}
// Affiche : Mardi puis Mercredi`,
    },
    {
      kind: "text",
      text: "Pour éviter ça, les Java récents (dont Java 21) offrent une **forme fléchée** : `case X -> ...`. Pas de `break` à écrire et aucune dégringolade : seul le cas choisi est fait. On peut même grouper plusieurs valeurs avec une virgule. Sur un texte, `switch` compare le **contenu**, écrit entre guillemets.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La forme fléchée, sur un nombre puis sur un texte.",
      code: `int jour = 3;
switch (jour) {
    case 1 -> System.out.println("Lundi");
    case 2 -> System.out.println("Mardi");
    case 3 -> System.out.println("Mercredi");
    default -> System.out.println("Autre jour");
}
// Affiche : Mercredi

String couleur = "vert";
switch (couleur) {
    case "rouge" -> System.out.println("Stop");
    case "vert" -> System.out.println("Go");
    default -> System.out.println("Attention");
}
// Affiche : Go

int jourSemaine = 6;
switch (jourSemaine) {
    case 6, 7 -> System.out.println("Week-end");   // deux valeurs, un même cas
    default -> System.out.println("Semaine");
}
// Affiche : Week-end`,
    },
    {
      kind: "comparison",
      title: "Forme classique ou forme fléchée ?",
      left: {
        label: "case X : ... break;",
        text: "Il faut écrire `break` à la fin de chaque cas, sinon Java dégringole dans le cas suivant.",
        code: { language: "java", code: "case 1:\n    System.out.println(\"Lundi\");\n    break;" },
      },
      right: {
        label: "case X -> ...",
        text: "Pas de `break` à écrire, pas de dégringolade : seul le cas choisi est fait.",
        code: { language: "java", code: "case 1 -> System.out.println(\"Lundi\");" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : switch ne sait que « égal à »",
      text: "`switch` vérifie qu'une valeur est **exactement** celle d'un cas. Il ne sait pas répondre à `note >= 12` ou `age < 18`. Pour des intervalles, utilise une chaîne de `else if`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — while : le rond-point
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l4",
  title: "while : répéter tant que la condition est vraie",
  blocks: [
    {
      kind: "text",
      text: "Imagine que tu doives afficher les nombres de 1 à 1000. Écrire 1000 lignes à la main ? Impossible. Une **boucle** répète des lignes tant qu'on le lui demande. La plus simple s'appelle **`while`** (« tant que »). Image : un **rond-point**. À chaque passage, le programme regarde la condition : si elle est vraie, il refait un tour ; si elle est fausse, il prend la sortie.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un compte à rebours.",
      code: `int compte = 3;
while (compte > 0) {
    System.out.println("Il reste " + compte);
    compte = compte - 1;
}
System.out.println("Décollage !");`,
    },
    {
      kind: "text",
      text: "Chaque passage dans le bloc s'appelle un **tour**. Au début de chaque tour, Java teste la condition. `compte` vaut 3 : `3 > 0` est vrai, premier tour. À la fin du tour, `compte = compte - 1` fait baisser la case. Le tableau ci-dessous montre la valeur de `compte` à chaque test.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Pas à pas : la case compte à chaque test.",
      code: `compte | compte > 0 ? | ce qui se passe
-------+--------------+---------------------------
   3   | true         | affiche « Il reste 3 », compte passe à 2
   2   | true         | affiche « Il reste 2 », compte passe à 1
   1   | true         | affiche « Il reste 1 », compte passe à 0
   0   | false        | on sort du rond-point
// puis : Décollage !`,
    },
    {
      kind: "text",
      text: "Deux choses à retenir. D'abord, le test se fait **avant** chaque tour : si la condition est fausse dès le départ, la boucle fait **zéro** tour. Ensuite, quelque chose dans le bloc doit finir par rendre la condition fausse. Ici, c'est `compte` qui baisse jusqu'à 0. Au lieu de `compte = compte - 1`, tu peux écrire `compte--`, qui veut dire exactement la même chose : « retire 1 à la case ».",
    },
    {
      kind: "text",
      text: "Que se passe-t-il si on oublie de changer `compte` ? Regarde.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Rien ne change compte : la boucle ne s'arrête jamais.",
      code: `int compte = 3;
while (compte > 0) {
    System.out.println("Il reste " + compte);
    // oubli : compte ne change jamais !
}`,
    },
    {
      kind: "text",
      text: "`compte` vaut toujours 3, donc `compte > 0` est toujours vrai : le programme tourne en rond **sans jamais s'arrêter**. C'est une **boucle infinie**. « Il reste 3 » s'affiche sans fin, jusqu'à ce que tu coupes le programme à la main (Ctrl+C dans le terminal). Avant d'écrire un `while`, demande-toi toujours : *qu'est-ce qui rendra la condition fausse ?*",
    },
    {
      kind: "comparison",
      title: "if ou while ?",
      left: {
        label: "if",
        text: "Teste la condition **une seule fois**. Si elle est vraie, le bloc est fait une fois, puis on continue.",
        code: { language: "java", code: "if (compte > 0) {\n    // fait 0 ou 1 fois\n}" },
      },
      right: {
        label: "while",
        text: "Teste la condition **avant chaque tour**. Le bloc est refait tant qu'elle est vraie.",
        code: { language: "java", code: "while (compte > 0) {\n    // fait 0, 1, 2... fois\n}" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : la boucle infinie",
      text: "Si ton programme affiche la même chose sans s'arrêter, c'est presque toujours une boucle infinie : la variable de la condition n'est jamais modifiée, ou elle l'est dans le mauvais sens (elle augmente alors qu'elle devrait baisser).",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — for : le compteur de tours
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l5",
  title: "for : une boucle qui compte",
  blocks: [
    {
      kind: "text",
      text: "Dans un `while` qui compte, trois éléments sont éparpillés : la valeur de départ (avant la boucle), la condition (dans les parenthèses) et le changement (au fond du bloc). On les oublie facilement. La boucle **`for`** rassemble les trois sur **une seule ligne**. C'est la boucle des compteurs : tu l'utilises quand tu sais combien de tours tu veux.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois tours, numérotés de 1 à 3.",
      code: `for (int i = 1; i <= 3; i++) {
    System.out.println("Tour " + i);
}
// Affiche :
// Tour 1
// Tour 2
// Tour 3`,
    },
    {
      kind: "text",
      text: "Dans les parenthèses, trois parties séparées par des `;`. Le **début** `int i = 1` : on crée la case `i` et on y met 1, **une seule fois**, avant le premier tour. La **condition** `i <= 3` : testée avant chaque tour, comme dans un `while`. Le **pas** `i++` : fait à la fin de chaque tour, il ajoute 1 à `i` (c'est la même chose que `i = i + 1`). La case `i` s'appelle le **compteur** ; `i` est le nom que tout le monde utilise par habitude.",
    },
    {
      kind: "text",
      text: "Voici le même travail écrit avec un `while` : tu retrouves les trois parties, mais éparpillées.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le même programme avec while.",
      code: `int i = 1;               // le début
while (i <= 3) {         // la condition
    System.out.println("Tour " + i);
    i++;                 // le pas
}`,
    },
    {
      kind: "text",
      text: "Le pas n'est pas obligé d'ajouter 1. Tu peux compter de 2 en 2, ou à l'envers avec `i--` (qui retire 1). Dans cet exemple, `System.out.print` écrit **sans passer à la ligne** (contrairement à `println`), ce qui permet de tout voir sur une seule ligne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Compter de 2 en 2, puis à l'envers.",
      code: `for (int i = 0; i <= 6; i = i + 2) {
    System.out.print(i + " ");
}
// Affiche : 0 2 4 6

for (int i = 3; i >= 1; i--) {
    System.out.print(i + " ");
}
// Affiche : 3 2 1`,
    },
    {
      kind: "comparison",
      title: "while ou for ?",
      left: {
        label: "while",
        text: "On ne sait pas combien de tours il faudra : on répète tant qu'une condition est vraie.",
        code: { language: "java", code: "while (compte > 0) {\n    ...\n}" },
      },
      right: {
        label: "for",
        text: "On compte : début, condition et pas sont réunis sur une ligne.",
        code: { language: "java", code: "for (int i = 1; i <= 3; i++) {\n    ...\n}" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : le compteur disparaît après la boucle",
      text: "La case `i` créée dans le `for` n'existe que **dans la boucle**. Après l'accolade fermante, elle disparaît : écrire `System.out.println(i);` juste après ne compile pas. Si tu as besoin de la valeur après, crée la case avant le `for`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — Suivre une boucle pas à pas, erreurs d'une unité
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l6",
  title: "Suivre une boucle pas à pas",
  blocks: [
    {
      kind: "text",
      text: "Pour comprendre une boucle, tu ne dois pas **deviner** : tu dois **jouer l'ordinateur**. La méthode est toujours la même : tu dessines un tableau avec une colonne par variable et une ligne par tour, et tu remplis. Prenons un programme qui additionne les nombres de 1 à 4.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Additionner 1 + 2 + 3 + 4.",
      code: `int somme = 0;
for (int i = 1; i <= 4; i++) {
    somme = somme + i;
}
System.out.println(somme);`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Le tableau, une ligne par tour.",
      code: `tour | i | i <= 4 ? | somme avant | somme après
-----+---+----------+-------------+------------
  1  | 1 | true     | 0           | 1
  2  | 2 | true     | 1           | 3
  3  | 3 | true     | 3           | 6
  4  | 4 | true     | 6           | 10
fin  | 5 | false    | on sort de la boucle
// Affiche : 10`,
    },
    {
      kind: "text",
      text: "Comment lire le tableau ? Avant le premier tour, `somme` vaut 0. Tour 1 : `i` vaut 1, donc `somme = 0 + 1`, soit 1. Tour 2 : `i` vaut 2, `somme = 1 + 2 = 3`. Et ainsi de suite jusqu'à 10. N'oublie pas la dernière ligne : `i` passe à 5, le test `5 <= 4` est faux, et la boucle s'arrête. C'est ce **dernier test raté** qu'on oublie le plus souvent.",
    },
    {
      kind: "text",
      text: "Cette méthode sert surtout à traquer l'**erreur d'une unité** (en anglais *off-by-one*) : une boucle qui fait un tour de trop ou un tour de moins. Elle vient presque toujours du choix entre `<` et `<=`. Pour compter les tours, on utilise ici une case `tours` : `tours++` ajoute 1 à chaque tour. On veut 5 tours. Avec un compteur qui part de 0, regarde la différence entre les deux conditions.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un petit signe, un tour de différence.",
      code: `int tours = 0;
for (int i = 0; i < 5; i++) {    // i vaut 0, 1, 2, 3, 4
    tours++;
}
System.out.println(tours);       // 5

int tours2 = 0;
for (int i = 0; i <= 5; i++) {   // i vaut 0, 1, 2, 3, 4, 5
    tours2++;
}
System.out.println(tours2);      // 6`,
    },
    {
      kind: "comparison",
      title: "< ou <= ?",
      left: {
        label: "i < 5",
        text: "La valeur 5 est **exclue** : dès que `i` vaut 5, la condition est fausse et on s'arrête.",
        code: { language: "java", code: "for (int i = 0; i < 5; i++)\n// i : 0 1 2 3 4  (5 tours)" },
      },
      right: {
        label: "i <= 5",
        text: "La valeur 5 est **incluse** : on fait encore un tour avec `i` qui vaut 5.",
        code: { language: "java", code: "for (int i = 0; i <= 5; i++)\n// i : 0 1 2 3 4 5  (6 tours)" },
      },
    },
    {
      kind: "text",
      text: "Deux repères pour ne plus te tromper. Départ à 0 avec `<` N : exactement N tours. Départ à 1 avec `<=` N : exactement N tours aussi. Si tu mélanges (départ à 0 avec `<=`, ou départ à 1 avec `<`), tu es à une unité de ce que tu voulais : un tour de trop dans le premier cas, un tour de moins dans le second.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "L'astuce des petits nombres",
      text: "Un doute sur une boucle ? Remplace le nombre de tours par 1 ou 2 et déroule-la avec ton tableau. Si la version minuscule se trompe d'un tour, la grande se trompe aussi.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 7 — break, continue et boucles imbriquées
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l7",
  title: "break, continue et boucles imbriquées",
  blocks: [
    {
      kind: "text",
      text: "Parfois, la boucle prévue est trop longue : tu as trouvé ce que tu cherchais, inutile de continuer. Parfois, un tour précis doit être ignoré. Deux mots t'aident. **`break`** (« casse ») **quitte la boucle tout de suite** : c'est la sortie de secours du rond-point. Tu l'as déjà vu dans `switch` ; ici, il sort de la boucle.",
    },
    {
      kind: "code",
      language: "java",
      caption: "break : on sort dès que i vaut 4.",
      code: `for (int i = 1; i <= 10; i++) {
    if (i == 4) {
        break;                  // on quitte la boucle
    }
    System.out.println(i);
}
System.out.println("Fini");
// Affiche : 1, 2, 3, puis Fini (chacun sur sa ligne)`,
    },
    {
      kind: "text",
      text: "Quand `i` vaut 4, Java rencontre `break` : il quitte la boucle immédiatement, sans afficher 4 ni continuer jusqu'à 10. Il reprend après l'accolade fermante et affiche « Fini ». Les tours 5 à 10 n'ont jamais lieu.",
    },
    {
      kind: "text",
      text: "**`continue`** fait autre chose : il **saute la fin du tour** et passe directement au tour suivant. On ne sort pas du rond-point, on saute juste les lignes qui restent dans ce tour. Dans un `for`, le pas (`i++`) est bien fait avant de repartir.",
    },
    {
      kind: "code",
      language: "java",
      caption: "continue : on ignore le tour où i vaut 3.",
      code: `for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;               // on saute le reste de ce tour
    }
    System.out.println(i);
}
// Affiche : 1, 2, 4, 5 (le 3 manque)`,
    },
    {
      kind: "comparison",
      title: "break ou continue ?",
      left: {
        label: "break",
        text: "On **quitte** la boucle. Plus aucun tour ne sera fait.",
        code: { language: "java", code: "if (i == 4) {\n    break;\n}" },
      },
      right: {
        label: "continue",
        text: "On **saute** le reste du tour. La boucle repart avec le tour suivant.",
        code: { language: "java", code: "if (i == 3) {\n    continue;\n}" },
      },
    },
    {
      kind: "text",
      text: "Une boucle peut contenir une autre boucle : c'est une **boucle imbriquée**. Image : une horloge. L'aiguille des heures avance d'un cran ; pendant ce temps, l'aiguille des minutes fait tout son tour. À chaque tour de la boucle extérieure, la boucle intérieure refait **tous** ses tours.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une boucle dans une boucle : 2 × 3 passages.",
      code: `for (int ligne = 1; ligne <= 2; ligne++) {
    for (int col = 1; col <= 3; col++) {
        System.out.print("(" + ligne + "," + col + ") ");
    }
    System.out.println();       // passe à la ligne suivante
}
// Affiche :
// (1,1) (1,2) (1,3)
// (2,1) (2,2) (2,3)`,
    },
    {
      kind: "text",
      text: "Ici, `ligne` vaut 1 et `col` passe par 1, 2, 3 ; puis `ligne` vaut 2 et `col` repasse par 1, 2, 3. Au total : 2 × 3 = 6 passages. Dernier point : un `break` écrit dans la boucle intérieure ne quitte **que la boucle intérieure** ; la boucle extérieure continue son chemin.",
    },
    {
      kind: "code",
      language: "java",
      caption: "break dans la boucle intérieure : seule celle-ci s'arrête.",
      code: `for (int a = 1; a <= 2; a++) {
    for (int b = 1; b <= 3; b++) {
        if (b == 2) {
            break;              // quitte la boucle sur b, pas celle sur a
        }
        System.out.println("a=" + a + " b=" + b);
    }
}
// Affiche : a=1 b=1, puis a=2 b=1`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : continue dans un while",
      text: "Dans un `while`, si `continue` arrive **avant** la ligne qui change le compteur, le compteur ne change plus et la boucle devient infinie. Dans un `for`, pas de souci : le pas est toujours fait.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 8 — Combiner : compter, additionner, chercher
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "bases-ctl-l8",
  title: "Compter, additionner, chercher",
  blocks: [
    {
      kind: "text",
      text: "Tu connais maintenant tous les outils. Les programmes réels les combinent pour trois usages : **compter** (combien y en a-t-il ?), **additionner** (quel est le total ?) et **chercher** (y en a-t-il un qui... ?). Le schéma est toujours le même : une case qui garde le résultat, une boucle qui passe en revue chaque nombre, et un `if` qui décide si ce nombre compte.",
    },
    {
      kind: "text",
      text: "Il nous faut un petit outil : l'opérateur `%`, qui donne le **reste de la division**. `7 % 2` vaut 1 (7 = 3 × 2 + 1) et `8 % 2` vaut 0. Un nombre est donc **pair** quand `nombre % 2 == 0`, et **impair** quand son reste vaut 1. Plus généralement, `nombre % 3 == 0` veut dire « multiple de 3 ». Dans l'exemple, on compte les nombres pairs de 1 à 10 et on les additionne en même temps.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Compter et additionner dans la même boucle.",
      code: `int pairs = 0;       // combien de nombres pairs
int somme = 0;       // total de ces nombres
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        pairs++;
        somme = somme + i;
    }
}
System.out.println(pairs + " pairs, somme " + somme);
// Affiche : 5 pairs, somme 30   (2 + 4 + 6 + 8 + 10)`,
    },
    {
      kind: "text",
      text: "Regarde où sont les cases : `pairs` et `somme` sont créées **avant** la boucle, avec 0 (rien compté, rien additionné). Pendant la boucle, le `if` ne laisse passer que les nombres pairs, et on met à jour les cases. Après la boucle, on affiche le résultat. Avant, pendant, après : c'est le plan de presque tous les programmes de ce genre.",
    },
    {
      kind: "comparison",
      title: "Où remet-on la case à zéro ?",
      left: {
        label: "Avant la boucle (juste)",
        text: "La case est mise à 0 **une seule fois**. Elle garde le total d'un tour à l'autre.",
        code: { language: "java", code: "int somme = 0;\nfor (int i = 1; i <= 4; i++) {\n    somme = somme + i;\n}" },
      },
      right: {
        label: "Dans la boucle (faux)",
        text: "La case repart de 0 à **chaque tour** : le total des tours précédents est perdu.",
        code: { language: "java", code: "int somme = 0;\nfor (int i = 1; i <= 4; i++) {\n    somme = 0;\n    somme = somme + i;\n}" },
      },
    },
    {
      kind: "text",
      text: "Pour **chercher**, on ajoute `break` : dès qu'on a trouvé, inutile de continuer. On met dans la case une valeur qui veut dire « pas trouvé » (ici -1, qui ne peut jamais être un bon résultat). Cherchons le premier multiple de 7 à partir de 31.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Chercher le premier multiple de 7 à partir de 31.",
      code: `int trouve = -1;                 // -1 = pas encore trouvé
for (int n = 31; n <= 50; n++) {
    if (n % 7 == 0) {
        trouve = n;                  // on garde la valeur
        break;                       // et on arrête de chercher
    }
}
System.out.println(trouve);
// n = 31, 32, 33, 34 : le reste n'est pas 0, on continue
// n = 35 : 35 % 7 vaut 0 -> trouve = 35, break
// Affiche : 35`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le plan à retenir",
      text: "**Avant** la boucle : créer la case avec une valeur de départ (0, ou -1 pour « pas trouvé »). **Pendant** : un `if` qui met la case à jour. **Après** : afficher. Si le résultat est faux, déroule la boucle avec un tableau, comme à la leçon 6.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Exercices (répartis sur les leçons plus bas)
// ---------------------------------------------------------------------------

const EXERCISES: Exercise[] = [
  // ----- Leçon 1 : if / else -----
  {
    kind: "mcq",
    id: "bases-ctl-01",
    difficulty: 1,
    tags: ["if-else", "conditions"],
    prompt: "Le programme arrive sur un `if (...) { ... } else { ... }`. Combien de routes prend-il ?",
    choices: [
      "Une seule : celle du `if` ou celle du `else`",
      "Les deux, l'une après l'autre",
      "Aucune, si la condition est fausse",
      "Cela dépend de la longueur des blocs",
    ],
    answer: 0,
    simple:
      "C'est un carrefour avec deux routes : tu en prends une, jamais les deux. Si la condition est vraie, tu prends la route du `if`. Si elle est fausse, tu prends celle du `else`. Avec un `else`, il y a donc toujours une route prise.",
    explanation:
      "Avec un `else`, exactement un des deux blocs s'exécute : celui du `if` quand la condition vaut `true`, celui du `else` sinon. Sans `else`, il peut ne rien se passer. La longueur des blocs n'a aucune influence.",
  },
  {
    kind: "output",
    id: "bases-ctl-02",
    difficulty: 1,
    tags: ["if-else", "conditions"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int age = 20;
if (age >= 18) {
    System.out.println("Majeur");
} else {
    System.out.println("Mineur");
}
System.out.println("Fin");`,
    },
    choices: ["`Majeur` puis `Fin`", "`Mineur` puis `Fin`", "`Majeur`, `Mineur` puis `Fin`", "Seulement `Fin`"],
    answer: 0,
    simple:
      "`age` vaut 20. La question `20 >= 18` a pour réponse oui (`true`) : on prend la route du `if` et on affiche `Majeur`. La route du `else` est ignorée. Ensuite, la ligne `Fin` est après le carrefour : elle est toujours faite.",
    explanation:
      "`20 >= 18` vaut `true` : le bloc du `if` s'exécute et celui du `else` est sauté. `System.out.println(\"Fin\")` est écrit après l'accolade fermante du `else`, il ne dépend donc d'aucune condition et s'exécute dans tous les cas.",
  },
  {
    kind: "fill",
    id: "bases-ctl-03",
    difficulty: 1,
    tags: ["if-else", "conditions"],
    prompt: "Complète le carrefour : s'il fait moins de 10 degrés on met un manteau, sinon un t-shirt.",
    code: {
      language: "java",
      code: `int temperature = 5;
{{1}} (temperature < 10) {
    System.out.println("Mets un manteau.");
} {{2}} {
    System.out.println("Mets un t-shirt.");
}`,
    },
    blanks: ["if", "else"],
    distractors: ["elif", "then", "when"],
    simple:
      "On pose la question avec `if` (« si ») : la température est-elle sous 10 ? Si oui, on met un manteau. Pour dire « sinon », Java utilise `else`. Les mots `elif` ou `then` existent dans d'autres langages, pas en Java.",
    explanation:
      "La syntaxe Java est `if (condition) { ... } else { ... }`. `elif` appartient à Python, `then` à d'autres langages : Java ne les connaît pas.",
  },
  {
    kind: "spot",
    id: "bases-ctl-04",
    difficulty: 1,
    tags: ["if-else", "egalite"],
    prompt: "Ce code ne compile pas : Java le refuse. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `int note = 12;
if (note = 10) {
    System.out.println("Pile 10");
}`,
    },
    faultyLine: 2,
    reasons: [
      "Un seul `=` range une valeur dans la case : pour poser la question il faut `==`",
      "Il manque un `else` après le bloc du `if`",
      "Les parenthèses sont interdites après le mot `if`",
      "`note` doit être déclarée après le `if`, pas avant",
    ],
    reasonAnswer: 0,
    simple:
      "Un seul `=` range une valeur dans la case : il ne pose pas de question. Or un `if` attend une question dont la réponse est vrai ou faux. Pour demander « note vaut-elle 10 ? », on écrit `==`. C'est donc la ligne 2 qui est fautive ; la ligne 1, elle, est correcte.",
    explanation:
      "`note = 10` est une affectation : elle a pour valeur un `int`, pas un `boolean`. Le compilateur répond « incompatible types: int cannot be converted to boolean ». La condition doit s'écrire `note == 10`.",
  },

  // ----- Leçon 2 : else if -----
  {
    kind: "output",
    id: "bases-ctl-05",
    difficulty: 1,
    tags: ["else-if", "conditions"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int heure = 15;
if (heure < 12) {
    System.out.println("Matin");
} else if (heure < 18) {
    System.out.println("Jour");
} else {
    System.out.println("Soir");
}`,
    },
    choices: ["`Jour`", "`Matin`", "`Soir`", "`Jour` puis `Soir`"],
    answer: 0,
    simple:
      "On passe les guichets un par un. `heure` vaut 15. Premier guichet : `15 < 12` ? Non, on passe. Deuxième guichet : `15 < 18` ? Oui : on affiche `Jour` et on sort de la chaîne. Le `else` n'est jamais lu.",
    explanation:
      "La première condition vraie gagne : `15 < 12` est faux, `15 < 18` est vrai, donc `Jour` s'affiche et le reste de la chaîne est ignoré, `else` compris.",
  },
  {
    kind: "order",
    id: "bases-ctl-06",
    difficulty: 1,
    tags: ["else-if", "ordre-conditions"],
    prompt: "Remets les tests dans l'ordre où le programme doit les poser pour qu'une note de 18 donne bien « Excellent ».",
    items: [
      "`note >= 16` : Excellent",
      "`note >= 12` : Bien",
      "`note >= 8` : Moyen",
      "Sinon : Insuffisant",
    ],
    simple:
      "Comme la première condition vraie gagne, on commence par le guichet le plus difficile à passer (16 ou plus), puis on descend vers les plus larges. Le « sinon » reste en dernier : il prend tout ce que les autres n'ont pas pris.",
    explanation:
      "Les conditions se recouvrent : 18 est supérieur à 8, à 12 et à 16. Dans une chaîne `else if`, on place donc d'abord la condition la plus exigeante, puis les plus larges, et le `else` en dernier.",
  },
  {
    kind: "mcq",
    id: "bases-ctl-07",
    difficulty: 1,
    tags: ["else-if", "ordre-conditions"],
    prompt: "Avec `note = 18`, ce code affiche « Moyen » au lieu de « Excellent ». Pourquoi ?",
    code: {
      language: "java",
      code: `int note = 18;
if (note >= 8) {
    System.out.println("Moyen");
} else if (note >= 12) {
    System.out.println("Bien");
} else if (note >= 16) {
    System.out.println("Excellent");
}`,
    },
    choices: [
      "La première condition vraie gagne, et `18 >= 8` est vraie dès le début",
      "Java teste toutes les conditions et garde la dernière qui est vraie",
      "Il manque un `else` tout à la fin de la chaîne",
      "`18` est trop grand pour être comparé avec `8`",
    ],
    answer: 0,
    simple:
      "Les guichets sont dans le mauvais ordre. Le tout premier demande seulement « 8 ou plus ? » : 18 passe, et on sort tout de suite avec `Moyen`. Les deux autres guichets ne sont jamais regardés. Pour corriger, on met le plus exigeant en premier.",
    explanation:
      "Une chaîne `else if` s'arrête à la première condition vraie. `18 >= 8` est vrai, donc `Moyen` s'affiche et les `else if` suivants sont ignorés. Le `else` final est facultatif et ne change rien ici. Correction : tester `>= 16` d'abord, puis `>= 12`, puis `>= 8`.",
  },
  {
    kind: "recall",
    id: "bases-ctl-08",
    difficulty: 1,
    tags: ["else-if", "conditions"],
    prompt:
      "Explique avec tes mots la différence entre une chaîne `if / else if / else` et plusieurs `if` à la suite. Que se passe-t-il quand plusieurs conditions sont vraies ?",
    simple:
      "Une chaîne `else if`, c'est un seul carrefour : on prend la première route dont la condition est vraie, et on laisse les autres. Des `if` séparés, ce sont plusieurs carrefours à la file : chacun est testé, donc plusieurs routes peuvent être prises.",
    explanation:
      "Dans une chaîne `if / else if / else`, un seul bloc s'exécute : celui de la première condition vraie, les suivantes ne sont pas évaluées. Avec des `if` séparés, chaque condition est testée à part et plusieurs blocs peuvent s'exécuter (par exemple avec `n = 15` : `if (n > 10)` et `if (n > 5)` affichent tous les deux). Dans une chaîne, on place la condition la plus exigeante en premier.",
    keyPoints: [
      "Chaîne : une seule route, la première condition vraie",
      "`if` séparés : chacun est testé, plusieurs blocs possibles",
      "Dans une chaîne, la condition la plus exigeante en premier",
    ],
  },

  // ----- Leçon 3 : switch -----
  {
    kind: "output",
    id: "bases-ctl-09",
    difficulty: 1,
    tags: ["switch"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `String langue = "fr";
switch (langue) {
    case "en":
        System.out.println("Hello");
        break;
    case "fr":
        System.out.println("Bonjour");
        break;
    default:
        System.out.println("?");
}`,
    },
    choices: ["`Bonjour`", "`Hello`", "`?`", "`Hello` puis `Bonjour`"],
    answer: 0,
    simple:
      "`langue` vaut \"fr\". Java saute directement au `case \"fr\":` et affiche `Bonjour`. Puis il rencontre `break` : il sort du `switch`. Le cas \"en\" a été ignoré, et le `default` aussi, puisqu'un cas correspondait.",
    explanation:
      "`switch` compare le contenu du texte avec chaque `case`. `\"fr\"` correspond au deuxième : `Bonjour` s'affiche, `break` termine le `switch`. Le `default` ne sert que si aucun `case` ne correspond.",
  },
  {
    kind: "fill",
    id: "bases-ctl-10",
    difficulty: 1,
    tags: ["switch", "forme-flechee"],
    prompt: "Complète ce `switch` en forme fléchée.",
    code: {
      language: "java",
      code: `String couleur = "vert";
{{1}} (couleur) {
    case "rouge" -> System.out.println("Stop");
    case "vert" -> System.out.println("Go");
    {{2}} -> System.out.println("Attention");
}`,
    },
    blanks: ["switch", "default"],
    distractors: ["if", "else", "break"],
    simple:
      "L'aiguillage s'appelle `switch` : on lui donne la variable à regarder entre parenthèses. Le cas fourre-tout, qui prend tout ce qui n'est pas listé, s'appelle `default`. Avec les flèches `->`, on n'a pas besoin de `break`.",
    explanation:
      "La forme fléchée garde `switch (valeur) { ... }` et le cas par défaut `default ->`. `else` n'existe pas dans un `switch` ; `break` n'est pas nécessaire avec les flèches, car aucun cas ne dégringole dans le suivant.",
  },
  {
    kind: "match",
    id: "bases-ctl-11",
    difficulty: 1,
    tags: ["switch"],
    prompt: "Associe chaque morceau de `switch` à son rôle.",
    pairs: [
      { left: "`case 3:`", right: "Un cas : on y saute quand la valeur vaut 3" },
      { left: "`break`", right: "Sort du `switch` pour ne pas dégringoler" },
      { left: "`default`", right: "Prend toutes les valeurs que les cas n'ont pas prises" },
      { left: "`case 1 ->`", right: "La forme fléchée, sans `break` à écrire" },
    ],
    simple:
      "Un `case`, c'est une porte : on y entre quand la valeur correspond. `break` veut dire « sors du `switch` », sinon Java continue dans le cas suivant. `default` est la porte fourre-tout. Et la flèche `->` est une version plus sûre, qui n'a pas besoin de `break`.",
    explanation:
      "`case` désigne une valeur précise, `break` termine le `switch` dans la forme classique, `default` couvre les valeurs non listées, et `->` introduit la forme fléchée qui ne dégringole jamais dans le cas suivant.",
  },
  {
    kind: "output",
    id: "bases-ctl-12",
    difficulty: 2,
    tags: ["switch", "break"],
    prompt: "Qu'affiche ce code ? Regarde bien les `break`.",
    code: {
      language: "java",
      code: `int niveau = 2;
switch (niveau) {
    case 1:
        System.out.println("Bas");
    case 2:
        System.out.println("Moyen");
    case 3:
        System.out.println("Haut");
        break;
    default:
        System.out.println("Inconnu");
}`,
    },
    choices: ["`Moyen` puis `Haut`", "`Moyen`", "`Moyen`, `Haut` puis `Inconnu`", "`Bas`, `Moyen` puis `Haut`"],
    answer: 0,
    simple:
      "`niveau` vaut 2 : on saute au `case 2` et on affiche `Moyen`. Mais il n'y a pas de `break` juste après : on dégringole dans le `case 3` et on affiche `Haut`. Là, il y a un `break` : on sort. Le `case 1` est passé (on a sauté par-dessus), et `default` n'est pas atteint.",
    explanation:
      "Sans `break`, l'exécution continue dans le cas suivant (« fall-through ») jusqu'au premier `break`. On entre à `case 2`, on affiche `Moyen`, on continue dans `case 3` (`Haut`), puis `break` termine. `case 1` est sauté et `default` n'est jamais atteint, car `break` arrive avant.",
  },

  // ----- Leçon 4 : while -----
  {
    kind: "output",
    id: "bases-ctl-13",
    difficulty: 1,
    tags: ["while", "boucles"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `int n = 1;
while (n <= 3) {
    System.out.println(n);
    n = n + 1;
}`,
    },
    choices: ["`1`, `2` puis `3`", "`1`, `2`, `3` puis `4`", "`1` et `2` seulement", "Rien : la boucle ne démarre pas"],
    answer: 0,
    simple:
      "On déroule. `n` vaut 1 : `1 <= 3` est vrai, on affiche 1, `n` passe à 2. `2 <= 3` : on affiche 2, `n` passe à 3. `3 <= 3` est encore vrai (c'est un « plus petit ou égal ») : on affiche 3, `n` passe à 4. `4 <= 3` est faux : on sort. Trois tours, donc 1, 2, 3.",
    explanation:
      "Le test `n <= 3` est fait avant chaque tour. Il est vrai pour 1, 2 et 3 (le `<=` inclut 3) et faux pour 4. La boucle fait donc trois tours et affiche 1, 2, 3.",
  },
  {
    kind: "recall",
    id: "bases-ctl-14",
    difficulty: 1,
    tags: ["while", "boucle-infinie"],
    prompt: "Explique ce que fait une boucle `while`, et pourquoi elle peut ne jamais s'arrêter.",
    simple:
      "Un `while` est un rond-point : à chaque passage il regarde la condition, et tant qu'elle est vraie il refait un tour. Si rien dans le bloc ne rend un jour la condition fausse, on tourne en rond pour toujours : c'est une boucle infinie.",
    explanation:
      "`while (condition) { ... }` répète le bloc tant que la condition est vraie ; elle est testée avant chaque tour, donc la boucle peut faire zéro tour. Si le bloc ne modifie jamais ce qui intervient dans la condition (ou la modifie dans le mauvais sens), la condition reste vraie et la boucle est infinie.",
    keyPoints: [
      "Répète le bloc tant que la condition est vraie",
      "Condition testée avant chaque tour (peut faire zéro tour)",
      "Boucle infinie si rien ne rend la condition fausse",
    ],
  },
  {
    kind: "spot",
    id: "bases-ctl-15",
    difficulty: 2,
    tags: ["while", "boucle-infinie"],
    prompt: "Ce programme devait compter à rebours de 5 à 1, mais il ne s'arrête jamais. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `int n = 5;
while (n > 0) {
    System.out.println(n);
    n = n + 1;
}`,
    },
    faultyLine: 4,
    reasons: [
      "`n` augmente au lieu de baisser : `n > 0` reste vrai pour toujours",
      "La condition devrait être `n >= 0` pour s'arrêter",
      "`println` ne peut pas être utilisé dans un `while`",
      "`n` doit être créée à l'intérieur de la boucle",
    ],
    reasonAnswer: 0,
    simple:
      "Pour finir par sortir du rond-point, `n` doit baisser jusqu'à 0. Ici, la ligne 4 fait monter `n` : 6, 7, 8... Il ne sera jamais plus petit que 1 : `n > 0` reste vrai, et la boucle ne s'arrête pas. Il faut écrire `n = n - 1` (ou `n--`).",
    explanation:
      "La condition `n > 0` ne peut devenir fausse que si `n` diminue. La ligne `n = n + 1` fait l'inverse : `n` croît sans fin, la condition reste vraie, c'est une boucle infinie. La correction est `n = n - 1;`.",
  },

  // ----- Leçon 5 : for -----
  {
    kind: "fill",
    id: "bases-ctl-16",
    difficulty: 1,
    tags: ["for", "boucles"],
    prompt: "Complète la boucle pour qu'elle affiche 1, 2, 3, 4, 5.",
    code: {
      language: "java",
      code: `for (int i = {{1}}; i {{2}} 5; i++) {
    System.out.println(i);
}`,
    },
    blanks: ["1", "<="],
    distractors: ["0", "<", ">"],
    simple:
      "Il faut que le compteur `i` parte de 1 et que la boucle continue tant que `i` est plus petit **ou égal** à 5, pour que le 5 soit affiché. Avec `<` seul, on s'arrêterait à 4. Avec 0 au départ, on afficherait aussi un 0.",
    explanation:
      "Départ à 1 avec la condition `i <= 5` : `i` vaut 1, 2, 3, 4, 5, soit cinq tours. `i < 5` s'arrêterait à 4 ; un départ à 0 afficherait un 0 en trop ; `>` ne ferait aucun tour, car `1 > 5` est faux dès le départ.",
  },
  {
    kind: "output",
    id: "bases-ctl-17",
    difficulty: 2,
    tags: ["for", "boucles", "pas"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `for (int i = 10; i > 0; i = i - 3) {
    System.out.print(i + " ");
}`,
    },
    choices: ["`10 7 4 1`", "`10 7 4`", "`7 4 1`", "`10 7 4 1 -2`"],
    answer: 0,
    simple:
      "Le compteur part de 10 et perd 3 à chaque tour. Tour 1 : `i` vaut 10, on l'affiche. Puis 7, puis 4, puis 1 : `1 > 0` est encore vrai, on l'affiche. Ensuite `i` vaut -2 : `-2 > 0` est faux, on sort sans l'afficher. On lit donc `10 7 4 1`.",
    explanation:
      "Valeurs de `i` : 10, 7, 4, 1 (toutes > 0, donc affichées), puis -2 (condition fausse, boucle terminée). `print` n'ajoute pas de retour à la ligne : tout apparaît sur une ligne, séparé par des espaces.",
  },
  {
    kind: "recall",
    id: "bases-ctl-18",
    difficulty: 2,
    tags: ["for", "boucles"],
    prompt: "Dans `for (int i = 0; i < 4; i++)`, que fait chacune des trois parties ? Combien de tours, et quelles valeurs prend `i` ?",
    simple:
      "Les trois parties sont : le départ (`int i = 0` : on crée la case `i` avec 0, une fois), la condition (`i < 4` : testée avant chaque tour) et le pas (`i++` : ajoute 1 à la fin de chaque tour). `i` prend les valeurs 0, 1, 2, 3 : quatre tours. Quand `i` vaut 4, la condition est fausse et on sort.",
    explanation:
      "`int i = 0` : initialisation, exécutée une seule fois avant le premier tour. `i < 4` : condition, testée avant chaque tour. `i++` : pas, exécuté à la fin de chaque tour. `i` vaut 0, 1, 2, 3 pendant les tours (4 tours) ; à 4, `4 < 4` est faux et la boucle s'arrête.",
    keyPoints: [
      "Départ : une seule fois, avant le premier tour",
      "Condition : testée avant chaque tour",
      "Pas : `i++` ajoute 1 à la fin de chaque tour",
      "i vaut 0, 1, 2, 3 : 4 tours",
    ],
  },

  // ----- Leçon 6 : suivre une boucle, off-by-one -----
  {
    kind: "output",
    id: "bases-ctl-19",
    difficulty: 2,
    tags: ["trace", "somme", "for"],
    prompt: "Qu'affiche ce code ? Déroule-le dans un tableau.",
    code: {
      language: "java",
      code: `int somme = 0;
for (int i = 1; i <= 5; i++) {
    somme = somme + i;
}
System.out.println(somme);`,
    },
    choices: ["`15`", "`10`", "`5`", "`21`"],
    answer: 0,
    simple:
      "On additionne tour après tour. Départ : `somme` vaut 0. i = 1 : somme = 1. i = 2 : somme = 3. i = 3 : somme = 6. i = 4 : somme = 10. i = 5 : somme = 15. Puis `i` passe à 6, `6 <= 5` est faux : on sort et on affiche 15.",
    explanation:
      "La boucle additionne 1 + 2 + 3 + 4 + 5 = 15. `10` serait le résultat de `i <= 4` (un tour de moins), et `21` celui de `i <= 6` (un tour de plus).",
  },
  {
    kind: "output",
    id: "bases-ctl-20",
    difficulty: 2,
    tags: ["off-by-one", "for", "trace"],
    prompt: "Qu'affiche ce programme ? Déroule la boucle pour compter ses tours.",
    code: {
      language: "java",
      code: `int tours = 0;
for (int i = 1; i < 5; i++) {
    tours++;
}
System.out.println(tours);`,
    },
    choices: ["`4`", "`5`", "`3`", "`6`"],
    answer: 0,
    simple:
      "Le compteur part de 1, et la condition est `i < 5` : 5 est exclu. `i` vaut donc 1, 2, 3, 4 : quatre tours, et `tours++` ajoute 1 à chaque tour. Quand `i` vaut 5, `5 < 5` est faux : on s'arrête.",
    explanation:
      "Départ à 1 avec `<` 5 : `i` vaut 1, 2, 3, 4, soit 4 tours. Pour obtenir 5 tours avec un départ à 1, il aurait fallu `i <= 5`. C'est le mélange classique « départ à 1 avec `<` » qui fait un tour de moins.",
  },
  {
    kind: "spot",
    id: "bases-ctl-21",
    difficulty: 2,
    tags: ["off-by-one", "for"],
    prompt: "Ce programme doit afficher « Bonjour » exactement 3 fois, mais il l'affiche 4 fois. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `for (int i = 0; i <= 3; i++) {
    System.out.println("Bonjour");
}`,
    },
    faultyLine: 1,
    reasons: [
      "`i <= 3` avec un départ à 0 donne 4 tours : 0, 1, 2 et 3",
      "Le compteur doit toujours partir de 1, jamais de 0",
      "Le pas devrait être `i--` pour compter moins de tours",
      "Le `println` devrait être placé avant le `for`",
    ],
    reasonAnswer: 0,
    simple:
      "Le compteur part de 0, puis passe par 1, 2 et 3 : ça fait **quatre** valeurs, donc quatre tours. C'est la ligne 1 qui est en cause : le `<=` laisse entrer la valeur 3. Avec `i < 3`, on aurait 0, 1, 2 : trois tours. La ligne 2 est correcte.",
    explanation:
      "Départ à 0 avec `<=` N donne N + 1 tours : ici 4. La correction est `i < 3` (départ à 0), ou `for (int i = 1; i <= 3; i++)` (départ à 1). Ce n'est pas le départ à 0 qui est fautif, c'est le `<=`.",
  },
  {
    kind: "recall",
    id: "bases-ctl-22",
    difficulty: 2,
    tags: ["off-by-one", "for"],
    prompt:
      "Tu veux répéter une action exactement 10 fois. Écris l'en-tête d'un `for` qui part de 0, puis un autre qui part de 1, et explique comment tu vérifies le nombre de tours.",
    simple:
      "Deux écritures marchent : `for (int i = 0; i < 10; i++)` (de 0 à 9) et `for (int i = 1; i <= 10; i++)` (de 1 à 10). Dans les deux cas on a dix valeurs, donc dix tours. Pour vérifier, je remplace 10 par un petit nombre comme 2 et je déroule avec un tableau.",
    explanation:
      "`for (int i = 0; i < 10; i++)` : `i` vaut 0..9, soit 10 tours. `for (int i = 1; i <= 10; i++)` : `i` vaut 1..10, soit 10 tours. Règle : départ à 0 avec `<` N, ou départ à 1 avec `<=` N. Pour vérifier : remplacer 10 par 1 ou 2, et dérouler la boucle dans un tableau en n'oubliant pas le dernier test raté.",
    keyPoints: [
      "`for (int i = 0; i < 10; i++)`",
      "`for (int i = 1; i <= 10; i++)`",
      "Départ 0 avec `<`, départ 1 avec `<=`",
      "Vérifier avec un tout petit nombre dans un tableau",
    ],
  },

  // ----- Leçon 7 : break, continue, imbriquées -----
  {
    kind: "match",
    id: "bases-ctl-23",
    difficulty: 1,
    tags: ["break-continue", "boucles-imbriquees"],
    prompt: "Associe chaque notion à ce qu'elle fait.",
    pairs: [
      { left: "`break`", right: "Quitte la boucle tout de suite" },
      { left: "`continue`", right: "Saute la fin du tour et passe au suivant" },
      { left: "Boucle imbriquée", right: "Une boucle placée à l'intérieur d'une autre" },
      { left: "`break` dans la boucle intérieure", right: "Ne quitte que la boucle intérieure" },
    ],
    simple:
      "`break` est la sortie de secours du rond-point : on part tout de suite. `continue` saute juste ce qui reste du tour en cours. Une boucle imbriquée est une boucle dans une boucle, comme les minutes dans une heure. Et un `break` dans la petite boucle ne fait sortir que de la petite boucle.",
    explanation:
      "`break` termine la boucle qui le contient ; `continue` abandonne le tour en cours et passe au suivant. Dans une boucle imbriquée, `break` ne concerne que la boucle la plus proche : l'extérieure continue.",
  },
  {
    kind: "output",
    id: "bases-ctl-24",
    difficulty: 2,
    tags: ["break-continue", "for", "trace"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `for (int i = 1; i <= 6; i++) {
    if (i == 3) {
        continue;
    }
    if (i == 5) {
        break;
    }
    System.out.print(i + " ");
}`,
    },
    choices: ["`1 2 4`", "`1 2 4 6`", "`1 2`", "`1 2 3 4`"],
    answer: 0,
    simple:
      "On déroule. i = 1 : on affiche 1. i = 2 : on affiche 2. i = 3 : `continue`, on saute l'affichage et on passe au tour suivant. i = 4 : on affiche 4. i = 5 : `break`, on quitte la boucle. Le 6 n'est jamais atteint. On a donc affiché 1 2 4.",
    explanation:
      "`continue` à `i == 3` ignore l'affichage de 3 ; `break` à `i == 5` termine la boucle avant l'affichage de 5, et le tour 6 n'a jamais lieu. Sortie : `1 2 4 `.",
  },
  {
    kind: "output",
    id: "bases-ctl-25",
    difficulty: 3,
    tags: ["boucles-imbriquees", "break-continue", "trace"],
    prompt: "Quelle valeur ce programme affiche-t-il ? Attention : un `break` est caché dans la boucle intérieure.",
    code: {
      language: "java",
      code: `int compte = 0;
for (int a = 1; a <= 3; a++) {
    for (int b = 1; b <= 4; b++) {
        if (b == 3) {
            break;
        }
        compte++;
    }
}
System.out.println(compte);`,
    },
    choices: ["`6`", "`2`", "`12`", "`3`"],
    answer: 0,
    simple:
      "Pour chaque valeur de `a` (3 en tout), la petite boucle recommence. Elle compte `b = 1` puis `b = 2`, et à `b = 3` le `break` la coupe : 2 de plus dans `compte`. Mais seule la petite boucle s'arrête : la grande continue. Trois tours de la grande boucle, 2 à chaque fois : 3 × 2 = 6.",
    explanation:
      "La boucle intérieure ajoute 1 pour `b = 1` et `b = 2`, puis `break` à `b = 3` (sans ajouter). Ce `break` ne quitte que la boucle intérieure : la boucle extérieure fait ses 3 tours, soit 3 × 2 = 6. `12` serait le résultat sans `break` ; `2` celui d'un `break` qui quitterait aussi la boucle extérieure.",
  },

  // ----- Leçon 8 : combiner -----
  {
    kind: "fill",
    id: "bases-ctl-26",
    difficulty: 2,
    tags: ["compteur", "boucles", "conditions"],
    prompt: "Complète ce programme qui compte les multiples de 3 entre 1 et 10 (il doit afficher 3 : 3, 6 et 9).",
    code: {
      language: "java",
      code: `int compteur = {{1}};
for (int i = 1; i <= 10; i++) {
    if (i % 3 == 0) {
        {{2}};
    }
}
System.out.println(compteur);`,
    },
    blanks: ["0", "compteur++"],
    distractors: ["1", "i++", "compteur = 0"],
    simple:
      "La case `compteur` doit partir de 0 : on n'a encore rien compté. Quand un nombre est un multiple de 3, on ajoute 1 à la case avec `compteur++`. Attention à ne pas écrire `i++` : ça changerait le compteur de la boucle, pas le nôtre.",
    explanation:
      "Un compteur démarre à 0 avant la boucle et s'incrémente (`compteur++`) chaque fois que le `if` est vrai. `i++` modifierait la variable de la boucle et fausserait le déroulement ; `compteur = 0` remettrait le total à zéro au lieu de l'augmenter.",
  },
  {
    kind: "spot",
    id: "bases-ctl-27",
    difficulty: 3,
    tags: ["somme", "boucles", "trace"],
    prompt: "Ce programme devrait afficher 10 (1 + 2 + 3 + 4), mais il affiche 4. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `int somme = 0;
for (int i = 1; i <= 4; i++) {
    somme = 0;
    somme = somme + i;
}
System.out.println(somme);`,
    },
    faultyLine: 3,
    reasons: [
      "`somme` est remise à 0 à chaque tour : le total est perdu",
      "La condition devrait être `i < 4`, pas `i <= 4`",
      "`somme` aurait dû être créée à l'intérieur de la boucle",
      "Le `println` devrait être placé dans la boucle",
    ],
    reasonAnswer: 0,
    simple:
      "Regarde la case `somme` tour après tour. Tour 1 : remise à 0, puis 0 + 1 = 1. Tour 2 : remise à 0 (le 1 est perdu), puis 0 + 2 = 2. Et ainsi de suite : au dernier tour, 0 + 4 = 4. La remise à zéro doit être faite **une seule fois, avant la boucle**, comme à la ligne 1.",
    explanation:
      "La ligne 3 écrase le total à chaque tour : seul le dernier ajout (4) survit. Il suffit de la supprimer, `somme = 0` de la ligne 1 faisant déjà le travail. La condition `i <= 4` est correcte (on veut bien additionner jusqu'à 4).",
  },
  {
    kind: "recall",
    id: "bases-ctl-28",
    difficulty: 2,
    tags: ["somme", "boucles", "conditions"],
    prompt:
      "Tu veux additionner les nombres impairs de 1 à 9. Décris où tu crées la case du total, ce que fait la boucle, ce que teste le `if`, et ce que tu affiches à la fin.",
    simple:
      "Avant la boucle, je crée une case `somme` qui vaut 0. La boucle passe de 1 à 9. Dans la boucle, un `if` regarde si le nombre est impair (son reste dans la division par 2 vaut 1) : si oui, j'ajoute le nombre à `somme`. Après la boucle, j'affiche `somme` : 25.",
    explanation:
      "`int somme = 0;` avant la boucle ; `for (int i = 1; i <= 9; i++)` ; `if (i % 2 == 1) { somme = somme + i; }` ; `System.out.println(somme);` après la boucle. Le résultat est 1 + 3 + 5 + 7 + 9 = 25. Le test peut aussi s'écrire `i % 2 != 0`.",
    keyPoints: [
      "`somme = 0` créée avant la boucle",
      "Boucle de 1 à 9",
      "`if (i % 2 == 1)` pour ne garder que les impairs",
      "`somme = somme + i` dans le if, affichage après la boucle (25)",
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
  id: "bases-controle",
  format: "doux",
  title: "Conditions et boucles",
  objective:
    "Savoir faire prendre des décisions et répéter des actions à un programme, et suivre le déroulement d'une boucle pas à pas.",
  prerequisites: ["bases-variables"],
  units: [
    l1, ...pick("bases-ctl-01", "bases-ctl-02", "bases-ctl-03", "bases-ctl-04"),
    l2, ...pick("bases-ctl-05", "bases-ctl-06", "bases-ctl-07", "bases-ctl-08"),
    l3, ...pick("bases-ctl-09", "bases-ctl-10", "bases-ctl-11", "bases-ctl-12"),
    l4, ...pick("bases-ctl-13", "bases-ctl-14", "bases-ctl-15"),
    l5, ...pick("bases-ctl-16", "bases-ctl-17", "bases-ctl-18"),
    l6, ...pick("bases-ctl-19", "bases-ctl-20", "bases-ctl-21", "bases-ctl-22"),
    l7, ...pick("bases-ctl-23", "bases-ctl-24", "bases-ctl-25"),
    l8, ...pick("bases-ctl-26", "bases-ctl-27", "bases-ctl-28"),
  ],
};
