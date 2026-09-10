/**
 * Git et GitLab CI (référentiel 8.1 et 8.2) : staging et branches,
 * défaire proprement, pipeline, cache et artifacts.
 * 4 leçons, 30 exercices.
 */

import type { Chapter, Exercise, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Leçon 1 — Zone de staging, branches, merge et rebase
// ---------------------------------------------------------------------------

const l1: Lesson = {
  kind: "lesson",
  id: "devops-ci-l1",
  title: "Staging, branches, merge et rebase",
  blocks: [
    {
      kind: "text",
      text: "Git manipule trois zones. Le **répertoire de travail** contient les fichiers tels qu'ils sont sur le disque. L'**index**, ou zone de staging, contient ce qui entrera dans le prochain commit : c'est `git add` qui l'alimente. Le **dépôt** contient les commits validés. Cette étape intermédiaire permet de composer un commit cohérent sans embarquer tout ce qui traîne.",
    },
    {
      kind: "text",
      text: "Une branche n'est qu'un **pointeur mobile** vers un commit. La créer ne copie rien, ce qui rend l'opération instantanée.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Deux façons d'intégrer main dans une branche de travail.",
      code: `# MERGE : conserve l'historique tel quel
# et ajoute un commit de fusion
git switch feature
git merge main
# A---B---C  main
#      \\   \\
#       D---M  feature

# REBASE : rejoue les commits de feature
# au-dessus de main, avec de NOUVEAUX
# identifiants
git switch feature
git rebase main
# A---B---C  main
#          \\
#           D'  feature

# Après un rebase d'une branche déjà poussée
git push --force-with-lease`,
    },
    {
      kind: "text",
      text: "Le `merge` préserve l'histoire réelle et ajoute un commit de fusion, sauf si l'avance est directe et permet un **fast-forward**. Le `rebase` **réécrit** l'historique : les commits rejoués reçoivent de nouveaux identifiants. D'où la règle absolue : ne jamais rebaser une branche déjà partagée, sous peine d'obliger les autres à réparer leur copie.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Après un rebase, `git push` est refusé. Utiliser `--force-with-lease` et non `--force` : la variante avec bail vérifie que personne n'a poussé entretemps, et refuse d'écraser le travail d'un collègue.",
    },
  ],
};

const ex1: Exercise[] = [
  {
    kind: "mcq",
    id: "devops-ci-01",
    difficulty: 1,
    tags: ["git", "staging"],
    prompt: "À quoi sert la zone de staging (l'index) ?",
    choices: [
      "À composer le contenu du prochain commit, indépendamment de l'état complet du répertoire de travail.",
      "À sauvegarder temporairement des modifications avant de changer de branche.",
      "À stocker les commits en attente d'être poussés vers le dépôt distant.",
      "À conserver la version précédente de chaque fichier modifié.",
    ],
    answer: 0,
    explanation:
      "L'index permet de choisir précisément ce qui entre dans un commit, jusqu'à ne prendre que certaines lignes d'un fichier avec `git add -p`. Mettre de côté des modifications est le rôle de `git stash` ; les commits non poussés sont déjà dans le dépôt local ; l'historique des versions vient des commits eux-mêmes.",
  },
  {
    kind: "output",
    id: "devops-ci-02",
    difficulty: 2,
    tags: ["git", "merge-vs-rebase"],
    prompt: "`feature` part de `main` au commit B. `main` a depuis avancé jusqu'à C. Que produit `git rebase main` depuis `feature` ?",
    code: {
      language: "bash",
      code: `git switch feature
git rebase main`,
    },
    choices: [
      "Les commits de `feature` sont rejoués au-dessus de C avec de **nouveaux** identifiants ; l'historique devient linéaire.",
      "Un commit de fusion est créé entre `feature` et `main`.",
      "Les commits de `main` sont copiés dans `feature`, en gardant leurs identifiants.",
      "`main` est déplacée pour pointer sur le dernier commit de `feature`.",
    ],
    answer: 0,
    explanation:
      "Le rebase reconstruit chaque commit de la branche au-dessus de la nouvelle base : même contenu, mais parent et identifiant différents. L'historique paraît linéaire, comme si le travail avait commencé après C. C'est cette réécriture qui interdit le rebase sur une branche partagée, et qui impose ensuite un `push --force-with-lease`.",
  },
  {
    kind: "mcq",
    id: "devops-ci-03",
    difficulty: 2,
    tags: ["git", "merge-vs-rebase"],
    prompt: "Pourquoi ne jamais rebaser une branche déjà poussée et utilisée par d'autres ?",
    choices: [
      "Le rebase remplace les commits par de nouveaux : les copies locales des collègues divergent et leurs prochains push créent des doublons.",
      "Le rebase supprime définitivement les commits d'origine du serveur.",
      "GitLab refuse tout push sur une branche rebasée.",
      "Le rebase transforme la branche en branche protégée.",
    ],
    answer: 0,
    explanation:
      "Après un rebase, les anciens commits existent toujours chez ceux qui les ont récupérés, mais plus dans la nouvelle histoire. Leur `git pull` fusionne les deux versions et duplique tout le travail, ce qui produit un historique illisible et des conflits inutiles. Sur une branche personnelle non partagée, le rebase est en revanche très utile.",
  },
  {
    kind: "fill",
    id: "devops-ci-04",
    difficulty: 1,
    tags: ["git", "branches"],
    prompt: "Complète pour créer une branche, y committer et la pousser en la liant à son homologue distante.",
    code: {
      language: "bash",
      code: `git {{1}} -c feature/panier
git add .
git commit -m "feat: ajoute le panier"
git push --{{2}}-upstream origin feature/panier`,
    },
    blanks: ["switch", "set"],
    distractors: ["checkout", "branch", "force", "track"],
    explanation:
      "`git switch -c` crée et bascule sur la branche ; `git checkout -b` fait la même chose mais `switch` est la commande moderne, dédiée aux branches. `--set-upstream` (ou `-u`) associe la branche locale à la distante, ce qui permet ensuite un `git push` et un `git pull` sans arguments.",
  },
  {
    kind: "match",
    id: "devops-ci-05",
    difficulty: 2,
    tags: ["git", "merge-vs-rebase"],
    prompt: "Associe chaque situation à l'opération adaptée.",
    pairs: [
      { left: "Intégrer une branche terminée dans `main`", right: "`merge`, qui garde la trace de la fusion" },
      { left: "Mettre à jour ma branche perso avant relecture", right: "`rebase`, pour un historique linéaire" },
      { left: "Annuler un commit déjà poussé sur `main`", right: "`revert`, qui ajoute un commit inverse" },
      { left: "Récupérer un seul commit d'une autre branche", right: "`cherry-pick`" },
      { left: "Mettre de côté un travail en cours", right: "`stash`" },
    ],
    explanation:
      "La ligne de partage est simple : tout ce qui **réécrit** l'histoire (`rebase`, `reset`) est réservé au local ou à une branche personnelle ; tout ce qui **ajoute** un commit (`merge`, `revert`, `cherry-pick`) est sûr sur une branche partagée.",
  },
  {
    kind: "output",
    id: "devops-ci-06",
    difficulty: 2,
    tags: ["git", "merge-vs-rebase"],
    prompt: "`main` n'a pas bougé depuis que `feature` en est partie. Que produit `git merge feature` depuis `main` ?",
    code: {
      language: "bash",
      code: `git switch main
git merge feature`,
    },
    choices: [
      "Un fast-forward : `main` avance simplement sur le dernier commit de `feature`, sans commit de fusion.",
      "Un commit de fusion, systématiquement créé par `git merge`.",
      "Un conflit, les deux branches partageant le même ancêtre.",
      "Rien : `merge` refuse une branche qui n'a pas divergé.",
    ],
    answer: 0,
    explanation:
      "Sans divergence, il n'y a rien à fusionner : Git déplace le pointeur de `main`, c'est le fast-forward. L'historique reste linéaire mais la trace de la branche disparaît, d'où l'usage de `--no-ff` sur les projets qui veulent conserver visuellement chaque fusion.",
  },
  {
    kind: "spot",
    id: "devops-ci-07",
    difficulty: 2,
    tags: ["git", "conflits"],
    prompt: "Après avoir résolu un conflit, cette séquence bloque. Trouve la ligne fautive.",
    code: {
      language: "bash",
      code: `git rebase main
# conflit dans src/Panier.java
vim src/Panier.java
git commit -m "fix: conflit"
git rebase --continue`,
    },
    faultyLine: 4,
    reasons: [
      "En plein rebase, le fichier résolu doit être ajouté à l'index avec `git add`, pas committé : `git rebase --continue` crée le commit lui-même.",
      "Il faut relancer `git rebase main` après chaque résolution.",
      "Un conflit ne peut se résoudre qu'avec `git mergetool`.",
      "L'option `--continue` n'existe que pour `git merge`.",
    ],
    reasonAnswer: 0,
    explanation:
      "Pendant un rebase, Git rejoue les commits un par un : il attend qu'on marque la résolution avec `git add`, puis `git rebase --continue` termine le commit en cours. Un `git commit` manuel crée un commit parasite et brouille la séquence. Séquence correcte : éditer, `git add`, `git rebase --continue`, ou `git rebase --abort` pour tout annuler.",
  },
  {
    kind: "recall",
    id: "devops-ci-08",
    difficulty: 2,
    tags: ["git", "merge-vs-rebase"],
    prompt: "Merge ou rebase : comment choisis-tu, et quelle règle ne se discute pas ?",
    explanation:
      "Le **merge** conserve l'histoire telle qu'elle s'est produite et ajoute un commit de fusion : l'historique est fidèle mais ramifié. Le **rebase** rejoue les commits sur une nouvelle base : l'historique devient linéaire et lisible, au prix d'une réécriture. En pratique, beaucoup d'équipes rebasent leur branche personnelle sur `main` avant la relecture, pour présenter une série de commits propres et sans fusion parasite, puis intègrent par un merge, éventuellement avec `--no-ff`, afin de garder la trace de la fonctionnalité. La règle qui ne se discute pas : **ne jamais réécrire une histoire déjà partagée**. Rebaser une branche que d'autres ont récupérée duplique leur travail au prochain pull et provoque des conflits inutiles. Pour annuler un commit déjà sur `main`, on utilise `revert`, pas `reset` ni un rebase.",
    keyPoints: ["Merge : fidèle, ramifié, sûr partout", "Rebase : linéaire, réécrit, local uniquement", "Rebaser sa branche avant la relecture", "Jamais de réécriture d'une histoire partagée"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 2 — Défaire proprement
// ---------------------------------------------------------------------------

const l2: Lesson = {
  kind: "lesson",
  id: "devops-ci-l2",
  title: "Défaire : reset, revert, reflog",
  blocks: [
    {
      kind: "text",
      text: "`git reset` déplace le pointeur de branche, et son option décide jusqu'où descend l'effet. `--soft` ne bouge que `HEAD` : les modifications des commits annulés se retrouvent **dans l'index**, prêtes à être recommittées. `--mixed`, le défaut, réinitialise aussi l'index : les modifications restent dans le répertoire de travail, mais non ajoutées. `--hard` réinitialise tout : le travail est **perdu**.",
    },
    {
      kind: "code",
      language: "bash",
      caption: "Trois portées pour reset, et le filet de sécurité.",
      code: `# Regrouper les 3 derniers commits en un seul
git reset --soft HEAD~3
git commit -m "feat: fonctionnalité complète"

# Annuler le dernier commit et retravailler
git reset HEAD~1        # --mixed par défaut

# Tout jeter : dangereux
git reset --hard HEAD~1

# Retrouver un commit "perdu"
git reflog
# a1b2c3d HEAD@{1}: commit: travail important
git reset --hard a1b2c3d`,
    },
    {
      kind: "text",
      text: "`git revert` ne réécrit rien : il crée un **nouveau commit** qui applique l'inverse d'un commit existant. C'est la seule façon sûre d'annuler quelque chose déjà poussé sur une branche partagée.",
    },
    {
      kind: "text",
      text: "Le **reflog** enregistre tous les déplacements de `HEAD` sur le dépôt local, y compris ceux qui ne sont plus atteignables depuis une branche. Tant qu'un commit y figure, il est récupérable : c'est le filet après un `reset --hard` malheureux.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Réflexe",
      text: "Avant toute opération risquée, `git stash` ou une branche de secours. Et en cas de catastrophe, `git reflog` avant de paniquer : Git jette très peu de choses.",
    },
  ],
};

const ex2: Exercise[] = [
  {
    kind: "output",
    id: "devops-ci-09",
    difficulty: 2,
    tags: ["git", "reset"],
    prompt: "Après un commit, que montre `git status` à la fin de cette séquence ?",
    code: {
      language: "bash",
      code: `echo "ligne" >> a.txt
git commit -am "ajoute une ligne"
git reset --soft HEAD~1
git status`,
    },
    choices: [
      "La modification de `a.txt` apparaît dans « Changes to be committed » : elle est de retour dans l'index.",
      "La modification apparaît dans « Changes not staged for commit ».",
      "Rien : le répertoire de travail est propre, la modification est perdue.",
      "Un conflit : `reset --soft` demande une résolution manuelle.",
    ],
    answer: 0,
    explanation:
      "`--soft` ne touche que le pointeur de branche. Le commit disparaît de l'historique, mais son contenu reste **dans l'index**, prêt à être recommitté. C'est le moyen le plus simple de regrouper plusieurs commits ou de reformuler un message avec un découpage différent.",
  },
  {
    kind: "output",
    id: "devops-ci-10",
    difficulty: 2,
    tags: ["git", "reset"],
    prompt: "Même séquence, mais avec `--mixed`, l'option par défaut. Que montre `git status` ?",
    code: {
      language: "bash",
      code: `echo "ligne" >> a.txt
git commit -am "ajoute une ligne"
git reset HEAD~1
git status`,
    },
    choices: [
      "La modification apparaît dans « Changes not staged for commit » : présente sur le disque, mais retirée de l'index.",
      "La modification apparaît dans « Changes to be committed ».",
      "Rien : le fichier est revenu à son état d'origine.",
      "`a.txt` apparaît comme un fichier non suivi.",
    ],
    answer: 0,
    explanation:
      "`--mixed` réinitialise le pointeur **et** l'index, sans toucher au répertoire de travail : le contenu du commit annulé redevient une modification non ajoutée. C'est le comportement par défaut de `git reset`. Le fichier reste suivi, seule la version indexée change.",
  },
  {
    kind: "mcq",
    id: "devops-ci-11",
    difficulty: 2,
    tags: ["git", "revert", "reset"],
    prompt: "Un commit fautif a été poussé sur `main`, branche partagée. Comment l'annuler ?",
    choices: [
      "`git revert <sha>` : un nouveau commit applique l'inverse, sans réécrire l'historique.",
      "`git reset --hard <sha précédent>` puis `git push --force`.",
      "`git rebase -i` pour supprimer le commit, puis `git push --force-with-lease`.",
      "`git checkout <sha précédent> -- .` puis un commit de restauration.",
    ],
    answer: 0,
    explanation:
      "Sur une branche partagée, seule une opération **additive** est sûre. `revert` ajoute un commit d'annulation, visible et traçable, sans rien casser chez les autres. Les deux options avec force réécrivent l'histoire publique et cassent toutes les copies locales. La dernière restaure les fichiers mais ne gère ni les suppressions ni les renommages proprement.",
  },
  {
    kind: "spot",
    id: "devops-ci-12",
    difficulty: 2,
    tags: ["git", "reset"],
    prompt: "Cette séquence, destinée à annuler le dernier commit pour le retravailler, fait perdre le travail. Trouve la ligne fautive.",
    code: {
      language: "bash",
      code: `git log --oneline -1
git reset --hard HEAD~1
git status
git commit -m "nouvelle version"`,
    },
    faultyLine: 2,
    reasons: [
      "`--hard` réinitialise aussi le répertoire de travail : le contenu du commit est effacé du disque. Il fallait `--soft` ou `--mixed`.",
      "`HEAD~1` désigne le commit courant, pas le précédent : il fallait `HEAD~2`.",
      "`git reset` ne fonctionne pas juste après un `git log`.",
      "Il manque un `git add` avant le commit final.",
    ],
    reasonAnswer: 0,
    explanation:
      "`--hard` propage la réinitialisation jusqu'aux fichiers : rien ne subsiste à recommitter, d'où le `git status` propre. Pour retravailler un commit, `--soft` garde tout dans l'index et `--mixed` dans le répertoire de travail. Si l'erreur est déjà faite, `git reflog` permet encore de retrouver le commit.",
  },
  {
    kind: "match",
    id: "devops-ci-13",
    difficulty: 2,
    tags: ["git", "reset", "revert", "reflog"],
    prompt: "Associe chaque commande à ce qu'elle modifie.",
    pairs: [
      { left: "`reset --soft`", right: "HEAD seulement : le contenu revient dans l'index" },
      { left: "`reset --mixed`", right: "HEAD et l'index : modifications non ajoutées" },
      { left: "`reset --hard`", right: "HEAD, index et fichiers : travail perdu" },
      { left: "`revert`", right: "Ajoute un commit inverse, sans rien réécrire" },
      { left: "`reflog`", right: "Journal local des déplacements de HEAD" },
    ],
    explanation:
      "Les trois portées de `reset` vont du plus doux au plus destructeur, en descendant successivement vers l'index puis vers le disque. Le reflog est local : il ne se pousse pas, mais il conserve pendant plusieurs semaines de quoi récupérer presque n'importe quelle erreur.",
  },
  {
    kind: "fill",
    id: "devops-ci-14",
    difficulty: 2,
    tags: ["git", "stash", "cherry-pick"],
    prompt: "Complète : mettre de côté le travail en cours, récupérer un commit d'une autre branche, puis reprendre.",
    code: {
      language: "bash",
      code: `git {{1}}
git switch main
git {{2}} a1b2c3d
git switch feature
git stash {{3}}`,
    },
    blanks: ["stash", "cherry-pick", "pop"],
    distractors: ["commit", "merge", "apply", "revert", "reset"],
    explanation:
      "`git stash` remise les modifications non committées et rend le répertoire propre pour changer de branche. `cherry-pick` applique le contenu d'un commit précis sur la branche courante, en créant un **nouveau** commit avec un autre identifiant. `stash pop` restaure et retire l'entrée de la pile, là où `apply` la conserverait.",
  },
  {
    kind: "recall",
    id: "devops-ci-15",
    difficulty: 2,
    tags: ["git", "reflog"],
    prompt: "Tu viens de faire `git reset --hard` et de perdre deux heures de travail committé. Que fais-tu ?",
    explanation:
      "`git reflog`. Ce journal enregistre **chaque déplacement de HEAD** dans le dépôt local : commits, resets, changements de branche, rebases. Les commits « perdus » n'ont pas été supprimés, ils sont seulement devenus inatteignables depuis une branche, et le ramasse-miettes ne les récupérera pas avant plusieurs semaines. Il suffit de repérer la ligne correspondant à l'état d'avant, par exemple `a1b2c3d HEAD@{1}: commit: travail important`, puis de faire `git reset --hard a1b2c3d` pour y revenir, ou plus prudemment `git switch -c secours a1b2c3d` afin de créer une branche sans rien écraser. Limites à connaître : le reflog est **local**, il n'existe pas sur le serveur ni chez les collègues, et il ne couvre pas ce qui n'a jamais été committé. Un `reset --hard` sur des modifications non committées est irrécupérable, d'où l'intérêt de committer ou de stasher souvent.",
    keyPoints: ["`git reflog` liste les positions passées de HEAD", "Commits inatteignables, pas supprimés", "`switch -c secours <sha>` plutôt que `reset --hard`", "Local uniquement, et rien pour le non-committé"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 3 — Le pipeline GitLab CI
// ---------------------------------------------------------------------------

const l3: Lesson = {
  kind: "lesson",
  id: "devops-ci-l3",
  title: "Le pipeline : stages, jobs et rules",
  blocks: [
    {
      kind: "text",
      text: "Un pipeline GitLab se décrit dans `.gitlab-ci.yml`. Les **stages** s'exécutent en séquence, et les **jobs** d'un même stage en parallèle. Chaque job tourne dans un conteneur neuf, à partir de l'`image` indiquée, sur un **runner**.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Un pipeline type : build, test, package, deploy.",
      code: `stages: [build, test, deploy]

default:
  image: eclipse-temurin:21

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repo"

build:
  stage: build
  script:
    - ./mvnw -B package -DskipTests
  artifacts:
    paths:
      - target/*.jar
    expire_in: 1 week

test:
  stage: test
  script:
    - ./mvnw -B verify
  artifacts:
    reports:
      junit: target/surefire-reports/TEST-*.xml

deploy:
  stage: deploy
  script:
    - ./deploy.sh
  environment:
    name: production
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual`,
    },
    {
      kind: "text",
      text: "Un job échoue dès qu'une commande de son `script` renvoie un code non nul, et le stage suivant ne démarre pas. `rules` conditionne l'exécution : `if` sur une variable, `changes` sur des fichiers modifiés, `when` pour `manual`, `always` ou `never`. `rules` remplace `only` et `except`, et ne se combine pas avec eux dans un même job.",
    },
    {
      kind: "text",
      text: "Chaque job repart d'un clone frais du dépôt : rien de ce qu'un job produit ne survit pour le suivant, sauf déclaration explicite. Le bloc `default` factorise ce qui vaut pour tous les jobs, comme l'image ou le `before_script`, et chaque job peut le redéfinir. Placer les stages rapides en premier fait remonter les échecs en quelques secondes.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "À savoir",
      text: "Les variables prédéfinies renseignent le contexte : `CI_COMMIT_SHA`, `CI_COMMIT_BRANCH`, `CI_DEFAULT_BRANCH`, `CI_COMMIT_REF_SLUG` (utilisable dans un nom d'image) et `CI_REGISTRY_IMAGE`.",
    },
  ],
};

const ex3: Exercise[] = [
  {
    kind: "mcq",
    id: "devops-ci-16",
    difficulty: 1,
    tags: ["gitlab-ci", "stages", "jobs"],
    prompt: "Deux jobs sont déclarés dans le même stage. Comment s'exécutent-ils ?",
    choices: [
      "En parallèle, et le stage suivant attend qu'ils soient tous les deux terminés.",
      "En séquence, dans l'ordre du fichier.",
      "En parallèle, le stage suivant démarrant dès le premier terminé.",
      "En séquence, dans l'ordre alphabétique de leur nom.",
    ],
    answer: 0,
    explanation:
      "C'est le modèle par défaut : parallélisme à l'intérieur d'un stage, barrière entre les stages. Si un seul job du stage échoue, les stages suivants ne démarrent pas. Le mot-clé `needs` permet de sortir de ce modèle et de construire un graphe où un job démarre dès que ses dépendances directes sont prêtes.",
  },
  {
    kind: "output",
    id: "devops-ci-17",
    difficulty: 2,
    tags: ["gitlab-ci", "jobs"],
    prompt: "Que se passe-t-il si `./mvnw verify` échoue dans ce job ?",
    code: {
      language: "yaml",
      code: `test:
  stage: test
  script:
    - ./mvnw -B verify
    - echo "tests OK"

deploy:
  stage: deploy
  script:
    - ./deploy.sh`,
    },
    choices: [
      "Le job `test` échoue immédiatement, `echo` n'est pas exécuté et `deploy` ne démarre pas.",
      "`echo` s'exécute quand même, puis le job est marqué en échec.",
      "Le pipeline continue : seul un `exit 1` explicite arrête un job.",
      "`deploy` démarre mais est marqué comme non fiable.",
    ],
    answer: 0,
    explanation:
      "Le `script` s'exécute avec l'équivalent d'un `set -e` : la première commande dont le code de retour est non nul interrompt le job. Le stage `deploy` étant postérieur, il ne démarre pas. Pour exécuter quelque chose malgré l'échec, il faut `after_script`, qui tourne dans tous les cas.",
  },
  {
    kind: "fill",
    id: "devops-ci-18",
    difficulty: 2,
    tags: ["gitlab-ci", "rules"],
    prompt: "Complète pour que le déploiement ne soit proposé que sur la branche par défaut, et seulement sur action manuelle.",
    code: {
      language: "yaml",
      code: `deploy:
  stage: deploy
  script:
    - ./deploy.sh
  {{1}}:
    - {{2}}: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      {{3}}: manual`,
    },
    blanks: ["rules", "if", "when"],
    distractors: ["only", "except", "condition", "trigger"],
    explanation:
      "`rules` est la syntaxe actuelle ; `only` et `except` sont dépréciés et ne peuvent pas cohabiter avec `rules` dans un même job. Chaque règle teste une condition avec `if` et décide de l'exécution avec `when`, dont `manual` place le job en attente d'un clic.",
  },
  {
    kind: "spot",
    id: "devops-ci-19",
    difficulty: 2,
    tags: ["gitlab-ci", "stages"],
    prompt: "Le pipeline échoue au chargement du fichier. Trouve la ligne fautive.",
    code: {
      language: "yaml",
      code: `stages: [build, test]

package:
  stage: deploy
  script:
    - ./package.sh`,
    },
    faultyLine: 4,
    reasons: [
      "Le stage `deploy` n'est pas déclaré dans la liste `stages` : GitLab refuse le fichier.",
      "Un job ne peut pas porter un nom différent de son stage.",
      "`script` doit contenir au moins deux commandes.",
      "La liste `stages` doit être écrite sur plusieurs lignes.",
    ],
    reasonAnswer: 0,
    explanation:
      "Tout stage utilisé par un job doit figurer dans la liste `stages`, qui en fixe aussi l'ordre. Le message est explicite : « chosen stage does not exist ». Sans déclaration `stages`, GitLab utilise les stages par défaut `.pre`, `build`, `test`, `deploy`, `.post`, et le fichier passerait ici.",
  },
  {
    kind: "match",
    id: "devops-ci-20",
    difficulty: 2,
    tags: ["gitlab-ci", "variables"],
    prompt: "Associe chaque variable prédéfinie à son contenu.",
    pairs: [
      { left: "`CI_COMMIT_SHA`", right: "L'empreinte complète du commit" },
      { left: "`CI_COMMIT_BRANCH`", right: "Le nom de la branche courante" },
      { left: "`CI_DEFAULT_BRANCH`", right: "La branche par défaut du projet" },
      { left: "`CI_COMMIT_REF_SLUG`", right: "La référence nettoyée, utilisable dans un nom d'image" },
      { left: "`CI_REGISTRY_IMAGE`", right: "L'adresse du dépôt d'images du projet" },
    ],
    explanation:
      "`CI_COMMIT_REF_SLUG` transforme `feature/mon-truc` en `feature-mon-truc` : minuscules, sans caractère interdit, tronqué. C'est ce qu'il faut pour composer une balise d'image ou un nom d'environnement dynamique, là où `CI_COMMIT_BRANCH` brut serait refusé.",
  },
  {
    kind: "mcq",
    id: "devops-ci-21",
    difficulty: 2,
    tags: ["gitlab-ci", "variables"],
    prompt: "Quelle est la différence entre une variable **protégée** et une variable **masquée** ?",
    choices: [
      "Protégée : disponible seulement sur les branches et étiquettes protégées. Masquée : sa valeur est remplacée par des astérisques dans les journaux.",
      "Protégée : chiffrée au repos. Masquée : accessible aux seuls responsables du projet.",
      "Protégée : en lecture seule dans les jobs. Masquée : effacée après le pipeline.",
      "Les deux termes désignent la même chose, selon la version de GitLab.",
    ],
    answer: 0,
    explanation:
      "Ce sont deux protections indépendantes et complémentaires. La **protection** empêche qu'une branche quelconque, y compris issue d'une contribution externe, accède au secret de production. Le **masquage** empêche que la valeur apparaisse dans les journaux, y compris par un `echo` accidentel. Un secret de déploiement doit avoir les deux.",
  },
  {
    kind: "order",
    id: "devops-ci-22",
    difficulty: 2,
    tags: ["gitlab-ci", "stages"],
    prompt: "Remets dans l'ordre les stages d'un pipeline type pour une application Java conteneurisée.",
    items: [
      "build : compiler et produire le jar",
      "test : tests unitaires et d'intégration",
      "quality : analyse statique et quality gate",
      "package : construire et pousser l'image Docker",
      "deploy : déployer, en manuel sur la production",
    ],
    explanation:
      "L'ordre suit le coût croissant et la confiance croissante : on ne construit pas d'image si les tests échouent, et on ne déploie pas si la porte qualité est rouge. Placer le stage le plus rapide en premier fait remonter les échecs en quelques secondes plutôt qu'en plusieurs minutes.",
  },
  {
    kind: "recall",
    id: "devops-ci-23",
    difficulty: 2,
    tags: ["gitlab-ci", "runners"],
    prompt: "Qu'est-ce qu'un runner, et pourquoi chaque job repart-il d'un environnement vierge ?",
    explanation:
      "Un **runner** est l'agent qui exécute les jobs. Il est enregistré auprès de GitLab, interroge le serveur pour récupérer du travail, et l'exécute avec un **exécuteur** : `docker` le plus souvent, qui lance un conteneur neuf par job à partir de l'image demandée, mais aussi `shell`, `kubernetes` ou `docker+machine`. Chaque job repart d'un environnement vierge pour garantir la **reproductibilité** : aucun état résiduel d'un job précédent, aucune dépendance à l'ordre d'exécution, et donc un pipeline qui se comporte pareil chez tout le monde. Conséquence directe : rien ne se transmet implicitement d'un job à l'autre. Ce dont le job a besoin doit venir de l'image, être réinstallé, ou être déclaré explicitement en `artifacts` ou en `cache`. C'est la source de confusion la plus fréquente au début, quand on suppose à tort que le jar compilé au stage `build` sera encore là au stage `deploy`.",
    keyPoints: ["Agent qui exécute les jobs, exécuteur docker le plus courant", "Conteneur neuf par job", "Reproductibilité, pas d'état résiduel", "Rien ne se transmet sans `artifacts` ou `cache`"],
  },
];

// ---------------------------------------------------------------------------
// Leçon 4 — Cache, artifacts et parallélisation
// ---------------------------------------------------------------------------

const l4: Lesson = {
  kind: "lesson",
  id: "devops-ci-l4",
  title: "Cache, artifacts, services et needs",
  blocks: [
    {
      kind: "text",
      text: "Deux mécanismes se ressemblent et servent à des choses opposées. Le **cache** accélère : il conserve entre pipelines ce qui peut être reconstruit, typiquement `.m2/repository` ou `node_modules`. Il est **best-effort**, peut être vide ou périmé, et un job doit fonctionner sans lui.",
    },
    {
      kind: "text",
      text: "Les **artifacts** transmettent : ce qu'un job produit et dont un job **ultérieur** a besoin, comme le jar compilé. Ils sont garantis, téléchargeables depuis l'interface, et expirent selon `expire_in`. Un rapport de tests déclaré en `reports: junit` s'affiche directement dans la merge request.",
    },
    {
      kind: "code",
      language: "yaml",
      caption: "Cache pour les dépendances, artifact pour le livrable, service pour la base.",
      code: `build:
  stage: build
  cache:
    key: "$CI_COMMIT_REF_SLUG"
    paths: [.m2/repository]
  script:
    - ./mvnw -B package -DskipTests
  artifacts:
    paths: [target/app.jar]

it:
  stage: test
  needs: [build]
  services:
    - name: postgres:16
      alias: db
  variables:
    POSTGRES_DB: app
    POSTGRES_PASSWORD: secret
    # l'hôte est l'alias du service
    SPRING_DATASOURCE_URL: >-
      jdbc:postgresql://db:5432/app
  script:
    - ./mvnw -B verify`,
    },
    {
      kind: "text",
      text: "Un `service` démarre un conteneur à côté du job, joignable par son nom ou son `alias`. C'est ainsi qu'on obtient un Postgres réel pour les tests d'intégration. `needs` transforme la séquence de stages en graphe : un job démarre dès que ses dépendances sont finies, sans attendre tout son stage.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Piège",
      text: "Compter sur le cache pour transmettre un jar entre deux jobs finit toujours mal : le cache peut être absent, partagé entre branches ou périmé. Ce transfert est le rôle des artifacts.",
    },
  ],
};

const ex4: Exercise[] = [
  {
    kind: "mcq",
    id: "devops-ci-24",
    difficulty: 2,
    tags: ["gitlab-ci", "cache-vs-artifacts"],
    prompt: "Le stage `deploy` a besoin du jar produit au stage `build`. Quel mécanisme utiliser ?",
    choices: [
      "`artifacts` : c'est le transfert garanti d'un produit de job vers les jobs suivants.",
      "`cache` : il conserve les fichiers entre les jobs d'un même pipeline.",
      "Un volume Docker partagé entre les jobs.",
      "Rien : le répertoire de travail est conservé d'un stage à l'autre.",
    ],
    answer: 0,
    explanation:
      "Chaque job repart d'un conteneur neuf avec un clone frais du dépôt : rien de généré ne survit. Les `artifacts` sont téléversés à la fin du job producteur et automatiquement retéléchargés par les jobs des stages suivants. Le cache n'offre aucune garantie et sert à accélérer, pas à transmettre.",
  },
  {
    kind: "match",
    id: "devops-ci-25",
    difficulty: 2,
    tags: ["gitlab-ci", "cache-vs-artifacts"],
    prompt: "Associe chaque élément au mécanisme approprié.",
    pairs: [
      { left: "`.m2/repository`", right: "Cache : reconstructible, sert à accélérer" },
      { left: "`target/app.jar`", right: "Artifact : produit à transmettre au stage suivant" },
      { left: "Rapport JUnit XML", right: "Artifact `reports`, affiché dans la merge request" },
      { left: "`node_modules`", right: "Cache, avec une clé sur le fichier de verrouillage" },
      { left: "Image Docker construite", right: "Poussée dans le registry, ni cache ni artifact" },
    ],
    explanation:
      "La question à se poser : « si ce fichier disparaît, le job peut-il encore réussir ? » Si oui, c'est du cache. Sinon, c'est un artifact. Une image Docker ne relève d'aucun des deux : elle se pousse dans un registry, qui est fait pour ça.",
  },
  {
    kind: "spot",
    id: "devops-ci-26",
    difficulty: 2,
    tags: ["gitlab-ci", "services"],
    prompt: "Les tests d'intégration échouent avec « connection refused ». Trouve la ligne fautive.",
    code: {
      language: "yaml",
      code: `it:
  services:
    - name: postgres:16
      alias: db
  variables:
    SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/app
  script:
    - ./mvnw -B verify`,
    },
    faultyLine: 6,
    reasons: [
      "Un service est un conteneur distinct : il faut le joindre par son alias `db`, pas par `localhost`.",
      "Le port de Postgres dans un service GitLab est 5433, pas 5432.",
      "`services` doit être déclaré au niveau `default`, jamais dans un job.",
      "Il manque `image: postgres:16` en plus du service.",
    ],
    reasonAnswer: 0,
    explanation:
      "Avec l'exécuteur Docker, le service tourne dans son propre conteneur, relié au job par un réseau : `localhost` désigne le conteneur du job, où rien n'écoute. L'hôte est le nom du service ou son `alias`, ici `db`. Il faut aussi fournir `POSTGRES_DB` et `POSTGRES_PASSWORD`, sans quoi le conteneur refuse de démarrer.",
  },
  {
    kind: "output",
    id: "devops-ci-27",
    difficulty: 2,
    tags: ["gitlab-ci", "needs"],
    prompt: "Que change `needs: [build]` sur le job `it`, déclaré au stage `test` ?",
    code: {
      language: "yaml",
      code: `stages: [build, test, deploy]

build: { stage: build, script: [./build.sh] }
lint:  { stage: build, script: [./lint.sh] }

it:
  stage: test
  needs: [build]
  script: [./it.sh]`,
    },
    choices: [
      "`it` démarre dès que `build` est terminé, sans attendre `lint`.",
      "`it` attend que tout le stage `build` soit terminé, `needs` étant seulement documentaire.",
      "`it` change de stage et rejoint `build`.",
      "`it` est ignoré si `lint` échoue.",
    ],
    answer: 0,
    explanation:
      "`needs` remplace la barrière de stage par un graphe de dépendances : `it` ne dépend que de `build` et démarre sans attendre `lint`. C'est le principal levier pour raccourcir un pipeline. Effet de bord : `needs` détermine aussi de quels jobs les artifacts sont récupérés.",
  },
  {
    kind: "fill",
    id: "devops-ci-28",
    difficulty: 2,
    tags: ["gitlab-ci", "cache-vs-artifacts"],
    prompt: "Complète : accélérer avec le dépôt Maven, transmettre le jar au stage suivant.",
    code: {
      language: "yaml",
      code: `build:
  stage: build
  {{1}}:
    key: "$CI_COMMIT_REF_SLUG"
    paths: [.m2/repository]
  script:
    - ./mvnw -B package -DskipTests
  {{2}}:
    paths: [target/app.jar]
    {{3}}: 1 week`,
    },
    blanks: ["cache", "artifacts", "expire_in"],
    distractors: ["needs", "dependencies", "retention", "when"],
    explanation:
      "Le `cache` porte sur des dépendances reconstructibles, avec une clé qui détermine le partage : par branche ici, souvent par empreinte du fichier de verrouillage. Les `artifacts` transmettent le livrable, et `expire_in` limite la place occupée sur le serveur. Sans expiration, les artifacts s'accumulent indéfiniment.",
  },
  {
    kind: "recall",
    id: "devops-ci-29",
    difficulty: 3,
    tags: ["gitlab-ci", "docker", "images"],
    prompt: "Comment construire une image Docker depuis un job GitLab CI, et quelles sont les deux approches ?",
    explanation:
      "Le problème : le job tourne **déjà** dans un conteneur et n'a pas de démon Docker. Deux réponses. **docker:dind** (Docker in Docker) : on déclare `docker:dind` en service, on utilise l'image `docker` pour le job, et on renseigne `DOCKER_HOST` ainsi que les variables TLS. C'est la voie classique, mais elle exige le mode **privilégié** sur le runner, ce qui est un risque de sécurité réel, et le cache de couches repart de zéro à chaque job sauf configuration supplémentaire. **Kaniko**, alternative de Google, construit l'image **sans démon ni privilège**, directement depuis l'image `gcr.io/kaniko-project/executor`, en poussant vers le registry ; c'est la solution préférée sur les runners mutualisés et Kubernetes. Dans les deux cas, l'authentification passe par `CI_REGISTRY_USER` et `CI_REGISTRY_PASSWORD`, fournis automatiquement, et l'image est balisée avec `CI_COMMIT_SHA` pour la traçabilité plus une balise mouvante comme `latest` sur la branche par défaut. Le stage `package` vient après les tests : on ne publie que ce qui est vert.",
    keyPoints: ["Pas de démon Docker dans le job", "dind : service + mode privilégié, risque de sécurité", "Kaniko : sans démon ni privilège", "Auth via `CI_REGISTRY_USER` / `CI_REGISTRY_PASSWORD`", "Baliser avec `CI_COMMIT_SHA`"],
  },
  {
    kind: "recall",
    id: "devops-ci-30",
    difficulty: 2,
    tags: ["gitlab-ci", "environnements"],
    prompt: "Comment organiser un déploiement sûr, avec possibilité de revenir en arrière ?",
    explanation:
      "**Déclarer un `environment`** sur les jobs de déploiement : GitLab tient alors la liste des environnements et l'historique de ce qui y a été déployé, avec le commit correspondant. **Passer la production en `when: manual`** : le job apparaît dans le pipeline et attend un clic, ce qui laisse le choix du moment sans rejouer la chaîne. **Protéger l'environnement** pour que seules certaines personnes puissent déclencher ce job, et protéger les variables associées. **Déployer un artefact immuable**, une image balisée par `CI_COMMIT_SHA` plutôt que `latest`, sans quoi on ne sait plus ce qui tourne réellement. Le **retour arrière** découle de ces choix : comme chaque déploiement correspond à une image identifiée, redéployer la version précédente est immédiat, depuis la page de l'environnement ou en relançant le job du pipeline concerné. C'est bien plus rapide et sûr qu'un correctif d'urgence rédigé dans la panique. Ajouter `interruptible: true` sur les jobs longs pour qu'un nouveau push annule le pipeline devenu obsolète.",
    keyPoints: ["`environment` : historique et traçabilité", "`when: manual` pour la production", "Environnements et variables protégés", "Baliser par `CI_COMMIT_SHA`, jamais `latest`", "Retour arrière = redéployer l'image précédente"],
  },
];

// ---------------------------------------------------------------------------

export const chapter: Chapter = {
  id: "devops-git-gitlab-ci",
  title: "Git et GitLab CI : pipeline, cache, artifacts",
  objective:
    "Choisir entre merge et rebase, défaire sans rien perdre avec reset, revert et reflog, et écrire un pipeline GitLab qui distingue cache, artifacts et services.",
  prerequisites: ["docker-bases"],
  units: [l1, ...ex1, l2, ...ex2, l3, ...ex3, l4, ...ex4],
};
