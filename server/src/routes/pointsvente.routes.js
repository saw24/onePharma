// src/routes/pointsVente.js
const express = require('express');
const { getPharmacies, createPharmacy, updatePharmacy, deletePharmacy } = require('../controllers/pointsVenteController');
const router = express.Router();

// GET /api/points-vente?page=1&limit=20&q=pharmacie
router.get('/points-vente', getPharmacies);

// POST /api/points-vente
router.post('/points-vente', createPharmacy);

// PUT /api/points-vente/:code_pv
router.put('/points-vente/:code_pv', updatePharmacy);

// DELETE /api/points-vente/:code_pv
router.delete('/points-vente/:code_pv', deletePharmacy); 

module.exports = router; // <- CETTE LIGNE EST CRUCIALE
