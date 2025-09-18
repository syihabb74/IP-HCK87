const PortofolioController = require('../../controllers/PortofolioController');
const http = require('../../helpers/http');

// Mock the http helper
jest.mock('../../helpers/http');

describe('PortofolioController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getPortofolio', () => {
        test('should return error when wallets query is missing', async () => {
            req.query = {};

            await PortofolioController.getPortofolio(req, res, next);

            expect(next).toHaveBeenCalledWith({
                name: 'NotFound',
                message: 'You dont have any wallet yet please connect first'
            });
        });

        test('should successfully get portfolio with single wallet', async () => {
            req.query = { wallets: '0x123abc' };

            // Mock successful API responses
            const mockNetWorthResponse = {
                data: { total_networth_usd: '100.50' }
            };
            const mockTokensResponse = {
                data: { result: [{ symbol: 'ETH', balance: '1.5' }] }
            };

            http.moralis
                .mockResolvedValueOnce(mockNetWorthResponse)
                .mockResolvedValueOnce(mockTokensResponse);

            await PortofolioController.getPortofolio(req, res, next);

            expect(http.moralis).toHaveBeenCalledTimes(2);
            expect(http.moralis).toHaveBeenNthCalledWith(1, {
                url: '/api/v2.2/wallets/0x123abc/net-worth',
                method: 'GET',
                headers: { 'X-API-Key': process.env.MORALIS_API_KEY }
            });
            expect(http.moralis).toHaveBeenNthCalledWith(2, {
                url: '/api/v2.2/wallets/0x123abc/tokens',
                method: 'GET',
                headers: { 'X-API-Key': process.env.MORALIS_API_KEY },
                params: { chain: 'eth', format: 'decimal' }
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    totalBalance: 100.5,
                    nativeAndToken: [[{ symbol: 'ETH', balance: '1.5' }]]
                }
            });
        });

        test('should handle multiple wallets', async () => {
            req.query = { wallets: '0x123abc, 0x456def' };

            const mockNetWorthResponse1 = { data: { total_networth_usd: '100.50' } };
            const mockTokensResponse1 = { data: { result: [{ symbol: 'ETH', balance: '1.5' }] } };
            const mockNetWorthResponse2 = { data: { total_networth_usd: '200.75' } };
            const mockTokensResponse2 = { data: { result: [{ symbol: 'BTC', balance: '0.1' }] } };

            http.moralis
                .mockResolvedValueOnce(mockNetWorthResponse1)
                .mockResolvedValueOnce(mockTokensResponse1)
                .mockResolvedValueOnce(mockNetWorthResponse2)
                .mockResolvedValueOnce(mockTokensResponse2);

            await PortofolioController.getPortofolio(req, res, next);

            expect(http.moralis).toHaveBeenCalledTimes(4);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    totalBalance: 301.25,
                    nativeAndToken: [
                        [{ symbol: 'ETH', balance: '1.5' }],
                        [{ symbol: 'BTC', balance: '0.1' }]
                    ]
                }
            });
        });

        test('should handle null/undefined networth data', async () => {
            req.query = { wallets: '0x123abc' };

            const mockNetWorthResponse = { data: null };
            const mockTokensResponse = { data: { result: [{ symbol: 'ETH', balance: '1.5' }] } };

            http.moralis
                .mockResolvedValueOnce(mockNetWorthResponse)
                .mockResolvedValueOnce(mockTokensResponse);

            await PortofolioController.getPortofolio(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    totalBalance: 0,
                    nativeAndToken: [[{ symbol: 'ETH', balance: '1.5' }]]
                }
            });
        });

        test('should handle null/undefined tokens data', async () => {
            req.query = { wallets: '0x123abc' };

            const mockNetWorthResponse = { data: { total_networth_usd: '100.50' } };
            const mockTokensResponse = { data: null };

            http.moralis
                .mockResolvedValueOnce(mockNetWorthResponse)
                .mockResolvedValueOnce(mockTokensResponse);

            await PortofolioController.getPortofolio(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    totalBalance: 100.5,
                    nativeAndToken: [[]]
                }
            });
        });

        test('should handle wallet-specific API errors', async () => {
            req.query = { wallets: '0x123abc' };

            // Mock API error for this wallet
            http.moralis
                .mockRejectedValueOnce(new Error('API Error'))
                .mockRejectedValueOnce(new Error('API Error'));

            await PortofolioController.getPortofolio(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    totalBalance: 0,
                    nativeAndToken: [[]]
                }
            });
        });

        test('should handle general controller errors', async () => {
            req.query = { wallets: '0x123abc' };

            // Force an error in the try-catch block by making req invalid
            req.query = null;

            await PortofolioController.getPortofolio(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test('should handle invalid networth values', async () => {
            req.query = { wallets: '0x123abc' };

            const mockNetWorthResponse = { data: { total_networth_usd: 'invalid' } };
            const mockTokensResponse = { data: { result: [] } };

            http.moralis
                .mockResolvedValueOnce(mockNetWorthResponse)
                .mockResolvedValueOnce(mockTokensResponse);

            await PortofolioController.getPortofolio(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    totalBalance: 0,
                    nativeAndToken: [[]]
                }
            });
        });
    });
});
