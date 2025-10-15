const pool = require('../config/database');

const cleanProductName = (name) => {
  // Remove special characters, points, commas, apostrophes, +/- signs
  return name
    .normalize('NFD')  // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, '')  // Remove accent marks
    .replace(/[^\w\s]/g, '')  // Remove all special characters except letters, numbers, and spaces
    .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
    .trim();  // Remove leading and trailing whitespace
};

const updateProducts = async (jsonData) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Mise à jour de la table t_magasin
    const updateMagasinSql = `
      UPDATE t_points_vente 
      SET date_maj_stock = $1 
      WHERE code_pv = $2
    `;
    await client.query(updateMagasinSql, [
      jsonData.pointvente.datemaj,
      jsonData.pointvente.codemag
    ]);

    // 2. Supprimer les anciens produits du magasin
    const productCodes = jsonData.produits.map(p => p.codeprdt);
    if (productCodes.length > 0) {
      const deleteSql = `
        DELETE FROM t_produits 
        WHERE code_prdt = ANY($1) 
        AND code_pv = $2
      `;
      await client.query(deleteSql, [productCodes, jsonData.pointvente.codemag]);
    }

    // 3. Insérer les nouveaux produits
    const insertSql = `
      INSERT INTO t_produits 
      (code_pv, code_prdt, des_prdt, stock_dispo, cat_prdt, prix_unitaire) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const product of jsonData.produits) {
      // Convertir le prix en supprimant la virgule et en parsant comme float
      const prix = parseFloat(product.prixprdt.replace(',', ' '));
      
      // Clean the product name before insertion
      const cleanedProductName = cleanProductName(product.nomprdt);
      
      await client.query(insertSql, [
        jsonData.pointvente.codemag,
        product.codeprdt,
        cleanedProductName,  // Use cleaned product name
        parseInt(product.stockprdt),
        product.catprdt,
        //jsonData.pointvente.datemaj,
        prix
      ]);
    }

    await client.query('COMMIT');

    return {
      success: true,
      message: `Mise à jour réussie pour le magasin ${jsonData.pointvente.codemag}`,
      details: {
        magasin: jsonData.pointvente.codemag,
        dateMaj: jsonData.pointvente.datemaj,
        nbProduits: jsonData.produits.length
      }
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { updateProducts };
