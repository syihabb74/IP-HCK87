const axios = require('axios');

const ethplorer = axios.create({
  baseURL: 'https://api.ethplorer.io/'
});

const coinGecko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/'
});

const http = {
  ethplorer, coinGecko
}

module.exports = http;