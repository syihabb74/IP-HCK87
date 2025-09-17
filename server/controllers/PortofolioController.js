const {Wallet} = require('../models');


class PortofolioController {
    
   static async getPortofolio(req, res, next) {

        try {


            const wallets = await Wallet.findAll({where : {
                UserId : req.user.id
            }})
            res.status(200).json(wallets);

        } catch (error) {
            
            next(error);

        }

   }     

}   


module.exports = PortofolioController;