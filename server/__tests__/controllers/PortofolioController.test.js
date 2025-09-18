const request = require('supertest');
const express = require('express');
const { mockHttp } = require('../mocks');

// Mock dependencies
jest.mock('../../helpers/http', () => mockHttp);

const PortofolioController = require('../../controllers/PortofolioController');
const { errorHandling } = require('../../middlewares/errorHandling');

const app = express();
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

// Test routes
app.get('/portofolios', mockAuth, PortofolioController.getPortofolio);
app.use(errorHandling);

describe('PortofolioController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /portofolios', () => {
    test('should get portfolio data successfully', async () => {
      const walletAddresses = '0x1234567890abcdef1234567890abcdef12345678,0xabcdef1234567890abcdef1234567890abcdef12';

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: walletAddresses });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalBalance');
      expect(response.body.data).toHaveProperty('nativeAndToken');
      expect(typeof response.body.data.totalBalance).toBe('number');
      expect(Array.isArray(response.body.data.nativeAndToken)).toBe(true);

      // Verify Moralis API calls
      expect(mockHttp.moralis).toHaveBeenCalledTimes(4); // 2 wallets * 2 calls each (net-worth + tokens)
    });

    test('should handle missing wallets query parameter', async () => {
      const response = await request(app).get('/portofolios');

      expect(response.status).toBe(404); // NotFound error from implementation
      expect(response.body.message).toBe('You dont have any wallet yet please connect first');
    });

    test('should handle empty wallets query parameter', async () => {
      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: '' });

      expect(response.status).toBe(404); // NotFound error from implementation
      expect(response.body.message).toBe('You dont have any wallet yet please connect first');
    });

    test('should handle single wallet address', async () => {
      const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: walletAddress });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalBalance');
      expect(response.body.data).toHaveProperty('nativeAndToken');

      // Verify Moralis API calls for single wallet
      expect(mockHttp.moralis).toHaveBeenCalledTimes(2); // 1 wallet * 2 calls (net-worth + tokens)
    });

    test('should handle Moralis API errors gracefully', async () => {
      mockHttp.moralis.mockRejectedValueOnce(new Error('Moralis API Error'));

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: '0x1234567890abcdef1234567890abcdef12345678' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalBalance).toBe(0); // Should be 0 due to error handling
      expect(response.body.data.nativeAndToken).toEqual([[]]); // Empty array due to error
    });

    test('should handle invalid wallet addresses', async () => {
      const invalidAddress = 'invalid_address';

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: invalidAddress });

      expect(response.status).toBe(200); // Controller doesn't validate address format
      expect(mockHttp.moralis).toHaveBeenCalled();
    });

    test('should handle response with undefined total_networth_usd', async () => {
      mockHttp.moralis
        .mockResolvedValueOnce({
          data: {} // Missing total_networth_usd
        })
        .mockResolvedValueOnce({
          data: {
            result: [{ symbol: 'ETH', balance: '1.0' }]
          }
        });

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: '0x1234567890abcdef1234567890abcdef12345678' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalBalance).toBe(0); // Should default to 0
    });

    test('should handle response with null data', async () => {
      mockHttp.moralis
        .mockResolvedValueOnce({
          data: null // Null data
        })
        .mockResolvedValueOnce({
          data: null
        });

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: '0x1234567890abcdef1234567890abcdef12345678' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalBalance).toBe(0);
      expect(response.body.data.nativeAndToken).toEqual([[]]);
    });

    test('should handle response with missing result in tokens', async () => {
      mockHttp.moralis
        .mockResolvedValueOnce({
          data: {
            total_networth_usd: "1500.75"
          }
        })
        .mockResolvedValueOnce({
          data: {} // Missing result
        });

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: '0x1234567890abcdef1234567890abcdef12345678' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalBalance).toBe(1500.75);
      expect(response.body.data.nativeAndToken).toEqual([[]]);
    });

    test('should process multiple wallets correctly', async () => {
      const walletAddresses = '0x1111111111111111111111111111111111111111,0x2222222222222222222222222222222222222222,0x3333333333333333333333333333333333333333';

      // Mock different responses for different wallets
      mockHttp.moralis
        .mockResolvedValueOnce({ data: { total_networth_usd: '1000.50' } }) // Wallet 1 net-worth
        .mockResolvedValueOnce({ data: { result: [{ symbol: 'ETH', balance_formatted: '1.0', usd_value: '3000' }] } }) // Wallet 1 tokens
        .mockResolvedValueOnce({ data: { total_networth_usd: '2000.75' } }) // Wallet 2 net-worth
        .mockResolvedValueOnce({ data: { result: [{ symbol: 'BTC', balance_formatted: '0.5', usd_value: '25000' }] } }) // Wallet 2 tokens
        .mockResolvedValueOnce({ data: { total_networth_usd: '500.25' } }) // Wallet 3 net-worth
        .mockResolvedValueOnce({ data: { result: [{ symbol: 'USDT', balance_formatted: '500', usd_value: '500' }] } }); // Wallet 3 tokens

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: walletAddresses });

      expect(response.status).toBe(200);
      expect(response.body.data.totalBalance).toBe(3501.5); // Sum of all net-worth values
      expect(response.body.data.nativeAndToken).toHaveLength(3); // 3 wallets
      expect(mockHttp.moralis).toHaveBeenCalledTimes(6); // 3 wallets * 2 calls each
    });

    test('should handle network timeout errors gracefully', async () => {
      mockHttp.moralis.mockRejectedValueOnce({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      });

      const response = await request(app)
        .get('/portofolios')
        .query({ wallets: '0x1234567890abcdef1234567890abcdef12345678' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalBalance).toBe(0); // Should be 0 due to timeout
    });
  });
});