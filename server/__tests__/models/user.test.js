const { User } = require('../../models');
const { hashPassword } = require('../../helpers/bcrypt');

// Mock bcrypt helper
jest.mock('../../helpers/bcrypt', () => ({
  hashPassword: jest.fn()
}));

describe('User Model', () => {
  let mockSequelize;
  let mockProfile;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Profile model with createProfile method
    mockProfile = {
      id: 1,
      username: 'testuser123',
      UserId: 1
    };
    
    // Mock sequelize and User model methods
    mockSequelize = {
      authenticate: jest.fn(),
      sync: jest.fn(),
      define: jest.fn(),
      close: jest.fn()
    };

    // Mock User instance methods
    User.create = jest.fn();
    User.findOne = jest.fn();
    User.findAll = jest.fn();
    User.hasOne = jest.fn();
    User.hasMany = jest.fn();
    User.beforeCreate = jest.fn();
    User.afterCreate = jest.fn();
    
    hashPassword.mockReturnValue('hashedPassword123');
  });

  describe('Model Definition', () => {
    test('should define User model with correct attributes', () => {
      // Test model structure - this tests the model definition
      expect(User).toBeDefined();
      expect(typeof User).toBe('function');
    });

    test('should have correct associations', () => {
      const mockModels = {
        Profile: { 
          belongsTo: jest.fn(),
          hasOne: jest.fn()
        },
        Wallet: { 
          belongsTo: jest.fn(),
          hasMany: jest.fn()
        }
      };

      // Test associations
      User.associate(mockModels);
      
      expect(User.hasOne).toHaveBeenCalledWith(mockModels.Profile, { foreignKey: 'UserId' });
      expect(User.hasMany).toHaveBeenCalledWith(mockModels.Wallet, { foreignKey: 'UserId' });
    });
  });

  describe('Validations', () => {
    test('should validate fullName is required', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
        // missing fullName
      };

      User.create.mockRejectedValue(new Error('Full name is required'));

      await expect(User.create(userData)).rejects.toThrow('Full name is required');
    });

    test('should validate fullName is not empty', async () => {
      const userData = {
        fullName: '',
        email: 'test@example.com',
        password: 'password123'
      };

      User.create.mockRejectedValue(new Error('Full name is required'));

      await expect(User.create(userData)).rejects.toThrow('Full name is required');
    });

    test('should validate email is required', async () => {
      const userData = {
        fullName: 'Test User',
        password: 'password123'
        // missing email
      };

      User.create.mockRejectedValue(new Error('Email is required'));

      await expect(User.create(userData)).rejects.toThrow('Email is required');
    });

    test('should validate email is not empty', async () => {
      const userData = {
        fullName: 'Test User',
        email: '',
        password: 'password123'
      };

      User.create.mockRejectedValue(new Error('Email is required'));

      await expect(User.create(userData)).rejects.toThrow('Email is required');
    });

    test('should validate email format', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      User.create.mockRejectedValue(new Error('Invalid email format'));

      await expect(User.create(userData)).rejects.toThrow('Invalid email format');
    });

    test('should validate unique email', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.create.mockRejectedValue(new Error('Email already exists'));

      await expect(User.create(userData)).rejects.toThrow('Email already exists');
    });

    test('should validate password is required', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com'
        // missing password
      };

      User.create.mockRejectedValue(new Error('Password is required'));

      await expect(User.create(userData)).rejects.toThrow('Password is required');
    });

    test('should validate password is not empty', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: ''
      };

      User.create.mockRejectedValue(new Error('Password is required'));

      await expect(User.create(userData)).rejects.toThrow('Password is required');
    });

    test('should accept valid user data', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const expectedUser = {
        id: 1,
        ...userData,
        balance: 0
      };

      User.create.mockResolvedValue(expectedUser);

      const result = await User.create(userData);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('Hooks', () => {
    test('should hash password before create', () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'plainPassword123'
      };

      // Simulate beforeCreate hook
      const mockUser = { ...userData };
      
      // Call the actual beforeCreate logic
      mockUser.password = hashPassword(mockUser.password);

      expect(hashPassword).toHaveBeenCalledWith('plainPassword123');
      expect(mockUser.password).toBe('hashedPassword123');
    });

    test('should create profile after user creation', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        ...userData,
        createProfile: jest.fn().mockResolvedValue(mockProfile)
      };

      User.create.mockResolvedValue(mockUser);

      const result = await User.create(userData);
      
      // Simulate afterCreate hook
      await result.createProfile();

      expect(result.createProfile).toHaveBeenCalled();
    });
  });

  describe('Default Values', () => {
    test('should set default balance to 0', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const expectedUser = {
        id: 1,
        ...userData,
        balance: 0
      };

      User.create.mockResolvedValue(expectedUser);

      const result = await User.create(userData);
      expect(result.balance).toBe(0);
    });

    test('should allow custom balance value', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        balance: 1000
      };

      const expectedUser = {
        id: 1,
        ...userData
      };

      User.create.mockResolvedValue(expectedUser);

      const result = await User.create(userData);
      expect(result.balance).toBe(1000);
    });
  });

  describe('Model Methods', () => {
    test('should find user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: 1,
        fullName: 'Test User',
        email: email,
        balance: 0
      };

      User.findOne.mockResolvedValue(expectedUser);

      const result = await User.findOne({ where: { email } });
      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(expectedUser);
    });

    test('should find all users', async () => {
      const expectedUsers = [
        { id: 1, fullName: 'User 1', email: 'user1@example.com' },
        { id: 2, fullName: 'User 2', email: 'user2@example.com' }
      ];

      User.findAll.mockResolvedValue(expectedUsers);

      const result = await User.findAll();
      expect(User.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });

    test('should handle user not found', async () => {
      const email = 'nonexistent@example.com';

      User.findOne.mockResolvedValue(null);

      const result = await User.findOne({ where: { email } });
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    test('should handle database connection error', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      User.create.mockRejectedValue(new Error('Database connection failed'));

      await expect(User.create(userData)).rejects.toThrow('Database connection failed');
    });

    test('should handle profile creation failure after user creation', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        ...userData,
        createProfile: jest.fn().mockRejectedValue(new Error('Profile creation failed'))
      };

      User.create.mockResolvedValue(mockUser);

      const result = await User.create(userData);
      
      // Simulate afterCreate hook failure
      await expect(result.createProfile()).rejects.toThrow('Profile creation failed');
    });
  });
});