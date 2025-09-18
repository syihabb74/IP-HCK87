import React from 'react';

const EmptyStateIcon = ({ type, size = 96, className = '' }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 96 96",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className
  };

  const renderIcon = () => {
    switch (type) {
      case 'portfolio':
        return (
          <svg {...commonProps}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#64748B', stopOpacity:0.8}} />
                <stop offset="100%" style={{stopColor:'#475569', stopOpacity:0.8}} />
              </linearGradient>
            </defs>

            {/* Chart Background */}
            <rect x="20" y="20" width="56" height="40" rx="4" fill="url(#portfolioGradient)" opacity="0.3"/>

            {/* Chart Grid Lines */}
            <path d="M25 30 L71 30 M25 40 L71 40 M25 50 L71 50"
                  stroke="#64748B" strokeWidth="0.5" opacity="0.4"/>
            <path d="M30 25 L30 55 M40 25 L40 55 M50 25 L50 55 M60 25 L60 55 M70 25 L70 55"
                  stroke="#64748B" strokeWidth="0.5" opacity="0.4"/>

            {/* Empty Chart Line */}
            <path d="M25 45 L35 42 L45 45 L55 42 L65 45 L71 43"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"/>

            {/* Portfolio Icon */}
            <circle cx="48" cy="48" r="20" fill="none" stroke="#64748B" strokeWidth="2" opacity="0.4"/>
            <path d="M38 48 L44 42 L48 46 L52 40 L58 44"
                  stroke="#64748B" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

            {/* Empty Indicators */}
            <circle cx="44" cy="42" r="1.5" fill="#64748B" opacity="0.5"/>
            <circle cx="48" cy="46" r="1.5" fill="#64748B" opacity="0.5"/>
            <circle cx="52" cy="40" r="1.5" fill="#64748B" opacity="0.5"/>

            {/* Plus Icon for Add */}
            <circle cx="70" cy="26" r="8" fill="#22D3EE" opacity="0.2"/>
            <path d="M66 26 L74 26 M70 22 L70 30" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );

      case 'holdings':
        return (
          <svg {...commonProps}>
            <defs>
              <linearGradient id="holdingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#64748B', stopOpacity:0.8}} />
                <stop offset="100%" style={{stopColor:'#475569', stopOpacity:0.8}} />
              </linearGradient>
            </defs>

            {/* Table Structure */}
            <rect x="16" y="24" width="64" height="48" rx="4" fill="url(#holdingsGradient)" opacity="0.2"/>

            {/* Table Headers */}
            <rect x="16" y="24" width="64" height="8" rx="4" fill="url(#holdingsGradient)" opacity="0.3"/>

            {/* Table Rows (Empty) */}
            <rect x="20" y="36" width="56" height="2" fill="#64748B" opacity="0.3"/>
            <rect x="20" y="42" width="56" height="2" fill="#64748B" opacity="0.2"/>
            <rect x="20" y="48" width="56" height="2" fill="#64748B" opacity="0.1"/>

            {/* Coins Stack */}
            <circle cx="48" cy="48" r="12" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="3,3" opacity="0.4"/>
            <circle cx="46" cy="46" r="8" fill="none" stroke="#64748B" strokeWidth="1.5" opacity="0.3"/>
            <circle cx="50" cy="50" r="6" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.2"/>

            {/* Dollar Signs */}
            <text x="48" y="52" textAnchor="middle" fontSize="12" fill="#64748B" opacity="0.4" fontFamily="monospace">$</text>

            {/* Empty State Indicators */}
            <circle cx="32" cy="40" r="1" fill="#64748B" opacity="0.3"/>
            <circle cx="48" cy="40" r="1" fill="#64748B" opacity="0.3"/>
            <circle cx="64" cy="40" r="1" fill="#64748B" opacity="0.3"/>
          </svg>
        );

      default:
        return null;
    }
  };

  return renderIcon();
};

export default EmptyStateIcon;