/**
 * Tests — TDD (référentiel 5.1 à 5.3) : cycle, JUnit 5, AssertJ, Mockito,
 * slices Spring et Testcontainers.
 * 4 leçons, 30 exercices. JUnit 5, Mockito 5, Spring Boot 3.x.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Le cycle
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "tests-tdd-l1",
  title: "Red, green, refactor : pourquoi l'ordre compte",
  blocks: [
    {
      kind: "text",
      text: "Le cycle tient en trois temps. **Rouge** : écrire un test qui échoue pour la fonctionnalité voulue. **Vert** : écrire le code le plus simple qui le fait passer, même naïf. **Refactor** : nettoyer le code et le test, en gardant tous les tests au vert.",
    },
    {
      kind: "text",
      text: "L'ordre n'est pas une convention arbitraire. Voir le test **échouer d'abord** prouve qu'il teste réellement quelque chose : un test écrit après le code peut passer pour de mauvaises raisons, et on ne le saura jamais. Écrire le **minimum** ensuite évite de construire des abstractions dont personne n'a besoin.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois passes : rouge, vert, puis refactor sous filet.",
      code: `// 1. ROUGE : la classe n'existe pas encore
@Test
void applique_une_remise_de_10_pourcent() {
    var cart = new Cart(BigDecimal.valueOf(100));
    assertThat(cart.totalWithDiscount())
        .isEqualByComparingTo("90");
}

// 2. VERT : le plus simple qui passe
BigDecimal totalWithDiscount() {
    return BigDecimal.valueOf(90);
}

// 3. Nouveau test rouge : force la généralisation
// puis REFACTOR
BigDecimal totalWithDiscount() {
    return amount.multiply(
        BigDecimal.valueOf(0.9));
}`,
    },
    {
      kind: "text",
      text: "Les **baby steps** consistent à avancer par pas assez courts pour que la cause d'un échec soit évidente. Effet secondaire majeur : le TDD force un code **testable**, donc faiblement couplé, avec des dépendances injectées plutôt que construites sur place.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Le TDD apporte peu sur du code exploratoire, sur des mappings triviaux ou face à une API qu'on ne connaît pas encore : il vaut mieux commencer par un prototype jetable, puis reprendre en TDD.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "order",
    id: "tests-tdd-01",
    difficulty: 1,
    tags: ["tdd", "red-green-refactor"],
    prompt: "Remets une itération de TDD dans l'ordre.",
    items: [
      "Écrire un test pour le comportement voulu",
      "Lancer les tests et vérifier que le nouveau échoue (rouge)",
      "Écrire le code le plus simple qui le fait passer",
      "Lancer les tests et vérifier qu'ils passent tous (vert)",
      "Refactorer le code et le test",
      "Relancer les tests pour confirmer que rien n'est cassé",
    ],
    explanation:
      "L'étape la plus souvent sautée est la deuxième. Voir le test échouer est la seule preuve qu'il teste ce qu'on croit : un test qui passe immédiatement est soit déjà couvert, soit mal écrit. Le refactor arrive en dernier, quand les tests forment un filet.",
  },
  {
    kind: "mcq",
    id: "tests-tdd-02",
    difficulty: 2,
    tags: ["tdd", "red-green-refactor"],
    prompt: "Pourquoi faut-il voir le test échouer avant d'écrire le code ?",
    choices: [
      "C'est la seule preuve que le test vérifie vraiment le comportement visé, et pas quelque chose qui passait déjà.",
      "JUnit refuse d'exécuter un test qui n'a jamais échoué.",
      "Cela permet de mesurer la couverture de code avant l'implémentation.",
      "L'échec initial est nécessaire pour que le refactor soit autorisé.",
    ],
    answer: 0,
    explanation:
      "Un test écrit après le code peut passer par accident : mauvaise assertion, mauvais objet vérifié, assertion oubliée. Tant qu'on ne l'a pas vu échouer, on ne sait pas s'il détecterait une régression. C'est aussi une vérification de l'outillage : un test dans le mauvais paquet ou non détecté ne se voit qu'au rouge attendu.",
  },
  {
    kind: "recall",
    id: "tests-tdd-03",
    difficulty: 2,
    tags: ["tdd", "conception"],
    prompt: "En quoi le TDD change-t-il la conception du code, au-delà de la couverture de tests ?",
    explanation:
      "Il rend la **testabilité** obligatoire, et la testabilité impose un faible couplage. Pour tester une classe isolément, ses dépendances doivent pouvoir être remplacées : elles sont donc **injectées** par le constructeur plutôt que construites sur place, et exprimées par des **interfaces** plutôt que par des implémentations concrètes. Les méthodes deviennent plus petites et plus pures, parce qu'une méthode de deux cents lignes avec cinq effets de bord est pénible à tester et qu'on le ressent immédiatement. Les responsabilités se séparent, parce qu'un test qui a besoin de dix objets factices signale une classe qui en fait trop. Le TDD ne garantit pas une bonne conception, mais il rend la mauvaise inconfortable tout de suite, au lieu de six mois plus tard.",
    keyPoints: ["Testable ⇒ faiblement couplé", "Dépendances injectées, pas construites", "Méthodes courtes, effets de bord isolés", "Un test pénible signale un problème de conception"],
  },
  {
    kind: "spot",
    id: "tests-tdd-04",
    difficulty: 2,
    tags: ["tdd", "conception"],
    prompt: "Cette classe est impossible à tester sans base de données. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public class OrderService {
    private final OrderRepository repo =
        new JpaOrderRepository();

    public Order place(Cart cart) {
        return repo.save(cart.toOrder());
    }
}`,
    },
    faultyLine: 3,
    reasons: [
      "La dépendance est construite sur place : impossible de lui substituer un double dans un test. Elle doit être injectée par le constructeur.",
      "Le champ ne devrait pas être `final` pour qu'un test puisse le remplacer.",
      "`OrderRepository` devrait être une classe abstraite plutôt qu'une interface.",
      "La méthode `place` devrait être `static` pour être testable sans instance.",
    ],
    reasonAnswer: 0,
    explanation:
      "En instanciant `JpaOrderRepository` elle-même, la classe se lie à la persistance : tout test démarre une base. Correction : `OrderService(OrderRepository repo)` et le test passe un double en mémoire. C'est exactement la pression que le TDD exerce sur la conception. Retirer `final` pour bricoler le champ par réflexion est un contournement, pas une solution.",
  },
  {
    kind: "mcq",
    id: "tests-tdd-05",
    difficulty: 2,
    tags: ["tdd"],
    prompt: "Le test rouge passe dès la première exécution, avant d'écrire la moindre ligne de production. Que faut-il en conclure ?",
    choices: [
      "Le test est suspect : il ne vérifie probablement pas ce qu'on croit, ou le comportement existe déjà.",
      "L'implémentation est terminée, on peut passer au refactor.",
      "C'est normal en TDD, l'étape rouge étant facultative.",
      "Il faut supprimer le test, qui n'apporte rien.",
    ],
    answer: 0,
    explanation:
      "Deux causes possibles. Le comportement existe déjà : le test est redondant, ou on a mal choisi le prochain incrément. Ou le test est mal écrit : assertion sur le mauvais objet, assertion absente, cas limite non couvert. Dans les deux cas, il faut comprendre avant de continuer, pas se réjouir du vert.",
  },
  {
    kind: "match",
    id: "tests-tdd-06",
    difficulty: 1,
    tags: ["tdd", "red-green-refactor"],
    prompt: "Associe chaque étape du cycle à sa règle.",
    pairs: [
      { left: "Rouge", right: "Un seul test qui échoue, pour la bonne raison" },
      { left: "Vert", right: "Le code le plus simple, même naïf" },
      { left: "Refactor", right: "Améliorer sans changer le comportement" },
      { left: "Baby steps", right: "Des pas assez courts pour localiser un échec" },
    ],
    explanation:
      "La règle du vert surprend : écrire volontairement un code naïf, quitte à retourner une constante, force le test suivant à exister pour justifier la généralisation. On ne conçoit ainsi que ce que les tests réclament, sans anticiper des besoins imaginaires.",
  },
  {
    kind: "recall",
    id: "tests-tdd-07",
    difficulty: 2,
    tags: ["tdd", "nommage"],
    prompt: "Comment structurer et nommer un test pour qu'il reste lisible six mois plus tard ?",
    explanation:
      "**Structure Given/When/Then** : une section pour préparer le contexte, une pour exécuter l'action testée, une pour vérifier le résultat, séparées visuellement. Une seule action par test, et de préférence une seule idée vérifiée. **Nommage** : le nom décrit le comportement attendu, pas la méthode appelée. `refuse_une_commande_si_le_stock_est_insuffisant` vaut mieux que `testPlaceOrder2`, parce qu'il indique ce qui est cassé quand il devient rouge, sans lire le corps. `@DisplayName` permet une phrase complète avec espaces et accents. **Contenu** : les données du test sont explicites et minimales, chaque valeur présente doit compter pour le comportement testé, sinon elle brouille la lecture. Un test est de la documentation exécutable : il est lu bien plus souvent qu'écrit.",
    keyPoints: ["Given / When / Then visibles", "Le nom décrit le comportement, pas la méthode", "`@DisplayName` pour une phrase lisible", "Données minimales et significatives"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — JUnit 5 et AssertJ
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "tests-tdd-l2",
  title: "JUnit 5 et AssertJ",
  blocks: [
    {
      kind: "text",
      text: "JUnit 5 exécute les méthodes `@Test`. `@BeforeEach` et `@AfterEach` encadrent **chaque** test ; `@BeforeAll` et `@AfterAll` s'exécutent une fois pour la classe et doivent être `static`, JUnit créant une nouvelle instance de la classe par test. Ni la classe ni les méthodes n'ont besoin d'être `public`.",
    },
    {
      kind: "text",
      text: "`@ParameterizedTest` remplace une boucle ou cinq tests copiés-collés : `@ValueSource` pour une liste de valeurs simples, `@CsvSource` pour des couples entrée-résultat, `@MethodSource` pour des cas construits par une méthode `static`. `@Nested` regroupe les tests d'un même contexte, `@DisplayName` leur donne un libellé lisible.",
    },
    {
      kind: "code",
      language: "java",
      caption: "AssertJ : une assertion qui se lit et qui explique son échec.",
      code: `@ParameterizedTest
@CsvSource({"100, 90", "50, 45", "0, 0"})
void applique_la_remise(int montant, int attendu) {
    assertThat(new Cart(montant).total())
        .isEqualTo(attendu);
}

@Test
void refuse_un_montant_negatif() {
    assertThatThrownBy(() -> new Cart(-1))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("négatif");
}

@Test
void extrait_les_references() {
    assertThat(order.getLines())
        .hasSize(2)
        .extracting(Line::sku)
        .containsExactly("A-1", "B-2");
}`,
    },
    {
      kind: "text",
      text: "`assertThrows` de JUnit **renvoie** l'exception capturée, ce qui permet d'en vérifier ensuite le message. AssertJ propose l'équivalent plus fluide `assertThatThrownBy`. Sa force reste les assertions sur les collections : `extracting` projette un champ, `containsExactly` impose l'ordre, `containsExactlyInAnyOrder` ne l'impose pas.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`assertThat(list).contains(x)` sur une collection d'entités compare avec `equals`. Sans `equals` correct, l'assertion échoue alors que l'objet est bien là : préférer `extracting` sur un champ identifiant.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "spot",
    id: "tests-tdd-08",
    difficulty: 2,
    tags: ["junit"],
    prompt: "Ce test échoue au démarrage avec une erreur d'initialisation. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `class OrderServiceTest {

    @BeforeAll
    void setUpDatabase() { db.start(); }

    @Test
    void place_une_commande() { }
}`,
    },
    faultyLine: 3,
    reasons: [
      "`@BeforeAll` doit être `static` : JUnit crée une instance par test, la méthode ne peut donc pas dépendre d'une instance.",
      "`@BeforeAll` n'existe pas en JUnit 5, il faut `@BeforeClass`.",
      "La classe de test doit être déclarée `public`.",
      "Il manque `@TestInstance` sur la méthode `@Test`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Par défaut, le cycle de vie est `PER_METHOD` : une nouvelle instance par test, donc rien d'utile ne peut vivre dans un champ d'instance entre les tests. `@BeforeAll` doit être `static`, sauf si la classe est annotée `@TestInstance(Lifecycle.PER_CLASS)`. `@BeforeClass` est le nom JUnit 4, et une classe de test JUnit 5 n'a pas besoin d'être `public`.",
  },
  {
    kind: "output",
    id: "tests-tdd-09",
    difficulty: 2,
    tags: ["junit"],
    prompt: "Combien de fois ce test s'exécute-t-il, et que vaut `compteur` au dernier passage ?",
    code: {
      language: "java",
      code: `class CompteurTest {
    private int compteur = 0;

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3})
    void incremente(int valeur) {
        compteur++;
        assertThat(compteur).isEqualTo(1);
    }
}`,
    },
    choices: [
      "Trois exécutions, et l'assertion passe à chaque fois : une nouvelle instance par cas remet `compteur` à 0.",
      "Trois exécutions, la deuxième échoue : `compteur` vaut 2.",
      "Une seule exécution avec les trois valeurs successives.",
      "Trois exécutions, mais `compteur` reste à 0, les champs n'étant pas initialisés.",
    ],
    answer: 0,
    explanation:
      "Un `@ParameterizedTest` compte pour autant de tests que de valeurs, et le cycle `PER_METHOD` crée une instance neuve à chaque fois : `compteur` repart de 0 puis vaut 1. C'est cette isolation qui garantit qu'un test ne dépend jamais de l'ordre d'exécution. Avec `@TestInstance(PER_CLASS)`, l'instance serait partagée et le deuxième cas échouerait.",
  },
  {
    kind: "fill",
    id: "tests-tdd-10",
    difficulty: 1,
    tags: ["junit", "assertj"],
    prompt: "Complète ce test paramétré.",
    code: {
      language: "java",
      code: `@{{1}}
@{{2}}({"100, 90", "50, 45"})
void applique_la_remise(int montant,
                        int attendu) {
    {{3}}(new Cart(montant).total())
        .isEqualTo(attendu);
}`,
    },
    blanks: ["ParameterizedTest", "CsvSource", "assertThat"],
    distractors: ["Test", "ValueSource", "MethodSource", "assertEquals", "assertThrows"],
    explanation:
      "`@ParameterizedTest` remplace `@Test` ; les cumuler ferait exécuter la méthode deux fois. `@CsvSource` fournit plusieurs arguments par cas, là où `@ValueSource` n'en donne qu'un seul. `assertThat` est l'entrée d'AssertJ, dont les messages d'échec sont bien plus explicites que ceux d'`assertEquals`.",
  },
  {
    kind: "output",
    id: "tests-tdd-11",
    difficulty: 2,
    tags: ["junit", "assertj"],
    prompt: "Que se passe-t-il si `new Cart(-1)` ne lève aucune exception ?",
    code: {
      language: "java",
      code: `@Test
void refuse_un_montant_negatif() {
    var e = assertThrows(
        IllegalArgumentException.class,
        () -> new Cart(-1));
    assertThat(e).hasMessageContaining("négatif");
}`,
    },
    choices: [
      "Le test échoue sur `assertThrows`, avec « Expected IllegalArgumentException to be thrown, but nothing was thrown ».",
      "Le test passe, `assertThrows` renvoyant `null` en l'absence d'exception.",
      "Le test échoue à la ligne suivante, sur une `NullPointerException`.",
      "Le test est ignoré, faute d'exception à capturer.",
    ],
    answer: 0,
    explanation:
      "`assertThrows` échoue immédiatement si rien n'est levé, ou si le type levé n'est pas celui attendu ni une de ses sous-classes. Sinon il **renvoie** l'exception, ce qui permet d'enchaîner les vérifications sur le message. C'est le seul intérêt de la valeur de retour, souvent ignorée.",
  },
  {
    kind: "mcq",
    id: "tests-tdd-12",
    difficulty: 2,
    tags: ["assertj"],
    prompt: "Quelle assertion vérifie que la liste contient exactement deux lignes, dont les références sont `A-1` et `B-2`, sans imposer l'ordre ?",
    choices: [
      "`assertThat(lines).extracting(Line::sku).containsExactlyInAnyOrder(\"A-1\", \"B-2\")`",
      "`assertThat(lines).extracting(Line::sku).contains(\"A-1\", \"B-2\")`",
      "`assertThat(lines).hasSize(2).contains(\"A-1\", \"B-2\")`",
      "`assertThat(lines).containsExactly(\"A-1\", \"B-2\")`",
    ],
    answer: 0,
    explanation:
      "`containsExactlyInAnyOrder` impose le contenu **et** la taille, sans l'ordre. `contains` seul autoriserait des éléments supplémentaires. Les deux dernières comparent des `Line` à des chaînes et échouent quoi qu'il arrive : sans `extracting`, la comparaison porte sur les objets eux-mêmes, via `equals`.",
  },
  {
    kind: "recall",
    id: "tests-tdd-13",
    difficulty: 2,
    tags: ["junit", "assertj"],
    prompt: "Quel est l'intérêt d'AssertJ par rapport aux assertions natives de JUnit ?",
    explanation:
      "**Lisibilité** : `assertThat(total).isEqualTo(90)` se lit dans l'ordre naturel, alors qu'`assertEquals(90, total)` impose de se souvenir que l'attendu vient en premier, source d'erreur constante. **Messages d'échec** : AssertJ décrit précisément l'écart, en particulier sur les collections où il indique les éléments manquants et en trop, là que JUnit affiche deux `toString` à comparer à l'œil. **Chaînage** : `assertThat(list).hasSize(2).extracting(Line::sku).containsExactly(...)` exprime plusieurs vérifications liées en une phrase. **Richesse** : des assertions spécialisées pour les collections, les dates, les exceptions, les `Optional`, et la complétion automatique de l'IDE qui propose ce qui a du sens pour le type. Coût : une dépendance, déjà présente dans `spring-boot-starter-test`.",
    keyPoints: ["Ordre naturel sujet-verbe", "Messages d'échec détaillés sur les collections", "Chaînage lisible", "Assertions typées, découvrables à l'IDE"],
  },
  {
    kind: "match",
    id: "tests-tdd-14",
    difficulty: 2,
    tags: ["junit"],
    prompt: "Associe chaque annotation JUnit 5 à son rôle.",
    pairs: [
      { left: "`@BeforeEach`", right: "Avant chaque test de la classe" },
      { left: "`@BeforeAll`", right: "Une fois pour la classe, méthode `static`" },
      { left: "`@ParameterizedTest`", right: "Un test rejoué pour chaque jeu d'arguments" },
      { left: "`@Nested`", right: "Regroupe les tests d'un même contexte" },
      { left: "`@DisplayName`", right: "Libellé lisible dans le rapport" },
    ],
    explanation:
      "`@BeforeEach` remet le contexte à zéro pour garantir l'indépendance des tests. `@Nested` s'écrit sur une classe interne **non statique**, ce qui lui donne accès aux champs de la classe englobante : pratique pour décrire plusieurs situations autour d'un même sujet.",
  },
  {
    kind: "mcq",
    id: "tests-tdd-15",
    difficulty: 1,
    tags: ["junit"],
    prompt: "Un test vérifie trois propriétés d'un même objet et échoue sur la première. Comment voir aussi les deux autres ?",
    choices: [
      "Les grouper dans `assertAll(...)`, qui exécute toutes les assertions et rapporte tous les échecs.",
      "Les répartir dans trois méthodes `@Test` distinctes, seule solution possible.",
      "Utiliser `@RepeatedTest(3)`.",
      "Ajouter `@Test(continueOnFailure = true)`.",
    ],
    answer: 0,
    explanation:
      "Sans regroupement, la première assertion échouée interrompt le test et masque les suivantes. `assertAll` les exécute toutes et présente un rapport consolidé, utile pour vérifier plusieurs champs d'un même résultat. Séparer en trois tests reste valable, mais devient verbeux pour un même objet. `@Test` n'a pas d'attribut de ce genre en JUnit 5.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Mockito
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "tests-tdd-l3",
  title: "Mockito : doubles, stubs et vérifications",
  blocks: [
    {
      kind: "text",
      text: "Un **mock** remplace une dépendance pour isoler la classe testée. `@ExtendWith(MockitoExtension.class)` active l'extension, `@Mock` crée les doubles et `@InjectMocks` construit l'objet testé en leur passant ces doubles.",
    },
    {
      kind: "text",
      text: "Deux usages distincts. **Stuber** avec `when(...).thenReturn(...)` fournit une réponse à une question : c'est une entrée du test. **Vérifier** avec `verify(...)` contrôle qu'un appel a bien eu lieu : c'est une sortie. Ne pas vérifier ce qui est déjà stubé, sous peine de tester le mock plutôt que le code.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Stub en entrée, capture en sortie.",
      code: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository repo;
    @Mock NotifierPort notifier;
    @InjectMocks OrderService service;

    @Test
    void notifie_apres_enregistrement() {
        when(repo.save(any(Order.class)))
            .thenAnswer(i -> i.getArgument(0));

        service.place(new Cart(100));

        var captor =
            ArgumentCaptor.forClass(Order.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().total())
            .isEqualByComparingTo("100");
        verify(notifier, never()).sendSms(any());
    }
}`,
    },
    {
      kind: "text",
      text: "`ArgumentCaptor` récupère l'argument réellement passé pour l'inspecter, plus souple qu'un `equals` dans le `verify`. Attention aux **matchers** : dès qu'un argument en utilise un, tous doivent en utiliser, d'où `eq(\"x\")` pour une valeur littérale. Pour une méthode `void`, `when` ne compile pas : il faut la forme `doThrow(...).when(mock).methode()`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "En mode strict, un `when(...)` jamais utilisé fait échouer le test par `UnnecessaryStubbingException`. Ce n'est pas une nuisance : c'est le signe que le test ment sur ce dont il a besoin.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "tests-tdd-16",
    difficulty: 3,
    tags: ["mockito"],
    prompt: "Que se passe-t-il à l'exécution de ce test ?",
    code: {
      language: "java",
      code: `@ExtendWith(MockitoExtension.class)
class ServiceTest {
    @Mock Repo repo;
    @InjectMocks Service service;

    @Test
    void calcule() {
        when(repo.findRate()).thenReturn(2);
        assertThat(service.double(21))
            .isEqualTo(42);
    }
}

// Service.double(int n) { return n * 2; }`,
    },
    choices: [
      "Le test échoue sur `UnnecessaryStubbingException` : `findRate()` n'est jamais appelé.",
      "Le test passe : l'assertion est vérifiée, le stub inutilisé est ignoré.",
      "Le test échoue sur l'assertion, `double` renvoyant 0.",
      "Le test échoue au démarrage : `@InjectMocks` ne peut pas construire `Service`.",
    ],
    answer: 0,
    explanation:
      "`MockitoExtension` applique par défaut la rigueur `STRICT_STUBS` : un stub déclaré mais jamais consommé fait échouer le test. Ici `double` n'utilise pas le dépôt. Le message est explicite et pointe la ligne. La bonne réaction est de **supprimer le stub**, pas de relâcher la rigueur : il documentait une dépendance qui n'existe pas.",
  },
  {
    kind: "spot",
    id: "tests-tdd-17",
    difficulty: 2,
    tags: ["mockito"],
    prompt: "Ce test échoue avec `InvalidUseOfMatchersException`. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@Test
void enregistre_la_commande() {
    service.place(cart, "FR");

    verify(repo).save(any(Order.class), "FR");
}`,
    },
    faultyLine: 5,
    reasons: [
      "Un argument utilise un matcher et l'autre une valeur brute : il faut écrire `eq(\"FR\")`.",
      "`verify` ne peut pas porter sur une méthode à deux arguments.",
      "`any(Order.class)` est obsolète, il faut `any()`.",
      "Il manque `times(1)` dans l'appel à `verify`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Les matchers Mockito fonctionnent par effets de bord sur une pile interne : si un argument en utilise un, **tous** doivent en utiliser. Correction : `verify(repo).save(any(Order.class), eq(\"FR\"))`. L'erreur apparaît parfois dans le test **suivant**, la pile restant polluée, ce qui rend le diagnostic déroutant. `times(1)` est la valeur par défaut.",
  },
  {
    kind: "match",
    id: "tests-tdd-18",
    difficulty: 2,
    tags: ["mockito", "mock-vs-stub"],
    prompt: "Associe chaque type de double de test à sa définition.",
    pairs: [
      { left: "Stub", right: "Renvoie des réponses préprogrammées" },
      { left: "Mock", right: "Stub dont on vérifie aussi les interactions" },
      { left: "Fake", right: "Implémentation réelle mais simplifiée, comme un dépôt en mémoire" },
      { left: "Spy", right: "Enveloppe un objet réel, dont on redéfinit quelques méthodes" },
    ],
    explanation:
      "La distinction utile en pratique est stub contre mock : le stub alimente le test, le mock sert d'assertion sur un comportement attendu. Un fake en mémoire est souvent préférable à une pile de stubs pour un dépôt, car il reste cohérent d'un appel à l'autre. Le spy est un outil de dernier recours, sur du code hérité difficile à découper.",
  },
  {
    kind: "mcq",
    id: "tests-tdd-19",
    difficulty: 2,
    tags: ["mockito", "conception"],
    prompt: "Que ne faut-il **pas** mocker ?",
    choices: [
      "Les objets de valeur et les types qu'on ne possède pas, comme une bibliothèque tierce.",
      "Les interfaces de ports sortants définies par le domaine.",
      "Les dépendances qui touchent au réseau ou au système de fichiers.",
      "Les services applicatifs appelés par un contrôleur en test de tranche.",
    ],
    answer: 0,
    explanation:
      "Mocker un objet de valeur comme un `Money` ou une `LocalDate` complique le test sans rien isoler : on peut simplement l'instancier. Mocker un type qu'on ne possède pas fige des hypothèses sur une API qu'on ne maîtrise pas et qui peut changer ; mieux vaut envelopper cette bibliothèque derrière une interface à soi, et mocker celle-là. Les trois autres cas sont au contraire les usages légitimes.",
  },
  {
    kind: "fill",
    id: "tests-tdd-20",
    difficulty: 2,
    tags: ["mockito", "argument-captor"],
    prompt: "Complète pour vérifier le contenu de l'objet réellement enregistré.",
    code: {
      language: "java",
      code: `var captor = ArgumentCaptor
        .forClass(Order.class);

{{1}}(repo).save(captor.{{2}}());

assertThat(captor.{{3}}().total())
    .isEqualByComparingTo("100");`,
    },
    blanks: ["verify", "capture", "getValue"],
    distractors: ["when", "getArgument", "thenReturn", "getAllValues"],
    explanation:
      "La capture s'installe dans un `verify`, jamais dans un `when`. `capture()` occupe la place de l'argument attendu, `getValue()` renvoie la dernière valeur capturée. `getAllValues()` sert quand la méthode est appelée plusieurs fois.",
  },
  {
    kind: "output",
    id: "tests-tdd-21",
    difficulty: 2,
    tags: ["mockito"],
    prompt: "Que renvoie `repo.findById(\"x\")` si aucun stub n'a été déclaré sur ce mock ?",
    code: {
      language: "java",
      code: `@Mock OrderRepository repo;

@Test
void sans_stub() {
    var result = repo.findById("x");
    System.out.println(result);
}`,
    },
    choices: [
      "`null`, valeur par défaut d'un mock pour un type référence.",
      "Une `NullPointerException` à l'appel.",
      "Un `Optional.empty()`, Mockito connaissant le type de retour.",
      "Une `UnstubbedMethodException`.",
    ],
    answer: 0,
    explanation:
      "Un mock non stubé renvoie la valeur par défaut du type : `null` pour une référence, `0` pour un numérique, `false` pour un booléen, et une collection **vide** pour `List` ou `Set`. Attention : depuis Mockito 2, `Optional` fait partie des types dont la réponse par défaut est vide, mais compter là-dessus rend le test illisible. Mieux vaut stuber explicitement ce dont on dépend.",
  },
  {
    kind: "recall",
    id: "tests-tdd-22",
    difficulty: 3,
    tags: ["mockito", "conception"],
    prompt: "Quand vaut-il mieux écrire un fake en mémoire plutôt qu'empiler des mocks ?",
    explanation:
      "Dès qu'un test doit **enchaîner plusieurs opérations cohérentes** sur la même dépendance. Un dépôt mocké oblige à stuber chaque appel indépendamment : rien ne garantit qu'un `findById` après un `save` renvoie ce qui a été enregistré, et le test décrit une réalité impossible. Un `InMemoryOrderRepository` adossé à une `Map` est **cohérent par construction**, se relit sans effort, et sert plusieurs dizaines de tests. C'est particulièrement vrai en architecture hexagonale, où les ports sortants sont des interfaces du domaine, petites et stables : le fake est facile à écrire et devient un outil de test réutilisable. On garde les mocks pour les **vérifications d'interaction**, quand l'appel lui-même est le comportement à tester, comme l'envoi d'une notification. Signal d'alerte : un test qui commence par cinq lignes de `when` teste probablement la configuration des mocks plus que le code.",
    keyPoints: ["Fake si plusieurs opérations liées", "Cohérent par construction, réutilisable", "Mock pour vérifier une interaction attendue", "Cinq `when` d'affilée = mauvais signe"],
  },
  {
    kind: "mcq",
    id: "tests-tdd-23",
    difficulty: 2,
    tags: ["mockito"],
    prompt: "Comment stuber une méthode qui retourne `void` pour qu'elle lève une exception ?",
    choices: [
      "`doThrow(new MailException()).when(notifier).send(any());`",
      "`when(notifier.send(any())).thenThrow(new MailException());`",
      "`verify(notifier).send(any()).thenThrow(new MailException());`",
      "Impossible : une méthode `void` ne peut pas être stubée.",
    ],
    answer: 0,
    explanation:
      "`when(...)` a besoin d'une valeur de retour pour construire le stub, ce qu'une méthode `void` ne fournit pas : elle ne compile pas. La forme `doThrow(...).when(mock).methode(...)` contourne le problème, comme `doNothing`, `doAnswer` et `doReturn`. Cette dernière sert aussi sur un `spy`, où `when(spy.foo())` exécuterait réellement la méthode.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Tests Spring
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "tests-tdd-l4",
  title: "Tests Spring : tranches et Testcontainers",
  blocks: [
    {
      kind: "text",
      text: "`@SpringBootTest` démarre le contexte complet : pratique, mais lent, et un échec n'indique pas quelle couche est fautive. Les **tranches** ne chargent que ce qui est nécessaire. `@WebMvcTest` monte la couche web et `MockMvc`, sans base ni services : les collaborateurs sont fournis par `@MockitoBean`. `@DataJpaTest` monte JPA et les dépôts, sans la couche web.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Une tranche web, un service mocké, une base réelle jetable.",
      code: `@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean OrderService service;

    @Test
    void renvoie_404_si_absente() throws Exception {
        when(service.find("x"))
            .thenThrow(new OrderNotFound("x"));

        mvc.perform(get("/api/orders/x"))
           .andExpect(status().isNotFound());
    }
}

@DataJpaTest
@Testcontainers
class OrderRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> db =
        new PostgreSQLContainer<>("postgres:16");
}`,
    },
    {
      kind: "text",
      text: "`@DataJpaTest` remplace par défaut la source de données par une base embarquée, ce qui masque tout ce qui est spécifique à Postgres. **Testcontainers** lance un vrai Postgres dans un conteneur jetable ; `@ServiceConnection` en câble l'URL automatiquement, sans écrire la moindre propriété.",
    },
    {
      kind: "text",
      text: "Chaque test JPA est transactionnel et **annulé** à la fin, ce qui garantit l'isolation sans nettoyage manuel. Le conteneur, lui, est déclaré `static` pour être partagé par toute la classe.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "`@MockBean` est déprécié depuis Spring Boot 3.4 au profit de `@MockitoBean`. Les deux remplacent un bean du contexte par un mock, contrairement à `@Mock` qui ne connaît pas Spring.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "tests-tdd-24",
    difficulty: 2,
    tags: ["spring-test", "slices"],
    prompt: "Dans un `@WebMvcTest(OrderController.class)`, comment fournir le `OrderService` dont dépend le contrôleur ?",
    choices: [
      "Avec `@MockitoBean OrderService service` : la tranche web ne charge pas les services.",
      "Avec `@Mock OrderService service`, comme dans un test unitaire.",
      "Avec `@Autowired OrderService service`, Spring le trouvant par component scan.",
      "En ajoutant `@SpringBootTest` en plus de `@WebMvcTest`.",
    ],
    answer: 0,
    explanation:
      "`@WebMvcTest` ne charge que les composants web : contrôleurs, convertisseurs, gestionnaires d'exceptions. Un `@Autowired` sur le service échoue faute de bean. `@Mock` crée un double mais ne l'enregistre pas dans le contexte, donc le contrôleur ne le reçoit pas. Seul `@MockitoBean` place le mock **dans le contexte Spring**.",
  },
  {
    kind: "output",
    id: "tests-tdd-25",
    difficulty: 2,
    tags: ["spring-test", "slices"],
    prompt: "Deux tests d'une même classe `@DataJpaTest` : le premier enregistre une commande, le second compte les lignes. Que trouve le second ?",
    code: {
      language: "java",
      code: `@DataJpaTest
class OrderRepositoryTest {
    @Autowired OrderRepository repo;

    @Test
    void enregistre() {
        repo.save(new Order("A-1"));
        assertThat(repo.count()).isEqualTo(1);
    }

    @Test
    void compte() {
        assertThat(repo.count()).isEqualTo(0);
    }
}`,
    },
    choices: [
      "Zéro : chaque test `@DataJpaTest` est transactionnel et annulé à la fin.",
      "Un : les données du premier test persistent dans la base.",
      "Le résultat dépend de l'ordre d'exécution des tests.",
      "Une erreur : `count()` n'est pas disponible hors transaction.",
    ],
    answer: 0,
    explanation:
      "`@DataJpaTest` est méta-annotée `@Transactional` : chaque test s'exécute dans une transaction annulée à la fin. Les tests restent donc indépendants et l'ordre n'a aucune importance. Conséquence à connaître : sans `flush`, certaines contraintes de base ne se déclenchent qu'au commit et passent inaperçues dans ce cadre.",
  },
  {
    kind: "spot",
    id: "tests-tdd-26",
    difficulty: 2,
    tags: ["spring-test", "testcontainers"],
    prompt: "Ce test démarre un conteneur par méthode de test et devient très lent. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@DataJpaTest
@Testcontainers
class OrderRepositoryTest {

    @Container
    @ServiceConnection
    PostgreSQLContainer<?> db =
        new PostgreSQLContainer<>("postgres:16");
}`,
    },
    faultyLine: 6,
    reasons: [
      "Le conteneur n'est pas `static` : il est recréé pour chaque test au lieu d'être partagé par la classe.",
      "`@Container` ne peut pas être combiné avec `@ServiceConnection`.",
      "L'image doit être `postgres:latest` pour être mise en cache.",
      "`@Testcontainers` doit être remplacé par `@SpringBootTest`.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'extension Testcontainers gère un champ `@Container` d'instance par test, et un champ `static` une seule fois pour la classe. Démarrer Postgres coûte quelques secondes : la version d'instance rend la suite inutilisable. `@ServiceConnection` exige d'ailleurs un champ statique pour renseigner les propriétés avant le démarrage du contexte.",
  },
  {
    kind: "match",
    id: "tests-tdd-27",
    difficulty: 2,
    tags: ["spring-test", "slices"],
    prompt: "Associe chaque annotation de test Spring à ce qu'elle charge.",
    pairs: [
      { left: "`@SpringBootTest`", right: "Le contexte complet de l'application" },
      { left: "`@WebMvcTest`", right: "La couche web et `MockMvc` seulement" },
      { left: "`@DataJpaTest`", right: "JPA, les dépôts et une transaction annulée" },
      { left: "`@MockitoBean`", right: "Remplace un bean du contexte par un mock" },
      { left: "`@ServiceConnection`", right: "Câble un conteneur à la configuration" },
    ],
    explanation:
      "Choisir la tranche la plus étroite qui couvre ce qu'on teste : le démarrage est plus rapide et l'échec désigne directement la couche fautive. `@SpringBootTest` se réserve aux quelques tests de bout en bout qui valident l'assemblage.",
  },
  {
    kind: "fill",
    id: "tests-tdd-28",
    difficulty: 2,
    tags: ["spring-test", "mockmvc"],
    prompt: "Complète ce test de contrôleur.",
    code: {
      language: "java",
      code: `@{{1}}(OrderController.class)
class OrderControllerTest {

    @Autowired MockMvc mvc;
    @{{2}} OrderService service;

    @Test
    void renvoie_200() throws Exception {
        mvc.{{3}}(get("/api/orders/1"))
           .andExpect(status().isOk());
    }
}`,
    },
    blanks: ["WebMvcTest", "MockitoBean", "perform"],
    distractors: ["SpringBootTest", "DataJpaTest", "Mock", "Autowired", "execute"],
    explanation:
      "`@WebMvcTest` cible la couche web pour un contrôleur donné. `@MockitoBean` place le double dans le contexte, ce que `@Mock` ne fait pas. `MockMvc` exécute une requête simulée avec `perform`, sans démarrer de serveur ni ouvrir de port.",
  },
  {
    kind: "recall",
    id: "tests-tdd-29",
    difficulty: 2,
    tags: ["spring-test", "testcontainers"],
    prompt: "Pourquoi préférer Testcontainers à une base H2 embarquée pour les tests d'intégration ?",
    explanation:
      "Parce qu'**on teste ce qu'on déploie**. H2 en mode compatibilité Postgres reste une autre base : elle ne connaît ni `jsonb`, ni les tableaux, ni `ON CONFLICT`, ni les fonctions fenêtre complètes, ni les mêmes règles de casse ou de tri. Les migrations Flyway écrites pour Postgres échouent ou, pire, passent en masquant une incompatibilité qui ne sortira qu'en production. Les différences de types, de contraintes et de plans d'exécution rendent les tests faussement rassurants. Testcontainers démarre un vrai Postgres dans un conteneur jetable, détruit à la fin, avec la **même version** qu'en production. Depuis Spring Boot 3.1, `@ServiceConnection` sur un champ `static` renseigne automatiquement URL, utilisateur et mot de passe. Coût réel : quelques secondes au démarrage, amorties en partageant le conteneur au niveau de la classe ou de la suite, et Docker requis sur les agents d'intégration continue.",
    keyPoints: ["H2 ≠ Postgres : types, SQL, migrations", "Tests faussement rassurants", "Même version qu'en production", "`@ServiceConnection` câble tout seul", "Coût : Docker et quelques secondes"],
  },
  {
    kind: "recall",
    id: "tests-tdd-30",
    difficulty: 3,
    tags: ["spring-test", "slices", "conception"],
    prompt: "Comment répartis-tu tes tests entre unitaires, tranches Spring et bout en bout ?",
    explanation:
      "**Beaucoup d'unitaires sur le domaine**, sans aucun framework : règles de calcul, invariants, transitions d'état. Ils s'exécutent en millisecondes, ne cassent que si le comportement change, et c'est là que l'architecture hexagonale se rentabilise puisque le domaine ne dépend de rien. **Un nombre moyen de tests de tranche** : `@WebMvcTest` pour la sérialisation, les codes HTTP et la validation d'un contrôleur ; `@DataJpaTest` avec Testcontainers pour les requêtes réellement écrites, les mappings et les migrations. **Très peu de bout en bout** `@SpringBootTest` : quelques parcours critiques qui vérifient que l'assemblage tient. La raison n'est pas dogmatique : plus un test embarque de couches, plus il est lent, plus il échoue pour des raisons sans rapport, et moins son échec désigne un coupable. La critique du testing trophy est recevable, la couverture des chemins réels comptant plus que la forme de la pyramide, mais la conclusion pratique reste la même : tester au niveau le plus bas où le comportement est observable.",
    keyPoints: ["Domaine : unitaires nombreux, sans framework", "Tranches : contrôleurs et dépôts, ciblées", "Bout en bout : quelques parcours critiques", "Tester au niveau le plus bas possible"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "tests-tdd",
  title: "TDD : cycle, JUnit 5, Mockito, Testcontainers",
  objective:
    "Dérouler le cycle red/green/refactor, écrire des tests lisibles avec JUnit 5 et AssertJ, utiliser Mockito à bon escient et choisir la bonne tranche de test Spring.",
  prerequisites: ["spring-ioc"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
