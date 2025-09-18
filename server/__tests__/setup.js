// Mock Sequelize untuk testing
jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const UserMock = dbMock.define('User', {
    id: 1,
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    balance: 1000
  });

  // Add mock methods
  UserMock.findOne = jest.fn();
  UserMock.findByPk = jest.fn();
  UserMock.create = jest.fn();

  const WalletMock = dbMock.define('Wallet', {
    id: 1,
    walletName: 'Test Wallet',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    UserId: 1
  });

  // Add mock methods
  WalletMock.findByPk = jest.fn();
  WalletMock.create = jest.fn();
  WalletMock.destroy = jest.fn();

  const ProfileMock = dbMock.define('Profile', {
    id: 1,
    username: 'testuser',
    UserId: 1
  });

  // Add mock methods
  ProfileMock.create = jest.fn();
  ProfileMock.destroy = jest.fn();

  return {
    User: UserMock,
    Wallet: WalletMock,
    Profile: ProfileMock,
    sequelize: {
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
      authenticate: jest.fn().mockResolvedValue(true)
    }
  };
});

// Mock external API calls untuk testing
jest.mock('../helpers/http', () => ({
  coinGecko: jest.fn(),
  moralis: jest.fn()
}));

// Mock Google AI
jest.mock('@google/genai', () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({
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

  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }))
  };
});

// Mock Google Auth Library
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn()
  }))
}));

// Mock bcrypt functions
jest.mock('../helpers/bcrypt', () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
  comparePassword: jest.fn((password, hashedPassword) => {
    return password === 'password123' && hashedPassword.includes('password123');
  })
}));

// Mock JWT functions
jest.mock('../helpers/jwt', () => ({
  signToken: jest.fn((payload) => {
    if (!payload || typeof payload !== 'object') {
      return `token_undefined`;
    }
    return `token_${payload.id}`;
  }),
  verifyToken: jest.fn((token) => {
    if (!token || typeof token !== 'string') {
      return null;
    }
    if (token === 'valid-token' || token.startsWith('token_')) {
      return { id: 1, email: 'test@example.com' };
    }
    return null;
  })
}));

beforeAll(async () => {
  // Set NODE_ENV untuk testing
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.COINGECKO_API_KEY = 'test-api-key';
  process.env.MORALIS_API_KEY = 'test-moralis-key';
  process.env.GOOGLE_AI_API_KEY = 'test-google-ai-key';
  process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';

  console.log('Test environment setup completed');
});

afterAll(async () => {
  console.log('Test cleanup completed');
});

// Global error handler untuk uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception in tests:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in tests:', reason);
});