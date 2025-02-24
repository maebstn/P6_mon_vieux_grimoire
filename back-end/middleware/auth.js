const jwt = require('jsonwebtoken'); // Importe la bibliothèque jsonwebtoken pour générer des tokens JWT

module.exports = (req, res, next) => {
	try {
		// Extraction du token du header Authorization en séparant la chaîne en 2 parties et récupère la seconde
		const token = req.headers.authorization.split(' ')[1];
		// Vérification et décodage du token
		// 'RANDOM_TOKEN_SECRET' est la clé secrète utilisée pour signer le token
		//On s'assure que le token est valide et non expiré.
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		// Extraction de l'ID utilisateur du token décodé
		const userId = decodedToken.userId;
		// Ajout de l'ID utilisateur à l'objet de requête pour utilisation ultérieure
		req.auth = {
			userId: userId,
		};
		next();
		//Gestion des erreurs si token est invalide ou absent
	} catch (error) {
		res.status(401).json({ error });
	}
};
