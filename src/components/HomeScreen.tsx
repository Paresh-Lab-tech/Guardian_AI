import React, { useState } from 'react';
import { TaskRecord } from '../types';
import { SUGGESTED_PROMPTS } from '../data/mockData';

interface HomeScreenProps {
  onStartCommand: (command: string) => void;
  onOpenOptions: () => void;
  recentTasks: TaskRecord[];
  onSelectTask: (task: TaskRecord) => void;
  isMicListening: boolean;
  onToggleMic: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartCommand,
  onOpenOptions,
  recentTasks,
  onSelectTask,
  isMicListening,
  onToggleMic
}) => {
  const [inputCommand, setInputCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) {
      onStartCommand('Organize my Downloads folder');
      return;
    }
    onStartCommand(inputCommand.trim());
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputCommand(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-8 md:gap-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center gap-3 py-2 md:py-4">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#E1E2E9] tracking-tight leading-tight max-w-2xl font-sans">
          Tell it what to do. Stay in control.
        </h2>
        <p className="text-sm md:text-base text-[#E2BFB0]/80 max-w-2xl leading-relaxed">
          Your high-performance AI agent is ready. Issue commands, monitor execution, and
          maintain absolute authority over system actions.
        </p>
      </section>

      {/* Main Command Input Area */}
      <section className="w-full flex flex-col items-center gap-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl card-surface rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-2xl relative group transition-all"
        >
          {/* AI Left Accent Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B00] rounded-l-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_#FF6B00]" />

          {/* Input Box Surface */}
          <div className="input-surface rounded-xl flex items-start p-3.5 transition-all duration-200">
            <span
              className="material-symbols-outlined text-[#FF6B00] mt-1 mr-3 shrink-0 select-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              electric_bolt
            </span>

            <textarea
              id="main-command-input"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="w-full bg-transparent border-none text-[#E1E2E9] placeholder-[#E2BFB0]/50 focus:ring-0 focus:outline-none resize-none text-sm md:text-base leading-relaxed p-0"
              placeholder="What should I do? Type your command here..."
              rows={3}
            />

            {/* Mic Button */}
            <button
              type="button"
              id="voice-mic-btn"
              onClick={onToggleMic}
              aria-label="Voice Command Input"
              className={`p-2 transition-all rounded-full shrink-0 self-end ml-1 cursor-pointer ${
                isMicListening
                  ? 'bg-[#FF6B00] text-[#351000] animate-pulse shadow-[0_0_12px_#FF6B00]'
                  : 'text-[#E2BFB0]/70 hover:text-[#FFB693] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMicListening ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>

          {/* Voice Listening Feedback Banner */}
          {isMicListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-xs font-mono text-[#FFB693] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
              Listening... Speak your command (e.g. &ldquo;Organize my Downloads folder&rdquo;)
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-between items-center mt-1 pt-1">
            <button
              type="button"
              id="options-trigger-btn"
              onClick={onOpenOptions}
              className="px-3.5 py-1.5 text-[#E2BFB0]/80 hover:text-white font-mono text-xs rounded-lg border border-white/10 hover:bg-white/5 transition-all flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Options
            </button>

            <button
              type="submit"
              id="start-agent-btn"
              className="bg-[#FF6B00] text-[#351000] hover:bg-[#FFB693] px-6 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all transform hover:scale-102 active:scale-98 flex items-center gap-2 shadow-[0_0_18px_rgba(255,107,0,0.35)] hover:shadow-[0_0_24px_rgba(255,107,0,0.6)] cursor-pointer"
            >
              <span>Start</span>
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                send
              </span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="w-full max-w-2xl flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="font-mono text-[#E2BFB0]/50 shrink-0 text-[11px]">Quick:</span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#1D2025] hover:bg-[#272A2F] border border-white/10 text-white/80 hover:text-white transition-all text-xs cursor-pointer truncate max-w-[220px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Tasks Bento Grid */}
      <section className="w-full flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold text-[#E1E2E9] flex items-center gap-2 font-sans">
            <span className="material-symbols-outlined text-[#FF6B00]">history</span>
            Recent Tasks
          </h3>
          <span className="text-xs font-mono text-[#E2BFB0]/60">
            {recentTasks.length} recorded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="card-surface rounded-2xl p-4 md:p-5 flex flex-col gap-3 hover:border-white/20 transition-all duration-200 ai-accent-border cursor-pointer group hover:translate-y-[-2px] shadow-lg"
            >
              {/* Task Header */}
              <div className="flex justify-between items-start">
                <span
                  className="material-symbols-outlined text-[#55E16B] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="font-mono text-xs text-[#E2BFB0]/70">
                  {task.timeLabel}
                </span>
              </div>

              {/* Task Content */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-base font-semibold text-white group-hover:text-[#FFB693] transition-colors">
                  {task.title}
                </h4>
                <p className="text-xs text-[#E2BFB0]/80 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Footer subtext */}
              <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#ADC6FF]">
                <span>{task.steps.length} steps logged</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
