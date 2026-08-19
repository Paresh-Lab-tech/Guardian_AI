import React from 'react';
import { GuardianLogo } from './GuardianLogo';
import { AgentStatus } from '../types';

interface TopAppBarProps {
  status: AgentStatus;
  onLogoClick?: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  status,
  onLogoClick,
  isPhoneFrame,
  onTogglePhoneFrame
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'RUNNING':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#55E16B]/10 border border-[#55E16B]/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#55E16B] animate-pulse" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#55E16B] uppercase">
              RUNNING
            </span>
          </div>
        );
      case 'PAUSED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#FFB693] uppercase">
              PAUSED
            </span>
          </div>
        );
      case 'WAITING_APPROVAL':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FF3B30]/15 border border-[#FF3B30]/40 rounded-full animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-ping" />
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#FFB4AB] uppercase">
              APPROVAL REQ
            </span>
          </div>
        );
      case 'IDLE':
      default:
        return (
          <div className="status-chip px-3 py-1 rounded-full font-mono text-[11px] font-medium flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ADC6FF] animate-pulse" />
            IDLE
          </div>
        );
    }
  };

  return (
    <header className="bg-[#101418] text-[#FFB693] border-b border-white/10 flex justify-between items-center px-4 h-16 w-full sticky top-0 z-40 transition-colors">
      {/* Brand */}
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer focus:outline-none"
      >
        <GuardianLogo size="sm" />
        <h1 className="text-xl md:text-2xl font-bold text-[#FFB693] tracking-tight font-sans">
          Guardian AI
        </h1>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Device Viewport Toggle button (useful on desktop) */}
        <button
          onClick={onTogglePhoneFrame}
          title={isPhoneFrame ? 'Switch to Expanded Layout' : 'Switch to Android Phone Mockup'}
          className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPhoneFrame ? 'fullscreen' : 'smartphone'}
          </span>
          <span className="hidden lg:inline">{isPhoneFrame ? 'Expand' : 'Android Frame'}</span>
        </button>

        {getStatusBadge()}
      </div>
    </header>
  );
};
