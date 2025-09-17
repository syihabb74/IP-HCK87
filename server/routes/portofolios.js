const PortofolioController = require('../controllers/PortofolioController')

const router = require('express').Router()


router.post('/portofolios', PortofolioController.getPortofolio);


module.exports = router