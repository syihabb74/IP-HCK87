const WalletCard = ({ wallet, onEdit, onDelete }) => {
  const { id, address, walletName } = wallet;

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:bg-slate-700/70 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">{walletName || 'MetaMask Wallet'}</h3>
            <p className="text-slate-400 text-sm">{shortenAddress(address)}</p>
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
            onClick={() => onEdit && onEdit(wallet)}
            className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-lg transition-all duration-300"
            title="Edit Wallet Name"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete && onDelete(wallet)}
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
  );
};

export default WalletCard;