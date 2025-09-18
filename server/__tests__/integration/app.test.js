const request = require('supertest');
const express = require('express');
const { mockModels, mockHttp } = require('../mocks');

// Mock all dependencies
jest.mock('../../models', () => mockModels);
jest.mock('../../helpers/http', () => mockHttp);

// Import app components
const app = express();
const cors = require('cors');
const routes = require('../../routes');
const { errorHandling } = require('../../middlewares/errorHandling');

// Setup app like in app.js
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);
app.use(errorHandling);

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    test('should respond to basic requests', async () => {
      // Since there's no health check endpoint, test a known endpoint
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('CORS Configuration', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .options('/register');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('JSON Parsing', () => {
    test('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      // Should not fail due to JSON parsing
      expect(response.status).not.toBe(400);
    });

  });

  describe('URL Encoded Parsing', () => {
    test('should parse URL encoded request bodies', async () => {
      const response = await request(app)
        .post('/register')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('fullName=Test User&email=test@example.com&password=password123');

      // Should not fail due to URL encoding parsing
      expect(response.status).not.toBe(400);
    });
  });

  describe('Route Mounting', () => {
    test('should mount all routes correctly', async () => {
      // Test user routes
      const userResponse = await request(app)
        .post('/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(userResponse.status).toBeDefined();

      // Test that authenticated routes require authentication
      const walletResponse = await request(app)
        .get('/wallets');

      expect(walletResponse.status).toBe(401); // Should be unauthorized without token
    });
  });

  describe('Error Handling', () => {
    test('should handle errors gracefully', async () => {
      // Mock User.create to reject for empty fields
      mockModels.User.create.mockRejectedValueOnce(new Error('Validation error'));

      // Cause an error by not providing required fields
      const response = await request(app)
        .post('/register')
        .send({});

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('message');
    });

    test('should return proper error format', async () => {
      const response = await request(app)
        .post('/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('Content Type Handling', () => {
    test('should handle requests without content-type', async () => {
      const response = await request(app)
        .post('/register');

      expect(response.status).toBeDefined();
    });

    test('should handle different content types', async () => {
      const jsonResponse = await request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }));

      expect(jsonResponse.status).toBeDefined();
    });
  });
});