import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ethers } from 'ethers';

const Settings = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wallets, setWallets] = useState([]); 
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      const newAddress = accounts[0];
      if (!wallets.includes(newAddress)) {
        const wallet = [...wallets];
        wallet.push(newAddress);
        setWallets(wallet);
        console.log('New wallet added:', newAddress);
      } else {
        console.log('Wallet already connected:', newAddress);
      }

    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
    } else {
      alert('MetaMask is not installed. Please install it to connect your wallet.');
    }
  }


  


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-x-hidden font-inter">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your profile and wallet connections
          </p>
        </div>

        <div className="space-y-8">
          <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '200ms'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
              <button
                className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-4 py-3 text-white">
                  John Doe
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-4 py-3 text-white">
                  johndoe123
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '400ms'}}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Wallet Management</h2>
                <p className="text-slate-400 text-sm mt-1">Only Ethereum Mainnet wallets are supported</p>
              </div>
              <button onClick={handleConnectWallet}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Connect MetaMask
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">MetaMask Wallet</h3>
                      <p className="text-slate-400 text-sm">0x742d35Cc4Dd8f82b7F47f0d1836ce34Da7b13aec</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-blue-600 text-blue-200 px-2 py-1 rounded-full">
                          Ethereum Mainnet
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          Connected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <button
                      className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-lg transition-all duration-300"
                      title="Edit Wallet Name"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-300"
                      title="Remove Wallet"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-600">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">My Trading Wallet</h3>
                      <p className="text-slate-400 text-sm">0x8ba1f109551bD432803012645Hac136c22C501e5</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-blue-600 text-blue-200 px-2 py-1 rounded-full">
                          Ethereum Mainnet
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-600/50 text-slate-400">
                          Disconnected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <button
                      className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-lg transition-all duration-300"
                      title="Edit Wallet Name"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-300"
                      title="Remove Wallet"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/95 hover:border-slate-600 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{transitionDelay: '600ms'}}>
            <h2 className="text-2xl font-semibold text-white mb-6">Preferences</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-slate-400 text-sm">Receive updates about your portfolio</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Price Alerts</h3>
                  <p className="text-slate-400 text-sm">Get notified when prices change significantly</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Dark Mode</h3>
                  <p className="text-slate-400 text-sm">Use dark theme interface</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;