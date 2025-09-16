const router = require('express').Router();
const MarketController = require('../controllers/MarketController');

router.get('/markets', MarketController.getMarketData);


module.exports = router