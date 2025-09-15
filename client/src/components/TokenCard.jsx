const TokenCard = ({
  icon,
  name,
  symbol,
  amount,
  value,
  changePercent,
  iconBgColor = "bg-orange-500"
}) => {
  const isPositive = changePercent >= 0;
  const changeColor = isPositive ? "text-green-400" : "text-red-400";
  const changeSign = isPositive ? "+" : "";

  return (
    <div className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-700/70 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center text-white font-bold text-sm`}>
          {icon}
        </div>
        <div>
          <h4 className="text-white font-semibold">{name}</h4>
          <p className="text-slate-400 text-sm">{amount} {symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white font-bold">{value}</div>
        <div className={`text-sm ${changeColor}`}>
          {changeSign}{changePercent}%
        </div>
      </div>
    </div>
  );
};

export default TokenCard;