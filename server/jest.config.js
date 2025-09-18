module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'helpers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!migrations/**',
    '!config/**',
    '!__tests__/**'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '__tests__/setup.js',
    '__tests__/mocks.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
};