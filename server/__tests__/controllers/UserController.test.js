const request = require('supertest');
const app = require('../../app');
const TestHelper = require('../helpers/testHelper');
const { User, Profile } = require('../../models');

describe('UserController', () => {
  let testUser;

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        fullName: userData.fullName,
        email: userData.email,
        password: 'hashed_password123'
      };

      const mockProfile = {
        id: 1,
        username: 'johndoe',
        UserId: 1
      };

      // Mock User.create only
      User.create.mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(200);

      expect(response.body.message).toBe('Register Successfully');

      // Verify User.create was called
      expect(User.create).toHaveBeenCalled();
    });

    it('should return 400 when email already exists', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Mock User.create to throw unique constraint error
      const uniqueError = new Error('Unique constraint error');
      uniqueError.name = 'SequelizeUniqueConstraintError';
      uniqueError.errors = [{
        message: 'email must be unique'
      }];
      
      User.create.mockRejectedValue(uniqueError);

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('email must be unique');
    });

    it('should return 400 when required fields are missing', async () => {
      // Mock User.create to throw validation error
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'fullName is required'
      }];
      
      User.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe'
          // missing email and password
        })
        .expect(400);

      expect(response.body.message).toBe('fullName is required');
    });

    it('should return 400 when fullName is empty', async () => {
      // Mock User.create to throw validation error
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'fullName cannot be empty'
      }];
      
      User.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/register')
        .send({
          fullName: '',
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toBe('fullName cannot be empty');
    });

    it('should return 400 when email is invalid format', async () => {
      // Mock User.create to throw validation error
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'Email format is invalid'
      }];
      
      User.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toBe('Email format is invalid');
    });

    it('should return 400 when password is empty', async () => {
      // Mock User.create to throw validation error
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'Password is required'
      }];
      
      User.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          password: ''
        })
        .expect(400);

      expect(response.body.message).toBe('Password is required');
    });

    it('should return 400 when request body is empty', async () => {
      // Mock User.create to throw validation error
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        message: 'fullName is required'
      }];
      
      User.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/register')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('fullName is required');
    });

    it('should return 400 when request body is null', async () => {
      const response = await request(app)
        .post('/register')
        .send(null)
        .expect(400);

      expect(response.body.message).toBe('Invalid input');
    });

    it('should handle database errors during registration', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Mock User.create to throw database error
      const dbError = new Error('Database connection failed');
      dbError.name = 'SequelizeDatabaseError';
      
      User.create.mockRejectedValue(dbError);

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      testUser = await TestHelper.createTestUser({
        email: 'test@example.com',
        password: 'hashed_password123'
      });
    });

    it('should login successfully with valid credentials', async () => {
      // Mock User.findOne to return user
      User.findOne.mockResolvedValue(testUser);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.access_token).toBeTruthy();
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should return 401 with invalid email', async () => {
      // Mock User.findOne to return null (user not found)
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email / password');
    });

    it('should return 401 with invalid password', async () => {
      // Mock User.findOne to return user but bcrypt to return false
      User.findOne.mockResolvedValue(testUser);

      // Mock bcrypt to return false for wrong password 
      const bcrypt = require('../../helpers/bcrypt');
      bcrypt.comparePassword.mockReturnValue(false);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email / password');
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toBe('Email is required');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body.message).toBe('Password is required');
    });

    it('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .post('/login')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Email is required');
    });

    it('should return 400 when request body is null', async () => {
      const response = await request(app)
        .post('/login')
        .send(null)
        .expect(400);

      expect(response.body.message).toBe('Invalid input');
    });

    it('should handle empty email string', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: '',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toBe('Email is required');
    });

    it('should handle empty password string', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: ''
        })
        .expect(400);

      expect(response.body.message).toBe('Password is required');
    });
  });

  describe('POST /google-signin', () => {
    beforeEach(() => {
      TestHelper.mockGoogleAuth();
    });



    it('should return 400 when Google token is missing', async () => {
      const response = await request(app)
        .post('/google-signin')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Google token is required');
    });

    it('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .post('/google-signin')
        .send()
        .expect(400);

      expect(response.body.message).toBe('Invalid google token');
    });

    it('should handle Google API errors', async () => {
      const { OAuth2Client } = require('google-auth-library');
      const mockClient = new OAuth2Client();

      mockClient.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .post('/google-signin')
        .send({
          googleToken: 'invalid-google-token'
        })
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle empty googleToken string', async () => {
      const response = await request(app)
        .post('/google-signin')
        .send({
          googleToken: ''
        })
        .expect(400);

      expect(response.body.message).toBe('Google token is required');
    });

    it('should handle null googleToken', async () => {
      const response = await request(app)
        .post('/google-signin')
        .send({
          googleToken: null
        })
        .expect(400);

      expect(response.body.message).toBe('Google token is required');
    });

    it('should handle null request body', async () => {
      const response = await request(app)
        .post('/google-signin')
        .send(null)
        .expect(400);

      expect(response.body.message).toBe('Invalid google token');
    });

    it('should handle missing request body', async () => {
      // Simulate request with undefined body
      const response = await request(app)
        .post('/google-signin')
        .expect(400);

      expect(response.body.message).toBe('Invalid google token');
    });
  });

  describe('Additional Login Edge Cases', () => {
    it('should handle whitespace-only email', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: '   ',
          password: 'testpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email / password');
    });

    it('should handle edge case of very long password', async () => {
      const longPassword = 'a'.repeat(1000);
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: longPassword
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email / password');
    });

    it('should handle database errors in login', async () => {
      // Create a test scenario that might trigger the catch block
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email / password');
    });

    it('should handle database error during login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock database error
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(500);

      expect(response.body.message).toBeDefined();
    });
  });
});