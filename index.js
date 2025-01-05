const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Gestion des fichiers PDF pour `/api/products/:id/pdf`
app.get('/api/products/:id/pdf', (req, res) => {
    const { id } = req.params;

    // Chemin vers le fichier PDF basé sur l'id
    const pdfPath = path.join(__dirname, 'files', `${id}.pdf`);

    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfPath)) {
        console.error(`PDF introuvable pour l'id ${id}`);
        return res.status(404).json({ message: `PDF introuvable pour l'id ${id}` });
    }

    // Envoyer le fichier PDF avec les bons en-têtes
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`);
    res.sendFile(pdfPath, (err) => {
        if (err) {
            console.error(`Erreur lors de l'envoi du PDF pour l'id ${id} :`, err);
            res.status(500).json({ message: 'Erreur lors de l\'envoi du fichier PDF' });
        }
    });
});

// Route de test
app.get('/', (req, res) => {
    res.send('Le proxy fonctionne correctement.');
});

// Port par défaut ou défini par Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
