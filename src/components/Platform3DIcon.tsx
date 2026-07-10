import React from 'react';
import { PlatformId } from '../types';

interface Platform3DIconProps {
  platformId: PlatformId;
  className?: string;
  size?: number;
}

export default function Platform3DIcon({ platformId, className = '', size = 48 }: Platform3DIconProps) {
  switch (platformId) {
    case PlatformId.OneXBet:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Real 1xBet Blue Background Gradient */}
            <linearGradient id="onex-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10426e" />
              <stop offset="50%" stopColor="#175082" />
              <stop offset="100%" stopColor="#1f629c" />
            </linearGradient>
            
            {/* 3D Glass Specular Reflection */}
            <linearGradient id="glass-glare" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.35" />
              <stop offset="30%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="cyan-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Premium 3D Beveled Outer Container */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#onex-bg-grad)"
            stroke="#1d72b8"
            strokeWidth="1.5"
            filter="drop-shadow(0 6px 12px rgba(0,0,0,0.5))"
          />
          
          {/* Inner Glossy Border */}
          <rect
            x="7"
            y="7"
            width="86"
            height="86"
            rx="21"
            stroke="white"
            strokeOpacity="0.12"
            strokeWidth="1"
          />

          {/* Inner Dark Badge Frame */}
          <rect
            x="12"
            y="24"
            width="76"
            height="52"
            rx="12"
            fill="#0b2844"
            stroke="#1e81d3"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
          />

          {/* Authentic 1xBET Logo Representation */}
          <g transform="translate(18, 36) scale(0.9)">
            {/* "1" - Slanted White numeral */}
            <path
              d="M3.5 0 L14.5 0 L6.5 28 L0.5 28 Z"
              fill="#FFFFFF"
            />
            <path
              d="M0.5 10 L8.5 0 L3.5 0 L-2.5 10 Z"
              fill="#FFFFFF"
            />

            {/* "X" with Split Colors (Left White, Right Cyan) */}
            {/* Left-to-right diagonal: White */}
            <path
              d="M14 0 L22 0 L34 28 L26 28 Z"
              fill="#FFFFFF"
            />
            {/* Right-to-left diagonal: Cyan */}
            <path
              d="M32 0 L24 0 L12 28 L20 28 Z"
              fill="#00a2f1"
            />

            {/* "BET" - Slanted Cyan block font */}
            <text
              x="36"
              y="23"
              fill="#00a2f1"
              fontSize="24"
              fontWeight="950"
              fontFamily="'Impact', 'Arial Black', sans-serif"
              fontStyle="italic"
              letterSpacing="0.5px"
            >
              BET
            </text>
          </g>

          {/* Glass Specular Gloss Sweep overlay */}
          <path
            d="M 4,28 Q 50,42 96,28 L 96,4 L 4,4 Z"
            fill="url(#glass-glare)"
            pointerEvents="none"
          />

          {/* Glowing tech dot */}
          <circle cx="50" cy="14" r="2" fill="#00a2f1" filter="url(#cyan-glow-filter)" />
        </svg>
      );

    case PlatformId.Melbet:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Charcoal dark premium background */}
            <linearGradient id="mel-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#151515" />
              <stop offset="50%" stopColor="#1e1e1e" />
              <stop offset="100%" stopColor="#282828" />
            </linearGradient>

            {/* Yellow-orange gradient for BET part */}
            <linearGradient id="mel-yellow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC107" />
              <stop offset="100%" stopColor="#F5B800" />
            </linearGradient>
            
            {/* Glass Specular Reflection */}
            <linearGradient id="glass-glare" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="40%" stopColor="white" stopOpacity="0.02" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <filter id="mel-gold-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Outer Premium 3D Rounded Shield */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#mel-bg-grad)"
            stroke="#F5B800"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            filter="drop-shadow(0 6px 12px rgba(0,0,0,0.6))"
          />

          {/* Inner border line */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="20"
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="1"
          />

          {/* Inner Core Plate */}
          <rect
            x="10"
            y="24"
            width="80"
            height="52"
            rx="12"
            fill="#0F0F0F"
            stroke="#282828"
            strokeWidth="1"
            filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
          />

          {/* Authentic MELBET logo representation */}
          <text
            x="50"
            y="57"
            fontStyle="italic"
            fontWeight="950"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            fontSize="18"
            textAnchor="middle"
            letterSpacing="0.2px"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          >
            <tspan fill="#FFFFFF">MEL</tspan>
            <tspan fill="url(#mel-yellow-grad)">BET</tspan>
          </text>

          {/* High-quality gloss reflection map */}
          <path
            d="M 4,28 Q 50,42 96,28 L 96,4 L 4,4 Z"
            fill="url(#glass-glare)"
            pointerEvents="none"
          />

          {/* Premium Gold Accent Dot */}
          <circle cx="50" cy="14" r="2.5" fill="#F5B800" filter="url(#mel-gold-glow)" />
        </svg>
      );

    case PlatformId.Stake:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Stake Dark Blue-Green Metallic Background */}
            <linearGradient id="stake-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f212c" />
              <stop offset="50%" stopColor="#142c3b" />
              <stop offset="100%" stopColor="#1a3749" />
            </linearGradient>
            
            {/* Stake Brand Aqua-White Glow */}
            <linearGradient id="stake-brand-color" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f5f8" />
            </linearGradient>

            {/* Specular Glare */}
            <linearGradient id="glass-glare-stake" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="35%" stopColor="white" stopOpacity="0.03" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <filter id="stake-glow-filter" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Heavy 3D Gaming Coin / Shield */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#stake-bg-grad)"
            stroke="#214054"
            strokeWidth="1.5"
            filter="drop-shadow(0 6px 12px rgba(0,0,0,0.55))"
          />

          {/* Inner Groove Frame */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="20"
            stroke="#00E676"
            strokeWidth="1"
            strokeOpacity="0.25"
            strokeDasharray="4 2"
          />

          {/* Inner Core Slate */}
          <rect
            x="10"
            y="24"
            width="80"
            height="52"
            rx="12"
            fill="#09141b"
            stroke="#183140"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
          />

          {/* Authentic Stake Script Logo Drawing */}
          {/* The script "Stake" with beautifully formed spline paths */}
          <g transform="translate(16, 28) scale(0.85)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))">
            {/* The cursive word "Stake" precisely traced as a single smooth path */}
            <path
              d="M13.5 15.2 C11.8 11.4 15.1 8.1 19.8 8.1 C24.5 8.1 27.6 11.2 27.6 15.6 C27.6 22.8 15.6 23.4 15.6 28.5 C15.6 32.4 19.8 34.6 24.3 34.6 C28.1 34.6 32.2 32.1 33.5 28.5 L28.8 28.5 C27.8 30.2 25.8 31.1 24.1 31.1 C21.8 31.1 20.2 29.8 20.2 28.1 C20.2 21.6 32.5 20.6 32.5 15.0 C32.5 9.0 27.3 4.5 19.6 4.5 C12.2 4.5 6.8 9.5 8.1 16.0 L13.5 15.2 Z 
                 M40.2 13.5 L40.2 8.5 L35.2 8.5 L35.2 13.5 L31.5 13.5 L31.5 17.5 L35.2 17.5 L35.2 28.5 C35.2 32.5 37.6 34.5 41.5 34.5 C43.2 34.5 45.2 33.8 46.2 32.5 L44.8 28.8 C44.1 29.5 43.1 29.8 42.1 29.8 C40.8 29.8 40.2 28.8 40.2 27.2 L40.2 17.5 L45.8 17.5 L45.8 13.5 L40.2 13.5 Z 
                 M55.8 13.1 C51.5 13.1 48.1 16.5 48.1 22.5 C48.1 28.5 51.5 31.8 55.8 31.8 C58.2 31.8 60.5 30.5 61.8 28.5 L61.8 31.5 L66.5 31.5 L66.5 13.5 L61.8 13.5 L61.8 16.5 C60.5 14.5 58.2 13.1 55.8 13.1 Z 
                 M57.5 17.1 C59.8 17.1 61.8 18.8 61.8 22.5 C61.8 26.2 59.8 27.8 57.5 27.8 C55.2 27.8 53.2 26.2 53.2 22.5 C53.2 18.8 55.2 17.1 57.5 17.1 Z 
                 M72.2 4.5 L72.2 31.5 L77.2 31.5 L77.2 20.5 L83.2 31.5 L89.5 31.5 L81.8 17.8 L88.5 13.5 L82.5 13.5 L77.2 17.8 L77.2 4.5 L72.2 4.5 Z"
              fill="url(#stake-brand-color)"
            />

            {/* ".com" Subtitle aligned professionally */}
            <text
              x="50"
              y="44"
              fill="#FFFFFF"
              opacity="0.85"
              fontSize="10"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              letterSpacing="0.5px"
            >
              .com
            </text>
          </g>

          {/* Gloss overlay */}
          <path
            d="M 4,28 Q 50,42 96,28 L 96,4 L 4,4 Z"
            fill="url(#glass-glare-stake)"
            pointerEvents="none"
          />

          {/* Premium green indicator dot */}
          <circle cx="50" cy="14" r="2.5" fill="#00E676" filter="url(#stake-glow-filter)" />
        </svg>
      );

    default:
      return null;
  }
}
