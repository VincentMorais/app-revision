/**
 * Architecture — Hexagonale : ports, adapters, SOLID (référentiel 4.1, 4.2, 4.3).
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Le domaine au centre
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "archi-hexa-l1",
  title: "Ports & adapters : le domaine ne dépend de rien",
  blocks: [
    {
      kind: "text",
      text: "L'architecture hexagonale (Alistair Cockburn, 2005) répond à un problème précis : une logique métier enchevêtrée avec le framework web, l'ORM et les clients HTTP est **impossible à tester sans tout démarrer** et impossible à faire évoluer sans tout casser. L'idée : mettre le **domaine** au centre, et ne le laisser dépendre de rien.",
    },
    {
      kind: "text",
      text: "Le domaine expose des **ports** : des interfaces Java ordinaires. Le monde extérieur s'y branche par des **adapters** : un contrôleur REST, un repository JPA, un client HTTP. Les dépendances pointent toujours **vers l'intérieur** : l'adapter connaît le port, le domaine ne connaît aucun adapter. Ni Spring, ni JPA, ni HTTP dans les classes du domaine.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le domaine définit le port ; l'infrastructure l'implémente.",
      code: `// domain : aucun import de framework
public record Order(OrderId id, Money total) {
    public Order {
        if (total.isNegative())
            throw new IllegalArgumentException("total < 0");
    }
}

// domain : port sortant, une interface ordinaire
public interface OrderRepository {
    Optional<Order> findById(OrderId id);
    void save(Order order);
}

// infrastructure : l'adapter dépend du domaine,
// jamais l'inverse
@Repository
public class JpaOrderRepository implements OrderRepository {
    private final SpringDataOrderRepository jpa;
    private final OrderMapper mapper;
    // ...
}`,
    },
    {
      kind: "text",
      text: "C'est l'**inversion de dépendance** : le domaine possède l'interface `OrderRepository`, l'infrastructure fournit `JpaOrderRepository`. Remplacer JPA par un fichier ou une API distante ne touche pas une ligne du domaine, et un test du domaine se contente d'une implémentation en mémoire.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Test",
      text: "Un test du domaine ne démarre ni Spring ni base : `new PlaceOrderService(new InMemoryOrderRepository())`. S'il faut `@SpringBootTest` pour tester une règle métier, le domaine dépend de quelque chose qu'il ne devrait pas.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-hexa-01",
    difficulty: 1,
    tags: ["hexagonal", "ports-adapters"],
    prompt: "Quel problème l'architecture hexagonale résout-elle en premier lieu ?",
    choices: [
      "Une logique métier mêlée au framework, à l'ORM et au transport, donc intestable sans tout démarrer et impossible à faire évoluer isolément.",
      "La lenteur des requêtes SQL générées par l'ORM.",
      "Le nombre trop élevé de classes dans un projet Spring.",
      "L'absence de documentation des API REST.",
    ],
    answer: 0,
    explanation:
      "Cockburn part d'un constat : quand la règle métier vit dans un contrôleur ou une entité JPA, on ne peut ni la tester sans base ni changer d'infrastructure. Isoler le domaine derrière des ports rend l'infrastructure remplaçable et le métier testable en unitaire pur. Le nombre de classes, lui, augmente plutôt.",
  },
  {
    kind: "spot",
    id: "archi-hexa-02",
    difficulty: 2,
    tags: ["hexagonal", "domaine", "inversion-de-dependance"],
    prompt: "Cette classe est dans le package `domain`. Trouve la ligne qui viole la règle.",
    code: {
      language: "java",
      code: `package com.shop.domain;

import java.util.List;
import jakarta.persistence.Entity;

@Entity
public class Order {
    private List<OrderLine> lines;
    public Money total() { /* ... */ }
}`,
    },
    faultyLine: 4,
    reasons: [
      "Le domaine importe JPA : il dépend de l'infrastructure de persistance. L'entité JPA doit être une classe séparée dans `infrastructure`, avec un mapper.",
      "`java.util.List` n'est pas autorisé dans le domaine, il faut un tableau.",
      "Le package doit s'appeler `model`, pas `domain`.",
      "Une classe de domaine doit être un `record`, pas une classe.",
    ],
    reasonAnswer: 0,
    explanation:
      "La règle est binaire : aucun import de framework dans `domain`. `@Entity` lie la classe à Hibernate (constructeur vide, setters, proxys, cycle de vie). Le JDK (`java.util`) est évidemment permis. Le domaine peut être un `record` ou une classe, l'important est ce dont il dépend, pas sa forme.",
  },
  {
    kind: "recall",
    id: "archi-hexa-03",
    difficulty: 2,
    tags: ["hexagonal", "ports-adapters", "inversion-de-dependance"],
    prompt: "Explique ce qu'est un port, ce qu'est un adapter, et dans quel sens vont les dépendances.",
    explanation:
      "Un **port** est une interface définie par le domaine (ou la couche application) : ce dont le cœur a besoin (port sortant : `OrderRepository`, `PaymentGateway`) ou ce qu'il offre (port entrant : `PlaceOrder`). Un **adapter** est une implémentation concrète branchée sur un port : `JpaOrderRepository`, `StripePaymentGateway`, `OrderController`. Les dépendances vont **de l'extérieur vers l'intérieur** : l'adapter importe le port, le domaine n'importe aucun adapter. C'est l'inversion de dépendance : le domaine dicte le contrat, l'infrastructure s'y plie. On peut remplacer un adapter (JPA → fichier, Stripe → mock) sans toucher au domaine.",
    keyPoints: ["Port = interface du cœur", "Adapter = implémentation branchée", "Dépendances vers l'intérieur", "Domaine sans import de framework"],
  },
  {
    kind: "match",
    id: "archi-hexa-04",
    difficulty: 1,
    tags: ["hexagonal", "domaine"],
    prompt: "Associe chaque classe à sa couche.",
    pairs: [
      { left: "`Order` avec ses invariants", right: "Domaine" },
      { left: "`OrderRepository` (interface)", right: "Domaine, port sortant" },
      { left: "`PlaceOrderService`", right: "Application, use case" },
      { left: "`JpaOrderRepository`", right: "Infrastructure, adapter secondaire" },
      { left: "`OrderController`", right: "Infrastructure, adapter primaire" },
    ],
    explanation:
      "L'interface du repository est dans le domaine, son implémentation JPA dans l'infrastructure : c'est le point que les débutants inversent. Le use case orchestre sans règle métier. Contrôleur et repository JPA sont tous deux des adapters, l'un qui pilote le cœur, l'autre piloté par lui.",
  },
  {
    kind: "mcq",
    id: "archi-hexa-05",
    difficulty: 2,
    tags: ["inversion-de-dependance", "ports-adapters"],
    prompt: "Qui définit l'interface `OrderRepository`, et pourquoi ?",
    choices: [
      "Le domaine : il exprime son besoin, et l'infrastructure s'y conforme. Ainsi le domaine ne dépend d'aucune technologie.",
      "L'infrastructure : c'est elle qui sait ce que JPA peut offrir.",
      "Spring Data, via `JpaRepository`, qu'il suffit d'étendre dans le domaine.",
      "Le contrôleur, puisque c'est lui qui déclenche les lectures.",
    ],
    answer: 0,
    explanation:
      "Si l'infrastructure définissait l'interface, le domaine dépendrait d'elle, et changer de technologie changerait le contrat vu par le métier. Étendre `JpaRepository` dans le domaine importe Spring Data dans le cœur. Le domaine écrit le port dans son vocabulaire (`findById(OrderId)`), l'adapter traduit vers JPA.",
  },
  {
    kind: "output",
    id: "archi-hexa-06",
    difficulty: 2,
    tags: ["hexagonal", "archunit", "domaine"],
    prompt: "Que se passe-t-il quand ce test s'exécute, sachant que `com.shop.domain.Order` importe `com.shop.infrastructure.OrderEntity` ?",
    code: {
      language: "java",
      code: `@Test
