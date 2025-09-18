const request = require('supertest');
const app = require('../../app');
const TestHelper = require('../helpers/testHelper');
const { GoogleGenAI } = require('@google/genai');

describe('AiController', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
    testUser = await TestHelper.createTestUser();
    authToken = TestHelper.generateToken(testUser);
    TestHelper.mockGoogleAI();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('POST /ai-markets', () => {
    const validMarketData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        current_price: 45000,
        market_cap: 900000000000,
        price_change_percentage_24h: 1.12
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "eth",
        current_price: 3000,
        market_cap: 350000000000,
        price_change_percentage_24h: -0.5
      }
    ];

    it('should analyze market data successfully', async () => {
      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe('bitcoin');
      expect(response.body.data[0].name).toBe('Bitcoin');
      expect(response.body.data[0].symbol).toBe('BTC');
      expect(response.body.data[0].current_price).toBe(45000);
      expect(response.body.data[0].market_cap).toBe(900000000000);
      expect(response.body.data[0].rank).toBe(1);
      expect(response.body.message).toBeTruthy();
      expect(response.body.formatted).toBe(true);

      // Verify Google AI was called correctly
      const mockInstance = new GoogleGenAI();
      expect(mockInstance.models.generateContent).toHaveBeenCalledWith({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [{
            text: expect.stringContaining('Data: [{"id":"bitcoin"')
          }]
        }]
      });
    });

    it('should handle single cryptocurrency data', async () => {
      const singleCryptoData = [validMarketData[0]];

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(singleCryptoData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe('bitcoin');
    });

    it('should handle empty array data', async () => {
      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send([])
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return 401 when no authorization token', async () => {
      const response = await request(app)
        .post('/ai-markets')
        .send(validMarketData)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', 'Bearer invalid-token')
        .send(validMarketData)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send()
        .expect(400);

      expect(response.body.message).toBe("Prompt can't be empty");
    });

    it('should return 400 when request body is null', async () => {
      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(null)
        .expect(400);

      expect(response.body.message).toBe("Prompt can't be empty");
    });

    it('should handle Google AI API errors', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockRejectedValue(new Error('Google AI API Error'));

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle invalid JSON response from AI', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockResolvedValue({
        text: 'Invalid response without JSON format'
      });

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.formatted).toBe(false);
      expect(response.body.message).toBe('Invalid response without JSON format');
      expect(response.body.error).toBe('Failed to parse JSON from AI response');
    });

    it('should handle AI response with malformed JSON', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockResolvedValue({
        text: '```json\n{\n  "invalid": "json",\n  "missing": "closing bracket"\n```\nThis is some analysis text.'
      });

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.formatted).toBe(false);
      expect(response.body.error).toBe('Failed to parse JSON from AI response');
    });

    it('should handle AI response with non-array JSON', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockResolvedValue({
        text: '```json\n{\n  "id": "bitcoin",\n  "name": "Bitcoin"\n}\n```\nAnalysis text here.'
      });

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.formatted).toBe(false);
      expect(response.body.error).toBe('Failed to parse JSON from AI response');
    });

    it('should handle incomplete cryptocurrency data in AI response', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockResolvedValue({
        text: '```json\n[\n  {\n    "id": "bitcoin",\n    "name": "Bitcoin"\n  }\n]\n```\nAnalysis: This is partial data.'
      });

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].id).toBe('bitcoin');
      expect(response.body.data[0].name).toBe('Bitcoin');
      expect(response.body.data[0].symbol).toBe(''); // Default value for missing field
      expect(response.body.data[0].current_price).toBe(0); // Default value
      expect(response.body.data[0].market_cap).toBe(0); // Default value
      expect(response.body.data[0].rank).toBe(0); // Default value
    });

    it('should handle very large market data input', async () => {
      const largeMarketData = Array.from({ length: 50 }, (_, i) => ({
        id: `coin-${i}`,
        name: `Coin ${i}`,
        symbol: `coin${i}`,
        current_price: 1000 + i,
        market_cap: 1000000000 + i * 1000000,
        price_change_percentage_24h: (Math.random() - 0.5) * 10
      }));

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(largeMarketData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);

      // Verify the entire large dataset was passed to AI
      const mockInstance = new GoogleGenAI();
      const aiCall = mockInstance.models.generateContent.mock.calls[0][0];
      expect(aiCall.contents[0].parts[0].text).toContain('coin-0');
      expect(aiCall.contents[0].parts[0].text).toContain('coin-49');
    });

    it('should handle network timeout from Google AI', async () => {
      const mockInstance = new GoogleGenAI();
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'ECONNABORTED';
      mockInstance.models.generateContent.mockRejectedValue(timeoutError);

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle Google AI rate limiting', async () => {
      const mockInstance = new GoogleGenAI();
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.response = { status: 429 };
      mockInstance.models.generateContent.mockRejectedValue(rateLimitError);

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle special characters in market data', async () => {
      const specialCharData = [{
        id: "special-coin",
        name: "Special Coin 🚀 & Co.",
        symbol: "SPCL",
        current_price: 1000,
        market_cap: 1000000,
        price_change_percentage_24h: 5.5
      }];

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(specialCharData)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify special characters were handled in AI prompt
      const mockInstance = new GoogleGenAI();
      const aiCall = mockInstance.models.generateContent.mock.calls[0][0];
      expect(aiCall.contents[0].parts[0].text).toContain('Special Coin 🚀 & Co.');
    });

    it('should handle AI response with JSON pattern without code blocks', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockResolvedValue({
        text: 'Here is the analysis: [{"id":"bitcoin","name":"Bitcoin","symbol":"BTC","current_price":45000,"market_cap":900000000000,"rank":1}] This shows good market performance.'
      });

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe('bitcoin');
      expect(response.body.message).toContain('Here is the analysis:');
      expect(response.body.message).toContain('This shows good market performance.');
    });

    it('should handle AI response with JSON but non-array structure', async () => {
      const mockInstance = new GoogleGenAI();
      mockInstance.models.generateContent.mockResolvedValue({
        text: 'Analysis: {"bitcoin": {"price": 45000}} - This is not an array format.'
      });

      const response = await request(app)
        .post('/ai-markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMarketData)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.formatted).toBe(false);
      expect(response.body.error).toBe('Failed to parse JSON from AI response');
    });
  });
});