---
title: "Clashrun tool for playing clash of code locally"
date: 2025-01-04
categories: [TUTO,PROGRAMMING]
tags: [cybersécurité, CTF, hacking, writeup,Tools,tuto,programing]
---

Clashrun est un outil en ligne de commande que j'ai développé pour jouer à Clash of Code localement. Inspiré par [CodinGame](https://www.codingame.com/start/), cet outil permet de s'entraîner aux challenges de programmation directement depuis le terminal, sans connexion Internet.

---

### Fonctionnalités Clés :  
Clashrun présente trois modes de jeu :

#### Mode Fastest :  
Ce mode teste la capacité du joueur à résoudre les problèmes rapidement, d'où le nom "Fastest". Personnellement, j'aime bien ce mode parce qu'il évalue ma rapidité à trouver des solutions efficaces aux problèmes.

<div style="text-align: center;">
    <img src="/assets/Images/fastest.png" alt="Clashrun in action" style="max-width: 80%; border-radius: 10px;">
</div>

#### Mode Shortest :  
Il s'agit de tester la capacité du joueur non pas à résoudre rapidement le problème, mais à le résoudre avec le moins de caractères possible, ce qu'on appelle le code golfing. Généralement, ceux qui utilisent Ruby, Python ou même Bash s'en sortent mieux que ceux qui utilisent des langages plus verbeux comme Java ou C.  
Le joueur a la possibilité de définir sa propre limite de caractères à ne pas dépasser.

<div style="text-align: center;">
    <img src="/assets/Images/shortest.png" alt="Clashrun in action" style="max-width: 80%; border-radius: 20px;">
</div>

#### Mode Reverse :  
On dit toujours "le meilleur pour la fin". C'est celui que je préfère parmi tous. C'est un véritable Black Box : aucune information sur le problème, rien. Tout ce que l'utilisateur connaît, ce sont les entrées et les sorties. C'est à lui de deviner ce qu'il faut faire.  
Je pense que c'est le mode le plus adapté aux hackers : trouver un moyen de deviner les failles des systèmes même lorsqu'on n'a pas accès au code source.

<div style="text-align: center;">
    <img src="/assets/Images/reverse.png" alt="Clashrun in action" style="max-width: 80%; border-radius: 20px;">
</div>

### Comment jouer  
L'interface est très intuitive.  
Il n'y a en gros que trois commandes à retenir :  
- La commande `clash` :  
Choisit aléatoirement un mode parmi les trois et vous présente les énoncés.  
- La commande `open` :  
Ouvre automatiquement un éditeur de texte afin que vous puissiez écrire vos solutions.  
- La commande `run` :  
Une fois la solution implémentée, vous devez la tester. En exécutant `run`, l'outil teste votre solution.  

### Défis  
Évidemment, j'ai rencontré des difficultés en développant ce projet.  
La première étape consistait à évaluer la faisabilité en utilisant du web scraping sur le site CodinGame pour analyser son comportement en fonction des actions des utilisateurs.  
Je n'ai pas trouvé d'API intéressante qui pouvait me fournir les informations recherchées.  
La deuxième difficulté concernait l'implémentation. Il fallait explorer les possibilités offertes par Python pour savoir comment m'y prendre. Cela m'a pris une semaine au total.  
J'avoue, je suis fier de moi.  

### Limites  
Pour le moment, la plateforme ne prend pas en charge les langages compilés. J'ai simplement voulu la rendre compatible avec les langages de script comme Python et ses semblables.  
Toute contribution serait la bienvenue. Consultez directement le dépôt GitHub [ici](https://github.com/Scriptmagum/ClashRun/tree/main).  

### Contact  
Si vous souhaitez me contacter, pinguez moi sur le resau franco-russe [Telegram](https://t.me/Mtrcraft).  