void domainDependsOnNothing() {
    JavaClasses classes =
        new ClassFileImporter().importPackages("com.shop");
    noClasses().that().resideInAPackage("..domain..")
        .should().dependOnClassesThat()
        .resideInAnyPackage("..infrastructure..",
                            "org.springframework..",
                            "jakarta.persistence..")
        .check(classes);
}`,
    },
    choices: [
      "Le test échoue : ArchUnit liste la dépendance `Order → OrderEntity` comme violation de la règle.",
      "Le test passe : ArchUnit ne vérifie que les annotations, pas les imports.",
      "Erreur de compilation : `noClasses()` n'accepte pas `resideInAnyPackage`.",
      "Le test passe car `Order` et `OrderEntity` sont dans le même module Maven.",
    ],
    answer: 0,
    explanation:
      "ArchUnit analyse le bytecode : tout import, champ, paramètre ou appel vers `..infrastructure..` depuis `..domain..` est une violation. C'est le moyen de rendre la règle « le domaine ne dépend de rien » exécutable en CI plutôt que de compter sur la relecture. Le découpage en modules Maven est l'autre option, plus stricte : la dépendance ne compile même pas.",
  },
  {
    kind: "fill",
    id: "archi-hexa-07",
    difficulty: 2,
    tags: ["ports-adapters", "inversion-de-dependance"],
    prompt: "Complète : le port est dans le domaine, l'adapter dans l'infrastructure.",
    code: {
      language: "java",
      code: `package com.shop.{{1}};

public {{2}} PaymentGateway {
    PaymentResult charge(Money amount);
}

package com.shop.{{3}};

@Component
public class StripeGateway {{4}} PaymentGateway {
    @Override
    public PaymentResult charge(Money amount) { /* ... */ }
}`,
    },
    blanks: ["domain", "interface", "infrastructure", "implements"],
    distractors: ["application", "class", "extends", "abstract", "controller"],
    explanation:
      "Le port sortant `PaymentGateway` est une **interface** du **domaine**, exprimée avec les types du domaine (`Money`). L'adapter `StripeGateway` vit dans l'**infrastructure** et **implémente** ce port ; il peut porter `@Component` puisque l'infrastructure a le droit de dépendre de Spring. `application` héberge les use cases, pas les ports sortants techniques.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Ports entrants, ports sortants, couche application
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "archi-hexa-l2",
  title: "Entrant ou sortant, primaire ou secondaire",
  blocks: [
    {
      kind: "text",
      text: "Un **port entrant** est un cas d'usage que le cœur offre : `PlaceOrder`, `CancelOrder`. Il est appelé par un **adapter primaire** (celui qui pilote l'application) : contrôleur REST, commande CLI, listener Kafka, tâche planifiée. Un **port sortant** est un besoin du cœur vers l'extérieur : `OrderRepository`, `PaymentGateway`, `Clock`. Il est implémenté par un **adapter secondaire** (piloté par l'application) : JPA, client HTTP, système de fichiers.",
    },
    {
      kind: "text",
      text: "Entre les deux, la **couche application** implémente les ports entrants sous forme de **use cases**. Un use case orchestre : il charge via un port sortant, appelle le domaine, sauvegarde, publie un événement. Il porte la **transaction**. Il ne contient **aucune règle métier** : si un `if` exprime une décision du métier, il appartient au domaine.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le use case orchestre, le domaine décide.",
      code: `// application : port entrant
