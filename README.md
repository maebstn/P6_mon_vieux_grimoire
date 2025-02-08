# MON VIEUX GRIMOIRE

## LANCEMENT DU PROJET

### Installation

- Clonez le projet avec la commande `git clone https://github.com/maebstn/P6_mon_vieux_grimoire.git`.
- Ouvrez le dossier avec la commande `cd P6_mon_vieux_grimoire`

### Back-end

- Ouvrez le dossier back-end avec la commande `cd backend`.
- Installez les dépendances avec la commande `npm install --legacy-peer-deps`.

- Créez un compte MongoDB Atlas en vous rendant sur https://www.mongodb.com/atlas/database.
- Inscrivez-vous et connectez-vous sur votre compte.
- Créez un cluster en choisissant l'option ASW et uniquement les options gratuites.
- Créez un utilisateur avec un mot de passe sécurisé en allant dans `Database Access`. Conservez-les pour la suite.
- Dans l'onglet `Network Access`, cliquez sur Add IP Adress et autorisez l'accès depuis n'importe où (Add access from Anywhere).

- Ensuite, créez un fichier .env dans le dossier et ajoutez une variable d'environnement appelée MONGO_URI. Elle sera égale à la chaîne de connexion fournie dans l'onglet 'Connect' de votre Cluster. Voici un exemple :
  `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<databaseName>?retryWrites=true&w=majority&appName=Cluster`
  ⚠️ N'oubliez pas de remplacer <username> et <password> par vos identifiants mais également de ne jamais partager votre fichier .env.

- Lancez ensuite le serveur dans le terminal avec la commande 'nodemon server'.

### Front-end

- Ouvrez le dossier front-end avec la commande `cd frontend`
- Installez les dépendances avec la commande `npm install`.
- Lancer le projet avec la commande `npm start`.
