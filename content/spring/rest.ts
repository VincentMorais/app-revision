/**
 * Spring Boot — REST (référentiel 2.3) : contrôleurs, DTO, validation,
 * gestion globale des erreurs et sérialisation.
 * 4 leçons, 30 exercices. Spring Boot 3.x, Jakarta.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Contrôleur, paramètres et codes de retour
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-rest-l1",
  title: "Contrôleur, paramètres et codes de retour",
  blocks: [
    {
      kind: "text",
      text: "`@RestController` combine `@Controller` et `@ResponseBody` : la valeur retournée est sérialisée dans le corps de la réponse, au lieu d'être interprétée comme un nom de vue. `@RequestMapping` au niveau de la classe fixe le préfixe, les dérivés `@GetMapping`, `@PostMapping` et consorts déclarent la méthode HTTP.",
    },
    {
      kind: "text",
      text: "Chaque partie de la requête a son annotation : `@PathVariable` pour un segment d'URL, `@RequestParam` pour la query string, `@RequestBody` pour le corps JSON, `@RequestHeader` pour un en-tête. `@RequestParam` est **obligatoire par défaut** ; fournir un `defaultValue` le rend implicitement facultatif.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Chaque opération renvoie le code qui décrit son effet.",
      code: `@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable String id) {
        return service.find(id);   // 200 par défaut
    }

    @GetMapping
    public List<OrderDto> list(
        @RequestParam(defaultValue = "0") int page) {
        return service.page(page);
    }

    @PostMapping
    public ResponseEntity<OrderDto> create(
            @RequestBody CreateOrder cmd) {
        OrderDto dto = service.create(cmd);
        URI uri = URI.create("/api/orders/"
                             + dto.id());
        return ResponseEntity.created(uri).body(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,
    },
    {
      kind: "text",
      text: "Le code de statut fait partie du contrat. **201** avec un en-tête `Location` après une création, **204** quand il n'y a rien à renvoyer, **400** si la requête est mal formée, **401** si l'appelant n'est pas authentifié, **403** s'il l'est mais n'a pas le droit, **404** si la ressource n'existe pas, **409** en cas de conflit d'état, **422** si la syntaxe est bonne mais le contenu métier invalide.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "`ResponseEntity` quand le code ou les en-têtes varient ; le type métier nu quand la réponse est toujours 200. `@ResponseStatus(HttpStatus.CREATED)` suffit pour un code fixe sans en-tête.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-rest-01",
    difficulty: 1,
    tags: ["rest", "controllers"],
    prompt: "Quelle est la différence entre `@Controller` et `@RestController` ?",
    choices: [
      "`@RestController` ajoute `@ResponseBody` sur toutes les méthodes : la valeur retournée est sérialisée dans le corps au lieu d'être résolue comme une vue.",
      "`@RestController` n'accepte que les requêtes GET et POST.",
      "`@Controller` est réservé aux applications réactives.",
      "`@RestController` désactive la validation des paramètres.",
    ],
    answer: 0,
    explanation:
      "`@RestController` est un méta-stéréotype : `@Controller` + `@ResponseBody`. Avec `@Controller` seul, retourner la chaîne `\"orders\"` fait chercher une vue nommée `orders` ; avec `@RestController`, cette chaîne est le corps de la réponse. Les deux sont des beans détectés par le component scan et acceptent toutes les méthodes HTTP.",
  },
  {
    kind: "output",
    id: "spring-rest-02",
    difficulty: 2,
    tags: ["rest", "codes-http"],
    prompt: "Que renvoie `GET /api/orders` sans paramètre ?",
    code: {
      language: "java",
      code: `@GetMapping
public List<OrderDto> list(
        @RequestParam int page) {
    return service.page(page);
}`,
    },
    choices: [
      "400 Bad Request : `@RequestParam` est obligatoire par défaut et `page` est absent.",
      "200 OK avec `page` valant 0, la valeur par défaut d'un `int`.",
      "500 Internal Server Error : `NullPointerException` à l'unboxing.",
      "404 Not Found : aucune route ne correspond sans paramètre.",
    ],
    answer: 0,
    explanation:
      "`@RequestParam` a `required = true` par défaut. Spring lève `MissingServletRequestParameterException`, traduite en **400**. Il n'y a pas de valeur par défaut implicite : il faut écrire `@RequestParam(defaultValue = \"0\")`, ce qui rend le paramètre facultatif, ou `@RequestParam(required = false) Integer page` en acceptant `null`.",
  },
  {
    kind: "match",
    id: "spring-rest-03",
    difficulty: 2,
    tags: ["rest", "codes-http"],
    prompt: "Associe chaque situation au code HTTP correct.",
    pairs: [
      { left: "Création réussie d'une ressource", right: "201 avec en-tête `Location`" },
      { left: "Suppression réussie, rien à renvoyer", right: "204 No Content" },
      { left: "Token absent ou invalide", right: "401 Unauthorized" },
      { left: "Authentifié mais sans le droit", right: "403 Forbidden" },
      { left: "Création d'un doublon sur une contrainte unique", right: "409 Conflict" },
    ],
    explanation:
      "Le couple 401/403 est le plus souvent confondu : 401 signifie « je ne sais pas qui tu es », 403 « je sais qui tu es et c'est non ». Le 201 sans en-tête `Location` est incomplet : le client doit apprendre l'URL de ce qui vient d'être créé. Un 409 exprime un conflit avec l'état actuel de la ressource, là où un 400 dit que la requête elle-même est mal formée.",
  },
  {
    kind: "fill",
    id: "spring-rest-04",
    difficulty: 1,
    tags: ["rest", "controllers", "response-entity"],
    prompt: "Complète ce contrôleur de création.",
    code: {
      language: "java",
      code: `@{{1}}("/api/orders")
public ResponseEntity<OrderDto> create(
        @{{2}} CreateOrder cmd) {
    OrderDto dto = service.create(cmd);
    return ResponseEntity
        .{{3}}(URI.create("/api/orders/" + dto.id()))
        .body(dto);
}`,
    },
    blanks: ["PostMapping", "RequestBody", "created"],
    distractors: ["GetMapping", "RequestParam", "PathVariable", "ok", "noContent"],
    explanation:
      "Une création se fait en POST. Le corps JSON est lié par `@RequestBody` ; `@RequestParam` viserait la query string et `@PathVariable` un segment d'URL. `ResponseEntity.created(uri)` produit un 201 en positionnant l'en-tête `Location`, ce que `ok()` ne fait pas.",
  },
  {
    kind: "spot",
    id: "spring-rest-05",
    difficulty: 2,
    tags: ["rest", "controllers"],
    prompt: "L'appel `GET /api/orders/42` renvoie 500. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping("/{id}")
    public OrderDto get(@RequestParam String id) {
        return service.find(id);
    }
}`,
    },
    faultyLine: 6,
    reasons: [
      "Le segment `{id}` de l'URL se lie avec `@PathVariable`, pas avec `@RequestParam` qui lit la query string.",
      "Le chemin `/{id}` doit être déclaré au niveau de la classe.",
      "`@GetMapping` ne supporte pas les variables de chemin, il faut `@RequestMapping`.",
      "La méthode doit renvoyer un `ResponseEntity` pour lire une variable de chemin.",
    ],
    reasonAnswer: 0,
    explanation:
      "`@RequestParam String id` cherche `?id=…` dans la query string. Absent et obligatoire, il produit une erreur ; le placeholder `{id}` reste, lui, non lié. Correction : `@PathVariable String id`. À retenir : `@PathVariable` pour l'URL, `@RequestParam` pour ce qui suit le point d'interrogation.",
  },
  {
    kind: "output",
    id: "spring-rest-06",
    difficulty: 2,
    tags: ["rest", "codes-http", "response-entity"],
    prompt: "Que renvoie cette méthode quand `service.find(id)` renvoie un `Optional` vide ?",
    code: {
      language: "java",
      code: `@GetMapping("/{id}")
public ResponseEntity<OrderDto> get(
        @PathVariable String id) {
    return service.find(id)
        .map(ResponseEntity::ok)
        .orElseGet(() ->
            ResponseEntity.notFound().build());
}`,
    },
    choices: ["404 Not Found avec un corps vide", "200 OK avec un corps `null`", "204 No Content", "500 Internal Server Error"],
    answer: 0,
    explanation:
      "`map` ne s'exécute que si l'`Optional` contient une valeur ; sinon `orElseGet` construit la réponse 404. C'est le motif idiomatique pour traduire une absence en code HTTP directement dans le contrôleur. `notFound()` ne permet pas d'attacher un corps, d'où `build()`.",
  },
  {
    kind: "recall",
    id: "spring-rest-07",
    difficulty: 2,
    tags: ["rest", "codes-http"],
    prompt: "Quelle différence fais-tu entre les codes 400, 404, 409 et 422 ?",
    explanation:
      "**400 Bad Request** : la requête est mal formée ou inexploitable, JSON invalide, paramètre obligatoire absent, type incorrect. Le client ne peut pas la rejouer telle quelle. **404 Not Found** : la ressource visée n'existe pas, ou l'URL ne correspond à rien. **409 Conflict** : la requête est correcte mais entre en conflit avec l'**état actuel** de la ressource, un doublon sur une contrainte unique, une modification concurrente, une transition d'état interdite. **422 Unprocessable Entity** : la syntaxe est bonne, le contenu est compréhensible, mais il viole une **règle métier**, par exemple une date de fin antérieure à la date de début. En pratique beaucoup d'API se contentent de 400 pour les erreurs de validation ; l'important est d'être cohérent et documenté.",
    keyPoints: ["400 : requête mal formée", "404 : ressource absente", "409 : conflit avec l'état actuel", "422 : syntaxe correcte, métier invalide"],
  },
  {
    kind: "mcq",
    id: "spring-rest-08",
    difficulty: 2,
    tags: ["rest", "pagination"],
    prompt: "Un contrôleur reçoit un `Pageable` et l'appel est `GET /api/orders?page=1&size=20&sort=createdAt,desc`. Que reçoit le client ?",
    choices: [
      "La **deuxième** page : la numérotation commence à 0.",
      "La première page, `page=1` désignant la page initiale.",
      "Une erreur 400 : `sort` attend deux paramètres distincts.",
      "Les 20 premiers éléments, `page` étant ignoré sans `@PageableDefault`.",
    ],
    answer: 0,
    explanation:
      "Spring Data numérote les pages à partir de **0** : `page=1` est bien la deuxième. C'est la source d'un décalage classique avec les interfaces qui affichent « page 1 » en premier. La syntaxe `sort=champ,direction` est correcte et peut se répéter pour trier sur plusieurs champs.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — DTO plutôt qu'entité
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-rest-l2",
  title: "DTO plutôt qu'entité JPA",
  blocks: [
    {
      kind: "text",
      text: "Exposer une entité JPA dans un contrôleur est l'erreur de conception la plus fréquente. Quatre problèmes distincts en découlent, et aucun n'est théorique.",
    },
    {
      kind: "text",
      text: "**Sérialisation paresseuse** : Jackson parcourt les getters ; une association `LAZY` non chargée déclenche une `LazyInitializationException` hors transaction, ou une avalanche de requêtes si la session est encore ouverte. **Cycles** : une relation bidirectionnelle fait boucler la sérialisation jusqu'à l'erreur. **Fuite de données** : un champ ajouté à l'entité apparaît aussitôt dans l'API. **Couplage** : le schéma de la base devient le contrat public, impossible à faire évoluer séparément.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un record comme DTO : immuable, concis, sans dépendance à JPA.",
      code: `public record OrderDto(
    String id,
    String customer,
    BigDecimal total,
    List<LineDto> lines) {

    public static OrderDto from(Order o) {
        return new OrderDto(
            o.getId(),
            o.getCustomer().getName(),
            o.total(),
            o.getLines().stream()
                .map(LineDto::from)
                .toList());
    }
}`,
    },
    {
      kind: "text",
      text: "Un `record` est le support idéal : immuable, sans boilerplate, et Jackson le sérialise comme un objet ordinaire depuis la version 2.12. Le mapping se fait à la main pour quelques champs, ou avec MapStruct qui génère l'implémentation à la compilation.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Séparer aussi le DTO d'**entrée** de celui de **sortie** : la création reçoit rarement les mêmes champs qu'elle renvoie. Un identifiant ou une date de création envoyés par le client ne doivent jamais être pris en compte.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-rest-09",
    difficulty: 2,
    tags: ["rest", "dto"],
    prompt: "Quel est le principal risque **technique** à renvoyer directement une entité JPA depuis un contrôleur ?",
    choices: [
      "La sérialisation touche les associations paresseuses : `LazyInitializationException` hors transaction, ou requêtes en cascade dans le cas contraire.",
      "Jackson ne sait pas sérialiser une classe annotée `@Entity`.",
      "L'entité étant mutable, Spring la persiste automatiquement à la sortie du contrôleur.",
      "Le type de retour doit obligatoirement implémenter `Serializable`.",
    ],
    answer: 0,
    explanation:
      "Jackson appelle les getters, y compris ceux des associations `LAZY`. Hors transaction, la session est fermée : `LazyInitializationException`. Avec `open-in-view` actif, chaque association déclenche une requête et l'endpoint devient très lent sans que personne ne s'en aperçoive. S'y ajoutent les cycles des relations bidirectionnelles et la fuite de champs internes.",
  },
  {
    kind: "output",
    id: "spring-rest-10",
    difficulty: 3,
    tags: ["rest", "dto", "jackson"],
    prompt: "`Order` a une `List<Line> lines` et chaque `Line` un champ `Order order`, les deux avec getters. Le contrôleur renvoie l'entité `Order`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@GetMapping("/{id}")
public Order get(@PathVariable String id) {
    return repository.findById(id).orElseThrow();
}`,
    },
    choices: [
      "Récursion infinie à la sérialisation : Jackson boucle entre `Order` et `Line` et l'appel échoue en 500.",
      "Le JSON est produit correctement, Jackson détectant les cycles automatiquement.",
      "Erreur de compilation : un type récursif ne peut pas être retourné.",
      "Le champ `order` de chaque `Line` est ignoré par défaut.",
    ],
    answer: 0,
    explanation:
      "Jackson sérialise `Order`, donc ses `lines`, donc l'`order` de chaque ligne, et ainsi de suite jusqu'au débordement de pile, signalé par une `JsonMappingException` avec « Infinite recursion ». Les rustines existent (`@JsonIgnore`, `@JsonManagedReference` et `@JsonBackReference`) mais elles polluent l'entité avec des préoccupations de présentation. La vraie réponse est un DTO.",
  },
  {
    kind: "fill",
    id: "spring-rest-11",
    difficulty: 1,
    tags: ["rest", "dto", "record"],
    prompt: "Complète ce DTO de sortie.",
    code: {
      language: "java",
      code: `public {{1}} OrderDto(
    String id,
    BigDecimal total) {

    public {{2}} OrderDto from(Order o) {
        return new OrderDto(o.getId(),
                            o.total());
    }
}`,
    },
    blanks: ["record", "static"],
    distractors: ["class", "interface", "abstract", "final"],
    explanation:
      "`record` génère champs, constructeur canonique, accesseurs, `equals`, `hashCode` et `toString`. La fabrique `from` est une méthode `static` : elle n'appartient pas à une instance mais au type. Un record est implicitement `final`, il est donc inutile de l'écrire.",
  },
  {
    kind: "spot",
    id: "spring-rest-12",
    difficulty: 2,
    tags: ["rest", "dto", "securite"],
    prompt: "Ce endpoint de mise à jour permet à un client de s'attribuer le rôle administrateur. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@PutMapping("/{id}")
public UserDto update(@PathVariable String id,
                      @RequestBody User user) {
    user.setId(id);
    return UserDto.from(repository.save(user));
}`,
    },
    faultyLine: 3,
    reasons: [
      "Le corps est lié directement à l'entité : tout champ présent dans le JSON est écrasé, y compris `role` ou `passwordHash`.",
      "`@PutMapping` ne doit jamais accepter de corps de requête.",
      "`setId` après désérialisation crée un doublon en base.",
      "`repository.save` doit être appelé dans une transaction explicite.",
    ],
    reasonAnswer: 0,
    explanation:
      "C'est le mass assignment : le client envoie `{\"role\":\"ADMIN\"}` et Jackson le désérialise dans l'entité, que `save` persiste ensuite. Il faut un DTO d'entrée qui ne contient **que** les champs modifiables, puis recopier explicitement ces champs sur l'entité chargée depuis la base.",
  },
  {
    kind: "recall",
    id: "spring-rest-13",
    difficulty: 2,
    tags: ["rest", "dto", "conception"],
    prompt: "Pourquoi ne jamais exposer une entité JPA dans une API, et pourquoi séparer aussi le DTO d'entrée du DTO de sortie ?",
    explanation:
      "Quatre raisons de ne pas exposer l'entité. **Technique** : les associations paresseuses provoquent `LazyInitializationException` ou des requêtes en cascade, et les relations bidirectionnelles font boucler la sérialisation. **Sécurité** : tout champ ajouté à l'entité apparaît dans l'API, et un corps lié à l'entité permet le mass assignment. **Contrat** : le schéma de la base devient l'API publique, une simple colonne renommée casse les clients. **Évolution** : impossible de faire évoluer le modèle interne et le contrat externe à des rythmes différents. Séparer entrée et sortie parce que les champs diffèrent : la création ne reçoit ni identifiant ni date de création mais les renvoie, et une mise à jour n'accepte qu'un sous-ensemble de champs. Un DTO unique finit rempli de champs facultatifs et de règles conditionnelles.",
    keyPoints: ["Lazy et cycles à la sérialisation", "Fuite de champs et mass assignment", "Le schéma devient le contrat", "Entrée ≠ sortie : id, dates, champs non modifiables"],
  },
  {
    kind: "mcq",
    id: "spring-rest-14",
    difficulty: 1,
    tags: ["rest", "dto", "mapper"],
    prompt: "Quel est l'intérêt de MapStruct par rapport à un mapping écrit à la main ?",
    choices: [
      "Il génère le code de mapping à la **compilation** : pas de réflexion à l'exécution, et une erreur de champ est détectée au build.",
      "Il mappe les objets par réflexion à l'exécution, ce qui évite de recompiler après un changement.",
      "Il supprime le besoin de DTO en exposant directement l'entité de façon sûre.",
      "Il gère automatiquement le chargement des associations paresseuses.",
    ],
    answer: 0,
    explanation:
      "MapStruct est un processeur d'annotations : il produit une implémentation Java lisible au moment du build. Le coût d'exécution est celui d'un mapping manuel, et un champ absent ou mal typé casse la compilation au lieu de passer inaperçu. Pour deux ou trois champs, une fabrique `from` à la main reste plus simple.",
  },
  {
    kind: "order",
    id: "spring-rest-15",
    difficulty: 2,
    tags: ["rest", "dto", "controllers"],
    prompt: "Remets dans l'ordre le traitement d'un `POST /api/orders`.",
    items: [
      "Jackson désérialise le corps JSON en DTO d'entrée",
      "La validation `jakarta.validation` s'applique sur ce DTO",
      "Le contrôleur appelle le service avec les données validées",
      "Le service produit ou charge les entités et les persiste",
      "Le résultat est converti en DTO de sortie",
      "Jackson sérialise ce DTO et le statut 201 est renvoyé",
    ],
    explanation:
      "Le DTO d'entrée est le point d'entrée : il est désérialisé, validé, puis traduit vers le domaine. Le retour suit le chemin inverse. Cette séquence montre pourquoi la validation de format appartient au contrôleur, avant toute règle métier, et pourquoi l'entité ne doit jamais franchir la frontière.",
  },
  {
    kind: "match",
    id: "spring-rest-16",
    difficulty: 2,
    tags: ["rest", "dto"],
    prompt: "Associe chaque problème à sa cause quand une entité JPA est exposée.",
    pairs: [
      { left: "`LazyInitializationException`", right: "Getter d'une association LAZY hors transaction" },
      { left: "`JsonMappingException` avec « Infinite recursion »", right: "Relation bidirectionnelle sérialisée des deux côtés" },
      { left: "Un champ interne apparaît dans le JSON", right: "Colonne ajoutée à l'entité, exposée sans le vouloir" },
      { left: "Un client s'attribue un rôle", right: "Corps lié à l'entité : mass assignment" },
    ],
    explanation:
      "Quatre symptômes, une seule cause de fond : l'entité sert à la fois de modèle de persistance et de contrat d'API, deux rôles qui n'évoluent pas au même rythme et n'ont pas les mêmes contraintes.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Validation
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-rest-l3",
  title: "Valider les entrées avec jakarta.validation",
  blocks: [
    {
      kind: "text",
      text: "La validation de **format** se fait à la frontière, sur le DTO d'entrée. On annote les champs avec les contraintes de `jakarta.validation` et on déclenche le contrôle avec `@Valid` sur le paramètre `@RequestBody`. Sans `@Valid`, les annotations sont là mais ne sont jamais évaluées.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les contraintes sur le DTO, @Valid pour les déclencher.",
      code: `public record CreateOrder(
    @NotBlank
    String customer,

    // @NotNull ne suffit pas : "" passerait
    @NotBlank @Size(max = 40)
    String reference,

    @NotNull @Positive
    BigDecimal total,

    @Email
    String contact,

    // valide aussi chaque élément
    @NotEmpty @Valid
    List<LineDto> lines) { }

@PostMapping
public ResponseEntity<OrderDto> create(
        @Valid @RequestBody CreateOrder cmd) {
    // ...
}`,
    },
    {
      kind: "text",
      text: "Trois contraintes se confondent souvent. `@NotNull` refuse seulement `null`. `@NotEmpty` refuse en plus la chaîne ou la collection vide. `@NotBlank`, réservé aux chaînes, refuse aussi une valeur composée uniquement d'espaces. Pour un champ texte saisi par un utilisateur, c'est presque toujours `@NotBlank`.",
    },
    {
      kind: "text",
      text: "Un échec sur `@RequestBody` lève `MethodArgumentNotValidException`, que Spring traduit en **400**. Valider un `@RequestParam` ou un `@PathVariable` demande en revanche `@Validated` sur la classe, et lève une `ConstraintViolationException`, non traitée par défaut. Pour une règle qui n'existe pas dans la bibliothèque, une contrainte custom se crée avec une annotation et un `ConstraintValidator`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Depuis Spring Boot 2.3, `spring-boot-starter-web` n'embarque plus la validation. Sans `spring-boot-starter-validation` dans le `pom.xml`, les annotations sont ignorées en silence et tout passe.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "spring-rest-17",
    difficulty: 2,
    tags: ["rest", "validation"],
    prompt: "Le DTO porte `@NotBlank String customer`. Que renvoie un POST avec `{\"customer\": \"\"}` ?",
    code: {
      language: "java",
      code: `@PostMapping
public OrderDto create(
        @RequestBody CreateOrder cmd) {
    return service.create(cmd);
}`,
    },
    choices: [
      "200 ou 500 selon la suite : sans `@Valid`, les contraintes ne sont pas évaluées.",
      "400 Bad Request : la contrainte est portée par le DTO, cela suffit.",
      "422 Unprocessable Entity, code par défaut d'un échec de validation.",
      "Erreur au démarrage : `@NotBlank` exige `@Valid` sur le contrôleur.",
    ],
    answer: 0,
    explanation:
      "Les annotations de contrainte sont **déclaratives** : sans `@Valid` sur le paramètre, rien ne les déclenche et la chaîne vide traverse le contrôleur. C'est un bug silencieux fréquent, au même titre que l'oubli de `spring-boot-starter-validation`. Avec `@Valid`, Spring lève `MethodArgumentNotValidException` et renvoie 400.",
  },
  {
    kind: "mcq",
    id: "spring-rest-18",
    difficulty: 2,
    tags: ["rest", "validation"],
    prompt: "Quelle contrainte refuse à la fois `null`, `\"\"` et `\"   \"` ?",
    choices: ["`@NotBlank`", "`@NotNull`", "`@NotEmpty`", "`@Size(min = 1)`"],
    answer: 0,
    explanation:
      "`@NotNull` accepte la chaîne vide. `@NotEmpty` refuse `null` et `\"\"` mais laisse passer `\"   \"`, dont la longueur n'est pas nulle. `@Size(min = 1)` a le même angle mort, et n'échoue même pas sur `null`. Seul `@NotBlank` applique un `trim` avant de vérifier, et il ne s'applique qu'aux `CharSequence`.",
  },
  {
    kind: "spot",
    id: "spring-rest-19",
    difficulty: 2,
    tags: ["rest", "validation"],
    prompt: "Les lignes de commande ne sont jamais validées individuellement. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `public record CreateOrder(
    @NotBlank String customer,
    @NotEmpty List<LineDto> lines) { }

@PostMapping
public OrderDto create(
        @Valid @RequestBody CreateOrder cmd) {
    return service.create(cmd);
}`,
    },
    faultyLine: 3,
    reasons: [
      "`@NotEmpty` vérifie seulement que la liste n'est pas vide : il faut ajouter `@Valid` pour valider en cascade chaque élément.",
      "`@NotEmpty` ne s'applique pas aux `List`, il faut `@Size(min = 1)`.",
      "Le `@Valid` du contrôleur ne fonctionne pas sur un `record`.",
      "Il manque `@Validated` sur la classe du contrôleur.",
    ],
    reasonAnswer: 0,
    explanation:
      "La validation ne descend pas d'elle-même dans les objets imbriqués. `@NotEmpty` garantit qu'il y a au moins une ligne, mais les contraintes portées par `LineDto` sont ignorées. Il faut écrire `@NotEmpty @Valid List<LineDto> lines`. `@Validated` sur la classe ne sert qu'à valider les paramètres simples de méthode.",
  },
  {
    kind: "fill",
    id: "spring-rest-20",
    difficulty: 2,
    tags: ["rest", "validation"],
    prompt: "Complète pour qu'une quantité absente ou négative soit rejetée en 400.",
    code: {
      language: "java",
      code: `public record LineDto(
    @{{1}} String sku,

    @NotNull @{{2}}
    Integer quantity) { }

@PostMapping
public OrderDto create(
        @{{3}} @RequestBody CreateOrder cmd) {
    return service.create(cmd);
}`,
    },
    blanks: ["NotBlank", "Positive", "Valid"],
    distractors: ["NotNull", "Min", "Validated", "NotEmpty"],
    explanation:
      "`@NotBlank` pour une référence textuelle, qui refuse aussi les espaces. `@Positive` refuse zéro et les valeurs négatives ; `@Min` aurait exigé un argument. `@Valid` sur le paramètre déclenche l'ensemble ; `@Validated` s'applique à la classe pour les paramètres simples et lève une autre exception.",
  },
  {
    kind: "mcq",
    id: "spring-rest-21",
    difficulty: 3,
    tags: ["rest", "validation", "conception"],
    prompt: "Où placer la règle « une commande ne peut pas dépasser le plafond de crédit du client » ?",
    choices: [
      "Dans le domaine : c'est une règle métier qui dépend d'un autre agrégat, pas un format de champ.",
      "Dans une contrainte `jakarta.validation` custom sur le DTO d'entrée.",
      "Dans le contrôleur, juste après `@Valid`.",
      "Dans une contrainte `CHECK` en base de données.",
    ],
    answer: 0,
    explanation:
      "La validation déclarative traite ce qui est vérifiable **sur la requête seule** : présence, format, bornes. Cette règle demande de charger le client et son encours : c'est une décision métier, qui appartient au domaine et se traduira par un 409 ou un 422. Une contrainte `CHECK` ne voit qu'une ligne et ne peut pas faire cette jointure.",
  },
  {
    kind: "recall",
    id: "spring-rest-22",
    difficulty: 2,
    tags: ["rest", "validation"],
    prompt: "Trois raisons pour lesquelles une annotation de validation peut être totalement ignorée en production. Lesquelles ?",
    explanation:
      "**Le `@Valid` manquant** sur le paramètre `@RequestBody` : les contraintes sont déclarées mais rien ne les déclenche. **La dépendance absente** : depuis Spring Boot 2.3, `spring-boot-starter-web` n'embarque plus `spring-boot-starter-validation` ; sans elle, aucun validateur n'est enregistré et toutes les annotations sont inertes. **L'absence de `@Valid` en cascade** sur un champ imbriqué : les contraintes de l'objet ou des éléments de collection ne sont pas évaluées. Deux causes voisines : `@Validated` oublié sur la classe quand on valide des `@RequestParam` ou `@PathVariable`, et une contrainte importée du mauvais paquet, `javax.validation` au lieu de `jakarta.validation` après une migration vers Spring Boot 3. Dans tous les cas l'application démarre et les tests naïfs passent : seul un test qui envoie une valeur invalide révèle le trou.",
    keyPoints: ["`@Valid` absent sur le paramètre", "`spring-boot-starter-validation` absent du pom", "Pas de `@Valid` en cascade sur les objets imbriqués", "`javax` au lieu de `jakarta` après migration"],
  },
  {
    kind: "recall",
    id: "spring-rest-23",
    difficulty: 2,
    tags: ["rest", "validation", "conception"],
    prompt: "Quelle frontière traces-tu entre validation de format et validation métier ?",
    explanation:
      "La **validation de format** ne regarde que la requête : un champ est-il présent, bien typé, dans les bornes, syntaxiquement correct. Elle est déclarative, s'écrit avec `jakarta.validation` sur le DTO d'entrée, vit dans l'adapter REST et produit un **400**. Elle protège le système contre des requêtes inexploitables. La **validation métier** demande de connaître l'état du système : ce client existe-t-il, ce stock est-il suffisant, cette transition d'état est-elle permise. Elle vit dans le **domaine**, souvent dans les constructeurs des objets de valeur et les méthodes de l'agrégat, s'exprime en langage métier et produit un **409** ou un **422**. Le test qui départage : si la règle peut se vérifier sans rien lire en base, c'est du format.",
    keyPoints: ["Format : sur la requête seule, déclaratif, adapter REST, 400", "Métier : dépend de l'état, dans le domaine, 409/422", "Test : vérifiable sans accès aux données ?"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Erreurs homogènes et sérialisation
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-rest-l4",
  title: "Erreurs homogènes et sérialisation Jackson",
  blocks: [
    {
      kind: "text",
      text: "Une API doit renvoyer ses erreurs dans un format unique, quel que soit l'endpoint. Le traitement se centralise dans une classe `@RestControllerAdvice`, où chaque méthode `@ExceptionHandler` traduit un type d'exception en réponse HTTP. Les contrôleurs n'attrapent plus rien et restent lisibles.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un point unique de traduction exception → réponse HTTP.",
      code: `@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(OrderNotFound.class)
    public ProblemDetail notFound(OrderNotFound e) {
        var pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, e.getMessage());
        pd.setTitle("Commande introuvable");
        return pd;
    }

    @ExceptionHandler(
        MethodArgumentNotValidException.class)
    public ProblemDetail invalid(
            MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Requête invalide");
        pd.setProperty("errors",
            e.getBindingResult().getFieldErrors()
                .stream()
                .map(f -> f.getField() + " : "
                        + f.getDefaultMessage())
                .toList());
        return pd;
    }
}`,
    },
    {
      kind: "text",
      text: "`ProblemDetail`, introduit dans Spring 6, implémente la RFC 7807 : un corps normalisé avec `type`, `title`, `status`, `detail` et `instance`, plus des propriétés libres. Le contenu est servi en `application/problem+json`. Une règle absolue : ne jamais renvoyer la stack trace ni le message brut d'une exception technique, qui exposent la structure interne.",
    },
    {
      kind: "text",
      text: "Côté sérialisation, quelques annotations Jackson suffisent : `@JsonProperty` renomme un champ, `@JsonIgnore` l'exclut, `@JsonFormat` fixe le format d'une date, et `@JsonInclude(NON_NULL)` retire les champs nuls de la réponse. Elles se posent sur les DTO, jamais sur les entités.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "Un `@ExceptionHandler(Exception.class)` de dernier recours, qui journalise la cause complète et ne renvoie qu'un 500 générique : le diagnostic reste dans les journaux, le client n'obtient rien d'exploitable.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-rest-24",
    difficulty: 1,
    tags: ["rest", "exception-handling"],
    prompt: "À quoi sert `@RestControllerAdvice` ?",
    choices: [
      "Centraliser la traduction des exceptions en réponses HTTP pour tous les contrôleurs.",
      "Déclarer des filtres de sécurité appliqués avant les contrôleurs.",
      "Activer la validation `jakarta.validation` sur l'ensemble de l'application.",
      "Mettre en cache les réponses des contrôleurs annotés.",
    ],
    answer: 0,
    explanation:
      "`@RestControllerAdvice` = `@ControllerAdvice` + `@ResponseBody`. Ses méthodes `@ExceptionHandler` s'appliquent à tous les contrôleurs, ce qui garantit un format d'erreur homogène et évite les `try/catch` répétés. Elle sert aussi à `@ModelAttribute` et `@InitBinder` globaux, mais pas à la sécurité ni au cache.",
  },
  {
    kind: "output",
    id: "spring-rest-25",
    difficulty: 2,
    tags: ["rest", "exception-handling", "codes-http"],
    prompt: "Sans aucun `@RestControllerAdvice`, que renvoie l'appel si `orElseThrow()` lève une `NoSuchElementException` ?",
    code: {
      language: "java",
      code: `@GetMapping("/{id}")
public OrderDto get(@PathVariable String id) {
    return repository.findById(id)
        .map(OrderDto::from)
        .orElseThrow();
}`,
    },
    choices: [
      "500 Internal Server Error : une exception non traitée devient une erreur serveur.",
      "404 Not Found : Spring reconnaît `NoSuchElementException`.",
      "204 No Content, le corps étant vide.",
      "200 OK avec un corps `null`.",
    ],
    answer: 0,
    explanation:
      "Aucune correspondance automatique n'existe entre `NoSuchElementException` et 404 : Spring traite toute exception non gérée en 500. Il faut soit lever une exception métier traduite par un `@ExceptionHandler`, soit annoter cette exception avec `@ResponseStatus(HttpStatus.NOT_FOUND)`, soit construire la réponse dans le contrôleur avec `ResponseEntity.notFound()`.",
  },
  {
    kind: "fill",
    id: "spring-rest-26",
    difficulty: 2,
    tags: ["rest", "exception-handling", "problem-detail"],
    prompt: "Complète ce gestionnaire global.",
    code: {
      language: "java",
      code: `@{{1}}
public class ApiExceptionHandler {

    @{{2}}(StockInsuffisant.class)
    public ProblemDetail conflict(
            StockInsuffisant e) {
        return ProblemDetail
            .forStatusAndDetail(
                HttpStatus.{{3}},
                e.getMessage());
    }
}`,
    },
    blanks: ["RestControllerAdvice", "ExceptionHandler", "CONFLICT"],
    distractors: ["RestController", "ResponseStatus", "NOT_FOUND", "BAD_REQUEST", "Valid"],
    explanation:
      "`@RestControllerAdvice` déclare la classe transverse, `@ExceptionHandler` associe une méthode à un type d'exception. Un stock insuffisant est un conflit avec l'état actuel de la ressource : **409**. Un 400 dirait à tort que la requête est mal formée, alors qu'elle est parfaitement valide.",
  },
  {
    kind: "spot",
    id: "spring-rest-27",
    difficulty: 2,
    tags: ["rest", "exception-handling", "securite"],
    prompt: "Ce gestionnaire expose la structure interne de l'application aux clients. Trouve la ligne fautive.",
    code: {
      language: "java",
      code: `@ExceptionHandler(Exception.class)
public ResponseEntity<String> handle(Exception e) {
    return ResponseEntity
        .status(500)
        .body(Arrays.toString(e.getStackTrace()));
}`,
    },
    faultyLine: 5,
    reasons: [
      "La stack trace part au client : elle révèle les paquets, les frameworks et leurs versions, et n'aide en rien l'appelant.",
      "`ResponseEntity<String>` ne peut pas porter un corps sur un statut 500.",
      "Un `@ExceptionHandler` ne peut pas viser `Exception.class`.",
      "Le statut doit être passé par `@ResponseStatus`, pas par `status(500)`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Une stack trace est une information de diagnostic interne : elle appartient aux journaux du serveur, jamais à la réponse. Elle donne à un attaquant la cartographie des dépendances et de leurs versions. Le bon réflexe : `log.error(\"…\", e)` côté serveur, et un `ProblemDetail` générique côté client, éventuellement avec un identifiant de corrélation.",
  },
  {
    kind: "match",
    id: "spring-rest-28",
    difficulty: 2,
    tags: ["rest", "jackson"],
    prompt: "Associe chaque annotation Jackson à son effet.",
    pairs: [
      { left: "`@JsonProperty(\"created_at\")`", right: "Renomme le champ dans le JSON" },
      { left: "`@JsonIgnore`", right: "Exclut le champ de la sérialisation" },
      { left: "`@JsonFormat(pattern = \"dd/MM/yyyy\")`", right: "Fixe le format d'une date" },
      { left: "`@JsonInclude(NON_NULL)`", right: "Omet les champs valant `null`" },
    ],
    explanation:
      "Ces annotations agissent sur le contrat externe. Les poser sur un DTO est sain ; les poser sur une entité JPA mélange persistance et présentation, et c'est le premier symptôme d'une entité exposée à tort.",
  },
  {
    kind: "recall",
    id: "spring-rest-29",
    difficulty: 2,
    tags: ["rest", "problem-detail", "exception-handling"],
    prompt: "Qu'est-ce que `ProblemDetail`, et qu'apporte-t-il par rapport à un format d'erreur maison ?",
    explanation:
      "`ProblemDetail` est l'implémentation Spring 6 de la **RFC 7807**, une norme de format d'erreur pour les API HTTP. Le corps contient `type` (une URI qui identifie le genre de problème), `title` (un libellé court et stable), `status` (le code HTTP), `detail` (le message pour ce cas précis) et `instance` (l'URI concernée), plus des propriétés libres via `setProperty`, par exemple la liste des champs invalides. Le type de contenu est `application/problem+json`. L'intérêt sur un format maison : les clients et les outils savent déjà le lire, il évite de réinventer une structure par projet, il est identique pour tous les endpoints, et Spring l'intègre nativement dans `ResponseEntityExceptionHandler`. Il reste extensible pour les besoins spécifiques.",
    keyPoints: ["RFC 7807, `application/problem+json`", "type, title, status, detail, instance", "Propriétés libres via `setProperty`", "Standard reconnu, intégré à Spring 6"],
  },
  {
    kind: "recall",
    id: "spring-rest-30",
    difficulty: 3,
    tags: ["rest", "cors"],
    prompt: "Un front sur `localhost:5173` appelle une API sur `localhost:8080` et le navigateur bloque la réponse. Que se passe-t-il et comment le corriger ?",
    explanation:
      "C'est la **politique de même origine** : deux origines diffèrent dès que le schéma, l'hôte ou le **port** diffère, donc `5173` et `8080` sont des origines distinctes. Le navigateur envoie la requête mais refuse à la page d'en lire la réponse tant que le serveur n'a pas renvoyé les en-têtes CORS attendus, en premier lieu `Access-Control-Allow-Origin`. Pour les requêtes dites non simples, verbe `PUT` ou `DELETE`, en-tête `Content-Type: application/json`, ou en-tête d'autorisation, le navigateur envoie d'abord une requête **préliminaire** `OPTIONS` à laquelle le serveur doit répondre en listant méthodes et en-têtes autorisés. Correction côté serveur : `@CrossOrigin` sur le contrôleur pour un cas isolé, ou une configuration globale via `WebMvcConfigurer.addCorsMappings`, en listant explicitement les origines. Avec Spring Security, la configuration CORS doit être connue de la chaîne de filtres, sinon la requête préliminaire est rejetée avant d'atteindre le contrôleur. À ne pas confondre avec la CSRF, qui protège d'un tout autre risque.",
    keyPoints: ["Origine = schéma + hôte + port", "Le navigateur bloque, pas le serveur", "Préliminaire OPTIONS pour les requêtes non simples", "`@CrossOrigin` ou `addCorsMappings`", "À configurer aussi dans Spring Security"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-rest",
  title: "REST : contrôleurs, DTO, validation, erreurs",
  objective:
    "Écrire un contrôleur qui renvoie les bons codes HTTP, exposer des DTO plutôt que des entités, valider les entrées et centraliser les erreurs en ProblemDetail.",
  prerequisites: ["spring-ioc"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
