const { ethplorer } = require("../helpers/http");
const { User, Wallet, Profile } = require("../models");


// https://deep-index.moralis.io/api/v2.2/:address/erc20 endpoint get token list

class WalletController {


  static async createWallet(req, res, next) {
    try {

      const userId = req.user.id;
      const { address } = req.body;
      const newWallet = await Wallet.create({ address, UserId: userId });
      res.status(201).json(newWallet);

    } catch (error) {

      next(error);

    }
  }

  static async getWallets(req, res, next) {
    try {

      const userId = req.user.id;
      const userAndWallets = await User.findByPk(userId, {
        include: [
          {
            model: Wallet,
            attributes: { exclude: ['createdAt', 'updatedAt', 'UserId'] }
          },
          {
            model: Profile,
            attributes: ['username']
          }
        ],
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      });
      res.status(200).json(userAndWallets);

    } catch (error) {

      next(error);

    }
  }

  static async editWallet(req, res, next) {
    try {

      const walletId = req.params.id;
      const { address, walletName } = req.body;
      const wallet = await Wallet.findByPk(walletId);
      const updatedWallet = await wallet.update({ address, walletName });
      res.status(200).json(updatedWallet);

    } catch (error) {

      next(error);

    }
  }

  static async deleteWallet(req, res, next) {
    try {

      const walletId = req.params.id;
      const wallet = await Wallet.findByPk(walletId);
      await wallet.destroy();
      res.status(200).json({ message: 'Wallet deleted successfully' });

    } catch (error) {

      next(error);

    }
  }


}

module.exports = WalletController;