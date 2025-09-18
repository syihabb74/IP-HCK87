import { Link } from 'react-router';
import Navbar from '../components/Navbar';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for beginners",
      features: [
        "Track up to 3 wallets",
        "Basic portfolio analytics",
        "Real-time price updates",
        "Email support"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonClass: "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious investors",
      features: [
        "Unlimited wallet tracking",
        "Advanced analytics & insights",
        "AI-powered recommendations",
        "Priority support",
        "Custom alerts",
        "Export reports"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonClass: "bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-700"
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "per month",
      description: "For institutions",
      features: [
        "Everything in Pro",
        "Multi-user accounts",
        "API access",
        "White-label options",
        "Dedicated support",
        "Custom integrations"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonClass: "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Simple Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Choose the perfect plan for your investment journey. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.popular
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/20'
                  : 'border-slate-700/50 hover:border-cyan-400/50 hover:shadow-cyan-400/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-cyan-400">{plan.price}</span>
                  {plan.price !== "Free" && (
                    <span className="text-slate-400 ml-2">/{plan.period}</span>
                  )}
                </div>
                {plan.price === "Free" && (
                  <span className="text-slate-400">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === "Enterprise" ? "/contact" : "/register"}
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${plan.buttonClass}`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need a custom solution?</h3>
          <p className="text-slate-400 mb-6">
            We offer tailored packages for large organizations and institutions.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
          >
            Contact Sales Team
          </Link>
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

export default Pricing;