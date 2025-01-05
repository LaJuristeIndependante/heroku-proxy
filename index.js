const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Gestion de la route racine `/api/products`
app.all('/api/products', (req, res) => {
    console.log(`Requête racine reçue : ${req.method} ${req.url}`);
    res.json({ message: 'Requête traitée pour la route racine /api/products' });
});

// Gestion des sous-routes `/api/products/:path*`
app.all('/api/products/*', (req, res) => {
    console.log(`Requête sous-route reçue : ${req.method} ${req.url}`);
    res.json({ message: `Requête traitée pour la sous-route ${req.url}` });
});

// Port par défaut ou celui défini par Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
