// src/services/pointsVenteService.js
const pool = require('../config/database');
//const { v4: uuidv4 } = require('uuid'); // npm install uuid
// Par ceci (nécessite Node.js >= 14.17.0)
//const crypto = require('crypto');

// Fonction pour générer un code_pv unique (ex: PV001, PV002, ...)
// ATTENTION: Cette méthode simple n'est pas thread-safe pour des insertions simultanées.
// Pour une solution robuste, voir Option 2 ou utilisez un trigger/sequence PostgreSQL.
const generateCodePv = async () => {
  try {
    let attempt = 1;
    const MAX_ATTEMPTS = 20; // Limite pour éviter une boucle infinie
    let newCode;
    let codeExists = true;
    // Récupérer le dernier code_pv inséré
      const result = await pool.query('SELECT code_pv FROM t_points_vente ORDER BY code_pv DESC LIMIT 1');
      let lastCode = result.rows[0]?.code_pv || 'PV000000'; // Valeur par défaut si aucune ligne n'existe
      // Extrait le numéro 
      let lastNumber = parseInt(lastCode.substring(2)); 

    while (codeExists && attempt < MAX_ATTEMPTS) {
      
      
      // Extrait le numéro de base
      let baseNumber = parseInt(lastCode.substring(2));
      
      // Génère un nouveau code unique en ajoutant un nombre aléatoire
      //const newNumber = (baseNumber + Math.floor(Math.random() * 1000)).toString().padStart(6, '0');
      let newNumber = baseNumber + 1;
      newNumber = newNumber.toString().padStart(6, '0');
      newCode = `PV${newNumber}`;

      // Vérifier si le code existe déjà
      const checkResult = await pool.query(
        'SELECT COUNT(*) AS count FROM t_points_vente WHERE code_pv = $1', 
        [newCode]
      );

      lastCode = newCode
      // Mettre à jour le statut d'existence du code
      codeExists = checkResult.rows[0].count > 0;

      // Ajouter une limite de sécurité pour éviter une boucle infinie
      if (codeExists) {
        console.log(`Code ${newCode} existe déjà, nouvelle tentative...`);
      }else{
        return newCode
      }
      attempt++;
    }

    

    // Si on dépasse le nombre maximum de tentatives
    throw new Error('Impossible de générer un code unique après ' + MAX_ATTEMPTS + ' tentatives');
  } catch (error) {
    console.error('Erreur lors de la génération du code_pv:', error);
    throw error;
  }
};



const getPharmacies = async (page, limit, searchQuery) => {
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM t_points_vente WHERE 1=1';
  const params = [];
  let countQuery = 'SELECT COUNT(*) FROM t_points_vente WHERE 1=1';

  if (searchQuery) {
    query += ' AND (nom_pv ILIKE $' + (params.length + 1) + ' OR adre_pv ILIKE $' + (params.length + 2) + ')';
    countQuery += ' AND (nom_pv ILIKE $' + (params.length + 1) + ' OR adre_pv ILIKE $' + (params.length + 2) + ')';
    params.push('%' + searchQuery + '%', '%' + searchQuery + '%');
  }

  query += ' ORDER BY nom_pv LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery, searchQuery ? ['%' + searchQuery + '%', '%' + searchQuery + '%'] : []);
    const total = parseInt(countResult.rows[0].count);

    return { rows: result.rows, total };
  } catch (error) {
    console.error('Erreur dans le service getPharmacies:', error);
    throw error;
  }
};

const createPharmacy = async (pharmacyData) => {
  const { nom_pv, tel_pv, adre_pv, latitude, longitude } = pharmacyData;

  // Génère le code_pv
  const code_pv = await generateCodePv();

  const query = `
    INSERT INTO t_points_vente (code_pv, nom_pv, tel_pv, adre_pv, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;

  const params = [code_pv, nom_pv, tel_pv, adre_pv, latitude, longitude];

  try {
    const result = await pool.query(query, params);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur dans le service createPharmacy:', error);
    throw error;
  }
};

const updatePharmacy = async (code_pv, pharmacyData) => {
  const { nom_pv, tel_pv, adre_pv, latitude, longitude } = pharmacyData;

  const query = `
    UPDATE t_points_vente
    SET nom_pv = $1, tel_pv = $2, adre_pv = $3, latitude = $4, longitude = $5
    WHERE code_pv = $6
    RETURNING *`;

  const params = [nom_pv, tel_pv, adre_pv, latitude, longitude, code_pv];

  try {
    const result = await pool.query(query, params);
    return result.rows[0]; // Retourne la pharmacie mise à jour ou null si non trouvée
  } catch (error) {
    console.error('Erreur dans le service updatePharmacy:', error);
    throw error;
  }
};

const deletePharmacy = async (code_pv) => {
  const query = 'DELETE FROM t_points_vente WHERE code_pv = $1'; // Assurez-vous que $1 est le code_pv
  const params = [code_pv];

  try {
    const result = await pool.query(query, params);
    return result.rowCount > 0; // Retourne true si une ligne a été supprimée
  } catch (error) {
    console.error('Erreur dans le service deletePharmacy:', error);
    throw error;
  }
};

module.exports = {
  getPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy
};