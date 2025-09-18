const bcrypt = require('bcryptjs');
const { hashPassword, comparePassword } = require('../../helpers/bcrypt');

// Mock bcryptjs
jest.mock('bcryptjs');

describe('Bcrypt Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    test('should hash password successfully', () => {
      const password = 'testpassword123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.hashSync.mockReturnValue(hashedPassword);

      const result = hashPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    test('should use salt rounds of 10', () => {
      const password = 'testpassword123';

      hashPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
    });

    test('should handle empty password', () => {
      const password = '';
      const hashedPassword = 'hashedemptypassword';

      bcrypt.hashSync.mockReturnValue(hashedPassword);

      const result = hashPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    test('should handle long password', () => {
      const password = 'a'.repeat(1000);
      const hashedPassword = 'hashedlongpassword';

      bcrypt.hashSync.mockReturnValue(hashedPassword);

      const result = hashPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    test('should handle special characters in password', () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = 'hashedspecialpassword';

      bcrypt.hashSync.mockReturnValue(hashedPassword);

      const result = hashPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    test('should return true for matching passwords', () => {
      const password = 'testpassword123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.compareSync.mockReturnValue(true);

      const result = comparePassword(password, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    test('should return false for non-matching passwords', () => {
      const password = 'testpassword123';
      const hashedPassword = 'differenthashedpassword';

      bcrypt.compareSync.mockReturnValue(false);

      const result = comparePassword(password, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    test('should handle empty passwords', () => {
      const password = '';
      const hashedPassword = '';

      bcrypt.compareSync.mockReturnValue(false);

      const result = comparePassword(password, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    test('should handle null/undefined passwords', () => {
      bcrypt.compareSync.mockReturnValue(false);

      const result1 = comparePassword(null, 'hashedpassword');
      const result2 = comparePassword('password', null);
      const result3 = comparePassword(undefined, undefined);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });

    test('should handle special characters comparison', () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = 'hashedspecialpassword';

      bcrypt.compareSync.mockReturnValue(true);

      const result = comparePassword(password, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    test('should handle case sensitivity', () => {
      const password = 'TestPassword123';
      const hashedPassword = 'hashedpassword';

      bcrypt.compareSync.mockReturnValue(false);

      const result = comparePassword(password.toLowerCase(), hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password.toLowerCase(), hashedPassword);
      expect(result).toBe(false);
    });

    test('should handle Unicode characters', () => {
      const password = 'パスワード123🔒';
      const hashedPassword = 'hashedunicodepassword';

      bcrypt.compareSync.mockReturnValue(true);

      const result = comparePassword(password, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });
  });
});