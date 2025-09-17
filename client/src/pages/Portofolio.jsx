import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import EmptyStateIcon from '../components/EmptyStateIcon'
import TokenCard from '../components/TokenCard'
import http from '../utils/http';

export default function Portofolio() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [wallets, setWallets] = useState([]);

  const fetchWallets = async () => {

    try {
      
      const {data} = await http({
        url : '/portofolios',
        method : 'GET',
        headers : {
          Authorization : `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      setWallets(data)

    } catch (error) {
      
      console.log(error)

    }

  }

  // Data dummy untuk token holdings
  const dummyTokens = [
    {
      icon: "₿",
      name: "Bitcoin",
      symbol: "BTC",
      amount: "0.5",
      value: "$15,250.00",
      changePercent: 2.5,
      iconBgColor: "bg-orange-500"
    },
    {
      icon: "Ξ",
      name: "Ethereum",
      symbol: "ETH",
      amount: "3.2",
      value: "$5,440.00",
      changePercent: -1.2,
      iconBgColor: "bg-blue-500"
    },
    {
      icon: "A",
      name: "Cardano",
      symbol: "ADA",
      amount: "1,500",
      value: "$450.00",
      changePercent: 4.8,
      iconBgColor: "bg-blue-600"
    },
    {
      icon: "S",
      name: "Solana",
      symbol: "SOL",
      amount: "25",
      value: "$875.00",
      changePercent: -3.1,
      iconBgColor: "bg-purple-500"
    },
    {
      icon: "D",
      name: "Dogecoin",
      symbol: "DOGE",
      amount: "5,000",
      value: "$350.00",
      changePercent: 7.2,
      iconBgColor: "bg-yellow-500"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    fetchWallets()
  }, []);

  console.log(wallets)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-x-hidden font-inter">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-slate-400">Track all your crypto assets across connected wallets</p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Total Balance</h3>
            <p className="text-3xl font-bold text-green-400">$0.00</p>
            <p className="text-sm text-slate-400 mt-1">Across all wallets</p>
          </div>

          <div className={`bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/90 hover:border-slate-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '400ms'}}>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">24h Change</h3>
            <p className="text-3xl font-bold text-red-400">$0.00</p>
            <p className="text-sm text-slate-400 mt-1">0.00%</p>
          </div>
        </div>


        {/* Portfolio Holdings Section */}
        <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '600ms'}}>
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Portfolio Holdings</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {dummyTokens.map((token, index) => (
                <TokenCard
                  key={index}
                  icon={token.icon}
                  name={token.name}
                  symbol={token.symbol}
                  amount={token.amount}
                  value={token.value}
                  changePercent={token.changePercent}
                  iconBgColor={token.iconBgColor}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}