const http = require('../helpers/http');
const { Wallet } = require('../models');


class PortofolioController {

    static async getPortofolio(req, res, next) {

        try {


            const wallets = await Wallet.findAll({
                where: {
                    UserId: req.user.id
                }
            })

            let balanceWallet = [];

            for (const element of wallets) {
                const response = await http.moralis({
                    url: `/api/v2.2/wallets/${element.address}/net-worth`,
                    method: 'GET',
                    headers: {
                        [`X-API-Key`]: process.env.MORALIS_API_KEY
                    }
                })
                balanceWallet.push(response.data.total_networth_usd)
            }

            const totalBalance = balanceWallet.reduce((prev, curr) => +prev + +curr, 0);
            console.log(totalBalance)


            res.status(200).json(wallets);

        } catch (error) {

            next(error);

        }

    }

}


module.exports = PortofolioController;