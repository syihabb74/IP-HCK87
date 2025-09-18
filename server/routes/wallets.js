const router = require('express').Router();
const WalletController = require('../controllers/WalletController');

router.get('/wallets', WalletController.getWallets);
router.post('/wallets', WalletController.createWallet);
router.put('/wallets/:id', WalletController.editWallet);
router.delete('/wallets/:id', WalletController.deleteWallet);

module.exports = router