# API Documentation

Base URL: `http://localhost:3003`

## Authentication
Most endpoints require Bearer token authentication in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## User Endpoints

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

**Response:**
```json
{
  "message": "Register Successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error or email already exists

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

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing email or password
- `401` - Invalid credentials

---

### 3. Google Sign In
**POST** `/google-signin`

Sign in using Google OAuth token.

**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200` - Existing user signed in
- `201` - New user created and signed in
- `400` - Invalid or missing Google token

---

## Wallet Endpoints
*All wallet endpoints require authentication*

### 1. Get User Wallets
**GET** `/wallets`

Get all wallets belonging to the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "balance": 0,
  "Wallets": [
    {
      "id": 1,
      "walletName": "Main Wallet",
      "address": "0x1234567890abcdef..."
    },
    {
      "id": 2,
      "walletName": "Trading Wallet",
      "address": "0xabcdef1234567890..."
    }
  ],
  "Profile": {
    "username": "johndoe"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### 2. Create Wallet
**POST** `/wallets`

Create a new wallet for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "walletName": "My New Wallet",
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response:**
```json
{
  "id": 3,
  "walletName": "My New Wallet",
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "UserId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Wallet created successfully
- `400` - Validation error
- `401` - Unauthorized

---

### 3. Update Wallet
**PUT** `/wallets/:id`

Update an existing wallet.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "walletName": "Updated Wallet Name",
  "address": "0xnewaddress1234567890abcdef1234567890abcdef"
}
```

**Response:**
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

