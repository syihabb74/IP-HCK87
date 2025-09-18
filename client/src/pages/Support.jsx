import { Link } from 'react-router';
import Navbar from '../components/Navbar';

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-xl text-slate-400">
            Get help and find answers to your questions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">How do I connect my wallet?</h4>
                <p className="text-slate-300">Go to Dashboard and click on "Add Wallet" to connect your cryptocurrency wallet.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Is my data secure?</h4>
                <p className="text-slate-300">Yes, we use industry-standard encryption to protect your data and never store your private keys.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">How often is data updated?</h4>
                <p className="text-slate-300">Portfolio data is updated in real-time using live market data from trusted sources.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Contact Support</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Email Support</p>
                  <p className="text-slate-400">support@portfoliotracker.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Live Chat</p>
                  <p className="text-slate-400">Available 24/7</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;