import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import FeatureIcon from '../components/FeatureIcon';
import BrandIcon from '../components/BrandIcon';


const Home = () => {

  if (localStorage.getItem('access_token')) {
        return <Navigate to="/dashboard" />
    }
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-x-hidden font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-1/4 left-1/4 animate-pulse"></div>
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-3/4 right-1/4 animate-pulse delay-1000"></div>
            <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 bottom-1/4 left-1/6 animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10">
            <div className={`flex items-center justify-center gap-4 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
              <Logo variant="full" size="xl" />
            </div>

            <h2 className={`text-4xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent leading-tight transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
              Track Your Crypto Portfolio Like a Pro
            </h2>

            <p className={`text-xl md:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '400ms'}}>
              Monitor your cryptocurrency investments with real-time data, advanced analytics, and professional insights for informed trading decisions.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '600ms'}}>
              <Link
                to={"/register"}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/30 hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to={"/login"}
                className="border-2 border-cyan-400 text-cyan-400 px-12 py-4 rounded-lg text-xl font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '800ms'}}>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Why Choose Portfolio Tracker?
            </h3>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to manage and grow your crypto portfolio in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-cyan-400/10 rounded-2xl p-8 text-center hover:-translate-y-4 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300">
              <div className="flex items-center justify-center mx-auto mb-6">
                <FeatureIcon type="realtime" size={80} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Real-Time Tracking</h4>
              <p className="text-slate-400 leading-relaxed">
                Monitor your crypto portfolio with live price updates, real-time P&L calculations, and instant market data from multiple exchanges.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-cyan-400/10 rounded-2xl p-8 text-center hover:-translate-y-4 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300">
              <div className="flex items-center justify-center mx-auto mb-6">
                <FeatureIcon type="analytics" size={80} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h4>
              <p className="text-slate-400 leading-relaxed">
                Get professional-grade insights with detailed performance metrics, trend analysis, and predictive indicators to make informed decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-cyan-400/10 rounded-2xl p-8 text-center hover:-translate-y-4 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300">
              <div className="flex items-center justify-center mx-auto mb-6">
                <FeatureIcon type="security" size={80} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Bank-Level Security</h4>
              <p className="text-slate-400 leading-relaxed">
                Your data is protected with enterprise-grade encryption, OAuth authentication, and secure cloud infrastructure.
              </p>
            </div>

            {/* Feature 4 */}
           

            {/* Feature 5 */}
            

            {/* Feature 6 */}
           
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1200ms'}}>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              Trusted by Crypto Enthusiasts Worldwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`text-center transition-all duration-1000 hover:-translate-y-4 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1400ms'}}>
              <div className="text-5xl font-extrabold text-cyan-400 mb-2">50K+</div>
              <div className="text-slate-400 text-lg">Active Users</div>
            </div>
            <div className={`text-center transition-all duration-1000 hover:-translate-y-4 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1600ms'}}>
              <div className="text-5xl font-extrabold text-cyan-400 mb-2">$2.5B+</div>
              <div className="text-slate-400 text-lg">Assets Tracked</div>
            </div>
            <div className={`text-center transition-all duration-1000 hover:-translate-y-4 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '1800ms'}}>
              <div className="text-5xl font-extrabold text-cyan-400 mb-2">150K+</div>
              <div className="text-slate-400 text-lg">Daily Trades</div>
            </div>
            <div className={`text-center transition-all duration-1000 hover:-translate-y-4 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '2000ms'}}>
              <div className="text-5xl font-extrabold text-cyan-400 mb-2">99.9%</div>
              <div className="text-slate-400 text-lg">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '2200ms'}}>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Ready to Take Control of Your Crypto Portfolio?
          </h3>
          <p className="text-xl text-slate-400 mb-12">
            Join thousands of traders who trust Portfolio Tracker to manage their cryptocurrency investments
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/30 hover:scale-105"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <BrandIcon size={32} animate={true} />
              <span className="text-2xl font-bold text-cyan-400">Portfolio Tracker</span>
            </div>

            <div className="flex flex-wrap gap-6 text-slate-400">
              <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
              <Link to="/support" className="hover:text-cyan-400 transition-colors">Support</Link>
              <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Portfolio Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;