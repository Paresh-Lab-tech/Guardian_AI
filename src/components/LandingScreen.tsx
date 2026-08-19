import React, { useState, useEffect } from 'react';
import { GuardianLogo } from './GuardianLogo';

interface LandingScreenProps {
  onEnterApp: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnterApp }) => {
  const [initStep, setInitStep] = useState(0);

  const initLogs = [
    'Initializing Secure Hardware Enclave...',
    'Checking On-Device Model Sandbox...',
    'Establishing System Permission Boundaries...',
    'Guardian AI Agent Ready.'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setInitStep(1), 350);
    const timer2 = setTimeout(() => setInitStep(2), 700);
    const timer3 = setTimeout(() => setInitStep(3), 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-between px-6 py-10 md:py-16 text-center select-none overflow-hidden">
      {/* Background Cyber Circuit Glow & Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF6B00]/12 via-[#0B0D10]/80 to-[#0B0D10] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Tag & Version */}
      <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ADC6FF]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#55E16B] animate-ping" />
        <span>v2.4.1 SECURE ENTERPRISE EDITION</span>
      </div>

      {/* Center Hero: Logo & Title matching Image 1.jpeg */}
      <div className="relative z-10 flex flex-col items-center gap-6 my-auto max-w-lg">
        {/* Glowing Logo */}
        <div className="relative group cursor-pointer" onClick={onEnterApp}>
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B00]/30 to-[#FFB693]/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
          <GuardianLogo size="xl" className="transform group-hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            GUARDIAN <span className="text-[#FF6B00]">AI AGENT</span>
          </h1>
          <p className="text-sm md:text-base text-[#E2BFB0]/90 font-medium max-w-md mx-auto leading-relaxed">
            High-performance autonomous device agent. Effortless task automation with absolute user authority.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-3 gap-3 w-full pt-4">
          <div className="p-3 rounded-2xl bg-[#12151A] border border-white/10 flex flex-col items-center text-center gap-1.5 shadow-lg">
            <span className="material-symbols-outlined text-[#FF6B00] text-[22px]">smart_toy</span>
            <span className="text-[11px] font-bold text-white">Automate</span>
            <span className="text-[10px] text-white/50 leading-tight">Multi-step UI tasks</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#12151A] border border-white/10 flex flex-col items-center text-center gap-1.5 shadow-lg">
            <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">shield</span>
            <span className="text-[11px] font-bold text-white">Air-Gapped</span>
            <span className="text-[10px] text-white/50 leading-tight">Strict local safety</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#12151A] border border-white/10 flex flex-col items-center text-center gap-1.5 shadow-lg">
            <span className="material-symbols-outlined text-[#55E16B] text-[22px]">verified_user</span>
            <span className="text-[11px] font-bold text-white">Full Control</span>
            <span className="text-[10px] text-white/50 leading-tight">Explicit OK for risk</span>
          </div>
        </div>

        {/* Live Init Terminal Stream */}
        <div className="w-full bg-[#101418] border border-white/10 rounded-xl p-3 text-left font-mono text-[11px] text-[#ADC6FF] space-y-1 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1 text-white/50 text-[10px]">
            <span>SYSTEM DIAGNOSTIC</span>
            <span className="text-[#55E16B] font-bold">READY</span>
          </div>
          {initLogs.slice(0, initStep + 1).map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#FF6B00]">&gt;</span>
              <span className={idx === initStep ? 'text-white font-medium' : 'text-white/60'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Action Button */}
      <div className="relative z-10 w-full max-w-md pt-4 space-y-3">
        <button
          onClick={onEnterApp}
          className="w-full py-4 px-8 rounded-2xl bg-[#FF6B00] text-[#351000] font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,107,0,0.45)] hover:shadow-[0_0_35px_rgba(255,107,0,0.7)] hover:bg-[#FFB693] active:scale-98 transition-all cursor-pointer transform"
        >
          <span>Launch Guardian AI</span>
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </button>

        <p className="text-[11px] font-mono text-white/50">
          Press to enter high-performance control dashboard
        </p>
      </div>
    </div>
  );
};
