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

// Route POST pour ajouter un produit
app.post('/api/product', async (req, res) => {
    try {
        const { name, description, price, profession, pdfFile } = req.body;

        // Validation des données
        if (!name || !description || !price || !profession) {
            return res.status(400).json({ message: 'Tous les champs requis doivent être remplis.' });
        }

        const newProduct = new Product({ name, description, price, profession, pdfFile });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Erreur lors de la création du produit:', err);
        res.status(500).json({ message: 'Erreur interne lors de la création du produit' });
    }
});

// Route PUT pour modifier un produit par ID
app.patch('/api/products/:id', upload.none(), async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `ID invalide : ${id}` });
        }

        const updates = req.body;
        console.log('ID reçu:', id);
        console.log('Données reçues pour mise à jour:', updates);

        // Vérifier la connexion à MongoDB
        if (!mongoose.connection.readyState) {
            console.error('Connexion à MongoDB non établie');
            return res.status(500).json({ message: 'Problème de connexion à la base de données' });
        }

        // Trouver et mettre à jour le produit
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: `Produit introuvable pour l'id ${id}` });
        }

        console.log('Produit mis à jour :', updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Erreur lors de la mise à jour du produit:', err);
        res.status(500).json({ message: 'Erreur interne lors de la mise à jour du produit' });
    }
});

// Route DELETE pour supprimer un produit par ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver et supprimer le produit
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: `Produit introuvable pour l'id ${id}` });
        }

        res.status(200).json({ message: 'Produit supprimé avec succès', deletedProduct });
    } catch (err) {
        console.error('Erreur lors de la suppression du produit:', err);
        res.status(500).json({ message: 'Erreur interne lors de la suppression du produit' });
    }
});

// Port par défaut ou défini par Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

//test
