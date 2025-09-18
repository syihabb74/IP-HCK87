const axios = require('axios');

const moralis = axios.create({
  baseURL: 'https://deep-index.moralis.io/'
});

const coinGecko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/'
});

const http = {
  moralis, coinGecko
}

module.exports = http;