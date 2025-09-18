const router = require('express').Router();
const WalletController = require('../controllers/WalletController');
const authorization = require('../middlewares/authorization');

router.get('/wallets', WalletController.getWallets);
router.post('/wallets', WalletController.createWallet);
router.put('/wallets/:id', authorization, WalletController.editWallet);
router.delete('/wallets/:id', authorization, WalletController.deleteWallet);

module.exports = router