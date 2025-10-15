const pool = require('../config/database');

exports.listerPointsVente = async ({ page = 1, limit = 50, q = null }) => {
  const client = await pool.connect();
  try {
    const offset = (page - 1) * limit;
    const params = [];
    let whereClause = '';

    if (q) {
      params.push(`%${q}%`);
      // $1 referera au premier param, nous utiliserons le même param pour nom_pv et adre_pv
      whereClause = ` WHERE nom_pv ILIKE ${params.length} OR adre_pv ILIKE ${params.length}`;
    }

    // Ajout des paramètres pour LIMIT et OFFSET
    params.push(limit);
    const limitIndex = params.length; // index du param limit
    params.push(offset);
    const offsetIndex = params.length; // index du param offset

    const baseQuery = `
      SELECT code_pv, nom_pv, tel_pv, adre_pv, latitude, longitude
      FROM t_points_vente
      ${whereClause}
      ORDER BY nom_pv
      LIMIT ${limitIndex} OFFSET ${offsetIndex}
    `;

    const result = await client.query(baseQuery, params);

    // count total (pour pagination)
    let total;
    if (!q) {
      const cnt = await client.query('SELECT COUNT(*) FROM t_points_vente');
      total = parseInt(cnt.rows[0].count, 10);
    } else {
      const cnt = await client.query(
        'SELECT COUNT(*) FROM t_points_vente WHERE nom_pv ILIKE $1 OR adre_pv ILIKE $1',
        [`%${q}%`]
      );
      total = parseInt(cnt.rows[0].count, 10);
    }

    return { rows: result.rows, total };
  } finally {
    client.release();
  }
};

