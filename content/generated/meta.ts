/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Produit par scripts/gen-content-meta.mjs, lancé avant `next build`.
 * La dérive est détectée par content/__tests__/content.test.ts.
 */

import type { CourseMeta } from "@/lib/types";

export const courses: CourseMeta[] = [
  {
    "id": "java",
    "title": "Java",
    "description": "Le langage : fondamentaux, POO, collections, exceptions, Java moderne.",
    "icon": "☕",
    "chapters": [
      {
        "id": "java-fondamentaux",
        "title": "Fondamentaux : primitifs, String, passage par valeur, final",
        "objective": "Éviter les pièges de l'autoboxing et de ==, comprendre l'immuabilité de String, expliquer le passage par valeur et maîtriser final et l'initialisation statique.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "java-fond-l1",
            "title": "Primitifs, wrappers et les pièges de l'autoboxing"
          },
          {
            "kind": "output",
            "id": "java-fond-01",
            "difficulty": 2,
            "tags": [
              "autoboxing",
              "wrappers",
              "egalite"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-fond-02",
            "difficulty": 1,
            "tags": [
              "wrappers",
              "egalite"
            ],
            "prompt": "Deux variables `Integer a` et `Integer b`. Quelle comparaison est correcte ?"
          },
          {
            "kind": "output",
            "id": "java-fond-03",
            "difficulty": 2,
            "tags": [
              "autoboxing",
              "wrappers",
              "null"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "output",
            "id": "java-fond-04",
            "difficulty": 3,
            "tags": [
              "autoboxing",
              "surcharge-vs-redefinition",
              "collections"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-fond-05",
            "difficulty": 2,
            "tags": [
              "wrappers",
              "generiques"
            ],
            "prompt": "Pourquoi écrit-on `Map<String, Integer>` et jamais `Map<String, int>` ?"
          },
          {
            "kind": "spot",
            "id": "java-fond-06",
            "difficulty": 2,
            "tags": [
              "autoboxing",
              "wrappers",
              "performance"
            ],
            "prompt": "Cette méthode est correcte mais anormalement lente. Trouve la ligne responsable."
          },
          {
            "kind": "match",
            "id": "java-fond-07",
            "difficulty": 1,
            "tags": [
              "primitifs",
              "wrappers",
              "initialisation"
            ],
            "prompt": "Associe chaque type de **champ** à sa valeur par défaut quand il n'est pas initialisé."
          },
          {
            "kind": "recall",
            "id": "java-fond-08",
            "difficulty": 2,
            "tags": [
              "autoboxing",
              "wrappers",
              "egalite"
            ],
            "prompt": "Explique le cache des `Integer` et pourquoi `==` entre deux `Integer` est un piège."
          },
          {
            "kind": "lesson",
            "id": "java-fond-l2",
            "title": "String : immuable, pool de constantes et StringBuilder"
          },
          {
            "kind": "output",
            "id": "java-fond-09",
            "difficulty": 2,
            "tags": [
              "string",
              "string-pool",
              "egalite"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-fond-10",
            "difficulty": 1,
            "tags": [
              "string",
              "immuabilite"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-fond-11",
            "difficulty": 2,
            "tags": [
              "string",
              "immuabilite",
              "performance"
            ],
            "prompt": "Cette méthode est correcte mais très lente sur une grande liste. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "java-fond-12",
            "difficulty": 1,
            "tags": [
              "string",
              "egalite",
              "null"
            ],
            "prompt": "Quelle différence entre `s.equals(\"ok\")` et `\"ok\".equals(s)` ?"
          },
          {
            "kind": "fill",
            "id": "java-fond-13",
            "difficulty": 1,
            "tags": [
              "string",
              "immuabilite",
              "stringbuilder"
            ],
            "prompt": "Complète pour obtenir `AVAJ` dans `r`."
          },
          {
            "kind": "recall",
            "id": "java-fond-14",
            "difficulty": 2,
            "tags": [
              "string",
              "string-pool",
              "egalite"
            ],
            "prompt": "Qu'est-ce que le pool de chaînes ? Quand deux chaînes de même contenu sont-elles le même objet, et quand ne le sont-elles pas ?"
          },
          {
            "kind": "output",
            "id": "java-fond-15",
            "difficulty": 3,
            "tags": [
              "string",
              "immuabilite",
              "passage-par-valeur"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "recall",
            "id": "java-fond-16",
            "difficulty": 2,
            "tags": [
              "string",
              "immuabilite",
              "conception"
            ],
            "prompt": "Pourquoi `String` est-elle immuable en Java ? Cite au moins trois bénéfices concrets."
          },
          {
            "kind": "lesson",
            "id": "java-fond-l3",
            "title": "Java passe tout par valeur"
          },
          {
            "kind": "output",
            "id": "java-fond-17",
            "difficulty": 2,
            "tags": [
              "passage-par-valeur",
              "immuabilite"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-fond-18",
            "difficulty": 2,
            "tags": [
              "passage-par-valeur",
              "tableaux"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-fond-19",
            "difficulty": 1,
            "tags": [
              "passage-par-valeur"
            ],
            "prompt": "Java passe-t-il les objets par référence ?"
          },
          {
            "kind": "spot",
            "id": "java-fond-20",
            "difficulty": 2,
            "tags": [
              "passage-par-valeur"
            ],
            "prompt": "`reset(c)` ne remet jamais le compteur à zéro. Trouve la ligne responsable."
          },
          {
            "kind": "recall",
            "id": "java-fond-21",
            "difficulty": 2,
            "tags": [
              "passage-par-valeur"
            ],
            "prompt": "Java est-il « pass by value » ou « pass by reference » ? Donne un exemple où une méthode modifie ce que voit l'appelant, et un où elle ne le peut pas."
          },
          {
            "kind": "mcq",
            "id": "java-fond-22",
            "difficulty": 2,
            "tags": [
              "passage-par-valeur",
              "conception"
            ],
            "prompt": "Une méthode doit « renvoyer » deux résultats calculés. Quelle approche est correcte en Java ?"
          },
          {
            "kind": "fill",
            "id": "java-fond-23",
            "difficulty": 2,
            "tags": [
              "passage-par-valeur",
              "collections"
            ],
            "prompt": "Complète pour que `names` finisse vide après les trois appels."
          },
          {
            "kind": "lesson",
            "id": "java-fond-l4",
            "title": "final, portée et blocs static"
          },
          {
            "kind": "output",
            "id": "java-fond-24",
            "difficulty": 2,
            "tags": [
              "initialisation",
              "static"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-fond-25",
            "difficulty": 2,
            "tags": [
              "final",
              "constructeurs",
              "initialisation"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "java-fond-26",
            "difficulty": 2,
            "tags": [
              "final",
              "static",
              "initialisation"
            ],
            "prompt": "Complète pour que la classe compile."
          },
          {
            "kind": "spot",
            "id": "java-fond-27",
            "difficulty": 2,
            "tags": [
              "final",
              "lambdas",
              "portee"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "java-fond-28",
            "difficulty": 1,
            "tags": [
              "final"
            ],
            "prompt": "Associe chaque cible de `final` à son effet."
          },
          {
            "kind": "recall",
            "id": "java-fond-29",
            "difficulty": 3,
            "tags": [
              "final",
              "immuabilite",
              "collections"
            ],
            "prompt": "`private final List<String> items = new ArrayList<>();` : qu'est-ce que `final` garantit, qu'est-ce qu'il ne garantit pas, et comment obtenir une vraie liste immuable ?"
          },
          {
            "kind": "order",
            "id": "java-fond-30",
            "difficulty": 2,
            "tags": [
              "static",
              "initialisation",
              "jvm"
            ],
            "prompt": "La JVM rencontre `Config.DEFAULTS` pour la première fois. Remets dans l'ordre ce qui se passe."
          }
        ]
      },
      {
        "id": "java-interfaces-classes-abstraites",
        "title": "Interfaces et classes abstraites",
        "objective": "Choisir entre interface et classe abstraite, écrire des méthodes default sans conflit, et ne plus confondre surcharge et redéfinition.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "java-ica-l1",
            "title": "L'interface : un contrat sans état"
          },
          {
            "kind": "mcq",
            "id": "java-ica-01",
            "difficulty": 1,
            "tags": [
              "interfaces",
              "constantes"
            ],
            "prompt": "Dans `interface Config { int TIMEOUT = 30; }`, qu'est `TIMEOUT` ?"
          },
          {
            "kind": "fill",
            "id": "java-ica-02",
            "difficulty": 1,
            "tags": [
              "interfaces",
              "visibilite"
            ],
            "prompt": "Complète pour que `EmailSender` respecte le contrat de `Sender`."
          },
          {
            "kind": "output",
            "id": "java-ica-03",
            "difficulty": 2,
            "tags": [
              "interfaces",
              "visibilite"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "spot",
            "id": "java-ica-04",
            "difficulty": 2,
            "tags": [
              "interfaces",
              "constantes"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "java-ica-05",
            "difficulty": 1,
            "tags": [
              "interfaces"
            ],
            "prompt": "Associe chaque élément d'une interface à ce qu'il implique."
          },
          {
            "kind": "recall",
            "id": "java-ica-06",
            "difficulty": 2,
            "tags": [
              "interfaces",
              "heritage"
            ],
            "prompt": "Pourquoi une classe Java peut-elle implémenter plusieurs interfaces, alors qu'elle ne peut hériter que d'une seule classe ?"
          },
          {
            "kind": "mcq",
            "id": "java-ica-07",
            "difficulty": 2,
            "tags": [
              "interfaces",
              "conception"
            ],
            "prompt": "`Bird` et `Airplane extends Vehicle` n'ont aucun lien, mais toutes deux doivent pouvoir être passées à `void launch(Flyable f)`. Comment définir `Flyable` ?"
          },
          {
            "kind": "lesson",
            "id": "java-ica-l2",
            "title": "La classe abstraite : un squelette avec de l'état"
          },
          {
            "kind": "mcq",
            "id": "java-ica-08",
            "difficulty": 1,
            "tags": [
              "classes-abstraites"
            ],
            "prompt": "Laquelle de ces affirmations sur une classe abstraite est vraie ?"
          },
          {
            "kind": "output",
            "id": "java-ica-09",
            "difficulty": 2,
            "tags": [
              "classes-abstraites",
              "template-method"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-ica-10",
            "difficulty": 2,
            "tags": [
              "classes-abstraites",
              "heritage"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "java-ica-11",
            "difficulty": 2,
            "tags": [
              "classes-abstraites",
              "constructeurs"
            ],
            "prompt": "Complète pour que `Vehicle` soit un squelette et `Bike` une implémentation."
          },
          {
            "kind": "output",
            "id": "java-ica-12",
            "difficulty": 3,
            "tags": [
              "classes-abstraites",
              "constructeurs",
              "initialisation"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-ica-13",
            "difficulty": 2,
            "tags": [
              "classes-abstraites",
              "conception"
            ],
            "prompt": "`Invoice`, `Receipt` et `Quote` doivent partager un compteur de séquence et une méthode `format()` commune, chacune définissant seulement son `title()`. Que choisir ?"
          },
          {
            "kind": "order",
            "id": "java-ica-14",
            "difficulty": 2,
            "tags": [
              "heritage",
              "constructeurs",
              "initialisation"
            ],
            "prompt": "`Child extends Parent`, chacune avec des champs initialisés et un constructeur. Remets dans l'ordre ce qui s'exécute lors du tout premier `new Child()`."
          },
          {
            "kind": "recall",
            "id": "java-ica-15",
            "difficulty": 3,
            "tags": [
              "heritage",
              "conception",
              "composition"
            ],
            "prompt": "Un collègue propose une classe abstraite `BaseService` dont hériteraient tous les services de l'application, pour partager un logger et quelques utilitaires. Que lui réponds-tu ?"
          },
          {
            "kind": "lesson",
            "id": "java-ica-l3",
            "title": "default, static, private : du code dans une interface"
          },
          {
            "kind": "mcq",
            "id": "java-ica-16",
            "difficulty": 2,
            "tags": [
              "interfaces",
              "default-methods"
            ],
            "prompt": "Une classe implémente deux interfaces sans lien entre elles, qui déclarent chacune `default void log()`. Que se passe-t-il ?"
          },
          {
            "kind": "output",
            "id": "java-ica-17",
            "difficulty": 2,
            "tags": [
              "default-methods",
              "heritage"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "fill",
            "id": "java-ica-18",
            "difficulty": 2,
            "tags": [
              "default-methods"
            ],
            "prompt": "Fais déléguer `Robot.move()` à l'implémentation de `Walker`."
          },
          {
            "kind": "recall",
            "id": "java-ica-19",
            "difficulty": 2,
            "tags": [
              "interfaces",
              "static-methods"
            ],
            "prompt": "Les méthodes `static` déclarées dans une interface sont-elles héritées par les classes qui l'implémentent ? Comment les appelle-t-on ?"
          },
          {
            "kind": "spot",
            "id": "java-ica-20",
            "difficulty": 2,
            "tags": [
              "default-methods",
              "interfaces"
            ],
            "prompt": "Ce code ne compile pas (Java 17). Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "java-ica-21",
            "difficulty": 3,
            "tags": [
              "default-methods",
              "conception"
            ],
            "prompt": "À quoi servent les méthodes `default`, et quel problème ont-elles résolu à leur arrivée en Java 8 ?"
          },
          {
            "kind": "order",
            "id": "java-ica-22",
            "difficulty": 2,
            "tags": [
              "default-methods",
              "heritage"
            ],
            "prompt": "Remets dans l'ordre les règles que Java applique pour choisir entre plusieurs méthodes de même signature héritées."
          },
          {
            "kind": "lesson",
            "id": "java-ica-l4",
            "title": "Surcharge ou redéfinition : qui décide, et quand"
          },
          {
            "kind": "output",
            "id": "java-ica-23",
            "difficulty": 2,
            "tags": [
              "surcharge-vs-redefinition",
              "polymorphisme"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-ica-24",
            "difficulty": 2,
            "tags": [
              "surcharge-vs-redefinition",
              "polymorphisme"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-ica-25",
            "difficulty": 2,
            "tags": [
              "surcharge-vs-redefinition",
              "equals-hashcode"
            ],
            "prompt": "`new HashSet<>()` accepte deux `Account` de même `id`. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "java-ica-26",
            "difficulty": 3,
            "tags": [
              "surcharge-vs-redefinition",
              "visibilite",
              "exceptions"
            ],
            "prompt": "Le parent déclare `protected Number compute() throws IOException`. Laquelle de ces redéfinitions est **refusée** par le compilateur ?"
          },
          {
            "kind": "fill",
            "id": "java-ica-27",
            "difficulty": 1,
            "tags": [
              "surcharge-vs-redefinition"
            ],
            "prompt": "Complète pour que `Square` redéfinisse correctement `area()`."
          },
          {
            "kind": "recall",
            "id": "java-ica-28",
            "difficulty": 2,
            "tags": [
              "surcharge-vs-redefinition",
              "polymorphisme"
            ],
            "prompt": "Surcharge et redéfinition : pour chacune, qui décide de la méthode appelée, et à quel moment ?"
          },
          {
            "kind": "match",
            "id": "java-ica-29",
            "difficulty": 2,
            "tags": [
              "surcharge-vs-redefinition",
              "classes-abstraites",
              "default-methods"
            ],
            "prompt": "Associe chaque situation au verdict du compilateur."
          },
          {
            "kind": "match",
            "id": "java-ica-30",
            "difficulty": 1,
            "tags": [
              "heritage",
              "default-methods",
              "static-methods"
            ],
            "prompt": "Associe chaque mot-clé à son effet sur une méthode."
          }
        ]
      },
      {
        "id": "java-equals-hashcode-comparable",
        "title": "equals/hashCode, Comparable vs Comparator, record, enum",
        "objective": "Écrire un equals/hashCode correct, choisir entre Comparable et Comparator, et utiliser record et enum sans leurs pièges.",
        "prerequisites": [
          "java-interfaces-classes-abstraites"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "java-ehc-l1",
            "title": "Le contrat equals / hashCode"
          },
          {
            "kind": "mcq",
            "id": "java-ehc-01",
            "difficulty": 1,
            "tags": [
              "equals-hashcode",
              "null"
            ],
            "prompt": "Selon le contrat d'`equals`, que doit renvoyer `x.equals(null)` ?"
          },
          {
            "kind": "output",
            "id": "java-ehc-02",
            "difficulty": 2,
            "tags": [
              "equals-hashcode",
              "collections"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-ehc-03",
            "difficulty": 2,
            "tags": [
              "equals-hashcode",
              "hashmap",
              "immuabilite"
            ],
            "prompt": "`Person` redéfinit `equals` et `hashCode` sur `name`. Pourtant `roles.get(p)` renvoie `null`. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "java-ehc-04",
            "difficulty": 2,
            "tags": [
              "equals-hashcode"
            ],
            "prompt": "Complète l'idiome `equals` / `hashCode` sur l'identifiant."
          },
          {
            "kind": "mcq",
            "id": "java-ehc-05",
            "difficulty": 2,
            "tags": [
              "equals-hashcode",
              "heritage",
              "conception"
            ],
            "prompt": "Pourquoi certains `equals` écrivent `getClass() != o.getClass()` plutôt qu'`instanceof` ?"
          },
          {
            "kind": "match",
            "id": "java-ehc-06",
            "difficulty": 1,
            "tags": [
              "equals-hashcode"
            ],
            "prompt": "Associe chaque règle du contrat à sa formulation."
          },
          {
            "kind": "recall",
            "id": "java-ehc-07",
            "difficulty": 2,
            "tags": [
              "equals-hashcode",
              "hashmap"
            ],
            "prompt": "Que se passe-t-il concrètement dans une `HashMap` quand une classe redéfinit `equals` mais pas `hashCode` ?"
          },
          {
            "kind": "output",
            "id": "java-ehc-08",
            "difficulty": 2,
            "tags": [
              "equals-hashcode",
              "null"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "lesson",
            "id": "java-ehc-l2",
            "title": "Comparable : l'ordre naturel ; Comparator : les autres"
          },
          {
            "kind": "output",
            "id": "java-ehc-09",
            "difficulty": 3,
            "tags": [
              "comparator",
              "set",
              "equals-hashcode"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-ehc-10",
            "difficulty": 2,
            "tags": [
              "comparable",
              "autoboxing"
            ],
            "prompt": "Le tri est parfois faux avec de très grandes ou très petites valeurs. Trouve la ligne responsable."
          },
          {
            "kind": "recall",
            "id": "java-ehc-11",
            "difficulty": 2,
            "tags": [
              "comparable",
              "comparator",
              "conception"
            ],
            "prompt": "Quand implémenter `Comparable`, et quand écrire un `Comparator` ?"
          },
          {
            "kind": "fill",
            "id": "java-ehc-12",
            "difficulty": 2,
            "tags": [
              "comparator",
              "lambdas"
            ],
            "prompt": "Trie par nom, puis par âge pour départager, le tout en ordre décroissant."
          },
          {
            "kind": "output",
            "id": "java-ehc-13",
            "difficulty": 2,
            "tags": [
              "comparable",
              "record",
              "generiques"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "java-ehc-14",
            "difficulty": 2,
            "tags": [
              "comparator",
              "set",
              "equals-hashcode"
            ],
            "prompt": "Pourquoi un `TreeSet` peut-il « perdre » des éléments qu'un `HashSet` aurait gardés ?"
          },
          {
            "kind": "match",
            "id": "java-ehc-15",
            "difficulty": 2,
            "tags": [
              "comparator"
            ],
            "prompt": "Associe chaque méthode de `Comparator` à son rôle."
          },
          {
            "kind": "output",
            "id": "java-ehc-16",
            "difficulty": 2,
            "tags": [
              "comparator",
              "null"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "lesson",
            "id": "java-ehc-l3",
            "title": "record : une classe de données sans cérémonie"
          },
          {
            "kind": "output",
            "id": "java-ehc-17",
            "difficulty": 1,
            "tags": [
              "record",
              "equals-hashcode"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-ehc-18",
            "difficulty": 2,
            "tags": [
              "record",
              "heritage"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "mcq",
            "id": "java-ehc-19",
            "difficulty": 2,
            "tags": [
              "record",
              "immuabilite",
              "collections"
            ],
            "prompt": "`record Cart(List<String> items) {}`. Que garantit l'immuabilité du record ?"
          },
          {
            "kind": "fill",
            "id": "java-ehc-20",
            "difficulty": 2,
            "tags": [
              "record",
              "exceptions"
            ],
            "prompt": "Complète le constructeur compact qui valide et normalise l'email."
          },
          {
            "kind": "recall",
            "id": "java-ehc-21",
            "difficulty": 2,
            "tags": [
              "record"
            ],
            "prompt": "Qu'est-ce qu'un `record` génère automatiquement, et qu'est-ce qu'il interdit ?"
          },
          {
            "kind": "mcq",
            "id": "java-ehc-22",
            "difficulty": 1,
            "tags": [
              "record"
            ],
            "prompt": "Quel accesseur un record génère-t-il pour le composant `price` ?"
          },
          {
            "kind": "order",
            "id": "java-ehc-23",
            "difficulty": 2,
            "tags": [
              "record",
              "constructeurs"
            ],
            "prompt": "`Range` a un constructeur compact qui valide. Remets dans l'ordre ce qui se passe lors de `new Range(1, 5)`."
          },
          {
            "kind": "lesson",
            "id": "java-ehc-l4",
            "title": "enum : un ensemble fermé d'instances"
          },
          {
            "kind": "output",
            "id": "java-ehc-24",
            "difficulty": 2,
            "tags": [
              "enum",
              "exceptions"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "java-ehc-25",
            "difficulty": 2,
            "tags": [
              "enum",
              "egalite"
            ],
            "prompt": "Pour comparer deux valeurs d'une `enum`, `==` ou `equals` ?"
          },
          {
            "kind": "spot",
            "id": "java-ehc-26",
            "difficulty": 2,
            "tags": [
              "enum",
              "conception"
            ],
            "prompt": "Après l'ajout d'une constante `URGENT` en tête de `Priority`, les priorités relues depuis la base sont toutes décalées. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "java-ehc-27",
            "difficulty": 2,
            "tags": [
              "enum"
            ],
            "prompt": "Complète l'enum et son usage."
          },
          {
            "kind": "match",
            "id": "java-ehc-28",
            "difficulty": 1,
            "tags": [
              "enum"
            ],
            "prompt": "Associe chaque membre d'une enum à son rôle."
          },
          {
            "kind": "recall",
            "id": "java-ehc-29",
            "difficulty": 3,
            "tags": [
              "enum",
              "conception"
            ],
            "prompt": "Qu'apporte une `enum` par rapport à des constantes `public static final int STATUS_DRAFT = 0` ?"
          },
          {
            "kind": "output",
            "id": "java-ehc-30",
            "difficulty": 3,
            "tags": [
              "enum",
              "polymorphisme"
            ],
            "prompt": "Qu'affiche ce code ?"
          }
        ]
      },
      {
        "id": "java-collections",
        "title": "Collections : List, Set, Map, HashMap interne",
        "objective": "Choisir la bonne structure, expliquer le fonctionnement interne de HashMap, manier les collections immuables et modifier une collection sans ConcurrentModificationException.",
        "prerequisites": [
          "java-equals-hashcode-comparable"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "java-col-l1",
            "title": "List, Set, Map, Deque : choisir la bonne structure"
          },
          {
            "kind": "mcq",
            "id": "java-col-01",
            "difficulty": 2,
            "tags": [
              "list",
              "performance"
            ],
            "prompt": "Pourquoi `LinkedList` est-elle presque toujours un mauvais choix ?"
          },
          {
            "kind": "match",
            "id": "java-col-02",
            "difficulty": 1,
            "tags": [
              "collections",
              "conception"
            ],
            "prompt": "Associe chaque besoin à l'implémentation adaptée."
          },
          {
            "kind": "output",
            "id": "java-col-03",
            "difficulty": 2,
            "tags": [
              "set",
              "collections"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-col-04",
            "difficulty": 2,
            "tags": [
              "list",
              "performance"
            ],
            "prompt": "Cette somme est quadratique sur une grande liste. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "java-col-05",
            "difficulty": 1,
            "tags": [
              "collections",
              "conception",
              "interfaces"
            ],
            "prompt": "Pourquoi déclarer `List<String> l = new ArrayList<>()` plutôt que `ArrayList<String> l = new ArrayList<>()` ?"
          },
          {
            "kind": "output",
            "id": "java-col-06",
            "difficulty": 2,
            "tags": [
              "collections",
              "deque"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "recall",
            "id": "java-col-07",
            "difficulty": 2,
            "tags": [
              "list",
              "performance"
            ],
            "prompt": "`ArrayList` vs `LinkedList` : compare les complexités réelles, et dis dans quel cas `LinkedList` a un sens."
          },
          {
            "kind": "recall",
            "id": "java-col-08",
            "difficulty": 2,
            "tags": [
              "hashmap",
              "collections",
              "conception"
            ],
            "prompt": "Tu dois compter les occurrences de chaque mot d'un texte, puis les afficher par ordre alphabétique. Quelles structures, et pourquoi ?"
          },
          {
            "kind": "lesson",
            "id": "java-col-l2",
            "title": "HashMap de l'intérieur : buckets, collisions, resize"
          },
          {
            "kind": "mcq",
            "id": "java-col-09",
            "difficulty": 2,
            "tags": [
              "hashmap",
              "performance"
            ],
            "prompt": "Une `HashMap` par défaut (16 buckets) reçoit sa 13ᵉ entrée. Que se passe-t-il ?"
          },
          {
            "kind": "output",
            "id": "java-col-10",
            "difficulty": 3,
            "tags": [
              "hashmap",
              "iteration"
            ],
            "prompt": "Qu'affiche ce code ? (`Integer.hashCode()` renvoie la valeur elle-même.)"
          },
          {
            "kind": "spot",
            "id": "java-col-11",
            "difficulty": 2,
            "tags": [
              "hashmap",
              "equals-hashcode",
              "performance"
            ],
            "prompt": "`Map<Sku, Stock>` fonctionne mais devient très lente avec 100 000 clés. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "java-col-12",
            "difficulty": 2,
            "tags": [
              "hashmap",
              "lambdas"
            ],
            "prompt": "Complète avec les méthodes de `Map` adaptées."
          },
          {
            "kind": "recall",
            "id": "java-col-13",
            "difficulty": 2,
            "tags": [
              "hashmap"
            ],
            "prompt": "Décris le chemin exact d'un `map.get(key)` dans une `HashMap`."
          },
          {
            "kind": "mcq",
            "id": "java-col-14",
            "difficulty": 2,
            "tags": [
              "hashmap",
              "performance"
            ],
            "prompt": "Depuis Java 8, un bucket très rempli devient un arbre. Dans quelle condition, et pourquoi ?"
          },
          {
            "kind": "output",
            "id": "java-col-15",
            "difficulty": 3,
            "tags": [
              "hashmap",
              "null"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "order",
            "id": "java-col-16",
            "difficulty": 2,
            "tags": [
              "hashmap"
            ],
            "prompt": "Remets dans l'ordre les étapes d'un `put(key, value)` dans une `HashMap`."
          },
          {
            "kind": "lesson",
            "id": "java-col-l3",
            "title": "Immuable, vue ou copie : List.of, unmodifiableList, copyOf"
          },
          {
            "kind": "output",
            "id": "java-col-17",
            "difficulty": 2,
            "tags": [
              "immuabilite",
              "list"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-col-18",
            "difficulty": 2,
            "tags": [
              "list",
              "immuabilite"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "java-col-19",
            "difficulty": 2,
            "tags": [
              "immuabilite",
              "null"
            ],
            "prompt": "Que fait `List.of(\"a\", null)` ?"
          },
          {
            "kind": "spot",
            "id": "java-col-20",
            "difficulty": 2,
            "tags": [
              "immuabilite",
              "conception"
            ],
            "prompt": "Des appelants modifient les lignes de commande sans passer par `add()`. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "java-col-21",
            "difficulty": 1,
            "tags": [
              "immuabilite",
              "collections"
            ],
            "prompt": "Complète avec les fabriques de collections immuables."
          },
          {
            "kind": "recall",
            "id": "java-col-22",
            "difficulty": 2,
            "tags": [
              "immuabilite",
              "collections"
            ],
            "prompt": "Différences entre `Collections.unmodifiableList(src)`, `List.copyOf(src)` et `List.of(...)` ?"
          },
          {
            "kind": "mcq",
            "id": "java-col-23",
            "difficulty": 2,
            "tags": [
              "immuabilite",
              "conception"
            ],
            "prompt": "Un constructeur reçoit une `List<String> tags` et la range dans un champ `final`. Quel risque, quelle parade ?"
          },
          {
            "kind": "lesson",
            "id": "java-col-l4",
            "title": "Itérer et modifier sans ConcurrentModificationException"
          },
          {
            "kind": "output",
            "id": "java-col-24",
            "difficulty": 2,
            "tags": [
              "iteration",
              "collections",
              "autoboxing"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "output",
            "id": "java-col-25",
            "difficulty": 3,
            "tags": [
              "iteration",
              "collections"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "spot",
            "id": "java-col-26",
            "difficulty": 2,
            "tags": [
              "iteration",
              "hashmap"
            ],
            "prompt": "Ce nettoyage lève une `ConcurrentModificationException`. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "java-col-27",
            "difficulty": 1,
            "tags": [
              "iteration"
            ],
            "prompt": "Complète le parcours avec suppression sûre."
          },
          {
            "kind": "mcq",
            "id": "java-col-28",
            "difficulty": 2,
            "tags": [
              "iteration",
              "collections"
            ],
            "prompt": "Que signifie « fail-fast » pour l'itérateur d'une `ArrayList` ?"
          },
          {
            "kind": "match",
            "id": "java-col-29",
            "difficulty": 2,
            "tags": [
              "iteration",
              "collections"
            ],
            "prompt": "Associe chaque situation à la bonne réponse."
          },
          {
            "kind": "recall",
            "id": "java-col-30",
            "difficulty": 2,
            "tags": [
              "iteration",
              "collections"
            ],
            "prompt": "Trois façons sûres de retirer des éléments d'une `List` pendant qu'on la parcourt, avec leurs avantages."
          }
        ]
      },
      {
        "id": "java-exceptions",
        "title": "Exceptions : checked/unchecked, try-with-resources",
        "objective": "Choisir entre checked et unchecked, maîtriser l'ordre d'exécution de finally, utiliser try-with-resources et écrire des exceptions métier qui gardent la cause.",
        "prerequisites": [
          "java-fondamentaux"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "java-exc-l1",
            "title": "Checked, unchecked : la hiérarchie et la règle catch-or-declare"
          },
          {
            "kind": "mcq",
            "id": "java-exc-01",
            "difficulty": 1,
            "tags": [
              "exceptions",
              "checked-vs-unchecked"
            ],
            "prompt": "Laquelle de ces exceptions est **checked** ?"
          },
          {
            "kind": "output",
            "id": "java-exc-02",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "checked-vs-unchecked"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "match",
            "id": "java-exc-03",
            "difficulty": 1,
            "tags": [
              "exceptions",
              "checked-vs-unchecked"
            ],
            "prompt": "Associe chaque type à sa place dans la hiérarchie."
          },
          {
            "kind": "mcq",
            "id": "java-exc-04",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "checked-vs-unchecked",
              "conception"
            ],
            "prompt": "Une méthode de validation reçoit un âge négatif. Que lancer ?"
          },
          {
            "kind": "fill",
            "id": "java-exc-05",
            "difficulty": 1,
            "tags": [
              "exceptions",
              "checked-vs-unchecked"
            ],
            "prompt": "Complète pour que le code compile."
          },
          {
            "kind": "spot",
            "id": "java-exc-06",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "checked-vs-unchecked"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "java-exc-07",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "checked-vs-unchecked",
              "conception"
            ],
            "prompt": "Quelle est la différence entre une exception checked et une unchecked, et sur quel critère choisir quand tu en crées une ?"
          },
          {
            "kind": "mcq",
            "id": "java-exc-08",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "heritage"
            ],
            "prompt": "Une méthode du parent déclare `throws IOException`. Que peut déclarer la redéfinition dans la sous-classe ?"
          },
          {
            "kind": "lesson",
            "id": "java-exc-l2",
            "title": "try, catch, finally : l'ordre d'exécution"
          },
          {
            "kind": "output",
            "id": "java-exc-09",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "finally"
            ],
            "prompt": "Que renvoie `f()` ?"
          },
          {
            "kind": "output",
            "id": "java-exc-10",
            "difficulty": 3,
            "tags": [
              "exceptions",
              "finally"
            ],
            "prompt": "Que renvoie `g()` ?"
          },
          {
            "kind": "output",
            "id": "java-exc-11",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "finally"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-exc-12",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "ordre-des-catch"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "java-exc-13",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "multi-catch"
            ],
            "prompt": "Factorise les deux traitements identiques en un seul bloc."
          },
          {
            "kind": "order",
            "id": "java-exc-14",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "finally"
            ],
            "prompt": "Une exception est levée dans le `try` et attrapée. Remets dans l'ordre ce qui s'exécute."
          },
          {
            "kind": "recall",
            "id": "java-exc-15",
            "difficulty": 3,
            "tags": [
              "exceptions",
              "finally",
              "anti-patterns"
            ],
            "prompt": "Pourquoi ne faut-il jamais écrire de `return` dans un bloc `finally` ?"
          },
          {
            "kind": "mcq",
            "id": "java-exc-16",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "finally"
            ],
            "prompt": "Dans quel cas le bloc `finally` n'est-il **pas** exécuté ?"
          },
          {
            "kind": "lesson",
            "id": "java-exc-l3",
            "title": "try-with-resources et AutoCloseable"
          },
          {
            "kind": "output",
            "id": "java-exc-17",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "try-with-resources"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-exc-18",
            "difficulty": 3,
            "tags": [
              "exceptions",
              "try-with-resources",
              "suppressed"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-exc-19",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "try-with-resources",
              "streams"
            ],
            "prompt": "Cette méthode finit par épuiser les descripteurs de fichiers. Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "java-exc-20",
            "difficulty": 1,
            "tags": [
              "exceptions",
              "try-with-resources"
            ],
            "prompt": "Complète pour que la connexion soit fermée automatiquement."
          },
          {
            "kind": "mcq",
            "id": "java-exc-21",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "try-with-resources"
            ],
            "prompt": "Dans un `try-with-resources`, le corps réussit mais `close()` lève une exception. Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "java-exc-22",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "try-with-resources",
              "suppressed"
            ],
            "prompt": "Qu'apporte `try-with-resources` par rapport à un `try/finally` qui ferme la ressource ?"
          },
          {
            "kind": "match",
            "id": "java-exc-23",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "try-with-resources"
            ],
            "prompt": "Associe chaque situation à son comportement dans un `try-with-resources`."
          },
          {
            "kind": "mcq",
            "id": "java-exc-24",
            "difficulty": 1,
            "tags": [
              "exceptions",
              "try-with-resources"
            ],
            "prompt": "Peut-on utiliser `catch` et `finally` avec un `try-with-resources` ?"
          },
          {
            "kind": "lesson",
            "id": "java-exc-l4",
            "title": "Exceptions métier et anti-patterns"
          },
          {
            "kind": "spot",
            "id": "java-exc-25",
            "difficulty": 1,
            "tags": [
              "exceptions",
              "anti-patterns"
            ],
            "prompt": "Un bug de production reste introuvable malgré les journaux. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "java-exc-26",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "anti-patterns",
              "conception"
            ],
            "prompt": "Pourquoi `throw new ServiceException(e.getMessage())` est-il une mauvaise façon d'envelopper une exception ?"
          },
          {
            "kind": "output",
            "id": "java-exc-27",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "conception"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "fill",
            "id": "java-exc-28",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "conception"
            ],
            "prompt": "Complète cette exception métier pour qu'elle conserve la cause."
          },
          {
            "kind": "recall",
            "id": "java-exc-29",
            "difficulty": 3,
            "tags": [
              "exceptions",
              "anti-patterns"
            ],
            "prompt": "Cite trois anti-patterns courants dans la gestion des exceptions, et ce qu'il faut faire à la place."
          },
          {
            "kind": "recall",
            "id": "java-exc-30",
            "difficulty": 2,
            "tags": [
              "exceptions",
              "optional",
              "conception"
            ],
            "prompt": "Quand renvoyer un `Optional` vide plutôt que lancer une exception ?"
          }
        ]
      },
      {
        "id": "java-lambdas-streams",
        "title": "Lambdas, Stream API, Optional",
        "objective": "Écrire des lambdas et des références de méthode justes, composer un pipeline de stream en comprenant sa paresse, et utiliser Optional là où il a sa place.",
        "prerequisites": [
          "java-collections"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "java-lst-l1",
            "title": "Lambdas et interfaces fonctionnelles"
          },
          {
            "kind": "mcq",
            "id": "java-lst-01",
            "difficulty": 2,
            "tags": [
              "interfaces-fonctionnelles",
              "lambdas"
            ],
            "prompt": "Laquelle de ces interfaces est fonctionnelle, donc implémentable par une lambda ?"
          },
          {
            "kind": "fill",
            "id": "java-lst-02",
            "difficulty": 1,
            "tags": [
              "lambdas",
              "interfaces-fonctionnelles",
              "method-references"
            ],
            "prompt": "Complète : `empty` est vrai pour une chaîne de longueur 0, `len` donne la longueur, `make` crée une liste vide."
          },
          {
            "kind": "output",
            "id": "java-lst-03",
            "difficulty": 2,
            "tags": [
              "lambdas",
              "final",
              "portee"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "match",
            "id": "java-lst-04",
            "difficulty": 1,
            "tags": [
              "interfaces-fonctionnelles"
            ],
            "prompt": "Associe chaque interface de `java.util.function` à sa méthode abstraite."
          },
          {
            "kind": "output",
            "id": "java-lst-05",
            "difficulty": 3,
            "tags": [
              "lambdas",
              "surcharge-vs-redefinition",
              "interfaces-fonctionnelles"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "spot",
            "id": "java-lst-06",
            "difficulty": 2,
            "tags": [
              "lambdas"
            ],
            "prompt": "Ce code ne compile pas. Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "java-lst-07",
            "difficulty": 2,
            "tags": [
              "interfaces-fonctionnelles",
              "lambdas"
            ],
            "prompt": "Qu'est-ce qu'une interface fonctionnelle ? À quoi sert `@FunctionalInterface`, et pourquoi les méthodes `default` ne comptent-elles pas ?"
          },
          {
            "kind": "mcq",
            "id": "java-lst-08",
            "difficulty": 2,
            "tags": [
              "interfaces-fonctionnelles"
            ],
            "prompt": "Que fait exactement l'annotation `@FunctionalInterface` ?"
          },
          {
            "kind": "lesson",
            "id": "java-lst-l2",
            "title": "Références de méthode et pipeline de stream"
          },
          {
            "kind": "match",
            "id": "java-lst-09",
            "difficulty": 1,
            "tags": [
              "method-references"
            ],
            "prompt": "Associe chaque référence de méthode à sa forme."
          },
          {
            "kind": "output",
            "id": "java-lst-10",
            "difficulty": 2,
            "tags": [
              "streams",
              "collectors"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-lst-11",
            "difficulty": 3,
            "tags": [
              "collectors",
              "streams",
              "exceptions"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "fill",
            "id": "java-lst-12",
            "difficulty": 2,
            "tags": [
              "collectors",
              "streams"
            ],
            "prompt": "Complète : `byLen` compte les mots par longueur, `parts` sépare les mots de plus de 2 lettres des autres."
          },
          {
            "kind": "output",
            "id": "java-lst-13",
            "difficulty": 2,
            "tags": [
              "streams",
              "flatmap"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-lst-14",
            "difficulty": 2,
            "tags": [
              "streams",
              "optional"
            ],
            "prompt": "Que renvoie `nums.stream().reduce(Integer::sum)` ?"
          },
          {
            "kind": "spot",
            "id": "java-lst-15",
            "difficulty": 2,
            "tags": [
              "streams",
              "effets-de-bord"
            ],
            "prompt": "Ce code fonctionne, mais un relecteur le refuse. Trouve la ligne en cause."
          },
          {
            "kind": "recall",
            "id": "java-lst-16",
            "difficulty": 2,
            "tags": [
              "streams",
              "flatmap"
            ],
            "prompt": "`map` ou `flatMap` : quelle différence, et quand utiliser lequel ?"
          },
          {
            "kind": "lesson",
            "id": "java-lst-l3",
            "title": "Un stream est paresseux et à usage unique"
          },
          {
            "kind": "output",
            "id": "java-lst-17",
            "difficulty": 2,
            "tags": [
              "lazy-evaluation",
              "streams"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-lst-18",
            "difficulty": 3,
            "tags": [
              "lazy-evaluation",
              "streams",
              "short-circuit"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-lst-19",
            "difficulty": 2,
            "tags": [
              "streams",
              "exceptions"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "java-lst-20",
            "difficulty": 1,
            "tags": [
              "streams",
              "lazy-evaluation"
            ],
            "prompt": "Quel groupe ne contient **que** des opérations terminales ?"
          },
          {
            "kind": "order",
            "id": "java-lst-21",
            "difficulty": 2,
            "tags": [
              "lazy-evaluation",
              "streams"
            ],
            "prompt": "`Stream.of(1, 2, 3).filter(n -> n % 2 == 1).map(n -> n * 10).forEach(print)`. Remets dans l'ordre les appels de lambdas effectivement exécutés."
          },
          {
            "kind": "spot",
            "id": "java-lst-22",
            "difficulty": 2,
            "tags": [
              "streams",
              "lazy-evaluation"
            ],
            "prompt": "Ce programme ne se termine jamais. Trouve la ligne responsable."
          },
          {
            "kind": "recall",
            "id": "java-lst-23",
            "difficulty": 2,
            "tags": [
              "lazy-evaluation",
              "streams"
            ],
            "prompt": "Explique la paresse des streams : que se passe-t-il sans opération terminale, et comment les éléments traversent-ils le pipeline ?"
          },
          {
            "kind": "lesson",
            "id": "java-lst-l4",
            "title": "Optional : dire « peut-être » dans un type de retour"
          },
          {
            "kind": "output",
            "id": "java-lst-24",
            "difficulty": 2,
            "tags": [
              "optional",
              "lazy-evaluation"
            ],
            "prompt": "Qu'affiche ce code ?"
          },
          {
            "kind": "output",
            "id": "java-lst-25",
            "difficulty": 2,
            "tags": [
              "optional",
              "null"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "fill",
            "id": "java-lst-26",
            "difficulty": 2,
            "tags": [
              "optional"
            ],
            "prompt": "Complète : l'e-mail de l'utilisateur s'il existe et n'est pas vide, sinon `inconnu`."
          },
          {
            "kind": "spot",
            "id": "java-lst-27",
            "difficulty": 2,
            "tags": [
              "optional",
              "conception"
            ],
            "prompt": "Ce code compile et fonctionne, mais contredit l'usage prévu d'`Optional`. Trouve la ligne."
          },
          {
            "kind": "mcq",
            "id": "java-lst-28",
            "difficulty": 2,
            "tags": [
              "optional",
              "exceptions"
            ],
            "prompt": "Que fait `opt.get()` si l'`Optional` est vide, et que préférer ?"
          },
          {
            "kind": "recall",
            "id": "java-lst-29",
            "difficulty": 2,
            "tags": [
              "optional",
              "lazy-evaluation"
            ],
            "prompt": "`orElse` ou `orElseGet` : quelle différence, et dans quel cas ça compte vraiment ?"
          },
          {
            "kind": "recall",
            "id": "java-lst-30",
            "difficulty": 3,
            "tags": [
              "optional",
              "conception"
            ],
            "prompt": "Pourquoi ne pas utiliser `Optional` en champ ni en paramètre ? Où est-il à sa place ?"
          }
        ]
      },
      {
        "id": "java-moderne",
        "title": "Java moderne : var, blocs de texte, record, sealed, motifs, java.time",
        "objective": "Écrire du Java récent avec discernement : savoir quand `var` aide et quand il nuit, produire du texte multiligne sans surprise, modéliser des données par des records validés, fermer une hiérarchie pour que le compilateur vérifie l'exhaustivité, traiter les cas par filtrage et expressions switch, et choisir le bon type de date.",
        "prerequisites": [
          "java-lambdas-streams"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "java-mod-l1",
            "title": "var : l'inférence locale, et ses limites"
          },
          {
            "kind": "mcq",
            "id": "java-mod-01",
            "difficulty": 1,
            "tags": [
              "java-moderne",
              "var"
            ],
            "prompt": "Que vaut le type de `x` après `var x = 1;` ?"
          },
          {
            "kind": "spot",
            "id": "java-mod-02",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "var"
            ],
            "prompt": "Une de ces déclarations ne compile pas. Laquelle, et pourquoi ?"
          },
          {
            "kind": "recall",
            "id": "java-mod-03",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "var"
            ],
            "prompt": "Où `var` est-il interdit, et pourquoi ces endroits précisément ?"
          },
          {
            "kind": "lesson",
            "id": "java-mod-l2",
            "title": "Les blocs de texte"
          },
          {
            "kind": "output",
            "id": "java-mod-04",
            "difficulty": 3,
            "tags": [
              "java-moderne",
              "text-blocks"
            ],
            "prompt": "Le délimiteur fermant est aligné sur « Bonjour ». Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-mod-05",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "text-blocks"
            ],
            "prompt": "Comment insérer la valeur d'une variable dans un bloc de texte ?"
          },
          {
            "kind": "recall",
            "id": "java-mod-06",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "text-blocks"
            ],
            "prompt": "Comment Java décide-t-il de l'indentation à retirer d'un bloc de texte ?"
          },
          {
            "kind": "lesson",
            "id": "java-mod-l3",
            "title": "record : le porteur de données"
          },
          {
            "kind": "mcq",
            "id": "java-mod-07",
            "difficulty": 1,
            "tags": [
              "java-moderne",
              "record"
            ],
            "prompt": "Comment lit-on le composant `x` d'un `record Point(int x, int y)` ?"
          },
          {
            "kind": "match",
            "id": "java-mod-08",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "record"
            ],
            "prompt": "Associe chaque besoin au type de déclaration approprié."
          },
          {
            "kind": "recall",
            "id": "java-mod-09",
            "difficulty": 3,
            "tags": [
              "java-moderne",
              "record"
            ],
            "prompt": "En quoi l'immuabilité d'un `record` est-elle superficielle, et comment y remédier ?"
          },
          {
            "kind": "lesson",
            "id": "java-mod-l4",
            "title": "record avancé : constructeur compact et invariants"
          },
          {
            "kind": "fill",
            "id": "java-mod-10",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "record"
            ],
            "prompt": "Complète le constructeur compact : validation puis copie défensive."
          },
          {
            "kind": "mcq",
            "id": "java-mod-11",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "record"
            ],
            "prompt": "Dans un constructeur compact, que fait `email = email.trim();` ?"
          },
          {
            "kind": "spot",
            "id": "java-mod-12",
            "difficulty": 3,
            "tags": [
              "java-moderne",
              "record"
            ],
            "prompt": "Ce record ne compile pas. Quelle ligne ?"
          },
          {
            "kind": "lesson",
            "id": "java-mod-l5",
            "title": "Les hiérarchies scellées"
          },
          {
            "kind": "mcq",
            "id": "java-mod-13",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "sealed"
            ],
            "prompt": "Quel est le bénéfice principal d'une interface `sealed` ?"
          },
          {
            "kind": "order",
            "id": "java-mod-14",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "sealed"
            ],
            "prompt": "Remets dans l'ordre ce qui se passe quand on ajoute un troisième cas à une hiérarchie scellée."
          },
          {
            "kind": "recall",
            "id": "java-mod-15",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "sealed"
            ],
            "prompt": "Quelles obligations pèsent sur les sous-types d'un type scellé ?"
          },
          {
            "kind": "lesson",
            "id": "java-mod-l6",
            "title": "Le filtrage par motif"
          },
          {
            "kind": "mcq",
            "id": "java-mod-16",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "pattern-matching"
            ],
            "prompt": "Après `if (!(o instanceof String s)) { return \"non\"; }`, la variable `s` est-elle utilisable à la ligne suivante ?"
          },
          {
            "kind": "fill",
            "id": "java-mod-17",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "pattern-matching"
            ],
            "prompt": "Complète le motif de record et la garde."
          },
          {
            "kind": "recall",
            "id": "java-mod-18",
            "difficulty": 3,
            "tags": [
              "java-moderne",
              "pattern-matching",
              "conception"
            ],
            "prompt": "Quand préférer le polymorphisme au filtrage par motif, et inversement ?"
          },
          {
            "kind": "lesson",
            "id": "java-mod-l7",
            "title": "switch : de l'instruction à l'expression"
          },
          {
            "kind": "output",
            "id": "java-mod-19",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "switch"
            ],
            "prompt": "Que produit cet appel ?"
          },
          {
            "kind": "mcq",
            "id": "java-mod-20",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "switch"
            ],
            "prompt": "Pourquoi éviter un `default` dans une expression `switch` portant sur une énumération ?"
          },
          {
            "kind": "match",
            "id": "java-mod-21",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "switch"
            ],
            "prompt": "Associe chaque élément de syntaxe à son rôle."
          },
          {
            "kind": "lesson",
            "id": "java-mod-l8",
            "title": "java.time : choisir le bon type"
          },
          {
            "kind": "output",
            "id": "java-mod-22",
            "difficulty": 3,
            "tags": [
              "java-moderne",
              "java-time"
            ],
            "prompt": "Dans la nuit du 28 au 29 mars 2026, la France passe à l'heure d'été. Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "java-mod-23",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "java-time"
            ],
            "prompt": "Quel type utiliser pour horodater la création d'une commande en base ?"
          },
          {
            "kind": "recall",
            "id": "java-mod-24",
            "difficulty": 2,
            "tags": [
              "java-moderne",
              "java-time"
            ],
            "prompt": "Quelle différence entre `Duration` et `Period`, et pourquoi les deux existent-ils ?"
          }
        ],
        "format": "detaille"
      },
      {
        "id": "java-concurrence",
        "title": "Concurrence : visibilité, verrous, exécuteurs et threads virtuels",
        "objective": "Raisonner sur du code concurrent : distinguer atomicité et visibilité, choisir entre volatile, classes atomiques et verrous, utiliser les collections concurrentes sans se tromper sur les opérations composées, dimensionner un exécuteur, composer sans bloquer, situer l'apport réel des threads virtuels et diagnostiquer un interblocage.",
        "prerequisites": [
          "java-lambdas-streams"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "java-conc-l1",
            "title": "Pourquoi c'est difficile : atomicité et visibilité"
          },
          {
            "kind": "output",
            "id": "java-conc-01",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "atomicite"
            ],
            "prompt": "Deux threads incrémentent 10 000 fois un compteur non synchronisé. Qu'observe-t-on ?"
          },
          {
            "kind": "mcq",
            "id": "java-conc-02",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "visibilite"
            ],
            "prompt": "Une boucle `while (!arret)` ne s'arrête jamais alors qu'un autre thread a mis `arret` à `true`. Pourquoi ?"
          },
          {
            "kind": "recall",
            "id": "java-conc-03",
            "difficulty": 2,
            "tags": [
              "concurrence"
            ],
            "prompt": "Quelles sont les deux garanties que la concurrence retire, et pourquoi les distinguer ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l2",
            "title": "synchronized et les verrous"
          },
          {
            "kind": "spot",
            "id": "java-conc-04",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "synchronized"
            ],
            "prompt": "Cette classe reste incorrecte malgré le `synchronized`. Quelle ligne ?"
          },
          {
            "kind": "mcq",
            "id": "java-conc-05",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "synchronized"
            ],
            "prompt": "Pourquoi préférer un verrou privé à `synchronized (this)` ?"
          },
          {
            "kind": "recall",
            "id": "java-conc-06",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "synchronized"
            ],
            "prompt": "Quand utiliser `ReentrantLock` plutôt que `synchronized` ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l3",
            "title": "volatile et les classes atomiques"
          },
          {
            "kind": "mcq",
            "id": "java-conc-07",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "volatile"
            ],
            "prompt": "Un champ `volatile int compteur` est incrémenté par plusieurs threads. Est-ce correct ?"
          },
          {
            "kind": "fill",
            "id": "java-conc-08",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "atomicite"
            ],
            "prompt": "Complète pour obtenir un compteur correct et non bloquant."
          },
          {
            "kind": "recall",
            "id": "java-conc-09",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "volatile"
            ],
            "prompt": "Dans quels cas `volatile` est-il le bon outil, et dans quels cas ne l'est-il pas ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l4",
            "title": "Les collections concurrentes"
          },
          {
            "kind": "spot",
            "id": "java-conc-10",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "collections"
            ],
            "prompt": "La map est bien une `ConcurrentHashMap`. Pourtant la valeur coûteuse est parfois calculée deux fois. Quelle ligne ?"
          },
          {
            "kind": "match",
            "id": "java-conc-11",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "collections"
            ],
            "prompt": "Associe chaque structure à son usage typique."
          },
          {
            "kind": "recall",
            "id": "java-conc-12",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "collections"
            ],
            "prompt": "Une `ConcurrentHashMap` rend-elle le code automatiquement correct ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l5",
            "title": "Les exécuteurs et les pools"
          },
          {
            "kind": "mcq",
            "id": "java-conc-13",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "executors"
            ],
            "prompt": "Pourquoi `Executors.newFixedThreadPool(8)` est-il risqué en production ?"
          },
          {
            "kind": "order",
            "id": "java-conc-14",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "executors"
            ],
            "prompt": "Remets dans l'ordre le cycle de vie d'une tâche soumise à un pool."
          },
          {
            "kind": "recall",
            "id": "java-conc-15",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "executors"
            ],
            "prompt": "Comment dimensionner un pool, et qu'est-ce que l'interblocage par épuisement de pool ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l6",
            "title": "CompletableFuture : composer sans bloquer"
          },
          {
            "kind": "mcq",
            "id": "java-conc-16",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "completable-future"
            ],
            "prompt": "Quelle méthode utiliser pour enchaîner une opération qui renvoie elle-même un `CompletableFuture` ?"
          },
          {
            "kind": "mcq",
            "id": "java-conc-17",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "completable-future"
            ],
            "prompt": "Pourquoi ne pas soumettre des appels réseau au pool commun par défaut ?"
          },
          {
            "kind": "recall",
            "id": "java-conc-18",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "completable-future"
            ],
            "prompt": "Qu'apporte `CompletableFuture` qu'un `Future` classique ne permet pas ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l7",
            "title": "Les threads virtuels"
          },
          {
            "kind": "mcq",
            "id": "java-conc-19",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "virtual-threads"
            ],
            "prompt": "Les threads virtuels suppriment-ils les problèmes de concurrence ?"
          },
          {
            "kind": "mcq",
            "id": "java-conc-20",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "virtual-threads"
            ],
            "prompt": "Une application passe à un thread virtuel par requête. Que faut-il surveiller ?"
          },
          {
            "kind": "recall",
            "id": "java-conc-21",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "virtual-threads"
            ],
            "prompt": "Qu'est-ce qu'un thread virtuel, et quelles pratiques faut-il revoir en l'adoptant ?"
          },
          {
            "kind": "lesson",
            "id": "java-conc-l8",
            "title": "Interblocages et diagnostic"
          },
          {
            "kind": "mcq",
            "id": "java-conc-22",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "deadlock"
            ],
            "prompt": "Quelle est la parade la plus fiable contre un interblocage à deux verrous ?"
          },
          {
            "kind": "order",
            "id": "java-conc-23",
            "difficulty": 2,
            "tags": [
              "concurrence",
              "diagnostic"
            ],
            "prompt": "L'application ne répond plus, sans erreur dans les journaux. Remets le diagnostic dans l'ordre."
          },
          {
            "kind": "recall",
            "id": "java-conc-24",
            "difficulty": 3,
            "tags": [
              "concurrence",
              "deadlock"
            ],
            "prompt": "Quelles conditions produisent un interblocage, et comment les briser ?"
          }
        ],
        "format": "detaille"
      }
    ]
  },
  {
    "id": "spring",
    "title": "Spring Boot",
    "description": "Le conteneur, l'API REST, la persistance JPA et les transactions.",
    "icon": "☘",
    "chapters": [
      {
        "id": "spring-ioc",
        "title": "IoC, beans, injection, scopes",
        "objective": "Comprendre ce que fait le conteneur, injecter par constructeur, choisir parmi plusieurs beans, maîtriser scopes et cycle de vie, et savoir ce que l'auto-configuration décide à votre place.",
        "prerequisites": [
          "java-interfaces-classes-abstraites"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "spring-ioc-l1",
            "title": "Inversion de contrôle : le conteneur construit vos objets"
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-01",
            "difficulty": 1,
            "tags": [
              "beans",
              "spring-ioc"
            ],
            "prompt": "Quelle est la différence entre `@Component` et `@Bean` ?"
          },
          {
            "kind": "output",
            "id": "spring-ioc-02",
            "difficulty": 2,
            "tags": [
              "component-scan",
              "beans"
            ],
            "prompt": "Que se passe-t-il au démarrage ?"
          },
          {
            "kind": "fill",
            "id": "spring-ioc-03",
            "difficulty": 1,
            "tags": [
              "beans",
              "cycle-de-vie"
            ],
            "prompt": "Complète pour que `Clock` soit un bean et que `init()` s'exécute après l'injection."
          },
          {
            "kind": "spot",
            "id": "spring-ioc-04",
            "difficulty": 2,
            "tags": [
              "injection",
              "conception"
            ],
            "prompt": "Ce code fonctionne, mais un relecteur le refuse. Trouve la ligne en cause."
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-05",
            "difficulty": 2,
            "tags": [
              "injection"
            ],
            "prompt": "Un `@Service` avec un seul constructeur à deux paramètres. Faut-il `@Autowired` dessus ?"
          },
          {
            "kind": "match",
            "id": "spring-ioc-06",
            "difficulty": 1,
            "tags": [
              "beans"
            ],
            "prompt": "Associe chaque annotation à son rôle."
          },
          {
            "kind": "recall",
            "id": "spring-ioc-07",
            "difficulty": 2,
            "tags": [
              "spring-ioc"
            ],
            "prompt": "Qu'est-ce que l'inversion de contrôle ? Que fait concrètement le conteneur Spring au démarrage ?"
          },
          {
            "kind": "order",
            "id": "spring-ioc-08",
            "difficulty": 2,
            "tags": [
              "cycle-de-vie",
              "spring-ioc"
            ],
            "prompt": "Remets dans l'ordre ce que fait le conteneur, du démarrage à l'arrêt."
          },
          {
            "kind": "lesson",
            "id": "spring-ioc-l2",
            "title": "Choisir parmi plusieurs beans, et éviter les cycles"
          },
          {
            "kind": "output",
            "id": "spring-ioc-09",
            "difficulty": 2,
            "tags": [
              "injection",
              "beans"
            ],
            "prompt": "Que se passe-t-il au démarrage ?"
          },
          {
            "kind": "fill",
            "id": "spring-ioc-10",
            "difficulty": 2,
            "tags": [
              "injection",
              "beans"
            ],
            "prompt": "Complète : `Alerts` doit recevoir le SMS, et l'e-mail doit être le choix par défaut partout ailleurs."
          },
          {
            "kind": "output",
            "id": "spring-ioc-11",
            "difficulty": 2,
            "tags": [
              "injection",
              "beans"
            ],
            "prompt": "Qu'affiche `broadcast.count()` ?"
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-12",
            "difficulty": 2,
            "tags": [
              "beans"
            ],
            "prompt": "Quel est le nom par défaut du bean `@Service class SmsNotifier` ?"
          },
          {
            "kind": "spot",
            "id": "spring-ioc-13",
            "difficulty": 2,
            "tags": [
              "dependances-circulaires",
              "injection"
            ],
            "prompt": "Le démarrage échoue avec `BeanCurrentlyInCreationException`. Trouve la ligne qui referme le cycle."
          },
          {
            "kind": "recall",
            "id": "spring-ioc-14",
            "difficulty": 2,
            "tags": [
              "injection",
              "conception"
            ],
            "prompt": "Pourquoi préférer l'injection par constructeur à l'injection par champ ?"
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-15",
            "difficulty": 2,
            "tags": [
              "dependances-circulaires"
            ],
            "prompt": "Sous Spring Boot 3, un cycle A ↔ B injecté par **champ** (`@Autowired`), pas par constructeur. Que se passe-t-il ?"
          },
          {
            "kind": "match",
            "id": "spring-ioc-16",
            "difficulty": 2,
            "tags": [
              "injection",
              "beans"
            ],
            "prompt": "Associe chaque mécanisme à son effet."
          },
          {
            "kind": "lesson",
            "id": "spring-ioc-l3",
            "title": "Singleton par défaut : un seul objet pour tout le monde"
          },
          {
            "kind": "output",
            "id": "spring-ioc-17",
            "difficulty": 2,
            "tags": [
              "scopes",
              "beans"
            ],
            "prompt": "Deux contrôleurs distincts reçoivent chacun un `Counter` par injection. Qu'affiche la dernière ligne ?"
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-18",
            "difficulty": 2,
            "tags": [
              "scopes"
            ],
            "prompt": "Un bean `@Scope(\"prototype\")` est injecté par constructeur dans un `@Service` singleton. Combien d'instances du prototype sont créées ?"
          },
          {
            "kind": "fill",
            "id": "spring-ioc-19",
            "difficulty": 2,
            "tags": [
              "scopes",
              "injection"
            ],
            "prompt": "Complète : `build()` doit obtenir un `ReportBuilder` neuf à chaque appel."
          },
          {
            "kind": "spot",
            "id": "spring-ioc-20",
            "difficulty": 2,
            "tags": [
              "cycle-de-vie"
            ],
            "prompt": "Le démarrage échoue. Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "spring-ioc-21",
            "difficulty": 2,
            "tags": [
              "cycle-de-vie",
              "scopes"
            ],
            "prompt": "Décris le cycle de vie d'un bean singleton, du démarrage à l'arrêt. Pourquoi ne pas faire le travail d'initialisation dans le constructeur ?"
          },
          {
            "kind": "order",
            "id": "spring-ioc-22",
            "difficulty": 2,
            "tags": [
              "cycle-de-vie"
            ],
            "prompt": "Remets dans l'ordre les étapes de la vie d'un bean singleton."
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-23",
            "difficulty": 2,
            "tags": [
              "scopes"
            ],
            "prompt": "Un bean `@RequestScope` est injecté dans un `@Service` singleton. Comment cela peut-il fonctionner ?"
          },
          {
            "kind": "lesson",
            "id": "spring-ioc-l4",
            "title": "Auto-configuration : des beans si, et seulement si"
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-24",
            "difficulty": 2,
            "tags": [
              "autoconfiguration",
              "beans"
            ],
            "prompt": "Tu déclares ton propre `@Bean ObjectMapper` dans une `@Configuration`. Que devient celui fourni par l'auto-configuration Jackson ?"
          },
          {
            "kind": "mcq",
            "id": "spring-ioc-25",
            "difficulty": 2,
            "tags": [
              "autoconfiguration",
              "starters"
            ],
            "prompt": "Que contient réellement `spring-boot-starter-web` ?"
          },
          {
            "kind": "fill",
            "id": "spring-ioc-26",
            "difficulty": 2,
            "tags": [
              "autoconfiguration"
            ],
            "prompt": "Complète : le client n'est créé que si la bibliothèque est présente et si l'application n'en définit pas ; puis l'application exclut cette auto-configuration."
          },
          {
            "kind": "spot",
            "id": "spring-ioc-27",
            "difficulty": 3,
            "tags": [
              "beans",
              "autoconfiguration"
            ],
            "prompt": "Deux `HttpClient` sont créés alors qu'on en voulait un seul, partagé. Trouve la ligne responsable."
          },
          {
            "kind": "recall",
            "id": "spring-ioc-28",
            "difficulty": 2,
            "tags": [
              "autoconfiguration"
            ],
            "prompt": "Comment fonctionne l'auto-configuration de Spring Boot, et comment en désactiver une ?"
          },
          {
            "kind": "recall",
            "id": "spring-ioc-29",
            "difficulty": 3,
            "tags": [
              "autoconfiguration",
              "beans"
            ],
            "prompt": "Explique `@ConditionalOnMissingBean` : pourquoi les auto-configurations l'utilisent, et pourquoi il ne faut pas s'y fier dans ses propres `@Configuration`."
          },
          {
            "kind": "match",
            "id": "spring-ioc-30",
            "difficulty": 1,
            "tags": [
              "starters"
            ],
            "prompt": "Associe chaque starter à ce qu'il apporte."
          }
        ]
      },
      {
        "id": "spring-configuration",
        "title": "Configuration : sources, profils, liaison typée et secrets",
        "objective": "Savoir d'où vient une valeur de configuration et laquelle gagne, écrire des fichiers YAML sans pièges, composer des profils, lier la configuration à des objets typés et validés au démarrage, tenir les secrets hors du dépôt et organiser le tout pour ne jamais se tromper d'environnement.",
        "prerequisites": [
          "spring-ioc"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "spring-conf-l1",
            "title": "D'où vient une valeur de configuration"
          },
          {
            "kind": "mcq",
            "id": "spring-conf-01",
            "difficulty": 1,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "L'application lit `app.timeout` = 30s alors que `application.yml` indique 5s. Par quoi commencer ?"
          },
          {
            "kind": "match",
            "id": "spring-conf-02",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Associe chaque type déclaré à ce que Spring sait convertir automatiquement."
          },
          {
            "kind": "recall",
            "id": "spring-conf-03",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Pourquoi Spring agrège-t-il plusieurs sources de configuration plutôt que de lire un seul fichier ?"
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l2",
            "title": "L'ordre de précédence : qui gagne"
          },
          {
            "kind": "order",
            "id": "spring-conf-04",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "precedence"
            ],
            "prompt": "Classe ces sources de la plus prioritaire à la moins prioritaire."
          },
          {
            "kind": "mcq",
            "id": "spring-conf-05",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "profils"
            ],
            "prompt": "Le profil `prod` est actif. `application.yml` définit `app.a=1` et `app.b=2`, `application-prod.yml` définit seulement `app.b=9`. Que vaut la configuration ?"
          },
          {
            "kind": "recall",
            "id": "spring-conf-06",
            "difficulty": 3,
            "tags": [
              "spring",
              "configuration",
              "precedence"
            ],
            "prompt": "Quelle règle simple permet de retrouver l'ordre de précédence sans le mémoriser ?"
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l3",
            "title": "YAML : structure, listes et pièges d'écriture"
          },
          {
            "kind": "fill",
            "id": "spring-conf-07",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "profils"
            ],
            "prompt": "Complète la clé d'activation de section et l'argument de lancement."
          },
          {
            "kind": "mcq",
            "id": "spring-conf-08",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "yaml"
            ],
            "prompt": "Pourquoi écrire `version: \"1.20\"` avec des guillemets plutôt que `version: 1.20` ?"
          },
          {
            "kind": "recall",
            "id": "spring-conf-09",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "yaml"
            ],
            "prompt": "Cite trois pièges d'écriture propres au format YAML dans une configuration Spring."
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l4",
            "title": "Les profils : activer le bon jeu de réglages"
          },
          {
            "kind": "mcq",
            "id": "spring-conf-10",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "profils"
            ],
            "prompt": "L'application est lancée avec `--spring.profiles.active=prod,metrics`. Que se passe-t-il ?"
          },
          {
            "kind": "spot",
            "id": "spring-conf-11",
            "difficulty": 3,
            "tags": [
              "spring",
              "configuration",
              "profils"
            ],
            "prompt": "Ce fichier `application-prod.yml` empêche l'application de démarrer. Quelle ligne ?"
          },
          {
            "kind": "recall",
            "id": "spring-conf-12",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "profils"
            ],
            "prompt": "Pourquoi préférer une valeur de configuration à un bean `@Profile` quand les deux sont possibles ?"
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l5",
            "title": "@Value ou @ConfigurationProperties"
          },
          {
            "kind": "fill",
            "id": "spring-conf-13",
            "difficulty": 1,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Complète la liaison typée de la configuration."
          },
          {
            "kind": "mcq",
            "id": "spring-conf-14",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Un `@Value` posé sur un champ privé vaut `null` dans le constructeur de la classe. Pourquoi ?"
          },
          {
            "kind": "recall",
            "id": "spring-conf-15",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Cite trois avantages de `@ConfigurationProperties` sur `@Value`."
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l6",
            "title": "Valider la configuration : échouer au démarrage"
          },
          {
            "kind": "output",
            "id": "spring-conf-16",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "validation"
            ],
            "prompt": "La classe est annotée `@Validated` avec `@Min(1)` sur `maxRetries`, et le YAML déclare `max-retries: -5`. Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "spring-conf-17",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "validation"
            ],
            "prompt": "Pour quelle propriété une valeur par défaut est-elle une mauvaise idée ?"
          },
          {
            "kind": "match",
            "id": "spring-conf-18",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "validation"
            ],
            "prompt": "Associe chaque besoin de validation au moyen approprié."
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l7",
            "title": "Les secrets : ce qui ne doit jamais être versionné"
          },
          {
            "kind": "spot",
            "id": "spring-conf-19",
            "difficulty": 1,
            "tags": [
              "spring",
              "configuration",
              "secrets"
            ],
            "prompt": "Ce fichier est sur le point d'être poussé sur le dépôt. Quelle ligne pose problème ?"
          },
          {
            "kind": "mcq",
            "id": "spring-conf-20",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "secrets"
            ],
            "prompt": "Un mot de passe de production a été poussé sur le dépôt il y a trois mois. Par quoi commencer ?"
          },
          {
            "kind": "recall",
            "id": "spring-conf-21",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration",
              "secrets"
            ],
            "prompt": "Pourquoi ne jamais passer un secret en argument de ligne de commande, alors que les variables d'environnement sont acceptables ?"
          },
          {
            "kind": "lesson",
            "id": "spring-conf-l8",
            "title": "Organiser sa configuration sans se tromper d'environnement"
          },
          {
            "kind": "mcq",
            "id": "spring-conf-22",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Que doit contenir un fichier `.env.example` versionné dans le dépôt ?"
          },
          {
            "kind": "match",
            "id": "spring-conf-23",
            "difficulty": 2,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Associe chaque contenu à l'endroit où il doit vivre."
          },
          {
            "kind": "order",
            "id": "spring-conf-24",
            "difficulty": 3,
            "tags": [
              "spring",
              "configuration"
            ],
            "prompt": "Une valeur inattendue en production : remets le diagnostic dans l'ordre."
          }
        ],
        "format": "detaille"
      },
      {
        "id": "spring-rest",
        "title": "REST : contrôleurs, DTO, validation, erreurs",
        "objective": "Écrire un contrôleur qui renvoie les bons codes HTTP, exposer des DTO plutôt que des entités, valider les entrées et centraliser les erreurs en ProblemDetail.",
        "prerequisites": [
          "spring-ioc"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "spring-rest-l1",
            "title": "Contrôleur, paramètres et codes de retour"
          },
          {
            "kind": "mcq",
            "id": "spring-rest-01",
            "difficulty": 1,
            "tags": [
              "rest",
              "controllers"
            ],
            "prompt": "Quelle est la différence entre `@Controller` et `@RestController` ?"
          },
          {
            "kind": "output",
            "id": "spring-rest-02",
            "difficulty": 2,
            "tags": [
              "rest",
              "codes-http"
            ],
            "prompt": "Que renvoie `GET /api/orders` sans paramètre ?"
          },
          {
            "kind": "match",
            "id": "spring-rest-03",
            "difficulty": 2,
            "tags": [
              "rest",
              "codes-http"
            ],
            "prompt": "Associe chaque situation au code HTTP correct."
          },
          {
            "kind": "fill",
            "id": "spring-rest-04",
            "difficulty": 1,
            "tags": [
              "rest",
              "controllers",
              "response-entity"
            ],
            "prompt": "Complète ce contrôleur de création."
          },
          {
            "kind": "spot",
            "id": "spring-rest-05",
            "difficulty": 2,
            "tags": [
              "rest",
              "controllers"
            ],
            "prompt": "L'appel `GET /api/orders/42` renvoie 500. Trouve la ligne fautive."
          },
          {
            "kind": "output",
            "id": "spring-rest-06",
            "difficulty": 2,
            "tags": [
              "rest",
              "codes-http",
              "response-entity"
            ],
            "prompt": "Que renvoie cette méthode quand `service.find(id)` renvoie un `Optional` vide ?"
          },
          {
            "kind": "recall",
            "id": "spring-rest-07",
            "difficulty": 2,
            "tags": [
              "rest",
              "codes-http"
            ],
            "prompt": "Quelle différence fais-tu entre les codes 400, 404, 409 et 422 ?"
          },
          {
            "kind": "mcq",
            "id": "spring-rest-08",
            "difficulty": 2,
            "tags": [
              "rest",
              "pagination"
            ],
            "prompt": "Un contrôleur reçoit un `Pageable` et l'appel est `GET /api/orders?page=1&size=20&sort=createdAt,desc`. Que reçoit le client ?"
          },
          {
            "kind": "lesson",
            "id": "spring-rest-l2",
            "title": "DTO plutôt qu'entité JPA"
          },
          {
            "kind": "mcq",
            "id": "spring-rest-09",
            "difficulty": 2,
            "tags": [
              "rest",
              "dto"
            ],
            "prompt": "Quel est le principal risque **technique** à renvoyer directement une entité JPA depuis un contrôleur ?"
          },
          {
            "kind": "output",
            "id": "spring-rest-10",
            "difficulty": 3,
            "tags": [
              "rest",
              "dto",
              "jackson"
            ],
            "prompt": "`Order` a une `List<Line> lines` et chaque `Line` un champ `Order order`, les deux avec getters. Le contrôleur renvoie l'entité `Order`. Que se passe-t-il ?"
          },
          {
            "kind": "fill",
            "id": "spring-rest-11",
            "difficulty": 1,
            "tags": [
              "rest",
              "dto",
              "record"
            ],
            "prompt": "Complète ce DTO de sortie."
          },
          {
            "kind": "spot",
            "id": "spring-rest-12",
            "difficulty": 2,
            "tags": [
              "rest",
              "dto",
              "securite"
            ],
            "prompt": "Ce endpoint de mise à jour permet à un client de s'attribuer le rôle administrateur. Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "spring-rest-13",
            "difficulty": 2,
            "tags": [
              "rest",
              "dto",
              "conception"
            ],
            "prompt": "Pourquoi ne jamais exposer une entité JPA dans une API, et pourquoi séparer aussi le DTO d'entrée du DTO de sortie ?"
          },
          {
            "kind": "mcq",
            "id": "spring-rest-14",
            "difficulty": 1,
            "tags": [
              "rest",
              "dto",
              "mapper"
            ],
            "prompt": "Quel est l'intérêt de MapStruct par rapport à un mapping écrit à la main ?"
          },
          {
            "kind": "order",
            "id": "spring-rest-15",
            "difficulty": 2,
            "tags": [
              "rest",
              "dto",
              "controllers"
            ],
            "prompt": "Remets dans l'ordre le traitement d'un `POST /api/orders`."
          },
          {
            "kind": "match",
            "id": "spring-rest-16",
            "difficulty": 2,
            "tags": [
              "rest",
              "dto"
            ],
            "prompt": "Associe chaque problème à sa cause quand une entité JPA est exposée."
          },
          {
            "kind": "lesson",
            "id": "spring-rest-l3",
            "title": "Valider les entrées avec jakarta.validation"
          },
          {
            "kind": "output",
            "id": "spring-rest-17",
            "difficulty": 2,
            "tags": [
              "rest",
              "validation"
            ],
            "prompt": "Le DTO porte `@NotBlank String customer`. Que renvoie un POST avec `{\"customer\": \"\"}` ?"
          },
          {
            "kind": "mcq",
            "id": "spring-rest-18",
            "difficulty": 2,
            "tags": [
              "rest",
              "validation"
            ],
            "prompt": "Quelle contrainte refuse à la fois `null`, `\"\"` et `\"   \"` ?"
          },
          {
            "kind": "spot",
            "id": "spring-rest-19",
            "difficulty": 2,
            "tags": [
              "rest",
              "validation"
            ],
            "prompt": "Les lignes de commande ne sont jamais validées individuellement. Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "spring-rest-20",
            "difficulty": 2,
            "tags": [
              "rest",
              "validation"
            ],
            "prompt": "Complète pour qu'une quantité absente ou négative soit rejetée en 400."
          },
          {
            "kind": "mcq",
            "id": "spring-rest-21",
            "difficulty": 3,
            "tags": [
              "rest",
              "validation",
              "conception"
            ],
            "prompt": "Où placer la règle « une commande ne peut pas dépasser le plafond de crédit du client » ?"
          },
          {
            "kind": "recall",
            "id": "spring-rest-22",
            "difficulty": 2,
            "tags": [
              "rest",
              "validation"
            ],
            "prompt": "Trois raisons pour lesquelles une annotation de validation peut être totalement ignorée en production. Lesquelles ?"
          },
          {
            "kind": "recall",
            "id": "spring-rest-23",
            "difficulty": 2,
            "tags": [
              "rest",
              "validation",
              "conception"
            ],
            "prompt": "Quelle frontière traces-tu entre validation de format et validation métier ?"
          },
          {
            "kind": "lesson",
            "id": "spring-rest-l4",
            "title": "Erreurs homogènes et sérialisation Jackson"
          },
          {
            "kind": "mcq",
            "id": "spring-rest-24",
            "difficulty": 1,
            "tags": [
              "rest",
              "exception-handling"
            ],
            "prompt": "À quoi sert `@RestControllerAdvice` ?"
          },
          {
            "kind": "output",
            "id": "spring-rest-25",
            "difficulty": 2,
            "tags": [
              "rest",
              "exception-handling",
              "codes-http"
            ],
            "prompt": "Sans aucun `@RestControllerAdvice`, que renvoie l'appel si `orElseThrow()` lève une `NoSuchElementException` ?"
          },
          {
            "kind": "fill",
            "id": "spring-rest-26",
            "difficulty": 2,
            "tags": [
              "rest",
              "exception-handling",
              "problem-detail"
            ],
            "prompt": "Complète ce gestionnaire global."
          },
          {
            "kind": "spot",
            "id": "spring-rest-27",
            "difficulty": 2,
            "tags": [
              "rest",
              "exception-handling",
              "securite"
            ],
            "prompt": "Ce gestionnaire expose la structure interne de l'application aux clients. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "spring-rest-28",
            "difficulty": 2,
            "tags": [
              "rest",
              "jackson"
            ],
            "prompt": "Associe chaque annotation Jackson à son effet."
          },
          {
            "kind": "recall",
            "id": "spring-rest-29",
            "difficulty": 2,
            "tags": [
              "rest",
              "problem-detail",
              "exception-handling"
            ],
            "prompt": "Qu'est-ce que `ProblemDetail`, et qu'apporte-t-il par rapport à un format d'erreur maison ?"
          },
          {
            "kind": "recall",
            "id": "spring-rest-30",
            "difficulty": 3,
            "tags": [
              "rest",
              "cors"
            ],
            "prompt": "Un front sur `localhost:5173` appelle une API sur `localhost:8080` et le navigateur bloque la réponse. Que se passe-t-il et comment le corriger ?"
          }
        ]
      },
      {
        "id": "spring-jpa",
        "title": "JPA : entités, relations, LAZY/EAGER, N+1",
        "objective": "Mapper une entité et ses relations sans surprise, choisir LAZY partout, reconnaître et corriger un N+1, et écrire des repositories Spring Data efficaces.",
        "prerequisites": [
          "spring-ioc",
          "java-equals-hashcode-comparable"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "spring-jpa-l1",
            "title": "L'entité JPA et la génération de l'identifiant"
          },
          {
            "kind": "mcq",
            "id": "spring-jpa-01",
            "difficulty": 1,
            "tags": [
              "jpa",
              "entites"
            ],
            "prompt": "Pourquoi une entité JPA doit-elle avoir un constructeur sans argument ?"
          },
          {
            "kind": "output",
            "id": "spring-jpa-02",
            "difficulty": 2,
            "tags": [
              "jpa",
              "generation-id",
              "batch"
            ],
            "prompt": "`hibernate.jdbc.batch_size` vaut 50. Que se passe-t-il à l'exécution ?"
          },
          {
            "kind": "fill",
            "id": "spring-jpa-03",
            "difficulty": 1,
            "tags": [
              "jpa",
              "entites",
              "generation-id"
            ],
            "prompt": "Complète pour une entité conforme à la spécification JPA, avec la stratégie de génération recommandée sur Postgres (compatible batch)."
          },
          {
            "kind": "spot",
            "id": "spring-jpa-04",
            "difficulty": 2,
            "tags": [
              "jpa",
              "enum",
              "entites"
            ],
            "prompt": "Après l'ajout de `PENDING` entre `NEW` et `PAID` dans l'enum, toutes les commandes déjà payées apparaissent `PENDING`. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "spring-jpa-05",
            "difficulty": 2,
            "tags": [
              "jpa",
              "generation-id"
            ],
            "prompt": "Pourquoi préférer `SEQUENCE` à `IDENTITY` sur Postgres ?"
          },
          {
            "kind": "match",
            "id": "spring-jpa-06",
            "difficulty": 1,
            "tags": [
              "jpa",
              "entites"
            ],
            "prompt": "Associe chaque annotation à son rôle."
          },
          {
            "kind": "recall",
            "id": "spring-jpa-07",
            "difficulty": 2,
            "tags": [
              "jpa",
              "entites"
            ],
            "prompt": "Quelles contraintes une classe doit-elle respecter pour être une entité Hibernate, et pourquoi chacune ?"
          },
          {
            "kind": "output",
            "id": "spring-jpa-08",
            "difficulty": 2,
            "tags": [
              "jpa",
              "flush",
              "spring-data"
            ],
            "prompt": "L'entité `Order` utilise `GenerationType.SEQUENCE`. Quand l'INSERT part-il ?"
          },
          {
            "kind": "lesson",
            "id": "spring-jpa-l2",
            "title": "Relations : qui porte la clé étrangère"
          },
          {
            "kind": "output",
            "id": "spring-jpa-09",
            "difficulty": 2,
            "tags": [
              "jpa",
              "relations",
              "mapped-by"
            ],
            "prompt": "`Order.items` est `@OneToMany(mappedBy = \"order\", cascade = ALL)`, `OrderItem.order` est `@ManyToOne @JoinColumn(name = \"order_id\")`. Que se passe-t-il à l'exécution ?"
          },
          {
            "kind": "spot",
            "id": "spring-jpa-10",
            "difficulty": 2,
            "tags": [
              "jpa",
              "relations",
              "mapped-by"
            ],
            "prompt": "L'application refuse de démarrer : « mappedBy reference an unknown target entity property ». Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "spring-jpa-11",
            "difficulty": 2,
            "tags": [
              "jpa",
              "relations",
              "mapped-by"
            ],
            "prompt": "Complète la relation bidirectionnelle et son helper de synchronisation."
          },
          {
            "kind": "mcq",
            "id": "spring-jpa-12",
            "difficulty": 2,
            "tags": [
              "jpa",
              "equals-hashcode",
              "entites"
            ],
            "prompt": "Une entité définit `equals` sur l'id et `hashCode()` comme `Objects.hash(id)`. Pourquoi un `HashSet<OrderItem>` perd-il des éléments ?"
          },
          {
            "kind": "recall",
            "id": "spring-jpa-13",
            "difficulty": 2,
            "tags": [
              "jpa",
              "relations",
              "mapped-by"
            ],
            "prompt": "Côté propriétaire et côté inverse d'une relation : lequel Hibernate écrit-il en base, et que se passe-t-il si tu ne renseignes qu'un seul côté ?"
          },
          {
            "kind": "match",
            "id": "spring-jpa-14",
            "difficulty": 2,
            "tags": [
              "jpa",
              "relations"
            ],
            "prompt": "Associe chaque déclaration à l'endroit où vit la clé étrangère."
          },
          {
            "kind": "mcq",
            "id": "spring-jpa-15",
            "difficulty": 2,
            "tags": [
              "jpa",
              "cascade",
              "orphan-removal"
            ],
            "prompt": "Quelle différence entre `cascade = CascadeType.REMOVE` et `orphanRemoval = true` ?"
          },
          {
            "kind": "output",
            "id": "spring-jpa-16",
            "difficulty": 3,
            "tags": [
              "jpa",
              "cascade",
              "orphan-removal"
            ],
            "prompt": "`Order.items` est `@OneToMany(mappedBy = \"order\", cascade = CascadeType.ALL)`, sans `orphanRemoval`. Que se passe-t-il au commit ?"
          },
          {
            "kind": "lesson",
            "id": "spring-jpa-l3",
            "title": "LAZY, EAGER et le problème N+1"
          },
          {
            "kind": "output",
            "id": "spring-jpa-17",
            "difficulty": 2,
            "tags": [
              "jpa",
              "n-plus-1",
              "lazy-vs-eager"
            ],
            "prompt": "`Order.customer` est `@ManyToOne(fetch = LAZY)`. La table contient 10 commandes, passées par 10 clients différents. Combien de requêtes SQL ?"
          },
          {
            "kind": "mcq",
            "id": "spring-jpa-18",
            "difficulty": 1,
            "tags": [
              "jpa",
              "lazy-vs-eager"
            ],
            "prompt": "Quelles associations sont `EAGER` par défaut en JPA ?"
          },
          {
            "kind": "spot",
            "id": "spring-jpa-19",
            "difficulty": 2,
            "tags": [
              "jpa",
              "n-plus-1",
              "lazy-vs-eager"
            ],
            "prompt": "`findByStatus` renvoie 200 commandes et déclenche 201 requêtes SQL. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "spring-jpa-20",
            "difficulty": 2,
            "tags": [
              "jpa",
              "n-plus-1",
              "join-fetch",
              "entity-graph"
            ],
            "prompt": "Complète les deux façons de charger les items avec la commande, en une seule requête."
          },
          {
            "kind": "output",
            "id": "spring-jpa-21",
            "difficulty": 3,
            "tags": [
              "jpa",
              "join-fetch",
              "multiple-bag-fetch"
            ],
            "prompt": "`items` et `payments` sont deux `List` en `@OneToMany`. Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "spring-jpa-22",
            "difficulty": 3,
            "tags": [
              "jpa",
              "n-plus-1",
              "join-fetch",
              "entity-graph"
            ],
            "prompt": "Comment détecter un N+1, et quelles sont les corrections possibles avec leurs limites ?"
          },
          {
            "kind": "order",
            "id": "spring-jpa-23",
            "difficulty": 2,
            "tags": [
              "jpa",
              "n-plus-1",
              "methode"
            ],
            "prompt": "Un endpoint devient lent quand les données grossissent. Remets dans l'ordre les étapes du diagnostic d'un N+1."
          },
          {
            "kind": "lesson",
            "id": "spring-jpa-l4",
            "title": "Spring Data JPA : repositories et requêtes"
          },
          {
            "kind": "mcq",
            "id": "spring-jpa-24",
            "difficulty": 1,
            "tags": [
              "spring-data",
              "query-methods"
            ],
            "prompt": "Quelle méthode Spring Data renvoie le client actif ayant cet email, s'il existe ?"
          },
          {
            "kind": "output",
            "id": "spring-jpa-25",
            "difficulty": 2,
            "tags": [
              "spring-data",
              "query-methods"
            ],
            "prompt": "L'entité `Customer` a un champ `email`. Que se passe-t-il ?"
          },
          {
            "kind": "spot",
            "id": "spring-jpa-26",
            "difficulty": 2,
            "tags": [
              "spring-data",
              "modifying"
            ],
            "prompt": "L'appel de `cancel(42L)` lève `InvalidDataAccessApiUsageException` (« Not supported for DML operations »). Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "spring-jpa-27",
            "difficulty": 2,
            "tags": [
              "spring-data",
              "query-methods",
              "modifying"
            ],
            "prompt": "Complète : un dépôt avec pagination et tri, une recherche dont le résultat peut être absent, et une requête de suppression."
          },
          {
            "kind": "match",
            "id": "spring-jpa-28",
            "difficulty": 1,
            "tags": [
              "spring-data",
              "query-methods"
            ],
            "prompt": "Associe chaque mot-clé de query method à sa traduction SQL."
          },
          {
            "kind": "recall",
            "id": "spring-jpa-29",
            "difficulty": 2,
            "tags": [
              "spring-data",
              "projection",
              "dto"
            ],
            "prompt": "Projection (interface ou DTO) plutôt qu'entité complète : quand et pourquoi ?"
          },
          {
            "kind": "recall",
            "id": "spring-jpa-30",
            "difficulty": 2,
            "tags": [
              "spring-data",
              "persistence-context",
              "merge"
            ],
            "prompt": "Que fait `repository.save(entity)` selon que l'entité est nouvelle ou déjà en base ? Quel piège avec la valeur de retour ?"
          }
        ]
      },
      {
        "id": "spring-transactions",
        "title": "Transactions et persistence context",
        "objective": "Savoir où et comment une transaction s'ouvre et se termine, prédire commit ou rollback, et raisonner sur l'état d'une entité pour ne plus perdre de modification ni subir de LazyInitializationException.",
        "prerequisites": [
          "spring-jpa"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "spring-tx-l1",
            "title": "@Transactional : un proxy, pas de la magie"
          },
          {
            "kind": "output",
            "id": "spring-tx-01",
            "difficulty": 3,
            "tags": [
              "transactions",
              "appel-interne",
              "proxy"
            ],
            "prompt": "`confirm` est annotée `@Transactional`, `confirmAll` ne l'est pas. `confirmAll` est appelée depuis un contrôleur. Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "spring-tx-02",
            "difficulty": 2,
            "tags": [
              "transactions",
              "architecture"
            ],
            "prompt": "Où placer `@Transactional` ?"
          },
          {
            "kind": "spot",
            "id": "spring-tx-03",
            "difficulty": 2,
            "tags": [
              "transactions",
              "proxy"
            ],
            "prompt": "Le rollback attendu n'a jamais lieu. Trouve la ligne fautive."
          },
          {
            "kind": "mcq",
            "id": "spring-tx-04",
            "difficulty": 2,
            "tags": [
              "transactions",
              "read-only"
            ],
            "prompt": "Que fait `@Transactional(readOnly = true)` ?"
          },
          {
            "kind": "fill",
            "id": "spring-tx-05",
            "difficulty": 2,
            "tags": [
              "transactions",
              "read-only",
              "rollback"
            ],
            "prompt": "Complète : une lecture optimisée, puis une écriture qui doit aussi faire rollback sur une exception checked."
          },
          {
            "kind": "recall",
            "id": "spring-tx-06",
            "difficulty": 2,
            "tags": [
              "transactions",
              "proxy",
              "appel-interne"
            ],
            "prompt": "Explique comment `@Transactional` fonctionne, pourquoi un appel interne n'est pas transactionnel, et comment contourner le problème."
          },
          {
            "kind": "match",
            "id": "spring-tx-07",
            "difficulty": 1,
            "tags": [
              "transactions",
              "proxy"
            ],
            "prompt": "Associe chaque emplacement de `@Transactional` à son effet."
          },
          {
            "kind": "output",
            "id": "spring-tx-08",
            "difficulty": 2,
            "tags": [
              "transactions",
              "rollback"
            ],
            "prompt": "`gateway` n'est pas un bean transactionnel et `charge` lève une `RuntimeException`. Que se passe-t-il ?"
          },
          {
            "kind": "lesson",
            "id": "spring-tx-l2",
            "title": "Propagation, isolation et règles de rollback"
          },
          {
            "kind": "output",
            "id": "spring-tx-09",
            "difficulty": 2,
            "tags": [
              "transactions",
              "rollback",
              "exceptions"
            ],
            "prompt": "`StockException` est une exception checked. `reserve` lève cette exception après le `save`. Que se passe-t-il ?"
          },
          {
            "kind": "output",
            "id": "spring-tx-10",
            "difficulty": 3,
            "tags": [
              "transactions",
              "rollback",
              "propagation"
            ],
            "prompt": "`notifier` est un autre bean, `@Transactional` par défaut (`REQUIRED`), et `notify` lève une `RuntimeException`. Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "spring-tx-11",
            "difficulty": 2,
            "tags": [
              "transactions",
              "propagation"
            ],
            "prompt": "Une ligne d'audit doit être conservée même si le traitement qui l'entoure fait rollback. Quelle propagation sur la méthode d'audit ?"
          },
          {
            "kind": "match",
            "id": "spring-tx-12",
            "difficulty": 1,
            "tags": [
              "transactions",
              "propagation"
            ],
            "prompt": "Associe chaque propagation à son comportement quand une transaction existe déjà."
          },
          {
            "kind": "spot",
            "id": "spring-tx-13",
            "difficulty": 2,
            "tags": [
              "transactions",
              "rollback",
              "exceptions"
            ],
            "prompt": "Quand le crédit échoue, le débit reste en base. Trouve la ligne fautive."
          },
          {
            "kind": "fill",
            "id": "spring-tx-14",
            "difficulty": 2,
            "tags": [
              "transactions",
              "propagation",
              "isolation"
            ],
            "prompt": "Complète : la méthode doit être appelée dans une transaction existante, avec le niveau d'isolation minimal qui évite les lectures non répétables."
          },
          {
            "kind": "recall",
            "id": "spring-tx-15",
            "difficulty": 2,
            "tags": [
              "transactions",
              "rollback",
              "exceptions"
            ],
            "prompt": "Quelles exceptions déclenchent un rollback par défaut, lesquelles non, et comment changer la règle ?"
          },
          {
            "kind": "order",
            "id": "spring-tx-16",
            "difficulty": 2,
            "tags": [
              "transactions",
              "proxy",
              "rollback"
            ],
            "prompt": "Une méthode `@Transactional` (REQUIRED, aucune transaction en cours) est appelée depuis un autre bean et lève une `RuntimeException`. Remets les événements dans l'ordre."
          },
          {
            "kind": "lesson",
            "id": "spring-tx-l3",
            "title": "Le persistence context : états, dirty checking, flush"
          },
          {
            "kind": "output",
            "id": "spring-tx-17",
            "difficulty": 2,
            "tags": [
              "persistence-context",
              "cache-premier-niveau"
            ],
            "prompt": "Combien de SELECT, et qu'affiche la dernière ligne ?"
          },
          {
            "kind": "output",
            "id": "spring-tx-18",
            "difficulty": 2,
            "tags": [
              "persistence-context",
              "dirty-checking"
            ],
            "prompt": "Aucun `save()` n'est appelé. Que se passe-t-il au commit ?"
          },
          {
            "kind": "output",
            "id": "spring-tx-19",
            "difficulty": 3,
            "tags": [
              "persistence-context",
              "detached",
              "transactions"
            ],
            "prompt": "Pas de `@Transactional` sur cette méthode de service. Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "spring-tx-20",
            "difficulty": 2,
            "tags": [
              "persistence-context",
              "merge"
            ],
            "prompt": "Que renvoie `entityManager.merge(detached)` ?"
          },
          {
            "kind": "spot",
            "id": "spring-tx-21",
            "difficulty": 2,
            "tags": [
              "persistence-context",
              "merge",
              "detached"
            ],
            "prompt": "Le nom en base est toujours l'ancien après cette méthode. Trouve la ligne responsable."
          },
          {
            "kind": "recall",
            "id": "spring-tx-22",
            "difficulty": 2,
            "tags": [
              "persistence-context",
              "cycle-de-vie-entite"
            ],
            "prompt": "Décris les quatre états d'une entité JPA et ce qui fait passer de l'un à l'autre."
          },
          {
            "kind": "order",
            "id": "spring-tx-23",
            "difficulty": 2,
            "tags": [
              "persistence-context",
              "flush",
              "dirty-checking"
            ],
            "prompt": "Une transaction contient des entités créées, modifiées et supprimées. Remets dans l'ordre ce qui se passe au commit."
          },
          {
            "kind": "lesson",
            "id": "spring-tx-l4",
            "title": "Cascade, LazyInitializationException et verrou optimiste"
          },
          {
            "kind": "output",
            "id": "spring-tx-24",
            "difficulty": 2,
            "tags": [
              "lazy-initialization-exception",
              "open-in-view"
            ],
            "prompt": "`spring.jpa.open-in-view` vaut `false`. `Order.items` est `@OneToMany` (LAZY). Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "spring-tx-25",
            "difficulty": 2,
            "tags": [
              "open-in-view",
              "lazy-initialization-exception"
            ],
            "prompt": "Qu'est-ce que open-in-view, pourquoi Spring Boot l'active par défaut, et pourquoi le désactiver ?"
          },
          {
            "kind": "spot",
            "id": "spring-tx-26",
            "difficulty": 2,
            "tags": [
              "cascade",
              "relations"
            ],
            "prompt": "Supprimer une commande supprime aussi son client, ou échoue sur une contrainte de clé étrangère. Trouve la ligne fautive."
          },
          {
            "kind": "output",
            "id": "spring-tx-27",
            "difficulty": 3,
            "tags": [
              "verrou-optimiste",
              "version"
            ],
            "prompt": "`Order` a un champ `@Version`. Deux transactions T1 et T2 chargent la même commande (version 3), la modifient, T1 commit, puis T2 commit. Que se passe-t-il pour T2 ?"
          },
          {
            "kind": "fill",
            "id": "spring-tx-28",
            "difficulty": 2,
            "tags": [
              "cascade",
              "orphan-removal",
              "version"
            ],
            "prompt": "Complète : verrou optimiste, et une composition dont les lignes sont persistées et supprimées avec la commande."
          },
          {
            "kind": "match",
            "id": "spring-tx-29",
            "difficulty": 1,
            "tags": [
              "persistence-context",
              "lazy-initialization-exception",
              "transactions"
            ],
            "prompt": "Associe chaque symptôme à sa cause la plus probable."
          },
          {
            "kind": "recall",
            "id": "spring-tx-30",
            "difficulty": 3,
            "tags": [
              "lazy-initialization-exception",
              "open-in-view",
              "join-fetch"
            ],
            "prompt": "`LazyInitializationException` : quelle est la cause exacte, pourquoi open-in-view la masque, et quelles sont les trois solutions propres ?"
          }
        ]
      },
      {
        "id": "spring-security",
        "title": "Sécurité : filtres, mots de passe, jetons, autorisation",
        "objective": "Configurer la sécurité d'une application Spring : comprendre la chaîne de filtres, stocker un mot de passe correctement, choisir entre session et jeton, valider un JWT, situer OAuth2 et OIDC, écrire des règles d'autorisation et décider du CSRF en connaissance de cause.",
        "prerequisites": [
          "spring-rest"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "spring-sec-l1",
            "title": "La sécurité est un filtre, pas une ligne dans le contrôleur"
          },
          {
            "kind": "mcq",
            "id": "spring-sec-01",
            "difficulty": 1,
            "tags": [
              "securite",
              "filtres"
            ],
            "prompt": "Pourquoi un `@RestControllerAdvice` ne rattrape-t-il pas une erreur 401 émise par Spring Security ?"
          },
          {
            "kind": "order",
            "id": "spring-sec-02",
            "difficulty": 2,
            "tags": [
              "securite",
              "filtres"
            ],
            "prompt": "Remets dans l'ordre le trajet d'une requête authentifiée."
          },
          {
            "kind": "recall",
            "id": "spring-sec-03",
            "difficulty": 2,
            "tags": [
              "securite",
              "filtres"
            ],
            "prompt": "Pourquoi place-t-on les règles d'URL de la plus spécifique à la plus générale ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l2",
            "title": "Authentication et SecurityContext : où vit l'identité"
          },
          {
            "kind": "mcq",
            "id": "spring-sec-04",
            "difficulty": 2,
            "tags": [
              "securite",
              "authentification"
            ],
            "prompt": "Dans une méthode annotée `@Async`, `SecurityContextHolder.getContext().getAuthentication()` renvoie `null`. Pourquoi ?"
          },
          {
            "kind": "fill",
            "id": "spring-sec-05",
            "difficulty": 1,
            "tags": [
              "securite",
              "authentification"
            ],
            "prompt": "Complète la lecture de l'utilisateur courant hors d'un contrôleur."
          },
          {
            "kind": "recall",
            "id": "spring-sec-06",
            "difficulty": 2,
            "tags": [
              "securite",
              "authentification"
            ],
            "prompt": "Que contient un objet `Authentication`, et lequel de ses éléments sert aux décisions d'autorisation ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l3",
            "title": "Stocker un mot de passe : BCrypt et le facteur de coût"
          },
          {
            "kind": "mcq",
            "id": "spring-sec-07",
            "difficulty": 2,
            "tags": [
              "securite",
              "mot-de-passe"
            ],
            "prompt": "Pourquoi `encoder.encode(\"secret\")` renvoie-t-il une chaîne différente à chaque appel ?"
          },
          {
            "kind": "spot",
            "id": "spring-sec-08",
            "difficulty": 2,
            "tags": [
              "securite",
              "mot-de-passe"
            ],
            "prompt": "Une faille s'est glissée dans cette inscription. Quelle ligne, et pourquoi ?"
          },
          {
            "kind": "recall",
            "id": "spring-sec-09",
            "difficulty": 3,
            "tags": [
              "securite",
              "mot-de-passe"
            ],
            "prompt": "Pourquoi SHA-256 est-il un mauvais choix pour stocker un mot de passe, alors que c'est une fonction de hachage solide ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l4",
            "title": "Session ou stateless : deux façons de se souvenir"
          },
          {
            "kind": "mcq",
            "id": "spring-sec-10",
            "difficulty": 2,
            "tags": [
              "securite",
              "session"
            ],
            "prompt": "Que fait exactement `SessionCreationPolicy.STATELESS` ?"
          },
          {
            "kind": "match",
            "id": "spring-sec-11",
            "difficulty": 2,
            "tags": [
              "securite",
              "session"
            ],
            "prompt": "Associe chaque élément à son rôle."
          },
          {
            "kind": "recall",
            "id": "spring-sec-12",
            "difficulty": 3,
            "tags": [
              "securite",
              "session",
              "jwt"
            ],
            "prompt": "Quel est le principal inconvénient d'une authentification par jeton auto-porteur, et comment le contourne-t-on en pratique ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l5",
            "title": "JWT : ce qu'il garantit, et ce qu'il ne garantit pas"
          },
          {
            "kind": "output",
            "id": "spring-sec-13",
            "difficulty": 2,
            "tags": [
              "securite",
              "jwt"
            ],
            "prompt": "Un attaquant a intercepté ce jeton et exécute ce code, sans connaître la clé de signature."
          },
          {
            "kind": "mcq",
            "id": "spring-sec-14",
            "difficulty": 3,
            "tags": [
              "securite",
              "jwt"
            ],
            "prompt": "Plusieurs services d'une même plateforme doivent vérifier les jetons émis par un serveur d'autorisation central. Quel algorithme de signature choisir ?"
          },
          {
            "kind": "recall",
            "id": "spring-sec-15",
            "difficulty": 2,
            "tags": [
              "securite",
              "jwt"
            ],
            "prompt": "Quelles vérifications, au-delà de la signature, un service doit-il faire sur un JWT reçu ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l6",
            "title": "OAuth2 et OIDC : déléguer l'authentification"
          },
          {
            "kind": "order",
            "id": "spring-sec-16",
            "difficulty": 3,
            "tags": [
              "securite",
              "oauth2"
            ],
            "prompt": "Remets dans l'ordre le flot du code d'autorisation avec PKCE."
          },
          {
            "kind": "match",
            "id": "spring-sec-17",
            "difficulty": 2,
            "tags": [
              "securite",
              "oauth2"
            ],
            "prompt": "Associe chaque rôle OAuth2 à sa définition."
          },
          {
            "kind": "mcq",
            "id": "spring-sec-18",
            "difficulty": 3,
            "tags": [
              "securite",
              "oidc"
            ],
            "prompt": "Une API reçoit un `ID token` OIDC dans l'en-tête `Authorization` et s'en sert pour autoriser l'accès. Qu'en penser ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l7",
            "title": "Autoriser : règles d'URL et sécurité de méthode"
          },
          {
            "kind": "fill",
            "id": "spring-sec-19",
            "difficulty": 1,
            "tags": [
              "securite",
              "autorisation"
            ],
            "prompt": "Complète pour que l'annotation d'autorisation soit prise en compte."
          },
          {
            "kind": "spot",
            "id": "spring-sec-20",
            "difficulty": 2,
            "tags": [
              "securite",
              "autorisation"
            ],
            "prompt": "Cette configuration ne protège pas ce qu'elle croit protéger. Quelle ligne ?"
          },
          {
            "kind": "mcq",
            "id": "spring-sec-21",
            "difficulty": 3,
            "tags": [
              "securite",
              "autorisation"
            ],
            "prompt": "Une méthode annotée `@PreAuthorize(\"hasRole('ADMIN')\")` s'exécute sans contrôle quand elle est appelée depuis une autre méthode de la même classe. Pourquoi ?"
          },
          {
            "kind": "lesson",
            "id": "spring-sec-l8",
            "title": "CSRF : pourquoi c'est activé, et quand le désactiver"
          },
          {
            "kind": "output",
            "id": "spring-sec-22",
            "difficulty": 2,
            "tags": [
              "securite",
              "csrf"
            ],
            "prompt": "Application Spring Boot avec sessions et configuration CSRF par défaut. L'utilisateur a une session ouverte ; la requête est envoyée sans jeton CSRF."
          },
          {
            "kind": "mcq",
            "id": "spring-sec-23",
            "difficulty": 2,
            "tags": [
              "securite",
              "csrf"
            ],
            "prompt": "Dans quel cas `csrf.disable()` est-il légitime ?"
          },
          {
            "kind": "recall",
            "id": "spring-sec-24",
            "difficulty": 3,
            "tags": [
              "securite",
              "csrf"
            ],
            "prompt": "Explique pourquoi un jeton CSRF protège, alors que le cookie de session, lui, ne protège pas."
          }
        ],
        "format": "detaille"
      }
    ]
  },
  {
    "id": "data",
    "title": "SQL et Postgres",
    "description": "Requêtes, jointures, modélisation, index et transactions.",
    "icon": "🐘",
    "chapters": [
      {
        "id": "data-sql-postgres",
        "title": "SQL et Postgres : jointures, index, EXPLAIN",
        "objective": "Écrire des requêtes justes malgré les NULL, utiliser agrégations et fonctions fenêtre, modéliser avec des contraintes et lire un plan d'exécution.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "data-sql-l1",
            "title": "Ordre d'évaluation et jointures"
          },
          {
            "kind": "output",
            "id": "data-sql-01",
            "difficulty": 2,
            "tags": [
              "sql",
              "jointures",
              "null"
            ],
            "prompt": "Table `clients` : (1, Ana), (2, Bob). Table `commandes` : (10, client 1, 'payee'). Que renvoie la requête ?"
          },
          {
            "kind": "output",
            "id": "data-sql-02",
            "difficulty": 3,
            "tags": [
              "sql",
              "null",
              "sous-requetes"
            ],
            "prompt": "Table `a` : x = 1, 2, 3. Table `b` : y = 1, NULL. Que renvoie la requête ?"
          },
          {
            "kind": "mcq",
            "id": "data-sql-03",
            "difficulty": 2,
            "tags": [
              "sql",
              "ordre-logique"
            ],
            "prompt": "Pourquoi `SELECT total * 2 AS double FROM t WHERE double > 10` échoue-t-il ?"
          },
          {
            "kind": "match",
            "id": "data-sql-04",
            "difficulty": 1,
            "tags": [
              "sql",
              "jointures"
            ],
            "prompt": "Associe chaque jointure à son résultat."
          },
          {
            "kind": "fill",
            "id": "data-sql-05",
            "difficulty": 2,
            "tags": [
              "sql",
              "jointures",
              "null"
            ],
            "prompt": "Complète pour lister les clients **sans aucune** commande."
          },
          {
            "kind": "spot",
            "id": "data-sql-06",
            "difficulty": 2,
            "tags": [
              "sql",
              "jointures"
            ],
            "prompt": "Cette requête renvoie beaucoup trop de lignes. Trouve la ligne fautive."
          },
          {
            "kind": "order",
            "id": "data-sql-07",
            "difficulty": 2,
            "tags": [
              "sql",
              "ordre-logique"
            ],
            "prompt": "Remets dans l'ordre les étapes logiques d'exécution d'une requête."
          },
          {
            "kind": "recall",
            "id": "data-sql-08",
            "difficulty": 2,
            "tags": [
              "sql",
              "null"
            ],
            "prompt": "Comment `NULL` se comporte-t-il dans les comparaisons, et quels pièges cela crée-t-il ?"
          },
          {
            "kind": "lesson",
            "id": "data-sql-l2",
            "title": "Agrégations, CTE et fonctions fenêtre"
          },
          {
            "kind": "output",
            "id": "data-sql-09",
            "difficulty": 2,
            "tags": [
              "sql",
              "agregations",
              "null"
            ],
            "prompt": "Table `notes` avec une colonne `note` valant 10, NULL, 20. Que renvoie la requête ?"
          },
          {
            "kind": "output",
            "id": "data-sql-10",
            "difficulty": 2,
            "tags": [
              "sql",
              "fonctions-fenetre"
            ],
            "prompt": "Trois lignes avec `score` valant 10, 10 et 8. Quels rangs produisent les trois fonctions, dans cet ordre ?"
          },
          {
            "kind": "mcq",
            "id": "data-sql-11",
            "difficulty": 2,
            "tags": [
              "sql",
              "agregations",
              "group-by"
            ],
            "prompt": "Où placer le critère « seulement les clients ayant plus de trois commandes » ?"
          },
          {
            "kind": "fill",
            "id": "data-sql-12",
            "difficulty": 2,
            "tags": [
              "sql",
              "fonctions-fenetre",
              "cte"
            ],
            "prompt": "Complète pour obtenir les trois plus grosses commandes **de chaque** client."
          },
          {
            "kind": "spot",
            "id": "data-sql-13",
            "difficulty": 2,
            "tags": [
              "sql",
              "group-by"
            ],
            "prompt": "Postgres refuse cette requête. Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "data-sql-14",
            "difficulty": 3,
            "tags": [
              "sql",
              "fonctions-fenetre",
              "group-by"
            ],
            "prompt": "Quelle différence fondamentale entre un `GROUP BY` et une fonction fenêtre ?"
          },
          {
            "kind": "match",
            "id": "data-sql-15",
            "difficulty": 2,
            "tags": [
              "sql",
              "fonctions-fenetre"
            ],
            "prompt": "Associe chaque fonction fenêtre à ce qu'elle produit."
          },
          {
            "kind": "recall",
            "id": "data-sql-16",
            "difficulty": 2,
            "tags": [
              "sql",
              "cte"
            ],
            "prompt": "À quoi sert une CTE, et que change `RECURSIVE` ?"
          },
          {
            "kind": "lesson",
            "id": "data-sql-l3",
            "title": "Modélisation, contraintes et types Postgres"
          },
          {
            "kind": "mcq",
            "id": "data-sql-17",
            "difficulty": 1,
            "tags": [
              "sql",
              "types"
            ],
            "prompt": "Quel type utiliser pour un montant en euros ?"
          },
          {
            "kind": "mcq",
            "id": "data-sql-18",
            "difficulty": 2,
            "tags": [
              "sql",
              "types"
            ],
            "prompt": "Quelle différence entre `timestamp` et `timestamptz` ?"
          },
          {
            "kind": "fill",
            "id": "data-sql-19",
            "difficulty": 2,
            "tags": [
              "sql",
              "upsert",
              "contraintes"
            ],
            "prompt": "Complète pour cumuler la quantité si le SKU existe déjà."
          },
          {
            "kind": "output",
            "id": "data-sql-20",
            "difficulty": 2,
            "tags": [
              "sql",
              "contraintes"
            ],
            "prompt": "La table a `email text UNIQUE`. Deux lignes sont insérées avec `email` valant `NULL`. Que se passe-t-il ?"
          },
          {
            "kind": "spot",
            "id": "data-sql-21",
            "difficulty": 2,
            "tags": [
              "sql",
              "normalisation",
              "modelisation"
            ],
            "prompt": "Ce schéma viole la première forme normale. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "data-sql-22",
            "difficulty": 1,
            "tags": [
              "sql",
              "contraintes"
            ],
            "prompt": "Associe chaque contrainte à ce qu'elle garantit."
          },
          {
            "kind": "recall",
            "id": "data-sql-23",
            "difficulty": 2,
            "tags": [
              "sql",
              "modelisation",
              "contraintes"
            ],
            "prompt": "Pourquoi poser des contraintes en base alors que l'application valide déjà ?"
          },
          {
            "kind": "lesson",
            "id": "data-sql-l4",
            "title": "Index, EXPLAIN et transactions"
          },
          {
            "kind": "mcq",
            "id": "data-sql-24",
            "difficulty": 2,
            "tags": [
              "sql",
              "index"
            ],
            "prompt": "Un index existe sur `(client_id, creee_le)`. Quelle requête ne peut **pas** l'utiliser efficacement ?"
          },
          {
            "kind": "spot",
            "id": "data-sql-25",
            "difficulty": 2,
            "tags": [
              "sql",
              "index",
              "explain"
            ],
            "prompt": "Un index existe sur `email`, mais la requête fait un `Seq Scan`. Trouve la ligne fautive."
          },
          {
            "kind": "output",
            "id": "data-sql-26",
            "difficulty": 2,
            "tags": [
              "sql",
              "explain"
            ],
            "prompt": "Que fait `EXPLAIN ANALYZE` sur un `DELETE` ?"
          },
          {
            "kind": "match",
            "id": "data-sql-27",
            "difficulty": 2,
            "tags": [
              "sql",
              "explain",
              "index"
            ],
            "prompt": "Associe chaque nœud d'un plan d'exécution à sa signification."
          },
          {
            "kind": "recall",
            "id": "data-sql-28",
            "difficulty": 3,
            "tags": [
              "sql",
              "index",
              "performance"
            ],
            "prompt": "Pourquoi ne pas indexer toutes les colonnes, et comment choisir les index utiles ?"
          },
          {
            "kind": "fill",
            "id": "data-sql-29",
            "difficulty": 2,
            "tags": [
              "sql",
              "transactions",
              "isolation"
            ],
            "prompt": "Complète pour réserver une ligne et empêcher toute modification concurrente."
          },
          {
            "kind": "recall",
            "id": "data-sql-30",
            "difficulty": 3,
            "tags": [
              "sql",
              "transactions",
              "isolation"
            ],
            "prompt": "Quels sont les niveaux d'isolation, quelles anomalies évitent-ils, et lequel Postgres applique-t-il par défaut ?"
          }
        ]
      }
    ]
  },
  {
    "id": "archi",
    "title": "Architecture",
    "description": "Ports et adapters, inversion de dépendance, SOLID.",
    "icon": "⬡",
    "chapters": [
      {
        "id": "archi-hexagonale",
        "title": "Architecture hexagonale : ports, adapters, SOLID",
        "objective": "Placer chaque classe dans la bonne couche, faire dépendre l'infrastructure du domaine et non l'inverse, et illustrer chaque principe SOLID par un exemple.",
        "prerequisites": [
          "spring-ioc"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "archi-hexa-l1",
            "title": "Ports & adapters : le domaine ne dépend de rien"
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-01",
            "difficulty": 1,
            "tags": [
              "hexagonal",
              "ports-adapters"
            ],
            "prompt": "Quel problème l'architecture hexagonale résout-elle en premier lieu ?"
          },
          {
            "kind": "spot",
            "id": "archi-hexa-02",
            "difficulty": 2,
            "tags": [
              "hexagonal",
              "domaine",
              "inversion-de-dependance"
            ],
            "prompt": "Cette classe est dans le package `domain`. Trouve la ligne qui viole la règle."
          },
          {
            "kind": "recall",
            "id": "archi-hexa-03",
            "difficulty": 2,
            "tags": [
              "hexagonal",
              "ports-adapters",
              "inversion-de-dependance"
            ],
            "prompt": "Explique ce qu'est un port, ce qu'est un adapter, et dans quel sens vont les dépendances."
          },
          {
            "kind": "match",
            "id": "archi-hexa-04",
            "difficulty": 1,
            "tags": [
              "hexagonal",
              "domaine"
            ],
            "prompt": "Associe chaque classe à sa couche."
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-05",
            "difficulty": 2,
            "tags": [
              "inversion-de-dependance",
              "ports-adapters"
            ],
            "prompt": "Qui définit l'interface `OrderRepository`, et pourquoi ?"
          },
          {
            "kind": "output",
            "id": "archi-hexa-06",
            "difficulty": 2,
            "tags": [
              "hexagonal",
              "archunit",
              "domaine"
            ],
            "prompt": "Que se passe-t-il quand ce test s'exécute, sachant que `com.shop.domain.Order` importe `com.shop.infrastructure.OrderEntity` ?"
          },
          {
            "kind": "fill",
            "id": "archi-hexa-07",
            "difficulty": 2,
            "tags": [
              "ports-adapters",
              "inversion-de-dependance"
            ],
            "prompt": "Complète : le port est dans le domaine, l'adapter dans l'infrastructure."
          },
          {
            "kind": "lesson",
            "id": "archi-hexa-l2",
            "title": "Entrant ou sortant, primaire ou secondaire"
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-08",
            "difficulty": 1,
            "tags": [
              "ports-adapters",
              "use-cases"
            ],
            "prompt": "Quelle est la différence entre un port entrant et un port sortant ?"
          },
          {
            "kind": "match",
            "id": "archi-hexa-09",
            "difficulty": 2,
            "tags": [
              "ports-adapters"
            ],
            "prompt": "Associe chaque adapter au port sur lequel il se branche."
          },
          {
            "kind": "spot",
            "id": "archi-hexa-10",
            "difficulty": 2,
            "tags": [
              "use-cases",
              "hexagonal"
            ],
            "prompt": "Ce use case viole une règle de la couche application. Trouve la ligne."
          },
          {
            "kind": "output",
            "id": "archi-hexa-11",
            "difficulty": 2,
            "tags": [
              "ports-adapters",
              "injection"
            ],
            "prompt": "Le port `OrderRepository` a deux implémentations, toutes deux annotées `@Component`. `PlaceOrderService` est un `@Service` qui reçoit `OrderRepository` par constructeur. Que se passe-t-il au démarrage ?"
          },
          {
            "kind": "recall",
            "id": "archi-hexa-12",
            "difficulty": 2,
            "tags": [
              "ports-adapters",
              "use-cases"
            ],
            "prompt": "Adapter primaire, adapter secondaire : définition, exemples, et comment les distinguer à coup sûr."
          },
          {
            "kind": "fill",
            "id": "archi-hexa-13",
            "difficulty": 2,
            "tags": [
              "ports-adapters",
              "injection"
            ],
            "prompt": "Complète le câblage : le use case reste sans annotation Spring, l'infrastructure l'instancie."
          },
          {
            "kind": "order",
            "id": "archi-hexa-14",
            "difficulty": 2,
            "tags": [
              "hexagonal",
              "ports-adapters"
            ],
            "prompt": "Remets dans l'ordre le trajet d'une requête `POST /orders` à travers l'hexagone."
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-15",
            "difficulty": 2,
            "tags": [
              "use-cases",
              "transactions"
            ],
            "prompt": "Où placer `@Transactional` dans une architecture hexagonale ?"
          },
          {
            "kind": "lesson",
            "id": "archi-hexa-l3",
            "title": "Mise en œuvre : packages, mapper, validation"
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-16",
            "difficulty": 2,
            "tags": [
              "mapper",
              "domaine",
              "jpa"
            ],
            "prompt": "Pourquoi séparer `Order` (domaine) et `OrderEntity` (JPA) plutôt qu'annoter directement la classe du domaine ?"
          },
          {
            "kind": "spot",
            "id": "archi-hexa-17",
            "difficulty": 2,
            "tags": [
              "domaine",
              "use-cases",
              "validation"
            ],
            "prompt": "Une règle métier est au mauvais endroit. Trouve la ligne."
          },
          {
            "kind": "fill",
            "id": "archi-hexa-18",
            "difficulty": 2,
            "tags": [
              "mapper",
              "jpa"
            ],
            "prompt": "Complète l'adapter JPA : il traduit dans les deux sens et ne laisse jamais sortir une entité."
          },
          {
            "kind": "output",
            "id": "archi-hexa-19",
            "difficulty": 2,
            "tags": [
              "domaine",
              "validation"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-20",
            "difficulty": 2,
            "tags": [
              "validation",
              "domaine",
              "rest"
            ],
            "prompt": "Où placer `@NotBlank @Email String email` et où placer « un client ne peut pas commander plus de 10 000 € sans validation manuelle » ?"
          },
          {
            "kind": "recall",
            "id": "archi-hexa-21",
            "difficulty": 2,
            "tags": [
              "transactions",
              "use-cases"
            ],
            "prompt": "Où va `@Transactional` dans un projet hexagonal, et pourquoi pas dans le domaine ni dans le contrôleur ?"
          },
          {
            "kind": "match",
            "id": "archi-hexa-22",
            "difficulty": 1,
            "tags": [
              "hexagonal",
              "domaine"
            ],
            "prompt": "Associe chaque package à ce qu'il contient."
          },
          {
            "kind": "recall",
            "id": "archi-hexa-23",
            "difficulty": 3,
            "tags": [
              "hexagonal",
              "conception"
            ],
            "prompt": "Quel est le coût de l'architecture hexagonale, et dans quels cas est-elle disproportionnée ?"
          },
          {
            "kind": "lesson",
            "id": "archi-hexa-l4",
            "title": "SOLID : cinq principes, un exemple chacun"
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-24",
            "difficulty": 1,
            "tags": [
              "solid",
              "srp"
            ],
            "prompt": "`InvoiceService` calcule le montant, génère le PDF et l'envoie par e-mail. Quel principe est violé, et comment le repérer ?"
          },
          {
            "kind": "spot",
            "id": "archi-hexa-25",
            "difficulty": 2,
            "tags": [
              "solid",
              "lsp"
            ],
            "prompt": "Ce code viole un principe SOLID. Trouve la ligne qui déclare le problème."
          },
          {
            "kind": "output",
            "id": "archi-hexa-26",
            "difficulty": 2,
            "tags": [
              "solid",
              "lsp"
            ],
            "prompt": "Avec les classes `Rectangle` et `Square` de la leçon, que se passe-t-il ?"
          },
          {
            "kind": "match",
            "id": "archi-hexa-27",
            "difficulty": 2,
            "tags": [
              "solid"
            ],
            "prompt": "Associe chaque principe à l'exemple qui l'illustre."
          },
          {
            "kind": "fill",
            "id": "archi-hexa-28",
            "difficulty": 1,
            "tags": [
              "solid",
              "dip",
              "injection"
            ],
            "prompt": "Complète pour respecter l'inversion de dépendance."
          },
          {
            "kind": "mcq",
            "id": "archi-hexa-29",
            "difficulty": 2,
            "tags": [
              "anti-patterns",
              "domaine"
            ],
            "prompt": "Des entités avec uniquement des getters/setters, et toute la logique dans des `@Service` : comment s'appelle ce schéma, et quel est le problème ?"
          },
          {
            "kind": "recall",
            "id": "archi-hexa-30",
            "difficulty": 2,
            "tags": [
              "solid"
            ],
            "prompt": "Énonce les cinq principes SOLID, chacun avec un exemple Java en une phrase."
          }
        ]
      }
    ]
  },
  {
    "id": "tests",
    "title": "Tests",
    "description": "TDD, JUnit 5, AssertJ, Mockito, tranches Spring et Testcontainers.",
    "icon": "🧪",
    "chapters": [
      {
        "id": "tests-tdd",
        "title": "TDD : cycle, JUnit 5, Mockito, Testcontainers",
        "objective": "Dérouler le cycle red/green/refactor, écrire des tests lisibles avec JUnit 5 et AssertJ, utiliser Mockito à bon escient et choisir la bonne tranche de test Spring.",
        "prerequisites": [
          "spring-ioc"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "tests-tdd-l1",
            "title": "Red, green, refactor : pourquoi l'ordre compte"
          },
          {
            "kind": "order",
            "id": "tests-tdd-01",
            "difficulty": 1,
            "tags": [
              "tdd",
              "red-green-refactor"
            ],
            "prompt": "Remets une itération de TDD dans l'ordre."
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-02",
            "difficulty": 2,
            "tags": [
              "tdd",
              "red-green-refactor"
            ],
            "prompt": "Pourquoi faut-il voir le test échouer avant d'écrire le code ?"
          },
          {
            "kind": "recall",
            "id": "tests-tdd-03",
            "difficulty": 2,
            "tags": [
              "tdd",
              "conception"
            ],
            "prompt": "En quoi le TDD change-t-il la conception du code, au-delà de la couverture de tests ?"
          },
          {
            "kind": "spot",
            "id": "tests-tdd-04",
            "difficulty": 2,
            "tags": [
              "tdd",
              "conception"
            ],
            "prompt": "Cette classe est impossible à tester sans base de données. Trouve la ligne fautive."
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-05",
            "difficulty": 2,
            "tags": [
              "tdd"
            ],
            "prompt": "Le test rouge passe dès la première exécution, avant d'écrire la moindre ligne de production. Que faut-il en conclure ?"
          },
          {
            "kind": "match",
            "id": "tests-tdd-06",
            "difficulty": 1,
            "tags": [
              "tdd",
              "red-green-refactor"
            ],
            "prompt": "Associe chaque étape du cycle à sa règle."
          },
          {
            "kind": "recall",
            "id": "tests-tdd-07",
            "difficulty": 2,
            "tags": [
              "tdd",
              "nommage"
            ],
            "prompt": "Comment structurer et nommer un test pour qu'il reste lisible six mois plus tard ?"
          },
          {
            "kind": "lesson",
            "id": "tests-tdd-l2",
            "title": "JUnit 5 et AssertJ"
          },
          {
            "kind": "spot",
            "id": "tests-tdd-08",
            "difficulty": 2,
            "tags": [
              "junit"
            ],
            "prompt": "Ce test échoue au démarrage avec une erreur d'initialisation. Trouve la ligne fautive."
          },
          {
            "kind": "output",
            "id": "tests-tdd-09",
            "difficulty": 2,
            "tags": [
              "junit"
            ],
            "prompt": "Combien de fois ce test s'exécute-t-il, et que vaut `compteur` au dernier passage ?"
          },
          {
            "kind": "fill",
            "id": "tests-tdd-10",
            "difficulty": 1,
            "tags": [
              "junit",
              "assertj"
            ],
            "prompt": "Complète ce test paramétré."
          },
          {
            "kind": "output",
            "id": "tests-tdd-11",
            "difficulty": 2,
            "tags": [
              "junit",
              "assertj"
            ],
            "prompt": "Que se passe-t-il si `new Cart(-1)` ne lève aucune exception ?"
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-12",
            "difficulty": 2,
            "tags": [
              "assertj"
            ],
            "prompt": "Quelle assertion vérifie que la liste contient exactement deux lignes, dont les références sont `A-1` et `B-2`, sans imposer l'ordre ?"
          },
          {
            "kind": "recall",
            "id": "tests-tdd-13",
            "difficulty": 2,
            "tags": [
              "junit",
              "assertj"
            ],
            "prompt": "Quel est l'intérêt d'AssertJ par rapport aux assertions natives de JUnit ?"
          },
          {
            "kind": "match",
            "id": "tests-tdd-14",
            "difficulty": 2,
            "tags": [
              "junit"
            ],
            "prompt": "Associe chaque annotation JUnit 5 à son rôle."
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-15",
            "difficulty": 1,
            "tags": [
              "junit"
            ],
            "prompt": "Un test vérifie trois propriétés d'un même objet et échoue sur la première. Comment voir aussi les deux autres ?"
          },
          {
            "kind": "lesson",
            "id": "tests-tdd-l3",
            "title": "Mockito : doubles, stubs et vérifications"
          },
          {
            "kind": "output",
            "id": "tests-tdd-16",
            "difficulty": 3,
            "tags": [
              "mockito"
            ],
            "prompt": "Que se passe-t-il à l'exécution de ce test ?"
          },
          {
            "kind": "spot",
            "id": "tests-tdd-17",
            "difficulty": 2,
            "tags": [
              "mockito"
            ],
            "prompt": "Ce test échoue avec `InvalidUseOfMatchersException`. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "tests-tdd-18",
            "difficulty": 2,
            "tags": [
              "mockito",
              "mock-vs-stub"
            ],
            "prompt": "Associe chaque type de double de test à sa définition."
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-19",
            "difficulty": 2,
            "tags": [
              "mockito",
              "conception"
            ],
            "prompt": "Que ne faut-il **pas** mocker ?"
          },
          {
            "kind": "fill",
            "id": "tests-tdd-20",
            "difficulty": 2,
            "tags": [
              "mockito",
              "argument-captor"
            ],
            "prompt": "Complète pour vérifier le contenu de l'objet réellement enregistré."
          },
          {
            "kind": "output",
            "id": "tests-tdd-21",
            "difficulty": 2,
            "tags": [
              "mockito"
            ],
            "prompt": "Que renvoie `repo.findById(\"x\")` si aucun stub n'a été déclaré sur ce mock ?"
          },
          {
            "kind": "recall",
            "id": "tests-tdd-22",
            "difficulty": 3,
            "tags": [
              "mockito",
              "conception"
            ],
            "prompt": "Quand vaut-il mieux écrire un fake en mémoire plutôt qu'empiler des mocks ?"
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-23",
            "difficulty": 2,
            "tags": [
              "mockito"
            ],
            "prompt": "Comment stuber une méthode qui retourne `void` pour qu'elle lève une exception ?"
          },
          {
            "kind": "lesson",
            "id": "tests-tdd-l4",
            "title": "Tests Spring : tranches et Testcontainers"
          },
          {
            "kind": "mcq",
            "id": "tests-tdd-24",
            "difficulty": 2,
            "tags": [
              "spring-test",
              "slices"
            ],
            "prompt": "Dans un `@WebMvcTest(OrderController.class)`, comment fournir le `OrderService` dont dépend le contrôleur ?"
          },
          {
            "kind": "output",
            "id": "tests-tdd-25",
            "difficulty": 2,
            "tags": [
              "spring-test",
              "slices"
            ],
            "prompt": "Deux tests d'une même classe `@DataJpaTest` : le premier enregistre une commande, le second compte les lignes. Que trouve le second ?"
          },
          {
            "kind": "spot",
            "id": "tests-tdd-26",
            "difficulty": 2,
            "tags": [
              "spring-test",
              "testcontainers"
            ],
            "prompt": "Ce test démarre un conteneur par méthode de test et devient très lent. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "tests-tdd-27",
            "difficulty": 2,
            "tags": [
              "spring-test",
              "slices"
            ],
            "prompt": "Associe chaque annotation de test Spring à ce qu'elle charge."
          },
          {
            "kind": "fill",
            "id": "tests-tdd-28",
            "difficulty": 2,
            "tags": [
              "spring-test",
              "mockmvc"
            ],
            "prompt": "Complète ce test de contrôleur."
          },
          {
            "kind": "recall",
            "id": "tests-tdd-29",
            "difficulty": 2,
            "tags": [
              "spring-test",
              "testcontainers"
            ],
            "prompt": "Pourquoi préférer Testcontainers à une base H2 embarquée pour les tests d'intégration ?"
          },
          {
            "kind": "recall",
            "id": "tests-tdd-30",
            "difficulty": 3,
            "tags": [
              "spring-test",
              "slices",
              "conception"
            ],
            "prompt": "Comment répartis-tu tes tests entre unitaires, tranches Spring et bout en bout ?"
          }
        ]
      }
    ]
  },
  {
    "id": "docker",
    "title": "Docker",
    "description": "Images, Dockerfile, build multi-stage et compose.",
    "icon": "🐳",
    "chapters": [
      {
        "id": "docker-bases",
        "title": "Images, Dockerfile, multi-stage, compose",
        "objective": "Lancer et diagnostiquer un conteneur, écrire un Dockerfile Java qui exploite le cache et tourne sans root, et monter une stack app + Postgres avec Compose.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "docker-l1",
            "title": "Image, conteneur, volume, réseau : les quatre objets"
          },
          {
            "kind": "mcq",
            "id": "docker-01",
            "difficulty": 1,
            "tags": [
              "docker",
              "images",
              "conteneurs"
            ],
            "prompt": "Quelle est la relation entre une image et un conteneur ?"
          },
          {
            "kind": "output",
            "id": "docker-02",
            "difficulty": 2,
            "tags": [
              "docker",
              "conteneurs",
              "ports"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "match",
            "id": "docker-03",
            "difficulty": 1,
            "tags": [
              "docker",
              "commandes"
            ],
            "prompt": "Associe chaque commande à son effet."
          },
          {
            "kind": "mcq",
            "id": "docker-04",
            "difficulty": 2,
            "tags": [
              "docker",
              "conteneurs",
              "vm"
            ],
            "prompt": "Pourquoi un conteneur démarre-t-il en quelques millisecondes là où une VM prend des dizaines de secondes ?"
          },
          {
            "kind": "spot",
            "id": "docker-05",
            "difficulty": 2,
            "tags": [
              "docker",
              "conteneurs",
              "commandes"
            ],
            "prompt": "Ce script échoue. Trouve la ligne responsable."
          },
          {
            "kind": "recall",
            "id": "docker-06",
            "difficulty": 1,
            "tags": [
              "docker",
              "images",
              "conteneurs",
              "volumes"
            ],
            "prompt": "Définis image, conteneur, volume et réseau en une phrase chacun, et dis ce qui disparaît quand on supprime un conteneur."
          },
          {
            "kind": "output",
            "id": "docker-07",
            "difficulty": 2,
            "tags": [
              "docker",
              "conteneurs",
              "commandes"
            ],
            "prompt": "Que se passe-t-il ?"
          },
          {
            "kind": "fill",
            "id": "docker-08",
            "difficulty": 1,
            "tags": [
              "docker",
              "commandes",
              "ports"
            ],
            "prompt": "Complète pour lancer Postgres en arrière-plan, accessible sur le port 5432 de l'hôte, avec un mot de passe."
          },
          {
            "kind": "lesson",
            "id": "docker-l2",
            "title": "Dockerfile : instructions, couches et cache de build"
          },
          {
            "kind": "output",
            "id": "docker-09",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "couches",
              "cache-de-build"
            ],
            "prompt": "Un premier build a réussi. On modifie un fichier dans `src/` puis on relance `docker build`. Que se passe-t-il ?"
          },
          {
            "kind": "output",
            "id": "docker-10",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "entrypoint-cmd"
            ],
            "prompt": "Quelle commande s'exécute dans le conteneur ?"
          },
          {
            "kind": "mcq",
            "id": "docker-11",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "env-arg"
            ],
            "prompt": "Quelle différence entre `ARG` et `ENV` dans un Dockerfile ?"
          },
          {
            "kind": "spot",
            "id": "docker-12",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "cache-de-build",
              "couches"
            ],
            "prompt": "Ce Dockerfile fonctionne, mais chaque modification d'un fichier source retélécharge toutes les dépendances Maven. Trouve la ligne responsable."
          },
          {
            "kind": "order",
            "id": "docker-13",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "cache-de-build"
            ],
            "prompt": "Remets ces instructions dans l'ordre qui exploite le mieux le cache de build."
          },
          {
            "kind": "fill",
            "id": "docker-14",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "env-arg"
            ],
            "prompt": "Complète : la version est passée au build par `--build-arg`, les options JVM doivent être visibles à l'exécution, et le port écouté est documenté."
          },
          {
            "kind": "recall",
            "id": "docker-15",
            "difficulty": 2,
            "tags": [
              "dockerfile",
              "couches",
              "cache-de-build"
            ],
            "prompt": "Explique le cache de build par couches, et pourquoi on copie `pom.xml` avant `src/`."
          },
          {
            "kind": "mcq",
            "id": "docker-16",
            "difficulty": 1,
            "tags": [
              "dockerfile",
              "ports"
            ],
            "prompt": "Le Dockerfile contient `EXPOSE 8080`. Après `docker run -d shop`, l'application répond-elle sur `localhost:8080` ?"
          },
          {
            "kind": "lesson",
            "id": "docker-l3",
            "title": "Une image Java propre : multi-stage, non-root, JVM sous contrainte"
          },
          {
            "kind": "output",
            "id": "docker-17",
            "difficulty": 2,
            "tags": [
              "images",
              "alpine",
              "dockerfile"
            ],
            "prompt": "Que se passe-t-il au `docker build` ?"
          },
          {
            "kind": "mcq",
            "id": "docker-18",
            "difficulty": 1,
            "tags": [
              "multi-stage",
              "images"
            ],
            "prompt": "Quel est l'intérêt principal d'un build multi-stage pour une application Java ?"
          },
          {
            "kind": "spot",
            "id": "docker-19",
            "difficulty": 3,
            "tags": [
              "jvm-en-conteneur",
              "dockerfile"
            ],
            "prompt": "Ce conteneur, lancé avec `--memory=1g`, est tué régulièrement par l'OOM killer. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "docker-20",
            "difficulty": 2,
            "tags": [
              "multi-stage",
              "non-root",
              "dockerfile"
            ],
            "prompt": "Complète ce build multi-stage avec un utilisateur non-root."
          },
          {
            "kind": "recall",
            "id": "docker-21",
            "difficulty": 2,
            "tags": [
              "jvm-en-conteneur"
            ],
            "prompt": "Comment la JVM se comporte-t-elle face à la limite mémoire d'un conteneur, et comment la configurer correctement ?"
          },
          {
            "kind": "match",
            "id": "docker-22",
            "difficulty": 2,
            "tags": [
              "images",
              "alpine",
              "distroless"
            ],
            "prompt": "Associe chaque image de base à sa caractéristique."
          },
          {
            "kind": "mcq",
            "id": "docker-23",
            "difficulty": 2,
            "tags": [
              "images",
              "couches",
              "layered-jars"
            ],
            "prompt": "Pourquoi extraire un jar Spring Boot en couches (`dependencies`, `spring-boot-loader`, `snapshot-dependencies`, `application`) plutôt que copier le jar entier ?"
          },
          {
            "kind": "lesson",
            "id": "docker-l4",
            "title": "Compose : l'application et sa base en une commande"
          },
          {
            "kind": "output",
            "id": "docker-24",
            "difficulty": 2,
            "tags": [
              "compose",
              "healthcheck"
            ],
            "prompt": "Que se passe-t-il au premier `docker compose up` sur une machine où l'image Postgres n'est pas encore téléchargée ?"
          },
          {
            "kind": "fill",
            "id": "docker-25",
            "difficulty": 2,
            "tags": [
              "compose",
              "healthcheck",
              "volumes"
            ],
            "prompt": "Complète pour que l'app attende que Postgres réponde, et que les données survivent à un `down`."
          },
          {
            "kind": "spot",
            "id": "docker-26",
            "difficulty": 2,
            "tags": [
              "compose",
              "reseau"
            ],
            "prompt": "L'application ne parvient jamais à joindre la base. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "docker-27",
            "difficulty": 1,
            "tags": [
              "compose",
              "volumes"
            ],
            "prompt": "Avec un volume nommé `pgdata` pour Postgres, que devient la base après `docker compose down` puis `docker compose up -d` ?"
          },
          {
            "kind": "recall",
            "id": "docker-28",
            "difficulty": 2,
            "tags": [
              "compose",
              "volumes",
              "persistance"
            ],
            "prompt": "Pourquoi déclarer un volume nommé pour Postgres dans Compose, et que se passe-t-il sans ?"
          },
          {
            "kind": "match",
            "id": "docker-29",
            "difficulty": 1,
            "tags": [
              "compose"
            ],
            "prompt": "Associe chaque clé Compose à son rôle."
          },
          {
            "kind": "recall",
            "id": "docker-30",
            "difficulty": 2,
            "tags": [
              "compose",
              "healthcheck",
              "reseau"
            ],
            "prompt": "Comment garantir que l'application ne démarre qu'une fois Postgres prêt à accepter des connexions ?"
          }
        ]
      }
    ]
  },
  {
    "id": "react",
    "title": "React",
    "description": "Composants, hooks, état et re-renders.",
    "icon": "⚛",
    "chapters": [
      {
        "id": "react-js-ts",
        "title": "JavaScript moderne et TypeScript",
        "objective": "Maîtriser les bases sur lesquelles React repose : portée et immuabilité, déstructuration et copies, this et fonctions fléchées, modules, boucle d'événements, promesses et async/await, typage structurel, et l'usage juste de any, unknown et never.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "react-jsts-l1",
            "title": "Portée, const et let"
          },
          {
            "kind": "output",
            "id": "react-jsts-01",
            "difficulty": 2,
            "tags": [
              "javascript",
              "portee"
            ],
            "prompt": "Qu'affiche ce code, dans l'ordre ?"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-02",
            "difficulty": 1,
            "tags": [
              "javascript",
              "portee"
            ],
            "prompt": "`const config = { debug: false };` puis `config.debug = true;`. Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "react-jsts-03",
            "difficulty": 2,
            "tags": [
              "javascript",
              "portee",
              "react"
            ],
            "prompt": "Pourquoi ne jamais modifier un état React en place, et quel est le lien avec `const` ?"
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l2",
            "title": "Déstructuration, diffusion et reste"
          },
          {
            "kind": "fill",
            "id": "react-jsts-04",
            "difficulty": 1,
            "tags": [
              "javascript",
              "destructuration"
            ],
            "prompt": "Complète : extraire `label`, regrouper le reste, et produire une copie modifiée."
          },
          {
            "kind": "mcq",
            "id": "react-jsts-05",
            "difficulty": 2,
            "tags": [
              "javascript",
              "immuabilite",
              "react"
            ],
            "prompt": "`const copie = { ...etat };` puis `copie.adresse.ville = \"Lyon\";`. Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "react-jsts-06",
            "difficulty": 2,
            "tags": [
              "javascript",
              "destructuration"
            ],
            "prompt": "Quand une valeur par défaut de déstructuration s'applique-t-elle ?"
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l3",
            "title": "Fonctions fléchées et this"
          },
          {
            "kind": "output",
            "id": "react-jsts-07",
            "difficulty": 3,
            "tags": [
              "javascript",
              "this"
            ],
            "prompt": "Dans un module ES, donc en mode strict. Qu'affiche ce code ?"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-08",
            "difficulty": 2,
            "tags": [
              "javascript",
              "this"
            ],
            "prompt": "Que renvoie `const f = () => { a: 1 }; f();` ?"
          },
          {
            "kind": "recall",
            "id": "react-jsts-09",
            "difficulty": 2,
            "tags": [
              "javascript",
              "this"
            ],
            "prompt": "En quoi le `this` d'une fonction fléchée diffère-t-il de celui d'une fonction ordinaire ?"
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l4",
            "title": "Les modules ES"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-10",
            "difficulty": 2,
            "tags": [
              "javascript",
              "modules"
            ],
            "prompt": "Pourquoi `import { x } from \"./m\"` est-il interdit à l'intérieur d'un `if` ?"
          },
          {
            "kind": "match",
            "id": "react-jsts-11",
            "difficulty": 2,
            "tags": [
              "javascript",
              "modules"
            ],
            "prompt": "Associe chaque forme d'import à ce qu'elle permet."
          },
          {
            "kind": "recall",
            "id": "react-jsts-12",
            "difficulty": 2,
            "tags": [
              "javascript",
              "modules"
            ],
            "prompt": "Quels problèmes un import circulaire provoque-t-il, et comment le résoudre ?"
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l5",
            "title": "La boucle d'événements"
          },
          {
            "kind": "output",
            "id": "react-jsts-13",
            "difficulty": 3,
            "tags": [
              "javascript",
              "asynchrone"
            ],
            "prompt": "Dans quel ordre ces lignes s'affichent-elles ?"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-14",
            "difficulty": 2,
            "tags": [
              "javascript",
              "asynchrone"
            ],
            "prompt": "Un calcul de deux secondes fige l'interface. Quelle est la bonne solution ?"
          },
          {
            "kind": "order",
            "id": "react-jsts-15",
            "difficulty": 2,
            "tags": [
              "javascript",
              "asynchrone"
            ],
            "prompt": "Remets dans l'ordre ce que fait la boucle d'événements à chaque tour."
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l6",
            "title": "Promesses et async/await"
          },
          {
            "kind": "spot",
            "id": "react-jsts-16",
            "difficulty": 2,
            "tags": [
              "javascript",
              "asynchrone",
              "performance"
            ],
            "prompt": "Ces trois appels sont indépendants et prennent 300 ms chacun. Quelle ligne rend le total de 900 ms ?"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-17",
            "difficulty": 2,
            "tags": [
              "javascript",
              "asynchrone"
            ],
            "prompt": "Quelle différence entre `Promise.all` et `Promise.allSettled` ?"
          },
          {
            "kind": "recall",
            "id": "react-jsts-18",
            "difficulty": 2,
            "tags": [
              "javascript",
              "asynchrone"
            ],
            "prompt": "Quand une promesse commence-t-elle son travail, et quelle conséquence ?"
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l7",
            "title": "TypeScript : typage structurel et inférence"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-19",
            "difficulty": 2,
            "tags": [
              "typescript"
            ],
            "prompt": "Deux types `Point` et `Vecteur` déclarent tous deux `{ x: number; y: number }`. Un `Point` est-il assignable à un `Vecteur` ?"
          },
          {
            "kind": "match",
            "id": "react-jsts-20",
            "difficulty": 2,
            "tags": [
              "typescript"
            ],
            "prompt": "Associe chaque situation à la bonne pratique d'annotation."
          },
          {
            "kind": "recall",
            "id": "react-jsts-21",
            "difficulty": 2,
            "tags": [
              "typescript"
            ],
            "prompt": "Pourquoi `await r.json() as Client` est-il dangereux ?"
          },
          {
            "kind": "lesson",
            "id": "react-jsts-l8",
            "title": "any, unknown, never et le typage sûr"
          },
          {
            "kind": "fill",
            "id": "react-jsts-22",
            "difficulty": 2,
            "tags": [
              "typescript"
            ],
            "prompt": "Complète : typer sûrement une réponse réseau, et écrire le garde de type."
          },
          {
            "kind": "spot",
            "id": "react-jsts-23",
            "difficulty": 2,
            "tags": [
              "typescript"
            ],
            "prompt": "Cette ligne fait perdre la vérification de type à toute la suite. Laquelle ?"
          },
          {
            "kind": "mcq",
            "id": "react-jsts-24",
            "difficulty": 3,
            "tags": [
              "typescript"
            ],
            "prompt": "À quoi sert `const _exhaustif: never = f;` dans le `default` d'un `switch` sur une union ?"
          }
        ],
        "format": "detaille"
      },
      {
        "id": "react-hooks",
        "title": "React : hooks, état, re-renders",
        "objective": "Raisonner en rendus : état-photo, immuabilité, useEffect et ses dépendances, ce qui déclenche un re-render, et où placer l'état.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "react-hooks-l1",
            "title": "useState : l'état est une photo du rendu"
          },
          {
            "kind": "output",
            "id": "react-hooks-01",
            "difficulty": 2,
            "tags": [
              "react",
              "use-state",
              "re-render"
            ],
            "prompt": "Après un clic, qu'affiche le bouton ?"
          },
          {
            "kind": "fill",
            "id": "react-hooks-02",
            "difficulty": 1,
            "tags": [
              "react",
              "use-state",
              "immuabilite"
            ],
            "prompt": "Complète pour mettre à jour la liste sans la muter."
          },
          {
            "kind": "output",
            "id": "react-hooks-03",
            "difficulty": 2,
            "tags": [
              "react",
              "use-state",
              "immuabilite",
              "re-render"
            ],
            "prompt": "Après un clic, qu'affiche le bouton ?"
          },
          {
            "kind": "mcq",
            "id": "react-hooks-04",
            "difficulty": 2,
            "tags": [
              "react",
              "use-state",
              "re-render"
            ],
            "prompt": "Pourquoi dit-on que `setState` est « asynchrone » ?"
          },
          {
            "kind": "spot",
            "id": "react-hooks-05",
            "difficulty": 2,
            "tags": [
              "react",
              "use-state",
              "immuabilite"
            ],
            "prompt": "Le clic n'affiche jamais le nouvel âge. Trouve la ligne responsable."
          },
          {
            "kind": "output",
            "id": "react-hooks-06",
            "difficulty": 2,
            "tags": [
              "react",
              "use-state",
              "re-render"
            ],
            "prompt": "Hors StrictMode, après un clic, que loggue la console et qu'affiche le bouton ?"
          },
          {
            "kind": "recall",
            "id": "react-hooks-07",
            "difficulty": 2,
            "tags": [
              "react",
              "use-state",
              "re-render"
            ],
            "prompt": "Que signifie « l'état est une photo du rendu » ? Comment faire des mises à jour successives fiables ?"
          },
          {
            "kind": "match",
            "id": "react-hooks-08",
            "difficulty": 1,
            "tags": [
              "react",
              "immuabilite"
            ],
            "prompt": "Associe chaque opération à sa version immuable."
          },
          {
            "kind": "lesson",
            "id": "react-hooks-l2",
            "title": "useEffect : synchroniser avec l'extérieur, pas calculer"
          },
          {
            "kind": "output",
            "id": "react-hooks-09",
            "difficulty": 3,
            "tags": [
              "react",
              "use-effect",
              "dependances",
              "re-render"
            ],
            "prompt": "Que se passe-t-il au montage de ce composant ?"
          },
          {
            "kind": "spot",
            "id": "react-hooks-10",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "dependances"
            ],
            "prompt": "Quand la prop `id` change, l'écran garde l'ancien utilisateur. Trouve la ligne responsable."
          },
          {
            "kind": "mcq",
            "id": "react-hooks-11",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "strict-mode"
            ],
            "prompt": "En développement, sous `<StrictMode>`, `useEffect(() => console.log(\"mount\"), [])` loggue `mount` deux fois. Pourquoi ?"
          },
          {
            "kind": "fill",
            "id": "react-hooks-12",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "dependances"
            ],
            "prompt": "Complète pour ignorer une réponse obsolète et relancer quand `id` change."
          },
          {
            "kind": "output",
            "id": "react-hooks-13",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "dependances"
            ],
            "prompt": "Hors StrictMode : que loggue la console au montage, puis après un clic ?"
          },
          {
            "kind": "mcq",
            "id": "react-hooks-14",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "etat-derive"
            ],
            "prompt": "`const [total, setTotal] = useState(0); useEffect(() => { setTotal(sum(items)); }, [items]);` Quel est le problème ?"
          },
          {
            "kind": "recall",
            "id": "react-hooks-15",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "cleanup"
            ],
            "prompt": "Que fait la fonction retournée par `useEffect`, et à quels moments React l'appelle-t-il ?"
          },
          {
            "kind": "order",
            "id": "react-hooks-16",
            "difficulty": 2,
            "tags": [
              "react",
              "use-effect",
              "cleanup",
              "re-render"
            ],
            "prompt": "Un composant a `useEffect(..., [id])`. La prop `id` change. Remets dans l'ordre ce que fait React."
          },
          {
            "kind": "lesson",
            "id": "react-hooks-l3",
            "title": "Ce qui re-rend, et ce qui ne re-rend pas"
          },
          {
            "kind": "output",
            "id": "react-hooks-17",
            "difficulty": 2,
            "tags": [
              "react",
              "re-render",
              "use-callback",
              "memo"
            ],
            "prompt": "Après un clic sur le bouton de `Child`, que loggue la console ?"
          },
          {
            "kind": "mcq",
            "id": "react-hooks-18",
            "difficulty": 2,
            "tags": [
              "react",
              "use-ref",
              "re-render"
            ],
            "prompt": "Quelle affirmation sur `useRef` est vraie ?"
          },
          {
            "kind": "spot",
            "id": "react-hooks-19",
            "difficulty": 2,
            "tags": [
              "react",
              "cles-de-liste",
              "re-render"
            ],
            "prompt": "Quand on supprime le premier todo, le texte saisi dans les champs se décale. Trouve la ligne responsable."
          },
          {
            "kind": "output",
            "id": "react-hooks-20",
            "difficulty": 2,
            "tags": [
              "react",
              "use-context",
              "re-render"
            ],
            "prompt": "Après un clic sur le bouton, que loggue la console ?"
          },
          {
            "kind": "mcq",
            "id": "react-hooks-21",
            "difficulty": 2,
            "tags": [
              "react",
              "use-memo",
              "use-callback"
            ],
            "prompt": "Quand `useMemo` est-il réellement utile ?"
          },
          {
            "kind": "recall",
            "id": "react-hooks-22",
            "difficulty": 2,
            "tags": [
              "react",
              "re-render"
            ],
            "prompt": "Cite les trois causes de re-render d'un composant, et deux choses qui n'en déclenchent pas."
          },
          {
            "kind": "match",
            "id": "react-hooks-23",
            "difficulty": 1,
            "tags": [
              "react",
              "hooks"
            ],
            "prompt": "Associe chaque hook à son usage."
          },
          {
            "kind": "lesson",
            "id": "react-hooks-l4",
            "title": "Règles des hooks, hooks custom et où mettre l'état"
          },
          {
            "kind": "spot",
            "id": "react-hooks-24",
            "difficulty": 2,
            "tags": [
              "react",
              "regles-des-hooks"
            ],
            "prompt": "Ce composant plante quand `editable` passe de `false` à `true`. Trouve la ligne responsable."
          },
          {
            "kind": "fill",
            "id": "react-hooks-25",
            "difficulty": 2,
            "tags": [
              "react",
              "hooks-custom",
              "use-effect"
            ],
            "prompt": "Nomme ce hook selon la convention et complète ses dépendances."
          },
          {
            "kind": "output",
            "id": "react-hooks-26",
            "difficulty": 2,
            "tags": [
              "react",
              "formulaires"
            ],
            "prompt": "Que se passe-t-il quand l'utilisatrice tape dans ce champ ?"
          },
          {
            "kind": "mcq",
            "id": "react-hooks-27",
            "difficulty": 2,
            "tags": [
              "react",
              "formulaires",
              "use-ref"
            ],
            "prompt": "Quand préférer un champ non contrôlé (`defaultValue` + ref) à un champ contrôlé ?"
          },
          {
            "kind": "recall",
            "id": "react-hooks-28",
            "difficulty": 2,
            "tags": [
              "react",
              "lifting-state-up",
              "use-context"
            ],
            "prompt": "Explique le « lifting state up ». Quand un Context devient-il préférable à des props ?"
          },
          {
            "kind": "order",
            "id": "react-hooks-29",
            "difficulty": 2,
            "tags": [
              "react",
              "use-reducer",
              "re-render"
            ],
            "prompt": "Remets dans l'ordre ce qui se passe après `dispatch({ type: \"add\", item })` avec `useReducer`."
          },
          {
            "kind": "recall",
            "id": "react-hooks-30",
            "difficulty": 3,
            "tags": [
              "react",
              "gestion-etat",
              "data-fetching"
            ],
            "prompt": "Context, Zustand, Redux Toolkit, TanStack Query : quel outil pour quel type d'état ?"
          }
        ]
      },
      {
        "id": "react-etat-data",
        "title": "État et données : contexte, magasins, cache serveur, routage",
        "objective": "Placer chaque donnée au bon endroit : distinguer valeur dérivée, état d'URL, état client et cache serveur, connaître les limites du contexte, choisir un gestionnaire d'état à bon escient, gérer lectures et mutations d'un cache distant, faire porter l'écran par l'URL et dégrader proprement en cas d'erreur.",
        "prerequisites": [
          "react-hooks"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "react-data-l1",
            "title": "Où doit vivre un état"
          },
          {
            "kind": "output",
            "id": "react-data-01",
            "difficulty": 2,
            "tags": [
              "react",
              "etat"
            ],
            "prompt": "Le composant est monté une première fois avec `lignes = [{ prix: 10 }]`. Que journalise-t-il ?"
          },
          {
            "kind": "match",
            "id": "react-data-02",
            "difficulty": 2,
            "tags": [
              "react",
              "etat"
            ],
            "prompt": "Associe chaque donnée à l'endroit où elle doit vivre."
          },
          {
            "kind": "recall",
            "id": "react-data-03",
            "difficulty": 2,
            "tags": [
              "react",
              "etat"
            ],
            "prompt": "Quelle différence de nature entre état client et état serveur, et pourquoi elle compte ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l2",
            "title": "Le passage de props et le contexte"
          },
          {
            "kind": "mcq",
            "id": "react-data-04",
            "difficulty": 2,
            "tags": [
              "react",
              "context"
            ],
            "prompt": "Pourquoi mémoriser la valeur passée à un `Provider` avec `useMemo` ?"
          },
          {
            "kind": "fill",
            "id": "react-data-05",
            "difficulty": 2,
            "tags": [
              "react",
              "context"
            ],
            "prompt": "Complète la création du contexte et sa consommation dans le hook dédié."
          },
          {
            "kind": "recall",
            "id": "react-data-06",
            "difficulty": 2,
            "tags": [
              "react",
              "context"
            ],
            "prompt": "Pourquoi exposer un hook `useTheme()` plutôt que le contexte lui-même ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l3",
            "title": "Les limites du contexte : les re-rendus"
          },
          {
            "kind": "mcq",
            "id": "react-data-07",
            "difficulty": 2,
            "tags": [
              "react",
              "context",
              "performance"
            ],
            "prompt": "Un contexte contient `{ user, theme, panier }`. Un composant ne lit que `theme`. Que se passe-t-il quand `panier` change ?"
          },
          {
            "kind": "order",
            "id": "react-data-08",
            "difficulty": 2,
            "tags": [
              "react",
              "context",
              "performance"
            ],
            "prompt": "Une frappe au clavier fait re-rendre la moitié de l'écran. Remets la démarche dans l'ordre."
          },
          {
            "kind": "recall",
            "id": "react-data-09",
            "difficulty": 3,
            "tags": [
              "react",
              "context",
              "conception"
            ],
            "prompt": "Pourquoi « on n'a pas besoin de Redux, on a Context » est-il une comparaison faussée ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l4",
            "title": "Les gestionnaires d'état client"
          },
          {
            "kind": "mcq",
            "id": "react-data-10",
            "difficulty": 2,
            "tags": [
              "react",
              "etat",
              "redux"
            ],
            "prompt": "Qu'apporte un gestionnaire d'état que le contexte n'apporte pas ?"
          },
          {
            "kind": "spot",
            "id": "react-data-11",
            "difficulty": 3,
            "tags": [
              "react",
              "redux",
              "performance"
            ],
            "prompt": "Ce composant se re-rend à chaque action, même sans rapport. Quelle ligne ?"
          },
          {
            "kind": "recall",
            "id": "react-data-12",
            "difficulty": 2,
            "tags": [
              "react",
              "etat",
              "conception"
            ],
            "prompt": "Quel est le contresens le plus fréquent avec un gestionnaire d'état client ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l5",
            "title": "L'état serveur est un cache"
          },
          {
            "kind": "spot",
            "id": "react-data-13",
            "difficulty": 3,
            "tags": [
              "react",
              "data-fetching"
            ],
            "prompt": "Ce chargement affiche parfois les données du mauvais client. Quelle ligne est en cause ?"
          },
          {
            "kind": "mcq",
            "id": "react-data-14",
            "difficulty": 3,
            "tags": [
              "react",
              "data-fetching",
              "cache"
            ],
            "prompt": "Quelle option réduit réellement le nombre de requêtes réseau ?"
          },
          {
            "kind": "recall",
            "id": "react-data-15",
            "difficulty": 2,
            "tags": [
              "react",
              "data-fetching"
            ],
            "prompt": "Que faut-il traiter quand on charge des données à la main dans un `useEffect` ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l6",
            "title": "Mutations, invalidation et mise à jour optimiste"
          },
          {
            "kind": "mcq",
            "id": "react-data-16",
            "difficulty": 2,
            "tags": [
              "react",
              "data-fetching",
              "cache"
            ],
            "prompt": "Que fait `invalidateQueries({ queryKey: [\"commandes\"] })` ?"
          },
          {
            "kind": "order",
            "id": "react-data-17",
            "difficulty": 3,
            "tags": [
              "react",
              "data-fetching"
            ],
            "prompt": "Remets dans l'ordre les étapes d'une mise à jour optimiste correcte."
          },
          {
            "kind": "recall",
            "id": "react-data-18",
            "difficulty": 2,
            "tags": [
              "react",
              "data-fetching",
              "conception"
            ],
            "prompt": "Quand une mise à jour optimiste est-elle un mauvais choix ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l7",
            "title": "Le routage et l'état d'URL"
          },
          {
            "kind": "mcq",
            "id": "react-data-19",
            "difficulty": 2,
            "tags": [
              "react",
              "routage"
            ],
            "prompt": "Où ranger le filtre « statut » d'une liste de commandes ?"
          },
          {
            "kind": "match",
            "id": "react-data-20",
            "difficulty": 2,
            "tags": [
              "react",
              "routage"
            ],
            "prompt": "Associe chaque élément de routage à son rôle."
          },
          {
            "kind": "recall",
            "id": "react-data-21",
            "difficulty": 2,
            "tags": [
              "react",
              "routage"
            ],
            "prompt": "Quelles garanties du navigateur une application monopage doit-elle restituer, et comment ?"
          },
          {
            "kind": "lesson",
            "id": "react-data-l8",
            "title": "Les frontières d'erreur et les états dégradés"
          },
          {
            "kind": "mcq",
            "id": "react-data-22",
            "difficulty": 2,
            "tags": [
              "react",
              "erreurs"
            ],
            "prompt": "Une frontière d'erreur capte-t-elle une exception levée dans un `onClick` ?"
          },
          {
            "kind": "mcq",
            "id": "react-data-23",
            "difficulty": 2,
            "tags": [
              "react",
              "erreurs",
              "conception"
            ],
            "prompt": "Pourquoi placer plusieurs frontières d'erreur plutôt qu'une seule à la racine ?"
          },
          {
            "kind": "recall",
            "id": "react-data-24",
            "difficulty": 2,
            "tags": [
              "react",
              "erreurs"
            ],
            "prompt": "Quels états d'une donnée distante faut-il traiter explicitement, et lequel est le plus souvent oublié ?"
          }
        ],
        "format": "detaille"
      }
    ]
  },
  {
    "id": "devops",
    "title": "Git et GitLab CI",
    "description": "Branches, merge et rebase, pipeline, cache et artifacts.",
    "icon": "🦊",
    "chapters": [
      {
        "id": "devops-git-gitlab-ci",
        "title": "Git et GitLab CI : pipeline, cache, artifacts",
        "objective": "Choisir entre merge et rebase, défaire sans rien perdre avec reset, revert et reflog, et écrire un pipeline GitLab qui distingue cache, artifacts et services.",
        "prerequisites": [
          "docker-bases"
        ],
        "units": [
          {
            "kind": "lesson",
            "id": "devops-ci-l1",
            "title": "Staging, branches, merge et rebase"
          },
          {
            "kind": "mcq",
            "id": "devops-ci-01",
            "difficulty": 1,
            "tags": [
              "git",
              "staging"
            ],
            "prompt": "À quoi sert la zone de staging (l'index) ?"
          },
          {
            "kind": "output",
            "id": "devops-ci-02",
            "difficulty": 2,
            "tags": [
              "git",
              "merge-vs-rebase"
            ],
            "prompt": "`feature` part de `main` au commit B. `main` a depuis avancé jusqu'à C. Que produit `git rebase main` depuis `feature` ?"
          },
          {
            "kind": "mcq",
            "id": "devops-ci-03",
            "difficulty": 2,
            "tags": [
              "git",
              "merge-vs-rebase"
            ],
            "prompt": "Pourquoi ne jamais rebaser une branche déjà poussée et utilisée par d'autres ?"
          },
          {
            "kind": "fill",
            "id": "devops-ci-04",
            "difficulty": 1,
            "tags": [
              "git",
              "branches"
            ],
            "prompt": "Complète pour créer une branche, y committer et la pousser en la liant à son homologue distante."
          },
          {
            "kind": "match",
            "id": "devops-ci-05",
            "difficulty": 2,
            "tags": [
              "git",
              "merge-vs-rebase"
            ],
            "prompt": "Associe chaque situation à l'opération adaptée."
          },
          {
            "kind": "output",
            "id": "devops-ci-06",
            "difficulty": 2,
            "tags": [
              "git",
              "merge-vs-rebase"
            ],
            "prompt": "`main` n'a pas bougé depuis que `feature` en est partie. Que produit `git merge feature` depuis `main` ?"
          },
          {
            "kind": "spot",
            "id": "devops-ci-07",
            "difficulty": 2,
            "tags": [
              "git",
              "conflits"
            ],
            "prompt": "Après avoir résolu un conflit, cette séquence bloque. Trouve la ligne fautive."
          },
          {
            "kind": "recall",
            "id": "devops-ci-08",
            "difficulty": 2,
            "tags": [
              "git",
              "merge-vs-rebase"
            ],
            "prompt": "Merge ou rebase : comment choisis-tu, et quelle règle ne se discute pas ?"
          },
          {
            "kind": "lesson",
            "id": "devops-ci-l2",
            "title": "Défaire : reset, revert, reflog"
          },
          {
            "kind": "output",
            "id": "devops-ci-09",
            "difficulty": 2,
            "tags": [
              "git",
              "reset"
            ],
            "prompt": "Après un commit, que montre `git status` à la fin de cette séquence ?"
          },
          {
            "kind": "output",
            "id": "devops-ci-10",
            "difficulty": 2,
            "tags": [
              "git",
              "reset"
            ],
            "prompt": "Même séquence, mais avec `--mixed`, l'option par défaut. Que montre `git status` ?"
          },
          {
            "kind": "mcq",
            "id": "devops-ci-11",
            "difficulty": 2,
            "tags": [
              "git",
              "revert",
              "reset"
            ],
            "prompt": "Un commit fautif a été poussé sur `main`, branche partagée. Comment l'annuler ?"
          },
          {
            "kind": "spot",
            "id": "devops-ci-12",
            "difficulty": 2,
            "tags": [
              "git",
              "reset"
            ],
            "prompt": "Cette séquence, destinée à annuler le dernier commit pour le retravailler, fait perdre le travail. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "devops-ci-13",
            "difficulty": 2,
            "tags": [
              "git",
              "reset",
              "revert",
              "reflog"
            ],
            "prompt": "Associe chaque commande à ce qu'elle modifie."
          },
          {
            "kind": "fill",
            "id": "devops-ci-14",
            "difficulty": 2,
            "tags": [
              "git",
              "stash",
              "cherry-pick"
            ],
            "prompt": "Complète : mettre de côté le travail en cours, récupérer un commit d'une autre branche, puis reprendre."
          },
          {
            "kind": "recall",
            "id": "devops-ci-15",
            "difficulty": 2,
            "tags": [
              "git",
              "reflog"
            ],
            "prompt": "Tu viens de faire `git reset --hard` et de perdre deux heures de travail committé. Que fais-tu ?"
          },
          {
            "kind": "lesson",
            "id": "devops-ci-l3",
            "title": "Le pipeline : stages, jobs et rules"
          },
          {
            "kind": "mcq",
            "id": "devops-ci-16",
            "difficulty": 1,
            "tags": [
              "gitlab-ci",
              "stages",
              "jobs"
            ],
            "prompt": "Deux jobs sont déclarés dans le même stage. Comment s'exécutent-ils ?"
          },
          {
            "kind": "output",
            "id": "devops-ci-17",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "jobs"
            ],
            "prompt": "Que se passe-t-il si `./mvnw verify` échoue dans ce job ?"
          },
          {
            "kind": "fill",
            "id": "devops-ci-18",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "rules"
            ],
            "prompt": "Complète pour que le déploiement ne soit proposé que sur la branche par défaut, et seulement sur action manuelle."
          },
          {
            "kind": "spot",
            "id": "devops-ci-19",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "stages"
            ],
            "prompt": "Le pipeline échoue au chargement du fichier. Trouve la ligne fautive."
          },
          {
            "kind": "match",
            "id": "devops-ci-20",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "variables"
            ],
            "prompt": "Associe chaque variable prédéfinie à son contenu."
          },
          {
            "kind": "mcq",
            "id": "devops-ci-21",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "variables"
            ],
            "prompt": "Quelle est la différence entre une variable **protégée** et une variable **masquée** ?"
          },
          {
            "kind": "order",
            "id": "devops-ci-22",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "stages"
            ],
            "prompt": "Remets dans l'ordre les stages d'un pipeline type pour une application Java conteneurisée."
          },
          {
            "kind": "recall",
            "id": "devops-ci-23",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "runners"
            ],
            "prompt": "Qu'est-ce qu'un runner, et pourquoi chaque job repart-il d'un environnement vierge ?"
          },
          {
            "kind": "lesson",
            "id": "devops-ci-l4",
            "title": "Cache, artifacts, services et needs"
          },
          {
            "kind": "mcq",
            "id": "devops-ci-24",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "cache-vs-artifacts"
            ],
            "prompt": "Le stage `deploy` a besoin du jar produit au stage `build`. Quel mécanisme utiliser ?"
          },
          {
            "kind": "match",
            "id": "devops-ci-25",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "cache-vs-artifacts"
            ],
            "prompt": "Associe chaque élément au mécanisme approprié."
          },
          {
            "kind": "spot",
            "id": "devops-ci-26",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "services"
            ],
            "prompt": "Les tests d'intégration échouent avec « connection refused ». Trouve la ligne fautive."
          },
          {
            "kind": "output",
            "id": "devops-ci-27",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "needs"
            ],
            "prompt": "Que change `needs: [build]` sur le job `it`, déclaré au stage `test` ?"
          },
          {
            "kind": "fill",
            "id": "devops-ci-28",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "cache-vs-artifacts"
            ],
            "prompt": "Complète : accélérer avec le dépôt Maven, transmettre le jar au stage suivant."
          },
          {
            "kind": "recall",
            "id": "devops-ci-29",
            "difficulty": 3,
            "tags": [
              "gitlab-ci",
              "docker",
              "images"
            ],
            "prompt": "Comment construire une image Docker depuis un job GitLab CI, et quelles sont les deux approches ?"
          },
          {
            "kind": "recall",
            "id": "devops-ci-30",
            "difficulty": 2,
            "tags": [
              "gitlab-ci",
              "environnements"
            ],
            "prompt": "Comment organiser un déploiement sûr, avec possibilité de revenir en arrière ?"
          }
        ]
      }
    ]
  },
  {
    "id": "transverse",
    "title": "Transverse",
    "description": "HTTP et API, entretien : présenter, décider, être relu et évalué.",
    "icon": "🧭",
    "chapters": [
      {
        "id": "transverse-http-api",
        "title": "HTTP et conception d'API",
        "objective": "Concevoir et défendre une API HTTP : choisir la méthode pour ce qu'elle promet, survivre au rejeu, employer les bons codes et en-têtes, exploiter le cache, situer son API sur l'échelle de Richardson, dessiner des URL durables et renvoyer des erreurs utiles sans trop en dire.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "transverse-http-l1",
            "title": "Les méthodes HTTP sont des promesses"
          },
          {
            "kind": "mcq",
            "id": "transverse-http-01",
            "difficulty": 1,
            "tags": [
              "http",
              "methodes"
            ],
            "prompt": "Quelle est la différence fondamentale entre PUT et POST ?"
          },
          {
            "kind": "match",
            "id": "transverse-http-02",
            "difficulty": 2,
            "tags": [
              "http",
              "methodes"
            ],
            "prompt": "Associe chaque méthode à sa combinaison de propriétés."
          },
          {
            "kind": "recall",
            "id": "transverse-http-03",
            "difficulty": 2,
            "tags": [
              "http",
              "methodes"
            ],
            "prompt": "Pourquoi exposer une suppression derrière un GET est-il dangereux ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l2",
            "title": "L'idempotence en pratique : survivre au rejeu"
          },
          {
            "kind": "output",
            "id": "transverse-http-04",
            "difficulty": 2,
            "tags": [
              "http",
              "idempotence"
            ],
            "prompt": "L'API gère les clés d'idempotence. La première requête a réussi mais la réponse s'est perdue ; le client réessaie avec la même clé."
          },
          {
            "kind": "mcq",
            "id": "transverse-http-05",
            "difficulty": 3,
            "tags": [
              "http",
              "idempotence"
            ],
            "prompt": "À quel moment le client doit-il générer la clé d'idempotence ?"
          },
          {
            "kind": "recall",
            "id": "transverse-http-06",
            "difficulty": 3,
            "tags": [
              "http",
              "idempotence"
            ],
            "prompt": "Un DELETE renvoie 204 au premier appel et 404 au second. Est-il encore idempotent ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l3",
            "title": "Les codes de statut, et ceux qu'on confond"
          },
          {
            "kind": "mcq",
            "id": "transverse-http-07",
            "difficulty": 1,
            "tags": [
              "http",
              "codes-http"
            ],
            "prompt": "Un utilisateur authentifié appelle une route réservée aux administrateurs. Quel code renvoyer ?"
          },
          {
            "kind": "match",
            "id": "transverse-http-08",
            "difficulty": 2,
            "tags": [
              "http",
              "codes-http"
            ],
            "prompt": "Associe chaque situation au code approprié."
          },
          {
            "kind": "recall",
            "id": "transverse-http-09",
            "difficulty": 2,
            "tags": [
              "http",
              "codes-http"
            ],
            "prompt": "Pourquoi ne faut-il jamais renvoyer 200 avec un corps du type `{\"success\": false}` ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l4",
            "title": "Les en-têtes qui font le travail"
          },
          {
            "kind": "fill",
            "id": "transverse-http-10",
            "difficulty": 1,
            "tags": [
              "http",
              "headers"
            ],
            "prompt": "Complète les deux en-têtes de cette réponse de création."
          },
          {
            "kind": "mcq",
            "id": "transverse-http-11",
            "difficulty": 2,
            "tags": [
              "http",
              "cache"
            ],
            "prompt": "Que signifie exactement `Cache-Control: no-cache` ?"
          },
          {
            "kind": "recall",
            "id": "transverse-http-12",
            "difficulty": 2,
            "tags": [
              "http",
              "headers"
            ],
            "prompt": "Pourquoi ne jamais transmettre un jeton d'authentification en paramètre d'URL ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l5",
            "title": "Le cache HTTP : ETag et revalidation"
          },
          {
            "kind": "output",
            "id": "transverse-http-13",
            "difficulty": 2,
            "tags": [
              "http",
              "cache"
            ],
            "prompt": "Le client a déjà la ressource en cache avec son ETag, et la ressource n'a pas changé depuis."
          },
          {
            "kind": "mcq",
            "id": "transverse-http-14",
            "difficulty": 3,
            "tags": [
              "http",
              "cache",
              "concurrence"
            ],
            "prompt": "Alice et Bob ont lu la ressource en version \"v12\". Alice écrit avec `If-Match: \"v12\"` et réussit. Bob écrit ensuite avec `If-Match: \"v12\"`. Que se passe-t-il ?"
          },
          {
            "kind": "recall",
            "id": "transverse-http-15",
            "difficulty": 2,
            "tags": [
              "http",
              "cache"
            ],
            "prompt": "Quelle différence entre l'expiration (`max-age`) et la revalidation (`ETag` + `If-None-Match`) ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l6",
            "title": "REST et le modèle de maturité de Richardson"
          },
          {
            "kind": "order",
            "id": "transverse-http-16",
            "difficulty": 2,
            "tags": [
              "http",
              "rest"
            ],
            "prompt": "Remets les niveaux du modèle de Richardson dans l'ordre croissant."
          },
          {
            "kind": "mcq",
            "id": "transverse-http-17",
            "difficulty": 3,
            "tags": [
              "http",
              "rest"
            ],
            "prompt": "Quel bénéfice concret l'hypermédia apporte-t-il le plus souvent en pratique ?"
          },
          {
            "kind": "match",
            "id": "transverse-http-18",
            "difficulty": 2,
            "tags": [
              "http",
              "rest"
            ],
            "prompt": "Associe chaque exemple d'appel à son niveau de maturité."
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l7",
            "title": "Dessiner les ressources : URL, filtres, pagination"
          },
          {
            "kind": "spot",
            "id": "transverse-http-19",
            "difficulty": 2,
            "tags": [
              "http",
              "conception"
            ],
            "prompt": "Revue de conception d'API. Quelle route pose problème ?"
          },
          {
            "kind": "mcq",
            "id": "transverse-http-20",
            "difficulty": 2,
            "tags": [
              "http",
              "conception"
            ],
            "prompt": "Quel changement peut être fait sans nouvelle version de l'API ?"
          },
          {
            "kind": "recall",
            "id": "transverse-http-21",
            "difficulty": 3,
            "tags": [
              "http",
              "conception"
            ],
            "prompt": "Quelle limite a la pagination par numéro de page, et que résout la pagination par curseur ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-http-l8",
            "title": "Erreurs exploitables et sécurité de surface"
          },
          {
            "kind": "spot",
            "id": "transverse-http-22",
            "difficulty": 2,
            "tags": [
              "http",
              "erreurs",
              "securite"
            ],
            "prompt": "Cette réponse d'erreur part en production. Quelle ligne pose problème ?"
          },
          {
            "kind": "fill",
            "id": "transverse-http-23",
            "difficulty": 1,
            "tags": [
              "http",
              "erreurs"
            ],
            "prompt": "Complète l'en-tête et le champ stable de ce corps d'erreur normalisé."
          },
          {
            "kind": "mcq",
            "id": "transverse-http-24",
            "difficulty": 3,
            "tags": [
              "http",
              "securite"
            ],
            "prompt": "Que protège exactement CORS ?"
          }
        ],
        "format": "detaille"
      },
      {
        "id": "transverse-entretien",
        "title": "Entretien : se présenter, défendre ses choix, être évalué",
        "objective": "Préparer les moments non techniques de l'entretien : raconter son parcours et un projet, justifier une décision d'architecture, tenir un rôle en revue de code, parler d'agilité et d'estimation sans réciter, et aborder un live coding avec une méthode.",
        "prerequisites": [],
        "units": [
          {
            "kind": "lesson",
            "id": "transverse-ent-l1",
            "title": "Raconter son parcours en trois minutes"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-01",
            "difficulty": 1,
            "tags": [
              "entretien",
              "presentation"
            ],
            "prompt": "Que cherche réellement un recruteur en demandant « parlez-moi de vous » ?"
          },
          {
            "kind": "order",
            "id": "transverse-ent-02",
            "difficulty": 1,
            "tags": [
              "entretien",
              "presentation"
            ],
            "prompt": "Remets dans l'ordre une présentation de trois minutes qui fonctionne."
          },
          {
            "kind": "recall",
            "id": "transverse-ent-03",
            "difficulty": 2,
            "tags": [
              "entretien",
              "presentation"
            ],
            "prompt": "Pourquoi est-il risqué de citer une technologie qu'on a seulement effleurée pour étoffer sa présentation ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l2",
            "title": "Présenter un projet : contexte, contrainte, décision, résultat"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-04",
            "difficulty": 2,
            "tags": [
              "entretien",
              "projet"
            ],
            "prompt": "Dans un récit de projet, à quoi sert d'énoncer explicitement la contrainte ?"
          },
          {
            "kind": "match",
            "id": "transverse-ent-05",
            "difficulty": 1,
            "tags": [
              "entretien",
              "projet"
            ],
            "prompt": "Associe chaque temps du récit à ce qu'il doit contenir."
          },
          {
            "kind": "recall",
            "id": "transverse-ent-06",
            "difficulty": 2,
            "tags": [
              "entretien",
              "projet"
            ],
            "prompt": "Pourquoi terminer la présentation d'un projet par ce qu'on referait autrement ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l3",
            "title": "L'ADR : garder la trace d'une décision"
          },
          {
            "kind": "fill",
            "id": "transverse-ent-07",
            "difficulty": 1,
            "tags": [
              "entretien",
              "adr"
            ],
            "prompt": "Complète les deux sections manquantes de ce squelette d'ADR."
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-08",
            "difficulty": 2,
            "tags": [
              "entretien",
              "adr"
            ],
            "prompt": "La décision prise dans l'ADR 0007 n'est plus valable : le contexte a changé. Que fait-on ?"
          },
          {
            "kind": "recall",
            "id": "transverse-ent-09",
            "difficulty": 2,
            "tags": [
              "entretien",
              "adr"
            ],
            "prompt": "Quelle est la différence entre une documentation d'architecture et un ADR ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l4",
            "title": "La revue de code : ce qu'on y cherche"
          },
          {
            "kind": "spot",
            "id": "transverse-ent-10",
            "difficulty": 3,
            "tags": [
              "entretien",
              "revue-de-code"
            ],
            "prompt": "Revue de code : ce virement compile et est bien formaté. Quelle ligne poses-tu comme bloquante ?"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-11",
            "difficulty": 2,
            "tags": [
              "entretien",
              "revue-de-code"
            ],
            "prompt": "Pourquoi une revue de mille lignes qui ne remonte que trois remarques de style est-elle inquiétante ?"
          },
          {
            "kind": "recall",
            "id": "transverse-ent-12",
            "difficulty": 2,
            "tags": [
              "entretien",
              "revue-de-code"
            ],
            "prompt": "Dans quel ordre lire une demande de fusion, et pourquoi le style n'y figure-t-il pas ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l5",
            "title": "Formuler une remarque sans braquer"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-13",
            "difficulty": 2,
            "tags": [
              "entretien",
              "revue-de-code"
            ],
            "prompt": "Quelle formulation de remarque a le plus de chances d'être appliquée ?"
          },
          {
            "kind": "match",
            "id": "transverse-ent-14",
            "difficulty": 2,
            "tags": [
              "entretien",
              "revue-de-code"
            ],
            "prompt": "Associe chaque élément d'une bonne remarque à son rôle."
          },
          {
            "kind": "recall",
            "id": "transverse-ent-15",
            "difficulty": 2,
            "tags": [
              "entretien",
              "revue-de-code"
            ],
            "prompt": "Que faire quand un désaccord en revue dure plus de deux allers-retours écrits ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l6",
            "title": "Agile : ce que l'entretien attend vraiment"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-16",
            "difficulty": 1,
            "tags": [
              "entretien",
              "agile"
            ],
            "prompt": "À quoi sert la mêlée quotidienne ?"
          },
          {
            "kind": "match",
            "id": "transverse-ent-17",
            "difficulty": 2,
            "tags": [
              "entretien",
              "agile"
            ],
            "prompt": "Associe chaque cérémonie à la question à laquelle elle répond."
          },
          {
            "kind": "order",
            "id": "transverse-ent-18",
            "difficulty": 2,
            "tags": [
              "entretien",
              "agile"
            ],
            "prompt": "Le sprint dérape à mi-parcours : remets dans l'ordre la bonne réaction."
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l7",
            "title": "Estimer : pourquoi les estimations ratent"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-19",
            "difficulty": 2,
            "tags": [
              "entretien",
              "estimation"
            ],
            "prompt": "Pourquoi une moyenne d'estimations optimistes reste-t-elle optimiste, même sur beaucoup de tâches ?"
          },
          {
            "kind": "order",
            "id": "transverse-ent-20",
            "difficulty": 2,
            "tags": [
              "entretien",
              "estimation"
            ],
            "prompt": "On te demande d'estimer un sujet mal connu. Remets la bonne démarche dans l'ordre."
          },
          {
            "kind": "recall",
            "id": "transverse-ent-21",
            "difficulty": 3,
            "tags": [
              "entretien",
              "estimation"
            ],
            "prompt": "Pourquoi estimer en points relatifs plutôt qu'en jours, et pourquoi la vélocité ne doit-elle pas servir d'indicateur de performance ?"
          },
          {
            "kind": "lesson",
            "id": "transverse-ent-l8",
            "title": "Le live coding : être évalué en direct"
          },
          {
            "kind": "output",
            "id": "transverse-ent-22",
            "difficulty": 2,
            "tags": [
              "entretien",
              "live-coding"
            ],
            "prompt": "En live coding, on te demande de dérouler ce code à voix haute. Qu'affiche-t-il ?"
          },
          {
            "kind": "spot",
            "id": "transverse-ent-23",
            "difficulty": 2,
            "tags": [
              "entretien",
              "live-coding"
            ],
            "prompt": "Première version écrite en live coding. L'examinateur demande « que se passe-t-il si la liste contient deux fois le même client ? ». Quelle ligne pose problème ?"
          },
          {
            "kind": "mcq",
            "id": "transverse-ent-24",
            "difficulty": 1,
            "tags": [
              "entretien",
              "live-coding"
            ],
            "prompt": "Tu ne te souviens plus de la signature exacte d'une méthode pendant un live coding. Que faire ?"
          }
        ],
        "format": "detaille"
      }
    ]
  }
];
