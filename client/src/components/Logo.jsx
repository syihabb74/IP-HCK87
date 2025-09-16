import React from 'react';

const Logo = ({ variant = 'full', size = 'medium', className = '' }) => {
  const getLogoPath = () => {
    switch (variant) {
      case 'icon':
        return '/src/assets/logos/DexTrackerIcon.svg';
      case 'compact':
        return '/src/assets/logos/DexTrackerCompact.svg';
      case 'full':
      default:
        return '/src/assets/logos/DexTrackerLogo.svg';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-24 h-auto';
      case 'large':
        return 'w-64 h-auto';
      case 'xl':
        return 'w-80 h-auto';
      case 'medium':
      default:
        return 'w-40 h-auto';
    }
  };

  // SVG Content based on variant
  const renderSVG = () => {
    if (variant === 'icon') {
      return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${getSizeClasses()} ${className}`}>
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="30" cy="30" r="28" fill="url(#iconGradient)" filter="url(#glow)"/>
          <circle cx="30" cy="30" r="25" fill="url(#iconGradient)"/>
          <circle cx="30" cy="30" r="4" fill="white"/>
          <path d="M30 15 L30 25" stroke="white" strokeWidth="2" opacity="0.8"/>
          <path d="M30 35 L30 45" stroke="white" strokeWidth="2" opacity="0.8"/>
          <path d="M15 30 L25 30" stroke="white" strokeWidth="2" opacity="0.8"/>
          <path d="M35 30 L45 30" stroke="white" strokeWidth="2" opacity="0.8"/>
          <path d="M21 21 L26 26" stroke="white" strokeWidth="1.5" opacity="0.6"/>
          <path d="M34 34 L39 39" stroke="white" strokeWidth="1.5" opacity="0.6"/>
          <path d="M39 21 L34 26" stroke="white" strokeWidth="1.5" opacity="0.6"/>
          <path d="M26 34 L21 39" stroke="white" strokeWidth="1.5" opacity="0.6"/>
          <circle cx="30" cy="15" r="3" fill="white"/>
          <circle cx="30" cy="45" r="3" fill="white"/>
          <circle cx="15" cy="30" r="3" fill="white"/>
          <circle cx="45" cy="30" r="3" fill="white"/>
          <circle cx="21" cy="21" r="2" fill="white" opacity="0.8"/>
          <circle cx="39" cy="39" r="2" fill="white" opacity="0.8"/>
          <circle cx="39" cy="21" r="2" fill="white" opacity="0.8"/>
          <circle cx="21" cy="39" r="2" fill="white" opacity="0.8"/>
          <path d="M18 38 L22 34 L26 36 L30 30 L34 32 L38 28 L42 30" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
          <rect x="12" y="12" width="1.5" height="1.5" fill="white" opacity="0.5"/>
          <rect x="15" y="12" width="1.5" height="1.5" fill="white" opacity="0.7"/>
          <rect x="46" y="12" width="1.5" height="1.5" fill="white" opacity="0.5"/>
          <rect x="43" y="15" width="1.5" height="1.5" fill="white" opacity="0.7"/>
          <rect x="12" y="46" width="1.5" height="1.5" fill="white" opacity="0.5"/>
          <rect x="15" y="43" width="1.5" height="1.5" fill="white" opacity="0.7"/>
          <rect x="46" y="46" width="1.5" height="1.5" fill="white" opacity="0.5"/>
          <rect x="43" y="43" width="1.5" height="1.5" fill="white" opacity="0.7"/>
        </svg>
      );
    }

    if (variant === 'compact') {
      return (
        <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${getSizeClasses()} ${className}`}>
          <defs>
            <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
            </linearGradient>
            <linearGradient id="compactTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:'#FFFFFF', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#compactGradient)"/>
          <path d="M8 20 L14 14 L20 18 L26 12 L32 15" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="14" cy="14" r="1.5" fill="white"/>
          <circle cx="20" cy="18" r="1.5" fill="white"/>
          <circle cx="26" cy="12" r="1.5" fill="white"/>
          <rect x="10" y="8" width="6" height="0.8" fill="white" opacity="0.6"/>
          <rect x="24" y="8" width="6" height="0.8" fill="white" opacity="0.6"/>
          <rect x="13" y="6" width="0.8" height="4" fill="white" opacity="0.6"/>
          <rect x="27" y="6" width="0.8" height="4" fill="white" opacity="0.6"/>
          <rect x="28" y="24" width="1" height="1" fill="white" opacity="0.8"/>
          <rect x="30" y="24" width="1" height="1" fill="white" opacity="0.4"/>
          <rect x="32" y="24" width="1" height="1" fill="white" opacity="0.8"/>
          <rect x="28" y="26" width="1" height="1" fill="white" opacity="0.4"/>
          <rect x="30" y="26" width="1" height="1" fill="white" opacity="0.8"/>
          <rect x="32" y="26" width="1" height="1" fill="white" opacity="0.4"/>
          <text x="45" y="28" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="url(#compactTextGradient)">
            DexTracker
          </text>
        </svg>
      );
    }

    // Full logo (default)
    return (
      <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${getSizeClasses()} ${className}`}>
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#FFFFFF', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
          </linearGradient>
        </defs>
        <circle cx="30" cy="30" r="25" fill="url(#logoGradient)" opacity="0.1"/>
        <circle cx="30" cy="30" r="20" fill="url(#logoGradient)"/>
        <path d="M18 38 L24 32 L30 35 L36 25 L42 28" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="32" r="2" fill="white"/>
        <circle cx="30" cy="35" r="2" fill="white"/>
        <circle cx="36" cy="25" r="2" fill="white"/>
        <rect x="20" y="20" width="8" height="1" fill="white" opacity="0.6"/>
        <rect x="32" y="20" width="8" height="1" fill="white" opacity="0.6"/>
        <rect x="25" y="17" width="1" height="6" fill="white" opacity="0.6"/>
        <rect x="35" y="17" width="1" height="6" fill="white" opacity="0.6"/>
        <rect x="38" y="18" width="2" height="2" fill="white" opacity="0.8"/>
        <rect x="41" y="18" width="2" height="2" fill="white" opacity="0.6"/>
        <rect x="38" y="21" width="2" height="2" fill="white" opacity="0.6"/>
        <rect x="41" y="21" width="2" height="2" fill="white" opacity="0.8"/>
        <text x="70" y="25" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="url(#textGradient)">
          DexTracker
        </text>
        <text x="70" y="40" fontFamily="Arial, sans-serif" fontSize="10" fill="#64748B">
          Crypto Portfolio Intelligence
        </text>
      </svg>
    );
  };

  return renderSVG();
};

export default Logo;