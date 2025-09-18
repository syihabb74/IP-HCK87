const PortofolioController = require('../controllers/PortofolioController')

const router = require('express').Router()


router.get('/portofolios', PortofolioController.getPortofolio);


module.exports = router