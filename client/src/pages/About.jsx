import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import BrandIcon from '../components/BrandIcon';

const About = () => {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      description: "Former Goldman Sachs analyst with 10+ years in fintech"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      description: "Ex-Google engineer specializing in blockchain technology"
    },
    {
      name: "Emily Watson",
      role: "Head of Product",
      description: "Product leader with expertise in user experience design"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "$2B+", label: "Assets Tracked" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <BrandIcon size={120} animate={true} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            About Portfolio Tracker
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            We're building the future of cryptocurrency portfolio management. Our mission is to make crypto investing
            accessible, transparent, and profitable for everyone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-slate-300">
              <p>
                Founded in 2022, Portfolio Tracker was born from the frustration of managing crypto investments
                across multiple wallets and exchanges. Our founders, experienced in both traditional finance and
                blockchain technology, saw the need for a unified platform.
              </p>
              <p>
                What started as a simple tracking tool has evolved into a comprehensive platform that serves
                thousands of investors worldwide. We combine cutting-edge technology with user-centric design
                to deliver the best possible experience.
              </p>
              <p>
                Today, we're proud to be trusted by retail investors, institutional traders, and crypto
                enthusiasts who rely on our platform to make informed investment decisions.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-3xl p-8 border border-cyan-400/20">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Our Mission</h3>
            <p className="text-slate-300 mb-6">
              To democratize access to professional-grade cryptocurrency portfolio management tools and insights.
            </p>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Our Vision</h3>
            <p className="text-slate-300">
              A world where every investor has the tools and knowledge to make confident, data-driven decisions
              in the cryptocurrency market.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center hover:border-cyan-400/50 transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-cyan-400 mb-4">{member.role}</p>
                <p className="text-slate-400">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Security First</h3>
              <p className="text-slate-400">Your data and privacy are our top priorities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-slate-400">Continuously pushing the boundaries of what's possible</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">User-Centric</h3>
              <p className="text-slate-400">Every decision is made with our users in mind</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join us?</h2>
          <p className="text-slate-400 mb-8">
            Start tracking your crypto portfolio today and see why thousands trust Portfolio Tracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg font-semibold hover:bg-cyan-400 hover:text-white transition-all duration-300"
            >
              Contact Us
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

export default About;