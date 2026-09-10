/**
 * Spring — Transactions et persistence context (référentiel 2.4 + 3.5).
 * 4 leçons, 30 exercices. Cible : Spring Boot 3.x, Hibernate 6.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — @Transactional et le proxy
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-tx-l1",
  title: "@Transactional : un proxy, pas de la magie",
  blocks: [
    {
      kind: "text",
      text: "`@Transactional` ne fait rien par magie : Spring enveloppe le bean dans un **proxy**. Quand un autre bean appelle la méthode, l'appel traverse le proxy, qui ouvre une transaction, délègue à la vraie méthode, puis commit ou rollback. Seuls les appels **venant de l'extérieur** sont interceptés.",
    },
    {
      kind: "text",
      text: "Un appel interne `this.autreMethode()` dans la même classe contourne le proxy : l'annotation sur `autreMethode` est ignorée (self-invocation). Avec les proxies CGLIB par défaut, la méthode ne doit pas être `final` ni `private` : le proxy est une sous-classe qui redéfinit la méthode, et une méthode privée ne se redéfinit pas.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une transaction par cas d'usage, dans le service.",
      code: `@Service
public class OrderService {
    private final OrderRepository orders;
    private final PaymentGateway gateway;

    @Transactional
    public void confirm(Long id) {
        Order order = orders.findById(id).orElseThrow();
        order.confirm();        // dirty checking : UPDATE
        gateway.charge(order);  // RuntimeException ?
                                // → rollback de l'UPDATE
    }

    @Transactional(readOnly = true)
    public OrderView view(Long id) {
        return OrderView.from(
            orders.findById(id).orElseThrow());
    }

    // PIÈGE : appel interne, le proxy est contourné
    public void confirmAll(List<Long> ids) {
        ids.forEach(this::confirm);   // pas de transaction
    }
}`,
    },
    {
      kind: "text",
      text: "Sur la classe, `@Transactional` couvre toutes les méthodes publiques ; sur une méthode, elle l'emporte. `readOnly = true` est une optimisation : Hibernate passe en flush `MANUAL` (pas de dirty checking) et le driver peut déclarer la transaction en lecture. Placement : sur la couche service ou application, jamais sur le contrôleur, et pas sur le repository, où Spring Data en met déjà une.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Sans transaction englobante, chaque appel au repository ouvre et ferme la sienne. L'entité renvoyée est alors **détachée** : la modifier ne produit aucun UPDATE.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "output",
    id: "spring-tx-01",
    difficulty: 3,
    tags: ["transactions", "appel-interne", "proxy"],
    prompt: "`confirm` est annotée `@Transactional`, `confirmAll` ne l'est pas. `confirmAll` est appelée depuis un contrôleur. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Transactional
public void confirm(Long id) {
    Order order = orders.findById(id).orElseThrow();
    order.setStatus(Status.CONFIRMED);
}

public void confirmAll(List<Long> ids) {
    ids.forEach(this::confirm);
}`,
    },
    choices: [
      "Aucun UPDATE : appelée en interne, `confirm` n'est pas transactionnelle ; l'entité renvoyée par `findById` est détachée et la modification est perdue.",
      "Une transaction par commande : chaque UPDATE est commité.",
      "Une seule transaction englobe toutes les commandes.",
      "`IllegalTransactionStateException` : appel transactionnel sans transaction.",
    ],
    answer: 0,
    explanation:
      "`this::confirm` appelle la méthode de l'objet réel, pas du proxy : l'annotation est ignorée. `findById` ouvre sa propre transaction (Spring Data), la ferme, et rend une entité détachée. `setStatus` modifie un objet que plus personne ne suit. Aucune erreur, aucune trace : c'est ce qui rend ce bug redoutable. Correction : annoter `confirmAll`, ou déplacer `confirm` dans un autre bean.",
  },
  {
    kind: "mcq",
    id: "spring-tx-02",
    difficulty: 2,
    tags: ["transactions", "architecture"],
    prompt: "Où placer `@Transactional` ?",
    choices: [
      "Sur les méthodes de la couche service ou application, une par cas d'usage.",
      "Sur le contrôleur REST, pour couvrir toute la requête HTTP.",
      "Sur chaque méthode de repository, au plus près de la base.",
      "Sur l'entité JPA, pour que ses modifications soient toujours persistées.",
    ],
    answer: 0,
    explanation:
      "La transaction délimite une unité de travail métier : c'est le service (ou le use case en hexagonal) qui la connaît. Sur le contrôleur, elle engloberait sérialisation et validation et garderait une connexion trop longtemps. Les repositories Spring Data ont déjà leurs transactions ; en ajouter ne crée pas d'unité de travail cohérente. Une entité n'est pas un bean, l'annotation y est sans effet.",
  },
  {
    kind: "spot",
    id: "spring-tx-03",
    difficulty: 2,
    tags: ["transactions", "proxy"],
    prompt: "Le rollback attendu n'a jamais lieu. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@Service
public class TransferService {

    public void transfer(Long from, Long to, long cents) {
        doTransfer(from, to, cents);
    }

    @Transactional
    private void doTransfer(Long from, Long to, long cents) {
        accounts.debit(from, cents);
        accounts.credit(to, cents);
    }
}`,
    },
    faultyLine: 9,
    reasons: [
      "`@Transactional` sur une méthode `private` est ignorée : le proxy ne peut pas l'intercepter, et de toute façon l'appel est interne.",
      "Il manque `rollbackFor = Exception.class`.",
      "`@Transactional` n'est pas autorisée sur une méthode `void`.",
      "Il faut aussi annoter la classe pour que l'annotation de méthode soit prise en compte.",
    ],
    reasonAnswer: 0,
    explanation:
      "Deux raisons cumulées : une méthode privée n'est pas redéfinissable, donc invisible pour le proxy CGLIB ; et l'appel vient de `transfer`, dans la même classe, donc ne passe pas par le proxy. Correction : mettre `@Transactional` sur `transfer`, la méthode publique appelée de l'extérieur. Le débit reste commité si le crédit échoue : c'est exactement le bug qu'une transaction doit empêcher.",
  },
  {
    kind: "mcq",
    id: "spring-tx-04",
    difficulty: 2,
    tags: ["transactions", "read-only"],
    prompt: "Que fait `@Transactional(readOnly = true)` ?",
    choices: [
      "Une optimisation : Hibernate passe en flush `MANUAL` (pas de dirty checking) et le driver peut déclarer la transaction en lecture seule. Ce n'est pas une règle de sécurité.",
      "Une garantie : toute écriture lève immédiatement une exception Spring.",
      "Elle désactive le persistence context : les entités sont toujours détachées.",
      "Elle supprime la transaction : chaque requête s'exécute en autocommit.",
    ],
    answer: 0,
    explanation:
      "`readOnly` est un indice. Hibernate économise le dirty checking, ce qui compte sur de grosses lectures. Sur Postgres, le driver peut passer la transaction en `READ ONLY` et une écriture serait alors refusée par la base, mais Spring lui-même ne vérifie rien. Les entités restent managed pendant la transaction ; le lazy loading fonctionne.",
  },
  {
    kind: "fill",
    id: "spring-tx-05",
    difficulty: 2,
    tags: ["transactions", "read-only", "rollback"],
    prompt: "Complète : une lecture optimisée, puis une écriture qui doit aussi faire rollback sur une exception checked.",
    code: {
      language: "java",
      code: `@{{1}}(readOnly = {{2}})
public List<OrderView> list() {
    return orders.findAll().stream()
                 .map(OrderView::from).toList();
}

@Transactional(rollbackFor = {{3}}.class)
public void archive(Long id) throws ArchiveException {
    ...
}`,
    },
    blanks: ["Transactional", "true", "Exception"],
    distractors: ["Transaction", "false", "RuntimeException", "Error"],
    explanation:
      "`@Transactional(readOnly = true)` pour une lecture. Pour que `ArchiveException`, checked, déclenche le rollback, `rollbackFor` doit la couvrir : `Exception.class` (ou `ArchiveException.class`). `RuntimeException` et `Error` font déjà rollback par défaut, les indiquer ne change rien.",
  },
  {
    kind: "recall",
    id: "spring-tx-06",
    difficulty: 2,
    tags: ["transactions", "proxy", "appel-interne"],
    prompt: "Explique comment `@Transactional` fonctionne, pourquoi un appel interne n'est pas transactionnel, et comment contourner le problème.",
    explanation:
      "Spring crée un **proxy** (sous-classe CGLIB) du bean et l'injecte à la place. Le proxy intercepte les appels **entrants**, ouvre la transaction via le `PlatformTransactionManager`, appelle la vraie méthode, puis commit ou rollback selon l'exception. Un appel `this.m()` n'atteint jamais le proxy : `m` s'exécute sans transaction, ou dans celle de l'appelant s'il y en a une. Contournements : mettre l'annotation sur la méthode publique d'entrée ; extraire la méthode dans un autre bean ; utiliser un `TransactionTemplate` pour une transaction programmatique ; en dernier recours, s'auto-injecter (`@Lazy` sur soi-même), peu lisible.",
    keyPoints: ["Proxy CGLIB, interception des appels entrants", "`this.m()` contourne le proxy", "Annoter la méthode d'entrée ou extraire un bean", "`TransactionTemplate` en programmatique"],
  },
  {
    kind: "match",
    id: "spring-tx-07",
    difficulty: 1,
    tags: ["transactions", "proxy"],
    prompt: "Associe chaque emplacement de `@Transactional` à son effet.",
    pairs: [
      { left: "Sur la classe", right: "Toutes les méthodes publiques" },
      { left: "Sur une méthode publique", right: "L'emporte sur l'annotation de classe" },
      { left: "Sur une méthode privée", right: "Ignorée : le proxy ne l'intercepte pas" },
      { left: "Sur une interface Spring Data", right: "Déjà présente : lectures `readOnly`, écritures transactionnelles" },
      { left: "Sur un `@RestController`", right: "Fonctionne mais transaction trop large : mauvaise pratique" },
    ],
    explanation:
      "L'annotation se propage de la classe aux méthodes, la méthode affine. Elle n'a d'effet que là où le proxy peut agir : méthodes non privées, appelées de l'extérieur. Spring Data annote `SimpleJpaRepository` ; inutile de le refaire. Sur un contrôleur, la connexion est tenue pendant la sérialisation JSON : ça marche, mais ça ne passe pas à l'échelle.",
  },
  {
    kind: "output",
    id: "spring-tx-08",
    difficulty: 2,
    tags: ["transactions", "rollback"],
    prompt: "`gateway` n'est pas un bean transactionnel et `charge` lève une `RuntimeException`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Transactional
public void process(Long id) {
    Order order = orders.findById(id).orElseThrow();
    order.setStatus(Status.PAID);
    try {
        gateway.charge(order);
    } catch (RuntimeException e) {
        log.warn("payment failed", e);
    }
}`,
    },
    choices: [
      "Commit : l'exception n'a jamais atteint le proxy, le statut `PAID` est écrit en base malgré l'échec du paiement.",
      "Rollback : toute `RuntimeException` levée pendant la transaction annule les modifications.",
      "`UnexpectedRollbackException` au commit.",
      "Le statut est écrit, mais le `catch` n'est pas exécuté car la transaction est déjà terminée.",
    ],
    answer: 0,
    explanation:
      "Le proxy ne décide qu'en voyant une exception **sortir** de la méthode. Ici elle est attrapée dedans : la méthode se termine normalement, commit, et la commande passe `PAID` sans paiement. Bug métier classique. Il faudrait relancer l'exception, ou appeler `TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()`, ou mieux, positionner le statut après le paiement. `UnexpectedRollbackException` n'arrive que si un bean transactionnel **participant** a marqué la transaction rollback-only.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Propagation, isolation, règles de rollback
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-tx-l2",
  title: "Propagation, isolation et règles de rollback",
  blocks: [
    {
      kind: "text",
      text: "La **propagation** dit ce que fait une méthode transactionnelle quand une transaction existe déjà. `REQUIRED` (défaut) la rejoint, ou en crée une s'il n'y en a pas. `REQUIRES_NEW` suspend la transaction courante et en ouvre une **indépendante**, avec sa propre connexion : elle commit même si l'appelante fait rollback. `MANDATORY` exige une transaction existante, `NEVER` l'interdit, `SUPPORTS` s'en accommode, `NESTED` pose un savepoint (JDBC seulement).",
    },
    {
      kind: "text",
      text: "Les **règles de rollback** : par défaut, seule une `RuntimeException` ou une `Error` déclenche le rollback. Une exception **checked** fait **commit**. Pour changer : `rollbackFor = Exception.class`. Et quand un bean participant (`REQUIRED`) lève une `RuntimeException`, il marque la transaction **rollback-only**, même si l'appelant l'attrape : au commit, `UnexpectedRollbackException`.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Audit indépendant, exception checked couverte.",
      code: `@Service
public class CheckoutService {
    @Transactional                  // REQUIRED
    public void checkout(Cart cart) {
        Order order = orders.save(Order.from(cart));
        audit.record("checkout", order.getId());
        stock.reserve(cart);        // peut lever
    }
}

@Service
public class AuditService {
    // transaction indépendante :
    // survit au rollback de checkout()
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, Long id) {
        entries.save(new AuditEntry(action, id));
    }
}

@Service
public class StockService {
    // checked : pas de rollback sans rollbackFor
    @Transactional(rollbackFor = StockException.class)
    public void reserve(Cart cart) throws StockException {
        ...
    }
}`,
    },
    {
      kind: "text",
      text: "L'**isolation** est déléguée à la base : `Isolation.DEFAULT` prend celle de Postgres, `READ COMMITTED`. Postgres ne fait jamais de lecture sale ; `REPEATABLE_READ` fige un instantané pour la transaction, `SERIALIZABLE` détecte les conflits et fait échouer une des transactions. On ne monte le niveau que pour un besoin précis, mesuré.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`REQUIRES_NEW` prend une **seconde connexion** du pool pendant que la première attend. Sous charge, un pool de 10 peut se bloquer sur lui-même. Et la nouvelle transaction ne voit pas les modifications non flushées de l'appelante.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "spring-tx-09",
    difficulty: 2,
    tags: ["transactions", "rollback", "exceptions"],
    prompt: "`StockException` est une exception checked. `reserve` lève cette exception après le `save`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Transactional
public void checkout(Cart cart) throws StockException {
    orders.save(Order.from(cart));
    stock.reserve(cart);    // lève StockException
}`,
    },
    choices: [
      "Commit : la commande est insérée. Une exception checked ne déclenche pas de rollback sans `rollbackFor`.",
      "Rollback : toute exception sortant d'une méthode transactionnelle annule la transaction.",
      "`UnexpectedRollbackException`.",
      "Erreur de compilation : `throws` est interdit sur une méthode `@Transactional`.",
    ],
    answer: 0,
    explanation:
      "Héritage historique d'EJB : une exception checked est considérée comme un résultat métier attendu, pas comme une panne. Spring commit donc. Résultat ici : une commande sans stock réservé. Solution : `@Transactional(rollbackFor = StockException.class)`, ou une exception métier `RuntimeException`, choix le plus courant dans les projets modernes.",
  },
  {
    kind: "output",
    id: "spring-tx-10",
    difficulty: 3,
    tags: ["transactions", "rollback", "propagation"],
    prompt: "`notifier` est un autre bean, `@Transactional` par défaut (`REQUIRED`), et `notify` lève une `RuntimeException`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Transactional
public void place(Cart cart) {
    orders.save(Order.from(cart));
    try {
        notifier.notify(cart.customer());
    } catch (RuntimeException e) {
        log.warn("notification failed", e);
    }
}`,
    },
    choices: [
      "`UnexpectedRollbackException` au commit : `notify` a rejoint la transaction et l'a marquée rollback-only en levant ; l'attraper ne change rien.",
      "Commit : l'exception est attrapée, la commande est enregistrée.",
      "Rollback silencieux : la commande n'est pas enregistrée, sans exception.",
      "Commit de la commande, rollback de la notification seulement.",
    ],
    answer: 0,
    explanation:
      "Le proxy de `notifier` voit sortir une `RuntimeException` : il ne peut pas faire rollback lui-même (la transaction appartient à `place`), alors il la marque rollback-only. `place` continue, croit avoir géré l'erreur, puis son proxy tente le commit et découvre le marqueur : `UnexpectedRollbackException`. Pour isoler la notification : `REQUIRES_NEW` sur `notify`, ou `noRollbackFor`, ou sortir la notification de la transaction.",
  },
  {
    kind: "mcq",
    id: "spring-tx-11",
    difficulty: 2,
    tags: ["transactions", "propagation"],
    prompt: "Une ligne d'audit doit être conservée même si le traitement qui l'entoure fait rollback. Quelle propagation sur la méthode d'audit ?",
    choices: [
      "`REQUIRES_NEW` : transaction indépendante, commitée séparément.",
      "`NESTED` : un savepoint, plus léger.",
      "`MANDATORY` : garantit qu'une transaction existe pour l'audit.",
      "`SUPPORTS` : l'audit s'exécute hors transaction, donc n'est pas annulé.",
    ],
    answer: 0,
    explanation:
      "`NESTED` pose un savepoint dans la **même** transaction : un rollback global emporte le savepoint avec lui. `MANDATORY` rejoint la transaction courante, donc subit son rollback. `SUPPORTS` rejoint aussi la transaction si elle existe. Seul `REQUIRES_NEW` ouvre une transaction séparée, au prix d'une seconde connexion et de l'invisibilité des modifications non flushées de l'appelant.",
  },
  {
    kind: "match",
    id: "spring-tx-12",
    difficulty: 1,
    tags: ["transactions", "propagation"],
    prompt: "Associe chaque propagation à son comportement quand une transaction existe déjà.",
    pairs: [
      { left: "`REQUIRED`", right: "La rejoint (défaut)" },
      { left: "`REQUIRES_NEW`", right: "La suspend et en ouvre une indépendante" },
      { left: "`MANDATORY`", right: "La rejoint ; exception s'il n'y en a pas" },
      { left: "`NEVER`", right: "Exception : une transaction est interdite" },
      { left: "`NESTED`", right: "Savepoint dans la transaction courante" },
      { left: "`NOT_SUPPORTED`", right: "La suspend et s'exécute sans transaction" },
    ],
    explanation:
      "Dans 95 % des cas, `REQUIRED` suffit : un cas d'usage, une transaction, les services appelés la rejoignent. `REQUIRES_NEW` pour ce qui doit survivre (audit, journal), `MANDATORY` pour documenter qu'une méthode ne doit jamais être appelée hors transaction. `NESTED` nécessite un `DataSourceTransactionManager` compatible savepoints et n'est pas supporté avec JPA par défaut.",
  },
  {
    kind: "spot",
    id: "spring-tx-13",
    difficulty: 2,
    tags: ["transactions", "rollback", "exceptions"],
    prompt: "Quand le crédit échoue, le débit reste en base. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@Service
public class TransferService {

    @Transactional
    public void transfer(Long from, Long to, long cents)
            throws InsufficientFundsException {
        accounts.debit(from, cents);
        accounts.credit(to, cents);
    }
}`,
    },
    faultyLine: 4,
    reasons: [
      "`InsufficientFundsException` est checked : sans `rollbackFor`, Spring commit. Ajouter `rollbackFor = InsufficientFundsException.class`, ou en faire une `RuntimeException`.",
      "`throws` est interdit sur une méthode transactionnelle.",
      "Il faut `propagation = REQUIRES_NEW` pour isoler le transfert.",
      "Le crédit doit précéder le débit.",
    ],
    reasonAnswer: 0,
    explanation:
      "La méthode est bien transactionnelle et appelée de l'extérieur : le problème est la règle de rollback par défaut, qui épargne les exceptions checked. Le proxy voit sortir `InsufficientFundsException`, décide commit, et le débit est écrit. `rollbackFor` corrige ; beaucoup d'équipes préfèrent des exceptions métier non checked pour ne plus y penser.",
  },
  {
    kind: "fill",
    id: "spring-tx-14",
    difficulty: 2,
    tags: ["transactions", "propagation", "isolation"],
    prompt: "Complète : la méthode doit être appelée dans une transaction existante, avec le niveau d'isolation minimal qui évite les lectures non répétables.",
    code: {
      language: "java",
      code: `@Transactional(
    propagation = Propagation.{{1}},
    isolation = Isolation.{{2}})
public Report compute(Long accountId) {
    ...
}`,
    },
    blanks: ["MANDATORY", "REPEATABLE_READ"],
    distractors: ["REQUIRED", "NESTED", "READ_COMMITTED", "SERIALIZABLE"],
    explanation:
      "`MANDATORY` lève `IllegalTransactionStateException` si aucune transaction n'est active : c'est la façon de documenter et de vérifier l'exigence. `REQUIRED` en créerait une silencieusement. `READ_COMMITTED` (défaut Postgres) autorise les lectures non répétables ; `REPEATABLE_READ` les élimine avec un instantané ; `SERIALIZABLE` fait plus, mais coûte plus et provoque des échecs de sérialisation à réessayer.",
  },
  {
    kind: "recall",
    id: "spring-tx-15",
    difficulty: 2,
    tags: ["transactions", "rollback", "exceptions"],
    prompt: "Quelles exceptions déclenchent un rollback par défaut, lesquelles non, et comment changer la règle ?",
    explanation:
      "Par défaut, Spring fait **rollback** sur `RuntimeException` (et ses sous-classes) et sur `Error`, et **commit** sur toute exception **checked**. La règle se change avec `rollbackFor` (classes qui déclenchent le rollback, souvent `Exception.class`) et `noRollbackFor` (exceptions à ignorer). Attention aux subtilités : l'exception doit **sortir** de la méthode annotée pour être vue par le proxy ; et si un bean participant lève une `RuntimeException`, la transaction est marquée rollback-only, ce qui donne `UnexpectedRollbackException` au commit même si l'appelant a attrapé l'exception. Pratique courante : des exceptions métier `RuntimeException` pour ne jamais dépendre de `rollbackFor`.",
    keyPoints: ["Rollback : `RuntimeException`, `Error`", "Commit : checked", "`rollbackFor` / `noRollbackFor`", "Rollback-only par un participant"],
  },
  {
    kind: "order",
    id: "spring-tx-16",
    difficulty: 2,
    tags: ["transactions", "proxy", "rollback"],
    prompt: "Une méthode `@Transactional` (REQUIRED, aucune transaction en cours) est appelée depuis un autre bean et lève une `RuntimeException`. Remets les événements dans l'ordre.",
    items: [
      "Le proxy intercepte l'appel entrant",
      "Le `PlatformTransactionManager` ouvre une transaction : connexion prise dans le pool, autocommit désactivé",
      "La méthode réelle s'exécute et modifie des entités managed",
      "La `RuntimeException` remonte jusqu'au proxy",
      "Le proxy demande le rollback : `ROLLBACK` JDBC, sans flush",
      "L'exception est relancée telle quelle à l'appelant",
    ],
    explanation:
      "Le proxy encadre l'exécution comme un `try/catch/finally`. Sur rollback, aucun flush n'a lieu : les modifications des entités managed ne sont jamais envoyées à la base, et le persistence context est fermé. L'exception d'origine est relancée, ce qui permet à un `@RestControllerAdvice` de la traduire en réponse HTTP.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Le persistence context : états, dirty checking, flush
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-tx-l3",
  title: "Le persistence context : états, dirty checking, flush",
  blocks: [
    {
      kind: "text",
      text: "L'`EntityManager` tient un **persistence context**, aussi appelé cache de premier niveau, dont la durée de vie est celle de la transaction dans Spring. Une entité y est dans un état : **transient** (créée avec `new`, inconnue), **managed** (suivie par le contexte), **detached** (le contexte est fermé, plus personne ne la suit), **removed** (suppression planifiée).",
    },
    {
      kind: "text",
      text: "Sur une entité managed, le **dirty checking** fait tout : au flush, Hibernate compare chaque entité à son instantané de chargement et émet les `UPDATE` nécessaires. Pas besoin d'appeler `save()`. Le **flush** a lieu au commit, avant une requête JPQL qui pourrait être affectée (mode `AUTO`), ou sur `flush()` explicite. Deux `findById` dans la même transaction renvoient la **même instance**, sans second SELECT.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Managed, transient, détaché : trois comportements.",
      code: `@Transactional
public void rename(Long id, String name) {
    Customer c = customers.findById(id).orElseThrow();
    c.setName(name);    // managed : suivi
    // pas de save() : dirty checking → UPDATE au flush
}

@Transactional
public Customer register(String email) {
    Customer c = new Customer(email);   // transient
    customers.save(c);                  // persist → managed
    return c;                           // même instance
}

@Transactional
public void update(CustomerDto dto) {
    Customer detached = mapper.toEntity(dto); // id non null
    Customer managed = customers.save(detached); // merge
    detached.setName("x");   // PERDU : pas suivi
    managed.setName("y");    // écrit au commit
}`,
    },
    {
      kind: "text",
      text: "`persist` prend une entité transient et la rend managed. `merge` prend une entité détachée (ou transient), **copie** son état sur une instance managed, et renvoie cette instance ; l'argument reste détaché. `save()` de Spring Data choisit : `persist` si l'entité est nouvelle (id `null`), `merge` sinon.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Hors transaction, chaque appel de repository ouvre et ferme son propre contexte : l'entité renvoyée est immédiatement détachée. C'est la cause de la plupart des « ma modification n'est pas sauvegardée ».",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "spring-tx-17",
    difficulty: 2,
    tags: ["persistence-context", "cache-premier-niveau"],
    prompt: "Combien de SELECT, et qu'affiche la dernière ligne ?",
    code: {
      language: "java",
      code: `@Transactional
public void check(Long id) {
    Customer a = customers.findById(id).orElseThrow();
    Customer b = customers.findById(id).orElseThrow();
    System.out.println(a == b);
}`,
    },
    choices: [
      "1 SELECT, `true` : le second `findById` est servi par le persistence context, même instance.",
      "2 SELECT, `false` : chaque `findById` crée un nouvel objet.",
      "2 SELECT, `true` : Hibernate déduplique après coup.",
      "1 SELECT, `false` : le cache renvoie une copie.",
    ],
    answer: 0,
    explanation:
      "Le persistence context garantit l'**identité** : une ligne = une instance pendant la transaction. `findById` passe par `EntityManager.find`, qui consulte d'abord le contexte. Hors transaction, ce seraient deux contextes différents, donc 2 SELECT et deux objets distincts (`false`).",
  },
  {
    kind: "output",
    id: "spring-tx-18",
    difficulty: 2,
    tags: ["persistence-context", "dirty-checking"],
    prompt: "Aucun `save()` n'est appelé. Que se passe-t-il au commit ?",
    code: {
      language: "java",
      code: `@Transactional
public void deactivate(Long id) {
    Customer c = customers.findById(id).orElseThrow();
    c.setActive(false);
}`,
    },
    choices: [
      "Un `UPDATE` est émis au flush : l'entité est managed, le dirty checking détecte le changement.",
      "Rien n'est écrit : sans `save()`, la modification reste en mémoire.",
      "Exception : modification d'une entité sans `save()` en fin de transaction.",
      "Un `UPDATE` seulement si `active` est annoté `@Column(updatable = true)`.",
    ],
    answer: 0,
    explanation:
      "C'est le cœur de JPA : on modifie des objets, Hibernate calcule les SQL. L'instantané pris au chargement diffère de l'état courant, donc `UPDATE customer SET active = false, ... WHERE id = ?`. Appeler `save()` ici serait redondant (un `merge` sur une entité déjà managed ne fait rien). `updatable = true` est la valeur par défaut.",
  },
  {
    kind: "output",
    id: "spring-tx-19",
    difficulty: 3,
    tags: ["persistence-context", "detached", "transactions"],
    prompt: "Pas de `@Transactional` sur cette méthode de service. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `public void deactivate(Long id) {
    Customer c = customers.findById(id).orElseThrow();
    c.setActive(false);
}`,
    },
    choices: [
      "Aucun `UPDATE` : `findById` a ouvert et fermé sa propre transaction, `c` est détachée, la modification est perdue sans erreur.",
      "Un `UPDATE` au retour de la méthode : Hibernate suit l'entité tant qu'elle est référencée.",
      "`LazyInitializationException` sur `setActive`.",
      "`TransactionRequiredException` sur `setActive`.",
    ],
    answer: 0,
    explanation:
      "Sans transaction englobante, Spring Data en ouvre une pour `findById`, la commit, et ferme le persistence context. `c` sort détachée. `setActive` est un simple setter Java : aucune exception, mais plus aucun suivi. Correction : `@Transactional` sur `deactivate`, ou `customers.save(c)` qui fera un `merge`, moins élégant.",
  },
  {
    kind: "mcq",
    id: "spring-tx-20",
    difficulty: 2,
    tags: ["persistence-context", "merge"],
    prompt: "Que renvoie `entityManager.merge(detached)` ?",
    choices: [
      "Une instance managed distincte de l'argument, sur laquelle l'état de `detached` a été copié ; l'argument reste détaché.",
      "L'argument lui-même, devenu managed.",
      "`void` : `merge` ne renvoie rien, comme `persist`.",
      "Une copie détachée, l'original devenant managed.",
    ],
    answer: 0,
    explanation:
      "`merge` charge l'entité par son id (ou la retrouve dans le contexte), y copie les champs de l'argument, et renvoie cette instance managed. Toute modification ultérieure doit se faire sur la valeur de retour. `persist`, lui, rend l'argument managed et renvoie `void`. Spring Data `save` masque la différence en renvoyant toujours l'instance à utiliser.",
  },
  {
    kind: "spot",
    id: "spring-tx-21",
    difficulty: 2,
    tags: ["persistence-context", "merge", "detached"],
    prompt: "Le nom en base est toujours l'ancien après cette méthode. Trouve la ligne responsable.",
    code: {
      language: "java",
      code: `@Transactional
public void update(CustomerDto dto) {
    Customer customer = mapper.toEntity(dto);
    customers.save(customer);
    customer.setName(dto.name().trim());
}`,
    },
    faultyLine: 5,
    reasons: [
      "`customer` a un id : `save` fait un `merge` et renvoie une autre instance managed ; `customer` reste détaché, cette modification est perdue.",
      "`trim()` renvoie une nouvelle chaîne qui n'est pas persistable.",
      "`save` doit être appelé après `setName`, sinon l'ordre des SQL est faux.",
      "Il manque `flush()` après `setName`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le DTO produit une entité avec un id, donc `save` délègue à `merge`, qui copie l'état vers l'instance managed et la renvoie. La ligne 5 modifie l'objet détaché : personne ne le suit. Écrire `Customer managed = customers.save(customer); managed.setName(...)`, ou faire le `trim` avant le `save`. Le `flush` ne changerait rien.",
  },
  {
    kind: "recall",
    id: "spring-tx-22",
    difficulty: 2,
    tags: ["persistence-context", "cycle-de-vie-entite"],
    prompt: "Décris les quatre états d'une entité JPA et ce qui fait passer de l'un à l'autre.",
    explanation:
      "**Transient** : créée par `new`, inconnue du contexte, pas d'id. `persist` (ou `save` sur une nouvelle) la rend **managed** : suivie par le persistence context, tout changement sera flushé, `find`/`findById` renvoient aussi des managed. À la fin de la transaction (fermeture du contexte), ou après `detach`/`clear`, elle devient **detached** : plus suivie, lazy loading impossible ; `merge` recopie son état sur une nouvelle managed. `remove` sur une managed la passe en **removed** : `DELETE` au flush. Règle pratique : dans une transaction, tout ce qui vient d'un repository est managed ; hors transaction, tout est détaché.",
    keyPoints: ["Transient → `persist` → managed", "Fin de transaction → detached", "`merge` : detached → managed (copie)", "`remove` → removed → DELETE au flush"],
  },
  {
    kind: "order",
    id: "spring-tx-23",
    difficulty: 2,
    tags: ["persistence-context", "flush", "dirty-checking"],
    prompt: "Une transaction contient des entités créées, modifiées et supprimées. Remets dans l'ordre ce qui se passe au commit.",
    items: [
      "Le proxy demande le commit au `PlatformTransactionManager`",
      "Flush : le dirty checking compare chaque entité managed à son instantané",
      "Hibernate ordonne les SQL : INSERT, puis UPDATE, puis DELETE",
      "Les SQL sont envoyés à la base, groupés si le batch est activé",
      "`COMMIT` JDBC",
      "Le persistence context est fermé : toutes les entités deviennent détachées",
    ],
    explanation:
      "Le flush précède le commit : c'est là que les SQL sont calculés et envoyés, et donc là que surgissent les violations de contrainte (`DataIntegrityViolationException`), pas au `save`. Hibernate réordonne les opérations pour respecter les clés étrangères. Après le commit, les entités sont détachées : les toucher dans le contrôleur ne produit plus rien, et un lazy non initialisé lève `LazyInitializationException`.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Cascade, LazyInitializationException, @Version
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-tx-l4",
  title: "Cascade, LazyInitializationException et verrou optimiste",
  blocks: [
    {
      kind: "text",
      text: "Le **cascade** propage une opération du parent aux enfants : `PERSIST`, `MERGE`, `REMOVE`, ou `ALL`. Il exprime une **composition** (une commande possède ses lignes) et se met sur le `@OneToMany` du parent, avec `orphanRemoval = true` pour supprimer un enfant retiré de la collection. Jamais sur un `@ManyToOne` ni un `@ManyToMany` : on supprimerait une entité partagée.",
    },
    {
      kind: "text",
      text: "`LazyInitializationException` survient quand on touche une association `LAZY` **après** la fermeture du persistence context : dans le contrôleur, pendant la sérialisation Jackson, dans un thread séparé. Spring Boot active par défaut **open-in-view**, qui garde le contexte ouvert pendant toute la requête HTTP : l'exception disparaît, mais les requêtes partent depuis la vue (N+1 masqué) et la connexion est tenue jusqu'à la fin de la réponse.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Verrou optimiste, cascade de composition, et le piège lazy.",
      code: `@Entity
public class Order {
    @Version
    private Long version;      // verrou optimiste

    @OneToMany(mappedBy = "order",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}

// PIÈGE : LazyInitializationException
@GetMapping("/{id}")
public OrderDto get(@PathVariable Long id) {
    Order o = service.find(id);   // transaction finie
    return OrderDto.from(o.getItems()); // proxy fermé
}

// application.yml
// spring.jpa.open-in-view: false`,
    },
    {
      kind: "text",
      text: "Désactiver open-in-view et charger dans la transaction ce que le cas d'usage demande : `join fetch`, `@EntityGraph`, ou une projection DTO construite dans le service. Le contrôleur ne voit jamais d'entité.",
    },
    {
      kind: "text",
      text: "`@Version` active le **verrouillage optimiste** : chaque `UPDATE` ajoute `WHERE version = ?` et incrémente la version. Si une autre transaction a modifié la ligne entre-temps, zéro ligne est touchée et Hibernate lève `OptimisticLockException`, que Spring traduit en `ObjectOptimisticLockingFailureException`. Pas de verrou en base, pas d'attente : on détecte le conflit et on laisse l'appelant réessayer ou refuser.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "spring-tx-24",
    difficulty: 2,
    tags: ["lazy-initialization-exception", "open-in-view"],
    prompt: "`spring.jpa.open-in-view` vaut `false`. `Order.items` est `@OneToMany` (LAZY). Que se passe-t-il ?",
    code: {
      language: "java",
      code: `// service
@Transactional(readOnly = true)
public Order find(Long id) {
    return orders.findById(id).orElseThrow();
}

// contrôleur
@GetMapping("/orders/{id}")
public List<String> skus(@PathVariable Long id) {
    return service.find(id).getItems().stream()
                  .map(OrderItem::getSku).toList();
}`,
    },
    choices: [
      "`LazyInitializationException` : la transaction est terminée au retour de `find`, la collection `items` est un proxy non initialisé.",
      "Une requête supplémentaire pour charger les items, puis la liste des SKU.",
      "Liste vide : une collection LAZY non chargée est vide.",
      "`TransactionRequiredException` dans le contrôleur.",
    ],
    answer: 0,
    explanation:
      "Le persistence context s'est fermé avec la transaction de `find`. `getItems()` renvoie le proxy, et le premier accès réel (`stream()`) tente de charger : plus de session, exception. Avec open-in-view à `true`, ça « marcherait » avec une requête depuis le contrôleur, ce qui cache un N+1 potentiel. Solution propre : `join fetch` ou `@EntityGraph` dans le repository, et renvoyer un DTO construit dans le service.",
  },
  {
    kind: "recall",
    id: "spring-tx-25",
    difficulty: 2,
    tags: ["open-in-view", "lazy-initialization-exception"],
    prompt: "Qu'est-ce que open-in-view, pourquoi Spring Boot l'active par défaut, et pourquoi le désactiver ?",
    explanation:
      "**Open Session In View** est un filtre qui ouvre le persistence context au début de la requête HTTP et le ferme après le rendu de la réponse. Spring Boot l'active par défaut (avec un warning au démarrage) pour que les débutants ne rencontrent pas `LazyInitializationException` dans leurs contrôleurs. Le prix : les requêtes SQL partent depuis la couche web, pendant la sérialisation JSON, hors de toute transaction explicite, ce qui masque des N+1 ; et la connexion JDBC reste prise jusqu'à la fin de la réponse, ce qui épuise le pool sous charge. Recommandation : `spring.jpa.open-in-view=false`, charger explicitement dans la transaction du service, exposer des DTO.",
    keyPoints: ["Contexte ouvert toute la requête HTTP", "Masque `LazyInitializationException` et les N+1", "Connexion tenue pendant la sérialisation", "Désactiver, fetch explicite, DTO"],
  },
  {
    kind: "spot",
    id: "spring-tx-26",
    difficulty: 2,
    tags: ["cascade", "relations"],
    prompt: "Supprimer une commande supprime aussi son client, ou échoue sur une contrainte de clé étrangère. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@Entity
public class Order {
    @Id @GeneratedValue private Long id;

    @ManyToOne(fetch = FetchType.LAZY,
               cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}`,
    },
    faultyLine: 6,
    reasons: [
      "`cascade = ALL` sur un `@ManyToOne` propage `REMOVE` vers le client, entité partagée par d'autres commandes : jamais de cascade côté « many ».",
      "`FetchType.LAZY` est interdit sur un `@ManyToOne`.",
      "Il manque `orphanRemoval = false`.",
      "`@JoinColumn` doit être côté `Customer`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le cascade suit le sens de la composition : un parent vers ses enfants exclusifs. Un client n'appartient pas à une commande. Avec `REMOVE` en cascade, supprimer la commande tente de supprimer le client ; si d'autres commandes le référencent, Postgres refuse (`DataIntegrityViolationException`) ; sinon le client disparaît. `orphanRemoval` n'existe pas sur `@ManyToOne`. `LAZY` sur `@ManyToOne` est au contraire recommandé.",
  },
  {
    kind: "output",
    id: "spring-tx-27",
    difficulty: 3,
    tags: ["verrou-optimiste", "version"],
    prompt: "`Order` a un champ `@Version`. Deux transactions T1 et T2 chargent la même commande (version 3), la modifient, T1 commit, puis T2 commit. Que se passe-t-il pour T2 ?",
    code: {
      language: "java",
      code: `@Transactional
public void rename(Long id, String label) {
    Order o = orders.findById(id).orElseThrow();
    o.setLabel(label);
}`,
    },
    choices: [
      "`ObjectOptimisticLockingFailureException` : l'`UPDATE ... WHERE version = 3` de T2 ne touche aucune ligne, la version étant passée à 4.",
      "T2 écrase la modification de T1 : dernier commit gagnant.",
      "T2 attend la fin de T1 puis applique sa modification sur la version 4.",
      "`DataIntegrityViolationException` sur la colonne `version`.",
    ],
    answer: 0,
    explanation:
      "Le verrou optimiste ne bloque personne : chaque `UPDATE` vérifie que la version n'a pas bougé. T1 passe la version à 4. L'`UPDATE` de T2 cherche `version = 3`, met à jour zéro ligne, et Hibernate en déduit un conflit : `OptimisticLockException`, traduite par Spring. C'est le comportement voulu : signaler le conflit plutôt que perdre une écriture. L'attente décrirait un verrou pessimiste (`SELECT ... FOR UPDATE`).",
  },
  {
    kind: "fill",
    id: "spring-tx-28",
    difficulty: 2,
    tags: ["cascade", "orphan-removal", "version"],
    prompt: "Complète : verrou optimiste, et une composition dont les lignes sont persistées et supprimées avec la commande.",
    code: {
      language: "java",
      code: `@Entity
public class Order {
    @{{1}}
    private Long version;

    @OneToMany(mappedBy = "order",
               cascade = CascadeType.{{2}},
               {{3}} = true)
    private List<OrderItem> items = new ArrayList<>();
}`,
    },
    blanks: ["Version", "ALL", "orphanRemoval"],
    distractors: ["Versioned", "Lock", "REMOVE", "cascadeRemove", "optional"],
    explanation:
      "`@Version` (Jakarta) suffit pour le verrou optimiste, Hibernate gère la colonne. `ALL` couvre `PERSIST`, `MERGE` et `REMOVE` : `REMOVE` seul ne persisterait pas les nouvelles lignes avec la commande. `orphanRemoval` supprime une ligne retirée de la collection ; `optional` est un attribut de `@ManyToOne`, pas de `@OneToMany`.",
  },
  {
    kind: "match",
    id: "spring-tx-29",
    difficulty: 1,
    tags: ["persistence-context", "lazy-initialization-exception", "transactions"],
    prompt: "Associe chaque symptôme à sa cause la plus probable.",
    pairs: [
      { left: "`LazyInitializationException`", right: "Accès à une association LAZY après la fermeture du contexte" },
      { left: "`ObjectOptimisticLockingFailureException`", right: "La version en base a changé depuis le chargement" },
      { left: "N+1 requêtes", right: "Association chargée en boucle, une requête par parent" },
      { left: "`TransientPropertyValueException`", right: "Référence à une entité jamais persistée, sans cascade" },
      { left: "`UnexpectedRollbackException`", right: "Un bean participant a marqué la transaction rollback-only" },
      { left: "Modification silencieusement perdue", right: "Entité détachée modifiée hors transaction" },
    ],
    explanation:
      "Six symptômes, six mécanismes. Les deux derniers n'ont pas de stack trace utile : la perte silencieuse est la plus sournoise, car rien ne signale que l'entité était détachée. Le réflexe : vérifier qu'une transaction couvre bien l'unité de travail, et que les entités manipulées en sont issues.",
  },
  {
    kind: "recall",
    id: "spring-tx-30",
    difficulty: 3,
    tags: ["lazy-initialization-exception", "open-in-view", "join-fetch"],
    prompt: "`LazyInitializationException` : quelle est la cause exacte, pourquoi open-in-view la masque, et quelles sont les trois solutions propres ?",
    explanation:
      "**Cause** : une association `LAZY` est un proxy (ou une `PersistentCollection`) lié au persistence context qui l'a créé. Quand ce contexte est fermé, en général à la fin de la transaction du service, le proxy ne peut plus exécuter son SELECT et lève l'exception. **Open-in-view** garde le contexte ouvert jusqu'à la fin de la requête HTTP : le proxy trouve encore sa session, mais la requête part depuis la couche web, hors transaction explicite, et la connexion reste bloquée. **Solutions** : (1) charger l'association dans la transaction, par `join fetch` ou `@EntityGraph` ; (2) renvoyer une projection ou un **DTO** construit dans le service, jamais l'entité ; (3) à défaut, forcer l'initialisation dans le service (`Hibernate.initialize`, ou simplement parcourir la collection) avant de sortir. Et désactiver open-in-view pour que le problème se voie en développement.",
    keyPoints: ["Proxy lié à un contexte fermé", "Open-in-view : contexte ouvert toute la requête, coût caché", "`join fetch` / `@EntityGraph`", "DTO depuis le service", "Initialiser dans la transaction"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-transactions",
  title: "Transactions et persistence context",
  objective:
    "Savoir où et comment une transaction s'ouvre et se termine, prédire commit ou rollback, et raisonner sur l'état d'une entité pour ne plus perdre de modification ni subir de LazyInitializationException.",
  prerequisites: ["spring-jpa"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
