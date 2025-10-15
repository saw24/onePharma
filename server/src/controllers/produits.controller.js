const produitsService = require('../services/produits.service');

exports.rechercherProduits = async (req, res, next) => {
  try {
    const { produits } = req.body;
    console.log('🔍 Recherche de produits:', produits);

    const resultats = await produitsService.rechercherProduits(produits);

    res.json({
      success: true,
      nb_points_vente: resultats.length,
      points_vente: resultats,
      metadata: {
        nb_produits_demandes: produits.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans le contrôleur:', error);
    next(error);
  }
};
