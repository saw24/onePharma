const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// CORS middleware
app.use(cors());
//app.use(express.json());

// Configure body parser for larger payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Routes
app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
