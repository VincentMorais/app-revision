/**
 * Spring — Sécurité (référentiel 2.5).
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — La sécurité est un filtre, pas une ligne dans le contrôleur
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-sec-l1",
  title: "La sécurité est un filtre, pas une ligne dans le contrôleur",
  blocks: [
    {
      kind: "text",
      text: "Un contrôleur a un seul métier : traiter une requête dont il sait déjà qu'elle a le droit d'exister. Le jour où il doit aussi vérifier **qui** appelle, deux choses se produisent. La vérification est copiée dans chaque méthode, et un jour quelqu'un oublie de la copier. Cet oubli ne casse aucun test : la fonctionnalité marche, elle est simplement ouverte à tout le monde. C'est le pire type de bug, celui qui ne se voit pas.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Sans sécurité centralisée : la vérification est partout, donc nulle part.",
      code: `@RestController
class InvoiceController {

    @GetMapping("/invoices/{id}")
    Invoice get(@PathVariable Long id, HttpSession session) {
        User u = (User) session.getAttribute("user");
        if (u == null) throw new UnauthorizedException();
        return service.find(id);
    }

    @DeleteMapping("/invoices/{id}")
    void delete(@PathVariable Long id) {
        // oubli : n'importe qui peut supprimer une facture
        service.delete(id);
    }
}`,
    },
    {
      kind: "text",
      text: "Spring Security prend le problème à l'envers : la décision est prise **avant** que le contrôleur existe, dans la couche servlet. Un unique filtre est enregistré auprès du conteneur, `springSecurityFilterChain`, porté par un `FilterChainProxy`. À chaque requête, ce proxy choisit la `SecurityFilterChain` qui correspond à l'URL, puis fait traverser à la requête une série de filtres ordonnés. Le contrôleur n'est atteint que si la chaîne entière a laissé passer.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La même règle, déclarée une fois pour toutes les URL.",
      code: `@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/invoices/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}`,
    },
    {
      kind: "text",
      text: "Chaque filtre de la chaîne a un rôle précis et un ordre fixe. Les premiers gèrent l'infrastructure : le contexte de sécurité, les en-têtes, le CSRF. Viennent ensuite les filtres d'authentification, qui cherchent une identité dans la requête — un cookie de session, un en-tête `Authorization` — et la déposent dans le contexte. Le dernier maillon, `AuthorizationFilter`, applique les règles déclarées dans `authorizeHttpRequests`. L'ordre n'est pas décoratif : on ne peut pas autoriser avant d'avoir authentifié.",
    },
    {
      kind: "comparison",
      title: "Filtre de sécurité et intercepteur Spring MVC",
      left: {
        label: "Filtre servlet (Spring Security)",
        text: "S'exécute avant le `DispatcherServlet`, donc avant tout routage. Protège aussi les URL qui ne correspondent à aucun contrôleur. Ne connaît ni le contrôleur ni la méthode visée : il ne voit qu'une requête HTTP.",
      },
      right: {
        label: "HandlerInterceptor (Spring MVC)",
        text: "S'exécute après le routage, une fois le contrôleur choisi. Connaît la méthode appelée, donc pratique pour du transverse métier (traces, mesures). Mauvais endroit pour la sécurité : ce qui n'est pas routé lui échappe.",
      },
    },
    {
      kind: "text",
      text: "Cette position a une conséquence qu'on découvre souvent dans la douleur : un `@RestControllerAdvice` ne rattrape pas les erreurs de sécurité. Quand un filtre refuse la requête, aucun contrôleur n'a été appelé, donc aucun gestionnaire d'exception de la couche MVC n'est dans le circuit. Le corps de la réponse 401 ou 403 est produit par la chaîne elle-même. Pour le personnaliser, on branche un `AuthenticationEntryPoint` ou un `AccessDeniedHandler`, pas un `@ExceptionHandler`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Dans `authorizeHttpRequests`, **la première règle qui correspond gagne**, et les suivantes ne sont jamais évaluées. Placer `anyRequest().authenticated()` avant une règle `permitAll` rend cette dernière inutile — Spring Security 6 refuse d'ailleurs de démarrer dans ce cas précis. Du général au particulier, on se retrouve à tout verrouiller ; on va donc toujours du plus spécifique au plus général.",
    },
    {
      kind: "text",
      text: "Rien n'oblige à n'avoir qu'une seule chaîne. On déclare plusieurs beans `SecurityFilterChain`, chacun restreint par un `securityMatcher`, et annotés `@Order` pour fixer leur priorité. Le `FilterChainProxy` retient la première dont le matcher accepte l'URL — et une seule : les chaînes ne se cumulent pas. C'est ainsi qu'une même application sert une API stateless sous `/api/**` et une interface à formulaires pour le reste.",
    },
    {
      kind: "text",
      text: "En pratique, une configuration se lit comme une liste de règles ordonnées, et se relit à voix haute : les URL publiques, puis celles réservées à un rôle, puis le reste qui exige simplement d'être authentifié. Toute la sécurité d'accès de l'application tient dans ce bean, à un seul endroit qu'on peut relire en entier avant une mise en production.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-sec-01",
    difficulty: 1,
    tags: ["securite", "filtres"],
    prompt: "Pourquoi un `@RestControllerAdvice` ne rattrape-t-il pas une erreur 401 émise par Spring Security ?",
    choices: [
      "Parce que le refus vient d'un filtre servlet, exécuté avant le `DispatcherServlet` : aucun contrôleur n'a été appelé.",
      "Parce que les exceptions de sécurité héritent de `Error` et non de `Exception`.",
      "Parce qu'il faut annoter la classe avec `@Order(HIGHEST_PRECEDENCE)` pour qu'elle voie ces exceptions.",
      "Parce que Spring Security remplace le `DispatcherServlet` par son propre servlet.",
    ],
    answer: 0,
    explanation:
      "La chaîne de filtres s'exécute en amont du routage MVC. Quand elle refuse la requête, il n'y a ni contrôleur ni gestionnaire d'exception MVC dans le circuit. Pour personnaliser la réponse, on fournit un `AuthenticationEntryPoint` (401) ou un `AccessDeniedHandler` (403) à la configuration.",
  },
  {
    kind: "order",
    id: "spring-sec-02",
    difficulty: 2,
    tags: ["securite", "filtres"],
    prompt: "Remets dans l'ordre le trajet d'une requête authentifiée.",
    items: [
      "Le conteneur servlet reçoit la requête et la passe au FilterChainProxy",
      "Le proxy sélectionne la SecurityFilterChain qui correspond à l'URL",
      "Un filtre d'authentification lit le cookie ou l'en-tête et peuple le SecurityContext",
      "AuthorizationFilter applique les règles de authorizeHttpRequests",
      "Le DispatcherServlet route enfin la requête vers le contrôleur",
    ],
    explanation:
      "L'authentification précède toujours l'autorisation : on ne peut pas décider si quelqu'un a le droit avant de savoir qui il est. Et l'ensemble se joue avant le `DispatcherServlet`, ce qui protège aussi les URL ne correspondant à aucun contrôleur.",
  },
  {
    kind: "recall",
    id: "spring-sec-03",
    difficulty: 2,
    tags: ["securite", "filtres"],
    prompt: "Pourquoi place-t-on les règles d'URL de la plus spécifique à la plus générale ?",
    explanation:
      "Parce que dans `authorizeHttpRequests`, la première règle qui correspond à la requête gagne et les suivantes ne sont pas évaluées. Si `anyRequest()` est déclaré en premier, il capte tout et les règles plus fines placées après deviennent mortes. Spring Security 6 détecte ce cas et refuse de démarrer, mais le raisonnement reste vrai pour deux motifs d'URL qui se recouvrent partiellement, où aucune erreur ne sera levée.",
    keyPoints: [
      "La première règle qui correspond décide, les suivantes sont ignorées",
      "Une règle générale placée en premier rend les suivantes inutiles",
      "Spring Security 6 refuse de démarrer si une règle suit `anyRequest()`",
      "Deux motifs qui se recouvrent ne déclenchent aucune erreur : à nous d'ordonner",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Authentication et SecurityContext : où vit l'identité
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-sec-l2",
  title: "Authentication et SecurityContext : où vit l'identité",
  blocks: [
    {
      kind: "text",
      text: "Une fois l'utilisateur reconnu, l'information doit voyager jusqu'au code métier. La solution naïve consiste à la passer de main en main, en paramètre, depuis le contrôleur jusqu'au service puis au dépôt. Chaque signature s'alourdit d'un argument technique qui n'a rien à faire dans le vocabulaire du domaine, et il suffit d'une couche intermédiaire écrite par quelqu'un d'autre pour perdre l'information.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'identité passée à la main : elle pollue toutes les signatures.",
      code: `// contrôleur
Invoice get(Long id, User currentUser) {
    return service.find(id, currentUser);
}

// service
Invoice find(Long id, User currentUser) {
    Invoice i = repo.findById(id).orElseThrow();
    audit.log(currentUser, "READ", id);   // encore lui
    return i;
}`,
    },
    {
      kind: "text",
      text: "Spring Security choisit le stockage ambiant. L'identité est déposée dans un `SecurityContext`, lui-même détenu par `SecurityContextHolder`, dont la stratégie par défaut est un `ThreadLocal`. Le thread qui traite la requête porte donc l'identité, et n'importe quelle méthode appelée dans ce thread peut la lire sans qu'on la lui passe. C'est le même mécanisme que celui utilisé par la gestion des transactions.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Lire l'utilisateur courant depuis n'importe où dans le thread.",
      code: `Authentication auth = SecurityContextHolder.getContext()
                                          .getAuthentication();

String login = auth.getName();              // "alice"
Object principal = auth.getPrincipal();     // souvent un UserDetails
boolean admin = auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

// Dans un contrôleur, on préfère l'injection :
@GetMapping("/me")
String me(Authentication auth) { return auth.getName(); }`,
    },
    {
      kind: "text",
      text: "L'objet `Authentication` porte trois choses. Le **principal** est l'utilisateur, le plus souvent un `UserDetails` produit par le chargement en base. Les **credentials** sont la preuve fournie, mot de passe ou jeton, effacées après vérification pour ne pas traîner en mémoire. Les **authorities** sont la liste des droits accordés, sous forme de chaînes. C'est sur cette dernière liste, et elle seule, que reposeront toutes les décisions d'autorisation.",
    },
    {
      kind: "comparison",
      title: "Deux propriétés qu'on confond",
      left: {
        label: "isAuthenticated()",
        text: "Vrai dès qu'une authentification a réussi. Attention : par défaut, un utilisateur anonyme est représenté par un `AnonymousAuthenticationToken`, qui répond lui aussi `true`. Tester cette méthode seule ne prouve donc pas qu'on a affaire à quelqu'un de connu.",
      },
      right: {
        label: "getAuthorities()",
        text: "La liste des droits, seule base des décisions. Un anonyme porte `ROLE_ANONYMOUS`. C'est ce que lisent `hasRole`, `hasAuthority` et `@PreAuthorize` : la question n'est jamais « es-tu connecté ? » mais « portes-tu ce droit ? ».",
      },
    },
    {
      kind: "text",
      text: "Le `ThreadLocal` a une limite qu'il faut connaître avant de se faire piéger : il ne suit pas les changements de thread. Un `@Async`, un `CompletableFuture`, un pool d'exécution quelconque démarrent sur un autre thread, où le contexte est vide. Le code qui lisait tranquillement l'utilisateur courant reçoit soudain `null`. Spring fournit pour cela `DelegatingSecurityContextExecutor` et la stratégie `MODE_INHERITABLETHREADLOCAL`, mais rien ne se propage automatiquement.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Ne jamais garder un `Authentication` dans un champ d'objet, un cache ou un singleton. Le contexte est vidé en fin de requête, et le thread est rendu au pool pour servir quelqu'un d'autre. Un `Authentication` conservé devient au mieux périmé, au pire l'identité d'un autre utilisateur appliquée à la requête en cours.",
    },
    {
      kind: "text",
      text: "Le principal n'est pas forcément le `UserDetails` de Spring : on implémente très souvent sa propre classe, pour y porter l'identifiant technique de l'utilisateur en plus de son login. `@AuthenticationPrincipal` injecte alors directement cet objet, typé, dans le contrôleur. Cela évite le double aller-retour classique — lire `auth.getName()`, puis recharger l'utilisateur en base à chaque requête pour obtenir son identifiant.",
    },
    {
      kind: "text",
      text: "En pratique, dans un contrôleur, on ne va presque jamais chercher le contexte à la main : on déclare un paramètre `Authentication`, `Principal`, ou une annotation `@AuthenticationPrincipal` pour recevoir directement le `UserDetails`. Spring le résout pour nous. `SecurityContextHolder` reste utile plus bas dans les couches, là où l'injection n'est pas disponible — un service d'audit, un écouteur d'événement, un convertisseur appelé par la sérialisation.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-sec-04",
    difficulty: 2,
    tags: ["securite", "authentification"],
    prompt: "Dans une méthode annotée `@Async`, `SecurityContextHolder.getContext().getAuthentication()` renvoie `null`. Pourquoi ?",
    choices: [
      "La stratégie par défaut est un `ThreadLocal` : la méthode s'exécute sur un autre thread, où le contexte est vide.",
      "Le contexte est effacé dès qu'une méthode asynchrone démarre, par sécurité.",
      "`@Async` exige d'être combiné à `@PreAuthorize` pour que le contexte soit peuplé.",
      "Le contexte n'existe que dans les classes annotées `@RestController`.",
    ],
    answer: 0,
    explanation:
      "`SecurityContextHolder` stocke le contexte dans un `ThreadLocal`, attaché au thread qui traite la requête. Un `@Async` s'exécute sur un thread du pool, qui n'a jamais rien reçu. Il faut propager explicitement, par exemple avec `DelegatingSecurityContextExecutor` ou la stratégie `MODE_INHERITABLETHREADLOCAL`.",
  },
  {
    kind: "fill",
    id: "spring-sec-05",
    difficulty: 1,
    tags: ["securite", "authentification"],
    prompt: "Complète la lecture de l'utilisateur courant hors d'un contrôleur.",
    code: {
      language: "java",
      code: `Authentication auth = {{1}}.getContext()
                                  .getAuthentication();
String login = auth.{{2}}();`,
    },
    blanks: ["SecurityContextHolder", "getName"],
    distractors: ["SecurityFilterChain", "AuthenticationManager", "getUsername", "getLogin"],
    explanation:
      "`SecurityContextHolder` est le point d'accès statique au contexte du thread courant. Sur `Authentication`, la méthode qui renvoie l'identifiant sous forme de `String` est `getName()` : `getUsername()` appartient à `UserDetails`, pas à `Authentication`, et `getLogin()` n'existe pas.",
  },
  {
    kind: "recall",
    id: "spring-sec-06",
    difficulty: 2,
    tags: ["securite", "authentification"],
    prompt: "Que contient un objet `Authentication`, et lequel de ses éléments sert aux décisions d'autorisation ?",
    explanation:
      "Il porte le **principal** (l'utilisateur, souvent un `UserDetails`), les **credentials** (la preuve fournie, effacée après vérification pour ne pas rester en mémoire) et les **authorities** (la liste des droits). Ce sont les authorities, et elles seules, qui servent aux décisions : `hasRole`, `hasAuthority` et `@PreAuthorize` ne regardent que cette liste. La question posée n'est jamais « est-il connecté ? » mais « porte-t-il ce droit ? » — d'autant qu'un utilisateur anonyme répond `true` à `isAuthenticated()`.",
    keyPoints: [
      "principal : l'utilisateur, souvent un UserDetails",
      "credentials : la preuve, effacée après vérification",
      "authorities : la liste des droits",
      "Seules les authorities décident de l'autorisation",
      "Un anonyme répond true à isAuthenticated()",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Stocker un mot de passe : BCrypt et le facteur de coût
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-sec-l3",
  title: "Stocker un mot de passe : BCrypt et le facteur de coût",
  blocks: [
    {
      kind: "text",
      text: "Une base de données finit toujours par fuir : sauvegarde égarée, injection SQL, prestataire compromis. La question n'est donc pas d'empêcher la fuite mais de la rendre inoffensive. Stocker les mots de passe en clair donne à l'attaquant non seulement votre application, mais la messagerie et la banque de tous les utilisateurs qui ont réemployé le même mot de passe. C'est de très loin la faute la plus coûteuse de cette liste.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux mauvaises réponses, dont une qui a l'air sérieuse.",
      code: `// 1. en clair : catastrophique
user.setPassword(raw);

// 2. haché en SHA-256 : rapide, donc cassable
user.setPassword(sha256(raw));

// Un GPU calcule des milliards de SHA-256 par seconde.
// Deux utilisateurs ayant le même mot de passe ont la même
// empreinte : une seule table pré-calculée les casse tous.`,
    },
    {
      kind: "text",
      text: "SHA-256 est une bonne fonction de hachage, mais pour un autre usage : il est conçu pour être **rapide**, ce qui est exactement le défaut recherché ici. Un mot de passe doit être haché par une fonction lente et paramétrable, dite de dérivation de clé. BCrypt en est une : elle intègre un sel aléatoire, et un facteur de coût qui multiplie le travail par deux à chaque incrément.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'encodeur, et la forme de ce qui part en base.",
      code: `@Bean
PasswordEncoder passwordEncoder() {
    // Délègue selon le préfixe stocké : {bcrypt}, {argon2}, {noop}…
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}

// À l'inscription
user.setPassword(encoder.encode(raw));

// En base :
// {bcrypt}$2a$10$N9qo8uLOickgx2ZMRZoMye1VdLm2sK4Bx5S1Xk3TzQ6oK1S9WYxfa
//          ^^   ^^ ^^^^^^^^^^^^^^^^^^^^^^ sel (22 car.)  puis empreinte
//          |    coût : 2^10 itérations
//          version de l'algorithme

// À la connexion : jamais de comparaison de chaînes
if (encoder.matches(raw, user.getPassword())) { ... }`,
    },
    {
      kind: "text",
      text: "Le sel est **dans** l'empreinte, ce qui explique une propriété déroutante : encoder deux fois le même mot de passe donne deux chaînes différentes. C'est normal et souhaitable — deux utilisateurs avec le même mot de passe n'ont pas la même empreinte, et une table pré-calculée ne sert plus à rien. C'est aussi pourquoi on ne compare jamais deux empreintes avec `equals` : seul `matches(raw, stocké)` sait relire le sel pour refaire le calcul.",
    },
    {
      kind: "comparison",
      title: "Deux fonctions, deux métiers",
      left: {
        label: "SHA-256 — hachage rapide",
        text: "Pour vérifier l'intégrité d'un fichier ou signer un jeton. Des milliards d'opérations par seconde sur du matériel courant, pas de sel, résultat déterministe. Utilisée pour un mot de passe, cette vitesse travaille pour l'attaquant.",
      },
      right: {
        label: "BCrypt — dérivation de clé",
        text: "Pour stocker un secret réutilisable. Lente et réglable : le coût 10 vaut 2¹⁰ itérations, le coût 11 en vaut le double. Sel intégré, résultat non déterministe. On augmente le coût au fil des années, à mesure que le matériel progresse.",
      },
    },
    {
      kind: "text",
      text: "Le facteur de coût est un curseur entre sécurité et temps de réponse. Une valeur trop basse rend l'attaque hors ligne réaliste ; trop haute, chaque connexion mobilise le processeur du serveur pendant des centaines de millisecondes, et une rafale de connexions devient un déni de service que vous vous infligez. On règle ce coût pour tenir autour de cent millisecondes sur le matériel de production, puis on le réévalue tous les deux ou trois ans.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Migrer sans casser les comptes",
      text: "Le `DelegatingPasswordEncoder` lit le préfixe `{bcrypt}` de chaque empreinte et choisit l'algorithme correspondant. On peut donc changer d'algorithme ou de coût sans invalider les comptes existants : les anciennes empreintes restent vérifiables, et l'on ré-encode chaque mot de passe au format courant à la prochaine connexion réussie — c'est ce que fait `UserDetailsPasswordService`.",
    },
    {
      kind: "text",
      text: "Une particularité de BCrypt surprend quand on la découvre : l'algorithme ne prend en compte que les **72 premiers octets** de l'entrée. Au-delà, tout est ignoré silencieusement, et deux phrases de passe très longues partageant leur début deviennent équivalentes. En octets, pas en caractères : un mot de passe riche en accents ou en emoji atteint la limite plus vite qu'il n'y paraît. Argon2 n'a pas cette contrainte.",
    },
    {
      kind: "text",
      text: "Reste une règle qui n'a rien de technique : un mot de passe ne doit jamais apparaître dans un journal, une trace d'exception ou une URL. C'est pour cela que Spring Security efface les credentials de l'objet `Authentication` après vérification. Un `System.out.println` bien intentionné pendant une session de débogage suffit à annuler tout le travail décrit dans cette leçon.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-sec-07",
    difficulty: 2,
    tags: ["securite", "mot-de-passe"],
    prompt: "Pourquoi `encoder.encode(\"secret\")` renvoie-t-il une chaîne différente à chaque appel ?",
    choices: [
      "Parce qu'un sel aléatoire est tiré à chaque encodage et stocké dans l'empreinte elle-même.",
      "Parce que l'empreinte contient l'horodatage de l'encodage.",
      "Parce que BCrypt utilise une clé secrète de l'application, régénérée à chaque appel.",
      "C'est un bug : deux appels sur la même entrée doivent donner le même résultat.",
    ],
    answer: 0,
    explanation:
      "BCrypt tire un sel aléatoire et l'inscrit dans la chaîne produite, juste après le facteur de coût. Deux utilisateurs partageant le même mot de passe ont donc des empreintes différentes, ce qui rend les tables pré-calculées inutiles. C'est aussi pourquoi la vérification passe par `matches(raw, stocké)` et jamais par `equals` : seul `matches` sait relire le sel.",
  },
  {
    kind: "spot",
    id: "spring-sec-08",
    difficulty: 2,
    tags: ["securite", "mot-de-passe"],
    prompt: "Une faille s'est glissée dans cette inscription. Quelle ligne, et pourquoi ?",
    code: {
      language: "java",
      code: `@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
}

public void register(String login, String raw) {
    User u = new User(login, raw);
    repo.save(u);
    log.info("Inscription de {}", login);
}`,
    },
    faultyLine: 7,
    reasons: [
      "Le mot de passe est passé en clair au constructeur : `encoder.encode(raw)` n'est jamais appelé.",
      "Le facteur de coût 10 est trop faible pour du BCrypt.",
      "Le login devrait être normalisé en minuscules avant l'enregistrement.",
      "La trace de journal expose l'inscription d'un utilisateur.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un `PasswordEncoder` déclaré ne sert à rien tant qu'on ne l'appelle pas. Ici l'objet `User` est construit avec `raw`, et c'est le mot de passe en clair qui part en base. Le coût 10 est une valeur de départ raisonnable, et la trace ne contient que le login : la seule vraie faille est ligne 7.",
  },
  {
    kind: "recall",
    id: "spring-sec-09",
    difficulty: 3,
    tags: ["securite", "mot-de-passe"],
    prompt: "Pourquoi SHA-256 est-il un mauvais choix pour stocker un mot de passe, alors que c'est une fonction de hachage solide ?",
    explanation:
      "Parce qu'il est conçu pour être rapide, et que la vitesse profite ici à l'attaquant : un GPU calcule des milliards de SHA-256 par seconde, ce qui rend une attaque par force brute hors ligne réaliste. Il n'intègre pas non plus de sel, donc deux utilisateurs ayant le même mot de passe ont la même empreinte et une seule table pré-calculée les casse tous. Un mot de passe demande une fonction de dérivation de clé — BCrypt, scrypt, Argon2 — délibérément lente, réglable par un facteur de coût que l'on augmente à mesure que le matériel progresse, et à sel intégré.",
    keyPoints: [
      "SHA-256 est rapide : c'est le défaut, pas la qualité, pour un mot de passe",
      "Pas de sel : mêmes mots de passe, mêmes empreintes, tables pré-calculées",
      "Il faut une fonction lente et réglable : BCrypt, scrypt, Argon2",
      "Le facteur de coût s'augmente au fil des années",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Session ou stateless : deux façons de se souvenir
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-sec-l4",
  title: "Session ou stateless : deux façons de se souvenir",
  blocks: [
    {
      kind: "text",
      text: "HTTP ne se souvient de rien. Chaque requête arrive sans passé, et il faut pourtant éviter de redemander le mot de passe à chaque clic. Toute la question de l'authentification web tient dans ce petit problème : où ranger la preuve qu'on s'est déjà authentifié, et comment la représenter. Deux réponses coexistent, et le choix entre elles conditionne le reste de la configuration.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Réponse historique : une session côté serveur.",
      code: `// Le serveur garde l'état, le client ne porte qu'une clé opaque.
http.formLogin(Customizer.withDefaults())
    .sessionManagement(s -> s
        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        .maximumSessions(1));

// Réponse à la connexion :
// Set-Cookie: JSESSIONID=8A1F3C…; HttpOnly; Secure; SameSite=Lax
//
// Le cookie ne contient rien d'exploitable : c'est un index
// vers un SecurityContext conservé en mémoire du serveur.`,
    },
    {
      kind: "text",
      text: "Dans ce modèle, l'identité vit sur le serveur, dans une table de sessions. Le navigateur ne transporte qu'un identifiant opaque, renvoyé automatiquement à chaque requête. Le `SecurityContextRepository` recharge le contexte au début de chaque requête et le sauvegarde à la fin. Deux avantages décisifs : on peut révoquer une session instantanément en la supprimant côté serveur, et le cookie ne divulgue rien s'il est intercepté sans être utilisable.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Réponse des API : aucune mémoire côté serveur.",
      code: `http.sessionManagement(s -> s
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .csrf(csrf -> csrf.disable())
    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()));

// Le client renvoie lui-même sa preuve, à chaque appel :
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…
//
// Aucune session n'est créée ni consultée : le contexte est
// reconstruit à partir du jeton, puis jeté en fin de requête.`,
    },
    {
      kind: "text",
      text: "`STATELESS` ne se contente pas de ne pas créer de session : il interdit aussi d'en lire une existante. Le contexte est reconstruit à chaque requête depuis le jeton présenté, puis abandonné. Le serveur n'a plus rien à mémoriser, ce qui permet d'ajouter des instances derrière un répartiteur de charge sans réplication de session ni affinité, et de survivre à un redémarrage sans déconnecter personne.",
    },
    {
      kind: "comparison",
      title: "Ce que chacun coûte",
      left: {
        label: "Session serveur",
        text: "Révocation immédiate : supprimer la session déconnecte l'utilisateur. Le cookie est opaque, aucune donnée n'est exposée. En contrepartie, l'état doit être partagé entre instances (Redis, Spring Session) et le CSRF devient un vrai sujet, puisque le navigateur envoie le cookie tout seul.",
      },
      right: {
        label: "Jeton stateless",
        text: "Aucun état partagé, montée en charge et redémarrages indolores. En contrepartie, un jeton reste valide jusqu'à son expiration : on ne révoque pas sans réintroduire de l'état. Et il faut le ranger côté client sans l'exposer au vol.",
      },
    },
    {
      kind: "text",
      text: "Le point qui fait basculer le choix est presque toujours la révocation. Avec une session, exclure quelqu'un est immédiat. Avec un jeton auto-porteur, il faut soit attendre l'expiration, soit tenir une liste de jetons révoqués — c'est-à-dire réintroduire l'état qu'on avait voulu supprimer. D'où le compromis courant : des jetons d'accès très courts, quelques minutes, doublés d'un jeton de rafraîchissement, lui révocable, conservé côté serveur.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Configurer `STATELESS` sans supprimer `formLogin`, ou l'inverse, produit une application qui semble marcher en développement et se comporte de travers en production. Les deux modèles ne se panachent pas au hasard : un client navigateur avec session veut CSRF actif ; une API avec jeton `Bearer` veut CSRF désactivé et aucune session. Chaque incohérence entre ces deux blocs est un trou.",
    },
    {
      kind: "text",
      text: "Le modèle à session a son attaque propre, la **fixation** : l'attaquant impose à la victime un identifiant de session qu'il connaît déjà, puis attend qu'elle se connecte pour en hériter. Spring Security s'en protège par défaut en changeant l'identifiant de session au moment de l'authentification. C'est un comportement à ne pas désactiver sans très bonne raison.",
    },
    {
      kind: "text",
      text: "En pratique, une application avec un rendu serveur et des formulaires reste très bien servie par les sessions, qui sont plus simples et plus faciles à révoquer. Le stateless s'impose pour une API consommée par un client tiers, un mobile ou un autre service. Une même application peut d'ailleurs déclarer deux `SecurityFilterChain` ordonnées : l'une pour `/api/**` en stateless, l'autre pour le reste avec session.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-sec-10",
    difficulty: 2,
    tags: ["securite", "session"],
    prompt: "Que fait exactement `SessionCreationPolicy.STATELESS` ?",
    choices: [
      "Spring Security ne crée aucune session et n'en consulte aucune : le contexte est reconstruit à chaque requête.",
      "Spring Security crée une session mais l'invalide à la fin de chaque requête.",
      "Spring Security crée une session uniquement si l'utilisateur est authentifié.",
      "Spring Security stocke la session dans un cookie signé au lieu de la garder en mémoire.",
    ],
    answer: 0,
    explanation:
      "`STATELESS` interdit à la fois la création et la lecture d'une session existante. Le `SecurityContext` est reconstruit depuis la preuve présentée — en général un jeton `Bearer` — puis abandonné en fin de requête. C'est ce qui permet d'ajouter des instances sans réplication de session. `IF_REQUIRED`, le comportement par défaut, crée une session quand c'est nécessaire.",
  },
  {
    kind: "match",
    id: "spring-sec-11",
    difficulty: 2,
    tags: ["securite", "session"],
    prompt: "Associe chaque élément à son rôle.",
    pairs: [
      { left: "JSESSIONID", right: "Identifiant opaque posé en cookie, index vers l'état serveur" },
      { left: "SessionCreationPolicy.STATELESS", right: "Interdit de créer comme de consulter une session" },
      { left: "SecurityContextRepository", right: "Recharge et sauvegarde le contexte entre deux requêtes" },
      { left: "Authorization: Bearer …", right: "En-tête par lequel le client porte lui-même sa preuve" },
    ],
    explanation:
      "Les deux modèles se lisent dans ce tableau : à gauche l'état vit sur le serveur et le client ne porte qu'une clé, à droite le client porte tout et le serveur ne retient rien. `SecurityContextRepository` n'a de sens que dans le premier cas.",
  },
  {
    kind: "recall",
    id: "spring-sec-12",
    difficulty: 3,
    tags: ["securite", "session", "jwt"],
    prompt: "Quel est le principal inconvénient d'une authentification par jeton auto-porteur, et comment le contourne-t-on en pratique ?",
    explanation:
      "La révocation. Un jeton auto-porteur est valide jusqu'à son expiration parce que le serveur ne conserve rien : exclure un utilisateur, changer ses droits ou réagir à un vol de jeton n'a aucun effet immédiat. Tenir une liste de jetons révoqués revient à réintroduire l'état qu'on voulait supprimer. Le compromis habituel consiste à émettre des jetons d'accès très courts — quelques minutes — accompagnés d'un jeton de rafraîchissement, lui conservé côté serveur et donc révocable. La fenêtre de nuisance est ramenée à la durée de vie du jeton d'accès.",
    keyPoints: [
      "Un jeton auto-porteur reste valide jusqu'à expiration",
      "Révoquer suppose de réintroduire de l'état côté serveur",
      "Compromis : jeton d'accès court + jeton de rafraîchissement révocable",
      "La fenêtre de nuisance vaut la durée de vie du jeton d'accès",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — JWT : ce qu'il garantit, et ce qu'il ne garantit pas
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "spring-sec-l5",
  title: "JWT : ce qu'il garantit, et ce qu'il ne garantit pas",
  blocks: [
    {
      kind: "text",
      text: "Si le serveur ne garde rien, le client doit porter sa preuve. Mais on ne peut pas laisser le client écrire lui-même « je suis alice, je suis administrateur » : il changerait la phrase. Il faut un format que le porteur puisse transmettre sans pouvoir le modifier. C'est exactement le problème que résout le JWT, et le comprendre ainsi évite la plupart des erreurs qu'on commet avec lui.",
    },
    {
      kind: "code",
      language: "json",
      caption: "Trois parties en Base64URL, séparées par des points.",
      code: `// header.payload.signature
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJzdWIiOiJhbGljZSIsInJvbGUiOiJVU0VSIn0
//   .K3rF9v_2mQ8xN1pQhU7dYqA4sZbW6cLtE0jRnMg

// header
{ "alg": "HS256", "typ": "JWT" }

// payload : les « claims »
{
  "sub": "alice",          // sujet
  "iss": "https://auth.example",
  "exp": 1789078800,       // expiration, en secondes epoch
  "role": "USER"
}`,
    },
    {
      kind: "text",
      text: "La signature est calculée sur l'en-tête et la charge utile réunis, avec une clé que seul l'émetteur détient. Modifier un seul caractère du payload invalide la signature. Le serveur qui reçoit le jeton recalcule la signature et compare : s'il y a correspondance, le contenu est authentique. Voilà la garantie exacte du JWT — **l'intégrité et l'origine**, rien d'autre.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce que tout le monde peut faire avec votre jeton.",
      code: `String jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
           + ".eyJzdWIiOiJhbGljZSIsInJvbGUiOiJVU0VSIn0"
           + ".K3rF9v_2mQ8xN1pQhU7dYqA4sZbW6cLtE0jRnMg";

String payload = new String(Base64.getUrlDecoder()
        .decode(jwt.split("\\\\.")[1]));

System.out.println(payload);
// {"sub":"alice","role":"USER"}
// Aucune clé n'a été nécessaire.`,
    },
    {
      kind: "text",
      text: "Un JWT signé n'est **pas chiffré**. Base64URL est un encodage, pas un secret : n'importe qui interceptant le jeton lit son contenu en une ligne de code. Tout ce qu'on met dans un payload est donc public en pratique. Adresse, numéro de client, rôle interne, identifiant technique : si sa divulgation pose un problème, l'information n'a rien à faire là. Le chiffrement existe — c'est JWE — mais ce n'est pas ce qu'on manipule d'ordinaire.",
    },
    {
      kind: "comparison",
      title: "Deux familles de signature",
      left: {
        label: "HS256 — symétrique",
        text: "Une seule clé secrète sert à signer et à vérifier. Simple, mais tout service capable de vérifier un jeton est aussi capable d'en fabriquer un. Convient quand l'émetteur et le vérificateur sont la même application.",
      },
      right: {
        label: "RS256 — asymétrique",
        text: "L'émetteur signe avec sa clé privée ; chacun vérifie avec la clé publique, exposée via un JWKS. Un service qui vérifie ne peut pas émettre. C'est le choix dès que plusieurs services consomment les jetons d'un serveur d'autorisation.",
      },
    },
    {
      kind: "text",
      text: "Vérifier un jeton ne se limite pas à contrôler la signature. Il faut aussi valider `exp` — un jeton expiré doit être refusé, et c'est la seule protection contre sa réutilisation indéfinie —, `iss` pour s'assurer qu'il vient bien de l'émetteur attendu, et `aud` pour vérifier qu'il vous était destiné plutôt qu'à un service voisin. Spring Security fait tout cela par défaut derrière `oauth2ResourceServer().jwt()`, ce qui est une excellente raison de ne pas écrire ce filtre soi-même.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "L'attaque `alg: none`",
      text: "Les premières bibliothèques JWT lisaient l'algorithme **dans le jeton** pour décider comment le vérifier. Il suffisait alors de poser `\"alg\": \"none\"`, de retirer la signature et de forger n'importe quel contenu. Un vérificateur correct impose l'algorithme attendu côté serveur et refuse tout jeton qui n'y répond pas. C'est le meilleur argument contre l'écriture d'une vérification maison.",
    },
    {
      kind: "text",
      text: "L'expiration se heurte à un détail concret : les horloges de deux serveurs ne sont jamais parfaitement synchrones. Un jeton tout juste émis peut sembler venir du futur pour le vérificateur, ou expiré avec une seconde d'avance. Spring Security applique donc une tolérance d'une minute par défaut, réglable. C'est aussi pourquoi des durées de vie très courtes, de l'ordre de quelques secondes, sont ingérables en pratique.",
    },
    {
      kind: "text",
      text: "Reste la question du rangement côté navigateur. Dans le `localStorage`, le jeton est lisible par n'importe quel script, donc exposé à la moindre faille XSS. Dans un cookie `HttpOnly`, il échappe aux scripts mais redevient envoyé automatiquement par le navigateur, ce qui ramène le CSRF. Il n'y a pas de réponse parfaite : le cookie `HttpOnly; Secure; SameSite=Strict` est généralement le moins mauvais compromis.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "output",
    id: "spring-sec-13",
    difficulty: 2,
    tags: ["securite", "jwt"],
    prompt: "Un attaquant a intercepté ce jeton et exécute ce code, sans connaître la clé de signature.",
    code: {
      language: "java",
      code: `String jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
           + ".eyJzdWIiOiJhbGljZSIsInJvbGUiOiJVU0VSIn0"
           + ".K3rF9v_2mQ8xN1pQhU7dYqA4sZbW6cLtE0jRnMg";

String payload = new String(Base64.getUrlDecoder()
        .decode(jwt.split("\\\\.")[1]));

System.out.println(payload);`,
    },
    choices: [
      `{"sub":"alice","role":"USER"}`,
      "Une `SignatureException` : la charge utile ne peut être lue sans la clé.",
      "Une suite d'octets illisibles : la charge utile est chiffrée avec la clé de l'émetteur.",
      "eyJzdWIiOiJhbGljZSIsInJvbGUiOiJVU0VSIn0",
    ],
    answer: 0,
    explanation:
      "Un JWT signé n'est pas chiffré. Base64URL est un simple encodage : la charge utile se décode sans aucune clé, et l'attaquant lit `{\"sub\":\"alice\",\"role\":\"USER\"}` en clair. La signature garantit qu'il ne peut pas *modifier* ce contenu, pas qu'il ne peut pas le *lire*. D'où la règle : rien de confidentiel dans un payload.",
  },
  {
    kind: "mcq",
    id: "spring-sec-14",
    difficulty: 3,
    tags: ["securite", "jwt"],
    prompt: "Plusieurs services d'une même plateforme doivent vérifier les jetons émis par un serveur d'autorisation central. Quel algorithme de signature choisir ?",
    choices: [
      "RS256 : les services vérifient avec la clé publique et ne peuvent pas émettre de jetons.",
      "HS256 : il suffit de distribuer la clé secrète à chaque service qui doit vérifier.",
      "Peu importe : la vérification ne dépend pas de l'algorithme choisi.",
      "Aucun des deux : il faut chiffrer les jetons en JWE pour les partager entre services.",
    ],
    answer: 0,
    explanation:
      "Avec HS256, la même clé signe et vérifie : distribuer la clé à cinq services, c'est donner à cinq services le pouvoir de fabriquer des jetons, et multiplier par cinq le risque de fuite. RS256 sépare les deux rôles — clé privée pour l'émetteur, clé publique exposée via un JWKS pour les vérificateurs. Le chiffrement JWE répond à une autre question, la confidentialité du contenu.",
  },
  {
    kind: "recall",
    id: "spring-sec-15",
    difficulty: 2,
    tags: ["securite", "jwt"],
    prompt: "Quelles vérifications, au-delà de la signature, un service doit-il faire sur un JWT reçu ?",
    explanation:
      "La signature prouve l'intégrité et l'origine, mais pas la validité de l'usage. Il faut au minimum vérifier `exp`, l'expiration — c'est la seule limite à la réutilisation d'un jeton volé —, `iss` pour confirmer qu'il vient bien de l'émetteur attendu et non d'un autre serveur d'autorisation, et `aud` pour s'assurer qu'il vous était destiné plutôt qu'à un service voisin. Il faut enfin imposer l'algorithme attendu au lieu de lire celui déclaré dans l'en-tête, sous peine de rouvrir l'attaque `alg: none`. Spring Security effectue ces contrôles derrière `oauth2ResourceServer().jwt()`.",
    keyPoints: [
      "exp : refuser un jeton expiré",
      "iss : l'émetteur est bien celui attendu",
      "aud : le jeton vous était destiné",
      "Imposer l'algorithme côté serveur, ne pas lire celui du jeton",
      "Spring Security fait tout cela par défaut",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — OAuth2 et OIDC : déléguer l'authentification
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "spring-sec-l6",
  title: "OAuth2 et OIDC : déléguer l'authentification",
  blocks: [
    {
      kind: "text",
      text: "Une application veut lire l'agenda de ses utilisateurs chez un fournisseur tiers. La solution évidente — leur demander leur mot de passe pour aller le chercher — est catastrophique : elle donne un accès total, permanent, impossible à révoquer sans changer le mot de passe, à une application qui n'avait besoin que de lire des créneaux. OAuth2 existe pour répondre exactement à cela : **déléguer un accès limité sans jamais partager le secret**.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Côté client : Spring Boot fait presque tout.",
      code: `spring:
  security:
    oauth2:
      client:
        registration:
          keycloak:
            client-id: facturation-web
            client-secret: \${OAUTH_SECRET}
            scope: openid, profile, email
            authorization-grant-type: authorization_code
        provider:
          keycloak:
            issuer-uri: https://auth.example/realms/interne`,
    },
    {
      kind: "text",
      text: "Quatre rôles suffisent à décrire le protocole. Le **resource owner** est l'utilisateur, propriétaire des données. Le **client** est l'application qui demande l'accès pour son compte. L'**authorization server** authentifie l'utilisateur et délivre les jetons. Le **resource server** est l'API qui valide le jeton et sert les données. La confusion la plus fréquente vient de ce que le client et le resource server appartiennent souvent à la même équipe, alors que ce sont deux rôles distincts.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Côté API : valider les jetons émis par l'autorité.",
      code: `@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
        .securityMatcher("/api/**")
        .authorizeHttpRequests(a -> a
            .requestMatchers("/api/admin/**").hasAuthority("SCOPE_admin")
            .anyRequest().authenticated())
        .sessionManagement(s -> s
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .csrf(csrf -> csrf.disable())
        .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
        .build();
}`,
    },
    {
      kind: "text",
      text: "Le flot recommandé est le **code d'autorisation**. L'utilisateur est redirigé vers le serveur d'autorisation, s'y authentifie — l'application cliente ne voit jamais le mot de passe —, puis est renvoyé au client avec un code à usage unique et de courte durée. Le client échange ensuite ce code contre des jetons, par un appel serveur à serveur. Ce détour évite que les jetons transitent par l'URL du navigateur, où ils finiraient dans l'historique et les journaux.",
    },
    {
      kind: "comparison",
      title: "Deux jetons qu'on confond tout le temps",
      left: {
        label: "Access token",
        text: "Destiné au **resource server**. Il dit ce que le porteur a le droit de faire, via ses scopes. L'API le valide et n'a pas à savoir qui est l'utilisateur. Format libre : souvent un JWT, parfois une chaîne opaque à valider par introspection.",
      },
      right: {
        label: "ID token (OIDC)",
        text: "Destiné au **client**, et à lui seul. Toujours un JWT, il décrit qui s'est authentifié et comment. Une API ne doit jamais l'accepter comme preuve d'accès : il ne répond pas à la question « as-tu le droit ? » mais « qui es-tu ? ».",
      },
    },
    {
      kind: "text",
      text: "OAuth2 traite de l'autorisation, pas de l'identité : le protocole ne dit nulle part comment savoir qui s'est connecté. OpenID Connect est la couche ajoutée par-dessus pour combler ce manque. Elle apporte le scope `openid`, l'`ID token` et le point d'accès `userinfo`. C'est pour cela qu'un « se connecter avec… » repose sur OIDC et non sur OAuth2 seul — et pourquoi bricoler une authentification sur OAuth2 nu est un contresens classique.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "PKCE n'est plus optionnel",
      text: "Une application mobile ou une page web ne peut pas garder un `client_secret` : il est dans le binaire ou dans le code livré au navigateur. PKCE comble ce trou. Le client tire un secret éphémère, envoie son empreinte (`code_challenge`) au départ, puis présente le secret original (`code_verifier`) lors de l'échange. Un code d'autorisation intercepté devient inutilisable. La dernière version des bonnes pratiques OAuth le recommande pour **tous** les clients, y compris ceux qui gardent un secret.",
    },
    {
      kind: "text",
      text: "Ce qu'il faut retenir pour bien configurer Spring : `oauth2Login` fait de votre application un **client** — elle redirige l'utilisateur et ouvre une session. `oauth2ResourceServer` en fait un **resource server** — elle valide les jetons entrants sans jamais rediriger personne. Les deux blocs n'ont ni le même rôle ni le même client, et les confondre produit des redirections là où une API devait répondre 401.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "order",
    id: "spring-sec-16",
    difficulty: 3,
    tags: ["securite", "oauth2"],
    prompt: "Remets dans l'ordre le flot du code d'autorisation avec PKCE.",
    items: [
      "Le client tire un code_verifier et redirige l'utilisateur avec son empreinte, le code_challenge",
      "L'utilisateur s'authentifie auprès de l'Authorization Server, qui ne montre jamais le mot de passe au client",
      "L'AS redirige vers le client avec un code d'autorisation à usage unique et de courte durée",
      "Le client échange le code et le code_verifier contre des jetons, en appel serveur à serveur",
      "Le client appelle l'API en présentant l'access token dans l'en-tête Authorization",
    ],
    explanation:
      "Le détour par le code, plutôt que la remise directe des jetons, évite que ceux-ci transitent par l'URL du navigateur, où ils atterriraient dans l'historique et les journaux du serveur. PKCE ajoute la preuve que celui qui échange le code est bien celui qui l'a demandé : un code intercepté sans le `code_verifier` ne vaut rien.",
  },
  {
    kind: "match",
    id: "spring-sec-17",
    difficulty: 2,
    tags: ["securite", "oauth2"],
    prompt: "Associe chaque rôle OAuth2 à sa définition.",
    pairs: [
      { left: "Resource owner", right: "L'utilisateur, propriétaire des données convoitées" },
      { left: "Client", right: "L'application qui demande l'accès pour le compte de l'utilisateur" },
      { left: "Authorization server", right: "Authentifie l'utilisateur et délivre les jetons" },
      { left: "Resource server", right: "L'API qui valide le jeton reçu et sert les données" },
    ],
    explanation:
      "Client et resource server sont souvent développés par la même équipe, ce qui brouille la distinction : le premier obtient des jetons et les présente, le second les reçoit et les valide. Dans Spring, cela correspond à deux configurations différentes — `oauth2Login` d'un côté, `oauth2ResourceServer` de l'autre.",
  },
  {
    kind: "mcq",
    id: "spring-sec-18",
    difficulty: 3,
    tags: ["securite", "oidc"],
    prompt: "Une API reçoit un `ID token` OIDC dans l'en-tête `Authorization` et s'en sert pour autoriser l'accès. Qu'en penser ?",
    choices: [
      "C'est un contresens : l'ID token est destiné au client et décrit qui s'est authentifié, pas ce que le porteur a le droit de faire.",
      "C'est correct : l'ID token étant un JWT signé, il vaut preuve d'accès pour l'API.",
      "C'est correct à condition que l'ID token contienne un scope `api`.",
      "C'est indifférent : OIDC définit les deux jetons comme interchangeables.",
    ],
    answer: 0,
    explanation:
      "L'`ID token` répond à « qui es-tu ? » et son audience est le client qui a lancé la connexion. L'`access token` répond à « as-tu le droit ? » et son audience est le resource server. Accepter le premier à la place du second, c'est ignorer le contrôle d'audience et accepter un jeton émis pour quelqu'un d'autre.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Autoriser : règles d'URL et sécurité de méthode
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "spring-sec-l7",
  title: "Autoriser : règles d'URL et sécurité de méthode",
  blocks: [
    {
      kind: "text",
      text: "Savoir qui appelle ne dit pas encore ce qu'il a le droit de faire. L'autorisation se pose à deux endroits, et la question n'est pas de choisir mais de comprendre ce que chacun voit. Les règles d'URL raisonnent sur le chemin et le verbe HTTP ; la sécurité de méthode raisonne sur l'objet manipulé. Certaines décisions ne peuvent tout simplement pas être prises depuis une URL.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Ce qu'une règle d'URL ne peut pas exprimer.",
      code: `// Règle d'URL : « il faut être authentifié pour lire une facture »
.requestMatchers(HttpMethod.GET, "/invoices/**").authenticated()

// Mais la vraie règle métier est :
// « on peut lire SA facture, ou n'importe laquelle si on est
//   comptable ». L'URL /invoices/42 ne dit pas à qui appartient
//   la facture 42 : il faut la charger pour le savoir.`,
    },
    {
      kind: "text",
      text: "Les règles d'URL sont évaluées par `AuthorizationFilter`, avant tout contrôleur. Elles sont donc parfaites pour le gros grain : ouvrir `/public/**`, réserver `/admin/**`, exiger l'authentification partout ailleurs. Elles ont l'avantage énorme de couvrir aussi ce qui n'existe pas — une URL sans contrôleur reste protégée — et de se relire d'un bloc.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La sécurité de méthode voit les arguments et le résultat.",
      code: `@Configuration
@EnableMethodSecurity           // indispensable, sinon les annotations sont ignorées
class MethodSecurityConfig { }

@Service
class InvoiceService {

    @PreAuthorize("hasRole('ACCOUNTANT') or #ownerId == authentication.name")
    List<Invoice> findByOwner(String ownerId) { … }

    @PostAuthorize("returnObject.owner == authentication.name")
    Invoice findOne(Long id) { … }
}`,
    },
    {
      kind: "text",
      text: "`@PreAuthorize` s'évalue avant l'appel et voit les arguments : on peut y comparer un paramètre à l'utilisateur courant. `@PostAuthorize` s'évalue après et voit le résultat via `returnObject`, ce qui permet de décider à partir de données qu'il fallait charger. Ce second cas se paie : la méthode a bien été exécutée, et une écriture faite entre-temps ne sera pas annulée par le refus — sauf si une transaction englobe l'appel.",
    },
    {
      kind: "comparison",
      title: "hasRole et hasAuthority",
      left: {
        label: "hasRole('ADMIN')",
        text: "Ajoute automatiquement le préfixe `ROLE_` : la vérification porte en réalité sur l'authority `ROLE_ADMIN`. Pratique tant qu'on respecte la convention, déroutant dès qu'on l'oublie.",
      },
      right: {
        label: "hasAuthority('ROLE_ADMIN')",
        text: "Compare la chaîne telle quelle, sans rien ajouter. C'est ce qu'il faut pour des droits fins qui ne sont pas des rôles — `SCOPE_read`, `invoice:delete` — et pour lever toute ambiguïté.",
      },
    },
    {
      kind: "text",
      text: "De là vient un grand classique du débogage : `hasRole('ROLE_ADMIN')` ne fonctionne jamais, car il cherche l'authority `ROLE_ROLE_ADMIN`. Et si les autorités viennent de scopes OAuth2, elles sont préfixées `SCOPE_` et non `ROLE_`, ce qui rend `hasRole` inopérant — il faut alors `hasAuthority('SCOPE_admin')`. Devant une règle qui refuse obstinément, la première chose à faire est d'afficher `authentication.getAuthorities()`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le piège de l'appel interne",
      text: "`@PreAuthorize` repose sur un proxy, exactement comme `@Transactional`. Un appel d'une méthode de la classe à une autre méthode de la même classe passe par `this` et court-circuite le proxy : **l'annotation est ignorée en silence**. La règle ne s'applique qu'aux appels venus de l'extérieur du bean. Si une méthode publique doit être protégée quel qu'en soit l'appelant, il faut la déplacer dans un autre bean.",
    },
    {
      kind: "text",
      text: "Un point asymétrique mérite d'être noté. Les règles d'URL se terminent par `anyRequest()`, qui décide du sort de tout ce qui n'a pas été nommé : on peut donc fermer par défaut, et n'ouvrir que l'explicite. La sécurité de méthode ne fonctionne pas ainsi — une méthode sans annotation est simplement ouverte, et personne ne vous préviendra. C'est une raison de plus de garder les règles d'URL comme filet de sécurité général, et de réserver `@PreAuthorize` aux décisions que l'URL ne peut pas prendre.",
    },
    {
      kind: "text",
      text: "La combinaison qui fonctionne bien en pratique : des règles d'URL larges pour dessiner les zones de l'application, et `@PreAuthorize` sur les quelques méthodes de service où la décision dépend de la donnée. On évite ainsi d'écrire une expression pour chaque contrôleur, tout en gardant les règles fines au plus près du métier, là où elles restent lisibles et testables sans passer par HTTP.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "fill",
    id: "spring-sec-19",
    difficulty: 1,
    tags: ["securite", "autorisation"],
    prompt: "Complète pour que l'annotation d'autorisation soit prise en compte.",
    code: {
      language: "java",
      code: `@Configuration
@{{1}}
class MethodSecurityConfig { }

@Service
class AdminService {
    @{{2}}("hasRole('ADMIN')")
    void deleteUser(Long id) { }
}`,
    },
    blanks: ["EnableMethodSecurity", "PreAuthorize"],
    distractors: ["EnableWebSecurity", "Secured", "RolesAllowed"],
    explanation:
      "Sans `@EnableMethodSecurity`, les annotations de méthode sont ignorées en silence — la méthode s'exécute pour tout le monde. `@EnableWebSecurity` active la chaîne de filtres, pas la sécurité de méthode. Et seule `@PreAuthorize` accepte une expression SpEL : `@Secured` et `@RolesAllowed` attendent des noms de rôles.",
  },
  {
    kind: "spot",
    id: "spring-sec-20",
    difficulty: 2,
    tags: ["securite", "autorisation"],
    prompt: "Cette configuration ne protège pas ce qu'elle croit protéger. Quelle ligne ?",
    code: {
      language: "java",
      code: `http.authorizeHttpRequests(auth -> auth
        .anyRequest().authenticated()
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .requestMatchers("/public/**").permitAll()
);`,
    },
    faultyLine: 2,
    reasons: [
      "`anyRequest()` est placé en premier : il capte toutes les requêtes et rend les règles suivantes inatteignables.",
      "`hasRole(\"ADMIN\")` devrait s'écrire `hasAuthority(\"ADMIN\")`.",
      "`/public/**` devrait précéder `/admin/**` pour des raisons de performance.",
      "Il manque un appel à `.and()` entre chaque règle.",
    ],
    reasonAnswer: 0,
    explanation:
      "La première règle qui correspond décide. `anyRequest()` correspond à tout : placé en tête, il rend mortes les deux règles suivantes. Il faut aller du plus spécifique au plus général et le laisser en dernier. Spring Security 6 détecte ce cas précis et refuse de démarrer, avec un message expliquant qu'aucune règle ne peut suivre `anyRequest()`.",
  },
  {
    kind: "mcq",
    id: "spring-sec-21",
    difficulty: 3,
    tags: ["securite", "autorisation"],
    prompt: "Une méthode annotée `@PreAuthorize(\"hasRole('ADMIN')\")` s'exécute sans contrôle quand elle est appelée depuis une autre méthode de la même classe. Pourquoi ?",
    choices: [
      "L'annotation passe par un proxy : un appel interne via `this` court-circuite le proxy et l'annotation est ignorée.",
      "`@PreAuthorize` ne s'applique qu'aux méthodes annotées `public`.",
      "Le `SecurityContext` est vidé dès qu'on descend d'une méthode à une autre.",
      "Il manque `@PostAuthorize` pour que le contrôle s'applique aux appels internes.",
    ],
    answer: 0,
    explanation:
      "Comme `@Transactional`, la sécurité de méthode est implémentée par un proxy autour du bean. Un appel interne part de `this` et ne traverse jamais le proxy : le contrôle est purement et simplement sauté, sans le moindre avertissement. Si la protection doit valoir quel que soit l'appelant, la méthode doit vivre dans un autre bean.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — CSRF : pourquoi c'est activé, et quand le désactiver
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "spring-sec-l8",
  title: "CSRF : pourquoi c'est activé, et quand le désactiver",
  blocks: [
    {
      kind: "text",
      text: "Le navigateur a une habitude qui arrange tout le monde jusqu'au jour où elle se retourne contre vous : il joint automatiquement les cookies du domaine visé à **toute** requête partant vers ce domaine, quelle que soit la page qui la déclenche. Votre session bancaire est donc jointe aussi bien quand vous cliquez sur la banque que lorsqu'un autre site, ouvert dans un autre onglet, envoie discrètement une requête vers elle.",
    },
    {
      kind: "code",
      language: "xml",
      caption: "L'attaque tient en cinq lignes sur un site quelconque.",
      code: `<!-- L'utilisateur, connecté à sa banque, visite ce site -->
<form action="https://banque.example/transfer" method="POST">
  <input type="hidden" name="to" value="mallory">
  <input type="hidden" name="amount" value="1000">
</form>
<script>document.forms[0].submit();</script>

<!-- Le navigateur joint le cookie de session tout seul.
     Côté banque, la requête est parfaitement authentifiée. -->`,
    },
    {
      kind: "text",
      text: "C'est le point qu'il faut saisir : l'attaquant ne vole rien et ne lit rien. La politique de même origine l'empêche de consulter la réponse. Il n'en a pas besoin — il lui suffit que l'effet de bord se produise. L'attaque exploite l'**ambiguïté de l'intention** : le serveur reçoit une requête authentifiée et n'a aucun moyen de savoir si l'utilisateur voulait vraiment la faire.",
    },
    {
      kind: "code",
      language: "java",
      caption: "La parade : une preuve que le navigateur n'envoie pas tout seul.",
      code: `// Activé par défaut. Pour une SPA sur le même domaine :
http.csrf(csrf -> csrf
        .csrfTokenRepository(
            CookieCsrfTokenRepository.withHttpOnlyFalse()));

// Le serveur pose un cookie XSRF-TOKEN lisible par le JavaScript,
// qui doit le recopier dans un en-tête :
//     X-XSRF-TOKEN: 9f2c…
//
// Un site tiers ne peut pas lire ce cookie (politique de même
// origine) : il ne peut donc pas fabriquer l'en-tête.`,
    },
    {
      kind: "text",
      text: "Le jeton CSRF fonctionne parce qu'il est transmis d'une façon que le navigateur **n'automatise pas**. Un cookie part tout seul ; un champ de formulaire ou un en-tête personnalisé doit être écrit par du code, et ce code ne peut s'exécuter que sur votre origine. Spring Security n'exige ce jeton que sur les méthodes non sûres — POST, PUT, PATCH, DELETE — puisque GET n'est pas censé modifier quoi que ce soit.",
    },
    {
      kind: "comparison",
      title: "Quand faut-il le CSRF ?",
      left: {
        label: "Session en cookie → indispensable",
        text: "Dès que l'authentification repose sur quelque chose que le navigateur envoie automatiquement — cookie de session, authentification HTTP mémorisée — l'attaque est possible et la protection nécessaire. C'est le cas de toute application à formulaires.",
      },
      right: {
        label: "Jeton Bearer → inutile",
        text: "Si la preuve voyage dans un en-tête `Authorization` écrit par le client, le navigateur ne l'ajoute jamais de lui-même. Un site tiers ne peut pas le poser : l'attaque n'existe pas, et le CSRF peut être désactivé sans risque.",
      },
    },
    {
      kind: "text",
      text: "D'où la règle de décision, très simple : la protection CSRF est nécessaire exactement quand l'authentification est **ambiante**. Un site tiers peut déclencher une requête vers votre domaine, mais il ne peut ni lire ni écrire un en-tête sur votre origine. Une API purement stateless, authentifiée par `Authorization: Bearer`, n'a donc rien à protéger — c'est pourquoi `csrf.disable()` accompagne légitimement `SessionCreationPolicy.STATELESS`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "La désactivation de confort",
      text: "Le réflexe le plus dangereux du métier : un POST renvoie 403 pendant un développement, on ajoute `csrf.disable()`, ça marche, on passe à autre chose. Si l'application utilise des sessions en cookie, cette ligne vient de rouvrir la faille en grand. Le 403 était le bon comportement — il signalait que le client n'envoyait pas le jeton, ce qui est un défaut du client, pas du serveur.",
    },
    {
      kind: "text",
      text: "Si le jeton n'est pas exigé sur les `GET`, c'est parce qu'un `GET` est censé être sans effet de bord. Une application qui expose une suppression derrière un `GET /invoices/42/delete` échappe donc à la protection CSRF — et redevient attaquable par une simple balise `img`. Respecter la sémantique des verbes HTTP n'est pas une coquetterie : plusieurs défenses en dépendent.",
    },
    {
      kind: "text",
      text: "L'attribut `SameSite` des cookies apporte une seconde barrière, aujourd'hui appliquée par défaut en `Lax` dans les navigateurs courants : le cookie n'est plus joint aux requêtes inter-sites, ce qui neutralise l'essentiel de l'attaque. C'est une défense en profondeur bienvenue, mais pas un remplacement — elle dépend du navigateur, et sa valeur `Lax` laisse passer certains cas. On garde donc les deux.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "spring-sec-22",
    difficulty: 2,
    tags: ["securite", "csrf"],
    prompt: "Application Spring Boot avec sessions et configuration CSRF par défaut. L'utilisateur a une session ouverte ; la requête est envoyée sans jeton CSRF.",
    code: {
      language: "bash",
      code: `curl -X POST https://app.example/transfer \\
     -H "Cookie: JSESSIONID=8A1F3C2B9D4E" \\
     -d "to=mallory&amount=1000" \\
     -i | head -1`,
    },
    choices: [
      "HTTP/1.1 403 Forbidden",
      "HTTP/1.1 200 OK",
      "HTTP/1.1 401 Unauthorized",
      "HTTP/1.1 302 Found",
    ],
    answer: 0,
    explanation:
      "La session est valide, donc l'utilisateur est bien **authentifié** : ce n'est pas un 401. Mais le jeton CSRF manque sur une méthode non sûre, et le filtre CSRF rejette la requête avant le contrôleur avec un 403. C'est exactement la protection recherchée : sans elle, ce `curl` — ou un formulaire caché sur un site tiers — effectuerait le virement.",
  },
  {
    kind: "mcq",
    id: "spring-sec-23",
    difficulty: 2,
    tags: ["securite", "csrf"],
    prompt: "Dans quel cas `csrf.disable()` est-il légitime ?",
    choices: [
      "Sur une API stateless dont l'authentification repose uniquement sur un en-tête `Authorization: Bearer`.",
      "Dès que l'application est servie en HTTPS, le chiffrement rendant l'attaque impossible.",
      "Quand un POST renvoie 403 alors que l'utilisateur est bien connecté.",
      "Sur toute API REST, le CSRF ne concernant que les applications à rendu serveur.",
    ],
    answer: 0,
    explanation:
      "Le CSRF n'existe que si l'authentification est ambiante, c'est-à-dire envoyée automatiquement par le navigateur. Un en-tête `Authorization` doit être écrit par le client, ce qu'un site tiers ne peut pas faire : la protection est alors inutile. HTTPS chiffre le transport mais n'empêche pas le navigateur de joindre les cookies. Et le 403 signale précisément que la protection fonctionne : le corriger en la désactivant, c'est ouvrir la faille. Une API REST authentifiée par cookie de session reste vulnérable.",
  },
  {
    kind: "recall",
    id: "spring-sec-24",
    difficulty: 3,
    tags: ["securite", "csrf"],
    prompt: "Explique pourquoi un jeton CSRF protège, alors que le cookie de session, lui, ne protège pas.",
    explanation:
      "Parce que les deux ne voyagent pas de la même façon. Le navigateur joint le cookie de session automatiquement à toute requête vers le domaine, quelle que soit la page à l'origine de cette requête : un site tiers en profite sans rien connaître de la session. Le jeton CSRF, lui, doit être placé explicitement dans un champ de formulaire ou un en-tête, donc écrit par du code — et la politique de même origine empêche un site tiers de lire votre cookie ou d'exécuter du code sur votre origine. La protection ne vient pas du secret du jeton mais du fait que sa transmission n'est **pas automatisée** par le navigateur. C'est aussi pourquoi elle ne sert à rien face à un jeton `Bearer`, déjà non automatique, et pourquoi elle est exigée seulement sur POST, PUT, PATCH et DELETE.",
    keyPoints: [
      "Le cookie part tout seul, quelle que soit l'origine de la requête",
      "Le jeton CSRF doit être écrit par du code, donc par votre origine",
      "La politique de même origine empêche le tiers de le lire ou de l'écrire",
      "Inutile avec un en-tête Authorization, déjà non automatique",
      "Exigé uniquement sur les méthodes non sûres",
    ],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-security",
  title: "Sécurité : filtres, mots de passe, jetons, autorisation",
  objective:
    "Configurer la sécurité d'une application Spring : comprendre la chaîne de filtres, stocker un mot de passe correctement, choisir entre session et jeton, valider un JWT, situer OAuth2 et OIDC, écrire des règles d'autorisation et décider du CSRF en connaissance de cause.",
  prerequisites: ["spring-rest"],
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
