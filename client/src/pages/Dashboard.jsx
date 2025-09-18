import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import TokenCard from '../components/TokenCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet } from '../slices/walletSlice';
import { fetchMarkets } from '../slices/marketSlice';
import http from '../utils/http';
import { errorAlert } from '../utils/sweetAlert';

const Dashboard = () => {
  const dispatch = useDispatch()
  const { data: wallets } = useSelector(state => state.wallet);
  const [isLoaded, setIsLoaded] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet())
  }, []);

  useEffect(() => {
    dispatch(fetchMarkets())
  }, []);

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

  const fetchPortfolioData = async () => {
    if (!wallets?.Wallets?.length) return;

    setIsLoadingPortfolio(true);
    try {
      const addresses = wallets.Wallets.map(wallet => wallet.address).join(',');
      const response = await http({
        method: 'GET',
        url: `/portofolios?wallets=${addresses}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.data && response.data.success && response.data.data) {
        setPortfolioData(response.data.data);
      } else {
        setPortfolioData(response.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch portfolio data';
      await errorAlert('Portfolio Error', errorMessage);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  // Fetch portfolio data when wallets are available
  useEffect(() => {
    if (wallets?.Wallets?.length > 0) {
      fetchPortfolioData();
    }
  }, [wallets]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <section className={`text-center mb-16 py-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent leading-tight">
            Track Your Crypto Portfolio Like a Pro
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Monitor your cryptocurrency investments with real-time data, advanced analytics, and professional insights for informed trading decisions.
          </p>
          <Link
            to="/portofolio"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
          >
            View Portfolio
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">
              {isLoadingPortfolio ? '...' : `$${portfolioData?.totalBalance ? portfolioData.totalBalance.toLocaleString() : '0.00'}`}
            </div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">PORTFOLIO VALUE</div>
          </div>
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '400ms'}}>
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">{wallets?.Wallets?.length || 0}</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">CONNECTED WALLETS</div>
          </div>
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '600ms'}}>
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">
              {isLoadingPortfolio ? '...' : portfolioData?.nativeAndToken ? portfolioData.nativeAndToken.flat().length : 0}
            </div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">TOKENS HELD</div>
          </div>
        </section>

        <section className={`mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} id="portfolio" style={{transitionDelay: '1000ms'}}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Portfolio</h2>
            <p className="text-slate-400">Top holdings preview</p>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 mb-8 hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500">
            <div className="mb-8">
              <div className="text-5xl font-extrabold text-green-400 mb-2">
                {isLoadingPortfolio ? 'Loading...' : `$${portfolioData?.totalBalance ? portfolioData.totalBalance.toLocaleString() : '0.00'}`}
              </div>
              <p className="text-slate-400 text-lg">Total Portfolio Value</p>
              <p className="text-slate-500 text-sm mt-2">
                Across {wallets?.Wallets?.length || 0} connected wallets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingPortfolio ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="text-slate-400 mt-4">Loading portfolio tokens...</p>
                </div>
              ) : portfolioData?.nativeAndToken ? (
                (() => {
                  // Aggregate tokens by symbol
                  const aggregatedTokens = {};

                  portfolioData.nativeAndToken.flat().forEach(token => {
                    if (!token || typeof token !== 'object') return;

                    const symbol = token.symbol || 'UNKNOWN';
                    const tokenValue = parseFloat(token.usd_value || 0);
                    const tokenBalance = parseFloat(token.balance_formatted || token.balance || 0);

                    if (aggregatedTokens[symbol]) {
                      aggregatedTokens[symbol].totalValue += tokenValue;
                      aggregatedTokens[symbol].totalBalance += tokenBalance;
                    } else {
                      aggregatedTokens[symbol] = {
                        name: token.name || token.symbol || 'Unknown Token',
                        symbol: symbol,
                        totalValue: tokenValue,
                        totalBalance: tokenBalance
                      };
                    }
                  });

                  // Get top 3 tokens by value for preview and render
                  return Object.values(aggregatedTokens)
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .slice(0, 3)
                    .map((token, index) => (
                      <TokenCard
                        key={token.symbol + index}
                        icon={token.symbol?.charAt(0)?.toUpperCase() || 'T'}
                        name={token.name}
                        symbol={token.symbol}
                        amount={token.totalBalance.toFixed(4)}
                        value={`$${token.totalValue.toFixed(2)}`}
                        changePercent={0} // Moralis doesn't provide 24h change
                        iconBgColor={getTokenIconColor(token.symbol)}
                      />
                    ));
                })()
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-400">No tokens found. Connect wallets to view your portfolio.</p>
                  <Link
                    to="/settings"
                    className="text-cyan-400 hover:text-cyan-300 underline mt-2 inline-block"
                  >
                    Connect Wallets
                  </Link>
                </div>
              )}
            </div>

            {/* View All Holdings Button */}
            {portfolioData?.nativeAndToken && (
              <div className="text-center mt-6">
                <Link
                  to="/portofolio"
                  className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500"
                >
                  View All Holdings
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}

export default Dashboard;