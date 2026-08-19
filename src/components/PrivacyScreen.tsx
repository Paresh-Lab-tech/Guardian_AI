import React, { useState } from 'react';
import { PermissionItem, SecurityOption } from '../types';

interface PrivacyScreenProps {
  permissions: PermissionItem[];
  onTogglePermission: (id: string) => void;
  securitySettings: SecurityOption[];
  onToggleSecuritySetting: (id: string) => void;
  onClearTaskHistory: () => void;
  onClearMemoryContext: () => void;
  onDeleteAllLocalData: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  permissions,
  onTogglePermission,
  securitySettings,
  onToggleSecuritySetting,
  onClearTaskHistory,
  onClearMemoryContext,
  onDeleteAllLocalData
}) => {
  const [showAccessibilitySetup, setShowAccessibilitySetup] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAccessibilitySetup = () => {
    setShowAccessibilitySetup(true);
  };

  const handleGrantAccessibility = () => {
    onTogglePermission('accessibility');
    setShowAccessibilitySetup(false);
    showToast('Guardian Accessibility Service connected successfully.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#1D2025] text-white border border-[#55E16B]/50 font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#55E16B] text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-4xl font-bold text-[#E1E2E9] tracking-tight font-sans">
          Permission &amp; Privacy Center
        </h1>
        <p className="text-sm md:text-base text-[#E2BFB0]/80">
          Manage your data boundaries and AI agent capabilities.
        </p>
      </div>

      {/* Trust & Transparency Banner */}
      <div className="bg-[#272A2F] rounded-2xl p-4 md:p-5 flex items-start gap-4 border border-white/10 ai-accent-border shadow-xl">
        <div className="p-2 rounded-xl bg-[#FF6B00]/15 shrink-0 border border-[#FF6B00]/30">
          <span
            className="material-symbols-outlined text-[#FF6B00] text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-base md:text-lg font-bold text-[#E1E2E9] font-sans">
            Trust &amp; Transparency
          </h2>
          <p className="text-xs md:text-sm text-[#E2BFB0]/80 leading-relaxed">
            Your data stays local by default. No hidden actions. The AI only acts within
            the boundaries you set below.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Permissions Section */}
        <section className="bg-[#1D2025] rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col gap-4 md:col-span-2 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-[#E1E2E9] flex items-center gap-2 font-sans">
              <span className="material-symbols-outlined text-[#4B8EFF]">tune</span>
              System Permissions
            </h2>
            <span className="font-mono text-xs text-white/50">Android 14 API</span>
          </div>

          <div className="space-y-3">
            {permissions.map((perm) => {
              const isAllowed = perm.status === 'allowed';
              const isNotConnected = perm.status === 'not_connected';

              return (
                <div
                  key={perm.id}
                  className="bg-[#101418] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-all"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <span className="material-symbols-outlined text-[#ADC6FF] text-[22px] mt-0.5 shrink-0">
                      {perm.icon}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm md:text-base font-bold text-white font-sans">
                        {perm.name}
                      </h3>
                      <p className="text-xs text-[#E2BFB0]/70 leading-relaxed font-sans">
                        {perm.description}
                      </p>
                    </div>
                  </div>

                  {/* Status & Control */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {isNotConnected ? (
                      <>
                        <span className="font-mono text-xs text-white/50 px-2.5 py-1 bg-[#1D2025] rounded-lg border border-white/5">
                          Not connected
                        </span>
                        <button
                          onClick={handleAccessibilitySetup}
                          className="bg-[#FF6B00] text-[#351000] font-mono text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#FFB693] active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(255,107,0,0.3)]"
                        >
                          Setup
                        </button>
                      </>
                    ) : isAllowed ? (
                      <button
                        onClick={() => onTogglePermission(perm.id)}
                        className="font-mono text-xs font-bold text-[#003A0F] bg-[#55E16B] px-3.5 py-1.5 rounded-xl hover:bg-[#73FE84] transition-all cursor-pointer shadow-sm"
                      >
                        Allowed
                      </button>
                    ) : (
                      <button
                        onClick={() => onTogglePermission(perm.id)}
                        className="font-mono text-xs font-bold text-[#FFDAD6] bg-[#93000A] px-3.5 py-1.5 rounded-xl hover:bg-[#FF3B30] transition-all cursor-pointer"
                      >
                        Not allowed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security Settings Section */}
        <section className="bg-[#1D2025] rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-[#E1E2E9] flex items-center gap-2 font-sans">
              <span className="material-symbols-outlined text-[#4B8EFF]">shield</span>
              Security Settings
            </h2>
          </div>

          <div className="space-y-4 flex-1">
            {securitySettings.map((sec) => (
              <div
                key={sec.id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#101418] border border-white/5"
              >
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-white font-sans">{sec.name}</h3>
                  <p className="text-xs text-[#E2BFB0]/70 leading-relaxed font-sans">
                    {sec.description}
                  </p>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={sec.enabled}
                  onClick={() => onToggleSecuritySetting(sec.id)}
                  className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
                    sec.enabled ? 'bg-[#4B8EFF]' : 'bg-[#32353A]'
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                      sec.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Data & Privacy Controls Section */}
        <section className="bg-[#1D2025] rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col gap-4 border-t-2 border-t-[#FF3B30]/50 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-[#E1E2E9] flex items-center gap-2 font-sans">
              <span className="material-symbols-outlined text-[#FFB4AB]">delete_sweep</span>
              Data &amp; Privacy Controls
            </h2>
          </div>

          <div className="flex flex-col gap-2.5 mt-auto">
            <button
              onClick={() => {
                onClearTaskHistory();
                showToast('Task history purged from local storage.');
              }}
              className="w-full text-left bg-[#101418] hover:bg-[#272A2F] transition-colors rounded-xl p-3.5 border border-white/5 flex justify-between items-center group cursor-pointer"
            >
              <span className="text-sm font-medium text-white font-sans">Clear Task History</span>
              <span className="material-symbols-outlined text-[#ADC6FF] group-hover:text-[#FF6B00] transition-colors text-[20px]">
                history
              </span>
            </button>

            <button
              onClick={() => {
                onClearMemoryContext();
                showToast('Agent reasoning memory context reset.');
              }}
              className="w-full text-left bg-[#101418] hover:bg-[#272A2F] transition-colors rounded-xl p-3.5 border border-white/5 flex justify-between items-center group cursor-pointer"
            >
              <span className="text-sm font-medium text-white font-sans">Clear Memory Context</span>
              <span className="material-symbols-outlined text-[#ADC6FF] group-hover:text-[#FF6B00] transition-colors text-[20px]">
                memory
              </span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Delete all local cache, permission tokens, and task logs?')) {
                  onDeleteAllLocalData();
                  showToast('All local data wiped clean.');
                }
              }}
              className="w-full text-left bg-[#93000A]/40 hover:bg-[#93000A]/80 border border-[#FF3B30]/30 transition-all rounded-xl p-3.5 flex justify-between items-center group cursor-pointer mt-1"
            >
              <span className="text-sm font-bold text-[#FFDAD6] group-hover:text-white font-sans">
                Delete All Local Data
              </span>
              <span className="material-symbols-outlined text-[#FFB4AB] group-hover:text-white transition-colors text-[20px]">
                delete_forever
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Accessibility Service Modal */}
      {showAccessibilitySetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#1D2025] rounded-2xl border border-white/10 shadow-2xl p-6 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B00] rounded-l-2xl" />
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#FF6B00] text-[28px]">
                accessibility_new
              </span>
              <h3 className="text-lg font-bold text-white font-sans">
                Enable Accessibility Service
              </h3>
            </div>
            <p className="text-sm text-[#E2BFB0]/80 leading-relaxed mb-4">
              To automate on-screen multi-step tasks (such as organizing files or navigating apps),
              Guardian AI requires Android Accessibility permissions. Guardian operates under strict
              on-device local boundaries.
            </p>
            <div className="bg-[#101418] p-3 rounded-xl border border-white/5 text-xs font-mono text-[#ADC6FF] mb-6 space-y-1">
              <div>&bull; Filter financial and password screens: Active</div>
              <div>&bull; Human confirmation for high-risk actions: Enforced</div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAccessibilitySetup(false)}
                className="px-4 py-2 text-xs font-mono text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantAccessibility}
                className="px-5 py-2 text-xs font-mono font-bold bg-[#FF6B00] text-[#351000] rounded-xl hover:bg-[#FFB693]"
              >
                Grant &amp; Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
