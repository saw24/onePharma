const pool = require('../config/database');

exports.checkHealth = async (req, res, next) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    res.json({
      success: true,
      message: 'Connexion à la base de données OK',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur health check:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: error.message
    });
  }
};
