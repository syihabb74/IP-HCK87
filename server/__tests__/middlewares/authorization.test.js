const { mockModels } = require('../mocks');

// Mock models
jest.mock('../../models', () => mockModels);

const authorization = require('../../middlewares/authorization');

describe('Authorization Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      user: { id: 1 },
      params: { id: '1' },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    // Reset mock wallet
    mockModels.Wallet.findByPk.mockResolvedValue({
      id: 1,
      UserId: 1,
      walletName: 'Test Wallet',
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });
  });

  test('should allow access when user owns the wallet', async () => {
    await authorization(mockReq, mockRes, mockNext);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('1');
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  test('should deny access when user does not own the wallet', async () => {
    // Mock wallet owned by different user
    mockModels.Wallet.findByPk.mockResolvedValue({
      id: 1,
      UserId: 2, // Different user
      walletName: 'Other User Wallet',
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });

    await authorization(mockReq, mockRes, mockNext);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('1');
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'Forbidden',
      message: 'Access Forbidden',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 404 when wallet is not found', async () => {
    mockModels.Wallet.findByPk.mockResolvedValue(null);

    await authorization(mockReq, mockRes, mockNext);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('1');
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'NotFound',
      message: 'Wallet not found',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 403 when user is not authenticated', async () => {
    mockReq.user = null;

    await authorization(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'Forbidden',
      message: 'Access Forbidden',
    });
    expect(mockModels.Wallet.findByPk).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 when wallet ID is missing', async () => {
    mockReq.params = {};

    await authorization(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'BadRequest',
      message: 'Invalid input',
    });
    expect(mockModels.Wallet.findByPk).not.toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test('should return 400 when wallet ID is null', async () => {
    mockReq.params = { id: null };

    await authorization(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      name: 'BadRequest',
      message: 'Invalid input',
    });
    expect(mockModels.Wallet.findByPk).not.toHaveBeenCalled();
  });

  test('should handle database errors properly', async () => {
    const dbError = new Error('Database connection failed');
    mockModels.Wallet.findByPk.mockRejectedValue(dbError);

    await authorization(mockReq, mockRes, mockNext);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('1');
    expect(mockNext).toHaveBeenCalledWith(dbError);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test('should handle string wallet ID conversion', async () => {
    mockReq.params = { id: '123' };

    await authorization(mockReq, mockRes, mockNext);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('123');
    expect(mockNext).toHaveBeenCalledWith();
  });

  test('should handle large wallet ID numbers', async () => {
    mockReq.params = { id: '999999999' };
    mockModels.Wallet.findByPk.mockResolvedValue({
      id: 999999999,
      UserId: 1,
      walletName: 'Large ID Wallet',
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });

    await authorization(mockReq, mockRes, mockNext);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledWith('999999999');
    expect(mockNext).toHaveBeenCalledWith();
  });

  test('should handle undefined user object', async () => {
    mockReq.user = undefined;

    await authorization(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'Forbidden',
      message: 'Access Forbidden',
    });
    expect(mockModels.Wallet.findByPk).not.toHaveBeenCalled();
  });

  test('should handle user with missing ID', async () => {
    mockReq.user = { email: 'test@example.com' }; // Missing id

    await authorization(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'Forbidden',
      message: 'Access Forbidden',
    });
  });

  test('should handle wallet with null UserId', async () => {
    mockModels.Wallet.findByPk.mockResolvedValue({
      id: 1,
      UserId: null,
      walletName: 'Orphaned Wallet',
      address: '0x1234567890abcdef1234567890abcdef12345678',
    });

    await authorization(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      name: 'Forbidden',
      message: 'Access Forbidden',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle concurrent authorization requests', async () => {
    const promises = Array.from({ length: 5 }, () =>
      authorization(mockReq, mockRes, mockNext)
    );

    await Promise.all(promises);

    expect(mockModels.Wallet.findByPk).toHaveBeenCalledTimes(5);
    expect(mockNext).toHaveBeenCalledTimes(5);
  });
});