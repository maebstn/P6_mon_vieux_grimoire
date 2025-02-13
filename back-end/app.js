// Importation des modules nécessaires
const express = require('express'); // Framework pour créer un serveur Node.js
const mongoose = require('mongoose'); // Outil pour interagir avec MongoDB
const path = require('path'); // Module pour gérer les chemins de fichiers
require('dotenv').config(); //Chargement du fichier de configuration

const app = express(); // Création de l'application Express
// Importation des routes
const bookRoutes = require('./routes/book'); //Pour les livres
const userRoutes = require('./routes/user'); //Pour l'authentification utilisateur

// Connexion à MongoDB avec Mongoose
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour gérer les erreurs CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

// Middleware pour lire le JSON
app.use(express.json());

// Définition des routes API
app.use('/api/books', bookRoutes); //Pour gérer les livres
app.use('/api/auth', userRoutes); // Pour gérer les utilisateurs
app.use('/images', express.static(path.join(__dirname, 'images'))); //Pour les fichiers statiques (images uploadées)

// Exportation de l'application pour pouvoir l'utiliser dans server.js
module.exports = app;
