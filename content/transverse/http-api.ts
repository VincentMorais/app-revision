/**
 * Transverse — HTTP et conception d'API (référentiel 9.1).
 * Format détaillé : 8 leçons de 500–900 mots, 3 exercices chacune.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Les méthodes HTTP sont des promesses
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "transverse-http-l1",
  title: "Les méthodes HTTP sont des promesses",
  blocks: [
    {
      kind: "text",
      text: "On présente souvent les méthodes HTTP comme une convention de nommage : GET pour lire, POST pour créer, et ainsi de suite. Vue ainsi, la règle paraît arbitraire, et l'on croise régulièrement des API qui font tout en POST « parce que ça marche pareil ». Ça ne marche pas pareil, et la raison n'a rien à voir avec l'esthétique : chaque méthode est un **contrat** sur lequel s'appuient des machines que vous ne contrôlez pas.",
    },
    {
      kind: "text",
      text: "Trois propriétés définissent ce contrat. Une méthode est **sûre** si elle ne modifie rien côté serveur. Elle est **idempotente** si la rejouer produit le même état final qu'un seul appel. Elle est **cacheable** si sa réponse peut être conservée et resservie. Ces propriétés ne sont pas des recommandations de style : navigateurs, proxys, passerelles et bibliothèques clientes se comportent différemment selon elles.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Le tableau à connaître par cœur.",
      code: `Méthode   Sûre  Idempotente  Corps  Usage
GET       oui   oui          non    lire
HEAD      oui   oui          non    en-têtes seuls
OPTIONS   oui   oui          non    capacités, préflight CORS
PUT       non   oui          oui    remplacer entièrement
DELETE    non   oui          oui*   supprimer
POST      non   NON          oui    créer, ou action non cadrée
PATCH     non   NON**        oui    modifier partiellement

 *  autorisé mais rarement utilisé
 ** peut l'être selon le format du patch,
    mais rien ne le garantit`,
    },
    {
      kind: "text",
      text: "La conséquence la plus concrète est le rejeu automatique. Un client HTTP, une passerelle ou un maillage de services qui ne reçoit pas de réponse peut relancer la requête — beaucoup le font par défaut sur les méthodes idempotentes. Si votre POST crée une commande et que le client rejoue, vous obtenez deux commandes. Si votre GET modifie quelque chose, un simple préchargement de navigateur ou un robot d'indexation le déclenchera sans que personne n'ait cliqué.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Ce qu'un GET non sûr provoque, sans qu'aucun humain n'agisse.",
      code: `# API qui expose une suppression en GET
GET /articles/42/delete

# Le navigateur précharge les liens de la page…
# Un antivirus d'entreprise suit les URL reçues par mail…
# Un robot d'indexation parcourt le site…
# → l'article 42 disparaît sans qu'on ait cliqué.

# Et la protection CSRF ne s'applique pas :
# elle ne couvre que les méthodes non sûres.`,
    },
    {
      kind: "text",
      text: "Cet exemple n'est pas théorique : c'est l'une des façons les plus classiques de perdre des données, et elle a coûté cher à plus d'un site. Elle illustre bien la nature du contrat — le respecter ne sert pas à faire plaisir à un puriste, il sert à ce que le reste de l'infrastructure se comporte comme prévu.",
    },
    {
      kind: "comparison",
      title: "PUT et POST pour créer",
      left: {
        label: "PUT /articles/42",
        text: "Le client choisit l'identifiant et envoie la représentation complète. Rejouable sans dommage : le second appel écrase avec le même contenu. À utiliser quand l'identifiant est connu d'avance — un code produit, un identifiant métier.",
      },
      right: {
        label: "POST /articles",
        text: "Le serveur attribue l'identifiant et le renvoie dans l'en-tête `Location` avec un 201. Non idempotent : deux appels créent deux ressources. C'est le cas courant, et c'est celui qui exige une protection contre le rejeu.",
      },
    },
    {
      kind: "text",
      text: "PUT mérite une précision souvent oubliée : il **remplace entièrement** la ressource. Envoyer un PUT avec seulement deux champs sur une ressource qui en compte dix doit vider les huit autres. Beaucoup d'API l'implémentent comme une mise à jour partielle, ce qui rompt le contrat et surprend le client au pire moment. Pour une modification partielle, PATCH existe précisément pour cela.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "« Tout en POST » a un coût réel",
      text: "Une API qui fait tout passer par POST perd la mise en cache des lectures, la reprise automatique des appels interrompus, la relecture d'une requête dans les journaux d'accès, et la possibilité pour un intermédiaire de distinguer une lecture d'une écriture. Rien de tout cela n'apparaît en développement ; tout se paie en production, sous forme de charge inutile et d'incidents difficiles à reproduire.",
    },
    {
      kind: "text",
      text: "En entretien, la question tombe souvent sous la forme « quelle différence entre PUT et POST ? ». Répondre « PUT modifie, POST crée » est la réponse la plus répandue et elle est fausse. La bonne réponse tient en un mot — l'idempotence — suivi de ce qu'elle permet : rejouer sans risque, et donc laisser les intermédiaires reprendre un appel interrompu.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-http-01",
    difficulty: 1,
    tags: ["http", "methodes"],
    prompt: "Quelle est la différence fondamentale entre PUT et POST ?",
    choices: [
      "PUT est idempotent : le rejouer donne le même état final, alors que deux POST créent deux ressources.",
      "PUT sert à modifier une ressource existante, POST à en créer une nouvelle.",
      "PUT envoie les données dans l'URL, POST dans le corps de la requête.",
      "PUT est réservé aux API REST, POST aux formulaires HTML.",
    ],
    answer: 0,
    explanation:
      "« PUT modifie, POST crée » est la réponse la plus répandue et elle est inexacte : PUT crée très bien une ressource quand le client en choisit l'identifiant. La vraie distinction est l'idempotence — rejouer un PUT écrase avec le même contenu, rejouer un POST crée un second objet. C'est elle qui décide si un intermédiaire peut relancer un appel interrompu.",
  },
  {
    kind: "match",
    id: "transverse-http-02",
    difficulty: 2,
    tags: ["http", "methodes"],
    prompt: "Associe chaque méthode à sa combinaison de propriétés.",
    pairs: [
      { left: "GET", right: "Sûre et idempotente" },
      { left: "PUT", right: "Non sûre mais idempotente" },
      { left: "POST", right: "Ni sûre ni idempotente" },
      { left: "HEAD", right: "Sûre, idempotente, et sans corps de réponse" },
    ],
    explanation:
      "« Sûre » signifie que rien n'est modifié côté serveur ; « idempotente » que rejouer l'appel mène au même état final. Toute méthode sûre est nécessairement idempotente — ne rien changer deux fois revient à ne rien changer. L'inverse est faux : PUT et DELETE modifient l'état mais peuvent être rejoués sans dommage supplémentaire.",
  },
  {
    kind: "recall",
    id: "transverse-http-03",
    difficulty: 2,
    tags: ["http", "methodes"],
    prompt: "Pourquoi exposer une suppression derrière un GET est-il dangereux ?",
    explanation:
      "Parce que GET est une méthode **sûre** par contrat, et que toute une infrastructure s'appuie sur cette promesse sans demander la permission : les navigateurs préchargent les liens d'une page, les antivirus d'entreprise visitent les URL reçues par courriel, les robots d'indexation parcourent tout ce qu'ils trouvent, les proxys mettent en cache. Une suppression exposée en GET sera donc déclenchée sans qu'aucun humain n'ait cliqué. S'ajoute que la protection CSRF ne couvre que les méthodes non sûres : le jeton n'est pas exigé sur un GET, et l'opération devient déclenchable depuis une simple balise `img` sur un site tiers.",
    keyPoints: [
      "GET est sûre par contrat : toute l'infrastructure y compte",
      "Préchargement, antivirus, robots, proxys déclenchent des GET seuls",
      "La protection CSRF ne couvre pas les méthodes sûres",
      "Une balise img sur un site tiers suffit à déclencher l'opération",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — L'idempotence en pratique : survivre au rejeu
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "transverse-http-l2",
  title: "L'idempotence en pratique : survivre au rejeu",
  blocks: [
    {
      kind: "text",
      text: "Un client envoie un POST pour créer une commande. Le serveur la crée, puis la connexion tombe avant que la réponse n'arrive. Le client n'a aucun moyen de savoir ce qui s'est passé : la requête n'est peut-être jamais arrivée, ou bien tout a réussi et seule la réponse s'est perdue. Il réessaie, et le client obtient deux commandes pour un seul achat. Ce scénario n'est pas rare — c'est le cas normal sur un réseau mobile.",
    },
    {
      kind: "text",
      text: "Le problème est structurel : sur un réseau non fiable, l'émetteur ne peut jamais distinguer « la requête est perdue » de « la réponse est perdue ». Aucune amélioration du client ne résout cela. La seule issue consiste à rendre l'opération **rejouable sans dommage**, c'est-à-dire à déplacer la responsabilité vers le serveur.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "La clé d'idempotence : le client nomme sa tentative.",
      code: `# Le client génère un identifiant unique par intention,
# pas par tentative — la même valeur sur chaque essai.
POST /orders
Idempotency-Key: 9f2c8a10-4d3b-4f7a-9c11-2b5d7e0a1f88
Content-Type: application/json

{"articleId": 42, "quantity": 2}

# 1re requête  → 201 Created, commande #7781 créée
# 2e  requête  → 200 OK, la MÊME commande #7781
#                (aucune nouvelle création)`,
    },
    {
      kind: "text",
      text: "Le serveur conserve, dans une table dédiée, la clé reçue et la réponse produite. À l'arrivée d'une clé déjà connue, il ne rejoue pas le traitement : il renvoie la réponse mémorisée. Deux détails font toute la solidité du procédé. L'insertion de la clé doit être **atomique** avec la création de la commande, dans la même transaction, sinon deux appels simultanés passent tous les deux. Et l'entrée doit expirer — vingt-quatre heures suffisent en général.",
    },
    {
      kind: "code",
      language: "java",
      caption: "Le squelette côté serveur.",
      code: `@Transactional
public OrderResponse create(String key, OrderRequest req) {
    // Contrainte d'unicité sur la colonne key : c'est elle
    // qui arbitre entre deux appels simultanés.
    Optional<IdempotencyRecord> seen = records.findByKey(key);
    if (seen.isPresent()) {
        return seen.get().response();   // rejeu : on resert
    }

    Order order = orderService.create(req);
    records.save(new IdempotencyRecord(key, response(order)));
    return response(order);
}`,
    },
    {
      kind: "text",
      text: "Une nuance importante : l'idempotence ne signifie pas « la même réponse », mais « le même **état final** ». Un DELETE sur une ressource déjà supprimée renvoie légitimement 404 au second appel alors que le premier renvoyait 204 — les codes diffèrent, l'état est identique, la méthode est bien idempotente. Beaucoup d'API préfèrent d'ailleurs renvoyer 204 dans les deux cas, ce qui est plus commode pour le client et tout aussi correct.",
    },
    {
      kind: "comparison",
      title: "Deux façons d'être rejouable",
      left: {
        label: "Idempotent par nature",
        text: "L'opération est formulée comme un état cible : `PUT /articles/42` avec le contenu complet, ou « mets le statut à PAYÉ ». Rejouer réécrit la même chose. Aucun mécanisme supplémentaire n'est nécessaire — c'est toujours la solution à préférer.",
      },
      right: {
        label: "Idempotent par clé",
        text: "L'opération est un incrément ou une création : « ajoute 10 € », « crée une commande ». Rejouer produirait un doublon. Il faut alors une clé d'idempotence et une trace côté serveur, avec le coût de stockage et d'expiration que cela implique.",
      },
    },
    {
      kind: "text",
      text: "Cette comparaison suggère un réflexe de conception : chaque fois qu'on peut formuler une opération comme un état cible plutôt que comme un delta, on gagne l'idempotence gratuitement. « Mettre la quantité à 3 » est rejouable ; « ajouter 1 à la quantité » ne l'est pas. Le choix se fait au moment de dessiner l'API, et il est très coûteux à changer ensuite.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Une clé par intention, pas par tentative",
      text: "L'erreur classique consiste à générer la clé au moment d'émettre la requête. Chaque tentative reçoit alors une clé différente et la protection ne sert à rien. La clé doit être créée quand l'utilisateur exprime son intention — au clic sur « payer » — et réutilisée telle quelle par toutes les tentatives de la même intention, y compris après un redémarrage de l'application cliente.",
    },
    {
      kind: "text",
      text: "Reste le cas des paiements, où l'enjeu justifie plus de rigueur : la plupart des prestataires imposent une clé d'idempotence et refusent la requête sans elle. C'est un bon indicateur de maturité d'API — quand l'erreur coûte de l'argent, personne ne se contente d'espérer que le réseau tienne.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "transverse-http-04",
    difficulty: 2,
    tags: ["http", "idempotence"],
    prompt: "L'API gère les clés d'idempotence. La première requête a réussi mais la réponse s'est perdue ; le client réessaie avec la même clé.",
    code: {
      language: "bash",
      code: `# Tentative 1 (réponse perdue en route)
POST /orders
Idempotency-Key: 9f2c8a10-4d3b
{"articleId": 42, "quantity": 2}

# Tentative 2, même clé, même corps
POST /orders
Idempotency-Key: 9f2c8a10-4d3b
{"articleId": 42, "quantity": 2}`,
    },
    choices: [
      "Une seule commande existe ; la seconde réponse resert celle créée à la première tentative.",
      "Deux commandes sont créées : HTTP ne peut pas empêcher un doublon sur un POST.",
      "La seconde requête est rejetée avec un 409 Conflict et rien n'est renvoyé au client.",
      "La seconde requête crée une commande puis supprime la première, pour n'en garder qu'une.",
    ],
    answer: 0,
    explanation:
      "Le serveur a mémorisé la clé et la réponse produite. À la seconde tentative il reconnaît la clé, ne rejoue pas le traitement, et renvoie la réponse conservée — souvent avec un 200 plutôt que le 201 initial. Le client obtient donc l'identifiant de la commande qu'il croyait perdue, et une seule commande existe.",
  },
  {
    kind: "mcq",
    id: "transverse-http-05",
    difficulty: 3,
    tags: ["http", "idempotence"],
    prompt: "À quel moment le client doit-il générer la clé d'idempotence ?",
    choices: [
      "Quand l'utilisateur exprime son intention — au clic sur « payer » — puis la réutiliser pour toutes les tentatives.",
      "À chaque émission de requête, pour que chaque appel soit identifiable individuellement.",
      "Une fois au démarrage de l'application, et la réutiliser pour toutes les opérations.",
      "Jamais : c'est au serveur de générer la clé et de la renvoyer au client.",
    ],
    answer: 0,
    explanation:
      "Une clé régénérée à chaque tentative rend la protection inopérante : le serveur voit deux clés différentes et crée deux commandes. Une clé unique pour toute l'application confondrait des opérations distinctes. La clé identifie une **intention** — un achat précis — et doit survivre aux tentatives, y compris à un redémarrage du client.",
  },
  {
    kind: "recall",
    id: "transverse-http-06",
    difficulty: 3,
    tags: ["http", "idempotence"],
    prompt: "Un DELETE renvoie 204 au premier appel et 404 au second. Est-il encore idempotent ?",
    explanation:
      "Oui. L'idempotence porte sur l'**état final du serveur**, pas sur le code de réponse : après un appel comme après dix, la ressource est absente, ce qui est exactement la définition. Le 404 du second appel décrit fidèlement la situation — la ressource n'existe plus — sans rien changer de plus. Beaucoup d'API préfèrent renvoyer 204 dans les deux cas, ce qui est également correct et souvent plus commode pour un client qui rejoue automatiquement : il n'a pas à traiter le 404 comme un cas particulier. Les deux choix sont défendables ; ce qu'il faut éviter, c'est de croire qu'une différence de code invalide l'idempotence.",
    keyPoints: [
      "L'idempotence porte sur l'état final, pas sur le code de réponse",
      "Après un ou dix appels, la ressource est absente : c'est la définition",
      "Renvoyer 204 dans les deux cas est également correct",
      "Un client qui rejoue préfère souvent le 204 systématique",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Les codes de statut, et ceux qu'on confond
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "transverse-http-l3",
  title: "Les codes de statut, et ceux qu'on confond",
  blocks: [
    {
      kind: "text",
      text: "Le code de statut est la seule partie de la réponse que tous les intermédiaires comprennent. Un proxy, un client HTTP générique, un tableau de bord de supervision n'ouvriront jamais votre corps JSON, mais ils savent tous ce que signifie 500 — et ils agissent en conséquence : réessayer, alerter, mettre en cache. Renvoyer 200 avec `{\"error\": \"not found\"}` revient à cacher l'information à tout le monde sauf au code qui la lit explicitement.",
    },
    {
      kind: "text",
      text: "Les familles portent déjà l'essentiel. **2xx** : c'est fait. **3xx** : c'est ailleurs. **4xx** : le client a un problème, réessayer à l'identique ne sert à rien. **5xx** : le serveur a un problème, réessayer plus tard a du sens. Cette dernière ligne de partage est la plus importante en pratique, car c'est elle qui décide si un mécanisme de reprise automatique doit relancer l'appel ou abandonner.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les codes qu'une API métier utilise vraiment.",
      code: `200 OK              lecture, ou mise à jour réussie
201 Created         création + en-tête Location
202 Accepted        pris en compte, traitement asynchrone
204 No Content      succès sans corps (DELETE, PUT)

304 Not Modified    le cache du client est encore bon

400 Bad Request     syntaxe invalide, JSON illisible
401 Unauthorized    NON authentifié (mal nommé)
403 Forbidden       authentifié mais pas le droit
404 Not Found       ressource inexistante
409 Conflict        conflit d'état (doublon, version)
422 Unprocessable   syntaxe bonne, sémantique fausse
429 Too Many Req.   quota dépassé, voir Retry-After

500 Internal Error  bug non prévu
503 Unavailable     surcharge ou maintenance, réessayer`,
    },
    {
      kind: "text",
      text: "Deux paires provoquent l'essentiel des erreurs. La première est 401 contre 403. Malgré son nom, **401 signifie « non authentifié »** : le serveur ne sait pas qui vous êtes, et sa réponse doit porter un en-tête `WWW-Authenticate` indiquant comment s'authentifier. **403 signifie « je sais qui vous êtes, et vous n'avez pas le droit »**. Renvoyer 401 à un utilisateur connecté qui manque d'un rôle enverra le client dans une boucle de reconnexion inutile.",
    },
    {
      kind: "code",
      language: "text",
      caption: "400 ou 422 : où se situe la faute ?",
      code: `POST /orders
{"quantity": "beaucoup"}        → 400
  Le JSON attend un entier : le corps est illisible
  pour le désérialiseur. On n'atteint pas le métier.

POST /orders
{"quantity": -3}                → 422
  Le corps est parfaitement valide et compris.
  C'est la règle métier qui refuse : une quantité
  négative n'a pas de sens.

POST /orders
{"quantity": 3}  (stock = 1)    → 409
  Corps valide, règle respectée, mais l'état actuel
  du serveur rend l'opération impossible.`,
    },
    {
      kind: "text",
      text: "La seconde confusion est donc 400 contre 422. La ligne de partage est simple : 400 quand la requête n'est pas **compréhensible**, 422 quand elle est comprise mais **inacceptable**. En pratique, 400 couvre le JSON mal formé et les types incorrects, 422 couvre la validation métier. Beaucoup d'API renvoient 400 pour tout, ce qui reste acceptable ; l'incohérence à l'intérieur d'une même API l'est beaucoup moins.",
    },
    {
      kind: "comparison",
      title: "404 ou 403 pour une ressource interdite ?",
      left: {
        label: "403 Forbidden",
        text: "Honnête : la ressource existe, vous n'y avez pas droit. À préférer quand l'existence n'est pas un secret — un dossier interne dont chacun sait qu'il existe. Le message d'erreur peut alors guider vers une demande d'accès.",
      },
      right: {
        label: "404 Not Found",
        text: "Protecteur : on nie l'existence. Nécessaire quand l'existence elle-même est une information sensible — savoir qu'un compte porte tel courriel, ou qu'un dossier médical existe. C'est le choix par défaut sur les données personnelles.",
      },
    },
    {
      kind: "text",
      text: "Deux codes méritent enfin d'être connus parce qu'ils rendent une API bien plus utilisable. **429** signale un dépassement de quota et doit s'accompagner de `Retry-After`, sans quoi le client ne peut que deviner. **503** annonce une indisponibilité temporaire et accepte le même en-tête. Dans les deux cas, l'information « réessayez dans trente secondes » évite qu'un client en difficulté n'aggrave la charge en martelant le serveur.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Le 200 qui contient une erreur",
      text: "Renvoyer 200 avec `{\"success\": false}` est le plus sûr moyen de rendre une panne invisible. La supervision compte des succès, les mécanismes de reprise ne se déclenchent pas, les alertes ne partent jamais, et le problème n'apparaît que par une réclamation d'utilisateur. Le code de statut est un canal partagé : le contourner ne coûte rien à l'écriture et beaucoup à l'exploitation.",
    },
    {
      kind: "text",
      text: "Un dernier repère utile : ne jamais renvoyer 5xx pour une faute du client. Un corps invalide qui produit une exception non rattrapée, donc un 500, pollue les indicateurs d'erreur serveur et déclenche des alertes pour un problème qui n'en est pas un. Inversement, masquer un bug serveur derrière un 400 le rend invisible. La famille du code doit désigner le responsable, pas arranger les statistiques.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "transverse-http-07",
    difficulty: 1,
    tags: ["http", "codes-http"],
    prompt: "Un utilisateur authentifié appelle une route réservée aux administrateurs. Quel code renvoyer ?",
    choices: [
      "403 Forbidden : il est authentifié, mais n'a pas le droit.",
      "401 Unauthorized : il n'est pas autorisé à accéder à cette route.",
      "400 Bad Request : sa requête n'aurait pas dû être envoyée.",
      "404 Not Found, systématiquement, pour ne pas révéler la route.",
    ],
    answer: 0,
    explanation:
      "Malgré son nom trompeur, 401 signifie « non authentifié » et sa réponse doit porter un en-tête `WWW-Authenticate`. Ici le serveur sait parfaitement qui appelle : c'est un refus de droit, donc 403. Renvoyer 401 enverrait le client dans une boucle de reconnexion qui ne réglera jamais le problème. Le 404 protecteur se justifie, mais seulement quand l'existence même de la ressource est une information sensible.",
  },
  {
    kind: "match",
    id: "transverse-http-08",
    difficulty: 2,
    tags: ["http", "codes-http"],
    prompt: "Associe chaque situation au code approprié.",
    pairs: [
      { left: "JSON mal formé, quantité reçue en texte", right: "400 Bad Request" },
      { left: "Quantité négative refusée par la règle métier", right: "422 Unprocessable Content" },
      { left: "Stock insuffisant pour la commande demandée", right: "409 Conflict" },
      { left: "Quota d'appels dépassé pour ce client", right: "429 Too Many Requests" },
    ],
    explanation:
      "400 quand la requête n'est pas compréhensible, 422 quand elle est comprise mais inacceptable, 409 quand elle est valide mais entre en conflit avec l'état actuel du serveur. 429 doit s'accompagner d'un en-tête `Retry-After`, sans lequel le client ne peut que deviner quand réessayer — et martèlera le serveur en attendant.",
  },
  {
    kind: "recall",
    id: "transverse-http-09",
    difficulty: 2,
    tags: ["http", "codes-http"],
    prompt: "Pourquoi ne faut-il jamais renvoyer 200 avec un corps du type `{\"success\": false}` ?",
    explanation:
      "Parce que le code de statut est le seul canal que tous les intermédiaires comprennent, et qu'ils agissent dessus sans jamais lire le corps. Un 200 signifie « c'est fait » : la supervision compte un succès, les alertes ne partent pas, les mécanismes de reprise ne se déclenchent pas, les proxys peuvent mettre la réponse en cache. La panne devient invisible partout sauf dans le code client qui pense à inspecter le champ. La ligne de partage la plus importante est celle entre 4xx et 5xx, car c'est elle qui indique à un client s'il est utile de réessayer : contourner ce canal ne coûte rien à l'écriture et très cher en exploitation.",
    keyPoints: [
      "Le code est le seul canal compris par tous les intermédiaires",
      "200 fait compter un succès par la supervision",
      "Ni alerte, ni reprise automatique, et cache possible",
      "4xx contre 5xx dit au client s'il est utile de réessayer",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Les en-têtes qui font le travail
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "transverse-http-l4",
  title: "Les en-têtes qui font le travail",
  blocks: [
    {
      kind: "text",
      text: "Les en-têtes sont la partie d'HTTP qu'on utilise sans la connaître : le framework en pose la plupart, et tout fonctionne jusqu'au jour où un client refuse une réponse pourtant correcte. Une poignée d'entre eux mérite d'être comprise, parce que ce sont eux qui portent les métadonnées dont dépendent la négociation de format, la mise en cache et le suivi.",
    },
    {
      kind: "text",
      text: "Le couple de base est `Content-Type` et `Accept`, et on les confond régulièrement. `Content-Type` décrit ce que **contient le message où il figure** — dans une requête, le corps envoyé ; dans une réponse, le corps renvoyé. `Accept` est une demande, présente uniquement dans la requête : « voici les formats que je sais lire, par ordre de préférence ». Le serveur choisit alors, et annonce son choix par le `Content-Type` de sa réponse.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Négociation de contenu : deux en-têtes, deux rôles.",
      code: `POST /orders
Content-Type: application/json      ← ce que J'ENVOIE
Accept: application/json            ← ce que je SAIS LIRE

{"articleId": 42}

HTTP/1.1 201 Created
Content-Type: application/json      ← ce que le serveur RENVOIE
Location: /orders/7781              ← où trouver la ressource créée

# Si le serveur ne sait pas produire ce qui est demandé :
Accept: application/xml  →  406 Not Acceptable
# Si le serveur ne sait pas lire ce qui est envoyé :
Content-Type: application/xml  →  415 Unsupported Media Type`,
    },
    {
      kind: "text",
      text: "`Location` est le compagnon obligé du 201 : il indique où la ressource créée peut être lue, ce qui évite au client de deviner l'URL à partir d'un identifiant. Il sert aussi aux redirections 3xx. Son absence sur un 201 est l'un des manques les plus fréquents, et il oblige chaque client à reconstruire l'URL à la main — donc à casser le jour où le format change.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Trois en-têtes qui rendent une API exploitable.",
      code: `# Limitation de débit : dire au client où il en est
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 4
Retry-After: 30            ← accompagne 429 et 503

# Corrélation : suivre un appel à travers les services
X-Request-Id: 4f9a2c10-…   ← à propager et à journaliser

# Authentification : la preuve, jamais dans l'URL
Authorization: Bearer eyJhbGciOi…
# Sur un 401, le serveur dit COMMENT s'authentifier :
WWW-Authenticate: Bearer realm="api", error="invalid_token"`,
    },
    {
      kind: "text",
      text: "L'identifiant de corrélation mérite une mention particulière. Propagé d'un service à l'autre et écrit dans chaque ligne de journal, il permet de reconstituer le trajet complet d'un appel à travers une architecture distribuée. Sans lui, diagnostiquer une erreur qui traverse quatre services revient à recouper des horodatages à la main — un exercice qui devient impossible dès que le trafic augmente.",
    },
    {
      kind: "comparison",
      title: "Deux directives de cache qu'on inverse",
      left: {
        label: "no-cache",
        text: "La réponse **peut** être stockée, mais doit être revalidée auprès du serveur avant chaque réutilisation. C'est le mode « garde-la, mais vérifie ». Combiné à un ETag, il donne des réponses 304 très économiques.",
      },
      right: {
        label: "no-store",
        text: "La réponse ne doit **jamais** être écrite, nulle part, ni sur disque ni en mémoire de cache. C'est ce qu'il faut pour des données sensibles. C'est cette directive-là que l'on veut quand on écrit `no-cache` par erreur.",
      },
    },
    {
      kind: "text",
      text: "Cette inversion est l'une des plus répandues du métier, et elle est coûteuse dans les deux sens : `no-cache` sur des données bancaires les laisse s'écrire dans un cache partagé, tandis que `no-store` posé partout « par précaution » supprime toute mise en cache et fait grimper la charge sans raison. Les deux erreurs passent inaperçues en développement, où il n'y a ni proxy ni volume.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Jamais de secret dans l'URL",
      text: "Un jeton ou une clé d'API placés en paramètre de requête finissent dans les journaux d'accès du serveur, dans ceux de chaque proxy traversé, dans l'historique du navigateur et dans l'en-tête `Referer` envoyé aux sites tiers. Les en-têtes, eux, ne sont journalisés par défaut nulle part. C'est la raison d'être d'`Authorization` — et la raison pour laquelle une API qui accepte `?token=` a déjà un problème.",
    },
    {
      kind: "text",
      text: "Dernier repère, souvent demandé en entretien : les en-têtes personnalisés ne s'appellent plus `X-`. La convention a été officiellement abandonnée en 2012, parce qu'un en-tête expérimental finit toujours par se standardiser et qu'il faut alors vivre avec les deux noms. `X-Request-Id` survit par habitude, mais un nouvel en-tête doit être nommé sans préfixe.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "fill",
    id: "transverse-http-10",
    difficulty: 1,
    tags: ["http", "headers"],
    prompt: "Complète les deux en-têtes de cette réponse de création.",
    code: {
      language: "text",
      code: `POST /orders
Content-Type: application/json

HTTP/1.1 201 Created
{{1}}: application/json
{{2}}: /orders/7781`,
    },
    blanks: ["Content-Type", "Location"],
    distractors: ["Accept", "Content-Location", "Link"],
    explanation:
      "`Content-Type` décrit le corps du message où il figure : dans la réponse, c'est le format renvoyé. `Location` accompagne obligatoirement un 201 et indique où lire la ressource créée, ce qui évite au client de reconstruire l'URL à partir d'un identifiant. `Accept` n'a de sens que dans une requête : c'est une demande, pas une description.",
  },
  {
    kind: "mcq",
    id: "transverse-http-11",
    difficulty: 2,
    tags: ["http", "cache"],
    prompt: "Que signifie exactement `Cache-Control: no-cache` ?",
    choices: [
      "La réponse peut être stockée, mais doit être revalidée auprès du serveur avant chaque réutilisation.",
      "La réponse ne doit jamais être stockée, ni en mémoire ni sur disque.",
      "Seuls les caches partagés doivent ignorer la réponse ; le navigateur peut la garder.",
      "La réponse est mise en cache mais expire au bout de zéro seconde, donc n'est jamais servie.",
    ],
    answer: 0,
    explanation:
      "`no-cache` veut dire « garde-la, mais vérifie avant de t'en servir » : combiné à un ETag, il permet des revalidations très économiques répondues en 304. La directive qui interdit tout stockage est `no-store`. L'inversion des deux est fréquente et coûteuse : `no-cache` sur des données sensibles les laisse s'écrire dans un cache partagé.",
  },
  {
    kind: "recall",
    id: "transverse-http-12",
    difficulty: 2,
    tags: ["http", "headers"],
    prompt: "Pourquoi ne jamais transmettre un jeton d'authentification en paramètre d'URL ?",
    explanation:
      "Parce qu'une URL est journalisée partout, par défaut et sans que personne ne l'ait décidé : dans les journaux d'accès du serveur, dans ceux de chaque proxy et répartiteur traversé, dans l'historique du navigateur, dans les statistiques d'usage, et dans l'en-tête `Referer` transmis aux sites tiers vers lesquels l'utilisateur navigue ensuite. Un secret qui passe par là est donc dupliqué dans des dizaines d'endroits que personne ne surveille et que personne ne purge. Les en-têtes ne sont journalisés par défaut nulle part : c'est précisément la raison d'être d'`Authorization`. Une API qui accepte `?token=` doit être considérée comme ayant déjà fui.",
    keyPoints: [
      "Les URL sont journalisées par le serveur et chaque proxy",
      "Historique du navigateur et en-tête Referer vers les tiers",
      "Le secret se duplique dans des endroits non surveillés",
      "Les en-têtes ne sont pas journalisés par défaut : d'où Authorization",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 5 — Le cache HTTP : ETag et revalidation
// ---------------------------------------------------------------------------

const l5: Lesson = {
  kind: "lesson",
  id: "transverse-http-l5",
  title: "Le cache HTTP : ETag et revalidation",
  blocks: [
    {
      kind: "text",
      text: "Une application mobile rafraîchit une liste de produits toutes les trente secondes. La liste change deux fois par jour. Le client télécharge donc plusieurs milliers de fois par jour un contenu identique, ce qui consomme de la bande passante chez l'utilisateur, de la base de données chez vous, et de la batterie des deux côtés. HTTP dispose depuis toujours du mécanisme qui évite cela, et il est très peu utilisé dans les API métier.",
    },
    {
      kind: "text",
      text: "Deux stratégies coexistent. L'**expiration** donne une durée de validité : `Cache-Control: max-age=300` autorise le client à réutiliser la réponse pendant cinq minutes sans rien demander. C'est le plus économique — aucune requête n'est émise — mais cela suppose d'accepter de servir une donnée périmée jusqu'à cinq minutes. La **revalidation** émet une requête, mais permet au serveur de répondre « rien n'a changé » sans renvoyer le corps.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "La revalidation : une requête, presque aucun octet.",
      code: `# 1er appel
GET /products
→ 200 OK
  ETag: "a3f19c7"
  Cache-Control: no-cache
  Content-Length: 48213
  [ … 48 ko de JSON … ]

# 30 secondes plus tard, le client redemande
GET /products
If-None-Match: "a3f19c7"

→ 304 Not Modified
  ETag: "a3f19c7"
  (aucun corps : environ 150 octets au total)`,
    },
    {
      kind: "text",
      text: "L'ETag est une empreinte de la représentation — un hachage du corps, ou un numéro de version de la ressource. Le client le renvoie dans `If-None-Match`, et le serveur compare. Si les valeurs correspondent, il répond 304 sans corps. Le gain n'est pas sur le nombre de requêtes mais sur le volume transféré, ce qui reste considérable : quarante-huit kilo-octets contre cent cinquante octets dans l'exemple ci-dessus.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Le même en-tête, pour un tout autre usage : la mise à jour concurrente.",
      code: `# Alice et Bob lisent la même ressource
GET /orders/7781   → 200, ETag: "v12"

# Alice modifie, en disant sur quelle version elle travaille
PUT /orders/7781
If-Match: "v12"
→ 200 OK, nouvel ETag: "v13"

# Bob modifie à son tour, encore sur la v12
PUT /orders/7781
If-Match: "v12"
→ 412 Precondition Failed
  La ressource a changé depuis : Bob doit relire
  avant d'écrire. Sa modification n'écrase rien.`,
    },
    {
      kind: "text",
      text: "Ce second usage est le plus intéressant et le moins connu : `If-Match` transforme l'ETag en verrou optimiste. Sans lui, la mise à jour de Bob écraserait silencieusement celle d'Alice — le problème classique de la dernière écriture qui gagne. Le 412 rend le conflit visible et laisse le client décider : relire et rejouer, ou présenter les deux versions à l'utilisateur.",
    },
    {
      kind: "comparison",
      title: "Deux formes d'ETag",
      left: {
        label: "Fort — \"a3f19c7\"",
        text: "Les représentations sont identiques octet pour octet. Requis pour les requêtes partielles et pour `If-Match`. À produire à partir d'un hachage du corps, ou d'un numéro de version incrémenté à chaque écriture.",
      },
      right: {
        label: "Faible — W/\"a3f19c7\"",
        text: "Les représentations sont équivalentes sémantiquement, sans être identiques — un horodatage de génération peut différer. Suffit pour la revalidation par `If-None-Match`, mais pas pour un verrou optimiste.",
      },
    },
    {
      kind: "text",
      text: "`Last-Modified` et `If-Modified-Since` offrent le même mécanisme fondé sur une date. C'est plus simple à produire, mais la résolution est d'une seconde : deux modifications dans la même seconde deviennent indistinguables, et le client peut conserver une version périmée. L'ETag n'a pas cette limite, et c'est lui qu'on choisit dès qu'on a le choix.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Un ETag qui ne coûte rien",
      text: "Il n'est pas nécessaire de hacher le corps de la réponse pour produire un ETag — ce qui supposerait de l'avoir déjà construit. Un champ de version incrémenté à chaque écriture fait parfaitement l'affaire, et c'est exactement ce que fournit un `@Version` JPA. On peut alors répondre 304 après une seule lecture de la version, sans charger la ressource complète : l'économie porte aussi sur le serveur.",
    },
    {
      kind: "text",
      text: "En entretien, mentionner le cache HTTP sur une question de performance d'API distingue immédiatement. La réponse attendue est souvent « ajouter un cache Redis », qui est une bonne réponse mais qui ajoute un composant. Répondre « d'abord vérifier ce que la couche HTTP peut faire gratuitement — ETag et revalidation — avant d'introduire une infrastructure » montre qu'on cherche le coût le plus bas.",
    },
  ],
};

const ex5: Exercise[] = [
  {
    kind: "output",
    id: "transverse-http-13",
    difficulty: 2,
    tags: ["http", "cache"],
    prompt: "Le client a déjà la ressource en cache avec son ETag, et la ressource n'a pas changé depuis.",
    code: {
      language: "bash",
      code: `GET /products
If-None-Match: "a3f19c7"`,
    },
    choices: [
      "304 Not Modified, sans corps : le client réutilise sa copie.",
      "200 OK avec le corps complet, mais un ETag identique.",
      "412 Precondition Failed : la précondition sur l'ETag a échoué.",
      "204 No Content : la ressource est inchangée donc vide.",
    ],
    answer: 0,
    explanation:
      "`If-None-Match` demande « envoie-moi le corps seulement si l'empreinte a changé ». Les valeurs correspondant, le serveur répond 304 sans corps, et le client réutilise sa copie. Le gain porte sur le volume : quelques centaines d'octets au lieu de la représentation complète. Le 412 est la réponse de l'en-tête inverse, `If-Match`, utilisé pour la mise à jour concurrente.",
  },
  {
    kind: "mcq",
    id: "transverse-http-14",
    difficulty: 3,
    tags: ["http", "cache", "concurrence"],
    prompt: "Alice et Bob ont lu la ressource en version \"v12\". Alice écrit avec `If-Match: \"v12\"` et réussit. Bob écrit ensuite avec `If-Match: \"v12\"`. Que se passe-t-il ?",
    choices: [
      "412 Precondition Failed : la ressource a changé, Bob doit relire avant d'écrire.",
      "200 OK : l'écriture de Bob écrase celle d'Alice, dernière écriture gagnante.",
      "409 Conflict : le serveur fusionne automatiquement les deux versions.",
      "304 Not Modified : l'écriture est ignorée car la version envoyée est périmée.",
    ],
    answer: 0,
    explanation:
      "`If-Match` est une précondition : n'applique cette écriture que si la ressource est toujours dans l'état annoncé. Comme Alice l'a fait passer en \"v13\", la condition échoue et le serveur répond 412 sans rien modifier. C'est un verrouillage optimiste : le conflit devient visible au lieu de faire disparaître silencieusement le travail d'Alice.",
  },
  {
    kind: "recall",
    id: "transverse-http-15",
    difficulty: 2,
    tags: ["http", "cache"],
    prompt: "Quelle différence entre l'expiration (`max-age`) et la revalidation (`ETag` + `If-None-Match`) ?",
    explanation:
      "L'expiration donne une durée de validité : pendant `max-age`, le client réutilise sa copie **sans émettre aucune requête**. C'est le plus économique — zéro appel réseau — mais il faut accepter de servir une donnée éventuellement périmée jusqu'à la fin du délai. La revalidation, elle, émet bien une requête, mais le serveur peut répondre 304 sans corps quand rien n'a changé : on ne gagne pas sur le nombre d'appels, on gagne sur le volume transféré, qui passe de plusieurs dizaines de kilo-octets à quelques centaines d'octets. On choisit l'expiration pour ce qui tolère d'être un peu périmé, la revalidation pour ce qui doit être frais mais change rarement. Les deux se combinent.",
    keyPoints: [
      "max-age : aucune requête émise, mais donnée possiblement périmée",
      "Revalidation : une requête, mais 304 sans corps si rien n'a changé",
      "L'un économise des appels, l'autre du volume",
      "Expiration pour le tolérant, revalidation pour le frais qui change peu",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 6 — REST et le modèle de maturité de Richardson
// ---------------------------------------------------------------------------

const l6: Lesson = {
  kind: "lesson",
  id: "transverse-http-l6",
  title: "REST et le modèle de maturité de Richardson",
  blocks: [
    {
      kind: "text",
      text: "« Notre API est RESTful » veut dire à peu près n'importe quoi. Le terme désigne à l'origine un style d'architecture décrit par Roy Fielding en 2000, assorti de contraintes précises ; dans l'usage courant, il signifie « du JSON sur HTTP ». Le modèle de maturité proposé par Leonard Richardson sert justement à sortir de ce flou en donnant une échelle à quatre marches.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les quatre niveaux, sur le même besoin.",
      code: `Niveau 0 — Une seule URL, un seul verbe
POST /api
{"action": "getOrder", "id": 7781}
→ HTTP sert de tunnel. C'est du RPC.

Niveau 1 — Des ressources identifiées
POST /orders/7781
{"action": "get"}
→ Chaque chose a son URL, mais les verbes
  restent dans le corps.

Niveau 2 — Les verbes HTTP et les codes
GET    /orders/7781      → 200
DELETE /orders/7781      → 204
POST   /orders           → 201 + Location
→ C'est ici que se situent la quasi-totalité
  des API dites « REST ».

Niveau 3 — L'hypermédia
GET /orders/7781 → 200
{ "id": 7781, "status": "PENDING",
  "_links": {
    "self":   {"href": "/orders/7781"},
    "cancel": {"href": "/orders/7781/cancel"},
    "pay":    {"href": "/orders/7781/payment"} } }
→ La réponse porte les actions possibles.`,
    },
    {
      kind: "text",
      text: "Le passage du niveau 1 au niveau 2 est celui qui apporte le plus. En adoptant les verbes et les codes de statut, l'API devient exploitable par toute l'infrastructure : les proxys mettent les GET en cache, les clients rejouent les appels idempotents, la supervision distingue les erreurs client des erreurs serveur. Tout ce qui a été vu dans les leçons précédentes ne fonctionne qu'à partir de ce niveau.",
    },
    {
      kind: "text",
      text: "Le niveau 3 — l'hypermédia, souvent appelé HATEOAS — consiste à faire porter par chaque réponse les liens vers les actions possibles dans l'état courant. Une commande payée n'expose plus de lien `pay`, une commande expédiée n'expose plus `cancel`. En théorie, le client n'a plus à connaître les règles de transition : il suit ce qu'on lui propose, et le serveur peut faire évoluer ses URL sans le casser.",
    },
    {
      kind: "code",
      language: "typescript",
      caption: "Ce que l'hypermédia change côté client.",
      code: `// Sans hypermédia : le front rejoue la règle métier,
// qui vit donc à deux endroits et finira par diverger.
const annulable =
  order.status === "PENDING" ||
  (order.status === "CONFIRMED" && !order.shippedAt);

// Avec hypermédia : le serveur a déjà tranché.
const annulable = Boolean(order._links.cancel);`,
    },
    {
      kind: "text",
      text: "En pratique, le niveau 3 reste rare, et il est utile de savoir pourquoi plutôt que de le réciter comme un idéal. La promesse suppose un client générique capable de découvrir l'API ; or les clients réels sont écrits à la main contre une documentation, et leurs développeurs codent en dur les URL parce que c'est plus simple. Le bénéfice attendu ne se matérialise donc presque jamais, tandis que le coût — construire et maintenir les liens — est bien réel.",
    },
    {
      kind: "comparison",
      title: "Ce que l'hypermédia apporte vraiment",
      left: {
        label: "L'argument théorique",
        text: "Le client découvre l'API à l'exécution et ne code aucune URL en dur : le serveur peut réorganiser ses chemins sans rien casser. Argument séduisant, mais il suppose un client générique — cas rare dans la vraie vie.",
      },
      right: {
        label: "Le bénéfice réel",
        text: "Porter l'**état** plutôt que les chemins : la présence du lien `cancel` dit au client que l'annulation est possible maintenant. L'interface n'a plus à réimplémenter les règles métier pour savoir quels boutons afficher.",
      },
    },
    {
      kind: "text",
      text: "C'est ce second usage qui justifie l'effort quand on le fait : sans lui, une interface web doit reproduire la logique « une commande est annulable si son statut est PENDING ou CONFIRMED et que l'expédition n'a pas commencé », règle qui vivra alors à deux endroits et divergera. Exposer les transitions disponibles supprime cette duplication, ce qui est un gain concret même sans client générique.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Ce qu'il faut répondre en entretien",
      text: "Situer honnêtement : « notre API est au niveau 2, ce qui est le cas de la plupart ; nous avons ajouté des liens sur les ressources à cycle de vie complexe, pour que le front n'ait pas à dupliquer les règles de transition ». Cette réponse montre qu'on connaît le modèle, qu'on sait où l'on se situe et qu'on a arbitré — bien plus convaincant que de prétendre au niveau 3.",
    },
    {
      kind: "text",
      text: "Une dernière remarque sur le vocabulaire : Fielding lui-même considère qu'une API sans hypermédia n'est pas REST. C'est formellement exact, et sans grande portée pratique — l'usage a tranché autrement. L'important en entretien n'est pas de trancher ce débat mais de montrer qu'on sait qu'il existe, et surtout ce que chaque niveau apporte concrètement.",
    },
  ],
};

const ex6: Exercise[] = [
  {
    kind: "order",
    id: "transverse-http-16",
    difficulty: 2,
    tags: ["http", "rest"],
    prompt: "Remets les niveaux du modèle de Richardson dans l'ordre croissant.",
    items: [
      "Niveau 0 : une seule URL et un seul verbe, HTTP sert de tunnel",
      "Niveau 1 : chaque chose a son URL, mais l'action reste dans le corps",
      "Niveau 2 : les verbes HTTP et les codes de statut sont utilisés",
      "Niveau 3 : les réponses portent les liens vers les actions possibles",
    ],
    explanation:
      "Le saut le plus rentable est celui du niveau 1 au niveau 2 : c'est à partir de là que l'infrastructure sait ce qu'elle manipule — cache des lectures, rejeu des appels idempotents, distinction des erreurs client et serveur. La quasi-totalité des API dites « REST » s'arrêtent à ce niveau.",
  },
  {
    kind: "mcq",
    id: "transverse-http-17",
    difficulty: 3,
    tags: ["http", "rest"],
    prompt: "Quel bénéfice concret l'hypermédia apporte-t-il le plus souvent en pratique ?",
    choices: [
      "Exposer l'état : la présence du lien `cancel` dit au client que l'annulation est possible, sans qu'il duplique la règle métier.",
      "Permettre au client de découvrir entièrement l'API sans documentation ni développement spécifique.",
      "Réduire le nombre d'appels nécessaires pour parcourir une collection paginée.",
      "Garantir la compatibilité ascendante de l'API lors des changements de schéma JSON.",
    ],
    answer: 0,
    explanation:
      "La promesse théorique — un client générique qui découvre l'API et ne code aucune URL en dur — ne se matérialise presque jamais, les clients réels étant écrits à la main contre une documentation. Le bénéfice qui tient est ailleurs : les liens présents décrivent les transitions autorisées dans l'état courant, ce qui évite à l'interface de réimplémenter des règles métier qui divergeraient ensuite.",
  },
  {
    kind: "match",
    id: "transverse-http-18",
    difficulty: 2,
    tags: ["http", "rest"],
    prompt: "Associe chaque exemple d'appel à son niveau de maturité.",
    pairs: [
      { left: "POST /api {\"action\":\"getOrder\",\"id\":7781}", right: "Niveau 0 : un seul point d'entrée, du RPC" },
      { left: "POST /orders/7781 {\"action\":\"get\"}", right: "Niveau 1 : ressources identifiées, verbe dans le corps" },
      { left: "DELETE /orders/7781 → 204", right: "Niveau 2 : verbes HTTP et codes de statut" },
      { left: "GET /orders/7781 → 200 avec _links.cancel", right: "Niveau 3 : hypermédia" },
    ],
    explanation:
      "Le niveau 0 utilise HTTP comme un simple tunnel de transport. Le niveau 1 identifie les ressources mais garde l'action dans le corps. Le niveau 2 confie le verbe et le résultat au protocole lui-même — c'est là que l'infrastructure devient capable d'agir. Le niveau 3 ajoute les transitions disponibles à la réponse.",
  },
];

// ---------------------------------------------------------------------------
// Leçon 7 — Dessiner les ressources : URL, filtres, pagination
// ---------------------------------------------------------------------------

const l7: Lesson = {
  kind: "lesson",
  id: "transverse-http-l7",
  title: "Dessiner les ressources : URL, filtres, pagination",
  blocks: [
    {
      kind: "text",
      text: "Les URL d'une API publique sont un contrat qu'on ne pourra plus changer sans casser des clients qu'on ne connaît pas. C'est l'une des rares décisions de conception qu'il faut prendre correctement du premier coup, et elle se prend souvent en cinq minutes, à la va-vite, au moment d'écrire le premier contrôleur.",
    },
    {
      kind: "text",
      text: "La règle de base tient en une phrase : l'URL nomme une **chose**, la méthode dit ce qu'on en fait. `POST /createOrder` met le verbe deux fois, une fois dans la méthode et une fois dans le chemin. `POST /orders` suffit. Les noms sont au pluriel pour les collections, et l'identifiant se place directement derrière, ce qui donne la hiérarchie lisible `/orders/7781/lines/3`.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Les erreurs qu'on retrouve dans presque toutes les API maison.",
      code: `✗ POST /createOrder            verbe dans le chemin
✓ POST /orders

✗ GET  /getOrderById?id=7781   verbe + identifiant en filtre
✓ GET  /orders/7781

✗ POST /orders/7781/delete     verbe dans le chemin
✓ DELETE /orders/7781

✗ GET  /order                  singulier pour une collection
✓ GET  /orders

✗ GET  /orders/7781/lines/3/product/details/full
✓ GET  /products/912           au-delà de deux niveaux,
                               on repart de la racine`,
    },
    {
      kind: "text",
      text: "L'imbrication mérite une limite explicite. `/orders/7781/lines` est justifié : une ligne de commande n'existe pas hors de sa commande. Au-delà de deux niveaux, en revanche, l'URL devient longue, fragile, et impose au client de connaître un chemin complet pour atteindre une ressource qui a sa propre identité. La règle usuelle est de ne pas dépasser deux niveaux et de repartir de la racine ensuite.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Filtres, tri et pagination : dans la requête, jamais dans le chemin.",
      code: `GET /orders?status=PENDING&customerId=42
           &sort=-createdAt
           &page=2&size=20

# Le chemin identifie la collection ; les paramètres
# la restreignent. Une variante filtrée n'est pas une
# nouvelle ressource : /pendingOrders serait une erreur.

# La réponse porte de quoi naviguer :
{
  "items": [ … ],
  "page": 2, "size": 20, "totalElements": 431,
  "totalPages": 22
}`,
    },
    {
      kind: "text",
      text: "La pagination par numéro de page est simple mais a un défaut sur les données qui bougent : si un élément est inséré entre deux appels, tout se décale et le client voit un doublon ou saute une entrée. La pagination par curseur — « donne-moi les vingt suivants après cet identifiant » — n'a pas ce problème et supporte mieux les gros volumes, au prix de l'impossibilité de sauter directement à la page 17.",
    },
    {
      kind: "comparison",
      title: "Deux façons de versionner",
      left: {
        label: "Dans l'URL — /v1/orders",
        text: "Visible, trivial à router, facile à tester au navigateur. Formellement critiquable — la ressource est la même, seule sa représentation change — mais c'est de loin le plus répandu, et le plus simple à expliquer à un intégrateur.",
      },
      right: {
        label: "Par en-tête — Accept: …;version=1",
        text: "Plus conforme au modèle : l'URL reste stable et l'on négocie la représentation. En contrepartie, invisible dans les journaux et les tickets, impossible à ouvrir dans un navigateur, et oublié par tout client qui ne le pose pas.",
      },
    },
    {
      kind: "text",
      text: "Le meilleur versionnement reste celui dont on n'a pas besoin : beaucoup de changements peuvent être rendus rétrocompatibles. Ajouter un champ à une réponse ne casse personne, à condition que les clients ignorent les champs inconnus — ce qu'il faut leur demander explicitement dans la documentation. Retirer un champ, renommer, ou changer un type casse ; c'est là seulement qu'une nouvelle version se justifie.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ne jamais exposer les identifiants de base",
      text: "Un `/orders/7781` séquentiel dit à tout le monde combien de commandes vous avez, à quel rythme elles arrivent, et permet de balayer la collection en incrémentant. Sur des données sensibles, un identifiant opaque — UUID ou identifiant public distinct de la clé primaire — évite cette fuite. Le coût est faible s'il est prévu dès le départ, très élevé une fois les URL publiées.",
    },
    {
      kind: "text",
      text: "Dernier point souvent négligé : la cohérence prime sur la perfection. Une API où la moitié des collections sont au pluriel et l'autre au singulier, où certaines erreurs sont en 400 et d'autres en 422 pour le même type de faute, oblige chaque intégrateur à découvrir les règles au cas par cas. Un choix imparfait mais appliqué partout coûte bien moins cher qu'un mélange de bons choix.",
    },
  ],
};

const ex7: Exercise[] = [
  {
    kind: "spot",
    id: "transverse-http-19",
    difficulty: 2,
    tags: ["http", "conception"],
    prompt: "Revue de conception d'API. Quelle route pose problème ?",
    code: {
      language: "text",
      code: `GET    /orders
GET    /orders/7781
POST   /createOrder
DELETE /orders/7781
GET    /orders?status=PENDING`,
    },
    faultyLine: 3,
    reasons: [
      "Le verbe est dans le chemin : `POST /orders` suffit, la méthode dit déjà qu'on crée.",
      "La création devrait utiliser PUT et non POST.",
      "Le filtre `?status=PENDING` devrait être une route dédiée `/pendingOrders`.",
      "La suppression devrait renvoyer la ressource supprimée, donc utiliser POST.",
    ],
    reasonAnswer: 0,
    explanation:
      "L'URL nomme une chose, la méthode dit ce qu'on en fait : `POST /createOrder` exprime le verbe deux fois. Les quatre autres routes sont correctes — le filtre en paramètre de requête est le bon choix, une collection filtrée n'étant pas une nouvelle ressource, et PUT ne conviendrait ici que si le client choisissait l'identifiant.",
  },
  {
    kind: "mcq",
    id: "transverse-http-20",
    difficulty: 2,
    tags: ["http", "conception"],
    prompt: "Quel changement peut être fait sans nouvelle version de l'API ?",
    choices: [
      "Ajouter un champ optionnel à une réponse, si les clients ignorent les champs inconnus.",
      "Renommer un champ existant en gardant le même type de données.",
      "Changer un champ de `string` à `number` sans en modifier le nom.",
      "Retirer un champ devenu inutile de toutes les réponses.",
    ],
    answer: 0,
    explanation:
      "L'ajout est le seul changement rétrocompatible de la liste : un client qui ignore les champs inconnus n'est pas affecté — et c'est une exigence à écrire noir sur blanc dans la documentation. Renommer, retirer ou changer un type casse tout client qui lisait le champ. Le meilleur versionnement reste celui dont on n'a pas besoin : la plupart des évolutions peuvent être conçues comme des ajouts.",
  },
  {
    kind: "recall",
    id: "transverse-http-21",
    difficulty: 3,
    tags: ["http", "conception"],
    prompt: "Quelle limite a la pagination par numéro de page, et que résout la pagination par curseur ?",
    explanation:
      "La pagination par page repose sur un décalage : « saute les quarante premiers, donne les vingt suivants ». Si un élément est inséré ou supprimé entre deux appels, tout se décale d'un rang — le client voit alors deux fois le même élément, ou en saute un, sans jamais s'en apercevoir. Le problème s'aggrave sur les collections très actives et sur les gros volumes, où le décalage devient aussi coûteux à calculer pour la base. La pagination par curseur demande « les vingt suivants après cet identifiant » : le point de départ est ancré sur un élément et non sur un rang, donc les insertions ne le déplacent pas. Le prix à payer est qu'on ne peut plus sauter directement à la page 17, ni afficher un nombre total de pages.",
    keyPoints: [
      "La page repose sur un rang, qu'une insertion décale",
      "Conséquence : doublons ou éléments sautés, invisibles pour le client",
      "Le curseur s'ancre sur un élément, pas sur un rang",
      "Prix : plus de saut direct à une page ni de total de pages",
    ],
  },
];

// ---------------------------------------------------------------------------
// Leçon 8 — Erreurs exploitables et sécurité de surface
// ---------------------------------------------------------------------------

const l8: Lesson = {
  kind: "lesson",
  id: "transverse-http-l8",
  title: "Erreurs exploitables et sécurité de surface",
  blocks: [
    {
      kind: "text",
      text: "Le code de statut dit ce qui s'est passé, jamais pourquoi. Un 422 sur une création de commande peut venir d'une quantité négative, d'une devise inconnue ou d'une date passée : le client a besoin de le savoir pour afficher un message utile et pour placer l'erreur sur le bon champ de formulaire. C'est le rôle du corps d'erreur, et c'est la partie des API la plus souvent bâclée.",
    },
    {
      kind: "text",
      text: "Chaque équipe finit par inventer son format, si bien qu'un client qui consomme quatre API en gère quatre. La RFC 9457 — qui remplace la 7807 — normalise ce corps sous le type `application/problem+json`. Cinq champs suffisent, et l'on peut en ajouter autant qu'on veut : le format est explicitement extensible, ce qui évite d'avoir à choisir entre la norme et ses propres besoins.",
    },
    {
      kind: "code",
      language: "json",
      caption: "Un problème décrit une fois pour toutes.",
      code: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.example/problems/invalid-order",
  "title": "La commande est invalide",
  "status": 422,
  "detail": "La quantité doit être strictement positive.",
  "instance": "/orders",
  "errors": [
    { "field": "quantity", "message": "doit être > 0" },
    { "field": "currency", "message": "devise inconnue : XYZ" }
  ]
}`,
    },
    {
      kind: "text",
      text: "La distinction essentielle est entre `title` et `detail`. Le `title` est stable pour un type de problème donné : c'est sur lui — ou mieux, sur `type` — qu'un client peut brancher un traitement. Le `detail` décrit l'occurrence précise et peut changer d'un appel à l'autre. Un client ne doit jamais analyser le `detail` pour prendre une décision, exactement comme on ne teste pas le message d'une exception.",
    },
    {
      kind: "code",
      language: "text",
      caption: "Ce qu'un message d'erreur ne doit jamais contenir.",
      code: `✗ "detail": "ERROR: duplicate key value violates unique
   constraint \\"users_email_key\\" — Detail: Key
   (email)=(alice@example.com) already exists."
   → schéma de base, nom de contrainte, donnée
     personnelle, et le SGBD utilisé.

✗ "detail": "java.lang.NullPointerException at
   com.example.OrderService.create(OrderService.java:88)"
   → pile d'appel, structure du code, version.

✓ "detail": "Un compte existe déjà pour cette adresse.",
  "traceId": "4f9a2c10-7b3e-4a91-8c22-1d0e5f7a9b34"
   → utile au client, et corrélable côté serveur.`,
    },
    {
      kind: "text",
      text: "Renvoyer une trace technique au client est un réflexe de développement qui survit trop souvent en production. Il donne à un attaquant une carte de votre système — SGBD, framework, versions, chemins de classes, noms de colonnes — et expose parfois des données personnelles. L'identifiant de corrélation résout le dilemme : le client obtient une référence à communiquer au support, et le détail complet reste dans vos journaux.",
    },
    {
      kind: "comparison",
      title: "Deux erreurs de politique CORS",
      left: {
        label: "Origin: * avec credentials",
        text: "Le navigateur refuse purement et simplement cette combinaison : un caractère générique est incompatible avec l'envoi de cookies. On finit alors par renvoyer dynamiquement l'origine reçue — ce qui autorise en réalité tout le monde.",
      },
      right: {
        label: "Liste blanche explicite",
        text: "On compare l'origine reçue à une liste connue et on ne renvoie que celles qui y figurent. C'est la seule forme correcte dès que des cookies sont en jeu, et elle demande de tenir la liste à jour par environnement.",
      },
    },
    {
      kind: "text",
      text: "Un dernier rappel sur CORS, parce que le contresens est très répandu : ce mécanisme ne protège pas votre serveur. C'est une règle appliquée par le **navigateur**, qui décide si du code JavaScript d'une autre origine a le droit de lire la réponse. Un `curl` ou un client mobile l'ignorent totalement. Configurer CORS n'est donc en aucun cas une mesure de sécurité côté serveur — l'authentification et l'autorisation restent entièrement à votre charge.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Les messages qui révèlent l'existence",
      text: "« Cet utilisateur n'existe pas » puis « mot de passe incorrect » permettent d'énumérer les comptes d'un service : on apprend quelles adresses y sont inscrites, information souvent sensible en elle-même. Le même raisonnement vaut sur une réinitialisation de mot de passe. La réponse doit être identique dans les deux cas, et le temps de traitement comparable — sans quoi la durée trahit ce que le message tait.",
    },
    {
      kind: "text",
      text: "Ces règles se résument à une seule idée : une réponse d'erreur s'adresse à deux publics dont les besoins sont opposés. Le client légitime veut assez d'information pour corriger sa requête ; un attaquant veut la même information pour cartographier le système. Le partage se fait en donnant au premier une cause métier et une référence, et en gardant tout le reste — technique, structurel, nominatif — dans les journaux.",
    },
  ],
};

const ex8: Exercise[] = [
  {
    kind: "spot",
    id: "transverse-http-22",
    difficulty: 2,
    tags: ["http", "erreurs", "securite"],
    prompt: "Cette réponse d'erreur part en production. Quelle ligne pose problème ?",
    code: {
      language: "json",
      code: `{
  "type": "https://api.example/problems/duplicate",
  "title": "Création impossible",
  "status": 409,
  "detail": "duplicate key violates constraint users_email_key: (email)=(alice@example.com)",
  "traceId": "4f9a2c10-7b3e"
}`,
    },
    faultyLine: 5,
    reasons: [
      "Le `detail` expose le schéma de base, le nom de la contrainte et une adresse personnelle.",
      "Le champ `status` ne doit pas être répété dans le corps puisqu'il est déjà dans l'en-tête.",
      "Le `type` doit être une URL réellement accessible, sinon le corps est invalide.",
      "Le `traceId` n'appartient pas à la RFC 9457 et rend le format non conforme.",
    ],
    reasonAnswer: 0,
    explanation:
      "Le message d'erreur brut du SGBD révèle le nom de la table et de la contrainte, le moteur utilisé, et une donnée personnelle appartenant à un autre utilisateur — ce qui permet en prime d'énumérer les comptes. La bonne version dit « un compte existe déjà pour cette adresse » et laisse le détail technique dans les journaux, corrélable par le `traceId`. Répéter `status` dans le corps est prévu par la RFC, et le format est explicitement extensible.",
  },
  {
    kind: "fill",
    id: "transverse-http-23",
    difficulty: 1,
    tags: ["http", "erreurs"],
    prompt: "Complète l'en-tête et le champ stable de ce corps d'erreur normalisé.",
    code: {
      language: "text",
      code: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/{{1}}

{
  "{{2}}": "https://api.example/problems/invalid-order",
  "title": "La commande est invalide",
  "detail": "La quantité doit être strictement positive."
}`,
    },
    blanks: ["problem+json", "type"],
    distractors: ["json", "error", "instance"],
    explanation:
      "La RFC 9457 définit le type de média `application/problem+json`. Le champ `type` est un identifiant stable du problème, sur lequel un client peut brancher un traitement ; `instance` désigne l'occurrence précise, et `detail` la décrit en clair. Un client ne doit jamais analyser le `detail`, qui peut changer d'un appel à l'autre.",
  },
  {
    kind: "mcq",
    id: "transverse-http-24",
    difficulty: 3,
    tags: ["http", "securite"],
    prompt: "Que protège exactement CORS ?",
    choices: [
      "Rien côté serveur : c'est le navigateur qui empêche du JavaScript d'une autre origine de lire la réponse.",
      "Le serveur, en refusant les requêtes provenant d'origines non autorisées.",
      "Les données en transit, en imposant une origine chiffrée en HTTPS.",
      "Les sessions, en empêchant l'envoi de cookies vers des domaines tiers.",
    ],
    answer: 0,
    explanation:
      "CORS est une règle appliquée par le navigateur : elle décide si du code JavaScript chargé depuis une origine a le droit de **lire** la réponse d'une autre. Un `curl`, un script serveur ou un client mobile l'ignorent totalement — la requête atteint le serveur et est traitée normalement. Configurer CORS n'est donc jamais une mesure de sécurité côté serveur : l'authentification et l'autorisation restent entièrement à votre charge.",
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "transverse-http-api",
  title: "HTTP et conception d'API",
  objective:
    "Concevoir et défendre une API HTTP : choisir la méthode pour ce qu'elle promet, survivre au rejeu, employer les bons codes et en-têtes, exploiter le cache, situer son API sur l'échelle de Richardson, dessiner des URL durables et renvoyer des erreurs utiles sans trop en dire.",
  prerequisites: [],
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
