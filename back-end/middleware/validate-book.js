const validateBook = (req, res, next) => {
	const book = req.body; // les données envoyées dans le corps de la requête

	const isValidTitle = /^[A-Za-z0-9\s']+$/.test(book.title);
	const isValidAuthor = /^[A-Za-zÀ-ÿ\s']+$/.test(book.author);
	const isValidGenre = /^[A-Za-zÀ-ÿ\s']+$/.test(book.genre);
	const isValidYear = /^\d{4}$/.test(book.year);

	if (!isValidTitle || !isValidAuthor || !isValidGenre || !isValidYear) {
		console.log('Erreur :', "Le format saisi n'est pas autorisé.");

		return res.status(400).json({
			message: "Le format saisi n'est pas autorisé.",
		});
	}

	// Si tout est valide, on passe au contrôleur suivant
	next();
};

module.exports = validateBook;
