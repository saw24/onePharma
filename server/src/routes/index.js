const express = require('express');
const router = express.Router();
const produitsRoutes = require('./produits.routes');
const healthRoutes = require('./health.routes');
const getPharmacies = require('./pointsvente.routes');
const productsUpdateRoutes = require('./products_update.routes');
const createPharmacy = require('./pointsvente.routes');
const updatePharmacy = require('./pointsvente.routes');
const deletePharmacy = require('./pointsvente.routes');

router.get('/', (req, res) => {
  res.json({
    message: 'API de recherche de produits',
    version: '1.0.0',
    endpoints: {
      recherche: 'POST /api/rechercher-produits',
      health: 'GET /api/health',
      pointsVente: 'GET /api/points-vente',
      updateProducts: 'POST /api/update-products',
      createPharmacy: 'POST /api/create-pharmacy',
      updatePharmacy: 'PUT /api/update-pharmacy/:id',
      deletePharmacy: 'DELETE /api/delete-pharmacy/:id',
    }
  });
});

// Utilisation des routes

router.use('/api', produitsRoutes);
router.use('/api', healthRoutes);
router.use('/api', productsUpdateRoutes);
router.use('/api', getPharmacies);
router.use('/api', createPharmacy);
router.use('/api', updatePharmacy);
router.use('/api', deletePharmacy );

// Routes spécifiques
/*router.use('/rechercher-produits', require('./rechercheProduits')); // Ancienne route
router.use('/health', require('./health')); // Ancienne route
router.use('/update-products', require('./updateProducts')); // Ancienne route
router.use('/points-vente', require('./pointsVente')); // Nouvelle route*/


module.exports = router;
