const router = require('express').Router();
const { errorHandling } = require('../middlewares/errorHandling');
const users = require('./users');
const markets = require('./markets');
const wallets = require('./wallets');
const authentication = require('../middlewares/authentication');

router.use(users);
router.use(authentication);
router.use(markets);
router.use(wallets);




router.use(errorHandling)
module.exports = router