public interface PlaceOrder {
    OrderId handle(PlaceOrderCommand cmd);
}

// application : use case, sans règle métier
public class PlaceOrderService implements PlaceOrder {
    private final OrderRepository orders;   // port sortant
    private final PaymentGateway payments;  // port sortant

    public PlaceOrderService(OrderRepository orders,
                             PaymentGateway payments) {
        this.orders = orders;
        this.payments = payments;
    }

    @Override
    public OrderId handle(PlaceOrderCommand cmd) {
        Order order = Order.create(cmd.lines()); // règles ici
        payments.charge(order.total());
        orders.save(order);
        return order.id();
    }
}`,
    },
    {
      kind: "text",
      text: "Le câblage se fait à l'extérieur, dans une classe `@Configuration` de l'infrastructure : `new PlaceOrderService(jpaRepo, stripeGateway)`. La couche application reste ainsi sans annotation Spring et testable avec des doublures en mémoire. Beaucoup d'équipes acceptent un `@Service` sur le use case par pragmatisme ; l'essentiel est que le **domaine** reste pur.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "Repère",
      text: "Adapter primaire : « j'appelle l'application ». Adapter secondaire : « l'application m'appelle ». Un même adapter ne fait jamais les deux.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-hexa-08",
    difficulty: 1,
    tags: ["ports-adapters", "use-cases"],
    prompt: "Quelle est la différence entre un port entrant et un port sortant ?",
    choices: [
      "Entrant : un cas d'usage offert par le cœur, appelé de l'extérieur. Sortant : un besoin du cœur vers l'extérieur, implémenté par l'infrastructure.",
      "Entrant : lecture de données. Sortant : écriture de données.",
      "Entrant : interface REST. Sortant : interface JPA.",
      "Entrant : synchrone. Sortant : asynchrone.",
    ],
    answer: 0,
    explanation:
      "La distinction porte sur la direction de l'appel, pas sur lecture/écriture ni sur la technologie. `PlaceOrder` (entrant) est appelé par un contrôleur ou un listener ; `OrderRepository` (sortant) est appelé par le use case et implémenté par JPA, un fichier ou une doublure en mémoire.",
  },
  {
    kind: "match",
    id: "archi-hexa-09",
    difficulty: 2,
    tags: ["ports-adapters"],
    prompt: "Associe chaque adapter au port sur lequel il se branche.",
    pairs: [
      { left: "`OrderController` (REST)", right: "Port entrant `PlaceOrder`" },
      { left: "`OrderCancelledListener` (Kafka)", right: "Port entrant `CancelOrder`" },
      { left: "`JpaOrderRepository`", right: "Port sortant `OrderRepository`" },
      { left: "`StripeGateway` (client HTTP)", right: "Port sortant `PaymentGateway`" },
    ],
    explanation:
      "Contrôleur et listener sont des adapters primaires : ils reçoivent un stimulus externe et appellent un use case. Repository JPA et client Stripe sont des adapters secondaires : le use case les appelle à travers un port sortant. Un listener Kafka est bien primaire, même s'il « écoute » : c'est lui qui déclenche le cœur.",
  },
  {
    kind: "spot",
    id: "archi-hexa-10",
    difficulty: 2,
    tags: ["use-cases", "hexagonal"],
    prompt: "Ce use case viole une règle de la couche application. Trouve la ligne.",
    code: {
      language: "java",
      code: `public class CancelOrderService implements CancelOrder {
    private final OrderRepository orders;

    public ResponseEntity<Void> handle(OrderId id) {
        Order order = orders.findById(id).orElseThrow();
        order.cancel();
        orders.save(order);
        return ResponseEntity.noContent().build();
    }
}`,
    },
    faultyLine: 4,
    reasons: [
      "Le use case retourne un `ResponseEntity` : il dépend de Spring Web et du transport HTTP. C'est à l'adapter REST de traduire le résultat en réponse.",
      "`handle` doit être `static` pour être un use case.",
      "`orElseThrow()` est interdit hors du domaine.",
      "Un use case ne doit jamais appeler `save`, c'est le rôle du contrôleur.",
    ],
    reasonAnswer: 0,
    explanation:
      "La couche application ne connaît ni HTTP, ni JSON, ni codes de statut. Elle retourne un résultat métier (`void`, un `OrderId`, un `Result`) que le contrôleur convertit en `204` ou `404`. Sinon, le même use case ne peut pas être réutilisé par un listener Kafka ou un batch. Charger, appeler le domaine, sauvegarder : c'est exactement le rôle du use case.",
  },
  {
    kind: "output",
    id: "archi-hexa-11",
    difficulty: 2,
    tags: ["ports-adapters", "injection"],
    prompt: "Le port `OrderRepository` a deux implémentations, toutes deux annotées `@Component`. `PlaceOrderService` est un `@Service` qui reçoit `OrderRepository` par constructeur. Que se passe-t-il au démarrage ?",
    code: {
      language: "java",
      code: `@Component
class JpaOrderRepository implements OrderRepository { }

@Component
class InMemoryOrderRepository implements OrderRepository { }

