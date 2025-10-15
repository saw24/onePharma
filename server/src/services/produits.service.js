const pool = require('../config/database');

exports.rechercherProduits = async (produits) => {
  const client = await pool.connect();

  try {
    console.log('📡 Appel de la fonction PostgreSQL');
    const query = 'SELECT * FROM rechercher_produits($1::json)';
    const result = await client.query(query, [JSON.stringify(produits)]);
    console.log(`✅ ${result.rows.length} lignes retournées`);
    //console.log('Données:', result.rows);

    if (result.rows.length === 0) {
      return [];
    }

    return groupByPointVente(result.rows);
  } finally {
    client.release();
  }
};

function groupByPointVente(rows) {
  const pointsVente = {};

  rows.forEach(row => {
    if (!pointsVente[row.code_pv]) {
      pointsVente[row.code_pv] = {
        code_pv: row.code_pv,
        nom_pv: row.nom_pv,
        tel_pv: row.tel_pv,
        adre_pv: row.adre_pv,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        total_pv: row.total_pv ? parseFloat(row.total_pv) : 0,
        nb_produits_trouves: row.nb_produits_trouves ? parseInt(row.nb_produits_trouves) : 0,
        date_maj_stock: row.date_maj_stock || null,
        est_en_garde: row.est_en_garde || false,
        produits: []
      };
    }

    pointsVente[row.code_pv].produits.push({
      code_prdt: row.code_prdt,
      des_prdt: row.des_prdt,
      quantite_demandee: row.quantite_demandee ? parseInt(row.quantite_demandee) : 0,
      stock_dispo: row.stock_dispo ? parseInt(row.stock_dispo) : 0,
      prix_unitaire: row.prix_unitaire ? parseFloat(row.prix_unitaire) : 0,
      montant_produit: row.montant_produit ? parseFloat(row.montant_produit) : 0,
      score_pertinence: row.score_pertinence ? parseFloat(row.score_pertinence) : 0,
      type_resultat: row.type_resultat || 'unknown'
    });
  });

  return Object.values(pointsVente).sort((a, b) => {
    if (b.nb_produits_trouves !== a.nb_produits_trouves) {
      return b.nb_produits_trouves - a.nb_produits_trouves;
    }
    return b.total_pv - a.total_pv;


  });
}
