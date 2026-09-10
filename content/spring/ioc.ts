/**
 * Spring Boot — IoC, beans, injection, scopes (référentiel 2.1).
 * 4 leçons, 30 exercices. Cible Spring Boot 3.x.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Le conteneur et les beans
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-ioc-l1",
  title: "Inversion de contrôle : le conteneur construit vos objets",
  blocks: [
    {
      kind: "text",
      text: "Sans Spring, chaque classe fait `new` sur ses dépendances et les câble elle-même. Avec l'**inversion de contrôle**, c'est le **conteneur** (`ApplicationContext`) qui instancie les objets, les relie entre eux et gère leur cycle de vie. Ces objets gérés s'appellent des **beans**. Vous déclarez ce dont vous avez besoin, Spring fournit.",
    },
    {
      kind: "text",
      text: "Deux façons de déclarer un bean. Un **stéréotype** sur la classe (`@Component`, ou ses spécialisations `@Service`, `@Repository`, `@Controller`) : Spring la découvre par **component scan**. Ou une méthode `@Bean` dans une classe `@Configuration` : indispensable pour les classes tierces qu'on ne peut pas annoter (`ObjectMapper`, `Clock`, un client HTTP).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Stéréotype pour vos classes, @Bean pour les autres.",
      code: `@Service
public class OrderService {
    private final OrderRepository repo;
    private final Clock clock;

    // un seul constructeur : @Autowired implicite
    public OrderService(OrderRepository repo, Clock clock) {
        this.repo = repo;
        this.clock = clock;
    }
}

@Configuration
public class TimeConfig {
    @Bean
    public Clock clock() {
        // classe du JDK : impossible de l'annoter
        return Clock.systemUTC();
    }
}`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Le component scan part du **package de la classe `@SpringBootApplication`** et descend dans ses sous-packages. Une classe `@Service` placée dans un package frère n'est pas vue : `NoSuchBeanDefinitionException` au démarrage.",
    },
    {
      kind: "text",
      text: "Les stéréotypes sont techniquement équivalents à `@Component`, mais `@Repository` ajoute la traduction des exceptions de persistance en `DataAccessException`, et `@Controller` est reconnu par Spring MVC. Le nom d'un bean est, par défaut, le nom de sa classe avec l'initiale en minuscule : `orderService`.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-ioc-01",
    difficulty: 1,
    tags: ["beans", "spring-ioc"],
    prompt: "Quelle est la différence entre `@Component` et `@Bean` ?",
    choices: [
      "`@Component` annote une classe découverte par le scan ; `@Bean` annote une méthode de `@Configuration` qui construit l'objet, utile pour les classes tierces qu'on ne peut pas annoter.",
      "`@Bean` crée un singleton, `@Component` un prototype.",
      "`@Component` est réservé aux services, `@Bean` aux repositories.",
      "Aucune : `@Bean` est l'ancien nom de `@Component`.",
    ],
    answer: 0,
    explanation:
      "Les deux produisent un bean singleton par défaut. La différence est le **lieu** : sur la classe (scan automatique) ou sur une méthode de fabrique (contrôle total, classes du JDK ou de bibliothèques). `@Bean` permet aussi de choisir le nom, le scope et la logique de construction.",
  },
  {
    kind: "output",
    id: "spring-ioc-02",
    difficulty: 2,
    tags: ["component-scan", "beans"],
    prompt: "Que se passe-t-il au démarrage ?",
    code: {
      language: "java",
      code: `// com.shop.App
@SpringBootApplication
public class App { ... }

// com.shop.order.OrderService
@Service
public class OrderService {
    public OrderService(Invoicer invoicer) { ... }
}

// com.billing.Invoicer
@Service
public class Invoicer { ... }`,
    },
    choices: [
      "Échec : `NoSuchBeanDefinitionException`, `com.billing` n'est pas sous `com.shop`, `Invoicer` n'est pas scanné.",
      "Démarre : tous les `@Service` du classpath sont scannés.",
      "Échec : deux `@Service` dans des packages différents entrent en conflit.",
      "Démarre, mais `Invoicer` est créé en scope prototype.",
    ],
    answer: 0,
    explanation:
      "`@SpringBootApplication` inclut `@ComponentScan` sans argument : le scan couvre `com.shop` et ses sous-packages. `com.billing` est un package frère, `Invoicer` n'est jamais enregistré, et l'injection dans `OrderService` échoue. Solutions : déplacer `Invoicer`, ou `@ComponentScan(basePackages = {\"com.shop\", \"com.billing\"})`.",
  },
  {
    kind: "fill",
    id: "spring-ioc-03",
    difficulty: 1,
    tags: ["beans", "cycle-de-vie"],
    prompt: "Complète pour que `Clock` soit un bean et que `init()` s'exécute après l'injection.",
    code: {
      language: "java",
      code: `@Configuration
public class ClockConfig {
    @{{1}}
    public Clock clock() { return Clock.systemUTC(); }
}

@Service
public class OrderService {
    private final Clock clock;
    public OrderService(Clock clock) { this.clock = clock; }

    @{{2}}
    void init() { log.info("prêt à {}", clock.instant()); }
}`,
    },
    blanks: ["Bean", "PostConstruct"],
    distractors: ["Component", "Configuration", "Service"],
    explanation:
      "`@Bean` sur une méthode de `@Configuration` enregistre son retour comme bean. `@PostConstruct` (jakarta.annotation) marque la méthode appelée une fois les dépendances injectées. `@Component`, `@Configuration` et `@Service` ne s'appliquent qu'à des classes : sur une méthode, erreur de compilation.",
  },
  {
    kind: "spot",
    id: "spring-ioc-04",
    difficulty: 2,
    tags: ["injection", "conception"],
    prompt: "Ce code fonctionne, mais un relecteur le refuse. Trouve la ligne en cause.",
    code: {
      language: "java",
      code: `@Service
public class OrderService {
    @Autowired private PaymentGateway gateway;

    public Receipt pay(Order o) {
        return gateway.charge(o);
    }
}`,
    },
    faultyLine: 3,
    reasons: [
      "Injection par champ : `gateway` ne peut pas être `final`, la dépendance est invisible dans la signature, et un test unitaire doit passer par la réflexion. Injecter par constructeur.",
      "`@Autowired` doit aussi être placé sur la classe.",
      "Un champ injecté doit être `public` pour que Spring y accède.",
      "`PaymentGateway` doit être une classe concrète, pas une interface.",
    ],
    reasonAnswer: 0,
    explanation:
      "Spring injecte les champs privés par réflexion, ça marche. Mais la classe ne peut plus être construite hors du conteneur sans `ReflectionTestUtils`, `gateway` peut être `null` entre construction et injection, et rien n'empêche l'accumulation de dépendances. Le constructeur rend tout explicite et permet `final`.",
  },
  {
    kind: "mcq",
    id: "spring-ioc-05",
    difficulty: 2,
    tags: ["injection"],
    prompt: "Un `@Service` avec un seul constructeur à deux paramètres. Faut-il `@Autowired` dessus ?",
    choices: [
      "Non : depuis Spring 4.3, un unique constructeur est utilisé automatiquement pour l'injection.",
      "Oui, sinon Spring utilise le constructeur par défaut et échoue.",
      "Oui, sauf si les paramètres sont eux-mêmes des `@Component`.",
      "Non, mais il faut `@Inject` de Jakarta.",
    ],
    answer: 0,
    explanation:
      "Avec un seul constructeur, l'intention est claire et Spring l'utilise. `@Autowired` redevient nécessaire seulement s'il y a plusieurs constructeurs, pour désigner celui à utiliser. Lombok `@RequiredArgsConstructor` s'appuie sur cette règle.",
  },
  {
    kind: "match",
    id: "spring-ioc-06",
    difficulty: 1,
    tags: ["beans"],
    prompt: "Associe chaque annotation à son rôle.",
    pairs: [
      { left: "`@Component`", right: "Bean générique découvert par le scan" },
      { left: "`@Service`", right: "Bean de la couche métier" },
      { left: "`@Repository`", right: "Accès aux données, exceptions traduites en `DataAccessException`" },
      { left: "`@RestController`", right: "Bean web, retours sérialisés en JSON" },
      { left: "`@Configuration`", right: "Classe qui déclare des méthodes `@Bean`" },
    ],
    explanation:
      "Tous sont des `@Component` spécialisés. `@Service` n'ajoute rien techniquement, il documente la couche. `@Repository` active la traduction des exceptions JPA/JDBC. `@RestController` est `@Controller` + `@ResponseBody`. `@Configuration` est proxifiée pour garantir un singleton par méthode `@Bean`.",
  },
  {
    kind: "recall",
    id: "spring-ioc-07",
    difficulty: 2,
    tags: ["spring-ioc"],
    prompt: "Qu'est-ce que l'inversion de contrôle ? Que fait concrètement le conteneur Spring au démarrage ?",
    explanation:
      "Sans IoC, une classe crée et assemble ses dépendances (`new`), et décide donc de leur implémentation. Avec l'**inversion de contrôle**, elle déclare ce dont elle a besoin (paramètres de constructeur) et un **conteneur** externe lui fournit des instances : le contrôle de la construction est inversé. L'**injection de dépendances** en est le mécanisme. Au démarrage, `ApplicationContext` **scanne** les classes annotées et lit les `@Configuration`, construit un graphe de **définitions de beans**, résout les dépendances, **instancie** dans le bon ordre (constructeur), injecte, appelle `@PostConstruct`, applique les post-processeurs (proxies `@Transactional`), puis sert les beans. Bénéfices : couplage aux interfaces, substitution en test, configuration centralisée.",
    keyPoints: ["La classe déclare, le conteneur fournit", "Scan + `@Configuration` → définitions", "Instanciation dans l'ordre des dépendances", "`@PostConstruct`, proxies, puis service"],
  },
  {
    kind: "order",
    id: "spring-ioc-08",
    difficulty: 2,
    tags: ["cycle-de-vie", "spring-ioc"],
    prompt: "Remets dans l'ordre ce que fait le conteneur, du démarrage à l'arrêt.",
    items: [
      "Scan des classes annotées et lecture des `@Configuration` : définitions de beans",
      "Instanciation par constructeur, dans l'ordre des dépendances",
      "Injection des dépendances restantes (setters, champs)",
      "Appel des méthodes `@PostConstruct`",
      "Application prête : `ApplicationReadyEvent`",
      "Appel des méthodes `@PreDestroy` à la fermeture du contexte",
    ],
    explanation:
      "Les définitions d'abord, sans rien instancier. Puis chaque bean est construit après ses dépendances de constructeur, complété par injection de champs ou setters, puis initialisé (`@PostConstruct`). Une fois tous les singletons prêts, l'application est déclarée disponible. `@PreDestroy` n'est appelé qu'à l'arrêt propre du contexte.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Injection : plusieurs implémentations, cycles
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-ioc-l2",
  title: "Choisir parmi plusieurs beans, et éviter les cycles",
  blocks: [
    {
      kind: "text",
      text: "Quand une interface a **plusieurs** implémentations enregistrées, injecter l'interface seule échoue au démarrage : `NoUniqueBeanDefinitionException`. Trois façons de lever l'ambiguïté : `@Qualifier(\"nom\")` sur le point d'injection, `@Primary` sur l'implémentation à préférer par défaut, ou injecter **toutes** les implémentations avec `List<Interface>` (ou `Map<String, Interface>`, clé = nom du bean).",
    },
    {
      kind: "code",
      language: "java",
      caption: "Qualifier pour cibler, Primary pour le défaut, List pour tout.",
      code: `public interface Notifier { void send(String msg); }

@Service @Primary
public class EmailNotifier implements Notifier { ... }

@Service
public class SmsNotifier implements Notifier { ... }

@Service
public class Alerts {
    private final Notifier urgent;
    private final List<Notifier> all;

    public Alerts(@Qualifier("smsNotifier") Notifier urgent,
                  List<Notifier> all) {
        this.urgent = urgent;   // le SMS
        this.all = all;         // les deux, email en tête
    }
}`,
    },
    {
      kind: "text",
      text: "Une **dépendance circulaire** (A a besoin de B, B a besoin de A) est impossible à satisfaire par constructeur : aucun des deux ne peut être construit en premier. Spring échoue au démarrage avec `BeanCurrentlyInCreationException`. Depuis Boot 2.6, les cycles sont interdits par défaut **même** par champ ou setter.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Conseil",
      text: "Un cycle signale presque toujours une responsabilité mal placée : extraire ce que A et B partagent dans un troisième bean. `@Lazy` sur l'un des paramètres (un proxy résolu au premier appel) ou `spring.main.allow-circular-references=true` sont des rustines, pas des solutions.",
    },
    {
      kind: "text",
      text: "L'injection par constructeur a un dernier mérite : elle **détecte** ces cycles immédiatement, au démarrage, là où l'injection par champ les masquait jusqu'à un `NullPointerException` tardif.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "spring-ioc-09",
    difficulty: 2,
    tags: ["injection", "beans"],
    prompt: "Que se passe-t-il au démarrage ?",
    code: {
      language: "java",
      code: `public interface Notifier { void send(String m); }

@Service
public class EmailNotifier implements Notifier { ... }

@Service
public class SmsNotifier implements Notifier { ... }

@Service
public class Alerts {
    public Alerts(Notifier notifier) { ... }
}`,
    },
    choices: [
      "Échec : `NoUniqueBeanDefinitionException`, deux beans candidats pour `Notifier`.",
      "Démarre : Spring choisit le premier par ordre alphabétique, `EmailNotifier`.",
      "Démarre : Spring injecte `EmailNotifier`, déclaré en premier dans le fichier.",
      "Démarre, mais `notifier` vaut `null`.",
    ],
    answer: 0,
    explanation:
      "Deux beans satisfont `Notifier`, Spring refuse de deviner : « expected single matching bean but found 2: emailNotifier,smsNotifier ». Une exception : si le **nom du paramètre** correspond au nom d'un bean (`Notifier smsNotifier`), Spring l'utilise comme qualificateur de secours. Sinon, `@Qualifier` ou `@Primary`.",
  },
  {
    kind: "fill",
    id: "spring-ioc-10",
    difficulty: 2,
    tags: ["injection", "beans"],
    prompt: "Complète : `Alerts` doit recevoir le SMS, et l'e-mail doit être le choix par défaut partout ailleurs.",
    code: {
      language: "java",
      code: `@Service
public class Alerts {
    private final Notifier notifier;
    public Alerts(@{{1}}("smsNotifier") Notifier notifier) {
        this.notifier = notifier;
    }
}

@Service
@{{2}}
public class EmailNotifier implements Notifier { ... }`,
    },
    blanks: ["Qualifier", "Primary"],
    distractors: ["Bean", "Component", "Override"],
    explanation:
      "`@Qualifier(\"smsNotifier\")` cible un bean par son nom (nom de classe, initiale en minuscule). `@Primary` sur `EmailNotifier` en fait le candidat retenu quand l'injection ne précise rien. `@Bean` va sur une méthode, `@Component` doublonnerait `@Service`, `@Override` n'a pas de sens ici.",
  },
  {
    kind: "output",
    id: "spring-ioc-11",
    difficulty: 2,
    tags: ["injection", "beans"],
    prompt: "Qu'affiche `broadcast.count()` ?",
    code: {
      language: "java",
      code: `@Service
public class EmailNotifier implements Notifier { ... }

@Service
public class SmsNotifier implements Notifier { ... }

@Service
public class Broadcast {
    private final List<Notifier> all;
    public Broadcast(List<Notifier> all) { this.all = all; }
    public int count() { return all.size(); }
}`,
    },
    choices: [
      "`2` : toutes les implémentations sont injectées dans la liste.",
      "Échec au démarrage : `NoUniqueBeanDefinitionException`.",
      "`1` : seul le bean `@Primary` est injecté.",
      "`0` : une `List` ne peut pas être injectée.",
    ],
    answer: 0,
    explanation:
      "Injecter `List<Notifier>` demande **tous** les beans du type : aucune ambiguïté, c'est un cas d'usage courant (chaîne de validateurs, stratégies). L'ordre suit `@Order` si présent. `Map<String, Notifier>` donnerait les mêmes beans indexés par nom.",
  },
  {
    kind: "mcq",
    id: "spring-ioc-12",
    difficulty: 2,
    tags: ["beans"],
    prompt: "Quel est le nom par défaut du bean `@Service class SmsNotifier` ?",
    choices: ["`smsNotifier`", "`SmsNotifier`", "`notifier`", "`com.shop.SmsNotifier`"],
    answer: 0,
    explanation:
      "Nom de classe avec la première lettre en minuscule (règle `Introspector.decapitalize`). Pour une méthode `@Bean`, c'est le nom de la méthode. On peut forcer : `@Service(\"sms\")` ou `@Bean(name = \"sms\")`. C'est ce nom que `@Qualifier` attend.",
  },
  {
    kind: "spot",
    id: "spring-ioc-13",
    difficulty: 2,
    tags: ["dependances-circulaires", "injection"],
    prompt: "Le démarrage échoue avec `BeanCurrentlyInCreationException`. Trouve la ligne qui referme le cycle.",
    code: {
      language: "java",
      code: `@Service
public class OrderService {
    private final InvoiceService invoices;
    public OrderService(InvoiceService i) { this.invoices = i; }
}

@Service
public class InvoiceService {
    private final OrderService orders;
    public InvoiceService(OrderService o) { this.orders = o; }
}`,
    },
    faultyLine: 10,
    reasons: [
      "Cycle A → B → A : par constructeur, aucun des deux ne peut être construit en premier. Extraire la logique commune dans un troisième bean, ou `@Lazy` en dernier recours.",
      "Il manque `@Autowired` sur les deux constructeurs.",
      "Les champs `final` empêchent Spring d'injecter après construction.",
      "Deux `@Service` ne peuvent pas se référencer mutuellement, il faut `@Component`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Pour construire `OrderService`, Spring a besoin d'un `InvoiceService` ; pour le construire, il a besoin d'un `OrderService` en cours de création. Impasse détectée au démarrage. `final` et l'absence d'`@Autowired` sont corrects. La vraie correction est de conception : ce que les deux partagent (calcul de montant ?) va dans un `PricingService` dont les deux dépendent.",
  },
  {
    kind: "recall",
    id: "spring-ioc-14",
    difficulty: 2,
    tags: ["injection", "conception"],
    prompt: "Pourquoi préférer l'injection par constructeur à l'injection par champ ?",
    explanation:
      "**Immutabilité** : les dépendances sont `final`, affectées une fois. **Visibilité** : la signature du constructeur liste tout ce dont la classe dépend ; dix paramètres signalent une classe à découper. **Testabilité** : `new OrderService(mockRepo, fixedClock)` sans conteneur ni réflexion. **Sûreté** : l'objet est complet dès sa construction, jamais dans un état où un champ injecté vaut encore `null`. **Détection des cycles** au démarrage plutôt qu'un `NullPointerException` tardif. Depuis Spring 4.3, un constructeur unique n'a même pas besoin d'`@Autowired`. L'injection par champ ne garde qu'un avantage : moins de lignes, ce que Lombok `@RequiredArgsConstructor` compense.",
    keyPoints: ["`final` + objet complet à la construction", "Dépendances visibles", "Test sans conteneur", "Cycles détectés tôt"],
  },
  {
    kind: "mcq",
    id: "spring-ioc-15",
    difficulty: 2,
    tags: ["dependances-circulaires"],
    prompt: "Sous Spring Boot 3, un cycle A ↔ B injecté par **champ** (`@Autowired`), pas par constructeur. Que se passe-t-il ?",
    choices: [
      "Échec au démarrage : depuis Boot 2.6, les références circulaires sont interdites par défaut, même par champ ou setter.",
      "Démarre : l'injection par champ résout les cycles grâce à des proxies.",
      "Démarre : Spring injecte `null` puis complète après construction.",
      "Erreur de compilation.",
    ],
    answer: 0,
    explanation:
      "Historiquement, l'injection par champ tolérait les cycles (Spring injectait une référence anticipée). Boot 2.6 a mis `spring.main.allow-circular-references` à `false` : le démarrage échoue avec un message qui dessine le cycle. On peut rouvrir la porte avec cette propriété, mais c'est un aveu de conception à corriger.",
  },
  {
    kind: "match",
    id: "spring-ioc-16",
    difficulty: 2,
    tags: ["injection", "beans"],
    prompt: "Associe chaque mécanisme à son effet.",
    pairs: [
      { left: "`@Qualifier(\"x\")`", right: "Choisit un bean par son nom" },
      { left: "`@Primary`", right: "Préféré quand plusieurs candidats et rien de précisé" },
      { left: "`List<Notifier>`", right: "Toutes les implémentations" },
      { left: "`Map<String, Notifier>`", right: "Toutes les implémentations, indexées par nom de bean" },
      { left: "`@Lazy` sur un paramètre", right: "Proxy résolu au premier appel" },
    ],
    explanation:
      "`@Qualifier` gagne sur `@Primary`. Les collections injectent tout sans ambiguïté et respectent `@Order`. `@Lazy` retarde la résolution, ce qui casse un cycle au prix d'un proxy : à réserver aux cas sans refactor possible.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Scopes et cycle de vie
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-ioc-l3",
  title: "Singleton par défaut : un seul objet pour tout le monde",
  blocks: [
    {
      kind: "text",
      text: "Le **scope** d'un bean dit combien d'instances existent. Par défaut, **singleton** : une seule instance par contexte, partagée par tous ceux qui l'injectent et par toutes les requêtes HTTP en parallèle. Conséquence : un champ mutable dans un `@Service` est un **état partagé** entre threads, presque toujours un bug.",
    },
    {
      kind: "text",
      text: "**prototype** : une nouvelle instance à chaque injection ou `getBean`. Injecté dans un singleton, il n'est créé qu'une fois, à la construction du singleton. Pour en obtenir un frais à chaque appel : `ObjectProvider<T>`. **request** et **session** (web) : une instance par requête ou par session, injectée dans un singleton via un **proxy** qui délègue à l'instance courante.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Singleton stateless, prototype via ObjectProvider, hooks de cycle de vie.",
      code: `@Service
public class OrderService {
    // PAS de champ mutable : partagé par tous les threads
    private final OrderRepository repo;
    public OrderService(OrderRepository repo) { this.repo = repo; }
}

@Component
@Scope("prototype")
public class ReportBuilder { /* état par rapport */ }

