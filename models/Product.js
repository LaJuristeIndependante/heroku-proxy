const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom du produit est obligatoire'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'La description du produit est obligatoire'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Le prix du produit est obligatoire'],
            min: 0,
        },
        pdfFile: {
            type: Buffer, // Stockage binaire pour le fichier PDF
            required: false,
        },
        profession: {
            type: mongoose.Schema.Types.ObjectId, // Référence à une autre collection
            ref: 'Profession',
            required: [true, 'La profession est obligatoire'],
        },
    },
    {
        timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    }
);

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
