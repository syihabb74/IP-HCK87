const request = require('supertest');
const express = require('express');
const { mockModels } = require('../mocks');

// Mock dependencies
jest.mock('../../models', () => mockModels);

const WalletController = require('../../controllers/WalletController');
const { errorHandling } = require('../../middlewares/errorHandling');

const app = express();
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

// Mock authorization middleware
const mockAuthorization = (req, res, next) => {
  // Simulate authorization check - assume wallet belongs to user
  next();
};

// Test routes
app.get('/wallets', mockAuth, WalletController.getWallets);
app.post('/wallets', mockAuth, WalletController.createWallet);
app.put('/wallets/:id', mockAuth, mockAuthorization, WalletController.editWallet);
app.delete('/wallets/:id', mockAuth, mockAuthorization, WalletController.deleteWallet);
app.use(errorHandling);

describe('WalletController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /wallets', () => {
    test('should get user wallets successfully', async () => {
      const response = await request(app).get('/wallets');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Wallets');
      expect(response.body).toHaveProperty('Profile');
      expect(mockModels.User.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: mockModels.Wallet,
            attributes: { exclude: ['createdAt', 'updatedAt', 'UserId'] },
          },
          {
            model: mockModels.Profile,
            attributes: ['username'],
          },
        ],
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });
    });

    test('should handle database errors', async () => {
      mockModels.User.findByPk.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/wallets');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });

  describe('POST /wallets', () => {
    test('should create wallet successfully', async () => {
      const walletData = {
        walletName: 'Test Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      };

      const response = await request(app)
        .post('/wallets')
        .send(walletData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.walletName).toBe(walletData.walletName);
      expect(response.body.address).toBe(walletData.address);
      expect(mockModels.Wallet.create).toHaveBeenCalledWith({
        walletName: walletData.walletName,
        address: walletData.address,
        UserId: 1,
      });
    });

    test('should handle validation errors', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeValidationError',
        errors: [{ message: 'Wallet name is required' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Wallet name is required');
    });

    test('should reject invalid Ethereum address format', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeValidationError',
        errors: [{ message: 'Invalid Ethereum address format' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
          address: 'invalid-address',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Ethereum address format');
    });

    test('should reject address without 0x prefix', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeValidationError',
        errors: [{ message: 'Invalid Ethereum address format' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
          address: '1234567890abcdef1234567890abcdef12345678',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Ethereum address format');
    });

    test('should reject address with wrong length', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeValidationError',
        errors: [{ message: 'Invalid Ethereum address format' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
          address: '0x123456', // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Ethereum address format');
    });

    test('should reject duplicate address', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeUniqueConstraintError',
        errors: [{ message: 'Address already exists in the database' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
          address: '0x1234567890abcdef1234567890abcdef12345678',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Address already exists in the database');
    });

    test('should require address field', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeValidationError',
        errors: [{ message: 'Address is required' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Address is required');
    });

    test('should handle address with invalid characters', async () => {
      mockModels.Wallet.create.mockRejectedValueOnce({
        name: 'SequelizeValidationError',
        errors: [{ message: 'Invalid Ethereum address format' }],
      });

      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
          address: '0xGGGG567890abcdef1234567890abcdef12345678', // Contains G which is invalid hex
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Ethereum address format');
    });

    test('should accept valid uppercase hex address', async () => {
      const walletData = {
        walletName: 'Test Wallet',
        address: '0X1234567890ABCDEF1234567890ABCDEF12345678',
      };

      const response = await request(app)
        .post('/wallets')
        .send(walletData);

      expect(response.status).toBe(201);
      expect(mockModels.Wallet.create).toHaveBeenCalledWith({
        walletName: walletData.walletName,
        address: walletData.address,
        UserId: 1,
      });
    });

    test('should accept valid mixed case hex address', async () => {
      const walletData = {
        walletName: 'Test Wallet',
        address: '0x1234567890AbCdEf1234567890AbCdEf12345678',
      };

      const response = await request(app)
        .post('/wallets')
        .send(walletData);

      expect(response.status).toBe(201);
      expect(mockModels.Wallet.create).toHaveBeenCalledWith({
        walletName: walletData.walletName,
        address: walletData.address,
        UserId: 1,
      });
    });
  });

  describe('PUT /wallets/:id', () => {
    test('should update wallet successfully', async () => {
      const walletId = 1;
      const updateData = {
        walletName: 'Updated Wallet',
        address: '0xnewaddress1234567890abcdef1234567890abcdef',
      };

      const response = await request(app)
        .put(`/wallets/${walletId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith(walletId.toString());
    });

    test('should handle wallet not found', async () => {
      mockModels.Wallet.findByPk.mockResolvedValueOnce(null);

      const response = await request(app)
        .put('/wallets/999')
        .send({
          walletName: 'Updated Wallet',
          address: '0xnewaddress',
        });

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /wallets/:id', () => {
    test('should delete wallet successfully', async () => {
      const walletId = 1;

      const response = await request(app).delete(`/wallets/${walletId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Wallet deleted successfully');
      expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith(walletId.toString());
    });

    test('should handle wallet not found for deletion', async () => {
      mockModels.Wallet.findByPk.mockResolvedValueOnce(null);

      const response = await request(app).delete('/wallets/999');

      expect(response.status).toBe(500);
    });
  });
});