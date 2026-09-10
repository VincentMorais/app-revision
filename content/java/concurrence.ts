/**
 * Java — Concurrence (référentiel 1.6) : visibilité, synchronisation,
 * collections concurrentes, exécuteurs, CompletableFuture, threads virtuels.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Pourquoi c'est difficile : atomicité et visibilité
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "java-conc-l1",
  title: "Pourquoi c'est difficile : atomicité et visibilité",
  blocks: [
    {
      kind: "text",
      text: "Un bug de concurrence a une signature reconnaissable : il ne se reproduit pas. Le test passe cent fois, échoue la cent-unième, puis repasse. On ajoute une trace pour comprendre et le problème disparaît — parce que la trace a changé le rythme d'exécution. Cette instabilité n'est pas de la malchance : elle vient de deux propriétés que le code séquentiel garantit gratuitement et que la concurrence retire.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'opération qui ressemble à une, mais en fait trois.",
      code: `class Compteur {
    private int valeur = 0;

    public void incremente() {
        valeur++;      // 1. lire  valeur
                       // 2. calculer valeur + 1
                       // 3. écrire le résultat
    }
    public int valeur() { return valeur; }
}

// Deux threads incrémentent 10 000 fois chacun.
// Résultat attendu : 20 000.
// Résultat observé : 13 472, 19 981, 20 000… au hasard.`,
    },
    {
      kind: "text",
      text: "Le premier problème est l'**atomicité**. `valeur++` n'est pas une instruction unique mais trois opérations distinctes. Si deux threads lisent la même valeur avant que l'un ait écrit, les deux calculent le même résultat et l'une des deux incrémentations disparaît. Aucune trace de l'incident : le compteur est simplement plus bas que prévu, et l'écart varie à chaque exécution.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le second problème, plus déroutant encore.",
      code: `class Tache implements Runnable {
    private boolean arret = false;      // pas de volatile

    public void run() {
        while (!arret) {
            // travail
        }
    }
    public void demandeArret() { arret = true; }
}

// Un autre thread appelle demandeArret().
// La boucle peut tourner indéfiniment : rien ne garantit
// que le thread qui boucle observe un jour l'écriture.`,
    },
    {
      kind: "text",
      text: "Le second problème est la **visibilité**. Une écriture faite par un thread n'est pas nécessairement vue par un autre, et cela peut durer indéfiniment. La cause n'est pas un caprice : chaque cœur dispose de caches, et le compilateur comme le processeur sont autorisés à réordonner et à conserver des valeurs en registre tant qu'aucune règle ne l'interdit.",
    },
    {
      kind: "comparison",
      title: "Les deux garanties à obtenir",
      left: {
        label: "Atomicité",
        text: "Une séquence d'opérations se déroule sans qu'un autre thread puisse s'y intercaler. C'est ce qu'apporte un verrou, ou une instruction atomique du processeur comme celles derrière `AtomicInteger`.",
      },
      right: {
        label: "Visibilité",
        text: "Ce qu'un thread écrit devient observable par les autres. C'est ce qu'apportent `volatile`, l'entrée et la sortie d'un bloc synchronisé, et les classes atomiques. Sans elle, un code parfaitement atomique peut rester invisible.",
      },
    },
    {
      kind: "text",
      text: "Ces deux propriétés sont indépendantes, et les confondre mène à des corrections inefficaces. `volatile` donne la visibilité mais pas l'atomicité : un `volatile int` incrémenté depuis deux threads perd toujours des incrémentations. Inversement, un verrou donne les deux, mais son coût est plus élevé. Choisir l'outil suppose de savoir laquelle des deux garanties manque.",
    },
    {
      kind: "text",
      text: "Le cadre qui définit tout cela s'appelle le modèle mémoire de Java. Il ne décrit pas ce qui se passe, mais ce qui est **garanti** : la relation « arrive-avant » établit qu'une écriture précédant un point de synchronisation est visible pour tout thread qui franchit ce même point. Hors de ces relations, aucune promesse n'est faite, quelle que soit l'apparence du code.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un test qui passe ne prouve rien",
      text: "Une exécution correcte n'établit pas l'absence de course : elle indique seulement que l'entrelacement fautif ne s'est pas produit cette fois-là. Beaucoup de bugs de concurrence dorment des mois puis se réveillent en production, où la charge, le nombre de cœurs et le rythme diffèrent. La sûreté se raisonne sur le code, elle ne s'observe pas.",
    },
    {
      kind: "text",
      text: "Une conséquence contre-intuitive de ce modèle : le compilateur et le processeur sont autorisés à **réordonner** les instructions tant que le résultat observable par un thread isolé reste identique. Deux écritures faites dans un ordre précis peuvent donc devenir visibles dans l'ordre inverse pour un autre thread. C'est ce qui rend inutile de raisonner sur « l'ordre du code » sans point de synchronisation.",
    },
    {
      kind: "text",
      text: "La conclusion pratique commande le reste du chapitre : la meilleure stratégie n'est pas de bien synchroniser, mais d'avoir le moins possible d'état partagé mutable. Une donnée immuable est sûre par construction, une donnée confinée à un thread aussi. Tout ce qui suit ne concerne que ce qu'il reste après avoir appliqué ces deux principes.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "java-conc-01",
    difficulty: 2,
    tags: ["concurrence", "atomicite"],
    prompt: "Deux threads incrémentent 10 000 fois un compteur non synchronisé. Qu'observe-t-on ?",
    code: {
      language: "java",
      code: `class Compteur {
    private int valeur = 0;
    public void incremente() { valeur++; }
    public int valeur() { return valeur; }
}

var c = new Compteur();
var t1 = new Thread(() -> { for (int i = 0; i < 10_000; i++) c.incremente(); });
var t2 = new Thread(() -> { for (int i = 0; i < 10_000; i++) c.incremente(); });
t1.start(); t2.start();
t1.join();  t2.join();
System.out.println(c.valeur());`,
    },
    choices: [
      "Un nombre inférieur ou égal à 20 000, variable d'une exécution à l'autre.",
      "Toujours 20 000 : `join()` garantit que toutes les incrémentations sont prises en compte.",
      "Toujours 10 000 : le second thread écrase le travail du premier.",
      "Une `ConcurrentModificationException` au premier accès concurrent.",
    ],
    answer: 0,
    explanation:
      "`valeur++` est une lecture, un calcul et une écriture. Deux threads peuvent lire la même valeur avant que l'un n'écrive : une incrémentation est alors perdue, sans erreur ni trace. `join()` garantit seulement que les threads sont terminés, pas que leurs opérations ne se sont pas marché dessus. Le résultat peut atteindre 20 000 par chance, ce qui rend le bug d'autant plus difficile à détecter.",
  },
  {
    kind: "mcq",
    id: "java-conc-02",
    difficulty: 2,
    tags: ["concurrence", "visibilite"],
    prompt: "Une boucle `while (!arret)` ne s'arrête jamais alors qu'un autre thread a mis `arret` à `true`. Pourquoi ?",
    choices: [
      "Problème de visibilité : rien ne garantit que le thread qui boucle observe l'écriture faite par l'autre.",
      "Problème d'atomicité : l'affectation d'un booléen n'est pas atomique en Java.",
      "Le thread qui boucle a une priorité plus élevée et empêche l'autre de s'exécuter.",
      "`arret` doit être déclaré `final` pour être partagé entre threads.",
    ],
    answer: 0,
    explanation:
      "L'affectation d'un booléen est bien atomique ; c'est la visibilité qui manque. Chaque cœur a ses caches, et le compilateur peut conserver la valeur en registre puisque rien dans la boucle ne l'oblige à la relire. `volatile` sur le champ crée la relation « arrive-avant » nécessaire et corrige le cas.",
  },
  {
    kind: "recall",
    id: "java-conc-03",
    difficulty: 2,
    tags: ["concurrence"],
    prompt: "Quelles sont les deux garanties que la concurrence retire, et pourquoi les distinguer ?",
    explanation:
      "L'**atomicité** — une séquence d'opérations se déroule sans qu'un autre thread s'y intercale — et la **visibilité** — ce qu'un thread écrit devient observable par les autres. Les distinguer est indispensable parce que les outils n'apportent pas les mêmes : `volatile` donne la visibilité mais pas l'atomicité, si bien qu'un `volatile int` incrémenté depuis deux threads perd toujours des incrémentations ; un verrou donne les deux, à un coût plus élevé ; les classes atomiques donnent les deux sur une opération unique. Corriger une course d'atomicité avec `volatile` est l'erreur la plus fréquente, et elle produit un code qui semble corrigé tout en restant faux. La question à se poser devant un bug est donc : est-ce qu'une opération a été coupée en deux, ou est-ce qu'une écriture n'a pas été vue ?",
    keyPoints: [
      "Atomicité : personne ne s'intercale dans une séquence",
      "Visibilité : l'écriture d'un thread devient observable",
      "volatile donne la visibilité seule, un verrou donne les deux",
      "Corriger une course d'atomicité avec volatile ne corrige rien",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — synchronized et les verrous
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "java-conc-l2",
  title: "synchronized et les verrous",
  blocks: [
    {
      kind: "text",
      text: "Le mécanisme historique de Java associe un verrou — un moniteur — à chaque objet. Un bloc `synchronized` acquiert ce verrou à l'entrée et le relâche à la sortie, y compris si une exception est levée. Un seul thread à la fois peut détenir un moniteur donné : les autres attendent. C'est le seul outil qui donne d'un coup l'atomicité et la visibilité.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le compteur, corrigé.",
      code: `class Compteur {
    private int valeur = 0;

    public synchronized void incremente() {
        valeur++;                      // atomique ET visible
    }

    public synchronized int valeur() {
        return valeur;                 // la lecture aussi !
    }
}

// synchronized sur une méthode d'instance verrouille
// « this ». Sur une méthode statique, c'est l'objet
// de classe qui sert de moniteur.`,
    },
    {
      kind: "text",
      text: "Un point échappe souvent : la **lecture** doit être synchronisée elle aussi. Protéger seulement l'écriture donne l'atomicité de l'incrémentation mais pas la visibilité pour le lecteur, qui peut continuer à observer une valeur périmée. Le verrou fonctionne par paire — les écritures faites avant un relâchement sont visibles pour qui acquiert ensuite le même verrou.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Réduire la portée, et choisir son verrou.",
      code: `class Cache {
    private final Map<String, Valeur> map = new HashMap<>();
    // Verrou dédié et privé : personne d'autre ne peut
    // le prendre, donc personne ne peut nous bloquer.
    private final Object verrou = new Object();

    public Valeur get(String cle) {
        synchronized (verrou) {        // section courte
            return map.get(cle);
        }
    }

    public void charge(String cle) {
        Valeur v = calculCouteux(cle);      // HORS du verrou
        synchronized (verrou) {
            map.put(cle, v);
        }
    }
}`,
    },
    {
      kind: "text",
      text: "Deux règles de conception apparaissent ici. D'abord garder les sections critiques **courtes** : tout ce qui n'a pas besoin du verrou — un calcul, un appel réseau, une écriture de journal — doit rester à l'extérieur, sous peine de sérialiser des threads qui n'avaient pas à s'attendre. Ensuite utiliser un verrou **privé** plutôt que `this` : un verrou accessible de l'extérieur peut être pris par n'importe qui, y compris par erreur.",
    },
    {
      kind: "comparison",
      title: "synchronized et ReentrantLock",
      left: {
        label: "synchronized",
        text: "Syntaxe intégrée, relâchement automatique même en cas d'exception, impossible à oublier. Réentrant : un thread qui détient déjà le verrou peut le reprendre. Aucun moyen d'abandonner l'attente ni de tenter sans bloquer.",
      },
      right: {
        label: "ReentrantLock",
        text: "Verrou explicite, à relâcher soi-même dans un `finally`. En échange, il offre `tryLock` avec délai, l'attente interruptible, l'équité optionnelle, et plusieurs conditions d'attente sur un même verrou.",
      },
    },
    {
      kind: "text",
      text: "Le choix est vite tranché en pratique : `synchronized` par défaut, parce qu'on ne peut pas oublier de relâcher, et `ReentrantLock` uniquement lorsqu'on a besoin d'une de ses capacités supplémentaires — typiquement un `tryLock` avec délai pour éviter d'attendre indéfiniment. Les performances des deux sont aujourd'hui très proches, ce qui n'était pas le cas il y a quinze ans.",
    },
    {
      kind: "text",
      text: "Un cas mérite d'être connu parce qu'il revient souvent : les lectures très majoritaires. `ReentrantReadWriteLock` autorise plusieurs lecteurs simultanés et n'exclut que pendant les écritures. Le gain est réel quand les lectures dominent nettement et durent un certain temps ; sur des sections très courtes, la complexité supplémentaire ne se rentabilise pas, et une collection concurrente fait mieux.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ne jamais synchroniser sur une chaîne ou un entier",
      text: "`synchronized (\"verrou\")` ou `synchronized (Integer.valueOf(1))` prend un verrou sur un objet **partagé par toute la machine virtuelle** : les chaînes littérales sont internées et les petits entiers mis en cache. Deux parties du programme sans rapport se retrouvent alors à s'exclure mutuellement, et le blocage qui en résulte est incompréhensible.",
    },
    {
      kind: "text",
      text: "Un verrou est **réentrant** : un thread qui le détient déjà peut le reprendre sans se bloquer lui-même. Cela paraît anecdotique mais évite un interblocage trivial dès qu'une méthode synchronisée en appelle une autre sur le même objet — situation banale dès qu'une classe s'organise en méthodes publiques et privées. Le compteur d'acquisitions est tenu par la machine virtuelle et le verrou n'est relâché qu'au retour du bloc le plus externe.",
    },
    {
      kind: "text",
      text: "Retenons l'ordre de préférence : ne rien partager si possible, sinon partager de l'immuable, sinon utiliser une structure concurrente prête à l'emploi, et n'écrire un verrou explicite que lorsque les précédents ne conviennent pas. Chaque `synchronized` écrit à la main est une occasion de se tromper que les niveaux précédents auraient évitée.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "spot",
    id: "java-conc-04",
    difficulty: 3,
    tags: ["concurrence", "synchronized"],
    prompt: "Cette classe reste incorrecte malgré le `synchronized`. Quelle ligne ?",
    code: {
      language: "java",
      code: `class Compteur {
    private int valeur = 0;

    public synchronized void incremente() {
        valeur++;
    }

    public int valeur() {
        return valeur;
    }
}`,
    },
    faultyLine: 8,
    reasons: [
      "La lecture n'est pas synchronisée : un lecteur peut observer indéfiniment une valeur périmée.",
      "`incremente()` devrait utiliser un verrou privé plutôt que `this`.",
      "`valeur` devrait être déclaré `final` pour être visible entre threads.",
      "Il manque un `notifyAll()` après l'incrémentation.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un verrou fonctionne par paire : les écritures effectuées avant son relâchement ne sont garanties visibles que pour un thread qui acquiert **ensuite le même verrou**. Un lecteur non synchronisé ne participe à aucune relation « arrive-avant » et peut continuer à voir une valeur ancienne. Synchroniser la lecture, ou utiliser `AtomicInteger`, corrige le cas.",
  },
  {
    kind: "mcq",
    id: "java-conc-05",
    difficulty: 2,
    tags: ["concurrence", "synchronized"],
    prompt: "Pourquoi préférer un verrou privé à `synchronized (this)` ?",
    choices: [
      "Un verrou accessible de l'extérieur peut être pris par du code tiers, qui bloque alors la classe sans le savoir.",
      "`this` ne peut pas servir de moniteur pour une méthode statique.",
      "Un verrou privé est plus rapide, la machine virtuelle pouvant l'optimiser.",
      "`synchronized (this)` est déprécié depuis Java 17.",
    ],
    answer: 0,
    explanation:
      "Verrouiller sur `this` expose le moniteur : n'importe quel détenteur d'une référence à l'objet peut écrire `synchronized (monObjet)` et bloquer toutes vos méthodes synchronisées. Un champ privé dédié rend cela impossible et documente l'intention. Le pire cas est le verrou sur une chaîne littérale ou un petit entier, partagés par toute la machine virtuelle.",
  },
  {
    kind: "recall",
    id: "java-conc-06",
    difficulty: 2,
    tags: ["concurrence", "synchronized"],
    prompt: "Quand utiliser `ReentrantLock` plutôt que `synchronized` ?",
    explanation:
      "Seulement quand on a besoin d'une capacité que `synchronized` n'offre pas : `tryLock`, avec ou sans délai, pour renoncer à l'attente au lieu de bloquer indéfiniment ; l'attente interruptible, pour qu'un thread bloqué puisse être arrêté proprement ; plusieurs objets `Condition` sur un même verrou, quand des threads attendent des événements différents ; et l'équité optionnelle, qui sert le plus ancien en attente au prix d'un débit moindre. En dehors de ces besoins, `synchronized` est préférable parce qu'on ne peut pas oublier de relâcher le verrou — le relâchement est automatique, y compris si une exception traverse le bloc, là où `ReentrantLock` exige un `finally` que l'on peut omettre. Les performances des deux sont aujourd'hui comparables, ce qui n'était pas le cas historiquement.",
    keyPoints: [
      "tryLock avec délai : renoncer plutôt qu'attendre indéfiniment",
      "Attente interruptible, plusieurs Condition, équité optionnelle",
      "Sinon synchronized : relâchement automatique, impossible à oublier",
      "Performances comparables aujourd'hui",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — volatile et les classes atomiques
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "java-conc-l3",
  title: "volatile et les classes atomiques",
  blocks: [
    {
      kind: "text",
      text: "Prendre un verrou pour lire un booléen d'arrêt est disproportionné : on veut la visibilité, pas l'exclusion mutuelle. `volatile` répond exactement à ce besoin, et sa portée précise mérite d'être connue, car c'est le mot-clé le plus souvent employé à tort.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le cas où volatile est exactement le bon outil.",
      code: `class Service implements Runnable {
    private volatile boolean arret = false;

    public void run() {
        while (!arret) {
            traiterUnLot();
        }
    }

    public void demandeArret() { arret = true; }
}

// Une écriture, plusieurs lectures, aucune dépendance
// à la valeur précédente : volatile suffit et coûte
// beaucoup moins qu'un verrou.`,
    },
    {
      kind: "text",
      text: "`volatile` garantit deux choses. La lecture voit toujours la dernière écriture effectuée par n'importe quel thread — la valeur n'est ni mise en cache ni conservée en registre. Et il pose une barrière : tout ce qui a été écrit avant l'écriture volatile est visible pour qui lit ensuite cette variable. C'est ce second effet, moins connu, qui rend le motif de publication sûr.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce que volatile ne fait pas.",
      code: `private volatile int valeur = 0;

public void incremente() {
    valeur++;      // TOUJOURS FAUX en concurrence
}
// Lire, calculer, écrire : trois opérations. volatile
// rend chacune visible, mais n'empêche pas un autre
// thread de s'intercaler entre elles.

// La bonne réponse :
private final AtomicInteger valeur = new AtomicInteger();

public void incremente() {
    valeur.incrementAndGet();     // atomique ET visible
}`,
    },
    {
      kind: "text",
      text: "C'est la limite décisive : `volatile` ne rend pas atomique une séquence d'opérations. Tout ce qui lit une valeur, calcule à partir d'elle et la réécrit reste une course. Le critère est simple — si la nouvelle valeur dépend de l'ancienne, `volatile` ne suffit pas. Un drapeau que l'on positionne à `true` convient ; un compteur, non.",
    },
    {
      kind: "comparison",
      title: "Trois outils, trois portées",
      left: {
        label: "volatile",
        text: "Visibilité seule, sur une variable. Coût très faible. Convient quand une écriture ne dépend pas de la lecture précédente : un drapeau, une référence publiée une fois, une valeur de configuration remplacée en bloc.",
      },
      right: {
        label: "Atomic* et verrous",
        text: "`AtomicInteger`, `AtomicReference` rendent atomique une opération unique sur une variable, sans blocage. Un verrou rend atomique une séquence portant sur plusieurs variables. Le premier suffit le plus souvent.",
      },
    },
    {
      kind: "text",
      text: "Les classes atomiques reposent sur une instruction du processeur, la comparaison-et-échange : on lit la valeur, on calcule, puis on écrit **à condition** que la valeur n'ait pas changé entre-temps ; sinon on recommence. Ce sont des algorithmes dits non bloquants, sans verrou et sans mise en attente, ce qui les rend nettement plus efficaces sous contention modérée.",
    },
    {
      kind: "code",
      language: "java",
      caption: "compareAndSet, et une variante utile sous forte contention.",
      code: `var ref = new AtomicReference<Config>(configInitiale);

// Mise à jour conditionnelle, réessayée si quelqu'un
// est passé entre-temps.
ref.updateAndGet(ancienne -> ancienne.avecDelai(5));

// Pour un compteur très sollicité, LongAdder répartit
// les incrémentations sur plusieurs cellules internes
// et ne les additionne qu'à la lecture.
var compteur = new LongAdder();
compteur.increment();        // écritures très rapides
long total = compteur.sum(); // lecture plus coûteuse`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "volatile sur une référence ne protège pas l'objet",
      text: "`private volatile List<String> liste` garantit que la **référence** est visible, pas que le contenu de la liste est protégé. Deux threads qui ajoutent dans cette liste produiront exactement les mêmes corruptions qu'avec un champ ordinaire. Pour publier une collection sans risque, il faut qu'elle soit immuable, ou remplacée en bloc à chaque modification.",
    },
    {
      kind: "text",
      text: "Un usage classique de `volatile` mérite d'être cité parce qu'il est subtil : le verrouillage à double vérification pour une initialisation paresseuse. Sans `volatile` sur le champ, un autre thread peut observer une référence non nulle alors que l'objet n'est pas entièrement construit — le compilateur ayant le droit de publier la référence avant d'avoir fini d'écrire les champs. C'est l'un des rares endroits où l'omission du mot-clé produit un bug qui ne se manifeste presque jamais en développement.",
    },
    {
      kind: "text",
      text: "Signalons enfin que `final` apporte lui aussi une garantie de publication : les champs `final` d'un objet correctement construit sont visibles par tout thread qui obtient une référence vers lui, sans synchronisation supplémentaire. C'est ce qui rend les objets immuables sûrs par construction, et cela explique pourquoi la première recommandation de tout ce chapitre est de préférer l'immuabilité.",
    },
    {
      kind: "text",
      text: "Le raisonnement se résume en trois questions. Est-ce que la nouvelle valeur dépend de l'ancienne ? Si non, `volatile` suffit. Si oui, s'agit-il d'une seule variable ? Alors une classe atomique convient. Sinon, il faut un verrou. Suivre cet ordre évite à la fois les corrections inefficaces et les verrous inutiles.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "java-conc-07",
    difficulty: 2,
    tags: ["concurrence", "volatile"],
    prompt: "Un champ `volatile int compteur` est incrémenté par plusieurs threads. Est-ce correct ?",
    choices: [
      "Non : `compteur++` reste trois opérations, et `volatile` n'apporte que la visibilité.",
      "Oui : `volatile` rend l'incrémentation atomique.",
      "Oui, à condition qu'un seul thread écrive et que les autres se contentent de lire.",
      "Non, mais il suffit de déclarer aussi la méthode `synchronized` pour la lecture.",
    ],
    answer: 0,
    explanation:
      "`volatile` garantit qu'aucune valeur n'est mise en cache ni conservée en registre, mais n'empêche pas un thread de s'intercaler entre la lecture et l'écriture. Le critère est simple : si la nouvelle valeur dépend de l'ancienne, `volatile` ne suffit jamais. Ici, `AtomicInteger.incrementAndGet()` est la réponse.",
  },
  {
    kind: "fill",
    id: "java-conc-08",
    difficulty: 2,
    tags: ["concurrence", "atomicite"],
    prompt: "Complète pour obtenir un compteur correct et non bloquant.",
    code: {
      language: "java",
      code: `private final {{1}} valeur = new AtomicInteger();

public void incremente() {
    valeur.{{2}}();
}`,
    },
    blanks: ["AtomicInteger", "incrementAndGet"],
    distractors: ["volatile int", "AtomicReference", "set", "addAndGet"],
    explanation:
      "`AtomicInteger` s'appuie sur la comparaison-et-échange du processeur : lire, calculer, écrire seulement si rien n'a changé, sinon recommencer. `incrementAndGet` réalise l'opération complète de façon atomique. `set` écraserait sans tenir compte de la valeur courante, et `addAndGet` exigerait un argument.",
  },
  {
    kind: "recall",
    id: "java-conc-09",
    difficulty: 2,
    tags: ["concurrence", "volatile"],
    prompt: "Dans quels cas `volatile` est-il le bon outil, et dans quels cas ne l'est-il pas ?",
    explanation:
      "Il convient exactement quand on a besoin de **visibilité sans atomicité**, c'est-à-dire quand la nouvelle valeur ne dépend pas de l'ancienne : un drapeau d'arrêt positionné à `true`, une référence de configuration remplacée en bloc, une valeur publiée une fois. Il ne convient pas dès que la nouvelle valeur se calcule à partir de la précédente — un compteur, une accumulation, un test suivi d'une affectation — car lire, calculer et écrire restent trois opérations distinctes entre lesquelles un autre thread peut s'intercaler. Un piège supplémentaire concerne les références : `volatile` sur une `List` rend la référence visible mais ne protège absolument pas le contenu ; pour publier une collection sans risque, il faut qu'elle soit immuable ou remplacée entièrement à chaque modification.",
    keyPoints: [
      "Oui quand la nouvelle valeur ne dépend pas de l'ancienne",
      "Non pour tout compteur, accumulation, test-puis-affectation",
      "Sur une référence : protège la référence, pas le contenu",
      "Publier une collection : immuable, ou remplacée en bloc",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les collections concurrentes
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "java-conc-l4",
  title: "Les collections concurrentes",
  blocks: [
    {
      kind: "text",
      text: "Partager une `HashMap` entre threads sans protection ne produit pas seulement des résultats faux : sur les anciennes versions de Java, cela pouvait faire boucler indéfiniment un thread lors d'un redimensionnement concurrent. Le comportement d'une collection non protégée n'est pas « approximatif », il est indéfini — la structure interne peut être corrompue.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois réponses, dont deux mauvaises.",
      code: `// 1. Non protégée : corruption possible
Map<String, Integer> m1 = new HashMap<>();

// 2. Enveloppée : correcte mais un seul thread à la fois
Map<String, Integer> m2 = Collections.synchronizedMap(new HashMap<>());
// Chaque opération prend le MÊME verrou global.
// Et l'itération doit être synchronisée à la main.

// 3. Concurrente : conçue pour l'accès parallèle
Map<String, Integer> m3 = new ConcurrentHashMap<>();`,
    },
    {
      kind: "text",
      text: "L'enveloppe synchronisée est correcte mais grossière : elle place un verrou unique autour de chaque méthode, si bien que tous les threads se sérialisent, y compris ceux qui manipulent des clés sans rapport. `ConcurrentHashMap` répartit au contraire la contention et permet à des écritures sur des clés différentes de progresser en parallèle, tout en offrant des lectures sans verrou.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le piège des opérations composées.",
      code: `// FAUX, même avec une ConcurrentHashMap :
if (!map.containsKey(cle)) {        // opération 1
    map.put(cle, valeurCouteuse()); // opération 2
}
// Chaque appel est atomique, leur ENCHAÎNEMENT ne l'est
// pas : deux threads peuvent passer le test ensemble.

// JUSTE : une seule opération atomique
map.putIfAbsent(cle, valeur);

// Et pour ne calculer que si nécessaire :
map.computeIfAbsent(cle, k -> valeurCouteuse());`,
    },
    {
      kind: "text",
      text: "C'est l'erreur la plus fréquente avec ces collections, et elle est trompeuse parce que chaque méthode prise isolément est bien atomique. Ce qui ne l'est pas, c'est la séquence : « vérifier puis agir », « lire puis modifier », « lire puis écrire ». Les collections concurrentes fournissent pour cela des méthodes composées — `putIfAbsent`, `computeIfAbsent`, `compute`, `merge`, `replace` — qui font le tout en une seule opération.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'itérer",
      left: {
        label: "Collection classique",
        text: "L'itérateur est *fail-fast* : toute modification pendant le parcours lève une `ConcurrentModificationException`, y compris depuis le même thread. C'est un garde-fou, pas une garantie de sûreté — il détecte souvent, jamais toujours.",
      },
      right: {
        label: "Collection concurrente",
        text: "L'itérateur est *faiblement cohérent* : il ne lève jamais d'exception et reflète l'état à un moment donné, sans garantir de voir les modifications survenues pendant le parcours. Il ne bloque personne.",
      },
    },
    {
      kind: "text",
      text: "Cette différence a une conséquence pratique : un parcours de `ConcurrentHashMap` peut voir ou ne pas voir une entrée ajoutée pendant qu'il tourne, et cela ne constitue pas un bug. De même, `size()` sur une collection concurrente renvoie une estimation à un instant donné, immédiatement potentiellement périmée. Y appuyer une décision — « si la taille est de dix, alors… » — reproduit exactement le problème des opérations composées.",
    },
    {
      kind: "text",
      text: "Deux autres structures méritent d'être connues. `CopyOnWriteArrayList` recopie intégralement le tableau à chaque modification : les lectures sont donc totalement libres, et le coût porte sur l'écriture. C'est idéal pour une liste d'écouteurs, lue sans arrêt et modifiée rarement, et catastrophique dans le cas inverse. Et `BlockingQueue` est la structure de base du motif producteur-consommateur, qui met en attente le lecteur quand la file est vide.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le meilleur partage est l'absence de partage",
      text: "Avant d'atteindre une collection concurrente, il faut vérifier qu'on a réellement besoin de partager. Une collection locale à un thread, une collection immuable publiée une fois, ou une réduction faite par chaque thread puis fusionnée à la fin évitent le problème plutôt que de le gérer — et sont toujours plus rapides qu'une structure conçue pour supporter la contention.",
    },
    {
      kind: "text",
      text: "Une remarque de performance souvent utile : `ConcurrentHashMap` n'accepte ni clé ni valeur nulle, contrairement à `HashMap`. Ce n'est pas un oubli mais une nécessité — dans un contexte concurrent, un `get` renvoyant `null` deviendrait ambigu entre « absent » et « présent avec la valeur nulle », et aucune vérification ultérieure ne pourrait lever le doute puisque la map a pu changer entre-temps.",
    },
    {
      kind: "text",
      text: "En entretien, la question « `HashMap` ou `ConcurrentHashMap` ? » attend souvent une réponse sur la performance. La réponse utile porte ailleurs : `ConcurrentHashMap` évite la corruption et permet le parallélisme, mais elle ne rend pas atomiques les séquences d'opérations. C'est ce second point qui distingue quelqu'un qui a réellement debogué du code concurrent.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "java-conc-10",
    difficulty: 3,
    tags: ["concurrence", "collections"],
    prompt: "La map est bien une `ConcurrentHashMap`. Pourtant la valeur coûteuse est parfois calculée deux fois. Quelle ligne ?",
    code: {
      language: "java",
      code: `private final Map<String, Valeur> cache = new ConcurrentHashMap<>();

public Valeur get(String cle) {
    if (!cache.containsKey(cle)) {
        cache.put(cle, calculCouteux(cle));
    }
    return cache.get(cle);
}`,
    },
    faultyLine: 4,
    reasons: [
      "« Vérifier puis agir » n'est pas atomique : deux threads peuvent passer le test ensemble avant que l'un n'écrive.",
      "`containsKey` n'est pas une opération thread-safe sur une `ConcurrentHashMap`.",
      "`cache` devrait être déclaré `volatile` en plus d'être `final`.",
      "`ConcurrentHashMap` n'accepte pas les clés de type `String`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Chaque appel pris isolément est bien atomique ; c'est leur enchaînement qui ne l'est pas. Deux threads peuvent constater l'absence de la clé au même moment, calculer tous les deux, et écrire tous les deux. `computeIfAbsent(cle, this::calculCouteux)` réalise le test et l'insertion en une seule opération atomique.",
  },
  {
    kind: "match",
    id: "java-conc-11",
    difficulty: 2,
    tags: ["concurrence", "collections"],
    prompt: "Associe chaque structure à son usage typique.",
    pairs: [
      { left: "ConcurrentHashMap", right: "Cache partagé, lectures et écritures fréquentes sur des clés variées" },
      { left: "CopyOnWriteArrayList", right: "Liste d'écouteurs : lue sans arrêt, modifiée très rarement" },
      { left: "BlockingQueue", right: "Producteur-consommateur : le lecteur attend quand la file est vide" },
      { left: "Collections.synchronizedMap", right: "Correction minimale d'un code existant, au prix d'un verrou global" },
    ],
    explanation:
      "`CopyOnWriteArrayList` recopie tout le tableau à chaque écriture : excellent quand les modifications sont rares, catastrophique dans le cas inverse. L'enveloppe synchronisée sérialise tous les accès sur un verrou unique, y compris ceux portant sur des clés sans rapport, et exige en plus de synchroniser l'itération à la main.",
  },
  {
    kind: "recall",
    id: "java-conc-12",
    difficulty: 3,
    tags: ["concurrence", "collections"],
    prompt: "Une `ConcurrentHashMap` rend-elle le code automatiquement correct ?",
    explanation:
      "Non. Elle garantit que chaque opération prise isolément est atomique et que la structure interne ne peut pas être corrompue, mais elle ne rend pas atomique une **séquence** d'opérations. Tous les motifs « vérifier puis agir », « lire puis modifier », « lire puis écrire » restent des courses : deux threads peuvent constater l'absence d'une clé en même temps et écrire tous les deux. Les méthodes composées existent précisément pour cela — `putIfAbsent`, `computeIfAbsent`, `compute`, `merge`, `replace` — et font le tout en une opération. Deux conséquences annexes méritent d'être connues : l'itérateur est faiblement cohérent, donc il peut voir ou non une entrée ajoutée pendant le parcours sans que ce soit un bug, et `size()` ne renvoie qu'une estimation immédiatement périmée, sur laquelle on ne peut appuyer aucune décision.",
    keyPoints: [
      "Chaque opération est atomique, pas leur enchaînement",
      "Vérifier-puis-agir reste une course : utiliser computeIfAbsent",
      "Itérateur faiblement cohérent : voir ou non une entrée n'est pas un bug",
      "size() est une estimation, aucune décision ne doit s'y appuyer",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Les exécuteurs et les pools
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "java-conc-l5",
  title: "Les exécuteurs et les pools",
  blocks: [
    {
      kind: "text",
      text: "Créer un thread par tâche paraît naturel et ne passe pas l'échelle. Un thread de plateforme coûte environ un mégaoctet de pile réservée et une ressource du système d'exploitation ; en créer un par requête sur un serveur chargé épuise la mémoire, et le temps passé à créer et détruire finit par dépasser celui du travail utile.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un pool : des threads réutilisés, une file d'attente.",
      code: `try (var pool = Executors.newFixedThreadPool(8)) {

    Future<Rapport> f = pool.submit(() -> genererRapport(id));

    // get() BLOQUE jusqu'au résultat, et relaie
    // l'exception de la tâche dans une ExecutionException.
    Rapport r = f.get(30, TimeUnit.SECONDS);
}
// Depuis Java 19, ExecutorService est AutoCloseable :
// le try-with-resources attend la fin des tâches.`,
    },
    {
      kind: "text",
      text: "Un `ExecutorService` sépare la soumission d'une tâche de son exécution. Les threads sont créés une fois et réutilisés, les tâches attendent dans une file, et le nombre de threads actifs reste borné. Ce dernier point est le plus important : il transforme une surcharge en attente ordonnée plutôt qu'en épuisement de ressources.",
    },
    {
      kind: "text",
      text: "Le dimensionnement dépend de la nature du travail. Pour des tâches de calcul, le nombre de cœurs est le bon ordre de grandeur : au-delà, les threads se disputent le processeur et le débit baisse. Pour des tâches d'entrée-sortie, où les threads passent l'essentiel de leur temps à attendre une réponse, on peut en mettre beaucoup plus — et c'est exactement le cas que les threads virtuels transforment.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux fabriques à éviter, et pourquoi.",
      code: `// File d'attente NON BORNÉE : sous surcharge, les
// tâches s'accumulent en mémoire jusqu'à l'OOM.
var a = Executors.newFixedThreadPool(8);

// Crée un thread par tâche si aucun n'est libre, sans
// limite : une rafale peut créer des milliers de threads.
var b = Executors.newCachedThreadPool();

// Explicite, et borné des deux côtés :
var pool = new ThreadPoolExecutor(
        8, 8, 0L, TimeUnit.MILLISECONDS,
        new ArrayBlockingQueue<>(1000),          // file bornée
        new ThreadPoolExecutor.CallerRunsPolicy() // contre-pression
);`,
    },
    {
      kind: "text",
      text: "Les fabriques simples cachent un choix lourd de conséquences : leur file d'attente est non bornée. Sous une charge supérieure à la capacité de traitement, les tâches s'empilent silencieusement jusqu'à saturer la mémoire, et l'incident survient longtemps après la cause. Une file bornée assortie d'une politique de rejet rend le problème visible immédiatement, et permet d'exercer une contre-pression sur l'appelant.",
    },
    {
      kind: "comparison",
      title: "Deux façons de refuser du travail",
      left: {
        label: "AbortPolicy (défaut)",
        text: "Lève une `RejectedExecutionException` dès que la file est pleine. L'appelant sait immédiatement que le système est saturé et peut décider : réessayer plus tard, dégrader, renvoyer une erreur au client.",
      },
      right: {
        label: "CallerRunsPolicy",
        text: "Fait exécuter la tâche par le thread appelant. Celui-ci se retrouve occupé et cesse d'en soumettre : c'est une contre-pression automatique, qui ralentit la source au lieu de l'accumuler.",
      },
    },
    {
      kind: "text",
      text: "Un piège classique mérite d'être signalé : soumettre depuis une tâche d'un pool une autre tâche au **même** pool, puis attendre son résultat. Si toutes les tâches en cours font cela simultanément, tous les threads attendent des tâches qui ne pourront jamais démarrer faute de thread libre. C'est un interblocage par épuisement de pool, et il ne se manifeste que sous charge.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une exception avalée dans une tâche",
      text: "Une exception levée dans une tâche soumise par `submit` n'apparaît nulle part : elle est capturée et conservée dans le `Future`. Si personne n'appelle `get()`, elle disparaît en silence — la tâche a échoué et rien ne le signale. Avec `execute`, elle remonte au gestionnaire d'exceptions non capturées du thread. Dans les deux cas, il faut un `try` dans la tâche ou une lecture systématique du résultat.",
    },
    {
      kind: "text",
      text: "Un détail pratique fait gagner beaucoup de temps en exploitation : nommer les threads du pool. Une fabrique de threads personnalisée permet de leur donner un préfixe parlant — `import-commandes-1`, `notifications-3` — qui apparaîtra dans chaque vidage de threads et dans chaque trace de supervision. Sans cela, on lit `pool-3-thread-7` et l'on ne sait pas de quel pool il s'agit.",
    },
    {
      kind: "text",
      text: "Enfin, un pool doit être arrêté explicitement. `shutdown` refuse les nouvelles tâches et laisse finir celles en cours ; `shutdownNow` tente d'interrompre. Un pool non arrêté empêche la machine virtuelle de se terminer, ses threads n'étant pas des threads démons. Depuis Java 19, le `try`-avec-ressources s'en charge, ce qui supprime l'oubli le plus courant.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "mcq",
    id: "java-conc-13",
    difficulty: 3,
    tags: ["concurrence", "executors"],
    prompt: "Pourquoi `Executors.newFixedThreadPool(8)` est-il risqué en production ?",
    choices: [
      "Sa file d'attente est non bornée : sous surcharge, les tâches s'accumulent jusqu'à saturer la mémoire.",
      "Il crée un nouveau thread à chaque tâche soumise, sans limite.",
      "Il ne relaie pas les exceptions levées dans les tâches.",
      "Il ne peut pas être arrêté, ce qui empêche la JVM de se terminer.",
    ],
    answer: 0,
    explanation:
      "Le nombre de threads est bien borné à huit, mais la file qui les alimente ne l'est pas. Si le rythme de soumission dépasse durablement la capacité de traitement, les tâches s'empilent en mémoire et l'incident survient longtemps après la cause, sous forme d'un manque de mémoire difficile à relier. Une file bornée avec une politique de rejet rend la saturation immédiatement visible.",
  },
  {
    kind: "order",
    id: "java-conc-14",
    difficulty: 2,
    tags: ["concurrence", "executors"],
    prompt: "Remets dans l'ordre le cycle de vie d'une tâche soumise à un pool.",
    items: [
      "La tâche est soumise et placée dans la file d'attente",
      "Un thread du pool se libère et retire la tâche de la file",
      "La tâche s'exécute ; son résultat ou son exception est stocké dans le Future",
      "L'appelant récupère le résultat par get(), ou l'exception encapsulée",
    ],
    explanation:
      "L'étape la plus souvent oubliée est la dernière : sans appel à `get()`, une exception levée dans la tâche reste enfermée dans le `Future` et disparaît en silence. La tâche a échoué, rien ne le signale, et le bug se manifeste plus tard sous forme d'un traitement qui n'a jamais eu lieu.",
  },
  {
    kind: "recall",
    id: "java-conc-15",
    difficulty: 3,
    tags: ["concurrence", "executors"],
    prompt: "Comment dimensionner un pool, et qu'est-ce que l'interblocage par épuisement de pool ?",
    explanation:
      "Le dimensionnement dépend de la nature du travail. Pour des tâches de **calcul**, le nombre de cœurs est le bon ordre de grandeur : au-delà, les threads se disputent le processeur et le débit baisse au lieu de monter. Pour des tâches d'**entrée-sortie**, où les threads passent l'essentiel de leur temps bloqués en attente, on peut en mettre bien davantage — c'est précisément ce cas que les threads virtuels rendent trivial. L'interblocage par épuisement de pool survient lorsqu'une tâche soumet au **même** pool une sous-tâche puis attend son résultat : si toutes les tâches en cours font cela simultanément, chaque thread attend une sous-tâche qui ne pourra jamais démarrer faute de thread libre, et le système se bloque entièrement. Il ne se manifeste que sous charge, ce qui le rend particulièrement difficile à reproduire. La parade est d'utiliser des pools distincts par niveau, ou de composer sans bloquer.",
    keyPoints: [
      "Calcul : de l'ordre du nombre de cœurs",
      "Entrée-sortie : beaucoup plus, car les threads attendent",
      "Épuisement : une tâche attend une sous-tâche du même pool",
      "Ne se produit que sous charge ; parade : pools distincts ou composition",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — CompletableFuture : composer sans bloquer
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "java-conc-l6",
  title: "CompletableFuture : composer sans bloquer",
  blocks: [
    {
      kind: "text",
      text: "Un `Future` classique ne sait faire qu'une chose : bloquer jusqu'au résultat. Dès qu'on veut enchaîner deux traitements, en lancer plusieurs en parallèle ou réagir à un échec, on se retrouve à écrire des `get()` successifs — c'est-à-dire à immobiliser un thread pour attendre, ce qui annule une partie du bénéfice recherché.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois appels indépendants, exécutés en parallèle.",
      code: `var client   = supplyAsync(() -> chargeClient(id), pool);
var commandes = supplyAsync(() -> chargeCommandes(id), pool);
var solde    = supplyAsync(() -> chargeSolde(id), pool);

// Attendre les trois, puis assembler
CompletableFuture<Fiche> fiche = allOf(client, commandes, solde)
        .thenApply(v -> new Fiche(
                client.join(), commandes.join(), solde.join()));

// Durée totale : celle du plus lent, pas la somme.`,
    },
    {
      kind: "text",
      text: "L'apport est la **composition**. On décrit un graphe de dépendances entre traitements plutôt qu'une séquence d'attentes. Trois appels indépendants partent ensemble et le temps total devient celui du plus lent, au lieu de la somme des trois. C'est le gain le plus courant sur une couche de service qui agrège plusieurs sources.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les opérateurs à connaître, et leurs différences.",
      code: `future
    // transformer le résultat
    .thenApply(c -> c.nom())

    // enchaîner un traitement qui renvoie lui-même
    // un CompletableFuture — évite l'imbrication
    .thenCompose(nom -> chercheAsync(nom))

    // combiner avec un autre, indépendant
    .thenCombine(autreFuture, (a, b) -> new Paire(a, b))

    // rattraper un échec en fournissant une valeur
    .exceptionally(e -> Nom.INCONNU)

    // agir dans tous les cas, succès comme échec
    .whenComplete((res, err) -> journaliser(res, err));`,
    },
    {
      kind: "text",
      text: "La distinction entre `thenApply` et `thenCompose` reprend celle entre transformer et aplatir : le premier applique une fonction ordinaire, le second enchaîne une opération qui renvoie elle-même un futur. Utiliser `thenApply` sur une fonction asynchrone produit un `CompletableFuture<CompletableFuture<T>>` qu'il faudra déballer — le symptôme est immédiat et le compilateur le signale.",
    },
    {
      kind: "comparison",
      title: "Deux familles de méthodes",
      left: {
        label: "Sans suffixe — thenApply",
        text: "L'étape s'exécute sur le thread qui a complété le futur précédent, ou sur celui de l'appelant. Économique pour un traitement bref. Dangereux pour un travail long ou bloquant, qui immobiliserait un thread dont ce n'est pas le rôle.",
      },
      right: {
        label: "Suffixe Async — thenApplyAsync",
        text: "L'étape est soumise à un exécuteur, celui qu'on passe en argument ou le pool commun par défaut. À utiliser dès que le traitement est long, et toujours avec un pool explicite pour ne pas saturer le pool commun.",
      },
    },
    {
      kind: "text",
      text: "Le pool commun mérite une mise en garde : il est partagé par toute l'application et dimensionné sur le nombre de cœurs disponibles, moins un. Y soumettre des tâches bloquantes — un appel réseau, une requête base — le sature très vite, et l'effet se propage à tout ce qui l'utilise par ailleurs, y compris aux flux parallèles. Un pool dédié aux entrées-sorties est la règle.",
    },
    {
      kind: "text",
      text: "La gestion des erreurs suit une logique de propagation : un échec en amont saute toutes les étapes de transformation et se propage jusqu'à la première méthode capable de le traiter. Une exception levée dans une étape est encapsulée dans une `CompletionException`, ce qui surprend au débogage — la cause réelle se trouve dans `getCause()`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "join() ou get() annulent le bénéfice",
      text: "Appeler `join()` au milieu d'une chaîne immobilise le thread courant et ramène au modèle bloquant. Ces méthodes n'ont leur place qu'à la frontière du système — au moment de produire une réponse HTTP, par exemple. Partout ailleurs, on compose. Une chaîne parsemée de `join()` est le signe qu'on a écrit du code bloquant avec une syntaxe asynchrone.",
    },
    {
      kind: "text",
      text: "Un point d'attention sur les délais : contrairement à `Future.get(timeout)`, la plupart des opérateurs de composition n'imposent aucune limite de temps. Une chaîne dont une étape ne se termine jamais reste en attente indéfiniment, sans erreur. `orTimeout` et `completeOnTimeout` comblent ce manque et devraient figurer sur toute chaîne qui touche un service externe.",
    },
    {
      kind: "text",
      text: "Il faut enfin signaler que les threads virtuels changent le calcul de rentabilité de cette API. Quand bloquer ne coûte presque plus rien, écrire du code séquentiel simple redevient une option légitime là où il fallait auparavant composer. `CompletableFuture` garde son intérêt pour le parallélisme explicite — lancer trois appels de front — mais beaucoup moins pour éviter de bloquer.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "java-conc-16",
    difficulty: 2,
    tags: ["concurrence", "completable-future"],
    prompt: "Quelle méthode utiliser pour enchaîner une opération qui renvoie elle-même un `CompletableFuture` ?",
    choices: [
      "`thenCompose` : elle aplatit le résultat au lieu de produire un futur de futur.",
      "`thenApply` : elle applique la fonction et conserve le type du futur.",
      "`thenCombine` : elle enchaîne deux futurs successifs.",
      "`whenComplete` : elle attend le futur imbriqué avant de continuer.",
    ],
    answer: 0,
    explanation:
      "C'est la distinction entre transformer et aplatir. `thenApply` sur une fonction asynchrone produit un `CompletableFuture<CompletableFuture<T>>` qu'il faut déballer. `thenCompose` enchaîne et aplatit en une étape. `thenCombine` sert à combiner deux futurs **indépendants**, pas successifs.",
  },
  {
    kind: "mcq",
    id: "java-conc-17",
    difficulty: 3,
    tags: ["concurrence", "completable-future"],
    prompt: "Pourquoi ne pas soumettre des appels réseau au pool commun par défaut ?",
    choices: [
      "Il est dimensionné sur le nombre de cœurs et partagé par toute l'application : le bloquer sature aussi les flux parallèles.",
      "Il n'accepte que les tâches de calcul, et lève une exception sur une opération bloquante.",
      "Il n'est pas thread-safe et corrompt les résultats en cas d'entrée-sortie.",
      "Il ne propage pas les exceptions vers le `CompletableFuture` appelant.",
    ],
    answer: 0,
    explanation:
      "Le pool commun compte par défaut le nombre de cœurs disponibles moins un. Y placer des tâches qui passent leur temps bloquées l'épuise très vite, et comme il est partagé par toute l'application, l'effet se propage à tout ce qui s'en sert — y compris aux flux parallèles, qui ralentissent sans raison apparente. Un pool dédié aux entrées-sorties est la règle.",
  },
  {
    kind: "recall",
    id: "java-conc-18",
    difficulty: 2,
    tags: ["concurrence", "completable-future"],
    prompt: "Qu'apporte `CompletableFuture` qu'un `Future` classique ne permet pas ?",
    explanation:
      "La **composition**. Un `Future` classique ne sait que bloquer jusqu'au résultat : enchaîner deux traitements oblige à appeler `get()`, donc à immobiliser un thread pour attendre. `CompletableFuture` permet de décrire un graphe de dépendances — transformer avec `thenApply`, enchaîner un traitement lui-même asynchrone avec `thenCompose`, combiner deux futurs indépendants avec `thenCombine`, attendre un ensemble avec `allOf` — sans qu'aucun thread n'attende. Le gain le plus courant est d'exécuter des appels indépendants en parallèle, si bien que la durée totale devient celle du plus lent au lieu de la somme. S'y ajoute une gestion d'erreur intégrée : un échec saute les étapes de transformation et se propage jusqu'à `exceptionally` ou `handle`. À noter que l'arrivée des threads virtuels réduit l'intérêt de cette API pour éviter de bloquer, tout en le conservant pour le parallélisme explicite.",
    keyPoints: [
      "Composer un graphe plutôt qu'enchaîner des attentes bloquantes",
      "Appels indépendants en parallèle : durée du plus lent, pas la somme",
      "Gestion d'erreur propagée jusqu'à exceptionally ou handle",
      "Les threads virtuels en réduisent l'intérêt pour éviter de bloquer",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Les threads virtuels
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "java-conc-l7",
  title: "Les threads virtuels",
  blocks: [
    {
      kind: "text",
      text: "Pendant vingt ans, le développement serveur en Java a été organisé autour d'une contrainte : un thread est cher, donc on n'en a qu'un nombre limité, donc bloquer est un péché. Toute la programmation réactive — les chaînes asynchrones, les opérateurs de composition, la difficulté de déboguer qui va avec — est née de cette contrainte. Les threads virtuels, arrivés en version stable avec Java 21, la suppriment.",
    },
    {
      kind: "text",
      text: "Un thread de plateforme est une enveloppe autour d'un thread du système d'exploitation : environ un mégaoctet de pile réservée, une création coûteuse, et un changement de contexte qui passe par le noyau. Un thread virtuel est géré par la machine virtuelle : sa pile vit sur le tas, il en coûte quelques centaines d'octets, et en créer un million est parfaitement raisonnable.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un thread par tâche, à nouveau possible.",
      code: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (var commande : dixMilleCommandes) {
        executor.submit(() -> {
            // Code BLOQUANT, séquentiel, lisible
            var client = api.chargeClient(commande.clientId());
            var stock  = api.verifieStock(commande.articles());
            return traiter(commande, client, stock);
        });
    }
}
// Dix mille threads virtuels, quelques threads de
// plateforme dessous. Pas de pool à dimensionner.`,
    },
    {
      kind: "text",
      text: "Le mécanisme est le suivant : quand un thread virtuel exécute une opération bloquante, la machine virtuelle le **détache** de son thread porteur, qui repart aussitôt exécuter un autre thread virtuel. Le thread bloqué ne consomme plus rien qu'un peu de mémoire. Quand la réponse arrive, il est rattaché à un porteur disponible et reprend là où il s'était arrêté.",
    },
    {
      kind: "comparison",
      title: "Ce qui change, ce qui ne change pas",
      left: {
        label: "Ce qui change",
        text: "Bloquer devient bon marché. On peut revenir à un thread par requête, écrire du code séquentiel lisible, et déboguer avec des piles d'appel complètes. Le dimensionnement de pool disparaît comme sujet.",
      },
      right: {
        label: "Ce qui ne change pas",
        text: "Rien de ce qui a été vu jusqu'ici. Les courses, la visibilité, les collections concurrentes, les verrous : tout reste identique. Un thread virtuel est un thread — il partage la mémoire avec les autres exactement de la même façon.",
      },
    },
    {
      kind: "text",
      text: "C'est le contresens à éviter : les threads virtuels ne rendent pas la concurrence facile, ils rendent le **blocage** bon marché. Un compteur incrémenté depuis un million de threads virtuels produit exactement les mêmes incrémentations perdues que depuis deux threads de plateforme. Tout le contenu des six premières leçons reste entièrement valable.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux pratiques à revoir dans un monde de threads virtuels.",
      code: `// 1. Mettre en pool des threads virtuels n'a aucun sens :
//    ils sont faits pour être créés à la demande.
//    ✗ Executors.newFixedThreadPool(200, virtualFactory)
//    ✓ Executors.newVirtualThreadPerTaskExecutor()

// 2. ThreadLocal devient coûteux à grande échelle :
//    une copie par thread, donc par tâche.
//    Un million de threads = un million de copies.
//    → préférer le passage explicite, ou ScopedValue.

// 3. Un bloc synchronized peut « épingler » le thread
//    virtuel à son porteur pendant l'attente.
//    → préférer ReentrantLock dans les sections qui
//      bloquent (limitation levée depuis Java 24).`,
    },
    {
      kind: "text",
      text: "L'épinglage mérite une explication, car c'est la limitation la plus citée. Dans les premières versions, un thread virtuel bloqué à l'intérieur d'un bloc `synchronized` ne pouvait pas être détaché de son porteur, qui restait donc immobilisé — perdant tout le bénéfice. La recommandation était d'utiliser `ReentrantLock` dans ces sections. Java 24 a levé cette restriction, mais le code existant tourne souvent sur des versions antérieures.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le goulot se déplace, il ne disparaît pas",
      text: "Dix mille threads virtuels qui interrogent la même base ouvrent dix mille connexions — ou plutôt en réclament, et saturent le pool de connexions. Ce que le pool de threads limitait implicitement, il faut désormais le limiter explicitement, avec un sémaphore ou une file bornée. Retirer une limite sans en poser une autre déplace simplement la panne d'un cran.",
    },
    {
      kind: "text",
      text: "En pratique, l'adoption est souvent triviale sur une application web : il suffit de configurer le serveur pour qu'il traite chaque requête sur un thread virtuel — une propriété de configuration dans Spring Boot. Le code métier n'a pas à changer. Ce sont les usages massifs de `ThreadLocal`, les pools écrits à la main et les limites implicites qui demandent une relecture.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "java-conc-19",
    difficulty: 2,
    tags: ["concurrence", "virtual-threads"],
    prompt: "Les threads virtuels suppriment-ils les problèmes de concurrence ?",
    choices: [
      "Non : ils rendent le blocage bon marché, mais courses et visibilité restent identiques.",
      "Oui : la machine virtuelle sérialise les accès mémoire entre threads virtuels.",
      "Oui pour les courses, non pour les interblocages.",
      "Non, mais ils rendent `volatile` inutile puisqu'il n'y a plus qu'un thread porteur.",
    ],
    answer: 0,
    explanation:
      "Un thread virtuel est un thread : il partage la mémoire avec les autres exactement de la même façon. Un compteur incrémenté depuis un million de threads virtuels perd des incrémentations comme depuis deux threads de plateforme. Ce qui change est le coût du blocage, ce qui permet de revenir à un thread par tâche et à du code séquentiel lisible.",
  },
  {
    kind: "mcq",
    id: "java-conc-20",
    difficulty: 3,
    tags: ["concurrence", "virtual-threads"],
    prompt: "Une application passe à un thread virtuel par requête. Que faut-il surveiller ?",
    choices: [
      "Les limites que le pool de threads imposait implicitement, comme le nombre de connexions à la base.",
      "L'augmentation de la mémoire des piles, chaque thread virtuel réservant un mégaoctet.",
      "La perte des piles d'appel, les threads virtuels ne conservant pas de trace complète.",
      "L'impossibilité d'utiliser des collections concurrentes avec des threads virtuels.",
    ],
    answer: 0,
    explanation:
      "Le pool de threads bornait implicitement toutes les ressources en aval. Sans lui, dix mille requêtes simultanées réclament dix mille connexions et saturent le pool de connexions. Il faut poser explicitement les limites qui étaient devenues invisibles — sémaphore, file bornée. La pile d'un thread virtuel vit sur le tas et reste complète au débogage.",
  },
  {
    kind: "recall",
    id: "java-conc-21",
    difficulty: 3,
    tags: ["concurrence", "virtual-threads"],
    prompt: "Qu'est-ce qu'un thread virtuel, et quelles pratiques faut-il revoir en l'adoptant ?",
    explanation:
      "C'est un thread géré par la machine virtuelle plutôt que par le système d'exploitation : sa pile vit sur le tas, il coûte quelques centaines d'octets au lieu d'environ un mégaoctet, et lorsqu'il exécute une opération bloquante il est **détaché** de son thread porteur, qui repart exécuter autre chose. En créer un million est raisonnable, ce qui permet de revenir à un thread par tâche et à du code séquentiel lisible. Trois pratiques sont à revoir. D'abord ne plus les mettre en pool : ils sont faits pour être créés à la demande, un exécuteur dédié existe pour cela. Ensuite les usages massifs de `ThreadLocal`, qui produisent désormais une copie par tâche — le passage explicite ou `ScopedValue` conviennent mieux. Enfin les limites implicites : ce que le pool de threads bornait sans le dire, comme le nombre de connexions à la base, doit être borné explicitement, sans quoi la panne se déplace simplement d'un cran.",
    keyPoints: [
      "Géré par la JVM, pile sur le tas, détaché du porteur quand il bloque",
      "Ne pas les mettre en pool : un par tâche, à la demande",
      "ThreadLocal devient coûteux : passage explicite ou ScopedValue",
      "Reposer explicitement les limites que le pool imposait",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Interblocages et diagnostic
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "java-conc-l8",
  title: "Interblocages et diagnostic",
  blocks: [
    {
      kind: "text",
      text: "Un interblocage ne produit ni exception ni message : l'application ralentit, puis s'arrête de répondre, et rien dans les journaux ne l'explique. C'est ce silence qui en fait un incident redouté, et c'est aussi ce qui rend indispensable de savoir le reconnaître et l'observer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux verrous, deux ordres d'acquisition.",
      code: `void transfere(Compte a, Compte b, BigDecimal montant) {
    synchronized (a) {
        synchronized (b) {
            a.debite(montant);
            b.credite(montant);
        }
    }
}

// Thread 1 : transfere(compteA, compteB, …)
//   prend A, attend B
// Thread 2 : transfere(compteB, compteA, …)
//   prend B, attend A
// → chacun attend le verrou que l'autre détient.`,
    },
    {
      kind: "text",
      text: "Quatre conditions doivent être réunies simultanément pour qu'un interblocage survienne : des ressources en exclusion mutuelle, des threads qui conservent une ressource tout en en attendant une autre, l'impossibilité de retirer une ressource de force, et une attente circulaire. Briser n'importe laquelle suffit, et c'est la dernière qu'on brise en pratique.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un ordre global d'acquisition supprime le cycle.",
      code: `void transfere(Compte a, Compte b, BigDecimal montant) {
    // On ordonne les verrous par un critère stable et
    // total — ici l'identifiant du compte.
    Compte premier  = a.id() < b.id() ? a : b;
    Compte second   = a.id() < b.id() ? b : a;

    synchronized (premier) {
        synchronized (second) {
            a.debite(montant);
            b.credite(montant);
        }
    }
}
// Tous les threads prennent les verrous dans le même
// ordre : plus de cycle possible, donc plus d'interblocage.`,
    },
    {
      kind: "text",
      text: "L'ordre global est la parade la plus fiable et la plus simple à vérifier en revue : il suffit de constater que le critère de tri est stable et total. La seconde parade est `tryLock` avec un délai — on renonce, on relâche tout et l'on réessaie —, moins élégante mais utile quand aucun ordre naturel n'existe. La troisième, la meilleure, est de ne jamais détenir deux verrous à la fois.",
    },
    {
      kind: "comparison",
      title: "Deux blocages qu'on confond",
      left: {
        label: "Interblocage",
        text: "Deux threads se bloquent mutuellement et définitivement. Rien ne progresse et rien ne se débloquera jamais. Détecté automatiquement par un vidage de threads, qui nomme explicitement le cycle et les verrous en cause.",
      },
      right: {
        label: "Famine ou livelock",
        text: "Les threads s'exécutent mais n'avancent pas : l'un est systématiquement devancé, ou deux threads réagissent l'un à l'autre indéfiniment. Le processeur travaille, aucune progression. Aucune détection automatique — seule l'observation du débit le révèle.",
      },
    },
    {
      kind: "text",
      text: "Le premier outil de diagnostic est le vidage de threads, obtenu par `jstack` sur le processus ou par un signal. Il liste chaque thread, son état, sa pile d'appel, et surtout les verrous détenus et attendus. Pour un interblocage véritable, la machine virtuelle imprime une section dédiée qui nomme les threads en cause et le cycle — le diagnostic est alors immédiat.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Ce qu'on regarde, et dans quel ordre.",
      code: `# 1. Vidage de threads : l'état de chaque thread
jstack <pid> > threads.txt
grep -c "java.lang.Thread.State: BLOCKED" threads.txt

# La JVM détecte et nomme les cycles :
#   Found one Java-level deadlock:
#   "thread-1" waiting to lock monitor 0x... which is
#   held by "thread-2"

# 2. En continu, plutôt qu'en réaction :
#    JFR enregistre contention, blocages et durées
java -XX:StartFlightRecording=duration=60s,filename=r.jfr -jar app.jar`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Deux vidages valent mieux qu'un",
      text: "Un vidage isolé ne distingue pas un thread bloqué d'un thread qui passait par là. Deux ou trois vidages espacés de quelques secondes le disent immédiatement : un thread présent au même endroit, dans le même état, sur les trois clichés est réellement bloqué. C'est le geste de diagnostic le plus rentable, et il ne demande aucun outil particulier.",
    },
    {
      kind: "text",
      text: "Un mot sur l'interruption, qui est le mécanisme d'arrêt coopératif de Java. `interrupt()` ne stoppe rien : il positionne un drapeau, et lève une `InterruptedException` sur les méthodes bloquantes qui savent l'observer. Attraper cette exception pour la journaliser puis continuer est une faute classique — le signal d'arrêt est alors perdu. Il faut soit la propager, soit repositionner le drapeau par `Thread.currentThread().interrupt()`.",
    },
    {
      kind: "text",
      text: "Une dernière catégorie d'incident mérite d'être nommée parce qu'elle ressemble à un interblocage sans en être un : la contention. Tous les threads progressent, mais si lentement que le système semble figé, parce qu'ils passent leur temps à attendre le même verrou. Le vidage de threads montre alors des threads `BLOCKED` sur un moniteur unique, et la correction consiste à réduire ou à découper la section critique, pas à chercher un cycle.",
    },
    {
      kind: "text",
      text: "Retenons pour finir la hiérarchie qui traverse tout le chapitre. Ne rien partager vaut mieux que partager de l'immuable, qui vaut mieux qu'utiliser une structure concurrente éprouvée, qui vaut mieux qu'écrire ses propres verrous. Chaque niveau franchi vers le bas ajoute des cas à raisonner et des bugs qui ne se reproduisent pas — et l'expérience montre que c'est le premier niveau qui règle la majorité des situations.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "mcq",
    id: "java-conc-22",
    difficulty: 2,
    tags: ["concurrence", "deadlock"],
    prompt: "Quelle est la parade la plus fiable contre un interblocage à deux verrous ?",
    choices: [
      "Imposer un ordre global d'acquisition, par un critère stable et total.",
      "Augmenter la taille du pool de threads pour qu'il reste des threads disponibles.",
      "Remplacer `synchronized` par `volatile` sur les champs concernés.",
      "Réduire la durée des sections critiques jusqu'à rendre la collision improbable.",
    ],
    answer: 0,
    explanation:
      "Un interblocage exige une attente circulaire ; un ordre global d'acquisition la rend impossible, et cette propriété se vérifie en revue de code. Agrandir le pool ne fait que retarder le blocage. Réduire les sections critiques diminue la probabilité sans supprimer la cause — le bug se manifestera plus tard, sous charge.",
  },
  {
    kind: "order",
    id: "java-conc-23",
    difficulty: 2,
    tags: ["concurrence", "diagnostic"],
    prompt: "L'application ne répond plus, sans erreur dans les journaux. Remets le diagnostic dans l'ordre.",
    items: [
      "Prendre deux ou trois vidages de threads espacés de quelques secondes",
      "Repérer les threads présents au même endroit et dans le même état sur tous les clichés",
      "Lire la section « Found one Java-level deadlock » si la JVM a détecté un cycle",
      "Identifier les deux verrous et l'ordre d'acquisition qui les met en cycle",
      "Imposer un ordre global d'acquisition sur ces verrous",
    ],
    explanation:
      "Un vidage isolé ne distingue pas un thread bloqué d'un thread qui passait par là : c'est la répétition qui donne l'information. La machine virtuelle sait détecter les cycles de moniteurs et les nomme explicitement, ce qui rend le diagnostic immédiat — à condition d'avoir pensé à regarder cette section.",
  },
  {
    kind: "recall",
    id: "java-conc-24",
    difficulty: 3,
    tags: ["concurrence", "deadlock"],
    prompt: "Quelles conditions produisent un interblocage, et comment les briser ?",
    explanation:
      "Quatre conditions doivent être réunies **simultanément** : des ressources en exclusion mutuelle, des threads qui conservent une ressource tout en en attendant une autre, l'impossibilité de retirer une ressource de force, et une attente circulaire. Briser n'importe laquelle suffit, et c'est la dernière qu'on vise en pratique. La parade principale est l'**ordre global d'acquisition** : tous les threads prennent les verrous selon un critère stable et total — un identifiant, par exemple — ce qui rend le cycle impossible et se vérifie en revue de code. La seconde est `tryLock` avec délai : on renonce, on relâche tout et l'on réessaie, ce qui brise la condition de conservation, au prix d'une logique de reprise. La meilleure reste de ne jamais détenir deux verrous à la fois, en repensant le découpage. Il faut enfin distinguer l'interblocage, que la machine virtuelle détecte et nomme dans un vidage de threads, de la famine et du livelock, où les threads s'exécutent sans progresser et qu'aucun outil ne signale.",
    keyPoints: [
      "Exclusion mutuelle, conservation, non-préemption, attente circulaire",
      "Ordre global d'acquisition : brise le cycle, vérifiable en revue",
      "tryLock avec délai : brise la conservation, exige une reprise",
      "Interblocage détecté par la JVM ; famine et livelock, non",
    ],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "java-concurrence",
  title: "Concurrence : visibilité, verrous, exécuteurs et threads virtuels",
  objective:
    "Raisonner sur du code concurrent : distinguer atomicité et visibilité, choisir entre volatile, classes atomiques et verrous, utiliser les collections concurrentes sans se tromper sur les opérations composées, dimensionner un exécuteur, composer sans bloquer, situer l'apport réel des threads virtuels et diagnostiquer un interblocage.",
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
