const { errorHandling } = require('../../middlewares/errorHandling');

describe('Error Handling Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('should handle JsonWebTokenError', () => {
    const error = new Error('Invalid token');
    error.name = 'JsonWebTokenError';

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid Token',
    });
  });

  test('should handle BadRequest error', () => {
    const error = {
      name: 'BadRequest',
      message: 'Invalid input data',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid input data',
    });
  });

  test('should handle Unauthorized error', () => {
    const error = {
      name: 'Unauthorized',
      message: 'Access denied',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Access denied',
    });
  });

  test('should handle SequelizeValidationError', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [
        { message: 'Email is required' },
        { message: 'Password must be at least 6 characters' },
      ],
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is required',
    });
  });

  test('should handle SequelizeUniqueConstraintError', () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      errors: [
        { message: 'Email already exists' },
      ],
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email already exists',
    });
  });

  test('should handle NotFound error', () => {
    const error = {
      name: 'NotFound',
      message: 'Resource not found',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Resource not found',
    });
  });

  test('should handle NotFound error without message', () => {
    const error = {
      name: 'NotFound',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Not Found',
    });
  });

  test('should handle null error', () => {
    errorHandling(null, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  test('should handle undefined error', () => {
    errorHandling(undefined, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  test('should handle non-object error', () => {
    errorHandling('string error', mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  test('should handle BadRequest error without message', () => {
    const error = {
      name: 'BadRequest',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Bad Request',
    });
  });

  test('should handle Unauthorized error without message', () => {
    const error = {
      name: 'Unauthorized',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized',
    });
  });

  test('should handle SequelizeValidationError without errors array', () => {
    const error = {
      name: 'SequelizeValidationError',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation Error',
    });
  });

  test('should handle SequelizeValidationError with empty errors array', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [],
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation Error',
    });
  });

  test('should handle SequelizeValidationError with error without message', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [{}], // Error object without message
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation Error',
    });
  });

  test('should handle unknown errors with 500 status', () => {
    const error = new Error('Unknown error');
    error.name = 'UnknownError';

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  test('should handle errors without name property', () => {
    const error = {
      message: 'Error without name',
    };

    errorHandling(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });
});