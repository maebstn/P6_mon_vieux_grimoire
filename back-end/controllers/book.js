// Importation du modèle Book
const Book = require('../models/book');
// Importation du module fs pour la gestion des fichiers
const fs = require('fs');

// Fonction pour récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
	// Recherche de tous les livres dans la base de données
	Book.find()
		// En cas de succès, renvoie tous les livres en JSON
		.then((books) => res.status(200).json(books))
		// En cas d'erreur, renvoie un statut 400 avec l'erreur
		.catch((error) => res.status(400).json({ error }));
};

// Fonction pour récupérer un livre par son ID
exports.getOneBook = (req, res, next) => {
	// Recherche d'un livre par son ID
	Book.findOne({ _id: req.params.id })
		// En cas de succès, renvoie le livre en JSON
		.then((book) => res.status(200).json(book))
		// En cas d'erreur, renvoie un statut 404 avec message d'erreur
		.catch((error) => res.status(404).json({ message: 'Livre non trouvé' }));
};

// Fonction pour ajouter un livre
exports.createBook = (req, res, next) => {
	// Parse l'objet book depuis le corps de la requête
	const bookObject = JSON.parse(req.body.book);
	// Supprime l'ID et l'userID envoyés par le front-end
	delete bookObject._id;
	delete bookObject._userID;

	// Crée une nouvelle instance de Book
	const book = new Book({
		//Création d'une copie du contenu de book
		...bookObject,
		// Définition de userID par l'ID de l'utilisateur authentifié extrait du token
		userId: req.auth.userId,
		// Construction de l'URL de l'image uploadée
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
		// Initialisation de la note moyenne à 0
		averageRating: 0,
		// Initialisation du tableau des notes comme vide
		ratings: [],
	});
	// Sauvegarde le livre dans la base de données
	book
		.save()
		// En cas de succès, renvoie un statut 201 avec un message
		.then(() => res.status(201).json({ message: 'Livre enregistré !' }))
		// En cas d'erreur, renvoie un statut 400 avec l'erreur
		.catch((error) => res.status(400).json({ error }));
};

//Fonction pour modifier un livre existant
exports.updateBook = (req, res, next) => {
	//Préparation du livre à mettre à jour
	const bookObject = req.file
		? //Si le fichier est uploadé :
		  {
				//Copie de toutes les propriétés du livre depuis le corps de la requête
				...JSON.parse(req.body.book),
				//Construction de l'URL de la nouvelle image uploadée
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
		  }
		: //Copie de toutes les propriétés du corps de la requête si pas de fichier uploadé
		  { ...req.body };
	//Suppression de l'userId pour des raisons de sécurité
	delete bookObject._userId;
	//Recherche du livre et vérification de l'autorisation
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				res
					.status(401)
					.json({ message: "Vous n'êtes pas autorisé à modifier le livre" });
			} else {
				//Mise à jour du livre
				Book.updateOne(
					{ _id: req.params.id },
					{ ...bookObject, _id: req.params.id }
				)
					.then(() => res.status(200).json({ message: 'Livre modifié!' }))
					.catch((error) => res.status(401).json({ error }));
			}
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

//Fonction pour attribuer une note à un livre
exports.rateBook = async (req, res, next) => {
	try {
		const { id } = req.params; // ID du livre
		const { rating } = req.body; // Note donnée par l'utilisateur
		const userId = req.auth.userId; // ID de l'utilisateur authentifié

		// Vérification si le livre existe
		const book = await Book.findById(id);
		if (!book) {
			return res.status(404).json({ message: 'Livre non trouvé' });
		}

		// Validation de la note
		if (rating < 0 || rating > 5) {
			return res
				.status(400)
				.json({ message: 'La note doit être entre 0 et 5' });
		}

		//Vérification si l'utilisateur a déjà noté ce livre
		const existingRating = book.ratings.find(
			(r) => r.userId.toString() === userId
		);
		if (existingRating) {
			return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
		}

		// Ajout de la nouvelle note
		book.ratings.push({ userId, grade: rating });

		// Recalcul de la moyenne
		const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
		book.averageRating = (totalRatings / book.ratings.length).toFixed(1);

		// Sauvegarde des modifications
		await book.save();

		// Renvoie du livre mis à jour
		res.status(200).json(book);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
	// Recherche du livre à supprimer par son ID
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			// Vérifie si l'utilisateur est autorisé à supprimer le livre
			if (book.userId != req.auth.userId) {
				// Si non autorisé, renvoie un statut 403un message
				res
					.status(401)
					.json({ message: "Vous n'êtes pas autorisé à supprimer ce livre." });
			} else {
				// Extrait le nom du fichier image
				const filename = book.imageUrl.split('/images/')[1];
				// Supprime le fichier image
				fs.unlink(`images/${filename}`, () => {
					// Supprime le livre de la base de données
					Book.deleteOne({ _id: req.params.id })
						// En cas de succès, renvoie un statut 200 avec un message
						.then(() => {
							res.status(200).json({ message: 'Objet supprimé !' });
						})
						// En cas d'erreur, renvoie un statut 401 avec l'erreur
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		// Si le livre n'est pas trouvé, renvoie un statut 404 avec l'erreur
		.catch((error) => {
			res.status(500).json({ error });
		});
};

// Fonction pour récupérer les 3 meilleurs livres
exports.getBestRating = async (req, res, next) => {
	try {
		//Recherche des livres, triés par note moyenne décroissante, limités à 3
		const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);

		// Vérification si des livres ont été trouvés
		if (bestBooks.length === 0) {
			return res.status(404).json({ message: 'Aucun livre trouvé' });
		}

		// Envoi des 3 meilleurs livres en réponse
		res.status(200).json(bestBooks);
	} catch (error) {
		res.status(500).json({ error });
	}
};
