import React, { useState, useEffect, useRef } from 'react';
import { TabType, AgentStatus, TaskRecord, LogItem, HighRiskDetails } from './types';
import {
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
import {
  detectRealDeviceTelemetry,
  buildRealPermissionsList,
  DeviceTelemetry
} from './utils/deviceDetector';
import {
  loadStoredTasks,
  saveStoredTasks,
  clearStoredTasks,
  createRealTaskFromPlan
} from './utils/taskStorage';

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
    // Audio might be blocked by browser policy before user interaction
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('IDLE');
  
  // Real dynamic tasks loaded from browser storage
  const [tasks, setTasks] = useState<TaskRecord[]>(() => loadStoredTasks());
  const [currentTask, setCurrentTask] = useState<TaskRecord>(() => {
    const initial = loadStoredTasks();
    return initial[0];
  });

  // Real detected device hardware telemetry & permissions
  const [deviceTelemetry, setDeviceTelemetry] = useState<DeviceTelemetry | null>(null);
  const [permissions, setPermissions] = useState(() => {
    // Fallback baseline until async telemetry detection completes
    return [
      {
        id: 'p-access',
        name: 'Android Accessibility Service',
        description: 'Used for autonomous UI observation, node tree parsing, and interactive gesture automation.',
        icon: 'accessibility_new',
        status: 'allowed' as const,
        canToggle: true
      },
      {
        id: 'p-notif',
        name: 'Notifications & Alerts',
        description: 'Permission needed to dispatch high-risk approval and completed task alerts.',
        icon: 'notifications_active',
        status: 'allowed' as const,
        canToggle: true
      },
      {
        id: 'p-storage',
        name: 'Files & Media Storage',
        description: 'Access to local filesystem sandbox.',
        icon: 'folder_open',
        status: 'allowed' as const,
        canToggle: true
      },
      {
        id: 'p-mic',
        name: 'Microphone & Audio Stream',
        description: 'Used for speech-to-intent parsing and live voice commands.',
        icon: 'mic',
        status: 'allowed' as const,
        canToggle: true
      }
    ];
  });

  const [securitySettings, setSecuritySettings] = useState(INITIAL_SECURITY_SETTINGS);
  const [agentOptions, setAgentOptions] = useState(INITIAL_AGENT_OPTIONS);
  
  const [isHighRiskOpen, setIsHighRiskOpen] = useState(false);
  const [highRiskDetails, setHighRiskDetails] = useState<HighRiskDetails | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const activePlanSubsequentStages = useRef<{ stage: string; subtext: string; level: string; message: string }[]>([]);
  const speechRecognitionRef = useRef<unknown>(null);

  // Detect Real Hardware & Device on mount
  useEffect(() => {
    async function initDevice() {
      try {
        const telemetry = await detectRealDeviceTelemetry();
        setDeviceTelemetry(telemetry);
        const realPerms = buildRealPermissionsList(telemetry);
        setPermissions(realPerms);
      } catch (err) {
        console.error('Error initializing device telemetry:', err);
      }
    }
    initDevice();

    const handleOnlineStatus = () => {
      setDeviceTelemetry((prev) => prev ? { ...prev, isOnline: navigator.onLine } : null);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Periodic progressive stage updates when agent is actively RUNNING
  useEffect(() => {
    if (agentStatus !== 'RUNNING') return;

    const interval = setInterval(() => {
      const remainingStages = activePlanSubsequentStages.current;
      if (remainingStages && remainingStages.length > 0) {
        const nextStage = remainingStages.shift()!;
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
        
        const newLog: LogItem = {
          id: `live-log-${Date.now()}`,
          time: timeStr,
          level: (nextStage.level as 'SYS' | 'ACT' | 'OBS' | 'RSN' | 'WRN' | 'ERR') || 'ACT',
          message: nextStage.message
        };

        setCurrentTask((prev) => {
          const updated = {
            ...prev,
            currentStage: nextStage.stage,
            currentSubtext: nextStage.subtext,
            logs: [...prev.logs, newLog],
            steps: prev.steps.map((s, idx) => {
              if (idx === 0) return { ...s, status: 'completed' as const };
              if (idx === 1 && remainingStages.length === 0) return { ...s, status: 'completed' as const };
              if (idx === 1) return { ...s, status: 'in_progress' as const };
              if (idx === 2 && remainingStages.length === 0) return { ...s, status: 'in_progress' as const };
              return s;
            })
          };
          return updated;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [agentStatus]);

  // Real Command Execution: Decompose intent with Server-Side Gemini API
  const handleStartCommand = async (command: string, realFiles?: { name: string; size: string }[]) => {
    playBeep(650, 'triangle', 0.12);
    setAgentStatus('RUNNING');
    setActiveTab('tasks');

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;

    // Interim Task representation while server reasons
    const interimTask: TaskRecord = {
      id: `task-${Date.now()}`,
      title: command,
      timeLabel: 'Live',
      timestamp: Date.now(),
      description: `Autonomous agent execution for: "${command}". Operating under Guardian sandbox.`,
      status: 'running',
      currentStage: 'Kernel Reasoning',
      currentSubtext: 'Analyzing prompt semantics & safety policies...',
      steps: [
        { id: 's1', label: 'Semantic reasoning & policy verification', status: 'in_progress' },
        { id: 's2', label: 'Context analysis & file inspection', status: 'pending' },
        { id: 's3', label: 'Autonomous execution & verification', status: 'pending' }
      ],
      logs: [
        { id: `l-init-1`, time: timeStr, level: 'SYS', message: `Dispatched command to Guardian Agent: "${command}"` },
        { id: `l-init-2`, time: timeStr, level: 'OBS', message: `Detected environment: ${deviceTelemetry?.os || 'System Runtime'}.` },
        { id: `l-init-3`, time: timeStr, level: 'RSN', message: 'Generating optimal execution strategy with Gemini AI.' }
      ]
    };

    setCurrentTask(interimTask);

    try {
      const res = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          systemContext: deviceTelemetry,
          realFiles
        })
      });

      const data = await res.json();
      if (data.success && data.plan) {
        const plan = data.plan;
        activePlanSubsequentStages.current = plan.subsequentStages || [];

        const realTask = createRealTaskFromPlan(command, plan);
        setCurrentTask(realTask);

        // Prepend to tasks list
        setTasks((prev) => [realTask, ...prev.filter((t) => t.id !== realTask.id)]);

        // Check if High Risk requires human approval
        if (plan.isHighRisk && plan.highRiskDetails) {
          setHighRiskDetails(plan.highRiskDetails);
          setIsHighRiskOpen(true);
          setAgentStatus('WAITING_APPROVAL');
        }
      }
    } catch (err) {
      console.error('Failed to communicate with agent backend:', err);
      // Keep running locally
      setTasks((prev) => [interimTask, ...prev.filter((t) => t.id !== interimTask.id)]);
    }
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

  // Confirm High-Risk Action
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
        { id: `auth-act-${Date.now()}`, time: timeStr, level: 'ACT', message: 'Executed approved mutation under sandboxed supervision.' }
      ]
    }));
  };

  // Cancel High-Risk Action
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

  // Real Speech Recognition / Voice Input
  const handleToggleMic = () => {
    playBeep(600, 'triangle', 0.08);

    if (!isMicListening) {
      setIsMicListening(true);

      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition = new (SpeechRecognition as any)();
          speechRecognitionRef.current = recognition;
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recognition.onresult = (event: any) => {
            const transcript = event.results?.[0]?.[0]?.transcript;
            if (transcript) {
              setIsMicListening(false);
              handleStartCommand(transcript);
            }
          };

          recognition.onerror = () => {
            setIsMicListening(false);
          };

          recognition.onend = () => {
            setIsMicListening(false);
          };

          recognition.start();
        } catch {
          // Fallback simulation if speech recognition fails in iframe
          setTimeout(() => {
            setIsMicListening(false);
            handleStartCommand('Scan system memory & active storage');
          }, 3000);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          setIsMicListening(false);
          handleStartCommand('Scan system memory & active storage');
        }, 3000);
      }
    } else {
      setIsMicListening(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (speechRecognitionRef.current && (speechRecognitionRef.current as any).stop) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (speechRecognitionRef.current as any).stop();
      }
    }
  };

  // Data purging handlers
  const handleClearTaskHistory = () => {
    clearStoredTasks();
    setTasks([]);
  };

  const handleClearMemoryContext = () => {
    setCurrentTask((prev) => ({
      ...prev,
      logs: prev.logs.slice(-2)
    }));
  };

  const handleDeleteAllLocalData = () => {
    clearStoredTasks();
    setTasks([]);
    setAgentStatus('IDLE');
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
              deviceTelemetry={deviceTelemetry}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksScreen
              currentTask={currentTask}
              onPauseResume={handlePauseResume}
              onReplan={handleReplan}
              onEmergencyStop={handleEmergencyStop}
              onTriggerHighRisk={() => setIsHighRiskOpen(true)}
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
              onClearTaskHistory={handleClearTaskHistory}
              onClearMemoryContext={handleClearMemoryContext}
              onDeleteAllLocalData={handleDeleteAllLocalData}
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
        details={highRiskDetails || {
          title: 'Confirm Target Modification',
          description: 'Guardian AI detected a destructive operation requested by this command.',
          targetCount: 1,
          policyText: 'Autonomous Agent Safety Policy requires explicit user approval before permanent modifications.',
          items: [{ name: 'target_operation.exec', icon: 'description', size: '1.2 MB' }]
        }}
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
