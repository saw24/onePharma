const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');
const { validateProduits } = require('../middlewares/validators');

router.post('/rechercher-produits', validateProduits, produitsController.rechercherProduits);

module.exports = router;
