const request = require('supertest');
const express = require('express');
const { mockHttp } = require('../mocks');

// Mock dependencies
jest.mock('../../helpers/http', () => mockHttp);

const MarketController = require('../../controllers/MarketController');
const { errorHandling } = require('../../middlewares/errorHandling');

const app = express();
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

// Test routes
app.get('/markets', mockAuth, MarketController.getMarketData);
app.use(errorHandling);

describe('MarketController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /markets', () => {
    test('should get market data successfully', async () => {
      const response = await request(app).get('/markets');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('symbol');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('current_price');

      expect(mockHttp.coinGecko).toHaveBeenCalledWith({
        method: 'GET',
        headers: {
          'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY,
        },
        url: '/coins/markets',
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
        },
      });
    });

    test('should handle API errors', async () => {
      mockHttp.coinGecko.mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app).get('/markets');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });

    test('should handle network errors', async () => {
      mockHttp.coinGecko.mockRejectedValueOnce({
        code: 'ECONNREFUSED',
        message: 'Connection refused',
      });

      const response = await request(app).get('/markets');

      expect(response.status).toBe(500);
    });

    test('should handle rate limiting errors', async () => {
      mockHttp.coinGecko.mockRejectedValueOnce({
        response: {
          status: 429,
          data: { error: 'Rate limit exceeded' },
        },
      });

      const response = await request(app).get('/markets');

      expect(response.status).toBe(500);
    });
  });
});