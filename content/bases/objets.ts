/**
 * Fondations — Classes et objets : classe (plan) et objet (maison), champs,
 * méthodes d'objet et `this`, constructeur, variable d'objet = flèche, `null`,
 * `static`, `private` et accesseurs, `==` entre objets.
 * 9 leçons, 28 exercices — format doux. Une seule petite classe fil rouge,
 * `Chien`, du début à la fin ; chaque exercice est précédé de la leçon qui
 * enseigne ce qu'il demande.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Pourquoi des classes : le plan et la maison
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "bases-obj-l1",
  title: "Pourquoi des classes : le plan et la maison",
  blocks: [
    {
      kind: "text",
      text: "Imagine un programme pour un refuge d'animaux. Tu dois retenir des chiens, avec pour chacun un nom et un âge. Avec ce que tu sais déjà, le réflexe est de créer une variable par information. Voici ce que ça donne avec seulement deux chiens.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ça marche, mais ça se complique très vite.",
      code: `String nom1 = "Rex";
int age1 = 3;

String nom2 = "Mila";
int age2 = 5;

// pour 100 chiens : 200 variables à gérer à la main`,
    },
    {
      kind: "text",
      text: "Deux problèmes. D'abord le nombre : pour cent chiens, il te faudrait deux cents variables. Ensuite, rien ne dit que `nom1` et `age1` parlent du même chien : c'est toi qui dois t'en souvenir, et une seule erreur de numéro mélange tout. Et si un chien doit savoir aboyer, où ranges-tu cette action ? Il nous faudrait un moyen de **regrouper**, au même endroit, les informations d'un chien et ce qu'il sait faire.",
    },
    {
      kind: "text",
      text: "Java propose pour ça la **classe**. Une classe est un **plan** : un document qui décrit à quoi ressemble une chose, ici un chien. Elle dit quelles informations on garde (un nom, un âge) et ce que la chose sait faire. Mais un plan de maison ne te permet pas d'habiter quelque part : il faut d'abord construire. Une maison construite avec ce plan s'appelle un **objet**. Avec un seul plan, tu peux construire autant de maisons que tu veux.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le plan d'un chien : un nom et un âge. Rien n'est construit pour l'instant.",
      code: `class Chien {
    String nom;
    int age;
}`,
    },
    {
      kind: "text",
      text: "Relis bien la légende : écrire `class Chien { ... }` ne crée **aucun chien**. Ça dessine seulement le plan. Les chiens, eux, seront construits plus tard, un par un, à partir de ce plan. Un détail d'écriture : le nom d'une classe commence par une majuscule (`Chien`) et se met au singulier, parce qu'il décrit **un** chien.",
    },
    {
      kind: "comparison",
      title: "Plan ou maison ?",
      left: {
        label: "La classe (le plan)",
        text: "Il n'y en a qu'une. Elle décrit comment est fait un chien. On ne peut pas habiter dedans.",
        code: { language: "java", code: "class Chien { ... }" },
      },
      right: {
        label: "Un objet (la maison)",
        text: "On peut en construire autant qu'on veut. Chacun est un vrai chien, avec ses propres informations.",
        code: { language: "text", code: "Rex   Mila   Nala" },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "Une **classe** est un plan : elle décrit. Un **objet** est une maison construite avec ce plan : il existe vraiment. Un seul plan, autant d'objets qu'on veut.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 2 — Les champs : ce que chaque objet garde
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "bases-obj-l2",
  title: "Les champs : ce que chaque objet garde",
  blocks: [
    {
      kind: "text",
      text: "Le plan `Chien` est écrit, mais il n'y a encore aucun chien. Essayons de donner un nom à Rex directement avec le nom du plan. Ça ne marche pas, et c'est instructif : un plan ne peut pas avoir de nom de chien, parce qu'un plan n'est pas un chien. Seul un chien **construit** peut en avoir un.",
    },
    {
      kind: "code",
      language: "java",
      caption: "On ne peut pas remplir le plan lui-même.",
      code: `class Chien {
    String nom;
    int age;
}

Chien.nom = "Rex";   // ne compile pas : le plan n'a pas de nom`,
    },
    {
      kind: "text",
      text: "Pour avoir un chien, il faut le **construire** avec le mot **`new`**. `new Chien()` dit à Java : « construis une nouvelle maison avec le plan `Chien` ». On range le résultat dans une variable dont le type est le nom du plan. Ensuite, un **point** permet d'atteindre ce qu'il y a dans le chien : `rex.nom` se lit « le nom de rex ».",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux chiens construits avec le même plan.",
      code: `Chien rex = new Chien();
rex.nom = "Rex";
rex.age = 3;

Chien mila = new Chien();
mila.nom = "Mila";
mila.age = 5;

System.out.println(rex.nom);    // Rex
System.out.println(mila.age);   // 5`,
    },
    {
      kind: "text",
      text: "Les informations que le plan prévoit, ici `nom` et `age`, s'appellent des **champs**. Ce sont les caractéristiques de chaque objet, comme le nombre de pièces ou la couleur des murs d'une maison. Et surtout : **chaque objet a ses propres valeurs**. Changer l'âge de `rex` ne change pas celui de `mila`. Deux maisons du même plan peuvent avoir des murs de couleurs différentes.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce que contiennent les deux objets après ces lignes.",
      code: `rex   ->  nom = "Rex"    age = 3
mila  ->  nom = "Mila"   age = 5`,
    },
    {
      kind: "text",
      text: "Si tu ne remplis pas un champ, Java lui donne une valeur de départ. Pour un nombre entier comme `age`, c'est `0`. Pour un texte comme `nom`, c'est « rien » : on écrit `null`, et on y reviendra à la leçon 6. Donc un `new Chien()` tout neuf, avant que tu ne remplisses quoi que ce soit, a un âge de `0`.",
    },
    {
      kind: "comparison",
      title: "Le point : sur quoi ?",
      left: {
        label: "rex.nom",
        text: "Le nom du chien `rex`. Ça marche : `rex` est un objet construit avec `new`.",
        code: { language: "java", code: 'rex.nom = "Rex";' },
      },
      right: {
        label: "Chien.nom",
        text: "Le nom « du plan ». Ça ne veut rien dire : un plan n'a pas de nom de chien, ce sont les chiens construits qui en ont.",
        code: { language: "java", code: 'Chien.nom = "Rex";' },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "Un **champ** est une caractéristique de l'objet. `new` construit l'objet, le **point** atteint ses champs, et chaque objet garde ses propres valeurs. Sans `new`, il n'y a pas de chien.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 3 — Les méthodes d'objet : ce qu'un chien sait faire
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "bases-obj-l3",
  title: "Les méthodes d'objet : ce qu'un chien sait faire",
  blocks: [
    {
      kind: "text",
      text: "Un chien n'a pas que des caractéristiques : il sait aussi faire des choses, comme aboyer ou vieillir d'un an. Essayons sans rien de nouveau : à chaque endroit où un chien doit aboyer, on écrit le message à la main.",
    },
    {
      kind: "code",
      language: "java",
      caption: "À recopier pour chaque chien, à chaque endroit.",
      code: `Chien rex = new Chien();
rex.nom = "Rex";
System.out.println(rex.nom + " dit : Ouaf !");   // et pareil pour mila, nala...`,
    },
    {
      kind: "text",
      text: "Fastidieux, et si tu changes le message, il faut retrouver chaque copie. Mieux vaut écrire l'action **une seule fois**, dans la classe, sous forme de **méthode**. Tu connais déjà les méthodes : une **recette** avec un nom. La nouveauté, c'est que celle-ci est rangée dans le plan `Chien`, et qu'elle travaille sur **le chien sur lequel on l'appelle**. Elle n'a pas de `static` devant : on expliquera ce mot à la leçon 7.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux recettes dans le plan, appelées sur des chiens précis.",
      code: `class Chien {
    String nom;
    int age;

    void aboyer() {
        System.out.println(nom + " dit : Ouaf !");
    }

    void vieillir() {
        age = age + 1;
    }
}

Chien rex = new Chien();
rex.nom = "Rex";
rex.age = 3;
Chien mila = new Chien();
mila.nom = "Mila";
mila.age = 5;

rex.aboyer();      // Rex dit : Ouaf !
rex.vieillir();    // l'âge de rex passe à 4
mila.vieillir();   // l'âge de mila passe à 6`,
    },
    {
      kind: "text",
      text: "Dans `aboyer`, le mot `nom` veut dire « le nom de **ce chien-ci** », celui sur lequel on a écrit `rex.aboyer()`. Java a un mot pour dire « cet objet-ci » : **`this`**. Dans la méthode, `this.nom` et `nom` désignent la même chose. Quand on appelle `rex.vieillir()`, `this` est `rex` ; quand on appelle `mila.vieillir()`, `this` est `mila`. La recette est la même, l'objet change.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Qui est `this` à chaque appel ?",
      code: `Appel             this    Ce que la recette fait
rex.aboyer()      rex     lit le nom de rex : "Rex"
rex.vieillir()    rex     age de rex : 3 -> 4
mila.vieillir()   mila    age de mila : 5 -> 6   (rex ne bouge pas)`,
    },
    {
      kind: "text",
      text: "Une méthode d'objet fonctionne comme celles que tu connais : elle peut avoir des paramètres et renvoyer une valeur avec `return`. La seule différence est qu'elle a, en plus, accès aux champs de l'objet. Par exemple, une méthode `ageEnMois()` qui renvoie `age * 12` donne 36 pour `rex` et 60 pour `mila`, parce qu'elle lit **l'âge de l'objet** sur lequel on l'appelle.",
    },
    {
      kind: "comparison",
      title: "Champ ou méthode ?",
      left: {
        label: "Un champ",
        text: "Une information que l'objet garde. On l'écrit sans parenthèses.",
        code: { language: "java", code: "rex.age" },
      },
      right: {
        label: "Une méthode d'objet",
        text: "Une recette que l'objet sait faire. On l'écrit avec des parenthèses.",
        code: { language: "java", code: "rex.vieillir()" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : appeler sur le plan",
      text: "Une méthode d'objet s'appelle **sur un objet** : `rex.vieillir()`. Écrire `Chien.vieillir()`, avec le nom du plan, ne marche pas : quel chien vieillirait ? Et n'oublie pas les parenthèses : `rex.vieillir;` ne compile pas.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 4 — Le constructeur : remplir l'objet dès sa création
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "bases-obj-l4",
  title: "Le constructeur : remplir l'objet dès sa création",
  blocks: [
    {
      kind: "text",
      text: "Jusqu'ici, après `new Chien()`, on remplit les champs ligne par ligne. Avec dix champs, c'est long, et on peut en oublier un. Un chien sans âge, ça compile très bien : il aura simplement `0` an, sans que personne l'ait voulu.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Facile d'oublier une ligne.",
      code: `Chien rex = new Chien();
rex.nom = "Rex";
// on a oublié rex.age : il a 0 an, et Java ne dit rien`,
    },
    {
      kind: "text",
      text: "Le **constructeur** est une méthode spéciale qui s'exécute toute seule au moment du `new`, pour remplir l'objet tout de suite. Elle a deux particularités : elle porte **exactement le nom de la classe**, et elle n'a **pas de type de retour** (pas même `void`). Ses paramètres reçoivent les valeurs écrites entre les parenthèses du `new`. Voici une première tentative, avec un piège.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ça compile, mais le champ n'est jamais rempli.",
      code: `class Chien {
    String nom;
    int age;

    Chien(String nom, int age) {
        nom = nom;       // piège
        age = age;       // piège
    }
}

Chien rex = new Chien("Rex", 3);
System.out.println(rex.age);   // 0 : l'âge n'a pas été rempli !`,
    },
    {
      kind: "text",
      text: "Dans le constructeur, il y a **deux** `age` : le **champ** de l'objet, et le **paramètre**, la valeur reçue entre parenthèses. Quand les deux portent le même nom, Java choisit le plus proche : le paramètre. Donc `age = age` recopie le paramètre dans lui-même, et le champ n'est jamais touché. Pour viser le champ, on écrit `this.age` : « l'âge de cet objet-ci ».",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le constructeur correct : `this.` devant le champ.",
      code: `class Chien {
    String nom;
    int age;

    Chien(String nom, int age) {
        this.nom = nom;      // le champ de CET objet = le paramètre reçu
        this.age = age;
    }

    // aboyer() et vieillir() sont toujours là, comme avant
}

Chien rex = new Chien("Rex", 3);
Chien mila = new Chien("Mila", 5);
System.out.println(rex.age);   // 3`,
    },
    {
      kind: "text",
      text: "Dans `this.nom = nom`, lis toujours : à **gauche** le champ, à **droite** le paramètre. Chaque `new` lance le constructeur : `rex` est rempli avec `\"Rex\"` et `3`, `mila` avec `\"Mila\"` et `5`. Plus d'oubli possible : si tu ne donnes pas les bonnes valeurs au `new`, Java refuse de compiler.",
    },
    {
      kind: "comparison",
      title: "Quel `nom` est quoi ?",
      left: {
        label: "nom = nom;",
        text: "Le paramètre est copié dans lui-même. Le champ de l'objet reste vide.",
        code: { language: "java", code: "nom = nom;" },
      },
      right: {
        label: "this.nom = nom;",
        text: "Le paramètre reçu est rangé dans le champ de cet objet. C'est ce qu'on veut.",
        code: { language: "java", code: "this.nom = nom;" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : le new sans rien",
      text: "Dès que ta classe a un constructeur avec des paramètres, `new Chien()` sans valeurs ne compile plus. Il faut donner ce que le plan demande : `new Chien(\"Rex\", 3)`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 5 — Une variable d'objet contient une flèche
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "bases-obj-l5",
  title: "Une variable d'objet contient une flèche",
  blocks: [
    {
      kind: "text",
      text: "Voici l'idée qui trompe presque tout le monde. Pour un nombre, tout est simple : `int age = 3;` est une case qui contient 3. Pour un objet, ce n'est pas pareil. Regarde ce code et demande-toi ce que vaut `a.age` à la fin.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Que vaut a.age ?",
      code: `Chien a = new Chien("Rex", 3);
Chien b = a;
b.age = 10;
System.out.println(a.age);`,
    },
    {
      kind: "text",
      text: "Beaucoup répondent 3, en pensant que `Chien b = a;` fait une copie du chien. La bonne réponse est **10**. Un objet est une grosse chose qui vit à part, c'est la maison. Une variable de type `Chien` ne contient **pas** le chien : elle contient une **flèche** qui mène à lui (on dit aussi une **référence**). `int age` est une case avec un nombre dedans ; `Chien a` est une case avec une flèche dedans.",
    },
    {
      kind: "text",
      text: "Alors que fait `Chien b = a;` ? Elle copie **la flèche**, pas le chien. `a` et `b` sont deux flèches qui mènent à **la même** maison. Entrer par `b` ou entrer par `a`, c'est entrer dans la même maison : si `b.age = 10` repeint un mur, `a.age` voit le mur repeint.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ligne par ligne : combien de chiens, et quelles flèches ?",
      code: `Chien a = new Chien("Rex", 3);   a --> [ Rex, 3 ]
Chien b = a;                     a --> [ Rex, 3 ] <-- b
b.age = 10;                      a --> [ Rex, 10 ] <-- b`,
    },
    {
      kind: "text",
      text: "Un seul `new`, donc un seul chien. Pour en avoir deux, il faut deux `new`. On peut aussi **déplacer une flèche** sans toucher à l'autre : `b = new Chien(\"Mila\", 5);` fait pointer `b` vers un nouveau chien, et `a` mène toujours à Rex.",
    },
    {
      kind: "code",
      language: "java",
      caption: "b change de flèche, a ne bouge pas.",
      code: `Chien a = new Chien("Rex", 3);
Chien b = a;                    // deux flèches, un seul chien
b = new Chien("Mila", 5);       // b va vers un deuxième chien
b.age = 9;                      // ne touche que Mila
System.out.println(a.age);      // 3`,
    },
    {
      kind: "comparison",
      title: "Copier la flèche ou construire ?",
      left: {
        label: "Chien b = a;",
        text: "Copie la flèche. **Un seul** chien, avec deux flèches qui y mènent.",
        code: { language: "java", code: "Chien b = a;" },
      },
      right: {
        label: "Chien b = new Chien(...);",
        text: "Construit un nouveau chien. **Deux** chiens, chacun sa flèche.",
        code: { language: "java", code: 'Chien b = new Chien("Rex", 3);' },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : le = ne copie pas l'objet",
      text: "Avec un `int`, `y = x;` fait une vraie copie du nombre. Avec un objet, `b = a;` ne copie que la flèche. Pour avoir un autre chien, il faut un autre `new`.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 6 — null : une flèche qui ne mène nulle part
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "bases-obj-l6",
  title: "null : une flèche qui ne mène nulle part",
  blocks: [
    {
      kind: "text",
      text: "Une variable de type `Chien` contient une flèche. Mais que faire quand on n'a pas encore de chien à désigner ? Par exemple, le chien qu'on n'a pas encore retrouvé. Il faut que la flèche puisse ne mener nulle part.",
    },
    {
      kind: "text",
      text: "Cette flèche vide s'écrit **`null`**. `Chien c = null;` veut dire : « `c` est prête à désigner un chien, mais pour l'instant elle n'en désigne aucun ». Il n'y a aucune maison au bout. Tu peux tester ça : `c == null` vaut `true` quand la flèche est vide.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une flèche vide, puis une flèche qui mène à un chien.",
      code: `Chien c = null;
System.out.println(c == null);   // true : la flèche est vide

c = new Chien("Rex", 3);
System.out.println(c == null);   // false : elle mène à Rex`,
    },
    {
      kind: "text",
      text: "Le danger, c'est d'utiliser un chien qui n'existe pas. Avec `c.aboyer()`, Java suit la flèche pour entrer dans la maison... et il n'y en a pas. Le programme **plante**, c'est-à-dire qu'il s'arrête net avec une erreur au nom célèbre : **`NullPointerException`**. Ce que tu as écrit après la ligne qui plante ne s'exécute jamais.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Suivre une flèche vide fait planter le programme.",
      code: `Chien c = null;
System.out.println("avant");
c.aboyer();                    // plante : NullPointerException
System.out.println("après");   // jamais affiché`,
    },
    {
      kind: "text",
      text: "La parade est simple : **vérifier avant de suivre la flèche**. `if (c != null)` se lit « si `c` n'est pas vide ». On n'entre dans la maison que s'il y en a une. Et pour que la flèche mène quelque part, on lui donne un chien avec `new`, ou on copie la flèche d'une autre variable.",
    },
    {
      kind: "code",
      language: "java",
      caption: "On vérifie, puis on suit la flèche.",
      code: `Chien c = null;
if (c != null) {
    c.aboyer();                     // seulement si c mène à un chien
} else {
    System.out.println("Pas de chien ici.");
}`,
    },
    {
      kind: "comparison",
      title: "Case ou flèche ?",
      left: {
        label: "int age",
        text: "Une case qui contient un nombre. Elle ne peut **jamais** valoir `null`.",
        code: { language: "java", code: "int age = 0;" },
      },
      right: {
        label: "Chien c",
        text: "Une case qui contient une flèche. Elle **peut** valoir `null` : aucun chien au bout.",
        code: { language: "java", code: "Chien c = null;" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : les champs non remplis",
      text: "Un champ qui contient un objet, comme `String nom`, vaut `null` tant qu'on ne le remplit pas. Si tu l'utilises sans vérifier, tu risques la `NullPointerException`. Retiens la règle : **suivre une flèche vide fait toujours planter**.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 7 — static : ce qui appartient au plan
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "bases-obj-l7",
  title: "static : ce qui appartient au plan",
  blocks: [
    {
      kind: "text",
      text: "On veut compter combien de chiens ont été construits. Première idée : un champ `nombreDeChiens` dans la classe, augmenté de 1 à chaque construction. Mais rappelle-toi : chaque objet a **ses propres** valeurs. Voyons ce que ça donne.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un champ normal : chaque chien a son compteur à lui.",
      code: `class Chien {
    String nom;
    int age;
    int nombreDeChiens = 0;      // champ d'objet : chaque chien a le sien

    Chien(String nom, int age) {
        this.nom = nom;
        this.age = age;
        nombreDeChiens++;        // ajoute 1 au compteur DE CE CHIEN
    }
}

Chien rex = new Chien("Rex", 3);
Chien mila = new Chien("Mila", 5);
System.out.println(mila.nombreDeChiens);   // 1 : pas 2 !`,
    },
    {
      kind: "text",
      text: "Chaque chien reçoit son compteur, qui part de 0 et passe à 1 dans **son** constructeur. Or le nombre total de chiens n'est pas une caractéristique d'un chien : c'est une information sur **le plan**, partagée par tous. Pour ça, Java a le mot **`static`**. Un champ `static` n'existe qu'**en un seul exemplaire**, attaché au plan (la classe) et pas à chaque maison.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un seul compteur, pour tous les chiens.",
      code: `class Chien {
    String nom;
    int age;
    static int nombreDeChiens = 0;    // un seul exemplaire, au niveau du plan

    Chien(String nom, int age) {
        this.nom = nom;
        this.age = age;
        nombreDeChiens++;
    }

    static int combien() {            // une méthode attachée au plan
        return nombreDeChiens;
    }
}

Chien rex = new Chien("Rex", 3);
Chien mila = new Chien("Mila", 5);
System.out.println(Chien.nombreDeChiens);   // 2
System.out.println(Chien.combien());        // 2`,
    },
    {
      kind: "text",
      text: "Pour lire un champ `static`, on passe par **le nom du plan** : `Chien.nombreDeChiens`, et non par un chien. Même chose pour une méthode `static` : `Chien.combien()`. Voilà pourquoi tes premières méthodes avaient `static` : elles n'étaient attachées à aucun objet. Une méthode `static` ne peut pas lire `nom` ou `age` : il n'y a pas de chien précis, donc pas de nom précis.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le compteur partagé, construction après construction.",
      code: `new Chien("Rex", 3)    ->  nombreDeChiens = 1
new Chien("Mila", 5)   ->  nombreDeChiens = 2   (le même compteur)`,
    },
    {
      kind: "text",
      text: "Un exemple du quotidien : dans un lotissement, le nombre de maisons construites n'est écrit sur aucune maison. Il est écrit sur le panneau, à l'entrée du lotissement. Chaque maison a sa propre couleur de volets, mais il n'y a **qu'un seul panneau** pour tout le monde. Le champ `static` est ce panneau, accroché au plan.",
    },
    {
      kind: "comparison",
      title: "Champ d'objet ou champ static ?",
      left: {
        label: "Sans static",
        text: "Un exemplaire **par objet**. Chaque chien a son nom, son âge. On le lit avec un chien : `rex.nom`.",
        code: { language: "java", code: "String nom;" },
      },
      right: {
        label: "Avec static",
        text: "Un seul exemplaire **pour toute la classe**, partagé par tous les chiens. On le lit avec le nom du plan.",
        code: { language: "java", code: "static int nombreDeChiens;" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : tout le monde le modifie",
      text: "Un champ `static` est partagé : si un chien le change, tous les autres voient le changement. Réserve-le à ce qui concerne vraiment **toute la classe**, comme un compteur. Les caractéristiques d'un chien (nom, âge) restent des champs normaux.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 8 — private et les accesseurs
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "bases-obj-l8",
  title: "private et les accesseurs : protéger les champs",
  blocks: [
    {
      kind: "text",
      text: "Pour l'instant, n'importe quelle ligne du programme peut écrire `rex.age = -5;`. Java l'accepte sans broncher, alors qu'un chien de moins cinq ans n'a aucun sens. Dans un gros programme, des dizaines de lignes touchent aux champs : impossible de vérifier que chacune se comporte bien.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Rien n'empêche cette valeur absurde.",
      code: `Chien rex = new Chien("Rex", 3);
rex.age = -5;                       // Java accepte
System.out.println(rex.age);        // -5`,
    },
    {
      kind: "text",
      text: "La solution est de fermer la porte. Le mot **`private`** devant un champ veut dire : « seule la classe `Chien` peut y toucher ». Pour que l'extérieur puisse quand même lire ou modifier l'âge, la classe offre des méthodes marquées **`public`** (« ouvertes à tout le monde »). On les appelle des **accesseurs** : le **getter** (`getAge`) lit la valeur, le **setter** (`setAge`) la modifie.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Champs fermés, accesseurs ouverts, et un gardien dans le setter.",
      code: `class Chien {
    private String nom;
    private int age;

    public Chien(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }

    public int getAge() {
        return age;                  // le getter lit
    }

    public void setAge(int age) {
        if (age >= 0) {              // le setter vérifie avant d'accepter
            this.age = age;
        }
    }
}

Chien rex = new Chien("Rex", 3);
rex.setAge(-5);                      // refusé : l'âge reste 3
rex.setAge(4);                       // accepté
System.out.println(rex.getAge());    // 4`,
    },
    {
      kind: "text",
      text: "Le setter est un **gardien** : avant de changer le champ, il vérifie. Avec `setAge(-5)`, la condition `age >= 0` est fausse, donc on ne fait rien et l'âge reste 3. Avec `setAge(4)`, elle est vraie, donc le champ passe à 4. Le getter, lui, ne fait que renvoyer la valeur. Par habitude, on les nomme `get` ou `set` suivi du nom du champ avec une majuscule.",
    },
    {
      kind: "code",
      language: "java",
      caption: "De l'extérieur, le champ privé est inaccessible.",
      code: `Chien rex = new Chien("Rex", 3);
rex.age = 7;                         // ne compile plus : age est private
rex.setAge(7);                       // correct : on passe par le gardien`,
    },
    {
      kind: "text",
      text: "On peut même choisir de ne **pas** écrire de setter. Alors personne ne peut changer le champ après la construction : il est en lecture seule. Le nom d'un chien, par exemple, ne devrait pas changer. On garde un getter `getNom()` pour le lire, mais on n'écrit pas de `setNom`. C'est la classe qui décide de ce qu'elle laisse faire.",
    },
    {
      kind: "comparison",
      title: "private ou public ?",
      left: {
        label: "private",
        text: "Réservé à la classe elle-même. L'extérieur ne peut ni lire ni modifier directement.",
        code: { language: "java", code: "private int age;" },
      },
      right: {
        label: "public",
        text: "Ouvert à tout le monde. Idéal pour les méthodes que les autres ont le droit d'appeler.",
        code: { language: "java", code: "public void setAge(int age)" },
      },
    },
    {
      kind: "callout",
      tone: "tip",
      title: "À retenir",
      text: "Par défaut, mets tes champs en `private` et ouvre seulement ce qui est utile avec `public`. Ainsi, c'est la classe qui garde le contrôle de ses données.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Leçon 9 — Comparer deux objets : == compare les flèches
// ---------------------------------------------------------------------------

const l9: Lesson = {
  kind: "lesson",
  id: "bases-obj-l9",
  title: "Comparer deux objets : == compare les flèches",
  blocks: [
    {
      kind: "text",
      text: "Dernière question, pour ne pas tomber dans un piège classique. Deux chiens ont le même nom et le même âge : sont-ils « égaux » ? Regarde ce que répond `==`, l'opérateur que tu utilises déjà pour comparer des nombres.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Mêmes valeurs, mais pas le même chien.",
      code: `Chien a = new Chien("Rex", 3);
Chien b = new Chien("Rex", 3);
Chien c = a;

System.out.println(a == b);   // false
System.out.println(a == c);   // true`,
    },
    {
      kind: "text",
      text: "L'opérateur `==` ne regarde pas dans les maisons. Il se demande : « ces deux flèches mènent-elles à **la même** maison ? ». Pour `a` et `b`, il y a eu deux `new`, donc deux maisons, même si elles se ressemblent comme deux gouttes d'eau : `false`. Pour `a` et `c`, la flèche de `a` a été copiée dans `c` : même maison, `true`.",
    },
    {
      kind: "text",
      text: "C'est aussi ce que tu faisais avec `c == null` : on compare une flèche à la flèche vide. Sur des **nombres**, en revanche, `==` compare bien les valeurs, parce qu'un `int` est une case qui contient directement le nombre. Pour savoir si deux chiens ont les mêmes informations, il existe une autre méthode, `equals`, que tu verras plus tard. Ici, retiens seulement ce que fait `==`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux nombres se comparent par valeur, deux objets par flèche.",
      code: `Chien a = new Chien("Rex", 3);
Chien b = new Chien("Rex", 3);

System.out.println(a.age == b.age);   // true : on compare deux nombres
System.out.println(a == b);           // false : on compare deux flèches`,
    },
    {
      kind: "text",
      text: "Cette question est parfois exactement celle qu'on se pose : « est-ce le même chien que tout à l'heure ? ». Mais souvent on voudrait demander « est-ce un chien pareil ? », et là `==` répond non. Beaucoup de bugs viennent de là : on croit comparer le contenu, on compare les flèches. Garde ce réflexe : devant un `==` entre deux objets, lis « même maison ? ».",
    },
    {
      kind: "comparison",
      title: "Que compare ==",
      left: {
        label: "Deux nombres",
        text: "Il compare les **valeurs** : 3 et 3, c'est pareil.",
        code: { language: "java", code: "a.age == b.age" },
      },
      right: {
        label: "Deux objets",
        text: "Il compare les **flèches** : mènent-elles à la même maison ?",
        code: { language: "java", code: "a == b" },
      },
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : se ressembler ne suffit pas",
      text: "Deux objets construits chacun avec leur `new` ne sont **jamais** `==`, même avec exactement les mêmes valeurs. `==` ne répond `true` que si les deux flèches mènent au même objet (ou si les deux sont `null`).",
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
    id: "bases-obj-01",
    difficulty: 1,
    tags: ["classes", "objets"],
    prompt: "Dans notre image du plan et de la maison, la classe `Chien` correspond à quoi ?",
    choices: [
      "Un chien précis, comme Rex",
      "Le plan qui décrit un chien",
      "Une maison déjà construite",
      "Une variable qui contient un nom",
    ],
    answer: 1,
    simple:
      "Une classe, c'est un plan : un papier qui explique comment est fait un chien. Ce n'est pas un chien. Un chien précis, comme Rex, serait une maison construite avec ce plan.",
    explanation:
      "La classe `Chien` décrit ce que contiendra un chien (un nom, un âge) et ce qu'il saura faire. Elle ne crée aucun chien par elle-même : les chiens sont les objets, construits plus tard à partir de ce plan.",
  },
  {
    kind: "match",
    id: "bases-obj-02",
    difficulty: 1,
    tags: ["classes", "objets"],
    prompt: "Associe chaque élément à son image : le plan ou la maison.",
    pairs: [
      { left: "La classe `Chien`", right: "Le plan" },
      { left: "Rex, un chien précis", right: "Une maison construite" },
      { left: "Rex, Mila et Nala", right: "Trois maisons du même plan" },
      { left: "Écrire `class Chien { ... }`", right: "Dessiner le plan, sans rien construire" },
    ],
    simple:
      "Le plan décrit, la maison existe. La classe `Chien` est le plan. Chaque chien précis est une maison, et avec un plan on peut en construire autant qu'on veut. Écrire la classe, c'est seulement dessiner le plan : personne n'habite encore nulle part.",
    explanation:
      "Une classe est un modèle ; un objet est une réalisation de ce modèle. Plusieurs objets peuvent naître d'une même classe, et déclarer la classe ne construit aucun objet.",
  },
  {
    kind: "recall",
    id: "bases-obj-03",
    difficulty: 1,
    tags: ["classes", "objets"],
    prompt: "Avec tes mots : quelle est la différence entre une classe et un objet ? Prends l'image du plan et de la maison.",
    simple:
      "La classe est le plan : elle décrit comment est fait un chien (un nom, un âge, ce qu'il sait faire). Un objet est une maison construite avec ce plan : un vrai chien, comme Rex. Avec un seul plan, on peut construire plein de chiens différents.",
    explanation:
      "Une **classe** est un modèle qui regroupe des champs (les informations) et des méthodes (les actions). Un **objet** est un exemplaire concret construit à partir de cette classe, avec ses propres valeurs. On écrit la classe une fois et on peut créer autant d'objets qu'on veut ; écrire la classe ne crée aucun objet.",
    keyPoints: [
      "Classe = le plan, elle décrit",
      "Objet = la maison construite avec ce plan",
      "Un plan, autant d'objets qu'on veut",
      "Écrire la classe ne crée aucun objet",
    ],
  },

  // ----- Leçon 2 -----
  {
    kind: "fill",
    id: "bases-obj-04",
    difficulty: 1,
    tags: ["champs", "new"],
    prompt: "Complète pour construire un chien, puis lui donner un nom.",
    code: {
      language: "java",
      code: `Chien rex = {{1}} Chien();
rex.{{2}} = "Rex";
rex.age = 3;`,
    },
    blanks: ["new", "nom"],
    distractors: ["make", "create", "Chien"],
    simple:
      "Pour construire un chien, on écrit `new` devant le nom du plan : `new Chien()`. Ensuite le point sert à entrer dans le chien : `rex.nom` veut dire « le nom de rex ». `make` et `create` n'existent pas en Java.",
    explanation:
      "`new Chien()` construit un objet à partir de la classe. Le point accède à un champ de cet objet : `rex.nom` est le champ `nom` de `rex`. Les mots `make` et `create` ne sont pas des mots-clés Java.",
  },
  {
    kind: "order",
    id: "bases-obj-05",
    difficulty: 1,
    tags: ["champs", "new"],
    prompt: "Remets ces lignes dans l'ordre pour afficher le nom de Rex.",
    language: "java",
    items: [
      "class Chien { String nom; }",
      "Chien rex = new Chien();",
      'rex.nom = "Rex";',
      "System.out.println(rex.nom);",
    ],
    simple:
      "Comme pour une maison : on a d'abord le plan, puis on construit, puis on peint les murs, et seulement après on admire le résultat. Ici : la classe, puis `new`, puis on donne le nom, puis on l'affiche. Sans plan ni chien construit, on ne peut pas remplir un nom.",
    explanation:
      "La classe doit exister avant d'être utilisée ; `new` doit construire l'objet avant qu'on atteigne ses champs ; le nom doit être rempli avant d'être affiché.",
  },
  {
    kind: "output",
    id: "bases-obj-06",
    difficulty: 1,
    tags: ["champs", "objets"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;
}

Chien a = new Chien();
a.age = 3;
Chien b = new Chien();
System.out.println(a.age + " " + b.age);`,
    },
    choices: ["`3 3`", "`0 0`", "`3 0`", "`0 3`"],
    answer: 2,
    simple:
      "Il y a deux chiens, chacun avec ses propres valeurs. Le chien `a` a reçu l'âge 3. Le chien `b` n'a rien reçu : son âge reste à la valeur de départ des nombres, 0. On affiche donc `3 0`.",
    explanation:
      "`a` et `b` sont deux objets distincts, chacun avec son champ `age`. `a.age` vaut 3 ; `b.age` n'a jamais été rempli et garde la valeur par défaut d'un `int`, soit 0.",
  },

  // ----- Leçon 3 -----
  {
    kind: "mcq",
    id: "bases-obj-07",
    difficulty: 1,
    tags: ["this", "methodes-objet"],
    prompt: "Dans une méthode de la classe `Chien`, que veut dire `this` ?",
    choices: [
      "Le premier chien créé dans le programme",
      "Le plan `Chien`, pas un chien précis",
      "Le chien sur lequel la méthode est appelée",
      "Le dernier chien créé dans le programme",
    ],
    answer: 2,
    simple:
      "`this` veut dire « cet objet-ci ». Quand tu écris `rex.vieillir()`, la recette tourne pour rex : dedans, `this` est rex. Quand tu écris `mila.vieillir()`, `this` est mila. Ce n'est ni le premier, ni le dernier chien, mais celui qu'on est en train d'utiliser.",
    explanation:
      "`this` désigne l'objet courant, celui sur lequel la méthode a été appelée. Il change à chaque appel selon l'objet placé devant le point.",
  },
  {
    kind: "fill",
    id: "bases-obj-08",
    difficulty: 1,
    tags: ["methodes-objet", "champs"],
    prompt: "Complète la recette `aboyer` et son appel.",
    code: {
      language: "java",
      code: `class Chien {
    String nom;

    {{1}} aboyer() {
        System.out.println({{2}} + " dit : Ouaf !");
    }
}

Chien rex = new Chien();
rex.nom = "Rex";
rex.{{3}}();`,
    },
    blanks: ["void", "nom", "aboyer"],
    distractors: ["int", "Chien", "new"],
    simple:
      "La recette `aboyer` n'envoie aucun résultat, elle affiche seulement un message : on écrit `void` devant. Dedans, `nom` veut dire « le nom de ce chien-ci ». Pour la lancer, on la nomme après un chien et un point : `rex.aboyer()`.",
    explanation:
      "Une méthode qui ne renvoie rien a le type de retour `void`. Dans une méthode d'objet, un champ comme `nom` désigne le champ de l'objet courant. L'appel se fait sur un objet : `rex.aboyer()`.",
  },
  {
    kind: "output",
    id: "bases-obj-09",
    difficulty: 2,
    tags: ["methodes-objet", "this"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    int age;

    void vieillir() {
        age = age + 1;
    }
}

Chien a = new Chien();
a.age = 3;
Chien b = new Chien();
b.age = 10;
a.vieillir();
a.vieillir();
System.out.println(a.age + " " + b.age);`,
    },
    choices: ["`5 12`", "`3 10`", "`12 12`", "`5 10`"],
    answer: 3,
    simple:
      "`vieillir` ajoute 1 à l'âge du chien sur lequel on l'appelle. On l'appelle deux fois sur `a` : son âge passe de 3 à 4, puis à 5. On ne l'appelle jamais sur `b`, qui reste à 10. Donc `5 10`.",
    explanation:
      "Dans `a.vieillir()`, `this` est `a` : seul le champ `age` de `a` change (3, puis 4, puis 5). `b` est un autre objet avec son propre `age`, resté à 10.",
  },

  // ----- Leçon 4 -----
  {
    kind: "output",
    id: "bases-obj-10",
    difficulty: 1,
    tags: ["constructeur", "objets"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;

    Chien(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
}

Chien rex = new Chien("Rex", 3);
Chien mila = new Chien("Mila", 5);
System.out.println(rex.nom + " " + mila.age);`,
    },
    choices: ["`Rex 3`", "`Mila 3`", "`Mila 5`", "`Rex 5`"],
    answer: 3,
    simple:
      "Chaque `new` lance le constructeur, qui remplit le nouveau chien. `rex` reçoit \"Rex\" et 3, `mila` reçoit \"Mila\" et 5. On affiche le nom de rex (`Rex`) puis l'âge de mila (`5`).",
    explanation:
      "Chaque `new` exécute le constructeur sur un nouvel objet : `rex` a `nom = \"Rex\"` et `age = 3`, `mila` a `nom = \"Mila\"` et `age = 5`. L'expression affiche `rex.nom`, puis un espace, puis `mila.age`.",
  },
  {
    kind: "fill",
    id: "bases-obj-11",
    difficulty: 2,
    tags: ["constructeur", "this"],
    prompt: "Complète le constructeur et la construction du chien.",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;

    {{1}}(String nom, int age) {
        {{2}}.nom = nom;
        this.age = age;
    }
}

Chien rex = {{3}} Chien("Rex", 3);`,
    },
    blanks: ["Chien", "this", "new"],
    distractors: ["void", "super", "create"],
    simple:
      "Le constructeur porte le même nom que la classe : `Chien`, sans `void` devant. Dedans, `this.nom` veut dire « le champ nom de cet objet-ci », ce qui le distingue du paramètre `nom`. Et pour construire un chien, on écrit `new` devant `Chien(...)`.",
    explanation:
      "Le constructeur a exactement le nom de la classe et aucun type de retour. `this.nom` désigne le champ, `nom` seul le paramètre. `new Chien(\"Rex\", 3)` construit l'objet et exécute le constructeur.",
  },
  {
    kind: "spot",
    id: "bases-obj-12",
    difficulty: 2,
    tags: ["constructeur", "this"],
    prompt: "On voudrait que `rex.age` vaille 3, mais ça affiche 0. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `class Chien {
    int age;

    Chien(int age) {
        age = age;
    }
}

Chien rex = new Chien(3);
System.out.println(rex.age);`,
    },
    faultyLine: 5,
    reasons: [
      "Il manque le mot `void` devant le constructeur `Chien(int age)`.",
      "Les deux `age` désignent le paramètre : le champ n'est jamais rempli. Il faut écrire `this.age = age;`.",
      "Un paramètre ne peut pas avoir le même nom qu'un champ de la classe.",
      "Il faut comparer avec `age == age` pour remplir le champ.",
    ],
    reasonAnswer: 1,
    simple:
      "Dans le constructeur, il y a deux `age` : le champ du chien et la valeur reçue. Quand ils ont le même nom, Java prend la valeur reçue, la plus proche. `age = age` recopie donc la valeur dans elle-même, et le champ reste à 0. Avec `this.age = age`, on vise bien le champ du chien.",
    explanation:
      "Un paramètre masque le champ de même nom. `age = age;` affecte le paramètre à lui-même, le champ garde sa valeur par défaut (0). `this.age = age;` est la forme correcte. Rien n'interdit de réutiliser le même nom, et un constructeur n'a pas de type de retour.",
  },

  // ----- Leçon 5 -----
  {
    kind: "mcq",
    id: "bases-obj-13",
    difficulty: 1,
    tags: ["fleche", "references"],
    prompt: "Que contient la variable `rex` après `Chien rex = new Chien(\"Rex\", 3);` ?",
    choices: [
      "Le chien en entier, nom et âge compris",
      "Seulement le nom du chien",
      "Une copie du plan `Chien`",
      "Une flèche qui mène au chien",
    ],
    answer: 3,
    simple:
      "Le chien lui-même est une grosse chose, il vit à part (c'est la maison). La variable `rex` ne le contient pas : elle contient une flèche qui mène jusqu'à lui. C'est toute la différence avec un `int`, où la case contient directement le nombre.",
    explanation:
      "Une variable dont le type est une classe contient une référence vers l'objet, pas l'objet lui-même. C'est pourquoi deux variables peuvent désigner le même objet.",
  },
  {
    kind: "output",
    id: "bases-obj-14",
    difficulty: 1,
    tags: ["fleche", "references"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;

    Chien(String nom, int age) { this.nom = nom; this.age = age; }
}

Chien x = new Chien("Mila", 5);
Chien y = x;
y.age = 6;
System.out.println(x.age + " " + y.age);`,
    },
    choices: ["`6 5`", "`5 6`", "`5 5`", "`6 6`"],
    answer: 3,
    simple:
      "Il n'y a qu'un seul `new`, donc un seul chien. `y = x` ne fait que copier la flèche : `x` et `y` mènent à la même maison. Quand on met l'âge 6 par `y`, on le met dans la maison, et `x` le voit aussi. On affiche donc `6 6`.",
    explanation:
      "`Chien y = x;` copie la référence, pas l'objet. `x` et `y` désignent le même `Chien`, donc `y.age = 6` modifie l'objet vu par les deux variables : `6 6`.",
  },
  {
    kind: "output",
    id: "bases-obj-15",
    difficulty: 2,
    tags: ["fleche", "references"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;

    Chien(String nom, int age) { this.nom = nom; this.age = age; }
}

Chien a = new Chien("Rex", 3);
Chien b = a;
b = new Chien("Mila", 5);
b.age = 9;
System.out.println(a.age + " " + b.age);`,
    },
    choices: ["`9 9`", "`3 9`", "`5 9`", "`3 5`"],
    answer: 1,
    simple:
      "Suis les flèches. D'abord `b = a` : les deux mènent à Rex. Puis `b = new Chien(...)` : `b` quitte Rex pour aller vers un nouveau chien, Mila. `a` n'a pas bougé, il mène toujours à Rex (âge 3). Ensuite `b.age = 9` ne change que Mila. Résultat : `3 9`.",
    explanation:
      "`b = new Chien(\"Mila\", 5)` fait pointer `b` vers un nouvel objet sans toucher à `a`, qui désigne toujours Rex (`age` = 3). `b.age = 9` modifie Mila seulement.",
  },
  {
    kind: "recall",
    id: "bases-obj-16",
    difficulty: 2,
    tags: ["fleche", "references"],
    prompt: "`Chien b = a;` ne copie pas le chien. Explique avec l'image de la flèche ce qui se passe, et comment obtenir un vrai deuxième chien.",
    simple:
      "La variable `a` contient une flèche vers le chien. `Chien b = a;` copie cette flèche : `a` et `b` mènent au même chien, il n'y en a toujours qu'un seul. Si on le change en passant par `b`, on le voit en passant par `a`. Pour avoir un deuxième chien, il faut un deuxième `new`.",
    explanation:
      "Une variable d'objet contient une **référence** (une flèche). `b = a` copie la référence : les deux variables désignent le même objet, donc une modification faite via `b` est visible via `a`. Seul un nouveau `new` construit un second objet indépendant.",
    keyPoints: [
      "Une variable d'objet contient une flèche vers l'objet",
      "`b = a` copie la flèche, pas le chien",
      "Un seul chien, deux flèches : modifier par `b`, voir par `a`",
      "Un deuxième chien demande un deuxième `new`",
    ],
  },

  // ----- Leçon 6 -----
  {
    kind: "output",
    id: "bases-obj-17",
    difficulty: 1,
    tags: ["null", "plantage"],
    prompt: "Que se passe-t-il quand on lance ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;

    void aboyer() { System.out.println("Ouaf !"); }
}

Chien c = null;
System.out.println("début");
c.aboyer();
System.out.println("fin");`,
    },
    choices: [
      "`début`, `Ouaf !`, puis `fin`",
      "`début`, puis `fin`",
      "Erreur de compilation : `c` vaut `null`",
      "`début`, puis le programme plante : `NullPointerException`",
    ],
    answer: 3,
    simple:
      "`c` est une flèche qui ne mène nulle part. Le premier message s'affiche, puis Java essaie de suivre la flèche pour faire aboyer le chien... et il n'y a pas de chien. Le programme plante à cette ligne, donc `fin` n'est jamais affiché.",
    explanation:
      "Le code compile : `c` est bien une variable de type `Chien`. À l'exécution, appeler `c.aboyer()` alors que `c` vaut `null` lève une `NullPointerException` : le programme s'arrête et la ligne suivante n'est pas exécutée.",
  },
  {
    kind: "spot",
    id: "bases-obj-18",
    difficulty: 2,
    tags: ["null", "plantage"],
    prompt: "Ce programme plante avec une `NullPointerException`. Trouve la ligne qui plante.",
    code: {
      language: "java",
      code: `class Chien {
    void aboyer() { System.out.println("Ouaf !"); }
}

Chien rex = new Chien();
Chien mila = null;
rex.aboyer();
mila.aboyer();`,
    },
    faultyLine: 8,
    reasons: [
      "`aboyer()` n'a pas été écrite dans la classe `Chien`.",
      "`mila` est une flèche vide (`null`) : il n'y a pas de chien au bout à faire aboyer.",
      "Il manque `new` devant `mila.aboyer()`.",
      "Un seul chien peut aboyer par programme.",
    ],
    reasonAnswer: 1,
    simple:
      "Ligne 7, `rex` mène à un vrai chien : il aboie sans problème. Mais `mila` a été mise à `null`, donc sa flèche ne mène nulle part. À la ligne 8, Java suit cette flèche vide et le programme plante. La ligne 6 qui met `null` ne plante pas : c'est l'usage de la flèche vide qui plante.",
    explanation:
      "`Chien mila = null;` est légal : la variable ne désigne aucun objet. C'est l'appel `mila.aboyer()` qui déclenche la `NullPointerException`, car il faut un objet pour exécuter une méthode d'objet. Correction : construire le chien, ou tester `mila != null` avant l'appel.",
  },
  {
    kind: "recall",
    id: "bases-obj-19",
    difficulty: 2,
    tags: ["null", "plantage"],
    prompt: "C'est quoi `null` ? Que se passe-t-il si on écrit `c.aboyer()` alors que `c` vaut `null`, et comment l'éviter ?",
    simple:
      "`null` est une flèche qui ne mène nulle part : la variable ne désigne aucun chien. Si on essaie quand même de faire aboyer ce chien qui n'existe pas, le programme plante avec une `NullPointerException`. Pour l'éviter, on vérifie avant : `if (c != null)`, et on n'appelle la méthode que s'il y a un chien.",
    explanation:
      "`null` signifie « aucune référence » : la variable ne pointe vers aucun objet. Utiliser un champ ou une méthode à partir d'une référence `null` lève une `NullPointerException` et arrête le programme. On évite le problème en testant `c != null` avant, ou en s'assurant d'avoir construit l'objet avec `new`.",
    keyPoints: [
      "`null` = flèche qui ne mène nulle part",
      "Suivre une flèche vide : `NullPointerException`",
      "Le programme s'arrête à cette ligne",
      "Tester `if (c != null)` avant d'appeler",
    ],
  },

  // ----- Leçon 7 -----
  {
    kind: "match",
    id: "bases-obj-20",
    difficulty: 1,
    tags: ["static", "champs"],
    prompt: "Associe chaque ligne à ce qu'elle veut dire.",
    pairs: [
      { left: "`nom` (un champ normal)", right: "Chaque chien a le sien" },
      { left: "`static int nombreDeChiens`", right: "Un seul, partagé par tous les chiens" },
      { left: "`rex.aboyer()`", right: "Méthode d'objet : appelée sur un chien" },
      { left: "`Chien.combien()`", right: "Méthode `static` : appelée sur le plan" },
    ],
    simple:
      "Ce qui est normal appartient à chaque maison : chaque chien a son nom. Ce qui est `static` appartient au plan : il n'existe qu'une fois, pour tous les chiens, et on y accède avec le nom du plan. Une méthode d'objet se lance sur un chien (`rex.aboyer()`), une méthode `static` se lance sur le plan (`Chien.combien()`).",
    explanation:
      "Un champ ou une méthode sans `static` appartient à chaque objet. Avec `static`, il appartient à la classe : un seul exemplaire, atteint par `NomDeClasse.membre`.",
  },
  {
    kind: "output",
    id: "bases-obj-21",
    difficulty: 2,
    tags: ["static", "compteur"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    static int total = 0;
    int age;

    Chien(int age) {
        this.age = age;
        total++;
    }
}

Chien a = new Chien(3);
Chien b = new Chien(5);
Chien c = new Chien(1);
System.out.println(Chien.total + " " + c.age);`,
    },
    choices: ["`1 1`", "`3 3`", "`3 1`", "`9 1`"],
    answer: 2,
    simple:
      "`total` est `static` : il n'y en a qu'un, pour tout le plan. Chaque `new` ajoute 1 à ce même compteur, donc après trois chiens il vaut 3. `c.age` est un champ normal, propre au chien `c` : 1. On affiche `3 1`. (9 serait la somme des âges, pas le nombre de chiens.)",
    explanation:
      "Le champ `static` `total` n'existe qu'en un exemplaire, incrémenté par chaque constructeur : 3 après trois `new`. `c.age` est le champ d'instance de `c`, soit 1.",
  },
  {
    kind: "mcq",
    id: "bases-obj-22",
    difficulty: 2,
    tags: ["static", "champs"],
    prompt: "Dans la classe `Chien`, lequel de ces champs doit être `static` ?",
    choices: [
      "Le nom de chaque chien",
      "L'âge de chaque chien",
      "Le nombre total de chiens créés",
      "Le poids de chaque chien",
    ],
    answer: 2,
    simple:
      "Le nom, l'âge ou le poids sont propres à chaque chien : chaque maison a les siens, donc des champs normaux. Le nombre total de chiens, lui, ne dépend d'aucun chien en particulier : c'est une information sur tout le plan, qu'il faut garder en un seul exemplaire. C'est donc le seul qui est `static`.",
    explanation:
      "Un champ `static` est partagé par tous les objets de la classe, ce qui convient à une information globale comme un compteur. Les caractéristiques propres à chaque objet (nom, âge, poids) restent des champs d'instance.",
  },

  // ----- Leçon 8 -----
  {
    kind: "spot",
    id: "bases-obj-23",
    difficulty: 2,
    tags: ["private", "accesseurs"],
    prompt: "Ce code ne compile pas. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `class Chien {
    private int age;

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}

Chien rex = new Chien();
rex.age = 7;`,
    },
    faultyLine: 9,
    reasons: [
      "`7` doit être écrit entre guillemets pour être un âge.",
      "Un nombre ne peut pas être modifié après la construction du chien.",
      "`age` est `private` : en dehors de la classe, il faut passer par `setAge`.",
      "Il faut écrire `new` devant `rex.age` pour le modifier.",
    ],
    reasonAnswer: 2,
    simple:
      "Le mot `private` ferme la porte : seule la classe `Chien` peut toucher à `age`. La ligne 9 est écrite à l'extérieur de la classe, donc Java refuse. Pour changer l'âge de l'extérieur, on utilise le gardien prévu par la classe : `rex.setAge(7)`.",
    explanation:
      "Un champ `private` n'est accessible que depuis sa propre classe. Depuis l'extérieur, le compilateur signale « age has private access in Chien ». On passe par les accesseurs publics, ici `setAge(7)`.",
  },
  {
    kind: "fill",
    id: "bases-obj-24",
    difficulty: 2,
    tags: ["private", "accesseurs"],
    prompt: "Complète la classe : un champ fermé et son getter.",
    code: {
      language: "java",
      code: `class Chien {
    {{1}} int age;

    public int {{2}}() {
        {{3}} age;
    }

    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }
}`,
    },
    blanks: ["private", "getAge", "return"],
    distractors: ["static", "void", "set"],
    simple:
      "Pour fermer le champ, on écrit `private` devant. Le getter est la méthode qui lit la valeur : on l'appelle `getAge` (get + le nom du champ) et elle renvoie l'âge avec `return`. Le setter, lui, vérifie que l'âge n'est pas négatif avant de le changer.",
    explanation:
      "`private` limite l'accès au champ à la classe. Le getter `getAge` renvoie la valeur avec `return age;`. Le setter protège le champ en ne l'affectant que si la condition est respectée.",
  },
  {
    kind: "recall",
    id: "bases-obj-25",
    difficulty: 2,
    tags: ["private", "accesseurs"],
    prompt: "Pourquoi met-on les champs en `private` et passe-t-on par un getter et un setter ? Donne un exemple de protection.",
    simple:
      "Un champ `private` est comme une porte fermée : seule la classe peut y toucher. Les autres passent par des méthodes que la classe contrôle. Le setter peut alors vérifier avant d'accepter : par exemple refuser un âge négatif. Ainsi, l'objet ne peut jamais se retrouver avec une valeur absurde.",
    explanation:
      "`private` empêche tout code extérieur de modifier les champs directement. Les accesseurs publics deviennent le seul chemin, et le setter peut valider la valeur (par exemple `age >= 0`) avant de l'accepter. La classe garde ainsi le contrôle de ses données et peut changer sa façon de les stocker sans casser le reste du programme.",
    keyPoints: [
      "`private` : seul le code de la classe touche au champ",
      "Getter : lit la valeur, setter : la modifie",
      "Le setter peut vérifier (ex. âge >= 0)",
      "La classe garde le contrôle de ses données",
    ],
  },

  // ----- Leçon 9 -----
  {
    kind: "mcq",
    id: "bases-obj-26",
    difficulty: 2,
    tags: ["egalite", "fleche"],
    prompt: "`a` et `b` sont construits chacun avec `new Chien(\"Rex\", 3)`. Pourquoi `a == b` vaut-il `false` ?",
    choices: [
      "Parce que `==` ne marche jamais sur des objets",
      "Parce que `==` compare les flèches : ce sont deux chiens différents",
      "Parce que les noms des deux chiens sont différents",
      "Parce que l'âge est un `int` et pas un objet",
    ],
    answer: 1,
    simple:
      "`==` ne regarde pas ce qu'il y a dans les maisons : il demande seulement si les deux flèches mènent à la même maison. Ici il y a eu deux `new`, donc deux maisons, même si elles sont identiques à l'intérieur. La réponse est donc `false`.",
    explanation:
      "Sur des objets, `==` compare les références. Deux `new` produisent deux objets distincts, donc deux références différentes, même avec des valeurs identiques. La comparaison des contenus est un autre sujet (`equals`).",
  },
  {
    kind: "output",
    id: "bases-obj-27",
    difficulty: 3,
    tags: ["egalite", "fleche"],
    prompt: "Qu'affiche ce code ?",
    code: {
      language: "java",
      code: `class Chien {
    String nom;
    int age;

    Chien(String nom, int age) { this.nom = nom; this.age = age; }
}

Chien a = new Chien("Rex", 3);
Chien b = a;
Chien c = new Chien("Rex", 3);
b.age = 4;
System.out.println((a == b) + " " + (a == c) + " " + c.age);`,
    },
    choices: ["`true false 3`", "`true false 4`", "`false false 3`", "`true true 4`"],
    answer: 0,
    simple:
      "Il y a deux chiens : celui de `a` et `b` (une seule maison, deux flèches), et celui de `c`. `a == b` : même maison, `true`. `a == c` : deux maisons différentes, `false`. Et `b.age = 4` change la maison de `a` et `b`, mais pas celle de `c` : son âge reste 3. D'où `true false 3`.",
    explanation:
      "`b = a` partage l'objet : `a == b` est `true`, et `b.age = 4` modifie aussi `a.age`. `c` est un second objet créé par son propre `new` : `a == c` est `false` et `c.age` reste 3.",
  },
  {
    kind: "recall",
    id: "bases-obj-28",
    difficulty: 2,
    tags: ["egalite", "fleche"],
    prompt: "Que compare `==` quand on l'utilise entre deux objets ? Deux chiens construits avec les mêmes valeurs sont-ils `==` ?",
    simple:
      "Entre deux objets, `==` compare les flèches : il demande si elles mènent à la même maison. Deux chiens construits chacun avec leur `new` sont deux maisons différentes, même avec le même nom et le même âge : `==` répond `false`. Il ne répond `true` que si c'est vraiment le même chien.",
    explanation:
      "Entre deux références, `==` teste l'identité : désignent-elles le même objet ? Deux objets construits par deux `new` sont distincts, donc `false`, même avec des champs identiques. Il vaut `true` seulement si les deux variables pointent vers le même objet (ou sont toutes deux `null`). Comparer le contenu demandera `equals`, vu plus tard.",
    keyPoints: [
      "`==` compare les flèches, pas le contenu",
      "Deux `new` = deux objets, donc `false`",
      "`true` seulement si c'est le même objet",
      "Le contenu se compare avec `equals` (plus tard)",
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
  id: "bases-objets",
  format: "doux",
  title: "Classes et objets",
  objective:
    "Savoir définir une classe, créer des objets, et comprendre qu'une variable d'objet contient une flèche vers lui (et ce que null veut dire).",
  prerequisites: ["bases-methodes"],
  units: [
    l1, ...pick("bases-obj-01", "bases-obj-02", "bases-obj-03"),
    l2, ...pick("bases-obj-04", "bases-obj-05", "bases-obj-06"),
    l3, ...pick("bases-obj-07", "bases-obj-08", "bases-obj-09"),
    l4, ...pick("bases-obj-10", "bases-obj-11", "bases-obj-12"),
    l5, ...pick("bases-obj-13", "bases-obj-14", "bases-obj-15", "bases-obj-16"),
    l6, ...pick("bases-obj-17", "bases-obj-18", "bases-obj-19"),
    l7, ...pick("bases-obj-20", "bases-obj-21", "bases-obj-22"),
    l8, ...pick("bases-obj-23", "bases-obj-24", "bases-obj-25"),
    l9, ...pick("bases-obj-26", "bases-obj-27", "bases-obj-28"),
  ],
};
