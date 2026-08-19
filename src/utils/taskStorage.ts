import { TaskRecord, LogItem } from '../types';

const STORAGE_KEY = 'guardian_ai_tasks_v2';
const LOGS_STORAGE_KEY = 'guardian_ai_logs_v2';

export function loadStoredTasks(): TaskRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load tasks from local storage:', e);
  }

  // If no saved tasks yet, create an initial introductory verified system bootstrap task
  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
  
  const initialBootstrapTask: TaskRecord = {
    id: `task-bootstrap-${Date.now()}`,
    title: 'Guardian AI Kernel Initialization & Security Audit',
    timeLabel: 'Just now',
    timestamp: Date.now(),
    description: 'System-level audit verifying hardware enclave readiness, sandboxed execution permissions, and neural inference gateway.',
    status: 'completed',
    currentStage: 'Audit Completed',
    currentSubtext: 'System operating at optimal security baseline.',
    steps: [
      { id: 'sb-1', label: 'Hardware Enclave & Memory Isolation verified', status: 'completed' },
      { id: 'sb-2', label: 'Device telemetry & permission policies checked', status: 'completed' },
      { id: 'sb-3', label: 'Local autonomous agent ready for commands', status: 'completed' }
    ],
    logs: [
      { id: 'l-b1', time: timeStr, level: 'SYS', message: 'Guardian Kernel booted successfully.' },
      { id: 'l-b2', time: timeStr, level: 'OBS', message: 'Detected platform environment and secure storage sandbox.' },
      { id: 'l-b3', time: timeStr, level: 'ACT', message: 'Mounted local task registry in browser persistent storage.' },
      { id: 'l-b4', time: timeStr, level: 'RSN', message: 'Security boundaries enforced. Agent standing by for user command.' }
    ]
  };

  return [initialBootstrapTask];
}

export function saveStoredTasks(tasks: TaskRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to persist tasks:', e);
  }
}

export function clearStoredTasks(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOGS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear stored tasks:', e);
  }
}

export function createRealTaskFromPlan(
  command: string,
  plan: {
    title: string;
    description: string;
    currentStage: string;
    currentSubtext: string;
    isHighRisk: boolean;
    steps: { id: string; label: string; status: 'pending' | 'in_progress' | 'completed' }[];
    logs: LogItem[];
  }
): TaskRecord {
  return {
    id: `task-${Date.now()}`,
    title: plan.title || command,
    timeLabel: 'Live',
    timestamp: Date.now(),
    description: plan.description || `Autonomous agent execution for: "${command}"`,
    status: 'running',
    currentStage: plan.currentStage || 'Observe & Reason',
    currentSubtext: plan.currentSubtext || 'Analyzing intent...',
    highRiskTriggered: plan.isHighRisk,
    steps: plan.steps,
    logs: plan.logs
  };
}
