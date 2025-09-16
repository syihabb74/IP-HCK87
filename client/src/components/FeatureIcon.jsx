import React from 'react';

const FeatureIcon = ({ type, size = 80, className = '' }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 80 80",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className
  };

  const renderIcon = () => {
    switch (type) {
      case 'realtime':
        return (
          <svg {...commonProps}>
            <defs>
              <linearGradient id="realtimeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
              </linearGradient>
              <filter id="realtimeGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background Circle */}
            <circle cx="40" cy="40" r="38" fill="url(#realtimeGradient)" filter="url(#realtimeGlow)"/>

            {/* Chart Grid */}
            <path d="M15 20 L65 20 M15 30 L65 30 M15 40 L65 40 M15 50 L65 50 M15 60 L65 60"
                  stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <path d="M20 15 L20 65 M30 15 L30 65 M40 15 L40 65 M50 15 L50 65 M60 15 L60 65"
                  stroke="white" strokeWidth="0.5" opacity="0.3"/>

            {/* Real-time Data Line */}
            <path d="M15 45 L25 35 L35 40 L45 25 L55 30 L65 20"
                  stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Data Points */}
            <circle cx="25" cy="35" r="3" fill="white"/>
            <circle cx="35" cy="40" r="3" fill="white"/>
            <circle cx="45" cy="25" r="3" fill="white"/>
            <circle cx="55" cy="30" r="3" fill="white"/>

            {/* Pulse Animation Elements */}
            <circle cx="45" cy="25" r="5" fill="white" opacity="0.6">
              <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
            </circle>

            {/* Digital Display */}
            <rect x="50" y="45" width="20" height="12" rx="2" fill="white" opacity="0.2"/>
            <text x="60" y="53" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace">LIVE</text>
          </svg>
        );

      case 'analytics':
        return (
          <svg {...commonProps}>
            <defs>
              <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="40" cy="40" r="38" fill="url(#analyticsGradient)"/>

            {/* Brain/Neural Network Pattern */}
            <circle cx="30" cy="25" r="4" fill="white" opacity="0.8"/>
            <circle cx="50" cy="25" r="4" fill="white" opacity="0.8"/>
            <circle cx="40" cy="40" r="5" fill="white"/>
            <circle cx="25" cy="50" r="3" fill="white" opacity="0.7"/>
            <circle cx="55" cy="50" r="3" fill="white" opacity="0.7"/>
            <circle cx="40" cy="60" r="4" fill="white" opacity="0.8"/>

            {/* Neural Connections */}
            <path d="M30 25 L40 40 M50 25 L40 40 M40 40 L25 50 M40 40 L55 50 M40 40 L40 60"
                  stroke="white" strokeWidth="2" opacity="0.6"/>

            {/* Trend Arrows */}
            <path d="M15 35 L20 30 L15 25" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M65 25 L60 30 L65 35" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* Chart Bars */}
            <rect x="18" y="50" width="3" height="15" fill="white" opacity="0.6"/>
            <rect x="22" y="45" width="3" height="20" fill="white" opacity="0.8"/>
            <rect x="26" y="40" width="3" height="25" fill="white"/>

            <rect x="51" y="45" width="3" height="20" fill="white" opacity="0.6"/>
            <rect x="55" y="40" width="3" height="25" fill="white" opacity="0.8"/>
            <rect x="59" y="35" width="3" height="30" fill="white"/>
          </svg>
        );

      case 'security':
        return (
          <svg {...commonProps}>
            <defs>
              <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="40" cy="40" r="38" fill="url(#securityGradient)"/>

            {/* Shield Shape */}
            <path d="M40 15 L55 25 L55 45 C55 55 40 65 40 65 C40 65 25 55 25 45 L25 25 Z"
                  fill="white" opacity="0.9"/>

            {/* Lock Symbol */}
            <rect x="35" y="35" width="10" height="12" rx="2" fill="url(#securityGradient)"/>
            <path d="M33 35 L33 30 C33 26 36 23 40 23 C44 23 47 26 47 30 L47 35"
                  stroke="url(#securityGradient)" strokeWidth="2" fill="none"/>

            {/* Security Patterns */}
            <circle cx="30" cy="30" r="2" fill="white" opacity="0.6"/>
            <circle cx="50" cy="30" r="2" fill="white" opacity="0.6"/>
            <circle cx="28" cy="50" r="1.5" fill="white" opacity="0.5"/>
            <circle cx="52" cy="50" r="1.5" fill="white" opacity="0.5"/>

            {/* Encryption Lines */}
            <path d="M20 20 L25 22 M20 25 L23 26 M20 30 L24 31"
                  stroke="white" strokeWidth="1" opacity="0.4"/>
            <path d="M60 20 L55 22 M60 25 L57 26 M60 30 L56 31"
                  stroke="white" strokeWidth="1" opacity="0.4"/>
          </svg>
        );

      default:
        return null;
    }
  };

  return renderIcon();
};

export default FeatureIcon;