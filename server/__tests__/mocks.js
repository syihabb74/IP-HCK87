// Mock implementations for external dependencies

// Mock Sequelize models
const mockUser = {
  id: 1,
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  balance: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  createProfile: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
};

const mockProfile = {
  id: 1,
  username: 'testuser',
  UserId: 1,
  update: jest.fn().mockResolvedValue({}),
};

const mockWallet = {
  id: 1,
  walletName: 'Test Wallet',
  address: '0x1234567890abcdef1234567890abcdef12345678',
  UserId: 1,
  update: jest.fn().mockResolvedValue({}),
  destroy: jest.fn().mockResolvedValue({}),
};

// Mock Sequelize models
const mockModels = {
  User: {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findByPk: jest.fn().mockResolvedValue({
      ...mockUser,
      Wallets: [mockWallet],
      Profile: mockProfile,
    }),
    findOrCreate: jest.fn().mockResolvedValue([mockUser, true]),
    runHooks: jest.fn().mockResolvedValue({}),
  },
  Profile: {
    findOne: jest.fn().mockResolvedValue(mockProfile),
    create: jest.fn().mockResolvedValue(mockProfile),
  },
  Wallet: {
    create: jest.fn().mockResolvedValue(mockWallet),
    findAll: jest.fn().mockResolvedValue([mockWallet]),
    findByPk: jest.fn().mockResolvedValue(mockWallet),
  },
};

// Mock HTTP clients
const mockAxiosResponse = {
  data: {
    total_networth_usd: '1000.50',
    result: [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        balance: '1000000000000000000',
        balance_formatted: '1.0',
        usd_value: '3000.00',
      },
    ],
  },
};

const mockHttp = {
  moralis: jest.fn().mockResolvedValue(mockAxiosResponse),
  coinGecko: jest.fn().mockResolvedValue({
    data: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45000,
        market_cap: 900000000000,
        price_change_percentage_24h: 2.5,
      },
    ],
  }),
};

// Mock Google Auth
const mockGoogleAuth = {
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      getPayload: jest.fn().mockReturnValue({
        email: 'test@gmail.com',
        name: 'Test User Google',
      }),
    }),
  })),
};

// Mock Google GenAI
const mockGoogleGenAI = {
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Mock AI response with market analysis table',
      }),
    },
  })),
};

// Mock bcrypt
const mockBcrypt = {
  hashPassword: jest.fn().mockReturnValue('hashedpassword'),
  comparePassword: jest.fn().mockReturnValue(true),
};

// Mock JWT
const mockJWT = {
  signToken: jest.fn().mockReturnValue('mock.jwt.token'),
  verifyToken: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' }),
};

module.exports = {
  mockModels,
  mockHttp,
  mockGoogleAuth,
  mockGoogleGenAI,
  mockBcrypt,
  mockJWT,
  mockUser,
  mockProfile,
  mockWallet,
  mockAxiosResponse,
};