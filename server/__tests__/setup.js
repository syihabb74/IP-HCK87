// Test setup and global configurations
// Force NODE_ENV to test for all test environments
process.env.NODE_ENV = 'test';

// Remove DATABASE_URL to prevent connecting to production database
delete process.env.DATABASE_URL;

// Set other test environment variables
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