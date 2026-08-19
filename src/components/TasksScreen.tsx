import React, { useState, useEffect, useRef } from 'react';
import { TaskRecord, LogLevel, AgentStatus } from '../types';
import confetti from 'canvas-confetti';

interface TasksScreenProps {
  currentTask: TaskRecord;
  onPauseResume: () => void;
  onReplan: () => void;
  onEmergencyStop: () => void;
  onTriggerHighRisk: () => void;
  onCompleteTask: () => void;
  status: AgentStatus;
  allTasks: TaskRecord[];
  onSelectTask: (task: TaskRecord) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  currentTask,
  onPauseResume,
  onReplan,
  onEmergencyStop,
  onTriggerHighRisk,
  onCompleteTask,
  status,
  allTasks,
  onSelectTask
}) => {
  const [timerSeconds, setTimerSeconds] = useState(84); // 00:01:24 start matching screenshot
  const [selectedLogLevel, setSelectedLogLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'history'>('live');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === 'RUNNING') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000 / speedMultiplier);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, speedMultiplier]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentTask.logs]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `00:${pad(mins)}:${pad(remainingSecs)}`;
  };

  const getTagBadge = (level: LogLevel) => {
    switch (level) {
      case 'SYS':
        return <span className="text-[#ADC6FF] font-bold font-mono">SYS</span>;
      case 'ACT':
        return <span className="text-[#55E16B] font-bold font-mono">ACT</span>;
      case 'OBS':
        return <span className="text-[#FF6B00] font-bold font-mono">OBS</span>;
      case 'RSN':
        return <span className="text-[#FFB693] font-bold font-mono">RSN</span>;
      case 'WRN':
        return <span className="text-[#FFD166] font-bold font-mono">WRN</span>;
      case 'ERR':
        return <span className="text-[#FFB4AB] font-bold font-mono">ERR</span>;
      default:
        return <span className="text-white/60 font-mono">{level}</span>;
    }
  };

  const filteredLogs = selectedLogLevel === 'ALL'
    ? currentTask.logs
    : currentTask.logs.filter((l) => l.level === selectedLogLevel);

  const handleFinishCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#4B8EFF', '#55E16B', '#FFB693']
    });
    onCompleteTask();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5 md:py-8 flex flex-col gap-6">
      {/* Sub tabs: Live Execution vs Task History */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeSubTab === 'live'
                ? 'bg-[#FF6B00] text-[#351000]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Live Monitor
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeSubTab === 'history'
                ? 'bg-[#FF6B00] text-[#351000]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Past Sessions ({allTasks.length})
          </button>
        </div>

        {/* Speed simulator */}
        {activeSubTab === 'live' && (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-white/50 text-[11px] hidden sm:inline">Speed:</span>
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                  speedMultiplier === s
                    ? 'bg-[#4B8EFF]/20 border-[#4B8EFF] text-[#ADC6FF] font-bold'
                    : 'border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>

      {activeSubTab === 'history' ? (
        /* Task History List View */
        <div className="space-y-4 max-w-4xl mx-auto w-full">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF6B00]">history</span>
            Execution History Archive
          </h2>
          <div className="space-y-3">
            {allTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTask(t);
                  setActiveSubTab('live');
                }}
                className="card-surface rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ai-accent-border cursor-pointer hover:border-white/20 transition-all group shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#55E16B] text-[18px]">
                      check_circle
                    </span>
                    <h3 className="font-bold text-base text-white group-hover:text-[#FFB693] transition-colors">
                      {t.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#E2BFB0]/80">{t.description}</p>
                  <p className="text-[11px] font-mono text-white/50">{t.currentSubtext}</p>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                  <span className="font-mono text-xs text-[#ADC6FF]">{t.timeLabel}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/80 font-mono group-hover:bg-[#FF6B00] group-hover:text-[#351000] transition-colors">
                    Inspect Log &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Live Execution Canvas */
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full items-stretch">
          {/* Left Column: Context & Live Agent Card & Controls */}
          <div className="flex flex-col gap-5 w-full lg:w-7/12">
            {/* Context Header */}
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#E1E2E9] tracking-tight font-sans">
                {currentTask.title}
              </h1>
              <p className="text-xs md:text-sm text-[#E2BFB0]/80 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#ADC6FF]">
                  visibility
                </span>
                <span>Agent is operating visibly. Sensitive screens are being monitored.</span>
              </p>
            </div>

            {/* Live Action Card (Agent Card) */}
            <div className="bg-[#12151A] rounded-2xl border border-white/10 ai-accent-border ai-pulse-border p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF6B00]/15 flex items-center justify-center border border-[#FF6B00]/30 shadow-inner">
                    <span
                      className="material-symbols-outlined text-[#FF6B00] text-[26px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      psychology
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white font-sans">
                      {status === 'COMPLETED' ? 'Task Completed' : currentTask.currentStage}
                    </h2>
                    <p className="text-xs md:text-sm text-[#FFB693] font-medium font-mono">
                      {status === 'COMPLETED' ? 'All actions executed safely.' : currentTask.currentSubtext}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs md:text-sm text-[#E2BFB0] font-semibold bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  {formatTime(timerSeconds)}
                </span>
              </div>

              {/* Progress Tracker Checklist */}
              <div className="flex flex-col gap-3 mt-2 bg-[#0B0D10]/70 rounded-xl p-4 border border-white/5">
                {currentTask.steps.map((step) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'in_progress';
                  return (
                    <div
                      key={step.id}
                      className={`flex justify-between items-center text-xs md:text-sm font-mono transition-all ${
                        isDone
                          ? 'text-[#E1E2E9]/70'
                          : isCurrent
                          ? 'text-[#FFB693] font-bold'
                          : 'text-[#E1E2E9]/40'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {isDone ? (
                          <span
                            className="material-symbols-outlined text-[16px] text-[#55E16B]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                        ) : isCurrent ? (
                          <span className="material-symbols-outlined text-[16px] animate-spin text-[#FF6B00]">
                            refresh
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[16px] text-white/30">
                            radio_button_unchecked
                          </span>
                        )}
                        <span>{step.label}</span>
                      </span>

                      <span className="text-[11px] uppercase tracking-wider font-semibold">
                        {isDone ? (
                          <span className="text-[#55E16B]">Done</span>
                        ) : isCurrent ? (
                          <span className="text-[#FF6B00] animate-pulse">In Progress</span>
                        ) : (
                          <span className="text-white/40">Pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Controls (Secondary) */}
            <div className="flex gap-3 w-full">
              <button
                id="pause-resume-btn"
                onClick={onPauseResume}
                className="flex-1 py-3 px-4 rounded-xl border border-[#4B8EFF]/60 text-[#ADC6FF] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-[#4B8EFF]/10 active:scale-98 transition-all cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {status === 'PAUSED' ? 'play_arrow' : 'pause'}
                </span>
                <span>{status === 'PAUSED' ? 'RESUME' : 'PAUSE'}</span>
              </button>

              <button
                id="replan-btn"
                onClick={onReplan}
                className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-[#E1E2E9] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-white/10 active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">route</span>
                <span>REPLAN</span>
              </button>
            </div>

            {/* Emergency Stop Button */}
            <button
              id="emergency-stop-btn"
              onClick={onEmergencyStop}
              className="w-full py-4 px-6 rounded-xl bg-[#FFB4AB] text-[#690005] font-sans font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(255,180,171,0.35)] hover:bg-[#FFDAD6] active:scale-98 transition-all cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stop_circle
              </span>
              <span>EMERGENCY STOP</span>
            </button>

            {/* Developer / Interactive Agent Simulation Tools */}
            <div className="mt-2 p-3.5 rounded-xl bg-[#1D2025]/70 border border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-white/60">Simulate Actions:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onTriggerHighRisk}
                  className="px-3 py-1.5 text-xs font-mono bg-[#FF3B30]/15 hover:bg-[#FF3B30]/25 text-[#FFB4AB] border border-[#FF3B30]/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Trigger Risk Dialog
                </button>
                <button
                  onClick={handleFinishCelebration}
                  className="px-3 py-1.5 text-xs font-mono bg-[#55E16B]/15 hover:bg-[#55E16B]/25 text-[#73FE84] border border-[#55E16B]/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                  Finish Task
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Log Container */}
          <div className="flex flex-col w-full lg:w-5/12 gap-4">
            <div className="bg-[#12151A] rounded-2xl border border-white/10 flex-grow flex flex-col overflow-hidden h-[460px] lg:h-full min-h-[420px] shadow-2xl">
              {/* Log Header */}
              <div className="p-3.5 border-b border-white/10 flex justify-between items-center bg-[#1C1F26]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#FF6B00]">
                    terminal
                  </span>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                    Execution Log
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-white/50">
                    history
                  </span>
                  <span className="font-mono text-[11px] text-white/50">
                    {filteredLogs.length} events
                  </span>
                </div>
              </div>

              {/* Log Filter Pills */}
              <div className="px-3 py-2 bg-[#0B0D10] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
                {(['ALL', 'SYS', 'ACT', 'OBS', 'RSN'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLogLevel(lvl)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      selectedLogLevel === lvl
                        ? 'bg-[#FF6B00]/20 text-[#FFB693] font-bold border border-[#FF6B00]/40'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Log Body */}
              <div
                ref={logContainerRef}
                className="flex-grow p-4 overflow-y-auto flex flex-col gap-2.5 font-mono text-xs leading-relaxed bg-[#0B0D10]/95"
              >
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 text-[#E1E2E9]/90 hover:bg-white/5 p-1 rounded transition-colors group"
                  >
                    <span className="text-white/40 shrink-0 text-[11px] pt-0.5">
                      {log.time}
                    </span>
                    <span className="shrink-0 pt-0.5">{getTagBadge(log.level)}</span>
                    <span className="break-words flex-1 text-[#E1E2E9]">{log.message}</span>
                  </div>
                ))}

                {/* Blinking Live Cursor */}
                {status === 'RUNNING' && (
                  <div className="flex items-center gap-2 text-[#FF6B00] mt-1 pt-1 border-t border-white/5">
                    <span className="text-white/40 text-[11px]">
                      {new Date().toLocaleTimeString().split(' ')[0]}
                    </span>
                    <span className="font-bold">&gt;</span>
                    <span className="w-2 h-4 bg-[#FF6B00] animate-pulse" />
                    <span className="text-xs text-white/50 italic">Agent listening to event stream...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
