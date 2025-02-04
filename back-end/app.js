const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

mongoose
	.connect(
		'mongodb+srv://maebstn:xNhQISEzJporJW5C@cluster0.grjvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
