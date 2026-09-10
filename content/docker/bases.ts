/**
 * Docker — Images, Dockerfile, multi-stage, compose (référentiel 7.1 à 7.3).
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Image, conteneur, volume, réseau
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "docker-l1",
  title: "Image, conteneur, volume, réseau : les quatre objets",
  blocks: [
    {
      kind: "text",
      text: "Une **image** est un modèle en lecture seule : un empilement de couches contenant un système de fichiers et une commande de démarrage. Un **conteneur** est une instance d'image en cours d'exécution, avec une couche d'écriture propre, jetée à sa suppression. Un **volume** est un espace de stockage géré par Docker qui survit au conteneur. Un **réseau** relie des conteneurs qui se joignent par leur nom.",
    },
    {
      kind: "text",
      text: "Contrairement à une machine virtuelle, un conteneur n'embarque pas de noyau : il partage celui de l'hôte, isolé par des **namespaces** (processus, réseau, fichiers) et limité par des **cgroups** (CPU, mémoire). D'où un démarrage en millisecondes et une image de quelques dizaines de mégaoctets.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Le cycle de vie complet, en six commandes.",
      code: `# construire une image depuis le Dockerfile du dossier
docker build -t shop:1.0 .

# lancer : détaché, port hôte 8080 → conteneur 8080
docker run -d --name shop -p 8080:8080 \\
  -e SPRING_PROFILES_ACTIVE=dev shop:1.0

docker ps                 # conteneurs en cours
docker logs -f shop       # suivre la sortie standard
docker exec -it shop sh   # un shell dans le conteneur

docker stop shop          # SIGTERM, puis SIGKILL après 10 s
docker rm shop            # supprime le conteneur (arrêté)
docker rmi shop:1.0       # supprime l'image`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "`-p 8080:80` se lit **hôte:conteneur**. Tout ce qui est écrit dans le conteneur hors d'un volume disparaît avec `docker rm`. Et `docker rm` refuse un conteneur en marche : `stop` d'abord, ou `rm -f`.",
    },
    {
      kind: "text",
      text: "`-d` détache, `--name` nomme, `-e` injecte une variable d'environnement, `-v volume:/chemin` monte un volume, `--rm` supprime le conteneur à l'arrêt. `docker ps -a` montre aussi les conteneurs arrêtés.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "docker-01",
    difficulty: 1,
    tags: ["docker", "images", "conteneurs"],
    prompt: "Quelle est la relation entre une image et un conteneur ?",
    choices: [
      "L'image est un modèle en lecture seule ; le conteneur est une instance qui l'exécute avec sa propre couche d'écriture.",
      "Le conteneur est le fichier téléchargé, l'image est le processus lancé.",
      "Une image ne peut donner qu'un seul conteneur à la fois.",
      "Les deux termes désignent la même chose selon que le processus tourne ou non.",
    ],
    answer: 0,
    explanation:
      "Comme une classe et ses instances : une image immuable, autant de conteneurs qu'on veut, chacun avec sa couche d'écriture jetable. Lancer dix fois `docker run nginx` crée dix conteneurs à partir de la même image.",
  },
  {
    kind: "output",
    id: "docker-02",
    difficulty: 2,
    tags: ["docker", "conteneurs", "ports"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "bash",
      code: `docker run -d --name web -p 8080:80 nginx
curl -s -o /dev/null -w "%{http_code}" localhost:80`,
    },
    choices: [
      "`curl` échoue : connexion refusée sur le port 80 de l'hôte, nginx est publié sur 8080.",
      "`200` : nginx écoute sur le port 80.",
      "`200` : Docker publie automatiquement les deux ports.",
      "`docker run` échoue : le port 80 est réservé à root.",
    ],
    answer: 0,
    explanation:
      "`-p 8080:80` signifie port **8080 de l'hôte** vers port **80 du conteneur**. Nginx écoute bien sur 80, mais à l'intérieur du conteneur. Depuis l'hôte, c'est `localhost:8080`. L'erreur d'ordre hôte/conteneur est la plus fréquente des erreurs Docker.",
  },
  {
    kind: "match",
    id: "docker-03",
    difficulty: 1,
    tags: ["docker", "commandes"],
    prompt: "Associe chaque commande à son effet.",
    pairs: [
      { left: "`docker exec -it app sh`", right: "Ouvre un shell dans un conteneur en marche" },
      { left: "`docker logs -f app`", right: "Suit la sortie standard du conteneur" },
      { left: "`docker ps -a`", right: "Liste les conteneurs, arrêtés compris" },
      { left: "`docker rmi shop:1.0`", right: "Supprime une image" },
      { left: "`docker rm app`", right: "Supprime un conteneur arrêté" },
    ],
    explanation:
      "`rm` agit sur un conteneur, `rmi` sur une image : on ne peut pas supprimer une image tant qu'un conteneur l'utilise. `exec` lance un processus supplémentaire dans un conteneur existant, ce n'est pas `run`, qui en crée un nouveau.",
  },
  {
    kind: "mcq",
    id: "docker-04",
    difficulty: 2,
    tags: ["docker", "conteneurs", "vm"],
    prompt: "Pourquoi un conteneur démarre-t-il en quelques millisecondes là où une VM prend des dizaines de secondes ?",
    choices: [
      "Il n'a pas de noyau à démarrer : il partage celui de l'hôte, isolé par des namespaces et limité par des cgroups.",
      "Il est compilé nativement pour l'hôte, sans virtualisation.",
      "Son image est compressée et décompressée en mémoire au lancement.",
      "Docker garde tous les conteneurs en pause, prêts à reprendre.",
    ],
    answer: 0,
    explanation:
      "Une VM émule du matériel et boote un système complet. Un conteneur n'est qu'un processus de l'hôte avec une vue isolée (namespaces PID, réseau, montages) et des quotas (cgroups). Conséquence : un conteneur Linux ne tourne pas nativement sur un noyau Windows ; Docker Desktop passe par une VM Linux.",
  },
  {
    kind: "spot",
    id: "docker-05",
    difficulty: 2,
    tags: ["docker", "conteneurs", "commandes"],
    prompt: "Ce script échoue. Trouve la ligne responsable.",
    code: {
      language: "bash",
      code: `docker build -t shop:1.0 .
docker run -d --name shop -p 8080:8080 shop:1.0
docker logs shop
docker rm shop
docker run -d --name shop -p 8080:8080 shop:1.0`,
    },
    faultyLine: 4,
    reasons: [
      "`docker rm` refuse un conteneur en cours d'exécution : `docker stop shop` avant, ou `docker rm -f shop`.",
      "`docker rm` supprime aussi l'image, la ligne 5 ne trouvera plus `shop:1.0`.",
      "On ne peut pas réutiliser le nom `shop` : les noms sont uniques pour toujours.",
      "`docker logs` bloque tant que le conteneur tourne, la ligne 4 n'est jamais atteinte.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le conteneur lancé en `-d` tourne toujours à la ligne 4 : « cannot remove a running container ». Sans `-f`, il faut l'arrêter d'abord. Le nom redevient disponible dès que le conteneur est supprimé, l'image n'est pas touchée, et `logs` sans `-f` rend la main immédiatement.",
  },
  {
    kind: "recall",
    id: "docker-06",
    difficulty: 1,
    tags: ["docker", "images", "conteneurs", "volumes"],
    prompt: "Définis image, conteneur, volume et réseau en une phrase chacun, et dis ce qui disparaît quand on supprime un conteneur.",
    explanation:
      "**Image** : modèle immuable, empilement de couches avec un système de fichiers et une commande par défaut. **Conteneur** : instance d'une image en exécution, avec une couche d'écriture propre. **Volume** : stockage géré par Docker, monté dans le conteneur, qui lui survit. **Réseau** : bus virtuel où les conteneurs se joignent par leur nom. À `docker rm`, la couche d'écriture du conteneur est perdue : logs écrits sur disque, données d'une base sans volume, fichiers uploadés. Tout ce qui doit durer va dans un volume.",
    keyPoints: ["Image immuable, conteneur = instance", "Volume survit au conteneur", "Réseau : résolution par nom", "`rm` efface la couche d'écriture"],
  },
  {
    kind: "output",
    id: "docker-07",
    difficulty: 2,
    tags: ["docker", "conteneurs", "commandes"],
    prompt: "Que se passe-t-il ?",
    code: {
      language: "bash",
      code: `docker run --rm alpine echo hi
docker ps -a --filter ancestor=alpine`,
    },
    choices: [
      "`hi` s'affiche, puis la liste est vide : `--rm` a supprimé le conteneur dès la fin de `echo`.",
      "`hi` s'affiche, puis un conteneur `alpine` au statut `Exited (0)` est listé.",
      "Rien ne s'affiche : sans `-it`, la sortie du conteneur n'est pas reliée au terminal.",
      "Erreur : `--rm` est incompatible avec une commande explicite.",
    ],
    answer: 0,
    explanation:
      "Sans `-d`, `docker run` attache la sortie standard : `hi` apparaît. Le conteneur se termine quand `echo` se termine, et `--rm` le supprime aussitôt. Sans `--rm`, il resterait en `Exited (0)` dans `docker ps -a` et occuperait de l'espace. `-it` ne sert qu'aux commandes interactives.",
  },
  {
    kind: "fill",
    id: "docker-08",
    difficulty: 1,
    tags: ["docker", "commandes", "ports"],
    prompt: "Complète pour lancer Postgres en arrière-plan, accessible sur le port 5432 de l'hôte, avec un mot de passe.",
    code: {
      language: "bash",
      code: `docker run {{1}} --name db \\
  {{2}} 5432:5432 \\
  {{3}} POSTGRES_PASSWORD=secret \\
  postgres:16`,
    },
    blanks: ["-d", "-p", "-e"],
    distractors: ["-v", "--rm", "-it", "--port"],
    explanation:
      "`-d` détache le conteneur du terminal, `-p hôte:conteneur` publie le port, `-e` injecte une variable d'environnement (l'image `postgres` exige `POSTGRES_PASSWORD`). `-v` monterait un volume, `-it` ouvrirait un terminal interactif, `--port` n'existe pas.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Dockerfile : instructions, couches et cache
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "docker-l2",
  title: "Dockerfile : instructions, couches et cache de build",
  blocks: [
    {
      kind: "text",
      text: "Un Dockerfile décrit une image, instruction par instruction. `FROM` fixe l'image de base, `WORKDIR` le répertoire courant, `COPY` copie des fichiers du contexte de build (`ADD` fait pareil mais sait aussi décompresser des archives et télécharger des URL : à éviter par défaut). `RUN` exécute une commande au build, `ENV` définit une variable disponible au build et à l'exécution, `ARG` une variable disponible **au build seulement**, passée par `--build-arg`.",
    },
    {
      kind: "text",
      text: "`EXPOSE` ne publie rien : c'est une documentation du port écouté, la publication se fait avec `-p`. `CMD` donne la commande par défaut, que l'utilisateur peut remplacer en fin de `docker run`. `ENTRYPOINT` fixe l'exécutable ; `CMD` devient alors ses arguments par défaut. Toujours la forme exec `[\"java\", \"-jar\", \"app.jar\"]` : la forme shell passe par `/bin/sh -c` et ne garantit pas que Java soit le processus 1, celui qui reçoit `SIGTERM` à l'arrêt.",
    },
    {
      kind: "code",
      language: "dockerfile",
      caption: "Dépendances avant sources : le cache survit aux modifications du code.",
      code: `FROM maven:3.9-eclipse-temurin-21
WORKDIR /app

# 1. le pom seul : cette couche ne change que si le pom change
COPY pom.xml .
RUN mvn -q dependency:go-offline

# 2. les sources : c'est ici que le cache est invalidé
COPY src ./src
RUN mvn -q package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/app.jar"]`,
    },
    {
      kind: "text",
      text: "Chaque instruction produit une **couche** mise en cache. Au build suivant, Docker réutilise les couches tant que l'instruction et ses entrées (fichiers copiés) sont identiques ; dès qu'une couche change, **toutes les suivantes** sont reconstruites. D'où l'ordre : ce qui change rarement (dépendances) avant ce qui change souvent (sources).",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "Un `.dockerignore` (`target/`, `.git/`, `node_modules/`, `*.md`) réduit le contexte envoyé au démon et évite qu'un fichier sans rapport n'invalide un `COPY . .`.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "docker-09",
    difficulty: 2,
    tags: ["dockerfile", "couches", "cache-de-build"],
    prompt: "Un premier build a réussi. On modifie un fichier dans `src/` puis on relance `docker build`. Que se passe-t-il ?",
    code: {
      language: "dockerfile",
      code: `FROM maven:3.9-eclipse-temurin-21
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests`,
    },
    choices: [
      "Les quatre premières couches viennent du cache ; `COPY src` et `mvn package` sont réexécutées.",
      "Tout est reconstruit : un changement dans le contexte invalide le cache dès `FROM`.",
      "Seule `RUN mvn package` est réexécutée : `COPY` n'est jamais mise en cache.",
      "Rien n'est reconstruit : Docker ne compare que le Dockerfile, pas les fichiers copiés.",
    ],
    answer: 0,
    explanation:
      "Le cache est vérifié couche par couche. `COPY pom.xml` compare le contenu du fichier : inchangé, la couche et le `mvn dependency:go-offline` qui suit sont réutilisés. `COPY src` détecte la modification : cette couche et toutes les suivantes sont reconstruites. Les dépendances ne sont pas retéléchargées, c'est tout l'intérêt de l'ordre.",
  },
  {
    kind: "output",
    id: "docker-10",
    difficulty: 2,
    tags: ["dockerfile", "entrypoint-cmd"],
    prompt: "Quelle commande s'exécute dans le conteneur ?",
    code: {
      language: "dockerfile",
      code: `ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=dev"]

# puis :
# docker run shop --spring.profiles.active=prod`,
    },
    choices: [
      "`java -jar app.jar --spring.profiles.active=prod`",
      "`java -jar app.jar --spring.profiles.active=dev --spring.profiles.active=prod`",
      "`--spring.profiles.active=prod` seul : l'argument remplace l'`ENTRYPOINT`.",
      "Erreur : on ne peut pas passer d'arguments quand un `ENTRYPOINT` est défini.",
    ],
    answer: 0,
    explanation:
      "Avec un `ENTRYPOINT`, tout ce qui suit le nom de l'image dans `docker run` **remplace `CMD`** et est ajouté en arguments de l'entrypoint. `CMD` n'est que la valeur par défaut. Pour remplacer l'entrypoint lui-même, il faut `--entrypoint`. Ce couple est le pattern standard : exécutable fixe, options par défaut surchargeables.",
  },
  {
    kind: "mcq",
    id: "docker-11",
    difficulty: 2,
    tags: ["dockerfile", "env-arg"],
    prompt: "Quelle différence entre `ARG` et `ENV` dans un Dockerfile ?",
    choices: [
      "`ARG` n'existe que pendant le build (passé par `--build-arg`) ; `ENV` est aussi présent dans le conteneur à l'exécution.",
      "`ARG` est pour les chaînes, `ENV` pour les nombres.",
      "`ENV` n'existe que pendant le build ; `ARG` persiste à l'exécution.",
      "Aucune : ce sont deux syntaxes pour la même chose.",
    ],
    answer: 0,
    explanation:
      "`ARG VERSION=1.0` sert à paramétrer le build (version, URL de dépôt) et disparaît de l'image finale. `ENV JAVA_OPTS=...` est vu par les processus du conteneur. Ne jamais mettre un secret dans `ENV` : il est lisible dans `docker inspect` et dans l'historique de l'image.",
  },
  {
    kind: "spot",
    id: "docker-12",
    difficulty: 2,
    tags: ["dockerfile", "cache-de-build", "couches"],
    prompt: "Ce Dockerfile fonctionne, mais chaque modification d'un fichier source retélécharge toutes les dépendances Maven. Trouve la ligne responsable.",
    code: {
      language: "dockerfile",
      code: `FROM maven:3.9-eclipse-temurin-21
WORKDIR /app
COPY . .
RUN mvn dependency:go-offline
RUN mvn package -DskipTests`,
    },
    faultyLine: 3,
    reasons: [
      "`COPY . .` copie les sources avec le pom : tout changement de source invalide cette couche et donc le `dependency:go-offline` qui suit. Copier `pom.xml` seul avant.",
      "`COPY . .` doit être `ADD . .` pour bénéficier du cache.",
      "`dependency:go-offline` est inutile : `package` télécharge déjà les dépendances.",
      "`WORKDIR` doit venir après le `COPY`, sinon les fichiers sont copiés à la racine.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le cache d'une couche `COPY` dépend du contenu copié. En copiant tout d'un coup, la moindre ligne changée dans `src/` reconstruit la couche, et toutes les suivantes, y compris le téléchargement des dépendances. La correction : `COPY pom.xml .` puis `RUN mvn dependency:go-offline`, et seulement ensuite `COPY src ./src`. `ADD` ne change rien au cache et `WORKDIR` avant `COPY` est correct.",
  },
  {
    kind: "order",
    id: "docker-13",
    difficulty: 2,
    tags: ["dockerfile", "cache-de-build"],
    prompt: "Remets ces instructions dans l'ordre qui exploite le mieux le cache de build.",
    items: ["`FROM maven:3.9-eclipse-temurin-21`", "`WORKDIR /app`", "`COPY pom.xml .`", "`RUN mvn dependency:go-offline`", "`COPY src ./src`", "`RUN mvn package -DskipTests`"],
    explanation:
      "Du plus stable au plus volatil. La base et le répertoire ne changent jamais ; le pom change rarement, et le téléchargement des dépendances qui en dépend reste en cache ; les sources changent à chaque commit et n'invalident que la compilation. Inverser `COPY src` et `COPY pom.xml` ferait retélécharger les dépendances à chaque build.",
  },
  {
    kind: "fill",
    id: "docker-14",
    difficulty: 2,
    tags: ["dockerfile", "env-arg"],
    prompt: "Complète : la version est passée au build par `--build-arg`, les options JVM doivent être visibles à l'exécution, et le port écouté est documenté.",
    code: {
      language: "dockerfile",
      code: `FROM eclipse-temurin:21-jre
# passé par : docker build --build-arg APP_VERSION=1.0
{{1}} APP_VERSION=1.0
# lu par le conteneur à l'exécution
{{2}} JAVA_OPTS="-XX:MaxRAMPercentage=75"
WORKDIR /app
COPY target/app-\${APP_VERSION}.jar app.jar
# documente le port, ne le publie pas
{{3}} 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`,
    },
    blanks: ["ARG", "ENV", "EXPOSE"],
    distractors: ["PORT", "VAR", "PUBLISH", "LABEL"],
    explanation:
      "`ARG` est la seule instruction alimentée par `--build-arg`, et sa valeur n'existe pas dans le conteneur. `ENV` persiste à l'exécution, ce qui permet à l'entrypoint de lire `$JAVA_OPTS`. `EXPOSE` documente ; `PORT` et `PUBLISH` n'existent pas ; `LABEL` ajoute des métadonnées. Ici la forme `sh -c` est volontaire pour développer la variable.",
  },
  {
    kind: "recall",
    id: "docker-15",
    difficulty: 2,
    tags: ["dockerfile", "couches", "cache-de-build"],
    prompt: "Explique le cache de build par couches, et pourquoi on copie `pom.xml` avant `src/`.",
    explanation:
      "Chaque instruction du Dockerfile produit une **couche** immuable. Au build suivant, Docker réutilise une couche si l'instruction est identique et, pour `COPY`/`ADD`, si le contenu des fichiers n'a pas changé. Dès qu'une couche est invalidée, **toutes celles qui suivent** sont reconstruites, même inchangées. On ordonne donc du plus stable au plus volatil : copier `pom.xml` seul et résoudre les dépendances d'abord, de sorte que ce téléchargement lent reste en cache tant que le pom ne bouge pas ; copier `src/` ensuite, pour que le changement de code ne recompile que la couche de build. Un `.dockerignore` évite qu'un fichier sans rapport n'invalide un `COPY`.",
    keyPoints: ["Une instruction = une couche", "Invalidation en cascade vers le bas", "Stable en haut, volatil en bas", "`pom.xml` puis deps, puis `src/`"],
  },
  {
    kind: "mcq",
    id: "docker-16",
    difficulty: 1,
    tags: ["dockerfile", "ports"],
    prompt: "Le Dockerfile contient `EXPOSE 8080`. Après `docker run -d shop`, l'application répond-elle sur `localhost:8080` ?",
    choices: [
      "Non : `EXPOSE` est une documentation, le port n'est publié qu'avec `-p 8080:8080` (ou `-P`).",
      "Oui : `EXPOSE` publie le port sur l'hôte avec le même numéro.",
      "Oui, mais seulement si l'application écoute sur 0.0.0.0.",
      "Non : il faut aussi `ENV SERVER_PORT=8080`.",
    ],
    answer: 0,
    explanation:
      "`EXPOSE` renseigne les métadonnées de l'image et sert à `-P`, qui publie tous les ports exposés sur des ports aléatoires de l'hôte. Sans `-p`, le port reste joignable uniquement depuis les autres conteneurs du même réseau. Écouter sur `0.0.0.0` est nécessaire mais ne suffit pas.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Une image Java propre
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "docker-l3",
  title: "Une image Java propre : multi-stage, non-root, JVM sous contrainte",
  blocks: [
    {
      kind: "text",
      text: "Compiler dans l'image d'exécution embarque Maven, le JDK et les sources dans le livrable. Le **build multi-stage** sépare les deux : une première étape `FROM maven … AS build` compile, une seconde `FROM eclipse-temurin:21-jre` ne copie que le jar avec `COPY --from=build`. L'image finale ne contient qu'un JRE et l'application.",
    },
    {
      kind: "code",
      language: "dockerfile",
      caption: "Deux étapes, un utilisateur non-root, une JVM qui respecte le conteneur.",
      code: `FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre
RUN useradd -r -u 1001 app
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --start-period=40s \\
  CMD curl -sf localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", \\
            "-jar", "app.jar"]`,
    },
    {
      kind: "text",
      text: "Le choix de l'image de base compte. `eclipse-temurin:21-jre` (Ubuntu, glibc) est le défaut sûr. Les variantes **Alpine** sont plus petites mais utilisent **musl** au lieu de glibc : certaines bibliothèques natives ne fonctionnent pas. **Distroless** n'a ni shell ni gestionnaire de paquets : surface d'attaque minimale, mais impossible d'ouvrir un `sh` pour déboguer.",
    },
    {
      kind: "text",
      text: "Par défaut, le processus tourne en **root** dans le conteneur : une faille de l'application devient une faille root. `USER app` après avoir créé l'utilisateur corrige cela. Côté JVM, depuis JDK 10 elle lit les limites **cgroup** du conteneur ; `-XX:MaxRAMPercentage=75` dimensionne le heap en proportion, là où un `-Xmx` fixe ignore la limite et finit tué par l'OOM killer.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Spring Boot sait extraire un jar en **couches** (`dependencies`, `spring-boot-loader`, `snapshot-dependencies`, `application`) avec `java -Djarmode=tools -jar app.jar extract --layers` (Boot 3.3+ ; `-Djarmode=layertools` avant). Copiées dans cet ordre, seules les couches modifiées sont renvoyées au registry.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "output",
    id: "docker-17",
    difficulty: 2,
    tags: ["images", "alpine", "dockerfile"],
    prompt: "Que se passe-t-il au `docker build` ?",
    code: {
      language: "dockerfile",
      code: `FROM eclipse-temurin:21-jre-alpine
RUN apt-get update && apt-get install -y curl
COPY target/app.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]`,
    },
    choices: [
      "Le build échoue à la ligne 2 : `apt-get: not found`. Alpine utilise `apk`, pas APT.",
      "Le build réussit : `apt-get` est présent dans toutes les images Temurin.",
      "Le build réussit mais `curl` n'est pas installé, sans erreur.",
      "Le build échoue à la ligne 3 : `COPY` ne fonctionne pas sur Alpine.",
    ],
    answer: 0,
    explanation:
      "Alpine n'est pas Debian : son gestionnaire de paquets est `apk` (`apk add --no-cache curl`). Un `RUN` qui échoue interrompt le build avec le code de sortie de la commande (127 : commande introuvable). C'est l'exemple le plus visible des différences Alpine ; la plus sournoise est musl, qui casse des bibliothèques natives sans message clair.",
  },
  {
    kind: "mcq",
    id: "docker-18",
    difficulty: 1,
    tags: ["multi-stage", "images"],
    prompt: "Quel est l'intérêt principal d'un build multi-stage pour une application Java ?",
    choices: [
      "L'image finale ne contient que le JRE et le jar : ni Maven, ni JDK, ni sources, donc plus petite et moins exposée.",
      "Il compile en parallèle sur plusieurs machines.",
      "Il permet d'utiliser plusieurs versions de Java dans le même conteneur.",
      "Il évite d'écrire un `.dockerignore`.",
    ],
    answer: 0,
    explanation:
      "Sans multi-stage, l'outillage de build (plusieurs centaines de Mo, avec ses propres CVE) part en production. Avec `COPY --from=build`, seul le jar traverse la frontière. Les étapes de build restent en cache localement mais ne font pas partie de l'image taguée.",
  },
  {
    kind: "spot",
    id: "docker-19",
    difficulty: 3,
    tags: ["jvm-en-conteneur", "dockerfile"],
    prompt: "Ce conteneur, lancé avec `--memory=1g`, est tué régulièrement par l'OOM killer. Trouve la ligne responsable.",
    code: {
      language: "dockerfile",
      code: `FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-Xmx4g", "-jar", "app.jar"]`,
    },
    faultyLine: 4,
    reasons: [
      "`-Xmx4g` fixe un heap supérieur à la limite cgroup de 1 Go : la JVM la dépasse et le noyau tue le conteneur. Utiliser `-XX:MaxRAMPercentage`.",
      "Il manque `-Xms4g` pour réserver la mémoire au démarrage.",
      "La forme exec de `ENTRYPOINT` ne permet pas d'options JVM.",
      "Le JRE ne sait pas lire les limites du conteneur : il faut un JDK complet.",
    ],
    reasonAnswer: 0,
    explanation:
      "Depuis JDK 10, la JVM lit la limite cgroup et dimensionne son heap en proportion (25 % par défaut). Un `-Xmx` explicite écrase ce calcul : avec 4 Go autorisés dans 1 Go réel, le heap grossit jusqu'à ce que le noyau tue le processus, sans `OutOfMemoryError` Java. `-XX:MaxRAMPercentage=75` suit la limite quelle qu'elle soit. JRE et JDK partagent cette logique.",
  },
  {
    kind: "fill",
    id: "docker-20",
    difficulty: 2,
    tags: ["multi-stage", "non-root", "dockerfile"],
    prompt: "Complète ce build multi-stage avec un utilisateur non-root.",
    code: {
      language: "dockerfile",
      code: `FROM maven:3.9-eclipse-temurin-21 {{1}} build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre
RUN useradd -r -u 1001 app
WORKDIR /app
COPY {{2}}=build /app/target/app.jar app.jar
{{3}} app
ENTRYPOINT ["java", "-jar", "app.jar"]`,
    },
    blanks: ["AS", "--from", "USER"],
    distractors: ["FROM", "--stage", "RUN", "--chown", "WITH"],
    explanation:
      "`AS build` nomme l'étape, `COPY --from=build` va chercher un fichier dans son système de fichiers, `USER app` bascule l'utilisateur pour toutes les instructions suivantes et pour le processus du conteneur. `--chown` change le propriétaire des fichiers copiés mais ne change pas l'utilisateur d'exécution ; `--stage` et `WITH` n'existent pas.",
  },
  {
    kind: "recall",
    id: "docker-21",
    difficulty: 2,
    tags: ["jvm-en-conteneur"],
    prompt: "Comment la JVM se comporte-t-elle face à la limite mémoire d'un conteneur, et comment la configurer correctement ?",
    explanation:
      "Depuis **JDK 10** (rétroporté en 8u191), la JVM est « container-aware » : elle lit les limites **cgroup** (mémoire, CPU) au lieu de celles de l'hôte. Sans option, le heap maximal vaut **25 %** de la mémoire du conteneur, ce qui est souvent trop peu. `-XX:MaxRAMPercentage=75` (ou 50 à 80 selon la part hors-heap : metaspace, threads, buffers) suit automatiquement la limite, quel que soit l'environnement. Un `-Xmx` fixe ignore la limite : trop bas, on gaspille ; trop haut, le noyau tue le conteneur (OOM killer) sans `OutOfMemoryError` Java. Vérifier avec `java -XX:+PrintFlagsFinal -version | grep MaxHeapSize` dans le conteneur.",
    keyPoints: ["Container-aware depuis JDK 10", "25 % par défaut, trop peu", "`MaxRAMPercentage` plutôt que `-Xmx`", "Dépasser la limite = OOM killer, pas `OutOfMemoryError`"],
  },
  {
    kind: "match",
    id: "docker-22",
    difficulty: 2,
    tags: ["images", "alpine", "distroless"],
    prompt: "Associe chaque image de base à sa caractéristique.",
    pairs: [
      { left: "`eclipse-temurin:21-jre`", right: "JRE sur Ubuntu, glibc : le choix par défaut" },
      { left: "`eclipse-temurin:21-jre-alpine`", right: "Très petite, mais musl : bibliothèques natives à risque" },
      { left: "Distroless Java", right: "Ni shell ni gestionnaire de paquets : surface minimale, debug difficile" },
      { left: "`eclipse-temurin:21` (JDK)", right: "Outils de compilation : pour l'étape de build, pas pour l'exécution" },
    ],
    explanation:
      "Le compromis est taille contre compatibilité et diagnostic. Alpine gagne quelques dizaines de Mo au prix de musl ; distroless supprime tout ce qui n'est pas la JVM, y compris `sh`, donc pas de `docker exec` interactif. Le JDK complet n'a sa place que dans l'étape de build.",
  },
  {
    kind: "mcq",
    id: "docker-23",
    difficulty: 2,
    tags: ["images", "couches", "layered-jars"],
    prompt: "Pourquoi extraire un jar Spring Boot en couches (`dependencies`, `spring-boot-loader`, `snapshot-dependencies`, `application`) plutôt que copier le jar entier ?",
    choices: [
      "Les dépendances, stables, forment une couche cachée ; seule la petite couche `application` change à chaque build, donc push et pull ne transfèrent que celle-ci.",
      "La JVM démarre plus vite quand les classes sont dépaquetées.",
      "Un jar exécutable ne peut pas être lancé directement dans un conteneur.",
      "C'est obligatoire pour que `HEALTHCHECK` fonctionne.",
    ],
    answer: 0,
    explanation:
      "Un `COPY app.jar` de 60 Mo change à chaque build, donc la couche entière est renvoyée au registry à chaque déploiement. Avec des couches séparées, 55 Mo de dépendances restent identiques et cachées ; seuls quelques centaines de Ko d'`application` bougent. Le démarrage n'est pas plus rapide de façon notable ; un jar se lance très bien tel quel.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Compose : app + Postgres en local
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "docker-l4",
  title: "Compose : l'application et sa base en une commande",
  blocks: [
    {
      kind: "text",
      text: "Compose décrit plusieurs conteneurs dans un `compose.yaml` et les lance ensemble avec `docker compose up -d`. Chaque **service** est soit une image (`image: postgres:16`), soit un build local (`build: .`). Tous les services partagent un réseau par défaut où chacun est joignable **par son nom** : l'application se connecte à `db:5432`, jamais à `localhost`, qui désigne le conteneur lui-même.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Une base persistante, une application qui attend qu'elle soit prête.",
      code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: shop
      POSTGRES_PASSWORD: \${DB_PASSWORD}   # lu dans .env
    volumes:
      - pgdata:/var/lib/postgresql/data   # volume nommé
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/shop
      SPRING_DATASOURCE_PASSWORD: \${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:`,
    },
    {
      kind: "text",
      text: "`depends_on` seul ne garantit que l'ordre de **démarrage** des conteneurs, pas que Postgres accepte des connexions. Avec un `healthcheck` sur `db` et `condition: service_healthy`, l'application n'est lancée qu'une fois `pg_isready` satisfait. Les secrets vont dans un fichier `.env` non versionné, interpolé par `${VAR}`.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Sans volume, les données de Postgres vivent dans la couche d'écriture du conteneur et disparaissent au `docker compose down`. Avec un volume nommé, elles survivent à `down`… mais pas à `down -v`, qui supprime aussi les volumes.",
    },
    {
      kind: "text",
      text: "Commandes utiles : `docker compose up -d --build` reconstruit l'image de l'app, `docker compose logs -f app` suit un service, `docker compose exec db psql -U postgres shop` ouvre un client SQL, `docker compose down` arrête et supprime conteneurs et réseau.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "output",
    id: "docker-24",
    difficulty: 2,
    tags: ["compose", "healthcheck"],
    prompt: "Que se passe-t-il au premier `docker compose up` sur une machine où l'image Postgres n'est pas encore téléchargée ?",
    code: {
      language: "yaml",
      code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
  app:
    build: .
    depends_on:
      - db`,
    },
    choices: [
      "`app` démarre dès que le conteneur `db` est créé, souvent avant que Postgres accepte des connexions : `Connection refused` au démarrage de Spring, et `app` s'arrête.",
      "`app` attend que Postgres réponde : `depends_on` vérifie la disponibilité du service.",
      "Compose refuse de démarrer : `depends_on` exige un `healthcheck` sur `db`.",
      "Les deux démarrent en parallèle, sans aucun ordre.",
    ],
    answer: 0,
    explanation:
      "La forme courte de `depends_on` n'impose que l'ordre de démarrage des conteneurs : `db` est lancé avant `app`, mais Postgres met quelques secondes à initialiser son répertoire de données et à écouter. Spring tente sa connexion aussitôt et échoue. Solution : `healthcheck` sur `db` et `depends_on: db: condition: service_healthy`, ou une politique `restart` sur `app` en secours.",
  },
  {
    kind: "fill",
    id: "docker-25",
    difficulty: 2,
    tags: ["compose", "healthcheck", "volumes"],
    prompt: "Complète pour que l'app attende que Postgres réponde, et que les données survivent à un `down`.",
    code: {
      language: "yaml",
      code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "{{1}} -U postgres"]
      interval: 5s
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: {{2}}
volumes:
  {{3}}:`,
    },
    blanks: ["pg_isready", "service_healthy", "pgdata"],
    distractors: ["pg_ping", "service_started", "healthy", "data", "psql"],
    explanation:
      "`pg_isready` est l'utilitaire Postgres qui teste l'acceptation des connexions ; `psql` exigerait une base et un mot de passe. `condition: service_healthy` attend que le healthcheck passe, `service_started` ne fait qu'attendre le lancement du conteneur. Le volume nommé doit être déclaré sous `volumes:` à la racine, avec le nom utilisé dans le service.",
  },
  {
    kind: "spot",
    id: "docker-26",
    difficulty: 2,
    tags: ["compose", "reseau"],
    prompt: "L'application ne parvient jamais à joindre la base. Trouve la ligne responsable.",
    code: {
      language: "yaml",
      code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
  app:
    build: .
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/shop
    depends_on:
      - db`,
    },
    faultyLine: 9,
    reasons: [
      "Dans le conteneur `app`, `localhost` désigne `app` lui-même. Il faut le nom du service : `db:5432`, résolu par le DNS du réseau Compose.",
      "Le port 5432 de `db` n'est pas publié avec `ports:`, il faut l'ajouter.",
      "L'URL JDBC doit utiliser `postgres://`, pas `jdbc:postgresql://`.",
      "`depends_on` doit lister `db` avant la section `environment`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Chaque conteneur a son propre namespace réseau : `localhost` y est le conteneur courant. Compose crée un réseau où chaque service est joignable par son nom. Publier le port (`ports:`) sert à l'hôte, pas aux conteneurs entre eux : ils communiquent sur le réseau interne sans publication. L'ordre des clés YAML n'a aucun effet.",
  },
  {
    kind: "mcq",
    id: "docker-27",
    difficulty: 1,
    tags: ["compose", "volumes"],
    prompt: "Avec un volume nommé `pgdata` pour Postgres, que devient la base après `docker compose down` puis `docker compose up -d` ?",
    choices: [
      "Elle est intacte : `down` supprime conteneurs et réseau, mais pas les volumes nommés. Seul `down -v` les efface.",
      "Elle est perdue : `down` supprime tout ce que `up` a créé, volumes compris.",
      "Elle est intacte uniquement si le service a `restart: always`.",
      "Elle est perdue sauf si on a fait `docker compose stop` avant `down`.",
    ],
    answer: 0,
    explanation:
      "`down` = `stop` + suppression des conteneurs et du réseau. Les volumes nommés sont conservés précisément pour que les données survivent. Pour repartir de zéro (réinitialiser une base de dev), `docker compose down -v`. `restart` concerne le redémarrage automatique des conteneurs, pas les données.",
  },
  {
    kind: "recall",
    id: "docker-28",
    difficulty: 2,
    tags: ["compose", "volumes", "persistance"],
    prompt: "Pourquoi déclarer un volume nommé pour Postgres dans Compose, et que se passe-t-il sans ?",
    explanation:
      "Postgres écrit ses données dans `/var/lib/postgresql/data`. Sans volume, ce répertoire vit dans la **couche d'écriture du conteneur** : chaque `docker compose down` (ou `docker rm`) détruit la base, et chaque `up` repart vide. Un **volume nommé** (`pgdata:/var/lib/postgresql/data`, déclaré sous `volumes:`) est géré par Docker hors du conteneur : il survit à `down`, aux mises à jour d'image et aux recréations du service. Il est supprimé seulement par `down -v` ou `docker volume rm`. Alternative : un bind mount (`./data:/var/lib/...`) pour voir les fichiers sur l'hôte, moins portable et plus lent sur macOS/Windows.",
    keyPoints: ["Sans volume : données dans la couche du conteneur, perdues au `down`", "Volume nommé : géré par Docker, survit", "`down -v` l'efface", "Bind mount : visible sur l'hôte, moins portable"],
  },
  {
    kind: "match",
    id: "docker-29",
    difficulty: 1,
    tags: ["compose"],
    prompt: "Associe chaque clé Compose à son rôle.",
    pairs: [
      { left: "`image:`", right: "Utilise une image existante du registry" },
      { left: "`build:`", right: "Construit l'image depuis un Dockerfile local" },
      { left: "`ports:`", right: "Publie un port du service sur l'hôte" },
      { left: "`environment:`", right: "Variables d'environnement du conteneur" },
      { left: "`depends_on:`", right: "Ordre de démarrage, et attente si `condition` est précisée" },
    ],
    explanation:
      "`image` et `build` sont exclusifs dans l'usage courant (avec les deux, `build` produit une image nommée par `image`). `ports` ne sert qu'à l'hôte : entre services, on parle directement par nom sur le réseau interne. `depends_on` court = ordre seulement ; avec `condition: service_healthy` = attente réelle.",
  },
  {
    kind: "recall",
    id: "docker-30",
    difficulty: 2,
    tags: ["compose", "healthcheck", "reseau"],
    prompt: "Comment garantir que l'application ne démarre qu'une fois Postgres prêt à accepter des connexions ?",
    explanation:
      "Trois éléments. Un **`healthcheck`** sur le service `db` : `test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]` avec `interval`, `retries` et éventuellement `start_period`. Sur `app`, **`depends_on`** en forme longue : `db: condition: service_healthy`, qui bloque le lancement d'`app` tant que le healthcheck n'est pas passé. Et l'URL de connexion pointant sur le **nom du service** (`jdbc:postgresql://db:5432/shop`), pas `localhost`. En complément, `restart: on-failure` sur `app` couvre une base qui redémarre plus tard. La forme courte `depends_on: - db` ne suffit jamais : elle n'attend que la création du conteneur.",
    keyPoints: ["`healthcheck` avec `pg_isready`", "`depends_on` + `condition: service_healthy`", "Hôte = nom du service", "Forme courte = ordre seulement"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "docker-bases",
  title: "Images, Dockerfile, multi-stage, compose",
  objective:
    "Lancer et diagnostiquer un conteneur, écrire un Dockerfile Java qui exploite le cache et tourne sans root, et monter une stack app + Postgres avec Compose.",
  prerequisites: [],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