@Service
class PlaceOrderService {
    PlaceOrderService(OrderRepository orders) { /* ... */ }
}`,
    },
    choices: [
      "Échec du démarrage : `NoUniqueBeanDefinitionException`, deux beans candidats pour `OrderRepository`.",
      "Spring choisit `JpaOrderRepository` car c'est la première par ordre alphabétique.",
      "Spring injecte les deux dans une `List<OrderRepository>` automatiquement.",
      "Démarrage normal : l'adapter en mémoire n'est chargé que dans les tests.",
    ],
    answer: 0,
    explanation:
      "Un point d'injection pour une interface avec plusieurs beans est ambigu. Les solutions hexagonales propres : ne pas annoter l'adapter en mémoire (il n'est instancié qu'en test, à la main), ou le placer sous `@Profile(\"test\")`. `@Primary`/`@Qualifier` marchent aussi mais couplent le use case à un choix d'infrastructure. La `List<T>` n'est injectée que si le paramètre est déclaré ainsi.",
  },
  {
    kind: "recall",
    id: "archi-hexa-12",
    difficulty: 2,
    tags: ["ports-adapters", "use-cases"],
    prompt: "Adapter primaire, adapter secondaire : définition, exemples, et comment les distinguer à coup sûr.",
    explanation:
      "Un **adapter primaire** (ou driving) pilote l'application : il reçoit un stimulus externe et appelle un **port entrant**. Exemples : contrôleur REST, commande CLI, listener Kafka ou RabbitMQ, tâche `@Scheduled`, test d'acceptation. Un **adapter secondaire** (ou driven) est piloté par l'application : le use case l'appelle à travers un **port sortant**. Exemples : repository JPA, client HTTP vers Stripe, envoi d'e-mail, horloge, système de fichiers. Le critère infaillible : **qui appelle qui**. Si l'adapter appelle le cœur, il est primaire ; si le cœur appelle l'adapter, il est secondaire. La technologie ne compte pas : un client Kafka peut être primaire (consommer) ou secondaire (publier).",
    keyPoints: ["Primaire = appelle le cœur (REST, CLI, listener)", "Secondaire = appelé par le cœur (JPA, HTTP client)", "Critère : sens de l'appel", "La techno ne décide pas"],
  },
  {
    kind: "fill",
    id: "archi-hexa-13",
    difficulty: 2,
    tags: ["ports-adapters", "injection"],
    prompt: "Complète le câblage : le use case reste sans annotation Spring, l'infrastructure l'instancie.",
    code: {
      language: "java",
      code: `package com.shop.infrastructure.config;

@{{1}}
public class UseCaseConfig {

    @{{2}}
    PlaceOrder placeOrder(OrderRepository orders,
                          PaymentGateway payments) {
        return {{3}} PlaceOrderService(orders, payments);
    }
}`,
    },
    blanks: ["Configuration", "Bean", "new"],
    distractors: ["Component", "Service", "Autowired", "this", "super"],
    explanation:
      "Une classe `@Configuration` déclare des méthodes `@Bean` : Spring appelle la méthode, injecte ses paramètres (les adapters, eux, sont des beans) et enregistre le retour. Le use case est construit par un `new` ordinaire : il ne porte aucune annotation et peut être instancié pareil dans un test. `@Service` sur le use case marcherait, mais ferait dépendre la couche application de Spring.",
  },
  {
    kind: "order",
    id: "archi-hexa-14",
    difficulty: 2,
    tags: ["hexagonal", "ports-adapters"],
    prompt: "Remets dans l'ordre le trajet d'une requête `POST /orders` à travers l'hexagone.",
    items: [
      "Le contrôleur REST (adapter primaire) reçoit le JSON et le valide",
      "Il construit une commande et appelle le port entrant `PlaceOrder`",
      "Le use case appelle le domaine, qui applique les règles métier",
      "Le use case appelle le port sortant `OrderRepository.save`",
      "L'adapter JPA traduit l'objet du domaine en entité et l'écrit en base",
      "Le contrôleur convertit le résultat du use case en réponse `201`",
    ],
    explanation:
      "Extérieur → cœur → extérieur → cœur → extérieur. Le domaine est traversé au milieu sans savoir d'où vient l'appel ni où vont les données. Chaque frontière est une interface : le contrôleur ne connaît que `PlaceOrder`, le use case ne connaît que `OrderRepository`.",
  },
  {
    kind: "mcq",
    id: "archi-hexa-15",
    difficulty: 2,
    tags: ["use-cases", "transactions"],
    prompt: "Où placer `@Transactional` dans une architecture hexagonale ?",
    choices: [
      "Sur le use case (couche application) : c'est lui qui délimite l'unité de travail, du chargement à la sauvegarde.",
      "Sur les méthodes du domaine, au plus près des règles métier.",
      "Sur le contrôleur REST, pour couvrir toute la requête.",
      "Sur chaque méthode de l'adapter JPA, une transaction par accès.",
    ],
    answer: 0,
    explanation:
      "La transaction englobe l'orchestration : lire, décider, écrire, publier. Le domaine ne connaît pas la notion de transaction (et ne doit pas importer Spring). Le contrôleur mêlerait transport et persistance. Une transaction par méthode de repository ne garantit pas la cohérence entre deux `save`. Si l'on refuse Spring dans la couche application, on encapsule le use case dans un décorateur transactionnel côté infrastructure.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Mise en œuvre
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "archi-hexa-l3",
  title: "Mise en œuvre : packages, mapper, validation",
  blocks: [
    {
      kind: "text",
      text: "Trois packages (ou trois modules Maven, plus stricts) : `domain` (entités, value objects, ports), `application` (use cases) et `infrastructure` (adapters, configuration Spring). Le domaine n'importe rien des deux autres ; l'application n'importe que le domaine ; l'infrastructure importe tout. Un test **ArchUnit** vérifie ces règles en CI.",
    },
    {
      kind: "text",
      text: "Le point qui coûte le plus : **deux classes** pour une même notion. `Order` dans le domaine (invariants, comportements, immuabilité possible) et `OrderEntity` dans l'infrastructure (`@Entity`, constructeur vide, setters, identifiant technique). Un **mapper** convertit dans les deux sens. Une seule classe ferait dépendre le domaine de JPA et importerait ses contraintes (proxys, lazy loading, mutabilité).",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'adapter JPA traduit ; le domaine ignore JPA.",
      code: `// infrastructure
@Entity @Table(name = "orders")
class OrderEntity {
    @Id UUID id;
    BigDecimal total;
    protected OrderEntity() {}       // exigé par JPA
}

class OrderMapper {
    Order toDomain(OrderEntity e) {
        return new Order(new OrderId(e.id),
                         Money.of(e.total));
    }
    OrderEntity toEntity(Order o) {
        var e = new OrderEntity();
        e.id = o.id().value();
        e.total = o.total().amount();
        return e;
    }
}

@Repository
class JpaOrderRepository implements OrderRepository {
    public void save(Order o) {
        jpa.save(mapper.toEntity(o));
    }
}`,
    },
    {
      kind: "text",
      text: "La **validation** se répartit. Le **format** (champ requis, e-mail bien formé, taille) est vérifié à l'entrée par l'adapter REST avec `jakarta.validation` sur le DTO. Les **invariants métier** (un montant ne peut pas être négatif, une commande vide n'existe pas) vivent dans le domaine, dans les constructeurs et les value objects, et lèvent une exception : un objet du domaine ne peut pas exister dans un état invalide.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le coût",
      text: "Deux classes par notion, un mapper, des interfaces pour chaque port : sur un CRUD sans règle métier, c'est disproportionné. L'hexagonal paie quand le domaine a de vraies décisions à protéger et à tester.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-hexa-16",
    difficulty: 2,
    tags: ["mapper", "domaine", "jpa"],
    prompt: "Pourquoi séparer `Order` (domaine) et `OrderEntity` (JPA) plutôt qu'annoter directement la classe du domaine ?",
    choices: [
      "JPA impose ses contraintes (constructeur vide, mutabilité, proxys, lazy loading) et ferait dépendre le domaine de la persistance ; deux classes gardent le domaine pur.",
      "Hibernate ne sait pas persister une classe qui contient des méthodes métier.",
      "Les `record` ne peuvent pas être annotés `@Entity`, il faut donc une classe à part.",
      "Pour que la table SQL et la classe Java aient des noms différents.",
    ],
    answer: 0,
    explanation:
      "Une entité JPA doit être mutable, avoir un constructeur sans argument, accepter des proxys et charger paresseusement : autant de compromis incompatibles avec un domaine expressif et immuable. Hibernate persiste très bien une classe avec des méthodes ; la séparation est un choix de dépendances, pas une limite technique. Le nom de table se règle avec `@Table`.",
  },
  {
    kind: "spot",
    id: "archi-hexa-17",
    difficulty: 2,
    tags: ["domaine", "use-cases", "validation"],
    prompt: "Une règle métier est au mauvais endroit. Trouve la ligne.",
    code: {
      language: "java",
      code: `public class PlaceOrderService implements PlaceOrder {
    public OrderId handle(PlaceOrderCommand cmd) {
        if (cmd.lines().isEmpty())
            throw new EmptyOrderException();
        Order order = Order.create(cmd.lines());
        orders.save(order);
        return order.id();
    }
}`,
    },
    faultyLine: 3,
    reasons: [
      "« Une commande ne peut pas être vide » est un invariant du domaine : il doit vivre dans `Order.create`, pas dans le use case, sinon tout autre chemin (batch, import) peut créer une commande vide.",
      "Un use case ne doit jamais lever d'exception.",
      "`isEmpty()` doit être remplacé par `size() == 0`.",
      "La vérification doit être faite dans le contrôleur avec `@NotEmpty`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le use case orchestre ; le domaine décide. Si l'invariant est dans `Order`, il est impossible de construire une commande vide, d'où qu'on vienne. `@NotEmpty` sur le DTO est un contrôle de format bienvenu en plus, mais ne protège pas le domaine des autres adapters. Un use case peut tout à fait propager une exception métier.",
  },
  {
    kind: "fill",
    id: "archi-hexa-18",
    difficulty: 2,
    tags: ["mapper", "jpa"],
    prompt: "Complète l'adapter JPA : il traduit dans les deux sens et ne laisse jamais sortir une entité.",
    code: {
      language: "java",
      code: `@Repository
class JpaOrderRepository implements OrderRepository {
    private final SpringDataOrderRepository jpa;
    private final OrderMapper mapper;

    @Override
    public Optional<Order> findById(OrderId id) {
        return jpa.findById(id.value())
                  .map(mapper::{{1}});
    }

    @Override
    public void save(Order order) {
        jpa.save(mapper.{{2}}(order));
    }
}`,
    },
    blanks: ["toDomain", "toEntity"],
    distractors: ["toDto", "fromDomain", "map", "save"],
    explanation:
      "En lecture, l'entité JPA est convertie en objet du domaine avant de franchir le port : le use case ne voit jamais `OrderEntity`. En écriture, l'objet du domaine est converti en entité pour Spring Data. `toDto` est le vocabulaire de l'adapter REST, pas de la persistance.",
  },
  {
    kind: "output",
    id: "archi-hexa-19",
    difficulty: 2,
    tags: ["domaine", "validation"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "java",
      code: `public record Money(BigDecimal amount) {
    public Money {
        if (amount.signum() < 0)
            throw new IllegalArgumentException("negative");
    }
}

// dans un test, sans Spring ni base
Money m = new Money(new BigDecimal("-5"));
orders.save(new Order(id, m));`,
    },
    choices: [
      "`IllegalArgumentException` dès la ligne `new Money(...)` : l'invariant est vérifié dans le constructeur compact, avant tout accès à la base.",
      "`Money` est créé, puis `save` échoue avec une `DataIntegrityViolationException`.",
      "Aucune erreur : un `record` ne peut pas contenir de logique de validation.",
      "Erreur de compilation : un constructeur compact ne peut pas lever d'exception.",
    ],
    answer: 0,
    explanation:
      "Le constructeur compact d'un `record` s'exécute avant l'affectation des composants : un `Money` négatif n'existe jamais. C'est la validation **métier**, dans le domaine, indépendante de toute contrainte SQL. Une contrainte `CHECK` en base reste utile en défense en profondeur, mais elle ne serait atteinte qu'après.",
  },
  {
    kind: "mcq",
    id: "archi-hexa-20",
    difficulty: 2,
    tags: ["validation", "domaine", "rest"],
    prompt: "Où placer `@NotBlank @Email String email` et où placer « un client ne peut pas commander plus de 10 000 € sans validation manuelle » ?",
    choices: [
      "Le format sur le DTO du contrôleur (`jakarta.validation`) ; la règle de montant dans le domaine, comme invariant ou méthode métier.",
      "Les deux sur le DTO : toute validation se fait à l'entrée.",
      "Les deux dans le domaine : le contrôleur ne doit rien vérifier.",
      "Le format dans le domaine, la règle de montant dans le contrôleur.",
    ],
    answer: 0,
    explanation:
      "La validation de **format** protège l'adapter contre des entrées malformées et produit des erreurs `400` claires. La règle de **montant** est une décision métier qui doit s'appliquer quel que soit l'adapter (REST, batch, import) : sa place est dans le domaine. Tout mettre sur le DTO laisse le domaine sans défense ; tout mettre dans le domaine l'encombre de détails de transport.",
  },
  {
    kind: "recall",
    id: "archi-hexa-21",
    difficulty: 2,
    tags: ["transactions", "use-cases"],
    prompt: "Où va `@Transactional` dans un projet hexagonal, et pourquoi pas dans le domaine ni dans le contrôleur ?",
    explanation:
      "Sur le **use case**, dans la couche application : c'est lui qui délimite l'unité de travail (charger, appliquer le domaine, sauvegarder, publier), donc la frontière naturelle de l'atomicité. Pas dans le **domaine** : il ne doit importer ni Spring ni la notion de transaction, et une règle métier n'a pas à savoir si elle s'exécute dans une transaction. Pas dans le **contrôleur** : il mélangerait transport HTTP et persistance, et un listener Kafka réutilisant le use case n'en bénéficierait pas. Si l'équipe refuse toute annotation Spring dans `application`, l'infrastructure fournit un décorateur (`TransactionalPlaceOrder`) ou un `TransactionTemplate` autour du use case.",
    keyPoints: ["Sur le use case", "Domaine : pas de Spring, pas de transaction", "Contrôleur : transport ≠ persistance", "Alternative : décorateur côté infra"],
  },
  {
    kind: "match",
    id: "archi-hexa-22",
    difficulty: 1,
    tags: ["hexagonal", "domaine"],
    prompt: "Associe chaque package à ce qu'il contient.",
    pairs: [
      { left: "`domain`", right: "`Order`, `Money`, `OrderRepository` (interface), exceptions métier" },
      { left: "`application`", right: "`PlaceOrder` (port entrant), `PlaceOrderService` (use case)" },
      { left: "`infrastructure.persistence`", right: "`OrderEntity`, `OrderMapper`, `JpaOrderRepository`" },
      { left: "`infrastructure.web`", right: "`OrderController`, DTO, `@RestControllerAdvice`" },
      { left: "`infrastructure.config`", right: "`@Configuration` qui instancie les use cases" },
    ],
    explanation:
      "Le domaine contient les concepts et les ports sortants ; l'application, les ports entrants et leur implémentation ; l'infrastructure, tout ce qui touche à une technologie, découpé par adapter. La configuration Spring est de l'infrastructure : c'est elle qui assemble.",
  },
  {
    kind: "recall",
    id: "archi-hexa-23",
    difficulty: 3,
    tags: ["hexagonal", "conception"],
    prompt: "Quel est le coût de l'architecture hexagonale, et dans quels cas est-elle disproportionnée ?",
    explanation:
      "Le coût : **deux classes par notion** (domaine et entité JPA) avec un mapper à maintenir, une **interface par port** même quand il n'y aura jamais qu'une implémentation, des DTO à l'entrée, une configuration manuelle des use cases, et une courbe d'apprentissage pour l'équipe. Elle est disproportionnée pour un **CRUD sans règle métier** (un référentiel, un back-office de saisie), un prototype à durée de vie courte, ou une application dont la valeur est dans l'intégration et non dans la logique. Elle paie quand le domaine porte de **vraies décisions** à tester sans base, quand l'infrastructure est amenée à changer, ou quand plusieurs adapters primaires (REST, batch, messages) doivent exécuter les mêmes cas d'usage. En entretien, savoir dire « pas ici » est aussi valorisé que savoir l'appliquer.",
    keyPoints: ["Deux classes + mapper, interfaces partout", "CRUD simple : non", "Vraies règles, infra changeante, plusieurs adapters : oui", "Savoir dire non"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — SOLID et anti-patterns
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "archi-hexa-l4",
  title: "SOLID : cinq principes, un exemple chacun",
  blocks: [
    {
      kind: "text",
      text: "**S**ingle responsibility : une classe a une seule raison de changer. Un `OrderService` qui calcule les taxes, envoie l'e-mail et génère le PDF change pour trois raisons. **O**pen/closed : ouvert à l'extension, fermé à la modification. Ajouter un mode de livraison ne doit pas modifier un `switch` existant, mais ajouter une implémentation d'interface (pattern Strategy).",
    },
    {
      kind: "text",
      text: "**L**iskov : une sous-classe doit pouvoir remplacer sa classe mère sans surprendre l'appelant. **I**nterface segregation : plusieurs petites interfaces plutôt qu'une grosse que personne n'implémente en entier. **D**ependency inversion : dépendre d'abstractions, pas d'implémentations. C'est exactement le principe des ports : le use case dépend d'`OrderRepository`, pas de `JpaOrderRepository`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "LSP violé : Square hérite de Rectangle et casse le contrat.",
      code: `class Rectangle {
    protected int w, h;
    void setWidth(int w)  { this.w = w; }
    void setHeight(int h) { this.h = h; }
    int area() { return w * h; }
}

class Square extends Rectangle {
    // un carré doit garder w == h
    @Override void setWidth(int w)  { this.w = w; this.h = w; }
    @Override void setHeight(int h) { this.w = h; this.h = h; }
}

Rectangle r = new Square();
r.setWidth(5);
r.setHeight(4);
r.area();   // 16, l'appelant attendait 20`,
    },
    {
      kind: "text",
      text: "Trois anti-patterns à reconnaître. L'**anemic domain model** : des entités réduites à des getters/setters, toute la logique dans des services ; le domaine ne protège rien. La **god class** : un service de 3 000 lignes qui sait tout. Le **service qui appelle un service qui appelle un service** : une chaîne où personne ne sait plus où est la transaction ni la règle.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Entretien",
      text: "Pour chaque lettre, un exemple concret en une phrase. Le plus attendu : DIP illustré par l'injection d'une interface dans un constructeur.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "archi-hexa-24",
    difficulty: 1,
    tags: ["solid", "srp"],
    prompt: "`InvoiceService` calcule le montant, génère le PDF et l'envoie par e-mail. Quel principe est violé, et comment le repérer ?",
    choices: [
      "Single responsibility : la classe a trois raisons de changer (règles de calcul, mise en page, transport). La séparer en trois collaborateurs.",
      "Open/closed : on ne peut pas ajouter de format sans modifier la classe.",
      "Liskov : `InvoiceService` ne peut pas être remplacé par une sous-classe.",
      "Interface segregation : la classe expose trop de méthodes publiques.",
    ],
    answer: 0,
    explanation:
      "Le test SRP : « pour quelles raisons cette classe changera-t-elle ? » Ici trois, indépendantes : le fisc, le design, le fournisseur d'e-mail. Chaque raison mérite sa classe, injectée dans le service qui orchestre. OCP et ISP peuvent aussi être touchés, mais la cause première est la responsabilité multiple.",
  },
  {
    kind: "spot",
    id: "archi-hexa-25",
    difficulty: 2,
    tags: ["solid", "lsp"],
    prompt: "Ce code viole un principe SOLID. Trouve la ligne qui déclare le problème.",
    code: {
      language: "java",
      code: `class Rectangle {
    protected int w, h;
    void setWidth(int w)  { this.w = w; }
    void setHeight(int h) { this.h = h; }
    int area() { return w * h; }
}

class Square extends Rectangle {
    @Override void setWidth(int w)  { this.w = w; this.h = w; }
    @Override void setHeight(int h) { this.w = h; this.h = h; }
}`,
    },
    faultyLine: 8,
    reasons: [
      "`Square extends Rectangle` viole Liskov : un carré ne peut pas honorer le contrat de `setWidth`/`setHeight` indépendants. Un code écrit pour `Rectangle` casse avec un `Square`.",
      "Les champs `protected` doivent être `private` avec des getters.",
      "`@Override` est interdit sur une méthode qui modifie deux champs.",
      "`area()` doit être redéfinie dans `Square` pour retourner `w * w`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Mathématiquement un carré est un rectangle ; en programmation orientée objet mutable, non : le contrat de `Rectangle` promet que changer la largeur ne touche pas la hauteur. Le principe de Liskov dit qu'une sous-classe ne doit pas renforcer les préconditions ni affaiblir les postconditions. Solution : pas d'héritage, deux classes séparées, ou des formes immuables.",
  },
  {
    kind: "output",
    id: "archi-hexa-26",
    difficulty: 2,
    tags: ["solid", "lsp"],
    prompt: "Avec les classes `Rectangle` et `Square` de la leçon, que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Test
void areaIsWidthTimesHeight() {
    Rectangle r = new Square();
    r.setWidth(5);
    r.setHeight(4);
    assertEquals(20, r.area());
}`,
    },
    choices: [
      "Le test échoue : `area()` renvoie 16, car `setHeight(4)` a aussi mis la largeur à 4.",
      "Le test passe : `r` est déclaré `Rectangle`, ses méthodes s'appliquent.",
      "Erreur de compilation : on ne peut pas affecter un `Square` à un `Rectangle`.",
      "`ClassCastException` à l'exécution.",
    ],
    answer: 0,
    explanation:
      "Le type déclaré ne change rien : les méthodes redéfinies de `Square` sont appelées (polymorphisme). `setWidth(5)` donne 5×5, `setHeight(4)` donne 4×4, aire 16. Un test écrit contre le contrat de `Rectangle` échoue avec une sous-classe : c'est la définition même d'une violation de Liskov.",
  },
  {
    kind: "match",
    id: "archi-hexa-27",
    difficulty: 2,
    tags: ["solid"],
    prompt: "Associe chaque principe à l'exemple qui l'illustre.",
    pairs: [
      { left: "Single responsibility", right: "Séparer calcul, rendu PDF et envoi d'e-mail en trois classes" },
      { left: "Open/closed", right: "Ajouter un mode de livraison en implémentant `ShippingStrategy`, sans toucher au code existant" },
      { left: "Liskov", right: "`Square extends Rectangle` casse les appelants de `Rectangle`" },
      { left: "Interface segregation", right: "`Printer` et `Scanner` plutôt qu'un `MultiFunctionDevice` que l'imprimante simple implémente à moitié" },
      { left: "Dependency inversion", right: "Le use case reçoit `OrderRepository` (interface), jamais `JpaOrderRepository`" },
    ],
    explanation:
      "SRP parle de raisons de changer, OCP d'ajout sans modification, LSP de substituabilité, ISP d'interfaces à la taille du client, DIP du sens des dépendances. Les cinq se retrouvent dans l'hexagonal : DIP pour les ports, ISP pour des ports fins, SRP pour les use cases.",
  },
  {
    kind: "fill",
    id: "archi-hexa-28",
    difficulty: 1,
    tags: ["solid", "dip", "injection"],
    prompt: "Complète pour respecter l'inversion de dépendance.",
    code: {
      language: "java",
      code: `public class PlaceOrderService {
    private final {{1}} orders;

    public PlaceOrderService({{2}} orders) {
        this.orders = orders;
    }
}

// dans un test unitaire, sans Spring
var service = new PlaceOrderService(
    new {{3}}());`,
    },
    blanks: ["OrderRepository", "OrderRepository", "InMemoryOrderRepository"],
    distractors: ["JpaOrderRepository", "SpringDataOrderRepository", "OrderEntity", "Object"],
    explanation:
      "Le use case dépend de l'**abstraction** `OrderRepository`. Grâce à cela, le test lui donne une implémentation en mémoire et le runtime une implémentation JPA, sans que le use case change. Déclarer le champ en `JpaOrderRepository` compilerait mais lierait le métier à la persistance et rendrait le test dépendant d'une base.",
  },
  {
    kind: "mcq",
    id: "archi-hexa-29",
    difficulty: 2,
    tags: ["anti-patterns", "domaine"],
    prompt: "Des entités avec uniquement des getters/setters, et toute la logique dans des `@Service` : comment s'appelle ce schéma, et quel est le problème ?",
    choices: [
      "Anemic domain model : le domaine ne protège aucun invariant, n'importe quel service peut mettre un objet dans un état incohérent.",
      "Clean architecture : la logique est bien séparée des données.",
      "Repository pattern : les entités ne servent qu'au stockage.",
      "Template method : les services fournissent le squelette, les entités les données.",
    ],
    answer: 0,
    explanation:
      "Nommé par Martin Fowler, l'anemic domain model transforme les objets en sacs de données. Les règles, dispersées dans les services, se dupliquent et se contredisent ; rien n'empêche `order.setTotal(-5)`. Le remède : mettre le comportement avec les données (`order.addLine(...)`, `order.cancel()`) et rendre les setters inutiles.",
  },
  {
    kind: "recall",
    id: "archi-hexa-30",
    difficulty: 2,
    tags: ["solid"],
    prompt: "Énonce les cinq principes SOLID, chacun avec un exemple Java en une phrase.",
    explanation:
      "**S**ingle responsibility : une classe, une raison de changer. `InvoiceCalculator`, `InvoicePdfRenderer`, `InvoiceMailer` plutôt qu'un `InvoiceService` qui fait tout. **O**pen/closed : étendre sans modifier. Une interface `ShippingStrategy` avec une implémentation par transporteur, au lieu d'un `switch` qu'on rouvre à chaque ajout. **L**iskov : substituabilité. `Square extends Rectangle` viole le contrat de `setWidth` ; deux classes distinctes ou des objets immuables. **I**nterface segregation : des interfaces à la taille du client. `Printer` et `Scanner` séparés, pas un `MultiFunctionDevice` avec des méthodes vides. **D**ependency inversion : dépendre d'abstractions. `PlaceOrderService(OrderRepository)` et non `PlaceOrderService(JpaOrderRepository)`. C'est le principe qui fonde les ports de l'architecture hexagonale.",
    keyPoints: ["S : une raison de changer", "O : Strategy plutôt que switch", "L : Square/Rectangle", "I : interfaces fines", "D : injecter l'interface"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "archi-hexagonale",
  title: "Architecture hexagonale : ports, adapters, SOLID",
  objective:
    "Placer chaque classe dans la bonne couche, faire dépendre l'infrastructure du domaine et non l'inverse, et illustrer chaque principe SOLID par un exemple.",
  prerequisites: ["spring-ioc"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
