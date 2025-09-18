// Unmock http for these tests
jest.unmock('../../helpers/http');

describe('http.js Helper Coverage', () => {
  describe('moralis axios instance', () => {
    it('should be defined', () => {
      const http = require('../../helpers/http');
      expect(http.moralis).toBeDefined();
    });

    it('should have correct baseURL', () => {
      const http = require('../../helpers/http');
      expect(http.moralis.defaults.baseURL).toBe('https://deep-index.moralis.io/');
    });

    it('should be an axios instance', () => {
      const http = require('../../helpers/http');
      expect(typeof http.moralis.get).toBe('function');
      expect(typeof http.moralis.post).toBe('function');
    });
  });

  describe('coinGecko axios instance', () => {
    it('should be defined', () => {
      const http = require('../../helpers/http');
      expect(http.coinGecko).toBeDefined();
    });

    it('should have correct baseURL', () => {
      const http = require('../../helpers/http');
      expect(http.coinGecko.defaults.baseURL).toBe('https://api.coingecko.com/api/v3/');
    });

    it('should be an axios instance', () => {
      const http = require('../../helpers/http');
      expect(typeof http.coinGecko.get).toBe('function');
      expect(typeof http.coinGecko.post).toBe('function');
    });
  });

  describe('module exports', () => {
    it('should export both instances', () => {
      const http = require('../../helpers/http');
      expect(http).toBeDefined();
      expect(typeof http).toBe('object');
      expect(Object.keys(http)).toEqual(['moralis', 'coinGecko']);
    });

    it('should have different instances', () => {
      const http = require('../../helpers/http');
      expect(http.moralis).not.toBe(http.coinGecko);
    });
  });
});
