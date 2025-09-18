const http = require('../../helpers/http');

describe('HTTP Helper', () => {
  describe('exported instances', () => {
    test('should export moralis instance', () => {
      expect(http).toHaveProperty('moralis');
      expect(typeof http.moralis).toBe('function');
    });

    test('should export coinGecko instance', () => {
      expect(http).toHaveProperty('coinGecko');
      expect(typeof http.coinGecko).toBe('function');
    });

    test('should only export moralis and coinGecko', () => {
      const expectedKeys = ['moralis', 'coinGecko'];
      const actualKeys = Object.keys(http);

      expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
      expect(actualKeys).toHaveLength(expectedKeys.length);
    });
  });

  describe('instance properties', () => {
    test('moralis instance should have correct baseURL', () => {
      expect(http.moralis.defaults).toBeDefined();
      expect(http.moralis.defaults.baseURL).toBe('https://deep-index.moralis.io/');
    });

    test('coinGecko instance should have correct baseURL', () => {
      expect(http.coinGecko.defaults).toBeDefined();
      expect(http.coinGecko.defaults.baseURL).toBe('https://api.coingecko.com/api/v3/');
    });

    test('instances should be different objects', () => {
      expect(http.moralis).not.toBe(http.coinGecko);
    });
  });

  describe('instance functionality', () => {
    test('moralis instance should be callable', () => {
      expect(() => {
        // Test that the instance is a function (axios instance)
        expect(typeof http.moralis).toBe('function');
        expect(http.moralis.get).toBeDefined();
        expect(http.moralis.post).toBeDefined();
      }).not.toThrow();
    });

    test('coinGecko instance should be callable', () => {
      expect(() => {
        // Test that the instance is a function (axios instance)
        expect(typeof http.coinGecko).toBe('function');
        expect(http.coinGecko.get).toBeDefined();
        expect(http.coinGecko.post).toBeDefined();
      }).not.toThrow();
    });
  });
});