@Service
public class Reports {
    private final ObjectProvider<ReportBuilder> builders;
    public Reports(ObjectProvider<ReportBuilder> b) { builders = b; }
    public Report build() {
        return builders.getObject().run();   // nouveau à chaque fois
    }
}

@Component
public class CacheWarmer {
    @PostConstruct
    void warm() { /* dépendances injectées, prêt */ }
    @PreDestroy
    void close() { /* arrêt propre du contexte */ }
}`,
    },
    {
      kind: "text",
      text: "Cycle de vie d'un singleton : constructeur (avec ses dépendances), injection des champs et setters, `@PostConstruct`, puis les **post-processeurs** qui peuvent envelopper le bean dans un proxy (`@Transactional`, `@Async`). Le bean rendu aux autres est ce proxy. À la fermeture du contexte : `@PreDestroy`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Une méthode `@PostConstruct` ne prend **aucun paramètre** et renvoie `void`, sinon échec au démarrage. Et ne faites pas de travail lourd dans le constructeur : à ce moment, les proxies ne sont pas posés et les autres beans ne sont peut-être pas prêts.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "spring-ioc-17",
    difficulty: 2,
    tags: ["scopes", "beans"],
    prompt: "Deux contrôleurs distincts reçoivent chacun un `Counter` par injection. Qu'affiche la dernière ligne ?",
    code: {
      language: "java",
      code: `@Service
