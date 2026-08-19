import React from 'react';
import { AgentOptions } from '../types';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: AgentOptions;
  onOptionsChange: (newOptions: AgentOptions) => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  options,
  onOptionsChange
}) => {
  if (!isOpen) return null;

  const updateOption = <K extends keyof AgentOptions>(key: K, value: AgentOptions[K]) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#12151A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="options-dialog-title"
      >
        {/* Left AI Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00]" />

        <div className="p-5 pl-7 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF6B00]">tune</span>
              <h2 id="options-dialog-title" className="text-lg font-bold text-white tracking-tight">
                Agent Execution Options
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Options List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Autonomous Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D10] border border-white/5">
              <div>
                <p className="font-semibold text-sm text-white">Full Autonomous Mode</p>
                <p className="text-xs text-[#E1E2E9]/60">Allow agent to chain multi-step actions without pausing.</p>
              </div>
              <input
                type="checkbox"
                checked={options.autonomousMode}
                onChange={(e) => updateOption('autonomousMode', e.target.checked)}
                className="w-5 h-5 accent-[#FF6B00] rounded cursor-pointer"
              />
            </div>

            {/* Step Confirmation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D10] border border-white/5">
              <div>
                <p className="font-semibold text-sm text-white">Step-by-Step Confirmation</p>
                <p className="text-xs text-[#E1E2E9]/60">Require tap approval before each visual interaction.</p>
              </div>
              <input
                type="checkbox"
                checked={options.stepConfirmation}
                onChange={(e) => updateOption('stepConfirmation', e.target.checked)}
                className="w-5 h-5 accent-[#FF6B00] rounded cursor-pointer"
              />
            </div>

            {/* Screen Inspection Rate */}
            <div className="p-3 rounded-xl bg-[#0B0D10] border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-white">Screen Inspection Frequency</p>
                <span className="text-xs font-mono text-[#FFB693] bg-[#FF6B00]/10 px-2 py-0.5 rounded">
                  {options.screenInspectionRate}
                </span>
              </div>
              <p className="text-xs text-[#E1E2E9]/60">Balancing real-time reactivity against battery consumption.</p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['1fps', '2fps', '5fps'] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => updateOption('screenInspectionRate', rate)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      options.screenInspectionRate === rate
                        ? 'bg-[#4B8EFF]/20 border-[#4B8EFF] text-[#ADC6FF] font-bold'
                        : 'border-white/10 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Tolerance */}
            <div className="p-3 rounded-xl bg-[#0B0D10] border border-white/5 space-y-2">
              <p className="font-semibold text-sm text-white">Risk Tolerance Policy</p>
              <p className="text-xs text-[#E1E2E9]/60">Determines when Guardian triggers the High-Risk modal.</p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['strict', 'moderate', 'permissive'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => updateOption('riskTolerance', risk)}
                    className={`py-1.5 text-xs capitalize font-medium rounded-lg border transition-all ${
                      options.riskTolerance === risk
                        ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FFB693] font-bold'
                        : 'border-white/10 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#FF6B00] text-[#351000] hover:bg-[#FFB693] transition-colors"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
