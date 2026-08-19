import React, { useState } from 'react';
import { GuardianLogo } from './GuardianLogo';

interface SettingsScreenProps {
  onNavigateToPrivacy: () => void;
  onNavigateToLogs: () => void;
  onNavigateToLanding?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigateToPrivacy,
  onNavigateToLogs,
  onNavigateToLanding
}) => {
  const [currentTheme, setCurrentTheme] = useState('Dark (System Default)');
  const [currentLang, setCurrentLang] = useState('English (US)');
  const [notificationLevel, setNotificationLevel] = useState('All alerts active');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-4xl font-bold text-[#E1E2E9] tracking-tight font-sans">
          Settings
        </h2>
        <p className="text-sm md:text-base text-[#E2BFB0]/80">
          Configure AI behavior and system preferences.
        </p>
      </div>

      {/* GENERAL Section */}
      <section className="space-y-2.5">
        <h3 className="font-mono text-xs font-bold text-[#FF6B00] tracking-widest pl-2 uppercase">
          GENERAL
        </h3>
        <div className="bg-[#12151A] border border-white/10 rounded-2xl overflow-hidden shadow-md divide-y divide-white/5">
          {/* App Theme */}
          <div
            onClick={() => setActiveModal('theme')}
            className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">dark_mode</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white font-sans">App Theme</div>
                <div className="text-xs text-[#E2BFB0]/70">{currentTheme}</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
          </div>

          {/* Language */}
          <div
            onClick={() => setActiveModal('language')}
            className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">language</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white font-sans">Language</div>
                <div className="text-xs text-[#E2BFB0]/70">{currentLang}</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
          </div>

          {/* Notifications */}
          <div
            onClick={() => setActiveModal('notifications')}
            className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">notifications</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white font-sans">Notifications</div>
                <div className="text-xs text-[#E2BFB0]/70">{notificationLevel}</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
          </div>
        </div>
      </section>

      {/* SYSTEM Section */}
      <section className="space-y-2.5">
        <h3 className="font-mono text-xs font-bold text-[#FF6B00] tracking-widest pl-2 uppercase">
          SYSTEM
        </h3>
        <div className="bg-[#12151A] border border-white/10 rounded-2xl overflow-hidden shadow-md divide-y divide-white/5">
          {/* Activity Log */}
          <div
            onClick={onNavigateToLogs}
            className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">history</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white font-sans">Activity Log</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
          </div>

          {/* Permission Manager */}
          <div
            onClick={onNavigateToPrivacy}
            className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">vpn_key</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white font-sans">Permission Manager</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
          </div>

          {/* About */}
          <div
            onClick={() => setActiveModal('about')}
            className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined text-[#ADC6FF] text-[22px]">info</span>
              <div>
                <div className="text-sm md:text-base font-semibold text-white font-sans">About</div>
                <div className="text-xs text-[#E2BFB0]/70">Version 2.4.1 (Build 890)</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
          </div>

          {/* Landing / Welcome Screen */}
          {onNavigateToLanding && (
            <div
              onClick={onNavigateToLanding}
              className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-[#FF6B00] text-[22px]">rocket_launch</span>
                <div>
                  <div className="text-sm md:text-base font-semibold text-white font-sans">App Landing Screen</div>
                  <div className="text-xs text-[#E2BFB0]/70">View introductory onboarding &amp; diagnostic splash</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-white/40 text-[20px]">chevron_right</span>
            </div>
          )}
        </div>
      </section>

      {/* Danger Zone: Sign Out */}
      <section className="pt-2">
        <button
          onClick={() => {
            if (window.confirm('Sign out from Guardian Agent profile? You will return to the Landing Screen.')) {
              if (onNavigateToLanding) {
                onNavigateToLanding();
              }
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-3.5 border border-[#FFB4AB]/30 text-[#FFB4AB] hover:bg-[#FFB4AB]/10 rounded-xl transition-all font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>SIGN OUT</span>
        </button>
      </section>

      {/* Modals */}
      {activeModal === 'theme' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1D2025] rounded-2xl border border-white/10 p-5 space-y-4">
            <h3 className="font-bold text-white text-base">Select Theme</h3>
            <div className="space-y-2">
              {['Dark (System Default)', 'Obsidian Ultra Black', 'High Contrast Dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setCurrentTheme(t);
                    setActiveModal(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono flex justify-between items-center ${
                    currentTheme === t
                      ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FFB693] font-bold'
                      : 'border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span>{t}</span>
                  {currentTheme === t && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setActiveModal(null)} className="text-xs font-mono text-white/60">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1D2025] rounded-2xl border border-white/10 p-5 space-y-4">
            <h3 className="font-bold text-white text-base">Select Interface Language</h3>
            <div className="space-y-2">
              {['English (US)', 'English (UK)', 'Español', 'Français', 'Deutsch', '日本語'].map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setCurrentLang(l);
                    setActiveModal(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono flex justify-between items-center ${
                    currentLang === l
                      ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FFB693] font-bold'
                      : 'border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span>{l}</span>
                  {currentLang === l && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setActiveModal(null)} className="text-xs font-mono text-white/60">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#1D2025] rounded-2xl border border-white/10 p-6 space-y-4 relative">
            <div className="flex items-center gap-3">
              <GuardianLogo size="md" />
              <div>
                <h3 className="font-bold text-white text-lg">Guardian AI Agent</h3>
                <p className="text-xs font-mono text-[#FF6B00]">Version 2.4.1 (Build 890)</p>
              </div>
            </div>

            <div className="bg-[#101418] p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono text-[#E2BFB0]/80">
              <div className="flex justify-between">
                <span>Architecture:</span>
                <span className="text-white">Android System Agent</span>
              </div>
              <div className="flex justify-between">
                <span>Security Engine:</span>
                <span className="text-[#55E16B]">Sandboxed Hardware Enclave</span>
              </div>
              <div className="flex justify-between">
                <span>Visual Reasoning:</span>
                <span className="text-[#ADC6FF]">Gemini 2.5 Multi-Modal</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Trail:</span>
                <span className="text-white">SHA-256 Verified Log</span>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Designed to execute complex multi-step mobile workflows with full user sovereignty,
              real-time visual telemetry, and explicit safety boundaries.
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#FF6B00] text-[#351000] text-xs font-mono font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
