/**
 * Java — La JVM (référentiel 1.7) : mémoire, ramasse-miettes, fuites,
 * chargement de classes, diagnostic.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Les zones mémoire
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-jvm-l1",
  title: "Les zones mémoire",
  blocks: [
    {
      kind: "text",
      text: "Devant une application qui consomme quatre gigaoctets, la première question est toujours la même : de quelle mémoire parle-t-on ? Un développeur qui ne distingue pas le tas de la pile et de l'espace des métadonnées augmente `-Xmx` au hasard, constate que le problème persiste, et conclut que la JVM est capricieuse. Elle ne l'est pas — elle a des zones, et chacune se remplit pour des raisons différentes.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce que la JVM réserve, et pour quoi.",
      code: `TAS (heap)            tous les objets, partagé par les threads
  -Xms / -Xmx         taille initiale et maximale
  → OutOfMemoryError: Java heap space

PILE (stack)          une par thread, cadres d'appel et
                      variables locales primitives
  -Xss                taille d'une pile
  → StackOverflowError

MÉTASPACE             classes chargées, métadonnées
  -XX:MaxMetaspaceSize
  → OutOfMemoryError: Metaspace

HORS TAS              tampons directs, mappages mémoire,
                      piles des threads, code compilé
  → invisible dans -Xmx, et souvent la vraie cause
    quand le conteneur est tué par l'orchestrateur`,
    },
    {
      kind: "text",
      text: "Le tas contient **tous les objets**, sans exception : une variable locale de type `String` est une référence sur la pile qui pointe vers un objet sur le tas. Il est partagé entre les threads, ce qui explique pourquoi la concurrence pose des problèmes de visibilité, et c'est le seul espace que le ramasse-miettes parcourt.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce qui va où, sur un exemple.",
      code: `void traite(int taille) {          // taille : PILE (primitif)
    Client c = new Client();      // référence : PILE
                                  // objet Client : TAS
    int[] buffer = new int[taille]; // référence : PILE
                                  // tableau : TAS
    autreMethode(c);              // nouveau cadre sur la PILE
}                                 // cadre dépilé ; l'objet
                                  // reste sur le tas tant
                                  // qu'il est atteignable`,
    },
    {
      kind: "text",
      text: "La pile est propre à chaque thread et fonctionne en cadres : un cadre est empilé à chaque appel de méthode et dépilé au retour. Elle contient les paramètres, les variables locales primitives et les références. Sa taille est fixée au démarrage du thread, ce qui explique qu'une récursion trop profonde la fasse déborder sans que le tas soit concerné.",
    },
    {
      kind: "comparison",
      title: "Deux erreurs qu'on confond en entretien",
      left: {
        label: "StackOverflowError",
        text: "La **pile** d'un thread est pleine. Cause quasi unique : une récursion sans condition d'arrêt, ou trop profonde. Ne dépend pas de `-Xmx`. La trace montre le même motif d'appels répété des centaines de fois — le diagnostic est immédiat.",
      },
      right: {
        label: "OutOfMemoryError",
        text: "Le **tas** est plein et le ramasse-miettes n'a rien pu libérer. Cause : trop d'objets vivants — fuite, ou charge supérieure au dimensionnement. La trace pointe l'allocation qui a échoué, presque jamais la cause réelle.",
      },
    },
    {
      kind: "text",
      text: "Le métaspace mérite d'être connu parce qu'il a remplacé l'ancienne « génération permanente » en Java 8 et qu'il est, par défaut, **non borné** : il grandit tant que le système d'exploitation fournit de la mémoire. Une application qui charge dynamiquement des classes — génération de proxys, rechargement à chaud, moteurs de scripts — peut ainsi épuiser la machine sans jamais toucher au tas.",
    },
    {
      kind: "text",
      text: "La mémoire hors tas est la source de surprise la plus fréquente en conteneur. Les tampons directs, les fichiers projetés en mémoire, le code compilé par le compilateur à la volée et la pile de chaque thread s'ajoutent au tas. Un `-Xmx` fixé à la taille du conteneur garantit donc que le processus sera tué par le système bien avant d'atteindre cette limite.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "En conteneur, laisser la JVM décider",
      text: "Depuis Java 10, la JVM lit les limites du conteneur et dimensionne le tas en conséquence. `-XX:MaxRAMPercentage=75` est plus sûr qu'un `-Xmx` en dur : il laisse une réserve pour le hors tas, et suit automatiquement le jour où la limite du conteneur change. Fixer `-Xmx` à 100 % de la limite est la façon la plus sûre de se faire tuer par l'orchestrateur.",
    },
    {
      kind: "text",
      text: "Retenons la carte : le tas pour les objets, une pile par thread pour les appels, le métaspace pour les classes, et tout le reste hors tas. Chacune se remplit pour une raison différente et se diagnostique avec des outils différents — commencer par identifier la zone évite de perdre des heures à régler le mauvais paramètre.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "java-jvm-01",
    difficulty: 1,
    tags: ["jvm", "memoire"],
    prompt: "Où vit l'objet créé par `Client c = new Client();` dans une méthode ?",
    choices: [
      "L'objet est sur le tas, la référence `c` sur la pile du thread courant.",
      "L'objet et la référence sont tous deux sur la pile, puisqu'ils sont locaux.",
      "L'objet est sur la pile tant que la méthode s'exécute, puis copié sur le tas.",
      "L'objet est dans le métaspace, avec les métadonnées de sa classe.",
    ],
    answer: 0,
    explanation:
      "Tous les objets vivent sur le tas, sans exception ; la pile ne contient que les primitifs locaux, les paramètres et les références. C'est pourquoi l'objet survit au retour de la méthode s'il reste atteignable ailleurs, alors que le cadre de pile, lui, est dépilé. Le métaspace ne contient que les métadonnées de classes, pas les instances.",
  },
  {
    kind: "match",
    id: "java-jvm-02",
    difficulty: 2,
    tags: ["jvm", "memoire"],
    prompt: "Associe chaque zone à ce qu'elle contient.",
    pairs: [
      { left: "Tas", right: "Tous les objets, partagés entre threads" },
      { left: "Pile", right: "Cadres d'appel, primitifs locaux et références, une par thread" },
      { left: "Métaspace", right: "Les classes chargées et leurs métadonnées" },
      { left: "Hors tas", right: "Tampons directs, code compilé, piles des threads" },
    ],
    explanation:
      "Chaque zone se remplit pour une raison différente et se diagnostique autrement. Le hors tas est le plus souvent oublié : il n'apparaît pas dans `-Xmx` et explique la plupart des conteneurs tués par l'orchestrateur alors que le tas semblait confortable.",
  },
  {
    kind: "recall",
    id: "java-jvm-03",
    difficulty: 2,
    tags: ["jvm", "memoire", "docker"],
    prompt: "Pourquoi fixer `-Xmx` à la taille de la limite du conteneur est-il une mauvaise idée ?",
    explanation:
      "Parce que le tas n'est qu'une partie de ce que le processus consomme. S'y ajoutent la mémoire hors tas — tampons directs, fichiers projetés, code compilé à la volée par le compilateur JIT — et la pile de chaque thread, soit facilement plusieurs centaines de mégaoctets sur une application chargée. Un `-Xmx` égal à la limite du conteneur autorise donc le tas à occuper tout l'espace disponible, et le processus est tué par le système d'exploitation bien avant que la JVM n'ait la moindre occasion de lever une `OutOfMemoryError` — on obtient une mort brutale, sans trace ni diagnostic. La bonne pratique depuis Java 10 est de laisser la JVM lire elle-même la limite du conteneur, avec `-XX:MaxRAMPercentage=75` : une réserve subsiste pour le hors tas, et le réglage suit automatiquement si la limite change.",
    keyPoints: [
      "Le tas n'est qu'une partie de la consommation du processus",
      "Hors tas et piles de threads s'y ajoutent",
      "Le processus est tué sans trace, avant toute OutOfMemoryError",
      "Préférer -XX:MaxRAMPercentage, qui suit la limite du conteneur",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — La pile et StackOverflowError
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-jvm-l2",
  title: "La pile et StackOverflowError",
  blocks: [
    {
      kind: "text",
      text: "De toutes les erreurs de la JVM, `StackOverflowError` est la plus facile à diagnostiquer : sa cause est presque toujours unique, et la trace la désigne. C'est aussi l'occasion de comprendre comment les appels de méthode fonctionnent réellement, ce qui éclaire au passage la récursivité et son coût.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un cadre par appel, empilé puis dépilé.",
      code: `int factorielle(int n) {
    if (n <= 1) return 1;          // condition d'arrêt
    return n * factorielle(n - 1); // nouvel appel = nouveau cadre
}

// factorielle(4) empile :
//   [factorielle n=4]
//   [factorielle n=3]
//   [factorielle n=2]
//   [factorielle n=1]  ← s'arrête, les cadres se dépilent

// Sans condition d'arrêt correcte :
int compte(int n) { return 1 + compte(n - 1); }
// compte(5) descend vers -∞ : la pile déborde en
// quelques milliers d'appels.`,
    },
    {
      kind: "text",
      text: "Chaque appel de méthode empile un cadre contenant ses paramètres, ses variables locales et l'adresse de retour. La pile d'un thread fait typiquement cinq cents kilo-octets à un mégaoctet, ce qui autorise de l'ordre de dix mille appels imbriqués — un chiffre qui varie beaucoup selon la taille des cadres, donc selon le nombre de variables locales.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La trace, et ce qu'elle dit immédiatement.",
      code: `Exception in thread "main" java.lang.StackOverflowError
    at Service.valide(Service.java:42)
    at Service.normalise(Service.java:57)
    at Service.valide(Service.java:44)
    at Service.normalise(Service.java:57)
    at Service.valide(Service.java:42)
    ... répété des milliers de fois

→ Le MOTIF RÉPÉTÉ est le diagnostic : valide et
  normalise s'appellent mutuellement sans condition
  d'arrêt. Ce n'est pas toujours une récursion directe.`,
    },
    {
      kind: "text",
      text: "Le motif répété est l'information utile. Une récursion directe se voit tout de suite ; la récursion **indirecte** — deux ou trois méthodes qui s'appellent en cycle — est plus discrète et se révèle en observant la période du motif. C'est le cas classique d'un `equals` qui appelle `toString` qui appelle `equals`, ou d'un accesseur qui se rappelle lui-même après un renommage malheureux.",
    },
    {
      kind: "comparison",
      title: "Deux causes, deux corrections",
      left: {
        label: "Récursion fautive",
        text: "Condition d'arrêt absente, mal placée, ou jamais atteinte parce que l'argument ne décroît pas. La correction est dans le code, et augmenter `-Xss` ne ferait que retarder l'erreur de quelques milliers d'appels.",
      },
      right: {
        label: "Récursion légitime trop profonde",
        text: "L'algorithme est correct mais la donnée est plus profonde que prévu — un arbre déséquilibré, un graphe long. Là, augmenter `-Xss` est défendable ; convertir en boucle avec une pile explicite l'est davantage.",
      },
    },
    {
      kind: "text",
      text: "Java n'optimise pas les appels terminaux : une récursion terminale, que d'autres langages transforment en boucle, empile bel et bien un cadre par appel. Écrire un algorithme récursif sur une profondeur potentiellement grande est donc un risque réel, et la conversion en itération avec une pile explicite — un `ArrayDeque` — est la parade standard, puisqu'elle déplace le stockage sur le tas.",
    },
    {
      kind: "text",
      text: "Un cas particulier revient souvent en production : la sérialisation d'un graphe d'objets cyclique. Deux entités JPA qui se référencent mutuellement et dont on sérialise l'une entraînent l'autre, qui entraîne la première, indéfiniment. L'erreur n'a alors rien d'une récursion écrite à la main — elle vient de la bibliothèque, et la correction consiste à couper le cycle par une annotation ou un DTO.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ne jamais rattraper un StackOverflowError",
      text: "C'est une `Error`, pas une `Exception` : elle signale que la machine virtuelle est dans un état dont on ne peut pas raisonnablement se remettre. La rattraper laisse l'application dans un état indéterminé et masque un bug qui, lui, reste présent. La seule réponse correcte est de corriger la récursion — ou d'admettre que la profondeur dépasse ce que la pile peut porter.",
    },
    {
      kind: "text",
      text: "La profondeur réellement atteignable dépend de la taille des cadres, donc du nombre de variables locales et de paramètres de chaque méthode. Une récursion sur une méthode courte descend beaucoup plus loin qu'une récursion sur une méthode chargée — ce qui explique qu'un même algorithme déborde chez l'un et pas chez l'autre, et rend illusoire tout raisonnement sur un nombre d'appels précis.",
    },
    {
      kind: "text",
      text: "Signalons enfin que chaque thread paie sa propre pile : créer dix mille threads de plateforme réserve dix mille fois `-Xss`, soit plusieurs gigaoctets hors tas. C'est l'une des raisons pour lesquelles les threads virtuels, dont la pile vit sur le tas et grandit à la demande, changent l'échelle de ce qui est possible.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "java-jvm-04",
    difficulty: 2,
    tags: ["jvm", "pile"],
    prompt: "Que se passe-t-il à l'exécution de `compte(5)` ?",
    code: {
      language: "java",
      code: `static int compte(int n) {
    return 1 + compte(n - 1);
}

public static void main(String[] args) {
    System.out.println(compte(5));
}`,
    },
    choices: [
      "Une `StackOverflowError` : aucune condition d'arrêt, l'argument décroît indéfiniment.",
      "Le programme affiche 5, la récursion s'arrêtant quand `n` atteint zéro.",
      "Une `OutOfMemoryError` : les appels remplissent le tas.",
      "Le programme affiche 0 après un débordement silencieux de `n`.",
    ],
    answer: 0,
    explanation:
      "Rien n'arrête la descente : `n` passe par zéro puis continue vers les négatifs. Chaque appel empile un cadre, et la pile — de l'ordre du mégaoctet — déborde après quelques milliers d'appels. C'est bien la pile qui est en cause, pas le tas : `-Xmx` n'y changerait rien.",
  },
  {
    kind: "spot",
    id: "java-jvm-05",
    difficulty: 2,
    tags: ["jvm", "pile"],
    prompt: "Cet accesseur provoque un `StackOverflowError`. Quelle ligne ?",
    code: {
      language: "java",
      code: `public class Client {
    private String nom;

    public String getNom() {
        return getNom();
    }
}`,
    },
    faultyLine: 5,
    reasons: [
      "L'accesseur s'appelle lui-même au lieu de renvoyer le champ : récursion infinie.",
      "Le champ `nom` devrait être déclaré `final` pour être lisible.",
      "L'accesseur devrait être `static` pour éviter l'empilement des cadres.",
      "Il manque une vérification de nullité avant de renvoyer `nom`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Faute de frappe classique, souvent introduite par un renommage : `return getNom();` au lieu de `return nom;`. Chaque appel en empile un autre, sans condition d'arrêt. La trace est immédiatement parlante — une seule méthode répétée des milliers de fois — ce qui rend ce bug bien plus facile à diagnostiquer qu'une fuite mémoire.",
  },
  {
    kind: "recall",
    id: "java-jvm-06",
    difficulty: 2,
    tags: ["jvm", "pile"],
    prompt: "Comment lit-on une trace de `StackOverflowError`, et quand augmenter `-Xss` est-il légitime ?",
    explanation:
      "On cherche le **motif répété** : c'est lui le diagnostic. Une seule méthode répétée signale une récursion directe ; deux ou trois méthodes revenant en cycle signalent une récursion indirecte, plus discrète — un `equals` qui appelle `toString` qui rappelle `equals`, ou deux entités qui se référencent lors d'une sérialisation. Augmenter `-Xss` n'est légitime que dans un seul cas : l'algorithme est correct mais la donnée réelle est plus profonde que prévu, par exemple un arbre très déséquilibré. Si la condition d'arrêt est absente ou jamais atteinte, augmenter la pile ne fait que retarder l'erreur de quelques milliers d'appels. La parade durable pour une récursion légitimement profonde est de la convertir en itération avec une pile explicite, ce qui déplace le stockage sur le tas — Java n'optimisant pas les appels terminaux.",
    keyPoints: [
      "Le motif répété donne la cause : directe ou indirecte",
      "-Xss ne se justifie que si l'algorithme est correct",
      "Sinon il ne fait que retarder l'erreur",
      "Convertir en itération avec une pile explicite sur le tas",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Le tas et OutOfMemoryError
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-jvm-l3",
  title: "Le tas et OutOfMemoryError",
  blocks: [
    {
      kind: "text",
      text: "`OutOfMemoryError: Java heap space` est l'inverse du débordement de pile : sa trace ne dit presque rien. Elle pointe l'allocation qui a échoué — souvent l'agrandissement anodin d'une liste — alors que la cause est ailleurs, dans tout ce qui occupe le tas et refuse de le libérer.",
    },
    {
      kind: "text",
      text: "Le message signifie exactement ceci : le ramasse-miettes a été déclenché, il a tourné, et il n'a pas réussi à libérer assez de place pour l'allocation demandée. Ce n'est donc jamais « le ramasse-miettes n'a pas fait son travail » — c'est que les objets présents sont encore **atteignables**, donc légitimement vivants du point de vue de la machine.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Trois causes distinctes, souvent confondues.",
      code: `1. FUITE — des objets restent atteignables alors que
   le code n'en a plus l'usage. La consommation monte
   régulièrement et ne redescend jamais.

2. SOUS-DIMENSIONNEMENT — pas de fuite, mais le pic
   d'activité demande plus que -Xmx. La consommation
   monte et redescend, mais frôle le plafond.

3. ALLOCATION UNIQUE ÉNORME — charger un fichier de
   deux gigaoctets en mémoire d'un coup. La courbe est
   plate puis explose d'un seul bond.

→ Trois courbes différentes, trois corrections
  différentes. Regarder la courbe AVANT de régler.`,
    },
    {
      kind: "text",
      text: "Distinguer ces trois cas se fait en observant l'évolution de l'occupation du tas après chaque collecte majeure. Une fuite dessine un escalier qui ne redescend jamais ; un sous-dimensionnement dessine des dents de scie qui frôlent le plafond ; une allocation énorme dessine une courbe plate suivie d'un mur. Augmenter `-Xmx` ne règle durablement que le deuxième cas.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Obtenir la preuve plutôt que la deviner.",
      code: `# Capturer automatiquement l'état du tas au moment
# de l'erreur : à activer en production, par défaut.
java -XX:+HeapDumpOnOutOfMemoryError \\
     -XX:HeapDumpPath=/var/log/app/ \\
     -jar app.jar

# À chaud, sur un processus vivant :
jcmd <pid> GC.heap_dump /tmp/dump.hprof

# Vue rapide des classes les plus nombreuses :
jcmd <pid> GC.class_histogram | head -20

#  num  #instances  #bytes  class name
#    1:   4 812 004  231 M  byte[]
#    2:   4 811 009  115 M  java.lang.String
#    3:   4 810 998   77 M  com.example.SessionUtilisateur
#  → 4,8 millions de sessions : la question devient
#    « qui les retient ? », pas « pourquoi tant d'octets ? »`,
    },
    {
      kind: "text",
      text: "L'option de capture automatique devrait être active par défaut en production : elle transforme un incident sans explication en fichier analysable, pour un coût nul tant qu'aucune erreur ne survient. Sans elle, il faut attendre que le problème se reproduise, ce qui peut prendre des semaines et se produire à trois heures du matin.",
    },
    {
      kind: "comparison",
      title: "Deux façons de regarder un instantané du tas",
      left: {
        label: "L'histogramme",
        text: "Quelles classes occupent le plus de place, en nombre et en octets. Répond à « qu'est-ce qui remplit le tas ». Suffit souvent à orienter : un million de `SessionUtilisateur` désigne immédiatement la zone à examiner.",
      },
      right: {
        label: "Le chemin vers la racine",
        text: "Pour un objet donné, la chaîne de références qui le maintient atteignable. Répond à « **qui le retient** », qui est la vraie question. C'est ce que fournissent les analyseurs d'instantanés, et c'est ce qui désigne le coupable.",
      },
    },
    {
      kind: "text",
      text: "Cette distinction est décisive. L'histogramme dit ce qui s'accumule ; seul le chemin vers la racine dit pourquoi. Un million de sessions peut venir d'une `Map` statique jamais purgée, d'un cache sans limite, ou d'un écouteur enregistré et jamais retiré — trois causes qui produisent le même histogramme et demandent trois corrections différentes.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "L'OutOfMemoryError peut frapper ailleurs",
      text: "Quand le tas est saturé, l'allocation qui échoue est celle qui se présente — pas celle qui est fautive. Le code responsable a peut-être terminé son travail depuis longtemps, et c'est une requête innocente qui reçoit l'erreur. Lire la trace comme une désignation du coupable est le contresens le plus courant sur cette erreur.",
    },
    {
      kind: "text",
      text: "Une variante du message mérite d'être reconnue : `OutOfMemoryError: unable to create native thread`. Le tas n'est alors pas en cause du tout — c'est le système d'exploitation qui refuse de créer un thread de plus, faute de mémoire disponible pour sa pile ou par limite du nombre de processus. Augmenter `-Xmx` aggrave même la situation, en réduisant ce qui reste hors tas.",
    },
    {
      kind: "text",
      text: "Signalons enfin un mode de défaillance plus insidieux que l'erreur elle-même : l'application qui passe l'essentiel de son temps dans le ramasse-miettes sans jamais tomber. Elle répond, très lentement, et paraît en vie pour les sondes de disponibilité. L'option `-XX:+UseGCOverheadLimit`, active par défaut, finit par lever une erreur explicite dans ce cas — c'est un service à rendre plutôt qu'une gêne.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "java-jvm-07",
    difficulty: 2,
    tags: ["jvm", "memoire"],
    prompt: "Que signifie exactement `OutOfMemoryError: Java heap space` ?",
    choices: [
      "Le ramasse-miettes a tourné et n'a pas libéré assez de place : les objets présents sont encore atteignables.",
      "Le ramasse-miettes n'a pas été déclenché à temps par la machine virtuelle.",
      "Une seule allocation a dépassé la taille maximale d'un objet autorisée par la JVM.",
      "La mémoire du système d'exploitation est épuisée, indépendamment du réglage du tas.",
    ],
    answer: 0,
    explanation:
      "L'erreur n'est levée qu'après une collecte infructueuse. Les objets qui remplissent le tas sont donc, du point de vue de la machine, légitimement vivants — quelque chose les retient. La question à poser n'est jamais « pourquoi le ramasse-miettes n'a-t-il rien fait » mais « qui retient ces objets », et seul un chemin vers la racine y répond.",
  },
  {
    kind: "order",
    id: "java-jvm-08",
    difficulty: 2,
    tags: ["jvm", "diagnostic"],
    prompt: "Une application tombe en `OutOfMemoryError` en production. Remets le diagnostic dans l'ordre.",
    items: [
      "Regarder la courbe d'occupation du tas après collecte majeure : escalier, dents de scie, ou mur",
      "Récupérer l'instantané du tas capturé automatiquement à l'erreur",
      "Lire l'histogramme pour savoir quelles classes s'accumulent",
      "Suivre le chemin vers la racine pour savoir qui les retient",
      "Corriger la rétention, et seulement ensuite reconsidérer le dimensionnement",
    ],
    explanation:
      "La courbe distingue à elle seule les trois causes possibles — fuite, sous-dimensionnement, allocation unique énorme — et évite de régler le mauvais problème. L'histogramme dit ce qui s'accumule, mais seul le chemin vers la racine désigne le coupable : un million d'objets peut venir d'une map statique, d'un cache sans limite ou d'un écouteur jamais retiré.",
  },
  {
    kind: "recall",
    id: "java-jvm-09",
    difficulty: 2,
    tags: ["jvm", "diagnostic"],
    prompt: "Pourquoi la trace d'un `OutOfMemoryError` ne désigne-t-elle presque jamais le coupable ?",
    explanation:
      "Parce que l'allocation qui échoue est simplement celle qui se présente au moment où le tas est saturé, pas celle qui a rempli le tas. Le code responsable a souvent terminé son travail depuis longtemps — il a laissé derrière lui des objets qu'il retient sans le savoir — et c'est une requête innocente, en train d'agrandir une liste ou de créer une chaîne, qui reçoit l'erreur. Lire cette trace comme une désignation du fautif conduit à examiner un code parfaitement sain. Ce qui désigne réellement le coupable est l'instantané du tas, et plus précisément le chemin vers la racine des objets accumulés : la chaîne de références qui les maintient atteignables. D'où l'intérêt d'activer par défaut la capture automatique en production, qui transforme un incident sans explication en fichier analysable, pour un coût nul tant qu'aucune erreur ne survient.",
    keyPoints: [
      "L'allocation qui échoue n'est pas celle qui a rempli le tas",
      "Le code fautif a souvent fini depuis longtemps",
      "Seul le chemin vers la racine désigne ce qui retient les objets",
      "Activer HeapDumpOnOutOfMemoryError par défaut en production",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Le ramasse-miettes : atteignabilité et générations
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-jvm-l4",
  title: "Le ramasse-miettes : atteignabilité et générations",
  blocks: [
    {
      kind: "text",
      text: "On dit souvent que le ramasse-miettes libère les objets « dont personne ne se sert ». C'est faux, et cette approximation empêche de comprendre les fuites. Il libère les objets **inatteignables** — ceux qu'aucune chaîne de références ne relie plus à une racine. Un objet parfaitement inutile mais toujours référencé ne sera jamais libéré.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les racines, et ce qui en découle.",
      code: `RACINES (GC roots)
  · variables locales des piles de tous les threads
  · champs statiques des classes chargées
  · références JNI
  · threads vivants

        racine
          │
          ▼
      Session ──► Client ──► Commande      atteignables
                                            (conservés)

      Rapport ──► Ligne                    inatteignables
                                            (libérables)

→ « Inutile » n'est pas « inatteignable ». C'est toute
  la différence entre un objet mort et une fuite.`,
    },
    {
      kind: "text",
      text: "Le parcours part des racines et marque tout ce qu'il atteint ; le reste est libérable. Cette définition explique pourquoi les cycles ne posent aucun problème en Java : deux objets qui se référencent mutuellement mais que plus aucune racine n'atteint sont tous deux collectés — contrairement au comptage de références, qui les garderait indéfiniment.",
    },
    {
      kind: "text",
      text: "Le second principe est l'**hypothèse générationnelle** : la grande majorité des objets meurent très jeunes. Une variable locale, un objet intermédiaire dans une chaîne de traitement, un DTO le temps d'une requête — l'écrasante majorité des allocations ne survivent pas quelques millisecondes. Les collecteurs exploitent ce fait plutôt que de parcourir tout le tas à chaque fois.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le tas découpé, et le trajet d'un objet.",
      code: `JEUNE GÉNÉRATION                ANCIENNE GÉNÉRATION
┌──────┬───────┬───────┐        ┌──────────────────┐
│ Eden │ Surv0 │ Surv1 │        │    Tenured       │
└──────┴───────┴───────┘        └──────────────────┘
   ▲        ▲                            ▲
   │        │ copie des survivants       │ promotion après
   │        │ d'un espace à l'autre      │ N survies
   └ toute allocation naît ici

Collecte MINEURE : ne parcourt que la jeune génération.
  Rapide (quelques ms), fréquente. La plupart des objets
  y meurent et ne coûtent rien à libérer.

Collecte MAJEURE : parcourt l'ancienne génération.
  Beaucoup plus coûteuse, plus rare. C'est elle qui
  produit les pauses perceptibles.`,
    },
    {
      kind: "text",
      text: "Tout objet naît dans l'Eden. Quand celui-ci se remplit, une collecte mineure copie les survivants dans un espace de survivants, et l'Eden est vidé d'un coup — libérer y coûte donc presque rien, puisque la quasi-totalité est morte. Un objet qui survit à plusieurs collectes est promu dans l'ancienne génération, où il ne sera plus examiné que lors des collectes majeures.",
    },
    {
      kind: "comparison",
      title: "Deux collectes, deux coûts",
      left: {
        label: "Mineure",
        text: "Ne parcourt que la jeune génération. Quelques millisecondes, très fréquente, et proportionnelle au nombre de **survivants**, pas au nombre d'objets alloués. Allouer beaucoup d'objets éphémères est donc peu coûteux en Java.",
      },
      right: {
        label: "Majeure",
        text: "Parcourt l'ancienne génération, bien plus grande. Coûteuse, plus rare, et responsable des pauses perceptibles. Sa fréquence dépend du rythme de **promotion** : plus d'objets survivent longtemps, plus elle revient souvent.",
      },
    },
    {
      kind: "text",
      text: "Cette asymétrie a une conséquence contre-intuitive pour qui vient d'un langage à gestion manuelle : créer beaucoup de petits objets éphémères n'est pas un problème de performance en Java. Ce qui coûte, c'est de faire **survivre** des objets — un cache trop généreux, des tampons conservés, des collections qui grossissent — car chaque survie rapproche la promotion, et chaque promotion alourdit les collectes majeures.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Ne jamais appeler System.gc()",
      text: "Cet appel n'est qu'une **suggestion**, que la machine virtuelle peut ignorer. Quand elle l'honore, elle déclenche une collecte complète — donc une pause maximale — au moment le moins opportun, choisi par le code applicatif plutôt que par un algorithme qui observe le tas en continu. Le trouver dans une base de code signale presque toujours un contournement de fuite plutôt qu'une optimisation.",
    },
    {
      kind: "text",
      text: "Deux mécanismes voisins méritent une mise en garde. Les finaliseurs sont dépréciés et ne doivent plus être utilisés : leur exécution n'est ni garantie ni ordonnée, et ils retardent la libération d'une collecte entière. `Cleaner` les remplace pour les ressources natives, mais la réponse ordinaire reste le try-avec-ressources — libérer explicitement vaut toujours mieux qu'espérer que le ramasse-miettes s'en charge.",
    },
    {
      kind: "text",
      text: "Retenons les deux idées qui commandent tout le reste : le ramasse-miettes raisonne en atteignabilité, pas en utilité — c'est ce qui définit une fuite ; et il exploite le fait que les objets meurent jeunes — c'est ce qui rend l'allocation bon marché et la survie coûteuse.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "java-jvm-10",
    difficulty: 2,
    tags: ["jvm", "gc"],
    prompt: "Deux objets se référencent mutuellement et plus aucune racine ne les atteint. Que se passe-t-il ?",
    choices: [
      "Ils sont tous deux collectés : le parcours part des racines, un cycle isolé n'est pas atteignable.",
      "Ils ne sont jamais collectés : leur compteur de références ne tombe jamais à zéro.",
      "Ils sont collectés seulement après un appel explicite à `System.gc()`.",
      "Ils sont promus dans l'ancienne génération et y restent jusqu'à l'arrêt de la JVM.",
    ],
    answer: 0,
    explanation:
      "Java n'utilise pas le comptage de références mais le parcours d'atteignabilité depuis les racines. Un cycle isolé n'est atteint par aucune racine, donc collecté normalement. C'est précisément l'avantage de cette approche sur le comptage de références, qui garderait ces objets indéfiniment.",
  },
  {
    kind: "match",
    id: "java-jvm-11",
    difficulty: 2,
    tags: ["jvm", "gc"],
    prompt: "Associe chaque élément à son rôle dans le modèle générationnel.",
    pairs: [
      { left: "Eden", right: "Où naît toute allocation, vidé à chaque collecte mineure" },
      { left: "Espaces de survivants", right: "Accueillent les objets qui ont survécu, par copie" },
      { left: "Ancienne génération", right: "Objets promus après plusieurs survies" },
      { left: "Collecte majeure", right: "Parcourt l'ancienne génération, responsable des pauses" },
    ],
    explanation:
      "Le coût d'une collecte mineure est proportionnel au nombre de **survivants**, pas au nombre d'objets alloués : l'Eden est vidé d'un bloc. C'est pourquoi allouer beaucoup d'objets éphémères coûte peu en Java, tandis que faire survivre des objets alourdit les collectes majeures.",
  },
  {
    kind: "recall",
    id: "java-jvm-12",
    difficulty: 3,
    tags: ["jvm", "gc"],
    prompt: "Pourquoi « inutile » et « collectable » ne sont-ils pas la même chose ?",
    explanation:
      "Parce que le ramasse-miettes raisonne en **atteignabilité**, pas en utilité. Il part des racines — variables locales des piles de tous les threads, champs statiques des classes chargées, références natives, threads vivants — et marque tout ce qu'il atteint ; seul le reste est libéré. Un objet dont plus personne ne se sert, mais qu'une chaîne de références relie encore à une racine, est donc conservé indéfiniment : c'est exactement la définition d'une fuite mémoire en Java. La machine ne peut pas deviner l'intention du programme, elle ne peut que constater les références. C'est aussi ce qui explique pourquoi une fuite ne se corrige jamais en réglant le ramasse-miettes ou en augmentant le tas : il faut trouver et couper la référence qui retient, ce que seul un chemin vers la racine dans un instantané du tas permet de faire.",
    keyPoints: [
      "Le critère est l'atteignabilité depuis une racine, pas l'utilité",
      "Un objet inutile mais référencé est conservé : c'est une fuite",
      "La machine ne peut constater que les références, pas l'intention",
      "On corrige en coupant la référence, pas en réglant le GC",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Les collecteurs et les pauses
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "java-jvm-l5",
  title: "Les collecteurs et les pauses",
  blocks: [
    {
      kind: "text",
      text: "Libérer la mémoire demande, à un moment ou à un autre, d'arrêter brièvement les threads applicatifs pour examiner l'état du tas de façon cohérente. Ces arrêts s'appellent des pauses, et toute l'histoire des collecteurs consiste à les raccourcir — au prix d'une consommation de processeur et de mémoire plus élevée.",
    },
    {
      kind: "text",
      text: "Le compromis se pose sur trois axes qui ne peuvent pas être optimisés ensemble : le **débit**, c'est-à-dire la part du temps consacrée au travail utile ; la **latence**, c'est-à-dire la durée des pauses ; et l'**empreinte mémoire**. Améliorer l'un dégrade au moins l'un des deux autres, et le choix d'un collecteur revient à décider lequel sacrifier.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les collecteurs à connaître, et pour quoi.",
      code: `SerialGC        Un seul thread. Petits tas, conteneurs
  -XX:+UseSerialGC          minuscules, outils en ligne
                            de commande. Pauses longues
                            mais empreinte minimale.

ParallelGC      Plusieurs threads, priorité au DÉBIT.
  -XX:+UseParallelGC        Traitements par lots où une
                            pause d'une seconde est sans
                            importance.

G1GC            Défaut depuis Java 9. Tas découpé en
  -XX:+UseG1GC              régions, objectif de pause
  -XX:MaxGCPauseMillis=200  configurable. Bon compromis
                            pour un serveur ordinaire.

ZGC             Pauses sous la milliseconde, quelle que
  -XX:+UseZGC               soit la taille du tas. Pour
                            les très gros tas et les
                            exigences de latence fortes.`,
    },
    {
      kind: "text",
      text: "G1 est le défaut depuis Java 9 et convient à la grande majorité des applications. Sa particularité est de découper le tas en régions plutôt qu'en deux grands blocs, ce qui lui permet de collecter en priorité celles qui contiennent le plus de déchets — d'où son nom, *garbage first* — et de viser un objectif de pause fixé par configuration plutôt que de traiter tout le tas d'un coup.",
    },
    {
      kind: "comparison",
      title: "Deux profils opposés",
      left: {
        label: "Priorité au débit",
        text: "ParallelGC. On accepte des pauses longues mais rares pour maximiser le travail utile. Le bon choix pour un traitement par lots nocturne, où personne n'attend une réponse et où seule compte la durée totale.",
      },
      right: {
        label: "Priorité à la latence",
        text: "G1, et ZGC au-delà. On accepte de consacrer plus de processeur et de mémoire à la collecte pour que personne n'attende. Le bon choix pour une API dont le percentile 99 des temps de réponse est surveillé.",
      },
    },
    {
      kind: "text",
      text: "`MaxGCPauseMillis` est un **objectif**, pas une garantie : G1 ajuste la quantité de travail par cycle pour s'en approcher. Le fixer trop bas — dix millisecondes, par exemple — conduit le collecteur à faire de tout petits cycles très fréquents, à ne plus suivre le rythme d'allocation, et finalement à déclencher une collecte complète bien plus longue que ce qu'on voulait éviter.",
    },
    {
      kind: "text",
      text: "C'est le piège du réglage : la plupart des paramètres de ramasse-miettes rendent les choses pires lorsqu'ils sont modifiés sans mesure. L'ordre correct est d'observer les journaux de collecte, d'identifier ce qui coûte — pauses trop longues, trop fréquentes, promotion excessive — puis de ne changer qu'une chose à la fois en vérifiant l'effet.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Mesurer avant de régler.",
      code: `# Journaux de collecte, format unifié depuis Java 9
java -Xlog:gc*:file=gc.log:time,uptime -jar app.jar

# Ce qu'on y cherche :
#  · durée et fréquence des pauses
#  · occupation du tas APRÈS chaque collecte majeure
#    → si elle monte régulièrement : fuite
#  · rythme de promotion vers l'ancienne génération
#  · présence de « Full GC (Allocation Failure) »
#    → le collecteur ne suit plus`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le réglage ne corrige pas une fuite",
      text: "Changer de collecteur, augmenter le tas ou baisser l'objectif de pause peut retarder une `OutOfMemoryError` de quelques heures. Cela ne libère aucun objet retenu, et le problème revient — souvent au pire moment, avec un tas plus gros et donc des pauses plus longues. Devant une occupation qui monte après chaque collecte majeure, la seule action utile est l'instantané du tas.",
    },
    {
      kind: "text",
      text: "Un détail de vocabulaire évite un contresens fréquent : les collecteurs modernes ne sont pas « sans pause » mais « à pause courte ». ZGC et Shenandoah effectuent l'essentiel de leur travail en parallèle de l'application, et ne l'arrêtent que sur des phases très brèves. Le gain se paie en processeur et en mémoire — le compromis n'a pas disparu, il a été déplacé.",
    },
    {
      kind: "text",
      text: "Une bonne réponse en entretien tient donc en deux temps : nommer le compromis entre débit, latence et empreinte, puis dire qu'on ne règle rien sans avoir lu les journaux de collecte. Beaucoup de candidats récitent une liste de collecteurs ; peu disent qu'ils commenceraient par mesurer, ce qui est pourtant la seule pratique qui distingue une intervention d'un tâtonnement.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "fill",
    id: "java-jvm-13",
    difficulty: 2,
    tags: ["jvm", "gc"],
    prompt: "Complète les options : journaliser les collectes, et viser une durée de pause.",
    code: {
      language: "bash",
      code: `# Journaux de collecte, format unifie depuis Java 9
java -Xlog:{{1}} -jar app.jar

# Objectif de pause vise par G1 (un objectif, pas
# une garantie)
java -XX:{{2}}=200 -XX:+UseG1GC -jar app.jar`,
    },
    blanks: ["gc*", "MaxGCPauseMillis"],
    distractors: ["all", "MaxHeapSize", "GCTimeRatio"],
    explanation:
      "`-Xlog:gc*` active les journaux de collecte, seule source qui montre l'occupation du tas après chaque collecte majeure — la courbe qui distingue une fuite d'un sous-dimensionnement. `MaxGCPauseMillis` est un objectif que G1 vise en ajustant le travail par cycle : `MaxHeapSize` fixe la taille du tas, ce qui est un autre sujet.",
  },
  {
    kind: "mcq",
    id: "java-jvm-14",
    difficulty: 3,
    tags: ["jvm", "gc"],
    prompt: "Fixer `-XX:MaxGCPauseMillis=10` sur une application chargée avec G1 : quel risque ?",
    choices: [
      "Le collecteur fait des cycles minuscules très fréquents, ne suit plus l'allocation, et finit par déclencher une collecte complète bien plus longue.",
      "La JVM refuse de démarrer, la valeur étant sous le minimum autorisé.",
      "Les pauses sont garanties sous 10 ms, au prix d'une consommation mémoire doublée.",
      "Le collecteur bascule automatiquement sur ZGC, seul capable de tenir cet objectif.",
    ],
    answer: 0,
    explanation:
      "C'est un objectif, pas une garantie : G1 réduit la quantité de travail par cycle pour s'en approcher. Trop bas, il ne récupère plus assez de mémoire par cycle pour suivre le rythme d'allocation, l'ancienne génération se remplit, et une collecte complète survient — exactement la longue pause qu'on cherchait à éviter.",
  },
  {
    kind: "recall",
    id: "java-jvm-15",
    difficulty: 2,
    tags: ["jvm", "gc", "diagnostic"],
    prompt: "Que cherche-t-on dans des journaux de collecte, et pourquoi avant tout réglage ?",
    explanation:
      "Quatre choses. La **durée et la fréquence des pauses**, qui disent si le problème est la latence ou le débit. L'**occupation du tas après chaque collecte majeure** : si elle monte régulièrement au lieu de revenir à un palier, il y a une fuite, et aucun réglage ne la corrigera. Le **rythme de promotion** vers l'ancienne génération, qui explique la fréquence des collectes majeures. Et la présence de collectes complètes déclenchées par échec d'allocation, signe que le collecteur ne suit plus le rythme. On regarde avant de régler parce que la plupart des paramètres empirent les choses quand on les change à l'aveugle : baisser l'objectif de pause peut provoquer la longue pause qu'on voulait éviter, et augmenter le tas ne fait que retarder une fuite tout en allongeant les pauses futures.",
    keyPoints: [
      "Durée et fréquence des pauses : latence ou débit ?",
      "Occupation après collecte majeure : si elle monte, c'est une fuite",
      "Rythme de promotion, et collectes complètes par échec d'allocation",
      "Régler à l'aveugle empire souvent la situation",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Les fuites mémoire en Java
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "java-jvm-l6",
  title: "Les fuites mémoire en Java",
  blocks: [
    {
      kind: "text",
      text: "« Java n'a pas de fuites mémoire, il y a un ramasse-miettes » est une phrase qu'on entend encore, et elle est fausse. Java supprime une catégorie de fuites — celles où l'on oublie de libérer — et en laisse une autre entière : celles où l'on oublie de **relâcher une référence**. Le résultat est le même, la mémoire ne revient jamais.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La collection statique qui grossit indéfiniment.",
      code: `public class Cache {
    // static : atteignable depuis une racine pour
    // toute la durée de vie de l'application.
    private static final Map<String, Session> SESSIONS =
            new HashMap<>();

    public static void ouvre(String id, Session s) {
        SESSIONS.put(id, s);
    }
    // …et rien ne retire jamais rien.
}

// Chaque session ouverte est retenue pour toujours.
// La courbe du tas monte en escalier, sans redescendre.`,
    },
    {
      kind: "text",
      text: "C'est la fuite la plus fréquente et la plus simple : une collection atteignable depuis une racine, dans laquelle on ajoute sans jamais retirer. Le mot `static` est le signal — il garantit l'atteignabilité pour toute la durée de vie de l'application. Toute collection statique qui grandit doit avoir, quelque part, une politique d'éviction explicite.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois autres motifs classiques.",
      code: `// 1. L'écouteur enregistré et jamais retiré
service.ajouteEcouteur(this);     // et pas de retrait
// L'objet qui écoute reste atteignable depuis le
// service, souvent bien plus durable que lui.

// 2. La classe interne non statique
class Fenetre {
    class Ecouteur { }            // référence implicite
}                                 // vers la Fenetre entière
// Conserver un Ecouteur retient toute la Fenetre.
// → la déclarer « static » coupe le lien.

// 3. La ressource non fermée
InputStream in = new FileInputStream(f);   // sans try
// Descripteur système ET tampons associés retenus.
// → try-with-resources, systématiquement.`,
    },
    {
      kind: "text",
      text: "L'écouteur non retiré est particulièrement traître parce que le code paraît symétrique : on enregistre à la création, on suppose que la destruction s'occupe du reste. En réalité rien ne se produit à la destruction — l'objet n'est jamais détruit puisqu'il reste atteignable depuis le service. Le remède est de retirer explicitement, ou d'utiliser des références faibles.",
    },
    {
      kind: "comparison",
      title: "Deux façons de rendre un cache sûr",
      left: {
        label: "Limite et éviction",
        text: "Un cache borné qui évince selon une politique — le moins récemment utilisé, une durée de vie. C'est l'approche à préférer : le comportement est explicite, prévisible, et le plafond de mémoire est connu à l'avance.",
      },
      right: {
        label: "Références faibles",
        text: "`WeakHashMap` laisse le ramasse-miettes retirer une entrée dès que la clé n'est plus atteignable ailleurs. Élégant, mais le moment de l'éviction est imprévisible, et une valeur qui référence sa propre clé annule tout l'effet.",
      },
    },
    {
      kind: "text",
      text: "Le piège de `WeakHashMap` mérite d'être connu car il annule silencieusement la protection : si la **valeur** stockée contient une référence vers sa clé, la clé reste atteignable, l'entrée n'est jamais retirée, et l'on obtient une `HashMap` ordinaire avec la fausse impression d'être protégé. Le même raisonnement vaut pour toute structure fondée sur des références faibles.",
    },
    {
      kind: "text",
      text: "Une fuite se diagnostique par une courbe avant de se diagnostiquer par un instantané. On laisse tourner l'application sous charge, on observe l'occupation du tas **après chaque collecte majeure**, et l'on cherche une progression régulière. Si le palier monte, il y a rétention ; l'instantané dira ensuite quoi, et le chemin vers la racine dira qui.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Comparer deux instantanés vaut mieux qu'un",
      text: "Un instantané isolé montre ce qui occupe le tas, ce qui est normal en grande partie. Deux instantanés pris à une heure d'intervalle, comparés, montrent ce qui a **augmenté** — et c'est exactement la fuite. La plupart des analyseurs proposent cette comparaison, et elle réduit souvent le diagnostic à quelques minutes.",
    },
    {
      kind: "text",
      text: "Un dernier motif mérite d'être cité parce qu'il touche les applications web : les variables de thread non nettoyées. Un `ThreadLocal` renseigné pendant une requête et jamais retiré reste attaché au thread, qui retourne au pool et vit indéfiniment — la valeur avec lui. Sur un pool de deux cents threads, cela retient deux cents objets pour toujours, et le filtre qui devait nettoyer est souvent celui qu'on a oublié d'écrire.",
    },
    {
      kind: "text",
      text: "Retenons la définition qui rend le sujet clair : en Java, une fuite est une **rétention involontaire**. Le ramasse-miettes fait exactement son travail — il conserve ce qui est atteignable — et c'est le programme qui garde une référence dont il n'a plus l'usage. Chercher un défaut du collecteur est une impasse ; chercher qui retient est toujours la bonne question.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "spot",
    id: "java-jvm-16",
    difficulty: 2,
    tags: ["jvm", "fuites"],
    prompt: "Ce cache fait monter la mémoire en escalier. Quelle ligne est en cause ?",
    code: {
      language: "java",
      code: `public class Cache {
    private static final Map<String, Session> SESSIONS = new HashMap<>();

    public static void ouvre(String id, Session s) {
        SESSIONS.put(id, s);
    }

    public static Session get(String id) {
        return SESSIONS.get(id);
    }
}`,
    },
    faultyLine: 2,
    reasons: [
      "Une collection statique sans politique d'éviction : atteignable pour toute la vie de l'application, elle ne rend jamais rien.",
      "`HashMap` n'est pas thread-safe, ce qui provoque une perte d'entrées.",
      "`get` devrait renvoyer un `Optional` plutôt qu'une valeur possiblement nulle.",
      "Les clés de type `String` empêchent le ramasse-miettes de collecter les entrées.",
    ],
    reasonAnswer: 0,
    explanation:
      "`static` garantit l'atteignabilité depuis une racine pour toute la durée de vie de l'application : tout ce qui entre dans cette map y reste. Toute collection statique qui grandit doit avoir une politique d'éviction explicite — taille maximale, durée de vie — ou un retrait symétrique de l'ajout. L'absence de thread-safety est un vrai défaut, mais ce n'est pas la fuite.",
  },
  {
    kind: "mcq",
    id: "java-jvm-17",
    difficulty: 3,
    tags: ["jvm", "fuites"],
    prompt: "Dans quel cas une `WeakHashMap` n'empêche-t-elle pas la fuite ?",
    choices: [
      "Quand la valeur stockée référence sa propre clé : la clé reste atteignable et l'entrée n'est jamais retirée.",
      "Quand les clés sont des chaînes de caractères, qui ne sont jamais collectées.",
      "Quand la map est déclarée `static`, ce qui annule la faiblesse des références.",
      "Quand plusieurs threads y accèdent simultanément.",
    ],
    answer: 0,
    explanation:
      "Une référence faible ne retient pas la clé — mais la valeur, elle, est référencée fortement par la map. Si cette valeur contient une référence vers sa clé, la clé reste atteignable, l'entrée n'est jamais évincée, et l'on obtient une `HashMap` ordinaire avec la fausse impression d'être protégé. C'est pourquoi une limite explicite et une politique d'éviction sont plus fiables.",
  },
  {
    kind: "recall",
    id: "java-jvm-18",
    difficulty: 2,
    tags: ["jvm", "fuites"],
    prompt: "Cite les motifs de fuite les plus fréquents en Java.",
    explanation:
      "Le premier est la **collection statique sans éviction** : le mot `static` garantit l'atteignabilité pour toute la vie de l'application, et tout ce qui y entre y reste. Le deuxième est l'**écouteur enregistré et jamais retiré** : le code paraît symétrique, on suppose que la destruction s'en charge, mais l'objet n'est jamais détruit puisque le service — souvent bien plus durable que lui — le retient. Le troisième est la **classe interne non statique**, qui porte une référence implicite vers son instance englobante : conserver un petit écouteur retient alors toute la fenêtre, et il suffit de la déclarer `static` pour couper le lien. Le quatrième est la **ressource non fermée**, qui retient un descripteur système et ses tampons — d'où le try-avec-ressources systématique. Le point commun est toujours le même : une rétention involontaire, le ramasse-miettes faisant exactement son travail.",
    keyPoints: [
      "Collection statique sans politique d'éviction",
      "Écouteur enregistré et jamais retiré",
      "Classe interne non statique : référence implicite vers l'englobante",
      "Ressource non fermée : descripteur et tampons retenus",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Le chargement de classes
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "java-jvm-l7",
  title: "Le chargement de classes",
  blocks: [
    {
      kind: "text",
      text: "Une classe Java n'existe pas au démarrage : elle est chargée à sa première utilisation, vérifiée, préparée, puis initialisée. Ce mécanisme est invisible tant que tout va bien, et devient soudain le sujet du jour quand apparaît une `NoClassDefFoundError` ou, pire, un `ClassCastException` entre deux classes portant exactement le même nom.",
    },
    {
      kind: "code",
      language: "text",
      caption: "La hiérarchie de délégation, et sa règle.",
      code: `Bootstrap   ──►  les classes du JDK (java.lang, …)
    ▲
Platform    ──►  modules de la plateforme
    ▲
Application ──►  votre code et vos dépendances
    ▲
(éventuels chargeurs applicatifs : serveurs, greffons)

RÈGLE DE DÉLÉGATION : avant de charger une classe,
un chargeur demande d'abord à son PARENT. Il ne charge
lui-même que si le parent ne sait pas.

→ Conséquence : votre java.lang.String ne sera jamais
  chargé. Le bootstrap répond en premier, toujours.`,
    },
    {
      kind: "text",
      text: "La délégation vers le parent est ce qui protège la plateforme : impossible de substituer sa propre implémentation d'une classe du JDK, puisque le chargeur d'amorçage répond avant tout le monde. C'est une propriété de sécurité autant que de cohérence, et elle explique pourquoi certaines astuces de remplacement de classes échouent silencieusement.",
    },
    {
      kind: "text",
      text: "Une conséquence surprend souvent : l'**identité** d'une classe n'est pas son nom pleinement qualifié, mais le couple formé par ce nom et le chargeur qui l'a chargée. Deux chargeurs différents produisent donc deux classes distinctes, incompatibles entre elles, alors même que le nom et le code sont identiques.",
    },
    {
      kind: "code",
      language: "text",
      caption: "L'erreur qui laisse perplexe.",
      code: `java.lang.ClassCastException:
  com.example.Client cannot be cast to com.example.Client

→ Le message n'est pas absurde : ce sont bien deux
  classes différentes, chargées par deux chargeurs
  différents. Se produit typiquement quand la même
  bibliothèque est présente à la fois dans le serveur
  d'applications et dans le paquet déployé.

java.lang.NoClassDefFoundError
→ La classe était là à la compilation, absente à
  l'exécution : dépendance manquante dans le paquet,
  ou portée « provided » mal choisie.

java.lang.ClassNotFoundException
→ Chargement dynamique par nom (Class.forName) sans
  que la classe soit sur le chemin.`,
    },
    {
      kind: "text",
      text: "Ces trois erreurs se ressemblent et n'ont pas les mêmes causes. `NoClassDefFoundError` signale une classe présente à la compilation mais absente à l'exécution — presque toujours une dépendance oubliée dans le paquet livré, ou déclarée avec une portée qui l'exclut. `ClassNotFoundException` vient d'un chargement par nom, à l'exécution, sur une classe introuvable.",
    },
    {
      kind: "comparison",
      title: "Deux moments qu'on confond",
      left: {
        label: "Chargement",
        text: "Lecture du fichier de classe, vérification du code intermédiaire, préparation des champs statiques à leurs valeurs par défaut. Se produit à la première référence à la classe, sans exécuter le moindre code applicatif.",
      },
      right: {
        label: "Initialisation",
        text: "Exécution des blocs statiques et des initialisateurs de champs statiques. Se produit **plus tard**, à la première utilisation réelle — première instance, premier accès à un champ statique non constant. Une seule fois, de façon sûre.",
      },
    },
    {
      kind: "text",
      text: "Cette séparation explique le comportement du singleton par classe interne : la classe porteuse n'est initialisée qu'au premier appel à la méthode d'accès, et la machine virtuelle garantit que cette initialisation est exécutée une seule fois, même sous accès concurrent. On obtient une initialisation paresseuse et sûre sans le moindre verrou explicite.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une exception dans un bloc statique est définitive",
      text: "Si l'initialisation d'une classe échoue, la machine virtuelle la marque comme erronée. Tout accès ultérieur lève alors `NoClassDefFoundError` — et non l'exception d'origine, qui n'apparaît que dans la toute première trace. C'est pourquoi la première erreur d'un démarrage est presque toujours la seule à contenir l'information utile ; les suivantes sont des conséquences.",
    },
    {
      kind: "text",
      text: "Le chargement paresseux a une conséquence pratique dont on se souvient au premier incident : une classe absente du paquet livré ne provoque aucune erreur au démarrage. L'application démarre normalement et tombe des heures plus tard, à la première requête qui emprunte le chemin concerné. C'est l'un des arguments les plus solides en faveur d'un test qui exerce réellement chaque route avant la mise en production.",
    },
    {
      kind: "text",
      text: "Signalons enfin que le métaspace se remplit de ces classes chargées, et qu'il n'est pas borné par défaut. Une application qui génère des classes à la volée — proxys dynamiques, moteurs d'expressions, rechargement à chaud — sans jamais libérer les chargeurs correspondants peut épuiser la mémoire de la machine sans que le tas ne bouge. Le diagnostic passe alors par `-XX:MaxMetaspaceSize` et le suivi du nombre de classes chargées.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "java-jvm-19",
    difficulty: 3,
    tags: ["jvm", "classloading"],
    prompt: "Comment un `ClassCastException: com.example.Client cannot be cast to com.example.Client` est-il possible ?",
    choices: [
      "L'identité d'une classe est le couple nom + chargeur : deux chargeurs produisent deux classes distinctes.",
      "Le message est un bug connu de la JVM lors du chargement concurrent.",
      "La classe a été recompilée avec une version différente du JDK entre-temps.",
      "L'un des deux objets est en réalité un proxy dynamique portant le même nom.",
    ],
    answer: 0,
    explanation:
      "Le message n'est pas absurde : ce sont bien deux classes différentes. Une classe est identifiée par son nom pleinement qualifié **et** par le chargeur qui l'a chargée. Le cas typique est la même bibliothèque présente à la fois dans le serveur d'applications et dans le paquet déployé, chargée par deux chargeurs distincts.",
  },
  {
    kind: "match",
    id: "java-jvm-20",
    difficulty: 2,
    tags: ["jvm", "classloading"],
    prompt: "Associe chaque erreur à sa cause.",
    pairs: [
      { left: "NoClassDefFoundError", right: "Présente à la compilation, absente à l'exécution" },
      { left: "ClassNotFoundException", right: "Chargement par nom d'une classe hors du chemin" },
      { left: "ClassCastException entre deux classes homonymes", right: "Deux chargeurs différents, donc deux classes distinctes" },
      { left: "ExceptionInInitializerError", right: "Un bloc statique a échoué à l'initialisation" },
    ],
    explanation:
      "Ces erreurs se ressemblent et n'ont pas les mêmes causes. Un point pratique s'ajoute : si l'initialisation d'une classe échoue, la JVM la marque comme erronée et tout accès ultérieur lève `NoClassDefFoundError` — l'exception d'origine n'apparaissant que dans la toute première trace. La première erreur d'un démarrage est donc souvent la seule utile.",
  },
  {
    kind: "recall",
    id: "java-jvm-21",
    difficulty: 2,
    tags: ["jvm", "classloading"],
    prompt: "Quelle différence entre le chargement et l'initialisation d'une classe ?",
    explanation:
      "Le **chargement** lit le fichier de classe, vérifie le code intermédiaire et prépare les champs statiques à leurs valeurs par défaut ; il se produit à la première référence à la classe et n'exécute aucun code applicatif. L'**initialisation** exécute les blocs statiques et les initialisateurs de champs statiques ; elle se produit plus tard, à la première utilisation réelle — première instance créée, ou premier accès à un champ statique non constant. La machine virtuelle garantit qu'elle a lieu une seule fois et de façon sûre même sous accès concurrent, ce qui est exactement ce qui rend correct le singleton par classe interne : initialisation paresseuse sans le moindre verrou. Une conséquence pratique importante : si un bloc statique échoue, la classe est marquée erronée et tout accès ultérieur lève `NoClassDefFoundError`, sans plus jamais montrer l'exception d'origine.",
    keyPoints: [
      "Chargement : lecture, vérification, valeurs par défaut",
      "Initialisation : blocs statiques, plus tard, à la première utilisation",
      "Garantie une seule fois, y compris sous accès concurrent",
      "Un échec marque la classe erronée : l'erreur d'origine disparaît",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Diagnostiquer une JVM
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "java-jvm-l8",
  title: "Diagnostiquer une JVM",
  blocks: [
    {
      kind: "text",
      text: "Devant une application lente ou instable, la tentation est de formuler une hypothèse et de régler un paramètre. C'est l'inverse de la démarche efficace : les symptômes d'une saturation du tas, d'une contention de verrous et d'une saturation d'un pool ressemblent tous à « c'est lent », et seule l'observation les distingue.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Les outils du JDK, dans l'ordre où on les sort.",
      code: `jcmd <pid> help              # ce que ce processus accepte

jcmd <pid> Thread.print       # vidage de threads : blocages,
                              # interblocages, contention
jcmd <pid> GC.heap_info       # occupation des générations
jcmd <pid> GC.class_histogram # ce qui remplit le tas
jcmd <pid> GC.heap_dump /tmp/d.hprof
jcmd <pid> VM.native_memory summary   # hors tas
                              # (avec -XX:NativeMemoryTracking)

# Enregistrement continu, très peu coûteux :
java -XX:StartFlightRecording=duration=120s,filename=r.jfr

# jcmd remplace jstack, jmap et jinfo, qui restent
# présents mais sont considérés comme dépassés.`,
    },
    {
      kind: "text",
      text: "`jcmd` est le point d'entrée unique et devrait être le premier réflexe : il donne l'état des threads, l'occupation des générations, l'histogramme des classes et l'instantané du tas sans rien installer. Il fonctionne sur un processus vivant, sans le redémarrer — un point décisif, puisqu'un redémarrage efface précisément l'état qu'on cherchait à observer.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Du symptôme à l'outil.",
      code: `« L'application ne répond plus »
  → Thread.print, deux ou trois fois à quelques
    secondes d'intervalle. Threads BLOCKED sur le même
    moniteur, ou section « Found one Java-level deadlock ».

« Elle ralentit progressivement, puis tombe »
  → journaux de collecte. Occupation APRÈS collecte
    majeure qui monte = fuite → instantané du tas.

« Elle est tuée sans erreur, en conteneur »
  → mémoire hors tas. VM.native_memory, nombre de
    threads, tampons directs. Le tas n'est pas en cause.

« Un pic de latence régulier »
  → journaux de collecte : pauses majeures. Ou une
    tâche planifiée, visible dans un enregistrement JFR.`,
    },
    {
      kind: "text",
      text: "Ce tableau vaut mieux qu'une liste d'outils : il part du symptôme observable, qui est ce dont on dispose réellement au moment de l'incident. Un ralentissement progressif suivi d'une chute désigne la mémoire ; un blocage net désigne les threads ; une mort sans trace en conteneur désigne le hors tas. Trois chemins distincts, trois premières commandes différentes.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'observer",
      left: {
        label: "À la demande",
        text: "`jcmd` au moment de l'incident. Gratuit tant qu'on ne s'en sert pas, mais suppose d'être présent pendant le problème — et un incident nocturne ne se laisse pas observer le lendemain matin.",
      },
      right: {
        label: "En continu",
        text: "Un enregistrement JFR tournant en permanence, avec un tampon circulaire. Coût de l'ordre du pour cent, et l'on dispose de l'historique **avant** l'incident, qui est justement la partie intéressante.",
      },
    },
    {
      kind: "text",
      text: "L'enregistrement continu est ce qui distingue une exploitation mûre. Un incident nocturne laisse alors un fichier contenant les minutes qui l'ont précédé — allocations, pauses, verrous, entrées-sorties — au lieu d'une trace unique et d'une supposition. Le coût est faible et l'activation tient en une option de démarrage.",
    },
    {
      kind: "text",
      text: "Il faut enfin résister à une tentation particulière : redémarrer immédiatement pour rétablir le service. C'est souvent la bonne décision commerciale, mais elle efface tout. Prendre trente secondes pour capturer un vidage de threads et un instantané du tas avant de redémarrer change la différence entre un incident compris et un incident qui reviendra.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Préparer avant d'avoir besoin",
      text: "Trois options coûtent presque rien et doivent figurer par défaut en production : `-XX:+HeapDumpOnOutOfMemoryError` avec un chemin d'écriture, les journaux de collecte avec `-Xlog:gc*`, et un enregistrement JFR continu. Sans elles, le premier incident se solde par « on n'a pas les éléments » — et l'on attend le second en espérant être devant l'écran.",
    },
    {
      kind: "text",
      text: "Une précaution s'impose sur les instantanés du tas : le fichier produit contient l'intégralité des objets vivants, donc des données personnelles, des jetons et parfois des mots de passe encore en mémoire. Il doit être traité comme une donnée sensible — transféré par un canal sûr, conservé dans un endroit protégé, et supprimé après analyse. Le déposer sur un partage d'équipe est une fuite en soi.",
    },
    {
      kind: "text",
      text: "En entretien, une question sur le diagnostic distingue immédiatement. Répondre par une liste d'outils est une réponse de manuel ; répondre en partant du symptôme, en nommant ce qu'on regarderait d'abord et pourquoi, puis en mentionnant ce qu'on aurait activé à l'avance, montre qu'on a réellement tenu une application en production. La différence tient en une phrase : on ne règle pas une JVM, on l'observe d'abord.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "match",
    id: "java-jvm-22",
    difficulty: 2,
    tags: ["jvm", "diagnostic"],
    prompt: "Associe chaque symptôme au premier outil à sortir.",
    pairs: [
      { left: "L'application ne répond plus du tout", right: "Vidage de threads, répété à quelques secondes" },
      { left: "Elle ralentit progressivement puis tombe", right: "Journaux de collecte, puis instantané du tas" },
      { left: "Elle est tuée sans erreur, en conteneur", right: "Mémoire hors tas : VM.native_memory, threads" },
      { left: "Pics de latence réguliers", right: "Journaux de collecte, ou enregistrement JFR" },
    ],
    explanation:
      "Partir du symptôme évite de régler le mauvais problème : une saturation du tas, une contention de verrous et une saturation de pool ressemblent toutes à « c'est lent ». La mort sans trace en conteneur est la plus trompeuse — le tas n'y est pour rien, c'est le hors tas qui a fait dépasser la limite mémoire.",
  },
  {
    kind: "mcq",
    id: "java-jvm-23",
    difficulty: 2,
    tags: ["jvm", "diagnostic"],
    prompt: "Quel est l'intérêt d'un enregistrement JFR continu par rapport à `jcmd` au moment de l'incident ?",
    choices: [
      "Il fournit l'historique des minutes qui ont précédé l'incident, y compris pour un incident nocturne.",
      "Il permet de modifier les paramètres de la JVM sans redémarrer.",
      "Il remplace les journaux de collecte, qu'il rend inutiles.",
      "Il empêche l'application de tomber en capturant les erreurs mémoire.",
    ],
    answer: 0,
    explanation:
      "`jcmd` suppose d'être présent pendant le problème, ce qui exclut tout incident survenu la nuit. Un enregistrement continu avec tampon circulaire conserve ce qui a précédé — allocations, pauses, verrous, entrées-sorties — c'est-à-dire justement la partie intéressante, pour un coût de l'ordre du pour cent.",
  },
  {
    kind: "recall",
    id: "java-jvm-24",
    difficulty: 2,
    tags: ["jvm", "diagnostic"],
    prompt: "Quelles options activer par défaut en production, et pourquoi avant d'en avoir besoin ?",
    explanation:
      "Trois, dont le coût est presque nul. La capture automatique de l'instantané du tas à l'`OutOfMemoryError`, avec un chemin d'écriture : elle transforme un incident sans explication en fichier analysable, et ne coûte rien tant qu'aucune erreur ne survient. Les journaux de collecte, qui donnent la durée et la fréquence des pauses et surtout l'occupation du tas après chaque collecte majeure — la seule courbe qui distingue une fuite d'un sous-dimensionnement. Et un enregistrement continu en tampon circulaire, qui conserve l'historique précédant l'incident. On les active avant parce qu'un incident ne se rejoue pas : sans elles, le premier se solde par « on n'a pas les éléments », et il faut attendre le second en espérant être devant l'écran. Pour la même raison, il vaut la peine de capturer un vidage de threads et un instantané avant de redémarrer, même sous pression — un redémarrage efface exactement ce qu'on cherchait.",
    keyPoints: [
      "HeapDumpOnOutOfMemoryError avec un chemin d'écriture",
      "Journaux de collecte : la courbe après collecte majeure",
      "Enregistrement continu : l'historique d'avant l'incident",
      "Capturer avant de redémarrer : le redémarrage efface tout",
    ],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-jvm",
  title: "La JVM : mémoire, ramasse-miettes, fuites et diagnostic",
  objective:
    "Savoir où va la mémoire d'une application Java : distinguer les zones, lire un débordement de pile et une saturation du tas, comprendre l'atteignabilité et le modèle générationnel, choisir un collecteur sans régler à l'aveugle, reconnaître les motifs de fuite, situer le chargement de classes et diagnostiquer un incident en partant du symptôme.",
  prerequisites: ["java-fondamentaux"],
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
