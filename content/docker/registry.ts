/**
 * Docker — Registre et distribution (référentiel 7.4) : couches et digests,
 * tags, registre, CI, taille, analyse, signature, rétention.
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Image, couche, digest
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "docker-reg-l1",
  title: "Image, couche, digest",
  blocks: [
    {
      kind: "text",
      text: "Une image Docker n'est pas un fichier. C'est un **manifeste** qui référence une liste de couches, chacune identifiée par l'empreinte de son contenu. Comprendre cette structure explique d'un coup le cache de construction, la taille des images, la vitesse des transferts et pourquoi un secret effacé dans un `Dockerfile` reste accessible.",
    },
    {
      kind: "code",
      language: "dockerfile",
      caption: "Chaque instruction qui modifie le système produit une couche.",
      code: `FROM eclipse-temurin:21-jre       # couche : le JRE
WORKDIR /app                      # métadonnée
COPY target/app.jar app.jar       # couche : le jar
ENTRYPOINT ["java","-jar","app.jar"]  # métadonnée

# Trois éléments distincts :
#  · les COUCHES : empilées, en lecture seule,
#    partagées entre images
#  · le MANIFESTE : la liste ordonnée de ces couches
#    et la configuration
#  · le DIGEST : l'empreinte du manifeste,
#    sha256:a1b2c3… — l'identité réelle de l'image`,
    },
    {
      kind: "text",
      text: "Les couches sont **immuables et partagées**. Si dix images partent de la même image de base, cette couche n'est stockée qu'une fois sur la machine et transférée une seule fois depuis le registre. C'est ce qui rend un déploiement rapide : seules les couches absentes localement sont téléchargées, et la couche applicative fait souvent quelques dizaines de mégaoctets face à plusieurs centaines pour la base.",
    },
    {
      kind: "text",
      text: "Cette propriété a une contrepartie qu'on découvre au premier incident de sécurité : une couche ne peut pas être modifiée après coup. Supprimer un fichier dans une instruction ultérieure ajoute une couche qui le **masque**, sans l'effacer de la couche précédente. Quiconque obtient l'image peut extraire cette couche et lire le fichier.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Le secret « supprimé » qui reste lisible.",
      code: `# Dockerfile dangereux
COPY id_rsa /root/.ssh/id_rsa
RUN git clone git@interne:projet.git && rm /root/.ssh/id_rsa

# La clé est dans la couche du COPY, définitivement.
docker save monimage | tar -x
# → chaque couche est une archive, extractible.
# → la clé privée est là, malgré le rm.

# La seule réponse correcte : ne jamais faire entrer
# le secret dans une couche.
RUN --mount=type=secret,id=ssh git clone …`,
    },
    {
      kind: "text",
      text: "Le digest est l'identité véritable de l'image : une empreinte calculée sur le manifeste, donc sur l'ensemble du contenu. Deux images de digests identiques sont rigoureusement la même image, bit pour bit. C'est la seule référence qui ne puisse pas changer de sens, contrairement au tag, qui est un simple pointeur.",
    },
    {
      kind: "comparison",
      title: "Deux façons de désigner une image",
      left: {
        label: "Par tag — app:1.2",
        text: "Lisible, pratique, mais **mutable** : rien n'empêche de repousser un contenu différent sous le même tag. Deux `docker pull` à deux mois d'intervalle peuvent rapporter deux images différentes sans qu'aucun fichier local n'ait changé.",
      },
      right: {
        label: "Par digest — app@sha256:a1b2…",
        text: "Illisible, mais **immuable** : ce digest désignera toujours exactement ce contenu. C'est la seule forme qui garantisse qu'on exécute ce qu'on a testé, et la seule acceptable dans un déploiement reproductible.",
      },
    },
    {
      kind: "text",
      text: "L'ordre des instructions décide du cache. Docker réutilise une couche tant que l'instruction et son contexte n'ont pas changé ; dès qu'une couche est invalidée, toutes les suivantes le sont. Copier le code source avant d'installer les dépendances fait donc réinstaller toutes les dépendances à chaque modification d'une ligne de code — l'erreur de construction la plus fréquente.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Inspecter avant de supposer",
      text: "`docker history <image>` affiche chaque couche, sa taille et l'instruction qui l'a produite. C'est l'outil qui répond en une seconde aux deux questions les plus courantes : pourquoi cette image fait-elle huit cents mégaoctets, et pourquoi le cache est-il invalidé si tôt. Beaucoup d'optimisations supposées se révèlent inutiles une fois cette sortie lue.",
    },
    {
      kind: "text",
      text: "Le partage a une limite qu'on rencontre en pratique : deux images ne partagent une couche que si elles la produisent **à l'identique**, même instruction et même contenu. Deux équipes partant de la même image de base mais mettant à jour les paquets à des dates différentes obtiennent deux couches distinctes, et le registre stocke les deux. Uniformiser les images de base au sein d'une organisation a donc un effet direct et mesurable sur le stockage.",
    },
    {
      kind: "text",
      text: "Retenons les trois niveaux : des couches immuables et partagées, un manifeste qui les ordonne, un digest qui identifie l'ensemble. Presque tout ce qui suit dans ce chapitre — taille, cache, reproductibilité, sécurité — découle directement de cette structure.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "docker-reg-01",
    difficulty: 2,
    tags: ["docker", "images"],
    prompt: "Un `Dockerfile` copie une clé privée puis la supprime dans une instruction `RUN` ultérieure. Est-elle protégée ?",
    choices: [
      "Non : la clé reste dans la couche du `COPY`, que la suppression ne fait que masquer.",
      "Oui : la couche suivante écrase le contenu de la précédente.",
      "Oui, à condition que la suppression soit dans la même instruction `RUN`.",
      "Non, mais elle devient illisible car les couches sont chiffrées.",
    ],
    answer: 0,
    explanation:
      "Les couches sont immuables : une suppression ajoute une couche qui masque le fichier sans l'effacer de la précédente. `docker save` puis extraction donne accès à chaque couche, donc à la clé. La seule réponse correcte est de ne jamais faire entrer le secret dans une couche — par exemple avec un montage de secret pendant la construction.",
  },
  {
    kind: "match",
    id: "docker-reg-02",
    difficulty: 2,
    tags: ["docker", "images"],
    prompt: "Associe chaque élément à ce qu'il est.",
    pairs: [
      { left: "Couche", right: "Un ensemble de fichiers immuable, partagé entre images" },
      { left: "Manifeste", right: "La liste ordonnée des couches et la configuration" },
      { left: "Digest", right: "L'empreinte du manifeste : l'identité réelle de l'image" },
      { left: "Tag", right: "Un pointeur mutable vers un digest" },
    ],
    explanation:
      "Le partage des couches explique la vitesse des déploiements : seules les couches absentes localement sont téléchargées. L'immuabilité explique le problème du secret masqué. Et la distinction tag/digest explique pourquoi deux `docker pull` à deux mois d'intervalle peuvent rapporter deux images différentes.",
  },
  {
    kind: "recall",
    id: "docker-reg-03",
    difficulty: 2,
    tags: ["docker", "images", "cache"],
    prompt: "Pourquoi l'ordre des instructions d'un `Dockerfile` change-t-il radicalement le temps de construction ?",
    explanation:
      "Parce que Docker réutilise une couche tant que l'instruction et son contexte n'ont pas changé, et que l'invalidation d'une couche **invalide toutes les suivantes**. Copier le code source avant d'installer les dépendances place donc l'instruction la plus volatile — le code, modifié à chaque commit — avant la plus coûteuse : chaque changement d'une ligne fait réinstaller l'intégralité des dépendances. La forme correcte copie d'abord les fichiers de description des dépendances, lance l'installation, puis copie le source : tant que les dépendances ne bougent pas, leur couche est reprise du cache et seule la dernière est reconstruite. C'est l'optimisation de construction la plus rentable, et `docker history` permet de vérifier en une seconde où le cache se casse réellement, plutôt que de le supposer.",
    keyPoints: [
      "Une couche invalidée invalide toutes les suivantes",
      "Le code change à chaque commit : il doit venir en dernier",
      "Copier les descripteurs de dépendances, installer, puis copier le source",
      "docker history montre où le cache se casse",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Les tags ne sont pas des versions
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "docker-reg-l2",
  title: "Les tags ne sont pas des versions",
  blocks: [
    {
      kind: "text",
      text: "Un tag ressemble à un numéro de version et se comporte comme une variable. C'est un simple pointeur vers un digest, que n'importe qui disposant des droits peut faire pointer ailleurs. Cette différence explique la majorité des incidents « ça marchait hier » liés aux conteneurs.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Le tag qui bouge sous les pieds.",
      code: `# Lundi, la CI construit et pousse
docker build -t registre/app:1.2 .
docker push registre/app:1.2      # → sha256:aaa…

# Mardi, un correctif urgent, même numéro
docker build -t registre/app:1.2 .
docker push registre/app:1.2      # → sha256:bbb…

# Mercredi, un nouveau nœud démarre et tire 1.2
# → il obtient bbb, pas aaa.
# Deux nœuds font tourner « la version 1.2 » avec
# deux contenus différents. Rien ne le signale.`,
    },
    {
      kind: "text",
      text: "Le scénario n'a rien d'exotique : il suffit d'une reconstruction sous le même tag, geste banal lors d'un correctif pressé. Le résultat est un parc où deux machines exécutent officiellement la même version avec des binaires différents — et où un comportement observé sur l'une ne se reproduit pas sur l'autre.",
    },
    {
      kind: "text",
      text: "`latest` amplifie le problème sans avoir aucune propriété particulière : ce n'est pas « la dernière image », c'est simplement le tag utilisé par défaut quand on n'en précise aucun. Rien ne garantit qu'il désigne la construction la plus récente, et il est fréquent qu'il pointe vers une image de plusieurs mois qu'on a oublié de mettre à jour.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Une stratégie de tags qui tient.",
      code: `# Immuable, unique, traçable : l'empreinte du commit
docker build -t registre/app:sha-4f9a2c1 .

# Tags mouvants pour le confort, en plus et jamais
# à la place :
docker tag registre/app:sha-4f9a2c1 registre/app:1.2.3
docker tag registre/app:sha-4f9a2c1 registre/app:1.2
docker tag registre/app:sha-4f9a2c1 registre/app:latest

# Et dans le déploiement, on épingle le DIGEST :
image: registre/app@sha256:a1b2c3d4…
# → impossible qu'un autre contenu arrive ici.`,
    },
    {
      kind: "text",
      text: "Le tag par empreinte de commit est le seul qui soit à la fois lisible et naturellement immuable : deux constructions du même commit produisent le même nom, et jamais deux commits différents. Il donne aussi la traçabilité gratuite — à partir d'une image qui tourne, on retrouve en une seconde le code exact qui l'a produite.",
    },
    {
      kind: "comparison",
      title: "Deux politiques de déploiement",
      left: {
        label: "Par tag mouvant",
        text: "`image: app:1.2`. Confortable, mais le contenu peut changer entre deux démarrages de conteneur. Un redémarrage à trois heures du matin peut tirer une image que personne n'a validée — et l'incident paraîtra inexplicable.",
      },
      right: {
        label: "Par digest épinglé",
        text: "`image: app@sha256:…`. Moins lisible, mais on exécute exactement ce qui a été testé. Le déploiement devient reproductible, et la mise à jour devient un changement explicite et visible dans la revue.",
      },
    },
    {
      kind: "text",
      text: "Les tags mouvants gardent une utilité réelle : ils servent aux humains. Personne ne veut lire un digest pour savoir ce qui tourne. La règle qui concilie les deux est donc de **publier des tags mouvants et de déployer par digest** — l'un pour la conversation, l'autre pour la machine.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Verrouiller l'immuabilité dans le registre",
      text: "La plupart des registres savent interdire d'écraser un tag existant. Activer cette option transforme une règle d'équipe en garantie technique : la deuxième poussée sous le même tag échoue, et l'on ne peut plus créer silencieusement deux contenus pour une même version. C'est quelques clics et cela supprime une catégorie entière d'incidents.",
    },
    {
      kind: "text",
      text: "Un cas particulier revient souvent : les images de base tierces. Écrire `FROM postgres:16` dans un `Dockerfile` revient à accepter que le contenu change entre deux constructions, puisque ce tag est mouvant chez son éditeur. Pour une construction réellement reproductible, l'image de base doit elle aussi être épinglée par digest — et mise à jour explicitement, ce qui rend visible un changement qui était jusque-là subi.",
    },
    {
      kind: "text",
      text: "Retenons la phrase qui évite le piège : un tag est un nom, un digest est une identité. Tout ce qui doit être reproductible — un déploiement, un jeu de tests, une analyse de vulnérabilités — se raisonne sur le digest. Le tag sert à parler entre humains, et rien d'autre — c'est une étiquette, pas une preuve.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "docker-reg-04",
    difficulty: 2,
    tags: ["docker", "tags"],
    prompt: "L'image a été construite avec le tag `1.0` uniquement. Que fait la dernière commande ?",
    code: {
      language: "bash",
      code: `docker build -t app:1.0 .
docker images app
# REPOSITORY   TAG   IMAGE ID
# app          1.0   a1b2c3d4

docker run app`,
    },
    choices: [
      "Elle échoue : `docker run app` sous-entend `app:latest`, qui n'existe pas.",
      "Elle lance `app:1.0`, seule image disponible sous ce nom.",
      "Elle lance la dernière image construite, quel que soit son tag.",
      "Elle télécharge `app:latest` depuis le registre public.",
    ],
    answer: 0,
    explanation:
      "`latest` n'a aucune propriété particulière : c'est simplement le tag utilisé par défaut quand on n'en précise aucun. Comme il n'a pas été créé ici, la référence ne résout rien — Docker tentera d'ailleurs de le tirer d'un registre avant d'échouer. C'est la meilleure illustration du fait que `latest` ne signifie pas « le plus récent ».",
  },
  {
    kind: "mcq",
    id: "docker-reg-05",
    difficulty: 2,
    tags: ["docker", "tags", "deploiement"],
    prompt: "Pourquoi épingler le digest plutôt que le tag dans un déploiement ?",
    choices: [
      "Le tag est un pointeur mutable : le contenu peut changer entre deux démarrages de conteneur.",
      "Le digest se télécharge plus vite que le tag correspondant.",
      "Les tags ne sont pas acceptés par les orchestrateurs en production.",
      "Le digest permet de revenir en arrière automatiquement en cas d'échec.",
    ],
    answer: 0,
    explanation:
      "Une reconstruction sous le même tag — geste banal lors d'un correctif pressé — fait pointer ce tag vers un autre contenu. Un nœud qui redémarre à trois heures du matin tire alors une image que personne n'a validée, et l'incident paraît inexplicable. Le digest est une empreinte du contenu : il ne peut pas désigner autre chose.",
  },
  {
    kind: "recall",
    id: "docker-reg-06",
    difficulty: 2,
    tags: ["docker", "tags"],
    prompt: "Quelle stratégie de tags concilie lisibilité et reproductibilité ?",
    explanation:
      "Publier **plusieurs tags pour la même image** et déployer par digest. On construit avec un tag naturellement immuable et traçable — l'empreinte du commit, `sha-4f9a2c1` — qui garantit que deux commits différents ne produiront jamais le même nom et permet de retrouver instantanément le code exact derrière une image qui tourne. On y ajoute les tags mouvants utiles aux humains : `1.2.3`, `1.2`, `latest`, en plus et jamais à la place. Et dans les fichiers de déploiement, on épingle le digest, seule référence qu'aucune poussée ultérieure ne peut faire changer de sens. Le tag sert à la conversation, le digest à la machine. Cette règle d'équipe se transforme en garantie technique si le registre est configuré pour interdire l'écrasement d'un tag existant : la deuxième poussée sous le même nom échoue alors au lieu de créer silencieusement deux contenus pour une même version.",
    keyPoints: [
      "Tag par empreinte de commit : immuable et traçable",
      "Tags mouvants en plus, pour les humains",
      "Déploiement épinglé sur le digest",
      "Interdire l'écrasement de tag dans le registre",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Le registre : pousser, tirer, s'authentifier
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "docker-reg-l3",
  title: "Le registre : pousser, tirer, s'authentifier",
  blocks: [
    {
      kind: "text",
      text: "Un registre est un serveur qui stocke des couches et des manifestes, et les sert par une API HTTP. Tout le reste — Docker Hub, le registre de GitLab, celui d'un fournisseur d'hébergement — n'est qu'une implémentation de la même spécification, ce qui explique qu'on puisse changer de registre sans changer d'outils.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Le nom complet d'une image, décomposé.",
      code: `registry.gitlab.com/equipe/projet/app:1.2
└────────┬────────┘ └────────┬──────────┘ └┬┘
      registre            dépôt          tag

# Sans registre explicite, Docker suppose Docker Hub :
docker pull postgres:16
# équivaut à  docker.io/library/postgres:16

# D'où une conséquence à connaître : pousser vers un
# registre privé exige que le nom du registre fasse
# partie du tag.
docker tag app:1.2 registry.gitlab.com/equipe/projet/app:1.2
docker push registry.gitlab.com/equipe/projet/app:1.2`,
    },
    {
      kind: "text",
      text: "Le point qui surprend au début : le registre de destination n'est pas un paramètre de `push`, c'est une partie du **nom** de l'image. On ne pousse pas une image vers un registre, on pousse une image dont le nom désigne déjà ce registre. D'où l'étape de `tag` systématique avant toute publication.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "L'authentification, et où finit le mot de passe.",
      code: `docker login registry.gitlab.com -u utilisateur -p motdepasse
# ⚠ le mot de passe finit dans l'historique du shell,
#   et dans la liste des processus.

# Forme correcte : lire depuis l'entrée standard
echo "$TOKEN" | docker login registry.gitlab.com \\
    -u "$UTILISATEUR" --password-stdin

# Après login, les identifiants sont stockés dans
# ~/.docker/config.json — EN BASE64, PAS CHIFFRÉS.
cat ~/.docker/config.json
# { "auths": { "registry.gitlab.com": { "auth": "dXNlcjp0b2tlbg==" } } }
#   → base64 -d suffit à les relire.`,
    },
    {
      kind: "text",
      text: "Deux détails de sécurité découlent de là. Passer un mot de passe en argument le laisse dans l'historique du shell et dans la liste des processus, visible par tout utilisateur de la machine. Et le fichier de configuration produit après connexion contient les identifiants encodés en base64, pas chiffrés — une machine partagée ou une image construite avec ce fichier les expose intégralement.",
    },
    {
      kind: "comparison",
      title: "Deux formes d'identifiants",
      left: {
        label: "Mot de passe de compte",
        text: "Donne tous les droits du compte, sur tous les dépôts, sans expiration. À proscrire dans une chaîne d'intégration : une fuite compromet l'ensemble et la révocation oblige à changer le mot de passe partout.",
      },
      right: {
        label: "Jeton à portée limitée",
        text: "Restreint à un dépôt et à une action — lecture seule pour un déploiement, écriture pour la construction —, avec une date d'expiration. Révocable individuellement, sans effet sur le reste. C'est la seule forme acceptable en automatisation.",
      },
    },
    {
      kind: "text",
      text: "La distinction est particulièrement importante pour les déploiements : un environnement de production n'a besoin que de **tirer** des images. Lui donner un jeton en lecture seule supprime la possibilité qu'une compromission de ce nœud serve à pousser une image malveillante dans le registre — un enchaînement classique d'attaque sur la chaîne de livraison.",
    },
    {
      kind: "text",
      text: "Un mot sur ce qui transite : `docker push` n'envoie que les couches **absentes** du registre. Republier une image dont seule la couche applicative a changé transfère quelques dizaines de mégaoctets, pas plusieurs centaines. C'est le même mécanisme de partage que localement, et c'est ce qui rend une chaîne d'intégration rapide même avec des images volumineuses.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un registre privé n'est pas un secret",
      text: "Le contrôle d'accès protège le registre, pas le contenu des images. Toute personne autorisée à tirer une image peut en extraire chaque couche et lire chaque fichier — y compris ce qui devait être « interne ». Un registre privé réduit le nombre de lecteurs possibles ; il ne remplace jamais la règle qui interdit de mettre un secret dans une image.",
    },
    {
      kind: "text",
      text: "Un dernier mécanisme mérite d'être connu : le miroir. Tirer une image publique passe par un registre externe, soumis à des quotas et à des interruptions qui ne dépendent pas de vous. Configurer un miroir interne supprime cette dépendance, accélère les constructions répétées et protège d'une disparition d'image en amont — cas rare mais qui bloque entièrement une chaîne quand il survient.",
    },
    {
      kind: "text",
      text: "Retenons trois éléments : le registre fait partie du nom de l'image, l'authentification doit passer par un jeton à portée limitée lu sur l'entrée standard, et seules les couches manquantes transitent. Ces trois points couvrent l'essentiel de ce qu'on manipule au quotidien.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "fill",
    id: "docker-reg-07",
    difficulty: 2,
    tags: ["docker", "registre", "securite"],
    prompt: "Complète la connexion sûre à un registre.",
    code: {
      language: "bash",
      code: `echo "$TOKEN" | docker login registry.gitlab.com \\
    -u "$UTILISATEUR" --{{1}}

# Puis publier : le registre fait partie du NOM
docker {{2}} app:1.2 registry.gitlab.com/equipe/projet/app:1.2
docker push registry.gitlab.com/equipe/projet/app:1.2`,
    },
    blanks: ["password-stdin", "tag"],
    distractors: ["password", "secret", "push", "rename"],
    explanation:
      "`--password-stdin` lit le jeton sur l'entrée standard : passé en argument avec `-p`, il finirait dans l'historique du shell et dans la liste des processus, visible par tout utilisateur de la machine. Et `docker tag` est nécessaire parce que le registre de destination n'est pas un paramètre de `push` mais une partie du nom de l'image.",
  },
  {
    kind: "mcq",
    id: "docker-reg-08",
    difficulty: 2,
    tags: ["docker", "registre", "securite"],
    prompt: "Quel type d'identifiant donner à un environnement de production qui exécute des conteneurs ?",
    choices: [
      "Un jeton en lecture seule, limité au dépôt concerné et daté.",
      "Le mot de passe du compte de service, pour couvrir tous les cas d'usage.",
      "Un jeton en écriture, afin que le nœud puisse republier l'image après démarrage.",
      "Aucun : un environnement de production doit embarquer les images localement.",
    ],
    answer: 0,
    explanation:
      "La production n'a besoin que de **tirer**. Un jeton en lecture seule supprime la possibilité qu'une compromission de ce nœud serve à pousser une image malveillante dans le registre — enchaînement classique d'attaque sur la chaîne de livraison. Un mot de passe de compte donne au contraire tous les droits partout, sans expiration, et sa révocation oblige à le changer en tous lieux.",
  },
  {
    kind: "recall",
    id: "docker-reg-09",
    difficulty: 2,
    tags: ["docker", "registre", "securite"],
    prompt: "Où finissent les identifiants après un `docker login`, et pourquoi est-ce un problème ?",
    explanation:
      "Dans `~/.docker/config.json`, **encodés en base64 et non chiffrés** : un simple `base64 -d` suffit à les relire en clair. Sur une machine partagée, toute personne ayant accès au compte les récupère. Le problème se manifeste surtout par accident : ce fichier finit régulièrement copié dans une image de construction ou dans un volume monté, et les identifiants du registre partent alors avec l'image. S'y ajoute le cas du mot de passe passé en argument avec `-p`, qui reste dans l'historique du shell et apparaît dans la liste des processus, visible par tout utilisateur de la machine — d'où l'usage de `--password-stdin`. La parade de fond reste le jeton à portée limitée et daté : même divulgué, il ne donne accès qu'à un dépôt, en lecture seule si c'est tout ce qu'il fallait, et se révoque individuellement.",
    keyPoints: [
      "~/.docker/config.json : base64, pas chiffré",
      "Finit souvent copié dans une image ou un volume par accident",
      "-p laisse le mot de passe dans l'historique et dans ps",
      "Parade : jeton à portée limitée, daté, révocable seul",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Le registre GitLab dans une chaîne d'intégration
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "docker-reg-l4",
  title: "Le registre GitLab dans une chaîne d'intégration",
  blocks: [
    {
      kind: "text",
      text: "GitLab fournit un registre attaché à chaque projet, ce qui règle d'un coup l'hébergement, les droits et l'authentification : les permissions du dépôt s'appliquent au registre, et la chaîne d'intégration reçoit automatiquement un jeton valable pour la durée du travail en cours.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Construire et publier, avec les variables fournies.",
      code: `build:
  stage: build
  image: docker:27
  services:
    - docker:27-dind
  script:
    # CI_REGISTRY_USER / _PASSWORD sont fournis : le
    # mot de passe est un jeton éphémère lié au job.
    - echo "$CI_REGISTRY_PASSWORD" | docker login
        "$CI_REGISTRY" -u "$CI_REGISTRY_USER" --password-stdin

    # Tag immuable par empreinte de commit
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"

    # Tags mouvants uniquement sur la branche par défaut
    - if [ "$CI_COMMIT_BRANCH" = "$CI_DEFAULT_BRANCH" ]; then
        docker tag "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
                   "$CI_REGISTRY_IMAGE:latest";
        docker push "$CI_REGISTRY_IMAGE:latest";
      fi`,
    },
    {
      kind: "text",
      text: "Le jeton fourni à la chaîne est **éphémère** : il expire à la fin du travail. C'est une propriété de sécurité importante, car un jeton qui fuite dans un journal de construction n'est déjà plus valable au moment où quelqu'un le lit. Il est aussi limité au projet, ce qui borne naturellement ce qu'un travail compromis pourrait faire.",
    },
    {
      kind: "text",
      text: "La condition sur la branche par défaut mérite d'être notée : publier un tag mouvant depuis n'importe quelle branche fait pointer `latest` vers une image de fonctionnalité non fusionnée. C'est une source classique de confusion — quelqu'un tire `latest` et obtient un travail en cours que personne n'a validé.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Le cache de construction, qui change tout sur la durée.",
      code: `script:
  # Sans cache : chaque exécution reconstruit TOUT,
  # y compris l'installation des dépendances.
  - docker pull "$CI_REGISTRY_IMAGE:cache" || true
  - docker build
      --cache-from "$CI_REGISTRY_IMAGE:cache"
      --build-arg BUILDKIT_INLINE_CACHE=1
      -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA" .

# Les exécuteurs sont éphémères : rien n'est conservé
# d'une exécution à l'autre. Le cache doit donc venir
# du registre lui-même.`,
    },
    {
      kind: "text",
      text: "C'est le point que découvrent toutes les équipes : les exécuteurs d'intégration continue sont jetables, donc le cache local de Docker est vide à chaque démarrage. Sans `--cache-from`, une construction qui prend vingt secondes en local en prend cinq minutes en intégration, à chaque poussée, pour réinstaller des dépendances qui n'ont pas changé.",
    },
    {
      kind: "comparison",
      title: "Deux façons de construire en intégration",
      left: {
        label: "Docker dans Docker",
        text: "Un service `dind` fournit un démon Docker complet. Simple et universel, mais exige un mode privilégié — donc une brèche d'isolation — et repart d'un cache vide à chaque fois.",
      },
      right: {
        label: "Constructeur sans démon",
        text: "Kaniko, Buildah. Construisent une image sans démon ni privilèges, ce qui convient aux environnements verrouillés. Gestion du cache différente, et quelques incompatibilités sur les `Dockerfile` les plus exotiques.",
      },
    },
    {
      kind: "text",
      text: "Le choix dépend surtout des contraintes de la plateforme : là où le mode privilégié est interdit — et il l'est souvent sur les grappes partagées — la question est tranchée d'avance. Sur un exécuteur dédié, `dind` reste le plus simple et le mieux documenté.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les arguments de construction ne sont pas des secrets",
      text: "`--build-arg TOKEN=…` place la valeur dans les métadonnées de l'image : `docker history` la restitue à qui tire l'image. C'est l'une des façons les plus courantes de divulguer un jeton sans s'en apercevoir. Pour un secret nécessaire pendant la construction, il faut un montage de secret, qui n'est jamais écrit dans une couche.",
    },
    {
      kind: "text",
      text: "Une pratique complémentaire limite la casse en cas de problème : construire l'image une seule fois, puis la promouvoir d'un environnement à l'autre par de nouveaux tags plutôt que par une reconstruction. Reconstruire pour la production ce qui a été testé en recette produit un binaire différent, et annule la valeur des tests passés. On teste un artefact, on déploie **ce** même artefact.",
    },
    {
      kind: "text",
      text: "Cette règle a une conséquence pratique sur la configuration : si le même artefact doit servir partout, il ne peut contenir aucune valeur propre à un environnement. Tout ce qui varie doit venir des variables d'environnement au démarrage — ce qui rejoint exactement la discipline décrite pour la configuration d'une application Spring.",
    },
    {
      kind: "text",
      text: "Retenons l'ossature : connexion par le jeton éphémère fourni, tag par empreinte de commit systématique, tags mouvants réservés à la branche par défaut, cache tiré du registre puisque les exécuteurs sont jetables, et aucun secret dans un argument de construction.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "spot",
    id: "docker-reg-10",
    difficulty: 3,
    tags: ["docker", "ci", "securite"],
    prompt: "Cette configuration divulgue un jeton. Quelle ligne ?",
    code: {
      language: "yaml",
      code: `build:
  script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login "$CI_REGISTRY"
        -u "$CI_REGISTRY_USER" --password-stdin
    - docker build --build-arg API_TOKEN="$API_TOKEN"
        -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"`,
    },
    faultyLine: 5,
    reasons: [
      "`--build-arg` place la valeur dans les métadonnées de l'image : `docker history` la restitue à qui tire l'image.",
      "Le jeton de registre est passé en clair à `docker login`.",
      "`CI_COMMIT_SHORT_SHA` n'est pas un tag valide pour un registre.",
      "Le `docker push` devrait précéder le `docker build` pour réserver le tag.",
    ],
    reasonAnswer: 0,
    explanation:
      "Un argument de construction n'est pas un secret : sa valeur est conservée dans les métadonnées de l'image et lisible par quiconque la tire. C'est l'une des façons les plus courantes de divulguer un jeton sans s'en apercevoir. La connexion, elle, est correcte — `--password-stdin` évite justement l'historique et la liste des processus. Pour un secret nécessaire à la construction, il faut un montage de secret.",
  },
  {
    kind: "mcq",
    id: "docker-reg-11",
    difficulty: 2,
    tags: ["docker", "ci"],
    prompt: "Pourquoi une construction rapide en local devient-elle lente en intégration continue ?",
    choices: [
      "Les exécuteurs sont jetables : le cache local de Docker est vide à chaque exécution.",
      "Les exécuteurs limitent volontairement la vitesse des constructions.",
      "Le registre impose une vérification de signature sur chaque couche.",
      "Les images de base sont retéléchargées depuis une source plus lente.",
    ],
    answer: 0,
    explanation:
      "Rien n'est conservé d'une exécution à l'autre : toutes les couches sont reconstruites, y compris l'installation des dépendances. La parade est de tirer le cache depuis le registre avec `--cache-from` et de publier une image de cache, ce qui ramène le temps de construction à celui d'une reconstruction incrémentale.",
  },
  {
    kind: "recall",
    id: "docker-reg-12",
    difficulty: 2,
    tags: ["docker", "ci"],
    prompt: "Pourquoi réserver les tags mouvants à la branche par défaut ?",
    explanation:
      "Parce qu'un tag mouvant publié depuis une branche de fonctionnalité fait pointer `latest` — ou `1.2` — vers une image qui n'a été ni revue ni fusionnée. Quelqu'un qui tire ce tag pour déboguer, pour un environnement de démonstration ou pour un déploiement automatique obtient alors un travail en cours, et le comportement observé ne correspond à aucune version connue. C'est une source classique de confusion, d'autant plus difficile à diagnostiquer que rien ne signale l'anomalie : l'image existe, elle démarre, elle est simplement la mauvaise. Le tag par empreinte de commit, lui, peut et doit être publié depuis **toutes** les branches : il est unique, immuable, et permet de tester une image de fonctionnalité sans jamais recouvrir une référence partagée. La conditionnelle sur la branche par défaut tient en trois lignes dans le fichier de chaîne d'intégration.",
    keyPoints: [
      "Un tag mouvant depuis une branche pointe vers du non fusionné",
      "L'image démarre : rien ne signale qu'elle est la mauvaise",
      "Le tag par empreinte de commit, lui, va sur toutes les branches",
      "Une condition de trois lignes suffit à s'en prémunir",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Réduire la taille d'une image
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "docker-reg-l5",
  title: "Réduire la taille d'une image",
  blocks: [
    {
      kind: "text",
      text: "Une image de huit cents mégaoctets n'est pas seulement lente à transférer : elle contient un compilateur, un gestionnaire de paquets, un shell et des dizaines d'outils dont aucun n'est nécessaire à l'exécution — mais qui sont tous utiles à qui obtiendrait un accès au conteneur. La taille est donc autant une question de sécurité que de performance.",
    },
    {
      kind: "code",
      language: "dockerfile",
      caption: "L'image qui embarque toute la chaîne de construction.",
      code: `FROM maven:3.9-eclipse-temurin-21        # ~800 Mo
WORKDIR /app
COPY . .
RUN mvn package
ENTRYPOINT ["java","-jar","target/app.jar"]

# L'image finale contient :
#  · Maven, le JDK complet, le compilateur
#  · le dépôt local de dépendances
#  · TOUT le code source
#  · les outils du système de base
# alors que l'exécution n'a besoin que d'un JRE
# et d'un fichier jar.`,
    },
    {
      kind: "code",
      language: "dockerfile",
      caption: "La construction en plusieurs étapes : on ne garde que le résultat.",
      code: `# Étape de construction — jetée à la fin
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Les dépendances d'abord : leur couche est réutilisée
# tant que le pom ne change pas.
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

# Étape finale — la seule qui produit l'image
FROM eclipse-temurin:21-jre-alpine       # ~180 Mo
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
USER 1000:1000                            # pas root
ENTRYPOINT ["java","-jar","app.jar"]`,
    },
    {
      kind: "text",
      text: "La construction en plusieurs étapes est l'outil décisif : seule la dernière étape produit l'image publiée, et l'on y copie uniquement l'artefact. Le compilateur, le source et le dépôt de dépendances restent dans une étape intermédiaire qui n'est jamais poussée. Le gain est typiquement d'un facteur quatre à cinq, sans aucune contrainte sur la façon de construire.",
    },
    {
      kind: "text",
      text: "L'ordre des copies dans l'étape de construction est l'autre moitié du gain, non pas en taille mais en temps : copier le descripteur de dépendances et les télécharger **avant** de copier le source permet de réutiliser cette couche tant que les dépendances ne changent pas. Sans cela, chaque modification d'une ligne de code relance un téléchargement complet.",
    },
    {
      kind: "comparison",
      title: "Deux images de base pour l'exécution",
      left: {
        label: "Alpine",
        text: "Très légère, avec un shell et un gestionnaire de paquets — donc déboguable. Utilise la bibliothèque C musl, ce qui provoque des écarts de comportement rares mais réels sur les bibliothèques natives et la résolution de noms.",
      },
      right: {
        label: "Distroless",
        text: "Ni shell, ni gestionnaire de paquets, ni utilitaires : uniquement l'exécution nécessaire. Surface d'attaque minimale — quelqu'un qui obtient une exécution de code n'a aucun outil sous la main. En contrepartie, impossible d'ouvrir un terminal dedans pour investiguer.",
      },
    },
    {
      kind: "text",
      text: "Le compromis est réel et se tranche selon la maturité de l'observabilité. Si l'on diagnostique par les journaux, les métriques et les traces, l'absence de terminal ne gêne pas et la sécurité y gagne. Si l'on a encore besoin d'entrer dans un conteneur pour comprendre, une base avec shell reste plus praticable.",
    },
    {
      kind: "text",
      text: "Deux gestes complémentaires sont souvent oubliés. Un fichier `.dockerignore` empêche d'envoyer au démon le dossier de contrôle de version, les dépendances locales et les artefacts — ce qui accélère la construction et évite de copier accidentellement un fichier d'environnement. Et déclarer un utilisateur non privilégié évite qu'un conteneur compromis ne s'exécute avec les droits de l'administrateur.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Mesurer avant d'optimiser",
      text: "`docker history` classe les couches par taille et désigne l'instruction responsable. La plupart des optimisations improvisées — fusionner des instructions, ajouter des suppressions — s'avèrent inutiles une fois cette sortie lue : dans la quasi-totalité des cas, c'est l'image de base et l'absence de construction en plusieurs étapes qui pèsent, pas les détails du `Dockerfile`.",
    },
    {
      kind: "text",
      text: "Un dernier point concerne les images Java spécifiquement : découper le jar en couches. Les outils modernes savent séparer les dépendances — qui changent rarement — du code applicatif, produisant deux couches distinctes au lieu d'une seule archive monolithique. Le transfert lors d'un déploiement tombe alors de plusieurs dizaines de mégaoctets à quelques centaines de kilo-octets.",
    },
    {
      kind: "text",
      text: "Retenons l'ordre d'efficacité : construction en plusieurs étapes d'abord, image de base minimale ensuite, ordre des couches pour le cache, `.dockerignore` et utilisateur non privilégié pour finir. Les deux premiers points apportent l'essentiel du gain ; les suivants relèvent de l'hygiène.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "spot",
    id: "docker-reg-13",
    difficulty: 2,
    tags: ["docker", "images", "cache"],
    prompt: "Cette construction réinstalle toutes les dépendances à chaque modification du code. Quelle ligne ?",
    code: {
      language: "dockerfile",
      code: `FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -B dependency:go-offline
RUN mvn -B package -DskipTests`,
    },
    faultyLine: 3,
    reasons: [
      "Tout le contexte est copié avant l'installation : la moindre modification du source invalide la couche des dépendances.",
      "`dependency:go-offline` doit être exécuté après `package`, pas avant.",
      "`WORKDIR` doit être déclaré après la copie des fichiers.",
      "`COPY . .` ne fonctionne pas dans une étape nommée avec `AS`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Une couche invalidée invalide toutes les suivantes. En copiant tout le source avant l'installation, chaque commit change cette couche et relance le téléchargement complet des dépendances. La forme correcte copie d'abord le `pom.xml`, lance `dependency:go-offline`, puis copie `src` — la couche des dépendances est alors réutilisée tant que le descripteur ne bouge pas.",
  },
  {
    kind: "order",
    id: "docker-reg-14",
    difficulty: 2,
    tags: ["docker", "images"],
    prompt: "Classe ces optimisations de la plus efficace à la moins efficace sur la taille d'une image Java.",
    items: [
      "Passer à une construction en plusieurs étapes : ne garder que le jar",
      "Choisir une image de base d'exécution minimale plutôt qu'un JDK complet",
      "Ordonner les couches pour réutiliser le cache des dépendances",
      "Ajouter un .dockerignore pour ne pas envoyer les artefacts locaux",
    ],
    explanation:
      "Les deux premiers points apportent l'essentiel du gain — typiquement un facteur quatre à cinq — en supprimant le compilateur, le source et le dépôt de dépendances de l'image publiée. L'ordre des couches agit sur le temps de construction plus que sur la taille, et le `.dockerignore` relève de l'hygiène. `docker history` permet de vérifier où se trouve réellement le poids avant d'optimiser.",
  },
  {
    kind: "recall",
    id: "docker-reg-15",
    difficulty: 2,
    tags: ["docker", "images", "securite"],
    prompt: "En quoi la taille d'une image est-elle aussi une question de sécurité ?",
    explanation:
      "Parce qu'une grosse image contient des **outils**. Un JDK complet embarque un compilateur ; une image de construction embarque un gestionnaire de paquets, un client réseau, un shell, des dizaines d'utilitaires. Aucun n'est nécessaire à l'exécution, mais tous sont immédiatement utiles à quiconque obtiendrait une exécution de code dans le conteneur : télécharger un outil supplémentaire, compiler, explorer le réseau interne. Réduire l'image réduit donc mécaniquement la surface d'attaque, en plus d'accélérer les transferts. C'est le raisonnement qui conduit aux images sans distribution — ni shell, ni gestionnaire de paquets — où une exécution de code obtenue ne donne accès à presque rien. Le compromis est la déboguabilité : sans terminal, on ne peut plus entrer dans le conteneur pour investiguer, ce qui suppose de diagnostiquer par les journaux, les métriques et les traces. S'y ajoute un geste indépendant : déclarer un utilisateur non privilégié, pour qu'un conteneur compromis ne s'exécute pas avec les droits de l'administrateur.",
    keyPoints: [
      "Une grosse image fournit des outils à un attaquant",
      "Compilateur, gestionnaire de paquets, shell, client réseau",
      "Sans distribution : presque rien sous la main, mais plus de terminal",
      "Déclarer un utilisateur non privilégié, indépendamment de la taille",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — Analyser les vulnérabilités
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "docker-reg-l6",
  title: "Analyser les vulnérabilités",
  blocks: [
    {
      kind: "text",
      text: "Une image contient bien plus que votre code : un système de base, ses bibliothèques, une machine virtuelle, et l'ensemble de vos dépendances transitives. Chacun de ces éléments peut porter une vulnérabilité publiée après la construction — et une image parfaitement sûre le jour de sa publication ne l'est plus trois mois après, sans que rien n'ait changé.",
    },
    {
      kind: "text",
      text: "C'est le point qui structure le sujet : la sécurité d'une image **se dégrade avec le temps**, sans modification. Ce n'est pas le code qui change, c'est la connaissance publique des failles qui progresse. Une analyse effectuée une fois à la construction ne dit donc rien de l'état actuel de ce qui tourne en production.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Analyser, et ce que rapporte l'outil.",
      code: `trivy image registre/app:sha-4f9a2c1

registre/app:sha-4f9a2c1 (alpine 3.20)
Total: 14 (CRITICAL: 1, HIGH: 3, MEDIUM: 10)

┌──────────────┬────────────────┬──────────┬──────────┐
│ Bibliothèque │ Vulnérabilité  │ Sévérité │ Corrigée │
├──────────────┼────────────────┼──────────┼──────────┤
│ libssl3      │ CVE-2024-xxxxx │ CRITICAL │ 3.3.2-r1 │
│ busybox      │ CVE-2024-yyyyy │ HIGH     │  —       │
└──────────────┴────────────────┴──────────┴──────────┘

# La colonne « Corrigée » est la plus importante :
# une faille sans correctif disponible ne se règle
# pas en mettant à jour.`,
    },
    {
      kind: "text",
      text: "La colonne indiquant si un correctif existe est celle qu'il faut lire en premier, avant même la sévérité. Une vulnérabilité critique corrigée dans une version disponible se règle par une reconstruction ; une vulnérabilité sans correctif demande une décision — accepter le risque, contourner, ou changer de composant. Traiter les deux de la même façon mène à l'immobilisme.",
    },
    {
      kind: "comparison",
      title: "Deux moments d'analyse",
      left: {
        label: "À la construction",
        text: "Bloque l'introduction d'une faille connue au moment où le changement est fait, quand l'auteur est encore dans le contexte. Ne dit rien des failles publiées plus tard, et laisse donc les images déjà déployées hors de portée.",
      },
      right: {
        label: "En continu sur le registre",
        text: "Réanalyse périodiquement les images existantes avec la base de vulnérabilités à jour. C'est la seule façon d'apprendre qu'une image en production est devenue vulnérable — l'analyse à la construction ne le dira jamais.",
      },
    },
    {
      kind: "text",
      text: "Les deux sont nécessaires et répondent à des questions différentes. Beaucoup d'équipes n'ont que la première, et croient être couvertes : elles le sont contre l'introduction de failles connues, pas contre le vieillissement de ce qui tourne. Or la seconde catégorie est de loin la plus fréquente en pratique.",
    },
    {
      kind: "text",
      text: "Un nombre élevé de vulnérabilités vient presque toujours de l'image de base plutôt que du code applicatif. C'est une bonne nouvelle : changer de base — passer d'une distribution complète à une image minimale — fait souvent tomber le compte de plusieurs dizaines à quelques unités, sans toucher une ligne de code.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Bloquer ce qui est actionnable, signaler le reste.",
      code: `scan:
  script:
    # Échoue uniquement sur ce qui est critique ET
    # corrigeable : c'est actionnable immédiatement.
    - trivy image --exit-code 1
        --severity CRITICAL --ignore-unfixed
        "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"

    # Le reste est publié en rapport, sans bloquer.
    - trivy image --format json -o rapport.json
        "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
  artifacts:
    paths: [rapport.json]`,
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Un seuil trop strict est contourné",
      text: "Bloquer sur toute vulnérabilité, y compris sans correctif disponible, rend la chaîne infranchissable et conduit invariablement à la désactiver « temporairement ». Bloquer uniquement sur ce qui est critique et corrigeable garde la porte fermée là où il y a quelque chose à faire — et une barrière qu'on peut réellement respecter est infiniment plus efficace qu'une barrière contournée.",
    },
    {
      kind: "text",
      text: "Un mot sur ce que l'analyse ne voit pas. Elle identifie des composants connus à partir de leurs métadonnées de paquet : une bibliothèque copiée à la main, un binaire téléchargé pendant la construction ou une dépendance embarquée dans un jar peuvent lui échapper entièrement. Un rapport vierge signifie « rien de connu parmi ce que j'ai su identifier », ce qui est plus modeste qu'il n'y paraît.",
    },
    {
      kind: "text",
      text: "Retenons trois idées : une image vieillit même sans changer, l'analyse à la construction et l'analyse continue répondent à des questions différentes, et le seuil de blocage doit porter sur ce qui est corrigeable. La plupart des équipes en ont une sur trois, et c'est généralement la moins utile.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "mcq",
    id: "docker-reg-16",
    difficulty: 2,
    tags: ["docker", "securite"],
    prompt: "Une image analysée sans vulnérabilité il y a trois mois est-elle encore sûre ?",
    choices: [
      "Pas nécessairement : de nouvelles failles ont pu être publiées depuis, sans que l'image change.",
      "Oui : le contenu de l'image n'ayant pas changé, le résultat de l'analyse reste valable.",
      "Oui, à condition que l'image ait été signée au moment de la construction.",
      "Non : une image expire automatiquement après trente jours dans un registre.",
    ],
    answer: 0,
    explanation:
      "La sécurité d'une image se dégrade avec le temps sans qu'elle soit modifiée : ce n'est pas le contenu qui change, c'est la connaissance publique des failles qui progresse. Une analyse effectuée à la construction ne dit donc rien de l'état actuel de ce qui tourne — seule une réanalyse périodique des images du registre l'apprend.",
  },
  {
    kind: "match",
    id: "docker-reg-17",
    difficulty: 2,
    tags: ["docker", "securite"],
    prompt: "Associe chaque situation à la bonne réaction.",
    pairs: [
      { left: "Critique, correctif disponible", right: "Reconstruire : c'est immédiatement actionnable" },
      { left: "Critique, sans correctif", right: "Décider : accepter, contourner, ou changer de composant" },
      { left: "Des dizaines de failles d'un coup", right: "Regarder l'image de base avant le code applicatif" },
      { left: "Une image en production qui vieillit", right: "Réanalyse périodique du registre, pas à la construction" },
    ],
    explanation:
      "La colonne indiquant l'existence d'un correctif se lit avant la sévérité : elle sépare ce qui se règle par une reconstruction de ce qui demande une décision. Traiter les deux identiquement mène à l'immobilisme, puis au contournement de la barrière — c'est pourquoi le seuil de blocage doit porter sur ce qui est corrigeable.",
  },
  {
    kind: "recall",
    id: "docker-reg-18",
    difficulty: 2,
    tags: ["docker", "securite", "ci"],
    prompt: "Comment régler le seuil de blocage d'une analyse dans une chaîne d'intégration ?",
    explanation:
      "En le faisant porter sur ce qui est **actionnable** : critique et disposant d'un correctif. Bloquer sur toute vulnérabilité, y compris celles sans correctif disponible, rend la chaîne infranchissable — l'équipe ne peut rien faire pour la débloquer — et conduit invariablement à désactiver l'étape « temporairement », ce qui supprime toute protection. Une barrière qu'on peut réellement respecter est infiniment plus efficace qu'une barrière contournée. Le reste des vulnérabilités est publié en rapport, consultable, sans faire échouer la construction : l'information reste disponible pour décider à froid. S'y ajoute que le blocage à la construction ne couvre qu'une moitié du problème — il empêche d'introduire une faille connue, mais ne dit rien des images déjà déployées qui deviennent vulnérables avec le temps. Cela demande une réanalyse périodique des images du registre, avec une base de vulnérabilités à jour.",
    keyPoints: [
      "Bloquer sur critique ET corrigeable seulement",
      "Une barrière infranchissable finit désactivée",
      "Le reste en rapport, sans faire échouer la construction",
      "Compléter par une réanalyse périodique du registre",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Signer et vérifier la provenance
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "docker-reg-l7",
  title: "Signer et vérifier la provenance",
  blocks: [
    {
      kind: "text",
      text: "L'analyse de vulnérabilités répond à « cette image contient-elle des failles connues ». Elle ne répond pas à une question plus fondamentale : **d'où vient cette image, et est-ce bien celle que nous avons construite ?** Un registre compromis, un jeton volé ou une erreur de configuration suffisent à y placer une image qui n'a jamais traversé votre chaîne.",
    },
    {
      kind: "text",
      text: "Les attaques sur la chaîne d'approvisionnement logicielle exploitent exactement cet angle. Elles ne cherchent pas une faille dans le code : elles cherchent à faire exécuter du code légitime **en apparence**. Une image poussée sous un tag attendu, dans le bon registre, avec le bon nom, ne sera remarquée par personne — et elle s'exécutera avec tous les droits accordés à l'application réelle.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Signer à la construction, vérifier au déploiement.",
      code: `# En CI, après la poussée — signature sans clé à
# gérer : l'identité du job sert de preuve.
cosign sign --yes \\
    "$CI_REGISTRY_IMAGE@$DIGEST"

# Au déploiement, avant de lancer quoi que ce soit :
cosign verify \\
    --certificate-identity-regexp "https://gitlab.com/equipe/projet" \\
    --certificate-oidc-issuer https://gitlab.com \\
    "registre/app@sha256:a1b2c3…"

# → Échoue si l'image n'a pas été signée par un job
#   de CE projet. Une image poussée à la main, ou
#   par un jeton volé, ne passe pas.`,
    },
    {
      kind: "text",
      text: "La signature sans clé à gérer est ce qui a rendu la pratique accessible : plutôt que de distribuer et protéger une clé privée — qui devient elle-même une cible — on s'appuie sur l'identité vérifiable du travail d'intégration continue. La vérification consiste alors à exiger que l'image ait été signée par un travail appartenant au bon projet.",
    },
    {
      kind: "comparison",
      title: "Deux garanties complémentaires",
      left: {
        label: "Signature",
        text: "« Cette image vient bien de notre chaîne. » Prouve l'origine et l'intégrité : le digest signé ne peut pas être remplacé. Ne dit rien de la qualité du contenu — une image signée peut être pleine de failles.",
      },
      right: {
        label: "Attestation de provenance",
        text: "« Voici comment elle a été produite. » Décrit le commit, la chaîne, les paramètres de construction. Permet de remonter d'une image en production au code exact et au processus qui l'a fabriquée, de façon vérifiable.",
      },
    },
    {
      kind: "text",
      text: "L'inventaire des composants complète le tableau : une liste, attachée à l'image, de tout ce qu'elle contient — bibliothèques et versions. Le jour où une faille majeure est publiée sur une bibliothèque très répandue, la question « laquelle de nos deux cents images l'embarque ? » se répond par une requête au lieu de plusieurs jours d'analyse.",
    },
    {
      kind: "text",
      text: "Cette dernière capacité est celle dont la valeur se révèle d'un coup, lors d'un incident de grande ampleur. Les équipes qui produisent un inventaire à chaque construction répondent en minutes ; celles qui n'en ont pas reconstruisent l'information à la main, image par image, pendant que l'horloge tourne.",
    },
    {
      kind: "text",
      text: "La vérification doit avoir lieu **au déploiement**, pas seulement en intégration continue : c'est le dernier point avant l'exécution, et le seul qui protège si le registre lui-même est compromis. Les orchestrateurs savent imposer cette politique — refuser de démarrer un conteneur dont l'image n'est pas signée par l'identité attendue.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Commencer par l'épinglage du digest",
      text: "Avant toute infrastructure de signature, déployer par digest apporte déjà une garantie substantielle : le contenu exécuté est exactement celui qui a été testé, et aucune poussée ultérieure ne peut le remplacer. C'est gratuit, immédiat, et cela couvre le scénario le plus fréquent — le tag écrasé par accident, bien plus courant qu'une attaque délibérée.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Imposer la vérification côté orchestrateur.",
      code: `# Une politique d'admission refuse de démarrer un
# conteneur dont l'image n'est pas signée par
# l'identité attendue.
apiVersion: policy.sigstore.dev/v1beta1
kind: ClusterImagePolicy
spec:
  images:
    - glob: "registre/equipe/**"
  authorities:
    - keyless:
        identities:
          - issuer: https://gitlab.com
            subjectRegExp: "https://gitlab.com/equipe/.*"

# C'est le dernier point de contrôle avant exécution,
# et le seul qui protège si le registre est compromis.`,
    },
    {
      kind: "text",
      text: "Placer la vérification dans l'orchestrateur plutôt que dans le script de déploiement a un avantage décisif : elle s'applique à **tout** ce qui démarre, y compris ce qui a été lancé à la main, par un outil tiers ou par une automatisation oubliée. Une vérification qu'on peut contourner en n'utilisant pas le bon script n'est pas une garantie.",
    },
    {
      kind: "text",
      text: "Retenons la progression : épingler le digest, signer à la construction, vérifier au déploiement, attacher provenance et inventaire. Chaque étape est utile seule, et la première apporte déjà l'essentiel du bénéfice pour un coût nul.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "mcq",
    id: "docker-reg-19",
    difficulty: 2,
    tags: ["docker", "securite", "supply-chain"],
    prompt: "À quelle question la signature d'une image répond-elle ?",
    choices: [
      "D'où vient cette image : a-t-elle bien été produite par notre chaîne d'intégration ?",
      "Cette image contient-elle des vulnérabilités connues ?",
      "Cette image est-elle plus récente que celle actuellement déployée ?",
      "Cette image respecte-t-elle les limites de taille fixées par l'équipe ?",
    ],
    answer: 0,
    explanation:
      "La signature prouve l'origine et l'intégrité : elle garantit que le digest vient bien de votre chaîne et n'a pas été remplacé. Elle ne dit rien de la qualité du contenu — une image signée peut être pleine de failles, ce qui relève de l'analyse de vulnérabilités. Les deux garanties sont complémentaires et répondent à des questions différentes.",
  },
  {
    kind: "order",
    id: "docker-reg-20",
    difficulty: 2,
    tags: ["docker", "securite", "supply-chain"],
    prompt: "Classe ces protections de la plus simple à mettre en place à la plus exigeante.",
    items: [
      "Épingler le digest dans les fichiers de déploiement",
      "Interdire l'écrasement des tags dans le registre",
      "Signer chaque image à la construction",
      "Vérifier la signature au déploiement, en refusant de démarrer sinon",
    ],
    explanation:
      "L'épinglage du digest est gratuit et immédiat, et couvre le scénario le plus fréquent : le tag écrasé par accident, bien plus courant qu'une attaque délibérée. La vérification au déploiement est la plus exigeante mais aussi la seule qui protège si le registre lui-même est compromis, puisqu'elle est le dernier point de contrôle avant l'exécution.",
  },
  {
    kind: "fill",
    id: "docker-reg-21",
    difficulty: 2,
    tags: ["docker", "securite", "supply-chain"],
    prompt: "Complète les deux artefacts attachés à une image.",
    code: {
      language: "text",
      code: `{{1}} : « cette image vient bien de notre chaine »
  prouve l'origine et l'integrite du digest

{{2}} : la liste des composants embarques
  repond a « laquelle de nos images contient
  cette bibliotheque vulnerable ? »`,
    },
    blanks: ["signature", "inventaire"],
    distractors: ["manifeste", "digest", "journal"],
    explanation:
      "La signature répond à la question de l'origine ; l'inventaire des composants répond à celle du contenu. La valeur du second se révèle d'un coup lors d'un incident de grande ampleur : les équipes qui en produisent un à chaque construction répondent en minutes, les autres reconstruisent l'information image par image pendant que l'horloge tourne.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Rétention et coûts
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "docker-reg-l8",
  title: "Rétention et coûts",
  blocks: [
    {
      kind: "text",
      text: "Une chaîne d'intégration qui publie une image par commit produit des milliers d'images par an. Sans politique de nettoyage, le registre grossit indéfiniment, la facture de stockage suit, et l'interface devient inutilisable — des pages de tags dont aucun ne dit ce qu'il contient.",
    },
    {
      kind: "text",
      text: "Le volume est moins spectaculaire qu'il n'y paraît, grâce au partage des couches : mille images issues de la même base ne stockent cette base qu'une fois. Ce qui s'accumule, ce sont les couches applicatives — quelques dizaines de mégaoctets à chaque construction — et cela finit tout de même par représenter des centaines de gigaoctets.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Une politique de nettoyage, exprimée en règles.",
      code: `# Garder :
#  · les 10 tags les plus récents par empreinte de commit
#  · tout ce qui ressemble à une version publiée
#  · latest et les tags d'environnement
#
# Supprimer :
#  · les tags sha-* de plus de 30 jours
#  · les images sans tag (orphelines)

cleanup_policy:
  keep_n: 10
  older_than: 30d
  name_regex_delete: "^sha-.*"
  name_regex_keep: "^(latest|v\\\\d+\\\\.\\\\d+\\\\.\\\\d+|prod|staging)$"`,
    },
    {
      kind: "text",
      text: "L'expression de garde est la partie sensible : une erreur y supprime des images de version publiée, qu'aucune reconstruction ne restituera à l'identique. Il faut la vérifier en mode simulation avant de l'activer, et préférer une règle de garde trop large à une règle de suppression trop ambitieuse.",
    },
    {
      kind: "comparison",
      title: "Deux catégories à ne pas confondre",
      left: {
        label: "Images de travail",
        text: "Une par commit, par branche, par demande de fusion. Leur intérêt disparaît quelques jours après la fusion. Ce sont elles qui représentent l'écrasante majorité du volume, et elles peuvent être supprimées agressivement.",
      },
      right: {
        label: "Images publiées",
        text: "Celles qui ont été déployées, ou qui correspondent à une version annoncée. À conserver bien plus longtemps : elles peuvent être nécessaires pour reproduire un incident ancien, ou pour revenir à une version antérieure.",
      },
    },
    {
      kind: "text",
      text: "La durée de conservation des images publiées se décide sur un critère concret : jusqu'où doit-on pouvoir revenir en arrière, et jusqu'à quand doit-on pouvoir reproduire un environnement passé ? Une réponse honnête est souvent plus courte qu'on ne le croit — personne ne redéploie une version vieille de dix-huit mois — mais elle doit être posée plutôt que subie.",
    },
    {
      kind: "text",
      text: "Un piège précis mérite d'être connu : supprimer un tag ne libère pas immédiatement l'espace. Les couches restent tant qu'une autre image les référence, et le nettoyage effectif passe par une collecte des couches orphelines, souvent programmée séparément. Voir l'espace ne pas baisser après une suppression massive est donc normal, et ne signifie pas que la politique a échoué.",
    },
    {
      kind: "text",
      text: "Enfin, une image référencée par un déploiement actif ne doit jamais être supprimée. Cela paraît évident et se produit régulièrement : une politique un peu large efface l'image d'un environnement rarement redéployé, et le problème n'apparaît que des semaines plus tard, au premier redémarrage d'un nœud — qui échoue alors sans explication compréhensible.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Essayer en simulation avant d'activer",
      text: "Toutes les plateformes proposent de lister ce qu'une politique supprimerait sans rien supprimer. Cette étape prend cinq minutes et évite la catégorie d'incident la plus désagréable du domaine : une suppression massive et irréversible d'images dont certaines étaient encore utilisées. Une politique de rétention est du code — elle se relit et s'essaie.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Voir ce qui pèse avant de décider.",
      code: `# Compter les tags par motif
gh api "repos/…/packages" --jq '…'   # ou l'API du registre

# Le plus parlant : la répartition par âge
#   sha-*      : 4 812 tags,  312 Go  ← images de travail
#   v*.*.*     :    37 tags,   14 Go  ← versions publiées
#   latest,prod:     2 tags,    0 Go  ← alias, sans coût propre
#
# → 99 % du volume vient des images de travail.
#   Une règle sur « sha-* de plus de 30 jours »
#   suffit à régler le problème.`,
    },
    {
      kind: "text",
      text: "Ce comptage vaut la peine d'être fait avant d'écrire la moindre règle : il montre presque toujours que l'écrasante majorité du volume vient d'une seule catégorie, et qu'une règle simple portant sur elle suffit. On évite ainsi d'écrire une politique complexe et risquée pour récupérer le dernier pour cent.",
    },
    {
      kind: "text",
      text: "Retenons la répartition : supprimer agressivement les images de travail, conserver longuement les images publiées, vérifier en simulation avant d'activer, et ne pas s'étonner que l'espace ne baisse qu'après la collecte des couches orphelines.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "mcq",
    id: "docker-reg-22",
    difficulty: 2,
    tags: ["docker", "registre", "exploitation"],
    prompt: "Après avoir supprimé des centaines de tags, l'espace occupé n'a presque pas baissé. Pourquoi ?",
    choices: [
      "Les couches restent tant qu'une autre image les référence ; la collecte des orphelines est une étape séparée.",
      "La suppression des tags est différée de trente jours par sécurité.",
      "Les couches supprimées restent dans le cache du registre pendant une semaine.",
      "L'espace affiché est celui alloué, pas celui réellement utilisé.",
    ],
    answer: 0,
    explanation:
      "Les couches sont partagées : supprimer un tag ne retire que le manifeste, et les couches subsistent tant qu'une autre image les référence. La libération effective passe par une collecte des couches orphelines, souvent programmée séparément. Voir l'espace stagner après une suppression massive est donc normal et ne signifie pas que la politique a échoué.",
  },
  {
    kind: "match",
    id: "docker-reg-23",
    difficulty: 2,
    tags: ["docker", "registre", "exploitation"],
    prompt: "Associe chaque catégorie d'image à la politique adaptée.",
    pairs: [
      { left: "Une image par commit de branche", right: "Suppression agressive, quelques jours après la fusion" },
      { left: "Image correspondant à une version publiée", right: "Conservation longue : retour arrière et reproduction d'incident" },
      { left: "Image référencée par un déploiement actif", right: "Jamais supprimée, quelle que soit son ancienneté" },
      { left: "Image sans tag, orpheline", right: "Supprimée par la collecte, qui libère l'espace" },
    ],
    explanation:
      "Les images de travail représentent l'écrasante majorité du volume et perdent leur intérêt quelques jours après la fusion. Le troisième cas est celui qui produit les incidents les plus déroutants : une politique un peu large efface l'image d'un environnement rarement redéployé, et le problème n'apparaît qu'au premier redémarrage d'un nœud, des semaines plus tard.",
  },
  {
    kind: "recall",
    id: "docker-reg-24",
    difficulty: 2,
    tags: ["docker", "registre", "exploitation"],
    prompt: "Quelles précautions prendre avant d'activer une politique de rétention ?",
    explanation:
      "D'abord l'**essayer en simulation** : toutes les plateformes savent lister ce qu'une politique supprimerait sans rien supprimer. Cette étape prend cinq minutes et évite la catégorie d'incident la plus désagréable du domaine — une suppression massive et irréversible touchant des images encore utilisées, qu'aucune reconstruction ne restituera à l'identique puisque le contexte de construction a changé. Ensuite, vérifier l'expression de **garde** plutôt que celle de suppression : il vaut toujours mieux conserver trop que perdre une version publiée. Enfin, s'assurer qu'aucune image référencée par un déploiement actif ne tombe dans le périmètre, y compris sur les environnements rarement redéployés — c'est le cas qui produit les pannes les plus déroutantes, puisque le problème n'apparaît qu'au premier redémarrage d'un nœud, longtemps après la suppression. Une politique de rétention est du code : elle se relit et s'essaie.",
    keyPoints: [
      "Toujours essayer en simulation avant d'activer",
      "Vérifier l'expression de garde plus que celle de suppression",
      "Attention aux environnements rarement redéployés",
      "L'incident survient au premier redémarrage, longtemps après",
    ],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "docker-registry",
  title: "Registre : distribuer, sécuriser et gérer ses images",
  objective:
    "Maîtriser la distribution d'images : comprendre couches, manifeste et digest, cesser de confondre tag et version, publier depuis une chaîne d'intégration sans divulguer de secret, réduire taille et surface d'attaque, analyser les vulnérabilités au bon moment, prouver l'origine d'une image et tenir une politique de rétention sans casser la production.",
  prerequisites: ["docker-bases"],
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
