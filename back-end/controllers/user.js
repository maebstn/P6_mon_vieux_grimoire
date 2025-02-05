const bcrypt = require('bcrypt'); // Importe la bibliothèque bcrypt pour hacher les mots de passe
const jwt = require('jsonwebtoken'); // Importe la bibliothèque jsonwebtoken pour générer des tokens JWT

const User = require('../models/user');

//Fonction pour l'inscription des utilisateurs
exports.signup = (req, res, next) => {
	bcrypt // Utilise bcrypt pour hacher le mot de passe
		.hash(req.body.password, 10) // Hache le mot de passe fourni dans req.body.password avec un coût de 10
		.then((hash) => {
			// Si le hachage réussit, exécution de cette fonction avec le mot de passe haché
			const user = new User({
				// Création d'un nouvel utilisateur avec l'email et le mot de passe haché
				email: req.body.email, // Récupération de l'email depuis req.body.email
				password: hash, // Utilisation du mot de passe haché
			});
			user // Enregistrement de l'utilisateur dans la base de données
				.save()
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error })); // Si le hachage échoue, renvoie une réponse 500 avec l'erreur
};

//Fonction pour la connexion d'utilisateur déjà inscrits
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email }) // Recherche un utilisateur dans la base de données avec l'email fourni
		.then((user) => {
			// Si l'utilisateur est trouvé, exécute cette fonction
			if (!user) {
				// Si aucun utilisateur n'est trouvé
				res
					.status(401)
					.json({ message: 'Paire login/mot de passe incorrecte' });
			}
			bcrypt // Utilisation de bcrypt pour comparer le mot de passe fourni avec le mot de passe haché de l'utilisateur
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						// Si le mot de passe est incorrect
						return res // Renvoie une réponse 401 avec un message d'erreur
							.status(401)
							.json({ message: 'Paire login/mot de passe incorrecte' });
					}
					return res.status(200).json({
						// Si le mot de passe est correct, renvoie une réponse 200 avec l'ID de l'utilisateur et un token JWT
						userId: user._id, // Renvoie l'ID de l'utilisateur
						token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
							// Génère un token JWT contenant l'ID de l'utilisateur
							expiresIn: '24h',
						}),
					});
				})
				.catch((error) => res.status(500).json({ error })); // Si la comparaison échoue, erreur.
		})
		.catch((error) => res.status(500).json({ error })); // Si la recherche de l'utilisateur échoue, erreur.
};
