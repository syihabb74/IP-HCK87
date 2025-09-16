const CoinCard = ({
  rank,
  name,
  symbol,
  price,
  change24h,
  volume,
  marketCap,
  icon,
  image,
  isPositive,
  onTrade
}) => {
  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4">
        <span className="text-slate-400 font-medium">{rank}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {image ? (
            <img
              src={image}
              alt={`${name} logo`}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{display: image ? 'none' : 'flex'}}>
            {icon}
          </div>
          <div>
            <div className="text-white font-semibold">{name}</div>
            <div className="text-slate-400 text-sm">{symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-white font-semibold">{price}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change24h}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-slate-300">{volume}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-slate-300">{marketCap}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onTrade && onTrade({ name, symbol, price })}
          className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          Trade
        </button>
      </td>
    </tr>
  );
};

export default CoinCard;