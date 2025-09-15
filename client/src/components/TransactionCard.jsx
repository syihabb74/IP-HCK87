const TransactionCard = ({
  type,
  coinName,
  amount,
  value,
  timestamp,
  isLast = false
}) => {
  const isBuy = type.toLowerCase() === 'buy';
  const badgeColor = isBuy ? 'bg-green-500' : 'bg-red-500';
  const badgeText = isBuy ? 'BUY' : 'SELL';

  return (
    <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b border-slate-700/50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${badgeColor} text-white`}>
          {badgeText}
        </div>
        <div>
          <div className="font-semibold text-white">{coinName}</div>
          <div className="text-slate-400 text-sm">{amount}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-white">{value}</div>
        <div className="text-slate-400 text-sm">{timestamp}</div>
      </div>
    </div>
  );
};

export default TransactionCard;