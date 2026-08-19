import { PermissionItem } from '../types';

export interface DeviceTelemetry {
  os: string;
  isAndroid: boolean;
  cpuCores: number;
  memoryGb?: number;
  screenRes: string;
  pixelRatio: number;
  batteryLevel: number;
  isCharging: boolean;
  isOnline: boolean;
  effectiveType?: string;
  downlinkSpeed?: number;
  storageUsedMb: number;
  storageTotalMb: number;
  storagePercent: number;
  micPermission: 'allowed' | 'not_allowed' | 'not_connected';
  notificationPermission: 'allowed' | 'not_allowed' | 'not_connected';
}

export async function detectRealDeviceTelemetry(): Promise<DeviceTelemetry> {
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  let os = 'Android 14 (AOSP Runtime)';
  if (/Windows/i.test(ua)) os = 'Windows (Android Subsystem / Dev Environment)';
  else if (/Macintosh/i.test(ua)) os = 'macOS (Android Emulation Environment)';
  else if (/Linux/i.test(ua) && !isAndroid) os = 'Linux Enterprise Workstation';

  const cpuCores = navigator.hardwareConcurrency || 8;
  const memoryGb = (navigator as unknown as { deviceMemory?: number }).deviceMemory;

  // Real Screen Resolution
  const screenRes = `${window.screen.width} × ${window.screen.height}`;
  const pixelRatio = window.devicePixelRatio || 1;

  // Real Battery
  let batteryLevel = 85;
  let isCharging = false;
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean }> }).getBattery();
      batteryLevel = Math.round(battery.level * 100);
      isCharging = battery.charging;
    }
  } catch {
    // Battery API might not be supported or restricted in some iframe contexts
  }

  // Real Network
  const isOnline = navigator.onLine;
  const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
  const effectiveType = conn?.effectiveType || (isOnline ? '4G/Wi-Fi' : 'Offline');
  const downlinkSpeed = conn?.downlink;

  // Real Storage Quota
  let storageUsedMb = 24.5;
  let storageTotalMb = 5120;
  let storagePercent = 1;
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage !== undefined && estimate.quota !== undefined) {
        storageUsedMb = Math.round((estimate.usage / (1024 * 1024)) * 10) / 10;
        storageTotalMb = Math.round((estimate.quota / (1024 * 1024)) * 10) / 10;
        storagePercent = Math.min(100, Math.round((estimate.usage / estimate.quota) * 100));
      }
    }
  } catch {
    // Fallback
  }

  // Real Permissions
  let micPermission: 'allowed' | 'not_allowed' | 'not_connected' = 'not_connected';
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const micStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      micPermission = micStatus.state === 'granted' ? 'allowed' : micStatus.state === 'denied' ? 'not_allowed' : 'not_connected';
    }
  } catch {
    // fallback
  }

  let notificationPermission: 'allowed' | 'not_allowed' | 'not_connected' = 'not_connected';
  if ('Notification' in window) {
    if (Notification.permission === 'granted') notificationPermission = 'allowed';
    else if (Notification.permission === 'denied') notificationPermission = 'not_allowed';
    else notificationPermission = 'not_connected';
  }

  return {
    os,
    isAndroid,
    cpuCores,
    memoryGb,
    screenRes,
    pixelRatio,
    batteryLevel,
    isCharging,
    isOnline,
    effectiveType,
    downlinkSpeed,
    storageUsedMb,
    storageTotalMb,
    storagePercent,
    micPermission,
    notificationPermission
  };
}

export function buildRealPermissionsList(telemetry: DeviceTelemetry): PermissionItem[] {
  return [
    {
      id: 'p-access',
      name: 'Android Accessibility Service',
      description: 'Used for autonomous UI observation, node tree parsing, and interactive gesture automation.',
      icon: 'accessibility_new',
      status: 'allowed',
      canToggle: true
    },
    {
      id: 'p-notif',
      name: 'Notifications & Alerts',
      description: telemetry.notificationPermission === 'allowed'
        ? 'Real system notification channel active for task alerts and emergency interrupts.'
        : 'Permission needed to dispatch high-risk approval and completed task alerts.',
      icon: 'notifications_active',
      status: telemetry.notificationPermission,
      canToggle: true
    },
    {
      id: 'p-storage',
      name: 'Files & Media Storage',
      description: `Access to local filesystem sandbox (Used: ${telemetry.storageUsedMb} MB / ${telemetry.storageTotalMb} MB quota).`,
      icon: 'folder_open',
      status: 'allowed',
      canToggle: true
    },
    {
      id: 'p-mic',
      name: 'Microphone & Audio Stream',
      description: telemetry.micPermission === 'allowed'
        ? 'Active real-time audio input for hands-free voice intent dictation.'
        : 'Used for speech-to-intent parsing and live voice commands.',
      icon: 'mic',
      status: telemetry.micPermission,
      canToggle: true
    }
  ];
}
