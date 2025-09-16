import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WalletCard from '../components/WalletCard';
import { ethers, Wallet } from 'ethers';
import http from '../utils/http';

const Settings = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    Wallets: [],
    Profile: { username: '' }
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fetchingWalletsAndUser = async () => {

    try {
      
      const response = await http({
        method: 'GET',
        url: '/wallets',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      console.log(response.data)

      setUserData(response.data);

    } catch (error) {
      
      console.log(error)

    }
  }

  useEffect(() => {
    
    fetchingWalletsAndUser();

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
      if (!userData.Wallets.find(w => w.address === newAddress)) {
        // Call API to create wallet
        const createResponse = await http({
          method: 'POST',
          url: '/wallets',
          data: { address: newAddress },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        fetchingWalletsAndUser();
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

  const handleEditWallet = (wallet) => {
    console.log('Edit wallet:', wallet);
  };

  const handleDeleteWallet = async (wallet) => {
    try {
      await http({
        method: 'DELETE',
        url: `/wallets/${wallet.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      fetchingWalletsAndUser();
      console.log('Wallet deleted:', wallet.address);
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };


  


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
                  {userData.fullName}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-4 py-3 text-white">
                  {userData.Profile?.username}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-4 py-3 text-white">
                  {userData.email}
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
              {userData.Wallets && userData.Wallets.length > 0 ? (
                userData.Wallets.map((wallet) => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    onEdit={handleEditWallet}
                    onDelete={handleDeleteWallet}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">No Wallets Connected</h3>
                  <p className="text-slate-400">You don't have any wallet connected yet</p>
                </div>
              )}
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