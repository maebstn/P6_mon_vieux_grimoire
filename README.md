# MON VIEUX GRIMOIRE

## LANCEMENT DU PROJET

### Installation

- Clonez le projet avec la commande `git clone https://github.com/maebstn/P6_mon_vieux_grimoire.git`.
- Ouvrez le dossier avec la commande `cd P6_mon_vieux_grimoire`

### Back-end

- Ouvrez le dossier back-end avec la commande `cd backend`.
- Installez les dépendances avec la commande `npm install`.

- Créez un compte MongoDB Atlas en vous rendant sur https://www.mongodb.com/atlas/database.
- Inscrivez-vous et connectez-vous sur votre compte.
- Créez un cluster en choisissant l'option ASW et uniquement les options gratuites.
- Créez un utilisateur avec un mot de passe sécurisé en allant dans `Database Access`. Conservez-les pour la suite.
- Dans l'onglet `Network Access`, cliquez sur Add IP Adress et autorisez l'accès depuis n'importe où (Add access from Anywhere).

- Ensuite, créez un fichier .env dans le dossier et ajoutez :
  `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<databaseName>?retryWrites=true&w=majority&appName=Cluster`

- Remplacez <username> et <password>par vos identifiants et <databaseName> par le nom de votre base.
  ⚠️ Ne partagez jamais votre fichier .env et vérifiez qu'il figure bien dans le fichier .gitignore!

- Lancez ensuite le serveur dans le terminal avec la commande 'nodemon server'.

### Front-end

- Ouvrez le dossier front-end avec la commande `cd frontend`
- Installez les dépendances avec la commande `npm install`.
- Lancer le projet avec la commande `npm start`.
