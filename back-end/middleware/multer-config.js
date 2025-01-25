const multer = require('multer');

//Définition des types MIME aiorisés pour les images
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'images/png': 'png',
};

//Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
	//Fonction pour définir le dossier de destination du fichier
	destination: (req, file, callback) => {
		callback(null, './images'); // NUll signifie qu'il n'y a pas d'erreur
	},
	//Fonction pour définir le nom du fichier téléchargé
	filename: (req, file, callback) => {
		//Sur le nom initial, on supprime les espaces et on les remplaces par des underscores
		const name = file.originalname.split(' ').join('_');
		//On récupère l'extension du fichier depuis le mime type
		const extension = MIME_TYPES[file.mimetype];
		//On génère le nom du fichier en ajoutant le timestamp actuel
		callback(null, name + Date.now() + '.' + extension);
	},
});

//Exportation de multer avec la configuration de stockage
//en spécifiant que l'on veut un seul fichier dans le champ image
module.exports = multer({ storage: storage }).single('image');
