export type TabType = 'landing' | 'home' | 'tasks' | 'privacy' | 'settings';

export type AgentStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'WAITING_APPROVAL' | 'COMPLETED' | 'ERROR';

export type LogLevel = 'SYS' | 'ACT' | 'OBS' | 'RSN' | 'WRN' | 'ERR';

export interface LogItem {
  id: string;
  time: string;
  level: LogLevel;
  message: string;
}

export interface TaskStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface TaskRecord {
  id: string;
  title: string;
  timeLabel: string;
  timestamp: number;
  description: string;
  status: 'completed' | 'running' | 'paused' | 'failed';
  steps: TaskStep[];
  currentStage: string;
  currentSubtext: string;
  logs: LogItem[];
  highRiskTriggered?: boolean;
}

export interface HighRiskDetails {
  title: string;
  description: string;
  targetCount: number;
  items: {
    name: string;
    icon: string;
    size?: string;
  }[];
  policyText: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'allowed' | 'not_allowed' | 'not_connected';
  canToggle: boolean;
}

export interface SecurityOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentOptions {
  autonomousMode: boolean;
  stepConfirmation: boolean;
  screenInspectionRate: '1fps' | '2fps' | '5fps';
  riskTolerance: 'strict' | 'moderate' | 'permissive';
  localModelOnly: boolean;
}
