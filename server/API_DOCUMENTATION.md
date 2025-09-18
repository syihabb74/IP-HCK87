# API Documentation

Base URL: `http://localhost:3003`

## Table of Contents

1. [Authentication](#authentication)
2. [User Endpoints (Public)](#user-endpoints-public)
   - [Register User](#1-register-user)
   - [Login User](#2-login-user) 
   - [Google Sign In](#3-google-sign-in)
3. [Market Endpoints (Protected)](#market-endpoints-protected)
   - [Get Market Data](#4-get-market-data)
4. [Wallet Endpoints (Protected)](#wallet-endpoints-protected)
   - [Get User Wallets](#5-get-user-wallets)
   - [Create Wallet](#6-create-wallet)
   - [Update Wallet](#7-update-wallet)
   - [Delete Wallet](#8-delete-wallet)
5. [AI Endpoints (Protected)](#ai-endpoints-protected)
   - [AI Market Analysis](#9-ai-market-analysis)
6. [Portfolio Endpoints (Protected)](#portfolio-endpoints-protected)
   - [Get Portfolio Data](#10-get-portfolio-data)
7. [Error Handling](#error-handling)
8. [Data Models](#data-models)
9. [External API Dependencies](#external-api-dependencies)
10. [Environment Variables](#environment-variables)
11. [Testing Examples](#testing-examples)

---

## Authentication

The API uses JWT (JSON Web Token) for authentication. Some endpoints are public (user registration, login, google sign-in), while others require authentication.

**Protected endpoints require Bearer token authentication in the Authorization header:**
```
Authorization: Bearer <access_token>
```

**Authentication flow:**
1. Register or login to get an access token
2. Include the token in the Authorization header for protected endpoints
3. Authentication middleware validates the token and adds user info to `req.user`

---

## User Endpoints (Public)

### 1. Register User
**POST** `/register`

Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

**Validation Requirements:**
- `fullName` - String (required, cannot be empty)
- `email` - String (required, must be valid email format, must be unique)
- `password` - String (required, cannot be empty, will be hashed automatically)

**Success Response (200):**
```json
{
  "message": "Register Successfully"
}
```

**Error Responses:**
- `400` - Bad Request (missing required fields)
- `400` - Validation error (invalid email format, empty fields)
- `409` - Conflict (email already exists)

---

### 2. Login User
**POST** `/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Bad Request (missing email or password)
- `401` - Unauthorized (invalid email/password)

---

### 3. Google Sign In
**POST** `/google-signin`

Sign in using Google OAuth token. Creates new user if doesn't exist.

**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here"
}
```

**Success Response:**
- `200` - Existing user signed in
- `201` - New user created and signed in

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Bad Request (missing or invalid Google token)

---

## Market Endpoints (Protected)

### 4. Get Market Data
**GET** `/markets`

**Authentication:** Required

Fetch cryptocurrency market data from CoinGecko API.

**Query Parameters:** None

**Success Response (200):**
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc", 
    "name": "Bitcoin",
    "current_price": 45000,
    "market_cap": 900000000000,
    "market_cap_rank": 1,
    "price_change_percentage_24h": 2.5,
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  }
]
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `500` - Server error (external API failure)

---

## Wallet Endpoints (Protected)

### 5. Get User Wallets
**GET** `/wallets`

**Authentication:** Required

Get all wallets for the authenticated user.

**Success Response (200):**
```json
{
  "id": 1,
  "fullName": "John Doe", 
  "email": "john@example.com",
  "balance": 1000,
  "Wallets": [
    {
      "id": 1,
      "walletName": "My Main Wallet",
      "address": "0x1234567890abcdef1234567890abcdef12345678"
    }
  ],
  "Profile": {
    "username": "johndoe"
  }
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)

### 6. Create Wallet
**POST** `/wallets`

**Authentication:** Required

Create a new wallet for the authenticated user.

**Request Body:**
```json
{
  "walletName": "My New Wallet",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Validation Requirements:**
- `walletName` - String (optional)
- `address` - String (required)
  - Must be valid Ethereum address format (0x followed by 40 hexadecimal characters)
  - Must be unique across all wallets
  - Example: `0x1234567890abcdef1234567890abcdef12345678`

**Success Response (201):**
```json
{
  "id": 2,
  "walletName": "My New Wallet", 
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "UserId": 1
}
```

**Error Responses:**
- `400` - Bad Request (missing required fields, invalid address format)
- `401` - Unauthorized (invalid or missing token)
- `409` - Conflict (address already exists)

### 7. Update Wallet
**PUT** `/wallets/:id`

**Authentication:** Required

Update an existing wallet.

**Path Parameters:**
- `id` - Wallet ID

**Request Body:**
```json
{
  "walletName": "Updated Wallet Name",
  "address": "0xnewaddress1234567890abcdef1234567890abcdef"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "walletName": "Updated Wallet Name",
  "address": "0xnewaddress1234567890abcdef1234567890abcdef", 
  "UserId": 1
}
```

**Error Responses:**
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (invalid or missing token)
- `404` - Wallet not found

### 8. Delete Wallet
**DELETE** `/wallets/:id`

**Authentication:** Required

Delete a wallet.

**Path Parameters:**
- `id` - Wallet ID

**Success Response (200):**
```json
{
  "message": "Wallet deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `404` - Wallet not found

---

## AI Endpoints (Protected)

### 9. AI Market Analysis
**POST** `/ai-markets`

**Authentication:** Required

Get AI analysis of cryptocurrency market data using Google's Gemini AI.

**Request Body:**
```json
{
  "marketData": [
    {
      "name": "Bitcoin",
      "symbol": "BTC", 
      "price": 45000,
      "market_cap": 900000000000,
      "rank": 1
    }
  ]
}
```

**Success Response (200):**
```json
{
  "message": "| Nama Koin | Simbol | Harga (USD) | Market Cap | Rank |\n|-----------|--------|-------------|------------|------|\n| Bitcoin | BTC | 45000 | 900B | 1 |\n\nAnalisis: Bitcoin menunjukkan stabilitas..."
}
```

**Error Responses:**
- `400` - Bad Request (empty prompt/body)
- `401` - Unauthorized (invalid or missing token)
- `500` - AI service error

---

## Portfolio Endpoints (Protected)

### 10. Get Portfolio Data
**GET** `/portofolios`

**Authentication:** Required

Get portfolio data for specified wallet addresses using Moralis API.

**Query Parameters:**
- `wallets` (required) - Comma-separated wallet addresses

**Example:**
```
GET /portofolios?wallets=0x123...,0x456...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBalance": 15420.50,
    "nativeAndToken": [
      [
        {
          "token_address": "0x...",
          "symbol": "ETH", 
          "name": "Ethereum",
          "balance": "1.5",
          "balance_formatted": "1.5",
          "usd_price": 3000,
          "usd_value": 4500
        }
      ]
    ]
  }
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `404` - No wallets found (missing wallets parameter)
- `500` - External API error (Moralis)
---

## Error Handling

The API uses consistent error response format:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - OK (Success)
- `201` - Created (Resource created successfully) 
- `400` - Bad Request (Invalid input/validation error)
- `401` - Unauthorized (Missing or invalid authentication)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource already exists)
- `500` - Internal Server Error

**Authentication Errors:**
- Missing Authorization header
- Invalid JWT token
- Expired JWT token

**Validation Errors:**
- Missing required fields
- Invalid field formats
- Constraint violations

---

## Data Models

### User Model
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com", 
  "balance": 1000,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Wallet Model
```json
{
  "id": 1,
  "walletName": "My Wallet",
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "UserId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z", 
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Profile Model
```json
{
  "id": 1,
  "username": "johndoe",
  "UserId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## External API Dependencies

### CoinGecko API
- **Endpoint:** `/markets` uses CoinGecko Pro API
- **Purpose:** Fetch cryptocurrency market data
- **Authentication:** X-CG-Pro-API-Key header required

### Moralis API  
- **Endpoint:** `/portofolios` uses Moralis Web3 API
- **Purpose:** Fetch wallet balances and token data
- **Authentication:** X-API-Key header required
- **Supported:** Ethereum mainnet

### Google AI (Gemini)
- **Endpoint:** `/ai-markets` uses Google GenerativeAI
- **Purpose:** AI analysis of market data  
- **Authentication:** Google AI API key required
- **Model:** gemini-2.5-flash

---

## Environment Variables

Required environment variables for the server:

```env
# Database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password  
DB_NAME=your_db_name
DB_HOST=localhost

# Authentication
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id

# External APIs
COINGECKO_API_KEY=your_coingecko_api_key
MORALIS_API_KEY=your_moralis_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

---

## Testing Examples

### cURL Commands for Testing

#### 1. Register User
```bash
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 2. Login User
```bash
curl -X POST http://localhost:3003/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 3. Get Market Data (Protected)
```bash
curl -X GET http://localhost:3003/markets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Get User Wallets (Protected)
```bash
curl -X GET http://localhost:3003/wallets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Create Wallet (Protected)
```bash
curl -X POST http://localhost:3003/wallets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "walletName": "My Test Wallet",
    "address": "0x1234567890abcdef1234567890abcdef12345678"
  }'
```

#### 6. AI Market Analysis (Protected)
```bash
curl -X POST http://localhost:3003/ai-markets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "marketData": [
      {
        "name": "Bitcoin",
        "symbol": "BTC",
        "price": 45000,
        "market_cap": 900000000000,
        "rank": 1
      }
    ]
  }'
```

#### 7. Get Portfolio Data (Protected)
```bash
curl -X GET "http://localhost:3003/portofolios?wallets=0x123...,0x456..." \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Postman Collection

You can import this collection into Postman for easier testing:

```json
{
  "info": {
    "name": "Crypto Portfolio API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3003"
    },
    {
      "key": "accessToken",
      "value": "YOUR_ACCESS_TOKEN"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"fullName\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": "{{baseUrl}}/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": "{{baseUrl}}/login"
          }
        }
      ]
    }
  ]
}
```

---

## Security Considerations

### Authentication Security
- JWT tokens should have appropriate expiration times
- Use strong JWT secrets in production
- Implement token refresh mechanism for better security

### Input Validation
- All user inputs are validated before processing
- SQL injection protection through Sequelize ORM
- XSS protection through proper data sanitization

### API Security Best Practices
- Use HTTPS in production
- Implement CORS properly for frontend domains
- Log security events for monitoring
- Validate wallet addresses before processing

### Environment Security
- Keep API keys secure and rotate regularly
- Use different databases for development/production
- Implement proper logging without exposing sensitive data
- Use environment variables for all configuration

---

## API Versioning

For future API versions, consider implementing versioning:

```
GET /api/v1/markets
GET /api/v2/markets
```

Current API is version 1.0.0 (unversioned for simplicity).

---

## Development & Testing

### Setup for Development

1. **Clone the repository:**
```bash
git clone <repository-url>
cd server
```

2. **Install dependencies:**
```bash`
npm install
```

3. **Setup environment variables:**
Create a `.env` file with the required variables listed in [Environment Variables](#environment-variables)

4. **Database setup:**
```bash
# Run migrations
npx sequelize-cli db:migrate

# Run seeders (if any)
npx sequelize-cli db:seed:all
```

5. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Running Tests

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- __tests__/controllers/UserController.test.js
```

### API Testing Tools

**Recommended tools for testing:**
- **Postman** - Use the provided collection above
- **cURL** - Command line testing with examples provided
- **Thunder Client** - VS Code extension for API testing
- **Insomnia** - REST API client

### Common Testing Scenarios

1. **Authentication Flow:**
   - Register → Login → Use protected endpoints
   - Test with invalid credentials
   - Test token expiration

2. **CRUD Operations:**
   - Create, read, update, delete wallets
   - Test validation errors
   - Test authorization (different users)

3. **External API Integration:**
   - Test market data fetching
   - Test portfolio calculations
   - Test AI analysis responses

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- User authentication (register, login, Google OAuth)
- Wallet management (CRUD operations)
- Market data integration (CoinGecko)
- Portfolio tracking (Moralis)
- AI market analysis (Google Gemini)

### Future Improvements
- API versioning
- Webhook support for real-time updates
- Advanced portfolio analytics
- Multi-blockchain support
- Enhanced security features
```json
{
  "id": 1,
  "walletName": "Updated Wallet Name",
  "address": "0xnewaddress1234567890abcdef1234567890abcdef",
  "UserId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Wallet updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `404` - Wallet not found

---

### 4. Delete Wallet
**DELETE** `/wallets/:id`

Delete a wallet.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Wallet deleted successfully"
}
```

**Status Codes:**
- `200` - Wallet deleted successfully
- `401` - Unauthorized
- `404` - Wallet not found

---

## Market Endpoints

### 1. Get Market Data
**GET** `/markets`

Get cryptocurrency market data from CoinGecko.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price": 45000,
    "market_cap": 900000000000,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 945000000000,
    "total_volume": 25000000000,
    "high_24h": 46000,
    "low_24h": 44000,
    "price_change_24h": 500,
    "price_change_percentage_24h": 1.12,
    "market_cap_change_24h": 10000000000,
    "market_cap_change_percentage_24h": 1.13,
    "circulating_supply": 19500000,
    "total_supply": 21000000,
    "max_supply": 21000000,
    "ath": 69000,
    "ath_change_percentage": -34.78,
    "ath_date": "2021-11-10T14:24:11.849Z",
    "atl": 67.81,
    "atl_change_percentage": 66251.2,
    "atl_date": "2013-07-06T00:00:00.000Z",
    "roi": null,
    "last_updated": "2024-01-01T12:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - External API error

---

## Portfolio Endpoints

### 1. Analyze Portfolio
**POST** `/portofolios`

Analyze portfolio based on provided wallet data.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
[
  {
    "id": 1,
    "walletName": "Main Wallet",
    "address": "0x1234567890abcdef1234567890abcdef12345678"
  },
  {
    "id": 2,
    "walletName": "Trading Wallet",
    "address": "0xabcdef1234567890abcdef1234567890abcdef12"
  }
]
```

**Response:**
```json
1250000.50
```

**Status Codes:**
- `200` - Success
- `400` - No wallets provided
- `401` - Unauthorized
- `404` - No wallets found
- `500` - External API error

---

## AI Endpoints

### 1. AI Market Analysis
**POST** `/ai-markets`

Get AI-powered analysis of cryptocurrency market data.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
[
  {
    "id": "bitcoin",
    "name": "Bitcoin",
    "symbol": "btc",
    "current_price": 45000,
    "market_cap": 900000000000,
    "price_change_percentage_24h": 1.12
  },
  {
    "id": "ethereum",
    "name": "Ethereum",
    "symbol": "eth",
    "current_price": 3000,
    "market_cap": 350000000000,
    "price_change_percentage_24h": -0.5
  }
]
```

**Response:**
```json
{
  "message": "| Nama Koin | Simbol | Harga (USD) | Market Cap | Perubahan 24h |\n|-----------|--------|-------------|------------|---------------|\n| Bitcoin | BTC | 45000 | 900B | +1.12% |\n| Ethereum | ETH | 3000 | 350B | -0.5% |\n\nAnalisis: Bitcoin menunjukkan tren positif dengan kenaikan 1.12% dalam 24 jam terakhir..."
}
```

**Status Codes:**
- `200` - Success
- `400` - Empty or invalid prompt
- `401` - Unauthorized
- `500` - AI API error

---

### 2. AI Portfolio Analysis
**POST** `/ai-portofolio`

Get AI-powered portfolio analysis (endpoint currently not implemented).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Status Codes:**
- `501` - Not implemented

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

