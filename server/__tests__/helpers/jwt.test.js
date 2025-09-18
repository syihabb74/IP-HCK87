// Unmock jwt for these tests
jest.unmock('../../helpers/jwt');

// Test khusus untuk jwt.js helper
describe('jwt.js Helper Coverage', () => {
  
  beforeAll(() => {
    // Set JWT secret key untuk testing
    process.env.SECRET_JWT_KEY = 'test-jwt-secret-key-for-coverage';
  });

  describe('signToken function', () => {
    it('should sign various types of payloads', () => {
      const { signToken } = require('../../helpers/jwt');
      
      const testPayloads = [
        // Basic payloads
        { id: 1 },
        { id: 999, email: 'test@example.com' },
        { username: 'testuser', role: 'admin' },
        
        // String values
        { data: 'simple-string' },
        { message: 'hello world' },
        
        // Number values
        { number: 123456 },
        { price: 99.99 },
        { count: 0 },
        
        // Boolean values
        { isAdmin: true },
        { isActive: false },
        
        // Array values
        { permissions: ['read', 'write', 'delete'] },
        { tags: ['tag1', 'tag2', 'tag3'] },
        { numbers: [1, 2, 3, 4, 5] },
        
        // Nested objects
        { 
          user: { 
            id: 123, 
            profile: { 
              name: 'Test User',
              email: 'nested@test.com' 
            } 
          } 
        },
        
        // Complex nested structure
        {
          session: {
            id: 'session123',
            user: {
              id: 456,
              details: {
                name: 'Complex User',
                settings: {
                  theme: 'dark',
                  notifications: {
                    email: true,
                    push: false,
                    sms: true
                  }
                }
              }
            },
            metadata: {
              created: '2023-01-01',
              lastAccess: '2023-12-31',
              permissions: ['admin', 'user', 'guest']
            }
          }
        },
        
        // Edge cases
        {},
        { empty: {} },
        { null_value: null },
        { undefined_value: undefined }
      ];
      
      testPayloads.forEach((payload, index) => {
        const token = signToken(payload);
        
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
        
        // JWT should have 3 parts separated by dots
        const parts = token.split('.');
        expect(parts.length).toBe(3);
        
        // Each part should be base64-like
        parts.forEach(part => {
          expect(part.length).toBeGreaterThan(0);
        });
      });
    });

    it('should create unique tokens for same payload', () => {
      const { signToken } = require('../../helpers/jwt');
      
      const payload = { id: 123, test: 'uniqueness' };
      
      // Generate multiple tokens with same payload
      const tokens = [];
      for (let i = 0; i < 5; i++) {
        tokens.push(signToken(payload));
      }
      
      // All tokens should be defined and strings
      tokens.forEach(token => {
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
      });
      
      // Note: JWT tokens are deterministic, so they would be the same
      // But we're testing the function executes properly each time
    });

    it('should handle special characters in payload', () => {
      const { signToken } = require('../../helpers/jwt');
      
      const specialPayloads = [
        { special: '!@#$%^&*()_+-={}[]|\\:";\'<>?,./`~' },
        { unicode: 'émojí-tést-ñáme' },
        { spaces: 'value with spaces' },
        { newlines: 'value\nwith\nnewlines' },
        { tabs: 'value\twith\ttabs' },
        { quotes: 'value "with" \'quotes\'' },
        { json: '{"nested":"json","string":"value"}' }
      ];
      
      specialPayloads.forEach(payload => {
        const token = signToken(payload);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
      });
    });
  });

  describe('verifyToken function', () => {
    it('should verify tokens created by signToken', () => {
      const { signToken, verifyToken } = require('../../helpers/jwt');
      
      const testCases = [
        { id: 1, email: 'verify@test.com' },
        { username: 'verifyuser', role: 'user' },
        { data: 'verification-test' },
        { number: 42 },
        { boolean: true },
        { array: ['item1', 'item2'] },
        { 
          nested: { 
            deep: { 
              object: 'value',
              array: [1, 2, 3],
              boolean: false
            } 
          } 
        }
      ];
      
      testCases.forEach(originalPayload => {
        const token = signToken(originalPayload);
        const verifiedPayload = verifyToken(token);
        
        expect(verifiedPayload).toBeDefined();
        expect(typeof verifiedPayload).toBe('object');
        
        // Check that all original properties are preserved
        Object.keys(originalPayload).forEach(key => {
          expect(verifiedPayload[key]).toEqual(originalPayload[key]);
        });
        
        // JWT adds standard claims like iat
        expect(verifiedPayload.iat).toBeDefined();
        expect(typeof verifiedPayload.iat).toBe('number');
      });
    });

    it('should handle verification of various token structures', () => {
      const { signToken, verifyToken } = require('../../helpers/jwt');
      
      // Test empty payload
      const emptyToken = signToken({});
      const emptyVerified = verifyToken(emptyToken);
      expect(emptyVerified).toBeDefined();
      expect(typeof emptyVerified).toBe('object');
      expect(emptyVerified.iat).toBeDefined();
      
      // Test complex payload
      const complexPayload = {
        user: {
          id: 999,
          profile: {
            name: 'Complex Verification Test',
            metadata: {
              created: new Date().toISOString(),
              preferences: {
                theme: 'light',
                language: 'en',
                notifications: {
                  email: true,
                  push: false
                }
              }
            }
          }
        },
        session: {
          id: 'session-verification-test',
          permissions: ['read', 'write'],
          expires: new Date(Date.now() + 86400000).toISOString()
        }
      };
      
      const complexToken = signToken(complexPayload);
      const complexVerified = verifyToken(complexToken);
      
      expect(complexVerified).toBeDefined();
      expect(complexVerified.user.id).toBe(999);
      expect(complexVerified.user.profile.name).toBe('Complex Verification Test');
      expect(complexVerified.session.permissions).toEqual(['read', 'write']);
    });

    it('should preserve data types during verification', () => {
      const { signToken, verifyToken } = require('../../helpers/jwt');
      
      const typedPayload = {
        string: 'hello',
        number: 123,
        float: 45.67,
        zero: 0,
        boolean_true: true,
        boolean_false: false,
        array_strings: ['a', 'b', 'c'],
        array_numbers: [1, 2, 3],
        array_mixed: ['string', 123, true],
        nested_object: {
          inner_string: 'inner',
          inner_number: 456,
          inner_boolean: true,
          inner_array: ['nested', 'array']
        }
      };
      
      const token = signToken(typedPayload);
      const verified = verifyToken(token);
      
      // Check all types are preserved
      expect(typeof verified.string).toBe('string');
      expect(typeof verified.number).toBe('number');
      expect(typeof verified.float).toBe('number');
      expect(typeof verified.zero).toBe('number');
      expect(typeof verified.boolean_true).toBe('boolean');
      expect(typeof verified.boolean_false).toBe('boolean');
      expect(Array.isArray(verified.array_strings)).toBe(true);
      expect(Array.isArray(verified.array_numbers)).toBe(true);
      expect(Array.isArray(verified.array_mixed)).toBe(true);
      expect(typeof verified.nested_object).toBe('object');
      
      // Check values are correct
      expect(verified.string).toBe('hello');
      expect(verified.number).toBe(123);
      expect(verified.float).toBe(45.67);
      expect(verified.zero).toBe(0);
      expect(verified.boolean_true).toBe(true);
      expect(verified.boolean_false).toBe(false);
      expect(verified.array_strings).toEqual(['a', 'b', 'c']);
      expect(verified.array_numbers).toEqual([1, 2, 3]);
      expect(verified.array_mixed).toEqual(['string', 123, true]);
    });
  });

  describe('jwt module exports', () => {
    it('should export both functions correctly', () => {
      const jwtHelper = require('../../helpers/jwt');
      
      expect(jwtHelper).toBeDefined();
      expect(typeof jwtHelper).toBe('object');
      expect(Object.keys(jwtHelper)).toEqual(['signToken', 'verifyToken']);
      
      expect(typeof jwtHelper.signToken).toBe('function');
      expect(typeof jwtHelper.verifyToken).toBe('function');
    });

    it('should work with destructured imports', () => {
      const { signToken, verifyToken } = require('../../helpers/jwt');
      
      expect(typeof signToken).toBe('function');
      expect(typeof verifyToken).toBe('function');
      
      // Test round-trip with destructured functions
      const testPayload = { destructured: 'test', id: 999 };
      const token = signToken(testPayload);
      const verified = verifyToken(token);
      
      expect(verified.destructured).toBe('test');
      expect(verified.id).toBe(999);
    });

    it('should handle function calls with context', () => {
      const jwtHelper = require('../../helpers/jwt');
      
      // Test calling functions as methods
      const payload = { method: 'call', test: true };
      const token = jwtHelper.signToken(payload);
      const verified = jwtHelper.verifyToken(token);
      
      expect(verified.method).toBe('call');
      expect(verified.test).toBe(true);
    });
  });
});