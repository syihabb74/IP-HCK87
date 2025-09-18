import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarkets } from '../slices/marketSlice';
import http from '../utils/http';
import Markdown from 'react-markdown';
import { errorAlert } from '../utils/sweetAlert';

const AiAssistant = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const [conversation, setConversation] = useState([
    {
      type: 'ai',
      message: "Hello! I'm your crypto AI assistant. I can help you analyze the top 100 cryptocurrencies by market cap. Ask me anything about market trends, price analysis, or investment insights!",
      timestamp: new Date()
    }
  ]);
  const { loading, error, data } = useSelector(state => state.market);
  const [command, setcommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const handleChange = (e) => {

    const {value } = e.target;
    setcommand(value);

  }

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSendPromptUser = async () => {
    if (!command.trim() || isProcessing) return;

    const userMessage = command.trim();
    setIsProcessing(true);

    // Add user message to conversation
    setConversation(prev => [...prev, {
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await http({
        url : '/ai-markets',
        method : 'POST',
        headers : {
          Authorization : `Bearer ${localStorage.getItem('access_token')}`
        },
        data : `TOP MARKET 100 CRYPTO : ${JSON.stringify(data)}\n Prompting User : ${userMessage} \n Please make response relatable with user prompting and based with TOP 100 MARKET CRYPTO`
      })

      // Add AI response to conversation
      setConversation(prev => [...prev, {
        type: 'ai',
        message: response.data.message,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to process your request. Please try again.';
      await errorAlert('AI Assistant Error', errorMessage);

      // Add error message to conversation
      setConversation(prev => [...prev, {
        type: 'ai',
        message: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Enter key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessing && command.trim() && data.length > 0) {
        handleSendPromptUser();
        setcommand('');
      }
    }
  };


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
          <div>
            <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl h-[600px] flex flex-col hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: '200ms' }}>
              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-100'
                    }`}>
                      {message.type === 'ai' ? (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">🤖</span>
                          </div>
                          <div className="flex-1 markdown-content">
                            <Markdown
                              components={{
                                table: ({ children }) => (
                                  <div className="overflow-x-auto my-4">
                                    <table className="w-full border-collapse border border-slate-500 bg-slate-800/50 rounded-lg">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children }) => (
                                  <thead className="bg-slate-700">{children}</thead>
                                ),
                                tbody: ({ children }) => (
                                  <tbody>{children}</tbody>
                                ),
                                tr: ({ children }) => (
                                  <tr className="border-b border-slate-600 hover:bg-slate-700/30">
                                    {children}
                                  </tr>
                                ),
                                th: ({ children }) => (
                                  <th className="border border-slate-500 px-3 py-2 text-left font-semibold text-white bg-slate-700">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border border-slate-500 px-3 py-2 text-slate-100">
                                    {children}
                                  </td>
                                ),
                                code: ({ children, inline }) =>
                                  inline ? (
                                    <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300 text-sm font-mono">
                                      {children}
                                    </code>
                                  ) : (
                                    <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto my-3">
                                      <code className="text-cyan-300 font-mono text-sm">{children}</code>
                                    </pre>
                                  ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-cyan-400 pl-4 py-2 italic text-slate-300 bg-slate-800/30 rounded-r-lg my-3">
                                    {children}
                                  </blockquote>
                                ),
                                h1: ({ children }) => (
                                  <h1 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-lg font-semibold text-white mb-3 mt-5 first:mt-0 border-b border-slate-600 pb-1">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-base font-medium text-white mb-2 mt-4 first:mt-0">{children}</h3>
                                ),
                                p: ({ children }) => (
                                  <p className="text-slate-100 leading-relaxed mb-3 last:mb-0">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-outside ml-5 text-slate-100 space-y-1 mb-3">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-outside ml-5 text-slate-100 space-y-1 mb-3">{children}</ol>
                                ),
                                li: ({ children }) => (
                                  <li className="text-slate-100 mb-1">{children}</li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-white">{children}</strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic text-slate-200">{children}</em>
                                ),
                                hr: () => (
                                  <hr className="border-slate-600 my-4" />
                                )
                              }}
                            >
                              {message.message}
                            </Markdown>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">👤</span>
                          </div>
                          <p className="text-sm md:text-base leading-relaxed flex-1">{message.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/50 text-slate-100 max-w-[80%] rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">🤖</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-slate-400">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700 p-6">
                <div className="flex gap-4">
                  <input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={data.length === 0 || isProcessing}
                    type="text"
                    value={command}
                    placeholder={data.length === 0 ? "Loading market data..." : "Ask me anything about crypto markets..."}
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                  />
                  <button
                    onClick={() => {
                      handleSendPromptUser();
                      setcommand('');
                    }}
                    disabled={isProcessing || !command.trim() || data.length === 0}
                    type="button"
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
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