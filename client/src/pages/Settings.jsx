import { useState, useEffect } from 'react';
import WalletCard from '../components/WalletCard';
import { ethers } from 'ethers';
import http from '../utils/http';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet } from '../slices/walletSlice';
import { successAlert, errorAlert } from '../utils/sweetAlert';

const Settings = () => {
  const {loading, error, data} = useSelector(state => state.wallet);
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    Wallets: [],
    Profile: { username: '' }
  });

  const [walletForm, setWalletForm] = useState({
    address: '',
    walletName: ''
  });

  const [showAddWalletForm, setShowAddWalletForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
  }, [showAddWalletForm]);

  useEffect(() => {
    if (walletForm.address && walletForm.walletName === 'MetaMask Wallet' && !editingWallet) {
      setShowAddWalletForm(true);
    }
  }, [walletForm.address, walletForm.walletName, editingWallet]);


  useEffect(() => {
    if (data) {
      setUserData(data)
    }
  }, [data]);





  const handleConnectWallet = async (isEditing = false) => {

    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);

        const newAddress = accounts[0];

        if (isEditing) {
          // For editing, only update the address field
          setWalletForm(prev => ({
            ...prev,
            address: newAddress
          }));
        } else {
          // For adding new, populate form with MetaMask data

          // Reset all states first
          setEditingWallet(null);
          setShowAddWalletForm(false);

          // Then set new data
          setWalletForm({
            address: newAddress,
            walletName: 'MetaMask Wallet'
          });

          // Show form after a small delay to ensure state is updated
         
        }

      } catch (error) {
        console.error('🔥 Error connecting to MetaMask:', error);
        await errorAlert('MetaMask Connection Failed', 'Failed to connect to MetaMask. Please make sure MetaMask is installed and unlocked.');
      }
    } else {
      await errorAlert('MetaMask Not Found', 'MetaMask is not installed. Please install MetaMask browser extension to connect your wallet.');
    }
  };

  const handleWalletFormChange = (e) => {
    const { name, value } = e.target;
    setWalletForm({
      ...walletForm,
      [name]: value
    });
  };

  const handleSubmitWallet = async (e) => {
    e.preventDefault();


    try {
      if (editingWallet) {
        // Update existing wallet
        await http({
          method: 'PUT',
          url: `/wallets/${editingWallet.id}`,
          data: {
            address: walletForm.address,
            walletName: walletForm.walletName
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      } else {

        await http({
          method: 'POST',
          url: '/wallets',
          data: {
            address: walletForm.address,
            walletName: walletForm.walletName
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
      }

      setWalletForm({ address: '', walletName: '' });
      setShowAddWalletForm(false);
      setEditingWallet(null);

      dispatch(fetchWallet());

      const successMessage = editingWallet ? 'Wallet updated successfully!' : 'Wallet added successfully!';
      await successAlert('Success', successMessage);

    } catch (error) {
      console.error('Error with wallet operation:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save wallet. Please try again.';
      await errorAlert('Wallet Operation Failed', errorMessage);
    }
  };

  const handleCancelWalletForm = () => {
    setWalletForm({ address: '', walletName: '' });
    setShowAddWalletForm(false);
    setEditingWallet(null);
  };

  const handleEditWallet = (wallet) => {
    // Populate form with existing wallet data
    setWalletForm({
      address: wallet.address,
      walletName: wallet.walletName || 'My Wallet'
    });
    setEditingWallet(wallet);
    setShowAddWalletForm(true);
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

      dispatch(fetchWallet());
      await successAlert('Wallet Deleted', `Wallet "${wallet.walletName}" has been successfully removed.`);
    } catch (error) {
      console.error('Error deleting wallet:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete wallet. Please try again.';
      await errorAlert('Delete Failed', errorMessage);
    }
  };
  

  


  return (
    <>
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
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setWalletForm({ address: '', walletName: '' });
                    setEditingWallet(null);
                    setShowAddWalletForm(true);
                  }}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Manually
                </button>
                <button onClick={() => handleConnectWallet(false)}
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect MetaMask
                </button>
              </div>
            </div>

            {/* Add/Edit Wallet Form */}
            {showAddWalletForm ? (
              <div className="mb-6 bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {editingWallet ? 'Edit Wallet' : 'Add New Wallet'}
                  </h3>
                  <button
                    onClick={handleCancelWalletForm}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitWallet} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-slate-300 text-sm font-medium">
                        Wallet Address
                      </label>
                      <button
                        type="button"
                        onClick={() => handleConnectWallet(true)}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Connect Wallet
                      </button>
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={walletForm.address}
                      onChange={handleWalletFormChange}
                      placeholder="0x..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Wallet Name
                    </label>
                    <input
                      type="text"
                      name="walletName"
                      value={walletForm.walletName}
                      onChange={handleWalletFormChange}
                      placeholder="e.g., My Personal Wallet"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                    >
                      {editingWallet ? 'Update Wallet' : 'Add Wallet'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelWalletForm}
                      className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              null
            )}

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
    </>
  );
};

export default Settings;