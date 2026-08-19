import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadTasksCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  unreadTasksCount = 0
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'tasks', label: 'Tasks', icon: 'assignment' },
    { id: 'privacy', label: 'Privacy', icon: 'verified_user' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <nav
      id="bottom-navigation"
      aria-label="Main Navigation"
      className="bg-[#1D2025] text-[#FFB693] font-mono text-xs border-t border-white/10 shadow-2xl fixed md:sticky bottom-0 w-full z-50 rounded-t-2xl flex flex-col items-center select-none backdrop-blur-md"
    >
      <div className="flex justify-around items-center w-full px-3 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer min-w-[64px] py-1 ${
                isActive
                  ? 'bg-[#FF6B00] text-[#351000] font-bold rounded-full px-5 py-1.5 shadow-[0_0_15px_rgba(255,107,0,0.35)] scale-100'
                  : 'text-[#E1E2E9]/70 hover:text-white scale-95 active:scale-90 hover:bg-white/5 rounded-xl px-3 py-1'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'fill scale-105' : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.id === 'tasks' && unreadTasksCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#55E16B] animate-ping" />
                )}
              </div>
              <span className={`text-[11px] font-sans tracking-wide mt-0.5 ${isActive ? 'font-bold text-[#351000]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android Bottom Navigation Pill Indicator */}
      <div className="w-full flex justify-center pb-1.5 pt-0.5">
        <div className="w-28 h-1 bg-white/20 rounded-full"></div>
      </div>
    </nav>
  );
};
