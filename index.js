const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Route pour capturer toutes les sous-routes de /api/products
app.all('/api/products/*', (req, res) => {
    console.log(`Requête reçue : ${req.method} ${req.url}`);
    res.json({ message: `Requête traitée avec succès pour ${req.url}` });
});

// Port par défaut ou celui défini par Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
