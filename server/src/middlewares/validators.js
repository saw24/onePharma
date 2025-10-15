exports.validateProduits = (req, res, next) => {
  const { produits } = req.body;

  if (!produits || !Array.isArray(produits)) {
    return res.status(400).json({
      success: false,
      message: 'Le paramètre "produits" doit être un tableau',
      exemple: {
        produits: [
          { nom_produit: "Paracétamol", quantite: 10 },
          { nom_produit: "Aspirine", quantite: 5 }
        ]
      }
    });
  }

  for (let i = 0; i < produits.length; i++) {
    const p = produits[i];

    if (!p.nom_produit || typeof p.nom_produit !== 'string') {
      return res.status(400).json({
        success: false,
        message: `Produit ${i + 1}: "nom_produit" est requis et doit être une chaîne`
      });
    }

    if (!p.quantite || typeof p.quantite !== 'number' || p.quantite <= 0) {
      return res.status(400).json({
        success: false,
        message: `Produit ${i + 1}: "quantite" est requis et doit être un nombre positif`
      });
    }
  }

  next();
};
