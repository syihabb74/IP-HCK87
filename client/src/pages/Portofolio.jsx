import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import EmptyStateIcon from '../components/EmptyStateIcon'
import TokenCard from '../components/TokenCard'
import http from '../utils/http'
import { useSearchParams } from 'react-router'
import { errorAlert } from '../utils/sweetAlert';

export default function Portofolio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: wallets } = useSelector(state => state.wallet);
  const [portfolioData, setPortfolioData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);

  useEffect(() => {

    // Handle different possible wallet data structures
    const walletsArray = wallets?.Wallets || wallets?.data?.Wallets || wallets || [];

    if (walletsArray?.length > 0 && !searchParams.get('wallets')) {
      const addresses = walletsArray.map(wallet => wallet.address).join(',');
      const params = new URLSearchParams();
      params.set('wallets', addresses);
      setSearchParams(params);
    }
  }, [wallets, searchParams]);

  const walletsQuery = searchParams.get('wallets');

  // Helper function untuk generate token icon colors
  const getTokenIconColor = (symbol) => {
    const colors = {
      'ETH': 'bg-blue-500',
      'BTC': 'bg-orange-500',
      'USDT': 'bg-green-500',
      'USDC': 'bg-blue-600',
      'BNB': 'bg-yellow-500',
      'ADA': 'bg-blue-600',
      'SOL': 'bg-purple-500',
      'MATIC': 'bg-purple-600',
      'LINK': 'bg-blue-400',
      'UNI': 'bg-pink-500'
    };
    return colors[symbol?.toUpperCase()] || 'bg-gray-500';
  };

  const fetchingPortofolios = async () => {
    setIsLoadingPortfolio(true);
    setPortfolioError(null);

    try {
      const response = await http({
        method: 'GET',
        url: `/portofolios?wallets=${walletsQuery}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      // Handle the new server response structure
      if (response.data && response.data.success && response.data.data) {
        setPortfolioData(response.data.data);
      } else {
        // Fallback for old response structure
        setPortfolioData(response.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Failed to fetch portfolio data';
      setPortfolioError(errorMessage);
      errorAlert('Portfolio Error', errorMessage);
    } finally {
      setIsLoadingPortfolio(false);
    }
  }



  // Fetch portfolio when wallets query is available
  useEffect(() => {
    if (walletsQuery) {
      fetchingPortofolios();
    }
  }, [walletsQuery]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);



  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-slate-400">Track all your crypto assets across connected wallets</p>

        </div>

        {/* Portfolio Overview Card */}
        <div className="mb-8">
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
            <h3 className="text-xl font-semibold text-slate-300 mb-4">Total Portfolio Value</h3>
            <p className="text-5xl font-bold text-green-400 mb-2">
              {isLoadingPortfolio ? 'Loading...' : `$${portfolioData?.totalBalance ? portfolioData.totalBalance.toLocaleString() : '0.00'}`}
            </p>
            <p className="text-lg text-slate-400">
              Across {walletsQuery ? walletsQuery.split(',').length : 0} connected wallets
            </p>
          </div>
        </div>


        {/* Portfolio Holdings Section */}
        <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '600ms'}}>
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Portfolio Holdings</h2>
          </div>

          <div className="p-6">
            {portfolioError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-400 font-medium">Error loading portfolio:</p>
                <p className="text-red-300 text-sm">{portfolioError}</p>
              </div>
            )}

            <div className="space-y-4">
              {isLoadingPortfolio ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="text-slate-400 mt-4">Loading portfolio data...</p>
                </div>
              ) : portfolioData?.nativeAndToken ? (
                (() => {

                  // Ensure nativeAndToken is an array
                  const tokensArray = Array.isArray(portfolioData.nativeAndToken)
                    ? portfolioData.nativeAndToken
                    : [];

                  if (tokensArray.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <EmptyStateIcon />
                        <p className="text-slate-400 mt-4">No tokens found in your wallets</p>
                      </div>
                    );
                  }

                  // Aggregate tokens by symbol
                  const aggregatedTokens = {};

                  tokensArray.flat().forEach(token => {
                    if (!token || typeof token !== 'object') {
                      console.warn('Invalid token object:', token);
                      return;
                    }

                    const symbol = token.symbol || 'UNKNOWN';
                    const tokenValue = parseFloat(token.usd_value || 0);
                    const tokenBalance = parseFloat(token.balance_formatted || token.balance || 0);
                    if (aggregatedTokens[symbol]) {
                      // Add to existing token
                      aggregatedTokens[symbol].totalValue += tokenValue;
                      aggregatedTokens[symbol].totalBalance += tokenBalance;
                    } else {
                      // Create new token entry
                      aggregatedTokens[symbol] = {
                        name: token.name || token.symbol || 'Unknown Token',
                        symbol: symbol,
                        totalValue: tokenValue,
                        totalBalance: tokenBalance
                      };
                    }
                  });

                  const tokensList = Object.values(aggregatedTokens);

                  if (tokensList.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <EmptyStateIcon />
                        <p className="text-slate-400 mt-4">No valid tokens found</p>
                      </div>
                    );
                  }

                  // Convert to array and render
                  return tokensList.map((token, index) => (
                    <TokenCard
                      key={token.symbol + index}
                      icon={token.symbol?.charAt(0)?.toUpperCase() || 'T'}
                      name={token.name}
                      symbol={token.symbol}
                      amount={token.totalBalance.toFixed(4)}
                      value={`$${token.totalValue.toFixed(2)}`}
                      changePercent={0} // Moralis doesn't provide 24h change in this endpoint
                      iconBgColor={getTokenIconColor(token.symbol)}
                    />
                  ));
                })()
              ) : (
                // No portfolio data available
                <div className="text-center py-8">
                  <EmptyStateIcon />
                  <p className="text-slate-400 mt-4">No portfolio data available</p>
                  <p className="text-slate-500 text-sm mt-2">Connect wallets to view your portfolio</p>
                </div>
              )}

              {portfolioData?.nativeAndToken?.flat().length === 0 && (
                <div className="text-center py-8">
                  <EmptyStateIcon />
                  <p className="text-slate-400 mt-4">No tokens found in your wallets</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}