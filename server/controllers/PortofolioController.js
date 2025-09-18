const http = require('../helpers/http');
const { Wallet } = require('../models');


class PortofolioController {

    static async getPortofolio(req, res, next) {

        try {
            let {wallets} = req.query
            if (!wallets) {
                return next({name: 'NotFound', message: 'You dont have any wallet yet please connect first'});
            }

            wallets = wallets.split(',').map(address => ({ address: address.trim() }));
            let balanceWallet = [];
            let nativeAndToken = [];

            for (const element of wallets) {
                try {
                    // Fetch net worth for the wallet
                    const responseNetWorth = await http.moralis({
                        url: `/api/v2.2/wallets/${element.address}/net-worth`,
                        method: 'GET',
                        headers: {
                            'X-API-Key': process.env.MORALIS_API_KEY
                        }
                    });

                    // Fetch tokens for the wallet
                    const responseNativeAndToken = await http.moralis({
                        url: `/api/v2.2/wallets/${element.address}/tokens`,
                        method: 'GET',
                        headers: {
                            'X-API-Key': process.env.MORALIS_API_KEY
                        },
                        params: {
                            chain: 'eth',
                            format: 'decimal'
                        }
                    });

                    // Add to arrays with null checking
                    if (responseNetWorth.data && responseNetWorth.data.total_networth_usd !== undefined) {
                        balanceWallet.push(parseFloat(responseNetWorth.data.total_networth_usd) || 0);
                    } else {
                        balanceWallet.push(0);
                    }

                    if (responseNativeAndToken.data && responseNativeAndToken.data.result) {
                        nativeAndToken.push(responseNativeAndToken.data.result);
                    } else {
                        nativeAndToken.push([]);
                    }

                } catch (walletError) {
                    console.error(`Error fetching data for wallet ${element.address}:`, walletError.message);
                    // Continue with other wallets, but add default values
                    balanceWallet.push(0);
                    nativeAndToken.push([]);
                }
            }

            const totalBalance = balanceWallet.reduce((prev, curr) => +prev + +curr, 0);

            const response = {
                success: true,
                data: {
                    totalBalance,
                    nativeAndToken
                }
            };

            console.log('Portfolio Response Data:', JSON.stringify(response, null, 2));
            res.status(200).json(response);

        } catch (error) {
            console.error('Portfolio Controller Error:', error);
            next(error);
        }
    }

}


module.exports = PortofolioController;