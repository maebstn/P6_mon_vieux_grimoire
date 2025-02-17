const bcrypt = require('bcrypt'); // Importe la bibliothèque bcrypt pour hacher les mots de passe
const jwt = require('jsonwebtoken'); // Importe la bibliothèque jsonwebtoken pour générer des tokens JWT

const User = require('../models/user');

//Fonction pour l'inscription des utilisateurs
exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			return user.save();
		})
		.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
		.catch((error) => {
			console.log("Erreur lors de l'inscription:", error);
			let message = "Erreur lors de la création de l'utilisateur";
			let statusCode = 500;

			if (error.name === 'ValidationError') {
				message = "Données d'utilisateur invalides";
				statusCode = 400;
			} else if (error.code === 11000) {
				message = 'Cet email est déjà utilisé';
				statusCode = 400;
			}

			res.status(statusCode).json({ message: message });
		});
};

//Fonction pour la connexion d'utilisateur déjà inscrits
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res
					.status(401)
					.json({ message: 'Identifiant et/ou mot de passe incorrects' });
			}
			return bcrypt.compare(req.body.password, user.password).then((valid) => {
				if (!valid) {
					return res
						.status(401)
						.json({ message: 'Identifiant et/ou mot de passe incorrects' });
				}
				res.status(200).json({
					userId: user._id,
					token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
						expiresIn: '24h',
					}),
				});
			});
		})
		.catch((error) => {
			console.log('Erreur lors de la connexion:', error);
			res.status(500).json({ message: 'Erreur lors de la connexion' });
		});
};
