const express = require('express');
const router = express.Router();
const produitsRoutes = require('./produits.routes');
const healthRoutes = require('./health.routes');
const pointsVenteRoutes = require('./pointsvente.routes');
const productsUpdateRoutes = require('./products_update.routes');

router.get('/', (req, res) => {
  res.json({
    message: 'API de recherche de produits',
    version: '1.0.0',
    endpoints: {
      recherche: 'POST /api/rechercher-produits',
      health: 'GET /api/health',
      pointsVente: 'GET /api/points-vente',
      updateProducts: 'POST /api/update-products'
    }
  });
});

router.use('/api', produitsRoutes);
router.use('/api', healthRoutes);
router.use('/api', productsUpdateRoutes);
router.use('/api', pointsVenteRoutes);


module.exports = router;
