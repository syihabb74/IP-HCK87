const { errorHandling } = require('../../middlewares/errorHandling');

describe('Error Handling Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('JWT Errors', () => {
    it('should handle JsonWebTokenError', () => {
      const err = new Error('jwt malformed');
      err.name = 'JsonWebTokenError';

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid Token'
      });
    });

    it('should handle JsonWebTokenError with custom message', () => {
      const err = new Error('Custom JWT error message');
      err.name = 'JsonWebTokenError';

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid Token'
      });
    });
  });

  describe('Custom Error Types', () => {
    it('should handle BadRequest error', () => {
      const err = { name: 'BadRequest', message: 'Invalid input data' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid input data'
      });
    });

    it('should handle BadRequest error without message', () => {
      const err = { name: 'BadRequest' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bad Request'
      });
    });

    it('should handle Unauthorized error', () => {
      const err = { name: 'Unauthorized', message: 'Invalid credentials' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should handle Unauthorized error without message', () => {
      const err = { name: 'Unauthorized' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });

    it('should handle Forbidden error', () => {
      const err = { name: 'Forbidden', message: 'Access denied' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied'
      });
    });

    it('should handle Forbidden error without message', () => {
      const err = { name: 'Forbidden' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden'
      });
    });

    it('should handle NotFound error', () => {
      const err = { name: 'NotFound', message: 'Resource not found' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Resource not found'
      });
    });

    it('should handle NotFound error without message', () => {
      const err = { name: 'NotFound' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not Found'
      });
    });
  });

  describe('Sequelize Errors', () => {
    it('should handle SequelizeValidationError with message', () => {
      const err = {
        name: 'SequelizeValidationError',
        errors: [
          { message: 'Email must be unique' }
        ]
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email must be unique'
      });
    });

    it('should handle SequelizeValidationError without errors array', () => {
      const err = {
        name: 'SequelizeValidationError'
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation Error'
      });
    });

    it('should handle SequelizeValidationError with empty errors array', () => {
      const err = {
        name: 'SequelizeValidationError',
        errors: []
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation Error'
      });
    });

    it('should handle SequelizeValidationError with null errors', () => {
      const err = {
        name: 'SequelizeValidationError',
        errors: null
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation Error'
      });
    });

    it('should handle SequelizeUniqueConstraintError', () => {
      const err = {
        name: 'SequelizeUniqueConstraintError',
        errors: [
          { message: 'email must be unique' }
        ]
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'email must be unique'
      });
    });

    it('should handle SequelizeUniqueConstraintError without message', () => {
      const err = {
        name: 'SequelizeUniqueConstraintError',
        errors: [{}]
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation Error'
      });
    });

    it('should handle multiple validation errors', () => {
      const err = {
        name: 'SequelizeValidationError',
        errors: [
          { message: 'First validation error' },
          { message: 'Second validation error' }
        ]
      };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'First validation error' // Should take the first error
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null error', () => {
      errorHandling(null, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle undefined error', () => {
      errorHandling(undefined, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle non-object error', () => {
      errorHandling('string error', req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle number as error', () => {
      errorHandling(404, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle boolean as error', () => {
      errorHandling(false, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle unknown error type', () => {
      const err = { name: 'UnknownError', message: 'Unknown error occurred' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle error without name property', () => {
      const err = { message: 'Error without name' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle empty object error', () => {
      const err = {};

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle error with empty string message', () => {
      const err = { name: 'BadRequest', message: '' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bad Request'
      });
    });

    it('should handle error with null message', () => {
      const err = { name: 'Unauthorized', message: null };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });

    it('should handle error with undefined message', () => {
      const err = { name: 'Forbidden', message: undefined };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden'
      });
    });
  });

  describe('Case Sensitivity', () => {
    it('should handle case-sensitive error names', () => {
      const err = { name: 'badrequest', message: 'Lowercase name' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should handle exact case matching for error names', () => {
      const err = { name: 'BADREQUEST', message: 'Uppercase name' };

      errorHandling(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });
  });

  describe('Response Format Consistency', () => {
    it('should always return JSON with message property', () => {
      const errorTypes = [
        { name: 'JsonWebTokenError' },
        { name: 'BadRequest', message: 'Test message' },
        { name: 'Unauthorized' },
        { name: 'Forbidden' },
        { name: 'NotFound' },
        { name: 'SequelizeValidationError', errors: [{ message: 'Test' }] }
      ];

      errorTypes.forEach(err => {
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };

        errorHandling(err, req, mockRes, next);

        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.any(String)
          })
        );
      });
    });
  });
});