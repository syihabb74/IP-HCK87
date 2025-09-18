const jwt = require('jsonwebtoken');
const { signToken, verifyToken } = require('../../helpers/jwt');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('JWT Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SECRET_JWT_KEY = 'test_jwt_secret';
  });

  describe('signToken', () => {
    test('should sign token successfully', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const expectedToken = 'signed.jwt.token';

      jwt.sign.mockReturnValue(expectedToken);

      const result = signToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRET_JWT_KEY);
      expect(result).toBe(expectedToken);
    });

    test('should handle empty payload', () => {
      const payload = {};
      const expectedToken = 'empty.payload.token';

      jwt.sign.mockReturnValue(expectedToken);

      const result = signToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRET_JWT_KEY);
      expect(result).toBe(expectedToken);
    });

    test('should handle complex payload', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        role: 'admin',
        permissions: ['read', 'write'],
        metadata: { lastLogin: new Date().toISOString() },
      };
      const expectedToken = 'complex.payload.token';

      jwt.sign.mockReturnValue(expectedToken);

      const result = signToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRET_JWT_KEY);
      expect(result).toBe(expectedToken);
    });

    test('should handle null payload', () => {
      const payload = null;
      const expectedToken = 'null.payload.token';

      jwt.sign.mockReturnValue(expectedToken);

      const result = signToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRET_JWT_KEY);
      expect(result).toBe(expectedToken);
    });
  });

  describe('verifyToken', () => {
    test('should verify token successfully', () => {
      const token = 'valid.jwt.token';
      const expectedPayload = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(expectedPayload);

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_JWT_KEY);
      expect(result).toEqual(expectedPayload);
    });

    test('should handle invalid token', () => {
      const token = 'invalid.jwt.token';
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_JWT_KEY);
    });

    test('should handle expired token', () => {
      const token = 'expired.jwt.token';
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow('Token expired');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_JWT_KEY);
    });

    test('should handle malformed token', () => {
      const token = 'malformed.token';
      const error = new Error('Malformed token');
      error.name = 'JsonWebTokenError';

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow('Malformed token');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_JWT_KEY);
    });

    test('should handle empty token', () => {
      const token = '';
      const error = new Error('jwt must be provided');
      error.name = 'JsonWebTokenError';

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow('jwt must be provided');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_JWT_KEY);
    });

    test('should handle null token', () => {
      const token = null;
      const error = new Error('jwt must be provided');
      error.name = 'JsonWebTokenError';

      jwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow('jwt must be provided');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_JWT_KEY);
    });
  });
});