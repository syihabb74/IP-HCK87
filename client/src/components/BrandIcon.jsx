import React from 'react';

const BrandIcon = ({ size = 32, className = '', animate = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#22D3EE', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#2563EB', stopOpacity:1}} />
        </linearGradient>
        <filter id="brandGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main Icon Shape */}
      <circle cx="16" cy="16" r="14" fill="url(#brandGradient)" filter="url(#brandGlow)"/>

      {/* Central Core */}
      <circle cx="16" cy="16" r="3" fill="white"/>

      {/* Tech Lines */}
      <path d="M16 5 L16 13" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M16 19 L16 27" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M5 16 L13 16" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M19 16 L27 16" stroke="white" strokeWidth="1.5" opacity="0.8"/>

      {/* Data Nodes */}
      <circle cx="16" cy="5" r="2" fill="white"/>
      <circle cx="16" cy="27" r="2" fill="white"/>
      <circle cx="5" cy="16" r="2" fill="white"/>
      <circle cx="27" cy="16" r="2" fill="white"/>

      {/* Finance Chart */}
      <path d="M8 20 L12 16 L16 18 L20 14 L24 16"
            stroke="white"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"/>

      {/* Digital Elements */}
      <rect x="6" y="6" width="1" height="1" fill="white" opacity="0.6"/>
      <rect x="9" y="6" width="1" height="1" fill="white" opacity="0.8"/>
      <rect x="25" y="6" width="1" height="1" fill="white" opacity="0.6"/>
      <rect x="22" y="9" width="1" height="1" fill="white" opacity="0.8"/>

      {animate && (
        <>
          {/* Pulse Animation */}
          <circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4">
            <animate attributeName="r" values="3;10;3" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
          </circle>
        </>
      )}
    </svg>
  );
};

export default BrandIcon;