import { Link } from 'react-router';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-400">
            How we collect, use, and protect your information
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Information We Collect</h2>
            <p className="text-slate-300 mb-6">
              We collect information you provide directly to us, such as when you create an account,
              use our services, or contact us for support.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">How We Use Your Information</h2>
            <p className="text-slate-300 mb-6">
              We use the information we collect to provide, maintain, and improve our services,
              process transactions, and communicate with you.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Security</h2>
            <p className="text-slate-300 mb-6">
              We implement appropriate security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Us</h2>
            <p className="text-slate-300">
              If you have any questions about this Privacy Policy, please{' '}
              <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                contact us
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

export default PrivacyPolicy;