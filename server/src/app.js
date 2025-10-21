const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// CORS middleware
app.use(cors());
//app.use(express.json());
//app.use(express.static(path.join(__dirname, '../dist'))); // Pour servir le frontend buildé

// Configure body parser for larger payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Routes
app.use('/', routes);

// Route pour servir le frontend (fallback)
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});*/


// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
