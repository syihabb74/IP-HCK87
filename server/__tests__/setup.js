// Test setup and global configurations
// Only set NODE_ENV to test if it's not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
process.env.SECRET_JWT_KEY = 'test_jwt_secret';
process.env.GOOGLE_CLIENT_ID = 'test_google_client_id';
process.env.MORALIS_API_KEY = 'test_moralis_key';
process.env.COINGECKO_API_KEY = 'test_coingecko_key';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};