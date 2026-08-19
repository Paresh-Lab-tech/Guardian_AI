import React, { useState, useEffect } from 'react';
import { TabType, AgentStatus, TaskRecord, LogItem } from './types';
import {
  INITIAL_TASKS,
  ACTIVE_TASK_TEMPLATE,
  HIGH_RISK_MOCK,
  INITIAL_PERMISSIONS,
  INITIAL_SECURITY_SETTINGS,
  INITIAL_AGENT_OPTIONS
} from './data/mockData';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingScreen } from './components/LandingScreen';
import { HomeScreen } from './components/HomeScreen';
import { TasksScreen } from './components/TasksScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { HighRiskModal } from './components/HighRiskModal';
import { OptionsModal } from './components/OptionsModal';

// Audio feedback utility using standard Web Audio API
const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.08) => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio might be blocked by browser policy before first user gesture
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('IDLE');
  const [tasks, setTasks] = useState<TaskRecord[]>(INITIAL_TASKS);
  const [currentTask, setCurrentTask] = useState<TaskRecord>(ACTIVE_TASK_TEMPLATE);
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [securitySettings, setSecuritySettings] = useState(INITIAL_SECURITY_SETTINGS);
  const [agentOptions, setAgentOptions] = useState(INITIAL_AGENT_OPTIONS);
  
  const [isHighRiskOpen, setIsHighRiskOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Periodic simulated live actions when in RUNNING state
  useEffect(() => {
    if (agentStatus !== 'RUNNING') return;

    const sampleSubactions = [
      { stage: 'Observe & Reason', text: 'Scanning local filesystem tree...', level: 'OBS' as const, msg: 'Inspected 145 directory nodes in /storage/emulated/0/Download.' },
      { stage: 'Visual Planning', text: 'Grouping files into categorization tree...', level: 'RSN' as const, msg: 'Identified 32 PDFs, 14 archives, 8 videos, and 91 temporary installers.' },
      { stage: 'Execution Phase', text: 'Creating destination directories...', level: 'ACT' as const, msg: 'Created target directory /Downloads/PDF_Documents.' },
      { stage: 'Batch Move', text: 'Moving files into organized subfolders...', level: 'ACT' as const, msg: 'Transferred batch 1/3 (12 PDF documents relocated).' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      const action = sampleSubactions[stepIndex % sampleSubactions.length];
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
      
      const newLog: LogItem = {
        id: `live-log-${Date.now()}`,
        time: timeStr,
        level: action.level,
        message: action.msg
      };

      setCurrentTask((prev) => ({
        ...prev,
        currentStage: action.stage,
        currentSubtext: action.text,
        logs: [...prev.logs, newLog]
      }));

      stepIndex++;
    }, 4000);

    return () => clearInterval(interval);
  }, [agentStatus]);

  // Handle command start
  const handleStartCommand = (command: string) => {
    playBeep(650, 'triangle', 0.12);
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;

    const newTask: TaskRecord = {
      id: `task-${Date.now()}`,
      title: command,
      timeLabel: 'Live',
      timestamp: Date.now(),
      description: `Autonomous agent execution for: "${command}". Operating with safe privilege boundary.`,
      status: 'running',
      currentStage: 'Observe & Reason',
      currentSubtext: 'Analyzing requested intent...',
      steps: [
        { id: 's1', label: 'Parsed user intent and context', status: 'completed' },
        { id: 's2', label: 'Screen and file inspection', status: 'in_progress' },
        { id: 's3', label: 'Executing automated workflow', status: 'pending' }
      ],
      logs: [
        { id: 'l1', time: timeStr, level: 'SYS', message: `Command initiated: "${command}"` },
        { id: 'l2', time: timeStr, level: 'ACT', message: 'Checking system accessibility and permissions.' },
        { id: 'l3', time: timeStr, level: 'OBS', message: 'Display context captured. Resolving foreground application.' }
      ]
    };

    setCurrentTask(newTask);
    setAgentStatus('RUNNING');
    setActiveTab('tasks');
  };

  // Pause / Resume
  const handlePauseResume = () => {
    playBeep(400, 'sine', 0.1);
    if (agentStatus === 'RUNNING') {
      setAgentStatus('PAUSED');
      setCurrentTask((prev) => ({
        ...prev,
        currentSubtext: 'Execution paused by user.'
      }));
    } else {
      setAgentStatus('RUNNING');
      setCurrentTask((prev) => ({
        ...prev,
        currentSubtext: 'Resuming task execution...'
      }));
    }
  };

  // Replan
  const handleReplan = () => {
    playBeep(520, 'triangle', 0.1);
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    
    setCurrentTask((prev) => ({
      ...prev,
      currentStage: 'Replanning Strategy',
      currentSubtext: 'Recalculating alternative optimal path...',
      logs: [
        ...prev.logs,
        { id: `replan-${Date.now()}`, time: timeStr, level: 'SYS', message: 'Manual replan requested. Invalidating previous execution branch.' },
        { id: `replan-rsn-${Date.now()}`, time: timeStr, level: 'RSN', message: 'Generated fallback safe execution sequence.' }
      ]
    }));
  };

  // Emergency Stop
  const handleEmergencyStop = () => {
    playBeep(220, 'sawtooth', 0.25);
    setAgentStatus('IDLE');
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    
    setCurrentTask((prev) => ({
      ...prev,
      status: 'paused',
      currentStage: 'Emergency Halted',
      currentSubtext: 'Agent immediately killed and quarantined.',
      logs: [
        ...prev.logs,
        { id: `halt-${Date.now()}`, time: timeStr, level: 'ERR', message: 'EMERGENCY STOP ENGAGED: Quarantined system processes.' }
      ]
    }));
  };

  // Trigger High Risk Modal
  const handleTriggerHighRisk = () => {
    playBeep(330, 'square', 0.15);
    setIsHighRiskOpen(true);
    setAgentStatus('WAITING_APPROVAL');
  };

  // Confirm High-Risk Delete
  const handleConfirmHighRisk = () => {
    playBeep(700, 'sine', 0.15);
    setIsHighRiskOpen(false);
    setAgentStatus('RUNNING');
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    
    setCurrentTask((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        { id: `auth-${Date.now()}`, time: timeStr, level: 'SYS', message: 'HIGH-RISK OPERATION AUTHORIZED by user.' },
        { id: `auth-act-${Date.now()}`, time: timeStr, level: 'ACT', message: 'Deleted 17 unneeded files from /Downloads.' }
      ]
    }));
  };

  // Cancel High-Risk
  const handleCancelHighRisk = () => {
    playBeep(350, 'sine', 0.1);
    setIsHighRiskOpen(false);
    setAgentStatus('RUNNING');
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    
    setCurrentTask((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        { id: `cancel-${Date.now()}`, time: timeStr, level: 'WRN', message: 'HIGH-RISK OPERATION REJECTED. Destructive step skipped.' }
      ]
    }));
  };

  // Complete Task
  const handleCompleteTask = () => {
    playBeep(880, 'sine', 0.2);
    setAgentStatus('COMPLETED');
    const completedTask: TaskRecord = {
      ...currentTask,
      status: 'completed',
      timeLabel: 'Just now',
      steps: currentTask.steps.map((s) => ({ ...s, status: 'completed' }))
    };
    setCurrentTask(completedTask);
    setTasks((prev) => [completedTask, ...prev.filter((t) => t.id !== completedTask.id)]);
  };

  // Toggle Permissions
  const handleTogglePermission = (id: string) => {
    playBeep(480, 'sine', 0.06);
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (p.status === 'not_connected') return { ...p, status: 'allowed' };
          return { ...p, status: p.status === 'allowed' ? 'not_allowed' : 'allowed' };
        }
        return p;
      })
    );
  };

  // Toggle Security Setting
  const handleToggleSecuritySetting = (id: string) => {
    playBeep(450, 'sine', 0.06);
    setSecuritySettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Toggle Mic / Voice Dictation
  const handleToggleMic = () => {
    playBeep(600, 'triangle', 0.08);
    if (!isMicListening) {
      setIsMicListening(true);
      // Auto fill or transcribe after short moment
      setTimeout(() => {
        setIsMicListening(false);
        handleStartCommand('Organize my Downloads folder and group by extension');
      }, 3500);
    } else {
      setIsMicListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#E1E2E9] flex flex-col items-center justify-start selection:bg-[#FF6B00]/30 selection:text-[#FFDBCC]">
      {/* Container wrapper: Switchable between mobile phone frame or full wide layout */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[430px] my-6 rounded-[44px] overflow-hidden border-[10px] border-[#1C1F26] shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#0B0D10] relative min-h-[860px]'
            : 'max-w-7xl min-h-screen flex flex-col'
        }`}
      >
        {/* Android Status Bar */}
        <AndroidStatusBar isMicActive={isMicListening} />

        {/* Top App Bar */}
        <TopAppBar
          status={agentStatus}
          onLogoClick={() => setActiveTab('home')}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full pb-28 md:pb-12">
          {activeTab === 'landing' && (
            <LandingScreen
              onEnterApp={() => {
                playBeep(600, 'triangle', 0.12);
                setActiveTab('home');
              }}
            />
          )}

          {activeTab === 'home' && (
            <HomeScreen
              onStartCommand={handleStartCommand}
              onOpenOptions={() => setIsOptionsOpen(true)}
              recentTasks={tasks}
              onSelectTask={(task) => {
                setCurrentTask(task);
                setActiveTab('tasks');
              }}
              isMicListening={isMicListening}
              onToggleMic={handleToggleMic}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksScreen
              currentTask={currentTask}
              onPauseResume={handlePauseResume}
              onReplan={handleReplan}
              onEmergencyStop={handleEmergencyStop}
              onTriggerHighRisk={handleTriggerHighRisk}
              onCompleteTask={handleCompleteTask}
              status={agentStatus}
              allTasks={tasks}
              onSelectTask={(task) => setCurrentTask(task)}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyScreen
              permissions={permissions}
              onTogglePermission={handleTogglePermission}
              securitySettings={securitySettings}
              onToggleSecuritySetting={handleToggleSecuritySetting}
              onClearTaskHistory={() => setTasks([])}
              onClearMemoryContext={() => {
                setCurrentTask((prev) => ({
                  ...prev,
                  logs: prev.logs.slice(-2)
                }));
              }}
              onDeleteAllLocalData={() => {
                setTasks([]);
                setAgentStatus('IDLE');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              onNavigateToPrivacy={() => setActiveTab('privacy')}
              onNavigateToLogs={() => setActiveTab('tasks')}
              onNavigateToLanding={() => setActiveTab('landing')}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onChangeTab={(tab) => {
            playBeep(500, 'sine', 0.04);
            setActiveTab(tab);
          }}
          unreadTasksCount={agentStatus === 'RUNNING' ? 1 : 0}
        />
      </div>

      {/* High-Risk Modal Dialog */}
      <HighRiskModal
        isOpen={isHighRiskOpen}
        details={HIGH_RISK_MOCK}
        onCancel={handleCancelHighRisk}
        onConfirm={handleConfirmHighRisk}
      />

      {/* Options Modal */}
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        options={agentOptions}
        onOptionsChange={(newOpts) => setAgentOptions(newOpts)}
      />
    </div>
  );
}
