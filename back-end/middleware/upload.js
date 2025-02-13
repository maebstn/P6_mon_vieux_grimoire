const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const Book = require('../models/book');
const fs = require('fs').promises;

// Définition des types MIME autorisés pour les images
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
	// Fonction pour définir le dossier de destination du fichier
	destination: (req, file, callback) => {
		callback(null, './images');
	},
	// Fonction pour définir le nom du fichier téléchargé
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_'); //Remplace les espaces par des _
		const extension = MIME_TYPES[file.mimetype]; //Associe le type MIME du fichier à l'extension correspondante
		callback(null, name + Date.now() + '.' + extension); //Définit le nom avec Date.now en timeStamp
	},
});

// Fonction middleware pour redimensionner et convertir l'image
const resizeImage = async (req, res, next) => {
	//Vérification de l'existance du fichier
	if (!req.file) {
		return next();
	}

	// Récupération du chemin du fichier temporaire et du titre du livre
	const { path: filePath, filename } = req.file;
	const { title, userId } = JSON.parse(req.body.book);

	// Génération du nom de fichier pour la nouvelle image (webp)
	const timestamp = Date.now();
	const withoutSpaceTitle = title.trim().split(' ').join('_');
	const newFilename = `${withoutSpaceTitle}-${userId}-${timestamp}.webp`;
	const outputPath = path.join('images', newFilename);

	// Si une ancienne image existe, on la supprime avant de traiter la nouvelle
	if (req.params.id) {
		// Récupérer l'ancienne image depuis la base de données
		const book = await Book.findById(req.params.id);
		if (book && book.imageUrl) {
			const oldImagePath = book.imageUrl.split('/images/')[1];
			try {
				await fs.unlink(`images/${oldImagePath}`);
			} catch (err) {
				console.error(
					"Erreur lors de la suppression de l'ancienne image:",
					err
				);
			}
		}
	}

	// Redimensionnement et conversion de l'image avec Sharp
	try {
		await sharp(filePath)
			.resize(277, 456)
			.webp({ quality: 90 })
			.toFile(outputPath);

		// Suppression de l'ancienne image si elle existe
		await fs.unlink(filePath);

		// Mise à jour des informations du fichier dans req.file
		req.file.filename = newFilename;
		req.file.path = outputPath;
		req.file.mimetype = 'image/webp';

		next();
	} catch (error) {
		res.status(500).json({
			message: "Une erreur s'est produite lors du traitement de l'image.",
		});
	}
};

// Exportation de multer avec la configuration de stockage et du middleware de redimensionnement
module.exports = {
	upload: multer({ storage: storage }).single('image'),
	resizeImage,
};
