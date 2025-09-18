const { verifyToken } = require('../../helpers/jwt');
const authentication = require('../../middlewares/authentication');

// Mock JWT helper
jest.mock('../../helpers/jwt');

describe('Authentication Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();

    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('should authenticate user with valid token', () => {
    const mockDecodedToken = { id: 1, email: 'test@example.com' };
    mockReq.headers.authorization = 'Bearer valid.jwt.token';

    verifyToken.mockReturnValue(mockDecodedToken);

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('valid.jwt.token');
    expect(mockReq.user).toEqual(mockDecodedToken);
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(Object));
  });

  test('should reject request without authorization header', () => {
    authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
  });

  test('should reject request with empty authorization header', () => {
    mockReq.headers.authorization = '';

    authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test('should reject request with malformed authorization header', () => {
    mockReq.headers.authorization = 'InvalidFormat token';

    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token format');
    });

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('token');
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockReq.user).toBeUndefined();
  });

  test('should handle JWT verification errors', () => {
    mockReq.headers.authorization = 'Bearer invalid.jwt.token';

    const jwtError = new Error('Invalid token');
    jwtError.name = 'JsonWebTokenError';
    verifyToken.mockImplementation(() => {
      throw jwtError;
    });

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('invalid.jwt.token');
    expect(mockNext).toHaveBeenCalledWith(jwtError);
    expect(mockReq.user).toBeUndefined();
  });

  test('should handle expired token errors', () => {
    mockReq.headers.authorization = 'Bearer expired.jwt.token';

    const expiredError = new Error('Token expired');
    expiredError.name = 'TokenExpiredError';
    verifyToken.mockImplementation(() => {
      throw expiredError;
    });

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('expired.jwt.token');
    expect(mockNext).toHaveBeenCalledWith(expiredError);
    expect(mockReq.user).toBeUndefined();
  });

  test('should handle authorization header without Bearer prefix', () => {
    mockReq.headers.authorization = 'valid.jwt.token';

    authentication(mockReq, mockRes, mockNext);

    // Now validates access_token existence before calling verifyToken
    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test('should handle authorization header with multiple spaces', () => {
    mockReq.headers.authorization = 'Bearer  valid.jwt.token';

    authentication(mockReq, mockRes, mockNext);

    // With new validation, this will be caught as invalid token (empty after split)
    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test('should log headers for debugging', () => {
    mockReq.headers.authorization = 'Bearer valid.jwt.token';
    const mockDecodedToken = { id: 1, email: 'test@example.com' };

    verifyToken.mockReturnValue(mockDecodedToken);

    authentication(mockReq, mockRes, mockNext);

    expect(console.log).toHaveBeenCalledWith(mockReq.headers);
    expect(console.log).toHaveBeenCalledWith(mockDecodedToken);
  });

  test('should handle null authorization header', () => {
    mockReq.headers.authorization = null;

    authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test('should handle empty token after Bearer split', () => {
    mockReq.headers.authorization = 'Bearer ';

    authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test('should handle Bearer without space', () => {
    mockReq.headers.authorization = 'Bearer';

    authentication(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(verifyToken).not.toHaveBeenCalled();
  });


  test('should handle very long token', () => {
    const longToken = 'a'.repeat(5000);
    mockReq.headers.authorization = `Bearer ${longToken}`;

    const mockDecodedToken = { id: 1, email: 'test@example.com' };
    verifyToken.mockReturnValue(mockDecodedToken);

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith(longToken);
    expect(mockReq.user).toEqual(mockDecodedToken);
    expect(mockNext).toHaveBeenCalledWith();
  });

  test('should handle token with special characters', () => {
    const specialToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
    mockReq.headers.authorization = `Bearer ${specialToken}`;

    const mockDecodedToken = { id: 1, email: 'test@example.com' };
    verifyToken.mockReturnValue(mockDecodedToken);

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith(specialToken);
    expect(mockReq.user).toEqual(mockDecodedToken);
    expect(mockNext).toHaveBeenCalledWith();
  });

  test('should handle verifyToken returning null', () => {
    mockReq.headers.authorization = 'Bearer valid.jwt.token';

    verifyToken.mockReturnValue(null);

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('valid.jwt.token');
    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(mockReq.user).toBeUndefined();
  });

  test('should handle verifyToken returning undefined', () => {
    mockReq.headers.authorization = 'Bearer valid.jwt.token';

    verifyToken.mockReturnValue(undefined);

    authentication(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('valid.jwt.token');
    expect(mockNext).toHaveBeenCalledWith({
      name: 'Unauthorized',
      message: 'Invalid token',
    });
    expect(mockReq.user).toBeUndefined();
  });
});