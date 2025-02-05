const http = require('http'); // Importation du module HTTP
const app = require('./app'); // Importation de l'application Express définie dans app.js

// Fonction pour normaliser le port et s'assurer qu'il est valide
const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

// Définit le port en utilisant une variable d'environnement ou 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestion des erreurs liées au serveur
const errorHandler = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Lorsqu'une erreur survient, la fonction errorHandler est appelée
server.on('error', errorHandler);

// Lorsque le serveur démarre et commence à écouter sur le port défini
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

// Démarrage du serveur en écoutant sur le port défini
server.listen(port);
