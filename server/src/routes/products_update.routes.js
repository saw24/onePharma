const express = require('express');
const router = express.Router();
const { handleUpdateProducts } = require('../controllers/products_update.controller');

router.post('/update-products', handleUpdateProducts);

module.exports = router;