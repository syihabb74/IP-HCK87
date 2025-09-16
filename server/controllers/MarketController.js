const http = require("../helpers/http");

class MarketController {
  
    static async getMarketData (req, res, next) {

        try {

            const response = await http.coinGecko({
                method: 'GET',
                headers: {
                    'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY
                },
                url: '/coins/markets',
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                }
            });

            res.status(200).json(response.data);

            
        } catch (error) {
            
            next(error);

        }


    }


}

module.exports = MarketController;