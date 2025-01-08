const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.get('/api/products/:id?', async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            // Trouver un produit spécifique par ID
            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ message: `Produit introuvable pour l'id ${id}` });
            }

            res.status(200).json(product);
        } else {
            // Retourner tous les produits si aucun ID n'est fourni
            const products = await Product.find();
            res.status(200).json(products);
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        res.status(500).json({ message: 'Erreur interne lors de la récupération des produits' });
    }
});

// Route pour télécharger un fichier PDF
app.get('/api/products/:id/pdf', async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver le produit dans la base MongoDB
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: `Produit introuvable pour l'id ${id}` });
        }

        if (!product.pdfFile) {
            return res.status(404).json({ message: `PDF introuvable pour l'id ${id}` });
        }

        // Échapper le nom du fichier pour éviter les caractères invalides
        const safeFileName = encodeURIComponent(product.name);

        // Envoyer le fichier PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}.pdf"`);
        res.send(product.pdfFile);
    } catch (err) {
        console.error(`Erreur lors de la récupération du PDF pour l'id ${req.params.id}:`, err);
        res.status(500).json({ message: 'Erreur interne lors de la récupération du PDF' });
    }
});

// Port par défaut ou défini par Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
