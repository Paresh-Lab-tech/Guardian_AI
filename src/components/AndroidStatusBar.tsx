import React, { useState, useEffect } from 'react';

interface AndroidStatusBarProps {
  isMicActive?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ isMicActive = false }) => {
  const [time, setTime] = useState('10:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${mins < 10 ? '0' : ''}${mins}`;
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0B0D10] text-[#E1E2E9] px-4 py-1.5 flex items-center justify-between text-xs font-mono select-none border-b border-white/5 z-50">
      {/* Left: Time & App Notification Icons */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-xs tracking-tight text-white">{time}</span>
        {isMicActive && (
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#55E16B] animate-pulse" title="Microphone Access Active" />
        )}
      </div>

      {/* Center: Punch Hole Camera Simulator */}
      <div className="w-3.5 h-3.5 rounded-full bg-[#000000] border border-white/10 shadow-inner flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-[#1A202C]"></div>
      </div>

      {/* Right: Network, 5G, Battery */}
      <div className="flex items-center gap-2 text-[11px] text-white/80">
        <span className="text-[10px] font-bold text-[#ADC6FF] tracking-wider">5G</span>
        
        {/* Wifi Icon */}
        <span className="material-symbols-outlined text-[14px]">wifi</span>
        
        {/* Cell signal */}
        <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">98%</span>
          <span className="material-symbols-outlined text-[16px] text-[#55E16B]">battery_full</span>
        </div>
      </div>
    </div>
  );
};
