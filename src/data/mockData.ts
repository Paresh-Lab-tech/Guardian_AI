import { TaskRecord, HighRiskDetails, PermissionItem, SecurityOption, AgentOptions } from '../types';

export const INITIAL_TASKS: TaskRecord[] = [
  {
    id: 'task-1',
    title: 'Search AI news',
    timeLabel: '10:42 AM',
    timestamp: Date.now() - 3600000,
    description: 'Compiled daily summary of artificial intelligence breakthroughs and regulatory updates from 5 verified sources.',
    status: 'completed',
    currentStage: 'Completed',
    currentSubtext: 'Daily digest saved to Notes & sent to Slack',
    steps: [
      { id: 's1', label: 'Queried verified tech outlets', status: 'completed' },
      { id: 's2', label: 'Filtered regulatory updates', status: 'completed' },
      { id: 's3', label: 'Synthesized 5-point executive summary', status: 'completed' },
    ],
    logs: [
      { id: 'l1', time: '10:40:01', level: 'SYS', message: 'Initialized background research orchestrator.' },
      { id: 'l2', time: '10:40:12', level: 'ACT', message: 'Queried ArXiv and Reuters tech feeds.' },
      { id: 'l3', time: '10:41:05', level: 'OBS', message: 'Parsed 18 new items, 5 meet relevance threshold.' },
      { id: 'l4', time: '10:41:40', level: 'RSN', message: 'Extracted key safety benchmarks and model releases.' },
      { id: 'l5', time: '10:42:00', level: 'ACT', message: 'Exported summary markdown to Notes.' }
    ]
  },
  {
    id: 'task-2',
    title: 'Organize Downloads',
    timeLabel: '09:15 AM',
    timestamp: Date.now() - 7200000,
    description: 'Sorted 42 files into corresponding project folders. Removed 3 duplicate installers.',
    status: 'completed',
    currentStage: 'Completed',
    currentSubtext: 'Cleaned 1.4 GB disk space',
    steps: [
      { id: 's1', label: 'Analyzed files', status: 'completed' },
      { id: 's2', label: 'Found 32 PDFs', status: 'completed' },
      { id: 's3', label: 'Created folders & organized', status: 'completed' },
    ],
    logs: [
      { id: 'l1', time: '09:12:01', level: 'SYS', message: 'Initializing visual reasoning module.' },
      { id: 'l2', time: '09:12:02', level: 'ACT', message: 'Opened file explorer to /Downloads.' },
      { id: 'l3', time: '09:12:05', level: 'OBS', message: 'Scanning directory contents... 145 items found.' },
      { id: 'l4', time: '09:12:08', level: 'RSN', message: 'Identifying file types. Grouping by extension (.pdf, .jpg, .dmg).' },
      { id: 'l5', time: '09:12:10', level: 'ACT', message: 'Creating folder "PDF_Documents".' }
    ]
  },
  {
    id: 'task-3',
    title: 'Open YouTube',
    timeLabel: 'Yesterday',
    timestamp: Date.now() - 86400000,
    description: 'Launched application and navigated to specified tutorial playlist.',
    status: 'completed',
    currentStage: 'Completed',
    currentSubtext: 'Playback started at timestamp 04:12',
    steps: [
      { id: 's1', label: 'Located YouTube package', status: 'completed' },
      { id: 's2', label: 'Targeted playlist URL', status: 'completed' },
      { id: 's3', label: 'Opened in split-screen mode', status: 'completed' },
    ],
    logs: [
      { id: 'l1', time: '16:20:00', level: 'SYS', message: 'Intent received: launch media target.' },
      { id: 'l2', time: '16:20:02', level: 'ACT', message: 'Broadcast intent com.google.android.youtube.' },
      { id: 'l3', time: '16:20:05', level: 'OBS', message: 'Application active on main display.' }
    ]
  }
];

