/**
 * Spring — Configuration (référentiel 2.2).
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — D'où vient une valeur de configuration
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "spring-conf-l1",
  title: "D'où vient une valeur de configuration",
  blocks: [
    {
      kind: "text",
      text: "Un jour ou l'autre, la question tombe : l'application démarre en production avec un délai d'expiration de trente secondes alors que le fichier `application.yml` en indique cinq. Personne ne comprend, quelqu'un modifie le fichier, redéploie, et rien ne change. La cause est presque toujours la même : la valeur ne vient pas du fichier qu'on regarde, et l'on ignore d'où elle vient réellement.",
    },
    {
      kind: "text",
      text: "Spring ne lit pas « le fichier de configuration ». Il construit un objet `Environment` qui agrège une liste ordonnée de sources — les `PropertySource`. Arguments de ligne de commande, variables d'environnement, propriétés système Java, fichiers `application.yml` internes et externes, valeurs par défaut : chacune est une source, et toutes sont consultées dans un ordre fixe jusqu'à ce qu'une réponde.",
    },
    {
      kind: "code",
      language: "java",
      caption: "L'Environment est interrogeable directement.",
      code: `@Component
class ConfigDiagnostic {

    private final ConfigurableEnvironment env;

    ConfigDiagnostic(ConfigurableEnvironment env) { this.env = env; }

    @PostConstruct
    void whereDoesItComeFrom() {
        // La valeur effective, celle qui a gagné
        System.out.println(env.getProperty("app.timeout"));

        // Et la liste des sources, dans l'ordre de priorité
        for (PropertySource<?> ps : env.getPropertySources()) {
            System.out.println(ps.getName()
                + " → " + ps.getProperty("app.timeout"));
        }
    }
}`,
    },
    {
      kind: "text",
      text: "Ce petit diagnostic répond en trois lignes à la question qui fait perdre des heures. Il montre non seulement la valeur retenue mais toutes les sources qui en proposaient une, et dans quel ordre. En production, l'exposition `env` d'Actuator donne la même information par HTTP, en masquant les valeurs sensibles.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "La même question, sans redéployer.",
      code: `GET /actuator/env/app.timeout

{
  "property": { "source": "systemEnvironment", "value": "30s" },
  "propertySources": [
    { "name": "commandLineArgs" },
    { "name": "systemEnvironment",
      "property": { "value": "30s" } },
    { "name": "applicationConfig: [classpath:/application.yml]",
      "property": { "value": "5s" } }
  ]
}

# La variable d'environnement APP_TIMEOUT écrase le fichier.
# Modifier application.yml n'y changera jamais rien.`,
    },
    {
      kind: "text",
      text: "Ce mécanisme n'est pas une complication gratuite : c'est ce qui rend le même artefact déployable partout. Le fichier embarqué dans le jar porte les valeurs par défaut et celles du développement ; l'environnement de déploiement fournit ce qui lui est propre — adresse de base, identifiants, tailles de pool — sans qu'on ait à reconstruire l'application. Un jar, plusieurs environnements.",
    },
    {
      kind: "comparison",
      title: "Deux façons de lire une valeur",
      left: {
        label: "env.getProperty(\"app.timeout\")",
        text: "Consultation dynamique, à l'exécution, avec la possibilité de renvoyer `null`. Utile pour du diagnostic ou du code d'infrastructure. Aucune vérification au démarrage : une clé mal orthographiée passe inaperçue jusqu'à l'appel.",
      },
      right: {
        label: "@ConfigurationProperties",
        text: "Liaison au démarrage vers un objet typé, avec conversion et validation possibles. Une valeur absente ou invalide empêche l'application de démarrer, ce qui est très préférable à une panne trois heures plus tard.",
      },
    },
    {
      kind: "text",
      text: "La conversion mérite d'être signalée, car elle évite beaucoup de code inutile. Spring sait transformer `5s` en `Duration`, `10MB` en `DataSize`, une liste séparée par des virgules en `List<String>`, et une chaîne en énumération. Déclarer un champ `Duration timeout` plutôt qu'un `long timeoutMillis` supprime une unité implicite — donc une source d'erreur — sans écrire une ligne de conversion.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Le réflexe à prendre en cas de doute",
      text: "Devant une valeur inattendue, ne jamais commencer par modifier un fichier. Demander d'abord d'où vient la valeur effective — par `/actuator/env`, par le diagnostic ci-dessus, ou en lançant l'application avec `--debug` qui liste les sources au démarrage. Dans la grande majorité des cas, on découvre une variable d'environnement oubliée dans un manifeste de déploiement.",
    },
    {
      kind: "text",
      text: "Une source mérite d'être connue parce qu'elle est récente et très utile : `spring.config.import`. Déclarée dans le fichier général, elle fait charger un fichier supplémentaire — local, ou fourni par un gestionnaire de configuration distant — au moment de la résolution, et non après. Elle a remplacé les montages artisanaux à base de `@PropertySource`, qui arrivaient trop tard pour influencer le reste du démarrage.",
    },
    {
      kind: "text",
      text: "Cette leçon pose le vocabulaire dont dépend tout le reste du chapitre : une valeur de configuration n'appartient pas à un fichier, elle est le résultat d'une résolution entre plusieurs sources concurrentes. La question qui suit immédiatement — laquelle gagne ? — est celle qui revient le plus souvent en entretien comme en production.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-conf-01",
    difficulty: 1,
    tags: ["spring", "configuration"],
    prompt: "L'application lit `app.timeout` = 30s alors que `application.yml` indique 5s. Par quoi commencer ?",
    choices: [
      "Demander d'où vient la valeur effective, via `/actuator/env/app.timeout` ou l'`Environment`.",
      "Modifier `application.yml` et redéployer pour vérifier que le changement est pris en compte.",
      "Vider le cache de configuration de Spring au démarrage.",
      "Vérifier que le fichier `application.yml` est bien inclus dans le jar.",
    ],
    answer: 0,
    explanation:
      "Une valeur n'appartient pas à un fichier : elle est résolue entre plusieurs sources concurrentes. Modifier le fichier avant de savoir laquelle a gagné revient à travailler à l'aveugle — et si la valeur vient d'une variable d'environnement, le changement n'aura strictement aucun effet. `/actuator/env` nomme la source retenue et celles qui proposaient autre chose.",
  },
  {
    kind: "match",
    id: "spring-conf-02",
    difficulty: 2,
    tags: ["spring", "configuration"],
    prompt: "Associe chaque type déclaré à ce que Spring sait convertir automatiquement.",
    pairs: [
      { left: "Duration timeout", right: "5s, 200ms, PT1M30S" },
      { left: "DataSize maxUpload", right: "10MB, 512KB" },
      { left: "List<String> hosts", right: "a.example,b.example,c.example" },
      { left: "Level logLevel (enum)", right: "DEBUG, debug, Debug" },
    ],
    explanation:
      "Déclarer le bon type supprime du code de conversion et, surtout, une unité implicite : un champ `Duration timeout` ne peut pas être confondu entre secondes et millisecondes, contrairement à un `long`. La conversion des énumérations est insensible à la casse, ce qui évite bien des erreurs de configuration.",
  },
  {
    kind: "recall",
    id: "spring-conf-03",
    difficulty: 2,
    tags: ["spring", "configuration"],
    prompt: "Pourquoi Spring agrège-t-il plusieurs sources de configuration plutôt que de lire un seul fichier ?",
    explanation:
      "Pour qu'un même artefact soit déployable partout. Le jar embarque les valeurs par défaut et celles du développement ; l'environnement de déploiement fournit ce qui lui est propre — adresse de base de données, identifiants, tailles de pool, niveaux de journalisation — par variables d'environnement ou arguments de ligne de commande, sans qu'on reconstruise l'application. Reconstruire un artefact par environnement supprimerait toute garantie que ce qui a été testé en recette est bien ce qui tourne en production. La contrepartie est qu'une valeur ne se lit plus dans un fichier mais se résout entre sources concurrentes, d'où l'importance de savoir laquelle gagne.",
    keyPoints: [
      "Un seul artefact, plusieurs environnements",
      "Les défauts dans le jar, le spécifique dans l'environnement",
      "Reconstruire par environnement casserait la garantie recette = production",
      "En contrepartie, la valeur se résout entre sources concurrentes",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — L'ordre de précédence : qui gagne
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "spring-conf-l2",
  title: "L'ordre de précédence : qui gagne",
  blocks: [
    {
      kind: "text",
      text: "Spring Boot définit une quinzaine de sources et un ordre strict entre elles. Les connaître toutes par cœur n'a aucun intérêt ; en connaître la logique en a beaucoup, parce qu'elle est régulière et qu'elle permet de retrouver la réponse sans consulter la documentation.",
    },
    {
      kind: "text",
      text: "Le principe tient en une phrase : **plus une source est proche du déploiement, plus elle est prioritaire**. Ce qui est écrit dans le code perd contre ce qui est dans le jar, qui perd contre ce qui est posé à côté du jar, qui perd contre l'environnement de la machine, qui perd contre ce qu'on tape sur la ligne de commande. L'ordre suit la distance au moment du lancement.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Du plus fort au plus faible, les sources qui comptent vraiment.",
      code: `1. Arguments de ligne de commande
      java -jar app.jar --app.timeout=30s

2. Variables d'environnement
      APP_TIMEOUT=30s

3. Propriétés système Java
      java -Dapp.timeout=30s -jar app.jar

4. application-{profil}.yml HORS du jar
5. application-{profil}.yml DANS le jar
6. application.yml HORS du jar
7. application.yml DANS le jar

8. @PropertySource sur une classe @Configuration
9. SpringApplication.setDefaultProperties(…)

→ Deux règles combinées : le plus proche du lancement
  gagne, et à distance égale, le profil bat le général.`,
    },
    {
      kind: "text",
      text: "Les deux règles se combinent et c'est ce qui explique la position des profils. Un `application-prod.yml` est plus spécifique qu'un `application.yml`, donc prioritaire ; mais un `application-prod.yml` embarqué dans le jar reste battu par un `application.yml` posé à côté du jar par l'exploitant, parce que la proximité au déploiement l'emporte sur la spécificité.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "La correspondance entre noms de propriétés et variables d'environnement.",
      code: `# La même propriété, quatre écritures acceptées :
app.billing.max-retries: 3      # canonique en YAML
app.billing.maxRetries: 3
app.billing.max_retries: 3
APP_BILLING_MAX_RETRIES=3       # variable d'environnement

# Règle pour l'environnement : majuscules, et tout
# caractère non alphanumérique devient un souligné.
spring.datasource.url  →  SPRING_DATASOURCE_URL

# C'est ce qui permet de tout surcharger depuis un
# conteneur, sans fichier :
docker run -e SPRING_DATASOURCE_URL=jdbc:postgresql://… app`,
    },
    {
      kind: "text",
      text: "Cette *liaison souple* est ce qui rend la configuration par variables d'environnement praticable, et c'est aussi ce qui explique la deuxième cause classique de surprise en production. Une variable posée dans un manifeste Kubernetes ou un fichier de composition Docker écrase silencieusement le fichier, sans que rien dans le dépôt ne le laisse deviner. Chercher longtemps dans le code une valeur qui vient d'un manifeste est une expérience commune.",
    },
    {
      kind: "comparison",
      title: "Deux surcharges de dernière minute",
      left: {
        label: "Argument de ligne de commande",
        text: "Priorité maximale, visible dans la commande de lancement et dans `ps`. Pratique pour un test ponctuel — `--server.port=8081` — mais à proscrire pour un secret, puisque tout utilisateur de la machine peut lire la liste des processus.",
      },
      right: {
        label: "Variable d'environnement",
        text: "Presque aussi prioritaire, invisible dans `ps` pour les autres utilisateurs, et c'est la voie standard des conteneurs. C'est le bon véhicule pour les valeurs propres à un environnement, secrets compris.",
      },
    },
    {
      kind: "text",
      text: "Un point de vocabulaire utile en entretien : les profils **ne remplacent pas**, ils **surchargent**. Activer `prod` ne fait pas ignorer `application.yml` — ce fichier est toujours chargé, et `application-prod.yml` vient écraser les clés qu'il redéfinit, en laissant les autres intactes. On met donc le commun dans le fichier général et seulement les différences dans les fichiers de profil.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "La fusion ne descend pas dans les listes",
      text: "La surcharge fonctionne clé par clé, et une liste est une valeur comme une autre : elle est **remplacée en bloc**, jamais fusionnée. Si `application.yml` déclare trois hôtes autorisés et que `application-prod.yml` en déclare un, la production en aura un seul, pas quatre. C'est le comportement voulu, mais il surprend systématiquement la première fois.",
    },
    {
      kind: "text",
      text: "Deux options de lancement complètent le tableau et évitent bien des contorsions. `spring.config.additional-location` **ajoute** un emplacement à ceux consultés par défaut, ce qui est presque toujours ce qu'on veut : le fichier externe surcharge celui du jar sans le remplacer. `spring.config.location`, lui, **remplace** entièrement la liste des emplacements — le fichier embarqué n'est plus lu du tout, et les valeurs par défaut disparaissent avec lui.",
    },
    {
      kind: "text",
      text: "Retenir la logique plutôt que la liste permet aussi de répondre à la variante piège de la question : « et si je mets la même clé dans `application.yml` et dans une variable d'environnement ? ». La réponse ne demande aucune mémorisation — la variable d'environnement est plus proche du lancement, elle gagne.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "order",
    id: "spring-conf-04",
    difficulty: 2,
    tags: ["spring", "configuration", "precedence"],
    prompt: "Classe ces sources de la plus prioritaire à la moins prioritaire.",
    items: [
      "Argument de ligne de commande --app.timeout=30s",
      "Variable d'environnement APP_TIMEOUT=30s",
      "application-prod.yml embarqué dans le jar",
      "application.yml embarqué dans le jar",
    ],
    explanation:
      "Deux règles se combinent : plus une source est proche du moment du lancement, plus elle est prioritaire ; et à distance égale, le fichier de profil bat le fichier général. La ligne de commande est ce qu'on tape en dernier, elle gagne toujours ; le fichier embarqué dans le jar est ce qui a été décidé le plus tôt, il perd contre tout le reste.",
  },
  {
    kind: "mcq",
    id: "spring-conf-05",
    difficulty: 2,
    tags: ["spring", "configuration", "profils"],
    prompt: "Le profil `prod` est actif. `application.yml` définit `app.a=1` et `app.b=2`, `application-prod.yml` définit seulement `app.b=9`. Que vaut la configuration ?",
    choices: [
      "app.a=1 et app.b=9 : le fichier de profil surcharge clé par clé, il ne remplace pas le fichier général.",
      "app.b=9 seulement : `application.yml` est ignoré dès qu'un profil est actif.",
      "app.a=1 et app.b=2 : un fichier de profil ne peut pas surcharger le fichier général.",
      "L'application refuse de démarrer : `app.b` est défini deux fois.",
    ],
    answer: 0,
    explanation:
      "Les profils surchargent, ils ne remplacent pas. `application.yml` est toujours chargé ; `application-prod.yml` écrase uniquement les clés qu'il redéfinit et laisse les autres intactes. C'est ce qui permet de mettre tout le commun dans le fichier général et seulement les différences dans les fichiers de profil.",
  },
  {
    kind: "recall",
    id: "spring-conf-06",
    difficulty: 3,
    tags: ["spring", "configuration", "precedence"],
    prompt: "Quelle règle simple permet de retrouver l'ordre de précédence sans le mémoriser ?",
    explanation:
      "Plus une source est proche du moment du lancement, plus elle est prioritaire. Ce qui est décidé à l'écriture du code perd contre ce qui est embarqué dans le jar, qui perd contre un fichier posé à côté du jar, qui perd contre les variables d'environnement de la machine, qui perdent contre les arguments tapés sur la ligne de commande. Une seconde règle s'y combine : à distance égale, le fichier de profil bat le fichier général, car il est plus spécifique. Ces deux règles suffisent à répondre à toutes les questions courantes — notamment celle, très fréquente, de la variable d'environnement face au fichier : la variable gagne, ce qui explique la plupart des configurations « qui ne changent pas quand on modifie le YAML ».",
    keyPoints: [
      "Plus proche du lancement = plus prioritaire",
      "Code < jar < fichier externe < environnement < ligne de commande",
      "À distance égale, le profil bat le général",
      "Explique les valeurs qui ne changent pas quand on modifie le YAML",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — YAML : structure, listes et pièges d'écriture
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "spring-conf-l3",
  title: "YAML : structure, listes et pièges d'écriture",
  blocks: [
    {
      kind: "text",
      text: "Spring Boot accepte deux formats équivalents, `.properties` et `.yml`. Le premier est une liste plate de clés ; le second est arborescent, ce qui supprime la répétition du préfixe et rend visible la structure. À partir d'une trentaine de clés, la différence de lisibilité est nette, et c'est le format choisi par la plupart des projets.",
    },
    {
      kind: "code",
      language: "properties",
      caption: "Le même contenu, en properties.",
      code: `app.billing.api-url=https://facturation.example
app.billing.max-retries=3
app.billing.timeout=5s
app.billing.allowed-hosts[0]=a.example
app.billing.allowed-hosts[1]=b.example
spring.datasource.url=jdbc:postgresql://localhost/app`,
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Et en YAML : la structure apparaît.",
      code: `app:
  billing:
    api-url: https://facturation.example
    max-retries: 3
    timeout: 5s
    allowed-hosts:
      - a.example
      - b.example

spring:
  datasource:
    url: jdbc:postgresql://localhost/app`,
    },
    {
      kind: "text",
      text: "La convention d'écriture recommandée est le *kebab-case* : `max-retries` plutôt que `maxRetries`. Les deux fonctionnent grâce à la liaison souple, mais la première forme est celle que Spring documente, celle qui se transpose sans ambiguïté en variable d'environnement, et surtout celle qui rend un fichier homogène. Le mélange des deux dans un même projet est une source de doublons silencieux.",
    },
    {
      kind: "text",
      text: "YAML apporte cependant ses propres pièges, et le premier est l'indentation : elle est signifiante, et les tabulations y sont **interdites**. Un fichier indenté à la tabulation échoue au démarrage avec une erreur d'analyse dont le message ne désigne pas toujours la bonne ligne. Configurer son éditeur pour convertir les tabulations en espaces sur les fichiers YAML règle définitivement le problème.",
    },
    {
      kind: "text",
      text: "Le second piège tient à l'interprétation des valeurs non quotées. `on`, `off`, `yes`, `no` sont lus comme des booléens par certaines versions de la spécification ; un numéro de version comme `1.20` devient un nombre décimal et perd son zéro final ; une valeur commençant par un zéro peut être interprétée en octal. Dès qu'une valeur doit rester une chaîne exacte — un mot de passe, un identifiant, un numéro de version — on la met entre guillemets.",
    },
    {
      kind: "comparison",
      title: "Deux façons de découper les profils",
      left: {
        label: "Un fichier par profil",
        text: "`application.yml` pour le commun, `application-dev.yml` et `application-prod.yml` pour les différences. Lisible, chaque fichier reste court, et l'on voit d'un coup d'œil ce qui est propre à un environnement. C'est le choix par défaut.",
      },
      right: {
        label: "Un fichier multi-documents",
        text: "Des sections séparées par `---` dans un seul fichier, chacune activée par `spring.config.activate.on-profile`. Pratique pour un petit projet ou une configuration de test ; devient vite illisible dès que les sections s'allongent.",
      },
    },
    {
      kind: "code",
      language: "yaml",
      caption: "La forme multi-documents, et le nom de clé qui a changé.",
      code: `# Commun à tous les profils
app:
  billing:
    max-retries: 3

---
spring:
  config:
    activate:
      on-profile: prod      # depuis Spring Boot 2.4
app:
  billing:
    max-retries: 5

# Attention : l'ancienne clé « spring.profiles: prod »
# n'est plus reconnue. Un fichier copié d'un vieux projet
# fait démarrer l'application avec la mauvaise section,
# sans erreur visible.`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une clé dupliquée ne provoque aucune erreur",
      text: "Si la même clé apparaît deux fois dans un fichier YAML, la dernière écrase la première en silence. Sur un fichier de deux cents lignes issu de plusieurs fusions, c'est une cause de perte de temps redoutable : la valeur qu'on lit en haut du fichier n'est pas celle qui s'applique. Un vérificateur de YAML dans l'intégration continue détecte ce cas en une seconde.",
    },
    {
      kind: "text",
      text: "Un dernier point d'écriture revient dès qu'on manipule des certificats ou des clés : les chaînes sur plusieurs lignes. YAML propose `|` qui conserve les retours à la ligne, et `>` qui les remplace par des espaces. Confondre les deux sur une clé privée produit une valeur syntaxiquement acceptée mais inutilisable, et l'erreur ne se manifeste qu'au premier usage — bien loin du fichier de configuration.",
    },
    {
      kind: "text",
      text: "Dernier conseil pratique : garder le fichier général court. Un `application.yml` qui dépasse deux cents lignes signale en général qu'on y a mis des choses qui appartiennent à un profil, ou des valeurs par défaut qui auraient leur place dans le code. La configuration doit décrire ce qui varie d'un déploiement à l'autre, pas rejouer l'intégralité des réglages du framework.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "fill",
    id: "spring-conf-07",
    difficulty: 2,
    tags: ["spring", "configuration", "profils"],
    prompt: "Complète la clé d'activation de section et l'argument de lancement.",
    code: {
      language: "yaml",
      code: `---
spring:
  config:
    activate:
      {{1}}: prod
app:
  billing:
    max-retries: 5

# Lancement :
# java -jar app.jar --spring.profiles.{{2}}=prod`,
    },
    blanks: ["on-profile", "active"],
    distractors: ["profile", "enabled", "use"],
    explanation:
      "`spring.config.activate.on-profile` conditionne une section de fichier à un profil : elle a remplacé l'ancienne clé `spring.profiles` en Spring Boot 2.4. `spring.profiles.active` est la propriété qui **active** un profil au lancement — via la ligne de commande, une variable d'environnement `SPRING_PROFILES_ACTIVE`, ou le fichier général.",
  },
  {
    kind: "mcq",
    id: "spring-conf-08",
    difficulty: 2,
    tags: ["spring", "configuration", "yaml"],
    prompt: "Pourquoi écrire `version: \"1.20\"` avec des guillemets plutôt que `version: 1.20` ?",
    choices: [
      "Sans guillemets, YAML lit un nombre décimal et la valeur devient 1.2 : le zéro final disparaît.",
      "Sans guillemets, YAML refuse les points dans une valeur et l'analyse échoue.",
      "Les guillemets sont obligatoires pour toute valeur en YAML, quelle qu'elle soit.",
      "Sans guillemets, la valeur ne peut pas être surchargée par une variable d'environnement.",
    ],
    answer: 0,
    explanation:
      "YAML interprète les valeurs non quotées : `1.20` devient le nombre 1.2, et la chaîne attendue est perdue. Le même piège vaut pour `on`, `off`, `yes`, `no`, lus comme des booléens, et pour les valeurs à zéro initial, parfois lues en octal. Dès qu'une valeur doit rester une chaîne exacte — version, identifiant, mot de passe — on la met entre guillemets.",
  },
  {
    kind: "recall",
    id: "spring-conf-09",
    difficulty: 2,
    tags: ["spring", "configuration", "yaml"],
    prompt: "Cite trois pièges d'écriture propres au format YAML dans une configuration Spring.",
    explanation:
      "D'abord l'indentation, qui est signifiante et interdit les tabulations : un fichier indenté à la tabulation échoue au démarrage avec un message qui ne désigne pas toujours la bonne ligne. Ensuite l'interprétation des valeurs non quotées — `on`, `off`, `yes` et `no` deviennent des booléens, `1.20` devient le nombre 1.2, une valeur à zéro initial peut être lue en octal — d'où la règle de mettre entre guillemets tout ce qui doit rester une chaîne exacte. Enfin la duplication de clé, qui ne produit aucune erreur : la dernière occurrence écrase silencieusement la première, si bien que la valeur lue en haut d'un long fichier n'est pas celle qui s'applique. On peut y ajouter le remplacement en bloc des listes, qui ne fusionnent jamais lors d'une surcharge par profil.",
    keyPoints: [
      "Indentation signifiante, tabulations interdites",
      "Valeurs non quotées réinterprétées : on/off/yes/no, 1.20, zéro initial",
      "Clé dupliquée : la dernière gagne, sans erreur",
      "Les listes sont remplacées en bloc, jamais fusionnées",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les profils : activer le bon jeu de réglages
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "spring-conf-l4",
  title: "Les profils : activer le bon jeu de réglages",
  blocks: [
    {
      kind: "text",
      text: "Une application ne se comporte pas de la même façon sur le poste d'un développeur et en production : base en mémoire contre base réelle, journalisation bavarde contre journalisation mesurée, envoi de courriels simulé contre envoi véritable. Les profils sont le mécanisme qui permet de décrire ces variantes sans multiplier les artefacts ni parsemer le code de conditions.",
    },
    {
      kind: "text",
      text: "Un profil est simplement un nom actif à l'exécution. Il agit à deux endroits : il fait charger les fichiers `application-{nom}.yml` correspondants, et il conditionne la création des beans annotés `@Profile`. Ces deux effets sont indépendants, et la plupart des besoins se règlent avec le premier seul — modifier des valeurs suffit le plus souvent à modifier le comportement.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Quatre façons d'activer un profil, par priorité décroissante.",
      code: `# 1. Ligne de commande — gagne sur tout
java -jar app.jar --spring.profiles.active=prod

# 2. Variable d'environnement — la voie des conteneurs
SPRING_PROFILES_ACTIVE=prod java -jar app.jar

# 3. Propriété système
java -Dspring.profiles.active=prod -jar app.jar

# 4. Dans application.yml — le défaut du projet
spring:
  profiles:
    active: dev

# Plusieurs profils à la fois, cumulatifs :
--spring.profiles.active=prod,metrics,eu-west`,
    },
    {
      kind: "text",
      text: "Les profils se cumulent, et l'ordre compte : `prod,metrics` charge `application-prod.yml` puis `application-metrics.yml`, le dernier l'emportant en cas de conflit. Cela permet de composer des variantes orthogonales — un profil d'environnement, un profil de région, un profil d'outillage — plutôt que de créer un fichier par combinaison.",
    },
    {
      kind: "code",
      language: "java",
      caption: "@Profile sur un bean, et l'usage qu'il faut en faire.",
      code: `@Configuration
class MailConfig {

    @Bean
    @Profile("prod")
    MailSender realSender(MailProperties props) {
        return new SmtpMailSender(props);
    }

    @Bean
    @Profile("!prod")            // tout sauf prod
    MailSender fakeSender() {
        return mail -> log.info("Courriel simulé : {}", mail);
    }
}

// Expressions acceptées : "prod", "!prod",
// "prod & eu-west", "dev | test"`,
    },
    {
      kind: "text",
      text: "L'annotation `@Profile` est puissante et c'est précisément pourquoi il faut s'en méfier. Chaque bean conditionnel crée un chemin de code qui n'est exercé que dans un environnement ; deux ou trois suffisent à produire une application dont personne ne teste réellement la configuration de production. La règle raisonnable est de la réserver aux composants d'infrastructure — client de messagerie, source de données, faux services externes — et de ne jamais y mettre de logique métier.",
    },
    {
      kind: "comparison",
      title: "Deux façons de faire varier le comportement",
      left: {
        label: "Une valeur de configuration",
        text: "Le même code partout, un réglage différent : `app.mail.enabled=false`. Un seul chemin d'exécution, testable en faisant varier la propriété. À préférer chaque fois que c'est possible.",
      },
      right: {
        label: "Un bean @Profile",
        text: "Deux implémentations distinctes, dont une seule s'exécute selon l'environnement. Nécessaire quand la différence est structurelle — un faux client contre un vrai — mais chaque occurrence est un chemin de code non couvert ailleurs.",
      },
    },
    {
      kind: "text",
      text: "Un mot sur le profil par défaut : lorsqu'aucun profil n'est actif, Spring applique le profil implicite `default`, et un bean annoté `@Profile(\"default\")` n'est créé que dans ce cas. Ce comportement est rarement ce qu'on veut — dès qu'un profil quelconque est activé, ces beans disparaissent — et il vaut mieux exprimer l'intention par une négation explicite, comme `@Profile(\"!prod\")`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Activer un profil depuis un fichier de profil",
      text: "Écrire `spring.profiles.active` à l'intérieur d'un `application-prod.yml` provoque une `InvalidConfigDataPropertyException` au démarrage. C'est volontaire : autoriser un profil à en activer d'autres rendrait la résolution circulaire et imprévisible. Pour composer, on utilise `spring.profiles.include`, ou l'on active simplement plusieurs profils au lancement.",
    },
    {
      kind: "text",
      text: "Côté tests, `@ActiveProfiles(\"test\")` active un profil pour la durée d'une classe de test, et `src/test/resources/application-test.yml` porte les réglages correspondants. C'est le bon endroit pour une base en mémoire ou des délais raccourcis. On évite en revanche d'y recopier la configuration de production : un test qui passe sur des réglages qui ne sont ceux d'aucun environnement réel ne prouve pas grand-chose.",
    },
    {
      kind: "text",
      text: "Enfin, une pratique qui évite beaucoup d'incidents : ne jamais faire de la production le profil par défaut. Si l'activation échoue — variable oubliée dans un manifeste, faute de frappe — mieux vaut que l'application démarre sur une configuration de développement inoffensive que sur la base de production. Le défaut doit être le choix le moins dangereux, pas le plus courant.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-conf-10",
    difficulty: 2,
    tags: ["spring", "configuration", "profils"],
    prompt: "L'application est lancée avec `--spring.profiles.active=prod,metrics`. Que se passe-t-il ?",
    choices: [
      "Les deux profils sont actifs : `application-prod.yml` puis `application-metrics.yml` sont chargés, le dernier gagnant en cas de conflit.",
      "Seul `prod` est actif : le premier profil de la liste l'emporte.",
      "Seul `metrics` est actif : le dernier profil déclaré remplace les précédents.",
      "L'application refuse de démarrer : un seul profil peut être actif à la fois.",
    ],
    answer: 0,
    explanation:
      "Les profils sont cumulatifs et leur ordre compte : les fichiers sont chargés dans l'ordre déclaré et le dernier l'emporte sur les clés en conflit. C'est ce qui permet de composer des variantes orthogonales — un profil d'environnement, un de région, un d'outillage — au lieu de créer un fichier par combinaison possible.",
  },
  {
    kind: "spot",
    id: "spring-conf-11",
    difficulty: 3,
    tags: ["spring", "configuration", "profils"],
    prompt: "Ce fichier `application-prod.yml` empêche l'application de démarrer. Quelle ligne ?",
    code: {
      language: "yaml",
      code: `spring:
  profiles:
    active: prod,metrics
  datasource:
    url: jdbc:postgresql://db.prod/app
app:
  billing:
    max-retries: 5`,
    },
    faultyLine: 3,
    reasons: [
      "`spring.profiles.active` ne peut pas être défini dans un fichier de profil : cela rendrait la résolution circulaire.",
      "`spring.profiles.active` n'accepte qu'un seul profil à la fois, pas une liste.",
      "L'URL de la source de données ne doit jamais figurer dans un fichier de profil.",
      "`max-retries` doit s'écrire `maxRetries` pour être reconnu par Spring.",
    ],
    reasonAnswer: 0,
    explanation:
      "Spring lève une `InvalidConfigDataPropertyException` : un fichier chargé parce qu'un profil est actif ne peut pas décider quels profils sont actifs. Pour composer plusieurs profils, on utilise `spring.profiles.include` dans le fichier général, ou l'on active la liste au lancement. Les listes de profils sont bien acceptées, et `max-retries` est la forme canonique.",
  },
  {
    kind: "recall",
    id: "spring-conf-12",
    difficulty: 2,
    tags: ["spring", "configuration", "profils"],
    prompt: "Pourquoi préférer une valeur de configuration à un bean `@Profile` quand les deux sont possibles ?",
    explanation:
      "Parce qu'un bean conditionnel crée un chemin de code qui n'est exercé que dans un environnement. Deux ou trois occurrences suffisent à obtenir une application dont la configuration de production n'est réellement testée nulle part : les tests tournent sur les implémentations de développement, et la première exécution du vrai chemin a lieu en production. Une valeur de configuration laisse au contraire un seul chemin d'exécution, que l'on peut couvrir en faisant simplement varier la propriété dans un test. On réserve donc `@Profile` aux différences structurelles — un vrai client de messagerie contre un faux — en le cantonnant à l'infrastructure, et jamais à de la logique métier.",
    keyPoints: [
      "Un bean @Profile crée un chemin non exercé ailleurs",
      "Risque : la configuration de production n'est testée nulle part",
      "Une valeur laisse un seul chemin, testable en la faisant varier",
      "@Profile réservé à l'infrastructure, jamais au métier",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — @Value ou @ConfigurationProperties
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "spring-conf-l5",
  title: "@Value ou @ConfigurationProperties",
  blocks: [
    {
      kind: "text",
      text: "Deux mécanismes permettent de faire entrer une valeur de configuration dans le code, et le choix entre eux n'est pas affaire de goût : l'un se contente d'injecter une valeur, l'autre construit un objet vérifié au démarrage. La différence se mesure au moment où quelque chose est mal configuré.",
    },
    {
      kind: "code",
      language: "java",
      caption: "@Value : simple, et sans filet.",
      code: `@Service
class BillingClient {

    @Value("\${app.billing.api-url}")
    private String apiUrl;

    @Value("\${app.billing.max-retries:3}")   // 3 par défaut
    private int maxRetries;

    // Rien ne garantit que ces deux valeurs sont cohérentes,
    // ni qu'elles ont un sens. Une clé mal orthographiée
    // dans l'annotation échoue au démarrage ; une valeur
    // absurde — max-retries: -5 — passe sans un mot.
}`,
    },
    {
      kind: "text",
      text: "`@Value` injecte une valeur unique, éventuellement avec un défaut après le deux-points. C'est suffisant pour un réglage isolé. Mais les valeurs de configuration vont rarement seules : une adresse, un délai, un nombre de tentatives et un identifiant forment un ensemble cohérent, et les éparpiller en quatre annotations dans trois classes fait perdre cette cohérence.",
    },
    {
      kind: "code",
      language: "java",
      caption: "@ConfigurationProperties : un objet typé, immuable, vérifié.",
      code: `@ConfigurationProperties(prefix = "app.billing")
public record BillingProperties(
        URI apiUrl,
        int maxRetries,
        Duration timeout,
        List<String> allowedHosts) {
}

@ConfigurationPropertiesScan     // sur la classe @SpringBootApplication
@SpringBootApplication
public class Application { }

@Service
class BillingClient {
    private final BillingProperties props;   // injecté comme un bean

    BillingClient(BillingProperties props) { this.props = props; }
}`,
    },
    {
      kind: "text",
      text: "La liaison par constructeur — implicite avec un `record` ou une classe à constructeur unique — donne un objet immuable, ce qui interdit qu'un morceau de code modifie la configuration à l'exécution. Le préfixe est déclaré une fois, la liaison souple s'applique, la conversion de types opère, et le tout devient un bean ordinaire qu'on injecte comme n'importe quel autre — donc facile à substituer dans un test.",
    },
    {
      kind: "text",
      text: "Un avantage moins visible mérite d'être connu : avec le module `spring-boot-configuration-processor` dans les dépendances, les métadonnées de ces classes sont générées à la compilation, et les éditeurs proposent alors l'autocomplétion et la documentation des clés directement dans `application.yml`. Une faute de frappe se voit à l'écriture, pas au démarrage.",
    },
    {
      kind: "comparison",
      title: "Quand chacun se justifie",
      left: {
        label: "@Value",
        text: "Une valeur isolée, sans parenté avec d'autres : un nom d'application affiché, un drapeau ponctuel. Accepte les expressions SpEL. Pas de validation, pas de regroupement, et une clé par annotation dispersée dans le code.",
      },
      right: {
        label: "@ConfigurationProperties",
        text: "Un ensemble cohérent de réglages sous un même préfixe. Typé, immuable, validable, documenté par les métadonnées, injectable et substituable en test. C'est le choix par défaut dès qu'il y a plus d'une clé.",
      },
    },
    {
      kind: "text",
      text: "Il reste une différence technique qu'on ne remarque qu'en la cherchant : `@Value` évalue du SpEL, `@ConfigurationProperties` non. On peut donc écrire `@Value(\"#{systemProperties['user.home']}\")`, ce qui est parfois pratique et souvent le signe qu'on met de la logique dans une annotation. À l'inverse, seule la liaison par propriétés gère correctement la liaison souple et les collections.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "@Value dans un constructeur, pas sur un champ",
      text: "Un `@Value` posé sur un champ privé est injecté après la construction : la valeur n'est donc pas disponible dans le constructeur ni dans un bloc d'initialisation, où elle vaut `null` ou zéro. C'est une source de bugs déroutants, notamment quand on veut construire un client à partir de l'URL. Passer par un paramètre de constructeur annoté supprime le problème.",
    },
    {
      kind: "text",
      text: "Les propriétés imbriquées suivent naturellement la structure du YAML : un champ dont le type est un autre `record` fait correspondre `app.billing.retry.max-attempts` à `props.retry().maxAttempts()`. On obtient une arborescence typée qui reflète le fichier, ce qui rend la configuration navigable dans l'éditeur et supprime les longues chaînes de clés écrites à la main dans le code.",
    },
    {
      kind: "text",
      text: "En entretien, la question « `@Value` ou `@ConfigurationProperties` ? » attend qu'on dépasse « les deux marchent ». La réponse utile tient en trois points : le regroupement typé sous un préfixe, la validation au démarrage plutôt qu'à l'usage, et l'injectabilité qui rend les tests possibles sans manipuler le contexte Spring.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "fill",
    id: "spring-conf-13",
    difficulty: 1,
    tags: ["spring", "configuration"],
    prompt: "Complète la liaison typée de la configuration.",
    code: {
      language: "java",
      code: `@{{1}}(prefix = "app.billing")
public record BillingProperties(URI apiUrl, int maxRetries) { }

@{{2}}
@SpringBootApplication
public class Application { }`,
    },
    blanks: ["ConfigurationProperties", "ConfigurationPropertiesScan"],
    distractors: ["Value", "Component", "EnableAutoConfiguration"],
    explanation:
      "`@ConfigurationProperties` déclare le préfixe et la classe cible ; `@ConfigurationPropertiesScan` sur la classe principale détecte ces classes sans avoir à les annoter `@Component` ni à les déclarer une par une avec `@EnableConfigurationProperties`. Avec un `record`, la liaison par constructeur est implicite et l'objet obtenu est immuable.",
  },
  {
    kind: "mcq",
    id: "spring-conf-14",
    difficulty: 2,
    tags: ["spring", "configuration"],
    prompt: "Un `@Value` posé sur un champ privé vaut `null` dans le constructeur de la classe. Pourquoi ?",
    choices: [
      "L'injection sur champ a lieu après la construction de l'instance : le constructeur s'exécute avant.",
      "`@Value` ne fonctionne que sur les beans annotés `@Configuration`.",
      "La valeur n'est résolue qu'au premier appel d'une méthode du bean.",
      "Le champ doit être déclaré `final` pour être injecté à temps.",
    ],
    answer: 0,
    explanation:
      "Spring construit d'abord l'instance, puis renseigne les champs annotés. Tout ce qui s'exécute pendant la construction — constructeur, bloc d'initialisation — voit donc la valeur par défaut du type. Déclarer le champ `final` est d'ailleurs impossible avec l'injection sur champ. La solution est de passer la valeur en paramètre de constructeur, ou d'utiliser `@ConfigurationProperties`.",
  },
  {
    kind: "recall",
    id: "spring-conf-15",
    difficulty: 2,
    tags: ["spring", "configuration"],
    prompt: "Cite trois avantages de `@ConfigurationProperties` sur `@Value`.",
    explanation:
      "D'abord le **regroupement typé** : un ensemble cohérent de réglages sous un même préfixe devient un objet unique, au lieu d'être éparpillé en annotations dans plusieurs classes ; la conversion vers `Duration`, `URI` ou une collection est automatique. Ensuite la **validation au démarrage** : combinée à `@Validated`, la classe fait échouer le lancement si une valeur est absente ou absurde, plutôt que de laisser découvrir le problème à l'usage. Enfin l'**injectabilité** : c'est un bean ordinaire, immuable si l'on utilise un `record` ou la liaison par constructeur, qu'on injecte et qu'on substitue en test sans manipuler le contexte Spring. On peut ajouter les métadonnées générées à la compilation, qui donnent autocomplétion et documentation des clés directement dans le fichier YAML.",
    keyPoints: [
      "Regroupement typé sous un préfixe, avec conversion automatique",
      "Validation au démarrage plutôt qu'à l'usage",
      "Bean injectable et substituable en test, immuable avec un record",
      "Métadonnées : autocomplétion des clés dans le YAML",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Valider la configuration : échouer au démarrage
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "spring-conf-l6",
  title: "Valider la configuration : échouer au démarrage",
  blocks: [
    {
      kind: "text",
      text: "Une configuration invalide se manifeste tôt ou tard. La seule question est de savoir si ce sera au démarrage, devant l'écran de celui qui déploie, ou trois heures plus tard, sur le premier appel d'un client. Le premier cas coûte cinq minutes ; le second coûte un incident, une astreinte, et souvent une correction faite dans l'urgence.",
    },
    {
      kind: "text",
      text: "Le principe s'appelle *fail fast* : mieux vaut refuser de démarrer que fonctionner à moitié. Une application partiellement configurée est plus dangereuse qu'une application arrêtée, parce qu'elle est déclarée saine par les sondes de disponibilité, reçoit du trafic, et échoue de façon dispersée et difficile à interpréter.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Validation déclarative sur la classe de propriétés.",
      code: `@Validated
@ConfigurationProperties(prefix = "app.billing")
public record BillingProperties(

        @NotNull URI apiUrl,

        @Min(1) @Max(10)
        int maxRetries,

        @NotNull @DurationMin(seconds = 1)
        Duration timeout,

        @NotEmpty List<String> allowedHosts) {
}

// Nécessite spring-boot-starter-validation dans les dépendances.`,
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce que produit une valeur invalide au démarrage.",
      code: `app:
  billing:
    api-url: https://facturation.example
    max-retries: -5          ← viole @Min(1)
    timeout: 5s
    allowed-hosts: [a.example]

***************************
APPLICATION FAILED TO START
***************************

Description:
Binding to target BillingProperties failed:

    Property: app.billing.max-retries
    Value: "-5"
    Reason: doit être supérieur ou égal à 1

Action:
Update your application's configuration`,
    },
    {
      kind: "text",
      text: "Ce message est exactement ce qu'on veut : il nomme la propriété fautive, la valeur reçue et la règle violée, et il apparaît avant que le moindre trafic n'arrive. Comparé à une `NullPointerException` dans une trace d'appel à trois heures du matin, le gain n'a pas de commune mesure — et il ne coûte que quelques annotations.",
    },
    {
      kind: "text",
      text: "La validation ne se limite pas aux annotations standard. Une méthode annotée `@PostConstruct` sur la classe de propriétés, ou un `@Bean` de type `Validator`, permet d'exprimer des règles qui portent sur plusieurs champs à la fois — « le délai doit rester inférieur au délai global », « si le mode strict est activé, la liste ne peut pas être vide ». Ces cohérences croisées sont souvent celles qui manquent.",
    },
    {
      kind: "comparison",
      title: "Deux façons de traiter une valeur manquante",
      left: {
        label: "Une valeur par défaut",
        text: "`@Value(\"\${app.timeout:5s}\")` ou un défaut dans le record. Correct pour un réglage qui a un comportement raisonnable par défaut — une taille de page, un délai. L'application démarre partout sans configuration supplémentaire.",
      },
      right: {
        label: "Rendre la valeur obligatoire",
        text: "`@NotNull` sans défaut. Nécessaire dès qu'aucune valeur ne peut être raisonnablement devinée : une URL de service externe, un identifiant de client. Un défaut serait ici une invitation à déployer une application mal configurée.",
      },
    },
    {
      kind: "text",
      text: "Le choix entre les deux se fait sur une question simple : existe-t-il une valeur qui soit correcte dans tous les environnements ? Si oui, elle a sa place comme défaut. Sinon, l'absence doit être une erreur. Mettre un défaut arbitraire sur une URL de service externe — souvent celle du développement — est la façon la plus sûre de voir un jour la production appeler l'environnement de recette.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Vérifier au plus tôt, y compris en test",
      text: "Un test qui charge simplement le contexte Spring avec la configuration de chaque profil détecte toute erreur de liaison ou de validation avant la fusion, sans démarrer de serveur. C'est l'un des tests les plus rentables d'un projet : quelques lignes, une seconde d'exécution, et il attrape les fautes de frappe dans le YAML que personne ne relit.",
    },
    {
      kind: "text",
      text: "La qualité du message d'erreur n'est pas un hasard : Spring Boot embarque des analyseurs de panne qui interceptent les échecs de démarrage connus et les reformulent en un diagnostic lisible, avec une section « Action » indiquant quoi faire. C'est pour cette raison qu'il faut résister à la tentation d'enrober le démarrage dans un `try` qui journalise l'exception : on remplace alors un diagnostic clair par une trace brute.",
    },
    {
      kind: "text",
      text: "Reste un cas que la validation ne couvre pas : une valeur syntaxiquement correcte mais qui désigne la mauvaise chose — une URL de recette bien formée en production. Aucune annotation ne détectera cela. C'est le rôle d'un contrôle de démarrage, ou d'une trace explicite au lancement listant les points de terminaison contactés, qu'un exploitant peut relire.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "output",
    id: "spring-conf-16",
    difficulty: 2,
    tags: ["spring", "configuration", "validation"],
    prompt: "La classe est annotée `@Validated` avec `@Min(1)` sur `maxRetries`, et le YAML déclare `max-retries: -5`. Que se passe-t-il ?",
    code: {
      language: "java",
      code: `@Validated
@ConfigurationProperties(prefix = "app.billing")
public record BillingProperties(
        @NotNull URI apiUrl,
        @Min(1) @Max(10) int maxRetries) { }

// application.yml
// app:
//   billing:
//     api-url: https://facturation.example
//     max-retries: -5`,
    },
    choices: [
      "L'application refuse de démarrer, avec un message nommant la propriété, la valeur reçue et la règle violée.",
      "L'application démarre et `maxRetries` prend la valeur 1, bornée automatiquement par `@Min`.",
      "L'application démarre normalement : les annotations de validation ne s'appliquent qu'aux corps de requêtes HTTP.",
      "L'application démarre et lève une exception au premier appel utilisant `maxRetries`.",
    ],
    answer: 0,
    explanation:
      "`@Validated` sur une classe `@ConfigurationProperties` déclenche la validation au moment de la liaison, donc au démarrage. L'échec est immédiat et le message nomme précisément `app.billing.max-retries`, la valeur `-5` et la contrainte violée. C'est tout l'intérêt du *fail fast* : découvrir le problème devant l'écran de déploiement plutôt qu'au premier appel client.",
  },
  {
    kind: "mcq",
    id: "spring-conf-17",
    difficulty: 2,
    tags: ["spring", "configuration", "validation"],
    prompt: "Pour quelle propriété une valeur par défaut est-elle une mauvaise idée ?",
    choices: [
      "L'URL d'un service externe : un défaut ferait démarrer la production sur l'environnement de développement.",
      "La taille de page d'une API paginée, qui a un comportement raisonnable par défaut.",
      "Le délai d'expiration d'un appel HTTP sortant.",
      "Le niveau de journalisation de l'application.",
    ],
    answer: 0,
    explanation:
      "La question à se poser est : existe-t-il une valeur correcte dans tous les environnements ? Une taille de page, un délai ou un niveau de journalisation en ont une. L'adresse d'un service externe, non — et un défaut pointant vers le développement transforme un oubli de configuration en appel silencieux vers le mauvais environnement. Là, l'absence doit être une erreur de démarrage.",
  },
  {
    kind: "match",
    id: "spring-conf-18",
    difficulty: 2,
    tags: ["spring", "configuration", "validation"],
    prompt: "Associe chaque besoin de validation au moyen approprié.",
    pairs: [
      { left: "Une URL obligatoire", right: "@NotNull sur le champ, sans valeur par défaut" },
      { left: "Un entier dans un intervalle", right: "@Min et @Max sur le champ" },
      { left: "Une cohérence entre deux champs", right: "Une méthode @PostConstruct ou un Validator dédié" },
      { left: "Une URL bien formée mais pointant ailleurs", right: "Aucune annotation : trace de démarrage ou contrôle de santé" },
    ],
    explanation:
      "Les annotations couvrent la validité d'un champ pris isolément ; les cohérences croisées demandent du code, et ce sont souvent celles qui manquent. Le dernier cas échappe entièrement à la validation : une URL de recette est parfaitement bien formée en production. Seule une trace explicite des points de terminaison contactés, relue par un exploitant, permet de l'attraper.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Les secrets : ce qui ne doit jamais être versionné
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "spring-conf-l7",
  title: "Les secrets : ce qui ne doit jamais être versionné",
  blocks: [
    {
      kind: "text",
      text: "Un mot de passe écrit dans `application.yml` et poussé sur le dépôt ne s'efface pas. Il reste dans l'historique Git, dans chaque clone effectué depuis, dans les caches des outils d'intégration continue, et dans les copies personnelles de chacun. Le retirer du fichier par un nouveau commit ne fait que le rendre moins visible : il est toujours consultable en une commande.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Ce qu'une fuite dans l'historique signifie réellement.",
      code: `# Le secret a été retiré il y a six mois…
git log -p --all -S 'Pr0dP@ss' -- src/main/resources/

# …mais il ressort intact.
commit 3f9a2c1  (il y a 6 mois)
- spring.datasource.password: Pr0dP@ss!

# Conclusion : un secret poussé une fois est un secret
# compromis. La seule réponse correcte est de le RÉVOQUER
# et d'en générer un nouveau — pas de le supprimer du
# fichier et d'espérer.`,
    },
    {
      kind: "text",
      text: "La règle est donc absolue : aucun secret dans le dépôt, quelles que soient les précautions. Le fichier versionné ne contient que la **forme** de la configuration — le nom des clés — et les valeurs des environnements non sensibles. Les valeurs réelles arrivent au moment du déploiement, par un canal que le dépôt ne voit pas.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "La configuration versionnée référence, elle ne contient pas.",
      code: `spring:
  datasource:
    url: \${DB_URL}
    username: \${DB_USER}
    password: \${DB_PASSWORD}      # jamais de valeur ici

app:
  billing:
    api-key: \${BILLING_API_KEY}
    # Un défaut est possible, mais seulement pour du
    # non sensible : \${BILLING_TIMEOUT:5s}

# La syntaxe \${NOM} lit une variable d'environnement.
# Absente, elle échoue au démarrage — ce qui est le
# comportement souhaité pour un secret.`,
    },
    {
      kind: "text",
      text: "Les variables d'environnement sont le véhicule standard, compris par tous les orchestrateurs. Elles ont cependant leurs limites, qu'il faut connaître : elles sont visibles par tout processus du même conteneur, apparaissent parfois dans des traces de diagnostic, et ne se renouvellent qu'au redémarrage. Pour un contexte exigeant, un gestionnaire dédié — Vault, ou le service de secrets du fournisseur d'hébergement — apporte la rotation, l'audit des accès et le chiffrement au repos.",
    },
    {
      kind: "text",
      text: "Deux précautions complètent le dispositif. D'abord ne jamais passer un secret en argument de ligne de commande : contrairement aux variables d'environnement, ces arguments sont lisibles par tous les utilisateurs de la machine via la liste des processus. Ensuite se méfier des traces : un objet de configuration dont la méthode `toString` inclut le mot de passe finira tôt ou tard dans un journal, et les journaux sont souvent moins protégés que la base.",
    },
    {
      kind: "comparison",
      title: "Deux niveaux de protection",
      left: {
        label: "Variables d'environnement",
        text: "Simples, universelles, suffisantes pour la plupart des projets. Injectées par l'orchestrateur depuis un magasin de secrets. Limites : visibles dans le conteneur, pas de rotation sans redémarrage, pas d'audit des accès.",
      },
      right: {
        label: "Gestionnaire de secrets",
        text: "Vault, ou l'équivalent du fournisseur. Le secret est lu à l'exécution, avec rotation automatique, baux à durée limitée et journal des accès. Coût : un composant de plus à exploiter, et une dépendance au démarrage.",
      },
    },
    {
      kind: "text",
      text: "Actuator mérite une mention, parce qu'il est souvent activé sans qu'on y pense. Son exposition `env` liste toute la configuration effective. Spring Boot masque par défaut les valeurs dont la clé contient `password`, `secret`, `key`, `token` ou `credentials`, mais cette heuristique ne couvre pas une clé nommée autrement — un `app.billing.authorization` passera en clair. Exposer `env` hors d'un réseau protégé est à éviter.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Détecter avant de pousser",
      text: "Un crochet Git et un analyseur de secrets dans l'intégration continue — `gitleaks`, `git-secrets`, ou l'analyse native de la forge — coûtent une heure à mettre en place et attrapent la faute avant qu'elle ne devienne permanente. C'est l'un des rares dispositifs de sécurité dont le rapport entre le coût et le risque évité n'est pas discutable.",
    },
    {
      kind: "text",
      text: "Si le secret est déjà parti, l'ordre des opérations compte : révoquer d'abord, réécrire l'historique ensuite si on le souhaite, et jamais l'inverse. Nettoyer l'historique prend du temps, casse les clones existants, et pendant ce temps le secret reste valide. Ce qui protège n'est pas la disparition du texte, c'est le fait que la valeur ne serve plus à rien.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "spot",
    id: "spring-conf-19",
    difficulty: 1,
    tags: ["spring", "configuration", "secrets"],
    prompt: "Ce fichier est sur le point d'être poussé sur le dépôt. Quelle ligne pose problème ?",
    code: {
      language: "yaml",
      code: `spring:
  datasource:
    url: jdbc:postgresql://db.prod/app
    username: app_user
    password: Pr0dP@ss!
app:
  billing:
    timeout: 5s`,
    },
    faultyLine: 5,
    reasons: [
      "Un mot de passe en clair : une fois poussé, il reste dans l'historique de tous les clones et doit être considéré comme compromis.",
      "L'URL de production ne doit jamais figurer dans un fichier versionné.",
      "Le nom d'utilisateur `app_user` doit s'écrire en kebab-case.",
      "Le délai `5s` devrait être exprimé en millisecondes pour être portable.",
    ],
    reasonAnswer: 0,
    explanation:
      "Une URL et un nom d'utilisateur ne sont pas des secrets ; un mot de passe l'est. Poussé une seule fois, il reste consultable dans l'historique, dans chaque clone et dans les caches d'intégration continue : le retirer par un commit ultérieur ne le protège pas. La bonne écriture est `password: ${DB_PASSWORD}`, la valeur arrivant par l'environnement au déploiement.",
  },
  {
    kind: "mcq",
    id: "spring-conf-20",
    difficulty: 2,
    tags: ["spring", "configuration", "secrets"],
    prompt: "Un mot de passe de production a été poussé sur le dépôt il y a trois mois. Par quoi commencer ?",
    choices: [
      "Le révoquer et en générer un nouveau : il est compromis, quel que soit le nettoyage effectué ensuite.",
      "Réécrire l'historique Git pour effacer toute trace de la valeur, puis prévenir l'équipe.",
      "Le retirer du fichier par un nouveau commit, ce qui suffit puisque la version courante ne le contient plus.",
      "Rendre le dépôt privé, ce qui empêche toute consultation de l'historique.",
    ],
    answer: 0,
    explanation:
      "Ce qui protège n'est pas la disparition du texte mais le fait que la valeur ne serve plus. Le secret est déjà dans tous les clones, les caches d'intégration continue et les sauvegardes : le nettoyage de l'historique prend du temps, casse les clones existants, et pendant ce temps le secret reste valide. On révoque d'abord, on nettoie ensuite si on le souhaite.",
  },
  {
    kind: "recall",
    id: "spring-conf-21",
    difficulty: 2,
    tags: ["spring", "configuration", "secrets"],
    prompt: "Pourquoi ne jamais passer un secret en argument de ligne de commande, alors que les variables d'environnement sont acceptables ?",
    explanation:
      "Parce que les arguments de lancement d'un processus sont lisibles par **tous les utilisateurs de la machine** : un simple `ps` les affiche, et ils apparaissent aussi dans l'historique du shell et dans les traces de supervision des processus. Les variables d'environnement, elles, ne sont visibles que par le processus lui-même et ceux qui partagent son contexte, ce qui reste une exposition mais bien plus étroite. Aucun des deux n'égale un gestionnaire de secrets — qui apporte la rotation, les baux à durée limitée et l'audit des accès — mais l'écart entre l'argument de ligne de commande et la variable d'environnement est celui entre une valeur publique sur la machine et une valeur confinée au conteneur.",
    keyPoints: [
      "Les arguments sont visibles par tout utilisateur via ps",
      "Ils apparaissent aussi dans l'historique du shell et la supervision",
      "Une variable d'environnement reste confinée au processus et à son conteneur",
      "Ni l'un ni l'autre n'égale un gestionnaire de secrets",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Organiser sa configuration sans se tromper d'environnement
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "spring-conf-l8",
  title: "Organiser sa configuration sans se tromper d'environnement",
  blocks: [
    {
      kind: "text",
      text: "Les mécanismes vus jusqu'ici — sources, précédence, profils, liaison typée, validation, secrets — ne valent que par la façon dont on les assemble. Une configuration bien organisée se reconnaît à un test simple : quelqu'un qui arrive sur le projet doit pouvoir dire, en regardant les fichiers, ce qui change entre deux environnements et où sont fournies les valeurs manquantes.",
    },
    {
      kind: "text",
      text: "Le premier principe est la **séparation par nature**. Le fichier général porte ce qui est vrai partout : structure des clés, valeurs par défaut raisonnables, réglages du framework. Les fichiers de profil ne portent que les différences, ce qui les garde courts et lisibles. Les secrets ne sont dans aucun des deux : ils sont référencés par `${VARIABLE}` et fournis au déploiement.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Une organisation qui tient sur la durée.",
      code: `src/main/resources/
  application.yml            commun + défauts + \${VAR} pour
                             tout ce qui est sensible
  application-dev.yml        base en mémoire, traces bavardes
  application-prod.yml       pools, délais, traces mesurées

src/test/resources/
  application-test.yml       jeu de réglages des tests

Fourni au déploiement, jamais versionné :
  DB_URL, DB_USER, DB_PASSWORD, BILLING_API_KEY
  SPRING_PROFILES_ACTIVE=prod

Documenté dans le dépôt :
  .env.example               la LISTE des variables
                             attendues, sans les valeurs`,
    },
    {
      kind: "text",
      text: "Le fichier d'exemple mérite qu'on insiste : il ne contient aucune valeur, seulement les noms des variables attendues, éventuellement commentés. C'est ce qui permet à quelqu'un qui déploie de savoir ce qu'il doit fournir, sans avoir à lire le code ni à découvrir les manques un par un au démarrage. Son absence est la cause la plus fréquente des premiers déploiements ratés.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Un test qui vérifie que chaque profil se charge.",
      code: `@SpringBootTest
@ActiveProfiles("prod")
@TestPropertySource(properties = {
        "DB_URL=jdbc:h2:mem:test",
        "DB_USER=sa", "DB_PASSWORD=x",
        "BILLING_API_KEY=fake"
})
class ProdConfigurationTest {

    @Test
    void le_contexte_se_charge_avec_le_profil_prod() {
        // Aucune assertion nécessaire : si une clé manque
        // ou si une valeur viole une contrainte, le
        // chargement du contexte échoue et le test rougit.
    }
}`,
    },
    {
      kind: "text",
      text: "Ce test coûte quelques lignes et attrape une catégorie entière d'erreurs : faute de frappe dans une clé de profil, contrainte de validation violée par une valeur par défaut, propriété obligatoire oubliée après un renommage. Il s'exécute en une seconde, sans serveur ni base réelle, et fait échouer l'intégration continue avant que le problème n'atteigne un environnement.",
    },
    {
      kind: "comparison",
      title: "Deux stratégies de valeur par défaut",
      left: {
        label: "Le défaut est le développement",
        text: "L'application démarre sans configuration sur le poste d'un développeur. Confortable, mais dangereux : un oubli de profil en production fait pointer vers des ressources de développement, silencieusement, et l'on croit tourner alors qu'on écrit ailleurs.",
      },
      right: {
        label: "Le défaut est l'échec",
        text: "Aucune valeur par défaut sur ce qui désigne une ressource externe : l'absence fait échouer le démarrage. Moins confortable au premier lancement, mais un déploiement mal configuré s'arrête au lieu de fonctionner sur les mauvaises données.",
      },
    },
    {
      kind: "text",
      text: "La seconde stratégie est presque toujours la bonne pour tout ce qui désigne une ressource externe — base, service, clé. Le confort du premier lancement se retrouve autrement, par un profil `dev` explicite et un fichier d'exemple, sans transformer un oubli en incident silencieux. Le principe est le même qu'ailleurs : le comportement par défaut doit être le moins dangereux, pas le plus pratique.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Tracer la configuration effective au démarrage",
      text: "Écrire au lancement, en une ligne de journal, les profils actifs et les points de terminaison contactés — sans les secrets — donne à un exploitant le moyen de vérifier en un coup d'œil que l'application tourne bien contre les bonnes ressources. C'est la seule protection contre l'erreur qu'aucune validation ne détecte : une URL parfaitement valide qui pointe vers le mauvais environnement.",
    },
    {
      kind: "text",
      text: "En entretien, une question sur la configuration attend rarement une récitation de l'ordre de précédence. Ce qui distingue, c'est de raconter l'organisation : ce qui est versionné et ce qui ne l'est pas, comment un nouvel arrivant sait quoi fournir, ce qui échoue au démarrage plutôt qu'à l'usage, et comment on vérifie qu'on tourne contre le bon environnement. Ce sont les questions qui se posent réellement en exploitation.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "mcq",
    id: "spring-conf-22",
    difficulty: 2,
    tags: ["spring", "configuration"],
    prompt: "Que doit contenir un fichier `.env.example` versionné dans le dépôt ?",
    choices: [
      "La liste des noms de variables attendues, sans aucune valeur, éventuellement commentés.",
      "Les valeurs de développement, pour que l'application démarre sans configuration supplémentaire.",
      "Les valeurs de production, chiffrées avec une clé partagée par l'équipe.",
      "Rien : un tel fichier ne doit jamais être versionné.",
    ],
    answer: 0,
    explanation:
      "Il documente le contrat de déploiement : ce qu'il faut fournir, sans rien divulguer. Quelqu'un qui déploie pour la première fois sait ainsi quoi préparer, au lieu de découvrir les manques un par un à chaque démarrage raté. Y mettre des valeurs, même de développement, ramène le risque qu'on cherchait justement à écarter.",
  },
  {
    kind: "match",
    id: "spring-conf-23",
    difficulty: 2,
    tags: ["spring", "configuration"],
    prompt: "Associe chaque contenu à l'endroit où il doit vivre.",
    pairs: [
      { left: "Valeurs par défaut vraies partout", right: "application.yml, versionné" },
      { left: "Différences propres à un environnement", right: "application-{profil}.yml, versionné" },
      { left: "Mot de passe de base de données", right: "Variable d'environnement fournie au déploiement" },
      { left: "Liste des variables attendues", right: ".env.example, versionné et sans valeurs" },
    ],
    explanation:
      "La séparation se fait par nature, pas par commodité : ce qui est vrai partout, ce qui varie, ce qui est secret, et ce qui documente. Un projet qui respecte cette répartition se relit en quelques minutes — on voit immédiatement ce qui change entre deux environnements et ce qu'il faut fournir pour déployer.",
  },
  {
    kind: "order",
    id: "spring-conf-24",
    difficulty: 3,
    tags: ["spring", "configuration"],
    prompt: "Une valeur inattendue en production : remets le diagnostic dans l'ordre.",
    items: [
      "Demander la valeur effective et sa source, par /actuator/env ou l'Environment",
      "Identifier la source gagnante : variable d'environnement, argument, fichier de profil",
      "Vérifier où cette source est définie — manifeste de déploiement, script de lancement",
      "Corriger à cet endroit, et non dans le fichier qu'on avait ouvert en premier",
    ],
    explanation:
      "Le réflexe coûteux consiste à modifier `application.yml` et à redéployer pour voir. Si la valeur vient d'une variable d'environnement posée dans un manifeste, cela n'aura strictement aucun effet, et l'on aura perdu un cycle de déploiement complet. Nommer la source gagnante avant de toucher quoi que ce soit ramène le diagnostic à quelques minutes.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "spring-configuration",
  title: "Configuration : sources, profils, liaison typée et secrets",
  objective:
    "Savoir d'où vient une valeur de configuration et laquelle gagne, écrire des fichiers YAML sans pièges, composer des profils, lier la configuration à des objets typés et validés au démarrage, tenir les secrets hors du dépôt et organiser le tout pour ne jamais se tromper d'environnement.",
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
