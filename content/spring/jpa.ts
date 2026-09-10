/**
 * Spring — JPA : entités, relations, LAZY/EAGER, N+1 (référentiel 3.5 + 2.4).
 * 4 leçons, 30 exercices. Cible : Spring Boot 3.x, Hibernate 6, Jakarta Persistence.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — L'entité : @Entity, @Id, génération de l'identifiant
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-jpa-l1",
  title: "L'entité JPA et la génération de l'identifiant",
  blocks: [
    {
      kind: "text",
      text: "Une entité est une classe Java que Hibernate sait lire et écrire dans une table. `@Entity` la déclare, `@Id` désigne la clé primaire, `@Table` et `@Column` ajustent les noms et contraintes quand la convention ne suffit pas.",
    },
    {
      kind: "text",
      text: "Hibernate impose des contraintes de classe : un constructeur sans argument (au moins `protected`), une classe non `final`, des champs non `final`. Il en a besoin pour instancier l'entité par réflexion et pour générer des **proxies**, des sous-classes créées à la volée qui portent le chargement paresseux.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une entité complète, avec séquence Postgres.",
      code: `@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
                    generator = "orders_seq")
    @SequenceGenerator(name = "orders_seq",
                       sequenceName = "orders_seq",
                       allocationSize = 50)
    private Long id;

    @Column(nullable = false, length = 20)
    private String reference;

    // sans STRING, la position de l'enum est stockée
    @Enumerated(EnumType.STRING)
    private Status status;

    // requis par Hibernate, jamais appelé par ton code
    protected Order() {}

    public Order(String reference) {
        this.reference = reference;
        this.status = Status.NEW;
    }
    // getters...
}`,
    },
    {
      kind: "text",
      text: "La génération de l'identifiant se règle avec `@GeneratedValue`. `IDENTITY` s'appuie sur une colonne auto-incrémentée : l'id n'est connu qu'**après** l'INSERT, ce qui force Hibernate à insérer immédiatement et interdit le regroupement des insertions (batch). `SEQUENCE` demande des valeurs à une séquence Postgres, par blocs grâce à `allocationSize`, **avant** l'INSERT : c'est la stratégie recommandée. `AUTO` laisse Hibernate choisir, ce qui donne `SEQUENCE` sur Postgres.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`@Enumerated` sans argument stocke `ORDINAL`, la position de la constante. Insérer une valeur au milieu de l'enum décale silencieusement toutes les lignes existantes. Toujours `EnumType.STRING`.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-jpa-01",
    difficulty: 1,
    tags: ["jpa", "entites"],
    prompt: "Pourquoi une entité JPA doit-elle avoir un constructeur sans argument ?",
    choices: [
      "Hibernate instancie l'entité par réflexion à la lecture et génère des proxies (sous-classes) pour le chargement paresseux.",
      "Spring exige un constructeur vide pour tout bean, et une entité est un bean.",
      "JPA interdit les constructeurs avec paramètres sur une classe annotée `@Entity`.",
      "Pour que Lombok puisse générer les getters et setters.",
    ],
    answer: 0,
    explanation:
      "Quand Hibernate reconstruit une entité à partir d'une ligne, il l'instancie sans connaître tes constructeurs métier, puis remplit les champs. Les proxies de lazy loading sont des sous-classes générées, qui appellent aussi ce constructeur. Un constructeur métier avec paramètres reste bienvenu ; le constructeur vide peut être `protected` pour ne pas polluer l'API. Une entité n'est pas un bean Spring.",
  },
  {
    kind: "output",
    id: "spring-jpa-02",
    difficulty: 2,
    tags: ["jpa", "generation-id", "batch"],
    prompt: "`hibernate.jdbc.batch_size` vaut 50. Que se passe-t-il à l'exécution ?",
    code: {
      language: "java",
      code: `@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}

// dans une méthode @Transactional
List<Event> events = ...;   // 100 événements
eventRepository.saveAll(events);`,
    },
    choices: [
      "100 INSERT envoyés un par un : avec `IDENTITY`, Hibernate doit insérer immédiatement pour connaître l'id, le batch est désactivé.",
      "Un seul INSERT multi-lignes de 100 valeurs.",
      "Deux INSERT groupés de 50 lignes chacun.",
      "Erreur au démarrage : `IDENTITY` et `batch_size` sont incompatibles.",
    ],
    answer: 0,
    explanation:
      "Avec `IDENTITY`, la base attribue l'id pendant l'INSERT. Hibernate a besoin de l'id pour placer l'entité dans le persistence context, donc il exécute chaque INSERT tout de suite et ne peut pas les différer pour les regrouper. Hibernate désactive silencieusement le batch pour ces entités. Avec `SEQUENCE`, les ids sont obtenus avant, et les 100 INSERT partent en deux lots de 50.",
  },
  {
    kind: "fill",
    id: "spring-jpa-03",
    difficulty: 1,
    tags: ["jpa", "entites", "generation-id"],
    prompt: "Complète pour une entité conforme à la spécification JPA, avec la stratégie de génération recommandée sur Postgres (compatible batch).",
    code: {
      language: "java",
      code: `@{{1}}
public class Customer {

    @{{2}}
    @GeneratedValue(strategy = GenerationType.{{3}})
    private Long id;

    private String email;

    {{4}} Customer() {}

    public Customer(String email) { this.email = email; }
}`,
    },
    blanks: ["Entity", "Id", "SEQUENCE", "protected"],
    distractors: ["Table", "Column", "IDENTITY", "private", "final"],
    explanation:
      "`@Entity` déclare la classe, `@Id` la clé. `SEQUENCE` obtient les ids avant l'INSERT et autorise le batch, contrairement à `IDENTITY`. La spécification JPA exige un constructeur sans argument `public` ou `protected` : `private` compile mais empêche Hibernate de créer des proxies, donc casse le lazy loading.",
  },
  {
    kind: "spot",
    id: "spring-jpa-04",
    difficulty: 2,
    tags: ["jpa", "enum", "entites"],
    prompt: "Après l'ajout de `PENDING` entre `NEW` et `PAID` dans l'enum, toutes les commandes déjà payées apparaissent `PENDING`. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `@Entity
public class Order {
    @Id @GeneratedValue private Long id;

    private Status status;

    @Column(nullable = false)
    private String reference;
}`,
    },
    faultyLine: 5,
    reasons: [
      "Sans `@Enumerated(EnumType.STRING)`, JPA stocke la position de la constante (`ORDINAL`) : insérer une valeur décale toutes les lignes existantes.",
      "Un enum doit implémenter `Serializable` pour être persisté.",
      "Il manque `@Column(nullable = false)` sur `status`.",
      "Un enum ne peut pas être un champ d'entité : il faut stocker un `String`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`PAID` était en position 1 ; après insertion de `PENDING` en position 1, la valeur 1 stockée en base est relue comme `PENDING`. Avec `EnumType.STRING`, la base contient `PAID` et rien ne bouge. Le coût en stockage est négligeable face à ce risque. Un enum se persiste très bien, et `Serializable` n'a rien à voir.",
  },
  {
    kind: "mcq",
    id: "spring-jpa-05",
    difficulty: 2,
    tags: ["jpa", "generation-id"],
    prompt: "Pourquoi préférer `SEQUENCE` à `IDENTITY` sur Postgres ?",
    choices: [
      "L'id est obtenu avant l'INSERT, par blocs (`allocationSize`) : Hibernate peut différer et regrouper les insertions.",
      "`IDENTITY` n'est pas supporté par Postgres, qui n'a pas de colonnes auto-incrémentées.",
      "`SEQUENCE` garantit des ids sans trou, contrairement à `IDENTITY`.",
      "`IDENTITY` oblige à déclarer l'id en `Integer` plutôt qu'en `Long`.",
    ],
    answer: 0,
    explanation:
      "Postgres supporte `IDENTITY` (colonnes `GENERATED AS IDENTITY`), mais l'id n'est connu qu'après l'INSERT, ce qui empêche le batch. Avec `SEQUENCE`, Hibernate réserve un bloc d'ids en une requête et insère plus tard, groupé. Aucune des deux stratégies ne garantit l'absence de trous : un rollback consomme des valeurs dans les deux cas.",
  },
  {
    kind: "match",
    id: "spring-jpa-06",
    difficulty: 1,
    tags: ["jpa", "entites"],
    prompt: "Associe chaque annotation à son rôle.",
    pairs: [
      { left: "`@Entity`", right: "Déclare la classe comme persistante" },
      { left: "`@Id`", right: "Désigne la clé primaire" },
      { left: "`@Table`", right: "Nomme la table quand la convention ne convient pas" },
      { left: "`@Column`", right: "Nom, longueur, nullabilité d'une colonne" },
      { left: "`@Transient`", right: "Champ ignoré par la persistance" },
      { left: "`@GeneratedValue`", right: "Stratégie de génération de l'id" },
    ],
    explanation:
      "`@Entity` et `@Id` sont obligatoires ; le reste raffine la convention. `@Transient` (Jakarta) exclut un champ calculé ou technique du mapping, à ne pas confondre avec le mot-clé Java `transient` qui concerne la sérialisation. Les contraintes de `@Column` servent au DDL généré et à la validation Hibernate, pas à la validation métier.",
  },
  {
    kind: "recall",
    id: "spring-jpa-07",
    difficulty: 2,
    tags: ["jpa", "entites"],
    prompt: "Quelles contraintes une classe doit-elle respecter pour être une entité Hibernate, et pourquoi chacune ?",
    explanation:
      "**`@Entity` et `@Id`** : sans identifiant, Hibernate ne peut pas suivre l'objet dans le persistence context. **Constructeur sans argument** `public` ou `protected` : instanciation par réflexion et création des proxies. **Classe non `final`** et méthodes non `final` : le proxy de lazy loading est une sous-classe qui redéfinit les accesseurs. **Champs non `final`** : Hibernate les remplit après construction. Bonnes pratiques associées : `@Enumerated(EnumType.STRING)`, un constructeur métier avec paramètres, et `equals`/`hashCode` réfléchis (leçon suivante).",
    keyPoints: ["`@Entity` + `@Id`", "Constructeur vide public/protected (réflexion, proxies)", "Ni classe ni champs `final`", "`EnumType.STRING`"],
  },
  {
    kind: "output",
    id: "spring-jpa-08",
    difficulty: 2,
    tags: ["jpa", "flush", "spring-data"],
    prompt: "L'entité `Order` utilise `GenerationType.SEQUENCE`. Quand l'INSERT part-il ?",
    code: {
      language: "java",
      code: `@Transactional
public Long create(String ref) {
    Order order = new Order(ref);
    orderRepository.save(order);      // (1)
    log.info("saved");                 // (2)
    return order.getId();              // (3)
}`,
    },
    choices: [
      "Au flush, au plus tard au commit de la transaction, après (3) : `save` fait un `persist`, et l'id est déjà connu grâce à la séquence.",
      "Immédiatement à (1), pour obtenir l'id.",
      "Jamais, tant qu'on n'appelle pas `flush()` explicitement.",
      "À (3) : lire `getId()` déclenche l'INSERT.",
    ],
    answer: 0,
    explanation:
      "`save` sur une entité nouvelle appelle `persist` : l'entité devient managed, Hibernate obtient un id auprès de la séquence (une requête `nextval`, ou aucune si un bloc est déjà réservé), mais l'INSERT est différé jusqu'au flush. `getId()` renvoie donc une valeur avant tout INSERT. Avec `IDENTITY`, l'INSERT partirait dès (1) pour connaître l'id.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Relations : côté propriétaire, mappedBy, equals/hashCode
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-jpa-l2",
  title: "Relations : qui porte la clé étrangère",
  blocks: [
    {
      kind: "text",
      text: "Une relation se déclare d'un côté ou des deux. Le côté **propriétaire** (owning side) est celui qui porte la clé étrangère en base : pour un `@ManyToOne`, c'est toujours l'entité « many », avec `@JoinColumn`. Le côté inverse déclare `mappedBy = \"champ\"` et se contente de lire la relation.",
    },
    {
      kind: "text",
      text: "Hibernate n'écrit que ce que le côté propriétaire dit. Ajouter un item dans `order.getItems()` sans faire `item.setOrder(order)` n'écrit **aucune** clé étrangère. D'où les **helpers de synchronisation** : une méthode `addItem` qui fait les deux affectations.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Bidirectionnel synchronisé, avec un equals sûr.",
      code: `@Entity
public class Order {
    @Id @GeneratedValue private Long id;

    // côté inverse : lit la FK portée par OrderItem
    @OneToMany(mappedBy = "order",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        items.add(item);          // côté Java
        item.setOrder(this);      // côté base (la FK)
    }
}

@Entity
public class OrderItem {
    @Id @GeneratedValue private Long id;

    // côté propriétaire : porte order_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        return o instanceof OrderItem other
            && id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() { return getClass().hashCode(); }
}`,
    },
    {
      kind: "text",
      text: "`@ManyToMany` passe par une table de jointure, nommée par `@JoinTable` ; dès qu'un attribut doit y être ajouté (une quantité, une date), il faut en faire une entité à part avec deux `@ManyToOne`. `@OneToOne` porte la clé du côté qui déclare `@JoinColumn`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège : equals/hashCode",
      text: "Avant `persist`, l'id vaut `null`. Un `hashCode` basé sur l'id change quand l'id est attribué : un élément ajouté à un `HashSet` avant `persist` devient introuvable après. Solutions : une clé métier stable (référence, email), ou `equals` sur l'id avec un `hashCode` **constant**, comme ci-dessus.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "spring-jpa-09",
    difficulty: 2,
    tags: ["jpa", "relations", "mapped-by"],
    prompt: "`Order.items` est `@OneToMany(mappedBy = \"order\", cascade = ALL)`, `OrderItem.order` est `@ManyToOne @JoinColumn(name = \"order_id\")`. Que se passe-t-il à l'exécution ?",
    code: {
      language: "java",
      code: `@Transactional
public void addItem(Long orderId, String sku) {
    Order order = orders.findById(orderId).orElseThrow();
    OrderItem item = new OrderItem(sku);
    order.getItems().add(item);
    // pas de item.setOrder(order)
}`,
    },
    choices: [
      "L'item est inséré avec `order_id = NULL` : le côté `mappedBy` n'écrit pas la clé étrangère, seul `OrderItem.order` compte.",
      "L'item est inséré et rattaché à la commande grâce au `cascade`.",
      "Rien n'est inséré : une entité ajoutée côté inverse est ignorée.",
      "`TransientObjectException` au commit.",
    ],
    answer: 0,
    explanation:
      "Le `cascade = ALL` propage bien le `persist` : l'item est inséré. Mais la valeur de `order_id` vient exclusivement du champ `OrderItem.order`, côté propriétaire, qui est `null`. Résultat : une ligne orpheline en base, invisible depuis la commande au prochain chargement. Le helper `addItem` qui positionne les deux côtés évite ce bug silencieux.",
  },
  {
    kind: "spot",
    id: "spring-jpa-10",
    difficulty: 2,
    tags: ["jpa", "relations", "mapped-by"],
    prompt: "L'application refuse de démarrer : « mappedBy reference an unknown target entity property ». Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@Entity
public class Order {
    @Id @GeneratedValue private Long id;

    @OneToMany(mappedBy = "orders")
    private List<OrderItem> items = new ArrayList<>();
}

@Entity
public class OrderItem {
    @Id @GeneratedValue private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}`,
    },
    faultyLine: 5,
    reasons: [
      "`mappedBy` doit nommer le **champ** du côté propriétaire, `order`, pas un pluriel ni un nom de table.",
      "`mappedBy` doit valoir le nom de la colonne, `order_id`.",
      "Il manque `@JoinColumn` sur le `@OneToMany`.",
      "Une `List` doit être initialisée dans le constructeur, pas à la déclaration.",
    ],
    reasonAnswer: 0,
    explanation:
      "`mappedBy` pointe vers l'attribut Java de l'entité cible qui possède la relation : ici `OrderItem.order`. Hibernate vérifie ce nom au démarrage et échoue s'il n'existe pas. Le nom de colonne se met dans `@JoinColumn`, côté propriétaire uniquement ; en ajouter un côté inverse créerait une seconde relation.",
  },
  {
    kind: "fill",
    id: "spring-jpa-11",
    difficulty: 2,
    tags: ["jpa", "relations", "mapped-by"],
    prompt: "Complète la relation bidirectionnelle et son helper de synchronisation.",
    code: {
      language: "java",
      code: `@Entity
public class Order {
    @OneToMany({{1}} = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        items.add(item);
        item.{{2}}(this);
    }
}

@Entity
public class OrderItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @{{3}}(name = "order_id")
    private Order order;

    public void setOrder(Order order) { this.order = order; }
}`,
    },
    blanks: ["mappedBy", "setOrder", "JoinColumn"],
    distractors: ["joinColumn", "JoinTable", "Column", "setItems", "addOrder"],
    explanation:
      "`mappedBy` désigne le champ propriétaire. Le helper affecte les deux côtés : la liste (Java) et `setOrder` (la clé étrangère). `@JoinColumn` nomme la colonne côté propriétaire ; `@JoinTable` servirait à un `@ManyToMany`, et `@Column` n'est pas une annotation de relation.",
  },
  {
    kind: "mcq",
    id: "spring-jpa-12",
    difficulty: 2,
    tags: ["jpa", "equals-hashcode", "entites"],
    prompt: "Une entité définit `equals` sur l'id et `hashCode()` comme `Objects.hash(id)`. Pourquoi un `HashSet<OrderItem>` perd-il des éléments ?",
    choices: [
      "Ajouté avant `persist`, l'item a un id `null` ; une fois l'id attribué, son `hashCode` change et il se retrouve dans le mauvais bucket : `contains` renvoie `false`.",
      "`Objects.hash` ne fonctionne pas avec les `Long`.",
      "Hibernate remplace les éléments du `Set` par des proxies qui n'ont pas le même `hashCode`.",
      "Un `HashSet` d'entités doit être un `TreeSet` avec `Comparable`.",
    ],
    answer: 0,
    explanation:
      "Le contrat de `HashSet` suppose un `hashCode` stable tant que l'élément est dans l'ensemble. Un id attribué au `persist` viole cette hypothèse. Deux solutions : une clé métier immuable (référence, email) pour `equals`/`hashCode`, ou `equals` sur l'id non `null` avec un `hashCode` constant (`getClass().hashCode()`), moins performant mais correct.",
  },
  {
    kind: "recall",
    id: "spring-jpa-13",
    difficulty: 2,
    tags: ["jpa", "relations", "mapped-by"],
    prompt: "Côté propriétaire et côté inverse d'une relation : lequel Hibernate écrit-il en base, et que se passe-t-il si tu ne renseignes qu'un seul côté ?",
    explanation:
      "Le **côté propriétaire** est celui qui porte la clé étrangère : le `@ManyToOne` avec `@JoinColumn`. C'est lui, et lui seul, que Hibernate lit pour écrire `order_id`. Le **côté inverse**, marqué `mappedBy`, est une vue en lecture. Renseigner seulement la collection du côté inverse insère l'enfant avec une clé étrangère `null` (ou rien si le cascade manque). Renseigner seulement `item.setOrder(order)` écrit correctement en base, mais `order.getItems()` reste incohérent en mémoire jusqu'au prochain chargement. D'où le helper `addItem` qui fait les deux.",
    keyPoints: ["Propriétaire = `@ManyToOne` + `@JoinColumn`", "`mappedBy` = lecture seule", "Un seul côté → FK null ou mémoire incohérente", "Helper de synchronisation"],
  },
  {
    kind: "match",
    id: "spring-jpa-14",
    difficulty: 2,
    tags: ["jpa", "relations"],
    prompt: "Associe chaque déclaration à l'endroit où vit la clé étrangère.",
    pairs: [
      { left: "`@ManyToOne @JoinColumn`", right: "Colonne FK sur cette entité (propriétaire)" },
      { left: "`@OneToMany(mappedBy = …)`", right: "Aucune colonne : lit la FK de l'autre entité" },
      { left: "`@ManyToMany @JoinTable`", right: "Table de jointure séparée" },
      { left: "`@OneToOne @JoinColumn`", right: "FK sur cette entité, souvent avec contrainte unique" },
      { left: "`@OneToMany @JoinColumn` (unidirectionnel)", right: "FK sur l'entité cible, mise à jour par des UPDATE séparés" },
    ],
    explanation:
      "Le `@OneToMany` unidirectionnel avec `@JoinColumn` est le cas surprenant : la clé est sur l'enfant, mais c'est le parent qui la gère, au prix d'un INSERT suivi d'un UPDATE par enfant. Le bidirectionnel avec `mappedBy` évite ce surcoût. `@ManyToMany` n'a pas de propriétaire naturel : celui qui n'a pas `mappedBy` gère la table de jointure.",
  },
  {
    kind: "mcq",
    id: "spring-jpa-15",
    difficulty: 2,
    tags: ["jpa", "cascade", "orphan-removal"],
    prompt: "Quelle différence entre `cascade = CascadeType.REMOVE` et `orphanRemoval = true` ?",
    choices: [
      "`REMOVE` supprime les enfants quand le parent est supprimé ; `orphanRemoval` supprime en plus un enfant retiré de la collection.",
      "Ce sont deux syntaxes équivalentes, `orphanRemoval` étant la forme JPA 2.",
      "`orphanRemoval` supprime le parent quand sa collection devient vide.",
      "`REMOVE` agit à la suppression, `orphanRemoval` seulement au `merge`.",
    ],
    answer: 0,
    explanation:
      "`orphanRemoval` exprime une composition : un item n'existe pas sans sa commande, donc le retirer de `order.getItems()` le supprime en base au flush. `CascadeType.REMOVE` ne réagit qu'à `remove(order)`. Les deux se combinent sur un `@OneToMany` de composition, jamais sur un `@ManyToOne` ni un `@ManyToMany`, sous peine de supprimer des entités partagées.",
  },
  {
    kind: "output",
    id: "spring-jpa-16",
    difficulty: 3,
    tags: ["jpa", "cascade", "orphan-removal"],
    prompt: "`Order.items` est `@OneToMany(mappedBy = \"order\", cascade = CascadeType.ALL)`, sans `orphanRemoval`. Que se passe-t-il au commit ?",
    code: {
      language: "java",
      code: `@Transactional
public void removeItem(Long orderId, Long itemId) {
    Order order = orders.findById(orderId).orElseThrow();
    order.getItems()
         .removeIf(i -> i.getId().equals(itemId));
}`,
    },
    choices: [
      "Aucun DELETE : l'item reste en base, toujours rattaché à la commande. Il faudrait `orphanRemoval = true` ou un `remove()` explicite.",
      "DELETE de l'item au commit, grâce au `cascade = ALL`.",
      "UPDATE de l'item avec `order_id = NULL`.",
      "Exception : suppression d'un enfant en cascade interdite depuis le côté inverse.",
    ],
    answer: 0,
    explanation:
      "Retirer un élément d'une collection côté inverse ne dit rien à Hibernate sur la clé étrangère, qui appartient à l'item. Sans `orphanRemoval`, la collection en mémoire diverge simplement de la base. `cascade = ALL` inclut `REMOVE`, mais ce cascade ne se déclenche que si la commande elle-même est supprimée. Avec `orphanRemoval = true`, l'item retiré serait supprimé au flush.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — LAZY, EAGER et le problème N+1
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-jpa-l3",
  title: "LAZY, EAGER et le problème N+1",
  blocks: [
    {
      kind: "text",
      text: "Chaque association a un mode de chargement. Par défaut, `@ManyToOne` et `@OneToOne` sont **EAGER** : l'entité liée est chargée avec le parent, qu'on en ait besoin ou non. `@OneToMany` et `@ManyToMany` sont **LAZY** : la collection est un proxy, rempli au premier accès, dans la même transaction.",
    },
    {
      kind: "text",
      text: "EAGER est un piège : il charge un graphe entier à chaque lecture, et une requête JPQL ne joint pas les associations EAGER, Hibernate les charge **après**, une par une. Règle : tout en `LAZY`, et on décide du chargement par cas d'usage.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le N+1 et trois corrections.",
      code: `// N+1 : 1 requête pour les commandes...
List<Order> orders = orderRepo.findAll();
for (Order o : orders) {
    // ...puis 1 requête PAR commande
    o.getCustomer().getName();
}

// Correction 1 : JOIN FETCH, une seule requête
@Query("select o from Order o join fetch o.customer")
List<Order> findAllWithCustomer();

// Correction 2 : EntityGraph sur une méthode dérivée
@EntityGraph(attributePaths = {"customer", "items"})
List<Order> findByStatus(Status status);

// Correction 3 : batch fetching, dans application.yml
// spring.jpa.properties.hibernate
//     .default_batch_fetch_size: 50`,
    },
    {
      kind: "text",
      text: "Le **N+1** : une requête pour N parents, puis une requête par parent pour l'association. Il se détecte avec les logs SQL (`spring.jpa.show-sql`, ou mieux le logger `org.hibernate.SQL`), les statistiques Hibernate, ou un test qui compte les requêtes. Il se corrige par `join fetch` en JPQL, `@EntityGraph` sur une méthode de repository, le batch fetching qui charge les associations manquantes par paquets avec un `IN (...)`, ou une projection DTO quand on ne fait que lire.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Deux `join fetch` sur deux collections `List` dans la même requête lèvent `MultipleBagFetchException`. Utiliser un `Set` pour l'une, ou deux requêtes. Et paginer une requête avec `join fetch` d'une collection fait paginer en mémoire : Hibernate l'annonce par le warning `HHH90003004`.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "spring-jpa-17",
    difficulty: 2,
    tags: ["jpa", "n-plus-1", "lazy-vs-eager"],
    prompt: "`Order.customer` est `@ManyToOne(fetch = LAZY)`. La table contient 10 commandes, passées par 10 clients différents. Combien de requêtes SQL ?",
    code: {
      language: "java",
      code: `@Transactional(readOnly = true)
public List<String> customerNames() {
    return orders.findAll().stream()
        .map(o -> o.getCustomer().getName())
        .toList();
}`,
    },
    choices: [
      "11 : une pour les commandes, puis une par client au premier `getName()`.",
      "1 : Hibernate joint automatiquement le client.",
      "10 : une par commande, le client étant inclus.",
      "2 : Hibernate regroupe les clients dans un `IN (...)`.",
    ],
    answer: 0,
    explanation:
      "C'est le N+1 dans sa forme pure. `findAll` fait un SELECT ; chaque `getCustomer()` renvoie un proxy, et `getName()` déclenche un SELECT par client (sauf si deux commandes partagent un client déjà chargé dans le persistence context). Le regroupement en `IN` n'existe que si le batch fetching est configuré. Correction : `join fetch o.customer` ou `@EntityGraph`.",
  },
  {
    kind: "mcq",
    id: "spring-jpa-18",
    difficulty: 1,
    tags: ["jpa", "lazy-vs-eager"],
    prompt: "Quelles associations sont `EAGER` par défaut en JPA ?",
    choices: [
      "`@ManyToOne` et `@OneToOne`.",
      "`@OneToMany` et `@ManyToMany`.",
      "Toutes : il faut préciser `LAZY` partout.",
      "Aucune : JPA est paresseux par défaut.",
    ],
    answer: 0,
    explanation:
      "Les associations « vers un » sont EAGER par défaut, les collections sont LAZY. Le choix de la spécification est discutable : un `@ManyToOne` EAGER sur `Order.customer` charge un client à chaque lecture de commande, et déclenche un N+1 sur toute requête JPQL. On met `fetch = FetchType.LAZY` explicitement sur chaque `@ManyToOne` et `@OneToOne`.",
  },
  {
    kind: "spot",
    id: "spring-jpa-19",
    difficulty: 2,
    tags: ["jpa", "n-plus-1", "lazy-vs-eager"],
    prompt: "`findByStatus` renvoie 200 commandes et déclenche 201 requêtes SQL. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `@Entity
public class Order {
    @Id @GeneratedValue private Long id;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}

public interface OrderRepository
        extends JpaRepository<Order, Long> {
    @Query("select o from Order o where o.status = :s")
    List<Order> findByStatus(@Param("s") Status s);
}`,
    },
    faultyLine: 4,
    reasons: [
      "`@ManyToOne` est EAGER par défaut : la requête JPQL ne joint pas le client, Hibernate le charge ensuite un par un. Passer en `LAZY` et fetcher explicitement quand c'est utile.",
      "`@JoinColumn` force une requête par ligne.",
      "Il manque `distinct` dans la requête JPQL.",
      "`@Param` déclenche une requête supplémentaire par paramètre.",
    ],
    reasonAnswer: 0,
    explanation:
      "Une requête JPQL exécute exactement ce qu'elle dit : `select o from Order o`. Hibernate doit ensuite honorer le contrat EAGER de `customer` pour chaque commande, d'où 200 SELECT supplémentaires. En `LAZY`, rien n'est chargé tant qu'on ne touche pas au client ; et si on en a besoin, `join fetch o.customer` ou `@EntityGraph` chargent tout en une requête.",
  },
  {
    kind: "fill",
    id: "spring-jpa-20",
    difficulty: 2,
    tags: ["jpa", "n-plus-1", "join-fetch", "entity-graph"],
    prompt: "Complète les deux façons de charger les items avec la commande, en une seule requête.",
    code: {
      language: "java",
      code: `@Query("select o from Order o {{1}} {{2}} o.items where o.id = :id")
Optional<Order> findWithItems(Long id);

@{{3}}(attributePaths = "items")
Optional<Order> findById(Long id);`,
    },
    blanks: ["join", "fetch", "EntityGraph"],
    distractors: ["left", "inner", "load", "Fetch", "NamedQuery"],
    explanation:
      "`join fetch` demande à Hibernate de remplir l'association dans la même requête (un `left join fetch` fonctionnerait aussi et garde les commandes sans item). `@EntityGraph` obtient le même effet sur une méthode dérivée, sans écrire de JPQL. `@Fetch` est une annotation Hibernate de mapping, pas de requête.",
  },
  {
    kind: "output",
    id: "spring-jpa-21",
    difficulty: 3,
    tags: ["jpa", "join-fetch", "multiple-bag-fetch"],
    prompt: "`items` et `payments` sont deux `List` en `@OneToMany`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Query("""
    select o from Order o
    join fetch o.items
    join fetch o.payments
    where o.id = :id
    """)
Optional<Order> findFull(Long id);`,
    },
    choices: [
      "`MultipleBagFetchException` : Hibernate refuse de fetcher deux `List` (bags) dans une même requête. Utiliser un `Set` pour l'une, ou deux requêtes.",
      "Une seule requête avec produit cartésien, dédoublonnée par Hibernate.",
      "N+1 sur `payments` : seule la première collection est fetchée.",
      "Résultats dupliqués sans erreur, à filtrer avec `distinct`.",
    ],
    answer: 0,
    explanation:
      "Un bag est une collection sans ordre ni unicité, ce qu'est une `List` sans `@OrderColumn`. Le produit cartésien de deux bags ne peut pas être reconstitué sans ambiguïté, donc Hibernate lève `MultipleBagFetchException`, au démarrage puisque Spring Data valide les `@Query`. Avec des `Set`, la requête passe (avec produit cartésien) ; la solution propre est souvent deux requêtes successives dans la même transaction, le persistence context recolle les morceaux.",
  },
  {
    kind: "recall",
    id: "spring-jpa-22",
    difficulty: 3,
    tags: ["jpa", "n-plus-1", "join-fetch", "entity-graph"],
    prompt: "Comment détecter un N+1, et quelles sont les corrections possibles avec leurs limites ?",
    explanation:
      "**Détection** : logs SQL (`logging.level.org.hibernate.SQL=DEBUG`), statistiques Hibernate (`generate_statistics`), un test qui compte les requêtes (datasource-proxy, Hypersistence), ou simplement un endpoint qui ralentit avec le volume. **Corrections** : `join fetch` en JPQL, une requête, mais incompatible avec la pagination d'une collection et limité à un seul bag ; `@EntityGraph`, même effet sur une méthode dérivée ; **batch fetching** (`default_batch_fetch_size`), qui transforme N requêtes en N/50 requêtes `IN (...)`, sans changer les requêtes, très efficace pour les collections ; **projection DTO** quand on ne fait que lire, la plus légère. Et en amont : tout en `LAZY`, pour que le chargement soit un choix par cas d'usage.",
    keyPoints: ["Logs SQL, statistiques, test qui compte", "`join fetch` (1 bag, pas de pagination)", "`@EntityGraph`", "Batch fetching en `IN (...)`", "DTO pour la lecture"],
  },
  {
    kind: "order",
    id: "spring-jpa-23",
    difficulty: 2,
    tags: ["jpa", "n-plus-1", "methode"],
    prompt: "Un endpoint devient lent quand les données grossissent. Remets dans l'ordre les étapes du diagnostic d'un N+1.",
    items: [
      "Activer les logs SQL ou les statistiques Hibernate",
      "Reproduire avec un jeu de données de taille réaliste",
      "Compter les requêtes déclenchées par un seul appel",
      "Identifier l'association chargée en boucle",
      "Choisir la correction : `join fetch`, `@EntityGraph`, batch fetching ou DTO",
      "Écrire un test qui compte les requêtes pour empêcher la régression",
    ],
    explanation:
      "Mesurer avant de corriger : un N+1 est invisible sur trois lignes de test. Une fois l'association fautive identifiée, la correction dépend de l'usage : lecture seule vers un DTO, graphe complet vers `join fetch`, collections volumineuses vers le batch fetching. Le test final verrouille le gain, sinon le N+1 revient au premier refactoring.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Spring Data JPA : repositories et requêtes
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-jpa-l4",
  title: "Spring Data JPA : repositories et requêtes",
  blocks: [
    {
      kind: "text",
      text: "Un repository Spring Data est une interface : `JpaRepository<T, ID>` fournit le CRUD, la pagination et le tri sans une ligne d'implémentation. Les **query methods** dérivent la requête du nom : `findByEmail`, `findByStatusAndTotalGreaterThan`, `existsByReference`, `countByStatus`, `findFirstByOrderByCreatedAtDesc`. Le retour peut être `Optional<T>`, `List<T>`, `Page<T>` ou `Stream<T>`.",
    },
    {
      kind: "text",
      text: "Le nom est analysé au **démarrage** : une faute de frappe sur une propriété fait échouer l'application avant toute requête, avec `PropertyReferenceException`. Quand le nom devient illisible, `@Query` prend le relais, en JPQL ou en SQL natif avec `nativeQuery = true`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Dérivée, JPQL, modification, projection.",
      code: `public interface OrderRepository
        extends JpaRepository<Order, Long>,
                JpaSpecificationExecutor<Order> {

    // dérivée : where status = ? and total > ?
    List<Order> findByStatusAndTotalGreaterThan(
            Status status, BigDecimal min);

    Optional<Order> findByReference(String ref);

    // JPQL explicite, avec fetch
    @Query("""
        select o from Order o
        join fetch o.customer
        where o.customer.email = :email
        """)
    List<Order> findByCustomerEmail(String email);

    // écriture : @Modifying obligatoire
    @Modifying
    @Query("update Order o set o.status = :s where o.id = :id")
    int updateStatus(Long id, Status s);

    // projection : select id, reference seulement
    interface Summary {
        Long getId();
        String getReference();
    }
    List<Summary> findSummariesByStatus(Status status);
}`,
    },
    {
      kind: "text",
      text: "Une requête de modification exige `@Modifying`, et une transaction active (celle du service appelant). Les **projections** limitent les colonnes lues : une interface avec des getters, ou une classe DTO avec constructeur. Pour une recherche à critères variables, `JpaSpecificationExecutor` et l'API `Specification` composent des prédicats (`where`, `and`, `or`) sans concaténer de chaînes.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Les paramètres nommés `:email` sans `@Param` fonctionnent parce que Spring Boot compile avec `-parameters`. Avec un autre outillage, ajouter `@Param(\"email\")`.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-jpa-24",
    difficulty: 1,
    tags: ["spring-data", "query-methods"],
    prompt: "Quelle méthode Spring Data renvoie le client actif ayant cet email, s'il existe ?",
    choices: [
      "`Optional<Customer> findByEmailAndActiveTrue(String email);`",
      "`Optional<Customer> findByEmailAndActive(String email);`",
      "`Optional<Customer> findByEmailActiveTrue(String email);`",
      "`Optional<Customer> findEmailAndActiveTrue(String email);`",
    ],
    answer: 0,
    explanation:
      "`And` sépare les critères, `True` est le mot-clé pour un booléen sans paramètre. `findByEmailAndActive` attend deux paramètres (email et active) : un seul, échec au démarrage. `EmailActiveTrue` est lu comme une propriété `emailActiveTrue` inexistante. Sans `By`, Spring Data ne trouve pas de critères et échoue aussi.",
  },
  {
    kind: "output",
    id: "spring-jpa-25",
    difficulty: 2,
    tags: ["spring-data", "query-methods"],
    prompt: "L'entité `Customer` a un champ `email`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `public interface CustomerRepository
        extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmial(String email);
}`,
    },
    choices: [
      "Échec au démarrage de l'application : Spring Data analyse le nom et ne trouve pas la propriété `emial` (`PropertyReferenceException`).",
      "La méthode renvoie toujours `Optional.empty()`.",
      "Erreur à l'exécution, au premier appel de la méthode.",
      "Requête SQL avec une colonne `emial`, donc `SQLException`.",
    ],
    answer: 0,
    explanation:
      "Les query methods sont validées à la création du repository, donc au démarrage du contexte. C'est un avantage : une faute est impossible à livrer. Le message est explicite : « No property 'emial' found for type 'Customer' ». Les `@Query` JPQL sont aussi validées au démarrage ; seules les requêtes natives ne le sont qu'à l'exécution.",
  },
  {
    kind: "spot",
    id: "spring-jpa-26",
    difficulty: 2,
    tags: ["spring-data", "modifying"],
    prompt: "L'appel de `cancel(42L)` lève `InvalidDataAccessApiUsageException` (« Not supported for DML operations »). Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public interface OrderRepository
        extends JpaRepository<Order, Long> {

    @Query("""
        update Order o set o.status = 'CANCELLED'
        where o.id = :id
        """)
    int cancel(Long id);
}`,
    },
    faultyLine: 8,
    reasons: [
      "Une requête de modification exige `@Modifying` : sans elle, Spring Data exécute la requête comme un SELECT et Hibernate refuse.",
      "Le type de retour d'une requête `update` doit être `void`.",
      "Un littéral comme `'CANCELLED'` est interdit en JPQL, il faut un paramètre.",
      "Il manque `nativeQuery = true` pour un `update`.",
    ],
    reasonAnswer: 0,
    explanation:
      "`@Modifying` indique à Spring Data d'appeler `executeUpdate()` plutôt que `getResultList()`. Il faut aussi une transaction active, en général celle du service appelant. Le retour `int` (lignes affectées) est correct. Un littéral d'enum en JPQL fonctionne, et JPQL supporte `update` sans passer en natif. Penser à `clearAutomatically = true` si le persistence context contient des entités concernées.",
  },
  {
    kind: "fill",
    id: "spring-jpa-27",
    difficulty: 2,
    tags: ["spring-data", "query-methods", "modifying"],
    prompt: "Complète : un dépôt avec pagination et tri, une recherche dont le résultat peut être absent, et une requête de suppression.",
    code: {
      language: "java",
      code: `public interface CustomerRepository
        extends {{1}}<Customer, Long> {

    {{2}}<Customer> findByEmail(String email);

    @{{3}}
    @Query("delete from Customer c where c.active = false")
    int purgeInactive();
}`,
    },
    blanks: ["JpaRepository", "Optional", "Modifying"],
    distractors: ["CrudRepository", "List", "Transactional", "Query"],
    explanation:
      "`JpaRepository` ajoute pagination, tri et méthodes JPA (`flush`, `saveAll`) au `CrudRepository`. `Optional<Customer>` exprime l'absence possible ; `List` compilerait mais forcerait l'appelant à tester la taille. `@Modifying` est indispensable pour un `delete` JPQL ; `@Transactional` seule ne changerait pas le mode d'exécution.",
  },
  {
    kind: "match",
    id: "spring-jpa-28",
    difficulty: 1,
    tags: ["spring-data", "query-methods"],
    prompt: "Associe chaque mot-clé de query method à sa traduction SQL.",
    pairs: [
      { left: "`GreaterThan`", right: "`> ?`" },
      { left: "`Containing`", right: "`LIKE '%' || ? || '%'`" },
      { left: "`StartingWith`", right: "`LIKE ? || '%'`" },
      { left: "`In`", right: "`IN (?, ?, …)`" },
      { left: "`IsNull`", right: "`IS NULL`" },
      { left: "`OrderByCreatedAtDesc`", right: "`ORDER BY created_at DESC`" },
    ],
    explanation:
      "Les mots-clés se combinent : `findByNameContainingIgnoreCaseAndCreatedAtAfterOrderByCreatedAtDesc`. Quand le nom dépasse une ligne, c'est le signal de passer à `@Query` ou à une `Specification`. `Containing` est le `LIKE` avec jokers des deux côtés, donc sans index B-tree utilisable.",
  },
  {
    kind: "recall",
    id: "spring-jpa-29",
    difficulty: 2,
    tags: ["spring-data", "projection", "dto"],
    prompt: "Projection (interface ou DTO) plutôt qu'entité complète : quand et pourquoi ?",
    explanation:
      "Une **projection** ne lit que les colonnes demandées et ne crée pas d'entité managed : pas de dirty checking, pas de proxies, pas de risque de `LazyInitializationException`, moins de mémoire et de trafic. À utiliser pour tout ce qui est **lecture seule** : listes, écrans, exports, API de consultation. Une **interface** avec des getters suffit pour des colonnes plates ; une **classe DTO** avec constructeur (ou un `record`) convient aux agrégats et aux `select new`. L'entité complète reste nécessaire quand on **modifie** : le dirty checking a besoin d'un objet managed. Corollaire : ne jamais renvoyer une entité JPA depuis un contrôleur.",
    keyPoints: ["Lecture seule → projection", "Pas de managed, pas de lazy", "Interface pour du plat, DTO/record pour du composé", "Modification → entité"],
  },
  {
    kind: "recall",
    id: "spring-jpa-30",
    difficulty: 2,
    tags: ["spring-data", "persistence-context", "merge"],
    prompt: "Que fait `repository.save(entity)` selon que l'entité est nouvelle ou déjà en base ? Quel piège avec la valeur de retour ?",
    explanation:
      "`SimpleJpaRepository.save` teste `isNew()` : id `null` (ou `@Version` `null`) signifie nouvelle. Si nouvelle, `persist` : l'instance passée devient **managed**, et `save` renvoie cette même instance. Sinon, `merge` : Hibernate charge (ou retrouve) l'entité managed, **copie** l'état de l'objet passé dessus, et renvoie **l'instance managed**. L'argument, lui, reste détaché. Piège : modifier l'argument après `save` en cas de `merge` ne change rien en base ; il faut travailler sur la valeur de retour. Et sur une entité déjà managed, `save` est inutile : le dirty checking suffit.",
    keyPoints: ["`isNew` → `persist`, sinon `merge`", "`merge` renvoie l'instance managed, l'argument reste détaché", "Managed → pas besoin de `save`"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-jpa",
  title: "JPA : entités, relations, LAZY/EAGER, N+1",
  objective:
    "Mapper une entité et ses relations sans surprise, choisir LAZY partout, reconnaître et corriger un N+1, et écrire des repositories Spring Data efficaces.",
  prerequisites: ["spring-ioc", "java-equals-hashcode-comparable"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
