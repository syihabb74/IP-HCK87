// Unmock bcrypt for these tests
jest.unmock('../../helpers/bcrypt');

describe('bcrypt.js Helper Coverage', () => {
  
  describe('hashPassword function', () => {
    it('should hash different passwords', () => {
      const { hashPassword } = require('../../helpers/bcrypt');
      
      const passwords = ['test123', 'password', '12345', 'complex_password!@#'];
      
      passwords.forEach(password => {
        const hashed = hashPassword(password);
        expect(hashed).toBeDefined();
        expect(typeof hashed).toBe('string');
        expect(hashed.length).toBeGreaterThan(0);
        expect(hashed).not.toBe(password);
      });
    });

    it('should produce different hashes for same password due to salt', () => {
      const { hashPassword } = require('../../helpers/bcrypt');
      
      const password = 'samePassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).toBeDefined();
      expect(hash2).toBeDefined();
      expect(hash1).not.toBe(hash2);
      expect(hash1.length).toBe(hash2.length);
    });

    it('should handle various password types', () => {
      const { hashPassword } = require('../../helpers/bcrypt');
      
      const testCases = [
        'simplepassword',
        '123456789',
        'Password!@#$%',
        'very_long_password_with_many_characters_to_test_limits',
        'sp3c!@l_ch@r$',
        'áéíóú_unicode',
        ''
      ];
      
      testCases.forEach(password => {
        const hash = hashPassword(password);
        expect(hash).toBeDefined();
        expect(typeof hash).toBe('string');
      });
    });
  });

  describe('comparePassword function', () => {
    it('should correctly compare passwords with their hashes', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      const passwords = ['test123', 'mypassword', '12345', 'complex_pass!'];
      
      passwords.forEach(password => {
        const hash = hashPassword(password);
        
        const correctResult = comparePassword(password, hash);
        expect(correctResult).toBe(true);
        
        const wrongResult = comparePassword('wrong_password', hash);
        expect(wrongResult).toBe(false);
      });
    });

    it('should handle comparison edge cases', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      const password = 'testPassword123';
      const hash = hashPassword(password);
      
      expect(comparePassword(password, hash)).toBe(true);
      expect(comparePassword('wrongPassword', hash)).toBe(false);
      expect(comparePassword('', hash)).toBe(false);
      expect(comparePassword(password, 'invalidhash')).toBe(false);
    });

    it('should handle various comparison scenarios', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      const testPasswords = [
        'simple',
        'complex!@#$',
        '123456',
        'very_long_password_for_testing_purposes',
        'short'
      ];
      
      testPasswords.forEach(password => {
        const hash = hashPassword(password);
        
        expect(comparePassword(password, hash)).toBe(true);
        expect(comparePassword(password + '_wrong', hash)).toBe(false);
        // Note: bcrypt is case-sensitive, but some edge cases might match
        if (password !== password.toUpperCase()) {
          expect(comparePassword(password.toUpperCase(), hash)).toBe(false);
        }
      });
    });
  });

  describe('bcrypt module exports', () => {
    it('should export hashPassword and comparePassword functions', () => {
      const bcryptHelper = require('../../helpers/bcrypt');
      
      expect(bcryptHelper).toBeDefined();
      expect(typeof bcryptHelper).toBe('object');
      expect(Object.keys(bcryptHelper)).toEqual(['hashPassword', 'comparePassword']);
      
      expect(typeof bcryptHelper.hashPassword).toBe('function');
      expect(typeof bcryptHelper.comparePassword).toBe('function');
    });

    it('should work with destructured imports', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      expect(typeof hashPassword).toBe('function');
      expect(typeof comparePassword).toBe('function');
      
      const password = 'destructured_test';
      const hash = hashPassword(password);
      const isValid = comparePassword(password, hash);
      
      expect(hash).toBeDefined();
      expect(isValid).toBe(true);
    });

    it('should handle module loading multiple times', () => {
      const bcryptHelper1 = require('../../helpers/bcrypt');
      const bcryptHelper2 = require('../../helpers/bcrypt');
      
      expect(bcryptHelper1).toBe(bcryptHelper2);
      expect(bcryptHelper1.hashPassword).toBe(bcryptHelper2.hashPassword);
      expect(bcryptHelper1.comparePassword).toBe(bcryptHelper2.comparePassword);
    });
  });

  describe('bcrypt integration tests', () => {
    it('should handle round-trip hashing and comparison', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      const testData = [
        { password: 'user123', shouldMatch: 'user123', shouldNotMatch: 'user124' },
        { password: 'admin!@#', shouldMatch: 'admin!@#', shouldNotMatch: 'admin123' },
        { password: '', shouldMatch: '', shouldNotMatch: 'notempty' },
        { password: 'test_password', shouldMatch: 'test_password', shouldNotMatch: 'test_Password' }
      ];
      
      testData.forEach(({ password, shouldMatch, shouldNotMatch }) => {
        const hash = hashPassword(password);
        
        expect(comparePassword(shouldMatch, hash)).toBe(true);
        expect(comparePassword(shouldNotMatch, hash)).toBe(false);
      });
    });

    it('should handle concurrent operations', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      const passwords = ['concurrent1', 'concurrent2', 'concurrent3', 'concurrent4'];
      const hashes = passwords.map(password => hashPassword(password));
      
      passwords.forEach((password, index) => {
        expect(comparePassword(password, hashes[index])).toBe(true);
        
        passwords.forEach((otherPassword, otherIndex) => {
          if (index !== otherIndex) {
            expect(comparePassword(otherPassword, hashes[index])).toBe(false);
          }
        });
      });
    });

    it('should handle hash consistency', () => {
      const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
      
      const password = 'consistency_test';
      const hash = hashPassword(password);
      
      for (let i = 0; i < 5; i++) {
        expect(comparePassword(password, hash)).toBe(true);
        expect(comparePassword('wrong_password', hash)).toBe(false);
      }
    });
  });
});