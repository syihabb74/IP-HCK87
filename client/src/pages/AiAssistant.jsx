import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const AiAssistant = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  const suggestedPrompts = [
    "What are the top 5 performing cryptocurrencies today?",
    "Analyze Bitcoin's price trend over the past week",
    "Which altcoins have the highest market cap growth?",
    "Compare Ethereum vs Solana fundamentals",
    "Show me the most volatile tokens in the top 100"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden font-inter">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`mb-8 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            AI Crypto Assistant
          </h1>
          <p className="text-slate-400 text-lg">
            Get intelligent insights from the top 100 cryptocurrencies by market cap
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Section */}
          <div>
            <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl h-[600px] flex flex-col hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 text-slate-100 max-w-[80%] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">🤖</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base leading-relaxed">Hello! I'm your crypto AI assistant. I can help you analyze the top 100 cryptocurrencies by market cap. Ask me anything about market trends, price analysis, or investment insights!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="border-t border-slate-700 p-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Ask me anything about crypto markets..."
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;