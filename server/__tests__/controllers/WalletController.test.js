const request = require('supertest');
const app = require('../../app');
const TestHelper = require('../helpers/testHelper');
const { Wallet, User, Profile } = require('../../models');

describe('WalletController', () => {
  let testUser;
  let authToken;
  let testWallet;

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
    testUser = await TestHelper.createTestUser();
    authToken = TestHelper.generateToken(testUser);
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('POST /wallets', () => {
    it('should create a new wallet successfully', async () => {
      const walletData = {
        walletName: 'My Test Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678'
      };

      const mockWallet = {
        id: 1,
        walletName: walletData.walletName,
        address: walletData.address,
        UserId: testUser.id
      };

      // Mock Wallet.create to return the created wallet
      Wallet.create.mockResolvedValue(mockWallet);
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(walletData)
        .expect(201);

      expect(response.body.id).toBeTruthy();
      expect(response.body.walletName).toBe(walletData.walletName);
      expect(response.body.address).toBe(walletData.address);
      expect(response.body.UserId).toBe(testUser.id);

      // Verify wallet was created
      expect(Wallet.create).toHaveBeenCalledWith({
        walletName: walletData.walletName,
        address: walletData.address,
        UserId: 1 // From authentication middleware mock
      });
    });

    it('should create wallet without walletName', async () => {
      const walletData = {
        address: '0x1234567890abcdef1234567890abcdef12345678'
      };

      const mockWallet = {
        id: 1,
        walletName: null,
        address: walletData.address,
        UserId: testUser.id
      };

      // Mock Wallet.create to return the created wallet
      Wallet.create.mockResolvedValue(mockWallet);

      const response = await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(walletData)
        .expect(201);

      expect(response.body.address).toBe(walletData.address);
      expect(response.body.walletName).toBeNull();
    });

    it('should return 400 when address is missing', async () => {
      // Mock Wallet.create to throw validation error for missing address
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'Address is required'
      }];
      
      Wallet.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletName: 'Test Wallet'
        })
        .expect(400);

      expect(response.body.message).toBe('Address is required');
    });

    it('should return 400 when address format is invalid', async () => {
      // Mock Wallet.create to throw validation error for invalid address format
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'Invalid Ethereum address format'
      }];
      
      Wallet.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletName: 'Test Wallet',
          address: 'invalid-address'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid Ethereum address format');
    });

    it('should return 400 when address already exists', async () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';

      // Mock Wallet.create to throw unique constraint error
      const uniqueError = new Error('Unique constraint error');
      uniqueError.name = 'SequelizeUniqueConstraintError';
      uniqueError.errors = [{
        message: 'Address already exists in the database'
      }];
      
      Wallet.create.mockRejectedValue(uniqueError);

      const response = await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletName: 'Another Wallet',
          address
        })
        .expect(400);

      expect(response.body.message).toBe('Address already exists in the database');
    });

    it('should return 401 when no authorization token', async () => {
      const response = await request(app)
        .post('/wallets')
        .send({
          walletName: 'Test Wallet',
          address: '0x1234567890abcdef1234567890abcdef12345678'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/wallets')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          walletName: 'Test Wallet',
          address: '0x1234567890abcdef1234567890abcdef12345678'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('GET /wallets', () => {
    beforeEach(async () => {
      testWallet = await TestHelper.createTestWallet(testUser.id);
    });

    it('should get user wallets successfully', async () => {
      const mockUserWithWallets = {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        balance: 1000,
        Wallets: [
          {
            id: 1,
            walletName: 'Test Wallet',
            address: '0x1234567890abcdef1234567890abcdef12345678'
          }
        ],
        Profile: {
          username: 'testuser'
        }
      };

      // Mock User.findByPk with include
      User.findByPk.mockResolvedValue(mockUserWithWallets);

      const response = await request(app)
        .get('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.fullName).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.balance).toBe(1000);
      expect(response.body.Wallets).toHaveLength(1);
      expect(response.body.Wallets[0].id).toBe(1);
      expect(response.body.Wallets[0].walletName).toBe('Test Wallet');
      expect(response.body.Wallets[0].address).toBe('0x1234567890abcdef1234567890abcdef12345678');
      expect(response.body.Profile).toBeTruthy();
      expect(response.body.Profile.username).toBe('testuser');

      // Should not include sensitive fields
      expect(response.body.password).toBeUndefined();
      expect(response.body.createdAt).toBeUndefined();
      expect(response.body.updatedAt).toBeUndefined();
      expect(response.body.Wallets[0].UserId).toBeUndefined();
      expect(response.body.Wallets[0].createdAt).toBeUndefined();
      expect(response.body.Wallets[0].updatedAt).toBeUndefined();
    });

    it('should return empty wallets array when user has no wallets', async () => {
      const mockUserNoWallets = {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        balance: 1000,
        Wallets: [],
        Profile: {
          username: 'testuser'
        }
      };

      // Mock User.findByPk with empty wallets
      User.findByPk.mockResolvedValue(mockUserNoWallets);

      const response = await request(app)
        .get('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.Wallets).toHaveLength(0);
    });

    it('should return 401 when no authorization token', async () => {
      const response = await request(app)
        .get('/wallets')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/wallets')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('PUT /wallets/:id', () => {
    beforeEach(async () => {
      testWallet = await TestHelper.createTestWallet(testUser.id);
    });

    it('should update wallet successfully', async () => {
      const updateData = {
        walletName: 'Updated Wallet Name',
        address: '0xabcdef1234567890abcdef1234567890abcdef12'
      };

      const mockWallet = {
        id: 1,
        walletName: testWallet.walletName,
        address: testWallet.address,
        UserId: 1,
        update: jest.fn().mockResolvedValue({
          id: 1,
          walletName: updateData.walletName,
          address: updateData.address,
          UserId: 1
        })
      };

      // Mock authorization check
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .put(`/wallets/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.walletName).toBe(updateData.walletName);
      expect(response.body.address).toBe(updateData.address);

      // Verify update was called
      expect(mockWallet.update).toHaveBeenCalledWith(updateData);
    });

    it('should update only walletName', async () => {
      const updateData = {
        walletName: 'Only Name Updated'
      };

      const mockWallet = {
        id: 1,
        walletName: testWallet.walletName,
        address: testWallet.address,
        UserId: 1,
        update: jest.fn().mockResolvedValue({
          id: 1,
          walletName: updateData.walletName,
          address: testWallet.address,
          UserId: 1
        })
      };

      // Mock authorization check
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .put(`/wallets/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.walletName).toBe(updateData.walletName);
      expect(response.body.address).toBe(testWallet.address); // Should remain unchanged
    });

    it('should update only address', async () => {
      const updateData = {
        address: '0xabcdef1234567890abcdef1234567890abcdef12'
      };

      const mockWallet = {
        id: 1,
        walletName: testWallet.walletName,
        address: testWallet.address,
        UserId: 1,
        update: jest.fn().mockResolvedValue({
          id: 1,
          walletName: testWallet.walletName,
          address: updateData.address,
          UserId: 1
        })
      };

      // Mock authorization check
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .put(`/wallets/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.address).toBe(updateData.address);
      expect(response.body.walletName).toBe(testWallet.walletName); // Should remain unchanged
    });

    it('should return 404 when wallet not found', async () => {
      // Mock authorization check - wallet not found
      Wallet.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/wallets/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletName: 'Updated Name'
        })
        .expect(404);

      expect(response.body.message).toBe('Wallet not found');
    });

    it('should return 401 when no authorization token', async () => {
      const response = await request(app)
        .put(`/wallets/${testWallet.id}`)
        .send({
          walletName: 'Updated Name'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 400 when address format is invalid', async () => {
      const mockWallet = {
        id: 1,
        walletName: testWallet.walletName,
        address: testWallet.address,
        UserId: 1,
        update: jest.fn().mockRejectedValue({
          name: 'SequelizeValidationError',
          errors: [{
            message: 'Invalid Ethereum address format'
          }]
        })
      };

      // Mock authorization check - wallet found
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .put(`/wallets/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          address: 'invalid-address'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid Ethereum address format');
    });
  });

  describe('DELETE /wallets/:id', () => {
    beforeEach(async () => {
      testWallet = await TestHelper.createTestWallet(testUser.id);
    });

    it('should delete wallet successfully', async () => {
      const mockWallet = {
        id: 1,
        walletName: testWallet.walletName,
        address: testWallet.address,
        UserId: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      // Mock authorization check
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .delete(`/wallets/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Wallet deleted successfully');

      // Verify wallet destroy was called
      expect(mockWallet.destroy).toHaveBeenCalled();
    });

    it('should return 404 when wallet not found', async () => {
      // Mock authorization check - wallet not found
      Wallet.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/wallets/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Wallet not found');
    });

    it('should return 401 when no authorization token', async () => {
      const response = await request(app)
        .delete(`/wallets/${testWallet.id}`)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .delete(`/wallets/${testWallet.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('Error Handling Coverage', () => {
    it('should handle database error in getWallets', async () => {
      // Mock User.findByPk to throw database error
      User.findByPk.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .get('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.message).toBeDefined();
    });

    it('should handle database error in deleteWallet', async () => {
      const mockWallet = {
        id: 1,
        walletName: 'Test Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        UserId: 1,
        destroy: jest.fn().mockRejectedValue(new Error('Database delete error'))
      };

      // Mock authorization check - wallet found
      Wallet.findByPk.mockResolvedValue(mockWallet);

      const response = await request(app)
        .delete('/wallets/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.message).toBeDefined();
    });
  });
});