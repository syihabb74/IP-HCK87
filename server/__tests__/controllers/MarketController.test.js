const request = require('supertest');
const app = require('../../app');
const TestHelper = require('../helpers/testHelper');
const http = require('../../helpers/http');

describe('MarketController', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
    testUser = await TestHelper.createTestUser();
    authToken = TestHelper.generateToken(testUser);
    TestHelper.mockExternalAPIs();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET /markets', () => {
    it('should get market data successfully', async () => {
      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);

      const marketData = response.body[0];
      expect(marketData.id).toBe('bitcoin');
      expect(marketData.symbol).toBe('btc');
      expect(marketData.name).toBe('Bitcoin');
      expect(marketData.current_price).toBe(45000);
      expect(marketData.market_cap).toBe(900000000000);
      expect(marketData.market_cap_rank).toBe(1);
      expect(marketData.price_change_percentage_24h).toBe(2.5);
      expect(marketData.image).toBeTruthy();

      // Verify external API was called correctly
      expect(http.coinGecko).toHaveBeenCalledWith({
        method: 'GET',
        headers: {
          'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY
        },
        url: '/coins/markets',
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc'
        }
      });
    });

    it('should return 401 when no authorization token', async () => {
      const response = await request(app)
        .get('/markets')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/markets')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should handle external API errors', async () => {
      // Mock API failure
      http.coinGecko.mockRejectedValue(new Error('CoinGecko API Error'));

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle empty market data response', async () => {
      // Mock empty response
      http.coinGecko.mockResolvedValue({ data: [] });

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should handle null market data response', async () => {
      // Mock null response
      http.coinGecko.mockResolvedValue({ data: null });

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it('should handle malformed market data response', async () => {
      // Mock malformed response
      http.coinGecko.mockResolvedValue({
        data: [
          {
            id: 'bitcoin',
            // missing required fields
            symbol: 'btc'
          }
        ]
      });

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].id).toBe('bitcoin');
      expect(response.body[0].symbol).toBe('btc');
    });

    it('should handle API timeout', async () => {
      // Mock timeout error
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'ECONNABORTED';
      http.coinGecko.mockRejectedValue(timeoutError);

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle API rate limiting', async () => {
      // Mock rate limit error
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.response = { status: 429 };
      http.coinGecko.mockRejectedValue(rateLimitError);

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle network errors', async () => {
      // Mock network error
      const networkError = new Error('Network Error');
      networkError.code = 'ENOTFOUND';
      http.coinGecko.mockRejectedValue(networkError);

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should pass through large market data arrays', async () => {
      // Mock large response
      const largeMarketData = Array.from({ length: 100 }, (_, i) => ({
        id: `coin-${i}`,
        symbol: `coin${i}`,
        name: `Coin ${i}`,
        current_price: 1000 + i,
        market_cap: 1000000000 + i * 1000000,
        market_cap_rank: i + 1,
        price_change_percentage_24h: (Math.random() - 0.5) * 10
      }));

      http.coinGecko.mockResolvedValue({ data: largeMarketData });

      const response = await request(app)
        .get('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(100);
      expect(response.body[0].id).toBe('coin-0');
      expect(response.body[99].id).toBe('coin-99');
    });
  });
});