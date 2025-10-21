// src/controllers/pointsVenteController.js
const pointsVenteService = require('../services/pointsVenteService');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');

// Validation pour la création/mise à jour
const validatePharmacy = [
  body('nom_pv').trim().isLength({ min: 1 }).withMessage('Le nom est requis.'),
  body('tel_pv').trim().isLength({ min: 1 }).withMessage('Le téléphone est requis.'),
  body('adre_pv').trim().isLength({ min: 1 }).withMessage('L\'adresse est requise.'),
  body('latitude').isFloat().withMessage('La latitude doit être un nombre.'),
  body('longitude').isFloat().withMessage('La longitude doit être un nombre.'),
  body('est_en_garde').optional().isBoolean().withMessage('En garde doit être un booléen.'),
];

const getPharmacies = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Données invalides', errors: errors.array() + error.message });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const searchQuery = req.query.q || '';

    const result = await pointsVenteService.getPharmacies(page, limit, searchQuery);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getPharmacies:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des pharmacies.' + error.message });
  }
};

const createPharmacy = [
  ...validatePharmacy, // Applique les validations
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Données invalides', errors: errors.array() + error.message });
      }

      const { nom_pv, tel_pv, adre_pv, latitude, longitude, est_en_garde } = req.body;

      const newPharmacy = await pointsVenteService.createPharmacy({
        nom_pv,
        tel_pv,
        adre_pv,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        //est_en_garde: Boolean(est_en_garde) // S'assure que c'est un booléen
      });

      res.status(201).json({ success: true, data: newPharmacy });
    } catch (error) {
      console.error('Erreur dans le contrôleur createPharmacy:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur lors de la création de la pharmacie.' + error.message });
    }
  }
];

const updatePharmacy = [
  ...validatePharmacy, // Applique les validations
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Données invalides', errors: errors.array() + error.message });
      }

      const code_pv = req.params.code_pv;
      const { nom_pv, tel_pv, adre_pv, latitude, longitude, est_en_garde } = req.body;

      const updatedPharmacy = await pointsVenteService.updatePharmacy(code_pv, {
        nom_pv,
        tel_pv,
        adre_pv,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        //est_en_garde: Boolean(est_en_garde) // S'assure que c'est un booléen
      });

      if (!updatedPharmacy) {
        return res.status(404).json({ success: false, message: 'Pharmacie non trouvée. pour: ' + code_pv  });
      }

      res.json({ success: true, data: updatedPharmacy });
    } catch (error) {
      console.error('Erreur dans le contrôleur updatePharmacy:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour de la pharmacie.' + error.message });
    }
  }
];

const deletePharmacy = async (req, res) => {
  try {
    const code_pv = req.params.code_pv;

    const deleted = await pointsVenteService.deletePharmacy(code_pv);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Pharmacie non trouvée. pour: ' + code_pv });
    }

    res.json({ success: true, message: 'Pharmacie supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur dans le contrôleur deletePharmacy:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression de la pharmacie.' + error.message });
  }
};

module.exports = {
  getPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy
};