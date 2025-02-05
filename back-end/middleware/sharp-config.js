const sharp = require('sharp'); //Pour manipuler les images
const path = require('path'); //Module Node.js pour manipuler les chemins de fichiers et répertoires
const fs = require('fs').promises; // Pour suppression asynchrone

//Fonction middleware qui redimensionne et convertit une image
const resizeImage = async (req, res, next) => {
	//Vérification de la présence d'un fichier, si aucun n'est uploadé, on passe au middleware suivant
	if (!req.file) {
		return next();
	}
	//Extraction des informations du fichier : nom et chemin temporaire du fichier
	const { filename, path: filePath } = req.file;

	// Récupération du titre du livre depuis req.body.book
	const bookObject = JSON.parse(req.body.book);
	const title = bookObject.title;

	const userId = bookObject.userId;

	//Génération d'un timestamp
	const timestamp = Date.now();
	//Création d'un nouveau nom de fichier en extrayant le nom du fichier sans son extension et en ajoutant webp.
	const newFilename = `${title}-${userId}-${timestamp}.webp`;
	//Création du chemin où l'image redimensionnée sera enregistrée
	const outputPath = path.join('images', newFilename);

	//Redimensionnement et conversion
	try {
		await sharp(filePath)
			.resize(277, 456)
			.webp({ quality: 90 })
			.toFile(outputPath);

		try {
			//Suppression de l'ancien fichier
			await fs.unlink(filePath);
		} catch (error) {
			console.error(
				`Échec de la suppression de l'ancien fichier : ${error.message}`
			);
		}

		// Mise à jour des informations du fichier
		req.file.filename = newFilename;
		req.file.path = outputPath;
		req.file.mimetype = 'image/webp';

		next();

		//Gestion des erreurs
	} catch (error) {
		res.status(500).json({
			message: "Une erreur s'est produite lors du traitement de l'image.",
		});
	}
};

module.exports = resizeImage;
