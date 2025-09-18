import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import FeatureIcon from '../components/FeatureIcon';

const Features = () => {
  const features = [
    {
      icon: "📊",
      title: "Real-time Portfolio Tracking",
      description: "Monitor your cryptocurrency investments with live market data and comprehensive analytics."
    },
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      description: "Get intelligent market analysis and personalized investment recommendations."
    },
    {
      icon: "🔒",
      title: "Bank-level Security",
      description: "Your data is protected with industry-standard encryption and security protocols."
    },
    {
      icon: "📱",
      title: "Multi-platform Access",
      description: "Access your portfolio from any device with our responsive web application."
    },
    {
      icon: "📈",
      title: "Advanced Analytics",
      description: "Detailed charts, performance metrics, and historical data analysis."
    },
    {
      icon: "🔔",
      title: "Smart Alerts",
      description: "Custom notifications for price changes, portfolio milestones, and market events."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Everything you need to track, analyze, and optimize your cryptocurrency portfolio
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-400/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-3xl p-12 border border-cyan-400/20 text-center">
          <div className="flex justify-center mb-6">
            <FeatureIcon size={80} animate={true} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of investors who trust Portfolio Tracker with their crypto investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="border border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg font-semibold hover:bg-cyan-400 hover:text-white transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-slate-400 hover:text-cyan-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;