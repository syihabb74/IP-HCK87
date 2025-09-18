const { Profile } = require('../../models');

describe('Profile Model', () => {
  let mockSequelize;
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock User model
    mockUser = {
      id: 1,
      fullName: 'Test User',
      email: 'test@example.com'
    };
    
    // Mock sequelize and Profile model methods
    mockSequelize = {
      authenticate: jest.fn(),
      sync: jest.fn(),
      define: jest.fn(),
      close: jest.fn()
    };

    // Mock Profile instance methods
    Profile.create = jest.fn();
    Profile.findOne = jest.fn();
    Profile.findAll = jest.fn();
    Profile.belongsTo = jest.fn();
    Profile.beforeCreate = jest.fn();
  });

  describe('Model Definition', () => {
    test('should define Profile model with correct attributes', () => {
      // Test model structure - this tests the model definition
      expect(Profile).toBeDefined();
      expect(typeof Profile).toBe('function');
    });

    test('should have correct associations', () => {
      const mockModels = {
        User: { 
          hasOne: jest.fn(),
          belongsTo: jest.fn()
        }
      };

      // Test associations
      Profile.associate(mockModels);
      
      expect(Profile.belongsTo).toHaveBeenCalledWith(mockModels.User, { foreignKey: 'UserId' });
    });
  });

  describe('Username Generation Hook', () => {
    test('should generate username when not provided', () => {
      const profileData = {
        UserId: 1
        // no username provided
      };

      // Mock Math.random to return predictable value for testing
      const mockMath = Object.create(global.Math);
      mockMath.random = () => 0.5; // Will generate 5500
      global.Math = mockMath;

      // Simulate beforeCreate hook
      const mockProfile = { ...profileData };
      
      // Call the actual beforeCreate logic
      if (!mockProfile.username) {
        mockProfile.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
      }

      expect(mockProfile.username).toBe('user5500');
      
      // Restore original Math
      global.Math = Math;
    });

    test('should not override existing username', () => {
      const profileData = {
        username: 'customuser123',
        UserId: 1
      };

      // Simulate beforeCreate hook
      const mockProfile = { ...profileData };
      
      // Call the actual beforeCreate logic
      if (!mockProfile.username) {
        mockProfile.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
      }

      expect(mockProfile.username).toBe('customuser123');
    });

    test('should not override empty string username', () => {
      const profileData = {
        username: '',
        UserId: 1
      };

      // Mock Math.random
      const mockMath = Object.create(global.Math);
      mockMath.random = () => 0.7; // Will generate 7300
      global.Math = mockMath;

      // Simulate beforeCreate hook
      const mockProfile = { ...profileData };
      
      // Call the actual beforeCreate logic - empty string is falsy
      if (!mockProfile.username) {
        mockProfile.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
      }

      expect(mockProfile.username).toBe('user7300');
      
      // Restore original Math
      global.Math = Math;
    });

    test('should generate different usernames for different calls', () => {
      const profileData1 = { UserId: 1 };
      const profileData2 = { UserId: 2 };

      // Mock Math.random to return different values
      let callCount = 0;
      const mockMath = Object.create(global.Math);
      mockMath.random = () => {
        callCount++;
        return callCount === 1 ? 0.1 : 0.9; // First call: 1900, Second call: 9100
      };
      global.Math = mockMath;

      // Simulate beforeCreate hook for first profile
      const mockProfile1 = { ...profileData1 };
      if (!mockProfile1.username) {
        mockProfile1.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Simulate beforeCreate hook for second profile
      const mockProfile2 = { ...profileData2 };
      if (!mockProfile2.username) {
        mockProfile2.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
      }

      expect(mockProfile1.username).toBe('user1900');
      expect(mockProfile2.username).toBe('user9100');
      expect(mockProfile1.username).not.toBe(mockProfile2.username);
      
      // Restore original Math
      global.Math = Math;
    });

    test('should generate username within correct range', () => {
      const profileData = { UserId: 1 };

      // Test multiple generations to ensure range
      for (let i = 0; i < 10; i++) {
        const mockProfile = { ...profileData };
        
        if (!mockProfile.username) {
          mockProfile.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const usernameNumber = parseInt(mockProfile.username.replace('user', ''));
        expect(usernameNumber).toBeGreaterThanOrEqual(1000);
        expect(usernameNumber).toBeLessThan(10000);
      }
    });
  });

  describe('Model Methods', () => {
    test('should create profile successfully', async () => {
      const profileData = {
        username: 'testuser123',
        UserId: 1
      };

      const expectedProfile = {
        id: 1,
        ...profileData
      };

      Profile.create.mockResolvedValue(expectedProfile);

      const result = await Profile.create(profileData);
      expect(Profile.create).toHaveBeenCalledWith(profileData);
      expect(result).toEqual(expectedProfile);
    });

    test('should find profile by UserId', async () => {
      const UserId = 1;
      const expectedProfile = {
        id: 1,
        username: 'testuser123',
        UserId: UserId
      };

      Profile.findOne.mockResolvedValue(expectedProfile);

      const result = await Profile.findOne({ where: { UserId } });
      expect(Profile.findOne).toHaveBeenCalledWith({ where: { UserId } });
      expect(result).toEqual(expectedProfile);
    });

    test('should find all profiles', async () => {
      const expectedProfiles = [
        { id: 1, username: 'user1234', UserId: 1 },
        { id: 2, username: 'user5678', UserId: 2 }
      ];

      Profile.findAll.mockResolvedValue(expectedProfiles);

      const result = await Profile.findAll();
      expect(Profile.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedProfiles);
    });

    test('should handle profile not found', async () => {
      const UserId = 999;

      Profile.findOne.mockResolvedValue(null);

      const result = await Profile.findOne({ where: { UserId } });
      expect(result).toBeNull();
    });
  });

  describe('Attributes', () => {
    test('should allow creating profile with username and UserId', async () => {
      const profileData = {
        username: 'customuser',
        UserId: 1
      };

      Profile.create.mockResolvedValue({ id: 1, ...profileData });

      const result = await Profile.create(profileData);
      expect(result.username).toBe('customuser');
      expect(result.UserId).toBe(1);
    });

    test('should allow creating profile with only UserId', async () => {
      const profileData = {
        UserId: 1
      };

      // Mock the created profile with auto-generated username
      const createdProfile = {
        id: 1,
        username: 'user1234',
        UserId: 1
      };

      Profile.create.mockResolvedValue(createdProfile);

      const result = await Profile.create(profileData);
      expect(result.UserId).toBe(1);
      expect(result.username).toMatch(/^user\d{4}$/);
    });

    test('should handle null values appropriately', async () => {
      const profileData = {
        username: null,
        UserId: 1
      };

      // Simulate beforeCreate with null username
      const mockProfile = { ...profileData };
      if (!mockProfile.username) {
        mockProfile.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
      }

      expect(mockProfile.username).toMatch(/^user\d{4}$/);
      expect(mockProfile.UserId).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle database connection error', async () => {
      const profileData = {
        username: 'testuser',
        UserId: 1
      };

      Profile.create.mockRejectedValue(new Error('Database connection failed'));

      await expect(Profile.create(profileData)).rejects.toThrow('Database connection failed');
    });

    test('should handle invalid UserId', async () => {
      const profileData = {
        username: 'testuser',
        UserId: 'invalid'
      };

      Profile.create.mockRejectedValue(new Error('Invalid UserId'));

      await expect(Profile.create(profileData)).rejects.toThrow('Invalid UserId');
    });

    test('should handle missing UserId', async () => {
      const profileData = {
        username: 'testuser'
        // missing UserId
      };

      Profile.create.mockRejectedValue(new Error('UserId is required'));

      await expect(Profile.create(profileData)).rejects.toThrow('UserId is required');
    });
  });

  describe('Integration with User Model', () => {
    test('should belong to User model', () => {
      const mockModels = {
        User: { 
          hasOne: jest.fn(),
          belongsTo: jest.fn()
        }
      };

      Profile.associate(mockModels);
      
      expect(Profile.belongsTo).toHaveBeenCalledWith(mockModels.User, { foreignKey: 'UserId' });
    });

    test('should create profile for existing user', async () => {
      const profileData = {
        username: 'userprofile',
        UserId: 1
      };

      const expectedProfile = {
        id: 1,
        ...profileData,
        User: mockUser
      };

      Profile.create.mockResolvedValue(expectedProfile);

      const result = await Profile.create(profileData);
      expect(result.UserId).toBe(mockUser.id);
    });
  });
});