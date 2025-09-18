const authentication = require('../../middlewares/authentication');
const { signToken } = require('../../helpers/jwt');

describe('Middleware Coverage Tests', () => {
  describe('Authentication Middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = {};
      next = jest.fn();
    });

    it('should call next with error when no authorization header', () => {
      authentication(req, res, next);
      
      expect(next).toHaveBeenCalledWith({
        name: "Unauthorized",
        message: 'Invalid token'
      });
    });

    it('should call next with error when authorization header is empty', () => {
      req.headers.authorization = '';
      authentication(req, res, next);
      
      expect(next).toHaveBeenCalledWith({
        name: "Unauthorized",
        message: 'Invalid token'
      });
    });

    it('should call next with error when no token after Bearer', () => {
      req.headers.authorization = 'Bearer ';
      authentication(req, res, next);
      
      expect(next).toHaveBeenCalledWith({
        name: "Unauthorized",
        message: 'Invalid token'
      });
    });

    it('should set req.user and call next when valid token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = signToken(payload);
      req.headers.authorization = `Bearer ${token}`;
      
      authentication(req, res, next);
      
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(payload.id);
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error when token is malformed', () => {
      req.headers.authorization = 'Bearer invalid-token-format';
      
      authentication(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        name: expect.any(String)
      }));
    });
  });

  describe('Authorization Middleware Basic Coverage', () => {
    const authorization = require('../../middlewares/authorization');
    let req, res, next;

    beforeEach(() => {
      req = {
        user: { id: 1 },
        params: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
      jest.clearAllMocks();
    });

    it('should export authorization function', () => {
      expect(typeof authorization).toBe('function');
    });

    it('should handle missing user (line 5)', async () => {
      req.user = null;

      await authorization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        name: 'Forbidden',
        message: 'Access Forbidden'
      });
    });

    it('should handle missing params id (line 9)', async () => {
      req.params = {};

      await authorization(req, res, next);

      expect(next).toHaveBeenCalledWith({
        name: 'BadRequest',
        message: 'Invalid input'
      });
    });

    it('should handle wallet not found (line 18-20)', async () => {
      const { Wallet } = require('../../models');
      req.params.id = '999';
      
      Wallet.findByPk = jest.fn().mockResolvedValue(null);

      await authorization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        name: 'NotFound',
        message: 'Wallet not found'
      });
    });

    it('should handle wallet ownership mismatch (line 22-24)', async () => {
      const { Wallet } = require('../../models');
      req.params.id = '1';
      req.user.id = 1;
      
      const mockWallet = { id: 1, UserId: 2 }; // Different user
      Wallet.findByPk = jest.fn().mockResolvedValue(mockWallet);

      await authorization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        name: 'Forbidden',
        message: 'Access Forbidden'
      });
    });

    it('should allow access for wallet owner (line 25)', async () => {
      const { Wallet } = require('../../models');
      req.params.id = '1';
      req.user.id = 1;
      
      const mockWallet = { id: 1, UserId: 1 }; // Same user
      Wallet.findByPk = jest.fn().mockResolvedValue(mockWallet);

      await authorization(req, res, next);

      expect(next).toHaveBeenCalledWith(); // No arguments = continue
    });

    it('should handle database errors (line 27)', async () => {
      const { Wallet } = require('../../models');
      req.params.id = '1';
      
      Wallet.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      await authorization(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});