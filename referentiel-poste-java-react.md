# Référentiel complet — Poste Java / Spring Boot / React / Postgres

> Objectif : entretien technique **et** opérationnalité à la prise de poste.
> Fil rouge : une API de gestion de commandes, refactorée module après module.
> Règle : tu écris le code d'abord, relecture ensuite.

Légende de priorité :
- **P1** = tombe en entretien / utilisé tous les jours. Non négociable.
- **P2** = attendu d'un dev confirmé, à savoir expliquer.
- **P3** = culture technique, à connaître de nom et savoir situer.

---

## 1. Java (langage)

### 1.1 Fondamentaux — P1
- Types primitifs vs wrappers, autoboxing et ses pièges (`==` sur `Integer`, cache -128/127)
- `String` : immuabilité, pool de constantes, `StringBuilder`, `equals` vs `==`
- Passage par valeur (Java n'a pas de passage par référence, y compris pour les objets)
- `final` sur variable, paramètre, champ, méthode, classe
- Portée des variables, blocs statiques, ordre d'initialisation

### 1.2 POO — P1
- Classes, interfaces, classes abstraites : quand utiliser quoi
- Héritage vs composition (et pourquoi la composition est presque toujours préférable)
- Polymorphisme, surcharge (overload, résolue à la compilation) vs redéfinition (override, au runtime)
- Encapsulation, modificateurs d'accès, package-private
- Contrat `equals`/`hashCode` : les 5 règles, ce qui casse une `HashMap`
- `toString`, `Comparable` vs `Comparator`
- Interfaces : méthodes `default`, `static`, `private`
- Classes internes, anonymes, `record`, `enum` (avec champs et méthodes)

### 1.3 Collections — P1
- `List` / `Set` / `Map` / `Queue` : contrats et implémentations
- `ArrayList` vs `LinkedList` : complexité réelle, pourquoi `LinkedList` est presque toujours un mauvais choix
- `HashMap` : fonctionnement interne (buckets, hash, collisions, treeification depuis Java 8), facteur de charge
- `HashSet` vs `TreeSet` vs `LinkedHashSet`
- `Collections.unmodifiableList`, `List.of` : immuabilité
- Itération et `ConcurrentModificationException`

### 1.4 Exceptions — P1
- Checked vs unchecked, hiérarchie `Throwable`
- `try-with-resources`, `AutoCloseable`
- Quand créer une exception métier custom
- Anti-patterns : catch vide, catch `Exception`, exception comme flux de contrôle

### 1.5 Java moderne (8 → 21) — P1
- Lambdas et interfaces fonctionnelles (`Function`, `Supplier`, `Consumer`, `Predicate`, `BiFunction`)
- Références de méthode
- Stream API : `map`, `filter`, `flatMap`, `reduce`, `collect`, `groupingBy`, `partitioningBy`
- Streams paresseux : opérations intermédiaires vs terminales
- `Optional` : usage correct, pourquoi jamais en paramètre ou en champ
- `var` (Java 10)
- Text blocks (15), `record` (16), `sealed` (17), pattern matching pour `switch` et `instanceof` (21)
- API date/heure : `LocalDate`, `LocalDateTime`, `Instant`, `ZonedDateTime`, `Duration`, `Period`

### 1.6 Concurrence — P2
- `Thread`, `Runnable`, `Callable`, `Future`, `CompletableFuture`
- `ExecutorService` et pools de threads
- `synchronized`, `volatile`, `AtomicInteger`
- Collections concurrentes : `ConcurrentHashMap`, `CopyOnWriteArrayList`
- Race condition, deadlock : savoir en décrire un
- Virtual threads (Java 21) : principe et intérêt

### 1.7 JVM — P2
- Mémoire : heap, stack, metaspace
- Garbage collection : générations, principe des GC modernes (G1, ZGC)
- `OutOfMemoryError` vs `StackOverflowError`
- Classloading, bytecode, JIT (niveau culture)

---

## 2. Spring Boot

### 2.1 Cœur du framework — P1
- IoC / injection de dépendances, conteneur de beans
- `@Component`, `@Service`, `@Repository`, `@Configuration`, `@Bean`
- Injection par constructeur (et pourquoi pas par champ)
- Scopes : singleton (défaut), prototype, request, session
- Cycle de vie d'un bean, `@PostConstruct`, `@PreDestroy`
- Component scan : ce qui est scanné, ce qui ne l'est pas
- `@Qualifier`, `@Primary`, injection de `List<Interface>`
- Dépendances circulaires : détection et résolution
- Auto-configuration : mécanisme, `@ConditionalOnMissingBean`, comment la désactiver
- Starters : ce que contient réellement `spring-boot-starter-web`

### 2.2 Configuration — P1
- `application.yml` / `.properties`
- Profils (`dev`, `test`, `prod`), `@Profile`
- `@Value` vs `@ConfigurationProperties` (préférer le second)
- Ordre de précédence des sources de configuration (arguments, env, fichier…)
- Externalisation des secrets, variables d'environnement

### 2.3 Web / REST — P1
- `@RestController`, `@RequestMapping` et dérivés
- `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`
- `ResponseEntity` et codes HTTP corrects (200/201/204/400/401/403/404/409/422/500)
- DTO vs entité : pourquoi ne jamais exposer l'entité JPA
- Mapping : MapStruct ou mapping manuel
- Validation : `@Valid`, `@NotNull`, `@Size`, `@Email`, contraintes custom
- Gestion globale des erreurs : `@RestControllerAdvice`, `@ExceptionHandler`, format d'erreur homogène (RFC 7807 / ProblemDetail)
- Sérialisation Jackson : `@JsonProperty`, `@JsonIgnore`, `@JsonFormat`, sérialiseurs custom
- CORS
- Pagination et tri (`Pageable`), filtrage
- Versioning d'API
- Documentation OpenAPI / springdoc

### 2.4 Données — P1
- `spring-data-jpa` : `JpaRepository`, `CrudRepository`
- Query methods dérivées du nom
- `@Query` (JPQL et natif), `@Modifying`
- `Specification` / Criteria API pour la recherche dynamique
- Projections (interface et classe)
- Transactions : `@Transactional`, propagation, isolation, rollback, pourquoi ça ne marche pas sur un appel interne à la même classe

### 2.5 Sécurité — P2
- Spring Security : chaîne de filtres, `SecurityFilterChain`
- Authentification vs autorisation
- JWT : structure, signature, validation, stockage côté client
- OAuth2 / OpenID Connect : rôles des acteurs, flow authorization code
- `@PreAuthorize`, rôles et authorities
- Hachage de mot de passe (BCrypt), CSRF, CORS vs CSRF

### 2.6 Le reste — P2/P3
- Actuator : health, metrics, info, endpoints à ne pas exposer
- Logging : SLF4J + Logback, niveaux, logs structurés, MDC / correlation id
- Cache : `@Cacheable`, `@CacheEvict`
- `@Scheduled`, `@Async`
- `RestClient` / `WebClient` pour appeler une API externe
- Spring Events
- AOP : `@Aspect`, cas d'usage réels
- Notions : Spring Batch, Spring Cloud, messaging (Kafka / RabbitMQ)

---

## 3. Base de données / Postgres

### 3.1 SQL — P1
- SELECT, WHERE, ORDER BY, LIMIT/OFFSET
- Jointures : INNER, LEFT, RIGHT, FULL, CROSS, self-join
- Agrégations, GROUP BY, HAVING
- Sous-requêtes, CTE (`WITH`), CTE récursives
- Fonctions fenêtre : `ROW_NUMBER`, `RANK`, `LAG`, `LEAD`, `OVER (PARTITION BY …)`
- UPSERT (`ON CONFLICT`)
- Types Postgres : `serial`/`identity`, `uuid`, `jsonb`, `text[]`, `timestamptz`, `numeric`

### 3.2 Modélisation — P1
- Clés primaires et étrangères, contraintes (`UNIQUE`, `CHECK`, `NOT NULL`)
- Formes normales 1NF→3NF, et quand dénormaliser
- Relations 1-1, 1-N, N-N et leur traduction en tables

### 3.3 Performance — P2
- Index B-tree, index composites, ordre des colonnes
- Index partiels, index GIN pour `jsonb`
- `EXPLAIN ANALYZE` : savoir lire un plan (seq scan vs index scan)
- Coût d'un index en écriture

### 3.4 Transactions — P2
- ACID
- Niveaux d'isolation, dirty read / non-repeatable read / phantom read
- MVCC Postgres, VACUUM
- Verrouillage pessimiste vs optimiste (`@Version`)

### 3.5 JPA / Hibernate — P1
- `@Entity`, `@Table`, `@Id`, stratégies de génération (`IDENTITY`, `SEQUENCE`)
- `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@JoinColumn`, `mappedBy`
- FetchType LAZY vs EAGER
- **Problème N+1** : le détecter, le corriger (`JOIN FETCH`, `@EntityGraph`, batch size)
- Cycle de vie d'une entité : transient, managed, detached, removed
- Persistence context, dirty checking, `flush`
- Cascade et `orphanRemoval`
- `LazyInitializationException` : cause et solutions
- `equals`/`hashCode` sur une entité JPA
- Migrations : Flyway ou Liquibase, versioning, rollback, migrations en équipe

---

## 4. Architecture hexagonale

### 4.1 Principes — P1
- Ports & adapters : l'origine et le problème résolu
- Le domaine ne dépend de rien : ni Spring, ni JPA, ni HTTP
- Inversion de dépendance (le D de SOLID) : le domaine définit l'interface, l'infra l'implémente
- Ports entrants (use cases) vs ports sortants (repositories, clients externes)
- Adapters primaires (REST, CLI, batch) vs secondaires (JPA, HTTP, file)
- Application layer / use cases : orchestration, transactions, pas de règle métier

### 4.2 Mise en œuvre — P1
- Découpage en packages (ou modules Maven) `domain` / `application` / `infrastructure`
- Modèle de domaine vs entité JPA : deux classes distinctes, et le mapper entre les deux
- Où placer `@Transactional`
- Où placer la validation métier vs la validation de format
- Le coût du pattern : quand il est disproportionné

### 4.3 Autour — P2
- Clean Architecture, Onion Architecture : les différences réelles
- SOLID, les 5 principes avec un exemple chacun
- DDD tactique : entité, value object, agrégat, racine d'agrégat, repository, domain service, domain event
- DDD stratégique : bounded context, ubiquitous language (niveau culture)
- Patterns GoF utiles : Strategy, Factory, Builder, Adapter, Decorator, Observer, Template Method
- Anti-patterns : anemic domain model, god class, service qui appelle service en cascade

---

## 5. TDD & tests

### 5.1 TDD — P1
- Cycle red / green / refactor, et pourquoi l'ordre compte
- Baby steps, écrire le test qui échoue en premier
- Ce que TDD change sur le design (testabilité = faible couplage)
- Limites : quand TDD n'apporte rien
- Savoir faire une démo TDD en live coding, c'est l'exercice classique en entretien

### 5.2 Outils — P1
- JUnit 5 : `@Test`, `@BeforeEach`, `@ParameterizedTest`, `@Nested`, `@DisplayName`, `assertThrows`
- AssertJ : assertions fluides, `assertThat(...).extracting(...)`
- Mockito : `@Mock`, `when/thenReturn`, `verify`, `ArgumentCaptor`, `@InjectMocks`
- Mock vs stub vs fake vs spy : savoir les distinguer
- Ce qu'il ne faut pas mocker (les types que tu ne possèdes pas, les value objects)

### 5.3 Tests Spring — P1
- `@SpringBootTest` (lourd) vs slices `@WebMvcTest`, `@DataJpaTest`
- `MockMvc` pour tester un contrôleur
- `@MockBean` / `@MockitoBean`
- **Testcontainers** : Postgres réel dans les tests d'intégration, `@ServiceConnection`
- Jeux de données de test, isolation entre tests

### 5.4 Stratégie — P2
- Pyramide des tests, et la critique du "testing trophy"
- Tests unitaires du domaine sans aucun framework (c'est là que l'hexagonal paye)
- Couverture : JaCoCo, pourquoi 100% n'est pas un objectif
- Mutation testing (PIT)
- Tests de contrat, tests end-to-end
- Nommage des tests, structure Given/When/Then

---

## 6. React & front

### 6.1 JavaScript / TypeScript — P1
- ES6+ : destructuring, spread, arrow functions, modules, template literals
- Asynchrone : Promise, `async/await`, event loop
- `map` / `filter` / `reduce`
- Immuabilité et pourquoi elle est centrale en React
- TypeScript : types, interfaces, génériques, unions, `unknown` vs `any`, typage des props

### 6.2 React — P1
- JSX, composants fonctionnels, props, rendu conditionnel, listes et clés
- `useState`, `useEffect` (et le tableau de dépendances), `useRef`, `useMemo`, `useCallback`, `useContext`, `useReducer`
- Règles des hooks
- Cycle de vie et re-renders : ce qui déclenche un rendu
- Hooks custom
- Lifting state up, composition
- Formulaires contrôlés vs non contrôlés
- Gestion d'état : Context, Redux Toolkit, Zustand — savoir choisir
- Data fetching : React Query / TanStack Query, cache, états loading/error
- Routing : React Router
- Error boundaries

### 6.3 Écosystème — P2
- Vite, build, variables d'environnement
- Tests : Vitest / Jest + React Testing Library, tester le comportement pas l'implémentation
- ESLint, Prettier
- Appels API, intercepteurs, gestion du token
- Accessibilité de base, responsive

---

## 7. Docker

### 7.1 Bases — P1
- Image vs conteneur vs volume vs réseau
- Différence avec une VM
- Commandes : `run`, `exec`, `logs`, `ps`, `build`, `images`, `rm`, `rmi`
- Dockerfile : `FROM`, `WORKDIR`, `COPY`, `RUN`, `ENV`, `ARG`, `EXPOSE`, `CMD` vs `ENTRYPOINT`
- Couches et cache de build : ordre des instructions
- `.dockerignore`

### 7.2 Bonnes pratiques Java — P1
- **Build multi-stage** : compilation Maven puis image d'exécution JRE seule
- Images de base : `eclipse-temurin`, distroless, Alpine et le piège de la libc
- Utilisateur non-root
- Layered jars Spring Boot
- Réglages JVM en conteneur (respect des limites cgroup)
- Healthcheck

### 7.3 Compose — P1
- `docker-compose.yml` : services, `depends_on`, `healthcheck`, volumes, networks
- Stack app + Postgres pour le développement local
- Variables d'environnement et fichier `.env`
- Persistance des données Postgres

### 7.4 Registry — P2
- Tags et versioning d'image
- Push / pull, registry GitLab
- Notions de sécurité : scan de vulnérabilités, taille d'image

---

## 8. Git & GitLab CI

### 8.1 Git — P1
- Zone de staging, commit, branches, merge vs rebase
- Résolution de conflits
- `cherry-pick`, `stash`, `reset` (soft/mixed/hard), `revert`, `reflog`
- Bisect (au moins savoir ce que c'est)
- Stratégies : GitFlow, trunk-based, GitHub flow
- Convention de commits, messages utiles
- Merge requests, revue de code : ce qu'on regarde

### 8.2 GitLab CI — P1
- `.gitlab-ci.yml` : `stages`, `jobs`, `script`, `image`, `rules` / `only`
- Runners, exécuteurs
- Cache (dépendances Maven, node_modules) vs artifacts : la différence
- Variables CI, variables protégées et masquées
- Pipeline type : build → test → quality → package (image Docker) → deploy
- Services (Postgres pour les tests d'intégration)
- `needs`, pipelines parallèles, `dind` ou Kaniko pour builder une image
- Environnements, déploiement manuel, rollback

### 8.3 Qualité — P2
- SonarQube / SonarCloud, quality gate
- Analyse statique, dette technique
- Semantic versioning

---

## 9. Transverse

### 9.1 HTTP & API — P1
- Méthodes, idempotence, sémantique des codes de statut
- Headers usuels, content negotiation
- REST : ressources, statelessness, niveaux de maturité de Richardson
- Authentification : Bearer token, cookies
- Notions : GraphQL, gRPC, WebSocket, SSE

### 9.2 Architecture applicative — P2
- Monolithe vs microservices : arbitrage réel, pas dogmatique
- Monolithe modulaire
- Communication synchrone vs asynchrone, messaging
- Idempotence, retry, circuit breaker, timeout
- Cohérence éventuelle, saga (culture)
- Cache : niveaux, invalidation
- Observabilité : logs, métriques, traces

### 9.3 Méthode — P2
- Agile / Scrum : rituels, rôles, ce que ça change concrètement
- Estimation, découpage de tickets
- Code review, pair programming
- Documentation : ADR (architecture decision record), README utile

### 9.4 Entretien — P1
- Présenter un projet passé : contexte, ton rôle, décisions techniques, ce que tu referais autrement
- Expliquer un choix d'architecture et ses compromis
- Live coding : verbaliser ton raisonnement
- Questions à poser à l'équipe (stack, tests, déploiement, dette, organisation)

---

## Ordre de traitement retenu (4 semaines)

| Semaine | Bloc | Sections |
|---|---|---|
| 1 | Socle | 1 (Java), 2.1→2.4 (Spring), 3 (SQL/JPA) |
| 2 | Outillage & tests | 7 (Docker), 5 (TDD) |
| 3 | Conception | 4 (Hexagonal), refactor du fil rouge, 2.5 (sécurité) |
| 4 | Livraison & front | 8 (Git/GitLab CI), 6 (React), 9 (transverse + entretien) |

Chaque section = leçon courte, puis exercice sur le fil rouge, puis QCM. Passage à la suite à partir de 8/10.
