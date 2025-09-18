import { Link } from 'react-router';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-400">
            Terms and conditions for using our platform
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Acceptance of Terms</h2>
            <p className="text-slate-300 mb-6">
              By accessing and using Portfolio Tracker, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Use License</h2>
            <p className="text-slate-300 mb-6">
              Permission is granted to temporarily use Portfolio Tracker for personal,
              non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">User Accounts</h2>
            <p className="text-slate-300 mb-6">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Limitation of Liability</h2>
            <p className="text-slate-300 mb-6">
              Portfolio Tracker shall not be liable for any damages arising from the use or
              inability to use our services.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Information</h2>
            <p className="text-slate-300">
              Questions about the Terms of Service should be sent to us at{' '}
              <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                our contact page
              </Link>.
            </p>
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

export default TermsOfService;