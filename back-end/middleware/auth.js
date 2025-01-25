const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		// Extraction du token du header Authorization
		const token = req.headers.authorization.split(' ')[1];
		// Vérification et décodage du token
		// 'RANDOM_TOKEN_SECRET' est la clé secrète utilisée pour signer le token
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		// Extraction de l'ID utilisateur du token décodé
		const userId = decodedToken.userId;
		// Ajout de l'ID utilisateur à l'objet de requête pour utilisation ultérieure
		req.auth = {
			userId: userId,
		};
		next();
	} catch (error) {
		res.status(401).json({ error });
	}
};
