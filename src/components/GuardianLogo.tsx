import React from 'react';

interface GuardianLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const GuardianLogo: React.FC<GuardianLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center`}>
        {/* SVG Shield with Cyber Circuit 'A' */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(255,107,0,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Outline */}
          <path
            d="M50 8 L88 24 C88 56 68 84 50 94 C32 84 12 56 12 24 L50 8 Z"
            stroke="#FF6B00"
            strokeWidth="4.5"
            strokeLinejoin="round"
            fill="#0F1318"
          />

          {/* Inner Accent White Angles */}
          <path
            d="M50 18 L76 30 C76 54 62 76 50 84 C38 76 24 54 24 30 L50 18 Z"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.85"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Central Stylized Cyber 'A' Circuit */}
          <path
            d="M50 20 L50 38 M50 38 L32 72 M50 38 L68 72"
            stroke="#FF7A1A"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Crossbar of 'A' */}
          <path
            d="M39 55 L61 55"
            stroke="#FF7A1A"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Inner Triangle */}
          <polygon
            points="50,42 42,54 58,54"
            fill="#FFFFFF"
          />

          {/* Circuit nodes / dots */}
          <circle cx="32" cy="72" r="3.2" fill="#FF7A1A" stroke="#0B0D10" strokeWidth="1.5" />
          <circle cx="68" cy="72" r="3.2" fill="#FF7A1A" stroke="#0B0D10" strokeWidth="1.5" />
          <circle cx="41" cy="46" r="2.8" fill="#FF9E59" />
          <circle cx="59" cy="46" r="2.8" fill="#FF9E59" />

          {/* Bottom V Accent */}
          <path
            d="M38 78 L50 86 L62 78"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-white text-base leading-none">
            Guardian <span className="text-[#FFB693]">AI</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#FF6B00] uppercase font-semibold">
            Agent System
          </span>
        </div>
      )}
    </div>
  );
};
