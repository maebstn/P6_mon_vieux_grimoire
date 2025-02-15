const validateBook = (req, res, next) => {
	const book = JSON.parse(req.body.book); // Ici on parse la chaîne JSON en objet

	const isValidTitle = /^[A-Za-zÀ-ÿ0-9\s']+$/.test(book.title);
	const isValidAuthor = /^[A-Za-zÀ-ÿ\s']+$/.test(book.author);
	const isValidGenre = /^[A-Za-zÀ-ÿ\s']+$/.test(book.genre);

	if (!isValidTitle || !isValidAuthor || !isValidGenre) {
		console.log('Erreur :', "Le format saisi n'est pas autorisé.");

		return res.status(400).json({
			message: "Le format saisi n'est pas autorisé.",
		});
	}

	// Si tout est valide, on passe au contrôleur suivant
	next();
};

module.exports = validateBook;