export const ACTIVE_TASK_TEMPLATE: TaskRecord = {
  id: 'task-active',
  title: 'Organize my Downloads folder',
  timeLabel: 'Live',
  timestamp: Date.now(),
  description: 'Agent is operating visibly. Sensitive screens are being monitored.',
  status: 'running',
  currentStage: 'Observe & Reason',
  currentSubtext: 'Opening Downloads...',
  steps: [
    { id: 's1', label: 'Analyzed files', status: 'completed' },
    { id: 's2', label: 'Found 32 PDFs', status: 'completed' },
    { id: 's3', label: 'Creating folders', status: 'in_progress' }
  ],
  logs: [
    { id: 'l1', time: '12:43:01', level: 'SYS', message: 'Initializing visual reasoning module.' },
    { id: 'l2', time: '12:43:02', level: 'ACT', message: 'Opened file explorer to /Downloads.' },
    { id: 'l3', time: '12:43:05', level: 'OBS', message: 'Scanning directory contents... 145 items found.' },
    { id: 'l4', time: '12:43:08', level: 'RSN', message: 'Identifying file types. Grouping by extension (.pdf, .jpg, .dmg).' },
    { id: 'l5', time: '12:43:10', level: 'ACT', message: 'Creating folder "PDF_Documents".' }
  ],
  highRiskTriggered: false
};

export const HIGH_RISK_MOCK: HighRiskDetails = {
  title: 'Action Required: High-Risk Operation detected.',
  description: 'You are about to delete 17 files from the Downloads folder. This cannot be undone.',
  targetCount: 17,
  items: [
    { name: 'report_q3_final_v2.pdf', icon: 'description', size: '2.4 MB' },
    { name: 'raw_asset_pack.zip', icon: 'folder_zip', size: '148 MB' },
    { name: 'meeting_recording_nov.mp4', icon: 'video_file', size: '320 MB' },
    { name: 'old_backups.tar.gz', icon: 'folder_zip', size: '890 MB' },
    { name: 'temp_installer_build_44.apk', icon: 'android', size: '42 MB' },
    { name: 'debug_dump_crash_2026.log', icon: 'article', size: '15 MB' },
    { name: 'staging_keys_backup.pem', icon: 'key', size: '4 KB' },
    { name: 'invoice_draft_0911.pdf', icon: 'description', size: '1.1 MB' },
    { name: 'dataset_export_cache.csv', icon: 'table_chart', size: '64 MB' }
  ],
  policyText: 'Guardian requires your explicit approval for all high-risk actions.'
};

export const INITIAL_PERMISSIONS: PermissionItem[] = [
  {
    id: 'accessibility',
    name: 'Accessibility',
    description: 'Required to interact with app UI for complex multi-step tasks.',
    icon: 'accessibility_new',
    status: 'not_connected',
    canToggle: false
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Allows the AI to alert you upon task completion or require manual confirmation.',
    icon: 'notifications',
    status: 'allowed',
    canToggle: true
  },
  {
    id: 'files',
    name: 'Files',
    description: 'Needed to process local documents, images, and data sets for summarization or sorting.',
    icon: 'folder',
    status: 'allowed',
    canToggle: true
  },
  {
    id: 'microphone',
    name: 'Microphone',
    description: 'Enable hands-free voice commands and audio dictation workflows.',
    icon: 'mic',
    status: 'not_allowed',
    canToggle: true
  }
];

export const INITIAL_SECURITY_SETTINGS: SecurityOption[] = [
  {
    id: 'sensitive_screen',
    name: 'Sensitive Screen Protection',
    description: 'Blocks recording on financial or password screens.',
    enabled: true
  },
  {
    id: 'high_risk_confirm',
    name: 'High-Risk Confirmation',
    description: 'Require manual OK for payments or deletions.',
    enabled: true
  }
];

export const INITIAL_AGENT_OPTIONS: AgentOptions = {
  autonomousMode: true,
  stepConfirmation: false,
  screenInspectionRate: '2fps',
  riskTolerance: 'strict',
  localModelOnly: false
};

export const SUGGESTED_PROMPTS = [
  'Organize my Downloads folder and group by extension',
  'Summarize today\'s top AI and tech breakthroughs',
  'Check all installed apps for dangerous permissions',
  'Find and delete duplicate screenshot files',
  'Transcribe latest voice memo and draft email'
];
