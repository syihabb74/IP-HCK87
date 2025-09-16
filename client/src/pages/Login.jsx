import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import http from '../utils/http';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  const loginSubmit = async () => {

    try {
      
      const response = await http({
        method: 'POST',
        url: '/login',
        data: form
      })

      localStorage.setItem('access_token', response.data.access_token);
      navigate('/dashboard');

    } catch (error) {
      
      console.error(error);

    }

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginSubmit();
  
  } 

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  console.log(form);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative font-inter">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-1/5 left-1/10 animate-pulse"></div>
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-3/5 right-1/5 animate-pulse delay-1000"></div>
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 bottom-1/3 left-1/5 animate-pulse delay-2000"></div>
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/5 top-1/10 right-1/10 animate-pulse delay-3000"></div>
      </div>

        <div className={`relative z-10 bg-slate-800/90 backdrop-blur-xl rounded-3xl p-12 w-full max-w-md text-center shadow-2xl hover:bg-slate-800/95 hover:shadow-3xl hover:shadow-cyan-400/30 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
        <div className={`flex items-center justify-center mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`} style={{transitionDelay: '200ms'}}>
          <Logo variant="compact" size="medium" />
        </div>

        <div className={`mb-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '400ms'}}>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Sign in to your crypto portfolio tracker and continue monitoring your investments with real-time data.
          </p>
        </div>

        {/* Login Form */}
        <form  onSubmit={handleSubmit} className={`space-y-6 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '600ms'}}>
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
              required
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
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 pr-12"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 hover:scale-105"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="px-6 text-slate-400 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        {/* Google Sign In */}
        <button className={`w-full bg-white text-slate-900 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:scale-105 mb-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '800ms'}}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;