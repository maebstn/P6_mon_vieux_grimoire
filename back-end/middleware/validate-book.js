const validateBook = (req, res, next) => {

	console.log('Headers:', req.headers);
	console.log('Body:', req.body);
	console.log('Files:', req.files);
	console.log('File:', req.file);
	try {
		let bookObject;
		if (typeof req.body.book === 'string') {
			bookObject = JSON.parse(req.body.book);
		} else {
			bookObject = req.body.book;
		}
		console.log('Données reçues:', req.body);
		console.log('Fichier reçu:', req.file);

		const { title, author, year, genre } = bookObject;

		// Vérification des champs requis
		if (!title || !author || !year || !genre) {
			return res
				.status(400)
				.json({ error: 'Tous les champs sont obligatoires' });
		}

		// Validation du titre
		if (!/^[a-zA-Z0-9 ]*$/.test(title)) {
			return res.status(400).json({
				error:
					'Le titre ne doit contenir que des lettres, des chiffres et des espaces',
			});
		}

		// Validation de l'auteur
		if (!/^[a-zA-Z ]*$/.test(author)) {
			return res.status(400).json({
				error:
					"Le nom de l'auteur ne doit contenir que des lettres et des espaces",
			});
		}

		// Validation de l'année
		const currentYear = new Date().getFullYear();
		if (isNaN(year) || year < 1000 || year > currentYear) {
			return res.status(400).json({
				error:
					"L'année doit être un nombre valide entre 1000 et l'année actuelle",
			});
		}

		// Validation du genre
		if (!/^[a-zA-Z ]*$/.test(genre)) {
			return res.status(400).json({
				error: 'Le genre ne doit contenir que des lettres et des espaces',
			});
		}

		// Si toutes les validations passent, on stocke l'objet validé pour le contrôleur
		req.bookObject = bookObject;
		next();
	} catch (error) {
		return res.status(400).json({ error: 'Format de données invalide' });
	}
};

module.exports = validateBook;
