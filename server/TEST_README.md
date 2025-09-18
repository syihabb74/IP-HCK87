# Testing Guide

## Overview
This project uses Jest for comprehensive testing with coverage reporting. All major components including controllers, middlewares, helpers, and integration tests are covered.

## Test Structure
```
__tests__/
├── setup.js                 # Test configuration and global setup
├── mocks.js                 # Mock implementations for external dependencies
├── controllers/             # Controller unit tests
│   ├── UserController.test.js
│   ├── WalletController.test.js
│   ├── MarketController.test.js
│   ├── PortofolioController.test.js
│   └── AiController.test.js
├── helpers/                 # Helper function tests
│   ├── bcrypt.test.js
│   ├── jwt.test.js
│   └── http.test.js
├── middlewares/             # Middleware tests
│   ├── authentication.test.js
│   └── errorHandling.test.js
└── integration/             # Integration tests
    └── app.test.js
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Coverage Targets
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## Test Coverage Includes
- ✅ All Controllers (UserController, WalletController, MarketController, PortofolioController, AiController)
- ✅ All Middlewares (authentication, errorHandling)
- ✅ All Helpers (bcrypt, jwt, http)
- ✅ Integration tests for the entire app
- ✅ Error handling scenarios
- ✅ Authentication flows
- ✅ API endpoint testing

## Mock Strategy
- **External APIs**: Moralis, CoinGecko, Google GenAI mocked
- **Database**: Sequelize models mocked with realistic responses
- **Authentication**: JWT and Google OAuth mocked
- **HTTP Clients**: Axios instances mocked

## Test Features
- **Comprehensive Error Testing**: All error scenarios covered
- **Authentication Testing**: Valid/invalid tokens, missing headers
- **API Integration Testing**: External API calls mocked and tested
- **Database Operations**: CRUD operations tested with mocks
- **Input Validation**: Edge cases and validation errors tested

## Coverage Reports
After running `npm run test:coverage`, coverage reports are generated in:
- **Terminal**: Text summary
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

## Environment Setup
Tests run with mocked environment variables:
- `NODE_ENV=test`
- `JWT_SECRET=test_jwt_secret`
- Mock API keys for external services

## Adding New Tests
1. Create test file in appropriate `__tests__/` subdirectory
2. Follow naming convention: `ComponentName.test.js`
3. Use existing mocks from `__tests__/mocks.js`
4. Ensure all scenarios are covered (success, error, edge cases)

## Test Guidelines
- Mock all external dependencies
- Test both success and failure scenarios
- Include edge cases and error conditions
- Maintain high test coverage
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach` for common setup
- Clean up mocks between tests

## Common Test Patterns

### Controller Testing
```javascript
const request = require('supertest');
const { mockModels } = require('../mocks');

describe('ControllerName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle success case', async () => {
    // Test implementation
  });

  test('should handle error case', async () => {
    // Test implementation
  });
});
```

### Helper Testing
```javascript
const { helperFunction } = require('../../helpers/helperName');

describe('Helper Function', () => {
  test('should return expected result', () => {
    // Test implementation
  });
});
```

## Dependencies
- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **Mocks**: Comprehensive mocking of external dependencies

## Notes
- All console outputs are mocked to reduce test noise
- Tests are configured to force exit and detect open handles
- Coverage thresholds enforce quality standards
- Integration tests verify the entire application flow