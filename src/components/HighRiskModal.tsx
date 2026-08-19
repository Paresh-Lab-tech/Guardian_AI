import React, { useState } from 'react';
import { HighRiskDetails } from '../types';

interface HighRiskModalProps {
  isOpen: boolean;
  details: HighRiskDetails;
  onCancel: () => void;
  onConfirm: () => void;
}

export const HighRiskModal: React.FC<HighRiskModalProps> = ({
  isOpen,
  details,
  onCancel,
  onConfirm
}) => {
  const [showAllItems, setShowAllItems] = useState(false);

  if (!isOpen) return null;

  const visibleItems = showAllItems ? details.items : details.items.slice(0, 4);
  const remainingCount = details.targetCount - visibleItems.length;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 bg-[#0B0E13]/85 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
        className="bg-[#1D2025] w-full md:max-w-md rounded-t-2xl md:rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative transform transition-transform duration-300 ease-out"
      >
        {/* Left Agent Accent Line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B00] h-full" />

        <div className="p-6 md:p-7 flex flex-col gap-5 pl-7 md:pl-8">
          {/* Warning Header */}
          <div className="flex items-start gap-3.5">
            <div className="bg-[#FFB4AB]/15 p-2 rounded-full flex items-center justify-center shrink-0 border border-[#FFB4AB]/30">
              <span className="material-symbols-outlined text-[#FFB4AB] text-[24px] fill">
                warning
              </span>
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-lg font-bold text-[#FFB4AB] leading-snug tracking-tight mb-1"
              >
                {details.title}
              </h2>
              <p className="text-sm text-[#E1E2E9]/80 leading-relaxed font-sans">
                {details.description}
              </p>
            </div>
          </div>

          {/* Target List Container */}
          <div className="bg-[#101418] rounded-xl p-3.5 border border-white/10 shadow-inner">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-white/10">
              <span className="font-mono text-xs text-[#E1E2E9]/70 uppercase tracking-widest font-semibold">
                Target List
              </span>
              <span className="font-mono text-[11px] text-[#FFB693] bg-[#FF6B00]/15 px-2 py-0.5 rounded font-bold">
                {details.targetCount} ITEMS
              </span>
            </div>

            <ul className="font-mono text-xs text-[#E1E2E9] flex flex-col gap-1.5 overflow-y-auto max-h-[140px] pr-1">
              {visibleItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border-b border-white/5 pb-1.5"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[15px] text-[#ADC6FF] shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate text-white/90">{item.name}</span>
                  </div>
                  {item.size && (
                    <span className="text-[10px] text-white/50 shrink-0 ml-2">
                      {item.size}
                    </span>
                  )}
                </li>
              ))}

              {!showAllItems && remainingCount > 0 && (
                <li className="pt-1">
                  <button
                    onClick={() => setShowAllItems(true)}
                    className="text-left text-xs text-[#ADC6FF] hover:text-white transition-colors flex items-center gap-1 font-sans cursor-pointer py-0.5"
                  >
                    <span>... and {remainingCount} more items</span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </button>
                </li>
              )}

              {showAllItems && details.items.length > 4 && (
                <li className="pt-1">
                  <button
                    onClick={() => setShowAllItems(false)}
                    className="text-left text-xs text-[#ADC6FF] hover:text-white transition-colors flex items-center gap-1 font-sans cursor-pointer py-0.5"
                  >
                    <span>Show less</span>
                    <span className="material-symbols-outlined text-[14px]">expand_less</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Safety Policy Banner */}
          <div className="bg-[#4B8EFF]/10 border border-[#4B8EFF]/25 rounded-xl p-3 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#ADC6FF] text-[18px] shrink-0 mt-0.5">
              policy
            </span>
            <p className="font-mono text-xs text-[#E1E2E9]/80 leading-tight">
              {details.policyText}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg border border-[#4B8EFF]/50 text-[#ADC6FF] font-mono text-xs uppercase font-bold hover:bg-[#4B8EFF]/15 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4B8EFF]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg bg-[#FF6B00] text-[#351000] font-mono text-xs font-bold uppercase shadow-[0_0_20px_rgba(255,107,0,0.35)] hover:bg-[#FFB693] transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
