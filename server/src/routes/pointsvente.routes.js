const express = require('express');
const router = express.Router();
const pointsVenteController = require('../controllers/pointsvente.controller');

router.get('/points-vente', pointsVenteController.listerPointsVente);

module.exports = router;
