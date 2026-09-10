/**
 * Spring — Autour du cœur (référentiel 2.6) : Actuator, sondes, journalisation,
 * cache, planification, asynchrone, événements, AOP.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Actuator : ce que l'application dit d'elle-même
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-autour-l1",
  title: "Actuator : ce que l'application dit d'elle-même",
  blocks: [
    {
      kind: "text",
      text: "Une application en production est une boîte noire tant qu'elle ne dit rien d'elle-même. Quand quelque chose ne va pas, les questions arrivent toutes en même temps : quelle version tourne, la base répond-elle, combien de connexions sont ouvertes, quelle est la configuration effective. Sans réponse outillée, on redéploie en espérant, ce qui efface justement l'état qu'il aurait fallu observer.",
    },
    {
      kind: "text",
      text: "Actuator répond à ce besoin en exposant des points de terminaison standardisés. L'intérêt n'est pas seulement qu'ils existent : c'est qu'ils sont **les mêmes partout**. Un outil de supervision, un script d'exploitation ou un collègue arrivant sur le projet savent où regarder sans lire le code, et l'orchestrateur sait interroger la santé sans configuration spécifique.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Activer, et surtout n'exposer que le nécessaire.",
      code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
  # Séparer le port technique du port applicatif : il
  # n'est alors pas exposé par le même point d'entrée.
  server:
    port: 9090

# Par défaut, seul /actuator/health est exposé sur le
# web. C'est un défaut prudent, à ne pas remplacer par
# « include: * » sans y réfléchir.`,
    },
    {
      kind: "text",
      text: "Le défaut de Spring Boot est volontairement restrictif : seul `health` est exposé. Élargir à `*` est le raccourci qu'on regrette, car certains points de terminaison sont de véritables outils d'attaque — `env` liste la configuration, `heapdump` télécharge la mémoire du processus avec tout ce qu'elle contient, `loggers` permet de modifier le niveau de journalisation à chaud.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Les points de terminaison qui servent vraiment.",
      code: `GET /actuator/health        état, et détail des composants
GET /actuator/info          version, commit, date de build
GET /actuator/metrics       liste des métriques disponibles
GET /actuator/metrics/jvm.memory.used
GET /actuator/prometheus    format de collecte standard

# Utiles mais sensibles :
GET /actuator/env           configuration effective
GET /actuator/loggers       et POST pour changer un niveau
GET /actuator/threaddump    état de tous les threads
GET /actuator/heapdump      télécharge le tas — à protéger`,
    },
    {
      kind: "text",
      text: "Deux points de terminaison changent la vie en incident. `loggers` permet de passer un paquet en `DEBUG` à chaud, d'observer, puis de revenir en arrière — sans redéployer, donc sans perdre l'état. Et `threaddump` donne l'état de tous les threads par HTTP, là où il aurait fallu un accès à la machine. Les deux justifient d'exposer Actuator, à condition de le protéger.",
    },
    {
      kind: "comparison",
      title: "Deux façons de protéger",
      left: {
        label: "Port séparé",
        text: "`management.server.port` place Actuator sur un autre port, que le réseau n'expose qu'aux outils internes. Simple, efficace, et indépendant de la configuration de sécurité applicative — le point de terminaison n'est tout simplement pas joignable de l'extérieur.",
      },
      right: {
        label: "Règle de sécurité",
        text: "Une `SecurityFilterChain` dédiée avec `EndpointRequest.toAnyEndpoint()`, exigeant un rôle. Nécessaire si tout passe par le même point d'entrée. Plus fin, mais dépend d'une configuration qu'un changement ultérieur peut affaiblir sans qu'on s'en aperçoive.",
      },
    },
    {
      kind: "text",
      text: "Le point de terminaison `info` mérite d'être renseigné, car il répond à la première question de tout incident : quelle version tourne réellement ? En branchant les greffons de build Maven ou Gradle, il expose le numéro de version, l'empreinte du commit et la date de compilation. Cela évite le dialogue classique où personne ne sait avec certitude ce qui est déployé.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "heapdump n'est jamais anodin",
      text: "Ce point de terminaison télécharge l'intégralité des objets vivants : jetons de session, données personnelles, parfois des mots de passe encore en mémoire. L'exposer sans authentification revient à publier la base de données. S'il est activé, il doit l'être sur un port interne, protégé, et le fichier obtenu doit être traité comme une donnée sensible.",
    },
    {
      kind: "text",
      text: "Les métriques méritent une mention à part, car elles sont le seul point de terminaison qu'on consulte quand tout va bien. Micrometer, embarqué avec Actuator, expose la mémoire, les pools de connexions, les temps de réponse par route et les compteurs métier qu'on ajoute soi-même. Le format Prometheus est devenu le standard de collecte, et l'exposer coûte une dépendance et une ligne de configuration.",
    },
    {
      kind: "text",
      text: "Retenons la ligne de conduite : Actuator est un outil d'exploitation, pas une API publique. On l'active, on choisit explicitement ce qu'on expose, on le place hors du chemin public, et l'on renseigne `info`. Ce qui coûte quelques lignes de configuration économise, le jour de l'incident, l'heure passée à deviner ce qui tourne.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-autour-01",
    difficulty: 1,
    tags: ["spring", "actuator"],
    prompt: "Pourquoi `management.endpoints.web.exposure.include: \"*\"` est-il risqué ?",
    choices: [
      "Il expose aussi `env`, `heapdump` et `loggers`, qui divulguent la configuration, la mémoire du processus et permettent de modifier le comportement à chaud.",
      "Il ralentit l'application, chaque point de terminaison ouvrant une connexion permanente.",
      "Il désactive la sécurité applicative sur l'ensemble des routes.",
      "Il empêche l'orchestrateur d'interroger correctement `health`.",
    ],
    answer: 0,
    explanation:
      "Le défaut de Spring Boot n'expose que `health`, ce qui est prudent. Élargir à tout ouvre notamment `heapdump`, qui télécharge l'intégralité des objets vivants — jetons, données personnelles, parfois mots de passe. La bonne pratique est d'énumérer ce dont on a besoin et de placer Actuator sur un port interne.",
  },
  {
    kind: "match",
    id: "spring-autour-02",
    difficulty: 2,
    tags: ["spring", "actuator"],
    prompt: "Associe chaque point de terminaison à son usage.",
    pairs: [
      { left: "/actuator/health", right: "État de l'application et de ses composants, lu par l'orchestrateur" },
      { left: "/actuator/info", right: "Version, commit et date de build : quelle version tourne ?" },
      { left: "/actuator/loggers", right: "Changer un niveau de journalisation à chaud, sans redéployer" },
      { left: "/actuator/threaddump", right: "État de tous les threads, sans accès à la machine" },
    ],
    explanation:
      "`loggers` et `threaddump` sont les deux qui changent la vie en incident : le premier permet d'observer en `DEBUG` puis de revenir en arrière sans redéployer — donc sans effacer l'état —, le second donne par HTTP ce qui aurait demandé un accès à la machine.",
  },
  {
    kind: "recall",
    id: "spring-autour-03",
    difficulty: 2,
    tags: ["spring", "actuator"],
    prompt: "Comment protéger Actuator, et pourquoi renseigner `info` ?",
    explanation:
      "Deux approches, souvent combinées. La plus simple est le **port séparé** — `management.server.port` — que le réseau n'expose qu'aux outils internes : le point de terminaison n'est alors tout bonnement pas joignable de l'extérieur, indépendamment de la configuration de sécurité applicative. La seconde est une `SecurityFilterChain` dédiée avec `EndpointRequest.toAnyEndpoint()` exigeant un rôle, nécessaire quand tout passe par le même point d'entrée, mais dépendante d'une configuration qu'un changement ultérieur peut affaiblir. Quant à `info`, il répond à la toute première question de n'importe quel incident : quelle version tourne réellement ? Renseigné par les greffons de build, il expose la version, l'empreinte du commit et la date de compilation, et évite le dialogue classique où personne ne sait avec certitude ce qui est déployé.",
    keyPoints: [
      "Port séparé : le plus simple et le plus robuste",
      "Sinon une SecurityFilterChain dédiée aux endpoints",
      "info répond à « quelle version tourne ? »",
      "Renseigné automatiquement par les greffons de build",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Les sondes : vivacité et disponibilité
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-autour-l2",
  title: "Les sondes : vivacité et disponibilité",
  blocks: [
    {
      kind: "text",
      text: "Un orchestrateur pose deux questions très différentes à une application, et les confondre provoque des incidents spectaculaires. La première est « faut-il te redémarrer ? ». La seconde est « puis-je t'envoyer du trafic ? ». Une même sonde branchée sur les deux transforme une panne passagère de dépendance en redémarrage en boucle de toute la flotte.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Deux sondes, deux significations.",
      code: `management:
  endpoint:
    health:
      probes:
        enabled: true      # actif d'office sur Kubernetes
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState,db

# GET /actuator/health/liveness
#   « Suis-je vivant ? »  → NON = redémarrage
#   Ne doit dépendre QUE de l'état interne.
#
# GET /actuator/health/readiness
#   « Puis-je servir ? »  → NON = retrait du trafic
#   Peut dépendre des dépendances indispensables.`,
    },
    {
      kind: "text",
      text: "La règle tient en une phrase : la **vivacité** ne doit dépendre que de l'état interne de l'application, jamais d'une dépendance externe. Si la base est momentanément indisponible, redémarrer les instances n'y change rien — la base reste indisponible, et l'on ajoute une tempête de redémarrages à la panne initiale. La bonne réponse est de retirer les instances du trafic, pas de les tuer.",
    },
    {
      kind: "text",
      text: "La **disponibilité**, elle, peut légitimement dépendre de ce sans quoi l'application ne sait rien faire. Une instance dont la base est injoignable n'a rien à faire dans le répartiteur de charge : la retirer permet aux instances saines, s'il y en a, d'absorber le trafic, et évite de renvoyer des erreurs à des utilisateurs qu'on aurait pu servir ailleurs.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un indicateur de santé maison, et le piège à éviter.",
      code: `@Component
class FacturationHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            // Un appel COURT, avec délai maximal explicite.
            client.ping(Duration.ofSeconds(2));
            return Health.up().withDetail("latence", "ok").build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}

// Piège : un indicateur lent rend la sonde lente. Une
// sonde qui n'a pas répondu dans le délai est
// considérée en échec — et l'instance est tuée pour
// une raison qui n'a rien à voir avec sa santé.`,
    },
    {
      kind: "text",
      text: "Un indicateur de santé maison doit être rapide et borné. Il est interrogé toutes les quelques secondes, en permanence, par l'orchestrateur ; un appel réseau sans délai maximal y transforme une lenteur externe en échec de sonde, donc en redémarrage. Le délai explicite n'est pas une précaution facultative, c'est ce qui rend la sonde honnête.",
    },
    {
      kind: "comparison",
      title: "Deux erreurs symétriques",
      left: {
        label: "Vivacité trop stricte",
        text: "Elle inclut la base ou un service externe. Une panne de dépendance redémarre toute la flotte, ce qui vide les caches, rouvre toutes les connexions et aggrave la charge au pire moment. C'est l'erreur la plus coûteuse du domaine.",
      },
      right: {
        label: "Disponibilité trop laxiste",
        text: "Elle répond toujours vrai. Le répartiteur envoie du trafic à une instance incapable de le traiter, et les utilisateurs reçoivent des erreurs alors qu'une instance saine aurait pu les servir. Moins spectaculaire, mais silencieusement coûteux.",
      },
    },
    {
      kind: "text",
      text: "Une troisième sonde existe et rend service au démarrage : la sonde de **démarrage**. Elle laisse à une application lente à s'initialiser — chargement de caches, migrations, préchauffage — le temps de finir, sans que la sonde de vivacité, plus impatiente, ne la tue avant qu'elle n'ait démarré. C'est la réponse propre au réflexe qui consiste à allonger les délais de la vivacité.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "L'arrêt en douceur complète les sondes",
      text: "`server.shutdown: graceful` laisse les requêtes en cours se terminer avant l'arrêt, au lieu de les couper net. Combiné à un délai entre le retrait du trafic et l'arrêt effectif, il rend les déploiements invisibles pour les utilisateurs. Sans lui, chaque mise à jour produit une salve d'erreurs, courte mais bien réelle.",
    },
    {
      kind: "text",
      text: "Un dernier réglage évite une classe entière de faux positifs : le détail de la santé n'est exposé que si l'appelant est autorisé. Un `/actuator/health` public qui énumère les composants et leurs messages d'erreur renseigne un attaquant sur l'architecture interne — noms de bases, adresses de services, versions. `show-details: when-authorized` laisse l'orchestrateur voir l'état global sans divulguer le détail.",
    },
    {
      kind: "text",
      text: "Retenons la formulation qui évite l'incident : la vivacité répond « redémarre-moi », la disponibilité répond « envoie-moi du trafic ». Ce ne sont pas deux niveaux de la même question mais deux questions distinctes, et la seule règle à ne jamais enfreindre est qu'une dépendance externe n'a rien à faire dans la première.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "spot",
    id: "spring-autour-04",
    difficulty: 3,
    tags: ["spring", "actuator", "exploitation"],
    prompt: "Cette configuration provoque un redémarrage en boucle de toute la flotte dès que la base a un hoquet. Quelle ligne ?",
    code: {
      language: "yaml",
      code: `management:
  endpoint:
    health:
      group:
        liveness:
          include: livenessState,db
        readiness:
          include: readinessState,db`,
    },
    faultyLine: 6,
    reasons: [
      "La vivacité inclut la base : une panne de dépendance fait tuer les instances, ce qui n'y change rien et aggrave la situation.",
      "La disponibilité ne devrait pas inclure la base, qui n'est pas indispensable au service.",
      "Les deux groupes ne peuvent pas inclure le même indicateur `db`.",
      "Il manque `probes.enabled: true` pour que les groupes soient pris en compte.",
    ],
    reasonAnswer: 0,
    explanation:
      "La vivacité répond à « faut-il me redémarrer ? » et ne doit dépendre que de l'état interne. Si la base est indisponible, redémarrer n'y change rien : la base reste indisponible, et l'on ajoute une tempête de redémarrages — caches vidés, connexions rouvertes — à la panne initiale. La disponibilité, elle, peut légitimement inclure `db` : retirer l'instance du trafic est la bonne réaction.",
  },
  {
    kind: "mcq",
    id: "spring-autour-05",
    difficulty: 2,
    tags: ["spring", "actuator"],
    prompt: "À quoi sert la sonde de démarrage, en plus des deux autres ?",
    choices: [
      "Laisser à une application lente à s'initialiser le temps de finir, sans que la vivacité ne la tue avant.",
      "Vérifier que la configuration est valide avant le premier démarrage.",
      "Signaler à l'orchestrateur que l'application peut recevoir du trafic.",
      "Déclencher le préchauffage des caches au premier appel reçu.",
    ],
    answer: 0,
    explanation:
      "Une application qui charge des caches ou applique des migrations peut mettre une minute à démarrer, alors que la sonde de vivacité est réglée pour réagir en quelques secondes. La sonde de démarrage suspend la vivacité tant que l'initialisation dure — ce qui est la réponse propre, au lieu d'allonger les délais de la vivacité et de perdre sa réactivité une fois l'application en régime.",
  },
  {
    kind: "recall",
    id: "spring-autour-06",
    difficulty: 2,
    tags: ["spring", "actuator"],
    prompt: "Quelle différence entre vivacité et disponibilité, et pourquoi un indicateur maison doit-il être borné ?",
    explanation:
      "La **vivacité** répond à « faut-il me redémarrer ? » et ne doit dépendre que de l'état interne : une dépendance externe en panne n'est pas réparée par un redémarrage, et l'inclure transforme une panne de base en tempête de redémarrages qui vide les caches et rouvre toutes les connexions au pire moment. La **disponibilité** répond à « puis-je servir ? » et peut légitimement dépendre de ce sans quoi l'application ne sait rien faire — la retirer du répartiteur laisse les instances saines absorber le trafic. Un indicateur maison doit être rapide et borné par un délai explicite parce qu'il est interrogé en permanence : un appel réseau sans limite de temps transforme une lenteur externe en échec de sonde, donc en redémarrage pour une raison qui n'a rien à voir avec la santé de l'instance.",
    keyPoints: [
      "Vivacité : « redémarre-moi », état interne uniquement",
      "Disponibilité : « envoie-moi du trafic », dépendances admises",
      "Une dépendance dans la vivacité = tempête de redémarrages",
      "Indicateur maison : appel court, délai maximal explicite",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Journalisation structurée et contexte
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-autour-l3",
  title: "Journalisation structurée et contexte",
  blocks: [
    {
      kind: "text",
      text: "Un journal utile n'est pas un journal bavard. En production, plusieurs requêtes s'entrelacent sur des threads différents, et des lignes correctes prises isolément deviennent inexploitables : on lit « échec du paiement » sans savoir pour quel client, dans quelle requête, ni ce qui s'est passé juste avant pour ce même utilisateur.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Deux défauts très répandus.",
      code: `// 1. Concaténation : coût payé même si le niveau est
//    désactivé, et rien n'est exploitable ensuite.
log.debug("Client " + id + " total " + calculLourd());

// → forme correcte : les paramètres ne sont évalués
//   que si le niveau est actif.
log.debug("Client {} total {}", id, total);

// 2. Journaliser ET relancer : la même erreur apparaît
//    trois fois dans le journal, à trois endroits.
try { ... } catch (Exception e) {
    log.error("Erreur", e);
    throw e;                    // ← qui la journalisera
}                               //   de nouveau plus haut`,
    },
    {
      kind: "text",
      text: "La concaténation dans un appel de journalisation coûte même quand le niveau est désactivé, puisque l'argument est construit avant l'appel. Les accolades de remplacement évitent ce coût et rendent la ligne analysable. Quant au couple journaliser-puis-relancer, il produit la même erreur en plusieurs exemplaires : on choisit, soit on traite, soit on laisse remonter.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le contexte de diagnostic : corréler sans polluer.",
      code: `@Component
public class ContexteFiltre extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        MDC.put("requestId", idDe(req));
        MDC.put("utilisateur", loginCourant());
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.clear();     // INDISPENSABLE : le thread
        }                    // retourne au pool et servira
    }                        // quelqu'un d'autre
}`,
    },
    {
      kind: "text",
      text: "Le contexte de diagnostic attache des valeurs au thread courant, et le format de sortie les ajoute à chaque ligne sans qu'on ait à les répéter. On peut alors reconstituer une requête entière en filtrant sur son identifiant — y compris à travers plusieurs services si l'identifiant est propagé. C'est la différence entre chercher dans un journal et le lire.",
    },
    {
      kind: "text",
      text: "Le nettoyage dans le bloc `finally` n'est pas une précaution de style : le contexte est stocké dans une variable de thread, et le thread retourne au pool pour servir quelqu'un d'autre. Sans nettoyage, les lignes de l'utilisateur suivant portent l'identité du précédent — une fuite d'information dans les journaux, et un diagnostic qui désigne la mauvaise personne.",
    },
    {
      kind: "comparison",
      title: "Deux formats de sortie",
      left: {
        label: "Texte lisible",
        text: "Confortable en développement, où l'on lit avec les yeux. Impossible à interroger sérieusement : extraire « toutes les erreurs de paiement du client 42 » suppose des expressions régulières fragiles sur un format qui change.",
      },
      right: {
        label: "JSON structuré",
        text: "Une ligne, un objet, des champs nommés. Illisible à l'œil nu mais interrogeable par les outils de collecte. C'est le format à produire en production ; Spring Boot 3.4 l'expose par simple configuration.",
      },
    },
    {
      kind: "text",
      text: "Le choix des niveaux mérite d'être explicite dans une équipe, faute de quoi chacun applique le sien. Une convention simple fonctionne : `ERROR` pour ce qui exige une action humaine, `WARN` pour ce qui est anormal mais géré, `INFO` pour les événements métier marquants, `DEBUG` pour le détail utile en diagnostic. Un `ERROR` qui n'appelle aucune action finit par être ignoré, et emporte avec lui ceux qui en appelaient une.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ce qui n'a rien à faire dans un journal",
      text: "Mots de passe, jetons, numéros de carte, contenu complet d'un corps de requête. Les journaux sont souvent moins protégés que la base : dupliqués sur plusieurs machines, envoyés à un service tiers de collecte, conservés des mois et consultables par toute l'équipe. Une donnée personnelle y a une durée de vie et une diffusion que personne n'a décidées.",
    },
    {
      kind: "text",
      text: "La propagation du contexte à travers les services est ce qui rend le procédé réellement utile en architecture distribuée. Un identifiant de corrélation transmis en en-tête, relu à l'entrée de chaque service et replacé dans le contexte de diagnostic, permet de reconstituer un appel qui traverse quatre applications. Sans lui, il faut recouper des horodatages à la main, ce qui devient impossible dès que le trafic monte.",
    },
    {
      kind: "text",
      text: "Signalons enfin que les niveaux se changent à chaud par Actuator, ce qui rend viable une politique par défaut peu bavarde. On tourne en `INFO`, et l'on passe le paquet concerné en `DEBUG` le temps d'observer un problème. C'est très supérieur au réflexe qui consiste à tout journaliser en permanence « au cas où » — coûteux en volume, et noyant l'information utile.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "fill",
    id: "spring-autour-07",
    difficulty: 2,
    tags: ["spring", "logging"],
    prompt: "Complète le filtre de contexte de diagnostic.",
    code: {
      language: "java",
      code: `{{1}}.put("requestId", idDe(req));
try {
    chain.doFilter(req, res);
} {{2}} {
    MDC.clear();
}`,
    },
    blanks: ["MDC", "finally"],
    distractors: ["ThreadLocal", "Logger", "catch", "else"],
    explanation:
      "`MDC` attache des valeurs au thread courant, que le format de sortie ajoute à chaque ligne. Le nettoyage doit avoir lieu dans un `finally` : le thread retourne au pool et servira quelqu'un d'autre. Sans cela, les lignes de l'utilisateur suivant portent l'identité du précédent — une fuite dans les journaux et un diagnostic qui désigne la mauvaise personne.",
  },
  {
    kind: "mcq",
    id: "spring-autour-08",
    difficulty: 2,
    tags: ["spring", "logging"],
    prompt: "Pourquoi préférer `log.debug(\"Client {}\", id)` à `log.debug(\"Client \" + id)` ?",
    choices: [
      "La concaténation est évaluée même si le niveau `DEBUG` est désactivé ; les accolades ne le sont que si nécessaire.",
      "La concaténation ne fonctionne pas avec les objets qui ne redéfinissent pas `toString`.",
      "Les accolades sont obligatoires pour que le journal soit accepté au format JSON.",
      "La concaténation empêche l'ajout du contexte de diagnostic à la ligne.",
    ],
    answer: 0,
    explanation:
      "L'argument d'un appel est construit avant l'appel : la concaténation — et tout calcul qu'elle contient — a lieu même quand le niveau est désactivé et que la ligne sera jetée. Avec les accolades, les paramètres ne sont formatés que si le niveau est actif. Le gain devient considérable sur un appel en boucle chaude.",
  },
  {
    kind: "recall",
    id: "spring-autour-09",
    difficulty: 2,
    tags: ["spring", "logging"],
    prompt: "Quelles règles suivre pour qu'un journal reste exploitable en production ?",
    explanation:
      "D'abord un **format structuré** : une ligne, un objet, des champs nommés, interrogeable par les outils de collecte plutôt que par des expressions régulières fragiles. Ensuite un **contexte de corrélation** attaché au thread — identifiant de requête, utilisateur — nettoyé dans un `finally` sous peine de voir les lignes suivantes porter l'identité du précédent. Puis des **niveaux tenus** : `ERROR` pour ce qui exige une action humaine, `WARN` pour l'anormal mais géré, `INFO` pour les événements métier marquants, `DEBUG` pour le diagnostic — un `ERROR` qui n'appelle aucune action finit ignoré et emporte avec lui ceux qui en appelaient une. Enfin, ne jamais y écrire de secret ni de donnée personnelle : les journaux sont dupliqués, envoyés à un tiers, conservés des mois et consultables par toute l'équipe. On évite aussi de journaliser puis relancer, qui produit la même erreur en plusieurs exemplaires.",
    keyPoints: [
      "Format structuré, interrogeable par les outils",
      "Contexte de corrélation, nettoyé dans un finally",
      "Niveaux tenus : un ERROR appelle une action",
      "Aucun secret ni donnée personnelle ; ne pas journaliser puis relancer",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Le cache applicatif
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-autour-l4",
  title: "Le cache applicatif",
  blocks: [
    {
      kind: "text",
      text: "Mettre en cache est la première optimisation à laquelle on pense et souvent la dernière qu'il faudrait faire. Un cache masque un coût sans le supprimer, introduit un risque de donnée périmée, et déplace la complexité vers l'invalidation — réputée être l'un des deux problèmes difficiles de l'informatique. Il vaut donc la peine de vérifier d'abord qu'on ne peut pas simplement rendre l'opération moins coûteuse.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'abstraction de cache de Spring, en trois annotations.",
      code: `@Configuration
@EnableCaching
class CacheConfig { }

@Service
public class TarifService {

    @Cacheable(value = "tarifs", key = "#reference")
    public Tarif get(String reference) {
        return depot.charge(reference);      // appelé une fois
    }

    @CacheEvict(value = "tarifs", key = "#tarif.reference")
    public void maj(Tarif tarif) { depot.save(tarif); }

    @CachePut(value = "tarifs", key = "#tarif.reference")
    public Tarif remplace(Tarif tarif) {     // exécute ET met
        return depot.save(tarif);            // le cache à jour
    }
}`,
    },
    {
      kind: "text",
      text: "La distinction entre les trois annotations se retient facilement. `@Cacheable` **évite** l'exécution si la valeur est en cache. `@CachePut` exécute **toujours** et met le résultat en cache. `@CacheEvict` retire une entrée. Confondre les deux premières est fréquent : mettre `@Cacheable` sur une méthode d'écriture ferait qu'à partir du second appel, l'écriture n'aurait tout simplement pas lieu.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le piège qui annule tout : l'appel interne.",
      code: `@Service
public class Rapport {

    @Cacheable("rapports")
    public String genere(String id) {
        System.out.println("calcul " + id);
        return coûteux(id);
    }

    public String deuxFois(String id) {
        return genere(id) + genere(id);   // appel via « this »
    }                                     // → le proxy est
}                                         //   court-circuité

// deuxFois("a") affiche « calcul a » DEUX fois :
// le cache n'est jamais consulté.`,
    },
    {
      kind: "text",
      text: "C'est le même mécanisme que pour `@Transactional`, `@Async` et `@PreAuthorize` : l'annotation est portée par un **proxy** qui enveloppe le bean. Un appel interne part de `this` et ne traverse jamais ce proxy — l'annotation est donc ignorée, en silence. La correction consiste à déplacer la méthode annotée dans un autre bean, ou à s'injecter soi-même, ce qui est un aveu déguisé que le découpage est à revoir.",
    },
    {
      kind: "comparison",
      title: "Deux natures de cache",
      left: {
        label: "Local, en mémoire",
        text: "Caffeine, ou la carte concurrente par défaut. Très rapide, aucune infrastructure. Mais chaque instance a le sien : dix instances, dix caches, dix versions possibles de la même donnée, et une invalidation qui n'atteint que l'instance qui l'a émise.",
      },
      right: {
        label: "Distribué",
        text: "Redis, Hazelcast. Une seule vérité partagée, invalidation globale, survit au redémarrage. En échange, un aller-retour réseau à chaque lecture, un composant de plus à exploiter, et la sérialisation des valeurs à gérer.",
      },
    },
    {
      kind: "text",
      text: "Le cache local sur plusieurs instances est un piège classique : tout fonctionne en développement, où il n'y a qu'une instance, et se met à produire des incohérences en production. Un utilisateur voit une valeur à jour puis, la requête suivante ayant atterri sur une autre instance, la valeur ancienne. Le symptôme — « ça change quand j'actualise » — est déroutant tant qu'on n'a pas pensé au cache.",
    },
    {
      kind: "text",
      text: "Deux options méritent d'être connues. `sync = true` évite que dix requêtes simultanées sur une clé absente ne déclenchent dix calculs identiques — un seul thread calcule, les autres attendent. Et `unless` permet de ne pas mettre en cache certains résultats, typiquement une valeur nulle ou une liste vide, qu'on ne veut pas figer.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un cache sans limite est une fuite",
      text: "La carte concurrente utilisée par défaut n'a **aucune limite de taille** ni d'expiration : elle grandit indéfiniment. Sur une clé à forte cardinalité — un identifiant utilisateur, une chaîne libre — c'est une fuite mémoire garantie qui finira en `OutOfMemoryError`. Toute mise en cache doit s'accompagner d'une taille maximale et d'une durée de vie, ce que fournit Caffeine.",
    },
    {
      kind: "text",
      text: "Un mot sur la clé de cache, qui décide de tout. Par défaut, Spring la construit à partir de tous les paramètres de la méthode : oublier qu'un paramètre technique en fait partie — un objet de pagination, un contexte — produit une clé différente à chaque appel et un cache qui n'est jamais touché. À l'inverse, une clé trop grossière fait servir la donnée d'un utilisateur à un autre, ce qui est nettement plus grave.",
    },
    {
      kind: "text",
      text: "Retenons l'ordre des questions : peut-on rendre l'opération moins coûteuse plutôt que de la cacher ? Si le cache s'impose, quelle péremption est acceptable pour le métier, quelle taille maximale, et que se passe-t-il avec plusieurs instances ? Un cache ajouté sans réponse à ces trois questions règle un problème de latence en en créant un de cohérence.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "spring-autour-10",
    difficulty: 3,
    tags: ["spring", "cache", "proxy"],
    prompt: "Le cache n'est jamais consulté et le calcul a lieu deux fois. Quelle ligne l'explique ?",
    code: {
      language: "java",
      code: `@Service
public class Rapport {
    @Cacheable("rapports")
    public String genere(String id) {
        return coûteux(id);
    }
    public String deuxFois(String id) {
        return genere(id) + genere(id);
    }
}`,
    },
    faultyLine: 8,
    reasons: [
      "L'appel se fait via `this` et court-circuite le proxy qui porte l'annotation : `@Cacheable` est ignorée.",
      "`@Cacheable` ne fonctionne pas sur une méthode dont le paramètre est une `String`.",
      "Il manque l'attribut `key` sur `@Cacheable`, sans lequel aucune entrée n'est créée.",
      "La méthode `deuxFois` devrait elle aussi porter `@Cacheable` pour que le cache s'active.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'annotation est portée par un proxy qui enveloppe le bean, exactement comme `@Transactional`, `@Async` et `@PreAuthorize`. Un appel interne part de `this` et ne traverse jamais ce proxy : le cache n'est pas consulté et rien ne le signale. La correction consiste à déplacer la méthode annotée dans un autre bean — s'injecter soi-même est un aveu déguisé que le découpage est à revoir.",
  },
  {
    kind: "mcq",
    id: "spring-autour-11",
    difficulty: 2,
    tags: ["spring", "cache"],
    prompt: "Quelle différence entre `@Cacheable` et `@CachePut` ?",
    choices: [
      "`@Cacheable` évite l'exécution si la valeur est en cache ; `@CachePut` exécute toujours et met le résultat en cache.",
      "`@CachePut` ne fonctionne que sur les caches distribués, `@Cacheable` sur les caches locaux.",
      "`@Cacheable` met en cache les lectures, `@CachePut` invalide les entrées après écriture.",
      "Les deux sont équivalentes : `@CachePut` est un alias hérité des versions antérieures.",
    ],
    answer: 0,
    explanation:
      "La confusion est fréquente et coûteuse : poser `@Cacheable` sur une méthode d'écriture ferait qu'à partir du second appel, l'écriture n'aurait tout simplement pas lieu — la valeur en cache serait renvoyée sans que la méthode ne s'exécute. `@CachePut` est faite pour ce cas : elle exécute toujours et rafraîchit l'entrée. `@CacheEvict` est celle qui retire.",
  },
  {
    kind: "recall",
    id: "spring-autour-12",
    difficulty: 2,
    tags: ["spring", "cache"],
    prompt: "Quelles questions poser avant d'ajouter un cache ?",
    explanation:
      "D'abord : peut-on rendre l'opération moins coûteuse plutôt que de la masquer ? Un cache ne supprime pas un coût, il le cache — souvent au prix d'un index manquant qu'on aurait pu ajouter. Ensuite : quelle **péremption** est acceptable pour le métier ? Servir un tarif vieux de dix minutes n'a pas les mêmes conséquences selon le domaine, et c'est une décision métier, pas technique. Puis : quelle **taille maximale** ? La carte concurrente par défaut n'a ni limite ni expiration, si bien qu'une clé à forte cardinalité produit une fuite mémoire garantie. Enfin : que se passe-t-il avec **plusieurs instances** ? Un cache local devient dix caches divergents en production, avec une invalidation qui n'atteint que l'instance qui l'a émise — d'où le symptôme déroutant d'une valeur qui change quand on actualise.",
    keyPoints: [
      "Peut-on rendre l'opération moins coûteuse d'abord ?",
      "Quelle péremption le métier accepte-t-il ?",
      "Taille maximale et expiration : sans elles, c'est une fuite",
      "Plusieurs instances : dix caches locaux divergents",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Les tâches planifiées
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "spring-autour-l5",
  title: "Les tâches planifiées",
  blocks: [
    {
      kind: "text",
      text: "Planifier une tâche paraît anodin : une annotation, une expression, et le traitement tourne toutes les nuits. Trois pièges attendent pourtant, et les trois ne se manifestent qu'en production — sur plusieurs instances, sous charge, ou le jour où une exécution dépasse son créneau.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Trois façons de planifier, qui ne veulent pas dire la même chose.",
      code: `@Configuration
@EnableScheduling
class PlanificationConfig { }

@Component
public class Taches {

    // Toutes les 5 s à partir de la FIN de l'exécution
    // précédente : jamais de chevauchement, l'écart
    // réel dépend de la durée du traitement.
    @Scheduled(fixedDelay = 5000)
    void purge() { … }

    // Toutes les 5 s à partir du DÉBUT de la précédente.
    // Si le traitement dure plus longtemps, les
    // exécutions se pressent — ou s'accumulent.
    @Scheduled(fixedRate = 5000)
    void mesure() { … }

    // Tous les jours à 3 h 15, fuseau explicite.
    @Scheduled(cron = "0 15 3 * * *", zone = "Europe/Paris")
    void rapportQuotidien() { … }
}`,
    },
    {
      kind: "text",
      text: "`fixedDelay` compte à partir de la **fin** de l'exécution précédente, `fixedRate` à partir de son **début**. Le premier garantit un intervalle de repos entre deux traitements ; le second vise une cadence, et se retrouve en difficulté dès qu'une exécution dépasse la période. Le choix se fait selon qu'on veut espacer ou cadencer, et l'on choisit `fixedDelay` en cas de doute.",
    },
    {
      kind: "text",
      text: "Le premier piège est que l'ordonnanceur par défaut n'a **qu'un seul thread**. Toutes les tâches planifiées de l'application se partagent ce thread : une tâche lente retarde toutes les autres, et une tâche bloquée les arrête définitivement. Dans une application qui accumule les traitements planifiés, ce détail finit toujours par se manifester, généralement au pire moment.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Dimensionner l'ordonnanceur, et rendre la tâche robuste.",
      code: `spring:
  task:
    scheduling:
      pool:
        size: 4          # défaut : 1

# Et dans la tâche elle-même :
#  · attraper les exceptions — une exception non
#    rattrapée dans une tâche fixedDelay ANNULE les
#    exécutions suivantes, en silence
#  · borner la durée
#  · journaliser début, fin et volume traité`,
    },
    {
      kind: "text",
      text: "Le second piège est plus insidieux : une exception non rattrapée dans une tâche planifiée **annule les exécutions suivantes**. La tâche ne s'exécute plus jamais, sans message ni alerte, et l'on s'en aperçoit des semaines plus tard en constatant qu'un traitement n'a pas tourné. Un bloc `try` englobant est donc obligatoire, avec journalisation de l'échec.",
    },
    {
      kind: "comparison",
      title: "Le troisième piège : plusieurs instances",
      left: {
        label: "Ce qu'on croit",
        text: "« La tâche tourne toutes les nuits à 3 h. » En réalité elle tourne sur **chaque** instance : trois instances, trois exécutions simultanées du même traitement, trois envois de la même relance, trois écritures concurrentes.",
      },
      right: {
        label: "Ce qu'il faut",
        text: "Un verrou partagé — ShedLock s'appuie sur la base ou Redis — pour qu'une seule instance exécute. Ou un ordonnanceur externe qui déclenche l'application par un appel, ce qui déplace la responsabilité hors du code.",
      },
    },
    {
      kind: "text",
      text: "Ce troisième piège est celui qui produit les incidents visibles pour les clients : trois courriels de relance au lieu d'un, trois prélèvements, trois lignes en double. Il ne se manifeste jamais en développement, où l'on ne lance qu'une instance, et apparaît le jour de la première mise à l'échelle — souvent longtemps après l'écriture de la tâche.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Toujours préciser le fuseau d'une expression cron",
      text: "Sans `zone`, l'expression suit le fuseau par défaut de la machine virtuelle, qui dépend de la machine et diffère souvent entre le poste de développement et le conteneur — réglé en UTC dans la plupart des images. Une tâche prévue à 3 h du matin s'exécute alors à 4 h ou à 2 h selon la saison, avec un décalage qui change au passage à l'heure d'été.",
    },
    {
      kind: "text",
      text: "Une tâche planifiée mérite enfin d'être observable. Journaliser son début, sa fin et le volume traité transforme une boîte noire en information exploitable : on voit immédiatement qu'elle n'a pas tourné cette nuit, ou qu'elle a traité zéro élément là où elle en traitait mille. Une métrique compteur, exposée par Actuator, permet même d'alerter sur son absence — ce qu'aucun journal ne fait tout seul.",
    },
    {
      kind: "text",
      text: "En résumé : choisir `fixedDelay` par défaut, dimensionner l'ordonnanceur au-delà d'une tâche, envelopper le corps dans un `try`, préciser le fuseau, et poser un verrou partagé dès qu'il peut y avoir plusieurs instances. Cinq précautions qui tiennent en quelques lignes et évitent des incidents difficiles à relier à leur cause.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "output",
    id: "spring-autour-13",
    difficulty: 3,
    tags: ["spring", "scheduling"],
    prompt: "Ordonnanceur laissé à sa configuration par défaut. À quel rythme les lignes apparaissent-elles ?",
    code: {
      language: "java",
      code: `@Scheduled(fixedRate = 1000)
void tache() throws InterruptedException {
    System.out.println("debut");
    Thread.sleep(3000);
}`,
    },
    choices: [
      "Environ toutes les 3 secondes : l'ordonnanceur n'a qu'un thread, les exécutions ne peuvent pas se chevaucher.",
      "Toutes les secondes : `fixedRate` lance une exécution par seconde, en parallèle.",
      "Toutes les 4 secondes : la période s'ajoute à la durée du traitement.",
      "Une seule fois : `fixedRate` est incompatible avec un traitement de plus d'une seconde.",
    ],
    answer: 0,
    explanation:
      "`fixedRate` vise une cadence d'une seconde, mais l'ordonnanceur par défaut ne dispose que d'un seul thread : une exécution ne peut pas démarrer tant que la précédente n'est pas finie. Les lancements s'enchaînent donc au rythme du traitement, soit environ toutes les 3 secondes. C'est le premier piège de la planification — un thread unique partagé par toutes les tâches de l'application.",
  },
  {
    kind: "mcq",
    id: "spring-autour-14",
    difficulty: 3,
    tags: ["spring", "scheduling"],
    prompt: "Que se passe-t-il si une tâche `@Scheduled(fixedDelay = …)` lève une exception non rattrapée ?",
    choices: [
      "Les exécutions suivantes sont annulées : la tâche ne tourne plus jamais, sans alerte.",
      "L'exception est journalisée et la tâche reprend au cycle suivant.",
      "L'application s'arrête, l'exception remontant au thread principal.",
      "La tâche est réessayée immédiatement, jusqu'à trois fois.",
    ],
    answer: 0,
    explanation:
      "C'est le piège le plus silencieux de la planification : l'ordonnanceur annule la planification et rien ne le signale. On s'en aperçoit des semaines plus tard en constatant qu'un traitement n'a pas tourné. Un bloc `try` englobant, avec journalisation de l'échec, est donc obligatoire dans toute tâche planifiée.",
  },
  {
    kind: "recall",
    id: "spring-autour-15",
    difficulty: 2,
    tags: ["spring", "scheduling"],
    prompt: "Quelles précautions prendre sur une tâche planifiée déployée en plusieurs instances ?",
    explanation:
      "La première est de comprendre qu'elle s'exécutera sur **chaque instance** : trois instances signifient trois exécutions simultanées du même traitement, donc trois relances envoyées, trois prélèvements, trois lignes en double. C'est l'incident visible par les clients, et il n'apparaît jamais en développement où l'on ne lance qu'une instance. La parade est un verrou partagé — ShedLock s'appuyant sur la base ou Redis — pour qu'une seule instance exécute réellement, ou un ordonnanceur externe qui déclenche l'application par un appel, ce qui déplace la responsabilité hors du code. S'ajoutent quatre précautions indépendantes : préférer `fixedDelay` à `fixedRate` en cas de doute, dimensionner l'ordonnanceur au-delà d'une tâche puisqu'il n'a qu'un thread par défaut, envelopper le corps dans un `try` sous peine de voir la planification annulée en silence, et préciser le fuseau d'une expression cron.",
    keyPoints: [
      "La tâche tourne sur chaque instance : doublons visibles par les clients",
      "Verrou partagé, ou ordonnanceur externe",
      "Un seul thread par défaut ; try obligatoire ; fuseau explicite",
      "fixedDelay par défaut plutôt que fixedRate",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — @Async et l'exécution en arrière-plan
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "spring-autour-l6",
  title: "@Async et l'exécution en arrière-plan",
  blocks: [
    {
      kind: "text",
      text: "Certains traitements n'ont pas à faire attendre l'utilisateur : envoyer un courriel de confirmation, produire une miniature, alimenter un index de recherche. Les exécuter en arrière-plan raccourcit la réponse, et `@Async` rend cela apparemment trivial — une annotation suffit. C'est précisément ce qui rend ses pièges dangereux : rien dans le code ne les signale.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'activation, et l'exécuteur qu'il faut fournir.",
      code: `@Configuration
@EnableAsync
class AsyncConfig {

    @Bean("notifications")
    Executor notifications() {
        var e = new ThreadPoolTaskExecutor();
        e.setCorePoolSize(4);
        e.setMaxPoolSize(8);
        e.setQueueCapacity(500);          // BORNÉE
        e.setThreadNamePrefix("notif-");  // visible en vidage
        e.setRejectedExecutionHandler(
            new ThreadPoolExecutor.CallerRunsPolicy());
        e.initialize();
        return e;
    }
}

@Async("notifications")
public void envoie(Commande c) { … }`,
    },
    {
      kind: "text",
      text: "Nommer l'exécuteur n'est pas une coquetterie. Sans exécuteur explicite, Spring en utilise un par défaut, partagé par toutes les méthodes asynchrones de l'application : une tâche lente y bloque les autres, et le préfixe des threads ne dit rien de ce qu'ils font. Un exécuteur par usage, avec un préfixe parlant et une file bornée, rend le comportement prévisible et le diagnostic possible.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Les trois pièges, en un seul exemple.",
      code: `@Service
public class Commandes {

    @Async
    public void notifie(Long id) {
        var user = SecurityContextHolder.getContext()
                .getAuthentication();     // (2) → null
        throw new IllegalStateException("échec");  // (3)
    }

    @Transactional
    public void valide(Long id) {
        depot.save(...);
        notifie(id);        // (1) appel interne : SYNCHRONE
    }                       //     et dans la transaction
}`,
    },
    {
      kind: "text",
      text: "Le premier piège est le même que pour le cache : l'appel interne part de `this`, ne traverse pas le proxy, et la méthode s'exécute **de façon synchrone**, dans le thread appelant. L'application fonctionne, la réponse est simplement aussi lente qu'avant, et rien ne signale que l'annotation n'a aucun effet. C'est un bug de performance parfaitement invisible.",
    },
    {
      kind: "text",
      text: "Le deuxième piège est la perte du contexte. L'identité, le contexte de diagnostic et la transaction sont attachés au thread ; la méthode asynchrone s'exécute sur un autre. `SecurityContextHolder` y renvoie `null`, les lignes de journal perdent leur identifiant de corrélation, et une transaction ouverte par l'appelant n'englobe pas le traitement — ce qui est souvent souhaitable, mais rarement compris.",
    },
    {
      kind: "comparison",
      title: "Deux signatures, deux comportements",
      left: {
        label: "Retour void",
        text: "L'appelant n'a aucun moyen de savoir si le traitement a réussi. Une exception ne remonte nulle part : elle est transmise à un gestionnaire global qu'il faut avoir défini, sans quoi elle disparaît silencieusement.",
      },
      right: {
        label: "Retour CompletableFuture",
        text: "L'appelant peut attendre, composer, réagir à l'échec. L'exception est portée par le futur et sera relayée à qui le consomme. C'est la signature à préférer dès qu'on veut savoir ce qui s'est passé.",
      },
    },
    {
      kind: "text",
      text: "Le troisième piège découle de là : une exception dans une méthode asynchrone qui renvoie `void` est perdue si aucun `AsyncUncaughtExceptionHandler` n'a été déclaré. Le courriel n'est pas parti, l'index n'est pas alimenté, et rien dans les journaux ne le dit. Déclarer ce gestionnaire est la première chose à faire en activant `@Async`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Asynchrone n'est pas fiable",
      text: "Une tâche en file d'attente disparaît si l'application s'arrête — déploiement, redémarrage, incident. Pour un envoi de courriel, c'est acceptable ; pour une écriture métier, non. Dès que la perte n'est pas tolérable, il faut persister l'intention — une table de sortie, une file de messages — et traiter depuis là, ce qui survit à l'arrêt.",
    },
    {
      kind: "text",
      text: "Signalons que les threads virtuels changent la donne sur le dimensionnement. Avec `spring.threads.virtual.enabled`, les tâches asynchrones s'exécutent sur des threads virtuels : bloquer ne coûte presque plus rien, et le réglage minutieux d'un pool devient largement inutile pour des traitements dominés par l'attente. Les autres pièges — appel interne, contexte perdu, exception avalée — restent entiers.",
    },
    {
      kind: "text",
      text: "Retenons donc : un exécuteur nommé et borné par usage, un gestionnaire d'exceptions déclaré, une signature qui renvoie un futur quand le résultat compte, la conscience que le contexte ne suit pas, et la règle qu'un traitement dont la perte n'est pas acceptable ne doit pas reposer sur une file en mémoire.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "spot",
    id: "spring-autour-16",
    difficulty: 3,
    tags: ["spring", "async", "proxy"],
    prompt: "La réponse HTTP reste aussi lente qu'avant l'ajout de `@Async`. Quelle ligne l'explique ?",
    code: {
      language: "java",
      code: `@Service
public class Commandes {
    @Async
    public void notifie(Long id) { envoiLent(id); }

    public void valide(Long id) {
        depot.save(id);
        notifie(id);
    }
}`,
    },
    faultyLine: 7,
    reasons: [
      "L'appel interne via `this` ne traverse pas le proxy : la méthode s'exécute de façon synchrone, dans le thread appelant.",
      "`@Async` ne fonctionne pas sur une méthode qui renvoie `void`.",
      "Il manque `@EnableAsync`, sans quoi l'application refuserait de démarrer.",
      "`notifie` devrait être déclarée `private` pour être exécutée en arrière-plan.",
    ],
    reasonAnswer: 0,
    explanation:
      "Comme pour `@Cacheable` et `@Transactional`, l'annotation est portée par un proxy qui enveloppe le bean. Un appel interne part de `this` et ne le traverse jamais : la méthode s'exécute normalement, dans le thread de la requête. L'application fonctionne, la réponse est simplement aussi lente qu'avant, et rien ne signale que l'annotation n'a aucun effet.",
  },
  {
    kind: "mcq",
    id: "spring-autour-17",
    difficulty: 2,
    tags: ["spring", "async"],
    prompt: "Une méthode `@Async` renvoyant `void` lève une exception. Que devient-elle ?",
    choices: [
      "Elle est perdue, sauf si un `AsyncUncaughtExceptionHandler` a été déclaré.",
      "Elle remonte à l'appelant, qui peut la rattraper normalement.",
      "Elle est automatiquement journalisée en `ERROR` par Spring.",
      "Elle provoque l'arrêt de l'exécuteur, qui refuse ensuite toute tâche.",
    ],
    answer: 0,
    explanation:
      "L'appelant est déjà reparti : il n'y a personne à qui remonter l'exception. Sans gestionnaire déclaré, elle disparaît en silence — le courriel n'est pas parti, l'index n'est pas alimenté, et rien ne le dit. Une signature renvoyant un `CompletableFuture` porte au contraire l'exception jusqu'à qui consomme le futur.",
  },
  {
    kind: "recall",
    id: "spring-autour-18",
    difficulty: 3,
    tags: ["spring", "async"],
    prompt: "Que perd-on en passant un traitement en `@Async` ?",
    explanation:
      "Le **contexte attaché au thread**, puisque le traitement s'exécute sur un autre. L'identité de sécurité disparaît — `SecurityContextHolder` y renvoie `null` —, le contexte de diagnostic aussi, si bien que les lignes de journal perdent leur identifiant de corrélation et deviennent impossibles à relier à la requête d'origine. La transaction de l'appelant n'englobe pas non plus le traitement, ce qui est souvent souhaitable mais rarement compris : la méthode asynchrone démarre sa propre transaction, ou aucune. Spring fournit des mécanismes de propagation pour la sécurité et le contexte de diagnostic, mais rien ne se propage automatiquement. On perd aussi la **fiabilité** : une tâche en file disparaît si l'application s'arrête, ce qui interdit d'y placer un traitement dont la perte n'est pas tolérable — il faut alors persister l'intention.",
    keyPoints: [
      "Identité de sécurité et contexte de diagnostic ne suivent pas",
      "La transaction de l'appelant n'englobe pas le traitement",
      "Rien ne se propage automatiquement",
      "Une file en mémoire ne survit pas à un redémarrage",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Les événements applicatifs
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "spring-autour-l7",
  title: "Les événements applicatifs",
  blocks: [
    {
      kind: "text",
      text: "Une commande validée doit décrémenter le stock, envoyer une confirmation, alimenter les statistiques et notifier le service de livraison. Écrire ces quatre appels dans le service de commande le rend dépendant de quatre autres, et chaque nouveau besoin ajoute une dépendance de plus à une classe qui ne devrait connaître que les commandes.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Publier un fait, plutôt qu'appeler des services.",
      code: `public record CommandeValidee(Long id, String client) { }

@Service
public class CommandeService {
    private final ApplicationEventPublisher publisher;

    @Transactional
    public void valide(Long id) {
        var commande = depot.valide(id);
        // On annonce un FAIT ; on ne commande rien.
        publisher.publishEvent(
            new CommandeValidee(commande.id(), commande.client()));
    }
}

@Component
class Confirmation {
    @EventListener
    void surCommandeValidee(CommandeValidee e) { … }
}`,
    },
    {
      kind: "text",
      text: "Le renversement est celui de la dépendance : le service de commande ne connaît plus les abonnés, et ajouter un traitement consiste à écrire une nouvelle classe sans toucher à l'existant. L'événement décrit un **fait passé** — « la commande a été validée » — et non une instruction, ce qui se voit dans le nom : un participe passé, jamais un impératif.",
    },
    {
      kind: "text",
      text: "Un point surprend souvent : les événements Spring sont **synchrones** par défaut. `publishEvent` appelle tous les abonnés l'un après l'autre, dans le thread courant, et ne rend la main qu'une fois tous terminés. Ce n'est donc pas un découplage temporel mais un découplage de **dépendances** — le code appelant ignore qui écoute, mais attend quand même.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Écouter après la validation de la transaction.",
      code: `@Component
class Confirmation {

    // Exécuté SEULEMENT si la transaction est validée.
    @TransactionalEventListener(phase = AFTER_COMMIT)
    void surCommandeValidee(CommandeValidee e) {
        courriels.envoie(e.client());
    }
}

// Sans cela, un @EventListener ordinaire s'exécute
// DANS la transaction : si elle est annulée ensuite,
// le courriel est déjà parti et annonce une commande
// qui n'existe pas.

// Pour ne pas bloquer l'appelant, on combine :
@Async
@TransactionalEventListener(phase = AFTER_COMMIT)
void surCommandeValideeAsync(CommandeValidee e) { … }`,
    },
    {
      kind: "text",
      text: "`@TransactionalEventListener` est l'outil qui rend le motif sûr. Un abonné ordinaire s'exécute dans la transaction du publieur : s'il envoie un courriel et que la transaction est annulée ensuite, le message est parti pour une commande qui n'existe pas. Attendre la validation résout ce cas, au prix d'une subtilité — un abonné exécuté après validation ne peut plus écrire dans la même transaction.",
    },
    {
      kind: "comparison",
      title: "Deux portées à ne pas confondre",
      left: {
        label: "Événement applicatif",
        text: "Interne au processus, synchrone par défaut, perdu si l'application s'arrête. Excellent pour découpler des modules d'un même déploiement. Ne franchit aucune frontière réseau et n'offre aucune garantie de livraison.",
      },
      right: {
        label: "Message sur une file",
        text: "Kafka, RabbitMQ. Franchit les frontières de service, persiste, se rejoue, garantit la livraison. Nécessaire dès qu'un autre déploiement doit réagir, ou dès que la perte de l'événement n'est pas acceptable.",
      },
    },
    {
      kind: "text",
      text: "Confondre les deux mène à des attentes déçues : un événement applicatif utilisé comme une file de messages perd silencieusement des traitements à chaque redémarrage. La règle est simple — l'événement applicatif découple **dans** un processus, la file de messages découple **entre** processus, et seule la seconde offre une garantie de livraison.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une exception d'un abonné remonte au publieur",
      text: "Les abonnés synchrones s'exécutent dans le thread du publieur : une exception levée par le troisième abonné remonte à l'appelant et, si une transaction est ouverte, l'annule. Un envoi de courriel qui échoue peut ainsi faire échouer la validation de la commande — l'inverse exact de ce que le découplage cherchait. D'où l'intérêt de la phase après validation, combinée à `@Async`.",
    },
    {
      kind: "text",
      text: "Spring publie lui-même des événements de cycle de vie qu'il est utile de connaître : `ApplicationReadyEvent` marque le moment où l'application est prête à servir, et c'est le bon endroit pour un préchauffage ou une vérification de démarrage. On le préfère à un bloc d'initialisation de bean, qui s'exécute trop tôt — alors que le contexte n'est pas entièrement construit.",
    },
    {
      kind: "text",
      text: "Retenons l'usage juste : publier un fait au passé, ne rien attendre en retour, écouter après validation quand un effet externe est en jeu, et passer à une file de messages dès que la frontière du processus est franchie ou que la perte devient inacceptable.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "order",
    id: "spring-autour-19",
    difficulty: 2,
    tags: ["spring", "events"],
    prompt: "Remets dans l'ordre ce qui se passe lors d'un `publishEvent` avec un abonné après validation.",
    items: [
      "Le service publie l'événement, à l'intérieur de sa transaction",
      "Spring enregistre l'abonné après-validation au lieu de l'appeler tout de suite",
      "La transaction se termine et est validée",
      "L'abonné s'exécute, hors transaction",
    ],
    explanation:
      "Un `@EventListener` ordinaire s'exécuterait à l'étape 1, dans la transaction : si celle-ci est annulée ensuite, le courriel est déjà parti pour une commande qui n'existe pas. La phase après validation déplace l'exécution après l'étape 3 — au prix d'une subtilité, l'abonné ne peut alors plus écrire dans la même transaction.",
  },
  {
    kind: "mcq",
    id: "spring-autour-20",
    difficulty: 2,
    tags: ["spring", "events"],
    prompt: "Les événements applicatifs Spring sont-ils asynchrones ?",
    choices: [
      "Non : ils sont synchrones par défaut, les abonnés s'exécutant dans le thread du publieur.",
      "Oui : chaque abonné s'exécute sur un thread dédié.",
      "Oui, mais seulement si l'application déclare `@EnableAsync`.",
      "Cela dépend : synchrones dans une transaction, asynchrones en dehors.",
    ],
    answer: 0,
    explanation:
      "`publishEvent` appelle tous les abonnés l'un après l'autre et ne rend la main qu'une fois tous terminés. Le découplage porte donc sur les **dépendances** — le publieur ignore qui écoute — et non sur le temps. Une exception levée par un abonné remonte d'ailleurs au publieur et peut annuler sa transaction. Pour découpler aussi dans le temps, on combine avec `@Async`.",
  },
  {
    kind: "match",
    id: "spring-autour-21",
    difficulty: 2,
    tags: ["spring", "events"],
    prompt: "Associe chaque besoin au mécanisme approprié.",
    pairs: [
      { left: "Découpler deux modules du même déploiement", right: "Événement applicatif, synchrone" },
      { left: "Un effet externe après validation de la transaction", right: "@TransactionalEventListener en phase AFTER_COMMIT" },
      { left: "Ne pas faire attendre l'appelant", right: "@Async combiné à l'abonné" },
      { left: "Un autre service doit réagir, sans perte possible", right: "Message sur une file persistante" },
    ],
    explanation:
      "L'événement applicatif découple **dans** un processus, la file de messages découple **entre** processus. Confondre les deux mène à des attentes déçues : un événement applicatif utilisé comme une file perd silencieusement des traitements à chaque redémarrage, puisqu'il ne persiste rien et n'offre aucune garantie de livraison.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — AOP : ce qui se passe derrière les annotations
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "spring-autour-l8",
  title: "AOP : ce qui se passe derrière les annotations",
  blocks: [
    {
      kind: "text",
      text: "`@Transactional`, `@Cacheable`, `@Async`, `@PreAuthorize` partagent un mécanisme et, par conséquent, les mêmes limites. Comprendre ce mécanisme une fois explique d'un coup pourquoi l'appel interne ne fonctionne jamais, pourquoi une méthode privée annotée est ignorée, et pourquoi certaines annotations semblent parfois sans effet.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce que Spring place réellement dans le contexte.",
      code: `Le bean que vous injectez n'est PAS votre classe :

  ┌─────────────────────────────┐
  │  Proxy                      │
  │   ┌─────────────────────┐   │
  │   │  avant : ouvrir la  │   │
  │   │  transaction        │   │
  │   │  ┌───────────────┐  │   │
  │   │  │ VOTRE OBJET   │  │   │
  │   │  └───────────────┘  │   │
  │   │  après : valider    │   │
  │   └─────────────────────┘   │
  └─────────────────────────────┘

Un appel VENU DE L'EXTÉRIEUR traverse le proxy.
Un appel interne via « this » part de l'objet du
centre : il ne traverse rien. L'annotation est
ignorée, en silence.`,
    },
    {
      kind: "text",
      text: "Cette image explique tout. Le bean injecté est une enveloppe qui intercepte les appels entrants, exécute un traitement transverse, puis délègue à l'objet réel. Un appel depuis l'intérieur de cet objet ne repasse jamais par l'enveloppe — c'est structurel, pas un défaut d'implémentation, et aucune annotation ne peut y remédier.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un aspect maison, pour mesurer sans polluer le métier.",
      code: `@Aspect
@Component
public class MesureAspect {

    @Around("@annotation(Chronometre)")
    public Object mesure(ProceedingJoinPoint pjp) throws Throwable {
        long debut = System.nanoTime();
        try {
            return pjp.proceed();          // exécute la méthode
        } finally {
            log.info("{} en {} ms",
                pjp.getSignature().toShortString(),
                (System.nanoTime() - debut) / 1_000_000);
        }
    }
}

// @Chronometre sur une méthode suffit ensuite.
// Le code métier ne contient aucune ligne de mesure.`,
    },
    {
      kind: "text",
      text: "Un aspect convient à ce qui traverse toute l'application sans appartenir à aucun métier : mesure, journalisation d'entrée-sortie, audit, reprise sur erreur. Le gain est de ne pas répéter la même mécanique dans cent méthodes. Le coût est que le comportement devient invisible à la lecture — quelqu'un qui lit la méthode ne voit pas ce qui l'entoure.",
    },
    {
      kind: "comparison",
      title: "Deux façons de fabriquer le proxy",
      left: {
        label: "Proxy dynamique JDK",
        text: "Utilisé quand le bean implémente une interface : le proxy implémente la même interface. Léger, mais le bean n'est alors injectable que par son interface — l'injecter par sa classe concrète échoue au démarrage.",
      },
      right: {
        label: "CGLIB",
        text: "Utilisé sinon : le proxy **hérite** de la classe. C'est le défaut de Spring Boot. Conséquence directe : une classe `final`, ou une méthode `final`, ne peut pas être proxifiée — l'annotation est alors ignorée sans erreur.",
      },
    },
    {
      kind: "text",
      text: "De là découlent des règles qu'on applique souvent sans les comprendre. Une méthode annotée doit être `public` et non `final`, la classe ne doit pas être `final`, et l'appel doit venir de l'extérieur du bean. Chacune de ces conditions, si elle n'est pas remplie, produit le même symptôme : l'annotation ne fait rien, et rien ne le dit.",
    },
    {
      kind: "text",
      text: "C'est ce silence qui rend le sujet important. Une transaction absente ne lève aucune erreur — les écritures ont lieu, chacune dans sa propre transaction implicite, et l'absence d'atomicité ne se découvre qu'au premier échec partiel. Un cache non consulté ne se voit que dans les temps de réponse. Une sécurité de méthode ignorée ne se voit pas du tout.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Vérifier qu'une annotation agit vraiment",
      text: "Le moyen le plus rapide est d'afficher la classe réelle du bean injecté : si elle contient `$$SpringCGLIB$$` ou `$Proxy`, le proxy est en place. Sinon, aucune annotation transverse n'aura d'effet. Un test d'intégration qui vérifie qu'un échec provoque bien une annulation vaut mieux encore — il attrape le cas où le proxy existe mais où l'appel interne le contourne.",
    },
    {
      kind: "text",
      text: "Un dernier effet de bord mérite d'être connu : le proxy fabriqué par héritage appelle le constructeur de la classe, et certains champs peuvent ne pas être initialisés au moment attendu. C'est l'une des raisons pour lesquelles on évite de placer de la logique dans un constructeur de bean, et pour lesquelles l'injection par constructeur — assignant seulement des champs finaux — reste la forme la plus sûre.",
    },
    {
      kind: "text",
      text: "Retenons la phrase qui résume le chapitre entier : ces annotations ne modifient pas votre code, elles l'**entourent**. Tout ce qui n'entre pas par la porte — appel interne, méthode privée ou finale, classe finale — passe à côté du traitement, sans erreur ni avertissement. C'est la cause commune de la moitié des surprises rencontrées avec Spring.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "output",
    id: "spring-autour-22",
    difficulty: 3,
    tags: ["spring", "aop", "cache"],
    prompt: "Premier appel à `deuxFois(\"a\")`, cache vide. Qu'affiche la console ?",
    code: {
      language: "java",
      code: `@Service
public class Rapport {
    @Cacheable("rapports")
    public String genere(String id) {
        System.out.println("calcul " + id);
        return "R" + id;
    }
    public String deuxFois(String id) {
        return genere(id) + genere(id);
    }
}`,
    },
    choices: [
      "« calcul a » deux fois : l'appel interne court-circuite le proxy, le cache n'est jamais consulté.",
      "« calcul a » une seule fois : le second appel est servi par le cache.",
      "Rien : `@Cacheable` empêche l'exécution du corps dès le premier appel.",
      "« calcul a » une fois, puis une exception au second appel.",
    ],
    answer: 0,
    explanation:
      "`deuxFois` appelle `genere` via `this` : l'appel ne traverse pas le proxy qui porte `@Cacheable`, et le cache n'est ni consulté ni alimenté. Le corps s'exécute donc deux fois. C'est le même mécanisme que pour `@Transactional`, `@Async` et `@PreAuthorize` — et le symptôme est toujours le même : l'annotation ne fait rien, en silence.",
  },
  {
    kind: "fill",
    id: "spring-autour-23",
    difficulty: 2,
    tags: ["spring", "aop"],
    prompt: "Complète l'aspect qui mesure la durée d'une méthode.",
    code: {
      language: "java",
      code: `@{{1}}
@Component
public class MesureAspect {

    @{{2}}("@annotation(Chronometre)")
    public Object mesure(ProceedingJoinPoint pjp) throws Throwable {
        long debut = System.nanoTime();
        try { return pjp.proceed(); }
        finally { log.info("{} ms", (System.nanoTime() - debut) / 1_000_000); }
    }
}`,
    },
    blanks: ["Aspect", "Around"],
    distractors: ["Configuration", "Before", "Pointcut", "AfterReturning"],
    explanation:
      "`@Aspect` déclare la classe comme porteuse de conseils, et `@Component` la fait détecter comme bean — les deux sont nécessaires. Seul `@Around` reçoit un `ProceedingJoinPoint` et peut décider quand — ou si — la méthode s'exécute, ce qui est indispensable ici pour encadrer l'appel et mesurer sa durée. `@Before` ne pourrait ni appeler `proceed` ni renvoyer une valeur.",
  },
  {
    kind: "mcq",
    id: "spring-autour-24",
    difficulty: 2,
    tags: ["spring", "aop"],
    prompt: "Pourquoi une méthode `final` annotée `@Transactional` ne fait-elle rien ?",
    choices: [
      "Le proxy CGLIB hérite de la classe et redéfinit les méthodes : il ne peut pas redéfinir une méthode `final`.",
      "`@Transactional` est incompatible avec le mot-clé `final` et provoque une erreur au démarrage.",
      "Une méthode `final` est appelée directement, sans passer par le conteneur Spring.",
      "Les transactions exigent que la méthode puisse être appelée plusieurs fois, ce qu'interdit `final`.",
    ],
    answer: 0,
    explanation:
      "Spring Boot fabrique les proxys par héritage avec CGLIB : le proxy est une sous-classe qui redéfinit les méthodes pour les intercepter. Une méthode `final` ne peut pas être redéfinie, donc l'appel atteint directement l'implémentation d'origine sans le traitement transverse. Le symptôme est le silence habituel : aucune erreur, aucune transaction.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-autour",
  title: "Autour du cœur : exploitation, cache, planification, événements, AOP",
  objective:
    "Rendre une application Spring exploitable : exposer et protéger Actuator, distinguer vivacité et disponibilité, produire des journaux corrélés, poser un cache sans créer d'incohérence, planifier sans doublons ni annulation silencieuse, exécuter en arrière-plan en sachant ce qu'on perd, découpler par événements, et comprendre le proxy qui porte toutes ces annotations.",
  prerequisites: ["spring-ioc"],
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
