import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { Link, Navigate, useNavigate } from 'react-router';
import http from '../utils/http';
import { successAlert, errorAlert } from '../utils/sweetAlert';

const Register = () => {

  if (localStorage.getItem('access_token')) {
        return <Navigate to="/dashboard" />
    }
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const registerSubmit = async () => {
    
    try {

      const response = await http({
        method: 'POST',
        url: '/register',
        data: form
      })

      successAlert('Registration Successful!', 'Your account has been created successfully. Please login to continue.');
      navigate('/login');

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      errorAlert('Registration Failed', errorMessage);

    }

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    registerSubmit();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative font-inter">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-1/5 left-1/10 animate-pulse"></div>
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-3/5 right-1/5 animate-pulse delay-1000"></div>
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 bottom-1/3 left-1/5 animate-pulse delay-2000"></div>
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-1/10 right-1/10 animate-pulse delay-3000"></div>
        </div>

        <div className={`relative z-10 bg-slate-800/90 backdrop-blur-xl rounded-3xl p-12 w-full max-w-md text-center shadow-2xl hover:bg-slate-800/95 hover:shadow-3xl hover:shadow-cyan-400/30 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
          {/* Logo */}
          <div className={`flex items-center justify-center mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`} style={{transitionDelay: '200ms'}}>
            <Logo variant="compact" size="medium" />
          </div>

          {/* Welcome Text */}
          <div className={`mb-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '400ms'}}>
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Join thousands of crypto traders and start tracking your portfolio with advanced analytics and real-time data.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '600ms'}}>
            <div className="text-left">
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 pr-12"
                  />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 hover:scale-105"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '1000ms'}}>
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;