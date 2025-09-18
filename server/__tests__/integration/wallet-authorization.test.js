const request = require('supertest');
const express = require('express');
const { mockModels } = require('../mocks');

// Mock dependencies
jest.mock('../../models', () => mockModels);
jest.mock('../../helpers/jwt', () => ({
  verifyToken: jest.fn((token) => {
    if (token === 'valid.jwt.token') {
      return { id: 1, email: 'test@example.com' };
    }
    throw new Error('Invalid token');
  }),
}));

const WalletController = require('../../controllers/WalletController');
const authentication = require('../../middlewares/authentication');
const authorization = require('../../middlewares/authorization');
const { errorHandling } = require('../../middlewares/errorHandling');

const app = express();
app.use(express.json());

// Test routes with real middleware chain
app.put('/wallets/:id', authentication, authorization, WalletController.editWallet);
app.delete('/wallets/:id', authentication, authorization, WalletController.deleteWallet);
app.use(errorHandling);

describe('Wallet Authorization Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /wallets/:id with Authorization', () => {
    test('should allow wallet owner to edit wallet', async () => {
      // Mock user owns wallet
      mockModels.Wallet.findByPk.mockResolvedValue({
        id: 1,
        UserId: 1,
        walletName: 'Test Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        update: jest.fn().mockResolvedValue({
          id: 1,
          walletName: 'Updated Wallet',
          address: '0xnewaddress1234567890abcdef1234567890abcd',
        }),
      });

      const response = await request(app)
        .put('/wallets/1')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send({
          walletName: 'Updated Wallet',
          address: '0xnewaddress1234567890abcdef1234567890abcd',
        });

      expect(response.status).toBe(200);
      expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('1');
    });

    test('should deny access when user does not own wallet', async () => {
      // Mock wallet owned by different user
      mockModels.Wallet.findByPk.mockResolvedValue({
        id: 1,
        UserId: 2, // Different user
        walletName: 'Other User Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      });

      const response = await request(app)
        .put('/wallets/1')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send({
          walletName: 'Hacked Wallet',
          address: '0xhackedaddress1234567890abcdef1234567890',
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        name: 'Forbidden',
        message: 'Access Forbidden',
      });
    });

    test('should return 404 when wallet not found', async () => {
      mockModels.Wallet.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/wallets/999')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send({
          walletName: 'Non-existent Wallet',
          address: '0xnonexistent1234567890abcdef1234567890ab',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        name: 'NotFound',
        message: 'Wallet not found',
      });
    });

    test('should return 401 without authentication token', async () => {
      const response = await request(app)
        .put('/wallets/1')
        .send({
          walletName: 'Unauthorized Edit',
          address: '0xunauthorized1234567890abcdef123456789012',
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid token',
      });
    });

    test('should return 404 for invalid wallet ID', async () => {
      // Mock wallet not found for invalid ID
      mockModels.Wallet.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/wallets/invalid-id')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send({
          walletName: 'Invalid ID Test',
          address: '0xinvalidid1234567890abcdef123456789012',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        name: 'NotFound',
        message: 'Wallet not found',
      });
    });
  });

  describe('DELETE /wallets/:id with Authorization', () => {
    test('should allow wallet owner to delete wallet', async () => {
      // Mock user owns wallet
      mockModels.Wallet.findByPk.mockResolvedValue({
        id: 1,
        UserId: 1,
        walletName: 'Test Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        destroy: jest.fn().mockResolvedValue(),
      });

      const response = await request(app)
        .delete('/wallets/1')
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Wallet deleted successfully',
      });
      expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('1');
    });

    test('should deny deletion when user does not own wallet', async () => {
      // Mock wallet owned by different user
      mockModels.Wallet.findByPk.mockResolvedValue({
        id: 1,
        UserId: 2, // Different user
        walletName: 'Other User Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      });

      const response = await request(app)
        .delete('/wallets/1')
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        name: 'Forbidden',
        message: 'Access Forbidden',
      });
    });

    test('should return 404 when trying to delete non-existent wallet', async () => {
      mockModels.Wallet.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/wallets/999')
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        name: 'NotFound',
        message: 'Wallet not found',
      });
    });

    test('should return 401 without authentication token for deletion', async () => {
      const response = await request(app).delete('/wallets/1');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid token',
      });
    });

    test('should handle database errors during authorization', async () => {
      mockModels.Wallet.findByPk.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/wallets/1')
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Internal Server Error',
      });
    });
  });

  describe('Authorization Edge Cases', () => {
    test('should handle concurrent authorization requests', async () => {
      // Mock multiple wallets owned by user
      mockModels.Wallet.findByPk.mockImplementation((id) => {
        return Promise.resolve({
          id: parseInt(id),
          UserId: 1,
          walletName: `Wallet ${id}`,
          address: `0x${'1'.repeat(40)}`,
          destroy: jest.fn().mockResolvedValue(),
        });
      });

      const promises = [1, 2, 3, 4, 5].map((id) =>
        request(app)
          .delete(`/wallets/${id}`)
          .set('Authorization', 'Bearer valid.jwt.token')
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Wallet deleted successfully');
      });
    });

    test('should handle large wallet IDs', async () => {
      const largeId = '999999999';
      mockModels.Wallet.findByPk.mockResolvedValue({
        id: parseInt(largeId),
        UserId: 1,
        walletName: 'Large ID Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        destroy: jest.fn().mockResolvedValue(),
      });

      const response = await request(app)
        .delete(`/wallets/${largeId}`)
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(200);
      expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith(largeId);
    });

    test('should handle authorization with null wallet UserId', async () => {
      mockModels.Wallet.findByPk.mockResolvedValue({
        id: 1,
        UserId: null, // Orphaned wallet
        walletName: 'Orphaned Wallet',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      });

      const response = await request(app)
        .delete('/wallets/1')
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        name: 'Forbidden',
        message: 'Access Forbidden',
      });
    });
  });
});