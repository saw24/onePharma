require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔍 Endpoint: POST http://localhost:${PORT}/api/rechercher-produits`);
  console.log(`💚 Health: GET http://localhost:${PORT}/api/health`);
  console.log(`📍 Produits: http://localhost:${PORT}/api/update-products`);
  console.log(`📍 Points de vente: http://localhost:${PORT}/api/points-vente?page=1&limit=20&q=pharmacie`)
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  const pool = require('./src/config/database');
  await pool.end();
  process.exit(0);
});
