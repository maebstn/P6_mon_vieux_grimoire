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
	//Recherche utilisateur par email
	User.findOne({ email: req.body.email })
		.then((user) => {
			//Si email non trouvé
			if (!user) {
				return res
					.status(401)
					.json({ message: 'Identifiant et/ou mot de passe incorrects' });
			}
			//Comparaison mot de passe entre mot de passe fourni et le mot de passe haché
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					//Si mot de passe incorrecte
					if (!valid) {
						return res
							.status(401)
							.json({ message: 'Identifiant et/ou mot de passe incorrects' });
					}
					//Si valide création et envoie du token
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
							expiresIn: '24h',
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
