import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import http from '../utils/http';
import { useNavigate } from 'react-router';
import { successAlert, errorAlert } from '../utils/sweetAlert';

const Login = () => {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  async function handleCredentialResponse(response) {
    try {
      const { data } = await http({
        method: "POST",
        url: '/google-signin',
        data: {
          googleToken: response.credential
        }
      })
      localStorage.setItem("access_token", data.access_token)
      await successAlert('Login Successful!', 'Welcome back! You have been logged in successfully.');
      navigate("/dashboard")

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google sign-in failed. Please try again.';
      await errorAlert('Login Failed', errorMessage);
    }
  }

  useEffect(() => {
    setIsLoaded(true);

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // process.env.VITE_GOOGLE_CLIENT_ID
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      { 
        theme: "outline", 
        size: "large",
        width: "300",
        text: "signin_with",
        shape: "rectangular"
      }
    );
    
    // Center the Google button
    setTimeout(() => {
      const googleButton = document.querySelector('#googleSignIn > div');
      if (googleButton) {
        googleButton.style.margin = '0 auto';
        googleButton.style.display = 'block';
      }
    }, 100);
    // google.accounts.id.prompt(); // Hapus ini karena konflik dengan renderButton

  }, [])
  
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
      await successAlert('Login Successful!', 'Welcome back! You have been logged in successfully.');
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      await errorAlert('Login Failed', errorMessage);

    }

  }


  const handleManualSubmit = (e) => {
    e.preventDefault();
    loginSubmit();
  } 


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
        <form  onSubmit={handleManualSubmit} className={`space-y-6 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '600ms'}}>
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
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 pr-12"
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
        <div className={`flex justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '800ms'}}>
          <div id="googleSignIn" className="w-full flex justify-center"></div>
        </div>

        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;