const { User, Wallet, Profile } = require('../../models');
const { signToken } = require('../../helpers/jwt');

class TestHelper {
  static async createTestUser(userData = {}) {
    const defaultData = {
      id: userData.id || Math.floor(Math.random() * 1000),
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password123',
      balance: 1000
    };

    const finalData = { ...defaultData, ...userData };

    // Mock the user creation
    const user = {
      ...finalData,
      save: jest.fn(),
      destroy: jest.fn()
    };

    // Create profile for user
    const profile = {
      id: Math.floor(Math.random() * 1000),
      username: user.fullName.toLowerCase().replace(/\s+/g, ''),
      UserId: user.id
    };

    return user;
  }

  static async createTestWallet(userId, walletData = {}) {
    const defaultData = {
      id: walletData.id || Math.floor(Math.random() * 1000),
      walletName: 'Test Wallet',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      UserId: userId
    };

    const finalData = { ...defaultData, ...walletData };

    return {
      ...finalData,
      save: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn().mockResolvedValue({ ...finalData })
    };
  }

  static generateToken(user) {
    return signToken({ id: user.id, email: user.email });
  }

  static async cleanDatabase() {
    // Mock database cleanup - no actual database operations needed
    jest.clearAllMocks();
  }

  static mockExternalAPIs() {
    const http = require('../../helpers/http');

    // Mock CoinGecko API
    http.coinGecko.mockResolvedValue({
      data: [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          current_price: 45000,
          market_cap: 900000000000,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.5
        }
      ]
    });

    // Mock Moralis API
    http.moralis
      .mockResolvedValueOnce({
        data: {
          total_networth_usd: "1250.50"
        }
      })
      .mockResolvedValueOnce({
        data: {
          result: [
            {
              token_address: "0x...",
              symbol: "ETH",
              name: "Ethereum",
              balance: "1.5",
              balance_formatted: "1.5",
              usd_price: 3000,
              usd_value: 4500
            }
          ]
        }
      });
  }

  static mockGoogleAI() {
    const { GoogleGenAI } = require('@google/genai');
    const mockInstance = new GoogleGenAI();

    mockInstance.models.generateContent.mockResolvedValue({
      text: `
      [
        {
          "id": "bitcoin",
          "name": "Bitcoin",
          "symbol": "BTC",
          "current_price": 45000,
          "market_cap": 900000000000,
          "rank": 1
        }
      ]

      Analisis: Bitcoin menunjukkan stabilitas pasar yang baik.
      `
    });

    return mockInstance;
  }

  static mockGoogleAuth() {
    const { OAuth2Client } = require('google-auth-library');
    const mockClient = new OAuth2Client();

    mockClient.verifyIdToken.mockResolvedValue({
      getPayload: () => ({
        email: 'google@example.com',
        name: 'Google User'
      })
    });

    return mockClient;
  }
}

module.exports = TestHelper;