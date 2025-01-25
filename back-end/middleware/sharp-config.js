const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const resizeImage = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const { filename, path: filePath } = req.file;
	const timestamp = Date.now();
	const newFilename = `${timestamp}-${path.parse(filename).name}.webp`;
	const outputPath = path.join('images', newFilename);

	try {
		await sharp(filePath)
			.resize(206, 260)
			.webp({ quality: 90 })
			.toFile(outputPath);

		// Supprimer l'ancien fichier
		await fs.unlink(filePath);

		// Mettre à jour les informations du fichier
		req.file.filename = newFilename;
		req.file.path = outputPath;
		req.file.mimetype = 'image/webp';

		next();
	} catch (error) {
		console.error('Sharp error:', error);
		next(error);
	}
};

module.exports = resizeImage;
