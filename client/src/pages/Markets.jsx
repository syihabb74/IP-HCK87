import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import Navbar from '../components/Navbar';
import CoinCard from '../components/CoinCard';
import TokenCard from '../components/TokenCard';
import http from '../utils/http';

const Markets = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [top100, setTop100] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 10;

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const showAll = searchParams.get('showAll') === 'true';
  
  const fetchMarketData = async () => {
   
    try {
      
      const response = await http({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        url: '/markets'
      });

      setTop100(response.data);

    } catch (error) {
      
      console.error(error);

    }


  };

  useEffect(() => {
    setIsLoaded(true);
    fetchMarketData();

  }, []);

  console.log(top100)

  // Format market data from API
  const formatMarketData = (data) => {
    return data.map((coin, index) => ({
      rank: coin.market_cap_rank || index + 1,
      name: coin.name,
      symbol: coin.symbol?.toUpperCase(),
      price: `$${coin.current_price?.toLocaleString()}`,
      change24h: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2)}%`,
      volume: `$${(coin.total_volume / 1000000).toFixed(1)}M`,
      marketCap: `$${(coin.market_cap / 1000000000).toFixed(1)}B`,
      icon: coin.symbol?.charAt(0).toUpperCase(),
      isPositive: coin.price_change_percentage_24h >= 0,
      image: coin.image
    }));
  };

  // Get paginated data
  const getPaginatedData = () => {
    if (showAll) {
      return formatMarketData(top100);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return formatMarketData(top100.slice(startIndex, endIndex));
  };

  // Calculate total pages
  const totalPages = Math.ceil(top100.length / itemsPerPage);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const handleShowAll = () => {
    setSearchParams({ showAll: 'true' });
  };

  const handleShowPagination = () => {
    setSearchParams({ page: '1' });
  };

  const marketData = getPaginatedData();

  const handleTrade = (coinData) => {
    console.log('Trading:', coinData);
    // Here you can implement trade functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-x-hidden font-inter">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Crypto Markets
          </h1>
          <p className="text-slate-400 text-lg">
            Track real-time prices and market data for the top cryptocurrencies
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Market Cap</h3>
            <p className="text-2xl font-bold text-white">$2.85T</p>
            <p className="text-green-400 text-sm">+2.15% (24h)</p>
          </div>
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '400ms'}}>
            <h3 className="text-slate-400 text-sm font-medium mb-2">24h Volume</h3>
            <p className="text-2xl font-bold text-white">$95.2B</p>
            <p className="text-green-400 text-sm">+8.45% (24h)</p>
          </div>
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '600ms'}}>
            <h3 className="text-slate-400 text-sm font-medium mb-2">BTC Dominance</h3>
            <p className="text-2xl font-bold text-white">48.2%</p>
            <p className="text-red-400 text-sm">-0.85% (24h)</p>
          </div>
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '800ms'}}>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Fear & Greed</h3>
            <p className="text-2xl font-bold text-yellow-400">72</p>
            <p className="text-slate-400 text-sm">Greed</p>
          </div>
        </div>

        {/* Markets Table */}
        <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1000ms'}}>
          <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Top Cryptocurrencies by Market Cap</h2>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">
                {showAll ? `Showing all ${top100.length}` : `Page ${currentPage} of ${totalPages}`}
              </span>
              {!showAll && (
                <button
                  onClick={handleShowAll}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
                >
                  Show All
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-6 py-4 text-left text-slate-400 font-medium text-sm">#</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-medium text-sm">Name</th>
                  <th className="px-6 py-4 text-right text-slate-400 font-medium text-sm">Price</th>
                  <th className="px-6 py-4 text-right text-slate-400 font-medium text-sm">24h %</th>
                  <th className="px-6 py-4 text-right text-slate-400 font-medium text-sm">Volume (24h)</th>
                  <th className="px-6 py-4 text-right text-slate-400 font-medium text-sm">Market Cap</th>
                  <th className="px-6 py-4 text-center text-slate-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((coin) => (
                  <CoinCard
                    key={coin.rank}
                    rank={coin.rank}
                    name={coin.name}
                    symbol={coin.symbol}
                    price={coin.price}
                    change24h={coin.change24h}
                    volume={coin.volume}
                    marketCap={coin.marketCap}
                    icon={coin.icon}
                    image={coin.image}
                    isPositive={coin.isPositive}
                    onTrade={handleTrade}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!showAll && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-700 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}

          {showAll && (
            <div className="px-6 py-4 border-t border-slate-700 flex justify-center">
              <button
                onClick={handleShowPagination}
                className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Show Pagination
              </button>
            </div>
          )}
        </div>

        {/* Additional Market Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/95 hover:border-slate-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-400/10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1200ms'}}>
            <h3 className="text-xl font-semibold text-white mb-4">Market Trends</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Trending Coins</span>
                <span className="text-green-400">+15.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">DeFi Tokens</span>
                <span className="text-green-400">+8.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Layer 1s</span>
                <span className="text-red-400">-2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Meme Coins</span>
                <span className="text-green-400">+22.8%</span>
              </div>
            </div>
          </div>

          <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/95 hover:border-slate-600 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-400/10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1400ms'}}>
            <h3 className="text-xl font-semibold text-white mb-4">Market Analytics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Active Traders</span>
                  <span className="text-white">2.4M</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Market Sentiment</span>
                  <span className="text-white">Bullish</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Volatility Index</span>
                  <span className="text-white">Medium</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;