public class Counter {
    private int hits = 0;
    public int hit() { return ++hits; }
}

// dans le code appelant :
controllerA.counter.hit();
controllerB.counter.hit();
System.out.println(controllerA.counter.hit());`,
    },
    choices: [
      "`3` : le singleton est partagé, il n'y a qu'un `Counter`.",
      "`2` : chaque contrôleur a reçu sa propre instance.",
      "`1` : chaque appel de `hit()` passe par une nouvelle instance.",
      "Erreur au démarrage : un champ mutable est interdit dans un `@Service`.",
    ],
    answer: 0,
    explanation:
      "Scope singleton par défaut : les deux contrôleurs tiennent la **même** référence. Trois appels, `hits` vaut 3. Et comme deux requêtes HTTP concurrentes partagent aussi cet objet, `++hits` sans synchronisation est une race condition. Un compteur partagé serait un `AtomicInteger` ; un état par requête relève du scope request ou d'un objet local.",
  },
  {
    kind: "mcq",
    id: "spring-ioc-18",
    difficulty: 2,
    tags: ["scopes"],
    prompt: "Un bean `@Scope(\"prototype\")` est injecté par constructeur dans un `@Service` singleton. Combien d'instances du prototype sont créées ?",
    choices: [
      "Une seule, à la construction du singleton : pour en obtenir une nouvelle à chaque appel, il faut `ObjectProvider<T>` ou `@Lookup`.",
      "Une par appel de méthode du singleton.",
      "Une par thread qui utilise le singleton.",
      "Aucune : erreur au démarrage, scopes incompatibles.",
    ],
    answer: 0,
    explanation:
      "L'injection a lieu une fois, quand le singleton est construit. Le prototype injecté vit ensuite aussi longtemps que lui. « Prototype » ne veut pas dire « nouveau à chaque usage » mais « nouveau à chaque demande au conteneur » : `ObjectProvider.getObject()` fait cette demande à chaque appel.",
  },
  {
    kind: "fill",
    id: "spring-ioc-19",
    difficulty: 2,
    tags: ["scopes", "injection"],
    prompt: "Complète : `build()` doit obtenir un `ReportBuilder` neuf à chaque appel.",
    code: {
      language: "java",
      code: `@Component
@Scope("{{1}}")
public class ReportBuilder { ... }

@Service
public class Reports {
    private final {{2}}<ReportBuilder> builders;
    public Reports({{3}}<ReportBuilder> b) { builders = b; }
    public Report build() {
        return builders.{{4}}().run();
    }
}`,
    },
    blanks: ["prototype", "ObjectProvider", "ObjectProvider", "getObject"],
    distractors: ["singleton", "List", "Supplier", "request"],
    explanation:
      "`prototype` pour une instance par demande, `ObjectProvider<T>` pour faire cette demande au moment voulu avec `getObject()`. `singleton` renverrait toujours le même objet ; `request` ne s'applique qu'en contexte web et donne une instance par requête, pas par appel. `List` ou `Supplier` n'ont pas de `getObject()`.",
  },
  {
    kind: "spot",
    id: "spring-ioc-20",
    difficulty: 2,
    tags: ["cycle-de-vie"],
    prompt: "Le démarrage échoue. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@Service
public class CacheWarmer {
    private final ProductRepository repo;
    public CacheWarmer(ProductRepository r) { this.repo = r; }
    @PostConstruct public void warm(int size) { repo.top(size); }
}`,
    },
    faultyLine: 5,
    reasons: [
      "Une méthode `@PostConstruct` ne prend aucun paramètre (et renvoie `void`) : Spring échoue au démarrage.",
      "`@PostConstruct` doit être placée avant le constructeur dans le fichier.",
      "`repo` n'est pas encore injecté quand `@PostConstruct` s'exécute.",
      "`warm` doit être `static` pour être appelée au démarrage.",
    ],
    reasonAnswer: 0,
    explanation:
      "Spring appelle la méthode d'initialisation sans argument : avec un paramètre, il refuse (« Lifecycle method annotation requires a no-arg method »). L'ordre dans le fichier est sans importance, et les dépendances sont bien injectées avant `@PostConstruct`, c'est justement son intérêt. Correction : `void warm() { repo.top(100); }`.",
  },
  {
    kind: "recall",
    id: "spring-ioc-21",
    difficulty: 2,
    tags: ["cycle-de-vie", "scopes"],
    prompt: "Décris le cycle de vie d'un bean singleton, du démarrage à l'arrêt. Pourquoi ne pas faire le travail d'initialisation dans le constructeur ?",
    explanation:
      "1. **Instanciation** par le constructeur, avec les dépendances de constructeur déjà résolues. 2. **Injection** des champs et setters `@Autowired`. 3. `@PostConstruct` (ou `InitializingBean.afterPropertiesSet`). 4. **Post-processeurs** : le bean peut être enveloppé dans un proxy (`@Transactional`, `@Async`, `@Cacheable`) ; c'est ce proxy qui est injecté ailleurs. 5. En service pendant toute la vie du contexte. 6. `@PreDestroy` à la fermeture. Le constructeur n'est pas le bon endroit pour un travail lourd : les champs injectés hors constructeur ne sont pas encore là, les proxies ne sont pas posés (un appel `@Transactional` interne ne serait pas transactionnel), et une exception y rend le bean impossible à créer. `@PostConstruct` s'exécute avec un objet complet.",
    keyPoints: ["Constructeur → injection → `@PostConstruct` → proxies → service → `@PreDestroy`", "Le proxy est posé après `@PostConstruct`", "Travail lourd dans `@PostConstruct`, pas dans le constructeur"],
  },
  {
    kind: "order",
    id: "spring-ioc-22",
    difficulty: 2,
    tags: ["cycle-de-vie"],
    prompt: "Remets dans l'ordre les étapes de la vie d'un bean singleton.",
    items: [
      "Constructeur, avec les dépendances de constructeur résolues",
      "Injection des champs et setters `@Autowired`",
      "`@PostConstruct`",
      "Post-processeurs : enveloppement éventuel dans un proxy (`@Transactional`)",
      "Bean en service, injecté dans les autres",
      "`@PreDestroy` à la fermeture du contexte",
    ],
    explanation:
      "Retenir que `@PostConstruct` précède la pose du proxy : une méthode `@Transactional` appelée depuis `@PostConstruct` ne l'est pas encore. Et que le bean vu par les autres est le proxy final, pas l'objet brut construit à l'étape 1.",
  },
  {
    kind: "mcq",
    id: "spring-ioc-23",
    difficulty: 2,
    tags: ["scopes"],
    prompt: "Un bean `@RequestScope` est injecté dans un `@Service` singleton. Comment cela peut-il fonctionner ?",
    choices: [
      "Par un proxy : le singleton tient un proxy qui délègue, à chaque appel, à l'instance liée à la requête HTTP en cours.",
      "Impossible : erreur au démarrage, un singleton ne peut pas dépendre d'un scope plus court.",
      "Le singleton devient lui-même request-scoped.",
      "Spring réinjecte le champ du singleton à chaque nouvelle requête.",
    ],
    answer: 0,
    explanation:
      "`@RequestScope` équivaut à `@Scope(value = \"request\", proxyMode = TARGET_CLASS)`. Le singleton est construit une fois avec un proxy ; ce proxy consulte le contexte de la requête courante (via un `ThreadLocal`) à chaque appel de méthode. Hors requête HTTP (thread de batch), l'appel échoue : « No thread-bound request found ».",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Auto-configuration et starters
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-ioc-l4",
  title: "Auto-configuration : des beans si, et seulement si",
  blocks: [
    {
      kind: "text",
      text: "Spring Boot ne devine rien : il applique des classes d'**auto-configuration** livrées dans les starters, chacune gardée par des **conditions**. `@ConditionalOnClass(DataSource.class)` : seulement si la classe est sur le classpath. `@ConditionalOnMissingBean` : seulement si l'application n'a pas déjà défini ce bean. `@ConditionalOnProperty` : selon une propriété.",
    },
    {
      kind: "text",
      text: "Vos `@Configuration` sont traitées **avant** les auto-configurations. C'est ce qui rend `@ConditionalOnMissingBean` utile : déclarez votre propre `ObjectMapper`, et celui de Boot n'est simplement pas créé. Pour retirer une auto-configuration entière : `@SpringBootApplication(exclude = ...)` ou `spring.autoconfigure.exclude`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une auto-configuration réduite à l'essentiel.",
      code: `@AutoConfiguration
@ConditionalOnClass(RedisClient.class)
public class RedisAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public RedisClient redisClient(RedisProperties props) {
        // créé seulement si l'app n'en définit pas
        return RedisClient.create(props.url());
    }
}

// Retirer une auto-configuration :
@SpringBootApplication(
    exclude = DataSourceAutoConfiguration.class)
public class App { }`,
    },
    {
      kind: "text",
      text: "Un **starter** est une dépendance vide qui tire les bonnes bibliothèques. `spring-boot-starter-web` apporte Spring MVC, Tomcat embarqué et Jackson. Il **n'apporte pas** la validation : `spring-boot-starter-validation` est séparé depuis Boot 2.3, un piège classique quand `@Valid` semble ignoré.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Conseil",
      text: "Pour savoir ce qui a été appliqué ou non et pourquoi, lancer avec `--debug` : le « CONDITIONS EVALUATION REPORT » liste chaque auto-configuration et la condition qui l'a retenue ou écartée.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-ioc-24",
    difficulty: 2,
    tags: ["autoconfiguration", "beans"],
    prompt: "Tu déclares ton propre `@Bean ObjectMapper` dans une `@Configuration`. Que devient celui fourni par l'auto-configuration Jackson ?",
    choices: [
      "Il n'est pas créé : son `@ConditionalOnMissingBean` voit ton bean, déclaré avant les auto-configurations.",
      "Conflit : deux beans `ObjectMapper`, échec au démarrage.",
      "Les deux coexistent ; le tien doit porter `@Primary`.",
      "Le tien est ignoré : l'auto-configuration a la priorité.",
    ],
    answer: 0,
    explanation:
      "Les configurations utilisateur sont traitées d'abord ; l'auto-configuration, gardée par `@ConditionalOnMissingBean`, se retire. C'est le contrat de Boot : des défauts raisonnables qui s'effacent devant vos choix. Attention, en remplaçant l'`ObjectMapper`, on perd les personnalisations `spring.jackson.*` ; souvent un `Jackson2ObjectMapperBuilderCustomizer` suffit.",
  },
  {
    kind: "mcq",
    id: "spring-ioc-25",
    difficulty: 2,
    tags: ["autoconfiguration", "starters"],
    prompt: "Que contient réellement `spring-boot-starter-web` ?",
    choices: [
      "Spring MVC, un Tomcat embarqué et Jackson ; pas la validation, qui est dans `spring-boot-starter-validation` depuis Boot 2.3.",
      "Spring MVC, Tomcat, Jackson et Hibernate Validator.",
      "Spring MVC et Spring Data JPA.",
      "Uniquement Spring MVC : le serveur est à ajouter.",
    ],
    answer: 0,
    explanation:
      "Le starter tire `spring-webmvc`, `spring-boot-starter-tomcat` et `spring-boot-starter-json` (Jackson). Depuis Boot 2.3, `hibernate-validator` n'en fait plus partie : sans `starter-validation`, les annotations `jakarta.validation` ne sont pas sur le classpath. JPA vient de `starter-data-jpa`.",
  },
  {
    kind: "fill",
    id: "spring-ioc-26",
    difficulty: 2,
    tags: ["autoconfiguration"],
    prompt: "Complète : le client n'est créé que si la bibliothèque est présente et si l'application n'en définit pas ; puis l'application exclut cette auto-configuration.",
    code: {
      language: "java",
      code: `@AutoConfiguration
@{{1}}(RedisClient.class)
public class RedisAutoConfiguration {
    @Bean
    @{{2}}
    public RedisClient redisClient() { ... }
}

@{{3}}(exclude = RedisAutoConfiguration.class)
public class App { }`,
    },
    blanks: ["ConditionalOnClass", "ConditionalOnMissingBean", "SpringBootApplication"],
    distractors: ["ConditionalOnBean", "Configuration", "Profile"],
    explanation:
      "`@ConditionalOnClass` garde toute la classe selon le classpath. `@ConditionalOnMissingBean` sur la méthode cède la place au bean de l'utilisateur ; `@ConditionalOnBean` ferait l'inverse. `@SpringBootApplication` expose `exclude`. `@Configuration` et `@Profile` n'acceptent pas ces arguments.",
  },
  {
    kind: "spot",
    id: "spring-ioc-27",
    difficulty: 3,
    tags: ["beans", "autoconfiguration"],
    prompt: "Deux `HttpClient` sont créés alors qu'on en voulait un seul, partagé. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `@Configuration(proxyBeanMethods = false)
public class ClientConfig {
    @Bean public HttpClient client() { return HttpClient.newHttpClient(); }
    @Bean public OrderApi orderApi() { return new OrderApi(client()); }
    @Bean public UserApi userApi() { return new UserApi(client()); }
}`,
    },
    faultyLine: 1,
    reasons: [
      "`proxyBeanMethods = false` désactive le proxy CGLIB : `client()` devient un appel Java ordinaire qui construit un nouvel objet. Injecter `HttpClient` en paramètre des méthodes `@Bean`, ou retirer l'option.",
      "Il faut `@Scope(\"singleton\")` explicitement sur `client()`.",
      "Une méthode `@Bean` n'a pas le droit d'appeler une autre méthode `@Bean`.",
      "`HttpClient` vient du JDK et ne peut pas être un bean.",
    ],
    reasonAnswer: 0,
    explanation:
      "Par défaut, `@Configuration` est proxifiée : un appel inter-`@Bean` est intercepté et renvoie le singleton du conteneur. `proxyBeanMethods = false` (optimisation du temps de démarrage) supprime cette garantie. La forme robuste, valable dans les deux modes : `orderApi(HttpClient client)`, Spring injecte le bean.",
  },
  {
    kind: "recall",
    id: "spring-ioc-28",
    difficulty: 2,
    tags: ["autoconfiguration"],
    prompt: "Comment fonctionne l'auto-configuration de Spring Boot, et comment en désactiver une ?",
    explanation:
      "Chaque starter embarque des classes `@AutoConfiguration` listées dans `META-INF/spring/…AutoConfiguration.imports`. Boot les charge **après** vos configurations et évalue leurs **conditions** : `@ConditionalOnClass` (bibliothèque présente), `@ConditionalOnMissingBean` (vous n'avez pas déjà défini ce bean), `@ConditionalOnProperty`, `@ConditionalOnWebApplication`. Seuls les beans dont les conditions passent sont créés. Résultat : un `DataSource`, un `ObjectMapper`, un `Tomcat` apparaissent « tout seuls », mais s'effacent devant les vôtres. Pour désactiver : `@SpringBootApplication(exclude = X.class)` ou la propriété `spring.autoconfigure.exclude`. Pour comprendre : `--debug` et son rapport de conditions.",
    keyPoints: ["Classes `@AutoConfiguration` gardées par des conditions", "Traitées après vos `@Configuration`", "`@ConditionalOnMissingBean` = vos beans gagnent", "`exclude` ou `spring.autoconfigure.exclude`", "`--debug` pour le rapport"],
  },
  {
    kind: "recall",
    id: "spring-ioc-29",
    difficulty: 3,
    tags: ["autoconfiguration", "beans"],
    prompt: "Explique `@ConditionalOnMissingBean` : pourquoi les auto-configurations l'utilisent, et pourquoi il ne faut pas s'y fier dans ses propres `@Configuration`.",
    explanation:
      "`@ConditionalOnMissingBean` crée le bean seulement si aucun bean du même type (ou nom) n'existe **au moment où la condition est évaluée**. Les auto-configurations s'en servent pour offrir un défaut remplaçable : Boot garantit qu'elles sont évaluées **après** toutes les configurations de l'application, donc la condition voit vos beans. Dans vos propres `@Configuration`, cet ordre n'est pas garanti : deux classes utilisateur sont traitées dans un ordre non spécifié, et la condition peut être évaluée avant que l'autre bean n'existe, créant un doublon ou un bean manquant selon le hasard. La documentation Boot le dit explicitement : ces annotations sont conçues pour les auto-configurations. Entre vos propres beans, utilisez `@Profile`, `@ConditionalOnProperty`, ou simplement une seule définition.",
    keyPoints: ["Évaluée à un instant précis, pas à la fin", "Auto-config = après l'utilisateur, donc fiable", "Entre configs utilisateur : ordre non garanti", "Préférer `@Profile` / `@ConditionalOnProperty`"],
  },
  {
    kind: "match",
    id: "spring-ioc-30",
    difficulty: 1,
    tags: ["starters"],
    prompt: "Associe chaque starter à ce qu'il apporte.",
    pairs: [
      { left: "`spring-boot-starter-web`", right: "Spring MVC, Tomcat embarqué, Jackson" },
      { left: "`spring-boot-starter-data-jpa`", right: "Hibernate, Spring Data JPA, HikariCP" },
      { left: "`spring-boot-starter-validation`", right: "Hibernate Validator (jakarta.validation)" },
      { left: "`spring-boot-starter-test`", right: "JUnit 5, Mockito, AssertJ, MockMvc" },
      { left: "`spring-boot-starter-actuator`", right: "Endpoints health, metrics, info" },
    ],
    explanation:
      "Un starter est un agrégat de dépendances cohérentes, sans code propre. Savoir ce que chacun tire évite deux erreurs classiques : attendre la validation de `starter-web`, et ajouter JUnit à la main alors que `starter-test` l'apporte déjà, avec Mockito et AssertJ.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-ioc",
  title: "IoC, beans, injection, scopes",
  objective:
    "Comprendre ce que fait le conteneur, injecter par constructeur, choisir parmi plusieurs beans, maîtriser scopes et cycle de vie, et savoir ce que l'auto-configuration décide à votre place.",
  prerequisites: ["java-interfaces-classes-abstraites"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
