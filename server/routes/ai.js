const router = require('express').Router();
const AiController = require('../controllers/AiController')

router.post('/ai-markets', AiController.aiAnalyzeTopMarkets)
router.post('/ai-portofolio', AiController.Portofolio)



module.exports = router
