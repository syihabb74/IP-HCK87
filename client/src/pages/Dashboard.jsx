import { Link } from 'react-router';
import TokenCard from '../components/TokenCard';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-x-hidden font-inter">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <section className="text-center mb-16 py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent leading-tight">
            Track Your Crypto Portfolio Like a Pro
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Monitor your cryptocurrency investments with real-time data, advanced analytics, and professional insights for informed trading decisions.
          </p>
          <button
            onClick={scrollToPortfolio}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 inline-flex items-center gap-2"
          >
            View Portfolio
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left">
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">$2.5M+</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">TOTAL VOLUME</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left">
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">$1.2B</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">TOTAL VALUE</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left">
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">150K+</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">DAILY TRADES</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-left">
            <div className="text-4xl font-extrabold text-cyan-400 mb-2">95%</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider font-medium">ACCURACY</div>
          </div>
        </section>

        <section className="mb-16" id="portfolio">
          <h2 className="text-3xl font-bold text-center mb-8">Your Portfolio</h2>

          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 mb-8">
            <div className="mb-8">
              <div className="text-5xl font-extrabold text-green-400 mb-2">$52,458,392</div>
              <p className="text-slate-400 text-lg">Total Portfolio Value</p>
              <div className="flex items-center gap-2 text-lg text-green-400 mt-2">
                <span>+$1,247,891</span>
                <span>(+8.3%)</span>
                <span className="text-green-400">📈</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TokenCard
                icon="B"
                name="Bitcoin"
                symbol="BTC"
                amount="2.5847"
                value="$14,716"
                changePercent={-0.4}
                iconBgColor="bg-orange-500"
              />

              <TokenCard
                icon="Ξ"
                name="Ethereum"
                symbol="ETH"
                amount="45.231"
                value="$7,830"
                changePercent={0.1}
                iconBgColor="bg-purple-500"
              />

              <TokenCard
                icon="B"
                name="BNB"
                symbol="BNB"
                amount="1,247"
                value="$4,492"
                changePercent={-0.9}
                iconBgColor="bg-yellow-500"
              />

              <TokenCard
                icon="◎"
                name="Solana"
                symbol="SOL"
                amount="892.5"
                value="$2,930"
                changePercent={0.7}
                iconBgColor="bg-purple-400"
              />

              <TokenCard
                icon="A"
                name="Cardano"
                symbol="ADA"
                amount="12,847"
                value="$1,248"
                changePercent={-0.5}
                iconBgColor="bg-red-500"
              />

              <TokenCard
                icon="●"
                name="Polygon"
                symbol="MATIC"
                amount="25,847"
                value="$857,729"
                changePercent={-0.9}
                iconBgColor="bg-green-500"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Transactions</h2>

          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8">
            <div className="space-y-1">
              <TransactionCard
                type="buy"
                coinName="Bitcoin"
                amount="0.5 BTC"
                value="$29,450"
                timestamp="2 hours ago"
              />

              <TransactionCard
                type="sell"
                coinName="Ethereum"
                amount="2.5 ETH"
                value="$4,250"
                timestamp="6 hours ago"
              />

              <TransactionCard
                type="buy"
                coinName="Solana"
                amount="50 SOL"
                value="$1,850"
                timestamp="1 day ago"
                isLast={true}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;