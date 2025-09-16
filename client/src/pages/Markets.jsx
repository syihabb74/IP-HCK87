import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CoinCard from '../components/CoinCard';

const Markets = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample market data - you can replace this with real API data
  const marketData = [
    { rank: 1, name: "Bitcoin", symbol: "BTC", price: "$69,420.50", change24h: "+2.45%", volume: "$28.5B", marketCap: "$1.37T", icon: "₿", isPositive: true },
    { rank: 2, name: "Ethereum", symbol: "ETH", price: "$3,845.30", change24h: "+1.85%", volume: "$15.2B", marketCap: "$462.8B", icon: "Ξ", isPositive: true },
    { rank: 3, name: "BNB", symbol: "BNB", price: "$685.40", change24h: "-0.75%", volume: "$2.1B", marketCap: "$102.3B", icon: "⬡", isPositive: false },
    { rank: 4, name: "Solana", symbol: "SOL", price: "$195.80", change24h: "+4.12%", volume: "$3.8B", marketCap: "$91.7B", icon: "◎", isPositive: true },
    { rank: 5, name: "XRP", symbol: "XRP", price: "$0.6235", change24h: "+0.95%", volume: "$1.4B", marketCap: "$35.2B", icon: "◉", isPositive: true },
    { rank: 6, name: "Cardano", symbol: "ADA", price: "$0.4850", change24h: "-1.25%", volume: "$585M", marketCap: "$17.1B", icon: "₳", isPositive: false },
    { rank: 7, name: "Avalanche", symbol: "AVAX", price: "$42.15", change24h: "+3.60%", volume: "$845M", marketCap: "$16.8B", icon: "▲", isPositive: true },
    { rank: 8, name: "Dogecoin", symbol: "DOGE", price: "$0.1245", change24h: "+1.40%", volume: "$1.2B", marketCap: "$18.3B", icon: "Ð", isPositive: true },
    { rank: 9, name: "Polygon", symbol: "MATIC", price: "$0.8920", change24h: "-2.15%", volume: "$420M", marketCap: "$8.7B", icon: "⬟", isPositive: false },
    { rank: 10, name: "Chainlink", symbol: "LINK", price: "$16.85", change24h: "+0.85%", volume: "$315M", marketCap: "$10.2B", icon: "⬢", isPositive: true }
  ];

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
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Top Cryptocurrencies by Market Cap</h2>
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
                    isPositive={coin.isPositive}
                    onTrade={handleTrade}
                  />
                ))}
              </tbody>
            </table>
          </div>
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