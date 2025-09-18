// Quick test script to debug portfolio endpoint
const axios = require('axios');

async function testPortfolioEndpoint() {
  try {
    console.log('Testing portfolio endpoint...');

    // Test with a dummy wallet address
    const testWallet = '0x742A4D9C3e8C7Dc0E9B3D1C7e9e7e7e7e7e7e7e7'; // dummy address
    const response = await axios.get(`http://localhost:3003/portofolios?wallets=${testWallet}`);

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Test Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testPortfolioEndpoint();