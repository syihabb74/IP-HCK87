const fs = require('fs');
const path = require('path');

// Mock Sequelize
const mockSequelizeInstance = {
  authenticate: jest.fn(),
  close: jest.fn(),
  define: jest.fn(),
  sync: jest.fn()
};

const mockSequelizeConstructor = jest.fn(() => mockSequelizeInstance);
mockSequelizeConstructor.DataTypes = {
  STRING: 'STRING',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  TEXT: 'TEXT'
};

// Mock modules before requiring
jest.mock('sequelize', () => mockSequelizeConstructor);

jest.mock('fs', () => ({
  readdirSync: jest.fn()
}));

jest.mock('path', () => ({
  basename: jest.fn(),
  join: jest.fn()
}));

// Mock config.json to ensure test database configuration
jest.mock('../../config/config.json', () => ({
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'ip_testing',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'ip_dev',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
}));

describe('Models Index', () => {
  let originalEnv;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    originalEnv = process.env.NODE_ENV;
  });
  
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('should use test config in test environment', () => {
    process.env.NODE_ENV = 'test';

    // Mock fs and path
    require('fs').readdirSync.mockReturnValue(['user.js', 'wallet.js', 'profile.js']);
    require('path').basename.mockReturnValue('index.js');
    require('path').join.mockImplementation((dir, file) => `${dir}/${file}`);

    // Mock model files
    const mockModel = { name: 'TestModel', associate: jest.fn() };
    jest.doMock('../../models/user.js', () => () => mockModel, { virtual: true });
    jest.doMock('../../models/wallet.js', () => () => mockModel, { virtual: true });
    jest.doMock('../../models/profile.js', () => () => mockModel, { virtual: true });

    const db = require('../../models/index.js');

    expect(mockSequelizeConstructor).toHaveBeenCalledWith(
      'ip_testing',
      'postgres',
      'postgres',
      expect.objectContaining({
        host: '127.0.0.1',
        dialect: 'postgres'
      })
    );
    expect(db.sequelize).toBe(mockSequelizeInstance);
    expect(db.Sequelize).toBe(mockSequelizeConstructor);
  });


  test('should filter and load model files correctly', () => {
    process.env.NODE_ENV = 'development';
    
    // Mock fs to return various files including non-model files
    require('fs').readdirSync.mockReturnValue([
      'user.js',
      'index.js',
      '.hidden.js',
      'model.test.js',
      'wallet.js',
      'readme.md'
    ]);
    require('path').basename.mockReturnValue('index.js');
    require('path').join.mockImplementation((dir, file) => `${dir}/${file}`);
    
    // Mock model files
    const mockUserModel = { name: 'User', associate: jest.fn() };
    const mockWalletModel = { name: 'Wallet', associate: jest.fn() };
    
    jest.doMock('../../models/user.js', () => () => mockUserModel, { virtual: true });
    jest.doMock('../../models/wallet.js', () => () => mockWalletModel, { virtual: true });
    
    const db = require('../../models/index.js');
    
    // Should only load .js files that are not index.js, hidden files, or test files
    expect(db.User).toBe(mockUserModel);
    expect(db.Wallet).toBe(mockWalletModel);
    expect(mockUserModel.associate).toHaveBeenCalledWith(db);
    expect(mockWalletModel.associate).toHaveBeenCalledWith(db);
  });

  test('should handle models without associate method', () => {
    process.env.NODE_ENV = 'development';
    
    require('fs').readdirSync.mockReturnValue(['user.js', 'profile.js']);
    require('path').basename.mockReturnValue('index.js');
    require('path').join.mockImplementation((dir, file) => `${dir}/${file}`);
    
    // Mock models - one with associate, one without
    const mockModelWithAssociate = { name: 'User', associate: jest.fn() };
    const mockModelWithoutAssociate = { name: 'Profile' }; // No associate method
    
    jest.doMock('../../models/user.js', () => () => mockModelWithAssociate, { virtual: true });
    jest.doMock('../../models/profile.js', () => () => mockModelWithoutAssociate, { virtual: true });
    
    // Should not throw error when model doesn't have associate method
    expect(() => {
      const db = require('../../models/index.js');
      expect(db.User).toBe(mockModelWithAssociate);
      expect(db.Profile).toBe(mockModelWithoutAssociate);
      expect(mockModelWithAssociate.associate).toHaveBeenCalledWith(db);
    }).not.toThrow();
  });

  test('should export sequelize instance and Sequelize class', () => {
    process.env.NODE_ENV = 'development';
    
    require('fs').readdirSync.mockReturnValue([]);
    require('path').basename.mockReturnValue('index.js');
    
    const db = require('../../models/index.js');
    
    expect(db.sequelize).toBe(mockSequelizeInstance);
    expect(db.Sequelize).toBe(mockSequelizeConstructor);
  });
});