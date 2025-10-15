const { updateProducts } = require('../services/products_update.service');

const handleUpdateProducts = async (req, res) => {
  try {
    const result = await updateProducts(req.body);
    return res.json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur lors de la mise à jour:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des produits',
      error: error.message
    });
  }
};

module.exports = { handleUpdateProducts };