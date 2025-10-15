const pointsVenteService = require('../services/pointsvente.service');

exports.listerPointsVente = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, q } = req.query; // pagination + recherche texte simple
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      q: q ? String(q) : null
    };

    const { rows, total } = await pointsVenteService.listerPointsVente(options);

    res.json({
      success: true,
      page: options.page,
      limit: options.limit,
      total,
      points_vente: rows
    });
  } catch (err) {
    next(err);
  }
};
