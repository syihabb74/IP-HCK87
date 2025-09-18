const router = require('express').Router();
const AiController = require('../controllers/AiController')

router.post('/ai-markets', AiController.aiAnalyzeTopMarkets)



module.exports = router
